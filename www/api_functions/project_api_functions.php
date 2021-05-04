<?php

require_once "../apis/api_v2.php";
require_once "../utils_v2/mosaic_utils.php";
require_once "../util/export_labels_v2.php";

use phpseclib3\Net\SSH2;

function getMosaics() {
    global $entityManager;

    // get the project these mosaics are in
    $project = $entityManager->getRepository('Project')->findOneBy(array('uuid' => $projectUuid));

    $responseObject = array();

    // get mosaics
    $responseObject["mosaics"] = array();
    foreach ($project->getMosaics() as $mosaic) {
        array_push($responseObject["mosaics"], getMosaicCard($mosaic));
    }

    return responseMessage("SUCCESS", $responseObject);
}

/**
 * This function only initiates the upload;
 * @throws \Doctrine\ORM\ORMException
 */
function createMosaic($uid, $name, $projectUuid, $visible, $filename, $md5Hash, $numberChunks, $sizeBytes) {
    global $entityManager;

    // get the project to place this mosaic in
    $existingProj=$entityManager->getRepository('Project')
        ->findOneBy(array('uuid' => $projectUuid));

    $filename = str_replace(" ", "_", $filename);

    // check for malformed filename
    if (!preg_match("/^[a-zA-Z0-9_.-]*$/", $filename)) {
        error_log("ERROR! malformed filename");
        return responseMessage("FAILURE" ,"The filename was malformed. Filenames must only contain letters, numbers, dashes ('-'), underscores ('_') and periods.");
    }

    // options:
    //  1. file does not exist, insert into database -- start upload
    //  TODO 2. file does exist and has not finished uploading -- restart upload
    //  TODO 3. file does exist and has finished uploading -- report finished
    //  4. file does exist but with different hash -- error message

    $query = "SELECT md5_hash, number_chunks, uploaded_chunks, chunk_status, status FROM mosaics WHERE filename = '$filename' AND owner_id = 'uid'";
    error_log($query);
    $result = query_our_db($query);
    $row = $result->fetch_assoc();
    if ($row == NULL) {
        //  1. file does not exist, insert into database -- start upload
        $chunk_status = str_repeat('0', $numberChunks);

        // create the new mosaic
        $newMosaic = new Mosaic();
        $newMosaic->setIdentifier($name);
        $newMosaic->setFilename($filename);
        $newMosaic->setVisible(true);
        $newMosaic->setMembers($visible);
        $newMosaic->setRoles(true);
        $newMosaic->setProject($existingProj);
        $newMosaic->setOwnerId($uid);
        $newMosaic->setNumberChunks($numberChunks);
        $newMosaic->setUploadedChunks(0);
        $newMosaic->setChunkStatus($chunk_status);
        $newMosaic->setSizeBytes($sizeBytes);
        $newMosaic->setBytesUploaded(0);
        $newMosaic->setMd5Hash($md5Hash);
        $newMosaic->setTilingProgress(0);
        $newMosaic->setStatus("UPLOADING");
        $newMosaic->setHeight(0);
        $newMosaic->setWidth(0);
        $newMosaic->setChannels(0);
        $newMosaic->setGeotiff(0);
        $newMosaic->setCoordinateSystem("");
        $newMosaic->setMetadata("");
        $newMosaic->setImageMetadata("");
        $newMosaic->setBands("");

        $entityManager->persist($newMosaic);
        $entityManager->flush();

        $responseObject = array();
        $responseObject['mosaic_info'] = getMosaicInfo($uid, $md5Hash);

        return responseMessage("SUCCESS", $responseObject);

    } else {

        $dbMd5Hash = $row['md5_hash'];
        error_log($dbMd5Hash);
        error_log($md5Hash);
        if ($dbMd5Hash != $md5Hash) {
            //  4. file does exist but with different hash -- error message
            error_log("ERROR! File with same name exists");
            return responseMessage("FAILURE", "A file with the same name has already been uploaded with a different md5_hash (the file names are the same but the contents are different).  Either rename the new file you would like to upload, or delete the already existing file and retry the upload of the new file.");

        } else {
            error_log("ERROR! File with same hash exists");
            return responseMessage("FAILURE", "This file has already been uploaded.");
        }
    }
}

function submitTrainingJob($mosaicUuids, $modelWidth, $modelHeight, $strideLength, $ratio, $modelName, $continueFromCheckpoint) {
    global $entityManager, $UPLOAD_DIRECTORY, $SHARED_DRIVE_DIRECTORY, $our_cluster_server, $our_cluster_username, $our_cluster_password;

    // make a new model
    $model = new Model();
    $modelUuid = $model->getUuid();

    // make the directory in the shared drive where this model's training images will be stored
    $modelInputDir = "$SHARED_DRIVE_DIRECTORY/training_images/$modelUuid";
    if (is_dir($modelInputDir)) {
        rmdir($modelInputDir);
    }
    mkdir($modelInputDir, 0777, true);

    // iterate over the UUIDS of the mosaics to train on
    foreach ($mosaicUuids as $mosaicUuid) {

        // get the mosaic
        $mosaic = $entityManager->getRepository('Mosaic')
            ->findOneBy(array('uuid' => $mosaicUuid));
        $mosaicId = $mosaic->getId();

        // get all the distinct labels of the annotations for this mosaic
        $mosaicLabelIds = array();
        $query = "SELECT DISTINCT label_id FROM rectangles WHERE mosaic_id = $mosaicId;";
        $result = query_our_db($query);
        while ($row = $result->fetch_assoc()) {
            array_push($mosaicLabelIds, $row["label_id"]);
        }

        // create the directory for the input for this mosaic
        $modelInputMosaicDir = "$modelInputDir/$mosaicId";
        if (is_dir($modelInputMosaicDir)) {
            rmdir($modelInputMosaicDir);
        }
        mkdir($modelInputMosaicDir);

        // copy the mosaic image into the shared drive
        $mosaicFilename = $mosaic->getFilename();
        $mosaicOwnerId = $mosaic->getOwnerId();
        $mosaic_image_path = "$UPLOAD_DIRECTORY/$mosaicOwnerId/$mosaicFilename";
        if (!copy($mosaic_image_path, "$modelInputMosaicDir/$mosaicFilename")) {
            error_log("failed to copy $mosaic_image_path...\n");
        }

        // copy all the annotations for each label for this mosaic to a CSV on the shared drive
        foreach ($mosaicLabelIds as $labelId) {
            // create the file for this label for this mosaic
            $csvContents = exportRectangles($entityManager, $labelId, "PIXEL", $mosaicUuid);
            $labelCsvPath = "$modelInputMosaicDir/$labelId.csv";
            $csvFile = fopen($labelCsvPath, "w");
            fwrite($csvFile, $csvContents);
            fclose($csvFile);
        }
    }

    // produce the commands with all the fields

    $modelUuidCommand = "--modelUuid $modelUuid";

    // crop phase
    $dataDirCommand = "--data_dir '{$modelInputDir}'";
    $modelWidthCommand = "--model_width {$modelWidth}";
    $modelHeightCommand = "--model_height {$modelHeight}";
    $strideLengthCommand = "--stride_length {$strideLength}";
    $ratioCommand = "--ratio {$ratio}";
    $allCropCommands = "--crop_args \"" . implode(" ", array(
            $modelUuidCommand,
            $dataDirCommand, $modelWidthCommand, $modelWidthCommand, $modelHeightCommand, $strideLengthCommand, $ratioCommand,
        )) . "\"";
    // train phase
    $modelNameCommand = "--model_name {$modelName}";
    $continueFromCheckpointCommand = "--continue_from_checkpoint {$continueFromCheckpoint}";
    $allTrainCommands = "--train_args \"" . implode(" ", array(
            $modelUuidCommand,
            $modelNameCommand, $continueFromCheckpointCommand
        )) . "\"";

    $allCommands = implode(" ", array($allCropCommands, $allTrainCommands));
    $command = "ourepository/AI/our_prototype.sh {$allCommands}";
    error_log($command);

//    $ssh = new SSH2($our_cluster_server);
//    if (!$ssh->login($our_cluster_username, $our_cluster_password)) {
//        exit('Login Failed');
//    }
//
//    error_log($ssh->exec($command));

    return responseMessage("SUCCESS", "");
}
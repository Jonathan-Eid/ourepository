<?php

require_once("../../db/my_query.php");
require_once "export_labels_v2.php";

use phpseclib3\Net\SSH2;

function submitTrainingJob($mosaicUuids, $modelWidth, $modelHeight, $strideLength, $ratio, $modelName, $continueFromCheckpoint) {
    global $entityManager, $UPLOAD_DIRECTORY, $SHARED_DRIVE_DIRECTORY;

    // make a new model
    $model = new Model();
    $modelUuid = $model->getUuid();

    // make the directory in the shared drive where this model's training images will be stored
    $modelInputDir = "$SHARED_DRIVE_DIRECTORY/training_images/$modelUuid";
    if (is_dir($modelInputDir)) {
        rmdir($modelInputDir);
    }
    mkdir($modelInputDir, 0777, true);

    foreach ($mosaicUuids as $mosaicUuid) {
        $mosaic = $entityManager->getRepository('Mosaic')
            ->findOneBy(array('uuid' => $mosaicUuid));
        $mosaicId = $mosaic->getId();

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
    $command = "sbatch ourepository/AI/our_prototype.sh {$allCommands}";
    error_log($command);

    //$ssh = new SSH2($our_cluster_server);
    //if (!$ssh->login($our_cluster_username, $our_cluster_password)) {
    //    exit('Login Failed');
    //}
    //
    //echo $ssh->exec($command);
}

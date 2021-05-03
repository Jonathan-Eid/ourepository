<?php

$cwd[__FILE__] = __FILE__;
if (is_link($cwd[__FILE__])) $cwd[__FILE__] = readlink($cwd[__FILE__]);
$cwd[__FILE__] = dirname($cwd[__FILE__]);

require_once($cwd[__FILE__] . "/../../db/my_query.php");
//require_once($cwd[__FILE__] . "/../../Mustache.php/src/Mustache/Autoloader.php");
//Mustache_Autoloader::register();

require_once "../bootstrap.php";
require_once "export_labels_v2.php";

use phpseclib3\Net\SSH2;

function get_predictions($user_id, $job_id, $mosaic_id, $label_id) {
    global $our_db, $cwd;

    $prediction_query = "SELECT * FROM prediction WHERE owner_id = $user_id AND job_id = $job_id AND mosaic_id = $mosaic_id AND label_id = $label_id";
    $prediction_result = query_our_db($prediction_query);

    $label_query = "SELECT label_type FROM labels WHERE label_id = $label_id";
    $label_result = query_our_db($label_query);
    $label_row = $label_result->fetch_assoc();
    $label_type = $label_row['label_type'];

    $mark_counts = 0;

    $predictions = array();
    $mark_attributes = array();
    while (($p_row = $prediction_result->fetch_assoc()) != NULL) {
        $mark_id = $p_row['mark_id'];

        if ($label_type == "POINT") {
            $point_query = "SELECT cx, cy FROM points WHERE point_id = $mark_id";
            $point_result = query_our_db($point_query);
            $point_row = $point_result->fetch_assoc();
            $p_row['cx'] = $point_row['cx'];
            $p_row['cy'] = $point_row['cy'];

            $p_row['prediction'] = 1.0 - $p_row['prediction'];

        } else if ($label_type == "LINE") {
            $line_query = "SELECT x1, x2, y1, y2 FROM `lines` WHERE line_id = $mark_id";
            $line_result = query_our_db($line_query);
            $line_row = $line_result->fetch_assoc();
            $p_row['x1'] = $line_row['x1'];
            $p_row['x2'] = $line_row['x2'];
            $p_row['y1'] = $line_row['y1'];
            $p_row['y2'] = $line_row['y2'];

        }

        $predictions[] = $p_row;

        $mark_attributes[$mark_id] = array();

        $mark_query = "SELECT * from mark_attributes WHERE mark_id = $mark_id";
        $mark_result = query_our_db($mark_query);

        while (($m_row = $mark_result->fetch_assoc()) != NULL) {
            $mark_attributes[$mark_id][] = $m_row;
            $mark_counts = $mark_counts + 1;
        }
    }

    $response['predictions'] = $predictions;
    $response['mark_attributes'] = $mark_attributes;

    if ($mark_counts > 0) $response['has_mark_attributes'] = true;
    else $response['has_mark_attributes'] = false;

    echo json_encode($response);
}

function submit_training_job($entityManager) {
    global $UPLOAD_DIRECTORY, $SHARED_DRIVE_DIRECTORY;

    // make a new model
    $model = new Model();
    $modelUuid = $model->getUuid();

    // make the directory in the shared drive where this model's training images will be stored
    $model_input_dir = "$SHARED_DRIVE_DIRECTORY/training_images/$modelUuid";
    if (is_dir($model_input_dir)) {
        rmdir($model_input_dir);
    }
    mkdir($model_input_dir, 0777, true);

    //// make the directory where the input to train this model will be stored
    //$model_input_dir = "$model_dir/training_images";
    //if (is_dir($model_input_dir)) {
    //    rmdir($model_input_dir);
    //}
    //mkdir($model_input_dir);

    // get the mosaicUuids to train on
    $mosaicUuids = explode(",", $_POST["mosaicUuids"]);

    foreach ($mosaicUuids as $mosaicUuid) {
        $mosaic = $entityManager->getRepository('Mosaic')
            ->findOneBy(array('uuid' => $mosaicUuid));
        $mosaic_id = $mosaic->getId();

        $mosaic_label_ids = array();
        $query = "SELECT DISTINCT label_id FROM rectangles WHERE mosaic_id = $mosaic_id;";
        $result = query_our_db($query);
        while ($row = $result->fetch_assoc()) {
            array_push($mosaic_label_ids, $row["label_id"]);
        }

        // create the directory for the input for this mosaic
        $model_input_mosaic_dir = "$model_input_dir/$mosaic_id";
        if (is_dir($model_input_mosaic_dir)) {
            rmdir($model_input_mosaic_dir);
        }
        mkdir($model_input_mosaic_dir);

        // copy the mosaic image into the shared drive
        $mosaic_filename = $mosaic->getFilename();
        $mosaic_owner_id = $mosaic->getOwnerId();
        $mosaic_image_path = "$UPLOAD_DIRECTORY/$mosaic_owner_id/$mosaic_filename";
        if (!copy($mosaic_image_path, "$model_input_mosaic_dir/$mosaic_filename")) {
            error_log("failed to copy $mosaic_image_path...\n");
        }

        foreach ($mosaic_label_ids as $label_id) {
            // create the file for this label for this mosaic
            $csv_contents = export_rectangles($entityManager, $label_id, "PIXEL", $mosaicUuid);
            $label_csv_path = "$model_input_mosaic_dir/$label_id.csv";
            $csv_file = fopen($label_csv_path, "w");
            fwrite($csv_file, $csv_contents);
            fclose($csv_file);
        }
    }


//    // Get the organization, project, and mosaic IDs
//    // These are used for organizing the shared drive filesystem.
//    $organizationId = $entityManager->getRepository('Organization')
//        ->findOneBy(array('uuid' => $_POST['organizationId']))->getId();
////    $projectId = $entityManager->getRepository('Project')
////        ->findOneBy(array('name' => $_POST['projectName']))->getId();
//    $mosaicId = $_POST['mosaicId'];


    // produce the commands with all the fields

//    $organizationIdCommand = "--organization_id $organizationId";
////    $projectIdCommand = "--project_id $projectId";
    $modelUuidCommand = "--modelUuid $modelUuid";

    // crop phase
    $dataDirCommand = "--data_dir \"{$model_input_dir}\"";
    $modelWidthCommand = "--model_width {$_POST['modelWidth']}";
    $modelHeightCommand = "--model_height {$_POST['modelHeight']}";
    $strideLengthCommand = "--stride_length {$_POST['strideLength']}";
    $ratioCommand = "--ratio {$_POST['ratio']}";
    $allCropCommands = "--crop_args \"" . implode(" ", array(
            $modelUuidCommand,
            $dataDirCommand, $modelWidthCommand, $modelWidthCommand, $modelHeightCommand, $strideLengthCommand, $ratioCommand,
        )) . "\"";
    // train phase
    $modelNameCommand = "--model_name {$_POST['modelName']}";
    $continueFromCheckpointCommand = "--continue_from_checkpoint {$_POST['continueFromCheckpoint']}";
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

?>

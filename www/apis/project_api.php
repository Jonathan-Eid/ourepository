<?php

require_once "api_v2.php";
require_once "../api_functions/project_api_functions.php";

/**
 * @throws \Doctrine\ORM\ORMException
 */
function handleProjectRequest($request_type) {
    
    switch ($request_type) {

        case "GET_MOSAICS":
            if (!enforceAuth()) return;

            $projectUuid = $_GET['projectUuid'];

            $response = getMosaics($projectUuid);
            echo $response;
            break;

        case "CREATE_MOSAIC":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            $mosaicName = $_POST['mosaicName'];
            $projectUuid = $_POST['projectUuid'];
            $filename = $_POST['filename'];
            $md5Hash = $_POST['md5Hash'];
            $numberChunks = $_POST['numberChunks'];
            $sizeBytes = $_POST['sizeBytes'];

            $response = createMosaic($uid, $mosaicName, $projectUuid, $filename, $md5Hash, $numberChunks, $sizeBytes);
            echo $response;
            break;

        case "SUBMIT_TRAINING_JOB":
            if (!enforceAuth()) return;

            // crop phase
            $mosaicUuids = explode(",", $_POST["mosaicUuids"]);
            $modelWidth = $_POST['modelWidth'];
            $modelHeight = $_POST['modelHeight'];
            $strideLength = $_POST['strideLength'];
            $ratio = $_POST['ratio'];

            // train phase
            $modelName = $_POST['modelName'];
            $continueFromCheckpoint = $_POST['continueFromCheckpoint'];

            $response = submitTrainingJob($mosaicUuids, $modelWidth, $modelHeight, $strideLength, $ratio, $modelName, $continueFromCheckpoint);
            echo $response;
            break;
    }
}
<?php

require_once "api_v2.php";

function handleProjectRequest($request_type) {

    global $entityManager;

    switch ($request_type) {

        case "GET_MOSAICS":
            if (!enforceAuth()) return;

            $projectUuid = $_GET['projectUuid'];

            try {
                $project = $entityManager->getRepository('Project')->findOneBy(array('uuid' => $projectUuid));

                $response = array();

                // get mosaics
                $response["mosaics"] = array();
                foreach ($project->getMosaics() as $mosaic) {
                    array_push($response["mosaics"], getMosaicCard($mosaic));
                }

                echo responseMessage("MOSAICS_RECEIVED", $response);
            } catch (Throwable $t) {
                error_log($t->getMessage());
                echo responseMessage("ERROR", "something went wrong");
            }

            break;

        case "CREATE_MOSAIC":
            if (!enforceAuth()) return;

            try {
                global $our_db;
                $uid = $_SESSION['uid'];
                $name = $_POST['name'];
                $projectUuid = $our_db->real_escape_string($_POST['projectUuid']);
                $visible = $our_db->real_escape_string($_POST['visible']);
                $filename = $our_db->real_escape_string($_POST['filename']);
                $md5Hash = $our_db->real_escape_string($_POST['md5Hash']);
                $numberChunks = $our_db->real_escape_string($_POST['numberChunks']);
                $sizeBytes = $our_db->real_escape_string($_POST['sizeBytes']);

                initiateUpload($uid, $name, $projectUuid, $visible, $filename, $md5Hash, $numberChunks, $sizeBytes);
            } catch (Exception $e) {
                echo json_encode("error in creating mosaic");
                echo 'Caught exception: ', $e->getMessage(), "\n";
            }

            break;

        case "SUBMIT_TRAINING_JOB":
            if (!enforceAuth()) return;

            try {
                // crop phase
                $mosaicUuids = explode(",", $_POST["mosaicUuids"]);
                $modelWidth = $_POST['modelWidth'];
                $modelHeight = $_POST['modelHeight'];
                $strideLength = $_POST['strideLength'];
                $ratio = $_POST['ratio'];

                // train phase
                $modelName = $_POST['modelName'];
                $continueFromCheckpoint = $_POST['continueFromCheckpoint'];

                submitTrainingJob($mosaicUuids, $modelWidth, $modelHeight, $strideLength, $ratio, $modelName, $continueFromCheckpoint);
                echo responseMessage("SUBMIT_TRAINING_JOB_SUCCESS", "successfully submitted training job");
            } catch (Exception $e) {
                echo responseMessage("SUBMIT_TRAINING_JOB_FAILURE", "failed to submit training job");
                echo 'Caught exception: ', $e->getMessage(), "\n";
            }

            break;
    }
}
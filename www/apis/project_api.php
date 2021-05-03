<?php

require_once "api_v2.php";
require_once "../bootstrap.php";

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

                echo rsp_msg("MOSAICS_RECEIVED", $response);
            } catch (Exception $e) {
                echo 'Caught exception: ', $e->getMessage(), "\n";
            }

            break;

        case "CREATE_MOSAIC":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            try {
                initiate_upload($uid, $entityManager);
            } catch (Exception $e) {
                echo json_encode("error in creating mosaic");
                echo 'Caught exception: ', $e->getMessage(), "\n";
            }

            break;

        case "SUBMIT_TRAINING_JOB":
            if (!enforceAuth()) return;

            try {
                submit_training_job($entityManager);
                echo rsp_msg("SUBMIT_TRAINING_JOB_SUCCESS", "successfully submitted training job");
            } catch (Exception $e) {
                echo rsp_msg("SUBMIT_TRAINING_JOB_FAILURE", "failed to submit training job");
                echo 'Caught exception: ', $e->getMessage(), "\n";
            }

            break;
    }
}
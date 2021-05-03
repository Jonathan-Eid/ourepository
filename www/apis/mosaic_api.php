<?php

require_once "api_v2.php";
require_once "../bootstrap.php";

function handleMosaicRequest($request_type) {

    global $entityManager;

    switch ($request_type) {

        case "UPLOAD_CHUNK":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            process_chunk($uid);

            break;

        case "GET_MOSAIC":
            if (!enforceAuth()) return;

            $mosaicUuid = $_GET['mosaicUuid'];

            try {
                $response = getMosaic($entityManager, $mosaicUuid);
                echo rsp_msg("MOSAIC_RECEIVED", $response);
            } catch (Exception $e) {
                echo rsp_msg("MOSAIC_RECEIVED_FAILED", "failed to retrieve mosaic data");
                echo 'Caught exception: ',  $e->getMessage(), "\n";
            }

            break;

        case "UPLOAD_ANNOTATION_CSV":
            if (!enforceAuth()) return;

            try {
                upload_annotation_csv($entityManager);
                echo rsp_msg("ANNOTATION_CSV_UPLOADED", "CSV containing annotations successfully uploaded");
            } catch (Exception $e) {
                echo rsp_msg("ANNOTATION_CSV_UPLOADED_FAILED", "failed to upload CSV with annotations");
                echo 'Caught exception: ',  $e->getMessage(), "\n";
            }

            break;

        case "EXPORT_LABEL_CSV":
            if (!enforceAuth()) return;

            $label_id = 1;
            $export_type = "RECTANGLES";
            $coord_type = "PIXEL";

            error_log("exporting label csv!");

            // get the mosaic that these annotations are for
            $mosaicUuid = $_GET['mosaicUuid'];

            try {
                $csv_contents = array();
                if ($export_type == "POLYGONS") {
//            export_polygons($label_id, $mosaic_id, $coord_type);
                } else if ($export_type == "RECTANGLES") {
                    $csv_contents = export_rectangles($entityManager, $label_id, $coord_type, $mosaicUuid);
                } else if ($export_type == "LINES") {
//            export_lines($label_id, $mosaic_id, $coord_type);
                } else if ($export_type == "POINTS") {
//            export_points($label_id, $mosaic_id, $coord_type);
                }

                $response = array();
                $response["csv_contents"] = $csv_contents;
                echo rsp_msg("EXPORT_RECTANGLES_SUCCESS", $response);
            } catch (Exception $e) {
                echo rsp_msg("EXPORT_RECTANGLES_FAILURE", "failed to upload CSV with annotations");
                echo 'Caught exception: ',  $e->getMessage(), "\n";
            }

            break;

        case "INFERENCE_MOSAIC":
            if (!enforceAuth()) return;

            echo rsp_msg("PLACEHOLDER","lorem ipsum");

            break;
    }
}
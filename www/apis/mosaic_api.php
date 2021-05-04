<?php

require_once "api_v2.php";
require_once "../api_functions/mosaic_api_functions.php";

function handleMosaicRequest($request_type) {

    switch ($request_type) {

        case "UPLOAD_CHUNK":
            if (!enforceAuth()) return;

            $uid = $_SESSION['uid'];
            $identifier = $_POST['identifier'];
            $md5Hash = $_POST['md5Hash'];
            $chunk = $_POST['chunk'];

            $response = processChunk($uid, $identifier, $md5Hash, $chunk);
            echo $response;
            break;

        case "GET_MOSAIC":
            if (!enforceAuth()) return;

            $mosaicUuid = $_GET['mosaicUuid'];

            $response = getMosaic($mosaicUuid);
            echo $response;
            break;

        case "UPLOAD_ANNOTATION_CSV":
            if (!enforceAuth()) return;

            $mosaicUuid = $_POST['mosaicUuid'];

            $response = getMosaic($mosaicUuid);
            echo $response;
            break;

        case "EXPORT_LABEL_CSV":
            if (!enforceAuth()) return;

            $mosaicUuid = $_GET['mosaicUuid'];

            $response = exportLabelCsv($mosaicUuid);
            echo $response;
            break;

        case "INFERENCE_MOSAIC":
            if (!enforceAuth()) return;

            echo responseMessage("PLACEHOLDER", "lorem ipsum");
            break;
    }
}
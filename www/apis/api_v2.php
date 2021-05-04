<?php
session_start();

if (!isset($_SESSION["count"])) {
    $_SESSION["count"] = 0;
} else {
    $_SESSION["count"] = $_SESSION["count"] + 1;
}

$secret_key = "test_secret";

header("Access-Control-Allow-Origin: " . "http://" . getenv("REACT_DOMAIN") . ":" . getenv("REACT_PORT"));
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 1000");
header("Access-Control-Allow-Headers: alg, X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding,xhrfields,crossdomain");
header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE");

require_once "mosaic_api.php";
require_once "organization_api.php";
require_once "project_api.php";
require_once "user_api.php";
require_once "../bootstrap.php";
require_once "../util/upload_2.php";
require_once "../util/mosaics_v2.php";
require_once "../util/export_labels_v2.php";
require_once "../util/predictions.php";
require_once "../util/permissions.php";

global $entityManager;

foreach ($_FILES as $file) {
    error_log("file: " . json_encode($file));
}

foreach ($_GET as $key => $value) {
    error_log("_GET['$key']: '$value'");
}

foreach ($_POST as $key => $value) {
    error_log("_POST['$key']: '$value'");
}

// Get $id_token via HTTPS POST.
if (isset($_POST['request'])) {
    $request_type = $_POST['request'];

} else if (isset($_GET['request'])) {

    $request_type = $_GET['request'];

} else {

    return;
}

try {
    handleMosaicRequest($request_type);
    handleOrganizationRequest($request_type);
    handleProjectRequest($request_type);
    handleUserRequest($request_type);
} catch (Throwable $t) {
    error_log($t->getMessage());
    echo responseMessage("ERROR", "something went wrong");
}

function responseMessage($code, $message) {
    return json_encode(["code" => $code, "message" => $message]);
}

function enforceAuth(): bool {
    if ($_SESSION["id"] != session_id()) {
        echo json_encode("USER NOT AUTHENTICATED");
        return false;
    }
    return true;
}

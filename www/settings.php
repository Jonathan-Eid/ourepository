<?php
$CLIENT_ID = "345";
$BASE_DIRECTORY = dirname(__FILE__);
$UPLOAD_DIRECTORY = dirname(__FILE__)."/mosaic_uploads";
$ARCHIVE_DIRECTORY = dirname(__FILE__)."/mosaics";
$SHARED_DRIVE_DIRECTORY = dirname(__FILE__)."/shared_drive";
if (!file_exists($SHARED_DRIVE_DIRECTORY)) {
    mkdir($SHARED_DRIVE_DIRECTORY);
}
?>
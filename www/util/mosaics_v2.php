<?php

$cwd[__FILE__] = __FILE__;
if (is_link($cwd[__FILE__])) $cwd[__FILE__] = readlink($cwd[__FILE__]);
$cwd[__FILE__] = dirname($cwd[__FILE__]);

require_once "../../db/my_query.php";
require_once "upload_2.php"; //for rrmdir
require_once "../marks.php"; //for create_polygon_points
require_once "../settings.php"; //for mosaic directories
require_once "../Mustache.php/src/Mustache/Autoloader.php";

function getMosaicCard($mosaic) {
    // return information about the mosaic to display a card
    $mosaicInfo = array();
    $mosaicInfo = array_merge($mosaicInfo, $mosaic->jsonSerialize());

    $mosaicInfo['uuid'] = $mosaic->getUuid();

    // filenames
    $mosaicOwnerId = $mosaic->getOwnerId();
    $filename = $mosaic->getFilename();
    $filenameBase = substr($filename, 0, strrpos($filename, "."));
    $thumbnailFilename = "mosaics/{$mosaicOwnerId}/{$filenameBase}_thumbnail.png";
    $mosaicInfo['thumbnail'] = $thumbnailFilename;
    $previewFilename = "mosaics/{$mosaicOwnerId}/{$filenameBase}_preview.png";
    $mosaicInfo['preview'] = $previewFilename;

    return $mosaicInfo;
}

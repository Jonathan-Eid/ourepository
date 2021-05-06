<?php

require_once "../apis/api_v2.php";
require_once "../utils_v2/mosaic_utils.php";
require_once "../util/export_labels_v2.php";

function processChunk($uid, $identifier, $md5Hash, $chunk) {
    connect_our_db();
    global $UPLOAD_DIRECTORY;

    if (count($_FILES) == 0) {
        error_log("ERROR, no files attached to upload!");
        return responseMessage("FAILURE", "No files attached to php request.");

    } else if (count($_FILES) > 1) {
        error_log("ERROR, more than one file attached to upload!");
        return responseMessage("FAILURE", "Multiple files attached to php request.");
    }

    if (!isset($identifier)) {
        error_log("ERROR! Missing upload identifier");
        return responseMessage("FAILURE", "File identifier was missing.");
    }

    if (!isset($md5Hash)) {
        error_log("ERROR! Missing upload md5_hash");
        return responseMessage("FAILURE", "File md5_hash was missing.");
    }

    if (!isset($chunk)) {
        error_log("ERROR! Missing upload chunk");
        return responseMessage("FAILURE", "Chunk number was missing.");
    }

    $chunkSize = 0;

    // copy the file chunk to the server
    foreach ($_FILES as $file) {
        error_log("working with file: " . json_encode($file));

        // overwrite chunk if it already exists due to some issue
        $target = "$UPLOAD_DIRECTORY/$uid/$identifier";
        if (!file_exists($target)) {
            mkdir($target, 0777, true); //make the parent directory if it does not exist
        }
        $target .= "/$chunk.part";

        error_log("moving '" . $file['tmp_name'] . "' to '$target'");
        move_uploaded_file($file['tmp_name'], $target);
        //TODO: maybe test to see if move failed (i.e., upload directory was
        //moved). This shouldn't happen without concurrent uploads however.

        $chunkSize = filesize($target);
        error_log("chunk file '$target' size: " . $chunkSize);
    }

    error_log("temp file size: $chunkSize");
    
    // update database as chunk status
    
    $query = "SELECT uploaded_chunks, chunk_status FROM mosaics WHERE md5_hash = '$md5Hash' AND owner_id = '$uid' FOR UPDATE";
    error_log($query);

    $result = query_our_db($query);
    $row = $result->fetch_assoc();

    $dbUploadedChunks = $row['uploaded_chunks'] + 1;
    $dbChunkStatus = $row['chunk_status'];

    $dbChunkStatus[$chunk] = '1';

    $query = "UPDATE mosaics SET uploaded_chunks = $dbUploadedChunks, chunk_status = '$dbChunkStatus', bytes_uploaded = bytes_uploaded + $chunkSize WHERE md5_hash = '$md5Hash' AND owner_id = '$uid'";
    error_log($query);
    query_our_db($query);

    // build the response object
    $responseObject = getMosaicInfo($uid, $md5Hash);

    // if all the chinks have been uploaded
    $dbNumberChunks = $responseObject['numberChunks'];
    if ($dbUploadedChunks == $dbNumberChunks) {
        $dbFilename = $responseObject['filename'];
        $dbMd5Hash = $responseObject['md5Hash'];

        // create the final file
        $target = "$UPLOAD_DIRECTORY/$uid/$dbFilename";
        error_log("attempting to write file to '$target'");

        if (($fp = fopen($target, 'w')) !== false) {
            for ($i = 0; $i < $dbNumberChunks; $i++) {
                $source = "$UPLOAD_DIRECTORY/$uid/$identifier/$i.part";
                error_log("appending file: '$source'");
                fwrite($fp, file_get_contents($source));
            }
            fclose($fp);
            //TODO: check and see if hash of final file matches upload

            $newMd5Hash = md5_file($target);

            error_log("new md5 hash:      '$newMd5Hash'");
            error_log("expected md5 hash: '$dbMd5Hash'");

            if ($newMd5Hash == $dbMd5Hash) {
                $query = "UPDATE mosaics SET status = 'UPLOADED' WHERE md5_hash = '$dbMd5Hash' AND owner_id = '$uid'";
                error_log($query);
                query_our_db($query);
                //we're golden

                $upload_dir = "$UPLOAD_DIRECTORY/$uid/$identifier";
                error_log("removing directory: '$upload_dir'");
                // rename the temporary directory (to avoid access from other
                // concurrent chunks uploads) and then delete it
                if (rename($upload_dir, $upload_dir.'_UNUSED')) {
                    rrmdir($upload_dir.'_UNUSED');
                } else {
                    rrmdir($upload_dir);
                }

            } else {
                error_log("ERROR! Final file had incorrect bytes, original MD5 hash and uploaded MD5 hashes do not match, some data may have been corrupted.");
                return responseMessage("FAILURE", "An error occurred while putting the chunk files together to make the full uploaded file. The new full file had different bytes than the one that was originally uploaded, so some corruption may have occurred on transfer. Please delete this file, reload the webpage and retry.");
            }

        } else {
            error_log("ERROR! Could not create the final file.");
            return responseMessage("FAILURE", "An error occurred while putting the chunk files together to make the full uploaded file. Please delete and retry.");
        }
    }

    error_log("number_uploaded $dbUploadedChunks of $dbNumberChunks");
    return responseMessage("SUCCESS", $responseObject);
}

function getMosaic($mosaicUuid) {
    global $entityManager;

    // get the mosaic
    $mosaic = $entityManager->getRepository('Mosaic')
        ->findOneBy(array('uuid' => $mosaicUuid));
    $mosaicOwnerId = $mosaic->getOwnerId();

    // return information about the mosaic
    $responseObject = array();
    $responseObject["mosaic"] = array_merge($responseObject, $mosaic->jsonSerialize());

    // filenames
    $filename = $mosaic->getFilename();
    $filename_base = substr($filename, 0, strrpos($filename, "."));
    $tilingDir = "mosaics/{$mosaicOwnerId}/{$filename_base}_files";
    $responseObject["mosaic"]["tilingDir"] = $tilingDir;

    return responseMessage("SUCCESS", $responseObject);
}

/**
 * @throws \Doctrine\ORM\OptimisticLockException
 * @throws \Doctrine\ORM\ORMException
 */
function uploadAnnotationCsv($mosaicUuid) {
    global $entityManager;

    // get the mosaic that these annotations are for
    $mosaic = $entityManager->getRepository('Mosaic')
        ->findOneBy(array('uuid' => $mosaicUuid));
    $width = $mosaic->getWidth();
    $height = $mosaic->getHeight();

    // gather all the annotations in the CSV
    $annotations_to_add = array();
    $i = 0;
    $header = array("x1", "y1", "x2", "y2");
    $found_header = false;
    if (($handle = fopen($_FILES["csv"]["tmp_name"], "r")) !== FALSE) {
        while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
            // skip until the header is found
            if (!$found_header) {
                if ($header === $row) {
                    $found_header = true;
                }
            } else {
                foreach ($row as $k=>$value) {
                    if ($header[$k] == 'x1' || $header[$k] == 'x2') {
                        $annotations_to_add[$i][$header[$k]] = $value / $width;
                    } else {
                        $annotations_to_add[$i][$header[$k]] = $value / $height;
                    }
                }
                $i++;
            }
        }
        fclose($handle);
    } else {
        return responseMessage("FAILURE", "File not uploaded properly.");
    }

    // iterate over the annotations
    foreach ($annotations_to_add as $annotation_to_add) {
        // add each annotation to the database

        $newRectangle = new Rectangle();
        $newRectangle->setMosaic($mosaic);
        $newRectangle->setX1($annotation_to_add["x1"]);
        $newRectangle->setY1($annotation_to_add["y1"]);
        $newRectangle->setX2($annotation_to_add["x2"]);
        $newRectangle->setY2($annotation_to_add["y2"]);

        $entityManager->persist($newRectangle);
    }
    $entityManager->flush();

    return responseMessage("SUCCESS", "");
}

function exportLabelCsv($mosaicUuid) {

    $label_id = 1;
    $coord_type = "PIXEL";

    $responseObject = array();
    $responseObject["csvContents"] = exportRectangles($label_id, $coord_type, $mosaicUuid);

    return responseMessage("SUCCESS", $responseObject);
}

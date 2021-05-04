<?php

function processChunk($uid) {
    connect_our_db();
    global $our_db, $UPLOAD_DIRECTORY;

    if (count($_FILES) == 0) {
        error_log("ERROR, no files attached to upload!");
        $response['err_title'] = "File Chunk Upload Failure";
        $response['err_msg'] = "No files attached to php request.";
        echo json_encode($response);

        exit(1);

    } else if (count($_FILES) > 1) {
        error_log("ERROR, more than one file attached to upload!");
        $response['err_title'] = "File Chunk Upload Failure";
        $response['err_msg'] = "Multiple files attached to php request.";
        echo json_encode($response);
        exit(1);
    }

    if (!isset($_POST['identifier'])) {
        error_log("ERROR! Missing upload identifier");
        $response['err_title'] = "File Chunk Upload Failure";
        $response['err_msg'] = "File identifier was missing.";
        echo json_encode($response);
        exit(1);
    }

    if (!isset($_POST['md5Hash'])) {
        error_log("ERROR! Missing upload md5_hash");
        $response['err_title'] = "File Chunk Upload Failure";
        $response['err_msg'] = "File md5_hash was missing.";
        echo json_encode($response);
        exit(1);
    }

    if (!isset($_POST['chunk'])) {
        error_log("ERROR! Missing upload chunk");
        $response['err_title'] = "File Chunk Upload Failure";
        $response['err_msg'] = "Chunk number was missing.";
        echo json_encode($response);
        exit(1);
    }

    $identifier = $_POST['identifier'];
    $md5_hash = $_POST['md5Hash'];
    $chunk = $_POST['chunk'];
    $chunk_size = 0;

    foreach ($_FILES as $file) {
        error_log("working with file: " . json_encode($file));

        //overwrite chunk if it already exists due to some issue
        $target = "$UPLOAD_DIRECTORY/$uid/$identifier";
        if (!file_exists($target)) {
            mkdir($target, 0777, true); //make the parent directory if it does not exist
        }
        $target .= "/$chunk.part";

        error_log("moving '" . $file['tmp_name'] . "' to '$target'");
        move_uploaded_file($file['tmp_name'], $target);
        //TODO: maybe test to see if move failed (i.e., upload directory was
        //moved). This shouldn't happen without concurrent uploads however.

        $chunk_size = filesize($target);
        error_log("chunk file '$target' size: " . $chunk_size);
    }

    error_log("temp file size: $chunk_size");

    //update database setting chunk as uploaded
    //if all chunks uploaded, combine file and report progress
    //if not all chunks uploaded, report progress

    mysqli_begin_transaction($our_db, MYSQLI_TRANS_START_READ_WRITE);

    $query = "SELECT uploaded_chunks, chunk_status FROM mosaics WHERE md5_hash = '$md5_hash' AND owner_id = '$uid' FOR UPDATE";
    error_log($query);
    if ($result = query_our_db($query)) {
        $row = $result->fetch_assoc();

        $db_uploaded_chunks = $row['uploaded_chunks'] + 1;
        $db_chunk_status = $row['chunk_status'];

        $db_chunk_status[$chunk] = '1';

        $query = "UPDATE mosaics SET uploaded_chunks = $db_uploaded_chunks, chunk_status = '$db_chunk_status', bytes_uploaded = bytes_uploaded + $chunk_size WHERE md5_hash = '$md5_hash' AND owner_id = '$uid'";
        error_log($query);
        if (!($result = query_our_db($query))) {
            mysqli_rollback($our_db);
        }
    } else {
        mysqli_rollback($our_db);
    }
    mysqli_commit($our_db);

    $response['mosaic_info'] = get_mosaic_info($uid, $md5_hash);
    $db_number_chunks = $response['mosaic_info']['number_chunks'];

    if ($db_uploaded_chunks == $db_number_chunks) {
        $db_filename = $response['mosaic_info']['filename'];
        $db_md5_hash = $response['mosaic_info']['md5_hash'];

        //create the final file
        $target = "$UPLOAD_DIRECTORY/$uid/$db_filename";
        error_log("attempting to write file to '$target'");

        if (($fp = fopen($target, 'w')) !== false) {
            for ($i = 0; $i < $db_number_chunks; $i++) {
                $source = "$UPLOAD_DIRECTORY/$uid/$identifier/$i.part";
                error_log("appending file: '$source'");
                fwrite($fp, file_get_contents($source));
            }
            fclose($fp);
            //TODO: check and see if hash of final file matches upload

            $new_md5_hash = md5_file($target);

            error_log("new md5 hash:      '$new_md5_hash'");
            error_log("expected md5 hash: '$db_md5_hash'");

            if ($new_md5_hash == $db_md5_hash) {
                $query = "UPDATE mosaics SET status = 'UPLOADED' WHERE md5_hash = '$db_md5_hash' AND owner_id = '$uid'";
                error_log($query);
                query_our_db($query);
                //we're golden
                //TODO: delete the directory and parts

                $upload_dir = "$UPLOAD_DIRECTORY/$uid/$identifier";
                error_log("removing directory: '$upload_dir'");
                // rename the temporary directory (to avoid access from other
                // concurrent chunks uploads) and than delete it
                if (rename($upload_dir, $upload_dir.'_UNUSED')) {
                    rrmdir($upload_dir.'_UNUSED');
                } else {
                    rrmdir($upload_dir);
                }


            } else {
                error_log("ERROR! Final file had incorrect bytes, original MD5 hash and uploaded MD5 hashes do not match, some data may have been corrupted.");
                $response['err_title'] = "File Upload Failure";
                $response['err_msg'] = "An error occurred while putting the chunk files together to make the full uploaded file. The new full file had different bytes than the one that was originally uploaded, so some corruption may have occurred on transfer. Please delete this file, reload the webpage and retry.";
                echo json_encode($response);
                return false;
            }

        } else {
            error_log("ERROR! Could not create the final file.");
            $response['err_title'] = "File Upload Failure";
            $response['err_msg'] = "An error occurred while putting the chunk files together to make the full uploaded file. Please delete and retry.";
            echo json_encode($response);
            return false;
        }

    }
    error_log("number_uploaded $db_uploaded_chunks of $db_number_chunks");

    $response['code'] = "CHUNK_UPLOADED";
    $response['message'] = "chunk uploaded";
    echo json_encode($response);
}

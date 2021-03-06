<?php

$cwd[__FILE__] = __FILE__;
if (is_link($cwd[__FILE__])) $cwd[__FILE__] = readlink($cwd[__FILE__]);
$cwd[__FILE__] = dirname($cwd[__FILE__]);

require_once($cwd[__FILE__] . "/settings.php");
require_once($cwd[__FILE__] . "/../db/my_query.php");

/**
 * 
 * Delete a directory RECURSIVELY
 * @param string $dir - directory path
 * @link http://php.net/manual/en/function.rmdir.php
 */
function rrmdir($dir) {
    if (is_dir($dir)) {
        error_log("starting dir: '$dir'");
        $objects = scandir($dir);
        foreach ($objects as $object) {
            if ($object != "." && $object != "..") {
                if (filetype($dir . "/" . $object) == "dir") {
                    error_log("removing dir: '$dir'");
                    rrmdir($dir . "/" . $object); 
                } else {
                    error_log("deleting file: '$dir/$object'");
                    unlink($dir . "/" . $object);
                }   
            }   
        }   
        reset($objects);
        error_log("removing dir: '$dir'");
        rmdir($dir);
    }   
}


function get_mosaic_info($owner_id, $md5_hash) {
    $query = "SELECT id, filename, identifier, uploaded_chunks, number_chunks, size_bytes, bytes_uploaded, chunk_status, tiling_progress, status FROM mosaics WHERE md5_hash = '$md5_hash' AND owner_id = '$owner_id'";
    $result = query_our_db($query);
    $row = $result->fetch_assoc();
    $row['md5_hash'] = $md5_hash;

    if ($row['status'] == 'UPLOADED') {
        $queue_query = "SELECT count(id) FROM mosaics WHERE id < " . $row['id'] . " AND status = 'UPLOADED'";
        $queue_result = query_our_db($queue_query);
        $queue_row = $queue_result->fetch_assoc();
        $row['queue_position'] = $queue_row['count(id)'] + 1;
    }

    return $row;
}

function initiate_upload($owner_id) {
    connect_our_db();
    global $our_db, $UPLOAD_DIRECTORY;
    error_log(json_encode($_POST));
    error_log(json_encode($our_db));

    $filename = $our_db->real_escape_string($_POST['filename']);
    $identifier = $our_db->real_escape_string($_POST['identifier']);
    $number_chunks = $our_db->real_escape_string($_POST['numberChunks']);
    $size_bytes = $our_db->real_escape_string($_POST['sizeBytes']);
    $md5_hash = $our_db->real_escape_string($_POST['md5Hash']);

    $filename = str_replace(" ", "_", $filename);
    if (!preg_match("/^[a-zA-Z0-9_.-]*$/", $filename)) {
        //  4. file does exist but with different hash -- error message

        error_log("ERROR! malformed filename");
        $response['err_title'] = "File Upload Failure";
        $response['err_msg'] = "The filename was malformed. Filenames must only contain letters, numbers, dashes ('-'), underscores ('_') and periods.";
        echo json_encode($response);
        exit(1);
    }


    //options:
    //  1. file does not exist, insert into database -- start upload
    //  2. file does exist and has not finished uploading -- restart upload
    //  3. file does exist and has finished uploading -- report finished
    //  4. file does exist but with different hash -- error message

    $query = "SELECT md5_hash, number_chunks, uploaded_chunks, chunk_status, status FROM mosaics WHERE filename = '$filename' AND owner_id = '$owner_id'";
    error_log($query);
    $result = query_our_db($query);
    $row = $result->fetch_assoc();
    if ($row == NULL) {
        //  1. file does not exist, insert into database -- start upload
        $chunk_status = "";
        for ($i = 0; $i < $number_chunks; $i++) {
            $chunk_status .= '0';
        }

        $query = "INSERT INTO mosaics SET owner_id = '$owner_id', filename = '$filename', identifier = '$identifier', size_bytes = '$size_bytes', number_chunks = '$number_chunks', md5_hash='$md5_hash', uploaded_chunks = 0, chunk_status = '$chunk_status', status = 'UPLOADING'";
        error_log($query);
        query_our_db($query);

        $response['mosaic_info'] = get_mosaic_info($owner_id, $md5_hash);
        $response['html'] = "success!";
        echo json_encode($response);

    } else {
        $db_md5_hash = $row['md5_hash'];

        if ($db_md5_hash != $md5_hash) {
            //  4. file does exist but with different hash -- error message

            error_log("ERROR! file exists with different md5 hash");
            $response['err_title'] = "File Upload Failure";
            $response['err_msg'] = "A file with the same name has already been uploaded with a different md5_hash (the file names are the same but the contents are different).  Either rename the new file you would like to upload, or delete the already existing file and retry the upload of the new file.";
            echo json_encode($response);
            exit(1);

        } else if ($row['status'] == 'TILING' || $row['status'] == 'TILED') {
            //  3. file does exist and has finished uploading -- report finished
            //do the same thing, client will handle completion

            error_log("ERROR! Final file has already been uploaded.");
            $response['err_title'] = "File Already Exists";
            $response['err_msg'] = "This file has already been uploaded to the server and does not need to be uploaded again.";
            echo json_encode($response);
            return false;

        } else {
            $db_number_chunks = $row['number_chunks'];
            $db_uploaded_chunks = $row['uploaded_chunks'];
            $db_chunk_status = $row['chunk_status'];

            //  2. file does exist and has not finished uploading -- restart upload

            $response['mosaic_info'] = get_mosaic_info($owner_id, $md5_hash);
            $response['html'] = "success!";
            echo json_encode($response);
        }
    }
}

function process_chunk($owner_id) {
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
        $target = "$UPLOAD_DIRECTORY/$owner_id/$identifier";
        mkdir($target, 0777, true); //make the parent directory if it does not exist
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

    $query = "SELECT uploaded_chunks, chunk_status FROM mosaics WHERE md5_hash = '$md5_hash' AND owner_id = '$owner_id' FOR UPDATE";
    error_log($query);
    if ($result = query_our_db($query)) {
        $row = $result->fetch_assoc();

        $db_uploaded_chunks = $row['uploaded_chunks'] + 1;
        $db_chunk_status = $row['chunk_status'];

        $db_chunk_status[$chunk] = '1';

        $query = "UPDATE mosaics SET uploaded_chunks = $db_uploaded_chunks, chunk_status = '$db_chunk_status', bytes_uploaded = bytes_uploaded + $chunk_size WHERE md5_hash = '$md5_hash' AND owner_id = '$owner_id'";
        error_log($query);
        if (!($result = query_our_db($query))) {
            mysqli_rollback($our_db);
        }
    } else {
        mysqli_rollback($our_db);
    }
    mysqli_commit($our_db);  

    $response['mosaic_info'] = get_mosaic_info($owner_id, $md5_hash);
    $db_number_chunks = $response['mosaic_info']['number_chunks'];

    if ($db_uploaded_chunks == $db_number_chunks) {
        $db_filename = $response['mosaic_info']['filename'];
        $db_md5_hash = $response['mosaic_info']['md5_hash'];

        //create the final file
        $target = "$UPLOAD_DIRECTORY/$owner_id/$db_filename";
        error_log("attempting to write file to '$target'");

        if (($fp = fopen($target, 'w')) !== false) {
            for ($i = 0; $i < $db_number_chunks; $i++) {
                $source = "$UPLOAD_DIRECTORY/$owner_id/$identifier/$i.part";
                error_log("appending file: '$source'");
                fwrite($fp, file_get_contents($source));
            }   
            fclose($fp);
            //TODO: check and see if hash of final file matches upload

            $new_md5_hash = md5_file($target);

            error_log("new md5 hash:      '$new_md5_hash'");
            error_log("expected md5 hash: '$db_md5_hash'");

            if ($new_md5_hash == $db_md5_hash) {
                $query = "UPDATE mosaics SET status = 'UPLOADED' WHERE md5_hash = '$db_md5_hash' AND owner_id = '$owner_id'";
                error_log($query);
                query_our_db($query);
                //we're golden
                //TODO: delete the directory and parts

                $upload_dir = "$UPLOAD_DIRECTORY/$owner_id/$identifier";
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

    $response['html'] = "success!";
    echo json_encode($response);
}

?>

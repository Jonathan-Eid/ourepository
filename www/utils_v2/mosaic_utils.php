<?php

function getMosaicInfo($uid, $md5Hash) {
    $query = "SELECT id, filename, identifier, uploaded_chunks, number_chunks, size_bytes, bytes_uploaded, chunk_status, tiling_progress, status FROM mosaics WHERE md5_hash = '$md5Hash' AND owner_id = '$uid'";
    $result = query_our_db($query);
    $row = $result->fetch_assoc();
    $row['md5_hash'] = $md5Hash;

    if ($row['status'] == 'UPLOADED') {
        $queueQuery = "SELECT count(id) FROM mosaics WHERE id < " . $row['id'] . " AND status = 'UPLOADED'";
        $queueResult = query_our_db($queueQuery);
        $queueRow = $queueResult->fetch_assoc();
        $row['queue_position'] = $queueRow['count(id)'] + 1;
    }

    return $row;
}
<?php

function CheckFile($file)
{
    // Check for errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(array(
            'status' => false,
            'error' => 'Error uploading file: ' . $file['name']
        ));
        exit;
    }

    // Check format
    $allowedFormats = array('jpg', 'jpeg', 'png', 'mp4', 'mov', 'avi');
    $fileInfo = pathinfo($file['name']);
    $fileExtension = strtolower($fileInfo['extension']);
    if (!in_array($fileExtension, $allowedFormats)) {
        echo json_encode(array(
            'status' => false,
            'error' => 'Invalid file format: ' . $file['name']
        ));
        exit;
    }

    // Check size
    $maxSize = 1000 * 1024 * 1024; // 1000MB
    if ($file['size'] > $maxSize) {
        echo json_encode(array(
            'status' => false,
            'error' => 'File size exceeds the limit: ' . $file['name']
        ));
        exit;
    }
}

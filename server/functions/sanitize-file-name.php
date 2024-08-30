<?php

// Function to make filenames URL-appropriate
function sanitizeFileName($fileName)
{
    // Remove special characters and replace spaces with hyphens
    $fileName = preg_replace('/[^A-Za-z0-9\-\.]/', '-', $fileName);
    $fileName = preg_replace('/-+/', '-', $fileName); // Replace multiple hyphens with a single one
    return $fileName;
}

<?php

require_once("../auth/auth.php");
require_once("../connect/db.php");
require_once("../config-url.php");
require_once("../functions/check-file.php");

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Handle CORS preflight requests and main requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Handle preflight requests
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Max-Age: 86400"); // Cache the preflight response for 24 hours
    http_response_code(200);
    exit;
}

// Allow cross-origin requests for actual POST requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Get all headers and check for Authorization header
    $headers = getallheaders();
    $authorization = $headers['Authorization'] ?? null;
    Auth($authorization, $conn);
    $user_id = base64_decode(json_decode($authorization, true)['user_id']);

    // Extract JSON data from FormData
    $data = [];
    $data = json_decode($_POST['data'], true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        exit;
    }

    // Function to make filenames URL-appropriate (CheckFile function)
    require_once("../functions/sanitize-file-name.php");

    // Handle file uploads
    $files = [];
    $thumbnail = null;
    foreach ($_FILES as $key => $file) {
        // Check for errors
        CheckFile($file);

        $uploadDir = '../assets/';
        $fileName = sanitizeFileName(basename($file['name']));
        $uploadFile = $uploadDir . $fileName;

        // Check if the file already exists and rename if necessary
        $fileCounter = 1;
        while (file_exists($uploadFile)) {
            $fileNameWithoutExt = pathinfo($fileName, PATHINFO_FILENAME);
            $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);
            $newFileName = $fileNameWithoutExt . "-$fileCounter." . $fileExt;
            $uploadFile = $uploadDir . $newFileName;
            $fileCounter++;
        }

        // Move the uploaded file
        if (move_uploaded_file($file['tmp_name'], $uploadFile)) {
            if ($key === 'thumbnail') {
                $thumbnail = basename($uploadFile);
            } else {
                $files[] = basename($uploadFile);
            }
        } else {
            echo "Failed to move file: " . $file['name'];
        }
    }

    // Step 2: Save file names to the database
    try {
        $conn->begin_transaction();

        // Save main files
        $file_ids = [];
        foreach ($files as $file) {
            $sql = "INSERT INTO `files` (`name`) VALUES (?);";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception("Prepare failed: (" . $conn->errno . ") " . $conn->error);
            }
            $stmt->bind_param("s", $file);
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
            }
            $file_ids[] = $conn->insert_id;
        }

        // Save hashtags and get their IDs
        $hashtags = $data['hashtags'] ?? [];
        $hashtag_ids = [];

        foreach ($hashtags as $hashtag) {
            $stmt = $conn->prepare("SELECT id FROM hashtags WHERE hashtag = ?");
            $stmt->bind_param("s", $hashtag);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                $stmt->bind_result($id);
                $stmt->fetch();
                $hashtag_ids[] = $id;
            } else {
                $stmt->close();
                $stmt = $conn->prepare("INSERT INTO hashtags (hashtag) VALUES (?)");
                $stmt->bind_param("s", $hashtag);
                if ($stmt->execute()) {
                    $hashtag_ids[] = $conn->insert_id;
                } else {
                    throw new Exception("Failed to insert hashtag: (" . $stmt->errno . ") " . $stmt->error);
                }
            }
            $stmt->close();
        }

        // Save URLs and get their IDs
        $urls = $data['urls'] ?? [];
        $url_ids = [];

        foreach ($urls as $url) {
            $stmt = $conn->prepare("SELECT id FROM urls WHERE url = ?");
            $stmt->bind_param("s", $url);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                $stmt->bind_result($id);
                $stmt->fetch();
                $url_ids[] = $id;
            } else {
                $stmt->close();
                $stmt = $conn->prepare("INSERT INTO urls (url) VALUES (?)");
                $stmt->bind_param("s", $url);
                if ($stmt->execute()) {
                    $url_ids[] = $conn->insert_id;
                } else {
                    throw new Exception("Failed to insert url: (" . $stmt->errno . ") " . $stmt->error);
                }
            }
            $stmt->close();
        }

        // Save all information in the posts table
        $title = $data['title'] ?? null;
        $time = $data['time'] ?? null;
        $description = $data['description'] ?? null;
        $date = $data['date'] ?? null;
        $month = $data['month'] ?? null;
        $year = $data['year'] ?? null;
        $type = $data['type'] ?? null;
        $file_ids = implode(',', $file_ids);
        $hashtag_ids = implode(',', $hashtag_ids);
        $url_ids = implode(',', $url_ids);

        // Insert statement
        $sql = "INSERT INTO `posts` (`title`, `description`, `time`, `date`, `month`, `year`, `hashtags`, `urls`, `files`, `thumbnail`, `user_id`, `type`) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            throw new Exception("Prepare failed: (" . $conn->errno . ") " . $conn->error);
        }
        $stmt->bind_param("sssisissssis", $title, $description, $time, $date, $month, $year, $hashtag_ids, $url_ids, $file_ids, $thumbnail, $user_id, $type);

        if ($stmt->execute()) {
            // Insertion successful
            $conn->commit();
            echo json_encode(array(
                "status" => true,
                "message" => "Post Added Successfully"
            ));
            $stmt->close();
            exit;
        } else {
            // Insertion failed
            $stmt->close();
            throw new Exception("Execute failed: (" . $stmt->errno . ") " . $stmt->error);
        }
    } catch (Exception $e) {
        $conn->rollback();
        echo json_encode(array(
            "status" => false,
            "error" => $e->getMessage()
        ));
        exit;
    }
} else {
    // Handle other request methods if needed
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

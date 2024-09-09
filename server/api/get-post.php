<?php

require_once("../auth/auth.php");
require_once("../connect/db.php");
require_once("../config-url.php");

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

// Get all headers and check for Authorization header
$headers = getallheaders();
$authorization = $headers['Authorization'] ?? null;
Auth($authorization, $conn);
$user_id = base64_decode(json_decode($authorization, true)['user_id']);

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

$post_id = $data['post'];

$sql = "SELECT * FROM `posts` WHERE id = ? and user_id = ?;";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(array(
        "status" => false,
        "message" => "Prepare failed"
    ));
    exit;
}

$stmt->bind_param("ii", $post_id, $user_id);

if (!$stmt->execute()) {
    echo json_encode(array(
        "status" => false,
        "message" => "Execute failed"
    ));
    $stmt->close();
    exit;
}

// * Gets the Result
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo json_encode(array(
            "status" => true,
            "message" => "Post found",
            "data" => $row
        ));
    }
} else {
    echo json_encode(array(
        "status" => false,
        "message" => "No Posts found"
    ));
}

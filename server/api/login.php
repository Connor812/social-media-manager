<?php

// Allow cross-origin requests
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: POST"); // Allow POST requests
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow Content-Type and Authorization headers
header('Content-Type: application/json');

// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

// Use the data as needed
$username = $data['username'];
$password = $data['password'];

if (empty($username) || empty($password)) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Please enter a username and password"
    ));
    exit;
}

require_once '../connect/db.php';

$sql = "SELECT * FROM `users` WHERE username = ? OR email = ?;";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Prepare failed"
    ));
    exit;
}

$stmt->bind_param("ss", $username, $username);

if (!$stmt->execute()) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Execute failed"
    ));
    $stmt->close();
    exit;
}

$result = $stmt->get_result();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {

        // # This checks to see if the password is correct
        if (password_verify($password, $row['password'])) {
            insertToken($conn, $row["username"], $row['id']);
        } else {
            echo json_encode(array(
                "status" => "error",
                "message" => "Incorrect password"
            ));
            $stmt->close();
            exit;
        }
    }
} else {
    echo json_encode(array(
        "status" => "error",
        "message" => "No user found"
    ));
    $stmt->close();
    exit;
}


function insertToken($conn, $username, $user_id)
{
    $token = bin2hex(random_bytes(64));
    $timestamp = date('Y-m-d H:i:s');

    // Insert statement
    $sql = "INSERT INTO `tokens` (`token`, `user_id`) VALUES (?, ?);";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(array(
            "status" => "error",
            "message" => "Preparing"
        ));
        exit;
    }

    // Bind parameters to the prepared statement
    $stmt->bind_param("si", $token, $user_id);

    // Execute the statement
    if ($stmt->execute()) {
        // Insertion successful
        echo json_encode(
            array(
                "status" => "success",
                "message" => "Login successful",
                "userData" => array(
                    "token" => $token,
                    "user_id" => base64_encode($user_id),
                    "timestamp" => $timestamp,
                    "username" => $username
                )
            )
        );
        $stmt->close();
        exit;
    } else {
        // Insertion failed
        echo json_encode(
            array(
                "status" => "error",
                "message" => "Insert failed"
            )
        );
        $stmt->close();
        exit;
    }
}

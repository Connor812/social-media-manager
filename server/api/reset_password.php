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

$uid = $data['uid'];

if (empty($uid)) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid uid From Url"
    ));
    exit;
}

require_once '../connect/db.php';

$sql = "SELECT * FROM `password_reset_uid` WHERE uid = ?;";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Prepare failed"
    ));
    exit;
}

$stmt->bind_param("s", $uid);

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
        $email = $row['email'];
        $expiry = $row['timestamp'];

        // Compare the dates
        $mysqlDate = new DateTime($expiry);
        $currentDate = new DateTime();
        $currentDate->modify('+3 hours');
        if ($mysqlDate > $currentDate) {
            deleteUid($uid, $conn);
            echo json_encode(array(
                "status" => "error",
                "message" => "Link has expired"
            ));
            exit;
        }

        $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);

        $sql = "UPDATE `users` SET `password` = ? WHERE email = ?;";

        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            echo json_encode(array(
                "status" => "error",
                "message" => "Prepare failed"
            ));
            exit;
        }

        $stmt->bind_param("ss", $hashed_password, $email);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                echo json_encode(array(
                    "status" => "success",
                    "message" => "Password updated"
                ));
                deleteUid($uid, $conn);
                $stmt->close();
                exit;
            } else {
                echo json_encode(array(
                    "status" => "error",
                    "message" => "No rows updated"
                ));
                $stmt->close();
                exit;
            }
        } else {
            echo json_encode(array(
                "status" => "error",
                "message" => "Failed to update password"
            ));
            $stmt->close();
            exit;
        }
    }
} else {
    // ! No uid found
    echo json_encode(array(
        "status" => "error",
        "message" => "Invalid uid"
    ));
    exit;
}


function deleteUid($uid, $conn)
{

    $sql = "DELETE FROM `password_reset_uid` WHERE `uid` = ?;";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(array(
            "status" => "error",
            "message" => "Prepare failed in deleteUid"
        ));
        $stmt->close();
        exit;
    }

    $stmt->bind_param("s", $uid);

    if ($stmt->execute()) {
        $stmt->close();
    } else {
        // ! Failed update
        echo json_encode(array(
            "status" => "error",
            "message" => "Failed to delete uid"
        ));
        $stmt->close();
        exit;
    }
}

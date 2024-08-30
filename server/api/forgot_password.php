<?php

require_once "../config-url.php";

// Allow cross-origin requests
header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: POST"); // Allow POST requests
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow Content-Type and Authorization headers
header('Content-Type: application/json');

$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

$email = $data["email"];

if (!$email) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Please enter an email address"
    ));
    exit();
}

$uid = bin2hex(random_bytes(8));

require_once "../connect/db.php";

// Insert statement
$sql = "INSERT INTO `password_reset_uid` (`email`, `uid`) VALUES (?, ?);";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(array(
        "status" => "error",
        "message" => "Prepare failed"
    ));
    exit;
}

// Bind parameters to the prepared statement
$stmt->bind_param("ss", $email, $uid);

// Execute the statement
if ($stmt->execute()) {
    // Insertion successful
    send_email($email, $uid);
    $stmt->close();
    exit;
} else {
    // Insertion failed
    echo json_encode(array(
        "status" => "error",
        "message" => "Execute failed"
    ));
    $stmt->close();
    exit;
}

function send_email($email, $uid)
{
    $from = "YourEmail@gmail.com"; // Make sure to change it final production
    $to = $email;
    $subject = "Password Reset Request";
    $message = "Click the link below to reset your password: " . URL . "reset-password.php?uid=" . $uid;
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: $from " . "\r\n";
    $headers .= "Reply-To: $from " . "\r\n";

    // Add DKIM and SPF headers
    $headers .= "DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/simple; d=yourdomain.com; s=mail; t=" . time() . ";";
    $headers .= "h=from:reply-to:subject; bh=" . base64_encode($message) . "; b=" . hash_hmac('sha256', $message, 'your_private_key') . ";";
    $headers .= "Received-SPF: pass (google.com: domain of $from designates your_server_ip as permitted sender) client-ip=your_server_ip;";

    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(array(
            "status" => "success",
            "message" => "Email sent"
        ));
        exit;
    } else {
        echo json_encode(array(
            "status" => "error",
            "message" => "Email failed to send"
        ));
        exit;
    }
}

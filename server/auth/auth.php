<?php

function Auth($authorization, $conn)
{

    $authorization = json_decode($authorization, true);
    $token = $authorization['token'];
    $user_id = base64_decode($authorization['user_id']);

    $sql = "SELECT * FROM `tokens` WHERE token = ? AND user_id = ?;";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(array(
            "status" => false,
            "message" => "Failed To Verify Token"
        ));
        exit;
    }

    $stmt->bind_param("si", $token, $user_id);

    if (!$stmt->execute()) {
        echo json_encode(array(
            "status" => false,
            "message" => "Failed To Verify Token"
        ));
        $stmt->close();
        exit;
    }

    // * Gets the Result
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        // ! No data found
        echo json_encode(array(
            "status" => false,
            "message" => "Failed To Verify Token"
        ));
        $stmt->close();
        exit;
    }

    /*  echo json_encode(array(
        "status" => true,
        "message" => "Token Verified"
    )); */
}

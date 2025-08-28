<?php

declare(strict_types=1);

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!headers_sent()) {
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Pragma: no-cache');
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: DENY');
        header('Referrer-Policy: no-referrer');
    }

    session_start();

    $user_math_answer = isset($_POST['math-answer']) ? trim((string)$_POST['math-answer']) : '';
    $expected_math_answer = $_SESSION['math_captcha_answer'] ?? null;
    if ($expected_math_answer === null || $user_math_answer !== (string)$expected_math_answer) {
        $target = isset($_POST['login']) ? 'login' : 'signup';
        header("Location: ../auth/{$target}.php?error=math_captcha_failed");
        exit();
    }

    if (isset($_POST['login'])) {
        $email = isset($_POST['email']) ? trim((string)$_POST['email']) : '';
        $password = isset($_POST['password']) ? (string)$_POST['password'] : '';

        if ($email === '' || $password === '') {
            header('Location: ../auth/login.php?error=empty_fields');
            exit();
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            header('Location: ../auth/login.php?error=invalid_email');
            exit();
        }

        $stmt = $connection->prepare('SELECT id, email, password, name FROM users WHERE email = ?');
        if (!$stmt) {
            header('Location: ../auth/login.php?error=server_error');
            exit();
        }
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result && $result->num_rows === 1) {
            $user = $result->fetch_assoc();
            if ($user && password_verify($password, (string)$user['password'])) {
                $_SESSION['user_id'] = (int)$user['id'];
                $_SESSION['email'] = (string)$user['email'];
                $_SESSION['name'] = (string)$user['name'];

                session_regenerate_id(true);
                header('Location: ../dashboard/index.php');
                exit();
            }
        }

        header('Location: ../auth/login.php?error=invalid_credentials');
        exit();
    }

    if (isset($_POST['signup'])) {
        $name = isset($_POST['name']) ? trim((string)$_POST['name']) : '';
        $email = isset($_POST['email']) ? trim((string)$_POST['email']) : '';
        $password = isset($_POST['password']) ? (string)$_POST['password'] : '';
        $repeat_password = isset($_POST['repeat-password']) ? (string)$_POST['repeat-password'] : '';

        if ($name === '' || $email === '' || $password === '' || $repeat_password === '') {
            header('Location: ../auth/signup.php?error=empty_fields');
            exit();
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            header('Location: ../auth/signup.php?error=invalid_email');
            exit();
        }

        if ($password !== $repeat_password) {
            header('Location: ../auth/signup.php?error=password_mismatch');
            exit();
        }

        if (strlen($password) < 8) {
            header('Location: ../auth/signup.php?error=password_too_short');
            exit();
        }

        $stmt = $connection->prepare('SELECT id FROM users WHERE email = ?');
        if (!$stmt) {
            header('Location: ../auth/signup.php?error=server_error');
            exit();
        }
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result && $result->num_rows > 0) {
            header('Location: ../auth/signup.php?error=email_exists');
            exit();
        }
        $stmt->close();

        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $connection->prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
        if (!$stmt) {
            header('Location: ../auth/signup.php?error=server_error');
            exit();
        }
        $stmt->bind_param('sss', $name, $email, $hashed_password);
        if ($stmt->execute()) {
            header('Location: ../auth/login.php?success=account_created');
            exit();
        }

        header('Location: ../auth/signup.php?error=registration_failed');
        exit();
    }
}

if (isset($connection) && $connection instanceof mysqli) {
    $connection->close();
}

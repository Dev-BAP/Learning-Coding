<?php
$error_message = "";
$success_message = "";

if (isset($_GET['error'])) {
    switch ($_GET['error']) {
        case 'empty_fields':
            $error_message = "Please fill in all fields.";
            break;
        case 'invalid_credentials':
            $error_message = "Invalid email or password.";
            break;
        case 'recaptcha_failed':
        case 'math_captcha_failed':
            $error_message = "Incorrect answer to the math question.";
            break;
        default:
            $error_message = "An error occurred. Please try again.";
    }
}

if (isset($_GET['success'])) {
    switch ($_GET['success']) {
        case 'account_created':
            $success_message = "Account created successfully! Please login.";
            break;
    }
}

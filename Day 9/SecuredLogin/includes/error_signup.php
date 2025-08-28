<?php
$error_message = "";
$success_message = "";


if (isset($_GET['error'])) {
    switch ($_GET['error']) {
        case 'empty_fields':
            $error_message = "Please fill in all fields.";
            break;
        case 'password_mismatch':
            $error_message = "Passwords do not match.";
            break;
        case 'password_too_short':
            $error_message = "Password must be at least 8 characters long.";
            break;
        case 'email_exists':
            $error_message = "An account with this email already exists.";
            break;
        case 'registration_failed':
            $error_message = "Registration failed. Please try again.";
            break;
        case 'recaptcha_failed':
        case 'math_captcha_failed':
            $error_message = "Incorrect answer to the math question.";
            break;
        default:
            $error_message = "An error occurred. Please try again.";
    }
}
?>
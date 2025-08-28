<?php

declare(strict_types=1);

$servername = 'localhost';
$username = 'root';
$password = '';
$dbname = 'SecuredLogin';

$connection = @new mysqli($servername, $username, $password, $dbname);

if ($connection->connect_errno) {
    http_response_code(500);
    exit('Database connection error.');
}

$connection->set_charset('utf8mb4');

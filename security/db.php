<?php
$servername = 'localhost';
$username = 'root';
$password = '';
$database = 'security_test';
$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) { die('Database connection failed'); }
?>

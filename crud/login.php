<?php
include "db.php";

$username = $_POST['username'];
$password = $_POST['password'];

$sql = "SELECT * FROM users
        WHERE username='$username'
        AND password='$password'";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<h2>Login Successful!</h2>";
    echo "Welcome, " . htmlspecialchars($username);
} else {
    echo "<h2>Invalid Username or Password</h2>";
}

$conn->close();
?>
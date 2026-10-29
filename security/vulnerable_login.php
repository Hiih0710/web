<?php
include 'db.php';
$message = '';
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    // Intentionally vulnerable: use only in a local security lab.
    $sql = "SELECT * FROM users WHERE username='$username' AND password='$password'";
    $result = $conn->query($sql);
    if ($result && $result->num_rows > 0) {
        $message = 'Login Successful';
    } else {
        $message = 'Invalid Username or Password';
    }
}
?>
<!DOCTYPE html>
<html><head><title>Security Testing</title></head><body>
<h2>Vulnerable Login</h2>
<form method="post">
Username: <input type="text" name="username"><br><br>
Password: <input type="password" name="password"><br><br>
<input type="submit" value="Login">
</form>
<h3><?php echo htmlspecialchars($message); ?></h3>
</body></html>

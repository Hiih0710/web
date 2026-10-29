<?php
include 'db.php';
$message = '';
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $stmt = $conn->prepare('SELECT id, username, password FROM users WHERE username = ?');
    $stmt->bind_param('s', $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();
        if ($password === $user['password']) {
            $message = 'Login Successful';
        } else {
            $message = 'Invalid Username or Password';
        }
    } else {
        $message = 'Invalid Username or Password';
    }
    $stmt->close();
}
?>
<!DOCTYPE html>
<html><head><title>Secure Login</title></head><body>
<h2>Secure Login</h2>
<form method="post">
Username: <input type="text" name="username" required><br><br>
Password: <input type="password" name="password" required><br><br>
<input type="submit" value="Login">
</form>
<h3><?php echo htmlspecialchars($message); ?></h3>
</body></html>

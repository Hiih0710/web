<!DOCTYPE html>
<html><head><title>Secure XSS Test</title></head><body>
<h2>Secure XSS Test</h2>
<form method="post">
Enter your name: <input type="text" name="name" required>
<input type="submit" value="Submit">
</form>
<?php
if (isset($_POST['name'])) {
    $name = $_POST['name'];
    $safe_name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    echo "<h3>Hello $safe_name</h3>";
}
?>
</body></html>

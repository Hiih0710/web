<!DOCTYPE html>
<html><head><title>XSS Security Test</title></head><body>
<h2>XSS Test</h2>
<form method="post">
Enter your name: <input type="text" name="name">
<input type="submit" value="Submit">
</form>
<?php
if (isset($_POST['name'])) {
    $name = $_POST['name'];
    // Intentionally vulnerable: demonstrates unescaped HTML output.
    echo "<h3>Hello $name</h3>";
}
?>
</body></html>

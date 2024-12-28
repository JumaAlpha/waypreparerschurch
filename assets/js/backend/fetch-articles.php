<?php
require 'db.php';

// Fetch articles query
$sql = "SELECT * FROM articles ORDER BY created_at DESC";
$result = $conn->query($sql);

$articles = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $articles[] = $row;
    }
}

// Return articles as JSON
header('Content-Type: application/json');
echo json_encode($articles);

$conn->close();
?>

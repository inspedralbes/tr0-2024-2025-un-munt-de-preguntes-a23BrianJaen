<?php

$servername = "localhost";
$username = "root";
$password = "Toor";
$dbname = "quizTR0";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo "Conexio no establerta";
    die();
}

?>
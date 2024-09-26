<?php
include("./conexio.php");
session_start();

if ($conn->connect_error) {
    echo "Conexio no establerta";
    die();
}


?>
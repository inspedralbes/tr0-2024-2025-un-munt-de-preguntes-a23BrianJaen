<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 'On');

$inputData = file_get_contents("php://input");
$inputDataJson = json_decode($inputData, true);

$respostesCorrectes = 0;

foreach ($inputDataJson as $index => $idRespuesta) {
    if ($idRespuesta == $_SESSION["respuestas"][$index]) {
        $respostesCorrectes++;
    }
}

$resposteArray = array("totalRespostes" => count($_SESSION["respuestas"]), "respostesCorrectes" => $respostesCorrectes);

echo json_encode($resposteArray);

?>
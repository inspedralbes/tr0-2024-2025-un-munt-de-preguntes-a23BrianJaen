<?php
session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function getData()
{
    $data = json_decode(file_get_contents('php://input'), true);

    return $data;
}

$respostes = new stdClass();
$respostes->respCorr = 0;
$respostes->totalPreg = 0;

foreach (getData()['preguntes'] as $index["idPreg"] => $idRespuesta) {
    if ($idRespuesta["resposta"] == $_SESSION["respuestas"][$index["idPreg"]]) {
        $respostes->respCorr++;
    }
    $respostes->totalPreg++;
}

$response = $respostes;

echo json_encode($response);
?>
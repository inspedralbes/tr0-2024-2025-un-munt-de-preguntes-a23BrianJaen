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
$respostes->idPregunta = [];
$respostes->respCorr = 0;
$respostes->respMal = 0;
$respostes->totalPreg = 0;
$respostes->estadoPreguntas = [];

foreach (getData()['preguntes'] as $index => $pregunta) {
    $respostes->idPregunta[] = $pregunta["idPreg"];

    if ($pregunta["resposta"] == $_SESSION["respuestas"][$index]) {
        $respostes->respCorr++;
        $respostes->estadoPreguntas[$pregunta["idPreg"]] = 1;
    } else {
        $respostes->respMal++;
        $respostes->estadoPreguntas[$pregunta["idPreg"]] = 0;
    }
    $respostes->totalPreg++;
}

$response = $respostes;

echo json_encode($response);
?>
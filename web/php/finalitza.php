<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 'On');

function getData()
{
    $data = json_decode(file_get_contents('php://input'), true);

    // Verifica si los datos son válidos
    if ($data === null) {
        die('Error: No se ha podido decodificar el JSON.');
    }

    // Verifica si hay respuestas en la sesión
    if (!isset($_SESSION["respuestas"]) || !is_array($_SESSION["respuestas"])) {
        die('Error: No hay respuestas en la sesión.');
    }

    return $data;
}

$respostes = new stdClass();
$respostes->respCorr = 0;
$respostes->totalPreg = 0;

foreach (getData() as $index["idPreg"] => $idRespuesta) {
    if ($idRespuesta["resposta"] == $_SESSION["respuestas"][$index["idPreg"]]) {
        $respostes->respCorr++;
    }
    $respostes->totalPreg++;
}

$response = $respostes;

echo json_encode($response);

?>
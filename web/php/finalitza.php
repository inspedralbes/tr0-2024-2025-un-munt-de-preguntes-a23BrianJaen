<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 'On');

$data = json_decode(file_get_contents('php://input'), true);

// Verifica si los datos son válidos
if ($data === null) {
    die('Error: No se ha podido decodificar el JSON.');
}

// Verifica si hay respuestas en la sesión
if (!isset($_SESSION["respuestas"]) || !is_array($_SESSION["respuestas"])) {
    die('Error: No hay respuestas en la sesión.');
}

// $respostesCorrectes = 0;

$respostes = new stdClass();
$respostes -> respCorr = 0;
$respostes -> totalPreg = 0;


// Recorre las respuestas recibidas y compara con las respuestas correctas de la sesión
foreach ($data as $index["idPreg"] => $idRespuesta) {
    // var_dump($idRespuesta); // Para depuración
    if ($idRespuesta["resposta"] == $_SESSION["respuestas"][$index["idPreg"]]) {
        $respostes -> respCorr++;
    }
    $respostes -> totalPreg++;
}

// Devuelve el resultado en JSON
// $resposteArray = array(
//     "totalRespostes" => count($_SESSION["respuestas"]),
//     "respostesCorrectes" => $respostesCorrectes
// );

$response = $respostes;

echo json_encode($response);
?>
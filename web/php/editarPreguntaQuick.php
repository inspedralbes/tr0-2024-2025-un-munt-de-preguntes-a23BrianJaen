<?php
require_once "conexio.php";

$data = json_decode(file_get_contents('php://input'), true);

function updatePreguntasQuick($data, $conn)
{
    $idPregunta = $data['idPregunta'];
    $pregunta = $data['pregunta'];

    $sql = "UPDATE preguntes SET pregunta = ? WHERE idPregunta = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $pregunta, $idPregunta);
    $stmt->execute();
    $stmt->close();
}

function updateRespostasQuick($data, $conn)
{
    // Crear un array para las respuestas
    $respostes = [
        $data['idResp1'],
        $data['idResp2'],
        $data['idResp3'],
        $data['idResp4']
    ];

    // Crear un array para los ids de las respuestas
    $idsRespostes = [
        $data['idResposta1'],
        $data['idResposta2'],
        $data['idResposta3'],
        $data['idResposta4'],
    ];

    // Crear un array para las respuestas correctas
    $respostesCorrectes = [
        intval($data['idRespCorr1']),
        intval($data['idRespCorr2']),
        intval($data['idRespCorr3']),
        intval($data['idRespCorr4'])
    ];


    $idPreg = $data['idPregunta'];

    foreach ($respostes as $index => $resposta) {
        // Comprobar si el índice es válido para respuestas correctas
        $esCorrecte = ($respostesCorrectes[$index] === 1) ? 1 : 0;
        error_log('Resposta correcta '. $esCorrecte);

        $sql = "UPDATE respostes SET resposta = ?, respostaCorrecta = ? WHERE idResposta = ? AND idPreg = ?";
        $stmt = $conn->prepare($sql);

        $idResposta = $idsRespostes[$index]; // Accede a cada idResposta mediante la iteración

        // Asignar los valores
        $stmt->bind_param("siii", $resposta, $esCorrecte, $idResposta, $idPreg);
        $stmt->execute();
    }
}

updatePreguntasQuick($data, $conn);
updateRespostasQuick($data, $conn);

$conn->close();
?>
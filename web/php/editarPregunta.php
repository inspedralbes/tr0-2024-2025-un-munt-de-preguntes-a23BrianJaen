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

    $respostes = [
        $data['idResp1'],
        $data['idResp2'],
        $data['idResp3'],
        $data['idResp4']
    ];

    $idsRespostes = [
        $data['idResposta1'],
        $data['idResposta2'],
        $data['idResposta3'],
        $data['idResposta4'],
    ];

    $idRespCorr = $data['idRespCorr'];

    $idPreg = $data['idPregunta'];

    foreach ($respostes as $index => $resposta) {
        $esCorrecte = ($index + 1 == $idRespCorr) ? 1 : 0;

        $sql = "UPDATE respostes SET resposta = ?, respostaCorrecta = ? WHERE idResposta = ? AND idPreg = ?";
        $stmt = $conn->prepare($sql);

        $idResposta = $idsRespostes[$index]; // Accedo a cada idResposta mediante la iteracion

        $stmt->bind_param("siii", $resposta, $esCorrecte, $idResposta, $idPreg);
        $stmt->execute();
    }
}

updatePreguntasQuick($data, $conn);
updateRespostasQuick($data, $conn);

$conn->close();
?>
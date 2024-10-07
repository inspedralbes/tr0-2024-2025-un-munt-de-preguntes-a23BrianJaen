<?php
require_once "conexio.php";

$data = json_decode(file_get_contents('php://input'), true);

function insertarPregunta($pregunta, $conn)
{
    $sql = "INSERT INTO preguntes(pregunta) VALUES(?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $pregunta);
    $stmt->execute();
}

function insertarRespostes($data, $conn)
{
    $respostes = [
        $data['idResp1'],
        $data['idResp2'],
        $data['idResp3'],
        $data['idResp4']
    ];

    $idRespCorr = $data['idRespCorr'];

    $idPreg = saberIdPreg($conn);

    foreach ($respostes as $index => $resposta) {
        $esCorrecte = ($index == $idRespCorr - 1) ? 1 : 0;

        $sql = "INSERT INTO respostes(resposta, respostaCorrecta, idPreg) VALUES(?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sii", $resposta, $esCorrecte, $idPreg);
        $stmt->execute();
    }
}

function saberIdPreg($conn)
{
    $sql = "SELECT idPregunta FROM preguntes ORDER BY idPregunta DESC LIMIT 1";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        return $row['idPregunta'];  
    } else {
        return null;
    }
}

insertarPregunta($data['pregunta'], $conn);
insertarRespostes($data, $conn);

$conn->close();
?>
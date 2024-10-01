<?php
require_once "conexio.php";

if ($conn->connect_error) {
    echo "Conexio no establerta";
    die();
}

$json_data = file_get_contents("../../back/data.json");
$data = json_decode($json_data, true);

$preguntes = $data['preguntes'];

function tablaPreguntas($conn, $data)
{
    $sql = "INSERT INTO preguntes(pregunta) VALUE(?)";
    $stmt = $conn->prepare($sql);

    foreach ($data as $row) {
        $stmt->bind_param(
            's',
            $row['pregunta'],
        );
        if (!$stmt->execute()) {
            echo "No s'ha pogut insertar";
            die();
        }
    }
    $stmt->close();
}

function tablaRespostes($conn, $data)
{
    $sql = "INSERT INTO respostes(resposta, respostaCorrecta, idPreg) VALUE(?,?,?)";
    $stmt = $conn->prepare($sql);

    foreach ($data as $index => $row) {
        $respActu = $data[$index];

        foreach ($respActu['respostes'] as $indexResp => $resposta) {
            $esCorrecta = ($indexResp + 1 == $respActu['resposta_correcta']) ? 1 : 0;
            $stmt->bind_param(
                'sii',
                $resposta['etiqueta'],
                $esCorrecta,
                $respActu['id']
            );

            if (!$stmt->execute()) {
                echo "No s'ha pogut insertar";
                die();
            }
        }
    }

    $stmt->close();
}

// poner condicion que en caso de que ya se haya insertado no lo vuelva a insertar
tablaPreguntas($conn, $preguntes);
tablaRespostes($conn, $preguntes);

$conn->close();
?>
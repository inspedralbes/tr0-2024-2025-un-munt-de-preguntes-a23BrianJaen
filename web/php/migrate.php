<?php
include("./conexio.php");

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

        foreach ($respActu['respostes'] as $resposta) {
            $stmt->bind_param(
                'sii',
                $resposta['etiqueta'],         
                $respActu['resposta_correcta'], 
                $respActu['id']                 
            );

            if (!$stmt->execute()) {
                echo "No s'ha pogut insertar";
                die();
            }
        }
    }

    $stmt->close();
    $conn->close();
}

tablaPreguntas($conn, $preguntes);
tablaRespostes($conn, $preguntes);
?>
<?php
session_start();

function prepareData()
{
    $json_data = file_get_contents("../../back/data.json");
    $data = json_decode($json_data, true);

    $questions = $data['preguntes'];
    shuffle($questions);

    $cantPreg = isset($_GET['cantPreg']) ? $_GET['cantPreg'] : 10;

    $tenQuestions = array_slice($questions, 0, $cantPreg);

    if (!isset($_SESSION["questions"])) {
        $_SESSION["questions"] = $tenQuestions;
    }

    $preguntesArray = [];

    if (!isset($_SESSION["respuestas"])) {
        foreach ($_SESSION["questions"] as $index => $pregunta) {
            $preguntesArray[$index] = $pregunta["resposta_correcta"];
        }
        $_SESSION["respuestas"] = $preguntesArray;
    }

    foreach ($_SESSION["questions"] as $index => &$pregunta) { // & <- es importante por que las modificaciones que se hagan afectan a los elementos originales del array
        unset($pregunta['resposta_correcta']);
    }

    return $_SESSION["questions"];
}

$questions = prepareData();


echo json_encode($questions);
?>
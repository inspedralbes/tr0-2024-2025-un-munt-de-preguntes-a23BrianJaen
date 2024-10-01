<?php
session_start();

function prepareData()
{
    require_once "getDataBBDD.php";

    $data = transformDataJson();
    if ($data == null) {
        echo "no funciona";
        die();
    }

    $questions = $data["preguntes"];

    shuffle($questions);

    $cantPreg = isset($_GET['cantPreg']) ? $_GET['cantPreg'] : 10;

    $tenQuestions = array_slice($questions, 0, $cantPreg);

    if (!isset($_SESSION["questions"])) {
        $_SESSION["questions"] = $tenQuestions;
    }
    
    $preguntesArray = [];
    
    if (!isset($_SESSION["respuestas"])) {
        foreach ($_SESSION["questions"] as $index => $pregunta) {
            $preguntesArray[$index] = $pregunta["indexRespostaCorrecta"];
        }
        $_SESSION["respuestas"] = $preguntesArray;
    }

    // eliminar tambien el campo de 'respostaCorrecta' para que no se vea en el front
    
    foreach ($_SESSION["questions"] as &$pregunta) { // & <- es importante por que las modificaciones que se hagan afectan a los elementos originales del array
        unset($pregunta['indexRespostaCorrecta']);
    }

    foreach ($_SESSION['questions'] as $indexPreg => &$pregunta){
        foreach ($pregunta['respostes'] as $indexResp => &$resposta){
            unset($resposta['respostaCorrecta']);
        }
    }
    
    return $_SESSION["questions"];
}

$questions = prepareData();

echo json_encode($questions);
?>
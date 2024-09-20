<?php
session_start();

function prepareData()
{
    $json_data = file_get_contents("./data.json");
    $data = json_decode($json_data, true);

    $questions = $data['preguntes'];
    shuffle($questions);

    $cantPreg = isset($_GET['cantPreg']) ? $_GET['cantPreg'] : 10 ;

    $tenQuestions = array_slice($questions, 0, $cantPreg);

    if (!isset($_SESSION["questions"])) {
        $_SESSION["questions"] = $tenQuestions;
    }
    
    return $tenQuestions;
}

$questions = prepareData();

echo json_encode($questions);
?>
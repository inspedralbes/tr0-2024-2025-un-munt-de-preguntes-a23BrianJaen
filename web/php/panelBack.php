<?php
include("conexio.php");

$queryPreguntes = "SELECT * FROM preguntes";
$resPreg = $conn->query($queryPreguntes);
$queryRespostes = "SELECT * FROM respostes";
$resResp = $conn->query($queryRespostes);


function mostrarRespostes($resPreg, $resResp)
{
    $respostes = [];

    while ($rowResp = $resResp->fetch_assoc()) {
        $idPregunta = $rowResp['idPreg'];
        $respostes[$idPregunta][] = $rowResp;
    }

    foreach ($resPreg as $index => $rowPreg) {
        echo $rowPreg['idPregunta'] . "- " . $rowPreg['pregunta'] . "<br>";
        foreach ($respostes[$index + 1] as $rowResp) {
            $esCorrecta = ($rowResp['respostaCorrecta'] == 1) ? "True" : "False";
            echo $rowResp['idResposta'] . "- " . $rowResp['resposta'] . " [" . $esCorrecta . "]" . " " . $rowResp['idPreg'] . "<- IdPregunta" . "<br>";
        }
        echo "<br>";
    }
}

$valueButton = 0;


function insert($valueButton)
{

    echo $_POST["insert"];
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (isset($_POST["insert"])) {
            $valueButton = $_POST["insert"];
        }
    }
    return $valueButton;
}

$value = $valueButton;

echo $value;

mostrarRespostes($resPreg, $resResp);

switch ($value) {
    case $_POST["insert"]:
        echo "culo pelao";
        break;

    default:
        # code...
        break;
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Administració</title>
    <script>
        function borrarPagina(){
            document.body.innerHTML = ''
        }
    </script>
</head>

<body>
    <form action="./panelBack.php" method="post">
        <button value="insert" type="button" onclick="borrarPagina()">Añadir pregunta y respuestas</input>
    </form>
</body>

</html>
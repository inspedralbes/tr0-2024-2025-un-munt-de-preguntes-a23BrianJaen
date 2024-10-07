<?php
session_start();

function prepararData()
{
    $json_data = file_get_contents("./data.json");
    $data = json_decode($json_data, true);

    $questions = $data['preguntes'];
    shuffle($questions);
    $tenQuestions = array_slice($questions, 0, 10);

    if (!isset($_SESSION["questions"])) {
        $_SESSION["questions"] = $tenQuestions;
    }

    if (!isset($_SESSION["indexPreg"])) {
        $_SESSION["indexPreg"] = 0;
    }

    if (!isset($_SESSION["contRespCorr"])) {
        $_SESSION['contRespCorr'] = 0;
    }
}

function procesarInfoForm()
{
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (isset($_POST["action"]) && $_POST["action"] == "Següent") {
            $_SESSION["indexPreg"]++;
        } elseif (isset($_POST["action"]) && $_POST["action"] == "Anterior") {
            $_SESSION["indexPreg"]--;
        }
    }
}

function comprobarInfoRespuesta()
{
    $comprobarEnvio = false;

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if ($_POST["resp"]) {
            $comprobarEnvio = true;
        }
    }
    return $comprobarEnvio;
}

function procesarInfoRespuesta()
{
    $infoRespuesta = comprobarInfoRespuesta();
    if ($infoRespuesta) {
        $_SESSION['answer'] = $_POST['resp'];  
        // Obtiene la pregunta actual
        $preguntaActual = $_SESSION["questions"][$_SESSION["indexPreg"]];
        // Recorre las respuestas de la pregunta actual
        foreach ($preguntaActual['respostes'] as $respuesta) {
            if ($_SESSION['answer'] == $respuesta['id']) {
                if ($respuesta['id'] == $preguntaActual['resposta_correcta']) {
                    echo "<h2>Resposta " . $_SESSION["indexPreg"]+1 .  " correcte</h2>";
                    $_SESSION['contRespCorr']++;
                } else {
                    echo "<h2>Resposta " . $_SESSION["indexPreg"]+1 .  " incorrecte</h2>";
                }
            }
        }
    }
}

function verificaRango($num)
{
    if ($num <= 0) {
        $_SESSION["indexPreg"] = 0;
        $num = 0;
    } elseif ($num >= 10) {
        $_SESSION["indexPreg"] = 10;
        $num = 10;
    }
}

if (!($_REQUEST["action"] == "Següent" || $_REQUEST["action"] == "Anterior")) {
    prepararData();
} else {
    procesarInfoRespuesta();
    procesarInfoForm();
}

$numIndex = $_SESSION["indexPreg"];
$tenQuestions = $_SESSION["questions"];

verificaRango($numIndex);

$numPreg = $tenQuestions[$numIndex];

?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quiz</title>
</head>

<body>
    <form action="index.php" method="post">
        <div>
            <?php if ($numIndex < 10) {
                ?>
                <p><?php echo "Pregunta actual: " . ($numIndex + 1); ?></p> <?php
            } else {
                session_destroy();
                ?>
                <h1>Tens <?php echo $_SESSION['contRespCorr']; ?>/10 preguntes correctes.</h1>
                <a href="http://localhost/Act2-JaenBrian-cambio-data/">
                    <button type="button">Tornar a fer el qüestionari</button>
                </a>
                <?php
            } ?>
            <p><?php echo htmlspecialchars($numPreg['pregunta']); ?></p>
            <?php foreach ($numPreg['respostes'] as $resp): ?>
                <input name="resp" value="<?php echo htmlspecialchars( $resp['id']); ?>" type="radio" required>
                <?php echo htmlspecialchars( $resp['etiqueta']); ?><br />
            <?php endforeach; ?>
        </div>
        <br>
        <input type="submit" name="action" value="Anterior" <?php echo ($numIndex == 0) ? 'disabled' : ''; ?> />
        <input type="submit" name="action" value="Següent" <?php echo ($numIndex == 10) ? 'disabled' : ''; ?> />
    </form>
</body>

</html>
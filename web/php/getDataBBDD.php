<?php
function transformDataJson()
{
    require_once "conexio.php";

    $queryPreguntes = "SELECT * FROM preguntes";
    $resPreg = $conn->query($queryPreguntes);
    $queryRespostes = "SELECT * FROM respostes";
    $resResp = $conn->query($queryRespostes);
    $queryRespostesCorrectes = "SELECT idPreg, respostaCorrecta AS indexRespostaCorrecta FROM respostes";
    $resRespCoor = $conn->query($queryRespostesCorrectes);

    $preguntesData = array();
    $contPreg = 0;

    $respostes = [];
    $respostaCorrecta = [];

    while ($rowResp = $resResp->fetch_assoc()) {
        $idPregunta = $rowResp['idPreg'];
        $respostes[$idPregunta][] = $rowResp;
    }

    while ($rowRespCoor = $resRespCoor->fetch_assoc()) {
        $idPregunta = $rowRespCoor['idPreg'];
        $respostaCorrecta[$idPregunta][] = $rowRespCoor;
    }

    while ($rowPreg = $resPreg->fetch_assoc()) {
        $idPregunta = $rowPreg['idPregunta'];
        $preguntesData['preguntes'][$contPreg] = $rowPreg;
        if (isset($respostes[$idPregunta])) {
            $preguntesData['preguntes'][$contPreg]['respostes'] = $respostes[$idPregunta];
        }
        if (isset($respostaCorrecta[$idPregunta])) {
            for ($i = 0; $i < count($preguntesData['preguntes'][$contPreg]['respostes']); $i++) {
                $preguntesData['preguntes'][$contPreg]['respostes'][$i]['indexResposta'] = $i + 1;
                if ($preguntesData['preguntes'][$contPreg]['respostes'][$i]['respostaCorrecta'] == "1") {
                    $preguntesData['preguntes'][$contPreg]['indexRespostaCorrecta'] = $i + 1;
                }
            }
        }
        $contPreg++;
    }
    return $preguntesData;
}

?>
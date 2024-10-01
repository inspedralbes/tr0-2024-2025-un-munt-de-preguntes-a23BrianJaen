<?php
require_once "conexio.php";

if (!$conn) {
    die("Error en la conexión a la base de datos: " . mysqli_connect_error());
}

$data = json_decode(file_get_contents('php://input'), true);

$sql = "DELETE FROM preguntes WHERE idPregunta = ?";

$idPreg = $data['idPreg'];

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $idPreg);
$stmt->execute();
$stmt->close();
$conn->close();
?>
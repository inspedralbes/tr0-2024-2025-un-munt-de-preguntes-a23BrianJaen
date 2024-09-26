DROP DATABASE IF EXISTS quizTR0;
CREATE DATABASE quizTR0;
USE quizTR0;

DROP TABLE IF EXISTS pregintes;

CREATE TABLE preguntes (
	idPregunta INT AUTO_INCREMENT PRIMARY KEY,
    pregunta VARCHAR(100)
);

DROP TABLE IF EXISTS respostes;

CREATE TABLE respostes (
	idResposta INT AUTO_INCREMENT PRIMARY KEY,
    resposta VARCHAR(50),
    respostaCorrecta BOOLEAN,
    idPreg INT,
    FOREIGN KEY (idPreg) REFERENCES preguntes(idPregunta) 
);
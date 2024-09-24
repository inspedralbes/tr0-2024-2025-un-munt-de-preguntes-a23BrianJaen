
const app = document.getElementById("app")
const enviarRespostes = document.getElementById("enviaRespostes")
const anterior = document.getElementById("anterior")
const seguent = document.getElementById("seguent")
const cantPreg = 2
let indexPreg = 0

let data = []
let estatPartida = crearEstatPartida(cantPreg)

function crearEstatPartida(cantantidadPreguntes) {
        let estatPartida = {
                preguntes: []
        }

        for (let i = 0; i < cantantidadPreguntes; i++) {
                estatPartida.preguntes.push({ idPreg: i, resposta: -1 })
        }
        return estatPartida
}

async function getData() {
        const URL = `./php/getPreguntes.php?cantPreg=${cantPreg}`
        const request = await fetch(URL)
        const json = await request.json()
        return json
}

async function sendData() {
        const URL = `./php/finalitza.php`
        const respuestas = await fetch(URL, {
                method: "POST",
                headers: {
                        "Content-Type": "application/json" // indicar que envio un JSON
                },
                body: JSON.stringify(estatPartida.preguntes)
        })
        return respuestas.json()
}

async function inicializarApp() {
        pintarTablaPreguntas()
        data = await getData()
        pintarPregunta(data)

        // esto meterlo en una funciona aparte
        anterior.addEventListener("click", () => {
                if (indexPreg > 0) {
                        indexPreg--
                        console.log(`Index decrementa: ${indexPreg}`)
                        pintarPregunta(data)
                }
        });

        seguent.addEventListener("click", () => {
                if (indexPreg < data.length - 1) {
                        indexPreg++
                        console.log(`Index aumenta: ${indexPreg}`)
                        pintarPregunta(data)
                }
        });

        enviarRespostes.addEventListener("click", async () => {
                try {
                        const resul = await sendData()
                        console.log(resul)
                } catch (error) {
                        console.error('Error al enviar los datos:', error)
                }
        });
}

async function pintarPregunta(data) {
        app.innerHTML = ""
        let pregunta = data[indexPreg].pregunta
        let respuestas = data[indexPreg].respostes

        app.innerHTML += `${indexPreg + 1}- ${pregunta} <br><br>`

        for (let index = 0; index < respuestas.length; index++) {
                app.innerHTML += `<button class="botonRespuesta" data-index="${indexPreg}" data-respuestaId="${respuestas[index].id}" required>${respuestas[index].etiqueta}</button> <br>`
        }

        // Asignar los eventos a los botones de respuestas
        const botonesRespuestas = document.getElementsByClassName("botonRespuesta")
        for (const boton of botonesRespuestas) {
                const respuestaId = boton.getAttribute("data-respuestaId")
                const indexPreg = boton.getAttribute("data-index")
                boton.addEventListener("click", () => {
                        guardarRespuesta(indexPreg, respuestaId)
                });
        }
}

function guardarRespuesta(indexPregunta, idResposta) {

        let posId = -1
        for (let iter = 0; iter < estatPartida.preguntes.length; iter++) {
                if (indexPregunta == estatPartida.preguntes[iter].idPreg) {
                        posId = iter
                        estatPartida.preguntes[posId].resposta = idResposta
                        console.log(`Id pregunta: ${estatPartida.preguntes[iter].idPreg}`)
                        console.log(`Respuesta: ${estatPartida.preguntes[posId].resposta}`)
                        // console.log(`!!!!!Index pregunta: ${indexPregunta} - Iterador: ${iter}`)
                        // console.log(`Pregunta a cambiar: ${estatPartida.preguntes[indexPregunta].idPreg}`) // <- como hacerlo para cambiar solo la id de esa pregunta
                }
        }

        pintarTablaPreguntas()
}

function pintarTablaPreguntas() {
        const tabla = document.getElementById("tablaPreg")

        tabla.innerHTML = ` `
        tabla.innerHTML += `<table>`
        for (let iter = 0; iter < estatPartida.preguntes.length; iter++) {
                tabla.innerHTML += `<tr><th>Pregunta: ${iter + 1} - Resposta: ${estatPartida.preguntes[iter].resposta}</th></tr><br>`
        }
        tabla.innerHTML += `</table> <br>`
}


inicializarApp()
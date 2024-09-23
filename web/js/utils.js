
const app = document.getElementById("app")
const enviarRespostes = document.getElementById("enviaRespostes")
const cantPreg = 2
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
        data = await getData()
        pintarTablaPreguntas()
        for (const [index, pregunta] of data.entries()) {
                let tituloPregunta = pregunta.pregunta
                app.innerHTML += `${index + 1}- ${tituloPregunta} <br><br>`
                for (const respuesta of pregunta.respostes) {
                        let resp = respuesta.etiqueta
                        app.innerHTML += `<button class="botonRespuesta" data-index="${index}" data-respuestaId="${respuesta.id}" required>${resp}</button> <br>`
                }
                app.innerHTML += '<br>'
        }
        const botonesRespuestas = document.getElementsByClassName("botonRespuesta")
        // console.log(botonesRespuestas)
        for (const boton of botonesRespuestas) { // <- los tres . crea un nuevo array desde 0, pasar de un HTMLcollection a un array normal
                const respuestaId = boton.getAttribute("data-respuestaId") //data-respuestaId: guarda datos en un elemento
                const indexPreg = boton.getAttribute("data-index")
                boton.addEventListener("click", () => {
                        guardarRespuesta(indexPreg, respuestaId)
                })
        }
        enviarRespostes.addEventListener("click", async () => {
                try {
                        // console.log(estatPartida.preguntes)
                        const resul = await sendData();
                        console.log(resul)
                        // Aquí puedes llamar a getFinalResult() si es necesario
                    } catch (error) {
                        console.error('Error al enviar los datos:', error);
                    }
        })
}

function guardarRespuesta(indexPregunta, idResposta) {
        const pregunta = data[indexPregunta]
        const esCorrecta = pregunta.resposta_correcta == idResposta

        let posId = -1
        // for (let iter = 0; iter < respostes.length; iter++) {
        //         if (indexPregunta == iter) {
        //                 posId = iter
        //                 respostes[posId] = idResposta
        //         }
        // }
        for (let iter = 0; iter < estatPartida.preguntes.length; iter++) {
                if (indexPregunta == estatPartida.preguntes[iter].idPreg) {
                        posId = iter
                        estatPartida.preguntes[posId].resposta = idResposta
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
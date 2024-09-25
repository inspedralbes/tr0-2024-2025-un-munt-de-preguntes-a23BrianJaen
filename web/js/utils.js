
const APP = document.getElementById("app")
const ENVIARRESPOSTES = document.getElementById("enviaRespostes")
const NOUJOC = document.getElementById("nouJoc")

function crearEstatPartida(cantantidadPreguntes) {
        let estatPartida = {
                preguntes: []
        }

        for (let i = 0; i < cantantidadPreguntes; i++) {
                estatPartida.preguntes.push({ idPreg: i, resposta: -1 })
        }
        return estatPartida
}

async function getData(CANTPREG) {
        const URL = `./php/getPreguntes.php?cantPreg=${CANTPREG}`
        const REQUEST = await fetch(URL)
        const JSON = await REQUEST.json()
        return JSON
}

async function sendData(estatPartida) {
        console.log(`Se muestra estatPartida: ${estatPartida}`)
        const URL = `./php/finalitza.php`
        const RESPUESTAS = await fetch(URL, {
                method: "POST",
                headers: {
                        "Content-Type": "application/json"
                },
                body: JSON.stringify(estatPartida.preguntes)
        })
        return RESPUESTAS.json()
}

async function endQuiz() {
        const URL = `./php/generarNouJoc.php`
        const RESPUESTAS = await fetch(URL, {
                method: "POST",
                headers: {
                        "Content-Type": "application/json"
                },
        })
        window.location.href = "../web/"
        return RESPUESTAS
}

async function inicializarApp() {
        const ANTERIOR = document.getElementById("anterior")
        const SEGUENT = document.getElementById("seguent")
        const CANTPREG = 10
        let data = []
        let indexPreg = 0

        data = await getData(CANTPREG)
        let estatPartida = crearEstatPartida(data.length)
        pintarPregunta(data, indexPreg, estatPartida)

        ANTERIOR.addEventListener("click", () => {
                if (indexPreg >= 0) {
                        indexPreg--
                        // console.log(`Index decrementa: ${indexPreg}`)
                        pintarPregunta(data, indexPreg, estatPartida)
                }
        })
        SEGUENT.addEventListener("click", () => {
                if (indexPreg < data.length) {
                        indexPreg++
                        // console.log(`Index aumenta: ${indexPreg}`)
                        pintarPregunta(data, indexPreg, estatPartida)
                }
        })
}

function guardarRespuesta(indexPregunta, idResposta, estatPartida) {

        let posId = -1
        for (let iter = 0; iter < estatPartida.preguntes.length; iter++) {
                if (indexPregunta == estatPartida.preguntes[iter].idPreg) {
                        posId = iter
                        estatPartida.preguntes[posId].resposta = idResposta
                        // console.log(`Id pregunta: ${estatPartida.preguntes[iter].idPreg}`)
                        // console.log(`Respuesta: ${estatPartida.preguntes[posId].resposta}`)
                }
        }
}


function mostrarJuego(data, indexPreg, estatPartida) {
        let pregunta = data[indexPreg].pregunta
        let respuestas = data[indexPreg].respostes

        APP.innerHTML += `${indexPreg + 1}- ${pregunta} <br><br>`

        for (let index = 0; index < respuestas.length; index++) {
                APP.innerHTML += `<button class="botonRespuesta" data-index="${indexPreg}" data-respuestaId="${respuestas[index].id}" required>${data[indexPreg].respostes[index].etiqueta}</button> <br>`
        }
        const BOTONESRESPUESTAS = document.getElementsByClassName("botonRespuesta")
        for (const BOTON of BOTONESRESPUESTAS) {
                const RESPUESTAID = BOTON.getAttribute("data-respuestaId")
                const INDEXPREG = BOTON.getAttribute("data-index")
                BOTON.addEventListener("click", () => {
                        guardarRespuesta(INDEXPREG, RESPUESTAID, estatPartida)
                })
        }
}

function mostrarResultadoFinal(estatPartida) {
        APP.innerHTML += `<h3>Enhorabona, has acabat el qüestionari.</h3>
        <p>Pots tornar enrere si vols repondre de nou abans d'envia les respostes.</p>`
        ENVIARRESPOSTES.style.visibility = "visible"
        ENVIARRESPOSTES.addEventListener("click", async () => {
                try {
                        const RESUL = await sendData(estatPartida)
                        // console.log(resul)
                        pintarResultatFinal(RESUL)
                } catch (error) {
                        console.error('Error al enviar los datos:', error)
                }
        })
        NOUJOC.addEventListener("click", async () => {
                endQuiz()
        })
}

async function pintarPregunta(data, indexPreg, estatPartida) {
        APP.innerHTML = ""
        // console.log(`Index pregunta en la funcion de pintar pregunta: ${indexPreg}`)
        ENVIARRESPOSTES.style.visibility = "hidden"
        NOUJOC.style.visibility = "hidden"

        if (indexPreg < data.length) {
                mostrarJuego(data, indexPreg, estatPartida)
        } else {
                mostrarResultadoFinal(estatPartida) // <- Pasar posible data
        }
}

function pintarResultatFinal(resultat) {

        APP.innerHTML = ``

        ENVIARRESPOSTES.style.visibility = "hidden"
        anterior.style.visibility = "hidden"
        seguent.style.visibility = "hidden"

        if (resultat.respCorr == undefined) {
                resultat.respCrr = 0
        }
        APP.innerHTML += `<h2>Resultat final</h2>
        Preguntes correctes ${resultat.respCorr}/${resultat.totalPreg}`
        NOUJOC.style.visibility = "visible"

        // console.log(resultat.respCorr)
        // console.log(resultat.totalPreg)
}

inicializarApp()
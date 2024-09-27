
const APP = document.getElementById("app")
const ENVIARRESPOSTES = document.getElementById("enviaRespostes")
const NOUJOC = document.getElementById("nouJoc")
let indexPreg = 0

let estatPartida = null

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
        // console.log(`Se muestra estatPartida: ${estatPartida}`)
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
        const CANTPREG = 4
        let data = []

        data = await getData(CANTPREG)
        estatPartida = crearEstatPartida(data.length)
        cargarPreguntas(data)

        ANTERIOR.addEventListener("click", () => {
                if (indexPreg > 0) {
                        indexPreg--
                        mostrarPreguntaActual()
                }
        })
        SEGUENT.addEventListener("click", () => {
                if (indexPreg < data.length) {
                        indexPreg++
                        if(indexPreg >= data.length){
                                console.log("me salgo del rango")
                                mostrarResultadoFinal(estatPartida)
                        }
                        mostrarPreguntaActual()
                }
        })
}

function mostrarPreguntaActual() {
        const preguntas = document.getElementsByClassName("pregunta")

        for (const [index, pregunta] of [...preguntas].entries()) {
                if (indexPreg === index) {
                        pregunta.classList.add("visible")
                        pregunta.classList.remove("oculto")
                } else {
                        pregunta.classList.add("oculto")
                        pregunta.classList.remove("visible")

                }
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

async function cargarPreguntas(data) {

        for (const [index, pregunta] of data.entries()) {
                // console.log(pregunta)
                const divPregunta = document.createElement("div")
                divPregunta.classList.add("pregunta")
                if (indexPreg === index) {
                        divPregunta.classList.add("visible")
                } else {
                        divPregunta.classList.add("oculto")
                }
                const titulo = document.createElement("p")
                titulo.textContent = pregunta.pregunta
                divPregunta.appendChild(titulo)
                for (const resposta of pregunta.respostes) {
                        const divRespostes = document.createElement("div")
                        const respostaBoton = document.createElement("button")
                        respostaBoton.addEventListener("click", () => {
                                // console.log(estatPartida,resposta)
                                estatPartida.preguntes[index].resposta = resposta.indexResposta

                        })
                        respostaBoton.textContent = resposta.resposta
                        divRespostes.appendChild(respostaBoton)
                        divPregunta.appendChild(divRespostes)
                }
                APP.appendChild(divPregunta)
        }
}

function pintarResultatFinal(resultat) {

        APP.innerHTML = ``

        ENVIARRESPOSTES.style.display = "none"
        anterior.style.display = "none"
        seguent.style.display = "none"

        if (resultat.respCorr == undefined) {
                resultat.respCrr = 0
        }
        APP.innerHTML += `<h2>Resultat final</h2>
        Preguntes correctes ${resultat.respCorr}/${resultat.totalPreg}`
        NOUJOC.style.display = "block"

        // console.log(resultat.respCorr)
        // console.log(resultat.totalPreg)
}

inicializarApp()
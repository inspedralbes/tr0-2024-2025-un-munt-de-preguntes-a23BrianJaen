const APP = document.getElementById("app")
const PLAYER = document.getElementById("playerName")
const cantidadPreguntas = document.getElementById("cantPreg")
const contadorDiv = document.getElementById("contador")
const finalizarQuiz = document.getElementById("finalizarQuiz")
const mostrarResulFinal = document.getElementById("mostrarResultadoFinal")
let nombreSeleccionadoJugador = 0
let indexPreg = 0
let estatPartida = null
let data = []
let temporizador

function crearEstatPartida() { // Creo l'estat a partir de la longitud de les preguntes seleccionades
        let cantantidadPreguntes = data.length
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

        const URL = './php/finalitza.php'
        try {
                const response = await fetch(URL, {
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json",
                        },
                        body: JSON.stringify(estatPartida)
                })

                if (!response.ok) {
                        throw new Error(`Error al realitzar el fetch: ${response.statusText}`)
                }

                const result = await response.json()
                return result
        } catch (error) {
                console.error("Error al enviar les dades:", error)
        }
}

async function endQuiz() {
        const URL = `./php/logout.php`
        const RESPONSE = await fetch(URL, {
                method: "POST",
                headers: {
                        "Content-Type": "application/json"
                },
        })
        return RESPONSE
}

async function inicializarApp() {

        const CANTPREG = localStorage.getItem("cantPreg")
        contadorDiv.classList.remove("oculto")

        data = await getData(CANTPREG)
        estatPartida = crearEstatPartida()
        APP.innerHTML = ''
        APP.classList.remove("oculto")
        cargarPreguntas()
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

function iniciarTemporizador() {
        contadorDiv.innerHTML = ''

        let cantidadPreguntas = localStorage.getItem("cantPreg")

        // Inicialitzar el temporitzador
        if (cantidadPreguntas == 5) {
                tiempoRestante = 30
        }
        if (cantidadPreguntas == 10) {
                tiempoRestante = 60
        }
        if (cantidadPreguntas == 15) {
                tiempoRestante = 90
        }

        const htemporizador = document.createElement("h2")
        htemporizador.textContent = `Temps restant: ${tiempoRestante}s`

        temporizador = setInterval(() => {
                tiempoRestante--

                htemporizador.textContent = `Temps restant: ${tiempoRestante}s`

                if (tiempoRestante <= 10) {
                        htemporizador.innerHTML = `Temps restant: <span style="color: orange;">${tiempoRestante}</span>s`
                }
                if (tiempoRestante <= 5) {
                        htemporizador.innerHTML = `Temps restant: <span style="color: red;">${tiempoRestante}</span>s`
                }

                if (tiempoRestante <= 0) {
                        clearInterval(temporizador) // Parar el temporitzador
                        alertaSolicitudesCanceladas("S'ha esgotat el temps!!!", enviarRespuestasAutomaticamente())
                }
        }, 1000)

        contadorDiv.appendChild(htemporizador)
}

// Funció que crida automàticament quan el temps s'esgota
async function enviarRespuestasAutomaticamente() {
        APP.classList.add("oculto")

        try {
                const RESUL = await sendData(estatPartida)
                pintarResultatFinal(RESUL, finalizarQuiz)
        } catch (error) {
                console.error("Error a l'enviament de respostes automàticament:", error)
        }
}

// Inicialitzar el joc amb un temporitzador
function iniciarJuego(nombreJugador) {
        console.log(`El jugador ${nombreJugador} està llest per jugar.`)

        inicializarApp()
        PLAYER.classList.add("oculto")
        iniciarTemporizador()
}

// Mostra la pregunta actual i s'atura el temporitzador si el jugador acaba abans
function mostrarResultadoFinal(estatPartida) {
        clearInterval(temporizador) // Atura el temporitzador quan el jugador acaba
        APP.classList.add("oculto")

        const finalizarQuiz = document.getElementById("finalizarQuiz")
        finalizarQuiz.innerHTML = ''

        finalizarQuiz.classList.remove("oculto")

        const divMostrarResulFinal = document.createElement("div")

        const enhorabuena = document.createElement("h3")
        enhorabuena.innerHTML = `Enhorabona <span style="color: blueviolet;">${nombreSeleccionadoJugador}</span>, has acabat el qüestionari.`

        divMostrarResulFinal.appendChild(enhorabuena)

        finalizarQuiz.appendChild(divMostrarResulFinal)

        const btnEnviarespostes = document.createElement("button")
        btnEnviarespostes.textContent = 'Enviar respostes'
        btnEnviarespostes.addEventListener("click", async () => {
                try {
                        const RESUL = await sendData(estatPartida)
                        pintarResultatFinal(RESUL, finalizarQuiz)
                } catch (error) {
                        console.error('Error al enviar los datos:', error)
                }
        })

        finalizarQuiz.appendChild(btnEnviarespostes)
}


async function cargarPreguntas() {
        APP.appendChild(contadorDiv)

        for (const [indexPregunta, pregunta] of data.entries()) {
                const divPregunta = document.createElement("div")
                divPregunta.classList.add("pregunta")

                if (indexPreg == indexPregunta) {
                        divPregunta.classList.add("visible")
                } else {
                        divPregunta.classList.add("oculto")
                }

                const titulo = document.createElement("p")
                titulo.textContent = `${indexPregunta + 1}- ${pregunta.pregunta}`
                divPregunta.appendChild(titulo)

                for (const [indexResp, resposta] of pregunta.respostes.entries()) {
                        const divRespostes = document.createElement("div")
                        const respostaBoton = document.createElement("button")

                        respostaBoton.textContent = resposta.resposta

                        respostaBoton.addEventListener("click", () => {
                                const botones = divRespostes.parentNode.querySelectorAll("button") // Selecciona tots els botons del mateix contenidor
                                botones.forEach(boton => {
                                        boton.classList.remove("button-pulsado")
                                })
                                respostaBoton.classList.add("button-pulsado")

                                // Desa la resposta correcta
                                estatPartida.preguntes[indexPregunta].resposta = indexResp + 1
                        })

                        divRespostes.appendChild(respostaBoton)
                        divPregunta.appendChild(divRespostes)
                }

                APP.appendChild(divPregunta)
        }

        // Inicialitzar la primera pregunta
        indexPreg = 0
        mostrarPreguntaActual()

        // Botó Anterior
        const btnAnterior = document.createElement("button")
        btnAnterior.textContent = "Anterior"
        btnAnterior.classList.add("btnDisabled") // Deshabilitar a l'inici
        btnAnterior.addEventListener("click", () => {
                if (indexPreg > 0) {
                        indexPreg--
                        if (indexPreg == 0) {
                                btnAnterior.classList.add("btnDisabled")
                        }
                        btnSiguiente.classList.remove("btnDisabled")
                        mostrarPreguntaActual()
                }
        })
        APP.appendChild(btnAnterior)

        // Boto Següent
        const btnSiguiente = document.createElement("button")
        btnSiguiente.textContent = "Següent"
        btnSiguiente.addEventListener("click", () => {
                if (indexPreg < data.length - 1) {
                        indexPreg++
                        btnAnterior.classList.remove("btnDisabled")
                        if (indexPreg === data.length - 1) {
                                btnSiguiente.classList.add("btnDisabled")
                        }
                        mostrarPreguntaActual()
                } else if (indexPreg === data.length - 1) {
                        mostrarResultadoFinal(estatPartida)
                }
        })
        APP.appendChild(btnSiguiente)
}

function pintarResultatFinal(resultat, finalizarQuiz) {

        finalizarQuiz.classList.add("oculto")

        if (resultat.respCorr == undefined) {
                resultat.respCrr = 0
        }

        if (resultat.respMal == undefined) {
                resultat.respMal = 0
        }

        const divResulFinal = document.createElement("div")
        const titulo = document.createElement("h1")

        titulo.innerHTML = `Resultat final de <span style="color: blueviolet;">${nombreSeleccionadoJugador}</span>.`
        divResulFinal.appendChild(titulo)

        const pEstat = document.createElement("p")
        pEstat.textContent = `Tens ${resultat.respCorr} pregunta/es bé, ${resultat.respMal} pregunta/es malament i ${resultat.respNoContestada} no contestada/es`
        divResulFinal.appendChild(pEstat)

        const pFallat = document.createElement("p")
        pFallat.textContent = `El resultat total és el següent:`
        divResulFinal.appendChild(pFallat)

        for (let i = 0; i < resultat.totalPreg; i++) {
                let resposta

                if (resultat.estadoPreguntas[i] == 1) {
                        resposta = "bé"
                } else if (resultat.estadoPreguntas[i] == 0) {
                        resposta = "malament"
                } else {
                        resposta = "no contestada"
                }

                const pPreguntes = document.createElement("p")
                pPreguntes.textContent = `Pregunta ${i + 1}: ${resposta}.`
                divResulFinal.appendChild(pPreguntes)
        }

        const btnNouJoc = document.createElement("button")
        btnNouJoc.textContent = 'Tornar a jugar'
        btnNouJoc.addEventListener("click", async () => {
                endQuiz()
                cargarPreguntas()
                introducirNombreParaJugar()
                mostrarResulFinal.classList.add("oculto")
                PLAYER.classList.remove("oculto")
                mostrarResulFinal.innerHTML = ''
        })

        divResulFinal.appendChild(btnNouJoc)
        mostrarResulFinal.appendChild(divResulFinal)
        mostrarResulFinal.classList.remove("oculto")
}

function introducirNombreParaJugar() {
        APP.classList.add("oculto")
        cantidadPreguntas.classList.add("oculto")
        contadorDiv.classList.add("oculto")
        PLAYER.innerHTML = ''

        if (PLAYER) {
                const pLink = document.createElement("p")
                pLink.textContent = 'Anar al Panell Administrador'
                const link = document.createElement("a")
                link.href = './backPanel.html'
                link.appendChild(pLink)
                PLAYER.appendChild(link)

                const nombresGuardados = JSON.parse(localStorage.getItem("nombresUsuarios")) || []
                mostrarSeleccionNombre(nombresGuardados, link)
        }
}

function mostrarPaginaIncial() { // Mètode per refrescar la pantalla
        contadorDiv.classList.add("oculto")
        PLAYER.classList.remove("oculto")
        cantidadPreguntas.classList.add("oculto")
        APP.classList.add("oculto")
        finalizarQuiz.classList.add("oculto")
        mostrarResulFinal.classList.add("oculto")
}

function mostrarSeleccionNombre(nombresGuardados, link) {

        const divPlayer = document.createElement("div")

        const select = document.createElement("select")
        const selectEliminar = document.createElement("select")
        const LABEL = document.createElement("label")
        const btnNom = document.createElement("button")
        const btnGuardaNom = document.createElement("button")
        const btnElimina = document.createElement("button")
        const btnCacelar = document.createElement("button")
        const buttonGuardaNom = document.createElement("button")
        const buttonEliminar = document.createElement("button")
        const buttonJugar = document.createElement("button")
        const inputNom = document.createElement("input")

        // Crea un desplegable per seleccionar un nom per jugar
        if (nombresGuardados.length > 0) {
                select.id = "selectNombre"

                btnNom.textContent = 'Selecció de nom'
                btnNom.addEventListener("click", () => {
                        inputNom.classList.add("oculto")
                        btnNom.classList.add("oculto")
                        btnElimina.classList.add("oculto")
                        btnGuardaNom.classList.add("oculto")
                        buttonEliminar.classList.add("oculto")
                        selectEliminar.classList.add("oculto")
                        LABEL.classList.add("oculto")
                        buttonGuardaNom.classList.add("oculto")

                        buttonJugar.classList.remove("oculto")
                        select.classList.remove("oculto")
                        nombresGuardados.forEach(nombre => {
                                const option = document.createElement("option")
                                option.value = nombre
                                option.textContent = nombre
                                select.appendChild(option)
                        })
                        divPlayer.appendChild(select)

                        // Botó per seleccionar el nom i comesa a jugar
                        buttonJugar.textContent = "Selecciona nom"
                        buttonJugar.addEventListener("click", () => {
                                PLAYER.classList.add("oculto")
                                link.classList.add("oculto")
                                cantidadPreguntas.classList.add("oculto")
                                cantidadPreguntas.innerHTML = ''
                                nombreSeleccionadoJugador = select.value
                                seleccionarCantidadPreguntas()
                        })
                        divPlayer.appendChild(buttonJugar)

                        const btnCacelar = document.createElement("button")
                        btnCacelar.textContent = "Cancel·la seleccio de nom"
                        btnCacelar.addEventListener("click", () => {
                                btnNom.classList.add("oculto")
                                btnCacelar.classList.add("oculto")
                                buttonJugar.classList.add("oculto")
                                select.classList.add("oculto")
                                selectEliminar.classList.add("oculto")
                                LABEL.classList.add("oculto")
                                inputNom.classList.add("oculto")
                                buttonGuardaNom.classList.add("oculto")
                                selectEliminar.classList.add("oculto")
                                buttonEliminar.classList.add("oculto")

                                btnGuardaNom.classList.remove("oculto")
                                btnNom.classList.remove("oculto")
                                btnElimina.classList.remove("oculto")

                                alertaSolicitudesCanceladas("Cancel·lada la seleccio de nom.", () => {
                                        introducirNombreParaJugar()
                                })
                        })
                        divPlayer.appendChild(btnCacelar)

                })
                divPlayer.appendChild(btnNom)

                // Desplegable per seleccionar un nom a eliminar
                selectEliminar.id = "selectEliminarNombre"

                btnElimina.textContent = 'Elimina nom'
                btnElimina.addEventListener("click", () => {
                        btnNom.classList.add("oculto")
                        select.classList.add("oculto")
                        LABEL.classList.add("oculto")
                        buttonGuardaNom.classList.add("oculto")
                        btnElimina.classList.add("oculto")
                        btnGuardaNom.classList.add("oculto")

                        selectEliminar.classList.remove("oculto")
                        buttonEliminar.classList.remove("oculto")

                        selectEliminar.appendChild(document.createElement("option")) // Opción vacía
                        nombresGuardados.forEach(nombre => {
                                const option = document.createElement("option")
                                option.value = nombre
                                option.textContent = nombre
                                selectEliminar.appendChild(option)
                        })
                        divPlayer.appendChild(selectEliminar)

                        // Botó per eliminar el nom seleccionat
                        buttonEliminar.textContent = "Elimina"
                        buttonEliminar.addEventListener("click", () => {
                                mostrarPaginaIncial()
                                const nombreAEliminar = selectEliminar.value
                                if (nombreAEliminar) {
                                        eliminarNombre(nombreAEliminar) // Eliminar nombre de localStorage
                                        nombresGuardados = nombresGuardados.filter(nombre => nombre !== nombreAEliminar)
                                        actualizarSelectores(select, selectEliminar, nombresGuardados)
                                } else {
                                        alertaSolicitudesCanceladas("Selecciona un nom a eliminar.")
                                }
                        })
                        divPlayer.appendChild(buttonEliminar)

                        const btnCacelar = document.createElement("button")
                        btnCacelar.textContent = "Cancel·la seleccio de nom"
                        btnCacelar.addEventListener("click", () => {
                                btnNom.classList.add("oculto")
                                btnCacelar.classList.add("oculto")
                                buttonEliminar.classList.add("oculto")
                                select.classList.add("oculto")
                                selectEliminar.classList.add("oculto")
                                LABEL.classList.add("oculto")
                                inputNom.classList.add("oculto")
                                buttonGuardaNom.classList.add("oculto")

                                alertaSolicitudesCanceladas("Cancel·lada la eliminació de nom.", () => {
                                        introducirNombreParaJugar()
                                })

                                btnGuardaNom.classList.remove("oculto")
                                btnElimina.classList.remove("oculto")
                                btnNom.classList.remove("oculto")
                        })
                        divPlayer.appendChild(btnCacelar)

                })
                divPlayer.appendChild(btnElimina)

        } else {
                const mensaje = document.createElement("p")
                mensaje.textContent = "No hi ha noms enmmagatzemats. Si us plau, introdueix-ne un."
                divPlayer.appendChild(mensaje)
        }

        // Crear el formulari per afegir un nom nou
        btnGuardaNom.textContent = 'Guarda nom de jugador'
        btnGuardaNom.addEventListener("click", () => {
                btnElimina.classList.add("oculto")
                btnNom.classList.add("oculto")
                btnGuardaNom.classList.add("oculto")
                select.classList.add("oculto")
                buttonGuardaNom.classList.add("oculto")

                inputNom.classList.remove("oculto")
                btnCacelar.classList.remove("oculto")
                LABEL.classList.remove("oculto")
                buttonGuardaNom.classList.remove("oculto")

                LABEL.textContent = `Escriu el teu nom de jugador:`

                inputNom.type = "text"
                inputNom.id = "nombre"
                inputNom.placeholder = 'Màxim 15 caràcters'

                buttonGuardaNom.textContent = `Desa nom`
                buttonGuardaNom.addEventListener("click", () => {
                        mostrarPaginaIncial()
                        const nombre = document.getElementById("nombre").value
                        if (nombre) {
                                if (nombre.length <= 15) {
                                        const nombresGuardados = JSON.parse(localStorage.getItem("nombresUsuarios")) || []
                                        if (!nombresGuardados.includes(nombre)) { // Verificar sí el nom ja està desat
                                                nombresGuardados.push(nombre)
                                                localStorage.setItem("nombresUsuarios", JSON.stringify(nombresGuardados))
                                                inputNom.value = ''
                                                console.log(`Nombre guardado: ${nombre}`)
                                                alertaSolicitudesCompletadas("S'ha desat correctament.", introducirNombreParaJugar())
                                                actualizarSelectores(select, selectEliminar, nombresGuardados)
                                        } else {
                                                alertaSolicitudesCanceladas("El nom ja està desat. Prova amb un altre.")
                                                inputNom.value = ''
                                        }
                                } else {
                                        alertaSolicitudesCanceladas("Nom masa llarg.")
                                        inputNom.value = ''
                                }
                        } else {
                                alertaSolicitudesCanceladas("Siusplau, introdueix un nom.")
                        }

                })

                btnCacelar.textContent = "Cancel·la seleccio de nom"
                btnCacelar.addEventListener("click", () => {
                        btnCacelar.classList.add("oculto")
                        LABEL.classList.add("oculto")
                        inputNom.classList.add("oculto")
                        buttonGuardaNom.classList.add("oculto")
                        alertaSolicitudesCanceladas("Cancel·lat el desat del nom.", () => {
                                introducirNombreParaJugar()
                        })

                        btnElimina.classList.remove("oculto")
                        btnNom.classList.remove("oculto")
                        btnGuardaNom.classList.remove("oculto")
                })
                divPlayer.appendChild(LABEL)
                divPlayer.appendChild(inputNom)
                divPlayer.appendChild(buttonGuardaNom)
                divPlayer.appendChild(btnCacelar)
        })
        divPlayer.appendChild(btnGuardaNom)

        PLAYER.appendChild(divPlayer)
}


function actualizarSelectores(select, selectEliminar, nombresGuardados) {

        select.innerHTML = ''
        selectEliminar.innerHTML = '<option></option>' // Afegeix l'opció per buidar el selectEliminar

        // Afegeix les opcions noves basades en nombresGuardados
        nombresGuardados.forEach(nombre => {
                const option = document.createElement("option")
                option.value = nombre
                option.textContent = nombre
                select.appendChild(option)

                const optionEliminar = document.createElement("option")
                optionEliminar.value = nombre
                optionEliminar.textContent = nombre
                selectEliminar.appendChild(optionEliminar)
        })

}

function eliminarNombre(nombre) {
        const nombresGuardados = JSON.parse(localStorage.getItem("nombresUsuarios")) || []

        const nuevosNombres = []

        for (let i = 0; i < nombresGuardados.length; i++) {
                if (nombresGuardados[i] !== nombre) {
                        nuevosNombres.push(nombresGuardados[i]) // Si no és el nom a eliminar ho deso
                }
        }
        alertaSolicitudesCompletadas("S'ha eliminat correctament", () => {
                introducirNombreParaJugar()
        })

        localStorage.setItem("nombresUsuarios", JSON.stringify(nuevosNombres))
        console.log(`Nombre eliminado: ${nombre}`)
}

function seleccionarCantidadPreguntas() {
        cantidadPreguntas.classList.remove("oculto")

        const divCantPreg = document.createElement("div")

        const LABELpreguntes = document.createElement("label")
        LABELpreguntes.textContent = `Digues la quantitat de preguntes:`

        localStorage.setItem("cantPreg", 0) // setejo la quantitat de preguntes

        // Escollir la quantitat de preguntes d'acord amb el nivell de dificultat
        const selectCantPreg = document.createElement("select")
        selectCantPreg.id = "selecetCantPreg"
        selectCantPreg.classList.add("selectCantPreg")

        const option1 = document.createElement("option")
        option1.value = 5
        option1.textContent = 'Cinc preguntes nivell fàcil'
        selectCantPreg.appendChild(option1)

        const option2 = document.createElement("option")
        option2.value = 10
        option2.textContent = 'Deu preguntes nivell mitjà'
        selectCantPreg.appendChild(option2)

        const option3 = document.createElement("option")
        option3.value = 15
        option3.textContent = 'Quinze preguntes mode difícil'
        selectCantPreg.appendChild(option3)

        const btnCantPreg = document.createElement("button")
        btnCantPreg.textContent = "Selecciona quantiat y jugar"
        btnCantPreg.addEventListener("click", () => {
                const cantitaPreguntes = document.getElementById("selecetCantPreg").value
                localStorage.setItem("cantPreg", cantitaPreguntes)
                iniciarJuego(nombreSeleccionadoJugador)
                cantidadPreguntas.classList.add("oculto")
        })

        const btnCacelar = document.createElement("button")
        btnCacelar.textContent = "Cancel·la selecció quantitat preguntes"
        btnCacelar.addEventListener("click", () => {
                mostrarPaginaIncial()
                alertaSolicitudesCompletadas("Seleccio de preguntes cancel·lada", () => {
                        introducirNombreParaJugar()
                })
        })

        divCantPreg.appendChild(LABELpreguntes)
        divCantPreg.appendChild(selectCantPreg)
        divCantPreg.appendChild(btnCantPreg)
        divCantPreg.appendChild(btnCacelar)

        cantidadPreguntas.appendChild(divCantPreg)
}

function alertaSolicitudesCompletadas(titulo, funcion) {
        Swal.fire({
                title: titulo,
                icon: "success"
        }).then(() => funcion && funcion()) // Si hi ha una funció passada com a argument (verifiquem si és veritable amb 'funció &&'), s'executa
}

function alertaSolicitudesCanceladas(titulo, funcion) {
        Swal.fire({
                title: titulo,
                icon: "error"
        }).then(() => funcion && funcion()) // Si hi ha una funció passada com a argument (verifiquem si és veritable amb 'funció &&'), s'executa
}


// Función para alternar entre mostrar y ocultar la hoja de estilos
function alternarModo() {

        if (document.body.classList.contains('claseOscuro')) {
                // Si el modo oscuro está oculto, lo mostramos y ocultamos el modo claro

                document.body.classList.add('claseClaro')
                document.body.classList.remove('claseOscuro')

        } else {
                // Si el modo oscuro está activo, lo ocultamos y mostramos el claro

                document.body.classList.remove('claseClaro')
                document.body.classList.add('claseOscuro')
        }
}

// Función para crear el botón de alternancia
function crearBotonAlternar(divId) {

        if (divId) {
                const boton = document.createElement('button')
                boton.textContent = "Mode color"
                boton.id = "toggleMode"
                boton.addEventListener('click', () => {
                        alternarModo()
                })
                divId.appendChild(boton)
        }
}


// Inicializar la funcionalidad de alternancia de modo
document.addEventListener('DOMContentLoaded', () => {
        const divModoColor = document.getElementById("modoColor")
        crearBotonAlternar(divModoColor)
})





introducirNombreParaJugar()
const APP = document.getElementById("app")
const PLAYER = document.getElementById("playerName")
const contadorJuego = document.getElementById("contador")
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

        const URL = './php/finalitza.php'
        try {
                const response = await fetch(URL, {
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json",
                        },
                        body: JSON.stringify(estatPartida)
                });

                if (!response.ok) {
                        throw new Error(`Error al realizar el fetch: ${response.statusText}`)
                }

                const result = await response.json()
                return result
        } catch (error) {
                console.error("Error al enviar los datos:", error)
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
        let data = []

        data = await getData(CANTPREG)
        estatPartida = crearEstatPartida(data.length)
        APP.innerHTML = ''
        APP.classList.remove("oculto")
        cargarPreguntas(data)
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

function mostrarResultadoFinal(estatPartida, data) {
        APP.classList.add("oculto")

        const finalizarQuiz = document.getElementById("finalizarQuiz")
        finalizarQuiz.innerHTML = ''

        finalizarQuiz.classList.remove("oculto")

        const divMostrarResulFinal = document.createElement("div")

        const enhorabuena = document.createElement("h3")
        enhorabuena.textContent = "Enhorabona, has acabat el qüestionari."

        divMostrarResulFinal.appendChild(enhorabuena)

        finalizarQuiz.appendChild(divMostrarResulFinal)

        const btnEnviarespostes = document.createElement("button")
        btnEnviarespostes.textContent = 'Enviar respostes'
        btnEnviarespostes.addEventListener("click", async () => {
                try {
                        const RESUL = await sendData(estatPartida)
                        pintarResultatFinal(RESUL, data, finalizarQuiz)
                } catch (error) {
                        console.error('Error al enviar los datos:', error)
                }
        })

        finalizarQuiz.appendChild(btnEnviarespostes)

}

async function cargarPreguntas(data) {

        for (const [indexPregunta, pregunta] of data.entries()) {
                const divPregunta = document.createElement("div")
                divPregunta.classList.add("pregunta")

                if (indexPreg === indexPregunta) {
                        divPregunta.classList.add("visible")
                } else {
                        divPregunta.classList.add("oculto")
                }

                const titulo = document.createElement("p")
                titulo.textContent = `${indexPregunta + 1}- ${pregunta.pregunta}`
                divPregunta.appendChild(titulo)
                for (const [indexResp, resposta] of pregunta.respostes.entries()) {
                        const divRespostes = document.createElement("div");
                        const respostaBoton = document.createElement("button");

                        respostaBoton.textContent = resposta.resposta;

                        respostaBoton.addEventListener("click", () => {
                                // Cambiao el color de fondo de todos los botones dentro del divRespostes
                                const botones = divRespostes.parentNode.querySelectorAll("button"); // Selecciona todos los botones en el mismo contenedor
                                botones.forEach(boton => {
                                        boton.classList.remove("button-pulsado")
                                })
                                respostaBoton.classList.add("button-pulsado")

                                estatPartida.preguntes[indexPregunta].resposta = resposta.indexResposta
                        })

                        divRespostes.appendChild(respostaBoton)
                        divPregunta.appendChild(divRespostes)
                }

                APP.appendChild(divPregunta)
        }

        indexPreg = 0
        const btnAnterior = document.createElement("button")
        btnAnterior.textContent = "Anterior"
        btnAnterior.addEventListener("click", () => {
                if (indexPreg > 0) {
                        indexPreg--
                        mostrarPreguntaActual()
                }
        })
        APP.appendChild(btnAnterior)

        const btnSiguiente = document.createElement("button")
        btnSiguiente.textContent = "Següent"
        btnSiguiente.addEventListener("click", () => {
                if (indexPreg < data.length) {
                        indexPreg++
                        if (indexPreg >= data.length) {
                                mostrarResultadoFinal(estatPartida, data, APP)
                        }
                        mostrarPreguntaActual()
                }
        })
        APP.appendChild(btnSiguiente)
}

function pintarResultatFinal(resultat, data, finalizarQuiz) {

        finalizarQuiz.classList.add("oculto")

        const mostrarResultadoFinal = document.getElementById("mostrarResultadoFinal")

        if (resultat.respCorr == undefined) {
                resultat.respCrr = 0
        }

        const divResulFinal = document.createElement("div")
        const titulo = document.createElement("h2")

        titulo.textContent = 'Resultat final'

        const pResultat = document.createElement("p")
        pResultat.textContent = `Preguntes correctes ${resultat.respCorr}/${resultat.totalPreg}`

        const btnNouJoc = document.createElement("button")
        btnNouJoc.textContent = 'Tornar a jugar'
        btnNouJoc.addEventListener("click", async () => {
                endQuiz()
                cargarPreguntas(data)
                introducirNombreParaJugar()
                mostrarResultadoFinal.classList.add("oculto")
                PLAYER.classList.remove("oculto")
                mostrarResultadoFinal.innerHTML = ''
        })

        divResulFinal.appendChild(titulo)
        divResulFinal.appendChild(pResultat)
        divResulFinal.appendChild(btnNouJoc)
        mostrarResultadoFinal.appendChild(divResulFinal)
        mostrarResultadoFinal.classList.remove("oculto")
}

function introducirNombreParaJugar() {
        APP.classList.add("oculto")
        PLAYER.innerHTML = ''

        if (PLAYER) {
                const pLink = document.createElement("p")
                pLink.textContent = 'Panell Administrador'
                const link = document.createElement("a")
                link.href = './backPanel.html'
                link.appendChild(pLink)
                PLAYER.appendChild(link)

                const nombresGuardados = JSON.parse(localStorage.getItem("nombresUsuarios")) || []
                mostrarSeleccionNombre(nombresGuardados, PLAYER, link)
        }

}

function mostrarSeleccionNombre(nombresGuardados, PLAYER, link) {
        const divPlayer = document.createElement("div")

        // Crear un desplegable para seleccionar un nombre para jugar
        if (nombresGuardados.length > 0) {
                const select = document.createElement("select")
                select.id = "selectNombre"

                nombresGuardados.forEach(nombre => { // itero sobre la cantidad de nombres que hay para saber la longitud del desblegable
                        const option = document.createElement("option")
                        option.value = nombre
                        option.textContent = nombre
                        select.appendChild(option)
                })

                divPlayer.appendChild(select)

                // Botón para seleccionar el nombre y comenzar el juego
                const buttonJugar = document.createElement("button")
                buttonJugar.textContent = "Seleccionar y jugar"
                buttonJugar.addEventListener("click", () => {
                        const nombreSeleccionado = select.value
                        link.classList.add("oculto")
                        iniciarJuego(nombreSeleccionado, PLAYER)
                })

                divPlayer.appendChild(buttonJugar)

                // Desplegable para seleccionar un nombre para eliminar
                const selectEliminar = document.createElement("select")
                selectEliminar.id = "selectEliminarNombre"
                selectEliminar.appendChild(document.createElement("option")) // Opción vacía

                nombresGuardados.forEach(nombre => { // itero sobre la cantidad de nombres que hay para saber la longitud del desblegable
                        const option = document.createElement("option")
                        option.value = nombre
                        option.textContent = nombre
                        selectEliminar.appendChild(option)
                })

                divPlayer.appendChild(selectEliminar)

                // Botón para eliminar el nombre seleccionado
                const buttonEliminar = document.createElement("button")
                buttonEliminar.textContent = "Eliminar nombre"
                buttonEliminar.addEventListener("click", () => {
                        const nombreAEliminar = selectEliminar.value
                        if (nombreAEliminar) {
                                eliminarNombre(nombreAEliminar)
                        } else {
                                alert("Selecciona un nombre para eliminar.")
                        }
                        location.reload()
                })

                divPlayer.appendChild(buttonEliminar)
        } else {
                const mensaje = document.createElement("p")
                mensaje.textContent = "No hi ha noms enmagatzemats. Si us plau, introdueix-ne un."
                divPlayer.appendChild(mensaje)
        }

        // Crear el formulario para agregar un nuevo nombre
        const LABEL = document.createElement("label")
        LABEL.textContent = `Escriu el teu nom de jugador:`

        const INPUT = document.createElement("input")
        INPUT.type = "text"
        INPUT.id = "nombre"

        const BUTTON = document.createElement("button")
        BUTTON.textContent = `Guarda nom`

        BUTTON.addEventListener("click", () => {
                const nombre = document.getElementById("nombre").value;
                if (nombre) {
                        // Obtengo los nombres guardados de lo contrario creo un array vacio
                        const nombresGuardados = JSON.parse(localStorage.getItem("nombresUsuarios")) || []
                        if (!nombresGuardados.includes(nombre)) { // Verificar si el nombre ya está guardado
                                nombresGuardados.push(nombre)
                                localStorage.setItem("nombresUsuarios", JSON.stringify(nombresGuardados)) // Guardar en localStorage
                                console.log(`Nombre guardado: ${nombre}`)
                                location.reload()
                        } else {
                                alert("El nom ja està guardat. Prova amb un altre.")
                        }
                } else {
                        alert("Siusplau, introduiex un nom")
                }
        })

        const LABELpreguntes = document.createElement("label")
        LABELpreguntes.textContent = `Escriu la quantita de preguntes:`

        const inputCantPreg = document.createElement("input")
        inputCantPreg.type = "text"
        inputCantPreg.id = "cantPreguntes"

        const btnCantPreg = document.createElement("button")
        btnCantPreg.textContent = "Selecciona quantiat"
        btnCantPreg.addEventListener("click", () => {
                const cantitaPreguntes = document.getElementById("cantPreguntes").value;
                localStorage.setItem("cantPreg", cantitaPreguntes)
        })

        divPlayer.appendChild(LABEL)
        divPlayer.appendChild(INPUT)
        divPlayer.appendChild(BUTTON)
        divPlayer.appendChild(LABELpreguntes)
        divPlayer.appendChild(inputCantPreg)
        divPlayer.appendChild(btnCantPreg)

        PLAYER.appendChild(divPlayer)
}

function eliminarNombre(nombre) {
        const nombresGuardados = JSON.parse(localStorage.getItem("nombresUsuarios")) || []

        const nuevosNombres = []

        for (let i = 0; i < nombresGuardados.length; i++) {
                if (nombresGuardados[i] !== nombre) {
                        nuevosNombres.push(nombresGuardados[i]) // si no es el nombre a eliminar me lo guardo
                }
        }
        location.reload()
        localStorage.setItem("nombresUsuarios", JSON.stringify(nuevosNombres));
        console.log(`Nombre eliminado: ${nombre}`)
}

// Función para iniciar el juego con el nombre seleccionado
function iniciarJuego(nombreJugador, PLAYER) {
        console.log(`El jugador ${nombreJugador} está listo para jugar.`);
        inicializarApp()
        PLAYER.classList.add("oculto")
}

introducirNombreParaJugar()
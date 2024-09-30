
const APP = document.getElementById("app")
const ENVIARRESPOSTES = document.getElementById("enviaRespostes")
const NOUJOC = document.getElementById("nouJoc")
const ANTERIOR = document.getElementById("anterior")
const SEGUENT = document.getElementById("seguent")
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

        const CANTPREG = 4
        let data = []

        data = await getData(CANTPREG)
        estatPartida = crearEstatPartida(data.length)
        cargarPreguntas(data)

        APP.classList.add("visible")
        NOUJOC.classList.add("visible")
        ENVIARRESPOSTES.classList.add("visible")
        ANTERIOR.classList.add("visible")
        SEGUENT.classList.add("visible")

        ANTERIOR.addEventListener("click", () => {
                if (indexPreg > 0) {
                        indexPreg--
                        mostrarPreguntaActual()
                }
        })
        SEGUENT.addEventListener("click", () => {
                if (indexPreg < data.length) {
                        indexPreg++
                        if (indexPreg >= data.length) {
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

function mostrarResultadoFinal(estatPartida) { // arreglar lo de abajo para inyectarlo desde el js
        APP.innerHTML += `<h3>Enhorabona, has acabat el qüestionari.</h3>
        <p>Pots tornar enrere si vols repondre de nou abans d'envia les respostes.</p>`
        ENVIARRESPOSTES.style.visibility = "visible"
        ENVIARRESPOSTES.addEventListener("click", async () => {
                try {
                        const RESUL = await sendData(estatPartida)
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
                const divPregunta = document.createElement("div")
                divPregunta.classList.add("pregunta")
                if (indexPreg === index) {
                        divPregunta.classList.add("visible")
                } else {
                        divPregunta.classList.add("oculto")
                }
                const titulo = document.createElement("p")
                titulo.textContent = `${index + 1}- ${pregunta.pregunta}`
                divPregunta.appendChild(titulo)
                for (const resposta of pregunta.respostes) {
                        const divRespostes = document.createElement("div")
                        const respostaBoton = document.createElement("button")
                        respostaBoton.addEventListener("click", () => {
                                estatPartida.preguntes[index].resposta = resposta.indexResposta
                        })
                        respostaBoton.textContent = resposta.resposta
                        divRespostes.appendChild(respostaBoton)
                        divPregunta.appendChild(divRespostes)
                }
                APP.appendChild(divPregunta)
        }
}

function introducirNombreParaJugar() {
        const PLAYER = document.getElementById("playerName")

        if (PLAYER) {
                APP.classList.add("oculto")
                NOUJOC.classList.add("oculto")
                ENVIARRESPOSTES.classList.add("oculto")
                ANTERIOR.classList.add("oculto")
                SEGUENT.classList.add("oculto")

                // obtengo los nombres guardados en el localStorage
                const nombresGuardados = JSON.parse(localStorage.getItem("nombresUsuarios")) || []
                mostrarSeleccionNombre(nombresGuardados, PLAYER)
        }
}

function mostrarSeleccionNombre(nombresGuardados, PLAYER) {
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
                        iniciarJuego(nombreSeleccionado, divPlayer)
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
                })

                divPlayer.appendChild(buttonEliminar)
        } else {
                const mensaje = document.createElement("p")
                mensaje.textContent = "No hay nombres guardados. Por favor, agrega uno."
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
                        } else {
                                alert("El nom ja està guardat. Prova amb un altre.")
                        }
                } else {
                        alert("Siusplau, introduiex un nom")
                }
        })

        divPlayer.appendChild(LABEL)
        divPlayer.appendChild(INPUT)
        divPlayer.appendChild(BUTTON)

        PLAYER.appendChild(divPlayer)
        console.log(PLAYER)
}

function eliminarNombre(nombre) {
        // Obtengo los nombres guardados en el localStorage o en un array vacio si no existe
        const nombresGuardados = JSON.parse(localStorage.getItem("nombresUsuarios")) || []
        
        // Array para los nombres que no se van a eliminar
        const nuevosNombres = []
    
        for (let i = 0; i < nombresGuardados.length; i++) {
            // Verifico si el nombre actual es el que quiero eliminar
            if (nombresGuardados[i] !== nombre) {
                // Si no es el nombre a eliminar, me lo guardo
                nuevosNombres.push(nombresGuardados[i])
            }
        }
    
        localStorage.setItem("nombresUsuarios", JSON.stringify(nuevosNombres));
        console.log(`Nombre eliminado: ${nombre}`)
    }
    

// Función para iniciar el juego con el nombre seleccionado
function iniciarJuego(nombreJugador, divPlayer) {
        console.log(`El jugador ${nombreJugador} está listo para jugar.`);
        inicializarApp()
        divPlayer.classList.add("oculto")
}

function pintarResultatFinal(resultat) {

        APP.innerHTML = ``

        ENVIARRESPOSTES.style.display = "none"
        ANTERIOR.style.display = "none"
        SEGUENT.style.display = "none"

        if (resultat.respCorr == undefined) {
                resultat.respCrr = 0
        }
        APP.innerHTML += `<h2>Resultat final</h2>
        Preguntes correctes ${resultat.respCorr}/${resultat.totalPreg}`
        NOUJOC.style.display = "block"

        // console.log(resultat.respCorr)
        // console.log(resultat.totalPreg)
}


introducirNombreParaJugar()

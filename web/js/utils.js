const APP = document.getElementById("app")
const PLAYER = document.getElementById("playerName")
const cantidadPreguntas = document.getElementById("cantPreg")
const contadorDiv = document.getElementById("contador");
let nombreSeleccionadoJugador = 0
let indexPreg = 0
let estatPartida = null
let data = []
let temporizador

function crearEstatPartida() {
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

        // inicializa el temporizador
        if (cantidadPreguntas == 5) {
                tiempoRestante = 30
        }
        if (cantidadPreguntas == 10) {
                tiempoRestante = 60
        }
        if (cantidadPreguntas == 15) {
                tiempoRestante = 90
        }
        console.log(cantidadPreguntas);

        const htemporizador = document.createElement("h2")
        htemporizador.textContent = `Temps restant: ${tiempoRestante}s`

        temporizador = setInterval(() => {
                tiempoRestante--;

                htemporizador.textContent = `Temps restant: ${tiempoRestante}s`;

                if (tiempoRestante <= 10) {
                        htemporizador.innerHTML = `Temps restant: <span style="color: orange;">${tiempoRestante}</span>s`;
                }
                if (tiempoRestante <= 5) {
                        htemporizador.innerHTML = `Temps restant: <span style="color: red;">${tiempoRestante}</span>s`;
                }

                if (tiempoRestante <= 0) {
                        clearInterval(temporizador); // Detener el temporizador

                        Swal.fire({
                                icon: "error",
                                title: "S'ha esgotat el temps!!!",
                        });
                        enviarRespuestasAutomaticamente();
                }
        }, 1000);

        contadorDiv.appendChild(htemporizador)
}

// Función que se llama automáticamente cuando el tiempo se agota
async function enviarRespuestasAutomaticamente() {
        APP.classList.add("oculto")
        const finalizarQuiz = document.getElementById("finalizarQuiz");

        try {
                const RESUL = await sendData(estatPartida);
                console.log(RESUL)
                pintarResultatFinal(RESUL, finalizarQuiz);
        } catch (error) {
                console.error('Error al enviar las respuestas automáticamente:', error);
        }
}

// Iniciar el juego con temporizador
function iniciarJuego(nombreJugador) {
        console.log(`El jugador ${nombreJugador} está listo para jugar.`);

        inicializarApp(); // Iniciar las preguntas

        // Ocultar el input de nombre y comenzar el temporizador
        PLAYER.classList.add("oculto");

        // Iniciar el temporizador de 30 segundos
        iniciarTemporizador();
}

// Mostrar la pregunta actual y detener el temporizador si el jugador termina antes
function mostrarResultadoFinal(estatPartida) {
        clearInterval(temporizador); // Detener el temporizador cuando el jugador termina
        APP.classList.add("oculto");

        const finalizarQuiz = document.getElementById("finalizarQuiz");
        finalizarQuiz.innerHTML = '';

        finalizarQuiz.classList.remove("oculto");

        const divMostrarResulFinal = document.createElement("div");

        const enhorabuena = document.createElement("h3");
        enhorabuena.innerHTML = `Enhorabona <span style="color: blueviolet;">${nombreSeleccionadoJugador}</span>, has acabat el qüestionari.`;

        divMostrarResulFinal.appendChild(enhorabuena);

        finalizarQuiz.appendChild(divMostrarResulFinal);

        const btnEnviarespostes = document.createElement("button");
        btnEnviarespostes.textContent = 'Enviar respostes';
        btnEnviarespostes.addEventListener("click", async () => {
                try {
                        const RESUL = await sendData(estatPartida);
                        pintarResultatFinal(RESUL, finalizarQuiz);
                } catch (error) {
                        console.error('Error al enviar los datos:', error);
                }
        });

        finalizarQuiz.appendChild(btnEnviarespostes);
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
                        const divRespostes = document.createElement("div");
                        const respostaBoton = document.createElement("button");

                        respostaBoton.textContent = resposta.resposta;

                        respostaBoton.addEventListener("click", () => {
                                const botones = divRespostes.parentNode.querySelectorAll("button") // Selecciona todos los botones en el mismo contenedor
                                botones.forEach(boton => {
                                        boton.classList.remove("button-pulsado")
                                })
                                respostaBoton.classList.add("button-pulsado")

                                // Guardar la respuesta seleccionada
                                estatPartida.preguntes[indexPregunta].resposta = indexResp + 1
                        })

                        divRespostes.appendChild(respostaBoton)
                        divPregunta.appendChild(divRespostes)
                }

                APP.appendChild(divPregunta)
        }

        // Inicializar la primera pregunta
        indexPreg = 0
        mostrarPreguntaActual()

        // Botón Anterior
        const btnAnterior = document.createElement("button")
        btnAnterior.textContent = "Anterior"
        btnAnterior.classList.add("btnDisabled") // Deshabilitar al inicio
        btnAnterior.addEventListener("click", () => {
                if (indexPreg > 0) {
                        indexPreg--
                        if (indexPreg == 0) {
                                btnAnterior.classList.add("btnDisabled") // Deshabilitar en la primera pregunta
                        }
                        btnSiguiente.classList.remove("btnDisabled") // Habilitar el botón de Siguiente
                        mostrarPreguntaActual()
                }
        })
        APP.appendChild(btnAnterior)

        // Botón Siguiente
        const btnSiguiente = document.createElement("button")
        btnSiguiente.textContent = "Següent"
        btnSiguiente.addEventListener("click", () => {
                if (indexPreg < data.length - 1) { // Cambiado a data.length - 1 para evitar salir del array
                        indexPreg++
                        btnAnterior.classList.remove("btnDisabled") // Habilitar el botón de Anterior
                        if (indexPreg === data.length - 1) {
                                btnSiguiente.classList.add("btnDisabled") // Deshabilitar en la última pregunta
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

        const mostrarResultadoFinal = document.getElementById("mostrarResultadoFinal")

        console.log(resultat)

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
        pFallat.textContent = `El resultat total es el següent:`
        divResulFinal.appendChild(pFallat)

        console.log('Estado de la partida', estatPartida)
        console.log('Estado de las preguntas: ', resultat.estadoPreguntas);

        for (let i = 0; i < resultat.totalPreg; i++) {
                let resposta = resultat.estadoPreguntas[i] == 1
                        ? "bé"
                        : (resultat.estadoPreguntas[i] == 0
                                ? "malament"
                                : "no contestada")

                console.log(resposta);

                const pPreguntes = document.createElement("p")
                pPreguntes.textContent = `Pregunta ${i + 1}: ${resposta}`
                divResulFinal.appendChild(pPreguntes)
        }

        const btnNouJoc = document.createElement("button")
        btnNouJoc.textContent = 'Tornar a jugar'
        btnNouJoc.addEventListener("click", async () => {
                endQuiz()
                cargarPreguntas()
                introducirNombreParaJugar()
                mostrarResultadoFinal.classList.add("oculto")
                PLAYER.classList.remove("oculto")
                mostrarResultadoFinal.innerHTML = ''
        })

        divResulFinal.appendChild(btnNouJoc)
        mostrarResultadoFinal.appendChild(divResulFinal)
        mostrarResultadoFinal.classList.remove("oculto")
}

function introducirNombreParaJugar() {
        APP.classList.add("oculto")
        cantidadPreguntas.classList.add("oculto")
        contadorDiv.classList.add("oculto")
        PLAYER.innerHTML = ''

        if (PLAYER) {
                const pLink = document.createElement("p")
                pLink.textContent = 'Panell Administrador'
                const link = document.createElement("a")
                link.href = './backPanel.html'
                link.appendChild(pLink)
                PLAYER.appendChild(link)

                const nombresGuardados = JSON.parse(localStorage.getItem("nombresUsuarios")) || []
                mostrarSeleccionNombre(nombresGuardados, link)
        }

}

function mostrarSeleccionNombre(nombresGuardados, link) {
        const divPlayer = document.createElement("div")
        // divPlayer.innerHTML = ''

        const select = document.createElement("select")
        const selectEliminar = document.createElement("select")

        // Crear un desplegable para seleccionar un nombre para jugar
        if (nombresGuardados.length > 0) {
                select.id = "selectNombre"

                nombresGuardados.forEach(nombre => {
                        const option = document.createElement("option")
                        option.value = nombre
                        option.textContent = nombre
                        select.appendChild(option)
                })
                divPlayer.appendChild(select)

                // Botón para seleccionar el nombre y comenzar el juego
                const buttonJugar = document.createElement("button")
                buttonJugar.textContent = "Seleccionar nom"
                buttonJugar.addEventListener("click", () => {
                        PLAYER.classList.add("oculto")
                        link.classList.add("oculto")
                        cantidadPreguntas.classList.add("oculto")
                        cantidadPreguntas.innerHTML = ''
                        nombreSeleccionadoJugador = select.value
                        seleccionarCantidadPreguntas()
                })
                divPlayer.appendChild(buttonJugar)

                // Desplegable para seleccionar un nombre para eliminar
                selectEliminar.id = "selectEliminarNombre"
                selectEliminar.appendChild(document.createElement("option")) // Opción vacía

                nombresGuardados.forEach(nombre => {
                        const option = document.createElement("option")
                        option.value = nombre
                        option.textContent = nombre
                        selectEliminar.appendChild(option)
                })
                divPlayer.appendChild(selectEliminar)

                // Botón para eliminar el nombre seleccionado
                const buttonEliminar = document.createElement("button")
                buttonEliminar.textContent = "Eliminar nom"
                buttonEliminar.addEventListener("click", () => {
                        const nombreAEliminar = selectEliminar.value
                        if (nombreAEliminar) {
                                eliminarNombre(nombreAEliminar) // Eliminar nombre de localStorage
                                nombresGuardados = nombresGuardados.filter(nombre => nombre !== nombreAEliminar)
                                // Actualizar visualización del select
                                actualizarSelectores(select, selectEliminar, nombresGuardados)
                                // divPlayer.innerHTML = ''
                                console.log(nombresGuardados.length)
                                // if(nombresGuardados.length > 0){
                                //         console.log("se muestran los botones e inputs")
                                //         mostrarSeleccionNombre(nombresGuardados, link)
                                // } else {
                                //         console.log("se dejan de mostrar los botones e inputs")
                                // }
                        } else {
                                Swal.fire({
                                        icon: "error",
                                        title: "Oops...",
                                        text: "Selecciona un nom a eliminar.",
                                });
                        }
                })
                divPlayer.appendChild(buttonEliminar)
        } else {
                const mensaje = document.createElement("p")
                mensaje.textContent = "No hi ha noms emmagatzemats. Si us plau, introdueix-ne un."
                divPlayer.appendChild(mensaje)
        }


        // Crear el formulario para agregar un nuevo nombre
        const LABEL = document.createElement("label")
        LABEL.textContent = `Escriu el teu nom de jugador:`

        const INPUT = document.createElement("input")
        INPUT.type = "text"
        INPUT.id = "nombre"
        INPUT.placeholder = 'Màxim 15 caràcters'

        const BUTTON = document.createElement("button")
        BUTTON.textContent = `Guarda nom`

        BUTTON.addEventListener("click", () => {
                const nombre = document.getElementById("nombre").value
                if (nombre) {
                        if (nombre.length <= 15) {
                                const nombresGuardados = JSON.parse(localStorage.getItem("nombresUsuarios")) || []
                                if (!nombresGuardados.includes(nombre)) { // Verificar si el nombre ya está guardado
                                        nombresGuardados.push(nombre)
                                        localStorage.setItem("nombresUsuarios", JSON.stringify(nombresGuardados)) // Guardar en localStorage
                                        INPUT.value = ''
                                        console.log(`Nombre guardado: ${nombre}`)
                                        // poner aqui el sweetAlert de que se esta gaurdando
                                        location.reload() // QUITAR
                                        // Actualizar visualización del select
                                        actualizarSelectores(select, selectEliminar, nombresGuardados)
                                        // mostrarSeleccionNombre(nombresGuardados, link)
                                } else {
                                        Swal.fire({
                                                icon: "error",
                                                title: "Oops...",
                                                text: "El nom ja està guardat. Prova amb un altre.",
                                        });
                                        INPUT.value = ''
                                }
                        } else {
                                Swal.fire({
                                        icon: "error",
                                        title: "Oops...",
                                        text: "Nom masa llarg.",
                                });
                                INPUT.value = ''
                        }
                } else {
                        Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Siusplau, introdueix un nom.",
                        });
                }
        })

        divPlayer.appendChild(LABEL)
        divPlayer.appendChild(INPUT)
        divPlayer.appendChild(BUTTON)

        PLAYER.appendChild(divPlayer)
}


function actualizarSelectores(select, selectEliminar, nombresGuardados) {

        // Limpiar las opciones existentes en ambos selects
        select.innerHTML = '';
        selectEliminar.innerHTML = '<option></option>'; // Agregar opción vacía en selectEliminar

        // Agregar las opciones nuevas basadas en nombresGuardados
        nombresGuardados.forEach(nombre => {
                const option = document.createElement("option");
                option.value = nombre;
                option.textContent = nombre;
                select.appendChild(option);

                const optionEliminar = document.createElement("option");
                optionEliminar.value = nombre;
                optionEliminar.textContent = nombre;
                selectEliminar.appendChild(optionEliminar);
        });

}

function eliminarNombre(nombre) {
        const nombresGuardados = JSON.parse(localStorage.getItem("nombresUsuarios")) || []

        const nuevosNombres = []

        for (let i = 0; i < nombresGuardados.length; i++) {
                if (nombresGuardados[i] !== nombre) {
                        nuevosNombres.push(nombresGuardados[i]) // si no es el nombre a eliminar me lo guardo
                }
        }
        // poner aqui el sweetAlert de que se a eliminado correctamente

        location.reload() // QUITAR
        localStorage.setItem("nombresUsuarios", JSON.stringify(nuevosNombres));
        console.log(`Nombre eliminado: ${nombre}`)
}

function seleccionarCantidadPreguntas() {
        cantidadPreguntas.classList.remove("oculto")

        const divCantPreg = document.createElement("div")

        const LABELpreguntes = document.createElement("label")
        LABELpreguntes.textContent = `Digues la quantitat de preguntes:`

        localStorage.setItem("cantPreg", 0) // seteo la cantidad de preguntas

        // Escoger la cantidad de preguntas segun el nivel de dificultad
        const selectCantPreg = document.createElement("select")
        selectCantPreg.id = "slecetCantPreg"
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
                const cantitaPreguntes = document.getElementById("slecetCantPreg").value
                localStorage.setItem("cantPreg", cantitaPreguntes)
                iniciarJuego(nombreSeleccionadoJugador)
                cantidadPreguntas.classList.add("oculto")
        })

        divCantPreg.appendChild(LABELpreguntes)
        // divCantPreg.appendChild(inputCantPreg)
        divCantPreg.appendChild(selectCantPreg)
        divCantPreg.appendChild(btnCantPreg)

        cantidadPreguntas.appendChild(divCantPreg)
}

introducirNombreParaJugar()
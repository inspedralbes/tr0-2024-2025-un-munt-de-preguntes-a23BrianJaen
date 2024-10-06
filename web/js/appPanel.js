const MOSTRAPREGUNTES = document.getElementById("mostraPreguntes")

async function getData() {
    const URL = `./php/panelBack.php`
    const REQUEST = await fetch(URL)
    const JSON = await REQUEST.json()
    return JSON
}

async function mostrarBBDD() {
    let data = []
    data = await getData()
    cargarPreguntas(data)
}

async function sendDataInsert(formularioInsert) {
    const URL = `./php/insertarPregunta.php`
    const RESPONSE = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: formularioInsert
    })
}

async function sendDataUpdate(formularioUpdate) {
    const URL = `./php/editarPregunta.php`
    const RESPONSE = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: formularioUpdate
    })
}
async function sendDataUpdateQuick(formularioUpdate) {
    const URL = `./php/editarPreguntaQuick.php`
    const RESPONSE = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: formularioUpdate
    })
}

async function cargarPreguntas(data) {
    MOSTRAPREGUNTES.innerHTML = ''

    const divInsertar = document.createElement("div")
    divInsertar.classList.add("sticky-button")
    const titol = document.createElement("h2")
    titol.textContent = "Inserció de Pregunta"

    const botoInsertar = document.createElement("button")
    botoInsertar.textContent = "Inserir una pregunta"
    MOSTRAPREGUNTES.appendChild(titol)

    botoInsertar.addEventListener("click", () => {
        insertarPregunta()
    })

    divInsertar.appendChild(botoInsertar)
    MOSTRAPREGUNTES.appendChild(divInsertar)

    const tabla = document.createElement("table")
    const cabecera = document.createElement("thead")
    const filaCabecera = document.createElement("tr")

    const cabeceraId = document.createElement("th")
    cabeceraId.textContent = "ID Pregunta"
    filaCabecera.appendChild(cabeceraId)

    const cabeceraPregunta = document.createElement("th")
    cabeceraPregunta.textContent = "Pregunta"
    filaCabecera.appendChild(cabeceraPregunta)

    const cabeceraRespostes = document.createElement("th")
    cabeceraRespostes.textContent = "Respostes"
    filaCabecera.appendChild(cabeceraRespostes)

    const cabeceraRespostesCorrectes = document.createElement("th")
    cabeceraRespostesCorrectes.textContent = "Correctes"
    filaCabecera.appendChild(cabeceraRespostesCorrectes)

    const cabeceraAccions = document.createElement("th")
    cabeceraAccions.textContent = "Accions"
    filaCabecera.appendChild(cabeceraAccions)

    cabecera.appendChild(filaCabecera)
    tabla.appendChild(cabecera)

    const cos = document.createElement("tbody")

    for (const [index, pregunta] of data.entries()) {
        const filaPregunta = document.createElement("tr")

        const celdaId = document.createElement("td")
        celdaId.textContent = pregunta.idPregunta
        filaPregunta.appendChild(celdaId)

        const celdaTexto = document.createElement("td")
        celdaTexto.id = `pregunta${index}`
        celdaTexto.textContent = pregunta.pregunta
        filaPregunta.appendChild(celdaTexto)

        const celdaRespostes = document.createElement("td")
        const listaRespostes = document.createElement("ul")

        const celdaRespostesCorrectes = document.createElement("td")
        const listaRespostesCorrectes = document.createElement("ul")

        let idRespEditQuick = []
        let idRespCorrEditQuick = []

        for (const [indexResp, resposta] of (pregunta.respostes || []).entries()) {
            // Asegurar que 'resposta' es un objecte valid
            if (!resposta || typeof resposta !== 'object') {
                console.error(`Error: 'resposta' no es un objeto válido en la pregunta con id: ${pregunta.idPregunta}`)
                continue
            }

            const itemResposta = document.createElement("li")
            itemResposta.textContent = resposta.resposta || 'Respuesta no disponible'
            itemResposta.id = `resposta_${index}_${indexResp}`
            idRespEditQuick[indexResp] = itemResposta.id

            itemResposta.textContent += ` ${resposta.idResposta || 'ID no disponible'} 🢘 ID`
            listaRespostes.appendChild(itemResposta)

            const respCorr = resposta.respostaCorrecta == 1 ? "true" : "false"

            const respostaCorr = document.createElement("li")
            respostaCorr.textContent = respCorr
            respostaCorr.id = `respostaCorr_${index}_${indexResp}`
            idRespCorrEditQuick[indexResp] = respostaCorr.id

            listaRespostesCorrectes.appendChild(respostaCorr)
        }


        celdaRespostes.appendChild(listaRespostes)

        celdaRespostesCorrectes.appendChild(listaRespostesCorrectes)

        filaPregunta.appendChild(celdaRespostes)
        filaPregunta.appendChild(celdaRespostesCorrectes)

        // Celda d'accions
        const celdaAccions = document.createElement("td")

        const botoEdit = document.createElement("button")
        botoEdit.textContent = "Edita"

        botoEdit.addEventListener("click", () => {
            console.log(`Editant la pregunta: ${pregunta.idPregunta} - ${pregunta.pregunta}`)
            editaPregunta(pregunta)
        })
        celdaAccions.appendChild(botoEdit)

        // Botó Eliminar
        const botoEliminar = document.createElement("button")
        botoEliminar.textContent = "Eliminar"
        botoEliminar.addEventListener("click", async () => {
            console.log(`Eliminar la pregunta: ${pregunta.idPregunta} - ${pregunta.pregunta}`)
            eliminarPregunta(pregunta.idPregunta)
        })
        celdaAccions.appendChild(botoEliminar)

        const botoQuickEdit = document.createElement("button")
        botoQuickEdit.textContent = "Edició ràpida"
        botoQuickEdit.addEventListener("click", () => {

            const thQuickEditPreg = document.getElementById(`pregunta${index}`)

            for (const [indexResp, resposta] of pregunta.respostes.entries()) {
                const thQuickEditResp = document.getElementById(`resposta_${index}_${indexResp}`)
                const thQuickEditRespCorr = document.getElementById(`respostaCorr_${index}_${indexResp}`)

                if (thQuickEditResp) {
                    idRespEditQuick[indexResp] = thQuickEditResp
                }
                if (thQuickEditRespCorr) {
                    idRespCorrEditQuick[indexResp] = thQuickEditRespCorr
                }
            }

            editaPreguntaRapid(pregunta, thQuickEditPreg, idRespEditQuick, idRespCorrEditQuick, botoQuickEdit, celdaAccions, botoEdit, botoEliminar)
        })
        celdaAccions.appendChild(botoQuickEdit)
        filaPregunta.appendChild(celdaAccions)

        cos.appendChild(filaPregunta)
    }

    // Afegir el cos de la tabla a la tabla
    tabla.appendChild(cos)
    MOSTRAPREGUNTES.appendChild(tabla)

    const divJuego = document.createElement("div")
    divJuego.classList.add("sticky-button-volver")
    const btnVolverAlJuego = document.createElement("button")
    const tituloJuago = document.createElement("h2")
    tituloJuago.textContent = 'Tornar al joc'

    const link = document.createElement("a")
    link.href = './index.html'
    link.textContent = 'Anar al joc'

    btnVolverAlJuego.appendChild(link)
    divJuego.appendChild(tituloJuago)
    divJuego.appendChild(btnVolverAlJuego)

    MOSTRAPREGUNTES.appendChild(divJuego)

}

async function editaPreguntaRapid(pregunta, thQuickEditPreg, idRespEditQuick, idRespCorrEditQuick, botoQuickEdit, celdaAccions, botoEdit, botoEliminar) {
    botoQuickEdit.classList.add("oculto")
    botoEdit.classList.add("oculto")
    botoEliminar.classList.add("oculto")

    thQuickEditPreg.innerHTML = ""
    const INPUTPREGUNTA = document.createElement("input")
    INPUTPREGUNTA.type = "text"
    INPUTPREGUNTA.size = pregunta.pregunta.length
    INPUTPREGUNTA.value = pregunta.pregunta
    thQuickEditPreg.appendChild(INPUTPREGUNTA)

    // Arrays per emmagatzemar els inputs de les respostes i els IDs
    const respuestasInputs = []
    const respuestasIds = []
    let respuestaCorrectaSeleccionada // Per emmagatzemar les respostes correctes

    for (let i = 0; i < pregunta.respostes.length; i++) {
        const thQuickEditResp = idRespEditQuick[i]
        thQuickEditResp.innerHTML = ""

        // Input per el text de la resposta
        const INPUTRESPOSTES = document.createElement("input")
        INPUTRESPOSTES.type = "text"
        INPUTRESPOSTES.size = pregunta.respostes[i].resposta.length
        INPUTRESPOSTES.value = pregunta.respostes[i].resposta
        thQuickEditResp.appendChild(INPUTRESPOSTES)

        // Desa inputs de respostes i els seus IDs
        respuestasInputs.push(INPUTRESPOSTES)
        respuestasIds.push(pregunta.respostes[i].idResposta)

        const thQuickEditRespCorr = idRespCorrEditQuick[i]
        thQuickEditRespCorr.innerHTML = ""

        // Input tipus "radio" per seleccionar la resposta correcta
        const INPUTRESPOTESCORRECTES = document.createElement("input")
        INPUTRESPOTESCORRECTES.type = "radio"
        INPUTRESPOTESCORRECTES.name = `respuestaCorrecta_${pregunta.idPregunta}` // Todos los radios de la misma pregunta tienen el mismo name
        INPUTRESPOTESCORRECTES.value = pregunta.respostes[i].idResposta

        // Establir el radio com seleccionat sí és la resposta correcta
        INPUTRESPOTESCORRECTES.checked = pregunta.respostes[i].respostaCorrecta == 1

        // Si el radio està marcat com a correcta, actualitzo la variable
        if (INPUTRESPOTESCORRECTES.checked) {
            respuestaCorrectaSeleccionada = pregunta.respostes[i].idResposta
        }

        // Event que actualitza la resposta correcta quan el radio canvia
        INPUTRESPOTESCORRECTES.addEventListener('change', () => {
            respuestaCorrectaSeleccionada = pregunta.respostes[i].idResposta
        })

        thQuickEditRespCorr.appendChild(INPUTRESPOTESCORRECTES)
    }

    const btnGuardarResul = document.createElement("button")
    btnGuardarResul.textContent = "Guardar cambios"
    btnGuardarResul.addEventListener("click", async () => {

        const datosActualizados = {
            idPregunta: pregunta.idPregunta,
            pregunta: INPUTPREGUNTA.value
        }

        for (let i = 0; i < pregunta.respostes.length; i++) {
            datosActualizados[`idResp${i + 1}`] = respuestasInputs[i].value
            datosActualizados[`idRespCorr${i + 1}`] = respuestaCorrectaSeleccionada === respuestasIds[i] ? 1 : 0 // Solo la respuesta seleccionada es correcta            
            datosActualizados[`idResposta${i + 1}`] = respuestasIds[i]
        }

        const jsonData = JSON.stringify(datosActualizados)

        await sendDataUpdateQuick(jsonData)
        completarSolicitud()

        const actualizaData = await getData()
        cargarPreguntas(actualizaData)

    })

    celdaAccions.appendChild(btnGuardarResul)

    const btnCanelar = document.createElement("button")
    btnCanelar.type = "button"
    btnCanelar.textContent = 'Cancela'
    btnCanelar.addEventListener("click", async () => {
        cancelarSolicitud()

        const actualizaData = await getData()
        cargarPreguntas(actualizaData)
        MOSTRAPREGUNTES.classList.remove("oculto")
        editar.classList.add("oculto")
    })

    celdaAccions.appendChild(btnCanelar)
}


function editaPregunta(pregunta) {

    MOSTRAPREGUNTES.classList.add("oculto")

    const editar = document.getElementById("editar")

    editar.innerHTML = ''
    editar.classList.remove("oculto")

    const divEditar = document.createElement("div")
    const FORMULARI = document.createElement("form")
    FORMULARI.id = "formulariEditar"

    document.body.appendChild(FORMULARI)

    const FORMULARIEditar = document.getElementById("formulariEditar")

    const INPUTID = document.createElement("input")
    INPUTID.type = "text"
    INPUTID.placeholder = "Id pregunta"
    INPUTID.name = "idPregunta"
    INPUTID.value = pregunta.idPregunta
    FORMULARIEditar.appendChild(INPUTID)

    const INPUTPREG = document.createElement("input")
    INPUTPREG.type = "text"
    INPUTPREG.placeholder = "Introdueix la pregunta"
    INPUTPREG.name = "pregunta"
    INPUTPREG.value = pregunta.pregunta
    FORMULARIEditar.appendChild(INPUTPREG)

    const CANTRESP = 4

    for (let i = 0; i < CANTRESP; i++) {
        // Camp de resopsta de text
        const INPUTRESP = document.createElement("input")
        INPUTRESP.type = "text"
        INPUTRESP.placeholder = `Resposta ${i + 1}`
        INPUTRESP.name = `idResp${i + 1}`
        INPUTRESP.value = pregunta.respostes[i].resposta
        FORMULARIEditar.appendChild(INPUTRESP)

        // Camp de ID de la resposta
        const INPUTIDRESP = document.createElement("input")
        INPUTIDRESP.type = "text"
        INPUTIDRESP.name = `idResposta${i + 1}`
        INPUTIDRESP.value = pregunta.respostes[i].idResposta
        FORMULARIEditar.appendChild(INPUTIDRESP)
    }

    const INPUTRESPCORR = document.createElement("input")
    INPUTRESPCORR.type = "number"
    INPUTRESPCORR.placeholder = "Id de la resposta correcta"
    INPUTRESPCORR.name = "idRespCorr"
    INPUTRESPCORR.value = pregunta.indexRespostaCorrecta
    FORMULARI.appendChild(INPUTRESPCORR)

    const botoSubmit = document.createElement("button")
    botoSubmit.type = "submit"
    botoSubmit.textContent = "Edita"
    FORMULARIEditar.appendChild(botoSubmit)

    const btnCanelar = document.createElement("button")
    btnCanelar.type = "button"
    btnCanelar.textContent = 'Cancela'
    btnCanelar.addEventListener("click", async () => {
        const actualizaData = await getData()
        cargarPreguntas(actualizaData)
        cancelarSolicitud()
        MOSTRAPREGUNTES.classList.remove("oculto")
        editar.classList.add("oculto")
    })

    FORMULARIEditar.appendChild(btnCanelar)

    FORMULARIEditar.addEventListener("submit", async (event) => {
        event.preventDefault()

        const formData = new FormData(FORMULARIEditar) // Transformo el formulari en un objecte simple

        const formObject = {}
        formData.forEach((valor, clau) => { // Agafo el nom de l'etiqueta i o poso com a clau, el que introdueix l'usuari com a valor
            formObject[clau] = valor
        })

        const jsonData = JSON.stringify(formObject)
        await sendDataUpdate(jsonData)

        completarSolicitud() 

        const actualizaData = await getData()
        cargarPreguntas(actualizaData)
        MOSTRAPREGUNTES.classList.remove("oculto")
        editar.classList.add("oculto")
    })

    divEditar.appendChild(FORMULARI)
    editar.appendChild(divEditar)
}

async function eliminarPregunta(idPregunta) {
    const idPreg = { idPreg: idPregunta }
    const URL = `./php/eliminarPregunta.php`
    const RESPONSE = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(idPreg)
    })

    completarSolicitud()
    const actualizaData = await getData()
    cargarPreguntas(actualizaData)
}

async function insertarPregunta() {
    MOSTRAPREGUNTES.classList.add("oculto")

    const INSERTAR = document.getElementById("insertar")

    INSERTAR.innerHTML = ''
    INSERTAR.classList.remove("oculto")

    const divInsertar = document.createElement("div")
    const FORMULARI = document.createElement("form")
    FORMULARI.id = "formulariInsertar"

    document.body.appendChild(FORMULARI)

    const FORMULARIINSRT = document.getElementById("formulariInsertar")

    const INPUTPREG = document.createElement("input")
    INPUTPREG.type = "text"
    INPUTPREG.placeholder = "Introdueix la pregunta"
    INPUTPREG.name = "pregunta"
    FORMULARIINSRT.appendChild(INPUTPREG)

    const CANTRESP = 4

    for (let i = 0; i < CANTRESP; i++) {
        const INPUTRESP = document.createElement("input")
        INPUTRESP.type = "text"
        INPUTRESP.placeholder = `Resposta ${i + 1}`
        INPUTRESP.name = `idResp${i + 1}`
        FORMULARIINSRT.appendChild(INPUTRESP)
    }

    const INPUTRESPCORR = document.createElement("input")
    INPUTRESPCORR.type = "number"
    INPUTRESPCORR.placeholder = "Id de la resposta correcta"
    INPUTRESPCORR.name = "idRespCorr"
    FORMULARI.appendChild(INPUTRESPCORR)

    const botoSubmit = document.createElement("button")
    botoSubmit.type = "submit"
    botoSubmit.textContent = "Inserir"
    FORMULARIINSRT.appendChild(botoSubmit)


    const btnCanelar = document.createElement("button")
    btnCanelar.type = "button"
    btnCanelar.textContent = 'Cancela'
    btnCanelar.addEventListener("click", async () => {
        cancelarSolicitud() 
        const actualizaData = await getData()
        cargarPreguntas(actualizaData)

        MOSTRAPREGUNTES.classList.remove("oculto")
        INSERTAR.classList.add("oculto")
    })

    FORMULARIINSRT.appendChild(btnCanelar)

    FORMULARIINSRT.addEventListener("submit", async (event) => {
        event.preventDefault()

        const formData = new FormData(FORMULARIINSRT) // Transformo el formulari en un objecte simple

        const formObject = {}
        formData.forEach((valor, clau) => { // Agafo el nom de l'etiqueta i o poso com a clau, el que introdueix l'usuari com a valor
            formObject[clau] = valor
        })

        const jsonData = JSON.stringify(formObject)
        await sendDataInsert(jsonData)

        completarSolicitud()
        const actualizaData = await getData()
        cargarPreguntas(actualizaData)


        MOSTRAPREGUNTES.classList.remove("oculto")
        INSERTAR.classList.add("oculto")
    })

    divInsertar.appendChild(FORMULARI)
    INSERTAR.appendChild(divInsertar)
}

function cancelarSolicitud() {
    let timerInterval
    Swal.fire({
        title: "Cancel·lant sol·licitud...",
        html: "Es tancara <b></b> milliseconds.",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            const timer = Swal.getPopup().querySelector("b")
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer")
        }
    })
}

function completarSolicitud() {
    let timerInterval
    Swal.fire({
        title: "Completant sol·licitud...",
        html: "Es tancara <b></b> milliseconds.",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading()
            const timer = Swal.getPopup().querySelector("b")
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`
            }, 100)
        },
        willClose: () => {
            clearInterval(timerInterval)
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer")
        }
    })
}

mostrarBBDD()
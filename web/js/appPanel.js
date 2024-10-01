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
    // console.log(formularioUpdate)
    const URL = `./php/editarPregunta.php`
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
        celdaTexto.textContent = pregunta.pregunta
        filaPregunta.appendChild(celdaTexto)

        const celdaRespostes = document.createElement("td")
        const listaRespostes = document.createElement("ul")

        const celdaRespostesCorrectes = document.createElement("td")
        const listaRespostesCorrectes = document.createElement("ul")

        let respCorr = false

        // Añadir las respuestas y las respuestas correctas
        for (const [indexResp, resposta] of pregunta.respostes.entries()) {
            const itemResposta = document.createElement("li")
            itemResposta.textContent = resposta.resposta
            itemResposta.textContent += ` ${resposta.idResposta} 🢘 ID`
            listaRespostes.appendChild(itemResposta)

            respCorr = pregunta.respostes[indexResp].respostaCorrecta == 1 ? "true" : "false"

            const respostaCorr = document.createElement("li")
            respostaCorr.textContent = respCorr

            listaRespostesCorrectes.appendChild(respostaCorr)
        }

        celdaRespostes.appendChild(listaRespostes)
        celdaRespostesCorrectes.appendChild(listaRespostesCorrectes)

        filaPregunta.appendChild(celdaRespostes)
        filaPregunta.appendChild(celdaRespostesCorrectes)

        // Celda de acciones
        const celdaAccions = document.createElement("td")

        const botoEdit = document.createElement("button")
        botoEdit.textContent = "Edita"

        botoEdit.addEventListener("click", () => {
            console.log(`Editant la pregunta: ${pregunta.idPregunta} - ${pregunta.pregunta}`)
            editaPregunta(pregunta)
        })

        celdaAccions.appendChild(botoEdit)

        // Botón Eliminar
        const botoEliminar = document.createElement("button")
        botoEliminar.textContent = "Eliminar"
        botoEliminar.addEventListener("click", async () => {
            console.log(`Eliminar la pregunta: ${pregunta.idPregunta} - ${pregunta.pregunta}`)
            eliminarPregunta(pregunta.idPregunta)
        })
        celdaAccions.appendChild(botoEliminar)

        filaPregunta.appendChild(celdaAccions)

        cos.appendChild(filaPregunta)
    }

    // Añadir el cuerpo de la tabla a la tabla
    tabla.appendChild(cos)
    MOSTRAPREGUNTES.appendChild(tabla)

    // Sección de inserción
    const divInsertar = document.createElement("div")
    const titol = document.createElement("h2")
    titol.textContent = "Inserció de Pregunta"
    const botoInsertar = document.createElement("button")
    botoInsertar.textContent = "Inserir una pregunta"
    MOSTRAPREGUNTES.appendChild(titol)

    botoInsertar.addEventListener("click", () => {
        console.log("Inserir pregunta")
        insertarPregunta()
    })

    divInsertar.appendChild(botoInsertar)
    MOSTRAPREGUNTES.appendChild(divInsertar)

    console.log(MOSTRAPREGUNTES)
}


function editaPregunta(pregunta) {

    // console.log(pregunta)

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
        // Campo de respuesta de texto
        const INPUTRESP = document.createElement("input")
        INPUTRESP.type = "text"
        INPUTRESP.placeholder = `Resposta ${i + 1}`
        INPUTRESP.name = `idResp${i + 1}`
        INPUTRESP.value = pregunta.respostes[i].resposta
        FORMULARIEditar.appendChild(INPUTRESP)

        // Campo de ID de la respuesta
        const INPUTIDRESP = document.createElement("input")
        INPUTIDRESP.type = "text"
        INPUTIDRESP.name = `idResposta${i + 1}`
        INPUTIDRESP.value = pregunta.respostes[i].idResposta
        INPUTIDRESP.readOnly = true  // Campo solo de lectura
        FORMULARIEditar.appendChild(INPUTIDRESP)
    }

    // console.log(pregunta.indexRespostaCorrecta)

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

    FORMULARIEditar.addEventListener("submit", async (event) => {
        event.preventDefault()

        const formData = new FormData(FORMULARIEditar)

        const formObject = {}
        formData.forEach((valor, clau) => {
            formObject[clau] = valor
        })

        const jsonData = JSON.stringify(formObject)

        // console.log(jsonData)

        await sendDataUpdate(jsonData)

        const actualizaData = await getData()
        cargarPreguntas(actualizaData)

        // preguntarle al Alvaro como refrescar la página
        MOSTRAPREGUNTES.classList.remove("oculto")
        editar.classList.add("oculto")
    })

    divEditar.appendChild(FORMULARI)
    editar.appendChild(divEditar)
    console.log(editar)
}

async function eliminarPregunta(idPregunta) {
    const idPreg = { idPreg: idPregunta }

    // console.log(JSON.stringify(idPreg))

    const URL = `./php/eliminarPregunta.php`
    const RESPONSE = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(idPreg)
    })

    const actualizaData = await getData()
    cargarPreguntas(actualizaData)
}

async function insertarPregunta() { // posiblemente quitar el estilo visible
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

    FORMULARIINSRT.addEventListener("submit", async (event) => {
        event.preventDefault()

        const formData = new FormData(FORMULARIINSRT)

        const formObject = {}
        formData.forEach((valor, clau) => {
            formObject[clau] = valor
        })

        const jsonData = JSON.stringify(formObject)
        // console.log(jsonData)

        await sendDataInsert(jsonData)

        const actualizaData = await getData()
        cargarPreguntas(actualizaData)

        MOSTRAPREGUNTES.classList.remove("oculto")
        INSERTAR.classList.add("oculto")
    })

    divInsertar.appendChild(FORMULARI)
    INSERTAR.appendChild(divInsertar)
    console.log(INSERTAR)
}

mostrarBBDD()
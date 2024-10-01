const MOSTRAPREGUNTES = document.getElementById("mostraPreguntes")

let data = []

async function getData() {
    const URL = `./php/panelBack.php`
    const REQUEST = await fetch(URL)
    const JSON = await REQUEST.json()
    return JSON
}

async function mostrarBBDD() {
    data = await getData()
    // console.log(data)
    cargarPreguntas(data)
}

async function sendData(formulario) {
    const URL = `./php/insertarPregunta.php`
    const RESPONSE = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: formulario
    })
    // return RESPUESTAS.json()
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

        // Botón Editar

        // const celdaAccions = document.createElement("td")

        // Añadir las respuestas y las respuestas correctas
        for (const [indexResp, resposta] of pregunta.respostes.entries()) {
            const itemResposta = document.createElement("li")
            itemResposta.textContent = resposta.resposta
            listaRespostes.appendChild(itemResposta)

            respCorr = pregunta.respostes[indexResp].respostaCorrecta == 1 ? "true" : "false"

            const respostaCorr = document.createElement("li")
            respostaCorr.textContent = respCorr

            listaRespostesCorrectes.appendChild(respostaCorr)

            // botoEdit.addEventListener("click", () => {
            //     console.log(`Editant la pregunta: ${pregunta.idPregunta} - ${resposta.resposta}`)
            //     editaPregunta(pregunta, resposta.resposta)
            // })
            // celdaAccions.appendChild(botoEdit)
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
            editaPregunta(pregunta, pregunta.idPregunta)
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

        // Agregar la celda de acciones a la fila
        filaPregunta.appendChild(celdaAccions)

        // Añadir la fila completa al cuerpo de la tabla
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


function editaPregunta(pregunta, idPregunta) {
    // MOSTRAPREGUNTES.classList.add("oculto")

    // const editar = document.getElementById("editar")

    // const divEditar = document.createElement("div")
    // const formulario = document.createElement("form")
    // formulario.id = "formularioEditar"

    // document.body.appendChild(formulario)

    // const formularioEditar = document.getElementById("formularioEditar")

    // let pregunta = document.getElementById("resultado").textContent;
    // document.getElementsByTagName('pregunta').value = "sekso";


    // editar.appendChild(divEditar)

    console.log(pregunta)

    MOSTRAPREGUNTES.classList.add("oculto")

    const editar = document.getElementById("editar")

    editar.innerHTML = ''
    editar.classList.remove("oculto")

    const divEditar = document.createElement("div")
    const FORMULARI = document.createElement("form")
    FORMULARI.id = "formulariEditar"

    document.body.appendChild(FORMULARI)

    const FORMULARIeditar = document.getElementById("formulariEditar")

    const INPUTPREG = document.createElement("input")
    INPUTPREG.type = "text"
    INPUTPREG.placeholder = "Introdueix la pregunta"
    INPUTPREG.name = "pregunta"
    INPUTPREG.value = pregunta.pregunta
    FORMULARIeditar.appendChild(INPUTPREG)

    const CANTRESP = 4

    
    for (let i = 0; i < CANTRESP; i++) {
        // console.log(pregunta.respostes[i].resposta)
        const INPUTRESP = document.createElement("input")
        INPUTRESP.type = "text"
        INPUTRESP.placeholder = `Resposta ${i + 1}`
        INPUTRESP.name = `idResp${i + 1}`
        INPUTRESP.value = pregunta.respostes[i].resposta
        FORMULARIeditar.appendChild(INPUTRESP)
    }

    console.log(pregunta.indexRespostaCorrecta)

    const INPUTRESPCORR = document.createElement("input")
    INPUTRESPCORR.type = "number"
    INPUTRESPCORR.placeholder = "Id de la resposta correcta"
    INPUTRESPCORR.name = "idRespCorr"
    INPUTRESPCORR.value = pregunta.indexRespostaCorrecta
    FORMULARI.appendChild(INPUTRESPCORR)

    const botoSubmit = document.createElement("button")
    botoSubmit.type = "submit"
    botoSubmit.textContent = "Edita"
    FORMULARIeditar.appendChild(botoSubmit)

    FORMULARIeditar.addEventListener("submit", async (event) => {
        event.preventDefault()

        // const formData = new FormData(FORMULARIINSRT)

        // const formObject = {}
        // formData.forEach((valor, clau) => {
        //     formObject[clau] = valor
        // })

        // const jsonData = JSON.stringify(formObject)
        // console.log(jsonData)

        // sendData(jsonData)

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

    console.log(JSON.stringify(idPreg))

    const URL = `./php/eliminarPregunta.php`
    const RESPONSE = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(idPreg)
    })
    console.log(RESPONSE)
    // return RESPONSE
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
        console.log(jsonData)

        sendData(jsonData)

        // preguntarle al Alvaro como refrescar la página
        MOSTRAPREGUNTES.classList.remove("oculto")
        INSERTAR.classList.add("oculto")
    })

    divInsertar.appendChild(FORMULARI)
    INSERTAR.appendChild(divInsertar)
    console.log(INSERTAR)
}


mostrarBBDD()

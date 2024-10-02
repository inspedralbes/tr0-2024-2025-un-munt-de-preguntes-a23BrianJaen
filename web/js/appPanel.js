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
        console.log("Inserir pregunta")
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

        let respCorr = false

        let idRespEditQuick = []
        let idRespCorrEditQuick = []

        // Añadir las respuestas y las respuestas correctas
        for (const [indexResp, resposta] of pregunta.respostes.entries()) {
            const itemResposta = document.createElement("li")
            itemResposta.textContent = resposta.resposta
            itemResposta.id = `resposta_${index}_${indexResp}`
            idRespEditQuick[indexResp] = itemResposta.id
            itemResposta.textContent += ` ${resposta.idResposta} 🢘 ID`
            listaRespostes.appendChild(itemResposta)

            respCorr = pregunta.respostes[indexResp].respostaCorrecta == 1 ? "true" : "false"

            const respostaCorr = document.createElement("li")
            respostaCorr.id = `respostaCorr_${index}_${indexResp}`
            respostaCorr.textContent = respCorr
            idRespCorrEditQuick[indexResp] = respostaCorr.id

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

            console.log(`Editant la pregunta de manera ràpida: ${pregunta.idPregunta} - ${pregunta.pregunta}`)
            editaPreguntaRapid(pregunta, thQuickEditPreg, idRespEditQuick, idRespCorrEditQuick, botoQuickEdit, celdaAccions)
        })
        celdaAccions.appendChild(botoQuickEdit)
        filaPregunta.appendChild(celdaAccions)

        cos.appendChild(filaPregunta)
    }

    // Añadir el cuerpo de la tabla a la tabla
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

    console.log(MOSTRAPREGUNTES)
}

async function editaPreguntaRapid(pregunta, thQuickEditPreg, idRespEditQuick, idRespCorrEditQuick, botoQuickEdit, celdaAccions) {
    botoQuickEdit.classList.add("oculto")

    thQuickEditPreg.innerHTML = ""
    const INPUTPREGUNTA = document.createElement("input")
    INPUTPREGUNTA.type = "text"
    INPUTPREGUNTA.size = pregunta.pregunta.length
    INPUTPREGUNTA.value = pregunta.pregunta
    thQuickEditPreg.appendChild(INPUTPREGUNTA)

    // Arrays para almacenar los inputs de las respuestas y los estados correctos
    const respuestasInputs = []
    const respuestasIds = []
    const respuestasCorrectas = []

    // Recorrer todas las respuestas
    for (let i = 0; i < pregunta.respostes.length; i++) {
        const thQuickEditResp = idRespEditQuick[i]
        thQuickEditResp.innerHTML = ""

        // Input para el texto de la respuesta
        const INPUTRESPOSTES = document.createElement("input")
        INPUTRESPOSTES.type = "text"
        INPUTRESPOSTES.size = pregunta.respostes[i].resposta.length
        INPUTRESPOSTES.value = pregunta.respostes[i].resposta
        thQuickEditResp.appendChild(INPUTRESPOSTES)

        // Guardar inputs de respuestas y sus IDs
        respuestasInputs.push(INPUTRESPOSTES)
        respuestasIds.push(pregunta.respostes[i].idResposta)

        // Input para indicar si la respuesta es correcta o incorrecta
        const thQuickEditRespCorr = idRespCorrEditQuick[i]
        thQuickEditRespCorr.innerHTML = ""

        const INPUTRESPOTESCORRECTES = document.createElement("input")
        INPUTRESPOTESCORRECTES.type = "text"
        INPUTRESPOTESCORRECTES.size = pregunta.respostes[i].respostaCorrecta.length
        INPUTRESPOTESCORRECTES.value = pregunta.respostes[i].respostaCorrecta
        
        thQuickEditRespCorr.appendChild(INPUTRESPOTESCORRECTES)
        
        console.log(INPUTRESPOTESCORRECTES.value)
        respuestasCorrectas.push(INPUTRESPOTESCORRECTES.value) // me guardo si la respuesta es correcta y aqui la comparo
    }
    // console.log(respuestasCorrectas)

    // Botón para guardar los cambios
    const btnGuardarResul = document.createElement("button")
    btnGuardarResul.textContent = "Guardar cambios"
    btnGuardarResul.addEventListener("click", async () => {
        // Crear el objeto con la estructura que necesitas
        
        const datosActualizados = {
            idPregunta: pregunta.idPregunta, // ID de la pregunta
            idResp1: respuestasInputs[0].value, // Valor actualizado de la respuesta 1
            idResp2: respuestasInputs[1].value, // Valor actualizado de la respuesta 2
            idResp3: respuestasInputs[2].value, // Valor actualizado de la respuesta 3
            idResp4: respuestasInputs[3].value, // Valor actualizado de la respuesta 4
            idRespCorr1: respuestasCorrectas[0], // Si la respuesta 1 es correcta
            idRespCorr2: respuestasCorrectas[1], // Si la respuesta 2 es correcta
            idRespCorr3: respuestasCorrectas[2], // Si la respuesta 3 es correcta
            idRespCorr4: respuestasCorrectas[3],  // Si la respuesta 4 es correcta
            idResposta1: respuestasIds[0], // ID de la respuesta 1
            idResposta2: respuestasIds[1], // ID de la respuesta 2
            idResposta3: respuestasIds[2], // ID de la respuesta 3
            idResposta4: respuestasIds[3], // ID de la respuesta 4
            pregunta: INPUTPREGUNTA.value // Valor actualizado de la pregunta
        }

        
        // const datosActualizados = {
        //     idRespCorr1: respuestasCorrectas[0], // Si la respuesta 1 es correcta
        //     idRespCorr2: respuestasCorrectas[1], // Si la respuesta 2 es correcta
        //     idRespCorr3: respuestasCorrectas[2], // Si la respuesta 3 es correcta
        //     idRespCorr4: respuestasCorrectas[3],  // Si la respuesta 4 es correcta
        // }
        console.log(datosActualizados)

        // Convertir el objeto en JSON
        const jsonData = JSON.stringify(datosActualizados)
        
        // Enviar los datos a la función de actualización
        await sendDataUpdate(jsonData)
        
        // Actualizar los datos en la página
        const actualizaData = await getData()
        cargarPreguntas(actualizaData)
    })

    // Añadir el botón a la página
    celdaAccions.appendChild(btnGuardarResul)
}

function editaPregunta(pregunta) {

    // comentarle al Pol que si desabilito el input no hace el editar

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
    // INPUTID.disabled = true
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
        // INPUTIDRESP.disabled = true  // Campo solo de lectura
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

    FORMULARIEditar.addEventListener("submit", async (event) => {
        event.preventDefault()

        const formData = new FormData(FORMULARIEditar)

        const formObject = {}
        formData.forEach((valor, clau) => {
            formObject[clau] = valor
        })

        const jsonData = JSON.stringify(formObject)

        console.log(jsonData)

        await sendDataUpdate(jsonData)

        const actualizaData = await getData()
        cargarPreguntas(actualizaData)

        MOSTRAPREGUNTES.classList.remove("oculto")
        editar.classList.add("oculto")
    })

    divEditar.appendChild(FORMULARI)
    editar.appendChild(divEditar)
    console.log(editar)
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

    FORMULARIINSRT.addEventListener("submit", async (event) => {
        event.preventDefault()

        const formData = new FormData(FORMULARIINSRT)

        const formObject = {}
        formData.forEach((valor, clau) => {
            formObject[clau] = valor
        })

        const jsonData = JSON.stringify(formObject)
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
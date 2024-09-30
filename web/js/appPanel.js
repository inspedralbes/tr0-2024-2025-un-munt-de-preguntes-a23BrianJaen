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
    // poner el fetch para enviar los datos al back
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

    for (const [index, pregunta] of data.entries()) {
        const divPregunta = document.createElement("div")

        const titulo = document.createElement("p")
        const botonEdit = document.createElement("button")
        botonEdit.textContent = `Edita pregunta`
        titulo.textContent = `${index + 1}- ${pregunta.pregunta}`
        divPregunta.appendChild(titulo)
        titulo.appendChild(botonEdit)

        const respostesArray = [];

        for (const resposta of pregunta.respostes) {
            const divRespostes = document.createElement("div")
            const respostaP = document.createElement("p")
            respostaP.textContent = resposta.resposta
            divRespostes.appendChild(respostaP)
            divPregunta.appendChild(divRespostes)

            respostesArray.push(resposta.resposta)
        }
        botonEdit.addEventListener("click", () => { // hacer editar pregunta
            console.log(`Editando la pregunta: ${pregunta.idPregunta}- ${pregunta.pregunta} \n${respostesArray}`)
        })
        MOSTRAPREGUNTES.appendChild(divPregunta)
    }

    const divInsertar = document.createElement("div")
    const titulo = document.createElement("h2")
    titulo.textContent = `Inserció`
    const botonInsertar = document.createElement("button")
    botonInsertar.textContent = `Insertar una pregunta`
    MOSTRAPREGUNTES.appendChild(titulo)

    botonInsertar.addEventListener("click", () => {
        console.log("insertar pregutna")
        insertarPregunta()
    })

    divInsertar.appendChild(botonInsertar)
    MOSTRAPREGUNTES.appendChild(divInsertar)

    console.log(MOSTRAPREGUNTES)
}

async function insertarPregunta() {
    MOSTRAPREGUNTES.classList.add("oculto")
    
    const INSERTAR = document.getElementById("insertar")

    INSERTAR.innerHTML = ''
    INSERTAR.classList.remove("oculto")

    const divInsertar = document.createElement("div")
    const FORMULARIO = document.createElement("form")
    FORMULARIO.id = "formularioInsert"

    document.body.appendChild(FORMULARIO) // añado el formulario al DOM

    const FORMULARIOINSRT = document.getElementById("formularioInsert") // <- Coge el Id del formulario

    const INPUTPREG = document.createElement("input")
    INPUTPREG.type = "text"
    INPUTPREG.placeholder = "Introduiex la pregunta"
    INPUTPREG.name = "pregunta" 
    FORMULARIOINSRT.appendChild(INPUTPREG) 

    const CANTRESP = 4; 
    for (let i = 0; i < CANTRESP; i++) {
        const INPUTRESP = document.createElement("input")
        INPUTRESP.type = "text"
        INPUTRESP.placeholder = `Resposta ${i + 1}`
        INPUTRESP.name = `idResp${i + 1}` 
        FORMULARIOINSRT.appendChild(INPUTRESP)
    }

    const INPUTRESPCORR = document.createElement("input")
    INPUTRESPCORR.type = "number"
    INPUTRESPCORR.placeholder = "Id resposta correcta"
    INPUTRESPCORR.name = "idRespCorr"
    FORMULARIO.appendChild(INPUTRESPCORR)

    const submitButton = document.createElement("button")
    submitButton.type = "submit" 
    submitButton.textContent = "Inseri"
    FORMULARIOINSRT.appendChild(submitButton)

    FORMULARIOINSRT.addEventListener("submit", async (event) => {
        event.preventDefault() // Evita la recarga de la página
        const formData = new FormData(FORMULARIOINSRT)

        const formObject = {} 
        formData.forEach((valor, clave) => { // Convierto FormData a un objeto simple
            formObject[clave] = valor
        })

        const jsonData = JSON.stringify(formObject)
        console.log(jsonData)

        sendData(jsonData)

        MOSTRAPREGUNTES.classList.remove("visible")
        INSERTAR.classList.add("oculto")

    })

    divInsertar.appendChild(FORMULARIO)
    INSERTAR.appendChild(divInsertar)
    console.log(INSERTAR)
}

mostrarBBDD()


const app = document.getElementById("app")
const enviarRespostes = document.getElementById("enviaRespostes")
let data = []
// let estatPartida = {
//         preguntes: [
//                 { idPreg: 0, resposta: -1 },
//                 { idPreg: 1, resposta: -1 },
//                 { idPreg: 2, resposta: -1 },
//                 { idPreg: 3, resposta: -1 },
//                 { idPreg: 4, resposta: -1 },
//                 { idPreg: 5, resposta: -1 },
//                 { idPreg: 6, resposta: -1 },
//                 { idPreg: 7, resposta: -1 },
//                 { idPreg: 8, resposta: -1 },
//                 { idPreg: 9, resposta: -1 }
//         ]
// }

let respostes = [] // <- decirle a Alvaro que optado por está solución

async function getData() {
        const cantPreg = 10
        const URL = `php/getPreguntes.php?cantPreg=${cantPreg}`
        const request = await fetch(URL)
        const json = await request.json()
        return json
}

async function sendData() {
        const URL = `php/finalitza.php`
        
        const respuestas = await fetch(URL, {
                method: "Post",
                headers: {
                        "Content-Type": "application/json" // Indicamos que estamos enviando JSON
                },
                body: JSON.stringify(respostes)
        })
        const resultado = await respuestas.json();
        console.log(resultado)
}

async function getFinalResult(){
        // coger los datos del back para mostrar el resultado final
}

async function inicializarApp() {
        data = await getData()
        respostes = new Array(data.length)
        pintarTablaPreguntas()
        for (const [index, pregunta] of data.entries()) {
                let tituloPregunta = pregunta.pregunta
                app.innerHTML += `${index + 1}- ${tituloPregunta} <br><br>`
                for (const respuesta of pregunta.respostes) {
                        let resp = respuesta.etiqueta
                        app.innerHTML += `<button class="botonRespuesta" data-index="${index}" data-respuestaId="${respuesta.id}">${resp}</button> <br>`
                }
                app.innerHTML += '<br>'
        }
        const botonesRespuestas = document.getElementsByClassName("botonRespuesta")
        console.log(botonesRespuestas)
        for(const boton of botonesRespuestas){ // <- los tres . crea un nuevo array desde 0, pasar de un HTMLcollection a un array normal
                const respuestaId = boton.getAttribute("data-respuestaId") //data-respuestaId: guarda datos en un elemento
                const indexPreg = boton.getAttribute("data-index")
                boton.addEventListener("click", ()=>{
                        guardarRespuesta(indexPreg, respuestaId)
                })
        }
        enviarRespostes.addEventListener("click",()=>{
                sendData()
        })
}


function guardarRespuesta(indexPregunta, idResposta) {
        console.log(indexPregunta, idResposta)
        const pregunta = data[indexPregunta]
        const esCorrecta = pregunta.resposta_correcta == idResposta
        
        let posId = -1
        for (let iter = 0; iter < respostes.length; iter++) {
                if (indexPregunta == iter) {
                        posId = iter
                        respostes[posId] = idResposta
                }
        }
        pintarTablaPreguntas()
}

function pintarTablaPreguntas() {
        const tabla = document.getElementById("tablaPreg")
        
        tabla.innerHTML = ` `
        tabla.innerHTML += `<table>`
        for (let iter = 0; iter < respostes.length; iter++) {
                tabla.innerHTML += `<tr><th>Pregunta: ${iter + 1} - Resposta: ${respostes[iter]}</th></tr><br>`
        }
        tabla.innerHTML += `</table> <br>`
}

inicializarApp()

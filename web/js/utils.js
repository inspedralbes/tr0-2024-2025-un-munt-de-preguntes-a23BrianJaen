const app = document.getElementById("app")
let data = []
let estatPartida = {
        preguntes: [
                { idPreg: 0, feta: false, resposta: -1 },
                { idPreg: 1, feta: false, resposta: -1 },
                { idPreg: 2, feta: false, resposta: -1 },
                { idPreg: 3, feta: false, resposta: -1 },
                { idPreg: 4, feta: false, resposta: -1 },
                { idPreg: 5, feta: false, resposta: -1 },
                { idPreg: 6, feta: false, resposta: -1 },
                { idPreg: 7, feta: false, resposta: -1 },
                { idPreg: 8, feta: false, resposta: -1 },
                { idPreg: 9, feta: false, resposta: -1 }
        ]
}

async function getData() {
        const cantPreg = 10
        const request = await fetch(`../back/getPreguntes.php?cantPreg=${cantPreg}`)
        const json = await request.json()
        return json
}

async function inicializarApp() {
        data = await getData()
        pintarTablaPreguntas()
        for (const [index, pregunta] of data.entries()) {
                let tituloPregunta = pregunta.pregunta
                app.innerHTML += tituloPregunta + '<br><br>'
                for (const respuesta of pregunta.respostes) {
                        let resp = respuesta.etiqueta
                        app.innerHTML += `<button onclick="guardarRespuesta(${index}, ${respuesta.id})">${resp}</button> <br>`
                }
                app.innerHTML += '<br>'
        }
}

function guardarRespuesta(indexPregunta, idResposta) {
        const pregunta = data[indexPregunta]
        const esCorrecta = pregunta.resposta_correcta == idResposta

        let posId = -1
        for (let iter = 0; iter < estatPartida.preguntes.length; iter++) {
                if (indexPregunta == estatPartida.preguntes[iter].idPreg) {
                        posId = iter
                        estatPartida.preguntes[posId].resposta = idResposta
                        estatPartida.preguntes[posId].feta = true

                        console.log(`!!!!!Index pregunta: ${indexPregunta} - Iterador: ${iter}`)
                        console.log(`Pregunta a cambiar: ${estatPartida.preguntes[indexPregunta].idPreg}`) // <- como hacerlo para cambiar solo la id de esa pregunta
                }
        }
        pintarTablaPreguntas() 
        
        // console.log(`Id de la pregunta del objeto: ${estatPartida.preguntes[posId].idPreg} - Indice pregunta: ${indexPregunta}`)
        // console.log(`Saber si esta echa: ${estatPartida.preguntes[posId].feta}`)
        // console.log(`Saber la respuesta: ${estatPartida.preguntes[posId].resposta}`)
}


function pintarTablaPreguntas() {
        const tabla = document.getElementById("tablaPreg")

        tabla.innerHTML = ` `
        tabla.innerHTML += `<table>`
        for (let iter = 0; iter < estatPartida.preguntes.length; iter++) {
                tabla.innerHTML += `<tr><td>Pregunta: ${iter + 1} - Fet: ${estatPartida.preguntes[iter].feta} - Resposta: ${estatPartida.preguntes[iter].resposta}</td></tr><br>`
        }
        tabla.innerHTML += `</table> <br>`
}

inicializarApp()
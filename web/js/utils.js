const app = document.getElementById("function")
let data = []

let estatPartida = {
    contadorPreguntas: 0,
    preguntes: [
        {id:0, feta:false , resposta: -1}
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
        console.log(data)
        for (const pregunta of data) {
            console.log(pregunta.pregunta);
            let tituloPregunta = pregunta.pregunta;
            app.innerHTML += tituloPregunta + `<br><br>`;
            for (const respuesta of pregunta.respostes) {
                console.log(respuesta.etiqueta);
            }
        }
        
        // for (const [index, pregunta] of data.pregunta.entries()) {/*<- .entries() debe contener indice valor*/
        //         let tituloPregunta = pregunta.pregunta
        //         app.innerHTML += tituloPregunta + '<br><br>'
        //         for (const respuesta of pregunta.respostes) {
        //                 let resp = respuesta.etiqueta
        //                 app.innerHTML += `<button onclick="detectarBoton(${index}, ${respuesta.id})">${resp}</button> <br>`
        //         }
        //         app.innerHTML += '<br>'
        // }
}

function detectarBoton(indexPregunta, respuestaID) {
        const pregunta = data.preguntes[indexPregunta]
        const esCorrecta = pregunta.resposta_correcta == respuestaID

        estat(pregunta.pregunta, respuestaID, esCorrecta)

        /*if (esCorrecta) {
                alert("¡Respuesta correcta!")
        } else {
                alert("Respuesta incorrecta. Inténtalo de nuevo.")
        }
        console.log(`Pregunta: ${pregunta.pregunta}, Respuesta ID: ${respuestaID}, ¿Es correcta?: ${esCorrecta}`)
        */
}

// function estat(preg, respuesta, pregCorrecta) {
//         let repite = true

//         for (let ite = 0; ite < estatPartida.resp.length; ite++) {
//                 if (estatPartida.resp[ite].pregunta == preg) {
//                         estatPartida.resp[ite].respuesta == respuesta
//                         repite = false;
//                 }
//         }
//         console.log(repite)
//         if (repite) {
//                 estatPartida.preguntaActu++; // <- esto se puede quitar por que es redundante y con un length se puede saber
//                 estatPartida.resp.push({
//                         pregunta: preg,
//                         respuesta: respuesta,
//                         correcta: pregCorrecta, //<- esto habria que quiarlo por que es de back
//                 })
//         }
//         console.log(estatPartida)
// }

inicializarApp()
// Configuración del juego
const config = {
    intentosMaximos: 6,
    puntosPorPalabra: 50,
    penalizacionPista: 10
};

// Estado del juego
let estadoJuego = {
    palabraSecreta: "",
    letrasAdivinadas: [],
    intentosRestantes: config.intentosMaximos,
    puntuacion: 0,
    palabrasAdivinadas: 0,
    palabrasTotales: 10,
    categoriaActual: "general",
    sonidoActivado: true,
    juegoActivo: true
};

// Palabras por categoría
const palabrasPorCategoria = {
    general: ["AHORCADO", "COMPUTADORA", "TELEFONO", "INTERNET", "ELEFANTE", "TELEVISOR"],
    programacion: ["JAVASCRIPT", "HTML", "CSS", "FUNCION", "VARIABLE", "CONSOLA"],
    peliculas: ["TITANIC", "AVATAR", "TOYSTORY", "MATRIX", "PULPFICTION", "PARASITO"],
    animales: ["ELEFANTE", "JIRAFA", "TIGRE", "PINGUINO", "LEOPARDO", "CANGURO"]
};

// Elementos del DOM
const elementos = {
    palabraContainer: document.getElementById("palabra-container"),
    teclado: document.getElementById("teclado"),
    intentosElement: document.getElementById("intentos"),
    ahorcadoImg: document.getElementById("ahorcado-img"),
    mensaje: document.getElementById("mensaje"),
    messageTitle: document.getElementById("message-title"),
    messageText: document.getElementById("message-text"),
    scoreElement: document.getElementById("score"),
    wordsElement: document.getElementById("words"),
    categorySelect: document.getElementById("category"),
    hintBtn: document.getElementById("hint-btn"),
    resetBtn: document.getElementById("reset-btn"),
    nextBtn: document.getElementById("next-btn"),
    quitBtn: document.getElementById("quit-btn"),
    soundBtn: document.getElementById("sound-btn"),
    correctSound: document.getElementById("correct-sound"),
    wrongSound: document.getElementById("wrong-sound"),
    winSound: document.getElementById("win-sound"),
    loseSound: document.getElementById("lose-sound")
};

// Inicialización del juego
function iniciarJuego() {
    estadoJuego.letrasAdivinadas = [];
    estadoJuego.intentosRestantes = config.intentosMaximos;
    estadoJuego.palabraSecreta = obtenerPalabraAleatoria();
    estadoJuego.letrasAdivinadas = Array(estadoJuego.palabraSecreta.length).fill("_");
    estadoJuego.juegoActivo = true;
    actualizarPalabra();
    actualizarIntentos();
    actualizarPuntuacion();
    crearTeclado();
    elementos.ahorcadoImg.src = `assets/imagenes/ahorcado-0.png`;
    elementos.mensaje.classList.add("hidden");
}

// Obtener palabra aleatoria según categoría
function obtenerPalabraAleatoria() {
    const palabras = palabrasPorCategoria[estadoJuego.categoriaActual];
    return palabras[Math.floor(Math.random() * palabras.length)];
}

// Actualizar visualización de la palabra
function actualizarPalabra() {
    elementos.palabraContainer.textContent = estadoJuego.letrasAdivinadas.join(" ");
}

// Actualizar contador de intentos
function actualizarIntentos() {
    elementos.intentosElement.textContent = estadoJuego.intentosRestantes;
    elementos.ahorcadoImg.src = `assets/imagenes/ahorcado-${config.intentosMaximos - estadoJuego.intentosRestantes}.png`;
}

// Actualizar puntuación
function actualizarPuntuacion() {
    elementos.scoreElement.textContent = estadoJuego.puntuacion;
    elementos.wordsElement.textContent = `${estadoJuego.palabrasAdivinadas}/${estadoJuego.palabrasTotales}`;
}

// Crear teclado virtual
function crearTeclado() {
    elementos.teclado.innerHTML = "";
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    letras.forEach(letra => {
        const boton = document.createElement("button");
        boton.textContent = letra;
        boton.addEventListener("click", () => verificarLetra(letra));
        if (estadoJuego.letrasAdivinadas.includes(letra)) boton.disabled = true;
        elementos.teclado.appendChild(boton);
    });
}

// Verificar letra seleccionada
function verificarLetra(letra) {
    if (!estadoJuego.juegoActivo) return;

    if (estadoJuego.palabraSecreta.includes(letra)) {
        reproducirSonido("correct");
        estadoJuego.palabraSecreta.split("").forEach((char, index) => {
            if (char === letra) estadoJuego.letrasAdivinadas[index] = letra;
        });
        if (!estadoJuego.letrasAdivinadas.includes("_")) ganarJuego();
    } else {
        reproducirSonido("wrong");
        estadoJuego.intentosRestantes--;
        actualizarIntentos();
        if (estadoJuego.intentosRestantes === 0) perderJuego();
    }
    actualizarPalabra();
    crearTeclado();
}

// Dar pista
function darPista() {
    if (estadoJuego.puntuacion >= config.penalizacionPista) {
        const letrasNoAdivinadas = [];
        estadoJuego.palabraSecreta.split("").forEach((letra, index) => {
            if (estadoJuego.letrasAdivinadas[index] === "_" && !letrasNoAdivinadas.includes(letra)) {
                letrasNoAdivinadas.push(letra);
            }
        });
        if (letrasNoAdivinadas.length > 0) {
            const letraPista = letrasNoAdivinadas[Math.floor(Math.random() * letrasNoAdivinadas.length)];
            verificarLetra(letraPista);
            estadoJuego.puntuacion -= config.penalizacionPista;
            actualizarPuntuacion();
        }
    } else {
        mostrarMensaje("Pistas", "No tienes suficientes puntos para una pista");
    }
}

// Mostrar mensaje
function mostrarMensaje(titulo, mensaje, esVictoria = false) {
    elementos.messageTitle.textContent = titulo;
    elementos.messageText.textContent = mensaje;
    elementos.mensaje.classList.remove("hidden");
    estadoJuego.juegoActivo = false;
    if (esVictoria) reproducirSonido("win");
    else reproducirSonido("lose");
}

// Ganar juego
function ganarJuego() {
    estadoJuego.palabrasAdivinadas++;
    estadoJuego.puntuacion += config.puntosPorPalabra;
    actualizarPuntuacion();
    mostrarMensaje(
        "¡Ganaste! 🎉", 
        `La palabra era: ${estadoJuego.palabraSecreta}\nPuntos ganados: ${config.puntosPorPalabra}`,
        true
    );
}

// Perder juego
function perderJuego() {
    mostrarMensaje(
        "¡Perdiste! 💀", 
        `La palabra era: ${estadoJuego.palabraSecreta}\nInténtalo de nuevo`,
        false
    );
}

// Reproducir sonido
function reproducirSonido(tipo) {
    if (!estadoJuego.sonidoActivado) return;
    switch(tipo) {
        case "correct": elementos.correctSound.currentTime = 0; elementos.correctSound.play(); break;
        case "wrong": elementos.wrongSound.currentTime = 0; elementos.wrongSound.play(); break;
        case "win": elementos.winSound.currentTime = 0; elementos.winSound.play(); break;
        case "lose": elementos.loseSound.currentTime = 0; elementos.loseSound.play(); break;
    }
}

// Event listeners
function setupEventListeners() {
    elementos.categorySelect.addEventListener("change", (e) => {
        estadoJuego.categoriaActual = e.target.value;
        iniciarJuego();
    });
    elementos.hintBtn.addEventListener("click", darPista);
    elementos.resetBtn.addEventListener("click", iniciarJuego);
    elementos.nextBtn.addEventListener("click", () => {
        if (estadoJuego.palabrasAdivinadas < estadoJuego.palabrasTotales) {
            elementos.mensaje.classList.add("hidden");
            iniciarJuego();
        } else {
            mostrarMensaje(
                "¡Juego completado! 🏆", 
                `Has adivinado todas las palabras\nPuntuación final: ${estadoJuego.puntuacion}`,
                true
            );
            elementos.nextBtn.disabled = true;
        }
    });
    elementos.quitBtn.addEventListener("click", () => {
        window.location.href = "juegos.html";
    });
    elementos.soundBtn.addEventListener("click", () => {
        estadoJuego.sonidoActivado = !estadoJuego.sonidoActivado;
        elementos.soundBtn.innerHTML = estadoJuego.sonidoActivado 
            ? '<i class="fas fa-volume-up"></i>' 
            : '<i class="fas fa-volume-mute"></i>';
    });
    document.addEventListener("keydown", (e) => {
        if (/^[a-z]$/i.test(e.key)) {
            const letra = e.key.toUpperCase();
            const boton = Array.from(elementos.teclado.children).find(
                btn => btn.textContent === letra && !btn.disabled
            );
            if (boton) { boton.click(); boton.classList.add("pressed"); setTimeout(() => boton.classList.remove("pressed"), 200); }
        }
    });
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
    iniciarJuego();
});

// Configuración del juego
const config = {
    intentosMaximos: 6,
    puntosPorAcierto: 10,
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
    sonidoActivado: true
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
    // Reiniciar estado
    estadoJuego.letrasAdivinadas = [];
    estadoJuego.intentosRestantes = config.intentosMaximos;
    estadoJuego.palabraSecreta = obtenerPalabraAleatoria();
    
    // Inicializar letras adivinadas
    estadoJuego.letrasAdivinadas = Array(estadoJuego.palabraSecreta.length).fill("_");
    
    // Actualizar interfaz
    actualizarPalabra();
    actualizarIntentos();
    actualizarPuntuacion();
    crearTeclado();
    
    // Reiniciar imagen
    elementos.ahorcadoImg.src = `assets/imagenes/ahorcado-0.png`;
    
    // Ocultar mensaje
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
        
        // Deshabilitar si ya se usó
        if (estadoJuego.letrasAdivinadas.includes(letra) || 
            (estadoJuego.palabraSecreta.includes(letra) && estadoJuego.letrasAdivinadas.includes(letra))) {
            boton.disabled = true;
        }
        
        elementos.teclado.appendChild(boton);
    });
}

// Verificar letra seleccionada
function verificarLetra(letra) {
    if (estadoJuego.palabraSecreta.includes(letra)) {
        // Letra correcta
        reproducirSonido("correct");
        
        // Actualizar letras adivinadas
        estadoJuego.palabraSecreta.split("").forEach((char, index) => {
            if (char === letra) {
                estadoJuego.letrasAdivinadas[index] = letra;
            }
        });
        
        // Actualizar puntuación
        estadoJuego.puntuacion += config.puntosPorAcierto;
        actualizarPuntuacion();
        
        // Verificar si ganó
        if (!estadoJuego.letrasAdivinadas.includes("_")) {
            ganarJuego();
        }
    } else {
        // Letra incorrecta
        reproducirSonido("wrong");
        estadoJuego.intentosRestantes--;
        actualizarIntentos();
        
        // Verificar si perdió
        if (estadoJuego.intentosRestantes === 0) {
            perderJuego();
        }
    }
    
    actualizarPalabra();
    crearTeclado(); // Actualizar teclado
}

// Dar pista
function darPista() {
    if (estadoJuego.puntuacion >= config.penalizacionPista) {
        // Encontrar letras no adivinadas
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
    
    if (esVictoria) {
        elementos.messageTitle.style.color = "#2ecc71";
        reproducirSonido("win");
    } else {
        elementos.messageTitle.style.color = "#e74c3c";
        reproducirSonido("lose");
    }
    
    elementos.mensaje.classList.remove("hidden");
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
        case "correct":
            elementos.correctSound.currentTime = 0;
            elementos.correctSound.play();
            break;
        case "wrong":
            elementos.wrongSound.currentTime = 0;
            elementos.wrongSound.play();
            break;
        case "win":
            elementos.winSound.currentTime = 0;
            elementos.winSound.play();
            break;
        case "lose":
            elementos.loseSound.currentTime = 0;
            elementos.loseSound.play();
            break;
    }
}

// Event listeners
function setupEventListeners() {
    // Selector de categoría
    elementos.categorySelect.addEventListener("change", (e) => {
        estadoJuego.categoriaActual = e.target.value;
        iniciarJuego();
    });
    
    // Botón de pista
    elementos.hintBtn.addEventListener("click", darPista);
    
    // Botón de reinicio
    elementos.resetBtn.addEventListener("click", iniciarJuego);
    
    // Botón siguiente
    elementos.nextBtn.addEventListener("click", () => {
        if (estadoJuego.palabrasAdivinadas < estadoJuego.palabrasTotales) {
            elementos.mensaje.classList.add("hidden");
            iniciarJuego();
        } else {
            // Todo completado
            mostrarMensaje(
                "¡Juego completado! 🏆", 
                `Has adivinado todas las palabras\nPuntuación final: ${estadoJuego.puntuacion}`,
                true
            );
            elementos.nextBtn.disabled = true;
        }
    });
    
    // Botón de salir
    elementos.quitBtn.addEventListener("click", () => {
        window.location.href = "juegos.html";
    });
    
    // Botón de sonido
    elementos.soundBtn.addEventListener("click", () => {
        estadoJuego.sonidoActivado = !estadoJuego.sonidoActivado;
        elementos.soundBtn.innerHTML = estadoJuego.sonidoActivado 
            ? '<i class="fas fa-volume-up"></i>' 
            : '<i class="fas fa-volume-mute"></i>';
    });
    
    // Teclado físico
    document.addEventListener("keydown", (e) => {
        if (/^[a-z]$/i.test(e.key)) {
            const letra = e.key.toUpperCase();
            const boton = Array.from(elementos.teclado.children).find(
                btn => btn.textContent === letra && !btn.disabled
            );
            
            if (boton) {
                boton.click();
                boton.classList.add("pressed");
                setTimeout(() => boton.classList.remove("pressed"), 200);
            }
        }
    });
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    setupEventListeners();
    iniciarJuego();
});
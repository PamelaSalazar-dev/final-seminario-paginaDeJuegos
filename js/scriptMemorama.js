// ----------------- Variables -----------------
let cardsArray = [
    "🍎","🍎",
    "🍌","🍌",
    "🍇","🍇",
    "🍉","🍉",
    "🍓","🍓",
    "🍍","🍍"
];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let attempts = 0;

// Elementos de la interfaz
const gameContainer = document.getElementById("game");
const stats = document.getElementById("stats");
const overlay = document.getElementById("overlay");
const playBtn = document.getElementById("play-btn");
const bgMusic = document.getElementById("bg-music");
const toggleBtn = document.getElementById("music-toggle");

// ----------------- Inicio del juego -----------------
function initGame() {
    // Resetear estado
    gameContainer.innerHTML = "";
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    attempts = 0;
    stats.textContent = "0 intentos";

    // Mezclar cartas
    shuffle(cardsArray);

    // Crear tablero
    cardsArray.forEach(symbol => {
        const card = createCard(symbol);
        gameContainer.appendChild(card);
    });
}

// ----------------- Utilidades -----------------
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCard(symbol) {
    const card = document.createElement("div");
    card.classList.add("card");

    const back = document.createElement("div");
    back.classList.add("back");

    const face = document.createElement("div");
    face.classList.add("face");
    face.textContent = symbol;

    card.appendChild(back);
    card.appendChild(face);

    card.addEventListener("click", () => flipCard(card, symbol));

    return card;
}

// ----------------- Lógica del juego -----------------
function flipCard(card, symbol) {
    if (lockBoard || card.classList.contains("active")) return;

    card.classList.add("active");

    if (!firstCard) {
        firstCard = { card, symbol };
    } else {
        secondCard = { card, symbol };
        checkForMatch();
    }
}

function checkForMatch() {
    lockBoard = true;
    attempts++;
    stats.textContent = `${attempts} intentos`;

    if (firstCard.symbol === secondCard.symbol) {
        resetTurn();
    } else {
        setTimeout(() => {
            firstCard.card.classList.remove("active");
            secondCard.card.classList.remove("active");
            resetTurn();
        }, 1000);
    }
}

function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

// ----------------- Botón Play -----------------
let gameStarted = false;

playBtn.addEventListener("click", () => {
    if (gameStarted) return;
    gameStarted = true;

    overlay.style.display = "none"; // Ocultar overlay
    bgMusic.play();                 // Música
    initGame();                     // Arrancar juego
});

// ----------------- Botón Música -----------------
let musicPlaying = true;

toggleBtn.addEventListener("click", () => {
    if (musicPlaying) {
        bgMusic.pause();
        toggleBtn.textContent = "🔇 Música: OFF";
    } else {
        bgMusic.play();
        toggleBtn.textContent = "🔊 Música: ON";
    }
    musicPlaying = !musicPlaying;
});

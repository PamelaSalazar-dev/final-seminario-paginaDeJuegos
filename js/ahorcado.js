const imagenAhorcado = document.getElementById('imagen-ahorcado');
const palabraElemento = document.getElementById('palabra');
const intentosElemento = document.getElementById('intentos');
const inputLetra = document.getElementById('input-letra');
const btnAdivinar = document.getElementById('btn-adivinar');
const btnPlay = document.getElementById('btn-play');

const palabras = ["codigo", "javascript", "programa", "ahorcado", "computadora"];

let palabraElegida = "";
let letrasAdivinadas = [];
let intentosRestantes = 6;

function elegirPalabra() {
  const indice = Math.floor(Math.random() * palabras.length);
  palabraElegida = palabras[indice];
  letrasAdivinadas = Array(palabraElegida.length).fill('_');
  intentosRestantes = 6;
  actualizarDisplay();
  inputLetra.disabled = false;
  btnAdivinar.disabled = false;
  inputLetra.value = "";
  inputLetra.focus();
}

function actualizarDisplay() {
  palabraElemento.textContent = letrasAdivinadas.join(' ');
  intentosElemento.textContent = intentosRestantes;
}

function verificarLetra(letra) {
  if (letra.length !== 1 || !letra.match(/[a-z]/i)) {
    alert("Por favor, ingresa una letra válida.");
    return;
  }

  if (letrasAdivinadas.includes(letra)) {
    alert("Ya ingresaste esa letra.");
    return;
  }

  if (palabraElegida.includes(letra)) {
    for (let i = 0; i < palabraElegida.length; i++) {
      if (palabraElegida[i] === letra) {
        letrasAdivinadas[i] = letra;
      }
    }
  } else {
    intentosRestantes--;
  }

  imagenAhorcado.src = `imagenes/ahorcado${6 - intentosRestantes}.png`;

  actualizarDisplay();
  chequearEstado();
}

function chequearEstado() {
  if (!letrasAdivinadas.includes('_')) {
    alert(`¡Ganaste! La palabra es: ${palabraElegida}`);
    finalizarJuego();
  } else if (intentosRestantes <= 0) {
    alert(`Perdiste 😞 La palabra era: ${palabraElegida}`);
    finalizarJuego();
  }
}

function finalizarJuego() {
  inputLetra.disabled = true;
  btnAdivinar.disabled = true;
}

btnPlay.addEventListener('click', () => {
  elegirPalabra();
});

btnAdivinar.addEventListener('click', () => {
  const letra = inputLetra.value.toLowerCase();
  verificarLetra(letra);
  inputLetra.value = "";
  inputLetra.focus();
});

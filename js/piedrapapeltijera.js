const opciones = ['piedra', 'papel', 'tijera'];
let puntosJugador = 0;
let puntosMaquina = 0;
const puntajeMaximo = 5;

function obtenerEleccionMaquina() {
  const idx = Math.floor(Math.random() * opciones.length);
  return opciones[idx];
}

function determinarGanador(usuario, maquina) {
  if (usuario === maquina) return 'Empate';
  if (
    (usuario === 'piedra' && maquina === 'tijera') ||
    (usuario === 'papel' && maquina === 'piedra') ||
    (usuario === 'tijera' && maquina === 'papel')
  ) {
    return 'Ganaste';
  } else {
    return 'Perdiste';
  }
}

function actualizarPuntaje(resultado) {
  if (resultado === 'Ganaste') puntosJugador++;
  if (resultado === 'Perdiste') puntosMaquina++;
  document.getElementById('puntaje').textContent =
    `Jugador: ${puntosJugador} | Máquina: ${puntosMaquina}`;
}

function verificarGanadorFinal() {
  if (puntosJugador === puntajeMaximo) {
    alert("🎉 ¡Felicidades! Ganaste la partida.");
    deshabilitarBotones();
  } else if (puntosMaquina === puntajeMaximo) {
    alert("💻 La máquina ganó la partida.");
    deshabilitarBotones();
  }
}

function deshabilitarBotones() {
  document.getElementById('piedra').disabled = true;
  document.getElementById('papel').disabled = true;
  document.getElementById('tijera').disabled = true;
}

function habilitarBotones() {
  document.getElementById('piedra').disabled = false;
  document.getElementById('papel').disabled = false;
  document.getElementById('tijera').disabled = false;
}

function jugar(eleccionUsuario) {
  const eleccionMaquina = obtenerEleccionMaquina();
  const resultado = determinarGanador(eleccionUsuario, eleccionMaquina);
  document.getElementById('resultado').textContent =
    `Elegiste: ${eleccionUsuario}. Máquina: ${eleccionMaquina}. Resultado: ${resultado}.`;
  actualizarPuntaje(resultado);
  verificarGanadorFinal();
}

document.getElementById('piedra').addEventListener('click', () => jugar('piedra'));
document.getElementById('papel').addEventListener('click', () => jugar('papel'));
document.getElementById('tijera').addEventListener('click', () => jugar('tijera'));

document.getElementById('reiniciar').addEventListener('click', () => {
  puntosJugador = 0;
  puntosMaquina = 0;
  document.getElementById('resultado').textContent = '';
  document.getElementById('puntaje').textContent = 'Jugador: 0 | Máquina: 0';
  habilitarBotones();
});

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


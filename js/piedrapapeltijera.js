const opciones = ['piedra', 'papel', 'tijera'];

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

function jugar(eleccionUsuario) {
  const eleccionMaquina = obtenerEleccionMaquina();
  const resultado = determinarGanador(eleccionUsuario, eleccionMaquina);
  document.getElementById('resultado').textContent =
    `Elegiste: ${eleccionUsuario}. Máquina: ${eleccionMaquina}. Resultado: ${resultado}.`;
}

document.getElementById('piedra').addEventListener('click', () => jugar('piedra'));
document.getElementById('papel').addEventListener('click', () => jugar('papel'));
document.getElementById('tijera').addEventListener('click', () => jugar('tijera'));

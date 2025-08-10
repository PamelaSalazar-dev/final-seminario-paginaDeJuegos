import { iniciarAhorcado } from './ahorcado.js';

document.getElementById('btn-play').addEventListener('click', () => {
    document.getElementById('descripcion').style.display = 'none';
    document.getElementById('juego').style.display = 'block';

    iniciarAhorcado();
});

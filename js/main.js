// Puedes usar este archivo para manejar la lógica compartida entre juegos
console.log("GameZone cargado correctamente");

// Ejemplo: Puntuación global
let puntuacionGlobal = 0;

export function actualizarPuntuacion(puntos) {
    puntuacionGlobal += puntos;
    console.log(`Puntuación global: ${puntuacionGlobal}`);
}
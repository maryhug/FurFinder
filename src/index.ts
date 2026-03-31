import { Mascota } from './models/pet.js';

console.log("--- SOS PETS: Pruebas en un solo archivo ---");

// Prueba 1: URL válida
console.log("\n1. Intentando crear mascota con URL válida:");
const mascota1 = new Mascota("Perro", "Labrador", "Dorado", "https://ejemplo.com/foto.jpg");
console.log("Imagen guardada:", mascota1.imagen);

// Prueba 2: URL inválida
console.log("\n2. Intentando crear mascota con URL inválida:");
const mascota2 = new Mascota("Gato", "Persa", "Blanco", "foto_local.png");
console.log("Valor de imagen (debería ser undefined):", mascota2.imagen);

console.log("\n--- Fin de pruebas ---");

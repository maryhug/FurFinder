import { Mascota } from './models/Pet.js';

console.log("--- SOS PETS: Estructura Final ---");

const perro = new Mascota("Perro", "Beagle", "Blanco/Marrón", "https://ejemplo.com/beagle.jpg");
console.log("Mascota:", perro.especie, "| Imagen:", perro.imagen);

const gatoLog = new Mascota("Gato", "Angora", "Blanco", "url-invalida");
console.log("Imagen inválida result:", gatoLog.imagen);

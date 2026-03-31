// Decorador básico para validar URL de imagen y simular validación de tamaño
function ImageValidator(target: any, propertyKey: string) {
    const privateKey = `_${propertyKey}`;
    
    Object.defineProperty(target, propertyKey, {
        get: function() { return this[privateKey]; },
        set: function(newVal: string) {
            if (!newVal) return; 
            if (!newVal.startsWith("http")) {
                console.error(`Error: La URL de imagen '${newVal}' no es válida.`);
            } else if (newVal.length > 200) {
                console.error(`Error: La URL es demasiado larga (máximo 200 caracteres).`);
            } else {
                this[privateKey] = newVal;
            }
        },
        enumerable: true,
        configurable: true
    });
}

// Clase Mascota básica con decorador
export class Mascota {
    especie: string;
    raza: string;
    color: string;
    
    @ImageValidator
    imagen: string = "";

    constructor(especie: string, raza: string, color: string, imagen: string) {
        this.especie = especie;
        this.raza = raza;
        this.color = color;
        this.imagen = imagen;
    }
}

// Mascotas registradas por los usuarios (Interface para tipado simple)
export interface Mascotas {
    id: string;
    duenoId: string; // Vínculo con el usuario dueño
    nombre?: string;
    especie: string;
    raza?: string;
    color: string; // Requerido por el usuario
    edad?: number;
    sexo: string;
}
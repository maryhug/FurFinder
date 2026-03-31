// Decorador de validación de imagen
function ImageValidator(target: any, propertyKey: string) {
    const privateKey = `_${propertyKey}`;
    Object.defineProperty(target, propertyKey, {
        get: function() { return this[privateKey]; },
        set: function(newVal: string) {
            if (!newVal) return; 
            if (!newVal.startsWith("http")) {
                console.error(`Error: URL inválida '${newVal}'`);
            } else if (newVal.length > 200) {
                console.error(`Error: URL demasiado larga`);
            } else {
                this[privateKey] = newVal;
            }
        },
        enumerable: true,
        configurable: true
    });
}

export interface Mascotas {
    id: string;
    duenoId: string;
    nombre?: string;
    especie: string;
    raza?: string;
    color: string;
    edad?: number;
    sexo: string;
}

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

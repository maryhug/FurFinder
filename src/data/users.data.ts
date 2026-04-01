import { Usuarios } from "../models/User";

export const DataUsuarios: Usuarios[] = [
    {
        id: "1",
        nombre: "Juan",
        apellido: "Perez",
        email: "[EMAIL_ADDRESS]",
        telefono: "123456789",
        ubicacion: {
            direccion: "Calle Falsa 123",
            barrio: "La Candelaria",
            ciudad: "Bogota",
            pais: "Colombia"
        },
        isActivo: true
    },
    {
        id: "2",
        nombre: "Maryhug",
        apellido: "Duran",
        email: "[EMAIL_ADDRESS]",
        telefono: "987654321",
        ubicacion: {
            direccion: "Calle Chimeneas 123",
            barrio: "La Colina",
            ciudad: "Medellin",
            pais: "Colombia"
        },
        isActivo: true
    }
]
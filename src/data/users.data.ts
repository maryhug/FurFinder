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
    }
]
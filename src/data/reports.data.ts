import { Reportes } from "../models/Report";
import { EstadoReporte } from "../models/Shared";

export const DataReportes: Reportes[] = [
    {
        id: "1",
        mascotaId: "1",
        usuarioId: "1",
        descripcion: "Se perdio mi perro negro",
        estado: EstadoReporte.Perdido,
        fecha: new Date("2026-03-31"),
        ubicacion: {
            direccion: "Calle Falsa 123",
            barrio: "La Candelaria",
            ciudad: "Bogota",
            codigoPostal: "110221",
            pais: "Colombia"
        }
    },
    {
        id: "2",
        mascotaId: "2",
        usuarioId: "2",
        descripcion: "Se perdio mi gato blanco",
        estado: EstadoReporte.Perdido,
        fecha: new Date("2026-03-31"),
        ubicacion: {
            direccion: "Calle Falsa 123",
            barrio: "La Candelaria",
            ciudad: "Bogota",
            codigoPostal: "110221",
            pais: "Colombia"
        }
    }
];
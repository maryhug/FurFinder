import { Reportes } from '../models/Report.js';
import { EstadoReporte } from '../models/Shared.js';

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
    },
    {
        id: "3",
        mascotaId: "3", // Coincide con especie (Perro) y color (Negro)
        usuarioId: "4",
        descripcion: "Encontré un perro negro en el parque",
        estado: EstadoReporte.Encontrado, // Complemento de 'Perdido'
        fecha: new Date("2026-03-31"),
        ubicacion: {
            direccion: "Carrera 7 #45-10",
            barrio: "Chapinero",
            ciudad: "Bogota", // Coincide ciudad
            pais: "Colombia"
        }
    },
    {
        id: "4",
        mascotaId: "3",
        usuarioId: "5",
        descripcion: "Reporte con fecha inválida (antes de perderse)",
        estado: EstadoReporte.Encontrado,
        fecha: new Date("2026-03-20"), // ANTES que el reporte 1 (2026-03-31)
        ubicacion: {
            direccion: "Calle Falsa 789",
            barrio: "Suba",
            ciudad: "Bogota",
            pais: "Colombia"
        }
    }
];
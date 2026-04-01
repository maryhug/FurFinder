import type{ EstadoReporte, Ubicacion } from './shared.ts';
import type{ DataMascotas } from '../data/pets.data.ts'
import type{ DataUsuarios } from '../data/users.data.ts';

export interface Reportes {
    id: string;
    mascotaId: typeof DataMascotas[0]['id']; // Referencia al ID de la mascota
    usuarioId: typeof DataUsuarios[0]['id']; // Referencia al ID del usuario
    fecha: Date;
    descripcion: string;
    ubicacion: Ubicacion;
    estado: EstadoReporte;
}

export interface Comentario {
    id: string;
    usuarioId: string;
    reporteId: string;
    texto: string;
    fecha: Date;
    ubicacion?: Ubicacion;
}

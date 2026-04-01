import { EstadoReporte, Ubicacion } from './Shared';

export interface Reportes {
    id: string;
    mascotaId: string;
    usuarioId: string;
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

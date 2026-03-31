import { Ubicacion, EstadoReporte } from "./shared";

// Reportes de mascotas perdidas, encontradas, avistadas, etc.
export interface Reportes {
    id: string;
    mascotaId: string; // Vínculo con la mascota
    usuarioId: string; // Quién hace el reporte
    fecha: Date;
    descripcion: string;
    ubicacion: Ubicacion;
    estado: EstadoReporte;
}

// Comentarios en reportes
export interface Comentario {
    id: string;
    usuarioId: string;
    reporteId: string;
    texto: string;
    fecha: Date;
    ubicacion?: Ubicacion; // Opcional para avistamientos específicos
}

export type EstadoReporte = 'Perdido' | 'Avistado' | 'Encontrado' | 'Recuperado' | 'Adopcion';

export type EspecieMascota = 'Perro' | 'Gato' | 'Ave' | 'Conejo' | 'Reptil' | 'Otro';

export type SexoMascota = 'Macho' | 'Hembra' | 'Desconocido';

export type Ubicacion = {
    direccion: string;
    barrio: string;
    ciudad: string;
    codigoPostal?: string;
    pais: string;
};

export interface Usuarios {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    ubicacion: Ubicacion;
    isActivo: boolean;
}

export interface Mascotas {
    id: string;
    duenoId: string;
    nombre?: string;
    especie: EspecieMascota;
    raza?: string;
    color: string;
    edad?: number;
    sexo: SexoMascota;
}

export interface Reportes {
    id: string;
    mascotaId: string;
    usuarioId: string;
    fecha: Date;
    descripcion: string;
    ubicacion: Ubicacion;
    estado: EstadoReporte;
}

export interface Match {
    id: string;
    reportePerdidoId: string;
    reporteEncontradoId: string;
    fechaMatch: Date;
    observaciones?: string;
}

export interface Comentario {
    id: string;
    usuarioId: string;
    reporteId: string;
    texto: string;
    fecha: Date;
    ubicacion?: Ubicacion;
}
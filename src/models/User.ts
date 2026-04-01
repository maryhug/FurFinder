import { Ubicacion } from './Shared.js';
export { Ubicacion };

export interface Usuarios {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    ubicacion: Ubicacion;
    isActivo: boolean;
}

export interface CrearUsuarioDTO {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    ubicacion: Ubicacion;
}

export interface ActualizarUsuarioDTO {
    nombre?: string;
    apellido?: string;
    email?: string;
    telefono?: string;
    ubicacion?: Ubicacion;
}

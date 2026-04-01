import { Ubicacion } from './Shared.js';

export interface Usuarios {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    ubicacion: Ubicacion;
    isActivo: boolean;
}

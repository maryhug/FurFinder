import { Ubicacion } from './Shared';

export interface Usuarios {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    ubicacion: Ubicacion;
    isActivo: boolean;
}

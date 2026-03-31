import { Ubicacion } from "./shared";

// Usuarios que se registran en la plataforma
export interface Usuarios {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    ubicacion: Ubicacion;
    isActivo: boolean; // Para desactivación de cuenta
}
import { Usuarios } from '../models/User.js';
import { Ubicacion } from '../models/shared.js';
import {
    validarEmail,
    validarSoloLetras,
    validarLongitud,
    validarUbicacion,
    verificarUnicidad,
} from '../common/utils.js';

// ── DTOs ──────────────────────────────────────────────────────────────────────

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

// ── Namespace: agrupa validaciones de dominio ─────────────────────────────────

export namespace Validaciones {
    export function camposCreacion(data: CrearUsuarioDTO, items: Usuarios[]): void {
        verificarUnicidad(items, 'id',    data.id);
        verificarUnicidad(items, 'email', data.email);
        validarSoloLetras(data.nombre,   'nombre');
        validarLongitud  (data.nombre,   'nombre',   2, 50);
        validarSoloLetras(data.apellido, 'apellido');
        validarLongitud  (data.apellido, 'apellido', 2, 50);
        validarEmail     (data.email);
        validarUbicacion (data.ubicacion);
    }

    export function camposActualizacion(id: string, data: ActualizarUsuarioDTO, items: Usuarios[]): void {
        if (data.nombre   !== undefined) {
            validarSoloLetras(data.nombre,   'nombre');
            validarLongitud  (data.nombre,   'nombre',   2, 50);
        }
        if (data.apellido !== undefined) {
            validarSoloLetras(data.apellido, 'apellido');
            validarLongitud  (data.apellido, 'apellido', 2, 50);
        }
        if (data.email    !== undefined) {
            verificarUnicidad(items, 'email', data.email, id);
            validarEmail(data.email);
        }
        if (data.ubicacion !== undefined) validarUbicacion(data.ubicacion);
    }
}

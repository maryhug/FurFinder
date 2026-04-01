import { Usuarios, CrearUsuarioDTO, ActualizarUsuarioDTO } from '../models/User.js';
import { Ubicacion } from '../models/Shared.js';
import { DataUsuarios } from '../data/users.data.js';
import { LogAuditoria, ValidarEntidad } from '../decorators/validadores.js';
import {
    validarEmail,
    validarSoloLetras,
    validarLongitud,
    validarUbicacion,
    verificarUnicidad,
} from '../common/utils.js';

// ── Namespace: agrupa validaciones de dominio ─────────────────────────────────
// Diferencia con módulos ES: los namespaces no generan archivos separados,
// solo agrupan lógica bajo un nombre en tiempo de compilación.

namespace Validaciones {
    export function camposCreacion(data: CrearUsuarioDTO): void {
        verificarUnicidad(DataUsuarios, 'id',    data.id);
        verificarUnicidad(DataUsuarios, 'email', data.email);
        validarSoloLetras(data.nombre,   'nombre');
        validarLongitud  (data.nombre,   'nombre',   2, 50);
        validarSoloLetras(data.apellido, 'apellido');
        validarLongitud  (data.apellido, 'apellido', 2, 50);
        validarEmail     (data.email);
        validarUbicacion (data.ubicacion);
    }

    export function camposActualizacion(id: string, data: ActualizarUsuarioDTO): void {
        if (data.nombre   !== undefined) {
            validarSoloLetras(data.nombre,   'nombre');
            validarLongitud  (data.nombre,   'nombre',   2, 50);
        }
        if (data.apellido !== undefined) {
            validarSoloLetras(data.apellido, 'apellido');
            validarLongitud  (data.apellido, 'apellido', 2, 50);
        }
        if (data.email    !== undefined) {
            verificarUnicidad(DataUsuarios, 'email', data.email, id);
            validarEmail(data.email);
        }
        if (data.ubicacion !== undefined) validarUbicacion(data.ubicacion);
    }
}

// ── Decoradores propios ───────────────────────────────────────────────────────

// Decorador de CLASE: registra el nombre de la clase al definirla
function Entidad(constructor: Function): void {
    console.log(`[Entidad] Clase registrada: ${constructor.name}`);
}

// Decorador de PROPIEDAD: valida formato de id numérico
function ValidarCedula(target: any, propertyKey: string): void {
    const privateKey = `_${propertyKey}`;
    const REGEX = /^\d{6,10}$/;
    Object.defineProperty(target, propertyKey, {
        get() { return this[privateKey]; },
        set(valor: string) {
            if (!REGEX.test(valor))
                throw new Error('El id debe contener entre 6 y 10 dígitos numéricos.');
            this[privateKey] = valor;
        },
        enumerable: true,
        configurable: true,
    });
}

// Decorador de PARÁMETRO: registra qué parámetro está marcado para validación
function LogParametro(_target: any, propertyKey: string, parameterIndex: number): void {
    console.log(`[Param] '${propertyKey}': parámetro ${parameterIndex} marcado para validación.`);
}

// ── Clase base abstracta ──────────────────────────────────────────────────────

@Entidad
abstract class EntidadBase {
    readonly createdAt: Date;   // solo lectura: se asigna una vez en el constructor
    isActivo: boolean;

    constructor(isActivo = true) {
        this.createdAt = new Date();
        this.isActivo  = isActivo;
    }

    // Método abstracto: cada subclase debe implementarlo
    abstract describir(): string;

    // Método estático: util de fecha sin necesitar instancia
    static ahora(): string {
        return new Date().toISOString();
    }
}

// ── Clase Usuario ─────────────────────────────────────────────────────────────

@Entidad
export class Usuario extends EntidadBase implements Usuarios {
    @ValidarCedula public id!: string;          // public  : accesible desde cualquier lugar
    public    nombre:    string;                 // public  : requerido por la interfaz Usuarios
    public    apellido:  string;
    public    email:     string;
    public    telefono:  string;
    public    ubicacion: Ubicacion;
    protected readonly tipo: string = 'Usuario'; // protected: solo accesible en esta clase y subclases

    constructor(data: Usuarios) {
        super(data.isActivo ?? true);
        this.id        = data.id;
        this.nombre    = data.nombre;
        this.apellido  = data.apellido;
        this.email     = data.email;
        this.telefono  = data.telefono;
        this.ubicacion = data.ubicacion;
    }

    // Implementación del método abstracto de EntidadBase
    describir(): string {
        return `[${this.tipo}] ${this.nombre} ${this.apellido} <${this.email}>`;
    }

    // Método estático: crea un Usuario directamente desde un plain object
    static fromData(data: Usuarios): Usuario {
        return new Usuario(data);
    }
}

// ── Servicio CRUD (clase para poder aplicar decoradores de método) ─────────────

class UsuarioService {

    @LogAuditoria
    @ValidarEntidad
    crearUsuario(@LogParametro data: CrearUsuarioDTO): Usuarios {
        Validaciones.camposCreacion(data);
        const usuario: Usuarios = { ...data, isActivo: true };
        DataUsuarios.push(usuario);
        return usuario;
    }

    @LogAuditoria
    obtenerUsuarios(): Usuarios[] {
        return DataUsuarios;
    }

    @LogAuditoria
    obtenerUsuarioPorId(id: string): Usuarios {
        const usuario = DataUsuarios.find(u => u.id === id);
        if (!usuario) throw new Error(`Usuario con id '${id}' no encontrado.`);
        return usuario;
    }

    @LogAuditoria
    @ValidarEntidad
    actualizarUsuario(id: string, @LogParametro data: ActualizarUsuarioDTO): Usuarios {
        const index = DataUsuarios.findIndex(u => u.id === id);
        if (index === -1) throw new Error(`Usuario con id '${id}' no encontrado.`);

        const usuario = DataUsuarios[index];
        if (!usuario.isActivo) throw new Error('No se puede actualizar una cuenta desactivada.');

        Validaciones.camposActualizacion(id, data);

        const actualizado: Usuarios = { ...usuario, ...data };
        DataUsuarios[index] = actualizado;
        return actualizado;
    }

    @LogAuditoria
    desactivarUsuario(id: string): Usuarios {
        const index = DataUsuarios.findIndex(u => u.id === id);
        if (index === -1) throw new Error(`Usuario con id '${id}' no encontrado.`);

        const usuario = DataUsuarios[index];
        if (!usuario.isActivo) throw new Error('La cuenta ya está desactivada.');

        const actualizado: Usuarios = { ...usuario, isActivo: false };
        DataUsuarios[index] = actualizado;
        return actualizado;
    }
}

export const userService = new UsuarioService();


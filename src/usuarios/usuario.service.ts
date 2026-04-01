import { Usuarios } from '../models/User.js';
import { BaseService } from '../common/base-service.js';
import { ValidarEntidad, LogAuditoria } from '../decorators/validadores.js';
import { capitalizar } from '../common/utils.js';
import { Validaciones, CrearUsuarioDTO, ActualizarUsuarioDTO } from './usuario.validators.js';
import { DataUsuarios } from '../data/users.data.js';

export namespace FurFinder {
    export namespace UsuariosNS {
        export class UsuarioService extends BaseService<Usuarios> {
            constructor() {
                super();
                this.cargarDatosIniciales(DataUsuarios);
            }

            validarCrear(payload: Partial<Usuarios>): void {
                Validaciones.camposCreacion(payload as CrearUsuarioDTO, this.obtenerTodos());
            }

            validarActualizar(_payload: Partial<Usuarios>): void {
                // La validación con contexto de id se realiza en actualizarUsuario
            }

            @ValidarEntidad
            @LogAuditoria
            crearUsuario(data: CrearUsuarioDTO): Usuarios {
                this.validarCrear(data);
                const nuevo = this.armarUsuario(data, data.id);
                this.data.set(nuevo.id, nuevo);
                return nuevo;
            }

            obtenerUsuarios(): Usuarios[] {
                return this.obtenerTodos();
            }

            obtenerUsuarioPorId(id: string): Usuarios | null {
                if (!id.trim()) throw new Error('id no puede estar vacío');
                return this.data.get(id) ?? null;
            }

            @LogAuditoria
            actualizarUsuario(id: string, data: ActualizarUsuarioDTO): Usuarios | null {
                const actual = this.obtenerUsuarioPorId(id);
                if (!actual) return null;
                if (!actual.isActivo) throw new Error('No se puede actualizar una cuenta desactivada.');
                const limpio = this.limpiarUndefined(data);
                Validaciones.camposActualizacion(id, limpio as ActualizarUsuarioDTO, this.obtenerTodos());
                const merged = this.fusionar(actual, limpio);
                this.data.set(id, merged);
                return merged;
            }

            @LogAuditoria
            desactivarUsuario(id: string): Usuarios | null {
                const actual = this.obtenerUsuarioPorId(id);
                if (!actual) return null;
                if (!actual.isActivo) throw new Error('La cuenta ya está desactivada.');
                const actualizado = { ...actual, isActivo: false };
                this.data.set(id, actualizado);
                return actualizado;
            }

            cargarDatosIniciales(datos: Usuarios[]): void {
                for (const item of datos) {
                    if (!item.id?.trim()) continue;
                    this.data.set(item.id, item);
                }
            }

            private armarUsuario(data: CrearUsuarioDTO, id: string): Usuarios {
                return {
                    id,
                    nombre:    capitalizar(data.nombre),
                    apellido:  capitalizar(data.apellido),
                    email:     data.email.toLowerCase(),
                    telefono:  data.telefono,
                    ubicacion: data.ubicacion,
                    isActivo:  true,
                };
            }

            private limpiarUndefined(data: Partial<Usuarios>): Partial<Usuarios> {
                return Object.fromEntries(
                    Object.entries(data).filter(([, v]) => v !== undefined)
                ) as Partial<Usuarios>;
            }
        }
    }
}

export const userService = new FurFinder.UsuariosNS.UsuarioService();

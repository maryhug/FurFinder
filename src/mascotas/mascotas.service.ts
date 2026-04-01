import { Mascotas, EspecieMascota, SexoMascota } from '../models/Pet.js';
import { BaseService } from '../common/base-service.js';
import { ValidarEntidad, LogAuditoria } from '../decorators/validadores.js';
import { capitalizar } from '../common/utils.js';
import { MascotasValidators, UsuariosLookup } from './mascotas.validators.js';

export namespace FurFinder {
    export namespace MascotasNS {
        export class MascotasService extends BaseService<Mascotas> {
            constructor(private readonly usuariosService?: UsuariosLookup) {
                super();
            }

            private static readonly ESPECIES: EspecieMascota[] = ['Perro', 'Gato', 'Ave', 'Conejo', 'Reptil', 'Otro'];
            private static readonly SEXOS: SexoMascota[] = ['Macho', 'Hembra', 'Desconocido'];


            validarCrear(payload: Partial<Mascotas>): void {
                MascotasValidators.validarCrear(payload, this.usuariosService);
            }

            validarActualizar(payload: Partial<Mascotas>): void {
                MascotasValidators.validarActualizar(payload);
            }

            @ValidarEntidad
            @LogAuditoria
            crearMascota(data: Omit<Mascotas, 'id'>): Mascotas {
                this.validarCrear(data);
                const idGenerado = this.generarId(); // ID alfanumerico de 3 caracteres heredado de BaseService
                const nueva = this.armarMascota(data, idGenerado);
                this.data.set(nueva.id, nueva);
                return nueva;
            }

            obtenerTodas(): Mascotas[] {
                return Array.from(this.data.values());
            }

            obtenerPorId(id: string): Mascotas | null {
                if (!id.trim()) throw new Error('id no puede estar vacio');
                return this.data.get(id) ?? null;
            }

            obtenerPorDueno(duenoId: string): Mascotas[] {
                if (!duenoId.trim()) throw new Error('duenoId no puede estar vacio');
                return this.obtenerTodas().filter((m) => m.duenoId === duenoId);
            }

            @LogAuditoria
            actualizarMascota(id: string, data: Partial<Mascotas>): Mascotas | null {
                const actual = this.obtenerPorId(id);
                if (!actual) return null;
                const limpio = this.limpiarUndefined(data);
                this.validarActualizar(limpio);
                const merged = this.fusionar(actual, this.normalizarParcial(limpio));
                this.data.set(id, merged);
                return merged;
            }

            @LogAuditoria
            eliminarMascota(id: string): boolean {
                if (!this.existePorId(id)) return false;
                this.data.delete(id);
                return true;
            }

            cargarDatosIniciales(datos: Mascotas[]): void {
                for (const item of datos) {
                    if (!item.id?.trim()) continue;
                    this.data.set(item.id, this.armarMascota(item, item.id));
                }
            }

            // Helpers de dominio (no CLI)
            private armarMascota(data: Omit<Mascotas, 'id'> | Mascotas, id: string): Mascotas {
                return {
                    id,
                    duenoId: data.duenoId,
                    especie: data.especie,
                    sexo: data.sexo,
                    color: capitalizar(data.color),
                    nombre: data.nombre ? capitalizar(data.nombre) : undefined,
                    raza: data.raza ? capitalizar(data.raza) : undefined,
                    edad: data.edad,
                };
            }

            private normalizarParcial(data: Partial<Mascotas>): Partial<Mascotas> {
                const out: Partial<Mascotas> = { ...data };
                if (data.color !== undefined) out.color = capitalizar(data.color);
                if (data.nombre !== undefined) out.nombre = capitalizar(data.nombre);
                if (data.raza !== undefined) out.raza = capitalizar(data.raza);
                return out;
            }

            private limpiarUndefined(data: Partial<Mascotas>): Partial<Mascotas> {
                return Object.fromEntries(
                    Object.entries(data).filter(([, v]) => v !== undefined)
                ) as Partial<Mascotas>;
            }

            // Exponemos especies/sexos para el menú CLI
            static get ESPECIES_OPCIONES(): EspecieMascota[] {
                return this.ESPECIES;
            }

            static get SEXOS_OPCIONES(): SexoMascota[] {
                return this.SEXOS;
            }
        }
    }
}
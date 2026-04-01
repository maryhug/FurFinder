import { Mascotas, EspecieMascota, SexoMascota } from '../models';
import { ErrorValidacion, validarEdadPositiva, validarLongitud } from '../common/utils';

type UsuarioMinimo = { id: string; nombre: string; isActivo: boolean };
export type UsuariosLookup = { obtenerPorId(id: string): UsuarioMinimo | null };

export class MascotasValidators {
    static validarDueno(duenoId: string | undefined, usuariosService?: UsuariosLookup): void {
        if (!duenoId?.trim()) throw new ErrorValidacion('duenoId', 'es requerido');
        if (!usuariosService) return;
        const dueno = usuariosService.obtenerPorId(duenoId);
        if (!dueno) throw new ErrorValidacion('duenoId', `usuario "${duenoId}" no existe`);
        if (!dueno.isActivo) throw new ErrorValidacion('duenoId', `usuario "${dueno.nombre}" inactivo`);
    }

    static validarEspecie(especie?: EspecieMascota): void {
        const validas: EspecieMascota[] = ['Perro', 'Gato', 'Ave', 'Conejo', 'Reptil', 'Otro'];
        if (!especie || !validas.includes(especie)) {
            throw new ErrorValidacion('especie', `debe ser una de: ${validas.join(', ')}`);
        }
    }

    static validarSexo(sexo?: SexoMascota): void {
        const validos: SexoMascota[] = ['Macho', 'Hembra', 'Desconocido'];
        if (!sexo || !validos.includes(sexo)) {
            throw new ErrorValidacion('sexo', `debe ser uno de: ${validos.join(', ')}`);
        }
    }

    static validarColor(color?: string): void {
        if (!color?.trim()) throw new ErrorValidacion('color', 'es requerido');
        validarLongitud(color, 'color', 3, 30);
    }

    static validarCrear(payload: Partial<Mascotas>, usuariosService?: UsuariosLookup): void {
        this.validarDueno(payload.duenoId, usuariosService);
        this.validarEspecie(payload.especie);
        this.validarSexo(payload.sexo);
        this.validarColor(payload.color);
        if (payload.nombre !== undefined) validarLongitud(payload.nombre, 'nombre', 2, 40);
        if (payload.edad !== undefined) validarEdadPositiva(payload.edad);
    }

    static validarActualizar(payload: Partial<Mascotas>): void {
        if (payload.duenoId !== undefined) {
            throw new ErrorValidacion('duenoId', 'no se puede cambiar el dueno');
        }
        if (payload.nombre !== undefined) validarLongitud(payload.nombre, 'nombre', 2, 40);
        if (payload.color !== undefined) this.validarColor(payload.color);
        if (payload.edad !== undefined) validarEdadPositiva(payload.edad);
        if (payload.especie !== undefined) this.validarEspecie(payload.especie);
        if (payload.sexo !== undefined) this.validarSexo(payload.sexo);
    }

    static parsearEdad(raw: string): number | undefined {
        if (!raw.trim()) return undefined;
        const n = Number(raw);
        if (!Number.isFinite(n)) throw new ErrorValidacion('edad', 'debe ser numerica');
        return n;
    }
}
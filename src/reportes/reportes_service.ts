import {reportes} from '../data/data_reporte';
import { Reportes } from '../models/Report';
import { Ubicacion  } from '../models';
import { EstadoReporte } from '../models/shared';
import { validarLongitud, validarUbicacion } from '../common/utils';
import { ErrorValidacion } from '../common/utils';
import { BaseService } from '../common/base-service';
//import { Reportes, Ubicacion } from '../models';
//import { Reportes, Reportes } from '../models';
//import { Reportes } from './reportes.model';
//import { EstadoReporte, validarTransicion } from './reportes_estado';
//import { crearReporte } from './reportes_functions';
//import { BaseService } from './base_service';


namespace FurFinder.Reportes {
  //Validar si existe mascotaId y usuarioId
export const existe =function (mascotaId:string, usuarioId:string):Reportes | undefined {
    return reportes.find(reporte => reporte.mascotaId === mascotaId && reporte.usuarioId === usuarioId);
}
console.log(existe('1', '1')); // Devuelve el reporte correspondiente
console.log(existe('1', '999')); // Devuelve undefined

// Descripcion minima de 10 caracteres
export const descripcionValida =  (descripcion: string): string =>{
    try{
        validarLongitud(descripcion, 'descripcion', 10, 50);
        return "Descripción válida";
    } catch (error: unknown) {
        // Validación segura del error
        if (error instanceof ErrorValidacion) {
            return error.message;
        }

        if (error instanceof Error) {
            return error.message;
        }
        return "Error desconocido";
    }
}
// Muy corta
console.log(descripcionValida("Perro"));

// Muy larga
console.log(descripcionValida("Este es un texto demasiado largo que supera el límite permitido para la descripción del reporte"));

//Correcta
console.log(descripcionValida("Perro visto en el parque del barrio"));



//Ubicacion completa
export const ubucacionCompleta=(mascotaId:string): Ubicacion | string=>{
    const reporte = reportes.find(r => r.mascotaId === mascotaId)
    if(!reporte){
        return "Mascota no encontrada"
    }
       try {
        // Validamos la ubicación antes de devolverla
        validarUbicacion(reporte.ubicacion);
    } catch (error) {
        if (error instanceof ErrorValidacion) {
            return `Error de validación: ${error} - ${error}`;
        }
        // Por si ocurre cualquier otro error inesperado
        throw error;
    }
    return reporte.ubicacion
}
console.log(ubucacionCompleta("5"))

// Estados evolutivos sugeridos (flujo lógico):
// Perdido → Avistado → Encontrado → Recuperado
// Adopcion como rama separada.
export const transicionesValidas: Record<EstadoReporte, EstadoReporte[]> = {
  [EstadoReporte.Perdido]: [EstadoReporte.Avistado],
  [EstadoReporte.Avistado]: [EstadoReporte.Encontrado],
  [EstadoReporte.Encontrado]: [EstadoReporte.Recuperado],
  [EstadoReporte.Recuperado]: [],
  [EstadoReporte.Adopcion]: []
};
//mirar si se puede cambiar de estado------
export const actualizarEstado = function (mascotaId: string, nuevoEstado: EstadoReporte): string {
    const reporte = reportes.find(r => r.mascotaId === mascotaId);
    if (!reporte) return "Mascota no encontrada";

    const estadoActual = reporte.estado;

    if (estadoActual === nuevoEstado) {
        return `El estado ya es ${nuevoEstado}`;
    }
    //validar transacion
    if (!transicionesValidas[estadoActual].includes(nuevoEstado)){
        return `No puedes cambiar de ${estadoActual} a ${nuevoEstado}`
    }
    reporte.estado = nuevoEstado;
    return `Estado actualizado de ${estadoActual} a ${nuevoEstado}`;

}
console.log(actualizarEstado("5", EstadoReporte.Recuperado)); // Devuelve "Estado actualizado a Recuperado"

//Metodos CRUD
    // crearReporte(data: Omit<Reportes, 'id' | 'fecha'>): Reportes
export const crearReporte = function (data: Omit<Reportes, 'id' | 'fecha'>): Reportes {
    const nuevoReporte: Reportes = {
        id: (reportes.length + 1).toString(),
        fecha: new Date(),
        ...data
    };
    reportes.push(nuevoReporte);
    return nuevoReporte;
}
console.log(crearReporte({mascotaId: '6', usuarioId: '6', descripcion: 'Perro visto cerca del parque', ubicacion: {direccion: 'Calle Nueva 123', barrio: 'Centro', ciudad: 'Ciudad', pais: 'Pais'}, estado: EstadoReporte.Perdido})); // Devuelve el nuevo reporte creado

console.log(reportes) // Devuelve el array de reportes con el nuevo reporte incluido

// obtenerTodos(): Reportes[]
export const obtenerTodosReportes= (): Reportes[] => reportes

//obtenerPorId(id: string): Reportes | null
export const obtenerPorId = (id:string):Reportes[]=>
    reportes.filter(reporte => reporte.id === id)

console.log(obtenerPorId("1")) // Devuelve el reporte con id "1"

//obtenerPorIdMascota(mascotaId: string): Reportes[]
export const obtenerPorIdMascota = (mascotaId:string):Reportes[]=>
    reportes.filter(reporte => reporte.mascotaId === mascotaId)

console.log(obtenerPorIdMascota("1")) // Devuelve el reporte con id "1"

//obtenerPorUsuario(usuarioId: string): Reportes[]
export const obtenerPorIdUsuario = (usuarioId:string):Reportes[]=>
    reportes.filter(reporte => reporte.usuarioId === usuarioId)

console.log(obtenerPorIdUsuario("1")) // Devuelve el reporte con id "1"

//actualizarReporte(id: string, data: Partial<Reportes>): Reportes | null
export const actualizarReporte=function(id:string, data:Partial<Reportes>):Reportes | null {
    const reporte = reportes.find(r => r.id === id);
    if (!reporte) {
        return null;
    }
    Object.assign(reporte, data);
    return reporte;
}
console.log(actualizarReporte("1", {ubicacion: {direccion: "Calle Nueva 456", barrio: "Centro", ciudad: "Ciudad", pais: "Pais"}})) // Devuelve el reporte actualizado

//eliminarReporte(id: string): boolean (puede ser hard delete)
export const eliminarReporte = function (id: string): boolean {
    const index = reportes.findIndex(r => r.id === id);
    if (index === -1) {
        return false;
    }
    reportes.splice(index, 1);
    return true;
};
console.log(eliminarReporte("9")) // Devuelve true si se eliminó el reporte, false si no se encontró
console.log(reportes) // Devuelve el array de reportes sin el reporte eliminado

//Métodos de estados:
// cambiarEstado(id: string, nuevoEstado: EstadoReporte): Reportes | null
export const cambiarEstado=(id:string, nuevoEstado: EstadoReporte):Reportes | null =>{
    const reporte = reportes.find(r => r.id === id);
    if (!reporte) {
        return null;
    }
    const estadoActual = reporte.estado;
    if (!transicionesValidas[estadoActual].includes(nuevoEstado)){
        throw new ErrorValidacion('estado', `No puedes cambiar de ${estadoActual} a ${nuevoEstado}`);
    }
    reporte.estado = nuevoEstado;
    return reporte;

}
console.log(cambiarEstado("1", EstadoReporte.Recuperado)) // Devuelve el reporte con el estado actualizado a "Recuperado"

//Validar transiciones válidas (no saltar de Perdido directo a Recuperado, etc.).
export const validarTransicion = (estadoActual: EstadoReporte, nuevoEstado: EstadoReporte): boolean => {
    return transicionesValidas[estadoActual].includes(nuevoEstado);

}
console.log(validarTransicion(EstadoReporte.Perdido, EstadoReporte.Recuperado)) // Devuelve false
console.log(validarTransicion(EstadoReporte.Perdido, EstadoReporte.Avistado)) // Devuelve true

// obtenerPorEstado(estado: EstadoReporte): Reportes[].
export const obtenerPorEstado = (estado: EstadoReporte): Reportes[] =>
    reportes.filter(reporte => reporte.estado === estado)
console.log(obtenerPorEstado(EstadoReporte.Encontrado)) // Devuelve un array con los reportes que tienen estado "Encontrado"


// Requisitos TS:
// Clase ReportesService extends BaseService<Reportes>.
// Clase ReportesService que extiende BaseService<Reportes>
//import { Reportes } from '../models';


export class ReportesService extends BaseService<Reportes> {
    constructor() {
        super();
    }

    // --- Implementaciones obligatorias de BaseService ---
    validarCrear(payload: Partial<Reportes>): void {
        if (!payload.descripcion || payload.descripcion.length < 10) {
            throw new ErrorValidacion('descripcion', 'La descripción debe tener al menos 10 caracteres');
        }
        if (!payload.estado) {
            throw new ErrorValidacion('estado', 'El estado es requerido');
        }
        if (!payload.ubicacion) {
            throw new ErrorValidacion('ubicacion', 'La ubicación es requerida');
        }
    }

    validarActualizar(payload: Partial<Reportes>): void {
        if (payload.descripcion && payload.descripcion.length < 10) {
            throw new ErrorValidacion('descripcion', 'La descripción debe tener al menos 10 caracteres');
        }
        // Podrías agregar más validaciones según tu lógica
    }

    // --- Métodos específicos de ReportesService ---
    crearReporte(data: Omit<Reportes, 'id' | 'fecha'>): Reportes {
        const nuevo: Reportes = {
            id: this.generarId(),
            fecha: new Date(),
            ...data
        };
        this.validarCrear(nuevo);
        this.data.set(nuevo.id, nuevo);
        return nuevo;
    }

    obtenerPorMascota(mascotaId: string): Reportes | undefined {
        return Array.from(this.data.values()).find(r => r.mascotaId === mascotaId);
    }

    actualizarEstado(mascotaId: string, nuevoEstado: EstadoReporte): string {
        const reporte = this.obtenerPorMascota(mascotaId);
        if (!reporte) return 'Mascota no encontrada';

        const estadoActual = reporte.estado;
        if (estadoActual === nuevoEstado) return `El estado ya es ${nuevoEstado}`;
        if (!validarTransicion(estadoActual, nuevoEstado)) {
            return `No puedes cambiar de ${estadoActual} a ${nuevoEstado}`;
        }

        reporte.estado = nuevoEstado;
        this.data.set(reporte.id, reporte); // actualizar en el Map
        return `Estado actualizado de ${estadoActual} a ${nuevoEstado}`;
    }

    ubicacionCompleta(mascotaId: string): Ubicacion | string {
        const reporte = this.obtenerPorMascota(mascotaId);
        if (!reporte) return "Mascota no encontrada";

        try {
            validarUbicacion(reporte.ubicacion);
        } catch (error) {
            if (error instanceof ErrorValidacion) {
                return `Error de validación: ${error} - ${error}`;
            }
            throw error;
        }
        return reporte.ubicacion;
    }
}

//export type EstadoReporte = 'Perdido' | 'Avistado' | 'Encontrado' | 'Recuperado' | 'Adopcion';



export function ValidarEntidad(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
        const entidad = args[0];
        if (!entidad) {
            throw new ErrorValidacion(propertyKey, 'Entidad no puede ser nula o indefinida');
        }
        if ('descripcion' in entidad && (!entidad.descripcion || entidad.descripcion.length < 10)) {
            throw new ErrorValidacion('descripcion', 'La descripción debe tener al menos 10 caracteres');
        }
        return original.apply(this, args);
    };
}
export function LogAuditoria(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
        console.log(`[AUDITORIA] Método ${propertyKey} llamado con:`, args);
        const result = original.apply(this, args);
        console.log(`[AUDITORIA] Método ${propertyKey} terminó. Resultado:`, result);
        return result;
    };
}






}
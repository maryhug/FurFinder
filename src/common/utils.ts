// src/common/utils.ts
import { Ubicacion } from '../models/Shared.js';

// ─── Clase de error personalizada ────────────────────────────────────────────

export class ErrorValidacion extends Error {
    constructor(campo: string, mensaje: string) {
        super(`[Validación] ${campo}: ${mensaje}`);
        this.name = 'ErrorValidacion';
    }
}

// ─── Regexes compartidas ─────────────────────────────────────────────────────

const REGEX_EMAIL    = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
const REGEX_TELEFONO = /^\+57[0-9]{10}$/;          // Colombia: +57 + 10 dígitos
const REGEX_SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/;

// ─── Validadores de texto ─────────────────────────────────────────────────────

export function validarLongitud(
    valor: string,
    campo: string,
    min: number,
    max: number
): void {
    const largo = valor.trim().length;
    if (largo < min || largo > max) {
        throw new ErrorValidacion(
            campo,
            `debe tener entre ${min} y ${max} caracteres (actual: ${largo})`
        );
    }
}

export function validarSoloLetras(valor: string, campo: string): void {
    if (!REGEX_SOLO_LETRAS.test(valor.trim())) {
        throw new ErrorValidacion(campo, 'solo puede contener letras y espacios');
    }
}

export function validarEmail(email: string): void {
    if (!REGEX_EMAIL.test(email.trim())) {
        throw new ErrorValidacion('email', `formato inválido: "${email}"`);
    }
}

export function validarTelefono(telefono: string): void {
    if (!REGEX_TELEFONO.test(telefono.trim())) {
        throw new ErrorValidacion(
            'telefono',
            `debe tener formato +57XXXXXXXXXX (10 dígitos colombianos): "${telefono}"`
        );
    }
}

// ─── Validadores numéricos ────────────────────────────────────────────────────

export function validarEdadPositiva(edad: number, campo = 'edad'): void {
    if (!Number.isFinite(edad) || edad <= 0) {
        throw new ErrorValidacion(campo, `debe ser un número positivo (actual: ${edad})`);
    }
}

// ─── Validador de Ubicacion ───────────────────────────────────────────────────

export function validarUbicacion(ubicacion: Ubicacion): void {
    if (!ubicacion) {
        throw new ErrorValidacion('ubicacion', 'es requerida');
    }

    const campos: Array<keyof Omit<Ubicacion, 'codigoPostal'>> = [
        'direccion',
        'barrio',
        'ciudad',
        'pais',
    ];

    for (const campo of campos) {
        const valor = ubicacion[campo];
        if (!valor || valor.trim().length === 0) {
            throw new ErrorValidacion(`ubicacion.${String(campo)}`, 'no puede estar vacío');
        }
    }

    if (
        ubicacion.codigoPostal !== undefined &&
        ubicacion.codigoPostal.trim().length === 0
    ) {
        throw new ErrorValidacion(
            'ubicacion.codigoPostal',
            'si se proporciona, no puede estar vacío'
        );
    }
}

// ─── Helpers de unicidad (para usar dentro de los servicios) ──────────────────

export function verificarUnicidad<T>(
    items: T[],
    campo: keyof T,
    valor: string,
    idExcluir?: string
): void {
    const yaExiste = items.some(
        (item) =>
            String(item[campo]).toLowerCase() === valor.toLowerCase() &&
            (item as T & { id: string }).id !== idExcluir
    );

    if (yaExiste) {
        throw new ErrorValidacion(
            String(campo),
            `el valor "${valor}" ya está registrado`
        );
    }
}

// ─── Helper de formato ────────────────────────────────────────────────────────

export function capitalizar(texto: string): string {
    return texto.trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}
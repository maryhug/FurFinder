// src/common/base-service.ts

export abstract class BaseService<T extends { id: string }> {
    protected data: Map<string, T> = new Map();

    // Cada servicio define sus propias reglas de validación
    abstract validarCrear(payload: Partial<T>): void;
    abstract validarActualizar(payload: Partial<T>): void;

    protected generarId(): string {
        return crypto.randomUUID();
    }

    // Retorna TODOS los registros (cada servicio filtra si necesita)
    obtenerTodos(): T[] {
        return Array.from(this.data.values());
    }

    obtenerPorId(id: string): T | null {
        return this.data.get(id) ?? null;
    }

    // Util interna: verifica existencia antes de operar
    protected existePorId(id: string): boolean {
        return this.data.has(id);
    }

    // Util interna: actualización parcial segura con spread
    protected fusionar(existente: T, cambios: Partial<T>): T {
        return { ...existente, ...cambios, id: existente.id }; // id nunca se sobreescribe
    }
}

/*
🔑 Se añaden existePorId y fusionar como utilidades protegidas que todos los servicios del equipo pueden reutilizar sin duplicar lógica.
*/
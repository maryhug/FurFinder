// Class abstracta para la creacion de servicios, todos trabajamos con esta clase para interpretar la informacion

export abstract class BaseService<T extends { id: string }> {
    protected data: Map<string, T> = new Map();

    // Cada servicio define sus propias reglas de validación
    abstract validarCrear(payload: Partial<T>): void;
    abstract validarActualizar(payload: Partial<T>): void;

    protected generarId(): string {
        const maxIntentos = 200;

        for (let i = 0; i < maxIntentos; i++) {
            const id = this.generarAlfanumerico();
            if (!this.existePorId(id)) return id;
        }

        throw new Error('No se pudo generar un ID alfanumerico unico.');
    }

    private generarAlfanumerico(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return `${this.randomChar(chars)}${this.randomChar(chars)}${this.randomChar(chars)}`;
    }

    private randomChar(chars: string): string {
        const idx = crypto.getRandomValues(new Uint32Array(1))[0] % chars.length;
        return chars[idx];
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
Se añaden existePorId y fusionar como utilidades protegidas que todos los servicios del equipo pueden reutilizar sin duplicar lógica.
*/
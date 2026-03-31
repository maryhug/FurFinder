// src/decorators/validadores.ts

export function LogAuditoria(
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
): PropertyDescriptor {
    const metodoOriginal = descriptor.value as (...args: unknown[]) => unknown;

    descriptor.value = function (...args: unknown[]) {
        console.log(
            `[AUDITORÍA] Método: ${propertyKey} | Fecha: ${new Date().toISOString()} | Args: ${JSON.stringify(args)}`
        );
        const resultado = metodoOriginal.apply(this, args);
        console.log(`[AUDITORÍA] ${propertyKey} ejecutado correctamente.`);
        return resultado;
    };

    return descriptor;
}

export function ValidarEntidad(
    target: object,
    propertyKey: string,
    descriptor: PropertyDescriptor
): PropertyDescriptor {
    const metodoOriginal = descriptor.value as (...args: unknown[]) => unknown;

    descriptor.value = function (...args: unknown[]) {
        const [payload] = args;

        if (payload === null || payload === undefined) {
            throw new Error(
                `[ValidarEntidad] Payload nulo o indefinido en método: "${propertyKey}"`
            );
        }

        if (typeof payload === 'object' && Object.keys(payload).length === 0) {
            throw new Error(
                `[ValidarEntidad] Payload vacío en método: "${propertyKey}"`
            );
        }

        return metodoOriginal.apply(this, args);
    };

    return descriptor;
}


/*
Diferencias clave vs. el documento: el tipo del target es object en lugar de any (modo strict),
se retorna PropertyDescriptor explícitamente, y se tipa metodoOriginal correctamente.
*/
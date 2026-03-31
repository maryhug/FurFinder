// src/common/main-menu.ts
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export type OpcionMenu = {
    clave: string;               // ej: '1'
    titulo: string;              // ej: 'Mascotas'
    run: () => Promise<void>;    // función que lanza el sub-menú
};

export async function menuPrincipal(opciones: OpcionMenu[]): Promise<void> {
    const rl = createInterface({ input, output });

    let salir = false;
    while (!salir) {
        console.log('\n=== FurFinder | Menu principal ===');
        for (const op of opciones) {
            console.log(`${op.clave}) ${op.titulo}`);
        }
        console.log('0) Salir');

        const seleccion = (await rl.question('Opcion: ')).trim();

        if (seleccion === '0') {
            salir = true;
            break;
        }

        const opcion = opciones.find((o) => o.clave === seleccion);
        if (!opcion) {
            console.log('Opcion invalida');
            continue;
        }

        try {
            await opcion.run();
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            console.error('Error ejecutando opcion:', msg);
        }
    }

    rl.close();
}
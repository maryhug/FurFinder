import { createInterface, Interface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { Mascotas } from '../models';
import { MascotasValidators } from './mascotas.validators';
import { FurFinder } from './mascotas.service';

type MascotasService = FurFinder.MascotasNS.MascotasService;

export class MascotasMenu {
    constructor(private readonly service: MascotasService) {}

    async iniciar(): Promise<void> {
        const rl = createInterface({ input, output });
        console.log('\n=== MENU MASCOTAS (FurFinder) ===');
        this.imprimirListadoInicial();

        let salir = false;
        while (!salir) {
            this.mostrarOpciones();
            const op = await this.preguntar(rl, 'Opcion: ');
            salir = await this.ejecutarOpcion(op, rl);
        }

        rl.close();
    }

    private mostrarOpciones(): void {
        console.log('\n1) Listar');
        console.log('2) Buscar por ID');
        console.log('3) Buscar por dueno');
        console.log('4) Crear');
        console.log('5) Actualizar');
        console.log('6) Eliminar');
        console.log('0) Salir');
    }

    private imprimirListadoInicial(): void {
        const items = this.service.obtenerTodas();
        if (!items.length) return console.log('No hay mascotas cargadas.');
        console.log('\nDatos de prueba cargados:');
        console.table(items);
    }

    private async ejecutarOpcion(op: string, rl: Interface): Promise<boolean> {
        try {
            if (op === '1') return this.opListar();
            if (op === '2') return await this.opBuscarPorId(rl);
            if (op === '3') return await this.opBuscarPorDueno(rl);
            if (op === '4') return await this.opCrear(rl);
            if (op === '5') return await this.opActualizar(rl);
            if (op === '6') return await this.opEliminar(rl);
            if (op === '0') return true;
            console.log('Opcion invalida');
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            console.error('Error:', msg);
        }
        return false;
    }

    private opListar(): boolean {
        console.table(this.service.obtenerTodas());
        return false;
    }

    private async opBuscarPorId(rl: Interface): Promise<boolean> {
        const id = await this.preguntar(rl, 'ID: ');
        console.log(this.service.obtenerPorId(id) ?? 'No encontrada');
        return false;
    }

    private async opBuscarPorDueno(rl: Interface): Promise<boolean> {
        const duenoId = await this.preguntar(rl, 'duenoId: ');
        console.table(this.service.obtenerPorDueno(duenoId));
        return false;
    }

    private async opCrear(rl: Interface): Promise<boolean> {
        const data = await this.leerPayloadCrear(rl);
        const creada = this.service.crearMascota(data);
        console.log('Creada:', creada);
        return false;
    }

    private async opActualizar(rl: Interface): Promise<boolean> {
        const id = await this.preguntar(rl, 'ID a actualizar: ');
        const patch = await this.leerPayloadActualizar(rl);
        const out = this.service.actualizarMascota(id, patch);
        console.log(out ?? 'No encontrada');
        return false;
    }

    private async opEliminar(rl: Interface): Promise<boolean> {
        const id = await this.preguntar(rl, 'ID a eliminar: ');
        console.log(this.service.eliminarMascota(id) ? 'Eliminada' : 'No encontrada');
        return false;
    }

    // Helpers de CLI

    private async seleccionarOpcion<T extends string>(rl: Interface, titulo: string, opciones: T[]): Promise<T> {
        while (true) {
            console.log(`\n${titulo}:`);
            opciones.forEach((op, i) => console.log(`${i + 1}) ${op}`));
            const raw = await this.preguntar(rl, 'Elige un numero: ');
            const idx = Number(raw) - 1;
            if (Number.isInteger(idx) && idx >= 0 && idx < opciones.length) return opciones[idx];
            console.log('Opcion invalida, intenta de nuevo.');
        }
    }

    private async pedirDuenoIdValido(rl: Interface): Promise<string> {
        while (true) {
            const duenoId = await this.preguntar(rl, 'duenoId: ');
            try {
                // Solo validamos dueño aquí, usando validators y el service actual
                // (MascotasValidators no necesita service, solo UsuariosLookup que ya está dentro)
                MascotasValidators.validarDueno(duenoId, (this.service as any)['usuariosService']);
                return duenoId;
            } catch (e) {
                console.log(e instanceof Error ? e.message : 'duenoId invalido');
            }
        }
    }

    private async pedirEdadOpcional(rl: Interface, label: string): Promise<number | undefined> {
        while (true) {
            const raw = await this.preguntar(rl, label);
            if (!raw) return undefined;
            try {
                return MascotasValidators.parsearEdad(raw);
            } catch (e) {
                console.log(e instanceof Error ? e.message : 'edad invalida');
            }
        }
    }

    private async leerPayloadCrear(rl: Interface): Promise<Omit<Mascotas, 'id'>> {
        const duenoId = await this.pedirDuenoIdValido(rl);
        const nombre = await this.preguntar(rl, 'nombre (opcional): ');
        const especie = await this.seleccionarOpcion(
            rl,
            'Especie',
            FurFinder.MascotasNS.MascotasService.ESPECIES_OPCIONES
        );
        const raza = await this.preguntar(rl, 'raza (opcional): ');
        const color = await this.preguntar(rl, 'color: ');
        const edad = await this.pedirEdadOpcional(rl, 'edad (opcional): ');
        const sexo = await this.seleccionarOpcion(
            rl,
            'Sexo',
            FurFinder.MascotasNS.MascotasService.SEXOS_OPCIONES
        );
        return {
            duenoId,
            nombre: nombre || undefined,
            especie,
            raza: raza || undefined,
            color,
            edad,
            sexo,
        };
    }

    private async leerPayloadActualizar(rl: Interface): Promise<Partial<Mascotas>> {
        const patch: Partial<Mascotas> = {};

        const nombre = await this.preguntar(rl, 'nombre (enter omite): ');
        if (nombre) patch.nombre = nombre;

        const cambiarEspecie = await this.preguntar(rl, 'cambiar especie? (s/n): ');
        if (cambiarEspecie.toLowerCase() === 's') {
            patch.especie = await this.seleccionarOpcion(
                rl,
                'Especie',
                FurFinder.MascotasNS.MascotasService.ESPECIES_OPCIONES
            );
        }

        const raza = await this.preguntar(rl, 'raza (enter omite): ');
        if (raza) patch.raza = raza;

        const color = await this.preguntar(rl, 'color (enter omite): ');
        if (color) patch.color = color;

        const edad = await this.pedirEdadOpcional(rl, 'edad (enter omite): ');
        if (edad !== undefined) patch.edad = edad;

        const cambiarSexo = await this.preguntar(rl, 'cambiar sexo? (s/n): ');
        if (cambiarSexo.toLowerCase() === 's') {
            patch.sexo = await this.seleccionarOpcion(
                rl,
                'Sexo',
                FurFinder.MascotasNS.MascotasService.SEXOS_OPCIONES
            );
        }

        return patch;
    }

    private async preguntar(rl: Interface, texto: string): Promise<string> {
        return (await rl.question(texto)).trim();
    }
}
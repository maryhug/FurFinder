import { Interface } from 'node:readline/promises';

import { Mascotas } from '../../models/Pet.js';
import { MascotasValidators } from './mascotas.validators.js';
import { FurFinder } from './mascotas.service.js';
import { titulo, seccion, opcion, errorMsg, okMsg, pregunta, divider, mutedMsg } from '../../common/cli-style.js';

type MascotasService = FurFinder.MascotasNS.MascotasService;

export class MascotasMenu {
    constructor(private readonly service: MascotasService) {}

    async iniciar(rl: Interface): Promise<void> {
        console.clear();
        console.log(titulo('FurFinder • Mascotas'));
        this.imprimirListadoInicial();

        let salir = false;
        while (!salir) {
            this.mostrarOpciones();
            const op = await this.preguntar(rl, 'Opcion: ');
            salir = await this.ejecutarOpcion(op, rl);
        }
    }

    private mostrarOpciones(): void {
        seccion('Menu mascotas');
        console.log(opcion('1', 'Listar'));
        console.log(opcion('2', 'Buscar por ID'));
        console.log(opcion('3', 'Buscar por dueno'));
        console.log(opcion('4', 'Crear'));
        console.log(opcion('5', 'Actualizar'));
        console.log(opcion('6', 'Eliminar'));
        console.log(opcion('0', 'Volver'));
        divider();
    }

    private imprimirListadoInicial(): void {
        const items = this.service.obtenerTodas();
        if (!items.length) {
            console.log(mutedMsg('No hay mascotas cargadas.'));
            return;
        }
        seccion('Datos de prueba cargados');
        console.table(items);
        divider();
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
            console.log(errorMsg('Opcion invalida'));
        } catch (e) {
            const msg = e instanceof Error ? e.message : String(e);
            console.error(errorMsg(msg));
        }
        return false;
    }

    private opListar(): boolean {
        seccion('Listado de mascotas');
        console.table(this.service.obtenerTodas());
        divider();
        return false;
    }

    private async opBuscarPorId(rl: Interface): Promise<boolean> {
        seccion('Buscar por ID');
        const id = await this.preguntar(rl, 'ID: ');
        const res = this.service.obtenerPorId(id);
        console.log(res ?? errorMsg('No encontrada'));
        divider();
        return false;
    }

    private async opBuscarPorDueno(rl: Interface): Promise<boolean> {
        seccion('Buscar por dueno');
        const duenoId = await this.preguntar(rl, 'duenoId: ');
        console.table(this.service.obtenerPorDueno(duenoId));
        divider();
        return false;
    }

    private async opCrear(rl: Interface): Promise<boolean> {
        seccion('Crear mascota');
        const data = await this.leerPayloadCrear(rl);
        const creada = this.service.crearMascota(data);
        console.log(okMsg('Creada:'), creada);
        divider();
        return false;
    }

    private async opActualizar(rl: Interface): Promise<boolean> {
        seccion('Actualizar mascota');
        const id = await this.preguntar(rl, 'ID a actualizar: ');
        const patch = await this.leerPayloadActualizar(rl);
        const out = this.service.actualizarMascota(id, patch);
        console.log(out ?? errorMsg('No encontrada'));
        divider();
        return false;
    }

    private async opEliminar(rl: Interface): Promise<boolean> {
        seccion('Eliminar mascota');
        const id = await this.preguntar(rl, 'ID a eliminar: ');
        console.log(
            this.service.eliminarMascota(id) ? okMsg('Eliminada') : errorMsg('No encontrada')
        );
        divider();
        return false;
    }

    // Helpers de CLI (idénticos salvo mensajes)

    private async seleccionarOpcion<T extends string>(
        rl: Interface,
        tituloTexto: string,
        opciones: T[],
    ): Promise<T> {
        while (true) {
            seccion(tituloTexto);
            opciones.forEach((op, i) => console.log(opcion(String(i + 1), op)));
            const raw = await this.preguntar(rl, 'Elige un numero: ');
            const idx = Number(raw) - 1;
            if (Number.isInteger(idx) && idx >= 0 && idx < opciones.length) return opciones[idx];
            console.log(errorMsg('Opcion invalida, intenta de nuevo.'));
        }
    }

    private async pedirDuenoIdValido(rl: Interface): Promise<string> {
        while (true) {
            const duenoId = await this.preguntar(rl, 'duenoId: ');
            try {
                MascotasValidators.validarDueno(duenoId, (this.service as any)['usuariosService']);
                return duenoId;
            } catch (e) {
                console.log(
                    errorMsg(e instanceof Error ? e.message : 'duenoId invalido'),
                );
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
                console.log(errorMsg(e instanceof Error ? e.message : 'edad invalida'));
            }
        }
    }

    private async leerPayloadCrear(rl: Interface): Promise<Omit<Mascotas, 'id'>> {
        const duenoId = await this.pedirDuenoIdValido(rl);
        const nombre = await this.preguntar(rl, 'nombre (opcional): ');
        const especie = await this.seleccionarOpcion(
            rl,
            'Especie',
            FurFinder.MascotasNS.MascotasService.ESPECIES_OPCIONES,
        );
        const raza = await this.preguntar(rl, 'raza (opcional): ');
        const color = await this.preguntar(rl, 'color: ');
        const edad = await this.pedirEdadOpcional(rl, 'edad (opcional): ');
        const sexo = await this.seleccionarOpcion(
            rl,
            'Sexo',
            FurFinder.MascotasNS.MascotasService.SEXOS_OPCIONES,
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
                FurFinder.MascotasNS.MascotasService.ESPECIES_OPCIONES,
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
                FurFinder.MascotasNS.MascotasService.SEXOS_OPCIONES,
            );
        }

        return patch;
    }

    private async preguntar(rl: Interface, texto: string): Promise<string> {
        return (await rl.question(pregunta(texto))).trim();
    }
}
import { createInterface, Interface as ReadlineInterface } from 'node:readline/promises';
import { Usuarios } from '../models/User.js';
import { Ubicacion } from '../models/shared.js';
import { userService } from './usuario.service.js';
import { ActualizarUsuarioDTO } from './usuario.validators.js';

// ── Helpers ───────────────────────────────────────────────────────────────────

const ask = (rl: ReadlineInterface, pregunta: string): Promise<string> =>
    rl.question(pregunta).then((r: string) => r.trim());

function separador() { console.log('\n' + '─'.repeat(40)); }

function mostrarUsuario(u: Usuarios) {
    console.log(`  Id       : ${u.id}`);
    console.log(`  Nombre   : ${u.nombre} ${u.apellido}`);
    console.log(`  Email    : ${u.email}`);
    console.log(`  Teléfono : ${u.telefono}`);
    console.log(`  Ciudad   : ${u.ubicacion.ciudad}`);
    console.log(`  Activo   : ${u.isActivo ? 'Sí' : 'No'}`);
}

async function pedirUbicacion(rl: ReadlineInterface): Promise<Ubicacion> {
    const direccion = await ask(rl, '  Dirección : ');
    const barrio    = await ask(rl, '  Barrio    : ');
    const ciudad    = await ask(rl, '  Ciudad    : ');
    const pais      = await ask(rl, '  País      : ');
    return { direccion, barrio, ciudad, pais };
}

// ── Opciones del menú ─────────────────────────────────────────────────────────

async function opcionCrear(rl: ReadlineInterface) {
    console.log('\n[ Crear usuario ]');
    try {
        const id        = await ask(rl, '  Id       : ');
        const nombre    = await ask(rl, '  Nombre   : ');
        const apellido  = await ask(rl, '  Apellido : ');
        const email     = await ask(rl, '  Email    : ');
        const telefono  = await ask(rl, '  Teléfono : ');
        const ubicacion = await pedirUbicacion(rl);
        mostrarUsuario(userService.crearUsuario({ id, nombre, apellido, email, telefono, ubicacion }));
    } catch (e) { console.error('  Error:', (e as Error).message); }
}

async function opcionListar() {
    console.log('\n[ Lista de usuarios ]');
    const lista = userService.obtenerUsuarios();
    if (!lista.length) { console.log('  No hay usuarios registrados.'); return; }
    lista.forEach((u, i) => {
        console.log(`\n  [${i + 1}] ${u.nombre} ${u.apellido} | ${u.email} | ${u.isActivo ? 'Activo' : 'Inactivo'}`);
        console.log(`      Id: ${u.id}`);
    });
}

async function opcionBuscar(rl: ReadlineInterface) {
    console.log('\n[ Buscar usuario por id ]');
    try {
        const u = userService.obtenerUsuarioPorId(await ask(rl, '  Id: '));
        if (!u) { console.log('  Usuario no encontrado.'); return; }
        mostrarUsuario(u);
    } catch (e) { console.error('  Error:', (e as Error).message); }
}

async function opcionActualizar(rl: ReadlineInterface) {
    console.log('\n[ Actualizar usuario ]');
    try {
        const id       = await ask(rl, '  Id del usuario: ');
        console.log('  Deja en blanco los campos que no quieres cambiar.');
        const nombre   = await ask(rl, '  Nuevo nombre   : ');
        const apellido = await ask(rl, '  Nuevo apellido : ');
        const email    = await ask(rl, '  Nuevo email    : ');
        const telefono = await ask(rl, '  Nuevo teléfono : ');
        const data: ActualizarUsuarioDTO = {};
        if (nombre)   data.nombre   = nombre;
        if (apellido) data.apellido = apellido;
        if (email)    data.email    = email;
        if (telefono) data.telefono = telefono;
        if ((await ask(rl, '  ¿Actualizar ubicación? (s/n): ')).toLowerCase() === 's')
            data.ubicacion = await pedirUbicacion(rl);
        const u = userService.actualizarUsuario(id, data);
        if (!u) { console.log('  Usuario no encontrado.'); return; }
        mostrarUsuario(u);
    } catch (e) { console.error('  Error:', (e as Error).message); }
}

async function opcionDesactivar(rl: ReadlineInterface) {
    console.log('\n[ Desactivar usuario ]');
    try {
        const u = userService.desactivarUsuario(await ask(rl, '  Id del usuario: '));
        if (!u) { console.log('  Usuario no encontrado.'); return; }
        console.log(`\n  Cuenta de ${u.nombre} ${u.apellido} desactivada.`);
    } catch (e) { console.error('  Error:', (e as Error).message); }
}

// ── Menú principal ────────────────────────────────────────────────────────────

export async function iniciarMenu(rlExterno?: ReadlineInterface) {
    const rl = rlExterno || createInterface({ input: process.stdin, output: process.stdout });

    while (true) {
        separador();
        console.log('  FURFINDER — Gestión de Usuarios');
        separador();
        console.log('  1. Crear usuario');
        console.log('  2. Listar usuarios');
        console.log('  3. Buscar por id');
        console.log('  4. Actualizar usuario');
        console.log('  5. Desactivar usuario');
        console.log('  0. Salir');
        separador();
        switch (await ask(rl, '  Elige una opción: ')) {
            case '1': await opcionCrear(rl);      break;
            case '2': await opcionListar();       break;
            case '3': await opcionBuscar(rl);     break;
            case '4': await opcionActualizar(rl); break;
            case '5': await opcionDesactivar(rl); break;
            case '0':
                console.log('\n  Volviendo al menú principal...\n');
                if (!rlExterno) rl.close();
                return;
            default:
                console.log('  Opción no válida.');
        }
    }
}

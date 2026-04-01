import { iniciarMenu as iniciarMenuUsuarios } from './usuarios/usuario.service.js';
import { FurFinder } from './mascotas/mascotas.service.js';
import { MascotasMenu } from './mascotas/mascotas.menu.js';
import { menuPrincipal, OpcionMenu } from './common/main-menu.js';
import { DataMascotas } from './data/pets.data.js';
import { DataUsuarios } from './data/users.data.js';

type UsuarioMinimo = { id: string; nombre: string; isActivo: boolean };

function crearUsuariosLookup() {
    const usuariosIndex = new Map<string, UsuarioMinimo>(
        DataUsuarios.map((u: UsuarioMinimo) => [u.id, u])
    );
    return {
        obtenerPorId: (id: string) => usuariosIndex.get(id) ?? null,
    };
}

async function main(): Promise<void> {
    const usuariosLookup = crearUsuariosLookup();

    // Mascotas
    const mascotasService = new FurFinder.MascotasNS.MascotasService(usuariosLookup);
    mascotasService.cargarDatosIniciales(DataMascotas);
    const mascotasMenu = new MascotasMenu(mascotasService);

    // Stubs para futuros módulos
    // const usuariosMenu = new UsuariosMenu(usuariosService);
    // const reportesMenu = new ReportesMenu(reportesService);
    // const rankingMenu = new RankingMenu(rankingService);

    const opciones: OpcionMenu[] = [
        {
            clave: '1',
            titulo: 'Mascotas',
            run: (rl) => mascotasMenu.iniciar(rl),
        },
        {
            clave: '2',
            titulo: 'Usuarios',
            run: async (_rl) => {
                await iniciarMenuUsuarios();
            },
        },
        // Ejemplos futuros:
        // { clave: '3', titulo: 'Reportes', run: () => reportesMenu.iniciar() },
        // { clave: '4', titulo: 'Ranking', run: () => rankingMenu.iniciar() },
    ];

    await menuPrincipal(opciones);
}

main().catch((error) => {
    console.error('Error al iniciar FurFinder:', error);
    process.exit(1);
});


import { iniciarMenu as iniciarMenuUsuarios } from './usuarios/usuario.menu.js';
import { FurFinder } from './mascotas/mascotas.service.js';
import { MascotasMenu } from './mascotas/mascotas.menu.js';
import { menuPrincipal, OpcionMenu } from './common/main-menu.js';
import { DataMascotas } from './data/pets.data.js';
import { DataUsuarios } from './data/users.data.js';
import { DataReportes } from './data/reports.data.js';

import { MatchesService } from "./services/matches.service.js";
import { ComentariosService } from "./services/comentarios.service.js";

type UsuarioMinimo = { id: string; nombre: string; isActivo: boolean };

function crearUsuariosLookup() {
    const usuariosIndex = new Map<string, UsuarioMinimo>(
        DataUsuarios.map((u: UsuarioMinimo) => [u.id, u])
    );
    return {
        obtenerPorId: (id: string) => usuariosIndex.get(id) ?? null,
    };
}

// Tus instancias globales o pasadas por parámetro
const matchesService = new MatchesService();
const comentariosService = new ComentariosService();

/**
 * Tu lógica estrella de matching, integrada para el arranque
 */
function ejecutarMotorDeMatches() {
    console.log(`\nAnalizando ${DataReportes.length} reportes para posibles coincidencias...`);
    
    for (let i = 0; i < DataReportes.length; i++) {
        for (let j = i + 1; j < DataReportes.length; j++) {
            const reporteA = DataReportes[i];
            const reporteB = DataReportes[j];

            if (matchesService.detectarCoincidencias(reporteA, reporteB)) {
                // 1. Crear el Match
                matchesService.generarMatchManual(reporteA.id, reporteB.id);

                // 2. Notificar vía comentarios automáticos
                const aviso = "[SISTEMA] ¡Posible coincidencia detectada! Revisa la sección de Matches.";
                comentariosService.agregarComentario({
                    usuarioId: "SYSTEM_BOT",
                    reporteId: reporteA.id,
                    texto: aviso
                });
                comentariosService.agregarComentario({
                    usuarioId: "SYSTEM_BOT",
                    reporteId: reporteB.id,
                    texto: aviso
                });

                console.log(`Match automático creado entre Reporte ${reporteA.id} y ${reporteB.id}`);
            }
        }
    }
}

async function main(): Promise<void> {
    const usuariosLookup = crearUsuariosLookup();

    // 1. Inicialización de Mascotas (Maryhug)
    const mascotasService = new FurFinder.MascotasNS.MascotasService(usuariosLookup);
    mascotasService.cargarDatosIniciales(DataMascotas);
    const mascotasMenu = new MascotasMenu(mascotasService);

    // 2. Ejecutar motor de búsqueda al iniciar
    ejecutarMotorDeMatches();

    // 3. Menú Principal
    const opciones: OpcionMenu[] = [
        {
            clave: '1',
            titulo: 'Mascotas',
            run: (rl) => mascotasMenu.iniciar(rl),
        },
        {
            clave: '2',
            titulo: 'Usuarios',
            run: async (rl) => {
                await iniciarMenuUsuarios(rl);
            },
        },
        {
            clave: '3',
            titulo: 'Ver Matches Detectados',
            run: async () => {
                console.log("\n--- LISTA DE MATCHES ---");
                console.table(matchesService.obtenerTodos());
            }
        },
        {
            clave: '4',
            titulo: 'Ver Comentarios del Sistema',
            run: async () => {
                console.log("\n--- COMENTARIOS RECIENTES ---");
                console.table(comentariosService.obtenerTodos());
            }
        }
    ];

    await menuPrincipal(opciones);
}

main().catch((error) => {
    console.error('Error al iniciar FurFinder:', error);
    process.exit(1);
});

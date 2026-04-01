import { MatchesService } from "./services/matches.service";
import { ComentariosService } from "./services/comentarios.service";
import { DataReportes } from "./data/reports.data";

// --- INICIALIZACIÓN DE SERVICIOS ---
const matchesService = new MatchesService();
const comentariosService = new ComentariosService();
// const usuariosService = new UsuariosService(); (Jorge)
// const petsService = new PetsService(); (Maryhug)

/**
 * Función principal que arranca la lógica del sistema Fur Finder
 */
async function startApp() {
    console.log("Sistema iniciado correctamente.");
    console.log("--------------------------------------------------");

    // 1. CARGA DE DATOS (Simulación de lo que hay en base de datos)
    console.log(`Cargando ${DataReportes.length} reportes de la comunidad...`);

    // 2. EJECUCIÓN DEL ALGORITMO DE MATCHING
    // Esta es tu lógica estrella. La mantenemos limpia.
    ejecutarMotorDeMatches();

    // 3. REPORTE FINAL DE ESTADO
    const totalMatches = matchesService.obtenerTodos().length;
    console.log("--------------------------------------------------");
    console.log(`ESTADO ACTUAL DEL SISTEMA:`);
    console.log(`Matches detectados: ${totalMatches}`);
    console.log(`Comentarios totales: ${comentariosService.obtenerTodos().length}`);
    console.log("--------------------------------------------------");
}

/**
 * Lógica para comparar reportes y generar alertas automáticas
 */
function ejecutarMotorDeMatches() {
    for (let i = 0; i < DataReportes.length; i++) {
        for (let j = i + 1; j < DataReportes.length; j++) {
            const reporteA = DataReportes[i];
            const reporteB = DataReportes[j];

            if (matchesService.detectarCoincidencias(reporteA, reporteB)) {
                
                // 1. Crear el Match
                matchesService.generarMatchManual(reporteA.id, reporteB.id);

                // 2. Notificar vía comentarios automáticos
                const aviso = "🤖 [SISTEMA] ¡Posible coincidencia detectada! Revisa la sección de Matches.";
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

                console.log(`✨ Match automático creado entre Reporte ${reporteA.id} y ${reporteB.id}`);
            }
        }
    }
}

// Arrancamos la aplicación
startApp().catch(err => console.error("Error al iniciar Fur Finder:", err));
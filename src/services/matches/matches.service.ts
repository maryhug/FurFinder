import { BaseService } from "../../common/base-service.js";
import { DataMascotas } from "../../data/pets.data.js";
import { Match } from "../../models/Match.js";
import { Reportes } from "../../models/Report.js";
import { EstadoReporte } from "../../models/Shared.js";

export class MatchesService extends BaseService<Match> {
    constructor() {
        super();
    }

    validarCrear(payload: Partial<Match>): void {
        if (!payload.reportePerdidoId || !payload.reporteEncontradoId) {
            throw new Error("El match debe tener un reporte perdido y un reporte encontrado.");
        }
    }

    validarActualizar(payload: Partial<Match>): void {
        if (payload.reportePerdidoId !== undefined && payload.reportePerdidoId.trim() === "") {
            throw new Error("El reporte perdido no puede estar vacío.");
        }
        if (payload.reporteEncontradoId !== undefined && payload.reporteEncontradoId.trim() === "") {
            throw new Error("El reporte encontrado no puede estar vacío.");
        }
    }

    generarMatchManual(reportePerdidoId: string, reporteEncontradoId: string): Match {
        this.validarCrear({ reportePerdidoId, reporteEncontradoId });

        // Nivel Pro: Evitar duplicados
        const matchesExistentes = this.obtenerTodos();
        const yaExiste = matchesExistentes.find(m => 
            m.reportePerdidoId === reportePerdidoId && m.reporteEncontradoId === reporteEncontradoId
        );

        if (yaExiste) {
            console.log(`[MatchesService] El match ya existe (ID: ${yaExiste.id}). No se creará duplicado.`);
            return yaExiste;
        }

        const nuevoMatch: Match = {
            id: this.generarId(),
            reportePerdidoId,
            reporteEncontradoId,
            fechaMatch: new Date()
        };

        this.data.set(nuevoMatch.id, nuevoMatch);
        return nuevoMatch;
    }

    detectarCoincidencias(reporte1: Reportes, reporte2: Reportes): boolean {

        const sonEstadoCompatibles = 
            (reporte1.estado === EstadoReporte.Perdido && reporte2.estado === EstadoReporte.Encontrado) ||
            (reporte1.estado === EstadoReporte.Encontrado && reporte2.estado === EstadoReporte.Perdido);

        if(!sonEstadoCompatibles) {
            return false;
        }

        // Nivel Pro: Validar orden cronológico
        const reportePerdido = reporte1.estado === EstadoReporte.Perdido ? reporte1 : reporte2;
        const reporteEncontrado = reporte1.estado === EstadoReporte.Encontrado ? reporte1 : reporte2;

        if (reporteEncontrado.fecha < reportePerdido.fecha) {
            return false;
        }
        
        const mismaCiudad = reporte1.ubicacion.ciudad === reporte2.ubicacion.ciudad;
        if(!mismaCiudad) {
            return false;
        }

        const mascota1 = DataMascotas.find(p => p.id === reporte1.mascotaId);
        const mascota2 = DataMascotas.find(p => p.id === reporte2.mascotaId);

        if(!mascota1 || !mascota2) return false;

        const mismaEspecie = mascota1.especie === mascota2.especie;
        const mismoColor = mascota1.color === mascota2.color;

        return mismaEspecie && mismoColor;
    }
}; 
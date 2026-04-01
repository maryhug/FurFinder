import { BaseService } from "../../common/base-service.js";
import { Comentario } from "../../models/Report.js";

export class ComentariosService extends BaseService<Comentario> {
    
    // Implementación de validaciones obligatorias por BaseService
    validarCrear(payload: Partial<Comentario>): void {
        if (!payload.texto || payload.texto.trim() === "") {
            throw new Error("El texto del comentario no puede estar vacío.");
        }
        if (!payload.usuarioId || !payload.reporteId) {
            throw new Error("El comentario debe estar vinculado a un usuario y a un reporte.");
        }
    }

    validarActualizar(payload: Partial<Comentario>): void {
        if (payload.texto !== undefined && payload.texto.trim() === "") {
            throw new Error("El texto actualizado no puede estar vacío.");
        }
    }

    // Lógica para agregar un comentario
    agregarComentario(payload: Omit<Comentario, "id" | "fecha">): Comentario {
        this.validarCrear(payload);
        
        const nuevoComentario: Comentario = {
            ...payload,
            id: this.generarId(),
            fecha: new Date()
        };

        this.data.set(nuevoComentario.id, nuevoComentario);
        return nuevoComentario;
    }

    // Utilidad para buscar comentarios de un reporte específico
    obtenerComentariosPorReporte(reporteId: string): Comentario[] {
        return this.obtenerTodos().filter(c => c.reporteId === reporteId);
    }
}

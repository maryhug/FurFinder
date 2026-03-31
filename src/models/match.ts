// Match entre reportes de mascotas perdidas y encontradas
export interface Match {
    id: string;
    reportePerdidoId: string; // Reporte del dueño
    reporteEncontradoId: string; // Reporte de quien la vio/encontró
    fechaMatch: Date;
    observaciones?: string;
}

export type EstadoReporte = 'Perdido' | 'Avistado' | 'Encontrado' | 'Recuperado' | 'Adopcion'

export type Ubicacion = {
    direccion: string;
    barrio: string;
    ciudad: string;
    codigoPostal?: string;
    pais: string;
}

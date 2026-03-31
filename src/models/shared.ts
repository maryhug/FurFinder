export enum EstadoReporte {
    Perdido = 'Perdido',
    Avistado = 'Avistado',
    Encontrado = 'Encontrado',
    Recuperado = 'Recuperado',
    Adopcion = 'Adopcion'
}

export type Ubicacion = {
    direccion: string;
    barrio: string;
    ciudad: string;
    codigoPostal?: string;
    pais: string;
};

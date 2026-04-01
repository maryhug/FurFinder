export type EspecieMascota = 'Perro' | 'Gato' | 'Ave' | 'Conejo' | 'Reptil' | 'Otro';

export type SexoMascota = 'Macho' | 'Hembra' | 'Desconocido';

export interface Mascotas {
    id: string;
    duenoId: string;
    nombre?: string;
    especie: EspecieMascota;
    raza?: string;
    color: string;
    edad?: number;
    sexo: SexoMascota;
}
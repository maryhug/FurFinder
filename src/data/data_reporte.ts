import type{Reportes} from "../models/Report";
import  {EstadoReporte} from "../models/shared";

export const reportes: Reportes[] = [
   {id:'1', mascotaId:'1', usuarioId:'1', fecha: new Date, descripcion:'Encontre un perro igualito a la foto que publicaron', ubicacion:{direccion: 'Calle Falsa 123', barrio: 'Centro', ciudad: 'Ciudad', pais: 'Pais'}, estado: EstadoReporte.Encontrado},
    {id:'2', mascotaId:'2', usuarioId:'2', fecha: new Date, descripcion:'Vi a un gato con las mismas características que el que reportaron', ubicacion:{direccion: 'Avenida Siempre Viva 456', barrio: 'Norte', ciudad: 'Ciudad', pais: 'Pais'}, estado:EstadoReporte.Avistado},
    {id:'3', mascotaId:'3', usuarioId:'3', fecha: new Date, descripcion:'Encontré a un perro que coincide con la descripción del reporte', ubicacion:{direccion: 'Calle Principal 789', barrio: 'Sur', ciudad: 'Ciudad', pais: 'Pais'}, estado:EstadoReporte.Encontrado},
    {id:'4', mascotaId:'4', usuarioId:'4', fecha: new Date, descripcion:'Vi a un gato que se parece mucho al que reportaron', ubicacion:{direccion: 'Avenida Central 321', barrio: 'Este', ciudad: 'Ciudad', pais: 'Pais'}, estado:EstadoReporte.Avistado},
    {id:'5', mascotaId:'5', usuarioId:'5', fecha: new Date, descripcion:'Encontré a un perro que coincide con la descripción del reporte', ubicacion:{direccion: 'Calle Secundaria 654', barrio: 'Oeste', ciudad: 'Ciudad', pais: 'Pais'}, estado:EstadoReporte.Encontrado},
];



export const getReportes = (): Reportes[] => {
    return reportes;
};
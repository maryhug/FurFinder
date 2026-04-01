# FurFinder 

## Instalacion

```bash
npm install
npm run dev
``` 

## Ejecucion 

```bash
npm run dev
```

## Encarpetado 

```
    src/
    └── models/
        ├── shared.ts      # Tipos que usan todos (Ubicacion, EstadoReporte)
        ├── User.ts        # Interfaz de Usuarios
        ├── Pet.ts         # Clase Mascota e interfaz Mascotas
        ├── Report.ts      # Interfaz de Reportes y Comentarios
        └── Match.ts       # Interfaz de Match
```

## Descripcion 

- Ya he terminado la logica de los comentarios y los matches, trabajando con datos quemados, me falta dejar de usar los datos quemados y empezar a integrar la creacion de usuarios, mascotas y reportes.

- Ya que dependo de los cruds de los demas, trabaje con datos quemados para poder avanzar con la logica de los comentarios y los matches.

## Lógica de Matching

El sistema de coincidencias (`MatchesService`) no solo compara IDs, sino que cruza información entre `Reportes` y `Mascotas` bajo los siguientes criterios:

1.  **Compatibilidad de Estado:** Solo hace match si un reporte es `Perdido` y el otro es `Avistado` o `Encontrado`.
2.  **Ubicación:** Deben coincidir en la misma `ciudad` (y opcionalmente `barrio`).
3.  **Identidad Animal:** El algoritmo busca en `DataMascotas` para confirmar que ambos reportes se refieren a la misma `especie` y `color`. 

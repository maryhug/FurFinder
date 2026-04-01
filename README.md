# FurFinder

## Estructura del Proyecto (Encarpetado)

```text
src/
├── common/             # Utilidades, menús y estilos CLI (compartido)
│   ├── cli-style.ts
│   ├── main-menu.ts
│   └── utils.ts
├── data/               # "Base de datos" en memoria (Mock Data)
│   ├── coments.data.ts
│   ├── matches.data.ts
│   ├── pets.data.ts
│   ├── reports.data.ts
│   └── users.data.ts
├── mascotas/           # Módulo de Mascotas (Maryhug)
│   ├── mascotas.menu.ts
│   ├── mascotas.service.ts
│   └── mascotas.validators.ts
├── models/             # Interfaces y tipos de datos (Contratos)
│   ├── Match.ts
│   ├── Pet.ts
│   ├── Report.ts
│   ├── Shared.ts
│   └── User.ts
├── services/           # Lógica de Matches y Comentarios (Tu parte)
│   ├── comentarios.service.ts
│   └── matches.service.ts
├── usuarios/           # Módulo de Usuarios (Jorge)
│   └── usuario.service.ts
└── index.ts            # Punto de entrada y orquestador
```

## Ejecución

```bash
# Instalación de dependencias
npm install

# Modo Desarrollo (usando tsx)
npm run dev
```

## Lógica de Matching
El sistema cruza información de reportes perdidos vs. encontrados basado en:
- **Compatibilidad de Estado**
- **Ciudad y Ubicación**
- **Especie y Color** (validado contra el modelo de mascota)
- **Orden Cronológico** (no se puede encontrar antes de perderse)


## Implementaciones

- Terminar reportes
- Usar una simulacion de base de datos con JSON-SERVER
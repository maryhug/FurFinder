# FurFinder 🐾🔍

**FurFinder** es una app de consola en TypeScript avanzado para reportar y reunir mascotas perdidas/encontradas. Resuelve el caos de grupos de WhatsApp con CRUDs reales e interconectados: crea reportes con fotos, recibe comentarios comunitarios y genera matches automáticos por raza, color y ubicación. [file:1][file:3]

## Características Principales
- **CRUD Completo**: Maneja animales (raza, color, estado), reportes (ubicación, PERDIDA/ENCONTRADA), comentarios y usuarios.
- **Estados Evolutivos**: Reportes pasan de ACTIVO → EN SEGUIMIENTO → REUNIDOS → CERRADO.
- **Matches Inteligentes**: Cruza reportes automáticamente para reunions rápidas.
- **Arquitectura Modular**: Clases, namespaces, decoradores y tipado estricto (sin `any`).
- **TypeScript Avanzado**: Herencia, abstractas, genéricos y lógica de negocio real.

Inspirado en el problema colombiano: miles de mascotas se pierden diariamente sin una plataforma centralizada. [file:3]

## Instalación Rápida
1. Clona el repo: `git clone <tu-url>`
2. Instala: `npm install`
3. Configura `tsconfig.json` (experimentalDecorators: true)
4. Ejecuta: `npx ts-node src/index.ts`

## Estructura del Proyecto
```
src/
├── index.ts # Entrada principal
├── modules.ts # Funciones reutilizables
├── services.ts # Lógica de negocio (matches, estados)
└── data.ts # Modelos y datos
```

## Aprendizaje
Proyecto educativo de Ruta Avanzada TypeScript: clases, namespaces y decoradores en acción. ¡CRUDs que cuentan una historia real! [file:2]

## Contribuye
¡Forkea, prueba y abre PRs! Reporta issues para nuevas features como web o mapas.

**Hecho con ❤️ para peludos perdidos.**

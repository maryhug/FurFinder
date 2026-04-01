# Guia de exposicion tecnica - FurFinder (TypeScript)

Este documento te ayuda a explicar, con base en TU proyecto, los temas que suelen preguntar en clase:

1. Metodos de TypeScript/JavaScript que usaste (`.filter`, `.map`, `.join`, etc.)
2. Tipos de clases que implementaste y por que elegiste ese enfoque
3. Namespaces: para que los usaste, ventajas y limites
4. Decoradores: cuales usaste, por que, para que
5. `package.json`, `package-lock.json` y `tsconfig.json`

---

## 0) Mapa rapido del proyecto

Archivos clave:

- `src/common/base-service.ts`: clase abstracta base con CRUD reutilizable
- `src/mascotas/mascotas.service.ts`: logica de negocio de mascotas
- `src/mascotas/mascotas.validators.ts`: validaciones centralizadas
- `src/mascotas/mascotas.menu.ts`: menu CLI interactivo
- `src/decorators/validadores.ts`: decoradores personalizados
- `src/common/utils.ts`: utilidades y `ErrorValidacion`
- `src/index.ts`: orquestador principal
- `package.json`, `package-lock.json`, `tsconfig.json`: config de runtime, dependencias y compilacion

---

## 1) Clases en TypeScript (lo que SI aplicaste)

### 1.1 Declaracion de clases y constructores

Ejemplos en tu codigo:

- `BaseService<T>` en `src/common/base-service.ts`
- `MascotasService` en `src/mascotas/mascotas.service.ts`
- `MascotasMenu` en `src/mascotas/mascotas.menu.ts`
- `MascotasValidators` en `src/mascotas/mascotas.validators.ts`
- `ErrorValidacion` en `src/common/utils.ts`

Constructor real en tu proyecto:

- `MascotasService` recibe `usuariosService` opcional por inyeccion:
  - facilita pruebas
  - desacopla el servicio de una fuente concreta de usuarios

### 1.2 Modificadores de acceso: `public`, `private`, `protected`

Tu uso:

- `protected data` en `BaseService`: el estado se comparte con clases hijas, no con consumidores externos.
- `protected generarId`, `protected existePorId`, `protected fusionar`: utilidades internas para herencia.
- `private` en `MascotasMenu` y `MascotasService` para helpers internos (`normalizarParcial`, `limpiarUndefined`, etc.).
- `public` implicito en metodos expuestos (`crearMascota`, `obtenerPorId`, `actualizarMascota`).

Por que esta bien:

- Encapsulas detalles internos.
- Expones solo API de dominio.
- Evitas que otras capas manipulen estructuras internas sin control.

### 1.3 Herencia con `extends`

- `MascotasService extends BaseService<Mascotas>`.

Que ganas:

- Reuso de comportamiento transversal (almacenamiento en `Map`, merge parcial, existencia por id).
- Menos duplicacion en cada modulo (mascotas, usuarios, reportes, etc.).

### 1.4 Clases abstractas e interfaces

Aplicacion directa:

- `BaseService<T>` es `abstract` y obliga a implementar:
  - `validarCrear(payload)`
  - `validarActualizar(payload)`

Por que fue mejor que una clase normal:

- Garantiza contrato minimo en todos los servicios.
- Evita olvidar validaciones en nuevas entidades.

Interfaces usadas:

- Modelos (`Mascotas`, `Usuarios`, `Reportes`, etc.) en `src/models` y `src/models.ts`.
- Contrato de lookup `UsuariosLookup` en `src/mascotas/mascotas.validators.ts`.

Por que interfaces y no tipos concretos de clase:

- Son mas ligeras para modelar datos.
- No obligan instanciacion de objetos de clase cuando solo necesitas forma/contrato.

### 1.5 Metodos estaticos y `readonly`

Metodos estaticos SI usados:

- `MascotasValidators.validarCrear(...)`, `validarActualizar(...)`, `parsearEdad(...)`.
- Se usan sin crear instancia, porque no dependen de estado interno mutable.

Propiedades `readonly`:

- Tienes `private readonly usuariosService` en `MascotasService`.
- Es correcto porque la dependencia se define una vez y no debe reasignarse.

### 1.6 Manejo de errores orientado a dominio

- `ErrorValidacion extends Error` en `src/common/utils.ts`.

Por que es mejor que `throw new Error(...)` en todo lado:

- Mensajes consistentes de negocio.
- Permite identificar rapidamente errores de validacion frente a errores tecnicos.

---

## 2) Metodos de TS/JS que usaste (con ejemplos reales)

> Nota: TypeScript transpila, pero muchos metodos son de runtime JavaScript moderno con tipado TS.

### 2.1 Arrays y colecciones

- `.map(...)`
  - `src/index.ts`: `DataUsuarios.map((u) => [u.id, u])`
  - Uso: transformar lista a pares para construir `Map`.

- `.filter(...)`
  - `src/mascotas/mascotas.service.ts`: filtrar mascotas por `duenoId`.
  - Uso: obtener subconjunto sin mutar origen.

- `.find(...)`
  - `src/common/main-menu.ts`: encontrar opcion por `clave`.

- `.forEach(...)`
  - `src/mascotas/mascotas.menu.ts`: imprimir opciones de menu.

- `.includes(...)`
  - `src/mascotas/mascotas.validators.ts`: validar especie/sexo contra listas permitidas.

- `.join(', ')`
  - `src/mascotas/mascotas.validators.ts`: armar mensaje de error con valores permitidos.

### 2.2 Objetos

- `Object.entries(obj)`
  - `src/mascotas/mascotas.service.ts` en `limpiarUndefined`.

- `Object.fromEntries(...)`
  - mismo archivo: reconstruir objeto sin campos `undefined`.

- `Object.keys(payload)`
  - `src/decorators/validadores.ts` para detectar payload vacio.

### 2.3 String

- `.trim()`
  - en validaciones y prompts para limpiar espacios.

- `.toLowerCase()` / `.toUpperCase()`
  - `src/common/utils.ts` en `capitalizar` y en comparaciones.

- `.replace(...)`
  - `src/common/utils.ts` para capitalizar palabras.

### 2.4 Numericos y conversion

- `Number(raw)`
  - `parsearEdad` en validadores.

- `Number.isFinite(...)`
  - valida que sea numero real y no `NaN`/`Infinity`.

### 2.5 Estructuras y utilidades

- `new Map(...)`, `.get(...)`, `.set(...)`, `.has(...)`, `.delete(...)`, `.values()`
  - base de almacenamiento en memoria de servicios.

- `Array.from(map.values())`
  - exponer registros como array para listar/filtrar.

### 2.6 JSON y logging

- `JSON.stringify(args)`
  - `LogAuditoria` imprime argumentos serializados del metodo.

### 2.7 Fechas

- `new Date().toISOString()`
  - timestamp estandar para auditoria.

---

## 3) Namespaces (que hiciste y como defenderlo)

### 3.1 Que son

Un `namespace` agrupa simbolos bajo un nombre comun dentro del mismo espacio TypeScript.

En tu caso:

- `export namespace FurFinder { export namespace MascotasNS { ... } }`
- clase final: `FurFinder.MascotasNS.MascotasService`

### 3.2 Para que lo usaste

- Evitar colisiones de nombres entre modulos de dominio.
- Expresar pertenencia semantica: el servicio pertenece al dominio FurFinder/Mascotas.

### 3.3 Ventajas en tu contexto

- Nombres mas organizados cuando el proyecto crece por modulos.
- Ayuda didactica: muestra jerarquia conceptual de dominios.

### 3.4 Diferencia con modulos ES

- Modulos ES: separacion por archivos usando `import/export` (es lo mas estandar hoy).
- Namespaces: agrupacion dentro de TS, historicamente mas comun antes del ecosistema ES modules moderno.

### 3.5 Cuando usarlos (y cuando no)

Usarlos:

- Proyectos academicos o de consola donde quieres agrupar explicitamente dominio.
- Casos donde la jerarquia interna mejora legibilidad para el equipo.

Evitar/limitar:

- Apps modernas grandes con bundlers y arquitectura por modulos ES puros.
- Librerias publicas orientadas a ecosistema ESM.

Frase util para defender tu decision:

"Elegi namespace para dejar explicita la jerarquia de dominio en un proyecto academico modular; mantuve imports/exports por archivo y namespace solo como capa semantica de organizacion".

---

## 4) Decoradores (que usaste, por que y para que)

### 4.1 Que son

Funciones que envuelven o anotan clases/metodos/propiedades/parametros para agregar comportamiento transversal sin contaminar la logica principal.

### 4.2 Decoradores reales en tu proyecto

Archivo: `src/decorators/validadores.ts`

- `@LogAuditoria`
  - Tipo: decorador de metodo.
  - Para que: logging de ejecucion, fecha y argumentos.
  - Donde: `crearMascota`, `actualizarMascota`, `eliminarMascota`.

- `@ValidarEntidad`
  - Tipo: decorador de metodo.
  - Para que: bloquear payload nulo/vacio antes de ejecutar logica.
  - Donde: metodos de escritura (`crearMascota`, etc.).

### 4.3 Por que fue buena opcion

- Centraliza reglas repetitivas (auditoria/validacion basica).
- Reduce codigo duplicado dentro de cada metodo de negocio.
- Mejora legibilidad: la intencion se lee en la anotacion.

### 4.4 Que habilitaste en `tsconfig.json`

En `compilerOptions`:

- `experimentalDecorators: true`
- `emitDecoratorMetadata: true`

Observacion tecnica:

- `emitDecoratorMetadata` agrega metadata de tipos en runtime, pero en este proyecto no usas `reflect-metadata` aun. Esta listo por si luego integran DI/validaciones avanzadas.

### 4.5 Tipos de decoradores (teoria que pueden preguntar)

- De clase
- De metodo (los que SI usaste)
- De propiedad
- De parametro

Si te preguntan por que no usaste los otros:

- Porque el caso real actual pedia comportamiento en operaciones de dominio (metodos), no metadatos de propiedades/parametros.

---

## 5) `tsconfig.json` explicado

Archivo actual: `tsconfig.json`

### 5.1 Opciones importantes y su justificacion

- `target: "ES2021"`
  - habilita sintaxis/runtime moderno compatible con metodos usados.

- `module: "Node16"` y `moduleResolution: "node16"`
  - alinea resolucion de modulos con Node moderno.

- `lib: ["ES2021"]`
  - tipado de APIs modernas (`Number.isFinite`, `Array.from`, etc.).

- `rootDir: "./src"` y `outDir: "./dist"`
  - separa codigo fuente del compilado.

- `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`
  - mayor seguridad de tipos y deteccion temprana de bugs.

- `esModuleInterop: true`
  - interoperabilidad con paquetes CommonJS (ej: import default ergonomico).

- `experimentalDecorators: true`, `emitDecoratorMetadata: true`
  - habilita decoradores y metadata asociada.

- `skipLibCheck: true`
  - acelera build omitiendo chequeo profundo de tipos de dependencias externas.

- `forceConsistentCasingInFileNames: true`
  - evita errores por mayus/minus en rutas (especialmente en equipos mixtos).

- `types: ["node"]`
  - tipos globales de Node (`process`, `Map`, etc.).

- `include: ["src/**/*"]`
- `exclude: ["node_modules", "dist"]`

### 5.2 Pregunta tipica

"Por que no apuntaste a ES5?"

Respuesta corta:

- Porque el proyecto usa APIs modernas y Node moderno; bajar target aumentaria polyfills o cambios innecesarios.

---

## 6) `package.json` explicado

Archivo actual: `package.json`

### 6.1 Campos clave

- `name`, `version`, `license`: metadata del proyecto.
- `type: "commonjs"`: define sistema de modulos de Node para runtime actual.
- `scripts`:
  - `dev`: `ts-node src/index.ts`
  - `build`: `tsc`
  - `start`: `node dist/index.js`

### 6.2 Dependencias vs devDependencies

- `dependencies`: se necesitan para ejecutar app (ej: `chalk`).
- `devDependencies`: solo desarrollo/compilacion (`typescript`, `ts-node`, `@types/node`).

### 6.3 Preguntas comunes

"Por que `chalk@4` y no `chalk@5`?"

- Porque `chalk@5` es ESM-only; tu proyecto esta en `commonjs`. `chalk@4` evita fricciones de import en este setup.

"Por que `main` sigue en `index.js` si compilas a `dist/index.js`?"

- Es un campo historico en este proyecto; runtime real usa script `start`. Puede ajustarse en futuro si quieren publicar paquete npm.

---

## 7) `package-lock.json` explicado

### 7.1 Que es

Snapshot exacto de todas las dependencias (incluyendo subdependencias) y sus versiones resueltas.

### 7.2 Por que importa

- Build reproducible entre PCs/equipo/CI.
- Evita "en mi maquina funciona" por versiones flotantes.

### 7.3 Buena practica

- Siempre commitear `package-lock.json` en apps Node.
- Si cambias dependencias, sube `package.json` + `package-lock.json` juntos.

---

## 8) Decisiones de arquitectura que puedes defender

### 8.1 Base abstracta + servicio concreto

- `BaseService<T>` define cimientos comunes.
- `MascotasService` concentra reglas de dominio.
- Beneficio: separacion clara de infraestructura vs negocio.

### 8.2 Validadores separados (`MascotasValidators`)

- Aislas reglas de validacion de la capa de orquestacion CLI.
- Facilita pruebas unitarias y reuso desde API futura.

### 8.3 Menu separado (`MascotasMenu`)

- UI de consola desacoplada del dominio.
- Misma logica de servicio puede usarse mañana en API/web sin reescribir negocio.

### 8.4 Decoradores para cross-cutting concerns

- Auditoria y pre-validacion no ensucian cada metodo.
- Patrón limpio para concerns transversales.

---

## 9) Riesgos actuales y mejoras propuestas

- Hay duplicidad de modelos entre `src/models.ts` y `src/models/*`.
  - Mejora: unificar fuente de verdad para evitar inconsistencias.

- `BaseService.generarId()` usa `crypto.randomUUID()` pero `MascotasService` lo sobreescribe con IDs 1..999.
  - Mejora: documentar estrategia global de IDs por modulo.

- `README.md` aun tiene estado antiguo en la seccion "Estado actual del codigo".
  - Mejora: actualizar esa seccion segun implementacion real.

---

## 10) Preguntas de profesor + respuesta corta (chuleta)

1. "Por que abstract class y no interfaz?"
   - Porque necesito contrato + implementacion comun reutilizable (`data`, `fusionar`, `existePorId`).

2. "Por que namespace si ya usas import/export?"
   - Para agrupar semanticamente el dominio en un proyecto academico; no reemplaza modulos ES.

3. "Que hace `strictNullChecks`?"
   - Obliga a tratar `null/undefined` explicitamente y reduce errores en runtime.

4. "Para que sirve `package-lock.json`?"
   - Congela arbol exacto de dependencias para instalaciones reproducibles.

5. "Que aporta un decorador de metodo?"
   - Agregar comportamiento transversal (logging/validacion) sin duplicar codigo de negocio.

6. "Por que separaste validators del service?"
   - Para mantener SRP: servicio orquesta operaciones, validador concentra reglas.

---

## 11) Guion de exposicion sugerido (8-10 min)

1. Problema y objetivo del proyecto (1 min)
2. Arquitectura (service + validators + menu + decorators) (2 min)
3. Clases TS aplicadas (2 min)
4. Namespaces y por que se usaron (1 min)
5. Decoradores en accion con ejemplo real (1.5 min)
6. `tsconfig`, `package.json`, `package-lock` (1.5 min)
7. Cierre con mejoras futuras (0.5 min)

---

## 12) Frase de cierre potente

"La implementacion prioriza tipado estricto, separacion de responsabilidades y reutilizacion: validaciones centralizadas, servicio de dominio desacoplado de la UI CLI, y decoradores para preocupaciones transversales como auditoria y pre-validacion".


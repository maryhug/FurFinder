# FurFinder

Aplicacion de consola en TypeScript para gestionar reportes de mascotas perdidas/encontradas.

## Requisitos previos

- Node.js 14.17 o superior (recomendado Node 18+)
- npm (incluido con Node)
- Git

Verificar versiones:

```powershell
node -v
npm -v
git --version
```

## Clonar e inicializar en otro PC

1. Clona el repositorio y entra a la carpeta:

```powershell
git clone https://github.com/maryhug/FurFinder.git
cd FurFinder
```

2. Instala dependencias:

```powershell
npm install
```

3. Compila el proyecto:

```powershell
npm run build
```

4. Ejecuta en desarrollo o en modo compilado:

```powershell
npm run dev
npm start
```

## Scripts disponibles

- `npm run dev`: ejecuta `src/index.ts` con `ts-node`
- `npm run build`: compila TypeScript con `tsc` y genera `dist/`
- `npm start`: ejecuta `dist/index.js`

## Estructura del proyecto

```text
FurFinder/
|- src/
|  |- index.ts
|  |- models.ts
|  |- common/
|  |  |- base-service.ts
|  |  \- utils.ts
|  |- decorators/
|  |  \- validadores.ts
|  |- data/
|  |  |- users.data.ts
|  |  |- pets.data.ts
|  |  |- reports.data.ts
|  |  |- matches.data.ts
|  |  \- coments.data.ts
|  |- mascotas/
|  |  \- mascotas.service.ts
|  \- models/
|     |- Shared.ts
|     |- User.ts
|     |- Pet.ts
|     |- Report.ts
|     \- Match.ts
|- dist/
|- package.json
|- tsconfig.json
\- README.md
```

## Flujo de ramas recomendado

Para crear una feature nueva:

```powershell
git switch dev
git pull origin dev
git switch -c feature/mi-feature
```

Para subir cambios:

```powershell
git add .
git commit -m "feat: descripcion corta"
git push -u origin feature/mi-feature
```

Integracion a `dev`:

```powershell
git switch dev
git pull origin dev
git merge feature/mi-feature
git push origin dev
```

## Troubleshooting rapido

### Error: `src refspec dev does not match any`

La rama `dev` no existe localmente. Creala desde remoto:

```powershell
git switch -c dev --track origin/dev
```

### Error de TypeScript con APIs modernas (`Number.isFinite`, `Array.from`)

Revisa `tsconfig.json`:

- `target: "ES2021"`
- `lib: ["ES2021"]`
- `module: "Node16"`
- `moduleResolution: "node16"`

Si el IDE sigue marcando error, reinicia el servicio de TypeScript del editor.

### `dist` no se genera

Ejecuta desde la raiz del repo:

```powershell
npm run build
```

Si hay errores de compilacion, `dist/` puede quedar incompleto.

## Estado actual del codigo

- `src/index.ts` esta vacio (falta punto de entrada funcional)
- `src/mascotas/mascotas.service.ts` tiene metodos en progreso (`Not implemented`)
- La base de validaciones y modelos ya esta definida

## Recomendacion para continuar

1. Implementar `src/index.ts` como runner minimo de consola.
2. Completar `MascotasService` (crear, listar, actualizar, eliminar).
3. Agregar pruebas basicas para validadores en `src/common/utils.ts`.

## Licencia

ISC.

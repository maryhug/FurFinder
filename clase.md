# 🎓 Guía para tu Clase: TypeScript en FurFinder

Este documento te servirá de guion para explicar los conceptos clave usando ejemplos reales de tu código.

---

## 1. Interfaces
**¿Qué son?** Son el "plano" o contrato. Definen qué forma debe tener un dato (qué campos tiene), pero no contienen lógica.

- **Dónde verlas**: `src/models/Pet.ts` (Interface **Mascotas**)
- **Ejemplo**: 
  ```typescript
  interface Mascotas { 
      id: string;
      especie: string;
      color: string;
      // ...
  }
  ```
- **Explicación**: *"Aquí le decimos a TypeScript: 'Toda mascota en esta app DEBE tener obligatoriamente una especie y un color'."*

---

## 2. Clases
**¿Qué son?** Es la "fábrica" o el molde. A diferencia de las interfaces, las clases sí contienen la lógica (el código que hace los cálculos y procesos).

- **Dónde verlas**: `src/services/matches.service.ts` (**class MatchesService**)
- **Explicación**: *"La clase es el contenedor de todo el cerebro del sistema. `MatchesService` sabe cómo comparar datos para encontrar mascotas perdidas."*

---

## 3. Constructores
**¿Qué son?** Es la función especial que se ejecuta **primero** cuando creas un objeto. Sirve para encender la "máquina" y prepararla.

- **Dónde verlos**: `src/services/matches.service.ts` (**constructor()**)
- **Explicación**: *"Usamos `super()` para decirle a este servicio que herede las herramientas del 'BaseService' (el molde maestro) antes de empezar a trabajar."*

---

## 4. Objetos
**¿Qué son?** Es el producto final. Es cuando usas el molde (clase) para crear algo real que "vive" en la memoria de la computadora.

- **Dónde verlos**: `src/index.ts` 
- **Línea**: `const matchesService = new MatchesService();`
- **Explicación**: *"Aquí el molde se vuelve realidad. `matchesService` es un **objeto** vivo al que ya podemos darle órdenes."*

---

## 5. Funciones (y Métodos)
**¿Qué son?** Son las acciones. Bloques de código que reciben información, la procesan y devuelven un resultado.

- **Dónde verlas**: `src/index.ts` (**function startApp()**) o (**function ejecutarMotorDeMatches()**)
- **Explicación**: *"Las funciones son las máquinas trabajando. `ejecutarMotorDeMatches` es la acción de poner a comparar todos los reportes."*

---

## Resumen rápido para tu clase:

1. **Interface**: El contrato (Teoría / Forma).
2. **Clase**: El molde/fábrica (Lógica / Planos de acción).
3. **Constructor**: El encendido de la fábrica (Preparación).
4. **Objeto**: El producto fabricado (Instancia real en memoria).
5. **Función/Método**: Las máquinas trabajando (Acciones / Procesos).


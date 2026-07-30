# ONIA Core — Receta de adopción de lógica (anti-drift)

Fecha: 2026-07-08. Owner: Onia / Hermes.

## Por qué se PORTA, no se importa

`@onia/core` no se distribuye como paquete npm instalable. Razones reales
(verificadas contra la adopción de DentalGest en R6):

- Los productos (DentalGest, GestiOS) son **TypeScript + Prisma en repos
  separados**; el core es **`.mjs` en el monorepo onia-hermes**. No hay
  registry privado configurado, y aunque lo hubiera, el producto igual quiere
  la lógica en **TS nativo** (tipos, integración con su Prisma), no un `.mjs`
  importado.
- Por eso DentalGest, en R6, **portó** cada `*.logic.mjs` a `*.ts` a mano,
  dejando el rastro: `// Origen: @onia/core@0.6.2 · accounting.logic.mjs`.

Funciona. El riesgo es el **drift silencioso**: si el core corrige un bug (ej.
una tasa fiscal, una fórmula de IVA), el producto que copió NO se entera.

## El manifest anti-drift

`onia-core/PORTABLE_ARTIFACTS.json` registra, por cada artefacto portable, su
`sha256` actual + la versión del core. Lo genera y valida
`portable-artifacts.mjs`; el test `portable-artifacts.test.mjs` **exige que el
manifest esté sincronizado** con los archivos reales (si cambiás un
`.logic.mjs` sin regenerar, el test falla — no puede quedar viejo en silencio).

Artefactos cubiertos (19):
- **logic** (14): los `*.logic.mjs` de `logic/` y `modules/`.
- **config** (4): las sub-secciones de datos de los `.json` de módulo
  (`accounting.json#bolivianConfig`, `invoicing.json#siatConfig`,
  `payroll.json#laborConfig`, `dental.json#clinicalConfig`). Se hashea la
  **sub-sección**, no el archivo entero: agregar un track a `accounting.json`
  NO marca drift de su `bolivianConfig`.
- **seed** (1): `accounting.seed.bolivia.json`.

## Receta para un producto que adopta lógica del core

1. **Portar**: copiar el `.logic.mjs`, traducir a TS. En el encabezado del
   archivo portado, guardar la línea de origen CON el hash del manifest:
   ```ts
   // Origen: @onia/core@0.7.0 · modules/accounting.logic.mjs
   // sha256:8be2... (de onia-core/PORTABLE_ARTIFACTS.json)
   ```
2. **Test de paridad**: portar también los tests (`.test.mjs` → `.test.ts`) y
   dejarlos verdes. Es la garantía de que la traducción es fiel (DentalGest lo
   hizo: "29 tests de paridad con el core").
3. **Chequear drift** (manual o en CI): comparar el `sha256` guardado en cada
   archivo portado contra el del `PORTABLE_ARTIFACTS.json` del core actual.
   Distinto = el core cambió ese artefacto → re-portar esa pieza.

Verificación rápida en el repo del core (mientras no exista un checker que lea
el repo del producto):

```bash
node onia-core/portable-artifacts.mjs        # imprime el manifest actual
node onia-core/portable-artifacts.mjs --write # regenera tras cambiar logica
```

## Estado 2026-07-08

- DentalGest portó `commerce/accounting/invoicing.logic` en v0.6.2. Verificado
  por git: **esos 3 archivos NO cambiaron entre 0.6.2 y 0.7.0** (0.7.0 fue solo
  definición de rubros/packs). El port de DentalGest **sigue vigente**.
- GestiOS (carril E) aún no adoptó; cuando lo haga, seguir esta receta desde el
  día uno (guardar el hash, no solo la versión).

## Por qué NO se publicó a npm

Se evaluó y se descartó para v0.7.0: sin registry privado, y con productos que
igual traducen a TS, publicar agrega ceremonia sin eliminar la traducción. El
manifest + la receta resuelven el problema real (drift), que es lo que importa.
Si en el futuro hay 4+ productos consumiendo y la traducción se automatiza
(codegen mjs→ts), reconsiderar un paquete versionado real.

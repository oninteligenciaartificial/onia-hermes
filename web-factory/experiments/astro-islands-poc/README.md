# Astro Islands + Tremor — PoC (Web Factory roadmap #2)

Prueba de concepto del **nivel 2** del stack de Web Factory: una pagina
**estatica** (como los templates de `packages/templates`) que hidrata **solo** un
grafico Tremor como isla interactiva. Demuestra "static-first con islas": HTML
rapido por defecto, JS solo donde hay interactividad real.

## Que prueba

- `src/pages/index.astro` se prerenderiza a `dist/index.html`. El header y las
  KPI cards son **HTML estatico** (0 JS).
- `src/components/SalesChart.tsx` (React + `@tremor/react`) se marca
  `client:visible`, asi que se hidrata al entrar en viewport. El toggle 7d/30d/90d
  cambia los datos **en el cliente** y el `AreaChart` (Recharts) se redibuja.
- Verificado: build OK, `svg.recharts-surface` aparece tras hidratar, el toggle
  cambia `aria-pressed` y el dataset (Lun–Dom vs Sem 1–4). Screenshots en el PR.

## Como correr

```bash
cd web-factory/experiments/astro-islands-poc
pnpm install --ignore-workspace   # aislado del monorepo (no toca el workspace)
pnpm build                         # genera dist/ estatico
pnpm preview                       # sirve dist/ en http://localhost:4321
# o: pnpm dev
```

Es un proyecto **aislado**: vive fuera de los globs del workspace
(`apps/*`, `packages/*`), tiene su propio `package.json`/lockfile y no altera
`apps/site` ni las plantillas.

## Stack

Astro 4 + `@astrojs/react` 3 + `@astrojs/tailwind` 5 + Tailwind 3 +
`@tremor/react` 3 + React 18. (Tremor 3 requiere Tailwind 3, no 4.)

## Hallazgos

1. **Funciona y es la opcion correcta para dashboards interactivos.** El shell
   queda estatico (buen LCP/CLS) y solo el chart carga React. Es el puente natural
   para reusar los componentes MIT que ya indexamos (Tremor).
2. **Costo de bundle: la isla Tremor pesa ~230 kB gzip** (Tremor + Recharts +
   React) para UN grafico. Es el precio de la interactividad rica.
   - Para 1–2 charts simples, seguir con el **SVG inline** del template estatico
     (`packages/templates/dashboard.ts`) sigue siendo mejor: 0 JS.
   - Reservar islas Tremor para paneles genuinamente interactivos (filtros que
     recalculan, drilldown, tooltips ricos, datos en vivo).
   - Si se adopta en produccion, evaluar **Tremor Raw** (componentes copiables,
     tree-shakeable) o Recharts directo para bajar el peso.
3. **Recharts (base de Tremor) dibuja el SVG en el cliente** (ResponsiveContainer
   necesita medir el ancho), asi que el chart depende de hidratar. Para un primer
   paint con datos, un chart SSR-friendly o el SVG propio es preferible.

## Recomendacion para Web Factory

Escala de 3 niveles (ver `hermes-content/docs/historial/web-factory/WEB_FACTORY_STACK_AND_MATERIALS_20260703.md`):

- **Nivel 1 — estatico** (`packages/templates`): presencia, catalogo, panel/
  mockup. Charts SVG. Default.
- **Nivel 2 — Astro islas** (este PoC): dashboards interactivos manteniendo
  static-first. Adoptar cuando el cliente necesita interactividad pero no una app
  completa. Vigilar el peso de las islas.
- **Nivel 3 — Next.js** (`apps/site`): checkout, auth, datos en vivo, CRUD.

Proximo paso si se aprueba: mover este patron a un template real de fabrica
(`experiments/` -> integracion), con tokens del cliente inyectados en el tema
Tremor y una isla por seccion interactiva.

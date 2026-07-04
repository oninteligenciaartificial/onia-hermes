# Web Factory - Recomendacion y Roadmap de Investigacion 2026-07-03

## La mejor opcion (recomendacion estrategica)

Investigado contra el estado del arte 2026 (functional minimalism: carga rapida,
tipografia legible, accesibilidad como calidad de diseno, Core Web Vitals como
piso). La direccion recomendada es una **escala de 3 niveles**, no un unico stack:

1. **Estatico (default) - `packages/templates`.** HTML + CSS tokenizado, JS
   vanilla liviano, charts SVG. Cero JS por defecto = mejor LCP/INP/CLS y SEO.
   Es lo correcto para presencia, catalogo simple y paneles/mockups. Alinea
   perfecto con la tendencia 2026.
2. **Static-first con islas - Astro (a evaluar).** Cuando una pagina necesita
   interactividad real puntual (charts Tremor en vivo, un configurador), **Astro
   islands** es mejor opcion que saltar a Next: entrega HTML estatico e hidrata
   solo el componente interactivo (React/Tremor), manteniendo CWV. Es el puente
   natural para usar los componentes MIT que ya indexamos.
3. **App completa - Next.js/React (`apps/site`).** Checkout real, auth, datos en
   vivo, CRUD. Es Nuvia y ONIA Center. No para sitios de contenido.

Regla comercial: **empezar estatico para cerrar** y **subir de nivel cuando el
cliente paga funcionalidad**. El margen vive en lo recurrente (nivel 2-3).

**No usar WordPress.** No aporta a este modelo y agrega peso/mantenimiento.

## Perfeccionado hoy (2026-07-03)

- **Gate de accesibilidad (axe-core, WCAG 2.2 AA)** en el E2E: `landing` y
  `dashboard` gated (0 violaciones serias/criticas); `store` en modo audit-only
  (deuda conocida, ver abajo). Es el estandar 2026: accesibilidad = calidad de
  diseno, no checkbox.
- **Charts del dashboard** con gridlines + labels de eje Y (nice-max, sufijo k),
  escalado uniforme; SVG con `aria-label`.
- **Flujo intake -> dashboard** completo; charts y KPIs desde intake.

## Deuda tecnica priorizada

- ~~**Contraste en `store.ts` (18 nodos, serio).**~~ **RESUELTO 2026-07-03.** El
  header/hero de store usaba texto blanco pensado para el hero de video oscuro de
  Nuvia; sin video (hero claro) fallaba AA. Se agrego el modificador
  `.store-page--light-hero` (cuando no hay `heroVideo`) con overrides de texto
  navy para header, wordmark, nav, hero-proof, product stage y CTA primario.
  Scoped: **Nuvia (siempre con video) queda intacto.** `store` ahora esta gated
  en el a11y gate (0 serios). Verificado con axe + QA visual.

## Plan de investigacion para la semana (priorizado)

| # | Tema | Por que | Entregable |
|---|------|---------|-----------|
| 1 | Fix contraste store.ts (header/hero AA) | Deuda serie que bloquea calidad; 18 nodos | store pasa a gated en el a11y gate |
| 2 | PoC Astro islands + Tremor | Dashboards interactivos reales sin perder static-first | 1 dashboard demo con un chart Tremor hidratado |
| 3 | Dark mode en tokens | Table-stakes 2026; hoy solo hay tema claro | variante dark en `packages/tokens` + toggle |
| 4 | Gate de performance (Lighthouse/CWV) | LCP<=2.5s, INP<=200ms, CLS<=0.1 son piso | script/CI que mide y falla si excede |
| 5 | Inyectar codigo Tremor en `design:auto` | Cerrar el loop harvester -> receta (ya esta indexado) | receta de dashboard cita componentes concretos |
| 6 | Pipeline de imagenes AVIF/WebP + width/height | LCP/CLS; hoy assets sin optimizar | paso de optimizacion en `generate` |
| 7 | Charts mas ricos (multi-serie, donut, sparkline) | Cubrir mas casos de panel sin libreria | nuevos tipos en `dashboard.ts` |
| 8 | Conversion research (single-column, sin nav) | Unbounce: -10/15% conversion con nav en landing | variante de landing "focus" sin nav |
| 9 | Mas templates por rubro (portfolio, servicios premium) | Ampliar catalogo vendible | 1-2 templates nuevos |

## Fuentes de investigacion

- Astro islands / partial hydration: docs.astro.build/en/concepts/islands
- Accesibilidad automatizada: playwright.dev/docs/accessibility-testing (axe-core)
- Core Web Vitals 2026: web.dev/explore/learn-core-web-vitals
- Librerias (charts/headless/dashboards): ver
  `WEB_FACTORY_STACK_AND_MATERIALS_20260703.md`.

## Como validar todo

```powershell
cd C:\dev\proyectos\onia-hermes\web-factory
pnpm test          # 27 unit
pnpm e2e           # 20 E2E (incluye gate a11y landing+dashboard)
pnpm factory:smoke # tests + genera los 7 demos (incl. dashboard)
```

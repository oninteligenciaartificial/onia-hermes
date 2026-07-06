# Spec — Web Factory Design Standard (Landings + Dashboards)

- Fecha: 2026-07-06
- Carril: Web Factory (`web-factory/`)
- Estado: diseño aprobado por Sergio (arranca implementación)
- No toca: `src/app/onia-center/**` (otra sesión), la tienda Nuvia
  (`packages/templates/src/store.ts`, `apps/site/src/app/nuvia/**`)

## Objetivo

Subir la calidad de diseño de Web Factory en dos superficies y dejarla
**reutilizable**, no arreglada caso por caso:

1. **Landings** — consolidar landing-clinic v2 (ya en este PR) como el piso de
   calidad, documentado de forma agnóstica de rubro.
2. **Dashboards** — definir un sistema de diseño para paneles de datos densos
   (ERPs/SaaS: DentalGest, GestiOS, ONIA Center) a partir del template
   `dashboard` existente de Web Factory, con una implementación de referencia.

## Restricción de alcance (por qué la entrega es así)

DentalGest y GestiOS viven en otros repos; ONIA Center es otra sesión. Este
carril **no puede** escribir código en esos repos. La entrega es: (a) un
sistema de diseño portable (tokens CSS + reglas de layout/jerarquía/estados +
markup) que esos equipos puedan adoptar en su propio stack, y (b) una
implementación de referencia real y navegable dentro de Web Factory (el
template `dashboard` + el cliente demo `dashboard-demo`) que demuestra el
sistema funcionando, no solo describiéndolo.

## Sección 1 — Estándar de Landing

### Entregable

`web-factory/WEB_FACTORY_LANDING_STANDARD.md` — documento nuevo, sin cambios
de código. Consolida (no repite) lo ya escrito en `WEB_FACTORY_HERO_VARIANTS.md`,
`WEB_FACTORY_PATTERN_BANK_2026.md` y `WEB_FACTORY_SKILL_STACK.md`, agnóstico de
rubro (landing-clinic es el ejemplo, no la única forma).

### Contenido

**Piso de calidad** (checklist operable, deriva de impeccable + Pattern Bank +
design-quality.md, ya validado en landing-clinic v2):

- ≥4 Required Qualities presentes (jerarquía por escala, ritmo no-uniforme,
  profundidad/layering, tipografía con carácter, color semántico, estados
  hover/focus diseñados, bento/editorial, motion con propósito).
- Hero elegido por el dispatcher de variantes (`resolveHeroVariant`), nunca
  hardcodeado a una sola composición.
- Imagen real o marcada como stock (`.context.md`) en el hero **y** al menos
  una banda editorial a mitad de página.
- Motion scroll-driven progresivo: `@supports (animation-timeline: ...)` +
  `prefers-reduced-motion: no-preference`, con fallback visible.
- `:focus-visible` en todo elemento interactivo, con contraste sobre foto y
  sobre fondo claro/oscuro (patrón: anillo + halo, no solo `outline` default).
- Tokens-only CSS: cero color hardcodeado en bloques/templates.
- Íconos SVG reales (uno de un set canónico), nunca iniciales o emoji.

**DO** (con ejemplo de dónde vive en el código):

- Bento asimétrico para ofertas agrupadas (`clinic-services.ts`).
- Timeline conectada para procesos (`clinic-process.ts`), no cards clonadas.
- Marquee reutilizable para listas de sellos/beneficios repetibles
  (`marquee.ts`), pausa en hover, `aria-hidden` en la copia duplicada.
- Copy parametrizable con default sensato (`disponibilidad`,
  `ctaSecundariaTexto`) para que el mismo bloque sirva a cualquier rubro —
  nunca texto de un vertical hardcodeado dentro de un componente "genérico".

**DON'T** (bans directos, de impeccable + auditoría de esta sesión):

- Hero "texto izquierda + imagen derecha" como única composición considerada.
- Grids de cards idénticas (mismo tamaño, mismo ícono, cero variación).
- Gradient-text, glassmorphism decorativo por defecto, hero-metric-SaaS-cliché.
- Copy o íconos que asumen un solo vertical dentro de un bloque compartido.
- Generar (no adaptar) datos de prueba como si fueran reales; stock siempre
  marcado en `.context.md`.

**Referencia canónica**: landing-clinic v2 (este PR, commits `2b78196e` en
adelante). El documento enlaza a los 3 docs existentes en vez de duplicarlos.

## Sección 2 — Sistema de Diseño de Dashboard

### Problema confirmado en el código actual

En `packages/templates/src/dashboard.ts` (1039 líneas), `.wf-kpi`,
`.wf-chart-card` y `.wf-dash-table` declaran el mismo tratamiento visual
(`border: 1px solid var(--border); border-radius: var(--radius); background:
var(--card)`) sin ninguna variación de peso. Los KPI usan
`grid-template-columns: repeat(auto-fit, minmax(190px, 1fr))` (todas iguales),
los charts van en un grid uniforme, no hay elemento dominante. Esto es
exactamente el anti-patrón "identical card grids" y "KPI cards with no
hierarchy" que impeccable y el propio Pattern Bank (sección Dashboard)
prohíben.

Grounding visual usado (capturas reales, licencia clara, ya cacheadas en
`C:\Users\PC\.codex\design-stack`): shadcn `dashboard-01` (MIT), launch-ui
dashboard dark (revisado en esta sesión), Tremor dashboard blocks
(Apache-2.0). Extraer estructura/jerarquía, no copiar identidad ni datos.

### Modelo de jerarquía (3 niveles)

1. **Hero** — un chart dominante (≈2/3 del ancho en desktop), justo debajo del
   topbar, con el selector de rango (`wf-dash-filters`, ya existe) anclado a
   su título en vez de flotando en el topbar general.
2. **KPIs de apoyo** — 3-5 cards secundarias: tipografía menor que el hero,
   sin elevación extra, dan contexto (no compiten visualmente con el hero).
3. **Detalle** — grid de 2-3 charts secundarios + **fila asimétrica**: tabla
   (~65%) + panel lateral compacto tipo lista (~35%), en vez de grid uniforme
   (inspirado en el patrón real Transactions + Recent Sales de shadcn
   dashboard-01, sin copiar su código ni datos).

### Primitivo de card único

Nuevo: una clase base `.wf-dash-card` (border/radius/background/padding
token-driven, la misma declaración que hoy están triplicada) con modificadores:

- `.wf-dash-card--hero` (padding mayor, sin límite de altura por grid,
  sombra/elevación vía `box-shadow` con `color-mix` sobre `--color-fg`).
- `.wf-dash-card--compact` (KPIs de apoyo: padding menor, sin sombra).
- Default (sin modificador): charts secundarios, tabla, panel lateral.

`.wf-kpi`, `.wf-chart-card`, `.wf-dash-table` pasan a **componerse** sobre
`.wf-dash-card` (clase compartida + clase específica para tipografía/contenido
interno), eliminando la triplicación actual.

### Charts (se mantiene SVG sin dependencias)

Se mantiene el renderer SVG puro actual (cero JS runtime, alineado a
`web/performance.md` y al resto del factory) — no se introduce una librería de
charts nueva. Mejoras:

- Variante "hero": `viewBox` más grande, area-fill con gradiente (`<linearGradient>`
  token-driven, ya que `renderLineChart` hoy dibuja solo `<polyline>`) para el
  chart dominante.
- Tooltips accesibles vía `<title>` dentro de cada punto/segmento (hover +
  focus, sin JS adicional a lo que ya existe).
- Se reutiliza `SERIES_COLORS` (ya token-driven) para leyendas multi-serie.

### Tabla y panel lateral

- Nuevo tipo de celda **status pill**: punto de color + texto, usando los
  tokens existentes `--wf-pos`/`--wf-neg` (ya definidos con variante dark en
  `dashboard.ts:584-599`) más un neutro `--wf-warn` nuevo (ámbar, mismo patrón
  `color-mix` que los otros dos) para estados intermedios ("pendiente").
- Panel lateral (nuevo): lista compacta de filas con **inicial-en-círculo**
  (mismo patrón que el logo del sidebar, `wf-dash-brand-mark`) + label + valor
  — nunca avatar fotográfico de una persona falsa (regla del Pattern Bank: no
  fabricar identidades).

### Estados: loading / vacío / error

- **Loading**: overlay de skeleton por sección (`.wf-dash-card.is-loading`),
  bloques grises con shimmer CSS (`@keyframes` de gradiente desplazado);
  `prefers-reduced-motion: reduce` cambia el shimmer a estático (sin animación,
  solo el bloque gris). Progressive enhancement: un pequeño script (mismo
  patrón que `renderRevealScript` en landing-clinic) alterna la clase
  únicamente para que la referencia sea inspeccionable en vivo — los productos
  reales (DentalGest/GestiOS) cablean esta clase a su propio estado async, no
  a este script de demo.
- **Vacío**: ya existe (`renderEmpty`); se re-estiliza sobre `.wf-dash-card`
  para quedar consistente con el nuevo sistema, sin cambiar su contrato
  (mismo `title`/`hint`).
- **Error** (nuevo): ícono de alerta + mensaje + botón "Reintentar" (sin
  handler real en el demo estático; el markup/clase es lo que cada producto
  cablea a su propio retry). Usa `--wf-neg` para el ícono/acento.

### Navegación agrupada

`DashboardData.nav` pasa de `string[]` a también aceptar un shape agrupado,
**backward-compatible**:

```ts
export type DashboardNavGroup = { group?: string; items: string[] };
export type DashboardData = {
  // ...
  nav: string[] | DashboardNavGroup[];
  // ...
};
```

Si es `string[]` (como hoy), se renderiza sin headers de grupo (comportamiento
actual intacto — no rompe `demo`/otros consumidores). Si es
`DashboardNavGroup[]`, cada grupo con `group` definido muestra un caption sobre
sus links (patrón real: launch-ui agrupa "Documents" sobre Data
Library/Reports/Word Assistant). El demo de referencia usa grupos por lo que
el usuario **decide** (ej. "Hoy" / "Trabajo" / "Análisis" / "Cuenta"), no por
jerarquía técnica.

### Responsive

- Sidebar ya colapsa a fila con scroll horizontal en `max-width: 860px`
  (existente, se mantiene).
- KPI row de apoyo: en mobile pasa a `grid-auto-flow: column` con scroll-snap
  horizontal (en vez de apilarse en columna, que dejaría el hero chart muy
  lejos del fold) — decisión de diseño, verificada visualmente en el gate.
  Documentado el trade-off por si un producto prefiere apilado clásico.
  Aunque el user-facing test es simple: **cero overflow horizontal accidental
  del documento**, solo el contenedor de scroll intencional.
- Hero chart y tabla ya tienen wrappers de scroll/reflow (`viewBox` SVG +
  `wf-dash-table-scroll` existente) — se verifica que se mantengan legibles a
  375px.

### Referencia y datos

**No se agrega un cliente demo nuevo.** Se enriquecen los datos de
`data/clients/dashboard-demo.json` (mismo slug) para ejercitar el sistema
completo: un chart marcado como hero, 4-5 KPIs de apoyo, 2 charts secundarios
de tipos distintos, tabla con status pills, panel lateral, nav agrupada, y al
menos un caso de cada estado (vacío ya cubierto por un test dedicado con datos
mínimos, como hoy; loading/error se documentan vía la clase CSS + el script de
demo, no requieren un cliente separado). Escenario **neutro**: consola de
operaciones genérica (ingresos, cuentas activas, tareas pendientes de
aprobación, uptime/SLA), sin atarlo a un vertical.

### Refactor de archivo (justificado, no oportunista)

`dashboard.ts` ya tiene 1039 líneas antes de este cambio; agregar el sistema
completo (cards, estados, nav agrupada, hero chart) lo haría inmanejable en un
solo archivo. Se separa en:

- `packages/templates/src/dashboard.ts` — orquesta: tipos, composición del
  body, doc HTML completo (igual rol que hoy, mucho más corto).
- `packages/templates/src/dashboard-charts.ts` — todo el renderer SVG
  (bar/line/donut/sparkline, hero variant, leyendas, tooltips).
- `packages/templates/src/dashboard-cards.ts` — `.wf-dash-card` y sus
  consumidores (KPI, chart-card wrapper, tabla, panel lateral, estados
  loading/empty/error).

CSS se mantiene en un solo string exportado (mismo patrón que
`clinic-css.ts`), posiblemente dividido en 2 constantes (`dashboardBaseCss` +
`dashboardCardsCss`) si crece demasiado para un solo literal legible.

## Gates y no-regresión

- Unit (`generate.test.ts`): casos existentes de dashboard (básico, vacío,
  tipos de chart) se mantienen verdes; se agregan casos para hero chart, nav
  agrupada, status pills, y los 3 estados.
- e2e: `tests/e2e/dashboard.spec.ts` se extiende para la nueva jerarquía/nav;
  `a11y.spec.ts` debe seguir en verde light+dark para `dashboard-demo` (riesgo
  principal: contraste de los status pills y el gradiente del hero chart en
  dark — se verifica, no se asume); `perf.spec.ts` — el budget actual es 60kb;
  como no se agregan imágenes (todo SVG/CSS), se espera mantenerlo, pero se
  mide antes de decidir si hay que ajustarlo (igual que se hizo con
  landing-clinic).
- `factory:smoke` no cambia (mismo slug `dashboard-demo`, ya incluido).
- Sin anti-referencias: no se copia código, datos, ni identidad de
  shadcn/launch-ui/Tremor — solo estructura/jerarquía, con licencias
  compatibles (MIT/Apache-2.0) documentadas.
- Commits conventional, por carpeta/responsabilidad.

## Fuera de alcance (explícito)

- No se toca `store.ts` (tienda Nuvia) ni `onia-center`.
- No se escribe código para los repos de DentalGest/GestiOS/ONIA Center — el
  doc del sistema es lo que esos equipos portan.
- No se renombran los bloques `clinic-*` de landings a nombres genéricos en
  esta pasada (mejora mecánica de menor valor, se deja como follow-up).
- No se introduce una librería de charts con dependencia runtime.

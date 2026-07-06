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
dashboard dark, Tremor dashboard blocks (Apache-2.0) — los tres son
dashboards de **analytics/growth SaaS**. Extraer estructura/jerarquía, no
copiar identidad ni datos.

**Corrección tras revisión propia**: los tres primeros references son de
analytics/growth, pero DentalGest/GestiOS son **ERPs operativos** — lo más
crítico en su uso diario no es "ver una tendencia", es "qué tengo que atender
hoy" (agenda, aprobaciones, stock bajo). Se sumó grounding real de producto vía
Mobbin (capturas de producto real, no plantillas, licencia de referencia):
Asana "Insights" (panel de trabajo B2B, primo cercano a un ERP) y un dashboard
fintech, ambos en
`design-stack/gallery-examples-full/mobbin-web/021-view-collection-beautiful-saas-dashboards-44e47f62/`.
Confirman dos cosas que el modelo original no tenía:

- El dashboard fintech funde el **KPI headline con su propia mini-visualización
  de tendencia dentro de la misma card** (`Net cashflow S$3.00 ▲100%` + un
  chart de línea debajo, en un solo panel), no como dos elementos separados.
- Asana Insights renderiza sus KPIs **sin card/borde** (solo número + label),
  ubica un único chart con una línea de explicación bajo el título
  ("Engagement — da un panorama de alto nivel de..."), y el peso real de la
  página vive en **paneles de listas** (Recently added / Most influential
  members), no en más charts. Eso es lo que un ERP realmente necesita.

### Modelo de jerarquía (3 niveles, con Tier 1 flexible)

1. **Hero (`heroPanel`)** — el elemento de mayor peso, con dos variantes
   soportadas por el sistema (una elección de datos, no de código separado):
   - `metric-trend`: un KPI headline + su propia mini-visualización de
     tendencia fusionada en la misma card (sparkline o barra corta bajo el
     número) — para "estado de un vistazo" (ingresos, ocupación, uptime).
     Perfil growth/analytics.
   - `queue`: una lista priorizada de acciones (título + estado + urgencia/
     vencimiento + acción rápida) — para "qué tengo que atender hoy"
     (turnos de hoy, aprobaciones pendientes, stock bajo). Perfil ops/ERP,
     validado por el patrón de listas de Asana Insights.
   - **El dashboard de referencia (`dashboard-demo`) usa `queue`**, porque es
     el perfil que de verdad sirve a DentalGest/GestiOS (ver "Validación
     pendiente" más abajo). El sistema soporta ambos; el doc explica cuál
     elegir según la tarea diaria real del producto.
2. **KPIs de apoyo** — 3-5 métricas secundarias. Pueden ser cards livianas
   (`.wf-dash-card--compact`) o, si el `heroPanel` ya es `queue`, incluso
   sin borde (patrón Asana) para no competir visualmente con el hero.
3. **Detalle** — grid de 1-2 charts secundarios + **fila asimétrica**: tabla
   con filtros tipo chip (patrón real: Hotjar, filtros de pill sobre la
   tabla) + panel lateral compacto tipo lista (inspirado en Transactions +
   Recent Sales de shadcn dashboard-01 y en Recently added/Most influential
   de Asana), en vez de grid uniforme de charts.

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

### Charts (se mantiene SVG sin dependencias) — reglas de data-viz reales

Se mantiene el renderer SVG puro actual (cero JS runtime, alineado a
`web/performance.md` y al resto del factory) — no se introduce una librería de
charts nueva. Se agregan reglas concretas de selección/accesibilidad (lo que
faltaba en el draft anterior, que solo decía "mejorar el SVG" sin criterio):

- **Selección de tipo**: línea/área para tendencia en el tiempo (1-3 series);
  barra para comparación categórica; donut **solo** con ≤4-5 segmentos (más
  que eso deja de leerse — no usar donut para más categorías); sparkline
  para el mini-chart inline del `heroPanel` tipo `metric-trend` (sin ejes,
  mínimo). **Prohibido eje dual** (dos escalas Y en un mismo chart): confunde
  la correlación entre series y ya es un anti-patrón conocido de data-viz.
- **Redundancia de color** (accesibilidad para daltonismo): el código ya
  cumple esto para KPI deltas — `trendGlyph()` (`dashboard.ts:475-483`) agrega
  ▲/▼/• además del color verde/rojo (`--wf-pos`/`--wf-neg`). **Se extiende la
  misma regla al status pill nuevo** (abajo): nunca solo el punto de color,
  siempre con un glyph o texto que no dependa del color para distinguir el
  estado.
- **Leyendas multi-serie**: se reutiliza `SERIES_COLORS` (ya token-driven);
  verificar que la separación de luminancia entre series sea suficiente para
  diferenciarlas en escala de grises (proxy simple de daltonismo), no solo
  distintos tonos del mismo brillo.
- **Ejes**: siempre con unidad visible (`chart.unit` ya existe); en mobile
  (375px) reducir la cantidad de ticks del eje X en vez de rotar/truncar
  etiquetas ilegibles.
- Variante "hero" (`metric-trend`): `viewBox` más grande, area-fill con
  gradiente (`<linearGradient>` token-driven, ya que `renderLineChart` hoy
  dibuja solo `<polyline>`).
- Tooltips accesibles vía `<title>` dentro de cada punto/segmento (hover +
  focus, sin JS adicional a lo que ya existe).

### Tabla y panel lateral

- Fila de **filtros tipo chip** sobre la tabla (patrón real validado: vista de
  encuestas de Hotjar en la misma captura Mobbin — chips de filtro como
  "Page URL", "Sentiment", "Tag", "Rating" sobre una tabla de gestión), en vez
  de una tabla sin forma de acotar los datos.
- Nuevo tipo de celda **status pill**: punto de color + **glyph/texto**
  (nunca solo color, ver regla de redundancia arriba), usando los tokens
  existentes `--wf-pos`/`--wf-neg` (ya definidos con variante dark en
  `dashboard.ts:584-599`) más un neutro `--wf-warn` nuevo (ámbar, mismo patrón
  `color-mix` que los otros dos) para estados intermedios ("pendiente").
- Panel lateral (nuevo): lista compacta de filas con **inicial-en-círculo**
  (mismo patrón que el logo del sidebar, `wf-dash-brand-mark`) + label + valor
  — nunca avatar fotográfico de una persona falsa (regla del Pattern Bank: no
  fabricar identidades). Patrón validado por los paneles "Recently added" /
  "Most influential members" de Asana Insights (misma captura Mobbin).

### Estados: loading / vacío / error

**Corrección tras revisión propia**: el draft original escondía loading/error
detrás de un toggle JS que nadie iba a descubrir — inútil como referencia real
("lo que no se ve, no se copia"). Los 3 estados se muestran **siempre visibles**
en el output estático, en una sección dedicada `#estados` al final del dashboard
de referencia ("Estados de la interfaz"), con un ejemplo fijo de cada uno lado a
lado (una card KPI, un chart-card y una fila de tabla, ×3 estados) — no requiere
interacción para verlos.

- **Loading**: bloques grises con shimmer CSS (`@keyframes` de gradiente
  desplazado) sobre `.wf-dash-card.is-loading`; `prefers-reduced-motion: reduce`
  cambia el shimmer a estático (sin animación, solo el bloque gris). Los
  productos reales (DentalGest/GestiOS) cablean esta clase a su propio estado
  async; acá se ve fija para que el patrón sea copiable con solo inspeccionar
  el HTML/CSS, sin depender de encontrar un toggle oculto.
- **Vacío**: ya existe (`renderEmpty`); se re-estiliza sobre `.wf-dash-card`
  para quedar consistente con el nuevo sistema, sin cambiar su contrato
  (mismo `title`/`hint`). Se muestra en la sección `#estados` además de en su
  uso real (KPIs/charts/tabla sin datos).
- **Error** (nuevo): ícono de alerta + mensaje + botón "Reintentar" (sin
  handler real en el demo estático; el markup/clase es lo que cada producto
  cablea a su propio retry). Usa `--wf-neg` para el ícono/acento, con el
  mismo criterio de redundancia de color (ícono + texto, no solo color rojo).

### Tipo de datos del hero (nuevo, en `DashboardData`)

```ts
export type DashboardHeroPanel =
  | { kind: "metric-trend"; kpi: DashboardKpi; points: DashboardPoint[] }
  | {
      kind: "queue";
      title: string;
      items: Array<{
        titulo: string;
        estado: "pendiente" | "urgente" | "al-dia";
        meta: string; // ej. "Hoy 15:30", "Vence manana"
        url?: string; // accion rapida opcional
      }>;
    };
```

`DashboardData.heroPanel` es opcional (`?`) para no romper clientes existentes
que aún no lo definen (backward-compatible, mismo criterio que `nav`); sin él,
el dashboard renderiza como hoy (sin tier 1 diferenciado) hasta que el cliente
lo adopte.

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
  horizontal (en vez de apilarse en columna, que dejaría el `heroPanel` muy
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
completo: `heroPanel` tipo **`queue`** (perfil ops, no chart de tendencia —
ver corrección arriba) con 4-5 ítems priorizados, 3-4 KPIs de apoyo, 2 charts
secundarios de tipos distintos (respetando las reglas de selección de arriba),
tabla con filtros chip + status pills, panel lateral tipo lista, nav agrupada,
y la sección `#estados` con los 3 estados siempre visibles. Escenario
**neutro**: consola de operaciones genérica (cuentas activas, tareas
pendientes de aprobación, uptime/SLA), sin atarlo a un vertical. El caso de
`heroPanel: metric-trend` (perfil growth) se cubre con un test unitario
dedicado (dato sintético mínimo), no necesita su propio cliente demo.

### Refactor de archivo (justificado, no oportunista)

`dashboard.ts` ya tiene 1039 líneas antes de este cambio; agregar el sistema
completo (cards, estados, nav agrupada, `heroPanel` con sus 2 variantes) lo
haría inmanejable en un solo archivo. Se separa en:

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
  tipos de chart) se mantienen verdes; se agregan casos para `heroPanel`
  (ambas variantes: `metric-trend` y `queue`), nav agrupada, status pills, y
  los 3 estados.
- e2e: `tests/e2e/dashboard.spec.ts` se extiende para la nueva jerarquía/nav,
  incluida la sección `#estados` (loading/vacío/error siempre visibles); se
  verifica que el status pill y `trendGlyph()` no dependan solo de color
  (glyph/texto presente en el HTML, no solo la clase de color). `a11y.spec.ts`
  debe seguir en verde light+dark para `dashboard-demo` (riesgo principal:
  contraste de los status pills y del `heroPanel` en dark, sea `queue` o
  `metric-trend` — se verifica, no se asume); `perf.spec.ts` — el budget
  actual es 60kb;
  como no se agregan imágenes (todo SVG/CSS), se espera mantenerlo, pero se
  mide antes de decidir si hay que ajustarlo (igual que se hizo con
  landing-clinic).
- `factory:smoke` no cambia (mismo slug `dashboard-demo`, ya incluido).
- Sin anti-referencias: no se copia código, datos, ni identidad de
  shadcn/launch-ui/Tremor — solo estructura/jerarquía, con licencias
  compatibles (MIT/Apache-2.0) documentadas.
- Commits conventional, por carpeta/responsabilidad.

## Validación pendiente (honestidad sobre el alcance)

Este sistema es un **modelo B2B razonado y grounded en producto real** (Asana
Insights, Hotjar, shadcn/launch-ui/Tremor, fintech dashboard vía Mobbin), pero
**no fue validado contra las pantallas reales de DentalGest, GestiOS ni ONIA
Center** — no tengo acceso a esos repos desde este carril (DentalGest/GestiOS
son repos externos; ONIA Center es otra sesión, no se toca). La elección de
`heroPanel: queue` para el ops-perfil es la mejor inferencia disponible sobre
lo que un ERP de agenda/clínica necesita, no un hecho confirmado por esos
equipos.

**Antes de que DentalGest/GestiOS lo adopten como estándar obligatorio**,
alguien de esos equipos debería revisar el doc final contra 2-3 pantallas
reales de su producto y confirmar o ajustar: qué va en el `heroPanel` (¿de
verdad es una cola de turnos/aprobaciones, o hay algo más crítico?), qué
agrupación de nav corresponde a como sus usuarios deciden, y si el status pill
/ tabla con chips cubre sus casos de uso reales. Esto se deja anotado como
seguimiento explícito, no bloquea la entrega de la referencia dentro de Web
Factory.

## Fuera de alcance (explícito)

- No se toca `store.ts` (tienda Nuvia) ni `onia-center`.
- No se escribe código para los repos de DentalGest/GestiOS/ONIA Center — el
  doc del sistema es lo que esos equipos portan.
- No se renombran los bloques `clinic-*` de landings a nombres genéricos en
  esta pasada (mejora mecánica de menor valor, se deja como follow-up).
- No se introduce una librería de charts con dependencia runtime.

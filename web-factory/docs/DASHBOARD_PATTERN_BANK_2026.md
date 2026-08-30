# Dashboard Pattern Bank 2026 — cómo se arma un panel que el cliente entiende de un vistazo

> Lente **dashboards / data-viz** del corpus web-factory. Anclado 100% en el código que ya existe
> (`packages/templates/src/dashboard.ts`, `packages/blocks/src/stat-strip.ts`,
> `packages/tokens/src/index.ts`) y en la skill **`dataviz`** (form heuristic, color formula +
> validador, marks & anatomy). Cada regla cita su fuente. Donde el código de hoy contradice a
> `dataviz`, lo marco **[FIX]** con la corrección; donde ya cumple, **[OK] preservar**.
>
> Regla de la casa que no cambia: **el dashboard come los MISMOS tokens que la landing del
> cliente** (`renderDashboardCss = clientTokenCss(client) + dashboardBaseCss`,
> `dashboard.ts:606`). No es un widget pegado: es la marca del cliente en otra superficie.

---

## 0. El motor ya está construido (punto de partida, no invento)

`dashboard.ts` (1281 líneas) es un dashboard completo, **CSS-only, token-driven, cero deps de
runtime** (`// pure SVG computed from data`, `dashboard.ts:290`). Ya trae:

| Pieza | Función | Línea |
|---|---|---|
| Sidebar sticky + topbar con filtros de rango + toggle de tema | `renderDashboardBody` / `renderTopbar` | 76, 111 |
| Fila de KPIs (con hero cell y sparkline integrada) | `renderKpis` | 148 |
| Grid de charts (bar / line / donut / sparkline en SVG puro) | `renderCharts` / `renderChart` | 180, 350 |
| Listas de progreso con chip de estado | `renderLists` | 208 |
| Tabla header-sticky + scroll-x propio | `renderTable` | 251 |
| Reveal por IntersectionObserver con guarda `prefers-reduced-motion` | `dashboardScript` | 637 |

Las decisiones de patrón vienen citadas en el propio código a un pattern bank de referencias
(Fireart 25241984, Stakent 23902428, OnPoint 25540988). **Este documento es cómo debe verse la
versión correcta y dónde el código de hoy se separa de la skill `dataviz`** — ahí está el valor.

---

## 1. Arquitectura — cinco bandas, de lo agregado a lo granular

El orden que emite `renderDashboardBody` (`dashboard.ts:99-104`) es la jerarquía, y es una **sola
dirección de lectura**: cada banda responde la pregunta que abrió la de arriba.

| Banda | Qué es | Pregunta que responde | Fuente |
|---|---|---|---|
| **0 · Topbar** | Título + filtros de rango en un row encima de todo | "¿de qué periodo hablamos?" | `renderTopbar` |
| **1 · Fila de KPIs** | 3-5 stat tiles, el resumen | "¿cómo venimos?" | `renderKpis` |
| **2 · Grid/bento de paneles** | El detalle visual (serie temporal + mezcla + ranking) | "¿por qué ese número?" | `renderCharts` |
| **3 · Listas de progreso** | Ranking legible de un vistazo | "¿quiénes / cuáles?" | `renderLists` |
| **4 · Tabla** | El grano, donde se verifica el dato | "¿esta fila exacta?" | `renderTable` |

KPI dice "ventas −8%"; el chart de al lado dice "por esto"; la lista dice "estos clientes"; la
tabla dice "esta factura". `dataviz` (`choosing-a-form.md`): filtros **en un row arriba de los
charts** — el `renderTopbar` ya los pone ahí. **[OK]**

**[FIX] Bento en la banda 2.** Hoy la banda 2 es grid uniforme
(`repeat(auto-fit, minmax(280px,1fr))`, `dashboard.ts:981`). El tier premium **rompe la
uniformidad**: el chart ancla (la serie temporal que cuenta la historia) toma `grid-column: span 2`
y a su lado van los paneles chicos (donut de mezcla, barras de ranking). Regla web ONIA
`design-quality.md` #7: "grid-breaking editorial or bento composition". Uniforme = se ve plantilla.

---

## 2. La fila de KPIs — contrato del stat tile

Grid `repeat(auto-fit, minmax(190px,1fr))` (`dashboard.ts:885`). 3-5 tiles. Contrato de cada tile
(`dataviz` marks-and-anatomy §Figures), ya implementado en `DashboardKpi` (`dashboard.ts:3`):

| Campo | Regla | Ejemplo |
|---|---|---|
| `label` | sentence case, sin dos-puntos | "Ventas del mes" |
| `value` | compacto | `1.284` · `12,9K` · `$4,2M` |
| `delta` | firmado, vs periodo NOMBRADO; color = dirección | `▲ 8,4% vs jul` |
| `trend` (`spark`) | sparkline de ~12 puntos, endpoint marcado | 12 barras / línea |
| `variant:"accent"` | **exactamente UNA** hero cell por fila | la métrica estrella |

**El hero cell (`wf-kpi--accent`).** Una tarjeta sólida entre hermanas quietas
(`dashboard.ts:900`, "Use on ONE kpi per row"). `dataviz`: "Hero figure … Exactly one per view".
**[OK]**

**[FIX] La fuente del número.** `.wf-kpi-value` y `.wf-stat-value` pintan con
`var(--font-heading)` (`dashboard.ts:941`, `stat-strip.ts:145`). Pero `dataviz` marks-and-anatomy
§Hero: el número va **en la misma grotesca que todo, nunca en display/serif — "reads as off-brand
decoration"**. Y la identidad ONIA exige serif/display con carácter en heading → **choque real**.
Resolución: en el dashboard el **número** (KPI value, hero, ejes, tabla) usa `--font-body` con
`tabular-nums` en columnas; el **serif/display de marca** se reserva para títulos de panel y
encabezados de sección. Así se respetan las dos leyes a la vez.

---

## 3. Estado por FORMA + color, nunca color solo (regla dura)

El daltónico tiene que leer el estado sin el color. Reglas ancladas:

- **[OK] Delta con glifo.** `trendGlyph` emite ▲ / ▼ / • además de la clase de color
  (`dashboard.ts:585`). `dataviz` color-formula §Status: "always paired with an icon + label,
  never color alone".
- **[OK] Pendiente/futuro = textura, no color.** `renderBarChart` usa `<pattern id="wf-hatch">`
  diagonal a 45° para `point.pending` (`dashboard.ts:397`). `dataviz` §Texture: "one directional
  fill, 45°". La FORMA (rayado) dice "proyectado".
- **[OK] Placeholder = etiqueta visible.** `stat-strip.ts` imprime "dato de muestra" y baja el
  tamaño del número no confirmado (`stat-strip.ts:73,157`). Honestidad por forma = política de
  marca ("no fabricar") hecha código.
- **[FIX] Endpoint de sparkline.** Los dots son `r=3` / `r=2.5` sin anillo (`dashboard.ts:526,
  446`). `dataviz` pide marker con **anillo de 2px en color de superficie** para que se lea al
  cruzar la línea → subir a `r=4` + `stroke=var(--card) stroke-width=2`.
- **[FALTA] Meter para severidad.** Para "1 ratio contra un límite" (`dataviz` choosing-a-form) el
  motor no tiene meter. El track debe ser un paso más claro del **mismo hue** del fill
  (blue-on-blue), no gris. Hoy `.wf-list-bar` es track gris + fill primary (`dashboard.ts:1119`):
  sirve para progreso, no para severidad.

---

## 4. Charts y sparklines — el cuidado data-viz

`dataviz` form heuristic aplicada a lo que ya genera el motor, con las correcciones de spec:

| Miss vs `dataviz` marks-and-anatomy | Hoy | [FIX] |
|---|---|---|
| Gridlines dashed | `stroke-dasharray="2 3"` (`renderGrid`, `dashboard.ts:323`) | sólidas, hairline 1px, recesivas |
| Ancho de barra sin cap | `Math.max(2, …)` (`dashboard.ts:391`) | `Math.min(24, …)` — ≤24px, el resto es aire |
| Barra redondeada en 4 esquinas | `rx="3"` (`dashboard.ts:411`) | 4px en el data-end, **cuadrada en la base** |
| Tooltip nativo del browser | solo `<title>` SVG (`dashboard.ts:411,448`) | crosshair+tooltip estilado (premium, JS chico sobre los SVG) |
| Donut de 6 gajos excede el cap | `SERIES_COLORS` de 6 (`dashboard.ts:337`) | `dataviz` capea all-pairs en 3 → plegar la cola en "Otros" o pasar a barra apilada horizontal |

**Regla de una sola serie (el caso más común de una PYME).** `renderBarChart` pinta TODAS las
barras de `var(--color-primary)` (`dashboard.ts:407`): correcto para nominal de una serie —
"each bar takes the same slot-1 hue". **No tocar.** Con una sola serie NO es categórico: es
secuencial (un hue, más-oscuro-es-más) o emphasis (la serie que importa en acento, el resto gris).

**Los números fiscales no bailan.** `stat-strip.ts:48` — el count-up es **opt-out por forma**: un
monto con moneda (`CURRENCY`), decimal o placeholder NUNCA anima (`COUNTABLE` solo enteros). El
número final SIEMPRE está en el HTML → no-JS, SEO y reduced-motion leen el valor real. **[OK]**

---

## 5. Color semántico SEPARADO del acento — el hallazgo crítico

Tres canales de color **independientes**. Cambiar la marca del cliente repinta uno solo.

| Canal | Qué pinta | De dónde sale |
|---|---|---|
| **Cromo de marca** | sidebar activo, CTA, la UNA hero cell, ring de foco | `--color-primary/secondary/accent` del cliente |
| **Tinta de dato** | las series de los charts | **theme categórico fijo validado — NO la marca** |
| **Estado** | good / warn / critical, con icono+label | `--wf-pos` / `--wf-neg` (reservados) |

**[OK] El estado ya está bien.** `--wf-pos` (#166534) / `--wf-neg` (#b91c1c) viven en tokens
propios y se **elevan a tonos brillantes en oscuro** (#4ade80 / #f87171) para no fallar contraste
sobre superficie oscura (`dashboard.ts:694-710`). `dataviz` color-formula §Status: "Status colors
are reserved … never reused for series". El delta y los chips usan estos tokens, no el acento.
**Preservar tal cual.**

**[HECHO — PRESERVAR] La paleta categórica ya salió de la marca** (commit `8fa44440`, 2026-08-30).

> ⚠️ Este bloque decía `[FIX CRÍTICO]` y describía un `SERIES_COLORS` de `color-mix` que ya no
> existe. Quedó pidiendo un trabajo hecho: **quien lo obedezca hoy rehace el fix y encima pisa
> la paleta validada con el orden crudo de `references/palette.md`.** No lo hagas.

El diagnóstico original era correcto y por eso se aplicó: la marca del cliente nunca fue diseñada
como escala CVD-safe, y los `color-mix … 50% bg` eran **hues generados** — un cliente mono-hue
producía un donut donde 4 gajos eran el mismo tono lavado.

**Estado en HEAD** (`dashboard.ts:336-366`): la tinta de dato son custom properties
`--wf-series-1..6` compuestas desde `SERIES_THEME`, con **par light/dark por slot**. Son
variables y no hex porque un hex quemado en el atributo de un `<path>` **no puede cambiar con el
tema**: el dark necesita sus propios steps, no un flip.

**Cómo se eligió el orden — y por qué no se re-elige a ojo.** No se escogió: se **computó**. Se
enumeraron las 720 permutaciones y se validó cada una con el validador de `dataviz` contra los
surfaces reales, en ambos modos. Pasan 140; el ganador es:

```
aqua > blue > orange > violet > yellow > magenta
light  #1baf7a #2a78d6 #eb6834 #4a3aa7 #eda100 #e87ba4
dark   #199e70 #3987e5 #d95926 #9085e9 #c98500 #d55181
```

Peor ΔE adyacente **13.2** en ambos modos, sobre un gate de 8. **Reordenar los slots rompe la
garantía** — el orden ES el mecanismo de seguridad CVD, no cosmética.

La tanda anterior (`03a892f6`) se eligió a criterio y el validador la reprobó: el verde de marca
daba chroma 0.097 (**leía gris**) y terracota↔oliva ΔE 4.9 en deutan (**el mismo color** para
daltonismo verde). Es la prueba de por qué esto se corre, no se estima.

```
node scripts/validate_palette.js "<hexes>" --mode light --surface "#f6f2ea"
node scripts/validate_palette.js "<hexes>" --mode dark  --surface "#161c22"
```

⚠️ **El surface es el de la TARJETA, no el de la página.** Antes acá decía `#0c1013` (el
`DARK_BG` de `tokens/index.ts:54`), y está mal: medido en el navegador, el ancestro opaco detrás
del chart es `article.wf-chart-card` = `rgb(22,28,34)` = `#161c22` en oscuro y `#f6f2ea` en claro.
Validar contra el fondo de página da un veredicto de contraste que no es el que ve el usuario.
`dataviz`: "contrast and band results are only meaningful against the surface the chart actually
renders on". Asignación por nº de series: **1** → secuencial/emphasis (no
categórico); **2-3** → theme fijo, slots 1..N en orden, con leyenda (`renderLegend` ya existe,
`dashboard.ts:363`) + direct-label; **≥4** en scatter/donut → plegar en "Otros" o facetear.

---

## 6. Cómo el dashboard hereda el lenguaje visual de la web del cliente

**Un solo sistema de tokens, dos superficies.** `clientTokenCss` emite
`--color-primary/secondary/accent/bg/fg`, `--font-heading/body`, `--card`, `--border`,
`--muted-foreground`, `--radius` y el modo oscuro (`tokens/index.ts:15`). Landing y dashboard
comen los mismos: `renderDashboardCss` es literalmente `clientTokenCss(client) + dashboardBaseCss`
(`dashboard.ts:606`). El dashboard se reconoce como del cliente sin re-declarar nada.

**Superficie de tarjeta.** OJO: en modo claro `--card` = `bg` (`tokens/index.ts:35`), así que las
tarjetas del panel se separan del fondo **por el borde** (`--border`), no por color. En oscuro sí
hay superficie propia (`--card:#161c22` sobre `--color-bg:#0c1013`, `tokens/index.ts:78`). La
separación clara depende del hairline — si un cliente pide más profundidad, subir `--card` un paso
sobre `bg`, no meter sombra pesada.

**La marca cae a texto legible sola, no aplana el diseño.** `clientDarkTokenVars`
(`tokens/index.ts:72`) baja `--color-secondary`/`--color-primary` a `DARK_FG` **solo si** no
alcanzan 4.5:1 sobre el fondo oscuro (nace del bug real: 5 de 11 fichas tenían el `secondary` =
`fg` azul casi negro → títulos negro sobre negro, contraste 1,05:1 en producción). El validador de
`dataviz` se corre contra `#0c1013`, no con un flip automático.

**Anti-plantilla (regla ONIA `design-quality.md`).** El corpus SaaS que se ve plantilla comparte
síntoma: Inter/InterDisplay + azul genérico (teamworkgraph, mintlify `var(--font-inter)`). La
resolución del §2 lo evita limpio: la landing de marketing lleva el serif/display de carácter;
**solo los números del dashboard** llevan la grotesca neutra. Ninguna landing de cliente sale con
Inter en los titulares.

---

## 7. Tier ligero vs tier premium (dirección Sergio: animación primero)

`dashboard.ts` es el **tier ligero** y es el piso, no el ideal: CSS-only, reveal por IO, count-up
por el primitivo `wf-count` — ambos con guarda `prefers-reduced-motion`, número real siempre en el
DOM. Determinista y SEO-safe.

**Tier premium (Next 15 + React 19 + motion.dev + GSAP)** — dónde entra motion sin romper "los
números fiscales no bailan":

- **motion.dev**: stagger de la fila de KPIs y de los paneles del bento al entrar en viewport
  (reemplaza el `data-reveal` CSS). Ease `[0.22,1,0.36,1]`, dur ~0.6s, stagger 0.1s — los valores
  que `stat-strip.ts:11` ya documenta del pattern bank.
- **Count-up**: ya resuelto por `wf-count`; en React se porta como hook que respeta el gate de
  forma (`COUNTABLE`: solo enteros sin moneda animan).
- **GSAP + ScrollTrigger**: SOLO para el dibujo progresivo de la serie temporal principal (el path
  del line/area se "escribe" con `strokeDashoffset`) y paneles con scroll-scrub. Es scroll-driven,
  no idle-wobble — cumple `motion-doctrine` (la moción PERFORMA, no respira).
- **Hover layer** (obligatorio en premium): crosshair + tooltip estilado sobre los SVG; `<title>`
  no alcanza.
- **Regla dura**: cero animación en `prefers-reduced-motion`, y el dato real en el DOM antes de
  animar. No negociable, ya es el patrón del motor.

---

## 8. Checklist de cierre (prioridad)

1. **[PRESERVAR — hecho 2026-08-30, `8fa44440`]** `SERIES_COLORS` ya salió de la marca: son
   `--wf-series-1..6` con par light/dark, en un orden **computado** (720 permutaciones validadas,
   peor ΔE adyacente 13.2 sobre gate 8). **No re-elegir ni reordenar los slots** — el orden es el
   mecanismo de seguridad CVD. Detalle y comando en §5. (`dashboard.ts:336-366`)
2. **[CRÍTICO — nuevo, visto mirando el render]** **En oscuro la marca DESAPARECE.** Los tokens
   dark mapean `--color-primary` al foreground (`#e7e9ec`), así que sidebar activo, botón, celda
   KPI hero y las barras salen **blancos**: el panel pierde identidad justo en el tema que más se
   usa. Necesita un step oscuro del verde de marca, no el foreground. El token vive en
   `packages/tokens`, así que el arreglo alcanza a **todos** los templates — regenerar y mirar los
   otros demos antes de cerrar.
3. **[ALTO — nuevo]** **Los charts no escalan al ancho de la tarjeta.** `CHART_W=320 / CHART_H=150`
   son constantes y la tarjeta mide el doble: queda un tercio de tarjeta vacío en "Ingresos por
   mes" y "Ingresos vs meta". Es el defecto de composición más visible del panel.
   (`dashboard.ts:292-299`)
4. **[ALTO]** Capa de hover real (crosshair/tooltip). Hoy solo hay `<title>` nativo, que tarda ~1 s
   y no se puede estilar. `dataviz` interaction: un chart HTML **es** interactivo.
5. **[ALTO]** Separar fuentes: números en `--font-body`, serif/display solo en títulos de panel.
   (`dashboard.ts`, `stat-strip.ts:145`)
6. **[MEDIO]** Specs de marca de `dataviz`: gap de 2px de surface entre gajos del donut (hoy están
   pegados), marcadores ≥8px (hoy `r=2.5` → 5px de diámetro), puntas redondeadas de 4px en las
   barras ancladas a la baseline, cap de barra ≤24px.
7. **[MEDIO]** Falta **gauge/radial**. "Tasa de cierre 34%" es hoy un número pelado y es el caso de
   uso exacto (Tabler y Grafana lo resuelven así). + fila de mini stat-tiles con ícono.
8. **[MEDIO]** Donut: el cap all-pairs de `dataviz` es 3 slots. Con 4+ gajos hace falta encoding
   secundario (ya hay leyenda con % directo, que califica) o plegar la cola en "Otros".
9. **[MEDIO]** Bento en la banda 2: chart ancla `span 2`, romper el grid uniforme.
10. **[PRESERVAR]** `--wf-pos/neg` separados del acento con elevación en oscuro; textura hatch 45°;
   `wf-count` con valor real en HTML; herencia de tokens landing↔dashboard; count-up opt-out por
   forma. Todo eso ya cumple la skill.

> Los items 2, 3 y 6 **no se ven leyendo el código**: salieron de abrir la captura en claro y en
> oscuro. Un `grep` sirve para descartar, nunca para confirmar que algo se ve bien.

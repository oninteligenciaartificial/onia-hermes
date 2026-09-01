# CÓMO SE HACE UN DASHBOARD

Fecha: 2026-08-30. Fuente: 8 dashboards reales despiezados contra el código (shadcn dashboard-01, Tremor + su template-dashboard-oss, Tabler, Flowbite Admin, Horizon UI, Ant Design Pro, Grafana, next-shadcn-dashboard-starter), cruzados contra el admin real de Onia Platform y contra nuestro template `packages/templates/src/dashboard.ts`.

Ubicación sugerida en el repo: `web-factory/data/references/design-sources/2026-08-30-como-se-hace-un-dashboard.md` (hermano de `2026-08-29-como-se-hacen-las-webs.md`).

---

# 1. LAS LEYES

Son ley porque **convergen**, no porque me gusten. Cada una con las referencias que la sostienen.

## Ley 1 — El chart no tiene cromo: sin eje Y, sin línea de eje, sin ticks, gridlines solo horizontales

7 de 8. Es la convergencia más fuerte del corpus.

- **shadcn**: no importa `YAxis` siquiera. `<CartesianGrid vertical={false} />`, `XAxis tickLine={false} axisLine={false}`.
- **Tremor**: `axisLine={false}` y `tickLine={false}` en AMBOS ejes; `<CartesianGrid horizontal vertical={false}>`; sin baseline — el suelo del gráfico es la gridline del 0.
- **Tabler**: en el chart grande `axisBorder.show:false` para area y bar; padding negativo para recuperar el aire que Apex reserva de más.
- **Flowbite**: regla "uno y ninguno" — un solo chart hero lleva cromo, los otros cuatro van con `grid:{show:false}, yaxis:{show:false}` y labels/axisBorder/axisTicks en false.
- **Horizon**: `grid.show:false`, `yaxis.show:false`, sobreviven solo los labels X.
- **Grafana**: `axisBorderShow: false` por default; el grid a `1/devicePixelRatio` (medio píxel en retina).
- **starter**: los tres charts declaran solo `XAxis`. Ninguno tiene `YAxis`.

Único disidente parcial: Tabler y Flowbite encienden el cromo en **un** chart, el primario. Esa es la variante legítima: cromo en el hero, cero en el resto.

## Ley 2 — El KPI invierte el orden natural: label chico arriba, valor grande abajo

8 de 8. Sin excepción.

- shadcn / starter: `CardDescription` (label) → `CardTitle` (valor) → `CardAction` (delta).
- Tremor: `<dt>` nombre 14px gris → `<dd>` valor.
- Tabler: `.subheader` 12px uppercase gris → `.h1` 24px.
- Flowbite: `<h3>` 16px gris → `<span>` 30px.
- Horizon: `<p>` 14px gray-600 → `<h4>` 20px.
- antpro: title 14px → content 24px.
- Grafana: `BigValue.tsx` renderiza `{textValues.title &&...}` **antes** del valor, en el DOM.

El nombre va primero y en gris porque en una fila de 4 el ojo escanea etiquetas, no cifras. La cifra la lee cuando ya eligió la columna.

## Ley 3 — El delta se comunica por FORMA + SIGNO, nunca por color solo

8 de 8 usan al menos dos canales. Y **2 de 8 eliminan el color entero**.

- shadcn y starter: el MISMO `<Badge variant="outline">` neutro para +12,5% y para -20%. Solo cambia el icono (`IconTrendingUp` / `IconTrendingDown`) y el signo.
- Tabler: color + icono direccional + el número con signo + `<span class="visually-hidden">Increased by</span>`.
- Tremor: sin flechas, pero el formatter antepone `+` cuando el número es positivo (`number > 0 ? '+' : ''`), y usa `variant="neutral"` fijo cuando el cambio es informativo y no un juicio.
- Grafana: `arrow-up` si >0, `arrow-down` si <0, **ninguno si es exactamente 0**.
- antpro: un triángulo CSS de 7×9px que rota 180°.

Corolario que hay que robar de Grafana: tres modos de delta configurables — `Standard`, `Inverted` (para métricas donde subir es malo: churn, latencia, costo, días de cobro) y `SameAsValue`. Sin `Inverted`, un panel pinta de verde una latencia que se duplicó.

## Ley 4 — La tinta de dato vive en un token separado del color de marca; el que no lo hace, lo paga

Convergencia por los cuatro que lo hacen y por el daño documentado en los tres que no.

Lo hacen:
- **Grafana**: `theme.colors` (cromo) y `theme.visualization` (dato) son dos ejes distintos, construidos en dos archivos. El naranja de marca vive en `colors.gradients.brandHorizontal` y **no aparece nunca** en `createVisualizationColors.ts`. Las series se referencian por NOMBRE (`'green'`, `'semi-dark-red'`), y `getColorByName()` resuelve nombre→hex según el modo.
- **Tremor**: `src/utils/chartColors.ts`, un archivo de ~70 líneas. El producto lo redeclara con su color de marca **primero** y el resto neutro: serie 1 = marca, series 2..n = tema categórico.
- **shadcn / starter**: `--chart-1..5` existen aparte de `--primary`. En el tema default de starter, `--primary` es negro puro y `--chart-1` es ámbar.

No lo hacen, y se les nota:
- **Tabler**: el default literal es `'primary'`, y las series se separan por **opacidad del mismo hue**. Con 4 categorías eso es indistinguible.
- **Flowbite**: hexes escritos a mano en 5 lugares. Ya se les escaparon dos teales distintos (`#17B0BD` y `#16BDCA`) y un azul de dato (`#1A56DB`) que no coincide con su propio `primary-600` (`#2563eb`).
- **Horizon**: cuatro hexes de serie (`#6AD2FF`, `#5E37FF`, `#E1E9F8`, `#EFF4FB`) que **no existen** en su paleta, y `#4318FF` ≠ su `brand.500 #422AFB`. Dos azules de marca en dos archivos distintos, imposibles de retematizar.

Dos reglas operativas que salen de acá:
1. **El orden de las llaves del objeto ES el orden de asignación de series** (`colors[index % colors.length]`, Tremor). Se decide una vez y se congela: reordenarlo reordena todos los gráficos del producto.
2. **Una serie nunca se escribe como hex en el componente.** Se escribe como nombre, y una función lo resuelve. Eso es lo que hace que el dark mode salga gratis.

## Ley 5 — Dark mode: el CROMO se re-deriva, la TINTA DE DATO no se voltea

6 de 8.

- **Grafana**: rampa de 5 pasos por modo, y la de light es la de dark **corrida un paso hacia lo oscuro** — el `semi-dark-red` de dark (`#E02F44`) es literalmente el `red` primario de light.
- **shadcn**: bloques `:root` y `.dark` completos con valores distintos; los bordes pasan a **alpha** (`oklch(1 0 0 / 10%)`) en vez de un gris sólido; `--chart-1..5` son idénticos en ambos.
- **Tremor**: la tinta de dato de la librería no cambia; el cromo sí, clase por clase; y solo el color de marca sube un step (`bg-indigo-600 dark:bg-indigo-500`).
- **Flowbite**: series intactas, cambia solo el cromo (borderColor, labelColor, backgroundBarColors) — y el gradiente **invierte de dirección** (light `0.45→0`, dark `0→0.15`).
- **antpro**: todo el cromo escrito como `setAlpha(colorTextBase, x)` — menú seleccionado .04, hover .03, divisor .06. Al invertir `colorTextBase` de negro a blanco, la interfaz se invierte sola. Cero lista de hex paralela.
- **starter**: `--chart-1` se mantiene, `--chart-2` se ajusta levemente, y los tres **neutros se invierten** (0.72→0.56, 0.92→0.44, 0.56→0.92).

Disidente: Tabler usa los mismos hex y cambia solo superficies — el mismo `#066fd1` sobre `#fff` y sobre `#111827`.

Tres detalles que se copian tal cual:
- Bordes en oscuro → alpha, no gris sólido.
- El cromo se define como alpha sobre un único ink base.
- Los **neutros** de la rampa categórica sí se invierten; los hues cromáticos no.

## Ley 6 — La card respira más por dentro que por fuera

- shadcn: interior 24px, gap entre cards **16px**. Explícito.
- Tremor: card padding 24px; gap 24px **con borde**, y 56px **sin borde** — sacan el borde y triplican el aire.
- Tabler: card 16/20px, gutter 16px.
- starter: `--card-spacing: 16px` gobierna a la vez el padding horizontal, el gap vertical interno y el footer; gap entre cards 16px.
- antpro: card 16/24px, y gutter default **0** — la separación la hace un divisor de 1px.
- Grafana: panel padding 8px, gap 8px.

Regla: **gap entre cards ≤ padding interno de la card**. Si la card no tiene borde, el gap sube a 3× para que el aire haga de separador.

## Ley 7 — El padding lo ponen las SECCIONES de la card, no la card

Así el gráfico y la tabla pueden sangrar a ancho completo sin pelear con el padre.

- **shadcn**: la Card tiene `paddingLeft: 0`; son `CardHeader` / `CardContent` / `CardFooter` los que ponen `px-6`. La DataTable no recibe padding del padre: se lo pone ella misma por dentro.
- **Tabler**: el caso extremo y el mejor. El sparkline va **fuera** del `.card-body`, como hermano directo dentro de `.card` — full-bleed, 96px de alto, borde inferior a 1px del borde de la card. Es lo que hace que el KPI se vea denso sin apretar el texto.
- **starter**: un solo token (`--card-spacing`) aplicado por sección.
- **antpro**: `body padding: 0` cuando hay `split`.

## Ley 8 — El KPI lleva sparkline SIN cromo, o dos renglones de texto. Nunca un mini-chart con ejes

- Con sparkline: Tabler (96px, `sparkline:{enabled:true}`, tooltip **desactivado**), Flowbite (barras sin ejes, con riel gris de fondo), Tremor (`h-32` con `startEndOnly showYAxis={false} showLegend={false} autoMinValue`), Grafana (uPlot `lineWidth: 1`), Horizon (chart al lado, sin ejes).
- Sin sparkline: shadcn y starter lo reemplazan por el `CardFooter` de dos renglones — **veredicto** (`line-clamp-1`, peso 500, con icono de tendencia) + **contexto** (muted).

La línea narrativa es más barata que un mini-chart (cero librería, cero medición, cero altura variable) y comunica más: dice QUÉ pasó y CONTRA QUÉ se compara. Para un dueño de negocio boliviano vale doble: no lee una curva de 40px, lee una frase.

**Trampa que hay que evitar**: en shadcn esa frase está HARDCODEADA. Si el número sube y la frase dice "Down 20%", mentiste. Se deriva del mismo cálculo que produce el delta, en una sola función, o no se pone.

## Ley 9 — El swatch tiene la FORMA de la marca del dato, no un cuadrito

La coincidencia más específica del corpus: Tremor y Grafana, sin conocerse, llegaron casi al mismo píxel.

- **Tremor**: `h-[3px] w-3.5 rounded-full` = 3×14px. Un pedacito de línea. Clase **idéntica** en la leyenda y en el tooltip.
- **Grafana**: `SeriesIcon` = `width: 14px, height: 4px`, `borderRadius: pill`.
- **shadcn / starter**: indicador configurable `dot` (10px) / `line` (w-1) / `dashed` (border-dashed) — la forma sigue a la marca.

Leyenda, tooltip y gráfico se leen como el mismo sistema porque comparten forma, no solo color.

## Ley 10 — Se pliega por ancho de CONTENEDOR, no de viewport

3 de 8, pero es la ley emergente y la que resuelve un problema real de Onia.

- **shadcn**: `@container/main` en el wrapper y `@container/card` en CADA card. `@xl/main:grid-cols-2 @5xl/main:grid-cols-4` para el grid, `@[250px]/card:text-3xl` para que el valor crezca de 24 a 30px según el ancho de SU card, y `@[767px]/card` para cambiar un ToggleGroup por un Select.
- **starter**: idéntico.
- **antpro**: `QueryFilter` mide su propio ancho y elige columnas Y orientación de label juntas; los demos usan `RcResizeObserver` con umbral de 596px de contenedor.

Con la sidebar de 288px abierta o cerrada, o con un KPI metido en un panel angosto, la card se adapta a su contenedor. Es lo que evita mantener dos versiones de la misma tarjeta.

## Ley 11 — El estado nunca se comunica solo con color

- shadcn: icono + color + **palabra** (`IconCircleCheckFilled fill-green-500` + "Done").
- Tremor: el Tracker lleva `tooltip` con la palabra en cada bloque, y una leyenda de punto `size-2` + texto (Operational / Downtime / Maintenance).
- Tabler: color + icono + número con signo + texto para lector de pantalla.
- Grafana: thresholds nombrados + flecha.
- starter: signo + icono + copy del footer, **cero color**.

## Ley 12 — Los estados de carga / vacío / error son el agujero del corpus

**4 de 8 no tienen ninguno de los tres.** shadcn: cero skeleton, un `"No results."` pelado, cero error. Flowbite y Horizon: cero de los tres (grep de `animate-pulse|Skeleton|isLoading|No data` = 0). Tremor tiene 10 bloques de vacío pero ninguna carpeta Skeleton entre sus 39 componentes.

Los cuatro que sí lo resuelven (antpro, Grafana, starter, y el vacío de Tremor) convergen en tres decisiones:

1. **El skeleton copia las cotas del contenido real.** starter: `<Skeleton h-6 w-[160px]>` donde va el título, `h-5 w-[60px] rounded-full` donde va el badge, 12 barras dentro de un `h-[280px]`. Grafana: `<Skeleton width={96} height={28} />` para el número. Cero layout shift.
2. **La altura del contenedor vacío se RESERVA.** Tremor: `h-44` (176px) fijo con borde punteado. La card no salta cuando llegan los datos.
3. **Un error nunca se disfraza de "sin datos".** antpro re-lanza el error a propósito si no hay handler, con el comentario en el código: "si no se pasa ese método hay que relanzar el error, para no tragárselo".

Si se copia el look de shadcn/Flowbite/Horizon sin agregar los tres, se copia un agujero.

---

# 2. LA ANATOMÍA

Receta copiable. Los números son del corpus, ya elegidos para Onia.

## 2.1 Shell y grid

| Pieza | Valor | Ancla |
|---|---|---|
| Sidebar expandida | **288px** | Tremor `w-72`, shadcn `--sidebar-width: calc(spacing*72)`, Onia ya usa 288 |
| Sidebar colapsada (rail de iconos) | **48px** | shadcn `SIDEBAR_WIDTH_ICON: 3rem` |
| Sidebar en móvil (sheet) | **288px** | shadcn `SIDEBAR_WIDTH_MOBILE: 18rem` |
| Borde de la sidebar | `1px` + `margin-inline-end: -1px` | antpro: el borde no suma ancho al layout |
| Header | **56px FIJO y tokenizado** | antpro `heightLayoutHeader: 56` |
| Ancho máximo de contenido | **1440px** | Onia ya lo usa |
| Padding de página | **16 / 24 (≥768) / 40 (≥1200)** | shadcn `px-4 lg:px-6`, antpro `paddingInline: 40` |
| Gap entre cards | **16px** | shadcn, Tabler, Flowbite, starter |
| Ritmo vertical entre secciones | **16 móvil / 24 desktop** | shadcn `gap-4 py-4 md:gap-6 md:py-6` |

**Grid de KPIs** — por container query, no por viewport:
```
@container/main
1 col  →  @xl/main: 2 cols  →  @5xl/main: 4 cols
gap: 16px
```
Cada card abre su propio `@container/card`.

**Grid de charts** — NO todos del mismo tamaño. Uno primario ancho + secundarios:
```
grid-template-columns: repeat(7, 1fr)   /* desktop */
chart primario: span 4
chart secundario: span 3
```
(starter 4/7 + 3/7; Flowbite el hero a 2 de 3 columnas.) El error a evitar es `auto-fit minmax(280px, 1fr)`: le da a un donut de 4 categorías el mismo ancho que a una serie temporal de 6 meses.

El header de la fila de KPIs se estiliza **desde el padre**, no card por card:
```css
.kpi-row > [data-slot="card"] { box-shadow: 0 1px 2px rgb(0 0 0 / .05); }
```
Un lugar para cambiar el skin de las 4 tarjetas.

## 2.2 Tipografía

**Una sola familia.** 7 de 8 referencias usan una (Geist, Inter, DM Sans). Onia usa Archivo, y está bien: `--font-headline` y `--font-sans` apuntan al mismo archivo. La jerarquía sale de tamaño, peso y color — no de una segunda cara.

El único pairing que aparece en el corpus: **mono solo para las cifras del tooltip** (shadcn: `font-mono font-medium tabular-nums` dentro del tooltip, Geist en todo lo demás).

| Rol | px | peso | line-height | color | tabular |
|---|---|---|---|---|---|
| Cifra héroe (**una** por pantalla) | `clamp(46, 2rem+5vw, 68)` | **300** | 1 | fg | sí |
| Valor de KPI | **24 → 30** cuando la card ≥250px | 600 | 32 / 36 | fg | **sí** |
| Label de KPI | 13-14 | 400-500 | 20 | muted | no |
| Veredicto (pie, renglón 1) | 14 | 500 | 20 | fg | no |
| Contexto (pie, renglón 2) | 14 | 400 | 20 | muted | no |
| Delta | 12 | 500 | — | fg | **sí** |
| Título de sección / card | 16 | 600 | 24 | fg | no |
| Nombre de fila (tabla/lista) | 14 | 600 | 20 | fg | no |
| Valor de fila | 14 | 400 | 20 | fg | **sí** |
| Tick de eje | **12** | 400-500 | — | muted | sí |
| Tooltip: label de serie | 12 | 400 | — | muted | no |
| Tooltip: valor | 12 | 500 | — | fg | **sí + mono** |

Reglas duras:
- **El impacto sale del tamaño, no del peso.** La cifra héroe pesa 300 (Onia ya lo decidió, y Grafana nunca usa 600/700 — su `fontWeightBold` *es* 500).
- **Tamaños y line-heights múltiplos de 2.** Grafana tira excepción si no: `throw new Error('Font size and line height should be integer multiples of 2 to prevent issues with alignment')`.
- **Tracking negativo** (-0,01 a -0,03em) en todo lo ≥24px; `line-height: 1` en las cifras.
- **`font-variant-numeric: tabular-nums` en TODA cifra que se actualiza.** Sin eso, los dígitos bailan.

Ratios de Grafana, copiables tal cual aunque los tamaños sean fijos:
```
titulo   = min(valor * 0.7, 30px)     // nunca más del 70% del valor
delta    = max(valor / 2.5, 12px)     // piso duro de 12
icono    = max(valor / 3, 10px)
gap_delta= max(fuenteDelta / 3, 4px)
padding_card = altura > 100px ? 12 : 8
```

## 2.3 Tokens de color: dos ejes que no se tocan

**Eje A — CROMO.** Todo definido como alpha sobre un único ink base, para que el dark salga solo (antpro).
```
--ink-base            /* negro en claro, blanco en oscuro */
--fg          = alpha(--ink-base, .88)
--fg-muted    = alpha(--ink-base, .65)
--fg-subtle   = alpha(--ink-base, .45)
--border      = alpha(--ink-base, .12)   /* en oscuro: alpha sobre blanco, NO gris sólido */
--bg          /* fondo de página */
--surface     /* card — NUNCA igual a --bg */
--surface-2   /* elevated: tooltip, popover */
```
Prohibido un hex de gris dentro de un componente. Se hace cumplir por lint.

**Eje B — TINTA DE DATO.** Archivo aparte, que no sabe que la marca existe.
```
--serie-1 … --serie-6      /* tema categórico, 6 hues */
--serie-comp               /* gris: la comparativa nunca compite en saturación */
```
Onia ya los tiene: `globals.css:288-294` define `--chart-1..5` con dark en `372-376` y puente Tailwind en `763-767`. **Están muertos: cero componentes los consumen.** Encenderlos es la acción de mayor impacto/costo del plan.

Tres correcciones a esa paleta antes de encenderla:
1. `--chart-5: #ba1a1a` es un **rojo** dentro de una rampa categórica. Un rojo lee como "malo" aunque sea la serie 5. Tremor lo tiene pero su producto lo baja a la posición 8. Recomendación: sacarlo de la rampa y reservarlo para `--error`.
2. Falta un **sexto hue** (quedan 4 útiles tras sacar el rojo). El corpus usa 5-9.
3. `--chart-3: #013925` es verde muy oscuro. En dark necesita step propio (ley 5), no el mismo hex.

**Eje C — SEMÁNTICOS.** `--ok`, `--warn`, `--error`. Solo para estado de sistema. Nunca como tinta de serie, y nunca solos: siempre con icono + palabra (ley 11).

**Marca**: primera silla o ninguna. `--chart-1 = #027650` (el verde de Onia) en la posición 1 es exactamente el patrón Tremor: serie 1 = marca, series 2..n = categóricas. Está bien resuelto — falta consumirlo.

**Comparativa "vs período anterior"** — dos recetas, ninguna gasta un color:
- Tremor: `colors={['marca', 'gray']}`.
- Tabler: `stroke-width: [2, 1]` + `stroke-dash: [0, 3]` — actual sólida de 2px, anterior punteada de 1px. Dos números en el JSON.

## 2.4 Anatomía del KPI, elemento por elemento

**Cabecera — GRID de 2×2, no flex.** Es el truco que hace que la tarjeta no se rompa nunca.
```css
.kpi-header {
  display: grid;
  grid-template-rows: auto auto;
  grid-auto-rows: min-content;
  align-items: start;
  gap: 8px;
}
.kpi-header:has([data-slot="delta"]) { grid-template-columns: 1fr auto; }
[data-slot="delta"] {
  grid-column: 2; grid-row: 1; grid-row-end: span 2;
  align-self: start; justify-self: end;
}
```

1. **LABEL** — fila 1, col 1. 13-14px, 400-500, `--fg-muted`. Es el nombre, va arriba.
2. **VALOR** — fila 2, col 1. 24px → 30px vía `@[250px]/card`. Peso 600. `tabular-nums`.
3. **DELTA** — col 2, ocupa **las dos filas**. Chip `outline` neutro: `border: 1px solid --border`, `color: --fg`, 12px/500, alto 20px, radio pill, padding `2px 8px`, gap 4px, icono 12px.

   El `grid-row-end: span 2` es lo que evita que un valor largo (`Bs 1.250.000,00`, más largo que `$1,250.00`) empuje el chip fuera. Sin `absolute`, sin `ml-auto`. Y la columna extra aparece **sola** cuando hay chip: la misma card sirve con y sin delta.

**Pie — dos renglones, `gap: 6px`, 14px.**

4. **VEREDICTO** — `line-clamp: 1`, peso 500, con el mismo icono de tendencia a 16px. *"Subió respecto de la semana pasada"*.
5. **CONTEXTO** — `--fg-muted`. *"Cobros de los últimos 7 días"*.

Los dos renglones se **derivan** del mismo cálculo que produce el delta. Una función, un `switch`. Si no se puede derivar, no se pone.

**Opción excluyente con el pie de dos renglones:**

6. **SPARKLINE full-bleed** — hermano del cuerpo con padding, **no hijo**:
   ```html
   <div class="card">
     <div class="card-body">label · valor · delta · frase</div>
     <div id="chart-x"></div>   <!-- hermano -->
   </div>
   ```
   96px de alto (≈41% de una card de 234px), aspect ≈3,2:1, borde inferior a 1px del borde de la card, **sin ejes, sin tooltip, sin leyenda**.

**Densidad medida del KPI**: card 310×234px a 1440, card compacta con icono 74px (`avatar 40 + 16*2 + 2 de borde`).

## 2.5 Charts, con números

**Reglas generales**
| Qué | Valor |
|---|---|
| Eje Y | no existe. Si se enciende: ancho **fijo 56px** (alinea las cards de una fila) |
| Línea de eje / ticks | apagados |
| Gridlines | solo horizontales, 1px, `color-mix(in oklab, var(--border) 50%, transparent)` |
| Tick X | 12px, `--fg-muted`, `tickMargin: 8`, **`minTickGap: 32`** |
| Densidad de ticks Y | 1 cada **30px** de alto; 1 cada 15px si el panel mide <150px |
| Dominio Y | arranca en **0** por default. `autoMinValue` es opt-in, solo para comparación relativa |
| Altura chart primario | **250-320px** |
| Altura mini-chart en KPI | **128px** |
| Altura sparkline full-bleed | **96px** |
| Altura sparkline inline | **40×112px** |
| Animación al montar | **apagada**. Solo anima el tooltip (100ms) |

**Línea**
```
strokeWidth: 2, strokeLinecap: round, strokeLinejoin: round
type: "linear"            ← sin suavizado
dots: NO, salvo (a) la serie tiene un solo valor, (b) el punto está activo
punto activo: r=5, stroke = color del FONDO (recorta la línea, no la tapa)
hit-area: duplicar la serie con una línea transparente de strokeWidth 12
```
`linear` y no `smooth`: una curva monotone inventa valores intermedios que no existen. En un panel de plata eso es una mentira gráfica.

**Barras**
```
radio: 3-4px SOLO arriba (nunca las 4 esquinas)
gap: por stroke transparente de 5px  →  slot 21px = 16px visibles
columnWidth: 50%  (o 40px fijo)
apiladas: stackId común; percent: stackOffset "expand"
negativos: y += height; height = Math.abs(height)   ← NUNCA Math.max(v, 0)
```

**Área**
```
gradiente vertical: stop 5% opacity 1.0 → stop 95% opacity 0.1
segunda serie: mismo gradiente arrancando en 0.8
en dark el gradiente INVIERTE de dirección: opacityFrom 0 → opacityTo 0.15
```

**Donut**
```
innerRadius 30, cornerRadius 8, paddingAngle 4    ← separación entre segmentos
o: stroke del color de la card entre arcos
el agujero NO va vacío: el total va al centro
todos los valores en 0 → estado vacío, no un anillo gris solo
```

**Gauge radial** (Grafana, SVG puro, sin librería)
```
arco de 220°: ARC_START 250 → ARC_END 110    (no 180 ni 270)
círculo completo se dibuja a 359.99° (360 no renderiza)
barWidth = max(barWidthFactor * (radio/3), 2)   ← función del radio, nunca px fijo
track = emphasize(fondoDelPanel, 0.07)          ← derivado, no un gris hardcodeado
texto central: maxValueHeight = 0.82 * radio^0.86   ← el exponente evita que explote
nombre: 0.45 * radio^0.86 en --fg-muted; unidad al 70% del valor
```

**Tooltip**
```
cursor: false en la marca
crosshair: SOLO en el chart primario y SOLO si es multi-serie
  línea vertical 1px punteada (dashArray 10) en línea/área
  banda tenue (fill gris, opacity 0.15) en barras
position: { y: 0 }         ← clavado arriba, no sigue el mouse en Y: nunca tapa la curva
offset: 20
caja: radio 8-10, border 1px --border al 50%, bg --surface-2, sombra, 12px
      padding 10px/6px, min-width 128px, gap 6px entre filas
header: separado por border-b, label en peso 500
fila:  swatch + nombre en --fg-muted a la izquierda
       valor a la derecha en font-mono + tabular-nums, peso 500
       separación mínima etiqueta↔número: 32px
se filtran las series técnicas (type === 'none')
```

**Swatch** (leyenda Y tooltip, misma clase): `width: 14px; height: 3px; border-radius: 9999px`.

**Modo por chart**, no global — enum explícito (Grafana): `xOne` (la serie más cercana), `xAll` (todas las de esa X), `xyOne` (scatter/heatmap).

## 2.6 Densidad — la tabla completa

| Qué | px |
|---|---|
| Padding de card | **20** (24 si lleva chart) |
| Padding de card compacta | 12-16 |
| Gap entre secciones DENTRO de la card | 24 |
| Gap del header de KPI | 8 |
| Gap del pie de KPI | 6 |
| **Gap entre cards** | **16** |
| Ritmo vertical de página | 16 / 24 (≥768) |
| Padding de página | 16 / 24 / 40 |
| Radio de card | 12 |
| Radio de chip | pill |
| Radio de barra de chart | 3-4, solo arriba |
| Borde | 1px |
| Sombra de card | `0 1px 2px rgb(0 0 0 / .05)` — o ninguna |
| Sombra en dark | **ninguna** (Horizon: `dark:shadow-none` en todo) |
| Header de tabla | 48 (`py 14` + 20 de línea) |
| Fila de tabla | 52 (`p 16` + 20) |
| Separador de tabla | `divide-y` por FILA, no border por celda |
| Toolbar de tabla | 64 de alto, `padding-inline: 24` |
| Barra de progreso | 8 (6 dentro de un KPI) |
| Tracker de estado (90 días) | 32 de alto, bloques con `padding-inline: 0.5px`, radio 1px interno, 4px en los extremos |
| Item de sidebar | 40 de alto, `padding: 6px 8px`, radio 8, gap 2 entre items, 40 entre grupos |

**Escala de espaciado — 10 valores, nada fuera de la lista:**
`4 · 6 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 56`

**Escala de radios — derivada de UNO** (shadcn):
```
--radius: 10px
--radius-sm: calc(var(--radius) * .6)   /* 6  */
--radius-md: calc(var(--radius) * .8)   /* 8  */
--radius-lg: var(--radius)              /* 10 */
--radius-xl: calc(var(--radius) * 1.4)  /* 14 */
```

**Alternativa enterprise a los gaps** (antpro): gutter 0 + divisor de `1px solid --border` entre columnas, `body padding: 0`. Se ganan ~40px de ancho útil por fila de KPIs y las métricas quedan en una banda continua alineada en vez de tarjetas flotando. Es lo que hay que usar cuando entran más de 4 métricas en una fila.

## 2.7 Estados

**SKELETON — isomorfo, con cotas explícitas**
| Pieza | Skeleton |
|---|---|
| Título de card | `h-6 w-[160px]` |
| Badge / delta | `h-5 w-[60px] rounded-full` |
| Descripción | `h-4 w-[150px]` |
| Valor de KPI | `h-7 w-[96px]` |
| Label de KPI | `h-4 w-[72px]` |
| Sparkline | `h-[56px]` |
| Chart | contenedor `h-[280px]` con 12 barras de altura variable |
| Fila de lista | `h-9 w-9 rounded-full` + `w-[120px]` + `w-[160px]` + `ml-auto w-[80px]`, `space-y-8` |

- Bloques de texto con anchos **deliberadamente irregulares** para que parezca texto y no una barra (antpro, sobre grid de 24: `22 / 8+15 / 6+18 / 13+9 / 4+3+16`).
- Shimmer: `linear-gradient(90deg, alpha(.06), alpha(.04), alpha(.06))` con `background-size: 600% 600%`, animado 1,4s.
- **Delay de 300ms antes de mostrarlo.** Si la respuesta llega en menos, el usuario nunca ve el loader (Grafana `DEFAULT_ANIMATION_DELAY`, con el comentario textual en el código).
- Barra de carga alternativa: 1px de alto pegada arriba del panel, 28% de ancho, gradiente `transparent → accent → transparent`, movida con `transform: translateX()`, duración `clamp(round(ancho*2.4), 500, 4000)` ms.
- Respetar `prefers-reduced-motion` con dos bloques, no uno.

**VACÍO**
```
altura del contenedor: RESERVADA (176px o la altura real del chart)
borde: PUNTEADO  ← distingue "contenedor vacío" sin escribirlo
icono: el que representa lo que faltaría, 28px, --fg-subtle
título: 14px / 500 / --fg
segundo renglón: 14px / --fg-muted, dice CUÁNDO se llena ("Puede tardar 24 h"), no solo que está vacío
el KPI se muestra IGUAL con "0" — el cero ES el dato
celda vacía en tabla: "—", nunca blanco
```
Onia ya distingue **"cero" de "no hay dato"** en `/admin/metricas:80-83`. Ninguna de las 8 referencias lo hace. Eso es una decisión de diseño de datos superior al corpus: se mantiene y se porta al panel principal.

**ERROR**
```
boundary POR SECCIÓN, no por página
cada sección con su propio retry:
  startTransition(() => { router.refresh(); reset() })
  botón disabled mientras corre + spinner
  <span role="status" aria-live="polite" class="sr-only">
un error NUNCA se disfraza de "sin datos":
  si el fetch falla y no hay handler, se re-lanza a propósito
```

## 2.8 Accesibilidad — lo que el SVG rompe

- **`role="img"` + `aria-label` en el `<svg>` PODA los hijos del árbol de accesibilidad.** Los `<title>` de cada barra, punto y arco quedan inalcanzables: el lector oye el título del gráfico y **ningún valor**. Si se pone el `role`, hay que dar una `<table class="sr-only">` con los datos.
- Los `<title>` no sirven en táctil ni con teclado: el chart queda mouse-only. Puntos focalizables con `tabindex` o tabla alternativa.
- **IDs de `<defs>` únicos por instancia.** Un `id` fijo duplica IDs cuando hay dos charts con la misma trama.
- Contraste de bordes de componente: **3:1** (WCAG 1.4.11). Un borde a 1,3:1 no existe.
- `:focus-visible` en todo lo interactivo; targets ≥44px.
- `role="status"` es una live region: **no** se usa para contenido estático (un empty state con `role="status"` se anuncia en cada carga).

---

# 3. LA BRECHA

Qué le falta al admin de Onia HOY contra esa anatomía, en orden de impacto visible.

### 3.1 Onia Platform (`onia-platform`, no es nuestro carril)

**1. Tres dashboards y dos gramáticas visuales.** `dashboard/page.tsx:139-144` bifurca por rubro. Comercio e importadora usan tarjetas (`.dv2-card`, grid de 12, sombras); el clínico usa el sistema editorial (sin cajas, hojas restadas con `border-top` de pelo). Los dos conviven en el mismo stylesheet: `dashboard-v2.css` líneas 15-727 son el mockup de tarjetas del 02-08, líneas 728-1336 el rediseño editorial del 17-08 que nunca se aplicó a los otros dos. **Ninguna de las 8 referencias tiene dos gramáticas.** El producto se ve como dos productos.

**2. La tinta de dato ES la marca, y el tema categórico está muerto.** `dashboard-v2.css:24-31` mapea ocho acentos a la escala verde; `381-383` asigna un paso distinto de verde a cada fila del desglose de métodos de pago (`:nth-child(2)`→mid, `(3)`→low, `(4)`→lower). Con 4 métodos eso es indistinguible — es exactamente el error de Tabler. Y `globals.css:288-294` define `--chart-1..5` con contrapartida dark (`372-376`) y puente Tailwind (`763-767`): **cero componentes los consumen**. Viola la ley 4 y la regla propia de Onia del commit `03a892f6`.

**3. El panel del rubro que hoy está vendido no tiene delta.** Ninguno de los 4 KPIs clínicos compara contra período anterior. Lo más cercano (*"el jueves pasado Bs 1.200"*, `page.tsx:656-664`) vive SOLO en la rama `protagonista === "cobros"`: cuando el consultorio tiene citas — o sea casi siempre — la comparación desaparece entera. 8 de 8 referencias tienen delta. Y **comercio ya lo tiene construido** (`comercio-hoy.tsx:247-259`: chip con flecha SVG y % vs el mismo día de la semana pasada). Portar cuesta menos que inventar.

**4. Un solo gráfico, y condicional.** El clínico tiene el `Barcode` y solo si hubo cobros (`page.tsx:609`, `hayBarras`). Cuando el protagonista es la agenda y no hubo plata, el panel entero no tiene un píxel de gráfico. El `Sparkline.tsx` existe (73 líneas, SVG puro) y solo lo importa `comercio-hoy.tsx:267`.

**5. Cero skeleton en todo el producto.** Un solo `animate-pulse` en `app/` y `components/`: `RealtimeBadge.tsx`. El panel es 90% server component con 12 queries en paralelo (`page.tsx:174-242`) → logo que gira, después contenido, sin transición de forma. Los cuatro del corpus que lo resuelven bien usan skeleton isomorfo.

**6. Sin `error.tsx` dentro de `(dashboard)`.** Un fallo tumba la pantalla. El `SentryErrorBoundary` (`LayoutShell.tsx:91-93`) salva el shell, pero el estado que ve el usuario no está diseñado ni contextualizado. starter tiene un `error.tsx` **por slot** con retry propio.

**7. Bug de tema real.** `globals.css:123-175` reescribe `green-*`, `emerald-*`, `gray-*` y `slate-*` con los valores de Onia, pero **solo dentro del `@theme` claro**; el bloque `.dark` (`313`) no las redefine. Consecuencia visible: las tarjetas de `/reports:381, 408, 417` (`bg-green-50`, `bg-verde-50`, `bg-amber-50`) siguen siendo `#EDFBF3` y `#FFFBEB` en oscuro — cinco tarjetas casi blancas sobre `#0C110F`. Y `amber/blue/sky/indigo/yellow/red` nunca se remapearon: son Tailwind crudo, hues que no existen en la marca. `/reports:560` elige series a mano fuera de la paleta.

**8. 26 secciones, 63 `page.tsx`, y ningún índice.** Sidebar plana sin grupos, sin acordeones, sin separadores (`Sidebar.tsx:91-126`). El dental muestra 18 ítems de ~48px: en un portátil de 768px el usuario **scrollea la nav**. Cero command palette (grep de `cmdk`, `⌘K`, `Ctrl+K` = 0). El buscador del header busca **registros**, no pantallas. Breadcrumbs solo en `/admin`, que es la única superficie que responde "dónde estoy". antpro resuelve esto con tres niveles (grupos de menú + `tabList` en el PageContainer + tabs dentro de la card); Tremor con `space-y-10` entre grupos.

**9. `Sidebar.tsx:94-95` marca dos ítems activos a la vez.** `pathname.startsWith(item.href)` con `/billing` y `/billing/recurring` en la misma lista: estar en el hijo enciende los dos. Es la única jerarquía padre/hijo de la nav y está rota.

**10. Rutas huérfanas.** `/requerimientos` **no tiene un solo `href` que apunte a él en todo el repo**: pantalla construida e inalcanzable. `/pending` solo se alcanza desde 5 enlaces dentro del dashboard; si el usuario navega a otra pantalla pierde la puerta.

**11. `tabular-nums` solo en el panel clínico** (4 lugares, bien hecho). `/reports`, `/admin` y `/admin/metricas` no lo tienen: los dígitos bailan al actualizarse.

### 3.2 Template de web-factory (`packages/templates/src/dashboard.ts`, nuestro carril)

**1. La fuente nunca carga.** `renderDashboardDocument:638-655` no emite ningún `<link>` a fuentes; `store.ts:232` y `landing-realestate.ts:236` sí. El dashboard renderiza entero en la fuente del sistema — **todas las decisiones tipográficas son teóricas**.

**2. En claro las tarjetas son invisibles.** `--card: client.colores.bg` → la card tiene exactamente el color de la página. Lo único que la separa es un borde a **~1,3:1**, contra los 3:1 que pide WCAG 1.4.11. El sidebar está a 1,07:1. Contagio: las gridlines usan ese mismo `--border`, y el track del donut es un anillo de 22px que no se ve. **El sistema de capas existe solo en dark.**

**3. El mismo número tiene dos colores en charts contiguos.** Barras y sparkline pintan con `--color-primary`; línea multi-serie y donut con `--wf-series-*`. En el fixture los mismos seis valores aparecen en verde marca en el chart de barras y en aqua en la serie "Real" del de línea. Viola la ley 4 en el propio demo.

**4. Los negativos se dibujan como cero.** `Math.max(value, 0)` en tres lugares (`410`, `424`, `450`) mientras el `<title>` sigue mostrando el número real. Un reembolso, un churn o un delta negativo se aplasta. No es una limitación: es una mentira silenciosa sobre el dato.

**5. Series de más de ~58 puntos se recortan sin aviso.** Una serie diaria de 90 días pierde la cola fuera del `viewBox`.

**6. Eje siempre desde 0, 3 ticks, `niceMax` grosero.** 340 → eje a 500 (32% del plot muerto). Cualquier ratio 0-1 rompe el eje ("0 / 1 / 1").

**7. El último label del eje X desaparece.** `index % step === 0` con n=10 y step=2 deja el índice 9 —el punto más reciente— sin etiquetar.

**8. Cero `:focus-visible` y tres `:hover` en 590 líneas de CSS.** Ninguno en filtros, CTA, KPI, cards ni marcas de chart. Targets de 36-38px.

**9. Uniformidad total**: `.wf-chart-card`, `.wf-dash-table` y `.wf-list-card` comparten literalmente padding, borde, elevación y radio. Y a la vez conviven 6 radios (`9/10/7/3/999/var(--radius)`) y 11 valores de espaciado sin escala.

**10. Los tests actuales verifican presencia, no apariencia.** `tests/e2e/dashboard.spec.ts` es `toBeVisible` y `count > 0`: los diez defectos de arriba pasan todos los gates en verde.

---

# 4. EL PLAN

## 4.1 Carril web-factory (nuestro, un solo archivo + fixture)

**W1 — Desbloquear lo visual. Sin esto, nada de lo demás se ve.**
- Emitir el `<link>` de fuentes en `renderDashboardDocument` (copiar el patrón de `store.ts:232`).
- `--card ≠ --bg` en claro: derivar `--card` como `color-mix(in oklab, var(--color-fg) 3%, var(--color-bg))` o blanco puro; subir `--border` hasta ≥3:1 medido.
- `font-variant-numeric: tabular-nums` en `.wf-kpi-value`, deltas, celdas numéricas y valores del tooltip.
- **Hecho =** captura del fixture en claro y oscuro, a 1440 y 375, **mirada**. No un test de presencia.

**W2 — Un solo color por dato.** Barras y sparkline pasan a `--wf-series-1`; `--color-primary` deja de ser tinta de dato. Son 4 líneas (`428`, `548`, `553`, `950`). Agregar `--wf-series-comp` gris + `strokeWidth 1` + `dasharray 3` para la comparativa.

**W3 — Bugs de dato (los que mienten).**
- Sacar los tres `Math.max(value, 0)`; dibujar negativos con baseline en 0 (`y += height; height = Math.abs(height)`).
- Etiquetar SIEMPRE el último punto del eje X (`index % step === 0 || index === n-1`) y aplicar `minTickGap: 32`.
- Series largas: agrupar o avisar. Nunca recortar en silencio.
- `niceMax` con pasos 1/2/2.5/5 y ticks calculados por altura (1 cada 30px), no 3 fijos.

**W4 — Los defectos visuales.**
- `rx` solo arriba en barras; gap por stroke transparente de 5px.
- Donut con `paddingAngle: 4` y el total en el centro.
- Unificar `renderSparkline` y `renderKpiSpark` en una función con dos parámetros; sacar `preserveAspectRatio="none"` (hoy deforma el trazo un 25% y convierte el punto final en elipse).
- Swatch de 14×3px pill, misma clase en leyenda y tooltip; una sola posición de leyenda.
- `:focus-visible` en filtros, CTA, nav y cards clickeables; targets 44px.
- Sufijo por instancia en los IDs de `<defs>`.
- Escala de espaciado de 10 valores; radios derivados de uno.
- `span` por chart: uno primario (4/7) + secundarios (3/7).

**W5 — Los estados que no existen.** `renderSkeleton()` isomorfo con las cotas de 2.7; estado de error de sección con retry; estado vacío con altura reservada, borde punteado y segundo renglón que diga CUÁNDO se llena; política de vacío coherente en las 5 superficies (KPIs, chart, sección, listas, tabla).

**W6 — Gates que hoy no existen.**
- Screenshot del fixture guardado y comparado (claro/oscuro × 1440/375).
- `axe` sobre el fixture.
- Un test que falle si aparece `var(--color-primary)` en un `fill` o `stroke` de dato.
- Un test que falle si un valor negativo se dibuja con altura 0.

**Y el fixture**: dejar de duplicar el mismo dataset en barras y línea (hoy cualquier captura del demo se ve redundante), y meter **un punto negativo, un cero y una serie de 90 puntos** — para que los bugs se vean en el demo en vez de esconderse.

## 4.2 A coordinar con el carril de onia-platform (no es nuestro)

Ordenados por impacto visible sobre costo:

| # | Acción | Costo | Archivos |
|---|---|---|---|
| **O1** | **Consumir `--chart-1..5`.** Reemplazar los 4 pasos de verde del desglose de pagos por 4 series categóricas. Antes: sacar el rojo de la rampa, agregar un 6º hue, dar step propio a `--chart-3` en dark, y validar ΔE entre los hues | 1 archivo CSS, 3 selectores | `dashboard-v2.css:381-383`, `globals.css:288-299` |
| **O2** | **Portar el delta al panel clínico.** Copiar la mecánica de `comercio-hoy.tsx:247-259` a la `<Cell>`. Chip **neutro** con flecha (regla de Onia: el color no lleva significado solo). El hint se **deriva** del mismo cálculo, no se hardcodea | ya existe, se porta | `page.tsx:95-116` |
| **O3** | **Arreglar el bug de tema.** Redefinir las escalas remapeadas dentro de `.dark`; sacar los hues crudos de `/reports:560` y `:291-296` | medio | `globals.css:123-175, 313` |
| **O4** | `error.tsx` dentro de `(dashboard)` y por sección grande, con retry y `aria-live` | bajo | nuevo |
| **O5** | Skeleton isomorfo del panel (hero + tira + hojas) que reemplace el spinner. El `BrandLoadingScreen` queda para la transición de sesión, no para el panel | medio | `(dashboard)/loading.tsx` |
| **O6** | Sparkline o Barcode **incondicional** en el panel clínico. Si no hubo cobros, la barra se dibuja en cero — lo dice el propio comentario de `Barcode.tsx:36`: *"un hueco también es información"* | bajo | `page.tsx:609-620` |
| **O7** | Activo exacto en la sidebar (o `startsWith` con separador) + grupos de nav | bajo | `Sidebar.tsx:94-95` |
| **O8** | Decidir `/requerimientos`: se enlaza o se borra. "Construido ≠ terminado" | trivial | — |
| **O9** | **Unificar las dos gramáticas.** Recomendación: gana el sistema editorial (`dashboard-v2.css:728-1336`), que es el calibrado y el aprobado; comercio e importadora se portan a él. Es un frente grande | **carril propio** | `dashboard-v2.css` entero |

O9 no se cuelga de ninguna otra tarea: es una sesión con su objetivo. Y aplica la regla — una superficie viva no se reemplaza sin que Sergio VEA la pieza terminada.

---

# 5. LO QUE NO SE PUDO VERIFICAR

Explícito, para que nadie ejecute sobre una suposición.

1. **No abrí el admin de Onia renderizado en esta sesión.** Todo lo de la sección 3.1 sale del diagnóstico que me pasaron, que cita archivo y línea, no de una captura mía. La regla de Onia es que verificar es MIRAR: **antes de ejecutar O1-O9 hay que abrir `/dashboard` en claro y oscuro, a 1440 y a 375, y leer la captura.** En particular el punto 7 (tarjetas casi blancas en oscuro en `/reports`) es una deducción de leer CSS, no una foto.

2. **No medí el contraste de `--chart-3 #013925` sobre el fondo oscuro de Onia,** ni el ΔE entre los cinco hues de la paleta. Nuestro template de web-factory SÍ validó su tema de 6 hues con ΔE (`dashboard.ts:336-350`); la paleta de `onia-platform` **no tiene esa validación registrada**. Correrla es prerrequisito de O1, no un extra.

3. **Los px de las 8 referencias vienen de sus fichas.** Cuatro (shadcn, Tabler, Flowbite, Horizon parcial) fueron medidas en navegador por el agente que las hizo, y el crítico **no pudo reproducir esas mediciones** sin ese navegador — son aritméticamente consistentes con el código, pero no auditadas. Las otras cuatro (Tremor, antpro, Grafana, starter) son **100% lectura de código fuente: cero píxeles medidos en pantalla**. Cuando doy un número, es el número del código; el render puede diferir.

4. **Errores conocidos de las fichas que el crítico marcó y que por eso NO uso como ley:**
   - Tabler dark: la evidencia era falsa (miró 1 de 3 bloques `[data-bs-theme=dark]`); la conclusión aguanta pero el método no.
   - Horizon: `legend.show:false` **no** está en los tres charts — el de barras diario no la apaga.
   - Flowbite: "cada chart tiene `getXOptions()` y escucha el evento" es falso para 2 de 5 charts.
   - Grafana: `blueDarkMain` es `#3d71d9`, no `dc`.
   - shadcn: "ninguna variante `destructive` usada en el block" es falso (hay dos).

5. **Grosores de línea sin confirmar**: shadcn no pasa `strokeWidth` a sus `<Area>` (hereda el default de Recharts 3.8.0) y Horizon tampoco al `LineChart`. Los `strokeWidth: 2` de la anatomía vienen de Tremor y Grafana, que sí lo declaran.

6. **No corrí el template de web-factory ni saqué la captura del fixture.** Los defectos D-1 a D-14 vienen de la auditoría que me pasaron, con número de línea. Los tests actuales no pueden detectarlos, así que **la captura es el primer paso de W1**, no el último.

7. **La ubicación del doc** (`web-factory/data/references/design-sources/`) la elegí por el hermano `2026-08-29-como-se-hacen-las-webs.md`. No está confirmada como convención acordada para esta familia de docs.
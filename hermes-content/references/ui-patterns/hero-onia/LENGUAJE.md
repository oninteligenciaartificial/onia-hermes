# Lenguaje visual Onia — lo aprobado, medido en el código

Fuente única de forma y color para quien diseñe un hero o una pieza de venta de Onia.
Todo lo de acá está **leído del código**, no recordado. Donde no encontré un valor,
dice "no encontrado".

## Qué es "lo aprobado" y dónde vive hoy

Sergio aprobó la **landing v3** el 2026-08-21 (*"me encanta el diseño"* / *"Sí, reemplaza
la actual"*), después de rechazar entera la v2. Fue la primera que aprobó.

**La v3 ya NO está en `/preview`.** El commit `7f0e6d97` (2026-08-21) la sacó de ahí y la
puso en la raíz de la venta. Hoy vive en el grupo de rutas `(sitio)`:

| Qué | Ruta absoluta |
|---|---|
| CSS de la v3 (1.802 líneas) | `web-factory/apps/onia-platform/src/app/(sitio)/sitio.module.css` |
| Hero (el `h1` real) | `web-factory/apps/onia-platform/src/app/(sitio)/page.tsx` línea 264 |
| Cromo (header/footer) | `web-factory/apps/onia-platform/src/app/(sitio)/ui.tsx` |
| Tokens del sistema (landing) | `web-factory/apps/onia-platform/src/app/globals.css` |
| Tokens del sistema (producto) | `onia-platform/app/globals.css` (bloque `@theme`) |

`sitio.module.css` es el renombre literal de `preview.module.css`; su cabecera todavía
dice "PREVIEW (v3)". Buscar `/preview` en el repo no devuelve nada: la carpeta no existe
y `next.config.ts` la redirige 308 a `/`.

---

## 1. Paleta — qué es cada color

### Escala verde (idéntica en landing y producto)

Vive en `globals.css` de la landing como `--verde-*` y en el producto como
`--color-verde-*`. **Los diez valores son los mismos**; sólo cambia el prefijo del
nombre.

| Token | Hex | Para qué sirve realmente |
|---|---|---|
| `--verde-50` | `#EDFBF3` | fondo de nota "ok" |
| `--verde-100` | `#D5F4E3` | `--accent-soft`: pastilla clara |
| `--verde-200` | `#B2EACD` | — |
| `--verde-300` | `#86D9B0` | **texto verde SOBRE bloque oscuro** (7,79:1 sobre verde-900) |
| `--verde-400` | `#4DBD8C` | acento del tema oscuro (existe, apagado) |
| `--verde-500` | `#089868` | `--accent`: **formas, no texto** — 3,54:1 sobre papel, falla AA |
| `--verde-600` | `#027650` | `--ok`; en el producto es `--color-primary` |
| `--verde-700` | `#016141` | `--accent-ink`: **el verde que sí se puede leer** (7,25:1 sobre papel) |
| `--verde-800` | `#004D32` | — |
| `--verde-900` | `#013925` | `--green-deep`: **bloque verde profundo**, el fondo de sección |

### Los cuatro roles que definen el hero

| Rol | Token | Hex | Qué es |
|---|---|---|---|
| **Papel** | `--bg` | `#F9FBFA` | El fondo. Blanco con sesgo verdoso imperceptible. Nunca `#fff` puro de fondo de página. |
| **Papel hundido** | `--bg-deep` | `#F3F5F4` | Segunda superficie clara. El cambio papel→papel-hundido es lo que separa dos bloques claros seguidos, sin línea ni sombra. |
| **Tinta** | `--ink` | `#141A17` | Texto sobre papel. 16,98:1. Nunca `#000`. |
| **Tinta bloque** | `--tinta` | `#12100e` | Fondo del bloque oscuro (`.ink`). Es un token distinto de `--ink` y ligeramente más cálido. |
| **Verde señal** | `--senal` | `#00d26a` | **El verde de las FORMAS y del CTA.** Fondo del botón, rectángulo de la composición, punto del kicker. |

Tintas secundarias: `--ink-soft #424A46` (8,79:1), `--ink-faint #69716D` (4,83:1, piso de
AA), `--line #D4D9D6`, `--line-soft #E2E5E3`.

En el CSS de la v3, `.page` renombra los tokens de `globals.css` a nombres locales:
`--paper`→`--bg`, `--ink-block`→`--tinta`, `--green-deep`→`--verde-900`,
`--green-mid`→`--verde-700`, `--signal`→`--senal`. **No son colores nuevos**: son alias.

### Las cinco superficies (esto ES el sistema)

La v3 no tiene "tarjetas": tiene **bloques de página entera**, cada uno con su par
texto/fondo ya resuelto. La profundidad es el cambio de tono entre bloques consecutivos.

| Clase | Fondo | Texto | Contraste medido |
|---|---|---|---|
| `.paper` | `#F9FBFA` | `--ink #141A17` | 16,98:1 |
| `.paperDim` | `#F3F5F4` | `--ink` | ≈16,6:1 |
| `.ink` | `#12100e` | `#edf1ef` | 16,66:1 |
| `.green` | `#013925` (verde-900) | `#eafaf1` | 12,05:1 |
| `.signalBlock` | `#00d26a` (señal) | `--tinta #12100e` | **9,43:1** |

El `.signalBlock` es la pieza más delicada del sistema: verde señal a página completa,
**con texto oscuro**. Ahí el botón se invierte (fondo tinta, texto blanco) y los links van
en tinta, no en verde.

---

## 2. Tipografía

**Dos familias en todo el sistema, ni una más.** Se cargan con `next/font/google` en
`src/app/layout.tsx`.

| Rol | Familia | Dónde se usa |
|---|---|---|
| `--font-display` / `--font-sans` | **Archivo** (variable, eje `wdth`) | absolutamente todo |
| `--font-mono` | **Geist Mono** | sólo micro-etiquetas ≤12px MAYÚSCULA (`.kicker`, `.mono`) |

La jerarquía sale del **tamaño y del eje `wdth`**, nunca de sumar familias. Archivo va a
ancho normal (`font-stretch: 100%`) — el corte condensado 800/76% fue rechazado
explícitamente por Sergio.

### Pesos reales que usa la v3

- Cuerpo de página: **450**
- Display / h2 / h3: **550**
- Botones y links: **600**
- Wordmark: **600**
- Techo del sistema: **650** (el `.display` global de `globals.css`). Ninguna pieza pasa de ahí.

### La escala del hero, en números

El hero **no usa `clamp()`**. La v3 ancla el ritmo a **un solo `font-size` en `.page`** y
escribe todo lo demás en `em`. `grep clamp( sitio.module.css` devuelve **cero** ocurrencias
fuera del comentario de cabecera.

| Breakpoint | `.page` font-size | `.display` (em) | Título del hero en px | line-height | letter-spacing |
|---|---|---|---|---|---|
| < 768px | 16px | 3.1em | **49,6px** | 0.95 | -0.02em |
| ≥ 768px | 17px | 3.9em | **66,3px** | 0.90 | -0.02em |
| ≥ 1280px | 18px | 4.6em | **82,8px** | 0.86 | -0.025em |

Un breakpoint más cambia el tamaño del título, del aire de sección y de los gaps **a la
vez y en proporción**, porque todos están en `em`. Ese es el mecanismo.

Resto de la escala (en `em`, sobre el mismo ancla):

| Clase | Tamaño | line-height | Tope de ancho |
|---|---|---|---|
| `.display` | 3.1 / 3.9 / 4.6em | 0.95 / 0.9 / 0.86 | `max-width: 15ch` |
| `.h2` | 2.1em → 2.5em (≥768) | 1 → 0.95 | `18ch` |
| `.h3` | 1.3em | 1.05 | — |
| `.lead` | 1.15em | 1.45 | `30em` |
| `.body` | 1em | 1.55 | `42em` |
| `.note` | 0.9em | 1.5 | `60ch` |
| `.kicker` | 0.8em, mono, `letter-spacing: 0.14em`, uppercase | — | — |

`.display` lleva `text-wrap: balance`; `.lead`, `.body` y `.note` llevan `text-wrap: pretty`.

**La palabra destacada dentro del display se resalta con COLOR, nunca con una quinta
fuente ni con un peso mayor**: `.display em` → `--accent-ink` (verde-700) sobre papel,
`--verde-300` sobre bloque oscuro, `#fff` sobre el bloque señal.

---

## 3. Radios y espaciado

### Un solo sistema de radios

```
--r-block: 1.4rem;   /* 22,4px — todo bloque, tarjeta, shape */
--r-pill:  999px;    /* botones y pastillas */
```

Las variaciones son **derivadas por `calc()`**, no valores nuevos:
`calc(var(--r-block) * 0.7)` y `calc(var(--r-block) * 0.55)`.

Recuento real de `border-radius` en `sitio.module.css`: 8 × `--r-block`, 5 × `--r-pill`,
2 × derivados por `calc`, 2 × `50%` (puntos y avatares), y **7 sueltos** (`8px` ×2,
`6px` ×2, `2px`, más el bug de la §6). Los sueltos son todos micro-detalles de foco y
barras internas. La regla operativa: **si mide más de 10px, es `--r-block` o `--r-pill`.
No inventes un tercer radio.**

`globals.css` (para el resto del sitio, fuera de la v3) declara `--radius: 14px` y
`--radius-lg: 22px`. **`--radius-lg` 22px ≈ `--r-block` 22,4px**: no chocan, pero son dos
declaraciones distintas del mismo valor.

### Espaciado

Todo en `em`, así que reescala con el breakpoint:

| Qué | Valor |
|---|---|
| Aire vertical de sección (`.block`) | `padding-block: 6.5em` |
| Primer bloque de la página | `padding-top: 8em` |
| Ancho del contenedor (`.inner`) | `width: min(74rem, 100% - 2.4rem)` |
| Columna de lectura | `.measure: 34em` · `.measureWide: 46em` |
| Gap entre acciones del hero | `0.7em` |
| Gap de rejilla grande | `2.6em` – `3.2em` |
| Alto del header | `min-height: 60px` (sticky, `backdrop-filter: blur(10px)`) |

**Breakpoints usados** (min-width, en orden de frecuencia): 768 ×6, 700 ×5, 940 ×4,
860 ×4, 900 ×3, 1280 ×2, 800 ×1, 760 ×1. Los estructurales son **768** y **1280** — los
únicos que cambian el ancla `.page`. Los demás son ajustes de rejilla local.

### Movimiento

- Ease de la casa: `--ease: cubic-bezier(0.16, 1, 0.3, 1)`.
- Duración de hover: **0,15s** — 12 de 12 transiciones del archivo usan exactamente eso.
- Entrada in-view con `<Reveal>` (motion.dev, `reducedMotion="user"`).
- Cero parallax, cero scroll-scrub salvo el conmutador de rubros.
- `prefers-reduced-motion` → `transition: none`, **nunca `0.01ms`**.

---

## 4. Las prohibiciones, con su porqué

### 4.1 Cero sombras

La profundidad sale de **color, solape y escala**. Nunca de una `box-shadow`. El referente
(Fanvue) tiene 0 sombras y la v3 se midió contra eso.

Cómo se hace el relieve sin sombra, tal como está escrito en `.shape`: un rectángulo
grande translúcido con `inset: 14% 10% 26% 12%`, y encima un rectángulo chico opaco
(`42% × 40%`, abajo a la derecha). **El solape ES la profundidad.**

> ⚠️ **Excepción viva, y es la única.** `sitio.module.css:1274` (`.card`, la ventana del
> conmutador de rubros) tiene una `box-shadow` de dos capas. Se agregó a propósito cuando
> entraron las capturas reales: la captura es casi blanca y se fundía con el papel
> `#F9FBFA`, así que el borde + sombra le devuelven el límite. **Está documentada en el
> código y sigue siendo la única.** No la uses como permiso: si tu pieza no es una foto
> casi blanca sobre papel, no lleva sombra.

### 4.2 Nada de texto blanco sobre verde señal

`#ffffff` sobre `#00d26a` da **2,01:1** (medido). No pasa AA (4,5:1) ni AA grande (3:1).
Es ilegible.

(El comentario del código habla de "1.48:1": ese es el par original de Fanvue con **su**
verde, no el nuestro. El nuestro es 2,01:1 — sigue siendo un fallo total.)

Lo que sí se hace:
- Texto **oscuro** (`--tinta`) sobre el verde señal → 9,43:1.
- Texto **claro** sobre tinta (16,66:1) o sobre verde-900 (12,05:1).
- Verde como **texto** sólo en `--accent-ink` = verde-700 (7,25:1 sobre papel).
  **`--accent` verde-500 da 3,54:1 y NO es color de texto** — es color de forma.

> Excepción de logo: `.wordmark b` pinta una letra en `--senal` sobre papel (≈2:1). Es
> marca, y WCAG 1.4.3 exime a los logotipos. **No la extiendas a texto de interfaz.**

### 4.3 Nada de estado de obra en superficie de venta

Prohibido en cualquier pantalla que ve un cliente: "muy pronto", "próximamente", "beta",
"en construcción", banners de borrador, listas de lo que falta. Un solo cartel contamina
la percepción del producto entero — regla de Sergio del 2026-08-20, después de encontrar
cinco "muy pronto" en la banda de Módulos.

**Verificado**: `grep -ri "muy pronto|próximamente|en construcción|beta"` sobre
`src/app/(sitio)/` devuelve **3 coincidencias, las 3 dentro de comentarios de código**.
Cero en copy renderizado. El código aprobado cumple la regla.

El sustituto correcto es el que ya está implementado: cuando falta el clip o la captura,
va un **placeholder de forma y color de marca con `aspect-ratio` declarado** (cero CLS),
que se lee como composición, no como hueco. Y la demanda futura se captura sin admitir
obra: *"¿Otro rubro? Escribinos"*.

### 4.4 Un solo display por pantalla

`globals.css` lo fija como regla dura: **uno por pantalla** (si hay dos, ninguno es
grande), máximo 4-5 palabras, `line-height` ≤1 para que las líneas se toquen y formen un
bloque sólido.

---

## 5. El bloque copiable

Pegar tal cual en un HTML suelto. Incluye el ancla de ritmo, que es la mitad del sistema:
sin ella los `em` no significan nada.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@400;500&display=swap">
```

```css
:root {
  color-scheme: light;

  /* ---- escala verde Onia (fuente única, idéntica en landing y producto) ---- */
  --verde-50:  #EDFBF3;
  --verde-100: #D5F4E3;
  --verde-200: #B2EACD;
  --verde-300: #86D9B0;
  --verde-400: #4DBD8C;
  --verde-500: #089868;
  --verde-600: #027650;
  --verde-700: #016141;
  --verde-800: #004D32;
  --verde-900: #013925;

  /* ---- papel ---- */
  --bg:          #F9FBFA;  /* fondo de página */
  --bg-deep:     #F3F5F4;  /* segunda superficie clara */
  --surface:     #FFFFFF;
  --surface-dim: #F3F5F4;

  /* ---- tinta ---- */
  --ink:       #141A17;  /* texto sobre papel — 16,98:1 */
  --ink-soft:  #424A46;  /* secundario — 8,79:1 */
  --ink-faint: #69716D;  /* terciario — 4,83:1, PISO de AA */
  --line:      #D4D9D6;
  --line-soft: #E2E5E3;

  /* ---- lámina de marca del CTA: verde señal sobre tinta, 9,43:1 ---- */
  --senal: #00d26a;
  --tinta: #12100e;

  /* ---- roles del verde ---- */
  --accent:       var(--verde-500);  /* FORMAS. 3,54:1 sobre papel: NO es texto */
  --accent-ink:   var(--verde-700);  /* el verde legible — 7,25:1 */
  --accent-strong:var(--verde-700);
  --accent-soft:  var(--verde-100);

  /* ---- tipografía: DOS familias, ni una más ---- */
  --font-display: "Archivo", system-ui, sans-serif;
  --font-sans:    "Archivo", system-ui, sans-serif;
  --font-mono:    "Geist Mono", ui-monospace, SFMono-Regular, monospace;

  /* ---- UN solo sistema de radios ---- */
  --r-block: 1.4rem;  /* 22,4px */
  --r-pill:  999px;

  /* ---- movimiento ---- */
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

/* ---------------------------------------------------------------------- */
/* EL ANCLA DEL RITMO. Sin esto los `em` no significan nada.               */
/* UN font-size por breakpoint reescala tipografía Y espaciado a la vez.   */
/* Cero clamp() disperso — es el mecanismo, no una preferencia.            */
/* ---------------------------------------------------------------------- */
.page {
  font-size: 16px;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-sans);
  font-weight: 450;
  font-stretch: 100%;
  overflow-x: clip;   /* clip, no hidden: no rompe position:sticky */
}
@media (min-width: 768px)  { .page { font-size: 17px; } }
@media (min-width: 1280px) { .page { font-size: 18px; } }

/* ---- superficies: cada una fija su par texto/fondo accesible ---- */
.paper       { background: var(--bg);        color: var(--ink); }
.paperDim    { background: var(--bg-deep);   color: var(--ink); }
.ink         { background: var(--tinta);     color: #edf1ef; }   /* 16,66:1 */
.green       { background: var(--verde-900); color: #eafaf1; }   /* 12,05:1 */
.signalBlock { background: var(--senal);     color: var(--tinta); } /* 9,43:1 */

/* ---- ritmo de bloque ---- */
.block              { padding-block: 6.5em; }  /* NUNCA box-shadow */
.block:first-child  { padding-top: 8em; }
.inner              { width: min(74rem, 100% - 2.4rem); margin-inline: auto; }
.measure            { max-width: 34em; }

/* ---- el titular del hero ---- */
.display {
  font-family: var(--font-display);
  font-size: 3.1em;          /* 49,6px → 66,3px → 82,8px */
  font-weight: 550;
  font-stretch: 100%;
  letter-spacing: -0.02em;
  line-height: 0.95;
  text-wrap: balance;
  margin: 0;
  max-width: 15ch;
}
@media (min-width: 768px)  { .display { font-size: 3.9em; line-height: 0.9; } }
@media (min-width: 1280px) { .display { font-size: 4.6em; line-height: 0.86; letter-spacing: -0.025em; } }

/* la palabra destacada se resalta con COLOR, nunca con otra fuente ni más peso */
.display em { font-style: normal; color: var(--accent-ink); }
.ink .display em, .green .display em { color: var(--verde-300); }
.signalBlock .display em { color: #fff; }

/* ---- CTA de la casa ---- */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5em;
  min-height: 44px;
  padding: 0.8em 1.5em;
  border-radius: var(--r-pill);
  border: 1.5px solid transparent;
  background: var(--senal);
  color: var(--tinta);              /* JAMÁS blanco: 2,01:1 */
  font-weight: 600; font-size: 1em; line-height: 1.2;
  text-decoration: none; cursor: pointer; white-space: nowrap;
  transition: background-color 0.15s var(--ease), transform 0.15s var(--ease);
}
.btn:hover  { background: #00be5f; }
.btn:active { transform: translateY(1px); }
/* sobre un bloque de verde señal el botón se invierte: tinta sólida */
.signalBlock .btn { background: var(--tinta); color: #fff; }

/* ---- profundidad SIN sombra: solape de rectángulos planos ---- */
.shape {
  position: relative; width: 100%;
  aspect-ratio: var(--shape-ratio, 4 / 3);  /* declarado siempre: cero CLS */
  border-radius: var(--r-block);
  overflow: hidden; isolation: isolate;
  background: var(--verde-900);
}
.shape::before {   /* la "superficie" grande, translúcida */
  content: ""; position: absolute; inset: 14% 10% 26% 12%;
  border-radius: calc(var(--r-block) * 0.7);
  background: color-mix(in srgb, var(--senal) 22%, transparent);
}
.shape::after {    /* la "tarjeta" chica, opaca — el solape ES la profundidad */
  content: ""; position: absolute; right: 8%; bottom: 14%;
  width: 42%; height: 40%;
  border-radius: calc(var(--r-block) * 0.55);
  background: var(--senal);
}

/* ---- reduced motion: none, nunca 0.01ms ---- */
@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
```

---

## 6. Contradicciones y hallazgos — leer antes de copiar nada

Tres cosas que el código dice y que no cierran entre sí. Las dejo acá porque son
hallazgos, no detalles.

### 6.1 🔴 `--radio` no existe: hay un `border-radius` que se evalúa a 0

`sitio.module.css:1454`:

```css
.shapeShot {
  border-radius: calc(var(--radio) * 0.6);
}
```

`--radio` **no está declarado en ningún lado** del repo (grep sobre todo `src/`: 1 sola
aparición, y es este uso). La v3 declara `--r-block` y `--r-pill`; `globals.css` declara
`--radius` y `--radius-lg`. `--radio`, sin la `s`, es un typo.

Consecuencia real: la propiedad es inválida y la captura del hero (`.shapeShot`, la imagen
de producto dentro del `.shape`) **se renderiza con esquinas rectas**, encajada dentro de
un contenedor de 22,4px de radio. Casi seguro debería ser `calc(var(--r-block) * 0.6)`.
No lo toqué — sólo escribí este archivo.

### 6.2 ⚠️ Conviven DOS escalas de display

| Dónde | Mecanismo | Tamaño | Peso |
|---|---|---|---|
| `(sitio)/sitio.module.css` `.display` — **las 9 páginas de venta** | `em`, ancla en `.page` | 3.1 / 3.9 / 4.6em → 49,6 / 66,3 / 82,8px | **550** |
| `globals.css` `.display` — `/nosotros`, `/privacidad`, `/terminos`, `/servicios/*`, `/v1` | `clamp()` | `clamp(2.6rem, 0.6rem + 5.6vw, 6rem)` → 41,6px a 96px | **650** |

El comentario de `globals.css` dice literalmente *"UNA sola para TODO el sitio publico"*.
Ya no es cierto: la v3 aprobada se re-declaró encima con otro mecanismo (`em` en vez de
`clamp`), otro techo (82,8px vs 96px) y otro peso (550 vs 650). **Para una pieza de venta
manda la de `(sitio)`.** La de `globals.css` es la que quedó para las páginas legales y
las de servicio.

### 6.3 ⚠️ El producto y la landing no comparten la lámina del CTA

`onia-platform/app/globals.css` (el producto):
- **No tiene `--senal` ni `--tinta`.** Grep: cero apariciones de los tokens y de los hex
  `#00d26a` / `#12100e`. El verde señal del CTA **no existe dentro del producto**.
- Su primario es `--color-primary: #027650` (verde-600) con `--color-on-primary: #ffffff`.
  Eso es **blanco sobre verde** — pero sobre verde-**600**, que da 5,66:1 y pasa AA. **No
  contradice la prohibición**, que es específica del verde señal `#00d26a` (2,01:1).
  Vale decirlo explícito porque "nada de blanco sobre verde" a secas describiría mal el
  producto.
- Radios: `--radius: 0.875rem` (14px) con escala derivada `sm/md/lg/xl/2xl/3xl/4xl`, más
  **valores sueltos escritos a mano** (`15px`, `13px`, `14px`, `12px`). La regla del "un
  solo sistema de radios" vive en la landing; **el producto no la cumple**.
- Sombras: el producto **sí usa `box-shadow`** (7 declaraciones). La regla de cero sombras
  es de la superficie de venta, no del panel.

**Lo que sí comparten y es lo importante**: la escala verde de 10 pasos es byte por byte
idéntica, y las dos familias tipográficas (Archivo + Geist Mono) son las mismas, cargadas
igual con `next/font/google`. El puente entre producto y landing es el verde y la letra.
La lámina señal/tinta es exclusiva de la venta.

---

## 7. Checklist antes de dar un hero por terminado

- [ ] `grep box-shadow` sobre tu CSS → cero (única excepción viva: captura casi blanca sobre papel).
- [ ] `grep clamp(` → cero. El ritmo va anclado a `.page` y escrito en `em`.
- [ ] Ningún `border-radius` fuera de `--r-block` / `--r-pill` / sus `calc()` derivados.
- [ ] Cero texto blanco sobre `--senal`. Sobre señal, el texto es `--tinta`.
- [ ] Verde como texto sólo `--accent-ink` (verde-700). `--accent` (verde-500) es forma.
- [ ] Un solo `.display` en la pantalla, ≤5 palabras.
- [ ] Dos familias, ninguna tercera. Peso máximo 650.
- [ ] Todo contenedor de imagen con `aspect-ratio` declarado.
- [ ] `grep -i "muy pronto|próximamente|beta|en construcción"` sobre el copy → cero.
- [ ] Mirado renderizado a 390 / 768 / 1440 y con `prefers-reduced-motion: reduce`.
      Un 200 y un grep no son verificación.

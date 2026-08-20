# Cinta de logos con parallax — mecánica medida en fanvue.com

> Medido el 2026-08-18 abriendo `https://www.fanvue.com` con Playwright + Chromium headless
> (1440×900 y 390×844). Todos los números salen de `getComputedStyle`,
> `getBoundingClientRect`, los `style` inline reales y el store de interacciones de Webflow.
> Ninguno es de memoria. Scripts: `web-factory/.tmp/fanvue-logos-{probe,measure,fine,ix2,verify}.mjs`.
>
> Se extrae MECÁNICA. No se copian logos de prensa, marcas, textos ni assets de Fanvue.
>
> Complementa `../fanvue-mecanica-medida.md` (que ya cita `scrolllogo 35s` de pasada) y lo
> corrige en un punto: ese doc describe la marquesina del hero (`.banner > .banner-cont-w`
> con `img.banner-logo`). **Este doc es otro bloque**: `.logos-marq`, la banda de prensa
> negra que va justo debajo del hero.

---

## 1. Qué es y para qué sirve

Una banda horizontal de logos de prensa que se desplaza sola en loop infinito, sobre fondo
negro, justo debajo del hero: prueba social ambiental que no pide clic ni atención.
Sirve para el bloque "aparecemos en / confían en nosotros" de cualquier landing ONIA.

---

## 2. Mecánica MEDIDA

### 2.1 Estructura y copias

| Propiedad | Valor medido | Cómo lo medí |
|---|---|---|
| Contenedor | `div.logos-marq` — `display:flex`, `overflow:hidden`, `gap:80.064px` | `getComputedStyle` |
| Hijos directos | **2** × `div.logos-roll.scrolllogo` — lado a lado en la MISMA fila, no dos filas apiladas | `querySelectorAll` + `getBoundingClientRect` (ambos con `top: 1019.94`, distinto `left`) |
| `innerHTML` de las 2 pistas | **idéntico** (`rolls[0].innerHTML === rolls[1].innerHTML` → `true`) | comparación en el DOM |
| Imágenes por pista | **10** `img.logo-roll-img` = **5 SVG únicos duplicados ×2** dentro de cada pista | lectura de los 10 `src` (5 hashes distintos, repetidos) |
| Total de nodos `img` | 20 (5 únicos × 4 copias) | `querySelectorAll('.logo-roll-img').length` |
| Ancho de 1 pista | **2107,78 px** | `getBoundingClientRect().width` |
| Ancho del contenedor | 1440 px (= viewport) | idem |
| Ancho de la pista completa (2 pistas + gap) | 4295,63 px | suma medida |
| Alto del bloque | **241,75 px** | `getBoundingClientRect().height` |

**Por qué 2 pistas y no 1:** el keyframe termina en `translateX(calc(-100% - gap))`. Cuando
la pista 1 recorrió exactamente su propio ancho + el gap, la pista 2 llegó justo a la
posición inicial de la pista 1 → el fotograma es idéntico al del 0 % y el loop no se ve.
Verificado midiendo el borde derecho de la pista 2 en cada `requestAnimationFrame` durante
4 s: mínimo **2899 px ≥ 1440 px de viewport** → nunca hay hueco.

**Por qué 10 imágenes por pista y no 5:** con 5 logos la pista mediría ~1013,9 px
(5 imgs = 1387,2/2 px + 4 gaps de 80,06 px) — **menos que los 1440 px del viewport**, y con
2 pistas de 1013,9 px se vería el corte. Al duplicar el set adentro, 1 pista pasa a 2107,78 px
> 1440 px y el truco de 2 copias funciona. **La regla real es: 1 pista ≥ ancho del contenedor.**

### 2.2 Desplazamiento horizontal

| Propiedad | Valor medido | Cómo lo medí |
|---|---|---|
| Motor | **CSS puro**, sin JS | `getComputedStyle(roll).animationName === "scrolllogo"` |
| Regla | `.scrolllogo { animation: 35s linear 0s infinite normal none running scrolllogo }` | recorrido de `document.styleSheets` |
| Keyframes (desktop) | `@keyframes scrolllogo { 0% { transform: translateX(0px) } 100% { transform: translateX(calc(-100% - 5.56em)) } }` | idem |
| Keyframes (≤991 px) | mismo, pero `calc(-100% - 50px)` | `@media (max-width:991px)` en la misma hoja |
| Duración | **35 s**, `linear`, `infinite` | `animationDuration` / `animationTimingFunction` |
| Distancia por ciclo | 2107,78 + 80,064 = **2187,85 px** | ancho medido + gap medido |
| **Velocidad (teórica)** | **62,51 px/s** | 2187,85 / 35 |
| **Velocidad (medida)** | **62,55 px/s** (ajuste lineal sobre 355 muestras rAF en 6,006 s); 62,62 px/s por extremos | `DOMMatrixReadOnly(getComputedStyle(roll).transform).m41` en cada `requestAnimationFrame` |
| Período de ciclo comprobado | 34,98 s (vs 35 s declarados) | distancia medida / velocidad medida |
| `will-change` | `transform` | `getComputedStyle` |
| Propiedad animada | solo `transform` (compositor) | keyframes |

### 2.3 Parallax vertical

Existe, y es una interacción de Webflow (IX2). Leí su configuración exacta desde
`Webflow.require("ix2").store.getState().ixData`:

| Propiedad | Valor medido | Cómo lo medí |
|---|---|---|
| Evento | `e-4463`, `eventTypeId: "SCROLLING_IN_VIEW"`, `GENERAL_CONTINUOUS_ACTION` | store IX2 |
| Action list | `a-174`, título literal **"paralax"** | store IX2 |
| Keyframe 0 | `TRANSFORM_MOVE` → `yValue: -25`, `yUnit: "%"`, easing `""` (lineal) | store IX2 |
| Keyframe 100 | `TRANSFORM_MOVE` → `yValue: 0`, `yUnit: "%"`, easing **`easeInOut`** | store IX2 |
| `smoothing` | **60** (lerp: el valor va con retardo, no es función pura del scroll) | store IX2 |
| Disparo | `startsEntering: true`, `startsExiting: false`, sin offsets (`addStartOffset/addEndOffset: false`) | store IX2 |
| Media queries | `main`, `medium`, `small`, `tiny` (todas) | store IX2 |
| Elemento afectado | **solo la pista 1** (`data-w-id="4321d8c4-…82ff"`). La pista 2 no tiene `style` inline | `getAttribute("style")` en las 2 pistas |
| Rango real en el DOM | inline `translate3d(0px, **−25 %** → **−0,0025 %**, 0px)` | barrido de scroll de 12 px en 12 px, 117 posiciones |
| Ventana de scroll | de `marqTop ≈ 864 px` (scrollY 36) a `marqTop ≈ −192 px` (scrollY 1092) → **≈1056 px de scroll** | mismo barrido |
| El −13,2255 % del brief | es **una muestra intermedia de esa rampa**: medí −14,3185 % en scrollY 516 y −12,8793 % en scrollY 568 | mismo barrido |
| Amplitud real en píxeles | **5,25 px** (25 % de los 21,0156 px de alto de la pista — en `translate`, el % se refiere al propio border-box) | `-0.25 × getBoundingClientRect().height` |

**Hallazgo importante — el parallax NO se ve:** el `transform` inline que escribe IX2 lo pisa
la animación CSS `scrolllogo`, porque las animaciones CSS ganan sobre el estilo inline para
la propiedad animada. Medí el `transform` **computado** en **220 muestras** (2 corridas, 26
posiciones de scroll + 28 muestras temporales): en las 220 el valor es
`matrix(1, 0, 0, 1, X, **0**)` — la traslación vertical es **siempre 0**. Es decir: hay una
interacción de Webflow configurada, escribiendo bien su valor en el atributo `style`, y con
**cero efecto visual**. Y aunque funcionara, moverían 5,25 px.

### 2.4 Caja, tipografía y móvil

| Propiedad | Valor medido (1440 px) | Valor medido (390 px) |
|---|---|---|
| `font-size` de `.logos-marq` (base de los `em`) | 14,4 px | 3,9 px |
| `gap` | 80,064 px (`5.56em`) | 50 px |
| `padding` | 119,952 px arriba / 100,8 px abajo (`8.33em` / `7em`) | — (alto total 176 px) |
| `background-color` | `rgb(0, 0, 0)` | idem |
| Alto de cada logo | 21,0156 px (`1.46em`) | 16 px |
| Alto del bloque | 241,75 px | 176 px |
| Ancho de 1 pista | 2107,78 px | 1506,13 px |
| Duración | 35 s | 35 s |
| Velocidad | 62,55 px/s (medida) | ≈44,46 px/s (**derivada**: (1506,13 + 50)/35, no medida con rAF) |

Reglas fuente leídas tal cual de la hoja:

```css
.logos-marq { gap: 5.56em; background-color: rgb(0,0,0); padding-top: 8.33em;
              padding-bottom: 7em; display: flex; overflow: hidden; }
.logos-roll { gap: 5.56em; flex: 0 0 auto; display: flex; }
.logo-roll-img { height: 1.46em; }
.scrolllogo { animation: 35s linear 0s infinite normal none running scrolllogo; }
```

No hay `mask-image` ni degradado en los bordes: `maskImage` y `webkitMaskImage` computan
`none`. Los logos entran y salen a corte seco contra el negro.

### 2.5 `prefers-reduced-motion` en el sitio real

**No lo respeta.** Dos medidas independientes:

1. Recorrí todas las hojas de estilo buscando `@media (prefers-reduced-motion)`:
   **cero reglas**. (3 hojas cross-origin quedaron bloqueadas por CORS: Google Fonts,
   `swiper-bundle.min.css` y `splide.min.css` — ninguna es dueña de `.scrolllogo`.)
2. Cargué la página con `reducedMotion: "reduce"` en el contexto de Playwright
   (`matchMedia("(prefers-reduced-motion: reduce)").matches === true` verificado en la página):
   la cinta **siguió corriendo a 62,54 px/s**, mismo `animationName: scrolllogo`,
   `animationPlayState: running`.

Esto es un defecto de Fanvue, no un patrón a copiar.

---

## 3. Con qué se hace hoy, y cómo se hace sin eso

**Hoy en Fanvue:**

- El desplazamiento horizontal: **CSS puro**. Cero JS. No usa GSAP, ni Swiper, ni Splide.
- El parallax vertical: **Webflow IX2** (`data-w-id` + el runtime de Webflow), que en esta
  página viaja dentro de bundles de **2 544 608 bytes descomprimidos**
  (`fv-landing-page.*.js`: 2 347 095 + 142 568 + 41 429 + 8 125 + 5 391) más jQuery 3.5.1
  (89 476 B descomprimidos), del que IX2 depende.
- La página además carga GSAP 3.13.0 + ScrollTrigger + SplitText + Draggable + InertiaPlugin,
  otra copia de GSAP 3.15.0 desde el CDN de Webflow, Swiper 12 y Splide 4.0.6 —
  **ninguno participa de este bloque**. Hay 45 elementos con `data-w-id` en la página.

**Sin librería (lo nuestro):** todo el bloque es CSS. La animación ya es CSS pura, así que
no hay nada que portar; lo único que hay que resolver sin IX2 es el parallax, y la respuesta
medida es: **no lo hagas**. Movía 5,25 px y estaba muerto en el original. Si algún día se
quiere de verdad, la lección técnica es la que dejó el bug de Fanvue:

> **Nunca pongas el parallax de scroll sobre el mismo elemento que lleva la animación de
> marquesina.** Van los dos a `transform` y la animación CSS gana. Va en el wrapper
> (`.logos-marq`) o en un `div` intermedio.

Con esa separación, el parallax son ~0,4 KB de JS vanilla (`IntersectionObserver` +
`requestAnimationFrame` escribiendo una custom property sobre el wrapper), o cero JS con
`animation-timeline: view()` — soporte de navegador **a verificar**, no lo medí.

**Nuestra versión, verificada en local** (`.tmp/fanvue-logos-out/candidate.css`, corrida con
Playwright en `.tmp/fanvue-logos-verify.mjs` con 5 logos de mentira):

```css
.logos-marq{--gap:5.56em;--per-logo:3.5s;--logos:10;display:flex;gap:var(--gap);
  overflow:hidden;font-size:.9rem;padding:8.33em 0 7em;background:var(--surface-ink,#000);
  -webkit-mask-image:linear-gradient(90deg,#0000,#000 8%,#000 92%,#0000);
  mask-image:linear-gradient(90deg,#0000,#000 8%,#000 92%,#0000)}
.logos-roll{display:flex;gap:var(--gap);flex:0 0 auto;will-change:transform;
  animation:logos-roll calc(var(--logos)*var(--per-logo)) linear infinite}
.logos-roll img{height:1.46em;width:auto;flex:0 0 auto}
@keyframes logos-roll{to{transform:translateX(calc(-100% - var(--gap)))}}
@media (prefers-reduced-motion:reduce){
  .logos-marq{overflow-x:auto;justify-content:center;flex-wrap:wrap;row-gap:1.5em;
    -webkit-mask-image:none;mask-image:none}
  .logos-roll{animation:none}
  .logos-roll+.logos-roll{display:none}}
```

Resultados medidos de esa CSS contra la referencia:

| | Fanvue (medido) | Nuestra versión (medido) |
|---|---|---|
| `animation-duration` | 35 s | 35 s (`--logos:10 × --per-logo:3.5s`) |
| Velocidad | 62,55 px/s | **63,02 px/s** (0,8 % de diferencia) |
| Período de ciclo | 34,98 s | 34,93 s |
| Alto del bloque | 241,75 px | **241,75 px** |
| Hueco en el borde derecho | nunca | **nunca** (rAF durante 3 s) |
| `prefers-reduced-motion` | ignorado | `animation-name: none`, 2ª pista `display:none`, fila estática |

El truco de `--logos × --per-logo` mantiene la velocidad constante sin importar cuántos
logos entren: 3,5 s por logo es exactamente el ritmo de Fanvue (2187,85 px / 10 logos / 62,51 px/s).
La `mask-image` de bordes es un agregado nuestro — Fanvue corta seco; con fondos que no sean
negro plano el corte seco se ve mal.

---

## 4. Costo para nosotros

| Concepto | Bytes crudos | Gzip |
|---|---|---|
| CSS del bloque | **807 B** | **435 B** |
| HTML del bloque (sin los `<img>`) | 284 B | 183 B |
| **JS** | **0 B** | **0 B** |

Medido con `wc -c` y `gzip -9` sobre los archivos reales.
**0,43 KB gzip de CSS y 0 KB de JS** contra un presupuesto de 150 KB de JS por landing:
consume el **0 %** del presupuesto de JS. Los assets aparte: 5 SVG de logo ≈ 2–5 KB cada uno.

Comparación honesta: el parallax le cuesta hoy a Fanvue el runtime de Webflow + jQuery
(≈2,63 MB descomprimidos de JS que ya estaban por otras 44 interacciones) para mover 5,25 px
que además no se mueven.

---

## 5. Adaptación ONIA

### Datos que necesita el bloque

| Campo | Tipo | Default | Para qué |
|---|---|---|---|
| `logos[]` | `{ src, alt, href? }[]` | — | los SVG. `src` preferentemente SVG; `alt` con el nombre del medio/cliente |
| `label` | string | `"Aparecemos en"` | `aria-label` de la `<section>` — el bloque no tiene título visible |
| `--per-logo` | tiempo | `3.5s` | velocidad: subir = más lento |
| `--gap` | longitud | `5.56em` | separación |
| `--surface-ink` | color | token de superficie oscura | fondo |

### Qué hace cuando faltan datos

- **0 logos → el bloque no se renderiza.** Regla de la casa: cero clientes pagando ⇒
  prohibido inventar prueba social. Sin logos reales no hay cinta.
- **1 o 2 logos → fila estática centrada, sin marquesina.** Una cinta infinita con 2 logos
  se lee como un bug, no como prueba social.
- **3+ logos pero la pista mide menos que el contenedor → duplicar el set adentro de cada
  pista** hasta que 1 pista ≥ ancho del contenedor (esto es exactamente lo que hace Fanvue:
  5 únicos → 10 por pista). En el generador: repetir el array hasta superar 1,5× el ancho
  máximo previsto, y escribir el total resultante en `--logos` para que la velocidad no cambie.
- **Sin `alt` → `alt=""`** y el logo queda decorativo. La **pista 2 siempre lleva
  `aria-hidden="true"` y `alt=""`** en todas sus imágenes: es un duplicado visual, no debe
  leerse dos veces con lector de pantalla.
- **Logo en PNG en vez de SVG →** se acepta pero exportado a 2× de `1.46em` de alto;
  el `height:1.46em` no se toca (es lo que da la línea óptica pareja).
- **`prefers-reduced-motion: reduce` → obligatorio**, y acá NO copiamos a Fanvue:
  `animation: none`, se oculta la pista duplicada y queda una fila estática que envuelve
  y se centra. Verificado en local.
- **Sin `href`** → `<img>` suelta, sin enlace. Con `href`, `<a>` con `rel="noopener"`.

---

## 6. Lo que NO pude medir

- **Bytes reales en el cable (comprimidos)** de los bundles de Webflow: las respuestas
  vinieron `chunked` con `content-encoding: br` y **sin `content-length`**; Playwright
  devuelve el cuerpo ya descomprimido. Los 2 544 608 B que reporto son **descomprimidos**.
  El peso transferido queda **a verificar**.
- **Velocidad real en móvil con rAF**: los 44,46 px/s de 390 px son **derivados** de ancho
  medido + gap medido + duración medida, no de un muestreo temporal.
- **Las reglas CSS del breakpoint móvil** que cambian `gap` a 50 px y el alto del logo a
  16 px: medí los valores computados, pero no extraje el texto de la regla que los produce.
- **El texto de las 3 hojas cross-origin** (Google Fonts, `swiper-bundle.min.css`,
  `splide.min.css`): bloqueadas por CORS. No puedo afirmar al 100 % que ninguna traiga un
  `prefers-reduced-motion`, aunque ninguna es dueña de `.scrolllogo` y la prueba de
  comportamiento (la cinta siguió corriendo) es concluyente igual.
- **Soporte de navegador de `animation-timeline: view()`** para la variante de parallax sin
  JS: no lo probé en ningún navegador. A verificar antes de usarlo.
- **Si el parallax se ve en algún breakpoint**: probé 1440×900 y 390×844. En ambos el
  `transform` computado tiene traslación vertical 0. No barrí todos los anchos intermedios.
- **Comportamiento con `Save-Data` o con la pestaña en segundo plano**: no medido.

---

VEREDICTO: **construir — 0,43 KB gzip de CSS y 0 KB de JS (0 % del presupuesto de 150 KB), con la velocidad reproducida a 63,02 px/s vs 62,55 px/s del original (0,8 % de error); el parallax vertical NO se construye porque su amplitud medida es de 5,25 px y en el original está pisado por la animación CSS en 220/220 muestras.**

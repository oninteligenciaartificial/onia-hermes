# Conmutador de rubros pegado al scroll (`.every-niche` / `.en-sticky`)

Medido en vivo sobre https://www.fanvue.com el 2026-08-18 con Playwright + Chromium
(`web-factory/.tmp/niche-measure{,2,3,4}.mjs`), viewport 1440x900 salvo donde se aclare.
Todos los números salen de `getComputedStyle` / `getBoundingClientRect` / la API de
ScrollTrigger / el JS inline de la propia página. **Se extrae mecánica: cero nombres,
fotos, textos ni assets de Fanvue.**

---

## 1. Qué es y para qué sirve

Una columna de palabras (los rubros) queda pegada a la pantalla mientras el scroll avanza:
la palabra activa sube a opacidad plena y las otras quedan al 25 %, y a los costados dos
tarjetas cambian de foto y de nombre en sincronía.

Sirve para contar **"un producto, N rubros" en una sola pantalla**, sin tabs, sin clicks y
sin que el visitante tenga que elegir nada: el scroll hace el recorrido por él.

---

## 2. Mecánica MEDIDA

### 2.1 El tramo pegado

| Propiedad | Valor medido | Cómo lo medí |
|---|---|---|
| Contenedor de scroll `.sticky_trigger` | alto **4500 px**, `position: static`, arranca en `y = 5885,7` | `getBoundingClientRect()` + `scrollY` |
| Elemento pegado `.en-sticky` | `position: **sticky**`, `top: **135px**`, alto **630 px**, `display:flex; flex-direction:column`, ancho 1400 px | `getComputedStyle` |
| **No hay pin de GSAP** | `ScrollTrigger.getAll()` → los 4 triggers tienen `pin: false` | API de ScrollTrigger |
| Recorrido real pegado | **3870 px** (`4500 − 630`) | derivado; verificado mirando `getBoundingClientRect().top` del sticky: vale 135 constante entre `y=5686` y `y=9436`, y se despega en `y=9561` |
| Scroll por rubro | **750 px exactos** | `starts` de ScrollTrigger: 6636 / 7386 / 8136 / 8886. Δ = 750, 750, 750 |
| Fórmula del reparto | `start: top+=${(i / (spans.length + 1)) * 100}% top`, con `i = 1..4` y `spans.length = 5` → **denominador 6** | leída del `<script>` inline de la página |
| Comprobación de la fórmula | `4500 / 6 = 750` ✅ ; `5885,7 + 750 = 6635,7` vs 6636 medido ✅ | aritmética contra los `start` reales |
| Colchón antes del 1er cambio | **885 px** (el sticky pega en `y=5750,7`, el 1er trigger dispara en 6636) | derivado de los dos medidos |
| Colchón después del último | **735 px** (último trigger 8886, se despega en 9620,7) | ídem |

> El reparto es **`altura_del_trigger / (n_rubros + 1)`**, no `/ n_rubros`. Ese `+1` es lo
> que compra los dos colchones: el primer rubro se lee un rato antes de que empiece a
> cambiar, y el último no se evapora en el instante en que la sección se despega.

### 2.2 Opacidades exactas

| Elemento | Activo | Inactivo | Cómo lo medí |
|---|---|---|---|
| Palabra del rubro (`[data-span-array] > div`) | **1** | **0,25** | `getComputedStyle().opacity` en los 5, en los 5 estados |
| Avatar chico redondo (`.content_avatar`, 21,59 px) | **1** | **0** | ídem; los 5 apilados en `position:absolute` |
| Línea de métrica (`followers`) | **0,5** | **0** | ídem (clase `.opacity_-5`) |
| Foto grande (`.en-list-1-img`, 282,59 x 331,19) | **1** | **1** | **no usa opacidad**: ver 2.4 |

Confirmado también en el `gsap.set()` inicial del script: `opacity: 0.25` a todas las
palabras y `1` a la primera; `0` a todos los avatares y `1` al primero; `0,5` al primer
`follower`.

### 2.3 Duración y easing del cross-fade

| Propiedad | Valor medido | Cómo lo medí |
|---|---|---|
| Duración declarada | **0,5 s** en **todos** los tweens (28 `gsap.to` por transición, todos `duration: 0.5`) | leído del script inline |
| Easing declarado | ninguno → **default de GSAP = `power1.out`** (cuadrática de salida) | ausencia de `ease:` en el script |
| Duración real del avatar | llega a `opacity: 0` en **495 ms** | sondeo rAF por rAF con `getComputedStyle` (48 muestras) |
| Curva real del avatar | coincide con `1 − (1 − p)²` con error ≤ **0,015** en todo el recorrido | comparación muestra a muestra contra la referencia cuadrática |
| Equivalente CSS | **`cubic-bezier(.25, .46, .45, .94)`** (easeOutQuad) | es el bezier estándar de la cuadrática de salida; misma curva que el `0.3s cubic-bezier(0.25,0.46,0.45,0.94)` que Fanvue ya usa en sus hovers |
| Duración real de la **palabra** | **685 ms**, y con forma de ease-**in** (a los 136 ms solo lleva 13 % del recorrido) | sondeo rAF sobre la palabra, 58 muestras |

**El hallazgo incómodo:** las palabras y las fotos **no se funden con la misma curva**.
`.en-tb-1` conserva un `transition: opacity 0.2s` en CSS que persigue los valores inline
que GSAP le escribe cada frame. El resultado medido es la convolución de las dos: 0,5 s de
GSAP + ~0,19 s de retraso del CSS = **685 ms con arranque blando**, mientras la foto y el
avatar cierran en 495 ms con salida limpia. Se ve como que la palabra "va atrás" de la foto.

**Para nuestra versión: elegir una sola capa de animación.** Si el cambio lo hace CSS, no
lo toca JS por estilo inline; si lo hace JS, se quita la `transition` del CSS. Los 685 ms
de Fanvue son un accidente de dos sistemas encimados, no una decisión de diseño.

### 2.4 Cómo cambia la foto grande: es un rodillo, no un cross-fade

El brief asumía opacidad. **No lo es.** Medido:

| Propiedad | Valor medido | Cómo lo medí |
|---|---|---|
| Ventana `[data-track]` (`.en-list-w-1`) | 282,59 x **331,19 px**, `position:absolute`, `overflow: hidden`, `border-radius: 16px` | `getComputedStyle` |
| Tira interior `.en-list-1` | 5 `<img>` de 331,19 px cada una, sin gap (tops: 5885,7 / 6216,9 / 6548,1 / 6879,3 / 7210,5 → paso 331,2) | rects de los hijos |
| Movimiento | `gsap.to(leftImages, { yPercent: -100 * i })` → **cada imagen** se desplaza `-331,188 px` por paso | `transform` medido en los 5 estados: `matrix(1,0,0,1,0,0)`, `-331.188`, `-662.375`, `-993.562`, `-1324.75` |
| Tira derecha | `yPercent: +100 * i` → **rueda en sentido contrario** | ídem, signo invertido |
| Relación de aspecto de la foto | 282,59 / 331,19 = **0,853** (≈ 6:7) | rects |

O sea: ventana con `overflow:hidden` + tira vertical que se traslada un slot exacto por
rubro. Es más barato y más nítido que un cross-fade (no hay frame con dos fotos a media
opacidad encima).

### 2.5 Cómo se enmascara la lista de nombres

También aquí el brief asumía una máscara CSS. **No hay `mask-image` en ninguna parte**
(`maskImage: none` medido en `.name-mask`, `.name-list` y `.content_wrapper`). El
enmascarado es geométrico:

| Propiedad | Valor medido | Cómo lo medí |
|---|---|---|
| La ventana real es `.content_wrapper` | `overflow: hidden`, alto **28,8 px**, `border-radius: 5,4 px`, `backdrop-filter: blur(12px)`, fondo transparente | `getComputedStyle` |
| Slot de texto | `<span>` con `font-size: 10,8px` y **`line-height: 28,8036px`** | `getComputedStyle` sobre los spans |
| **La regla** | `line-height` del ítem **==** alto de la ventana → trasladar `-100 %` mueve exactamente un nombre | tops de los spans: 426,6 / 455,4 / 484,2 → paso 28,8 = alto de la ventana |
| Contenedor `.name-list` | `display:flex; flex-direction:column; gap:0` | `getComputedStyle` |
| Lista de métricas `.name-list.wrap_top` | `flex-direction: **column-reverse**` | `getComputedStyle` |
| Por qué la métrica va con `+100` y el nombre con `−100` | porque la lista de métricas está invertida por CSS (`column-reverse`); el JS solo cambia el signo | script inline + el `column-reverse` medido |
| Ancho animado | `.name-list` recibe `width` inline igual al `offsetWidth` del nombre activo: **69 → 73 → 48 → 49 → 61 px** | `getComputedStyle().width` en los 5 estados |
| Para qué sirve ese ancho | el punto separador (`.content_seperator`, 2,7 x 2,7 px) y la métrica quedan pegados al nombre sea cual sea su largo | inspección visual de las capturas + rects |
| Avatar | `.content_avatar_wrapper` `position:relative` 21,59 px; los 5 `.content_avatar` en `position:absolute` apilados, `border-radius:16px` | `getComputedStyle` |

Los dos rodillos (nombre y métrica) y el cross-fade del avatar corren **dentro de la misma
píldora de 28,8 px** con `backdrop-filter: blur(12px)`. Es una sola ventana, tres
mecanismos.

### 2.6 IntersectionObserver o scroll continuo: **ninguno de los dos**

| Propiedad | Valor medido | Cómo lo medí |
|---|---|---|
| Mecanismo | `ScrollTrigger.create({ trigger:'[data-trigger]', start: fn, onEnter, onLeaveBack })` | script inline |
| `scrub` | **ausente** (`vars.scrub === undefined` en los 4 triggers) | API de ScrollTrigger |
| `pin` | **false** en los 4 | API de ScrollTrigger |
| Animación atada al trigger | **ninguna** (`t.animation === false`); todo pasa en callbacks | API de ScrollTrigger |
| ¿Es continuo? | **No.** Barrido de 680 px de scroll dentro de un mismo rubro (`y` 6700→7380, 18 muestras): la opacidad se queda clavada en `0,25` y el `transform` del rodillo no se mueve | muestreo por scroll |
| ¿Es IntersectionObserver? | **No.** No hay `IntersectionObserver` creado para este bloque; son umbrales de posición de ScrollTrigger | script inline completo leído |

**Conclusión: es un conmutador DISCRETO por umbral.** Cruzás el px 6636 y dispara una
transición de 0,5 s que corre sola, independiente de la velocidad del scroll. Entre umbral
y umbral no pasa absolutamente nada. Funcionalmente equivalente a un IntersectionObserver
con 4 centinelas, y **por eso lo podemos replicar con IO sin perder nada**.

### 2.7 La deriva vertical de las tarjetas (el detalle que da vida)

Las tarjetas además **se desplazan** en cada cambio, siguiendo a la palabra activa:

```
trackArray = [5.063, 2.625, 6.688, 4.063, 10.625, 6.5, 14, 12]   // en em, 1em = 14.4px
```

| Rubro | `.en-list-w-1` `top` | `.en-list-w-2` `bottom` | Cómo lo medí |
|---|---|---|---|
| 1 | 0 px | 0 px | `getComputedStyle` en los 5 estados |
| 2 | **72,9 px** | **37,8 px** | ídem (`5.063 × 14,4 = 72,907` ✅) |
| 3 | **96,3 px** | **58,5 px** | ídem |
| 4 | **153 px** | **93,6 px** | ídem |
| 5 | **201,6 px** | **172,8 px** | ídem |

La izquierda baja y la derecha sube: convergen hacia el centro a medida que avanzás. Los
valores son una **tabla a mano, no una fórmula** (la palabra activa baja 92,3 px por paso
de forma uniforme; las tarjetas se mueven 72,9 / 23,4 / 56,7 / 48,6, que no es lineal).
Verificado mirando las capturas `niche-0.png` y `niche-4.png`.

### 2.8 Tipografía y color del bloque

| Propiedad | Valor medido | Cómo lo medí |
|---|---|---|
| Palabra | `font-size: 81px`, `font-weight: 500`, `line-height: 68,85px` (**ratio 0,85**), `letter-spacing: -0,3px` (−0,37 %), `color: rgb(255,255,255)` | `getComputedStyle` |
| Gap entre palabras | **23,4 px** | `getComputedStyle().gap` de `[data-span-array]` |
| Alto de la columna de 5 palabras | 437,78 px, centrada horizontalmente | rect |
| Fondo de sección | **`rgb(53, 65, 48)`** (verde oliva oscuro, no negro) | recorrido hacia arriba hasta el primer `backgroundColor` no transparente |
| Texto de la píldora | `rgb(252, 249, 240)` (blanco hueso) | `getComputedStyle` |

Consistente con las leyes ya documentadas en `../fanvue-mecanica-medida.md`: peso 500,
line-height por debajo de 1, tracking negativo.

### 2.9 Responsive (medido en 3 anchos)

| Ancho | Alto trigger | Sticky `top` / alto | Scroll por rubro | `trigH / 6` | Palabra |
|---|---|---|---|---|---|
| 1440 | 4500 px | 135 / 630 px | **750 px** | 750 ✅ | 81 px |
| 768 | 1589 px | 307,2 / 409,6 px | **265 px** | 264,8 ✅ | 43,2 px |
| 375 | 2738 px | 203 / 314 px | **456 px** | 456,3 ✅ | 56,25 px |

La fórmula `altura / (n+1)` se sostiene en los tres. **Pero el tablet está mal calibrado**:
265 px de scroll por rubro contra una transición de 500 ms significa que un scroll normal
atraviesa 2-3 rubros antes de que termine la primera animación. En 1440 hay 750 px, que sí
da aire. Piso recomendado para nuestra versión: **≥ 600 px por rubro en desktop**.

### 2.10 Accesibilidad: lo que Fanvue NO hace

| Propiedad | Valor medido | Cómo lo medí |
|---|---|---|
| `prefers-reduced-motion` | **sin tratamiento alguno** | recargué con `emulateMedia({ reducedMotion: 'reduce' })`: mismos 4 triggers, mismo trigger de 4500 px, mismo sticky en 135, y a `y=7500` el rodillo estaba igual en `translate(0%, -200%)` |
| Palabras navegables por teclado | **no**: son `<div>` sin `href`, sin `tabindex`, sin `role` | esqueleto del DOM |
| Versión anterior | el bloque legado `.en-sticky.hdn-old` (hoy `display:none`) sí tenía `<a href="#sport">` | esqueleto del DOM |

Perdieron el acceso por teclado al rehacer la sección. **Eso no se copia.**

---

## 3. Con qué se hace hoy, y cómo se hace sin eso

### 3.1 Hoy en Fanvue

- **GSAP 3.13.0 + ScrollTrigger 3.13.0**, cargados desde jsDelivr (la página además carga
  una segunda copia 3.15.0 desde el CDN de Webflow, más SplitText, CustomEase, Draggable e
  InertiaPlugin, y Swiper 12 aparte).
- El bloque entero son **~70 líneas de JS inline** sobre atributos `data-trigger`,
  `data-track`, `data-span-array`.
- Sitio Webflow, pero esto **no** es una interacción de Webflow: es código a mano.
- De todo GSAP, este bloque usa: `gsap.set`, `gsap.to` con `duration` y
  `ScrollTrigger.create` con `start` como función. **Nada más.**

### 3.2 Sin GSAP

Las cuatro cosas que hace GSAP acá tienen equivalente nativo directo:

| Lo que hace GSAP | Reemplazo nativo |
|---|---|
| `ScrollTrigger` con `start` en % y `pin:false` | ya es `position: sticky` puro; los umbrales son 5 centinelas + `IntersectionObserver` |
| `gsap.to(..., {opacity, duration: .5})` | `transition: opacity .5s cubic-bezier(.25,.46,.45,.94)` |
| `gsap.to(imgs, {yPercent: -100*i})` | `transform: translateY(calc(var(--i) * -100%))` |
| `gsap.to(nameList, {width: offsetWidth})` | `width: max-content` sobre el ítem activo, o `transition: width` con el ancho publicado en una variable |
| recálculo en resize | `IntersectionObserver` no necesita recálculo; `sticky` tampoco |

**Toda la mecánica cabe en una variable CSS.** JS solo decide el entero `--i` (0..4); el
CSS deriva de ahí el desplazamiento de los dos rodillos, la opacidad de las palabras, el
avatar activo y la deriva de las tarjetas. Implementación de referencia medida en
`web-factory/.tmp/vanilla/switcher.{js,css}`:

```js
// JS completo, sin dependencias
const set = (i) => {
  root.style.setProperty('--i', i);
  words.forEach((w, k) => w.setAttribute('aria-current', k === i ? 'true' : 'false'));
};
const io = new IntersectionObserver((entries) => {
  for (const e of entries) e.target.dataset.past = e.boundingClientRect.top < 0 ? '1' : '0';
  let i = 0; marks.forEach((m, k) => { if (m.dataset.past === '1') i = k; });
  set(i);
}, { threshold: 0 });
marks.forEach((m) => io.observe(m));
```

```css
.niche__roll        { transform: translateY(calc(var(--i) * var(--slot) * -1)); }
.niche__card--r .niche__roll { transform: translateY(calc(var(--i) *  var(--slot))); }
.niche__slot ul     { transform: translateY(calc(var(--i) * -28.8px)); }
.niche__word        { opacity: .25; transition: opacity .5s cubic-bezier(.25,.46,.45,.94); }
.niche__word[aria-current="true"] { opacity: 1; }
```

Ventajas medibles sobre el original, no solo de peso:
1. **Una sola capa de animación** → se acaban los 685 ms de la palabra contra 495 ms de la
   foto (sección 2.3).
2. `prefers-reduced-motion` es un `@media` de 8 líneas: el `sticky` pasa a `static`, el
   runway a `height:auto` y los 5 rubros se apilan visibles. **Nadie pierde información.**
3. `aria-current` en las palabras y `<a href="#rubro">` recuperan el teclado que Fanvue
   perdió.

---

## 4. Costo en KB de nuestra versión

Medido sobre los archivos reales de `.tmp/vanilla/` (`zlib.gzipSync` / `brotliCompressSync`
sobre el minificado), no estimado:

| Archivo | Minificado | gzip | brotli |
|---|---|---|---|
| `switcher.js` | **793 B** | **457 B** | 383 B |
| `switcher.css` | **2 568 B** | **912 B** | 774 B |
| **Total** | **3,28 KB** | **1,34 KB** | 1,13 KB |

Comparación con lo que carga Fanvue para lo mismo (descargado y comprimido por mí):

| | crudo | gzip |
|---|---|---|
| `gsap.min.js` | 70,7 KB | 27,6 KB |
| `ScrollTrigger.min.js` | 43,1 KB | 17,4 KB |
| **Total GSAP** | **113,8 KB** | **45,0 KB** |

**Contra el presupuesto ONIA de 150 KB de JS por landing: 793 B = 0,5 %.** Con GSAP el
mismo bloque se comería 113,8 KB crudos, el **76 % del presupuesto entero** para una
sección. GSAP está autorizado en la casa, pero acá no compra nada: no hay timeline, no hay
scrub, no hay easing custom, no hay plugin.

Aparte, el costo que sí manda: **10 fotos** (5 por tarjeta) de 282x331 px @2x. En AVIF de
calidad razonable son ~25-40 KB cada una, **250-400 KB de imagen**. Ahí está el peso real
del bloque, no en el JS. Las 8 de abajo van con `loading="lazy"`.

---

## 5. Adaptación ONIA

### 5.1 Por qué este bloque es el correcto para nosotros

`CLAUDE.md` dice literal: *"Hay UN solo producto: Onia Platform, que se vende con packs por
rubro"* y *"No se le vende solo a clínicas: son 7 rubros"*. Este patrón es exactamente esa
frase hecha pantalla: **una sola escena, el producto quieto, el rubro cambiando**. Es el
argumento contra la lectura de "esto es un software dental".

### 5.2 Qué rubros van

Fuente de verdad: `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` §2. Siete declarados en
código, **cinco contratables hoy**:

| Palabra en pantalla | Track | Estado en el catálogo |
|---|---|---|
| Clínica dental | `dentagest-clinical` | vivo |
| Comercio | `gestios-general` | construido, sin probar |
| Importadora | `proveegest-electrico` | construido, sin probar |
| Estética y spa | `esteticagest-clinical` | construido, sin probar |
| Servicios profesionales | `gestios-servicios-profesionales` | construido, sin probar (y hoy se contradice con `/empezar`) |

**Van cinco, no siete.** Veterinaria y Ganadería están cerradas por decisión (2026-08-15) y
el nombre `ganadero-offline` promete un modo offline que no existe. Ponerlas en la landing
es prometer lo que no se puede entregar. Cinco palabras además es exactamente el largo que
Fanvue eligió, y encaja en 630 px de alto.

Si en algún momento se encienden las 7, la fórmula `altura / (n+1)` absorbe el cambio sola:
`7 rubros → altura / 8`.

### 5.3 Datos que necesita el bloque

Un array, un objeto por rubro:

| Campo | Tipo | Para qué | Si falta |
|---|---|---|---|
| `id` | string | ancla `#rubro`, `data-track`, atribución `?src=` | **obligatorio**: sin `id` el rubro no se renderiza |
| `palabra` | string | la palabra grande | **obligatorio** |
| `href` | string | link al pack del rubro | se renderiza `<span>` en vez de `<a>` (pierde teclado, no rompe) |
| `foto` | `{src, srcset, alt}` x2 (tarjeta izq. y der.) | los dos rodillos | **fallback duro**: si falta una de las dos, el bloque cae a **una sola tarjeta** y el rodillo que quedó se centra. Con 0 fotos el bloque no se renderiza |
| `negocio` | string | el nombre en la píldora | la píldora se colapsa a solo avatar + métrica |
| `avatar` | `{src, alt}` | el círculo de 21,6 px | se usa un monograma en `<svg>` con la inicial de `negocio` |
| `metrica` | string corto | la línea al 50 % ("140 pacientes/mes") | se ocultan el punto separador y la línea; la píldora se acorta sola |

**Regla ONIA que aplica encima:** `metrica` es un dato de cliente. Con cero clientes
pagando, **está prohibido inventar cifras o negocios** (`CLAUDE.md` §5, propuestas). Hasta
tener un caso real y autorizado, este campo va **vacío** y la píldora muestra solo el rubro,
no un testimonio fabricado. El bloque tiene que verse bien con `metrica: null` en los cinco
— por eso el fallback es "se acorta", no "se rompe".

### 5.4 Fotos

No hay biblioteca de fotos de clientes. Dos caminos honestos:
1. **Capturas reales del producto** por rubro (la pantalla de agenda dental, la de stock de
   comercio, etc.) en el recorte 0,853. Es lo que tenemos y es verdad.
2. Foto de rubro genérica con licencia, y la píldora **sin nombre de negocio**.

Lo que no se hace: foto de stock + nombre inventado + "230k+ seguidores". Eso es
exactamente lo que la regla prohíbe.

### 5.5 Parámetros de arranque (portados de la medición)

```
--slot: 331px            /* alto de la tarjeta; ratio 0,853 */
--dur: .5s
--ease: cubic-bezier(.25,.46,.45,.94)
sticky top: 135px
scroll por rubro: 750px en >=1440  (piso 600px; NO bajar a los 265px del tablet de Fanvue)
altura del runway: alto_sticky + (n+1) * scroll_por_rubro
opacidad palabra: 1 / .25
opacidad avatar: 1 / 0
opacidad métrica: .5 / 0
palabra: peso 500, line-height .85, letter-spacing -.0037em
```

Deriva de tarjetas: **empezar sin ella**. Es una tabla a mano (sección 2.7), suma código y
es lo primero que se rompe al cambiar de tipografía o de cantidad de rubros. Se agrega
después, mirando la pantalla, si el bloque se siente estático.

---

## 6. Lo que NO pude medir

1. **Comportamiento con scroll rápido (flick que cruza 2-3 umbrales).** No lo probé. Los
   tweens de GSAP se sobreescriben entre sí por `overwrite` default, pero no verifiqué si
   quedan estados intermedios visibles. *A verificar* en nuestra versión: con CSS
   transitions y un solo `--i` el problema no puede existir, pero conviene mirarlo.
2. **Render real en 375 px.** Tengo los números (trigger 2738 px, palabra 56,25 px, tarjeta
   147x172 px) pero **no saqué captura de móvil**, así que no puedo afirmar que se vea bien
   ni cómo se acomodan las dos tarjetas en ese ancho. *A verificar.*
3. **El bloque legado `.en-sticky.hdn-old`.** Está en `display:none`; no pude medir nada
   renderizado de él. Solo sé que tenía `<a href="#sport">` y `transition: opacity 0.2s`.
4. **Reglas CSS fuente.** `document.styleSheets` devolvió 0 reglas por CORS (hoja en el CDN
   de Webflow). Todos los valores CSS de este documento son **computados**, no declarados:
   sé que `line-height` computa a 28,8036 px, no si en la hoja dice `2em` o `28.8px`.
5. **Peso real de las 10 fotos de Fanvue.** No medí sus bytes; el rango 25-40 KB de la
   sección 4 es una **estimación mía** para AVIF a ese tamaño, no una medición. Marcado
   como tal.
6. **Posición exacta de los umbrales entre corridas.** Los `start` de ScrollTrigger se
   movieron ~90 px entre la 1ª y la 2ª corrida porque las imágenes lazy cambian el layout y
   ScrollTrigger recalcula. Los **deltas de 750 px son estables**; los absolutos (6636,
   7386...) valen para esa corrida.
7. **Por qué `.en-tb-1` conserva su `transition: opacity 0.2s`.** Medí el efecto (685 ms,
   sección 2.3); no puedo saber si es intencional o un resto de la versión anterior.

---

**VEREDICTO: construir — 793 B de JS minificado (0,5 % del presupuesto de 150 KB) contra
los 113,8 KB de GSAP que Fanvue gasta para el mismo efecto, y es el único bloque medido que
dice "un producto, 5 rubros" en una sola pantalla sin pedirle un click al visitante.**

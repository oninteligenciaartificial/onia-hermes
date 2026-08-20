# Contador con racimo de avatares — medido en fanvue.com (2026-08-18)

Bloque de prueba social: una cifra grande de gente que ya entró, una linea que dice de
que economia se trata, y caras reales al lado para que la cifra tenga cuerpo.
Sirve para cerrar una seccion larga: convierte "esto existe" en "esto ya lo usan N".

---

## 0. AVISO DE HONESTIDAD — el bloque pedido NO existe hoy en fanvue.com

Se me pidio medir una tarjeta con **"201.553" + "Joined the creator-AI economy" +
racimo de avatares circulares superpuestos con borde de color**. Abri
`https://www.fanvue.com` con Chromium (1440, 1920 y 390 px), scrollee la pagina entera
y **ese bloque no esta**. Lo verificado, no supuesto:

- Busque en TODO el `document.body` los nodos de texto con separador de miles
  (`/\d{1,3}[.,\s]\d{3}/`): aparecen **solo dos**: `"200,000+ creators"` y
  `"15.9M Followers"`. No hay `201.553` ni nada parecido.
- Busque la palabra "join" en `document.body.innerText`: salen 4 lineas
  (`"Join the movement"` x2, `"Join 200,000+ creators scaling their success with Fanvue."`,
  `"Join the fastest growing community of creators."`). **La palabra "Joined" no aparece
  nunca**, ni "creator-AI economy" como etiqueta de contador (existe un H2
  "The Creator-AI Economy", que es un titulo de seccion, no la linea de un contador).
- Busque racimos: recorri todos los `div/ul/section`, tome los hijos que estan en la
  misma fila y medi si sus `getBoundingClientRect()` se **solapan** en X. El unico
  candidato es `.content_avatar_wrapper`, y **no es un racimo**: son 5 imagenes
  `position:absolute; left:0; top:0` — las 5 arrancan en `x = 163.2`, paso entre ellas
  = **0 px**. Es un solo hueco de avatar con 5 caras que se cruzan por opacidad.
- Tambien mire `/creators` (200) y `/signup` (202): cero numeros con separador,
  cero racimos. `/ai` y `/about` dan **404**.

Conclusion: **la referencia se recuerda mal, o el bloque se cayo del sitio.** Lo que si
existe y sirve para lo mismo son dos piezas, y son las que se midieron abajo:

- **A — La linea de prueba social**: `"Join 200,000+ creators scaling their success with
  Fanvue."` con el numero en verde (`span.green-span` dentro de `div.tb-21`), al cierre
  de la seccion `.every-niche`. **Estatica: no cuenta.**
- **B — La pastilla de identidad sobre foto**: `.content_wrapper` = 1 avatar + nombre +
  "230k+ followers", con 5 identidades que se cruzan a medida que baja el scroll.
  De ahi salen los numeros de avatar, radio, borde y contraste que se pidieron.

Todo lo de abajo es de la pagina viva, leido con `getComputedStyle` /
`getBoundingClientRect` / los `style` inline reales. Script:
`web-factory/.tmp/contador-prueba-social.mjs` (y `-anim`, `-scrub`, `-card`, `-final`,
`-pill`, `-last`). Salidas crudas en `web-factory/.tmp/contador-out/`.

---

## 1. Que es y para que sirve

Prueba social numerica al pie de una seccion: una cifra que crece sola cuando entra en
pantalla, una etiqueta que nombra el movimiento, y caras que le ponen cuerpo al numero.
Existe para que la ultima pantalla antes del CTA no sea una promesa sino un censo.

---

## 2. Mecanica MEDIDA

### 2.A — La linea del numero (`div.tb-21 > span.green-span`)

| Propiedad | Valor medido | Como lo medi |
|---|---|---|
| Texto completo | `Join 200,000+ creators scaling their success with Fanvue.` | `line.innerText` |
| Numero | `200,000+ creators` (dentro de `span.green-span`) | `span.textContent` |
| **Separador de miles** | **coma** (`200,000`), estilo en-US | texto real del nodo |
| **Formato del dato** | redondeado a la centena de mil + sufijo `+`. **No es una cifra exacta ni viva** | idem |
| **Anima al entrar en vista?** | **NO.** Cero cambios | 60 muestras por `requestAnimationFrame` + 1,2 s extra mientras el bloque cruza el fold: `textContent`, `opacity`, `transform`, `clip-path` del span, la linea y el wrap → **un unico estado** (`opacity:1`, `transform:none`) |
| Duracion / easing del conteo | **no aplica: no hay conteo** | — |
| font-size | 21,024 px @1440 · 28,032 px @1920 · 15 px @390 | `getComputedStyle` en 3 viewports |
| line-height | 23,126 px (ratio 1,10) @1440 | idem |
| font-weight | 500 | idem |
| letter-spacing | −0,1 px (≈ −0,005 em) | idem |
| Color del numero | `rgb(73, 242, 100)` (verde señal) | idem |
| Color del resto de la linea | `rgb(255, 255, 255)` | idem |
| Fondo real detras | `rgb(53, 65, 48)` (verde oscuro de `.every-niche`) | subi por los ancestros hasta el primer `background-color` distinto de transparente |
| **Contraste numero verde / fondo** | **7,27 : 1** (pasa AA y AAA de texto grande; AAA de texto normal pide 7 → justo lo pasa) | WCAG 2.x sobre los rgb medidos, luminancia relativa calculada en el script |
| **Contraste texto blanco / fondo** | **10,77 : 1** | idem |
| Reveal del bloque al entrar | **ninguno** (sin fade, sin translate) | mismas 60 muestras de arriba |

### 2.B — El avatar y su texto secundario (`.content_wrapper`)

| Propiedad | Valor medido | Como lo medi |
|---|---|---|
| Tamaño del avatar | **21,59 px** @1440 · **28,8 px** @1920 · **17,55 px** @390 | `getBoundingClientRect()` en 3 viewports |
| Relacion con el ritmo | 21,59 / 14,4 = **1,5 em** de su contenedor (@1920: 28,8 / 19,2 = 1,5 em) | `font-size` computado del contenedor vs ancho del avatar |
| Cantidad de caras | **5**, apiladas en el mismo hueco | `wrapper.children.length` |
| **Solape** | **NINGUNO — 0 px.** Los 5 `img` son `position:absolute; left:0; top:0`, todos en `x = 163,2` | `getBoundingClientRect().x` de cada hijo |
| `border-radius` declarado | `16px` @1440 y @1920 · `100%` @390 | `getComputedStyle` |
| **Forma renderizada** | **circulo**: 16+16 = 32 px > 21,59 px de lado, el navegador escala los radios por 21,59/32 = 0,675 → 10,8 px = exactamente el 50 % | aritmetica de la regla CSS de clamp sobre los valores medidos |
| **Borde** | **NO HAY.** `border-top: 0px none` · `outline: none` · `box-shadow: none` | `getComputedStyle` de los 5 `img` |
| Color del borde | **no existe** — el "borde de color" de la referencia no esta en esta pagina | idem |
| Fondo de la pastilla | `rgba(0,0,0,0)` — **transparente**, con **`backdrop-filter: blur(12px)`** | `getComputedStyle`; `::before` y `::after` tienen `content:none`, no hay capa pintada |
| Radio / padding / gap de la pastilla | `5,4px` / `3,6px 5,4px` / `5,77px` | idem |
| Texto secundario | `230k+ followers` — 10,8 px, peso 500, `rgb(252,249,240)`, clase `.opacity_-5` = **`opacity: 0.5`** | `getComputedStyle` + `style` inline |
| **Contraste real del texto secundario** | **3,88 : 1** contra el verde de seccion — **NO pasa AA (4,5) para texto de 10,8 px**. A opacidad plena serian 10,23 : 1 | luminancia WCAG componiendo el color al 50 % sobre `rgb(53,65,48)` |
| Nombre del creador | 10,8 px / 500 / `rgb(252,249,240)` · contraste 10,23 : 1 | idem |
| Separador | `<svg>` con un `circle` de **2,7 px** | `getBoundingClientRect()` |
| **Crossfade: duracion** | **≈ 500 ms** (medido 501 ms de `opacity` 0 → 1, muestreo cada 25 ms) | salto de scroll de 500 px y muestreo hasta estabilizar |
| **Crossfade: easing** | **cuadratico out** = `1-(1-t)²` (GSAP `power1.out`). Ajuste sobre 20 muestras: **rmse 0,011 · error max 0,027**. Lineal queda descartado (rmse 0,174) | ajuste numerico de las muestras contra 5 curvas candidatas |
| **Disparo** | **umbral, NO scrub.** Al saltar 500 px de golpe el tween corre sus 500 ms solo y termina; si fuera scrub se habria quedado congelado a mitad | test de salto + mapa fino de `opacity` vs `scrollY` cada 20 px con 1,4 s de espera: valores solo 0 o 1, el cambio ocurre entre y=6620 e y=6640 |
| ScrollTrigger reales | 4 triggers sobre `div.sticky_trigger` (alto 4500 px): start **6636 / 7386 / 8136 / 8886**, end 10386, `pin: false` → **750 px de scroll entre cara y cara** | `ScrollTrigger.getAll()` en la pagina viva |
| Mascara del nombre | `.name-mask > .name-list` con `width` inline animado (medido `width: 69px` = el ancho del nombre visible) → la pastilla se reajusta al nombre nuevo | `style` inline + `getBoundingClientRect` |
| Peso de las imagenes | WebP de **314x368 / 361x422 px** naturales para pintar **21,59 px** (≈ 16x de mas), **12,7 / 26,2 / 39,6 KB** cada una, `loading="lazy"`, **sin `srcset`** | `naturalWidth/Height` + `content-length` de las respuestas |
| **`prefers-reduced-motion`** | **NO lo respetan.** 0 bloques `@media (prefers-reduced-motion)` en el CSS legible, y con `reducedMotion: "reduce"` emulado la marquesina sigue en `35s linear infinite`, `animation-play-state: running` | recorrido de `document.styleSheets` + segunda carga con `page.emulateMedia()` |

---

## 3. Con que se hace hoy en Fanvue, y como se hace sin eso

**Hoy (medido, no supuesto):** sitio **Webflow** con **GSAP 3.13.0 + ScrollTrigger**
(ademas cargan SplitText, CustomEase, Draggable e InertiaPlugin), **jQuery 3.5.1**,
**Swiper 12**, **Splide 4.0.6** y **anime.js 2.0.2` en la misma pagina.
**No hay ninguna libreria de contador**: `window.Odometer` y `window.CountUp` dan
`false`. Logico — su numero no cuenta, es texto plano.

El crossfade lo escribe GSAP directo como `style="opacity: …"` inline en cada `img`;
no hay `transition` CSS util (`transition: all`, el default sucio de Webflow, en 940
elementos).

**Sin libreria (lo que hacemos nosotros):**

| Pieza | Reemplazo vanilla |
|---|---|
| Disparo al entrar en vista | `IntersectionObserver` con `threshold: 0.4`. No hace falta ScrollTrigger: el disparo es un umbral, no un scrub — eso quedo medido |
| Tween de 500 ms `power1.out` | `requestAnimationFrame` con `p = (t-t0)/d` y `1-(1-p)²`. Es la misma curva medida, en 3 lineas |
| Crossfade de avatar | `opacity` + `transition: opacity .5s cubic-bezier(.5,1,.89,1)` en CSS puro (esa bezier es el quad-out estandar) |
| Formato de miles | `Intl.NumberFormat` del navegador. Con `lang="es-BO"` da **punto** (`1.240`), no coma — verificado en el self-test |
| Pastilla sobre foto | `backdrop-filter: blur(12px)` en CSS, igual que ellos |
| Racimo con solape (lo que la referencia pedia y Fanvue no tiene) | `display:flex` + `margin-left: -.5em` en cada avatar salvo el primero + `border: 2px solid var(--wf-surface)`. Es CSS puro, 4 lineas, cero JS |

GSAP esta autorizado en Onia, pero **para este bloque no aporta nada**: un contador y un
crossfade por umbral son `IntersectionObserver` + `rAF`. Cargar GSAP aca es pagar 70 KB
por 0,4 KB de trabajo.

---

## 4. Costo en KB de nuestra version

Medido sobre la implementacion real escrita para este documento (no estimado a ojo):

| Archivo | Crudo | Gzip |
|---|---|---|
| JS del contador (IO + rAF + `Intl`, con rama reduced-motion) | **669 B** | **406 B** |
| CSS del bloque (racimo, solape, numero tabular, reduced-motion) | **557 B** | **313 B** |
| **Total** | **1,2 KB** | **0,72 KB** |

Contra el presupuesto de 150 KB de JS por landing: **0,4 % del cupo**. Con GSAP +
ScrollTrigger serian ~70 KB minificados (47 % del cupo) para el mismo resultado visible.

Las fotos son el costo real, no el codigo: Fanvue sirve **12–40 KB por avatar** de
314–422 px para pintarlos a 21 px. Nuestros avatares deben salir a **48 px** (2x de 24)
en WebP: ~1,5–3 KB cada uno. Con 5 caras, **≤ 15 KB de imagen**.

---

## 5. Adaptacion ONIA — que datos pide y que hace sin ellos

**Regla dura: cero clientes pagando ⇒ este bloque no puede inventar una cifra.** Se
diseña con la misma disciplina que `packages/blocks/src/trust.ts`, que lee `credenciales`
y si el array queda vacio **devuelve string vacio** (`if (items.length === 0) return ""`),
sin fallback a otro campo — precisamente porque un fallback ya habia impreso la misma
lista dos veces en la pagina.

Datos que necesita, todos del cliente y todos verificables:

| Campo | Tipo | Obligatorio |
|---|---|---|
| `prueba_social.total` | `number` | **Si.** Sin esto no hay bloque |
| `prueba_social.etiqueta` | `string` | **Si.** Que se cuenta ("clientes atendidos", "pedidos entregados"). Nunca la escribe la fabrica |
| `prueba_social.avatares` | `{ src, alt }[]` | No. Si falta, el bloque sale sin caras |

Reglas de render, en orden:

1. `total` ausente, no numerico, o `<= 0` → **`return ""`**. Ni titulo, ni caja vacia, ni
   `0`. El bloque desaparece de la pagina, como hace `trust.ts`.
2. `etiqueta` vacia → **`return ""`** tambien. Un numero sin sustantivo es un numero
   inventado esperando que el lector le ponga significado.
3. `avatares` vacio o ausente → **se renderiza solo el numero + la etiqueta**. Cero
   placeholders, cero caras de stock, cero iniciales de gente que no existe. La regla
   "no fabricar" del carril de propuestas aplica igual a las caras.
4. `avatares` con menos de 3 → se muestran los que hay; el solape sigue funcionando.
   **Nunca** se rellena hasta 5 con inventados.
5. Numeros redondeados hacia **abajo** con sufijo `+` cuando el dato es aproximado
   (`1.240+`), que es exactamente lo que hace Fanvue con su `200,000+`. Prohibido el
   camino contrario: redondear hacia arriba.
6. **Reduced motion**: `matchMedia("(prefers-reduced-motion: reduce)")` → se pinta el
   valor final de una, sin conteo. Esto Fanvue **no** lo hace (0 bloques medidos); es
   nuestro, y es obligatorio.
7. Separador de miles por `Intl.NumberFormat` con el `lang` del documento: para Bolivia
   (`es-BO`) el separador es **punto** (`1.240`), no la coma de Fanvue.

Contrato de datos y comportamiento verificados en
`web-factory/.tmp/contador-selftest.mjs` (3 asserts: cuenta 0 → `1.240`,
reduced-motion pinta al instante, y sin dato el script no toca el DOM). Corre en
~2 s con `node .tmp/contador-selftest.mjs`.

---

## 6. Lo que NO pude medir

1. **El bloque original de la consigna** (`201.553` + "Joined the creator-AI economy" +
   racimo con borde de color): **no existe en fanvue.com hoy**. No hay duracion, easing
   ni formato que medir, porque no hay contador. Si Sergio lo vio, fue en una version
   anterior del sitio o en otra pagina; **a verificar** con la URL o la captura exacta.
2. **El CSS de autor.** `document.styleSheets` devolvio **0 reglas** para
   `.content_avatar`, `.green-span` y `.tb-21`: las hojas viven en
   `cdn.prod.website-files.com` (otro origen) y `cssRules` tira `SecurityError`. Todo lo
   de arriba es **valor computado**, que es el efecto real, pero **no se cual es la regla
   escrita** ni si hay media queries intermedias entre 390 y 1440 px. **A verificar**
   bajando el CSS por HTTP y parseandolo.
3. **El contraste verdadero del texto secundario.** Los 3,88 : 1 son contra el verde de
   la seccion. En la pantalla ese texto va **sobre una foto** con `backdrop-filter`, asi
   que el contraste real cambia pixel a pixel. **A verificar** muestreando el canvas
   detras del texto; el 3,88 es la mejor cota que da `getComputedStyle`.
4. **Si el contador existe en algun estado A/B.** La pagina carga
   `cdn.amplitude.com/.../experiment.js`: puede haber variantes que no me tocaron. Medi
   una sola sesion, sin cookies, sin consentimiento aceptado. **A verificar** con varias
   sesiones o forzando la variante.
5. **El comportamiento con el banner de cookies aceptado.** No acepte el banner (regla de
   privacidad: no se aceptan terminos ni consentimientos). Si alguna seccion se monta
   despues del consentimiento, no la vi.
6. **`@390 px` el radio da `100%` y el avatar 17,55 px** (contra `16px` en desktop): hay
   una regla movil distinta que no pude leer por el punto 2. El efecto renderizado es el
   mismo circulo, pero **la regla, a verificar**.

---

VEREDICTO: **construir — pero el bloque nuestro, no el de ellos**: el contador de Fanvue
no cuenta (0 cambios en 60 muestras) y su "racimo" tiene 0 px de solape, asi que no hay
nada que copiar salvo el crossfade de 500 ms con `power1.out` (rmse 0,011); nuestra
version vanilla cuesta **406 B de JS gzip — 0,4 % del cupo de 150 KB** frente a los ~70 KB
de GSAP, trae el `prefers-reduced-motion` que ellos no tienen (0 bloques medidos) y, sin
`total` real, **no renderiza nada**.

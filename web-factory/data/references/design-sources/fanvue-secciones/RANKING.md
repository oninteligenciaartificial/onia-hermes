# Ranking de las 4 secciones medidas — cuáles DOS se construyen

Decidido el 2026-08-18 leyendo los 4 documentos de medición de esta carpeta. Los KB salen
de lo que cada documento midió con `zlib.gzipSync` / `wc -c` sobre archivos reales, no de
estimaciones. El criterio de datos sale de `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`
(fuente de verdad de qué se vende y en qué estado).

Orden del criterio, tal como se aplicó: **1) qué convierte para ONIA · 2) costo contra los
150 KB de JS · 3) que se pueda con lo que ya tenemos · 4) honestidad de los datos.**

---

## La tabla

| Sección | Valor para ONIA | Costo (JS gzip / % de 150 KB) | Veredicto |
|---|---|---|---|
| **sticky-niche-switcher** | **Máximo.** Es la frase "un producto, N rubros" hecha pantalla, sin tabs y sin pedir un click | **457 B gzip** (793 B min) = **0,5 %** · CSS 912 B gzip | **CONSTRUIR — 1º** |
| **panorama-slider-3d** | **Alto.** Vitrina de catálogo corto con jerarquía absoluta a UNO: dice "hay muchos más" sin prometer resultados | **1 184 B gzip** (2 798 B crudos) = **0,8 %** · CSS 475 B gzip | **CONSTRUIR — 2º** |
| **contador-prueba-social** | **Cero hoy.** Cuenta clientes que no existen | 406 B gzip = 0,4 % (barato, pero irrelevante) | **DESCARTAR** |
| **logos-marquee-parallax** | **Cero hoy.** Muestra logos de prensa que no tenemos | **0 B de JS** = 0 % · CSS 435 B gzip | **DESCARTAR** |

Nótese lo que la tabla deja claro: **el costo no decidió nada.** Los cuatro bloques caben
holgadamente en el presupuesto (el más caro gasta 0,8 %). Los dos descartes son los **más
baratos** de los cuatro — uno cuesta literalmente 0 B de JS. Lo que los mata es el criterio
4, que es el que manda.

---

## ELEGIDO 1 — `sticky-niche-switcher`

**Razón numérica:**

- **793 B de JS minificado = 0,5 % del presupuesto de 150 KB.** Fanvue gasta **113,8 KB
  crudos** (GSAP 70,7 + ScrollTrigger 43,1) para el mismo efecto: el **76 % del presupuesto
  entero en una sola sección**. Lo reemplazamos por `IntersectionObserver` + una variable
  CSS `--i` (0..4): **143 veces menos JS**, medido, no estimado.
- Es el **único** de los cuatro que argumenta contra la lectura "esto es un software
  dental". `CLAUDE.md` dice literal *"Hay UN solo producto… se vende con packs por rubro"* y
  *"No se le vende solo a clínicas: son 7 rubros"*. Este patrón es esa frase en una pantalla.
- **Mecánica ya resuelta sin librería y verificada:** el bloque no usa `scrub` ni `pin`
  (`vars.scrub === undefined` y `pin: false` en los 4 triggers medidos) — es un conmutador
  **discreto por umbral**, o sea exactamente lo que un `IntersectionObserver` hace gratis.
  El sticky ya es `position: sticky` puro. GSAP acá no compra nada.
- **Los datos existen y son honestos:** 5 rubros contratables hoy (`ONIA_CATALOGO_DE_VENTA.md`
  §2: 7 declarados, 2 cerradas por decisión). Cinco palabras es además el largo exacto que
  encaja en los 630 px de alto medidos. El campo `metrica` (el único que sería dato de
  cliente) **va vacío y la píldora se acorta sola** — el bloque está diseñado para verse
  bien con `metrica: null` en los cinco.

**Decisión tomada:** se construye la versión vanilla, **no** el port de Fanvue. Tres
desviaciones deliberadas, todas medidas como mejoras:

1. **Una sola capa de animación.** Los 685 ms de la palabra contra 495 ms de la foto en
   Fanvue son un accidente (un `transition: opacity .2s` de CSS persiguiendo los valores
   inline de GSAP), no una decisión de diseño. Nuestra versión anima solo en CSS:
   `.5s cubic-bezier(.25,.46,.45,.94)` en las dos capas.
2. **`prefers-reduced-motion` obligatorio** — Fanvue no lo trata (verificado recargando con
   `emulateMedia({reducedMotion:'reduce'})`: mismos 4 triggers, mismo rodillo en
   `translate(0%,-200%)`). Nuestro `@media` pasa el sticky a `static` y apila los 5 rubros
   visibles: nadie pierde información.
3. **Teclado recuperado** (`<a href="#rubro">` + `aria-current`). Fanvue lo perdió al
   rehacer la sección: sus palabras son `<div>` sin `href`, sin `tabindex`, sin `role`.

**Se arranca SIN la deriva vertical de las tarjetas** (§2.7 del doc): es una tabla a mano
de 8 valores, no una fórmula, y es lo primero que se rompe al cambiar de tipografía o de
cantidad de rubros. Se agrega después, mirando la pantalla, si el bloque se siente estático.

**Piso de scroll: 600 px por rubro en desktop.** El tablet de Fanvue está mal calibrado
(265 px por rubro contra una transición de 500 ms ⇒ un scroll normal atraviesa 2-3 rubros
antes de que termine la primera animación). En 1440 ellos tienen 750 px, que sí da aire.

**El costo real no es el JS: son las fotos.** 10 imágenes de 282×331 @2x. El doc estima
250-400 KB en AVIF y **lo marca como estimación propia, no como medición** (§6.5). Camino
honesto elegido: **capturas reales del producto por rubro** (agenda dental, stock de
comercio…) en el recorte 0,853. Es lo que tenemos y es verdad. Lo prohibido —
foto de stock + nombre inventado + "230k+ seguidores" — no se hace.

---

## ELEGIDO 2 — `panorama-slider-3d`

**Razón numérica:**

- **1 184 B gzip de JS = 0,8 % del presupuesto.** Swiper, que es lo que Fanvue paga,
  **sin minificar ya se come el presupuesto entero: 151,7 KB > 150 KB**; en gzip son 42,6 KB
  = **28 % del cupo**. Y lo paga para nada: el efecto panorámico **ni siquiera viene en la
  librería** — se verificó bajando el bundle, `indexOf('panorama')` da **−1**. Es un módulo
  custom de ~60 líneas de Fanvue. De Swiper solo usan drag, snap y loop.
- **Criterio 3 satisfecho de forma limpia: Swiper NO está instalado y NO hace falta.** El
  port vanilla ya está escrito y **verificado numéricamente contra los transforms inline
  reales: error < 0,01 px en p = 0, 1, 2, 3** (`p=1 → 11,2431 px / −172,082 px / 25deg`,
  exacto). Drag = `pointerdown/move/up` con `setPointerCapture`; snap = `Math.round` + una
  escritura con `transition-duration: 300ms` (interpola el compositor, **no hace falta rAF**);
  loop = una línea de módulo. GSAP tampoco hace falta: son transforms de compositor.
- **Convierte sin prometer nada.** Es el complemento del elegido 1: el switcher dice "un
  producto, N rubros"; el panorama muestra **la superficie del producto** con jerarquía
  absoluta a uno. No necesita cifras, ni testimonios, ni logos: necesita **ítems propios**.

**Decisión tomada sobre con qué se llena:** el doc pone una regla dura — **menos de 7
tarjetas y el loop se ve saltar; el rango cómodo es 10-14** (Fanvue usa 12). Los 5 rubros
contratables **no alcanzan** para este bloque. Se alimenta con datos que ONIA sí posee y
puede verificar:

- **14 módulos con pantalla propia** (`ONIA_CATALOGO_DE_VENTA.md` §4) — cae exactamente en
  la banda cómoda 10-14. Es la opción elegida.
- Alternativa si 14 resulta mucho: **21 capacidades del núcleo** (§3), recortando a 12.

Esto pasa el filtro de honestidad porque un nombre de módulo **no es una cifra de
resultados, ni un testimonio, ni un logo** — que es lo que §7 prohíbe. Son pantallas que
existen y tienen tablas en producción desde el 2026-08-15. **Restricción encima:** de los
14 módulos, 4 están 🟢 y 10 🟡 ("construido, sin probar"), así que el bloque muestra
**nombres y capturas, nunca promesas de resultado**, y **no incluye** nada de la lista
prohibida de §7 (factura electrónica, multi-sede, modo offline, visión por computadora).

**Extras nuestros sobre el original**, ya escritos en el doc: `--pano-rotate` /
`--pano-depth` como custom properties (los breakpoints se cambian en CSS, no en un objeto
JS), `prefers-reduced-motion` respetado (Fanvue arranca el autoplay sin consultar la media
query), flechas de teclado, `aria-hidden` en las tarjetas fuera de foco, y
`touch-action: pan-y` para no secuestrar el scroll vertical en móvil.

**A vigilar (no medido, marcado como tal en el doc fuente):** el peso de las imágenes del
carrusel no se midió, y con 12-14 tarjetas de 360×461 @2x es el costo dominante —
igual que en el elegido 1, el JS no es el problema, las fotos sí. También queda sin medir
el comportamiento táctil real y el throw con inercia.

---

## DESCARTADO — `contador-prueba-social`

**Razón exacta: no tenemos el dato, y el propio bloque se apaga sin él.**

Su contrato de render, regla 1: `total` ausente, no numérico o `<= 0` → **`return ""`**.
ONIA tiene **cero clientes pagando**; `ONIA_CATALOGO_DE_VENTA.md` §7 lo dice sin
ambigüedad: *"Cualquier cifra de resultados de Onia. Cero clientes pagando. Prohibido
inventar testimonios, logos o porcentajes."* Construirlo hoy es escribir un bloque que
**no renderiza nada**. No es caro (406 B gzip, 0,4 % del cupo): es **inaplicable**.

**Tres razones más, todas medidas, que lo sacan aunque tuviéramos el número:**

1. **El bloque de la consigna no existe en fanvue.com.** Se buscó en todo el `document.body`
   los nodos con separador de miles: aparecen **solo dos** (`"200,000+ creators"` y
   `"15.9M Followers"`). La palabra "Joined" **no aparece nunca**. No hay `201.553`.
2. **Su contador no cuenta.** 60 muestras por `requestAnimationFrame` + 1,2 s mientras el
   bloque cruza el fold: `textContent`, `opacity`, `transform` y `clip-path` dan **un único
   estado**. Es texto plano (`window.Odometer` y `window.CountUp` → `false`).
3. **Su "racimo de avatares" tiene 0 px de solape.** Los 5 `img` son
   `position:absolute; left:0; top:0`, los cinco en `x = 163,2`. No es un racimo: es un solo
   hueco con 5 caras cruzándose por opacidad. Y **no hay borde**
   (`border-top: 0px none`, `outline: none`, `box-shadow: none`).

**Lo único que valía de este doc ya lo tenemos:** el crossfade de **≈500 ms con `power1.out`**
(ajuste rmse 0,011) es *la misma curva y la misma duración* que el elegido 1 (0,5 s,
`cubic-bezier(.25,.46,.45,.94)`). Construir este bloque no aportaría **ninguna mecánica
nueva**.

**Cuándo se retoma:** el día que haya un `total` real y verificable con su `etiqueta`
(qué se cuenta). El código es de 3 líneas y el patrón está medido; no hay nada que
investigar de nuevo.

---

## DESCARTADO — `logos-marquee-parallax`

**Razón exacta: es el más barato de los cuatro y aun así no entra, porque no tenemos los
logos.**

Su propia regla de datos: **"0 logos → el bloque no se renderiza. Regla de la casa: cero
clientes pagando ⇒ prohibido inventar prueba social."** ONIA no tiene logos de prensa ni
clientes cuya marca pueda mostrar. Y su segunda regla lo remata: **1 o 2 logos → fila
estática, sin marquesina**, porque *"una cinta infinita con 2 logos se lee como un bug"*.
No hay configuración con la que este bloque diga algo verdadero hoy.

Que cueste **0 B de JS y 435 B gzip de CSS (0 % del presupuesto)** no lo salva: el criterio
2 nunca llegó a aplicarse, murió en el 4.

**El parallax, además, no se construiría ni con los logos:**

- Su amplitud real es de **5,25 px** (25 % de los 21,0156 px de alto de la pista).
- Y en el original **está muerto**: el `transform` inline que escribe Webflow IX2 lo pisa
  la animación CSS `scrolllogo`. Medido en **220 muestras** (26 posiciones de scroll +
  28 temporales, 2 corridas): en las 220 la traslación vertical es **0**. Fanvue paga el
  runtime de Webflow + jQuery (≈2,63 MB descomprimidos) para mover 5,25 px que no se mueven.

**Lo que se guarda de este doc aunque no se construya** — dos lecciones que valen para
cualquier marquesina futura:

1. **La regla del loop sin costura:** 1 pista ≥ ancho del contenedor, 2 pistas idénticas, y
   el keyframe termina en `translateX(calc(-100% - gap))`. Verificado: el borde derecho de
   la pista 2 nunca baja de 2 899 px contra 1 440 px de viewport ⇒ **nunca hay hueco**.
2. **Nunca poner el parallax de scroll sobre el mismo elemento que lleva la marquesina.**
   Van los dos a `transform` y la animación CSS gana. Va en el wrapper.

**Cuándo se retoma:** cuando existan logos reales de clientes o de prensa, con permiso de
uso. La CSS ya está escrita y verificada (velocidad reproducida a 63,02 px/s contra
62,55 px/s del original, **0,8 % de error**, y alto exacto de 241,75 px).

---

## Resumen de presupuesto de los dos elegidos

| | JS min/crudo | JS gzip | CSS gzip |
|---|---|---|---|
| `sticky-niche-switcher` | 793 B | 457 B | 912 B |
| `panorama-slider-3d` | 2 798 B | 1 184 B | 475 B |
| **Total de los dos** | **3 591 B** | **1 641 B** | **1 387 B** |

**3,6 KB de JS crudo = 2,4 % del presupuesto de 150 KB.** Los mismos dos bloques con las
librerías del original (GSAP + ScrollTrigger 113,8 KB + Swiper 151,7 KB) serían **265,5 KB:
177 % del presupuesto**, o sea imposibles. Cero librerías nuevas: no se instala Swiper, y
GSAP —autorizado en la casa— **no se usa acá porque no compra nada**: no hay timeline, no
hay scrub, no hay easing custom, no hay plugin.

El costo que sí hay que administrar en los dos es **el mismo y no es código: las imágenes.**
En el switcher son 10 fotos (peso estimado, no medido); en el panorama son 12-14 (peso no
medido). Ese es el número a vigilar cuando se construyan.

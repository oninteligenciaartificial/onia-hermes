# Carrusel panorámico 3D de tarjetas

Fuente medida: `https://www.fanvue.com`, bloque `.panorama-slider` > `.swiper.swiper-panorama`.
Medido el 2026-08-18 con Playwright + Chromium headless, viewport 1440x900 y 375x812.
Se extrae **mecánica**: transforms, opacidades, duraciones, estructura. No se copian nombres,
fotos, textos ni assets de Fanvue.

---

## 1. Qué es y para qué sirve

Una fila de tarjetas montadas sobre un cilindro 3D: la del centro queda de frente y las laterales
se van girando y alejando hasta ponerse de canto, con el texto de las laterales apagado a 0.2.
Sirve para mostrar un catálogo corto (8-14 ítems) dándole jerarquía absoluta a UNO sin perder la
señal de que hay muchos más — vitrina de rubros, de casos, de planes.

---

## 2. Mecánica MEDIDA

Todo lo de abajo salió de `getComputedStyle` / `getBoundingClientRect` / los `style.transform`
inline reales leídos de la instancia viva. Scripts usados:
`web-factory/.tmp/panorama-measure.mjs`, `panorama-drag.mjs`, `panorama-source.mjs`,
`panorama-final.mjs`, `panorama-last.mjs`.

### 2.1 Estructura y cantidades

| Propiedad | Valor medido | Cómo lo medí |
|---|---|---|
| Tarjetas en el DOM | **12** | `document.querySelectorAll('.swiper-panorama .swiper-slide').length` |
| Tarjetas únicas (no duplicados de loop) | **12** | `new Set(imgs.currentSrc).size` = 12; Swiper 12 en `loop` reordena nodos reales, no clona |
| Ancho de slide @1440 | **360 px** | `getComputedStyle(slide).width` y `swiper.slidesSizesGrid` = `[360 x12]` |
| Alto del bloque | **591.5 px** | `getComputedStyle('.panorama-slider').height` |
| Imagen dentro de la tarjeta | 360 x 460.8 px, `object-fit: cover` | `getComputedStyle(img)` |
| Ancho de slide @375 | **187.5 px** | `slidesSizesGrid` tras `setViewportSize({width:375})` |
| `slidesPerView` @1440 | 4 (centrado) | `swiper.params.slidesPerView`, `centeredSlides: true` |
| Perspectiva del contenedor | **1200 px**, origin `720px 295.75px` (centro) | `getComputedStyle('.swiper-panorama').perspective` |
| `transform-style` | contenedor `flat`, cada slide `preserve-3d`, wrapper `preserve-3d` | `getComputedStyle` |
| Wrapper | `translate3d(-1260px,0,0)` — desplazamiento plano; el 3D está por slide | `wrapperEl.style.transform` |
| Cursor | `grab` sobre el slide | `getComputedStyle(slide).cursor` |
| Máscaras laterales | 2 divs `.slider-ol-shadow`, 432 px de ancho (=30%), alto 120%, `top:-20%`, `z-index:3`, `pointer-events:none`. Izq `linear-gradient(90deg, #000 4%, transparent)`, der `linear-gradient(90deg, transparent, #000 90%)` | `getComputedStyle` de cada overlay |

### 2.2 Transforms inline reales @1440 (`rotate: 25°`, `depth: 250`)

`progress` = 0 en la activa, +1/+2… hacia la izquierda, -1/-2… hacia la derecha.

| progress | translateX | translateZ | rotateY | opacidad del texto |
|---|---|---|---|---|
| 0 (centro) | `0px` | `-250px` | `0deg` | **1** |
| ±1 | `±11.2431px` | `-172.082px` | `±25deg` | 0.2 |
| ±2 | `±85.731px` | `47.0724px` | `±50deg` | 0.2 |
| ±3 | `±266.825px` | `366.396px` | `±75deg` | 0.2 |
| ±4 | `±563.351px` | `726.054px` | `±100deg` | 0.2 |
| ±5 | `±944.146px` | `1058.65px` | `±125deg` | 0.2 |
| -6 | `-1343.54px` | `1301.86px` | `-150deg` | 0.2 |

Cómo lo medí: `swiper.slides.map(s => s.style.transform)` en reposo, más
`getComputedStyle(s.querySelector('.pt-36px')).opacity`.

**Rangos reales entre centro y extremo (@1440):**
- `rotateY`: de **0°** a **±125°** (12ª tarjeta llega a -150°). Paso constante de **25° por posición**.
- `translateZ`: de **-250 px** (centro, alejado) a **+1058.65 px** (extremo, delante de la cámara).
  Como `perspective` es 1200 px, todo lo que pasa de `z ≈ 1200` degenera: los bounding rects de
  esas tarjetas midieron 152097 px y 94227 px de ancho. **Por eso existen las máscaras negras**:
  tapan el artefacto en vez de arreglarlo.
- El barrido visible real son ~5 tarjetas: Swiper marca `swiper-slide-fully-visible` solo en
  progress -1, 0, +1, y `swiper-slide-visible` hasta ±2.

### 2.3 Fórmula exacta (derivada y verificada)

Leí el `setTransition` y el handler de `progress` directamente de la instancia viva
(`swiper.eventsListeners.setTransition[i].toString()` y el `<script>` inline que lo registra).
Expresado como matemática:

```
p    = progress del slide            (0 en el centro, continuo mientras arrastrás)
S    = ancho del slide               (360 @1440, 187.5 @375)
rot  = grados por posición           (25 @1440)
depth= px de retroceso del centro    (250 @1440)

ac   = 1 - cos(p * rot en radianes)
R    = (S * 0.5) / sin(rot/2 en radianes)      // radio del cilindro: 831.63 @1440
translateX = p * (S/3) * ac
translateZ = R * ac - depth
rotateY    = p * rot
opacidad del texto = max(0.2, 1 - |p| * 1.8)
```

Verificación numérica (`.tmp/pano-verify.mjs`): el puerto vanilla reproduce los transforms
medidos con error < 0.01 px en p = 0, 1, 2, 3. `p=1 → 11.2431 / -172.082 / 25deg` exacto.

Nota sobre `translateX`: el valor inline es solo el **delta**; la posición base
(`-p * S`) la pone el `translate3d` del wrapper. En una versión sin wrapper hay que sumar
`-p*S` al `translateX`.

### 2.4 Opacidad por posición: es un gradiente, no un switch

En reposo parece binario (1 / 0.2) porque `1 - 1*1.8 = -0.8` y clampea a 0.2 desde la
primera posición. Pero **mientras arrastrás sí interpola**. Medido en pleno drag:

| progress mid-drag | opacidad computada | esperado por fórmula |
|---|---|---|
| 0.0625 | 0.8875 | 1 - 0.1125 = 0.8875 ✓ |
| 0.2292 | 0.5875 | 1 - 0.4125 = 0.5875 ✓ |
| 0.3958 | 0.2875 | 1 - 0.7125 = 0.2875 ✓ |

Cómo lo medí: `page.mouse.down()` + `move` en pasos + `getComputedStyle(span).opacity` en cada
paso. Se apaga por completo a partir de |p| ≥ 0.444. Solo cae el **texto**: la imagen, la tarjeta
y el slide quedan todos en `opacity: 1` (medido).

### 2.5 Duración de transición y easing

| Propiedad | Valor medido | Cómo lo medí |
|---|---|---|
| Durante el arrastre | `transition-duration: 0ms` en wrapper y slides | leído en 3 puntos del drag con el mouse abajo |
| Al soltar | **300 ms** en wrapper, slides y spans de texto | `wrapperEl.style.transitionDuration` = `300ms`, `getComputedStyle(slide).transitionDuration` = `0.3s` justo tras `mouse.up()` |
| Easing | **`ease`** (= `cubic-bezier(.25,.1,.25,1)`) en wrapper y slides | `getComputedStyle(...).transitionTimingFunction` |
| `transition-property` del slide | `transform` | `getComputedStyle` |
| Umbral de snap | 0.5 del ancho de slide (`longSwipesRatio: 0.5`) | arrastré 172 px de 360 y **volvió** al mismo índice |
| Resistencia en bordes | `resistanceRatio: 0.85` (irrelevante: `loop: true`) | `swiper.params` |

Un detalle no obvio: el código propaga la duración a los `<span>` de texto por JS
(`span.style.transitionDuration = duration + 'ms'`). En CSS esos spans tienen
`transition-duration: 0s` — la sincronización texto/tarjeta es **imperativa**, no declarativa.

### 2.6 Autoplay: sí, y con gate de visibilidad

| Propiedad | Valor medido | Cómo lo medí |
|---|---|---|
| Autoplay | **Sí**, `delay: 5000 ms`, `disableOnInteraction: false` | `swiper.params.autoplay` + `swiper.autoplay.running === true` |
| Comprobación real | `realIndex` pasó de 0 a 1 tras esperar 6 s sin tocar nada | `waitForTimeout(6000)` y releer |
| Arranque | Se llama `autoplay.stop()` inmediatamente después de instanciar; lo enciende un `IntersectionObserver` con **`threshold: 1.0`** sobre `.panorama-slider`, y lo apaga al salir | leído del script inline de init |
| Pausa al hover | **No** (`pauseOnMouseEnter: false`) | `swiper.params.autoplay` |
| Loop | `loop: true`, `loopedSlides: 3` | `swiper.params` |

### 2.7 Breakpoints medidos

`slidesPerView` y la geometría cambian juntos (leído de `swiper.params.breakpoints`):

| Ancho | slidesPerView | rotate | depth | ancho de slide |
|---|---|---|---|---|
| base (<480) | 2 | **45°** | 150 | 187.5 px (medido @375) |
| ≥480 | 2 | 35° | 150 | a verificar |
| ≥640 | 3 | 30° | 150 | a verificar |
| ≥1024 | 4 | 30° | 200 | a verificar |
| ≥1200 | 4 | 25° | 250 | 360 px (medido @1440) |

Confirmado en vivo @375: `currentBreakpoint: "max"`, `slidesPerView: 2`,
`panoramaEffect: {rotate: 45, depth: 150}`, transforms `±45deg` / `translateZ(-149.999px)` en el
centro. Más grados y menos profundidad en móvil: la tarjeta lateral se pone casi de canto (±90°)
para que quepan 2.

---

## 3. Con qué se hace hoy, y cómo se hace SIN eso

### Hoy (Fanvue)

- **Swiper 12.2.0** cargado desde `cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js` + su CSS.
- **El efecto "panorama" NO viene de Swiper.** Lo verifiqué: bajé el bundle y
  `indexOf('panorama')` da **-1**. Es un módulo custom de ~60 líneas escrito por Fanvue,
  declarado en un `<script>` inline de la página y pasado como `modules: [EffectPanorama]`.
  Se engancha a tres eventos de Swiper: `beforeInit` (agrega las clases `swiper-3d` y
  `swiper-panorama`), `progress` (escribe el transform y la opacidad de cada slide) y
  `setTransition` (propaga la duración).
- O sea: Fanvue paga **42.6 KB gzip / 151.7 KB sin comprimir** de Swiper para usar de él
  solamente el motor de drag, el snap y el loop. Toda la parte visual es código propio.

### Sin Swiper — sí se puede, y es directo

Lo único que Swiper aporta acá es: (a) convertir el arrastre en un `progress` continuo,
(b) hacer snap al entero más cercano en 300 ms, (c) el loop. Las tres cosas son cortas:

- **progress**: `p = centro - i`, donde `centro` es un float que el `pointermove` mueve
  `-(dx / anchoSlide)`. Un `pointerdown/move/up` con `setPointerCapture`.
- **snap**: al soltar, `centro = Math.round(centro)` y escribir los transforms UNA vez con
  `transition-duration: 300ms`. **No hace falta rAF**: interpola el compositor.
- **loop**: `p = ((p % n) + n + n/2) % n - n/2`. Una línea.
- **posición base**: sin wrapper, se suma `-p * S` al `translateX` (ver 2.3).

Ya está escrito y verificado contra los números medidos:

```js
// ONIA panorama 3D — vanilla, sin Swiper. Verificado contra fanvue.com (<0.01px de error).
(function () {
  var RM = matchMedia('(prefers-reduced-motion: reduce)');
  function init(root) {
    var cards = [].slice.call(root.querySelectorAll('.pano-card'));
    var n = cards.length; if (!n) return;
    var center = 0, drag = null, timer = null, S = 0, rot = 25, depth = 250, dur = 300;
    function readCfg() {
      var cs = getComputedStyle(root);
      S = cards[0].offsetWidth;
      rot = parseFloat(cs.getPropertyValue('--pano-rotate')) || 25;
      depth = parseFloat(cs.getPropertyValue('--pano-depth')) || 250;
    }
    function render(ms) {
      var R = (S * 0.5) / Math.sin(rot * Math.PI / 360);
      for (var i = 0; i < n; i++) {
        var p = center - i;
        p = ((p % n) + n + n / 2) % n - n / 2;          // loop infinito
        var ac = 1 - Math.cos(p * rot * Math.PI / 180);
        var x = -p * S + p * (S / 3) * ac;
        var el = cards[i];
        // ponytail: |p|>3 salta sin transicion al dar la vuelta; queda tapado por la mascara.
        el.style.transitionDuration = (Math.abs(p) > 3 ? 0 : ms) + 'ms';
        el.style.transform = 'translateX(' + x.toFixed(3) + 'px) translateZ(' +
          (R * ac - depth).toFixed(3) + 'px) rotateY(' + (p * rot).toFixed(3) + 'deg)';
        el.style.setProperty('--pano-op', Math.max(0.2, 1 - Math.abs(p) * 1.8).toFixed(4));
        el.setAttribute('aria-hidden', Math.abs(p) > 0.5 ? 'true' : 'false');
      }
    }
    function go(i, ms) { center = i; render(RM.matches ? 0 : (ms == null ? dur : ms)); }
    root.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      drag = { x: e.clientX, c: center }; root.setPointerCapture(e.pointerId);
      root.classList.add('is-drag'); clearInterval(timer);
    });
    root.addEventListener('pointermove', function (e) {
      if (!drag) return;
      center = drag.c - (e.clientX - drag.x) / S; render(0);
    });
    function end() { if (!drag) return; drag = null; root.classList.remove('is-drag'); go(Math.round(center)); auto(); }
    root.addEventListener('pointerup', end); root.addEventListener('pointercancel', end);
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') go(center + 1); else if (e.key === 'ArrowLeft') go(center - 1);
    });
    function auto() {
      clearInterval(timer);
      if (RM.matches || !root.hasAttribute('data-autoplay')) return;
      timer = setInterval(function () { go(Math.round(center) + 1); }, +root.dataset.autoplay || 5000);
    }
    addEventListener('resize', function () { readCfg(); render(0); });
    new IntersectionObserver(function (es) {
      es[0].isIntersecting ? auto() : clearInterval(timer);
    }, { threshold: 1 }).observe(root);
    readCfg(); render(0);
    root.tabIndex = 0;
  }
  [].forEach.call(document.querySelectorAll('.pano'), init);
})();
```

```css
.pano{--pano-rotate:25;--pano-depth:250;position:relative;height:592px;perspective:1200px;cursor:grab;touch-action:pan-y;outline:none}
.pano.is-drag{cursor:grabbing}
.pano-card{position:absolute;top:0;left:50%;width:360px;height:100%;margin-left:-180px;
  transform-style:preserve-3d;transition:transform .3s ease;will-change:transform}
.pano-card .pano-text{opacity:var(--pano-op,.2);transition:opacity .3s ease}
.pano::before,.pano::after{content:"";position:absolute;top:-20%;bottom:0;width:30%;z-index:3;pointer-events:none}
.pano::before{left:0;background:linear-gradient(90deg,var(--pano-fade,#000) 4%,transparent)}
.pano::after{right:0;background:linear-gradient(90deg,transparent,var(--pano-fade,#000) 90%)}
@media (max-width:1199px){.pano{--pano-rotate:30;--pano-depth:200}}
@media (max-width:1023px){.pano{--pano-rotate:30;--pano-depth:150}}
@media (max-width:639px){.pano{--pano-rotate:35;--pano-depth:150}}
@media (max-width:479px){.pano{--pano-rotate:45;--pano-depth:150}}
@media (prefers-reduced-motion:reduce){.pano-card{transition:none}.pano-card .pano-text{transition:none}}
```

Markup mínimo:

```html
<div class="pano" data-autoplay="5000">
  <div class="pano-card"><img src="..." alt="..."><div class="pano-text">…</div></div>
  <!-- x 12 -->
</div>
```

Diferencias deliberadas contra el original, todas a favor:
`--pano-rotate` / `--pano-depth` como CSS custom properties (los breakpoints se cambian en CSS,
no en un objeto JS), `prefers-reduced-motion` respetado, flechas del teclado, `aria-hidden` en
las tarjetas fuera de foco y `touch-action: pan-y` para no secuestrar el scroll vertical en móvil.
GSAP no hace falta: son transforms de compositor con una transición CSS.

---

## 4. Costo en KB para nuestra versión

Medido con `zlib.gzipSync` sobre los archivos reales, no estimado:

| Archivo | Sin comprimir | gzip |
|---|---|---|
| `panorama.js` (arriba, sin minificar) | 2798 B (2.7 KB) | **1184 B (1.2 KB)** |
| `panorama.css` (arriba) | 1092 B (1.1 KB) | **475 B (0.5 KB)** |
| — comparación: `swiper-bundle.min.js` | 151.7 KB | 42.6 KB |
| — comparación: `swiper-bundle.min.css` | 14.3 KB | 2.9 KB |

Contra el presupuesto duro de 150 KB de JS por landing: nuestra versión gasta **1.2 KB gzip
(0.8 %)**. Swiper solo, sin minificar, **ya se come el presupuesto entero** (151.7 KB > 150 KB) y
en gzip se lleva el 28 %. Sin minificar todavía; con esbuild baja más, pero 1.2 KB no justifica el
paso.

---

## 5. Adaptación ONIA

### Datos que necesita el bloque

| Campo | Tipo | Obligatorio | Qué pasa si falta |
|---|---|---|---|
| `items[]` | array de tarjetas | **sí** | 0 items ⇒ el bloque **no se renderiza** (sección entera fuera del HTML, sin hueco). El JS ya hace `if (!n) return`. |
| `items[].image` | ruta a imagen 3:4 (mín. 360x461, servir AVIF/WebP) | no | placeholder de color sólido del token de rubro; la tarjeta sigue siendo válida — la mecánica no depende de la foto |
| `items[].title` | string corto | **sí** | sin título la tarjeta no comunica nada ⇒ se descarta ese item en el generador |
| `items[].subtitle` | 1-2 líneas | no | se omite el `<span>`; la tarjeta queda solo con título |
| `items[].href` | URL | no | la tarjeta se renderiza como `<div>` en vez de `<a>`; sin cursor de link |
| `autoplay` | ms o `false` | no | default **5000 ms**, apagado fuera de viewport y con reduced-motion |

**Cantidad de items — regla dura:** con menos de **7** tarjetas el loop se ve saltar (a ±3 ya
estás mirando la vuelta). Con 7-9 ⇒ bajar a `slidesPerView: 3`. El rango cómodo es **10-14**;
Fanvue usa 12. Con menos de 5, este bloque no es el bloque: usar una grilla.

**Vocabulario por rubro:** títulos y subtítulos salen de `lib/onboarding/vocabulario.ts` como
cualquier otro copy de ONIA. Nada de "tus pacientes" en un bloque genérico.

### Degradaciones

- `prefers-reduced-motion: reduce` ⇒ sin autoplay, transiciones a 0 ms. El arrastre sigue
  funcionando y el cambio es instantáneo. **Obligatorio en todo bloque ONIA.**
- Sin JS ⇒ las tarjetas quedan apiladas sobre `left: 50%` sin transform. Si el bloque tiene que
  sobrevivir sin JS, agregar en el HTML server-side el `transform` inicial de cada tarjeta
  (son 12 strings calculables en build) — hoy **no** está resuelto.
- Móvil: `touch-action: pan-y` deja pasar el scroll vertical. Verificado en el CSS, **no**
  probado con eventos táctiles reales.

---

## 6. Lo que NO pude medir

- **Anchos de slide en los breakpoints 480 / 640 / 1024.** Medí solo 375 y 1440. Los valores de
  `rotate` y `depth` de esos tres sí son exactos (leídos de `params.breakpoints`), pero el ancho
  resultante en px queda **a verificar**.
- **Si Fanvue respeta `prefers-reduced-motion`.** Encontré **0** bloques `@media
  (prefers-reduced-motion)` en las 13 hojas de estilo accesibles, pero **3 hojas cross-origin
  quedaron bloqueadas por CORS** (`cssRules` lanza). No puedo afirmar que no exista. Por lo que sí
  vi en el JS: el autoplay arranca igual, sin consultar la media query.
- **Comportamiento táctil real (móvil).** Medí el layout a 375 px redimensionando el viewport,
  no con emulación de touch ni gestos reales. El swipe con dedo queda a verificar.
- **La curva del throw con inercia.** El drag que hice terminó *por debajo* del umbral
  (172 px de 360, umbral 180) y volvió al mismo índice, así que medí el snap-back a 300 ms pero
  **no** un salto de más de un slide de un tirón rápido. Swiper tiene lógica de velocidad
  (`shortSwipes`/`longSwipesMs`) que no ejercité.
- **Qué hace el bloque con 2, 3 o 4 tarjetas.** El original tiene 12 fijas. Los mínimos de la
  sección 5 son criterio geométrico derivado de la fórmula, no una medición.
- **Peso y tiempo de carga de las imágenes del carrusel.** Medí el layout, no la red.

---

**VEREDICTO: construir — reproduce la mecánica medida con error < 0.01 px por 1.2 KB de JS gzip
(0.8 % del presupuesto de 150 KB), contra los 42.6 KB gzip / 151.7 KB crudos de Swiper, que solo
aporta drag, snap y loop porque el efecto panorámico ni siquiera viene en la librería.**

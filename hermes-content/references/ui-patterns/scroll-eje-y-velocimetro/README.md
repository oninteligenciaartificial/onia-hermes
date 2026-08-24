# Eje que gira con el scroll + velocímetro (United Carriers)

**Estado:** ejecutar
**Por qué:** la rotación atada al scroll sale nativa en CSS y se porta 1:1 sin dependencias; el velocímetro se entiende, se copia en 20 líneas de vanilla y casi nunca conviene.

## De dónde sale

| Dato | Valor |
|---|---|
| Sitio | https://unitedcarriers.com/ (abre; freight forwarding APAC) |
| Reconocimiento | Awwwards Nominee, 3-ago-2026 |
| Autores | Bearplus Studio + Kenny Ho |
| Stack real | Webflow como shell + bundle propio (Vite) con GSAP ScrollTrigger, Three.js y Lenis |
| Dónde viven las piezas | sección `.home-service-wrap`: un camión cruza la pantalla mientras scrolleás |

Verificado leyendo el DOM en vivo (`.home-service-truck-wheel-i wheel-1..5`, `[data-speed]` con `00` + `km/h`)
y el bundle de producción del propio origen (`united-carriers.netlify.app/chunks/Home-Dfl4_ZdF.js`, 129.381 bytes).
Ese bundle es **código propietario**: sirve para entender la técnica, no para copiar.
NO VERIFICADO: no hay captura renderizada — el panel del browser no estaba disponible en esa sesión.

## El hallazgo central: son DOS mecánicas distintas

| Pieza | Qué la maneja | Se hace con |
|---|---|---|
| Ruedas del camión ("el eje que gira") | **PROGRESO** de scroll (dónde estás) | CSS nativo `animation-timeline`, cero JS |
| Velocímetro | **VELOCIDAD** de scroll (qué tan rápido movés) | JS obligatorio, un solo rAF |

Confundirlas es el error caro: el velocímetro **no** se puede hacer con scroll-driven animations porque
no hay timeline de velocidad, sólo de posición.

## 1. La rotación (lo que sí vale copiar)

Original en el sitio: `rotationZ: 360*4, ease:'linear'` dentro de un timeline con `scrub:true`, más
`modifiers:{rotationZ: v => v % 360}` para que el valor no se acumule. En CSS nativo el módulo no hace falta.

```css
.rueda { will-change: transform; }

@keyframes girar { to { rotate: 1440deg; } }   /* 4 vueltas */

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .rueda {
      animation: girar linear both;
      animation-timeline: view();          /* arranca cuando la sección entra al viewport */
      animation-range: entry 0% exit 100%;
    }
  }
}
```

`view()` = atado a la visibilidad del elemento. `scroll()` = atado al scroll del contenedor, esté visible o no.
Para una rueda que gira "mientras el camión cruza", `view()` es el correcto.
Se anima `rotate` (propiedad independiente, compositor-friendly), nunca `top`/`width`.

### Fallback JS — obligatorio, no opcional

| Navegador | Soporte scroll-driven animations |
|---|---|
| Chrome / Edge 115+ (jul-2023) | sí |
| Chrome Android 115+ | sí |
| Safari 26 / iOS 26 (15-sep-2025) | sí |
| Firefox / Firefox Android | **NO** (detrás de flag; prioridad Interop 2026) |

~82% global. **Baseline bloqueado** por Firefox → sin fallback, un quinto de la gente ve la rueda quieta.

```js
// Sólo si el navegador NO tiene scroll-driven animations.
if (!CSS.supports('animation-timeline: view()') &&
    !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const seccion = document.querySelector('.home-service-wrap');
  const ruedas = [...document.querySelectorAll('.rueda')];
  let visible = false, raf = 0;

  const pintar = () => {
    const r = seccion.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
    for (const rueda of ruedas) rueda.style.rotate = (p * 1440) + 'deg';
    raf = visible ? requestAnimationFrame(pintar) : 0;
  };

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(pintar);
  }).observe(seccion);
}
```

Cero `addEventListener('scroll')`. El rAF **sólo corre mientras la sección está visible** y se apaga solo al salir.

### prefers-reduced-motion

El `@media` de arriba ya apaga el giro en CSS y el `if` lo apaga en el fallback. La rueda queda en su
posición inicial y el contenido de la sección (texto de servicios) sigue leyéndose igual: la animación
no transporta información, así que apagarla no rompe nada. Esa es la prueba de que el efecto es legítimo.

## 2. El velocímetro (cómo está hecho, por si alguna vez va)

No es un dial con aguja: es un contador digital de dos dígitos + `km/h`. Algoritmo real del bundle:

1. `Math.abs(scroll - anterior) / (dt/1000)` → px por segundo (lee Lenis, con fallback a `window.scrollY`)
2. `/ 25` para pasar a "km/h" ficticios; jitter aleatorio si supera 500 px/s; clamp a 95
3. lerp asimétrico: `0.1` acelerando, `0.06` frenando, `0.15` al parar
4. escribe en el DOM **sólo cuando cambia el entero** (guarda `data-current-speed`), `padStart(2,'0')`
5. `if (innerWidth > 767)` — apagado en mobile por sus propios autores

```js
const el = document.querySelector('[data-speed]');
if (el && innerWidth > 767 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let previo = scrollY, suave = 0, ultimo = -1, t = performance.now();
  requestAnimationFrame(function tick(ahora) {
    const dt = (ahora - t) / 1000; t = ahora;
    if (dt > 0) {
      const pxs = Math.abs(scrollY - previo) / dt; previo = scrollY;
      const objetivo = Math.min(95, pxs / 25);
      const k = objetivo > suave ? 0.1 : (objetivo === 0 ? 0.15 : 0.06);
      suave += (objetivo - suave) * k;
      const n = Math.round(suave);
      if (n !== ultimo) { ultimo = n; el.textContent = String(n).padStart(2, '0'); }
    }
    requestAnimationFrame(tick);
  });
}
```

Ese rAF es permanente. Si lo usás, gatealo con el mismo `IntersectionObserver` de arriba.

## Licencias — GSAP NO se adopta

| Librería | SPDX (`gh api repos/OWNER/REPO --jq .license.spdx_id`) | Veredicto |
|---|---|---|
| greensock/GSAP | **cadena vacía** — GitHub no le detecta licencia SPDX ("Standard License" propia) | NO adoptar. Mismo criterio que jubiló a Remotion. Referencia de lectura |
| darkroomengineering/lenis | MIT | OK si alguna vez hace falta smooth scroll — **para este patrón no hace falta**, `window.scrollY` alcanza |

## Cuándo NO conviene

El velocímetro es **decoración pura**: no comunica ningún dato del contenido, sólo qué tan rápido movés
la rueda del mouse. En United Carriers funciona por una razón concreta y **no generalizable**: la sección
entera ES un camión manejando, el velocímetro es literal dentro de esa metáfora — y aun así lo apagaron en mobile.

**Vale SÍ** cuando se cumplen las tres: (a) la metáfora es literal (transporte, logística, motor, velocidad);
(b) la misma sección ya tiene un objeto scrubbeado, o sea el número lee algo que el usuario está viendo moverse;
(c) hay presupuesto para hacerlo desktop-only.

**Vale NO** en cualquier landing genérica. En un SaaS, una clínica o un ecommerce es ruido que roba atención
al CTA y agrega un rAF permanente por cero valor comunicacional.

**Regla práctica para Onia:** si el número no describe algo del producto, no va. Y si va, que sea un indicador
de **progreso de lectura** (que sí informa), no de velocidad de scroll.

La rotación, en cambio, se lleva sola: es CSS, es reversible, se apaga con `prefers-reduced-motion` y no
suma una sola dependencia.

## Fuentes

- https://unitedcarriers.com/ — sitio real, DOM leído en vivo
- https://united-carriers.netlify.app/chunks/Home-Dfl4_ZdF.js — bundle de producción (propietario, sólo lectura)
- https://www.awwwards.com/sites/united-carriers — ficha, autoría y tecnologías declaradas
- https://www.a1.gallery/website/united-carriers — segunda fuente independiente de autoría
- https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/ — `scroll()` vs `view()`, `animation-range`
- https://web-platform-dx.github.io/web-features-explorer/features/scroll-driven-animations/ — tabla de soporte por versión
- https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline — confirma "Limited availability", no Baseline

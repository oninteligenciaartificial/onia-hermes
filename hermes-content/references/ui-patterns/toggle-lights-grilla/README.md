# Toggle "Lights" que enciende la grilla de productos

**Estado:** ejecutar
**Por qué:** son dos estados sobre la misma grilla, no un dark mode: sale con un `data-attr`, tres reglas CSS y cinco líneas de JS, sin dependencias — pero solo sirve en rubros donde el producto emite luz.

## De dónde sale

| Dato | Valor |
|---|---|
| Pedido | `hermes-content/docs/ONIA_WEB_FACTORY_COLA_DE_PROMPTS.md`, fila **P02** (anotado por Sergio, 23-ago-2026) |
| Origen citado | Un reel de https://www.instagram.com/andrew.plerdy/ — Andrew Chornyy, CEO de Plerdy |
| Referencia técnica del mecanismo | https://www.smashingmagazine.com/2025/10/ambient-animations-web-design-practical-applications-part2/ (Andy Clarke, 22-oct-2025): usa `data-lights="lights-on/lights-off"` en el contenedor y conmuta con selectores `[data-lights=...]` animando solo `opacity` |
| Contraejemplo útil | https://blog.finiam.com/blog/spotlight-effect-with-js-and-css (David Lange, abr-2022): recalcula `background: radial-gradient(...)` en cada `mousemove` |

**NO VERIFICADO — el reel original.** Instagram tapa las publicaciones tras login: la cuenta existe
(21,4 mil seguidores, bio "I show why websites fail & lose money"), pero **nadie de acá vio el reel
ni el sitio que mostraba**. Lo que sigue es el patrón genérico reconstruido desde la fuente técnica
de Andy Clarke. ⚠️ Y como esa cuenta es de CRO y se llama literalmente "why websites fail", **no
sabemos si mostró el toggle como acierto o como error de conversión** — oscurecer la grilla puede
esconder producto. Idea a testear, no buena práctica heredada.

**Evidencia negativa** (verificada abriendo los sitios): https://yalamps.com — el toggle día/noche
premiado en https://www.awwwards.com/inspiration/switch-between-dark-and-light-mode-yalamps ya no
existe, hoy es una tienda Shopify común. https://yellowpop.com (neón, el rubro ideal) tampoco tiene
control de encendido sobre su grilla. No hay hoy un sitio vivo verificado con este patrón.

## Qué es, y qué NO es

- **ES:** un toggle de **estado**: apaga la sala alrededor de una grilla y enciende un halo por
  producto. Dos estados visuales sobre la **misma** grilla.
- **NO ES:** un dark mode del sitio. El estado es **independiente del tema**: no colgarlo de
  `prefers-color-scheme` ni del switcher de tema.

## Fit real con ONIA

| Rubro | Vale la pena |
|---|---|
| Iluminación, neón, decoración, joyería, vitrinas | Sí — el producto emite luz; el estado ON lo muestra funcionando |
| Dental, importadora, comercio general, ganadero | No — es adorno: oscurece producto sin agregar información |

**Entrada de banco, no default de fábrica.** Ver también `web-factory/docs/MOTION_PATTERN_BANK_2026.md`.

## La mecánica: tres capas, cero layout

| Capa | Qué hace | Qué se anima |
|---|---|---|
| `.showcase::before` | La sala que se apaga | `opacity` 0 → 1 |
| `.card::after` | El halo del producto (gradiente **estático**) | `opacity` + `transform: scale()` |
| `.card img` / `.thumb` | El producto que prende | `filter: brightness/saturate` |

Cero `width`/`height`/`top`/`left`. El estado vive en un `data-attr`, no en clases repartidas por JS.

## Código

Demo funcional y verificado: [`index.html`](index.html), en esta misma carpeta.

```html
<section class="showcase" data-lights="off">
  <button class="lights" type="button" aria-pressed="false" aria-controls="grid">Lights</button>
  <ul id="grid" class="grid">
    <li class="card" style="--i:0">…</li>
  </ul>
</section>
```

```css
.showcase { position:relative; isolation:isolate; }

/* la sala que se apaga: UNA capa, solo opacity */
.showcase::before {
  content:""; position:absolute; inset:0; z-index:0; pointer-events:none;
  background:#0b0b0f; opacity:0;
  transition: opacity 320ms cubic-bezier(.16,1,.3,1);
}
.showcase[data-lights="on"]::before { opacity:1; }

.lights { position:relative; z-index:2; }
.grid   { position:relative; z-index:1; }

/* z-index:1 NO es decorativo — ver "la trampa", abajo */
.card { position:relative; z-index:1; }

/* el halo: gradiente ESTÁTICO, se animan solo opacity y transform */
.card::after {
  content:""; position:absolute; inset:-20%; z-index:-1; pointer-events:none;
  background: radial-gradient(closest-side, rgb(255 214 138 / .55), transparent 70%);
  opacity:0; transform: scale(.85);
  transition: opacity 320ms linear, transform 320ms cubic-bezier(.16,1,.3,1);
  transition-delay: calc(var(--i,0) * 40ms);   /* barrido, no todo junto */
}
.showcase[data-lights="on"] .card::after { opacity:1; transform: scale(1); }
.showcase[data-lights="on"] .card img    { filter: brightness(1.12) saturate(1.05); }
```

```js
const s = document.querySelector('.showcase');
s.querySelector('.lights').addEventListener('click', (e) => {
  const on = s.dataset.lights === 'on';
  s.dataset.lights = on ? 'off' : 'on';
  e.currentTarget.setAttribute('aria-pressed', String(!on));
});
```

## La trampa: `z-index:1` en `.card` (verificada mirando, no razonando)

`.card::after` usa `z-index:-1`. Si `.card` es `position:relative` **sin** `z-index` numérico no crea
stacking context: el halo escapa al contexto de `.showcase` (que sí lo tiene, por `isolation:isolate`)
y los negativos se pintan **debajo** de `.showcase::before`. Resultado: encendés las luces y **el halo
no aparece** — solo se oscurece el fondo.

Verificado en Chromium con el `index.html` de al lado, en los dos estados, más el control negativo:
forzando `.card{z-index:auto}` por consola, los halos desaparecieron por completo. Un `grep` no
detecta esto.

Segunda trampa del mismo tipo: con lights ON la grilla queda sobre fondo oscuro, así que **texto,
precio y badges de las cards tienen que invertirse en el mismo selector `[data-lights="on"]`** o el
contraste se rompe. Hay que abrir la página y mirarla en los dos estados.

## `prefers-reduced-motion`: muere el MOVIMIENTO, no el ESTADO

```css
@media (prefers-reduced-motion: reduce) {
  .showcase::before, .card::after { transition-duration:1ms; transition-delay:0ms; }
  .card::after { transform:none; }  /* llega encendido, sin recorrido ni escalonado */
}
```

El toggle sigue funcionando y sigue visible: nunca `display:none` al control, nunca cancelar el cambio
de estado. Lo único que muere es el viaje (`scale` + stagger). El navegador de la verificación tenía
`prefers-reduced-motion: reduce` **activo** (confirmado con `matchMedia`) y el estado ON igual llegó
completo.

**El camino que NO hay que tomar:** Finiam recalcula `background: radial-gradient(...)` desde JS en
cada `mousemove` — repinta cada frame, no es compositor-friendly, y el artículo ni menciona
`reduced-motion`. Gradiente estático en su propia capa + `opacity`/`transform` es la versión que se porta.

## Checklist antes de shippear

- [ ] Abierto y mirado renderizado en los DOS estados (no basta un 200 ni un grep)
- [ ] Texto/precio/badges legibles con lights ON
- [ ] `aria-pressed` cambia con el estado; el control se alcanza con teclado
- [ ] El toggle NO está atado a `prefers-color-scheme` ni al switcher de tema del sitio
- [ ] Con `reduced-motion` el estado sigue llegando
- [ ] El rubro justifica el patrón (producto que emite luz), no "quedaba lindo"

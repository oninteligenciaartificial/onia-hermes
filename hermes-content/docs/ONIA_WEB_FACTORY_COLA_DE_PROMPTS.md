# Web Factory — cola de prompts

**Ideas pendientes para el carril `web-factory`. NO son tareas de otro carril.**

> Un tema, un archivo, sin fecha: esto se EDITA. Cuando un prompt se ejecuta, se mueve a
> "Hechos" con el commit que lo cerró — no se borra, para no volver a proponerlo.

Anotadas el 2026-08-23 por Sergio. Ninguna fue perseguida en la sesión donde entraron:
la sesión estaba cerrando los frentes de producto y el objetivo era otro.

## Pendientes

Los cinco se **investigaron** (una sesión, cinco subagentes). La columna Estado es el
resultado de esa investigación, no del trabajo: **investigado ≠ hecho**. Nada de esto
está encendido en producción todavía.

| # | Prompt | De | Estado |
|---|---|---|---|
| P01 | Evaluar e instalar `genjutsu` y `motion-design-skill` | @sujeitoprogramador | Investigado → **ejecutar parcial** (1 de 2 entra de una) |
| P02 | El toggle "Lights" que enciende la grilla de productos | @andrew.plerdy | Investigado → **ejecutar** (patrón escrito + demo verificada) |
| P03 | La guía de una página como lead magnet (PRD) | @ianlee.js | Investigado → **ejecutar** (PRD con contenido real) |
| P04 | United Carriers: el eje de scroll que gira y el velocímetro | @oproductdesigner | Investigado → **ejecutar a medias** (rotación sí, velocímetro no) |
| P05 | Claude Design: cargar la marca una vez | @vison.studios | Investigado → **descartado** (ver Veredictos) |

## Antes de ejecutar cualquiera

- **P01 es el único que instala algo.** Evaluar licencia ANTES de instalar: ya se jubiló
  Remotion por licencia comercial. Si no es MIT o Apache-2.0, se mira y no se adopta.
  ✅ Las dos licencias se verificaron con la API de GitHub, no leyendo el README.
- **P02 y P04 son patrones de movimiento** → el destino del hallazgo es
  `web-factory/docs/MOTION_PATTERN_BANK_2026.md`, no un doc nuevo.
  ⚠️ **No se cumplió.** Los dos entregables se escribieron en
  `hermes-content/references/ui-patterns/<patrón>/`, que es donde viven los componentes
  con demo runnable (`chat-widget/`, `panel-claro-premium/`). No se re-escriben ahí: se
  agrega **una línea de enlace** desde el bank a cada README. Duplicar 300 líneas crearía
  dos fuentes del mismo patrón — el error que la regla existe para evitar.
- **P05 se cruza con trabajo ya hecho:** la marca del producto se unificó el 2026-08-23
  (`8dc76c1`, capa de tokens en `app/globals.css`). Leer eso antes de empezar, para no
  construir un segundo lugar donde vive la marca — sería justo lo que esa sesión arregló.
  ✅ Verificado: exactamente eso pasaría. Por eso se descarta.
- **P03 es material de cliente** ⇒ los precios se LEEN de `subscription-plans.ts` (planes)
  y `pricing.ts` (add-ons). No se escribe una cifra a mano.
  ✅ El PRD no lleva ninguna cifra de precio, ni testimonios, ni estado de obra.

---

## Veredictos

Una fila por prompt: qué es, qué se decidió, dónde quedó el entregable.

### P01 — `genjutsu` + `motion-design-skill` → EJECUTAR, con condición distinta cada uno

Dos skills públicas de UI/motion. Entregable:
`hermes-content/docs/research/web-factory-P01-genjutsu-motion-skill.md` (110 líneas).

| Repo | Licencia (API) | Tamaño | Decisión |
|---|---|---|---|
| `LottieFiles/motion-design-skill` | MIT | 34 KB · 1.368 ★ · push 2026-05-18 | **Copiar a `.claude/skills/`.** Skill de criterio (duración, easing, intención). Adopción trivial. |
| `AThevon/genjutsu` | MIT | 1.571 KB · 277 ★ · push 2026-07-31 (v3.3.0) | **Instalar como plugin, NO declarar default.** Probar solo `/genjutsu:cast` en una landing y mostrarlo renderizado antes de decidir. |

- Colisiones revisadas: `ui-ux-pro-max` no choca (la copia que trae genjutsu vive en
  `_jutsu/`, fuera del discovery). `gsap-skills` e `impeccable` son otras capas.
- Riesgo real, y no es de licencia: **`/genjutsu:paint` pisa el flujo obligatorio**
  `impeccable` + `onia-web-factory`. Queda congelado.

### P02 — Toggle "Lights" sobre la grilla → EJECUTAR

Patrón: un switch oscurece la página y enciende un halo detrás de cada tarjeta.
Entregables: `hermes-content/references/ui-patterns/toggle-lights-grilla/README.md`
(144 líneas) + `index.html` (67 líneas, demo runnable — misma convención que
`chat-widget/` y `panel-claro-premium/`).

**El snippet del encargo estaba roto.** Con `.card { position:relative }` sin `z-index`
numérico, el `.card::after { z-index:-1 }` se escapa del stacking context de `.showcase`
(`isolation:isolate`) y el halo se pinta DEBAJO de la capa oscura: encendés las luces y lo
único que pasa es que se oscurece el fondo. Fix: `z-index:1` en `.card` (+ `.grid`
z-index:1, `.lights` z-index:2). Verificado en Chromium en los dos estados y con control
negativo (forzando `z-index:auto` por consola, los halos desaparecen). Esto es exactamente
por qué la regla dice **MIRAR, no suponer**.

NO VERIFICADO: el reel original de @andrew.plerdy (Instagram exige login). Nadie vio si el
toggle fue un acierto o un error de conversión — el README lo dice explícito.

### P03 — Lead magnet de una página → EJECUTAR (el de más valor de negocio)

Entregable: `hermes-content/docs/ONIA_LEAD_MAGNET_GUIA_UNA_PAGINA_PRD.md` (154 líneas).

- **Guía elegida:** *"Facturación en línea 2026: cómo habilitarte GRATIS en el portal del
  SIN — 6 pasos"*. Descartadas: guía-de-PRDs (mercado equivocado), tips por rubro (sin
  urgencia), "qué exige el SIN" (ya está gratis en `/facturacion`; un magnet que repite una
  página pública no vale un correo). La elegida responde la pregunta que aparece DESPUÉS,
  sirve a los 5 rubros vendibles, y sale del checklist que ya hicimos con nuestro propio NIT.
- **Contenido real escrito**, no un índice: 7 bloques, los 6 pasos de la Oficina Virtual,
  los 5 datos a tener a mano, cierre honesto. El texto fiscal se LEE de
  `web-factory/apps/onia-platform/src/lib/siat.ts`, no se copia.
- **Hallazgo que cambia el plan de captura:** el intake de Onia Center
  (`web-factory/apps/site/src/app/api/onia-center/leads/intake/route.ts`) **descarta el
  email** y exige `negocio`/`nombre` — un envío de solo-correo devuelve 422. El PRD trae el
  parche de 3 líneas verificado contra ese archivo. Reusa el proxy `agenda-intake` y el
  `?src=`: cero endpoint nuevo, cero tabla nueva.
- **La landing no tiene analytics** (cero gtag / plausible / `@vercel/analytics`). La
  métrica es **conteo absoluto de leads por `src`**, no tasa de conversión. Dicho explícito
  en vez de inventar un porcentaje.
- NO VERIFICADO: si la guía de Ian Lee es de una página, y si su DM es manual.

### P04 — United Carriers: eje que gira + velocímetro → EJECUTAR A MEDIAS

Entregable: `hermes-content/references/ui-patterns/scroll-eje-y-velocimetro/README.md`
(162 líneas). Sitio identificado: unitedcarriers.com (Bearplus + Kenny Ho, Awwwards
3-ago-2026); la captura queda NO VERIFICADA y el README lo dice.

**El hallazgo central es que son dos efectos distintos, no uno:** la rotación responde al
**progreso** de scroll; el velocímetro, a la **velocidad**.

- **La rotación se porta y no deja deuda:** `animation-timeline: view()` nativo, con
  `@supports` y `prefers-reduced-motion`, más un fallback JS (IntersectionObserver + rAF
  que se apaga al salir del viewport) justificado por la tabla de soporte por navegador.
- **El velocímetro se documenta pero se desaconseja por defecto.** Algoritmo en 5 pasos +
  snippet vanilla de 18 líneas, y una sección "cuándo NO conviene" con las tres condiciones
  para el sí. Regla práctica para Onia: mostrar **progreso de lectura, no velocidad**.
- Licencias en tabla: **GSAP con `spdx_id` vacío ⇒ no se adopta** (mismo criterio que
  jubiló a Remotion). Lenis es MIT, pero acá es innecesario.

### P05 — Claude Design: cargar la marca una vez → DESCARTADO (mirar, no adoptar)

Entregable: `hermes-content/docs/research/web-factory-P05-marca-una-vez.md` (91 líneas).

Claude Design existe y es real (Anthropic Labs, `claude.ai/design`, Opus 4.7), y su Design
System sí hace "cargar la marca una vez" — **pero como espejo derivado del código, y solo
para lo que se genera dentro de su lienzo.** web-factory genera por su propio pipeline: no
toca el problema de P05.

Para el objetivo literal **ya está resuelto**: verificado que
`web-factory/apps/onia-platform/src/app/globals.css` (líneas 18-27, 86-88) tiene la escala
`--verde-50..900` byte a byte igual a la de `onia-platform/app/globals.css`, y las mismas
familias. Adoptarlo ahora sería **el segundo lugar que `8dc76c1` mató**.

Bloqueo adicional si se quisiera pilotar igual: la herramienta `DesignSync` responde pero
la skill `/design-sync` no está instalada, y el proyecto "Design System" de la cuenta está
vacío y es del 2026-06-30.

**La deuda que P05 no nombra, y que sí tiene retorno** (verificada en disco): hay **dos
paletas vivas fuera del producto** — `hermes-content/brand/tokens.css` (`#10C26B` + Space
Grotesk, se autoproclama *"single source of truth"*, la leen 3 generadores) y
`hermes-content/propuestas/assets/design-tokens.css` (`#005f70`, teal, **va a cliente**).
Un color de marca distinto en el material que firma el cliente es un problema real. Eso es
lo que hay que arreglar; Claude Design no lo arregla.

---

## Orden de ejecución

Un orden, no un menú. Criterio: valor por hora, qué desbloquea a los demás, y dónde está el
riesgo (licencia, superficie viva, segundo lugar de la marca).

### 1º — P03, el lead magnet. Es el único que trae plata.

Cuatro de los cinco prompts mejoran cómo se ve el sitio. Este es el único que produce
**correos de gente que quiere facturar en línea** *(decía «antes del 1-oct-2026»: ese plazo quedó
sin efecto, RND 102600000038, 30-sep-2026; corregido el 3-oct)*. El PRD ya tiene el contenido escrito y el parche de 3
líneas verificado contra el archivo real: lo que queda es aplicar, mirar renderizado y
encender. Es también el único con **superficie viva** (el intake de leads), así que va
primero y solo, con la sesión entera encima — no de refilón entre dos patrones de CSS.
Definición de hecho: un correo de prueba entra al pipeline con su `?src=` y se ve en
`/admin/solicitudes`.

### 2º — P01, pero solo `motion-design-skill`. 34 KB que desbloquean a los otros dos.

Copiar la skill MIT a `.claude/skills/` es un `cp` y cuesta minutos. Y es la que **da el
criterio para juzgar P02 y P04**: duración, easing, cuándo una animación tiene intención y
cuándo es adorno. Instalarla antes de tocar movimiento es el orden barato; al revés hay que
revisar dos veces.

**`genjutsu` se parte del paquete y baja al final de la cola.** MIT y sano, pero son 1,5 MB
de plugin con 15 sub-skills, y `/genjutsu:paint` pisa el flujo obligatorio `impeccable` +
`onia-web-factory`. Un plugin que compite con el pipeline de diseño no se prueba en el mismo
turno en que se toca producción. Cuando se pruebe: solo `cast`, en una landing,
**renderizado y mostrado a Sergio antes de decidir**, nunca declarado default.

### 3º — P02, el toggle Lights. Ya está hecho y verificado; lo que falta es usarlo.

README + demo runnable escritos, y el bug de stacking encontrado y arreglado MIRANDO la
pantalla. El costo restante es casi cero: una línea de enlace desde
`MOTION_PATTERN_BANK_2026.md` a los dos READMEs nuevos (P02 y P04), y aplicarlo la próxima
vez que haya una grilla de productos. **No se aplica a una superficie viva sin que Sergio
vea la pieza renderizada** — construir y publicar son dos permisos distintos.

### 4º — P04, solo la rotación. El velocímetro se queda en el papel.

`animation-timeline: view()` con `@supports` y `prefers-reduced-motion` es CSS nativo: entra
sin dependencia y sin deuda. El velocímetro queda documentado y **no se implementa**: la
sección "cuándo NO conviene" del propio README ya explica que para Onia lo que sirve es
progreso de lectura, no velocidad. Construirlo sería trabajo con valor cero.

### ✗ Descartado — P05.

El objetivo literal ya está resuelto por `8dc76c1`, y adoptar Claude Design crearía el
segundo lugar donde vive la marca que esa sesión eliminó. Encima está bloqueado
(`/design-sync` no instalada, proyecto vacío).

**Lo que sí vale de P05 no es P05**, y no es de este carril: unificar las **dos paletas
vivas fuera del producto** (`hermes-content/brand/tokens.css` verde `#10C26B` vs
`hermes-content/propuestas/assets/design-tokens.css` teal `#005f70`, esta última **va a
cliente**). Se anota como pendiente del carril de marca. No se arrastra a esta cola.

## Hechos

_(vacío — investigado no es hecho: nada de esto está encendido en producción)_

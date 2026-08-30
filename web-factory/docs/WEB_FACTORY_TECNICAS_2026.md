# Catálogo de Técnicas — Web Factory ONIA 2026

Fecha: 2026-08-29. Destilado de 15 despieces de sitios de referencia (JSON del corpus + HTML crudo + capturas). Cada técnica es un **patrón reutilizable observado en la calle**, no una idea nueva: se anota qué logra, el mecanismo mínimo, con qué de NUESTRO stack se hace, el tier, dónde encaja en el monorepo, y en qué sitios se vio.

Complementa a:
- `MOTION_PATTERN_BANK_2026.md` — decisión de stack de motion y patrones de movimiento (la fuente de las reglas duras).
- `WEB_FACTORY_PATTERN_BANK_2026.md` — secciones y copy.
- `CAROUSEL_PATTERN_BANK_2026.md`, `DASHBOARD_PATTERN_BANK_2026.md` — bancos hermanos.

Este documento es **estructura + composición**: el "qué construyo" de una sección. El "cómo se mueve" lo manda el Motion Pattern Bank.

---

## 0) Cómo leer este catálogo

Cada técnica trae seis campos:

- **Qué logra** — el efecto percibido, en una frase.
- **Mecanismo mínimo** — lo esencial para reproducirlo, sin la deuda del original (doble GSAP, tweakpane en prod, etc.).
- **Stack nuestro** — con qué de la casa se hace. Orden de preferencia SIEMPRE: **CSS puro → motion.dev → GSAP+ScrollTrigger**. Se sube de escalón solo cuando el de abajo no llega (regla del Motion Bank).
- **Tier** — **ligero** o **premium** (ver tabla abajo).
- **Dónde encaja** — `packages/blocks` (reutilizable en toda web de cliente), `packages/tokens` (sistema), o `apps/dental-premium` (el sitio premium Next, único que se banca peso alto y librerías especialista).
- **Anclado en** — sitios del corpus donde se observó (con la corrección de stack cuando el corpus se equivocó).

### Qué significa cada tier

| Tier | Costo | Va en | Regla |
|---|---|---|---|
| **Ligero** | CSS puro, o motion.dev sobre la base LazyMotion ya cargada. 0–pocas líneas de JS marginal. | Cualquier landing de cliente, incluido lo que roza dashboards. `packages/blocks`. | Es el piso. Un sitio de gama alta se ve caro con 4 mecanismos ligeros bien ejecutados (lección de amritpalace y ogaki). |
| **Premium** | Requiere GSAP+ScrollTrigger, WebGL/Three, canvas-sequence, o Lenis global. Peso alto, dynamic import obligatorio. | Solo `apps/dental-premium` (o la app que declare el especialista en su README). | Se agrega a ESA app, nunca al entry global, y se anota. Nunca "por si acaso". |

### Regla anti-template (recordatorio)

Cada superficie de cliente debe exhibir ≥4 Required Qualities (ver `design-quality`). Este catálogo está sesgado a las técnicas que **rompen el look plantilla**: bandas semánticas, ritmo no uniforme, tipografía-como-imagen, bordes que se dibujan. Un `grid repeat(3,1fr)` de cards uniformes con un solo acento decorativo es exactamente lo que estas técnicas existen para evitar.

### Reglas duras que aplican a TODO (del Motion Bank, no se repiten en cada ficha)

1. Compositor-only: `transform` / `opacity` / `clip-path`. Prohibido animar width/height/top/left/margin/font-size/background-color (los cross-fade de color se hacen con dos capas + opacity, o `@property`).
2. `prefers-reduced-motion` apaga todo: idle loops, parallax, scrub, count-up muestran el estado final estático.
3. Reveals disparan UNA vez (`viewport once`).
4. Los números fiscales no bailan. Count-up solo para métricas de pitch.
5. **Idle wobble prohibido** (motion-doctrine): el movimiento performa, no respira. Los `@keyframes floating/drift` que vimos en leoff se portan como parallax-on-scroll, nunca como loop decorativo.

---

## 1) HERO — la primera pantalla

### T1 — Split-hero (tipografía como imagen)

- **Qué logra:** un hero editorial sin banco de fotos ni render caro: el titular gigante (o la lettermark sobredimensionada recortada) ES la ilustración. Columna asimétrica, aire generoso.
- **Mecanismo mínimo:** grid asimétrico (titular a un lado, manifiesto angosto al otro), display en `clamp()` enorme con tracking apretado; opcional lettermark en `font-size: clamp(30vw, 40vw, 48vw)` dentro de `overflow:hidden`, posicionada para desbordar por un borde.
- **Stack nuestro:** CSS puro para el layout; reveal de líneas con motion.dev (T14).
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/hero-split`. Variante lettermark para landings de marca (Onia, ONIA Center).
- **Anclado en:** ogaki (lettermark "OGAKI" recortada + H1 serif), rre (split editorial texto puro sobre negro), readily (split + collage de papel), greptile (headline + iguana litografiada), amritpalace (video + H1 partido).

### T2 — Hero WebGL "que respira" (anillo audio-reactivo)

- **Qué logra:** un fondo vivo que late a una pista ambiente — imposible de percibir como plantilla. Es la pieza de hero más cara y más memorable.
- **Mecanismo mínimo:** N líneas (`THREE.Line`) sobre un círculo; cada frame recalcula el radio `baseR + sin(t·0.8 + j·0.22 + i)·amp` y lo suaviza con lerp `smooth += (target-smooth)·0.08` (el lerp es lo que da el flotar orgánico, no el seno crudo). `amp` escala por `intensity = 1 + beat·3.2`, con `beat` del promedio de las bandas bajas de un `AnalyserNode` (FFT 512). `ShaderMaterial` con fade `smoothstep` en los extremos. Sin audio: alimentar `beat` con un seno lento — el lerp+radio ya vende solo.
- **Stack nuestro:** Three.js, componente cliente con `dispose()` en unmount, gate por `prefers-reduced-motion` y por media-query (montar solo en desktop).
- **Tier:** premium.
- **Dónde encaja:** `apps/dental-premium` como `blocks/hero-webgl`, dynamic-imported. Nunca en el entry.
- **Anclado en:** frequencybreathwork (anillo de líneas Three.js detrás del H1). Primos más baratos: overlay (canvas de degradé animado en el óvalo del hero), unitedcarriers (glow azul + mapamundi line-art sobre video).

### T3 — Hero cinemático (video full-bleed + poster AVIF + lazy)

- **Qué logra:** escena en movimiento a sangre con primer frame instantáneo y LCP protegido.
- **Mecanismo mínimo:** `<video autoplay loop muted playsinline>` con `poster` AVIF liviano y `data-src`; un IntersectionObserver promueve `data-src → src` al entrar en viewport. El poster carga ya; el mp4 solo cuando corresponde.
- **Stack nuestro:** componente `<HeroVideo>` con IntersectionObserver, CSS `object-fit:cover; inset:0`.
- **Tier:** ligero (el peso es del asset, no del JS).
- **Dónde encaja:** `packages/blocks/hero-video`. Sirve a gastronómico, logística, cualquier cliente con footage.
- **Anclado en:** amritpalace (poster AVIF + lazy `data-src`), clay (bg-video), unitedcarriers (olas de mar + glow), farmminerals (campo de maíz).

---

## 2) BANDAS Y SUPERFICIES — el ritmo de la página

### T4 — Feature-en-banda-de-color (banda semántica por sección)

- **Qué logra:** cada feature "posee" un color pleno (amarillo=evidencia, cyan=cambio, verde=errores) y el scroll se siente como capítulos, no como una parrilla. Sube muchísimo la percepción de diseño con cero decoración.
- **Mecanismo mínimo:** tokens de superficie por banda (`--band-pollen`, `--band-sky`, `--band-meadow`…); cada `<section>` los aplica; un solo protagonista tipográfico (serif de contraste) carga toda la jerarquía. Las features alternan lado imagen/texto.
- **Stack nuestro:** CSS puro + tokens en `packages/tokens`.
- **Tier:** ligero.
- **Dónde encaja:** `packages/tokens` (preset de bandas por rubro) + `packages/blocks/feature-band`.
- **Anclado en:** readily (bandas pollen/sky/meadow, una por feature), leoff (banda full-bleed de color por sección), farmminerals (statement en banda verde/oliva sólida), greptile (banda oscura↔clara alternada).

### T5 — Cross-fade de fondo global dirigido por scroll

- **Qué logra:** el fondo de TODA la página transiciona entre colores nombrados a medida que scrolleás — da identidad a cada sección sin recolorear cada bloque a mano. Es la firma visual de readily.
- **Mecanismo mínimo:** un token `--page-bg` en el body; un IntersectionObserver (o scroll timeline) lee `data-bg`/`data-bg-at` de la sección visible y tweenea `--page-bg`.
- **Stack nuestro:** motion.dev `animate(document.body, {'--page-bg': color})` con observer; o CSS puro con `@property --page-bg` + `animation-timeline: view()` (cero JS).
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/scroll-bands` (wrapper de página).
- **Anclado en:** readily (`data-bg="cloud|dust|sky|meadow"` con disparo por `data-bg-at`).

### T6 — Recoloreo de marca por sección

- **Qué logra:** el logo y los tokens de acento cambian de color al entrar en cada bloque — para nosotros, **por rubro** (dental→azul, comercio→verde), dando identidad multi-rubro sin cambiar de página. La técnica más valiosa del corpus para ONIA.
- **Mecanismo mínimo:** un `ThemeContext` con un set de tokens por sección; cada `<section data-theme="dental">`; un IntersectionObserver escribe `--surface/--primary/--accent` en `:root` con un `transition` corto.
- **Stack nuestro:** CSS custom properties + motion.dev `inView()`. No hace falta GSAP.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/themed-section` (o provider global del sitio premium).
- **Anclado en:** máxima therapy (`LogoColorContext` + `AreasContext` recoloran logo/superficie por franja de edad).

### T7 — Banda con costura orgánica (Band + blob)

- **Qué logra:** el corte entre secciones es una curva/onda, no una línea recta — el sitio lee "diseñado". Combina con media recortada en blob (T18).
- **Mecanismo mínimo:** wrapper de sección con un SVG onda/curva absolute arriba, pintado del color del bloque siguiente (o pseudo-elemento sobredimensionado con `border-radius`). CSS puro.
- **Stack nuestro:** CSS puro.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/band` (slot de costura opcional).
- **Anclado en:** leoff (bandas de color separadas por borde orgánico curvo), elevatehome (bandas pastel).

### T8 — Doble-superficie como único recurso de color

- **Qué logra:** estructura y ritmo sin paleta cargada ni acentos decorativos — el cambio superficie-oscura ↔ superficie-clara ES la separación de capítulos. Barato de mantener, difícil que se vea template.
- **Mecanismo mínimo:** dos tokens (`--surface-dark`, `--surface-ice`) con sus pares de texto, alternados por sección; los bordes finos son el único adorno.
- **Stack nuestro:** CSS puro + tokens.
- **Tier:** ligero.
- **Dónde encaja:** `packages/tokens` (doctrina "two-surface").
- **Anclado en:** rre (negro `#07020A` ↔ azul-hielo `#D3E7F1`, una sola grotesca), unitedcarriers (negro ↔ blanco + un azul), clay (bone monocromo), ogaki (tinta sobre hueso).

---

## 3) STATEMENTS Y SCROLL — contar en el espacio

### T9 — Statement pantalla-completa

- **Qué logra:** cortar la densidad con una pantalla de un solo pensamiento (color pleno + una frase enorme + un botón). Sube el valor percibido y da aire — el respiro rítmico entre bandas densas.
- **Mecanismo mínimo:** `min-height:100svh`, grid centrado, título `clamp()` gigante, fondo = token de la sección; reveal por líneas al entrar.
- **Stack nuestro:** CSS puro para el layout; motion.dev `stagger` sobre líneas (o `@starting-style` para cero JS).
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/statement-full`.
- **Anclado en:** frequencybreathwork ("The art and science of breathwork"), farmminerals ("How much could you grow…"), overlay, ogaki ("Social-first, beauty-fluent…"), serotoninn ("A VISION IN MOTION"), huts, rre (quote-testimonial a pantalla).

### T10 — Scrub-pin de features segmentado (los N pasos que avanzan solos)

- **Qué logra:** una sola pantalla se queda fija y el usuario "avanza" por N pasos (01→02→03) con el scroll, sin apilar N secciones. Cuenta un proceso en el espacio de uno.
- **Mecanismo mínimo:** pinear el contenedor por `N*100vh`; mapear `scrollProgress` a un índice `floor(progress*N)`; cambiar el paso activo y la barra de progreso por tramos discretos (el `partHeight` de overlay).
- **Stack nuestro:** primero intentar `position:sticky; top:0; h-screen` + wrapper alto + motion.dev `useScroll` (patrón sticky+scrub del Motion Bank — cubre la mayoría). GSAP ScrollTrigger `{pin, scrub}` SOLO si hace falta pin anidado o snap por capítulos.
- **Tier:** ligero (sticky+scrub) → premium (si escala a GSAP pin).
- **Dónde encaja:** `packages/blocks/sticky-steps` (versión sticky); `apps/dental-premium` si sube a GSAP.
- **Anclado en:** overlay ("How it works" 01/02/03 pineado con scrub), huts (`project-feature` con panel sticky mientras la media scrollea), máxima (sticky con perspectiva).

### T11 — Scroll-sequence en canvas (producto cuadro a cuadro)

- **Qué logra:** girar/transformar un producto atado 1:1 al scroll, nítido y sin el tironeo de `video.currentTime` en móvil. La joya de farmminerals.
- **Mecanismo mínimo:** precargar N frames (webp, 24–48 suele bastar), un `<canvas>` sticky, `drawFrame(i)` con cover-fit (`ctx.drawImage`, escala = `max(cw/iw, ch/ih)`), y un tween `ease:"none"` de un `{frame}` proxy con `scrub:1` sobre un trigger alto + pin.
- **Stack nuestro:** GSAP ScrollTrigger.
- **Tier:** premium.
- **Dónde encaja:** `apps/dental-premium` como `blocks/scroll-sequence` (frames, pinLength). Calibrar nº de frames vs peso.
- **Anclado en:** farmminerals ("Meet CropTab" cuadro a cuadro en canvas).

### T12 — Hero-escena en sticky con perspectiva que se endereza

- **Qué logra:** una ilustración/panel entra inclinada en 3D y se aplana mientras scrolleás — profundidad de "escenario" sin WebGL.
- **Mecanismo mínimo:** contenedor `position:sticky; height:100svh; perspective:1200px; overflow:hidden`; hijo con `transform: rotateX(var(--p)) scale(var(--s))`; scroll-progress 0→1 mapea `--p` de ~18°→0° y `--s` de 1.1→1. Solo `transform`.
- **Stack nuestro:** motion.dev `scroll()` sobre las CSS vars; o GSAP ScrollTrigger scrub.
- **Tier:** premium (por el sticky-scene; el mecanismo es liviano pero pide cuidado de perf).
- **Dónde encaja:** `packages/blocks/perspective-stage` (si se resuelve con motion.dev puede bajar a ligero).
- **Anclado en:** máxima therapy (dos `sticky h-[100svh] perspective-[1200px]`).

### T13 — Palabra-titular gigante que escala al entrar (ScaleHeadline)

- **Qué logra:** un headline sobredimensionado cuyos tramos escalan y se asientan al aparecer — convierte una sola palabra en la sección entera.
- **Mecanismo mínimo:** partir el texto en spans (`Intl.Segmenter` o split manual); animar cada span `scale` + `opacity` con stagger disparado por `inView`; `clamp()` gigante en `font-size`.
- **Stack nuestro:** motion.dev `animate` + `stagger` (o GSAP SplitText). `will-change:transform` solo durante la animación.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/scale-headline`.
- **Anclado en:** máxima (`SplitScale`, la palabra "learn" escalando).

---

## 4) REVEALS — cómo entra el texto (el sello premium)

### T14 — Reveal de líneas con máscara + stagger (el default de la casa)

- **Qué logra:** cada línea sube desde detrás de un borde recto al entrar, con cadencia editorial. El "feel caro" barato, y el default para todo H1/H2 del sitio premium.
- **Mecanismo mínimo:** wrapper `overflow:hidden` por línea + hijo `translateY(110% → 0)`, `transition:transform` con `transition-delay: calc(var(--i) * 80ms)`. Disparar con UN IntersectionObserver que setea `.in` (no hace falta ScrollTrigger).
- **Stack nuestro:** motion.dev (`animate` + `delay: stagger(0.08)`) o CSS puro con IO. GSAP SplitText solo si se necesita reflow real por líneas con fuentes.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/reveal-lines` (ya existe el hermano `<SplitTextReveal>` en el kit de motion de onia-platform — reusar/portar).
- **Anclado en:** ogaki (`AnimateSlideMask`/`Content`, delay incremental), rre (line-clip `yPercent:110→0`), leoff (`AnimatedSplitText`, easeOutQuart), amritpalace (`letters-fade-in`), clay (SplitText).

### T15 — Reveal "desenfoque que enfoca" por palabra

- **Qué logra:** el headline aterriza como si la cámara enfocara — cada palabra pasa de borrosa a nítida en cascada. Mucho más caro visualmente que un fade, trivial de hacer.
- **Mecanismo mínimo:** partir en palabras, estado inicial `filter:blur(12–30px); opacity:0`, animar a `blur(0); opacity:1` con stagger pequeño, disparado al entrar.
- **Stack nuestro:** motion.dev `animate(words,{filter:['blur(24px)','blur(0px)'],opacity:[0,1]},{delay:stagger(0.05)})`. `filter` es la excepción permitida (elementos chicos, texto).
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks` como util `blurWordsIn()`.
- **Anclado en:** overlay (blur 30px→0 palabra por palabra), leoff.

### T16 — Reveal 3D por líneas (variante "depth")

- **Qué logra:** los titulares no aparecen, entran desde la profundidad con blur y rotateX — el reveal más rico del corpus. Atado al scroll para que el usuario controle el revelado.
- **Mecanismo mínimo:** partir en líneas; timeline `from → to` sobre `{opacity, yPercent, z, rotateX, filter:blur}` con `stagger:0.08`, `scrub:true` (entrada desde `z:-200, rotateX:10, blur(12px)`, salida a `z:-300, rotateX:-12`).
- **Stack nuestro:** motion.dev `useScroll`/`useTransform` mapeando progress→(y,blur,rotateX) por línea; o GSAP+ScrollTrigger si ya está en la app.
- **Tier:** premium (scrub atado a scroll + profundidad; medir en móvil).
- **Dónde encaja:** `apps/dental-premium`, variante "depth" de `reveal-lines`.
- **Anclado en:** frequencybreathwork (reveal 3D con blur y rotateX, `scrub:true`).

### T17 — Reveal-gate SSR-safe (patrón `pre-anim`)

- **Qué logra:** contenido revelado al entrar SIN flash en un render de servidor. Resuelve el FOUC que rompe los reveals sobre SSR.
- **Mecanismo mínimo:** la clase base pone `opacity:0; visibility:hidden`; un IO añade `.in` y una transición CSS mueve `transform/opacity`.
- **Stack nuestro:** motion.dev `inView()` o CSS `@starting-style` + IO; empaquetar como `<Reveal>` con `prefers-reduced-motion` cortando el transform.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/reveal` (primitiva base).
- **Anclado en:** huts (`.pre-anim` nace `visibility:hidden`), readily (`data-reveal` declarativo con `-y`/`-delay`), greptile (`opacity-0` + `translate-y` + IO).

---

## 5) MEDIA Y GALERÍAS

### T18 — Media recortada en blob (BlobImage)

- **Qué logra:** fotos con silueta orgánica en vez de rectángulos/círculos — marca instantánea, se sale del look plantilla.
- **Mecanismo mínimo:** 3–4 `<clipPath>` SVG con paths ameba + `clip-path:url(#blob-n)` sobre `<img>`; se rota el path por item. Cero JS.
- **Stack nuestro:** CSS/SVG puro.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/blob-image` (galerías, avatares de equipo, cards).
- **Anclado en:** leoff (`blob-mask`, 34 usos: Selection, nav del menú).

### T19 — Editorial-scroll horizontal / drag rail con inercia

- **Qué logra:** una fila de tarjetas/retratos que se arrastra con mouse o dedo y frena con física, con límites suaves — se siente app nativa, no scroll de web.
- **Mecanismo mínimo:** track con `translateX`; en drag actualizás `x`; al soltar, velocidad decreciente (inercia) y clamp `x` entre `0` y `-(trackW-viewportW)`.
- **Stack nuestro:** motion.dev `<motion.div drag="x" dragConstraints dragMomentum>` (inercia y límites nativos, cero plugin de pago). Alternativa cero-JS: `scroll-snap-type:x` + `overflow-x` si no hace falta el "throw".
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/drag-rail` (portfolios, casos, looks, testimonios, selector de módulos por rubro).
- **Anclado en:** overlay (Draggable + InertiaPlugin), leoff (drag slider + tilt 3D), readily (testimonios con drag + wheel, `is-dragging`), huts (`h-scroll-container` con snap), serotoninn.

### T20 — Video-on-hover con catálogo embebido y carga diferida

- **Qué logra:** la ficha de producto "cobra vida" al hover sin pagar el peso de N videos en el load inicial.
- **Mecanismo mínimo:** el HTML sirve solo el poster (`<img>`); los `src` de los `.mp4` viven en un JSON en la página. Al `mouseenter` se crea `<video muted loop playsinline preload=none>`, se setea el `src` y `.play()`; al `mouseleave` se pausa y descarga. Un `<video>` reutilizado por la grilla evita 20 elementos.
- **Stack nuestro:** `ProductCard` con hook `useHoverVideo(ref, src)`; motion.dev solo para el cross-fade poster↔video.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/product-card`. Encaja en cualquier storefront (Web Factory / Nuvia).
- **Anclado en:** serotoninn (`arrivals-anim.js` + `#all-products-data`).

### T21 — Video-on-intent (carga por click, no autoplay)

- **Qué logra:** grids de testimonio en video sin castigar LCP ni ancho de banda.
- **Mecanismo mínimo:** renderizar solo `<img>` poster + botón play; al click, montar `<video preload="auto" controls>` y `.play()`.
- **Stack nuestro:** componente `<VideoCard poster src>`, cero librería.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/video-card`.
- **Anclado en:** maticrobots (`preload="none"` + controls, sin autoplay), clay (bg-video con IO — variante de fondo).

### T22 — Bg-video con carga diferida por viewport (BgVideo)

- **Qué logra:** bandas de features que "respiran" con loop de producto sin costo de arranque.
- **Mecanismo mínimo:** `<video muted loop playsinline preload="none">` con la URL en `data-src`; un IO hace `video.src = data.src; play()` al entrar y `pause()` al salir. Poster estático para el primer frame.
- **Stack nuestro:** componente `<BgVideo>`, CSS `object-fit:cover; inset:0`.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/bg-video`.
- **Anclado en:** clay (`data-module="background-video"` ×8, `data-desktop` diferido), farmminerals (`farmer-video`).

---

## 6) DATOS, SPECS Y PRUEBA

### T23 — Specs comparadas (grid/tabla de dos columnas de color)

- **Qué logra:** "denso pero legible" — opone dos tipos de oferta (recurring vs on-demand, plan A vs B, seguro vs producto) con superficies de color opuestas en vez de bordes. Evita la tabla-de-precios genérica.
- **Mecanismo mínimo:** CSS grid de 2 columnas, cada `<ul>` con su token de superficie; filas separadas por color, no por línea.
- **Stack nuestro:** CSS puro + tokens.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/split-list` (variant warm/cool).
- **Anclado en:** elevatehome (Recurring / On-demand, crema vs coral), rre (Investment areas, grid de sectores con bordes dibujados), greptile (tabs para comprimir 3 casos pesados en el alto de uno).

### T24 — Specs por tabs (comprimir prueba densa)

- **Qué logra:** mostrar 3 ejemplos pesados (NVIDIA/Meta/Solana) en el alto de uno, sin alargar la página.
- **Mecanismo mínimo:** un panel, estado `activeTab`, crossfade `opacity`+`translateY` corto al cambiar.
- **Stack nuestro:** motion.dev `AnimatePresence` o CSS `data-state`.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/spec-tabs`.
- **Anclado en:** greptile ("Catch them all", tabs NVIDIA/Meta/Solana), overlay (Splide fade en el panel de looks).

### T25 — Métricas sobre foto / tabla de métricas con reglas (StatRows)

- **Qué logra:** comunicar cifras con jerarquía tipográfica y líneas horizontales en vez de tarjetas — se ve editorial, no template. Reemplaza las stat-cards genéricas que la política anti-template prohíbe.
- **Mecanismo mínimo:** lista con `border-top` por fila, número display grande a la izquierda, label chico a la derecha; contador animado on-enter opcional.
- **Stack nuestro:** CSS puro; count-up con motion (T26) disparado por IO.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/stat-rows`.
- **Anclado en:** farmminerals (4 / 100x / 0.5 ton / ≥5x con reglas), readily (90% / $734K / 20→150 sobre foto), huts ("200K+ square feet").

### T26 — Odómetro de stats en vivo (count-up on-reveal)

- **Qué logra:** un número de impacto que sube de 0 al entrar en viewport — sensación de producto vivo y foco.
- **Mecanismo mínimo:** IO dispara un `requestAnimationFrame` que lerp-ea de 0 al target con easing; render en `font-variant-numeric: tabular-nums` (sin salto de ancho).
- **Stack nuestro:** hook `useCountUp` (motion.dev `animate(0,target,{onUpdate})` o rAF a mano ~15 líneas). Respeta `prefers-reduced-motion` mostrando el valor final. **NUNCA para montos de factura.**
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/count-up`.
- **Anclado en:** maticrobots (odómetro `418,772,566`), unitedcarriers (`data-count`: 2.500+, 98,2%, 8+), farmminerals.

### T27 — Stat-stack (métricas grandes en celdas con borde animado)

- **Qué logra:** 3–4 números "hero" apilados, cada uno en su celda separada por una regla que se dibuja — convierte cifras sueltas en un bloque con peso institucional.
- **Mecanismo mínimo:** grid de una columna, número display XXL + label caps chico, borde inferior por celda con la técnica de bordes que se dibujan (T31).
- **Stack nuestro:** CSS + IO (combina T31 + T26).
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/stat-stack`.
- **Anclado en:** rre (`$2.5B+` / `125+` / `400+` en celdas con borde).

### T28 — Reveal/wipe de imagen con divisor (patrón "VS")

- **Qué logra:** comparación A/B o descubrimiento de imagen que entra con un corte, no un fade.
- **Mecanismo mínimo:** contenedor con dos imágenes apiladas; `clip-path: inset()` animado de 100%→0% ligado al progreso de entrada; el divisor es un SVG en el borde del clip.
- **Stack nuestro:** motion.dev `whileInView` sobre `clipPath`; o GSAP ScrollTrigger scrub.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/compare-reveal` (before/after, specs, antes-después).
- **Anclado en:** elevatehome ("Homeowners Insurance VS Homescription", `ImageScrollReveal` con divider SVG).

---

## 7) MARQUEE, RUTAS Y ATMÓSFERA

### T29 — Marquee (cinta infinita) con loop matemáticamente limpio

- **Qué logra:** cinta infinita de testimonios/logos/sponsors sin salto. La técnica más barata y más reutilizable del corpus.
- **Mecanismo mínimo:** renderizar la lista **dos veces** en un track y animar `translateX(0 → -50%)` — al llegar a -50% el segundo set está exacto donde arrancó el primero. Duplicá los items en el mapeo.
- **Stack nuestro:** CSS `@keyframes` puro (cero JS) o motion.dev con `repeat:Infinity`. Pausar en `:hover`, respetar reduced-motion.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/marquee`.
- **Anclado en:** frequencybreathwork (testimonios del hero), amritpalace (reseñas, `marquee_track`), clay (logos + `marquee-up/down`), unitedcarriers (footer + LinkedIn), ogaki (logo strip), leoff (loader `AppAutoScroller` dos carriles).

### T30 — Ruta-hito que se dibuja con scroll (process-route)

- **Qué logra:** convierte una lista de pasos/servicios en un camino visual con nodos; el trazo se completa a medida que scrolleás — sensación de recorrido. Ideal para onboarding por rubro y "cómo funciona".
- **Mecanismo mínimo:** columna flex de ítems; una línea conectora como pseudo-elemento con `transform: scaleY()` (origen arriba) atada al progreso de scroll de la sección; nodos que cambian de estado al cruzar el centro del viewport.
- **Stack nuestro:** motion.dev `useScroll({target, offset})` → `scaleY`; o CSS `scroll-timeline` puro sin JS.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/process-route`.
- **Anclado en:** unitedcarriers (el gráfico-T "RELIABILITY AT EVERY MILESTONE", carretera dibujada con divs).

### T31 — Bordes de layout que se auto-dibujan (self-drawing grid rules)

- **Qué logra:** la retícula no está "puesta", se construye ante tus ojos al scrollear — sensación de precisión/ingeniería sin una sola imagen.
- **Mecanismo mínimo:** elementos de 1px con `transform-origin` en un extremo, animados de `scaleX/scaleY: 0 → 1` una sola vez al entrar. Horizontales lentas (~0.9–1.2s), verticales rápidas, para jerarquía.
- **Stack nuestro:** CSS puro + IO (`.rule{transform:scaleX(0);transform-origin:left;transition:transform .9s cubic-bezier(.16,1,.3,1)}` + `.in{transform:scaleX(1)}`). No hace falta GSAP.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/grid-reveal` (envolviendo tablas/specs/métricas/comparativas).
- **Anclado en:** rre (`.grid-horizontal-border` scaleX 0→1, 3s horizontales / 1s verticales).

### T32 — Props flotantes en parallax (nubes / blobs)

- **Qué logra:** llena campos vacíos con vida sin costo de layout — formas SVG que derivan a distinta velocidad que el scroll, dando profundidad ("patio de juegos" o "atmósfera").
- **Mecanismo mínimo:** SVGs `position:absolute` con un "speed" (0.05–0.6); en cada frame `y = scrollProgress * speed * distancia`. Solo `transform: translate3d`. **El float idle del original se porta como parallax-on-scroll, no como loop** (idle wobble prohibido).
- **Stack nuestro:** hook `useParallax(speed)` sobre motion.dev `useScroll`+`useTransform` (o Lenis si la app ya lo usa).
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/parallax-layer`.
- **Anclado en:** elevatehome (`data-scroll-speed` 0.075/0.3 en nubes), máxima (`useCloudComponent`), leoff (blobs — portados como parallax, no como `@keyframes floating`).

### T33 — Mapa vivo con puntos escalonados (pulse-map)

- **Qué logra:** fondo de "cobertura/red global" que respira sin costo de librería; cada punto late en su propio tiempo → orgánico, no robótico.
- **Mecanismo mínimo:** dots `position:absolute` sobre un mapa line-art, un solo `@keyframes pulse`, y `animation-delay: var(--d)` distinto por dot. Cero JS.
- **Stack nuestro:** CSS puro + tokens.
- **Tier:** ligero (nota: es idle loop — permitido acá porque el mapa de cobertura no compite con un clímax narrativo; si va en una escena con dirección, gate por reduced-motion y bajar la amplitud).
- **Dónde encaja:** `packages/blocks/pulse-map` (hero de importadora/B2B, sección "cobertura").
- **Anclado en:** unitedcarriers (`world-wide-dot`, delay por punto), farmminerals (field trials map).

---

## 8) MICRO-INTERACCIONES Y FIRMA

### T34 — Hover-lift / botón text-swap vertical

- **Qué logra:** hover premium sin cambio de color — el label rota verticalmente a una segunda copia, o la card se eleva con sombra designed.
- **Mecanismo mínimo:** `.mask{overflow:hidden}` con dos spans apilados; `:hover .current{translateY(-100%)}` y `.hover{translateY(0)}`, misma curva. 100% CSS.
- **Stack nuestro:** CSS puro (variante de `<Button>`).
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/button` (variante text-swap) + tokens de hover/focus/active.
- **Anclado en:** ogaki (`ButtonTextHover translateY`), leoff (tilt 3D al hover), clay (`hover-arrow` ×111).

### T35 — Text-scramble en hover de links

- **Qué logra:** el texto del link "se descifra" al pasar el mouse — carácter de producto técnico sin ruido.
- **Mecanismo mínimo:** en hover, reemplazar cada char por uno random y resolverlos progresivamente con un `setInterval` corto hasta el texto final. Respetar `prefers-reduced-motion` (saltar el efecto).
- **Stack nuestro:** util `scramble.ts`, opt-in por `data-`.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks` (nav/CTA del sitio premium).
- **Anclado en:** unitedcarriers (`data-link-random` ×47).

### T36 — Header/marca auto-invertida con mix-blend-mode

- **Qué logra:** una barra fija legible sobre secciones claras y oscuras sin observar cada sección ni togglear tema por JS.
- **Mecanismo mínimo:** elemento `position:fixed; mix-blend-mode:difference; color:#fff` — se invierte solo contra lo que pasa por detrás. Fallback `color` sólido si el navegador no soporta blend.
- **Stack nuestro:** CSS puro (utilidad de layout).
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/site-header`. Elimina el típico script "sección clara/oscura → togglear nav".
- **Anclado en:** ogaki (`mix-blend-mode:difference` en el header), serotoninn (cursor custom con el mismo truco).

### T37 — Marco blueprint punteado con cruces en esquina

- **Qué logra:** cualquier contenedor lee "plano técnico / dev-tool" sin peso — identidad schematic a costo cero de JS.
- **Mecanismo mínimo:** wrapper con `border: 1px dashed var(--line)` + cuatro pseudo-hijos con un `+` de tick en cada esquina, `position:absolute`.
- **Stack nuestro:** CSS puro.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/blueprint` (frame de sección y de card).
- **Anclado en:** greptile (`border-dashed` ×161 + marcadores `plus-`/`tick-`).

### T38 — Sticker/badge numerado sobre cards de feature

- **Qué logra:** jerarquía y secuencia ("01", "02") con carácter editorial, rompiendo la uniformidad de un grid.
- **Mecanismo mínimo:** badge absoluto rotado ligeramente (`rotate:-4deg`), superpuesto a la esquina de la imagen; vector de fondo + label. Cero JS.
- **Stack nuestro:** CSS puro (slot opcional).
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/feature-card` (slot `badge`).
- **Anclado en:** elevatehome (`Sticker` "01"), serotoninn (índice numerado `0X.`).

### T39 — Índice editorial numerado + labels verticales

- **Qué logra:** estructura de revista (`02. NEW ARRIVALS`, labels `NEW DROP/SALE` rotados 90°) que hace ver intencional una grilla que si no sería un catálogo genérico.
- **Mecanismo mínimo:** `writing-mode: vertical-rl` + `text-orientation` para los labels; contador CSS (`counter-reset`/`counter-increment` + `::before content: counter()`) para numerar secciones sin escribir los números a mano.
- **Stack nuestro:** CSS puro.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/section-header` (número auto + label vertical opcional).
- **Anclado en:** serotoninn (`0X.` + labels rotados), huts (dividers numerados).

### T40 — Lettermark/wordmark gigante sangrando (BrandBleed)

- **Qué logra:** cierre de marca memorable sin imagen — el logotipo enorme recortado por el borde del viewport.
- **Mecanismo mínimo:** un `<span>` con `font-size: clamp(20vw, 28vw, ...)`, `overflow:hidden` en el contenedor y `line-height` que empuja media letra fuera de cuadro; opcional `mix-blend` sobre el bloque de color.
- **Stack nuestro:** CSS puro.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/brand-bleed` (último módulo del sitio premium).
- **Anclado en:** maticrobots ("matic"), ogaki ("OGAKI"), serotoninn ("SEROTOINN"), huts ("HUTS"), greptile.

### T41 — Flourish / subrayado SVG que se dibuja bajo un titular

- **Qué logra:** acento manuscrito premium sobre una palabra del H1.
- **Mecanismo mínimo:** `<svg>` con `path` de `pathLength="1"`, `stroke-dasharray:1; stroke-dashoffset:1`, y al revelar `dashoffset→0`.
- **Stack nuestro:** motion.dev `animate(path,{strokeDashoffset:0})` o transición CSS pura (sin plugin DrawSVG). El `pathLength` de motion cubre el SVG draw sin GSAP.
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/hero-split` (slot flourish).
- **Anclado en:** huts (`w-flourish` + `underline-svg path.stroke`).

---

## 9) ATMÓSFERA DE CARGA Y SCROLL BASE

### T42 — Preloader-gate con contador real de assets

- **Qué logra:** convierte la espera en un momento de marca (contador editorial tipo "…% LOADING") y garantiza que el primer scroll ya tenga todo pintado — clave con reveals y smooth-scroll.
- **Mecanismo mínimo:** `Promise.all` sobre imágenes/fuentes above-the-fold; un contador que interpola 0→100 con rAF hacia el % real de recursos resueltos; al terminar, una salida (`clip-path`/`translateY`) que revela el hero.
- **Stack nuestro:** componente `<Loader/>`, CSS para la barra/número, motion.dev para la cortina de salida.
- **Tier:** ligero (pero solo para landings de alto impacto).
- **Dónde encaja:** `apps/dental-premium` (NO para dashboards — un loader que tapa contenido lento viola "verificar es mirar").
- **Anclado en:** serotoninn (`loader.js`, preloader-gate; el "22% LOADING" es de la captura, no del HTML), leoff (PageLoader con autoscroller), unitedcarriers (map preloader).

### T43 — Paper-cutout collage animado

- **Qué logra:** una composición de fotos recortadas tipo papel que se ensambla/mueve — suaviza la seriedad de un producto clínico con calidez editorial.
- **Mecanismo mínimo:** capas `<img>` recortadas (clip-path o PNG con alpha) con `data-parallax` a distinta velocidad; se ensamblan al entrar.
- **Stack nuestro:** motion.dev `useScroll` + parallax por capa (T32).
- **Tier:** ligero.
- **Dónde encaja:** `packages/blocks/paper-collage`.
- **Anclado en:** readily (`data-paper-animation`, cielo + paisaje recortados).

### T44 — Smooth-scroll base (Lenis) sincronizado con reveals

- **Qué logra:** scroll con inercia sedosa sin desincronizar los triggers de animación; la base perceptual de casi todo el corpus premium.
- **Mecanismo mínimo:** Lenis toma el control del scroll; en cada `lenis.on('scroll')` se llama al update del motor de scroll-triggers (`ScrollTrigger.update` + `gsap.ticker`, o el `useScroll` de motion). Una escena WebGL corre su propio rAF aparte.
- **Stack nuestro:** provider `<SmoothScroll>` (Lenis) en el layout del sitio premium. **Regla: `prefers-reduced-motion` lo desactiva.** El default de la casa NO es Lenis — se agrega solo cuando el brief lo pide.
- **Tier:** premium (wrapper de sitio, no bloque; ~15 kb + acopla el scroll global).
- **Dónde encaja:** `apps/dental-premium` (layout).
- **Anclado en:** frequencybreathwork, overlay (`Lenis duration:1.1`), amritpalace (`duration:1.2`), leoff, huts, elevatehome, ogaki, serotoninn, unitedcarriers, farmminerals. (Casi universal en la gama alta; casi ausente en las Next puras tipo maticrobots/greptile, que se banca todo con transiciones CSS.)

---

## 10) Correcciones de stack del corpus (para no repetir el error)

El detector del corpus marcó "Webflow" en varios sitios que NO lo son. Al portar, verificar contra el HTML crudo, no contra el JSON:

| Sitio | Corpus dijo | Real (HTML) |
|---|---|---|
| máxima therapy | Webflow, Vite | React Router v7 / Remix + Vite + Matter.js |
| maticrobots | Webflow, Next | Next.js (pages router) + Tailwind |
| ogaki | (Monaco) | Next.js App Router + styled-components 6 + Lenis, **sin GSAP** |
| serotoninn | swiper fonts | WordPress tema custom + WooCommerce + Lenis + Lottie |
| leoff | astro | Nuxt 3 + Sanity + GSAP SplitText ("astro" = substring de "g**astro**nomy") |
| huts | Webflow, Lenis | Nuxt + Sanity + Lenis + Swiper (video = 1 solo mp4) |
| readily | Webflow | Astro + Tailwind + GSAP |
| greptile | Webflow | Next.js + Tailwind + Lottie |
| elevatehome | (wf residuo) | Next.js + Lenis + Rive |
| rre | (bien) | Webflow + GSAP 3.15 (confirmado) |
| clay | (bien) | Webflow + GSAP/ScrollTrigger/SplitText (confirmado) |

Fuentes reales frecuentemente NO capturadas por el sniff (salen `Arial`/`webflow-icons`/`unset`): identificar por captura, no por el array `fonts`. La lección transversal: **el JSON es índice, el HTML crudo es la verdad.**

---

## 11) Resumen operativo

- **Piso de toda web de cliente (ligero, `packages/blocks`):** T14 reveal-lines · T9 statement-full · T29 marquee · T25 stat-rows · T4 bandas de color · T34 hover-lift. Con esos seis bien ejecutados un sitio se ve caro (lección amritpalace/ogaki).
- **La joya multi-rubro:** T6 recoloreo por sección — un rubro nuevo se enciende cambiando tokens, no maquetando otra página.
- **Techo premium (`apps/dental-premium`, dynamic import + gate):** T2 hero WebGL · T11 scroll-sequence canvas · T16 reveal 3D · T44 Lenis. Nunca en el entry global, siempre anotado en el README de la app.
- **Escalada de stack:** CSS puro cubre ~60% del catálogo (bandas, marquee, blueprint, blob, bordes que se dibujan, wordmark bleed). motion.dev cubre el reveal/drag/scroll declarativo. GSAP+ScrollTrigger SOLO para pin real, scrub de secuencia y split por líneas con reflow.

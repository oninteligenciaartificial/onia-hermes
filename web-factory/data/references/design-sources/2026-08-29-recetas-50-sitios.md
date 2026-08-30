# Recetas 50 sitios — complemento anclado al Playbook por rubro

Companion de `2026-08-29-vertical-playbooks.md`. **No lo reemplaza:** agrega y corrige donde el
despiece del HTML crudo + captura mejora o desmiente lo que había. Cada entrada está anclada a los
tres insumos (corpus JSON, HTML crudo, captura); las inferencias sin captura se marcan.

> **Cómo leer esto:** el playbook manda en paleta/tipo por rubro. Acá viven (1) las **correcciones**
> de stack y de etiqueta que el crawler metió mal, (2) los **exemplars nuevos con dato duro** por
> rubro, y (3) las **técnicas cosechadas** listas para `packages/blocks`. Donde el playbook ya está
> bien anclado (ej. su §0 de ruido de scraper, sus tiers de motion), no se repite.

---

## 0. Correcciones al playbook y al corpus (leer antes de usar un exemplar)

El crawler etiquetó rubro y stack por heurística y falló seguido. Verificado contra HTML crudo:

| Sitio | Corpus decía | Real (crudo) | Impacto |
|---|---|---|---|
| frequencybreathwork | rubro "dental-salud" | **breathwork/wellness** → Estética | ya citado bien en playbook §2; el rubro del corpus es basura |
| maximatherapy | Webflow + Vite; `fonts:[]` | **React Router v7/Remix + Vite + Tailwind**; display globo pesado | playbook §1 lo daba "sin señal tipográfica" — ahora anclado |
| overlay | Webflow (ok); fonts basura | Webflow + **GSAP+Lenis+Splide**; serif alto contraste real | nuevo exemplar Estética |
| ogakidigital | (nuevo) | **Next + styled-components + Lenis, SIN GSAP** | nuevo exemplar Estética |
| serotoninn | (ok comercio) | **WordPress tema custom + Lenis + Lottie** (Woo *inferido*), no builder | confirma grid uniforme + índice numerado |
| maticrobots | Webflow + Next | **Next pages-router + Tailwind**, cero Webflow | nuevo exemplar Comercio/producto |
| leoff-paris | "astro" (falso positivo en g**astro**nomy) | **Nuxt 3 + Sanity + GSAP *inferido*** | nuevo exemplar Gastronomía |
| huts | Webflow + Lenis | **Nuxt + Sanity + Lenis + Swiper, SIN GSAP**; 1 solo video | playbook §5 ya lo cita; corregir stack |
| clay | Webflow (ok) + GSAP | Webflow + GSAP/ScrollTrigger/SplitText | playbook §6 ok; sumar técnicas |
| farmminerals | (nuevo) | **Webflow + GSAP+ScrollTrigger+SplitText + Lenis + Bunny CDN** | agri-tech producto; técnica canvas-scrub |
| rre | rubro "importadora" | **venture capital**; Webflow + GSAP 3.15 | mal etiquetado → Servicios/corporativo |
| unitedcarriers | (nuevo) | **Webflow + Ecommerce + Lenis + Barba + Finsweet, SIN GSAP** | **el ancla real de Importadora/logística** |
| greptile | Webflow | **Next + Tailwind + Lottie, SIN GSAP/Lenis/Framer** | SaaS/tech (playbook §8) |
| readily | Webflow | **Astro + Tailwind + GSAP + PostHog** | resuelve el misterio PP Fragment Glare (abajo) |

**Resuelto el fantasma "PP Fragment Glare".** El playbook §1 lo marcó como nombre de fuente
**inventado** (el crítico lo cazó presentado como corpus dental). No estaba inventado: es la fuente
**real de readily.ai** (`PP Fragment Glare` Light+Regular, serif de alto contraste). El error fue de
**atribución** (se coló de readily a dental), no de existencia. Para dental sigue sin haber ancla real
— la nota del playbook §1 queda válida: cosechar clínicas dentales reales. Equivalente libre de
Fragment Glare: **Fraunces opsz 144** o **Playfair Display**.

**Regla nueva confirmada por 6 sitios:** el peso de estos sitios NO viene de gradientes ni de un
motor pesado — viene de **una técnica barata bien ejecutada** (borde que se dibuja, blob-mask,
mix-blend, video-on-hover, canvas-scrub). rre.com hace un sitio entero premium con **Arial y dos
superficies**. Refuerza el §0 anti-plantilla del playbook: la identidad es composición + motion, no
decoración.

---

## 1. Dental / Salud — ancla infantil real (maximatherapy)

Corrige el "sin señal tipográfica" del playbook §1 para el sub-eje infantil.

- **Paleta (crayón saturado sobre crema), anclada por captura:** campo dominante amarillo pálido +
  blanco de tarjetas; primario azul `#006AFF`/`#2668FD`; acentos semánticos por bloque —
  rojo-naranja `#FF2700`/`#FD4401` (tarjeta + la 'x' del wordmark), verde (banda CTA), amarillo
  `#FDCB40`, púrpura `#A864FD`; tinta `#301F0F`/`#050505`. Confirma el régimen multi-primario del
  playbook.
- **Par tipográfico (NUEVO, por captura — el `fonts:[]` iba self-hosted):** display **globo
  redondeado muy pesado** (letras casi tocándose, "learn"/"maxima" bubbly) + body **grotesca neutra**.
  Equivalente libre: **Fredoka** / **Baloo 2** (heavy) titular + **Hanken Grotesk** body.
- **Estructura (larga, no 3 secciones como dijo el crawler):** hero-escena 3D en `sticky` con
  `perspective:1200px` → statement palabra-gigante ("learn") con SplitScale → imagen editorial con
  máscara → ilustración de marca (arco-playground SVG) → 3 pasos (Referral/Plan/Grow) → grid 4
  servicios → banda CTA verde → footer con wordmark "maxima" gigante + parallax. Muy aireado arriba,
  denso al pie.
- **Motion (GSAP, no Framer, sin Lenis):** ScrollTrigger + SplitText + Draggable + `SplitScale`
  custom; `MaskImage` reveal; **recoloreo de marca por sección** (`LogoColorContext`/`AreasContext`);
  `useFooterParallax` + nubes flotantes; `BounceButton` magnético; Matter.js (mini-playground físico —
  ROI bajo, no portar). Sin `<video>`.
- **Exemplar:** https://maximatherapy.com/ (terapia infantil, React Router + GSAP, "The First Years
  Matter Most").

---

## 2. Estética / Wellness — 3 exemplars nuevos anclados

El playbook §2 ya tiene frequencybreathwork citado; acá el dato duro que faltaba y dos sub-ejes más.

**2a. Wellness cine (frequencybreathwork) — ahora con el mecanismo exacto:**
- Paleta: crema-arena `#F2EFE9`/`#DFD7C8` + negro `#242424`/`#000` (hero y footer) + acento frío
  gris-pizarra `#758696` + arena `#CCC0A8`. Cero saturado (el `#3898EC` es solo el default Webflow).
- Tipo: display **serif de alto contraste** (Canela/Editorial New-ish, servida por Webflow, no en el
  `fonts[]`) + body sans neutra. Equiv libre: **Fraunces opsz 144** + **DM Sans**.
- Stack real: Webflow + **GSAP 3.15 + ScrollTrigger + SplitType + Lenis + Three.js 0.159 (WebGL) +
  Splide + Vimeo**. Doble carga de GSAP = deuda, no diseño.
- Firma cara: **anillo de líneas WebGL audio-reactivo** en el hero (respira con una pista) + reveal 3D
  por líneas (`opacity/yPercent/z/rotateX/blur` con `scrub:true`).
- Exemplar: https://frequencybreathwork.com/

**2b. Beauty-tech mono-lila (overlay) — nuevo:**
- Paleta: superficie off-white lila `#FBF9FB`/`#FCFAFC`; primario índigo `#2E2F53`; **acento único
  azul eléctrico `#005FFF`** SOLO en afordancias (badge, foco, flecha) + familia de degradés
  lila-durazno para fondos de tarjeta. Casi monocromo lavanda.
- Tipo: display **serif alto contraste** (transitional/didone) + sans caps con tracking amplio para
  kickers. Equiv libre: **Fraunces**/**Playfair** + **Space Grotesk** (caps).
- Stack: Webflow + **GSAP 3.15 (ScrollTrigger·SplitText·Draggable·InertiaPlugin) + Lenis 1.3.4 +
  Splide**. Con `<video>` de fondo en loop.
- Firmas: **reveal por palabra desenfoque→foco** (`blur(30px)→0`), **pin + scrub segmentado** (pasos
  01/02/03 avanzan en un panel fijo), **galería arrastrable con inercia**.
- Exemplar: https://overlay.com/

**2c. Beauty agency editorial (ogaki) — nuevo, y sin GSAP:**
- Paleta: blanco hueso cálido `#F2EDEB`/`#E8E4E1` + tinta casi-negra `#221F20`/`#030303`. **Sin acento
  cromático** — el color lo ponen las fotos de producto. Monocromo tinta-sobre-hueso.
- Tipo: **Reckless** (serif editorial contraste) + **GT America** (grotesca body) + **Monaco** (mono
  labels: reloj, "(WE ARE)", "CASE STUDIES"). Equiv libre: **Newsreader**/**Fraunces** + **Hanken
  Grotesk** + **Space Mono**.
- Stack: **Next App Router + styled-components 6.0.8 + Lenis, SIN GSAP** (el "splittext" del corpus es
  un `SplitTextWrapper` propio). Animación = CSS transitions + Lenis.
- Firmas: **máscara + stagger por `transition-delay`** (`AnimateSlideMask/Content`, sin lib de scroll),
  **botón text-swap vertical** (dos copias enmascaradas), **lettermark gigante recortada** como
  imagen del hero, **header auto-invertido con `mix-blend-mode:difference`**.
- Exemplar: https://ogakidigital.com/

---

## 3. Comercio / Tienda — 2 exemplars nuevos

El playbook §3 ya cita serotoninn; acá el stack real y un régimen de producto-tech distinto.

**3a. Moda underground (serotoninn) — stack corregido + técnicas:**
- Paleta (por captura, el hex del JSON es el preset default de WordPress → descartar): off-white cálido
  `#F8F8F8` + tinta negra `#18181B` + **acento rojo spray** + spot naranja `#FF6900`.
- Tipo: **grotesca condensada pesada** (índices `0X.`, "BOLD FASHION", wordmark, muy tight) + grotesca
  neutra body. Equiv libre: **Archivo**/**Anton**/**Oswald** + **Space Grotesk**. (Familia exacta no
  consta: tema custom con `@font-face`.)
- Stack: **WordPress + WooCommerce + tema custom `ref/` + Lenis + Lottie**. Motion casero por pieza
  (`loader.js`, `arrivals-anim.js`, `custom-cursor.js`, `footer-anim.js`). Sin GSAP.
- Firmas: **video-on-hover con catálogo embebido** (los `.mp4` viven en `#all-products-data`, se
  inyectan al `mouseenter`), **preloader-gate con contador real** ("22% LOADING"), **índice editorial
  numerado + labels verticales** (`writing-mode:vertical-rl` + counter CSS), **statement full-bleed con
  tipo spray sobre media + `mix-blend-mode:difference`**.
- Exemplar: https://serotoninn.com/

**3b. Producto-tech de lujo doméstico (matic) — nuevo, régimen "voz mono":**
- Paleta: superficie neutra clara + bloques oscuros `#1F2022`; acentos verde (footer) y amarillo
  (promo) puntuales, no sistémicos. El color lo cargan los videos.
- Tipo: **PP Mori** (grotesk geométrico, display+body) + **Trim Mono** (eyebrows, cifras, specs — la
  "voz de máquina"). Equiv libre: **Onest**/**Space Grotesk** + **Space Mono**/**JetBrains Mono**.
- Stack: **Next pages-router + Tailwind**, fuentes self-hosted, media nativa. **Cero librería de
  scroll** — animación = CSS transitions con `motion-reduce:transition-none` (accesibilidad primero).
- Firmas: **odómetro de stats en vivo** (count-up on-view, `tabular-nums`), **video-on-intent** (carga
  al click, no autoplay — protege LCP), **sistema eyebrow+pill mono**, **wordmark gigante sangrando en
  footer**.
- Exemplar: https://maticrobots.com/

---

## 4. Gastronomía — 2 exemplars nuevos

El playbook §4 (munroof/caphe) queda; acá restaurante indio real + guía de bares.

**4a. Restaurante de gama alta contenido (amritpalace) — nuevo:**
- Paleta: superficie clara `#FAFAFA`/`#E6E6E6` + tinta `#2C2C2C`/`#101010` + **beige tradición
  `#D8CBB8`** (clase `.biege`) como marca + acento cálido `#D49653`/hover `#d36b00`. (El `#3898EC` es
  default Webflow.)
- Tipo: **no verificable** (par real vive en la webflow.css externa; el corpus solo capturó fallbacks).
  Usar el par del playbook §4 (DM Serif Display + Space Grotesk).
- Stack: **Webflow + GSAP 3.11 (solo reveals, sin scrub/pin) + Lenis + Splide**. Video hero AVIF
  poster + lazy.
- Lección de valor: se ve caro con **4 mecanismos baratos** — reveal de letras (`text-split`), marquee
  CSS de reseñas (loop `translateX -50%` limpio), slider Splide, video-hero AVIF+lazy. **Cero
  scrub/pin/parallax.** Molde limpio para cliente gastronómico.
- Exemplar: https://amritpalace.com/

**4b. Guía urbana fanzine (leoff) — nuevo, food/drink editorial saturado:**
- Paleta: **superficies rotativas** (recurso central) oliva/granate oscuro → teal `#5ECCAD` → crema
  `#FCFAF5` → índigo `#7C80F6` → rosa `#FC87F6`; acción rojo `#FF2E1E`; pops azul `#4AA5FF` + amarillo
  `#FBED4F`. Pop orgánico saturado.
- Tipo: **Retail Display** (display gordo redondeado) + **Neulis Neue** (grotesca body). Equiv libre:
  **Fredoka**/**Baloo 2** + **Hanken Grotesk**.
- Stack: **Nuxt 3 (Vue) + Sanity CMS + GSAP (SplitText)**. Sin video.
- Firmas: **media recortada en blob** (`clip-path` SVG ameba), **bandas de color con costura orgánica
  curva**, reveal por líneas con máscara (easeOutQuart), **slider arrastrable + tilt 3D**.
  ⚠️ **Idle-float** (`@keyframes floating/drift` en los blobs) = exactamente el wobble que la
  motion-doctrine prohíbe. Si se porta, va como **parallax-on-scroll**, no como loop.
- Exemplar: https://leoff-paris.com/en

---

## 5. Inmobiliaria — dato duro de los dos exemplars del playbook

El playbook §5 ya cita huts + elevatehome; acá el mecanismo anclado y el stack corregido de huts.

**5a. Home-warranty lifestyle (elevatehome):**
- Paleta: crema cálida `#FFF9E7` + tinta `#141414`/verde `#242D23` + **primario amarillo `#F9D97B`** +
  **acento coral `#F86832`/`#DF643B`** (CTAs). "Atardecer suburbano".
- Tipo: **PP Hatton Medium** (serif contemporánea) + **Helvetica Neue**. Equiv libre: **Newsreader**/
  **Cormorant** + **IBM Plex Sans**.
- Stack: **Next (CSS Modules) + Lenis + Rive** (logo). Sin GSAP, sin video.
- Firmas: **nubes parallax con presupuesto de velocidad por sección** (`data-scroll-speed` 0.075→0.3),
  **reveal/wipe de imagen con divisor** (patrón "VS", `clip-path:inset` 100→0), **tabla comparativa en
  dos columnas de color contrastante** (recurring vs on-demand), **sticker numerado** rotado sobre
  cards de feature.
- Exemplar: https://www.elevatehomescriptions.com/

**5b. Property-dev rural-artesanal (huts) — stack corregido:**
- Paleta: crema `#FFFDF6`/`#FAF7ED` + **verde bosque `#0C310A`** + oliva `#57772E` + **acento lima
  `#D5E798`** + cálidos marrón `#57432D`/`#664A42` (banda project-feature).
- Tipo: **HW Cigars** (serif cálido) + **ABC Walter Neue** (grotesca Dinamo). Equiv libre: **Fraunces**/
  **Newsreader** + **Hanken Grotesk**.
- Stack: **Nuxt + Sanity + Lenis + Swiper, SIN GSAP** (corrige el "Webflow+Lenis" del corpus). `video:
  true` es **un solo** mp4 en `project-feature`, no fondo de hero.
- Firmas: **reveal-gate SSR-safe** (`pre-anim` nace `visibility:hidden`, IO revela sin FOUC), **flourish
  SVG que se dibuja bajo el titular** (`pathLength` + `dashoffset→0`), **carrusel = región de
  scroll-x nativa** (`scroll-snap` + `overflow-x`, sin Swiper para la base), **feature con panel
  `sticky`** (cero JS de scrub).
- Exemplar: https://huts.com/

---

## 6. Servicios profesionales / Corporativo — 2 exemplars nuevos

El playbook §6 cita clay+floema; acá el mecanismo de clay anclado + una firma financiera (rre).

**6a. GTM tool bone-monocromo (clay) — técnicas ancladas:**
- Paleta: bone monocromo `#F4F3F0`/`#FEFDFB` + tinta `#000`/`#1B1A18` + **único acento `#F5EBFD`**
  (lila pálido, chips/hovers). El peso lo cargan los videos.
- Tipo: mono UI (`ui-mono`, eyebrows/labels/el prompt) + display sans neutra (Webflow-hosted, no
  capturada). Equiv: display grotesca neutra + **Space Mono**. (playbook: meter Canela/serif de
  carácter sobre el neutral, jugada clay.)
- Stack: Webflow + **GSAP/ScrollTrigger/SplitText**; media webm/mp4 en `assets.clayrun.dev`.
- Firmas: **video-card de fondo lazy** (`preload=none` + IO hace `src=data-src; play()`), **bento de
  columnas fraccionarias asimétricas** (`3fr 2fr 2fr` — evita el `repeat(3,1fr)` template), **mazo de
  tarjetas apilado que rota** (`data-module=rotate`), reveal SplitText por palabra.
  ⚠️ sin captura: proporciones no verificadas, todo del crudo + JSON.
- Exemplar: https://www.clay.com/

**6b. Venture capital blanco-y-negro suizo (rre) — nuevo (mal etiquetado importadora):**
- Paleta: doble superficie negro `#07020A` ↔ azul-hielo `#D3E7F1`, texto `#FAFAFA`, grises de borde
  `#758696`/`#5D6C7B`. **El cambio de superficie ES la separación de capítulos** — sin acento
  decorativo.
- Tipo: **Arial única** para display Y body — el peso lo da el **tamaño**, no la familia. Lección
  anti-plantilla pura. Equiv si se quiere neutral con más carácter: **Geist**/**Hanken Grotesk**.
- Stack: Webflow + **GSAP 3.15 (ScrollTrigger·SplitText)**; CMS Webflow alimenta las grillas.
- Firmas (todas portables a CSS+IO sin GSAP): **bordes de layout que se auto-dibujan**
  (`scaleX/scaleY:0→1` una vez al entrar, horizontales lentas ~1s, verticales rápidas), **reveal de
  headings por línea con máscara** (`translateY 110→0`, stagger), **doble-superficie como único
  recurso de color**, **stat-stack** (métricas XXL apiladas con borde que se dibuja: `$2.5B+`/`125+`/
  `400+`).
- Exemplar: https://www.rre.com/

**6c. Agri-tech producto (farmminerals) — cross-rubro, por su técnica estrella:**
- Paleta: bone `#F4EDE6` + familia oliva/moss/forest `#7C914C`/`#596A33`/`#404F1D` (fondos de sección
  enteros) + verde eléctrico `#7AB800` (dato) + naranja `#FF6319` (acento puntual). "Agri-tech de
  lujo sobrio".
- Tipo: display sans grotesca pesada tracking apretado (Webflow-hosted, no en el sniff) + body sans
  neutra. Equiv libre: **Archivo**/**Anton** + **IBM Plex Sans**.
- Stack: Webflow + **GSAP+ScrollTrigger+SplitText + Lenis + Bunny CDN**.
- Firma estrella (reutilizable en cualquier rubro con producto): **scrub de producto por secuencia en
  `<canvas>`** (NO `<video>` — no tironea en móvil): precargar N frames webp, canvas `sticky`,
  `drawFrame(i)` cover-fit, tween `ease:none` de un `{frame}` proxy con `scrub` sobre trigger tall +
  pin. 24-48 frames suele bastar. → bloque `<ScrollSequence>`. Además: **statement pantalla-completa
  como respiro rítmico**, **banda partida foto-macro/dato-duro reversible**, **tabla de métricas con
  reglas (no cards)**.
- Exemplar: https://www.farmminerals.com/

---

## 7. Importadora — ancla REAL de logística B2B (unitedcarriers)

El playbook §7 citaba scoutmotors/huts por analogía. **unitedcarriers es el freight-forwarder real** —
usar este como molde del rubro.

- **Paleta:** doble superficie **negro `#111`/`#000`** (hero + statement) ↔ **blanco `#FFF`/`#FAFAFA`**
  (servicios + features) + **acento único azul eléctrico `#0016CB`** (glow del horizonte) + grises
  `#E6E6E6`/`#373737`. Contraste altísimo, casi monocromo + un azul. Confirma el régimen del playbook
  §7 (mono + 1 acento, evitar multi-color).
- **Tipo:** **grotesque geométrico condensado en mayúsculas** para titulares ("RELIABILITY AT EVERY
  MILESTONE") + sans neutro body. (La display real la carga un `main.js` externo — nombre no
  verificable; el JSON solo dio Arial fallback.) Equiv libre: **Archivo**/**Oswald** + **IBM Plex
  Sans** + **IBM Plex Mono** para specs.
- **Estructura (12 secciones, muy aireada):** header con mega-menú + mini-marquee → hero cinemático
  (video de olas + glow + mapamundi line-art con puntos pulsando) → statement negro → grid 6 servicios
  → **sección "road"/milestone** (la firma) → stats count-up → feature-list banda clara → trusted-by
  → blog CMS Finsweet → FAQ → CTA → footer con marquee.
- **Stack:** **Webflow + Webflow Ecommerce (Stripe checkout) + Lenis + Barba.js (transiciones SPA) +
  Finsweet Attributes**. **SIN GSAP.** Ambiente = CSS `@keyframes`; scroll-driven = `main.js` propio +
  Lenis. **Sin pin/sticky.**
- **Firmas cosechadas:**
  - **Ruta-hito que se dibuja con scroll** ("process-route", el gráfico-T): lista de servicios como
    camino con nodos; línea conectora `transform:scaleY()` atada al progreso; nodos cambian de estado
    al cruzar el centro. → `packages/blocks/process-route` (onboarding por rubro, "cómo funciona").
    Portable a **CSS `scroll-timeline`** sin JS.
  - **Mapa vivo con puntos escalonados**: dots absolute sobre mapa line-art, un `@keyframes pulse`,
    `animation-delay: var(--d)` distinto por dot. Cero JS. → hero importadora + "cobertura".
  - **Contadores count-up on-reveal** (`data-count`: 2.500+, 98,2%): IO + rAF interpolando 0→valor,
    ~15 líneas sin dependencia.
  - **Text-scramble en hover de links** (`data-link-random`): char random resueltos progresivamente;
    respetar `prefers-reduced-motion`. Firma técnica barata para nav/CTA.
- **Exemplar:** https://unitedcarriers.com/

---

## 8. SaaS / Tech (playbook §8) — exemplars nuevos anclados

Fuera de los 7 rubros vendibles pero es el tier-cliente Onia. Dos anclas duras:

**8a. Dev-tool blueprint (greptile) — nuevo:**
- Paleta: superficie oscura **`#3D3B4F`** (púrpura-pizarra) + clara `#EEEEEE`; acentos **ácidos
  semánticos**: verde `#28E99F`, menta `#C5FFD6`, lima `#DAFF01`, rosa `#FFCFFE` (estados/código/
  diagramas, no relleno).
- Tipo: **font-mono** (display/técnico, ~168 clases mono; nombre de familia *inferido* — "Space Mono" NO aparece literal en el crudo) + **Inter** (body, ×130 confirmado). El mono manda el tono —
  **excepción válida al ban de Inter** porque Inter va de body y el mono carga la identidad. Firma
  visual: `border-dashed` ×161 + ticks `+` en esquinas = plano de ingeniería.
- Stack: **Next + Tailwind + Lottie, SIN GSAP/Lenis/Framer.** Reveal = CSS transition + IO.
- Firmas: **marco blueprint punteado con cruces en esquina** (`border:1px dashed` + 4 pseudo `+`),
  **diagramas de feature como loop vectorial** (dotLottie autoplay+loop+lazy, o SVG con motion.dev),
  reveal on-enter sin lib, **sección-tabs para comprimir prueba densa**.
- Exemplar: https://greptile.com/

**8b. Healthcare-compliance con bandas de color (readily) — nuevo, resuelve Fragment Glare:**
- Paleta: base taupe/stone cálido `#4A443C`/`#79736B`/cloud + **bandas semánticas una por feature** —
  pollen (amarillo `#FBD24F`), sky/cyan (`#54D5EF`/`#BCF6FF`), meadow/mint (`#C6F4D2`), dust; primario
  `#1E2126`; acento teal `#17605C`.
- Tipo: **PP Fragment Glare** Light+Regular (serif alto contraste, ÚNICO protagonista) + body sans
  Tailwind default. Equiv libre: **Fraunces opsz 144**/**Playfair** + **Figtree**/**DM Sans**.
- Stack: **Astro + Tailwind + GSAP** (motor por atributos `data-*`) + PostHog. Sin video.
- Firmas: **background-band cross-fade dirigido por atributos** (`data-bg`/`data-bg-at` tweenea
  `--page-bg` del body al scrollear — el fondo de TODA la página cambia por sección; ideal multi-rubro
  Onia), **reveal declarativo `data-reveal-*`** (un init, cero JS por componente; o `animation-
  timeline:view()`), **marquee/carrusel arrastrable drag+wheel**, **bandas de color como sistema
  semántico + un solo protagonista tipográfico** (cumple ≥4 Required Qualities de la anti-template
  policy).
- Exemplar: https://readily.ai/

---

## 9. Técnicas cosechadas → `packages/blocks` (lo reutilizable, sin fuente única de rubro)

Ordenadas por ROI para el sitio premium Next / storefronts. Todas compositor-friendly + `prefers-
reduced-motion`.

| Técnica | Bloque | Mecanismo mínimo | Fuente |
|---|---|---|---|
| **Recoloreo de marca por sección** (multi-rubro Onia: dental→azul, comercio→verde) | `<ThemedSection>` / provider | `data-theme` por sección + IO escribe `--surface/--primary/--accent` con transición | maximatherapy, readily |
| **Background-band cross-fade** (fondo global tweenea por sección) | `<ScrollBands>` | `@property --page-bg` + IO por `data-bg`, o scroll-driven CSS puro | readily |
| **Bordes de layout que se auto-dibujan** | `<GridReveal>` | `scaleX/scaleY:0→1` una vez al entrar (CSS + IO, sin GSAP) | rre |
| **Reveal de headings por línea con máscara** | `<RevealLines>` | wrapper `overflow:hidden` + `translateY(110%→0)` stagger; `animation-timeline:view()` para cero-JS | rre, overlay, ogaki, farmminerals |
| **Reveal-gate SSR-safe (pre-anim)** | `<Reveal>` | clase base `visibility:hidden` + IO añade `.in`; sin FOUC en SSR | huts |
| **Video-card / bg-video lazy** | `<BgVideo>` | `<video muted loop playsinline preload=none>` + IO `src=data-src;play()` | clay, unitedcarriers |
| **Video-on-hover con catálogo embebido** | `<ProductCard useHoverVideo>` | poster `<img>`; `.mp4` en JSON de página; monta `<video>` al `mouseenter`, descarga al salir | serotoninn |
| **Video-on-intent (carga al click)** | `<VideoCard>` | solo poster+play; al click monta `<video preload=auto>` | matic |
| **Scrub de producto por secuencia en canvas** | `<ScrollSequence frames pinLength>` | N frames webp precargados, canvas sticky, tween `{frame}` con `scrub`+pin (no `<video>`) | farmminerals |
| **Ruta-hito que se dibuja con scroll** | `<process-route>` | línea `scaleY()` atada al progreso; nodos cambian al cruzar centro; `scroll-timeline` sin JS | unitedcarriers |
| **Mapa vivo con puntos escalonados** | `atmosphere/pulse-map` | dots absolute + 1 `@keyframes` + `animation-delay:var(--d)` por dot; cero JS | unitedcarriers |
| **Odómetro / count-up on-reveal** | `useCountUp` | IO + rAF lerp 0→target, `tabular-nums` | matic, unitedcarriers, farmminerals |
| **Media recortada en blob** | `<BlobImage>` | 3-4 `<clipPath>` SVG ameba + `clip-path:url()`; cero JS | leoff |
| **Bandas de color con costura orgánica** | `Band` | SVG onda absolute pintado del color del bloque siguiente | leoff |
| **Marquee CSS loop limpio** | `<Marquee>` | lista ×2 en track, `translateX(0→-50%)`; pausa en hover | amritpalace, unitedcarriers |
| **Marco blueprint punteado + ticks** | `<Blueprint>` | `border:1px dashed` + 4 pseudo `+` en esquinas; cero JS | greptile |
| **Índice editorial numerado + labels verticales** | `<SectionHeader>` | `writing-mode:vertical-rl` + counter CSS; cero JS | serotoninn |
| **Botón text-swap vertical** | `<Button variant=swap>` | `.mask{overflow:hidden}` 2 spans apilados, `:hover translateY`; 100% CSS | ogaki |
| **Header auto-invertido** | layout util | `position:fixed; mix-blend-mode:difference; color:#fff` (fallback sólido) | ogaki, serotoninn |
| **Statement full-bleed tipo-spray sobre media** | `<StatementFull>` | media a sangre + texto `mix-blend-mode:difference` (legible sin overlay) | serotoninn |
| **Lettermark gigante recortada como hero** | patrón hero | `font-size:clamp(30vw,48vw)`, `overflow:hidden`, letra sale de cuadro | ogaki |
| **Wordmark gigante sangrando en footer** | `<BrandBleed>` | `clamp(20vw,28vw)`, `overflow:hidden`, media letra fuera de cuadro | matic, ogaki, serotoninn |
| **Reveal/wipe imagen con divisor (VS)** | `<CompareReveal>` | 2 imgs apiladas, `clip-path:inset 100→0` por scroll, divisor SVG | elevatehome |
| **Tabla comparativa 2-columnas de color** | `<SplitList variant=warm/cool>` | grid 2-col, cada `<ul>` su superficie; filas por color no por línea | elevatehome |
| **Nubes/capas parallax con presupuesto por sección** | `<ParallaxLayer speed>` | `y=scrollProgress*speed`; solo `translate3d` sobre Lenis/motion.dev | elevatehome |
| **Carrusel = scroll-x nativo + snap** | `<SnapRow>` | flex row + `scroll-snap-type:x` + `overflow-x:auto`; drag momentum opcional | huts, overlay, readily |
| **Mazo de tarjetas apilado que rota** | `<CardDeck>` | N cards absolute, `translateY/rotate/scale` decreciente; avanzar manda arriba al fondo | clay |
| **Flourish/subrayado SVG que se dibuja** | hero util | `path pathLength=1`, `dashoffset:1→0` | huts |
| **Sticker/badge numerado sobre feature-card** | `<FeatureCard badge>` | badge absolute rotado `-4deg`; cero JS | elevatehome |
| **Text-scramble en hover** | `scramble.ts` | char random resueltos progresivamente; opt-in por `data-`; respeta reduced-motion | unitedcarriers |
| **Reveal 3D por líneas / desenfoque→foco** | `<TextReveal variant=depth/blur>` | `{opacity,yPercent,z,rotateX,blur}` stagger, o `blur(24px)→0` por palabra | frequencybreathwork, overlay |
| **Preloader-gate con contador real** | `<Loader>` | `Promise.all` de assets above-fold + rAF 0→100 real; salida `clip-path`. SOLO landings, NO dashboards | serotoninn |

**No portar** (ROI bajo / viola doctrina): Matter.js física (maximatherapy), `tweakpane` (quedó en su
prod), idle-float `@keyframes floating/drift` (leoff — es el wobble prohibido; si se usa va como
parallax-on-scroll), anillo WebGL audio-reactivo (frequencybreathwork — solo si el sitio justifica
Three.js, con `dispose()` y gate por reduced-motion + media-query desktop).

---

## Nota de fidelidad

Sin captura (solo crudo+JSON): **clay, rre, amritpalace** — proporciones y jerarquía tipográfica
renderizada no verificadas. Fuentes display no nombrables (servidas por Webflow-hosted o `main.js`
externo, ausentes del `fonts[]`): amritpalace, clay, unitedcarriers, farmminerals — equivalentes libres
por captura/mood, marcados. Todo el stack y el motion están anclados a archivos JS y atributos reales
del HTML crudo.

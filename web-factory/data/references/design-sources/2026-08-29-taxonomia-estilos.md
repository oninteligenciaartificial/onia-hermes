# TAXONOMÍA DE ESTILOS — web-factory ONIA

Fecha: 2026-08-29. Fuente: corpus de ~29 sitios únicos (`corpus.json` + `stack.json` + HTML crudos) cruzado por cinco lentes (color, tipografía, layout, motion, código). Cada estilo trae: definición, rasgos MEDIBLES (paleta/tipo/motion/espaciado), exemplars con url del corpus, técnicas de código asociadas, y cuándo elegirlo para un cliente.

## Cómo usar esta taxonomía (reglas transversales, ancladas)

1. **Anti-plantilla es una ley del corpus, no una opinión.** Los sitios con identidad cargan la personalidad en un display de carácter con nombre propio (ROM Extended, Zimula, PP Pangaia, Capo, HW Cigars, Doner, Brier, Anton, Canela) + UN acento de rubro sobre neutral. Los que caen en "plantilla" comparten síntoma: **Inter/Geist sola + azul de interacción genérico** (teamworkgraph `#0052CC`+Inter, mintlify `var(--font-inter)`, the1 Inter). El generador PROHÍBE Inter/Geist como fuente de titular.
2. **Ruido del scraper: descartar SIEMPRE antes de derivar paleta.** No son marca, son defaults del CMS: Webflow `#3898EC`/`#758696`; Gutenberg/WordPress `#F78DA7`/`#CF2E2E`/`#FF6900`/`#ABB8C3`; named-colors HTML `#8B0000`/`#006400`. Si un hex del corpus coincide con estos, no es señal de rubro.
3. **El gradient-mesh/oklch/spotlight NO existe en el corpus** (3 radial-gradient totales en 29 HTML, ninguno mesh; cero `--mouse-`/spotlight). Su riqueza viene de máscara SVG + video + `mix-blend-mode` + scroll pineado. El gradient-mesh es tell de plantilla; si se usa es decisión propia, no evidencia.
4. **Fraunces es el caballo de batalla anti-Inter** para el titular serif (cubre ~5 caras de pago del corpus vía ejes opsz/SOFT/WONK). Para energía/heavy: Archivo Black o Anton.
5. **Reparto de librería (igual en todo estilo):** CSS puro → marquees, hovers, drift, wipes, accordion, glass. **motion.dev** → reveals `whileInView`, stagger, `whileHover/whileTap`, parallax simple, count-up. **GSAP+ScrollTrigger** → todo scrub/pin/timeline/SplitText/scroll-horizontal. No se elige librería por estilo: cada estilo mapea a una INTENSIDAD de motion.
6. **Curva de ease validada por el corpus:** `cubic-bezier(0.16,1,0.3,1)` (= los 34 usos reales de `.19,1,.22,1`). Overshoot `easeOutBack (0.34,1.56,0.64,1)` SOLO en micro-interacciones (hover/chips), nunca en reveals de bloque grande.
7. **`prefers-reduced-motion` en cada patrón:** saltar a estado final, sin stagger/scrub/drift. No negociable.

---

## 1. Editorial / Revista

**Definición.** Serif display con carácter como voz principal, contraste de escala fuerte (título gigante vs. cuerpo fino), retícula asimétrica de muchas columnas, foto a sangre. La identidad la carga la tipografía; el color se retrae. La antítesis del template.

**Rasgos medibles:**
- Paleta: base neutral casi-monocroma (`#FFFFFF`/`#000000`/`#241F21`) + UN acento vivo puntual. Sat MUY BAJA salvo el pop. Ej. floema `#E9E778`+`#4D8B46`; daphne navy `#20124D`+rosa `#FFE6FB`.
- Tipo: display serif de carácter (peso 300–500, el carácter viene del CONTRASTE del trazo, no del peso) + body grotesk neutro. `ABC ROM Extended`+`Gaisyr` (bedouins), `Zimula` (floema), `PP Pangaia` (daphne). Cero Inter.
- Motion: contenido. Reveals de texto por línea/palabra (stagger de entrada), pins editoriales suaves. NO scroll-scrub pesado: el editorial pide quietud entre golpes.
- Espaciado: rejilla fina 20–24 col con `col-start ≠ 1` (asimetría deliberada). En commerce editorial, grids uniformes salvados por índice numerado (serotoninn `02.`→`07.`).

**Exemplars:** https://bedouinsdaughter.com/ · https://www.floema.com/en · https://daphnethelabel.com/ · (roza) https://serotoninn.com/

**Técnicas de código:** SplitText por palabra/línea (GSAP + `useGSAP`) o CSS `translateY(110%)`+`blur→0` con `animation-delay` incremental (método meetcleo); rejilla `repeat(24,minmax(0,1fr))` con colocación `col-start` (floema); reveal blur-in por bloque (motion.dev `whileInView` `filter:blur(10px)→0`). Marco biselado con `--corner-size`+`clip-path:polygon()` para dar carácter sin `border-radius` genérico.

**Cuándo elegirlo:** moda/boutique, arquitectura/inmobiliaria de gama, gastronomía de autor, portfolio premium de cliente. **Es el default más seguro contra "parece plantilla"** porque la identidad la carga la tipografía. No para dashboards ni SaaS de datos.

---

## 2. Cálido-premium / Warm-earthy

**Definición.** Fondo crema, tierras y verdes desaturados, serif display cálido. Transmite oficio, cercanía, "hecho a mano" sin ser rústico. El default seguro de ONIA para rubros de servicio-adulto que compran calma/confianza.

**Rasgos medibles:**
- Paleta: crema + marrón/verde tierra, sat <25%. caphe `#F8F4E9`+`#362B1C`+oro `#C18C38`; huts verde `#0C310A`/`#57772E`+crema `#FFFDF6`+lima `#D5E798`; mun `#F2F0DD`+navy `#222944`+sage `#92ABA0`. Acento oro/verde/lima terroso, NUNCA neón.
- Tipo: display serif cálido + sans neutra + mono opcional como tercer nivel. `Capo`+`Mona Sans`+`Cousine` (caphe = pairing display/sans/mono deliberado); `HW Cigars`+`ABC Walter Neue` (huts).
- Motion: ligera. `video:true` en huts/mun; parallax de imágenes con ScrollTrigger + reveals de crema→contenido con motion.dev; ducking suave, nada estridente.
- Espaciado: bento para espacios/menú (huts celdas `auto 1fr auto` desiguales + `sticky` + scroll horizontal); mucho aire.

**Exemplars:** https://capheroasters.com/ · https://huts.com/ · https://munrooftoprome.com/ · (roza) https://joindawn.com/, https://web.meetcleo.com/

**Técnicas de código:** máscara SVG con `--mask-url` swappable por breakpoint (arco/cresta del rubro); reveal por `clip-path` en hover (`ellipse` que se abre) y trays de menú/carrito (`inset(0 0 100% 0)`→`inset(0)`, caphe); marco de esquinas biseladas `--corner-size: clamp()` + `polygon()` de 8 vértices (caphe); sticky-CTA persistente (`position:fixed`+`translateY(100%)`→`0` toggled por IntersectionObserver, "Reserve" munrooftop); nav de vidrio `backdrop-filter:blur() saturate()`.

**Cuándo elegirlo:** gastronomía/cafés, hospitality, rubro dental si se quiere calidez (la crema baja la ansiedad clínica), productos artesanales/importadora de nicho. Encaja con la regla ONIA de "paleta del rubro + acento propio".

---

## 3. Dark-performance / Cinematic-scroll

**Definición.** Casi-negro absoluto; el sitio ES la animación. WebGL, scroll-scrub, secuencias de imagen cuadro-a-cuadro, sticky pinning, video atado al scroll. El tier premium en su forma más extrema y cara.

**Rasgos medibles:**
- Paleta: dark/mono con UN acento eléctrico hiper-saturado, resto sat~0. scoutmotors `#010101` puro; the1 `#1F1F1F`+azul `#0099FF`+oro `#FBB833`; frequency `#242424`/`#000`+neutros cálidos `#F2EFE9`.
- Tipo: aquí la identidad puede cargarla el MOTION, no la fuente (the1 usa solo Inter y se sostiene por el scrub). Aun así lo ideal es display de carácter: `Neue Montreal`+`Aime` serif (frequency).
- Motion: stack completo. frequencybreathwork: `three`×27, `gsap`×22, `<video>`×14, `canvas`×8, `lenis`×6, `scrolltrigger`×5, `webgl`×3. the1: 1142 imgs + `sticky`×14 + `will-change`×59 = secuencia de frames scrubbeada. Lenis como base de scroll continuo.
- Espaciado: pocas secciones grandes, ritmo largo de respiración cinematográfica; una cámara continua que baja por la página.

**Exemplars:** https://frequencybreathwork.com/ · https://the1.amsterdam/ · https://www.scoutmotors.com/ · (roza) https://maticrobots.com/

**Técnicas de código:** GSAP `ScrollTrigger` con `pin:true`, `scrub:1` (numérico = lag suave, no `true` seco), `matchMedia` para desactivar pin en mobile, emparejado con Lenis; parallax por capas (`data-scroll-speed` estilo Locomotive, o motion.dev `useScroll`+`useTransform`); hero de video `<video autoplay muted loop playsinline>`+`poster` con `currentTime`/`playbackRate` atado a scroll; transición de sección continua (ley vectorial de `motion-doctrine`: cómo salís determina cómo entrás, elemento carrier que cruza el seam). **Cuidado presupuesto de peso** (the1 = 1142 imgs viola el budget): lazy-load y secuencias optimizadas obligatorios.

**Cuándo elegirlo:** lanzamiento de producto físico (automotor, EV/cargadores, Onia Box), hero de altísimo impacto, cliente que paga el tier premium y quiere "wow". Reservarlo: es caro de producir y mantener. Es el estilo que justifica Next 15 + React 19 + GSAP.

---

## 4. Swiss-minimal / Industrial

**Definición.** Rejilla neutral, grotesca (Helvetica/Mona Sans), UN acento, espacio en blanco disciplinado. Preciso, no aburrido: la diferencia la marca el detalle y un rojo/acento único.

**Rasgos medibles:**
- Paleta: B/N/gris + un acento saturado puntual. infinitemachine B/N+rojo `#F20007`; getnudge `#FCFDFD` casi-blanco; sutera grises+pastel puntual `#BCD4FD`/`#C9C1FF`/`#E88150`.
- Tipo: `Helvetica Now Display`/`Text`, `Mona Sans`, `ABC Walter Neue`, `Scout Sans`. Mono técnico como acento (IBM Plex Mono, Space Mono).
- Motion: sobria y funcional. transiciones cortas (motion.dev), `gsap`×6 sobrio en infinitemachine; NADA de scroll-scrub. Micro-hover cargado (mintlify 121 `transition transform`).
- Espaciado: rejilla-sistema formal con tokens (matic 6-col `px-grid-margin`/`gap-x-grid-gutter`; readily 20-col fina). Asimetría controlada por `col-start`.

**Exemplars:** https://www.infinitemachine.com/ · https://getnudge.info/ · https://www.sutera.ch/ · (contraejemplo/plantilla a evitar) https://teamworkgraph.com/

**Técnicas de código:** rejilla `grid-template-columns` nombrada tokenizada; hover-lift CSS `transition:transform .3s cubic-bezier(.34,1.56,.64,1)` con `translateY(-4px)`/`scale(1.02)`; magnético real (seguir cursor) con `pointermove`+`transform` SOLO en 1–2 CTAs hero; clip-path wipe en cards; `mix-blend-mode`+blur para glow en vez de gradiente.

**Cuándo elegirlo:** SaaS/producto B2B serio, dashboard de cliente, la propia Onia Platform, importadora/logística. **Riesgo alto de caer en template:** exigir acento propio + una fuente con carácter (no Inter sola) para cumplir el piso ONIA.

---

## 5. Brutalist / Bold-poster

**Definición.** Display condensada gigante (Anton, Doner), un color primario saturado a toda pantalla, tipografía como imagen. Grita personalidad.

**Rasgos medibles:**
- Paleta: mono/base fuerte + acento saturado a pantalla completa, o multi-primario. alovehatestory rojo `#CE1215`+off-white `#EBEBEB`; magnetlover púrpura `#5A5266`+crema `#F8E6D1`+azul `#150095`+amarillo `#FCC716`; landonorris lima ácida `#D2FF00`+`#282C20`.
- Tipo: display heavy/black 800–900. `Anton`+`Instrument Serif` (alovehatestory), `Doner Black Display` (magnetlover), `Brier`+`Mona Sans` (landonorris). Grotesk sube a heavy para gritar.
- Motion: kinetic type (líneas que entran con overshoot), marquees infinitos, drag. Framer denso (magnetlover `will-change`×122); landonorris 133 imgs orquestadas + track horizontal.
- Espaciado: galería bento temática con capas (landonorris `helmet-grid`), track horizontal por scroll.

**Exemplars:** https://alovehatestory.com/ · https://www.magnetlover.com/ · https://landonorris.com/

**Técnicas de código:** SplitText/kinetic con overshoot (motion.dev `whileInView` + `easeOutBack`); marquee CSS (duplicar pista + `@keyframes translateX(-50%)` `linear infinite`) o marquee scroll-reactivo GSAP (`xPercent` modulando `timeScale`); track horizontal pineado (GSAP ScrollTrigger `pin`+`xPercent`, landonorris `is-horizontal-scroll`); máscara SVG con `--mask-url` por breakpoint (landonorris footer).

**Cuándo elegirlo:** agencia, marca joven/streetwear, evento, influencer IA (Lucía), campaña de alto contraste. NO para dental/salud/fiscal (choca con la confianza). Alto retorno de "no-plantilla" a bajo costo si la tipografía es la estrella.

---

## 6. Playful-bold / Duotono-saturado

**Definición.** Primarios saturados (hasta multi-primario), tipo grande y amable, energía optimista. Menos agresivo que el brutalista, más "producto de consumo feliz". Es el polo opuesto al warm-earthy en la regla de saturación.

**Rasgos medibles:**
- Paleta: primarios sat 85–100%. maxima azul `#006AFF`+rojo `#FF2700`+amarillo `#FDCB40` (terapia INFANTIL); usefoulplay duotono azul `#02039B`+magenta `#E31C78`; elevatehome amarillo `#F9D97B`+crema `#FFF9E7`+naranja `#F86832`.
- Tipo: grotesk grande y amable (fonts no capturados en maxima/usefoulplay/elevate → recomendación por rubro análogo). Para reimplementar: Fraunces SOFT alto o grotesk redondeado.
- Motion: reveals con rebote/spring (motion.dev es ideal para springs), micro-interacciones lúdicas en hover/focus. usefoulplay `video:true`.
- Espaciado: bloques generosos, ritmo denso de secciones cortas orientado a conversión (elevatehome 13 secciones, cleo 14).

**Exemplars:** https://maximatherapy.com/ · https://www.usefoulplay.com/ · https://www.elevatehomescriptions.com/ · (roza) https://web.meetcleo.com/

**Técnicas de código:** reveals con spring (motion.dev `whileInView` con overshoot); count-up de prueba social (motion.dev `useMotionValue`+`animate` disparado por `whileInView`, valor real siempre en el DOM); comparativa VS (`SectionVersus`/`SectionComparisonTable`, elevatehome); hover lúdico CSS con `easeOutBack`.

**Cuándo elegirlo:** salud/terapia infantil o familiar, comercio/retail alegre, app de consumo, fintech cercana, servicios a hogar. **La regla de saturación (§ regla central abajo):** público infantil/lúdico → primario saturado; público adulto premium → warm-earthy (estilo 2). El contraste pediátrica-vs-adulta está literalmente en el corpus (maxima vs joindawn).

---

## 7. Modern-SaaS / Product-motion

**Definición.** Acento sobre neutral cálido, foco en producto/dashboard, motion de UI (Lottie/canvas/motion.dev) más que scroll-scrub. Contenido, orientado a conversión. La versión diferenciada del SaaS que evita el azul-Inter genérico.

**Rasgos medibles:**
- Paleta: blanco cálido + verde/teal de marca (NO azul default). mintlify `#0C8C5E`/`#18E299`+`#F9F6F3`; readily terroso `#4A443C`+teal `#17605C`/`#54D5EF`+pastel funcional; clay neutral cálido `#F4F3F0`+tinte violeta `#F5EBFD`. El verde/teal saca al SaaS del azul-Atlassian sin perder credibilidad.
- Tipo: **la lección clave** — meter un serif display sobre la base neutral para no parecer plantilla. clay usa `Canela Web` serif + `Roobert` (el serif es lo que lo salva). Evitar el mintlify-Inter puro.
- Motion: producto animado por Lottie/canvas (readily `lottie`×18+`canvas`×5), no timeline; clay marquees + `gsap`×3. Bandas de feature con color de fondo propio = unidad de scroll.
- Espaciado: features en bandas a pantalla, cada una su color; secuencia `hero → prueba social → problema → features en bandas → métricas → testimonios → seguridad → CTA final`.

**Exemplars:** https://readily.ai/ · https://www.mintlify.com/ · https://www.clay.com/

**Técnicas de código:** acordeón/FAQ CSS-only (`grid-template-rows:0fr→1fr` + `:has(:checked)`, clay); scroll pineado por banda de feature (sticky visual + texto que pasa, GSAP ScrollTrigger); orquestación de entrada motion.dev (`staggerChildren` por columna de la rejilla-sistema); count-up (`wf-count`, valor real en HTML para SEO/reduced-motion); logos-strip de prueba social justo tras el hero.

**Cuándo elegirlo:** la propia Onia Platform de cara a cliente, SaaS vertical, demo de producto con capturas animadas, dashboards embebidos. Regla dura: serif de display sobre neutral + Lottie/motion.dev, nunca Inter en titulares.

---

## Estilo marginal (evidencia fina, no elevar a categoría)

**Retro / Experimental.** Exemplar único: https://quezia.art/ — fonts `Dongle`+`DotGothic16` (pixel)+`Hoover` serif, paleta gris+rosa pálido `#FFE6F1`/`#F7F0FF`, Framer. N=1 → recurso puntual para un portfolio creativo/arte, jamás para cliente de negocio serio.

---

## Regla central — acento tierra-desaturado vs primario-saturado (cómo elegir estilo por brief)

Derivada del corpus, resuelve "salud adulta vs pediátrica" y análogos:

1. **Público infantil/familiar o consumo lúdico → primario saturado (estilo 6).** maxima/usefoulplay, sat 85–100%.
2. **Público que compra calma/confianza/premium → base cálida + acento tierra desaturado o sin acento (estilo 2, o estilo 1 si la voz es tipográfica).** joindawn/frequency, sat <15%.
3. **Marca que necesita UNA señal de energía sobre base sobria → un único acento eléctrico contra negro/mono (estilo 3 o 5).** landonorris volt, infinitemachine rojo.
4. **Categoría artesanal/natural → acento oro/verde/lima terroso, sat media, nunca neón (estilo 2).** caphe/huts/floema.
5. **Tech por default va al azul saturado; ONIA se diferencia moviéndose a verde/teal + blanco cálido (estilo 7).**

**Heurística accionable:** entre más "calma/confianza/adulto/artesanal" pide el brief, más baja la saturación y más cálido-tierra el acento; entre más "energía/juego/infantil/statement", más sube a primario saturado — y si la base es oscura/mono, el color se colapsa en UN solo acento eléctrico.

## Mapa rubro ONIA → estilo (arranque, no dogma)

| Rubro ONIA | Estilo primario | Estilo alterno |
|---|---|---|
| Salud/dental adulto | 2 Cálido-premium | 4 Swiss |
| Salud/terapia infantil | 6 Playful-bold | — |
| Comercio/retail | 6 Playful o 1 Editorial | 5 Brutalist (marca joven) |
| Moda | 1 Editorial | 5 Brutalist |
| Gastronomía/hospitality | 2 Cálido-premium | 3 Cinematic (rooftop/experiencial) |
| Inmobiliaria/importadora | 2 Cálido-premium | 3 Cinematic (tour) |
| Ganadero/campo | 4 Swiss (robusto) | 2 Cálido |
| SaaS/Onia Platform | 7 Modern-SaaS | 4 Swiss |
| Automotor/EV/Onia Box | 3 Cinematic | 5 Brutalist |
| Agencia/portfolio | 1 Editorial | 5 Brutalist |

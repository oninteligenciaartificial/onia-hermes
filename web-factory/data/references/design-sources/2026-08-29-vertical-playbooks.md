# Playbook por rubro — Onia Web Factory

Derivado 100% del corpus web-factory (44 filas / ~29 sitios únicos). Cada rubro: paleta (hex reales del corpus), par tipográfico (pago observado → equivalente libre Google), orden de secciones, tipo de hero, nivel de motion, y 1-2 exemplars reales con url. Todo anclado — donde el corpus es flaco (N bajo) se marca.

> **Método:** las paletas ya excluyen el ruido del scraper (§0). Las tipografías de pago vienen del `fonts[]` o de `.woff2` recuperados del HTML crudo; el equivalente libre preserva el rasgo. El orden de secciones sale de las clases CSS reales (`section_*`, `Section*`, `#*`), no impuesto.

---

## 0. Reglas transversales (aplican a TODO rubro antes de elegir paleta/tipo)

**Ruido del scraper — descartar SIEMPRE, no es marca:**
- `#3898EC` / `#758696` = defaults de Webflow. `#F78DA7 #CF2E2E #FF6900 #ABB8C3` = defaults de Gutenberg/WordPress. `#8B0000 #006400 #3ED660` = named-colors HTML de SVG inline. Si un hex del corpus coincide con estos, no es señal de rubro.

**Anti-plantilla (regla dura, confirmada por el corpus):**
- **Prohibido Inter/InterDisplay/Geist como fuente de titular.** Los 3 sitios más planos del corpus (teamworkgraph, mintlify, the1) comparten síntoma: Inter-único + azul genérico. Inter solo se admite como body terciario detrás de un display de carácter.
- **Un solo eje de contraste display↔body.** ~90% del corpus con identidad usa display-de-carácter + grotesca-neutra. Nunca dos serifs ni dos displays.
- **`Fraunces` es el default anti-plantilla** para titular serif (cubre ~5 caras de pago del corpus vía ejes opsz/SOFT/WONK). Para energía/heavy: `Archivo Black` o `Anton`.
- **Mono como tercer nivel, nunca body**: precios, datos, timestamps, labels técnicos.
- **NO gradient-mesh / spotlight / oklch genérico.** Búsqueda en 29 HTML crudos: 3 `radial-gradient` totales, cero spotlight de cursor. La riqueza del corpus viene de máscara SVG + video + blend-mode + scroll pineado, no de gradientes generados. Es el tell de plantilla.

**Tiers de motion (dirección Sergio: animación primero). Todo compositor-friendly (`transform`/`opacity`/`filter`/`clip-path`), ease `cubic-bezier(0.16,1,0.3,1)` — validado por los 34 usos de `(.19,1,.22,1)` del corpus. `prefers-reduced-motion` obligatorio en cada patrón.**
- **LIGERO (CSS-only, motor estático):** reveal in-view (IntersectionObserver), marquee lineal, video autoplay+poster, clip-path wipe, hover-lift, Embla carrusel, count-up sin lib.
- **PREMIUM (Next 15 + React 19 + motion.dev + GSAP):** SplitText hero, pin+scrub (ScrollTrigger — patrón estrella), parallax de capas, continuidad Lenis + timelines encadenadas.
- **Reparto de librería:** motion.dev → reveals `whileInView`, stagger, `whileHover/whileTap`, parallax simple, count-up. GSAP+ScrollTrigger → scrub/pin/timeline/SplitText/scroll-horizontal. CSS puro → marquees, hovers, drift, wipes.
- **Prohibido idle-wobble** (motion-doctrine): el movimiento PERFORMA, no respira. Drift ambiental solo en indicadores funcionales (scroll-hint) o gradientes de marca sutiles.

**Esqueleto universal de página (los 4 tipos son variaciones del cuerpo, no del esqueleto):**
`NAV → HERO → prueba social temprana → cuerpo específico del rubro → prueba profunda (testimonios/métricas) → CTA final que reformula el hero → footer`. La CTA se repite dos veces (hero + cierre). Logos-strip justo tras el hero (SaaS); testimonios a mitad-baja (todos). Prueba social nunca al inicio absoluto.

---

## 1. Dental / Salud

Dos sub-ejes según público — el contraste está literalmente en el corpus.

- **Adulto (default Onia dental, baja la ansiedad clínica):** base cálida neutra, sin pop clínico.
  - Paleta: crema `#FBF3EB` / `#F2EFE9`, tinta casi-negra cálida `#242424`, acento arena/taupe desaturado `#DFD7C8` `#CCC0A8` (sat <15%).
- **Infantil/familiar/lúdico:** primario saturado, hasta multi-primario.
  - Paleta: base color-block, azul `#006AFF`, rojo `#FF2700`/`#FD4401`, amarillo `#FDCB40`, magenta `#E31C78` (sat 85-100%).

- **Par tipográfico:** **Fraunces** (SOFT alto, 400-600) titular + **Hanken Grotesk** body. Sin acento mono. ⚠️ Derivado por rubro, SIN ancla en el corpus (el crítico cazó acá un nombre de fuente inventado, "PP Fragment Glare", presentado como corpus — no existía en ningún HTML). Pendiente: cosechar clínicas dentales reales.
- **Orden de secciones (patrón servicio-clínica, N=3, hipótesis):** NAV → HERO editorial (ambiente/misión, no feature) → INTRO/FILOSOFÍA (encuadre humano) → SERVICIOS/PROGRAMAS → CÓMO TRANSFORMA (mecanismo) → AGENDA/HORARIOS → TESTIMONIOS → CTA "Agendar" → FOOTER. Abre con clima, no con promesa-CTA.
- **Hero:** split editorial (C) o centrado clásico (D) con superficie cálida. Evitar hero-sin-H1.
- **Motion:** MEDIO. Reveals in-view con blur (motion.dev `whileInView`), micro-springs en hover. El infantil sube a springs con rebote (`easeOutBack`).
- **Exemplars:** https://joindawn.com/ (salud mental adulta, `#FBF3EB`) · https://maximatherapy.com/ (terapia infantil, "The First Years Matter Most", azul+primarios) · https://www.usefoulplay.com/ (duotono `#02039B`+`#E31C78`)

---

## 2. Estética / Wellness

- **Paleta:** crema cálida `#FBF3EB` `#F2EFE9`, tinta `#242424`/`#000`, acento tierra desaturado `#DFD7C8` `#CCC0A8` — o **sin pop** (sat 5-15%). Vende calma/premium.
- **Par tipográfico:** `Aime` (serif alto contraste, corpus frequencybreathwork) → **Fraunces** (opsz 144) titular + **DM Sans** body. Peso fino/medio: el carácter viene del contraste del trazo, no del peso.
- **Orden de secciones:** NAV → HERO editorial sereno (video/imagen ambiente + statement) → FILOSOFÍA → PROGRAMAS/SERVICIOS → MECANISMO ("cómo transforma") → TESTIMONIOS/REFLEXIONES → CTA "Reservar" → FOOTER.
- **Hero:** editorial de ambiente, alto contraste tipográfico, mucho aire (ritmo largo, pocas secciones grandes).
- **Motion:** PREMIUM. frequencybreathwork es el arquetipo cine: SplitText en el titular (`stagger 0.08-0.12`), ScrollTrigger scrub, Lenis smooth-scroll. Ducking suave, quietud entre golpes — nunca estridente.
- **Exemplars:** https://frequencybreathwork.com/ (Aime + Neue Montreal, stack GSAP+Lenis completo) · https://joindawn.com/ (crema pura, ritmo sereno)

---

## 3. Comercio / Tienda (2º vertical Onia)

- **Paleta:** varía por producto; regímenes del corpus — mono + 1 pop saturado (`#F20007` rojo, `#FCC716` amarillo) **o** crema `#F8E6D1` + indigo `#150095`. Energía/consumo.
- **Par tipográfico:** `Doner Black Display` (heavy, corpus magnetlover) → **Archivo Black** o **Anton** titular + **Space Grotesk** body + **Space Mono** para precios. El grotesk sube a 800-900 para gritar.
- **Orden de secciones (ecommerce):** NAV → HERO campaña (lookbook/producto héroe + CTA "Shop") → [MARQUEE/anuncio] → BEST-SELLERS/GRID producto (comprable arriba, antes de la mitad) → COLECCIONES/CATEGORÍAS → CREDENCIAL/PRENSA → EDITORIAL/CAMPAÑA/FILM (diferenciador) → HISTORIA → NEWSLETTER (el "cierre" = captura remarketing) → FOOTER.
- **Hero:** full-bleed campaña (A) con una foto fuerte + CTA. Grid de producto **uniforme** (comparabilidad); la numeración editorial (serotoninn `02.`→`07.`) salva la uniformidad. Bento en la grilla de compra confunde — no.
- **Motion:** MEDIO-ALTO. Marquee lineal (CSS), track horizontal por scroll (GSAP pin + x, patrón landonorris), grids con `stagger` por viewport (IntersectionObserver, no scrub).
- **Exemplars:** https://www.magnetlover.com/ (Doner Black, 91 imgs, Framer denso) · https://serotoninn.com/ (índice numerado sobre grid uniforme) · https://landonorris.com/ (marquee cruzado + helmet-grid horizontal)

---

## 4. Gastronomía

- **Paleta:** pergamino/crema `#F8F4E9` `#F2F0DD`, dominante café oscuro `#362B1C` o navy-noche `#222944`/`#244` , acento oro/caramelo `#C18C38` + salvia `#92ABA0` (cálido-tierra, sat media-baja).
- **Par tipográfico:** `Capo` display + `Cousine` mono (corpus caphe) → **DM Serif Display** titular + **Space Grotesk** body + **Cousine**/JetBrains Mono para menú/precios/datos.
- **Orden de secciones (servicio/hospitality):** NAV → HERO ambiente (video+scrim o escena en capas) → FILOSOFÍA/INTRO → MENÚ/PROGRAMAS → ESPACIOS → EXPERIENCIA → RESERVA (sticky-CTA "Reserve your table") → NEWSLETTER → FOOTER.
- **Hero:** **layered/escena ensamblada (B)** — el más caro y el que más justifica el tier animado. munroof arma el hero en capas separadas (`__background __moon __drink __frame __image`), cada una un plano de profundidad. Alternativa: full-bleed video+scrim (A).
- **Motion:** PREMIUM. Parallax de capas (ScrollTrigger scrub), `video-zoom`/`paragraph--pin` (cámara continua que baja por el rooftop), reveals crema→contenido con motion.dev. Sticky-CTA persistente togglea por IntersectionObserver.
- **Exemplars:** https://munrooftoprome.com/ (hero en capas, 76 imgs, scroll-scrub pesado) · https://capheroasters.com/ (rieles centrados + marco biselado `--corner-size`, "Experience Our Coffee", James Beard credencial)

---

## 5. Inmobiliaria (elegir sub-eje ANTES de la paleta — no hay fórmula única)

- **Naturaleza-lujo/hospitalidad:** verde bosque `#0C310A` `#57772E` + crema `#FFFDF6` + lima `#D5E798`.
- **Hogar-cálido/servicio:** crema `#FFF9E7` + naranja-terracota `#F86832` `#B95F35` + oro `#F9D97B`.
- **Urbano-premium:** oscuro `#1F1F1F` + azul `#0099FF` + ámbar `#FBB833` (ojo: the1 usa Inter → tira a genérico, no imitar la tipografía).

- **Par tipográfico:** `PP Hatton` (serif ligero, corpus elevatehome) / `HW Cigars` (serif cálido, huts) → **Newsreader** o **Cormorant** (300) titular + **IBM Plex Sans** body. Confianza sobria, serif claro y fino.
- **Orden de secciones (landing captación):** NAV → HERO → [TIRA-PRUEBA] → PROBLEMA/EMPATÍA → CÓMO FUNCIONA → FEATURES alternados → CASOS/PROPIEDADES (card-slider) → COMPARATIVA VS → TESTIMONIOS → STANDARDS/MÉTRICAS → CTA "find that place" → FAQ → FOOTER. (huts es el molde más limpio.)
- **Hero:** layered (B) o **bento con scroll horizontal anidado** (huts `two-across`+`h-scroll-container`+sticky). Bento desigual para "mostrame lugares/opciones distintas".
- **Motion:** PREMIUM. Scroll horizontal pineado (ScrollTrigger `pin`+`scrub` horizontal — alto impacto para tour de propiedades), sticky-stack bento, count-up en stats.
- **Exemplars:** https://huts.com/ (bento + h-scroll + HW Cigars serif, el más ambicioso compositivamente) · https://www.elevatehomescriptions.com/ (crema+naranja, PP Hatton, `SectionVersus`/`SectionComparisonTable`)

---

## 6. Servicios profesionales / Corporativo

- **Paleta:** off-white cálido/greige `#F4F3F0` `#FFFEF6`, tinta negra `#1B1A18` / marrón `#3F2C1B`, **un** toque de pop: lila `#F5EBFD` — o verde `#4D8B46` + chartreuse `#E9E778` (cálido-neutro, muy baja saturación + 1 pop).
- **Par tipográfico:** `Canela Web` (didone editorial, corpus clay) / `Zimula` (floema) → **Fraunces** (opsz 144) titular + **Figtree** o **DM Sans** body. (clay salva el look-SaaS metiendo el serif Canela sobre neutral — replicar esa jugada.)
- **Orden de secciones (SaaS/corporativo, el más consistente del corpus):** NAV sticky → HERO (statement + CTA + demo visual) → TIRA-PRUEBA logos → PROBLEMA nombrado → PLATAFORMA/"todo conectado" → FEATURES en bandas (una por capacidad, cada una su color de fondo) → MÉTRICAS → TESTIMONIOS → HISTORIA/MANIFIESTO → CTA final (re-promesa) → FOOTER.
- **Hero:** full-bleed layered con doble scrim (clay: `home-hero_gradient` + `_shade` + `_overlay` + copy anclado) o centrado amplio con mucho aire (D).
- **Motion:** MEDIO. Timeline GSAP de diagrama que se construye por scroll (clay `section_home-flow`), marquees de logos, reveals de sección con motion.dev.
- **Exemplars:** https://www.clay.com/ (Canela + Roobert, hero en capas, GSAP Flip+marquees) · https://www.floema.com/en (Zimula, rejilla maestra 24-col, ritmo amplio)

---

## 7. Importadora

- **Paleta:** base neutra/oscura robusta — negro `#010101` / greige `#F4F3F0`, dominante mono, **1** acento único (rojo `#F20007` o volt controlado). Confianza + robustez. Evitar multi-color.
- **Par tipográfico:** `Scout Sans`/`ABC Walter Neue` (grotesk suizo, corpus scoutmotors/huts) → **Syne** (bold, ancho con carácter) o **Space Grotesk** titular + **IBM Plex Sans** body + **IBM Plex Mono** para datos/specs/SKU.
- **Orden de secciones:** NAV → HERO (producto/catálogo héroe) → TIRA-PRUEBA → CATÁLOGO/CATEGORÍAS (grid) → CÓMO FUNCIONA (importación/logística) → CREDENCIAL/GARANTÍA → COMPARATIVA → CTA "Pedir acceso/Cotizar" (sticky) → FAQ → FOOTER.
- **Hero:** full-bleed video+scrim (A, scoutmotors `#010101` puro) o bento de catálogo con sticky.
- **Motion:** MEDIO-ALTO. Parallax Locomotive/GSAP (`data-scroll-speed`), video atado a scroll, reveals de grid. Presupuesto de peso: lazy-load y optimizar secuencias (the1 = 1142 imgs es el aviso).
- **Exemplars:** https://www.scoutmotors.com/ (mono `#010101`, Scout Sans + IBM Plex Mono, video scroll-linked) · https://huts.com/ (bento + grotesk suizo, para el modo catálogo)

---

## 8. SaaS / Tech (tier cliente Onia — la trampa-plantilla está en el color Y la fuente)

- **A EVITAR (genérico):** rampa azul Atlassian `#0052CC #0065FF #0747A6 #2684FF #4C9AFF` + Inter (teamworkgraph). Es exactamente el look "template" que el piso Onia prohíbe.
- **Diferenciado (target Onia):** blanco cálido `#F9F6F3` + verde/teal de marca `#0C8C5E`/`#17605C`/`#18E299` + pastel funcional para datos `#54D5EF` `#C6F4D2` `#FFF3C6`. El verde saca al SaaS del azul-default sin perder credibilidad.
- **Par tipográfico:** `Helvetica Now Display` (corpus infinitemachine) → **Instrument Sans** display + **Fraunces** en el hero (romper el look-SaaS con un serif de carácter, jugada clay) + **Onest**/**Figtree** body + **JetBrains Mono** para código/datos. **Nunca Inter en titulares.**
- **Orden de secciones (SaaS, mismo molde readily/mintlify):** NAV sticky → HERO statement + CTA + demo → TIRA-PRUEBA "Join 20,000+" → PROBLEMA ("X deserves better") → PLATAFORMA → FEATURES en bandas de color (3-5, cada una su fondo) → MÉTRICAS → TESTIMONIOS → SEGURIDAD/CONFIANZA ("built for trust") → CTA final → FOOTER.
- **Hero:** split editorial-asimétrico (C) sobre rejilla fina (readily 20-col, `col-start-5`; matic 6-col tokenizada). No el 50/50 plano.
- **Motion:** MEDIO. Animación de producto por Lottie/motion.dev (readily: 18 Lottie), cada banda de feature = un ScrollTrigger pineado con la demo animándose mientras se lee. NO scroll-scrub pesado innecesario.
- **Exemplars:** https://readily.ai/ (blanco cálido + teal/mint, Lottie, features en bandas de color) · https://www.mintlify.com/ (verde `#0C8C5E` + off-white — copiar el color-system, NO su Inter)

---

## Nota de fidelidad (límites de datos)

- Servicio/clínica (N=3) y portfolio (N=1 legible) son **hipótesis**, no leyes. SaaS (N=5) y ecommerce (N=5) son los buckets sólidos.
- 11 sitios traen `fonts:[]` (CSS externo no capturado); sus tipografías se enriquecieron por `.woff2` del crudo o se derivan del rubro análogo (marcado por el exemplar citado).
- Sin señal tipográfica alguna: maximatherapy, getnudge, maticrobots, readily, sutera (por rubro análogo). ironhill y joshuataylordesign: HTML vacío, excluidos de exemplars.

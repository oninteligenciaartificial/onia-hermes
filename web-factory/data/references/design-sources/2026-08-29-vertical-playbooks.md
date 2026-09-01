# Playbook por rubro — Onia Web Factory

Derivado 100% del corpus web-factory (44 filas / ~29 sitios únicos). Cada rubro: paleta (hex reales del corpus), par tipográfico (pago observado → equivalente libre Google), orden de secciones, tipo de hero, nivel de motion, y 1-2 exemplars reales con url. Todo anclado — donde el corpus es flaco (N bajo) se marca.

> **Método:** las paletas ya excluyen el ruido del scraper (§0). Las tipografías de pago vienen del `fonts[]` o de `.woff2` recuperados del HTML crudo; el equivalente libre preserva el rasgo. El orden de secciones sale de las clases CSS reales (`section_*`, `Section*`, `#*`), no impuesto.

---

## 0. Reglas transversales (aplican a TODO rubro antes de elegir paleta/tipo)

**Ruido del scraper — descartar SIEMPRE, no es marca:**
- `#3898EC` / `#758696` = defaults de Webflow. `#F78DA7 #CF2E2E #FF6900 #ABB8C3` = defaults de Gutenberg/WordPress. `#8B0000 #006400 #3ED660` = named-colors HTML de SVG inline. `#4285F4` = **azul de Google**, viene del SVG del badge de reseñas (cosecha 31-ago: 13 usos en smilebar, y ninguno es marca). Si un hex del corpus coincide con estos, no es señal de rubro.
- **La frecuencia miente; el token manda.** Donde el sitio declara variables (`--c-navy`, `--colours--bg-subtle`, `--color-scheme-1--peach`), la marca es el token, no el hex más contado. Seguir el `<link rel=stylesheet>` y leer las `--*` es lo que separó marca de ruido en los 8 sitios del 31-ago.
- **Al medir saturación, decir el modelo.** Los umbrales de este playbook son **HSV**. El mismo `#E6D2AF` da S 23,9% en HSV y **52%** en HSL: leído con el modelo equivocado, un acento correcto se descarta por "chillón".

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

> ✅ **ANCLADO el 2026-08-31** con dos clínicas dentales reales (antes era analogía desde salud mental). Detalle y cifras: `2026-08-31-cosecha-rubros-sin-ancla.md`.

- **Adulto (default Onia dental, baja la ansiedad clínica):** base cálida neutra, sin pop clínico.
  - Paleta: crema `#FBF3EB` / `#F2EFE9`, tinta casi-negra cálida `#242424`, acento arena/durazno `#DFD7C8` `#CCC0A8` `#E6D2AF` (dntlbar) `#F9DCCB` (smilebar, token `--color-scheme-1--peach`), **saturación HSV <25%**. ⚠️ Este umbral decía "<15%" y estaba mal: se había escrito el piso de la muestra como ley, y los dos acentos dentales REALES (23,9% y 18,5%) lo reprobaban.
- **Infantil/familiar/lúdico:** primario saturado, hasta multi-primario.
  - Paleta: base color-block, azul `#006AFF`, rojo `#FF2700`/`#FD4401`, amarillo `#FDCB40`, magenta `#E31C78` (sat 85-100%).

- **Par tipográfico:** **Fraunces** (SOFT alto, 400-600) titular + **Hanken Grotesk** body. Sin acento mono. ⚠️ Es una **decisión de diferenciación de Onia, no lo que hace el mercado**: de las dos clínicas cosechadas solo dntlbar usa display serif (**Song Myung** + Open Sans/Nunito Sans); smilebar corre **Satoshi para display Y body**, el mono-sans que `MOTION_PATTERN_BANK:462` prohíbe. 1 de 2. Se mantiene el par serif+grotesca porque el piso anti-plantilla de Onia lo pide, citándolo como elección. (`PP Fragment` NO es dental: reapareció el 31-ago en decagon.ai — bucket SaaS/IA, §10.)
- **Orden de secciones (patrón servicio-clínica, N=3, hipótesis):** NAV → HERO editorial (ambiente/misión, no feature) → INTRO/FILOSOFÍA (encuadre humano) → SERVICIOS/PROGRAMAS → CÓMO TRANSFORMA (mecanismo) → AGENDA/HORARIOS → TESTIMONIOS → CTA "Agendar" → FOOTER. Abre con clima, no con promesa-CTA.
- **Hero:** split editorial (C) o centrado clásico (D) con superficie cálida. Evitar hero-sin-H1.
- **Motion:** MEDIO. Reveals in-view con blur (motion.dev `whileInView`), micro-springs en hover. El infantil sube a springs con rebote (`easeOutBack`).
- **Exemplars (dental REAL primero):** https://www.dntlbar.com/ (clínica NYC, h1 "dental for the people.", `#E6D2AF` + tintas `#292929`) · https://www.smilebar.com/ (ortodoncia Boston, `--color-scheme-1--peach: #F9DCCB`, Satoshi único) · https://www.meetdandy.com/ (lab dental B2B, `#003A30` + lima `#C7E738` — el lado B2B del rubro, otra paleta) · análogos: https://joindawn.com/ (salud mental adulta, `#FBF3EB`) · https://maximatherapy.com/ (terapia infantil, azul+primarios) · https://www.usefoulplay.com/ (duotono `#02039B`+`#E31C78`)
- ⚠️ **No sirven de ancla** (200 pero sin contenido servido): tend.com (403) y dentologie.com (6.192 bytes, shell JS con Inter de sistema). Un 200 no es un ancla.

---

## 2. Estética / Wellness (elegir REGIMEN y SUB-EJE antes de la paleta)

> ⚠️ Reescrita el **2026-08-31** con la cosecha de `2026-08-31-cosecha-rubros-flacos.md`
> (5 sitios vivos nuevos). Antes esta sección era **N=1 por sub-eje** y las dos reglas
> centrales estaban mal: el "sin pop" y el "nude para estética". Las dos las desmintió
> el dato medido, no la lectura.

### 2.1 Wellness — son DOS regímenes, no uno

- **(a) Crema monástica / sin pop.** Base crema cálida `#FBF3EB` `#F2EFE9`, tinta
  `#242424`/`#000`, acento tierra desaturado `#DFD7C8` `#CCC0A8`, **HSV S <16%**.
  Vende quietud. Anclas: frequencybreathwork, joindawn, **remedyplace** (greige
  cálido `#b9b2aa` S 8,1% · `#403b36` 15,6% · `#8a8580` 7,2%, tinta `#1a1817`).
- **(b) Crema + tinta profunda + UN pop saturado.** Ancla: **othership.us**, con
  tokens de marca declarados `--os-plum: #372338` (H 297°, 116 usos, el no-neutro
  más frecuente), `--os-lime: #dbf572` (**HSV S 53,5%**), `--os-cream: #ece8e3`
  (+ pink `#cb72c4`, teal `#a7cfc9`, dark-orange `#a24e2b`). Vende ritual con
  energía (sauna/hielo, social), no silencio.
- 🔴 **La regla vieja decía "sin pop (sat 5-15%)" y othership la reprueba al triple.**
  Era el piso de la muestra escrito como ley — el MISMO error que el `<15%` dental
  que corrigió B1. Saturación siempre en **HSV** y declarada.

### 2.2 Estética — el sub-eje que vende Onia NO es el nude

**Onia vende clínica** en este rubro (esteticagest). Las dos clínicas reales no
usan nude ni blush; el nude es del **producto DTC**:

| Sub-eje | Régimen medido | Anclas |
|---|---|---|
| Skincare **producto/DTC** | nude cálido desaturado (HSV S 12-34%) + blush + charcoal | **ONSKN** (`#F2CDA0`/`#E8BD8B` + blush `#FFD9D2` + charcoal `#32373C`) · **typology** (`#f6e7d8` 12,2% · `#f1d7c3` 19,1% · `#e8c4a8` 27,6%) |
| Estética **clínica** (lo de Onia) | tinta oscura/casi-negra + **UN** acento saturado, HSV S ~55-61% | **alchemy43** (`--highlight-color #e5ad5a` oro S 60,7%, 182 usos, sobre `--accent-color #27494e` teal y `--body-color #12181f`) · **skinlaundry** (tinta `#1a1312` S 30,8% V 10,2 + pop lima `#cdf765` S 59,1%) |

Lo que se porta a una clínica es **"un acento saturado sobre tinta oscura"**, no el
hex: los dos pops coinciden en magnitud (60,7% y 59,1%) y no en hue.

### 2.3 Lo común a los dos sub-ejes

- **Par tipográfico:** `Aime` (serif alto contraste, corpus frequencybreathwork) →
  **Fraunces** (opsz 144) titular + **DM Sans** body. Peso fino/medio: el carácter
  viene del contraste del trazo, no del peso.
  Medido en `h1..h6` de las anclas nuevas: **alchemy43 → `freight-neo-pro`
  (fallback `serif`) + `work-sans`** — display serif + grotesca de cuerpo, o sea el
  par de Onia en una clínica real que factura. skinlaundry → `Apris` + `Manrope`.
  othership → `Lido Condensed` + `Founders Grotesk` (display condensado).
  ⚠️ **remedyplace corre `Beausite` para TODO** (Slick display / Classic): segundo
  caso real del mono-sans que `MOTION_PATTERN_BANK:462` prohíbe (el primero fue
  smilebar con Satoshi). La prohibición se cita como **decisión de diferenciación
  de Onia**, no como observación del mercado.
- **Orden de secciones:** NAV → HERO editorial sereno (video/imagen ambiente +
  statement) → FILOSOFÍA → PROGRAMAS/SERVICIOS → MECANISMO ("cómo transforma") →
  TESTIMONIOS/REFLEXIONES → CTA "Reservar" → FOOTER.
- **Hero:** editorial de ambiente, alto contraste tipográfico, mucho aire (ritmo
  largo, pocas secciones grandes).
- **Motion:** PREMIUM en el régimen (b) y en cine-wellness — frequencybreathwork es
  el arquetipo (SplitText `stagger 0.08-0.12`, ScrollTrigger scrub, Lenis) y
  **othership también trae gsap + ScrollTrigger**. Pero el régimen (a) NO lo exige:
  remedyplace es Next sin librería de motion detectada y sostiene la calma. Ducking
  suave, quietud entre golpes — nunca estridente.
- **Exemplars:** https://frequencybreathwork.com/ (Aime + Neue Montreal, GSAP+Lenis)
  · https://remedyplace.com/ (greige cálido, Beausite) · https://www.othership.us/
  (plum + lime, Webflow + GSAP) · https://alchemy43.com/ (clínica: oro + teal,
  freight-neo-pro) · https://www.skinlaundry.com/ (clínica: tinta + lima, Apris) ·
  https://us.typology.com/ (DTC nude) · https://joindawn.com/ (crema pura)
- ⚠️ **No sirven de ancla:** peachystudios.com (200 con **136 bytes**),
  ever-body.com (200 pero h1 "We’re getting things ready" = holding) y
  heydayskincare.com (sirve 681 KB, pero su color dominante sale de tokens de
  sección de Shopify, no de marca). **Un 200 con h1 tampoco alcanza si el h1 es el
  holding.**

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

## 7. Importadora / logística B2B

> ✅ **ANCLADO el 2026-08-31** con dos forwarders reales. Antes se apoyaba en scoutmotors (automotor) y huts (hospitality) como proxy, y **la receta heredada era incorrecta en dos puntos**: el fondo y la cantidad de acentos.

- **Paleta:** base **navy profundo, NO negro** — `#052439` (flexport, declarado dos veces: `--c-navy` y `--c-midnight`) / `#080E49`-`#0A1158` (zencargo) sobre fondos cálidos claros `#F4F2EF` (`--c-pampas`) o `#F5F7FA`. **DOS acentos, no uno**: uno frío de confianza + uno vivo de señal — flexport `#45DABE` (seafoam) + `#566AE5` (indigo); zencargo `#0D97F2` + `#31A575`. El negro `#010101` de un solo acento era la receta del automotor, no de la importadora.
- **Par tipográfico:** **GT America** en flexport, y el contraste display↔body lo da el **ancho** (Extended para titulares, Standard para cuerpo), con un solo family — es la variante barata del eje de contraste, útil cuando el cliente no banca dos caras. zencargo: **Larsseit** display + **Lato** body. Equivalentes libres: **Archivo** (tiene el eje `wdth`, replica el truco Extended/Standard) o **Space Grotesk** titular + **IBM Plex Sans** body + **IBM Plex Mono** para specs/SKU.
- **Orden de secciones:** NAV → HERO (producto/catálogo héroe) → TIRA-PRUEBA → CATÁLOGO/CATEGORÍAS (grid) → CÓMO FUNCIONA (importación/logística) → CREDENCIAL/GARANTÍA → COMPARATIVA → CTA "Pedir acceso/Cotizar" (sticky) → FAQ → FOOTER.
- **Hero:** full-bleed video+scrim (A, scoutmotors `#010101` puro) o bento de catálogo con sticky.
- **Motion:** MEDIO-ALTO. Parallax Locomotive/GSAP (`data-scroll-speed`), video atado a scroll, reveals de grid. Presupuesto de peso: lazy-load y optimizar secuencias (the1 = 1142 imgs es el aviso).
- **Exemplars:** https://www.flexport.com/ (h1 "AI-powered logistics for the real world", navy `#052439` + seafoam, GT America Extended/Standard, 189 tokens `--c-*`) · https://www.zencargo.com/ (`hero--frontpage bg-darkNavy` → `logo-strip` → `why-zencargo` → testimonios, Larsseit + Lato) · proxies previos: https://www.scoutmotors.com/ (automotor) · https://huts.com/ (bento, modo catálogo)

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

## 9. Ganadero / agro (rubro VIVO en producción — antes 100% analogía)

> ✅ **ANCLADO el 2026-08-31.** Era el mayor hueco del crítico: rubro encendido en producción con **cero** sitios agtech en el corpus. Dos anclas reales, y las dos desmienten la suposición obvia.

- **Paleta:** **tinta verde bosque sobre hueso cálido**, con el verde vivo SOLO como acento — halter: `#294E3B` (declarado a la vez como `fg-default` y `bg-inverse`, HSL L 23%) + fondo `#F7F5F1` / `#F2EFE9` + acento lima `#E3FDCB` + `#CBE5F6` (cielo) para el bloque de datos. agriwebb: `#65BB38` (verde señal) + `#F8F7F4` (hueso, HSV S 3,7%) + `#000A17`/`#092343` (azul casi negro) + `#39A7C4`. **NO es verde brillante sobre blanco**: eso es el look genérico de agro-software.
- **Par tipográfico:** **PP Neue Montreal** (halter, 3 pesos, grotesca neutra) con **Caveat** declarada como `--type--script` — una manuscrita chica es el guiño de campo, no decoración; agriwebb usa **Cardo** (serif) de display sobre Open Sans/Lato. Equivalentes libres: **Bricolage Grotesque** o **Archivo** titular + **Public Sans**/**Inter** body terciario + **Caveat** como tercer nivel afectivo (etiquetas manuscritas: "hecho en el campo"), o **Cardo** si se quiere el eje serif.
- **Orden de secciones (halter, clases reales):** NAV → HERO (promesa concreta: "Halter for beef, now powered by satellite") → `section-home-offering` (qué hace) → `section-dairy-beef` (**bifurcación por sub-rubro**, lechero vs. carne — el equivalente exacto de los packs de Onia) → `section-home-farmers` (prueba: productores reales) → `section-tech-cta` → `section-home-blog` → `section-cta`. agriwebb agrega `block-tabbed-reveal` y `block-horizontal-sticky-scrolling-section`.
- **Hero:** foto/video de campo real con scrim, promesa en una línea. Nada de ilustración vectorial de vaca.
- **Motion:** MEDIO-ALTO y **está probado en el rubro**: halter trae **GSAP ×23** y `<video>`; agriwebb, scroll horizontal pineado. El campo no exige un sitio quieto.
- **Exemplars:** https://halterhq.com/ (verde bosque + hueso, PP Neue Montreal + Caveat, GSAP) · https://www.agriwebb.com/ (sticky horizontal, Cardo + Open Sans)

---

## 10. IA / agentes (lo que Onia vende — el rubro estaba huérfano)

> ✅ **ANCLADO el 2026-08-31.** Había 3 sitios etiquetados (sutera, cleo, matic) sin receta propia. Los dos anclajes nuevos venden exactamente lo que vende Onia: agentes de atención al cliente.

- **Paleta:** **la que NO es azul-tech.** sierra.ai construye la escala gris **cálida** (`--color-gray-100: #F6F5F3`, `--color-gray-200: #E4E0DC`) con verde profundo (`--color-green-500: #006838`, `--color-green-800: #05351D`), negro `#222` y rojo `#E94E2A` de señal. decagon.ai: índigo `#5754FF` + verde bosque `#0F281B`/`#2B4539` + naranja `#FF6F22`. Los dos líderes del rubro **evitan la rampa azul** — el mismo movimiento que Onia ya hace con su verde de marca (§8), y acá está confirmado por el mercado que competimos.
- **Par tipográfico:** **GT America Standard + GT America Mono** (sierra) — el mono como **tercer nivel** para datos/labels, tal cual la regla transversal; decagon: **CircularXX** + **DM Sans** + **PP Fragment**. Equivalentes libres: **Instrument Sans** o **Archivo** display + **DM Sans** body + **JetBrains Mono**/**Spline Sans Mono** datos. **Nunca Inter en titular.**
- **Orden de secciones (decagon, clases reales — el molde entero es legible):** NAV → `section_new-hero` → `section_logo-grid_customer-quotes` (**logos + quote en el MISMO bloque**, prueba social temprana comprimida) → `section_product-highlight` → `section-timeline` (**cómo trabaja el agente paso a paso**) → `section_channel-highlight` (**un bloque por canal**: chat, mail, voz — el equivalente de WhatsApp/IG/web en Onia) → `section_customer-highlight` → `section_resource-highlight` → `section_bottom-cta`.
- **Hero:** statement corto de resultado, no de tecnología: "Better outcomes. Built on Sierra." · "The AI concierge for every customer". **Se vende el desenlace, no el modelo.**
- **Motion:** MEDIO. decagon trae **Lottie ×34** (la animación de producto es el argumento) + GSAP puntual; sierra corre Next con video. La demo animada del agente ES la prueba: mostrarlo trabajando, no describirlo.
- **Exemplars:** https://sierra.ai/ (grises cálidos + verde, GT America + Mono) · https://decagon.ai/ (índigo + verde bosque, timeline + bloque por canal, Lottie)

---

## Nota de fidelidad (límites de datos)

- **Actualizado 2026-08-31** (`2026-08-31-cosecha-rubros-sin-ancla.md`): dental real, ganadero/agro, importadora/B2B e IA/agentes pasan de analogía a **N=2 con dato computado** cada uno. Quedan como hipótesis: **portfolio (N=1 legible)** y el resto de servicio/clínica genérico. SaaS (N=5) y ecommerce (N=5) siguen siendo los buckets más sólidos.
- **Actualizado 2026-08-31 (segunda pasada, `2026-08-31-cosecha-rubros-flacos.md`):** §2
  deja de ser N=1 por sub-eje — **wellness N=3** (partido en dos regímenes: sin pop /
  con pop saturado) y **estética N=4** (partido en producto DTC vs clínica, N=2 cada
  uno). Las dos reglas que había escritas ahí estaban mal y las desmintió el dato:
  el "sin pop (sat 5-15%)" y el "nude para estética" — que le recetaba a la clínica
  la paleta del sub-eje que Onia no vende. **Sigue sin ancla: portfolio (N=1).**
- Dos correcciones que salieron de medir, no de leer: el umbral de saturación dental estaba mal (`<15%` → **HSV <25%**) y la importadora no es negra-de-un-acento sino **navy de dos**. Las dos venían de heredar la muestra equivocada.
- 11 sitios traen `fonts:[]` (CSS externo no capturado); sus tipografías se enriquecieron por `.woff2` del crudo o se derivan del rubro análogo (marcado por el exemplar citado).
- Sin señal tipográfica alguna: maximatherapy, getnudge, maticrobots, readily, sutera (por rubro análogo). ironhill y joshuataylordesign: HTML vacío, excluidos de exemplars.

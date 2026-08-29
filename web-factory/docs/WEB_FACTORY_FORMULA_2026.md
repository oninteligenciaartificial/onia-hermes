# WEB FACTORY — LA FÓRMULA (2026)

> Receta paso a paso para diseñar CUALQUIER sitio de cliente de Onia sin re-investigar.
> Destilada del corpus real (≈29 sitios únicos analizados con 6 lentes: color, tipografía,
> arquitectura, layout, motion, código). Cada regla trae su rango del corpus y su ancla.
> Un agente futuro sigue los 8 pasos EN ORDEN y sale con un sitio vendible, no una plantilla.
>
> **Ley de entrada (antes del paso 1):** leé el `intake` del cliente y elegí UN eje
> emocional en una frase — "calma/confianza/adulto/artesanal" ⟷ "energía/juego/statement".
> Ese eje decide saturación, tipografía, motion y CTA en cascada. No lo saltees.

---

## LOS 8 PASOS (en orden, cada uno gatea al siguiente)

### Paso 1 — Dirección de estilo
**Regla dura:** elegí UNA de las 7 direcciones del corpus ANTES de tocar un color. Prohibido
"limpio y minimalista" como dirección (es el default sin identidad). La dirección fija todo lo demás.

| Dirección | Rubros ONIA que le calzan | Ancla en corpus |
|---|---|---|
| **Editorial / revista** | moda, inmobiliaria de gama, gastronomía de autor, portfolio premium | bedouinsdaughter, floema, daphne |
| **Cálido-premium / warm-earthy** | gastronomía, hospitality, dental cálido, artesanal/importadora | capheroasters, huts, munrooftop |
| **Dark-performance / cinematic-scroll** | lanzamiento de producto físico (automotor, EV, Onia Box), hero de alto impacto | frequencybreathwork, the1.amsterdam, scoutmotors |
| **Swiss-minimal / industrial** | SaaS B2B serio, dashboard, Onia Platform, logística | infinitemachine, getnudge, sutera |
| **Brutalist / bold-poster** | agencia, marca joven, evento, influencer IA (Lucía) | alovehatestory, magnetlover, landonorris |
| **Playful-bold / duotono-saturado** | salud/terapia infantil, retail alegre, app de consumo, fintech cercana | maximatherapy, usefoulplay, elevatehome |
| **Modern-SaaS / product-motion** | Onia Platform de cara a cliente, SaaS vertical, demo de producto | readily, clay, mintlify |

**Default seguro anti-plantilla:** Editorial o Cálido-premium — la identidad la carga la tipografía,
no hay riesgo de "template". **Dark-performance se reserva** (caro de producir y de mantener; the1 = 1142 imgs).

---

### Paso 2 — Paleta
**Regla dura:** superficie cálida/fría según el eje del rubro + acento según la regla de saturación.
**NUNCA** el azul de interacción por defecto (`#3898EC` Webflow) ni un `oklch` genérico ni el gradient-mesh
(el corpus real NO lo usa: 3 radial-gradients en 29 HTML, ninguno es mesh). La riqueza viene de máscara +
video + blend-mode + scroll, no de gradientes pintados.

**Filtro obligatorio primero** — descartar estos hex si aparecen (son defaults del CMS, no marca):
`#3898EC` `#758696` (Webflow), `#F78DA7` `#CF2E2E` `#FF6900` `#ABB8C3` (Gutenberg/WP).

**Regla central de saturación (la pregunta pediátrica-vs-adulta):**
1. Infantil/lúdico/consumo → **primario saturado, hasta multi-primario. Sat 85–100%** (maximatherapy `#006AFF`+`#FF2700`+`#FDCB40`).
2. Calma/confianza/premium/adulto → **base cálida neutra + acento tierra desaturado, o sin acento. Sat <15%** (joindawn `#FBF3EB`, frequencybreathwork crema/arena/taupe).
3. Statement sobre base sobria → **UN único acento hiper-saturado eléctrico contra negro/mono, resto sat≈0** (landonorris volt `#D2FF00`, infinitemachine rojo `#F20007`).
4. Artesanal/natural → **acento oro/verde/lima terroso, sat media, nunca neón** (caphe oro `#C18C38`, huts lima `#D5E798`).
5. Tech por default va al azul saturado → **ONIA se diferencia moviéndose a verde/teal + blanco cálido** (mintlify `#0C8C5E` + `#F9F6F3`, readily teal `#17605C`).

**Rangos de superficie por rubro (del corpus):** crema cálida `#FBF3EB`/`#F2EFE9` (wellness, gastronomía,
corporativo, dental cálido) · blanco/negro editorial (moda) · pergamino `#F8F4E9` (gastronomía) ·
negro `#010101` (automotor) · blanco cálido `#F9F6F3` (SaaS diferenciado).

**Tres canales de color SEPARADOS (regla del dashboard, aplica a todo el sitio):**
- **Cromo de marca** (`--color-primary/accent/secondary`): sidebar activo, CTA, hero cell, focus ring.
- **Tinta de dato** (series de charts): NO sale de la marca — usá el theme categórico fijo validado de la skill `dataviz` (`references/palette.md`), corré `validate_palette.js` en light y dark(`#0c1013`).
- **Estado** (`--wf-pos #166534` / `--wf-neg #b91c1c`, elevados a `#4ade80`/`#f87171` en oscuro): reservado, siempre con icono+label, nunca pisa el acento.

---

### Paso 3 — Tipografía
**Regla dura:** 1 display con carácter (titular) + 1 grotesca neutra (body). **PROHIBIDO Inter/Geist como
face de identidad** — el corpus lo prueba: Inter-único = los 3 sitios más planos (teamworkgraph, mintlify, the1).
Inter solo se admite como body terciario detrás de un display de carácter.

**Ratio del corpus:** ~55:45 serif:grotesk en el rol de titular; **~90% empareja display-de-carácter + body
grotesco neutro** (nunca dos serifs ni dos displays). Mono = tercer nivel de acento (precios, datos, timestamps), nunca body.

**Peso sigue al estilo:** serif de carácter → 300–500, dejá hablar al contraste (moda/wellness/inmobiliaria);
grotesk → 800–900 para gritar (comercio/agencia).

**Pares por rubro (display libre + body libre, todos Google Fonts):**

| Rubro | Display (titular) | Body | Acento mono |
|---|---|---|---|
| Salud/dental | **Fraunces** (SOFT alto, 400–600) | Hanken Grotesk | — |
| Wellness/estética | **Fraunces** (opsz 144) | DM Sans | — |
| Comercio/retail | **Archivo Black** o **Anton** | Space Grotesk | Space Mono (precios) |
| Moda | **Cormorant** (300) o Fraunces light | Instrument Sans | — |
| Gastronomía | **DM Serif Display** | Space Grotesk | Cousine / JetBrains Mono |
| Inmobiliaria/importadora | **Newsreader** | IBM Plex Sans | — |
| Ganadero/campo | **Syne** (bold) o Space Grotesk | IBM Plex Sans | IBM Plex Mono (datos) |
| SaaS (tier cliente) | **Instrument Sans** + Fraunces en hero | Onest / Figtree | JetBrains Mono |
| Agencia/editorial | **Anton** + **Instrument Serif** | Hanken Grotesk | — |
| Corporativo premium | **Fraunces** (144) | Figtree / DM Sans | — |

**Caballo de batalla anti-plantilla: Fraunces** (opsz/SOFT/WONK cubre ~5 serifs de pago del corpus). Para energía: Archivo Black / Anton.

---

### Paso 4 — Arquitectura de secciones
**Regla dura (ley universal del corpus):**
`HERO → prueba social temprana → cuerpo específico del tipo → prueba profunda → CTA final que reformula el hero → footer`.
La prueba social NUNCA va al inicio absoluto (logos-strip justo DESPUÉS del hero; testimonios a mitad-baja).
La CTA se repite DOS veces (hero + cierre).

**El cuerpo cambia según el tipo de página** (esto es lo único que difiere de verdad):

| Tipo | Cuerpo central (orden) | Ancla |
|---|---|---|
| **Landing captación** | HERO+CTA → [logos] → PROBLEMA → CÓMO FUNCIONA (pasos) → FEATURES alternados → CASOS DE USO → TESTIMONIOS → [VS] → CTA FINAL → FAQ | huts, getnudge, cleo |
| **Servicio/clínica/hospitality** | HERO ambiente → FILOSOFÍA → PROGRAMAS/SERVICIOS → MECANISMO → AGENDA/ESPACIOS → TESTIMONIOS → CTA reservar | maximatherapy, munrooftop, frequencybreathwork |
| **Ecommerce** | HERO campaña → [marquee] → BEST-SELLERS/GRID → COLECCIONES → CREDENCIAL/PRENSA → EDITORIAL/FILM → HISTORIA → NEWSLETTER | capheroasters, infinitemachine, serotoninn |
| **SaaS/producto** | HERO+CTA → logos "Join 20k+" → PROBLEMA → PLATAFORMA → FEATURES en bandas de color → MÉTRICAS → TESTIMONIOS → SEGURIDAD/CONFIANZA → CTA FINAL | readily (el molde), mintlify, clay |

Buckets sólidos: SaaS (N=5) y ecommerce (N=5). Servicio (N=3) y portfolio (N=1) son hipótesis — ajustá con criterio.

---

### Paso 5 — Layout del hero
**Regla dura:** elegí 1 de los 4 tipos de hero según rubro. Evitá el hero SIN H1 semántico (tipografía-como-imagen)
salvo portfolio/moda — rompe SEO y accesibilidad.

| Tipo de hero | Cuándo | Rejilla que lo acompaña | Ancla |
|---|---|---|---|
| **A. Full-bleed sobre media + doble scrim** | marca aspiracional, automotor, gastronomía | centrado o sistema | clay (`gradient`+`shade`+`overlay`), scoutmotors |
| **B. Full-bleed layered (escena en capas)** | hospitalidad, inmobiliaria, experiencial premium | bento desigual + sticky/h-scroll | munrooftop (`__moon`/`__drink`/`__frame`), huts |
| **C. Split editorial asimétrico** | SaaS/producto/IA | rejilla FINA 10–20 col, `col-start` ≠ 1 | readily (20-col), matic (6-col tokenizada) |
| **D. Centrado clásico con rieles** | producto que convierte por copy | `grid-cols-[1fr_auto_1fr]` | mintlify, getnudge, caphe |

**Rejilla por función (marcador de asimetría intencional = muchas columnas):**
- Commerce → **uniforme** (comparabilidad) + un recurso editorial numerado (serotoninn 02–07). Bento en la grilla de compra CONFUNDE.
- Servicio/SaaS → **rejilla-sistema fina** 6–20 col con tokens de gutter (autoridad, "sistema"). Grid uniforme hace parecer plantilla.
- Hospitalidad/inmobiliaria → **bento desigual + scroll horizontal** (deseo, exploración).

**Ritmo de espaciado:** lujo → pocas secciones grandes con mucho aire (sutera 4, scoutmotors 3); conversión →
muchas bandas cortas, una por beneficio (cleo 14, elevatehome 13). Espaciado como escala de tokens (`--space-section: clamp(...)`), nunca valores sueltos.

---

### Paso 6 — Motion
**Regla dura:** el motion es parte de la IDENTIDAD, no un plugin encima de una plantilla. Todo compositor-friendly
(`transform`/`opacity`/`filter`/`clip-path`). Ease canónica **`cubic-bezier(0.16,1,0.3,1)`** — validada por los 34 usos
de `(.19,1,.22,1)` del corpus. Overshoot (`easeOutBack`) SOLO en micro-interacciones (hover/chips), nunca en reveals de bloque.
**Prohibido el idle wobble** (motion-doctrine): el movimiento PERFORMA, no respira. `prefers-reduced-motion` en CADA patrón, a estado final.

**Reparto de librería (regla clara):**
- **CSS puro** → marquees (P3), hover-lift (P8), wipes clip-path (P7), drift restringido (P10), accordion `grid-rows 0fr→1fr`.
- **motion.dev / Framer Motion** → reveals `whileInView` blur-in (P2), stagger, `whileHover/whileTap`, parallax simple `useScroll` (P5), count-up (P11).
- **GSAP + ScrollTrigger** → todo scrub/pin/timeline/SplitText (P1), pin+scrub (P4, el patrón estrella), scroll horizontal, continuidad Lenis (P12).

**Mapeo motion → sección:**
- HERO → reveal orquestado motion.dev (`stagger` load) + parallax de fondo. SplitText (GSAP) si es tier premium.
- CÓMO-FUNCIONA / FEATURES en bandas → GSAP ScrollTrigger `pin+scrub` (sticky visual). **El que justifica Next 15 + React 19.**
- GRID/logos/testimonios → reveal por viewport (IntersectionObserver + stagger), NO scrub.
- EDITORIAL/producto → track horizontal por scroll (GSAP `pin + xPercent`).
- CTA final → una entrada limpia, sin wobble.

**Dos tiers:** LIGERO (CSS-only, IO reveals, count-up con valor real en HTML) es el piso, no el ideal.
PREMIUM (Next 15 + React 19 + motion.dev + GSAP + Lenis) es lo que hace ver "caro". Video: `<video autoplay muted loop playsinline>` + `poster`, AVIF/WebM, medir peso real (antecedente: la fuente de iconos de 3,9 MB).

---

### Paso 7 — CTA / conversión
**Regla dura:** UNA CTA primaria por hero, repetida en el cierre. El "cierre" cambia por tipo:
**SaaS/landing → CTA que reformula el hero · ecommerce → NEWSLETTER · servicio → RESERVA/AGENDA.**

**Sticky-CTA persistente** (patrón de conversión del corpus, munrooftop `reserve-cta`): acción primaria siempre
visible, parametrizada por rubro — **Reservar / Comprar / Pedir acceso**. Togglea con IntersectionObserver cuando
el hero sale de viewport (no scroll handler).

**Honestidad de conversión (regla ONIA dura):** el botón promete exactamente lo que hay del otro lado. Si el
alta es solicitud, el copy dice "Pedí tu acceso", no "Probá 14 días gratis". Barré la promesa vieja en TODA la
superficie con grep antes de dar el cambio por hecho (nace del bug de los 4 botones de `/register`).

---

### Paso 8 — Gate (antes de main)
**Regla dura:** nada se da por hecho sin MIRARLO renderizado. Un 200 y un grep NO son verificación.

Checklist de cierre:
1. **Abrir y MIRAR** cada pantalla de cliente (Playwright + Chromium headless, leer la captura). Breakpoints 320/375/768/1024/1440.
2. **Peso y tiempo reales** medidos, no solo que responda. Budget: landing <150kb JS / <30kb CSS; microsite <80kb.
3. `tsc --noEmit` + tests + code-reviewer.
4. **Cero "muy pronto"/"beta"/"en construcción"** en superficie de cliente (la venta nunca exhibe obra).
5. **No fabricar:** cero testimonios/logos/cifras inventadas (0 clientes pagando).
6. `main` compila solo: si un archivo nuevo importa otro archivo nuevo, van los DOS o ninguno. Cuidado casing de imports (Linux distingue).
7. Ambos temas (light/dark) intencionales si existen los dos.

---

## CHECKLIST "VENDIBLE" (≥4 required qualities, regla `design-quality.md`)

Toda superficie de cliente demuestra **al menos 4**:

- [ ] 1. Jerarquía clara por contraste de escala (hero vs body, no emphasis uniforme).
- [ ] 2. Ritmo intencional en el espaciado (tokens, no padding uniforme en todo).
- [ ] 3. Profundidad/layering por overlap, sombras, superficies o motion.
- [ ] 4. Tipografía con carácter y pareja real display+body (NO Inter/Geist en titular).
- [ ] 5. Color usado semánticamente (cromo/dato/estado separados), no solo decorativo.
- [ ] 6. Estados hover/focus/active que se sienten diseñados (hover-lift con `easeOutBack`).
- [ ] 7. Composición editorial/bento que rompe la grilla donde corresponde.
- [ ] 8. Textura/grano/atmósfera cuando encaja (máscara SVG, blend-mode glow, no gradient-mesh).
- [ ] 9. Motion que aclara el flujo (scroll-scrub que cuenta historia, no wobble).
- [ ] 10. Data-viz tratada como parte del sistema (theme categórico validado, no colores de marca en series).

**Además, no negociables:** acento propio del rubro (paso 2) · 1 display de carácter (paso 3) · CTA honesta (paso 7) · verificado MIRANDO (paso 8).

---

## ANTI-PATRONES (evitar SIEMPRE)

**Color**
- Copiar hex del scraper que son defaults del CMS (`#3898EC` Webflow, primarios de Gutenberg). Filtrarlos primero.
- Azul de interacción por defecto como acento. Gradient-mesh / spotlight de cursor / `oklch` genérico — el corpus real NO los usa; son el tell de plantilla.
- Sacar las series de charts de la marca del cliente (`color-mix 50% bg` genera hues indistinguibles bajo daltonismo). Marca = cromo, NO = series.

**Tipografía**
- Inter/Geist/InterDisplay como face de identidad (= los 3 sitios más planos del corpus).
- Dos serifs o dos displays juntos. Mono como body.
- Rampa azul tipo Atlassian + Inter (el look SaaS-plantilla exacto: teamworkgraph).

**Arquitectura / layout**
- Prueba social al inicio absoluto (va después del hero).
- Una sola CTA sin repetir en el cierre.
- Hero sin H1 semántico fuera de portfolio/moda (rompe SEO/a11y).
- Bento en la grilla de compra (confunde) · grid uniforme en un SaaS (parece plantilla).
- Card-grids uniformes sin jerarquía, hero stock centrado con blob de gradiente, defaults de librería sin tocar.

**Motion**
- Idle wobble / "breathing" decorativo en contenido (motion-doctrine lo prohíbe).
- Animar propiedades layout-bound (`width`/`height`/`top`/`margin`/`font-size`).
- Overshoot en reveals de bloque grande (es solo para micro-interacciones).
- Parallax por scroll-listener (peor que nada; usar `useScroll`/ScrollTrigger o omitir).
- Números fiscales que animan (monto con moneda/decimal/placeholder NUNCA anima).
- Framer Motion para loops infinitos (desperdicia runtime; marquee = CSS).

**Producto / venta**
- Exhibir obra: "muy pronto", "beta", "en construcción", banners de borrador en superficie de cliente.
- Fabricar testimonios, logos o cifras (0 clientes pagando).
- Prometer en el botón algo distinto a lo que hay del otro lado.
- "Verificar" con HTTP 200 + grep sin abrir la pantalla.
- Publicar un rediseño de superficie viva sin que Sergio VEA la pieza renderizada y dé OK explícito.

---

*Fuente: síntesis de 6 lentes sobre el corpus web-factory. Precios y catálogo se LEEN de sus fuentes únicas
(`onia-platform/lib/subscription-plans.ts`, `lib/pricing.ts`, `ONIA_CATALOGO_DE_VENTA.md`), nunca se inventan aquí.*

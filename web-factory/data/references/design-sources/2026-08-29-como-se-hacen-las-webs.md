# CÓMO ESTÁN HECHAS LAS WEBS — lectura honesta que corrige el esqueleto simplificado

Fecha: 2026-08-29. Fuente: los despieces anclados de ~20 sitios del corpus (HTML crudo
+ captura + JSON), cruzados contra el esqueleto genérico que veníamos usando
(hero → features → testimonios → CTA → footer). Ese esqueleto no está mal, está
**incompleto y mal calibrado**: asume un largo fijo, un catálogo corto de secciones,
un stack único, y una identidad hecha de muchos ingredientes. Los sitios reales
desmienten las cuatro cosas. Cada corrección abajo está anclada a sitios concretos.

---

## 1. El LARGO es una decisión de estilo, no un default

No existe "el largo correcto" de una web. El número de secciones **lo dicta el objetivo
comercial**, y se ve clarísimo en el corpus partido en dos familias:

**Lujo / marca / SaaS premium → POCAS secciones enormes con mucho aire.** Un mensaje por
pantalla, alturas de `100svh`, vacíos deliberados entre climax. El valor percibido sube
con el silencio, no con la densidad.
- `rre.com` (VC): **7 secciones**, ritmo disciplinado, hero de pura tipografía sin imagen.
- `ogakidigital.com` (agencia beauty): **~9 bandas** pero "aire deliberado entre bloques
  (percepción de prestigio)"; denso solo en header/premios.
- `frequencybreathwork.com` (wellness): **7 secciones**, "ritmo lento-editorial arriba".
- `overlay.com` (beauty-tech): **6 bandas + footer**, "cada statement flota solo en su
  pantalla".
- `huts.com` (propiedades): **11 bloques** pero "MUY aireado", alturas generosas, artesanal.

**Conversión / producto que se explica → MUCHAS bandas cortas.** Cada sección hace un
trabajo (problema, prueba, specs, precio, objeción). Se densifica hacia el pie.
- `elevatehomescriptions.com` (home-warranty): **14 secciones** — repite el claim como
  ancla, dos tablas comparativas densas.
- `greptile` (dev-tool): **16 bloques**, "bandas oscuras cargadas de UI-proof intercaladas
  con secciones claras de respiro".
- `clay.com` (GTM): **9 secciones semánticas** apoyadas en 9 `<video>`, features densas.
- `maticrobots.com` (robótica): **11 secciones**, alterna statement limpio con grids de
  video/press/config.

**Rangos reales del corpus:** lujo/marca **6–9** secciones; producto/conversión **11–16**.
El esqueleto de 5 bloques es el piso mínimo de una landing de conversión corta, no un molde.
La regla operativa: **primero se elige familia (aire vs. densidad), y ESA elección fija el
largo** — no al revés.

---

## 2. El catálogo de secciones era corto — faltan estos tipos

El esqueleto listaba hero, features, testimonios, CTA, footer. El corpus usa un vocabulario
mucho más rico. Los que faltaban, con su ancla:

- **Feature en banda de color** — una franja full-bleed de un color saturado distinto por
  feature, el color ES la separación de capítulos. `readily.ai` (pollen/sky/meadow, una
  banda semántica por problema), `leoff-paris.com` (cada sección un color pleno cortado por
  costura orgánica curva).
- **Statement pantalla-completa** — una sola frase gigante ocupando `100svh`, respiro
  rítmico que corta la densidad. `farmminerals.com` ("How much could you grow if nothing was
  wasted?" sobre verde sólido), `serotoninn.com` ("BOLD FASHION" spray, "A VISION IN
  MOTION."), `maticrobots.com` ("Tell it. Show it. Matic actually gets it.").
- **Specs / 3 columnas** — capacidades o garantías en columnas con línea divisoria, no cards.
  `farmminerals.com` ("Smaller than a plant cell / Effortlessly integrative /
  Zero-manufacturing emissions"), `overlay.com` (pasos 01/02/03 con línea de progreso),
  `greptile` ("Security-First Design": Self-Hosted / SOC 2 / Enterprise Ready).
- **Premios / prensa** — fila de sellos o pull-quotes de medios como prueba inmediata.
  `ogakidigital.com` (Next Gen Agency of the Year, Business Insider, PRNet Top 100),
  `maticrobots.com` (WSJ, ZDNET "only 10/10", Gizmodo, Wired), `farmminerals.com` (Thrive,
  IFA, TechCrunch, AgFunder, SOSV).
- **Métricas gigantes** — números "hero" apilados o en fila, con contador on-scroll.
  `rre.com` ($2.5B+ AUM / 125+ exits / 400+ companies), `maticrobots.com` (odómetro en vivo
  418,772,566), `readily.ai` (90% / $734K / 20→150), `unitedcarriers.com` (2,500+ / 98.2% /
  8+ con count-up).
- **Editorial-scroll** — titular partido en líneas que se revela/oculta con scroll pineado,
  o secuencia de imágenes escalonadas con vacíos enormes. `frequencybreathwork.com` (statement
  pineado con SplitType), `ogakidigital.com` (galería bento vertical), `farmminerals.com`
  ("Meet CropTab" con scrub de secuencia cuadro a cuadro).

Otros que el esqueleto tampoco nombraba y aparecen seguido: **preloader-gate** con contador
(`serotoninn.com` "22% LOADING"), **tabla comparativa** de dos columnas de color opuesto
(`elevatehomescriptions.com` recurring vs on-demand), **logo-wall / trusted-by**
(`clay.com`, `greptile`), **wordmark gigante sangrando** en el footer (`maticrobots.com`,
`ogakidigital.com`, `serotoninn.com`).

---

## 3. La realidad del stack — no es "todo React"

El corpus tiene tres familias claras, y usar la equivocada es caro:

- **Webflow (o Framer) domina las landings estáticas de marca.** Es el builder líder del
  rubro y emite HTML+CSS+JS estático — la misma categoría de output que nuestro nivel 1.
  Confirmado en `frequencybreathwork.com`, `overlay.com`, `amritpalace.com`, `clay.com`,
  `rre.com`, `farmminerals.com`, `unitedcarriers.com`. Sobre esa base montan una capa custom
  de motion (GSAP + Lenis).
- **Next / React (o Nuxt, Astro) aparece en productos y apps**, donde hay estado dinámico,
  CMS propio o UI de aplicación. `maxima` (React Router/Remix), `maticrobots.com` (Next
  pages), `greptile` (Next + Tailwind), `readily.ai` (Astro + Tailwind), `ogakidigital.com`
  (Next + styled-components), `leoff-paris.com` / `huts.com` (Nuxt + Sanity),
  `serotoninn.com` (WordPress + Woo). ⚠️ **El detector del corpus se equivoca seguido**:
  marcó "Webflow" en sitios que el HTML crudo desmiente (maxima, maticrobots, greptile,
  readily, ogaki). Verificar por firma real (`_next`, `__NUXT`, `_astro`, `data-styled`),
  no por la etiqueta del JSON.
- **GSAP marca los de motion pesado.** Cuando hay scrub, pin, secuencia-canvas o SplitText,
  hay GSAP + ScrollTrigger. `frequencybreathwork.com` (WebGL + GSAP), `farmminerals.com`
  (scrub de secuencia en canvas), `clay.com`, `overlay.com`, `rre.com`, `amritpalace.com`.
  **Lenis** casi siempre lo acompaña para el smooth-scroll.

Regla operativa: **el stack no es identidad, es consecuencia del objetivo.** Landing de marca
→ estático (nivel 1, nuestro motor). Producto/app con estado → Next/React (nivel 2). Motion
scrub/pin → sumar GSAP. Nunca al revés: React a mano para una landing estática es pagar
complejidad que Webflow/nuestro motor resuelven gratis.

---

## 4. La identidad puede ser UNA sola cosa

El esqueleto asumía que la personalidad se arma sumando ingredientes (color + tipo + motion +
fotos). El corpus muestra lo contrario: los sitios más memorables cargan **toda la identidad
en un único recurso**, y lo demás se retrae a neutral.

- **3D / WebGL como firma.** `frequencybreathwork.com`: un anillo de líneas Three.js que
  "respira" audio-reactivo detrás del H1 es TODA la marca; la paleta es casi monocroma arena
  y negro.
- **Tipografía gigante como imagen.** `ogakidigital.com`: la lettermark "OGAKI" recortada
  desbordando el viewport funciona de ilustración — cero fotos, cero acento cromático, tinta
  sobre hueso. `maxima`: la palabra "learn" bubbly ocupa la sección entera. `rre.com`: una
  sola grotesca (Arial) hace display Y body; el peso lo da el tamaño, no la familia.
- **Specs / lo técnico como estética.** `greptile`: `border-dashed` 161 veces + cruces en
  esquina = todo es un plano de ingeniería; la identidad es el marco blueprint, no un logo.
  `maticrobots.com`: la "voz mono" (Trim Mono en cada label y cifra) ES la marca.
- **Un solo mecanismo de color.** `rre.com`: dos superficies (negro ↔ azul-hielo) sin acento
  decorativo — el cambio de superficie es la separación de capítulos. `overlay.com`:
  mono-lila con un único `#005FFF` reservado a lo interactivo.

Regla operativa: **elegir UN protagonista de identidad y bajar todo lo demás a neutral.**
Sumar 3D + tipo gigante + banda de color + fotos ricas no da más personalidad, da ruido de
template. La disciplina (un recurso fuerte, el resto callado) es lo que se lee caro y
anti-genérico — coincide con la anti-template policy y con la taxonomía (display de carácter
con nombre propio + UN acento de rubro).

---

## Resumen (5 líneas)

1. El LARGO es decisión de estilo: lujo/marca **6–9** secciones con aire, conversión/producto
   **11–16** bandas densas. El esqueleto de 5 bloques es piso, no molde.
2. Faltaban tipos de sección: **feature-banda-color, statement full-screen, specs 3-col,
   premios/prensa, métricas gigantes, editorial-scroll** (+ preloader, tabla comparativa,
   logo-wall, wordmark sangrando).
3. Stack por objetivo: **Webflow/Framer** domina landings estáticas (= nivel 1), **Next/React**
   en productos con estado (= nivel 2), **GSAP+Lenis** en los de motion pesado. El detector
   del corpus miente: verificar firma real.
4. La identidad puede ser **UNA sola cosa** (3D, tipo gigante, specs, o dos superficies) con
   todo lo demás en neutral; sumar ingredientes da ruido de template.
5. Todo anclado a sitios reales del corpus (rre, ogaki, frequency, overlay, huts, greptile,
   clay, readily, maticrobots, farmminerals, elevate, leoff, serotoninn, maxima).

# Carruseles ONIA — subir el techo de calidad (auditoría + referencias + motor)

Fecha: 2026-08-17. Objetivo único de esta sesión: mirar el sistema de carruseles con
criterio de diseño real (no a ojo) y convertirlo en cambios codeables al motor,
priorizados. No se tocó `scripts/carousel_render.js`, `CAROUSEL_SYSTEM.md`, briefs
ni PNGs — todo lo de abajo son propuestas para que Sergio/el dueño del carril las
aplique.

## 0. Esto se apoya en lo que ya existe (no soy el primer research)

Antes de escribir una línea nueva, leí lo que ya vive en el repo. Este documento
**complementa**, no reemplaza:

- `hermes-content/carousels/CAROUSEL_SYSTEM.md` — las 5 reglas y cómo están codificadas.
- `scripts/carousel_render.js` (854 líneas, leído completo) — el motor real.
- `web-factory/docs/ADS_PATTERN_BANK_2026.md` — research de Meta Ad Library en vivo
  (2026-08-06) sobre ángulos de copy que funcionan en el nicho IA/automatización LatAm.
- `hermes-content/carousels/CAROUSEL_RESEARCH_2026.md`, `GIOEXPLICA_METODO_CARRUSELES_VIRALES.md`,
  `NICHO_CARRUSELES_VIRALES_IG_2026.md` — research de **copy, hooks y algoritmo** (qué decir).
  Este doc NO repite eso: se enfoca en **craft visual** (cómo se ve), que es el hueco que
  esos tres no cubren.
- `hermes-content/references/style-references-batch-2026-06-16.json` y
  `-06-17.json` — 15 referencias de estilo ya minadas en junio, con un roadmap de packs
  explícito (`onia-dark-product` implementado, `onia-swiss-type` y `onia-proof-ui`
  **todavía propuestos, sin construir**) y una lista de `onia_action_items` que reviso
  abajo contra lo que hoy está en producción — varios siguen abiertos.

Lo nuevo de este doc: (1) una auditoría **pieza por pieza sobre los PNG reales que ya
se generaron**, con hallazgos a nivel de código (línea exacta) que el research de junio
no podía ver porque era research de inspiración externa, no auditoría del motor; y
(2) referencias frescas específicamente **B2B/SaaS** (las de junio son mayoría
fashion/fintech-PT/influencer, ninguna es SaaS puro).

## Cobertura real (léase antes de confiar en los hallazgos)

- **PNGs mirados: 22 de 110** (~20%) — `find hermes-content/carousels/out -iname "*.png" | wc -l`
  da 110. Cubrí 14 de las 17 carpetas de salida, los 5 packs (`typographic`,
  `dark-product` **sin muestra real, ver §3**, `dark-neon`, `editorial-photo`,
  `bright-retail`) y los 3 formatos (`feed`, `square`, `story`). No miré:
  `onia-5-tareas-ia-20260617`, `onia-competencia-ia-20260617` (no-darkneon),
  `lucia-reveal-foto` (probable duplicado de `lucia-reveal-20260809`), `formato-feed`,
  `ads/ad-a2-v1` y `ad-a2-v2`.
- **Skills cargadas y aplicadas**: `impeccable` (10 Required Qualities + Absolute Bans +
  AI slop test), `taste-design`, `ui-ux-pro-max`, `design-review` (ojeada; es un skill
  orquestador de QA de sitios en vivo con browser, no aplica a PNG estático — tomé solo
  su estándar de "designer's eye"), `banner-design` (safe zone 70-80%, máx. 2 tipografías,
  1 CTA, contraste 4.5:1, mínimos tipográficos).
- **Referencias externas: 7 verificadas EN VIVO esta sesión** (Behance, fetch real +
  imagen descargada + vista con el visor). Intenté Dribbble y Meta Ad Library: los dos
  devuelven bloqueo verificable por `curl` (Dribbble: `x-amzn-waf-action: challenge`,
  202 vacío; Meta Ad Library: `403 Client challenge`). Instagram: probé
  `instagram.com/stripe` esperando la cuenta oficial y devolvió **una cuenta random sin
  relación** ("P-Natsu") — prueba de que adivinar handles no es confiable, así que no cito
  ningún handle de IG como "verificado esta sesión". Esta subagente no tiene
  `ads_library_search` ni Chrome MCP ni WebSearch en su set de herramientas (son del
  orquestador); si se quiere profundizar con Ad Library en vivo, esa llamada la tiene que
  hacer la sesión de control.
- **Ninguna cifra de afuera sin marcar**: los números de engagement de `GIOEXPLICA_...md`
  y `NICHO_CARRUSELES_VIRALES...md` son de research previo (no re-verificados hoy); los
  cito tal como están documentados, no los repito como propios.

---

## 1. Auditoría pieza por pieza contra `impeccable` (Required Qualities)

Nota de método: son piezas **estáticas** (PNG), no UI interactiva. De las 10 Required
Qualities, la #6 (hover/focus/active) no aplica — la trato como N/A y exijo **≥4 sobre
las 9 restantes**. La #9 (motion) la mapeo a su equivalente en carrusel: el cue de swipe
o la curva de continuidad entre slides.

| # | Pieza (pack / rol) | Cumple | Falla | Veredicto |
|---|---|---|---|---|
| 1 | `editorial-photo` / cover (5 muestras: costo-invisible, mitos-ia, whatsapp-a-mano, rip-cuaderno, paradigma-escala) | #1 jerarquía por escala (headline 96px vs pill 26px vs body 38px) · #3 profundidad (foto + scrim + texto = 3 planos) · #4 tipografía con carácter (Archivo Black + Fraunces italic, pairing real, no Inter) · #5 color semántico (verde = SIEMPRE la palabra clave y el pill) · #8 atmósfera (foto real con luz práctica construye mood) | #2 ritmo (las 5 portadas son la MISMA composición: pill arriba-izq → hueco → headline abajo-tercio → body → swipe. Cambia la foto, no la estructura) · #7 sin ruptura de grilla | **5/9 — pasa** el piso, pero es un molde único repetido en 5 temas distintos |
| 2 | `editorial-photo` / cta (costo-invisible slide-07, paradigma-escala slide-08) | #4, #8 (mismos que arriba) | #1 — **sin elemento de acción**: la slide de mayor intención de todo el carrusel no tiene botón ni ticket, solo texto en cursiva verde. Ver §3.1 | **falla el piso** en la slide que más importa |
| 3 | `editorial-photo` / save (costo-invisible slide-05 "Sacá tu número", paradigma-escala slide-06 "El test...") | #4, #8 | #1 — sin diferenciación visual real vs. una slide `point`: mismo layout, el único cambio es que el pill dice "FRAMEWORK" en vez del texto de sección. La regla 4 (CAROUSEL_SYSTEM.md, "slide guardable") pide que SE NOTE que es guardable | **no cumple la regla 4 que el propio sistema define** |
| 4 | `typographic` / cover, formato feed (`ads/ad-a3-silla-vacia`) | #1 (jerarquía clara: headline blanco + keyword verde) · #4 (Space Grotesk + Inter, pairing legítimo aunque más plano que editorial-photo) | #2, #3, #8 — **~40% del canvas (500px+ de 1350) es negro plano sin textura**, entre el body y el footer | 2/9, al límite |
| 5 | `typographic` / cover, formato **square y story** (`formato-square/slide-01`, `formato-story/slide-01`) | #1 | #2 #3 #8 (mismo problema que arriba, pero MUCHO peor: en story, ~880 de 1920px — 46% del canvas — es vacío sin textura entre el body y el footer; en square es visualmente aún más notorio porque el formato es más "cuadrado-plano") | **falla el piso**, causa raíz identificada en §3.2 |
| 6 | `typographic` / cta con regex roto (`regresion-cta/slide-07` — "¿Cuál te frena a vos?") | #5 (verde=acción sigue siendo consistente) | #1 — **cero botón, cero ticket, cero palabra a comentar**: el 60% inferior del slide es verde plano sin ningún elemento. Prueba en vivo del bug de §3.1/§3.2 combinado | **falla el piso**, es la peor pieza de toda la muestra |
| 7 | `typographic` / cta itemizado (`onia-recibo/slide-01`) | #1 (cascada headline→intro→líneas→botón→nota, clarísima) · #2 (los puntos guía dan ritmo real, distinto del ritmo de párrafo) · #5 (verde sólido = "esto es la oferta"; precios en su propia columna, alineados a la derecha) · #10 (los precios SON el layout, no texto perdido en un párrafo) | — | **4/9, la mejor pieza de toda la auditoría** |
| 8 | `dark-neon` / cover con objeto 3D (`onia-competencia-ia-darkneon-20260617/slide-01`) | #1 (headline empujado a tercio inferior por UN solo `margin-top:auto`, sin competencia) · #3 (grid + glow radial + halftone = 3 texturas apiladas detrás del objeto) · #5 (el glow ES el verde de marca, no decorativo) · #8 (atmósfera "tech premium" real) | #7 | **4/9 — el mejor manejo de "vacío" de los 5 packs**, pero sin uso en producción (ver §3) |
| 9 | `bright-retail` / cover (`nuvia-presentacion/slide-01`) | #3 (la cinta/wave da profundidad y movimiento real al fondo) · #7 (rompe grilla; el subrayado en vez de color para "Sin pagar de más" es una técnica distinta al resto del sistema) | #5 — el color de acento se elige por `idx % accents.length` (línea 703), no por qué dice el slide: decorativo, no semántico | 2/9 |
| 10 | `bright-retail` / producto (`nuvia-presentacion/slide-03`) | #1, #3 (producto real con drop-shadow, ancla clara) | #5 (mismo problema de arriba) | 2/9 |

**Contra `banner-design`** (safe zone 70-80% central, máx. 2 tipografías, 1 CTA,
contraste 4.5:1, mínimos 16px/32px): el hallazgo #5 de la tabla (dead-space en
square/story) es literalmente una violación del **safe-zone rule** — cuando el 46% del
canvas está vacío, el contenido real ocupa menos del 55% del área, no el 70-80% que pide
el estándar. El "1 CTA por pieza" lo rompe la fila #2 y #6 (cero CTA visible, no que
sobren). El "máx. 2 tipografías" lo excede a propósito `editorial-photo` (Archivo +
Fraunces + Inter = 3 familias) pero es una técnica deliberada de acento editorial
confirmada por 3 referencias distintas (internas de junio y las nuevas de abajo) — no lo
marco como falla, es la excepción justificada que `impeccable` permite ("interpretar
creativamente, no converger en las mismas decisiones").

---

## 2. Referencias reales, con link y mecanismo (7 verificadas hoy)

Todas fetcheadas en vivo hoy vía `curl` + imagen de portada descargada y vista con el
visor (no descritas de memoria). Búsqueda hecha en `behance.net/search/projects` con
queries B2B/SaaS — Dribbble y Meta Ad Library bloquearon el fetch (ver cobertura real).
Se extrae **mecanismo**, no estética ni copy; nada de esto se copia.

| Ref | Link | Qué muestra (visto hoy) | Mecanismo | Aplicación concreta a Onia |
|---|---|---|---|---|
| **Aerchain — AI in Procurement** | [behance.net/gallery/211980345](https://www.behance.net/gallery/211980345/Social-Media-Carousel-B2B-AI-Product-Carousel) | Portada con 3 tarjetas de producto REALES flotando (screenshots de UI con sombra), un globo de diálogo manuscrito ("Swipe left, to know more...") y botón píldora "Swipe Left ←" | Profundidad vía **capas de UI real superpuestas**, no un ícono abstracto; la anotación manuscrita rompe la grilla tipográfica sin romper la marca | Confirma (independiente) el pack `onia-proof-ui` que ya está "propuesto" en `style-references-batch-2026-06-16.json` y sin construir: usar screenshots reales de WhatsApp/Chatwoot/n8n en vez del objeto 3D abstracto que usan `dark-product`/`dark-neon` hoy |
| **Into.AI — SalesBot (5 slides consecutivas)** | [behance.net/gallery/239459713](https://www.behance.net/gallery/239459713/Tech-Software-Carousel-Design-B2B-Marketing) | Secuencia completa: mismo wordmark+bookmark arriba, mismo footer (teléfono+redes+URL) en las 5, pero el **ícono/ilustración cambia por slide** para matchear el punto exacto (reloj de arena, cohete, chat) | Un scaffold rígido (logo, footer, tipografía) + un elemento variable por slide atado al contenido — NO un objeto 3D genérico repetido | Onia repite el MISMO objeto 3D o la MISMA composición en todas las slides de un carrusel; acá el objeto/ilustración cambia con la idea, el resto del molde no |
| **ScaleLabs — "3 Reasons Your Facebook Ads Are Burning Money"** | [behance.net/gallery/248943351](https://www.behance.net/gallery/248943351/SaaS-Carousel-Ad-Stop-Burning-Cash-Guide) | Headline en 3 líneas escaladas: gris chico → blanco mediano → **naranja gigante bold** (la palabra que golpea). Fondo: dashboard real atenuado detrás. Pie: "01/07" + "Swipe to Stop the Burn →" | Jerarquía **progresiva** (peso+color suben línea a línea hasta la palabra clave) en vez de 1 sola línea con 1 palabra en verde | Onia solo tiene "headline blanco + 1 palabra verde"; una escalada de 3 niveles (gris→blanco→verde-grande) daría más jerarquía real al mismo texto sin tocar el copy |
| **Neenopal — "How Your Coffee Order Can Predict the Stock Market"** | [behance.net/gallery/242300099](https://www.behance.net/gallery/242300099/Social-Media-Posts-B2B-Consult-SaaS) | Vista tipo revista: portada grande + grid 2×2 de interiores, cada uno con una barra de color DISTINTA por tema (púrpura/naranja/verde/lavanda) | Color como **sistema de categorías estable**, no decoración — cada tema/sección tiene SU color, siempre el mismo | Contrasta directo con `bright-retail`: hoy el acento rota por índice de slide (`idx % accents.length`, línea 703), no por qué dice el slide |
| **Stayverz — "Track small daily wins"** (quote card, Afzal Ahmed, Founder) | [behance.net/gallery/238268219](https://www.behance.net/gallery/238268219/Minimal-Typography-Carousel-with-Modern-Text-Visuals) | Byline de autoridad arriba (nombre + cargo + línea fina + flecha), arte abstracto grande, headline en 2 pesos (grande + subrayado más chico como continuación) en el mismo bloque | El espacio negativo se siente intencional porque el arte lo ocupa arriba; el texto no compite por jerarquía, se apila en dos tamaños relacionados | Es la prueba de que "mucho aire" funciona SI algo lo llena con intención (arte, textura). El vacío de `typographic` en square/story (hallazgo #5 de la tabla) falla exactamente porque no tiene ese "algo" |
| **Autmx — identidad de marca IA/automatización** | [behance.net/gallery/246689763](https://www.behance.net/gallery/246689763/Autmx-Premium-AI-Automation-Brand-Identity) | Un único asterisco 3D en vidrio/cromo con refracción y luz de borde real, sin texto, sobre gradiente negro→azul | Un objeto 3D con **material creíble** (vidrio, luz, sombra) sostiene una pieza entera sin texto | El objeto 3D que usa `dark-neon` hoy (icosaedro low-poly genérico) tiene menos producción que este; si se invierte en objetos 3D, el estándar de calidad de material es este, no el actual |
| **Zenovent — carrusel LinkedIn "Why your SaaS video has 40% drop-off"** | [behance.net/gallery/253244209](https://www.behance.net/gallery/253244209/Linkedin-Carousel-Featured-Design) | Grid de 9 slides: pills "REASON 1/2/3" en color DISTINTO y estable por número, el dato "40% / 10 SECONDS" con fondo tipo marcador-resaltador, y una slide de comment-trigger con ícono de burbuja de chat + palabra citada en grande | (a) Pills de categoría con color fijo por número — igual que Neenopal; (b) **dato numérico con su propio fondo destacado**, no texto corrido; (c) el comment-trigger lleva un ÍCONO de chat, no solo texto | (b) es un hallazgo nuevo aplicable directo: "20 horas al mes", "40% no vuelve", los precios del recibo — hoy son texto plano en el body en 4 de 5 packs; darles un fondo/chip propio los volvería dato-como-diseño (Required Quality #10) |

**Del research de junio ya existente, sigue vigente y lo confirmo con lo de arriba**:
`style-references-batch-2026-06-17.json` (`onia_action_items`) ya pedía "slide de
testimonio 5★ (falta en ONIA)" y "serif-italic Fraunces... portarlo a dark [product/neon]".
Auditando las 22 piezas de hoy: **cero slides de testimonio/prueba social** en toda la
muestra, y el acento serif-italic sigue existiendo SOLO en `editorial-photo`
(`.ed-h .g { font-family:'Fraunces' }`, línea 643) — nunca se portó a `dark-product` ni
`dark-neon`, que siguen resolviendo la palabra clave solo con color (línea 445-446,
551). Dos pendientes de hace 2 meses, todavía abiertos, reconfirmados hoy con muestra real.

---

## 3. Cambios propuestos al motor (priorizados)

Formato: qué pack toca · qué propiedad/función de `scripts/carousel_render.js` (con
línea) · por qué sube conversión o legibilidad. Ninguno se aplicó — son propuestas.

### Los 3 de alto impacto / bajo esfuerzo (primero)

**1. Extraer un `ctaAction(slide)` compartido y llamarlo en los 4 packs que no tienen botón de CTA.**
Hallazgo más grande de la auditoría, más grande de lo que parecía al principio: **4 de
los 5 packs no renderizan NINGÚN botón ni ticket en el rol `cta`** — solo texto. Verificado
línea por línea:
- `darkProductHtml` rol `cta` (línea 424-426): headline + body, sin botón.
- `darkNeonHtml` rol `cta` (línea 525): headline + body, sin botón.
- `editorialPhotoHtml` (líneas 596-672 completas): nunca referencia `triggerWord`, `ticket` ni `ctabtn`.
- `brightRetailHtml` (línea 707): el rol `cta` solo cambia el fondo a color de acento (`coverLike`), sin botón.
- Solo `slideHtml`/pack `typographic` (líneas 226-249) tiene el mecanismo real (ticket +
  botón), y depende de que `triggerWord()` (línea 181-184) matchee el regex
  `/Comentá\s+\*?([A-ZÁÉÍÓÚÑ]{3,})\*?/` en el body — si el copy no dice "Comentá X"
  (ej. un cierre "Guardalo"), el propio pack recomendado se queda sin botón también
  (prueba en vivo: `regresion-cta/slide-07.png`, hallazgo #6 de la tabla).

Por qué importa: la slide de CTA es la de mayor intención de conversión de todo el
carrusel y hoy, en 4 de 5 looks visuales posibles, no tiene ningún elemento que se lea
como "tocar/actuar acá" — es exactamente el gap que señala la regla de itemizado del
propio `CAROUSEL_SYSTEM.md` ("el cierre es la slide que casi nadie copia bien").
Esfuerzo bajo: el markup y el CSS del botón YA existen y funcionan (`onia-recibo`,
hallazgo #7, es la prueba), solo hay que sacarlos de adentro de `slideHtml` a una función
compartida (como ya son `pill()`, `dots()`, `logoFooter()`) y llamarla desde los otros 4,
más un fallback en `triggerWord()` para cuando no hay match de regex (ej. leer
`brief.comment_trigger`, que YA existe en el JSON de cada brief y hoy no se usa en el
render — se calcula por regex en vez de leerse directo del campo que el generador ya
escribe).

**2. Arreglar el vacío por auto-margin en `typographic` para `square`/`story`.**
Pack: `typographic` (función `slideHtml`, rol `cover`/`point`/`stakes`). Propiedad CSS:
`.dots{margin-top:auto}` (línea 309), `.footer{margin-top:auto}` (línea 361),
`.point-h{margin-top:auto}` (línea 341), combinado con `.slide.cover{justify-content:center}`
(línea 289). Con 2-3 elementos usando `margin-top:auto` en la misma columna flex, el
espacio libre se reparte en partes iguales entre todos ellos — a 1350px (feed) da un
hueco tolerable, a 1920px (story) o 1080px cuadrado (proporcionalmente más vacío que el
feed) da un vacío de **~40-46% del canvas sin textura**, confirmado en 3 capturas
independientes (`formato-square/slide-01`, `formato-story/slide-01`,
`ads/ad-a3-silla-vacia/slide-01`). Por qué importa: el propio código admite que el
soporte multi-formato es nuevo ("hasta el 2026-08-15 el render estaba fijo en 4:5",
comentario línea 86) — nadie revisó visualmente cómo se ve en square/story hasta hoy, y
el resultado no pasa el piso de calidad en ninguno de los dos. Dirección de arreglo (a
decidir por quien toque el motor, no prescribo la única solución): o bien anclar con UN
solo punto de `margin-top:auto` en vez de 2-3 (como ya hace `dark-neon` con `.dn-h`,
línea 561, que es la pieza con mejor manejo de vacío de toda la auditoría), o reusar la
textura de `dark-neon` (`.grid`/`.glow`/`.halftone`, líneas 540-549) como fondo por
defecto quando el ratio alto/ancho supera el de `feed`, para que el vacío se vuelva
atmósfera en vez de nada.

**3. Promover el itemizado (`lines[]`, hoy opt-in) a tratamiento por defecto del rol `cta`.**
Pack: `typographic`, función `itemLines()` (líneas 189-192) + bloque `cta` (líneas
236-246). Hoy `lines[]` es un campo opcional que solo usa un brief (`onia-recibo.json`)
de los 8 que hay en `briefs/`; el resto del rol `cta` cae al texto plano sin jerarquía
(hallazgo #2 y #6 de la tabla). `onia-recibo` es, con margen, la mejor pieza de toda la
auditoría (4/9 Required Qualities limpio, la única con dato-como-diseño). Esfuerzo bajo:
no hay que escribir CSS nuevo, ya existe y renderiza bien — es una decisión de "cuándo se
usa", no de código nuevo. Sugerencia: que el generador de briefs (`carousel_generator.py`,
fuera del alcance de esta auditoría de motor) ofrezca `lines[]` como default cuando el
carrusel vende un precio/oferta concreta, no solo cuando alguien se acuerda de pedirlo.

### El resto, priorizado después

4. **Portar el acento serif-italic (Fraunces) a `dark-product`/`dark-neon`.** Hoy la
   palabra clave en esos 2 packs se resuelve solo con color (línea 445-446 `.g{color:...}`,
   551 igual). `editorial-photo` ya probó que serif-italic sube el carácter tipográfico
   (Required Quality #4); es un pendiente de `style-references-batch-2026-06-17.json`
   (`onia_action_items`) desde junio, reconfirmado hoy — nadie lo hizo.
5. **Diferenciar visualmente el rol `save` en `editorial-photo`.** Hoy solo cambia el
   texto del pill ("FRAMEWORK") — no hay borde ni tarjeta como sí tiene `typographic`
   (`.savecard`, línea 353, borde 3px + padding 64px). Regla 4 del propio sistema
   ("slide guardable") pide que se note; hoy no se nota en el pack que más se usa.
6. **Dejar de descartar `slide.callout` en `editorial-photo`.** Verificado: `darkProductHtml`
   (línea 416-417), `darkNeonHtml` (línea 517) y `brightRetailHtml` (línea 715) sí
   renderizan `callout`; `editorialPhotoHtml` (líneas 596-672) no lo referencia en ningún
   lado. Prueba visual: `onia-costo-invisible-20260808/slide-02.png` tiene
   `"callout": "Lo barato no siempre es lo que no se paga ↘"` en el brief y no aparece en
   el PNG. Es trabajo de copy que se pierde en silencio en el pack que más se usa hoy.
7. **Hacer semántico el acento de color en `bright-retail`.** Línea 703:
   `const accent = brand.accents[idx % brand.accents.length]` — rota por índice de slide,
   no por contenido. Cambiar a leer un campo `category`/`role` del slide y mapearlo a un
   color fijo (igual mecanismo que Neenopal y Zenovent en §2).
8. **Chip/fondo propio para datos numéricos** (ver ref Zenovent, §2) — hoy "20 horas al
   mes", "40% no vuelve", los precios de línea suelta en el body, son texto plano en 4 de
   5 packs. Solo `onia-recibo` les da jerarquía propia.
9. **Slide de prueba social/testimonio** — pendiente desde `style-references-batch-2026-06-17.json`,
   cero muestras en las 22 piezas de hoy. No es una propiedad CSS puntual, es un rol nuevo
   (`role: 'proof'`) a diseñar antes de codear.
10. **Pack `onia-proof-ui`** (screenshots reales de WhatsApp/Chatwoot/n8n en vez de objeto
    3D abstracto) — ya estaba "propuesto" en `style-references-batch-2026-06-16.json`,
    reforzado hoy de forma independiente por 2 de las 7 referencias frescas (Aerchain,
    ScaleLabs). Es el cambio de mayor esfuerzo de la lista (pack nuevo, no un fix), por
    eso va al final aunque el research lo señale dos veces.

---

## Estado de cierre

**Terminado**: auditoría pieza por pieza de 22/110 PNG reales contra `impeccable`
(tabla §1), 7 referencias B2B/SaaS verificadas en vivo hoy con link + mecanismo (§2), 10
cambios de motor priorizados con pack/línea/razón (§3), cruce contra los pendientes de
junio (2 confirmados todavía abiertos: testimonio social, serif-italic en dark packs).

**A medias / no se hizo**: no se re-verificaron en vivo con `ads_library_search` ni
Chrome MCP porque esta subagente no tiene esas herramientas en su set (sí las tiene el
orquestador) — si se quiere ampliar el banco de referencias con Meta Ad Library en vivo
o Instagram real, esa llamada la hace la sesión de control. No se auditó `dark-product`
con ninguna muestra real de producción porque no existe ninguna en `out/` pese a que
`CAROUSEL_SYSTEM.md` lo marca como "el recomendado para ONIA" — es una brecha entre lo
que dice el doc y lo que se está publicando, no algo que yo pueda resolver desde una
auditoría (hace falta que alguien lo use en un brief real). Tampoco se abrieron las 3
carpetas de `out/` que quedaron fuera de cobertura (ver arriba).

**Depende de Sergio / de quien tenga el motor**: decidir CUÁL de las direcciones de
arreglo del hallazgo #2 (§3) tomar (anclaje único vs. textura de fondo) — no prescribí
una sola solución a propósito, son dos caminos válidos con trade-offs distintos de
esfuerzo. Decidir si vale la pena construir `onia-proof-ui` (cambio #10, el más caro) o
si con los 3 de alto impacto alcanza para esta ronda. Y, aparte de esta auditoría: noté
al pasar que `hermes-content/carousels/out/lucia-reveal-20260809/slide-01.png` muestra el
pill "LUCÍA ANTELO" pero su brief actual (`briefs/lucia-reveal-20260809.json`) dice
`"pill": "Presentación"` — el PNG ya generado no matchea el brief actual. No lo investigué
a fondo (no era el objetivo de esta sesión) pero si ese carrusel está entre los "ya
programados", vale re-renderizarlo antes de publicar para confirmar que dice lo que el
brief de hoy dice.

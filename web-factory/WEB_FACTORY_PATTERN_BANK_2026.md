# Web Factory Pattern Bank 2026

Last research pass: 2026-06-24

Purpose: turn design inspiration into repeatable ONIA Web Factory decisions. This is not a swipe file for copying pages. It is a pattern bank for choosing sections, visual language, assets and implementation route by business type.

## Operating Rule

Every client site must answer four questions before visual work starts:

1. What does this business sell?
2. What action should the visitor take?
3. What proof makes the visitor trust the business?
4. What visual asset makes the offer feel real?

If the answer is weak, do not hide it with animation. Fix the message, scope or asset request first.

## Research Sources

Use these sources as structural research. Do not copy code, copy, screenshots, brand identity or proprietary assets unless the license and client rights are confirmed.

| Source | Use | Policy |
|---|---|---|
| Lapa Ninja | Broad landing references by category, full-page rhythm and section order | Inspiration only |
| Landbook | Current hand-picked websites, ecommerce, portfolio, pricing, case study and product pages | Inspiration only |
| Landingfolio | Landing inspiration, components and template direction | Inspiration only |
| SaaSFrame | SaaS landing page patterns, hero, social proof, pricing and mobile-first CRO | Inspiration only |
| SaaS Landing Page | SaaS page sections: landing, pricing, features, testimonials, FAQ and contact | Inspiration only |
| Awwwards | High-end art direction, motion, typography and experimental interaction | Inspiration only, high risk for overdesign |
| Recent | Daily recent design references, websites, OG images, app screenshots and skill references | Inspiration only |
| Mobbin | Real product flows, app UI, copywriting and UX patterns | Reference for flows, not landing visuals |
| shadcn/ui | Base component architecture and ownership model | Approved base after local review |
| Tailwind CSS v4 | Utility system, theme variables, dark mode and responsive implementation | Approved technical source |
| Motion | Scroll-triggered, scroll-linked and accessible motion patterns | Approved technical source |
| web.dev Web Vitals | Performance targets and validation discipline | Approved technical source |

Automation note: the 2026-06-24 smoke test passed automated harvest for
Landingfolio, SaaSFrame, SaaS Landing Page, Awwwards, Recent and Mobbin.
Landbook returned 403/Cloudflare in Playwright, so use it manually until access
is solved. Smoke artifact:
`web-factory/data/references/design-sources/gallery-examples/2026-06-24-new-sources-smoke.json`.

## Skill Routing

Use this routing before substantial Web Factory design work:

| Situation | Skill route |
|---|---|
| Landing, portfolio, redesign | `web-factory-design-director` -> `design-taste-frontend` -> `ui-ux-pro-max` -> `impeccable` -> browser QA |
| Ecommerce, catalog, PDP, cart | `web-factory-design-director` -> `web-factory-visual-intake` -> `web-factory-commerce-storefront` -> `ecommerce-motion-retention` -> `impeccable` -> browser QA |
| Dashboard, CRM, internal app | `frontend-ui-engineering` or product UI skill -> `ui-ux-pro-max` -> `impeccable` -> browser QA |
| Visual references from Sergio | `web-factory-visual-intake` first, then save notes under `web-factory/data/references/visual/<slug>/` |
| Motion-heavy hero or scroll story | `design-taste-frontend` + Motion docs, then reduced-motion review |

Do not load every design skill for every page. Pick the route by business type and page goal.

## Universal Quality Bar

- The first viewport must show the business, offer and next action.
- No generic centered hero over abstract gradient unless the brief truly requires it.
- One primary CTA intent per page.
- Use real images or generated assets with clear purpose. Text-only marketing pages are incomplete.
- No fake metrics. Use real proof or omit the number.
- One accent color system per page unless a deliberate brand system says otherwise.
- Use section diversity: across 8 sections, use at least 4 layout families.
- Mobile first: nav, CTA, form and key proof must be usable on a phone.
- Motion must guide attention, explain sequence or provide feedback. Decoration-only motion is cut.
- Respect reduced motion and Core Web Vitals.

## Asset Request Rule

Ask Sergio or the client for images/video when the site depends on trust, proof or inspectable product detail.

Generate images or video only when:

- The client has no usable visual assets.
- The asset is conceptual, illustrative or product-adjacent, not fake evidence.
- There is no real person's identity or regulated claim being fabricated.
- The asset can be labeled internally as generated and replaced later by client material.

Do not generate fake testimonials, fake before/after health results, fake engineering projects, fake food photos for a menu item, fake official-brand proof, or fake customer logos.

Priority visual assets by site type:

| Site type | Required visual assets |
|---|---|
| Ecommerce/catalog | Product packshots, lifestyle or use photos, product video loop, category images |
| Engineering/construction | Real project photos, site photos, plans, team/equipment, certifications |
| Clinic/health | Professional portrait, clinic room, treatment context, credentials |
| Restaurant/food | Real dish photos, short kitchen/service video, menu photos |
| Local service | Technician/equipment photos, vehicle/team, service-in-action video |
| Real estate | Property photos, renders, map, floor plan, drone or walkthrough video |
| SaaS/app | Real UI screenshots, short product demo, integration logos |
| Agency/portfolio | Case visuals, campaign images/videos, client logos with permission |

## Section Library

Use these section jobs, then choose the visual pattern that fits the business.

| Section job | What it proves | Good patterns |
|---|---|---|
| Hero | What this is, why it matters, what to do next | Asymmetric split, media hero, product vitrine, authority intro |
| Trust strip | This business is real | Logos, certifications, locations, partners, case count |
| Offer blocks | What the client can buy | Services grid, packages, category cards, use-case tabs |
| Proof | Why believe this | Case study, project gallery, testimonials, before/after only if legal and real |
| Process | What happens after contact | 3-5 verb-led steps, timeline, checklist |
| Product/catalog | What can be selected | PLP, category filters, PDP, cart drawer, quote mode |
| Objection handling | Why now, why safe, what is included | FAQ, warranty, risk notes, payment/terms |
| Conversion | Capture the lead or sale | Form, WhatsApp, booking, quote CTA, checkout |
| Final CTA | Re-state action | Short CTA band with one button |

## Vertical Playbooks

### Agency / Portfolio / Creative Service

Examples inside ONIA: Bench.

Design read: authority, taste, campaign proof, serious but visually alive.

Recommended sections:

1. Hero with strongest positioning and one case visual or video.
2. Client/logo wall with permission.
3. Services by buying intent, not generic capability list.
4. Selected work with 3-6 strong cases.
5. Numbers only if verified.
6. Process from brief to launch.
7. CTA to send brief.

Avoid: vague "we craft experiences", too many decorative reels, fake awards, unlicensed client logos.

Asset needs: campaign screenshots, social reels, client logos, team/studio photo, 10-20 second showreel if available.

### Ecommerce / Catalog / Storefront

Examples inside ONIA: Nuvia, Garabato.

Design read: product-first, fast decision, honest purchase or quote flow.

Recommended sections:

1. Product/media hero with 1-2 featured products.
2. Category or routine guide.
3. Featured products with price or quote state.
4. Catalog portal or separate PLP when product count is high.
5. PDP with media, buybox, quantity, price/quote, accordions.
6. Cart drawer with persisted state.
7. Checkout, BCP flow or honest cotizacion mode.
8. FAQ around delivery, payment, stock and support.

Avoid: turning the landing into the full catalog, repeated product grids, checkout claims without payment integration, copied product images without rights.

Asset needs: clean packshots, lifestyle photos, category images, product videos, brand/legal product claims.

### Engineering / Construction / Industrial

Examples inside ONIA: HSB Engineers.

Design read: technical authority, trust, project proof, clear lead capture.

Recommended sections:

1. Hero with discipline and project type.
2. Authority proof: years, certifications, real clients or project types.
3. Disciplines/services by buyer problem.
4. Project/case gallery with scope, location and result.
5. Safety, compliance or quality systems.
6. Team/equipment if relevant.
7. Consultation form routed to CRM.
8. FAQ around timelines, bidding, documentation and site visits.

Avoid: glossy startup style, fake 3D renders, invented project stats, overexperimental motion.

Asset needs: project photos, site visits, plans, machinery, team, certifications, client-approved case data.

### Clinic / Health / Professional Care

Examples inside ONIA: DentalGest landing, Lia Albertengo.

Design read: calm trust, credentials, appointment conversion, patient clarity.

Recommended sections:

1. Hero with practitioner/clinic photo and appointment CTA.
2. Credentials, specialties and who it helps.
3. Services/treatments grouped by patient problem.
4. Process: evaluation, plan, treatment, follow-up.
5. Patient education or resources.
6. Reviews only if real and approved.
7. Booking/contact with minimal fields.
8. FAQ with disclaimers where needed.

Avoid: fake medical claims, fake before/after, generated doctor portraits pretending to be real, visual clutter.

Asset needs: real portrait, clinic photos, treatment context, service photos, legal disclaimers.

### Local Service / Repair / Installation

Examples inside ONIA: AW Climatizacion.

Design read: fast trust, local availability, clear service request.

Recommended sections:

1. Hero with service, city/coverage and urgent CTA.
2. Official partner/brand proof only if real.
3. Services by customer problem.
4. Coverage map or neighborhoods.
5. How quote/visit works.
6. Seasonal offer if real.
7. WhatsApp/form with qualifying questions.
8. FAQ on price range, warranty and timing.

Avoid: hiding contact, generic stock technicians, claiming official representation without proof, overloaded service lists.

Asset needs: technician/equipment photos, vehicle/team, product brand permission, service videos.

### Restaurant / Food / Cafe

Design read: sensory, simple, mobile ordering first.

Recommended sections:

1. Food-first hero with real dish photo/video.
2. Top 3-6 menu items, not entire menu in hero.
3. Ordering path: WhatsApp, delivery, reservation or pickup.
4. Hours, location and map.
5. Social proof/reviews.
6. Menu categories or PDF/online menu.
7. Promotions only if current and maintained.

Avoid: fake dish photos, overdesigned menus, hidden hours, no location context.

Asset needs: hero dish, menu item photos, short service/kitchen video, storefront photo.

### Real Estate / Property / Architecture

Design read: visual proof, location, availability, qualified inquiry.

Recommended sections:

1. Property/project hero with real render/photo.
2. Location and value proposition.
3. Gallery, units/plans and amenities.
4. Availability or quote state.
5. Neighborhood map.
6. Financing or reservation process if real.
7. Lead form with budget/timeframe.

Avoid: fake availability, overpromising ROI, generic luxury copy.

Asset needs: renders/photos, drone, floorplans, map, walkthrough video.

### Education / Course / Event

Design read: outcome, date, credibility, sign-up flow.

Recommended sections:

1. Hero with outcome and date.
2. Who it is for.
3. Curriculum/agenda.
4. Instructor/speaker proof.
5. Price, seat count or application flow.
6. Testimonials or alumni proof.
7. FAQ and registration CTA.

Avoid: inflated income promises, unclear date, too much syllabus detail above CTA.

Asset needs: instructor photos, venue/course visuals, short invitation video.

### SaaS / AI / App

Design read: product proof, clarity, interactive demo, security/trust.

Recommended sections:

1. Hero with concrete job-to-be-done.
2. Real product screenshot or demo video.
3. Use cases by role.
4. Integration/security proof.
5. Feature narrative, not feature dump.
6. Pricing or demo CTA.
7. FAQ and final CTA.

Avoid: abstract AI glow, fake dashboards, vague automation claims, screenshots made of divs.

Asset needs: real app screenshots, demo video, integration logos, security notes.

### Tipografía de display — LEYES MEDIDAS (Fanvue, F12 2026-08-18)

Canon para TODA superficie de Onia (landing y producto). Valores leídos del DOM, no
opinión — detalle en `data/references/design-sources/fanvue-mecanica-medida.md`.

1. **line-height ≤ 1,0 en display, y baja al crecer**: 1,00 a 50 px · 0,90 a 80 px ·
   0,80 a 106 px. Un titular grande es un BLOQUE, no líneas.
2. **tracking negativo proporcional**: −0,4 % a 50 px, **−2 % a 80 px** (`-0.02em`).
3. **un solo peso de display, sostenido** — no se mezclan.
   ⚠️ **Corregido 2026-08-20**: acá decía "peso 500, nunca 700/800". Medido en 6 sitios,
   `componentry.fun` usa **900** y `efferd` **800** en su display, con muy buen resultado.
   Era un rasgo de Fanvue, no una ley. El impacto puede venir del **tamaño** (peso 500,
   camino Fanvue) o del **trazo** (800–900); las dos direcciones funcionan y hay que
   ELEGIR una. Lo que no funciona es promediar.
4. **cuerpo al 75 % de opacidad** sobre el fondo (off-black, no negro puro): el párrafo
   cede jerarquía al titular.
5. **medida de línea ≤ 900 px** aunque la sección sea de 2000: contenedor de texto propio.
6. **superficies por transparencia (~15 %)**, no grises opacos: profundidad sin bordes.
7. **gaps generosos** (48–115 px) y marquesina 35 s `linear infinite` para prueba social
   REAL (nunca material inventado).
⚠️ Sus fuentes (AG Next/Akzidenz) son de PAGO: en Onia se aplica la mecánica sobre
**Archivo** (ya es la fuente de marca).

### Ritmo anclado — la ley que hace que una web NO parezca hecha por IA

> ⚠️ **Corregido 2026-08-20.** El título decía "Ritmo en `em`". Medido en 6 sitios, **4 de
> 6 usan `rem`**, no `em` — y cumplen igual. La ley NO es la letra: es que **el espaciado
> cuelgue de UN ancla** (`em` por sección o `rem` por documento) y que **`clamp()` sea
> marginal**: 5 de 6 tienen ≤7 usos de `clamp()` en todo el sitio. Un sistema ya escrito en
> `rem` **no se reescribe**: ya cumple. Detalle: `anatomia/SINTESIS.md` §A8 y §D1.

Medido en el CSS real de Fanvue: **1.428 `em` contra 7 `clamp()`** en todas sus hojas
(la primera pasada dio 98 vs 0 sobre una sola hoja; el barrido completo confirma la
proporción y la agranda). Todo su espaciado vertical es `em` anclado a UN font-size que
cambia por breakpoint (12,8px → 15 → 16 → 20). Cambian ese número y la página entera
reescala en proporción.

**Regla de la casa (adoptada 2026-08-18):**
- El espaciado INTERNO de una sección va en `em` → hereda la proporción del sistema.
- `clamp()` se reserva para el font-size de la sección y el ancho de contenedores.
- El fondo base es CLARO; `.dark` es un MODIFICADOR de sección (lo confirma su CSS:
  `.section{background:#ECEDEE}` + `.section.dark{background:#141414}`).
- Hover de botón: `box-shadow .4s` (se levanta), no `transform` (se mueve).
- Radios de píldora en `em` (`10em`), no en px.

Por qué importa: cuando cada token escala por su cuenta (`5.6vw` acá, `4vw` allá), la
relación entre título, texto y aire cambia según el ancho — y ESO es buena parte del
"se ve raro / parece IA" que no se sabe explicar. Detalle: `design-sources/fanvue-mecanica-medida.md` §8.

### Movimiento — receta medida (Fanvue F12, 2026-08-18)

La landing más admirada del benchmark usa **2 keyframes en todo el sitio**. Canon:

- **Revelado al entrar**: `opacity + transform`, **0,3 s**, una sola vez. Componente
  nuestro: `<Reveal>` (`src/motion/reveal.tsx`, whileInView).
- **Hover y micro-interacción**: **0,15 s con `cubic-bezier(0.4, 0, 0.2, 1)`** — color,
  fondo, sombra. Es lo dominante en 5 de los 6 sitios medidos (en 10x lo llevan 151
  elementos). Antes acá decía 0,2 s: la diferencia es la que separa un hover que se siente
  instantáneo de uno perezoso.
- **Easing, dos usos distintos**: nuestro `cubic-bezier(0.22, 1, 0.36, 1)` para
  **entradas** (es expresivo y es marca — no aparece en ninguno de los 6, y está bien que
  así sea) · `cubic-bezier(0.4, 0, 0.2, 1)` para **micro-interacciones**, donde el
  estándar ya se fijó y pelearlo sólo se siente raro.
- **Marquesina ambiental**: `35 s linear infinite`, `translateX(0 → calc(-100% - gap))`,
  `will-change: transform`. Componente: `<Marquee>` (hoy 32 s — equivalente).
- **Secciones pegadas** (`position: sticky`) para el relato: Fanvue tiene 10 elementos
  `sticky`/`fixed`, entre ellos el conmutador de rubros (630 px de alto pegado a 135 px).
- ❌ **PROHIBIDO**: animar layout, y `transition: all` (ellos lo arrastran por descuido de
  Webflow en **889 elementos**: no se copia).

Regla de la casa: **el movimiento se dispara al entrar o al hover; sólo se ata al scroll
cuando el scroll ES el relato** (una sección pegada que cuenta algo), nunca por adorno.

> ⚠️ **CORRECCIÓN 2026-08-19.** Acá decía "Fanvue no tiene NINGÚN parallax" y "2 keyframes
> en todo el sitio". Las dos afirmaciones eran **falsas**, y salieron de mirar el sitio
> antes y después de un solo scroll. Medido con `extract_web_anatomy.mjs` en 5 posiciones:
> **sí tiene movimiento atado al scroll** (5 estados distintos), hay 3 `@keyframes`
> declarados y 10 transiciones distintas. Y **no tiene `prefers-reduced-motion`**: con la
> preferencia puesta, 68 elementos siguen animando. Eso último no se copia — es un defecto,
> no una decisión.
>
> La regla de la casa (disparar al entrar, no atar al scroll por adorno) **se sostiene
> igual**, pero por sus propios motivos: cuesta menos, no marea y no se rompe bajo
> reduced-motion. No porque Fanvue lo haga, porque no lo hace.
>
> Lección: una medición floja no es neutra, **envenena el canon**. Protocolo completo en
> [`docs/ANATOMIA_DE_UNA_WEB.md`](docs/ANATOMIA_DE_UNA_WEB.md).

Detalle: `data/references/design-sources/fanvue-mecanica-medida.md` §7 ·
medición completa: `data/references/design-sources/anatomia/fanvue-com.md`.

### Captura — la escalera de popups (reel puntuado, 2026-08-18)

Un reel puntúa 8 popups de tiendas reales del 0 al 10
(`hermes-content/references/video-intake/transcripciones/Instagram-DcEITCmoSHX.txt`).
La escalera, textual: **0** no da nada a cambio y pide demasiados campos · **1** demasiado
copy · **3** buena oferta mal configurada · **5** simple y con la oferta clara · **6**
escalera de sí · **7** engagement (rascar para revelar) · **9** formato arriesgado ·
**10** multi-paso.

**La ley, y es lo único que hay que retener: el paso 1 NO pide datos, pide un CLIC.**
Ese clic hace dos cosas a la vez — segmenta (dice qué quiere la persona) y es un
microcompromiso que sube la conversión del paso 2. El dato viene después.

Corolario duro: **si la respuesta del paso 1 no se guarda junto al lead, el multi-paso no
sirve de nada** — es un popup de email con un clic extra de fricción. Sin ese guardado, un
10/10 vuelve a ser un 5/10.

Bloque de la casa: `packages/blocks/src/two-step-popup.ts` (`renderTwoStepPopup`).
Decisiones que van con él y no se revisan cada vez:

- **WhatsApp, no SMS ni correo obligatorio.** En Bolivia el canal del comprador es
  WhatsApp; el correo queda opcional porque dos campos obligatorios en el paso 2 tiran
  abajo lo que ganó el paso 1.
- **Cero confirmshaming.** El descarte dice "Ahora no". El "no gracias, prefiero pagar
  precio completo" lo castiga el propio reel y no va con la marca.
- **Nunca al instante ni a pantalla completa en móvil** (Google penaliza intersticiales
  intrusivos): dispara por scroll/tiempo/salida y en móvil entra como hoja inferior.
- **`<dialog>` nativo con `showModal()`**: el foco atrapado y el Escape vienen gratis. No
  se reimplementan a mano.
- **El descarte se recuerda en `cancel`, no solo en `close`.** El evento `close` se
  dispara en tarea ENCOLADA: si la persona aprieta Escape y navega en el mismo instante,
  el descarte se pierde y el popup la vuelve a interrumpir. `cancel` es síncrono.
- **El bloque trae su propio `box-sizing: border-box`.** Un bloque que publica su hoja de
  estilos no puede depender de que la página anfitriona traiga reset: sin esto el padding
  se suma al 100 % y la hoja móvil se sale de pantalla llevándose el botón de cerrar.
- **La atribución no se duplica**: `src` viaja como campo oculto y el runtime lo pisa con
  el `?src=` de la URL, alimentando el MISMO circuito de leads que ya corre en producción.

### Secuencia de scroll en canvas (el patrón de Apple) — DECISIÓN: NO se construye

Un tutorial recrea la animación de los AirPods
(`transcripciones/Instagram-Db8hFCFFTZg.txt`): no hay 3D ni video, son **64 imágenes**
dibujadas en un `<canvas>`, con el frame atado al scroll por GSAP ScrollTrigger
(`snap:"frame"`, `ease:"none"`, `scrub:0.5`, `onUpdate:render`). El código es trivial.

**El bloqueante es el peso, y acá está medido sobre contenido nuestro** (una foto de
`apps/onia-platform/public/fotos/`, reescalada y recomprimida con Pillow — la foto es el
peor caso: un render sobre fondo plano comprime bastante mejor):

| Por frame | PNG | WebP q75 | AVIF q50 |
|---|---|---|---|
| 1600×900 | 1.715 KB | 97 KB | 69 KB |
| 1280×720 | 1.202 KB | 76 KB | **50 KB** |
| 960×540 | 746 KB | 51 KB | **33 KB** |

Secuencia de 64 frames: **75 MB** en PNG · 4,8 MB en WebP · 3,2 MB en AVIF a 1280 ·
**2,1 MB** en AVIF a 960. Bajando a 48 frames (el piso antes de que el paso se vea a
saltos): **1,6 MB**. Con un render sobre fondo plano, optimista: **~0,5 MB**.

**Veredicto: no entra.** El presupuesto de una landing es 150 KB de JS + 30 KB de CSS;
la versión más barata que sigue viéndose bien pesa entre **3,5× y 10× ese presupuesto
entero**, y no convierte nada — es techo visual. Mientras tanto la indexabilidad (C1)
sigue abierta, cuesta 0 KB y sí trae prospectos.

Se reabre solo si: el producto del cliente **ES** el objeto (una máquina, un vehículo, un
equipo) y la secuencia reemplaza a un video; y aun ahí va con carga progresiva por tramos
(los primeros 8 frames eager, el resto en streaming, el canvas dibuja el más cercano
cargado) y se mide LCP/CLS antes y después. Con `prefers-reduced-motion` es un frame fijo,
sin scrub.

⚠️ Dos cifras del prompt original no resistieron la verificación: el video dice **64
imágenes**, no 150 frames; y "69 KB por frame" no es PNG (medido: 1.202 KB a 1280×720) —
69 KB es más o menos lo que cuesta un **AVIF** a 1600.

### Dashboard / Analytics / Internal Tool

**DIRECCIÓN ELEGIDA (Sergio, 2026-08-17): "libro mayor editorial" (v4→v5).**
Los 5 patrones consagrados — todo dashboard nuevo de Onia parte de acá:
1. **Jerarquía por tipografía, no por superficie**: numeral héroe (Bricolage ~260 de
   peso óptico) SIN tarjeta, sobre lienzo claro único. (Ledgerix, Callivio — Behance)
2. **El gráfico ES el control**: full-bleed tipo código de barras que además filtra
   el rango (Hoy/7/30). Nunca gráfico decorativo + filtro aparte. (Ledgerix)
3. **Propuestas del agente INLINE junto a su evidencia** (el recordatorio de una
   factura vive bajo ESA factura) — el acierto de v4 que Sergio ratificó.
4. **Estado global como píldora oscura flotante** (única superficie oscura de la
   página): contador de decisiones + acceso al agente. (Ledgerix dock, Recent pill)
5. **KPIs como celdas de pelo** (hairline, sin caja) y tablas restadas: solo lo que
   decide una acción; lo secundario vive en su panel. (Convox; pasada sustractiva v5)
Referencia viva: hermes-content/references/ui-patterns/panel-claro-premium/index-v4.html
(+v5 sustractiva). Detalle crudo por galería: docs/DESIGN_LEARNED_2026.md §5b.



Design read: status at a glance, dense but legible, action over decoration.
Density is a feature here, not a flaw; the win is understanding state in seconds
and being able to filter or act without friction.

Recommended sections:

1. KPI overview row: 4-6 metrics with value, delta and period context.
2. Chart grid: 2-3 charts, one insight each, with title, unit and legend.
3. Data table: sort, filter, pagination, plus explicit loading and empty states.
4. Filter bar that controls the whole view, not one widget.
5. Optional app shell with side navigation and account/context switcher.
6. Row actions with confirmation on anything destructive.

Avoid: KPI cards with no hierarchy, decorative charts with no insight, tables
with no loading/empty state, fake data mistaken for approved data, motion for
its own sake.

Asset needs: approved metrics/series or a signed-off mock, KPI definitions with
units and periods, brand mark for the shell, state iconography.

License-clear sources (see design intelligence doc): Tremor (Apache-2.0),
Tabler (MIT), shadcn/ui charts + dashboard-01 (MIT), Hugging Face Spaces
(per-Space, review required). Extract structure and component taxonomy; never
copy identity, proprietary data or assets.

#### Composition patterns (reference-mined 2026-08, anti-generic kit)

Mined from three hand-picked references for the Onia panel redesign. Extract
STRUCTURE only; never copy identity, palette or assets. Each pattern names its
source shot.

From **Stakent Crypto Dashboard** (Awsmd, dribbble.com/shots/23902428):

- **Chart as card anatomy, not widget.** The KPI card's area/line chart bleeds
  to the card's bottom edge and sits UNDER the figure; a floating value chip
  rides the line. The chart is part of the card, not a sibling in a grid.
- **Numeric weight mixing inside one figure.** In a long number the significant
  digits are heavy/bright and the tail (decimals, unit) drops weight and
  contrast. One glance gives magnitude; precision stays available.
- **One poster card among quiet cards.** A single card with a gradient accent
  surface (their Liquid Staking promo) breaks an otherwise neutral rhythm.
  Never more than one per view.
- **Nav rows that carry data.** The active sidebar section expands into rows
  with live amounts and a count badge; navigation doubles as a summary.
- **Compact filter pills row** (time range, category, sort) right-aligned at
  the section title, each a self-contained pill with caret.

From **Healthcare Dashboard** (OnPoint Studio, dribbble.com/shots/25540988):

- **Card-in-card metric tiles.** A parent panel holds nested mini-cards, each
  with label + "detail" chip header, a goal/context chip, a big figure with a
  small unit, and a micro-chart (bars/waveform) INLINE next to the figure.
- **Selection = solid inversion.** In icon+title+description list rows, the
  active row becomes a full accent-color pill with white text; inactive rows
  stay white with icon-in-tinted-circle. State reads instantly.
- **Depth by overlap.** A floating spec card overlaps the dominant visual
  (their 3D organ); layers give the page a foreground and a background instead
  of a flat card grid.
- **Greeting as page title** with a count subline ("You have 3 appointments
  today") and a right-aligned cluster of pill controls (date, range, mode).
- **One dark anchor card** on a light canvas (their "Issue Found" alert) to
  hold the composition's corner and flag what needs attention.

From **Task Management Dashboard** (Fireart Studio,
dribbble.com/shots/25241984):

- **Hero KPI cell.** In a 4-cell KPI row, the FIRST cell is a solid dark
  accent card (big figure, glow, delta badge); siblings stay white. Hierarchy
  comes from surface, not from font size alone.
- **Texture encodes state in charts.** Weekly bars: solid fills in two brand
  shades for actual data, diagonal-hatch outline bars for future/pending
  periods; a value tag chip marks the highlighted bar. Same trick in their
  semi-donut gauge (hatched segment = pending). Charts get character AND a
  semantic layer with zero extra ink.
- **Dark utility tiles at the corners.** Small dark-surface cards (time
  tracker, promo) with a subtle texture background frame the light canvas.
- **People/progress rows with right-aligned status chips** (tinted Completed /
  In Progress / Pending) and "working on X" metadata; scannable attribution.
- **Circled-arrow affordance** top-right of every KPI card as the uniform
  "go deeper" control.

Web Factory carriers for these patterns (`packages/templates/src/dashboard.ts`):
`DashboardKpi.variant: "accent"` (hero KPI cell), `DashboardKpi.spark`
(chart-in-card), `DashboardPoint.pending` (hatched bars),
`DashboardData.lists` / `DashboardProgressList` (rows with status chips).

### Legal / Finance / Consulting

Design read: restraint, clarity, authority, low-risk conversion.

Recommended sections:

1. Hero with problem and credibility.
2. Areas of practice/service.
3. Process and expected deliverables.
4. Team credentials.
5. Case notes anonymized when needed.
6. Compliance/privacy notes.
7. Booking/contact with qualification.

Avoid: aggressive sales tone, fake guarantees, flashy motion, weak privacy language.

Asset needs: professional portraits, office photo, credential proof, approved case summaries.

## Page Recipes

### Fast Landing

Use for one offer or campaign.

Sections: hero, trust/proof, offer, process, FAQ, CTA.

Best for: health professional, course, service promo, product launch, audit offer.

### Web Pro

Use for authority and SEO.

Sections: hero, trust, services, cases, process, team/about, FAQ, contact. Add subpages when services, cases or SEO topics need room.

Best for: engineering, agency, consulting, clinic, local service.

### Catalog / Store

Use for product sales.

Sections: campaign landing, catalog PLP, PDP, cart, checkout/quote, support FAQ.

Best for: cosmetics, food products, merch, tools, retail.

### CRM Capture Site

Use when the website is part of a sales system.

Sections: hero, qualification CTA, services, proof, form, CRM states, follow-up expectations, FAQ.

Best for: engineering, clinics, B2B service, high-ticket local services.

## Visual Direction Matrix

| Rubro | Visual language | Density | Motion |
|---|---|---:|---:|
| Agency/portfolio | Editorial, bold type, campaign media | 4 | 6 |
| Ecommerce beauty | Product-first, editorial, clean media | 5 | 5 |
| Engineering | Technical, sober, documentary | 6 | 3 |
| Clinic/health | Calm, clean, high trust | 4 | 2 |
| Local service | Practical, local, fast CTA | 6 | 3 |
| Restaurant | Sensory, photo-led, warm but not generic | 4 | 4 |
| Real estate | Cinematic, gallery-led, map/context | 5 | 5 |
| Education/event | Clear, energetic, schedule-led | 5 | 4 |
| SaaS/AI | Product proof, structured, interactive | 5 | 5 |
| Legal/finance | Conservative, high contrast, credible | 5 | 2 |

## Current Trends Worth Using Carefully

- Bold typography: useful when the message is strong. Not a license for oversized unreadable heroes.
- Bento grids: useful for grouped product/service proof. Must include visual variation, not six text cards.
- Micro-interactions: useful for buttons, cards, forms and reveals. Must support reduced motion.
- Glass/translucent layers: useful for premium or app-like surfaces. Do not use where contrast or trust is fragile.
- Mobile-first: every Web Factory template must assume WhatsApp/social traffic.
- Personalization and funnels: useful for forms, quizzes and ad-specific pages, but only when ONIA can maintain the variants.
- AI-assisted visuals: useful as placeholders or concept art. Do not fabricate proof.

## Pre-Ship Checklist

- [ ] Design read declared by rubro and audience.
- [ ] Primary CTA appears in hero and final section with the same intent.
- [ ] Real or generated asset plan exists.
- [ ] No copied third-party code, copy, imagery or identity.
- [ ] Section order matches page recipe.
- [ ] Mobile nav, CTA, form and media are tested.
- [ ] Motion has reduced-motion fallback.
- [ ] LCP, INP and CLS targets are considered before large video/image choices.
- [ ] Client risks are visible: payment, WhatsApp, legal claims, credentials, stock, delivery or approvals.

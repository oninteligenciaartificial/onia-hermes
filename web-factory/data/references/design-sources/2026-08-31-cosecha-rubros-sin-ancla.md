# Cosecha de los 4 rubros SIN ANCLA (2026-08-31)

Cierra la cola P0 que dejó el crítico adversarial en
`2026-08-29-critico-limites.md:42` — cuatro rubros que la fórmula recetaba **por
analogía, con cero sitios reales en el corpus**: dental real, ganadero/agtech,
importadora/B2B e IA/agentes. Onia vende los cuatro.

**Método** (el mismo que ya funcionaba, no uno nuevo): Scrapling
`Fetcher.get(impersonate="chrome")` sobre el HTML servido + **seguir el
`<link rel=stylesheet>`** para leer las variables de marca. Los hexes se cuentan
del CSS, pero lo que se cita es el **token declarado** (`--colours--...`), que es
la marca; la frecuencia sola miente. Cada sitio dio 200 y se guarda su cifra
verificable (bytes, h1 real).

## Lo cosechado (8 sitios vivos, 2 por rubro)

| Rubro | Sitio | HTTP | bytes | h1 real |
|---|---|---|---|---|
| Dental real | smilebar.com | 200 | 70.435 | "Welcome to Smilebar, Boston's Top Invisalign Orthodontist." |
| Dental real | dntlbar.com | 200 | 184.735 | "dental for the people." |
| Ganadero | halterhq.com | 200 | 202.580 | "Halter for beef, now powered by satellite" |
| Ganadero | agriwebb.com | 200 | 266.325 | (sin h1 en el servido; title "Livestock Management Software") |
| Importadora | flexport.com | 200 | 788.901 | "AI-powered logistics for the real world" |
| Importadora | zencargo.com | 200 | 108.641 | "Your trusted digital freight and supply chain partner" |
| IA/agentes | sierra.ai | 200 | 314.666 | "Better outcomes. Built on Sierra." |
| IA/agentes | decagon.ai | 200 | 346.443 | "The AI concierge for every customer" |

Descartados por no servir contenido (shell JS, no se puede computar nada):
**tend.com** (403 a Scrapling) y **dentologie.com** (200 pero **6.192 bytes**,
solo el stack de sistema con Inter). Un 200 no alcanza: si el HTML servido no
trae CSS ni h1, no es ancla.

## Dental real — la hipótesis se sostiene, con UNA corrección medible

Los dos anclajes traen **acento cálido de arena/durazno**, que es exactamente lo
que el playbook recetaba por analogía desde salud mental:

- **dntlbar**: `#E6D2AF` (59 usos, el hex no-neutro más frecuente del sitio)
  sobre tintas `#292929` / `#333333` y una escala gris entera. WordPress/Salient.
- **smilebar**: token declarado `--color-scheme-1--peach: #F9DCCB`, más
  `--color-scheme-1--blue: #3068F6` y primitivas neutras `#222`→`#EEE`. Webflow.

🔴 **Corrección al playbook (§1 decía "sat <15%")**: los acentos reales miden
**HSV S 23,9%** (`#E6D2AF`) y **18,5%** (`#F9DCCB`). Los dos **reprueban** el
umbral escrito. El umbral venía de medir `#DFD7C8` (HSV S 10,3%) y `#CCC0A8`
(17,6%) — o sea, se escribió el piso de la muestra como si fuera ley. Se sube a
**<25%** y **se declara el modelo**: es saturación **HSV**. En HSL los mismos dos
hexes dan **52%** y **79%**, que leído sin el modelo suena a "color chillón" y
hace descartar el acento correcto.

**Tipografía — acá la receta era optimista.** De los dos, solo dntlbar usa
display serif (**Song Myung**, + Open Sans / Nunito Sans de cuerpo). smilebar
corre **Satoshi en TODA la página** (10 archivos `.otf`, de Light a Black, el
mismo family para display y para body) — el "mono-sans" que
`MOTION_PATTERN_BANK:462` prohíbe, en un sitio real que factura. O sea: el par
serif+grotesca es **1 de 2** en el mercado real, no la norma. Sigue siendo la
recomendación de Onia (diferencia), pero se cita como decisión, no como
observación.

## Ganadero / agtech — el mayor hueco, ahora con dos anclas

Convergen en **verde profundo/orgánico + fondo hueso cálido**, NO en el verde
"agro" saturado que uno supondría:

- **halterhq** (tokens declarados, Webflow): `--colours--foreground--fg-default:
  #294E3B` (verde bosque, HSL L 23%) · `--colours--background--bg-subtle:
  #F7F5F1` (hueso cálido) · `--colours--foreground--fg-accent: #E3FDCB` (lima
  pálido) · `--colours--background--bg-brand-sky: #CBE5F6`. Tipografía **PP Neue
  Montreal** (3 pesos) + **Caveat** declarada como `--type--script` (nota
  manuscrita: es el guiño de campo). **GSAP ×23** y `<video>`: el rubro sí anima.
- **agriwebb**: `#65BB38` (verde señal) + `#F8F7F4` (hueso cálido, HSV S 3,7%) +
  `#000A17` / `#092343` (azul casi negro) + `#39A7C4`. Open Sans + Lato +
  **Cardo** (serif, `cardo_normal_400.woff2`) para display. Sección
  `block-horizontal-sticky-scrolling-section` — scroll horizontal pineado, el
  patrón estrella, en agtech real.

**Regla que sale del dato**: el ganadero NO es "verde brillante sobre blanco".
Es tinta verde oscura sobre hueso cálido, con el verde vivo reservado a acento.

## Importadora / logística B2B — sale del proxy automotor

- **flexport** (189 tokens `--c-*` nombrados): `--c-navy: #052439` y
  `--c-midnight: #052439` (la misma tinta), acentos `--c-seafoam: #45DABE` +
  `--c-indigo: #566AE5`, fondos `--c-pampas: #F4F2EF` y `--c-sand-white: #F6F6F6`.
  Tipografía **GT America** en dos anchos: **Extended** para display, **Standard**
  para cuerpo — un solo family, el contraste lo da el ancho, no una segunda cara.
- **zencargo**: `#080E49` / `#0A1158` (navy profundo) + `#0D97F2` (azul señal) +
  `#31A575` (verde) sobre `#F5F7FA`. **Larsseit** display + **Lato** cuerpo.
  Secciones legibles del HTML: `hero--frontpage bg-darkNavy` → `logo-strip` →
  `why-zencargo` → `block-slider-testimonial`.

**Corrige el playbook**: §7 recetaba "negro `#010101`, dominante mono, **1**
acento único", heredado de scoutmotors (automotor). Las dos importadoras reales
usan **navy, no negro**, y **dos** acentos (uno frío de confianza + uno vivo de
señal). Y las dos ponen el **logo-strip inmediatamente después del hero**, que el
esqueleto universal ya predecía.

## IA / agentes — el rubro que Onia vende y estaba huérfano

- **sierra.ai** (Next, 524 refs `/_next/`): paleta de tokens **cálida y verde**,
  no la azul-tech de manual — `--color-gray-100: #F6F5F3`, `--color-gray-200:
  #E4E0DC` (grises **cálidos**), `--color-green-500: #006838`,
  `--color-green-800: #05351D`, negro `#222`, y `--color-red: #E94E2A` como señal.
  **GT America Standard + GT America Mono** (el mismo family que flexport; el mono
  es el tercer nivel, tal cual la regla de Onia).
- **decagon.ai** (Webflow): `#5754FF` (índigo, 43 usos) + `#0F281B` / `#2B4539`
  (verde bosque) + `#FF6F22` (naranja señal) + `#D499FE`. **CircularXX** cuerpo +
  **DM Sans** + **`PPFragment.woff2`**. Secciones nombradas, el molde entero
  legible: `section_new-hero` → `section_logo-grid_customer-quotes` →
  `section_product-highlight` → `section-timeline` → `section_channel-highlight` →
  `section_customer-highlight` → `section_resource-highlight` →
  `section_bottom-cta`. **Lottie ×34**.

🟢 **Cierra el hallazgo #1 del crítico**: `PP Fragment` aparece acá por segunda
vez, en un sitio de agentes IA — la primera fue readily.ai (SaaS). Queda probado
que la cara existe y **que pertenece al bucket SaaS/IA, no al dental** al que se
la había atribuido. La corrección del 29-ago era correcta y ahora tiene su
segunda muestra.

## Ruido de scraper nuevo (para §0 del playbook)

**`#4285F4` = azul de Google.** Aparecía 13 veces en smilebar y parecía su
primario; el contexto lo desmiente: `<circle ... fill="#4285F4">` dentro del SVG
del badge de reseñas. Todo sitio con widget de Google Reviews lo trae. No es
marca. (Mismo modo de falla que los defaults de Webflow ya listados.)

## Lo que NO se cosechó

- **Portfolio (N=1 legible)** sigue flaco: no entraba en este ítem (B1 nombra 4
  rubros) y queda anotado para el carril B.
- Las tipografías se leen del **filename del `.woff2` / `.otf`**, no de
  `font-family` — los cuatro rubros usan `var()` en el CSS, así que el nombre
  humano solo está en el archivo. Vale la lección del 29-ago, ahora en 8 sitios.

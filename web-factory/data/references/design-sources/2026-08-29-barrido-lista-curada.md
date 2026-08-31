# Barrido de la lista curada de Sergio — 13 fuentes (2026-08-29)

Pedido: "mirá las webs que te di, entrá al navegador y aprendé". Método:
Playwright headless, captura fullpage + tokens computados (fuentes, fondos,
CTA) por fuente; capturas y `tokens.json` en el scratchpad de la sesión;
estudio visual de las de modo estructura/mood. Complementa (no repite) el
audit estructural del 2026-06-15 y el despiece salud-premium del mismo día.

## Resultado por fuente (las 13 respondieron)

| Fuente | Tokens medidos | Lección que me llevo |
|---|---|---|
| 21st.dev | General Sans, oklch neutro, r=6 | taxonomía de componentes comunitarios; catálogo a minar por bloque |
| fontpair | Geist+Geist Mono, pill | pairings Google Fonts listos; útil al armar receta por cliente |
| **10x.app** | tinta/blanco, CTA negro pill | **hero-que-ES-el-producto** (input arriba), chips de casos de uso, **features numeradas expandibles + UN device** (mejor que grid de 3 cards), trust por íconos de producto |
| motion-primitives | Inter+GeistMono | kit de motion React; para nivel 2 (Next) |
| watermelon-ui | mono+Inter, verde lima 0px radius | taxonomía React; estética brutal-dev (no cliente) |
| componentry | Geist+JetBrains, dark | premium components; licencia MIT por bloque |
| shadcn | Geist, lab() neutros | base aprobada nivel 2; su neutralidad es punto de partida, no de llegada |
| efferd | Geist+Outfit | bloques Tailwind por licencia; lista de compras para packages/blocks |
| lapa.ninja | Inter+Google Sans | índice 7.300 landings; portada 200 OK headless (categorías minables en próximas vueltas) |
| haikei | violeta #8b7af4 + tinta | generador SVG (waves/blobs) → texturas PROPIAS para bandas |
| rotato | walsheim, azul | mockups 3D device; para heros con captura REAL montada |
| **dribbble Axion** | Mona Sans; negro+naranja | receta **dark-performance**: condensada MAYÚSCULA gigante + UN acento quemado + bento de métricas-instrumento → entra al Visual Direction Matrix |
| stitch | dark app | generador de direcciones (hay MCP conectado); explorar, nunca entregar su output directo |

## Meta-patrón que confirma nuestra regla anti-template

Las herramientas dev comparten uniforme: **Geist/Inter + pill + tinta
casi-negra + neutros oklch**. Ese es exactamente el "default AI" que una web
de CLIENTE debe evitar — la identidad se construye con serif/display con
carácter, paleta del rubro y acento propio (confirmado por contraste con las
referencias de salud premium, que hacen lo opuesto al uniforme dev).

## Aplicado ya

- Matrix: fila nueva "Performance (dark-performance)" con fuente citada.
- Salud premium: aplicado ayer mismo a clinic + demo (ficha propia).

## Segunda pasada EN VIVO (navegador, misma fecha)

**Motion-Primitives — inventario completo (17 primitivas, del sidebar real):**
accordion · animated-background · animated-group · border-trail · carousel ·
cursor · dialog · disclosure · in-view · infinite-slider · transition-panel ·
text-effect · text-loop · text-morph · text-roll · text-scramble · text-shimmer.
Mapa a lo nuestro: `in-view`≈Reveal, `infinite-slider`≈marquee,
`text-loop/roll`≈conmutador de rubros, `border-trail`=detalle premium para
tarjeta destacada, `transition-panel`=tabs animadas (nivel 2).

**21st.dev — taxonomía con volúmenes (demanda por bloque):** Heroes 1152 ·
Grids&Bento 620 · CTA 501 · Features 318 · Stats 153 · Testimonials 161 ·
FAQs 191 · Timelines 74. **Populares (señal de mercado HOY):** scroll-media-
expansion hero (9k) · container-scroll animation (8.9k) · spotlight card
(7.4k) · radial orbital timeline (6.5k) · testimonials columns (5.6k) ·
background paths (4.9k). Lección: el mercado pide heroes scroll-driven y
tarjetas con foco de luz — versiones CSS-only viables para nivel 1.

**Lapa por categoría:** slugs de categoría no estándar + 403 al tercer hit
(rate-limit). No se pelea; el minado fino queda para tandas espaciadas.

**Texturas generativas (estilo Haikei, PROPIAS):** `textura-ondas.svg` y
`textura-arco.svg` en `data/clients/dental-amanecer.assets/` — muestra para OK
de Sergio antes de cablear en bandas.

## Herramienta de cosecha: Scrapling (decisión de Sergio, 2026-08-29)

Sergio pidió explícitamente usar **Scrapling** (github.com/D4Vinci/Scrapling)
para las galerías que quiere que aprenda. Su `StealthyFetcher` pasa Cloudflare
Turnstile — exactamente el 403 que frenó el Playwright headless en tend-dental,
lapa-por-categoría y el soft-block (202) de dribbble.

⚠️ Esto SOBREESCRIBE la línea del router "NO instalar scrapers nuevos
(ScrapeGraphAI descartado, Crawl4AI del VPS resuelve)": Crawl4AI no vive en esta
máquina Windows y no resolvió estos bot-walls. La instrucción explícita de
Sergio manda. Instalado a user-site del Python 3.12 global; script cosechador
en el scratchpad de la sesión (`scrapling-harvest.py`), rate-limited (1
categoría por corrida). Uso: research de diseño sobre galerías públicas que él
curó — no datos personales, no credenciales.

## Recorrido COMPLETO 1→15 en navegador (pedido de Sergio, misma fecha)

Las 15 fuentes de la captura, en orden, todas visitadas. Deltas nuevos sobre
lo ya fichado arriba:

- **[2] repo ui-ux-pro-max**: vivo, v2.13.0, 123k⭐; carpetas nuevas `gallery/`
  y `stack/` (starter kit) → **candidato a actualizar la skill instalada**
  (publica `uipro-cli` en npm).
- **[4] Fontpair**: los "brand kits" (pairing+paleta) traen destacado
  **Fraunces + Sora sobre verde-oliva** — valida la dirección tipográfica de la
  demo desde la propia fuente. Formato brand-kit = nuestro design.json.
- **[8] efferd**: conteo por categoría — CTA 20 · Auth 14 · Footer 14 ·
  Integrations 12 · Contact 11 · Features 10 · App Shell 10 · Dashboard 10 ·
  Hero 9 (+3 free) · Testimonials 8 · Pricing 7 · FAQs 8. Los FREE son los
  legalmente estudiables.
- **[10] Componentry**: MIT, instalable vía `npx shadcn add @componentry/...`;
  catálogo wow: matrix-rain, scroll-velocity, infinite-icon-field,
  magnet-lines, dither-gradient, magnetic-dock. Nivel 2 directo; inspiración
  CSS-only para nivel 1.
- **[11] lapa (galería mirada)**: tendencia dominante del muestrario:
  **monocolor pleno + display gigante como identidad entera** (A Love Story
  rojo, Magnet Lover violeta) — dirección de alto impacto, barata con nuestro
  motor (banda plena + serif variable) para clientes de marca fuerte.
- **[13] Watermelon**: SPA registry premium (dashboards/blocks React);
  licencia se verifica por bloque (audit 2026-06-15 la marcó unverified).
- [1,3,5,6,7,9,12,14,15] ya fichadas arriba (21st, motion docs, Stitch,
  Axion, Rotato, shadcn, Motion-Primitives, 10x, Haikei) — validadas en vivo.

## Pendiente para próximas vueltas del loop

- Minar lapa.ninja por categoría (restaurante, comercio, servicios) para el
  resto de verticales del matrix.
- Patrón "features numeradas + device" (10x) como candidato de bloque nuevo —
  entra en la PROPUESTA de bloques para OK de Sergio (junto a cifra-editorial
  y quote-única).
- Haikei: generar 2-3 texturas SVG de prueba para bandas del clinic.

## Minado lapa por categoría — tanda 1: `health-fitness` (run del loop)

**Cómo se cosechó (corrige lo que decía arriba):** el 403 de Cloudflare cae con
`Fetcher.get(stealthy_headers=True, impersonate="chrome")` de Scrapling — httpx
puro, sin navegador. El `StealthyFetcher` **no arranca en esta máquina**:
`launch_persistent_context: spawn UNKNOWN` (el driver de patchright no puede
spawnear el chromium bajo el contenedor MSIX de la app; `launch()` normal sí
funciona, y pasar `user_data_dir` propio NO lo arregla). Conclusión práctica:
para galerías, **primera opción `Fetcher.get` impersonate**, no el navegador.

**Slugs reales** (el `health` de la cola daba 404): son **83** y están todos en
`all_category_slugs` del JSON de la cosecha. Los de la cola mapean así:
health→`health-fitness` · ecommerce→`ecommerce` · services→no existe, lo cubren
`agency`/`business`/`corporate` · beauty→`beauty` · food→`food-drinks`.

12 landings en `2026-08-29-lapa-health-fitness.json` (con tokens medidos de 6,
capturadas a 1440px y miradas una por una).

### Las 3 mejores del rubro salud — y qué me llevo de cada una

1. **Baba Care** (callbaba.com) — *la más portable a un cliente nuestro.*
   Rojo pleno de marca en TODO el hero (no un acento tímido), display grotesca
   pesada sobre él, y a la derecha una foto con **píldoras flotantes que narran
   el servicio** ("Medication refill coordinated", "Car booked to appointment").
   Eso es exactamente nuestro spotlight/banda tinta pero con **prueba de
   servicio encima de la foto** — barato de replicar y mata el "grid de 3 cards".
   Doble CTA asimétrico (sólido + fantasma) y teléfono en el nav: patrón de
   clínica que convierte.
2. **Frequency Breathwork** (frequencybreathwork.com) — *serif + video calmo.*
   Serif alta en MAYÚSCULA centrada sobre video de bosque, crema `#F2EFE9` y
   arcos finos de línea al borde. Valida la dirección salud-premium de la demo
   y aporta el recurso "**arcos de línea como marco**" (nuestro `textura-arco.svg`
   ya apunta ahí). Nav flotante en pill con toggle de sonido.
3. **Dawn** (joindawn.com) — *split editorial 50/50.*
   Fondo marrón oscuro `rgb(50,28,4)` con dos paneles redondeados: gradiente
   amanecer + foto, y **el titular partido en dos mitades que se completan**
   ("Your mind is always on." / "Your support should be, too."). Source Serif 4
   + Figtree. Es un hero de dos columnas con carga editorial: candidato directo
   a variante de nuestro hero para clientes con una sola foto buena.

**Descartadas y por qué:** Rise Plasma = página muerta (aviso de
"restructuring", no es una landing). Nudge = uniforme dev (Inter + pill), justo
lo que evitamos. Maxima Therapy queda de suplente: display `Robuck Rounded` a
214px sobre verde pleno con ilustración plana — impacto altísimo, pero registro
infantil/ONG, no clínica privada.

**Próximas tandas (orden de la cola):** `ecommerce` · `agency`/`business` · `beauty` · `food-drinks`.

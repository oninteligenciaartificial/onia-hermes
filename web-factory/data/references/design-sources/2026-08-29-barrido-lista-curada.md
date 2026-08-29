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

## Pendiente para próximas vueltas del loop

- Minar lapa.ninja por categoría (restaurante, comercio, servicios) para el
  resto de verticales del matrix.
- Patrón "features numeradas + device" (10x) como candidato de bloque nuevo —
  entra en la PROPUESTA de bloques para OK de Sergio (junto a cifra-editorial
  y quote-única).
- Haikei: generar 2-3 texturas SVG de prueba para bandas del clinic.

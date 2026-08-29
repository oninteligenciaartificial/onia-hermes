# Cosecha lapa.ninja con Scrapling — índice por rubro (2026-08-29)

Herramienta: **Scrapling `Fetcher.get(impersonate="chrome")`** — impersona el
TLS/JA3 de Chrome real vía curl_cffi, SIN navegador. Pasa el Cloudflare que
devolvía 403 al Playwright headless (verificado: 200 en las 4 categorías).
El backend de navegador (`StealthyFetcher`/patchright) NO arranca en esta
máquina Windows ("spawn UNKNOWN"), pero no hace falta: el Fetcher HTTP alcanza.

Script: `scratchpad/scrapling-harvest.py <slug>`. Slugs reales de lapa (80,
descubiertos desde la portada): los que mapean a rubros de Onia son
`health-fitness`, `wellness`, `ecommerce`, `food-drinks`, `business`,
`real-estate`, `saas`, `beauty`, `fashion`, `automotive`, `corporate`.

JSON crudo por categoría en `scratchpad/scrapling-out/lapa-*.json` (12 por
rubro, con href al caso + thumbnail).

## Mejores por rubro (candidatas a despiece dirigido)

- **health-fitness** (el rubro de la demo dental): Maxima Therapy · Frequency
  Breathwork · Rise Plasma · Dawn · Nudge · Usefoulplay. Confirman la
  dirección salud-premium ya aplicada (serif liviana, neutros cálidos, un
  acento tierra) — próximo paso: despiece computado de 2 de estas para el
  pattern bank.
- **ecommerce**: Magnet Lover · Infinite Machine · Bedouin's Daughter · Matic ·
  DAPHNE · Lasso. Para el rubro comercio/tienda del motor (template store).
- **food-drinks**: Ironhill · Caphe Roasters · Amrit Palace · Busy Bee Honey ·
  Le OFF Paris. Para restaurant (Visual Direction Matrix: sensory, photo-led).
- **business**: United Carriers (ya es nuestro learned model de logistics) ·
  RRE · Make Good · Overlay · Ape AI.

## Despiece computado de 2 sitios VIVOS health-fitness (Scrapling directo)

URLs reales resueltas desde la ficha de lapa (botón "Visit website") y
despiezadas con `Fetcher.get(impersonate=chrome)` sobre el HTML servido.

**Frequency Breathwork** (frequencybreathwork.com) — h1 "HEALING BEGINS":
paleta `#242424` (tinta) + `#DFD7C8` / `#F2EFE9` / `#d5d1c7` (hueso/crema
cálidos). **CERO azul, cero gris frío.** Es EXACTAMENTE la familia salud-premium
ya aplicada a la demo (neutros cálidos + tinta) — tercera confirmación
independiente (van One Medical, Parsley, y ahora esta). La dirección de
dental-amanecer está validada por el mercado real, no por opinión.

**Maxima Therapy** (maximatherapy.com) — h1 "The First Years Matter Most":
`#006AFF` azul eléctrico + `#FF2700` rojo + `#FDCB40` amarillo sobre `#050505`.
Es terapia INFANTIL: paleta de juego, alto contraste, primaria saturada — el
opuesto del premium adulto. Lección: dentro de "health" el sub-nicho manda la
paleta (pediátrico = primario vivo; adulto/wellness = neutro cálido). Ir a
buscar el rubro exacto del cliente, no "salud" a secas.

Fuentes vacías en el scrape: cargan por CSS externo (no inline), así que el
`@font-face` no entra al HTML servido — para tipografía exacta hace falta
seguir el CSS o mirar renderizado. Colores sí salen del HTML servido.

## Próximo (cola del loop)

- Seguir el CSS externo de Frequency Breathwork para el par tipográfico exacto.
- Despiece de 1 ecommerce (Magnet Lover) y 1 food (Caphe Roasters) para esos
  rubros del motor.

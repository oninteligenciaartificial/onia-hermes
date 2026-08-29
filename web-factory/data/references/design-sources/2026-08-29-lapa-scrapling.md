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

## Próximo (cola del loop)

Despiece computado (tokens: tipo/color/CTA) de 2 landings health-fitness con
Scrapling `Fetcher` + parseo, para subir el patrón al pattern bank con fuente.

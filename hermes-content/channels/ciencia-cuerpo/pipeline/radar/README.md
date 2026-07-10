# Radar Máquina Humana — Fase 1 (local, cero gasto)

Worker que lee **RSS de ciencia** + un **snapshot de Higgsfield** y saca un
**shortlist puntuado** de candidatos de tema, mapeados a lo nuestro (tema →
gancho → estilo → modelo → costo estimado). Spec completa: `../../RADAR_PLAN.md`.

## Qué hace (y qué NO hace)

- **Lee** los feeds de `sources.json` (ScienceDaily Mind&Brain / Psychology,
  Neuroscience News, Health&Medicine) — todo gratis, YMYL-safe.
- **Puntúa** cada item contra los temas del canal (`score.mjs`): cuerpo + mente,
  marco "rendí mejor". Solo califican los que tocan al menos un tema.
- **Marca YMYL**: items con palabras de tratamiento/enfermedad se flaggean
  (`ymyl_sensitive`) para encuadre extra-cuidado — no se descartan, se avisan.
- **Mapea** cada candidato: tema, gancho sugerido, estilo (default *2D
  Illustrator*, el Kurzgesagt), modelos baratos (nano_banana_pro + kling3_0_turbo),
  costo estimado (~360cr del piloto).
- **Escribe** `incoming/shortlist-<fecha>.json` + imprime un digest.
- **NO** escribe `topics-backlog.json` — eso es **gate humano**.
- **NO** llama a generación paga. Cero gasto.
- **NO** decide fuente: cada item es un *lead*. `needs_source_verification: true`
  siempre — el `research-brief.json` debe encontrar el paper peer-reviewed /
  NIH / OMS antes de producir (regla YMYL dura, PLAN §4).

## Correr (local, para validar la salida)

```bash
cd hermes-content/channels/ciencia-cuerpo
npm install                 # una vez (trae rss-parser)
npm run radar               # modo fixture (offline, deterministico) — valida la salida
npm run radar:live          # lee los feeds RSS reales (necesita red)
npm test                    # corre los tests de scoring (+ los del pipeline)
```

`radar` (fixture) usa `test/sample-items.json` — sirve para validar la lógica sin
depender de la red. `radar:live` lee los feeds de verdad.

## Snapshot de Higgsfield

`higgsfield-snapshot.json` es un **cache** de presets/modelos leído vía MCP (un
script standalone no puede llamar al MCP). Se refresca a mano vía MCP (cero gasto,
es lectura). El diff entre dos snapshots detecta estilos/modelos **nuevos** — esa
es la señal "estilos + modelos" del radar.

## Límite de la Fase 1 y hand-off (regla "nada local")

Esta fase es **solo para validar la salida en local**. El **loop autónomo semanal
NO queda en la máquina de nadie**: cuando la salida convence, se hace **hand-off a
la sesión n8n/infra (carril G)** como cron en el VPS —
`tema → shortlist → digest a Telegram → gate humano`. El worker corre igual allá
(mismo `radar.mjs --live`), solo cambia quién lo dispara.

**Handoff accionable para infra: [`HANDOFF_INFRA.md`](HANDOFF_INFRA.md)** —
precondiciones VPS, comando exacto, workflow n8n (Schedule → SSH → Telegram, sin
`$env`), y por vacaciones se crea **desactivado**.

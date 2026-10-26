# Video Factory — Diseño (spec)

> Fecha: 2026-07-03 · Estado: aprobado para plan de implementación
> Extiende: `HIGGSFIELD_VIDEO_SYSTEM.md` y `HIGGSFIELD_FULL_CAPABILITIES_MAP.md`
> Molde: `web-factory/` (misma idea, output = media en vez de código web)

> **Reevaluado 2026-09-22:** este documento es una spec histórica y `video-factory/` sigue siendo
> un esqueleto sin runtime. La arquitectura vigente usa CLI + skills como motor de agentes de
> código, web manual para identidad, MCP opcional para chat y n8n como control plane. ONIA/Sergio
> ya no son lanes autónomas de gasto o publicación. Ver `HIGGSFIELD_VIDEO_SYSTEM.md` y el handoff
> `handoff/HIGGSFIELD-LUCIA-SYSTEM-2026-09-22.md`.

## 1. Objetivo

Fábrica de video para Onia: convierte un brief en una pieza lista para revisar,
usando Higgsfield como motor reemplazable. Produce en tres lanes paralelas
(Cliente / Onia / Sergio) con distinta autonomía, registra estado en el
Video Lab del brain y **nunca publica sin aprobación**.

No reinventa la generación: la versión futura envuelve **CLI + Skills oficiales de Higgsfield**
y agrega lanes, gates, data por cliente y tracking.

## 2. Decisiones ancla

| # | Decisión | Elegido | Motivo |
|---|---|---|---|
| 1 | Enfoque | Lanes paralelas (Cliente / Onia / Sergio) | Cubre ingreso (ads) y contenido propio desde el arranque |
| 2 | Arquitectura | Híbrido: `video-factory/` produce, Video Lab trackea | Una sola fuente de estado, sin duplicar tracking |
| 3 | Autonomía | Gate común | Cliente/ONIA/Sergio exigen brief, costo, identidad cuando aplique y preview |
| 4 | Motor | CLI Higgsfield + Skills oficiales | Ruta auditable para Claude Code/Codex; MCP queda opcional para chat |
| 5 | Panel | Telegram + galería Video Lab en Onia Center | Aprobación rápida + "Freepik propio" visual |

### Por qué no Freepik ni el chat del Supercomputer

- **Freepik/Magnific**: web-only, sin API pública. Solo panel manual. Rompe la
  regla "autónomo, nada local".
- **Chat del Supercomputer**: potente (Connectors/Memory/Files/Skills) pero es
  *su* UI. No operamos dentro de otra herramienta.
- **Higgsfield CLI + Skills** (`higgsfield-generate`, `higgsfield-soul-id`):
  instalable en este entorno y auditable. Es la ruta de los agentes de código;
  MCP queda como superficie opcional para agentes de chat.

## 3. Arquitectura — 3 capas

1. **Operación / aprobación** (lo que ve Sergio): Telegram (previews + botones)
   y galería Video Lab en Onia Center (`web-factory/apps/site`).
2. **Fábrica (lógica)**: `video-factory/` declarativa — formatos, lanes, data,
   radar, engine.
3. **Motor + orquestación pesada**: CLI `@higgsfield/cli` + Skills oficiales. n8n administra
   aprobación/estado; MCP puede ayudar a un agente de chat, pero no reemplaza el wrapper.

Frontera (igual que web-factory): la fábrica produce media y **escribe el job al
Video Lab del brain**; no toca CRM/finanzas, no publica.

## 4. Estructura de carpetas

```
video-factory/
├── FACTORY.md                  # frontera, cómo usar, dependencias (skills Higgsfield)
├── package.json                # deps propias: zod, commander (mundo aparte)
├── contracts/                  # validación estricta en boundaries (zod)
│   ├── intake.schema.mjs       # qué entra: negocio, oferta, lane, formato
│   ├── format.schema.mjs       # definición de un formato de pieza
│   ├── lane.schema.mjs         # config de lane + gates
│   └── job.schema.mjs          # el job que se escribe al Video Lab (provenance)
├── formats/                    # 1 JSON por pieza (validado por format.schema)
│   ├── ugc-ad.json
│   ├── product-showcase.json
│   ├── reel-onia.json
│   ├── explainer.json
│   ├── sergio-talking-head.json
│   ├── viral-preset.json
│   └── clip-from-long.json
├── lanes/
│   ├── cliente.json            # gate: brief + costo antes de generar
│   ├── onia.json               # brief + costo + identidad; no publicable
│   └── sergio.json             # brief + costo + identidad; no publicable
├── data/
│   ├── clients/                # <slug>.json (marca, oferta) — leído por referencia
│   └── intakes/                # briefs de entrada
├── engine/
│   ├── plan.mjs                # brief + formato + lane → plan + costo estimado
│   ├── generate.mjs            # futuro wrapper CLI (idempotente, no doble gasto)
│   ├── track.mjs               # ÚNICA escritura de estado → .hermes/video-lab/
│   └── higgsfield/             # adapter del motor (CLI + schema vivo + mapa modelo)
├── radar/
│   ├── snapshots/              # models_explore + presets_show fechados (JSON)
│   └── refresh.mjs             # refresca snapshot, marca novedades
├── skills/README.md            # skills Higgsfield declaradas como dependencia
├── out/                        # previews/metadata local antes de subir
└── cli.mjs                     # vf plan | generate | status | radar
```

## 5. Contratos (zod)

Validación en todo boundary (regla de coding-style: no confiar en input externo).

- **intake.schema**: `{ slug, lane, format, negocio?, oferta?, tema?, objetivo?,
  refs[]?, consent? }`. `lane` ∈ {cliente, onia, sergio}. `format` debe existir
  en `formats/`.
- **format.schema**: `{ id, engine_model, aspect_ratio, duration_s, shots[],
  hook?, negative_prompt, requires_gate, generate_audio }`.
- **lane.schema**: `{ id, gate_before_generate, require_approved_brief,
  require_cost_estimate, identity_gate, publishable }`.
- **job.schema**: espejo del job del Video Lab + provenance
  `{ id, status, format, lane, engine, model, credits_used?, source_urls[],
  soul_id?, identity_ok?, input_hash }`.

## 6. Formatos iniciales

| Formato | Modelo Higgsfield | Aspect / dur | Lane | Gate |
|---|---|---|---|---|
| `ugc-ad` | Marketing Studio (`ugc`/`ugc_how_to`, hooks/settings/avatars/products) | 9:16 · 12-15s | Cliente | brief + costo |
| `product-showcase` | Marketing Studio (`product_showcase`) o Seedance 2.0 (product refs) | 9:16/1:1 · 12-15s | Cliente | brief + costo |
| `reel-onia` | Seedance 2.0 (std 720p) o Veo 3.1 Lite | 9:16 · 5-8s | Onia | revisión |
| `explainer` | workflow `video-explainer` (narrado animado, N bloques 10s) | 9:16/16:9 | Onia | revisión |
| `sergio-talking-head` | Soul ID: `text2image_soul_v2` still → Seedance 2.0 minimal motion | 9:16 · 5s | Sergio | identidad + revisión |
| `viral-preset` | `higgsfield_preset` (image-to-video, presets trending) | 9:16 | ONIA/Sergio | revisión (+ identidad si Sergio) |
| `clip-from-long` | Personal Clipper (`clipify`, 1 YouTube → 10-20 clips) | 9:16 · subtítulos | Onia | revisión |
| `avatar-outfit` | `nano_banana` (virtual try-on / outfit edit sobre Soul ID) | 9:16 · 5s | Sergio | identidad + revisión |

`generate_audio` = false por defecto (audio via ElevenLabs/editado). Negative
prompt seguro por defecto (ver §10).

## 7. Lanes (autonomía + seguridad)

- **cliente**: `gate_before_generate: true`, `require_approved_brief: true`,
  `require_cost_estimate: true`, `identity_gate: false`, `publishable: false`
  (entregable solo con OK).
- **onia**: `gate_before_generate: true`, `require_approved_brief: true`,
  `require_cost_estimate: true`, `identity_gate: true`, `publishable: false`.
- **sergio**: `gate_before_generate: true`, `require_approved_brief: true`,
  `require_cost_estimate: true`, `identity_gate: true`, `publishable: false`.

## 8. Pipeline (reusa estados del Video Lab)

Estados existentes: `waiting_approval → approved_for_generation → generating →
generated → approved_for_publish → published`. Para Sergio se usan además
`avatar_review_pending` / `needs_revision`.

- **Cliente**: intake → plan(costo) → **gate: approved_for_generation** →
  generating → generated → **gate revisión** → entrega/approved_for_publish.
- **Onia**: intake → plan/cotización → **gate generación** → generated → **gate revisión** →
  approved_for_publish → publicación separada.
- **Sergio**: intake → plan/cotización → **gate generación + identidad** → still → motion →
  generated → **gate revisión** → approved_for_publish → publicación separada.

Publicación fuera de la fábrica: `ig-publish reel_publish` solo tras aprobación.

## 9. Motor (adapter reemplazable)

`engine/higgsfield/` implementa una interfaz estable (patrón repository, como
los adapters de onia-core):

- `mapModel(format, lane)` → modelo + params (usa la matriz de decisión de
  `HIGGSFIELD_FULL_CAPABILITIES_MAP.md` + el radar).
- `estimateCost(job)` → créditos estimados (gate cliente).
- `generate(job)` → futuro wrapper CLI con schema/costo vivos, aprobación ligada al input y
  reconciliación antes de retry. MCP puede asistir a un agente de chat, no es la ruta primaria.
- `getStatus(jobId)` → polling async (Higgsfield es asíncrono).

Si cambia el proveedor, solo se toca el adapter + `formats/`.

## 10. Radar ("mira lo trending")

`radar/snapshots/<fecha>-models.json` + `-presets.json` guardan el catálogo
(`models_explore` + `presets_show`) fechado. `refresh.mjs` lo actualiza y marca
diffs (modelos/presets nuevos). Alimenta `mapModel` y sugiere presets frescos
para `viral-preset`. Conecta con el agente `onia-creative-radar`.

Snapshot inicial (2026-07-03) ya capturado: modelos de video Cinema Studio 3.0,
Veo 3.1/Lite, Kling 3.0/Turbo, Seedance 2.0/Mini, Wan 2.6/2.7, Grok 1.5, Gemini
Omni, Minimax Hailuo 2.3, Marketing Studio, Personal Clipper; + 40+ presets
image-to-video.

## 11. Panel de operación

- **Telegram**: preview (thumbnail/URL) + botones aprobar / rehacer, por lane.
  Vía bot Hermes o n8n.
- **Onia Center** (`web-factory/apps/site`): ruta nueva "Video Lab" — galería de
  jobs con preview, estado, costo y botón aprobar. Lee el Video Lab del brain.

## 12. Seguridad (reglas duras)

- Higgsfield nunca publica. Publicación solo por `ig-publish` tras aprobación.
- No cara/voz sin consentimiento. Sergio: gate identidad obligatorio; nunca
  `identity_ok` automático. Cliente: consentimiento registrado si hay cara/voz.
- Costo estimado obligatorio antes de generar para cliente.
- Idempotencia por `input_hash`: no regenerar (ni gastar créditos) si ya existe
  job generado con el mismo input.
- Sin secretos hardcodeados: token CLI vía credencial, nunca en repo.
- Negative prompt seguro por defecto: sin logos de terceros, sin likeness de
  terceros, sin testimonios falsos, sin claims financieros engañosos, sin cara
  de Sergio sin aprobación, sin placeholder text.

## 13. Alcance MVP vs Fase 2

**MVP (estructura, sin generar todavía):**
- Scaffolding + `FACTORY.md` + `package.json`.
- `contracts/` (4 schemas zod) + tests de validación.
- `formats/` ancla: `ugc-ad`, `reel-onia`, `sergio-talking-head`.
- `lanes/` (3).
- `engine/plan.mjs` + `engine/track.mjs` + adapter `higgsfield/` (mapModel +
  estimateCost + stub de generate vía MCP).
- `radar/` con snapshot inicial 2026-07-03.

**Fase 2:**
- Formatos restantes (`explainer`, `viral-preset`, `clip-from-long`,
  `product-showcase`).
- `generate.mjs` completo con polling async + idempotencia.
- Panel: galería Video Lab en Onia Center + botones Telegram.
- n8n: recordatorios de jobs en espera, polling, botones de aprobación.
- CLI fallback para generación desatendida.

## 14. Riesgos y mitigación

| Riesgo | Mitigación |
|---|---|
| MCP solo en sesión Claude (no desatendido) | Fallback CLI `@higgsfield/cli` para n8n |
| Jobs async pueden colgar | Polling con timeout + estado `generating` visible |
| Doble gasto de créditos | Idempotencia por `input_hash` |
| Identidad de Sergio deforme | Gate humano obligatorio; still antes de animar |
| Deriva del catálogo Higgsfield | Radar versionado + adapter aislado |
| Duplicar tracking | Única escritura de estado en `engine/track.mjs` |

## 15. Acceptance checklist

- [ ] `contracts/` valida intake/format/lane/job (tests verdes).
- [ ] `formats/` ancla cargan y validan.
- [ ] `lanes/` definen gates correctos por autonomía.
- [ ] `engine/track.mjs` es la única ruta de escritura al Video Lab.
- [ ] `mapModel` resuelve modelo por formato+lane desde el radar.
- [ ] `estimateCost` disponible para gate cliente.
- [ ] Snapshot de radar 2026-07-03 guardado.
- [ ] Ningún path publica ni marca `identity_ok` automáticamente.
- [ ] Sin secretos en repo.

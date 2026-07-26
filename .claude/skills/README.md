# Skills propias de ONIA (Claude Code)

Skills de Claude Code **auto-descubribles** en este repo. Al trabajar en `onia-hermes`,
Claude Code las invoca solo cuando su `description` matchea la tarea. Arrancá siempre por
`onia-router` (índice + enrutador por carril).

| Skill | Cuándo se invoca |
|---|---|
| `onia-router` | inicio de cualquier sesión; enruta al carril y su stack |
| `onia-propuestas` | crear/cotizar/perfeccionar/enviar propuesta a cliente |
| `onia-contabilidad-bolivia` | fiscal/contable Bolivia (SIAT, IVA/IUE, RNDs) — propio + features ERP |
| `onia-core` | tocar/adoptar el núcleo (contract.json, adapters, schema) |
| `onia-web-factory` | construir/rediseñar webs (landings, panel, sitios cliente) |

## Principio
Estas skills son **punteros + reglas + cuándo-usar**. El conocimiento de detalle vive en
las fuentes de verdad (`hermes-content/skills/`, `hermes-content/docs/`, `onia-core/`,
generador de propuestas). Al cambiar una regla: **editar la fuente**, no duplicarla acá.

## Distinto de
- `.claude/agents/` — subagentes para delegar (no skills).
- `hermes-content/skills/` — docs que lee el bot Hermes en el VPS (no skills de Claude Code).

Mapa completo + spec de repos separados: `hermes-content/docs/ONIA_SKILLS_STACK_Y_SUBAGENTES_20260705.md`.

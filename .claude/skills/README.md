# Skills del repo (Claude Code)

Skills **auto-descubribles** en este repo. Arrancá siempre por `onia-router` (índice +
enrutador por carril). Actualizado 2026-09-29: quedan solo las que tuvieron uso real en los
últimos 30 días o que una skill usada exige; lo borrado y cómo recuperarlo está en
`hermes-content/docs/historial/LIMPIEZA_SKILLS_20260929.md`.

| Skill | Cuándo se invoca |
|---|---|
| `onia-router` | inicio de cualquier sesión; enruta al carril y su stack |
| `onia-continuidad` | al arrancar y cuando la sesión se hizo larga (rumbo, trabajo fantasma) |
| `onia-infra` | antes de tocar el VPS, Docker o n8n por SSH |
| `onia-core` | tocar/adoptar el núcleo (contract.json, adapters, schema) |
| `onia-chatbot` | todo trabajo sobre el chatbot (motor, conocimiento, canal, voz) |
| `onia-contabilidad-bolivia` | fiscal/contable Bolivia (SIAT, IVA/IUE, RNDs) |
| `onia-propuestas` | crear/cotizar/perfeccionar/enviar propuesta a cliente |
| `onia-web-factory` | construir/rediseñar webs (landings, panel, sitios cliente) |
| `diseno-contenido-onia` | antes de cualquier pieza visual de ONIA o de Sergio Urcullo |
| `editor-videos` | editar/cortar/subtitular video (pipeline "sin editores humanos") |
| `ver-videos` | ver, transcribir o analizar un video |
| `sacar-prompt` | sacar el prompt de una imagen o video de referencia |
| `higgsfield-generate` · `higgsfield-soul-id` | generación e identidad en Higgsfield (CLI oficial) |
| `motion-doctrine` + `cut-the-curve` `oversized-cursor` `seam-craft` `captions-overlay` | ley de movimiento de HyperFrames y sus técnicas (upstream HeyGen, no están en la copia global) |

## HyperFrames
El router `hyperframes` y sus skills (`hyperframes-core/cli/animation/…`, `media-use`,
`motion-graphics`, `talking-head-recut`, `embedded-captions`, …) viven en la copia **global**
(`~/.claude/skills`, `~/.codex/skills`), que `hyperframes init` mantiene al día. Los flujos
que no están se instalan cuando se piden: `npx hyperframes skills update <nombre>`.

## Principio
Estas skills son **punteros + reglas + cuándo-usar**. El conocimiento de detalle vive en
las fuentes de verdad (`hermes-content/skills/`, `hermes-content/docs/`, `onia-core/`,
generador de propuestas). Al cambiar una regla: **editar la fuente**, no duplicarla acá.

## Distinto de
- `.agents/skills/` — skills para Codex. Quedan `impeccable`, `embedded-captions` (gate de
  ortografía), `media-use` (librería de SFX de `editor-videos/scripts/sfx.mjs`: **no
  borrar**), `higgsfield-generate`, `higgsfield-soul-id`.
- `.claude/agents/` — subagentes para delegar (queda `onia-crm-prospeccion`).
- `hermes-content/skills/` — docs del bot Hermes. **El bot usa su propia copia en el VPS**
  (`/root/.hermes/skills/`); la del repo es la versión con historial en git.

Mapa completo: `hermes-content/docs/ONIA_SKILLS_STACK_Y_SUBAGENTES.md`.

# Skills del repo (Claude Code)

Skills **auto-descubribles** en este repo. Arrancá siempre por `onia-router` (índice +
enrutador por carril). Actualizado 2026-10-02: se restauró todo lo que borró la limpieza del
29-sep (historia en `hermes-content/docs/historial/LIMPIEZA_SKILLS_20260929.md`).

| Skill | Cuándo se invoca |
|---|---|
| `onia-router` | inicio de cualquier sesión; enruta al carril y su stack |
| `onia-continuidad` | al arrancar y cuando la sesión se hizo larga (rumbo, trabajo fantasma) |
| `onia-infra` | antes de tocar el VPS, Docker o n8n por SSH |
| `onia-hermes-jarvis` | antes de tocar a Hermes, su resumen y su cierre, la aduana de avisos, su calendario, los pedidos a Claude o el workflow hermes-jarvis |
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
El router `hyperframes` y sus skills (`hyperframes-core/cli/animation/creative/keyframes/registry`,
`media-use`, `motion-graphics`, `talking-head-recut`, `embedded-captions`, `general-video`,
`slideshow`, `remotion-to-hyperframes` y las plantillas `changelog-video`, `faceless-explainer`,
`figma`, `music-to-video`, `pr-to-video`, `product-launch-video`) **viven en este repo** desde el
22-jul; se borraron el 29-sep y se restauraron el 2026-10-02 porque con la copia global los
archivos dejaron de editarse como quiere Sergio Urcullo. **Esta copia gana** sobre la de
`~/.claude/skills` con el mismo nombre (orden de Claude Code: proyecto, después usuario).
Actualizarlas (`npx hyperframes skills update`) cambia cómo editan: solo con OK de Sergio Urcullo.

## Principio
Estas skills son **punteros + reglas + cuándo-usar**. El conocimiento de detalle vive en
las fuentes de verdad (`hermes-content/skills/`, `hermes-content/docs/`, `onia-core/`,
generador de propuestas). Al cambiar una regla: **editar la fuente**, no duplicarla acá.

## Distinto de
- `.agents/skills/` — skills para Codex (30, con la copia de HyperFrames). Entre ellas `impeccable` (lo usa el hook de
  `.codex/hooks.json`), `embedded-captions` (gate de ortografía), `media-use` (librería de SFX de
  `editor-videos/scripts/sfx.mjs`: **no borrar**), `motion-doctrine` y sus rutas,
  `higgsfield-*` y `web-factory-design-research`/`-intake-assets`.
- `.claude/agents/` — subagentes para delegar (`onia-crm-prospeccion`, `onia-core-guardian`,
  `onia-creative-radar`).
- `hermes-content/skills/` — docs del bot Hermes. **El bot usa su propia copia en el VPS**
  (`/root/.hermes/skills/`); la del repo es la versión con historial en git.

Mapa completo: `hermes-content/docs/ONIA_SKILLS_STACK_Y_SUBAGENTES.md`.

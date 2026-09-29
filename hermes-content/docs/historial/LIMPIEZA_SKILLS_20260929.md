# Limpieza de skills y agentes — 2026-09-29

> Foto de un día (historia, no fuente de verdad). Pedido de Sergio Urcullo: *"borra lo que son
> skill que no usamos… mira el último mes"* y después *"borralas las que no usemos, pero analiza
> con nuestros proyectos futuros si las usaremos"*.

## Cómo se midió
- **Ventana:** 30 días (2026-08-30 → 2026-09-29).
- **Evidencia real, no menciones:** invocación de la skill (`Skill` tool), lectura de su archivo
  o ejecución de sus scripts, sacado de ~1.490 transcripts de Claude Code (con subagentes), 23
  sesiones de Codex y 88 sesiones + crons del bot Hermes en el VPS (`/root/.hermes/`).
- **Dependencias por código:** `git grep` de rutas `.claude/skills/…` y `.agents/skills/…` en
  scripts. Así apareció `media-use` (ver abajo), que ningún transcript mostraba.
- **Sesiones vivas consultadas:** *Marca personal* avisó que `editor-videos/scripts/sfx.mjs`
  usa `.agents/skills/media-use/audio/assets/sfx` como librería de SFX por defecto; *Plataforma*
  pidió actualizar el router en el mismo commit.
- **Mirada a futuro:** etapa vigente = Onia Platform + chatbot → 5 clientes, y "congelar (no
  borrar)" lo demás (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §7). Se cruzó cada candidata con handoffs,
  `cola/` y planes de contenido.

## Borrado (63)

| Qué | Por qué | Lo reemplaza |
|---|---|---|
| `.claude/skills/`: `hyperframes`, `hyperframes-core`, `-cli`, `-animation`, `-creative`, `-keyframes`, `-registry`, `media-use`, `motion-graphics`, `talking-head-recut`, `embedded-captions`, `slideshow`, `remotion-to-hyperframes`, `general-video` (14) | Copias de julio; competían con la copia global | La copia global `~/.claude/skills` (refrescada 21-22 sep por `hyperframes init`) |
| `.agents/skills/`: las mismas 12 salvo `media-use` y `embedded-captions` | Idem, para Codex | `~/.codex/skills` (22 sep) |
| `changelog-video`, `faceless-explainer`, `figma`, `music-to-video`, `pr-to-video`, `product-launch-video` (en `.claude` y `.agents`) | 0 uso, ningún plan los nombra | Se instalan cuando se piden: `npx hyperframes skills update <nombre>` |
| `.agents/skills/`: `captions-overlay`, `motion-doctrine`, `cut-the-curve`, `oversized-cursor`, `seam-craft` | Codex nunca las abrió | La copia de `.claude/skills` (se queda) |
| `.agents/skills/web-factory-design-research`, `web-factory-intake-assets` | 0 uso desde junio; línea web congelada | `onia-web-factory` |
| `hermes-content/skills/genera-propuesta.md` | Flujo viejo; habla de "vendedor" | `propuestas-comerciales-onia` + skill `onia-propuestas` + generador oficial |
| `historias-onia.md` | 0 uso (bot incluido) | `historias-sergio` (cron del bot) |
| `videos-virales-higgsfield.md` | 0 uso | `video-lab-higgsfield` (17 sesiones del bot) |
| `orquestador-creativo-ia.md` | 0 uso | `radar-creativo-onia` + `diseno-contenido-onia` |
| `sistema-semanal-hermes.md` | 0 uso | `plan-semanal-onia` (cron activo) |
| `crons-diarios-hermes.md` | 0 uso | `brief-diario-onia` + `n8n-automatizaciones-onia` |
| `centro-comando-telegram.md` | 0 uso | Hermes Jarvis (`handoff/hermes-jarvis.md`) + `aprobaciones-onia` |
| `seguimiento-prospectos-onia.md` | 0 uso; el bot ni la tenía | Barridos de seguimiento del chatbot (n8n) + `crm-prospeccion-onia` |
| `orquestacion-proyectos-onia.md` | 0 uso; trata DentalGest/GestiOS como productos | Skill `onia-router` |
| `actas-reuniones-onia.md` | 0 uso | `inteligencia-reuniones-onia` + skill `docx` |
| `.claude/agents/_retirados/` (6 + README) | Retirados el 18-ago pero seguían apareciendo; `dentalgest-migrations` se invocó por error el 21-sep | Las skills (`onia-router`, `onia-propuestas`, `onia-web-factory`, skills de `onia-platform`) |
| `.claude/agents/onia-core-guardian.md` | Último uso 17-ago | Skill `onia-core` + `npm run validate:onia-core` |
| `.claude/agents/onia-creative-radar.md` | Último uso 22-ago | `diseno-contenido-onia` + `editor-videos` |

## Se quedaron sin uso reciente, a propósito
- `captions-overlay`, `cut-the-curve`, `oversized-cursor`, `seam-craft` (`.claude`): las exige
  `motion-doctrine`, que sí se usó (2-sep). Son upstream de HeyGen y no están en la copia global.
- `.agents/skills/media-use`: librería de SFX por defecto de `editor-videos/scripts/sfx.mjs`.
- `.agents/skills/embedded-captions`: tiene el gate de ortografía que cita `editor-videos`.
- `analiza-llamada`: su script existe (`scripts/analiza-transcripcion.js`) y las llamadas de
  venta arrancan después de publicar la 1.0 (etapa vigente).
- `audio-elevenlabs`: la usa el plan del canal ciencia-cuerpo (línea congelada, no borrada).
- `consultoria-onia`: la estrategia (etapa 2) la acepta como ingreso.
- `ugc-empresas-higgsfield`: CLAUDE.md la cita como detalle operativo.
- Agente `onia-crm-prospeccion`: la etapa vigente es vender; la auditoría de agentes lo conservó.

## Cómo recuperar algo
```bash
git checkout 9622ae6a -- <ruta>          # cualquier archivo borrado acá
npx hyperframes skills update <nombre>   # un flujo de HyperFrames
npx skills add heygen-com/hyperframes --skill <nombre>   # las internas de HeyGen
```

## Quedó pendiente (fuera de esta limpieza)
- **187 skills globales sin uso** en `~/.claude/skills` (de 215). Las ve toda sesión en todos
  los proyectos. Propuesta: moverlas a `~/.claude/skills-archivadas/` (reversible). Decide Sergio Urcullo.
- El bot conserva en `/root/.hermes/skills/` las 10 docs borradas del repo (el instalador del VPS
  solo agrega, no borra). Limpiar allá es trabajo de infra.
- `scripts/genera-propuesta.js` y `scripts/webhook-propuestas.js`: generador viejo de propuestas,
  paralelo al oficial.
- Docs narrativos que todavía citan agentes borrados (`ONIA_SYSTEM_TASKBOARD_2026.md`,
  `ONIA_CONTENT_FACTORY_ORCHESTRATION_2026.md`, `ONIA_WEB_COMO_SE_VENDE.md`,
  `VIDEO_FACTORY_DESIGN.md`) y `cola/plan-3-semanas/S3-GUIONES.md`, que cita
  `.agents/skills/hyperframes-cli/SKILL.md` (hoy en la copia global).

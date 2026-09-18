# TikToks — lote 17/18-sep (serie Claude Code)

**Salidas: `E:\ONIA-YouTube\tiktoks\`** (los largos de YouTube van en `editado\`).

| Pieza | Crudo | Dura | Tema · CTA |
|---|---|---|---|
| `tiktok-01-skills.mp4` | IMG_4573 | 55,9 s | qué es una skill · "comentá SKILL" |
| `tiktok-02-claude-md-3-reglas.mp4` | IMG_4595 | 54,5 s | CLAUDE.md, 3 reglas · "comentá COMUNIDAD" |
| `tiktok-03-como-funciona.mp4` | IMG_4572 | 37,9 s | cómo trabaja por dentro · "comentá VIDEO" |
| `tiktok-04-repo-skills-oficiales.mp4` | IMG_4607 | 50,3 s | repo anthropics/skills · link en descripción · **pantalla dividida** |

## Receta del lote (lo que hay que repetir)
1. Corte fino: silencios ≥0,4 s + muletillas por energía (tramo sonoro sin palabra del
   transcript = "ehh"/respiración; Whisper NO las transcribe).
2. Composición en UNA pasada (`tiktok-build.mjs` con `<clip>-config.json`) o
   `split-layout.mjs --split 0.45 --head-anchor center` para el formato partido.
3. Apoyos: tarjetas dark · pantallas completas con contenido REAL · **mockups**
   (`mockup-browser.html`, `mk-term.html`) · keywords grandes de lo importante ·
   **logo oficial de Claude Code en cada mención hablada**.
4. Gate de ortografía sobre `<clip>-cut-segments.json` ANTES de quemar.
5. Karaoke `--style apple` (verde de marca, sin borde) · en split: `--words-per-line 3
   --font-size 68 --margin-v 60`.
6. SFX con ducking (pop en overlays, whoosh en cambios de apoyo). **SIN MÚSICA: la pone Sergio.**
7. Master −14/−15 LUFS y QA MIRANDO frames de cada elemento.

Un subagente por pieza, pipeline completo. Los `.mp4` no se versionan; todo lo de acá
regenera cualquier clip.

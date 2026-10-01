# L08 · ¿Cuántos pacientes se olvidan de su cita? — instrucción completa (método Santiago)

Una instrucción por video, ejecutada ENTERA (skill `editor-videos`, § Auditoría punto 2). Guion:
`hermes-content/docs/cola/lucia-diario/S1-GUIONES.md` § L08. Raíz del repo: `/home/user/onia-hermes` (R).
Scripts del stack: `R/.claude/skills/editor-videos/scripts/` (ES). Carpeta de la pieza: `R/videos/lucia-l08/` (P).

## OBJETIVO
Reel 9:16 de ~10,4 s que vende el recordatorio automático por correo de Onia a dueños de clínicas:
dolor (pacientes que se olvidan) → mecanismo (correo 24 h y 2 h antes) → remate («Vos no movés un dedo.»)
mientras Lucía levanta la vista a cámara. Se entrega con tabla de cortes + preview 360p para el OK de
Sergio Urcullo. **Costo 0**: el clip y la voz ya están pagados.

## MATERIAL
- Clip: `P/raw/l08-cafe-kling-f79eb10e.mp4` — Kling 3.0, 720×1280, **24 fps**, 10,04 s, sin audio. Mira el
  celular; entre 8,8 y 9,1 s levanta la vista a cámara (8,8 tiene motion blur).
- Voz (Marcela, ajustes por defecto, `eleven_multilingual_v2`): `P/audio/voz-cuerpo.mp3` entra en **0,50 s**;
  `P/audio/voz-remate.mp3` entra en **8,70 s** (dura 1,30 s → termina 10,00).
- Transcript AUTORADO con tiempos exactos (gate de ortografía ya pasado): `P/scripts/segments.json`
  (lo genera `P/scripts/build-segments.py` desde los alineamientos de ElevenLabs).
- Plantillas: `ES/../assets/html/keyword-marca.html`, `tag-ia.html` (y `frase-card.html` si hiciera falta).
- SFX: librería de HyperFrames ya bajada (`node ES/sfx.mjs --list-lib` → 19 cues «SÍ»).

## ESTILO (Lucía)
- Lienzo **1080×1920 a 24 fps** (la fuente es 24: pasar a 30 duplica cuadros y tironea).
- Acento **#10C26B** (verde Onia: Lucía va siempre en verde). Karaoke **`--style apple`**.
- **Texto NUNCA sobre la cara.** Franja libre medida con SCRFD sobre todo el clip (coords 1080×1920):
  mentón máx 1128 → **todo texto entre y=1168 y y=1490** (debajo de 1490 lo tapa la UI de Instagram:
  pie, audio y botones). Nada en los 80 px de la derecha por debajo de y=1000 (botones).
- Sin música de cama (la pone Sergio Urcullo). Voz + SFX.

## LAYOUT y STORYBOARD (tiempos = los de `segments.json`; los pone `sync-plan.mjs`, no el ojo)
| Cuándo (cue) | Qué | Dónde (1080×1920) |
|---|---|---|
| 0,25 → fin de «cita?» (2,78) | `tag-ia` «Lucía · personaje creado con IA», ancho 520 | centrado, y=1186 |
| todo el cuerpo (0,50 → 7,93) | karaoke `--style apple --words-per-line 3 --font-size 68 --margin-v 450` | rail: texto termina en y≈1470 |
| «día» (5,26) → «y» (6,36) | keyword «1 DÍA ANTES» (keyword-marca, ancho 900) | centrado, y=1180 |
| «horas» (6,885) → 8,60 | keyword «2 HORAS ANTES» | centrado, y=1180 |
| «Vos» (8,70) → fin | keyword «NO MOVÉS UN DEDO.» (2 líneas, ancho 900) **en lugar del karaoke** | centrado, y=1176 |
| 8,60 → fin | ken `from 1.00 to 1.05`, anchor `top` (se agranda la cara mientras mira a cámara) | — |

- El remate NO lleva karaoke: la keyword grande ES el texto. Karaoke solo con el cuerpo
  (`segments-karaoke.json` = `segments.json` sin las palabras ≥ 8,70 s).
- **Captura REAL del correo de recordatorio: PENDIENTE** (la pide la madre). Cuando llegue va con
  `make-mockup --template phone --image <captura>` de «correo» (4,30) a «antes.» (7,93). Hoy NO se inventa
  ninguna pantalla ni se dibuja un correo falso.

## SFX (plan `P/scripts/sfx-plan.json`, librería por nombre de cue, ganancias en dB)
pop −12 @0,25 (rótulo) · notification −12 @4,30 duck (llega el correo) · pop −10 @5,26 · pop −10 @6,885 ·
whoosh-short −10 @8,58 (arranca el ken, sin voz encima).

## ORDEN (generaciones de video: 2 — el builder de una pasada + el karaoke)
1. **Assets** (`make-mockup.mjs --template custom … --accent "#10C26B" --out P/assets/<x>.png`).
2. **Storyboard → plan:** `P/scripts/storyboard.json` (en PALABRAS) → `node ES/sync-plan.mjs --segments
   P/scripts/segments.json --storyboard P/scripts/storyboard.json --out P/scripts/overlay-plan.json`.
   Leer la sección «SIN SINCRONIZAR»: tiene que estar vacía.
3. **gen1 en UNA pasada** — `P/scripts/build.mjs`, calcado de `R/videos/tiktok-20260917/scripts/tiktok-build.mjs`
   pero con rutas relativas a P: `scale=iw*2:ih*2` + `zoompan` (importar `zoomExpr`/`ANCHORS` de
   `ES/zoom-punch.mjs`; ventana ken del layout) a 1080×1920 24 fps + `tpad` clonando el último cuadro 0,40 s
   + overlays del `overlay-plan.json` con fade 0,22 s + la voz (dos tomas con `adelay`, `amix normalize=0`)
   → `P/renders/gen1.mp4` (libx264 CRF 14 preset slow, yuv420p, aac 48 kHz).
4. **gen2 karaoke:** `node ES/karaoke-captions.mjs --segments P/scripts/segments-karaoke.json --video
   P/renders/gen1.mp4 --out P/renders/karaoke.mp4 --style apple --words-per-line 3 --font-size 68
   --margin-v 450`. Mostrar su tabla de frases en el README. Ninguna frase puede partir en 2 líneas.
5. **SFX:** `node ES/sfx.mjs --video P/renders/karaoke.mp4 --plan P/scripts/sfx-plan.json --out P/renders/sfx.mp4`.
6. **Master:** `node ES/master.mjs --video P/renders/sfx.mp4 --out P/final/l08.mp4` (−14 LUFS / −1,5 dBTP; reporta).
7. **Copiar** a `R/hermes-content/references/modelos/lucia/v4/feed/l08-recordatorio-sin-mover-un-dedo.mp4`
   (pisa la versión PIL del 1-oct) y **preview** `P/renders/preview-360.mp4` (360×640, CRF 28, aac 96k).

## QA (antes de devolver; todo MIRADO, no supuesto)
- Hoja de cuadros `P/renders/qa-frames.jpg`: entrada, mitad y salida de cada elemento + 0,1 s y el último cuadro,
  con líneas guía en y=1168 (mentón) e y=1490 (UI de IG). Leerla con la herramienta de imágenes.
- Ortografía de TODO texto quemado, leída en los cuadros (ñ, tildes: CUÁNTOS, DÍA, MOVÉS).
- Identidad: `python3 R/scripts/face_identity_qa.py <manifest>` con 5 cuadros del final contra las refs de
  `/tmp/claude-0/-home-user-onia-hermes/59ef38f5-141c-5055-9631-e06d8af00fa0/scratchpad/l08/qa/refs/` (R1…R8 y N1…N3) → cada cuadro ≥ 0,70.
- Audio: `ffmpeg -af ebur128` del final → I = −14 ± 0,5 LUFS, pico ≤ −1,5 dBTP. Transcribir el final con
  faster-whisper `large-v3` (`language="es"`): tiene que decir el guion y el remate SIN signos de pregunta.
- Specs: 1080×1920, 24 fps, h264 yuv420p, aac, `+faststart`, ~10,44 s.

## SALIDA (README de la pieza: `P/README.md`)
Tabla de cortes (`# | Me quedo con | Tiro | Por qué`), storyboard con los tiempos reales, comandos para
regenerar, números del QA y lo pendiente (captura real). **Sin comandos git**: commitea el orquestador.

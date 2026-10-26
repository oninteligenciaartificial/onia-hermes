# L08 · ¿Cuántos pacientes se olvidan de su cita? — instrucción completa (v2, método Santiago medido)

Una instrucción por video, ejecutada ENTERA. **Receta y reglas: `.claude/skills/editor-videos/SKILL.md` § «Reels de Lucía»**
(leerla primero). Guion: `hermes-content/docs/historial/cola/lucia-diario/S1-GUIONES.md` § L08. Por qué así:
`hermes-content/references/video-intake/2026-10-01-santiago-erik-edicion-medida.md`.
R = `/home/user/onia-hermes` · ES = `R/.claude/skills/editor-videos/scripts/` · P = `R/videos/lucia-l08/`.

## OBJETIVO
Reel 9:16 de ~10,2 s que vende el recordatorio automático por correo a dueños de clínicas: dolor → mecanismo (panel
con el dato que la voz no dice: el paciente confirma o cancela desde el mismo correo) → remate «Vos no movés un dedo.»
mientras Lucía mira a cámara. Tabla de cortes + preview 360p para el OK de Sergio Urcullo. **Costo 0.**

## MATERIAL
- Clip limpio `P/raw/l08-cafe-kling-f79eb10e.mp4` (Kling, 720×1280, 24 fps, 10,04 s, sin audio). **Se recorta 0,40 s al
  inicio** (`trim=start=0.40`): mismo gesto con el celular. Después del recorte dura 9,64 s; levanta la vista a ~8,4 s.
- Voz (Marcela, ajustes de la voz): `P/audio/voz-cuerpo.mp3` entra en **0,10 s** (termina 7,53); `P/audio/voz-remate.mp3`
  en **8,30 s** (termina 9,60). Tiempos por palabra YA en la línea recortada: `P/scripts/segments.json` (todo) y
  `P/scripts/segments-karaoke.json` (solo hasta 3,75 s). Cues: correo 3,896 · día 4,86 · horas 6,485 · antes. 6,764 ·
  Vos 8,30 · dedo. 9,066.
- Plantillas `ES/../assets/html/` (`tag-ia`, `keyword-marca`, `frase-card`) y librería SFX de HyperFrames (`sfx.mjs --list-lib`).

## ESTILO
1080×1920 a 24 fps · acento #10C26B · franja libre **y=1168–1490** (mentón máx 1128) · texto nunca sobre la cara.
Velo oscuro (degradé vertical negro, alfa 0 en y=1060 → 0,55 en y=1320 → 0,6 abajo) todo el video: el blazer es crema
y el texto blanco no se lee sin él. Sin música.

## LAYOUT y STORYBOARD (tiempos en la línea recortada)
| Tiempo | Qué | Dónde |
|---|---|---|
| 0,00 → 2,40 | `tag-ia` «Lucía · personaje creado con IA» (ancho 520) | centrado, y=1186 |
| 0,10 → 3,75 | karaoke `segments-karaoke.json`, `--style apple --words-per-line 3 --font-size 68 --margin-v 450` | texto termina en y≈1470 |
| 3,75 → 7,75 | **panel-diagrama** (ancho 900, alto ≤ 290, tarjeta dark con riel verde): cejilla «RECORDATORIO AUTOMÁTICO · POR CORREO» | centrado, y=1180 |
| 4,71 (día −0,15) | fila 1 del panel: «−24 h» grande en verde + «correo al paciente» | dentro del panel |
| 6,335 (horas −0,15) | fila 2: «−2 h» + «otro correo» | dentro del panel |
| 6,61 (antes. −0,15) | fila 3: chips «✓ Confirmar» y «✕ Cancelar» + «desde el mismo correo» (dato de ADQUISICION §5.4 que la voz no dice) | dentro del panel |
| 8,15 → fin | sello «NO MOVÉS UN DEDO.» (`keyword-marca`, ancho 900, rotado −4°) **sin karaoke** | centrado, y=1176 |
| 8,15 (5 cuadros) | golpe de zoom +3 % que vuelve (sobre el b-roll, no sobre el texto) | — |
| 8,15 → fin | ken 1,00 → 1,04, anchor `top` | — |
| 9,64 → 10,24 | `tpad` clonando el último cuadro 0,60 s (ella mirando a cámara) | — |

- El panel es un **diagrama** (no imita la pantalla de un correo ni lleva crédito de «pantalla real»). Puede hacerse como
  composición HyperFrames con las filas entrando escalonadas, o como 4 PNG de estado (`make-mockup --template custom`)
  cruzados con fundido de 0,12 s. Lo que sea más robusto en la nube; probar uno y mirarlo.
- **Captura REAL pendiente:** cuando exista la cuenta demo, la captura del correo (asunto + botones) reemplaza las filas.

## SFX (≤ 4, con causa visible, ~10 dB bajo el pico de la voz — medir con `astats`)
pop @3,75 (entra el panel) · ping @4,91 y @6,535 (0,2 s después de cada fila) · pop @8,15 (sello). Ganancias de
partida −12 dB; ajustar midiendo.

## ORDEN (2 generaciones)
1. Assets (y panel). 2. `P/scripts/build.mjs`, calcado de `R/videos/tiktok-20260917/scripts/tiktok-build.mjs` con rutas
relativas: trim 0,40 + `scale=iw*2:ih*2` + `zoompan` (importar `zoomExpr`/`ANCHORS` de `ES/zoom-punch.mjs`: golpe + ken) a
1080×1920 24 fps + `tpad` 0,60 + velo + overlays con fade 0,15 in / 0,22 out + voz (2 tomas, `adelay`, `amix normalize=0`)
→ `P/renders/gen1.mp4` (CRF 14 slow, bt709). 3. Karaoke `node ES/karaoke-captions.mjs --segments P/scripts/segments-karaoke.json
--video P/renders/gen1.mp4 --out P/renders/karaoke.mp4 --style apple --words-per-line 3 --font-size 68 --margin-v 450 --crf 14
--preset slow` (ninguna frase en 2 líneas). 4. `sfx.mjs` → `P/renders/sfx.mp4`. 5. `master.mjs` → `P/final/l08.mp4`.
6. Copiar a `R/hermes-content/references/modelos/lucia/v4/feed/l08-recordatorio-sin-mover-un-dedo.mp4` + preview
`P/renders/preview-360.mp4` (360×640, CRF 28).

## QA (§12 de la receta; todo MIRADO)
Stills de cada entrada ANTES del render completo · `P/renders/qa-frames.jpg` con guías en y=1168 y y=1490 · YuNet/SCRFD sobre
crudo y final (misma cantidad de caras; caja del mentón + 40 px fuera de toda caja de texto) · ortografía leída en cuadros
(CUÁNTOS, MOVÉS, −24 h) · identidad ≥ 0,70 en 5 cuadros (refs: `/tmp/claude-0/-home-user-onia-hermes/59ef38f5-141c-5055-9631-e06d8af00fa0/scratchpad/l08/qa/refs/`)
· recorte 1:1 de la cara en el zoom máximo · −14 ± 0,5 LUFS, pico ≤ −1,5 dBTP · faster-whisper `large-v3`: el remate SIN
signos de pregunta · specs (1080×1920, 24 fps, h264 yuv420p, aac, +faststart).

## SALIDA
`P/README.md`: tabla de cortes (`# | Me quedo con | Tiro | Por qué`), storyboard con tiempos reales, comandos, números del QA,
pendientes (captura real; CTA en pantalla cuando la bio tenga el link). **Sin comandos git.**

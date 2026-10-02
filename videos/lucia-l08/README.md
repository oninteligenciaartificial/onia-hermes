# L08 · ¿Cuántos pacientes se olvidan de su cita?

Reel 9:16 de Lucía (b-roll Kling + voz de Marcela) que vende el recordatorio automático por correo. Se editó con la
skill `editor-videos` (§ «Reels de Lucía») siguiendo la instrucción de [`INSTRUCCION.md`](INSTRUCCION.md). **Costo: 0**
(no se generó nada pago; la voz y el clip ya estaban).

**Estado: pendiente del OK de Sergio Urcullo** sobre la tabla de cortes y el preview 360p. No se publica nada.

| Qué | Dónde |
|---|---|
| Final (1080×1920, 24 fps, 231 cuadros = 9,625 s) | `final/l08.mp4` (ignorado en git) |
| Copia para el feed | `hermes-content/references/modelos/lucia/v4/feed/l08-recordatorio-sin-mover-un-dedo.mp4` (mismo md5 `a9e7d4ca…`) |
| Preview 360p (360×640, CRF 28) | `renders/preview-360.mp4` |
| Hoja de cuadros con guías (y=1168 cian, y=1490 rojo, 80 px derecha magenta) | `renders/qa-frames.jpg` |

## Correcciones del 2-oct (verificación) — aplicadas y re-medidas

| # | Problema | Arreglo | Medido en el final nuevo |
|---|---|---|---|
| 1 | La fila 3 («✓ Confirmar · ✕ Cancelar · desde el mismo correo», 6 palabras sin voz) estaba al 100 % solo 0,79 s y era el texto más chico del panel (chips de 27 px). Después quedaban 0,44 s vacíos. | Panel y filas cierran en **8,10 s** (holds 4,354 / 3,39 / 1,765 / 1,486). Fila 3 = **solo los dos chips «✓ Confirma» y «✕ Cancela»** (2 palabras), a 38u = **34 px** de cuerpo (antes 27). «desde el mismo correo» se sacó: la cejilla ya dice POR CORREO. | Fila 3 al 100 %: **f162–f188 = 1,125 s** (antes 0,79); ≥ 50 %: f161–f190 = 1,25 s. Píldora de 58 px de alto, letras de 24 px medidas en píxeles; en el preview 360p, 8 px de letra y se leen (`renders/qa2/prev-180-panel-x3.png`). Hueco sin apoyos antes del sello: f194–f195, con f193 casi vacío (~0,1 s; antes 0,44 s). |
| 2 | El final se congelaba 15 cuadros (tpad) en medio de un movimiento rápido: se veía un cuadro trabado en el remate. | `TPAD_FRAMES = 0`: termina en el último cuadro del clip (f230). | Diferencia media entre cuadros arriba del texto en f215–f230: **5,7–17,6** (antes caía a 0,5–1,4 desde f231). Ningún cuadro quieto. Caja SCRFD sigue creciendo 6–17 px y corriéndose ~15 px por cuadro hasta el último cuadro. La voz se oye hasta **9,24 s** (RMS > −38 dBFS) → 0,39 s de aire hasta 9,625. |
| 3 | Los pings sonaban **323 ms tarde** (ping.mp3 trae 0,323 s de silencio antes del golpe; pop 0,116 s) y el ducking bajaba la voz donde no sonaba nada. | Efectos recortados (`assets/sfx/ping-l08.wav` desde 0,31 s, `pop-l08.wav` desde 0,10 s; en `render.sh`) y el plan apunta al golpe: pop @3,75 y @8,167 (cuadro 196 del sello), ping @4,91 y @6,535. | Golpes: **3,767 / 4,923 / 6,548 / 8,184 s** = +17,1 / +12,8 / +12,8 / +17,1 ms del plan (todos dentro de ±20 ms). La correlación contra el final da 0 ms de desfase. Ganancia de la voz en el golpe: **−2,9 a −3,1 dB** (el ducking ahora cubre el golpe). En el final con pasaaltos 1,8 kHz los pings saltan de −34,5 a −7,4 dBFS en 4,92 s y de −17,4 a −6,3 dBFS en 6,545 s. |

Re-render completo (gen1 → karaoke → SFX → master → feed → preview): lo quemado no se parcheó.

## Tabla de cortes

| # | Me quedo con | Tiro | Por qué |
|---|---|---|---|
| 1 | Clip Kling desde el cuadro 10 (0,417 s) hasta el final (cuadro 240, 10,000 s): 231 cuadros | Cuadros 0–9 del clip (0,000–0,375 s) | Es el mismo gesto con el celular que sigue después: arranque en caliente, el rótulo IA está en el cuadro 0 y la primera palabra a 0,10 s. `trim=start=0.40` cae en el cuadro 10 porque 0,40 s no es múltiplo de 1/24. |
| 2 | Nada se agrega al final: el video termina en el último cuadro del clip (f230, ella mirando a cámara) | Los 15 cuadros clonados (tpad) de la versión anterior | Clonar congelaba a la persona en medio de un acercamiento rápido (receta §7: a la persona no se la congela). El aire después de «dedo.» sale del propio clip: 0,39 s. |
| 3 | `audio/voz-cuerpo.mp3` entera (7,47 s), entra a 0,10 s | — | Toma única del cuerpo. |
| 4 | `audio/voz-remate.mp3` entera (1,30 s), entra a 8,30 s, a −3,3 dB | La toma anterior del remate (de la generación de voz, no de esta edición) | Esta baja al final: F0 de «dedo» 195,8 → 181,2 Hz (pendiente −149 Hz/s, `librosa.pyin`). Los −3,3 dB igualan su sonoridad con el cuerpo (−20,3 vs −23,6 LUFS medidos con `ebur128`): sin eso se oye el empalme entre tomas. |
| 5 | Karaoke hasta 3,75 s | Los últimos 0,30 s de «LES MANDA» (3,75 → 4,05 s) | `karaoke-captions.mjs` le suma 0,30 s de cola a la última frase y quedaba encima del panel; la receta apaga el karaoke mientras hay un panel de datos. |
| 6 | Los SFX de la librería desde el golpe (ping desde 0,31 s, pop desde 0,10 s) | El silencio inicial de cada archivo (0,31 / 0,10 s) | `sfx.mjs` pone el ARRANQUE del archivo en «at»: con el silencio adentro el golpe caía 323 ms (ping) y 116 ms (pop) tarde. |

## Storyboard con los tiempos REALES del render (24 fps, medidos en el final)

| Tiempo (cuadro) | Qué | Dónde (lienzo 1080×1920) |
|---|---|---|
| 0,000 → 2,375 (0–57) | Rótulo «Lucía · personaje creado con IA», visible desde el cuadro 0; sale con fundido de 2,18 a 2,40 | Pastilla de 520 px centrada, y=1186–1256 |
| 0,125 → 3,708 (3–89) | Karaoke apple, 68 px, ≤ 3 palabras: «¿CUÁNTOS PACIENTES» 0,10–1,22 · «SE OLVIDAN DE» 1,22–1,75 · «SU CITA?» 1,75–2,68 · «EL SISTEMA» 2,70–3,32 · «LES MANDA» 3,32–3,75 | Texto medido y=1416–1459, x=325–754 |
| 3,750 → 8,042 (90–192) | Panel-diagrama: cejilla «RECORDATORIO AUTOMÁTICO · POR CORREO» («correo» − 0,15 = 3,746). Entra con fundido de 0,15 s y sube 8 px; al 100 % hasta f188 (7,833); sale f189–f192 (80 → 60 → 40 → 20 %); en f193 queda un residuo (opacidad medida 0,00; 2.681 píxeles todavía distintos de la referencia), f194 limpio | Tarjeta de 900 × 288 px, y=1194–1482, x=90–990 |
| 4,750 (114) | Fila «−24 h · correo al paciente» («día» − 0,15 = 4,71) | Dentro del panel |
| 6,375 (153) | Fila «−2 h · otro correo» («horas» − 0,15 = 6,335) | Dentro del panel |
| 6,625 (159) → 7,833 (188) | Fila «✓ Confirma · ✕ Cancela» («antes.» − 0,15 = 6,614): el dato que la voz no dice. 5 % en f159, 45 % f160, 75 % f161, **100 % f162–f188** | Chips y=1394–1452, x≈147–586 |
| 8,083 → 8,125 (194–195) | Nada en pantalla (f193 casi vacío): ~0,1 s quieto antes del remate | — |
| 8,167 (196–199) → 9,583 (230) | Sello «NO MOVÉS UN DEDO.» rotado −4°: 130 % → 120 % → 110 % → 100 % en 3 cuadros, sin karaoke, hasta el final | Al 100 %: texto x=91–991, y=1229–1395 |
| 8,167 → 8,333 (196–200) | Golpe de zoom ×1,03 sobre el b-roll (5 cuadros) y vuelve | Anchor `top` |
| 8,375 → 9,583 (201–230) | Ken 1,00 → 1,04 sobre el b-roll | Anchor `top` |
| Audio | Voz cuerpo 0,10–7,57 · remate 8,30–9,60 (audible hasta 9,24) · golpes: pop 3,767 · ping 4,923 · ping 6,548 · pop 8,184 | Sin música (la pone Sergio Urcullo) |

Todo el video lleva el velo oscuro (alfa 0 en y=1060 → 0,55 en 1320 → 0,6 abajo) debajo del texto.

## Decisiones que se apartan de la instrucción (y por qué)

1. **Panel en y=1194, no 1180.** YuNet (su caja incluye el cuello) dio el mentón hasta y=1151 → mentón + 40 = 1191 > 1180.
   Con 1192 pasaba por 0,1 px en la versión anterior y en el re-render del 2-oct quedó −0,7 px (cuadro 133); se bajó
   2 px más y la subida de entrada pasó de 10 a 8 px, así el primer cuadro (alfa 3 %) no pasa de 1490. Abajo queda en
   1482. Solo la sombra difusa de la tarjeta cruza 1490 (no hay texto ahí).
2. **Fila 3 = «✓ Confirma» y «✕ Cancela», sin «desde el mismo correo»** (corrección 1 del 2-oct, con las palabras tal
   como las escribió la verificación). En tercera persona se leen como lo que hace el paciente, en serie con «correo
   al paciente» y «otro correo». Si Sergio Urcullo prefiere las etiquetas de botón «Confirmar / Cancelar», es una palabra
   en `assets/html/panel-recordatorio.html` y `bash scripts/render.sh`.
3. **Panel hasta 8,10 s** (la instrucción decía 7,75): la fila 3 necesita ~1 s al 100 % para 2 palabras sin voz
   (0,35 s/palabra + 0,3 s de entrada) y entra a 6,614. El fundido de salida medido va de f189 a f192, antes del sello.
4. **Sin tpad** (la instrucción pedía 0,60 s clonados): ver corrección 2. Total 231 cuadros = 9,625 s (la instrucción
   decía ~10,2). El ken 1,00 → 1,04 corre en 1,25 s (f201–f230) en vez de 1,875 s; sigue ≤ 1,04.
5. **Karaoke con `--max-dur 0.55` y recortado a 3,746 s** (`scripts/karaoke.mjs`, que envuelve al script de la skill
   sin tocarlo). Con el agrupado por defecto salía «CITA? EL SISTEMA», una línea que cruzaba la pregunta y la oración
   siguiente, y la última frase seguía 0,30 s encima del panel.
6. **Sello en UNA línea de 900 px** (`assets/html/sello-dedo.html`, copia de `keyword-marca` con la rotación en un hijo).
   Con `keyword-marca` a 900 px la frase se partía en dos líneas y la raya quedaba más ancha que el texto. La posición
   y=1176 es el borde del PNG; el texto visible empieza en 1229 y no toca el mentón + 40 (margen SCRFD 39,7 px).
7. **El sello del golpe sale de la zona segura 3 cuadros**: al 130 / 120 / 110 % (f196–f198) llega a los bordes y entra
   en los 80 px de la derecha. Es la cuenta de la instrucción (900 px × 130 %); dura 0,125 s y es el efecto de golpe.
8. **Rótulo IA sin fundido de entrada:** está desde el cuadro 0, como dice el guion.
9. **El ken arranca en el cuadro 201, después del golpe**, y no en 8,15: `zoomExpr` no admite ventanas que se pisen.
10. **Ventanas de zoom en medios cuadros:** `zoomExpr` redondea a 3 decimales y dejaba afuera el cuadro 196 (pts 8,16667)
    y el 200. Con ±0,5 cuadro el golpe cubre exactamente los cuadros 196–200.
11. **Remate a −3,3 dB** para igualarlo con el cuerpo (tabla de cortes #4).
12. **SFX con ducking de −3 dB durante 0,3 s** en vez del default (−5 dB durante todo el efecto): los pings caen sobre
    «día antes» y «horas antes». Ganancias: pop −17, ping −15,5 → cada pico 9,9–10,1 dB bajo el pico de la voz.
13. **SFX recortados como archivos locales** (`assets/sfx/*-l08.wav`, ignorados en git: son derivados de la librería de
    HyperFrames, que tampoco está versionada; los regenera `render.sh`). No se tocó `sfx.mjs` (fuera de esta pieza).
14. **Master a −1,8 dBTP** en vez de −1,5: con −1,5 el AAC dejaba el pico en −1,46. Después del master se corta a
    9,625 s copiando (`-c copy -t`): el audio queda en 450 paquetes AAC (decodifica 9,579 s); los 46 ms del final son
    silencio (la voz terminó en 9,24 s).
15. **Cejilla del panel a 29u** (26 px en pantalla) en vez de 25u: a 22 px no se leía en el teléfono.
16. **4 SFX en 4,4 s:** la receta dice «≤ 1 SFX cada 2,5 s». Se respetan los 4 que lista la instrucción (densidad sobre
    la pieza: 1 cada 2,4 s). Si se lee como separación mínima, sobra un ping: preguntarle a Sergio Urcullo con el preview.

## Cómo se regenera

```bash
bash videos/lucia-l08/scripts/render.sh       # pipeline completo, de los assets al feed y el preview (~70 s)
```

Paso a paso (desde `videos/lucia-l08/`, ES = `../../.claude/skills/editor-videos/scripts`, LIB = `../../.agents/skills/media-use/audio/assets/sfx`):

```bash
node $ES/make-mockup.mjs --template custom --html-file assets/html/tag-ia.html --title "Lucía · personaje creado con IA" --accent "#10C26B" --width 1000 --out assets/tag-ia.png
node $ES/make-mockup.mjs --template custom --html-file assets/html/panel-recordatorio.html --value "base"    --accent "#10C26B" --width 1000 --out assets/panel-base.png
node $ES/make-mockup.mjs --template custom --html-file assets/html/panel-recordatorio.html --value "solo r1" --accent "#10C26B" --width 1000 --out assets/panel-r1.png   # ídem r2, r3
node $ES/make-mockup.mjs --template custom --html-file assets/html/sello-dedo.html --title "NO MOVÉS UN DEDO." --accent "#10C26B" --width 1000 --out assets/sello-dedo.png
python3 scripts/make-velo.py
mkdir -p assets/sfx
ffmpeg -y -i $LIB/ping.mp3 -af "atrim=start=0.31,asetpts=PTS-STARTPTS" assets/sfx/ping-l08.wav
ffmpeg -y -i $LIB/pop.mp3  -af "atrim=start=0.10,asetpts=PTS-STARTPTS" assets/sfx/pop-l08.wav
node $ES/sync-plan.mjs --segments scripts/segments.json --storyboard scripts/storyboard.json --lead -0.15 --fade 0.15 --duration 9.625 --out scripts/sync-plan.json
node scripts/build.mjs                  # gen1: trim + zoompan + velo + apoyos + voz → renders/gen1.mp4 (CRF 14 slow, bt709)
node scripts/karaoke.mjs                # gen2: karaoke apple → renders/karaoke.mp4 (CRF 14 slow)
node $ES/sfx.mjs --video renders/karaoke.mp4 --plan scripts/sfx-plan.json --out renders/sfx.mp4
node $ES/master.mjs --video renders/sfx.mp4 --out renders/master-l08.mp4 --tp -1.8
ffmpeg -y -i renders/master-l08.mp4 -map 0 -c copy -t 9.625 -movflags +faststart final/l08.mp4
```

Borrador rápido antes del render bueno: `node scripts/build.mjs --draft && node scripts/karaoke.mjs --draft`.

QA:

```bash
node scripts/build.mjs --clean          # referencia sin apoyos (b-roll + zoom + velo) → renders/qa/clean.mp4
python3 scripts/medir-caras.py --video raw/l08-cafe-kling-f79eb10e.mp4 --skip-frames 10 --out renders/qa/caras-crudo.json
python3 scripts/medir-caras.py --video final/l08.mp4 --detect-w 720 --out renders/qa/caras-final.json
python3 scripts/qa-menton-texto.py
python3 scripts/qa-correcciones.py      # opacidad de la fila 3 cuadro a cuadro, final sin congelado → renders/qa/correcciones.json
ffmpeg -y -i renders/qa/clean.mp4 -an -c:v copy renders/qa/mudo.mp4
node $ES/sfx.mjs --video renders/qa/mudo.mp4 --plan scripts/sfx-plan.json --out renders/qa/sfx-solo.mp4
python3 scripts/qa-sfx.py               # golpe de cada efecto contra el plan y dB bajo la voz → renders/qa/sfx-qa.json
python3 scripts/hoja-cuadros.py --video final/l08.mp4 --out renders/qa-frames.jpg --t 0,0.125,1.25,1.792,2.292,2.75,3.708,3.792,4.25,4.792,5.542,6.417,6.75,7.0,7.5,7.833,7.917,8.042,8.125,8.167,8.208,8.333,9.0,9.583 --cols 6 --w 300 --full-dir renders/qa/stills-final
python3 ../../scripts/face_identity_qa.py renders/qa/identidad/manifest.json > renders/qa/identidad/resultado.json
```

## QA (medido sobre `final/l08.mp4`, md5 `a9e7d4caaf0b177a10491d3cf3391e76`)

| Control | Resultado |
|---|---|
| Specs | 1080×1920 · 24 fps · 231 cuadros · 9,625 s · h264 High yuv420p · bt709 (matriz, primarios y transferencia) · aac LC 48 kHz estéreo 180 kbps · `+faststart` (moov antes de mdat) · 12,7 MB (~10,4 Mbps de video) |
| Sonoridad | **−14,1 LUFS** integrado (`ebur128`; `loudnorm` mide −14,39) · pico real **−1,80 dBTP** · LRA 4,0 LU |
| SFX contra la voz (antes del master) | Pico de la voz −10,09 dBFS; picos de los SFX −20,18 / −20,02 / −19,98 / −20,11 → entre 9,9 y 10,1 dB debajo |
| Golpe de los SFX | 3,767 / 4,923 / 6,548 / 8,184 s contra el plan 3,75 / 4,91 / 6,535 / 8,167 → +17 / +13 / +13 / +17 ms (≤ ±20 ms). Voz a −3 dB en el golpe |
| Fila 3 | 100 % en f162–f188 (1,125 s) · ≥ 50 % en f161–f190 (1,25 s) · 34 px de cuerpo |
| Final | Sin cuadros quietos: diferencia media entre cuadros 5,7–17,6 en f215–f230 |
| Caras, crudo recortado (231 cuadros) | SCRFD 231/231 con 1 cara · YuNet 231/231 con 1 cara · mentón máx SCRFD 1127,5 (9,58 s), YuNet 1148,4 (8,08 s) |
| Caras, final (231 cuadros, detectadas a 720 de ancho) | SCRFD 231/231 con 1 cara · YuNet 231/231 con 1 cara · mentón máx SCRFD 1149,3 (9,58 s, con ken), YuNet 1147,5 (8,21 s, golpe) |
| Mentón + 40 fuera del texto | **0 cuadros con choque.** Margen mínimo: SCRFD 39,7 px (cuadro 230, sello); YuNet 6,7 px (cuadro 190, panel) |
| Texto dentro de la franja 1168–1490 y fuera de los 80 px de la derecha bajo y=1000 | Medido como final − clean: rótulo 1186–1256 · karaoke 1416–1459 · panel 1194–1482 (x 90–989; su sombra difusa pasa de 1490 en ≤ 20 px por cuadro) · sello al 100 % 1229–1395 (x 91–991) · nada sobre 1168. Única excepción: el sello al 130–110 % en f196–f198 (decisión 7) |
| Ortografía leída en los cuadros (`renders/qa2/ortografia.png`) | «Lucía», «¿CUÁNTOS», «AUTOMÁTICO», «−24 h», «−2 h», «Confirma», «Cancela», «MOVÉS»: correctas. Texto quemado sacado del guion autorado (no de Whisper) |
| Identidad (ArcFace contra el centroide R1–R8) | 0,790 (0,5 s) · 0,760 (3,0 s) · 0,753 (5,5 s) · 0,753 (8,0 s) · 0,778 (9,58 s, zoom máximo) → todos ≥ 0,70. Refs entre sí: 0,698 como mínimo (leave-one-out); negativos: 0,224 como máximo |
| Recorte 1:1 de la cara con el zoom máximo | `renders/qa/cara-1a1-zoom-max-f230.png` (cuadro 230, ×1,04): blando por la fuente de 720p (×1,56), sin bloques ni halos |
| faster-whisper large-v3 | «¿Cuántos pacientes se olvidan de su cita? / El sistema les manda un correo un día antes y otro dos horas antes. / Vos no mueves un dedo.» → **el remate sale sin signos de pregunta** (Whisper escribe «mueves» siempre; el voseo se oye) |
| Arranque | Rótulo IA en el cuadro 0, primera palabra del karaoke en el cuadro 3 (0,125 s) |
| Stills antes del render bueno | `renders/qa2/stills-draft-a.jpg` y `-b.jpg` (borrador ultrafast de cada entrada: rótulo, karaoke, panel, filas, salida, sello, final) y `renders/qa2/panel-compuesto.png` (las 4 capas del panel) |

## Pendiente

- **El OK de Sergio Urcullo** sobre esta tabla y `renders/preview-360.mp4` antes de publicar.
- **Captura REAL del correo** (asunto + botones Confirmar/Cancelar): cuando exista la cuenta demo, reemplaza las filas
  del panel con el crédito «pantalla real de Onia». Hoy el panel es un diagrama del mecanismo, no una pantalla.
- **CTA en pantalla** cuando la bio tenga el link (`https://onia.com.bo/?utm_source=instagram&utm_medium=organico&utm_campaign=lucia-l08`).
- **Decidir sobre los 4 SFX** si «≤ 1 cada 2,5 s» es separación mínima (decisión 16).
- **Para la skill (no se tocó desde esta pieza):** el `manifest.json` de la librería de SFX no trae el onset de cada
  efecto (pop 0,116 s, ping 0,323 s, medidos acá). Conviene agregarlo y que `sfx.mjs` lo descuente, así «at» es el golpe
  en todas las piezas.

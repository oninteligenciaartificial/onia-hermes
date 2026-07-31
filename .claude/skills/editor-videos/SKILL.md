---
name: editor-videos
description: >
  Use when editing, cutting, or producing a talking-head / vertical (TikTok, Reels, Shorts) or
  landscape video: removing long silences, filler words ("eh", "este", "o sea") and retakes;
  adding burned karaoke subtitles; graphic overlays / lower-thirds; SFX and music with ducking;
  transitions between cuts or clips; blurring / censoring faces to protect third parties'
  identity; b-roll, images or mockups; or turning raw footage into a finished clip. The ONIA
  "sin editores humanos" pipeline (método Santiago). Trigger: "editá este video", "cortá los
  silencios", "ponle subtítulos", "hacelo para TikTok", "ponele efectos de sonido",
  "censurá/difuminá las caras", "ponele transiciones".
---

# Editor de Videos ONIA — edición 100% con código, sin editores humanos

## Overview
ONIA edita video con código (método del tutorial de Santiago): grabás crudo → Claude lo deja
finalizado. Esta skill **orquesta**, no reinventa el motor:

1. **Cortar** silencios / muletillas / trabadas — **pieza propia de ONIA** (`scripts/cut-plan.mjs` + ffmpeg). HyperFrames NO corta (el clip "plays untouched").
2. **Subtítulos** karaoke → delega en `embedded-captions` (matte de la persona, word-level).
3. **Overlays / gráficos** (lower-thirds, callouts, mockups) → delega en `talking-head-recut`.
4. **SFX + música** → librería de HyperFrames (`heygen-com/hyperframes`, ~85 eventos: whoosh, typing, keypress, pop, swish-pop en el CTA).
5. **Complementos** (imágenes, mockups, b-roll) → `image-gen` MCP / modelo barato; Higgsfield solo con OK.
6. **Sincronía palabra → elemento** (`scripts/sync-plan.mjs`) y **zooms** (`scripts/zoom-punch.mjs`) — piezas propias.

## 🎯 Lo que hace que el motion no parezca pegado a ojo
> *"A transcrição marca o tempo de cada palavra e cada palavra dispara um elemento em cena.
> É por isso que o motion parece grudado na voz — porque está, literalmente."*
> — @human___academy (reel `DbTxeqsBWST`, 2026-07-27), el método Claude Code + Remotion.

Ese es el eje: **la narración es la timeline**. No se eligen tiempos a mano; se escribe el
storyboard en palabras ("cuando diga X entra la tarjeta") y `sync-plan.mjs` le pone el
timestamp real del transcript word-level. Corolario del mismo reel, que ya cumplimos:
**la tipografía y los marcos se dibujan en código, no se generan con IA** ("IA erra letra,
código não") — para eso están `make-mockup.mjs` (PNG) y `scripts/remotion` / `scripts/hyperframes`
(animados).

## ⭐ REGLA DE ORO (de Santiago) — nunca cortar a ciegas
**La tabla de cortes + un preview 360p SIEMPRE se muestran a Sergio ANTES de aplicar el corte.**
Formato de la tabla: `# | Me quedo con | Tiro | Por qué`. Se aplica el corte recién con su OK.
Operativamente: el pipeline **publica el corte como review PENDIENTE** en la cola de aprobación del
panel (`scripts/publish-cut-review.mjs` → `video_projects` status `cut_review` + `review_queue`
`video_cut`) y **se detiene ahí**. El ffmpeg del corte corre recién cuando Sergio **aprueba** en
ONIA Center → Estudio de Contenido (Fase 5).

## 💸 Regla de gasto
Generación paga (Higgsfield, AssemblyAI, ElevenLabs) = **permiso explícito de Sergio caso por
caso** ([[gasto-plataformas-validar-primero]]). Por defecto todo gratis: Speaches (transcripción),
HyperFrames (render + SFX), imagen barata. Validar la idea antes de generar.

## Pipeline
1. **Setup + NORMALIZAR el crudo** (pieza propia, PROBADA). `videos/<name>/` con `raw/ scripts/ renders/ final/`.
   `node scripts/normalize-source.mjs --video raw/IMG_xxxx.MOV --out raw/<n>.mp4`
   ⚠ **El iPhone graba en HDR** (HEVC 10 bits, bt2020, transfer `arib-std-b67` = HLG). Pasarlo a
   SDR sin **tone mapping** deja la imagen LAVADA: piel grisácea, todo "muy blanco". Medido
   2026-07-30 sobre el día 1 — el brillo casi no cambia (151→147), lo que se pierde es el COLOR:
   la saturación cayó 50.6 → recuperada a 72.7 (+44%). El script detecta HLG/PQ solo y aplica
   la cadena correcta (`zscale` lineal → bt709 → `tonemap=hable:desat=0`); si el material es SDR
   no toca el color. **No mires solo el histograma: mirá el cuadro.**
   Para el paso de subtítulos: rechazar clips multi-orador, con subtítulos ya quemados, o sin
   voz clara (ver decision-gate de `embedded-captions`).
2. **Transcribir con timestamps.** Usar `ver-videos` → `scripts/transcribe.sh <audio>` (Speaches,
   gratis, `verbose_json` → `segments[]` + `words[]`). **Forzar `faster-whisper-small`** (el distil
   del contenedor es English-only y traduce el español). Guardar como `scripts/segments.json`.
3. **Cut-list.** `node scripts/cut-plan.mjs scripts/segments.json --video raw/<crudo>.mp4`
   ⚠ **`--video` NO es opcional en la práctica.** El silencio se mide en el AUDIO
   (`silencedetect`), no en los huecos del transcript: Whisper devuelve segmentos CONTIGUOS y
   las pausas quedan DENTRO de un segmento. Medido 2026-07-30 sobre un clip real de 15s con
   3.16s de silencio (21%): sin `--video` el plan reportaba **0.00s** y no cortaba nada; con
   `--video` corta 2.58s. Flags: `--noise -32dB --min-sil 0.45 --pad 0.08 --min-keep 0.35`.
   → detecta silencios (del audio), muletillas y repeticiones → imprime la **tabla**
   (`# | Me quedo con | Tiro | Por qué`) + escribe `cutplan.json` con `keep[]` y el filtro ffmpeg.
3b. **PREVIEW + costuras** (la otra mitad de la regla de oro, PROBADA).
   `node scripts/preview.mjs --video raw/<crudo>.mp4 --cutplan scripts/cutplan.json --out-dir renders`
   → `renders/preview-360.mp4` (el corte YA aplicado, 360p, rápido: se mira y se ESCUCHA antes de
   gastar un render bueno) + `renders/costuras.jpg` (el cuadro antes y después de cada empalme,
   uno al lado del otro — ahí se ve si el corte se comió una sílaba). Usa el MISMO filtro que el
   render final, así lo que se aprueba es lo que sale.
   **Esto funciona con el panel caído**; el paso 4 (cola de aprobación) es el camino operativo
   cuando el panel está vivo, no un requisito para cumplir la regla.
4. **Publicar la review a la cola de aprobación del panel.** (Regla de oro, materializada.)
   `node scripts/publish-cut-review.mjs --cutplan scripts/cutplan.json --title "…" --video-key <slug> [--lane sergio] [--format vertical] [--aspect 9:16] [--preview-url <url>]`
   → genera el SQL de UPSERT para `video_projects` (status **`cut_review`**) + `review_queue`
   (`source_type='video_cut'`, `status='pending'`, `reviewer_role_key='sergio'`, `sensitive=true`).
   Por defecto es **DRY-RUN** (imprime el SQL; `--out file.sql` lo guarda). El orquestador aplica
   ese SQL por SSH a `supabase-db` — la skill **nunca escribe a producción**. Con esto la pieza
   aparece en **ONIA Center → Estudio de Contenido** como corte PENDIENTE de tu OK, con la tabla
   keep/cut y el preview 360p. **El pipeline queda esperando acá: NO corta.**
5. **Aplicar el corte — SOLO tras aprobar Sergio en el panel (Fase 5).** Recién con el OK en la cola
   de aprobación, el **worker de render LOCAL** aplica el corte:
   `node scripts/render-approved.mjs --video raw/<crudo>.mp4 --cutplan scripts/cutplan.json --video-key <slug> [--out-dir renders]`
   → reconstruye el filtro ffmpeg EXACTO desde `keep[]` (select/aselect + setpts, igual que
   cut-plan.mjs) → `renders/cut.mp4`. Por DEFECTO es **DRY-RUN**: imprime el comando ffmpeg + el SQL
   de UPDATE (`video_projects` status→**`ready`** + `render_url`; `review_queue` del `video_cut`
   → `approved`). Con **`--apply`** corre el ffmpeg **LOCAL de verdad** (permitido: es local, nunca
   el VPS) y **aun así solo imprime el SQL** — la escritura a producción la aplica el orquestador por
   SSH a `supabase-db`. El render corre en la máquina de Sergio / la sesión Claude Code, **nunca en el
   VPS**. **Nunca cortar a ciegas ni antes del OK.**
6. **Subtítulos karaoke** (pieza propia, PROBADA). `node scripts/karaoke-captions.mjs --segments scripts/segments.json --video renders/cut.mp4 --out renders/karaoke.mp4 [--fix "Fergio=Sergio"]`
   → agrupa en frases de ≤4 palabras/1.6s y genera un **.ass** con la palabra activa resaltada
   (base blanco + activa amarillo, Arial Black escalado al alto del video, MarginV 220 en 9:16 para
   no tapar la cara), y lo quema con ffmpeg. Imprime la tabla de frases (mostrar a Sergio).
   Flags: `--words-per-line --margin-v --font-size --outline --base-color --active-color --dry-run`.
   Alternativa cinematográfica (matte de la persona, embed detrás del sujeto): `embedded-captions`.
7. **Apoyos visuales — mockups con código** (piezas propias, PROBADAS; el método de Santiago).
   `node scripts/make-mockup.mjs --template <browser|phone|stat|quote|custom> --out assets/x.png …`
   → PNG con fondo TRANSPARENTE renderizado de HTML/CSS con Playwright (acento `--accent`, default `#FF7A00`).
   **Look editorial / recorte de diario** (el del reel): `--template custom --html-file assets/html/recorte-diario.html
   --image foto.jpg --title "…" --label "…"`. El HTML propio acepta los tokens `{{IMAGE}}` (se
   incrusta como data URI; el render es self-contained y bloquea la red), `{{TITLE}} {{SUBTITLE}}
   {{LABEL}} {{VALUE}} {{ACCENT}}` — así una plantilla se reusa con otro texto sin editarla.
   Recetas que hacen el look, todas en CSS: retícula de diario = `radial-gradient` de puntos con
   `mix-blend-mode:multiply` sobre la foto en `grayscale(1) contrast(1.45)`; borde de recorte =
   `clip-path: polygon(...)` con puntos irregulares FIJOS; papel = dos `repeating-linear-gradient`;
   sello = borde + rotación + `multiply`.
   Apoyo **animado** (contar un número, revelar texto): `scripts/hyperframes/render.mjs` (motor de la casa,
   default) o `scripts/remotion/render.mjs` — las MISMAS 5 composiciones en los dos motores
   (`Stat · Browser · Phone · Quote · LowerThird`), salida secuencia PNG con alpha.
   `node scripts/overlay-visuals.mjs --video in.mp4 --plan overlay-plan.json --out out.mp4`
   → superpone los PNG con timing y fade (`{overlays:[{asset,start,end,position,scale,fade}]}`); `--dry-run` imprime el ffmpeg.
   Para overlays animados/kinéticos más elaborados: `talking-head-recut` (HyperFrames).
7b. **Sincronía palabra → elemento** (pieza propia, PROBADA — el corazón del método del reel).
   `node scripts/sync-plan.mjs --segments scripts/segments.json --storyboard storyboard.json --video renders/cut.mp4 --out scripts/overlay-plan.json`
   → el storyboard se escribe en PALABRAS (`{beats:[{cue:"seis doctores", asset:"assets/stat", position:"top"}]}`)
   y el script le pone el timestamp REAL de esa palabra en la narración. Salida = el plan que come
   `overlay-visuals.mjs`. Reglas: macheo **monotónico** (un cue repetido dispara en la aparición que
   toca), normaliza acentos/puntuación del ASR, `until:"next"` estira hasta el próximo apoyo, clampea
   al final del video, y **no deja que dos apoyos se pisen en la misma posición**. Beat sin cue → `"at": 12.5`.
   **Honestidad:** el cue que no aparece en el transcript se REPORTA en "SIN SINCRONIZAR" — nunca se
   inventa un tiempo. Flags: `--hold --fade --lead --gap --duration`.
8. **SFX — efectos de sonido** (pieza propia, PROBADA). `node scripts/sfx.mjs --video renders/cut.mp4 --plan scripts/sfx-plan.json --out renders/sfx.mp4`
   → mezcla los efectos en el tiempo exacto con **ducking**: la voz baja ~5 dB con rampa
   mientras suena el efecto y vuelve (medido: −4.8/−5.0 dB dentro de la ventana, 0.0 dB fuera).
   Plan: `{sfx:[{asset,at,gain,duck}]}` — `asset` es una ruta O el nombre de un cue de la librería.
   Una sola pasada de `filter_complex` (adelay + amix, `normalize=0`); el video se copia (`-c:v copy`).
   Flags: `--lib --gain --duck-db --duck-attack --duck-release --duck-max --duck-mode expr|sidechain --list-lib --dry-run`.
   Librería: la de HyperFrames (21 cues, `manifest.json` presente; **los .mp3 NO están versionados**)
   + 3 placeholders sintetizados con ffmpeg en `assets/sfx/`. Ver `assets/sfx/README.md`.
9. **Censurar caras** (pieza propia, PROBADA). `node scripts/blur-faces.mjs --video in.mp4 --out out.mp4 [--mode blur|pixelate|box]`
   → protege la identidad de terceros (pacientes, gente en la calle). Detección con **YuNet**
   (`scripts/blur-faces-detect.py`, OpenCV) + seguimiento + **relleno hacia adelante**.
   **Siempre imprime cuántos frames tuvieron detección y cuáles NO**, y los tramos sin cubrir.
   `--manual regiones.json` funciona SIN OpenCV (salida garantizada cuando la detección falla).
   Flags: `--padding --every --hold --lead --score --strength --report --also-detect --dry-run`.
   ⚠ **No es garantía de anonimato — revisar el render antes de publicar.**
10. **Transiciones** (pieza propia, PROBADA). `node scripts/transitions.mjs --video renders/cut.mp4 --cutplan scripts/cutplan.json --out renders/tr.mp4`
    → `xfade` (video) + `acrossfade` (audio) en las costuras del corte, leyendo `keep[]` del cutplan.
    También `--clips a.mp4 b.mp4 …` (unir clips) y `--seams 3.2,7.8` (a mano).
    Set acotado: `fade dissolve wipeleft wiperight slideup slidedown circleopen`. Default 0.3s.
11. **Zooms — punch-in y Ken Burns** (pieza propia, PROBADA).
    `node zoom-punch.mjs --video renders/cut.mp4 --out renders/zoom.mp4 --auto --cutplan scripts/cutplan.json`
    → **punch**: un tamaño distinto por bloque del corte (escalón fijo, cero jitter) — es lo que hace
    que el jump cut deje de notarse. **ken**: zoom animado `from → to` con smoothstep, para el remate
    o el dato fuerte (`--plan zooms.json` con `{zooms:[{start,end,from,to,anchor}]}`).
    En 9:16 usar `--anchor top` (ahí está la cara). Máx 2.0× (arriba se pixela); el script lo bloquea.
    **Va ANTES de los apoyos y los subtítulos** — si no, se zoomean el mockup y el texto.
12. **Ilustraciones — el modelo pone el CONTENIDO, el código pone el ESTILO** (PROBADO).
    Generar con Higgsfield `recraft_v4_1` (**1.25 créditos** por imagen a 1k, preflight con
    `get_cost:true`; saldo y modelo en [[higgsfield-models-roster]]) → tratar SIEMPRE con
    `node scripts/illustration-style.mjs --image bruta.png --out assets/ilu.png --preset diario`
    → montar en el marco de papel con `make-mockup.mjs --template custom --html-file
    assets/html/recorte-diario.html --image assets/ilu.png --title "…" --sello "día 1"`.
    **Por qué el paso del medio no se saltea:** pedirle "1960s newspaper, coarse halftone" a
    recraft devuelve una foto en blanco y negro LIMPIA, sin retícula (medido 2026-07-30). El
    modelo obedece el estilo "más o menos", y ese "más o menos" cambia entre una imagen y la
    siguiente — con 155 videos eso deja de ser una serie. La retícula, el contraste y el grano
    los pone el script, iguales siempre.
    **Preset de la serie: `onia`.** Duotono a la paleta de marca (`ink #0A0F0D` → `surface
    #F4F5F2` — que NO son negro y blanco puros: el ink es un verde-negro cálido y ahí vive la
    identidad) y el verde `#00D26A` **en la tinta del dibujo**, no en el fondo. Así la
    ilustración comparte color con la etiqueta de la tarjeta y el apoyo se lee como un sistema,
    no como un grabado de stock pegado encima.
    ⚠ **El acento va en las SOMBRAS.** Medido 2026-07-31: en un grabado (línea sobre papel) las
    luces son el FONDO y ocupan el 85-91% del cuadro — acentuar ahí teñía casi todo y rompía el
    **60-30-10** que manda la marca (`ONIA_BRAND_IDENTITY.md` §2: *"el verde es acento de alto
    contraste, no relleno"*). Con el acento en la tinta el verde queda en **5,5-12,2%**, medido.
    **Estándar de la serie: `onia` (acento 0.45)** — elegido por Sergio el 2026-07-31: los trazos
    más densos se quedan en tinta y el resto vira a verde. Para portadas o hitos que tienen que
    gritar la marca está `oniaFuerte` (0.90).
    Presets neutros (sin marca, para material fuera de la serie): `diario` · `grabado` · `limpio`.

    **Qué modelo usar (medido 2026-07-30, mismo prompt y mismo tratamiento):**

    | Modelo | Costo | Resultado |
    | --- | --- | --- |
    | `recraft_v4_1` | 1.25 cr | **El default.** Entiende la dirección editorial: luz dura, grano, época. Desvío tonal 106. |
    | `z_image` | 0.15 cr | 8× más barato pero devuelve foto de stock moderna: ignora "1960s press photograph". Desvío tonal 78 y **ningún preset lo rescata** (probado con `grabado` y con `normalize`: 78.8 y 78.5). |
    | Gemini (gratis) | — | **No existe:** el free tier de los modelos de imagen es `limit: 0`, hace falta facturación en el proyecto de Google. La *lectura* de video sí es gratis. |

    El código pone la trama; **la luz y la época las pone el modelo** y ahí el barato no llega.
    La forma de gastar poco NO es bajar de modelo: es **generar menos imágenes** — la mayoría de
    los apoyos son tarjetas dibujadas en código (gratis) y la ilustración se reserva para 1 o 2
    momentos por video. A 1-2 por pieza, la serie de 155 entra en ~300 créditos.
13. **Master de audio — SIEMPRE el último paso** (pieza propia, PROBADA).
    `node scripts/master.mjs --video renders/final.mp4 --out final/<slug>.mp4 [--fade-out 0.4]`
    → loudnorm de DOS pasadas a **−14 LUFS / −1.5 dBTP** (lo que normalizan TikTok, Reels y
    YouTube) y **re-mide la salida** para reportar dónde quedó. Medido: el material salía a
    −20 LUFS → el video sonaba 6 dB más bajo que el de al lado en el feed. El video se copia
    (`-c:v copy`): masterizar el audio no re-encodea la imagen.
14. **Verificar + exportar.** Revisar frames en tiempos clave (sync, color, fades) → `final/<slug>.mp4`.

### Orden del render (importa)
`cut → zoom → apoyos → subtítulos → SFX`. El zoom recorta y reescala el CUADRO: todo lo que se
pegue después (mockup, karaoke) queda nítido y en su lugar. Al revés, se agranda el texto quemado
y se ve amateur.

## Quick reference
| Necesito | Herramienta | Costo |
| --- | --- | --- |
| Transcript + timestamps | `ver-videos` → Speaches | gratis |
| **Normalizar el crudo (HDR del celular)** | `scripts/normalize-source.mjs` | gratis (local) |
| Cut-list (tabla de cortes) | `scripts/cut-plan.mjs` **con `--video`** | gratis |
| **Preview 360p + tira de costuras** | `scripts/preview.mjs` | gratis (local) |
| **Master de audio (−14 LUFS)** | `scripts/master.mjs` | gratis (local) |
| Publicar el corte al panel para tu OK | `scripts/publish-cut-review.mjs` (DRY-RUN → SQL) | gratis |
| Aplicar el corte (tras OK) | `scripts/render-approved.mjs` (worker LOCAL, DRY-RUN → ffmpeg + SQL) | gratis |
| **Narración / voz** (Lucía = **Marcela**) | `scripts/tts-elevenlabs.mjs` (ElevenLabs `eleven_multilingual_v2`) | plan starter ~69k chars/mes |
| Subtítulos karaoke (word-level) | `scripts/karaoke-captions.mjs` (.ass + ffmpeg) | gratis (local) |
| Mockups / tarjetas de dato / marcos | `scripts/make-mockup.mjs` (HTML+CSS → PNG alpha) | gratis (local) |
| **Apoyo ANIMADO (mismas 5 comps, 2 motores)** | `scripts/hyperframes/render.mjs` · `scripts/remotion/render.mjs` | gratis (local) |
| **Timing de los apoyos por PALABRA** | `scripts/sync-plan.mjs` (storyboard en palabras → plan) | gratis (local) |
| **Zooms (punch-in por bloque / ken animado)** | `scripts/zoom-punch.mjs` | gratis (local) |
| Montar overlays con timing y fade | `scripts/overlay-visuals.mjs` | gratis (local) |
| **Efectos de sonido + ducking** | `scripts/sfx.mjs` | gratis (local) |
| **Censurar / difuminar caras** | `scripts/blur-faces.mjs` (+ `blur-faces-detect.py`, OpenCV/YuNet) | gratis (local) |
| **Transiciones entre bloques o clips** | `scripts/transitions.mjs` (xfade + acrossfade) | gratis (local) |
| Cargar una campaña como video_projects | `scripts/seed-campaign.mjs` (DRY-RUN → SQL) | gratis |
| Subtítulos cinematográficos (embed detrás del sujeto) | `embedded-captions` | gratis (local) |
| Overlays / lower-thirds / mockups | `talking-head-recut` | gratis (local) |
| SFX / música | librería HyperFrames | gratis |
| **Ilustración en el estilo de la serie** | Higgsfield `recraft_v4_1` → `scripts/illustration-style.mjs` | **1.25 cr/imagen** |
| Imágenes / b-roll / mascot | `image-gen` MCP / modelo barato | ~gratis |
| Video generativo / avatar | Higgsfield | **pago → OK Sergio** |

## ⚠ Censurar caras — lo que NO se puede prometer
`blur-faces.mjs` protege identidad de terceros, así que **la seguridad va antes que la prolijidad**:
mejor difuminar de más que destapar una cara un frame. Reglas de la casa:

- **La detección automática NO es garantía de anonimato. Nunca decirle a nadie que lo es.**
  Siempre revisar el render completo antes de publicar.
- El script imprime **cuántos frames muestreados tuvieron cara y cuántos no**, la **cobertura
  temporal** y los **tramos SIN tapar**. Ese bloque se lee, no se saltea.
- Si el detector no encuentra NADA, el script **falla y no genera archivo** — sacar un video sin
  censurar creyendo que está censurado es peor que no tener salida.
- Cuando la detección falla (cara de perfil, muy chica, tapada, video degradado): `--manual
  regiones.json` (`{regions:[{x,y,w,h,start,end}]}`). No necesita OpenCV ni el modelo.
- Fuerza de tapado: `box` (rectángulo sólido) es el único **irreversible**; `pixelate` (8 bloques
  a lo ancho) es fuerte; `blur` es el default y el más prolijo. Para material sensible de verdad
  → `box` o `pixelate`.
- Detector: **YuNet** (`assets/models/face_detection_yunet_2023mar.onnx`, 232 KB, opencv_zoo
  oficial). OpenCV 5 **eliminó** `CascadeClassifier` y el DNN Caffe → haar y el res10 SSD ya no
  existen ahí. Requisito: `python -m pip install opencv-python`.

## Transiciones — cuándo usar cuál
Duración corta siempre (**200–400 ms**; arriba de 0.5s se ve amateur y el script avisa).
Cada transición **acorta** el video su propia duración: los dos bloques se solapan.

| Transición | Cuándo |
| --- | --- |
| `fade` | Default. Neutra, sirve siempre; ante la duda, esta. |
| `dissolve` | Salto de tema de golpe; más sucia/orgánica. |
| `wipeleft` | Avanzar: "y el siguiente punto es…". |
| `wiperight` | Volver a algo ya dicho. |
| `slideup` | La mejor en 9:16 — es el gesto del feed. Ideal para listas. |
| `slidedown` | Poco: en vertical se lee como "deshacer". |
| `circleopen` | **Reservar para el remate / CTA final.** |

## Common mistakes
- **Correr `cut-plan.mjs` sin `--video`.** Mide el silencio en los huecos del transcript, que en
  un talking-head real son CERO: sale una cut-list que no corta nada y parece que "no había
  silencios". Si el panel está caído, el preview igual se genera local (`preview.mjs`).
- **Transcodificar el crudo del celular sin tone mapping.** Sale lavado y no se nota en los
  números, solo mirando. Y ojo: si sacás los frames de control del video YA convertido, estás
  comparando lo malo contra lo malo — el control se saca del ORIGINAL.
- **Publicar sin masterizar el audio.** Sale a −20 LUFS y en el feed suena bajo contra todo lo demás.
- **Cortar sin publicar la review + mostrar la tabla + preview** (viola la regla de oro). Correr
  `publish-cut-review.mjs` y esperar el OK de Sergio en el panel; el ffmpeg del corte va DESPUÉS.
- **Aplicar el SQL a producción desde la skill.** La skill es DRY-RUN (imprime SQL); lo aplica el
  orquestador por SSH a `supabase-db`.
- **Subtitular todo como embed** — la mayoría va al rail; embed solo el pico (ver `embedded-captions`).
- **Gastar en Higgsfield/AssemblyAI sin OK.** Default gratis. Con OK: preflight `get_cost` y reportar lo gastado.
- **Confiar el ESTILO al modelo de imagen.** Obedece el pedido "más o menos" y ese margen cambia
  entre imagen e imagen: a los 155 videos no hay serie. El estilo lo fija `illustration-style.mjs`.
- **Poner el sello sobre la foto** en el recorte de diario: usa `multiply` y sobre un plano oscuro
  desaparece (queda un recuadro rojo vacío). Va sobre el papel.
- Usar el modelo distil en Speaches para español (traduce a inglés) — forzar `faster-whisper-small`.
- **Prometer que las caras quedaron anónimas** sin haber mirado el render. La detección falla; el
  bloque "HONESTIDAD" del script dice exactamente dónde. Cubrir los huecos con `--manual`.
- **Poner un apoyo en `bottom` cuando hay subtítulos.** Abajo vive el rail del karaoke: la placa y
  el texto se pisan (medido 2026-07-30, ver el A/B). Los apoyos van `top` / `center`; si el apoyo
  tiene que ir abajo sí o sí, subí el `--margin-v` del karaoke.
- **Mezclar apoyos de los DOS motores en la misma pieza.** Remotion y HyperFrames corren las mismas
  composiciones pero el reveal no resuelve en el mismo frame (comprobado a los 5.6s). Elegí uno por pieza.
- **Poner los tiempos de los apoyos a ojo** en vez de `sync-plan.mjs`: ahí es donde el motion deja
  de estar pegado a la voz. Y si el cue se repite ("vez", "sistema"), a ojo dispara en la aparición
  equivocada — el macheo monotónico existe para eso.
- **Zoomear DESPUÉS de quemar texto**: se agranda el subtítulo/mockup y se ve amateur. El zoom va antes.
- **Poner `transform` en el `#stage` de un HTML custom.** Chromium devuelve el lienzo a 2× pero
  PINTA el contenido a 1× → el apoyo sale a mitad de tamaño arriba a la izquierda, y
  `overlay-visuals.mjs` lo escala mal (medido 2026-07-30: `filter` y `clip-path` NO tienen el
  problema, `transform` sí). La rotación va en un HIJO; `#stage` queda limpio. `make-mockup.mjs` ya
  captura por clip de página para no depender de eso, pero la regla vale igual.
- **Mezclar SFX sin ducking** (`duck:false` en todo): el efecto compite con la voz y suena pegoteado.
- `amix` sin `normalize=0`: divide entre N y todos los efectos quedan mucho más bajos que el plan.
- Transiciones largas (>0.5s) o `circleopen` en cada costura: se ve amateur. Corto y `fade` por defecto.
- HyperFrames no determinista (`Math.random`/`Date.now`) → render roto. Solo lógica determinista.

## Relacionadas
`ver-videos` · `embedded-captions` · `talking-head-recut` · `hyperframes-cli` · `media-use` · [[onia-video-hyperframes]] · [[content-engine-remotion]].

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

## ⭐⭐ ANTES DE EDITAR A SERGIO URCULLO: qué se replica y qué es solo referencia (2-oct-2026)

Sergio Urcullo, 2-oct, textual: *«lo que quiero que hagas tal cual son los videos de Eric Taveras y Santiago
Munoz»*, y del reel de Codex: *«no me refiero a que lo hagas tal cual, me refiero a que lo tomes de referencia»*.
- **Molde a replicar TAL CUAL:** el montaje de **@eriktaveras** y **@sanmunoz.ia**. Vive en la skill nueva
  **`edicion-referentes`** (lista desde el 3-oct: dos recetas medidas, un script por receta y una prueba sobre N03; la arma Marca personal desde el 2-oct, por decisión de Sergio Urcullo: «a partir de
  después de eso, con el formato de los referentes, y creamos la nueva skill de edición»). Fichas de montaje por
  cuenta (3-oct, reel por reel): `hermes-content/references/marca-personal/FICHAS-MONTAJE-REFERENTES.md`.
  Hasta el 2-oct de Erik no había NADA del montaje, y de Santiago un solo reel (sección «Layout tutorial
  vertical partido», más abajo).
- **Su video propio que salió bien:** «Tu primera automatización», subido el 22-sep. También lo editó Codex,
  con HyperFrames: gancho a cámara completa, la cara pasa a PiP chico arriba a la derecha, 4 pantallas de nodos
  dibujadas a pantalla completa que cambian justo en cada corte, subtítulos por frase en pastilla, 1,1×, sin
  zooms ni SFX, CTA a cámara completa. Proyecto rescatado y receta: `videos/marca-personal/2026-09-21/RECETA.md`
  (+ `index.html`).
- **Solo referencia:** el reel «GPT-6 Astra vs Fable 5.1» que editó Codex el 14-sep, con `edit.py` y tarjetas en
  `hermes-content/references/video-intake/2026-09-14-reel-astra-fable-codex/RECETA.md`. Lo que vale de él es el
  movimiento de cambiar el panel justo en el corte para esconder el salto. No es el molde.
Por qué está acá arriba: el 2-oct salió la edición básica «corte + karaoke + recuadros» y él la rechazó («no lo
hacés como antes»).

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

## Estilo TikTok 17/18-sep — referencia, no molde (lo que se replica: Erik Taveras y Santiago Muñoz)

> 2-oct-2026, dos rechazos seguidos del mismo video (N03, modo auto):
> 1. Corte + karaoke + recuadros verdes: *«esa no sigue siendo tu manera de editar, porque no lo hacés como antes»*.
> 2. La re-edición con este estilo 17-sep (zoom punch, tarjetas, keywords, **pop en cada tarjeta**): *«elimina ese
>    sonido horrible cada que sale un mockup»*. El reel de Codex NO tiene SFX. Ese «pop» fue un agregado nuestro.
> 3. Ese mismo día rehice N03 con la receta de Codex del 14-sep (`scripts/edit-codex.py`). Después Sergio Urcullo aclaró
>    que el molde son los videos de **Erik Taveras (@eriktaveras) y Santiago Muñoz (@sanmunoz.ia)**: Codex y el 17-sep
>    son referencia. El video bueno que él recuerda es «tu primera automatización» (22-sep).
> Lección: «como antes» no se adivina. Tres ediciones del mismo video, y cada una copió lo más parecido que había en el
> repo. Antes de rehacer un estilo «como antes»,
> preguntá CUÁL video y pedile a la madre el archivo si no está en el repo.

Si él pide este estilo, la receta está en `videos/tiktok-20260917/README.md`:
- corte fino (silencios + sonido sin palabra);
- zoom punch por bloque;
- logo oficial de Claude Code en cada mención;
- tarjetas dark (`card-dark.html`);
- pantalla completa (`fullscreen.html`);
- keywords blancas 900 con subrayado naranja (`keyword.html`);
- karaoke `--style apple`;
- −14 LUFS.
SFX sólo si los pide.

Plantillas y fuentes: `videos/tiktok-20260917/scripts/*.html` + `videos/claude-code-03/assets/fonts/`. Ejemplo portable
(Linux, una pasada, sin SFX desde la v3): `videos/n03-modo-auto-20261001/` (`scripts/build-17sep.mjs`).

## ⭐ REGLA DE ORO (de Santiago) — nunca cortar a ciegas
**La tabla de cortes + un preview 360p SIEMPRE se muestran a Sergio ANTES de aplicar el corte.**
Formato de la tabla: `# | Me quedo con | Tiro | Por qué`. Se aplica el corte recién con su OK.
Operativamente: el pipeline **publica el corte como review PENDIENTE** en la cola de aprobación del
panel (`scripts/publish-cut-review.mjs` → `video_projects` status `cut_review` + `review_queue`
`video_cut`) y **se detiene ahí**. El ffmpeg del corte corre recién cuando Sergio **aprueba** en
ONIA Center → Estudio de Contenido (Fase 5).

## ⭐ REGLA DE ORO — ninguna falta de ortografía se quema
Hermana de la de arriba, del mismo rango: **antes de quemar CUALQUIER texto en el cuadro, el
transcript se lee a ojo, línea por línea.** Es paso obligatorio del pipeline (§5b), no un chequeo de
buena voluntad: **no hay script que lo haga**. Whisper es auto-transcriptor, no corrector — devuelve
español bien formado y mal escrito, y nada aguas abajo lo detecta.

**Pasó de verdad.** Un reel del lote 17 publicó **dos faltas quemadas en 10 fotogramas**:
`A GENERADO` por `HA GENERADO`, y `ARANA` sin la eñe — las dos salidas del auto-transcriptor sin
revisar. La fuente le pone el gate a esta skill con nombre y apellido: *"el SRT se revisa a ojo antes
de quemarlo, con foco en ñ y acentos"*
(`hermes-content/references/video-intake/2026-08-18-sintesis-lote-17.md` §5.8). En B2B boliviano una
falta quemada cuesta exactamente la credibilidad que el video intenta construir.

**Quemado no se parchea: se re-renderiza.** Nunca tapar la falta con un overlay ni con una segunda
pasada — se corrige la fuente, se recompila y se vuelve a renderizar. Si el gate encuentra algo, el
pipeline **no avanza**: se corrige y se rehace desde el paso que quema. El texto vive en .ass/HTML y
no horneado en una imagen justamente porque acá tipografía, color y **ortografía son deterministas**;
una falta tira esa ventaja a la basura.

**Se corrige en el TRANSCRIPT, no en la salida.** Karaoke → `scripts/segments.json` (de ahí sale
`remap-transcript.mjs` y de ahí el .ass; `--fix "Fergio=Sergio"` parchea los tokens en el momento del
quemado y **no persiste** — un re-render sin la misma bandera vuelve a quemar la falta). Embed
cinematográfico → `transcript.json`, y ahí además es mecánico: los normalizadores conservan ñ y
acentos (`make-theme.cjs` `norm()` mantiene `\p{L}`, `check-timing.cjs` normaliza igual), así que
corregir solo el JSON autorado revienta el build (`cannot match authored word` en Theme,
`NOT IN TRANSCRIPT` en Cinematic). Por eso el gate va **antes** de autorar.

**⚠ Esta copia es la que manda.** `embedded-captions` tiene el mismo gate en su § Step 2b, pero esa
skill es **upstream de HyperFrames**: su propio SKILL.md ordena correr `npx hyperframes skills update
embedded-captions` al arrancar, y `hyperframes init` también refresca el set global — **un update
puede pisar esa edición y el gate desaparece sin que nadie se entere**. `editor-videos` es nuestra y
no la pisa nadie: si las dos difieren gana ésta, y si allá el gate ya no está, no es que se derogó —
es que lo pisaron. El detalle largo (barrido completo + los términos que Whisper destroza medidos en
el mismo corpus: `Seedance` → "see dance 2.0", `VSL` → "viesel") vive en
`.agents/skills/embedded-captions/SKILL.md` § Step 2b, mientras siga ahí.

## 💸 Regla de gasto
Generación paga (Higgsfield, AssemblyAI, ElevenLabs) = **permiso explícito de Sergio caso por
caso** ([[gasto-plataformas-validar-primero]]). Por defecto todo gratis: Speaches (transcripción),
HyperFrames (render + SFX), imagen barata. Validar la idea antes de generar.

## 🎛 Orquestación (Sergio, 18-sep: "mandá subagentes, dejás a medias cada video")
- **UN subagente por pieza, pipeline COMPLETO de una vez** (comp → karaoke → SFX → master →
  QA mirando frames → editado/). El orquestador prepara plantillas/configs y despacha en
  paralelo; nunca edita las piezas en serie él mismo.
- **SIN música de cama: la pone Sergio.** Entregar con voz + SFX solamente.
- **El karaoke es el rail; lo IMPORTANTE se resalta ADEMÁS** con keyword grande en pantalla
  (blanca 900 + subrayado naranja) cuando se dice — no basta transcribir.
- **Mención hablada de una marca → su logo ORIGINAL en pantalla** (Sergio, 18-sep: "cuando
  digo 'esto es Claude Code', colocá logos de Claude Code"). Nunca recrear el logo: bajarlo
  de fuente oficial (Claude Code = criaturita pixel + wordmark; lockup listo en
  `videos/tiktok-20260917/assets/card-cc-wordmark.png`, SVG oficial al lado). La primera
  versión recreada en pixel-art fue rechazada con "poné la original".

## 🔍 Auditoría contra el stack de Santiago Muñoz (18-sep, pedida por Sergio)
Evidencia primaria: su reel `DdE7wYbxjPK` (frames mirados, ficha en video-intake) + su
tutorial de 28 min que fundó esta skill.

**SÍ usamos (fiel):** narración = timeline word-level · tipografía y marcos en CÓDIGO ·
tabla de cortes + preview antes de aplicar · transcript como fuente de todo texto.

**NO usamos aún (deuda real con el método):**
1. **Su stack 2026 es agente + NLE real**: GPT-6 Astra manejando DaVinci Resolve por MCP.
   Nosotros montamos con filter_complex artesanal — de ahí los reventones de memoria y
   costuras frágiles de esta semana. Evaluar el MCP de DaVinci como motor de montaje.
2. **"UNA instrucción completa" por video** (doc OBJETIVO / MATERIAL / ESTILO visible en su
   pantalla): nosotros editamos a pedidos sueltos → el "dejás a medias" que reprochó
   Sergio. Antes de editar el video 04: escribir ese doc y ejecutarlo entero.
3. **Inventario del material como artefacto** (su CSV de crudos + hallazgos.md + plan):
   nosotros improvisamos el inventario en cada sesión.

## Entrada y salida (29-sep-2026)
- **Brutos:** Sergio los deja en `C:\Users\PC\Videos\ONIA-brutos\<AAAA-MM-DD>\` (fuera del repo: el
  autosync subiría a git cualquier video de adentro). Se copian a `videos/<pieza>/raw/` (ignorado).
- **Publicación:** Reel normal + **yap** (otra edición del mismo video: otro gancho, otro orden, más
  corto) como **Trial reel** en Instagram, con `hermes-content/deploy/vps-ops/publicar/ig-reel.mjs`.
  Circuito, comandos y reglas: `hermes-content/deploy/vps-ops/publicar/README.md`. UNA aprobación de
  Sergio por paquete del día (incluye la tabla de cortes); sin ese «ok» no se publica nada.

### Editar desde una sesión en la NUBE (medido el 1-oct-2026)

- **El video no llega por el chat** (las imágenes sí). Tampoco por el MCP de Drive: `download_file_content` devuelve
  base64 dentro del contexto, y no sirve para video.
- **Camino que funciona:** Sergio Urcullo sube el bruto a Drive, lo comparte con **«Cualquier persona con el enlace»** y
  pega el link. Se baja con `curl -L "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t"`.
  Necesita que la red del entorno deje pasar `drive.google.com` y `drive.usercontent.google.com`: el 30-sep daban 403
  en el proxy y el 1-oct ya pasaban. Probalo con `curl -sS -o /dev/null -w '%{http_code}'` antes de prometer nada.
- **`ffmpeg` no viene en el contenedor:** `apt-get install -y ffmpeg` (6.1.1, ~1 min). `faster-whisper` se instala por
  pip. Las dos cosas se pierden cuando el contenedor se recicla.
- **Publicar desde la nube** necesita el secreto `ONIA_VPS_SSH_KEY_B64` en el entorno: el hook
  `scripts/nube-ssh-vps.mjs` arma `ssh onia-vps` por el túnel. Sin él, la nube edita pero no publica ni agenda.
- **Medido el 1-oct (noche), entorno «onia-higgsfield»:** el hook dejó `~/.ssh/config` y la llave, pero **el binario
  `ssh` no venía**: `apt-get install -y openssh-client` y `ssh onia-vps hostname` respondió. `ffmpeg` ya venía instalado.
- **Drive por MCP ya anda** (1-oct noche): `search_files` con `mimeType contains 'video/'` lista los videos, y
  `parentId = '<id de carpeta>'` lista una carpeta. Sirve para ENCONTRAR el archivo; para bajarlo sigue siendo `curl` a
  `drive.usercontent.google.com` (probado: 200, 8,6 MB, con un archivo compartido por enlace). Un archivo que se está
  subiendo no aparece en la búsqueda hasta que termina.
- **Video del 1-oct (N03), lo medido:** con el micrófono de Sergio Urcullo el ruido de fondo queda en ~-25 dB y el
  `--noise -32dB` de `cut-plan.mjs` no encontró NINGÚN silencio. Medí antes (`ffmpeg -af volumedetect`, y
  `silencedetect` a -28/-25 dB) y usá ~-27 dB con `--min-sil 0.4`.
- **Compará lo que DIJO contra el guion buscando sentido invertido, no solo ortografía.** Dijo «deja DE pasar» dos
  veces donde el guion decía «deja pasar» (lo que el modo auto PERMITE): small y medium coincidieron, así que no era
  error de Whisper.
- **Sacar una palabra corta («de») sin oído no es confiable.** La envolvente RMS confunde sílabas, y Whisper como juez
  es parcial: completa «deja de…» por costumbre o, si el corte se come el «pa», oye «deja de estar». Probado: el
  modelo medium sobre el tramo AISLADO, con y sin `initial_prompt`; si con prompt oye «deja pasar» y sin prompt no
  oye «de», el corte sirve, pero igual lo escucha Sergio Urcullo en el preview. Si la frase es solo una transición,
  cortala ENTERA (más seguro).
- **Drive, una vez y para siempre:** que Sergio Urcullo comparta la CARPETA «Videos Onia Octubre» con «cualquier
  persona con el enlace». Lo que suba adentro hereda el acceso y se baja con curl sin pedirle nada por archivo.
- **Transcribir sin Speaches:** `pip install faster-whisper` (~1 min) y el modelo `small` (int8, CPU) se baja solo de
  HuggingFace. Con `word_timestamps=True` sale `{segments:[{start,end,text}], words:[{start,end,word}]}`, el formato
  que comen `cut-plan.mjs` y `karaoke-captions.mjs`. Forzá `language="es"`.

### Antes de grabar: el dato del guion se mira renderizado (1-oct-2026)

WebFetch trajo una versión VIEJA de la página de precios de WhatsApp de Meta (decía 72 h de ventana gratis). El
navegador mostró la vigente («Updated: Sep 28, 2026»: hasta 7 días y solo desde la app del celular). **Un precio o una
regla de plataforma (Meta, OpenAI, Anthropic) se confirma con la página RENDERIZADA en un navegador**, con su fecha de
actualización anotada. WebFetch y las fuentes secundarias sirven para descartar, no para grabar.

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
5b. **GATE DE ORTOGRAFÍA — obligatorio antes de quemar texto** (⭐ regla de oro; ningún script lo
   hace, lo hace el agente a ojo). Leer línea por línea el transcript que va a alimentar el texto
   quemado: karaoke → `scripts/segments.json` (o `segments-cut.json` si ya remapeaste); embed
   cinematográfico → `transcript.json`. Barrido, en este orden — es lo que el transcriptor rompe:
   **1) ñ** (`ARANA`, `ANO`, `MANANA`; la pérdida más común, y un rail en mayúsculas no la delata) ·
   **2) acentos** (`mas`/`más`, `esta`/`está`, `si`/`sí`, `el`/`él` — cambia el significado) ·
   **3) `a` vs `ha`** (la que efectivamente se publicó: una `a` delante de un participio es `ha`) ·
   **4) nombres propios y términos técnicos**, que Whisper convierte en palabras plausibles —
   contrastarlos contra lo que se ve en pantalla o contra la fuente que los nombró, nunca tomarlos
   del transcript a ciegas. Nombres de cliente, marcas y todo número dicho en cámara se leen dos
   veces. **Si no se puede verificar una grafía, se pregunta — no se quema una adivinanza.** La
   corrección va en el transcript; recién con el barrido limpio se pasa al paso 6.
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
   Apoyo **animado** (contar un número, revelar texto): `scripts/hyperframes/render.mjs`.
   **Decisión CERRADA (A/B medido 2026-07-30): el motor es HyperFrames. No se reabre.**
   `scripts/remotion/render.mjs` corre las MISMAS 5 composiciones
   (`Stat · Browser · Phone · Quote · LowerThird`) pero es **baseline histórico**, no una
   alternativa a elegir: HyperFrames es Apache-2.0 y Remotion es gratis solo hasta 3
   empleados (desde el 4º, Company License paga — eso lo decide Sergio). Motivos, números
   y fuentes: `scripts/hyperframes/README.md`, sección "Motor de la casa".
   Salida: secuencia PNG con alpha.
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

## 🧱 El vocabulario visual (catalogado del reel, 2026-07-31)

Miré el reel de @human___academy contando lo que se superpone a la imagen. Dos números que
mandan sobre todo lo demás: **entra un elemento nuevo cada 1,2-1,8 s** y el más frecuente
**no es una ilustración, es una palabra**. Casi todo el vocabulario se dibuja con CÓDIGO —
generar imágenes es la excepción, no la regla.

| Composición | Qué es | Veces en el reel | Cuándo |
| --- | --- | --- | --- |
| `Keyword` | La palabra sola, con resaltador que se abre | 8 (el más usado) | Una idea que tiene que quedar |
| `Trazo` | Círculo, flecha o subrayado que se DIBUJA | 6 | Señalar algo dentro del cuadro (reemplaza al dedo) |
| `Tag` | Rótulo chico con punto de anclaje y guía | 5 | Nombrar una parte de lo que se ve |
| `Escena` | Plano COMPLETO: imagen + ken burns + palabra | 4 | Llenar un tramo largo sin nada que mostrar |
| `Lista` | Ítems que caen uno por uno | 3 | Cuando el que habla enumera |

Todas 1080×1920, alpha real, paleta de marca, y pasan `hyperframes check`.
Se disparan por palabra con `sync-plan.mjs` como cualquier otro apoyo.

**`Escena` vs. video generado** — verificado cuadro por cuadro: el tutorial **NO genera video**.
Entre 1.70 s y 2.10 s su pintura es IDÉNTICA (pliegues, manos, caras del público); solo cambian
el zoom y el texto. Imagen fija + ken burns cuesta **1,25 cr** contra **7,5 cr** de un clip
generado, y sale a 1080p contra 720p. El video generado se reserva para cuando el movimiento
ES el punto (algo que gira, fluye o se arma) — y hay que pedir la imagen fuente YA en 9:16 o
el modelo la deforma.

## 🎬 Layout "tutorial vertical partido" (reel DdE7wYbxjPK, 2026-09-17)

Segundo estilo catalogado (pedido de Sergio: "aprende esta manera de edicion"). Ficha completa
con tabla medida y receta de 7 pasos:
`hermes-content/references/video-intake/2026-09-17-reel-santiago-astra-davinci-estilo-edicion.md`.

Lo esencial: **cabeza hablante ABAJO (~45%) anclada y fija; zona de apoyo ARRIBA (~55%) que
rota cada 1-3 s** (screencast con zoom focal, b-roll relámpago ≤1,5 s por herramienta
nombrada, ecuaciones de logos flotantes "X + Y = 💰", fotos con ken burns). Subtítulos blanco
bold 2-5 palabras con keyword en AMARILLO, en la zona de la cabeza. Jump cuts cada ~2 s.
CTA final = fondo desenfocado total + texto centrado con la keyword en amarillo.

**La composición partida ya es pieza propia: `scripts/split-layout.mjs`** (probada 2026-09-17
con material real de Sergio — deck en `contain`, zoom focal por `crop` del fuente, huecos =
cabeza en blur oscuro). El karaoke le va encima con `karaoke-captions.mjs`
**con `--style apple`** — decisión de Sergio 17-sep: activa VERDE de marca (el default) y
"apple style, sin bordeado negro". El preset pone outline 0 y una capa de sombra difusa
(`{\blur7}` en negro translúcido, un evento por frase en la capa de abajo) — NUNCA el
Shadow duro de ASS, que se lee como texto fantasma. El amarillo `--active-color "#FFE600"`
queda solo para imitar 1:1 el reel de referencia.
⚠ **Medido el 1-oct contra sus 4 últimos videos** (`video-intake/2026-10-01-santiago-erik-edicion-medida.md`): con voz,
Santiago va **sin música de cama, sin whoosh en cada cambio** y con planos de ~5 s, no un corte cada ~2 s. La ficha del
17-sep (Gemini) decía lo contrario; manda la medición.
Orden: cortar → split-layout → karaoke → SFX → master. Falta solo la ecuación de logos
("X + Y = 💰") como pieza HyperFrames — se hace cuando un guion la pida.
⚠ El crudo tiene que traer la CÁMARA como toma aparte full-frame (como `clip 1 video 2.mp4`);
la burbujita de OBS incrustada en la esquina no da resolución para la zona de cabeza.

## 🟩 Pantalla verde: vos recortado delante de la captura (3-oct-2026)

Pedido de la madre el 3-oct para el Bloque 1 de `PLAN-GRABACION-3-OCT.md` (16 piezas «Verde»). Pieza:
**`scripts/fondo-verde.mjs`** (chromakey + despill de ffmpeg, sin dependencias).

```bash
# 1) MIRAR primero: lámina original | recorte sobre magenta | final, en el segundo 2
node scripts/fondo-verde.mjs --toma toma.mp4 --fondo captura.png --crop 0:0:1440:1800 --chequeo chk.png --t 2
# 2) Recién con la lámina limpia, el video (el audio se copia)
node scripts/fondo-verde.mjs --toma toma.mp4 --fondo captura.png --crop 0:0:1440:1800 --out verde.mp4
```

- **Nada se adivina: color y umbral se miden en el borde del cuadro**, que es tela (franja de arriba y los
  costados; solo los píxeles donde manda el verde, así la persona que toca un costado no cuenta).
- ⚠ **La trampa que costó la primera prueba: chromakey compara solo el color (U,V), no el brillo.** Con la
  tela en sombra el verde medido (`0x167F03`) queda tan cerca del gris que la camiseta blanca salió
  **medio transparente**: el fondo llegaba hasta 0,19 de distancia y la persona empezaba en 0,15. El
  arreglo es usar **el mismo tono llevado a brillo pleno** (`0x25FF04`): el fondo queda debajo de 0,22 y la
  persona arriba de 0,34. El script lo hace solo e informa `similitud`, `suavizado` y `hueco` en el JSON.
- **`hueco` < 0,04 = aviso**: luz despareja o tela arrugada. Se mira la lámina; si la ropa sale
  transparente, se mejora la luz o se va a la pantalla partida.
- **`hsvkey` se probó y se descartó**: se come la ropa clara.
- **`--mate x:y:w:h`** (máscara de basura): conserva solo ese rectángulo de la toma. Para cuando la cámara
  ve más allá de la tela (bordes oscuros, el soporte). Con el encuadre del plan (cabeza en la mitad de
  abajo) un `--mate 0:280:1080:1640` limpia las esquinas de arriba sin tocar la cabeza.
- **`--fit ancho`** (default): la captura a lo ancho arriba y lo que sobra en la tinta de marca.
  `--crop` es el zoom focal de siempre (la línea que importa, no la página entera).
- **Probado el 3-oct** con 5 s de verde digital (CC BY 3.0, «We Made a Bunch of Green Screen Footage!»,
  Cold Ones, en Wikimedia Commons) y la misma toma degradada a propósito (viñeta, -15 % de saturación,
  degradé vertical, ruido): **las dos salen sin agujeros ni borde verde en las trenzas**, mirado a 1:1 y en
  4 cuadros a lo largo del clip. 11 s de render por 5 s de toma. La tela real se calibra con la primera
  toma de Sergio Urcullo: lámina `--chequeo` antes de renderizar nada.
- **Si con la tela real no queda limpio en 1 hora → pantalla partida** (`split-layout.mjs`, receta
  Santiago) y se avisa. Por eso el plan encuadra la cabeza en la mitad de abajo: la misma toma sirve.
- Orden: cortar (con la regla de oro) → fondo-verde → karaoke → master.

## 🎞 Reels de Lucía — b-roll generado + voz en off o texto (1-oct-2026)

> Regla de Sergio Urcullo (1-oct): **todo video que sale a redes se edita con esta skill; Higgsfield solo genera el
> clip.** El 1-oct L02/L05/L08 salieron con placas PIL y hubo que rehacerlos. Receta medida contra los últimos videos
> de Santiago Muñoz y Erik Taveras: `hermes-content/references/video-intake/2026-10-01-santiago-erik-edicion-medida.md`.
> Guion por pieza: `hermes-content/docs/cola/lucia-diario/S*-GUIONES.md`; instrucción completa:
> `videos/lucia-lNN/INSTRUCCION.md` (OBJETIVO / MATERIAL / ESTILO, una por video, ejecutada entera).
>
> ⛔ **Texto de Lucía (guion, pie, subtítulos, tarjetas). Decisión de Sergio Urcullo del 3-oct: *«que no se identifique
> como ello pero que tenga la ropa»*.**
> - Puede llevar el ambo como vestuario, pero **nunca dice ni da a entender que es del rubro**. Quedan fuera «hoy soy
>   odontóloga», «soy doctora», «como odontóloga», «mis pacientes» y «mi consultorio». La presenta siempre «Lucía ·
>   personaje IA de Onia», que muestra cómo funciona el sistema.
> - **Tampoco promete resultados** («agenda llena», «cero ausencias», porcentajes). La IA se declara siempre: el chiste
>   va con «No: soy IA», nunca con «no sé».
> - **Cómo se llegó acá:** «Hoy soy odontóloga» entró a `main` el 2-oct en el plan v2 sin revisión. Antes de renderizar
>   se hace grep del guion y del pie contra esta lista.
>
> 📋 **Cómo trabaja el carril Lucía (reglas de la madre, 3-oct).**
> 1. **Cada tarea arranca con tres cosas escritas en el transcript:**
>    - **META**: qué se hace;
>    - **PRUEBA DE HECHO**: qué se mira para darla por terminada;
>    - **REGLA DE PARADA**: cuándo se frena.
> 2. **Nada entra a `main` sin revisión: se trabaja en una rama y con un PR.** Antes, cada guion se compara con
>    `LUCIA.md` §0: IA declarada, nunca profesional de salud, sin promesas de resultado.
>    - Desde el 5-oct el hook Stop (`scripts/git-autosync.js`) ya no empuja la rama a `main`: solo la madre y el
>      integrador mueven `main` (CLAUDE.md, «Git — auto-sync»). Hasta ese día sí lo hacía, y por eso estaba el
>      truco de abajo.
>    - Para que el PR espere la revisión: pushear la rama, abrir el PR y **estacionar el checkout en `main`**
>      (`git checkout -B main origin/main`). Sigue sirviendo en la PC de la madre, que tiene el permiso.
>    - Medido el 3-oct: con `git reset --keep origin/main` sobre la rama del PR, esa rama queda adelante y atrás de su
>      remoto, y el hook Stop pide un push que GitHub rechaza.
>    - Así entró «Hoy soy odontóloga» (#82) el 2-oct.
> 3. **Tokens:**
>    - workflows de 5 agentes como máximo;
>    - nada de leer transcripts ni documentos enteros: se lee la sección que hace falta;
>    - effort bajo y modelo chico para lo mecánico.

1. **Clip LIMPIO** (el `rawUrl` del job de Higgsfield; nunca un render con texto) a `videos/lucia-lNN/raw/`.
   Lienzo 1080×1920 **a 24 fps** (Kling es 24: pasar a 30 duplica cuadros). Acento único **#10C26B**.
2. **Medir la cara en TODO el clip** (SCRFD de `scripts/face_identity_qa.py` o YuNet a 2 fps): texto solo entre
   **mentón máx + 40 px** y **y=1490** (debajo, Instagram tapa con pie, audio y botones; nada en los 80 px de la derecha
   bajo y=1000). Medido: L02 939–1490, L05 714–1490, L08 1168–1490. Es el split de Santiago **invertido**: la cara de
   Lucía está arriba, el panel va en la franja de abajo. Con franja < 520 px no se tapa ni se sube la cara: el panel
   se achica (subir 240 px a Lucía le corta la coronilla).
3. **Arranque en caliente:** primera palabra o tarjeta a ≤ 0,15 s; si el clip arranca con tiempo muerto se recorta
   (L08: −0,40 s). Nunca se acelera.
4. **Voz (si la pieza lleva):** ⚠️ **Marcela tiene acento COLOMBIANO** (medido el 2-oct con `GET /v1/voices/<id>` →
   `labels.accent: colombian`, «Marcela - Colombian Girl», de la Voice Library). Lucía es cruceña y el público boliviano
   critica el acento que no es de acá. Si se usa o no es la decisión D4 de `cola/lucia-diario/PLAN.md`; hasta que se
   resuelva, los reels van sin voz. Antes de elegir CUALQUIER voz se leen sus `labels`. Marcela con
   `scripts/tts-elevenlabs.mjs` **sin `--stability/--style`** (los settings
   forzados le cambian el timbre: rechazado el 21-ago y repetido por error el 1-oct). `--timestamps` → karaoke desde el
   guion autorado con tiempos exactos (gate de ortografía resuelto de raíz). La frase final va en toma aparte con
   `--previous-text` y 2–3 `--seed`; se elige la que **baja** al final (medir F0 de la última palabra con
   `librosa.pyin`: si sube, suena a pregunta — L08 «¿Vos no movés un dedo?»). Whisper siempre escribe «mueves»: no sirve
   para juzgar el voseo, sí para ver los signos de pregunta. `--cost` lee el cupo (payg 10.000).
5. **La prueba es pantalla REAL de Onia**, con recorte focal y crédito chico «pantalla real de Onia», en el segundo en
   que se nombra. Sin captura, un **diagrama del mecanismo** dibujado en código (no una UI falsa) y la captura entra
   en la versión siguiente. **Ninguna tarjeta repite lo que se oye** (Erik): aporta el dato derivado.
6. **Karaoke** `--style apple`, ≤ 3 palabras, 68 px, en la franja libre, con velo oscuro debajo si el fondo es claro
   (L08: blazer crema, luminancia p90 > 200). Se apaga mientras hay un panel de datos y en el remate (lo dice un sello).
7. **Sin voz:** ≤ 6 palabras por tarjeta y ≥ 0,35 s por palabra + 0,3 s de entrada (~2,5–3 palabras/s). Si no entra
   en el clip, se recorta texto (el resto va al pie), no se congela a la persona (no tiene antecedente).
8. **Sellos y golpes:** una palabra fuerte por reel como sello (130 % → 100 % en 3 cuadros, rotado ~5°, verde) con
   golpe de zoom +3 % durante 5 cuadros en ese mismo cuadro. Ken suave (≤ 1,04) solo en el remate. Nada de zoom
   decorativo: la fuente es 720p y ×1,5 ya ablanda.
9. **Apoyos clavados a la palabra** con `sync-plan.mjs --lead -0.15`; entrada 0,15 s, salida 0,22 s. Un evento
   visual cada 1,5–3 s.
10. **Audio:** con voz, −14 LUFS / −1,5 dBTP (`master.mjs`) y ≤ 1 SFX cada 2,5 s, cada uno con causa visible y
    ~10 dB bajo el pico de la voz. Sin voz, un pop por tarjeta y pico ≤ −3 dBTP (sin `loudnorm`: subiría los pops a
    nivel de voz). Música de cama: la pone Sergio Urcullo.
11. **Generaciones:** gen1 en UNA pasada (escala + zoompan + overlays + audio, CRF 14 slow) → karaoke
    `--crf 14 --preset slow` → `sfx.mjs` y `master.mjs` copian el video. Etiquetar bt709.
12. **QA mirado antes de entregar:** stills de cada entrada; hoja de cuadros con guías en el mentón y en 1490; caras
    con YuNet sobre crudo y final (la misma cantidad); ortografía leída en los cuadros; identidad ≥ 0,70 en 5 cuadros
    **frontales o de tres cuartos** (regla del gate en `LUCIA-HIGGSFIELD-IDENTITY.json`: perfiles y parpadeos bajan solos
    y se MIRAN; L02 dio 0,694 de perfil y 0,630 en un parpadeo con la misma cara — no es deriva);
    recorte 1:1 de la cara en el zoom máximo; specs. **Tabla de cortes + preview 360p a Sergio Urcullo** y esperar el OK.

**Trampas de la nube (1-oct):** playwright 1.62 pide Chromium 1234 y la nube trae el 1194 → `resolve-playwright.mjs`
cae a `/opt/pw-browsers/chromium`. Los SFX de HyperFrames no están versionados: `npm pack hyperframes` y copiar
`package/dist/skills/media-use/audio/assets/sfx/*.mp3` a `.agents/skills/media-use/audio/assets/sfx/` (ignorados en git).
Para ver referentes: `yt-dlp --impersonate chrome` baja de TikTok (Instagram 429, YouTube pide verificación).

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
| **Narración / voz** (Lucía = **Marcela**) | `scripts/tts-elevenlabs.mjs` (ElevenLabs `eleven_multilingual_v2`; `--timestamps`, `--previous-text`, `--seed`) | payg, 10.000 caracteres (medido 1-oct; `--cost` lo lee en vivo) |
| Subtítulos karaoke (word-level) | `scripts/karaoke-captions.mjs` (.ass + ffmpeg) | gratis (local) |
| Mockups / tarjetas de dato / marcos | `scripts/make-mockup.mjs` (HTML+CSS → PNG alpha) | gratis (local) |
| **Apoyo ANIMADO** (motor único: HyperFrames; `scripts/remotion/` es baseline histórico) | `scripts/hyperframes/render.mjs` | gratis (local) |
| **Timing de los apoyos por PALABRA** | `scripts/sync-plan.mjs` (storyboard en palabras → plan) | gratis (local) |
| **Zooms (punch-in por bloque / ken animado)** | `scripts/zoom-punch.mjs` | gratis (local) |
| Montar overlays con timing y fade | `scripts/overlay-visuals.mjs` | gratis (local) |
| **Pantalla verde (recorte + captura detrás)** | `scripts/fondo-verde.mjs` (`--chequeo` antes de renderizar) | gratis (local) |
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

## 🖼 Miniatura de YouTube — el frame se BUSCA, no se elige a ojo

Piezas: `videos/<proyecto>/scripts/buscar-cara.py` (puntúa) · `buscar-todos.py` (barre todo el
material) · `hoja-caras.py` (hoja de contactos) · `mini-capa.py` (fondo + sujeto con luz) +
un HTML para logos y titular. Todo local, costo cero, nada generado con IA.

### El método (4 pasos)

1. **Barrer TODO el material a cámara**, no solo el clip que se está editando. `buscar-todos.py`
   corrió sobre 19 archivos y puntuó **3.723 caras**; el mejor frame no estaba en el video
   editado sino en otra toma del mismo día — misma ropa, mismo set, sirve igual.
2. **Puntuar, no decidir.** Se miden cuatro cosas con YuNet (el ONNX que ya usa `blur-faces`):
   nitidez (varianza del laplaciano sobre la cara, descarta el motion blur), frontalidad (ojos
   a la misma altura, nariz centrada), sonrisa y boca cerrada.
3. **Hoja de contactos con dedup** (`hoja-caras.py`): un frame por MOMENTO. Sin dedup el top se
   llena de seis frames del mismo gesto separados por 0,1 s.
4. **Elige Sergio Urcullo mirando la hoja.** Es su cara: el score ordena, no decide.

### ⚠ El ancho de boca NO mide sonrisa: mide que está HABLANDO

El primer scoring usaba `ancho_boca / distancia_entre_ojos` y el top 12 salió **entero con la
boca abierta a media palabra**. En un video hablado casi todo el material es boca abierta; lo
escaso son las pausas. Con 5 landmarks lo que sí funciona:

- **sonrisa** = comisuras ELEVADAS respecto a la nariz (`-(y_comisuras - y_nariz) / dist_ojos`).
- **boca cerrada** = fracción de píxeles oscuros en el rectángulo de la boca. **Este es el peso
  fuerte** (0.62 contra 0.30 de la sonrisa): cerrar la boca importa más que estirarla.

### El fondo es el mismo frame — y eso es el arreglo del recorte, no decoración

`rembg` **no puede** separar una camiseta negra del respaldo NEGRO de una silla: probado con
`u2net_human_seg` y con `isnet-general-use`, los dos se la comen (`birefnet-portrait` pesa
973 MB, no vale la pena). Sobre un fondo plano ese error se ve como una mancha. Sobre su propia
imagen desenfocada, la silla del recorte cae encima de la silla del fondo y **desaparece**.
El sujeto se separa con **luz**, no con un borde duro: rim light, más brillo y más contraste
que el fondo. Es además la gramática de las miniaturas de referencia.

### Trampas medidas (todas costaron una iteración)

| Síntoma | Causa | Qué hacer |
|---|---|---|
| Borde blanco duro alrededor del pelo | un segundo glow casi blanco con blur 1.6 | un solo rim, naranja y con blur ≥ 9 |
| Franja clara siguiendo el contorno | el matte se lleva 10-15 px de pared | estirar el color del interior con blur normalizado; si no alcanza, **cambiar de frame** |
| Borde del pelo derretido | erosión del alpha a 7 px | máximo 4 px; erosionar más es peor que el problema |
| Cara borrosa, escala 1.89× | el encuadre se calculó con el ALTO de la cabeza, que se confunde con el cuello | medir el **ancho** de la cabeza (y en las primeras ~280 px desde la coronilla, no en las primeras 48) |
| Se ve otra persona en el fondo | blur 9 deja al propio sujeto reconocible | blur ≥ 30 |
| Borde recto en el brazo | corte del busto | desvanecer el alpha en el último 20 % |
| Piel plástica, con halos | CLAHE 1.7 + unsharp 118 % + brillo + contraste, acumulados | CLAHE ≤ 1.2 sobre la LUMINANCIA (en RGB vira la piel) y unsharp ≤ 75 % |

**Cambiar de frame sale más barato que pelear con la máscara.** Dos veces se fue por el camino
de los filtros y las dos veces el resultado fue peor que buscar otro frame.

### Verificación obligatoria

**Se mira a 210 px de ancho**, que es el tamaño real en el feed de YouTube — no a 1280. Ahí se
cae lo que a tamaño completo parecía aceptable: un halo, una etiqueta chica, un texto de más.
Tres palabras y nada más.

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
- **Encadenar los pasos como encodes SEPARADOS para el render final.** El pipeline se
  DESARROLLA por pasos (cut → zoom → apoyos, cada uno verificable), pero renderizar así
  apila generaciones y ablanda la cámara — pasó en el video 2 (0,78 Mbps) y OTRA VEZ en el
  video 3 (4 encodes → 5,5 Mbps; Sergio lo vio a ojo). Para el final: **una pasada por
  pieza** — select(corte) + zoompan(s) + overlays con fade en UN filter_complex, CRF 13
  preset slow, supersample ×2 — y la única segunda generación es el empalme (xfade). SFX,
  música y master copian el video. Builder de referencia probado:
  `videos/claude-code-03/scripts/una-pasada.mjs` (importa `zoomExpr`/`autoWindowsFromKeep`
  de `zoom-punch.mjs`; dos anchors = dos zoompan encadenados en el MISMO grafo).
  Medido: cámara 5,5 → 6,6 Mbps y la textura de piel volvió.
- **Correr `cut-plan.mjs` sin `--video`.** Mide el silencio en los huecos del transcript, que en
  un talking-head real son CERO: sale una cut-list que no corta nada y parece que "no había
  silencios". Si el panel está caído, el preview igual se genera local (`preview.mjs`).
- **Transcodificar el crudo del celular sin tone mapping.** Sale lavado y no se nota en los
  números, solo mirando. Y ojo: si sacás los frames de control del video YA convertido, estás
  comparando lo malo contra lo malo — el control se saca del ORIGINAL.
- **Publicar sin masterizar el audio.** Sale a −20 LUFS y en el feed suena bajo contra todo lo demás.
- **Cortar sin publicar la review + mostrar la tabla + preview** (viola la regla de oro). Correr
  `publish-cut-review.mjs` y esperar el OK de Sergio en el panel; el ffmpeg del corte va DESPUÉS.
- **Quemar texto sin leer el transcript a ojo** (viola la regla de oro de ortografía, §5b). El
  auto-transcriptor entrega español bien formado y MAL ESCRITO — así se publicaron `A GENERADO` y
  `ARANA` sin ñ. Y quemado no se parchea: se re-renderiza. Corregir en el transcript, no en la
  salida (`--fix` no persiste; en embed, arreglar solo el JSON autorado revienta el build).
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

## YouTube horizontal: reglas del plan de referentes (8-oct-2026)

Fuente: `references/marca-personal/PLAN-REFERENTES.md` §4. Se midió sobre el formato de Iman Gadzhi («Dame 26 minutos…»,
1,4 M de vistas); las fechas de sus videos no constan y los cortes salen de Gemini, sin medir.

1. **Cambiar de capa cada 3-7 s**: cámara, pantalla grabada o gráfico. Un sonido en cada cosa que aparece.
2. **Mapa de niveles o capítulos en pantalla antes de 1:15.**
3. **El CTA de la comunidad aparece 2 o 3 veces**: a ~1/3, a ~2/3 y al final. La asesoría gratis va solo en la descripción.
4. **Cada cifra dicha entra como tabla o contador**, con su cuenta a la vista.
5. El primer minuto es un **filtro de dolor**: «si te sirve pagar el doble por la misma tarea, no sigas». Caso: D01-C.

## Relacionadas
`ver-videos` · `embedded-captions` · `talking-head-recut` · `hyperframes-cli` · `media-use` · [[onia-video-hyperframes]] · [[content-engine-remotion]].

---

## 🎬 Moldes de pieza y costura entre generaciones (video-intake, commit 819c84b9)

**EL CORTE ENTRE GENERACIONES SE ESCONDE EN UN WHIP PAN.** Al montar variantes de un mismo plano,
la costura va tapada con movimiento de cámara — nunca con disolvencia ni corte seco. Literal del
corpus: *"Hay un barrido de cámara borroso justo donde cambia el material. No hay disolvencias, no
hay cortes secos visibles. Es la costura, y está tapada con movimiento."*
→ `transitions.mjs` cubre `fade/dissolve/wipe/slide`; para material GENERADO el whip pan es la
costura correcta y falta como plantilla de montaje.

**💸 `video_edit` factura por la duración del video FUENTE.** Verificado contra el catálogo el
2026-08-22: en `seedance_2_5` modo `video_edit`, `duration` y `aspect_ratio` se IGNORAN y se cobra
por lo que dura el material de ENTRADA. Consecuencia dura: **se filma CORTO** — tomas de 5-8 s que
se montan después. *"Un plano de 30 s cuesta cuatro veces uno de 8."*

**Reparto de segundos de un anuncio de 46 s, medido** (contraintuitivo, respetarlo):
gancho **2 s** · producto en estudio 7 s · persona hablando a cámara 8 s (la que trae la confianza)
· escenarios de uso · CTA. Taxonomía por bloque: Opening Hook · Product Information · Selling
Points · Real Experience · Usage Scenarios · Call to Action.

**Molde "anuncio sin cara", 7 beats en 33 s** — el hilo de color y el carrier element se definen
ANTES de escribir un solo prompt. Ya desarrollado para Onia en
`hermes-content/docs/historial/ONIA_GUION_ANUNCIO_SIN_CARA_20260820.md`. El gancho es MOVIMIENTO, no
información: plano parcial, contrapicado, objeto cruzando el cuadro en whip con motion blur.

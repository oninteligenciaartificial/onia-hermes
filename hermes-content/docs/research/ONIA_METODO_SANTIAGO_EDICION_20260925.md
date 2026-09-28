# Método Santiago de edición: qué es suyo, qué está construido y qué tiene que traer el guion

> **2026-09-25** · sesión CONTENIDO (guiones y estructura) · para Sergio Urcullo y para la sesión de
> EDICIÓN. Investigación de solo lectura sobre el repo. **Foto de un día:** el estado vivo de la
> edición manda en `.claude/skills/editor-videos/SKILL.md` y en
> `hermes-content/docs/handoff/EDICION-MARCA-PERSONAL-2026-09-21.md`.
> Lo que sale de **ramas sin integrar** se cita como texto con el nombre de la rama: **no está en
> `main`** y no se puede dar por vigente.

**Abreviaturas de las citas:**

| Abreviatura | Archivo |
|---|---|
| `ficha` | `hermes-content/references/video-intake/2026-09-17-reel-santiago-astra-davinci-estilo-edicion.md` (reel `DdE7wYbxjPK`) |
| `ficha-ago` | `hermes-content/references/video-intake/2026-08-28-pesos-algoritmo-x-codigo-publico.md` (reel `DcE8336Ixby`, @sanmunoz.ia) |
| `SKILL` | `.claude/skills/editor-videos/SKILL.md` (los scripts, en `.claude/skills/editor-videos/scripts/`) |
| `Manual` | `hermes-content/docs/ONIA_MANUAL_DE_FORMATOS_20260813.md` |
| `RODAJE` | `hermes-content/docs/cola/GUIONES-RODAJE-17-20-SEP.md` |
| `handoff-edición` | `hermes-content/docs/handoff/EDICION-MARCA-PERSONAL-2026-09-21.md` |
| `tiktok` | `videos/tiktok-20260917/` |
| `codex:` | rama `codex/marca-comunidad-plan` (sin integrar) |

## Cobertura y límites

- **Revisado en el checkout:** la skill `editor-videos` completa (SKILL, 25 scripts, assets y SFX);
  `ver-videos/SKILL.md`; las skills de `.agents/` que tocan el tema (`embedded-captions` §2b,
  `captions-overlay`, `oversized-cursor`); los 4 proyectos de `videos/`; `scripts/hyperframes/`; las
  guías de `hermes-content/docs/cola/` del 09 al 21-sep; los handoffs de edición;
  `VIRAL_VIDEO_PLAYBOOK`, el `Manual`, `ONIA_PLANTILLAS_PROMPT_VIDEO_20260818`,
  `video-ad-primeros-3-segundos`, `DESIGN_STACK`, `PARA-PUBLICAR-APPLE-REPOS`, el molde M02 y la
  síntesis del lote 18.
- **Ramas** que la investigación de base comparó archivo por archivo (acá solo se citan):
  `claude/estilo-edicion-reel-astra`, `claude/video-editing-silence-removal-073acb`,
  `claude/rescate-fix-karaoke`, `claude/analizar-reels-videos-67f762`, `codex/marca-comunidad-plan` y
  `codex/samuel-grabaciones-20260921`.
- **No se renderizó nada:** el sandbox no tiene `ffmpeg`. Los tests unitarios de la skill sí se
  corrieron: **65/65** (`cut-plan`, `sync-plan`, `zoom-punch`, `normalize-source`,
  `illustration-style`).
- **El clon es parcial y la historia de `main` fue reescrita** (primera raíz `f7bcc9d7`, 21-sep):
  varias ramas viejas no comparten merge-base con `main`.
- **La ficha del reel** se hizo con Gemini (`gemini-flash-lite-latest`) + 8 fotogramas leídos con
  visión (`ficha:5-6`). Sus cifras de cortes **son estimación, no medición**.
- **Los perfiles de Santiago Muñoz no se pudieron ver** (Instagram y YouTube bloqueados por la red
  de la sesión): el tutorial de 28 min no se miró. Contexto de él como referente:
  `ONIA_REFERENTES_ROCHA_TAVERAS_MUNOZ_20260925.md` (esta carpeta).

---

## Resumen

1. En el repo, **"método Santiago" no es una sola cosa.** Junta tres fuentes suyas con fechas
   distintas —el **tutorial de 28 min** (jul-2026, sin transcripción ni ficha), el **reel
   `DdE7wYbxjPK`** (ficha del 17-sep) y el **reel `DcE8336Ixby`** (ficha del 28-ago, atribución
   probable)— más técnicas de **otros autores** archivadas bajo su nombre (@human___academy y la
   sesión «edicion» de Codex).
2. **Lo central está construido y funciona:** layout partido (cabeza abajo, apoyo arriba que rota),
   karaoke, corte, zooms, SFX y master. **Falta:** la ecuación de logos, el zoom animado al cursor,
   el CTA con desenfoque total, la mini-etiqueta cian y la herramienta que convierte la palabra del
   guion en el apoyo de la pantalla partida (`cue → supports[]`).
3. **Contradicciones abiertas:** cuatro estilos de subtítulo, cuatro proporciones de pantalla
   partida, seis cadencias de cambio de plano, tres criterios de transición, música sí/no y dos
   especificaciones de cursor y fps (§4).
4. **La edición depende de cuatro cosas que tiene que traer el guion:** el **cue** con las palabras
   literales que se van a decir; **una captura por beat con su región focal**; **la cámara grabada
   como toma aparte**, a cuadro completo; y **un documento de instrucción completo** (OBJETIVO /
   MATERIAL / ESTILO).
5. **La plantilla está en el §6.** Cada columna es la entrada de una herramienta que ya existe.

---

## 1. Atribución: qué es de Santiago Muñoz y qué no

### 1.1 Lo que es de Santiago

| Fecha | Fuente | Qué aporta | Evidencia |
|---|---|---|---|
| 2026-07-23 (fecha del commit) | **Tutorial de Santiago, 28 min** (YouTube) | Editar con código; **regla de oro**: tabla de cortes + preview antes de cortar; primer estilo de subtítulo | `SKILL:17` ("método del tutorial de Santiago"), `SKILL:39-46`; commit fundador `20569df4` |
| 2026-07-24 | El mismo tutorial, visto por Gemini | "vio el tutorial de Santiago (28 min) entero por URL de YouTube con timestamps" | `.claude/skills/ver-videos/SKILL.md:33`; commit `547b0cd8` |
| 2026-07-23 | Estilo de subtítulo v1, sacado del tutorial | *"Estilo Santiago: MAYÚSCULAS, Space Grotesk Bold, highlight naranja `#FF7A00`"* | versión fundadora de `SKILL:46-47` (commit `20569df4`); ya no está en `main` |
| 2026-07-25 | "El método de mockups de Santiago" | Apoyos en HTML/CSS → PNG con alpha, pegados después con timing | `make-mockup.mjs:3-7`, `:77` (`#FF7A00 // naranja estilo Santiago`); `overlay-visuals.mjs:3`; `scripts/remotion/src/lib/tokens.ts:5`; commit `2c5fe05f` |
| 2026-08-28 | **Reel `DcE8336Ixby`** de @sanmunoz.ia (74,6 s) | Tres registros alternados, karaoke palabra por palabra con keyword naranja, lámina de transición | `ficha-ago:3-6`, `:38` |
| 2026-09-17 | **Reel `DdE7wYbxjPK`** (92,8 s) | Layout "tutorial vertical partido" (ficha completa) | `ficha`; commits `5374534b`, `3244bd6d` |
| 2026-09-18 | Auditoría "contra el stack de Santiago Muñoz" | Qué se usa de forma fiel y qué es deuda (DaVinci por MCP, una instrucción completa por video, inventario del material) | `SKILL:101-117`; commit `21b14930` |

**Qué tutorial es.** El repo no guarda su URL ni su transcripción. La investigación de referentes lo
identifica, con alta probabilidad, con *"Despedí a mi editor y contraté a Claude Code"*
(youtube.com/watch?v=QRhX4zU1jso, publicado el 14-jul-2026, con links a Skool y horizontesia;
fragmento del buscador): coincide en tema, fecha y en que el repo `santmun/video-vox` salió el mismo
día. La duración de 28 min **no se pudo verificar** (YouTube bloqueado).

**Quién es @sanmunoz.ia.** El repo nunca escribe que @sanmunoz.ia sea Santiago Muñoz: la firma
aparece solo en `ficha-ago:3`. La investigación de referentes lo sostiene con evidencia externa: el
handle @sanmunoz.ia en IG y TikTok con nombre "santimunoz.ia", su comunidad Horizontes IA y el repo
`santmun/mega-editor-davinci` publicado el 9-sep, el mismo día que el reel `DdE7wYbxjPK`.
**Atribución: alta probabilidad, no vista con los ojos.** La certeza la da Sergio Urcullo, que eligió
la referencia.

**Él mismo varía de reel en reel.** El de agosto usa **naranja y karaoke palabra por palabra**; el de
septiembre (Astra) usa **amarillo y frase por frase**. El naranja del tutorial (`#FF7A00`) y el del
reel de agosto (`#FF6B2C`) son prácticamente el mismo; el `keyword.html` de ONIA subraya en `#FF6A2B`
(`tiktok/scripts/keyword.html:12`).

### 1.2 Lo que NO es de Santiago y quedó archivado con su nombre

- **"La narración es la timeline"** (cada palabra dispara un elemento; entra uno nuevo cada 1,2-1,8
  s; vocabulario Keyword/Trazo/Tag/Escena/Lista): es de **@human___academy** (reel `DbTxeqsBWST`,
  27-jul; `SKILL:27-37`, `:291-296`; `sync-plan.mjs:1-5`). La auditoría del 18-sep la llama "fiel a
  Santiago" (`SKILL:105`): **atribución mezclada**.
- **Cara a ancho completo abajo + mockup arriba + transiciones laterales + subtítulos ASS:** es la
  receta de la **sesión «edicion» de Codex** (14-sep, reel Fable vs Astra; `RODAJE:25-39`). Su
  `edit.py` vive en una carpeta de descargas de Windows, **fuera del repo** (`RODAJE:38`).
- **Miniaturas:** la gramática es de Adrián Sáenz (`videos/claude-vs-claudecode/README.md:115`).
- **"Demo completa, encuentro, hot seat, recurso y acompañamiento":** mecanismo **de comunidad, no de
  edición**, que la rama `codex/marca-comunidad-plan` le atribuye a Santiago
  (`codex:hermes-content/docs/cola/PLAN-CONTENIDO-23-27-SEP-2026.md:9`).

---

## 2. El método destilado

Leyenda: **[S-reel]** reel `DdE7wYbxjPK` · **[S-ago]** reel `DcE8336Ixby` · **[S-tut]** tutorial de
28 min · **[ONIA]** cómo lo implementamos · **[otro]** autor distinto.

### 2.1 Gancho

- **[S-reel]** La ficha **no describe los primeros 3 s**: solo cuenta el contenido (*"reemplazó a su
  editor con 'GPT-6 Astra' + el MCP de DaVinci Resolve"*) y el caption, que es solo el CTA: *«Comenta
  "Astra" para el tutorial completo»* (`ficha:7-9`). **Es un hueco.**
- **[ONIA] Reglas de la casa que aplican:**
  - `0-3 s GANCHO una frase. Sin "hola", sin "hoy les traigo"` (`RODAJE:16`).
  - *"Nadie saluda. Segundo 0 = una frase que ya está en marcha, la afirmación más rara, o el número
    más grande"* (`Manual:1050-1052`).
  - *"La promesa o la tensión va en el segundo 1"* (`hermes-content/references/moldes-video/M02-marca-personal.md:37`).
- **[otro, ads]** *"el plano NO corta durante el gancho… Lo que se mueve en los primeros segundos…
  es el texto en pantalla"* (`hermes-content/references/tendencias/video-ad-primeros-3-segundos.md:10-13`).
  Choca con los jump cuts cada ~2 s de Santiago (§4.3).

### 2.2 Ritmo de cortes

- **[S-reel]** *"~25-30 [cortes] en 92 s; planos de 1,5-3 s hablando, ráfagas de ~1 s en b-roll"*
  (`ficha:21`); *"Jump cuts: constantes en la cabeza (silencios/respiraciones fuera)"* (`ficha:22`);
  receta: *"corte cada ~2 s en la toma principal"* (`ficha:39`); la zona de apoyo *"rota cada 1-3 s"*
  (`ficha:35`).
- **[S-ago]** 5 cortes en 74,6 s, medidos con `ffmpeg` y umbral de escena 0,3 (`ficha-ago:5-6`). Un
  detector de escena con ese umbral **no cuenta los jump cuts dentro del mismo encuadre**: no se lee
  como "casi sin cortes". Las dos cifras salen de instrumentos distintos y **no son comparables**.
- **[ONIA]** Silencios ≥ 0,45 s con `silencedetect` (`SKILL:132-139`). En un screencast con cursor se
  usa `--min-sil 0.6`: con 0,45 salían 102 costuras en 8 min (`videos/claude-vs-claudecode/README.md:69-74`).
  En el lote de TikTok: silencios ≥ 0,4 s + muletillas "por energía" (`tiktok/README.md:13-14`). El
  `Manual` pide corte cada ~2 s en acción (`Manual:1070-1071`).

### 2.3 Subtítulos

- **[S-reel]** *"zona baja del segmento de cabeza; sans gruesa BLANCA con sombra; 2-5 palabras por
  vez; keyword resaltada en AMARILLO"* (`ficha:24`), con *"sincronía frase-por-frase (no karaoke
  palabra-por-palabra estricto)"* (`ficha:38`).
- **[S-ago]** karaoke **palabra por palabra en blanco**, palabras clave en **naranja `#FF6B2C`**
  (`ficha-ago:38`).
- **[S-tut, v1]** *"MAYÚSCULAS, Space Grotesk Bold, highlight naranja #FF7A00"* (versión fundadora
  de `SKILL:46-47`).
- **[ONIA, vigente]** `karaoke-captions.mjs`:
  - **Fuente:** Bricolage Grotesque Bold 700 (`:58-64`); en mayúsculas por defecto (`:66`).
  - **Tamaño:** 0,042 × alto = 81 px en 1920 (`:115-119`).
  - **Agrupación:** ≤ 4 palabras / 1,6 s (`:49-50`). **Posición:** MarginV 220, para no tapar la cara
    (`:52`).
  - **Colores:** base blanca, palabra activa **verde de marca `#10C26B`** (Sergio Urcullo, 22-ago:
    *"que sea verde por Onia"*; `:92-101`).
  - **`--style apple`:** sin outline y con sombra difusa `{\blur7}` (Sergio Urcullo, 17-sep: *"apple
    style, sin bordeado negro"*; `SKILL:328-335`).
  - **Amarillo** `--active-color "#FFE600"`: solo *"para imitar 1:1 el reel de referencia"*
    (`SKILL:334-335`).
  - **En pantalla partida:** `--words-per-line 3 --font-size 68 --margin-v 60` (`tiktok/README.md:21-22`).
- **Keyword grande aparte del rail:** *"El karaoke es el rail; lo IMPORTANTE se resalta ADEMÁS con
  keyword grande en pantalla (blanca 900 + subrayado naranja)"* (`SKILL:93-94`). Implementada en
  `tiktok/scripts/keyword.html:3-12` (Inter 900, 110 px, raya `#FF6A2B`).
- **Gate obligatorio:** nada se quema sin leer el transcript a ojo, en este orden: ñ, tildes, a/ha,
  nombres propios (`SKILL:47-81`, `:166-177`).

### 2.4 Zooms

- **[S-reel]** *"cero movimiento real; punch-ins digitales sutiles para énfasis"* (`ficha:23`) y
  *"crash zooms ocasionales entre pantalla y cara"* (`ficha:30`).
- **[ONIA]** `zoom-punch.mjs`:
  - **punch:** un escalón por bloque del corte, niveles por defecto `[1, 1.08, 1.04, 1.12]` (`:64`);
    en los TikTok, `[1, 1.06, 1.03, 1.09]` con ancla `top` (`tiktok/scripts/tiktok-build.mjs:23`).
  - **ken:** animado con smoothstep, para el remate.
  - Máximo 2,0× (`:27`). Anclas fijas `center|top|bottom|left|right|top-left` (`:30`); una sola ancla
    por pasada (`:188`).
  - El zoom va **antes** de los apoyos y los subtítulos (`SKILL:239-240`, `:286-289`).
  - Regla del 18-sep: *"zooms SOLO funcionales"* (`videos/claude-code-03/README.md:5`).

### 2.5 Cómo muestra la pantalla

- **[S-reel]** La zona de apoyo muestra *"screencast del timeline de DaVinci, chat del agente (Claude
  Code / interfaz tipo Cursor), PCBs 3D de stock, arte full-bleed de marca (shader de Claude Code con
  su logo), fotos"* (`ficha:14-17`). Receta 4: *"Screencast con zoom focal: al mostrar software, zoom
  digital directo a la línea/botón que importa"* (`ficha:40-41`).
- **[S-ago]** tarjetas de UI oscuras flotando junto a la cara; grafo de nodos naranja sobre negro a
  pantalla completa; split con la tabla arriba y la cara abajo (`ficha-ago:38`). La ficha propone
  llevar "tarjeta de UI flotando junto a la cara" al banco de motion (`ficha-ago:40`); con ese nombre
  no está implementada (se puede armar con `make-mockup` + `overlay-visuals`).
- **[ONIA]** `split-layout.mjs` hace el "zoom focal" como **recorte estático** del fuente
  (`crop:{x,y,w,h}`, `:24-31`, `:132`), con ajuste `cover`/`contain` y bandas de tinta `#0A0F0D`
  (`:60`, `:133-140`). Donde no hay apoyo, arriba va la propia cabeza desenfocada y oscurecida
  (`:110-116`). **No hay zoom animado ni seguimiento del cursor.** Pantallas completas y mockups con
  contenido real: `tiktok/scripts/fullscreen.html`, `mockup-browser.html`, `mk-term.html`,
  `card-dark.html`. El marco para una captura real con etiqueta (`assets/html/captura-apoyo.html`)
  **solo existe en la rama `claude/rescate-fix-karaoke`**.

### 2.6 B-roll

- **[S-reel]** *"B-roll relámpago: cada herramienta nombrada = su visual (logo full-bleed, mockup,
  stock 3D) máx 1-1,5 s"* (`ficha:42-43`); *"reusa clips de SUS videos anteriores ya subtitulados"*
  (`ficha:27`); *"secuencias con ken burns lento"* (`ficha:28`).
- **[ONIA]** Mención hablada de una marca → **su logo ORIGINAL** en pantalla, nunca recreado
  (`SKILL:95-99`). Sergio Urcullo no tiene banco de b-roll propio (`M02-marca-personal.md:44-49`). La
  rama Codex propone 12 tomas de b-roll que se graban una sola vez
  (`codex:hermes-content/docs/cola/GUIONES-DIA-2026-09-22.md:58-71`).

### 2.7 SFX y música

- **[S-reel]** *"música tech sutil constante + whooshes en cambios de plano + pops al resaltar texto;
  ducking leve"* (`ficha:29`).
- **[ONIA]** Sin música de cama: la pone Sergio Urcullo (`SKILL:92`). Pop en overlays y whoosh en
  cambios de apoyo (`tiktok/README.md:23`), aplicado así en `tiktok/scripts/IMG_4607-sfx.json`.
  `sfx.mjs` baja la voz ~5 dB (`:66`). Los `.mp3` de la librería HyperFrames **no están
  versionados**: se usan 5 `.wav` sintetizados (`assets/sfx/`).

### 2.8 Transiciones

- **[S-reel]** *"hard cuts casi siempre; crash zooms ocasionales"* (`ficha:30`).
- **[S-ago]** una lámina blanca con manchas difusas azul y naranja (`ficha-ago:38`).
- **[ONIA]** `transitions.mjs`: fade por defecto, 200-400 ms; `circleopen` solo para el CTA
  (`SKILL:446-458`). El `Manual` manda corte seco y dice que `transitions.mjs` **no se usa**
  (`Manual:1070-1073`). Codex usó transiciones laterales suaves (`RODAJE:34`).

### 2.9 Color

- **[S-reel]** No documentado: ni gradación, ni LUT, ni paleta; solo los colores de los textos
  (amarillo en la keyword, cian en las mini-etiquetas; `ficha:24-25`). **Es un hueco.**
- **[S-ago]** *"El naranja es el único color saturado y sólo toca los datos"* (`ficha-ago:38`).
- **[ONIA]** Se normaliza el HDR del iPhone (HLG → bt709 con tonemap hable); sin ese paso el video
  sale lavado (`SKILL:119-126`).

### 2.10 Rótulos, ecuación de logos y CTA

- **Rótulos [S-reel]:** *"mini-etiqueta CIAN uppercase arriba-izquierda ('4 VIDEOS TERMINADOS') y
  título blanco bold ('PREPARANDO DAVINCI', 'ASTRA 6')"* (`ficha:25`).
- **Ecuación de logos [S-reel]:** *"ChatGPT + DaVinci = monedas 💰 (entra con pop)"* (`ficha:26`,
  `:44`). **No está implementada** (`SKILL:336-337`).
- **CTA [S-reel]:** *"fondo = b-roll TOTALMENTE desenfocado + texto centrado estático; keyword
  'Astra' en amarillo entre comillas"* (`ficha:31`, `:45`).

### 2.11 Duración y densidad

- **[S-reel]** 92,8 s (`ficha:3`). **[S-ago]** 74,6 s.
- **[ONIA]** Cortos de 30-35 s con estructura fija (`RODAJE:13-19`); largos hablados de 60-90 s,
  unas 200 palabras (`RODAJE:336-345`); densidad de 15 s → 35-45 palabras, 30 s → 75-90, 45 s →
  110-130 (`hermes-content/docs/VIRAL_VIDEO_PLAYBOOK.md:162-168`); *"3,2-3,5 palabras por segundo"*
  (`Manual:1078-1079`); el handoff de edición del 21-sep pide 30-40 s (`handoff-edición:24`).

### 2.12 Estructura del guion y proceso

- **[S-reel, visto en su pantalla]** *"'UNA instrucción completa' por video (doc OBJETIVO / MATERIAL
  / ESTILO visible en su pantalla)"* (`SKILL:112-114`) e *"Inventario del material como artefacto
  (su CSV de crudos + hallazgos.md + plan)"* (`SKILL:115-117`). **Ninguna de las dos está
  implementada en ONIA:** *"nosotros editamos a pedidos sueltos → el 'dejás a medias'"*.
- **[S-tut] Regla de oro:** tabla `# | Me quedo con | Tiro | Por qué` + preview en 360p, **antes**
  de cortar (`SKILL:39-46`). Es regla de `CLAUDE.md`.
- **[ONIA] Formato de rodaje vigente:**
  - `HABLA / EN PANTALLA / OVERLAY` segundo a segundo (regla del 12-sep,
    `hermes-content/docs/cola/PLAN-VIDEOS-11-20-SEP.md:112-116`; ejemplo en `RODAJE:69-75`).
  - Marcas `[EDICIÓN: ...]` separadas del habla (`RODAJE:338-343`).
  - Estructura `0-3 gancho · 3-25 lo concreto con pantalla real · 25-35 cierre con UN recurso`
    (`RODAJE:13-19`).
  - Sergio Urcullo graba solo cara a cámara; las pantallas y las pruebas las pone la edición sobre
    su voz (`RODAJE:338-339`).

---

## 3. Qué está construido, dónde y en qué estado

| Pieza | Archivo | Dónde | Estado | Evidencia |
|---|---|---|---|---|
| Normalizar el crudo (HDR → SDR) | `normalize-source.mjs` | main | **Funciona** | `SKILL:119-126`; test en verde |
| Transcripción con tiempos por palabra | `ver-videos/scripts/transcribe.sh` (Speaches) | main | **Dudosa** | *"Speaches devolvio `fetch failed` para los 26 videos"* (`hermes-content/docs/handoff/claude-analizar-reels-videos-67f762.md:122-123`). Alternativa usada: `videos/claude-vs-claudecode/scripts/transcribe_local.py` (faster-whisper local) |
| Lista de cortes (silencio + muletilla textual + trabada) | `cut-plan.mjs` | main | **Funciona, con límites** | Tests en verde. **No detecta** retomas cuyo texto difiere (`videos/claude-vs-claudecode/README.md:54-57`) ni muletillas sin palabra, que se hicieron "por energía" **sin script versionado** (`hermes-content/docs/cola/GUIONES-TANDA-2-18-SEP.md:105-110`; `tiktok/README.md:13-14`) |
| Preview 360p + tira de costuras | `preview.mjs` | main | **Funciona** | `SKILL:140-147` |
| Revisión del corte en el panel / render aprobado | `publish-cut-review.mjs`, `render-approved.mjs` | main | **Solo dry-run** (imprime SQL); depende del panel | `SKILL:148-165` |
| Karaoke (`--style apple`, verde) | `karaoke-captions.mjs` | main | **Funciona**; usado en los 4 TikTok | `tiktok/README.md:21-22` |
| **Layout partido (Santiago)** | `split-layout.mjs` | main (idéntico en las ramas astra y codex) | **Funciona**, probado con material real; **sin test** | commit `3244bd6d`; usado en el TikTok 04 (`tiktok/scripts/IMG_4607-split.json`) |
| Zooms punch/ken | `zoom-punch.mjs` | main | **Funciona**; anclas fijas, sin foco (x,y) libre | tests en verde; `:30`, `:188` |
| Palabra → elemento | `sync-plan.mjs` | main | **Funciona** para overlays; **no genera `supports[]`** para `split-layout` | tests en verde; `:268` |
| Mockups PNG / overlays con fade | `make-mockup.mjs`, `overlay-visuals.mjs` | main | **Funcionan** | `SKILL:184-205` |
| Composiciones HyperFrames (Keyword, Trazo, Tag, Escena, Lista, Stat, Browser, Phone, Quote, LowerThird, Scoreboard, TarjetasUI) | `scripts/hyperframes/render.mjs` + `compositions/*` | main | **Funcionan** según la skill (*"pasan `hyperframes check`"*) | `render.mjs:55-71`; `SKILL:306` |
| SFX con ducking | `sfx.mjs` + `assets/sfx/*.wav` | main | **Funciona con los wav locales**; los cues de la librería fallan (faltan los mp3) | `Manual:1106` |
| Transiciones | `transitions.mjs` | main | Funciona; **el `Manual` prohíbe usarla** | `Manual:1070-1073` |
| Master −14 LUFS | `master.mjs` | main | **Funciona** | `SKILL:278-284` |
| Render en una pasada por pieza | `videos/claude-code-03/scripts/una-pasada.mjs`, `tiktok/scripts/tiktok-build.mjs` | main | **No portable:** rutas absolutas de Windows a un worktree y a un scratchpad de otra sesión | `una-pasada.mjs:7-9`; `tiktok-build.mjs:5-7`; `IMG_4607-split.json:4` |
| Plantillas de tarjeta TikTok | `tiktok/scripts/*.html` | main | PNG renderizados versionados; **falta `fonts/`** (Inter, Spline Sans Mono): re-renderizar exige las fuentes | la carpeta `tiktok/scripts/fonts` no existe |
| Receta Codex `edit.py` (cara abajo, mockup arriba) | carpeta de descargas de Windows | **fuera del repo** | No reproducible desde el repo | `RODAJE:38` |
| Grabador de pantalla con cursor inyectado | `scripts/marca-personal/screencast-session.cjs` (+ `grabar-*.cjs`) | **solo rama `codex/samuel-grabaciones-20260921`** | Funcionó (7 clips 1440×900 a 30 fps); rutas de Windows | `screencast-session.cjs:26-34`, `:53-83`, `:236-244`; `handoff/grabaciones-samuel.md:20-22` (misma rama) |
| `capture-web.mjs`, `film-pattern.mjs`, `_reel.html` | especificados en el `Manual` §7 | ninguna | **No existen** | `Manual:1115` |
| Marco para captura real con etiqueta | `assets/html/captura-apoyo.html` | **solo rama `claude/rescate-fix-karaoke`** | Existe allí, no en `main` | — |
| Ecuación de logos · CTA con desenfoque total · mini-etiqueta cian · zoom al cursor · DaVinci por MCP | — | — | **No implementados** | `SKILL:109-111`, `:336-337` |

**Qué traen las ramas respecto de `main`** (según la comparación de la investigación de base):

- `claude/estilo-edicion-reel-astra` (último commit 18-sep): su trabajo de video ya está en `main`
  con blobs idénticos (`split-layout`, ficha, `videos/tiktok-20260917`, `claude-code-03`,
  `GUIONES-TANDA-2`); difiere en una línea de `videos/claude-code-03/CAPTION-YOUTUBE.md`.
- `claude/video-editing-silence-removal-073acb`, `claude/rescate-fix-karaoke` y
  `claude/analizar-reels-videos-67f762`: sin merge-base con `main` y **más viejas**. Lo único que no
  está en `main`: `captura-apoyo.html` y un comentario sobre el CRF del karaoke (*"16.9 Mbps después
  del corte → 5.4 Mbps después de quemar"*), ambos en rescate. El karaoke de esas ramas todavía es
  amarillo con Arial Black.
- `codex/marca-comunidad-plan` (3 commits sin mergear, 21-22 sep): `PAQUETE-GRABACION-2026-09-22.md`,
  `PLAN-CONTENIDO-23-27-SEP-2026.md`, `GUIONES-DIA-2026-09-22.md`,
  `yt/GRABACION_YOUTUBE_2026-09-22.md`, `MARCA_PERSONAL_OPERACION_DIARIA.md`, referencias a los tres
  referentes con URL, capturas y decks.
- `codex/samuel-grabaciones-20260921`: el tooling de screencast.

---

## 4. Contradicciones y huecos

### 4.1 Cuatro estilos de subtítulo

1. naranja `#FF7A00` con Space Grotesk (v1, versión fundadora de `SKILL:46-47`);
2. amarillo con Arial Black: **el paso 6 del SKILL vigente todavía lo dice** (`SKILL:178-181`),
   desactualizado frente al script;
3. verde `#10C26B` con Bricolage (`karaoke-captions.mjs:58`, `:92-101`): **el vigente**;
4. "frase hero en amarillo" (`codex:GUIONES-DIA-2026-09-22.md:53`).

Además, Santiago usa amarillo frase por frase en el reel Astra (`ficha:24`, `:38`) y naranja palabra
por palabra en el de agosto (`ficha-ago:38`); ONIA usa karaoke palabra por palabra.

Relacionado: **la keyword grande sale del sistema de marca**. Es "blanca 900 + subrayado naranja"
(`SKILL:93-94`; `keyword.html` en Inter 900 con `#FF6A2B`), pero el tope de Bricolage es 700 (*"El
800 está prohibido"*, `scripts/hyperframes/README.md:101`). Circulan tres verdes (`#10C26B`,
`#00D26A`, `#027650`; `web-factory/docs/ONIA_BRAND_IDENTITY_2026.md:39-45`) y dos display (Space
Grotesk en `hermes-content/brand/ONIA_BRAND_IDENTITY.md:55`, Bricolage en el karaoke).

### 4.2 Proporción de la pantalla partida

- 55 arriba / 45 abajo en la ficha y en el default del script (`ficha:13`, `split-layout.mjs:56`);
- 45/55 en el TikTok 04 real (`tiktok/README.md:16`, overlays en `y=864`);
- pantalla 60 / cara 40 (`codex:PAQUETE-GRABACION-2026-09-22.md:107`);
- overlay de 55-70 % del ancho sobre la cara (`codex:GUIONES-DIA-2026-09-22.md:50`).

### 4.3 Cadencia

- apoyo cada 1-3 s y corte cada ~2 s (`ficha:35`, `:39`);
- elemento nuevo cada 1,2-1,8 s (`SKILL:294`);
- visual distinto cada 3-5 s (`VIRAL_VIDEO_PLAYBOOK.md:159`);
- estímulo cada 4-7 s (`codex:GUIONES-DIA-2026-09-22.md:54`);
- *"El corte cada 4-8 s… no aparece en ningún reel que funciona"* (`hermes-content/references/video-intake/2026-08-23-sintesis-lote-18.md:109`);
- en los ads, sin corte durante el gancho (`video-ad-primeros-3-segundos.md:10-13`).

En la práctica, **el TikTok 04 sostuvo capturas durante 14-16 s** (`IMG_4607-split.json`: 0 → 14,33
y 25,81 → 41,6): **no respeta la rotación de 1-3 s**.

### 4.4 Transiciones

Santiago usa corte seco (y una lámina en el reel de agosto); `transitions.mjs` hace fade por defecto;
el `Manual` prohíbe usarla; Codex usó transiciones laterales (§2.8).

### 4.5 Música

Santiago tiene música constante (`ficha:29`); ONIA la deja fuera (`SKILL:92`). Pero las configs del
lote traen `"pad_gain": 0.05` (`tiktok/scripts/IMG_4572-config.json:52`) y `claude-vs-claudecode`
usó un pad sintetizado (`videos/claude-vs-claudecode/README.md:27-42`).

### 4.6 Cursor y fps

El grabador Codex inyecta un **punto de 24 px** (`screencast-session.cjs:64`, rama
`codex/samuel-grabaciones-20260921`); la doctrina de la casa es un **cursor grande estilo macOS de
7cqw** (≈76 px en 1080) que **entra desde fuera del cuadro** (`Manual:245-247`;
`.agents/skills/oversized-cursor/SKILL.md:22`, `:43-44`). Y el grabador graba a **30 fps**, contra
**60 fps** recomendados para interfaces que animan, entregando a 30 en el master (`Manual:201-202`).

### 4.7 Otros huecos

1. **Atribución mezclada:** la auditoría llama "fiel a Santiago" a la narración como timeline
   (`SKILL:105`), cuya fuente es @human___academy (`sync-plan.mjs:1-5`). El tutorial de 28 min **no
   tiene transcripción ni ficha en el repo**.
2. **La ficha del reel no cubre** gancho, gradación de color, tipografía exacta ni cortes medidos.
3. **Etiquetas en pantalla que no coinciden:** el guion del 21-sep termina con `ENTRADA → VALIDACIÓN →
   REGISTRO → AVISO` (`hermes-content/docs/cola/GUIONES-DIA-2026-09-21.md:141`), su tabla de
   producción dice `ENTRADA / REGLA / SALIDA` (`:32`), y el handoff pide las cuatro de arriba
   (`handoff-edición:28`) y, en su QA, `ENTRADA → REGLA → SALIDA` (`handoff-edición:63`). Es justo la
   ambigüedad que la columna TEXTO EN PANTALLA de la plantilla tiene que cerrar.
4. **Subtítulos, tres criterios de ubicación:** `captions-overlay` prohíbe reservar una banda
   inferior (`.agents/skills/captions-overlay/SKILL.md:47-57`); el handoff pide rail lateral o
   espacio libre (`handoff-edición:29-30`); la skill reserva `bottom` para el karaoke y manda los
   apoyos a `top`/`center` (`SKILL:495-497`).
5. **Mockups contra prueba real:** se piden *"pantallas completas con contenido REAL · mockups"*
   (`tiktok/README.md:17-18`), pero *"No se dibuja una interfaz que no se miró"*
   (`hermes-content/docs/SERIE_CLAUDE_CODE.md:171-172`) y `CLAUDE.md` prohíbe los mockups
   decorativos en la pauta de software.
6. **Falta la herramienta `cue → supports[]`:** `sync-plan` solo emite `overlays[]`
   (`sync-plan.mjs:268`); en la pantalla partida, los tiempos de los apoyos se ponen a mano.
7. **Muletillas "por energía" sin script** (`tiktok/README.md:13-14`).
   `.agents/skills/embedded-captions/scripts/audio-envelope.cjs` ya mide RMS y podría ser la base.
8. **Tooling no portable o fuera del repo:** `una-pasada.mjs` y `tiktok-build.mjs` con rutas fijas de
   Windows; las capturas del `IMG_4607` en un scratchpad de Windows; faltan las fuentes de las
   plantillas TikTok; `edit.py` de Codex fuera del repo; `screencast-session.cjs` solo en una rama
   Codex; `capture-web.mjs`, `film-pattern.mjs` y `_reel.html` no existen (`Manual:1115`).
9. **SFX:** el README de SFX dice "3 placeholders" y hay 5 wav (`assets/sfx/README.md:5-7`); los
   planes usan `"gain": 0.5-0.6`, pero `sfx.mjs` lo interpreta **en dB** con −10 dB por defecto
   (`sfx.mjs:24`, `:64`): no queda claro si la intención era lineal; los mp3 de la librería siguen
   faltando (`Manual:1106`).
10. **Transcripción:** Speaches falló en el intake del 23-ago; la vía fiable documentada es
    faster-whisper local (`videos/claude-vs-claudecode/README.md:103-105`).
11. **Doctrina de movimiento contra el montaje de reels:** el texto entra por corte duro en 9 de 14
    reels, algo que `motion-doctrine` prohíbe (`2026-08-23-sintesis-lote-18.md:92-101`). La decisión
    quedó pendiente para el dueño de esa skill.

---

## 5. Especificación de grabación

### 5.1 Lo que la edición necesita y hoy adivina

1. **El cue literal de cada cambio visual.** `sync-plan.mjs` cronometra la palabra en el transcript
   con macheo monotónico; si el cue no aparece, lo reporta `SIN SINCRONIZAR` (`SKILL:206-214`). El
   guion tiene que marcar **las palabras exactas** que disparan cada apoyo, y esas palabras se dicen
   tal cual.
2. **Qué pantalla y qué región de esa pantalla va en cada beat.** La zona de apoyo rota cada 1-3 s
   (`ficha:35`) y *"la pantalla visible demuestra exactamente la frase que se escucha"*
   (`codex:MARCA_PERSONAL_OPERACION_DIARIA.md:69`). El recorte focal (`crop x,y,w,h`) hoy se decide
   en la edición, a ojo.
3. **El texto en pantalla por beat** (keyword de ≤ 3 palabras), separado del subtítulo
   (`SKILL:93-94`). Su densidad es una curva: aprieta en los primeros 20 s, afloja y vuelve a apretar
   en el remate (`Manual:1056-1059`).
4. **Las menciones de marca**, para poner el logo oficial (`SKILL:95-99`).
5. **Layout y nivel de edición declarados.** El Trial v2 es de *"cero o mínima edición"*
   (`hermes-content/docs/ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md:15`); Feed normal y B-roll llevan el
   método completo.
6. **Glosario de grafías** (nombres, términos técnicos) para el gate de ortografía (`SKILL:173-177`),
   sin reescribir lo dicho: los subtítulos no corrigen ni exageran lo que dijo Sergio Urcullo
   (`codex:MARCA_PERSONAL_OPERACION_DIARIA.md:72`).

### 5.2 La especificación (evidencia; lo que es cálculo o propuesta de la investigación va marcado)

| Tema | Especificación | Fuente |
|---|---|---|
| Cámara, toma separada | *"El crudo tiene que traer la CÁMARA como toma aparte full-frame… la burbujita de OBS incrustada en la esquina no da resolución"* | `SKILL:338-339`; `GUIONES-TANDA-2-18-SEP.md:142-143` |
| A-roll y pantalla por separado | Grabar A-roll y pantalla por separado; una misma toma sirve para Reel, TikTok, Shorts, historia y YouTube | `codex:PAQUETE-GRABACION-2026-09-22.md:18-25` |
| Encuadre | Cámara a la altura de los ojos; luz de ventana de frente, nunca detrás; micrófono de corbata | `hermes-content/docs/cola/GUIONES-SEMANA-1-MI-STACK.md:16-17`; `M02-marca-personal.md:30-31` |
| Encuadre en pantalla partida (**cálculo** sobre el código) | `split-layout` escala la cámara para cubrir 1080×864 (split 0,55) y recorta con `--head-anchor`. Con cámara vertical 1080×1920 y ancla `center` sobrevive la franja y ≈ 528-1392: **cabeza y hombros al centro vertical del cuadro** | `split-layout.mjs:102-111` |
| Espacio libre para insertar | "espacio vacío a la izquierda" / "40 % libre a la derecha" | `codex:PAQUETE-GRABACION-2026-09-22.md:42`, `:121-122` |
| Gestos | *"Las tarjetas van donde apunta el dedo"*; gestos separados apuntando a cada posición | `videos/claude-vs-claudecode/README.md:86-89`; `codex:PAQUETE-GRABACION-2026-09-22.md:129-130` |
| Retomas | Se deja **siempre el último intento** (regla de Sergio Urcullo); gancho y CTA en una segunda toma | `videos/claude-vs-claudecode/README.md:54-60`; `codex:yt/GRABACION_YOUTUBE_2026-09-22.md:35` |
| Pausas | *"Las pausas se escriben en el guion, no se editan después"*; pausa después de cada freno | `Manual:1078-1079`; `codex:PAQUETE-GRABACION-2026-09-22.md:112` |
| Captura: viewport | 1440×900 (bajar de 1440 a 1080 deja el texto nítido; capturar a 1080 lo deja blando) | `Manual:170`; `screencast-session.cjs:28` (rama Samuel) |
| Captura: fps | 60 fps para interfaces que animan; entregar a 30 en el master. El grabador Codex graba a 30 | `Manual:201-202`, `:218`; `screencast-session.cjs:240` (rama Samuel) |
| Captura: cursor | Playwright **no dibuja** el cursor del sistema: hay que inyectarlo. En escenas compuestas, cursor grande de 7cqw (≈76 px en 1080) que entra desde fuera del cuadro. Gesto de 0,6-0,9 s: *"0,4 s no se lee"* | `Manual:1170-1172`, `:245-247`, `:1071-1072`; `.agents/skills/oversized-cursor/SKILL.md:22`, `:43-44` |
| Captura: contenido | Datos ficticios; sin datos de clientes, credenciales, tokens, IDs reales ni pantallas de login; sin chuletas ni teleprompter visibles | `handoff-edición:32`; `videos/claude-vs-claudecode/README.md:76-84` |
| Captura: fuente real | *"No se dibuja una interfaz que no se miró"*: se graba la real, desde producción y no desde una rama | `SERIE_CLAUDE_CODE.md:171-172`; `Manual:217-218`, `:1086-1088` |
| Nombres de archivo | `NN-slug-screen.mp4`, `NN-slug-camera.mp4`, `NN-slug-voice.wav`, en una carpeta `raw/` por fecha, sin sobrescribir | `handoff-edición:36-44` |
| Captura en pantalla partida (**cálculo**) | La zona de apoyo con split 0,55 mide 1080×1056 (≈1:1). De una captura 1440×900 entra entera, como máximo, una región de ~920×900; el resto se pierde con `cover`. **La región focal cuadrada se decide al grabar**: el botón o nodo importante, dentro de un cuadrado | `split-layout.mjs:71-72`, `:139` |
| Pantalla completa vertical (**propuesta**) | Pasar de 1440×900 a 1080×1920 exige un zoom mayor a 2,0× (límite del proyecto). Capturar ese beat con viewport vertical (p. ej. 720×1280 a deviceScaleFactor 1,5) o componerlo en `fullscreen.html` con contenido real | inferencia; `zoom-punch.mjs:27` |
| Duración por captura (**propuesta**) | La duración del beat + 1 s de colchón a cada lado; nunca menos de 3 s por región | inferencia de `split-layout` (`offset`, `:128`) |

---

## 6. Plantilla: guion de rodaje + instrucción de edición

Cada columna corresponde a la entrada de una herramienta que ya existe:

| Columna del guion | Herramienta que la consume |
|---|---|
| CUE + APOYO | `storyboard.json` → `sync-plan.mjs` (overlays) · `supports[]` de `split-layout.mjs` (hoy a mano) |
| REGIÓN FOCAL | `supports[].crop` |
| ZOOM | `zooms.json` de `zoom-punch.mjs` (una sola ancla por pasada) |
| SFX | `sfx-plan.json` |
| TEXTO EN PANTALLA | composición `Keyword` de HyperFrames o `keyword.html` |
| GLOSARIO | gate de ortografía + `--fix` de `karaoke-captions.mjs` |
| §0 y §2 | la "instrucción completa" y el "inventario" que el SKILL anota como deuda (`SKILL:112-117`) |

```markdown
# <NN> · <slug> — GUION DE RODAJE + INSTRUCCIÓN DE EDICIÓN

## 0. Instrucción completa  (OBJETIVO / MATERIAL / ESTILO)
- OBJETIVO: al terminar, el espectador puede <acción copiable>. Superficie: Feed normal | B-roll | Trial v2 | YT.
- CTA: comentá <PALABRA> → recurso YA publicado: <URL> (verificado el <fecha>).
- LAYOUT: [A] cabeza full-frame + overlays · [B] PARTIDO: apoyo arriba 55 % / cabeza abajo 45 %
  (`split-layout --split 0.55 --head-anchor center`) · [C] pantalla primero, cara en PiP.
- NIVEL DE EDICIÓN: completa (método Santiago) | mínima (corte + karaoke + master).
- SUBTÍTULOS: karaoke `--style apple` (activa verde de marca) | imitación 1:1 del reel (`--active-color "#FFE600"`).
  En partido: `--words-per-line 3 --font-size 68 --margin-v 60`.
- KEYWORD GRANDE: sí (lista en §1) · MÚSICA: no (la pone Sergio Urcullo) · TRANSICIÓN: corte seco; crash zoom solo donde §1 lo marque.
- DURACIÓN: __ s · PALABRAS: __ (3,2–3,5 palabras/s) · SALIDA: 1080×1920, 30 fps, −14 LUFS.

## 1. Beats  (1 fila = 1 golpe de voz; el apoyo rota cada 1–3 s)
| # | t obj. | HABLA (literal) | CUE (palabras exactas) | APOYO / EN PANTALLA (id + región) | TEXTO EN PANTALLA (≤3 pal.) | ZOOM | SFX | NOTA |
|---|--------|-----------------|------------------------|-----------------------------------|-----------------------------|------|-----|------|
| 1 | 0–3 | «…» | «…» | CAM full-frame (gancho sin corte) | `…` | punch 1.00→1.08 top | impact | sin saludo |
| 2 | 3–5 | «…» | «Webhook» | S1 · región 280,160,880,880 | `ENTRADA` | — | whoosh (cambio apoyo) + pop (keyword) | logo n8n oficial |
| … | | | | | | | | |
| n | 25–35 | «Comentá …» | «Comentá» | CTA: fondo desenfocado + texto centrado | `"PALABRA"` | — | swish | recurso verificado |

## 2. Inventario del material  (se completa al terminar de grabar)
| id | archivo | tipo (camera/screen/voice/broll/foto) | toma buena | dur | res/fps | qué muestra | estado |

## 3. Capturas de pantalla  (una fila por id que aparezca en §1)
| id | app/URL (producción) | viewport | fps | cursor | acción y tiempos (gesto 0,6–0,9 s) | región focal x,y,w,h (cuadrada si LAYOUT B) | dur mín. (beat + 2 s) | datos ficticios ✔ |

## 4. Toma de cámara  (checklist de rodaje)
- [ ] Cámara como archivo aparte, full-frame, a la altura de los ojos; luz de frente; micrófono de corbata.
- [ ] LAYOUT B: cabeza y hombros en la franja central vertical del cuadro.
- [ ] Gancho y CTA dos veces. Retoma = repetir la frase entera desde el inicio; vale la última.
- [ ] Pausa de 1 s entre beats (punto de corte limpio). Gestos hacia donde irá cada tarjeta.
- [ ] Nada de chuletas ni teleprompter en la captura. Nada privado en pantalla.

## 5. Glosario de grafías  (gate de ortografía)
| se dice | se escribe | cómo aparece en pantalla |

## 6. [EDICIÓN: …]  instrucciones que no se dicen (una por línea, con el # de beat)

## 7. QA de salida
- Se entiende sin sonido · cada frase tiene su prueba en pantalla · la keyword no tapa la cara ni el nodo
- Cifras legibles en el teléfono · ñ y tildes revisadas · logos originales · video completo mirado antes de pedir el OK
```

**Ejemplo con el guion 1 del 21-sep** (`hermes-content/docs/cola/GUIONES-DIA-2026-09-21.md:93-141`),
layout B:

| # | t | HABLA | CUE | APOYO | TEXTO | SFX |
|---|---|---|---|---|---|---|
| 1 | 0-3 | «Si querés diseñar tu primera automatización, no empieces conectando veinte aplicaciones.» | — | cámara full-frame | `NO 20 APPS` | impact |
| 2 | 4-7 | «Primero, `Webhook`: recibe name, phone, service y source.» | «Webhook» | S1 · nodo Webhook con el JSON ficticio | `ENTRADA` | whoosh + pop |
| 3 | 7-10 | «Segundo, `IF`: comprobá que phone y service no estén vacíos.» | «IF» | S2 · condiciones `is not empty` | `VALIDACIÓN` | whoosh + pop |
| 4 | 10-14 | «…Google Sheets usa Append Row…» | «Google Sheets» | S3 · mapeo de las 4 columnas | `REGISTRO` | whoosh + pop |
| 5 | 14-17 | «Después, Telegram usa Send Message…» | «Telegram» | S4 · Send Message | `AVISO` | whoosh + pop |

---

## 7. Fuentes

**En el checkout** (citadas arriba con archivo:línea): `.claude/skills/editor-videos/` (SKILL,
scripts, assets) · `.claude/skills/ver-videos/SKILL.md` · `.agents/skills/{embedded-captions,
captions-overlay, oversized-cursor}` · `videos/{tiktok-20260917, claude-code-03,
claude-vs-claudecode}` · `scripts/hyperframes/` · `scripts/remotion/src/lib/tokens.ts` ·
`hermes-content/references/video-intake/` (las dos fichas de Santiago y la síntesis del lote 18) ·
`hermes-content/references/moldes-video/M02-marca-personal.md` ·
`hermes-content/references/tendencias/video-ad-primeros-3-segundos.md` · `hermes-content/docs/`
(`ONIA_MANUAL_DE_FORMATOS_20260813.md`, `VIRAL_VIDEO_PLAYBOOK.md`, `SERIE_CLAUDE_CODE.md`,
`ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md`) · `hermes-content/docs/cola/` (`GUIONES-RODAJE-17-20-SEP.md`,
`GUIONES-TANDA-2-18-SEP.md`, `GUIONES-DIA-2026-09-21.md`, `GUIONES-SEMANA-1-MI-STACK.md`,
`PLAN-VIDEOS-11-20-SEP.md`) · `hermes-content/docs/handoff/` (`EDICION-MARCA-PERSONAL-2026-09-21.md`,
`claude-analizar-reels-videos-67f762.md`) · `web-factory/docs/ONIA_BRAND_IDENTITY_2026.md` ·
`hermes-content/brand/ONIA_BRAND_IDENTITY.md`.

**Commits citados** (presentes en el clon local): `20569df4` (fundador de la skill), `547b0cd8`,
`2c5fe05f`, `21b14930`, `5374534b`, `3244bd6d`; además `96c5b4cb`, el cuarto commit cuyo mensaje
menciona a Santiago.

**Ramas sin integrar** (citadas como texto): `codex/marca-comunidad-plan` (`PAQUETE-GRABACION-2026-09-22.md`,
`GUIONES-DIA-2026-09-22.md`, `MARCA_PERSONAL_OPERACION_DIARIA.md`, `yt/GRABACION_YOUTUBE_2026-09-22.md`,
`PLAN-CONTENIDO-23-27-SEP-2026.md`) · `codex/samuel-grabaciones-20260921`
(`scripts/marca-personal/screencast-session.cjs`, `handoff/grabaciones-samuel.md`) ·
`claude/rescate-fix-karaoke` (`assets/html/captura-apoyo.html`).

**Externas** (no se pudieron abrir: la red de la sesión bloquea Instagram y YouTube):
- Reel `DdE7wYbxjPK`: https://www.instagram.com/p/DdE7wYbxjPK/
- Reel `DcE8336Ixby` (@sanmunoz.ia): https://www.instagram.com/p/DcE8336Ixby/
- Tutorial probable: https://www.youtube.com/watch?v=QRhX4zU1jso
- Repos de Santiago Muñoz ligados a su edición (GitHub, sí accesible): https://github.com/santmun/video-vox · https://github.com/santmun/editor-tiktok · https://github.com/santmun/mega-editor-davinci
- Otra referencia mezclada: reel `DbTxeqsBWST` de @human___academy (citado en `SKILL:30`)

---

## 8. Lo que la sesión de edición tiene que decidir

Lista corta. Lo que toca marca (color, tipografía) lo confirma Sergio Urcullo.

1. **Subtítulo:** confirmar el verde `#10C26B` palabra por palabra como único estilo (el amarillo
   queda solo para imitación 1:1) y **corregir el paso 6 del SKILL**, que todavía dice amarillo +
   Arial Black (`SKILL:178-181`).
2. **Proporción del partido:** fijar un default entre 55/45 (script y ficha), 45/55 (TikTok 04) y
   60/40 (Codex).
3. **Cadencia:** cada cuánto rota el apoyo (1-3 s de Santiago contra los 14-16 s del TikTok 04) y si
   el gancho corta o no (los ads no cortan en los primeros 3 s).
4. **Transiciones:** corte seco como regla; decidir si `transitions.mjs` se retira o queda solo para
   el CTA, y si hay crash zoom.
5. **Música:** sin música (skill) o pad bajo (`pad_gain 0.05` de las configs del lote).
6. **Cursor y captura:** cursor grande de 7cqw desde fuera del cuadro contra el punto de 24 px del
   grabador Codex; 60 fps contra 30 fps.
7. **Keyword grande:** Inter 900 + naranja (lo que está hecho) o el sistema de marca (Bricolage con
   tope 700 y verde).
8. **Qué se construye primero de lo que falta:** `cue → supports[]` (el que más horas ahorra), CTA
   con desenfoque, ecuación de logos, zoom animado al cursor.

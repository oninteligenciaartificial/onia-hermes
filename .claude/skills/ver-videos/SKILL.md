---
name: ver-videos
description: >
  Use when you need to "see", watch, understand, review, or analyze a video (a YouTube/URL
  link, a local file, a reference clip, a client's video, a tutorial), or transcribe it /
  read what appears on screen. Triggers: user shares a video link and asks what it shows or
  to replicate it; wants a transcript or subtitles; says "no puedes ver videos" / "mira este
  video". ONIA system capability — works from Claude Code with ffmpeg + Whisper.
---

# Ver Videos — que ONIA "vea" cualquier video

## Overview
Dos modos para que ONIA "vea" un video. **Preferí el PRIMARIO (Gemini) siempre que haya key** —
mira el video NATIVO (imagen + audio juntos, timeline real). Sin key, cae al FALLBACK
(frames + transcript), que es un parche: cubre el 80% pero pierde movimiento/continuidad.

- **PRIMARIO — Gemini nativo** (`scripts/gemini-see-video.mjs`): una llamada, mira video+audio,
  devuelve resumen + timeline con timestamps + texto en pantalla. Gratis (Google AI Studio free tier).
  Necesita `GEMINI_API_KEY` (gratis: aistudio.google.com/apikey). Acepta URL de YouTube directa o archivo local (File API).
- **FALLBACK — frames + transcript** (`scripts/see-video.sh` + `scripts/transcribe.sh`): sin key,
  con ffmpeg + Speaches. Muestrea fotogramas + transcribe.

**Principio (honestidad):** con Gemini, reportá lo que devolvió (mira todo). Con el fallback, decí la
cobertura real ("audio 100%, vi N de M fotogramas") — nunca afirmes "vi el video" desde 2 cuadros.

## PRIMARIO — Ver nativo con Gemini
```bash
# URL de YouTube directa (cero subida) o archivo local (File API):
GEMINI_API_KEY=... node scripts/gemini-see-video.mjs "https://youtu.be/XXXX"
GEMINI_API_KEY=... node scripts/gemini-see-video.mjs /ruta/video.mp4
```
- Modelo default `gemini-flash-latest` (alias al flash actual; las cuentas nuevas ya NO tienen `gemini-2.5-flash`). Override `GEMINI_MODEL` (ej. `gemini-3.6-flash`, `gemini-flash-lite-latest`). **PROBADO 2026-07-24**: vio el tutorial de Santiago (28 min) entero por URL de YouTube con timestamps.
- Videos largos / ahorrar cuota: `GEMINI_MEDIA_RES=low` (~100 tok/s en vez de ~300).
- **Auto-reintento** ante errores transitorios (503 saturado / 429 rate limit / 500 / red): hasta 4 intentos con backoff escalonado ~3s, 8s, 20s (logueado a stderr). Los errores NO transitorios (400/401/403/404) fallan de una.
- Devuelve resumen + timeline por secciones + texto en pantalla, todo con timestamps. Eso ES "ver el video".
- Si falla (sin key, cuota, error) → usar el FALLBACK de abajo. Nunca se rompe.


## Bajar el MP4 — `scripts/fetch-video.mjs` (ruta por DEFECTO, 2026-08-09)

**Sin abrir el navegador del usuario.** Un solo comando para TikTok, YouTube e Instagram:

```bash
node .claude/skills/ver-videos/scripts/fetch-video.mjs <url> [<url>...] --out DIR
node .claude/skills/ver-videos/scripts/fetch-video.mjs --login   # 1 sola vez, para IG
```

Imprime `<url>\t<ruta del mp4>` por linea. Varias URLs bajan en paralelo.

Medido 2026-08-09: TikTok 5,4 MB en **3,9 s**; reel de IG 15 s / 1,9 MB (h264+aac, con
audio) en **1,7 s**. Ambos sin abrir el navegador.

- **TikTok / YouTube:** `yt-dlp` directo, cero cookies, cero navegador.
- **Instagram:** exige sesion. Usa un **perfil de Chromium propio de Playwright**
  (`.hermes/ig-session/profile`, gitignoreado) — NO el Chrome del usuario. Las cookies
  se leen por CDP (`context.cookies()`), asi que el cifrado en disco no estorba.
  Login manual **una vez** (`--login`, ventana headed); despues headless ~1 s y jar
  reusado 12 h. `--sleep-requests 2` para no gatillar rate limit de IG.

**Por que NO usar `--cookies-from-browser` (medido en la maquina de Sergio, 2026-08-09):**

| Fuente | Resultado |
| --- | --- |
| `firefox` | lee 109 cookies, pero **no hay sesion de IG** ahi (solo `csrftoken`/`mid` anonimos) |
| `chrome` / `brave` | `Could not copy Chrome cookie database` — base bloqueada con el navegador abierto; y aun cerrandolo, ABE |
| `edge` | `Failed to decrypt with DPAPI` — App-Bound Encryption (Chrome 127+) |

**Trampas conocidas:** no devolver la URL firmada del CDN (el filtro del MCP la bloquea);
no volcar el video en base64 al contexto; nunca escribir la contrasena de IG — el login
lo hace Sergio en la ventana.

**Trampas medidas 2026-09-17 (las tres ya fixeadas en el script — no deshacer):**
- **yt-dlp REESCRIBE el archivo `--cookies` al salir.** En un intento fallido guarda el
  estado post-rechazo SIN `sessionid` (IG lo borra via Set-Cookie al negar la sesion) y
  deja el jar vacio para todo lo demas. Por eso el script le pasa una COPIA descartable
  (`cookies.txt.ytdlp`), nunca el jar real.
- **IG revoca sesiones server-side y el cookie queda ZOMBIE en el perfil** (expira 2027
  client-side, pero el server responde 302 al login y mata el sessionid). Sintoma: "Failed
  to parse JSON" en yt-dlp o "redirect count exceeded" en fetch directo. Diagnostico en
  10 s: fetch a `/api/v1/media/<id>/info/` con `redirect:'manual'` y mirar si el Location
  es `/accounts/login/`. Por eso `--login` ahora SIEMPRE abre la ventana y limpia cookies
  antes (si no, el poll toma el zombie por login exitoso y sale sin abrir nada).
- **El captcha del login se rompe con el flag `--enable-automation`** de Playwright:
  reCAPTCHA se niega a validar y Sergio queda trabado. El script lanza con
  `ignoreDefaultArgs: ['--enable-automation']` + `--disable-blink-features=AutomationControlled`
  y arranca en la portada (no en `/accounts/login/`).

## Carruseles de imágenes — `scripts/ig-carousel.mjs` (2026-08-11)

**yt-dlp NO puede con ellos**: falla con `No video formats found!` porque solo entiende de
video, y encima resuelve un shortcode interno distinto al del link (esa es la firma de un
carrusel). Perderlos es caro: **un carrusel suele ser el formato MÁS denso en información**
de todo Instagram — una idea por lámina, más el caption, que muchas veces trae el contenido
entero escrito.

```bash
node .claude/skills/ver-videos/scripts/ig-carousel.mjs <url|shortcode> [...] --out DIR
```

Pide `carousel_media` a la API interna de IG con el mismo `cookies.txt`, baja **todas** las
láminas en su mayor resolución, guarda los slides que sean video como mp4, y escribe siempre
`caption.txt`. Después las láminas se leen con visión directa (tool Read) — sin Gemini.

**Trampas resueltas (medidas 2026-08-11, 6 carruseles / 55 láminas):**
- **Leer el caption PRIMERO.** Es texto, es barato, y en 4 de 6 casos traía el contenido
  completo; las láminas solo confirmaban. Leer 55 imágenes cuando el caption ya lo dice es
  quemar contexto.
- **No mandar el jar de cookies entero**: la cookie `rur` trae comillas y escapes `\054` que
  undici rechaza (`invalid header value`). Whitelist: `sessionid`, `csrftoken`, `ds_user_id`,
  `mid`, `ig_did`.
- **Partir por `/\r?\n/`**: en Windows el `cookies.txt` queda con CRLF y el `\r` se cuela en
  el valor de la última columna → mismo error de header, con causa distinta.

## Cómo "ver" cuando NO hay Gemini (orden real de preferencia)

Gemini no es la capacidad: es un atajo barato. La visión propia es el piso y nunca se cae.

| Orden | Camino | Cuándo | Costo |
| --- | --- | --- | --- |
| 1 | **Gemini nativo** | video con audio y timeline que importa | gratis hasta ~20 videos/día (después: `You exceeded your current quota`, y es DIARIO — reintentar no sirve) |
| 2 | **Whisper/Speaches + fotogramas leídos con visión** | cuota agotada, o hace falta verbatim exacto para citar | gratis, sin límite |
| 3 | **Solo fotogramas con visión** | video mudo, carrusel, captura de pantalla | gratis; cuesta CONTEXTO, no dinero |
| 4 | **Caption / texto** | carruseles y posts: casi siempre el 80% del contenido | gratis y barato — probar SIEMPRE primero |

Regla: reportar la cobertura real de cada camino ("audio 100%, 5 de 7 láminas"), nunca decir
"vi el video" desde dos cuadros.

## Instagram por MCP de navegador (ruta VIEJA — solo si falla la de arriba)

**El problema, para no volver a chocar:** IG no reproduce reels sin sesion; el `<video>` usa
MSE (blob, no descargable); `yt-dlp` necesita cookies y **desde Chrome 127 estan cifradas con
App-Bound Encryption** -> falla con `Failed to decrypt with DPAPI` aunque le pases un snapshot
de la base. Capturar fotogramas por canvas da imagen pero **NO audio**.

**La ruta que SI funciona** (probada con 2 reels: 70 s / 10,3 MB y 32 s / 4,1 MB):

1. Navegador **con sesion iniciada** (MCP `claude-in-chrome`). Si hay varios navegadores
   conectados, preguntar cual — la herramienta lo exige.
2. `navigate` -> `https://www.instagram.com/reel/<SHORTCODE>/`
3. `javascript_exec` con el cuerpo de `scripts/ig-media-url.js`: convierte el shortcode a
   `media_id`, pide `/api/v1/media/<id>/info/` con `credentials:'include'` y el header
   `x-ig-app-id: 936619743392459`, y **dispara la descarga dentro de la pagina**.
4. Mover el MP4 de la carpeta de descargas al scratchpad.
5. `node scripts/gemini-see-video.mjs <archivo.mp4>` -> resumen + timeline + **narracion** +
   texto en pantalla.

**Trampas aprendidas:**
- **NO devolver la URL del CDN** como valor de retorno: lleva query string firmada y el filtro
  de seguridad del MCP la bloquea. Descargar SIEMPRE dentro de la pagina.
- **NO devolver el base64** del video: 10 MB de video son 14 MB de base64 y revientan el
  contexto. El `<a download>` con blob es el camino.
- Las pestanas del MCP se reciclan entre llamadas: **usar `browser_batch`** para encadenar
  navigate + script en un solo viaje.
- `snapshot-cookies.ps1` (en esta misma carpeta) resuelve el **lock** de la base de cookies
  del navegador abierto, pero no el cifrado ABE. Sirve para navegadores viejos o Firefox.
- Nunca iniciar sesion ni escribir contrasenas: la sesion la pone el usuario en su navegador.

## FALLBACK — frames + transcript (sin key)
1. **Conseguir el video.**
   - URL (YouTube/etc.): `yt-dlp -f 18 -o in.mp4 "<url>"` (instalar: `pip install -U yt-dlp`; formato 18 = mp4 360p, liviano y suficiente para leer). Para mejor imagen: `-f "b[height<=720]"`.
   - Archivo local o nota de Telegram: usalo directo.
2. **Extraer audio + fotogramas:** `bash scripts/see-video.sh <video> <workdir>`
   → `audio.mp3` (mono 16k) + `frames/f_XX.jpg` (1 cada N s, N auto según duración para ~40-70 cuadros, 640px) + imprime la lista y el intervalo.
3. **Transcribir** (elegí camino en la tabla de abajo). Gratis por defecto: Speaches (VPS).
   `bash scripts/transcribe.sh <audio.mp3>` → JSON `{ segments[], words[] }` con timestamps.
   Para solo-texto rápido no hace falta timestamps; para subtítulos/edición SÍ (`verbose_json`).
4. **Leer fotogramas con visión (tool Read):** abrí una **muestra repartida** (10-15 cuadros
   de principio a fin, NO los 69). Elegí cuadros a intervalos regulares + los que el transcript
   marque como momentos clave.
5. **Resumir:** qué se **dice** (transcript) + qué se **muestra** (cuadros clave con su minuto) +
   un **timeline por secciones**. Reportá la cobertura real.

## Análisis escena por escena — Higgsfield `video_analysis_create` (2026-08-20)

**GRATIS y mejor que leer fotogramas a ciegas** (medido: 25 escenas en 55 s, balance idéntico —
ficha: `hermes-content/references/video-intake/2026-08-19-la-herramienta-lee-el-video.md`).
Solo videos **< 3 min**: la propia herramienta degrada en largos. NO reemplaza leer el texto en
pantalla: el prompt se lee con los ojos, siempre.

El MCP de Higgsfield vive solo en sesiones de Claude (OAuth; no hay API key). Por eso
`scripts/video-intake.mjs` **encola** (`.hermes/video-intake/scenes-queue.jsonl`) y una sesión
con el MCP **drena** con `scripts/video-scenes.mjs` (flujo exacto en su cabecera): `next` →
`media_upload` + curl PUT + `media_confirm` → `balance` ANTES → `video_analysis_create` →
`mark` → seguir con otra cosa (3-5 min) → `video_analysis_status` → `balance` DESPUÉS → `save`.
Tope por corrida `ONIA_SCENES_TOPE` (default 10); si el balance BAJA, `save` corta la cola
(`scenes-PAUSADO`) y `next` se niega hasta revisión humana. Log: `analisis/CORRIDAS.log`.

## Fotogramas por densidad de texto — `scripts/text-frames.mjs` (2026-08-20)

```bash
node scripts/text-frames.mjs <video.mp4> --out DIR [--max 12]
```
Escanea **cuadro por cuadro** (320px gris + edgedetect; fps=4 solo en >5 min) y extrae los
picos de densidad de bordes a 960px — proxy de "hay texto/UI en pantalla". Nació de casi
perder un prompt que aparecía en UN solo cuadro con el muestreo a intervalo fijo. El intake
lo corre solo (deja los cuadros en `.hermes/video-intake/frames/<id>/`, local). Preferilo
sobre el intervalo fijo cuando el objetivo es **leer texto en pantalla**.

## Intervalo de fotogramas (heurística del FALLBACK)
| Duración | fps de extracción | intervalo | cuadros aprox |
| --- | --- | --- | --- |
| < 2 min | 1/5 | 5 s | 24-72 |
| 2-10 min | 1/15 | 15 s | 8-40 |
| 10-30 min | 1/25 | 25 s | 24-72 |
| > 30 min | 1/45 | 45 s | 40+ |

`see-video.sh` calcula esto solo desde la duración (ffprobe). Para cazar texto en pantalla
usá `text-frames.mjs` (arriba), que muestrea por densidad y no por reloj.

## Transcripción — opciones
| Camino | Costo | Timestamps | Cuándo |
| --- | --- | --- | --- |
| **Speaches (VPS)** default | gratis | segment + word (`verbose_json`) | uso diario; corre en onia-center vía SSH, modelo `Systran/faster-whisper-small` multilingüe (NO el distil = English-only) |
| OpenAI Whisper API | ~$0.006/min | verbose_json | si el key local está vigente (hoy suele estar vencido → rotar) |
| AssemblyAI | pago (needs OK) | word, mejor en silencios | solo con permiso de Sergio ([[gasto-plataformas-validar-primero]]) |

Speaches gratis alcanza para casi todo. `scripts/transcribe.sh` usa ese camino (base64 → SSH → docker exec en onia-center → Speaches). Detalle de infra: [[onia-hermes-stack-y-radar]].

## Common mistakes
- **Afirmar que "viste" el video con 1-2 cuadros.** Muestreá una tanda repartida y decí la cobertura.
- **Leer los 69 cuadros** (quema contexto). 10-15 repartidos alcanzan para el arco completo.
- Usar el modelo `faster-distil-whisper-large-v3` en Speaches: es **English-only**, traduce el español. Usar `Systran/faster-whisper-small`.
- Bajar el video en 4K cuando 360p (formato 18) alcanza para leer.

## Relacionadas
`editor-videos` (edita lo que esta skill deja transcrito) · `embedded-captions` · [[onia-video-hyperframes]].

## Cosechar un chat entero — cuando mandar los links de a uno se hace pesado

`scripts/cosechar-dm.mjs` trae **todos los posts compartidos de una conversación** de Instagram,
con autor, caption y tipo. Sergio se loguea **una sola vez** y después no toca nada más.

```bash
node cosechar-dm.mjs --login        # una vez, con la cuenta que tiene la conversación
node cosechar-dm.mjs --hilos        # lista las conversaciones y su id
node cosechar-dm.mjs <threadId> --out DIR
```

Deja `dm-compartidos.json` (con caption y autor) y `dm-compartidos.txt` (solo URLs, listo para
pasarle a `fetch-video.mjs`).

**Cómo funciona, y por qué así.** No le pide nada a la API de Instagram: **escucha lo que la
propia página ya pide** mientras scrollea. Es leer, no llamar.

Lo que se probó y NO sirve, para no repetirlo:

| Intento | Resultado |
|---|---|
| leer el `href` del post compartido en el DOM | **no existe** — solo se expone el link del autor |
| clic por coordenada fija | la lista es **virtualizada**: cae siempre en el mismo |
| `scrollTop` del contenedor | no se mueve |
| llamar a `/api/v1/direct_v2/threads/…` | **500**, y el navegador lo bloquea por cookie/query string |

Usa un perfil **aparte** (`.hermes/ig-session/profile-dm`): el de `fetch-video.mjs` está logueado
con otra cuenta y pisarlo dejaría el intake sin sesión.

## Contenido que manda Sergio Urcullo: mensaje, tema y EDICIÓN (regla del 3-oct)

No alcanza con resumen y timeline. Cada video se analiza en tres partes:
- **mensaje**: qué dice y a quién;
- **tema**: por qué rinde;
- **edición**: cortes por cada 10 s; subtítulos (tipo, posición, animación); transiciones, zooms, b-roll, sonido y
  música; los primeros 3 s cuadro por cuadro.

A Gemini se le hace una segunda pasada con un prompt solo de edición, y `text-frames.mjs` lee el texto en pantalla. La
ficha va a `hermes-content/references/video-intake/`.

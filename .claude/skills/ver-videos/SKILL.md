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
- **Si `gemini-flash-latest` devuelve 503 «high demand» aun después de los 4 reintentos** (medido el 8-oct con 8 de 8 llamadas
  fallidas), correr con `GEMINI_MODEL=gemini-flash-lite-latest`: anduvo a la primera. Pero el lite **lee mal los números
  chicos de la pantalla** (puso «Sonnet 3.5» donde decía 5.5): de él se toma el principio, y las cifras o versiones se
  confirman con `text-frames.mjs`. Para varios videos con prompts propios: importar `seeLocalVideo(path, prompt)` y
  correrlos con `Promise.all` (ficha `references/video-intake/2026-10-08-orquestacion-e-ingresos-5-posts.md`).
- Un link `/p/` puede ser carrusel: `fetch-video.mjs` falla con «No video formats found!» y se usa `ig-carousel.mjs`.
- **Auto-reintento** ante errores transitorios (503 saturado / 429 rate limit / 500 / red): hasta 4 intentos con backoff escalonado ~3s, 8s, 20s (logueado a stderr). Los errores NO transitorios (400/401/403/404) fallan de una.
- Devuelve resumen + timeline por secciones + texto en pantalla, todo con timestamps. Eso ES "ver el video".
- Si falla (sin key, cuota, error) → usar el FALLBACK de abajo. Nunca se rompe.


## Bajar el MP4 — `scripts/fetch-video.mjs` (ruta por DEFECTO, 2026-08-09)

**Sin abrir el navegador del usuario.** Un solo comando para TikTok, YouTube e Instagram:

```bash
node .claude/skills/ver-videos/scripts/fetch-video.mjs <url> [<url>...] --out DIR
node .claude/skills/ver-videos/scripts/fetch-video.mjs --login   # solo si un post de IG no baja sin sesion (necesita Playwright)
```

Imprime `<url>\t<ruta del mp4>` por linea. Varias URLs bajan en paralelo. Al lado de cada mp4
deja `<Extractor>-<id>.info.json` (caption en `description`, `like_count`, `comment_count`,
`uploader`), **sin cookies**: el script borra el campo `cookies` que yt-dlp mete en cada formato.
Calidad: `-S res:720,ext:mp4:m4a` (con el viejo `-f "b[height<=720]"` los reels salían 360x640).

- **TikTok / YouTube:** `yt-dlp` directo, cero cookies, cero navegador. ⚠ El 19-oct-2026 YouTube le pidió
  «Sign in to confirm you're not a bot» a yt-dlp desde la PC; para VER un YouTube, Gemini toma la URL directa.
- **Instagram — los reels PÚBLICOS bajan SIN sesión (medido el 19-oct-2026 en la PC).** `DcE8336Ixby` de
  @sanmunoz.ia: 720x1280 + audio, 74,6 s, 5,6 MB en **5 s**, sin cookies. Antes el script exigía la sesión con
  cualquier link de IG, la daba por vieja a las 12 h, intentaba renovarla con Playwright (no instalado) y abortaba
  con `ERR_MODULE_NOT_FOUND` **sin probar nunca sin cookies**. Orden actual, del más barato al más caro:
  1. `yt-dlp` sin cookies → 2. `--impersonate chrome` (curl_cffi) → 3. recién ahí la sesión guardada.
  Si fallan las tres, el error lista el motivo de cada una. El 720p de IG es **VP9** dentro de mp4 (no hay h264 a
  esa resolución): si un editor lo pide en h264, re-codificar.
- **La sesión guardada (último recurso):** perfil de Chromium propio de Playwright + `cookies.txt` en
  `ONIA_IG_SESSION` o, sin esa variable, en `<checkout principal>/.hermes/ig-session` (se resuelve con
  `git rev-parse --git-common-dir`, así un worktree usa la del checkout principal; `scripts/ig-session.mjs`).
  NO es el Chrome del usuario: las cookies se leen por CDP, así que el cifrado en disco no estorba. Login manual
  **una vez** (`--login`, ventana headed, necesita Playwright); jar reusado 12 h; si Playwright no carga, avisa y
  prueba con el `cookies.txt` viejo. `--sleep-requests 2` para no gatillar rate limit de IG.
- **Desde la NUBE (medido el 4-oct-2026):** `DeDZx1BopXS` bajó sin cookies y con `--impersonate chrome`
  (1080x1920). El 1-oct la misma ruta había dado 429: si da 429, se le pide a la madre que lo mire desde Chrome.

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

## Receta — desarmar un reel (probada el 19-oct-2026 con `DcE8336Ixby`, ~1 min en total)

```bash
V=.claude/skills/ver-videos/scripts; D=<carpeta fuera del repo>; R=$D/Instagram-<id>
node $V/fetch-video.mjs https://www.instagram.com/reel/<id>/ --out $D        # 1. mp4 720p + .info.json (5 s)
node -e "const i=require(process.argv[1]);console.log(i.description,i.like_count,i.comment_count)" $R.info.json  # 2. caption PRIMERO
GEMINI_MODEL=gemini-flash-lite-latest GEMINI_MEDIA_RES=low node $V/gemini-see-video.mjs $R.mp4 > $D/gemini.md  # 3. ver (1 llamada, 20 s)
ffmpeg -v error -i $R.mp4 -vn -ac 1 -ar 16000 $D/audio.wav && bash $V/transcribe.sh $D/audio.wav > $D/transcript.json  # 4. local (20 s)
ffmpeg -i $R.mp4 -vf "select='gt(scene,0.25)',showinfo" -f null - 2>&1 | grep -o "pts_time:[0-9.]*"   # 5. cortes (1 s)
node $V/text-frames.mjs $R.mp4 --out $D/texto --max 8                        # 6. texto en pantalla (10 s)
```

- **2 antes que 3:** el caption es texto y es gratis; a veces trae el contenido entero.
- **3:** el lite basta para mensaje y estructura; las cifras chicas se confirman con los cuadros de 6.
- **5:** los picos a menos de ~0,3 s son la MISMA transición (destello, zoom): se cuentan como un corte. En
  `DcE8336Ixby` salieron 10 picos = 6 cortes (9,0 · 42,4 · 46,7 · 50,0 · 57,1 · 63,0 s) en 74,6 s.
- **6:** se leen los cuadros con visión (Read); ahí están los subtítulos, las tablas y el estilo de pantalla.
- Atajo para sacar un prompt: `bash .claude/skills/sacar-prompt/scripts/preparar.sh <url> --out DIR` hace 1, 4 y
  fotogramas densos en 29 s.

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

**El problema, para no volver a chocar:** para lo que NO baja sin sesión (privados, 429), el
`<video>` usa MSE (blob, no descargable) y las cookies de Chrome **desde Chrome 127 estan cifradas
con App-Bound Encryption** -> `--cookies-from-browser` falla con `Failed to decrypt with DPAPI`
aunque le pases un snapshot de la base. Capturar fotogramas por canvas da imagen pero **NO audio**.

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
   - URL: `node scripts/fetch-video.mjs "<url>" --out DIR` (arriba). Para solo leer alcanza 360p: `yt-dlp -f 18`.
   - Archivo local o nota de Telegram: usalo directo.
2. **Extraer audio + fotogramas:** `bash scripts/see-video.sh <video> <workdir>`
   → `audio.mp3` (mono 16k) + `frames/f_XX.jpg` (1 cada N s, N auto según duración para ~40-70 cuadros, 640px) + imprime la lista y el intervalo.
3. **Transcribir** (elegí camino en la tabla de abajo). Por defecto en la PC: faster-whisper LOCAL.
   `bash scripts/transcribe.sh <audio>` → JSON `{ ok, model, segments[], words[] }` con timestamps.
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
| **faster-whisper LOCAL** default en la PC (19-oct-2026) | gratis, sin red | segment + word | `transcribe.sh` lo elige solo si `faster_whisper` importa (`scripts/transcribe_local.py`, modelo `small` = el mismo del VPS, `ONIA_LOCAL_STT_MODEL` para `base`/`medium`). Reel de 74,6 s en **20 s**, mismo JSON que Speaches |
| **Speaches (VPS)** | gratis | segment + word (`verbose_json`) | la nube, o forzado con `ONIA_STT=vps`; vía SSH, modelo `Systran/faster-whisper-small` multilingüe (NO el distil = English-only) |
| OpenAI Whisper API | ~$0.006/min | verbose_json | si el key local está vigente (hoy suele estar vencido → rotar) |
| AssemblyAI | pago (needs OK) | word, mejor en silencios | solo con permiso de Sergio ([[gasto-plataformas-validar-primero]]) |

En la PC el local alcanza para casi todo; Speaches es el camino de la nube.
⚠ **Desde una sesión en la nube** (4-oct-2026): `transcribe.sh` va por defecto a `root@187.77.16.63` con su clave, y
desde la nube eso se cuelga (más de 120 s, JSON vacío). Correrlo con `ONIA_VPS_HOST=onia-vps`, que pasa por el túnel.
⛔ **Nube con red por lista blanca (medido 16-oct-2026, hilo de pruebas, sesión del proyecto «ONIA · Hermes»):** en ESTE
entorno la red solo deja pasar lo que una regla permite (`request blocked: no rule or allowlist entry allows host "…"`,
403 en el CONNECT). Medido: **bloqueados** `onia.com.bo`, `app.onia.com.bo`, `www.instagram.com`, `www.youtube.com`,
`youtu.be`, `cdninstagram.com`, `googlevideo.com`, `google.com`, `huggingface.co`; **pasan** `github.com` y `pypi.org`.
Por lo tanto aquí NO se baja ningún reel ni Short, ni con `yt-dlp` ni con `fetch-video.mjs`: el error exacto es
`Unable to connect to proxy … Tunnel connection failed: 403 Forbidden`. No se rodea (ni WebFetch ni otro puente): se
reporta el host y el reel se manda a la madre en la PC (Chrome + `fetch-video.mjs`). Diagnóstico en 10 s:
`curl -sS "$HTTPS_PROXY/__agentproxy/status"` (ver `recentRelayFailures[].host`) y un `CONNECT` crudo por socket a
`127.0.0.1:<puerto>` para leer el cuerpo del 403 (curl lo esconde). Antes de planear una tarea de video en la nube,
probar `curl -sS -o /dev/null -w "%{http_code}" https://www.youtube.com`: `000` + «CONNECT tunnel failed, response 403»
= no hay ruta, ahorrar el intento.
- **Carrusel desde la nube (2.º caso, 16-oct, `/p/DecFE1oDNd3/`):** Chromium → `ERR_TUNNEL_CONNECTION_FAILED`, `yt-dlp` → 403 del proxy, `gallery-dl` (pip, 3 s) → `ProxyError: 403 Forbidden`. Las tres herramientas chocan con el mismo host bloqueado, así que cambiar de herramienta no sirve: el carrusel lo baja la madre con `ig-carousel.mjs` y las láminas se leen con visión. Fichas de esos dos posts: pendientes hasta tener los archivos.
- **VPS desde la nube:** sin `ssh` en el PATH y sin `ONIA_VPS_SSH_KEY_B64` en el entorno ⇒ no hay camino `onia-vps`
  (ni `transcribe.sh`). No buscar otra forma de entrar.
- **Playwright + Chromium en la nube (medido 16-oct):** el entorno trae Chromium (`/opt/pw-browsers/chromium-1194/chrome-linux/chrome`)
  y Playwright 1.56.1 global (`/opt/node22/lib/node_modules/playwright`). Sin `playwright install`. Lanzar con
  `executablePath` y `--no-sandbox`; primer arranque ~8 s, siguientes ~0,15 s; captura de `github.com` 5 s en total
  (salió sin CSS: los estáticos viven en otro host que la lista no abre, mirar la captura siempre). Hosts bloqueados
  dan `net::ERR_TUNNEL_CONNECTION_FAILED`. Hosts que van fuera del proxy (`pypi.org`) dan `ERR_CERT_AUTHORITY_INVALID`:
  no se desactiva TLS. `pip install yt-dlp` sí funciona (4 s, versión 2026.08.19).

- ✅ **Entorno «Onia» (red abierta), medido 16-oct-2026 — REEMPLAZA los bloqueos de arriba para ese entorno.** `onia.com.bo` y
  `app.onia.com.bo/login` dan 200 en ~1,4 s (captura 1440 con CSS y fuentes completos, 5 s el script entero con Playwright
  global `/opt/node22/lib/node_modules/playwright` + `chromium-1194`, `--no-sandbox`); `instagram.com`, `youtube.com` y la CDN
  `scontent-*.cdninstagram.com` también pasan. Antes de decir «bloqueado», probar `curl -s -o /dev/null -w '%{http_code}' <host>`.
- **Instagram desde la nube SIN login (método medido, 2 posts):**
  1. `pip install yt-dlp curl_cffi` (sin `curl_cffi`, `--impersonate chrome` falla: «target not available»).
  2. **Carrusel:** `yt-dlp --impersonate chrome -o "s%(playlist_index)02d.%(ext)s" --write-info-json <url>`: baja las láminas
     de VIDEO (8 de 10 en `/p/DecFE1oDNd3/`, 100-180 KB c/u, 1080x1438, 10 s) y el `s00.info.json` trae el **caption completo**,
     likes y autor. Las láminas de IMAGEN fallan («No video formats found»). `-o` con nombre fijo se pisa.
  3. **Post de imagen única** (`/p/DedkCc6olmo/`): yt-dlp dice «There is no video in this post». Camino: Playwright abre
     `/p/<id>/` (5 s, sale un modal de login que no estorba) y **se guardan las respuestas de imagen de `cdninstagram`**
     (`page.on('response')`, `r.body()`, quedarse con las >40 KB): la mayor es la imagen completa (2048x2731, 450 KB), mejor
     que `og:image`, que viene recortada a 640. Lo mismo da la lámina 1 (imagen) de un carrusel (2160x2877).
  4. `gallery-dl` sin login se **cuelga** (>120 s, ni error): no usarlo. `pkill -f` dentro del mismo shell mata la sesión.
  5. Metadatos gratis del `<meta og:description>`: «N likes, M comments - autor on fecha: "caption"».
  Faltan: lámina 10 del carrusel (imagen, CTA «guarda/comenta»); con login saldría por `?img_index=N` (ver camino de la PC).
- **Biblioteca de anuncios de Meta desde la nube SIN login (medido 16-oct-2026, entorno «Onia»):** funciona. Chromium abre
  `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BO&q=<término>&search_type=keyword_unordered`
  (el documento responde 403 pero la página se pinta igual), a los ~9 s ya hay tarjetas con **imagen/video, texto, anunciante,
  fechas de inicio y fin, plataformas y «Library ID»**; «N results» sale en el encabezado (`dental` BO >50.000, `Nike` BO ~22.000).
  Scroll con `page.mouse.wheel` carga más. Trampas: (1) tras 3-4 consultas seguidas Meta contesta
  `{"errors":[{"message":"Rate limit exceeded"...}]}` en `/api/graphql/` y la página muestra **«No hay ningún anuncio…»
  FALSO** (Nike BO salió vacío): espaciar consultas y, ante un vacío, repetir con un término seguro antes de concluir;
  (2) algunos videos dicen «Sorry, we're having trouble playing this video» (no se pueden ver en vivo; la imagen sí);
  (3) «Doctocliq» en Bolivia da 0 resultados reales (el término sí cargó datos: `dynamic_filter_options` vacío). Sin cuentas
  ni login. Para los creativos de video completos sigue valiendo la madre en la PC.
- **Investigar páginas públicas desde la nube (16-oct):** `WebFetch` trae y resume bien (lety.ai: titular y condiciones en
  segundos); Chromium falla en algunos sitios con `ERR_CONNECTION_RESET` (`hormozi.com`) o navegación interrumpida (`lety.ai`):
  la red no deja pasar todos los hosts, así que se prueba WebFetch primero y Chromium si hace falta captura.
- **Camino de la PC (sesión de control, 16-oct):** en Chrome con sesión, `fetch('/api/v1/media/<id>/info/', {headers:
  {'x-ig-app-id':'936619743392459'}, credentials:'include'})` da caption, contadores y `media_type` (1 imagen, 8 carrusel); láminas
  de imagen por flecha + captura (`?img_index=N`). Fallaron: embed por `curl` (shell JS vacío), descargas encadenadas desde Chrome
  (solo aterriza la primera).
- **VPS desde esta nube:** `ONIA_VPS_SSH_KEY_B64` SÍ existe en el entorno, pero `ssh root@187.77.16.63` da `Connection timed
  out` (puerto 22) y el alias `onia-vps` no resuelve: el túnel no está en este entorno. No hace falta: yt-dlp + Chromium
  locales resuelven reels y carruseles. Transcripción de audio de un reel sigue necesitando el VPS o Whisper local.
⚠ **En una nube SIN `ssh` ni `yt-dlp`** (entorno «onia-higgsfield», 5-oct-2026, TikTok de @kevinarce98): `transcribe.sh`
falla con «scp al VPS falló». Camino que funcionó, todo dentro del contenedor y sin VPS:
`pip install "yt-dlp[default,curl-cffi]" faster-whisper` → bajar con `fetch-video.mjs` → transcribir con `faster-whisper`
y el mismo modelo del VPS (`Systran/faster-whisper-small`) → corregir con los subtítulos del video las palabras que
oyó mal. Sin clave de Gemini, la edición se mira por cuadros: 1 por segundo, los primeros 3 s cuadro por cuadro y las
transiciones más lentas. La música y los efectos se deducen del nivel y del espectrograma en las pausas: decirlo así en
la ficha, porque el audio no se escuchó.
Un JSON con `text` vacío es respuesta válida: el audio no tiene voz (así se confirmó que ese reel es solo música). `scripts/transcribe.sh` usa ese camino (base64 → SSH → docker exec en onia-center → Speaches). Detalle de infra: [[onia-hermes-stack-y-radar]].

### Transcribir en la nube sin GPU, sin VPS (medido 16-oct-2026)
Instalar una vez por contenedor: `python3 -m pip install faster-whisper "yt-dlp[default,curl-cffi]" "av==15.1.0"`
(⚠ **`av` 19 rompe faster-whisper** con `TypeError: open() got an unexpected keyword argument 'metadata_errors'`; fijar `av==15.1.0`).
Uso: `python3 -I .claude/skills/ver-videos/scripts/transcribe-local.py <audio|video> [small|base|tiny] [es]` → JSON con
`segments[]` y tiempos. CPU 4 núcleos, int8, modelo `small`: **17 s de audio en 6 s** (~0,35x), carga 2 s. Español con ruido de fondo:
`small` acierta todo salvo nombres propios; el script ya pasa un `initial_prompt` con «Sergio Urcullo, Onia Platform, WhatsApp…»
y con eso `small` corrigió «Cononia» → «Onia Platform». `tiny` y `base` fallan más nombres y cifras: usar `small`. Agregar al
`PROMPT` del script los nombres del video antes de correr. Probado con TTS en español (no con voz real de Sergio Urcullo).
- **Carrusel de Instagram con láminas en video:** `yt-dlp` baja las láminas mp4 (8 de `/p/DecFE1oDNd3/`) pero **no tienen pista de
  audio** (`ffprobe` solo `video`): no hay nada que transcribir, se leen por cuadros. Un post de imagen única da «There is no video in this post».
- **YouTube desde la nube:** `yt-dlp` lista pero el medio da **HTTP 403** por el proxy; Wikimedia limita por peticiones. Los videos de
  YouTube se transcriben desde la PC. Instagram sí baja.
- **Variante medida el 17-oct (bruto de Drive, otro entorno):**
  - **Bajar el bruto:** el MCP de Drive solo baja hasta 10 MB. Si el archivo está compartido por enlace (`get_file_permissions` →
    `anyone`), `curl -L "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t"` baja 70-250 MB sin login.
  - **Transcribir:** `python3 -m venv` + `pip install faster-whisper`; modelo `small`, `language="es"`, CPU int8. 109 s de video →
    34 s. El `av` instalado falla con `metadata_errors`: decodificar antes con
    `ffmpeg -i v.mp4 -ac 1 -ar 16000 -f f32le -` y pasar el arreglo numpy a `transcribe()`.
  - **Pausas para la tabla de cortes:** `ffmpeg -af silencedetect=n=-35dB:d=0.5`.
  - La transcripción confunde nombres propios (Claude→«Cloud», Anthropic→«Antropic», Sonnet→«Sonet»): corregir antes de citar.

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

**Actualización 9-oct-2026:** este mínimo se amplía con `aprender-de-todo`: revisar las doce dimensiones y marcar no observado/no aplica en vez de inventar. Link sin instrucción = aprender, no producir. Ficha → regla en skill → prueba de uso por una sesión: hasta ese último paso queda «incorporado», no «aplicado». Cobertura de la semana: `hermes-content/references/video-intake/COBERTURA-APRENDIZAJE.md`.

**Lección del 8-oct:** la ficha `2026-10-08-referente-gadzhi.md` §0.3 documenta que el CLI de `gemini-see-video.mjs` ignoró el segundo argumento de prompt. Para una pasada de edición específica, usar el método documentado `seeLocalVideo(path, prompt)` y comprobar la respuesta; no dar por ejecutado un prompt solo porque se pasó un argumento. En `2026-10-09-reel-DePBfHouarG.md` falló la transcripción: no concluir ausencia de voz ni medir montaje desde una muestra de cuadros.

No alcanza con resumen y timeline. Cada video se analiza en tres partes:
- **mensaje**: qué dice y a quién;
- **tema**: por qué rinde;
- **edición**: cortes por cada 10 s; subtítulos (tipo, posición, animación); transiciones, zooms, b-roll, sonido y
  música; los primeros 3 s cuadro por cuadro.

A Gemini se le hace una segunda pasada con un prompt solo de edición, y `text-frames.mjs` lee el texto en pantalla. La
ficha va a `hermes-content/references/video-intake/`.

## Historias de otras cuentas — `scripts/ig-historias.mjs` (8-oct-2026)

```bash
ONIA_RAIZ=C:/dev/proyectos/onia-hermes node .claude/skills/ver-videos/scripts/ig-historias.mjs \
  --cuentas eriktaveras,sanmunoz.ia --destacadas 4 --out hermes-content/research/competencia/historias/<fecha> \
  --videos C:/dev/proyectos/onia-hermes/.hermes/ig-historias/<fecha>
```

Baja las historias activas y las primeras N destacadas, con la sesión de IG de la PC. Deja un `.jpg` por historia y un
`meta.json` con los stickers (link, encuesta, pregunta, mención, música, post compartido): eso es lo que se copia de su
estructura. Los mp4 van fuera del repo.

**Trampas medidas el 8-oct:**
- **429 desde la primera llamada**, después de varias pruebas de `ig-radar.mjs` ese mismo día. La sesión de IG aguanta
  pocas llamadas por día: una corrida por día y para todo, no por cuenta. Con 429 no se reintenta: se programa para el
  día siguiente.
- **Chrome con la ventana oculta (Sergio Urcullo fuera de la PC) congela la pestaña:** el renderer no responde a capturas
  ni a JavaScript (`Runtime.evaluate timed out`). Con la PC sin uso, la ruta del navegador no sirve; queda la API.

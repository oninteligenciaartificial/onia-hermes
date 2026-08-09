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

- **TikTok / YouTube:** `yt-dlp` directo, cero cookies, cero navegador (~4 s medidos).
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

## Intervalo de fotogramas (heurística)
| Duración | fps de extracción | intervalo | cuadros aprox |
| --- | --- | --- | --- |
| < 2 min | 1/5 | 5 s | 24-72 |
| 2-10 min | 1/15 | 15 s | 8-40 |
| 10-30 min | 1/25 | 25 s | 24-72 |
| > 30 min | 1/45 | 45 s | 40+ |

`see-video.sh` calcula esto solo desde la duración (ffprobe).

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

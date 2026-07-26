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
Claude no reproduce video nativamente. Esta skill convierte cualquier video en cosas que Claude SÍ
lee: **audio → transcript** (lo que se dice) + **fotogramas muestreados → visión** (lo que se ve) +
un **resumen estructurado con timeline**. Es la base de `editor-videos` y de todo research de video.

**Principio (honestidad):** el audio se cubre al **100%** (transcript completo); los fotogramas se
**muestrean** repartidos por la línea de tiempo. Al reportar, decí la cobertura real
("audio 100%, vi N de M fotogramas") — nunca afirmes "vi el video" desde 2 cuadros.

## Pipeline
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

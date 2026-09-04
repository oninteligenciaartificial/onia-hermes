# Q05 · El skill /watch: fotogramas + transcripción, y por qué el nuestro se rompió hoy

- **Destino:** `editor-de-videos`
- **Sale de:** [la ficha](../2026-08-24-skill-watch-fotogramas-mas-transcripcion.md) · `DcTqPvUEq4v` · @openclaw (comment "SEND")
- **Fuente:** https://www.instagram.com/p/DcTqPvUEq4v/
- **Qué falta para hacerlo hoy:** Una API key de Groq (free tier). Nada más: yt-dlp y ffmpeg ya están.

---

```text
Objetivo único: que la transcripción del carril de video deje de depender de Speaches en el VPS, agregando Groq como respaldo automático.

POR QUÉ, con el fallo medido: el 2026-08-23 se transcribieron 26 videos de la cosecha del DM y `transcribe.sh` devolvió {"ok":false,"error":"fetch failed"} en TODOS — primero con 3 en paralelo y después de a uno. `curl /v1/models` en el VPS respondía OK. Resultado: un lote entero analizado sin audio. El camino actual hace scp del mp3 + ssh al VPS, así que cualquier hipo de red o de carga lo tumba.

Referencia externa (no copiar código, solo la decisión): el skill público `bradautometes/claude-video` resuelve lo mismo con yt-dlp + ffmpeg + Groq, y declara 5 horas de video transcritas por ~39 centavos, con free tier de 2 h por hora.

Pasos:

1) Worktree propio, `git branch --show-current` antes de tocar nada.

2) En `.claude/skills/ver-videos/scripts/transcribe.sh`, agregar un TERCER camino después de los dos que ya existen (host del VPS, y red interna de onia-center): si ambos fallan y hay `GROQ_API_KEY` en el entorno, mandar el audio a la API de Groq (modelo whisper-large-v3-turbo) por HTTPS directo, sin scp ni ssh.

3) Mantener el MISMO contrato de salida que ya consume el resto del carril: {ok, model, duration, n_segments, n_words, segments[], words[]}. Si cambia el shape, se rompen preparar.sh y las fichas.

4) Respetar la trampa ya registrada: NO forzar el idioma (va ONIA_AUDIO_STT_LANGUAGE=auto). Forzarlo hace que traduzca en vez de transcribir.

5) Agregar una guarda que ya nos costó caro: si la respuesta trae duration=0 y 0 segmentos, eso NO es "sin voz", es fallo — devolver ok:false con el error. Hoy 25 de 26 videos se reportaron como SIN_VOZ cuando en realidad la llamada había fallado, y la pista fue justamente duration=0.

6) Probar contra un video con voz confirmada y contra uno sin voz, y dejar los dos resultados escritos en el commit.

LISTO = `bash transcribe.sh <audio.mp3>` devuelve un JSON válido con segmentos aunque el VPS esté caído, y un video mudo devuelve ok:true con 0 segmentos y duration > 0 (no 0).
```

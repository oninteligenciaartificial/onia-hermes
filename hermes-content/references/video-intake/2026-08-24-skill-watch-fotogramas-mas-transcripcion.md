# El skill /watch: fotogramas + transcripción, y por qué el nuestro se rompió hoy

- **Fuente:** https://www.instagram.com/p/DcTqPvUEq4v/ · @openclaw (comment "SEND")
- **Tipo:** IA · **Veredicto:** SIRVE YA
- **Cobertura:** las 18 láminas, al 100%. Sin audio (es carrusel).

> ⚠️ **Sin audio.** Speaches devolvió `fetch failed` en todo este lote y el anterior. Nada de
> lo que sigue afirma qué se *dice* en el video: sale del texto en pantalla y del caption.

## Qué muestra, textual

- **Portada:** *"my Claude can instantly watch any video"*.
- **Lámina 2:** *"Most video tools only grab the **transcript**. But half the good stuff in a video isn't spoken out loud — it's shown on screen. Graphs, charts, on-screen text. Transcript-only tools **miss** all of that."*
- **Lámina 3:** *"A video is really just two things: pictures and words."* El skill agarra **screenshots cada pocos segundos + transcripción con timestamps**.
- **Instalación (literal, leído en pantalla):** `/plugin marketplace add bradautometes/claude-video` y después `/plugin install watch@claude-video`. Es un skill de GitHub, MIT.
- **Uso:** en Claude Code, `/watch` y pegar el link.
- **Rendimiento declarado:** una clase de 45 minutos, entera, en menos de 2 minutos.
- **Herramientas:** *"Two old, free, rock-solid tools do everything: **YT-DLP** downloads the video, and **FFMPEG** turns it into screenshots and audio."*
- **Transcripción:** primero usa los captions gratis del video; si no hay, **Whisper**. En pantalla: **Groq**, free tier de **2 horas de transcripción por hora**.
- **Costo declarado:** *"Over 5 hours of video, fully transcribed: about **39 cents** total."*
- **Casos de uso mostrados:** (1) desarmar un gancho viral fotograma a fotograma; (2) hacer zoom a un solo momento del video pasando inicio y fin, *"saving time and tokens"*.

## Cómo está hecho — la reconstrucción

- Es exactamente la arquitectura de nuestro `ver-videos`: bajar con yt-dlp, fotogramas con ffmpeg, transcripción aparte. **No hay nada que copiar en el motor.**
- Lo que SÍ aporta, y es lo caro de este lote: **el proveedor de transcripción**. Nuestro `transcribe.sh` va contra Speaches en el VPS por scp+ssh, y hoy devolvió `fetch failed` en los 26 videos de la cosecha — en paralelo y también de a uno, con `/v1/models` respondiendo OK. Todo un lote se analizó mudo.
- Groq como respaldo quita esa dependencia: es HTTP directo, no scp al VPS, y el free tier declarado (2 h por hora) cubre lotes como los nuestros.
- Y el argumento de la lámina 2 es literalmente el hallazgo del lote del 23-ago: **12 de 13 reels no tenían voz**; el contenido estaba en pantalla. Un pipeline que solo transcribe habría devuelto vacío en los 12.

## El estilo, como conocimiento portable

Ilustración pixel-art de mascota naranja sobre fondo hueso `#FAF7F2`, tipografía sans geométrica pesada con **una palabra en naranja `#E8590C`** por titular (el resto negro). Numeración de lámina arriba-izquierda en mayúsculas chicas. Cada lámina: titular grande + captura real + dos bullets con icono. La mascota hace de narrador y aparece en TODAS, que es lo que da continuidad al carrusel de 18 sin cansar.

**Se porta a:** El molde de carrusel largo (18 láminas con mascota-narrador) a `hermes-content/references/ui-patterns/`; la decisión técnica va a la skill `ver-videos`.

## Las tres preguntas

1. **Frente:** editor de videos / `ver-videos` — es una mejora a nuestra propia herramienta, no contenido.
2. **Herramienta nuestra:** La skill `ver-videos` ya existe y hace lo mismo. Lo que falta es el respaldo de transcripción.
3. **Qué falta:** Una API key de Groq (free tier). Nada más: yt-dlp y ffmpeg ya están.

## Lo que NO se puede afirmar

- Nada sobre el audio: no hay transcripción de este lote.
- Los hex de esta ficha son aproximados salvo donde diga que están escritos en pantalla.

**Prompt:** [Q05](prompts-lote-2026-08-24/Q05-skill-watch-fotogramas-mas-transcripcion.md)

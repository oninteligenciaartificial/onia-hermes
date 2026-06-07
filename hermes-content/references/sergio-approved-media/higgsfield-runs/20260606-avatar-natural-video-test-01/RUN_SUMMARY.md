# Sergio Natural Avatar Video Test 01

## Objetivo

Probar una animacion corta y muda de la ultima base de avatar natural multireferencia de Sergio, sin voz ni lipsync, para validar si el rostro se mantiene estable antes de pasar a una prueba con audio.

## Fuente

- Imagen original: `source/sergio-natural-multiref-source.png`
- Start frame Kling: `source/kling-start-sergio-natural-1152x2048.jpg`

## Prompt

- `prompts/kling3-natural-motion-no-voice.txt`

## Herramienta prevista

- Higgsfield CLI
- Modelo: `kling3_0`
- Modo: `4k`
- Duracion: `5s`
- Audio: `sound off`

## Estado

Generado y validado localmente.

## Job

- Higgsfield job ID: `f512f3da-f976-42a0-8249-bad4907d3c7d`
- Modelo: `kling3_0`
- Costo estimado/validado: `30` creditos
- Salida local: `outputs/sergio-natural-avatar-kling3-motion-4k.mp4`
- Contact sheet QA: `qa/sergio-natural-avatar-kling3-motion-contact-sheet.jpg`

## Validacion

- Resolucion: `2160x3840`
- Duracion: `5.041667s`
- FPS: `24`
- Audio: sin stream de audio, `sound off`
- QA visual por frames: rostro estable, boca cerrada/sin habla, movimiento sutil.

## Voz

No se usa voz en esta prueba. Para clon o lipsync con voz de Sergio se requiere autorizacion explicita y muestra limpia.

Material ya existente revisado:

- `voice-inbox/IMG_0217.wav`: 90.56s
- `voice-inbox/IMG_0218.wav`: 91.45s
- `talking-video-lock/20260605-drive-1hiyemo-source-lock/audio/source-16khz-mono.wav`: 28.71s
- `final-avatar-identity-lock/20260605-upload-0405-0409/raw/IMG_0406.MOV`: 30.8s

Recomendacion: usar los audios existentes solo como referencia de ritmo y energia. Para una voz clonada o lipsync de mayor calidad, grabar 2-5 minutos nuevos en ambiente silencioso.

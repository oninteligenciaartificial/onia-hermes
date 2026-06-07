# Round 17 - Mara apartment storytime motion reference

Fecha: 2026-06-06
Estado: borrador interno, no publicado
Herramientas: TikTok reference analysis, Higgsfield CLI, Kling 3.0, ffmpeg
Modelo visual final: Kling v3.0
Audio: Round 16, Eleven v3 Roxie
Objetivo: crear un preview vertical de Mara en formato storytime, usando una
referencia de movimiento conversacional sin copiar identidad, voz, relato ni
gestos reconocibles de una creadora real.

## Referencia analizada

URL:

`https://www.tiktok.com/@emilyann_music/video/7648114213558160654?lang=es&q=storytime&t=1780750023621`

Observacion permitida:

- Video storytime vertical de 2:49.
- Primerisimo plano tipo telefono.
- Energia de relato personal, directa a camara.
- Movimiento conversacional: inclinacion hacia camara, microgestos, mirada
  viva, cambios sutiles de cabeza y expresion.
- Descripcion visible: "This is the story of the time I got a misdemeanor and
  almost went to jail.. part 3".

Nota legal/creativa: no se transcribio ni copio el guion completo del TikTok.
La referencia se uso solo como patron estructural de movimiento, encuadre y
ritmo.

## Transcripcion usada para Mara

```text
Anoche casi borre este video.
Me vi en la pantalla y pense:
otra vez estoy intentando gustarle a todos.
Respire, no corregi nada,
y entendi algo:
encontrarte empieza cuando dejas de editarte.
```

Archivo SRT:

`video-ads/apartment-storytime-motion-ref/20260606-mara-roxie-storytime-transcript.srt`

## Generacion intentada

### Seedance 2.0

Estado: fallido

Job ID:

`d48bbb6b-616f-48f4-a1ae-9bc612d05428`

Input:

- start image: `identity-bank-50/photos/mara_identity_02.jpg`
- audio: `audio/20260606-mara-elevenv3-roxie-storytime-v2-young.mp3`
- aspect ratio: `9:16`
- duration: `15`
- resolution: `720p`

Costo estimado:

`67.5` creditos

Resultado:

El job acepto imagen y audio, pero termino en estado `failed`, sin URL final.

### Kling 3.0 fallback

Estado: completado

Job ID:

`f841a708-fbd5-4cc0-be75-a64c3d3fadc6`

Fuente generada:

`https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260606_133422_f841a708-fbd5-4cc0-be75-a64c3d3fadc6.mp4`

Costo estimado:

`22.5` creditos

## Archivos locales

Carpeta:

`video-ads/apartment-storytime-motion-ref/`

Archivos:

- `20260606-mara-apartment-storytime-kling3-motion-ref-v1-raw.mp4`
- `20260606-mara-apartment-storytime-kling3-roxie-v1-final.mp4`
- `20260606-mara-apartment-storytime-kling3-roxie-v1-captioned.mp4`
- `20260606-mara-roxie-storytime-transcript.srt`
- `20260606-mara-apartment-storytime-captioned-preview.jpg`

## Validacion tecnica

Raw Kling:

```text
812x1132
15.041667s
24 fps
```

Final con voz:

```text
720x1280
16.416667s
24 fps
audio AAC mono 44100 Hz
audio duration: 16.400000s
```

Final subtitulado:

```text
720x1280
16.416667s
24 fps
audio AAC mono 44100 Hz
audio duration: 16.400000s
```

## QA creativo

Puntos buenos:

- Identidad de Mara razonablemente estable.
- Voz joven Roxie montada completa, sin cortar la frase final.
- Movimiento de storytime presente: mirada, boca, cabeza y gesto sutil.
- A mitad del clip aparece ambiente de departamento con lampara y ventana.
- Formato final corregido a 720x1280 para Reels/TikTok/Shorts.

Limitaciones:

- El lipsync no es exacto porque Kling no acepto el audio como driving input.
- El inicio del clip sale demasiado neutro, con pared blanca antes de mostrar el
  departamento.
- Los subtitulos son una transcripcion manual temporizada, no STT validado.
- No es publicable sin revision humana de boca, identidad y audio.

## Decision

Esta version sirve como preview de movimiento y voz joven. Para una toma final
publicable, la mejor siguiente ruta es usar este MP4 como base visual y aplicar
lipsync dedicado con el audio Roxie, o regenerar en Kling con prompt reforzado
para mostrar departamento desde el primer frame.

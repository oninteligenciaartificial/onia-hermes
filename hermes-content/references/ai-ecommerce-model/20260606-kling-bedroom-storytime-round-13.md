# Round 13 - Bedroom storytime talking video

Fecha: 2026-06-06
Estado: borrador interno, no publicado
Modelo generado: Kling 3.0 (`kling3_0`)
Motivo de fallback: Seedance 2.0 esta disponible, pero en la integracion CLI
actual no acepta parametros de voz, audio ni lipsync. Kling 3.0 si permite
`sound: on`, por eso se uso para intentar voz y boca en una sola generacion.
Referencia de identidad: `identity-bank-50/photos/mara_identity_02.jpg`
Upload ID referencia: `70d8a737-1241-4747-bce6-619afb62d2d3`
Formato final: 9:16, 1080x1920, 15.10s
Job Kling valido: `b892a999-3024-43b0-a4ff-da173cd5df33`
Job descartado: `35a82518-6674-43c9-9720-fb2519109974` porque salio default
5s horizontal y no respeto parametros.

## Objetivo

Crear un video storytelling intimo, emocional y realista de Mara Vale hablando
directamente a camara desde su habitacion, como Reel/TikTok/Short personal.

## Historia completa

Mara esta grabando de noche desde su habitacion. Empieza confesando que casi
borra el video porque se vio en pantalla y noto que otra vez estaba tratando de
gustarle a todos. El conflicto no es su apariencia, sino la costumbre de editarse
para encajar. El giro emocional es que por primera vez decide no corregir nada.
La frase final transforma el conflicto en una reflexion memorable.

## Guion exacto de voz

```text
Anoche casi borro este video. Me vi en la pantalla y pense: otra vez estoy
intentando gustarle a todos. Apague el telefono, respire, y por primera vez no
corregi nada. A veces encontrarte empieza cuando dejas de editarte.
```

## Texto en pantalla

- `Anoche casi borro este video.`
- `Me vi en la pantalla y pense:`
- `Otra vez estoy intentando gustarle a todos.`
- `Apague el telefono, respire y no corregi nada.`
- `A veces encontrarte empieza cuando dejas de editarte.`

## Escena final

Mara sentada en su habitacion, con luz calida de lampara, cama al fondo,
cabecera oscura, ropa crema, fondo suavemente desenfocado, close-up/medio corto,
mirada directa a camara y energia vulnerable pero elegante.

## Voz sugerida

Mara Voice v1 / Kling native voice:

- mujer joven adulta;
- espanol LATAM;
- calida, emocional, cercana;
- ritmo de confesionario personal;
- sin tono de anuncio;
- pausas suaves y sonrisa audible.

Nota: el audio final proviene de Kling 3.0 con `sound: on`. No se pudo validar
transcripcion exacta con STT local; requiere revision auditiva antes de publicar.

## Archivos

Carpeta:

`video-ads/bedroom-storytime-kling/`

- Raw descartado del intento 1: generado por job `35a82518-6674-43c9-9720-fb2519109974` pero no guardado como final.
- Raw valido: `20260606-mara-bedroom-storytime-kling3-pro-audio-raw.mp4`
- Captions ASS: `20260606-mara-bedroom-storytime-captions.ass`
- Final: `20260606-mara-bedroom-storytime-kling3-pro-audio-final.mp4`
- Audio extraido: `20260606-mara-bedroom-storytime-kling3-pro-audio-extract.mp3`
- QA raw:
  - `20260606-mara-bedroom-storytime-kling3-pro-raw-qa-01.jpg`
  - `20260606-mara-bedroom-storytime-kling3-pro-raw-qa-02.jpg`
  - `20260606-mara-bedroom-storytime-kling3-pro-raw-qa-03.jpg`
  - `20260606-mara-bedroom-storytime-kling3-pro-raw-qa-04.jpg`
- QA final:
  - `20260606-mara-bedroom-storytime-kling3-pro-final-qa-01.jpg`
  - `20260606-mara-bedroom-storytime-kling3-pro-final-qa-02.jpg`
  - `20260606-mara-bedroom-storytime-kling3-pro-final-qa-03.jpg`
  - `20260606-mara-bedroom-storytime-kling3-pro-final-qa-04.jpg`

## Prompt ejecutado en Kling 3.0

```text
15-second vertical 9:16 ultra-realistic intimate storytelling video. Same fictional adult woman Mara Vale from identity reference, exact same face, freckles, green-hazel eyes, nose, lips, jawline, copper-red wavy hair, very fair skin, same age and body, elegant calm luxury presence. She sits in her bedroom at sunset/night speaking directly to camera like a personal Reel confession. Warm lived-in elegant bedroom: soft bed, warm bedside lamp, nightstand, subtle decor, cream textiles, natural shadows, background slightly blurred. Eye-level short medium close-up, stable subtle handheld phone-style camera. Natural blinking, human eye contact, microexpressions, subtle hand gestures, emotional pauses, realistic jaw movement, precise mouth shapes, accurate lip sync. Warm emotional female Spanish LATAM voice. She says exactly: Anoche casi borro este video. Me vi en la pantalla y pense: otra vez estoy intentando gustarle a todos. Apague el telefono, respire, y por primera vez no corregi nada. A veces encontrarte empieza cuando dejas de editarte. Premium cinematic realism, natural skin texture, high detail, stable face, clean image, warm lamp light, no text, no subtitles, no watermark, no logos. Avoid identity drift, different face, bad lip sync, robotic voice, dead eyes, stiff body, deformed hands, weird mouth, plastic skin, cartoon, anime, blur, flicker, unstable lighting.
```

Parametros:

```text
aspect_ratio: 9:16
duration: 15
mode: pro
sound: on
start_image: mara_identity_02.jpg
```

## Prompt optimizado para Seedance 2.0

Seedance 2.0 no acepta audio/lipsync en la CLI actual. Usar este prompt solo
para visual base, y luego aplicar lipsync con herramienta externa.

```text
15-second vertical 9:16 ultra-realistic intimate storytelling video. Same fictional adult woman Mara Vale from identity reference, exact same face, freckles, green-hazel eyes, nose, lips, jawline, copper-red wavy hair, very fair skin, same age and body, elegant calm luxury presence. She sits in her bedroom at sunset/night speaking directly to camera like a personal Reel confession. Warm lived-in elegant bedroom: soft bed behind her, warm bedside lamp, nightstand, subtle decor, cream textiles, natural shadows, slightly blurred background. Eye-level short medium close-up, stable subtle handheld phone-style camera. She appears to be speaking softly and emotionally to camera, with natural blinking, human eye contact, microexpressions, subtle hand gestures and soft pauses. Premium cinematic realism, natural skin texture, high detail, stable face, clean image, no flickering, no text, no watermark, no logos. Avoid identity drift, different face, bad mouth movement, robotic expression, dead eyes, stiff body, deformed hands, weird mouth, plastic skin, cartoon, anime, blurry video, unstable lighting, distorted bedroom.
```

Parametros recomendados:

```text
aspect_ratio: 9:16
duration: 15
resolution: 1080p
mode: std
genre: drama
start_image: mara_identity_02.jpg
```

## Alternativa Kling + lipsync dedicado

1. Generar visual con Kling 3.0 o Seedance 2.0 sin audio, instruyendo boca
   neutral o habla suave.
2. Generar voz original en ElevenLabs con perfil Mara Voice v1.
3. Aplicar lipsync con HeyGen, Runway Act/Video-to-Video compatible, Sync Labs
   o herramienta equivalente.
4. Exportar 9:16 1080p, quemar captions en ffmpeg y validar boca/frame a frame.

Prompt lipsync:

```text
Use the provided video and audio. Preserve the exact same Mara Vale identity:
same face, freckles, eyes, nose, lips, jawline, copper-red wavy hair, fair skin,
age appearance and body. Apply precise lip sync only. Do not change her face,
hair, skin, body, wardrobe, lighting or background. Natural jaw movement,
accurate mouth shapes, no delay, no robotic mouth, no identity drift.
```

## Edicion

- Raw descargado desde Kling.
- Crop a 9:16 real: `crop=956:1700:130:0`.
- Escalado a 1080x1920.
- Audio normalizado para social.
- Captions quemados estilo Reel.
- Audio extraido como MP3 para revision.

## QA

| Criterio | Score | Nota |
|---|---:|---|
| Identidad Mara | 91 | Rostro, pelo, ojos y pecas se mantienen bien. |
| Habitacion realista | 84 | El inicio arranca con fondo limpio, luego aparece cama y lampara. |
| Actuacion emocional | 90 | Mirada, pausa y microexpresiones funcionan. |
| Voz/audio | 80 | Audio integrado existe y esta a buen nivel; falta revision auditiva exacta. |
| Lipsync probable | 78 | Mejor que overlay manual, pero requiere verificacion humana. |
| Captions | 94 | Legibles y sincronizados al guion objetivo. |
| Calidad visual | 90 | Close-up premium, piel natural, luz calida. |
| Listo para publicar | 76 | Buen borrador interno; publicar solo tras revision auditiva/lipsync. |

## Decision creativa

Esta version es la mejor prueba hasta ahora para Mara hablando de forma intima:
la cara se mantiene, la emocion aparece y el guion tiene una frase final fuerte.
Para una version 100% publish-ready conviene rehacer con lipsync dedicado o
validar auditivamente que Kling dijo el guion completo con buena sincronizacion.

# Round 14 - Word-perfect lipsync + motion workflow

Fecha: 2026-06-06
Estado: workflow listo para ejecutar, pendiente de video referencia o herramienta
de lipsync conectada
Modelo/personaje: Mara Vale

## Objetivo

Crear videos donde Mara hable palabra por palabra, con lipsync preciso y mas
movimiento corporal natural, sin perder identidad.

## Decision tecnica

No usar Kling, Seedance o Veo como unica generacion cuando el guion debe salir
palabra por palabra. Los modelos de video con audio nativo pueden cambiar,
resumir o reinterpretar el texto.

La ruta correcta es:

```text
Guion exacto -> audio exacto -> video con movimiento -> lipsync dedicado ->
STT/transcripcion -> QC palabra por palabra -> master final
```

## Mejor workflow

### Ruta A - Maxima precision con movimiento real

Usar cuando Sergio pase un video de una persona actuando los movimientos.

1. Recortar video referencia a 15-30s.
2. Verificar que haya consentimiento de uso si es una persona real.
3. Extraer solo movimiento, gestos, ritmo, postura y expresion general.
4. Generar o seleccionar referencia de Mara:
   `identity-bank-50/photos/mara_identity_02.jpg`.
5. Usar Runway Act-Two con:
   - driving performance: video referencia;
   - character input: imagen/video de Mara;
   - gesture control activo si se usa imagen de personaje.
6. Generar audio exacto con ElevenLabs o TTS controlado.
7. Pasar el output + audio exacto por Sync Labs o herramienta equivalente.
8. Transcribir audio final con Whisper/STT.
9. Comparar transcripcion contra guion exacto.
10. Si coincide, quemar captions y exportar master 1080x1920.

### Ruta B - Sin video referencia

Usar cuando no hay actor de referencia.

1. Generar visual base con Kling 3.0 o Seedance 2.0 sin audio.
2. Prompt con movimiento especifico:
   - se inclina hacia camara;
   - mira abajo un segundo;
   - se toca el pelo;
   - levanta la mano suavemente;
   - cambia postura;
   - pausa emocional;
   - vuelve a mirar a camara.
3. Generar audio exacto aparte.
4. Aplicar lipsync dedicado.
5. Validar palabra por palabra.

## Requisitos para video referencia

Ideal:

- vertical 9:16;
- 15-30 segundos;
- una sola persona;
- plano medio corto o close-up;
- cara visible todo el tiempo;
- manos visibles si queremos gestos;
- sin cortes;
- buena luz;
- movimientos naturales, no bruscos;
- no logos, marcas o musica protegida;
- la persona debe tener permiso para usar el video como referencia.

No importa si el actor no se parece a Mara. Solo usamos movimiento y actuacion,
no identidad ni voz.

## Guion base recomendado

```text
Anoche casi borre este video. Me vi en la pantalla y pense: otra vez estoy
intentando gustarle a todos. Apague el telefono, respire, y por primera vez no
corregi nada. A veces encontrarte empieza cuando dejas de editarte.
```

Version mas corta para 15s:

```text
Anoche casi borre este video. Me vi en la pantalla y pense: otra vez estoy
intentando gustarle a todos. Respire, no corregi nada, y entendi algo:
encontrarte empieza cuando dejas de editarte.
```

## Prompt de movimiento para video base

```text
15-second vertical 9:16 ultra-realistic intimate storytelling video. Same
fictional adult woman Mara Vale from identity reference, exact same face,
freckles, green-hazel eyes, nose, lips, jawline, copper-red wavy hair, very fair
skin, same age appearance, same body proportions and elegant calm luxury
presence. She is in a warm lived-in luxury bedroom at sunset/night, sitting on
the edge of the bed with a soft lamp and nightstand behind her, cream textiles,
natural shadows, background slightly blurred.

Movement direction: she starts very close to camera, then slowly leans back,
looks down for a beat, brushes a strand of hair behind her ear, lifts one hand
gently while speaking, shifts her shoulders, takes a small breath, then leans
slightly toward camera for the final line. Natural handheld camera motion,
eye-level angle, short medium close-up, expressive but subtle acting.

She appears to be speaking emotionally but the final lipsync will be applied in
post. Keep mouth movement minimal and natural, no exaggerated talking. Premium
cinematic realism, natural skin texture, stable face, realistic hands, warm lamp
light, no text, no subtitles, no watermark, no logos.

Avoid identity drift, different face, different person, dead eyes, stiff body,
deformed hands, weird mouth, plastic skin, cartoon, anime, blurry video,
flickering face, unstable lighting, distorted bedroom.
```

## Prompt para Runway Act-Two

```text
Character: Mara Vale, fictional adult red-haired woman from the provided
identity reference. Preserve the exact same face, freckles, green-hazel eyes,
nose, lips, jawline, copper-red wavy hair, fair skin, age appearance, body
proportions, elegant calm luxury energy and warm human presence. Do not create a
similar person.

Use the driving performance video only for movement, gestures, eye direction,
emotional rhythm, hand placement, body language and microexpressions. Do not
copy the actor identity, face, voice, clothing, logos or background. Keep Mara in
a warm luxury bedroom, vertical 9:16, intimate Reel style, eye-level camera,
natural motion, subtle handheld energy, realistic lighting, stable face, no
flicker, no watermark.
```

## Prompt para lipsync dedicado

```text
Use the provided video and exact audio. Apply lip sync only. Preserve the exact
Mara Vale identity: same face, freckles, green-hazel eyes, nose, lips, jawline,
copper-red wavy hair, fair skin, age appearance, body, wardrobe, lighting,
camera motion and background. Do not change identity. Precise mouth shapes,
accurate jaw movement, no delay, no robotic mouth, no face drift, no flicker.
The final spoken words must match the provided audio exactly.
```

## QC palabra por palabra

Checklist obligatorio:

1. Extraer audio final.
2. Transcribir con STT/Whisper.
3. Normalizar texto: minusculas, sin puntuacion, sin acentos.
4. Comparar contra guion original normalizado.
5. Si falta, cambia o agrega una palabra, no publicar.
6. Revisar manualmente 3 puntos:
   - inicio;
   - cambio emocional;
   - frase final.
7. Revisar boca en plano:
   - bilabiales: p, b, m;
   - vocales abiertas;
   - cierres de frase.

## Herramientas recomendadas

| Paso | Herramienta |
|---|---|
| Movimiento desde actor | Runway Act-Two |
| Visual base sin actor | Kling 3.0 Pro o Seedance 2.0 |
| Voz exacta | ElevenLabs o TTS controlado |
| Lipsync palabra por palabra | Sync Labs, HeyGen lipsync audio mode o equivalente |
| Transcripcion/QC | Whisper/STT + diff de texto |
| Edicion final | ffmpeg / CapCut / Premiere |

## Fuentes externas verificadas

- Runway Act-Two: driving performance + character image/video, gesto y
  movimiento hasta 30s.
  https://help.runwayml.com/hc/en-us/articles/42311337895827-Performance-Capture-with-Act-Two
- Sync Labs API: genera video lipsynced desde video + audio MP3/WAV.
  https://sync.so/docs/api-reference/api-overview
- Sync Labs Quickstart: API/SDK para generar lipsync.
  https://sync.so/docs/quickstart
- HeyGen API pricing/help: modo lipsync audio para subir audio propio.
  https://help.heygen.com/en/articles/10060327-heygen-api-pricing-explained

## Riesgos

- Sin herramienta dedicada de lipsync, no se puede garantizar palabra por
  palabra.
- Si el video referencia pertenece a otra persona, se necesita permiso de uso.
- No copiar identidad, voz, frases reconocibles, musica, logos o branding del
  video referencia.
- Para publicar, se requiere revision humana de audio y boca.

## Proximo paso concreto

Sergio debe pasar uno de estos dos insumos:

1. Video referencia de movimientos, idealmente 15-30s, vertical, una persona,
   sin cortes.
2. Acceso/API key de Sync Labs, HeyGen o Runway para ejecutar lipsync dedicado.

Con cualquiera de los dos, se produce una nueva ronda publish-ready.

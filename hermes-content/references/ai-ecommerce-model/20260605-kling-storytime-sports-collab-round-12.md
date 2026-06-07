# Round 12 - Kling storytime sports collab

Fecha: 2026-06-05
Estado: borrador interno, no publicado
Herramienta video: Higgsfield CLI
Modelo video: Kling 3.0 (`kling3_0`)
Herramienta voz: Edge TTS fallback local
Voz: Mara Voice v1, `es-MX-DaliaNeural`, rate +12%, pitch +2Hz
Referencia de identidad: `identity-bank-50/photos/mara_identity_02.jpg`
Upload ID referencia: `70d8a737-1241-4747-bce6-619afb62d2d3`
Formato final: 9:16, 1080x1920, 10.04s
Job Kling: `ef193d66-ea64-405f-bb86-39908d97b89d`

## Objetivo

Crear un video storytime de Mara Vale contando que recibio una primera
oportunidad con una gran marca deportiva, con energia emocionada, sonrisa
constante y estetica luxury.

El usuario pidio Nike. Para mantener seguridad legal y publicitaria, esta
version no usa logos, no muestra marcas y no afirma una colaboracion real con
Nike. Si existe autorizacion formal, se puede producir una variante explicita.

## Archivos

Carpeta:

`video-ads/storytime-kling-nike-dream/`

- Voz: `20260605-mara-storytime-sports-collab-voice-v1.mp3`
- Subtitulos VTT: `20260605-mara-storytime-sports-collab-voice-v1.vtt`
- Raw Kling: `20260605-mara-storytime-sports-collab-kling3-pro-raw.mp4`
- Captions ASS: `20260605-mara-storytime-sports-collab-captions.ass`
- Final: `20260605-mara-storytime-sports-collab-kling3-pro-final.mp4`
- QA raw:
  - `20260605-mara-storytime-sports-collab-kling3-pro-qa-01.jpg`
  - `20260605-mara-storytime-sports-collab-kling3-pro-qa-02.jpg`
  - `20260605-mara-storytime-sports-collab-kling3-pro-qa-03.jpg`
- QA final:
  - `20260605-mara-storytime-sports-collab-final-qa-01.jpg`
  - `20260605-mara-storytime-sports-collab-final-qa-02.jpg`
  - `20260605-mara-storytime-sports-collab-final-qa-03.jpg`

## Guion seguro

```text
No puedo creer esto... me llego una propuesta con una marca deportiva gigante.
Estoy nerviosa, emocionada y feliz. Siento que esto cambia todo.
```

## Prompt Kling 3.0

```text
10-second vertical 9:16 storytime video. Same fictional adult woman from the Mara Vale identity reference: preserve the exact same face, freckles, green-hazel eyes, copper-red wavy hair, fair skin, body proportions, soft warm smile, age appearance, elegant luxury energy. Selfie-style storytime in a bright premium sport-luxury apartment dressing area. Cream refined athletic outfit, no visible logos, no brand marks, no swoosh, no trademark graphics. Excited but elegant, smiling throughout, natural hand gestures, looking into camera as if sharing big news. Holds an unbranded cream tote or clean white sneaker box with no text. Premium cinematic social-media realism, natural motion, stable face identity, realistic hands, flattering soft daylight, luxury lifestyle, subtle camera movement, no generated text, no watermark, no extra people.
```

Parametros:

```text
aspect_ratio: 9:16
duration: 10
mode: pro
sound: off
start_image: mara_identity_02.jpg
```

## Edicion

- Raw descargado desde Kling y convertido a master final.
- Crop de seguridad para ocultar texto inventado en accesorio inferior.
- Escalado a 1080x1920.
- Audio normalizado a loudness social.
- Captions quemados en blanco con outline negro.

## QA

| Criterio | Score | Nota |
|---|---:|---|
| Identidad Mara | 88 | Rostro, cabello y pecas se mantienen; el primer plano queda algo mas close-up. |
| Sonrisa | 96 | Sonrisa presente casi todo el video. |
| Voz | 82 | Voz original natural para preview; no es clon ni ElevenLabs. |
| Storytime | 90 | Energia emocionada y directa a camara. |
| Estetica luxury | 86 | Limpia, premium, mas minimal que sport-heavy. |
| Riesgo legal | 92 | No logos, no Nike textual, no claim real. |
| Listo para revisar | 88 | Buen borrador interno para decidir tono de voz y direccion. |

## Decision creativa

El video funciona como primer test de voz + storytime. Tiene buen potencial para
contenido organico porque la cara esta cerca, la sonrisa conecta y el guion es
emocional. Para una version mas comercial de marca deportiva, producir una nueva
variacion con mas contexto visual sport-luxury, producto/unboxing controlado y
brand-safe props sin texto inventado.

## Riesgos antes de publicar

- No publicar como colaboracion real con Nike sin autorizacion verificable.
- No usar logos o marcas registradas sin permiso.
- La voz es un primer perfil original, no una voz clonada ni definitiva.
- Revisar audio en dispositivo movil antes de pauta.

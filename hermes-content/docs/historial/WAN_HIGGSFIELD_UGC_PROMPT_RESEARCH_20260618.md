# Wan + Higgsfield UGC Prompt Research 2026-06-18

Estado: interno, no publicado.

> **Superseded para plantillas de prompt (2026-08-18).** El esquema de prompt vigente vive en
> [`ONIA_PLANTILLAS_PROMPT_VIDEO_20260818.md`](ONIA_PLANTILLAS_PROMPT_VIDEO_20260818.md)
> (plantillas CINE y UGC). Este doc queda como research de junio sobre Wan open source.

Objetivo: recopilar los principios y prompts mas utiles para producir videos
UGC con modelos IA de Onia usando primero Wan open source como laboratorio y
despues Higgsfield como motor premium/final.

## Veredicto

Si Sergio se quedo sin saldo, no conviene recargar a ciegas. La investigacion
si vale la pena porque nos deja una bateria de pruebas precisa para cuando
vuelva la GPU.

Decision operativa:

```text
Wan open source = laboratorio barato de escenas cortas.
Higgsfield = acabado final cuando ya sabemos que escena, movimiento y guion
funcionan.
```

No pedir un UGC completo en una sola generacion. La ruta que menos rompe cara,
manos, producto y lipsync es dividir el video:

1. talking-head estable para lipsync;
2. product cutaway desde packshot real;
3. full-body B-roll desde still full-body aprobado;
4. audio ElevenLabs;
5. lipsync con Wan S2V / InfiniteTalk / Higgsfield;
6. edicion final con cortes y captions.

## Fuentes Actuales Revisadas

- Wan2.2 oficial: `https://github.com/Wan-Video/Wan2.2`
- ComfyUI Wan2.2 workflow: `https://docs.comfy.org/tutorials/video/wan/wan2_2`
- Wan2.2 S2V 14B: `https://huggingface.co/Wan-AI/Wan2.2-S2V-14B`
- InfiniteTalk: `https://github.com/MeiGen-AI/InfiniteTalk`
- Higgsfield MCP: `https://higgsfield.ai/mcp`
- Higgsfield cinematic prompt guide: `https://higgsfield.ai/blog/Prompt-Guide-to-Cinematic-AI-Videos`
- TikTok Creative Center / ads best practices: `https://ads.tiktok.com/business/creativecenter/`
- YouTube Shorts ads guidance: `https://support.google.com/google-ads/answer/16041697`

## Lo Que Aprendemos De Las Fuentes

### Wan

Wan2.2 es una familia fuerte para video open source, pero la parte util para
Onia no es "hacer el anuncio final completo". Lo util es probar acciones:

- estabilidad de rostro;
- si la mano puede sostener producto sin romperse;
- si el cuerpo se mueve o queda como foto con zoom;
- si el producto mantiene forma/color;
- si una escena sirve como B-roll.

Wan TI2V/I2V es buena para movimiento silencioso. Wan S2V o InfiniteTalk entran
despues para voz/lipsync, no antes.

### Higgsfield

Higgsfield conviene cuando ya tenemos:

- identidad/still aprobado;
- guion aprobado;
- estilo visual probado;
- referencias de movimiento;
- negative prompt claro.

No usar Higgsfield como "ruleta" de 20 intentos. Usarlo como motor final de
1-3 variantes cuando el laboratorio open source ya redujo incertidumbre.

### Short-form UGC

Los patrones actuales que si importan:

- hook en 0-2 segundos;
- producto visible temprano;
- camara vertical nativa;
- un solo beneficio o demostracion por clip;
- cortes cada 2-4 segundos en la version editada;
- CTA unico;
- claims seguros, sin testimonio falso.

## Reglas De Prompt Que Quedan

1. Un objetivo por clip.
2. El input manda: face-only no puede pedir full-body.
3. No pedir label perfecto generado. El label real se preserva por packshot,
   overlay o edicion.
4. Para lipsync, generar primero video estable con boca neutra.
5. Para cuerpo completo, empezar con un still full-body real/aprobado.
6. Para UGC, el prompt debe describir accion concreta, no solo estetica.
7. Evitar escenas multiples en un solo prompt.
8. Cada prompt debe tener hard fails: no face drift, no fake testimonial, no
   medical claim, no warped hands, no fake label text.

## Prompt Schema Ganador

```text
Use the input image as the exact source for [identity/product/body].
Create one silent vertical 9:16 [shot type] for a UGC skincare edit.
Subject: [who/what is visible].
Action: [one concrete motion, slow and measurable].
Camera: [phone camera, framing, stability, lens feel].
Setting: [one simple location].
Lighting: [soft daylight / bathroom / desk].
UGC feel: natural, believable, not overproduced.
Constraints: [identity/product/label/lips/mouth/hands].
Hard fails: [negative prompt].
```

## Prompts Wan Curados

### 1. Talking-Head Lipsync Source

Usar con imagen close-up aprobada de Lia o Mara. No usar para cuerpo completo.

```text
Use the input image as the exact identity source. Preserve the same fictional
adult UGC model: same face shape, eyes, eyebrows, nose, lips, smile, hair,
skin texture and age. Create a silent vertical 9:16 ultra-realistic talking-head
source clip for later lipsync. Medium close-up framing, shoulders visible,
eye-level phone camera, clean bright bathroom or warm apartment, soft daylight,
natural skin texture, no beauty filter.

Motion: subtle breathing, one natural blink, tiny head nod, very slight
shoulder movement. Lips stay almost closed and neutral, no real speech yet.
Friendly but calm UGC creator energy. Keep the face sharp and stable for the
whole clip.

No subtitles, no text overlays, no watermark, no fake testimonial, no medical
claim, no exaggerated mouth movement.
```

### 2. Product Cutaway From Packshot

Usar con la imagen del producto ISDIN como unico input.

```text
Use the input image as the exact product source. Create a silent vertical 9:16
product cutaway for a skincare UGC edit. The same light blue sunscreen bottle
is on a clean white bathroom vanity, soft daylight, realistic phone-camera
look. A hand gently places the bottle on the surface, steadies it for one
second, then the camera makes a tiny handheld push-in.

Keep the bottle shape, color and cap recognizable. Do not invent new readable
label text. The final edit can preserve the original label with overlay if
needed. No person face in this shot, no extra brands, no subtitles, no
watermark, no medical claims.
```

### 3. Full-Body Small Step

Usar solo con still full-body aprobado.

```text
Use the input image as the exact body, outfit and pose source. Create a silent
vertical 9:16 full-body UGC movement test. The whole body is visible from head
to shoes at the start. Clean warm apartment or bright bathroom, soft daylight,
realistic phone camera, no cinematic overproduction.

Motion: she starts standing full body, takes one small natural step toward the
camera, stops, shifts weight from one leg to the other, lifts the product to
chest level, looks briefly at the product, then looks back at the camera and
smiles slightly. Movement must include legs, hips, shoulders, arms, head and
natural weight shift.

No speech mouth, no sudden zoom, no scene change, no warped legs, no broken
fingers, no floating product, no fake label text.
```

### 4. Hand Texture Demo

Usar cuando el producto no necesita label visible.

```text
Create a silent vertical 9:16 UGC skincare texture demo. Medium close-up of
hands on a clean bathroom counter, soft daylight. A small amount of sunscreen
is applied to the back of one hand and gently spread with two fingers. Natural
slow movement, realistic skin texture, realistic fingers, clean product-demo
feel.

The bottle can appear blurred in the background, but do not try to recreate
readable label text. No face required, no subtitles, no watermark, no medical
claims, no before-after result.
```

### 5. Desk Review Opener

Usar como B-roll social, no como testimonio real.

```text
Create a silent vertical 9:16 UGC product desk opener. A clean desk with soft
daylight, notebook and phone out of focus. The creator's hand brings the
skincare bottle into frame, places it beside the phone, then taps the cap once
and rotates the bottle a few degrees. Realistic handheld phone camera, natural
micro shake, product clear but label text does not need to be generated.

No face, no fake review, no subtitles, no extra brand logos, no watermark, no
unreadable generated text.
```

## Global Negative Prompt

```text
different person, changed face, changed eyes, changed nose, changed lips,
changed hair, changed age, face flicker, blurry face, plastic skin, beauty
filter, warped mouth, distorted teeth, exaggerated speech mouth, static photo
only, zoom-only motion, frozen body, broken walking, deformed legs, deformed
hands, extra fingers, floating product, fake readable label text, text
artifacts, watermark, scene change, fake testimonial, medical claim, guaranteed
result, copied creator style, celebrity likeness, unauthorized logos
```

## Prompts Higgsfield Para Salto Premium

### A. UGC Final 20s

```text
Create a vertical 9:16 UGC-style skincare product video for ONIA's AI model
video lab. Use a fictional adult female UGC model with a consistent approved
identity. Natural phone-first video, bright bathroom and warm apartment
cutaways, soft daylight, believable creator energy, not overproduced.

Scene flow:
0-2s: hook, model looks at camera in medium close-up.
2-5s: product appears clearly in hand, no fake label generation.
5-9s: clean product cutaway on bathroom vanity.
9-14s: texture demo on back of hand.
14-18s: model returns to camera, calm natural delivery.
18-20s: final product shot and CTA.

Spoken Spanish line:
"No voy a fingir que esto es una resena real. La idea es mostrar el producto
con luz natural, una toma limpia y movimiento que se sienta de redes."

Style: realistic UGC ad, social-native, clean subtitles, quick readable cuts,
no fake testimonial, no medical claim, no guaranteed result.
```

### B. Premium Product Demo

```text
Create a premium vertical 9:16 skincare product demo. Clean bathroom vanity,
soft daylight, minimal ivory styling, realistic phone-camera elegance. The
fictional adult model shows the product naturally without claiming personal
results. Product is visible early, then a close product cutaway, then texture
application on hand, then a calm CTA frame.

Camera: handheld but stable, close-ups mixed with medium shots, clean natural
skin texture, no AI beauty filter. Include Spanish captions only if they are
clean and readable.

Do not invent fake dermatology claims, fake before-after results, fake
testimonials or unreadable label text.
```

### C. Onia Sales Demo For Clients

```text
Create a vertical 9:16 founder/operator style video for ONIA showing how an
ecommerce product can become UGC content with an AI model. Show a product
reference, character board, prompt cards, a short generated UGC preview and a
final edit timeline. Spanish captions, clean UI overlays, practical agency
tone, fast cuts every 2-3 seconds, product and process visible.

Message: "Primero validamos estilo y movimiento. Despues generamos la version
final para anuncio."

No fake client results, no copied creator identity, no fake platform metrics,
no unapproved brand claims.
```

## Primer Batch Cuando Vuelva La GPU

No correr miles de prompts primero. Correr 5 pruebas, revisar, y despues
escalar.

Orden:

1. `wan_product_cutaway_packshot_001`
2. `wan_talking_head_neutral_001`
3. `wan_full_body_step_001`
4. `wan_hand_texture_demo_001`
5. `wan_desk_review_opener_001`

Si 3 de 5 pasan score minimo, recien generar 12 variantes.

Score minimo:

| Campo | Minimo |
|---|---:|
| Identidad | 4/5 |
| Movimiento real | 4/5 |
| Producto seguro | 4/5 |
| Manos/cuerpo | 4/5 |
| Uso UGC | 4/5 |

Hard fail:

- cara cambia;
- boca o dientes se deforman;
- producto crea label falso;
- mano o pierna rota;
- parece foto estatica con zoom;
- implica resena real o claim medico.

## Comandos Preparados

Cuando ComfyUI responda:

```powershell
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8188/system_stats
```

Subir assets:

```powershell
node scripts/comfyui_upload_image.js --endpoint http://127.0.0.1:8188 --file hermes-content\references\ai-ecommerce-model\products\isdin-fusion-water-magic-reference.png --name isdin-fusion-water-magic-reference.png
node scripts/comfyui_upload_image.js --endpoint http://127.0.0.1:8188 --file hermes-content\references\ai-ecommerce-model\mara-identity-20260616\mara_20260616_primary_i2v_front_smile.png --name mara_20260616_primary_i2v_front_smile.png
node scripts/comfyui_upload_image.js --endpoint http://127.0.0.1:8188 --file hermes-content\references\ai-ecommerce-model\identity-bank-50\photos\mara_identity_31.jpg --name mara_identity_31.jpg
```

Primer smoke, solo 1:

```powershell
node scripts/mara_comfyui_queue.js --workflow hermes-content\references\ai-ecommerce-model\comfyui\wan22_ti2v_5b_api.json --mapping hermes-content\references\ai-ecommerce-model\comfyui\wan22_ti2v_5b.mapping.json --matrix hermes-content\references\ai-ecommerce-model\prompt-matrix-runs\isdin-wan-ugc-talking-001\prompt-matrix.jsonl --limit 1 --submit
```

## Decision De Negocio

Si Wan logra clips cortos aceptables, Onia gana un laboratorio barato para:

- vender el proceso;
- demostrar control tecnico;
- reducir costo de experimentacion;
- llegar a Higgsfield con prompts mas fuertes.

Si Wan no logra cuerpo/lipsync publicable, igual sirve si produce:

- product cutaways;
- B-roll;
- tests de escena;
- prompt learnings transferibles.

No prometer a clientes "videos IA perfectos open source". Vender como sistema
de produccion con validacion, revision humana y motor premium cuando haga falta.

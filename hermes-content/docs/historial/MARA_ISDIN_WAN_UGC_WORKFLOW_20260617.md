# Lia + Mara + ISDIN Wan UGC Workflow 2026-06-17

Estado: interno, no publicado.

Objetivo: producir videos UGC con Lia brunette y producto ISDIN usando primero
modelos open source en ComfyUI/Wan, sin romper cara, cuerpo, manos ni producto,
y dejar preparado el salto a lipsync con ElevenLabs. Mara queda como la modelo
pelirroja.

## Diagnostico

El problema ya no es solo la cara. El nuevo cuello de botella es pedirle a una
sola generacion que resuelva demasiadas cosas a la vez:

- identidad de Lia o Mara;
- cuerpo completo;
- caminar o levantarse;
- producto fisico con label;
- texto hablado exacto;
- lipsync.

Eso es demasiado riesgo para un solo clip. La ruta profesional es por escenas:

1. full-body B-roll silencioso;
2. talking-head estable para lipsync;
3. packshot/product cutaway;
4. audio exacto ElevenLabs;
5. lipsync dedicado;
6. edicion final con cortes.

## Decision Recomendada

Usar Wan open source como laboratorio y no saltar a Higgsfield hasta que el
pack de escenas funcione.

Ruta:

```text
Producto + identidad + still full-body aprobado
-> Wan TI2V/I2V silent motion
-> ElevenLabs audio exacto
-> Wan S2V o InfiniteTalk lipsync
-> ffmpeg/caption/edit
-> QA visual y palabra por palabra
```

## Punto Critico De Identidad

Tenemos dos fuentes visuales distintas:

- Lia brunette 20260616: cara estable actual.
- Mara / identity-bank-50: cuerpo completo pelirrojo.

No debemos mezclar ambas como si fueran una sola identidad final. Para producir
un UGC final de cuerpo completo con Lia, falta una imagen still brunette
full-body aprobada.

Uso correcto ahora:

- Lia close-up: talking-head y lipsync.
- Mara full-body bank: pruebas de pose/movimiento, no final para Lia.
- producto ISDIN: referencia de producto, no texto generado.

## Punto Critico Del Producto

El workflow Wan actual usa un solo `LoadImage`. No puede recibir al mismo
tiempo una imagen de Lia/Mara y otra del producto como referencias separadas. Por
eso la pieza final debe usar:

- toma de Lia o Mara: input de la modelo elegida;
- toma de producto: input del ISDIN;
- composicion final: edicion/overlay/cortes.

Pedirle al mismo clip que invente el envase en la mano de la modelo es la ruta que
mas probablemente deformara el label.

## Archivos Canonicos

- Config ISDIN: `hermes-content/references/ai-ecommerce-model/mara-isdin-wan-ugc-config-20260617.json`
- Producto: `hermes-content/references/ai-ecommerce-model/products/isdin-fusion-water-magic-reference.png`
- Dashboard: `hermes-content/docs/MARA_VISUAL_REVIEW_BOARD_2026.html`
- Wan workflow API: `hermes-content/references/ai-ecommerce-model/comfyui/wan22_ti2v_5b_api.json`
- Wan mapping: `hermes-content/references/ai-ecommerce-model/comfyui/wan22_ti2v_5b.mapping.json`

## Prompt Base: Talking-Head Lipsync Source

Usar para generar video silencioso estable antes de ElevenLabs/lipsync.

```text
Use the input image as the exact identity source. Preserve the same fictional
adult brunette UGC model: oval face, warm light skin, natural freckles, brown
eyes, thick dark eyebrows, straight natural nose, full pink lips, soft warm
smile, shoulder-length wavy brown hair with subtle highlights, natural skin
texture, white or cream outfit, clean bright room lighting.

The product is a small light blue ISDIN Fotoprotector FusionWater Magic SPF 50
sunscreen bottle with a translucent cap. Use the provided product reference for
shape and color. Do not invent or redraw label text. If the label becomes
warped, keep the product as a separate packshot or edit overlay instead of
relying on generated text.

Create a silent vertical 9:16 ultra-realistic UGC skincare video. Medium
close-up talking-head framing, shoulders visible, eye-level phone camera,
stable face, ready for later lipsync. Bright clean bathroom or warm apartment,
soft daylight. Subtle breathing, one blink, tiny head nod, lips stay almost
closed and neutral, no actual speech yet. Warm, conversational, natural,
believable, not announcer-like.

The final spoken text will be added later with ElevenLabs and lipsync:
"No voy a fingir que esto es una resena real. La idea es mostrar el producto
con una toma limpia, luz natural y un movimiento que se sienta de redes."

No subtitles, no text overlays, no watermark, no fake label text, no medical
claims, no fake testimonial, no exaggerated speech mouth.
```

Negative:

```text
different person, changed face, changed eyes, changed eyebrows, changed nose,
changed lips, changed smile, changed hair, changed age, red hair in brunette
route, plastic skin, beauty filter, warped mouth, distorted teeth, blurry face,
face flicker, cartoon, anime, fake logo, fake label text, text artifacts,
watermark, scene change, background transformation, full-body from a face-only
source, static photo only, frozen body, broken walking, deformed legs, deformed
hands, extra fingers, floating product, product label hallucination, fake
testimonial, medical claim, guaranteed result, unreadable text artifacts
```

## Reglas De Prompt Para Wan

Aplicar estas reglas en cada variante:

- Un objetivo por clip: modelo, producto o cuerpo completo; no todo a la vez.
- Movimiento primero: escribir la accion y camara de forma concreta.
- Para full-body: decir "whole body visible from head to shoes at the start".
- Para producto: no pedir texto legible generado; usar packshot/overlay.
- Para lipsync: crear primero clip estable con boca neutra, despues audio.
- Evitar prompts largos con muchos cambios de escena, outfit y accion.
- Si el modelo se queda estatico, aumentar accion corporal concreta antes que
  agregar adjetivos esteticos.

## Prompt Base: Full-Body Motion

Usar solo con un input full-body. No usar con una foto de cara.

```text
Use the input image as the body and pose source. Create a silent vertical 9:16
full-body UGC movement test. The whole body is visible from head to shoes at
the start. She stands naturally in a clean warm apartment or bright bathroom,
cream skincare outfit, soft daylight, realistic phone camera.

Motion: starts standing full body, takes one small natural step toward camera,
stops, shifts weight, lifts the ISDIN bottle slightly to chest level, looks
briefly at the product, then back to camera, one natural blink, small smile.
Movement must include legs, hips, shoulders, arms, head, and natural weight
shift, not only face movement.

The product may be held at chest level, but do not try to recreate label text.
No speech mouth, no sudden camera zoom, no warped legs, no broken fingers, no
scene change.
```

## Prompt Base: Product Cutaway

El label del producto debe venir de la imagen real o overlay; no confiar en que
Wan lo escriba perfecto.

```text
Vertical 9:16 product cutaway for an UGC skincare edit. A clean white bathroom
or vanity surface, soft daylight, hand places a small light blue ISDIN
FusionWater Magic SPF 50 sunscreen bottle on the surface, then gently rotates
it a few degrees. Keep product shape and color believable. Label does not need
to become readable generated text because final label can be preserved by
overlay/packshot edit. Natural hand movement, realistic fingers, no other
brands, no subtitles, no watermark.
```

## Scripts Hablados Seguros

```text
No voy a fingir que esto es una resena real. La idea es mostrar el producto con
una toma limpia, luz natural y un movimiento que se sienta de redes.
```

```text
Para vender un producto de skincare no siempre necesitas una produccion enorme.
Necesitas que la textura, la luz y el uso se entiendan rapido.
```

```text
Lo que estamos probando aqui es simple: que el producto se vea claro, que la
persona se vea real y que el video no parezca un anuncio falso.
```

```text
Si tienes una tienda y tus productos se ven planos en redes, podemos crear
piezas UGC con modelo IA. Primero validamos estilo y despues hacemos las
versiones finales.
```

## Orden De Pruebas

1. Abrir el dashboard local y revisar los videos Wan ya generados.
2. Elegir una identidad final:
   - rapido: usar Mara pelirroja full-body solo para movimiento;
   - correcto: generar/aprobar still full-body de Lia brunette.
3. Subir a ComfyUI el producto ISDIN y el still full-body correcto.
4. Generar 6 clips silent talking-head.
5. Generar 6 clips product cutaway desde el packshot ISDIN.
6. Generar 6 clips full-body motion.
7. Auditar frames: cara, manos, piernas, producto, flicker.
8. Crear audio ElevenLabs solo del mejor script.
9. Aplicar S2V/InfiniteTalk o lipsync dedicado al talking-head elegido.
10. Editar final con full-body B-roll + lipsync medium + product cutaway.

## Comandos

Generar matriz ISDIN:

```powershell
node scripts/mara_prompt_matrix.js --config hermes-content\references\ai-ecommerce-model\mara-isdin-wan-ugc-config-20260617.json --run-name isdin-wan-ugc-001 --limit 18
```

Generar packs balanceados:

```powershell
node scripts/mara_prompt_matrix.js --config hermes-content\references\ai-ecommerce-model\mara-isdin-wan-ugc-config-20260617.json --run-name isdin-wan-ugc-talking-001 --routes wan22_ti2v5b_talking_head --visual-styles talking_head_lipsync_source --motions silent_micro_talk_ready,look_down_up --settings bright_bathroom,warm_apartment --limit 6
node scripts/mara_prompt_matrix.js --config hermes-content\references\ai-ecommerce-model\mara-isdin-wan-ugc-config-20260617.json --run-name isdin-wan-ugc-product-cutaway-001 --routes wan22_ti2v5b_product_cutaway_ref --visual-styles product_cutaway --motions product_hold_low,look_down_up --settings bright_bathroom,desk_review --limit 6
node scripts/mara_prompt_matrix.js --config hermes-content\references\ai-ecommerce-model\mara-isdin-wan-ugc-config-20260617.json --run-name isdin-wan-ugc-fullbody-001 --routes wan22_ti2v5b_full_body_motion_ref --visual-styles full_body_lifestyle --motions stand_step_body,look_down_up --settings warm_apartment,bright_bathroom --limit 6
```

Enviar a Comfy cuando el endpoint este activo:

```powershell
node scripts/mara_comfyui_queue.js --workflow hermes-content\references\ai-ecommerce-model\comfyui\wan22_ti2v_5b_api.json --mapping hermes-content\references\ai-ecommerce-model\comfyui\wan22_ti2v_5b.mapping.json --matrix hermes-content\references\ai-ecommerce-model\prompt-matrix-runs\isdin-wan-ugc-001\prompt-matrix.jsonl --limit 3 --submit
```

Dashboard local:

```powershell
python -m http.server 4177 --bind 127.0.0.1
```

URL:

```text
http://127.0.0.1:4177/hermes-content/docs/MARA_VISUAL_REVIEW_BOARD_2026.html
```

Subir imagenes necesarias a ComfyUI cuando el endpoint responda:

```powershell
node scripts/comfyui_upload_image.js --endpoint http://127.0.0.1:8188 --file hermes-content\references\ai-ecommerce-model\mara-identity-20260616\mara_20260616_primary_i2v_front_smile.png --name mara_20260616_primary_i2v_front_smile.png
node scripts/comfyui_upload_image.js --endpoint http://127.0.0.1:8188 --file hermes-content\references\ai-ecommerce-model\identity-bank-50\photos\mara_identity_31.jpg --name mara_identity_31.jpg
node scripts/comfyui_upload_image.js --endpoint http://127.0.0.1:8188 --file hermes-content\references\ai-ecommerce-model\products\isdin-fusion-water-magic-reference.png --name isdin-fusion-water-magic-reference.png
```

## QA De Aprobacion

Un clip no escala si falla cualquiera de estos puntos:

- Lia o Mara parece otra persona segun la ruta elegida.
- Boca o dientes se deforman.
- Full-body sale de una foto solo de cara.
- Producto inventa texto legible falso.
- Manos o piernas se rompen.
- Clip sugiere testimonio real o claim medico no verificado.
- El movimiento parece una foto estatica con zoom.

## Fuentes Verificadas

- Wan2.2 oficial: `https://github.com/Wan-Video/Wan2.2`
- ComfyUI Wan2.2 workflow: `https://docs.comfy.org/tutorials/video/wan/wan2_2`
- ComfyUI WanVideoWrapper: `https://github.com/kijai/ComfyUI-WanVideoWrapper`
- InfiniteTalk: `https://github.com/MeiGen-AI/InfiniteTalk`
- Wan2.2 S2V 14B: `https://huggingface.co/Wan-AI/Wan2.2-S2V-14B`

## Bloqueo Actual

El endpoint ComfyUI debe responder antes de enviar nuevos jobs. Si
`/system_stats` da 404 o no conecta, no enviar matriz porque el job fallara.

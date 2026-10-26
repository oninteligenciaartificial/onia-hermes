# Mara Video Generation Workflow 2026

Estado: interno, no publicado.
Fecha: 2026-06-16.

## Veredicto actual

LTX-2.3 en el workflow simple `Load Image -> Video Generation -> Save Video` no sirve como motor principal para videos UGC/lipsync de Mara.

Pruebas reales:

- `7decf863-399d-4f84-8482-ead6fcec27cd`: conserva cara pero queda casi estatico.
- `cdfbd36c-a9f7-4b43-8b23-63d32e7e5a9d`: prompt generico con playa genera movimiento, pero destruye la cara.
- `pond-ltx23-motion-calibration-001`: 5 variantes nuevas con imagen correcta.
  - `00001` a `00004`: identidad aceptable, movimiento insuficiente.
  - `00005`: movimiento mas visible, cara colapsa en blur.

Conclusion: LTX se queda como filtro barato de identidad/microanimacion, no como render final de avatar.

## Regla principal

No mezclar estas capas en un solo prompt:

1. Identidad visual.
2. Movimiento de video.
3. Texto hablado.
4. Audio ElevenLabs.
5. Lipsync.
6. Edicion final.

Cada capa se prueba y aprueba por separado.

## Imagen vs prompt

### Usar image-to-video cuando importa la identidad

Para Mara, avatar, UGC con rostro, producto en mano o talking head, el primer frame debe venir de una imagen aprobada.

Prompt correcto:

```text
Use the start image as the exact identity and first frame. Preserve the same fictional adult brunette UGC model, same face, eyes, nose, lips, smile, hair, skin texture, outfit, room and lighting. Subtle natural selfie motion only: one blink, tiny breathing, small head tilt. No talking, no hand gesture, no scene change, no text.
```

Prompt incorrecto:

```text
video of the girl, in a summer trip walking around the beach
```

Ese prompt pide escena, ubicacion y accion nuevas. En LTX produjo movimiento, pero perdio la cara.

### Usar text-to-video solo para B-roll

Text-to-video puede servir para:

- escenas de producto sin rostro;
- fondos;
- manos anonimas;
- lifestyle sin identidad fija;
- transiciones;
- recursos visuales de campaña.

No usar text-to-video para el avatar de Mara si la cara debe mantenerse.

## Estructura de prompt

### Visual prompt

Debe describir solo lo que el motor de video puede controlar:

- misma imagen;
- mismo cuarto;
- movimiento pequeno;
- limites claros;
- no hablar;
- no cambiar escena.

Plantilla:

```text
Use the start image as the exact identity and first frame.
Preserve the same face, eyes, nose, lips, smile, hair, skin texture, outfit, room and lighting.
Create a natural vertical selfie video with <motion>.
No talking, no mouth articulation, no hand gesture, no scene change, no walking, no zoom, no text, no logo.
Face stays sharp and recognizable for the whole clip.
```

### Negative prompt

```text
different person, changed face, changed eyes, changed nose, changed lips, changed smile, changed hair, changed age, plastic skin, beauty filter, warped mouth, distorted teeth, blurry face, face flicker, scene change, background transformation, text, watermark, logo
```

### Spoken text

El texto hablado no entra en el prompt visual. Va en el campo `spoken_text` para ElevenLabs y lipsync.

Ejemplo:

```text
Esto es una demostracion visual, no un testimonio real. La idea es mostrar el producto con claridad, sin prometer resultados que nadie comprobo.
```

## Ruta recomendada

```text
Mara still aprobado
-> silent image-to-video
-> QA visual
-> ElevenLabs audio
-> lipsync dedicado
-> STT check del texto
-> edicion/subtitulos
-> revision humana
```

## Motores

### ComfyUI LTX-2.3

Uso:

- microanimacion;
- prueba de prompt;
- comprobar que la imagen esta cargada;
- generar frame contacts baratos.

No usar para:

- talking head;
- caminar;
- cambio de ubicacion;
- lipsync;
- videos finales.

### ComfyUI Wan

Estado 2026-06-16: Wan queda como ruta principal de prueba UGC. LTX queda
solo como laboratorio barato.

El pod actual expone nodos Wan:

- `Wan22ImageToVideoLatent`
- `WanImageToVideo`
- `WanAnimateToVideo`
- `WanInfiniteTalkToVideo`
- `WanSoundImageToVideo`

Modelos instalados y visibles por ComfyUI despues de reiniciar:

- `models/diffusion_models/wan2.2_ti2v_5B_fp16.safetensors`
- `models/diffusion_models/wan2.2_i2v_high_noise_14B_fp8_scaled.safetensors`
- `models/diffusion_models/wan2.2_i2v_low_noise_14B_fp8_scaled.safetensors`
- `models/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors`
- `models/vae/wan2.2_vae.safetensors`
- `models/vae/wan_2.1_vae.safetensors`
- `models/audio_encoders/wav2vec2_large_english_fp16.safetensors`
- `models/model_patches/Wan2_1-InfiniteTalk-Single_fp8_e4m3fn_scaled_KJ.safetensors`

No se instalo `wan2.2_s2v_14B_fp8_scaled.safetensors` porque Hugging Face
fallo con `Disk quota exceeded` durante la descarga de 15.6 GB. No bloquea la
ruta visual silenciosa.

Workflow API listo:

```text
LoadImage Mara
-> Wan22ImageToVideoLatent
-> Wan text/conditioning
-> sampler
-> VAE decode
-> SaveVideo
```

Archivos canonicos:

- `hermes-content/references/ai-ecommerce-model/comfyui/wan22_ti2v_5b_api.json`
- `hermes-content/references/ai-ecommerce-model/comfyui/wan22_ti2v_5b.mapping.json`
- `scripts/comfyui_wan_readiness.js`

Comando readiness:

```powershell
node scripts/comfyui_wan_readiness.js --endpoint https://d36cqn7umhexvx-8188.proxy.runpod.net --out hermes-content\references\ai-ecommerce-model\comfyui\wan-readiness-20260616.json
```

Primer resultado real:

- `dd523445-a376-480f-80cc-d7fa2d13cf26`: success, 4.06s,
  `576x1024`, cara estable, movimiento bajo.
- `14b81ce5-a7ae-4b9e-a2c9-51abac6a5b77`: cara estable, movimiento bajo.
- `1baaf5f2-112c-4f9d-9a6f-b6d27ba974d7`: cara estable, movimiento bajo.
- `ec8fd6e3-1302-447a-b9ce-5d3f3820e0ec`: mejor balance de la tanda,
  blink/expresion leve sin romper identidad.

Resumen de run:

```text
hermes-content/references/ai-ecommerce-model/comfyui/audits/pond-wan22-ti2v-motion-002/RUN_SUMMARY.md
```

Generar matriz Wan smoke:

```powershell
node scripts/mara_prompt_matrix.js --limit 1 --routes comfy_wan22_ti2v5b --outfits same_source_outfit --tones warm_friend --visual-styles closeup_selfie --settings same_room --motions low_mouth_nod --hooks not_testimonial --spoken-texts ugc_disclosure_15s --seed 5201 --run-name pond-wan22-ti2v-smoke-001
```

Enviar a ComfyUI:

```powershell
node scripts/mara_comfyui_queue.js --workflow hermes-content\references\ai-ecommerce-model\comfyui\wan22_ti2v_5b_api.json --mapping hermes-content\references\ai-ecommerce-model\comfyui\wan22_ti2v_5b.mapping.json --matrix hermes-content\references\ai-ecommerce-model\prompt-matrix-runs\pond-wan22-ti2v-smoke-001\prompt-matrix.jsonl --limit 1 --endpoint https://d36cqn7umhexvx-8188.proxy.runpod.net --submit
```

Para audio/lipsync en ComfyUI, investigar despues de aprobar video silencioso:

```text
LoadImage Mara
-> Load audio ElevenLabs
-> WanInfiniteTalkToVideo
-> sampler/decode
-> SaveVideo
```

No empezar por `WanInfiniteTalkToVideo` hasta que el silent Wan I2V preserve identidad.

### Higgsfield

Seedance 2.0 es el candidato externo para comparar contra Wan.

Estado actual:

- balance: `10.14` creditos;
- prueba Seedance 720p std costaba `22.5` creditos y no se pudo ejecutar;
- prueba Seedance 480p fast costaba `6` creditos pero fallo sin MP4.

No seguir reintentando Higgsfield hasta recargar o confirmar que el modelo/plan tiene credito suficiente.

## QA minimo antes de escalar

No generar lotes grandes hasta que una ruta consiga:

- identidad: 4/5;
- artefactos: 4/5;
- movimiento: 3/5 o mas;
- cara reconocible en frame inicial, medio y final;
- sin blur fuerte en ojos, boca y nariz.

## Comandos

Generar matriz:

```powershell
node scripts/mara_prompt_matrix.js --limit 5 --routes comfy_ltx23 --outfits same_source_outfit --tones warm_friend --visual-styles closeup_selfie --settings same_room --hooks not_testimonial --spoken-texts ugc_disclosure_15s --seed 4201 --run-name pond-ltx23-motion-calibration-001
```

Enviar a ComfyUI:

```powershell
node scripts/mara_comfyui_queue.js --workflow C:\Users\PC\Downloads\video_ltx2_3_i2v.json --mapping hermes-content\references\ai-ecommerce-model\comfyui\video_ltx2_3_i2v.mapping.json --matrix hermes-content\references\ai-ecommerce-model\prompt-matrix-runs\pond-ltx23-motion-calibration-001\prompt-matrix.jsonl --limit 5 --endpoint https://d36cqn7umhexvx-8188.proxy.runpod.net --submit
```

Auditar resultados:

```powershell
node scripts/comfyui_video_audit.js --endpoint https://d36cqn7umhexvx-8188.proxy.runpod.net --prompt-ids <ids_separados_por_coma> --out hermes-content\references\ai-ecommerce-model\comfyui\audits\<run_name>
```

## Fuentes revisadas

- ComfyUI docs LTX-Video 2.3: https://docs.comfy.org/tutorials/video/ltx/ltx-2-3
- LTX Studio ComfyUI workflow guide: https://ltx.io/blog/comfyui-workflow-guide
- LTX Video usage guides: https://docs.ltx.video/open-source-model/usage-guides/image-to-video
- Higgsfield docs: https://docs.higgsfield.ai/

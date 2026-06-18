# Pond Wan2.2 TI2V Motion 002

Fecha: 2026-06-16.
Estado: interno, no publicado.

## Objetivo

Validar si Wan2.2 TI2V 5B puede reemplazar a LTX como ruta principal para
UGC visual silencioso de Mara, preservando identidad antes de probar audio o
lipsync.

## Setup

- Endpoint: `https://d36cqn7umhexvx-8188.proxy.runpod.net`
- GPU: RTX A6000 48 GB
- Workflow: `hermes-content/references/ai-ecommerce-model/comfyui/wan22_ti2v_5b_api.json`
- Mapping: `hermes-content/references/ai-ecommerce-model/comfyui/wan22_ti2v_5b.mapping.json`
- Input: `mara_20260616_primary_i2v_front_smile.png`
- Resolution: `576x1024`
- Frames/FPS: `65 @ 16fps`
- Duration: `4.06s`

## Jobs

| Prompt ID | Variant | Result |
|---|---|---|
| `dd523445-a376-480f-80cc-d7fa2d13cf26` | baseline low mouth nod | Face preserved, very low motion |
| `14b81ce5-a7ae-4b9e-a2c9-51abac6a5b77` | lean hook | Face preserved, conservative motion |
| `1baaf5f2-112c-4f9d-9a6f-b6d27ba974d7` | hair adjust | Face preserved, conservative motion |
| `ec8fd6e3-1302-447a-b9ce-5d3f3820e0ec` | look down/up | Best of batch: blink/expression shift, face stable |

## Veredicto

Wan2.2 TI2V 5B is now the best local route for Mara silent UGC smoke tests.
It preserves identity far better than the LTX workflow tested earlier.

Current weakness: motion is still too conservative for final UGC. This is a
better failure mode than LTX, because the face remains usable while motion can
be increased gradually.

## Next Test

Run a 6-clip motion expansion with:

- same image, same room, same outfit;
- stronger but bounded motion: small lean in/out, blink, tiny eye glance,
  subtle handheld camera sway;
- no talking, no lips, no product hands, no scene change;
- keep `576x1024`, `65 frames`, `16fps`, `20 steps`;
- compare against `ec8fd6e3` as the current best baseline.

Do not start ElevenLabs or lipsync until one visual route scores:

- identity: 4/5 or higher;
- artifacts: 4/5 or higher;
- motion: 3/5 or higher.

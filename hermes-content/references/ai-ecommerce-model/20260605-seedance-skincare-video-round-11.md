# Round 11 - Seedance skincare video variations

Fecha: 2026-06-05
Estado: borradores internos, no publicados
Herramienta: Higgsfield CLI
Modelo: Seedance 2.0 (`seedance_2_0`)
Referencia de identidad: `identity-bank-50/photos/mara_identity_02.jpg`
Upload ID referencia: `70d8a737-1241-4747-bce6-619afb62d2d3`
Formato: 9:16, 1080p, 15s
Costo estimado: 135 creditos por variacion, 270 creditos total

## Objetivo

Crear dos variaciones de video donde Mara Vale vende un producto de skincare
premium manteniendo identidad, sonrisa y estetica luxury.

Producto: serum skincare premium sin marca real aprobada.

Lenguaje seguro:

- fresh look;
- glow;
- textura ligera;
- rutina simple;
- sin claims medicos;
- sin antes/despues;
- sin testimonios inventados.

## Archivos

Carpeta:

`video-ads/seedance-variations/`

### Variacion 1 - UGC direct

- Raw: `20260605-mara-skincare-seedance-v1-ugc-direct-raw.mp4`
- Overlay: `20260605-mara-skincare-seedance-v1-overlay.ass`
- Final: `20260605-mara-skincare-seedance-v1-ugc-direct-final.mp4`
- QA frames:
  - `20260605-mara-skincare-seedance-v1-ugc-direct-raw-frame-01.jpg`
  - `20260605-mara-skincare-seedance-v1-ugc-direct-raw-frame-07.jpg`
  - `20260605-mara-skincare-seedance-v1-ugc-direct-raw-frame-13.jpg`
  - `20260605-mara-skincare-seedance-v1-ugc-direct-final-qa-01.jpg`
  - `20260605-mara-skincare-seedance-v1-ugc-direct-final-qa-12.jpg`

### Variacion 2 - Cinematic routine

- Raw: `20260605-mara-skincare-seedance-v2-cinematic-routine-raw.mp4`
- Overlay: `20260605-mara-skincare-seedance-v2-overlay.ass`
- Final: `20260605-mara-skincare-seedance-v2-cinematic-routine-final.mp4`
- QA frames:
  - `20260605-mara-skincare-seedance-v2-cinematic-routine-raw-frame-01.jpg`
  - `20260605-mara-skincare-seedance-v2-cinematic-routine-raw-frame-07.jpg`
  - `20260605-mara-skincare-seedance-v2-cinematic-routine-raw-frame-13.jpg`
  - `20260605-mara-skincare-seedance-v2-cinematic-routine-final-qa-01.jpg`
  - `20260605-mara-skincare-seedance-v2-cinematic-routine-final-qa-12.jpg`

## Prompts

### Variacion 1

```text
15-second vertical luxury UGC skincare ad. Same fictional adult red-haired woman from Mara Vale identity reference: fair skin, natural freckles, copper-red wavy hair, green-hazel eyes, soft warm smile. Quiet luxury ivory marble bathroom vanity, soft daylight, premium skincare mood. She smiles to camera, holds an unbranded premium serum bottle at natural size, shows one drop on the back of her hand, gently applies to cheek, then places serum on marble and smiles confidently. Product: clean glass and white bottle, blank label, no readable text, no logo. Natural hands, realistic skin, elegant cream silk top and blazer, modest styling. No generated text, no medical claims, no before-after, no fake testimonial, no watermark, brand-safe, non-sexual.
```

### Variacion 2

```text
15-second vertical cinematic luxury skincare ad. Same fictional adult red-haired woman from Mara Vale identity reference: identical face, freckles, copper-red wavy hair, green-hazel eyes, warm smile. Morning routine in a premium cream bathroom, soft sunlight and marble. Sequence: close smiling portrait, macro serum texture on hand, elegant application to cheek, product beauty shot beside folded towel and glass, final smile to camera holding serum. Product is unbranded, blank label, no readable letters, natural size, clean premium packaging. Keep identity consistent, product clear, motion smooth, realistic hands, quiet luxury editorial UGC. No generated text, no logos, no claims, no before-after, no medical language, no watermark, non-sexual.
```

## Textos en pantalla

### Variacion 1

- `Tu rutina de 10 pasos / no era skincare.`
- `Era marketing.`
- `Un serum ligero. / Un look fresco.`
- `Menos pasos. / Mas glow.`

### Variacion 2

- `Glow no deberia / tomarte 10 pasos.`
- `Textura ligera. / Acabado natural.`
- `Piel fresca. / Rutina simple.`

## QA

| Criterio | V1 | V2 |
|---|---:|---:|
| Identidad Mara | 92 | 94 |
| Sonrisa | 94 | 96 |
| Producto visible | 94 | 88 |
| Movimiento skincare | 92 | 88 |
| Estetica luxury | 91 | 94 |
| Texto overlay | 95 | 95 |
| Listo para publicar | 82 | 78 |

## Decision creativa

V1 es mejor para venta directa porque abre con producto claro y tiene una demo
de aplicacion fuerte.

V2 es mejor como pieza editorial/luxury, pero Seedance invento texto pequeno en
la etiqueta del envase. Mantener como borrador interno; para pauta, rehacer con
producto real o limpiar/ocultar etiqueta.

## Riesgos antes de publicar

- No hay marca real aprobada.
- Producto de V2 contiene microtexto inventado.
- Revisar audio antes de usar como anuncio.
- No publicar sin aprobacion humana.

# Photo Guide

What to upload for Soul training.

## Quantity

- Minimum 5, maximum 20.
- 8–12 is the sweet spot.

## Content

- Clear face, eyes visible.
- Single person per photo.
- No heavy filters, no sunglasses.

## Variety

Higher variety = better identity capture.

- Multiple angles: front, 3/4 left, 3/4 right, slight up/down.
- Different lighting: indoor, outdoor, soft, harsh.
- Different expressions: neutral, smiling, talking.
- Different distances: head shot, head-and-shoulders, full body.

## Quality

- Sharp, in-focus.
- Resolution ≥ 1024×1024 ideal.
- JPEG or PNG.

## Avoid

- Group photos.
- Heavy makeup not normally worn.
- Costumes / cosplay.
- Hats covering the face.
- Same pose repeated.

## ONIA — verificado 2026-09-30 (carril Lucía)

- **Techo real: 20 fotos.** La web de Higgsfield pide 20+ (hasta 80), pero la CLI y el MCP
  (`show_characters`) aceptan 5–20.
- **Al menos una foto de cuerpo entero** (ayuda oficial de Soul ID: mejora las proporciones).
- **Luz:** mayoría suave y neutra; nada de neón ni geles de color. El Soul aprende el tono de piel y la
  edad del dataset (el v4 de Lucía salió envejecido por eso).
- **Ropa y fondo distintos en cada foto**, para que no los tome como parte de la identidad.
- **Imágenes generadas sirven** (Higgsfield lo recomienda para influencers IA), filtradas por identidad
  (≥0,80 con `scripts/face_identity_qa.py`) y sin suavizado de piel.
- **Costo medido:** 25 cr por entrenamiento `soul_2`. **Cola:** puede quedar horas en `queued` (v4 ~9 h);
  el MCP no tiene cancelar: relanzar cobra de nuevo. Entrenar `soul_cinematic` falla y cobra según el
  issue #41 de la CLI (jun-2026): entrenar `soul_2` y generar con `soul_cinematic` usando ese ID.

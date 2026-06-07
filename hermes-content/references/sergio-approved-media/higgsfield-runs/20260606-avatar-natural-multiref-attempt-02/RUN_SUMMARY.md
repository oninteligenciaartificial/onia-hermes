# Sergio Avatar Natural Multiref Attempt 02

## Objetivo

Hacer un intento mas de avatar base de Sergio, corrigiendo el principal problema de los intentos anteriores: verse demasiado como modelo generico o demasiado AI. Este intento usa varias referencias reales al mismo tiempo y no usa avatars generados como input.

## Herramienta

- Nano Banana Pro via Higgsfield CLI.

## Referencias

- `source-anchors/01_front_neutral_real.jpg`: identidad frontal principal.
- `source-anchors/02_front_smile_real.jpg`: boca, sonrisa y dientes.
- `source-anchors/03_profile_left_real.jpg`: perfil, nariz, mandibula, oreja, cuello y pelo.
- `source-anchors/04_profile_right_real.jpg`: perfil opuesto, nariz, mandibula, oreja, cuello y pelo.
- `source-anchors/05_real_photo_contact_sheet.jpg`: chequeo de consistencia real.

## Prompt

- `prompts/01_natural_multiref_identity_attempt.txt`

## Estado

Generado y validado visualmente.

## Job

- `01_natural_multiref_identity_attempt.png`: `22b1fd2f-5840-46ee-8d82-4ec7f4973c3a`

## Salidas

- Imagen final: `outputs/01_natural_multiref_identity_attempt.png`
- Comparativa QA: `qa/real-vs-surgical-v2-vs-natural-multiref.jpg`

## Validacion

- Nano Banana Pro confirmo `5` imagenes reales como input.
- Salida: `9:16`, `4k`, `3072x5504`.
- No se uso ningun avatar generado como referencia de identidad.
- Resultado: mas natural y mas robusto en torso/pose que la base quirurgica frontal anterior; conserva mejor la energia joven y reduce el look rigido. Riesgo residual: sigue siendo un retrato embellecido, no una copia perfecta del rostro real.

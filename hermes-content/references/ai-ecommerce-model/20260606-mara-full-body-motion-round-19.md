# Round 19 - Mara full-body apartment motion V1

Fecha: 2026-06-06
Estado: borrador interno, no publicado
Objetivo: corregir el problema de videos estaticos creando una toma full-body
de Mara con movimiento corporal real en departamento.

## Resultado

Se genero una base full-body de Mara y luego se animo con Kling 3.0.

Carpeta:

`video-ads/full-body-motion-control-v1/`

Archivos:

- `20260606-mara-full-body-apartment-still-v1.png`
- `20260606-mara-full-body-apartment-motion-kling3-v1-raw.mp4`
- `20260606-mara-full-body-apartment-motion-kling3-v1-final.mp4`
- `20260606-mara-full-body-apartment-still-job.json`
- `20260606-mara-full-body-apartment-motion-kling3-v1-job.json`
- `motion-frame-01.jpg` a `motion-frame-05.jpg`

## Still full-body

Herramienta: Higgsfield CLI
Modelo: Nano Banana Pro (`nano_banana_2`)
Job ID:

`35f988d2-37ad-4065-be42-f7cc653ff274`

Fuente generada:

`https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260606_140120_35f988d2-37ad-4065-be42-f7cc653ff274.png`

Costo:

`2` creditos

Prompt resumido:

```text
Full-body vertical 9:16 identity-preserving commercial still of Mara Vale in a
warm modern apartment. Same face, freckles, green-hazel eyes, copper-red wavy
hair, fair skin, body proportions and soft smile. Cream ribbed top, open linen
shirt, high-waist beige pants, neutral sandals, apartment living room, sofa,
lamp, curtains, plant, premium UGC.
```

## Video full-body

Herramienta: Higgsfield CLI
Modelo: Kling v3.0 (`kling3_0`)
Job ID:

`62308425-625f-48ce-a49e-307e9eeb4387`

Fuente generada:

`https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260606_140522_62308425-625f-48ce-a49e-307e9eeb4387.mp4`

Costo:

`15` creditos

Prompt resumido:

```text
Animate this full-body image of Mara Vale into a vertical 9:16 premium UGC
video with real body movement. She starts standing full body, takes two small
natural steps toward camera, stops in a medium-full shot, smiles, adjusts hair,
gestures near chest and leans forward. Movement must include legs, hips,
shoulders, arms, head and facial microexpressions, not only mouth movement.
```

## Validacion tecnica

Raw:

```text
716x1284
10.041667s
24 fps
```

Final normalizado:

```text
720x1280
10.041667s
24 fps
sin audio
```

## QA visual

Puntos buenos:

- Corrige el problema central: no es solo una imagen hablando.
- Hay cuerpo completo desde el primer frame.
- Hay acercamiento hacia camara y cambio de encuadre.
- Hay gesto de manos y ajuste de pelo.
- El departamento esta claro y usable.
- Outfit limpio, luxury UGC, sin logos.

Limitaciones:

- No usa motion-control exacto desde el TikTok porque no hay permiso ni driving
  video autorizado.
- Movimiento de caminata es generado, no copiado.
- La sonrisa final se abre mas de lo ideal y requiere QA humano en video.
- No tiene voz/lipsync; sirve como toma visual base.

## Decision

Esta V1 es el nuevo punto de partida para videos con movimiento real de Mara.
Para una pieza final, usar:

1. este video como toma de entrada full-body;
2. una toma secundaria con lipsync dedicado;
3. edicion con cortes para evitar que una sola generacion tenga que resolver
   caminata, manos, boca y voz al mismo tiempo.

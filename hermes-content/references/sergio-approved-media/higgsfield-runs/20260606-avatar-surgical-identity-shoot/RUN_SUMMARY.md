# Sergio Avatar Surgical Identity Shoot

## Resultado

Se genero un shooting multiangulo de Sergio con Nano Banana Pro usando solamente referencias reales del set `0405-0409` como anchors de identidad. La prioridad fue mantener la cara y limpiar solo imperfecciones temporales: granos, marcas, arrugas de iluminacion, brillo duro, textura de acne y sombras inventadas.

## Frentes usados

- Contenido/Media: face lock quirurgico, prompts por angulo y consistencia visual.
- QA/Verificacion: revision visual de frontal, sonrisa, perfiles y contact sheet.

## Referencias usadas

- `source-anchors/01_front_neutral_real.jpg`
- `source-anchors/02_front_smile_real.jpg`
- `source-anchors/03_profile_left_real.jpg`
- `source-anchors/04_profile_right_real.jpg`
- `source-anchors/05_three_quarter_a_real.jpg`
- `source-anchors/06_three_quarter_b_real.jpg`
- `source-anchors/07_front_video_neutral_real.jpg`
- `source-anchors/08_front_video_smile_real.jpg`

## Prompts guardados

- `SERGIO_SURGICAL_FACE_LOCK.md`
- `prompts/01_front_neutral_surgical.txt`
- `prompts/02_front_smile_surgical.txt`
- `prompts/03_profile_left_surgical.txt`
- `prompts/04_profile_right_surgical.txt`
- `prompts/05_three_quarter_a_surgical.txt`
- `prompts/06_three_quarter_b_surgical.txt`
- `prompts/07_front_video_neutral_surgical.txt`
- `prompts/08_front_video_smile_surgical.txt`
- `prompts/_global_surgical_cleanup_v2.txt`

## Jobs Nano Banana Pro

- Ignorado por error de invocacion con saltos de linea: `a6441b7f-f527-43ad-9b11-d97476b9742b`
- `01_front_neutral_surgical.png`: `7de2084b-b4e4-4a0e-a77b-856ce8ce7d46`
- `01_front_neutral_surgical_v2.png`: `182d8118-de9c-4201-8fbe-130e083df54f`
- `02_front_smile_surgical_v2.png`: `c1cc70c3-9b38-4afd-b61c-58e5ac8e01be`
- `03_profile_left_surgical_v2.png`: `3984aa95-7719-4d7e-a3a1-efc1cd741e44`
- `04_profile_right_surgical_v2.png`: `015a5212-2bed-46fe-8fbc-af8874ba4010`
- `05_three_quarter_a_surgical_v2.png`: `1c8874c9-6a91-4b6c-a376-cf0da1cfff00`
- `06_three_quarter_b_surgical_v2.png`: `e8b2eecf-0dc1-4142-b44e-7f8a7170be96`
- `07_front_video_neutral_surgical_v2.png`: `f4d372e4-7ae2-42c9-ac94-338fce4f463c`
- `08_front_video_smile_surgical_v2.png`: `7e25ad69-18b5-4503-8277-b64905d77580`

## Salidas

- Contact sheet: `qa/surgical-identity-shoot-contact-sheet-v2.jpg`
- Imagenes finales 4K: carpeta `outputs/`

## QA visual

- Mejor base para avatar: `outputs/01_front_neutral_surgical_v2.png`
- Mejor sonrisa/control de dientes: `outputs/02_front_smile_surgical_v2.png`
- Perfiles utiles para bloquear nariz, cabello, oreja, mandibula y cuello: `outputs/03_profile_left_surgical_v2.png` y `outputs/04_profile_right_surgical_v2.png`
- Tomas de video utiles como apoyo de movimiento, no como identidad principal: `outputs/07_front_video_neutral_surgical_v2.png` y `outputs/08_front_video_smile_surgical_v2.png`

## Validacion tecnica

- Nano Banana Pro devolvio salidas `9:16`, `4k`, `3072x5504`.
- Cada job valido uso una imagen real como input reference.
- Contact sheet construido localmente con `ffmpeg`.

## Pendiente

- Sergio debe elegir la toma base antes de animar.
- No se publico nada.
- No se genero video en este paso.

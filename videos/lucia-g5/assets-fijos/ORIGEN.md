# assets-fijos: lo que `build.mjs` necesita y NO debe depender de la red

Versionado en git (no ignorado) para que el montaje se reconstruya aunque caduquen las URL de CloudFront o no haya red (heredado de G4, revisión 1, N9).
`build.mjs` copia de acá a `assets/` si falta.

## Las 8 referencias oficiales de la cara (placa de la regla), recortes de 360x360
Fuente: `hermes-content/references/modelos/lucia/v4/qa/manifest-escenas-seedream-20260930.json` (URL públicas de CloudFront; 0 cr).
Recorte = cuadrado de 1,9 veces la caja de cara medida con SCRFD (`scripts/medir-caras.py --refs`), llevado a 360x360 (OpenCV INTER_AREA, JPEG calidad 92).
Son los MISMOS 8 archivos (misma suma SHA-256) que usó G4: se copiaron de `videos/lucia-g4/assets-fijos/` sin tocarlos.

| Archivo | Referencia | URL de origen | Recorte [x, y, lado] en el original | Cara en el original (px) | SHA-256 del recorte |
|---|---|---|---|---:|---|
| `ref1.jpg` | R1_frontal_canon | https://d2ol7oe51mr4n9.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/a7cfb766-5755-4d76-baba-c8e81ddf50db.jpg | [0, 100, 768] | 440 | `250cda6392213b8c…` |
| `ref2.jpg` | R2_34_medio | https://d2ol7oe51mr4n9.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/1714a347-471d-4803-a42e-0022e15df262.jpg | [172, 157, 522] | 196 | `2fa96d98bdd6a44d…` |
| `ref3.jpg` | R3_casi_frontal | https://d2ol7oe51mr4n9.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/d7d6d36a-1358-40b4-b1b3-d98c1ac15135.png | [75, 0, 1717] | 744 | `b37a688d0f47f564…` |
| `ref4.jpg` | R4_casi_perfil | https://d2ol7oe51mr4n9.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/f7ddbf81-880e-4b91-a825-0dbaa342bf7a.png | [218, 208, 1183] | 444 | `13652d90b45e5f2d…` |
| `ref5.jpg` | R5_34_izq | https://d2ol7oe51mr4n9.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/0aa21e93-4429-49b3-a12c-5bfcec67239d.png | [61, 65, 727] | 317 | `9dab4cd4337640ed…` |
| `ref6.jpg` | R6_34_der | https://d2ol7oe51mr4n9.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/df491c87-089a-4ace-907a-90ebe6ac82e3.png | [380, 198, 515] | 206 | `54de658b6142b794…` |
| `ref7.jpg` | R7_frontal_2752 | https://d2ol7oe51mr4n9.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/8ce2f65c-5681-41b1-bb37-83b3576c74fd.png | [0, 8, 1536] | 614 | `412f1bed50a6db99…` |
| `ref8.jpg` | R8_anchor_902eeebb | https://d8j0ntlcm91z4.cloudfront.net/user_38ZdeEBSxQlcwfO6cjFGGPpE3Kz/hf_20260708_165146_bdc2b3bf-36e4-4340-b937-037bd73ed44e.png | [0, 109, 896] | 572 | `de076a4d321ce10a…` |

Los originales (hasta 6 MB cada uno) viven en `assets/refs-orig/` (ignorado) y se bajan por curl solo si hay que regenerar un recorte.

## Dos cuadros de clips crudos de G2 (G5, 9-oct-2026; 0 créditos)
Los clips crudos NO van a git (`videos/lucia-g2/assets/*.mp4` está ignorado, igual que `v4/prueba-motores-20261008/*.mp4`). Se versionan los dos cuadros que G5 usa,
extraídos con `scripts/extraer-cuadros.sh` (ffmpeg; el script documenta cada comando). Los clips se recuperan a 0 créditos con `job_display` → `results.rawUrl` + `curl`
(ids en `v4/PROCEDENCIA.jsonl` línea 97; no se llamó a ninguna herramienta de Higgsfield en G5).

| Archivo | Clip (clave de PROCEDENCIA) | Cuadro | Recorte nativo [x, y, ancho, alto] | Qué muestra | Cara (SCRFD) | Puntaje de cara (face-gate.sh) | SHA-256 |
|---|---|---|---|---|---|---:|---|
| `fr-m5.jpg` | Motor 5 de G2 (`kling_o3_image_reference_5_refs_948a89d3-c5c5-4e32-92f0-db624edc825b`, 720x1280) | 0 (t = 0 s) | [100, 250, 480, 600] | Lucía de cuerpo entero ante una ventana; es el cuadro con la cara MÁS CHICA del clip | **89 px** de ancho (caja [215, 218, 304, 328] en el recorte; en el cuadro entero [315, 464, 404, 578]) | 0,798 el cuadro entero, 0,801 el recorte (= la primera muestra de PROCEDENCIA, 0,798) | `d302aa3d9be1bfae…` |
| `fr-m4.jpg` | Motor 4 de G2 (`seedance_2_0_mini_start_mas_3_refs_dd2d7c91-ea3a-46a8-a29d-3861143dfe9e`, 720x1280) | 96 (t = 4,0 s) | [0, 0, 620, 680] | Lucía en primer plano y la torre de vidrio con el **letrero inventado** arriba a la izquierda (x 14-73, y 70-109), **DIFUMINADO con pluma** | 312 px (305 en el cuadro entero) | 0,796 el cuadro entero (= la muestra de PROCEDENCIA a 4 s), 0,791 el recorte difuminado | `9277f9893ae1e4d4…` |

**Difuminado del letrero (Motor 4).** Caja x 0-220, y 40-130 del recorte, `gblur sigma=3,5`, pluma de 14 px, en UN paso en RGB (`format=gbrp`, `gblur`, `maskedmerge`, salida `yuvj420p`;
receta de `v4/prueba-motores-20261008/fotos-limpias/README.md`). Motivo: sin difuminar el letrero se lee «DMSS» / «DVOSS» (letras blancas en relieve sobre el vidrio, en la torre del cuadro 36 se lee mejor)
y podría confundirse con una marca real; G2 decidió no difuminarlo porque no se parecía a ninguna marca que conociera. Con sigma 2,5 todavía se adivinan las letras a 3x; con 3,5 queda un trazo claro ilegible (comparado a 3x).
También cubre un segundo trazo claro más débil en la fachada de la derecha (x 150-200, y 55-75). El puntaje de la cara no cambia (0,796 → 0,791). **2da pasada (revisión G5-4):** el aro del video es un rectángulo redondeado que cubre TODA la caja difuminada (el letrero y el trazo más débil de la derecha, para que no quede una mancha sin explicar) y la pantalla lo dice: «Lo difuminé: lo inventó la IA.». G2 muestra el mismo letrero legible y NO se tocó: la madre decide si también se difumina.
**Fondo del cuadro del Motor 5 mirado a 3x-4x:** ventana, plantas, un lapicero y, en el escritorio a la izquierda, una tarjeta de mesa con garabatos ilegibles (queda FUERA del recorte: x < 100). Sin logos ni rubro.

## GSAP 3.14.2 (`vendor/gsap.min.js`)
La versión del scaffold de HyperFrames 0.8.142 (MIT). El render no puede depender de la red. SHA-256 `c174bfce53a72941…`.

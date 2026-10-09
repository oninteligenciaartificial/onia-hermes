# assets-fijos: lo que `build.mjs` necesita y NO debe depender de la red

Versionado en git (no ignorado) para que el montaje se reconstruya aunque caduquen las URL de CloudFront o no haya red (revisión 1, N9).
`build.mjs` copia de acá a `assets/` si falta.

## Las 8 referencias oficiales de la cara (placa de la regla), recortes de 360x360
Fuente: `hermes-content/references/modelos/lucia/v4/qa/manifest-escenas-seedream-20260930.json` (URL públicas de CloudFront; 0 cr).
Recorte = cuadrado de 1,9 veces la caja de cara medida con SCRFD (`scripts/medir-caras.py --refs`), llevado a 360x360 (OpenCV INTER_AREA, JPEG calidad 92).
Son los mismos 8 archivos que usó el render de la 1ra y de la 2da pasada.

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

## GSAP 3.14.2 (`vendor/gsap.min.js`)
La versión del scaffold de HyperFrames 0.8.142 (MIT). El render no puede depender de la red. SHA-256 `c174bfce53a72941…`.

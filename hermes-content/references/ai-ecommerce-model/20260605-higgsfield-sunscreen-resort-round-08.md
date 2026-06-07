# Round 08 - Higgsfield sunscreen resort 4K

Fecha: 2026-06-05
Estado: prueba interna, no publicada
Herramienta: Higgsfield CLI
Modelo: Nano Banana Pro (`nano_banana_2`)
Referencia base: `20260605-redhead-performance-ugc-v1.png`
Salida local: `20260605-higgsfield-sunscreen-resort-4k-v1.png`
Formato: 9:16, 4K, 3072 x 5504
Costo estimado: 4 creditos por intento 4K

## Objetivo de la ronda

Crear una variante para bloqueador solar con estilo playa/resort, producto protagonista pero no gigante.

El usuario pidio bikini. Se intentaron dos prompts seguros con bikini/swimwear, pero Higgsfield devolvio estado `nsfw` y no entrego imagen. Para obtener un asset usable, se hizo un fallback seguro con cover-up de lino y top de verano.

## Prompt final usado

Create a premium vertical ecommerce and UGC-style sunscreen ad using the reference image only as the identity anchor for the same fictional adult red-haired woman. She has very fair skin, natural freckles, wavy copper-red hair, and a calm confident expression. Setting: bright upscale beach cabana or poolside resort, soft sunlight, clean sand and stone tones, summer skincare mood. Wardrobe: elegant cream linen beach cover-up over a simple summer top, tasteful resort styling, clean and polished. Product: an unbranded premium sunscreen squeeze tube is the commercial hero but not oversized, about 18-22 percent of the frame height, held naturally in one hand near shoulder level with the front label facing camera. The tube is sharp, symmetrical, matte white with a soft pale yellow cap, clean blank label with no readable text, no typography, no logo, no SPF number. Composition: medium close-up from upper waist to head, model slightly angled, sunscreen tube in the foreground but balanced with her face, product and face both clear, warm premium UGC lifestyle aesthetic, realistic skin texture, natural fingers, clean nails, ecommerce-ready, no text overlay, no watermark, brand-safe. Avoid visual errors: oversized product, tiny product, distorted tube, warped label, extra fingers, deformed hands, logos, text, sunburn, oily skin, cartoon look.

## Resultado visual

- Producto: buen balance. Tiene protagonismo sin ocupar demasiado frame.
- Categoria: se entiende como bloqueador solar por formato de tubo y tapa amarilla.
- Identidad: fuerte, mantiene pelirroja, piel clara, pecas y energia premium.
- Styling: resort/playa premium. No es bikini puro por bloqueo de Higgsfield.
- Brand safety: aceptable. Escena de playa limpia, sin claims ni marca inventada.
- Uso comercial: bueno para sunscreen, after-sun, body care verano y ecommerce.

## Intentos bloqueados

1. Bikini modesto en playa/piscina: Higgsfield devolvio `nsfw`.
2. Two-piece swimwear catalogo con cover-up: Higgsfield devolvio `nsfw`.

No hubo `result_url` en los intentos bloqueados.

## Comparacion

| Ronda | Mejor uso | Nota |
|---|---|---|
| Round 05 Codex | Skincare UGC performance | Mejor balance general |
| Round 07 Higgsfield 4K | Packshot skincare | Producto muy fuerte, menos natural |
| Round 08 Higgsfield 4K | Bloqueador solar resort | Mejor para categoria verano/playa |

Decision: Round 08 es la mejor base para vender bloqueador solar, aunque si se necesita bikini visible habria que probar otra herramienta o un prompt con referencia de producto/ropa aprobada.

## QA rapido

| Criterio | Score |
|---|---:|
| Producto visible | 93 |
| Producto no sobredimensionado | 94 |
| Categoria sunscreen | 90 |
| Consistencia de identidad | 92 |
| Naturalidad UGC/resort | 91 |
| Brand safety | 84 |
| Potencial ecommerce | 92 |

Score global: 91/100.

## Observaciones

Se uso maxima calidad disponible en Nano Banana Pro para imagen: 4K. No se publico ni se envio a cliente.

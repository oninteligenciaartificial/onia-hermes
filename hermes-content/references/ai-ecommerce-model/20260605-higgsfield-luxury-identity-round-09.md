# Round 09 - Luxury identity photoshoot

Fecha: 2026-06-05
Estado: prueba interna, no publicada
Herramienta: Higgsfield CLI
Modelo: Nano Banana Pro (`nano_banana_2`)
Referencia base: `20260605-higgsfield-sunscreen-resort-4k-v1.png`
Referencia optimizada para upload: `20260605-higgsfield-sunscreen-resort-4k-v1-reference.jpg`
Salida local: `20260605-higgsfield-luxury-identity-contact-sheet-4k-v1.png`
Formato: 16:9, 4K, 5504 x 3072
Costo estimado: 4 creditos

## Objetivo de la ronda

Crear una hoja maestra de identidad antes de empezar a vender productos:

- fijar rostro;
- fijar sonrisa;
- fijar cuerpo y proporciones;
- documentar angulos de cara;
- documentar cuerpo completo desde varios angulos;
- mantener estetica luxury/resort;
- evitar sexualizacion y mantener uso comercial seguro.

## Prompt usado

Create a professional luxury model identity photoshoot contact sheet using the reference image as a strict identity anchor. Same fictional adult red-haired woman in every frame: very fair skin, natural freckles, copper-red wavy hair, green-hazel eyes, same facial structure, same soft warm smile in every angle. No product. Purpose: lock her face and body reference before commercial campaigns. Layout: elegant 8-panel professional contact sheet, clean ivory background, subtle thin dividers, luxury fashion casting board aesthetic. Panels include: 1 front close-up smiling, 2 left three-quarter close-up smiling, 3 right three-quarter close-up smiling, 4 left profile smiling gently, 5 right profile smiling gently, 6 full-body front pose smiling, 7 full-body three-quarter pose smiling, 8 full-body back view with head turned toward camera smiling. Wardrobe: tasteful luxury resort/editorial outfit, cream linen/silk set, modest fitted silhouette, natural makeup, refined jewelry, polished hair, barefoot or minimal sandals. Lighting: high-end studio daylight, soft shadows, premium skincare/fashion photography, realistic skin texture. Keep face consistent across every panel, preserve the same smile, same freckles pattern, same hair color and length, same body proportions. Brand-safe, non-sexual, no logos, no text, no watermarks. Avoid: different faces, changing age, different smiles, distorted body, unrealistic hands, extra fingers, glamourized sexual pose, cleavage focus, bikini, fake text, labels, logos, blurry panels, cartoon look.

## Resultado visual

- Identidad: alta. Cara, pelo, pecas y energia se mantienen consistentes.
- Sonrisa: buena base. La sonrisa aparece suave y comercial; en algunos paneles es mas sutil.
- Angulos: incluye frontal, 3/4, perfil, cuerpo completo y espalda con giro.
- Cuerpo: proporciona una base usable para campanas fashion, skincare y lifestyle.
- Estetica: luxury resort/editorial, limpia y vendible.
- Riesgo: no garantiza identidad perfecta por siempre; debe usarse como referencia maestra para cada nueva generacion.

## Reglas de uso para ventas

Cuando se generen anuncios nuevos, usar siempre:

1. `20260605-higgsfield-luxury-identity-contact-sheet-4k-v1.png` como referencia de identidad.
2. Instruccion de sonrisa fija: "same soft warm smile from the identity sheet".
3. Instruccion de rostro fijo: "preserve same face, freckles, eyes, nose, lips, jawline and copper-red hair".
4. Producto como variable, no como parte de la identidad.
5. Estetica luxury/resort, fondos limpios, no claims, no logos inventados.

## QA rapido

| Criterio | Score |
|---|---:|
| Consistencia de rostro | 95 |
| Consistencia de sonrisa | 91 |
| Angulos de cara | 96 |
| Cuerpo completo | 92 |
| Estetica luxury | 96 |
| Brand safety | 97 |
| Utilidad como master sheet | 95 |

Score global: 95/100.

## Decision

Usar Round 09 como hoja maestra de identidad para las proximas ventas. Para producto, generar cada anuncio usando esta hoja como referencia primaria y una referencia secundaria del producto si existe.

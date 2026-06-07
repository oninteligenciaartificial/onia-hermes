# Mara Vale Round 01

Fecha: 2026-06-05
Objetivo: crear una primera version visual comparativa de Mara Vale con tres
rutas comerciales.
Modo: built-in image_gen, preview interna, asset copiado al workspace.

## Asset

- Imagen: `20260605-mara-vale-contact-sheet-v1.png`
- Tipo: contact sheet de 3 paneles
- Rutas: Premium, UGC, Lifestyle
- Estado: review interna pendiente

## Prompt usado

```text
Create a high-end contact sheet with three vertical 9:16 panels side by side, showing the same 100% fictional adult AI ecommerce model named Mara Vale across three commercial visual routes. The model must be clearly the same person in all three panels: apparent age 28, warm light olive skin, oval face, almond hazel eyes, softly defined brows, medium brown shoulder-length hair, natural lips, realistic healthy proportions, calm approachable expression, natural skin texture with visible pores, non-sexualized, brand-safe, no celebrity likeness.

Panel 1 title small and clean: Premium. Premium elegant skincare/perfume/fashion campaign. Soft ivory studio background, refined minimal styling, subtle gold jewelry, neutral elegant outfit, product-neutral beauty editorial mood, 85mm lens feel, soft key light, polished but realistic.

Panel 2 title small and clean: UGC. Natural TikTok/ecommerce UGC style. Phone-first vertical frame, realistic bathroom or vanity home setting, daylight, simple white t-shirt or soft neutral sweater, casual practical creator energy, holding a plain unbranded skincare bottle close to camera, candid but clean, believable smartphone look.

Panel 3 title small and clean: Lifestyle. Modern lifestyle for accessories/viral products. Clean urban cafe or boutique street setting, modern casual outfit with denim or light jacket, carrying a plain unbranded small bag or sunglasses, natural motion, product visible, social media campaign energy.

Overall: ultra-realistic commercial photography, consistent identity, same face and hair across panels, clean layout, no brand logos, no watermark, no fake text except the three simple panel labels Premium, UGC, Lifestyle. Avoid plastic skin, distorted hands, celebrity resemblance, exaggerated body, sexualized pose, fake logos, unreadable text.
```

## QA interna

| Criterio | Score | Nota |
|---|---:|---|
| Identidad consistente | 82 | El rostro se mantiene bastante bien; Lifestyle cambia levemente por angulo y expresion. |
| Claridad de rutas | 92 | Las tres rutas se entienden rapido. |
| Potencial comercial | 90 | UGC es la ruta mas vendible para ecommerce y ads. |
| Realismo | 88 | Piel, luz y camara son creibles. |
| Producto visible | 78 | UGC muestra producto claro; Premium y Lifestyle son mas mood/estilo. |
| Seguridad de marca | 82 | No hay logos ni claims; Premium debe cerrarse un poco para quedar mas marca-seria. |
| Manos/producto | 84 | Manos aceptables, botella sin marca correcta. |

Score total estimado: 85.

## Decision

Usar Round 01 como prueba de direccion, no como identidad final.

Ganadora visual/comercial de esta ronda: Ruta 2 UGC.

Por que:

- producto visible;
- cara mas cercana;
- encaja con TikTok Ads, Reels Ads y ecommerce;
- parece menos produccion falsa;
- puede venderse en paquetes mensuales.

## Ajustes para Round 02

1. Mantener rostro de UGC como base maestra.
2. Rehacer Premium con outfit mas editorial y cerrado: blazer, top alto o camisa
   satinada, sin depender de escote.
3. Rehacer Lifestyle con rostro mas parecido al panel UGC y producto mas claro.
4. Crear 3 retratos base separados:
   - frontal neutro;
   - 3/4 sonrisa leve;
   - medio cuerpo UGC.
5. Despues de aprobacion, usar esas imagenes como banco para Soul ID o flujo de
   referencia de identidad.

## Negative prompt recomendado para Round 02

```text
No celebrity likeness, no real influencer likeness, no sexualized styling, no deep neckline, no plastic skin, no beauty filter, no different face between panels, no changed eye shape, no changed nose, no changed lips, no distorted hands, no fake logos, no fake claims, no watermark, no unreadable text.
```


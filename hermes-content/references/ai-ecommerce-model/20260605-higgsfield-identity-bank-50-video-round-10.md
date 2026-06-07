# Round 10 - Identity bank 50 + beauty video draft

Fecha: 2026-06-05
Estado: prueba interna, no publicada
Herramientas:

- Fotos: Higgsfield CLI + Nano Banana Pro (`nano_banana_2`)
- Video fallback: Higgsfield CLI + Google Veo 3.1 Lite (`veo3_1_lite`)
- Post: ffmpeg + overlay ASS

Referencia principal: `20260605-higgsfield-luxury-identity-contact-sheet-4k-v1.png`
Referencia optimizada para upload: `20260605-higgsfield-luxury-identity-contact-sheet-4k-v1-reference.jpg`
Upload ID identidad: `798552dc-3686-4c1a-9e89-6e37f2b3561b`

## Objetivo

Crear un banco amplio para reducir perdida de consistencia antes de empezar a vender:

- minimo 50 fotos;
- diferentes angulos;
- diferentes acciones;
- sonrisa estable;
- estetica luxury;
- usos futuros para skincare, beauty, perfume, accesorios y lifestyle.

## Resultado fotos

Se generaron 5 contact sheets de 10 fotos cada uno y luego se recortaron en 50 JPG individuales.

Carpeta principal:

`identity-bank-50/`

Sheets:

- `20260605-mara-luxury-identity-bank-sheet-01-face-expressions-4k.png`
- `20260605-mara-luxury-identity-bank-sheet-02-body-angles-4k.png`
- `20260605-mara-luxury-identity-bank-sheet-03-beauty-routine-4k.png`
- `20260605-mara-luxury-identity-bank-sheet-04-resort-lifestyle-4k.png`
- `20260605-mara-luxury-identity-bank-sheet-05-commerce-poses-4k.png`

Fotos recortadas:

- Carpeta: `identity-bank-50/photos/`
- Conteo: 50 JPG
- Naming: `mara_identity_01.jpg` a `mara_identity_50.jpg`
- Dimension por foto: 1100 x 1536

## Resultado video

Producto vendido: serum beauty/luxury sin marca, enfocado en look hidratado.

Hook controversial seguro:

`Tu rutina de 10 pasos no era skincare. Era marketing.`

CTA visual:

`Menos pasos. Mas glow.`

Archivos:

- Base Higgsfield: `video-ads/20260605-mara-beauty-serum-controversial-hook-veo-lite-v1.mp4`
- Overlay editable: `video-ads/20260605-mara-beauty-serum-hook-overlay.ass`
- Final con hook: `video-ads/20260605-mara-beauty-serum-controversial-hook-veo-lite-v1-final.mp4`
- QA frame inicio: `video-ads/20260605-mara-beauty-serum-hook-frame-01.jpg`
- QA frame cierre: `video-ads/20260605-mara-beauty-serum-hook-frame-06.jpg`

## QA video

- Hook: legible y fuerte.
- Sonrisa: consistente.
- Cara: reconocible respecto al banco de identidad.
- Producto: aparece, pero puede estar borroso por movimiento.
- Riesgo visual: el video invento una etiqueta "Barrier Glow" y el vestuario queda mas abierto de lo ideal para pauta premium.
- Decision: conservar como borrador interno. No publicar sin version revisada.

## Intento bloqueado/fallido

Marketing Studio Video 15s 1080p fue estimado en 150 creditos, pero la generacion fallo con HTTP 502. Se uso Veo 3.1 Lite 8s como fallback seguro y mas eficiente.

## Reglas para siguientes ventas

1. Usar `identity-bank-50/photos/mara_identity_02.jpg` o Round 09 como ancla de rostro.
2. Usar el banco de 50 fotos como referencia secundaria de angulos/cuerpo.
3. Producto siempre debe ir sin marca si no hay marca real aprobada.
4. Evitar claims tipo anti-aging, elimina manchas, cura acne, resultados garantizados o antes/despues.
5. Mantener gancho controversial contra la industria o la rutina, no contra la inseguridad fisica de la persona.
6. Para pauta real, rehacer video con producto mas claro, camiseta/top mas cerrado y label controlado.

## Score rapido

| Criterio | Score |
|---|---:|
| Banco de identidad | 94 |
| Consistencia rostro/sonrisa | 92 |
| Variedad de acciones | 93 |
| Estetica luxury | 95 |
| Video hook | 96 |
| Video listo para publicar | 72 |
| Utilidad comercial total | 90 |

Score global: 90/100.

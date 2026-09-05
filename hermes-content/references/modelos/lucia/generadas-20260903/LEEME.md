# Lote del 2026-09-03 — E9: ¿sirve el motor barato para la cara?

**Este lote NO produjo una pieza publicable. Produjo un veredicto.** La medición completa está en
[`../BITACORA-PERFECCION.md`](../BITACORA-PERFECCION.md) § **E9**.

## La pregunta

`nano_banana_pro` cuesta **2 cr** por imagen. `text2image_soul_v2` cuesta **0,12 cr** — 16× menos —
y acepta `image_references`. ¿Sostiene la cara de Lucía?

**No.** Y el motivo es estructural: en Soul v2 esa ranura es de **estilo**, no de **identidad**.

## Archivos

| Archivo | Qué es | Asset id | Estado |
|---|---|---|---|
| `S1-rooftop-soulv2.jpg` | Soul v2 + `E3-hotel.jpg` como referencia. 1152×2048 (9:16 exacto), 2K | `16c5920d-fcd6-4e82-b6eb-3700861601c0` | ⛔ **NO USAR EN NINGUNA PIEZA** — no es Lucía. Se conserva como **contraejemplo**, igual que `E4-cafe-kling3_0.mp4` |
| `_S1-FACE-crop.jpg` | Recorte de cara de S1 para comparar contra el canon | — | evidencia |
| `_S1-soul-v2.log` | URL del PNG que devolvió el CLI | — | trazabilidad |
| `_S2-custom-ref.log` | `Error: Character not found` — el Element en la ranura de Soul refs | — | evidencia del mapa de registros |

## Por qué S1 se rechaza — las dos fallas

1. **Cambió la cara.** Sin pecas (rasgo sagrado #1), pelo castaño claro con mechas, rostro más
   anguloso y genérico. No pasa la casilla de identidad de `RUBRICA-IMPOLUTO.md`.
2. **Copió la escena de la referencia.** El prompt pedía rooftop abierto en Santa Cruz al
   atardecer con vaso de café; salió **el hall de hotel de `E3-hotel.jpg`**, con sus sofás de
   cuero y sus lámparas. Ni rooftop, ni baranda, ni ciudad, ni café.

Es exactamente al revés de lo que hace falta: **copió el lugar y cambió la persona.**

## Costo

| Concepto | Créditos |
|---|---:|
| S1 — `text2image_soul_v2` | **0,12** |
| S2 — rechazado antes de generar | **0** |
| **Total del lote** | **0,12** |

Cotizado con `generate cost` antes de disparar; el cobro en `account transactions` coincidió
**exacto**. Saldo 1939,06 → 1938,94.

## Qué usar mientras tanto

La receta viva para cara protagonista sigue siendo la de
[`../TECNICA-HIGGSFIELD.md`](../TECNICA-HIGGSFIELD.md) §11 — `nano_banana_pro` +
`--image-references <foto buena>`, **2 cr**.

⚠️ El subcomando del CLI es **`generate create`**. `generate image` no existe.

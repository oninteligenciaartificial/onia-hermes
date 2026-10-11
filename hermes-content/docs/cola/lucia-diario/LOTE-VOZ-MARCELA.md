# Lote de voz Marcela (ElevenLabs) — para aprobar. NADA se genera sin el sí escrito

> Preparado el 11-oct-2026 por la sesión Lucía (nube) por orden de la madre marketing. **Esto es una propuesta de gasto de cupo, no un permiso.** La voz se genera solo con el sí escrito
> de la madre (o de Sergio Urcullo vía la madre) **en esta sesión**, citando el lote. D4 (11-oct): la voz Marcela queda con su acento.

## Cupo y cómo se cuenta

- **El cupo se mide en caracteres, no en créditos.** El texto enviado es el de `guion-voz.txt` con las líneas unidas (se cuentan los saltos/espacios entre líneas).
- **Quedan 381 caracteres hasta el 13-oct 01:17 UTC** (12-oct 21:17 La Paz). El cupo renovado **no está confirmado**: lo sabe la madre (pregunta única abajo).
- Referencia medida (G1 v2, la armó la madre): **320 caracteres ≈ 19 s ⇒ ≈ 17 caracteres por segundo**. Las líneas se retemporizan a las duraciones reales (nunca se acelera la voz).
- Una retoma gasta el cupo otra vez. Con 381 no hay margen para retomar piezas de 400+ caracteres.

## Piezas con voz pendiente (contados hoy, 11-oct, sobre los `guion-voz.txt` de cada carpeta)

| Pieza | Líneas | Caracteres | ≈ Segundos hablados | ¿Cabe en 381? | Recorte para caber |
|---|---:|---:|---:|---|---|
| **P9** «La cara o la escena.» (`videos/lucia-p9-luz-cara/`) | 7 | **304** | 17,9 | **Sí, sobran 77** | — (el guion puede cambiar según la revisión en curso) |
| **G3 v2** «Tres errores que casi publico» | 12 | 412 | 24,2 | No (faltan 31) | −8 % (31+ car) |
| **G2 v2** «Misma orden, seis clips» | 14 | 415 | 24,4 | No (faltan 34) | −9 % |
| **G5 v2** «Cómo mido si una cara es la de Lucía» | 10 | 418 | 24,6 | No (faltan 37) | −9 % |
| **G4 v2** «Seis motores de imagen, una cara» | 12 | 444 | 26,1 | No (faltan 63) | −15 % |
| **Total G3+G2+G5+G4** | | **1.689** | | | con retomas ×1,3 ≈ 2.200 |
| Total con P9 | | 1.993 | | | |

Conteos: `python3` sobre cada `guion-voz.txt` (líneas no vacías, `con_saltos`). Los números cambian si el revisor o la madre tocan un guion; se recuentan antes de generar.

## Lo que propongo (recomendación, elegí vos)

**Lote 1 — con el cupo que vence el 13-oct 01:17 UTC:** una sola pieza.
- **Si el cupo se pierde al renovar:** conviene gastar los 381 en **la pieza que sale primero con voz, G3 v2** (viernes 16-oct, `ORDEN-DE-POSTEO-LUCIA.md`), recortada a ≤ 375 caracteres (−37 car, −9 %). Sin margen de retoma: una sola toma.
- **Si el cupo sobrante pasa al período nuevo o la renovación es grande:** no apurar nada; se voza G3 completa con la cifra renovada.
- **P9 (304)** cabe sin recortar, pero sale recién el 30-oct y su guion todavía puede cambiar por la revisión: no es la mejor inversión de un cupo que vence.

**Lote 2 en adelante (G2, G5, G4, P9 y las pruebas nuevas):** con el cupo renovado. Necesidad semanal: una semana tipo ≈ 730 caracteres (un reel de 25 s ≈ 425 + uno corto de 18 s ≈ 305), con retomas ≈ 950.

## Pregunta única para la madre

¿Cuál es el cupo **renovado** de caracteres (cifra y fecha de renovación) y el sobrante del período actual se pierde el 13-oct 01:17 UTC? Con eso elijo entre «Lote 1 = G3 recortada» y «esperar la renovación».

## Cómo se aprueba (formato exacto, una línea)

`Sí, generá voz Marcela: <pieza> (<N> caracteres, una toma).` — la escribe la madre en esta sesión. Sin esa línea no se genera.

## Qué hago después del sí (sin gasto adicional)

1. Recorto/ajusto el guion de voz de la pieza y pido el OK del texto final si cambió algo de lo aprobado.
2. Genero la voz con la voz Marcela por la vía autorizada (la misma de G1 v2) y mido las duraciones reales por línea (`duraciones.json`).
3. Retemporizo `plan.json` (`scripts/voz.mjs` → `retemporizar.mjs`, y `poner-voz.mjs`), con pausa ≤ 0,25 s entre frases, −14 LUFS, sin cama de música.
4. Render, preview 360p mirado, gates (`lucia-prohibidas.mjs`, `lucia-qa-tabla.mjs`), revisor independiente (`sonnet`) y verificador (`haiku`); SHA nuevo en `videos/lucia-entrega/README.md`; «LISTA PARA MOSTRAR».

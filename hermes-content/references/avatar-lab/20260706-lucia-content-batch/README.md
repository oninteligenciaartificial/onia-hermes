# Lucia — lote de contenido y patrones (2026-07-06)

Primer lote real de contenido tras el fix de forehead (ver `AVATAR-CONSISTENCY-SCHEME.md`
y `lucia-onia-identity-bible.md`). Objetivo: aprender patrones de que funciona barato vs
caro, y que tipo de contenido sirve para cuenta propia vs Nuvia/cliente.

## Contenido de este lote

| Archivo | Nivel | Costo | Que muestra |
|---|---|---|---|
| `lifestyle-bedroom.png` | 1 (soul_2) | 0.12cr | Generico, sin marca. Cuenta propia. |
| `lifestyle-kitchen.png` | 1 (soul_2) | 0.12cr | Generico, taza sin marca. Cuenta propia. |
| `lifestyle-street.png` | 1 (soul_2) | 0.12cr | Generico, full-body calle. Cuenta propia. |
| `lifestyle-bathroom-product.png` | 1 (soul_2) | 0.12cr | Producto en mano PERO marca inventada ("ROXIA") — Nivel 1 no puede traer marca real. |
| `lucia-lifestyle-talking-es.mp4` | 3 (wan2_7 + seed_audio) | 15cr | Hablando en **espanol**, lipsync natural, forehead liso se mantiene en video animado. |

## Patron confirmado
- **Nivel 1 (barato, solo texto) = techo generico.** Sirve para volumen/feed diario, pero
  NUNCA puede reproducir una marca/producto real (inventa etiquetas genericas). Es
  contenido natural de **cuenta propia** (lifestyle, sin sponsor).
- **Nivel 2+ (Marketing Studio, caro) = unico nivel con marca real legible.** Es el
  contenido "de cliente/Nuvia" — pieza puntual, no de volumen.
- Conclusion para la pregunta "cuenta propia vs cuenta Nuvia": no hace falta elegir una
  sola cuenta — el nivel de produccion YA separa organico (barato, Nivel 1/3) de
  sponsoreado (caro, Nivel 2), como cualquier influencer real. Pueden convivir en la
  cuenta propia de Lucia.

## Fix de forehead (contexto)
Prompt seguro usado en todo este lote: encuadre "half-body natural lifestyle photo",
luz difusa (no cenital dura), + negativo explicito "poreless smooth forehead skin with
zero wrinkles zero fine lines zero creases". Se mantiene estable incluso animado
(wan2_7). Ver el pitfall completo en `AVATAR-CONSISTENCY-SCHEME.md`.

## Pendiente (no ejecutado, queda armado)
Video Marketing Studio (Nivel 2, ~42cr) en espanol + estilo lifestyle (dormitorio/cocina
en vez de bano clinico) con producto real de Nuvia — prompt armado, no corrido todavia
a pedido de Sergio ("dejalo armado").

# D17 — Cuatro anuncios de @oniahq, cada copy con la foto de SU rubro

**4 piezas independientes** 1080×1350 · `--pack historia-fancy --format feed` · **cero créditos**.

## Qué hueco cierra

`PLAN_DE_CONTENIDO.md` lo tenía anotado: *«Los 8 [ads] hablan de clínica dental y sólo hay una foto
de consultorio»*. El resultado era copy dental sobre foto de almacén — la foto desmintiendo al texto.

Ya no: el banco tiene fotos de taller, ferretería, restaurante y consultorio, **todas con la misma
cara**. Cada anuncio va con la escena de su rubro.

| Pieza | Rubro | Dolor |
|---|---|---|
| `AR01-taller.png` | Taller mecánico | Sabés qué repuesto falta cuando el cliente ya se fue |
| `AR02-restaurante.png` | Almuerzo | A las tres nadie se acuerda cuántos platos salieron |
| `AR03-ferreteria.png` | Ferretería | El cuaderno no falla: falla acordarse de abrirlo |
| `AR04-dental.png` | Consultorio | Si se pierde la tarjeta, se pierde el turno |

CTA en las cuatro: **`Reservá una demo`**.

## 🔴 La trampa que casi se publica: «DESLIZÁ» en un anuncio suelto

El primer render puso **`DESLIZÁ →` en tres de los cuatro**, porque comparten archivo de brief y el
pack contaba `total > 1`. **Un anuncio suelto que dice deslizá le miente al lector**: no hay nada al
lado, y el que desliza y no encuentra nada se va.

El primer arreglo también estaba mal: usé `slide.cta` como señal de «pieza suelta», sin saber que
**el renderer inyecta el `cta` del brief en TODAS las láminas**. Resultado: el carrusel D16 se rompió
al revés — CTA en las cuatro y ningún «DESLIZÁ».

**La señal correcta es explícita y por lámina: `"suelta": true` en el brief.** Verificado mirando
los tres casos juntos: ad suelto (CTA, sin deslizá) · carrusel lámina 1 (deslizá, sin CTA) ·
carrusel lámina 4 (CTA).

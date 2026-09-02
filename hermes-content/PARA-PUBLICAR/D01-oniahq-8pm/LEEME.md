# D01 — «Las 8 de la noche» · carrusel de venta de 5 láminas

**Rehecho el 2026-09-02.** Antes era **una sola lámina con el botón encima**: pedía la acción
antes de haber vendido nada. La caption ya tenía la estructura completa; la imagen no.

Sergio: *«que no se repita el botón a cada rato, en la última que venda algo, tiene que ser una
estructura de venta con CTA y hook, y diseños diferentes»*.

## La estructura, y qué hace cada lámina

| # | Rol | Pack | Por qué |
|---|---|---|---|
| 1 | **HOOK** | `bloque-solido` | *«Alguien quiere darte trabajo. Y vos ya cerraste.»* Frena el scroll con una escena, no con una promesa. **Sin botón.** |
| 2 | **AGITACIÓN** | `historia-fancy` + foto | El costo concreto: le contestás a las 9 y ya reservó en otro lado |
| 3 | **EL GIRO** | `bloque-solido` | *«No lo perdiste por caro. Lo perdiste por horario.»* Reencuadra el problema — es la lámina que hace pensar |
| 4 | **MECANISMO** | `historia-fancy` + foto | Recién acá aparece qué hace el producto |
| 5 | **CTA** | `bloque-solido` | **El único botón de todo el carrusel:** `Comentá DEMO` |

**Los diseños alternan a propósito:** tarjeta crema sobre verde / foto a sangre / tarjeta / foto /
tarjeta. Cinco láminas iguales se leen como una sola y el pulgar sigue de largo.

**Las fotos tienen sentido, no son decoración:** la 2 es un negocio atendiendo (el momento que se
pierde) y la 4 es el mostrador entregando el turno (lo que el asistente automatiza).

## 🔴 El bug que encontró Sergio mirando el render

`carousel_pack_solido.js` tenía `role !== 'cta' && last` para dibujar el botón — pensado para el
caso de UNA lámina. En un carrusel, `roleFor` marca la última como `'cta'`, así que **el botón NO
se dibujaba justo en la lámina que existe para pedir la acción.** Corregido a `last && slide.cta`.

## Al publicar

- 🔴 La palabra **`DEMO`** tiene que estar viva en el mapa de n8n **de @oniahq**.
- La caption (`CAPTION.txt`) ya trae la estructura completa y no se toca.

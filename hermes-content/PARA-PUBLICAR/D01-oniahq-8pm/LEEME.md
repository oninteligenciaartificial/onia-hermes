# D01 — «Las 8 de la noche» · carrusel de venta, pack `venta-editorial`

**Segunda versión, 2026-09-02.** Sergio: *«va bien D01, pero ahora que no sea una cajita
estática»* + su tablero de Pinterest de carruseles.

## Qué estaba mal con la versión de la tarjeta

`bloque-solido` ponía **la misma tarjeta crema centrada en las cinco láminas**. Aunque el texto
cambie, el ojo ve el mismo rectángulo cinco veces y el pulgar sigue de largo. Y la caja
**comprimía el titular** a ~96px, cuando las referencias que funcionan lo ponen al doble.

## Las cuatro cosas que copié del Pinterest — la mecánica, no la identidad

| # | Qué | De dónde |
|---|---|---|
| 1 | **El texto sangra.** Sin contenedor: arranca en el margen y llega al borde | «Los monstruos que nadie te cuenta» |
| 2 | **Mezcla de familias en la misma frase**: sans black + una palabra en serif italic | «4 TYPES *of carousels* going VIRAL» |
| 3 | **Índice grande `01/05`.** No es adorno: dice cuánto falta, que es lo que sostiene el deslizar | el carrusel de 01 a 05 |
| 4 | **Una línea que conecta** y **baja de altura en cada lámina**, así se lee como recorrido y no como cinco posts | la misma |

Lo que **no** copié: paletas, tipografías pixel, el amarillo. El acento sigue siendo el verde de
Onia y aparece **una vez por lámina** — regla heredada de `bloque-solido`, que ahí sí estaba bien.

## La estructura de venta

| # | Rol | Qué hace |
|---|---|---|
| 01 | **Hook** | *«Alguien quiere darte plata. Y vos ya cerraste.»* Escena, no promesa |
| 02 | **Agitación** (foto) | Le contestás a las nueve y ya reservó en otro lado |
| 03 | **El giro** | *«No lo perdiste por caro. Lo perdiste por horario.»* |
| 04 | **Mecanismo** (foto) | Recién acá aparece qué hace el producto |
| 05 | **CTA** | **El único botón del carrusel:** `Comentá DEMO` |

## ⚠️ El velo de las fotos: direccional, no parejo

El primer render tapaba la foto con un velo uniforme al 90 %: la escena quedaba gris y **daba lo
mismo no poner la foto**. Ahora el degradado va de casi transparente arriba —donde está la escena,
que es el motivo de poner una foto— a fuerte abajo, donde se apoya el texto.

🔴 La palabra **`DEMO`** tiene que estar viva en el mapa de n8n **de @oniahq**.

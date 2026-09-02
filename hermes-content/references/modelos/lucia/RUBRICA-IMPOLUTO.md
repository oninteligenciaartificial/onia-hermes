# Rúbrica «impoluto» — qué tiene que cumplir una pieza de Lucía para publicarse

> Escrita el **2026-09-02** para la ventana de perfeccionamiento de 2 h.
> Sergio: *«prueba absolutamente todo hasta que tus generaciones sean impolutas»*.
>
> «Impoluto» no es una opinión: es **9 casillas que se marcan MIRANDO la pieza**. Una pieza con
> las 9 se publica sin retoque. Una pieza con 8 se anota y se regenera cambiando UNA variable.

## Las 9 casillas

| # | Casilla | Cómo se verifica | Por qué mata la pieza si falla |
|---|---|---|---|
| 1 | **La cara es Lucía** | Comparar contra `G06` y `B06`: pecas del pómulo, lunar bajo el ojo izquierdo, forma de ceja, cadenita | Si la cara cambia entre piezas, deja de ser una influencer y pasa a ser stock. Es lo único irreemplazable |
| 2 | **9:16 exacto** | `ffprobe` → `1080x1920` o `720x1280`. **Medido, no supuesto** | Meta Reels/Stories recorta o pone barras. Una barra negra grita «esto no se hizo para acá» |
| 3 | **Cero texto legible** | Zoom a carteles, remeras, pantallas, precios | La IA inventa palabras rotas. Un cartel mal escrito es lo primero que delata la generación |
| 4 | **Manos correctas** | Contar dedos en cada mano visible. 5 y 5 | Es el defecto que el ojo humano detecta sin saber por qué |
| 5 | **Acción a medias** | ¿Hay dos manos sobre un mismo objeto, a mitad de un gesto? | Sin gesto a medias, el video se inventa el movimiento (el defecto de `V04-parada`) |
| 6 | **Luz del lugar, no de estudio** | ¿La sombra cae donde la ventana la pondría? ¿Hay rebote del piso? | Luz de campaña = anuncio. Luz real = alguien filmó esto |
| 7 | **Piel con poros** | Zoom al pómulo: ¿hay textura, o es plástico? | El «campaign look» alisa la piel y rompe la casilla 1 al mismo tiempo |
| 8 | **Colores true-to-life** | ¿Los verdes son verdes de Santa Cruz o verdes de filtro? | El teal-and-orange marca la pieza como IA de 2023 |
| 9 | **La cara aguanta el clip entero** | Video: 4 frames (inicio, ⅓, ⅔, final). La cara está en los 4 | El defecto de `V04`: se da vuelta en el segundo 5 y pierde la cara |

## Cómo se puntúa

```
IMPOLUTA   9/9  -> va al calendario, se anota en el LEEME
CASI       8/9  -> se anota QUE casilla fallo y se regenera cambiando UNA variable
ROTA      <8/9  -> se anota el defecto y NO se regenera igual: se cambia la receta
```

🔴 **Una casilla fallada se anota SIEMPRE**, aunque la pieza se descarte. El valor de la ventana
no son las piezas: es **saber qué variable del prompt causa cada defecto**.

## La regla del experimento

**Una variante cambia UNA variable.** Si se cambian dos y mejora, no se sabe cuál fue.
Variables conocidas hasta hoy:

| Variable | Valores probados | Qué se sabe |
|---|---|---|
| `--aspect-ratio` | `1:1` (default CLI), `9:16`, 3:4 (default web) | 9:16 obligatorio para Reels |
| Modelo imagen | `nano_banana_pro` (2 cr) | Único medido |
| Modelo video | `seedance1_5` (4,8), `kling3_0_turbo` (7,5), `kling3_0` (8,75) | Seedance da vertical AUNQUE la fuente sea 3:4 |
| Cierre anti-cartel | con / sin `No signs, no labels…` | Pedir el cartel gana sobre pedir que no se lea (caso B05) |
| Léxico de estilo | `fashion campaign` ⛔ / `NATURAL TRUE-TO-LIFE COLORS` ✅ | «campaign» cambia la cara |

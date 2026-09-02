# Historias quiz — pack `historia-quiz` (2026-09-02)

Primer uso del pack nuevo. Nace del diseño que mandó Sergio el 02-sep
(@ingenierobinario); el desglose está en
[`../../video-intake/2026-09-02-ingenierobinario-historia-quiz.md`](../../video-intake/2026-09-02-ingenierobinario-historia-quiz.md).

## Cómo se renderiza

```
node scripts/carousel_render.js \
  --brief hermes-content/carousels/briefs/historias/lucia-quiz-ejemplos.json \
  --pack historia-quiz --account lucia --format story
```

⚠️ **El `--format story` va por CLI, no lo toma del brief.** Sin él sale en 4:5 y la
historia queda recortada — pasó en el primer render.

## 🔴 Al publicar: las opciones se tipean, no están dibujadas

El pack deja **el tercio inferior vacío a propósito**. Ahí va el **sticker nativo de
encuesta de Instagram**, y las cuatro opciones se copian del campo `options` del brief.

Es lo único que hace funcionar al formato: responder cuesta **un toque**, y devuelve
**quién** respondió qué. Una imagen con las opciones pintadas no se puede tocar.

## HQ01 — «¿Qué sale?»

`HQ01-que-sale.png` · 1080×1920 · cero créditos.

Opciones para el sticker: `Un post tuyo` · `Un post genérico` · `Un post tuyo mal escrito` ·
**`Depende de los ejemplos`** ← la correcta.

**Por qué sorprende:** la respuesta obvia es «un post genérico», y la real es que la IA
copia lo que le mostrás — con tres ejemplos flojos, copia lo flojo. El que se equivoca se
queda pensando, y eso da pie a la historia siguiente.

**Verificado mirando el PNG:** 9:16 real, las tres líneas entran sin recorte, el verde
aparece una sola vez (en la pregunta), la ventana con los tres puntitos se lee, y el hueco
inferior queda libre.

---

## La secuencia completa — se publican las tres el mismo día, en orden

Brief: [`../../../../carousels/briefs/historias/lucia-quiz-serie-01.json`](../../../../carousels/briefs/historias/lucia-quiz-serie-01.json)

Una historia-quiz suelta se responde y se olvida. **Tres encadenadas hacen que el que votó
vuelva a ver si acertó**, y ése es el único motivo por el que alguien mira la segunda.

| # | Archivo | Qué es | Sticker |
|---|---|---|---|
| 1 | `HQ01-que-sale.png` | La trampa: qué devuelve una IA con tu web y 3 ejemplos | **SÍ** — 4 opciones |
| 2 | `HQ02-la-respuesta.png` | La respuesta + el porqué | **NO** — es la respuesta |
| 3 | `HQ03-cuantos-intentos.png` | La trampa siguiente: cuántos intentos hasta que salga bien | **SÍ** — 4 opciones |

⏱️ **HQ02 va 15-30 min después de HQ01**, para que la encuesta junte votos antes de revelar.
Publicarlas juntas mata la encuesta.

### HQ02 — «La respuesta»

Rompe el patrón a propósito: **la barra verde lleva la respuesta, no una pregunta**. Mismo
componente, otro uso — por eso el pack no hardcodea el signo de interrogación.

### HQ03 — «¿Cuántos intentos?»

Opciones: `1, la IA ya está lista` · `3 o 4` · `Más de 10` ·
**`Depende de si guardás lo que falla`** ← la correcta.

**Por qué es honesta y no un truco:** el banco de Lucía tiene 15 imágenes y **cuatro se guardan
ROTAS a propósito** — la que inventó un cartel (`B05`), la que perdió la cara (`V08`), la que salió
de otra persona (`B09`), la que se dio vuelta (`V04`). Sin esas cuatro, cada intento nuevo repite
el mismo error. **Es literalmente cómo se armó esta cuenta**, contado como acertijo.

Y da pie a la historia siguiente, que ya está escrita en el análisis: mostrar una de las rotas.

---

## 🔴 Corrección de Sergio: «tus diseños no los hagas pobres, Lucía es fancy»

**Tenía razón, y el error tiene nombre.** Las `HQ01-03` están copiadas de @ingenierobinario,
que es un **canal de programación**: fondo negro plano, ventana de terminal, bloque de color
saturado. Para un dev boliviano eso funciona. Para una influencer es pobre — **no tiene nada de
ella: ni su cara, ni luz, ni aire.** Copié la estructura del formato y me traje también su
identidad, que era justo lo que el análisis decía NO copiar.

### El pack `historia-fancy` — qué cambia y por qué

| | `historia-quiz` (pobre) | `historia-fancy` |
|---|---|---|
| Fondo | Negro plano | **La foto de Lucía, a sangre** |
| Legibilidad | Caja opaca sobre el fondo | **Dos degradados** — la piel y la luz siguen viéndose |
| Pregunta | Sans en caja verde | **Serif display 92px**, sobre la foto |
| Verde | Bloque saturado entero | **Un filete de 3px** |
| Qué comunica | «Esto es técnico» | «Esta persona existe y su vida se ve bien» |

**Lo único que se conserva es el hueco inferior**, porque es lo que hace funcionar al formato:
ahí va el sticker nativo de encuesta. **Las opciones nunca se dibujan.**

### Por qué la foto es el diseño y no un adorno

Una historia de influencer **sin su cara es una placa de texto**, y a una placa de texto no la
sigue nadie. Además ya teníamos el material: el loop del VPS generó anoche `E3-cafe`, `E3-hotel`
y `E3-coworking` con la receta fancy 9/9 (§17), y **estaban sin usar**. El diseño pobre no era
por falta de fotos: era por no mirarlas.

| Pieza | Foto | Trampa |
|---|---|---|
| `HF01-cuantos-intentos.png` | `E3-cafe` — luz dorada de ventana, ambas manos en la taza | Cuántos intentos hasta que salga bien → **«depende de si guardás lo que falla»** |
| `HF02-que-sale.png` | `E3-hotel` — hall de hotel, lámparas cálidas | Qué devuelve la IA con tu web y 3 ejemplos → **«depende de los ejemplos»** |

**Las `HQ01-03` no se borran:** quedan como el contraejemplo de qué pasa cuando se copia la
identidad de la referencia en vez de sólo su mecánica.

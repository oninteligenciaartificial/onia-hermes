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

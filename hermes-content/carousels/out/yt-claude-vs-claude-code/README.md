# Video 1 — "Qué es Claude y Claude Code"

**La fuente de verdad es [`deck.html`](deck.html).** Los PNG salen de ahí; no se editan a mano.

Es un video **puro explicativo**. La instalación, la configuración y las skills son el
**video 2** — nada de eso entra acá.

## Cómo se usa al grabar

Abrí `deck.html` en el navegador, pantalla completa (F11).

| tecla | qué hace |
|---|---|
| `→` `espacio` | siguiente lámina |
| `←` | anterior |
| `N` o `H` | muestra/oculta la chuleta del tramo (no sale en el video) |
| `#7` en la URL | abre directo en esa lámina |
| `Ctrl+P` | PDF, una lámina por página |

El lienzo es 1920×1080 fijo y se escala a la ventana: **lo que ves en pantalla es el
encuadre exacto que va a salir en el video**, no una aproximación.

## Rehacer los PNG

```bash
for n in 1 2 3 4 5 6 7 8 9 10; do
  chrome --headless --window-size=1920,1080 \
    --screenshot="lamina-$(printf %02d $n).png" "deck.html?limpio#$n"
done
```

`?limpio` saca el contador y las notas. Sin eso, salen quemadas en la imagen.

## Las 10 láminas

| # | tramo | qué carga la explicación |
|---|---|---|
| 1 | Hook | la pregunta que le hacen a Sergio Urcullo todo el tiempo |
| 2 | Qué es Claude | diagrama: preguntás → contesta → y ahí termina |
| 3 | El problema | diagrama del bucle de copiar y pegar, con VOS en el centro |
| 4 | Por qué falla | diagrama: Claude afuera del vidrio, tus archivos adentro |
| 5 | **El giro** | duelo Claude / Claude Code — la única idea del video |
| 6 | Qué cambia | diagrama: lee → cambia → prueba → te muestra, con el reintento solo |
| 7 | La objeción | tarjeta de permiso: no hace nada a tus espaldas |
| 8 | La prueba | los 4 cron reales de `nodo-casa` en 24 h |
| 9 | La parte honesta | 12 errores · 200 dólares · no te vuelve programador |
| 10 | Cierre | la frase de una línea + anuncio del video 2 |

## El logo de Claude

`claude.png` es el logo **oficial**, copiado de
`references/ui-patterns/apple-editorial/logos/claude-oficial.png`. Uso **nominativo** —
"explico esta herramienta" — sin alterar las formas ni sugerir afiliación, igual que el
resto de los logos del patrón (ver su `LICENCIA.md`).

**Claude Code no tiene logo propio y NO se le inventa uno.** Se muestra como una ventana
de terminal, que es literalmente donde vive. Un logo dibujado a mano en una pieza pública
lee como falsificación — es la misma razón por la que existe `build-logos.py`.

## Reglas de esta pieza

- **Las cifras van escritas en la lámina.** Se graba improvisando, y un número es lo
  primero que se dice mal. Si está en pantalla, no depende de la memoria.
- **Los diagramas explican; el texto remata.** Si una lámina necesita un párrafo para
  entenderse, el diagrama está mal.
- **Patrón `apple-editorial`** (aprobado el 06-sep): Inter + Instrument Serif, sin
  collage, sin sticker, sin grano. Receta en
  `hermes-content/references/ui-patterns/apple-editorial/FICHA.md`.
- **El verde de Onia no se usa.** La pieza no nombra a Onia, y la FICHA lo reserva para
  el CTA y para donde aparece la marca.
- La lámina 9 dice que se equivoca **a propósito**: es lo que separa esto de un canal
  que vende humo. No se saltea aunque el video vaya largo.

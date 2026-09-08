# Video 1 — "Qué es Claude y Claude Code"

**La fuente de verdad es [`deck.html`](deck.html).** Los PNG salen de ahí; no se editan a mano.

Es un video **puro explicativo**. La instalación, la configuración y las skills son el
**video 2** — nada de eso entra acá.

## `deck.html` es autocontenido

El logo y las tres tipografías van **incrustados en base64 adentro del archivo** (260 KB).
Se hizo así porque el deck viaja: se manda por chat, por mail, se abre en otra máquina. Al
separarse de su carpeta se rompían el logo y la tipografía, y lo único que se veía era un
cuadrito roto sin ninguna pista del motivo. **Un archivo que se rompe al moverlo no sirve
como material de grabación.**

Si editás el texto del deck y querés reincrustar (o cambiás un asset):

```bash
python incrustar-assets.py
```

Es idempotente: reemplaza el bloque anterior, no lo acumula, y verifica que los cuatro
assets quedaron adentro antes de decir que salió bien.

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
for n in $(seq 1 11); do
  chrome --headless --window-size=1920,1080 \
    --screenshot="lamina-$(printf %02d $n).png" "deck.html?limpio#$n"
done
```

`?limpio` saca el contador y las notas. Sin eso, salen quemadas en la imagen.

## Las 11 láminas

Los dos logos y la comparativa van **al principio** (decisión de Sergio Urcullo): primero
se ve la respuesta, después se explica cada uno por separado.

| # | tramo | qué carga la explicación |
|---|---|---|
| 1 | Hook | los DOS logos en pantalla, ya diferenciados |
| 2 | Los dos | nombre + verbo de cada uno, nada más |
| 3 | **Comparativa** | 4 filas lado a lado — la lámina que la gente pausa |
| 4 | Parte 1 · Claude | chat con burbujas |
| 5 | Parte 1 · el problema | el bucle de copiar y pegar, con VOS en el centro |
| 6 | Parte 1 · por qué falla | Claude afuera del vidrio, tus archivos adentro |
| 7 | Parte 2 · Claude Code | terminal real, con el ✗ que falla y reintenta solo |
| 8 | Parte 2 · la objeción | pide permiso antes de tocar nada |
| 9 | Mi caso | los 4 cron reales de `nodo-casa` en 24 h |
| 10 | La parte honesta | 12 errores · 200 dólares · no te vuelve programador |
| 11 | Cierre | la frase de una línea + anuncio del video 2 |

De la 4 a la 9 hay un **chip en la esquina** que dice de cuál de los dos se está hablando.
Es lo que evita que el espectador se pierda a mitad del video.

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
  el CTA y para donde aparece la marca. El acento acá es el terracota de Claude.
- La lámina 10 dice que se equivoca **a propósito**: es lo que separa esto de un canal
  que vende humo. No se saltea aunque el video vaya largo.

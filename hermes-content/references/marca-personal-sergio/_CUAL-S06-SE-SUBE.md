# ✅ RESUELTO — Sergio eligió el VERDE DE ONIA (01-sep)

**Gana la carpeta `S06` (verde), no `render/S06` (naranja).** Aplica a las OCHO piezas del
carril: una sola identidad visual en las tres cuentas, y se nota que Onia es suya.

El verde es además lo que sale hoy corriendo el render sin argumentos, así que no hay que
tocar `scripts/carousel_render.js`. **Las versiones naranjas quedan superadas.**

---

_Lo que sigue es el análisis del 31-ago que planteó la pregunta._

# S06 existe en DOS versiones — y no es un error de render

**Comparadas mirando las dos portadas el 2026-08-31.** El layout, el texto, el número de láminas
y el handle son **idénticos**. Lo único que cambia es el **color de acento**:

| Carpeta | Láminas | Acento | Hoja de contacto |
|---|---|---|---|
| `render/S06` | 9 + `_CONTACTO.png` | 🟠 **naranja/ámbar** | sí |
| `S06` | 9 | 🟢 **verde de Onia** | no |

Las 19 están trackeadas en git, así que ninguna se pierde. Y **no hay una superada**: son dos
decisiones de marca distintas.

## Por qué no se elige acá

`scripts/carousel_render.js` **no define un acento propio por cuenta** — el comentario del propio
archivo lo dice: *«sin `accent` propio hereda el tema»*. El tema por defecto son los verdes
(`#10C26B`). O sea:

- La versión **verde** es la que sale hoy corriendo el render sin argumentos.
- La versión **naranja** salió de un `--accent` explícito, o de un tema anterior.

## La pregunta que decide, y es de Sergio

**¿La marca personal de Sergio usa el verde de Onia, o tiene acento propio?**

El repo separa las dos cuentas a propósito — `ONIA_ARQUITECTURA_CUENTAS_Y_MODELOS.md` rutea
@oniahq y @sergio_urcullo a destinos distintos. Un carrusel personal con el verde corporativo
se lee como un anuncio de Onia, que es justo lo que esa separación evita. Pero eso es un
argumento, no un dato: **puede que el verde sea deliberado** para que se note que Onia es suya.

⚠️ **Hasta que Sergio responda, no se publica ninguna de las dos.** No porque una esté rota,
sino porque publicar una es responder la pregunta sin haberla hecho — y la respuesta después
aplica a las ocho piezas del carril, no sólo a S06.

## Y esto no es sólo de S06

Es el mismo doble render que ya se pagó en Lucía (`render-l6` vs `L6`, `render-fijado` vs
`FIJADO`). Allá se resolvió mirando: ganó la tipografía legible. Acá **no se resuelve mirando**,
porque las dos se ven igual de bien. Conviene revisar si las otras piezas de este carril
(S01–S08) también existen duplicadas con acentos distintos antes de publicar cualquiera.

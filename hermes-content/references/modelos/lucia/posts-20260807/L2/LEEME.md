# L2 · Carrusel fijado «¿Quién es Lucía?» — renderizado 2026-09-03

**7 láminas, 1080×1350 (feed 4:5), 0 créditos.** Espera el OK de Sergio.

- Brief: [`../briefs/lucia-quien-es-fijado.json`](../briefs/lucia-quien-es-fijado.json)
- Láminas: `slide-01.jpg` … `slide-07.jpg`
- Comando exacto (reproducible desde un clon limpio):

```sh
node scripts/carousel_render.js \
  --brief hermes-content/references/modelos/lucia/posts-20260807/briefs/lucia-quien-es-fijado.json \
  --out  hermes-content/references/modelos/lucia/posts-20260807/L2 \
  --account lucia --pack editorial-clean --format feed
# el render escribe PNG; al repo entran JPG (ver "la trampa del PNG" abajo)
for f in slide-*.png; do ffmpeg -loglevel error -y -i "$f" -q:v 3 "${f%.png}.jpg"; done && rm -f slide-*.png
```

⚠️ **`--account lucia`, no `onia`**: con `onia` el pie sale `@oniahq` en una pieza de Lucía.
Verificado en el render: las 7 llevan `@lucia.antelo.oficial`.

## De dónde salen los fondos — y por qué se cambiaron

El brief **apuntaba a 6 fotos de `tanda-20260821/` que no existen en ninguna rama**. Contado en
vivo el 2026-09-03, no heredado:

| dónde | imágenes de `tanda-20260821/` |
|---|---|
| disco de este worktree | **0** (esa carpeta tiene sólo `.mp4` y `.mp3`) |
| `origin/main` | **0** |
| `origin/claude/ads-creatividades-publicos` | **0** |

No es que estén en otra rama: **nunca entraron a git**. Eran PNG, y `*.png` está ignorado en todo
`references/modelos/` (ver abajo). Existieron sólo en la máquina donde se generaron.

Repuntado al banco **`generadas-20260902/`**, que sí está commiteado (las 6 imágenes) y es el
mejor documentado del carril — `lucia-skin-v1`, Nano Banana Pro, 2K 9:16, auditado en su
[`LEEME.md`](../../generadas-20260902/LEEME.md).

| # | Rol del brief | Foto | Por qué esa |
|---|---|---|---|
| 1 | portada · «su retrato más fuerte» | `E2-B-rooftop.jpg` | el LEEME la canoniza como **la mejor rooftop**: rim dorado, pecas marcadas, cara fiel al ancla |
| 2 | «ella en contexto boliviano» | `E2-A-rooftop.jpg` | es la única con el **skyline de Santa Cruz legible** (casas bajas, tejas, árboles) |
| 3 | copy-space | `E3-hotel.jpg` | el LEEME la marca **«la más limpia»** — sin pantallas ni texto |
| 4 | «ella trabajando» | `E3-coworking.jpg` | única con laptop. La pantalla queda **borrosa, sin texto legible** — mirado a resolución completa, pasa la casilla 3 |
| 5 | copy-space | `E3-cafe.jpg` | **la prueba 9/9 de la receta**; luz de ventana cálida |
| 6 | «su mirada directa» | `E2-C-rooftop.jpg` | mirada a cámara, media sonrisa |
| 7 | «su retrato de cierre» | `E2-B-rooftop.jpg` | **repetición deliberada de la portada** — ver abajo |

**Las 6 comparten la misma remera de lino beige**, así que el carrusel tiene raccord de vestuario
sin haber generado nada.

## 🔴 El copy decía que Onia tiene equipo — corregido el 2026-09-03

La primera versión rendeada sacó **9/9 en la rúbrica visual** y aun así afirmaba algo falso:

| Lámina | Decía | Dice ahora |
|---|---|---|
| 2 (body) | «Creada con inteligencia artificial por **el equipo de** @oniahq» | «Creada con inteligencia artificial **en** @oniahq, desde Santa Cruz de la Sierra» |
| 4 (headline) | «Un **equipo** boliviano» | «**Hecha en Bolivia**» |

**Onia no tiene equipo: es Sergio.** `CLAUDE.md` lo fija («el que vende es Sergio; no hay
vendedora ni colaboradores comerciales») y prohíbe fabricar. Y esta es la pieza que queda
**FIJADA** arriba del perfil — la primera que lee todo el que entra.

Se corrigió **en el brief** (no sobre el JPG) y se volvió a rendear con el mismo comando:
**0 créditos**, porque es texto compuesto sobre fotos que ya existían. Sólo cambiaron `slide-02`
y `slide-04`; las otras cinco salieron byte-idénticas, lo que confirma que el render es
determinista. «Hecha en Bolivia» además **entra en una sola línea** — el titular quedó más limpio
que el original de dos.

**Lo que dejó como regla:** la rúbrica tenía 9 casillas y las 9 miraban píxeles. Ahora tiene una
décima —*el copy no afirma nada que no exista*— en `RUBRICA-IMPOLUTO.md`. Una pieza impecable
puede publicar una mentira, y ninguna casilla visual la ve.

🔴 **La lámina 7 repite la foto de la portada, y es a propósito.** Hay 6 fotos para 7 lugares:
alguna tenía que repetirse. Se puso el par en los extremos (1 y 7) porque es la **máxima distancia
posible** — entre las dos hay cinco láminas — y porque abrir preguntando «¿es real?» y cerrar en
el mismo retrato con «esto recién empieza» es un remate, no un descuido. Si a Sergio le parece
error, la salida barata es generar UNA foto nueva de cierre (~2 cr) y volver a rendear.

## Chequeo contra la rúbrica — mirado, no supuesto

Abiertas 1, 2, 4 y 7 a resolución completa:

- **Cara** ✅ misma Lucía en las 7: pecas en nariz y pómulos, cejas gruesas, aro de oro, cadenita fina.
- **Formato** ✅ las 7 medidas con `ffprobe`: `1080×1350` exacto.
- **Texto legible en la foto** ✅ ninguno. La pantalla de la lámina 4 es UI borrosa, sin palabras.
- **Manos** ✅ correctas donde se ven (vaso en 1, 2 y 7).
- **Luz del lugar** ✅ atardecer real en las rooftop, ventana en café/hotel/coworking.
- **Piel con poros** ✅ textura y pecas visibles, sin alisado.
- **Colores** ✅ true-to-life, sin teal-and-orange.
- **Etiqueta de IA** ✅ declarada en la propia pieza: la lámina 1 dice «¿Lucía es real? **No.**» y
  la 3 es «No lo escondo — etiqueta de IA activada desde el primer post».
- **Acento** ✅ verde Onia `#10C26B` en las 7 (no el mostaza descartado el 28-ago).

## 🔴 La trampa del PNG — por qué este LEEME insiste

`hermes-content/references/modelos/.gitignore` tiene `*.png` para **todo el árbol**. El renderer
escribe PNG. Entonces: se rindió, `git status` no dijo nada, y **el entregable no existió para
nadie más**. Ya se llevó puestas 74 láminas una vez (`de009bc4f`) y las 7 de L6 otra
(`f21948709`, un commit llamado «L6 renderizado» que no contiene ni una imagen).

**Antes de anotar una lámina como lista:**

```sh
git check-ignore -v <ruta>   # tiene que salir VACÍO (exit 1)
git ls-files <ruta>          # tiene que devolver la ruta
```

Verificado para estas 7 el 2026-09-03: ninguna ignorada, las 7 versionadas.

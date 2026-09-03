# L2 · Carrusel fijado «¿Quién es Lucía?» — renderizado 2026-09-03

**7 láminas, 1080×1350 (feed 4:5), 2 créditos** (6 fotos del banco ya existente + 1 generada para
el cierre el 03-sep). Espera el OK de Sergio.

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
| 7 | «su retrato de cierre» | `S3-rooftop-cierre.jpg` | generada el 03-sep (2 cr) para que el cierre **no** repita la portada — ver abajo |

**Las 7 comparten la misma remera de lino beige**, así que el carrusel tiene raccord de vestuario:
las 6 del banco por venir de la misma tanda, y la 7ª porque se generó pidiéndolo explícitamente.

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

## 🔴 Segunda pasada, mismo día: la palabra se fue, el plural quedó

El arreglo de arriba buscó la **palabra** «equipo». La pieza seguía diciendo lo mismo **sin
usarla**, en verbos — y uno estaba en la lámina 4, tres líneas debajo del titular que se acababa
de corregir:

| Lámina | Decía (tras el 1er arreglo) | Dice ahora |
|---|---|---|
| 1 (pill) | «La pregunta que **todos** hacen» | «La pregunta **obvia**» |
| 4 (body) | «si **pueden** sostenerme a mí… lo que **hacen** con tu operación» | «si **me puede sostener** a mí… lo que **hace** con tu operación» |
| 5 (body) | «el detrás de escena de cómo me **hacen**» | «el detrás de escena de cómo **estoy hecha**» |

- **1**: el perfil tiene **0 posts publicados**. «La pregunta que todos hacen» inventa una
  audiencia que todavía no existe — prueba social fabricada, que `CLAUDE.md` prohíbe.
- **4 y 5**: `pueden` / `hacen` / `me hacen` son plurales de tercera persona. Dicen «un grupo de
  personas», que es exactamente lo que se había sacado del titular.

**0 créditos otra vez.** Re-rendeadas 3 láminas; las otras 4 salieron **byte-idénticas** (`git
status` sólo marcó `slide-01`, `slide-04`, `slide-05`) — tercera confirmación de que el render es
determinista.

Verificado **mirando** las tres a resolución completa: ningún desborde de caja, el cuerpo de la 4
entra en 4 líneas sin tocar el pie, y la 1 mantiene el titular en una sola línea.

## 🟡 Dos cosas para que decida Sergio — ninguna la puedo cerrar yo

1. **La lámina 4 muestra dos personas borrosas al fondo**, con laptops, debajo del pill «QUIÉN ME
   HACE» y el titular «Hecha en Bolivia». El texto ya no dice «equipo»; **la foto lo sugiere**.
   Es un coworking (gente ajena, que es justo donde trabaja alguien que trabaja solo), así que
   defendible — pero es la lámina que responde «quién me hace» y es la pieza FIJADA. Cambiar la
   foto es cambiar la pieza: no lo hago sin OK. La 5 tiene gente al fondo también y ahí **no**
   molesta, porque su pill es «QUÉ VAS A VER»: un café con desconocidos es sólo un café.
2. ~~**La lámina 7 repite la foto de la portada**~~ — ✅ **RESUELTO el 2026-09-03, 2 cr.** Ya no
   repite: tiene foto propia.

## ✅ La lámina 7 dejó de repetir la portada — 2026-09-03, 2 créditos

**Antes:** había 6 fotos para 7 lugares y la 7 reusaba `E2-B-rooftop.jpg`, la misma de la portada,
píxel por píxel. Se defendía como remate deliberado (par en los extremos, máxima distancia), pero
era una de las **dos decisiones que esta pieza le pedía a Sergio**.

**Qué cambió:** Higgsfield volvió a generar (la tarea `t_2a90f301` estaba bloqueada por un corte
que ya no existe — cerrada el 2026-09-03 con `account status` en vivo). Con la cuenta viva, la
salida barata que este archivo ofrecía **sí** estaba disponible y se tomó:

| | |
|---|---|
| Foto nueva | `../../generadas-20260903/S3-rooftop-cierre.jpg` (1856×2304, 4:5 nativo) |
| Motor | `nano_banana_pro` + `--image-references E2-B-rooftop.jpg` |
| Costo | **2,00 cr** — cotizado antes con `generate cost`, cobro exacto (1934,14 → 1932,14) |
| Registro | `BITACORA-PERFECCION.md` § **E10**, con el prompt completo |

**Por qué esta foto y no otra:** cierra mirando la ciudad de perfil, que es lo que dice el copy
(«seguime para ver hasta dónde llega»), y deja el piso de terraza vacío abajo-izquierda, que es
donde cae el bloque de texto. Mantiene remera, luz y joyería de la portada — es la misma tarde,
no otra sesión.

**Verificado mirando el render, no el brief:** al re-rendear, las otras seis salieron
**byte-idénticas** (mismo tamaño exacto) y sólo `slide-07.jpg` cambió (154.725 → 135.562 bytes) —
cuarta confirmación de que el render es determinista y de que no se tocó nada más.

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

---

## 2026-09-03 21:47 UTC — la mano en disputa sale de la PORTADA (0 créditos)

`carril-calidad` frenó el lote: la portada (`slide-01`) se apoyaba en `E2-B-rooftop.jpg` y
contó **seis dedos** en la mano que sostiene el vaso (4 pliegues = 5 crestas + pulgar).

**Recontado acá sobre la foto FUENTE, no sobre la lámina** (regla del velo+texto), con cuatro
instrumentos: zoom 4x y 5x de la columna de dedos, zoom 8x del tercio superior, y `edgedetect`
sobre la columna completa. **Los cuatro dan 3 pliegues = 4 crestas + el pulgar = 5 dedos.**

```sh
SRC=../../generadas-20260902/E2-B-rooftop.jpg
ffmpeg -y -i "$SRC" -vf "crop=320:660:1180:1450,scale=iw*3:ih*3,format=gray,edgedetect=low=0.06:high=0.18,negate" /tmp/edges.jpg
```

**No se resuelve la discrepancia a favor de nadie, y no hace falta**: lo que sí es indiscutible
y se ve en todos los recortes es que **el dorso no tiene ni un nudillo**, y que dos auditorías
independientes contaron distinto. Una mano que se discute no va en la lámina FIJADA arriba del
perfil, que es la más mirada de la cuenta.

**Lo que se hizo, sin gastar:**

| Lámina | Antes | Ahora | Por qué |
|---|---|---|---|
| 1 · portada | `E2-B-rooftop.jpg` | **`E3-hotel.jpg`** | «la más limpia», cara muy fiel al ancla, **sin manos en cuadro** y con el tercio inferior tranquilo, que es lo que el layout necesita para el texto |
| 3 · «No lo escondo» | `E3-hotel.jpg` | **`E2-B-rooftop.jpg`** | la mano discutida queda en una lámina interior, no en la portada |

**No se duplicó ninguna foto**: siguen siendo 7 fotos distintas para 7 láminas. Es un
intercambio, no un reemplazo — justo lo que evita repetir el defecto que se arregló en la
lámina 7 el mismo día.

De regalo arregla algo que nadie había anotado: antes la portada y la lámina 2 eran **dos tomas
de la misma escena de rooftop** (B y A), una atrás de la otra. Ahora la portada abre en interior
y el rooftop empieza en la 2.

⚠️ **Por qué NO se reemplazó `E2-B` del todo:** requiere generar una foto nueva (2 cr,
`nano_banana_pro`, cotizado). Se intentó y el CLI devolvió
`grace_daily_limit_reached` — **cupo diario agotado, no error de prompt**. El rechazo **no
cobra**: saldo 1932,14 antes y después. Queda como decisión de Sergio en `t_a9ff7367`.

**Determinismo verificado:** al re-renderizar, las cinco láminas que no se tocaron salieron
**byte a byte idénticas** (02, 04, 05, 06, 07); sólo cambiaron 01 y 03.

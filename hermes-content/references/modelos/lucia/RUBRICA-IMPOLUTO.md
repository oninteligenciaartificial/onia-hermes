# Rúbrica «impoluto» — qué tiene que cumplir una pieza de Lucía para publicarse

> Escrita el **2026-09-02** para la ventana de perfeccionamiento de 2 h.
> Sergio: *«prueba absolutamente todo hasta que tus generaciones sean impolutas»*.
>
> «Impoluto» no es una opinión: es **10 casillas que se marcan MIRANDO la pieza**. Una pieza con
> las 10 se publica sin retoque. Una pieza con 9 se anota y se regenera cambiando UNA variable.
>
> ⚠️ **Este encabezado decía «9» hasta el 2026-09-03**: se agregó la casilla 10 y sólo se editó la
> tabla. El conteo y el «una pieza con 8» quedaron viejos mientras el bloque de puntaje de abajo
> ya decía `10/10` — el mismo documento se contradecía. Una rúbrica que no sabe cuántas casillas
> tiene se aplica de memoria, y de memoria se aplican **las 9 de siempre**: justo la casilla nueva
> es la que se saltea.

## Las 10 casillas

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
| 10 | **El copy no afirma nada que no exista** | Leer CADA línea de texto preguntando «¿esto es verdad hoy?». Cazar sobre todo el plural que infla: *equipo, nuestros clientes, cientos de, ya confían* | Es la única casilla que no se ve mirando la imagen — y la que puede publicar una mentira sobre la empresa en una pieza 9/9 |

## Cómo se puntúa

```
IMPOLUTA  10/10  -> va al calendario, se anota en el LEEME
CASI       9/10  -> se anota QUE casilla fallo y se regenera cambiando UNA variable
ROTA      <9/10  -> se anota el defecto y NO se regenera igual: se cambia la receta
```

## 🔴 Por qué existe la casilla 10 (2026-09-03)

Las 9 casillas originales son **todas visuales**. El carrusel **fijado** del perfil (L2) sacó 9/9
—cara fiel, 1080×1350 exacto, manos, luz, poros, colores— y aun así la lámina 2 decía «creada por
**el equipo** de @oniahq» y la 4 titulaba «Un **equipo** boliviano».

**Onia no tiene equipo: es Sergio.** `CLAUDE.md` lo dice sin ambigüedad («el que vende es Sergio,
no hay vendedora ni colaboradores») y prohíbe fabricar. La pieza iba a quedar FIJADA arriba del
perfil: la primera que lee todo el que entra, y la que más se cita.

**Lo que enseña:** una rúbrica que sólo mira píxeles aprueba una pieza impecable que miente. El
render no inventó nada — el texto venía del brief, y nadie lo leyó contra la realidad de la
empresa. Arreglado en el mismo brief y re-rendeado a 0 créditos (lámina 2 sin «el equipo de»,
lámina 4 → «Hecha en *Bolivia*», que además es verdad y entra en una sola línea).

### 🔴 Y la casilla 10 se aplica por LÁMINA, no por string (2026-09-03, segunda pasada)

El arreglo de arriba se hizo buscando la **palabra** «equipo» y cambiando las dos líneas donde
aparecía. Mirado de nuevo el mismo día, la misma pieza seguía diciendo lo mismo **sin usar la
palabra** — en verbos, y uno de ellos en la lámina 4, la que se acababa de corregir:

| Lámina | Seguía diciendo | Por qué es la misma mentira |
|---|---|---|
| 4 (body) | «si **pueden** sostenerme a mí, imaginate lo que **hacen**» | plural de tercera persona = un grupo. Y está **debajo** del titular que se arregló |
| 5 (body) | «el detrás de escena de cómo me **hacen**» | mismo plural, misma implicación |
| 1 (pill) | «La pregunta que **todos** hacen» | fabrica una audiencia: el perfil tiene 0 posts, nadie preguntó nada todavía |

Corregido a `si me puede sostener` / `lo que hace` / `cómo estoy hecha` / `La pregunta obvia`.
0 créditos: 3 láminas re-rendeadas, las otras 4 byte-idénticas.

**La regla que deja:** un `grep` de la palabra prohibida **descarta, no confirma** — es la regla de
`CLAUDE.md` aplicada al copy. La casilla 10 se marca **leyendo cada lámina completa en voz alta y
preguntando quién es el sujeto de cada verbo**, no buscando el sustantivo que ya conocés. Un
defecto de copy no vive en una palabra: vive en la conjugación, en el pronombre y en el plural
implícito, y esos tres son invisibles a la búsqueda que encontró el primero.

**Y el arreglo de un defecto es el lugar MÁS probable del segundo**: la lámina 4 pasó dos
auditorías —una que le puso 9/9 y otra que le reescribió el titular— con el plural intacto en el
párrafo de abajo. Al corregir una lámina se re-lee **entera**, no la línea que se toca.

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

---

# PARTE II · Cómo se MIRA cada casilla

> **Fusionado el 2026-09-03.** La Parte II la escribió el carril `calidad-generado` en su rama, en
> un archivo con **este mismo nombre** y sin saber que la Parte I existía. Git las veía como
> `add/add` — el archivo entero en conflicto — y mergear cualquiera de los dos lados borraba el
> otro. **No se eligió: se fusionaron**, porque no dicen lo mismo.
>
> **La Parte I es el MARCADOR** (qué se puntúa y cuándo se publica). **La Parte II es el MÉTODO**
> (cómo se mira, con qué comando, contra qué). Una rúbrica sin método se aplica de memoria; un
> método sin puntaje no decide si la pieza sale. **Se usan juntas: se mira con la Parte II y se
> puntúa con la Parte I.**

## Cómo se corresponden las dos partes

| Casilla (Parte I) | Se verifica con (Parte II) |
|---|---|
| 1 · La cara es Lucía | **Bloque 1 entero**, empezando por **1.0 la tira del lote** |
| 2 · 9:16 exacto | 5.2 Aspecto |
| 3 · Cero texto legible | **Bloque 3** (3.1, 3.2) |
| 4 · Manos correctas | 2.1 Manos |
| 5 · Acción a medias | *sin equivalente — se mira como dice la Parte I* |
| 6 · Luz del lugar | *sin equivalente — se mira como dice la Parte I* |
| 7 · Piel con poros | 5.3 Nitidez |
| 8 · Colores true-to-life | 4.5 Naturalidad |
| 9 · La cara aguanta el clip | *sin equivalente — se mira como dice la Parte I* |
| 10 · El copy no afirma nada falso | **Bloque 4 entero** (4.1–4.4) |

🔴 **Dos checks de la Parte II no tienen casilla en la Parte I, y valen puntaje igual:**

- **1.0 · la tira del lote completo.** Es el único check que mira el LOTE y no la pieza: seis
  piezas que pasan de a una pueden ser dos caras distintas juntas (P7 de la bitácora). Si la tira
  falla, **el lote no se publica aunque todas saquen 10/10**.
- **2.2 · la herramienta tiene que ser mecánicamente posible.** La casilla 4 cuenta dedos; no mira
  el objeto que la mano sostiene. Ahí murió `G06-peluqueria.jpg`, dado por "verificado mirándolo".

**Mientras no estén numeradas como casillas, se marcan como bloqueantes**: cualquier ✗ en 1.0 o
2.2 es ROTA, sin importar el puntaje de las 10.

**Para qué existe:** que Onia no publique una pieza mala, y que Lucía sea siempre la misma cara.
Una pieza **pasa o no pasa**. No hay "casi".

> Escrita el 2026-09-02 a partir de piezas reales abiertas y miradas, no de teoría. Cada
> ítem que está acá está porque **ya falló** en el banco, o porque es el rasgo que
> discrimina la cara. Un ítem sin caso real no entra.

---

## Cómo se aplica — y por qué así

1. **Se abre la imagen y se mira.** Un `grep`, un peso de archivo o un nombre no son
   verificación. Un `ls` sirve para **descartar**, nunca para **confirmar**.
2. **Se amplía.** Los defectos de manos, props y texto **no se ven al 100 %**. Recorte y zoom
   sobre manos, herramientas y cualquier objeto que se toque:
   `ffmpeg -i pieza.jpg -vf "crop=W:H:X:Y,scale=1080:-1" /tmp/zoom.png`
3. **Se mira lo último, no lo primero.** En un carrusel, la última lámina. En un video, el
   último segundo. Lo que falla suele estar donde nadie llegó.
4. **El veredicto se escribe con el motivo concreto.** "La tijera tiene una sola argolla y la
   mano no entra en ella", no "se ve rara".

**Cualquier ✗ en el Bloque 1 o el Bloque 2 = NO PASA.** No se negocia.

---

## Bloque 1 — Identidad (el que más se pierde)

Se compara contra `BANCO-OFICIAL.md` §2. Los tres primeros son los **rasgos
discriminantes**: son los que separaron la Familia A de la Familia B, así que son los que hay
que mirar primero y con más dureza.

| # | Check | Pasa si |
|---|---|---|
| 1.1 | **Cejas** | Arqueadas, grosor medio, con cola que baja. **No** rectas, gruesas y bajas |
| 1.2 | **Mandíbula y largo de cara** | Óvalo de mandíbula suave. **No** cara larga con mandíbula ancha |
| 1.3 | **Edad aparente** | 25–27. **No** 30+ |
| 1.4 | Pelo | Castaño medio, puntas acarameladas ⚠️ *el pelo mojado se lee mucho más oscuro: no cuenta como falla si la escena lo justifica* |
| 1.5 | Pecas | Presentes en nariz y pómulos, finas y dispersas |
| 1.6 | Ojos | Marrones, almendrados, **los dos del mismo tamaño y con el mismo pliegue** |
| 1.7 | Piel | Cálida y tostada, tono parejo entre frente, pómulos y cuello. ⚠️ **Manchones rojos en pómulos y nariz = ✗**, aunque el banco los tenga: es el artefacto del `soul_2` en plano cerrado, no un rasgo de Lucía (P6 de la bitácora) |
| 1.8 | Accesorios | Si hay: argollas doradas chicas, cadenita fina. Nada que contradiga el inventario |

⚠️ **Un rasgo que se corre de a poco lote a lote no se nota hasta que ya se publicaron veinte
piezas.** Por eso 1.1–1.3 se miran **contra el banco**, nunca contra el lote anterior: comparar
cada lote con el que le sigue es cómo se llega lejos sin que ninguna comparación dé mal.

### 1.0 · La tira del lote completo — se hace ANTES que los ítems de arriba

**Todas las piezas del lote, recortadas a la misma altura, en una sola imagen.** Sin excepciones y
sin elegir cuáles:

```
ffmpeg -i P1.jpg -i P2.jpg ... -filter_complex \
  "[0]crop=W:H:X:Y,scale=-1:520[a];[1]...[b];[a][b][...]hstack=inputs=N" /tmp/tira.png
```

Pasa si **todas** las caras son la misma. Si una sola se sale, **el lote no se publica**, aunque
cada pieza mirada sola pase.

> **Nació de `posts-20260807`**, seis piezas del mismo día declaradas "listas para subir" en cuatro
> documentos: montada la tira, **P4 y P5 son otra cara** (P7 de la bitácora). Y en la misma carpeta
> vivía `_AUDITORIA-CARAS.jpg`, una auditoría de consistencia que comparó **dos** cuadros — los dos
> que coinciden. **Elegir la muestra es elegir el resultado** (P8). Por eso este ítem va primero y
> por eso dice *todas*.

---

## Bloque 2 — Anatomía y objetos

| # | Check | Pasa si |
|---|---|---|
| 2.1 | **Manos** | 5 dedos, proporción y articulación creíbles, sin dedos fundidos ni "manopla" |
| 2.2 | **Herramienta que se sostiene** | **Mecánicamente posible**: un objeto con dos partes tiene las dos, el pivote es coherente, y la mano lo agarra por donde se agarra |
| 2.3 | Contacto | Lo que se toca se deforma como corresponde; nada flota ni atraviesa |
| 2.4 | Simetría | Aros, mangas, cuellos y hombros coinciden entre lados |
| 2.5 | Fondo | Sin objetos derretidos, personas a medias ni geometría imposible |
| 2.6 | Reflejos | En espejo: el texto va invertido y la escena es consistente con el punto de vista |

> **2.2 nació de `G06-peluqueria.jpg`**, donde la tijera tiene una sola argolla, blades sin
> pivote coherente, y la mano de abajo con los dedos fundidos sin entrar en la argolla. La
> pieza había sido dada por "verificada mirándola" — pero mirando la cara y los aros, no la
> herramienta. **El defecto estaba en el objeto que define la escena.**

---

## Bloque 3 — Texto

| # | Check | Pasa si |
|---|---|---|
| 3.1 | Texto legible en cuadro | **No hay**, salvo que sea intencional y esté bien escrito en castellano |
| 3.2 | Etiquetas y envases | Si se leen, dicen algo real; no letras inventadas |

La regla operativa vigente del carril ya es `[TEXT RULE — MANDATORY] No legible text anywhere
in frame.` Si aparece texto legible, **el prompt no se respetó**: es señal de método, no solo
de pieza.

---

## Bloque 4 — Marca y verdad

| # | Check | Pasa si |
|---|---|---|
| 4.1 | **Lucía es IA y no se esconde** | La pieza va con etiqueta de contenido generado con IA |
| 4.2 | Cero prueba social fabricada | Sin testimonios, logos ni cifras de clientes. **No hay clientes pagando** |
| 4.3 | No se exhibe obra | Sin "muy pronto", "beta", "en construcción" |
| 4.4 | Vocabulario | Nada de "tus pacientes" en pieza genérica: son 7 rubros |
| 4.5 | Naturalidad | Colores reales, sin look de filtro; velocidad real |

---

## Bloque 5 — Técnico

| # | Check | Pasa si |
|---|---|---|
| 5.1 | Peso | > 50 KB. Un archivo liviano suele ser un fallo con cara de éxito |
| 5.2 | Aspecto | El que pedía la pieza (9:16, 3:4, 1:1) |
| 5.3 | Nitidez | Sin bloques de compresión ni zonas "plastificadas" mezcladas con zonas texturadas |

---

## Plantilla de veredicto

Se copia a `BITACORA-PERFECCION.md`, una por pieza:

```
### <archivo> — <PASA | NO PASA>
- Lote / fecha:
- Método (Soul / Element ancla / otro) e id:
- Bloque 1 Identidad: <✓ o el # que falla y por qué>
- Bloque 2 Anatomía:  <✓ o el # que falla y por qué>
- Bloque 3 Texto:     <✓ / ✗>
- Bloque 4 Marca:     <✓ / ✗>
- Bloque 5 Técnico:   <✓ / ✗>
- Motivo del veredicto, en una línea concreta:
```

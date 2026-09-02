# Rúbrica impoluto — el estándar que una pieza de Lucía debe pasar

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
| 1.7 | Piel | Cálida y tostada, tono parejo entre frente, pómulos y cuello |
| 1.8 | Accesorios | Si hay: argollas doradas chicas, cadenita fina. Nada que contradiga el inventario |

⚠️ **Un rasgo que se corre de a poco lote a lote no se nota hasta que ya se publicaron veinte
piezas.** Por eso 1.1–1.3 se miran **contra el banco**, nunca contra el lote anterior: comparar
cada lote con el que le sigue es cómo se llega lejos sin que ninguna comparación dé mal.

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

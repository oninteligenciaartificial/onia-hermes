# Banco propio — generado el 2026-08-28 con el ancla oficial

Hecho con el Element **`lucia-skin-v1`** (`58bbd635-…`), el de 7 ángulos, **desde el navegador**
(nunca por MCP). La técnica completa está en [`../TECNICA-HIGGSFIELD.md`](../TECNICA-HIGGSFIELD.md).

Todas se miraron una por una antes de guardarlas: pecas, argollas doradas, cadenita, piel de
tono parejo sin rojez.

## 🔴 Los PNG NO están en el repo — los JPG sí

`hermes-content/references/modelos/.gitignore` ignora `*.png` a propósito: *"Originales PNG de la
generación (pesados, quedan locales). Los JPG q3 son los assets usables."*

**Se rompió esa convención el 29-ago**: G01-G05 se guardaron solo como PNG, así que este LEEME
las documentaba y **ninguna estaba en el repo**. Un clon limpio no tenía una sola imagen del banco.
Lo cazó el guardián. Ya están los JPG y **una pieza (L09) apuntaba al PNG ignorado**: reapuntada.

**Regla: al bajar una pieza, guardar el PNG (local, original) Y generar su JPG (el que se
commitea y el que usan los briefs).** Las rutas de los briefs van SIEMPRE al `.jpg`.

⚠️ **G01-G04 están a 1K (896×1200); G05 es la primera a 2K (1792×2400).** El 2K cuesta lo mismo
—2 créditos— así que no hay razón para volver a generar a 1K.

## Lo que hay

| Archivo | Qué es | Por qué está |
|---|---|---|
| `G01-cafe-pizarra-texto.png` | Café con pizarra de menú | Para la lámina 6 de L09: la pizarra escribe «Café con Leche» bien y dos renglones abajo inventa *marnago* y *horchimos*. **El defecto de la IA, a la vista y señalado** |
| `G02-parada-de-micro.png` | Esperando el micro, cielo nublado | Primera de la **receta normal**: poste con maraña de cables, muros descascarados, una señora esperando, canasta a los pies |
| `G03-mercado.png` | Comprando tomates, hablando con la casera | La mejor de la receta normal. Toldo verde, cajones de madera, bolsas negras colgando, delantal a cuadros. **Suma interacción con otra persona**, que es lo que más la aleja de una foto de campaña |
| `G04-tienda-de-barrio.png` | Pagando, el tendero le da el vuelto | **La más lograda del banco.** Heladera de Coca-Cola, estantes atiborrados hasta el techo, foco colgando de un cable, mostrador gastado. La acción a medias es el intercambio de monedas — imposible de leer como pose |
| `G05-oficina-de-tramites.png` | Fila de trámite, la funcionaria le pasa un formulario sellado | **La mejor del banco, supera a G04.** Cartel de TURNOS escrito a mano y pegado con cinta, tubos fluorescentes, sillas de plástico blancas, paredes beige descascaradas, ventanilla de vidrio rayado. La acción a medias es inconfundible: **dos manos sobre el mismo formulario**, la de ella y la de la funcionaria, con el sello azul a la vista. Es imposible leerla como pose. Y el lugar es on-brand: el trámite es justo el dolor que Onia resuelve. Asset id `1f9bd463-4c89-40f7-af4b-225d34502fd3` |
| `V04-parada-animate-kling3.mp4` + `_V04-TIRA.jpg` | 5 s en la parada de micro | 🔴 **La más floja de las cuatro, y sirve por eso.** Animada desde G02, que es la única de la receta normal SIN acción a medias: está sentada esperando. El modelo, sin una acción que continuar, se la **inventa**: gira la cabeza, **abre la boca como si hablara** (no hay diálogo) y en el último segundo se da vuelta y pierde la cara. Los cables no se mueven. **Confirma la regla al revés: sin acción a medias, el modelo actúa en vez de continuar.** 6,25 cr a 720p. Asset id `3f4bd69c-42a0-4954-b1c8-6d523c09c788` |
| `G05b-oficina-recreate.jpg` | La misma escena **desde el otro lado del vidrio** | Hecha con **Recreate** sobre G05: misma receta, seed nuevo. Cambia el funcionario (un hombre, no la señora), el ángulo (la cámara queda **detrás de él**, así que ahora se le ve la cara a Lucía) y la arquitectura. Conserva personaje, lugar, acción y luz. **Sirve como par de G05**: dos tomas de la misma escena desde lados opuestos, para dos láminas seguidas. Asset id `22612ab6-73fb-41c1-94b5-314ef74c6d87` |
| `G05c-oficina-reference.jpg` | G05 **con la mirada cambiada** | Hecha con **Reference** sobre G05 pidiendo UN solo cambio: que levante la vista del formulario y mire a la funcionaria. Conserva **casi cada píxel** —las grietas de la pared, la señora de rojo atrás, el hombre sentado, el sello del formulario— y cambia solo la mirada. **Es edición quirúrgica, no otra generación.** Junto a G05 da el antes/después de un mismo instante. Asset id `26f83828-f620-49b2-9a6b-5b5eb58190c5` |
| `V05-oficina-animate-kling3.mp4` + `_V05-TIRA.jpg` | 5 s en la oficina, el traspaso del formulario | 🏆 **El mejor video del banco.** Animado desde G05, la de la acción a medias más clara. El modelo la **completa**: la funcionaria suelta el papel y retira la mano, ella lo toma con las dos manos y lo levanta a leer. **Sin inventar habla ni giros** —el defecto de V04—. La cara aguanta los 5 s de perfil. 6,25 cr a 720p, 828×1108, sin pista de audio (ffprobe). Asset id `e53fd538-50b1-4b47-b7ae-0d85eee3fba7` |
| `V01-farmacia-animate-kling3.mp4` + `_V01-TIRA.jpg` | 5 s de b-roll en una farmacia | Hecho con **Animate** desde una imagen de receta normal. La cara aguanta los 5 s. 6,25 cr con el sonido apagado |
| `V02-mercado-animate-kling3.mp4` + `_V02-TIRA.jpg` | 5 s en el mercado, con la casera | **El mejor de los dos.** La foto ya tenía una acción a medias —la mano acercando el tomate— y el modelo solo la continuó. Animar una escena con interacción sale mejor que animar un retrato quieto |

| `V03-tienda-animate-kling3.mp4` + `_V03-TIRA.jpg` | 5 s en la tienda, el vuelto | Animado desde G04. El intercambio de monedas **se desarrolla** en los 5 s: él entrega, ella recibe. Confirma la regla — cuanto más clara la acción a medias, mejor el video |

## Por qué este banco existe

El banco viejo (`tanda-20260821`) sirve, pero es **lifestyle bonito**: rooftop al atardecer,
café con luz dorada, todo combinando. Sergio marcó el problema el 28-ago pasando la foto del
gimnasio: *"siento que Lucía se ve muy realista, no tan normal como esta de aquí"*.

Estas son el otro registro — **lugares donde nadie sacaría una foto linda**. Sirven para las
piezas donde Lucía tiene que parecer una persona y no una modelo.

## Lo que falta

- Más lugares: adentro de un micro, una fila de trámite en una oficina.
- Animar G05 (la oficina). G02, G03 y G04 ya están animadas.
- **Guardar el asset id de cada pieza nueva**: viene en el nombre del archivo que descarga
  Higgsfield (`hf_<fecha>_<hora>_<uuid>.png`). Sin eso hay que buscarla en un grid que no carga.
- Ninguna de estas está en la lista blanca de `scripts/lucia_banco.json` todavía —
  `generadas-20260828/` sí está, así que el gate ya las acepta.

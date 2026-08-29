# Banco propio — generado el 2026-08-28 con el ancla oficial

Hecho con el Element **`lucia-skin-v1`** (`58bbd635-…`), el de 7 ángulos, **desde el navegador**
(nunca por MCP). La técnica completa está en [`../TECNICA-HIGGSFIELD.md`](../TECNICA-HIGGSFIELD.md).

Todas se miraron una por una antes de guardarlas: pecas, argollas doradas, cadenita, piel de
tono parejo sin rojez.

## Lo que hay

| Archivo | Qué es | Por qué está |
|---|---|---|
| `G01-cafe-pizarra-texto.png` | Café con pizarra de menú | Para la lámina 6 de L09: la pizarra escribe «Café con Leche» bien y dos renglones abajo inventa *marnago* y *horchimos*. **El defecto de la IA, a la vista y señalado** |
| `G02-parada-de-micro.png` | Esperando el micro, cielo nublado | Primera de la **receta normal**: poste con maraña de cables, muros descascarados, una señora esperando, canasta a los pies |
| `G03-mercado.png` | Comprando tomates, hablando con la casera | La mejor de la receta normal. Toldo verde, cajones de madera, bolsas negras colgando, delantal a cuadros. **Suma interacción con otra persona**, que es lo que más la aleja de una foto de campaña |
| `G04-tienda-de-barrio.png` | Pagando, el tendero le da el vuelto | **La más lograda del banco.** Heladera de Coca-Cola, estantes atiborrados hasta el techo, foco colgando de un cable, mostrador gastado. La acción a medias es el intercambio de monedas — imposible de leer como pose |
| `G05-oficina-de-tramites.png` | Fila de trámite, la funcionaria le pasa un formulario sellado | **La mejor del banco, supera a G04.** Cartel de TURNOS escrito a mano y pegado con cinta, tubos fluorescentes, sillas de plástico blancas, paredes beige descascaradas, ventanilla de vidrio rayado. La acción a medias es inconfundible: **dos manos sobre el mismo formulario**, la de ella y la de la funcionaria, con el sello azul a la vista. Es imposible leerla como pose. Y el lugar es on-brand: el trámite es justo el dolor que Onia resuelve. Asset id `1f9bd463-4c89-40f7-af4b-225d34502fd3` |
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
- Animar G02 (la parada) y G05 (la oficina). G03 y G04 ya están animadas.
- **Guardar el asset id de cada pieza nueva**: viene en el nombre del archivo que descarga
  Higgsfield (`hf_<fecha>_<hora>_<uuid>.png`). Sin eso hay que buscarla en un grid que no carga.
- Ninguna de estas está en la lista blanca de `scripts/lucia_banco.json` todavía —
  `generadas-20260828/` sí está, así que el gate ya las acepta.

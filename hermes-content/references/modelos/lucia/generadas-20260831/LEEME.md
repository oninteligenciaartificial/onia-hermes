# Banco del 2026-08-31 — dos registros, y el asset id de cada una

Generadas con `lucia-skin-v1` (`58bbd635-…`) **desde el navegador**, Nano Banana Pro, 2K,
1792×2400, 2 créditos cada una. La técnica está en
[`../TECNICA-HIGGSFIELD.md`](../TECNICA-HIGGSFIELD.md).

El `LEEME.md` del banco del 28-ago pedía **guardar el asset id de cada pieza nueva** porque el
grid de Assets no carga y sin el id hay que buscarla a ciegas. Acá están, sacados del nombre del
archivo que descarga Higgsfield (`hf_<fecha>_<hora>_<uuid>.png`).

| Archivo | Qué es | Asset id | Estado |
|---|---|---|---|
| `C01-terraza-torre-cristal.jpg` | Terraza de torre de vidrio, sol duro de mediodía, sastrería negra | `ada5ba51-a570-4faf-baf2-62d6d54e1361` | ⚠️ Contraejemplo — la cara se fue del ancla. **NO regenerar:** se guarda para mostrar qué hace `fashion campaign` |
| `B05-micro-camino-al-trabajo.jpg` | Adentro de un micro camino al trabajo, mirando el celular | `6558ebeb-e4b2-46a9-b035-107a382ccdde` | 🔧 **REGENERAR** — carteles inventados |

## C01 — el registro «cine», y por qué falló

Pedida por Sergio a partir del reel de @mindshft.ai: cine, look caro, demostrar el oficio.
**El registro salió; la fidelidad no.** La cara sale más angulosa y flaca que el ancla, y el pelo
recogido le saca el rasgo más reconocible.

**La causa fue el prompt, no el modelo:** `fashion-commercial` y `campaign look` arrastran al
arquetipo de modelo de pasarela y el arquetipo le gana al element. Sirve como **contraejemplo**,
no como pieza publicable.

## B05 — el prompt corregido funcionó, pero los carteles no

Misma receta sin las palabras de moda, con **pelo suelto** y la línea de poros visibles: la cara
volvió a parecerse al ancla. Llena además uno de los dos huecos que pedía el banco del 28-ago
(*«adentro de un micro»*).

🔴 **No es publicable:** el cartel de tarifas de la ventana está de frente, derecho y legible, y
dice `CARHEDA BIT. 20`, `LUCIVINA PER 1,50`, `CARTFOLUREX 50`, `BOLIVADA DEL 3,00` — ninguna
palabra existe— encabezado por `FARE`, en inglés, dentro de un micro boliviano.

**Para regenerarla:** misma receta agregando al final del prompt
`Any signage, price lists or screens are out of focus and unreadable, no legible text anywhere in frame.`

## ⚠️ No confundir con G01, que inventa texto A PROPÓSITO

`../generadas-20260828/G01-cafe-pizarra-texto.jpg` también tiene una pizarra con palabras que no
existen (*marnago*, *horchimos*), **y ahí es deliberado**: su `LEEME.md` lo declara como *«el
defecto de la IA, a la vista y señalado»*, y alimenta la lámina 6 de L09.

La diferencia es para qué existe la pieza. G01 **muestra** el defecto y por eso lo quiere. B05
tiene que **pasar por una foto real** de un negocio real, y con el cartel roto no pasa.


## 🔧 Qué significa el marcador `🔧 REGENERAR`

**Sólo las filas con `🔧 REGENERAR` se vuelven a generar.** Nace de un defecto encontrado el
01-sep: el loop buscaba `🔴` y en el `LEEME.md` del banco del 28-ago hay dos 🔴 que **no son
piezas rotas** — una nota histórica ya resuelta, y `V04-parada`, que se guarda **a propósito**
por ser la más floja: es la prueba de que sin acción a medias el modelo inventa habla y giros.

Regenerar V04 habría **borrado la evidencia** de una regla. Es el mismo error que con
`G01-cafe-pizarra-texto`, que inventa texto a propósito: **una imperfección deliberada leída como
defecto.** Por eso el marcador de "hay que rehacerla" tiene que ser distinto del de "ojo con
esto".


## 🔍 Auditoría de `B05` y `C01` contra el brief §6 (2026-09-03, mirada)

Vuelta con **generación bloqueada por auth** (`higgsfield account status` → *Session expired*;
`hf auth login` no se puede correr en sesión no interactiva — bloqueo duro, distinto del
`grace_daily_limit` que resetea por día, y ya logueado esta fecha, no se re-mide). Sin poder
generar, trabajo de cero créditos: llevar estas dos al **mismo formato de tabla §6** que ya tienen
las piezas del banco 02-sep, mirándolas a resolución completa (los `.jpg`) en vez de confiar en la
prosa de arriba. **Los dos veredictos se confirman al verlas.**

| Eje del brief §6 | `B05` micro (interior) | `C01` terraza torre |
|---|---|---|
| Cara fiel al ancla | ✅ pecas marcadas en nariz/pómulos, cejas gruesas, ojos marrones, aro de oro + cadenita fina. Es Lucía | ❌ **la cara se fue** — pómulos y mandíbula más angulosos y flacos que el ancla, arquetipo de modelo de pasarela. Es el defecto que documenta el `fashion campaign` |
| Piel real (poros/pecas/asimetría) | ✅ pecas y textura muy marcadas, brillo real de mediodía, cero alisado | ✅ pecas y poros presentes, piel real bajo sol duro |
| **Pelo suelto** | ✅ **suelto**, raya al medio, ondas sobre los hombros | ❌ **recogido** tirante hacia atrás (sólo vuelan unos mechones). Falla §6 |
| **Acción a medias** | ✅ **las dos manos sobre el celular** + tote en el regazo — el patrón que mejor anima. Ojo: mira hacia abajo (riesgo casilla 9 si se anima) | ❌ **retrato/pose** — brazos a los lados, sin manos sobre un objeto |
| Luz real / fancy | ✅ sol duro de ventana, interior de micro real | ✅ sol de mediodía, torre de vidrio y skyline — el registro «cine» sí salió |
| **Sin carteles legibles** | ❌ **cartel de tarifas frontal y legible** a la derecha: `FARE`, `CARHEDA BIT. 20`, `LUCIVINA PER 1,50`, `CARTFOLUREX 50`, `BOLIVADA DEL 3.00` — todo inventado, y en inglés dentro de un micro boliviano. + 2 carteles con texto roto al fondo izquierda | ✅ skyline y vidrio, ningún cartel/pantalla |

**Veredicto (confirmado mirándolas):**
- **`B05` — el único bloqueo es la cartelería inventada.** Todo lo demás pasa: identidad fiel, piel
  top, pelo suelto, acción a medias con las dos manos (el patrón animable). Es la **más lista para
  regenerar** cuando vuelva el auth, y llena el hueco «adentro de un micro» que el banco sólo cubre
  hoy con `V04-parada` (contraejemplo). Sigue en `🔧 REGENERAR` con la línea de arriba
  (`Any signage, price lists or screens are out of focus and unreadable…`). Bajo riesgo: un solo eje
  a corregir. ⚠️ Si se anima, cuidar la casilla 9 — mira hacia abajo al celular; el prompt debe
  levantarle la mirada al final.
- **`C01` — se queda como contraejemplo, NO regenerar.** Falla **tres** ejes (identidad, pelo
  recogido, sin acción a medias): es la evidencia viva de que `fashion campaign` / `campaign look`
  arrastran al arquetipo de pasarela y el arquetipo le gana al element. Borrarla borra la regla —
  mismo criterio que `V04` y `G01`. Como imagen fija tampoco sirve (la cara no es Lucía).

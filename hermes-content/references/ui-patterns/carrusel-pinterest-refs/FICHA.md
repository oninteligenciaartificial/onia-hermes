# Referencias Pinterest (pedido Sergio 02-sep: "tus textos no ensenan nada")

3 pins guardados (templates profesionales de carrusel). Principios extraidos, en orden:

1. **Cada lamina ENSENA algo aplicable YA**: un prompt copiable, un paso concreto,
   un dato accionable. Declarar ("estoy armando", "la IA puede...") NO es contenido.
   El guardable nace de poder USAR la lamina sin salir de IG.
2. **Collage con capas**: fotos/objetos recortados, cinta adhesiva, stickers rotados,
   marcos polaroid, garabatos — nunca texto solo sobre color plano.
3. **Diseno continuo** entre laminas del carrusel (elementos que cruzan el corte).
4. **Jerarquia tipografica rica** — en Onia se logra con los ejes de Archivo
   (560/96 wordmark, 650 titulos, 450 cuerpo) + Geist Mono como acento tecnico.
5. **Ritmo de color** entre laminas (verde / blanco / oscuro alternados).

Aplicado por primera vez en carousels/out/curso-dia1/post-feed.png (v3: burbuja
de codigo con prompt real copiable + cinta + sticker + iconos 3D).

## Veredicto de Sergio (02-sep): el post con mockup de chat + collage = "la mejor hasta el momento"

Formato APROBADO por Sergio. Regla derivada: **stickers siempre** — toda pieza lleva
sticker circular + cinta + icono 3D flotante (clases .sticker/.cinta/.icono-flot del
generador generar-curso-dia1.py). El mockup de chat con contenido copiable es el
patron estrella para presentar la comunidad.

## Receta de tipografia — medida, no supuesta (02-sep)

Del experimento `carousels/out/experimento-tipografia-marca/` (A/B/C juzgado a 33 % y
13 %; veredicto largo en ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md §6). Se escribe aca porque
al 02-sep **12 de los 13 generadores seguian con la tipografia que Sergio rechazo**, y sin
la receta cada migracion la reinventa mal.

| que | valor |
|---|---|
| cuerpo / sub | Archivo **450** |
| titulos | Archivo **650**, eje `wdth` **96** |
| numeros y remate | Archivo **650**, eje `wdth` **96** |
| wordmark | Archivo **560**, eje `wdth` **96** |
| micro-etiquetas y handle | **Geist Mono** 500, `letter-spacing:.08em`, mayuscula |
| PROHIBIDO | black **900** y condensed **wdth 62** (los dos rechazados por Sergio) |

**Las cinco trampas al migrar una pieza vieja** (todas costaron un render):

1. **Bajar el peso SOLO empeora la portada.** 900→650 sin tocar nada mas deja la pieza mas
   debil en la grilla de perfil que como estaba. La migracion va **junto** con la jerarquia
   de portada (contexto gris chico + remate gigante), nunca sola.
2. **`wdth 96` es mas ANCHO que el condensed 62.** El mismo texto se ensancha y desborda:
   tope medido **138px para 9 caracteres** en una linea sobre 880px utiles. Si el remate es
   mas largo, va en dos lineas.
3. **El collage no cruza el texto.** Cinta y sticker arriba, iconos arriba o abajo — a media
   altura quedan encima del titulo.
4. **El resaltado verde necesita `white-space:nowrap` + `box-decoration-break:clone`**, o se
   parte entre lineas. Y **no se le pega puntuacion detras**: el padding deja un hueco
   visible. Se reescribe la frase para que el `<b>` termine en espacio o cierre la oracion.
5. **La cinta tiene que SUJETAR algo** (03-sep). Sobre fondo plano y pegada a nada no lee
   como collage: lee como un rectangulo gris olvidado. Va **montada sobre el borde** de un
   objeto real — la caja blanca, el bloque verde del remate, un icono 3D. Si el objeto se
   declara despues en el DOM la cinta asoma por detras (bien); si se declara antes, la cinta
   queda encima (tambien bien). Lo que no funciona es la cinta sola en el aire.
   Se descubrio mirando el render al **100%**: en las miniaturas de 33% y 13% no se nota, y
   por eso se habia colado en las 8 laminas de `generar-carrusel-equipo.py`.
   **Corolario:** el sticker tampoco es decoracion — lleva 2-3 palabras que DICEN algo
   ("sin SUELDO"), no metadata ("las 6 DE HOY"). Regla "menos es mas" de la §7.

Verde `#00C661` **de fondo con tinta negra** (8,72:1). Como color de texto da 2,12:1 y
reprueba AA — ver §7 de BASE_CONTENIDO.

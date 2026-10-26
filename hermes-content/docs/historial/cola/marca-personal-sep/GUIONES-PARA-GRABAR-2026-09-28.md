> ⚠️ **REEMPLAZADO el 28-sep por [`GUIONES-PARA-GRABAR-2026-09-29.md`](GUIONES-PARA-GRABAR-2026-09-29.md).** Esta versión repetía el cotizador en 4 de 10 piezas y usaba ejemplos inventados. Se conserva como historia.

# Guiones para grabar — 28 de septiembre de 2026

## 1. YouTube — De una lista de precios a un cotizador con IA

Cien tarjetas sin diseño: ciento veinte bolivianos. Con diseño: ciento cincuenta.
Cambio la cantidad, el total se actualiza y abajo queda el pedido listo para copiar.

Este es el cotizador que preparamos con IA. Los precios son inventados, pero
el proceso te sirve para entender cómo pasar de una lista de precios a una
herramienta que alguien pueda usar.

Vamos desde el pedido hasta la comprobación. Al terminar vas a saber qué
información darle a la IA, cómo abrir el archivo y cómo revisar que las
cuentas estén bien.

Primero, las reglas del negocio. En esta imprenta de ejemplo, cada tarjeta
cuesta un boliviano con veinte. El cliente puede elegir cien, doscientas o
quinientas. Si necesita diseño, se suman treinta bolivianos una sola vez.

Eso último importa. Si no aclaramos si el diseño se cobra por tarjeta o por
pedido, dejamos una decisión abierta que cambia todo el resultado.

Ahora abrí un chat en una herramienta que genere código y pedile esto:

«Creá un cotizador para una imprenta ficticia. Entregá un único archivo HTML
con sus estilos y funcionamiento incluidos, que pueda abrir sin instalar
nada. La tarjeta cuesta un boliviano con veinte. Las cantidades son cien,
doscientas o quinientas. El diseño es opcional y suma treinta bolivianos una
sola vez por pedido. Mostrá impresión, diseño y total por separado. Añadí un
resumen que se pueda copiar. No envíes mensajes ni cobres. Aclarale al usuario
que es una demostración con precios ficticios».

Con ese pedido ya sabe qué construir, qué puede elegir el cliente y cómo
calcular. Ahora vamos a darle ejemplos para comprobarlo:

«Cien tarjetas sin diseño tienen que dar ciento veinte. Cien con diseño,
ciento cincuenta. Doscientas con diseño, doscientos setenta. Quinientas sin
diseño, seiscientos».

Los ejemplos le muestran exactamente qué esperamos. Después igual vamos a
probarlos nosotros.

Cuando recibas el HTML, guardalo como cotizador punto html. Si te da el código
en el chat, copiá únicamente el contenido del archivo, sin las marcas que lo
rodean. En el Bloc de notas, usá Guardar como, elegí Todos los archivos y
escribí ese nombre. Después abrilo con doble clic en el navegador.

Si se abre como texto, revisá el nombre completo: puede haberse guardado como
cotizador punto html punto txt. El archivo tiene que terminar en punto html.

Ahora vamos a probarlo. Seleccioná cien, dejá desmarcado diseño y mirá el
desglose: impresión, ciento veinte; diseño, cero; total, ciento veinte.

Marcá diseño. El total tiene que pasar a ciento cincuenta. Cambiá a doscientas
tarjetas: impresión, doscientos cuarenta; diseño, treinta; total, doscientos
setenta.

Fijate que el diseño sigue costando treinta. No se multiplicó por la cantidad.

Después volvé a cien y desmarcá diseño. Tiene que regresar a ciento veinte.
También hay que revisar que quitar una opción quite su costo.

Supongamos que una cuenta falla. En vez de decirle a la IA «está mal», pasale
el caso concreto: «Elegí doscientas tarjetas con diseño. La herramienta
muestra este total, pero debería dar doscientos setenta: doscientos cuarenta
de impresión y treinta de diseño. Corregí el cálculo y devolveme el archivo
completo».

Guardás la versión nueva, actualizás el navegador y repetís las mismas pruebas.
Así podés saber si el cambio arregló el problema y si las otras opciones
siguen funcionando.

Nos queda el resumen. Elegí cien con diseño y usá Copiar pedido. Al pegarlo,
deberían aparecer la cantidad, el precio por tarjeta, el costo de impresión,
el diseño y el total. Ese texto permite revisar qué se está cotizando.

Si el navegador no permite copiar automáticamente desde el archivo local,
el resumen también está disponible para seleccionarlo y copiarlo a mano.
El botón no debe decir que copió algo si la operación falló.

Con esto tenemos una demostración local. Para usarla con un negocio real,
todavía hay que poner los precios correctos, decidir si hay impuestos o
condiciones adicionales, probarla en los teléfonos donde se va a usar y
publicarla donde corresponda.

La herramienta no confirma un pedido ni recibe pagos. Su tarea es calcular
y dejar la información ordenada.

Este proceso se puede adaptar a otros servicios cuando sus reglas están
claras: cantidades, opciones, extras y un total que podamos comprobar.

Si vas a probarlo, empezá con una sola combinación. Escribí cuánto debería
costar antes de pedirle el código a la IA. Esa cuenta va a ser tu primera
forma de saber si lo que construiste funciona.

## 2. Vertical 1 — Qué cambia con Opus 5.5

Si usás IA para programar o trabajar con documentos, esto es lo que miraría
del nuevo Opus 5.5.

Anthropic lo presentó el 22 de septiembre y destaca mejoras en tareas
complejas y respuestas más claras. También reporta un costo aproximadamente
cuarenta por ciento menor frente a Opus 5 en sus tareas típicas facturadas
por tokens. Eso no significa que tu mensualidad baje cuarenta por ciento.

¿Cómo lo llevaría a una tarea real? Por ejemplo, pedirle que revise una
propuesta y separe tres cosas: qué está confirmado, qué falta y qué contradice
los requisitos.

Después miraría si cada conclusión tiene un dato del documento que la
respalde. Una tabla prolija puede contener un error igual.

Todavía no ejecutamos nuestra prueba con este modelo, así que esas mejoras
siguen siendo las del anuncio. Para decidir si te sirve, compará una tarea
tuya y contá también lo que tuviste que corregir.

## 3. Vertical 2 — Cómo encontrar el costo que falta en una propuesta

Este presupuesto anuncia setecientos bolivianos por tres meses, pero hay
un cargo que cambia la cuenta. Mirá cómo revisarlo con IA.

El ejemplo es inventado: cien de instalación, doscientos al mes y ciento
veinte adicionales cada mes por un dominio obligatorio.

Pegá la propuesta completa y escribí: «Separá pago inicial, mensualidades y
extras obligatorios. Calculá tres meses y mostrá la fórmula. Compará tu
resultado con el total que anuncia la oferta».

La cuenta correcta es cien, más doscientos por tres, más ciento veinte por
tres: mil sesenta. El anuncio omitió trescientos sesenta.

Si la respuesta dice setecientos, revisá si dejó fuera esa línea del dominio.
Ahí tenés un error concreto para corregir.

Y antes de elegir, añadí tus requisitos. Una propuesta puede entrar en tu
presupuesto y no incluir algo obligatorio para vos.

Guardá el pedido completo: período, cargos y fórmula. Te sirve para revisar
la próxima propuesta sin quedarte solamente con la mensualidad.

## 4. Vertical 3 — Cómo evitar que la IA prometa una entrega que no confirmaste

Un cliente pide doscientas unidades para el viernes. Le pedís a la IA que
responda y te escribe: «Perfecto, te las entregamos el viernes».

Pero vos nunca le dijiste cuánto stock hay ni si alcanza el tiempo de
producción. Mirá cómo plantearía ese caso.

Pegá el mensaje del cliente y escribí: «Prepará una respuesta usando solo
los datos confirmados. Separá lo que sabemos de lo que falta verificar.
No confirmes stock ni fecha de entrega si no aparecen en la información».

En este ejemplo sabemos la cantidad y la fecha que pide. Nos falta saber
si podemos cumplirlas.

Una respuesta válida sería: «Recibí tu pedido de doscientas unidades para
el viernes. Voy a confirmar disponibilidad y plazo antes de cerrar la entrega».

Después vos comprobás esos dos datos y completás la respuesta.

La parte útil del ejercicio es esta: cuando falte información, la IA tiene
que dejarte una pregunta pendiente. Así podés detectar una promesa inventada
antes de mandársela al cliente.

## 5. Vertical 4 — Una lista de precios convertida en herramienta

Elegís cien tarjetas, marcás diseño y aparece ciento cincuenta. Cambiás a
doscientas y pasa a doscientos setenta.

Este cotizador lo preparamos con IA usando tres reglas: la tarjeta cuesta
uno con veinte, el diseño suma treinta y se cobra una sola vez por pedido.
Son precios inventados para la demostración.

Para construir uno parecido, pedí un único archivo HTML con selector de
cantidad, opción de diseño, desglose y resumen para copiar.

Y añadí una comprobación al pedido: «Cien con diseño debe dar ciento
cincuenta; doscientas con diseño, doscientos setenta».

Después abrí el archivo y probá esas dos combinaciones. Quitá diseño y
revisá que también desaparezcan sus treinta bolivianos.

Ahí ya tenés una forma concreta de revisar lo que te entregó la IA. Antes
de ponerlo en un negocio real, todavía hay que validar precios y condiciones.

## 6. Vertical 5 — Corregir subtítulos sin mover el tiempo

Si un subtítulo dice «Cloud» cuando hablaste de «Claude», podés corregirlo
sin volver a escribir todo el video.

Si es una sola palabra repetida, empezá por buscar y reemplazar en tu editor.
Si además hay nombres mal escritos y frases cortadas, prepará un glosario
y pasale el archivo de subtítulos a la IA.

Pedile: «Corregí ortografía y nombres usando este glosario. Conservá exactamente
los números de los bloques y sus tiempos. No unas frases, no agregues ideas
y devolvé el archivo completo».

Ahora viene la comprobación: si un bloque empezaba en el segundo dos y
terminaba en el cuatro, tiene que conservar esos tiempos. Revisá también
que siga habiendo la misma cantidad de bloques.

Por último, escuchá ese fragmento. La corrección tiene que coincidir con
lo que dijiste. Un nombre parecido escrito correctamente también puede ser
el nombre equivocado.

## 7. Vertical 6 — Cómo elegir tu primera automatización

Si querés empezar a automatizar un negocio, elegí una tarea que puedas
describir con un ejemplo completo.

Por ejemplo: llega un formulario, revisás si tiene teléfono y guardás la
consulta para responder después.

Escribí qué entra, qué condición revisás y qué tiene que salir. Acá entra
el formulario. La condición es que haya un teléfono válido. El resultado
es una consulta registrada.

Después agregá el caso que falla: ¿qué pasa si falta el teléfono? ¿Y si
el mismo formulario llega dos veces?

Podés pedirle a la IA: «Convertí este proceso en pasos. Incluí el caso
normal, los datos que faltan y los duplicados. Marcá lo que necesita una
decisión humana antes de automatizarlo».

Revisá esa respuesta antes de conectar herramientas. Si todavía no sabés
qué hacer cuando algo falla, esa decisión sigue pendiente aunque el flujo
se vea terminado.

## 8. Vertical 7 — Cuándo un chatbot debe pasar la conversación a una persona

Imaginá que un cliente le dice a tu chatbot: «Me cobraron dos veces».

Si el bot solamente tiene el catálogo y las preguntas frecuentes, no puede
confirmar un reembolso. Le falta revisar el pago y también saber quién puede
autorizarlo.

Yo prepararía una regla con ese caso: reconocer el problema, pedir la
referencia necesaria para localizarlo y pasarlo a una persona. Sin prometer
que la devolución ya está hecha.

Después probaría tres mensajes: alguien pregunta un precio, alguien pide
hablar con una persona y alguien reporta ese cobro duplicado.

El precio puede resolverse con información vigente del catálogo. Las otras
dos conversaciones tienen que llegar a quien corresponda.

Ese recorrido también se diseña. Antes de llamar terminado a un chatbot,
hay que saber quién recibe el caso y cómo se entera de que está esperando.

## 9. Vertical 8 — Cómo convertir una prueba en un tutorial que se entienda

Si vas a enseñar algo que hiciste con IA, guardá también el principio.
Con mostrar el resultado terminado, la otra persona todavía no sabe cómo
llegar hasta ahí.

Pensá en el cotizador: primero mostramos qué hace. Después, los precios y
las reglas que le dimos a la IA. Luego abrimos el archivo y comprobamos una
cuenta que cualquiera puede repetir.

Esa secuencia responde tres preguntas: qué voy a conseguir, qué necesito
y cómo sé si me salió bien.

Si hubo una corrección importante, también vale la pena mostrarla. Por
ejemplo, que el diseño se sumaba más de una vez y cómo detectaste el error.
Siempre que ese fallo haya ocurrido de verdad.

Cuando grabes una explicación, elegí un resultado concreto y llegá hasta
su comprobación. Así la persona tiene una tarea que puede intentar cuando
termine el video.

## 10. Vertical 9 — La prueba de treinta segundos antes de entregar una herramienta

Antes de dar por terminada una herramienta hecha con IA, probá cambiar de
opinión dentro de ella.

En este cotizador marco diseño y se suman treinta. Lo desmarco y esos
treinta tienen que desaparecer. Cambio la cantidad y el resumen también
tiene que actualizarse.

Después copio el pedido y comparo el texto con lo que aparece en pantalla.
Cantidad, opciones y total tienen que coincidir.

Parece una prueba pequeña, pero revisa algo que el primer resultado puede
ocultar: que la herramienta responda bien cuando la persona cambia las
opciones, no solo cuando abre la página.

Podés aplicar la misma idea a un formulario: elegí una opción, cambiala y
comprobá qué se guarda al final.

Tomalo como una primera revisión rápida. Una entrega real necesita además
probar los otros casos y las condiciones del negocio.

# H-IA-03 · Tres pruebas distintas antes de creer que una página funciona

Si una IA te dice que una página funciona, pedile que te explique qué comprobó. Esa pregunta cambia mucho más que pedirle otra vez que la revise.

Una página puede responder sin errores y aun así mostrar un botón tapado. Puede mostrar el botón y no hacer nada cuando lo tocás. También puede guardar el dato, pero en el lugar equivocado. Son problemas distintos y necesitan pruebas distintas.

Te propongo separar la revisión en tres preguntas. ¿Abre? ¿Se ve y se usa? ¿Hace lo que tenía que hacer? Si juntás todo en un único sí, después no sabés qué parte está respaldada por evidencia.

Vamos con un ejemplo inventado para entenderlo: una página para reservar una mesa. Elegís fecha, hora y cantidad de personas. Al final debería aparecer una confirmación. No es una función que esté prometiendo de mi producto; es una situación sencilla para mirar el recorrido.

La primera prueba es abrir la dirección correcta. Parece obvio, pero si revisás una copia vieja o un entorno de pruebas, el resultado no te dice qué está viendo la gente. Anotá qué dirección abriste y cuándo. Si la IA no tiene acceso, tiene que decirlo; no completar la revisión con una suposición.

La segunda prueba es mirar el contenido. En una pantalla de teléfono y en una de computadora. ¿El texto se lee? ¿La fecha se puede elegir? ¿Hay un cartel encima del botón? Una captura sirve para revisar la apariencia. No demuestra por sí sola que la reserva se guardó.

También probá el teclado cuando corresponda. Si una persona puede llegar al formulario pero no al botón, el recorrido necesita una corrección. Y mirá qué pasa cuando falta un dato: el mensaje de error tiene que ayudar a continuar, no dejarte adivinando.

La tercera prueba es hacer el recorrido. Elegir una fecha de prueba, enviar y mirar la confirmación. Si el sistema guarda información, comprobar que apareció una sola vez y con los valores correctos. Eso se hace con datos de prueba y los permisos necesarios; no enviando reservas reales a desconocidos.

Playwright es una herramienta que puede automatizar interacciones de navegador y sacar capturas. Sirve para convertir un recorrido repetible en una revisión. Pero tener Playwright instalado no significa que la IA ya revisó tu página. Hace falta el registro de lo que abrió, lo que tocó y lo que encontró.

El resultado útil no es un párrafo que dice todo perfecto. Es una lista corta: abrió esta dirección, se vio esto, el recorrido llegó hasta acá y esto quedó sin comprobar. Si falla, una captura y el paso concreto ayudan mucho más que decir está roto.

No hace falta revisar toda tu aplicación para una corrección pequeña. Elegí el recorrido que esa corrección afecta y comprobalo completo. Si cambió el botón de reserva, probar el color de la portada no responde la pregunta principal.

Abrir, mirar y usar son tres cosas distintas. Cuando pedís una revisión, dejá escrito qué evidencia corresponde a cada una. Así podés confiar en lo que se comprobó y mantener visible lo que todavía necesita una prueba.

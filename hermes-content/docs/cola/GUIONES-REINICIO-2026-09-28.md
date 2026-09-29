# Guiones y fichas técnicas — 28 de septiembre

## Sesión 1 — Opus 5.5: noticia, uso y criterio

**Versión de rodaje:** ampliada el 28-sep local / 29-sep UTC. Reemplaza como
entrega principal al borrador corto conservado más abajo. Una sesión de al
menos 60 minutos: 35 horizontal, 20 vertical, 5 retomas. Distribución propuesta;
el tiempo de rodaje no es duración final. Investigación y edición van aparte.

**Estado:** narraciones preparadas para grabar una explicación y un ejercicio.
No hay prueba ejecutada en Claude ni material de Sergio grabado. Ninguna frase
depende de fingir esas dos cosas. El editor muestra gráficos didácticos y datos
ficticios; la captura de una respuesta real se añadirá solo cuando exista.

### YouTube horizontal — «Opus 5.5: qué cambió y cómo saber si te sirve»

Duración orientativa: 5–7 minutos, según lectura y pausas sobre el ejercicio.
Los subtítulos de sección organizan el rodaje; no se leen a cámara.

#### Apertura

Sale una IA nueva y enseguida aparece la pregunta: ¿me cambio?

Con Opus 5.5, yo empezaría por una tarea que puedas revisar. Por ejemplo,
comparar tres presupuestos y encontrar cuál cumple lo que necesitás. Uno
parece barato, pero el total que anuncia está incompleto. Otro se pasa del
límite. Y una condición que parece secundaria cambia toda la decisión.

Vamos a ver qué anunció Anthropic y después te dejo el ejercicio completo,
con las cuentas que deberían salir. Así tenés una forma concreta de evaluarlo.

#### Qué cambió

Anthropic presentó Opus 5.5 el 22 de septiembre. Destaca mejoras para trabajo
complejo, programación y análisis de documentos, además de respuestas más
claras. Son afirmaciones del fabricante; todavía no ejecutamos nuestra prueba.

Hay un número que necesita contexto: aproximadamente cuarenta por ciento
menos costo que Opus 5 en las tareas típicas que evaluaron. Hablan de uso
facturado por tokens. Tu mensualidad no baja automáticamente ese porcentaje.

También presentaron Sonnet 5.5 el 28 de septiembre. Lo orientan a tareas
cotidianas delimitadas y mantienen Opus para trabajo más abierto y complejo.
Ese es el punto de partida para elegir qué comparar.

#### La tarea

Imaginá que necesitás una web durante tres meses. Tenés un máximo de mil
doscientos bolivianos y dos condiciones obligatorias: usar tu dominio y poder
exportar tus datos. Los precios del ejercicio son inventados.

La propuesta A cobra trescientos de instalación y doscientos cincuenta al mes.
Incluye dominio y exportación.

La B cobra cien de instalación y doscientos al mes. Anuncia setecientos en
total. Pero hay una línea que dice que el dominio cuesta ciento veinte al
mes adicionales. Es obligatorio. Y tampoco permite exportar los datos.

La C no cobra instalación y cuesta trescientos cincuenta al mes. Incluye lo
que pediste, pero tiene trescientos de configuración obligatoria.

Ya ves por qué pedir solamente «decime cuál conviene» deja demasiado abierto.
Tenemos que decirle al modelo qué significa cumplir en este caso.

#### Qué escribir

Abrí un chat nuevo en Claude. Si tenés acceso a Opus 5.5, seleccioná ese modelo
y pegá las tres propuestas junto con tus requisitos. Después añadí esto:

«Calculá el total de los primeros tres meses. Incluí los cargos iniciales y
todos los extras obligatorios. Mostrá la fórmula y el dato de cada propuesta
que usaste. Señalá las contradicciones y cuáles cumplen todos mis requisitos.
Usá solo la información que te doy. Si falta un dato, indicá qué tengo que
preguntar antes de decidir».

Fijate que le estamos dando el período, el límite de dinero y las condiciones
obligatorias. También le pedimos que deje visible el camino hasta la respuesta.
Eso facilita la revisión, aunque no garantiza que la cuenta esté bien.

#### Cómo revisar la respuesta

Esta es la solución calculada del ejercicio, para que puedas comprobar la
salida del modelo.

La A suma trescientos más doscientos cincuenta por tres: mil cincuenta.
Entra en el presupuesto y cumple las dos condiciones.

La B suma cien, más seiscientos de mensualidades, más trescientos sesenta
del dominio: mil sesenta. El anuncio decía setecientos porque omitía ese
último cargo. Entra en el presupuesto, pero queda fuera porque no permite
exportar los datos.

La C suma mil cincuenta de mensualidades y trescientos de configuración:
mil trescientos cincuenta. Se pasa del máximo.

Con estos datos, la A es la única que cumple todo. Si el modelo eligió bien,
todavía mirá cómo llegó: puede acertar la opción y equivocarse en una cuenta.
Revisá los tres totales, el cargo omitido y las condiciones.

#### Una segunda comprobación

Ahora cambiá una sola cosa. En A, reemplazá «Incluye dominio y exportación»
por «Incluye dominio; exportación no indicada». Abrí otro chat y repetí el
ejercicio con esa versión.

Ahí ya no tenemos una propuesta que podamos confirmar como válida con toda
la información disponible. La A podría servir, pero falta preguntar si permite
exportar. Una respuesta cuidadosa debería dejar esa condición pendiente.

Esta variación te ayuda a mirar si el modelo reconoce lo que falta o completa
el hueco por su cuenta. Conservá las dos versiones del ejercicio; así podés
repetirlas después de una actualización.

#### Cómo compararlo con otro modelo

Si también tenés acceso a Sonnet 5.5, repetí las mismas entradas en chats nuevos.
Mantené las herramientas y los ajustes comparables, y anotá cualquier diferencia
que no puedas controlar. Guardá la primera respuesta antes de corregirla.

Primero mirá si resuelve la tarea. Después, cuánto tardó y cuántas veces
tuviste que intervenir. Una respuesta rápida que tenés que rehacer también
consume tu tiempo. Si usás una API y tenés el costo registrado, añadilo.
Si estás usando una suscripción sin costo por tarea visible, dejá ese dato
como no disponible.

Y si los dos lo hacen bien, esa es la conclusión de este ejercicio. Para
saber cuál te conviene en tu trabajo, seguí con ejemplos de lo que realmente
hacés: revisar propuestas, preparar documentos o construir una herramienta.

#### Cierre

En una agencia como ONIA, este método puede servir antes de elegir una
herramienta o contratar un servicio: escribir las condiciones, reunir la
información y revisar las cuentas. Acá trabajamos con un ejemplo ficticio;
una decisión real necesita verificar las propuestas originales.

Quedate con la pregunta que podés usar cada vez que salga un modelo:
¿qué tarea quiero resolver y cómo voy a comprobar que quedó bien?

Con eso, el siguiente lanzamiento ya tiene una prueba concreta esperándolo.

### Vertical 1 — «Opus 5.5: qué significa ese 40%»

Duración orientativa: 45–60 segundos. Tema principal para abrir la sesión.

¿Opus 5.5 cuesta cuarenta por ciento menos? Hay una aclaración que importa.

Anthropic reporta ese ahorro aproximado frente a Opus 5 para tareas típicas
facturadas por tokens. Combina el precio con la cantidad de tokens que usa.
Tu suscripción mensual no baja automáticamente cuarenta por ciento.

Si lo usás para trabajar, probalo con una tarea que puedas revisar. Por ejemplo:
tres presupuestos, un límite de dinero y dos requisitos obligatorios.

Pedile el total completo, los cargos extra y qué propuesta cumple todo.
Después revisá las cuentas contra los datos originales.

Ahí empezás a saber si te sirve. Para decir cuánto te ahorra, hace falta medir
tu propia tarea y cuánto trabajo te deja por corregir.

### Vertical 2 — «Este presupuesto dice 700, pero suma 1.060»

Duración orientativa: 45–60 segundos. Ejercicio independiente; no llamarlo
resultado de Opus. Puede publicarse después del vertical de actualidad.

Este presupuesto anuncia setecientos bolivianos, pero el total es mil sesenta.
Te muestro dónde está la diferencia con un ejemplo inventado.

Son cien de instalación y doscientos al mes, durante tres meses. Hasta ahí:
setecientos. Pero el dominio cuesta ciento veinte adicionales cada mes y es
obligatorio. Faltaban trescientos sesenta.

Cuando uses IA para revisar propuestas, pegá también tus requisitos y pedile:
«Calculá el total del período, incluí todos los cargos obligatorios y mostrá
la fórmula con el dato de cada propuesta que usaste».

Después hacé la cuenta vos. Y revisá las condiciones: en este ejemplo tampoco
permite exportar datos. Si eso era obligatorio, la propuesta queda fuera.

Guardá esta comprobación para cuando tengas que comparar servicios.

### Vertical 3 — «La prueba cambia cuando falta un dato»

Duración orientativa: 45–60 segundos. Enseñanza sobre evaluar respuestas.

Una prueba útil para una IA: dale un problema al que le falte un dato.

Por ejemplo, estás eligiendo un servicio y necesitás poder exportar tus datos.
Una propuesta entra en tu presupuesto, pero no dice si permite exportar.

Pegá el texto y preguntá: «¿Puedo confirmar que cumple mis requisitos?
Mostrame dónde se verifica cada uno y qué falta preguntar».

La respuesta esperada tiene que dejar la exportación pendiente. Que el precio
te sirva no alcanza para confirmar la otra condición.

Podés repetir el mismo ejercicio con Opus 5.5 y Sonnet 5.5. Guardá las respuestas
y fijate si reconocen la información que falta.

Esto comprueba un caso concreto. Te da una primera señal para seguir evaluando
el modelo con tareas de tu trabajo.

### Enseñanza para Sergio — después de grabar

La misma investigación sostiene una explicación larga y tres piezas con una
pregunta propia: qué significa el anuncio, cómo revisar un costo y cómo detectar
una conclusión sin respaldo. Eso permite profundizar sin repetir el mismo reel.
La continuidad de la próxima sesión sale de una duda real del ejercicio o de
una tarea que construyamos. Evitar estirar esta noticia para llenar días.

## Borrador corto inicial — conservado como alternativa

**Pedido actual:** empezar por actualidad. Solo narración para Sergio;
investigación, ficha, prompts, pantalla y demostración a cargo del editor.
**Duración orientativa:** 80–100 segundos, ajustar con lectura real.

“Opus 5.5 ya salió. Anthropic promete resolver trabajo más complejo con menos
costo. Te cuento qué cambia y cómo probar si te sirve.

Lo presentaron el 22 de septiembre. Está pensado para tareas como trabajar
en proyectos de código grandes, coordinar agentes y analizar documentos.
Anthropic también reporta respuestas más claras y fáciles de revisar.

El dato que vas a ver repetido es ‘cuarenta por ciento más barato’.
Ojo: es una estimación frente a Opus 5 para tareas típicas cobradas por uso.
No significa que tu suscripción mensual baje cuarenta por ciento.

Para probarlo con algo útil, abrí Claude y elegí Opus 5.5, si tu plan lo incluye.
Pegá tres presupuestos sin datos personales y escribí:

‘Compará el costo total de los primeros tres meses. Incluí cargos iniciales
y extras obligatorios. Indicá qué cumple mis requisitos y citá el dato de
cada propuesta que usaste. Si falta información, marcala como pendiente’.

Después revisá las cuentas contra los documentos originales. Una propuesta
con mensualidad baja puede tener un cargo obligatorio que cambie el total.

Y hay contexto nuevo: hoy, 28 de septiembre, también salió Sonnet 5.5.
Anthropic lo orienta a tareas cotidianas bien definidas; Opus, a trabajo
más complejo que exige criterio.

Para decidir, repetí el mismo ejercicio con ambos. Mirá los errores,
lo que omitieron y cuánto tuviste que corregir.
Guardá esta prueba para tu próximo cambio de modelo.”

### Enseñanza para Sergio — fuera del guion

Un lanzamiento es una razón para investigar. Que varios referentes lo
cubran señala interés en ese nicho, pero no demuestra utilidad ni superioridad.
El precio por token, el costo de terminar una tarea y la cuota mensual son
tres cosas diferentes. Incluso una prueba correcta con presupuestos solo
demuestra ese caso; para comparar modelos hay que repetir tareas variadas
bajo las mismas condiciones y contar errores, correcciones, tiempo y costo.

### Ficha técnica O55 — trazabilidad y vigencia

**Ampliación de rodaje revisada:** 28-sep local / 29-sep UTC. Un subagente
revalidó las fuentes oficiales y otro revisó las cuatro narraciones. Se corrigió
el condicional de B (sí entra en presupuesto, falla en exportación) y la variante
de A (quitar solo confirmación de exportación, conservar dominio). El anuncio
de Sonnet falló al abrirse directamente; su contenido oficial se recuperó en
búsqueda. No se repitió la revisión de los seis perfiles en esta ampliación.

**Duración:** conteo aproximado, incluyendo notas breves: horizontal 886 palabras,
verticales 125/135/131. A un supuesto de lectura de 130–155 palabras por minuto,
horizontal 5,7–6,8 minutos y verticales alrededor de 45–60 segundos. Es estimación
de producción, no una velocidad de Sergio medida ni un objetivo de retención.

**Material didáctico ya creado:** `opus55-ejercicio-editor.html`, junto a este
archivo. Tiene cinco escenas originales en horizontal 16:9 y vertical 9:16:
requisitos, propuestas, solución, dato pendiente y comparación. Abre localmente,
sin instalar ni contactar servicios. Usar flechas para avanzar y C para ocultar
controles. Las etiquetas de ejemplo ficticio y solución calculada permanecen.
No reemplaza la captura de una prueba real. No hay video final ni voz generada.

**Revisión visual:** diez combinaciones (cinco escenas por dos formatos), sin
elementos fuera del marco según geometría del DOM. Se revisaron capturas de
requisitos horizontal, solución vertical y comparación vertical. Se redujo el
espaciado vertical para que entren completas las tres propuestas. No se afirma
haber revisado capturas de las diez combinaciones. Controles de escena, selector
de formato y tecla C funcionaron durante la revisión.

**Revisión de avisos de diseño:** se cambió Arial por Segoe UI del sistema.
Una familia tipográfica es intencional en estas pantallas didácticas locales:
la jerarquía usa tamaño/peso y no necesita descargar fuentes. Los contadores
01/05 identifican diapositivas para edición; se clasifican como señalización
funcional, no decoración editorial. No se persistieron excepciones del hook.

**Continuidad preparada:** terminar esta pieza, registrar dudas que genere y
elegir después entre construir el cotizador o corregir subtítulos, según una
necesidad real y actualidad comprobada. Esos dos guiones siguen siendo borradores
sin demo ejecutada. No se prometen fechas, resultados ni una serie aprobada.

- **Revisión:** 28-sep-2026, completada hasta 23:37 UTC. Volver a comprobar anuncio,
  disponibilidad y precios el día de publicación. La palabra «hoy» solo sirve
  si se publica el 28-sep; después decir «el 28 de septiembre».
- **Origen del tema:** pedido explícito de Sergio, lanzamiento de la familia
  Claude 5.5 y cobertura contemporánea entre sus referentes.
- **Cómo se llegó al ángulo:** primero se revisaron publicaciones actuales;
  luego se contrastaron las afirmaciones con anuncios oficiales. Al comprobar
  que Opus salió el 22 y Sonnet el 28, el ángulo elegido fue qué aporta Opus
  y cómo evaluarlo ahora. No presentarlo como un lanzamiento ocurrido hoy.
- **Criterio editorial:** actualidad + tarea de negocio comprensible + resultado
  que el espectador puede revisar. Es una hipótesis editorial, no una prueba
  de que este sea el mejor formato ni una predicción de alcance.
- **Señal de tendencia:** cobertura reciente de Claude 5.5 en Santiago y
  Enrique; pieza específica de Santiago sobre Opus del 23-sep. Es una muestra
  del nicho, no una medición de tendencia global ni de crecimiento del tema.
- **Prueba propia:** NO ejecutada. Claude Code 2.1.267 está instalado, pero
  `claude auth status` devolvió `loggedIn:false`, `authMethod:none`.
  El navegador integrado llegó a `https://claude.ai/login`. No se inició sesión,
  cargaron secretos, ejecutaron APIs ni generaron cargos. No decir «lo probé»,
  «nos ahorró» ni mostrar una respuesta esperada como salida real del modelo.
- **Revisión independiente:** un subagente contrastó fecha, disponibilidad y
  condiciones del ahorro con tres fuentes oficiales. Otro revisó el caso de
  prueba y el enfoque editorial. Esto revisa el guion, no prueba el modelo.

| Afirmación | Fuente primaria y fecha | Alcance permitido |
|---|---|---|
| Opus 5.5 salió el 22-sep | [Anuncio Opus](https://www.anthropic.com/claude-opus-5-5), 22-sep-2026 | Hecho de publicación comprobado |
| Mejora en trabajo complejo y comunicación | Mismo anuncio, apartados Coding, Knowledge work y Communication | Atribuir a Anthropic; no convertirlo en experiencia propia |
| Aproximadamente 40% menos costo frente a Opus 5 | Mismo anuncio, Cost and speed | Estimación de tareas típicas a configuración predeterminada y cobro por tokens; no descuento de mensualidad ni ahorro garantizado |
| Disponible en Pro, Max, Team y Enterprise | [Página del modelo](https://www.anthropic.com/claude/opus), consultada 28-sep | Disponibilidad general publicada; acceso de Sergio no comprobado |
| Sonnet 5.5 salió el 28-sep | [Anuncio Sonnet](https://www.anthropic.com/claude-sonnet-5-5), 28-sep-2026 | Actualiza el anuncio del 22, que todavía lo situaba en el futuro |
| Distinción entre Opus y Sonnet por tipo de tarea | Anuncio Sonnet | Posicionamiento del fabricante; comprobar el caso propio antes de elegir |

**Fuentes sociales y cobertura:** se revisaron los seis perfiles de referencia
durante esta conversación el 28-sep. No se afirma visionado íntegro ni auditoría
de todo el feed. Cada observación conserva su alcance:

| Referente | Pieza revisada | Evidencia y uso |
|---|---|---|
| Santiago Muñoz | [Opus 5.5](https://www.instagram.com/sanmunoz.ia/reel/DdpMVvQopMC/), 23-sep 20:42 UTC | Caption y fecha actuales; señal directa del tema. Su afirmación de edición por IA no se comprobó ni se incorpora como resultado propio |
| Santiago Muñoz | [Sonnet 5.5](https://www.instagram.com/sanmunoz.ia/reel/Dd2KbhWIRap/), 28-sep 21:35 UTC | Caption, fecha y fragmento visual; actualidad y explicación apoyada con gráfico |
| Enrique Rocha | [Sonnet 5.5](https://www.instagram.com/soyenriquerocha/reel/Dd2S811ODEy/), 28-sep 22:52 UTC | Caption, fecha y fragmento a cámara; confirma interés contemporáneo por la familia 5.5 |
| Erik Taveras | [Subagentes](https://www.instagram.com/eriktaveras/reel/Ddxz2P_uCp6/), 27-sep UTC | Fragmentos y guía escrita; inspira receta y comprobación, no acredita Opus |
| Ian Lee | [Construcción con API](https://www.instagram.com/ianlee.js/reel/DdmNXhGOnHe/), 22-sep | Caption y fragmentos; inspira relación entre herramienta y negocio, no acredita Opus |
| Tiago Lemos | [Edición con Claude](https://www.instagram.com/tiagolemosx/reel/DdzhIFKRQ43/), 27-sep | Caption y fragmento visual; no prueba modelo usado ni calidad técnica |
| Carlos Domínguez | [Flujo n8n con Claude Code](https://www.instagram.com/carlosdominguez.dev/reel/Dd1j7n7xRyM/), 28-sep 15:59 UTC | Perfil, caption y fecha leídos actualmente; ejemplo de actualidad aplicada. No se verificó ejecución ni se atribuye a Opus5.5 |

### Prueba preparada para el editor — no ejecutada

Copiar exactamente este caso en chats nuevos de ambos modelos, con la misma
configuración disponible, sin herramientas externas y sin conversación previa.
Los precios son ficticios y no modifican la oferta de ONIA. Esta prueba pequeña
no demuestra superioridad general. No reportar tiempos ni costo sin medirlos.

```text
Ejercicio con propuestas ficticias. Necesito una web durante tres meses.
Mis requisitos obligatorios son: dominio propio, poder exportar mis datos
y un costo total de los tres meses que no supere Bs 1200.

Propuesta A: instalación Bs 300. Servicio Bs 250 por mes.
Incluye dominio propio y exportación de datos. Sin otros cargos.

Propuesta B: instalación Bs 100. Servicio Bs 200 por mes.
El dominio propio es un extra obligatorio de Bs 120 por mes.
No permite exportación de datos. La oferta anuncia “Total tres meses: Bs 700”.

Propuesta C: instalación Bs 0. Servicio Bs 350 por mes.
Configuración obligatoria por única vez: Bs 300.
Incluye dominio propio y exportación de datos. Sin otros cargos.

Compara el costo total de los primeros tres meses, incluyendo cargos
iniciales y extras obligatorios. Muestra la fórmula, cita el dato que usaste,
detecta contradicciones y señala qué propuestas cumplen TODOS mis requisitos.
No inventes condiciones. Usa solo esta información.
```

**Clave de corrección calculada a partir del ejercicio:** A = 300 + 250×3 =
1050, cumple. B = 100 + 200×3 + 120×3 = 1060, contradice el total anunciado y
falla en exportación. C = 350×3 + 300 = 1350, supera el presupuesto. A es la
única que cumple en este ejemplo. Esto es resultado esperado, no respuesta
observada de Opus ni Sonnet.

**Registro de ejecución pendiente:** modelo exacto, fecha, ajuste de esfuerzo,
entrada, respuesta íntegra, tiempo y si encontró los tres costos, el cargo
omitido de B, la falta de exportación y el sobrecosto de C. Si ambos aciertan,
decir que ambos resolvieron ese caso; no fabricar un ganador.

---

## Tanda anterior: prototipo de cotizador y corrección de SRT

Sergio graba únicamente la narración. El editor prepara las pantallas descritas,
pega los prompts, guarda los archivos y captura las comprobaciones.
Los ejemplos de este documento son didácticos. Todavía no se ejecutaron estas
dos recetas en Claude/CapCut; las salidas indicadas son criterios de aceptación,
no resultados de una grabación realizada. No usar una pantalla simulada como
si fuera la respuesta del programa. Borradores para revisión editorial.

Entrega a Sergio: únicamente narración y enseñanza personal al final. Todo el
material de pantallas, prompts y comprobaciones de este archivo es trabajo del
editor; no son tareas que deba preparar Sergio. Antes de cerrar la edición,
ejecutar la receta y ajustar la narración a lo que realmente se pudo demostrar.

Grado de verificación: ruta de importación SRT contrastada con documentación
oficial, aritmética del ejemplo revisada y guiones revisados por un segundo
agente. No hay demo completa ejecutada, comparación de alternativas ni prueba
de rendimiento de estos guiones con la audiencia. La elección editorial parte
de una tarea delimitada, utilidad reconocible, resultado que se puede mostrar
y comprobación concreta. Los referentes aportan formas de presentación;
sus vistas o su popularidad no validan la receta ni prueban que sea la mejor.

Preferencia explícita de Sergio en esta tarea: también le encantan
**Santiago Muñoz (@sanmunoz.ia)** y **Enrique Rocha (@soyenriquerocha)**.
Incluirlos entre los referentes principales de las siguientes revisiones.
Para estas piezas, probar la explicación a cámara acompañada por el paso
concreto arriba, y conservar una narración conversada. Son principios de
presentación; no copiar su identidad ni trasladar sus afirmaciones a Sergio.

## 1. De una lista de precios a una herramienta que tu cliente puede usar

**Duración:** 80–100 segundos. **Cuenta:** Sergio. **Destinatario:** dueño de un
negocio o persona que está aprendiendo a construir herramientas con IA.
**Tarea completa:** generar un cotizador HTML, abrirlo en la computadora y
comprobar que sus cálculos y su resumen funcionan.

### Lo que dice Sergio

“Elegís cien tarjetas, marcás que necesitás diseño y acá aparece el total.
Y este botón te deja el pedido escrito para copiarlo a WhatsApp.
Te muestro cómo hacer una herramienta así con IA.

Abrí Claude, empezá un chat y pegá este prompt. Le estamos dando tres cosas:
los precios, las opciones que puede elegir el cliente y cómo comprobar el cálculo.

En este ejemplo inventado, cada tarjeta cuesta un boliviano con veinte y el
diseño suma treinta. Cambiá esos valores por los de tu negocio.

Pedile que entregue un único archivo HTML. Cuando termine, copiá el código
en el Bloc de notas. Guardalo como cotizador punto html, con tipo ‘Todos los
archivos’, y abrilo con doble clic.

Ahora comprobalo: cien tarjetas sin diseño tienen que dar ciento veinte.
Con diseño, ciento cincuenta. Doscientas con diseño, doscientos setenta.
Si alguno falla, volvé al chat con la cuenta que esperabas y la que apareció.
Guardá el HTML corregido, volvé a abrirlo y repetí las cuentas.

Por último, probá ‘Copiar pedido’. Pegalo en un borrador y revisá que incluya
cantidad, diseño y total. Ese es el mensaje que después puede mandarte el cliente.

Ya tenés un prototipo que podés abrir y probar. Para que lo usen otras personas
todavía hay que publicarlo en una web y validar tus precios.
Guardá el prompt: podés adaptarlo a una imprenta, un catering o un servicio
que cotices siempre con las mismas opciones.”

### Prompt que aparece y se entrega completo

```text
Crea un cotizador de tarjetas para una imprenta ficticia.
Entrega un único bloque de código HTML completo, con CSS y JavaScript
incluidos. Debe abrir con doble clic, sin instalar nada, sin servidor,
sin librerías externas y sin conexiones a Internet.

Interfaz en español, clara y usable en teléfono:
- Título: Cotiza tus tarjetas.
- Aviso visible: Demo con precios ficticios. Estimación, no pedido confirmado.
- Selector de cantidad: 100, 200 o 500 tarjetas.
- Casilla opcional: Necesito diseño, +Bs 30.
- Precio por tarjeta: Bs 1,20. Guardarlo en centavos enteros (120).
- Diseño: 3000 centavos. Sumarlo una sola vez por pedido.
- Resumen que cambie al modificar las opciones y desglose impresión,
  diseño y total. Mostrar siempre dos decimales.
- Botón Copiar pedido. Debe copiar cantidad, precio unitario, subtotal,
  diseño y total como texto, sin abrir ni enviar WhatsApp.
- Si el navegador no permite copiar desde un archivo local, mostrar
  el mismo mensaje en un cuadro de texto seleccionable y explicar
  cómo copiarlo manualmente. No mostrar “Copiado” si la copia falló.
- Etiquetas asociadas a los controles, foco visible y sin desbordamiento
  horizontal en una pantalla de 390 píxeles.

Los cálculos deben cumplir estos casos:
100 sin diseño = Bs 120,00.
100 con diseño = Bs 150,00.
200 con diseño = Bs 270,00.
500 sin diseño = Bs 600,00.

No añadir pagos, registros, datos personales, impuestos, descuentos,
precios adicionales ni servicios externos.
```

**Si falla una cuenta, pegar en el mismo chat:**

```text
Encontré este fallo al probar el archivo que me diste:
Opciones elegidas: [cantidad y diseño].
Total que muestra: [resultado].
Total correcto: [cálculo].
Corrige la causa y devuélveme el HTML completo. Conserva las otras funciones.
No afirmes que lo probaste si no ejecutaste realmente el archivo.
```

### Pantallas que prepara el editor

1. Abrir con el resultado funcionando: cambiar 100 → 200 y activar diseño.
   Rótulo discreto persistente: «Demo · precios ficticios».
2. Chat nuevo y prompt: acercamientos a los precios, a «un único HTML» y a
   los casos de comprobación. La narración explica; el prompt completo queda
   legible en una lámina y en el texto de apoyo de la pieza.
3. Guardar en Bloc de notas como `cotizador.html`, tipo Todos los archivos,
   codificación UTF-8. Mostrar el nombre para evitar `cotizador.html.txt`.
   Copiar desde `<!DOCTYPE html>` hasta `</html>`, sin las cercas de código.
4. Abrir en navegador y capturar las cuatro combinaciones del prompt.
5. Copiar el resumen a un Bloc de notas vacío. Si no está disponible la copia
   automática, mostrar el camino manual real. No enviar ningún mensaje.

**Comprobación editorial:** el resumen pegado debe contener exactamente los
valores elegidos; cambiar opciones debe actualizarlo. Con 200 y diseño:
impresión Bs 240,00 + diseño Bs 30,00 = total Bs 270,00.
No grabar el primer plano de resultado hasta que esto funcione.
Después de cada corrección, guardar y abrir la nueva versión; repetir las
cuatro combinaciones y la copia del resumen.

## 2. Corrige los nombres que la IA escribió mal en tus subtítulos

**Duración:** 70–90 segundos. **Cuenta:** Sergio. **Destinatario:** creador que
ya tiene un archivo SRT de su video. **Herramientas:** un chat de Claude,
Bloc de notas y CapCut de escritorio ya instalado.
**Tarea completa:** corregir palabras de un SRT conservando sus tiempos e
importarlo en el editor. Esta pieza empieza con un SRT existente; no enseña
a transcribir audio ni promete arreglar tiempos que ya estuvieran mal.

### Lo que dice Sergio

“¿Tus subtítulos también convierten n8n en ‘ene ocho ene’?
Podés corregir esas palabras con IA y conservar los tiempos del archivo.

Si es una sola palabra repetida, Buscar y reemplazar alcanza. Este método
sirve cuando tenés distintos errores de escritura a lo largo del video.

Abrí tu SRT con el Bloc de notas. Vas a ver números, tiempos y frases.
Copiá todo y pegalo en Claude junto con este prompt.

La parte importante es este glosario: cómo lo escribió y cómo debería quedar.
Acá puse n8n, ONIA y Claude Code. Agregá las marcas o nombres que use tu video.

Y pedile que conserve exactamente la numeración y los tiempos. Así limitamos
la corrección al texto que ya tenés sincronizado.

Copiá la respuesta a un archivo nuevo: corregido punto srt, en UTF-8.
No reemplaces el original todavía.

Antes de importarlo, compará los tiempos de ambos archivos. En este ejemplo
tienen que seguir siendo los mismos tres bloques. Si la IA movió un tiempo
o eliminó una frase, pedile que lo corrija.

En CapCut de escritorio abrí tu proyecto, entrá a Subtítulos, Agregar
subtítulos e importá el archivo. En tu video real, reproducí cada frase corregida para confirmar
que coincide con lo que se escucha.

La próxima vez reutilizás el glosario y agregás las palabras nuevas.
Guardá este video si editás contenido donde los nombres de las herramientas
siempre salen mal.”

### Material copiable para la demostración

`original.srt` — ejemplo inventado, tres bloques:

```srt
1
00:00:00,000 --> 00:00:02,500
hoy vamos a conectar ene ocho ene

2
00:00:02,500 --> 00:00:05,000
con el formulario de onia

3
00:00:05,000 --> 00:00:08,000
y revisar el codigo con claud code
```

Prompt para pegar antes del SRT:

```text
Corrige únicamente ortografía, mayúsculas y los términos de este glosario
en el SRT que pego abajo:
- ene ocho ene → n8n
- onia → ONIA
- claud code → Claude Code

Conserva exactamente los índices, los códigos de tiempo, el orden,
la cantidad de bloques y la distribución de líneas de cada bloque.
No resumas, traduzcas, añadas contenido ni cambies otras palabras.
No adivines otros nombres propios. Devuelve solamente el SRT corregido,
sin introducción ni explicación.

[Pegar aquí todo el contenido de original.srt]
```

Salida esperada de este ejemplo, no atribuida a una ejecución de Claude:

```srt
1
00:00:00,000 --> 00:00:02,500
Hoy vamos a conectar n8n

2
00:00:02,500 --> 00:00:05,000
con el formulario de ONIA

3
00:00:05,000 --> 00:00:08,000
y revisar el código con Claude Code
```

### Pantallas que prepara el editor

1. Primer plano del error «ene ocho ene» y su corrección «n8n». El rótulo
   indica «Ejemplo didáctico»; no se atribuye a una transcripción real.
2. SRT original: marcar texto en un color y tiempos en otro. Después mostrar
   el glosario dentro del prompt y la respuesta real que se obtenga.
3. Guardar como `corregido.srt`, tipo Todos los archivos y UTF-8. Si la
   respuesta trae cercas de código, copiar solamente el contenido del SRT.
4. Comparación lado a lado: tres índices y tres intervalos idénticos;
   palabras corregidas resaltadas. Esto verifica la transformación del ejemplo.
5. Importar en un proyecto de práctica de CapCut: Subtítulos → Agregar
   subtítulos → Importar archivo. Capturar los controles de la versión usada;
   adaptar los rótulos si la interfaz difiere.
6. La sincronía con voz solo puede mostrarse con un clip que contenga esas
   frases. Para esta tanda no hay tal clip identificado: la importación puede
   mostrarse sobre una placa neutra, sin afirmar sincronía de audio probada.
   Al editar el A-roll, usar su SRT real para la comprobación con voz.

## Referentes usados y alcance de la revisión

Revisión de esta tarea, 28-sep-2026. Se observaron fragmentos visuales en el
navegador y se leyeron captions; no se reprodujo ni transcribió íntegramente
cada reel. Las fechas siguientes se comprobaron en el perfil o publicación.

- **Santiago Muñoz**, [perfil](https://www.instagram.com/sanmunoz.ia/) y
  [pieza del 28-sep, 21:35 UTC](https://www.instagram.com/sanmunoz.ia/reel/Dd2KbhWIRap/):
  perfil, caption, fecha y fragmento visual observados en esta tarea. En el
  fragmento, explicación a cámara abajo y apoyo documental/gráfico arriba;
  subtítulos breves con palabras destacadas. Es una pieza de actualidad sobre
  un modelo, no una receta ejecutable. Sus cifras no se validaron ni se usan
  como datos en estos guiones. Ya existía una ficha de edición de Santiago en
  `references/video-intake/2026-09-17-reel-santiago-astra-davinci-estilo-edicion.md`;
  esa ficha es análisis guardado, no reproducción actual del video anterior.
- **Enrique Rocha**, [perfil](https://www.instagram.com/soyenriquerocha/) y
  [pieza del 28-sep, 22:52 UTC](https://www.instagram.com/soyenriquerocha/reel/Dd2S811ODEy/):
  perfil, caption, fecha y fragmento visual observados. En el fragmento,
  primer plano informal en exterior, título directo y subtítulos breves.
  No se infiere su método didáctico completo a partir de ese fragmento.

- **Ian Lee**, [reel del 22-sep](https://www.instagram.com/ianlee.js/reel/DdmNXhGOnHe/):
  caption sobre venta B2B y construcción de una función con la API de Higgsfield.
  Fragmentos observados: cámara en exterior y acercamiento al teléfono como
  apoyo a la explicación. Principio aplicado: resultado concreto del negocio
  y herramienta que el espectador puede usar. El cotizador es una propuesta
  original; no se atribuye esa receta a Ian.
- **Erik Taveras**, [reel de subagentes](https://www.instagram.com/eriktaveras/reel/Ddxz2P_uCp6/),
  timestamp 27-sep 05:01 UTC: cámara, terminal y láminas que comparan entregables;
  caption con recurso asociado. Se leyeron además sus guías públicas de
  [subagentes](https://comunidad.eriktaveras.com/resources/analisis-con-subagentes-claude-code/)
  y [conexión de herramientas](https://comunidad.eriktaveras.com/resources/n8n-claude-code-hermes-conectados/).
  Principio aplicado: pasos copiables y forma de revisar la salida.
- **Tiago Lemos**, [reel de edición](https://www.instagram.com/tiagolemosx/reel/DdzhIFKRQ43/),
  timestamp comprobado 27-sep 20:56 UTC: fragmento observado con persona a cámara,
  subtítulos y composición gráfica; caption pide comentar «EDIÇÃO».
  Su afirmación de edición integral por Claude es una afirmación del creador,
  no verificada aquí. Principio aplicado: el cambio visual se muestra en
  pantalla. La receta de SRT es original y de alcance limitado.
- **Carlos Domínguez**, [referencia guardada](https://www.instagram.com/p/Dbiu19JRMSr/):
  se revisó mediante subagente la transcripción local de una corrección de
  datos guardados por un bot. No se verificó su perfil actual en esta pasada
  ni se reutilizaron afirmaciones legales. Referencia secundaria de mostrar
  un error y su corrección concreta.

La ruta de importación de SRT se contrastó con la
[ayuda oficial de CapCut](https://www.capcut.com/es-es/help/how-to-import-subtitles).
Se prepararon guiones y ejemplos; no se instalaron herramientas, ejecutaron
generaciones pagadas ni publicaron piezas. No se promete un recurso en la
comunidad que todavía no haya sido entregado allí.

## Enseñanza para Sergio — fuera de cámara

En el cotizador, la IA escribe el programa; después, JavaScript hace las
cuentas cada vez que cambian las opciones. El cálculo no necesita consultar
un modelo. Por eso conviene entregar precios y reglas exactas y comprobar
casos conocidos. Abrir ese archivo en tu computadora es tener un prototipo;
para convertirlo en una herramienta pública faltan alojamiento y validación
de las condiciones reales del negocio.

Un SRT combina texto con intervalos de tiempo. Podés corregir el texto sin
alterar los intervalos, pero pedirlo en un prompt no garantiza que el modelo
lo respete. Hay que comparar la estructura y escuchar el video. Tampoco se
puede deducir del texto si una cifra o un nombre fue realmente pronunciado:
el audio es la referencia. Para una sustitución fija, Buscar y reemplazar es
suficiente; la IA puede ayudar cuando los errores requieren contexto.

Una demo que funciona prueba ese caso concreto. Afirmar que un método es
mejor exige compararlo con otra opción para la misma tarea: pasos, tiempo,
errores, costo y facilidad de repetirlo. Y la calidad editorial se evalúa
después con audiencia real; no queda demostrada por imitar un referente.

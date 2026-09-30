# Semana 2 — «Un bot de WhatsApp que atiende sin mentir» (mié 7 → mar 13-oct-2026)

Guiones para Sergio Urcullo. Escrito el 29-sep-2026 según `BRIEF-ESCRITOR.md` y el calendario
de `MAPA.md` §4. Lo que se dice a cámara es el texto sin negrita; las líneas de **Fórmula** y
**Evidencia** son para el editor. Los `####` de los YouTube no se leen.

- **Verificado el 29-sep** (fuente primaria o corrido en el repo): R1 cobro de WhatsApp,
  R2 MCP de WhatsApp, R9 n8n 2.40, R10 Gemini 2.5, R11 Gemini TTS, reintentos y firma de
  webhooks de Meta, OGG/Opus para notas de voz, Stripe sin Bolivia, exportación de n8n.
  El banco del bot (62/62) y el control de frases se corrieron localmente el 29-sep.
- **Carruseles K4-K6:** van en `CARRUSELES-DIARIOS.md`, no acá.
- Piezas ✅ ya escritas: no se reescriben.

---

## Miércoles 7 de octubre

### D07-A · Vertical · La regla de 24 horas que rompe tu bot de WhatsApp ✅
**Fórmula:** F3 · Caso real → error → corrección → regla · **Pilar:** n8n y WhatsApp · **Destino:** comunidad (drop «Mensajes de seguimiento», ya en `PRODUCCION-GUIONES-2026-09-29.md`)
**Evidencia:** `hermes-content/deploy/vps-ops/bot/followup-run.mjs` (error 131047 fuera de ventana)

→ Guion listo en `GUIONES-PARA-GRABAR-2026-09-29.md`, Vertical 8.

### D07-B · Vertical · Ya podés dar de alta la API de WhatsApp hablándole a Claude
**Fórmula:** F2 · Noticia → qué cambia → probalo así · **Pilar:** n8n y WhatsApp · **Destino:** comunidad (drop 1)
**Evidencia:** https://developers.facebook.com/blog/post/2026/09/15/whatsapp-business-messaging-mcp-ai-agent/ · https://developers.facebook.com/documentation/mcp/whatsapp-business-tools-mcp

Ya podés dar de alta la API oficial de WhatsApp hablándole a Claude, sin recorrer el panel de Meta. Lo sacó Meta el quince de septiembre.

Se llama WhatsApp Business Tools MCP. En Claude Code lo conectás con un comando, el que ves en pantalla: claude mcp add, tipo http, y la dirección que publica Meta.

Después escribís barra mcp, elegís el servidor y entrás con tu cuenta de Meta. No pegás ningún token en el chat.

Y le pedís, en español: creá la cuenta de WhatsApp Business, agregá el número, verificalo con el código que me llega, registralo en la API, creá una plantilla y mandá un mensaje de prueba.

Para saber si quedó conectado, pedile que liste tus negocios. Si los ve, está.

Dos límites que pone Meta. Está en beta y llega de a poco: puede que todavía no te aparezca. Y es para desarrollo y pruebas, no para mandar mensajes en cantidad.

El paso a paso, con el comando, está en la comunidad.

### D07-C · YouTube horizontal · Un bot que no inventa: datos en un solo lugar, control después de la IA y medición
**Fórmula:** F1 · Resultado primero → cómo → comprobación → siguiente paso · **Pilar:** n8n y WhatsApp · **Destino:** comunidad (drop 2)
**Evidencia:** `bot/guardrails.mjs` (N1 al revés hasta 3-sep; frases corridas 29-sep) · `bot/ventanas-de-atencion.mjs` (horario doble hasta 13-sep) · `bot/bench.mjs` + `bot/evals/evals.test.mjs` (62/62 el 29-sep)

#### Resultado

Mi bot de WhatsApp no le puede decir un precio inventado a nadie. Y no es porque se lo pedí por favor en el prompt. Aunque la IA escriba un precio que no existe, ese mensaje no sale: sale otro.

En este video te muestro las tres capas que hacen eso en el bot de ONIA, y cómo armar cada una en tu bot aunque uses n8n y no escribas código. Dónde van los datos de tu negocio. Qué control va después de la IA. Y cómo medís que todo eso funciona, con un número y no con una sensación.

#### Por qué importa

Una recepcionista que no sabe un precio dice «déjeme consultar». Un modelo de lenguaje que no sabe, a veces completa. Y completa con total seguridad.

Para un negocio eso tiene costo directo. Un precio inventado es un precio que después tenés que respetar o discutir con el cliente. Una función que no tenés, prometida por escrito, es un reclamo.

Y hay una idea que me cambió la forma de pensarlo: una instrucción en el prompt es un pedido. Un control en el código es una pared. Las dos sirven. Pero solo la pared se puede probar.

#### Capa uno: cada dato en un solo lugar

Empecemos por los datos del negocio: horario, dirección, formas de pago, preguntas frecuentes.

Te cuento cómo lo aprendí. Hasta el trece de septiembre, mi bot tenía el horario escrito en dos lugares. Los turnos que ofrecía salían de un archivo. La promesa de «te contesta una persona en horario de atención» salía de otro, tipeado a mano, que decía de nueve a dieciocho. Resultado: un mismo mensaje podía ofrecer una reunión a las dos de la tarde y prometer atención desde las nueve de la mañana. Las dos cosas no podían ser ciertas a la vez, y nadie lo había visto.

La regla que salió de ahí: cada dato vive en un solo lugar, y todo lo que el bot dice sobre ese dato se arma desde ahí. Hoy la frase de horario que manda mi bot se genera sola, a partir de las mismas franjas que usa para ofrecer turnos. Si muevo una franja, la frase cambia sola.

En tu bot: una planilla o un archivo, una fila por dato. Y el bot lee de ahí, no de un párrafo que pegaste en el prompt hace tres meses.

Cómo sabés que lo hiciste bien: cambiá el horario en ese lugar y preguntale al bot. Si contesta el nuevo sin que toques nada más, está bien.

#### Capa dos: un control después de la IA

La segunda capa es la que más me importa. Primero, un dato que casi nadie cuenta: en mi bot, la mayoría de las respuestas salen de un guion escrito. La IA entra cuando alguien se sale del guion. Y ese texto libre pasa por un control antes de salir.

El control hace cuatro cosas.

Uno: normaliza. Pasa todo a minúscula y le saca las tildes, para que «Cuesta» con mayúscula y «cuesta» sean lo mismo.

Dos: prueba patrones prohibidos. En mi bot hay seis familias. Te nombro cinco que sirven para cualquier negocio: decir un precio, prometer una función que no existe, fingir que es una persona, inventar porcentajes o cantidad de clientes, y dar un consejo clínico o legal.

Tres: si cualquier patrón coincide, no recorta la frase. Descarta la respuesta entera.

Cuatro: manda un texto seguro. El mío dice: «Eso prefiero no contestártelo yo: soy un bot y no quiero darte un dato equivocado. Te lo confirma una persona en la demo». Y ofrece dos horarios.

Ahora, el error que más me enseñó. El patrón de precios buscaba un número seguido de la moneda: «trescientos veinte Bs». Pero los precios de verdad se escriben al revés: «Bs trescientos veinte». Así los escribe mi propio archivo de precios. Hasta el tres de septiembre, ese control dejaba pasar «Bs novecientos noventa y nueve por mes, oferta especial». Estaba al revés, y nadie lo había probado con un texto real.

En pantalla tenés el patrón que cubre las dos formas: número y después moneda, o moneda y después número.

Dos detalles que en mi bot son pruebas automáticas, porque son fáciles de perder.

Primero: si lo escribís en JavaScript, el patrón no lleva la bandera g, la de búsqueda global. Con esa bandera, el mismo control acierta una vez y falla la siguiente.

Segundo: probá tu texto seguro contra tus propios patrones. Si tu texto seguro menciona un precio, el control se dispara contra sí mismo.

En n8n se arma así: después del nodo de la IA ponés un nodo If. La condición: el texto de la respuesta coincide con el patrón de pantalla. Si coincide, sale tu texto seguro. Si no, sale la respuesta.

#### Capa tres: medir

La tercera capa contesta la pregunta que nadie se hace: ¿cómo sabés que las dos primeras funcionan?

En ONIA hay dos instrumentos. El primero es un banco de casos: mensajes escritos como escribe un dueño de negocio por WhatsApp. Cada caso dice qué tendría que hacer el bot. Y se corre contra la misma función que usa el bot en producción, no contra una copia. Si mañana cambio el bot, la medición cambia con él. Lo corrí el veintinueve de septiembre: sesenta y dos de sesenta y dos.

El segundo es usar el control como juez. En las pruebas, cada respuesta que sale pasa por el mismo control de la capa dos. Si alguna dice algo prohibido, la prueba falla.

#### Demostración

Lo que ves en pantalla es el control de mi bot, corrido el veintinueve de septiembre con frases de prueba.

«Bs novecientos noventa y nueve por mes, oferta especial»: bloqueada, por precio.

«Soy Sergio, te llamo ahora»: bloqueada, por fingir ser una persona.

«El noventa y cinco por ciento de las clínicas»: bloqueada, por cifra inventada.

«Garantizamos resultados»: bloqueada, por promesa.

«Te lo confirma una persona»: pasa.

Y una que te va a llamar la atención: «cuesta poco» también se bloquea, aunque no tiene ningún número. Es a propósito. Prefiero que el bot mande un mensaje genérico de más a que improvise sobre plata.

#### El error común

El error más común es querer resolver todo en el prompt. Escribís «nunca digas precios» en mayúsculas, tres veces, y listo. Funciona casi siempre. El problema es el casi: no tenés forma de saber cuándo no funcionó, hasta que te lo reclama un cliente.

El prompt ayuda, y lo sigo usando. Pero lo que no se puede equivocar va en un control que se prueba.

#### Cierre

Hacé esto hoy: escribí diez frases que tu bot nunca debería mandar y diez que sí. Pasalas por tu control. Si una prohibida pasa, o una buena se bloquea sin motivo, ya sabés qué arreglar.

En la comunidad de WhatsApp dejé las tres capas en una hoja: la plantilla de datos, el patrón de precios y las frases de prueba. Nos vemos en el próximo.

---

## Jueves 8 de octubre

### D08-A · Vertical · ¿La IA le promete a tu cliente algo que no confirmaste? ✅
**Fórmula:** F4 · Misma tarea, dos niveles (sin regla / con dos listas) · **Pilar:** n8n y WhatsApp · **Destino:** comunidad (drop «Bot con dos listas», ya en `PRODUCCION-GUIONES-2026-09-29.md`)
**Evidencia:** `PRODUCCION-GUIONES-2026-09-29.md` §Prueba 2 (Cajas Kuska, Sonnet 5.5, 28-sep)

→ Guion listo en `GUIONES-PARA-GRABAR-2026-09-29.md`, Vertical 3.

### D08-B · Vertical · Tu agente de n8n no usa la herramienta: la opción nueva que lo obliga
**Fórmula:** F2 · Noticia → qué cambia → probalo así · **Pilar:** n8n y WhatsApp · **Destino:** comunidad (drop 3)
**Evidencia:** https://docs.n8n.io/changelog/release-notes (2.40, 15-sep-2026: «Force Tool Call on First Iteration», AI Agent v3 y Agent Tool v3, apagada por defecto)

Tu agente de n8n tiene una herramienta conectada y contesta de memoria, sin usarla. n8n dos punto cuarenta, del quince de septiembre, trae el arreglo.

En el nodo AI Agent, versión tres, hay una opción nueva: Force Tool Call on First Iteration. Obliga al modelo a llamar una herramienta en su primera respuesta.

n8n dice para qué: modelos chicos que contestan en prosa y se saltean las herramientas conectadas.

Un ejemplo: el bot de una ferretería, con una herramienta que consulta el stock. Sin la opción, un modelo barato puede decir «sí, tenemos» sin mirar. Con la opción, primero consulta.

Cómo lo comprobás: abrí la ejecución y fijate que la llamada a la herramienta aparezca antes del texto.

Dos cuidados. Viene apagada: la prendés vos. Y obliga en la primera respuesta de cada ejecución, aunque el mensaje sea un «hola».

Actualizá primero en una copia. Yo sigo en una versión anterior y no la toco sin un plan.

Lo tenés completo en la comunidad: el link está en mi web.

### D08-C · Vertical · Negocio: cuánto te va a costar tu bot desde octubre
**Fórmula:** F5 · Abrí la fuente: número → lectura → consecuencia · **Pilar:** n8n y WhatsApp · **Destino:** comunidad (drop 4)
**Evidencia:** https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages (leída 29-sep: servicio y utilidad dentro de la ventana, por mensaje desde el 1-oct; «rates for service messages are the same as the rates for utility»)

Desde el uno de octubre, cada respuesta de tu bot de WhatsApp se cobra. Hacé la cuenta antes de que llegue la factura.

Lo dice la página de precios de Meta, la que ves en pantalla: los mensajes de servicio, que son las respuestas dentro de las veinticuatro horas, pasan a cobrarse por mensaje. Da igual si contesta un bot o una persona desde la plataforma. Si contestás a mano desde la app de WhatsApp Business, esto no te toca.

La cuenta tiene tres datos. Uno: cuántos mensajes manda tu negocio por mes. Contá mensajes, no conversaciones. Dos: la tarifa de tu país en la tabla de Meta; la de servicio es la misma que la de utilidad. Tres: multiplicá.

Un ejemplo: una clínica que contesta a cuarenta personas por día, cinco mensajes a cada una, en treinta días manda seis mil mensajes.

Para gastar menos, juntá tres burbujas en una. Cada burbuja es un mensaje.

La planilla para hacer tu cuenta está en la comunidad.

---

## Viernes 9 de octubre

### D09-A · Vertical · Por qué tu bot contesta dos veces lo mismo
**Fórmula:** F3 · Caso real → error → corrección → regla · **Pilar:** n8n y WhatsApp · **Destino:** comunidad (drop 5)
**Evidencia:** `bot/message-dedup.mjs` (10 min, filtro en memoria + clave única en base, `releaseMessage`) · https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview (reintentos pueden duplicar)

Si tu bot a veces contesta dos veces lo mismo, no es la IA. Es el aviso, que le llegó dos veces.

Cuando entra un mensaje, WhatsApp le avisa a tu servidor y espera un «recibido». Si tu servidor tarda o falla, Meta vuelve a mandar el mismo aviso, y su documentación dice que eso puede generar duplicados. Y tu bot contesta otra vez.

El arreglo: cada mensaje trae un identificador único. En mi bot de ONIA hay dos filtros por ese identificador, en este orden. Primero, uno en memoria: si ya lo vio en los últimos diez minutos, lo descarta sin tocar nada más. Después, uno en la base de datos, con el identificador como clave única: ese sobrevive a un reinicio.

Un detalle: si el turno falla antes de contestar, se suelta el identificador. Si no, el reintento bueno también se descarta.

Para probarlo, mandá el mismo aviso dos veces. Tiene que salir una sola respuesta.

La receta de los dos filtros está en la comunidad.

### D09-B · Vertical · Ponele voz a tu bot: los modelos nuevos de Google
**Fórmula:** F2 · Noticia → qué cambia → probalo así · **Pilar:** n8n y WhatsApp · **Destino:** comunidad (drop 6)
**Evidencia:** https://ai.google.dev/gemini-api/docs/changelog (22-sep: `gemini-3.8-flash-tts`, `gemini-3.8-flash-lite-tts`) · https://ai.google.dev/gemini-api/docs/speech-generation (español ✔, salida WAV, aistudio.google.com/generate-speech) · https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/audio-messages (nota de voz = OGG con Opus). Grabar la prueba en AI Studio antes; si ninguna voz suena natural, se dice eso.

Tu bot de WhatsApp puede contestar con una nota de voz. El veintidós de septiembre Google sacó dos modelos de voz: Gemini tres punto ocho Flash TTS y su versión Lite, más rápida y barata. Hablan español y aceptan un estilo.

Antes de programar nada, probalo. Entrá a AI Studio, a generar voz, en la dirección que ves en pantalla. Pegá la respuesta que más manda tu negocio, por ejemplo cómo llegar. Probá dos voces y pedí un estilo: tranquila y amable.

El criterio es uno: ¿la mandarías como nota de voz a un cliente? Si suena a contestador, no.

Para usarla, dos cosas. Una: el audio sale en WAV, y WhatsApp quiere OGG con Opus para mostrarlo como nota de voz. Se convierte con ffmpeg: comando en pantalla.

Dos: la voz va al final. Primero el texto pasa por tus controles, y recién después se convierte en audio. Un precio inventado dicho con voz amable sigue siendo inventado.

Lo tenés completo en la comunidad: el link está en mi web.

### D09-C · YouTube horizontal · El mensaje que se perdía: webhook caído, rescate y firma
**Fórmula:** F3 · Caso real → error → por qué → corrección → regla · **Pilar:** n8n y WhatsApp · **Destino:** comunidad (drop 7)
**Evidencia:** `bot/rescate-run.mjs` (cabecera: línea de tiempo del 3-sep, 20 reinicios 28-ago→3-sep, 3 min / 12 h) · commit `6e5d5940` (401 y contador falso, verificado contra producción) · `bot/webhook-security.mjs` (jul-2026: firma + secreto en ruta, 503 sin secreto) · https://developers.facebook.com/docs/graph-api/webhooks/getting-started (`X-Hub-Signature-256`)

#### El caso

El tres de septiembre, a las doce y tres minutos de la madrugada, alguien le escribió a mi bot de WhatsApp: «Hola, quiero información sobre el sistema».

Nunca recibió respuesta. Y nadie se enteró.

En este video te muestro qué pasó segundo por segundo, cómo lo arreglamos para que no dependa de que el servidor nunca se caiga, y un segundo agujero que tenía la misma puerta: cualquiera podía hacerle decir cosas a mi bot.

#### Qué pasó, segundo por segundo

Así funciona mi bot. El cliente escribe por WhatsApp. El mensaje llega a Chatwoot, que es la bandeja donde se ven todas las conversaciones. Chatwoot le avisa al bot llamando a una dirección, el webhook. Y el bot contesta.

Esa madrugada, en los registros:

A las cero horas, tres minutos y treinta y dos segundos, se reinició el contenedor donde vive el webhook. Con él se cayó el proceso.

Veinte segundos después llegó el mensaje. Chatwoot llamó al webhook. No había nadie.

Nueve segundos más tarde, el vigía que revisa el webhook vio que no respondía y lo levantó.

Unos segundos después llegó otro mensaje, y ese sí tuvo respuesta.

El del medio cayó justo en el hueco. Chatwoot disparó su único aviso contra un puerto muerto, y no volvió a intentar.

#### El error de fondo

Yo suponía que si el aviso fallaba, se reintentaba. Y eso depende de quién te avisa. Meta, si le hablás directo a la API de WhatsApp, reintenta cuando tu servidor no contesta bien; su documentación lo dice. La bandeja que yo tengo en el medio, ese día, no reintentó.

Primera regla: no supongas cómo reintenta tu proveedor. Medilo.

Después contamos cuántas veces pudo haber pasado. Entre el veintiocho de agosto y el tres de septiembre, el webhook se reinició veinte veces. Cada reinicio era un hueco de hasta dos minutos donde un mensaje se podía perder para siempre.

#### La corrección: un barrido de rescate

La tentación es decir «que el servidor no se caiga nunca». Eso no existe. El vigía que lo levanta ya existía y hacía su trabajo. Lo que faltaba era otra cosa: que caerse dejara de costar una persona.

Así que con mi agente armamos un barrido de rescate. Corre cada diez minutos y hace una sola pregunta: ¿quién escribió y no tiene ninguna respuesta después?

Por cada conversación mira el último mensaje. Si es del cliente y no hay nada nuestro después, es un huérfano. Un detalle: cerrar la conversación no cuenta. Marcarla como resuelta no es haberle contestado a la persona.

Con cada huérfano, el barrido vuelve a meter el mensaje por el mismo webhook, con el mismo identificador que tenía.

¿Y si ya se había contestado? No pasa nada, y esta es la parte linda. El bot tiene un filtro de duplicados por identificador. Reinyectar de más no produce una segunda respuesta. Produce un salteo.

Dos barandas, y las dos son contra hablar de más.

La primera: no toca mensajes de menos de tres minutos. Uno de hace diez segundos puede estar siendo contestado ahora mismo.

La segunda: no toca mensajes de más de doce horas. Contestarle a alguien que escribió hace dos días llega fuera de contexto. Y acordate de la ventana de veinticuatro horas: pasado eso, solo salen plantillas aprobadas.

Una excepción con nombre: si la conversación pasó a una persona, el bot se calla a propósito. Ese silencio lo vigila otro aviso.

Y corre en seco por defecto. Sin una bandera explícita, solo te muestra qué haría.

Si usás n8n, es un flujo con un disparador cada diez minutos que busca en tu bandeja las conversaciones cuyo último mensaje es del cliente, con más de tres minutos y menos de doce horas, y las vuelve a mandar a tu flujo principal.

#### Lo que salió mal al probarlo

Primera prueba real, primer error: el barrido recibió un cuatrocientos uno, no autorizado. Reinyectaba por la puerta del webhook sin la llave, y el webhook pide llave. El rescate tiene que entrar por la misma puerta, con la misma llave, leída del mismo archivo. Si la copiás a otro lado, algún día se desincroniza y vuelve el cuatrocientos uno sin que sepas por qué.

Segundo error, más sutil. El barrido informaba «un mensaje reinyectado». Pero esa conversación estaba con una persona, y el bot se callaba por diseño. Había salvado a cero personas y el contador decía uno. Un contador que dice éxito sin éxito es peor que no tener contador. Ahora separa «mandado» de «contestado» y dice el motivo.

Y la verificación que vale: reinyectamos en producción un mensaje que ya estaba contestado. El webhook respondió que era un duplicado, y nadie recibió nada. Eso es exactamente lo que tenía que pasar.

#### El segundo agujero: quién le habla a tu bot

La misma puerta tenía otro problema, que cerramos a fines de julio. El webhook no verificaba quién le hablaba. Cualquiera que conociera la dirección podía mandar un aviso armado a mano, y el bot le escribía a una persona real lo que ese aviso dijera.

Ahora tiene dos cerraduras, y alcanza con una.

La primera es la firma. El que manda el aviso lo firma con una clave que comparten los dos. Tu servidor calcula la misma firma y compara. Si no coinciden, rechaza. Y la firma lleva la hora: si el aviso tiene más de cinco minutos, se rechaza aunque la firma sea buena. Eso frena a alguien que grabó un aviso viejo y lo reenvía.

Si le hablás directo a Meta, la firma viene en el encabezado que ves en pantalla, X-Hub-Signature-256, calculado con el secreto de tu app. Está en la documentación de webhooks de Meta.

La segunda cerradura es un secreto largo en la dirección, por si el que avisa no firma. Si usás n8n, el nodo Webhook ya viene con una dirección larga y aleatoria. No la cambies por una linda, tipo barra whatsapp.

Y la decisión que más importa: si no configuraste ningún secreto, mi servidor no acepta nada. Responde un error de configuración en vez de abrirse. El código del que partí hacía lo contrario: sin secreto, aceptaba todo. Ese es el agujero más común, porque es el que viene de fábrica.

#### La regla

Tres reglas, cada una en una frase.

No supongas que tu proveedor reintenta: medilo.

Tu servidor se va a caer: que caerse no te cueste un cliente.

Y tu webhook no le cree a nadie: firma, secreto, o nada.

#### Cierre

Hacé esta prueba hoy: apagá tu webhook, mandate un mensaje desde otro teléfono, prendelo y esperá diez minutos. Si ese mensaje nunca se contesta, necesitás un rescate.

El checklist del webhook, con las tres reglas y cómo probar cada una, está en la comunidad de WhatsApp. Nos vemos en el próximo.

---

## Sábado 10 de octubre

### D10-A · Vertical · Tu bot no le tiene que escribir a nadie a las seis de la mañana
**Fórmula:** F3 · Caso real → error → corrección → regla · **Pilar:** n8n y WhatsApp · **Destino:** comunidad (drop 8)
**Evidencia:** `bot/config.mjs` (`afterHours: 20`, franja 8-21 La Paz) · `bot/barridos-no-escriben-de-madrugada.test.mjs` (un barrido no consultaba la hora; el comentario lo daba por cubierto)

Mi bot de ONIA manda un seguimiento veinte horas después del último mensaje del cliente. Hacé la cuenta: el que escribe a las diez de la mañana recibe el seguimiento a las seis.

Por eso todo envío automático pasa por una franja. En mi bot, de ocho de la mañana a nueve de la noche, hora de La Paz. Fuera de eso, el mensaje espera y sale a las ocho.

La regla: la franja va en el código, no en el horario de la tarea programada. Al arreglar uno de los barridos, el comentario del arreglo decía que otro estaba protegido por el horario de su tarea. Lo medimos: no revisaba la hora ni una vez. Corrido a mano a las tres de la mañana, mandaba.

Ahora una prueba busca todo barrido que manda mensajes y falla si alguno no consulta la franja.

Por qué importa: un mensaje de madrugada molesta, y si te bloquean, baja la calidad de tu número.

La regla escrita está en la comunidad.

### D10-B · Vertical · Si tu automatización usa Gemini 2.5, migrala con calma
**Fórmula:** F2 · Noticia → qué cambia → probalo así · **Pilar:** n8n y WhatsApp · **Destino:** comunidad (drop 9)
**Evidencia:** https://ai.google.dev/gemini-api/docs/changelog (18-sep: 2.5 limitado a quien ya lo usaba; «3.5 Flash-Lite or 3.8 Flash»; sin fecha de apagado) · https://ai.google.dev/gemini-api/docs/models (`gemini-3.5-flash-lite`, `gemini-3.8-flash`)

Si tu automatización usa Gemini dos punto cinco, anotá esto. El dieciocho de septiembre Google limitó esos modelos a quienes ya los venían usando. Para proyectos nuevos recomienda Gemini tres punto cinco Flash-Lite o tres punto ocho Flash.

No puso fecha de apagado: dice que se siguen sirviendo hasta nuevo aviso. Justamente por eso conviene migrar con calma, y no el día que falle.

En n8n es así. Buscá los workflows que usan el nodo Google Gemini Chat Model. Duplicá uno. En la copia, cambiá el modelo por uno de los nuevos; los nombres exactos están en pantalla. Y corré la copia con diez mensajes reales de tu historial.

Compará tres cosas: si responde igual de bien, si llama a las mismas herramientas y si tarda parecido.

Si pasa, cambiás el original. Si no, probás el otro modelo.

El error común es cambiar el nombre del modelo directo en producción y enterarte por un cliente.

Lo tenés completo en la comunidad: el link está en mi web.

### D10-C · Vertical · Historia: el vigía que mandó el mismo aviso vacío durante cuarenta y un días
**Fórmula:** F3 · Caso real → error → por qué → corrección → regla · **Pilar:** Errores y lecciones · **Destino:** comunidad («contame cuál encontraste»)
**Evidencia:** `hermes-content/deploy/vps-ops/security-watch.sh` (reescrito 24-sep; contar solo el patrón, sin qué miraba) · `hermes-content/deploy/vps-ops/vigia-credito-ia.sh` (9 al 17-sep, 194 llamadas fallidas)

Tenía un vigía que cada mañana me mandaba un resumen. Durante unos cuarenta y un días no miró nada.

Apuntaba a un contenedor que ya no existía. El error del chequeo se tiraba a la basura, así que el mensaje salía igual, todos los días, con el número en blanco. Nadie lo leía, porque siempre decía lo mismo.

En esas mismas semanas pasó otra. Del nueve al diecisiete de septiembre, el proveedor de IA se quedó sin crédito. Ciento noventa y cuatro llamadas fallaron, y el bot contestó con su texto fijo. Nadie vio un error. Se vieron respuestas peores.

Salieron dos reglas. Una: si el vigía no pudo mirar, lo dice. «No pude mirar» nunca sale con cara de «todo bien». Dos: el vigía busca en los registros la frase exacta del problema, como «sin crédito», en vez de esperar que alguien se queje.

Revisá hoy tus alertas: ¿cuál te llega siempre igual? Esa es la que ya no mirás.

Contame en la comunidad cuál encontraste.

---

## Domingo 11 de octubre

### D11-A · Vertical · Antes de mandar mensajes automáticos, sacate a vos de la lista
**Fórmula:** F6 · Construyo en público · **Pilar:** n8n y WhatsApp · **Destino:** comunidad (drop 10)
**Evidencia:** `bot/es-nuestra.mjs` (18-sep: de 3 filas, 2 propias; 19-sep: la bandeja de pruebas se marca entera). NO mostrar el archivo: tiene números reales.

Antes de prender los mensajes automáticos de mi bot, el dieciocho de septiembre, miré a quién les iba a escribir. Eran tres. Dos eran míos.

Uno era una sonda: un chat de prueba que mi sistema abre cada media hora para ver si el bot contesta. El otro, una fila de prueba que habíamos cargado a mano. Persona real, una sola.

Los barridos elegían a quién escribirle por etapa y por tiempo sin respuesta. Nunca por quién era.

El arreglo tiene dos partes. Una: una lista de lo que es tuyo. Tu número, tus contactos de prueba, y la bandeja entera donde hacés pruebas, no solo los nombres, porque los chats que abre una sonda a veces aparecen con nombres al azar. Dos: lo que se saltea no desaparece. Queda en una lista con su motivo, para que un error se vea.

Por qué importa: en la plataforma de WhatsApp, cada mensaje que te mandás a vos mismo se paga.

La lista de exclusión está en la comunidad.

### D11-B · Vertical · Tu bot tiene que entender audios (y dos trampas que pagué)
**Fórmula:** F7 · Receta con el paso crítico marcado · **Pilar:** n8n y WhatsApp · **Destino:** comunidad (drop 11)
**Evidencia:** `bot/audio-transcribe.mjs` (modelos distil solo-inglés traducen; 19-sep: el transcriptor desapareció y el respaldo configurado no lo leía nadie) · `bot/vision.mjs` (US$ 0,0007 por foto, ago-2026). Confirmar el camino vivo del audio antes de grabar (inventario W-08).

En Bolivia, una parte enorme del WhatsApp son audios. Si tu bot no los entiende, le pide al cliente que escriba lo que acaba de decir. Así se pierde gente.

En mi bot de ONIA, el audio se transcribe y entra al mismo guion, como si lo hubieran escrito.

El paso crítico es el modelo. Algunos solo saben inglés: tu audio en español no lo transcriben, lo traducen. Y el bot no entiende nada. Por eso el modelo va fijado, uno multilenguaje, con el idioma en español.

La segunda trampa: el diecinueve de septiembre, el transcriptor desapareció. Había un respaldo configurado, y ninguna línea de código lo leía. Un interruptor que nadie lee es peor que no tenerlo.

Las fotos las describe un modelo barato, por menos de un décimo de centavo de dólar cada una, medido en agosto. Y esa descripción pasa por los controles: nunca diagnostica ni cotiza.

Mandale a tu bot un audio y mirá qué texto le llegó. Lo tenés completo en la comunidad: el link está en mi web.

### D11-C · Vertical · Negocio: cómo cobra una empresa de software desde Bolivia sin Stripe
**Fórmula:** F6 · Construyo en público · **Pilar:** SaaS desde Bolivia · **Destino:** comunidad (drop 12)
**Evidencia:** https://stripe.com/global (29-sep: Bolivia no figura) · `hermes-content/deploy/vps-ops/vigia-comprobantes.sh` (24-sep) · `docs/handoff/cobro-e2e.md` (probado E2E 10-sep). NO mostrar cuenta, banco ni comprobantes.

Si vendés software desde Bolivia, olvidate de Stripe. Lo revisé el veintinueve de septiembre en su página de países: Bolivia no está.

Así cobra ONIA. El cliente paga con un QR bancario y sube la foto del comprobante. El pago queda pendiente hasta que una persona lo aprueba.

El problema estaba en el medio. Al subir el comprobante, el sistema mandaba un solo correo. Si ese correo se perdía entre otros, alguien que ya pagó se quedaba sin su plan, y nadie se enteraba.

Así que desde el veinticuatro de septiembre hay un vigía. Cada diez minutos avisa de cada pago nuevo, con el monto y cuánto lleva esperando. Y una vez al día recuerda los que llevan más de veinticuatro horas.

Lo que no hace es aprobar solo. Aprobar sin mirar el comprobante es regalar el plan.

Mi agente probó el cobro de punta a punta el diez de septiembre, con una cuenta de prueba.

Si cobrás por transferencia, armá lo mismo. Lo tenés completo en la comunidad: el link está en mi web.

---

## Lunes 12 de octubre

### D12-A · Vertical · ¿Tu bot mejoró o te parece? Medilo con un banco de mensajes
**Fórmula:** F1 · Resultado primero → cómo → comprobación → siguiente paso · **Pilar:** n8n y WhatsApp · **Destino:** comentá BANCO (drop 13)
**Evidencia:** `bot/bench-cases.mjs` (cabecera: 8 casos que fallaron al escribirse; «un banco que da 100% no encontró nada») · `bot/bench.mjs` (corrido 29-sep: 62/62)

¿Tu bot mejoró, o te parece? Sin un número, es opinión.

En ONIA tengo un banco de sesenta y dos mensajes, escritos como escribe un dueño de negocio por WhatsApp: en minúscula, sin tildes, con errores. Cada uno dice qué datos dio la persona y qué tendría que hacer el bot. Y se corre contra la misma función del bot en producción.

Lo corrí el veintinueve de septiembre: sesenta y dos de sesenta y dos.

Pero lo valioso fue cuando fallaba. Ocho mensajes fallaron al escribirlos. «¿Hablo con una persona?» lo contaba como un equipo de una persona. «Somos veinticinco obreros» no lo leía como tamaño. Cada uno se arregló en el bot, nunca aflojando la prueba.

Dos reglas. Un banco que da cien por ciento no encontró nada: sumá mensajes que hoy fallen. Y no todo fallo pesa igual: inventar un dato es peor que derivar de más a una persona.

Armá el tuyo con veinte mensajes reales de tu chat.

Comentá BANCO y te paso la plantilla.

### D12-B · Vertical · n8n: la clave de API no va escrita en el nodo
**Fórmula:** F7 · Receta con el paso crítico marcado · **Pilar:** n8n y WhatsApp · **Destino:** web `sergiourcullo.vercel.app/stack` (sección n8n)
**Evidencia:** https://docs.n8n.io/build/manage-workflows/export-and-import (el export lleva nombres e IDs de credenciales; nodos HTTP importados de cURL pueden llevar encabezados de autenticación) · regla n8n de `~/.claude/CLAUDE.md` (credencial > `$env` > nada). NO contar el incidente de la clave publicada (rotación sin confirmar).

Si pegaste una clave de API adentro de un nodo de n8n, esa clave viaja en cada exportación del workflow.

Cuando exportás un workflow, el archivo lleva lo que escribiste en los nodos. De las credenciales, lleva solo el nombre. La trampa típica: pegás un comando curl en el nodo HTTP Request, n8n lo convierte, y la clave queda escrita en un encabezado del nodo.

El orden: primero, una credencial de n8n. Si la API pide la clave en un encabezado, es una credencial Header Auth, y el nodo la elige de una lista. Segundo, si tu instalación lo permite: una variable de entorno del servidor. Y nunca: la clave escrita en el nodo.

El paso que casi nadie hace: exportá tus workflows y buscá en los archivos cómo empiezan tus claves, por ejemplo «Bearer». Si aparece una, pasala a una credencial y cambiá esa clave en el proveedor.

Si todavía no tenés n8n en tu servidor, la guía para instalarlo está en mi web, en stack.

### D12-C · YouTube horizontal · Probá el recorrido entero: del botón de tu web a lo que contesta el bot
**Fórmula:** F3 · Caso real → error → auditoría → corrección → regla · **Pilar:** Web y landing · **Destino:** comunidad (drop 14)
**Evidencia:** memoria `web-lead-bot-lo-trata-como-pregunta-precio.md` (17-sep, medido con `step()`; NO mostrar: tiene un número) · `bot/campanas-web.test.mjs` (cabecera 24-sep: 9 campañas verdes y 0 vivas; 24 días esperando una copia a mano; el gate no prueba que el deploy corrió) · commit `055713e4` (24-sep: conversación tibia 6 días sin aviso; commiteado, no desplegado)

#### El caso

Tenía una web con un formulario. La persona arma su pedido, toca un botón, y se le abre WhatsApp con el pedido ya escrito. Del otro lado, mi bot.

Cada pieza funcionaba. La web abría WhatsApp con el texto correcto. El bot contestaba. Todo en verde.

El diecisiete de septiembre, mi agente hizo lo que nadie había hecho: siguió el camino entero, con el mismo mensaje que manda la web.

El bot leyó el pedido como una pregunta de precio, y le contestó con la oferta de otro producto: el sistema de gestión, con su demo. Ni una palabra de lo que la persona había pedido.

En este video te muestro por qué pasan estas cosas, lo que encontramos una semana después, que fue peor, y el recorrido que tenés que hacer en tu negocio antes de mandar a nadie a tu web.

#### Por qué pasa

Pasa porque cada pieza tiene su dueño y su prueba. La web se prueba abriendo la web. El bot se prueba escribiéndole al bot. Nadie prueba lo que pasa entre las dos.

Y entre las dos hay un acuerdo invisible. La web precarga un texto en el enlace de WhatsApp, esa dirección wa punto me con el mensaje ya escrito. El bot reconoce ciertas frases de entrada y sabe qué contestar a cada una. Yo las llamo campañas. Si la frase que manda la web no es exactamente la que el bot espera, el bot la trata como un mensaje cualquiera.

El formulario armaba el mensaje con los datos de cada persona, y el bot no tenía ninguna campaña para él. Cayó en la regla general: alguien que pregunta precios.

Ese error no solo confunde. Mezcla dos ventas en el mismo canal: al que quería una cosa le ofrecés otra, y no cerrás ninguna.

#### Lo que encontramos después, que fue peor

El veinticuatro de septiembre revisamos todas las campañas. Había nueve, y sus pruebas estaban todas en verde.

Para un visitante real, no funcionaba ninguna. Cero de nueve.

¿Cómo puede ser? Las pruebas revisaban un archivo de campañas que ningún deploy copiaba a ninguna parte. El bot en producción leía otro. Y el pendiente que lo iba a arreglar llevaba veinticuatro días esperando una copia a mano que nadie iba a hacer.

Esa es la trampa: una prueba verde sobre un archivo que no está vivo no prueba nada.

#### La corrección

Dos cambios, y te los cuento porque se pueden copiar.

Uno: la prueba ya no tiene una lista de frases escrita a mano. Lee las frases directamente del código de la web y las compara con lo que conoce el bot. Si alguien cambia una coma en la web, la prueba se pone roja ese mismo día. Y revisa el archivo que el deploy publica de verdad, no una copia.

Dos: para el formulario, que arma el mensaje con los datos de cada persona, el bot reconoce la primera línea, que siempre es igual, como un comienzo fijo. Y a ese pedido le contesta sobre lo que pidió.

Pero hay algo que ni esa prueba sabe, y el propio archivo lo dice: si el deploy corrió. Un documento correcto y guardado no es un documento vivo. Eso solo lo prueba el recorrido.

#### El recorrido, paso a paso

Esto es lo que te llevás. Una planilla con cinco columnas: el botón, el texto que manda, qué debería contestar el bot, qué contestó de verdad, y a quién le llegó el aviso.

Paso uno. Abrí tu web en el celular, con datos móviles, como un visitante. No desde tu computadora con todo abierto.

Paso dos. Tocá cada botón que abre WhatsApp. Antes de mandar, copiá el texto que aparece escrito. Ese es el texto real, no el que vos creés que pusiste.

Paso tres. Mandalo desde un número que no uses para probar todos los días. Querés ver lo que ve un desconocido.

Paso cuatro. Anotá qué contestó el bot y cuánto tardó. ¿Contesta a lo que la persona pidió, o a otra cosa?

Paso cinco. Seguí el camino hasta el final. Si el bot dice «te contacta una persona», ¿a quién le llegó el aviso? ¿Por dónde? ¿Lo vio alguien?

Este paso es el que más se saltea. El mismo veinticuatro de septiembre encontramos una conversación que había quedado tibia seis días. El bot contestó bien, insistió una vez, y el aviso nunca le llegó a la única persona que podía cerrarla. El recorrido no termina en la respuesta del bot: termina en un humano que se entera.

Paso seis. Repetilo fuera de horario: de noche, un domingo. Ahí aparecen las respuestas que nadie revisó.

Paso siete. Repetilo después de cada cambio en la web o en el bot. Una coma alcanza para romper el acuerdo.

#### Cómo sabés que salió bien

Cada fila de tu planilla tiene que cerrar con tres sí. El bot contestó sobre lo que la persona pidió. Lo hizo en el tiempo que esperabas. Y una persona de tu negocio se enteró cuando tenía que enterarse.

Si una fila no cierra, no importa que cada pieza esté en verde.

#### Demostración

Lo que ves en pantalla es la planilla llenada con el caso del diecisiete de septiembre. Botón: el del formulario. Texto que manda: el pedido completo, con los datos de la persona. Qué debería contestar el bot: algo sobre ese pedido. Qué contestó: la oferta de otro producto. Esa fila tiene un no en la primera columna que importa, y con uno alcanza. Todo lo demás estaba en verde.

#### El error común

El error común es confiar en que cada parte se probó por separado. La web la probó el que hizo la web. El bot lo probó el que hizo el bot. Y el cliente es el único que recorre el camino entero. No dejes que sea el primero.

#### Cierre

La planilla del recorrido, con las cinco columnas y los siete pasos, está en la comunidad de WhatsApp. Hacelo esta semana con tu web, y contame qué encontraste.

---

## Martes 13 de octubre

### D13-A · Vertical · Cambiar el horario de tu bot no debería necesitar un programador
**Fórmula:** F4 · Así no / así sí (lógica o hecho) · **Pilar:** n8n y WhatsApp · **Destino:** comunidad (drop 15)
**Evidencia:** `bot/knowledge.mjs` (frontera lógica/hecho, todo o nada, TTL 5 min, todo string pasa por `checkGuardrails`; precios solo por el allowlist público) · `bot/knowledge.example.json`

¿Cambiar el horario de tu bot te obliga a llamar al programador? Entonces el horario está en el lugar equivocado.

En ONIA uso una pregunta: si este dato está mal, ¿el bot promete, cotiza o miente? Es lógica: va en el código, con pruebas. ¿O solo dice algo desactualizado? Es un hecho: va en un archivo que se edita sin tocar código.

El horario, las preguntas frecuentes y los datos del negocio son hechos. Se editan desde el panel, y el bot los relee cada cinco minutos, sin reiniciar nada.

Con tres candados. Uno: todo o nada. Si una sola línea está mal, se rechaza el archivo entero y el bot sigue con lo anterior. Aceptar la mitad te hace creer que publicaste lo que el bot no dice. Dos: un precio solo pasa si coincide con la lista oficial. Tres: cada texto pasa por los mismos controles que la IA.

La prueba: cambiá el horario y medí cuánto tarda tu bot en decirlo.

Lo tenés completo en la comunidad: el link está en mi web.

### D13-B · Vertical · Una alerta que te avisa treinta veces lo mismo ya no te avisa
**Fórmula:** F3 · Caso real → error → corrección → regla · **Pilar:** Agentes y loops · **Destino:** comunidad (drop 16)
**Evidencia:** `scripts/loops/vigia-ci.sh` (6-sep: CI roto, enterados ~10 min después de casualidad; ~20 vigías y ninguno miraba el CI; avisa por cambio) · `scripts/loops/vigia-disco.sh`

Si tu alerta te manda el mismo mensaje treinta veces, el treinta y uno no lo leés.

El seis de septiembre se rompió la compilación de mi producto. La prueba automática lo marcó en rojo, y no le avisó a nadie. Nos enteramos unos diez minutos después, de casualidad. Tenía unos veinte vigías y ninguno miraba eso.

El vigía que armamos es tonto a propósito. Lee el estado, lo compara con el de la vez anterior, que guarda en un archivo, y avisa solo si cambió: un mensaje al ponerse rojo y uno al recuperarse. Si sigue rojo, silencio. Y no arregla nada solo: arreglar sin que nadie mire es como se pierden cosas.

Sirve para todo: tu web, tu bot, tu disco. Son las tres líneas que ves en pantalla. Leé el estado. Si es distinto del guardado, avisá. Guardá el nuevo.

Antes de sumar una alerta, preguntate: ¿me avisa cuando algo cambia, o cada vez que mira?

El esquema del vigía está en la comunidad.

### D13-C · Vertical · Negocio: definí a tu cliente con cinco preguntas, no con adjetivos
**Fórmula:** F4 · Así no (adjetivo) / así sí (pregunta con número) · **Pilar:** SaaS desde Bolivia · **Destino:** comentá CLIENTE (drop 17)
**Evidencia:** `hermes-content/docs/ONIA_CLIENTE_IDEAL.md` §2 y §9 (cinco preguntas; «la pregunta 4 es la que vende») · `bot/bench-cases.mjs` (orden del embudo: los datos se piden con la demo ya reservada). NO mostrar la conversación del 25-ago ni nombres de clínicas.

«Mi cliente son las pymes» no es una definición. Es un adjetivo. ONIA trabaja con cinco rubros, pero salimos a vender primero a clínicas, y así definimos ese cliente: con preguntas que se contestan con un número, en dos minutos.

Uno: ¿cuántos profesionales atienden? Buscamos de dos a seis.

Dos: ¿quién agenda las citas? Si hay recepción, el volumen ya no cabe en la cabeza del dueño.

Tres: ¿cómo llevan hoy la agenda? Cuaderno, Excel o WhatsApp es la señal buena.

Cuatro: ¿cuántos pacientes empezaron un tratamiento y no volvieron?

Cinco: ¿facturan con NIT?

La cuatro es la que vende. Casi nadie la puede contestar, y el que no la sabe acaba de nombrar su problema. No la inventamos: una clínica que nos escribió pedía exactamente eso.

Y el orden importa. Mi bot pregunta sus datos después de ofrecer la demo, no antes. Las preguntas no son un peaje.

Hacé las tuyas: cinco preguntas con número, y una que tu cliente no sepa contestar.

Comentá CLIENTE y te paso la plantilla.

---

## Drops de la semana

Cada recurso se publica en la comunidad (Announcements) o se tiene listo para el DM ANTES que
el video. Los de las piezas ✅ (seguimiento y dos listas) ya están en
`PRODUCCION-GUIONES-2026-09-29.md` §Drops 3 y 6.

**1 · Alta de WhatsApp con Claude Code (D07-B, comunidad)**
```
1. Terminal: claude mcp add --transport http whatsapp_business_tools https://mcp.facebook.com/whatsapp_business_tools
2. En Claude Code: /mcp → whatsapp_business_tools → entrá con tu cuenta de Meta (no pegues tokens en el chat).
3. Conexión: «Listá mis negocios y mis cuentas de WhatsApp».
4. Pedido: «Creá una cuenta de WhatsApp Business para [negocio], agregá el número [número de prueba], verificalo con el código que me llegue, registralo en Cloud API, creá una plantilla de bienvenida y mandá un mensaje de prueba a [tu número]».
5. Límites (Meta, 15-sep-2026): beta, llega de a poco; para desarrollo y pruebas, no para envíos en cantidad.
```

**2 · Las tres capas (D07-C, comunidad)**
```
Capa 1 · Datos: una fila por dato (horario, dirección, formas de pago, preguntas frecuentes). El bot lee de ahí y de ningún otro lado.
Capa 2 · Control después de la IA (n8n: nodo If → «matches regex» sobre el texto en minúscula y sin tildes):
  precio:  (\d+([.,]\d+)?\s*(bs|bolivianos?|usd|dolares?)\b)|\b(bs|usd)\.?\s*\d
  promesa: \bgarantiz\w+|\bsin falla\w*
  persona: \bsoy (una persona|humano)\b|\bte llamo (ahora|en un rato)\b
  Si coincide → texto seguro: «Eso prefiero no contestártelo yo: soy un bot y no quiero darte un dato equivocado. Te lo confirma una persona.»
Capa 3 · Prueba: 10 frases que deben bloquearse («Bs 999 por mes, oferta especial», «garantizamos resultados»…) y 10 que deben pasar. Correlas después de cada cambio.
```

**3 · Forzar la herramienta en n8n 2.40 (D08-B, comunidad)**
```
1. Actualizá primero una copia de prueba a n8n 2.40 o posterior.
2. Nodo AI Agent (versión 3) → opciones → «Force Tool Call on First Iteration» → encendida (viene apagada).
3. Corré 5 mensajes reales que necesiten la herramienta.
4. En cada ejecución, la llamada a la herramienta tiene que aparecer antes del texto.
5. Ojo: obliga en la primera respuesta de cada ejecución, aunque el mensaje sea «hola».
```

**4 · Cuánto cuesta tu bot desde el 1-oct (D08-C, comunidad)**
```
A = mensajes que manda tu negocio por día · B = días que atendés por mes · C = A × B (mensajes al mes)
D = tarifa de tu país en la tabla de Meta (columna utilidad: la de servicio es la misma) · E = C × D (costo al mes)
Fuente: developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages
Para bajar E: una respuesta en vez de tres burbujas · no te escribas a vos mismo · las conversaciones que empiezan en un anuncio de clic a WhatsApp tienen 72 h gratis (misma página).
Si contestás a mano desde la app WhatsApp Business, esto no te toca.
```

**5 · Dos filtros contra la respuesta doble (D09-A, comunidad)**
```
1. Al entrar el aviso, sacá el id del mensaje (API de WhatsApp: entry → changes → value → messages → id).
2. Filtro rápido: si ese id está en memoria desde hace menos de 10 min → respondé 200 y no hagas nada más.
3. Filtro durable: guardá el id en tu base, con valor único, antes de contestar; si ya existe → no contestes.
4. Si el turno falla antes de mandar la respuesta → borrá el id, para que el reintento sí se procese.
5. Devolvé el 200 rápido; lo lento, después.
6. Prueba: el mismo aviso dos veces → una sola respuesta.
```

**6 · Voz para tu bot (D09-B, comunidad)**
```
1. aistudio.google.com/generate-speech · modelo gemini-3.8-flash-tts o gemini-3.8-flash-lite-tts.
2. Texto: tu respuesta más frecuente. Estilo: «tranquila y amable». Probá dos voces.
3. Criterio: ¿la mandarías como nota de voz a un cliente?
4. WhatsApp quiere OGG con Opus: ffmpeg -i respuesta.wav -c:a libopus respuesta.ogg
5. Orden en tu bot: texto → controles (precios, promesas) → recién ahí, voz.
```

**7 · Checklist del webhook (D09-C, comunidad)**
```
□ ¿Tu proveedor reintenta? Probalo: apagá el webhook, mandate un mensaje, prendelo y esperá.
□ Rescate cada 10 min: último mensaje del cliente sin respuesta nuestra, de entre 3 min y 12 h → volver a meterlo por el mismo webhook, con el mismo id.
□ Filtro de duplicados por id: así reinyectar de más no contesta dos veces.
□ El rescate entra con la misma llave que el proveedor, leída del mismo archivo.
□ Contá «contestado», no «mandado».
□ Firma (Meta: X-Hub-Signature-256 con el secreto de tu app) o secreto largo en la dirección. Sin ninguno configurado → rechazar todo.
```

**8 · Franja para envíos automáticos (D10-A, comunidad)**
```
Regla: ningún envío automático sale fuera de 8:00 a 21:00, en la hora de tu negocio.
- La franja vive en el código o en el flujo (n8n: nodo If con la hora local), no en el horario de la tarea programada.
- Fuera de la franja el mensaje espera y sale a las 8:00; no se descarta.
- Prueba: corré el envío a mano de madrugada (o con la hora simulada). No tiene que salir nada.
- Seguimiento a las 20 h del último mensaje: si te escribieron a las 10:00, saldría a las 6:00. Por eso la franja.
```

**9 · Migrar de Gemini 2.5 en n8n (D10-B, comunidad)**
```
1. Buscá los workflows con el nodo Google Gemini Chat Model en un modelo gemini-2.5-*.
2. Duplicá uno. En la copia: gemini-3.5-flash-lite (el barato) o gemini-3.8-flash.
3. Corré la copia con 10 mensajes reales del historial.
4. Compará: calidad de la respuesta, llamadas a herramientas, tiempo.
5. Si pasa → cambiás el original. Si no → probás el otro modelo.
Fuente: ai.google.dev/gemini-api/docs/changelog (18-sep-2026; sin fecha de apagado).
```

**10 · Lista de exclusión antes de un envío masivo (D11-A, comunidad)**
```
Excluí antes de mandar: tu número y los del equipo · contactos de prueba (nombre con «prueba», «QA», «test») · la bandeja entera de pruebas (las sondas abren chats con nombres al azar) · quien pidió que no le escriban.
Lo excluido no se borra: va a una lista con su motivo.
Prueba: corré el envío en seco y contá cuántos de la lista son tuyos.
```

**11 · Tres pruebas de audio y foto (D11-B, comunidad)**
```
1. Mandale a tu bot un audio en español → el texto que le llegó, ¿está en español?
2. Apagá el transcriptor → ¿entra el respaldo? ¿O el bot pide que escriban? Nunca mudo.
3. Mandale una foto de un producto → la descripción no puede traer precios ni diagnósticos.
Regla: si configurás un respaldo, probá que se usa. Un interruptor que nadie lee no existe.
```

**12 · Cobro por transferencia sin pagos colgados (D11-C, comunidad)**
```
1. El cliente paga por QR o transferencia y sube el comprobante.
2. El pago queda PENDIENTE: el plan no se activa solo.
3. Aviso por cada pago nuevo, en un canal que mirás (no solo correo), con monto y cuánto lleva esperando.
4. Recordatorio diario de los pendientes de más de 24 h.
5. Una persona mira el comprobante y aprueba. Nunca aprobación automática.
```

**13 · Banco de mensajes para tu bot (D12-A, comentá BANCO)**
```
Columnas: mensaje (copiado tal cual: minúsculas, sin tildes, con errores) · datos que dio la persona · qué tiene que hacer el bot · qué hizo · ¿acierto?
Empezá con 20. Incluí: «cuanto sale?» a secas · una respuesta de una palabra · tres datos en un mensaje · un audio transcrito · alguien que pide hablar con una persona · alguien que pide que no le escriban.
Regla: si da 100 %, sumá mensajes que hoy fallen.
Gravedad: inventar un dato o escribirle a quien pidió silencio pesa más que derivar de más a una persona.
```

**14 · Planilla del recorrido (D12-C, comunidad)**
```
Columnas: botón · texto que manda (copiado del celular) · qué debería contestar el bot · qué contestó y en cuánto · a quién le llegó el aviso y cuándo.
Pasos: celular con datos móviles → cada botón → copiar el texto antes de mandar → mandar desde un número que no usás para probar → anotar respuesta y tiempo → seguir hasta la persona que se entera → repetir de noche y un domingo → repetir después de cada cambio.
Cierra solo con tres sí: contestó sobre lo que pidió · a tiempo · una persona se enteró.
```

**15 · Plantilla de hechos del bot (D13-A, comunidad)**
```
{ "version": "2026-10-13.1",
  "horario": "lun-vie 9:00-18:00, sáb 9:00-13:00",
  "direccion": "…",
  "formas_de_pago": ["QR", "transferencia"],
  "faq": [{ "id": "estacionamiento", "texto": "…" }] }
Frontera: si el dato está mal, ¿el bot promete, cotiza o miente? → código, con prueba. ¿Solo queda desactualizado? → este archivo.
Candados: todo o nada · precios solo si coinciden con tu lista oficial · cada texto pasa por el control.
```

**16 · Vigía que avisa por cambio (D13-B, comunidad)**
```
actual   = leer_estado()              # ¿la web responde? ¿el bot contestó en la última hora?
anterior = leer_archivo("estado")
si no pudo leer → avisar «no pude mirar» (nunca «todo bien»)
si actual != anterior → avisar(actual)  # uno al ponerse rojo, uno al recuperarse
guardar_archivo("estado", actual)       # solo si el aviso salió
```

**17 · Tu cliente en cinco preguntas (D13-C, comentá CLIENTE)**
```
1. ¿Cuántos [personas / sucursales / profesionales] tienen? → buscás de __ a __.
2. ¿Quién hace hoy [la tarea que resolvés]? → señal buena: __.
3. ¿Cómo lo llevan hoy? → señal buena: cuaderno, Excel o WhatsApp.
4. ¿Cuántos [clientes] [el problema medible: no volvieron, deben, esperan]? → si no lo sabe, ése es su problema.
5. ¿[Dato de formalidad: NIT, local, empleados]? → confirma que es negocio formal.
Regla: cada respuesta es un número o un sí/no. Nada de adjetivos.
```

---

## Esqueleto de la guía del domingo (`/whatsapp-bot`)

Todavía no existe; nadie la nombra como existente hasta publicarla. Las secciones 8-10 salen
de guiones del lunes 12 y martes 13: se escriben desde el guion, antes de grabar.

1. **App o plataforma:** la app de WhatsApp Business a mano vs. la plataforma oficial; ventana de 24 h y plantillas (D07-A).
2. **Cuánto cuesta desde el 1-oct:** la cuenta con la tabla de Meta y cómo bajarla (D08-C).
3. **Dar de alta la API hablándole a un agente:** el MCP de Meta, en beta y solo para pruebas (D07-B).
4. **Lo que el bot sabe:** datos en un solo lugar; lógica en el código, hechos en un archivo con candados (D07-C, D13-A).
5. **Lo que el bot no puede decir:** dos listas en el prompt y un control después de la IA (D08-A, D07-C).
6. **La puerta:** firma, secreto en la dirección y filtro de duplicados (D09-C, D09-A).
7. **Cuando algo se cae:** rescate de mensajes, vigías que dicen «no pude mirar» y avisan por cambio (D09-C, D10-C, D13-B).
8. **Mensajes automáticos sin molestar:** franja horaria, un solo seguimiento y excluirte a vos mismo (D10-A, D11-A).
9. **Audios, fotos y voz:** transcribir en español, describir fotos con control, responder con voz al final (D11-B, D09-B).
10. **Medir y recorrer:** banco de mensajes y el recorrido entero desde el botón de la web (D12-A, D12-C).

---

## Autocrítica contra las 7 condiciones del brief

| Pieza | 1 Promesa | 2 Unidad | 3 Ejemplo real | 4 Verificación | 5 Por qué | 6 Un cierre | 7 Sin relleno | Nota |
|---|---|---|---|---|---|---|---|---|
| D07-B | ✅ | ✅ comando | ✅ fuente Meta | ✅ listar negocios | ⚠️ | ✅ | ✅ | El «por qué» queda implícito («sin recorrer el panel»); no hay dato verificado de cuánto cuesta el alta manual. Sin prueba propia: el MCP puede no aparecerle a la cuenta de ONIA |
| D07-C | ✅ | ✅ patrón + If | ✅ ONIA | ✅ 62/62 + frases corridas | ✅ | ✅ | ✅ | |
| D08-B | ✅ | ✅ opción exacta | ⚠️ ferretería inventada | ✅ ejecución | ✅ | ✅ | ✅ | ONIA corre 2.35.3: no hay prueba propia; se dice |
| D08-C | ✅ | ✅ fórmula | ✅ fuente Meta | ⚠️ | ✅ | ✅ | ✅ | La verificación es la planilla; no hay tarifa propia por regla |
| D09-A | ✅ | ✅ | ✅ ONIA + Meta | ✅ | ✅ | ✅ | ✅ | |
| D09-B | ✅ | ✅ | ⚠️ fuente Google, sin prueba ONIA | ✅ criterio de escucha | ✅ | ✅ | ✅ | Hay que grabar la prueba en AI Studio; ONIA no tiene voz construida |
| D09-C | ✅ | ✅ | ✅ ONIA | ✅ reinyección en prod | ✅ | ✅ | ✅ | |
| D10-A | ✅ | ✅ | ✅ | ✅ prueba a las 3 | ✅ | ✅ | ✅ | |
| D10-B | ✅ | ✅ | ✅ fuente Google | ✅ 10 mensajes | ✅ | ✅ | ✅ | Sin migración propia de ONIA |
| D10-C | ✅ | ⚠️ revisar alertas | ✅ | ⚠️ | ✅ | ✅ | ✅ | La acción es de autodiagnóstico, no un paso técnico |
| D11-A | ✅ | ✅ | ✅ | ✅ envío en seco | ✅ | ✅ | ✅ | |
| D11-B | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Camino vivo del audio: confirmar antes de grabar |
| D11-C | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | La verificación del espectador queda implícita |
| D12-A | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| D12-B | ✅ | ✅ | ⚠️ sin caso ONIA | ✅ buscar en el export | ✅ | ✅ | ✅ | El caso real (clave publicada) no se cuenta hasta confirmar la rotación |
| D12-C | ✅ | ✅ 7 pasos | ✅ | ✅ tres sí | ✅ | ✅ | ✅ | |
| D13-A | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | |
| D13-B | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | |
| D13-C | ✅ | ✅ | ✅ | ⚠️ | ✅ | ✅ | ✅ | |

**Riesgos que quedan abiertos:**

- **Muchos «comentá»:** hay ocho palabras (HERRAMIENTA, VOZ, GEMINI, AUDIO, COBRO, BANCO, HECHOS,
  CLIENTE). Cada una es un DM a mano. Si es demasiado, pasar AUDIO, GEMINI y HECHOS a «está en la
  comunidad»: los drops ya están escritos.
- **Repetición de conceptos, no de ejemplos:** W-06/W-07/W-09 aparecen en el YouTube del 7 y en
  verticales del 12 y 13, como pide el MAPA. Los ejemplos no se repiten: el horario doble y el
  patrón al revés van solo en el YouTube; los ocho casos que fallaron, solo en D12-A; los candados
  del archivo, solo en D13-A.
- **Días que se cruzan con la semana 1:** el jueves 1 (R1 como noticia) lo escribe otra pieza. D08-C
  es la cuenta, no la noticia. Revisar que S1 no use el ejemplo de la clínica de cuarenta personas.
- **Rescate y firma, estado vivo:** el guion cuenta el rescate como verificado en producción el
  3-sep (commit `6e5d5940`) y la firma como cerrada en julio. La conversación tibia de seis días
  (D12-C) se cuenta como hallazgo, no como arreglo, porque su corrección quedó sin desplegar.

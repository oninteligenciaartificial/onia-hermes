# Auditoría editorial — LOTE C (S2-D07-A → S2-D13-C)

Revisado el 30-sep-2026 contra `plan-3-semanas/BRIEF-ESCRITOR.md`, el repo y lo que se pudo correr.
Ventana de publicación: jue 1-oct → mié 14-oct-2026.

**Qué se pudo verificar y qué no.** Todos los archivos del repo citados existen y se leyeron. Se
volvieron a correr el 30-sep: el banco del bot (`bot/bench.mjs` → 62/62), las evals
(`bot/evals/evals.test.mjs` → 12/12) y el control de frases (`checkGuardrails` con las seis frases
del YouTube del 7). **Las URL externas no se pudieron abrir desde acá**: el proxy bloquea
developers.facebook.com, docs.n8n.io, ai.google.dev, stripe.com y sergiourcullo.vercel.app. Donde
un guion depende de una de esas fuentes queda marcado «no verificado hoy» y se relee el día de grabar.
La web se revisó por su fuente (`hermes-content/sitio-sergiourcullo/`), no en vivo.

Resumen: **PASA 1 · ARREGLADA 19 · DESCARTAR 1.**

---

### S2-D07-A · Vertical · La regla de 24 horas que rompe tu bot de WhatsApp
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** la plantilla de seguimiento aprobada de ONIA en pantalla y el error ciento treinta y un mil cuarenta y siete, que es cómo sabés que te pasó · **Cierre:** comunidad, drop «Mensajes de seguimiento» (falta escribir: en `PRODUCCION-GUIONES-2026-09-29.md` §Drops 6 hay solo una línea que lo describe, sin contenido)
**Cambios:** se agregó la verificación (buscar el error 131047 en los registros); se agregó el ejemplo real (plantilla `seguimiento_demo` y la regla de Meta de no terminar en variable); se agregó el tope de siete días; se juntó el aviso «app vs. plataforma» en una sola línea.
**Evidencia verificada:** `bot/followup-run.mjs` líneas 13-19 y 594-600 (dentro de 24 h texto libre; fuera, plantilla; 131047; pasados 7 días, `conversacion_muerta`) ✔ · `bot/config.mjs` 365-383 (plantilla `seguimiento_demo` aprobada; Meta rechaza plantilla que termina en variable, code 100 / subcode 2388299) ✔.

Si tu bot de WhatsApp le escribe a un cliente que no contesta hace más de veinticuatro horas, ese mensaje no sale.

Es una regla de la plataforma oficial, la que usan los bots. Cuando un cliente te escribe, se abre una ventana de veinticuatro horas. Adentro, respondés lo que quieras. Cuando se cierra, solo podés mandar plantillas: mensajes que Meta aprobó antes.

Cómo sabés que te pasó: buscá en los registros de tu bot el error ciento treinta y un mil cuarenta y siete. Es el de texto libre fuera de la ventana.

Mi bot de ONIA, pasadas las veinticuatro horas, no intenta texto libre: manda la plantilla aprobada que ves en pantalla. Un detalle: Meta rechaza una plantilla que termina en una variable. Por eso la mía cierra con una frase fija. Pasados siete días, no escribe más.

Antes de programar tu seguimiento, mandá tus plantillas a aprobar. En la app de WhatsApp Business, a mano, esta regla no existe.

En la comunidad dejé cómo armo mis seguimientos.

---

### S2-D07-B · Vertical · Ya podés dar de alta la API de WhatsApp hablándole a Claude
**Veredicto:** ARREGLADA (con condición: se graba la conexión real; si el MCP no le aparece a la cuenta de Sergio Urcullo, la pieza se baja) · **Fecha:** libre · **Demuestra:** Claude Code conectado al MCP de Meta listando los negocios de la cuenta, en pantalla · **Cierre:** comunidad, drop 1 (existe, en S2-GUIONES «Drops de la semana»)
**Cambios:** la verificación pasa a ser lo que se ve en pantalla («listá mis negocios»), no una instrucción; se agregó el «por qué importa» que faltaba; «tipo http» → «transporte http» (así se llama la bandera).
**Evidencia verificada:** fuentes de Meta (blog 15-sep y doc del MCP) **no verificadas hoy** (dominio bloqueado); el radar del 29-sep las da como fuente primaria, fila 2 ✔. La dirección `https://mcp.facebook.com/whatsapp_business_tools` del drop 1 no figura en el radar: **confirmarla en la doc de Meta antes de publicar el drop**. Sin prueba propia de ONIA hasta hoy.

Ya podés dar de alta la API oficial de WhatsApp hablándole a Claude, sin el panel de Meta. Salió el quince de septiembre.

Se llama WhatsApp Business Tools MCP. En Claude Code lo conectás con el comando que ves en pantalla: claude mcp add, transporte http, y la dirección que publica Meta.

Después escribís barra mcp, elegís el servidor y entrás con tu cuenta de Meta. No pegás ningún token en el chat.

La primera prueba es la que ves acá: le pido que liste mis negocios. Si los ve, está conectado.

Después le pedís, en español: creá la cuenta, agregá el número, verificalo con el código que me llega, registralo en la API y mandá un mensaje de prueba.

Por qué importa: sin ese alta no hay bot oficial. Ni plantillas, ni seguimiento.

Dos límites de Meta: está en beta y llega de a poco. Y es para pruebas, no para mandar en cantidad.

El paso a paso, con el comando, está en la comunidad.

---

### S2-D07-C · YouTube · Un bot que no inventa: datos en un solo lugar, control después de la IA y medición
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** el control de ONIA corrido en pantalla con cinco frases (cuatro bloqueadas, una pasa) y la plantilla If de n8n · **Cierre:** comunidad, drop 2 (existe)
**Cambios:** se sacó el «sesenta y dos de sesenta y dos» del banco (es el ejemplo de S2-D12-A; no se repite); la capa tres ahora muestra las evals (doce de doce, corridas el 30-sep); se sacó la fecha de la demostración; el resto queda igual.
**Evidencia verificada:** `bot/guardrails.mjs` (normaliza, seis familias, descarta la respuesta entera, sin bandera g, texto seguro probado contra sí mismo, N1 al revés hasta el 3-sep) ✔ · `bot/ventanas-de-atencion.mjs` (horario doble hasta el 13-sep: ofrecía 14:00 y prometía 9:00-18:00) ✔ · corrido hoy: «Bs 999…» → precio, «Soy Sergio, te llamo ahora» → persona, «El 95 %…» → cifra, «Garantizamos…» → promesa, «Te lo confirma una persona» → pasa, «cuesta poco» → precio ✔ · `evals/evals.test.mjs` 12/12 y `checkGuardrails` como juez ✔. Ojo: el patrón del drop 2 **no** bloquea «cuesta poco» (el del bot sí): ver Pendientes.

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

En ONIA hay dos instrumentos. El primero es un banco de casos: mensajes escritos como escribe un dueño de negocio por WhatsApp. Cada caso dice qué tendría que hacer el bot. Y se corre contra la misma función que usa el bot en producción, no contra una copia. Si mañana cambio el bot, la medición cambia con él.

El segundo es usar el control como juez. En las pruebas, cada respuesta que sale pasa por el mismo control de la capa dos. Si alguna dice algo prohibido, la prueba falla. Hoy son doce pruebas, y pasan las doce.

#### Demostración

Lo que ves en pantalla es el control de mi bot, corrido con frases de prueba.

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

### S2-D08-A · Vertical · ¿La IA le promete a tu cliente algo que no confirmaste?
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** las dos respuestas reales de la prueba del 28-sep (sin reglas / con dos listas), en pantalla estilo chat · **Cierre:** comunidad, drop «Bot con dos listas» (existe: `PRODUCCION-GUIONES-2026-09-29.md` §Drops 3 + las dos respuestas de §Prueba 2)
**Cambios:** se agregó la verificación que faltaba (mandarle a tu bot un pedido con fecha); lo demás queda.
**Evidencia verificada:** `PRODUCCION-GUIONES-2026-09-29.md` §Prueba 2: las dos citas coinciden con el texto de las respuestas («no quiero prometerte una fecha que después no te pueda cumplir» · «200 unidades está dentro de lo que trabajamos (hacemos desde 50)») ✔. Negocio de ejemplo dicho una vez ✔. Ojo: el carrusel K6 (13-oct) usa el mismo «confirmado / por confirmar»; es otro formato, pero no conviene que salgan el mismo día.

¿Un bot con IA le promete a tu cliente una entrega que nunca confirmaste? Lo probé.

Armé un negocio de ejemplo: cajas de cartón con logo. Un cliente escribe: «Necesito doscientas cajas para este viernes, ¿me las pueden entregar?».

Primera prueba, sin reglas: «sé amable y tratá de cerrar la venta». Me sorprendió: no prometió. Respondió «no quiero prometerte una fecha que después no te pueda cumplir» y pidió medidas, logo y zona.

Segunda prueba. Le agregué dos listas. Confirmado: fabricamos desde cincuenta unidades. Por confirmar: stock, plazo y precio.

La diferencia: ahora usó el dato real. «Doscientas está dentro de lo que trabajamos, hacemos desde cincuenta». Y dijo exactamente qué iba a confirmar.

La lección no es que la IA inventa. Es que solo sabe lo que vos le das.

Probalo en tu bot: mandale un pedido con fecha. Si la confirma sin tenerla escrita, le faltan dos listas: lo confirmado y lo que siempre se confirma antes.

Las dos respuestas completas están en la comunidad.

---

### S2-D08-B · Vertical · Tu agente de n8n no usa la herramienta: la opción nueva que lo obliga
**Veredicto:** ARREGLADA (con condición: grabar la prueba en un n8n 2.40 de prueba, local o en una copia; si no se graba, se baja: sin eso es leer una nota de versión) · **Fecha:** libre · **Demuestra:** la misma pregunta con la opción apagada y prendida, y la ejecución con la llamada a la herramienta antes del texto · **Cierre:** comunidad, drop 3 (existe)
**Cambios:** se sacó «Yo sigo en una versión anterior y no la toco sin un plan» (es un descargo a cámara y admite que no se probó); se agregó el «por qué importa» (una venta que no podés cumplir); la verificación pasa a verse en pantalla; «un ejemplo» → «pensá en».
**Evidencia verificada:** docs.n8n.io **no verificado hoy** (bloqueado); el radar del 29-sep, fila 9, lo da como fuente primaria (2.40 estable del 15-sep). ONIA corre 2.35.3 (radar fila 9, `MAPA.md` §5) ✔. Aviso: el radar marca 2.41.1 pre-release con «Agents enabled by default»; si sale estable antes de publicar, revisar que la opción siga igual.

Tu agente de n8n tiene una herramienta conectada y contesta de memoria. n8n dos punto cuarenta, del quince de septiembre, trae el arreglo.

En el nodo AI Agent, versión tres, se llama Force Tool Call on First Iteration. Obliga al modelo a llamar una herramienta en su primera respuesta.

n8n dice para qué: modelos chicos que contestan en prosa y se saltean las herramientas.

Pensá en el bot de una ferretería, con una herramienta que consulta el stock. Sin la opción, un modelo barato puede decir «sí, tenemos» sin mirar. Eso es una venta que después no podés cumplir.

Lo que ves en pantalla es la misma pregunta, con la opción apagada y prendida. Cómo lo comprobás: abrí la ejecución. La llamada a la herramienta tiene que aparecer antes del texto.

Dos cuidados. Viene apagada. Y obliga en cada ejecución, aunque el mensaje sea un «hola». Actualizá primero una copia, nunca el n8n que atiende clientes.

El paso a paso está en la comunidad: el link está en mi web.

---

### S2-D08-C · Vertical · Negocio: los mensajes de tu bot que Meta no te cobra
**Veredicto:** ARREGLADA (reescrita: la versión original repetía S1-D02-B) · **Fecha:** libre, pero nunca antes del 2-oct ni el mismo día que S1-D02-B · **Demuestra:** la regla de las setenta y dos horas en la página de precios de Meta, y un hallazgo propio: la bandeja de ONIA descarta de qué anuncio vino cada lead · **Cierre:** comunidad, drop 4 (existe; ya trae la línea de las 72 h)
**Cambios:** la versión original contaba la misma noticia y el mismo método que S1-D02-B (contá mensajes → tarifa → multiplicá → juntá burbujas), con un ejemplo inventado (la clínica de cuarenta personas). Se reescribió sobre lo único que D02-B no dice y que el drop 4 ya traía: la ventana gratis de un anuncio de clic a WhatsApp. Se sumó un caso real de ONIA (Chatwoot descarta el `referral`). Sin tarifa de Bolivia, igual que D02-B.
**Evidencia verificada:** página de precios de Meta **no verificada hoy** (bloqueada). La regla de 72 h está registrada como fuente primaria en `docs/research/ONIA_TENDENCIAS_AGENTES_20260930.md` §3.2 («Se mantiene… [P]») y `docs/research/ONIA_META_ADS_PLAYBOOK_20260930.md` l.180 («si la empresa responde dentro de 24 h, ningún mensaje de la empresa se cobra durante 72 h») ✔ · `bot/chatwoot-adapter.mjs` l.129-133 (Chatwoot 4.12.1 descarta `messages[].referral`, `ctwa_clid`) ✔. **Releer la página de Meta el día de grabar.**

Desde el uno de octubre, cada respuesta de tu bot de WhatsApp se paga. Pero hay una puerta por donde no se paga nada durante tres días.

Está en la página de precios de Meta, la que ves en pantalla. Si alguien te escribe desde un anuncio de clic a WhatsApp, y le contestás dentro de las veinticuatro horas, durante setenta y dos horas no se te cobra ningún mensaje.

Dos condiciones. Una: contestar rápido. Si tardás más de un día, esa ventana se pierde. Dos: es para la plataforma oficial, la de los bots.

Contá cuántos mensajes le mandás a un cliente nuevo en sus primeros tres días. Si entró por un anuncio, no los pagás. Si llegó por otro lado, sí.

Un error que encontré en mi sistema: la bandeja que uso en el medio borra de qué anuncio vino cada persona. No sabés qué anuncio te trajo al cliente. Fijate que la tuya lo guarde.

La planilla para hacer tu cuenta está en la comunidad.

---

### S2-D09-A · Vertical · Por qué tu bot contesta dos veces lo mismo
**Veredicto:** ARREGLADA · **Fecha:** libre (no el mismo día que S2-D09-C, que también usa el filtro de duplicados) · **Demuestra:** el mismo aviso mandado dos veces y una sola respuesta · **Cierre:** comunidad, drop 5 (existe)
**Cambios:** se aclaró que en ONIA el que reenvía el aviso es la bandeja del medio, no Meta directo (así lo dice el código); lo demás queda.
**Evidencia verificada:** `bot/message-dedup.mjs` (ventana de 10 min en memoria, dedup durable en base con clave única, los dos en ese orden, `releaseMessage`; «Chatwoot reintrega el MISMO `message_created` ante una respuesta no-2xx o un timeout») ✔ · doc de webhooks de Meta (reintentos pueden duplicar) **no verificada hoy**.

Si tu bot a veces contesta dos veces lo mismo, no es la IA. Es el aviso, que le llegó dos veces.

Cuando entra un mensaje, a tu servidor le llega un aviso, y el que lo manda espera un «recibido». Si tu servidor tarda o falla, lo vuelve a mandar; Meta avisa que eso puede duplicar. En mi caso reenvía la bandeja del medio. Y el bot contesta otra vez.

El arreglo: cada mensaje trae un identificador único. En mi bot de ONIA hay dos filtros por ese identificador, en este orden. Primero, uno en memoria: si lo vio en los últimos diez minutos, lo descarta. Después, uno en la base de datos, con el identificador como clave única: ese sobrevive a un reinicio.

Un detalle: si el turno falla antes de contestar, se suelta el identificador. Si no, el reintento bueno también se descarta.

Para probarlo, mandá el mismo aviso dos veces. Tiene que salir una sola respuesta.

La receta de los dos filtros está en la comunidad.

---

### S2-D09-B · Vertical · Ponele voz a tu bot: los modelos nuevos de Google
**Veredicto:** ARREGLADA (con condición: grabar la prueba en AI Studio antes y que se escuche el audio en el video; si ninguna voz suena natural, se dice eso o se baja). Es la primera candidata a salir del lote si hay que aflojar el tema bot (ver Pendientes) · **Fecha:** libre · **Demuestra:** la misma respuesta del negocio en dos voces, escuchadas en el video · **Cierre:** comunidad, drop 6 (existe)
**Cambios:** se sacó «más rápida y barata» (no está verificado); la prueba propia pasa a escucharse en el video; «comando en pantalla» → «el comando está en pantalla».
**Evidencia verificada:** changelog y doc de voz de Google, y doc de notas de voz de Meta (OGG con Opus): **no verificados hoy** (bloqueados); el radar del 29-sep, fila 11, los da como fuente primaria ✔. `ffmpeg -i respuesta.wav -c:a libopus respuesta.ogg` es un comando válido ✔. ONIA no tiene voz construida (`MAPA.md` §5) ✔.

Tu bot de WhatsApp puede contestar con una nota de voz. El veintidós de septiembre Google sacó dos modelos de voz: Gemini tres punto ocho Flash TTS y su versión Lite. Hablan español y aceptan un estilo.

Antes de programar, probalo en AI Studio, en la dirección que ves en pantalla. Pegá la respuesta que más manda tu negocio, por ejemplo cómo llegar. Probá dos voces y pedí un estilo: tranquila y amable.

Escuchá las dos con mi respuesta.

El criterio es uno: ¿la mandarías como nota de voz a un cliente? Si suena a contestador, no.

Para usarla, dos cosas. Una: el audio sale en WAV, y WhatsApp quiere OGG con Opus para la nota de voz. Se convierte con ffmpeg: comando en pantalla.

Dos: la voz va al final. Primero el texto pasa por tus controles, y recién después se convierte en audio. Un precio inventado dicho con voz amable sigue siendo inventado.

El paso a paso está en la comunidad: el link está en mi web.

---

### S2-D09-C · YouTube · El mensaje que se perdía: webhook caído, rescate y firma
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** la línea de tiempo real del 3-sep segundo por segundo y la reinyección en producción que el webhook devolvió como duplicado · **Cierre:** comunidad, drop 7 (existe)
**Cambios:** se sacó «que cerramos a fines de julio»: esa fecha no se pudo verificar (la historia de git del archivo empieza el 21-sep). Lo demás queda.
**Evidencia verificada:** `bot/rescate-run.mjs` cabecera (00:03:32 reinicio, 00:03:52 mensaje, 00:04:01 vigía, 00:04:08 el siguiente; 20 reinicios 28-ago → 3-sep; 3 min / 12 h; seco por defecto; `handoff_humano` como única excepción) ✔ · commit `6e5d5940` (401, contador falso, reinyección en producción devuelta como duplicado) ✔ · `onia-rescate-mensaje-perdido.sh` (cron cada 10 min, encendido según `cola/chatbot.md` l.9044) ✔ · `bot/webhook-security.mjs` (HMAC con hora, 5 min, secreto en la ruta, 503 sin secreto; el código de partida aceptaba todo) ✔ · doc de Meta `X-Hub-Signature-256` **no verificada hoy**. Seguridad: no se dicen IP, puerto, número de conversación ni la URL del webhook ✔.

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

La misma puerta tenía otro problema, que ya cerramos. El webhook no verificaba quién le hablaba. Cualquiera que conociera la dirección podía mandar un aviso armado a mano, y el bot le escribía a una persona real lo que ese aviso dijera.

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

### S2-D10-A · Vertical · Tu bot no le tiene que escribir a nadie a las seis de la mañana
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** la cuenta de las veinte horas y la prueba que falla si un barrido no consulta la franja · **Cierre:** comunidad, drop 8 (existe)
**Cambios:** «Corrido a mano a las tres de la mañana, mandaba» decía que pasó; el archivo dice que *mandaría* si alguien lo corría a mano: se corrigió a condicional. Se agregó la verificación para el espectador (correrlo de madrugada o con la hora simulada). «Sale a las ocho» → «sale en el primer barrido de la mañana» (así lo dice el código).
**Evidencia verificada:** `bot/config.mjs` (`afterHours: 20`, `HORA_SILENCIOSA_DESDE = 8`, `HASTA = 21`, La Paz) ✔ · `bot/barridos-no-escriben-de-madrugada.test.mjs` (el comentario del arreglo del 17-sep absolvía a `insistencia` por su cron; «medido hoy, `insistencia-run.mjs` no llama a `localHour` ni una vez»; «a las 3 de la mañana manda») ✔.

Mi bot de ONIA manda un seguimiento veinte horas después del último mensaje del cliente. El que escribe a las diez de la mañana lo recibe a las seis.

Por eso todo envío automático pasa por una franja: de ocho de la mañana a nueve de la noche, hora de Bolivia. Fuera de eso, espera al primer barrido de la mañana.

La regla: la franja va en el código, no en el horario de la tarea programada. Al arreglar un barrido, el comentario decía que otro estaba protegido por el horario de su tarea. Lo medimos: no revisaba la hora ni una vez. Corrido a mano a las tres de la mañana, habría mandado.

Ahora una prueba falla si algún barrido que manda mensajes no consulta la franja.

Probá el tuyo: corrélo de madrugada, o con la hora simulada. No tiene que salir nada.

Un mensaje de madrugada molesta, y si te bloquean, baja la calidad de tu número.

La regla escrita está en la comunidad.

---

### S2-D10-B · Vertical · Si tu automatización usa Gemini 2.5, migrala con calma
**Veredicto:** DESCARTAR · **Fecha:** — · **Demuestra:** nada propio: ONIA no usa Gemini 2.5 y no hay migración que mostrar · **Cierre:** comunidad, drop 9 (existe, pero no hace falta publicarlo)
**Cambios:** se baja. Razones: (1) no demuestra nada: ONIA no tiene un flujo con Gemini, así que la pieza es leer un changelog en voz alta, justo lo que Sergio Urcullo pidió que no pase; (2) no hay urgencia: la propia fuente dice que no hay fecha de apagado; (3) el método (duplicar, correr diez mensajes reales, comparar) ya lo enseñan S2-D12-A (banco de mensajes) y S2-D08-B (probar en una copia); (4) el lote tiene doce piezas de bots de WhatsApp en siete días y ésta es la más débil. Si Sergio Urcullo tiene un flujo propio con Gemini 2.5 y graba la migración real, vuelve.
**Evidencia verificada:** changelog de Google **no verificado hoy** (bloqueado); radar del 29-sep fila 10 ✔. Nada de ONIA que lo respalde (`MAPA.md` §4: «Sin migración propia de ONIA»).

(No se graba.)

---

### S2-D10-C · Vertical · Historia: el vigía que mandó el mismo aviso vacío durante cuarenta y un días
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** el aviso real con el número en blanco y la línea del script que tiraba el error a la basura, en pantalla · **Cierre:** comunidad («contame cuál encontraste»: no necesita recurso)
**Cambios:** la acción era un autodiagnóstico vago («revisá tus alertas»); ahora es concreta y repetible: buscar dónde se tira el error a la basura (en pantalla, `2>/dev/null`) y romper a propósito lo que mira la alerta. «Como sin crédito» → «la frase exacta que devuelve el proveedor» (los patrones reales están en inglés).
**Evidencia verificada:** `hermes-content/deploy/vps-ops/security-watch.sh` (ciego ~41 días; contenedor inexistente; `sql()` tiraba el error a `/dev/null`; «Hay  tablas SIN RLS» con el número vacío; reescrito 24-sep; «No pude mirar nunca más sale con cara de está todo bien») ✔ · `vigia-credito-ia.sh` (9 al 17-sep sin crédito, 194 llamadas fallidas, el bot cayó al texto fijo; busca frases del proveedor en los registros) ✔. Seguridad: no se dice qué miraba el vigía (tablas expuestas) ✔, bien hecho en el original.

Tenía un vigía que cada mañana me mandaba un resumen. Unos cuarenta y un días no miró nada.

Apuntaba a un contenedor que ya no existía. El error se tiraba a la basura, así que el mensaje salía igual, con el número en blanco. Nadie lo leía: siempre decía lo mismo.

En esas semanas pasó otra. Del nueve al diecisiete de septiembre, el proveedor de IA se quedó sin crédito. Fallaron ciento noventa y cuatro llamadas y el bot contestó con su texto fijo. Nadie vio un error: se vieron respuestas peores.

Dos reglas. Una: si el vigía no pudo mirar, lo dice. «No pude mirar» nunca sale con cara de «todo bien». Dos: busca en los registros la frase exacta del error del proveedor, en vez de esperar una queja.

Hoy, buscá en tus alertas dónde mandás el error a la basura: en pantalla ves cómo se escribe. Y rompé a propósito lo que mira cada alerta. Si te llega «todo bien», está ciega.

Contame en la comunidad cuál encontraste.

---

### S2-D11-A · Vertical · Antes de mandar mensajes automáticos, sacate a vos de la lista
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** la cuenta real del 18-sep: tres destinatarios, dos propios (contada, sin mostrar el archivo) · **Cierre:** comunidad, drop 10 (existe)
**Cambios:** se agregó la verificación que el drop tenía y el guion no (envío en seco, contar cuántos son tuyos); se recortó una frase para no pasar el largo.
**Evidencia verificada:** `bot/es-nuestra.mjs` (18-sep: de tres filas, dos propias —la sonda del widget cada 30 min y una fila sintética de QA—; 19-sep: la bandeja de pruebas se marca entera porque las sondas abren chats con nombres al azar; lo salteado va a `skipped[]` con motivo; «en WhatsApp lo cobra Meta») ✔. Seguridad: el archivo tiene números reales; el guion no los dice y la nota del editor prohíbe mostrarlo ✔.

El dieciocho de septiembre, antes de prender los mensajes automáticos de mi bot, miré a quién les iba a escribir. Eran tres. Dos eran míos.

Uno era una sonda: un chat que mi sistema abre cada media hora para ver si el bot contesta. El otro, una fila de prueba cargada a mano. Persona real, una sola.

Los barridos elegían a quién escribirle por etapa y por tiempo sin respuesta. Nunca por quién era.

El arreglo tiene dos partes. Una: una lista de lo que es tuyo. Tu número, tus contactos de prueba y la bandeja entera de pruebas, porque las sondas abren chats con nombres al azar. Dos: lo que se saltea queda en una lista con su motivo, para que un error se vea.

Probalo: corré el envío en seco, sin mandar nada, y contá cuántos de la lista son tuyos.

Por qué importa: en la plataforma de WhatsApp, cada mensaje que te mandás a vos mismo se paga.

La lista de exclusión está en la comunidad.

---

### S2-D11-B · Vertical · Tu bot tiene que entender audios (y dos trampas que pagué)
**Veredicto:** ARREGLADA (con condición: antes de grabar, mandarle un audio de prueba al WhatsApp de ONIA y confirmar que se transcribe; `MAPA.md` §5 dice que los registros no muestran ningún audio en diez días y el inventario W-08 dice que hoy va por OpenAI directo. Si no transcribe, la frase «en mi bot el audio se transcribe» no se puede decir y la pieza se baja) · **Fecha:** libre · **Demuestra:** un audio real mandado al bot y el texto que le llegó · **Cierre:** comunidad, drop 11 (existe)
**Cambios:** «una parte enorme del WhatsApp son audios» → sin cifra implícita; se agregó la verificación con su diagnóstico («si está en inglés, es el modelo»); se agregó por qué el respaldo que nadie lee es peor.
**Evidencia verificada:** `bot/audio-transcribe.mjs` (los `faster-distil-*` son solo inglés y traducen en vez de transcribir; modelo fijado y `language` en `es`; 19-sep Speaches desapareció y el respaldo configurado no lo leía ninguna línea) ✔ · `bot/vision.mjs` l.3 (US$ 0,0007 por foto = menos de un décimo de centavo) ✔. Seguridad: grabar con audio propio, nunca de un prospecto (inventario W-08).

Mucha gente en WhatsApp no escribe: manda audios. Si tu bot no los entiende, le pide al cliente que escriba lo que acaba de decir. Así se pierde gente.

En mi bot de ONIA, el audio se transcribe y entra al mismo guion, como si lo hubieran escrito.

El paso crítico es el modelo. Algunos solo saben inglés: tu audio en español no lo transcriben, lo traducen. Por eso el modelo va fijado, uno multilenguaje, con el idioma en español.

Segunda trampa: el diecinueve de septiembre, el transcriptor desapareció del servidor. Había un respaldo configurado, y ninguna línea de código lo leía. Creés que tenés red y no la tenés.

Las fotos las describe un modelo barato: menos de un décimo de centavo de dólar cada una, medido en agosto. Y esa descripción pasa por los controles.

Probalo: mandale un audio a tu bot y mirá qué texto le llegó. Si está en inglés, es el modelo.

Las tres pruebas están en la comunidad: el link está en mi web.

---

### S2-D11-C · Vertical · Negocio: cómo cobra una empresa de software desde Bolivia sin Stripe
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** la página de países de Stripe sin Bolivia, y el aviso del vigía de comprobantes (con datos tapados) · **Cierre:** comunidad, drop 12 (existe)
**Cambios:** se agregó la verificación que faltaba (subir un comprobante de prueba y medir cuánto tarda el aviso); «QR bancario» → «QR bancario o transferencia» (así lo dice el drop); se sacó «mi agente probó el cobro el diez de septiembre» para no pasar el largo (queda en la evidencia).
**Evidencia verificada:** stripe.com/global **no verificado hoy** (bloqueado); consta leído el 29-sep en S2-GUIONES ✔ · `hermes-content/deploy/vps-ops/vigia-comprobantes.sh` (24-sep; un solo correo; cron cada 10 min; aviso con monto y espera; recordatorio diario de pendientes de más de 24 h; nunca aprueba) ✔, instalado por `scripts/loops/sincronizar.sh` l.416 ✔ · `docs/handoff/cobro-e2e.md` (cobro probado E2E el 10-sep) ✔. Seguridad: el handoff nombra banco y titular de la cuenta; el guion no ✔ (la nota del editor prohíbe mostrarlos).

Si vendés software desde Bolivia, olvidate de Stripe. Lo revisé el veintinueve de septiembre en su página de países: Bolivia no está.

Así cobra ONIA: el cliente paga con QR o transferencia y sube el comprobante. El pago queda pendiente hasta que una persona lo aprueba.

El problema: al subir el comprobante, el sistema mandaba un solo correo. Si se perdía entre otros, alguien que ya pagó se quedaba sin su plan, y nadie se enteraba.

Así que desde el veinticuatro de septiembre hay un vigía. Cada diez minutos avisa de cada pago nuevo, con el monto y cuánto lleva esperando. Y una vez al día recuerda los que llevan más de veinticuatro horas.

No aprueba solo: aprobar sin mirar el comprobante es regalar el plan.

Probalo en el tuyo: subí un comprobante de prueba y medí cuánto tarda en llegarte el aviso. Si depende de que abras el correo, te falta el vigía.

Los cinco pasos están en la comunidad: el link está en mi web.

---

### S2-D12-A · Vertical · ¿Tu bot mejoró o te parece? Medilo con un banco de mensajes
**Veredicto:** PASA · **Fecha:** libre · **Demuestra:** el banco corrido en pantalla con sesenta y dos de sesenta y dos, y los mensajes que fallaron al escribirse · **Cierre:** comentá BANCO (drop 13, escrito)
**Cambios:** ninguno. (Para que el ejemplo no se repita, se sacó el 62/62 del YouTube S2-D07-C.)
**Evidencia verificada:** `bot/bench.mjs` corrido el 30-sep → «ACIERTOS: 62/62 (100.0%)» ✔ · `bot/bench-cases.mjs` cabecera (ocho casos fallaron al escribirse; «hablo con una persona?» contado como equipo de una persona; «somos 25 obreros» sin tamaño; «un banco que da 100% no encontró nada»; cada uno se arregló en el bot, nunca aflojando el caso) ✔. Recontar el día de grabar: si ya no da 62, se dice el número nuevo.

¿Tu bot mejoró, o te parece? Sin un número, es opinión.

En ONIA tengo un banco de sesenta y dos mensajes, escritos como escribe un dueño de negocio por WhatsApp: en minúscula, sin tildes, con errores. Cada uno dice qué datos dio la persona y qué tendría que hacer el bot. Y se corre contra la misma función del bot en producción.

Lo corrí el veintinueve de septiembre: sesenta y dos de sesenta y dos.

Pero lo valioso fue cuando fallaba. Ocho mensajes fallaron al escribirlos. «¿Hablo con una persona?» lo contaba como un equipo de una persona. «Somos veinticinco obreros» no lo leía como tamaño. Cada uno se arregló en el bot, nunca aflojando la prueba.

Dos reglas. Un banco que da cien por ciento no encontró nada: sumá mensajes que hoy fallen. Y no todo fallo pesa igual: inventar un dato es peor que derivar de más a una persona.

Armá el tuyo con veinte mensajes reales de tu chat.

Comentá BANCO y te paso la plantilla.

---

### S2-D12-B · Vertical · n8n: la clave de API no va escrita en el nodo
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** un export de n8n con la clave en el encabezado de un nodo HTTP (de prueba, inventada) y el `grep` que la encuentra · **Cierre:** web `sergiourcullo.vercel.app/stack` (existe en la fuente del sitio: sección n8n con el `docker run`; en vivo no verificable desde acá)
**Cambios:** se sumó el caso real de ONIA que faltaba (condición 3): el escaneo de agosto encontró siete workflows con claves adentro de los nodos, nacidas de una instrucción propia equivocada. Sin proveedor, sin repo y sin el incidente de la clave publicada, como pide el inventario (W-11).
**Evidencia verificada:** `docs/ONIA_INFRA_LIMPIEZA_Y_ORDEN.md` §4.4 («SECRETOS HARDCODEADOS EN 7 WORKFLOWS», scan del export del 20-ago) ✔ · `docs/ONIA_PLAN_ORDENAMIENTO.md` l.158 (la skill decía «`$env` NO existe», «el consejo que produjo 7 workflows con claves adentro») ✔ · `docs/handoff/chatbot.md` l.71-74 (29-ago: saneado, 0 secretos en 87 workflows) ✔ · docs de export de n8n **no verificadas hoy** (bloqueado) · la regla n8n de `~/.claude/CLAUDE.md` no existe en este entorno: no verificada.

Si pegaste una clave de API adentro de un nodo de n8n, esa clave viaja en cada exportación del workflow.

Me pasó. En agosto revisé la exportación de mi n8n: siete workflows tenían claves adentro de los nodos. Venían de una instrucción mía equivocada: decía que n8n no leía variables de entorno.

El export lleva lo que escribiste en los nodos; de las credenciales, solo el nombre. La trampa típica: pegás un comando curl en el nodo HTTP Request, n8n lo convierte, y la clave queda escrita en un encabezado.

El orden: primero, una credencial de n8n. Si la API pide la clave en un encabezado, es una credencial Header Auth. Segundo, una variable de entorno del servidor. Nunca: la clave escrita en el nodo.

Probalo hoy: exportá tus workflows y buscá cómo empiezan tus claves, por ejemplo «Bearer». Si aparece una, pasala a una credencial y cambiá esa clave en el proveedor.

¿No tenés n8n en tu servidor? La guía está en mi web, en stack.

---

### S2-D12-C · YouTube · Probá el recorrido entero: del botón de tu web a lo que contesta el bot
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** la planilla del recorrido llenada con el caso real del formulario, con el «no» en la primera columna · **Cierre:** comunidad, drop 14 (existe)
**Cambios:** se sacó la fecha «diecisiete de septiembre» del primer hallazgo: sale de una memoria que no está en el repo, y el archivo de pruebas dice que ese mismo caso se midió el 24-sep. Sin fecha el relato es igual de cierto. Lo demás queda.
**Evidencia verificada:** `bot/campanas-web.test.mjs` (el mensaje del configurador entraba como `pregunta_precio` y el bot contestaba los planes del sistema, «otro producto»; nueve campañas verdes y cero vivas; el archivo que ningún deploy copiaba; 24 días esperando una copia a mano; la prueba lee las frases del código de la web; campaña de prefijo sobre la primera línea; «lo que este gate sigue SIN probar: que el deploy haya CORRIDO») ✔ · commit `055713e4` (24-sep: conversación tibia seis días sin aviso) ✔ · memoria `web-lead-bot-lo-trata-como-pregunta-precio.md` **no está en este entorno**: no verificada. Seguridad: el commit trae un teléfono y un número de conversación; el guion no los dice ✔.

#### El caso

Tenía una web con un formulario. La persona arma su pedido, toca un botón, y se le abre WhatsApp con el pedido ya escrito. Del otro lado, mi bot.

Cada pieza funcionaba. La web abría WhatsApp con el texto correcto. El bot contestaba. Todo en verde.

Un día, mi agente hizo lo que nadie había hecho: siguió el camino entero, con el mismo mensaje que manda la web.

El bot leyó el pedido como una pregunta de precio, y le contestó con la oferta de otro producto: el sistema de gestión, con su demo. Ni una palabra de lo que la persona había pedido.

En este video te muestro por qué pasan estas cosas, lo que encontramos después, que fue peor, y el recorrido que tenés que hacer en tu negocio antes de mandar a nadie a tu web.

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

Lo que ves en pantalla es la planilla llenada con el caso del formulario. Botón: el del formulario. Texto que manda: el pedido completo, con los datos de la persona. Qué debería contestar el bot: algo sobre ese pedido. Qué contestó: la oferta de otro producto. Esa fila tiene un no en la primera columna que importa, y con uno alcanza. Todo lo demás estaba en verde.

#### El error común

El error común es confiar en que cada parte se probó por separado. La web la probó el que hizo la web. El bot lo probó el que hizo el bot. Y el cliente es el único que recorre el camino entero. No dejes que sea el primero.

#### Cierre

La planilla del recorrido, con las cinco columnas y los siete pasos, está en la comunidad de WhatsApp. Hacelo esta semana con tu web, y contame qué encontraste.

---

### S2-D13-A · Vertical · Cambiar un dato de tu bot no debería necesitar un programador
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** el archivo de hechos de ejemplo (`knowledge.example.json`) y un cambio que el bot repite a los cinco minutos; una línea mala que el archivo rechaza entero · **Cierre:** comunidad, drop 15 (existe; cambiar su `"version": "2026-10-13.1"` por un valor sin fecha)
**Cambios:** el ejemplo y la prueba («cambiá el horario y preguntale al bot») repetían la capa uno del YouTube S2-D07-C; ahora el ejemplo son las preguntas frecuentes y la prueba suma la mitad que faltaba: meter una línea mala a propósito. Título ajustado.
**Evidencia verificada:** `bot/knowledge.mjs` (frontera lógica/hecho; todo o nada; `DEFAULT_TTL_MS = 300_000`; todo string pasa por `checkGuardrails()`; precios solo por la puerta de precios públicos de `guardrails.mjs`) ✔ · `bot/knowledge.example.json` existe ✔.

¿Cambiar una respuesta de tu bot te obliga a llamar al programador? Ese dato está en el lugar equivocado.

Uso una pregunta: si este dato está mal, ¿el bot promete, cotiza o miente? Es lógica: va en el código, con pruebas. ¿O solo queda desactualizado? Es un hecho: va en un archivo que se edita sin tocar código.

Las preguntas frecuentes, la dirección, cuánto dura una demo: son hechos. En mi bot se editan desde el panel, y el bot los relee cada cinco minutos, sin reiniciar nada.

Con tres candados. Uno: todo o nada. Si una línea está mal, se rechaza el archivo entero y el bot sigue con lo anterior. Dos: un precio solo pasa si coincide con la lista oficial. Tres: cada texto pasa por los controles de la IA.

La prueba: cambiá una pregunta frecuente y preguntale al bot a los cinco minutos. Después meté una línea mala: tiene que seguir con lo anterior.

La plantilla está en la comunidad: el link está en mi web.

---

### S2-D13-B · Vertical · Una alerta que te avisa treinta veces lo mismo ya no te avisa
**Veredicto:** ARREGLADA (reescrita con otro ejemplo) · **Fecha:** libre · **Demuestra:** el aviso rojo y el verde del vigía del disco, y las tres líneas del esquema · **Cierre:** comunidad, drop 16 (existe)
**Cambios:** el ejemplo original (CI roto el 6-sep, enterados diez minutos después, veinte vigías y ninguno miraba el CI) es **el mismo** que cuenta el YouTube S3-D19-C (19-oct, «Regla cuatro»). Se cambió por el vigía del disco, que enseña la misma regla con un caso propio que no se usa en otra pieza. Se agregó la verificación (forzar el problema dos veces → un solo aviso).
**Evidencia verificada:** `scripts/loops/vigia-disco.sh` (2-sep: disco al 90 % con 20 GB libres; ahí viven las webs, la base y n8n: «se caen los tres juntos»; nadie lo miraba; umbral 88 %; un aviso por incidente con marca en archivo; aviso de recuperación; «no borra nada solo») ✔, instalado por `sincronizar.sh` l.357 ✔ · S3-GUIONES l.511-513 usa el caso del CI ✔ (por eso se cambió).

Si tu alerta te manda el mismo mensaje treinta veces, el treinta y uno no lo leés.

El dos de septiembre medimos el disco de mi servidor: noventa por ciento usado. Ahí viven mis webs, la base de datos y n8n. Si se llena, se caen los tres juntos. Y nadie lo miraba.

El vigía que armamos es tonto a propósito. Cada vez que corre, mide. Si pasa del ochenta y ocho por ciento, avisa una vez y deja una marca en un archivo. Mientras la marca exista, se calla. Cuando baja, avisa que se recuperó y borra la marca. Y no borra nada del disco solo: borrar sin que nadie mire es como se pierden cosas.

Sirve para todo: tu web, tu bot, tu disco. Son las tres líneas que ves en pantalla. Leé el estado. Si es distinto del guardado, avisá. Guardá el nuevo.

Probalo: forzá el problema dos veces seguidas. Te tiene que llegar un solo aviso.

El esquema del vigía está en la comunidad.

---

### S2-D13-C · Vertical · Negocio: definí a tu cliente con cinco preguntas, no con adjetivos
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** las cinco preguntas reales de ONIA y el mensaje del lead que las originó (parafraseado, sin nombre) · **Cierre:** comentá CLIENTE (drop 17, escrito)
**Cambios:** «ONIA trabaja con cinco rubros» era falso (el CLAUDE.md dice siete; el MAPA, dental primero): se sacó la cifra. «Casi nadie la puede contestar» es una afirmación sin medir (cero clientes): se sacó y queda lo verificable («si no la sabe, acaba de nombrar su problema»). Se agregó la verificación.
**Evidencia verificada:** `hermes-content/docs/ONIA_CLIENTE_IDEAL.md` §2 (criterios con número, «se contestan en dos minutos») y §9 (las cinco preguntas; «la pregunta 4 es la que vende») ✔ · §3 (el lead del 25-ago pidió identificar pacientes con tratamiento empezado que no volvieron) ✔ · `bot/bench-cases.mjs` (orden del embudo: los datos se piden con la demo ya reservada) ✔. Seguridad: no se nombran clínicas ni la conversación ✔.

«Mi cliente son las pymes» no es una definición. Es un adjetivo. En ONIA salimos a vender primero a clínicas, y así definimos ese cliente: con preguntas que se contestan con un número, en dos minutos.

Uno: ¿cuántos profesionales atienden? Buscamos de dos a seis.

Dos: ¿quién agenda las citas? Si hay recepción, el volumen ya no cabe en la cabeza del dueño.

Tres: ¿cómo llevan hoy la agenda? Cuaderno, Excel o WhatsApp es la señal buena.

Cuatro: ¿cuántos pacientes empezaron un tratamiento y no volvieron?

Cinco: ¿facturan con NIT?

La cuatro es la que vende. El que no la sabe acaba de nombrar su problema. No la inventamos: una clínica que nos escribió pedía exactamente eso.

Y el orden importa. Mi bot pregunta sus datos después de ofrecer la demo, no antes. Las preguntas no son un peaje.

Hacé las tuyas: cinco preguntas con número, y una que tu cliente no sepa contestar. Si alguna se contesta con un adjetivo, reescribila.

Comentá CLIENTE y te paso la plantilla.

---

## Pendientes del lote

**Recursos que faltan o hay que corregir antes de publicar**

1. **Drop «Mensajes de seguimiento» (S2-D07-A): no está escrito.** En `PRODUCCION-GUIONES-2026-09-29.md` §Drops 6 hay una línea que lo describe y nada más. Propuesta, con material real de `bot/config.mjs`: (a) dentro de las 24 h, texto libre; fuera, plantilla aprobada; pasados 7 días, no se escribe; (b) la plantilla de ONIA `seguimiento_demo` como modelo, sin la marca; (c) Meta rechaza una plantilla que termina en variable: cerrar con una frase fija; (d) elegir bien la categoría: la de marketing cuesta varias veces más que la de utilidad (el `config.mjs` anota unas 6,5 veces con la tarifa de julio; recontar); (e) cómo encontrar el error 131047 en los registros.
2. **Drop 2 (S2-D07-C):** el patrón de precios del drop no bloquea «cuesta poco», y el video dice que el control de ONIA sí (probado el 30-sep). Sumar una línea al drop: `|\bcuesta\b` como opcional, o decir que es la versión mínima.
3. **Drop 1 (S2-D07-B):** confirmar en la doc de Meta la dirección `https://mcp.facebook.com/whatsapp_business_tools` antes de publicarla. El radar no la trae.
4. **Drop 15 (S2-D13-A):** `"version": "2026-10-13.1"` está atado a una fecha: cambiarlo por `"AAAA-MM-DD.1"`.
5. **Drop 9 (Gemini):** no publicar, porque la pieza se descarta.
6. **Guía `/whatsapp-bot`: no existe.** No está en `hermes-content/sitio-sergiourcullo/` (hay `/claude-code`, `/stack`, `/vps`, `/homelab`). Ninguna pieza de este lote la nombra, y está bien así. S2-D12-B cierra en `/stack`, que sí tiene la sección n8n. Si la guía se publica, la sección 9 del esqueleto pierde a D10-B.
7. **La comunidad no da abasto con este calendario.** El aviso de vuelta del 1-oct (`drops/2026-10-01.md`) promete publicar **lunes, miércoles y viernes a las 19:00**, y este lote cierra en la comunidad **17 veces en 7 días**. Hay dos salidas: (a) juntar los drops de cada día en el post de lun/mié/vie más cercano, antes del video, con un título por pieza; (b) publicar los drops de la semana en un solo post el lunes y que cada video diga «está en la comunidad» sin prometer día. En ninguno de los dos casos hay que cambiar nada de lo que se dice a cámara.
8. **«Comentá PALABRA»: hoy quedan dos (BANCO y CLIENTE), no ocho.** La autocrítica de S2-GUIONES quedó vieja: HERRAMIENTA, VOZ, GEMINI, AUDIO, COBRO y HECHOS ya dicen «está en la comunidad» en el texto. Dos por semana cumple la regla del motor semanal. No hay nada que mover.

**Condiciones antes de grabar (si no se cumplen, la pieza se baja)**

- S2-D07-B: conectar el MCP de Meta y grabar «listá mis negocios». Si no aparece, se baja.
- S2-D08-B: levantar un n8n 2.40 de prueba y grabar la opción apagada y prendida. ONIA corre 2.35.3.
- S2-D09-B: grabar las dos voces en AI Studio.
- S2-D11-B: mandarle un audio propio al WhatsApp de ONIA y confirmar que se transcribe (los registros no muestran audios en diez días; el camino vivo podría ser OpenAI directo).
- S2-D08-C: releer la regla de las 72 h en la página de precios de Meta el día de grabar.
- S2-D12-A: volver a correr `node hermes-content/deploy/vps-ops/bot/bench.mjs` y decir el número que dé.
- Todas las URL externas del lote quedaron **sin verificar hoy** (el proxy las bloquea). Constan leídas el 29-sep en S2-GUIONES y en el radar.

**Repetición y fechas**

- S1-D02-B (1-oct) y el S2-D08-C original eran la misma pieza: la misma noticia y la misma cuenta. Ya se reescribió D08-C (ventana gratis de un anuncio + atribución perdida). Aun así, que no salgan el mismo día ni seguidas.
- El 62/62 del banco aparecía en S2-D07-C y en S2-D12-A: quedó solo en D12-A.
- El caso del CI del 6-sep estaba en S2-D13-B y en S3-D19-C: D13-B pasó al caso del disco.
- Mismo día, mismo concepto: S2-D09-A y S2-D09-C usan el filtro de duplicados. S2-D08-A y el carrusel K6 usan «confirmado / por confirmar». Conviene separarlos al menos un día.
- Ninguna pieza del lote queda atada a una fecha, salvo S2-D08-C: no puede salir antes del 2-oct.

**Mezcla de temas (lo más grave del lote)**

De las 20 piezas que quedan, **16 son de bots de WhatsApp**. Solo cuatro no lo son: D10-C y D13-B (vigías), D11-C (cobrar) y D13-C (cliente ideal). Para una audiencia que quiere aprender a construir o a vender con IA, siete días seguidos de bot cansan. Además, D09-B y D11-B tocan los dos audio o voz. Orden sugerido para aflojar, del primero al último que se baja o se mueve fuera de la ventana:

1. **S2-D10-B**: ya descartada.
2. **S2-D09-B (voz con Gemini)**: es noticia, ONIA no tiene voz construida y pisa el tema de D11-B. Bajarla o moverla a la semana de contenido (S3), donde la voz sirve para locución.
3. **S2-D08-B (n8n Force Tool Call)**: sin prueba propia, y el plan del 23-27 sep ya tenía una pieza «Force Tool Call no garantiza verdad» (`PLAN-CONTENIDO-23-27-SEP-2026.md`). Si esa salió, esta se repite.
4. **S2-D11-A o S2-D10-A**: las dos son «barridos que molestan». Si hay que bajar una más, se puede unir en una sola pieza sobre envíos automáticos, con dos reglas: franja horaria y lista de exclusión.

Lo que no conviene bajar: los tres YouTube (D07-C, D09-C, D12-C). Son los que más demuestran y tienen casos propios de ONIA medidos en producción.

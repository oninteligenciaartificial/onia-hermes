# Lead que llega por un anuncio de la prueba 1 (D7 a D11): las primeras 24 horas

> **11-oct-2026 · Ventas y pauta · 2.ª de las tres tareas «destrabadas» que pidió la MADRE MARKETING.** Lo usa **Sergio Urcullo** (el único que vende). **Es un plan: no hay ningún anuncio creado ni ningún lead de pauta todavía.** `SEGUIMIENTO-LEADS.md` cubre a quienes **contactamos nosotros**; este cubre a quien **escribe primero**, después de tocar el botón de un anuncio.
> **Todo lo que se le dice al lead es de usted, sin precio, sin minutos de llamada, sin «clínica de ejemplo» y sin nada que `ONIA_CATALOGO_DE_VENTA.md` §7 y §8 no deje decir.** Los textos entre comillas con `>` se prueban en `scripts/campana-lista.test.mjs` (detector de promesas y sin voseo).

## 1. Qué recibe Sergio Urcullo y qué ya hizo el bot

El lead tocó el botón de WhatsApp de un anuncio y mandó el precargado «Hola, vi el anuncio de Onia (D10). Tengo una clínica dental.». **El bot ya le contestó dos mensajes** (se presenta como bot, dice qué es Onia y le pregunta cuántos profesionales atienden y quién agenda; si es un paciente, lo despide con cortesía): `carousels/briefs/ads/prueba1-v2/BOT-RESPUESTAS-D7-D11.md`. El aviso a Sergio Urcullo trae `Origen: anuncio-Dn`. Qué anuncio es:

| Código | Lo que el dueño vio | Una frase para engancharse (sin repetirle el anuncio) |
|---|---|---|
| `D7` | Selfie sentado: «Pacientes de mañana sin confirmar» | «Me escribe después de ver el video de los pacientes de mañana sin confirmar.» |
| `D8` | «Paciente que hace meses no vuelve» *(solo si G-05 ✅)* | «Me escribe después de ver el anuncio de los pacientes que hace meses no vuelven.» |
| `D9` | Imagen «¿Quién de mañana no confirmó?» | «Me escribe después de ver el anuncio de quién de mañana no confirmó.» |
| `D10` | Sergio Urcullo explica: «Paciente que no llega, sillón que se paga igual» | «Me escribe después de ver el video donde explico lo del paciente que no llega.» |
| `D11` | Micro-video: «Su agenda de mañana, ¿y si no vienen?» | «Me escribe después de ver el anuncio de la agenda de mañana.» |

## 2. El reloj

| Cuándo | Qué | Por qué |
|---|---|---|
| **Hora 0** | El aviso llega a Sergio Urcullo con el código y lo que el lead contó | El bot ya contestó; el humano todavía no |
| **Antes de 24 h** | **Primera respuesta de Sergio Urcullo.** Si el lead respondió a las preguntas, §3 A; si no, §3 B | Abre la ventana gratis de 72 h de Meta y es la recomendación de la fila 6 del go/no-go. **Sábado de tarde y domingo son el hueco:** el horario de oficina del bot llega a ~47 h (`BOT-RESPUESTAS-D7-D11.md` §3) |
| **Hasta 72 h** | Seguir en el mismo chat | Dentro de la ventana gratis. Dentro de las 24 h del último mensaje del lead valen texto, imagen o audio libres (`SEGUIMIENTO-LEADS.md` §2); después, solo plantillas (§3) |
| **Día 3, 7 y 14** | Si no contesta, `SEGUIMIENTO-LEADS.md` §3 | Misma cadena que los leads de siempre |

## 3. La primera respuesta de Sergio Urcullo, según lo que pasó

**Dónde se manda:** desde la bandeja de Chatwoot (inbox 5, «Onia WhatsApp») con el usuario de Sergio Urcullo: un mensaje saliente de un humano **apaga el bot** en esa conversación (`SEGUIMIENTO-LEADS.md` §1). Si sale por otra vía, el bot sigue contestando con su guion encima de lo que Sergio Urcullo escribió.

**A. Contó cuántos profesionales atienden y quién agenda** (el caso calificado). Se contesta con **su** dato y una sola propuesta:

> Buenas tardes, soy Sergio Urcullo, de Onia. Gracias por escribirme. Con [N] profesionales y [recepción / usted mismo] agendando, lo que le muestro en la demostración es cómo Onia deja cada mañana anotado a quién escribirle, con el mensaje listo, y usted lo aprueba. ¿Le sirve el [día] a las [hora], o prefiere elegir su horario aquí: sergiourcullo.vercel.app/llamada?

*(Se omite la duración de la llamada hasta que Sergio Urcullo decida 20 o 30: L-04.)*

**B. Solo mandó el precargado y no contestó nada.** Una pregunta, no cinco:

> Buenas tardes, soy Sergio Urcullo, de Onia. Gracias por escribirme. Para mostrarle algo útil, ¿cuántos profesionales atienden en su clínica y quién agenda las citas?

**C. Tocó «Trabajo en una clínica»** (puede ser un empleado, no quien decide):

> Buenas tardes, soy Sergio Urcullo, de Onia. Gracias por escribirme. ¿Es usted quien decide en la clínica o quien agenda las citas? Si es quien agenda, con gusto le muestro lo que vería cada mañana, y si es otra persona, me indica con quién conviene hablar.

**D. Es un paciente.** El bot ya lo despidió. **No se contesta**: no es un lead.

## 4. Si pregunta algo, esto sí se puede decir

| Pregunta | Qué se contesta | Fila |
|---|---|---|
| «¿Cuánto cuesta?» | Los planes son públicos: *«Están en onia.com.bo/precios. Lo que cuesta depende de cuántos son y de los módulos que active; en la demostración se lo calculo con sus números.»* El bot ya dio los planes si lo preguntaron | `subscription-plans.ts` |
| «¿Puedo probarlo?» | *«Sí: 14 días del plan Profesional, sin tarjeta, y si no le sirve no paga nada.»* **Solo si lo pregunta.** El link de registro es `app.onia.com.bo/register` | A-04 y A-08 ✅ vistos |
| «¿Los mensajes salen solos por WhatsApp?» | *«Onia deja el mensaje listo y usted lo aprueba. Hoy no sale solo por WhatsApp.»* | G-03 🟡 y catálogo §7 |
| «¿Factura con el SIAT?» | Lo que el bot ya dice: solo lo público de la norma; *«Onia le ordena ventas y compras; la factura fiscal se emite aparte, en el portal del SIN»* | catálogo §7 |
| «¿Recupera pacientes con tratamiento a medias?» | *«Eso hoy no lo prometo; en la demostración le muestro qué hace con su agenda.»* | D-03 ❌ |
| «¿Tienen clientes / dónde lo usan?» | *«Estamos empezando, por eso le muestro el sistema funcionando y usted decide.»* **Cero clientes pagando: no se inventan casos ni nombres** | catálogo §7 |

## 5. Qué se anota de cada lead (una fila, el mismo día)

Código y pieza · fecha y hora del clic · **hora de la primera respuesta humana** (para saber cuántos pasaron de 24 h) · quién es (dueño, administra, empleado) · profesionales · quién agenda · cómo llevan hoy la agenda (cuaderno, Excel, WhatsApp) · cuántos pacientes tienen un tratamiento empezado y no volvieron (la pregunta que vende, `ONIA_CLIENTE_IDEAL.md` §9) · plan que le toca (hasta 4 usuarios, Crece; 5, Profesional; 6 o más, Completo) · **próximo paso con fecha**.
**Cuenta como «conversación de dueño»** quien tocó «Tengo una clínica y quiero ver cómo funciona» o contestó las preguntas; **«demo agendada»** es una cita de `/llamada` (ADQ §5.11).

## 6. La llamada

`02-GUION-DEMO.md` §1, con tres ajustes mientras no exista la cuenta demo en producción (L-05 ❌): (1) la llamada se ofrece como «una llamada para ver si le sirve», **no** como «una clínica de ejemplo»; (2) se mira con lo que haya en la cuenta de prueba, sin prometer que ese es su caso; (3) **sin tocar «Enviar yo mismo por WhatsApp»** (G-03 🟡).
⚠️ **`02-GUION-DEMO.md` está escrito en voseo** («te muestro», «¿cuánto cobrás?»): con un lead de pauta se habla de **usted** (CLAUDE.md, 3-oct). Pendiente de pasar a usted antes de la primera llamada.

## 7. Lo que depende de quién

| Qué | Quién |
|---|---|
| 20 o 30 minutos (L-04); quién contesta el sábado de tarde y el domingo (fila 6) | **Sergio Urcullo** |
| Las reglas fijas del bot (botones de la bienvenida, «¿puedo probarlo?», «¿salen solos?») | **Carril chatbot**, con la firma de Sergio Urcullo (`BOT-RESPUESTAS-D7-D11.md` §3) |
| La cuenta demo con datos (L-05) | **Plataforma** |
| Descongelar el contacto con los leads de agosto (los 7 de `SEGUIMIENTO-LEADS.md`) | **Sergio Urcullo** |

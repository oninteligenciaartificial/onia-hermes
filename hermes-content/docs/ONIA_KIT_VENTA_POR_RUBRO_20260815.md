# ONIA — Kit de venta por rubro (placas + gate de copy)

Fecha: 2026-08-15 · Estado: **escrito, sin publicar — espera OK de Sergio**
Origen: prompt C2 de `hermes-content/references/video-intake/PROMPTS_POR_SESION.md`.

**Qué es esto:** el pitch de los seis rubros vendibles en el idioma del comprador.
Una placa por rubro = 4 dolores en segunda persona, escritos desde la silla del
dueño y terminando en plata, más UN agente con nombre de los que el sistema ya
tiene corriendo.

**Qué NO es:** no hay ni una métrica de resultado. Con cero clientes pagando, un
"+40% de citas" es inventado y nos saca de la mesa con el comprador formal. Las
placas venden el DOLOR y la capacidad verificada, nada más.

Complementa (no reemplaza): `KIT_VENTAS_AGENTE_IA_2026.md` (guiones de contacto,
precios viejos marcados), `ONIA_MAPA_PRODUCTOS_POR_RUBRO_2026.md` (mapa técnico),
`ONIA_STACK_CHATBOTS_POR_RUBRO_20260815.md`.

---

## 0. Los agentes que EXISTEN de verdad (verificado, no supuesto)

Fui a mirar antes de escribir. Fuente: `onia-core/modules/agents.json` +
`onia-core/modules/agents.logic.mjs` (contrato y lógica pura) y el runtime del
producto en `C:\dev\proyectos\onia-platform\lib\onia-core\modules\agents-runtime.ts`
(`AGENT_KINDS`, líneas 81-119).

**Hay TRES agentes con nombre, no más:**

| Agente | Qué hace, textual del código | Cadencia | Disponible para |
|---|---|---|---|
| **Recall — reactivación de pacientes** | Detecta pacientes sin volver hace ≥180 días y sin próxima cita; redacta un borrador de mensaje que un humano aprueba en Pendientes. Nunca envía solo. | diaria (1440 min), cooldown 30 días | Rubros clínicos: **dental, estética, veterinaria** |
| **Cobrador — saldos vencidos** | Detecta saldos vencidos y redacta un borrador de recordatorio de pago que un humano aprueba en Pendientes. Nunca cobra ni envía solo. | diaria, cooldown 7 días, sin monto mínimo | **Los seis rubros.** En comercio/importadora/servicios lee *fiados* (`getCollectorFeedComercio`); en dental/estética/vet lee facturas emitidas |
| **Captador — consultas de interesados** | Lee las consultas que entran por formulario/WhatsApp, las califica y redacta un borrador de respuesta. | cada 30 min, máx 3 toques | **NINGUNO de los seis.** Está gateado por `requiresFeature: "addon.inmobiliaria"` — hoy es del add-on inmobiliario. No se vende en estas placas |

Tres cosas que hay que decir y que aplican a las seis placas:

1. **El canal es WhatsApp y el envío lo hace un humano.** El adaptador
   (`lib/onia-core/dispatch/channels.ts`) *"no manda nada por la red: prepara el
   mensaje y devuelve un link `wa.me`"*. Nada de agente de voz, nada de llamada
   perdida: eso no lo tenemos y no se nombra.
2. **Los agentes se encienden desde el plan Profesional** (`PLAN_LIMITS[...].agentsIncluded`
   es `false` en free y basic). No prometer agentes al plan de entrada.
3. **Deuda verificada, arreglar antes del primer envío real:** el texto que arma
   `buildRecallMessage` dice *"mantener tu salud dental al día"* — está escrito
   para dental. En estética y veterinaria el borrador sale con copy dental. La
   máquina funciona; el texto necesita una pasada por rubro. **No es bloqueante
   para publicar la placa** (el humano aprueba y edita antes de enviar), sí lo es
   para la primera demo en vivo de esos dos rubros.

---

## 1. Las seis placas

Formato de cada placa: hook → 4 dolores → el agente con nombre → CTA. El copy
está en uso boliviano (nada de "che", "laburo", "quilombo"): fiado, caserito,
casera, Bs, movilidad, plata, cuaderno. El vocabulario de cada rubro está tomado
del producto (`lib/onboarding/vocabulario.ts`), no inventado.

---

### PLACA 1 · DENTAL

**Hook:** Cuatro cosas que te cuestan plata todas las semanas en tu consultorio.

1. Te cancelan a las 8 de la noche por WhatsApp. Vos ya cerraste, ni lo viste, y
   mañana esa silla queda vacía una hora que igual pagás: alquiler, luz y
   recepción.
2. El paciente que se hizo la limpieza en enero no volvió más. Está en tu base,
   con nombre y celular, y nadie le escribió: es un control cobrable que se quedó
   sin cobrar.
3. El tratamiento largo quedó a medias y el saldo "para la próxima". Ese trabajo
   ya lo hiciste: la plata está vencida en tu carpeta, no en tu caja.
4. Te preguntan por WhatsApp a las 11 y contestás a las 7, entre paciente y
   paciente. El que preguntó ya se agendó en la clínica de la otra cuadra.

**El agente que trabaja eso hoy: Recall.**
Todos los días revisa quién no vuelve hace seis meses y no tiene próxima cita,
escribe el mensaje con el nombre del paciente y lo deja en Pendientes. Vos lo
leés, lo aprobás, y recién ahí sale por WhatsApp. Nunca manda solo.
Los saldos vencidos los junta el **Cobrador**, con el mismo circuito.

**CTA:** Comentá SILLA y te muestro cómo queda en tu agenda.

---

### PLACA 2 · COMERCIO MINORISTA

**Hook:** Cuatro cosas que te cuestan plata todas las semanas en tu tienda.

1. El cuaderno de fiados. Sabés que te deben; no sabés desde cuándo ni cuánto.
   Esa es plata tuya trabajando en la calle para otro.
2. Tu casero pide algo que vendiste ayer y nadie anotó. No tenés. Cruza a la
   tienda de al lado y ahí se queda, con todo lo que compraba cada mes.
3. Te preguntan precio por WhatsApp a las 9 de la noche y contestás a las 10 de
   la mañana. A esa hora ya compró en otro lado.
4. Cerrás caja a ojo. El faltante lo ponés vos, todos los meses, sin saber de
   dónde salió.

**El agente que trabaja eso hoy: Cobrador.**
Lee tus fiados con fecha de vencimiento, pone primero el más viejo, arma el
recordatorio con el monto exacto en Bs y lo deja en Pendientes. Aprobás y sale
por WhatsApp. Nunca cobra ni manda solo.
*Recall no aplica acá: trabaja sobre historial de visitas, y en una tienda ese
dato no existe. Lo que hay para comercio, hoy, es el Cobrador.*

**CTA:** Comentá FIADO y te paso cómo se ordena tu cuaderno.

---

### PLACA 3 · IMPORTADORA

**Hook:** Cuatro cosas que te comen el margen del embarque.

1. Costeás el contenedor en Excel y le cargás el flete entero a cada ítem. El
   costo unitario te miente por arriba y terminás vendiendo con un margen que no
   existe.
2. La cotización se la mandaste por WhatsApp y quedó enterrada en el chat. Nadie
   sabe si se ganó, se perdió o sigue esperando respuesta.
3. La factura a 30 días venció hace 45 y nadie reclamó porque "es cliente
   conocido". Ese es tu capital de trabajo financiando el de él.
4. Tu lista de precios se armó con un dólar que ya no existe. Cada venta al
   precio viejo te devuelve menos de lo que te costó reponer.

**El agente que trabaja eso hoy: Cobrador.**
Junta las cuentas por cobrar vencidas, ordena por antigüedad, arma el
recordatorio con el saldo en Bs y los días de atraso, y lo deja en Pendientes
para que vos lo apruebes.
El costeo del contenedor no es un agente: es el módulo de importación, que
prorratea flete, seguro y despacho por FOB, peso o volumen — al centavo.

**CTA:** Comentá COSTO y te muestro el costeo de un contenedor tuyo.

---

### PLACA 4 · ESTÉTICA

**Hook:** Cuatro cosas que te cuestan plata todas las semanas en tu centro.

1. La clienta hizo 3 sesiones del paquete de 6 y desapareció. No renueva, no
   recomienda, y el turno que tenía reservado lo pagás igual.
2. Te escriben por Instagram, por WhatsApp y por el formulario, todo el mismo
   día. La consulta de las 9 la ves a las 6, y esa clienta ya se hizo el
   tratamiento en otro lado.
3. Se cae el turno de las 4 y tenías gente esperando lugar, pero nadie se enteró
   a tiempo. Esa hora de cabina no se recupera nunca.
4. El saldo del tratamiento quedó "para cuando venga" y no vino. Está anotado en
   un cuaderno, no en tu caja.

**El agente que trabaja eso hoy: Recall.**
Revisa todos los días qué clientas no vuelven hace meses y no tienen próximo
turno, y deja el mensaje redactado en Pendientes. Vos aprobás y sale por
WhatsApp. Nunca manda solo.
Los saldos los junta el **Cobrador**, con el mismo circuito de aprobación.

**CTA:** Comentá PAQUETE y te muestro cómo se ve tu lista de clientas dormidas.

---

### PLACA 5 · VETERINARIA

**Hook:** Cuatro cosas que te cuestan plata todas las semanas en tu veterinaria.

1. El control anual pasó de largo. El dueño se acuerda cuando el animal ya está
   mal, y esa consulta de rutina que era tuya termina siendo una urgencia en otro
   lado.
2. La desparasitación de cada tres meses la tiene que recordar el dueño, porque
   no tenés cómo avisarle. Cada olvido es una consulta menos en el mes.
3. Atendés y cobrás en el mismo mostrador. El saldo del tratamiento largo queda
   en un papel y a fin de mes no sabés cuánto te deben ni quién.
4. Te consultan por WhatsApp mientras tenés un animal en la mesa. Contestás
   tarde y esa consulta se fue a la veterinaria de la esquina.

**El agente que trabaja eso hoy: Recall.**
Detecta qué pacientes no vuelven hace meses y no tienen próxima cita, y deja el
mensaje redactado en Pendientes para que vos lo apruebes.
Los saldos vencidos los junta el **Cobrador**.

**CTA:** Comentá CONTROL y te muestro cuántos pacientes tuyos están dormidos.

---

### PLACA 6 · SERVICIOS PROFESIONALES

**Hook:** Cuatro cosas que te cuestan plata todas las semanas en tu estudio.

1. Mandaste el presupuesto por WhatsApp y quedó enterrado en el chat. No lo
   perdiste por caro: lo perdiste porque nadie volvió a preguntar.
2. Entregaste el trabajo y lo cobrás "cuando pueda". Vos ya pagaste sueldos y
   alquiler con una plata que todavía no entró.
3. Tenés tres trabajos en curso y el estado de cada uno vive en tu cabeza. El día
   que te enfermás, el estudio se para.
4. El cliente pregunta a las 8 de la noche y respondés al otro día. El que
   pregunta precio de un servicio pregunta en tres lados el mismo día.

**El agente que trabaja eso hoy: Cobrador.**
Junta lo que está vencido, ordena por antigüedad, arma el recordatorio con el
monto en Bs y lo deja en Pendientes. Aprobás y sale por WhatsApp. Nunca cobra ni
manda solo.
*Recall no aplica acá: necesita historial de visitas. Para servicios, hoy, el
agente que hay es el Cobrador.*

**CTA:** Comentá PRESUPUESTO y te muestro cómo se sigue solo.

---

## 2. El gate de copy (una línea, para TODO estático nuestro)

> **Si el estático no nombra el dolor EXACTO del rubro —con la palabra que usa el
> dueño (fiado, silla vacía, contenedor, paquete de sesiones, control anual,
> presupuesto)— y ese dolor no termina en plata, no sale.**

Cómo se aplica, en tres chequeos de diez segundos:

- **Prueba del reemplazo:** si le cambiás el rubro a la placa y el texto sigue
  funcionando igual, el dolor no era del rubro. No sale.
- **Prueba de la plata:** cada dolor tiene que terminar en algo que se cobra, se
  pierde o se paga. "Te desorganizás" no es un dolor; "el faltante lo ponés vos"
  sí.
- **Prueba de la capacidad:** lo que la placa nombra tiene que existir hoy en el
  producto. Si el rubro no tiene agente propio, la placa dice qué hay —no se
  inventa uno para llenar el casillero.

**Dónde debe vivir:** este gate corresponde a `hermes-content/carousels/CAROUSEL_SYSTEM.md`,
sección "Reglas de maquetación (OBLIGATORIAS)", como regla 4 (regla de COPY, no de
maquetación). No lo escribí ahí porque ese archivo es de otro carril: **queda
para que lo muevas vos.**

---

## 3. El estático "recibo"

Renderizado con el motor propio (brief → HTML/CSS → PNG on-brand), sin Canva y
sin Python:

- Brief: `hermes-content/carousels/briefs/onia-recibo.json`
- PNG: `hermes-content/carousels/out/onia-recibo/slide-01.png` (1080×1350)
- Comando: `node scripts/carousel_render.js --brief hermes-content/carousels/briefs/onia-recibo.json --out hermes-content/carousels/out/onia-recibo --account onia`

Precios: **Landing Bs 790 · Web Pro Bs 1.500**, pago único, precio de lanzamiento
(`PRICING_RATIONALE_INTERNO.md` §0 y `ONIA_CATALOGO_PRECIOS_2026.md` §2). El
estático dice en la cara que **dominio y hosting van a nombre del cliente y no
entran en ese precio** — regla de la casa, y acá es además el argumento de
confianza: en Bolivia casi nadie publica el precio.

**Techo real del motor (probado, no supuesto):** `carousel_render.js` no itemiza.
El cuerpo es un `<p>` único (los saltos de línea colapsan) y no existe un campo
`lines[]`. Metí el detalle por paquete en el cuerpo y con cinco líneas el
elemento `.ticket` se aplastó y recortó el texto; volví a tres líneas. Resultado:
la pieza usa el troquel punteado del motor y lleva los dos precios en el titular,
pero **el detalle línea por línea vive en el caption, no en la imagen.** Para un
recibo itemizado de verdad hace falta un campo `lines[]` en el render — archivo
de otro carril, no lo toqué.

---

## 4. Cobertura real de esta sesión

| Entregable | Estado |
|---|---|
| 6 placas escritas (dental, comercio, importadora, estética, veterinaria, servicios) | Hecho. 4 dolores + 1 agente verificado cada una |
| Estático recibo renderizado | Hecho. 1 PNG, revisado a ojo, sin recortes |
| Gate de copy | Escrito acá. **Falta moverlo a `CAROUSEL_SYSTEM.md`** (otro carril) |
| Agentes | Verificados en el código del producto, no supuestos. Son 3; uno (Captador) no aplica a estos rubros |
| Métricas de resultado | Cero, a propósito |
| Publicación | Nada publicado. Espera OK de Sergio |

**Lo que depende de Sergio:** (1) aprobar las seis placas y el recibo; (2) decidir
si las placas se renderizan como estáticos ya (son 6 briefs más de 20 minutos) o
si primero se prueba una sola; (3) el copy dental dentro de `buildRecallMessage`
hay que reescribirlo por rubro antes de la primera demo en vivo de estética o
veterinaria.

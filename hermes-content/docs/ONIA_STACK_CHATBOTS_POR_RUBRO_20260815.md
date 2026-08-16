# Stack de chatbots por rubro — para la sesión de onia-platform

**Fecha:** 2026-08-15 · **Autor:** sesión del carril bot Hermes
**Para:** la sesión de onia-platform
**Estado de las cifras:** lo marcado *verificado* se comprobó en producción el 13/14-ago-2026. Lo demás está marcado.

**Leer ANTES que este doc** (se escribieron primero y este no los citaba — se agregó el 16-ago):

- `ONIA_MODELO_MULTICLIENTE_CHATBOT_20260802.md` — **cómo se opera N clientes**. Decisiones ya
  tomadas que este doc da por sentadas: una cuenta de Chatwoot por cliente · provisionar
  SIEMPRE por Platform API desde el primer cliente (la Platform API **no ve** lo creado a mano
  por la UI) · bot por cliente vía **Agent Bots**, no webhook crudo · webhook por cliente
  (`/hook/<cliente>`) validando además `account.id` · la marca blanca **no es viable** ·
  el super admin puede impersonar y eso va declarado en el contrato.
- `ONIA_BOT_CAPA_CONOCIMIENTO_20260806.md` — la frontera lógica/hecho y los cuatro candados.
- `ONIA_ESTADO_CHATBOT_Y_VOZ_20260816.md` — qué está encendido y verificado hoy.

---

## 0. Léase primero: qué se está pidiendo

Esto **no** es un pedido de once chatbots. Es lo contrario.

El motor conversacional ya existe, está en producción y probado. Lo que falta no es codearlo once veces: es que la plataforma **exponga cinco entidades** que el core ya declara. Con eso, cada rubro nuevo es un guion, no un desarrollo.

El pedido concreto a onia-platform está en la **sección 3**. El resto es el porqué.

---

## 1. La inspiración: qué copiar de Lety y qué no

[Lety.ai](https://lety.ai/) es una plataforma white-label para que agencias creen y **revendan** agentes. Tiene 12 verticales y 46 nichos con agentes preconfigurados, despliegue en WhatsApp/IG/web/email/SMS/CRM, y un modelo de ingresos de cuatro capas: suscripción + markup de tokens (3x-10x) + markup de llamadas a herramientas + setup.

### Lo que hay que copiar

**1. El encuadre. Esto es lo más importante del documento.**

Lety no vende chatbots. Vende **empleados**: *"AI Appointment Assistants for clinics, AI Shopify Personal Shoppers for e-commerce, AI Contract Reviewers for legal"*. Se posicionan como una empresa de personal con empleados digitales.

La diferencia no es cosmética, es de precio. Un chatbot compite contra Bs 150/mes y contra la sobrina que contesta gratis. Una **recepcionista que no falta nunca** compite contra un sueldo. Y en Santa Cruz un sueldo con cargas está por encima de Bs 3.000.

Nunca más "chatbot" en una propuesta. Se vende **la vacante que no hay que llenar**.

**2. Los agentes se templatizan por nicho, no por tecnología.** El cliente no compra "un bot con NLU". Compra "la que confirma las citas". Cada rubro tiene su empleado con nombre y puesto.

**3. El margen no está en la suscripción sola.** Suscripción + excedente de mensajes + setup. Ya lo tenemos definido en `ONIA_META_Y_CHATBOT_PRODUCTO_20260725.md` §4.3.

### Lo que NO hay que copiar

**El no-code.** Lety vende que cualquiera arma un agente prompteando. Eso es su producto porque su cliente es la agencia. **Nuestro** cliente es el dueño de la ferretería. Nuestra ventaja no es que sea fácil de armar: es que **ya viene armado y sabe de su rubro**, con las reglas fiscales bolivianas adentro.

**Los 46 nichos.** Es su catálogo de marketing. Nosotros tenemos 11 rubros declarados en el core y **seis vendibles hoy**. Abrir un rubro sin cliente pagando es exactamente el error que ya cometimos con la capa multi-rubro apagada.

**El markup de tokens 3x-10x.** Funciona en un mercado donde nadie mira la factura. Acá el cliente pregunta. Nuestro margen se defiende por resultado, no por opacidad: bolsa incluida y excedente declarado.

---

## 2. El motor: uno solo, ya construido

Todo esto está **en producción y verificado**, no es plan:

| Pieza | Estado |
|---|---|
| Recibir y responder por WhatsApp (Cloud API + Chatwoot) | verificado |
| Calificar: rubro, tamaño, ciudad, dolor | verificado |
| Agendar contra calendario real (Cal.com) | verificado |
| Seguimiento a las 20 h si no contesta | verificado |
| Recordatorio antes de la cita | verificado |
| Cierre post-demo | verificado |
| Plantillas fuera de la ventana de 24 h (utility y marketing) | verificado — entregadas y leídas |
| Transcripción de audios | construido |
| Traspaso a humano: entra una persona y el bot se calla | verificado |
| Medidor de mensajes por cliente/mes/categoría | verificado en producción |
| Minimización de datos: no se guarda el texto del prospecto | verificado |

**Lo que el motor NO hace hoy y hay que decirlo:** no lee catálogo ni stock, no consulta estado de pedido, no cobra, no emite factura, no habla por voz.

Esas cinco cosas son las que abren los rubros de abajo. Y ninguna necesita un motor nuevo — necesitan que la plataforma le pase los datos.

---

## 3. EL PEDIDO: el contrato de datos

Acá está lo que le toca a onia-platform. El core ya declara las entidades; falta exponerlas al bot.

### Las cinco entidades que el bot necesita

| Entidad del core | Para qué la usa el bot |
|---|---|
| `Contact` | quién escribe, su historial, si ya es cliente |
| `WorkItem` | el pedido, el caso, el reclamo, el pendiente que abre el bot |
| `ScheduleEvent` | citas: qué horarios hay, reservar, mover, recordar |
| `CommunicationChannel` | qué número es de qué cliente, ruteo, quién atiende |
| `ApprovalRequest` | lo que el bot NO decide solo y manda a un humano |

**Ninguna es nueva.** Están las 18 entidades en `onia-core/contract.json` v1.0.0. El módulo `agents` ya existe como noveno módulo.

### Lo que hay que construir

**1. Un endpoint de lectura por organización.** El bot pregunta y la plataforma responde. Cuatro consultas cubren el 90%:

```
GET  /api/bot/{org}/contacto?telefono=...     → ¿lo conocemos? ¿qué le vendimos?
GET  /api/bot/{org}/agenda?desde=&hasta=      → huecos reales del calendario
GET  /api/bot/{org}/catalogo?q=...            → ¿hay? ¿cuánto? (sin precio si el rubro no lo publica)
GET  /api/bot/{org}/workitem/{id}             → estado del pedido/caso
```

**2. Un endpoint de escritura, siempre idempotente.** El bot reintenta; la plataforma no puede duplicar:

```
POST /api/bot/{org}/workitem        → abre pedido/caso/reclamo
POST /api/bot/{org}/schedule        → reserva la cita
POST /api/bot/{org}/approval        → manda a aprobación humana
```

Cada uno con clave de idempotencia obligatoria. **Esto no es opcional:** ya nos pasó que un barrido sin reserva mandaba dos mensajes, y la regla del proyecto es que perder un mensaje es preferible a mandar dos.

**3. Multi-tenant de verdad.** Hoy `bot_messages` **no tiene columna de cliente** (verificado contra la base). Con un solo cliente no molesta; con dos es una fuga de datos entre negocios. El bot ya tiene el agrupador preparado (`raw.tenant`), pero la plataforma tiene que ser la fuente de esa identidad.

**4. Qué puede decir cada bot.** Un campo por organización con lo que el bot tiene permitido afirmar: precios sí/no, stock sí/no, plazos sí/no. Sin esto, el primer bot que invente un precio nos cuesta un cliente.

### Lo que NO hay que construir

- **No** un motor de conversación nuevo. Ya existe.
- **No** tablas propias del bot en la plataforma. El bot tiene las suyas en `onia_center`.
- **No** una UI de configuración todavía. Primero que funcione con un cliente real.

---

## 4. Los empleados, por rubro

Formato: **puesto** · qué hace · qué entidades toca · qué le falta a la plataforma · qué NO hace.

Los seis primeros son los rubros ya vendibles en `app.onia.com.bo/registro`. Los últimos están declarados en el core pero **no se abren hasta que haya cliente pagando**.

---

### 🦷 Dental — «La Recepcionista»

**Reemplaza:** la persona que contesta el WhatsApp entre paciente y paciente.

- Contesta horarios, ubicación, si atienden una obra social
- **Agenda, confirma y reagenda** contra el calendario real
- Recuerda la cita el día anterior
- Persigue al que no vino (el agujero de plata más grande de un consultorio)
- Deriva al odontólogo lo clínico, sin opinar

**Entidades:** `Contact`, `ScheduleEvent`, `WorkItem`, `ApprovalRequest`
**Falta en plataforma:** agenda real por profesional (hoy el bot usa Cal.com aparte, no el calendario del sistema)
**NO hace:** diagnosticar, decir si algo duele, prometer resultados, dar precio de tratamiento sin aprobación

**Por qué este primero:** es el único rubro donde el motor ya está completo. Lo único que falta es que la agenda salga de la plataforma y no de Cal.com.

---

### 🔩 Comercio / Ferretería — «El Mostrador»

**Reemplaza:** al que atiende el WhatsApp mientras cobra en caja.

- «¿Tienen X?» → responde contra stock real, o dice honestamente que no sabe
- Arma el pedido y lo deja abierto para que lo confirme una persona
- Estado del pedido sin que nadie tipee
- Horarios, ubicación, si hacen delivery

**Entidades:** `Contact`, `WorkItem`, `Contact`(catálogo vía módulo commerce)
**Falta en plataforma:** consulta de catálogo y stock — **es lo que abre este rubro**
**NO hace:** cobrar, prometer plazo de entrega, dar descuento

**El detalle que decide todo:** un bot que dice «no tengo ese dato» pierde la venta. Uno que **inventa** que hay stock pierde el cliente. Por eso `catalogo` es el primer endpoint después de la agenda.

---

### 📦 Importadora — «El Cotizador»

**Reemplaza:** las tres horas semanales armando cotizaciones repetidas.

- Recibe el pedido de cotización y **captura los datos completos** antes de molestar a nadie
- Consulta si el ítem ya se importó antes y a qué costo
- Arma el borrador de cotización y lo manda a aprobación
- Avisa cuando llega el contenedor

**Entidades:** `Contact`, `BusinessPartner`, `WorkItem`, `ApprovalRequest`
**Falta en plataforma:** el módulo `import_costing` ya existe en el core — hay que exponerlo en lectura
**NO hace:** dar el precio final (el TCO lleva aranceles, flete y tipo de cambio — eso lo firma una persona)

**Ojo con esto:** el tipo de cambio se movió 63% en junio. Un bot que cotiza en firme sin cláusula de ajuste regala plata. La cotización sale **siempre** con fecha de validez.

---

### 💅 Estética — «La Agenda»

Igual que Dental en mecánica, distinto en tono y en una cosa: **acá el bot sí puede vender**. En dental el paciente viene con dolor; en estética viene con deseo, y el mismo motor que califica leads sirve para subir el ticket.

- Agenda, confirma, recuerda
- Sugiere el tratamiento complementario (con permiso explícito por organización)
- Reactiva a la que no vuelve hace 3 meses

**Entidades:** `Contact`, `ScheduleEvent`, `WorkItem`
**Falta:** lo mismo que dental (agenda real)
**NO hace:** prometer resultados, hablar de procedimientos médicos

---

### 🐾 Veterinaria — «El Turno»

Mecánicamente idéntico a dental, con una diferencia que importa: **el paciente no habla**. El bot le habla al dueño sobre un tercero, y eso cambia el guion — hay que capturar la mascota como entidad, no solo el contacto.

- Agenda, recuerda vacunas y desparasitación (recurrencia calendarizada, no reactiva)
- Urgencias: **detecta y escala de inmediato**, no agenda

**Entidades:** `Contact`, `ScheduleEvent`, `WorkItem`
**Falta:** ficha de mascota ligada al contacto
**NO hace:** decir si es urgente o no — ante duda, escala

---

### 🛠️ Servicios profesionales — «El Filtro»

**Reemplaza:** el tiempo perdido con consultas que nunca iban a cerrar.

- Califica antes de que el profesional dedique un minuto
- Captura el caso completo
- Agenda solo lo que pasó el filtro

**Entidades:** `Contact`, `WorkItem`, `ScheduleEvent`
**Falta:** nada nuevo — este rubro corre con lo que ya hay
**NO hace:** asesorar, dar plazos, cotizar

**Este es el segundo más barato de abrir después de dental.**

---

### Los que NO se abren todavía

`Ganadero OS Offline` · `ProveeGest Construcción` · `GestiOS Gastronomía` · `GestiOS Educación` · `GestiOS Turismo`

Están declarados en el core. **No se les escribe un guion hasta que haya un cliente pagando en ese rubro.** Escribir los cinco «por si acaso» es exactamente el error de la capa multi-rubro: semanas de trabajo con efecto cero.

Gastronomía es el candidato más obvio (Lety lo tiene con integración a POS), pero el motor necesitaría cobrar — y eso hoy no existe.

---

## 5. Agentes de llamadas

**Estado: en investigación.** Hay una sesión trabajando en esto ahora mismo; el resultado va a `hermes-content/docs/research/ONIA_AGENTES_DE_LLAMADAS_20260815.md`.

Lo que se está averiguando, porque **una de estas respuestas mata el producto**:

1. Si se puede tener un número **boliviano** que atienda un agente de IA. Twilio no vende números de Bolivia; si no hay alternativa vía SIP, el producto no existe acá.
2. Si la **WhatsApp Business Calling API** de Meta ya funciona en Bolivia. Si sí, saltea toda la telefonía tradicional y cambia el panorama entero.
3. Costo real por llamada de 2 minutos, en Bs.
4. Qué exige la ATT para llamadas automatizadas o grabadas.

**No prometer agentes de llamadas a ningún cliente hasta que ese documento esté.**

---

## 6. Lo que decide si esto se vende

En orden de qué bloquea a qué:

**1. Tech Provider ante Meta.** Sin esto cada cliente necesita número nuevo; con esto conserva el suyo y su app (coexistencia). Verificación de negocio ya aprobada; falta la revisión de app. **Es la llave de todo lo de arriba.**

**2. El endpoint de agenda.** Abre dental, estética y veterinaria de una — tres rubros con un solo desarrollo.

**3. El endpoint de catálogo.** Abre comercio, que es el rubro con más negocios en Santa Cruz.

**4. Multi-tenant.** No bloquea al primer cliente. Bloquea al segundo, y de la peor forma posible.

---

## 7. Lo que NO se debe hacer

- **No** escribir once guiones antes del primer cliente
- **No** prometer voz hasta que la investigación cierre
- **No** dejar que el bot diga un precio que no vino de la plataforma
- **No** abrir un rubro nuevo porque el core lo declara — se abre porque alguien paga
- **No** vender «un chatbot». Se vende un puesto de trabajo cubierto

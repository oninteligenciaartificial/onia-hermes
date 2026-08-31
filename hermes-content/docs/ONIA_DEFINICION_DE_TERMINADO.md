# Qué falta para que el producto esté terminado

> **Doc vivo, sin fecha: se EDITA.** Es el norte que leen los cuatro carriles y sus loops.
> Escrito el 2026-08-31 por decisión de Sergio: *"cómo querés escribirles si ni siquiera el
> producto está terminado; dedicate a terminar el producto y recién escribimos"*.

---

## Las tres reglas que ordenan todo (Sergio, 2026-08-31)

**1. Si algo está roto, ARREGLALO. Escribirlo no lo cierra.**
> *"Dejá de poner trabas, andá punto por punto pero andá avanzando. Si decís que un cliente no puede conectar WhatsApp, entonces hacé que sea posible."*

Nace de un caso del mismo día: se descubrió que un cliente conecta WhatsApp y su bandeja queda
vacía, y **se escribió un documento sobre el problema en vez de arreglarlo**. Documentar es lo
que se hace DESPUÉS, en el commit.

**2. Sin credenciales NO te quedás pensando: desarrollás hasta el borde.**
> *"Si no tenés credenciales, no te quedes pensando, desarrollá hasta donde puedas y luego colocamos credenciales."*

Una credencial que falta **no es un bloqueo del desarrollo**: es la última variable de entorno.
Se construye el circuito entero detrás de un flag, se prueba con mock, y enchufar la credencial
es un `env` y un reinicio. Un ítem sólo se marca bloqueado cuando **ninguna línea** se puede
escribir sin el dato.

**3. El objetivo es llegar a ser como Lety.** Traducido a capacidades verificables en
`ONIA_NIVEL_REFERENTES_BRECHA.md`, no como eslogan.

---

## La regla que ordena todo lo demás

**No se le escribe a un prospecto calificado con el producto a medias.** Un lead bueno se
quema una sola vez.

Hay **siete personas reales** esperando —3 pedidos de acceso y 4 que le escribieron al bot,
incluido *"estoy evaluando un sistema de gestión para una clínica odontológica de 4
doctores"*— y **no se les contesta hasta que esta lista esté cerrada.** Están anotadas en
`ONIA_RADAR_DECISIONES_PRODUCTO.md` §8 y en la cola del chatbot, no se pierden.

---

## Terminado NO significa "sin pendientes"

Significa: **nada de lo que el cliente ve o compra es falso, y nada de lo que paga está
roto.** Un pendiente que el cliente nunca toca no frena la venta. Una promesa que no se
cumple, sí.

Por eso esta lista tiene sólo dos clases de cosas:

- 🔴 **Roto** — el cliente lo compra y no funciona.
- 🟠 **Falso** — se lo vendemos y no es cierto.

Todo lo demás va a las colas de cada carril, no acá.

---

## Lo que falta, en orden

### 🔴 1. Un cliente conecta su WhatsApp y su bandeja queda vacía

La llave de tenencia de la bandeja es `clinic_settings.chatwootInboxId`, y es **un slot
único** que se llena con el inbox **web** al crear la organización
(`app/api/admin/clinics/route.ts:97`). Nunca se pisa
(`lib/chatbot/canal-web.ts:27`, `app/api/admin/chatbots/route.ts:53`), y la única pantalla
que lo muestra es de sólo lectura (`WhatsAppOrgConfig.tsx:215`).

**Ya no es teoría:** hay **cuatro conversaciones reales** en inboxes que no son de ninguna
organización, así que nadie las puede ver en `/inbox`.

**Terminado =** un mensaje enviado al número del cliente aparece en su bandeja, **mirado con
captura**. Lo mínimo que lo logra es un PATCH de superadmin que apunte una org a un inbox
existente — no hace falta una tabla de N inboxes hasta que alguien tenga web **y** WhatsApp.

**Carril:** chatbot. Es el ítem 2 de su cola.

### 🟠 2. Vendemos que el bot agenda, y el bot no agenda

`lib/pricing.ts:64` vende *"contesta, califica, **agenda**"*. El motor dice lo contrario,
literal: `bot/recepcionista.mjs:232` — *"El bot no agenda ni vende solo"*. El canal
`whatsapp_chatwoot → lead_conversacion` está declarado en `lib/onia-core/intake.ts:15` y
**nadie lo llama**. La tabla `bot_conversations` **no existe** en el schema.

Un prospecto lo descubre **en la demo**. Es la regla de "no fabricar", rota en el material
que cobra Bs 390.

**Terminado =** o el bot agenda, o el precio deja de decir que agenda. **Hay un escalón
barato:** la agenda pública ya existe y crea citas reales (`app/(public)/book/[orgSlug]`,
`Organization.slug` es único), así que alcanza con que el bot mande el link de reserva de
esa organización en vez de derivar. Tres archivos del motor.

**Carril:** chatbot.

### 🔴 3. El agente que trae clientes no se puede encender nunca

`lib/onia-core/modules/agents-runtime.ts:102-116` exige `requiresFeature:
"addon.inmobiliaria"` — **una clave que no está en el catálogo de add-ons**. Por eso da
`kind_not_enabled` en las 14 corridas diarias medidas. Recall y cobrador corren; **el único
agente que persigue plata nueva, no.**

**Terminado =** la clave existe y el agente se puede encender para una organización.

**Carril:** producto.

### 🟠 4. El cobro es manual — y se construye hasta el borde, no se espera

Sin credenciales del BCP no hay QR: el cliente transfiere y alguien aprueba a mano. El checkout
ya no promete lo que no hay (PR #54), así que **no es falso** — pero es fricción en el único
momento donde entra la plata.

⚠️ **Esto NO es un bloqueo del desarrollo** (regla 2). Lo que falta es la credencial, no el
código. Se construye entero y se prueba con mock:

- El circuito de cobro por QR de punta a punta, **detrás de un flag apagado**.
- El manejador del webhook de confirmación de pago, con su firma validada.
- La activación automática de la cuenta al confirmarse el pago.
- Tests con un proveedor simulado, como ya se hizo con el emisor fiscal en mock.

**Terminado =** el circuito completo pasa sus tests con el mock, y encender el real es **poner
la credencial en el env y prender el flag**. Nada de código nuevo ese día.

---

## Lo que NO entra en esta lista, y por qué

| Qué | Por qué espera |
|---|---|
| Que el bot conteste **fuera de guion** con LLM | Afloja el candado que nos hace más seguros que Sendy. **Decisión de Sergio**, no deuda |
| Métricas del asistente | El dueño no las compra; las mira después de tener conversaciones |
| Instagram DM y Messenger como canal del cliente | WhatsApp y widget ya cubren la promesa que vendemos |
| Difusiones y voz | Le sirven a un e-commerce, no a una clínica. Y desde el 1-oct cada mensaje cuesta |
| Multi-sede | No existe y nadie lo pidió. Si un cliente lo necesita, se cotiza |
| UI/UX del dashboard | Aprobado y en curso — no bloquea vender |

---

## Cómo se sabe que está terminado

Los cuatro puntos cerrados **y verificados mirando la pantalla**, no por un check verde.

Recién ahí se les escribe a los siete que están esperando — empezando por la clínica de
cuatro doctores, que es el lead más calificado que el sistema recibió nunca.

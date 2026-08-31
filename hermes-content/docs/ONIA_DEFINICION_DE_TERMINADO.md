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

### ✅ 3. El agente captador SÍ se puede encender — era un fantasma (cerrado 2026-08-31)

Este punto decía que `requiresFeature: "addon.inmobiliaria"` era **"una clave que no está en
el catálogo de add-ons"**. Es **falso**, y lo era ya cuando se escribió: la clave entró a
`ADDON_IDS` el **2026-08-13**, commit `4077f2c`.

**La cadena está cerrada, verificada eslabón por eslabón:**

| Eslabón | Dónde | Estado |
|---|---|---|
| La clave existe | `lib/platform/types.ts:73` (`ADDON_IDS`) → `addon.inmobiliaria` es `FeatureKey` válida | ✅ |
| Se puede otorgar por API | `POST app/api/admin/organizations/[id]/entitlements/route.ts:101` — valida con `isFeatureKey`, catálogo cerrado fail-closed | ✅ |
| Hay pantalla para hacerlo | `admin/organizations/[id]/capacidades/CapacidadesOrg.tsx:56` lista **todos** los `ADDON_IDS`, y el :31 le escribe su descripción propia | ✅ |
| El runtime lee lo que esa pantalla escribe | ambos van a `prisma.organizationEntitlement` por `(organizationId, featureKey)`, que es **`@@unique`** (`schema.prisma:1929`) — una fila, sin ambigüedad | ✅ |
| Está probado en los dos sentidos | `agents-runtime.test.ts:613` — sin add-on → `kind_not_enabled` y cero writes; con add-on (`conAddon()`) → `draft_message` en `pending_approval` | ✅ |

**El `kind_not_enabled` de las 14 corridas no es una falla: es la respuesta correcta.** Ninguna
org lo tiene otorgado porque nadie lo compró. La cola ya había rechazado encenderlo para todos,
con motivo: el copy del captador es **inmobiliario**, y prenderlo global le estrenaba una fila
"captador inmobiliario" a cada clínica dental.

**Por qué el error fue creíble, que es lo que hay que recordar:** hay **dos** catálogos y el punto
los mezcló. `lib/pricing.ts` es el catálogo **comercial** (lo que se cobra) y ahí
`inmobiliaria` **no está**; `lib/platform/types.ts` es el catálogo de **feature keys** (lo que se
puede otorgar) y ahí sí está. Buscar la clave en el archivo que CLAUDE.md declara "fuente única
de add-ons" y no encontrarla lleva derecho a esta conclusión falsa. Es el mismo error que este
repo ya tiene escrito tres veces con otras caras: **verificar contra el sistema equivocado**.

**El residuo real — y NO entra en esta lista:** al no estar en `pricing.ts`, el add-on **no se
puede comprar**, sólo otorgar a mano (`source: "grant"`). No es 🔴 roto (el LISTO de este punto
era que se pudiera encender, y se puede) ni 🟠 falso: el catálogo de venta **no lo ofrece** —
lo nombra en su sección de lo que falta. Ponerle precio es decisión de Sergio, no deuda técnica.

**Carril:** producto. **Cerrado sin tocar una línea de código: no había nada roto.**

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
**Van 1 de 4:** el 3 cerró el 2026-08-31 al verificarlo — era un fantasma, no había nada
roto. Quedan el 1 y el 2 (carril chatbot) y el 4 (cobro por QR contra mock, que **no**
espera credenciales).

Recién ahí se les escribe a los siete que están esperando — empezando por la clínica de
cuatro doctores, que es el lead más calificado que el sistema recibió nunca.

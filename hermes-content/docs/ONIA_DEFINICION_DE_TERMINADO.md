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
doctores"*— y **no se les contesta hasta que esta lista esté cerrada.** Están anotadas, con
nombre y con lo que dijeron, en [`ONIA_LEADS_ESPERANDO.md`](ONIA_LEADS_ESPERANDO.md).

*(Acá decía que estaban en `ONIA_RADAR_DECISIONES_PRODUCTO.md` §8 y en la cola del chatbot.
**Era falso**: verificado el 2026-08-31, la frase "7 personas" no aparecía en ningún otro
archivo del repo. Los 3 pedidos de acceso nunca corrieron riesgo —tienen tabla y pantalla
propias—, pero los 4 del bot viven en inboxes de Chatwoot que **no pertenecen a ninguna
organización**, y a los dos de WhatsApp —incluido el de los 4 doctores— **no les respondió
nadie, ni una plantilla**.)*

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
(`app/api/admin/clinics/route.ts:97`).

⚠️ **Corregido el 2026-08-31 — la mitad de este punto ya no es cierta, y es la mitad que lo
bloqueaba.** Acá decía que *"la única pantalla que lo muestra es de sólo lectura
(`WhatsAppOrgConfig.tsx:215`)"*. **Es falso contra el `master` de hoy**, y la línea 215 de ese
archivo es un campo de nombre de plantilla, nada que ver. El commit `88c1d56`
(*"el inbox de una org se podia crear pero nunca corregir"*) le puso el formulario editable:
`handleSaveInbox` → `patchWhatsApp({ chatwootInboxId })`, con su mensaje *"Org vinculada al
inbox N"*.

**Y está DESPLEGADO, no sólo en `master`.** Verificado contra el contenedor `onia-platform`
del VPS, no contra el repo: el string `"Org vinculada al inbox"` aparece en el bundle que
sirve hoy (`/app/.next/static/chunks/…` y el chunk SSR de `WhatsAppOrgConfig`). Es la forma
correcta de preguntarlo: la ancestría contra `e5c1ad3` daba lo contrario, porque `e5c1ad3` ya
no es lo desplegado.

**O sea: "lo mínimo que lo logra" —un PATCH de superadmin que apunte una org a un inbox
existente— ya existe y está vivo.** Lo que falta no es construirlo: es **usarlo una vez**.

**Ya no es teoría, y es peor de lo que decía:** medido en producción el 2026-08-31, la única
org con `chatwootInboxId` es `zz-qa-clinica-chatbot-9k651` → inbox **7** (el de QA). Los
inboxes **4 (Onia Web)** y **5 (Onia WhatsApp)** son huérfanos, y ahí están **todos** los leads
reales — incluido el de la clínica de 4 doctores, que lleva días sin que nadie pueda leerlo.
Ver [`ONIA_LEADS_ESPERANDO.md`](ONIA_LEADS_ESPERANDO.md).

**Terminado =** un mensaje enviado al número del cliente aparece en su bandeja, **mirado con
captura**. Con el formulario ya vivo, el camino es: `/admin/organizations/<id>` → vincular la
org al inbox → abrir `/inbox` y MIRAR.

**Carril:** chatbot. Es el ítem 2 de su cola. **Pero el paso que queda es de un minuto y es
una escritura en producción**, así que lo decide Sergio o el dueño del carril — este loop no
escribe en la base de producción.

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

### ✅ 4. El cobro por QR está construido contra el mock — cerrado 2026-08-31

Este punto pedía construir el circuito hasta el borde sin esperar la credencial del BCP.
**Ya estaba construido** cuando se verificó: commit `753718f` (*"feat(pagos): enchufe listo
del QR dinamico del BCP"*), en `master`. Cada línea del "Terminado =" tiene su eslabón:

| Lo que pedía | Dónde está | Estado |
|---|---|---|
| Circuito de cobro por QR de punta a punta | `lib/gateway/bcp-qr.ts` (generación v4 + consulta v3 + mTLS por `BCP_QR_CERT_PATH`) y `app/api/subscription-payment/bcp-qr/route.ts` | ✅ |
| Detrás de un flag apagado | el flag son las env vars: sin ellas `getBcpQrConfig()` da `null`, `app/checkout/page.tsx:84` pasa `bcpQrDisponible={false}` y el checkout sigue manual | ✅ |
| Webhook de confirmación con su firma validada | `app/api/webhooks/bcp/route.ts:55` — `validateBcpCallbackAuth` compara en tiempo constante y es fail-closed (sin `BCP_QR_CALLBACK_*` → 503, no activa nada) | ✅ |
| Activación automática al confirmarse el pago | `app/api/webhooks/bcp/route.ts:120` confirma contra `/Qr/Consult` **antes** de activar y usa el circuito compartido (`evaluateAutoApproval` + `claimPendingPayment` + `buildPlanActivation`), idempotente ante los 3 reintentos del banco | ✅ |
| Tests con proveedor simulado | `lib/gateway/bcp-qr.test.ts:96` levanta un servidor HTTP local y verifica la forma del request contra la spec — no es un mock del propio módulo. **32 tests verdes** con `app/api/webhooks/bcp/route.test.ts` y `app/api/subscription-payment/bcp-qr/route.test.ts` | ✅ |

**El callback del BCP no viene firmado** (sólo Basic `Username:PublicToken`), y por eso la
regla dura del webhook: **ningún plan se activa sin confirmar el pago con `/Qr/Consult`**. Esa
confirmación es la firma que el banco no da.

**Lo que falta es la credencial, tal como este punto ya decía:** URL de producción, el set
Username/Password/AppUserId/PublicToken/BusinessCode y el certificado de `BCP_QR_CERT_PATH`.
Encender = cargar env vars, cero código. Depende de Sergio y del banco.

**Carril:** producto. **Cerrado sin tocar una línea de código: no había nada roto.**

---

## ⚠️ Lección sobre esta lista misma

**De los cuatro puntos que se escribieron el 2026-08-31, DOS eran fantasmas** — el captador y
el cobro por QR. **El 50%**, peor que el 27–46% medido en las colas de los otros carriles.

Se escribieron leyendo docs y corriendo greps, **no la cadena de código**. Los refutaron los
loops de producto y de chatbot, aplicando el mismo Gate 1 que esta lista les exige.

**Esta lista no vale por estar escrita.** Vale mientras cada punto se verifique en vivo antes
de trabajarlo. Un ítem que nadie volvió a mirar es una hipótesis con formato de tarea.

Y lo que sí salió de verificar: el punto 4 era fantasma **pero al correrlo apareció un agujero
real de plata** — el callback del BCP no viene firmado y `/Qr/Consult` verificaba con un id que
salía del mismo callback. Verificar un fantasma no es tiempo perdido.

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
**Van 2 de 4**, los dos del carril producto, y los dos cerraron el 2026-08-31 **sin escribir
una línea**: el 3 era un fantasma y el 4 ya estaba construido. Quedan el **1 y el 2, ambos
del carril chatbot**.

Que dos de cuatro se cierren verificando en vez de desarrollando no es suerte: los puntos se
redactaron describiendo el repo de ese día, y el repo siguió. Por eso el Gate 1 —*¿ya está
hecho?*— corre **antes** de tocar código, no después.

Recién ahí se les escribe a los siete que están esperando — empezando por la clínica de
cuatro doctores, que es el lead más calificado que el sistema recibió nunca.

# Meta / WhatsApp para los clientes de Onia Platform (2026-08-08)

> Pedido de Sergio: *"termina de mirar lo de Meta para los clientes"* — o sea: cómo hacemos
> que CADA cliente tenga su propio WhatsApp atendido desde nuestro sistema, qué exige Meta,
> cuánto cuesta de verdad, y qué tenemos que construir nosotros.
>
> Todo verificado contra documentación oficial de Meta (developers.facebook.com /
> whatsapp.com/legal) el **2026-08-08**, más auditoría de solo lectura del repo producto
> `C:\dev\proyectos\onia-platform` (rama `master`, tip `6b8f152`). Lo que Meta **no publica**
> está marcado como tal: no hay ni una estimación silenciosa en este documento.

**Estado de partida verificado hoy:** app de Meta "Onia Bot" `1078962684709749`, verificación
del negocio **APROBADA**, app **publicada hoy** (salió de modo desarrollo). Número propio de
Onia con el bot vivo: **+591 75414930** (el 78491375 quedó en un portfolio fantasma sin bot y
hoy se retiró de toda la web). Chatwoot corre en el VPS (cuenta OnIA Agency) con **0 inboxes**,
y la decisión previa sigue en pie: Chatwoot es herramienta **interna**, no se le da al cliente.

---

## 1. La respuesta en 8 líneas

1. Cada cliente va a tener **su propio número y su propia cuenta de WhatsApp (WABA)**, a su nombre, no bajo la nuestra.
2. El cliente la conecta **desde un botón en nuestro panel** (Embedded Signup de Meta): se loguea con su Facebook, elige o crea su cuenta, verifica su número por SMS y listo.
3. Para que ese botón exista, Meta nos tiene que aprobar como **Tech Provider**: verificación del negocio (ya la tenemos) + App Review de dos permisos + Access Verification.
4. Con Tech Provider, **el cliente le paga a Meta directo con su tarjeta**; nosotros le cobramos nuestro software aparte. Revender mensajes exige ser Solution Partner y hoy no conviene.
5. Meta cobra **por mensaje**: en Bolivia utility/auth USD 0,0113 y marketing USD 0,0740. Una clínica con 200 recordatorios gasta **USD 2,26/mes** (Bs 26). Es barato.
6. **El 1-oct-2026 se acaba lo gratis**: las respuestas dentro de la ventana de 24 h pasan a cobrarse. Un caso de atención pura salta de casi cero a ~USD 23/mes. Quedan ~8 semanas.
7. De nuestro lado el envío existe y el webhook entrante existe, pero **no guardamos ni un mensaje, no hay bandeja para que el negocio conteste, y el alta la hace el superadmin pegando el token a mano**.
8. Se puede vender **1 a 3 pilotos hoy** con nuestra cuenta y consentimiento escrito; el producto de verdad arranca cuando esté Tech Provider + bandeja.

---

## 2. Runbook de Sergio — los pasos exactos, en orden

> Cada paso dice qué hacer, dónde, y qué esperar. Los pasos 1 y 2 ya están hechos.

### Paso 0 (HECHO) — Verificación del negocio
Aprobada. Es prerrequisito de absolutamente todo lo demás. No hay nada que rehacer.

### Paso 1 (HECHO HOY) — Publicar la app
"Onia Bot" pasó de modo desarrollo a modo activo. **Requisito de App Review**: Meta no revisa
apps en borrador. Ya está cubierto.

### Paso 2 — App Review de los dos permisos (empezar ya)
**Dónde:** App Dashboard → App Review → Permissions and Features
(`https://developers.facebook.com/apps/1078962684709749/app-review/permissions/`).

Pedir **Advanced Access** de exactamente dos permisos:

| Permiso | Para qué | Obligatorio |
|---|---|---|
| `whatsapp_business_management` | Acceder a las WABAs de los clientes, crear/gestionar plantillas y números | Sí |
| `whatsapp_business_messaging` | Enviar mensajes en nombre de los clientes | Sí |

**No pedir nada más.** `business_management` solo lo exige el flujo de Solution Partner, y la
doc de Meta es explícita: *"requesting unnecessary permissions is a common reason for rejection"*.
`whatsapp_business_manage_events` solo hace falta si registramos eventos de conversión, y se
auto-aprueba si ya hay Advanced en messaging.

**Regla dura que hay que entender antes de mandar:** *"If Advanced access is not approved for a
given permission, the permission does not appear in the Embedded Signup flow and your clients
cannot grant it to your app."* Sin esta aprobación, el botón de alta simplemente no puede pedir
lo que necesita.

#### Los screencasts: qué tiene que mostrar cada video

**Un video POR permiso, separados.** Combinar los dos permisos en un solo video es causa
documentada de rechazo.

| Video | Tiene que mostrar |
|---|---|
| **Video 1 — `whatsapp_business_management`** | **Crear una plantilla de mensaje** desde nuestra interfaz, de punta a punta (y gestión del número de la cuenta). Se ve el panel de Onia, se llena la plantilla, se envía a Meta, aparece el estado. |
| **Video 2 — `whatsapp_business_messaging`** | **Enviar un mensaje y verlo llegar** al WhatsApp del destinatario, con el flujo entrante y saliente: el negocio manda desde nuestro panel, el mensaje aparece en el celular, el usuario responde, la respuesta vuelve al panel. |

Reglas de forma, todas de la doc oficial:
- Debe verse **la interfaz que usa la empresa cliente**, no la del consumidor final.
- **Grabación de pantalla, no capturas.** Cada video con su descripción escrita de para qué usamos el permiso.
- Alternativa que Meta acepta si la UI todavía no está lista: **script cURL contra la API** o grabación de las pantallas de WhatsApp Manager.
- **Qué esperar:** Meta reporta **~24 horas de promedio** de revisión.

### Paso 3 — Access Verification (en paralelo con el paso 2)
**Dónde:** App Dashboard, formulario que se dispara al pedir Advanced Access de
`whatsapp_business_management` (uno de los ~35 permisos que la gatillan).
Doc: `https://developers.facebook.com/docs/development/release/access-verification`.

- **No es un video: es un formulario.** El admin del negocio categoriza la app y describe cómo
  usa datos de otras empresas para prestarles un servicio.
- Prerrequisito: verificación del negocio completa (la tenemos) + cuenta en buen estado.
- **Qué esperar: decisión en ~5 días.**
- Si no se completa: hay **60 días de gracia** y después *"all calls to endpoints that require
  any of the permission above will gradually be subjected to verification checks"* → error 100.

> ⚠️ **Contradicción real entre dos páginas oficiales de Meta, la reporto sin resolverla:** la
> página de Embedded Signup presenta Access Verification como algo que solo *sube el cupo de
> onboarding*; la página de Access Verification la presenta como *condición para que las llamadas
> con esos permisos no empiecen a fallar*. **Lectura prudente: tratarla como obligatoria.**

### Paso 4 — Cupo de onboarding: saber con qué números jugamos
Cita oficial: *"By default, you can onboard up to 10 new business customers in a rolling 7-day
window"*. Con verificación del negocio + App Review + Access Verification sube a **200 por
semana**. Para el volumen real de Onia (primeros clientes de 6 rubros), **10 por semana alcanza
de sobra** para arrancar incluso antes de tener Access Verification.

### Paso 5 — Construir el Embedded Signup (nosotros, no Sergio)
SDK JS de Facebook + `FB.init()` + `FB.login()` con `config_id` de una configuración de
*Facebook Login for Business*, más un listener de `message` para el session logging. El dominio
tiene que ser **HTTPS y estar declarado en allowed domains**, si no el callback no llega.
**Usar v4: la v2 se deprecia el 15-oct-2026.**

### Paso 6 — Probar el circuito de pago con UN cliente real, antes de vender
Como Tech Provider, el cliente carga su tarjeta en su propia WABA vía WhatsApp Manager. Meta
**no publica nada específico de Bolivia** sobre métodos de pago aceptados; el requisito publicado
es "método de pago válido". Post-devaluación, que un comercio boliviano tenga tarjeta
internacional debitable en USD de forma recurrente es **fricción real**. Probar el circuito
completo con un cliente antes de prometérselo a los seis rubros.

### Paso 7 — Solution Partner: solo si cambia la decisión comercial
Requiere ser Meta Business Partner, es *"a lengthy process"*, y te da línea de crédito propia
para facturarle vos los mensajes al cliente. **No hacerlo ahora** (ver §4).

---

## 3. Qué puede hacer un cliente HOY vs. qué necesita el Tech Provider aprobado

### HOY, sin App Review

Técnicamente **sí** se puede meter el número de un cliente en **nuestra** WABA a mano — es
exactamente lo que hicimos con el +591 75414930. No hace falta Advanced Access para operar
**assets propios**; el Advanced Access se necesita para assets de *otras* empresas. Límites
publicados: un portfolio arranca con **2 números registrados, ampliable hasta 20**, y hasta
**20 WABAs**; una WABA pertenece a un solo portfolio.

**Pero tiene cuatro techos duros y un problema legal:**

1. **El límite de mensajería es COMPARTIDO.** Desde el 7-oct-2025: *"Messaging limits are
   calculated and set at the business portfolio level and are shared by all business phone
   numbers within a portfolio."* Diez clientes comparten **un solo** cupo diario de destinatarios
   únicos: un cliente que hace campaña se come el cupo de todos los demás. **Este es el argumento
   que mata el modelo, y es técnico, no legal.**
2. **Tope de 20 números** por portfolio.
3. **Toda la factura de Meta cae en nuestro método de pago**, y no existe reventa oficial de
   mensajes salvo Solution Partner.
4. **Sin Embedded Signup no hay coexistence**: el cliente pierde el uso de la app WhatsApp
   Business en ese número, o usamos un número nuevo.

**Legalidad.** Los [WhatsApp Business Terms for Service Providers](https://www.whatsapp.com/legal/business-terms-for-service-providers)
(última modificación 12-jun-2018) exigen a quien despliega la solución "on behalf of your Clients":
- estar *"authorized by WhatsApp to deploy the WhatsApp Business Solution as a service provider"*;
- asegurar que cada cliente aceptó los términos — y si no, *"you represent and warrant that you
  have accepted them on behalf of your Client and are **jointly and severally liable**"*
  (responsabilidad solidaria por los actos del cliente);
- *"You may not create a WABA on behalf of your Client without that Client's request and consent"*;
- *"you must not block or prevent a Client from accessing its WABA"*.

Y la [política comercial](https://whatsappbusiness.com/es-la/policy/): *"No puedes usar los
Servicios de WhatsApp Business para hacerte pasar por otra empresa"* — poner el display name con
la marca del cliente bajo nuestra cuenta camina cerca de esa línea.

**Veredicto honesto: sirve para 1 a 3 pilotos**, con consentimiento escrito, número nuevo (no el
que el cliente ya usa) y sabiendo que el cupo es compartido. **No es base de producto.**

### CON Tech Provider aprobado

- **Onboarding embebido**: el cliente conecta su número desde un botón en nuestro panel, en un
  popup de Meta, sin salir del sitio.
- **WABA propia del cliente**, a su nombre, en su business portfolio; nuestra app recibe acceso
  vía token.
- **Cada cliente con su propia escalera de mensajería** — se acabó el cupo compartido.
- **Coexistence**: el cliente **sigue usando la app WhatsApp Business en su celular con el mismo
  número** mientras nuestro sistema lee y escribe por Cloud API. Requiere ser Solution Partner o
  Tech Provider **y** usar Embedded Signup con session logging.

### El flujo tal como lo ve el CLIENTE (8 pasos, textual de la doc)

1. Autenticarse con sus credenciales de Facebook/Meta Business
2. Aceptar términos (Cloud API, WhatsApp Business, Meta, Marketing Messages Lite API)
3. Elegir las APIs de WhatsApp y aceptar sus términos
4. Dar acceso a nuestra app a sus assets de WhatsApp
5. Elegir o crear su business portfolio
6. Elegir o crear su WABA
7. Ingresar y **verificar su número** (SMS o llamada)
8. Poner el **display name** del perfil

Al cerrarse el popup recibimos un **`code` con TTL de 30 segundos**, el `WABA ID` y el
`phone number ID`. Hay que canjearlo **server-side, inmediatamente** (canjearlo client-side está
prohibido por la doc).

### Dónde se traba, en la práctica

| Traba | Detalle (fuente oficial) |
|---|---|
| **El número ya está en WhatsApp** — el caso normal en Bolivia | Sale por **coexistence**, pero exige app **2.24.17+**; el cliente recibe un código y toca "Conectar a la Business Platform". Costos: se **desvinculan todos los dispositivos compañeros** (WhatsApp Web/Desktop), se deshabilitan mensajes temporales, ver-una-vez, ubicación en vivo y listas de difusión, y el throughput queda fijo en **20 mps**. |
| Sincronización del historial | Hay **24 h**; si no, *"they must be offboarded and they must complete the flow again"*. |
| Método de pago | Tarjeta en su propia WABA. **Meta no publica nada específico de Bolivia.** |
| Display name | Estados APPROVED / PENDING_REVIEW / DECLINED, **10 cambios cada 30 días**, y **14 días** para re-registrar el número tras la aprobación. **Meta no publica el tiempo de revisión.** |
| Cliente que ya trabajó con otro partner | Si compartió línea de crédito con otro, *"may see an error when attempting to switch to a new partner"*. |
| El `code` de 30 s | Backend lento o intercambio client-side = onboarding caído. |

### La escalera de mensajería está desactualizada en nuestros docs viejos

**250 → 1.000 → 10.000 → ilimitado YA NO EXISTE.** Vigente desde el **7-oct-2025**:

**250 → 2.000 → 10.000 → 100.000 → Ilimitado**, y **a nivel business portfolio**, no por número.

Mide destinatarios **únicos** a los que se entregan mensajes **fuera** de la ventana de atención,
en ventana móvil de 24 h. Responder dentro de la ventana no consume cupo.
- **250 → 2.000**: verificación del negocio, o verificación liderada por el partner, o volumen
  (2.000 mensajes entregados fuera de ventana a números únicos en 30 días, con plantillas de
  buena calidad).
- **De 2.000 en adelante: automático**, si se manda con calidad y *"in the last 7 days, your
  business has utilized at least half of your current messaging limit"*. Sube un nivel **en 6 horas**.
- Desaparece el estado "Flagged" y **ya no se baja el límite** por caída de calidad.

---

## 4. La plata

### Tarifas para Bolivia — rate card oficial

Bolivia **no tiene tarifa propia**: cae en el mercado regional **"Rest of Latin America"** (con
Costa Rica, Rep. Dominicana, Ecuador, El Salvador, Guatemala, Haití, Honduras, Jamaica,
Nicaragua, Panamá, Paraguay, Puerto Rico, Uruguay y Venezuela). Fuente: sección *Country calling
codes* de la doc oficial; código 591 / BO.

Rate card USD descargada del CSV oficial de Meta (encabezado literal: *"Cost per message in USD
on the WhatsApp Business Platform, effective July 1, 2026"*; fila
`Rest of Latin America,USD,0.0740,0.0113,0.0113,n/a,n/a`):

| Categoría | USD/mensaje | Bs/mensaje (TC 11,37) |
|---|---|---|
| Marketing | **0,0740** | 0,841 |
| Utility | **0,0113** | 0,128 |
| Authentication | **0,0113** | 0,128 |
| Service | **gratis** (hasta 30-sep-2026) | 0 |

> El USD sale del CSV de Meta. El **TC 11,37 Bs/USD es supuesto nuestro** (post-flotación
> 26-jun-2026) — **verificar contra BCB antes de facturar**.

**Volume tiers:** utility 0–100.000 msg/mes y auth 0–120.000 msg/mes van a tarifa de lista. El
primer descuento (−5%) recién aparece pasando 100.001 mensajes/mes. **Onia jamás los va a tocar.**

**Qué es gratis hoy** (modelo por-mensaje vigente desde 1-jul-2025):
- Todo mensaje **entrante** del usuario al negocio.
- Todo mensaje **no-plantilla** dentro de la ventana de atención (CSW) de 24 h.
- **Plantillas utility** entregadas dentro de una CSW abierta.
- **Todo**, incluidas plantillas, durante 72 h en una *free entry point window* (anuncio
  Click-to-WhatsApp o botón CTA de página de Facebook).
- **No existe cupo mensual gratis de conversaciones** — se eliminó el 1-nov-2024.

### 🔴 Lo que cambia en 8 semanas

| Fecha | Cambio |
|---|---|
| **1-ago-2026** (ya ocurrió) | Meta cobra los mensajes de **Meta Business Agent** por token: **USD 2,00 por 1M tokens**, ~20.000–25.000 tokens por mensaje ≈ **4–5 ¢ USD/mensaje**. Onia usa IA propia → **no cae acá, y no debe caer**: 4–5 ¢ contra 1,13 ¢ es 4x más caro. |
| **1-oct-2026** | *"Meta will charge for service messages, which have not been charged since November 2024."* Cada respuesta del negocio dentro de la ventana de 24 h pasa a cobrarse **a la misma tarifa que utility/auth**. Sin volume tiers. |
| **1-oct-2026** | Las **plantillas utility dentro de la CSW dejan de ser gratis**. |
| — | La ventana FEP de 72 h **sigue gratis**. Es la única palanca que queda. |

> ⚠️ **Incertidumbre marcada:** Meta dice que publicará las tarifas vigentes desde el 1-oct-2026,
> incluidas las de service, **no más tarde del 1-sep-2026**. El 0,0113 para service es lo que la
> doc *describe* ("mismas tarifas que utility y authentication"), **no un número publicado
> todavía**. Puede subir.

### Costo por caso

Supuestos explícitos: tarifas de arriba, TC 11,37, recordatorios enviados **fuera** de la ventana
de 24 h (lo normal: el paciente no escribió en las últimas 24 h).

**Caso 1 — Clínica dental, 200 recordatorios/mes**

| Concepto | Cant. | Hoy | Desde 1-oct-2026 |
|---|---|---|---|
| Recordatorios (utility, fuera de CSW) | 200 | $2,26 | $2,26 |
| Paciente responde "confirmo" (entrante) | ~80 | gratis | gratis |
| Clínica contesta (service, dentro CSW) | ~80 | **gratis** | **$0,90** |
| **Total** | | **$2,26 · Bs 26** | **$3,16 · Bs 36** |

**Caso 2 — Comercio, 800 cobranzas/mes**

| Escenario | Hoy | Desde 1-oct-2026 |
|---|---|---|
| Como **utility** (800 × 0,0113) | $9,04 · Bs 103 | $9,04 |
| + respuestas del comercio (~400 service) | gratis | +$4,52 |
| **Total como utility** | **$9,04 · Bs 103** | **$13,56 · Bs 154** |
| **Si Meta la recategoriza a marketing** (800 × 0,0740) | **$59,20 · Bs 673** | **$63,72 · Bs 725** |

> **La cobranza es el caso de riesgo, y el riesgo no es el volumen: es la CATEGORÍA.** Meta define
> utility como *"non-promotional"* y da como ejemplo válido *"Reminder: Your monthly payment for
> {{service}} will be billed on {{date}}"*. Pero *"Templates with mixed content (for example, both
> utility and marketing…)"* son marketing. Un "pagá hoy y te damos 10% de descuento" convierte
> Bs 103 en Bs 673. Peor: desde **1-jul-2024** Meta recategoriza plantillas ya aprobadas de forma
> automática con **1 día de aviso**, y desde **16-abr-2025**, si te marcaron por abuso de
> categorización, **el cambio es instantáneo y sin aviso**.

**Caso 3 — Inmobiliaria, 500 consultas entrantes/mes**

| Concepto | Hoy | Desde 1-oct-2026 |
|---|---|---|
| 500 mensajes entrantes del usuario | gratis | gratis |
| ~2.000 respuestas del negocio dentro de CSW | **$0,00** | **$22,60 · Bs 257** |
| Re-enganche fuera de ventana (~75, utility) | $0,85 | $0,85 |
| **Total** | **~$0,85 · Bs 10** | **~$23,45 · Bs 267** |

> Este caso pasa de **casi gratis a Bs 267/mes sin que el cliente cambie absolutamente nada**. Es
> el que rompe cualquier promesa de "atención ilimitada". Palanca real: si esas 500 consultas
> entran por **anuncio Click-to-WhatsApp**, la ventana FEP de 72 h mantiene la entrega gratis
> incluso después del 1-oct. Si entran por el botón de la web, no. Y si se respondieran con Meta
> Business Agent: 2.000 × ~$0,045 = **~$90/mes**, cuatro veces más caro.

### ¿Aguanta el modelo de cupo de Onia?

Datos reales del repo (`lib/pricing.ts` → `WHATSAPP_ADDON`, `lib/plan-limits.ts`): N1 = Bs 300 de
instalación + **Bs 200/mes**, `metaPassthrough: false`, cupo `operationalMonthlyLimit: 200`. N2
(Bs 550/mes) y N3 (desde Bs 900/mes) sí son `metaPassthrough: true`.

**El cupo aguanta. El que no aguanta es el supuesto de categoría.**

| N1 con cupo lleno (200 msg) | Costo Meta | % del precio Bs 200 |
|---|---|---|
| Todo utility (hoy) | Bs 26 | **13%** — sano |
| Todo utility + respuestas (post 1-oct) | Bs 36 | **18%** — sano |
| Si se recategoriza a marketing | **Bs 168** | **84%** — muerto |

N1 manda **una sola plantilla fija aprobada** (`appointment_reminder`, utility,
`lib/whatsapp.ts:100`). Con una sola plantilla el riesgo de categoría está controlado → **que Onia
absorba el costo Meta en N1 es defendible. No lo cambies.**

**Tres agujeros concretos, con números:**
1. **`WHATSAPP_ADDON.meta.utilityBob = 0.113` implica TC 10,0.** Al TC real 11,37 el costo es
   0,1285 Bs/msg → el producto **subestima el costo Meta en ~13%** y el label del admin muestra un
   número viejo.
2. **El contador de cupo no cuenta lo que va a costar.** `checkWhatsAppAddon()` suma recordatorios
   + `onia_core_dispatches`; la ruta `sendWhatsAppText()` (las respuestas de la IA de N2/N3) **no
   descuenta cupo**. Hoy da igual porque son gratis. **Desde el 1-oct-2026 son facturables y no
   tienen tope ninguno.** El caso 3 muestra el daño: Bs 257/mes sin control. **Vence el 30-sep.**
3. **`markupPct: 20` ("Meta pass-through al costo + 20%") no se puede cobrar** — ver abajo.

### Quién le paga a Meta — recomendación

> **Que le pague el cliente directo a Meta. No se discute: hoy no hay alternativa.**

| | Tech Provider (lo que es Onia hoy) | Solution Partner |
|---|---|---|
| Línea de crédito | No | Sí |
| Quién le factura al cliente el consumo de API | **Meta, directo** | **Nosotros** |
| Requisito | Verificación de negocio + App Review | Meta Business Partner, *"a lengthy process"* |
| Riesgo | Ninguno | *"You are the 'Bill To Party'… liable for and will pay Meta for all WhatsApp Business Platform spend made by these businesses."* |

Cita oficial: *"Tech Providers do not have credit lines. Instead, clients onboarded by Tech
Providers must provide their own payment method after onboarding is complete. Meta will then bill
these clients for API usage, and the Tech Provider will bill for other services."*

Con 0 clientes pagando, tomar responsabilidad legal por el gasto de terceros ante Meta es regalar
riesgo a cambio de un margen que en el mejor caso es **20% sobre Bs 103 = Bs 21/mes**. No vale.

Además, **`markupPct: 20` es hoy una promesa que el sistema no puede cumplir**: bajo Tech Provider
Onia nunca ve una factura de Meta por el cliente, así que no hay nada sobre lo que aplicar 20%.
Sacarlo o renombrarlo como fee operativo del add-on.

**El bloqueo real no es el precio, es el medio de pago.** Bs 103/mes de Meta contra Bs 550/mes de
N2 es ruido — se vende solo. Lo difícil es la tarjeta internacional.

### Si el cliente no le paga a Meta

**Sí, se corta solo.** Error de Cloud API **`131042`** — *"There was an error related to your
payment method"*. Causas listadas por Meta: cuenta de pago no vinculada a la WABA, línea de
crédito excedida, cuenta de pago no activa, WABA suspendida, zona horaria o moneda sin configurar.
El envío falla, el número queda mudo. Es **por-WABA**: solo se corta ese cliente.

- **Plata: no nos afecta.** Bajo Tech Provider, Meta le factura al cliente.
- **Reputación: sí, y feo.** El bot se muere sin explicación y el cliente asume que se rompió Onia.
- **Si algún día pasás a Solution Partner: sí, y caro.** Sos el Bill To Party, pagás vos, y para
  frenar la sangría tenés que **revocar la línea de crédito a mano**.

**Agujero concreto:** `lib/whatsapp.ts:128-130` y `:159-161` hacen
`throw new Error("WhatsApp API error: " + JSON.stringify(err))` sin mirar el código. **Un corte por
falta de pago hoy es indistinguible de un bug.**

---

## 5. Qué hay que construir, priorizado

> Estado auditado en `C:\dev\proyectos\onia-platform` (solo lectura, `master`, tip `6b8f152`).

### Lo que ya existe / a medias / no existe

| Pieza | Estado | Nota |
|---|---|---|
| Envío saliente a Meta | **existe** | `lib\whatsapp.ts`, Graph v21.0, plantillas + texto |
| Credenciales por organización (datos) | **existe** | `ClinicSettings`, 1:1 con org |
| Credenciales por organización (garantía) | **a medias** | **fallback silencioso al número global de ONIA** |
| Token del cliente cifrado | **no existe** | texto plano en la DB |
| Webhook entrante + firma HMAC | **existe** | bien hecho (`timingSafeEqual`, 200 inmediato, rate-limit) |
| Routing multi-tenant entrante | **existe** | por `phone_number_id`; **falla en silencio si no matchea** |
| Persistencia de mensajes | **no existe** | solo estado de sesión |
| Bandeja/inbox en el panel | **no existe** | el negocio no puede contestar desde nuestro sistema |
| Webhook `statuses` (entrega/precio) | **no existe** | sin conciliación contra la factura de Meta |
| Media entrante (foto/audio) | **no existe** | solo procesa `type === "text"`, el resto se descarta |
| Alta self-service del número (Embedded Signup) | **no existe** | hoy el superadmin pega el token a mano |
| Suscripción de la WABA del cliente a la app | **no existe** | 0 llamadas a `subscribed_apps` en todo el repo |
| Plantillas por org | **a medias** | solo un `templateName` de texto, sin gestión |
| Flag `whatsappAddon` | **existe** | binario; **los 3 niveles vendidos no se distinguen** |
| Compra del add-on por el cliente | **no existe** | el botón es un click-to-chat a nuestro WhatsApp |
| Cupo mensual: función correcta | **existe** | `checkWhatsAppAddon`, fail-closed |
| Cupo mensual aplicado en todas las rutas | **a medias** | **3 de 5 rutas no cuentan**; el bot no cuenta nunca |
| Chatwoot como herramienta interna | **a medias** | cableado, 0 inboxes, `sendAgentMessage()` es **código muerto** |
| Escalación a humano punta a punta | **a medias** | sin inbox = **paciente colgado** |

**Las cinco rutas de salida, cada una con reglas distintas** (esto es el problema estructural):

| Ruta | Archivo | Chequea add-on | Chequea cupo | Cuenta el mensaje |
|---|---|---|---|---|
| Cron recordatorios | `app\api\cron\appointment-reminders\route.ts` | sí | parcial | sí |
| Despachador de agentes | `lib\onia-core\dispatch\channels.ts` | sí | **completo** | sí |
| Bot (respuestas al paciente) | `lib\whatsapp-bot.ts` | 1 vez al entrar | 1 vez al entrar | **NO** |
| Webhook Chatwoot → paciente | `app\api\webhooks\chatwoot\route.ts` | **NO** | **NO** | **NO** |
| Proxy n8n | `app\api\n8n\whatsapp\send\route.ts` | sí | **NO** | **NO** (y usa Graph v19.0) |

### Prioridad y tamaño

**Bloqueantes para vender el add-on a un cliente con su propio número**

| # | Qué | Tamaño | Por qué |
|---|---|---|---|
| 1 | **Un único punto de salida con contador** — mover las 5 rutas a `enviarWhatsApp(orgId, …)` que chequee cupo, envíe y **registre la fila** (tabla `whatsapp_messages` con `providerMessageId`, dirección, categoría) | **M — 2 días** | Sin esto, cualquier número de costo que le demos al cliente es inventado. Elimina el sobregasto y habilita el historial. |
| 2 | **Matar el fallback global** — si la org no tiene credenciales, lanzar. Reusar `isWhatsAppConfigured` que ya existe | **S — 2 h** | Hoy le escribimos al paciente de un cliente **desde el número de ONIA**, sin error ni log, y cuando contesta el mensaje cae al vacío. |
| 3 | **Cifrar `whatsappAccessToken` en reposo** | **S — ½ día** | Es un token de Meta de un cliente guardado en texto plano. |
| 4 | **Webhook `statuses`** → guardar entrega/fallo + categoría de precio en la fila del mensaje; **manejar `131042`** y mostrar "tu WhatsApp está pausado por un problema de pago con Meta" | **M — 1 día** | Única forma de conciliar lo que Meta factura contra lo que cobramos, y de no confundir un corte de pago con un bug. |

**Para que "el cliente maneje su WhatsApp desde nuestro sistema"**

| # | Qué | Tamaño |
|---|---|---|
| 5 | **Persistir mensajes entrantes y salientes** | **S sobre el #1** (sale casi gratis) |
| 6 | **Bandeja en el panel**: lista de conversaciones, hilo, responder, tomar/soltar del bot | **L — 1 semana bien hecha** — es la pieza grande, y es **lo que el cliente compra** |
| 7 | **Arreglar la escalación**: llamar `sendAgentMessage` para empujar los mensajes del paciente escalado, y no escalar cuando no hay inbox | **S — ½ día** (con el #6, la escalación a Chatwoot deja de tener sentido y se borra) |

**Para que el alta no dependa de nosotros**

| # | Qué | Tamaño |
|---|---|---|
| 8 | **Embedded Signup v4**: botón `FB.login()` con `config_id` + session logging → endpoint server-side que canjea el `code` (30 s) en `/oauth/access_token` → `POST /{waba-id}/subscribed_apps` → `POST /{phone-number-id}/register` con PIN de 6 dígitos → persistir `wabaId` (**la columna no existe hoy**) + `phoneNumberId` + token por organización + estado de onboarding visible + caso coexistence + gestión de plantillas por org | **L/XL — 1,5 a 2 semanas**; depende del paso 2 del runbook |
| 9 | **Checkout del add-on por nivel** — mover WhatsApp de `Organization.whatsappAddon` a `OrganizationEntitlement("addon.whatsapp", limits:{nivel, mensajes})`, **que ya existe en el schema**, y engancharlo a la pasarela | **M — 3 días** |

**Colateral**

| # | Qué | Tamaño |
|---|---|---|
| 10 | `vercel.json` corre el cron **1x/día a las 12:00 UTC** → la ventana de 2h (90-150 min) casi nunca cae dentro: **los recordatorios de 2h prácticamente no salen**. Cambiar el schedule, revisando antes el costo (multiplica los mensajes reales) | **S** |
| 11 | Unificar versión de Graph API (v19.0 en el proxy n8n vs v21.0 en el resto) | **S — 10 min** |
| 12 | Corregir `utilityBob` 0,113 → 0,1285 (TC 11,37, verificar BCB) | **S** |

**Orden recomendado:** 1 → 2 → 3 → 4 (una semana, y recién ahí sabemos qué gastamos de verdad) →
5+6+7 (la bandeja, que es lo que el cliente compra) → 8+9 (self-service). **Los puntos 1 y 2 son
los que hoy están haciendo perder plata o mandando desde el número equivocado.**

---

## 6. Decisiones que necesita tomar Sergio

| # | Decisión | Recomendación |
|---|---|---|
| D1 | ¿Vamos por Tech Provider o seguimos metiendo clientes en nuestra WABA? | **Tech Provider.** El cupo de mensajería es compartido a nivel portfolio: un cliente con campaña apaga a los demás. |
| D2 | ¿Quién le paga a Meta? | **El cliente, directo, con su tarjeta.** Es lo único posible siendo Tech Provider, y evita responsabilidad solidaria. |
| D3 | ¿Pedimos `business_management` en el App Review? | **No.** Solo lo exige Solution Partner y pedir permisos de más es causa documentada de rechazo. |
| D4 | ¿Tratamos Access Verification como obligatoria u opcional? | **Obligatoria.** Dos páginas oficiales se contradicen; el riesgo del error 100 es peor que 5 días de trámite. |
| D5 | ¿Vendemos pilotos hoy bajo nuestra WABA? | **Sí, máximo 3**, con consentimiento escrito, número nuevo (no el que el cliente ya usa) y aviso de cupo compartido. |
| D6 | ¿Onia sigue absorbiendo el costo Meta en N1 (`metaPassthrough: false`)? | **Sí, no lo toques.** Con una sola plantilla utility fija el costo es 13-18% del precio. |
| D7 | ¿Qué hacemos con `markupPct: 20`? | **Sacarlo o renombrarlo como fee operativo.** Bajo Tech Provider nunca vemos una factura de Meta del cliente sobre la cual aplicarlo. |
| D8 | ¿Prometemos "atención ilimitada" en N2/N3? | **No.** Desde el 1-oct-2026 cada respuesta se cobra: el caso inmobiliaria salta de Bs 10 a Bs 267/mes. |
| D9 | ¿Metemos el conteo de mensajes de servicio antes del 30-sep-2026? | **Sí, es fecha dura.** Sin eso, desde el 1-oct hay gasto facturable sin techo. |
| D10 | ¿Usamos Meta Business Agent? | **No.** 4-5 ¢/mensaje contra 1,13 ¢: cuatro veces más caro que nuestra IA propia. |
| D11 | ¿Bandeja propia o le damos Chatwoot al cliente? | **Bandeja propia** (Chatwoot queda interno, como ya se decidió). Es la pieza que el cliente compra y hoy no existe. |
| D12 | ¿Probamos el circuito de pago antes de venderlo a los seis rubros? | **Sí, con UN cliente real.** Meta no publica nada sobre métodos de pago en Bolivia y post-devaluación la tarjeta internacional es fricción real. |
| D13 | Cobranzas por WhatsApp, ¿con qué plantilla? | **Utility pura, sin una sola palabra promocional.** Un descuento en el texto la convierte en marketing: de Bs 103 a Bs 673. |

### Lo que Meta NO publica (no lo estimamos)

- Tiempo de revisión del **display name** (solo publica estados y el tope de 10 cambios/30 días).
- Campos exactos del formulario de **Access Verification**.
- Texto sugerido literal para la descripción de cada permiso en App Review (Meta da marco, no template).
- **Nada específico de Bolivia** sobre métodos de pago aceptados para la WABA del cliente.
- Diferencias detalladas entre Embedded Signup **v3 y v4** (solo nombra la deprecación de v2).
- Las **tarifas de service vigentes desde el 1-oct-2026** — se publican no más tarde del 1-sep-2026.

---

## 7. Fuentes

Todas consultadas el **2026-08-08**.

**Tech Provider / Embedded Signup**
- [Embedded Signup overview](https://developers.facebook.com/docs/whatsapp/embedded-signup) · [(ruta nueva)](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/overview/)
- [Embedded Signup — Implementation](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/implementation)
- [Become a Tech Provider](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers)
- [App Review](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/app-review) · [App Review sample submission](https://developers.facebook.com/docs/whatsapp/solution-providers/app-review/sample-submission)
- [Onboarding customers as a Tech Provider](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-customers-as-a-tech-provider)
- [Onboard WhatsApp Business app users (coexistence)](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users/)
- [Solution Partner overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/overview)
- [Access Verification](https://developers.facebook.com/docs/development/release/access-verification)
- [WhatsApp Business Accounts](https://developers.facebook.com/documentation/business-messaging/whatsapp/whatsapp-business-accounts)

**Límites y plantillas**
- [Messaging Limits](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits) · [Upcoming messaging limits changes](https://developers.facebook.com/documentation/business-messaging/whatsapp/upcoming-messaging-limits-changes/)
- [Display names](https://developers.facebook.com/documentation/business-messaging/whatsapp/display-names)
- [Template categorization](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/template-categorization)

**Precios**
- [Pricing on the WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing) — modelo por-mensaje desde 1-jul-2025, reglas de gratuidad, mapeo de códigos de país
- Rate card CSV USD, encabezado *"effective July 1, 2026"*, descargado de la tabla "Rate cards and volume tiers" de esa página (fila `Rest of Latin America`) + CSV de volume tiers USD, mismo origen
- [Pricing for non-template messages](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages) — cambios 1-ago-2026 y 1-oct-2026
- [Conversation-based pricing (Deprecated)](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/conversation-based-pricing) — servicio gratis desde 1-nov-2024
- [Managing credit lines](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/share-and-revoke-credit-lines) — "Bill To Party"
- [Error codes](https://developers.facebook.com/documentation/business-messaging/whatsapp/support/error-codes) — `131042`

**Legal**
- [WhatsApp Business Terms for Service Providers](https://www.whatsapp.com/legal/business-terms-for-service-providers) (mod. 12-jun-2018)
- [Política de WhatsApp Business](https://whatsappbusiness.com/es-la/policy/)

**Repo producto (solo lectura, `master` @ `6b8f152`)**
- `C:\dev\proyectos\onia-platform\lib\pricing.ts` · `lib\plan-limits.ts` · `lib\whatsapp.ts` · `lib\whatsapp-bot.ts` · `lib\chatwoot.ts` · `lib\onia-core\dispatch\channels.ts` · `lib\onia-core\intake.ts` · `app\api\webhooks\whatsapp\route.ts` · `app\api\webhooks\chatwoot\route.ts` · `app\api\cron\appointment-reminders\route.ts` · `app\api\n8n\whatsapp\send\route.ts` · `app\(dashboard)\settings\PlanClient.tsx` · `app\(dashboard)\admin\organizations\[id]\WhatsAppOrgConfig.tsx` · `prisma\schema.prisma` · `vercel.json`

**Documentos ONIA relacionados**
- `hermes-content/docs/platform/ONIA_GUIA_REGISTROS_SIAT_META_20260806.md` — estado de la app Meta y verificación del negocio

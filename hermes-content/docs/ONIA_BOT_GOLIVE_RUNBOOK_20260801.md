# Onia Bot — Runbook de producción (2026-08-01)

> Estado al escribir: el bot está **EN PRODUCCIÓN** en el canal Chatwoot
> (`ONIA_BOT_DRY_RUN=false` desde hoy). Falta solo el canal WhatsApp, gateado por
> la disputa de Meta (caso **1047562948135567**, escalado, respuesta a
> `business@onia.com.bo`). Este runbook deja escrito lo que se hace el día que
> Meta libere el número — son ~30 minutos de trabajo, todo lo demás ya está.

## 1. Qué ya está corriendo (no volver a hacer)

| Pieza | Estado | Dónde |
|---|---|---|
| Servidor de webhook | vivo, puerto 3020, fail-closed | contenedor `onia-center`, código `/opt/onia/bot` |
| Watchdog | cron cada 2 min, probado matándolo | `/opt/onia/bot/webhook-watchdog.sh` |
| Webhook de Chatwoot | cuenta 2 → nuestro server (id 2, `message_created`) | cubre TODOS los inboxes, presentes y futuros |
| Inbox 3 "ONIA Demo" | API channel, producción | Chatwoot |
| Inbox 4 "Onia Web" | web_widget, token `9k5i7xnAgCbSse1EZwVChZLw` | Chatwoot |
| Motor | multirubro + rama dental + soporte + audio (Speaches) + reserva real Cal.com | 292 tests, benchmark 60/60 |
| Reserva | `demo-bot` (id 5, oculto) reserva; `demo-onia` (público) da disponibilidad | Cal.com |
| Dry run | **APAGADO** (2026-08-01): el bot postea de verdad | `/opt/onia/bot/webhook.env` |

Secretos: `/opt/onia/bot/webhook.env` (chmod 600, fuera de git). El token de la API
de Chatwoot se lee de su propia base en cada arranque.

## 2. Widget web — HANDOFF a la sesión dueña de onia.com.bo

`onia.com.bo` ya NO apunta a Vercel/web-onia: el DNS va al VPS (187.77.16.63) y
sirve `web-factory/apps/onia-platform` vía el contenedor `onia-platform`
(runtime standalone en `/opt/onia-platform/runtime-next`). Ese carril tiene dueño
activo — **el widget lo agrega esa sesión**, es un bloque autocontenido en su
layout raíz:

```tsx
// apps/onia-platform/src/app/layout.tsx — antes de </body>
import Script from 'next/script'

<Script id="onia-chatwoot" strategy="afterInteractive">{`
  (function(d,t){
    var BASE_URL="https://onia-chatbot-chatwoot.hqdqgh.easypanel.host";
    var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
    g.src=BASE_URL+"/packs/js/sdk.js";g.defer=true;g.async=true;
    s.parentNode.insertBefore(g,s);
    g.onload=function(){window.chatwootSDK.run({websiteToken:"9k5i7xnAgCbSse1EZwVChZLw",baseUrl:BASE_URL})};
  })(document,"script");
`}</Script>
```

No hay nada que configurar del lado del bot: el inbox 4 ya existe y el webhook de
la cuenta lo cubre. Con pegar ese bloque y redeployar, el bot atiende la web.
(El mismo snippet ya quedó commiteado en el repo Web-Onia por si el dominio
vuelve a Vercel algún día.)

## 2.ANTES-QUE-TODO — ALTA HECHA: el número de Onia ya existe (2026-08-03)

> **HITO.** El número comercial de Onia está dado de alta y conectado en Cloud
> API. Sergio eligió el 75414930 entre tres candidatos (los tres pasaron la
> prueba de "invitar a WhatsApp", o sea ninguno tenía cuenta previa).

| Dato | Valor |
|---|---|
| **Número de Onia** | **+591 75414930** — estado **Conectado** |
| WABA de producción | **"Onia"**, id **4429061034078857**, propiedad de OniaAgency |
| Nombre visible | **Onia** (validado en el alta, sin rechazo) |
| Categoría | Servicios profesionales |
| Zona horaria | **America/La_Paz** ✔ (se configuró bien desde el inicio) |
| Sitio web | https://onia.com.bo/ |
| Verificación de negocio | Verificado ✔ · Estado de la cuenta: Aprobada ✔ |
| Método de pago | ninguno (solo hace falta para plantillas y llamadas salientes) |
| WABA de prueba | sigue existiendo con el número de test +1 555-649-7880, reservado para la fase F0 de voz |

**Confirmación importante:** el 75414930 pasó la validación del asistente
**sin el error de portfolio** que bloqueó al 78491375. El número está limpio.

### Permisos del usuario del sistema — HECHO

El usuario del sistema **"Onia Automation"** (id 61591961241672, acceso Admin,
ya existía del carril de Meta Ads) tiene asignada la WABA **Onia** con acceso
parcial deliberado (mínimo privilegio): **"Administrar números de teléfono y
plantillas de mensajes"** + **"Mensajes"**. Eso equivale a
`whatsapp_business_management` + `whatsapp_business_messaging`.

### BLOQUEO REAL ENCONTRADO (2026-08-03): ninguna app de Meta tiene WhatsApp

Al generar el token permanente (caducidad **Nunca**, obligatorio: uno de 60
días dejaría el bot mudo sin aviso) el asistente no ofrece los permisos de
WhatsApp:

- App **"OnIA Agency"** → *"No hay permisos disponibles. Asigna un rol de app
  al usuario del sistema"* (esa app no está asignada al usuario).
- App **"ONIA Marketing API"** (sí asignada) → el desplegable solo lista
  `ads_management`, `business_management`, `catalog_management`… **ninguno de
  WhatsApp**, con el aviso de Meta: *"Si los permisos que quieres seleccionar
  no están disponibles, un administrador de la app tendrá que personalizar o
  agregar un caso de uso a esta app."*

**Diagnóstico:** la WABA se creó desde Business Suite, así que **ningún app de
developers.facebook.com tiene el producto WhatsApp agregado**. Sin eso no hay
token de Cloud API — y tampoco hay dónde configurar el webhook de `messages`.

**Siguiente paso (el que destraba todo):** en developers.facebook.com, agregar
el producto **WhatsApp** a una app (candidata: "OnIA Agency", o una nueva
dedicada), vincularle la WABA `4429061034078857`, y asignar esa app al usuario
del sistema. Recién ahí el asistente ofrece los permisos y sale el token.

### CAUSA RAÍZ (2026-08-03, vía MCP de Meta Developers): hay DOS portfolios

El diagnóstico de arriba era incompleto. Sí existe una app con WhatsApp —
**"Onia Agency Chatbots"** (`36422446950687488`, creada abril 2026, caso de uso
"Conectarte con los clientes a través de WhatsApp" ya agregado, dev mode, cero
webhooks). No aparecía en el navegador porque **vive en otro negocio**.

En la cuenta conviven dos portfolios de nombre casi idéntico:

| Portfolio | ID | Verificación | Qué tiene |
|---|---|---|---|
| **Onia Agency** (con espacio) | `987837053929039` | ✘ sin verificar | app "Onia Agency Chatbots" (con WhatsApp) |
| **OniaAgency** (junto, legal SEPREC) | `1451773736711697` | ✔ **completada** | WABA "Onia" `4429061034078857`, número 75414930, usuario del sistema "Onia Automation" |

Por eso el asistente de token no ofrecía nada: el usuario del sistema vive en
el portfolio verificado y **ninguna app de ese portfolio tenía WhatsApp**,
mientras que la app que sí lo tenía colgaba del portfolio equivocado.

**Trampa a recordar:** los dos nombres se leen igual en las listas de Meta
("Onia Agency" vs "OniaAgency"). Distinguirlos SIEMPRE por ID o por la
etiqueta "Verificación del negocio completada", nunca por el nombre.

**Decisión (Sergio, 2026-08-03): crear app nueva en el portfolio verificado**,
en vez de mover la vieja entre negocios. App **"Onia Bot"**, correo
`business@onia.com.bo`, caso de uso WhatsApp, negocio **OniaAgency
(1451773736711697)**, sin requisitos de publicación pendientes. Queda pendiente
decidir qué hacer con "Onia Agency Chatbots" (borrarla o dejarla dormida) —
no se toca hasta que el bot esté vivo.

### GATE NUEVO: la app debe estar PUBLICADA para recibir webhooks reales

Texto literal de Meta en Paso 2 (Configuración de producción) de la app:
*"Las apps solo podrán recibir webhooks de prueba enviados desde el panel de la
app mientras esta esté sin publicar. **No se entregarán datos de producción**,
incluidos los de los administradores, desarrolladores o evaluadores de la app,
a menos que esta se haya publicado."*

O sea: con la app en dev mode el bot NO recibe los mensajes reales de los
clientes. Publicar exige, como mínimo, **URL de política de privacidad** (hoy
la app no tiene ninguna → hace falta una página real en onia.com.bo) y el
ícono/categoría de la app. Esto NO estaba contemplado en el plan original y
es requisito para que el número atienda de verdad.

### DESBLOQUEADO 2026-08-06 — app propia + token permanente + datos del número

App **"Onia Bot"** creada en el portfolio verificado y asignada al usuario del
sistema. Eso destrabó los permisos de WhatsApp en el asistente de token.

| Dato | Valor |
|---|---|
| App | **Onia Bot** — `1078962684709749` (dev mode, is_live=false) |
| Portfolio | OniaAgency `1451773736711697` (verificado) |
| Asignación | usuario del sistema "Onia Automation" → app con **Acceso total (Administrar app)** + WABA "Onia" con acceso parcial |
| Token | permanente (**caducidad: Nunca**), permisos `whatsapp_business_management` + `whatsapp_business_messaging` |
| WABA id | `4429061034078857` |
| **phone_number_id** | **`1283320641524523`** |

Estado real del número, leído de la Graph API con el token nuevo (v23.0,
`GET /4429061034078857/phone_numbers`):

```
display_phone_number       +591 75414930
verified_name              Onia
status                     CONNECTED
code_verification_status   VERIFIED
platform_type              CLOUD_API
name_status                AVAILABLE_WITHOUT_REVIEW
quality_rating             UNKNOWN   (sin tráfico todavía)
```

**Dos correcciones al plan gracias a esto:**

1. **El número YA está registrado en Cloud API.** La documentación advierte que
   agregar+verificar un número NO lo registra y que hay que llamar a
   `POST /PHONE_NUMBER_ID/register`. No aplica acá: el alta por Business Suite
   dejó el número en `CONNECTED`, que es el estado de registrado y operativo.
   No hay que llamar a `/register` (y conviene no hacerlo: hay tope de 10
   intentos por número cada 72 h, error `133016`).
2. **El display name "Onia" NO espera revisión** (`AVAILABLE_WITHOUT_REVIEW`).
   El plan asumía 1–3 días hábiles de espera antes de imprimirlo en material
   comercial. Se puede usar ya.

Higiene del token: Meta lo muestra **una sola vez**. No pasó nunca por el chat
ni por un documento — la llamada a la Graph API la hizo el propio navegador
leyendo el campo, y devolvió solo los datos del número.

### 🟢 VIVO 2026-08-06 14:58 UTC — circuito completo probado en producción

Mensaje real desde el celular de Sergio (+591 71654992) al **+591 75414930**:

```
msg 26  entrante  "Hola"                                 14:58:26
msg 27  saliente  "¡Hola! Soy el asistente de Onia…"      14:58:33   estado: LEÍDO
```

Cadena que corre hoy:
`WhatsApp → Meta → Chatwoot inbox 5 → webhook de cuenta (id 2) → motor del bot
(onia-center:3020) → respuesta → WhatsApp`. 7 segundos punta a punta.

| Pieza | Valor |
|---|---|
| Canal Chatwoot | `channel_id=3`, `inbox_id=5` "Onia WhatsApp", provider `whatsapp_cloud` |
| Cuenta Chatwoot | **id 2** "OnIA Agency" (NO la 1) · usuario `oninteligenciaartificial@gmail.com` |
| Callback | `https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/webhooks/whatsapp/+59175414930` |
| Suscripción app | objeto `whatsapp_business_account`, campo `messages`, `active: true` |
| Suscripción WABA | app "Onia Bot" + `override_callback_uri` al mismo destino |
| Secreto de app | `META_APP_SECRET` en `/opt/onia/bot/webhook.env` (chmod 600, fuera de git) |

### Las tres trampas que costaron el día (para no repetirlas)

1. **La UI de Chatwoot no sirve para dar de alta WhatsApp Cloud aquí.** La tarjeta
   "Nube de WhatsApp" no lleva a ningún formulario porque al contenedor le faltan
   las variables del Embedded Signup de Meta. El alta se hace por consola de Rails
   (`Channel::Whatsapp` + `account.inboxes.create!`), que además evita la trampa de
   coexistencia. Scripts en el VPS: `/root/crear-inbox.rb`, `/root/configurar-webhook.sh`.
2. **Orden obligatorio en Meta, y el error no lo dice.** El override por WABA falla
   con *"your app must be subscribed to receive messages"* hasta que exista el
   webhook **a nivel de app**. Y ese endpoint (`POST /<APP_ID>/subscriptions`) exige
   **token de app** (`APP_ID|APP_SECRET`): el token del usuario del sistema devuelve
   `(#15) This method must be called with an app access_token`. Secuencia correcta:
   (a) `POST /<WABA>/subscribed_apps` → (b) webhook de app con token de app →
   (c) override por WABA.
3. **El asesino silencioso: `Inactive WhatsApp channel`.** Cuando el alta del inbox
   falló el webhook, Chatwoot marcó el canal con `reauthorization_required? = true`
   y **descartó todos los mensajes devolviéndole 200 a Meta** — o sea, Meta entregaba
   bien, los logs mostraban el POST, y en la base no aparecía nada. Arreglar el
   webhook NO limpia esa marca. Hay que llamar `Channel::Whatsapp.find(3).reauthorized!`
   a mano. Ojo: `authorization_error_count` seguía en 0, así que ese campo NO sirve
   para diagnosticar; el que manda es `reauthorization_required?`.

### Pendientes conocidos

- **App en modo desarrollo** (`is_live=false`). Hoy responde porque Sergio tiene rol
  en la app. Para clientes reales hay que publicarla → exige **URL de política de
  privacidad** (la app no tiene ninguna) + ícono 1024x1024 + categoría.
- **Sin método de pago**: solo conversaciones iniciadas por el cliente (gratis). Las
  plantillas y los mensajes iniciados por el negocio necesitan tarjeta.
- **Chatwoot sin correo saliente**: por eso no llegó el mail de recuperación de
  contraseña. Tampoco puede mandar notificaciones ni invitaciones de agente.

### Cola después de eso

1. **`phone_number_id`** del 75414930 (aparece en API Setup de la app).
2. **Inbox de WhatsApp (Cloud API) en Chatwoot** con WABA id + phone_number_id
   + token. El webhook de cuenta (id 2) ya cubre cualquier inbox nuevo → el
   bot atiende al instante, sin tocar código.
3. **Prueba real** desde otro número: M0 → calificación → horario → reserva
   en Cal.com.
4. Cambiar el CTA de la web al número nuevo (`NEXT_PUBLIC_WA_PHONE` + rebuild).

> El token va a `/opt/onia/bot/webhook.env` (chmod 600, fuera de git); jamás
> se pega en chat ni en un doc.

## 2.bis Estado REAL del portfolio (verificado en vivo 2026-08-03)

Entré a Business Settings de OniaAgency y confirmé el terreno antes del alta:

| Dato | Valor |
|---|---|
| WABAs en el portfolio | **UNA sola: "Test WhatsApp Business Account"** (id 1730104971691715) |
| Verificación del negocio | **Verificado** ✔ |
| Estado de la cuenta | **Aprobada** ✔ |
| Zona horaria | `America/Los_Angeles` ← corregir a `America/La_Paz` |
| Método de pago | ninguno |
| Dirección / divisa | sin cargar |

**BLOQUEO ENCONTRADO — el botón "Agregar número de teléfono" está DESHABILITADO.**
Tooltip literal: *"This WhatsApp account has reached its phone number limit. To
add a new number, first remove an existing one from this account."* La WABA de
prueba admite un solo número (el de test +1 555-649-7880), y ese número lo
queremos conservar para la fase F0 de voz (test gratis 90 días).

**Consecuencia: hay que crear una WABA de PRODUCCIÓN.** Ruta verificada:
Configuración → Cuentas → **Cuentas de WhatsApp** → **Agregar** → *"Crear una
nueva cuenta de WhatsApp Business"*. El asistente tiene **3 pasos en un solo
flujo**: **Detalles** (nombre visible + categoría) → **Número de teléfono** →
**Verificación telefónica**.

> **Por eso NO se puede "chequear un número" por separado.** La validación de
> si el número está libre o atrapado en otro portfolio ocurre DENTRO de ese
> asistente, con el chip en la mano. Se corre una sola vez, en serio, el día
> del alta. (Probado 2026-08-03: se abrió el asistente y se abandonó sin crear
> nada — el portfolio quedó intacto con su única WABA de prueba.)

**Hallazgo lateral valioso para el modelo multi-cliente:** el mismo menú
"Agregar" ofrece además *"Solicita una cuenta de WhatsApp Business para un
cliente — Crea una cuenta en nombre de otro negocio"* (creación de WABA
iniciada por socio, que el research daba como exclusiva de Solution Partners)
y *"Vincular una cuenta de WhatsApp Business — Usa una cuenta para administrar
la app de WhatsApp Business"* (la puerta de la coexistencia). Verificar ambas
cuando toque el carril de clientes.

## 3. DECISIÓN FINAL (2026-08-01, tarde): cambio TOTAL de número

> Tras descartar el número interino ("solo quiero un número"), Evolution API
> (riesgo de ban) y la espera pasiva (muy lenta), Sergio decidió el corte
> limpio: **un número NUEVO pasa a ser EL número del negocio.** Un solo
> número, oficial, sin esperar a Meta.

- Sergio compra el chip y pasa el número **el 2026-08-02**.
- El número entra **directo a Cloud API** en la WABA verificada (NUNCA
  registrarlo en la app de WhatsApp — el chip solo recibe el SMS del alta).
- El bot lo atiende 24/7; Sergio responde los handoffs **desde el celular con
  la app de Chatwoot** (self-hosted, ya corre en el VPS). No hay app de
  WhatsApp para ese número: Chatwoot ES la interfaz. Eso es exactamente lo
  que se le venderá al cliente.
- El CTA wa.me de la web pasa al número nuevo (`NEXT_PUBLIC_WA_PHONE` +
  rebuild de la landing).
- Legal: actualizar el teléfono en SIAT (padrón) y SEPREC + demás puntos —
  checklist con fuentes en `ONIA_CAMBIO_NUMERO_PLAN_20260801.md` (research
  en curso al escribir esto).
- El 78491375 queda como línea personal de Sergio (app intacta) y la disputa
  con Meta sigue en paralelo como vía de recuperación, ya sin urgencia.

## 4. Si Meta libera el 78491375 (ya NO es el gate — fallback opcional)

> Con la decisión de §3, el negocio migra a un número nuevo y esta sección
> deja de ser la ruta crítica. Si la disputa se gana, el 78491375 vuelve
> entero a manos de Sergio como línea personal; usarlo comercialmente de
> nuevo sería una decisión nueva. Los pasos quedan por si acaso:

Prerrequisito: correo de resolución en `business@onia.com.bo` del caso
1047562948135567. **No intentar antes** — dispara el mismo error y quema SMS.

1. **Vincular el número** — Business Suite → OniaAgency → Cuentas de WhatsApp →
   "Test WhatsApp Business Account" → Agregar → **"Vincular una cuenta de
   WhatsApp Business"**. Elegir SIEMPRE el portfolio `OniaAgency` (verde, todo
   junto). Con suerte ofrece **coexistencia** (QR desde la app; oficial desde
   may-2025). Si rechaza por país (Bolivia aún sin cobertura): reintentar en
   unas semanas — la app sigue intacta mientras tanto.
2. **Inbox de WhatsApp en Chatwoot** — Chatwoot → Inboxes → Add → WhatsApp
   (Cloud API): número, `phone_number_id` y token del WhatsApp Manager.
   El webhook de la cuenta ya lo cubre → el bot atiende al instante.
3. **Zona horaria de la WABA** — está en `America/Los_Angeles`; cambiar a
   `America/La_Paz` (WhatsApp Manager → cuenta → configuración).
4. **Plantillas** (necesitan el método de pago cargado): crear las 4 ya
   redactadas en `ONIA_CATALOGO_TIPOS_CHATBOT_20260731.md` §plantillas —
   `onia_demo_confirmada`, `onia_demo_recordatorio`, `onia_seguimiento_pendiente`
   (utility) y `onia_lead_reactivacion` (marketing). Regla dura: ni una palabra
   de venta en las utility. Muestra obligatoria al crearlas.
5. **Webhooks de plantillas** — suscribir `message_template_status_update` y
   `account_update` en la app de Meta (avisan recategorizaciones con 1 día).
6. **Probar el embudo real**: mandar "hola quiero info" desde otro número →
   M0 → calificar → horario → verificar reserva en Cal.com.

Nota: si algún día el CTA de la web debe apuntar a otro número, es el env
`NEXT_PUBLIC_WA_PHONE` en el build de la landing (build-time: exige rebuild).

## 5. Pendientes que NO dependen de Meta

- **n8n (espera login de Sergio):** workflow del aviso de handoff por Telegram
  (el bot ya emite `notifyCount`/`notifyReasons`; falta quien lo escuche) +
  activar validación de secreto en el disparador de agentes (el panel ya manda
  la llave).
- **Método de pago de Meta** (Sergio): destraba plantillas = escribir primero.
- **Voz (fase siguiente):** WhatsApp Calling API + Pipecat + Speaches + piper.
  Veredicto completo y costos en el research del 2026-08-01 (entrantes gratis,
  salientes ~USD 0,01/min). Arrancar por F0 con el número de test.

## 6. Vigilancia de la disputa

- Revisar `business@onia.com.bo` a diario (y spam). Responder el mismo día.
- Sin respuesta en 5 días hábiles → reabrir el chat "Disputa De Administrador
  WhatsApp" en Business Support Home citando el caso.
- El ticket paralelo de soporte consumer también sigue vivo (mismo número de
  caso); la respuesta bilingüe de escalamiento quedó lista para reenviar.

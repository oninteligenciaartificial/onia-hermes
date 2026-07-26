# ONIA — Chatbot propio: workflows de n8n (Chatwoot + diseño histórico de Telegram)

> **ACTUALIZACIÓN 2026-07-26 — Sergio corrigió el canal: es CHATWOOT, no Telegram.**
> Chatwoot ya corre en el VPS (Docker, activo) y es donde se centraliza la atención — no tiene
> sentido un bot de prueba paralelo por Telegram. Todo lo de la §10 en adelante (Chatwoot) está
> **CREADO Y PROBADO EN VIVO** (workflow de n8n `bJhSGHPYsaICEeKm`, `active:false` a propósito —
> falta el OK de Sergio para activarlo). Las §0-9 (Telegram) quedan como diseño histórico/de
> referencia: siguen siendo válidas como patrón (mismo motor, mismo `run-turn.sh`) pero NO son el
> camino que se está siguiendo ahora. Empezar por **§10**.
>
> Fase 3 del plan: `hermes-content/docs/ONIA_CHATBOT_PROPIO_SPEC_20260725.md` §6 (Vía B) y §8.
> Motor: `hermes-content/deploy/vps-ops/bot/` · Ejecutor del turno: `run-turn.sh` → `run-turn.mjs` ·
> Cron del follow-up: `followup-run.sh` → `followup-run.mjs` · Adaptador Chatwoot:
> `chatwoot-adapter.sh` → `chatwoot-adapter.mjs` · Disponibilidad real: `calcom-availability.mjs`.

---

## 10. CHATWOOT — el canal real (creado y probado en vivo, 2026-07-26)

### 10.0 Por qué Chatwoot y no Telegram

Chatwoot (`onia-chatbot_chatwoot`, v4.12.1) ya corre en el VPS vía Docker, con Postgres+Redis
propios, cuenta 2 "OnIA Agency" y user 2 (Sergio). Es la herramienta de atención centralizada
real — un bot de prueba en Telegram hubiera sido un canal paralelo que después había que migrar.
El motor (`bot-engine.mjs`) es 100% agnóstico del canal por diseño: lo único nuevo es el
adaptador (`chatwoot-adapter.mjs`) que traduce el webhook y postea la respuesta.

**Diferencia clave con el diseño de Telegram (§0-9):** en Telegram, n8n tenía que mandar el
mensaje él mismo (nodo `telegram: sendMessage`). Acá el adaptador **ya postea la respuesta a la
API de Chatwoot por su cuenta** (requisito del pedido), así que el workflow de n8n es más chico:
sólo recibe el webhook, arma el turno y corre el adaptador — no hace falta un nodo de envío
aparte.

### 10.1 Infra verificada (2026-07-26)

- Chatwoot: `https://onia-chatbot-chatwoot.hqdqgh.easypanel.host`, cuenta `2`, user `2`
  (`oninteligenciaartificial@gmail.com`).
- **Inbox creado:** `ONIA Demo` (id **3**, `channel_type: Channel::Api`), vía
  `POST /api/v1/accounts/2/inboxes` con `channel:{type:"api", webhook_url:...}`. Verificado
  contra la base (`onia-chatbot_chatwoot-db`, tabla `inboxes`).
- **Token de la API:** ya existía uno para el user 2 en `access_tokens` (owner_id=2). Se lee en
  runtime desde el propio Postgres de Chatwoot — **nunca se pegó en ningún archivo del repo ni
  en una credencial de n8n**.
- **n8n:** `WEBHOOK_URL` del contenedor es `https://n8n-sergio-n8n.hqdqgh.easypanel.host`. La
  credencial SSH ya existía (`ONIA VPS SSH`, id `4XKauEX3b6cqaDhW`) — se reusa, no hizo falta
  crear ninguna credencial nueva.
- **Cal.com:** ya corre en el VPS (`onia-calcom-calcom-1`) con usuario `onia`, event-type
  `demo-onia` (45 min, visible) y un Schedule "ONIA Comercial Base" (lun-sáb, con disponibilidad
  real). Ver §10.4.

### 10.2 El adaptador: `chatwoot-adapter.mjs` + `chatwoot-adapter.sh`

Mismo patrón que `run-turn.sh`/`run-turn.mjs`: el `.sh` sincroniza el código al contenedor
`onia-center` (comparando un stamp, igual que los demás) y corre el `.mjs` adentro, que:

1. **Traduce el webhook** (`parseChatwootWebhook`): soporta `message_created` y
   `conversation_created` (las 2 formas reales del webhook, capturadas en vivo el 2026-07-26 con
   `webhook.site` como receptor de prueba — `message_type` es STRING arriba ("incoming"/
   "outgoing") pero NUMÉRICO adentro de `conversation.messages[]` (0/1), y `created_at` es ISO
   arriba pero epoch-segundos adentro; el parser normaliza los dos casos).
2. **REGLA DE ORO — ignora saliente y notas privadas.** Si no, el propio mensaje que el bot
   postea dispara su PROPIO webhook de vuelta (Chatwoot manda `message_created` para TODO
   mensaje) y el bot se contesta a sí mismo en loop infinito. Es lo primero que se testeó
   (21 pruebas en `chatwoot-adapter.test.mjs`) y lo primero que se probó EN VIVO (§10.5).
3. **Corre el turno con `runTurn()` sin cambios** (mismo motor, misma persistencia).
4. **Postea la respuesta** con `POST /api/v1/accounts/{id}/conversations/{id}/messages`
   (`message_type: "outgoing"`).
5. **Idempotencia:** NO hace falta tabla nueva. El `message_key` que arma el adaptador
   (`chatwoot:<conversationId>:<messageId>`) es el MISMO dedup que ya usa `run-turn.mjs` vía
   `bot_messages.message_key` (unique). Si Chatwoot reintenta el webhook, `runTurn()` devuelve
   `duplicate:true` y el adaptador no postea una segunda vez. Probado en vivo (§10.5).
6. **"Encendido en dos pasos", igual que Telegram:** con `ONIA_BOT_DRY_RUN=true` (el default del
   `.sh`) el motor calcula la respuesta real (y la guarda en `bot_messages` con
   `delivery_status='skipped'`) pero el adaptador **NO llama a la API de Chatwoot** — devuelve
   `sent:[{text, posted:false, reason:"dry_run"}]`. Recién con `ONIA_BOT_DRY_RUN=false` postea de
   verdad. Mismo interruptor que ya usa todo el resto del bot, sin nodo aparte en n8n.

### 10.3 Secretos — cómo se cargan (ninguno en el repo)

| Secreto | Dónde vive | Cómo se carga |
|---|---|---|
| Token de la API de Chatwoot | Postgres de `onia-chatbot_chatwoot-db`, tabla `access_tokens` | `chatwoot-adapter.sh` lo lee con `docker exec <chatwoot-db> psql ...` en CADA corrida (mismo patrón que la master key de LiteLLM en `run-turn.sh`). Si el token rota desde la UI de Chatwoot, se levanta solo. |
| Credencial SSH del VPS | n8n Credentials → `ONIA VPS SSH` (`4XKauEX3b6cqaDhW`) | Ya existía, se reusa tal cual. |
| `CHATWOOT_BASE_URL` / `CHATWOOT_ACCOUNT_ID` | Env del wrapper (`chatwoot-adapter.sh`) | NO son secretos (URL pública + id de cuenta). Default a la URL pública; el wrapper los pisa con los hostnames internos de Docker (`http://onia-chatbot_chatwoot:3000`) para no salir a internet. |
| `CALCOM_BASE_URL` / `_EVENT_TYPE_SLUG` / `_USERNAME` | Idem | Tampoco son secretos (slug/usuario públicos de la página de reserva). |

### 10.4 Cal.com destraba el bloqueo de los 2 horarios (investigación pedida, resuelta)

`DEMO_SLOTS` en `config.mjs` seguía siendo el placeholder "pendiente de definir" — se esperaba
que Sergio dictara 2 horarios fijos. Se investigó si Cal.com (ya corriendo en el VPS) podía
resolverlo: **sí**. Hay un usuario `onia`, un event-type `demo-onia` (45 min, visible) y un
Schedule "ONIA Comercial Base" con disponibilidad real (lun-sáb). El endpoint que usa la propia
página de reserva de Cal.com para mostrarle horarios a un visitante anónimo
(`/api/trpc/slots/getSchedule`) es **público — no hace falta API key** (se verificó en vivo
contra `https://cal.onia.com.bo`, y también por la red interna de Docker vía `http://calcom:3000`,
ambas alcanzables desde el contenedor `onia-center`).

Se implementó `calcom-availability.mjs` → `getAvailableSlots()`: trae los horarios reales,
elige 2 con al menos 2h de separación (para no ofrecer "14:00" y "14:15" como si fueran
opciones distintas) y los devuelve en el mismo shape que `config.slots`. `run-turn.mjs` y
`followup-run.mjs` lo llaman automáticamente (vía un `resolveConfig()` nuevo en cada uno) **sólo
cuando nadie fijó un horario a mano** (ni el turno trae `slots`, ni hay `ONIA_BOT_SLOTS` en el
entorno) — si alguien lo fija a mano, eso manda siempre. Si Cal.com no responde (caído, sin
horarios, timeout de 4s), cae al placeholder `DEMO_SLOTS` sin tirar: el bot nunca se queda mudo.

**Probado en vivo (§10.5): el bot ofreció "lun 27/07 14:00" y "lun 27/07 16:00" — horarios REALES
de Cal.com, no el placeholder.** El bloqueo humano de los 2 horarios queda resuelto sin que
Sergio tenga que dictarlos: agenda real, no dos horarios inventados.

### 10.5 Prueba real punta a punta (evidencia, no simulada)

Contra la cuenta 2 de Chatwoot real, inbox `ONIA Demo` (id 3), conversación id **3**, contacto
"Prospecto Prueba ONIA 3":

| # | Acción | Resultado real |
|---|---|---|
| 1 | `POST .../conversations/3/messages` con `"DEMO"` (`incoming`) | Webhook real capturado → `chatwoot-adapter.sh` (dry-run) calculó **M0** + M7 (fuera de horario). `bot_conversations` quedó en `esperando_calificacion`. |
| 2 | `POST .../conversations/3/messages` con `"es mia, 2 sillones, la paz"` | `chatwoot-adapter.sh` con `ONIA_BOT_DRY_RUN=false`: calificó, **ofreció los 2 horarios REALES de Cal.com** ("lun 27/07 14:00" / "lun 27/07 16:00"), creó el lead (`bot-chatwoot-3`, pipeline `Contactado`) y **posteó la respuesta de verdad** (mensaje id 17, `message_type:1`, confirmado con `GET .../conversations/3/messages`). |
| 3 | Se capturó el webhook que Chatwoot manda por su PROPIO mensaje 17 (el eco) y se lo volvió a pasar al adaptador | `{"skipped":true,"reason":"mensaje_no_entrante:outgoing"}` — **no llamó al motor, no posteó nada. Sin loop.** |
| 4 | Se reenvió el MISMO webhook del paso 2 (simulando un reintento de Chatwoot) | `{"duplicate":true,"sent":[]}` — **no se mandó dos veces.** `GET .../conversations/3/messages` sigue con exactamente 3 mensajes (15, 16, 17). |

Estado final verificado en la base (`onia_center.bot_conversations`, `conversation_key =
'chatwoot:3'`): `bot_stage='esperando_horario'`, `qualification={ownsClinic:true, chairs:2,
city:'La Paz'}`, `slots_offered` con los 2 horarios reales de Cal.com, `lead_key='bot-chatwoot-3'`.
En `onia_center.leads`: `pipeline_status='Contactado'`. Esta conversación de prueba queda visible
en el panel de Chatwoot (cuenta 2, inbox "ONIA Demo") para que Sergio la vea con sus propios ojos.

### 10.6 El workflow de n8n (creado, `active:false`)

Creado vía la API de n8n (`POST /api/v1/workflows`) con el API key existente
`api-key-codex` (n8n Credentials no expone MCP en este entorno; se usó la REST API pública
directamente, sin tocar ninguna credencial nueva).

- **id:** `bJhSGHPYsaICEeKm` · **nombre:** `ONIA - Chatbot Demo (Chatwoot)` · **active: false**
  (a propósito — falta el OK de Sergio, punto 4 del pedido).

| # | Nodo | Tipo | Qué hace |
|---|---|---|---|
| 1 | `Webhook Chatwoot` | `n8n-nodes-base.webhook` v2 | `POST`, path `onia-chatbot-demo`, `responseMode: onReceived` (responde 200 al toque, no bloquea a Chatwoot) |
| 2 | `Normalizar webhook` | `n8n-nodes-base.code` v2 | `Buffer.from(JSON.stringify($json.body)).toString('base64')` — arma `b64` |
| 3 | `Correr adaptador (VPS)` | `n8n-nodes-base.ssh` v1 | `CHATWOOT_WEBHOOK_B64='{{ $json.b64 }}' bash /opt/onia/bot/chatwoot-adapter.sh < /dev/null`. Credencial `ONIA VPS SSH` (`4XKauEX3b6cqaDhW`, YA EXISTÍA) |
| 4 | `Leer resultado` | `n8n-nodes-base.code` v2 | Parsea el stdout a JSON, sólo para verlo legible en la ejecución de n8n (el adaptador ya posteó la respuesta el solo) |

Conexiones: `Webhook Chatwoot → Normalizar webhook → Correr adaptador (VPS) → Leer resultado`.

**Inbox de Chatwoot ya apunta a la URL de producción:**
`webhook_url = https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/onia-chatbot-demo`
(no va a responder nada hasta que el workflow esté activo — Chatwoot reintenta webhooks fallidos
sin problema, no rompe nada mientras tanto).

**El código YA está copiado en el VPS** (`/opt/onia/bot/*.mjs` + `*.sh`, con `chmod +x` en los
`.sh`) — el nodo SSH ya puede correr `chatwoot-adapter.sh` apenas se active.

### 10.7 Para activar (falta el OK de Sergio)

1. Activar el workflow: `PATCH /api/v1/workflows/bJhSGHPYsaICEeKm/activate` o el toggle en la UI
   de n8n.
2. Primer día en seco: dejarlo con `ONIA_BOT_DRY_RUN=true` (default del `.sh` — no hace falta
   tocar nada) y mirar `bot_messages`/el panel un rato antes de pasar a `false`.
3. Encender de verdad: cambiar el comando del nodo 3 a
   `ONIA_BOT_DRY_RUN=false CHATWOOT_WEBHOOK_B64='{{ $json.b64 }}' bash /opt/onia/bot/chatwoot-adapter.sh < /dev/null`.
4. Mandar un WhatsApp/mensaje real al inbox conectado (o escribir en el widget si se agrega uno)
   y confirmar en el panel de Chatwoot que el bot contesta.

### 10.8 Lo que sigue bloqueado / pendiente (Chatwoot)

| Bloqueo | Quién | Sin eso |
|---|---|---|
| Activar el workflow de n8n | **Sergio (1 clic)** | El bot no procesa webhooks reales todavía |
| Decidir el canal REAL detrás del inbox (WhatsApp Business API cuando Meta lo apruebe, o un widget web mientras tanto) | Sergio + verificación de Meta (bloqueo ya conocido, ver `CLAUDE.md` §S5) | El inbox "ONIA Demo" hoy es tipo API (para pruebas); WhatsApp real es OTRO inbox en la MISMA cuenta de Chatwoot, mismo adaptador (Chatwoot normaliza el webhook de WhatsApp al mismo shape) |
| Nada más — Cal.com, la migración, el token de Chatwoot y la credencial SSH ya están resueltos | — | — |

---

---

## 0. Por qué Telegram y no WhatsApp

WhatsApp depende de la verificación de Meta (hasta 14 días hábiles y todavía no enviada). El motor
es el mismo para los dos canales: **cambia un solo nodo** (trigger + sender) y el mapeo de
`contact_ref`. Lo que se prueba en Telegram es literalmente lo que sale en WhatsApp.

**Restricción verificada (spec §6, Vía B):** un bot de Telegram tiene **UN solo webhook**. El bot de
Sergio ya lo tiene apuntado al `ONIA - Telegram Command Center` (`vuicWsvh0hwqKhYs`, activo, entra por
webhook plano `/webhook/.../telegram-alfred`). **No se puede reutilizar ese bot** sin romper el
Command Center → hace falta un bot NUEVO.

---

## 1. Lo que tiene que hacer Sergio (5 minutos, una vez)

1. Telegram → `@BotFather` → `/newbot`.
2. Nombre: `ONIA Demo` · usuario: el que esté libre (ej. `onia_demo_bot`).
3. Copiar el token que devuelve BotFather y pasarlo para crear la credencial de n8n.

Sin ese token no hay Fase 3. **No lo pego yo en ningún archivo del repo.**

---

## 2. Credenciales de n8n

Regla del proyecto: **secretos por credencial, nunca en `$env` ni hardcodeados en el nodo.**

| Credencial | Tipo | Estado | Para qué |
|---|---|---|---|
| `ONIA Demo Bot` | `telegramApi` | **CREAR** (token de BotFather) | Trigger + envío al prospecto |
| `ONIA VPS SSH` | `sshPrivateKey` | **ya existe** (la usan Vendedor, Backup, Healthcheck) | Correr `run-turn.sh` en el VPS |
| `Telegram account` | `telegramApi` | **ya existe** | Avisar a Sergio (chat `6830070978`) |
| `Google Calendar account` | `googleCalendarOAuth2Api` | **ya existe** | Crear el evento de la demo |

La API key de LiteLLM y el service role de Supabase **no** se configuran en n8n: `run-turn.sh` lee la
master key del contenedor de LiteLLM y `run-turn.mjs` usa las variables que ya tiene el contenedor
`onia-center` (`ONIA_CENTER_SUPABASE_URL` / `ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY`). Un secreto
menos viajando por n8n.

---

## 3. Prerrequisitos en el VPS (los aplica el dueño del carril infra)

1. **Migración** `supabase/migrations/20260725_onia_center_bot_conversations.sql` aplicada
   (tablas `onia_center.bot_conversations` y `onia_center.bot_messages`). **Sin esto el bot igual
   responde**, pero no recuerda nada entre mensajes: cada mensaje arranca en `nuevo`.
2. **Código** en `/opt/onia/bot/`: los `.mjs` de `hermes-content/deploy/vps-ops/bot/`
   (`bot-engine`, `config`, `guardrails`, `intents`, `persistence`, `run-turn`, `followup-run`) más
   `run-turn.sh` y `followup-run.sh`, con `chmod +x` en los dos. Los wrappers copian los `.mjs` al
   contenedor solos, y sólo cuando cambian (comparan un md5 contra `/tmp/onia-bot/.stamp`; comparten
   la misma carpeta y el mismo sello).
3. Prueba en seco desde el VPS, sin tocar n8n:

   ```bash
   echo '{"channel":"telegram","contact_ref":"777","text":"DEMO","message_key":"telegram:1"}' \
     | bash /opt/onia/bot/run-turn.sh
   ```

   Tiene que devolver una línea JSON con `"ok":true` y el mensaje **M0** en `send[0].text`.

---

## 4. Workflow A — `ONIA - Chatbot Demo (Telegram)`

### 4.1 Nodos, en orden

| # | Nodo | Tipo | Qué hace |
|---|---|---|---|
| 1 | `Mensaje del prospecto` | `n8n-nodes-base.telegramTrigger` (updates: `message`) | Entra el mensaje. Credencial `ONIA Demo Bot` |
| 2 | `¿Es nota de voz?` | `n8n-nodes-base.if` | `{{ !!$json.message.voice }}` |
| 3 | `Bajar audio` | `n8n-nodes-base.telegram` (`file:get`, `download: true`) | Solo rama voz |
| 4 | `Transcribir (Speaches)` | `n8n-nodes-base.ssh` | `base64 -w0` del audio → `/opt/onia/voice-transcribe-run.sh voice.oga` |
| 5 | `Normalizar turno` | `n8n-nodes-base.code` | Arma el JSON del turno y lo deja en base64 |
| 6 | `Correr turno (VPS)` | `n8n-nodes-base.ssh` | `BOT_TURN_B64='...' bash /opt/onia/bot/run-turn.sh < /dev/null` |
| 7 | `Leer respuesta` | `n8n-nodes-base.code` | Parsea el stdout y **explota `send[]` en un item por mensaje** |
| 8 | `¿Hay algo que mandar?` | `n8n-nodes-base.if` | `{{ $json.enviar }}` — si es `false`, el bot **calla** |
| 9 | `Responder al prospecto` | `n8n-nodes-base.telegram` (`sendMessage`) | Credencial `ONIA Demo Bot`, `chatId` = `contact_ref` |
| 10 | `¿Avisar a Sergio?` | `n8n-nodes-base.if` | `{{ $json.notify.length > 0 }}` (rama paralela desde el 7) |
| 11 | `Avisar a Sergio` | `n8n-nodes-base.telegram` (`sendMessage`, chat `6830070978`) | Credencial `Telegram account` |
| 12 | `¿Agendó?` | `n8n-nodes-base.if` | `{{ $json.calendar.length > 0 && !!$json.calendar[0].startAt }}` |
| 13 | `Crear evento` | `n8n-nodes-base.googleCalendar` (`event:create`) | Solo si el slot tiene `startAt` |

**Las tres barreras del pipeline (spec §5.2) ya están DENTRO de `run-turn.mjs`**, no en n8n: humano a
cargo, opt-out y guardrail. Los tres fallan hacia el silencio y salen como `send: []` → el nodo 8
corta. n8n no decide nada del guion.

### 4.2 Nodo 5 — `Normalizar turno` (Code, runOnceForAllItems)

```js
// Un solo lugar arma el contrato de entrada de run-turn.mjs.
const update = $('Mensaje del prospecto').first().json;
const msg = update.message || update.edited_message || {};
const chat = msg.chat || {};
const from = msg.from || {};

// La transcripción llega sólo si pasó por la rama de voz.
let transcript = '';
try {
  const stt = JSON.parse(($('Transcribir (Speaches)').first().json.stdout || '').trim().split('\n').pop());
  transcript = stt && stt.ok ? String(stt.text || '') : '';
} catch (e) { transcript = ''; }

const esVoz = Boolean(msg.voice);
const turno = {
  channel: 'telegram',
  contact_ref: String(chat.id),
  display_name: [from.first_name, from.last_name].filter(Boolean).join(' ') || from.username || null,
  kind: esVoz ? 'voice' : (msg.document || msg.photo ? 'attachment' : 'text'),
  text: msg.text || msg.caption || '',
  transcript: transcript,
  // DEDUP: si Telegram reentrega el update, este key ya está en bot_messages y el turno corta.
  message_key: 'telegram:' + chat.id + ':' + msg.message_id,
  received_at: new Date((msg.date || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
  piece_key: null,
  source_campaign: 'lucia-dentalgest-jul2026',
};

return [{ json: { turno, b64: Buffer.from(JSON.stringify(turno)).toString('base64') } }];
```

### 4.3 Nodo 6 — `Correr turno (VPS)` (SSH)

```
resource: command · operation: execute · authentication: privateKey
cwd: /root
command: BOT_TURN_B64='={{ $json.b64 }}' bash /opt/onia/bot/run-turn.sh < /dev/null
```

> El nodo SSH **no tiene stdin**: por eso el turno viaja en `BOT_TURN_B64` y no por pipe. El base64
> de un mensaje de texto son unos pocos KB, muy por debajo del límite de argumentos de Linux.
> Las comillas simples alrededor del base64 son obligatorias (el alfabeto base64 incluye `+` y `/`).

### 4.4 Nodo 7 — `Leer respuesta` (Code, runOnceForAllItems)

```js
const raw = ($input.first().json.stdout || '').trim();
let r;
try { r = JSON.parse(raw.split('\n').pop()); }
catch (e) { r = { ok: false, send: [], notify: [], calendar: [], error: 'stdout ilegible' }; }

const chatId = $('Normalizar turno').first().json.turno.contact_ref;
const enviar = Boolean(r.ok) && Array.isArray(r.send) && r.send.length > 0 && !r.duplicate;

// Un item por mensaje a enviar (el guion puede devolver 2: disclosure + cuerpo).
if (!enviar) {
  return [{ json: { enviar: false, chatId, ...r } }];
}
return r.send.map((m) => ({ json: { enviar: true, chatId, text: m.text, ...r } }));
```

### 4.5 Nodo 9 — `Responder al prospecto` (Telegram)

```
resource: message · operation: sendMessage
chatId: ={{ $json.chatId }}
text:   ={{ $json.text }}
additionalFields: { appendAttribution: false, disable_web_page_preview: true }
```

> **`parse_mode`: dejarlo VACÍO.** El guion usa `**negrita**` estilo Markdown, `_cursiva_` en M7 y
> emojis. Con `parse_mode: Markdown`, Telegram rechaza el mensaje entero si hay un guion bajo o un
> asterisco suelto (mismo error que ya nos pasó con el agente de higiene de docs). Texto plano: se
> ven los asteriscos pero **nunca se pierde un mensaje**. Si más adelante se quiere formato, usar
> `HTML` y escapar en el nodo 7.

### 4.6 Encendido en dos pasos (esto es lo que evita el papelón)

1. **Primer día en seco:** dejar `ONIA_BOT_DRY_RUN=true` (default de `run-turn.sh`) y **desactivar**
   el nodo 9. El pipeline entero corre, `bot_messages` se llena con `delivery_status='skipped'` y
   Sergio lee las conversaciones en el panel sin que el prospecto reciba nada.
2. **Encender:** activar el nodo 9 y poner `ONIA_BOT_DRY_RUN=false` en el comando del nodo 6:
   `ONIA_BOT_DRY_RUN=false BOT_TURN_B64='...' bash /opt/onia/bot/run-turn.sh < /dev/null`.

---

## 5. Workflow B — `ONIA - Chatbot Demo: follow-up único`

**El script ya existe:** `followup-run.mjs` + `followup-run.sh`. Une lo que ya estaba en
`persistence.mjs` y en el motor:

- `store.sweepFollowUpCandidates(nowIso)` — el barrido: `followup_step = 0`, sin humano, sin opt-out,
  estado `esperando_calificacion` o `esperando_horario`, y `last_inbound_at` entre **22 h y 7 días**.
- `store.reserveFollowUp(key, paso)` — **la reserva CAS, ANTES de enviar**. Si devuelve `false`, no se
  manda nada. Preferimos perder un follow-up a mandar dos: un duplicado quema el quality rating del
  número.
- `buildFollowUp(state, nowIso, config)` de `bot-engine.mjs` — arma el texto **M3**.

**Las 22 h no son negociables**: mantienen el mensaje dentro de la ventana de servicio de 24 h de
Meta, así que en WhatsApp no hace falta plantilla HSM aprobada ni cuesta un mensaje *utility*.

### 5.1 Nodos, en orden

| # | Nodo | Tipo | Qué hace |
|---|---|---|---|
| 1 | `Cada hora` | `n8n-nodes-base.scheduleTrigger` (`hours`, cada 1 h) | Dispara el barrido |
| 2 | `Barrer follow-ups (VPS)` | `n8n-nodes-base.ssh` | Corre el script con `--emit`. Credencial `ONIA VPS SSH` |
| 3 | `Leer candidatas` | `n8n-nodes-base.code` | Parsea el stdout y **explota `send[]` en un item por conversación** |
| 4 | `¿Hay follow-up?` | `n8n-nodes-base.if` | `{{ $json.enviar }}` — si es `false`, no se manda nada |
| 5 | `Mandar follow-up` | `n8n-nodes-base.telegram` (`sendMessage`) | Credencial `ONIA Demo Bot`, `chatId` = `contactRef` |

**La reserva ya la hizo el paso 2, no n8n.** Cuando el JSON llega al nodo 3, cada item de `send[]`
tiene `reserved: true` y su fila ya está en `bot_messages`: si el workflow se reintenta, el barrido
siguiente ya no la devuelve (`followup_step = 1`). Por eso el nodo 5 **no** debe tener reintentos
automáticos con `alwaysOutputData`: un reintento del envío sí duplicaría el mensaje.

### 5.2 Nodo 2 — `Barrer follow-ups (VPS)` (SSH) — comando exacto

```
resource: command · operation: execute · authentication: privateKey
cwd: /root
command: bash /opt/onia/bot/followup-run.sh --emit
```

El wrapper sella el `--now` con `date -u` y se lo pasa al script como parámetro: la lógica nunca mira
el reloj, así que un barrido se puede reproducir tal cual con
`bash /opt/onia/bot/followup-run.sh --now 2026-07-28T14:05:00Z`.

Los 2 horarios de demo viajan por env, igual que en el Workflow A. Cuando Sergio los defina:

```
command: ONIA_BOT_SLOTS='jue 31/07 15:00@2026-07-30T19:00:00Z|vie 01/08 10:00@2026-07-31T14:00:00Z' ONIA_BOT_DRY_RUN=false bash /opt/onia/bot/followup-run.sh --emit
```

> **Sin los horarios definidos el follow-up NO sale**: M3 ofrece dos opciones, y mandar
> "HORARIO A (pendiente de definir)" a un prospecto real es peor que perder el mensaje. El script
> devuelve esas conversaciones en `skipped` con motivo `slots_sin_definir` y **no gasta la reserva**
> (el `followup_step` queda en 0, así que salen apenas haya horarios).

### 5.3 Nodo 3 — `Leer candidatas` (Code, runOnceForAllItems)

```js
const raw = ($input.first().json.stdout || '').trim();
let r;
try { r = JSON.parse(raw.split('\n').pop()); }
catch (e) { r = { ok: false, send: [], skipped: [], error: 'stdout ilegible' }; }

const enviar = Boolean(r.ok) && Array.isArray(r.send) && r.send.length > 0;
if (!enviar) {
  // Lo normal es que no haya candidatas: no es un error, no hay que avisar nada.
  return [{ json: { enviar: false, scanned: r.scanned || 0, skipped: r.skipped || [], error: r.error || null } }];
}
// Un item por conversación. `reserved: true` = el CAS ya la tomó; esto es lo único que se manda.
return r.send
  .filter((m) => m.reserved === true)
  .map((m) => ({ json: { enviar: true, chatId: m.contactRef, text: m.text, conversationKey: m.conversationKey } }));
```

### 5.4 Nodo 5 — `Mandar follow-up` (Telegram)

```
resource: message · operation: sendMessage
chatId: ={{ $json.chatId }}
text:   ={{ $json.text }}
additionalFields: { appendAttribution: false, disable_web_page_preview: true }
retryOnFail: false
```

`parse_mode` vacío, por lo mismo que el nodo 9 del Workflow A (§4.5).

### 5.5 Encendido en dos pasos

1. **En seco:** correr a mano `bash /opt/onia/bot/followup-run.sh` (sin `--emit`) y leer la tabla. No
   reserva ni escribe nada: sólo dice a quién le mandaría, qué texto y hace cuántas horas que está
   callado. Ejemplo real de salida:

   ```text
   ONIA — follow-up M3 (22 h) · modo dry-run · dryRun
   ahora: 2026-07-28T14:05:00Z · candidatas del barrido: 4

   MANDARIA (1)
     telegram:777 [telegram] Ana Quiroga — esperando_horario, callado hace 24 h
         | ¡Hola de nuevo! Te escribí ayer por la demo de DentalGest y quedó a medias — sé que la clínica no para.
         |
         | Te dejo dos opciones nuevas por si te sirven: **jue 30/07 15:00** o **vie 31/07 10:00**.
         | Si preferís que te escriba en otro momento, decime "después" y no te molesto más.

   NO SE MANDA (3)
     telegram:812 — demasiado_pronto:17.4h
     telegram:900 — opt_out
     whatsapp:59178491375 — humano_a_cargo
   ```

2. **Encender:** activar el workflow con el nodo 5 habilitado y `ONIA_BOT_DRY_RUN=false` en el
   comando del nodo 2 (así `bot_messages` registra `delivery_status='sent'` en vez de `'skipped'`).

---

## 6. Cómo se toma la conversación un humano

`human_took_over = true` significa **el bot no vuelve a hablar en esa conversación, nunca**, y sólo
Sergio puede devolvérsela desde el panel. Cómo se activa según el canal:

- **Telegram (hoy):** Sergio no está en el chat privado del prospecto, así que **no hay detección
  automática**. Se marca desde el panel (o con un `PATCH` a
  `bot_conversations?conversation_key=eq.<key>` con `{"human_took_over": true}`). El turno también
  acepta `"human_takeover": true` en el payload si algún día un nodo lo detecta.
- **WhatsApp (fase 4):** el eco de un mensaje saliente escrito por Sergio desde la app llega por
  webhook → ese nodo manda el turno con `human_takeover: true` y el bot se calla solo.

---

## 7. Esqueleto JSON del Workflow A

Importable en n8n, **con los IDs de credencial vacíos a propósito** (los completa quien tenga el
carril de infra; yo no pego tokens en el repo). Los nodos 3, 4, 10-13 se agregan después del primer
camino feliz: primero que ande texto puro.

```json
{
  "name": "ONIA - Chatbot Demo (Telegram)",
  "settings": { "executionOrder": "v1" },
  "nodes": [
    {
      "name": "Mensaje del prospecto",
      "type": "n8n-nodes-base.telegramTrigger",
      "typeVersion": 1.1,
      "position": [0, 0],
      "parameters": { "updates": ["message"], "additionalFields": {} },
      "credentials": { "telegramApi": { "id": "PEGAR_ID_ONIA_DEMO_BOT", "name": "ONIA Demo Bot" } }
    },
    {
      "name": "Normalizar turno",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [224, 0],
      "parameters": { "mode": "runOnceForAllItems", "language": "javaScript", "jsCode": "VER §4.2" }
    },
    {
      "name": "Correr turno (VPS)",
      "type": "n8n-nodes-base.ssh",
      "typeVersion": 1,
      "position": [448, 0],
      "parameters": {
        "resource": "command",
        "operation": "execute",
        "authentication": "privateKey",
        "cwd": "/root",
        "command": "=BOT_TURN_B64='{{ $json.b64 }}' bash /opt/onia/bot/run-turn.sh < /dev/null"
      },
      "credentials": { "sshPrivateKey": { "id": "PEGAR_ID_ONIA_VPS_SSH", "name": "ONIA VPS SSH" } }
    },
    {
      "name": "Leer respuesta",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [672, 0],
      "parameters": { "mode": "runOnceForAllItems", "language": "javaScript", "jsCode": "VER §4.4" }
    },
    {
      "name": "¿Hay algo que mandar?",
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.3,
      "position": [896, 0],
      "parameters": {
        "conditions": {
          "options": { "caseSensitive": true, "typeValidation": "loose", "version": 2 },
          "combinator": "and",
          "conditions": [
            {
              "id": "cond-enviar",
              "leftValue": "={{ $json.enviar }}",
              "rightValue": "",
              "operator": { "type": "boolean", "operation": "true", "singleValue": true }
            }
          ]
        }
      }
    },
    {
      "name": "Responder al prospecto",
      "type": "n8n-nodes-base.telegram",
      "typeVersion": 1.2,
      "position": [1120, 0],
      "parameters": {
        "resource": "message",
        "operation": "sendMessage",
        "chatId": "={{ $json.chatId }}",
        "text": "={{ $json.text }}",
        "additionalFields": { "appendAttribution": false, "disable_web_page_preview": true }
      },
      "credentials": { "telegramApi": { "id": "PEGAR_ID_ONIA_DEMO_BOT", "name": "ONIA Demo Bot" } },
      "disabled": true
    }
  ],
  "connections": {
    "Mensaje del prospecto": { "main": [[{ "node": "Normalizar turno", "type": "main", "index": 0 }]] },
    "Normalizar turno": { "main": [[{ "node": "Correr turno (VPS)", "type": "main", "index": 0 }]] },
    "Correr turno (VPS)": { "main": [[{ "node": "Leer respuesta", "type": "main", "index": 0 }]] },
    "Leer respuesta": { "main": [[{ "node": "¿Hay algo que mandar?", "type": "main", "index": 0 }]] },
    "¿Hay algo que mandar?": { "main": [[{ "node": "Responder al prospecto", "type": "main", "index": 0 }]] }
  }
}
```

> `"disabled": true` en el nodo de envío es a propósito: se importa **mudo** y se enciende recién
> después de leer las primeras conversaciones en el panel (§4.6).

---

## 8. Prueba de aceptación (antes de decir "anda")

Con el nodo de envío ya activo, escribirle al bot desde el Telegram de Sergio:

| # | Se escribe | Tiene que pasar |
|---|---|---|
| 1 | `DEMO` | Llega **M0** presentándose como bot. `bot_conversations` en `esperando_calificacion` |
| 2 | `es mia, 2 sillones, santa cruz` | Llega **M1b** con los 2 horarios. **Aparece el lead** en el pipeline como `Contactado` |
| 3 | `A` | Llega **M2**. Lead pasa a `Reunion`. A Sergio le llega el aviso |
| 4 | `cuanto cuesta?` (en otra conversación) | **M4**: nunca una cifra |
| 5 | `STOP` | **M6** y después silencio total. Sólo `DEMO` reabre |
| 6 | Reenviar el mismo mensaje | **No se duplica**: el segundo turno devuelve `duplicate: true` |
| 7 | Dejar el caso 1 sin responder 22 h y correr el Workflow B dos veces | Llega **M3 una sola vez**. El segundo barrido no devuelve nada (`followup_step = 1`) |

Los 7 casos ya están cubiertos por las 91 pruebas de
`node --test "hermes-content/deploy/vps-ops/bot/*.test.mjs"`. Esta tabla verifica el **cableado**, no
el motor.

---

## 9. Lo que sigue bloqueado (no se resuelve desde acá)

| Bloqueo | Quién | Sin eso |
|---|---|---|
| Token de BotFather | **Sergio (5 min)** | No hay Fase 3 |
| Los 2 horarios fijos de demo | **Sergio** | El bot ofrece `HORARIO A/B (pendiente de definir)`, `scheduled_at` queda `null` y **el follow-up M3 no sale** (§5.2) |
| Aplicar la migración `20260725_...bot_conversations.sql` | carril infra | El bot no recuerda nada entre mensajes **ni hay follow-up** (el barrido no tiene de dónde leer) |
| Copiar `/opt/onia/bot/` al VPS | carril infra | Los dos nodos SSH fallan |
| Verificación de Meta / WABA | Meta | No hay WhatsApp (y no hace falta para probar) |

# Handoff — carril `chatbot`

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: 2026-08-28 (sesión "chatbots dentro de la plataforma", referentes
> Lety/Dapta). El handoff anterior (2026-08-23/24, widget + IG→DM) quedó en git.

---

> ⚠️ SEGUNDA PASADA del mismo dia (Sergio contesto las 5 preguntas y amplio el alcance).
> Lo de abajo se conserva; esto es lo NUEVO de la tarde-noche:

## Pasada 2 (2026-08-28 noche) — los 4 frentes de Sergio

1. **Auto check-in (Embedded Signup): ENCENDIDO del lado servidor.** Verificado en el
   panel de Meta con la sesion de Sergio: Access Verification ✅ ("proveedor de
   tecnologia"), configuracion "Onia Embedded Signup" ya existia (ID 1824225392073753,
   variacion Registro insertado de WhatsApp, token que no caduca). Hecho hoy: SDK de
   JavaScript en Si + dominio `https://chat.onia.com.bo` autorizado (regla: el popup se
   abre SIEMPRE desde ese host) + las 3 InstallationConfigs en Chatwoot via rails runner
   (secret copiado server-side desde webhook.env, validado contra Graph antes; jamas
   impreso). **FALTA SOLO: la prueba del popup con un +591 real — la hace Sergio**
   (chat.onia.com.bo → Add Inbox → WhatsApp → Connect with WhatsApp Business).
2. **FAQ del negocio (id "negocio") — VIVA punta a punta.** Motor: FAQ_TEMPLATE.negocio,
   el recepcionista la consume como lista (tags = disparadores, match de palabra entera),
   R_FAQ_NEGOCIO, checkFaqNegocio (sin disparador se rechaza entero). Platform: validador
   espejo + Bloque E en el editor (pregunta/respuesta/palabras). Control de calidad =
   guardrails en ambos lados + todo-o-nada + vigencia. E2E EN PROD: FAQ escrita en el
   editor y contestada por el probador via el motor real. Commits: motor en este repo;
   platform ef6cd06 (deployado, BUILD_ID XpAGQVBjukfE50fZacoBm).
3. **Pagos QR BCP — circuito COMPLETO en mock.** /bcp/cobrar (humano, Bearer) genera QR
   → imagen a la conversacion; /bcp/callback (Basic del banco) → "✅ Pago recibido" en el
   mismo hilo. Contrato del banco calcado (State 000/003/099; Collectors llevan la
   conversacion: stateless). Verificado MIRANDO en la conversacion QA 27 (msgs 186/187).
   Para modo real faltan: credenciales del banco + mTLS (.pfx) — el codigo no cambia.
   Env mock en webhook.env (BCP_MODE=mock + callback fake).
4. **Telegram = SOLO errores.** Silenciado: reporte diario de seguridad (IPs baneadas),
   digest semanal, briefing diario, agenda+energia, reporte Sergio+Arthur (Arthur ya no
   colabora), vigilante n8n del chatbot (duplicaba al watchdog y daria falsa alarma con
   source=db), barridos n8n (duplicaban el cron del VPS desde el 16-ago), building in
   public (su propia descripcion decia DESACTIVADO). El watchdog ahora avisa: bot caido
   (1/incidente + recuperacion) y BOT MUDO hacia Chatwoot (el fallo que /health no ve).
   Mensaje de prueba enviado y confirmable en su Telegram.

### 🔴 El hallazgo mas caro de la pasada 2

**El bot estuvo MUDO hacia Chatwoot desde el reboot del 24-ago** — el proceso revivio a
las 19:20 pero sus POST a Chatwoot (respuestas reales) y el fetch de conocimiento db
(center→platform:3000) seguian rotos: el attachment de onia-center a la red overlay
easypanel quedo rancio (resolvia la VIP 10.11.0.16 sin retorno). /health no lo ve (la
base va por supabase-kong:8000). **Fix**: `docker network disconnect easypanel
onia-center && docker network connect --alias onia-center easypanel onia-center`.
El watchdog ahora chequea ese camino cada 2 min y avisa por Telegram.

### Pendientes que quedaron de la pasada 2

- Los agentes n8n que SI trabajan (Vendedor, Contenido, Finanzas, Prospector, Radar IA,
  Web Factory Radar) siguen avisando por Telegram al terminar — para silenciarlos hay que
  editar cada workflow (no apagarlo: hacen trabajo). Decision de Sergio pendiente, igual
  que los recordatorios de agenda cada 30 min.
- Pricing "solo widget web": pregunta aclarada (la burbuja de chat en la web del cliente,
  como la de onia.com.bo); Sergio decide si existe un escalon mas barato sin WhatsApp.
- La FAQ de prueba del E2E quedo SIN publicar (solo borrador del probador) — cero basura.
- ✅ BACKLOG v2 tarea 5 (2026-08-29): latencia LiteLLM — DIAGNOSTICO CERRADO, nada que
  tocar. Medido desagregado desde el contenedor litellm: DNS 20ms, TCP 7ms, TLS 23ms al
  api.openai.com; upstream directo 1.6s fria / 726ms keep-alive; via LiteLLM 633-779ms;
  desde el MOTOR (red overlay, gpt-4.1-mini del bot) 1005ms fria / 481ms caliente.
  EL PISO DE 11-13s DEL 23-AGO ERA EL VPS ESTRANGULADO (steal 93%), no LiteLLM — con el
  VPS sano el camino entero anda en ~0.5-1s. Propuesta a Sergio: NO tocar config; si el
  sintoma reaparece, re-correr esta medicion (el script quedo en el handoff/chat). El
  pendiente #1 del handoff del 23-ago (investigar LiteLLM→OpenAI) queda SALDADO.
- ✅ BACKLOG v2 tarea 4 (2026-08-29): claves hardcodeadas de n8n SANEADAS — conteo EN VIVO
  dio 4 workflows con secretos (la memoria decia 7: vieja), TODOS inactivos legacy
  (WF-GS-02/03/04 + WF-11): JWTs de Supabase CLOUD. Redactadas 27 ocurrencias via sqlite3
  DENTRO del contenedor (BEGIN IMMEDIATE), verificado WAL-aware: 0 secretos en 87 workflows.
  Los 4 ARCHIVADOS. Backup completo (4 JSON + database.sqlite.pre-redact, chmod 600) en
  /root/n8n-backup-secretos-20260829-152708/ — FUERA del repo.
  HALLAZGOS para Sergio: proyecto Supabase cloud Dental-gest (kvepqgikokjlacxngkiw)
  sigue ACTIVE_HEALTHY (el cloud muerto no esta muerto — decidir pausar/borrar);
  Gesti-Os (jafxylfocvvlflpqfsix) INACTIVE con su service_role expuesto en esos JSON:
  si algun dia se reactiva, ROTAR la clave primero.
  Trampas pagadas (no repetir): docker exec sin -i con heredoc = ejecuta NADA con exit 0
  (segunda vez hoy); docker cp de un SQLite en WAL copia SIN los cambios — verificar
  SIEMPRE dentro del contenedor; n8n import:workflow del CLI NO pisa por id.
- ✅ BACKLOG v2 tarea 7 (2026-08-29): RUNBOOK ESCRITO del traslado del 75414930 a
  coexistencia — hermes-content/docs/ONIA_RUNBOOK_COEXISTENCIA_75414930.md (deregister→
  app→QR del popup, PIN de dos pasos como prerequisito duro, rollback = register con pin,
  regla 30 dias = jamas borrar del WABA). La EJECUCION sigue GATEADA: OK explicito de
  Sergio + ventana acordada + ensayo del chip nuevo pasado.
- ✅ BACKLOG v2 tarea 6 (2026-08-29): n8n inactivos ARCHIVADOS (decision Sergio). Conteo
  EN VIVO: 34 inactivos → 27 archivados (WF-* dentalgest/gestios legacy, demos New
  Sakura/Mara/Atlas, drafts Sentry, duplicados IG-DM y Web Factory Radar, prospeccion v1,
  tipo de cambio, reporte Arthur — obsoleto: Arthur ya no colabora) y 7 QUEDAN pausados
  por decision reciente, visibles a proposito (digest, briefing, agenda+energia, barridos
  chatbot, vigilante, building-public, video-intake). 25 via MCP; 2 sin acceso MCP
  (Chatbot Demo, WF Radar viejo) via sqlite in-container con isArchived=1 y verificacion
  DENTRO del contenedor: quedan exactamente 7 inactivos sin archivar. Archivar es
  reversible desde la UI de n8n (filtro Archived).
- ✅ BACKLOG v2 tarea 3 (2026-08-29): confirmacion de correo real DETRAS DE SWITCH
  (ONIA_REGISTRO_CONFIRMA_CORREO=si → signUp de GoTrue + mail de confirmacion; 409 por
  respuesta ofuscada; sin welcome en ese camino; el front ya lo manejaba via
  isEmailNotConfirmed). Deploy 953eaa2 (BUILD_ID whS_w1Go), suite 2129. ⚠️ ENCENDIDO REAL
  al abrir el alta = DOS flips: el env de la app + GOTRUE_MAILER_AUTOCONFIRM=false en
  supabase-auth2 (hoy true, verificado), recreando ese contenedor SIN perder aliases.
- ✅ BACKLOG v2 (loops 5min tareas + 15min orden, 2026-08-29): tarea 2 CERRADA — los 2
  tests de leads preexistentes fijaban null pre-centinela; actualizados al contrato real
  (RUBRO_SIN_DEFINIR). Suite del motor 569/569, 100% verde por primera vez.
- ✅ PIEZA 6 CERRADA (2026-08-29) — BACKLOG COMPLETO. Endurecimiento del alta: honeypot
  "sitioWeb" invisible en los DOS formularios + exito FALSO en las DOS rutas (bot ciego,
  cero filas — probado contra prod: 201 y count intacto), y limitSeguro() con fail-open
  (Upstash caido ya no tumba el alta). El switch ONIA_ALTA_AUTOMATICA=abierta (del 21-ago)
  queda listo: abrir = una env + recrear contenedor, ya blindado. /register MIRADO: identico,
  cero cartel de obra. Deploy e151b78 (BUILD_ID sKVWnaQ9P_EI0i_Rc67lM).
  CHOQUE RESUELTO por el libro: dos carriles ajenos (copy-vendible, fiscal-mock) mergearon a
  master en el medio — rebase encima, suite 2126 del arbol combinado, push, build relanzado.
  DECISION PENDIENTE DE SERGIO antes de abrir: verificacion de correo real (hoy
  email_confirm:true — cualquiera registra con cualquier email).
- ✅ PIEZA 5 CERRADA (2026-08-29): org QA con agenda REAL creada por protocolo (org
  zzqa-horario-0001 "ZZ QA Horario", user oninteligenciaartificial+qahorario@gmail.com,
  cred en /root/onia-qa-horario.credentials, 6 tramos lun-sab 08:30-18:30). MIRADO en
  prod logueado como ese dueño: la plantilla abre con "lun-sáb, 8:30-18:30" (la doble
  convención de dayOfWeek en vivo) y el canal web pasó por sus 3 estados — el click del
  dueño lo encendió y mostró el snippet real con token. ⚠️ Data QA nueva para la limpieza
  final del carril: la org + su usuario + el inbox "ZZ QA Horario" que creó el botón.
  Intento fallido (no repetir): docker exec SIN -i con heredoc SQL = psql lee EOF y sale
  0 sin ejecutar NADA — el alta pareció correr y solo el count lo delató.
- ✅ PIEZA 4 CERRADA (2026-08-29): delivery_status HONESTO. run-turn expone messageKey
  en send[]; el adapter marca sent/failed tras cada POST real (patron M9), guard typeof
  para stores parciales. 5 tests nuevos (567/569). E2E en prod: POST rechazado => fila
  failed (verificado leyendo la fila; antes mentia sent). El pendiente B del handoff
  del 23-ago queda saldado.
- ✅ PIEZA 3 CERRADA (2026-08-29 00:55): el canal web quedo en manos del DUEÑO. Boton
  "Encender mi canal web" + snippet listo para pegar, en /settings/chatbot (card al pie),
  gate por add-on activo (403 honesto sin contratarlo). Nucleo compartido con el alta
  superadmin extraido a lib/chatbot/canal-web.ts (sus 9 tests intactos) + 9 tests nuevos.
  Deploy ab863de con el runner atomico deploy-gates-swap.sh (5 gates → swap, BUILD_ID
  NpXP1o6K). MIRADO en prod: estado "Contratar el chatbot" con Onia (interna); los
  estados encender/snippet quedan por mirar con la org QA de la pieza 5.
- ✅ LIMPIEZA QA EJECUTADA (2026-08-29 00:40, aprobada por Sergio): Chatwoot 10 conversaciones
  (23-27, 29, 31-33) + inbox 6 huerfano destruidos via rails (cascada completa); bot 12
  bot_conversations + 52 bot_messages sinteticos. Backups CSV en
  /opt/onia/backups/db/qa-limpieza-20260829-003953/. Verificado: 0 restantes de la lista,
  widget publico online, health ok. Quedan 26 conversaciones reales en la cuenta 2.
- El QR mock y el "pago recibido" quedaron en la conversacion QA 27 (basura QA inofensiva,
  misma limpieza pendiente de siempre).

---

**Objetivo**

Entender el estado real del chatbot como producto de la plataforma contra los referentes
(Lety, Dapta) y arrancar el desarrollo de la visión de Sergio: app propia, auto check-in
(Embedded Signup), pagos en el chat. *Hecho* = diagnóstico + primer desarrollo commiteado,
desplegado y MIRADO en producción.

**Resultado: CUMPLIDO — y el loop de revisión encontró y resolvió una caída de 4 días del
motor que nadie había visto.**

---

**Qué quedó EN PRODUCCIÓN (verificado MIRANDO, capturas en el scratchpad de la sesión)**

### 1. El editor del chatbot abre PRE-ARMADO con la plantilla del rubro (NUEVO)

La copia #1 de Lety que Sergio decidió el 17-ago ("el cliente construye SU chatbot solo").
`onia-platform` commits `bd2350c` + `9585db4` (master, pusheados a origin, deployados):

- `lib/chatbot/plantillas.ts` — `plantillaDeTrack(track, nombre)`: documento
  `onia.bot.knowledge/1` por rubro (identidad + botName, horario con frase, cita, servicios
  típicos). Dental/estética/veterinaria traen 5-6 servicios; comercio/servicios/proveedores
  solo identidad+horario (adivinar el catálogo de un comercio es inventar). `ganadero-offline`
  → null (el core le bloquea WhatsApp). Sin `rubrosExtra` (el motor ya sabe esos 6 rubros en
  código) y sin `humanName` (dato de la org, no del rubro — vacío = el bot deriva honesto).
- **19 tests nuevos**; la regla que fijan: TODA plantilla pasa el validador del motor TAL
  CUAL (si no, el dueño publicaría un pre-armado que el motor rechaza). Suite 2094 passed |
  5 skipped (baseline era 2075). `tsc` limpio.
- `/settings/chatbot` con org sin fila publicada → formulario pre-cargado + banner "Tu bot
  ya viene armado para tu rubro… Nada queda publicado hasta que aprietes Publicar".
- **Verificado en prod MIRANDO**: org "Onia (interna)" (dental, sin fila) muestra plantilla
  completa; el probador contestó "¿qué días atienden?" → "¡Hola! Soy el asistente de Onia
  (interna) 🙂 · Atendemos lun-vie, 9:00-18:00…" (motor real, voz recepcionista).

### 2. Bug de UI preexistente arreglado: el nombre del servicio era invisible

El `select` del tipo llevaba el `w-full` de `inputClass` además de `w-36`; en el flex ganaba
`w-full` y el input del nombre quedaba en **26px** (los valores estaban en el DOM, invisibles
en pantalla). Estaba en prod desde que existe la fila de productos; lo destapó la plantilla.
Fix `9585db4` (selectClass sin w-full). Verificado: 6 nombres legibles a 378px.

### 3. 🔴→🟢 El motor del bot estuvo CAÍDO 4 días y volvió (hallazgo del loop, no del plan)

**Caído desde el 24-ago 02:14 UTC** — 2.796 reintentos fallidos del watchdog sin que nadie
se entere (widget público muerto, probador muerto, cero alertas). DOS causas apiladas del
estrangulamiento del VPS:

1. **`/tmp/onia-bot` a medias**: un `docker cp` parcial bajo CPU estrangulada dejó 42 de 44
   `.mjs` PERO escribió el `.stamp`, así que ningún restart re-copiaba; el proceso moría al
   importar `audio-transcribe.mjs` (ERR_MODULE_NOT_FOUND) en cada relanzamiento.
   **Fix**: borrar `/tmp/onia-bot` del contenedor + `webhook-server.sh restart` → 44/44.
2. **La excepción de firewall se perdió en el reboot del 24-ago** (exactamente lo que la
   memoria `vps-firewall-bloquea-3000` advertía): `ONIA-BLOCK-3000` en DOCKER-USER quedó sin
   su `RETURN` interno→interno y el bot no llegaba a PostgREST (health `db timeout`).
   **Fix**: regla `ONIA-ALLOW-3000-INTERNO` re-aplicada, y **auto-curada desde
   `webhook-watchdog.sh`** (cada 2 min, `-C` con comment para no duplicar — la primera
   versión sin comment duplicaba; deduplicado y verificado idempotente, count=1).

**Estado final verificado**: health `ok:true, db ok 52ms` · widget público de onia.com.bo
con "Onia Bot" **online** (API inbox_members) · `/admin/chatbots` muestra "Motor OK · Base
OK · 31 ms".

### 4. VPS recuperado — deploy desbloqueado

Load 0.43 (venía de 158 con steal 93%). La penalidad de Hostinger se levantó entre el 24 y
el 28. Dos deploys de onia-platform corrieron limpios hoy (runbook completo: tarball → build
en VPS → gates 0-5 → swap con backup → mirar renderizado). Memoria actualizada.

---

**Qué quedó a medias, y dónde**

> ⚠️ Bloque saneado 2026-08-29 (2ª pasada): TODO lo que decía acá está saldado:
> plantilla bebe horario real ✅ · LiteLLM diagnosticado ✅ · delivery_status honesto ✅ ·
> limpieza QA ✅ · watchdog ERROR→Telegram cableado ✅ · y el "probador con borrador corre
> funnel de venta" era FALSO desde el 18-ago: preview-route.mjs aplica asRecepcionista al
> borrador (decisión Sergio en el propio código) y knowledge.test.mjs lo fija con test
> ("borrador => recepcionista, no M0 de venta", M0R + pastillas + dato del borrador).
> Lección: un pendiente heredado se verifica CONTRA EL CÓDIGO antes de copiarlo a un backlog
> — este sobrevivió dos saneos por repetirse sin contar de nuevo. BACKLOG v3 tarea 2: tachada
> sin trabajo (ya existía).

- BRANDING Chatwoot COMPLETO (2026-08-29, pedido directo de Sergio al ver el logo Chatwoot
  en chat.onia.com.bo/app/login): ahora son SEIS installation_configs, no tres —
  BRAND_NAME=Onia, INSTALLATION_NAME=Onia, WIDGET_BRAND_URL=https://onia.com.bo,
  LOGO=https://app.onia.com.bo/onia-logo.svg (wordmark tinta, fondo claro),
  LOGO_DARK=https://app.onia.com.bo/onia-logo-white.svg (wordmark claro, fondo oscuro),
  LOGO_THUMBNAIL=https://onia.com.bo/apple-icon.png (tile on). GlobalConfig.clear_cache
  despues de tocar. VERIFICADO MIRANDO: captura headless del login dark = wordmark onia
  claro + punto verde, cero Chatwoot. Si el reconcile nocturno revierte (canario del loop
  de orden: brand distinto de Onia), re-aplicar LOS SEIS.

- BACKLOG v3 tarea 3 CERRADA (2026-08-29): CANARIO DE AUTH vivo en el VPS —
  /opt/onia/auth-canary.sh (espejo hermes-content/deploy/vps-ops/), cron */5 min.
  Prueba el CAMINO real que fallo el 16-ago: onia-center → supabase-kong:8000
  /auth/v1/settings (anon key del app.env, atraviesa el alias auth) + login publico 200.
  Telegram SOLO errores, 1 aviso/incidente + recuperacion (marcador /var/lib), runbook
  del alias en el propio mensaje de alerta. Probado en vivo: camino feliz, rama de error
  (marcador creado) y recuperacion (marcador limpio) — las 3 verdes.
- BACKLOG v3 tarea 4 CERRADA (2026-08-29): clon local onia-platform master al dia con
  origin (FF limpio, 0-0). Lo ajeno era el merge del PR 51 fix/ui-traga-el-403.
- BACKLOG v3 tarea 5 CERRADA (2026-08-29): BENCH DE HUMO de plantillas —
  bot/humo-plantillas.mjs + fixture plantillas-humo.json (espejo y /opt/onia/bot/).
  Corre las 6 plantillas reales del editor contra el motor REAL via handlePreviewRequest:
  validateKnowledge + 'hola' debe contestar M0R recepcionista con botones y el nombre
  del negocio. Resultado 6/6 verdes. Regenerar el fixture cuando cambie plantillas.ts
  (one-liner tsx en el header del script; tsx NO esta instalado en onia-platform, se usa
  npx -y y el -e evalua CJS: require, no import).
- BACKLOG v3 tarea 6 CERRADA (2026-08-29) — con giro: la validacion HMAC de Cal.com
  no tenia que encenderse sino que el WORKFLOW entero sobraba. Verificado en vivo:
  Cal self-hosted YA NO CORRE en el VPS (el runbook decia "produccion activa" — realidad
  distinta: cal.onia.com.bo redirige 302 al comodin) y el webhook calcom-booking llevaba
  0 ejecuciones en el historial: huerfano y expuesto a POSTs forjados (Telegram falso de
  "reunion agendada"). DESPUBLICADO. Secret listo para el renacimiento en
  /root/.config/onia/calcom-webhook.secret; pasos exactos en el encabezado de
  ONIA_CALCOM_SELF_HOST_RUNBOOK_2026.md. BACKLOG v3: 6/6 TERMINADO.

## BACKLOG v4 — BANDEJA NATIVA (decision Sergio 2026-08-29)

- ✅ Fase A (reconocimiento): arquitectura cerrada. Fuente = API Chatwoot cuenta 2
  server-side (CHATWOOT_BASE_URL/API_TOKEN/ACCOUNT_ID ya en app.env; token JAMAS al
  browser). Tenencia: org → clinic_settings.chatwootInboxId; toda op valida
  conversacion.inbox_id === inbox de la org. Candado bot-humano: el motor YA tiene
  handoff_humano pegajoso (silencio salvo click exacto de boton FAQ — recepcionista.mjs
  L113); falta SOLO la entrada nueva: outgoing de agente humano (sender != bot user 3,
  no private) ⇒ conversacion pasa a handoff_humano (fase C). El adapter ya normaliza
  message_type string/numerico y sender.
- ✅ Fase B (backend): commit onia-platform 741d56d. lib/chatwoot.ts + listConversations/
  getConversation/listMessages/toggleConversationStatus (shapes crudos defensivos:
  data.payload ?? payload; epoch y string). lib/chatbot/bandeja.ts puro (mapearResumen,
  mapearMensaje cliente/bot/negocio, esDeInbox) + bandeja-auth.ts (bandejaProfile —
  separado porque route.ts de Next solo exporta handlers). Rutas GET /api/bandeja,
  GET+POST /api/bandeja/[id] (Zod discriminado responder/estado, 404 tenencia — no 403
  para no confirmar existencia, 502 honesto). Registradas comunes. 22 tests nuevos,
  36/36 con registry, tsc limpio.
- ✅ Fase E CERRADA (2026-08-29) — BACKLOG v4 COMPLETO: LA BANDEJA NATIVA ESTA VIVA
  EN PRODUCCION. Deploy 1: 8a2f26c (BUILD_ID LQiBVaxIRU8LY0skG4vAA, runner 5 gates).
  Review de seguridad (subagente): 0 CRITICAL; HIGH corregido (la lista revalida
  tenencia con esDeInbox fila por fila — no se le delega a Chatwoot), MEDIUM (404
  uniforme, sin oraculo de enumeracion), LOW (botUserId blindado a NaN). Deploy 2
  con los fixes: 897e586 (BUILD_ID U0UUnMU3by8I-V9rVP-UG), 24/24 tests bandeja.
  VERIFICADO MIRANDO con ciclo real: conversacion creada en inbox QA 7 (conv 39)
  → bot contesto M0R recepcionista → login como dueno QA (cred nueva en
  /root/onia-qa-chatbot.credentials chmod 600) → /inbox pinto lista+burbujas →
  respuesta desde la UI → candado ARMADO (human_took_over=t) → "Marcar resuelta"
  desde la UI → DESARMADO (f). Capturas /tmp/bandeja-*.png; la 3 enviada a Sergio.
  Hallazgo colateral (data QA, no motor): el doc publicado de la org QA tiene texto
  sucio ("Atendemos Atendemos", markdown _..._ sin render) — limpiar el doc QA o
  revisar si R_HORARIO antepone "Atendemos" a una frase que ya lo trae (candidato
  backlog v5 junto a multimedia + boton Cobrar QR en la conversacion).
- ✅ Fase D (pantalla /inbox) CERRADA (2026-08-29): commit onia-platform 8a2f26c.

## BACKLOG v5 (2026-08-29, "haremos que vea fotos videos enlaces" + cobro QR)

- ✅ Pieza 2 CERRADA: MULTIMEDIA EN LA BANDEJA — attachments de Chatwoot tipados
  (imagen/video/audio/archivo, data_url + thumb) del backend a /inbox: imagen inline
  lazy con miniatura clickeable, players nativos de video/audio, link de archivo, y la
  lista describe el ultimo mensaje solo-adjunto ("📷 Foto"/"🎥 Video"). Platform
  d5c8b53, deploy runner BUILD_ID ksDIEIZaicbJXyT2esTcI. VERIFICADO MIRANDO: foto real
  adjuntada a la conv 39 (msg 201) y renderizada en la captura de /inbox.
- ✅ Pieza 3 CERRADA: "Atendemos Atendemos" ERA BUG DEL MOTOR (no solo doc QA) —
  R_HORARIO antepone el verbo y el dueno escribe su horario como oracion completa.
  Fix en reply-builder (strip del prefijo, las plantillas ponen contexto). Y BUG
  HERMANO cazado en la misma verificacion: recepcionista sin humanName decia
  "SERGIO te confirma" al cliente final de OTRO negocio (fallback del funnel de
  venta) — asRecepcionista ahora cae a "el equipo". Motor 581/581, ambos deployados
  con backup y verificados por /preview vivo (cero duplicado, cero Sergio ajeno).
  Espejo cdb9c224 + a6c01257.
- ✅ Pieza 4 CERRADA (solo propuesta, decision de Sergio pendiente): VISION LLM MEDIDA
  EN VIVO con el modelo del bot (gpt-4.1-mini via LiteLLM del VPS). Una foto real
  (screenshot 1280x800, detail low): 1640 tokens de entrada + 24 de salida =
  US$ 0,0007 por imagen (~Bs 0,008). Un negocio con 20 fotos/dia ≈ Bs 5/mes; cien
  clientes asi ≈ US$ 42/mes total — trivial contra el plan de Bs 390, y capeable por
  plan como los 200 msgs de WhatsApp. PROPUESTA: implementarlo con la misma regla del
  motor (la descripcion de la foto entra como CONTEXTO para derivar mejor al humano
  — "el cliente mando una foto de una muela rota" — JAMAS diagnostica ni cotiza por
  foto; los guardrails mandan). El bot ya CONTESTA a los adjuntos hoy (kind
  attachment, R_ATTACHMENT); esto le agrega entender QUE hay en la foto. Falta SOLO
  el go de Sergio. Nota de la vuelta: red LOCAL intermitente (100% packet loss a
  ratos, VPS sano todo el tiempo) — la medicion tardo 3 intentos.
- ✅ VISION IMPLEMENTADA Y VIVA (2026-08-30, go de Sergio: "pagamos api nomas de
  modelo barato" — local descartado: ollama ya estrangulo el VPS). vision.mjs (calco
  del contrato de audio: fail-open, SSRF-safe, timeout 8s) + describeIfImage en el
  adapter + R_ATTACH_VISTO en recepcionista. DOBLE FILTRO a la descripcion: guardrails
  + cero digitos (una foto puede colar un precio). 589/589. E2E EN PROD (conv 39 msg
  206): el bot contesto "Recibi tu foto (Pantalla de sistema de gestion con menu
  lateral...)" y derivo. La secuencia ademas RE-VERIFICO el desarme (204 resolved →
  bot volvio). TRAMPA DE DIAGNOSTICO PAGADA (no repetir): Message de Chatwoot tiene
  default_scope por created_at ASC — `.order(id: :desc)` NO lo pisa y devuelve los
  PRIMEROS mensajes como si fueran los ultimos; usar SIEMPRE `.reorder`. Media hora
  de "el bot no contesta" que era un espejismo del query.
- Pieza 5 GATEADA: boton "Cobrar con QR" en la conversacion (espera credenciales BCP).
  conversacion (espera credenciales BCP de Sergio).
  app/(dashboard)/inbox/ (page server con gate bandejaProfile + InboxClient):
  lista con no-leidos y estado, detalle con burbujas cliente/asistente/vos,
  responder con Enter (arma el candado — copy honesto "tu asistente se hace a un
  lado"), Marcar resuelta (desarma: "tu asistente atiende de nuevo") y Reabrir.
  Polling 15s lista / 5s detalle. Sin canal => CTA a /settings/chatbot. Nav
  "Conversaciones" (icono forum): fixtures de la guardia 17→18 + snapshots
  actualizados + SUBSET de iconos regenerado (258 usados, -94%). Suite completa
  2161→2222 verde (rebase sobre PR 52 fiscal ajeno; tsc limpio). PENDIENTE
  fase E: deploy runner + MIRAR /inbox en prod con conversacion real.
- ✅ Fase C (candado bot-humano) CERRADA (2026-08-29): el ARMADO ya existia entero
  (takeoverTurn del adapter + markHumanTakeover + silencio:humano_a_cargo, env
  CHATWOOT_BOT_AGENT_ID=3 verificado en vivo). Lo construido: el DESARME — resolver
  la conversacion se la devuelve al bot (un hilo de WhatsApp es eterno; takeover
  para-siempre mataba al bot para ese cliente). conversation_resolved /
  conversation_status_changed=resolved → turno human_takeover_clear → clearHumanTakeover
  (limpia flag + resetea handoff_humano→nuevo) → saveConversation, sin step ni filas
  nuevas. Suite motor 576/576. Deploy scp+restart con backup. Webhook cuenta 2
  suscrito a conversation_status_changed (antes solo message_*). E2E EN PROD:
  conv 38 resuelta → fila chatwoot:38 quedo bot_stage=nuevo, human_took_over=f.
  Flujo bandeja completo: responder ARMA el candado, Resolver lo DESARMA.

### Vision ampliada (Sergio 2026-08-29, "paso a paso primero que funcione")

- BANDEJA/BOT MULTIMEDIA (backlog v5, NO empezar hasta cerrar v4): que la bandeja
  muestre fotos/videos/enlaces de WhatsApp y widget (attachments de Chatwoot), y que
  el BOT los entienda (vision LLM — pieza nueva real, medir costo antes).
- COBRO QR EN EL CHAT: YA CONSTRUIDO en mock (28-ago: /bcp/cobrar + /bcp/callback,
  contrato BCP calcado, verificado MIRANDO). Encenderlo = credenciales del banco +
  mTLS .pfx (tramite de Sergio); el codigo no cambia. Fase 2 natural post-bandeja:
  boton "Cobrar" DENTRO de la conversacion de la bandeja.

**Archivos y cambios**

- `onia-platform` (master → origin): `bd2350c` plantillas + `9585db4` fix ancho.
  Deployado: BUILD_ID `1DwxG_yK6lDGTaXQ88xGZ`, backups `runtime-next.prev-20260828-*`.
- VPS: `/opt/onia/bot/webhook-watchdog.sh` (+bloque firewall, backup
  `webhook-watchdog.sh.bak-20260828-193304`) · regla iptables `ONIA-ALLOW-3000-INTERNO` ·
  `/tmp/onia-bot` resincronizado (44 mjs) · scripts `build-bd2350c/9585db4.sh` +
  `gates-*.sh` en `/opt/onia-platform/`.
- `onia-hermes`: skill `onia-chatbot` corregida (paso b NO falta — cerrado 17/18-ago) ·
  `ONIA_CHATBOT_LINEA_DE_ENTREGA.md` §5.3 actualizado · este handoff.
- Memorias: `chatbot-editor-conocimiento-prod` (circuito completo + plantillas) ·
  `vps-saturado-deploy-bloqueado` (RESUELTO) · `vps-firewall-bloquea-3000` (auto-cura).

**Intentos fallidos (para no repetir)**

- **Verificar el editor sin cerrar el modal "Primeros pasos"**: la primera pasada de
  Playwright capturó todo tapado y el probador ni corrió — el modal de onboarding de la org
  intercepta el click. Cerrarlo (`Cerrar por ahora`) antes de tocar nada.
- **`iptables -C` sin el módulo comment NO matchea una regla que lo tiene**: el primer
  auto-heal del watchdog insertó duplicados (3 en 15 min). El `-C` tiene que repetir la
  regla EXACTA, comment incluido.
- **Confiar en "healthy" de docker para PostgREST**: supabase-rest decía healthy (su
  healthcheck es localhost) mientras ningún contenedor le llegaba. El diagnóstico correcto
  fue el de la memoria: contenedor→timeout, host→conecta ⇒ FORWARD/iptables.
- **`grep -r` amplio en `/etc /root /opt` del VPS**: se cuelga minutos. Ir dirigido
  (crontab, ufw, systemd drop-ins) primero. Quién re-aplica los DROP tras un reboot sigue
  SIN identificarse — por eso el heal vive en el watchdog y no "donde se aplican".

**Qué depende de Sergio**

1. ✅ **Access Verification de Meta: VERIFICADA** (mirada en el panel el 2026-08-28 con la
   sesión de Sergio — "proveedor de tecnología", 0 acciones requeridas). Meta no debe nada.
   Queda ~1 día nuestro (Configuration ID + dominio JS SDK + 3 env vars) + la prueba con un
   +591 real de Sergio.
2. **Alta bancaria BCP** — gatea "pagos en el chat" (QR dinámico como imagen + aprobación
   del dueño; la plomería del motor ya existe). Sin banco no hay código que lo destrabe.
3. **Decisión FAQ genérica por cliente** (`id:"negocio"`): un commit al motor y las FAQs
   pasan a ser edición pura del dueño. Hoy solo existe `siat`.
4. **¿Alerta del watchdog a Telegram?** 4 días caído sin que nadie se entere lo justifica;
   decidir si se cablea al canal del guardián.
5. **Limpieza de data QA** (conversaciones 29/31/32/33, inbox 6, filas sintéticas) —
   coordinar con el carril web que las usó para capturas.

**Próximos pasos**

1. Siembra con datos reales del alta (horario de la org → plantilla) + bench de humo.
2. Pantalla del DUEÑO para su canal: ver su widget/snippet y estado del inbox sin pasar por
   el superadmin (hoy el alta de inbox es solo `/admin/chatbots`).
3. Cablear ERROR del watchdog → Telegram del guardián.
4. Cuando Sergio cierre la Access Verification: encender Embedded Signup (Configuration ID +
   env vars + prueba +591) — ruta y gates ya escritos en `ONIA_CHATBOT_ALTA_WHATSAPP_CLIENTE.md`.
5. Los dos fixes de fondo del motor propuestos el 23-ago (timestamp en listen(),
   `markMessageDelivered` en el turno normal) siguen esperando su sesión.


## BACKLOG v6 — EDITOR CONVERSACIONAL (go de Sergio 2026-08-30, referencia Sendy)

- Decisiones de Sergio del 30-ago: ensayo popup "enseguida lo hago" (Monitor b5e9h7xe3
  vigilando cada 45s, cuelga bot + push al nacer el inbox) · BCP sin credenciales aun ·
  alta sigue cerrada · editor conversacional GO ("que lo configuren y armen como
  quieran, asi armamos los precios").
- ✅ Fase A-motor CERRADA: POST /editor-sugerir en el webhook-server (mismo Bearer del
  preview). sugerirEdicion(): LiteLLM temp 0 + schema embebido + PROHIBIDO inventar
  precios/campos → doc COMPLETO → validateKnowledge todo-o-nada → {ok, knowledge} o
  fallo honesto (instruccion_rechazada trae el motivo del LLM). Vive en el MOTOR a
  proposito: platform y litellm NO comparten red y meter envs nuevos al contenedor
  platform exige recrearlo — cero cirugia eligiendo el motor. 595/595. SMOKE REAL EN
  PROD: "atende tambien los domingos de 9 a 13" → frase "lun-sab, 9:00-18:00; dom,
  9:00-13:00" (cambio exacto, resto identico).
- Fase A-plataforma (siguiente): lib/chatbot/editor-conversacional.ts (fetch al motor
  via BOT_PREVIEW_URL con ruta /editor-sugerir + validacion espejo + diffDeDocs en
  español) + ruta /api/chatbot-knowledge/sugerir (requireAdmin, Zod, registry, NO
  persiste). Luego B (UI panel "Enseñale conversando" con chips) y C (gates + deploy +
  MIRAR con instruccion real publicada). D: gancho pricing (Sergio quiere usar esto
  para armar precios del add-on).
- ✅ Fases A-plataforma, B y C CERRADAS (2026-08-30) — EDITOR CONVERSACIONAL COMPLETO
  Y VIVO EN PROD (BUILD_ID TGfCVs-ptY5aaWL9tvvyt, platform 070458e). Ruta
  /api/chatbot-knowledge/sugerir (requireAdmin, doble candado motor+espejo, diff en
  español con el shape REAL: title/body, demo, rubrosExtra, dias numericos — 8 tests)
  + panel "Enséñale conversando" en /settings/chatbot (chips, tarjeta de cambios,
  Aplicar al formulario SIN publicar; aplicarDoc espeja los initializers). Prompt del
  motor corregido al schema real + regla de slug (el 1er smoke fallo EXACTO como debia:
  validador mato un key con guion). VERIFICADO MIRANDO en prod: "atende tambien los
  domingos hasta mediodia" → tarjeta con el cambio de horario en español → Aplicar
  cargo el form. BONUS: el flujo corrigio la incoherencia del doc QA (frase 9:00 vs
  campo desde=8) y limpio el "(aud 11:52)". Captura enviada a Sergio. Suite 2236.
  Decision Sergio del dia: TODO USABLE PRIMERO, la app movil despues (v7 = push "te
  escribieron" + banner instalar; base PWA YA existe: manifest+SW+push+BottomNav).
  Cadencia loop tareas bajada a 1min a pedido de Sergio (cron 018db731).

## BACKLOG v6.5 — pasos del guion + tutorial (2026-08-30) ✅ CERRADO

- ✅ "Así atiende tu asistente": panel de pasos numerados EN VIVO junto al probador de
  /settings/chatbot (1 Saluda y se presenta con los botones reales · 2 Contesta el
  horario con la frase real · 3 Cuenta lo que ofreces · 4 Todo lo demas se lo pasa a
  {encargado} con la promesa NUNCA-inventa y el candado humano). Commit 917adca.
- ✅ Tutorial cubre el asistente: paso "Arma tu asistente" en la Guia de inicio (señal
  real = fila en chatbot_knowledge, patron de señales del tour) + entrada en Ayuda +
  bandeja "Conversaciones" en los menus de los 4 rubros. Commit 5ae52a7 (era 94c51f0
  pre-rebase). Snapshots de pack/nav actualizados (18→19 items segun familia).
- Deploy: BUILD_ID ybZijOFHCl9bJ7sakvV7N (la sesion previa murio a mitad del deploy y
  otra instancia lo completo; VERIFICADO MIRANDO hoy: panel de pasos presente=true,
  paso asistente en guia=true, capturas /tmp/v65-*.png, enviada a Sergio).
- RECUPERACION de la muerte de sesion: monitor popup re-armado (by3aon06m), loop
  perpetuo re-armado (678de3f1 cada 1min: analiza-y-desarrolla, nunca sin-novedad),
  loop orden re-armado (63ae20ad cada 15min, ahora re-aplica LOS SEIS configs de
  branding). Skill onia-deploy con leccion ajena preservada (a08a2d0).

## Sesion 2026-08-30 (tarde) — objetivo "todo usable" + loop arreglado de raiz

- Decisiones Sergio (AskUserQuestion): insistencia ENCENDIDA por defecto · push movil
  ADELANTADO · pricing = armar propuesta comparativa (Sendy/Lety/Dapta + valor
  web-conectada para Bolivia) y RE-PREGUNTAR con numeros.
- ✅ DOCS AL DIA (0af5452f): linea de entrega + alta WhatsApp (decian "no existe la
  Configuracion"/"env vacias" — falso desde 28-ago), skill del carril (5 piezas nuevas
  mapeadas), catalogo de venta (chatbot "vivo", ya no "gateado por Meta") + memoria.
- ✅ LOOP ARREGLADO: crons zombis duplicados (revivian tras morir la sesion) purgados.
  Mecanismo real = turno continuo de trabajo + cron orden 15min (63ae20ad) + Monitor
  popup by3aon06m. Los one-shot de ScheduleWakeup tampoco disparaban confiable.
- ✅ v6.6 INSISTENCIA fase A+B COMPLETA Y VIVA:
  - Doc: campo seguimiento {activo bool, horas 1-48} — kind bool nuevo en AMBOS
    validadores (motor 603/603 + espejo platform, commit 5df8f53 sobre PR 56 ajeno).
    Ausente = ON con 2h (default vive en el lector; docs viejos validan).
  - Barrido insistencia-run.mjs + .sh (deriva del followup: CAS reserveFollowUp,
    deliver, dedup) + cron VPS */30 12-23 UTC. Candado org: solo inboxes que resuelven
    a org (source db). inboxId ahora PERSISTE en raw de bot_conversations
    (fillFromSeed — bug cazado en E2E round 1; round 2 cazo sin_org por URL default;
    round 3 cazo dryRun del config que no lee env — TODOS arreglados).
  - E2E REAL EN PROD: conv QA 43 "hola" → bot M0R → barrido --now +3h →
    "¿Seguis por ahi? ... Sergio te la contesta" SENT + step=1 (una sola vez).
  - Falta fase C (proxima): perilla UI en /settings/chatbot + seccion Seguimiento en
    el diff del editor conversacional. El default ON ya trabaja sin UI.
- Proximo orden: v6.6-C → push "te escribieron" → propuesta pricing → v6.7 → v6.8.
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

- **Segunda mitad de la siembra (§5.3 de la línea de entrega)**: la plantilla usa defaults
  del rubro; falta que beba del alta real de la org (horario declarado en onboarding —
  cuidado: DOS convenciones de dayOfWeek conviven, ver skill `onia-backend`) + bench de humo.
- **El probador con borrador corre el funnel de VENTA, no el modo recepcionista** cuando el
  doc viene explícito — pendiente documentado de antes (decidir si simula recepcionista).
- **Los 3 pendientes heredados del handoff anterior siguen**: latencia LiteLLM (piso 11-13 s
  fuera de guion), bug `delivery_status` optimista (propuesta exacta en el handoff del
  23-ago, en git), limpieza de conversaciones QA (29/31/32/33 + inbox 6 huérfano).
- **Nadie se enteró de 4 días de caída** → el watchdog loguea a un archivo que nadie mira.
  Falta cablear su ERROR a Telegram (el guardián ya tiene canal). Anotado, no hecho.

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

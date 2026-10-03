---
name: onia-chatbot
description: Invocar para CUALQUIER trabajo sobre el chatbot de Onia — motor conversacional, guion, capa de conocimiento, persistencia, barridos del embudo, Chatwoot, WhatsApp Cloud API, el modelo LLM, la voz por WhatsApp, o el panel del chatbot en la plataforma. Nombra el stack exacto de skills instaladas, los docs fuente y los gates. Es el índice del carril.
---

# ONIA Chatbot — stack del carril

El carril del chatbot toca cuatro mundos a la vez (motor Node, base Postgres, canal Meta,
panel Next.js) y por eso es el que más fácil se hace a ojo. Este archivo dice **qué skill
cargar para qué**, con las 196 skills que ya están instaladas. No reemplaza a `onia-router`:
lo extiende para este carril.

## Dónde vive cada cosa (verificado 2026-08-16)

| Pieza | Ruta |
|---|---|
| **Motor conversacional** (el único que existe) | `hermes-content/deploy/vps-ops/bot/` — 18.440 líneas, 503 tests |
| Hechos editables sin desplegar | `/opt/onia/bot/knowledge.json` en el VPS, **fuera de git** |
| Config y secretos del bot | `/opt/onia/bot/webhook.env`, chmod 600, **nunca en git ni en el chat** |
| Persistencia | Supabase self-hosted, schema `onia_center` (`bot_conversations`, `bot_messages`) |
| Canal | Chatwoot self-hosted en el VPS → WhatsApp Cloud API |
| Relay del producto | repo `onia-platform`, `app/api/webhooks/chatwoot` — **es un relay, NO un segundo motor** |
| **Bandeja nativa** (el dueño lee/contesta) | `onia-platform`: `app/(dashboard)/inbox/` + `lib/chatbot/bandeja*.ts` + `/api/bandeja*` — tenencia dura por `clinic_settings.chatwootInboxId` |
| **Editor conversacional** (edita el bot en castellano) | motor: `editor-sugerir.mjs` (POST `/editor-sugerir`, LiteLLM + validateKnowledge) · platform: `/api/chatbot-knowledge/sugerir` + diff en español (`lib/chatbot/editor-conversacional.ts`) |
| **Guion en pasos** ("Así atiende tu asistente") | `onia-platform`: componente junto al probador en `/settings/chatbot` |
| **Visión** (el bot VE fotos) | motor: `vision.mjs` (descarga SSRF-safe + LiteLLM detail low) → `R_ATTACH_VISTO`; guardrails filtran la descripción |
| **Candado bot-humano** (takeover + desarme) | motor: `takeoverTurn` (arma al contestar un humano) + `conversation_status_changed=resolved` → `clearHumanTakeover` (resolver = devolver al bot) |

**Fuentes de verdad — leer ANTES de construir, no después:**
`ONIA_ESTADO_CHATBOT_Y_VOZ_20260816.md` (qué está encendido hoy) ·
`ONIA_BOT_MANUAL_OPERACION_20260807.md` (operación) ·
`ONIA_BOT_CAPA_CONOCIMIENTO_20260806.md` (frontera lógica/hecho) ·
`ONIA_MODELO_MULTICLIENTE_CHATBOT_20260802.md` (N clientes) ·
`ONIA_VOZ_WHATSAPP_ARQUITECTURA_20260802.md` (voz, manda sobre cualquier research posterior) ·
`research/ONIA_AGENTES_DE_LLAMADAS_20260815.md` (costos y regulación).

## Qué cargar según la tarea

### Tocar el motor conversacional (`bot-engine`, `intents`, `reply-builder`)
`superpowers:test-driven-development` — el motor tiene 503 tests y son el contrato; test primero, siempre.
`superpowers:systematic-debugging` o `investigate` — para un bug: causa raíz antes de tocar. Nunca adivinar.
`superpowers:verification-before-completion` — antes de decir "listo".

### Persistencia, migraciones, base
`postgres-patterns` · `database-migrations` · `supabase` · `supabase-postgres-best-practices`
Trampa ya pagada: `leads.business_type` es NOT NULL sin default. **Mirar las restricciones
reales de la tabla antes de escribir el insert**, no el modelo mental de la tabla.

### Seguridad (obligatorio si toca webhook, token, o dato de paciente)
`security-review` + subagente `security-reviewer`.
Disparadores duros: firma HMAC de Chatwoot · `META_APP_SECRET` · minimización de datos
(el rubro dental maneja datos de salud) · cualquier ruta nueva que reciba de afuera.

### El modelo y el costo de la IA
`claude-api` — si se cambia de proveedor o se arma un agente.
`cost-aware-llm-pipeline` — ruteo por costo; el gateway es LiteLLM con tope de gasto.
`prompt-optimizer` — el system prompt de la rama off-guion es lo único que separa al bot de
prometer precios. `benchmark-models` — antes de cambiar de modelo, medir, no opinar.
`agentic-engineering` — si se agrega una herramienta que el bot pueda ejecutar.

### Panel del chatbot en la plataforma (la pantalla que edita el conocimiento)

> ⚠️ **El repo `onia-platform` tiene SUS PROPIAS skills y mandan sobre las genéricas.**
> Viven en `onia-platform/.claude/skills/` y hay que cargarlas ANTES de tocar ese repo:
> `onia-frontend` (dirección visual, vocabulario por rubro, nombres de plan) ·
> `onia-backend` (API routes, server actions, multi-tenant, planes, Zod) ·
> `onia-db` (schema, migraciones quirúrgicas, RLS) ·
> `onia-seguridad` (auth, claves, env vars, webhooks) ·
> `onia-deploy` (build en el VPS, gates del bundle) ·
> `onia-verificacion` (qué cuenta como prueba antes de declarar terminado).

Recién DESPUÉS, y solo si hace falta criterio de diseño que esas no cubran:
`impeccable` (register **product**) · `ui-ux-pro-max` · `shadcn-ui` · `design-review` ·
`frontend-patterns` · `react-components` · `ui-styling` · `nextjs-turbopack`.
Regla del repo: nada que parezca template por defecto — ver `web-factory-disenos-genericos`.

**Antes de crear una pantalla nueva, mirar si ya tiene casa.** Verificado 2026-08-16:
`app/(dashboard)/communications/page.tsx` (230 líneas) es **diagnóstico de envíos**, no un
editor; `app/(dashboard)/admin/organizations/[id]/WhatsAppOrgConfig.tsx` (263 líneas) ya
configura WhatsApp por organización. ⚠️ **Corregido 2026-08-24.** Acá decía que el editor de conocimiento NO existía.
**Está EN PRODUCCIÓN**: pantalla, tabla y probador vivos. Una sesión que lea la versión
vieja lo construye por segunda vez.
⚠️ **Corregido 2026-08-28.** Acá decía "lo único que falta es que el bot de WhatsApp lea la
fila" — **falso desde el 17/18-ago**: el motor lee la fila por organización (fuente "db") y
resuelve la org por INBOX (`clinic_settings.chatwootInboxId`), con modo recepcionista vivo y
verificado por widget + curl sintético. Lo que falta es MENOS: verificar el mismo circuito
con un canal WhatsApp real de un cliente (mismo adapter). El circuito completo por cliente
(editor → publicar → su bot contesta en su canal) EXISTE; desde el 28-ago el editor además
abre PRE-ARMADO con la plantilla del rubro (`lib/chatbot/plantillas.ts`).

### API que consuma la plataforma
`api-design` · `backend-patterns` — y `onia-backend` del propio repo, que manda.

### Infra, despliegue, crons
`deployment-patterns` · `docker-patterns`.
El webhook corre **dentro del contenedor `onia-center`** por `docker exec`, con un watchdog
cada 2 min. No es systemd. Los barridos son cron del VPS, no n8n.

### Automatización con n8n (solo si el trabajo es de n8n)
`n8n-mcp-tools-expert` (cargar SIEMPRE antes de tocar n8n) · `n8n-workflow-patterns` ·
`n8n-node-configuration` · `n8n-validation-expert` · `n8n-code-javascript`.
⚠️ **Corregido 2026-08-24.** Acá decía "`$env` NO existe" y es FALSO desde la
verificación en vivo del 2026-08-22: `N8N_BLOCK_ENV_ACCESS_IN_NODE=false` y las variables
están cargadas en el contenedor — **9 workflows usan `$env`, 7 activos y funcionando**.
Ese consejo viejo produjo 7 workflows con claves de API escritas en el JSON, y una (Resend)
terminó publicada en GitHub al commitear un export.
**Orden de preferencia para un secreto: credencial de n8n > `$env` > nada.**
🔴 NUNCA hardcodear un secreto en un nodo.

### Investigar antes de decidir
`deep-research` (con fuentes citadas) · `documentation-lookup` (Context7, para API de Meta) ·
`exa-search`. Para temas fiscales bolivianos: skill `onia-contabilidad-bolivia`, nunca a ojo.

### Escribir el guion o los hechos
`writing-guidelines` · `copywriting`. El texto del guion **no pasa por el guardrail** — lo
escribimos nosotros y es responsabilidad nuestra que no prometa nada.

### Planificar / cerrar
`make-plan` o `superpowers:writing-plans` · `superpowers:brainstorming` (antes de construir
algo nuevo) · `qa` · `verification-loop` · `health`.

## WhatsApp de Onia: plantillas, token y Meta (medido 1-oct-2026)

- **Leer la WABA y el token del inbox 5 sin imprimirlo:** en el contenedor de Postgres de Chatwoot
  (`docker ps | grep chatwoot-db`, base `onia-chatbot`), `channel_whatsapp.provider_config` tiene
  `business_account_id` = `4429061034078857`, `phone_number_id` = `1283320641524523` y `api_key`. Es un token de
  system user de la app «Onia Bot» con scopes `whatsapp_business_management` + `messaging`. Usarlo DENTRO de un
  script en el VPS (`ssh onia-vps 'bash -s' < script.sh`). Nunca se imprime.
- **Estado de las plantillas:** correr el cron de la plataforma
  `/api/cron/activacion-whatsapp` (Bearer `CRON_SECRET`, desde dentro del contenedor). En modo `plantillas` crea y
  lee las plantillas, y devuelve el estado de cada una.
- 🔴 **La plantilla AUTHENTICATION (`onia_codigo_verificacion`) la rechaza Meta POR CUENTA:** code 10 / subcode
  2388185. No es el texto: falla igual con payload mínimo y por `upsert_message_templates`. Ya está descartado: negocio
  verificado, WABA `APPROVED`, salud `AVAILABLE`. Falta mirar el motivo en WhatsApp Manager y la configuración de
  pagos. Leer la configuración de pagos por API exige ser BSP. **No mandar el código en una UTILITY**: Meta lo prohíbe
  y arriesga el número de ventas.
- **Plan B, verificación inversa** (construido el 1-oct, APAGADO): el dueño manda «Mi código de Onia es N» por
  `wa.me` y el bot lo valida contra el teléfono que da Meta. Ramas sin mergear: `v1/verificacion-inversa`
  (plataforma: `lib/whatsapp-onia/inversa.ts`, rutas `/estado` y `/desde-whatsapp`) y `wip/bot-verificacion-inversa`
  (`bot/verificacion-inversa.mjs`, corte en `webhook-server.mjs` antes del turno: no crea lead ni pasa por el motor).
  **Se enciende en este orden:**
  1. Mergear y desplegar las dos ramas.
  2. Cargar el mismo secreto `ONIA_VERIFICACION_INVERSA_SECRETO` (32 o más caracteres) en los dos env.
  3. En el bot: `ONIA_VERIFICACION_INVERSA=encendida`, `…_INBOX_ID=5`, y reiniciarlo.
  4. AL FINAL, en la plataforma: `ONIA_VERIFICACION_WHATSAPP=inversa`, y recrear el contenedor.

  Se apaga al revés. Sin esas variables, las rutas dan 404 y el bot no cambia.

## Agenda y voz del bot de ventas: apagadas por config (2-oct-2026)

La auditoría de producción del 2-oct (§2 acción 3) midió que el bot decía «Listo, agendado» y en la
línea siguiente «estoy confirmando ese horario con Sergio». El camino exacto, leído en el código:
M2 del guion (`config.mjs`) empieza con «Listo, agendado» y lo redacta el motor ANTES de saber si la
reserva sale → `run-turn.mjs` 6.5 llama a `createBooking` contra `CALCOM_BASE_URL=http://calcom:3000`
(el contenedor no existe: `reason: "error"`/`destino_caido`) → le PEGABA `cierreDeReservaFallida` al
final. Y los horarios que ofrecía no salían de un calendario: los escribe un cron
(`slots-rodantes.mjs`) desde las ventanas de atención.

- **`ONIA_BOT_AGENDA`** (`agendaDelEntorno`, `calcom-booking.mjs`). VACÍO = **persona** (default):
  el bot NO ofrece horarios ni confirma; saluda con `M0_PERSONA` («el horario lo coordinás directo con
  Sergio: te escribe por acá», o el link de la agenda real si el conocimiento trae `orgSlug`) y a Sergio
  Urcullo le llega el aviso `coordinar_demo`. Una elección sobre una oferta VIEJA (conversación que nació
  con horarios) se deriva con `M_HORARIO_SIN_AGENDA`, nunca se confirma. `calcom` SOLO enciende con
  `CALCOM_BASE_URL` + `CALCOM_BOT_EVENT_TYPE_ID`: tener Cal.com declarado no alcanza (era justo el estado
  que mentía). Lo leen `run-turn.buildConfig`, `followup-run.buildConfig` y `simulate.mjs` (que lo lee de
  la MISMA fuente que los horarios: entorno → webhook.env → VPS).
- **Con agenda propia y la reserva que NO sale**: `reservaQueNoSalio` REEMPLAZA M2 por `M2_SIN_RESERVA`
  (o `M2_HORARIO_TOMADO` con 409), pasa la conversación a `handoff_humano` (si quedara en
  `demo_agendada`, M2b diría «Nos vemos …» y M9 recordaría una demo inexistente) y SIEMPRE sale el aviso
  `reserva_sin_confirmar`. Los tres caminos (vivo, seco de `runTurn`, `simulate.mjs`) usan la misma función.
  (3-oct) `M2_SIN_RESERVA`/`M2_HORARIO_TOMADO` ya NO piden los datos: `handoff_humano` no los lee y el
  prospecto recibía M5_ACUSE con la calificación tirada. Y `reservaQueNoSalio` devuelve `efectos` que el
  ejecutor aplica: el paso 6 de `runTurn` ya había escrito «Reunion» en el lead y el audit
  `→ demo_agendada` ANTES de reservar; la corrección pone el lead en «calificado», la tarjeta de la cola y
  el audit `→ handoff_humano`. ⚠️ Las claves de cola y audit son `<conversación>-<seq>` con on_conflict
  ignore: un segundo efecto en el MISMO turno con el mismo seq se pierde en silencio (por eso el seq
  `N-reserva`). Se mira la FILA con `postgrestDeLeads` de persistence.test (applySideEffects real).
- **El texto seguro del LLM** (`SAFE_REPLY`) terminaba en «¿Te reservo {{slot_a}} o {{slot_b}}?»: sin
  horarios salía «HORARIO A (pendiente de definir)». Ahora `textoSeguro` (bot-engine) pone la pregunta
  pendiente real. Lo encontró MIRAR el simulador, no un test: correr `node simulate.mjs` con el entorno
  de producción antes de dar por hecho un cambio de guion.
- **`ONIA_AUDIO_ENABLED`**: solo `true` la enciende (antes, vacío = encendida contra `speaches:8000`, que no
  existe). Apagada, el motor contesta al instante `M_AUDIO_FAIL` («no lo puedo escuchar yo, ¿me lo
  escribís?») y al segundo audio deriva a la persona. `destinos-vivos.mjs` lee el interruptor con
  `getTranscribeConfig` del producto (no una copia de la regla).
- ⚠️ **El código no cambia el entorno vivo.** El proceso vivo tenía `ONIA_AUDIO_ENABLED=true` (medido el
  19-sep en `/proc`, ver `destinos-vivos.mjs`), y no se sabe si viene ESCRITO en `/opt/onia/bot/webhook.env`
  o del default viejo del lanzador (`:-true`, ahora `:-false`). Después del deploy, mirar con
  `grep ^ONIA_AUDIO_ENABLED /opt/onia/bot/webhook.env`: si dice `true`, borrar la línea (o `false`) y
  reiniciar el webhook; y confirmar con `npm run destinos:vivos`. La agenda se apaga sola al desplegar
  (`ONIA_BOT_AGENDA` no existe allá). Las líneas `CALCOM_*` pueden quedar: sin `calcom` no se usan.
- **Lo que el bot dice en modo persona tiene que poder cumplirse (auditoría del 3-oct):**
  - **Los tests de la pauta medían la rama equivocada.** `buildConfig({ slots: … })` (simulate) con
    `--slots` a mano devuelve `agenda: null` = AGENDA PROPIA: certificaban M0 con «**A)**» mientras
    producción saluda con M0_PERSONA. Un test que mide lo que ve un lead arma la config con
    `configComoProduccion({ horarios, now })` (`config-como-produccion.mjs`: webhook.env temporal con
    los horarios del cron y CALCOM_* sin `ONIA_BOT_AGENDA`) y ancla `config.agenda.modo === "persona"`.
    La variante con `--slots` se nombra «con agenda propia». Mutar `M0b_SIN_HORARIOS → M0b` pone rojos
    solo los de producción: así se prueba que miden algo.
  - **El texto editable de una campaña también promete.** Las campañas 6 y 7 (CTA de /contacto) decían
    «te confirmo el horario acá mismo». Gate: `agendado-solo-si-se-agendo.test.mjs` recorre
    `campanas[].respuesta` con `/confirmo el horario|te reservo|\bagend(o|amos)\b/`.
  - **El saludo no sale dos veces.** Las campañas arrancan con «¡Hola! Soy el asistente automático de
    Onia.» y en venta llegan SIEMPRE detrás de la bienvenida: `sinSegundoSaludo` (bot-engine) corta esa
    frase de lo que sigue a la bienvenida, con el nombre de `identity.botName`. D2 queda en la primera
    línea de la bienvenida.
  - **La pregunta de M0_PERSONA es el dato que FALTA** (`{{dato_faltante}}` = primer `missLabel` de
    `missingFields`), no siempre el rubro; con los tres dichos no pregunta nada.
  - **La oferta VIEJA avisa una vez.** Una conversación nacida antes del deploy del 2-oct está en
    `esperando_horario` con `slotsOffered` reales y nunca recibió `coordinar_demo`. `step` está envuelto
    por `conAvisoDeLaOfertaVieja`: el primer turno que sigue esperando horario emite review_queue +
    `coordinar_demo` y vacía `slotsOffered` (eso evita repetirlo). Si el turno ya avisa (elegir «A»
    deriva con su aviso) no suma nada. `step` exportado = envoltorio; el cuerpo es `pasoDelMotor`.
- **Para encender la agenda propia algún día** (Cal.com que exista, o la agenda de la plataforma):
  `ONIA_BOT_AGENDA=calcom` en webhook.env (el lanzador ya la pasa) **y** cablearla en `followup-run.sh`
  (hoy no pasa ni `ONIA_BOT_AGENDA` ni `CALCOM_*`: M3 queda bloqueado). Verificar con el simulador y una
  reserva real antes de prometer nada.

## El bot de ventas habla de usted (3-oct-2026)

Sergio Urcullo, por la madre: *«no se usa vos, es muy informal, usted»*. Gate: `bot/de-usted.test.mjs` (recorre
guion, `missLabel`, productos, `SAFE_REPLY` y los dos knowledge; falla con el texto exacto).

- **Dónde vive el texto que lee el prospecto:** `config.mjs` (`SCRIPT`: M*, COORDINA_*, PENDING_*; los `missLabel`
  de `qualification.fields` y de cada rama; `PRODUCTOS[].nombre`), `reply-builder.mjs` (las etiquetas «que se
  dedica a…», «que tiene N sillones»), `guardrails.mjs` (`SAFE_REPLY_BASE`), `run-turn.mjs` (el prompt del LLM pide
  «de usted» en la primera línea) y `knowledge.onia.json` (`campanas[].respuesta`, `faq[].body`).
  `knowledge.example.json` es espejo de los defaults: si no se cambia junto, falla el test de identidad.
- **No se tocan, cada uno por su motivo:** `M3_PLANTILLA` y `M9_PLANTILLA` (copia literal de las plantillas
  aprobadas en Meta: cambian solo con una plantilla nueva aprobada); el recepcionista `R_*`, `M0R` y `M6R` (bot del
  cliente, decisión pendiente de Sergio Urcullo); los avisos internos a Sergio (aviso-telegram, resúmenes,
  calcom-booking); fixtures con textos históricos reales (puerta-del-alta, prueba-vs-plan-vivo, precios-vivos);
  lo que escribe el prospecto (`triggers`, `optOut`, `frase`, intents).
- 🔴 **Trampa: los detectores de los tests leían instrucciones en voseo.** `RE_INSTRUCCION`
  (palabra-que-el-bot-promete) y el de urgencia-en-el-handoff buscaban «decí "X"», «escribí "X"». Pasado el guion a
  usted («escriba "X"», «dígame "X"»), los gates se quedaban SIN CASOS y pasaban verdes en silencio. Se extendieron
  a las formas de usted. Lo mismo con las reglas del guardrail: `estoy revisando (tu|su)`, `(te|le) recomiendo`.
- **Trampa del detector de voseo:** `\b` de JS es ASCII, así que parte «contestárselo» en «contestá» + «rselo». Usar
  `(?<!\p{L})…(?!\p{L})` con flag `u`. Y no listar «escribí»/«elegí»: también son primera persona («Le escribí ayer»).
- **Al cambiar un texto del bot, los tests que lo citan se actualizan conservando la intención:** las aserciones
  positivas pasan a la forma nueva y las negativas SUMAN la forma de usted (no la reemplazan). Los fixtures de
  `bench.test.mjs` que imitan la salida real tienen que copiar el `missLabel` nuevo; los que traen una config
  inventada, no. Medido: 23 tests rotos por el barrido, todos de expectativa, ninguno de lógica.

## Reglas duras del carril

1. **Construido ≠ terminado.** Vale cuando está encendido en producción y verificado ahí.
   Este carril ya pagó esa lección dos veces: la rama LLM estuvo apagada semanas por una
   variable ausente, y cuatro barridos existían sin cron que los llamara.
2. **El bot no cotiza.** Seis reglas deterministas (`guardrails.mjs`) sobre TODO texto libre
   del LLM; si una matchea se descarta la respuesta entera. Al agregar una regla, agregar su test.
3. **La capa editable solo se mueve en la dirección segura**: suma disparadores y palabras,
   elige el texto de una respuesta que ya existe. Nunca crea un mensaje nuevo ni escribe una cifra.
4. **Ventana de 24 h de Meta.** Se cuenta desde el último mensaje **entrante**. Fuera de ella
   solo salen plantillas aprobadas. Un mensaje libre fuera de ventana falla con `131047`.
5. **Nada de gasto sin permiso explícito** (Meta, ElevenLabs, Higgsfield). Por defecto, gratis.
6. **Un solo motor.** Antes de escribir lógica conversacional en la plataforma, confirmar que
   no duplica lo que ya hace `bot/`. El producto tiene un relay; que siga siendo un relay.
7. **El toque de un botón del recordatorio de cita lo contesta la PLATAFORMA, no el bot** (1-oct).
   «Confirmar» / «Cancelar» / «Reprogramar» exactos en el inbox de una org CLIENTE → `skip` con
   `reason: "boton_del_recordatorio"` en `runChatwootTurn`, NUNCA en el parser: el reenvío
   `usoPlataforma` es por donde la plataforma se entera del toque. En inbox de Onia, huérfano,
   conflicto, sin teléfono o con el producto caído, el bot contesta como siempre. Gemelo:
   `onia-platform/lib/whatsapp/respuesta-al-recordatorio.ts` (`accionDelBoton`): cambiar los textos
   o la normalización de un lado sin el otro es doble respuesta o silencio.
   La RESPUESTA de la plataforma sale con su token (usuario 2 de Chatwoot; el bot es el 3) y lleva
   `content_attributes.onia_automatico`: `takeoverTurn` no la toma como humano. Sin la marca, el bot
   quedaba mudo con ese paciente. Gemelo: `MARCA_ENVIO_AUTOMATICO` en `onia-platform/lib/chatwoot.ts`.

## Gates antes de mergear

```bash
cd hermes-content/deploy/vps-ops/bot && node --test   # el mismo gate que corre deploy-bot.sh (incluye evals/)
```
El número de tests sale de la corrida, no de este archivo (2-oct-2026: 1587/1587 con `node --test`).

**Trampas de la suite (2-oct-2026, 11 rojos que trabaron el deploy sin que nadie tocara el bot):**
- **Horarios fijos en un test = test que vence solo.** `buildConfig` (de `simulate.mjs`) juzgaba los
  horarios con el reloj de la MÁQUINA; cinco archivos de la pauta escribieron el 30-sep horarios del 2 y
  3-oct y el 2-oct cayeron dentro de las 24 h de anticipación (rama `M0_SIN_HORARIOS`). Un test con
  `T0` fijo pasa `now: T0` en los deps de `buildConfig`; nunca horarios absolutos con el reloj real.
- **No es solo `buildConfig`: es toda función con `= Date.now()` por defecto** (3-oct-2026, la suite se
  puso roja SOLA otra vez, 1604/1607). `entrega-viva.test.mjs` usa `T0 = 2026-09-19T12:00Z` y llamaba a
  `juzgarEntregas` sin `ahoraMs`; a los 14 días exactos (`DIAS_PARA_DESUSO`) la regla de «desuso»
  absolvió el canal y tres «rojo» dieron «ok». El arreglo del 2-oct barrió una función y anotó la trampa;
  leer a mano no alcanzó. Ahora lo mira `test-con-fecha-fija-pasa-el-reloj.test.mjs`: en un archivo con
  `const T0` literal, cada llamada a `juzgarEntregas`, `buildConfig` (de simulate), `parseSlotsSpec` o
  `slotsElegibles` lleva el reloj a la vista (en la llamada o en la constante que recibe). Para listar las
  funciones con reloj de la máquina: `grep -n "= Date.now()" *.mjs | grep -v test`. Para probar que un
  archivo no vence: `node --import <archivo que fija Date.now en 2027> --test <archivo>`.
- **Un test que corre `simulate.mjs` en un proceso hijo NO puede depender del webhook.env vivo** (3-oct).
  `simulate.test` borraba `ONIA_BOT_AGENDA` del entorno del hijo; para saber la agenda el simulador iba a
  `/opt/onia/bot/webhook.env` y, fuera del VPS, lo pedía por ssh DOS veces (30 s). En el VPS, que es donde
  corre el gate de `deploy-bot.sh`, leía el archivo REAL: encender la agenda allá ponía rojo el test y
  trababa el deploy. Ahora el hijo recibe `ONIA_SIM_WEBHOOK_ENV=<temporal con lo que produccion tiene>` y
  un `ssh` testigo en el PATH que registra si alguien sale a la red. Y si el entorno ya dice
  `ONIA_BOT_AGENDA` distinto de `calcom`, `cargarSlotsPublicados` no lee ni CALCOM_* ni el archivo.
  Para MIRAR la rama de producción sin el VPS:
  `ONIA_SIM_WEBHOOK_ENV=/tmp/webhook.env node simulate.mjs` (con `ONIA_BOT_SLOTS` y `CALCOM_*`, sin
  `ONIA_BOT_AGENDA`).
- **El extractor de precargados lee el doc de la pauta** (`precargados-de-la-pauta.mjs`). Una mención
  abreviada entre backticks (`` `Hola, vi el anuncio de Onia (D1)…` ``) contaba como otro precargado y
  duplicaba D1. Ahora se ignoran las que terminan en «…» o «...»; un precargado de verdad nunca termina así.
Más: `security-review` si tocó webhook/token/dato personal · subagente `code-reviewer` ·
verificación EN PRODUCCIÓN de lo que se encendió (no basta el test) · `main` siempre compila.

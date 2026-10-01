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

## Gates antes de mergear

```bash
cd hermes-content/deploy/vps-ops/bot && node --test *.test.mjs   # 503/503
```
Más: `security-review` si tocó webhook/token/dato personal · subagente `code-reviewer` ·
verificación EN PRODUCCIÓN de lo que se encendió (no basta el test) · `main` siempre compila.

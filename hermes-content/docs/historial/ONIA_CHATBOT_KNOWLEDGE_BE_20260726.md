# ONIA — Knowledge base: chatbot Bolivian Electric → producto chatbot de la plataforma

Fecha: 2026-07-26. Bibliotecario técnico: jalado del repo del cliente al cerebro.
Fuente primaria: repo `C:\dev\clientes\Bolivian Electric` (git, remoto en GitHub).
**El estado más avanzado del chatbot NO está en `main`**: vive en la rama
`claude/bolivian-electric-chatbot-1e39da` (worktree
`C:\dev\clientes\Bolivian Electric\.claude\worktrees\bolivian-electric-chatbot-1e39da`,
~30 commits adelante de main, pusheada a origin). Todo path de abajo refiere a esa rama
salvo que se diga lo contrario.

Relación con docs ancla: este es el know-how del **add-on `addon.chatbot`** definido en
`ONIA_C0_ESQUELETO_MAESTRO_20260723.md` §1.4 y §3.3, dentro de la visión una-app
(`ONIA_VISION_ROADMAP_20260723.md`, `ONIA_PLATAFORMA_UNICA_BRIEF_DECISION_20260723.md`).

---

## (a) Qué es el chatbot BE hoy — arquitectura real encontrada

### Canal y topología

```text
WhatsApp Business (+591 71353296, WABA 398983206624133, propiedad del cliente)
  → Chatwoot Cloud vía Embedded Signup (Chatwoot actúa de BSP ante Meta; NO hay app Meta propia)
  → webhook Chatwoot → POST /api/chatwoot/webhook (Next.js en VPS dedicado del cliente 187.77.251.218)
  → pipeline processChatwootWhatsAppMessage (apps/web/lib/chatwoot-webhook.ts:882)
  → acciones sobre la MISMA conversación Chatwoot: nota privada de triage + labels + asignación
    a vendedor + (gated) respuesta pública al cliente
```

- Camino alternativo Meta directo (`/api/whatsapp/webhook`, `apps/web/lib/whatsapp-chatbot.ts`)
  = fallback/laboratorio, no producción. Decisión en
  `docs/operations/whatsapp-chatwoot-coexistence-decision.md`.
- n8n **dedicado del cliente** (regla managed bridge: nunca el n8n compartido de ONIA):
  `infra/n8n/workflows/be-chatwoot-whatsapp-intake.sdk.js` (intake espejo),
  `be-sla-reassign.json`, `be-reminders.json`. Modelo puente:
  `hermes-content/docs/BOLIVIAN_ELECTRIC_ONIA_MANAGED_BRIDGE_20260629.md`.
- Deploy: Docker standalone en el VPS del cliente; prod puerto 3001, canal de prueba 3002
  (`infra/vps/compose.yml`, `docs/product/go-live-chatbot.md`).

### LLM y grados de inteligencia

- **OpenAI `gpt-4o-mini`** (chat) + **`gpt-4o-mini-transcribe`** (notas de voz), wrapper
  fail-safe en `apps/web/lib/openai-client.ts`: sin API key todo degrada a reglas y textos
  enlatados — el bot NUNCA depende del LLM para funcionar.
- El LLM hace solo dos cosas: (1) conversar/guiar bajo prompt con guardrails duros
  (`buildAssistantSystemPrompt`, puro y testeable) y (2) clasificar temperatura del lead
  (hot/warm/cold, JSON) con fallback a reglas (`lead-scoring.ts`).
- Los HECHOS nunca salen del LLM: intent, ciudad, matching de producto, disponibilidad,
  slots capturados y ruteo son determinísticos y unit-testeados.

### Pipeline por mensaje (orden real, `chatwoot-webhook.ts:882-1267`)

1. Nota de voz sin texto → transcribir (OpenAI, es).
2. Intent determinístico: `support | stock_or_price | quote_request | product_question | unknown`.
3. `detectCity` + `routeLead`: cliente conocido = sticky a su vendedor de siempre; prospecto
   nuevo = **random ponderado por ciudad** (vendedor estrella peso 1 = menos leads; bajo
   volumen peso 5 = más, para nivelar). Roster real de 23 vendedores derivado de
   `seller-directory.ts` (piloto: solo Saúl activo).
4. Reconocimiento del cliente por teléfono contra directorio del ERP (`be-customers.ts`).
5. Lead scoring LLM→reglas (rubros VIP: montaje, tableristas, petroleros, fábricas, ingenios).
6. **Memoria = historial de la conversación Chatwoot** (`getConversationMessages`), no estado propio.
7. **Pausa por humano**: si un agente humano ya respondió (`humanAgentHasReplied` vs
   `CHATWOOT_BOT_AGENT_ID`), el bot no responde ni reasigna; sí deja nota/labels/analytics.
8. FAQ aprobada (`faq.ts`) → matching de producto con modismos (`product-matching.ts`) →
   captura progresiva de slots (ciudad, producto, cantidad, empresa, NIT, correo) sobre TODO
   el historial (`lead-capture.ts`) — nunca repregunta, pide UN dato a la vez.
9. Analítica de demanda fail-safe, **incluye misses** (= demanda insatisfecha) (`be-demand.ts`).
10. Opt-in Meta: solo ante consentimiento EXPLÍCITO; se pide UNA vez (se detecta buscando el
    propio texto del pedido en el historial — cero estado extra) (`opt-in-*.ts`).
11. Persistencia del lead para CRM/seguimiento (`be-leads.ts`, fail-safe).
12. **Respuesta de disponibilidad grounded**: "hay/no hay" POR CIUDAD desde existencias
    reales, jamás cantidad exacta; ante ambigüedad nombra candidatos reales del catálogo
    (`availability-reply.ts`).
13. Prioridad de respuesta: **FAQ > imagen > disponibilidad grounded > IA guardrailed > texto fijo.**
14. `enforceReplyGuardrails` (determinístico) SOLO sobre la respuesta libre de la IA: si
    afirma/niega stock o da precio → se reemplaza por texto seguro de derivación.
15. Fuera de horario (L-V 08:30-17:30, Sáb 08:30-13:00, UTC-4): el bot responde 24/7 pero
    agrega nota de expectativa de tiempos (`business-hours.ts`).
16. Quick replies (botones ciudad / candidatos de producto / opt-in) (`quick-reply.ts`).
17. Acciones Chatwoot: nota privada de triage (producto detectado + ruteo + score +
    transcripción + captura + "vendedor de siempre"), labels (`be_lead_*`,
    `be_prospecto_nuevo|be_cliente_conocido`, `be_producto_detectado`, `be_lead_completo`,
    `be_en_horario|be_fuera_horario`…), asignación, y respuesta pública **gated**.

### Catálogo y matching (la pieza más valiosa)

- Catálogo real ~12-18k productos. Carga: Postgres (`BE_CATALOG_DB=true`, tabla
  `catalog_products`, `scripts/imports/sync-catalog-to-db.ts`) → fallback archivo JSON
  normalizado (gitignored) → vacío (no-op silencioso). Spec:
  `docs/technical/be-catalog-normalization-spec.md`.
- Matcher (`product-matching.ts`): normalizar → stopwords (incluye muletillas cruceñas:
  "pes", "elay", "casero"… y tokens de ciudad para que "santa cruz" no matchee productos) →
  **diccionario de modismos** (alambre→cable, breaker/térmico→interruptor termomagnético,
  teip→cinta aislante, trafo, cincho…) → score con IDF + peso a tokens distintivos (calibre,
  código THHN, marca) + piso para genéricos ("cable", "caja").
- **Aprendizaje Nivel 1**: sinónimos nuevos de conversaciones reales los aprueba un humano →
  tabla `catalog_synonyms` → cache en memoria refrescada fuera del request path
  (`learned-synonyms.ts`). El diccionario es DATO, no código.
- Benchmark reproducible de matching: `scripts/bench/run-match-benchmark.ts` +
  `docs/product/match-benchmark-baseline.json` (1.3k casos).

### Guardrails de negocio (aprobados por Saúl, jefe de ventas)

Fuente: `docs/product/bot-behavior-spec.md`. Nunca precio · nunca cantidad exacta de stock
(sí "tenemos existencias", solo grounded) · entrega 24-48h sin garantizar · compra mínima
cable 1 m / resto 1 pieza · nunca decir que es bot · nunca nombrar competidores · formal
(usted) + emojis moderados · reclamo/garantía/crédito derivan a humano · ciudad PRIMERO ·
SLA de respuesta del vendedor (2-3 min implementado) → reasignación + llamada de atención a
gerencia + derivación al jefe de cada sucursal (4 sucursales), un aviso por conversación.

### Envío: responder vs. enviar (estado)

- **Responder (sesión 24h): construido y probado**, gated por 3 flags multiplicativos
  (`CHATWOOT_INTEGRATION_ENABLED` + `CHATWOOT_DRY_RUN=false` + `CHATWOOT_SEND_PUBLIC_REPLIES`)
  + **piloto acotado** por lista de teléfonos (`publicReplyAllowedPhones`, compara últimos 8
  dígitos del móvil boliviano; fail-safe: teléfono desconocido + lista activa = no responde).
- **Enviar proactivo (fuera de 24h): motor construido, sin encender.** Plantillas HSM con
  transporte seleccionable `meta|chatwoot` (`whatsapp-templates.ts`,
  `whatsapp-template-catalog.ts`), secuencias de seguimiento cotización +2/+5/+15 días +
  reactivación de dormidos con **reserva atómica del paso** (compare-and-swap,
  `follow-up-sequences.ts` + `infra/sql/leads_follow_up_tracking.sql`), opt-in almacenado
  (`customer_opt_in.sql`). Falta: plantillas aprobadas por Meta + Advanced Access + opt-ins
  reales. Plan completo: `docs/product/plan-mensajeria-bot.md`.
- Evidencia de envío: `interpretMetaSendResponse` — un HTTP 200 de Meta NO prueba entrega;
  exige `messages[0].id`, detecta `error` dentro de un 200 y captura el `wa_id` resuelto
  (número mal formado = envío que "sale bien" y jamás llega).

### Qué funciona y qué falta (verificado en `docs/product/go-live-chatbot.md`)

- Funciona: todo el pipeline inbound en dry-run/test (canal 3002), `npm run validate` verde,
  matching sobre catálogo real, SLA cron, panel `/bot-config` (transparencia de textos y
  reglas), `/probador-bot` (test interactivo), `/seguimientos` (preview de borradores).
- Falta para go-live prod: catálogo en el server de prod (compuerta 1) · encender flags
  (compuerta 2) · aprobar textos (gerencia) · rotar tokens filtrados (OpenAI + Chatwoot) ·
  `CHATWOOT_WEBHOOK_SECRET` (vacío = webhook spoofeable) · allowlist de inbox · quitar SKUs
  mock · directorio clientes teléfono→vendedor (sin eso el ruteo sticky no opera).
- Voz/llamadas en tiempo real: **0% construido** (solo docs de arquitectura, Pipecat).
- UNKNOWN (no confirmable desde el repo): si el cutover a Chatwoot self-hosted se ejecutó,
  plantillas creadas en la WABA, valores reales del `app.env` del server, estado actual de
  las flags en prod.

---

## (b) Qué se generaliza al PRODUCTO chatbot de la plataforma

El contrato ya está definido en C0 §3.3 (`ONIA_C0_ESQUELETO_MAESTRO_20260723.md`); BE es la
prueba de que el motor existe y funciona. La generalización es:

```text
addon.chatbot (external_gate, entitlement manual por cuenta — C0 §2.3/§2.4)
  canal (WhatsApp/Chatwoot del CLIENTE, registrado como CommunicationChannel del core)
  → POST /api/onia-core/intake  channel=whatsapp_chatwoot  (Bearer intake-secret, S3)
    (dedupe 24h, round-robin por carga, match de partner, NUNCA crea paciente)
  → el bot PROPONE respuestas como acciones (C0 §3.2)
  → /pending (cola de aprobación en la app)
  → humano aprueba → se envía
```

Decisión firme (recomendación única): **la plataforma arranca SIEMPRE en modo
human-in-the-loop (/pending); el "modo directo" de BE es una graduación por confianza, no el
default.** BE demostró qué requisitos hacen aceptable que el bot responda solo:
(1) textos aprobados por gerencia del cliente, (2) disponibilidad solo grounded desde datos
reales, (3) guardrail determinístico post-LLM, (4) pausa automática cuando un humano toma la
conversación, (5) piloto acotado por teléfonos antes de abrir a todos. Esos cinco puntos son
el **checklist de graduación** de cualquier tenant que quiera pasar de /pending a directo.

Mapa de piezas BE → plataforma:

| Pieza BE (path) | En la plataforma |
|---|---|
| `chatwoot-webhook.ts` (pipeline) | worker/servicio del add-on (external_gate), fuera del core; postea intake normalizado |
| nota privada de triage + labels | payload del WorkItem de intake + acciones propuestas en `/pending` |
| `seller-router.ts` (sticky + ponderado) | round-robin por carga del intake del core (ya existe); el ponderado queda como mejora del router |
| `product-matching.ts` + sinónimos aprendidos | motor de matching reusable; diccionario y catálogo POR TENANT (dato, no código) |
| guardrails (`reply-guardrails.ts`, prompt) | política por vertical/tenant, configurable; el enforcement determinístico es común |
| opt-in + plantillas HSM + secuencias | motor común de seguimiento; las plantillas y el opt-in son por tenant (WABA propia del cliente) |
| Chatwoot dedicado + n8n dedicado | regla managed bridge intacta: infra por cliente, nunca compartida (`BOLIVIAN_ELECTRIC_ONIA_MANAGED_BRIDGE_20260629.md`) |
| `bot-config` page | pantalla de configuración del add-on en la una-app (transparencia de textos/reglas al dueño) |

Pricing/packaging: el botón click-to-chat va GRATIS en la web; lo que se cobra es el chatbot
IA (`addon.chatbot`) — regla ya fijada en C0 §1.4 y en la skill de propuestas.

Referencia adicional que ya existe en el cerebro:
`web-factory/WEB_FACTORY_CHATBOT_MULTITENANT_ARCHITECTURE.md` (arquitectura multi-tenant
pensada desde web-factory) y `hermes-content/docs/ONIA_WHATSAPP_CHATWOOT_META_SALES_AUDIT_2026.md`.

---

## (c) Lecciones y decisiones reutilizables

1. **Determinístico primero, LLM después.** Intent, ciudad, matching, slots y ruteo son
   reglas puras unit-testeadas; el LLM solo conversa y clasifica. Sin API key el bot sigue
   operando. Esto hace el producto barato (gpt-4o-mini alcanza) y auditable.
2. **Grounded-only para hechos, con doble cinturón.** El prompt PROHÍBE afirmar
   stock/precio/existencias Y un filtro determinístico post-respuesta lo garantiza aunque el
   modelo desobedezca. La disponibilidad solo la dice el sistema desde datos reales. Nunca
   confiar en el prompt solo.
3. **Fail-safe en todo lo lateral.** Analítica, lead, opt-in, sinónimos: fire-and-forget;
   una DB caída jamás toca la respuesta. El webhook NUNCA lanza (un 500 → Meta reentrega →
   el cliente recibe respuesta duplicada). Timeouts en todo fetch (`safeFetch`).
4. **Contra-lección del fail-safe: "desplegado ≠ funciona".** El catálogo vacío degrada a
   no-op EN SILENCIO (pasó en prod: el JSON nunca llegó al contenedor). Todo add-on necesita
   `/health` que reporte el tamaño de sus datos.
5. **La memoria es el historial del canal**, no estado propio: el "¿ya le pregunté X?" se
   resuelve buscando el propio texto en el historial. Menos estado = menos bugs.
6. **Pausa por humano** comparando autor vs. `botAgentId`: el bot jamás habla encima del
   vendedor. Requisito duro de convivencia bot+humano en un mismo número.
7. **Modismos como dato aprobado por humano**, no código: seed estático + tabla
   `catalog_synonyms` + cache. El loop de aprendizaje pasa por aprobación (encaja natural en
   `/pending`).
8. **Gates multiplicativos + piloto acotado.** Encender = N flags verdaderos a la vez +
   lista de teléfonos propios primero. "El primer cliente real no puede ser el primer test."
9. **Evidencia de envío**: 200 ≠ entregado; exigir message id y wa_id resuelto. Los
   webhooks de `statuses` son la única verdad de entrega.
10. **Opt-in de Meta como modelo de datos de primera clase** (no un booleano suelto):
    consentimiento EXPLÍCITO, se pide una vez, y sin él no hay proactivo (riesgo de baneo).
11. **Chatwoot como BSP es el camino corto** (sin app Meta propia) pero limita plantillas /
    Advanced Access; por eso el transporte de plantillas quedó seleccionable `meta|chatwoot`.
    La app Meta propia es Fase 3, solo si multi-cliente/voz lo exige.
12. **Captura progresiva, un dato por mensaje, nunca repreguntar** — la diferencia entre un
    bot que vende y uno que hincha. Si el matcher ya identificó el producto, "producto"
    cuenta como capturado.
13. **Reserva atómica en schedulers** (compare-and-swap del paso de seguimiento): dos crons
    concurrentes no pueden mandar el mismo mensaje dos veces.
14. **La nota privada de triage es la interfaz bot→vendedor**: todo el contexto (producto,
    score, ruteo, transcripción, capturas) vive EN la conversación, no en otra pantalla.

---

## (d) Gaps para productizarlo como `addon.chatbot`

1. **Multi-tenancy.** Todo es single-tenant hoy: config por env vars, roster hardcodeado
   (`seller-directory.ts`), sinónimos eléctricos/cruceños, textos BE. Falta: configuración
   por organización (textos, guardrails, horarios, roster, catálogo, FAQ) leída de DB con
   entitlement `addon.chatbot`.
2. **Cablear al intake del core.** El pipeline BE escribe en Chatwoot y tablas BE_*; el
   producto debe postear `POST /api/onia-core/intake` (`whatsapp_chatwoot`) y transformar
   sus "acciones" (respuesta propuesta, asignación, labels) en acciones de `/pending`. El
   contrato existe (C0 §3.3); el transformador no.
3. **Runtime del add-on.** Hoy vive dentro de la app Next del cliente; como producto debe
   ser servicio/worker external_gate desplegable por tenant (mismo patrón agentes C0 §1.3),
   con n8n del cliente vía Credentials (cero `$env` — regla VPS).
4. **Onboarding del canal por cliente.** Embedded Signup + Chatwoot dedicado + provisioning
   de agentes (`scripts/chatwoot/provision-agents.ts` ya existe como semilla) empaquetado
   como runbook repetible; hoy es artesanal (runbooks BE en `docs/operations/`).
5. **Plantillas HSM + opt-in productizados.** Motor construido; falta el flujo estándar:
   diseñar plantillas por vertical, submit a Meta, capturar opt-in desde el primer contacto.
6. **Aprendizaje → /pending.** La aprobación de sinónimos/textos nuevos debe ser una cola en
   la app (hoy requiere tocar DB/archivo).
7. **Observabilidad mínima por tenant**: `/health` con catálogo cargado, respuestas
   enviadas/skipped y motivo, alarma si el webhook recibe sin firma.
8. **Seguridad de base**: firma de webhook OBLIGATORIA (no opcional-vacía), secretos en
   credenciales/vault con rotación (lección: tokens OpenAI+Chatwoot se filtraron en texto
   plano y hay que rotarlos — pendiente B2 del go-live).
9. **Merge pendiente en el repo BE**: la rama `claude/bolivian-electric-chatbot-1e39da` no
   está en `main`; antes de reusar nada como base del producto, mergearla o declarar esa
   rama la fuente (hoy main quedó atrás).

---

*Docs BE complementarios ya en el cerebro: `BOLIVIAN_ELECTRIC_META_WHATSAPP_CASE_20260627.md`
(identidad legal Bolivian Group S.R.L., mapeo Meta), `BOLIVIAN_ELECTRIC_ONIA_MANAGED_BRIDGE_20260629.md`
(modelo de infra administrada), `ONIA_WHATSAPP_CHATWOOT_META_SALES_AUDIT_2026.md`.*

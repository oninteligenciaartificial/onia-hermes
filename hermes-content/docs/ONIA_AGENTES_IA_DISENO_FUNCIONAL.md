# ONIA — Agentes de IA: diseño funcional

**Qué es:** cómo FUNCIONAN los agentes de IA de Onia Platform (los vivos y los siguientes),
contrastado con cómo lo hacen los competidores. Fuente de verdad del diseño funcional de
agentes del producto.

**Extiende, no duplica:**
- Código real (autoridad): `onia-platform/lib/onia-core/modules/agents-runtime.ts` +
  `agents-config.ts` (espejo de `onia-core/modules/agents.json`).
- Agente "Producto" (mejora interna del producto, no vendible): ya diseñado en
  [`ONIA_AGENTE_PRODUCTO_DISENO.md`](ONIA_AGENTE_PRODUCTO_DISENO.md) — no se repite aquí.
- Molde de rubro, paso 4 ("IA propone → humano confirma"): `onia-core/ONIA_RUBRO_COMPLETITUD_CHECKLIST.md`
  — construido, gateado por `AGENTS_RUNTIME` + entitlement.
- Dirección de UX aprobada: maqueta v4 — propuestas del agente INLINE junto a su
  evidencia + píldora de decisiones. Este doc diseña el motor detrás de esa pantalla.
- Precios: **manda `onia-platform/lib/pricing.ts`**. Aquí no se escribe ningún número de precio.

---

## 1. Benchmark de competidores (leído 2026-08-17)

| Competidor | Qué hace su IA | Cómo se ve en el panel | ¿Envía solo? | Cómo se cobra | Promesa de marketing |
|---|---|---|---|---|---|
| **Weave** (dental/salud) | AI Receptionist (voz+texto, early access): agenda, responde FAQs, cobra; texto automático a llamada perdida; Call Intelligence (transcribe, detecta oportunidades de revenue); **Response Assistant responde reseñas**; Email Assistant genera campañas | Dashboard de Call Intelligence + Call Pop con historia del paciente; inbox de textos | Sí — missed-call text y respuestas a reseñas se marketean como automáticas; Receptionist autónomo con handoff (nivel de control: a verificar) | Sin precio del vendor; terceros: ~USD 249–599/mes por local; AI Receptionist como add-on aparte (a verificar) | "Keep a full schedule and capture missed revenue" |
| **Adit / Adit Voice** (dental) | AI Front Desk Agent (feb-2026): captura llamadas perdidas y fuera de horario, agenda y confirma citas, rutea llamadas complejas al staff, sincroniza resúmenes al EHR (30+ idiomas); Call Intelligence "listens, learns, and acts"; verificación de seguros, gestión de reseñas | Dashboard único (15+ herramientas); resúmenes de llamada en el expediente | Sí — atiende y agenda solo; escala lo complejo a humano (control configurable: a verificar) | Sin precio publicado por el vendor; ~USD 399/mes reportado por terceros (a verificar) | "All-in-One AI-powered practice management" |
| **NexHealth** (dental/salud) | Agenda online en tiempo real, waitlist 1-click (cancelación → aviso a lista de espera), recordatorios/recalls SMS-email, traducciones IA a 10 idiomas, AI Campaigns Assistant (redacta campañas de recall) | Automatización configurada en background + módulo Communications; NO es cola de sugerencias | Sí — reminders y waitlist corren solos (plantillas, no juicio); campañas: el asistente redacta, el staff dispara (a verificar) | Por cotización; ~USD 299/mes según terceros; la IA no se vende como add-on visible | "75% of admin tasks automated" |
| **Dentrix / Henry Schein One** (dental) | Ascend: agentes back-office "corriendo en vivo" — Eligibility Pro (seguros en tiempo real), Image Verify, conciliación de claims, huecos de recall, seguimiento de pacientes; capa MCP abierta para agentes custom. **Detect AI** (VideaHealth, FDA-cleared): detección de caries/pérdida ósea como overlay sobre la radiografía | Dentro del PMS; Detect AI = overlay en la imagen apenas se captura, sin portal aparte | Back-office sí (seguros/claims). Clínico NO: "supports clinical judgment rather than replacing it" — el dentista diagnostica | Empaquetado en tiers de Ascend; quote-based, sin precio público | "Diagnose with confidence" / "AI agents… for dental practices" |
| **Curve Dental** (dental) | Care+ (voz clínica: notas ambient, odontograma y perio por voz — LIVE), Collect+ (cobranzas, phased), Connect+ (reminders/recall/reactivación — coming soon), Ask CurveAI (soporte in-app), verificación de seguros IA | Nativo, embebido en el flujo clínico — sin extensiones ni logins aparte | **NO — es su tagline: "Reviewable AI does the heavy lifting. Your team reviews, approves, and makes the final call"** | No publicado; UNKNOWN si Care+ es add-on o incluido | "Built-in intelligence. More time for care." |
| **Jobber** (servicios de campo) | AI Receptionist: contesta llamadas y textos 24/7, captura leads, crea work requests y agenda directo al calendario. Copilot: asesor conversacional (chat+voz) sobre datos propios + benchmarks; Rewrite pule mensajes | Receptionist = canal telefónico/SMS con notificaciones; Copilot = chat lateral en el panel | Receptionist sí — agenda solo dentro de parámetros. Copilot no actúa, aconseja; Rewrite requiere aprobación | Receptionist: add-on USD 29/mes con 30 conversaciones + USD 0,79 extra; **ilimitado incluido en plan Plus** (~USD 599/mes). Copilot gratis en todos los planes | "Answers calls, captures leads, books jobs automatically" |
| **Square AI** (comercio) | Asistente conversacional del dashboard: ventas, staff, tendencias + datos externos (clima, eventos, barrio); gráficos pineables; voice ordering directo a cocina; **Managerbot** (beta abr-2026): agente proactivo que vigila stock y velocidad de venta y propone horarios de personal | Chat dentro del Square Dashboard; Managerbot avisa proactivo | Insights no actúan — el humano decide; voice ordering sí opera solo; autonomía real del Managerbot: a verificar | Incluido/beta para usuarios Square; sin precio propio publicado; qué planes lo incluyen: UNKNOWN | "Meet your new AI-powered business partner" |
| **Intercom Fin** (soporte, horizontal) | Agente que RESUELVE conversaciones de punta a punta (claim: 76% resolution) con acciones reales (refunds, cuentas, sistemas de terceros vía Procedures) + Fin Copilot para el agente humano | Bot frontal en messenger/canales + Copilot en el inbox; control humano EX-ANTE (config, límites, testing), no por mensaje | Sí — autonomía total es el producto; handoff con contexto | **USD 0,99 por resolución** + USD 9,99 por qualification, mínimo 50 outcomes/mes (fin.ai/pricing); Copilot USD 35/usuario/mes | "The highest performing Customer Agent" |
| **HubSpot Breeze** (CRM, horizontal) | Customer Agent (resuelve tickets 24/7), Prospecting Agent (monitorea señales, investiga y REDACTA correos que un humano aprueba antes de enviar), Data/Content/Social agents a créditos | **Agent Hub**: dashboard unificado con estado vivo y métricas de cada agente + Copilot en toda la UI | **Prospecting: NO — humano aprueba cada correo** (lo venden como calidad). Customer Agent resuelve solo con revisión configurable | Outcome-based desde 14-abr-2026: USD 0,50/conversación resuelta; USD 1/lead recomendado; resto a créditos (USD 0,01). **Solo Pro y Enterprise** | "You pay when the task is complete" |

Fuentes (vendor primero): [getweave.com/ai](https://www.getweave.com/ai/) · [weave pricing (emitrr, tercero)](https://emitrr.com/blog/weave-pricing/) · [adit.com/ai-front-desk](https://adit.com/ai-front-desk) · [adit press AI suite](https://adit.com/adit-launches-next-generation-ai-suite-transforming-the-front-desk-with-call-intelligence-that-listens-learns-and-acts) · [nexhealth traducciones (help center)](https://help.nexhealth.com/en/articles/10185214-communicate-in-patients-preferred-languages) · [nexhealth AI campaigns](https://www.nexhealth.com/help/how-do-i-use-the-ai-campaigns-assistant) · [dentrix.com Detect AI](https://www.dentrix.com/products/dentrix-detect-ai) · [HS1 MCP press](https://www.henryscheinone.com/about-us/press-release/dentrix-ascend-opens-mcp-layer/) · [HS1 AWS clinical](https://www.henryscheinone.com/about-us/press-release/dentrix-ascend-introduces-next-generation-clinical-workflow-built-with-aws/) · [curvedental.com/ai](https://www.curvedental.com/ai) · [curve press (prnewswire)](https://www.prnewswire.com/news-releases/curve-dental-launches-curve-care-a-native-clinical-ai-suite-built-for-modern-dentistry-302825428.html) · [getjobber.com/features/ai](https://www.getjobber.com/features/ai/) · [jobber receptionist (help center)](https://help.getjobber.com/hc/en-us/articles/25315927533847-Receptionist-powered-by-Jobber-AI) · [squareup.com/us/en/ai](https://squareup.com/us/en/ai) · [square AI press](https://squareup.com/us/en/press/square-releases-ai) · [fin.ai/pricing](https://fin.ai/pricing) · [hubspot outcome pricing](https://www.hubspot.com/company-news/hubspots-customer-agent-and-prospecting-agent-now-you-pay-when-the-task-is-complete) · [hubspot AI](https://www.hubspot.com/products/artificial-intelligence) · [martech breeze pricing](https://martech.org/hubspot-moves-to-outcome-based-pricing-for-some-breeze-ai-agents/)

### Las tres lecturas que importan

1. **Los verticales dentales automatizan el CANAL (voz/llamadas), no el criterio.** Weave,
   Adit y Jobber venden un recepcionista que contesta el teléfono solo; el control humano
   dominante es EX-ANTE (configuración, límites, testing), no por mensaje. Los únicos que
   venden aprobación por pieza son HubSpot Prospecting (humano aprueba cada correo, lo usan
   como argumento de calidad) y Curve Dental, cuyo tagline es literalmente nuestro modelo:
   "reviewable AI… your team reviews, approves, and makes the final call" — pero su Connect+
   (la parte que envía) todavía no lanzó. **Ninguno marketea una cola de propuestas con la
   evidencia al lado** (maqueta v4): eso que Onia ya tiene construido es el espacio libre.
2. **El pricing se está moviendo a outcome-based** (Fin USD 0,99/resolución, Breeze
   USD 0,50/resolución, Jobber USD 0,79/conversación extra). Todos generan ansiedad de
   factura variable — la queja #1 en reseñas. Onia cobra los agentes DENTRO del plan (Pro+):
   argumento de venta directo ("sin sorpresas por uso"), y los guardrails (20 mensajes/día
   máximo) acotan el costo por diseño.
3. **"Incluido en el plan alto" es patrón probado:** Jobber regala el Receptionist ilimitado
   en Plus y el Copilot en todos los planes; Breeze exige Pro/Enterprise. Los agentes como
   razón para subir de plan — no como add-on — es lo que ya hace `agentsIncluded` en
   `plan-limits.ts`. Para el panel, la referencia de mercado es el Agent Hub de HubSpot
   (estado vivo + métricas por agente).

---

## 2. Los agentes que YA corren (del código, no del deseo)

Catálogo real en `AGENT_KINDS` (`agents-runtime.ts`): **tres** kinds, no dos. Recall y
Cobrador corren para toda org con agentes; el Captador solo con el add-on inmobiliario.

### 2.1 Recall — reactivación de pacientes/clientes

- **Detecta:** pacientes con última visita COMPLETADA hace 180+ días y SIN cita futura
  (PENDIENTE/CONFIRMADA), respetando opt-out y cooldown de 30 días por persona.
- **Propone:** `draft_message` con texto por rubro (`RECALL_COPY`: dental / estética /
  veterinaria; track desconocido cae al texto neutro, NUNCA al dental — bug real del
  2026-08-15). Corre 1 vez/día.
- **Evidencia en la propuesta:** días desde la última visita, ausencia de cita futura,
  último contacto del agente.
- **Nunca hace solo:** enviar. Todo va a `/pending`.

### 2.2 Cobrador — saldos vencidos

- **Detecta:** facturas EMITIDAS con saldo pendiente (total − pagos > 0) y vencimiento
  cumplido; en tracks de comercio/importadora (`COMERCIO_TRACKS`) lee **fiados** del
  mostrador con vencimiento en vez de facturas clínicas. Cooldown 7 días. Corre 1 vez/día.
- **Propone:** `draft_message` de recordatorio de pago con monto, moneda y días de atraso
  (copy clínico o copy comercio con voseo).
- **Evidencia:** número de factura/fiado, saldo exacto, días vencidos, último contacto.
- **Nunca hace solo:** enviar, cobrar, ni ejecutar pago (`send_money`/`execute_payment`
  están en `prohibited`).

### 2.3 Captador — consultas de interesados (add-on inmobiliaria)

- **Gate:** `requiresFeature: "addon.inmobiliaria"` — sin ese entitlement el kind ni se
  crea (si no, cada clínica dental estrenaría un captador inmobiliario).
- **Detecta:** work items del intake (formulario/WhatsApp/correo) abiertos, ≤30 días,
  sin comentario humano. Corre cada 30 min. Máximo **3 toques** por lead y cierra educado.
- **Propone:** `draft_message` (respuesta que solo repite lo que el interesado escribió —
  sin precios, sin m², sin disponibilidad: en Fase 1 no existe la entidad Propiedad y
  cualquier dato sería fabricado) y/o `create_task` para el asesor (lead caliente → "llamar
  hoy"; sin teléfono; o >24 h sin respuesta). T4: visita en <6 h sin confirmar y con
  recordatorio ya enviado → `create_task` "llamalo", NUNCA otro mensaje.
- **Nunca hace solo:** contactar. `create_task` sí sale auto (interna y reversible); todo
  `draft_message` va a la cola aunque el agente tenga `autonomyLevel: "auto"`.

**Estado real:** construido y testeado; gateado por `AGENTS_RUNTIME=1` + capa C1 +
entitlement/plan vigente (fail-closed: flags off = cero queries). No verificado encendido
en producción (checklist paso 4).

---

## 3. Modelo de operación transversal (el circuito que ya existe)

Todo agente presente o futuro pasa por el MISMO circuito — esto es lo que se diseña una
vez y se reusa por rubro:

```
cron → feed normalizado → evaluador puro (quién califica y por qué)
  → drafts → dedupe (propuestas vivas) → tope por corrida (25)
  → guardrails (100 acciones/día, 20 mensajes/día, prohibited)
  → routeAction (REGLA DURA):
       contacta/publica/cobra/gasta → pending_approval
         = OniaCoreApprovalRequest visible en /pending, con el sobre de
           despacho (canal + destino + texto EXACTO que se ejecutará)
       interna y reversible (create_task/schedule_followup) → auto_executed
         = WorkItem del core con dueño
  → humano aprueba/rechaza en /pending
  → despacho por canal (WhatsApp wa.me manual VIVO; Meta directo pendiente de token)
  → auditoría completa: onia_agents_runs + onia_agents_actions con estado,
    razón, quién aprobó y qué se ejecutó
```

Reglas que NO se negocian (de `agents-config.ts`, espejo de `onia-core/modules/agents.json`):

- `draft_message`, `send_message`, `create_proposal`, `publish_content`, `scrape` →
  **siempre aprobación humana**, en cualquier nivel de autonomía.
- `prohibited` (nunca se propone ni ejecuta): `send_money`, `execute_payment`,
  `delete_data`, `modify_settings`.
- Niveles de autonomía (`suggest`/`semi_auto`/`auto`) solo mueven lo INTERNO reversible;
  lo externo jamás.

**UX (dirección aprobada, maqueta v4):** la propuesta se muestra INLINE junto a su
evidencia (la factura vencida al lado del borrador de cobro) + píldora de decisiones.
La tasa aprobado/rechazado por tipo de acción alimenta al agente Producto
(`ONIA_AGENTE_PRODUCTO_DISENO.md`) — es el dataset propio que un competidor no puede copiar.

---

## 4. Los siguientes agentes (benchmark + core los justifican)

Criterio de admisión: (1) un competidor ya lo vende — demanda probada; (2) el core ya
tiene el actionType y la entidad — no exige contrato nuevo; (3) cabe en el circuito §3
sin excepción a la regla dura. Orden = esfuerzo/valor.

| # | Agente | Qué propone | Evidencia que muestra | Canal | Nunca hace solo | Benchmark que lo valida | Qué falta |
|---|---|---|---|---|---|---|---|
| 1 | **Confirmador de citas** (todos los rubros con agenda) | Generalizar el T4 del captador: cita en <6 h sin confirmar y con recordatorio ya enviado → `create_task` "llamalo" para el equipo; opcional `draft_message` de reconfirmación si NO hubo mensaje en 24 h | Cita, hora, recordatorio enviado y cuándo, sin respuesta | Tarea interna; WhatsApp aprobado | Enviar un 3er mensaje (el cron de reminders ya mandó 2) | Weave/NexHealth venden "menos no-shows"; el evaluador ya existe (`evaluateVisitCandidates`) | Sacarlo del gate `addon.inmobiliaria`: es útil en dental/estética hoy |
| 2 | **Resumen del día** | `summarize` (interno, sin aprobación): citas de mañana, cobros pendientes, propuestas de agentes esperando en /pending, stock crítico — un correo al dueño cada mañana | Los números con link a cada pantalla | Correo (cupo `emailsPerMonth` del plan) | Nada externo: le escribe AL dueño, no a terceros | Square AI y Jobber Copilot venden exactamente esto como "insights" | Solo el template de correo; el actionType ya existe |
| 3 | **Stock bajo → compra sugerida** (comercio, importadora, clínicas con inventario) | `create_task` u orden de compra BORRADOR (`create_proposal`) cuando un ítem cruza el mínimo, con cantidad sugerida por venta reciente | Ítem, stock actual vs mínimo, velocidad de venta, proveedor último precio | Interno; si contacta proveedor → cola | Comprar, gastar, contactar proveedor | Square Managerbot vigila stock y velocidad de venta (beta abr-2026) — demanda validada este año | Regla de mínimos por ítem (inventario ya existe en todos los planes) |
| 4 | **Captador generalizado** (todos los rubros) | El captador actual sin el gate inmobiliario: califica leads del intake, borrador de respuesta + tarea si está caliente/frío/sin canal | Lo que el lead escribió, señales detectadas, toques previos | WhatsApp/correo aprobado | Responder solo; inventar datos de servicio o precio | Jobber Receptionist (lead capture) y HubSpot Prospecting (borradores con aprobación — el modelo MÁS parecido al nuestro) | Señales por rubro (hoy las preguntas son inmobiliarias); mismo motor |
| 5 | **Respuesta a reseñas** | `publish_content` BORRADOR de respuesta a cada reseña nueva de Google (agradecer/atender queja) | La reseña completa, estrellas, historial del cliente si se identifica | Publicación aprobada | Publicar; discutir con el cliente; ofrecer compensación | Weave tiene Response Assistant que responde reseñas (automático — nosotros con aprobación es MEJOR historia); Adit vende gestión de reseñas | Integración Google Business Profile (external_gate — hoy no existe; es el único de la lista que exige integración nueva) |

**Descartado a propósito:** recepcionista de VOZ (lo que venden Weave/Adit/Jobber).
Exige telefonía + IA de voz en tiempo real — infra que no tenemos y canal que en Bolivia
pesa menos que WhatsApp. El chatbot WhatsApp con IA (add-on, gateado por Meta) ya cubre
"contestar 24/7"; es otro carril (`ONIA_CHATBOT_LINEA_DE_ENTREGA.md`), no un agente de
este runtime. Un "no-show predictor" con ML también se descarta: sin volumen de datos
(0 orgs activas al 2026-08-15) sería teatro — la regla T4 ya captura el caso accionable.

---

## 5. Cómo se cobra (vs. competidores)

**Decisión vigente (código):** los agentes salen del PLAN — `agentsIncluded: true` en
`professional`, `clinic` y `enterprise` (`lib/plan-limits.ts`). El trial es "professional",
así que toda cuenta nueva VE la vitrina de agentes desde el día 1. El entitlement
`module.agents` existe como puerta alternativa por-org. Números de precio: `pricing.ts`, único
archivo que cobra.

| Modelo | Quién lo usa | Por qué NO lo copiamos |
|---|---|---|
| Por resolución/outcome (0,50–0,99 USD) | Intercom Fin, HubSpot Breeze | Factura impredecible — la queja #1 en las reseñas de ambos. Nuestro cliente boliviano formal quiere cuota fija |
| Add-on con cupo (29 USD + 0,79/extra) | Jobber Receptionist | Fricción de venta doble; Jobber mismo lo regala en el plan alto |
| Incluido en plan alto | Jobber Plus, Breeze Pro+, **Onia** | Es la razón para subir de plan; el costo marginal está acotado por guardrails (20 mensajes/día máx) |

Lo que SÍ es add-on en Onia es el **canal**: el chatbot/WhatsApp API (escalera
`WHATSAPP_ADDON` en pricing.ts). Regla de venta: *el agente piensa gratis dentro de tu
plan; el canal premium por donde sale el mensaje es lo que se contrata aparte.* No
mezclar: el botón wa.me manual va incluido — lo cobrado es el canal automatizado.

---

## 6. Qué prometemos en marketing (sin mentir)

Prohibido "IA autónoma", "se maneja solo", "reemplaza a tu recepcionista". La promesa
es la ventaja, no la limitación:

**Frase madre: "Tus agentes proponen. Vos decidís."**

Se puede decir (todo verificable en código):
- "Cada mañana tus agentes revisan pacientes que no volvieron, saldos vencidos y consultas
  sin responder — y te dejan los mensajes LISTOS para aprobar con un toque."
- "Ves la evidencia junto a cada propuesta: la factura, los días de atraso, el mensaje
  exacto que va a salir." (maqueta v4)
- "Nada se envía sin tu aprobación. Nunca." (regla dura en código, no una opción)
- "Máximo 20 mensajes por día y nunca dos veces a la misma persona en la semana —
  tus clientes no se sienten spameados." (guardrails + cooldowns reales)
- "Incluido en tu plan. Sin costo por mensaje, sin sorpresas a fin de mes." (vs.
  outcome-based de la competencia — golpe directo)

No se puede decir (hasta que sea verdad):
- Que el mensaje aprobado "sale automático por WhatsApp" — hoy el despacho es wa.me
  manual; Meta directo está pendiente de token. Decir: "aprobás y lo enviás con un toque".
- Cifras de resultado ("20% menos no-shows") — cero clientes midiendo. Prohibido
  fabricar (regla de propuestas #9).
- "Agentes en todos los rubros" — el copy de Recall cubre 3 tracks clínicos + cobranza
  comercio; el resto cae a texto neutro.

---

## 7. Sin verificar / pendiente

- `AGENTS_RUNTIME` encendido o no en el VPS de producción (checklist de rubro, mismo pendiente).
- Nivel de control humano configurable en Weave/Adit/Square Managerbot: sale de marketing,
  sin demo — "a verificar". Adit además bloquea bots (403): casi todo vía press y terceros.
- Precios: NINGÚN vertical dental publica el precio de su capa IA (todos quote-based);
  las cifras ~249–599 USD/mes son de terceros. Curve: UNKNOWN si Care+ es add-on o incluido.
  Weave AI Receptionist como add-on aparte: dato de terceros.
- Square AI/Managerbot: en beta, sin pricing propio publicado; qué planes lo incluyen UNKNOWN.
- Intercom Fin: Salesforce firmó su adquisición (jun-2026) — el pricing puede cambiar al cierre.
- Cifras de resultado de todos ("76% resolution", "75% admin automated", "31% menos lesiones
  no detectadas"): claims de marketing, sin verificación independiente.
- Los agentes #1–#5 de §4 son DISEÑO: nada de eso está construido ni prometido a nadie.

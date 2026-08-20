# ONIA — Línea de entrega del chatbot: de contrato firmado a bot vivo

> **Fuente de verdad viva** (sin fecha en el nombre: se EDITA, no se duplica).
> Responde: cuál es el camino más corto para conectar el WhatsApp de un cliente,
> qué parte del bot es plantilla y cuál se rehace, cómo se siembra el cerebro sin
> sesiones artesanales, y la línea completa con tiempos.
>
> Contexto: armar el chatbot propio tardó semanas. Eso NO se repite por cliente,
> porque las semanas se fueron en construir el MOTOR (que ya existe), en el
> catálogo artesanal de Bolivian Electric (caso extremo, se cobra a medida) y en
> los trámites de Meta (se hacen UNA vez). Lo que queda por cliente es:
> conexión + siembra + prueba.
>
> Precio que esto entrega: **Chatbot WhatsApp con IA — Bs 1.500 inst. + Bs 1.490/mes
> + Meta por consumo** (fuente única: `onia-platform/lib/pricing.ts`, `WHATSAPP_ADDON`).

---

## 0. Resumen

| Métrica | HOY (sin construir nada) | OBJETIVO (con las 3 piezas de §5) |
|---|---|---|
| Trabajo nuestro por cliente | ~4–6 h [estimación propia, §4] | **~1,5–2 h** |
| Calendario contrato → vivo | 2–4 días (depende de textos aprobados y datos del cliente) | **1 día** |
| Conexión del número | Manual bajo NUESTRA WABA (solo pilotos, techos duros §1.2) | Embedded Signup: el cliente conecta SU número en ~10–15 min |

**Las 3 cosas a construir (orden por impacto, detalle en §5):**
1. **Encender Embedded Signup en Chatwoot** — trámite Meta (una vez) + 3 variables de entorno. Código nuevo: cero.
2. **Plantilla de bot por cliente sobre el motor BOT-ONIA** — un `config` por cliente + script de alta (inbox, webhook, agentes, n8n).
3. **Siembra automática desde el formulario de intake** — intake → config del bot + prueba de humo. Sin sesión artesanal.

**🔴 Fecha que manda: 1-oct-2026.** Meta empieza a cobrar las respuestas dentro de la
ventana de 24 h (~USD 0,0113/mensaje, misma tarifa que utility — tarifa definitiva la
publica Meta antes del 1-sep-2026). Fuente:
[Upcoming pricing updates](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)
y `historial/ONIA_META_WHATSAPP_CLIENTES_20260808.md` §4. **Consecuencia para la línea:**
toda alta debe terminar con el cliente en SU propia WABA y con SU método de pago cargado
en WhatsApp Manager — ese costo es del cliente, no nuestro (así está vendido: "+ Meta").

---

## 1. Conexión Meta: el camino más corto

### 1.1 Embedded Signup vía Chatwoot — el camino objetivo (encender, no construir)

Chatwoot self-hosted (ya corre en el VPS, cuenta "OnIA Agency", v4.12.1) soporta el
Embedded Signup de Meta **nativo**. No se escribe código: el super admin setea
**3 variables** en `/super_admin/app_config?config=whatsapp_embedded`:
`WHATSAPP_APP_ID`, `WHATSAPP_CONFIGURATION_ID`, `WHATSAPP_APP_SECRET`.
Fuente: [Chatwoot Developer Docs — WhatsApp Embedded Signup](https://developers.chatwoot.com/self-hosted/configuration/features/integrations/whatsapp-embedded-signup).

**Flujo una vez encendido** (fuente: [guía de usuario Chatwoot](https://www.chatwoot.com/hc/user-guide/articles/1752129193-how-to-use-whatsapp-embedded-signup)):

| Quién | Hace | Tiempo |
|---|---|---|
| Nosotros | Settings → Inboxes → Add Inbox → WhatsApp → "Connect with WhatsApp Business" | ~2 min |
| Cliente (en el popup de Meta) | Login Facebook → acepta términos → elige/crea portfolio → elige/crea WABA → verifica su número por SMS → display name | **~10–15 min** [estimación propia sobre los 8 pasos documentados en `historial/ONIA_META_WHATSAPP_CLIENTES_20260808.md` §3] |
| Chatwoot | Token + webhook + registro del número: **automático** | 0 |

Ventajas decisivas: WABA **del cliente** (su escalera de mensajería, su factura de Meta) y
**coexistence** — el cliente sigue usando la app WhatsApp Business en su celular con el
mismo número (exige app ≥ 2.24.17; desvincula WhatsApp Web/Desktop y fija throughput en
20 mps — avisárselo antes).

**Prerrequisito (UNA vez, no por cliente): Tech Provider aprobado.**
Runbook completo en `historial/ONIA_META_WHATSAPP_CLIENTES_20260808.md` §2. Resumen:

| Paso | Estado | Tiempo de Meta |
|---|---|---|
| Verificación del negocio | ✅ aprobada | — |
| App "Onia Bot" (1078962684709749) en live mode | ✅ | — |
| App Review de `whatsapp_business_management` + `whatsapp_business_messaging` (2 screencasts, uno por permiso; no pedir más) | **NO VERIFICADO si ya se presentó** | ~24 h de revisión (dato oficial Meta) |
| Access Verification (formulario) | NO VERIFICADO | ~5 días |
| Configuración "Facebook Login for Business" → sacar el `WHATSAPP_CONFIGURATION_ID` | pendiente | ~30 min nuestro |
| Setear las 3 env vars + **probar el flujo con un número real** | pendiente | ~2–4 h nuestro (una vez) |

Sin App Review aprobado se pueden onboardear igual **10 clientes por semana** (cupo default
documentado por Meta); con todo aprobado, 200/semana. O sea: el trámite no bloquea vender,
bloquea el *botón*.

**NO VERIFICADO en nuestra instancia:** que el Embedded Signup funcione en nuestro Chatwoot
concreto. La función existe desde ~v4.5–4.11 y corremos 4.12.1, pero hay reportes de fallas
silenciosas en self-hosted (popup que no abre; exige HTTPS válido y cookies de terceros):
[Discussion #13899](https://github.com/orgs/chatwoot/discussions/13899),
[Issue #13154](https://github.com/chatwoot/chatwoot/issues/13154).
Por eso la prueba real con un número es parte del encendido, no un opcional.

### 1.2 Manual en Meta Business — el camino de HOY (pilotos)

Lo que ya hicimos dos veces (bot propio +591 75414930 y BE +59171353296): número dentro de
**nuestra** WABA, token pegado a mano, inbox WhatsApp Cloud en Chatwoot configurado manual.
Chatwoot lo documenta como el camino "para tech providers que manejan su propio número":
[How to set up a WhatsApp channel](https://www.chatwoot.com/hc/user-guide/articles/1677832735-how-to-setup-a-whats_app-channel)
(exige: Phone Number ID, WABA ID, token de system user, verify token del webhook).

| Paso | Tiempo [estimación propia; ya ejecutado 2 veces] |
|---|---|
| Agregar número a nuestra WABA + verificación SMS | 15–30 min |
| System user token + asignar assets en Meta Business | 15–30 min |
| Inbox WhatsApp Cloud en Chatwoot + webhook + agent bot | 15–30 min |
| Total limpio | **~45–90 min** (el alta real del bot propio tardó más por trampas ya documentadas: inbox API primero, ignorar `message_type: outgoing` para no auto-responderse en loop, credenciales leídas del VPS) |

**Techos duros de este camino** (por qué NO es base de producto —
`historial/ONIA_META_WHATSAPP_CLIENTES_20260808.md` §3):
límite de mensajería **compartido** entre todos los clientes del portfolio · tope 20
números · la factura de Meta cae en nuestro método de pago · sin coexistence (el cliente
pierde su app o usa número nuevo) · legal: sirve para **1–3 pilotos con consentimiento
escrito**, no más.

### 1.3 Veredicto

- **Hoy:** manual bajo nuestra WABA, solo para cerrar los primeros pilotos. ~1 h nuestra por número.
- **Camino real (2–6 semanas de trámite en el peor caso, casi todo espera de Meta):**
  Embedded Signup vía Chatwoot. Costo nuestro por cliente: ~5 min. Costo del cliente: ~15 min.
  **Es lo más fácil y rápido "desde Meta" que existe, y ya está instalado.**

---

## 2. El bot de Bolivian Electric: qué es plantilla y qué fue artesanal

Inventario sobre `C:\dev\clientes\Bolivian Electric\apps\web\lib` (~27.700 líneas sin tests).

### 2.1 Se copia/parametriza en minutos (plantilla)

| Pieza | Archivos | Qué hace |
|---|---|---|
| Plomería Chatwoot | `chatwoot-webhook.ts` (esqueleto), `chatwoot-read.ts`, `chatwoot-whatsapp-credentials.ts` | webhook entrante, anti-loop (`outgoing`), notas privadas vs respuesta pública por flag |
| Seguridad + dedupe | patrón replicado en BOT-ONIA: `webhook-security.mjs`, `message-dedup.mjs` | HMAC, idempotencia |
| Captura de lead | `lead-capture.ts` | no re-pregunta lo ya dicho (ciudad/producto/cantidad); los CAMPOS se parametrizan |
| Ruteo a vendedor | `seller-router.ts`, `seller-directory.ts` | round-robin por sucursal + sticky por cliente; el roster es dato, no código |
| Opt-in / opt-out | `opt-in-prompt.ts`, `opt-in-reply.ts`, `customer-unsubscribe.ts` | cumplimiento |
| IA acotada | `openai-client.ts` | transcripción de audios + respuesta libre filtrada por guardrails; nunca afirma stock/precio |
| Seguimientos | `follow-up-scheduler.ts`, `follow-up-note.ts`, cron `follow-ups` | +2/+5/+15 días, idempotente |
| Plantillas HSM | `whatsapp-templates.ts`, `chatwoot-template-send.ts`, `proactive-template-send.ts` | envío proactivo con plantilla aprobada |
| Alta de agentes | `chatwoot-agent-provisioning.ts`, `scripts/chatwoot/provision-agents.ts` | crea los agentes del cliente en Chatwoot por script |
| SLA + recordatorios | n8n `be-sla-reassign.json`, `be-reminders.json` | reasignación cada 2 min si el vendedor no responde |

### 2.2 Fue artesanal y NO se replica por defecto (se cotiza a medida)

| Pieza | Volumen | Por qué no es plantilla |
|---|---|---|
| Stack de catálogo completo: `product-matching` (IDF), `product-synonyms`, `product-attributes`, `product-label`, `product-description(+run)`, `product-search-terms`, `product-spec-match`, `be-catalog-adapter`, `availability-reply` (por ciudad), `match-benchmark(+cases)` | **~7.000+ líneas** | Existe porque BE tiene 12.385–18.000 SKUs con datos sucios (marcas contradictorias, export filtrado — ver `docs/product/bot-configuration-questionnaire.md` §11 del repo BE). Un comercio normal no lo necesita: con la lista corta de servicios/productos del intake alcanza |
| Textos y reglas aprobadas por gerencia | — | El bloqueante de BE hoy no es código: es la aprobación humana de los textos (`SEND_PUBLIC_REPLIES=false`) |
| Limpieza del ERP (TR4/SQL Server) | — | Mapeo de exports por cliente; solo para clientes con sistema propio |

### 2.3 La consecuencia de diseño (ya tomada, sostenerla)

**El motor del producto es BOT-ONIA** (`hermes-content/deploy/vps-ops/bot/`), no un fork de
BE. Ya está partido exactamente como lo necesita la línea de montaje (spec §7.1/§7.2,
visible en `bot/config.mjs`):

- **Fijo (no se toca por cliente):** máquina de estados, guardrail determinista, silencio
  ante humano, opt-in/opt-out, reserva CAS, bitácora, dedupe, seguridad del webhook.
- **Por cliente (un solo archivo de config):** identidad y tono, guion M0–M7, preguntas de
  calificación, horarios, destino del handoff, horario de atención.

BE demuestra el techo artesanal (catálogo grande) y aporta las piezas 2.1 que a BOT-ONIA le
faltan (seller-router multi-vendedor, plantillas HSM, SLA). El bot estándar de Bs 1.490/mes
es BOT-ONIA parametrizado; el catálogo estilo BE es el "a medida" que ya contempla el
pricing (`WHATSAPP_ADDON`: "Lo que no entre en el estándar se cotiza a medida").

---

## 3. El cerebro por cliente: siembra sin sesiones artesanales

La siembra es **llenar el config del motor con datos del intake**, no una sesión de
ingeniería. Campos mínimos que el formulario de intake (en construcción en carril
paralelo — coordinar contra esta lista) debe entregar para que el bot responda bien el
día uno. Fuentes: `bot/config.mjs` (qué consume el motor), cuestionario BE
(`docs/product/bot-configuration-questionnaire.md`) y
`docs/operations/datos-requeridos-chatbot.md` del repo BE.

| # | Campo del intake | A dónde va |
|---|---|---|
| 1 | Nombre comercial + rubro + qué vende en 1 frase | identidad del guion (M0) y disclosure |
| 2 | Ciudades/sucursales con dirección | FAQ "¿dónde están?" + ruteo por ciudad |
| 3 | Horario de atención (por sucursal) + qué pasa fuera de horario | guardia horaria del motor + mensaje fuera de horario |
| 4 | Top 10–20 servicios/productos, 1 línea c/u (catálogo completo = a medida) | base de respuestas "¿tienen X?" |
| 5 | Política de precios: ¿el bot da precios? ¿cuáles sí? (lista si sí) | guardrail — default: nunca inventa, deriva |
| 6 | Top 10 FAQs con respuesta APROBADA (pagos, factura, envíos, promos, compra mínima) | respuestas fijas (no pasan por LLM) |
| 7 | Datos a capturar antes del handoff (nombre, ciudad, producto, cantidad, urgencia…) | `lead-capture` parametrizado |
| 8 | A quién deriva: nombres + WhatsApp/correo de vendedores, SLA esperado, quién fuera de horario | `seller-router` + agentes Chatwoot + SLA n8n |
| 9 | Tono (usted/vos), emojis sí/no, nombre del bot, saludo | guion |
| 10 | Temas que SIEMPRE van a humano + lo que el bot nunca debe decir | guardrails |
| 11 | Agenda (si aplica): 2+ bloques fijos de cita o link Cal.com | slots del motor (sin esto el bot no agenda — regla dura del config) |
| 12 | **Meta:** número a conectar, si ya usa WhatsApp/WhatsApp Business en ese número, y acceso al Facebook del dueño del negocio | Embedded Signup (§1.1) |

Regla de honestidad heredada del motor: **campo vacío = el bot NO improvisa** (como
`slots_sin_definir` en `config.mjs`). Un intake incompleto produce un bot que deriva más,
no un bot que inventa.

---

## 4. La línea completa, con tiempos

Tiempos = trabajo NUESTRO (calendario entre paréntesis cuando difiere).
**[Toda esta tabla es estimación propia**, anclada en: las 2 altas manuales ya ejecutadas,
los 8 pasos documentados del popup de Meta, y el estado actual del código (§2). Se ajusta con
el cronómetro real del primer cliente.]

| Paso | HOY | OBJETIVO (con §5 construido) |
|---|---|---|
| 1. Contrato firmado → alta interna (org en la plataforma, inbox Chatwoot, agentes del cliente) | 30–60 min a mano | **15 min** (script de alta) |
| 2. Conexión Meta | 45–90 min manual, nuestra WABA (§1.2) | **5 min nuestro** + 15 min del cliente (Embedded Signup §1.1) |
| 3. Siembra del cerebro | 1–2 h leyendo el intake y editando config a mano | **30 min**: generador intake→config + revisión humana de los textos |
| 4. Prueba | 1–2 h artesanal (simular conversaciones, corregir) | **30 min**: bench de humo por rubro (`bench.mjs` ya existe en el motor) + 1 conversación real punta a punta MIRADA |
| 5. Vivo + handoff al cliente (mini-guía + método de pago Meta cargado) | 30–60 min | **15 min** |
| **Total** | **~4–6 h nuestro; 2–4 días calendario** (los días los comen: textos sin aprobar, datos que faltan, trámites del número) | **~1,5–2 h nuestro; 1 día calendario** |

¿Se puede en 2 horas de trabajo nuestro? **Sí, con las 3 piezas de §5 construidas y un
intake completo.** ¿En 1 día calendario? Sí, si el cliente hace su parte el mismo día
(popup de Meta + aprobar sus textos). Lo honesto: el primer cuello real no es técnico, es
**textos aprobados por el dueño** — por eso el intake pide respuestas YA aprobadas (§3.6),
no borradores.

Restricción de volumen: hasta tener App Review aprobado, máx. 10 onboardings/semana
(cupo default de Meta, §1.1) — sobra para el arranque.

---

## 5. Qué falta construir (poco), por impacto

1. **Encender Embedded Signup en Chatwoot** — *destraba la conexión en minutos y la WABA
   propia del cliente antes del 1-oct.* (a) presentar App Review de los 2 permisos con sus
   2 screencasts (guion listo en `historial/ONIA_META_WHATSAPP_CLIENTES_20260808.md` §2 —
   **verificar primero si ya se presentó**); (b) Access Verification; (c) crear la
   configuración de Facebook Login for Business y setear las 3 env vars; (d) **probar el
   flujo completo con un número real y MIRARLO** (riesgo self-hosted §1.1).
   Trabajo nuestro: ~1 día. Espera de Meta: 1–7 días. Código: cero.

2. **Plantilla de bot por cliente sobre BOT-ONIA + script de alta** — *convierte el alta en
   un comando.* Un `config-<cliente>.mjs` generado desde plantilla por rubro + script que
   crea inbox/webhook/agentes en Chatwoot (reusar `provision-agents.ts` de BE) y registra
   el workflow n8n de SLA. Trabajo: ~2–3 días. Incorporar de BE: seller-router y plantillas
   HSM (someter a Meta 3–4 plantillas base POR RUBRO una sola vez, no por cliente).

3. **Siembra automática desde el intake** — *elimina la sesión artesanal.* Mapper
   intake→config (tabla §3) + bench de humo por rubro que corre las 10 FAQs y la
   calificación antes de encender. Trabajo: ~1–2 días. **Coordinar el contrato de campos
   con el carril del formulario de intake (§3 es la lista mínima).**

Después de eso (no ahora): bandeja dentro de Onia Platform (decisión A→B ya tomada en
`historial/ONIA_PLATAFORMA_CANALES_Y_CONTENIDO_20260808.md` — el historial del cliente
vive en Chatwoot mientras tanto) y guardar `Conversation`/`Message` en el producto.

---

## Fuentes

- Chatwoot Embedded Signup (self-hosted, env vars): <https://developers.chatwoot.com/self-hosted/configuration/features/integrations/whatsapp-embedded-signup>
- Chatwoot Embedded Signup (guía de usuario, flujo): <https://www.chatwoot.com/hc/user-guide/articles/1752129193-how-to-use-whatsapp-embedded-signup>
- Chatwoot WhatsApp canal manual: <https://www.chatwoot.com/hc/user-guide/articles/1677832735-how-to-setup-a-whats_app-channel>
- Fallas conocidas self-hosted: <https://github.com/orgs/chatwoot/discussions/13899> · <https://github.com/chatwoot/chatwoot/issues/13154>
- Meta pricing (corte 1-oct-2026): <https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages>
- Meta Access Verification: <https://developers.facebook.com/docs/development/release/access-verification>
- Internos: `historial/ONIA_META_WHATSAPP_CLIENTES_20260808.md` (runbook Tech Provider completo) · `historial/ONIA_PRICING_CHATBOT_20260815.md` (inventario de los 4 bots + costo por conversación) · `historial/ONIA_PLATAFORMA_CANALES_Y_CONTENIDO_20260808.md` (decisión Chatwoot A→B) · repo BE `docs/product/bot-configuration-questionnaire.md` y `docs/operations/datos-requeridos-chatbot.md`

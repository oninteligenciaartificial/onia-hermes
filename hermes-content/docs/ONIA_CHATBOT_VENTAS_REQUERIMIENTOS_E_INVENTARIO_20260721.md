# ONIA — Chatbot de ventas WhatsApp: Requerimientos (prospecto AirPods) + Inventario de lo construido

Fecha: 2026-07-21
Estado: requerimientos + inventario (NO se construye nada en esta sesión).
Origen: mensaje de un prospecto (vende AirPods Pro 3 por mayor y menor) reenviado por Sergio.

---

## 0. Qué pidió el prospecto (mensaje textual, sin interpretar)

> "Vendo audífonos AirPods Pro 3 por mayor y menor. Quiero que responda, que agende
> pedidos, que se encargue de hablar con los clientes, que pase mi QR, corrobore los
> comprobantes y agende pedidos, que calcule los costos del delivery, etc. Mensajes al
> día: depende."

Traducido a capacidades:

1. Responder solo por WhatsApp (atención 24/7).
2. Hablar con los clientes (conversar, no solo FAQ).
3. Agendar / registrar pedidos.
4. Pasar su QR de pago.
5. Corroborar los comprobantes de pago (screenshots de transferencia).
6. Calcular el costo del delivery.
7. Volumen variable ("depende") → sin dato de conversaciones/mes.

Contexto de negocio: **venta por mayor Y menor** → implica **dos listas de precio** (público
vs. mayorista) y **cantidad mínima** para mayoreo. Esto es clave (ver §2 y §3).

---

## 1. Veredicto en una línea

El 60-70% de esto **ya lo tenemos** como diseño + código reutilizable (arquitectura de bot
multi-marca, toma de pedidos por WhatsApp con recálculo server-side, QR BNB codificado,
esquema de datos de catálogo con precio público/profesional). Los **tres gaps reales** a
construir son: **verificar comprobantes** (no existe), **calcular delivery por zona** (no
existe, hoy se difiere a humano) y **activar el QR** (código dormido, faltan credenciales).
El **bloqueo #1** no es técnico: es la **verificación Meta + número/WABA** para que WhatsApp
responda automático.

---

## 2. Requerimientos del chatbot AirPods (funcionales)

Leyenda de estado ONIA: ✅ existe y reusable · 🟡 parcial / hay base · 🔴 hay que construir · ⛔ bloqueo externo.

| # | Requerimiento | Estado ONIA | De dónde sale / qué falta |
|---|---|---|---|
| R1 | Responder automático en WhatsApp 24/7 | 🟡 + ⛔ | Arquitectura y plomería existen (repo Bolivian Electric, portable). Falta portarla a esta infra + **verificación Meta y número/WABA** (⛔ bloqueo #1). |
| R2 | Conversar con el cliente (persona de venta que da precios) | ✅ | Persona "asistente de venta que SÍ da precios" ya definida (Nuvia). Patrón LLM con contexto + guardrails en `assistant/route.ts`. |
| R3 | Catálogo con precio **público y mayorista** | ✅ | El esquema de producto de Nuvia ya tiene `tipoVenta: "publico" \| "profesional"` + `precioValor`. Se reusa tal cual para "por mayor y menor". |
| R4 | Agendar / registrar pedidos | ✅ | `nuvia-commerce.ts` + `nuvia-order.ts`: valida, **recalcula totales server-side**, persiste orden+items en Supabase (multi-tenant por `store_id`), arma mensaje WhatsApp. Es exactamente "agendar pedido". |
| R5 | Pasar el QR de pago | 🟡 | `createBnbQrPayment()` (BNB QR Simple) **codificado pero dormido**: falta credenciales BNB + engancharlo al checkout. Alternativa rápida: **QR estático del cliente** (imagen) enviado por el bot, sin pasarela. |
| R6 | Corroborar comprobantes de pago | 🔴 | **No existe** (ni OCR, ni upload, ni verificación). Hay que construirlo. Columna `payments.verified_at` existe como placeholder pero nada la escribe. |
| R7 | Calcular costo de delivery | 🔴 | **No existe por diseño** (hoy Nuvia dice "se coordina al despachar"). Hay que construir tabla **zona → tarifa** + lógica que sume el envío al total. |
| R8 | Derivar a humano cuando hace falta | ✅ | Patrón "bot califica, vendedor cierra" + inbox por marca en Chatwoot. |
| R9 | Registrar todo (leads/órdenes/pagos) | ✅ | Esquema Supabase `web_factory`: `orders`, `order_items`, `payments`, `payment_events`. Aislado por `store_id`. |

### Prioridad sugerida (para acotar alcance)
- **MVP vendible ya:** R2, R3, R4, R5 (con QR **estático**), R8, R9. Responde, cataloga
  público/mayor, toma el pedido, manda el QR del cliente, deriva y registra.
- **Fase 2 (los gaps que suben el precio):** R6 (verificar comprobante) y R7 (delivery por
  zona) + R5 con **QR dinámico BNB**.
- **Gate transversal:** R1 (Meta/WABA) destraba que sea automático de verdad.

---

## 3. Datos que faltan del cliente (NO fabricar — pedir en el intake)

Sin estos no se puede cerrar alcance ni precio con honestidad:

1. **Catálogo real:** ¿solo AirPods Pro 3 o más productos/modelos? ¿SKUs, fotos, stock?
2. **Precios:** lista **menor** (público) y lista **mayor** (mayorista) + **cantidad mínima**
   para precio mayorista.
3. **Delivery:** ¿qué ciudades/zonas cubre y **cuánto cobra por cada zona**? ¿O envío por
   courier con tarifa variable? (define si R7 es tabla fija o cotización manual).
4. **Pago:** ¿QR de qué banco? ¿Quiere **QR estático** (imagen fija) o **QR dinámico** por
   monto? ¿Acepta también transferencia / Tigo Money?
5. **Comprobante:** ¿cómo quiere validarlo? (a) el bot solo lo **recibe y avisa** y una
   persona confirma, o (b) verificación **automática** (más caro; requiere construir).
6. **WhatsApp:** ¿tiene número dedicado y cuenta WhatsApp Business? ¿NIT propio? (define si
   el WABA va bajo Meta de ONIA o del cliente).
7. **Volumen real:** conversaciones/día aprox. (impacta costo Meta y de créditos IA, que
   **paga el cliente**, nunca van en nuestro precio).

---

## 4. Inventario: TODO lo que ONIA ha hecho sobre chatbots

Leyenda: **VIVO** = corre en prod · **CÓDIGO** = construido en este repo · **DISEÑO** = documento/contrato · **EXTERNO** = construido en el repo del cliente Bolivian Electric.

### 4.1 Arquitectura y estrategia (DISEÑO, listo para ejecutar)
- `web-factory/WEB_FACTORY_CHATBOT_MULTITENANT_ARCHITECTURE.md` — **un motor de bot para N
  marcas, aislado por `store_id`/`slug`**. Flujo: Meta Cloud API → inbox Chatwoot por marca →
  webhook `/api/<x>/chatwoot/webhook` → carga solo la config de esa marca → responde y guarda
  con `store_id`. Regla dura: **un número = una identidad**. Incluye checklist de "alta de
  marca nueva". Compara persona **Nuvia** (asistente de venta, da precios) vs **Bolivian
  Electric** (calificador de leads, no da precios).
- `web-factory/NUVIA_ROUTINES_HUB_SPEC.md` — **una sola fuente de verdad (`nuvia.json`) que
  usan la web y el bot**. Modela rutinas/consejos ligados a productos reales. Patrón directo
  para un catálogo que el bot lee sin duplicar datos.
- `onia-core/contract.json` — canal de intake `whatsapp_chatwoot` con `external_gate`:
  las integraciones (WhatsApp, formularios) viven **fuera del core**, entran como intake
  normalizado. Capability `whatsapp` = fase 5, `blockedUntil` Meta validado.
- `onia-core/modules/automation.*` — motor de reglas "cuando pasa X → hacer Y" + plantillas +
  máquina de estados de envío. **Modela y registra; el envío real es external_gate.**

### 4.2 Toma de pedidos + pago (CÓDIGO, en este repo — la base más valiosa)
- `web-factory/apps/site/src/lib/nuvia-commerce.ts` + `nuvia-order.ts` — **checkout real por
  WhatsApp**: valida input, **recalcula totales desde datos confiables del producto** (no
  confía en el cliente), aplica descuentos del catálogo, persiste en Supabase y arma el
  mensaje de WhatsApp prellenado. Degradación elegante si Supabase cae. **Esto es "agendar
  pedidos" ya construido.**
- `createBnbQrPayment()` (en `nuvia-commerce.ts`) — **BNB QR Simple** (auth + getQRWithImage,
  devuelve imagen QR + payload + expiración 15 min). **Dormido**: falta credenciales y
  engancharlo al checkout.
- Esquema Supabase `supabase/migrations/20260620_web_factory_nuvia_payments.sql`:
  `orders`, `order_items`, `payment_providers` (bnb_qr_simple / yape_manual /
  bank_transfer_manual sembrados), `payments` (con `qr_payload`, `qr_image_url`,
  `verified_at` placeholder), `payment_events`, vista `pending_payment_checks`. Todo por
  `store_id` con RLS.
- `web-factory/data/clients/nuvia.json` — **esquema de cliente**: `productos[]` con
  `precioValor`, `moneda`, `tipoVenta` (publico/profesional), `descuentoPorcentaje`,
  categorías, `contacto.whatsapp`, `merchandising` (packs/promos), `contenido` (lo que lee el
  bot). Plantilla directa para el catálogo de AirPods.
- `web-factory/INTAKE_CLIENTE.md` — formulario de levantamiento; su **Sección 8 (interna)**
  ya define cobro (QR Simple / transferencia), flujo n8n `pago→orden→mensaje` (add-on N3) y
  **chatbot IA que responde/califica** (add-on).

### 4.3 Runtime conversacional (CÓDIGO / VIVO)
- **Jarvis** — `web-factory/apps/site/src/app/api/onia-center/assistant/route.ts` +
  `AssistantChatPanel.tsx`: chat IA **interno** del equipo, contexto filtrado por rol +
  guardrails duros. Patrón LLM reusable (no atiende clientes).
- **Hermes** — `scripts/hermes_command_center.py`: control-plane por **Telegram para Sergio**
  (comandos, no clientes). Nota en el propio código: "WhatsApp automático sigue bloqueado
  hasta verificación Meta".

### 4.4 Automatización de leads (VIVO en n8n — patrón "borrador → aprobación")
- `onia-nuevo-lead.workflow.js` (n8n `WA6VkNu5OHo6Npem`, **VIVO webhook**) — inbound
  (formulario/WhatsApp/Hermes) → califica + **redacta la primera respuesta con LiteLLM** →
  deja **borrador** en `review_queue` + avisa a Sergio. **No envía sin aprobación.** Es el
  esqueleto de "responder", pero hoy con humano en el medio.
- `onia-agente-vendedor` / `onia-prospeccion-diaria` — agentes **internos** cron → borrador →
  aprobación. **No leen ni contestan mensajes de clientes.**

### 4.5 Infra viva y plomería externa (reutilizable)
- **VIVO:** Chatwoot self-hosted (Easypanel `onia-chatbot`), n8n del VPS, LiteLLM gateway.
- **EXTERNO (repo `C:\dev\clientes\Bolivian Electric`, portable marca a marca):**
  `lib/chatwoot-webhook.ts` + `app/api/chatwoot/webhook`, `lib/seller-router.ts` /
  `seller-roster.ts` (sticky + round-robin), `lib/lead-scoring.ts`, `lib/openai-client.ts`
  (transcripción de notas de voz), workflow `BE - Chatwoot WhatsApp Intake`. **Es la única
  plomería que ya lee inbound de WhatsApp y responde** — vive fuera de este repo.
- Runbooks (repo BE): activación WhatsApp paso a paso, verificación de negocio Meta,
  decisión de coexistencia de número.

### 4.6 Oferta comercial ya definida (para cotizar — la propuesta real va por el generador)
> Anclas internas. La propuesta al cliente se genera SIEMPRE con
> `hermes-content/propuestas/generador/` (nunca HTML a mano) y con la advertencia "sujeto a
> validación Meta".

- **Escalera de chatbot más elaborada** (precedente `aw-climatizacion-chatbot`), en Bs:
  - Bot Básico (responde FAQ 24/7): **1.900**
  - Bot Calificador ⭐ (responde + califica + deriva): **desde 3.200**
  - Bot + Agenda (lo anterior + agenda/registro + reportes): **desde 4.800**
  - Operación/mejora mensual del bot: **150–530/mes**
- **Add-on estándar** en propuestas (bench/hsb/lia/aw): chatbot IA **setup 1.900 + 150/mes**.
- **Ancla de catálogo:** "Chatbot WhatsApp conversacional (+ Meta) **desde 990 setup /
  desde 99 mensual**".
- **Combo web + bot vigente de lanzamiento:** Web Pro **1.500** + chatbot **1.900** =
  **3.400 setup + 150/mes** (+ Cuidado Web opcional 190–690/mes).
- **Terceros que paga el cliente (nunca en nuestro precio):** número, cuenta WhatsApp
  Business, créditos IA, mensajería Meta por conversación, pasarela.

---

## 5. Mapeo requerimiento → activo ONIA (qué reuso, qué construyo)

| Requerimiento | Reuso directo | Construir |
|---|---|---|
| Responder / conversar (R1, R2) | Plomería BE (chatwoot-webhook, LLM) + persona Nuvia | Portar a esta infra + config de marca AirPods |
| Catálogo mayor/menor (R3) | Esquema `nuvia.json` (`tipoVenta`) | Cargar `airpods.json` con datos reales |
| Agendar pedido (R4) | `nuvia-commerce.ts` / `nuvia-order.ts` + Supabase | Nada (reuso) — solo conectar al bot |
| Pasar QR (R5) | `createBnbQrPayment()` o QR estático | Credenciales BNB + enganche (o subir imagen QR) |
| Verificar comprobante (R6) | — | **Nuevo:** upload + (OCR o revisión) + escribir `verified_at` |
| Delivery por zona (R7) | Campos `delivery_city`/`zone` ya existen | **Nuevo:** tabla zona→tarifa + sumar al total |
| Derivar + registrar (R8, R9) | Chatwoot inbox + esquema `orders`/`payments` | Nada (reuso) |

---

## 6. Bloqueos reales

1. ⛔ **Meta / WABA / número** — para que el bot responda automático hace falta WhatsApp
   Cloud API con un WABA verificado y un número dedicado. Puede ir bajo el Meta de ONIA o,
   mejor si el cliente tiene NIT, **bajo el Meta del cliente** ("el activo es del cliente").
   La verificación de negocio de ONIA está en pausa esperando SEPREC; si el cliente pone su
   propio WABA/número, ese bloqueo se sortea por su lado.
2. **Política ONIA "nada se envía sin aprobación"** — aplica a los agentes internos de ONIA.
   Para el bot **de un cliente vendiendo su producto**, el cliente decide el auto-envío; aun
   así conviene diseñar R6 (comprobante) con **confirmación humana del cliente** salvo que
   pague la verificación automática.
3. **QR dinámico** requiere credenciales BNB del cliente; el **QR estático** no y sirve para
   el MVP.

---

## 7. Próximos pasos (elige tú)

1. **Intake:** mandarle al prospecto las 7 preguntas de §3 (puedo redactar el mensaje).
2. **Cotizar:** generar la propuesta real con el sistema (`clientes.json` + generador),
   eligiendo nivel (Básico / Calificador / + Agenda) — decisión de precio tuya.
3. **Construir MVP:** carril nuevo (worktree propio) que porte la plomería BE + cargue el
   catálogo AirPods + QR estático. Los gaps R6/R7 quedan para fase 2.

> Nada de esto se ejecuta en esta sesión: este doc es el requerimiento + inventario para
> decidir. La construcción abre su propio carril.

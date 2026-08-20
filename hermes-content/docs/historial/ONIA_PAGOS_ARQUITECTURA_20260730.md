# Arquitectura de cobro de suscripción — Onia Platform

> **2026-07-30. NOTA DE DISEÑO. No se implementó nada.**
> Describe cómo debería quedar el cobro de la suscripción de Onia Platform
> **independiente del banco o proveedor que toque**, y marca la brecha exacta
> contra el código que existe hoy.
>
> Compañero: `ONIA_BCP_REUNION_20260805.md` (lo que hay que preguntarle al banco).
> Nada de acá se construye antes de saber las respuestas de esa reunión: la
> respuesta sobre webhook cambia el diseño, no solo el proveedor.

---

## 0. Resumen en 6 líneas

1. Hoy Onia **no puede cobrar su propia suscripción de forma automática**: el
   usuario paga a un QR estático y sube una captura, y un humano (o n8n) aprueba.
2. Sí existe una abstracción de pasarela (`lib/gateway.ts`) — pero está pensada
   para que **el tenant le cobre a sus clientes**, no para que Onia le cobre al tenant.
3. Son **dos planos distintos** que comparten adaptadores. Hoy solo existe uno.
4. Para aceptar BCP (o cualquier banco nuevo) hay **5 puntos de código** que tocar,
   porque no hay registro de proveedores: hay `switch`, enums de Prisma y una ruta
   de webhook por proveedor.
5. Lo que falta de verdad no es "el proveedor BCP": es la entidad **suscripción con
   máquina de estados**, el **cargo con referencia propia**, y el **enganche idempotente
   entre pago acreditado y alta del tenant**.
6. El diseño tiene que funcionar **también sin webhook** (escenario (c) de la reunión),
   porque si no, el producto promete algo que el banco puede no dar.

---

## 1. Alcance: los dos planos de cobro

No mezclar. Son dos productos distintos que casualmente hablan con bancos parecidos.

| | **Plano A — Onia cobra su suscripción** | **Plano B — el tenant cobra a sus clientes** |
|---|---|---|
| Quién cobra | Onia (una sola cuenta: la nuestra) | Cada clínica / empresa (su propia cuenta) |
| Quién paga | El cliente del SaaS (la clínica) | El paciente / cliente final |
| Cuántas credenciales | **Una** (la de Onia) | **Una por tenant** |
| Qué desbloquea el pago | **El acceso al producto** (alta / renovación) | Marcar una factura como pagada |
| Estado hoy | ❌ manual (QR estático + captura + aprobación) | ⚠️ construido para pagosnet/circle, sin credenciales reales |
| Riesgo si falla | El cliente pagó y no puede entrar → soporte y reembolso | Una factura queda pendiente → se corrige a mano |
| **Es lo que se discute el 5-ago** | ✅ sí | Secundario (pero comparte adaptador) |

**Regla de diseño:** los adaptadores de proveedor se comparten; lo que cambia es
**de dónde salen las credenciales** (config de plataforma vs. config por tenant) y
**qué efecto tiene el pago acreditado** (entitlement vs. factura pagada).

> Nota comercial ya decidida y que NO cambia acá: para el Plano B, la cuenta y el
> contrato bancario son **del cliente, no de Onia**
> (`hermes-content/propuestas/BCP_PASARELA_CREDENCIALES_INTERNO.md`). Lo que se
> decide en la reunión es si el **Plano A** puede ser una sola cuenta de Onia
> — ver escenarios en el doc de la reunión.

---

## 2. Estado actual verificado (código leído, no supuesto)

Todo lo de esta sección está verificado leyendo el repo
`C:\dev\proyectos\DentaGest\dental-saas` el 2026-07-30.

### 2.1 La abstracción de proveedor que existe

`lib/gateway.ts` — contrato actual, completo:

```ts
interface GatewayCredentials { apiKey; merchantId|null; accountId|null; environment; gatewayType }
interface PaymentRequest    { amount; currency?; description; invoiceId; customerName; customerEmail? }
interface PaymentResult     { success; transactionId?; redirectUrl?; error? }

getGatewayConfig(organizationId)                              // config activa del tenant
processPayment(organizationId, req)                           // switch { pagosnet | circle }
testGatewayConnection(gatewayType, apiKey, merchantId, env)   // switch { pagosnet | circle }
```

Dos implementaciones privadas por proveedor (`processPagosNet` / `processCircle`,
`testPagosNet` / `testCircle`), cada una con su URL base `{sandbox, production}`
hardcodeada en el módulo.

### 2.2 Persistencia

`prisma/schema.prisma:820` — modelo `GatewayConfig`:
`organizationId`, `gatewayType`, `apiKeyEnc` (AES-256-GCM), `merchantId?`,
`accountId?`, `environment`, `isActive`, `lastTestedAt`, `lastTestOk`.
`@@unique([organizationId, gatewayType])`.

Enums Prisma: `GatewayType { pagosnet, circle }` · `GatewayEnv { sandbox, production }`.

### 2.3 Webhooks (lo mejor que hay hoy)

`app/api/webhooks/[tenantId]/pagosnet/route.ts` y `.../circle/route.ts`.
El de pagosnet hace, en este orden:

1. Busca la `gatewayConfig` del tenant por la ruta `[tenantId]`.
2. Verifica firma **HMAC-SHA256 sobre el body crudo**, header `x-pagosnet-signature`,
   comparación con `timingSafeEqual`. **El secreto de firma es la misma `apiKey`** del tenant.
3. Filtra por `event === "payment.completed" && status === "approved"`.
4. Dentro de una transacción: `pg_advisory_xact_lock` sobre
   `payment-webhook:{tenantId}:{provider}:{transaction_id}`, busca un `Payment` previo
   con el mismo `reference`, bloquea la factura con `SELECT ... FOR UPDATE`, reconcilia
   montos (`lib/payment-validation.ts`) y marca `PAGADA` solo si los pagos cubren el total.

**Esto está bien hecho y es la base a reusar.** Es idempotente por lock + búsqueda previa.

### 2.4 Cómo se cobra HOY la suscripción de Onia (el Plano A)

Es manual de punta a punta:

- `components/billing/QRPaymentModal.tsx` muestra **una imagen estática**:
  `/assets/qr-payment.png`. No se genera un QR por cobro; es el mismo QR para todos.
- El usuario paga por su banca, saca captura, y la sube junto con nombre, CI,
  teléfono, banco de origen y nro. de referencia **tipeados a mano**.
- `POST /api/subscription-payment` crea un `SubscriptionPayment` en estado `PENDING`
  (`prisma/schema.prisma:931`) con `receiptUrl`, `bankName`, `transactionRef`.
- La UI dice literalmente: *"Tu pago esta siendo verificado. Tu plan se activara en
  las proximas horas."*
- El alta ocurre en **uno de dos caminos**, ambos escriben lo mismo:
  - `PATCH /api/admin/subscription-payments` (SUPERADMIN aprueba a mano), o
  - `POST /api/n8n/callback/subscription-approve` con `autoApprove:true`
    (n8n, autenticado por `X-N8N-API-KEY`), que valida el monto contra el catálogo
    (`lib/subscription-payment-validation.ts`) y recién ahí aprueba.
- El efecto del alta es, en ambos casos, exactamente esto:

```ts
organization.update({ plan: payment.plan,
  planEnd: +1 mes (o +12 si cycle === "annual") })
```

Precios autoritativos: `lib/subscription-plans.ts` — Bs **320 / 750 / 1500 / 2900**
mensual, anual = 10× el mensual, con override por env `SUBSCRIPTION_PRICE_<PLAN>_<CYCLE>`.

### 2.5 Lo que esto significa

- **No hay reconciliación bancaria en el Plano A.** Nadie verifica contra el banco que
  el pago existió: se confía en una captura de pantalla y en que el monto coincida con
  el catálogo. Una captura editada pasa el filtro de `autoApprove`.
- **El identificador del pago lo tipea el usuario** (`transactionRef`). No hay forma
  automática de saber quién pagó.
- **No existe entidad "suscripción".** Existe `organization.plan` + `organization.planEnd`
  (dos campos) y un historial de comprobantes. No hay estados, ni vencimiento gestionado,
  ni suspensión, ni reintentos.

---

## 3. Diseño objetivo

### 3.1 Principio: capacidades declaradas, no proveedores hardcodeados

El error a evitar es escribir "el proveedor BCP" con el flujo de BCP incrustado. Lo que
cambia entre bancos no es solo la URL: es **si hay webhook o no**, **si hay recurrencia
o no**, **si el instrumento es QR, redirect o token de tarjeta**. Eso se declara.

```ts
type ProviderCapabilities = {
  instruments: ("qr" | "redirect" | "card_token" | "transfer")[];
  webhook: "signed" | "unsigned" | "none";   // ← la respuesta que define el producto
  polling: boolean;                          // ¿hay consulta de estado?
  recurring: "native" | "token" | "none";    // ¿débito automático?
  refunds: boolean;
  externalRefField: string | null;           // ¿podemos mandar NUESTRO id y que vuelva?
  environments: ("sandbox" | "production")[];
};
```

La UI y el motor de suscripción **leen las capacidades** y se comportan distinto:
sin `webhook`, el producto no promete alta instantánea; sin `recurring`, el producto
genera un cobro nuevo cada mes y lo avisa.

### 3.2 Interfaz de proveedor (reemplaza el `switch`)

```ts
interface PaymentProvider {
  id: string;                       // "pagosnet" | "circle" | "bcp_qr" | ...
  capabilities: ProviderCapabilities;

  createCharge(ctx, req: ChargeRequest): Promise<ChargeResult>;
  getCharge(ctx, providerChargeId): Promise<ChargeStatus>;      // para polling/conciliación
  verifyWebhook(ctx, rawBody, headers): WebhookVerification;    // firma + anti-replay
  parseWebhook(rawBody): NormalizedEvent;
  testConnection(ctx): Promise<{ ok; message }>;
  refund?(ctx, providerChargeId, amount): Promise<RefundResult>;
}
```

`ChargeResult` tiene que poder representar **un QR**, no solo un redirect:

```ts
type ChargeResult = {
  providerChargeId: string;
  status: "pending" | "paid" | "failed";
  redirectUrl?: string;
  qr?: { payload: string; imageDataUrl?: string };  // EMVCo / lo que devuelva el banco
  expiresAt?: Date;
  raw: unknown;                                     // respuesta cruda, para auditoría
};
```

`NormalizedEvent` es lo único que ve el motor de suscripción:

```ts
type NormalizedEvent = {
  providerEventId: string;   // id del EVENTO (para dedupe), distinto del id del cargo
  providerChargeId: string;
  externalRef: string | null; // NUESTRO id, si el banco lo devuelve
  type: "charge.paid" | "charge.failed" | "charge.expired" | "charge.refunded" | "unknown";
  amount: number; currency: string;
  occurredAt: Date;
};
```

Registro en un solo lugar (`lib/payments/registry.ts`), no `switch` repartido:

```ts
export const PROVIDERS: Record<string, PaymentProvider> = { pagosnet, circle, bcpQr };
```

### 3.3 Contexto de credenciales: plataforma vs. tenant

```ts
type ProviderContext =
  | { scope: "platform" }                       // cuenta de Onia — Plano A
  | { scope: "tenant"; organizationId: string }; // cuenta del cliente — Plano B
```

Una sola función `resolveCredentials(ctx, providerId)` decide de dónde salen. Para
`scope: "platform"` las credenciales **no viven en `gateway_configs`** (que está
scopeado por `organizationId`) sino en configuración de plataforma cifrada, con
rotación y sin exponerse jamás en ninguna API de tenant.

### 3.4 Datos: 4 tablas, no 2 campos

```
subscriptions          id, organizationId, plan, cycle, status, currentPeriodEnd,
                       graceUntil, providerId, providerSubscriptionId?, cancelAtPeriodEnd

subscription_charges   id, subscriptionId, organizationId, externalRef (UNIQUE),
                       providerId, providerChargeId, amount, currency, status,
                       instrument, qrPayload?, expiresAt, createdAt, paidAt

payment_events         id, providerId, providerEventId, UNIQUE(providerId, providerEventId),
                       payloadEnc, signatureOk, receivedAt, processedAt, result

entitlement_log        id, organizationId, subscriptionId, chargeId, action, appliedAt
```

Tres cosas no negociables:

- **`externalRef` lo generamos nosotros** (ej. `onia_sub_<subscriptionId>_<periodo>`), se le
  manda al banco al crear el cobro y **tiene que volver** en la notificación. Si el banco no
  soporta un campo así, ese es un problema de producto, no un detalle — está en la lista de
  preguntas de la reunión.
- **`UNIQUE(providerId, providerEventId)`** es la idempotencia real. El advisory lock que
  hoy usa el webhook de pagosnet es correcto, pero se apoya en una comparación de
  `notes: "PagosNet webhook"` como parte de la clave de dedupe — eso es frágil. Con la
  restricción única en base, un webhook repetido **no puede** procesarse dos veces aunque
  llegue en paralelo desde dos instancias.
- **`entitlement_log`** deja rastro de por qué una organización tiene el plan que tiene.
  Hoy `organization.plan` se sobrescribe sin historial reconstruible.

### 3.5 Máquina de estados de la suscripción

```
                   ┌──────── pago acreditado ────────┐
                   │                                 ▼
  (alta) ──▶ PENDIENTE ──▶ PAGADA ──▶ ACTIVA ──▶ VENCIDA ──▶ SUSPENDIDA
                   │                     ▲           │            │
                   │                     └── renovación acreditada┘
                   ▼                                              ▼
              EXPIRADA (QR venció, nunca pagó)              CANCELADA
```

| Estado | Qué significa | Acceso al producto |
|---|---|---|
| `PENDIENTE` | cobro creado, esperando acreditación | ❌ (o trial, si aplica) |
| `PAGADA` | pago acreditado y verificado, alta en curso | ❌ transitorio (< 1s) |
| `ACTIVA` | `currentPeriodEnd > ahora` | ✅ |
| `VENCIDA` | pasó `currentPeriodEnd`, dentro del período de gracia | ✅ degradado + aviso |
| `SUSPENDIDA` | pasó `graceUntil` sin pagar | ❌ (datos intactos, no se borra nada) |
| `EXPIRADA` | el cobro venció sin pagarse | ❌ |
| `CANCELADA` | baja voluntaria | ✅ hasta `currentPeriodEnd` |

Reglas: **`PAGADA` → `ACTIVA` es automático y transaccional**; nunca queda un pago
acreditado sin alta. **`SUSPENDIDA` no borra datos** — la reactivación es un pago, no una
migración. El período de gracia debe existir aunque el banco liquide T+0, porque un webhook
puede perderse.

### 3.6 El flujo completo (escenario con webhook)

```
1. Cliente elige plan            → crea subscription PENDIENTE
2. createCharge(externalRef)     → guarda subscription_charge + QR/redirect
3. Cliente paga                  → (fuera de nuestro control)
4. Banco notifica webhook        → verifyWebhook: firma + timestamp (anti-replay)
5. INSERT payment_events         → si viola UNIQUE ⇒ duplicado ⇒ 200 OK y salir
6. Transacción única:
     - localizar charge por externalRef (o por providerChargeId)
     - validar monto y moneda contra el catálogo de precios
     - charge.status = paid
     - applyEntitlement(): subscription ACTIVA, currentPeriodEnd += ciclo
     - entitlement_log
7. Responder 200 rápido          → efectos secundarios (email, WhatsApp) fuera de la tx
8. Cliente entra                 → el front hace poll del estado de la suscripción
```

**Contrato de idempotencia, escrito como test que hay que poder correr:**
*el mismo evento entregado N veces, incluso en paralelo, produce exactamente un
`subscription_charge` en `paid`, un avance de `currentPeriodEnd`, y N respuestas 200.*

### 3.7 El flujo sin webhook (escenario (c) — hay que soportarlo)

Si el banco solo ofrece consulta:

- Un **reconciliador** corre cada N minutos, toma los `subscription_charges` en
  `pending` no vencidos, llama `getCharge()` y aplica **la misma** `applyEntitlement()`.
  Backoff: cada 15 s los primeros 2 min, cada minuto la primera hora, cada 15 min después.
- El front hace poll del estado de la suscripción mientras el modal está abierto.
- **El producto lo dice**: "tu acceso se activa en pocos minutos", no "al instante".
- Hay un botón de **confirmación manual** para soporte, que llama la misma función.

Que el camino con webhook y el camino con polling terminen en **la misma función
`applyEntitlement()`** es lo que hace que el escenario (c) sea un cambio de latencia y
no un rediseño.

### 3.8 Recurrencia

Tres implementaciones según lo que dé el banco:

| `capabilities.recurring` | Qué construimos |
|---|---|
| `native` | El banco debita; nosotros solo escuchamos eventos de renovación. |
| `token` | Guardamos un token (nunca el PAN) y disparamos el cobro cada ciclo. **Alcance PCI a evaluar.** |
| `none` | Cron genera un cobro nuevo antes del vencimiento, avisa por WhatsApp/email con el QR, y aplica gracia. Es lo más probable con QR. |

Con `none`, el trabajo real no es técnico sino de producto: **avisar a tiempo y cobrar sin
fricción**. Ese es el costo escondido del escenario QR-sin-recurrencia.

**Restricción normativa que el diseño debe respetar** (RD 079/2022 del BCB, art. 7 e): el
débito automático exige *"consentimiento y autorización expresa, la cual en todo momento
será renovable o **revocable** a solicitud del ordenante"*. Traducido a producto:
**la baja tiene que ser autoservicio y efectiva**, no un correo a soporte. Modelarlo desde
el principio con `cancelAtPeriodEnd` en la suscripción, no como un parche posterior.

### 3.8b Dos límites normativos más, que afectan precio y UI

- **No se puede cobrar un recargo por pagar con QR ni exigir monto mínimo.** El art. 36 d)
  y e) prohíbe al aceptante *"establecer recargos por pagos con IEP"* y *"montos mínimos de
  compras"*. La comisión de la pasarela, si existe, **se absorbe en el precio del plan** —
  no puede aparecer como línea extra en el checkout.
- **"QR sin comisión" no es una garantía normativa.** No hay norma que fije en cero la
  comisión al cobrador; lo que existe es la prohibición de cobrar por el estándar y la
  interoperabilidad (art. 7 x). El modelo de costos debe tolerar que aparezca una comisión.
  Detalle y fuentes: `ONIA_BCP_REUNION_20260805.md` §7.6.

### 3.9 Seguridad

- **Secreto de firma ≠ API key.** Hoy el webhook de pagosnet firma con la `apiKey` del
  tenant. Debe ser un campo aparte (`webhookSecretEnc`), rotable sin romper el cobro.
- **Anti-replay**: además de la firma, validar timestamp del evento con ventana (p. ej. 5 min).
- **Allowlist de IP** del banco a nivel de reverse proxy si el banco publica sus rangos.
- **Nunca loguear el payload crudo en claro** (trae CI, nombre, monto). `payloadEnc`, con retención.
- **Rotación de llaves** sin downtime: aceptar dos secretos válidos durante la ventana de rotación.
- La ruta de webhook **no puede depender de sesión** y debe responder 200 rápido; todo lo
  lento va a cola.

---

## 4. Brecha exacta contra el código de hoy

Ordenada por lo que cuesta, no por lo que suena importante.

| # | Brecha | Dónde | Por qué importa | Tamaño |
|---|---|---|---|---|
| G1 | **No existe entidad suscripción.** Solo `organization.plan` + `planEnd`. | `schema.prisma:11-30` | Sin estados no hay vencimiento, gracia ni suspensión. Es el corazón del producto self-serve. | **Grande** |
| G2 | **El alta del Plano A no está atada a un pago verificado.** Se confía en una captura. | `api/subscription-payment`, `api/n8n/callback/subscription-approve` | Hoy una captura editada con el monto correcto pasa `autoApprove`. | **Grande** |
| G3 | **No hay `externalRef` propio.** El identificador lo tipea el usuario (`transactionRef`). | `QRPaymentModal.tsx` | Sin id propio que vuelva en la notificación, no se sabe quién pagó. | **Grande** |
| G4 | **`PaymentResult` no modela QR.** Solo `redirectUrl`. | `lib/gateway.ts:24` | El QR estático de hoy existe justamente porque el contrato no sabe representar un QR dinámico. | Media |
| G5 | **El proveedor está hardcodeado en 5 lugares**, sin registro. | ver §5 | Cada banco nuevo toca enum de Prisma + migración + 2 `switch` + allowlist + ruta de webhook. | Media |
| G6 | **Credenciales solo por tenant.** `gateway_configs` está scopeado a `organizationId`. | `schema.prisma:820` | La cuenta de **Onia** no tiene dónde vivir. El Plano A no tiene modelo de credenciales. | Media |
| G7 | **`GatewayCredentials` solo tiene `apiKey`.** | `lib/gateway.ts:7` | Si BCP usa OAuth2 client_credentials, mTLS o certificados **[PREGUNTAR AL BANCO]**, no entra en el modelo. | Media |
| G8 | **Secreto de webhook = API key.** | `webhooks/[tenantId]/pagosnet/route.ts:31` | No se puede rotar la firma sin romper el cobro, ni al revés. | Chica |
| G9 | **Idempotencia sin restricción en base.** Advisory lock + match por `notes` string. | mismo archivo, línea 64-78 | Correcto pero frágil; falta `UNIQUE(providerId, providerEventId)`. | Chica |
| G10 | **No se persiste el evento crudo.** | — | Sin auditoría ni replay cuando el banco discute un pago. | Chica |
| G11 | **No hay reconciliador ni polling.** | — | Si se pierde un webhook, el cliente pagó y no entró, y nadie se entera. | Media |
| G12 | **No hay recurrencia de ningún tipo.** | — | El modelo de negocio es mensual. | Media |
| G13 | **No hay devoluciones.** | — | Cobro duplicado o baja anticipada = transferencia a mano. | Chica |

---

## 5. Qué toca exactamente agregar un proveedor hoy (para dimensionar G5)

Agregar `bcp` al código actual, sin refactor, obliga a tocar:

1. `prisma/schema.prisma:841` — `enum GatewayType { pagosnet, circle }` → **+ migración**.
2. `lib/gateway.ts:63` — `switch` de `processPayment`.
3. `lib/gateway.ts:81` — `switch` de `testGatewayConnection`.
4. `app/api/gateway-config/route.ts:66` — allowlist literal `["pagosnet","circle"]`.
5. `app/api/webhooks/[tenantId]/bcp/route.ts` — **archivo nuevo**, copia del de pagosnet.

Cinco puntos, uno de ellos una migración de base, y el webhook duplicado por copiar-pegar.
Con el registro de §3.2 queda en: un archivo de adaptador + una fila en `PROVIDERS` + una
ruta de webhook genérica `[provider]` que despacha por el registro.

**Ese refactor no depende del banco y se puede hacer antes del miércoles si sobra tiempo.**
Lo que sí depende del banco es todo lo demás.

---

## 6. Orden de construcción propuesto (post-reunión)

No arrancar hasta tener las respuestas; el orden está pensado para que cada paso sirva
en los tres escenarios.

- **Fase 0 — no depende del banco.** Registro de proveedores (§3.2), `ChargeResult` con QR
  (§3.4), `externalRef` propio, `UNIQUE(providerId, providerEventId)`, `payment_events`.
  Con esto el QR estático se puede cambiar por un QR por cobro apenas haya credenciales.
- **Fase 1 — entidad suscripción + `applyEntitlement()`** con la máquina de estados de §3.5,
  y migrar el camino manual actual (aprobación admin/n8n) para que llame **esa misma función**.
  Esto es lo que hace que el switch a automático sea un cambio de disparador, no un rediseño.
- **Fase 2 — adaptador del banco** con lo que la reunión haya definido: webhook firmado si
  existe, reconciliador si no.
- **Fase 3 — recurrencia y avisos** según `capabilities.recurring`.
- **Fase 4 — devoluciones y panel de conciliación.**

---

## 7. Riesgos que hay que mirar antes de escribir código

- **El fallback de tipo de cambio.** `onia-core/logic/fx.logic.mjs:31` cae en silencio a
  **6,96** si no le inyectan el TCO; el oficial al 29-jul-2026 es **11,89**
  (`ONIA_TIPOS_DE_CAMBIO_BOLIVIA_20260730.md`). Los precios de suscripción están en Bs, así
  que **no afecta el cobro directamente** — pero si en algún momento se cobra o factura en
  USD, esa ruta es de plata y falla silenciosa. Ver antes de tocar facturación.
- 🔴 **La factura de la suscripción puede ser prerrequisito del cobro, no una consecuencia.**
  El **art. 27.I de la RD 079/2022 del BCB** obliga a las entidades financieras a verificar,
  *previo a la prestación de servicios de cobro* por banca electrónica o móvil, que la
  empresa acredite **un Sistema Informático de Facturación autorizado por el SIN**. Si el
  banco lo aplica literalmente, **no hay pasarela hasta que la homologación SIAT esté
  hecha** (bloqueo S2, caduca 1-oct-2026). Eso reordena el plan: primero SIAT, después
  pasarela. Está como pregunta H7 en `ONIA_BCP_REUNION_20260805.md`.
- **`localhost` escribe en la base de producción** (`ONIA_PARQUEADO_20260730.md` §2). Probar
  un flujo de cobro con esa configuración es inaceptable: hay que aislar el entorno **antes**
  de la primera prueba de sandbox, no después.
- **31 commits sin llegar a `master`** en DentaGest; Vercel despliega `master`. Cualquier
  cosa que se construya acá tiene que resolver primero dónde vive.

---

Relacionado: `ONIA_BCP_REUNION_20260805.md` ·
`hermes-content/propuestas/BCP_PASARELA_CREDENCIALES_INTERNO.md` ·
`ONIA_PARQUEADO_20260730.md` · `onia-core/ONIA_COMPANY_BACKBONE_AND_SELF_SERVICE_2026.md`

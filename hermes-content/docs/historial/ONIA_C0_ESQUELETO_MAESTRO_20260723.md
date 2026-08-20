# ESQUELETO MAESTRO — Carril C0 · la una-app Onia (DentalGest evolucionado en su lugar)

> **Estado: ESTRUCTURA / SPEC — NO es build.** Se termina → STOP → Sergio / orquestador (Onia Core) aprueba → recién ahí C1–C7 construyen desde acá.
> **Repo de la app:** `C:\dev\proyectos\DentaGest\dental-saas` (evoluciona EN SU LUGAR; NO repo nuevo, NO SSO bridge, NO multi-dominio de producto).
> **Fuente de verdad del contrato:** `onia-core/contract.json` (vive en onia-hermes). La app **consume** la lógica ya portada; SIAT emitter y runtime de agentes = servicios externos (`external_gate`) que la app **llama**, nunca reescribe.
> **Documento que manda:** `hermes-content/docs/ONIA_ARRANQUE_UNA_APP_20260723.md` (supersede el modelo "Puerta + ONIA ID + SSO" del `ONIA_PLATAFORMA_UNICA_PLAN_MAESTRO_20260723.md`, que sigue vigente en foso / carriles / bloqueos).

### Decisiones canónicas que C0 CONGELA (todo carril usa estos nombres, sin variantes)

| Concepto | Nombre canónico congelado | Descartados |
|---|---|---|
| Rubro en la cuenta | `Organization.verticalTrackId String @default("dentagest-clinical")` | `verticalTrack`, `rubro` |
| Sockets país | `countryCode` `currencyCode` `taxIdType` `locale` | — |
| Entitlements (tabla) | `OrganizationEntitlement` | `Entitlement` |
| Namespace de feature | `vertical.*` · `module.*` · `addon.*` | `moduleId` plano |
| Capa nueva de plataforma (código) | `lib/platform/**` | `lib/entitlements.ts` suelto |
| Lógica de core ya portada | `lib/onia-core/**` (se reusa, no se mueve) | — |
| Contexto de sesión | `AccountContext` vía `getAccountContext()` (extiende `getTenantProfile`) | — |
| Mirror del contrato | `data/onia-core/vertical-packs.json` + `scripts/sync-onia-core.mjs` | editar el mirror a mano |

---

## 0. Punto de partida real (qué ya existe en DentalGest para reusar)

**Veredicto: el esqueleto de plataforma multi-tenant ya existe al ~75–80% y es sólido.** La una-app NO es construir plataforma: es **des-dentalizar tres puntos duros** (identidad de cuenta / vocabulario-nav / gating por rubro), **cablear** lo dormido (SIAT, agentes) y **encender** add-ons. Todo aditivo, nada de rebuild.

### 0.1 Lo que YA vive (reusar tal cual — verificado por lectura directa)

| Costura | Dónde vive hoy | Estado / qué le falta |
|---|---|---|
| **Tenant raíz** | `Organization` (`prisma/schema.prisma:11-75`) — `slug` único, `plan`, `nit`, `city`, `department`, trial/planEnd, add-ons booleanos | Multi-tenant OK; **falta `verticalTrackId` + sockets país** |
| **Aislamiento tenant** | `lib/onia-core/tenant-guard.ts` — `tenantWhere(orgId, where)` fuerza `organizationId` | **Excelente, reuso puro** |
| **Membership / identidad** | `Profile` (`schema.prisma:77-108`, `userId @unique:79`) + `getTenantProfile()` (`lib/auth.ts:46-73`) | Resuelve 1 user → 1 org; **falta exponer rubro + entitlements** |
| **Roles base** | `enum Role { SUPERADMIN, ADMIN, DOCTOR, STAFF }` (`schema.prisma:335-340`) | `DOCTOR` es dental (neutralizar) |
| **Roles finos** | `OniaCoreRoleAssignment` (`schema.prisma:220-238`) + matriz `ROLE_PERMISSIONS` (`lib/onia-core/roles.ts:28-34`) | `roleKey` string libre → **reuso; solo generalizar el set** |
| **Columna vertebral core (VIVA)** | `lib/onia-core/{work-items,collab,roles,onboarding,intake,schedule,saved-views,entity-scope,tenant-guard,bridge,clinical-balance,generators,demo-seed}.ts` + 10 tablas `OniaCore*` | work items, aprobaciones, comentarios, documentos, canales, partners, intake — **todo cableado a UI** |
| **Cola de acción** | `/pending` (`pending-client.tsx`) + `SavedViewSelector` | Genérica; **superficie del cliente para agentes** |
| **Wizard configurador** | `/setup` (7 preguntas, `lib/onia-core/onboarding.ts`) | Reusable; parametrizar por pack |
| **Consola platform-admin** | `/admin/**` (SUPERADMIN): orgs, usuarios, planes, pagos | **Ya es multi-org**; ahí se prenden entitlements a mano |
| **Cobro a mano** | `SubscriptionPayment` (comprobante QR → admin aprueba) | **No hay billing automático. Reuso puro.** |
| **Gating por plan** | `lib/plan-limits.ts` (`PLAN_LIMITS:44-105`) | Precursor de entitlements; se **envuelve**, no se tira |
| **Navegación** | `components/layout/navigation.ts:19-44` (hardcodeado dental); `filterNavItems` ignora el 2º arg `access` (`:52-53`) | El hook para gating **ya está reservado** |
| **Facturación** | bespoke `Invoice`/`InvoiceItem` **+ `OniaInvoicingInvoice` DORMIDO con TODOS los campos SIAT** (`schema:1176-1249`) | Migrar **solo** facturación al modelo core |
| **Emisor SIAT** | `hermes-content/integrations/siat/src/*.mjs` (~262 tests) | **Cero imports desde la app**; exponer como endpoint |
| **Callback fiscal** | `app/api/n8n/callback/invoice-status/route.ts` **ya existe** | Cierra el loop 901→validated sin polling |
| **Gateway agentes/Hermes** | `lib/onia-core/bridge.ts` + `api/onia-core/bridge/pending` | Read-only multi-tenant para onia-center |

### 0.2 Lo que FALTA — gap priorizado (el trabajo real de C1–C3)

| # | Falta | Por qué crítico | Ubicación |
|---|---|---|---|
| **P0** | `verticalTrackId` + sockets país en `Organization`; resolver "rubro activo" en `getAccountContext` | Pivote de TODA la generalización | `schema.prisma:11-75`, `lib/auth.ts:46-73` |
| **P0** | Parametrizar **vocabulario / roles / KPIs** por pack (leer `verticalPack` en vez de constantes `DENTAL_*`) | Hoy el intake/onboarding de otro rubro **falla por validación dura** | `work-items.ts:10-80`, `roles.ts:11-34`, `onboarding.ts:8-23` |
| **P0** | Tabla `OrganizationEntitlement` + resolver que absorbe los booleanos legacy | "add-ons encendibles por cuenta" (chatbot/web/agentes) | `schema.prisma:31-34`, `plan-limits.ts:44-105`, `navigation.ts:52-56` |
| **P1** | Neutralizar `Role.DOCTOR` + labels de nav dentales | Costura visible en cada pantalla no-dental | `schema.prisma:335-340`, `navigation.ts:19-44` |
| **P1** | Unificar los **dos** onboardings en un flujo registro→rubro→setup | Hoy se pisan; el registro no captura rubro | `register/route.ts:20-43`, `onboarding/page.tsx:8-12` |
| **P2** | Cablear módulos dormidos (`OniaInvoicing` para SIAT) | La facturación real corre sobre `Invoice` legacy | `schema:955-1443`, `/billing/**` |
| **P2** | Portar el módulo `agents` (9º del core) a este repo (3 tablas + lógica) | Es el add-on "agentes 24/7" | `onia-core/modules/agents.{json,logic.mjs}` |
| **P2** | Generadores por pack | Para que `/pending` sirva a comercio/servicios | `generators.ts:31-89` |

> **Corolario:** la "una-app" es una **capa fina** (`lib/platform/`: rubro + entitlements + pack-resolver) sobre un tenant que ya existe. Multi-org real queda como P1 diferible: el primer cliente y la venta dental **no lo necesitan**.

---

## 1. La una-app: mapa de rutas y módulos

**Convención de capa:** `core` (siempre on) · `module` (activable por pack o entitlement) · `addon` (entitlement por cuenta) · `external_gate` (servicio externo que la app llama).

### 1.1 Core del negocio (siempre on — genérico o generalizable trivial)
Panel `/dashboard` · Cockpit `/operations` · **Cola `/pending`** · Agenda `/agenda` · Clientes `/patients`→`/clients` · Catálogo `/treatments`→`/catalog` · Inventario `/inventory` · Reportes `/reports` · Equipo+roles `/team` · Canales `/communications` · Config `/settings` · Wizard `/setup` · Admin `/admin/**`. Todos EXISTEN (labels dentales a generalizar).

### 1.2 Fiscal Bolivia — el wedge (C2/D1)
Facturación fiscal `/billing` (módulo `OniaInvoicingInvoice`, DORMIDO→cablear) · Emisión SIAT (external_gate, listo) · Contador Pack `/accounting` (parcial).

### 1.3 Agentes 24/7 — el diferenciador demoable (C2/D2)
Gestión de agentes `/agents` (NUEVO, adoptar módulo) · Recall/Cobrador/Confirmador vía `/pending` (lógica EXISTE en `agents.logic.mjs`, sin cablear) · Runtime cron+LLM+envío (external_gate).

### 1.4 Add-ons — encendibles por cuenta (C3)
Chatbot WhatsApp IA `addon.chatbot` (external_gate) · Web/presencia (Web Factory, canal) · Agenda pública `/(public)/book` (EXISTE) · Recordatorios (external_gate).
> Botón click-to-chat = gratis en la web. Lo que se cobra es el chatbot IA (`addon.chatbot`).

### 1.5 Las costuras dentales a generalizar (con ubicación)
1. Vocabulario work items — `work-items.ts:10-22` `DENTAL_WORK_ITEM_TYPES` → `verticalPack.vocabulary.workItemTypes`.
2. Matriz de roles dental — `roles.ts:11` + `ROLE_PERMISSIONS:28-34` → mapa por `pack.roleKeys`.
3. Enum `Role.DOCTOR` — `schema.prisma:338` + `auth.ts:88` → neutro (`PRACTITIONER`).
4. Nav labels/rutas dentales — `navigation.ts:19-44`; `filterNavItems` ignora `access` (`:52-53`).
5. Wizard `/setup` dental — `onboarding.ts:8-23` → presets desde `verticalPack.kpis`.
6. Generadores clínicos — `generators.ts:31-89` → por pack.
7. Alta 100% clínica sin rubro + dos onboardings — `register/route.ts`, `onboarding/page.tsx`.
8. Entitlements dentales ad-hoc — `schema.prisma:31-34` booleanos → `OrganizationEntitlement`.

---

## 2. Modelo de cuenta / rubro / entitlements

**Mecanismo en una frase:** el rubro es un **string** en `Organization.verticalTrackId`; una tabla de config estática (`VERTICAL_PACKS`, sembrada del mirror de `contract.json`) lo mapea a `{ módulos, vocabulario, KPIs, nav, roleKeys }`. Resolución = **un lookup + un filter**. Nada dinámico.

### 2.1 Modelo de datos (todo aditivo · nullable/default · cero breaking)

`Organization` — columnas nuevas (ninguna existente se toca):
```prisma
verticalTrackId String  @default("dentagest-clinical")
countryCode     String  @default("BO")
currencyCode    String  @default("BOB")
taxIdType       String  @default("NIT")
locale          String  @default("es-BO")
entitlements    OrganizationEntitlement[]
@@index([verticalTrackId])
```

`OrganizationEntitlement` — NUEVO, el corazón:
```prisma
model OrganizationEntitlement {
  id String @id @default(cuid())
  organizationId String
  featureKey String            // vertical.* | module.* | addon.*
  status String @default("active")   // active | suspended | expired
  source String @default("manual")   // manual | plan | pack | trial | grant
  limits Json @default("{}")          // { monthlyMessages:500, seats:3 }
  grantedByAdminId String?
  validUntil DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  organization Organization @relation(fields:[organizationId], references:[id], onDelete: Cascade)
  @@unique([organizationId, featureKey])
  @@index([organizationId, status])
  @@map("organization_entitlements")
}
```
Regla: `esActivo = status="active" AND (validUntil IS NULL OR validUntil > now())`.

**Membership = reuso puro** (`Profile` + `OniaCoreRoleAssignment`). Multi-org real = P1 diferido. **Subscription = opcional en C1** (`plan/planEnd` + `SubscriptionPayment` ya funcionan; cobro sigue siendo comprobante→revisión→activación manual).

### 2.2 Cómo el RUBRO configura la app (config-driven, sin motor)

`lib/platform/vertical-pack.ts` (datos del mirror `data/onia-core/vertical-packs.json`):
```ts
export interface VerticalPack {
  trackId: VerticalTrackId;
  brand: { appName: string; tagline: string; logo: string };
  includedFeatures: FeatureKey[];   // módulos ENCENDIDOS por el rubro
  nav: NavModule[];
  vocabulary: { workItemTypes: string[]; partnerTypes: string[]; areas: string[] };
  kpis: string[];
  roleKeys: string[];
  intakeChannels: string[];
}
// "dentagest-clinical" devuelve EXACTAMENTE el nav/marca/labels de hoy → dental sin cambios.
```

Resolución — función pura (`lib/platform/entitlements.ts`):
```ts
export function enabledFeatures(org, entitlements): ReadonlySet<FeatureKey> {
  const fromPack = VERTICAL_PACKS[org.verticalTrackId].includedFeatures;
  const fromEnt  = entitlements.filter(esActivo).map(e => e.featureKey);
  return new Set([...fromPack, ...fromEnt, ...legacyBooleanFeatures(org)]);
}
export function hasFeature(ctx, key): boolean { return ctx.features.has(key); }
```

Nav — activar el 2º arg ya reservado en `filterNavItems`:
```ts
.filter(i => !i.requiresFeature || ctx.features.has(i.requiresFeature)); // antes: void access
```

### 2.3 Catálogo de `featureKey`
`vertical.<trackId>` (por rubro) · `module.dental|commerce|invoicing|automation|accounting|payroll|imports|agents|public_booking|portal` (pack o entitlement) · `addon.chatbot|web|inventory_advanced|extra_seats|whatsapp` (manual).

### 2.4 Cómo se ENCIENDEN los add-ons (a mano, sin billing)
1. Cliente paga (QR) → sube comprobante → `SubscriptionPayment` (flujo existente).
2. Operador ONIA aprueba en `/admin`.
3. La aprobación inserta/actualiza `OrganizationEntitlement` (`source="manual"`). **Cero Stripe, cero webhook.**

Puente sin big-bang (`legacyBooleanFeatures`): traduce columnas viejas a featureKeys mientras coexisten; los `checkWhatsAppAddon`/`checkBookingAddon` siguen andando (reescritos por dentro a `hasFeature`, firma intacta).

### 2.5 Alta del PRIMER cliente (dental) — forward-compatible (cero migración al abrir self-serve)
Una única función `provisionOrganization()` (en `lib/platform/provisioning.ts`, a construir en C1) hace TODAS las escrituras de alta. El alta manual (operador) y el futuro signup self-serve **llaman la misma función** → el cliente manual nace "adentro" del modelo definitivo; cuando llegue la puerta self-serve **no hay migración**, solo un nuevo caller.

---

## 3. Contratos con SIAT, agentes e intake

**Invariante `external_gate`:** SIAT, runtime de agentes y WhatsApp viven FUERA del repo de la app. Credenciales fiscales **nunca** entran al repo. **La app es la AUTORIDAD de las reglas duras**; el runtime externo PROPONE, la app DECIDE.

### 3.1 SIAT — la app llama al emisor compartido (consume: C2/D1 · expone: C5)
Puerto `lib/fiscal/siat-client.ts` (NUEVO): `emitInvoice({ organizationId, invoice: NormalizedInvoicePayload, idempotencyKey, environment })` → `FiscalEmitResult { estado, cuf, cufd, controlCode, authorizationNumber, codigoRecepcion, codigoEstado(901/904/908), qrUrl, leyenda, delivered }`.
Borde HTTP (deploya C5): `POST {SIAT_SERVICE_URL}/fiscal/invoices` con `Authorization: Bearer <service-token>` + `Idempotency-Key`. Ejecuta `emitter.mjs` (ya construido). CUFD/CUIS/certificado por `organizationId` (`tenant-registry.mjs`). Persistencia → columnas de `OniaInvoicingInvoice`. Validación async (901) → n8n → `POST /api/n8n/callback/invoice-status` (YA EXISTE). Sin S2 = mock verificado vs Anexo Técnico; el trámite es paralelo.

### 3.2 Runtime de agentes — la app rutea a `/pending` (consume: C2/D2)
Feed: `GET /api/onia-core/agents/feed?agent=recall|cobrador|confirmador` (NUEVO) → `NormalizedRecord[]` (formas de `agents.logic.mjs`).
Acciones: `POST /api/onia-core/agents/actions` (NUEVO) → server-side reusa `agents.logic.mjs`: `applyRunTransition` · `evaluateGuardrails` · `routeAction` (`pending_approval` crea `OniaCoreApprovalRequest`; `auto_executed` solo internas reversibles). **Guardrail duro:** `send_money/execute_payment/delete_data/modify_settings` prohibidas; toda acción que contacte/cobre/gaste = SIEMPRE `pending_approval`. Humano aprueba en `/pending` → envío real tras aprobación (external_gate, S6). Prerequisito: tablas `onia_agents_{agents,runs,actions}`.

### 3.3 Intake — WorkItem normalizado (YA EXISTE)
`POST /api/onia-core/intake` con `Authorization: Bearer <intake-secret>` (S3), `channel: web_form|phone_walkin|email_shared|whatsapp_chatwoot`. Dedupe 24h, round-robin por carga, match de partner, nunca crea paciente. Chatbot (C3) → `POST /intake` `whatsapp_chatwoot` + PROPONE respuestas como acciones (§3.2) → `/pending`. La web postea `web_form`: **la web es fuente de leads, NO la app**.

---

## 4. El socket país-pluggable (solo el seam; NO se construye Argentina)

`lib/fiscal/country.ts` (NUEVO, mínimo): interfaces `CountryPack` + `FiscalEmitter { buildPayload, validate, emit }` + `getFiscalEmitter(countryCode)` (`"BO"` → `SiatBoliviaEmitter`; otro → throw). Invariantes que C2 respeta: `countryCode`/`currencyCode` en el modelo, **ningún `if (pais==="BO")` inline** (todo por `CountryPack`), `OniaInvoicingInvoice` ya trae campos genéricos. **Prohibido implementar AFIP/ARCA sin lead AR pagando.**

---

## 5. Plan de evolución en el lugar (sin rebuild)

**Principio: Strangler Fig — "dental = el primer pack".** El código dental de hoy se vuelve la implementación del pack `dentagest-clinical`. La capa genérica delega en él, nada se borra. `verticalTrackId` default = `"dentagest-clinical"` + flag `PLATFORM_LAYER` (off → ruta dental hardcodeada = rollback instantáneo). **En cada paso la app dental corre idéntica y vendible.**

Flags: `PLATFORM_LAYER` · `SIAT_EMISSION` (por org) · `AGENTS_RUNTIME` (por org). Invariante duro: `main` SIEMPRE compila (`tsc --noEmit` verde; nunca merge parcial; ojo casing de imports en Linux).

Orden: **E0 (C1)** columna `verticalTrackId` + resolver de pack + resolver de entitlements → nav ruteado por pack dental, **cambio visible = cero**. **E1 (C1)** `getAccountContext` + `<FeatureGate>` + `getNavForPack` publicados como contrato estable. **E2 (C2 serial)** facturación→`OniaInvoicing` (flag) → cliente SIAT → agentes en `/pending` → última milla. **E3 (C3)** add-ons por entitlement (invisibles si off). **E4** 2º pack (`gestios-general`) como config — **NO hasta que 1 clínica pague.**

**Primer incremento post-C0 (el más chico; dental idéntico):** migración aditiva `verticalTrackId`+sockets+backfill → `resolveVerticalPack("dentagest-clinical")` = nav/marca actuales → `enabledFeatures` mapea plan+booleanos legacy → nav ruteado por pack detrás de `PLATFORM_LAYER`. Gate: snapshot test (nav byte a byte = actual) + visual regression sin diff + `tsc` + suite verde.

---

## 6. Interfaz que recibe cada carril C1-C7

Contrato canónico (`lib/platform/types.ts`): `VerticalTrackId` · `FeatureKey` · `AccountContext { organizationId, verticalTrackId, plan, countryCode, currencyCode, features:ReadonlySet<FeatureKey>, roleKeys, baseRole }`. API: `getAccountContext()` · `resolveVerticalPack(id)` · `hasFeature(ctx,key)` · `requireFeature(key)` [server] · `<FeatureGate feature=.../>` [client] · `getNavForPack(pack,ctx)`.

| Carril | Recibe de C0 | Scope (cerrado) | Archivos (dueño) | HECHO | No choca con |
|---|---|---|---|---|---|
| **C1 · Shell** (repo app) | §2.1 · Contrato §6 · mirror §0 | `verticalTrackId`+sockets+`OrganizationEntitlement`+resolver (legacy→featureKey); `getAccountContext/resolveVerticalPack/hasFeature/requireFeature/<FeatureGate>/getNavForPack`; nav/shell/setup por pack dental (idéntico); `provisionOrganization`. **`impeccable`+galería web-factory antes de UI.** NO: SIAT, agentes, add-ons | `lib/platform/**`, `navigation.ts`, `components/layout/{Sidebar,LayoutShell,Header,BottomNav}.tsx`, `app/(dashboard)/layout.tsx`, `lib/auth.ts`, `prisma/schema.prisma` (solo `verticalTrackId`+`OrganizationEntitlement`), `data/onia-core/vertical-packs.json`+`scripts/sync-onia-core.mjs` | Contratos §6 estables; app dental **byte-idéntica** (snapshot nav + visual sidebar); `tsc`+tests verdes; `PLATFORM_LAYER` on con rollback probado. **Merge a main habilita C2/C3** | C2, C3 |
| **C2 · Vertical dental** ⭐ **serial interno** (repo app + siat) | §3.1 · §3.2 · §4 · de C1: `AccountContext`/`FeatureGate` en main | **4 eslabones seriales:** (1) `Invoice`→`OniaInvoicingInvoice` tras `SIAT_EMISSION`; (2) `siat-client.ts`→persistir `cuf/qr`+render `print`; (3) runtime Recall+Cobrador→`/pending` (drafts); (4) última milla UI. NO: shell/entitlements, add-ons, reescribir emisor | `app/api/invoices/**`, `app/(dashboard)/billing/**`, `app/print/invoice/[id]/**`, `prisma/schema.prisma` (invoicing + `onia_agents_*`), `lib/onia-core/modules/agents-logic.ts`, `app/api/onia-core/agents/{feed,actions}/**`, `app/(dashboard)/{agents,pending}/**`, crons; onia-hermes `integrations/siat/**` (exponer, NO tocar CUF) | Factura piloto (CUF real con S2, mock sin él)+`print` con QR; Recall+Cobrador ≥1 sugerencia en `/pending` (e2e); dry-run+backup; árbol coherente | C1 (en main), C3 |
| **C3 · Add-ons** (repo app + Web Factory) | §6 (`addon.*`) · §3.3 | chatbot (`addon.chatbot`), web (`addon.web`), presencia — **invisibles si off**. NO: billing self-serve, provisioning automático. **No edita `navigation.ts`**: registra `NavModule` con `requiresFeature` vía pack-registry de C1 | `app/(dashboard)/<addon>/**`, `lib/onia-core/modules/**`, integración web-factory | Cada add-on aparece SOLO con entitlement activo; dental sin add-on = sin cambios; `tsc`/e2e | C1 (en main), S6 |
| **C4 · Sala de agentes** (`web-factory/apps/site/…/onia-center` — **repo DISTINTO**) | §3.2 (opera la cola vía `bridge/pending`) | cockpit interno ONIA; rebuild a componentes chicos al lado de prod, swap al final; conserva Vendedor/Día+cola. NO: rediseñar el monolito 14k en su lugar. **No es** la superficie del cliente (esa es `/pending` en la app) | `onia-center/components/**`, `api/onia-center/**` | rebuild swap; `tsc` verde en apps/site | Aislado |
| **C5 · Infra/deploy** (VPS·n8n·Supabase, **SERIAL**) | §3.1 · §3.2/§3.3 · topología `app.<dominio>` | deploy una-app + `siat-service`; migraciones Supabase; n8n (recordatorios/cobrador/radar+intake) **por Credentials, cero `$env`**. NO: runtime agentes en vivo hasta C2 en main+S6 | VPS/n8n/Supabase | Servicios arriba y probados **en vivo** | S3, S6 |
| **C6 · Presencia+venta** (`web-factory/apps/dentalgest-landing` + `hermes-content/sales-kit` — **carpeta DISTINTA**) | dominio `app.<dominio>` · S1 | landing embudo que **entra a la app** + kit de venta. "Termina y PARA hasta nuevo aviso" | landing + kit | Landing apuntando a la app; kit entregado | Nadie |
| **C7 · Research fiscal** (`hermes-content/docs/research/**` — **NO codea**) | lista `[VERIFICAR]` | cerrar `[VERIFICAR]` (grupo SIAT piloto, no-show BO, ticket Bs, penetración WhatsApp)+insumos S1; go/no-go 2º vertical. **NO inventar cifras** | `docs/research/**` | Decisión con fuentes | Nadie |

**Choque real** (mismo repo = C1/C2/C3): el punto compartido es `prisma/schema.prisma` — **una migración aditiva por carril, en orden C1→C2→C3**, cada una árbol que compila. Nav por **pack-registry** (cada módulo declara su `NavModule`), nunca editar un array compartido. C4/C6/C7 = paralelo libre día 1.

**Secuencia de despacho:** C0 → STOP/aprobación → **C1 primero** (su HECHO habilita el resto) → paralelo apenas C1 en main: C2 (serial) · C3 · C5; **paralelos día 1:** C4, C6, C7.

---

## 7. STOP — qué revisar y aprobar antes de construir

**C0 termina acá. No se construye código.** El orquestador / Sergio confirma:

### 7.1 Decisiones a ratificar
1. **Facturación:** migrar **solo** facturación a `OniaInvoicingInvoice`; inventario/cobros/contabilidad bespoke dormidos por ahora.
2. **Multi-org diferido:** piloto+venta dental con `Profile.userId @unique` (1 user→1 org); `Membership` real = P1 cuando un dueño con 2 locales lo pida.
3. **onia-center:** superficie del cliente = `/pending` en la app; cockpit interno ONIA = onia-center (web-factory). NO se fusiona onia-center dentro del repo app ahora.
4. **Mirror onia-core:** `data/onia-core/vertical-packs.json` + `sync-onia-core.mjs`, con `contract.json` como fuente de verdad.
5. **Nombres canónicos** (tabla del preámbulo) congelados.
6. **Dominio** (`app.<dominio>`) — config, no bloquea C0/C1; se necesita para C5/C6.

### 7.2 Riesgos + mitigación
Generalizar nav → snapshot test + visual regression + flag `PLATFORM_LAYER`. Migración factura → flag `SIAT_EMISSION` + bespoke default hasta corte + dry-run/backup. Entitlements → envuelve `plan-limits`, no toca columnas viejas. Merge parcial → nunca; gate `tsc --noEmit`. Choque schema/nav → partición por carpeta + una migración por carril + nav por pack-registry. Agente sin aprobación → `routeAction` default aprobación humana. Cruce tenant → `tenantWhere` en toda query nueva.

### 7.3 Bloqueos humanos (destraban, NO bloquean C0/C1)
S1 precios/entitlements por plan · S2 NIT/creds SIAT piloto (§3.1 producción; mock no lo necesita) · S3 secreto intake n8n · S6 token WhatsApp/IG.

### 7.4 Definición de "hecho" de C0
Spec listo para aprobación. **STOP.** Al aprobar → C1 primero → (C2 serial · C3 · C5) + C4/C6/C7 día 1, cada uno en su worktree/rama contra los contratos §2/§3/§4/§6. Un ítem cierra cuando su código está en `main`.

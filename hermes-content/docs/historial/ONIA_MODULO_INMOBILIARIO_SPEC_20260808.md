# Módulo inmobiliario de Onia Platform — especificación para construir

**Fecha:** 2026-08-08 · **Pedido:** Sergio, "ve desarrollando el módulo de inmobiliarios"
**Fuentes de decisión:** `docs/research/ONIA_MODULO_INMOBILIARIO_ALCANCE_20260806.md` (veredicto con fuentes) · `docs/platform/ONIA_AGENDA_PREGUNTAS_SERGIO_20260802.md` nota N6 cuarta pasada (regla "Onia vende software, nunca horas" + kill-switch 30 días)
**Código verificado:** `C:\dev\proyectos\onia-platform` (solo lectura), 2026-08-08. Todas las rutas, líneas y campos citados existen; lo que no existe está marcado como tal.

Esta spec está escrita para que otro agente la implemente sin volver a investigar.

---

## 1. Alcance en 6 líneas

1. **SÍ se construye (Fase 1, ahora):** un rol de agente **captador** sobre el runtime de agentes existente, que lee los leads que ya entran por `POST /api/onia-core/intake`, los califica con un extractor determinista y deja un borrador de WhatsApp en `/pending` para que un humano apruebe. Dos archivos nuevos, seis tocados, cero migraciones.
2. **SÍ se construye (Fase 2, tras señal):** una entidad **Propiedad** mínima como módulo product-local (una tabla, con **anticrético como operación de primera clase** y precio con moneda + T/C + fecha), gateada por la misma feature key.
3. **NO se construye un track `inmobiliaria`.** Es error de compilación, no una preferencia: `lib/platform/types.ts:17-27` declara `SUPPORTED_VERTICAL_TRACK_IDS ... as const satisfies readonly CoreVerticalTrackId[]`, y los `CoreVerticalTrackId` salen de `data/onia-core/catalog.generated.ts:9-22` (11 tracks; ninguno inmobiliario). El core está **CONGELADO en v1.0.0**. La inmobiliaria se da de alta como **`gestios-servicios-profesionales`** y lo inmobiliario entra como **feature key**.
4. **NO se construye multi-portal.** UltraCasas/InfoCasas no tienen API pública; UltraCasas además está hoy en pausa (`pausanecesaria.ultracasas.com`, verificado 2026-08-08). Prometer sincronización sería prometer scraping frágil.
5. **NO se construye el track completo (Opción 1) como greenfield** — regla N6 / WOW-con-cliente-pagando: Wasi ya opera en Bolivia desde ~USD 30/mes y las franquicias imponen su stack. Si una oficina lo quiere, es **desarrollo pagado por adelantado + licencia + mantenimiento**, nunca a riesgo propio ni a comisión.
6. **NO se promete asesoría legal, fiscal, tasación, verificación de gravámenes ni custodia de dinero** (§6.7).

---

## 2. Fase 1 — el agente captador

Se construye primero porque el 90% ya existe: intake, work items, runtime de agentes, cola `/pending`, despachador idempotente y WhatsApp adapter están vivos. Lo que falta es un rol y su copy.

### 2.1 De dónde sale el lead (no hay entidad Lead, y no hace falta)

El lead **es** un `OniaCoreWorkItem` creado por `normalizeIntake()` (`lib/onia-core/intake.ts:76`) con:

- `type ∈ {lead_formulario, lead_conversacion, solicitud_manual, mensaje_correo}` (mapa `INTAKE_CHANNELS`, `intake.ts:11-16`),
- `channelId` = canal, y
- `metadata = { intakeKey, contact:{name,phone,email}, message, areaHint, receivedAt, routing }`.

Ya trae dedupe 24h por contacto+canal (`intake.ts:104-129`, comenta el item existente en vez de duplicar) y ruteo round-robin por carga a STAFF con fallback ADMIN (`intake.ts:131-153`). **La captación no requiere una sola línea nueva**: la landing/web-factory hace `POST /api/onia-core/intake` con `channel:"web_form"` y `x-intake-secret` (ruta pública declarada en `api-route-registry.ts:196`).

**Limitación honesta:** `normalizeIntake` intenta matchear un `Patient` por teléfono/email (`intake.ts:90-102`). En un tenant de servicios profesionales eso siempre da `null` y el lead queda sin `relatedEntityType`. Funciona igual; el enganche a un `OniaCoreBusinessPartner` interesado es Fase 2.

### 2.2 Los cuatro disparadores

| # | Disparador | Condición (sobre el feed de work items) | Acción |
|---|---|---|---|
| T1 | Consulta entrante sin responder | `type ∈ LEAD_TYPES`, `status:"open"`, `createdAt` últimos 30 d, sin contacto previo del agente, sin `OniaCoreComment` humano | `draft_message` (respuesta + calificación) |
| T2 | Lead sin respuesta > 24 h | igual que T1 y `createdAt < now-24h`, sigue `open` | `create_task` interno + `draft_message` si hay teléfono |
| T3 | Interesado que no volvió | `status ∈ {open,in_progress}`, `lastContactedAt` hace ≥ `cooldownDays`, toques < 3 | `draft_message` de seguimiento (toque 2) o cierre educado (toque 3) |
| T4 | Visita agendada sin confirmar | `Appointment` `status:"PENDIENTE"`, `dateTime` dentro de 6 h, `reminder24hSentAt != null` | **`create_task` interno, NUNCA un mensaje** |

**Por qué T4 no manda WhatsApp (verificado):** `app/api/cron/appointment-reminders/route.ts` ya envía recordatorio a 24 h y 2 h **sin aprobación humana**, para citas `CONFIRMADA|PENDIENTE` de toda org con `whatsappAddon` (`:55-56, :116-136, :194-203`). Si el captador propusiera otro mensaje, el interesado recibiría dos. El hueco real que ese cron no cubre es *"le recordamos y no confirmó"* → eso es una tarea para el asesor.

**Cadencia:** `intervalMinutes: 30`. No existe runtime por evento: `shouldRunAgent` (`agents-logic.ts:244`) decide solo por `intervalMinutes`; `triggerType:"event"` está en el schema pero sin cadencia devuelve `false`. Todo entra por `app/api/cron/onia-agents/route.ts`. Disparar el runner desde el route de intake es un upgrade posterior, no un requisito: hoy la latencia real la domina el humano que aprueba.

### 2.3 Calificación — extractor determinista, sin LLM

`llm_call` está en `AGENTS_CONFIG.guardrails.externalGate` (`agents-config.ts:52`): **el runtime no puede llamar a un modelo**. La calificación sale de `metadata.message` (texto libre, ≤2000 chars) y `metadata.areaHint` con regex/keywords es-BO. Lo que no se extrae **no se inventa: se convierte en la pregunta del borrador**.

```ts
export interface LeadSignals {
  operacion: "alquiler" | "venta" | "anticretico" | null;
  tipo: "departamento" | "casa" | "terreno" | "local" | "oficina" | "galpon" | null;
  zona: string | null;                                 // areaHint, "zona X", "Nº anillo", "UV-N"
  presupuesto: { monto: number; moneda: "BOB" | "USD" } | null;
  ambientes: number | null;                            // "3 dormitorios", "2 dorm"
  urgencia: "alta" | "media" | null;                   // "urgente", "esta semana", "me mudo el 1"
  financiamiento: "credito" | "contado" | null;
}
```

- **`anticretico` es de primera clase** desde el primer archivo: keywords `anticr[ée]tico`, `anticretico`, `en anti`. Es la figura boliviana que ningún CRM importado modela.
- Moneda: `bs|bolivianos` → BOB; `\$us|usd|d[óo]lares` → USD. Sin unidad ⇒ BOB (el alquiler cruceño cotiza en Bs).
- `contactable` = `metadata.contact.phone` no vacío. Decide si hay borrador o solo tarea.

**Score** (bucket, no número mágico):

| bucket | condición | consecuencia |
|---|---|---|
| `caliente` | `operacion` ∧ `contactable` ∧ (`urgencia==="alta"` ∨ `presupuesto` ∨ `financiamiento`) | borrador de propuesta de visita + `create_task` |
| `tibio` | `operacion` ∧ `contactable` | borrador de calificación (pregunta lo que falta) |
| `frio` | resto | con teléfono: borrador genérico; sin teléfono: solo `create_task` |

`missing: (keyof LeadSignals)[]` alimenta el copy — **máximo 3 preguntas por mensaje**.

### 2.4 El copy (cruceño, voseo — mismo registro que `buildCollectorMessageComercio`)

**T1 · tibio, faltan operación + zona + presupuesto**
> Hola Andrea, soy del equipo de Inmobiliaria Vega. Vi tu consulta que llegó por el formulario. Para pasarte solo lo que te sirve, contame tres cositas: ¿es para alquiler, anticrético o compra?, ¿en qué zona la necesitás? y ¿en qué rango te estás manejando? Con eso te mando opciones hoy mismo.

**T1 · ya declaró anticrético + zona (faltan ambientes + fecha)**
> Hola Andrea, soy del equipo de Inmobiliaria Vega. Recibí tu consulta por anticrético en el Urubó. Para filtrarte bien: ¿cuántos dormitorios necesitás y para cuándo te querés mudar? Apenas me confirmes coordinamos la visita.

**T1 · caliente ⇒ propuesta de visita**
> Hola Andrea, tengo opciones que entran en lo que buscás (anticrético, Urubó, 3 dormitorios). ¿Te viene bien verlas el jueves 16:00 o preferís el sábado por la mañana? Me confirmás y te paso la ubicación exacta.

**T3 · toque 2 (día 3)**
> Hola Andrea, ¿seguís buscando por el Urubó? Si ya resolviste avisame y no te molesto más. Si todavía estás viendo, decime qué día te queda cómodo y coordinamos la visita.

**T3 · toque 3 y último (día 10)**
> Hola Andrea, te escribo por última vez para no llenarte de mensajes. Si más adelante retomás la búsqueda, quedo a mano. ¡Que te vaya bien!

**T2/T4 · aviso al asesor (`create_task`, NO sale al cliente)** — WorkItem `type:"seguimiento_lead"`:
- título: `Lead caliente: Andrea Roca — anticrético, Urubó, 3 dorm., se muda este mes`
- `nextAction`: `Llamar hoy: dejó teléfono y dijo que se muda este mes.`
- T4: `Visita sin confirmar: Andrea Roca, mañana 16:00. Ya se le mandó el recordatorio automático y no respondió — llamala.`

**Reglas de copy, duras:** sin precios, sin m², sin disponibilidad, sin condiciones de contrato o de anticrético, sin comisión, sin "te garantizo", máximo un emoji. **El mensaje solo repite lo que el interesado escribió** — en Fase 1 no existe la entidad Propiedad, así que cualquier dato de inmueble sería fabricado.

### 2.5 Lo que el agente NUNCA hace solo (verificado en código)

1. **Nada sale sin aprobación humana.** `draft_message` tiene `requiresApproval: true` (`agents-config.ts:34`) ⇒ `routeAction()` lo manda a `pending_approval` **aunque el agente sea `auto`**. El envío real ocurre solo en `dispatchApprovedAction()` (`lib/onia-core/dispatch/dispatcher.ts:237`) tras el clic de un ADMIN/SUPERADMIN (`canDecideApprovals`, `collab.ts:163`).
2. **Nunca da precio, superficie, disponibilidad, condición legal ni comisión.** No hay fuente en el sistema; `AGENTS_CONFIG.notFinancialAdvice = true`.
3. **Nunca crea ni modifica `Patient`, `Appointment`, `Invoice` ni settings.** Sus únicos actionTypes son `draft_message` y `create_task`; `modify_settings` y `delete_data` están en `guardrails.prohibited`.
4. **Nunca escribe a un lead sin teléfono** (el evaluador no propone borrador sin `contactable`; y `validateEnvelope` bloquearía por "Sin destino").
5. **Máximo 3 toques por lead**, cooldown 3 días vía `lastContactByTarget` (`agents-runtime.ts:175-187`), y tope org-wide `maxMessagesPerDay: 20` **compartido con recall y cobrador**.
6. **Nunca reabre un lead cerrado** (`status ∈ {done, cancelled}` fuera del feed) ni cruza organizaciones (`assertOrganizationId` + `tenantWhere` en cada query).
7. **Nunca duplica el recordatorio de visita** del cron de appointments (T4 = tarea interna).

**Por qué el captador nace con `autonomyLevel: "auto"` y no `suggest`:** `requestApproval()` dedupea por `(entityType, entityId, requestType, status:"pending")`. Si el captador mandara DOS acciones a la cola sobre el mismo lead (`draft_message` + `create_task`), la segunda se linkearía a la aprobación de la primera y quedaría **huérfana en `pending_approval` para siempre** (el dispatcher solo transiciona el `agentActionId` que guardó la aprobación). Con `auto`, `create_task` sale por `auto_executed` (materializa WorkItem, `agents-runtime.ts:591-603`) y nunca toca la cola. Es seguro porque `routeAction` solo auto-ejecuta lo que el config declara `requiresApproval: false`: **todo lo que contacta sigue yendo al humano**.

### 2.6 Archivos exactos

**Nuevos (2):**

| Archivo | Contenido |
|---|---|
| `lib/onia-core/modules/agents-leads-logic.ts` | Puro, sin IO ni reloj: `parseLeadSignals(message, areaHint)`, `scoreLead(signals,{contactable})`, `evaluateLeadCandidates(records,{nowIso,cooldownDays,maxTouches,staleAfterDays})`, `evaluateVisitCandidates(records,{nowIso,windowHours})`. **Archivo aparte, NO dentro de `agents-logic.ts`**: ese es un port 1:1 de `agents.logic.mjs` del core congelado y no debe divergir. |
| `lib/onia-core/modules/agents-leads-logic.test.ts` | Unit puro (§2.7). |

**A tocar (6 + 1 comentario):**

| Archivo | Cambio exacto |
|---|---|
| `lib/platform/types.ts:55` | `ADDON_IDS` += `"inmobiliaria"`. Escotilla correcta: es un **add-on que se vende**, misma naturaleza que `chatbot`/`whatsapp`. **NO** tocar `SUPPORTED_VERTICAL_TRACK_IDS` (§1.3) ni `PRODUCT_LOCAL_MODULE_IDS` (su regla escrita en `:46-48` exige "algo que ya se vende + propuesta al contrato escrita"; con cero clientes eso no se cumple todavía). Sin esta línea, `isFeatureKey()` lo rechaza y `provisioning.ts:115` no deja otorgarlo. |
| `lib/onia-core/modules/agents-runtime.ts` | `AgentKind` (`:46`) += `"captador"` · `isAgentKind` (`:81-83`) += el valor · `AgentKindSpec` (`:48-57`) += `autonomyLevel?`, `requiresFeature?: FeatureKey`, `maxTouches?` · entrada `AGENT_KINDS.captador` (`intervalMinutes:30`, `cooldownDays:3`, `maxTouches:3`, `autonomyLevel:"auto"`, `requiresFeature:"addon.inmobiliaria"`) · `ensureAgentForOrg` (`:394-399`) usa `spec.autonomyLevel ?? "suggest"` y `capabilities:["draft_message","create_task"]` · `ENTITY_TYPE_BY_TARGET` (`:90`) += `lead:"OniaCoreWorkItem"`, `visita:"Appointment"` · nuevos `getLeadsFeed()` y `getVisitasPendientesFeed()` · rama `captador` en `buildDraftsForKind` (`:640`) · `buildLeadReplyMessage` / `buildLeadFollowupMessage` / `buildLeadCloseMessage` · **gate por feature al entrar a `runAgentKindForOrg`** ⇒ `skippedReason:"kind_not_enabled"` · en `routeAndPersistActions:594` el tipo de WorkItem sale del rol en vez del hardcode `"seguimiento_paciente"`. |
| `lib/onia-core/work-items.ts:10` | `DENTAL_WORK_ITEM_TYPES` += `"seguimiento_lead"`. Sin esto `createWorkItem` lanza (`:88-91` valida contra esa lista). El nombre de la constante ya es un misnomer: contiene `lead_formulario`. |
| `app/api/onia-core/agents/feed/route.ts:25` y `.../actions/route.ts:46` | El string `"agent debe ser recall|cobrador"` pasa a incluir `captador`. `isAgentKind` ya cubre la validación real. |
| `lib/onia-core/modules/agents-runtime.test.ts` | Nuevo `describe("captador inmobiliario")` (§2.7). |
| `prisma/schema.prisma:1684` | Solo el **comentario** del campo `role`. `role` es `String`: **sin migración**. |

**El gate por feature, en una query (patrón ya existente).** `addon.inmobiliaria` no puede venir de ningún otro lado: `includedFeaturesFor` (`vertical-pack.ts:56-77`) solo emite `vertical.*` y `module.*`, y `legacyBooleanFeatures` (`entitlements.ts:47-58`) solo mapea los 4 booleans legacy. Entonces basta el mismo bloque que `isAgentsRuntimeEnabledForOrg` ya usa para `module.agents` (`agents-runtime.ts:143-147`):

```ts
const ent = await prisma.organizationEntitlement.findFirst({
  where: { organizationId, featureKey: spec.requiresFeature },
  select: { status: true, validUntil: true },
});
if (!(ent && esActivo(ent, now))) return { ...base, ran: false, skippedReason: "kind_not_enabled" };
```

**Sin cambios (verificado):** `app/(dashboard)/agents/page.tsx` itera `Object.values(AGENT_KINDS)` — el rol aparece solo · `app/api/cron/onia-agents/route.ts` → `runAgentsForAllOrgs` itera `Object.keys(AGENT_KINDS)` · `/pending` ya renderiza cualquier `dispatch` · `dispatch/envelope.ts` ya mapea `draft_message → whatsapp` · `agents-logic.ts` entero (routeAction, evaluateGuardrails, agentActionKey, máquinas de estado) · `dispatcher.ts` / `channels.ts` / `collab.ts`.

### 2.7 Tests

`agents-leads-logic.test.ts` (puro, sin DB):
- `parseLeadSignals`: "busco depto en anticrético en el Urubó, 3 dorm, urgente" ⇒ los 5 campos · "quiero alquilar algo por 1500 bs" ⇒ `alquiler` + `{1500,"BOB"}` · "$us 300" ⇒ USD · "hola, info porfa" ⇒ todo `null` y `missing` completo · venta/alquiler/anticrético no se confunden entre sí.
- `scoreLead`: caliente / tibio / frío; **sin teléfono nunca es caliente**.
- `evaluateLeadCandidates`: lead nuevo sin contacto ⇒ candidato · con `OniaCoreComment` humano ⇒ NO · contactado hace 1 día con `cooldownDays:3` ⇒ NO · 3 toques ⇒ NO · `status:"done"` ⇒ NO · orden por antigüedad.
- `evaluateVisitCandidates`: `PENDIENTE` a 4 h con `reminder24hSentAt` puesto ⇒ candidato · `CONFIRMADA` ⇒ NO · a 30 h ⇒ NO (lo cubre el cron).

`agents-runtime.test.ts` (Prisma mockeado con `vi.hoisted`, `vi.stubEnv`, `NOW` fijo — añadir `oniaCoreComment:{findMany}` y `organizationEntitlement:{findFirst}` a los mocks):
- org **sin** el add-on ⇒ `ran:false`, `skippedReason:"kind_not_enabled"`, y `oniaAgentsAgent.findFirst` **no** llamado (cero writes).
- org **con** el add-on ⇒ un WorkItem `lead_formulario` con teléfono genera `draft_message` `pending_approval` + `OniaCoreApprovalRequest` con `metadata.dispatch.body` = el copy y `dispatch.to` = el teléfono.
- lead **sin** teléfono ⇒ ningún `draft_message`; sí un `create_task` `auto_executed` con WorkItem `type:"seguimiento_lead"`.
- lead ya contactado dentro del cooldown ⇒ cero acciones.
- dedupe cross-run: propuesta viva con la misma clave ⇒ `discarded`, sin nueva aprobación.
- org dental corriendo el cron completo ⇒ recall y cobrador corren, captador no.
- ningún `fetch` en todo el camino (mismo aserto que ya usa el archivo).

Correr: `npx vitest run lib/onia-core/modules lib/platform` (`vitest.config.ts`, `environment:"node"`, sin DB).

### 2.8 Alta del cliente (sin código)

1. Registrar la oficina como **Servicios profesionales** (`app/(auth)/register/page.tsx`; `app/api/auth/register/route.ts:43` valida con `z.enum(SUPPORTED_VERTICAL_TRACK_IDS)`).
2. Crear cada asesor desde `/team` con rol **DOCTOR** (`app/api/team/route.ts:24` acepta `z.enum(["ADMIN","DOCTOR","STAFF"])` y `:107-123` le siembra `DoctorSchedule` L-S 08:00-18:00) → queda con agenda y reservable en el booking público al instante. **Esta es la única vía**: el onboarding de ese track solo ofrece STAFF/ADMIN (`lib/onboarding/vocabulario.ts:38-41`) y `/api/doctors` está declarada solo para `CLINICOS` (`api-route-registry.ts:84`), así que un tenant de servicios recibe 403 ahí.
3. Otorgar la fila `OrganizationEntitlement{featureKey:"addon.inmobiliaria", status:"active"}` (o `extraEntitlements` en `provisioning.ts:199-211`).
4. Plan **Pro+** o entitlement `module.agents`: `isAgentsRuntimeEnabledForOrg` (`:130-148`) exige `AGENTS_RUNTIME=1` + `PLATFORM_LAYER=1` + `planAccessLevel==="full"` + (`PLAN_LIMITS.agentsIncluded` o `module.agents`).

### 2.9 Tamaño honesto

**2 a 3 días de un agente.** El extractor + evaluadores con sus tests es el grueso (~1 día); la rama en el runtime y su test, medio día; el copy y el pulido, medio día. Es el tamaño del cobrador de comercio (C10, un día) más el extractor, que ahí no existía.

**Lo que NO destraba esta fase:** el envío real de WhatsApp sigue bloqueado por Meta (D3: los 4 clics de la Fase A). Sin `WHATSAPP_PHONE_NUMBER_ID`/`ACCESS_TOKEN` reales, `channels.ts` lanza `DispatchConfigError` y `/pending` muestra el error al aprobador. Todo el circuito hasta la cola funciona; la última milla es transversal a todos los rubros, no de este.

---

## 3. Fase 2 — la entidad Propiedad mínima (módulo product-local)

**No se construye hasta el gatillo de §4.** Queda especificada para que el día que la señal llegue sea ejecución, no investigación.

### 3.1 Modelo de datos

Una tabla. El **propietario NO es una tabla nueva**: es un `OniaCoreBusinessPartner` con `partnerType:"propietario"` (`prisma/schema.prisma:437-453`; `partnerType` es `String` libre con índice `[organizationId, partnerType, status]`, exactamente como comercio ya usa `cliente_empresa` en `lib/importadora/cotizaciones.ts:24`). El **interesado**, igual, con `partnerType:"interesado"`.

```prisma
model OniaInmobiliariaProperty {
  id             String    @id @default(cuid())
  organizationId String
  code           String                       // código interno del asesor
  title          String
  operation      String                       // venta | alquiler | anticretico
  propertyType   String                       // casa | departamento | terreno | local | oficina | galpon
  status         String    @default("disponible") // disponible | reservada | cerrada | retirada

  // Precio: NUNCA un número suelto. Los avisos bolivianos cotizan en USD "T/C
  // paralelo"; tras la flotación de jun-2026 un USD sin T/C y fecha es dato podrido.
  price          Decimal?
  currency       String    @default("BOB")    // BOB | USD
  fxRate         Decimal?                     // T/C usado si currency = USD
  fxRateAt       DateTime? @db.Date
  expenses       Decimal?                     // expensas de condominio, campo separado del precio

  // Anticrético como operación de primera clase (Código Civil DL 12760 arts. 1429-1435).
  anticreticoMonto  Decimal?                  // capital entregado
  anticreticoMeses  Int?                      // plazo; validar <= 60 (art. 1435: máx. 5 años)

  // Ubicación con la nomenclatura que Santa Cruz usa de verdad.
  city           String?
  zone           String?                      // barrio/condominio: Equipetrol, Urubó, Las Palmas
  ring           Int?                         // anillo 1..10
  uv             String?                      // Unidad Vecinal (UV-1..UV-90+)
  address        String?

  areaBuilt      Decimal?                     // m² construidos
  areaLot        Decimal?                     // m² de terreno
  bedrooms       Int?
  bathrooms      Int?
  parking        Int?

  ownerPartnerId String?                      // OniaCoreBusinessPartner partnerType="propietario"
  notes          String?
  metadata       Json      @default("{}")
  createdAt      DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt      DateTime  @updatedAt @db.Timestamptz(6)

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([organizationId, code])
  @@index([organizationId, status, operation])
  @@index([organizationId, ownerPartnerId])
  @@map("onia_inmobiliaria_properties")
}
```

**Migración:** `prisma/migrations/20260901000000_add_onia_inmobiliaria_properties/migration.sql`, estilo del repo (encabezado que explica qué agrega y por qué, `CREATE TABLE` + índices + FK, **aditiva**, con la nota "NO SE APLICO — prod/staging se tocan con el runbook quirúrgico `docs/DATABASE_MIGRATION_BASELINE_2026.md`"). El código debe ser **fail-soft**: sin la tabla, la pantalla avisa "migración pendiente" (mismo criterio que `onia_commerce_purchases`).

**Lo que a propósito NO es columna hoy** (vive en `metadata` hasta que un cliente pagante lo pida): amenities (piscina, churrasquera, dependencia de servicio), estado (a estrenar / en construcción / usado), fotos y tours, checklist documental (folio real, testimonio, catastro, uso de suelo, impuesto al día), flag de inscripción del gravamen en Derechos Reales, comisión pactada (%, base, quién paga). Razón: son campos de **contrato y de expediente**, no de listado, y modelarlos antes de tener un asesor usándolos es exactamente el error que la regla WOW prohíbe.

### 3.2 Archivos

| Archivo | Qué |
|---|---|
| `lib/inmobiliaria/propiedades.ts` (nuevo) | Lógica pura + queries; patrón de `lib/importadora/cotizaciones.ts` (clase `PropiedadError`, validaciones, transacción). Valida `anticreticoMeses <= 60` y exige `fxRate`+`fxRateAt` cuando `currency==="USD"`. |
| `lib/inmobiliaria/propiedades.test.ts` (nuevo) | Unit de las validaciones. |
| `app/api/inmobiliaria/propiedades/route.ts` (nuevo) | `GET` lista + `POST` crea. |
| `app/api/inmobiliaria/propiedades/[id]/route.ts` (nuevo) | `GET`/`PATCH`/`DELETE`. |
| `lib/platform/api-route-registry.ts:65` | `"inmobiliaria/propiedades": ["gestios-servicios-profesionales"]` y `"inmobiliaria/propiedades/[id]": [idem]`. **Sin esto la suite falla** (§6.1). |
| `app/(dashboard)/inmobiliaria/page.tsx` (nuevo) | Lista + alta de propiedad; filtros por operación/zona/estado. |
| `lib/platform/vertical-pack.ts:327` `SERVICIOS_NAV_ITEMS` | `{ href:"/inmobiliaria", icon:"home_work", label:"Propiedades", roles:[...SERVICIOS_ROLES_UI], requiresFeature:"addon.inmobiliaria" }` |

**Cada handler lleva DOS guards, no uno:**

```ts
const profile = await requireAuth();
await requireVerticalRoute("inmobiliaria/propiedades");   // aísla RUBRO
await requireFeature("addon.inmobiliaria");               // aísla ADD-ON
```

`requireVerticalRoute` (`api-guard.ts:36-42`) compara **solo** `ctx.verticalTrackId` contra la lista de dueños: **no sabe de features**. Sin la segunda línea, cualquier estudio contable en `gestios-servicios-profesionales` entra a la API sin pagar el add-on. No existe helper combinado; son dos llamadas.

### 3.3 Cómo se gatea sin tocar el core

Una sola feature key (`addon.inmobiliaria`) gatea las tres capas: **nav** (el item con `requiresFeature` solo aporta su segmento si la feature está activa — `route-access.ts:130-141`), **API** (`requireFeature` en cada handler) y **agente** (`spec.requiresFeature` en el runtime). Dos keys serían dos gates que mantener sincronizados; el día que Fase 1 y Fase 2 se vendan por separado se agrega la segunda, no antes.

El track sigue siendo `gestios-servicios-profesionales`: `SUPPORTED_VERTICAL_TRACK_IDS` no se toca, `contract.json` no se toca, `catalog.generated.ts` no se toca. **Cero contacto con el core congelado.**

### 3.4 Tamaño honesto

**4 a 6 días.** Migración + modelo (0,5 d) · lib con validaciones y tests (1 d) · 2 rutas API con guards (0,5 d) · pantalla de lista + alta con filtros que no parezca un CRUD genérico (2-3 d, es lo caro) · registry, nav y ajustes de tests (0,5 d).

---

## 4. Fase 3 — lo que espera señal

| Qué | Gatillo medible que lo habilita | Por qué no antes |
|---|---|---|
| **Matching interesado ↔ propiedad** (criterios guardados + alerta cuando entra una propiedad que calza) | Fase 2 en uso real: **≥ 30 propiedades cargadas por ≥ 2 asesores durante 1 mes**. Con carteras de 5 propiedades el matching es mirar la lista. | Sin volumen no aporta nada sobre la vista filtrada; y el extractor de señales (§2.3) ya deja los criterios listos para reusar. |
| **Mini-web pública con la cartera** | **3+ asesores lo piden por escrito** estando ya en Fase 2. | La vidriera ya la resolvieron los portales; nuestra mini-web solo suma como URL propia del asesor, no como canal de demanda. |
| **Publicación en portales** | Que un portal boliviano publique **API documentada**, o que exista acuerdo comercial firmado. | UltraCasas está en **pausa** (verificado 2026-08-08) e InfoCasas no expone API. Hoy solo sería scraping frágil. |
| **Contrato de anticrético (expediente completo: DDRR, RC-IVA presunto, devolución)** | Un cliente **pagando** que lo pida explícitamente. | Es el terreno donde termina el software y empieza el notario. Se puede modelar y recordar; nunca garantizar (§6.7). |

**Gatillo maestro de la Fase 2** (del doc de alcance, §d.2): **5+ asesores pagando el add-on por 2+ meses**, o la oficina piloto renovando. Ese número prueba a la vez el canal de adquisición y la disposición a pagar — las dos incógnitas sin dato.

**Kill-switch (N6 cuarta pasada):** si la oficina C21 Acero no convierte en 30 días de conversación, C21 se archiva y el camino inmobiliario queda solo por asesores B2C.

---

## 5. Lo que reusa vs. lo que nace nuevo

### Reusa (tabla pieza → archivo existente)

| Pieza inmobiliaria | Archivo existente | Estado |
|---|---|---|
| Captación de leads | `lib/onia-core/intake.ts` + `app/api/onia-core/intake/route.ts` (pública, `x-intake-secret`) | Sirve tal cual |
| Pipeline lead → visita → cierre | `lib/onia-core/work-items.ts` (estados `open→in_progress→done|cancelled`, dedupe por entidad) | Sirve; +1 tipo (`seguimiento_lead`) |
| Interesados y propietarios | `prisma/schema.prisma:437-453` `OniaCoreBusinessPartner` (`partnerType` libre + `metadata`) | Sirve tal cual, cero migración |
| Motor de agentes (ruteo, guardrails, dedupe, estados) | `lib/onia-core/modules/agents-logic.ts` | Sin tocar |
| Persistencia + cola + sobre de salida | `agents-runtime.ts:463-626` `routeAndPersistActions` · `lib/onia-core/collab.ts:167` | Sin tocar |
| Aprobación humana y despacho idempotente | `app/(dashboard)/pending/` · `dispatch/{envelope,dispatcher,channels}.ts` (`approvalId` UNIQUE) | Sin tocar |
| Cron del runtime | `app/api/cron/onia-agents/route.ts` → `runAgentsForAllOrgs` | Sin tocar |
| Pantalla de agentes | `app/(dashboard)/agents/page.tsx` (itera `AGENT_KINDS`) | El rol nuevo aparece solo |
| Agenda de visitas + booking público | `Appointment`/`DoctorSchedule` · `app/api/appointments` · `app/api/booking/*` · `app/(public)/book/` | Sirve; el asesor se crea DOCTOR desde `/team` (§2.8) |
| Recordatorio de cita por WhatsApp | `app/api/cron/appointment-reminders/route.ts` | Sirve; por eso T4 no manda mensaje |
| Gate por rubro / por feature | `route-access.ts` · `api-guard.ts` · `context.ts:97-101` · `entitlements.ts` | Sirve tal cual |
| Alta y entitlements | `app/api/auth/register` · `lib/platform/provisioning.ts:199-211` | Sirve tal cual |

### Nace nuevo

- **Fase 1:** `agents-leads-logic.ts` + su test (extractor determinista es-BO, score, evaluadores de lead y de visita) y la rama `captador` dentro de `agents-runtime.ts` con sus tres funciones de copy.
- **Fase 2:** tabla `onia_inmobiliaria_properties` + su migración, `lib/inmobiliaria/propiedades.ts`, dos rutas API, una pantalla, un item de nav, dos entradas de registry.
- **Nada más.** Ni tabla de leads, ni tabla de propietarios, ni motor de agentes, ni cola, ni canal de WhatsApp.

### Lo que el doc de alcance supone y NO existe (dicho explícito)

- **"Capta interesados desde IG/portales"** — no hay conector de Instagram ni de portales. El único intake vivo es `POST /api/onia-core/intake` con 4 canales (`web_form`, `phone_walkin`, `email_shared`, `whatsapp_chatwoot`). El add-on capta lo que entra por el formulario del asesor y por WhatsApp/Chatwoot. Prometer portales sería vender lo que no hay.
- **`quotes_b2b` como "reserva/oferta"** — no sirve tal cual: `crearCotizacion` exige `variantId` de `OniaCommerceProductVariant` **y precio en `OniaCommercePriceListItem`** (`lib/importadora/cotizaciones.ts:68-91`), o sea modelar cada inmueble como producto+variante+precio de lista. Además la ruta está declarada solo para `proveegest-electrico` (`api-route-registry.ts:76`). La tabla desnuda `onia_commerce_quotes` sí serviría el día que haga falta una oferta formal; para el add-on de captación **no hace falta**.
- **`OniaCoreScheduleEvent`** — `scheduleEvent()` (`lib/onia-core/schedule.ts:20`) **no tiene un solo caller** en el producto (verificado por grep). La visita real es un `Appointment`.
- **Correcciones al doc de alcance verificadas hoy:** UltraCasas (#1, "publicación gratuita") está en **pausa estratégica**, sin fecha de vuelta. InfoCasas **sí** modela anticrético como categoría propia con filtros (el hueco está en el CRM, no en el portal); que Wasi/Tokko no lo soporten **no se pudo verificar con fuente** y por lo tanto **no se afirma en material comercial**.

---

## 6. Riesgos y trampas (todas verificadas en código)

1. **El pack nuevo debe entrar en `api-route-registry.ts` o las pantallas dan 403.** `api-route-registry.test.ts` recorre `app/api/**/route.ts` en disco: toda ruta nueva debe estar **en uno y solo uno** de los 3 baldes, y si está en `VERTICAL_API_ROUTES` **cada handler debe llamar `requireVerticalRoute` con su propia key**. Es el error que ya pasó con estética/vet: sus pantallas son las dentales por referencia, y declarar las rutas solo para el dental dejaba a una estética enviando `/patients/new` contra un 403 (el comentario en `api-route-registry.ts:24-30` documenta el incidente).
2. **`route-access.test.ts:317-333` lee `app/(dashboard)` del disco** y falla si aparece un segmento que ningún pack declara y que no está en `COMMON_SEGMENTS`. Crear `app/(dashboard)/inmobiliaria/` sin agregar el item de nav rompe la suite.
3. **`runAgentsForOrg` (`:814-820`) corre TODOS los kinds para TODA org con agentes, sin filtro por track.** Hoy es inocuo porque en un tenant de comercio `getRecallFeed` consulta `prisma.patient` y devuelve vacío. Un `captador` sin gate crearía una fila `OniaAgentsAgent` "captador inmobiliario" **en cada clínica dental y cada veterinaria**. El gate `spec.requiresFeature` es obligatorio, no opcional, y su test (org sin add-on ⇒ cero writes) también.
4. **`createWorkItem` rechaza cualquier tipo fuera de `DENTAL_WORK_ITEM_TYPES`** (`work-items.ts:88-91`). Un lead entra sin tocar nada (`lead_formulario` ya está); `seguimiento_lead` **hay que agregarlo** o el `create_task` del captador lanza en producción.
5. **La cola dedupea por `(entityType, entityId, requestType, status:"pending")`.** Dos acciones del mismo rol sobre el mismo lead que vayan las dos a `pending_approval` dejan la segunda **huérfana para siempre**. Mitigación: `autonomyLevel:"auto"` para que `create_task` no toque la cola (§2.5).
6. **Tope de 20 mensajes/día compartido** entre recall, cobrador y captador (`AGENTS_CONFIG.guardrails.maxMessagesPerDay`). Una oficina con los tres agentes se queda corta: subirlo es cambio de config, no de código, pero hay que saberlo antes de que el cliente reclame.
7. **`gestios-servicios-profesionales` está dentro de `COMERCIO_TRACKS`** (`agents-runtime.ts:100-104`): su cobrador lee **fiados**, no facturas. Correcto para una oficina que cobra comisiones por caja, pero es una diferencia de comportamiento respecto de los tracks clínicos.
8. **`Appointment.patientId` y `doctorId` son NOT NULL** y `app/api/appointments/route.ts:39-45` exige que el doctor sea un `Profile` con `role:"DOCTOR"`. Agendar una visita implica dar de alta al interesado como `Patient` y al asesor como DOCTOR. El agente **no** crea la cita: la propone por texto.
9. **Lo que NUNCA se promete** (base legal verificada): no somos abogados ni notarios — el anticrético *"no se constituye sino por documento público"* (CC art. 1430) y la inscripción en Derechos Reales es la que lo hace oponible; un contrato generado por el sistema es un **borrador**. No declaramos impuestos: el RC-IVA del anticrético lo declaran **ambas partes** sobre un ingreso presunto del 10% anual del contrato actualizado (DS 21531 art. 7) — se puede **calcular y recordar**, nunca garantizar cumplimiento. No verificamos gravámenes (eso lo dice un folio real). No tasamos. **No custodiamos dinero de clientes**: desde 2023 la actividad inmobiliaria es APNFD sujeto obligado ante la UIF, con deberes que Onia no puede asumir por el cliente. No prometemos licencia ni certificación de asesor: el sector **no está regulado** y el proyecto de ley sigue sin aprobarse. Y no se fija precio "en dólares" sin T/C y fecha.

---

## 7. Precio sugerido del add-on — **PROPUESTA, no ratificado**

La grilla vigente es la del código (`lib/pricing.ts`), no la de los docs viejos: chatbot WhatsApp **N1 300 + 200/mes · N2 1.500 + 550/mes · N3 desde 3.500 + 900/mes** · agenda pública **150/mes** · inventario avanzado **180/mes** · usuario extra **70/mes**. El "chatbot 350/mes + 1.000 setup" que circula en notas viejas **está retirado desde el 2026-07-09**.

**Propuesta: Bs 250/mes, sin setup**, como add-on sobre cualquier plan Pro+ (el runtime de agentes exige Pro+ o `module.agents`).

Por qué ese número:
- **Se ubica entre inventario avanzado (180) y el N1 del chatbot (200), por debajo del N2 (550)**, que es el escalón que sí incluye el transporte de Meta. El captador **no** paga transporte propio: reusa el add-on de WhatsApp del cliente. Cobrarlo como un N2 sería cobrar dos veces lo mismo.
- **Sin setup**: el rol no se entrena ni se configura por cliente (el copy es código). El setup del chatbot existe porque ahí sí hay trabajo de entrenamiento por cuenta.
- **Combo natural para la oficina:** Pro 750 + chatbot N2 (1.500 setup + 550) + captador 250 = **1.550/mes + 1.500 setup**, con el captador como el 16% del ticket — la pieza que hace que el chatbot que capta tenga quien persiga después.
- **Condición fundador (N6):** precio congelado 12 meses, prueba 60 días.

**Dos cosas que Sergio tiene que decidir, y una que el sistema no puede hacer todavía:**
- ¿250 o se regala dentro de Pro para acelerar el gatillo de los 5 pagantes? (Regalarlo mata la señal que dispara la Fase 2 — la señal es *pagar*, no *usar*.)
- ¿Se vende a asesor individual o solo a oficina? La grilla de hoy es por organización.
- **Ningún add-on puede generar un cobro hoy**: `SubscriptionPayment.plan` solo acepta planes, y los add-ons son booleans que un SUPERADMIN prende, sin vencimiento ni corte por impago (hallazgo de `ONIA_PRICING_SEGUNDA_REVISION_20260808.md`). El add-on inmobiliario nace con la misma limitación: se cobra a mano hasta que exista el cobro de add-ons.

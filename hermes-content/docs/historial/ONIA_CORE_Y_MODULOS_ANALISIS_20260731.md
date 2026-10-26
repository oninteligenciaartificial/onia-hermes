# ONIA Core y módulos por rubro — análisis con evidencia

> **2026-07-31.** Análisis, **no** implementación. No se tocó `onia-core/` (congelado v1.0.0),
> ni `onia-platform` (solo lectura), ni `web-factory`. El único archivo escrito es este.
> Validador del core corrido en solo lectura: `npm run validate:onia-core` →
> `ONIA Core contract OK: 21 capabilities, 18 entities, 11 tracks, 4 adapters`.
>
> Todo lo que afirmo abajo lo verifiqué contra el código. Lo que no pude verificar está
> marcado **[NO VERIFICADO]**.

---

## Las tres respuestas

**1. ¿El core aguanta como columna vertebral?**
No hoy. El core es un **catálogo que el producto copia a mano**: el producto reimplementó la
máquina de estados de `work_item` con semántica **distinta** a la del core, 4 de 9 módulos no
existen en el producto, y de los 5 portados faltan 22 funciones agregadas después de v0.6.2.

**2. Los módulos por rubro.**
Dental cubre 13 de 15 capacidades del track (faltan `data_ops` y `process_checklist`), pero
el 60% del código de módulos portado **no lo usa nadie** (tablas `onia_commerce_*` y
`onia_accounting_*` sin una sola query). Eléctrico es un cascarón: pack declarado, `nav: []`,
cero entidades, cero pantallas, y su adapter apunta a **otro repo con otro stack**.

**3. Un solo chatbot.**
Uno solo, con vocabulario y herramientas resueltas por pack — el pack ya declara
`vocabulary`/`areas`/`kpis`/`intakeChannels` y hoy ya existen **dos bots distintos en dos repos**
que no comparten nada. Y **un número de WhatsApp por cliente** bajo la App Meta única de Onia:
es lo que el código ya hace, y compartir número rompe el aislamiento por tenant.

---

## Hecho decisivo que cambia el marco de todo el análisis

**Casi nada de lo que se analiza acá está en producción.**

- La rama de trabajo `feat/onia-dental-medical-alert` está **37 commits adelante de
  `origin/master`** (`git rev-list --left-right --count origin/master...HEAD` → `0  37`).
  `origin/master` es el default (`refs/remotes/origin/HEAD -> origin/master`).
- En `origin/master` **NO existen**: `lib/platform/**` (packs, entitlements, gate por vertical),
  `data/onia-core/vertical-packs.json`, `scripts/sync-onia-core.mjs`, `lib/onia-core/dispatch/**`,
  `lib/onia-core/modules/agents-*`, `lib/onia-core/modules/dental-logic.ts`,
  `lib/onia-core/access-control.ts`, `lib/onia-core/schedule.ts`, `lib/onia-core/saved-views.ts`.
  Verificado con `git ls-tree -r origin/master --name-only`.
- Y aunque se mergeara, **toda la capa multi-rubro está detrás de un flag apagado**:
  `lib/platform/flags.ts:10` → `process.env.PLATFORM_LAYER === "1"`;
  `.env.example:162` → `PLATFORM_LAYER=""`. No aparece en `.env`, `.env.prod` ni `.env.production`.

Consecuencia: hoy, en la calle, corre **una app dental de un solo rubro**. La plataforma
multi-vertical existe como andamiaje sin mergear y apagado por bandera.

Esto matiza `hermes-content/docs/ONIA_PLATFORM_ESTRUCTURA_20260730.md` §1, que dice
"ya tiene una capa de plataforma multi-rubro construida" — es cierto que está escrita, pero no
está mergeada ni encendida.

---

# Pregunta 1 — ¿El core es la columna vertebral?

## 1.1 Módulos del core portados al producto

Core: 9 módulos (`onia-core/modules/*.json`). Producto: 5 archivos de lógica en
`lib/onia-core/modules/`.

| Módulo core | ver. core | ¿Portado? | Evidencia |
|---|---|---|---|
| `accounting` | 0.2.0 | Parcial | `lib/onia-core/modules/accounting-logic.ts` (415 líneas) |
| `agents` | 0.1.0 | **Completo** | `agents-logic.ts` + `agents-runtime.ts` + `agents-config.ts` |
| `commerce` | 0.3.0 | Parcial | `commerce-logic.ts` (80 líneas) |
| `dental` | 0.1.0 | Parcial declarado | `dental-logic.ts` (34 líneas, solo `medical_alert`) |
| `invoicing` | 0.2.0 | Parcial | `invoicing-logic.ts` (256 líneas) |
| **`automation`** | 0.1.0 | **NO** | 0 referencias a `onia_automation`/`automation_rule`/`message_template` |
| **`imports`** | 0.1.0 | **NO** | 0 referencias a `landed`/`onia_imports`/`import_shipment` |
| **`knowledge`** | 0.2.0 | **NO** | 0 referencias a `knowledge` en `lib/`, `app/`, `components/` |
| **`payroll`** | 0.1.0 | **NO** | única aparición: el string `"payroll"` en `lib/platform/types.ts:27` (catálogo de features) |

Confirmado lo que ya sabías: `imports`, `payroll` y `automation` no están portados.
**El cuarto es `knowledge`** — y es peor que no estar portado: **ni siquiera figura en el
catálogo de módulos del producto**. `MODULE_IDS` (`lib/platform/types.ts:21-32`) tiene 10
entradas: 8 del core + dos inventadas por el producto (`public_booking`, `portal`), y omite
`knowledge`. Nada valida que `MODULE_IDS` sea un subconjunto de los módulos del core.

## 1.2 Los módulos "portados" están congelados en v0.6.2

Las cabeceras de los ports lo dicen: `accounting-logic.ts:2`, `commerce-logic.ts:2`,
`invoicing-logic.ts:2` → `Origen: @onia/core v0.6.2 ... re-sincronizar si el core cambia`.
Nunca se re-sincronizó. Diff de exports (core `.logic.mjs` vs producto `-logic.ts`):

| Módulo | Funciones del core ausentes en el producto |
|---|---|
| `accounting` (8) | `equityStatement`, `cashFlowStatement`, `cashFlowIndirect`, `buildClosingEntry`, `isPeriodClosed`, `canPostToPeriod`, `assertPeriodOpen`, `assertCanPost` |
| `commerce` (9) | `QUOTE_STATES`, `ORDER_STATES`, `canTransitionQuote`, `applyQuoteTransition`, `canTransitionOrder`, `applyOrderTransition`, `acceptQuoteToOrder`, `isQuoteExpired`, `paymentBalance` |
| `invoicing` (5) | `invoiceTotalInBob`, `BUYER_DOC_TYPES`, `validateBuyer`, `assertValidBuyer`, `validateInvoiceLineHomologation` |
| `dental` (10) | todo salvo `medical_alert` (declarado en la cabecera, honesto) |
| `agents` (0) | ninguna — es el único módulo al día |

Las tres de `invoicing` **son fiscales y bloqueantes**:
`invoiceTotalInBob` es el TCO diario del BCB que el SIAT exige para facturar en moneda
extranjera (RND 102600000026); `validateBuyer` son los datos del comprador; y
`validateInvoiceLineHomologation` es el CAEB por ítem (RND 102500000018). Con el régimen
cambiario flotante desde jun-2026, **facturar en USD sin `invoiceTotalInBob` produce una
factura mal declarada**. Están escritas en el core desde el 2026-07-22 y no llegaron al
producto. Nada avisó.

## 1.3 El core y el producto **ya divergieron** en la entidad más central

`work_item`, máquina de estados:

```
onia-core/logic/work-items.logic.mjs:12-17     lib/onia-core/work-items.ts:29-34  (producto)
  done:      ["in_progress"]                     done:      ["open"]
  cancelled: []          // TERMINAL             cancelled: ["open"]   // reabrible
```

No es un detalle: en el core, cancelar es irreversible; en el producto, se puede reabrir un
cancelado. Y la cabecera del archivo del core dice, textual:

> *"Hoy cada producto reimplementa transiciones/SLA/dedupe/orden de cola (DentalGest
> lib/onia-core, etc.); esto es la referencia ÚNICA que deberían portar, para no duplicar
> (~15-20K líneas hoy)."*

El core escribió la referencia; el producto no la portó. La lógica pura del core es, en su
mayoría, código muerto para el producto:

| Helper del core | ¿En el producto? |
|---|---|
| `slaDueAt`, `isOverdue` | reimplementados en `lib/onia-core/bridge.ts:28-36` |
| `priorityRank`, `comparePending` | **no existen** |
| `sanitizeFilters`, `hasBlockedFilterKeys` (`saved-view`) | **no existen** |
| `nextDocNumber`, `formatDocNumber`, `parseDocNumber` (`numbering`) | **no existen** |
| `isReminderDue`, `isPastDue` (`scheduling`) | **no existen** |
| `resolvePermissions` (`roles`) | **no existe** (`roles.ts` tiene su propia tabla dental) |
| `officialRate`, `effectiveRate`, `repriceUsdToBob` (`fx`) | **no existen** — cero referencias en `lib/` y `app/` |

## 1.4 Drift en sentido inverso: el producto inventó una entidad `onia_core_*`

`prisma/schema.prisma:246-270` define `OniaCoreDispatch` → tabla `onia_core_dispatches`.
**No existe en `contract.json`, ni en `schema/base-schema.sql`, ni en ningún adapter.**
Es un duplicado de `message_dispatch` del módulo `automation`
(`onia-core/modules/automation.json`, tabla `onia_automation_message_dispatches`), con otro
namespace, otra máquina de estados (`sending|sent|failed` vs `queued|sent|delivered|failed`)
y otra idempotencia (`approvalId` UNIQUE vs `idempotencyKey`).

La regla del guardián — entidad nueva = contrato + schema + 3 adapters — **se saltó por el
lado del producto, donde el validador no mira.**

## 1.5 ¿La sincronización core → producto funciona? No. Está rota en tres capas.

**(a) Sí, `TRACK_ID` está fijado.** `scripts/sync-onia-core.mjs:24`:
```js
const TRACK_ID = "dentagest-clinical";
```
El espejo (`data/onia-core/vertical-packs.json`) contiene **un solo pack**. El segundo pack
(eléctrico) está copiado a mano en `lib/platform/vertical-pack.ts:51-65`, y el propio archivo
lo confiesa en `:46-50`:
> *"PENDIENTE (P0): data/onia-core/vertical-packs.json solo espeja el pack dental porque
> scripts/sync-onia-core.mjs esta fijado a TRACK_ID 'dentagest-clinical'... Mientras tanto el
> unico gate contra drift es vertical-pack.test.ts, que repite estos valores."*

Un test que repite a mano los mismos valores copiados a mano **no es un gate contra drift**:
si el contrato cambia, el test sigue verde porque compara la copia contra sí misma.

**(b) El script está literalmente roto por defecto.** `sync-onia-core.mjs:28`:
```js
const defaultContractPath = path.resolve(repoRoot, "..", "..", "onia-hermes", "onia-core", "contract.json");
```
Ese `../..` asumía el repo en `C:\dev\proyectos\DentaGest\dental-saas`. Tras el rename a
`onia-platform` (commit `816bcd4 chore(repo): consolidacion — DentaGest pasa a ser onia-platform`),
`repoRoot` es `C:\dev\proyectos\onia-platform`, y la ruta resuelve a
`C:\dev\onia-hermes\onia-core\contract.json`, **que no existe**. Verificado ejecutándolo:

```
$ node scripts/sync-onia-core.mjs --check
[sync-onia-core] ERROR: Contract not found at C:\dev\onia-hermes\onia-core\contract.json
```

`npm run sync:onia-core` **falla siempre** salvo que alguien recuerde pasar `--contract`.

**(c) Nada corre el `--check`.** `package.json:14`:
```json
"ci": "npm run lint && npm run typecheck && npm test && npm run build"
```
`.github/workflows/ci.yml` ejecuta esos mismos cuatro pasos. **`sync:onia-core --check` no
aparece en ninguno**, y además no *podría* correr en CI: el contrato vive en otro repo que el
runner no clona (no hay submódulo ni paquete publicado).

Pasando la ruta a mano, el espejo dental **sí coincide hoy**
(`OK: mirror matches contract v1.0.0`). O sea: el espejo está bien **por casualidad**, no por
mecanismo. La divergencia real no está en el espejo (7 campos de presentación) sino en la
lógica y las entidades, que el espejo **ni siquiera cubre** (`sync-onia-core.mjs:122-141`
copia solo `packId, rubro, vocabulary, checklists, kpis, intakeChannels, requiredCapabilityIds,
blockedCapabilityIds`).

**Qué tan grave: alto.** Es la clase de fallo que no duele hasta que duele mucho —
el ejemplo concreto ya ocurrió (invoicing v0.2.0 fiscal nunca llegó al producto).

## 1.6 El contrato tiene datos falsos que el validador no detecta

- `contract.json` → `distributionTargets[dentagest].repoPath` y
  `adapters/dentagest.json:4` apuntan a `C:\dev\proyectos\DentaGest\dental-saas`.
  **Ese directorio no existe** (`ls` → `No such file or directory`). El validador nunca
  comprueba que los `repoPath` existan.
- `adapters/dentagest.json` → `capabilityMappings` dice `collaboration => missing`,
  `approvals => missing`, `saved_reporting => missing`. **Los tres están instalados**
  (`OniaCoreComment`, `OniaCoreDocument`, `OniaCoreApprovalRequest`, `OniaCoreSavedView` en
  `prisma/schema.prisma`), y el propio `entityMappings` del mismo archivo dice `installed`.
  El adapter se contradice a sí mismo.

## 1.7 Veredicto

**El core NO es la columna vertebral hoy. Es un catálogo excelente que el producto copia a mano.**

Lo que sí es, y hay que reconocerlo: es la mejor **especificación** que tiene Onia — 18
entidades, 21 capacidades, 9 módulos, fiscal boliviano con fuentes citadas, 503 tests, 4
validadores verdes. Como documento normativo es sólido.

Lo que le falta para ser columna vertebral es **un solo mecanismo**: que el producto
*consuma* el core en vez de *transcribirlo*. Mientras el transporte sea copiar y pegar, cada
mejora del core es una deuda nueva en cada producto, y ya hay tres productos (onia-platform,
Bolivian Electric, GestiOS).

La prueba más simple de que es catálogo y no columna: **`onia-core` no es una dependencia de
`onia-platform`**. No hay `@onia/core` en su `package.json`, no hay submódulo, no hay
`node_modules/@onia`. La única conexión física es un script roto que lee un JSON de un
directorio hermano.

---

# Pregunta 2 — Los módulos por rubro

## 2.1 `dentagest-clinical` (status en contrato: `first_beta_active`)

Exige **15 capacidades core**, **0 capacidades de módulo** (el track no declara
`requiredModuleCapabilityIds`).

| Capacidad | Entidades del contrato | Estado real en el producto |
|---|---|---|
| `tenant` | organization, member | **OK** — `Organization`, `Profile` |
| `team_roles` | member, area | **Parcial** — no existe `onia_core_areas` |
| `relationships` | contact, area | **Parcial** — `contact`→`Patient` (dominio); `area` no existe |
| `work_items` | work_item, process_checklist | **Parcial** — `OniaCoreWorkItem` OK; **`process_checklist` no existe** |
| `evidence_activity` | evidence, activity_event | **Parcial** — `AuditLog`; sin tablas core |
| `alerts_reports` | notification | **OK** — `Notification` |
| `data_ops` | import_batch | **FALTA** — no hay `ImportBatch` ni tabla |
| `partners` | business_partner | **OK** — `OniaCoreBusinessPartner` |
| `permissions` | role_assignment, member | **OK** — `OniaCoreRoleAssignment` + `roles.ts` |
| `collaboration` | comment, document | **OK** — `OniaCoreComment`, `OniaCoreDocument` |
| `approvals` | approval_request | **OK** — `OniaCoreApprovalRequest` + `/pending` |
| `scheduling` | schedule_event | **OK** — `OniaCoreScheduleEvent` + `Appointment` |
| `saved_reporting` | saved_view | **OK** — `OniaCoreSavedView` |
| `catalog_inventory` | (módulo) | **OK vía legacy** — `InventoryItem`, `InventoryMovement` |
| `sales_cash` | (módulo) | **OK vía legacy** — `Invoice`, `Payment` |

**13/15.** Faltan `data_ops` (importación masiva) y `process_checklist`. Lo único que hay de
checklist es un `<h2>Checklist apertura / cierre</h2>` hardcodeado en
`app/(dashboard)/operations/page.tsx:341`.

### El hallazgo que más importa del lado dental: schema muerto

Las tablas de módulo están en Prisma pero **ningún código las consulta**:

| Namespace | Tablas | Queries en `lib/` + `app/` |
|---|---|---|
| `onia_commerce_*` | 12 | **0** (`grep "oniaCommerce"` → vacío) |
| `onia_accounting_*` | 9 | **0** (`grep "oniaAccounting"` → vacío) |
| `onia_invoicing_*` | 3 | 5, todas en `lib/fiscal/emission-service.ts` |

`/accounting` no usa el módulo contable: lee `prisma.invoice` y `prisma.payment`
(`app/(dashboard)/accounting/page.tsx:48,57`). O sea: 415 líneas de contabilidad de doble
partida portadas + 9 tablas creadas + tests, y la pantalla de contabilidad no las toca.

**Traducción comercial:** el "Contador Pack" hoy no está enchufado. La lógica existe, las
tablas existen, la pantalla mira otro lado.

## 2.2 `proveegest-electrico` (status en contrato: `planned_after_core`)

Exige **10 capacidades core** + **6 de módulo** (`import_costing`, `accounting`, `tax_bolivia`,
`invoicing`, `payroll`, `automation`).

Lo que hay hoy en `onia-platform` es **exactamente esto** (`lib/platform/vertical-pack.ts:82-112`):
marca (`appName: "ProveeGest"`, `logo: ""`), 6 `includedFeatures` declaradas, vocabulario y
KPIs copiados a mano, 5 `roleKeys`, y:

```ts
nav: [],            // línea 105
quickActions: [],   // línea 110
bottomNavHrefs: [], // línea 111
```

Con `route-access.ts`, un tenant eléctrico solo alcanza los `COMMON_SEGMENTS`: `dashboard`,
`profile`, `settings`, `help`, `team`, `admin`, `setup`, `pending`. **Ocho pantallas de shell,
cero pantallas de rubro.** Confirmado: el pack está declarado y sin pantallas ni entidades.

### Tres roturas concretas del pack eléctrico (más allá de "faltan pantallas")

1. **Los roles no tienen permisos.** `ELECTRICO_ROLE_KEYS = ["dueno","ventas","compras",
   "almacen","facturacion"]` (`vertical-pack.ts:74-80`), pero `permissionsForRoleKeys`
   (`lib/onia-core/roles.ts:39-47`) **descarta toda clave que no sea dental**
   (`if (!isDentalRoleKey(key)) continue;`). Resultado: `ventas`, `compras`, `almacen` y
   `facturacion` resuelven a **cero permisos**. Y `defaultRoleKeyForBaseRole`
   (`roles.ts:56-65`) devuelve roles dentales: todo `STAFF` eléctrico nace como `recepcion`.

2. **El canal de intake `import` no existe en el producto.** El pack eléctrico declara
   `intakeChannels: [..., "import"]` (`vertical-pack.ts:64`) y el contrato lo define
   (`intakePolicy.channels[import]`, gate `dry_run_obligatorio`), pero `INTAKE_CHANNELS`
   (`lib/onia-core/intake.ts:11-16`) tiene solo 4 y no lo incluye → `normalizeIntake` responde
   `Canal de intake no registrado: import`.

3. **El intake está soldado a lo dental.** `normalizeIntake` busca `prisma.patient`
   (`intake.ts:97-102`), escribe `relatedEntityType: "Patient"` (`:162`) y tipa contra
   `DentalWorkItemType` (`:158`). Los tipos de work item eléctricos (`cotizacion`, `pedido`,
   `solicitud_compra`, `reclamo`) **no existen** en `DENTAL_WORK_ITEM_TYPES`
   (`work-items.ts:10-22`). El contrato dice "match o creación de BusinessPartner/Contact";
   el producto matchea pacientes.

### El problema mayor: el rubro eléctrico tiene DOS casas y un stack incompatible

`onia-core/adapters/bolivian-electric.json` apunta a `C:\dev\clientes\Bolivian Electric`, con
`stack: "Next 16 + Postgres self-hosted (VPS) + Kysely (SQL fuente de verdad) + Better Auth.
No Prisma, no Supabase."`

`onia-platform` es Next + **Prisma** + **Supabase**. Son dos implementaciones del mismo track
en dos stacks que no comparten una línea. Y en el repo BE:

- `git ls-files | grep onia_core` en `main` → **vacío**. La adopción del core vive en la rama
  **sin mergear** `claude/onia-core-avance`
  (`.claude/worktrees/onia-core-avance/apps/web/lib/onia-core/work-items.ts` +
  `infra/migrations/003_onia_core_work_items.sql`) — **una tercera implementación** de
  `work_items`, esta vez sobre Kysely.

Hay tres transcripciones independientes de la misma entidad del core. Esto es exactamente el
"~15-20K líneas duplicadas" que denuncia la cabecera de `logic/work-items.logic.mjs`.

**Decisión que hay que tomar antes de estimar nada:** ¿el rubro eléctrico se sirve desde
`onia-platform` (Prisma/Supabase) o desde el repo de Bolivian Electric (Kysely/VPS)?
Hoy se están construyendo los dos y ninguno está completo. **[NO VERIFICADO]** si existe una
decisión escrita al respecto; no la encontré en `onia-core/*.md`.

## 2.3 Lo que falta, ordenado por dependencia y costo

Regla de lectura: **BARATO** = existe escrito en el core, es portar/enchufar. **CARO** = hay que
diseñarlo y construirlo (UI, migraciones, decisiones de producto).

### Bloque 0 — Prerrequisitos (bloquean todo lo demás)

| # | Qué | Costo | Por qué primero |
|---|---|---|---|
| 0.1 | Mergear `feat/onia-dental-medical-alert` a `master` (37 commits) | Medio | Sin esto no existe la capa de packs en la realidad |
| 0.2 | Decidir dónde vive el rubro eléctrico (onia-platform vs repo BE) | **Decisión, costo cero** | Determina si el bloque 2 se construye una vez o dos |
| 0.3 | Arreglar el transporte core→producto (ver §4) | Bajo | Sin esto, todo lo que se porte vuelve a divergir |

### Bloque 1 — Portar del core (BARATO: ya está escrito y testeado)

Ordenado por dependencia. Líneas = tamaño del fuente en el core, no del port.

| # | Qué portar | Fuente | Líneas | Depende de |
|---|---|---|---|---|
| 1.1 | Re-sincronizar `invoicing` a v0.2.0 (5 funciones fiscales) | `modules/invoicing.logic.mjs` | ~90 | — |
| 1.2 | Portar `logic/fx.logic.mjs` (`officialRate`, TCO BCB) | `logic/fx.logic.mjs` | 64 | prerrequisito de 1.1 y de todo precio USD |
| 1.3 | Re-sincronizar `commerce` a v0.3.0 (máquina de estados) | `modules/commerce.logic.mjs` | 192 | — |
| 1.4 | Re-sincronizar `accounting` (estados financieros + cierre) | `modules/accounting.logic.mjs` | 567 | — |
| 1.5 | Reemplazar `work-items.ts`/`roles.ts`/`saved-views.ts` por la lógica canónica | `logic/*.logic.mjs` | 439 | rompe semántica actual: migración de datos |
| 1.6 | Módulo `automation` (reglas + plantillas + dispatch) | `automation.logic.mjs` + `.schema.sql` | 254 | absorbe `onia_core_dispatches` |
| 1.7 | Módulo `imports` (landed cost Bolivia) | `imports.logic.mjs` + `.schema.sql` | 484 | 1.2 (fx) |
| 1.8 | Módulo `payroll` (planilla Bolivia) | `payroll.logic.mjs` + `.schema.sql` | 396 | 1.4 (accounting) |
| 1.9 | Módulo `knowledge` (base de conocimiento) | `knowledge.logic.mjs` + `.schema.sql` | 239 | agregar `knowledge` a `MODULE_IDS` |

Total portable ya escrito: **~2.700 líneas de lógica pura + 334 de SQL**, con tests en el core.
Portar no es gratis (Prisma, migraciones, tests del lado producto) pero **el diseño y la
verificación fiscal ya están pagados**.

### Bloque 2 — Construir de cero (CARO)

| # | Qué | Para qué track | Por qué es caro |
|---|---|---|---|
| 2.1 | Entidades core faltantes: `area`, `process_checklist`, `import_batch`, `evidence`, `activity_event`, `contact` | ambos | 6 tablas + migraciones + backfill. `import_batch` cierra `data_ops`, exigido por **los dos** tracks |
| 2.2 | Intake genérico por pack (des-dentalizar `intake.ts`) | ambos | tocar el punto por donde entra todo; `Patient` → `BusinessPartner`/`Contact` |
| 2.3 | Tabla de permisos por pack (hoy `roles.ts` es dental) | eléctrico | modelo de permisos, no una lista |
| 2.4 | Pantallas del pack eléctrico: catálogo, cotización B2B con SLA, pedido, almacén/stock, recepción de mercadería, cobranzas | eléctrico | **el grueso del costo**: `nav: []` hoy. ~6 vistas nuevas + sus APIs |
| 2.5 | Enchufar `commerce` + `accounting` a pantallas reales | ambos | 21 tablas hoy sin una sola query |
| 2.6 | Landed cost operativo (UI de embarque, DUI, prorrateo, reprecio USD→BOB) | eléctrico | 1.7 da la matemática; la operación es toda nueva |
| 2.7 | Knowledge base con búsqueda | eléctrico | 1.9 da el modelo; falta UI + indexado |
| 2.8 | Vista de sucursal (multi-sucursal real: `area.code`→`branchCode` SIAT) | eléctrico | BE es multi-sucursal; el dental nunca lo usó |

**Camino más corto a un eléctrico vendible:** 0.2 → 0.3 → 1.2 → 2.1(`area`,`import_batch`) →
2.2 → 2.3 → 2.4 (catálogo + cotización con SLA + pedido). Eso deja el pack **operable** sin
tocar `imports`/`payroll`/`accounting`, que son la segunda ola. La cotización B2B con SLA y
aprobación de descuento es el corazón del rubro: son 3 de los 5 KPIs del pack
(`cotizaciones abiertas por vendedor`, `cotizaciones vencidas (SLA)`,
`descuentos esperando aprobacion`) y el core ya tiene `slaDueAt` y `approval_request` escritos.

**[NO VERIFICADO]** Estimaciones en días/semanas: no las doy. No conozco la disponibilidad ni
el ritmo real del equipo, y un número inventado acá se convierte en compromiso comercial.

---

# Pregunta 3 — Un solo chatbot para todos los rubros

## 3.1 El punto de partida real: ya hay dos bots, no uno

**Bot A — dental (`onia-platform`, en `master`, vivo).**
`lib/whatsapp-bot.ts` (302 líneas): menú numérico 1-4 (`menuText`, `:19-29`), estados
`IDLE|MENU|AWAITING_CANCEL_CONFIRM|ESCALATED`, confirma/cancela cita
(`prisma.appointment.update`, `:103-106`, `:151-154`), escala a Chatwoot (`escalateToHuman`,
`:270-302`). El texto libre va a `generateBotReply` (`lib/whatsapp-ai.ts`), cuyo system prompt
arranca con:
```ts
`Eres el asistente virtual de ${ctx.clinicName}, una clínica dental.`   // whatsapp-ai.ts:36
```
El tipo de contexto se llama `PatientContext` y sus campos son `patientName`, `treatments`,
`openTime`/`closeTime`. **No hay tool-calling**: es un `chat.completions.create` con un prompt
y nada más (`whatsapp-ai.ts:129-136`). El bot no puede consultar datos; solo el menú fijo toca
la base.

**Bot B — eléctrico (repo Bolivian Electric, rama `claude/bolivian-electric-chatbot-1e39da`,
sin mergear).** Y es **arquitectónicamente mejor**:
- `lib/whatsapp-chatbot.ts` (444 líneas) con intents tipados:
  `"quote_request" | "product_question" | "stock_or_price" | "support" | "unknown"`
  (`lib/types.ts:130-135`).
- Respuesta estructurada: `{ intent, responseText, handoffRequired, handoffReason, priority,
  actionPreview, guardrails, sources }`.
- **Abstracción de fuente de datos**: `BolivianElectricDataSource` + `DataSourceContext`
  (`lib/data-sources.ts`) con `role`/`organizationId` — o sea, herramientas inyectables con
  contexto de permisos.
- `lib/reply-guardrails.ts`, `lib/availability-reply.ts` (1.013 líneas, disponibilidad de
  producto), `lib/be-catalog-adapter.ts`, `lib/chatwoot-webhook.ts` (1.720 líneas).

Cero código compartido entre A y B. Distinto repo, distinto stack, distinto ORM.

**Si no se decide ahora, el tercer rubro trae el tercer bot.** Ese es el costo real de no decidir.

## 3.2 ¿Un bot por rubro o uno que cambia según el pack? — Uno solo

**Recomendación: un motor único; el pack resuelve vocabulario y herramientas.**

El argumento no es estético, es que **el pack ya declara todo lo que el bot necesita saber del
rubro**, y hoy nadie lo lee:

| Campo del pack | Lo que le da al bot | Dental | Eléctrico |
|---|---|---|---|
| `rubro` | quién es en el system prompt | `salud_dental` | `distribucion_b2b` |
| `vocabulary.workItemTypes` | **el catálogo de intents** | cita, tratamiento, recall, presupuesto, cobro_pendiente | cotizacion, pedido, solicitud_compra, reclamo, cobro_pendiente |
| `vocabulary.partnerTypes` | contra quién matchea el contacto | laboratorio, aseguradora, proveedor | cliente_empresa, proveedor, importador, transportista |
| `vocabulary.areas` | **a qué área rutea el escalamiento** | recepcion, clinica, facturacion, laboratorio, gerencia | ventas, compras, almacen, facturacion, gerencia |
| `kpis` | qué puede reportar al dueño | citas de hoy, presupuestos pendientes | cotizaciones abiertas por vendedor, cotizaciones vencidas (SLA) |
| `intakeChannels` | por dónde puede entrar | whatsapp_chatwoot, email, web, phone | email, web, phone, **import** |

Comparen los dos `workItemTypes`: **`cobro_pendiente` aparece en los dos**. El "agente cobrador"
es el mismo agente con otro sustantivo. Un bot por rubro obliga a escribirlo dos veces, y a
arreglar el bug de cobranzas dos veces.

Lo que **no** cambia entre rubros (y por eso el motor debe ser uno): verificación HMAC del
webhook, resolución de tenant por `phoneNumberId`, sesión y máquina de estados, dedupe de
intake (24h contacto+canal), control de cupo del add-on, escalamiento a Chatwoot, ruta a la
cola de aprobación, registro de envío. Eso es el 80% del código.

Lo que sí cambia: **el system prompt** (una plantilla + `pack.rubro`/`vocabulary`) y
**el set de herramientas**. Nada más.

Y un dato que decide solo: `dentagest-clinical` bloquea `siat`, `proveegest-electrico` bloquea
`whatsapp`, `tr4_adapter` y `siat` (`contract.json` → `verticalTracks[].blockedCapabilityIds`).
El pack ya sabe **qué NO puede hacer el bot** en cada rubro. Con dos bots separados, ese gate
se reimplementa dos veces y se olvida una.

**Arquitectura concreta que propongo (motor de B, vocabulario del pack):**

```
motor único (compartido)
  webhook → HMAC → tenant por phoneNumberId → sesión → intent
                                                 ↓
                          registro de herramientas filtrado por pack.includedFeatures
                                                 ↓
                    ¿sensible? → approval_request (/pending)  |  ¿interna? → ejecuta
                                                 ↓
                          respuesta con vocabulario del pack + guardrails del pack
```

La pieza clave a **reusar, no reinventar**: el patrón `DataSourceContext` del bot B
(herramientas inyectadas con `role` + `organizationId`) es lo mismo que necesita el bot dental,
y es lo que el bot dental hoy no tiene.

## 3.3 ¿Dónde vive esa lógica? — Repartida en tres, y el contrato ya dice cómo

**Respeto `intakePolicy` y `external_gate`. No los cambio.** La decisión del core (modelar el
contrato, dejar el envío afuera) es correcta y ya está probada por el módulo `agents`, que es
el único módulo 100% portado y funcionando.

| Capa | Qué le toca | Por qué ahí | Ya existe |
|---|---|---|---|
| **Core** (`onia-hermes/onia-core`) | Catálogo de intents por pack (deriva de `vocabulary.workItemTypes`); catálogo de `actionType` con `requiresApproval`; guardrails; qué herramienta necesita qué capability | Es contrato, no ejecución. `agents.json` ya tiene el registro de `actionTypes` + `routeAction` | Sí: `modules/agents.logic.mjs`, `logic/intake.logic.mjs` |
| **Producto** (`onia-platform`) | Ejecución de las herramientas (leer stock, armar cotización, consultar saldo), resolución del pack, tenant guard, cola de aprobación | Las herramientas **son queries a los datos del tenant**. Sacarlas al gateway obligaría a exponer la base | Sí: `agents-runtime.ts` (706 líneas) hace exactamente esto para Recall/Cobrador |
| **Gateway** (Hermes/n8n/Chatwoot) | Transporte: recibir de Meta, mandar a Meta, conversación humana, cron | Es `external_gate` por diseño del contrato | Sí: `dispatch/channels.ts` (adapter WhatsApp), `bridge/pending`, `api/onia-core/intake` |

**Regla que ya está escrita y hay que mantener:** ninguna acción que contacte a un tercero,
publique, cobre o gaste se auto-ejecuta — va a `OniaCoreApprovalRequest` y la aprueba un humano
en `/pending` (`agents-config.ts:5-6`, `agents-logic.ts` `routeAction`). El bot **propone**;
el humano **aprueba**; el adapter **envía**. Eso no se toca cuando el bot se vuelve
multi-rubro; al contrario, es lo que hace seguro darle herramientas nuevas.

**Un ajuste concreto que sí propongo:** el bot debe entrar por `normalizeIntake`
(`lib/onia-core/intake.ts`) en vez de escribir directo en `Appointment`. Hoy
`handleInboundMessage` toca `prisma.appointment.update` sin pasar por work item, sin
`ActivityEvent`, sin dedupe. Eso contradice `intakePolicy` ("todo canal externo entra al core
como WorkItem normalizado") y es la razón por la que el bot no aparece en el panel del dueño.

## 3.4 Qué necesita un bot de importadora que el dental no

Herramientas nuevas, con lo que ya existe y lo que falta:

| Herramienta | ¿Sensible? | Qué hay hoy | Qué falta |
|---|---|---|---|
| **Consultar stock** (por sucursal) | No (lectura) | `onia_commerce_stock_items` + `stock_movements` en Prisma, **sin uso**; `availability-reply.ts` (1.013 líneas) en la rama BE | Enchufar tabla ↔ herramienta; decidir si expone stock exacto o "hay/no hay/consultar" |
| **Precio con tipo de cambio del día** | No (lectura) | `logic/fx.logic.mjs`: `officialRate(dailyTco)`, `effectiveRate`, `repriceUsdToBob` — **NO portado** (0 referencias). El BE catalog adapter tampoco lo tiene | Portar fx + **una fuente diaria del TCO del BCB**. `officialRate` ahora **lanza** sin TCO: sin la fuente, portarlo rompe la ruta de precio |
| **Cotizar** (generar cotización) | **SÍ** | `onia_commerce_quotes` + `quote_lines` en Prisma (sin uso); `computeQuoteTotal` portado; `canTransitionQuote`/`isQuoteExpired` **no portados** | Portar máquina de estados + `approval_request` para el descuento + numeración (`logic/numbering.logic.mjs`, no portado) |
| **Estado de un pedido** | No | `onia_commerce_orders` (sin uso) | Enchufar |
| **Saldo / cuentas por cobrar** | No | `paymentBalance` en el core, **no portado** | Portar + política de qué saldo se muestra por WhatsApp |
| **Ficha técnica de producto** | No | módulo `knowledge` (**no portado, ni en `MODULE_IDS`**) | Portar + cargar contenido |

Dos advertencias que valen más que la lista:

1. **El tipo de cambio es un riesgo de plata, no una feature.** Desde la flotación
   (RM 245/2026, RD BCB 88/2026) el oficial dejó de ser 6,96, y el core endureció esto **durante
   esta misma sesión** (commit `a760f7e7`, 2026-07-30): `officialRate(dailyTco)` ahora **lanza**
   si no llega un TCO válido, en vez de caer a 6,96 — con el oficial cerca de 11,89 ese fallback
   silencioso declaraba ~41% de menos (`onia-core/logic/fx.logic.mjs:19,42`). Un bot que cotiza
   en Bs con la tasa vieja **cotiza barato y pierde margen en cada mensaje**.
   Consecuencia práctica: **portar `fx` sin resolver antes la fuente diaria del TCO rompe la
   ruta de precio en vez de dar un número malo** — lo cual es correcto, pero significa que el
   orden es `fuente de TCO` → `portar fx` → `herramienta de precio`, no al revés.
   **[NO VERIFICADO]** no encontré ninguna fuente automática de TCO diario ni en
   `onia-platform` ni en `onia-core` — solo el parámetro `dailyTco` que alguien debe alimentar.
2. **Cotizar es una acción sensible.** Un precio por WhatsApp es una oferta. Debe pasar por
   `routeAction` → `approval_request` (o por un rango de descuento pre-aprobado), no
   auto-ejecutarse. La regla ya está escrita en `agents-config.ts`; solo hay que usarla.

## 3.5 ¿Un número de WhatsApp por cliente o uno compartido?

**Recomendación: un número por cliente, bajo la App de Meta única de Onia.**

Es además **lo que el código ya hace**, así que no cuesta cambiar de rumbo — cuesta desviarse:

- Cada tenant guarda **su** `whatsappPhoneNumberId` + `whatsappAccessToken` en `ClinicSettings`
  (`lib/whatsapp.ts:10-25`).
- El webhook **resuelve el tenant por el número que recibió**:
  ```ts
  prisma.clinicSettings.findFirst({ where: { whatsappPhoneNumberId: msg.phoneNumberId } })
  // lib/whatsapp-bot.ts:35-38
  ```
- Hay **un solo** `WHATSAPP_APP_SECRET` para verificar el HMAC
  (`app/api/webhooks/whatsapp/route.ts:29-33`) → una App de Meta, N números.

Por qué un número compartido con enrutamiento es mala idea acá:

1. **Rompe el aislamiento por tenant.** El `phoneNumberId` **es** la clave de tenant. Con un
   número compartido, el bot tendría que adivinar de qué clínica/importadora es un paciente que
   escribe por primera vez. No hay forma correcta de hacerlo, y equivocarse significa filtrar
   datos de un cliente a otro. Con datos clínicos, eso es un incidente serio, no un bug.
2. **La marca es del cliente.** El paciente le escribe a "Clínica X", no a "Onia". Un número
   compartido convierte a Onia en intermediario visible y mata el argumento de venta.
3. **Costo: el ahorro es ilusorio.** Meta cobra por conversación, no por número. Compartir
   número no baja el costo variable — solo ahorra el alta. Y el alta es justo donde el cliente
   está más dispuesto a colaborar (es el momento en que compró).
4. **Reputación cruzada.** Un cliente que abusa de plantillas baja la calidad del número; con
   número compartido, **todos** los clientes pierden límite de envío a la vez.
5. **Ventanas de 24h enredadas.** Con número compartido, la ventana de servicio de un usuario
   que es cliente de dos tenants se pisa. Es un problema sin solución limpia.

Lo que sí hay que resolver del lado Meta:

- Onia debe figurar como **Tech Provider / Solution Partner** para dar de alta números de
  clientes bajo su App con Embedded Signup, en vez de pedirle a cada cliente que cree su App.
  El código ya asume esto (un `APP_SECRET`, N tokens). **[NO VERIFICADO]** el estado real de la
  cuenta Meta de Onia — la memoria del proyecto marca la verificación de negocio en pausa por
  SEPREC (`[[meta-ads-engine]]`, `[[onia-datos-legales-seprec]]`), y eso es exactamente el
  mismo trámite que destraba el alta de números.
- El cupo de mensajes ya se controla por tenant y **fail-closed**
  (`checkWhatsAppAddon`, `lib/plan-limits.ts:298-340`: si no puede verificar el cupo, **no
  envía**). Ese guard está bien puesto — pero **cuenta cosas dentales**
  (`appointment.whatsapp24hSentAt`, `:313-314`). Al abrir el segundo rubro hay que moverlo a
  contar `onia_core_dispatches`/`message_dispatch`, que es agnóstico de rubro.

**Excepción única:** un número compartido de Onia para el bot **comercial de Onia** (prospectos,
demos, soporte) — ahí el tenant es Onia y no hay ambigüedad. Nunca para bots de cliente.

---

# 4. La corrección de raíz (una sola, y barata)

Todo lo del §1 tiene la misma causa: **el core no es una dependencia, es un documento que se
transcribe.** Cuatro cambios, ninguno grande, y en este orden:

1. **Publicar el core como paquete** (`@onia/core`, aunque sea privado por tarball o
   submódulo). Hoy `onia-platform/package.json` no lo menciona; la única conexión es un script
   roto que lee un JSON de un directorio hermano.
2. **Que la lógica pura del core se importe, no se copie.** Las 2.700 líneas de `logic/` +
   `modules/*.logic.mjs` son puras, sin IO — importables tal cual desde TypeScript. Lo que sí
   debe vivir en el producto es la capa Prisma/Kysely. Esto es lo que hace que la divergencia
   de `work_items` sea **imposible** en vez de indetectable.
3. **`sync-onia-core.mjs`: arreglar la ruta por defecto, quitar el `TRACK_ID` fijo (iterar los
   packs de `SUPPORTED_VERTICAL_TRACK_IDS`) y meter `--check` en `ci`.** Con el paquete del
   punto 1, el contrato viaja con la dependencia y el `--check` sí corre en CI.
4. **Que el validador del core valide contra la realidad**: que los `repoPath` de
   `distributionTargets` y adapters existan, y que los `capabilityMappings` no se contradigan
   con los `entityMappings` del mismo archivo. Hoy pasa verde con un `repoPath` que apunta a un
   directorio borrado hace commits.

Sin (1) y (2), cada mejora del core sigue siendo deuda nueva en tres productos, y el
"columna vertebral" sigue siendo una intención.

**Nota de gobernanza:** `npm run validate:onia-core` en la raíz corre **solo** `validate.mjs`.
El `validate` del propio `onia-core/package.json` corre dos (`+ modules/validate-modules.mjs`),
y existen dos más (`validate-business-tiers.mjs`, `validate-vertical-extensions.mjs`). El
comando canónico que dice `CLAUDE.md` no ejecuta los cuatro validadores que el core dice tener.

---

## Anexo — Índice de evidencia

| Afirmación | Archivo:línea |
|---|---|
| Core v1.0.0, `installInProductRepos: false` | `onia-core/contract.json:3,18` |
| `TRACK_ID` fijo a un rubro | `onia-platform/scripts/sync-onia-core.mjs:24` |
| Ruta por defecto del contrato rota tras el rename | `onia-platform/scripts/sync-onia-core.mjs:28` |
| `ci` sin `sync:onia-core --check` | `onia-platform/package.json:14` + `.github/workflows/ci.yml` |
| Pack eléctrico copiado a mano + confesión del P0 | `onia-platform/lib/platform/vertical-pack.ts:44-65` |
| Pack eléctrico sin pantallas | `onia-platform/lib/platform/vertical-pack.ts:105,110,111` |
| Roles eléctricos sin permisos | `vertical-pack.ts:74-80` + `lib/onia-core/roles.ts:39-47,56-65` |
| Máquina de estados divergente | `onia-core/logic/work-items.logic.mjs:12-17` vs `onia-platform/lib/onia-core/work-items.ts:29-34` |
| Canal `import` ausente en el producto | `onia-platform/lib/onia-core/intake.ts:11-16` |
| Intake soldado a `Patient` | `onia-platform/lib/onia-core/intake.ts:97-102,158,162` |
| `MODULE_IDS` sin `knowledge`, con 2 inventados | `onia-platform/lib/platform/types.ts:21-32` |
| Entidad `onia_core_dispatches` fuera del contrato | `onia-platform/prisma/schema.prisma:246-270` |
| Flag de plataforma apagado | `onia-platform/lib/platform/flags.ts:10` + `.env.example:162` |
| `/accounting` no usa el módulo contable | `onia-platform/app/(dashboard)/accounting/page.tsx:48,57` |
| Prompt del bot hardcodeado a dental | `onia-platform/lib/whatsapp-ai.ts:36` |
| Tenant resuelto por `phoneNumberId` | `onia-platform/lib/whatsapp-bot.ts:35-38` |
| Una sola App de Meta | `onia-platform/app/api/webhooks/whatsapp/route.ts:29-33` |
| Cupo WhatsApp fail-closed, pero dental | `onia-platform/lib/plan-limits.ts:298-340` (esp. `313-314`) |
| `repoPath` del adapter a un directorio inexistente | `onia-core/adapters/dentagest.json:4` |
| Stack incompatible del rubro eléctrico | `onia-core/adapters/bolivian-electric.json` → `stack` |
| Core no está en `main` de Bolivian Electric | `git ls-files \| grep onia_core` → vacío; vive en `claude/onia-core-avance` |
| Segundo chatbot, con intents y data-sources | `Bolivian Electric/.claude/worktrees/bolivian-electric-chatbot-1e39da/apps/web/lib/whatsapp-chatbot.ts` + `lib/types.ts:130-135` |
| Rama 37 commits adelante de `origin/master` | `git rev-list --left-right --count origin/master...HEAD` → `0  37` |
| `officialRate` lanza sin TCO (endurecido 2026-07-30) | `onia-core/logic/fx.logic.mjs:19,42` (commit `a760f7e7`) |

---

## Nota de concurrencia (honestidad sobre las condiciones del análisis)

Este worktree tuvo **otra sesión trabajando en paralelo** mientras se hacía el análisis:

- La rama avanzó de `79b2f57a` a `e87d5aba` durante la sesión.
- El commit `a760f7e7 fix(core): sin TCO del dia la factura en moneda extranjera CORTA, no
  inventa 6.96` **modificó `onia-core/logic/fx.logic.mjs` después** de que yo lo leyera. Volví a
  verificar y corregí las citas (§3.4). El validador sigue verde tras ese cambio.
- Este documento **fue commiteado por un proceso ajeno a este análisis** (el hook de auto-sync o
  la sesión paralela), dentro de `e87d5aba`, junto a otro doc. No lo commiteé yo.

Todo lo demás citado (`onia-platform`, Bolivian Electric, resto del core) se leyó y verificó
sin cambios concurrentes detectados.

# Módulo Empresa (interno) — Onia como su propio cliente en Onia Platform

Fecha: 2026-08-07 · Estado: PLAN (diseño, sin código) · Repo producto: `C:\dev\proyectos\onia-platform`
Objetivo: que Onia opere su propia empresa DENTRO del producto — (1) gastos, (2) pagos a
colaboradores (comisiones por resultado, liquidadas contra cobro efectivo), (3) reuniones
vía Cal.com self-hosted (`cal.onia.com.bo`, cuenta `onia`) — y que eso mismo sea vendible
a cualquier cliente después. Dogfooding primero, catálogo comercial después.

---

## (a) Qué existe hoy y se REUSA (rutas reales, verificadas)

| Pieza | Dónde | Qué da |
|---|---|---|
| Track servicios profesionales | `lib/platform/types.ts:17` (`SUPPORTED_VERTICAL_TRACK_IDS`) + `lib/platform/vertical-pack.ts:346` (`SERVICIOS_PACK`) | Onia entra como **org normal** de este track. Nav ya incluye `/comercio` (servicios), agenda, caja, por cobrar, `/contabilidad`, `/rrhh`. |
| Contabilidad transversal | `app/(dashboard)/contabilidad/page.tsx` + `lib/fiscal/{iva-summary,balance-comprobacion,rcv-export,tax-calendar}.ts` | IVA 13%/IT 3%, RCV, balance, vencimiento por NIT. Gate por plan (`lib/plan-limits.ts:416` `canUseBasicAccounting`/`canUseFullAccounting`). Segmento en `COMMON_SEGMENTS` (`lib/platform/route-access.ts:51`). |
| Registro de compras con factura | `lib/comercio/compras.ts` (`registrarCompraCredito`) | Compra con factura+NIT escribe `onia_accounting_rcv_records kind="compra"` → **crédito fiscal aparece solo** en el resumen IVA. El gasto con factura reusa exactamente este mecanismo. |
| RRHH / planilla (core payroll portado) | `app/(dashboard)/rrhh/page.tsx` + `prisma/schema.prisma:129` (`OniaPayrollEmployeeProfile`) + `lib/rrhh/planilla.ts` | Empleados a sueldo fijo, bono antigüedad, planilla. **NO cubre comisiones por resultado**: `payroll_entry` del core (`onia-core/modules/payroll.json`) no tiene concepto de comisión, y el core está CONGELADO. |
| Agenda operativa del core | `prisma/schema.prisma:362` (`OniaCoreScheduleEvent`, `eventType` incluye `"reunion"`) + `lib/onia-core/schedule.ts` (`scheduleEvent`, `listUpcomingEvents`) | **Reuniones NO necesitan tabla nueva.** Entidad core `schedule_event` ya existe con owner, entityType/entityId, remindAt y `metadata Json` (ahí vive la nota y el UID de Cal.com). |
| Entitlements + gates | `lib/platform/entitlements.ts`, `lib/platform/route-access.ts`, `lib/platform/api-route-registry.ts` | Mecánica de encendido por plan/entitlement; tests que leen el disco y fallan si una ruta/pantalla nueva no se declara. |
| Contabilidad ACTUAL de Onia (fuera del producto) | onia-hermes `supabase/migrations/20260622_onia_center_schema.sql`: `onia_center.income_entries`, `onia_center.expense_entries`, `onia_center.payment_commissions`, `premium_tool_usage` | Es lo que este módulo reemplaza como fuente de verdad. `payment_commissions` ya modela lo que Sergio necesita (tipo seller_commission/arthur_variable, base, %, estados estimated→paid, evidencia, aprobación Sergio). El diseño de las tablas nuevas del producto es una **generalización multi-tenant de esto**. |

Del contrato core v1.0.0 (`onia-core/contract.json`, congelado): `moduleCapabilities` declara
`accounting`/`tax_bolivia` (módulo accounting: account, fiscal_period, journal_entry, rcv_record,
withholding_record…) y `payroll` (employee_profile, payroll_period, payroll_entry,
termination_settlement). **Nada de eso modela "comisión por resultado a colaborador no-empleado"
ni "gasto simple con comprobante"** — el gasto formal del core es asiento contable/RCV compra, y
la planilla es sueldo fijo. Conclusión: gastos-con-factura REUSAN el riel RCV existente; gastos
simples y comisiones son producto-local (divergencia documentada y propuesta al contrato, mismo
patrón que `OniaPayrollEmployeeProfile` en `schema.prisma:123-128`).

**Divergencia detectada (bug real, bloquea F0):** `SERVICIOS_NAV_ITEMS` declara `/comercio/caja`
y `/comercio/fiados`, pero `VERTICAL_API_ROUTES` (`lib/platform/api-route-registry.ts:32`) solo
lista `gestios-general` y `proveegest-electrico` en las rutas `comercio/*` → un tenant servicios
ve las pantallas y las APIs le rebotan. Arreglo: agregar `"gestios-servicios-profesionales"` a
las 6 entradas `comercio/*` (diff de ~6 líneas + test).

## (b) Qué se CONSTRUYE

### Tablas (1 migración aditiva, namespace producto `onia_empresa_*`)

1. **`onia_empresa_expenses`** (`OniaEmpresaExpense`): `id`, `organizationId`, `date @db.Date`,
   `category` (texto de catálogo corto: servicios_cloud, herramientas_ia, transporte, oficina,
   pauta, otros), `description`, `amountBob Decimal(12,2)`, `receiptUrl?` (comprobante opcional),
   `supplierName?`, `supplierNit?`, `invoiceNumber?`, `rcvRecordId?` (set cuando hay factura+NIT:
   la misma transacción crea el `onia_accounting_rcv_records kind="compra"` → crédito fiscal
   automático en `/contabilidad`; sin factura no hay crédito, Ley 843 art. 8 — igual que
   `compras.ts`), `createdBy`, timestamps. Índice `(organizationId, date)`.
2. **`onia_empresa_collaborators`** (`OniaEmpresaCollaborator`): `id`, `organizationId`,
   `fullName`, `ci?`, `profileId?` (vínculo informativo sin FK, como payroll), `commissionPct
   Decimal(5,2)`, `basis` (fijo `"cobro_efectivo"` — la comisión se devenga contra plata cobrada,
   nunca contra facturado), `agreementNotes?`, `active`. Arthur y los 2 comerciales = 3 filas.
3. **`onia_empresa_commissions`** (`OniaEmpresaCommission`): `id`, `organizationId`,
   `collaboratorId`, `period` ("YYYY-MM", mes vencido), `baseAmountBob` (cobros del período
   atribuibles), `ratePct`, `amountBob`, `sourceRef?` (id de pago/venta o texto libre en F0),
   `status` `pending|paid`, `paidAt?`, `evidenceUrl?`, `notes?`, timestamps. Índice
   `(organizationId, collaboratorId, period)`.

- Reuniones: **cero tablas** (reusa `OniaCoreScheduleEvent` con `eventType="reunion"`).
- Una columna nueva: **`Organization.meetingBookingUrl String?`** — URL de agendado
  (`https://cal.onia.com.bo/onia` para el tenant Onia). Cal.com ya existe; el producto solo
  linkea/embebe. Nada de calendario propio.

### Pantallas (`app/(dashboard)/empresa/`)

- `empresa/page.tsx` — resumen del mes: total gastos por categoría, comisiones pendientes de
  pago, próximas reuniones (mismo patrón server-component de `/contabilidad`).
- `empresa/gastos/` — form alta + lista mensual (navegación `?mes=YYYY-MM` calcada de
  contabilidad) + botón export CSV.
- `empresa/colaboradores/` — lista colaboradores + por colaborador: comisiones del período,
  botón "liquidar mes" (crea la fila pending), marcar pagada (pide `paidAt` y opcional
  evidencia), historial.
- `empresa/reuniones/` — próximas reuniones (`listUpcomingEvents` filtrado `reunion`), botón
  "Agendar" → `meetingBookingUrl` (link en F0, embed iframe en F1), form mínimo "registrar
  reunión" (título, fecha, nota en `metadata`) para las que llegan por fuera (ej. banco).

### APIs (todas en `COMMON_API_ROUTES`, `requireAdmin` — datos sensibles de la org)

- `empresa/expenses` (GET lista por mes / POST — transacción con RCV si factura+NIT),
  `empresa/expenses/[id]` (PATCH/DELETE), `empresa/expenses/export` (CSV, patrón
  `fiscal/rcv-export`).
- `empresa/collaborators` (GET/POST), `empresa/collaborators/[id]` (PATCH).
- `empresa/commissions` (GET por período / POST liquidación), `empresa/commissions/[id]`
  (PATCH estado pending→paid).
- `empresa/meetings` (GET próximas / POST registrar — wrapper de `scheduleEvent`).
- F1: `webhooks/calcom` (BOOKING_CREATED → `scheduleEvent` con UID en metadata; ruta PUBLIC
  con secreto compartido).

### Cableado de plataforma

- `COMMON_SEGMENTS` += `empresa` ("Gastos, pagos a colaboradores y reuniones — toda empresa
  los tiene, no dependen del rubro"; mismo argumento que contabilidad/rrhh).
- `lib/plan-limits.ts` += `canUseEmpresa(plan)` = `basicReportEnabled` (mismo tier que
  contabilidad/rrhh; free → upsell).
- Item de nav `/empresa` en `SERVICIOS_NAV_ITEMS` (roles SUPERADMIN/ADMIN); los demás packs lo
  suman cuando se venda (F1) — llegar por URL ya funciona al ser segmento común.
- Fix `VERTICAL_API_ROUTES` comercio/* para el track servicios (bug de arriba).
- Tests: los registries se auto-verifican contra disco (`route-access.test.ts`,
  `api-route-registry.test.ts`) — declarar o la suite falla.

## (c) Encaje elegido y por qué

**Elegido: segmento transversal (`COMMON_SEGMENTS`) gateado por plan + tablas producto-local —
el precedente EXACTO de `/contabilidad` y `/rrhh`.** Descartados:

- **Addon en `ADDON_IDS`** — no: ese catálogo es la lista comercial de cosas que YA se venden
  (chatbot, web, inventory_advanced…). Hoy nadie compra "empresa"; inflar el catálogo para
  dogfooding es al revés.
- **`PRODUCT_LOCAL_MODULE_IDS`** — todavía no: la regla escrita (`lib/platform/types.ts:46-48`)
  exige "algo que ya se vende y con la propuesta al contrato escrita". `public_booking` cumple
  las dos; esto ninguna aún. Cuando tenga precio y un cliente, entra ahí con su propuesta.
- **Encender payroll/accounting del core** — parcialmente sí (los gastos con factura desembocan
  en el riel accounting existente vía RCV), pero el core congelado no modela comisiones a
  colaboradores ni gasto simple → no alcanza solo, y descongelarlo está prohibido.
- **Onia misma** = org normal de la plataforma, track `gestios-servicios-profesionales`, plan
  `professional` (grant interno), `meetingBookingUrl` configurada. Cero código especial por ser
  nosotros: si algo necesita un "if Onia", el diseño está mal.

## (d) Fases

**F0 — usable por Onia esta semana (carril D/producto, 1 sesión):**
1. Fix `VERTICAL_API_ROUTES` comercio/* (servicios). 2. Migración `onia_empresa_*` + columna
`meetingBookingUrl`. 3. `/empresa` con las 4 pantallas y APIs (comisión F0: base del período se
carga MANUAL — los cobros reales de Onia aún viven en `onia_center`; no se finge integración).
4. `COMMON_SEGMENTS` + registry + plan-gate + tests verdes (`tsc --noEmit`, vitest). 5. Provisionar
org Onia (registro normal 2 pasos + grant plan) y cargar: 3 colaboradores, gastos del mes,
reuniones próximas (banco). **Hecho = Sergio ve gastos, comisiones y reuniones de Onia en
producción del producto.**

**F0.5 — cutover contable (carril infra, tras F0 en prod):** script one-shot de backfill
`onia_center` → producto (mapa en (f)) + regla dura de escritura única.

**F1 — vendible:** comisiones derivadas de cobros reales del tenant (caja/fiados/`Payment`),
webhook Cal.com + embed, export CSV de comisiones para el contador, retenciones fiscales del
pago a colaborador sin factura (IT/IUE — validar con skill `onia-contabilidad-bolivia`, NO
inventar alícuotas), item de nav en los otros 5 packs, copy de upsell, y recién ahí:
`module.empresa` en `PRODUCT_LOCAL_MODULE_IDS` + propuesta escrita al contrato core v1.1
(capability `collab_commissions` + `simple_expense`).

## (e) Tamaño honesto

- F0: ~1 migración SQL (~70 líneas) + 3 modelos Prisma (~90) + 7 rutas API (~500) + 4 pantallas
  con clients (~800-900) + cableado/tests (~80) ≈ **1.500-1.700 líneas, 1-2 días de un carril**.
  Nada de esto es difícil: es CRUD tenant-scoped calcado de `/rrhh` (misma auth, mismos gates).
- F0.5: script backfill ~150 líneas + verificación manual de totales ≈ medio día.
- F1: ~1.000-1.500 líneas + el pendiente fiscal (retenciones) que es research, no código ≈ 2-3
  días. El webhook Cal.com es chico (~80 líneas) pero exige secreto y prueba en vivo contra
  `cal.onia.com.bo`.

## (f) Riesgos

1. **Doble fuente de verdad con `onia_center` (el riesgo real).** Regla: **desde el cutover
   (F0.5) MANDA EL PRODUCTO** para gastos y comisiones; `onia_center` queda de solo-lectura
   histórica para esas dos cosas (el agente Finanzas n8n sigue leyendo su schema hasta que en
   F1 se apunte a la API del producto — no romper `ONIA_FINANCE_SUMMARY_CONTRACT.md` en F0).
   Migración: `expense_entries` → `onia_empresa_expenses` (spent_at→date, reason→description,
   category directo); `payment_commissions` (`payment_type` seller_commission/arthur_variable)
   → `onia_empresa_commissions` (estimated/pending→pending, paid→paid, gross_basis_bs→
   baseAmountBob, rate_percent→ratePct); `income_entries` **NO migran** — son la base de
   cálculo, quedan como histórico hasta que la caja del producto capture cobros (F1).
   Antinorma: dos escritores en paralelo "mientras tanto" — eso es exactamente la capa
   construida-y-apagada que ya nos pasó.
2. **Comisión ≠ planilla.** Un colaborador por resultado no es empleado (`OniaPayrollEmployeeProfile`);
   mezclar los rieles contamina la planilla legal (bono antigüedad, Gestora). Tablas separadas
   a propósito. El tratamiento fiscal del pago (retención si no factura) queda MARCADO como
   pendiente F1, no inventado.
3. **Core congelado.** Todo lo nuevo es producto-local con comentario de divergencia en el
   schema (patrón existente) y propuesta al contrato en F1 vía `onia-core-guardian`. Nada toca
   `onia-core/**`.
4. **Cal.com self-hosted caído** → el botón "Agendar" muere. Por eso F0 es link (falla suave),
   no dependencia dura; el registro manual de reuniones funciona sin Cal.com.
5. **Arthur es menor de edad** (memoria [[arthur-menor-de-edad-marco-boliviano]]): el módulo
   registra y calcula; el marco del acuerdo/pago vive fuera del repo que Arthur ve
   (`C:\dev\sergio-personal`). No copiar términos del acuerdo a `agreementNotes`.

---
Fuente de este plan: lectura directa de `onia-platform` (solo lectura) + `onia-core/contract.json`
v1.0.0 + `supabase/migrations/20260622_onia_center_schema.sql`. Próximo paso: aprobar encaje (c)
y abrir el carril F0 en el repo producto.

# ONIA Core GestiOS Adoption Plan 2026

Fecha: 2026-07-07.
Estado: plan de adopcion APROBADO por Sergio (2026-07-07) — segundo producto en
adoptar el core, despues de DentalGest.
Owner: ONIA / Hermes.
Contrato base: `onia-core/contract.json` v0.6.2 (beta, core completo: 18
entidades, 5 modulos vendibles validados con logica Bolivia real).
Repo destino: `C:\dev\proyectos\Gestios`.

## Punto de partida real (verificado 2026-07-07, lectura del repo)

GestiOS ya avanzo por su cuenta, en paralelo al desarrollo del core, con lógica
propia que NO pasa todavia por onia-core:

- `lib/fiscal/` (commit `1563731`): `balance-comprobacion.ts`, `iva-summary.ts`,
  `rcv-export.ts`, `tax-calendar.ts`, `api-gate.ts` — contabilidad operativa
  boliviana (RCV, IVA/IT, balance de comprobacion, calendario de vencimientos
  por NIT). Con tests (`tests/fiscal-*.test.ts`).
- `lib/inventory/kardex.ts` (commit `77172ce`): kardex promedio ponderado,
  FEFO/vencimientos, conteos fisicos. Con tests (`tests/inventory-kardex.test.ts`).
- Modelos Prisma reales de comercio: `Product`/`ProductVariant` (con `stock`,
  `minStock`), `Order`/`OrderItem`, `Invoice`, `Customer`, `Supplier`,
  `PurchaseOrder`/`PurchaseOrderItem` — evidencia real que ya sostiene el fix
  v0.6.1 de `catalog_inventory`/`sales_cash` en `contract.json`.
- **Intento previo de instalar el core revertido**: commit `cf57afa "feat: add
  onia core contract"` seguido de `3d8aec4 "Revert..."` — alguien copio el
  contrato directo al repo de GestiOS y se revirtio. Confirma la regla: el core
  se REFERENCIA (adapter + logica portada), nunca se forkea/copia entero.
- **Modelos fiscales/pago que YA existen (relevante para el SIAT compartido y
  para business-tiers)**: `Invoice` (con `cuis`/`cufd`/`cufe`/`nitEmisor`/
  `xmlData`/`sinResponse` — nota literal en DATABASE.md: "SIAT esta retirado del
  alcance comercial actual"), `QrPayment` (multi-proveedor: AGGREGATOR/QR_SWITCH/
  TIGO/BIPAGO). Ergo hubo un intento previo de facturacion SIAT en GestiOS que se
  pauso — cuando exista el emisor SIAT compartido, GestiOS es candidato a
  consumirlo en vez de re-emitir por su cuenta.
- **Empaquetado comercial PROPIO** (`PlanType` BASICO/CRECER/PRO/EMPRESARIAL +
  `AddonType` WHATSAPP/FACTURACION/QR_BOLIVIA/ECOMMERCE/CONTABILIDAD/
  INVENTARIO_AVANZADO, via `OrgAddon`). NO coincide con los niveles del core
  (`business-tiers.json`: Ordenado/Profesional/Empresa). Al adoptar, decidir si
  se alinean o conviven — no forzar sin criterio comercial de Sergio.

### Baseline de migraciones — CONFIRMADO 2026-07-08 (leyendo docs/DATABASE.md)

Ya no es "dato de memoria": verificado. El baseline SIGUE sucio y es el bloqueo
real del Sprint 0.

- **Sin `DATABASE_URL`/`DIRECT_URL` local**: DATABASE.md dice literal "las
  migraciones se aplican en Vercel via `prisma migrate deploy` en el build". No
  se puede operar Prisma localmente contra prod sin conseguir esa URL primero
  (Vercel env del proyecto o el Supabase de GestiOS). ESTE es el primer paso
  concreto del Sprint 0.
- **Migraciones aplicadas A MANO, fuera de `migrate deploy`**: `cash_registers`
  ("Aplicado directamente a Supabase el 2026-05-09"), `email_log` ("Aplicar
  manualmente a Supabase"). La ultima (`20260610_add_inventario_avanzado_addon.sql`)
  es un `.sql` suelto, ni siquiera una carpeta de migracion Prisma estandar.
  Drift de REGISTRO confirmado (el contenido puede estar al dia, pero el
  historial `_prisma_migrations` no refleja lo aplicado).
- Runbook a seguir: el mismo baseline que ejecuto DentaGest en su Sprint 0
  (`docs/DATABASE_MIGRATION_BASELINE_2026.md` en el repo DentaGest como patron
  de referencia): conseguir la URL valida -> `migrate status` -> squash a
  baseline unico -> `migrate resolve --applied`. Sin esto NO se agrega ninguna
  tabla del core.

## Decision que el carril E tiene que resolver ANTES de instalar entidades (no la resuelve este plan)

GestiOS ya tiene contabilidad e inventario funcionando (fiscal/ + kardex.ts,
544 tests). El core ahora tambien los cubre via los modulos `commerce` y
`accounting` (`onia-core/modules/`), con logica portable en
`@onia/core/modules/commerce-logic` y `accounting-logic`. Hay dos caminos y
NINGUNO se decide aca:

1. **Reemplazar** `lib/fiscal/` y `lib/inventory/kardex.ts` por los modulos del
   core (consistencia total con DentaGest/otros productos; tira trabajo ya
   probado con 544 tests).
2. **Mantener** la logica propia de GestiOS y adoptar del core SOLO la columna
   vertebral organizacional (work_items, roles, comments, documents, approvals,
   schedule, saved_views, intake) — GestiOS sigue siendo la referencia de
   contabilidad/inventario boliviano, el core no le pisa lo que ya funciona.

Confirmar con Sergio antes de tocar `lib/fiscal/` o `lib/inventory/`. Mientras
tanto, el Sprint 1+ de este plan instala solo la columna vertebral
organizacional (identico alcance a DentaGest Sprints 1-4), que no choca con
ninguna de las dos opciones.

## Alineacion con el patron DentaGest (misma receta, `ONIA_CORE_INSTALL_GUIDE_2026.md`)

| Entidad core | Estado real GestiOS | Fuente |
|---|---|---|
| organization | existe (`Organization`) | `adapters/gestios.json` |
| member | existe (`Profile`) | idem |
| area | parcial (`Branch`) | idem |
| contact/business_partner | parcial (`Customer`, `Supplier`) | idem |
| work_item | falta (canonico); domain records `Order`/`PaymentRequest`/`Notification` | idem |
| evidence/activity_event | parcial (`ActivityLog`, `AuditLog`) | idem |
| comment/document/approval_request/schedule_event/saved_view | falta (los 5) | idem |
| communication_channel | falta | idem |

## Sprints (mismo orden que DentaGest, adaptado)

### Sprint 0 — Saneamiento de base (bloqueante, sin core)

1. Re-verificar el estado real de migraciones: `prisma migrate status` contra
   prod/staging. Si hay drift, aplicar el mismo runbook que DentaGest
   (`docs/DATABASE_MIGRATION_BASELINE_2026.md` en el repo DentaGest como
   referencia de patron, no copiar literal).
2. Confirmar `DIRECT_URL` valida (Vercel env del proyecto o Supabase
   `jafxylfocvvlflpqfsix` segun corresponda).
3. Baseline unico + `migrate resolve --applied`.
4. Criterio de salida: `prisma migrate status` limpio, igual que DentaGest.
   Sin esto NO se agregan tablas core.

### Sprint 1 — WorkItem GestiOS + tenant guard

- Migracion `onia_core_work_items` (traducida del SQL base del contrato).
- Tipos del pack `pymes_general` (ver `contract.json` verticalPacks ->
  `gestios-general`).
- Generadores: pedido sin confirmar, pago pendiente, stock bajo minimo
  (`Product.minStock` ya existe), factura vencida.
- Tests: creacion, dedupe, tenant scoping, transiciones.

### Sprint 2 — Comment + Document + ApprovalRequest

- Mismo patron que DentaGest Sprint 2: hilos internos sobre pedido/cliente,
  documentos (comprobantes, ordenes de compra), aprobaciones (descuento,
  anulacion de pedido).

### Sprint 3 — RoleAssignment + ScheduleEvent + SavedView

- Roles finos segun el negocio (dueno/vendedor/caja/almacen — GestiOS no tiene
  hoy un equivalente a doctor/recepcion; definir matriz propia).
- ScheduleEvent para seguimientos de cobro/reposicion.
- SavedViews por rol.

### Sprint 4 — Intake + onboarding

- Intake normalizado (formulario, correo) -> WorkItem, mismo patron que
  DentaGest (`intake.logic.mjs` de `@onia/core/logic`).
- Wizard `/setup` (7 preguntas) si GestiOS no tiene uno equivalente ya.

## Gates y reglas (no negociables)

- Nunca copiar `contract.json` ni el schema al repo de GestiOS (regla
  confirmada por el revert de `cf57afa`/`3d8aec4`) — se referencia via adapter
  + `@onia/core` (logica portada, mismo mecanismo de import que se esta
  resolviendo para DentaGest en R6).
- No tocar `lib/fiscal/` ni `lib/inventory/kardex.ts` sin la decision explicita
  de Sergio de la seccion anterior.
- Cada sprint termina con tests verdes en GestiOS y `node onia-core/validate.mjs`
  verde en onia-hermes.
- Si se toca `onia-core/adapters/gestios.json` (avance de status por
  entidad instalada), reflejarlo tambien aca.

## Cambio de estado del contrato (ya aplicado al aprobar este plan, 2026-07-07)

1. `distributionTargets.gestios.status`: `hold_until_beta` -> `installing`.
2. `adapters/gestios.json.status`: `mapped_not_installed` -> `installing`.
3. `validate.mjs`: `gestios` agregado a `TARGET_ADOPTION_APPROVED` y
   `ADOPTION_APPROVED` (doble llave, junto con dentagest/bolivian-electric).
4. `contract.json` version 0.6.1 -> 0.6.2.

## Aprobacion

- [x] Sergio aprueba el plan y el orden de sprints (2026-07-07).
- [ ] Sprint 0 puede arrancar de inmediato (no toca core, solo higiene de
      migraciones).

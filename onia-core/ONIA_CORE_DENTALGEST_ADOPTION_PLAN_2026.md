# ONIA Core DentalGest Adoption Plan 2026

Fecha: 2026-07-03.
Estado: plan de adopcion propuesto — requiere aprobacion de Sergio para tocar
el repo producto.
Owner: ONIA / Hermes.
Contrato base: `onia-core/contract.json` v0.3.x (beta).
Repo destino: `C:\dev\proyectos\DentaGest\dental-saas`.

## Punto de partida real (verificado 2026-07-03)

DentalGest ya avanzo por su cuenta:

- Commit `ed4e032` (2026-06-29): "ONIA Core dashboard" — cockpit del dueno en
  `app/(dashboard)/dashboard/page.tsx` (891 lineas): metricas de pacientes,
  agenda, cobros, cuentas por cobrar, no asistencias, inventario critico,
  prioridades del dia. Roles financieros vs no financieros.
- Sin cambios de schema (decision consciente por drift pendiente).
- Doc local: `docs/ONIA_CORE_DENTALGEST_ROLLOUT.md`.
- **Bloqueante conocido**: backlog DG-013 (P1) — drift de migraciones
  Prisma/Supabase sin baseline reproducible.

Lectura: el cockpit v1 es el prototipo del read-model `owner_dashboard` del
contrato. La adopcion formal consiste en (a) sanear la base, (b) traer las
entidades core que faltan, (c) alinear el cockpit al contrato.

## Alineacion cockpit v1 vs contrato owner_dashboard

| Seccion contrato | Cockpit v1 | Gap |
|---|---|---|
| today | agenda de hoy + prioridades | falta ScheduleEvent para recalls/seguimientos no-cita |
| money | cobros, cuentas por cobrar | falta ApprovalRequest (descuentos/anulaciones) |
| pending | prioridades del dia | falta WorkItem real (hoy son queries ad hoc) |
| team | actividad basica | falta RoleAssignment fino + ActivityEvent alineado |
| attention | avisos + inventario critico | falta cola de aprobaciones |
| partners | pacientes recientes | Patient es dominio; falta BusinessPartner (labs/aseguradoras) — opcional |

## Sprints

### Sprint 0 — Saneamiento de base (bloqueante, sin core)

#### Diagnostico ejecutado 2026-07-03 (read-only, via Supabase MCP)

Proyecto Supabase `kvepqgikokjlacxngkiw` (Dental-gest, us-west-2,
ACTIVE_HEALTHY, Postgres 17).

| Hallazgo | Detalle |
|---|---|
| `_prisma_migrations` NO existe en prod | Prisma migrate nunca gestiono produccion. El historial `prisma/migrations/` (hasta `20260618161500_email_notifications_default_on`) no tiene registro en prod. |
| Tracking real: `supabase_migrations.schema_migrations` | Ultima aplicada: `20260610201810_add_inventory_addon`. |
| Contenido AL DIA a pesar del doble tracking | Columnas de migraciones de junio existen en prod (`onboardingCompletedAt`, `extraUserSeats`, `emailNotifications`, `inventoryAddon`). El drift es de REGISTRO, no de contenido. |
| Namespace `dentalgest` NO aplicado | La migracion `supabase/migrations/20260629_dentalgest_namespace.sql` (commit ed4e032) no corrio en prod: no existe schema `dentalgest`. |
| 24 tablas public vs 23 modelos Prisma | Cuadra; la extra es `prospect_leads` (solo Supabase, fuera de Prisma — decision pendiente: agregarla al schema o documentarla como tabla externa). |

#### EJECUTADO 2026-07-03 — commit `612a177` en DentaGest

Resultado: `prisma migrate status` -> "Database schema is up to date!".

- Drift real corregido en prod (migracion Supabase
  `align_prisma_drift_email_default_language_not_null`): emailNotifications
  DEFAULT true + language NOT NULL (0 nulls verificados antes).
- schema.prisma alineado a prod: followupSentAt y whatsappOnboardingAt como
  `@db.Timestamptz(6)`.
- Historial viejo (20 items) archivado en `prisma/migrations-archive/`;
  baseline unico `20260703000000_baseline_v1` (23 tablas) marcado como
  aplicado con `migrate resolve`.
- Namespace `dentalgest`: aclarado — es SOLO para stack self-hosted, no es
  codigo muerto ni aplica a cloud prod.
- `prospect_leads`: frontera documentada (solo Supabase).
- Gates verdes: typecheck + 134 tests en DentaGest.
- Doc canonico en el producto: `docs/DATABASE_MIGRATION_BASELINE_2026.md`.
- Pendiente del sprint: CI con `migrate deploy` + tests de tenant safety
  (pasan al inicio de Sprint 1).

#### Runbook original (referencia)

1. **Confirmar cero drift de contenido**: `prisma migrate diff
   --from-schema-datamodel prisma/schema.prisma --to-url $DIRECT_URL` (debe
   dar vacio o diferencias solo de `prospect_leads`/objetos Supabase).
2. **Elegir fuente canonica** (recomendacion): Prisma migrate para el schema
   de la app; `supabase/migrations` SOLO para objetos Supabase (RLS,
   realtime, RPC, schemas de integracion). Documentar la frontera.
3. **Baseline Prisma**: squash del historial local a una migracion baseline y
   `prisma migrate resolve --applied <baseline>` contra prod (solo escribe la
   tabla de tracking `_prisma_migrations`; no toca tablas de la app).
4. **CI**: `prisma migrate deploy` como unico camino de schema de app a prod.
5. **Decidir namespace `dentalgest`**: aplicar la migracion 20260629 o
   retirarla del repo (hoy es codigo muerto sin aplicar).
6. Tests de seguridad de tenant (todas las queries con `organizationId`) —
   gate exigido por el adapter.

Criterio de salida: una DB nueva se reconstruye desde cero con baseline
documentado y `prisma migrate status` en prod responde limpio. Sin esto NO se
agregan tablas core.

### Sprint 1 — WorkItem dental + panel `pending`

> **AVANCE 2026-07-03 (commit `9bff9ee` en DentaGest):** puntos 1, 2 y parte
> del 3 y 5 ejecutados. Tabla `onia_core_work_items` desplegada en prod via
> `migrate deploy` (primera migracion del flujo baseline). Lib
> `lib/onia-core/`: tenant guard (bloqueo de cruce de tenant), tipos del pack
> dental, dedupe 24h, transiciones, cola pending ordenada por SLA, y
> generadores puros (no-asistio, saldo vencido, presupuesto sin respuesta).
> typecheck + 143 tests verdes. Adapter -> `installing`.
> **Falta:** wiring de generadores a crons/eventos reales, seccion pending del
> cockpit consumiendo la cola, y tests de integracion con DB.

1. Migracion `onia_core_work_items` (traducida del SQL base del contrato a
   Prisma, prefijo/namespace `dentalgest` ya existente).
2. Tipos dentales del pack: `llamar_paciente`, `confirmar_cita`,
   `cobrar_saldo`, `enviar_presupuesto`, `revisar_tratamiento`,
   `reponer_insumo`, `seguimiento_paciente`.
3. Generadores automaticos: no-asistio -> WorkItem seguimiento; saldo vencido
   -> WorkItem cobro; presupuesto sin respuesta 7d -> WorkItem seguimiento.
4. Seccion `pending` del cockpit consume WorkItems reales (cola de accion,
   no reporte).
5. Tests: creacion, dedupe, tenant scoping, transiciones de estado.

### Sprint 2 — Comment + Document + ApprovalRequest

1. Migraciones `onia_core_comments`, `onia_core_documents`,
   `onia_core_approval_requests`.
2. Hilos internos sobre paciente/tratamiento/cita (visibilidad clinica:
   caja no ve notas clinicas).
3. Documentos: consentimientos, presupuestos firmados, comprobantes —
   storage externo (Supabase storage ya disponible), `storageRef` en tabla.
4. Aprobaciones: descuento > X%, anulacion de factura interna, cambio de
   plan de tratamiento. Cola en seccion `attention` del cockpit.

### Sprint 3 — RoleAssignment + ScheduleEvent + SavedView

1. `onia_core_role_assignments`: roles finos dueno/doctor/recepcion/caja/
   asistente (matriz del beta direction: caja no toca historia clinica,
   doctor no toca config fiscal).
2. `onia_core_schedule_events`: recalls y seguimientos que no son citas
   (Appointment queda intacto como dominio clinico).
3. `onia_core_saved_views`: vistas del cockpit por rol; el panel del dueno
   se vuelve configurable sin codigo.

### Sprint 4 — Intake + onboarding pagado

1. Handler `intake.normalize` segun `intakePolicy` del contrato: formulario
   web (`lead_formulario`) primero; WhatsApp queda gated.
2. Dedupe 24h + ruteo (recepcion por defecto, round-robin si hay varias).
3. Paquete de implementacion pagada: carga inicial (ImportBatch dry-run),
   configuracion, capacitacion, checklist de entrega.

## Gates y reglas (no negociables)

- SIAT: solo readiness; cero emision fiscal real.
- WhatsApp: `external_gate`; el bot existente de DentalGest no entra al core.
- Dominio clinico intacto: Patient/ClinicalRecord/Treatment/Appointment no se
  tocan; el core los referencia via `entityType/entityId`.
- Toda migracion nueva usa el SQL base del contrato como referencia y se
  registra en el adapter (`adapters/dentagest.json` -> status `installed`).
- Cada sprint termina con `npm run typecheck && npm test` verdes en DentaGest
  y `npm run validate:onia-core` verde en Hermes.

## Cambio de estado del contrato (al aprobar este plan)

1. `distributionTargets.dentagest.status`: `hold_until_beta` ->
   `adopting_sprint_0`.
2. Actualizar validador (hoy exige `hold_until_beta` en todos los targets)
   para aceptar estados de adopcion SOLO en dentagest — doble llave a
   proposito: no se puede adoptar por accidente.
3. `adapters/dentagest.json.status`: `mapped_not_installed` -> `installing`
   cuando Sprint 1 cree la primera tabla.

## Aprobacion

- [ ] Sergio aprueba el plan y el orden de sprints.
- [ ] Sprint 0 puede arrancar de inmediato (no toca core, solo higiene).

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

1. Resolver DG-013: `npx prisma migrate status`, definir fuente canonica
   (Prisma vs Supabase), crear baseline reproducible.
2. Tests de seguridad de tenant (todas las queries con `organizationId`) —
   gate exigido por el adapter.
3. Criterio de salida: una DB nueva se reconstruye desde cero con baseline
   documentado. Sin esto NO se agregan tablas core.

### Sprint 1 — WorkItem dental + panel `pending`

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

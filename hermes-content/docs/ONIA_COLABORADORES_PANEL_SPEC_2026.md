# Onia - Spec de panel: colaboradores comerciales 2026

Estado: spec de producto lista para implementar.
Fecha: 2026-07-18.
Uso: handoff al carril A (Onia Center) e infra (Supabase/n8n) para administrar a
los 2 colaboradores comerciales en el panel. Regla de negocio:
`ONIA_COLABORADORES_COMERCIALES_SIN_INVERSION_2026.md`.

> Esta sesion (carril colaboradores/docs) NO implementa codigo del panel. Este
> documento existe para que la sesion del carril A ejecute sin re-decidir.

## Reparto por carril

| Trabajo | Carril | Ruta / recurso |
|---|---|---|
| UI y API del panel | A - Onia Center | `web-factory/apps/site/src/app/onia-center/**`, `.../api/onia-center/**` |
| Schema, RLS, alta de perfiles, crons | Infra | `supabase/migrations/**`, n8n VPS |

## Estado actual (ya existe, no rehacer)

- Vista segura por rol: `onia-center/equipo/page.tsx`. Roles `RoleId` =
  `sergio | area | arthur | seller | freelancer`. Hoy `commercialAssignees` tiene
  `seller_001`, `sergio`, `arthur`.
- API runtime: `/api/onia-center/runtime` (GET/POST/PATCH; entities `lead | task
  | note | idea`) y `/api/onia-center/auth/status|logout`.
- Schema `onia_sales` (migracion `20260620_onia_vendor_sales_panel.sql`):
  `vendor_profiles, vendor_leads, vendor_web_diagnostics, vendor_notes,
  vendor_ideas, vendor_income, vendor_commissions, vendor_followups,
  operation_trials, operation_centers, operation_evidence, weekly_scorecards,
  petty_cash_entries, nuvia_closures, operation_payouts`.

## Lo que falta construir

### A. Alta de los 2 colaboradores

- Infra: crear 2 filas en `vendor_profiles` con `territory`, `phase` (A|B),
  `start_date`. Confirmar que `onia_sales` esta aplicado en Supabase (no solo
  migracion local) y RLS activo por `owner_user_key`.
- Carril A: extender `commercialAssignees` y el selector de roles con los 2
  perfiles (o cargarlos desde `vendor_profiles`, mejor que hardcodear).

### B. Vista "Mi dia" (colaborador)

Pantalla nueva o seccion en `equipo`. Arma la lista del dia con 4 fuentes:

1. Cuota diaria fija: 20 prospectos, 10 mensajes, 5 seguimientos, 1 demo, CRM.
2. Seguimientos que vencen hoy: `vendor_followups.next_followup <= hoy`.
3. Leads nuevos de su territorio sin contactar (< 48h).
4. Tareas asignadas por Arthur/Sergio.

Muestra progreso semanal (X/meta por fila) y semaforo personal (verde/amarillo/
rojo) calculado del scorecard.

Contenido y division por colaborador (territorio, dia tipo, cuotas):
`ONIA_COLABORADORES_TAREAS_DIARIAS_2026.md`.

### C. Scorecard semanal

- Leer/escribir `weekly_scorecards` por colaborador y semana.
- Semana aprobada = `sum(cumplido)/sum(meta) >= 0.8` AND CRM 100% AND
  seguimientos al dia AND reporte entregado. Fallar un innegociable invalida la
  semana aunque llegue al 80%.
- Guardar racha de semanas verdes (para escalera y filtro dia 30).

### D. Comisiones, base y pagos

- Al registrar cobro (`vendor_income`), calcular comision en `vendor_commissions`:
  `neto_cobrado * pct(servicio, fase)`. Tabla de `pct`:

  | Servicio | Fase A | Fase B |
  |---|---:|---:|
  | SaaS mensual (1er pago) | 35% | 35% |
  | Web (solo vende) | 12% | 12% |
  | Web (vende y produce) | 12% | 18% |
  | Auditoria / diagnostico / n8n | 10% | 10% |
  | Escalera activa (4 semanas verdes) | - | web 15% |

- Base Fase B: Bs. 400/mes en `operation_payouts` si scorecard mensual >= 80%,
  marcada `recoverable`; se descuenta contra comisiones del mes.
- Estados de comision: `estimado | pendiente | aprobado | pagado | retenido |
  descontado`. Solo Sergio aprueba.
- Adelanto quincenal <= 20% de lo aprobable; cierre mensual descuenta adelantos.

### E. Bonos

- Registrar en `operation_payouts` tipo `bono`. Triggers:
  meta mensual (>4 ventas cobradas) Bs. 250; recurrencia (SaaS a 30 dias activo)
  Bs. 120; calidad (mes sin reclamos ni rescate) Bs. 150.
- Gate: solo se marcan `aprobado` si el semaforo de caja esta verde (leer del
  modulo finanzas / Fondo Onia). En rojo/amarillo quedan `diferido`.

### F. Territorio y anti-colision

- `vendor_profiles.territory`. Al crear/asignar lead, validar que el
  `responsable_actual` corresponda al territorio; bloquear contacto de lead con
  otro responsable.
- Job (n8n o server): lead con `next_followup` vencido > 7 dias -> alerta de
  reasignacion; pierde derecho de origen.

### G. Fase por colaborador y filtro dia 30

- `operation_trials.phase` (A|B) y `phase_change_at`.
- Al dia 30: marcar apto para Fase B si 3/4 semanas verdes + >=1 venta cobrada o
  pipeline real + CRM ordenado. La aprobacion final la confirma Sergio.

### H. Vista Sergio (admin)

- Comparar los 2 scorecards lado a lado, semaforos, comisiones/bonos pendientes.
- Aprobar/retener comisiones y bonos. Cierre semanal del viernes.

## Crons (infra / n8n)

- Viernes: recordatorio de cierre semanal + estado de scorecards.
- Quincenal: calcular adelantos aprobables.
- Diario: recolectar seguimientos vencidos y leads sin contactar para "Mi dia".

## Privacidad (no romper)

La vista de colaborador nunca muestra capital de Sergio, deuda, caja completa,
Fondo Onia %, lotes Nuvia ni estrategia interna. Eso vive en el modulo privado
`Capital Interno`. RLS por `owner_user_key`; escritura solo server-side o n8n con
credenciales privadas.

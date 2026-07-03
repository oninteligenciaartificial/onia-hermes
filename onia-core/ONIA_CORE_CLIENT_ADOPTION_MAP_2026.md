# ONIA Core Client Adoption Map 2026

Fecha: 2026-07-03.
Estado: mapa de clientes candidatos para adopcion de ONIA Core beta v0.2.0.
Owner: ONIA / Hermes.

Fuentes: `hermes-content/references/onia-projects-registry.json`,
`CRM_AND_PROSPECTING.md`, `PROJECTS_ORCHESTRATION.md`, contrato
`onia-core/contract.json` y trabajo real de clientes en `C:\dev\clientes\`.

## Regla

Cada cliente se adapta al core a traves de un **track vertical** ya definido en
el contrato. No se crean forks del core por cliente. Lo que cambia por cliente
es: adapter, modulos activados, permisos y vistas guardadas.

```text
Cliente -> track vertical -> adapter del producto -> ONIA Core
```

## Clientes y arquetipos mapeados

### 1. Clinicas dentales (DentalGest) — PRIMER BETA

- Track: `dentagest-clinical` (status `first_beta_active`).
- Arquetipo: clinica de 1-3 doctores, dueno como usuario principal.
- Dolor (registry): mensajes de pacientes sin registrar, presupuestos sin
  seguimiento, citas olvidadas, consultas repartidas entre canales.
- Piezas core que resuelven:
  | Dolor | Pieza core |
  |---|---|
  | Presupuestos sin seguimiento | `WorkItem` + `ApprovalRequest` |
  | Citas olvidadas / no asistio | `ScheduleEvent` + `Notification` |
  | Consultas dispersas | `Comment` + `Evidence` por paciente |
  | Dueno sin visibilidad | `SavedView` (panel del dueno) |
  | Roles recepcion/caja/doctor | `RoleAssignment` |
  | Consentimientos y comprobantes | `Document` |
- Precio vigente: Basico Bs. 320 / Profesional Bs. 750 / Clinica Bs. 1500 mensual.
- Estado: direccion aprobada, esperando plan de adopcion tecnico.

### 2. Bolivian Electric (ProveeGest) — PRIMER CLIENTE B2B REAL

- Track: `proveegest-electrico` (status `planned_after_core`).
- Cliente real activo: importadora/distribuidora electrica con 13 vendedores en
  3 sucursales (La Paz 2, Cochabamba 3, Santa Cruz 5, mas casa matriz), bot
  WhatsApp con ruteo de vendedores ya en desarrollo
  (`C:\dev\clientes\Bolivian Electric`, seller-router + Chatwoot + n8n en VPS).
- Dolor (registry + trabajo real): cotizaciones sin seguimiento, catalogo
  amplio, vendedores sin tablero comun, sucursales sin visibilidad, clientes
  empresa sin historial.
- Piezas core que resuelven:
  | Dolor | Pieza core |
  |---|---|
  | Clientes empresa sin historial | `BusinessPartner` + `Contact` |
  | Cotizaciones sin seguimiento | `WorkItem` (tipo cotizacion) + SLA |
  | Descuentos sin control | `ApprovalRequest` |
  | Vendedores sin tablero | `SavedView` por vendedor/sucursal |
  | Sucursales sin visibilidad | `Area` + `RoleAssignment` por sucursal |
  | Leads WhatsApp derivados | `WorkItem` creado por intake (WhatsApp sigue gated como integracion) |
- Nota de gate: el intake WhatsApp/Chatwoot ya existe fuera del core; el core
  solo recibe work items normalizados. La capability `whatsapp` sigue
  `external_gate` — no se activa dentro del core.
- Estado: mejor candidato para validar ProveeGest despues del beta DentalGest,
  porque ya paga, ya tiene infraestructura ONIA (VPS, n8n) y su operacion
  ejercita partners + approvals + saved views a fondo.

### 3. Pymes generales (GestiOS)

- Track: `gestios-general` (status `pending_adoption`).
- Arquetipo: pyme con operacion en Excel, seguimiento por WhatsApp sin estados,
  reportes manuales, gerencia sin visibilidad.
- Piezas core: todo el nucleo (tenant, work items, partners, approvals,
  scheduling, saved views). GestiOS es el producto que mas directo consume el
  core sin dominio vertical.
- Precio vigente: Basico Bs. 350 a Empresarial Bs. 1250 mensual.
- Estado: segunda implementacion despues de DentalGest (terreno neutral, pero
  el beta manda DentalGest por decision comercial).

### 4. Ranchos y haciendas (Ganadero OS)

- Track: `ganadero-offline` (status `pending_adoption`).
- Restriccion dura: offline-first. Cualquier pieza core adoptada debe respetar
  version/deletedAt, idempotencia y conflictos de sync visibles.
- Piezas core prioritarias: `ScheduleEvent` (vacunacion, pesaje, reproduccion),
  `Document` offline (fotos de campo con upload diferido), `SavedView`
  (reportes de hato/gastos/sanidad).
- Estado: ultimo en la fila; adoptar solo cuando el adapter offline este probado.

### 5. Arquetipos de prospeccion (pipeline CRM)

Segun `CRM_AND_PROSPECTING.md`, la prospeccion activa apunta a rubros dental,
estetica, restaurantes y negocios locales. Mapa rapido para vendedores:

| Rubro prospecto | Producto | Track core |
|---|---|---|
| Clinica dental / estetica | DentalGest | dentagest-clinical |
| Importadora / mayorista / distribuidora | ProveeGest | proveegest-electrico |
| Pyme servicios u operaciones | GestiOS | gestios-general |
| Agro / ganaderia | Ganadero OS | ganadero-offline |
| Negocio local solo presencia | Web ONIA / websites | (sin core; puerta de entrada) |

Regla comercial: las webs (websites/web-factory) son puerta de entrada; cuando
el cliente pide "seguimiento", "cotizaciones" o "reportes", se escala al
producto con core.

## Orden de adopcion recomendado

1. **DentalGest beta** — panel del dueno + work items + cobros (decidido).
2. **Bolivian Electric via ProveeGest** — valida BusinessPartner, approvals y
   saved views con un cliente B2B real que ya paga.
3. **GestiOS general** — generaliza lo aprendido en 1 y 2.
4. **Ganadero OS** — solo con adapter offline probado.

## Que falta desarrollar para cerrar el ciclo

| Pieza | Donde | Estado |
|---|---|---|
| Plan de adopcion DentalGest (migraciones + read model del panel) | DentaGest repo | pendiente |
| Definicion de `WorkItem` tipo cotizacion con SLA | contrato ya lo soporta | listo en core |
| Adapter ProveeGest (hoy usa el de GestiOS) | onia-core/adapters | pendiente: crear `proveegest.json` cuando ProveeGest se separe |
| Read-model canonico de "panel del dueno/gerente" | onia-core (definicion) | pendiente |
| Politica de intake externo -> WorkItem (WhatsApp, formularios) | onia-core (doc) | pendiente |

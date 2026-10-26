# ONIA Core Benchmark Gap Audit 2026

Fecha: 2026-06-29.
Estado: auditoria de brechas para ONIA Core alpha.
Owner: Onia / Hermes.

> Actualizacion 2026-07-03: las 8 piezas transversales recomendadas
> (BusinessPartner, RoleAssignment, Comment, Document, ApprovalRequest,
> ScheduleEvent, SavedView y WorkItem con SLA opcional) ya entraron al contrato
> beta v0.2.0, con SQL base y adaptadores de los 3 productos. La instalacion en
> repos producto sigue bloqueada hasta aprobar el plan de adopcion de DentalGest.

## Veredicto

ONIA Core alpha todavia no cumple todas las funciones que una empresa real espera.

Si lo medimos como nucleo operativo, va bien: tenant, perfiles, areas,
contactos, pendientes, evidencia, actividad, alertas e importaciones.

Si lo medimos contra un ERP/CRM completo, esta incompleto. Y eso es correcto:
ONIA Core no debe intentar ser Odoo, SAP Business One, NetSuite, Business
Central, Salesforce o HubSpot desde el primer corte.

La decision correcta es:

- ONIA Core debe cubrir el sistema comun de control y seguimiento.
- Los procesos comerciales, fiscales, inventario, clinica, hato y distribucion
  deben vivir en modulos o verticales.
- Antes de beta, ONIA Core si necesita algunas piezas transversales que hoy
  faltan.

## Sistemas revisados

Fuentes externas principales:

- Odoo Apps: https://www.odoo.com/page/all-apps
- SAP Business One: https://www.sap.com/products/erp/business-one.html
- NetSuite ERP modules: https://www.netsuite.com/portal/resource/articles/erp/erp-modules.shtml
- Zoho One: https://www.zoho.com/one/
- Microsoft Dynamics 365 Business Central: https://learn.microsoft.com/en-us/dynamics365/business-central/
- ERPNext workflows: https://docs.frappe.io/erpnext/workflows
- HubSpot CRM: https://www.hubspot.com/products/crm
- Salesforce Sales Cloud: https://www.salesforce.com/sales/cloud/
- ClickUp features: https://clickup.com/features
- Asana features: https://asana.com/features
- Notion Projects: https://www.notion.com/product/projects
- ServiceNow CSM: https://www.servicenow.com/products/customer-service-management.html
- Microsoft Dataverse security roles: https://learn.microsoft.com/en-us/power-platform/admin/database-security

Fuentes locales Onia:

- `onia-core/contract.json`
- `onia-core/adapters/gestios.json`
- `onia-core/adapters/dentagest.json`
- `onia-core/adapters/ganadero-os.json`
- `PROJECTS_ORCHESTRATION.md`
- `CRM_AND_PROSPECTING.md`
- `hermes-content/docs/historial/ONIA_CONSULTING_SERVICES_2026.md`
- `hermes-content/references/onia-projects-registry.json`
- `C:\dev\proyectos\Gestios\prisma\schema.prisma`
- `C:\dev\proyectos\DentaGest\dental-saas\prisma\schema.prisma`
- `C:\dev\proyectos\Ganaderos-Os\prisma\schema.prisma`

## Que ensenan los sistemas grandes

| Familia | Patron repetido |
|---|---|
| ERP suite | Finanzas, compras, ventas, inventario, operaciones, reportes y permisos integrados. |
| CRM | Cuentas, contactos, leads, oportunidades, tareas, reuniones, documentos, cotizaciones y reporting. |
| Work management | Tareas, responsables, fechas, formularios, plantillas, aprobaciones, dashboards, carga de trabajo y automatizaciones. |
| Service management | Casos, SLA, conocimiento, canales, metricas, handoffs y workflows. |
| Knowledge workspace | Docs, wiki, proyectos, bases configurables, busqueda y estado de informacion. |

Lectura CTO: una empresa real no compra "tareas". Compra visibilidad, control,
responsables, dinero, cumplimiento, servicio y reduccion de caos.

## Mapa de operacion real de una empresa

Una empresa opera en estos frentes:

1. Captacion: prospectos, formularios, mensajes, referidos, campanas.
2. Ventas: cuentas, contactos, pipeline, cotizaciones, pedidos, objeciones.
3. Entrega/operacion: tareas, casos, ordenes, citas, servicios, responsables.
4. Compras/proveedores: solicitudes, ordenes, recepcion, seguimiento.
5. Inventario/recursos: productos, ubicaciones, stock, movimientos, activos.
6. Finanzas: facturas, pagos, cuentas por cobrar, costos, margen, caja.
7. Equipo: usuarios, roles, permisos, turnos, carga de trabajo.
8. Servicio/soporte: tickets, reclamos, SLA, historial, conocimiento.
9. Gerencia: tableros, KPIs, alertas, reportes, decisiones.
10. Datos: importacion, exportacion, auditoria, integraciones, respaldo.

ONIA Core alpha cubre parte de 3, 7, 9 y 10. Todavia no cubre suficiente de 1,
2, 4, 5, 6 y 8, pero esas areas no todas deben ser core.

## Gap principal de ONIA Core alpha

| Brecha | Impacto | Decision recomendada |
|---|---|---|
| No existe `BusinessPartner`/`Party` | `Contact` es insuficiente para clientes empresa, proveedores, aliados y compradores B2B. | Agregar al core beta como relacion externa comun. |
| Roles son muy simples | `Profile.role` no alcanza para permisos por area, sucursal, accion o dato sensible. | Expandir `team_roles` con `PermissionPolicy` o `RoleAssignment`. |
| No hay comentarios/hilo | Un pendiente real necesita conversacion interna, notas y cambios de contexto. | Agregar `Comment` como core liviano o como parte de Evidence. |
| No hay documentos/archivos formales | Contratos, consentimientos, fotos, comprobantes y fichas no son solo notas. | Agregar `Document`/`FileAsset` en core, con storage externo configurable. |
| No hay aprobaciones | ERPNext, Asana y operacion real necesitan aprobar cotizaciones, descuentos, compras, gastos o cambios. | Agregar `ApprovalRequest` como core beta. |
| No hay calendario/evento | Citas, seguimientos, vencimientos y reuniones no deberian vivir solo como `dueAt`. | Agregar `ScheduleEvent` o `Reminder`. |
| Reportes no son configurables | Gerencia necesita vistas guardadas, filtros y KPIs por rol. | Agregar `SavedView`/`ReportDefinition` en core beta. |
| No hay formularios/intake | Las empresas capturan solicitudes, leads, compras, soporte y datos de onboarding. | Agregar `IntakeForm` como core o modulo muy temprano. |
| No hay SLA/prioridad avanzada | Soporte, ventas y operaciones necesitan vencimientos reales y escalamiento. | Extender `WorkItem` con SLA opcional antes de beta. |
| No hay automatizacion interna | Sin reglas simples, todo depende de humanos revisando tableros. | Mantener como modulo: `AutomationRule`, no core obligatorio. |
| No hay billing SaaS de ONIA Core | Para operar como SaaS necesitamos plan, seats, addons, uso y facturacion. | Dejar en plataforma ONIA/SaaS admin, no en core cliente. |
| No hay localizacion fiscal | SIAT, impuestos y contabilidad son sensibles y cambian por pais. | Mantener fuera del core. |

## Que si debe entrar antes de beta

Estas piezas son transversales y no contaminan el rubro:

1. `BusinessPartner`
   - Cliente, proveedor, aliado, comprador, empresa, veterinario, laboratorio o
     contacto comercial externo.
   - `Contact` queda como persona asociada a un partner.

2. `RoleAssignment` o `PermissionPolicy`
   - Evita depender de un solo `Profile.role`.
   - Necesario para multi-area, sucursal, datos clinicos y datos financieros.

3. `Comment`
   - Hilo interno sobre `WorkItem`, `BusinessPartner`, cita, caso o evento.

4. `Document`
   - Archivo o registro formal con tipo, entidad relacionada, propietario y
     visibilidad.

5. `ApprovalRequest`
   - Aprobaciones por monto, descuento, compra, cotizacion, gasto, cierre o
     cambio sensible.

6. `ScheduleEvent`
   - Seguimiento, cita, reunion, vencimiento, visita, entrega o recordatorio.

7. `SavedView`
   - Vista/reporting guardado por rol: gerente, vendedor, recepcion, operador.

## Que debe seguir fuera del core

| Funcion | Donde debe vivir |
|---|---|
| Productos, variantes, precios, stock | Modulo comercial/GestiOS/ProveeGest. |
| Caja, pagos, facturas | Modulo financiero/fiscal por pais. |
| SIAT | Integracion fiscal separada. |
| WhatsApp automatico | Add-on externo con gate de Meta, costo y soporte. |
| Pacientes, tratamientos, odontograma | DentalGest. |
| Animales, potreros, sanidad, reproduccion | Ganadero OS. |
| Cotizaciones tecnicas B2B | ProveeGest. |
| Chatbots | Add-on sobre procesos y datos ya ordenados. |
| Marketing/video IA | Servicio Onia, no core del sistema operativo. |

## Comparacion con sistemas Onia actuales

### GestiOS

Ya tiene:

- `Organization`, `Profile`, `Branch`.
- `Customer`, `Supplier`.
- `Product`, `ProductVariant`.
- `Order`, `Invoice`.
- `Notification`, `ActivityLog`, `AuditLog`.

Falta para operar como sistema real:

- `WorkItem` generico.
- `BusinessPartner` mas fuerte que `Customer/Supplier` cuando el cliente es B2B.
- Aprobaciones de cotizacion/descuento/compra.
- Comentarios y documentos por cuenta/pedido/tarea.
- Importacion con dry-run.
- Reportes por rol y vistas guardadas.

Conclusion: GestiOS es el primer lugar para implementar Core beta.

### DentalGest

Ya tiene:

- `Organization`, `Profile`.
- `Patient`, `ClinicalRecord`, `Treatment`, `PatientTreatment`.
- `Appointment`, `Invoice`, `InventoryItem`.
- `Notification`, `AuditLog`.

Falta para operar mejor:

- Checklists clinicos y administrativos.
- Documentos/consentimientos con permisos.
- Comentarios internos por paciente/tratamiento/cita.
- Aprobaciones sensibles.
- Importacion validada.
- Roles finos por recepcion, doctor, admin y caja.

Conclusion: DentalGest debe adoptar solo piezas seguras del Core. No convertirlo
en GestiOS.

### Ganadero OS

Ya tiene:

- `Organization`, `Profile`.
- `SyncDevice`, `SyncOperation`, `SyncConflict`.
- `Pasture`, `Animal`, `HealthEvent`, `ReproductionEvent`.
- `WeightRecord`, `LivestockMovement`, `Expense`, `Alert`, `AuditLog`.

Falta para operar mejor:

- Contactos externos: veterinarios, compradores, proveedores, transportistas.
- Checklists de campo.
- Documentos/fotos/evidencia offline.
- Reportes de hato, gastos, alertas y sanidad.
- Importacion inicial de animales.
- Work items que funcionen offline.

Conclusion: Ganadero OS necesita Core solo si el adaptador respeta offline-first.

## Nueva definicion recomendada

ONIA Core no debe prometer "todas las funciones".

ONIA Core debe prometer:

```text
La base comun para saber quien, que, para cuando, con que evidencia, bajo que
permiso y con que siguiente accion.
```

El sistema completo se arma asi:

```text
ONIA Core
  + modulo comercial
  + modulo financiero/fiscal
  + modulo soporte/servicio
  + vertical dental / ganadero / distribucion
  + integraciones externas
  + IA/chatbot cuando los datos ya estan ordenados
```

## Roadmap recomendado

### Core beta minimo

Agregar antes de instalar en productos:

1. `BusinessPartner`.
2. `RoleAssignment` o `PermissionPolicy`.
3. `Comment`.
4. `Document`.
5. `ApprovalRequest`.
6. `ScheduleEvent`.
7. `SavedView`.
8. `WorkItem` con SLA opcional.

### Primer producto

Implementar en GestiOS:

1. Dashboard gerencial.
2. Pendientes y responsables.
3. Clientes/proveedores como partners.
4. Comentarios y evidencia.
5. Aprobaciones simples.
6. Importacion dry-run.
7. Vistas guardadas.

### Despues

1. Adaptar DentalGest sin tocar dominio clinico.
2. Adaptar Ganadero OS con offline.
3. Crear ProveeGest con catalogo, cotizaciones y conocimiento tecnico.
4. Recien despues ofrecer chatbots conectados al sistema.

## Preguntas para acelerar decision

Responder estas preguntas define el alcance real sin seguir adivinando:

1. Primer cliente o rubro para probar ONIA Core beta: GestiOS, DentalGest,
   Ganadero OS o ProveeGest/importadoras?
2. Lo venderemos primero como SaaS mensual, implementacion pagada o ambos?
3. Necesitamos facturacion/contabilidad desde el primer beta o basta exportar y
   dejar SIAT fuera?
4. El usuario principal sera dueno/gerente, administrador, vendedor,
   recepcionista u operario?
5. El primer dolor que queremos vender es orden de tareas, seguimiento de
   clientes, cotizaciones, inventario, agenda o reportes gerenciales?
6. Debe funcionar offline en el primer beta o solo Ganadero OS lo requiere?
7. Queremos que ONIA Core tenga documentos/archivos desde el inicio?
8. Queremos aprobaciones desde el inicio o despues de la primera venta?

## Decision de arquitectura

No cambiar el contrato actual hasta responder las preguntas comerciales
principales.

Propuesta:

- Mantener ONIA Core alpha como base validada.
- Crear ONIA Core beta con las 8 piezas transversales anteriores.
- Implementar primero en GestiOS porque es el terreno mas neutral.
- No tocar DentalGest ni Ganadero OS hasta que el adaptador beta este cerrado.

# ONIA Core Research Result 2026

Fecha: 2026-06-29.
Estado: alpha canonico, no instalado en productos.
Owner: Onia / Hermes.

## Veredicto CTO

ONIA Core debe ser el nucleo operativo comun de Onia, no un ERP completo.

La primera version tiene que resolver organizacion, responsabilidad,
seguimiento, evidencia, actividad, alertas y cargas controladas. Esa base sirve
para GestiOS, DentalGest, Ganadero OS y futuros verticales sin mezclar rubros.

No conviene construir un sistema separado por cada rubro desde cero. Conviene
un core comun y adaptadores por negocio:

- ONIA Core: preguntas, entidades y reglas comunes.
- Producto SaaS: GestiOS, DentalGest, Ganadero OS.
- Vertical: reglas propias del rubro.
- Integracion: WhatsApp, SIAT, TR4, bots, proveedores externos.

## Lo que se investigo

### Fuentes locales

- `C:\dev\proyectos\onia-hermes\onia-core\contract.json`
- `C:\dev\proyectos\onia-hermes\PROJECTS_ORCHESTRATION.md`
- `C:\dev\proyectos\onia-hermes\CRM_AND_PROSPECTING.md`
- `C:\dev\proyectos\onia-hermes\hermes-content\docs\historial\ONIA_CONSULTING_SERVICES_2026.md`
- `C:\dev\proyectos\onia-hermes\hermes-content\references\onia-projects-registry.json`
- `C:\dev\proyectos\Gestios\docs\ARCHITECTURE.md`
- `C:\dev\proyectos\Gestios\prisma\schema.prisma`
- `C:\dev\proyectos\DentaGest\dental-saas\docs\DENTALGEST.md`
- `C:\dev\proyectos\DentaGest\dental-saas\docs\DENTAL_ADDON_ROADMAP.md`
- `C:\dev\proyectos\DentaGest\dental-saas\prisma\schema.prisma`
- `C:\dev\proyectos\Ganaderos-Os\docs\ARCHITECTURE.md`
- `C:\dev\proyectos\Ganaderos-Os\docs\DATA_MODEL.md`
- `C:\dev\proyectos\Ganaderos-Os\docs\OFFLINE_FIRST.md`
- `C:\dev\proyectos\Ganaderos-Os\prisma\schema.prisma`

### Fuentes externas

- [Odoo multi-company](https://www.odoo.com/documentation/19.0/applications/general/companies/multi_company.html): separa companias, registros compartidos y datos especificos por compania dentro de una misma base.
- [ERPNext workflows](https://docs.frappe.io/erpnext/workflows): modela aprobaciones, estados y condiciones sin forzar un proceso unico.
- [Salesforce tasks and events data model](https://developer.salesforce.com/docs/platform/data-models/guide/tasks-events.html): separa actividades, participantes y objetos relacionados.
- [Microsoft Dataverse security roles](https://learn.microsoft.com/en-us/power-platform/admin/database-security): usa roles para controlar acceso a apps y datos, con alcance por rol.

## Principios que quedan

1. Tenant primero: todo dato operativo comun debe tener `organizationId`.
2. Rubro despues: el core no debe saber si el negocio es dental, ganadero,
   comercio, importadora electrica o agencia.
3. Trabajo comun: una empresa necesita saber que esta pendiente, quien responde,
   que estado tiene y que evidencia existe.
4. Seguridad por defecto: roles, actividad y trazabilidad son parte del core.
5. Integraciones fuera: WhatsApp, SIAT, TR4, chatbots y proveedores externos son
   gates, no base obligatoria.
6. Offline no es universal: Ganadero OS necesita offline-first; GestiOS y
   DentalGest no deben heredar esa complejidad si no la necesitan.
7. Sin migraciones prematuras: ningun producto adopta ONIA Core hasta que el
   contrato y adaptadores pasen beta.

## Core inicial aprobado

| Entidad | Por que existe |
|---|---|
| `Organization` | Tenant raiz de la empresa, clinica, finca o cuenta. |
| `Member/Profile` | Persona interna con rol, permisos y estado. |
| `Area` | Departamento, sucursal logica o grupo responsable. |
| `Contact` | Persona relacionada con cliente, proveedor, caso o area. |
| `WorkItem` | Tarea, solicitud, caso, tramite o pendiente comun. |
| `ProcessChecklist` | Rutina repetible para operar sin depender de memoria humana. |
| `Evidence` | Nota, archivo, foto, link o metadata que respalda avance. |
| `ActivityEvent` | Historial auditable de acciones y cambios. |
| `Notification` | Alerta interna para seguimiento humano. |
| `ImportBatch` | Cargas CSV/Excel/API con dry-run y errores trazables. |

## Que queda fuera del core

| Bloque | Clasificacion |
|---|---|
| Productos, stock, variantes, caja | Modulo comercial activable. |
| Pacientes, tratamientos, odontograma | Vertical DentalGest. |
| Animales, potreros, eventos sanitarios | Vertical Ganadero OS. |
| Cotizaciones B2B avanzadas | Vertical ProveeGest/importadoras. |
| WhatsApp automatico | Integracion externa con costo y soporte. |
| SIAT/facturacion fiscal | Integracion externa de alto riesgo. |
| TR4/ERP externo | Integracion por discovery pagado. |
| Chatbots por negocio | Add-on sobre datos y procesos ya ordenados. |

## Resultado por producto

### GestiOS

GestiOS es el primer candidato natural para adoptar ONIA Core, pero no debe ser
dueno del core. Ya tiene `Organization`, `Profile`, `Branch`, `Customer`,
`Supplier`, `Order`, `ActivityLog`, `AuditLog`, `Notification` e inventario.

Riesgo: si ONIA Core nace dentro de GestiOS, el core se contamina con comercio,
pedidos, productos y caja.

Decision: GestiOS adopta ONIA Core cuando exista beta, usando
`onia-core/adapters/gestios.json`.

### DentalGest

DentalGest ya tiene un dominio clinico fuerte: pacientes, historia clinica,
tratamientos, citas, facturas, inventario dental, notificaciones y auditoria.

Riesgo: convertir DentalGest en ERP generico degrada el producto dental.

Decision: DentalGest solo adopta patrones comunes de tenant, roles, evidencia,
actividad, alertas y reportes. Lo clinico sigue siendo vertical.

### Ganadero OS

Ganadero OS necesita organizacion, perfiles, eventos, alertas y auditoria, pero
su diferencial es offline-first. Ya tiene `SyncDevice`, `SyncOperation`,
`SyncConflict`, versiones y `deletedAt` para entidades de campo.

Riesgo: meter un core online-first rompe el valor del producto rural.

Decision: Ganadero OS adopta ONIA Core solo con adaptador offline-aware.

## Resultado por futuro rubro

Para importadoras mayoristas como el caso electrico, el nombre de familia no
debe encerrar el rubro tecnico. El producto debe funcionar para importadoras y
distribuidoras con vertical por rubro.

Nombre recomendado de familia futura: `ProveeGest`.

Ejemplo:

- Producto: `ProveeGest`.
- Vertical: electrico.
- Cliente: importadora o mayorista electrica.
- Modulos extra: catalogo tecnico, equivalencias, cotizaciones B2B, fichas,
  proveedores, precios por volumen, knowledge base y eventualmente TR4.

Asi una importadora de helados puede usar la misma familia sin cargar funciones
electricas.

## Arquitectura propuesta

```text
onia-hermes/onia-core
  contract.json
  schema/base-schema.sql
  adapters/gestios.json
  adapters/dentagest.json
  adapters/ganadero-os.json

product repos
  adoptan solo cuando ONIA Core este beta
  implementan migraciones propias desde su adaptador
  mantienen reglas de dominio por separado
```

## Orden de desarrollo

1. Mantener ONIA Core canonico en Hermes.
2. Validar contrato, schema base y adaptadores con `npm run validate:onia-core`.
3. Revisar beta con foco comercial: que permita vender organizacion operativa.
4. Crear migracion por producto, empezando por GestiOS.
5. Adaptar DentalGest con alcance clinico controlado.
6. Adaptar Ganadero OS con offline-first.
7. Crear ProveeGest cuando el core ya no cambie por cada rubro.

## Criterio para beta

ONIA Core puede pasar a beta cuando:

- el contrato JSON este validado;
- el SQL base este revisado;
- los tres adaptadores existan y pasen validacion;
- haya plan de rollback por producto;
- no haya dependencias obligatorias de WhatsApp, SIAT, TR4 ni bots;
- exista una primera pantalla o flujo vendible para gerencia.

## Siguiente paso recomendado

Construir un MVP de ONIA Core en GestiOS solo despues de cerrar beta:

- dashboard gerencial de pendientes;
- areas y responsables;
- work items;
- evidencia/actividad;
- alertas internas;
- importacion dry-run.

Eso vende orden operativo antes de vender automatizacion.

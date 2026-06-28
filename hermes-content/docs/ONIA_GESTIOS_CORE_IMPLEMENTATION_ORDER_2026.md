# ONIA GestiOS Core Implementation Order 2026

Estado: orden operativo canonico.
Fecha: 2026-06-28.
Owner: ONIA / Hermes.
Uso: convertir la decision del core inicial en una secuencia ejecutable para
GestiOS, ProveeGest, DentalGest, Ganadero OS y clientes piloto.

## Veredicto

ONIA no debe construir un ERP universal desde cero.

La ruta correcta es endurecer GestiOS como core operativo reutilizable, usar
ONIA Center como tablero interno de control y abrir verticales solo cuando el
core ya soporte la operacion comun.

Orden de producto:

```text
ONIA Center controla.
GestiOS Core ejecuta.
ProveeGest verticaliza distribucion B2B.
DentalGest queda separado como clinica dental.
Ganadero OS queda separado por offline y dominio rural.
Bolivian Electric valida ProveeGest Electrico.
```

La razon es practica: GestiOS ya tiene organizacion, usuarios, roles, planes,
add-ons, clientes, productos, inventario, ventas, compras, caja, auditoria,
notificaciones e import/export. Crear otro core ahora duplicaria trabajo y
subiria el riesgo comercial.

## Fuentes revisadas

- `hermes-content/docs/ONIA_INITIAL_CORE_BLUEPRINT_2026.md`.
- `hermes-content/references/onia-projects-registry.json`.
- `PROJECTS_ORCHESTRATION.md`.
- `CRM_AND_PROSPECTING.md`.
- `CLIENT_CONTENT_PRODUCTION_SYSTEM.md`.
- `HIGGSFIELD_CLIENT_SALES_PLAYBOOK.md`.
- `hermes-content/docs/ONIA_CONSULTING_SERVICES_2026.md`.
- `C:\dev\proyectos\Gestios\prisma\schema.prisma`.
- `C:\dev\proyectos\Gestios\lib\auth.ts`.
- `C:\dev\proyectos\Gestios\lib\plans.ts`.
- `C:\dev\proyectos\Gestios\lib\permissions.ts`.
- `C:\dev\proyectos\Gestios\lib\business-types.ts`.
- `C:\dev\proyectos\Gestios\docs\ARCHITECTURE.md`.
- `C:\dev\proyectos\Gestios\docs\DATABASE.md`.
- `C:\dev\proyectos\Gestios\docs\PRODUCT_SECTIONS_AND_ADDONS.md`.
- `C:\dev\proyectos\DentaGest\dental-saas\docs\DENTALGEST.md`.
- `C:\dev\proyectos\DentaGest\dental-saas\docs\DENTAL_ADDON_ROADMAP.md`.
- `C:\dev\proyectos\Ganaderos-Os\docs\ARCHITECTURE.md`.
- `C:\dev\proyectos\Ganaderos-Os\docs\OFFLINE_FIRST.md`.
- `C:\dev\proyectos\Ganaderos-Os\docs\DATA_MODEL.md`.
- `C:\dev\clientes\Bolivian Electric\docs\product\mvp-scope.md`.
- `C:\dev\clientes\Bolivian Electric\docs\technical\data-model.md`.

## Rol de cada sistema

| Sistema | Rol correcto | Lo que no debe hacer ahora |
|---|---|---|
| ONIA Center | Control interno, backlog, readiness, evidencia, aprobaciones, prioridades y seguimiento de ONIA | Operar el negocio diario del cliente o guardar datos sensibles sin alcance |
| GestiOS Core | Base operativa comun para pymes: tenant, usuarios, roles, planes, clientes, productos, inventario, ventas, compras, caja, reportes, auditoria, import/export | Convertirse en ERP pesado, prometer SIAT/WhatsApp/TR4 sin proveedor validado |
| ProveeGest | Vertical B2B sobre GestiOS Core para importadoras, mayoristas y distribuidoras | Ser repo nuevo antes de validar el core |
| DentalGest | Vertical clinico dental independiente | Mezclarse dentro de GestiOS o perder foco clinico |
| Ganadero OS / HatoGest | Vertical rural/offline independiente | Meter ganado y sync offline en GestiOS Core |
| Bolivian Electric OS | Cliente piloto para validar ProveeGest Electrico | Ser un fork hardcodeado o escribir en TR4 sin contrato y pruebas |

## Core existente que se debe proteger

GestiOS ya trae una base suficiente para empezar. Primero hay que endurecerla,
no reemplazarla.

| Area | Base existente en GestiOS | Decision |
|---|---|---|
| Tenant | `Organization`, `Profile`, `organizationId`, `getTenantProfile()` | Mantener como contrato central |
| Roles | `Role`, permisos en `lib/permissions.ts` | Auditar cobertura antes de ampliar |
| Planes | `PlanType`, `OrgAddon`, `lib/plans.ts` | Mantener add-ons separados del plan base |
| Catalogo | `Category`, `Product`, `ProductVariant`, `attributeSchema` | Usar para rubros con atributos |
| Clientes | `Customer` | Expandir a contactos/CRM solo cuando el flujo lo requiera |
| Ventas | `Order`, `OrderItem`, caja y pagos internos | No prometer facturacion fiscal |
| Compras | `Supplier`, `PurchaseOrder`, `PurchaseOrderItem` | Usar para reposicion y proveedores |
| Operacion | `Notification`, `ActivityLog`, `AuditLog`, sesiones | Usar como backbone de seguimiento |
| Import/export | Rutas existentes y validadores | Estandarizar dry-run y errores por fila |

## Piezas comunes que faltan antes de ProveeGest

Estas son las extensiones que tienen sentido para empresas reales B2B. Deben
entrar en GestiOS Core solo cuando haya contrato de datos, migracion y prueba.

| Pieza | Por que importa | Regla |
|---|---|---|
| Contactos por cliente | Empresas B2B tienen comprador, encargado, almacen, finanzas y gerencia | No reemplaza `Customer`; lo complementa |
| Solicitud comercial | Permite registrar pedido, duda, reclamo o requerimiento sin convertirlo en venta | Debe tener estado, responsable, prioridad y historial |
| Cotizacion | Importadoras venden por solicitud, lista, disponibilidad y aprobacion | No debe prometer integracion fiscal |
| Tareas/SLA | El gerente necesita seguimiento de pendientes y vencidos | Debe ser simple, asignable y auditable |
| Import batch | Los datos entran por CSV/XLSX o sistemas heredados | Siempre con dry-run, errores por fila y rollback logico |
| Knowledge item | Base comercial para vendedores y chatbot futuro | Primero interno; chatbot despues |
| External adapter | TR4, WhatsApp, n8n, pagos o SIAT | Bloqueado por defecto hasta discovery y credenciales |

## Orden de construccion

### Fase 0 - Contrato y baseline

Objetivo: dejar claro que existe hoy, que se puede tocar y que queda fuera.

Acciones:

1. Registrar este orden como documento canonico.
2. Crear checklist local en GestiOS para el primer sprint.
3. Correr baseline en GestiOS antes de cambios de codigo:
   - `npm run lint`
   - `npx tsc --noEmit`
   - `npm test`
   - `npm run build`
4. Crear mapa de rutas y acciones que escriben datos.
5. Marcar integraciones sensibles como bloqueadas por defecto.

Cierre:

- Documento canonico aprobado.
- Checklist local creado.
- Estado real de checks registrado.

### Fase 1 - Seguridad multi-tenant y permisos

Objetivo: que el core sea confiable para varios clientes.

Acciones:

1. Auditar rutas `app/api/**` y server actions.
2. Verificar que toda lectura/escritura operativa use `organizationId`.
3. Mantener `getTenantProfile()` como entrada normal para rutas privadas.
4. Revisar permisos por rol en ventas, inventario, compras, caja, clientes y
   configuracion.
5. Agregar pruebas focalizadas donde haya riesgo cross-tenant.

Cierre:

- No hay rutas operativas sin tenant scope conocido.
- Riesgos restantes quedan documentados por archivo.

### Fase 2 - Core operativo vendible

Objetivo: fortalecer lo que ayuda a vender y operar.

Orden:

1. Dashboard operativo.
2. Clientes y contactos.
3. Productos, categorias, variantes y stock minimo.
4. Proveedores y ordenes de compra.
5. Ventas/pedidos/caja.
6. Notificaciones y actividad.
7. Reportes gerenciales.
8. Import/export con dry-run.

Cierre:

- Un comercio real puede operar dia a dia sin integraciones externas.
- Los add-ons no bloquean el uso base.

### Fase 3 - Rubros y familia B2B

Objetivo: permitir que el mismo core se adapte a rubros sin crear productos
falsamente separados.

Regla de nombres:

- Producto/familia: `ProveeGest`.
- Implementacion por rubro: `ProveeGest Electrico`, `ProveeGest Repuestos`,
  `ProveeGest Insumos`, `ProveeGest Industrial`, etc.
- En el sistema: `businessType`, modulos y schemas de atributos definen el
  rubro.

Primera vertical:

```text
ProveeGest Electrico
```

Por que no llamarlo solo `ElectroGest`: el cliente tipo no vende solo
electronica; puede ser importador, mayorista o distribuidor de material
electrico, componentes, iluminacion, proteccion, tableros o ferreteria
especializada. El nombre comercial debe vender distribucion B2B, no solo una
categoria de producto.

Cierre:

- Nuevo rubro definido en GestiOS sin duplicar repo.
- Catalogo tecnico soporta atributos electricos.
- Solicitudes y cotizaciones quedan preparadas para B2B.

### Fase 4 - ProveeGest Electrico piloto

Objetivo: validar el core con un caso realista sin poner en riesgo al cliente.

Cliente de validacion:

```text
Bolivian Electric
```

Alcance permitido:

- CRM gerencial.
- Solicitudes.
- Cotizaciones.
- Catalogo tecnico.
- Importacion controlada.
- Base de conocimiento comercial.
- Reportes.
- Adaptadores read-only o dry-run.

Bloqueado hasta discovery pagado y credenciales:

- Escritura en TR4.
- WhatsApp automatico.
- Portal cliente.
- Integracion real-time.
- SIAT/facturacion fiscal.
- Reemplazo total del ERP.

### Fase 5 - Integraciones controladas

Objetivo: conectar sin comprometer soporte ni margen.

Orden:

1. Import/export manual.
2. n8n dedicado por cliente.
3. Adaptador read-only.
4. Webhook con firma y logs.
5. Escritura externa solo con contrato, backups, rollback y ambiente de prueba.
6. WhatsApp solo con Meta/proveedor validado.

Ninguna integracion entra al precio base.

### Fase 6 - Extraccion de paquete compartido

Objetivo: evitar duplicacion cuando ya haya patrones estables.

Esto se hace despues, no ahora.

Candidatos:

- Tipos de planes y feature gates.
- Helpers de tenant safety.
- Auditoria.
- Import/export.
- Notificaciones.
- UI patterns de superadmin.

No se extrae nada si solo existe en un producto o si todavia cambia cada semana.

## Primer sprint ejecutable

Frentes:

- Arquitectura: mantener fronteras y orden.
- Backend/Data: auditar tenant, modelos y rutas.
- Seguridad: revisar permisos, secrets y rutas sensibles.
- Producto: definir rubros y paquete vendible.
- QA: baseline y pruebas focalizadas.
- Docs/Ops: mantener el contrato vivo.

Checklist:

1. Crear `docs/ONIA_CORE_IMPLEMENTATION_ORDER.md` en GestiOS.
2. Correr baseline de GestiOS.
3. Auditar rutas `app/api/**` por `organizationId`.
4. Auditar modelos Prisma para decidir si `Contact`, `CommercialRequest` y
   `Quote` entran en la primera migracion.
5. Definir `businessType` para ProveeGest Electrico.
6. Crear backlog tecnico con P0/P1/P2.
7. Implementar solo P0/P1 que habiliten venta o seguridad.

## Criterios de aceptacion

El core inicial esta listo para abrir ProveeGest cuando:

- GestiOS pasa lint, typecheck, tests y build.
- No hay rutas criticas sin scope por `organizationId`.
- Roles basicos cubren admin, operador/cajero, inventario y reportes.
- El cliente puede operar catalogo, ventas, compras, clientes y reportes.
- Import/export tiene dry-run o validacion antes de escribir.
- Integraciones sensibles estan apagadas por defecto.
- ProveeGest Electrico puede configurarse sin fork ni repo nuevo.

## No hacer

- No crear repo nuevo para ProveeGest todavia.
- No meter DentalGest dentro de GestiOS.
- No meter Ganadero OS dentro de GestiOS.
- No vender SIAT como feature activa.
- No prometer WhatsApp automatico sin proveedor y credenciales.
- No escribir en sistemas externos sin discovery, contrato, pruebas y rollback.
- No crear nombres genericos tipo `LocalGest` como estrategia principal.
- No construir modulos solo porque "algun rubro podria necesitarlos".

## Decision final

El core inicial de ONIA se construye asi:

```text
1. Documentar orden y contrato.
2. Endurecer GestiOS Core.
3. Abrir ProveeGest como familia B2B sobre GestiOS.
4. Validar ProveeGest Electrico con Bolivian Electric.
5. Mantener DentalGest y Ganadero OS separados.
6. Integrar solo cuando haya discovery, credenciales y margen.
```


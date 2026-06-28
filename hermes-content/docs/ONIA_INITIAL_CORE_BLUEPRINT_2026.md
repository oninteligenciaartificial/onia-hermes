# ONIA Initial Core Blueprint 2026

Estado: blueprint operativo inicial.
Fecha: 2026-06-28.
Uso: definir que se construye primero como core reutilizable de ONIA, que se
mira desde ONIA Center y que queda dentro de cada producto vertical.

## Veredicto

Si, lo miramos desde ONIA Center.

Pero ONIA Center no debe ser el producto core que usan los clientes. ONIA Center
es el panel interno para dirigir, auditar, priorizar y registrar evidencia. El
core ejecutable inicial debe nacer desde GestiOS, porque ya tiene la base mas
cercana a empresas reales: organizaciones, perfiles, planes, roles, clientes,
productos, inventario, ventas, compras, sucursales, pagos, notificaciones,
superadmin y add-ons.

Decision:

```text
ONIA Center controla.
GestiOS Core ejecuta.
DentalGest especializa clinicas.
ProveeGest especializa importadoras/mayoristas/distribuidoras.
HatoGest/Ganadero OS queda separado por offline y dominio rural.
Bolivian Electric valida ProveeGest Electrico como implementacion cliente.
```

## Arquitectura recomendada

```text
ONIA Center
  -> backlog, proyectos, readiness, leads, evidencias, aprobaciones
  -> NO contiene logica operativa profunda del cliente

GestiOS Core
  -> tenant, usuarios, roles, planes, modulos, clientes, tareas, ventas,
     inventario ligero, reportes, auditoria, notificaciones y add-ons
  -> base para GestiOS Empresas y ProveeGest

Verticales
  -> DentalGest: dominio clinico dental
  -> ProveeGest: distribucion B2B sobre GestiOS Core
  -> HatoGest/Ganadero OS: dominio rural/offline separado
```

## Que se reutiliza de cada proyecto

| Proyecto | Reutilizar para el core | No copiar al core |
|---|---|---|
| DentalGest | onboarding SaaS, superadmin, billing manual, plan limits, audit logs, tenant safety, runbooks, add-on discipline | pacientes, odontograma, tratamientos, agenda clinica, recetas, reglas clinicas |
| GestiOS | base principal: organizacion, roles, planes, clientes, productos, inventario, pedidos, caja, proveedores, reportes, add-ons | promesas SIAT, WhatsApp automatico, cualquier integracion sin proveedor validado |
| ONIA Center | control interno, proyectos, tareas, readiness, evidencia, aprobaciones, roles internos, conectores | logica operativa profunda de clientes, ERP o datos sensibles sin scope |
| Bolivian Electric OS | CRM gerencial, cotizaciones, solicitudes, SLA, imports, knowledge base, dry-run adapters | sistema cliente hardcodeado, datos reales, TR4 write, dependencia de credenciales |
| Ganadero OS | versionado, soft delete, sync/offline, dominio separado, organizationId estricto | mezclar ganado con GestiOS general o ProveeGest |

## Core inicial obligatorio

El primer core no debe intentar cubrir todo. Debe cubrir lo que se repite en
productos vendibles:

1. Tenant y seguridad
   - `Organization`.
   - `Profile`.
   - `Membership` o usuario ligado a organizacion.
   - `organizationId` obligatorio en todo dato operativo.
   - roles simples por producto.

2. Modulos activables
   - plan mensual;
   - add-ons;
   - feature gates;
   - limites por plan;
   - estado: activo, bloqueado, pendiente de setup.

3. CRM operativo
   - clientes/contactos;
   - solicitudes;
   - estado;
   - responsable;
   - siguiente accion;
   - historial.

4. Tareas y seguimiento
   - tarea;
   - responsable;
   - fecha;
   - prioridad;
   - evidencia;
   - estado.

5. Inventario comercial ligero
   - producto;
   - SKU/codigo;
   - categoria;
   - stock;
   - stock minimo;
   - proveedor;
   - movimiento;
   - sucursal.

6. Reportes gerenciales
   - ventas;
   - pedidos/cotizaciones;
   - alertas;
   - stock bajo;
   - tareas vencidas;
   - pipeline.

7. Auditoria
   - quien hizo que;
   - sobre que entidad;
   - cuando;
   - metadata segura;
   - evidencia si aplica.

8. Importacion/exportacion
   - CSV/XLSX validado;
   - errores por fila;
   - dry-run;
   - batches;
   - export CSV.

9. Conectores bloqueados por defecto
   - WhatsApp;
   - n8n;
   - pagos;
   - SIAT;
   - sistemas externos como TR4.

Ningun conector sensible entra como feature activa sin checklist, credenciales
seguras, precio, responsable y prueba.

## Primera familia construible

### GestiOS Core

Producto base para pymes operativas.

Debe quedar estable antes de abrir mas verticales:

- organizaciones;
- usuarios/roles;
- planes y add-ons;
- clientes;
- productos/inventario;
- ventas/pedidos;
- proveedores/compras;
- notificaciones;
- reportes;
- auditoria;
- import/export.

### ProveeGest

ProveeGest debe ser una configuracion vertical de GestiOS Core, no un repo nuevo
todavia.

Agrega lenguaje y modulos de distribucion B2B:

- cotizaciones;
- solicitudes CRM;
- catalogo tecnico;
- vendedores/responsables;
- sucursales;
- productos con atributos tecnicos;
- stock por sucursal;
- base de conocimiento comercial;
- importaciones controladas si el cliente lo justifica.

Version inicial:

```text
ProveeGest Electrico
```

Caso de validacion:

```text
Bolivian Electric
```

## Frontera con DentalGest

DentalGest no debe convertirse en GestiOS. Mantiene su dominio:

- pacientes;
- citas;
- tratamientos;
- odontograma;
- presupuestos clinicos;
- pagos de pacientes;
- recordatorios;
- documentos clinicos.

Lo que si puede compartir como patron:

- tenant safety;
- superadmin;
- pagos manuales;
- planes;
- add-ons;
- audit logs;
- onboarding;
- docs/runbooks;
- self-hosting administrado.

## Frontera con HatoGest/Ganadero OS

HatoGest no entra al core inicial de GestiOS porque tiene necesidad offline y
modelo de dominio distinto.

Se reutilizan patrones:

- `organizationId`;
- roles simples;
- versionado;
- `deletedAt`;
- sync offline;
- eventos append-only;
- conflicto visible.

No se reutiliza:

- modelo animal;
- sanidad;
- reproduccion;
- potreros;
- movimientos ganaderos.

## ONIA Center como tablero de construccion

ONIA Center debe mostrar:

- proyecto `GestiOS Core`;
- proyecto `ProveeGest`;
- proyecto `DentalGest`;
- proyecto `Bolivian Electric OS`;
- proyecto `StockCam`;
- estado de readiness por modulo;
- tareas por fase;
- evidencia de auditoria;
- bloqueos de integraciones;
- aprobaciones pendientes.

No debe mostrar:

- datos clinicos reales de DentalGest;
- datos reales de clientes sin autorizacion;
- credenciales;
- tokens;
- dumps;
- detalles privados sin scope.

## Roadmap de construccion

### Fase 0 - Auditoria y contrato core

Salida esperada:

- matriz de modelos comunes;
- matriz de modelos verticales;
- rutas compartibles;
- rutas no compartibles;
- checklist de tenant safety;
- decision de que se implementa en GestiOS primero.

### Fase 1 - GestiOS Core duro

Prioridad:

1. tenant y roles;
2. planes/add-ons;
3. clientes/contactos;
4. tareas/estados;
5. productos/inventario;
6. reportes;
7. auditoria;
8. import/export.

### Fase 2 - ProveeGest Electrico

Prioridad:

1. cotizaciones y solicitudes;
2. catalogo tecnico;
3. atributos por rubro;
4. base de conocimiento comercial;
5. stock por sucursal;
6. dashboard gerencial;
7. importacion CSV/XLSX.

No entra:

- TR4 write;
- integracion real-time;
- WhatsApp automatico;
- portal cliente;
- compras/importaciones profundas.

### Fase 3 - Integraciones y adaptadores

Solo despues de validar fase 1 y 2:

- n8n dedicado por cliente;
- WhatsApp con Meta validado;
- adapters read-only;
- pagos;
- SIAT solo si hay proveedor y margen.

## Reglas de ejecucion

1. No crear repo nuevo para ProveeGest todavia.
2. No mover DentalGest dentro de GestiOS.
3. No duplicar core en Bolivian Electric si puede quedar como vertical de
   ProveeGest.
4. No vender integraciones profundas sin discovery pagado.
5. No construir funciones que no ayuden a vender, operar o reducir riesgo.
6. Todo modulo nuevo debe tener:
   - producto/familia;
   - cliente objetivo;
   - precio o decision comercial;
   - owner;
   - evidencia;
   - checklist de seguridad;
   - criterio de exito.

## Siguiente accion tecnica

1. Registrar esta arquitectura en ONIA Center.
2. Corregir rutas canonicas del registry.
3. Crear backlog de auditoria core.
4. Comparar modelos Prisma de DentalGest, GestiOS y Ganadero OS.
5. Elegir el primer corte de GestiOS Core.
6. Recien despues tocar codigo de GestiOS.

## Decision final

```text
ONIA no empieza construyendo "un ERP universal".
ONIA empieza endureciendo GestiOS Core y lo controla desde ONIA Center.
DentalGest queda vertical maduro separado.
ProveeGest nace como primera vertical B2B sobre GestiOS.
Bolivian Electric valida ProveeGest Electrico.
```

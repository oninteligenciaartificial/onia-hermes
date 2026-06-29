# ONIA Core DentalGest Beta Direction 2026

Fecha: 2026-06-29.
Estado: decision de producto para beta inicial.
Owner: ONIA / Hermes.

## Respuestas de Sergio

1. Primer beta: DentalGest.
2. Modelo comercial: SaaS mensual e implementacion pagada.
3. Finanzas/facturacion: desde el inicio.
4. Usuario principal: dueno.
5. Dolor principal: todas las areas relevantes.

## Veredicto

Si. Estas preguntas eran para saber que desarrollar primero, pero la respuesta
"todas" no significa construir todo con la misma profundidad desde el dia uno.

Significa que DentalGest beta debe partir desde una vista de dueno que conecte
todo lo importante:

- agenda;
- pacientes;
- presupuestos/tratamientos;
- cobros;
- facturacion interna;
- tareas y seguimientos;
- inventario basico;
- reportes gerenciales.

El dueno no quiere aprender diez modulos. Quiere abrir DentalGest y saber:

```text
Que paso hoy?
Cuanto se vendio?
Cuanto falta cobrar?
Quien no vino?
Que presupuestos estan pendientes?
Que paciente necesita seguimiento?
Que tratamiento sigue abierto?
Que stock o insumo requiere atencion?
Que debe hacer mi equipo manana?
```

## Decision de arquitectura

DentalGest sera el primer beta de ONIA Core.

La beta no debe convertir DentalGest en un ERP generico. Debe convertirlo en un
sistema de direccion para clinicas dentales.

La regla es:

```text
ONIA Core organiza.
DentalGest clinico decide el dominio.
Finanzas/facturacion se incluye desde el inicio.
SIAT real queda como integracion fiscal gated.
```

## Facturacion desde inicio

Decision: si, DentalGest beta debe tener facturacion/cobros desde el inicio.

Alcance permitido desde beta:

- facturas/proformas internas;
- pagos;
- saldo pendiente;
- cuentas por cobrar;
- historial de cobros por paciente/tratamiento;
- reportes de ingresos;
- exportacion contable;
- preparacion para SIAT.

Alcance no permitido sin gate:

- emision fiscal SIAT real automatica;
- firma digital;
- CUIS/CUFD/CUF real;
- anulaciones fiscales reales;
- envio real al SIN;
- proveedor SIAT sin autorizacion/verificacion.

Motivo: el Servicio de Impuestos Nacionales maneja modalidades de facturacion en
linea, autorizacion de sistemas, pruebas funcionales, pruebas piloto,
asociacion de proveedor/cliente y codigos fiscales como CUIS, CUFD y CUF. Por
eso SIAT debe tratarse como integracion externa regulada, no como una tabla mas.

Fuentes oficiales revisadas:

- https://www.impuestos.gob.bo/index.php/nota_prensa/el-sin-amplia-hasta-el-30-de-septiembre-el-plazo-para-la-implementacion-de-la-facturacion-en-linea/
- https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/autorizacion-de-sistemas/proceso-de-autorizacion
- https://www.impuestos.gob.bo/wp-content/uploads/2025/10/BIT21.pdf

## Producto que se debe vender

DentalGest beta debe venderse como:

```text
DentalGest para duenos de clinicas:
agenda, pacientes, tratamientos, cobros, seguimiento y reportes en un solo panel.
```

No venderlo todavia como:

- ERP dental completo;
- sistema fiscal SIAT garantizado;
- WhatsApp automatico;
- IA que atiende pacientes;
- contabilidad completa.

## Modelo comercial

El modelo correcto es ambos:

1. SaaS mensual:
   - mantiene ingreso recurrente;
   - permite planes por tamano de clinica;
   - no bloquea venta por setup alto.

2. Implementacion pagada:
   - cubre configuracion, carga inicial, capacitacion y adaptacion;
   - protege margen;
   - evita que ONIA regale consultoria.

Oferta recomendada:

| Nivel | Producto | Uso |
|---|---|---|
| Basico | SaaS mensual | Clinica pequena que quiere agenda/pacientes/cobros simples. |
| Pro | SaaS + configuracion | Clinica que necesita seguimiento y reportes. |
| Clinica | SaaS + implementacion | Dueno que quiere ordenar equipo, cobros, tratamientos y reportes. |
| Fiscal add-on | SIAT readiness / proveedor | Solo despues de validar integracion y responsabilidad fiscal. |

## Desarrollo por capas

### Capa 1: Panel del dueno

Primero construir una pantalla de mando:

- citas de hoy;
- citas perdidas/no asistio;
- pacientes nuevos;
- tratamientos activos;
- presupuestos pendientes;
- cobros del dia;
- cuentas por cobrar;
- alertas de seguimiento;
- actividad del equipo;
- inventario critico.

Esta pantalla vende el producto.

### Capa 2: Seguimiento operacional

Agregar `WorkItem` dental:

- llamar paciente;
- confirmar cita;
- cobrar saldo;
- enviar presupuesto;
- revisar tratamiento;
- reponer insumo;
- cargar documento;
- aprobar descuento/anulacion.

### Capa 3: Finanzas clinicas

No contabilidad completa. Si control financiero operativo:

- factura/proforma interna;
- pago;
- saldo;
- medio de pago;
- estado: borrador, emitida, pagada, parcial, anulada;
- relacion con paciente/tratamiento;
- exportacion.

### Capa 4: Documentos y evidencia

- consentimiento;
- radiografia o archivo externo referenciado;
- presupuesto firmado;
- comprobante de pago;
- nota clinica;
- evidencia de seguimiento.

### Capa 5: Permisos

El dueno ve todo.

Roles iniciales:

- dueno/admin;
- doctor;
- recepcion;
- caja;
- asistente.

Regla: recepcion no debe ver lo que no necesita; caja no debe modificar historia
clinica; doctor no debe tocar configuracion fiscal.

### Capa 6: SIAT readiness

Preparar estructura sin activar emision fiscal real:

- datos fiscales de la clinica;
- datos fiscales del paciente/cliente;
- catalogo de servicios facturables;
- conceptos exportables;
- auditoria de cambios;
- proveedor SIAT configurable;
- ambiente de prueba separado;
- no guardar secretos fiscales en repo.

## Que significa "todas" en desarrollo

Se desarrolla todo como flujo conectado, pero se entrega por prioridad:

1. Dueno: panel y decisiones.
2. Agenda/pacientes: entrada diaria.
3. Tratamientos/presupuestos: dinero futuro.
4. Cobros/facturacion interna: dinero real.
5. Seguimientos: recuperacion de pacientes y presupuestos.
6. Reportes: control.
7. Inventario basico: alertas, no ERP de almacen.
8. SIAT readiness: preparacion, no emision real hasta gate.

## Backlog inicial para DentalGest

### Sprint 1

- Definir owner dashboard.
- Crear mapa de KPIs.
- Revisar schema actual de DentalGest.
- Mapear `Invoice`, `Payment`, `Appointment`, `PatientTreatment` y
  `Notification` contra ONIA Core.
- Definir `WorkItem` dental.

### Sprint 2

- Implementar read model del dashboard.
- Crear tareas/seguimientos basicos.
- Mostrar saldos pendientes.
- Mostrar presupuestos/tratamientos activos.
- Agregar alertas para no asistencia y seguimiento.

### Sprint 3

- Documentos/evidencia.
- Permisos finos.
- Exportacion financiera.
- SIAT readiness sin emision real.

### Sprint 4

- Implementacion pagada/onboarding:
  - carga inicial;
  - configuracion de clinica;
  - capacitacion;
  - reporte de activacion;
  - checklist de entrega.

## Pregunta respondida

La pregunta si era para saber que desarrollar.

Con tus respuestas, el desarrollo correcto ahora es:

```text
ONIA Core beta orientado a DentalGest,
con panel de dueno,
agenda + pacientes + tratamientos + cobros + seguimiento + reportes,
facturacion interna desde el inicio,
SIAT preparado pero gated.
```

## Siguiente accion tecnica

No tocar producto todavia sin cerrar beta contract.

Siguiente paso en Hermes:

1. Actualizar `contract.json` para marcar DentalGest como primer beta.
2. Actualizar `adapters/dentagest.json` con modelo comercial, usuario principal
   y politica fiscal.
3. Validar `npm run validate:onia-core`.
4. Luego abrir trabajo en `C:\dev\proyectos\DentaGest\dental-saas`.

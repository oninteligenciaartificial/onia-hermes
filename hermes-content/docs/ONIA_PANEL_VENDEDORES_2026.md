# ONIA Panel de Vendedores 2026

Estado: MVP principal definido y UI inicial implementada en `/vendedores`.
Actualizado: 2026-06-20.

## Veredicto

El panel de vendedores no debe reemplazar Notion al inicio. Debe funcionar como
la capa diaria donde el vendedor entiende que hacer, registra lo importante y
Sergio puede revisar ventas, ideas, ingresos y comisiones.

Fuente oficial por ahora:

```text
Notion -> CRM Vendedores ONIA
```

Panel operativo:

```text
Control Tower -> /vendedores
```

Base propia preparada:

```text
Supabase -> schema onia_sales
```

## Regla principal

```text
SIN DATOS COMPLETOS, NO HAY COMISION APROBADA.
```

El panel debe repetir esta regla en todo lugar donde se hable de comisiones.

## Que maneja el panel

### Inicio

- Leads de hoy.
- Seguimientos pendientes.
- Ventas calientes.
- Comisiones pendientes.
- Ingresos del mes.
- Acciones del vendedor para hoy.

### Leads

Cada lead debe guardar:

- empresa;
- rubro;
- ciudad;
- contacto publico;
- canal principal;
- fuente;
- vendedor origen;
- responsable actual;
- estado pipeline;
- producto sugerido;
- dolor probable;
- prioridad;
- ultimo contacto;
- proximo seguimiento;
- permiso de contacto;
- datos completos.

### Venta de webs

Checklist minimo:

- Tiene web.
- Tiene Google Maps.
- Tiene WhatsApp visible.
- Tiene formulario.
- Oferta clara.
- Se ve profesional.
- Captura consultas.
- Tiene seguimiento despues del contacto.

Salida recomendada:

- Landing de Captacion.
- Web Profesional.
- Web Pro ONIA.
- Auditoria Express.
- CRM simple.
- Portal/Sistema Web si hay login, dashboard o base de datos.

### Notas importantes

El vendedor debe registrar:

- objeciones;
- preguntas tecnicas;
- promesas hechas;
- cosas que Sergio debe revisar;
- contexto de la llamada;
- proximo paso real.

### Lluvia de ideas

Usar para:

- nichos que aparecen seguido;
- paquetes web nuevos;
- servicios que piden los clientes;
- frases que convierten;
- objeciones repetidas;
- oportunidades de upsell;
- ideas para contenido comercial.

### Ingresos y comisiones

Registrar:

- servicio vendido;
- monto cobrado;
- monto neto si aplica;
- fecha de pago;
- comprobante o referencia;
- comision estimada;
- estado de comision: pendiente, aprobada, pagada, retenida o descontada;
- estado de entrega/onboarding.

Regla: la comision estimada no es pago aprobado. ONIA aprueba despues de validar
cobro real, datos completos y margen sano.

## Estados pipeline

1. Nuevo
2. Investigado
3. Calificado
4. Mensaje preparado
5. Aprobado para contactar
6. Contactado
7. Respondio
8. Demo agendada
9. Demo realizada
10. Propuesta enviada
11. Ganado
12. Perdido
13. No apto
14. No contactar

## Roles

### Vendedor

Puede:

- registrar leads;
- preparar mensajes;
- actualizar seguimiento;
- anotar objeciones e ideas;
- registrar venta cobrada como pendiente;
- ver su comision estimada.

No puede:

- aprobar su propia comision;
- prometer descuentos no aprobados;
- cambiar precios canonicos;
- contactar leads asignados a otro vendedor;
- marcar ganado sin monto cobrado.

### Sergio/Admin

Puede:

- ver todos los vendedores;
- reasignar responsables;
- aprobar contacto;
- aprobar o retener comisiones;
- revisar ingresos;
- convertir ideas en servicios/ofertas;
- bloquear clientes como no contactar.

## Datos y arquitectura

### Fase 1

UI del panel con datos demo y captura local para validar flujo diario.

### Fase 2

Conectar a Notion o espejo Supabase mediante rutas server-side. No exponer
credenciales al navegador.

### Fase 3

Automatizaciones:

- n8n revisa seguimientos diarios;
- Telegram alerta a vendedor/Sergio;
- Hermes sugiere producto, mensaje y proximo paso;
- comisiones pasan a aprobacion cuando hay cobro y datos completos.

## Tablas Supabase preparadas

Migracion local:

```text
supabase/migrations/20260620_onia_vendor_sales_panel.sql
```

Schema:

```text
onia_sales
```

Tablas:

- `vendor_profiles`
- `vendor_leads`
- `vendor_web_diagnostics`
- `vendor_notes`
- `vendor_ideas`
- `vendor_income`
- `vendor_commissions`
- `vendor_followups`

RLS queda activo y cerrado por defecto. La escritura debe hacerse con rutas
server-side o n8n usando credenciales privadas.

## Fuentes canonicas

- `CRM_AND_PROSPECTING.md`
- `NOTION_VENDOR_CRM_SCHEMA_2026.md`
- `ONIA_VENDOR_MANUAL_2026.md`
- `ONIA_VENDOR_SALES_PLAYBOOK_2026.md`
- `ONIA_PRICING_2026.md`
- `hermes-content/references/onia-projects-registry.json`
- `hermes-content/references/onia-vendor-panel-20260620.json`

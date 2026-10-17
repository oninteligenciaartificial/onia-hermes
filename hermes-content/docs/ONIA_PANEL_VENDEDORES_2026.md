# Onia Panel de Vendedores 2026

Estado: MVP principal definido, UI inicial implementada en `/vendedores` y
tablero de operacion 60 dias agregado en `/vendedores/operacion`.
Actualizado: 2026-06-22.

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

Para el acuerdo Arthur Fuentes:

```text
SI NO ESTA EN ONIA CENTER O NOTION, NO CUENTA PARA COMISION NI REVISION SEMANAL.
```

## Requisitos semanales Arthur

Estos requisitos viven en el acuerdo operativo de 60 dias y deben revisarse
desde `/vendedores` todos los viernes.

| Area | Minimo semanal |
|---|---:|
| Prospectos nuevos registrados completos | 35 |
| Contactos, mensajes o llamadas reales | 25 |
| Seguimientos realizados | 20 |
| Llamadas o audios comerciales reales | 8 |
| Reuniones o demos agendadas | 3 |
| Propuestas, auditorias o diagnosticos enviados | 3 |
| Videos grabados ONIA/Nuvia | 5 |
| Piezas editadas o carruseles listos | 3 |
| Publicaciones o piezas listas para aprobar | 3 |
| CRM/ONIA Center actualizado | 100% viernes |
| Mejora interna ONIA/Nuvia/ONIA Center | 2 |
| Reporte semanal de lo hecho | 1 |

Semana aprobada: minimo 80% del total, sin fallar CRM/ONIA Center,
seguimientos ni reporte semanal.

## Que maneja el panel

### Inicio

- Leads de hoy.
- Seguimientos pendientes.
- Ventas calientes.
- Caja operativa visible, estados de pago y comisiones pendientes.
- Ingresos del mes.
- Acciones del vendedor para hoy.

### Operacion 60 dias

Esta pantalla orquesta el acuerdo Arthur/ONIA/Nuvia dentro del sistema sin
mostrar capital interno de Sergio/ONIA a colaboradores.

Debe mostrar:

- estado general de operacion sin montos sensibles;
- deuda previa como responsabilidad Sergio/ONIA, sin monto visible;
- capital interno como privado Sergio/ONIA;
- caja chica por centro, sin monto visible para colaboradores;
- meta operativa por ventas, evidencia y Fondo Onia;
- centros separados: Onia Servicios, Nuvia, Onia Media y Fondo/Caja;
- Onia Media como centro contable de ingresos/activos, usando apps Onia base
  sin duplicar gasto;
- costos directos de Onia Media solo cuando sean externos, incrementales o
  premium prorrateados por uso real;
- un solo Fondo Onia para Onia Servicios, Nuvia y Onia Media, con origen
  etiquetado por centro;
- modo proteccion 60 dias para Onia Servicios: 40% Fondo Onia, Arthur hasta
  50% sin capital Onia solo si entrega todo aprobado sin rescate y
  Sergio/riesgo minimo 10%;
- escala de intervencion de Sergio: si Sergio corrige, reestructura, termina,
  rescata o dirige demasiado una entrega que Arthur marco como casi hecha,
  Arthur baja de categoria y Sergio sube segun evidencia;
- clasificacion obligatoria de servicios nuevos o no listados antes de vender:
  categoria, precio, alcance, costos, herramientas, responsable, riesgo y
  porcentaje Arthur/Fondo ONIA/Sergio;
- existencia mensual pagada por Fondo Onia y cubierta temporalmente por Sergio
  solo si el fondo no alcanza durante los 60 dias;
- recuperacion interna de capital desde excedente de Fondo Onia antes de bonos
  o retiros extraordinarios, sin mostrar monto a colaboradores;
- reglas de reparto por participacion real;
- evidencias obligatorias para que algo cuente;
- obligaciones semanales de Arthur y Sergio;
- reglas de rentabilidad y cierre quincenal de Nuvia;
- calendario de calculo y pago;
- adelantos quincenales hasta 20% sobre pago ganado/aprobable de Arthur;
- cierre mensual final con saldo, descuentos o compensaciones.

Regla: esta pantalla es el tablero de revision semanal y del dia 60. Si una
venta, gasto, pieza, llamada, entrega o cierre no esta registrado aqui o en
Notion, no debe usarse para discutir pagos o porcentajes.

Regla de privacidad: inversion de Sergio/ONIA, caja real, deuda exacta, runway,
plan de compras, estrategia de hardware y recuperacion de capital viven en el
modulo privado `Capital Interno`. Arthur, vendedores y clientes no ven ese
modulo.

Regla de pago: el adelanto quincenal no se calcula sobre facturacion bruta. Se
calcula sobre el pago ganado/aprobable de Arthur despues de cobro real,
evidencia, CRM completo, costos y margen. El cierre mensual descuenta adelantos
y completa el saldo o compensa diferencias si hubo reclamos, devoluciones,
entregas no aprobadas o datos faltantes.

### Modelo operativo de empresa

El panel debe separar nivel, permisos y dinero. No todos los colaboradores son
vendedores, socios o empleados.

Jerarquia operativa:

```text
Sergio / Direccion ONIA
-> Responsable de area futuro
-> Arthur / Coordinador Comercial-Operativo en prueba
-> Vendedor o colaborador operativo
-> Freelancer por entregable
```

Arthur queda por 60 dias como rol nivel 2: arriba de un vendedor normal porque
puede hacer llamadas, seguimiento, contenido, carruseles, capacitaciones,
Higgsfield y mejoras internas; pero abajo de direccion porque no aprueba
precios, gastos, descuentos, pagos, uso premium de herramientas, contactos
sensibles ni reparto de utilidades.

Regla laboral: si Onia formaliza a alguien como empleado, el sistema debe pasar
ese perfil a ruta legal/laboral con contrato, presupuesto y obligaciones. Si no
esta formalizado, usar las categorias colaborador comercial, comisionista o
freelancer por entregable y pagar solo por resultado/evidencia aprobada.

### Capital Interno Sergio/ONIA

Modulo privado. No debe aparecer en PDF de Arthur ni en vistas de colaborador.

Fuente canonica:

- `hermes-content/docs/ONIA_INTERNAL_CAPITAL_ALLOCATION_2026.md`
- `hermes-content/docs/ONIA_NUVIA_ACCOUNTING_MODEL_2026.md`
- `hermes-content/docs/ONIA_SUSTAINABILITY_DASHBOARD_SPEC_2026.md`
- `hermes-content/docs/historial/orquestacion-vieja/ONIA_COMPANY_OPERATING_MODEL_2026.md`
- `hermes-content/references/onia-vendor-panel-20260620.json` en
  `operation_60_days.internal_capital_allocation`.

Debe manejar:

- asignacion interna del capital;
- deuda exacta;
- reserva de herramientas y operacion;
- matriz riesgo / inversion / rentabilidad / facilidad;
- servicios priorizados por semana;
- meta semanal de caja;
- plan semanal privado de Sergio CEO;
- compras aprobadas;
- inventario y activos;
- inversiones Nuvia por lote y propietario real del capital;
- contabilidad Nuvia por lote/campana: costos, Fondo Onia, Reserva Nuvia,
  variable Arthur y utilidad Sergio/ONIA;
- excepcion Lote Nuvia 001 con Bs. 300 Arthur y Bs. 300 Sergio;
- campanas Meta Ads;
- home lab y ahorro de costos;
- mejoras diarias de Sergio CEO;
- compras bloqueadas hasta que haya ingresos nuevos.

Regla de decision interna:

```text
Riesgo -> inversion requerida -> rentabilidad probable -> facilidad semanal.
```

Para la semana del 22 al 28 de junio de 2026, el modulo privado debe priorizar:

- auditorias express;
- diagnosticos + plan;
- landings/webs cerradas;
- n8n simple como upsell;
- Onia Motor Local Growth como caballito de batalla recurrente;
- implementaciones solo con anticipo y alcance escrito;
- Onia Media Studio solo como paquete cerrado, no videos sueltos;
- Nuvia solo con costo completo y margen bruto minimo 40%;
- YouTube/ONIA Media channels como activo de largo plazo, no caja inmediata;
- home lab solo si reduce costo o riesgo;
- MacBook Pro, PC completa, GPU grande y servidor grande bloqueados hasta
  ingresos nuevos o cliente que los justifique.

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
- Web Pro Onia.
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

Regla: la comision estimada no es pago aprobado. Onia aprueba despues de validar
cobro real, datos completos y margen sano.

### Catalogo operativo y caballito de batalla

Antes de vender un servicio desde Onia Center, debe existir como registro del
catalogo operativo. El servicio prioritario es `ONIA Motor Local Growth`:

```text
Setup Bs. 2.900 + mensualidad Bs. 1.900.
```

Objetivo:

```text
5 clientes Growth activos = Bs. 9.500/mes
Fondo ONIA 40% = Bs. 3.800/mes
```

Eso cubre la existencia mensual conservadora de Onia. Starter sirve como
entrada, Pro sirve como upgrade, pero Growth es el paquete que el tablero debe
empujar por defecto.

El panel debe bloquear servicios que no tengan:

- precio setup y precio mensual;
- centro contable;
- costos excluidos;
- evidencia requerida;
- responsable de entrega;
- limite de herramientas premium;
- comision/variable;
- margen minimo;
- checklist de cierre y entrega.

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
- `operation_trials`
- `operation_centers`
- `operation_evidence`
- `weekly_scorecards`
- `petty_cash_entries`
- `nuvia_closures`
- `operation_payouts`

RLS queda activo y cerrado por defecto. La escritura debe hacerse con rutas
server-side o n8n usando credenciales privadas.

## Fuentes canonicas

- `CRM_AND_PROSPECTING.md`
- `NOTION_VENDOR_CRM_SCHEMA_2026.md`
- `ONIA_VENDOR_MANUAL_2026.md`
- `ONIA_VENDOR_SALES_PLAYBOOK_2026.md`
- **Precios: `onia-platform/lib/subscription-plans.ts` (planes) y `onia-platform/lib/pricing.ts` (add-ons)** — la fuente. Transcritos junto a sus funciones en `ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md`. *(`ONIA_PRICING_2026.md` quedó degradado el 2026-08-27: es historia de junio, no fuente.)*
- `hermes-content/docs/historial/orquestacion-vieja/ONIA_COMPANY_OPERATING_MODEL_2026.md`
- `hermes-content/docs/ONIA_CASH_ENGINE_SERVICE_CATALOG_2026.md`
- `hermes-content/references/onia-projects-registry.json`
- `hermes-content/references/onia-vendor-panel-20260620.json`

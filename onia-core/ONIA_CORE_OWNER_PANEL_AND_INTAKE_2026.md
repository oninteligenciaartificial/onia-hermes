# ONIA Core Owner Panel and Intake 2026

Fecha: 2026-07-03.
Estado: diseno canonico del read-model owner_dashboard y la politica de intake.
Owner: Onia / Hermes.

Contrato: `contract.json > readModels.owner_dashboard` y `> intakePolicy`.
Este doc es el detalle de implementacion; el contrato es la fuente de verdad.

## Panel del dueno (owner_dashboard)

### Principio

El dueno abre el producto y en UNA pantalla responde:

```text
Que paso hoy? Cuanto entro? Que falta cobrar? Que esta pendiente y de quien?
Que requiere mi atencion? Que hace mi equipo manana?
```

Es un read-model: consultas de solo lectura sobre entidades core. Ningun
producto duplica datos para armarlo; deriva vistas de sus tablas alineadas al
contrato.

### Secciones core (fijas para todos los verticales)

| Seccion | Contenido | Consulta tipo |
|---|---|---|
| `today` | Eventos de hoy (ScheduleEvent) + work items que vencen hoy | `schedule_event where start_at::date = today` + `work_item where due_at::date = today` |
| `money` | Pendientes de cobro (work items tipo cobro), aprobaciones de monto abiertas | `work_item where type in (cobro, saldo) and status = open` |
| `pending` | Work items abiertos por responsable, vencidos primero, con ultimo comentario | `work_item where status = open order by sla_due_at nulls last, due_at` |
| `team` | Actividad reciente por miembro, asignaciones activas | `activity_event last 24h group by actor` |
| `attention` | Notificaciones no leidas + aprobaciones esperando decision | `notification where read = false` + `approval_request where status = pending` |
| `partners` | Partners/contactos nuevos y sin actividad reciente | `business_partner order by created_at desc` + sin ActivityEvent en 30d |

### Reglas

1. Toda seccion respeta `RoleAssignment`: el dueno ve todo; otros roles ven
   su area/scope.
2. Los KPIs de rubro se agregan como `SavedView` del pack vertical, no como
   secciones core nuevas.
3. Dinero real (facturas, pagos) vive en el modulo financiero del producto;
   el core solo muestra pendientes y aprobaciones. El panel une ambos.
4. Cada tarjeta del panel enlaza a la entidad origen (work item, evento,
   aprobacion) — el panel no es un reporte, es una cola de accion.

### Extensiones por vertical (contrato)

- DentalGest: citas hoy/no asistio, presupuestos pendientes, tratamientos
  abiertos, cobros del dia, inventario critico.
- ProveeGest: cotizaciones por vendedor, vencidas por SLA, descuentos por
  aprobar, pipeline por sucursal, clientes sin actividad 30d.
- GestiOS: tareas vencidas por area, carga por responsable, importaciones.
- Ganadero OS: eventos sanitarios pendientes, alertas de campo, dispositivos
  sin sincronizar.

## Politica de intake (canal externo -> WorkItem)

### Principio

El core no habla con WhatsApp, formularios ni telefonos. Los conectores viven
fuera (n8n, Chatwoot, web-factory) y empujan **intake normalizado**:

```json
{
  "channel": "whatsapp_chatwoot",
  "receivedAt": "2026-07-03T14:00:00Z",
  "contact": { "phone": "+591...", "name": "..." },
  "partnerHint": "empresa XYZ",
  "message": "quiero cotizar 20 luminarias",
  "areaHint": "ventas-lapaz"
}
```

### Flujo de normalizacion

1. **Match de partner/contact:** buscar `Contact` por telefono/email; si tiene
   `BusinessPartner`, adjuntarlo. Si no existe, crear Contact minimo (nunca
   inventar datos: solo lo que el canal entrego).
2. **Dedupe:** si existe WorkItem abierto del mismo contacto+canal en 24h, se
   agrega `Comment` al item existente en vez de crear otro.
3. **Crear WorkItem:** `type` segun canal (`lead_conversacion`,
   `lead_formulario`, `solicitud_manual`), `priority` default del canal,
   payload en `metadata`, canal de origen siempre trazado.
4. **Ruteo:** asignar `ownerId` por regla del area destino:
   - `round_robin`: rota entre miembros activos del area (patron ya probado
     en el seller-router de Bolivian Electric: 13 vendedores, 3 sucursales).
   - `fixed_owner`: dueno o encargado fijo del canal.
   La asignacion queda en `ActivityEvent` (auditable).
5. **SLA opcional:** el pack vertical define `slaPolicy` por tipo (ej.
   cotizacion B2B responde en 4h habiles).
6. **Clasificacion IA (opcional, fuera del core):** un servicio con embeddings
   puede sugerir `type`/`priority` mas finos; la sugerencia entra como
   metadata y un humano o regla la confirma. El core nunca depende de la IA.

### Gates

- WhatsApp/Chatwoot: sigue `external_gate whatsapp` del contrato. El canal se
  activa por cliente solo cuando Meta/proveedor/costos estan validados.
- ImportBatch: todo lote entra con `dryRun = true` primero; sin excepciones.

### Pendiente de implementacion (cuando se abra DentalGest)

1. Endpoint/handler `intake.normalize` en el motor (GestiOS base).
2. Reglas de ruteo configurables por area (tabla o config del pack).
3. Conector n8n de referencia: Chatwoot -> intake normalizado (reusar lo de
   Bolivian Electric).
4. Vista `pending` del panel alimentada por estos work items desde el dia uno.

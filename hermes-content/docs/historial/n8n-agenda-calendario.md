# n8n Workflows — Agenda y Calendario

Sistema completo de gestión de agenda para Sergio/ONIA via Google Calendar + Cal.com + Telegram.

## Estado verificado 2026-06-29

- `ONIA - Agenda: Cal.com Booking` existe en n8n, ID `X6gd3EBW7Y3z9xTg`, y
  esta activo.
- Webhook esperado: POST `/webhook/calcom-booking`.
- Credenciales enlazadas:
  - Google Calendar: `Google Calendar account`, ID `a3FResZHqQ32ptyt`.
  - Telegram: `Telegram account`, ID `r8y2CN5RyOEIDce3`.
- Cal.com self-host ya apunta a:
  `https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/calcom-booking`.
- Por seguridad, Cal solo envia `BOOKING_CREATED` a este workflow. El workflow
  actual crea evento en Google Calendar y manda Telegram; no tiene ramas para
  `BOOKING_REQUESTED`, `BOOKING_RESCHEDULED`, `BOOKING_CANCELLED` ni botones de
  aceptar/cancelar.
- Siguiente mejora obligatoria antes de usar agenda masiva: crear flujo de
  solicitud pendiente -> Telegram/ONIA Center -> aceptar/cancelar/reasignar ->
  crear/actualizar Google Calendar.

## Workflows creados

### 1. ONIA - Agenda: Briefing Diario
**ID:** `qdAEP9seSxp5whXh`

- **Trigger:** Cron diario 8:00am Bolivia (12:00 UTC)
- **Flujo:** GCal → formatear → Telegram
- **Resultado:** Mensaje con todos los eventos del día

**Ejemplo de mensaje:**
```
📅 Agenda lunes, 9 de junio de 2026

⏰ 10:00 - 11:00  Reunión Epic Motion
⏰ 15:00 - 16:00  Demo DentalGest
```

---

### 2. ONIA - Agenda: Crear Evento
**ID:** `PEo2XKM1l1bgEwIr`

- **Trigger:** Telegram — detecta mensajes `/agendar`
- **Flujo:** Telegram → IF /agendar → parsear → GCal create → confirmar
- **Resultado:** Crea evento en GCal y responde con confirmación

**Formato de comando:**
```
/agendar Título | fecha hora-inicio-hora-fin | descripción
```

**Ejemplos:**
```
/agendar Reunión Epic Motion | jueves 10am-11am | Ver propuesta web
/agendar Call de ventas | mañana 3pm-4pm
/agendar Demo ONIA | 15/06 10:00-11:00 | Prospecto nuevo
```

**Fechas soportadas:** hoy, mañana, lunes/martes/.../domingo, DD/MM

---

### 3. ONIA - Agenda: Recordatorios
**ID:** `uwqJDGwkkWJaFtLU`

- **Trigger:** Cron cada 30 minutos
- **Flujo:** GCal (próximos 30min) → formatear → Telegram
- **Resultado:** Aviso cuando hay evento en los próximos 30 minutos

**Nota:** Si no hay eventos próximos, el workflow no envía mensaje (comportamiento correcto).

---

### 4. ONIA - Agenda: Cal.com Booking
**ID:** `X6gd3EBW7Y3z9xTg`

- **Trigger:** Webhook POST `/calcom-booking`
- **Flujo:** Cal.com webhook → parsear → GCal create → notificar Sergio
- **Resultado:** Cuando cliente agenda vía Cal.com, el evento aparece en GCal y Sergio recibe aviso

**URL del webhook n8n:**
```
https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/calcom-booking
```

---

## Configuración requerida (una vez)

### 1. Variable n8n: SERGIO_TELEGRAM_CHAT_ID

En n8n → Settings → Variables:
- Nombre: `SERGIO_TELEGRAM_CHAT_ID`
- Valor: tu chat ID de Telegram

Para obtener el chat ID: enviar mensaje a `@get_id_bot` en Telegram.

### 2. Activar los 4 workflows

Los workflows se crean en estado inactivo. Activar en:
`https://n8n-sergio-n8n.hqdqgh.easypanel.host`

### 3. Cal.com self-host (para flujo de clientes)

Ver guía completa:
```bash
node scripts/vps_install_calcom.js
```

Configurar webhook en Cal.com → Settings → Developer → Webhooks:
- URL: `https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/calcom-booking`
- Evento: `BOOKING_CREATED`

### 4. Aplicar migracion en Supabase privado compartido

Schema preparado:

```text
supabase/migrations/20260618_onia_booking_ops.sql
```

Tablas:

- `onia_ops.booking_sources`
- `onia_ops.booking_events`
- `onia_ops.booking_followups`

RLS queda activo sin politicas publicas. n8n debe escribir con credencial server-side/service role, no desde navegador. Supabase es la base compartida de proyectos ONIA; Cal solo aporta eventos de booking a `onia_ops`.

### 5. Cal.com / Cal.diy deploy kit

Runbook:

```text
hermes-content/docs/ONIA_CALCOM_SELF_HOST_RUNBOOK_2026.md
```

Kit:

```bash
node scripts/vps_install_calcom.js --kit hermes-content/deploy/calcom
```

---

## Skill asociada

`hermes-content/skills/agenda-calendario.md`

Hermes interpreta intenciones de agenda y delega ejecución a estos workflows vía Telegram.

---

## Credenciales en uso

| Credential | ID n8n |
|---|---|
| Google Calendar account | `AIf6aLd0Q1yAqXKj` |
| Telegram account | `PR6bb4aGfhM6xdGs` |

# Skill: agenda-calendario

## Objetivo
Gestionar el cronograma de Sergio y ONIA via Google Calendar + Cal.com desde Telegram.
Hermes interpreta intenciones de agenda, n8n ejecuta contra GCal API.

## Comandos

### /agenda hoy
Muestra todos los eventos del día actual desde Google Calendar.

### /agenda semana
Muestra cronograma de los próximos 7 días.

### agendar <datos>
Crea un evento. Datos mínimos requeridos:
- Título
- Fecha (ej: "jueves", "15/06", "mañana")
- Hora inicio y fin
- Descripción opcional

Ejemplo: `agendar Reunión Epic Motion | jueves 10am-11am | Ver propuesta web`

> **Importante (bot Alfredhq):** enviar **sin `/`** al inicio. El bot Hermes en el VPS
> rechaza slash-commands desconocidos. `agendar ...` (sin slash) se enruta a
> `hermes-command telegram` → `_agendar` → webhook n8n `agendar-create` → Google Calendar.
> El router (`scripts/hermes_command_center.py`) acepta ambas formas; `/agendar` sirve al invocar el CLI directo.

### /cancelar <evento>
Cancela o elimina evento existente. Requiere confirmación explícita.

### /recordatorio <evento> <tiempo>
Agrega recordatorio adicional a evento existente.
Ejemplo: `/recordatorio Reunión Epic Motion 1 hora antes`

## Parsing de fechas (Bolivia UTC-4)
- "hoy" → fecha actual
- "mañana" → fecha actual + 1
- "lunes/martes..." → próximo día de semana
- "15 de junio" → fecha literal
- "en 2 horas" → hora actual + 2

## Flujos n8n asociados
- `ONIA - Agenda: Briefing Diario` — cron 8am → GCal → Telegram
- `ONIA - Agenda: Crear Evento` — Telegram trigger → GCal create → confirm
- `ONIA - Agenda: Recordatorios` — cron 30min → GCal check → Telegram alert
- `ONIA - Agenda: Cal.com Booking` — Cal.com webhook → GCal create → Telegram notify

## Formato de confirmación de evento creado
```
✅ Evento agendado:
📅 [Título]
🗓 [Fecha] [Hora inicio] - [Hora fin]
📝 [Descripción]
🔗 Link GCal: [link]
```

## Formato de briefing diario
```
📅 Agenda del [día], [fecha]:

[HH:MM] [Título evento 1]
[HH:MM] [Título evento 2]
...

Sin eventos: "Día libre ✓"
```

## Cal.com — links de booking para clientes
- URL base: `https://cal.onia.ai` (o dominio configurado en VPS)
- Tipos de evento disponibles:
  - `consulta-inicial` — 30min, gratis
  - `reunion-proyecto` — 60min, para clientes activos
  - `demo-onia` — 45min, para prospectos
- Cuando cliente agenda → webhook → GCal crea evento → Hermes notifica a Sergio por Telegram

Nota ONIA 2026:
- `cal.onia.ai` depende de DNS/deploy; si no resuelve, usar agenda manual por Telegram.
- Agregar `auditoria-pagada` como tipo de evento de 60min solo si ya pago.
- El webhook debe registrar booking en Google Calendar, Telegram y Supabase privado `onia_ops.*`.
- No abrir todo el calendario a prospectos: usar bloques controlados y minimo 4 horas de anticipacion.

## Reglas
- Timezone siempre America/La_Paz (UTC-4)
- Confirmación requerida antes de cancelar eventos
- No crear eventos en el pasado sin confirmación explícita
- Eventos de clientes via Cal.com → GCal automático, sin intervención manual
- Buffer mínimo entre reuniones: 15 minutos (advertir si no hay buffer)

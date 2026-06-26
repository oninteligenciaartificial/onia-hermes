# Skill: agenda-calendario

## Objetivo
Gestionar el cronograma de Sergio y ONIA via Google Calendar + Cal.com desde
Telegram. Hermes interpreta intenciones de agenda y n8n ejecuta contra Google
Calendar API.

## Comandos

### Plan Sergio hoy
Muestra la agenda estricta del dia con bloques protegidos, ventanas de reunion,
prioridades y recordatorio de que Higgsfield esta en modo manual.

### Puedo reunirme <dia> <hora>?
Valida si una reunion cabe dentro de las ventanas permitidas sin romper gym,
descanso, vida personal, trabajo profundo o shutdown.

### Modo enfoque / Modo gym / Modo novia / Estoy saturado / Cierre Sergio
Comandos personales para AlfredHQ. Deben responder corto y proteger energia
antes de proponer mas trabajo.

### /agenda hoy
Muestra todos los eventos del dia actual desde Google Calendar.

### /agenda semana
Muestra cronograma de los proximos 7 dias.

### agendar <datos>
Crea un evento. Datos minimos requeridos:
- Titulo.
- Fecha, por ejemplo `jueves`, `15/06`, `manana`.
- Hora inicio y fin.
- Descripcion opcional.

Ejemplo: `agendar Reunion Epic Motion | jueves 10am-11am | Ver propuesta web`

Importante para el bot AlfredHQ: enviar sin `/` al inicio. El bot Hermes en el
VPS rechaza slash-commands desconocidos. `agendar ...` se enruta a
`hermes-command telegram` -> `_agendar` -> webhook n8n `agendar-create` ->
Google Calendar. El router acepta ambas formas cuando se invoca por CLI directo.

### /cancelar <evento>
Cancela o elimina evento existente. Requiere confirmacion explicita.

### /recordatorio <evento> <tiempo>
Agrega recordatorio adicional a evento existente.
Ejemplo: `/recordatorio Reunion Epic Motion 1 hora antes`.

## Parsing de fechas Bolivia UTC-4
- `hoy` -> fecha actual.
- `manana` -> fecha actual + 1.
- `lunes/martes/...` -> proximo dia de semana.
- `15 de junio` -> fecha literal.
- `en 2 horas` -> hora actual + 2.

## Flujos n8n asociados
- `ONIA - Agenda: Briefing Diario`: cron 8am -> GCal -> Telegram.
- `ONIA - Agenda: Crear Evento`: Telegram trigger -> GCal create -> confirm.
- `ONIA - Agenda: Recordatorios`: cron 30min -> GCal check -> Telegram alert.
- `ONIA - Agenda: Cal.com Booking`: Cal.com webhook -> GCal create -> Telegram notify.

## Formato de confirmacion de evento creado
```text
Evento agendado:
[Titulo]
[Fecha] [Hora inicio] - [Hora fin]
[Descripcion]
Link GCal: [link]
```

## Formato de briefing diario
```text
Agenda del [dia], [fecha]:

[HH:MM] [Titulo evento 1]
[HH:MM] [Titulo evento 2]

Sin eventos: "Dia libre"
```

## Cal.com - links de booking para clientes
- Modo inicial: link gratis de Cal.com hosted.
- Cuenta/identidad publica Cal: `business@onia.com.bo`.
- Nombre publico: `ONIA | Agenda Comercial`.
- URL base: pendiente de crear en Cal.com gratis; no usar todavia `cal.onia.ai`
  como link publico.
- Calendario Google conectado: `oninteligenciaartificial@gmail.com`.
- Correo formal al cliente despues de aceptar: `business@onia.com.bo`.
- Tipos de evento disponibles:
  - `consulta-inicial`: 30min, gratis.
    - Anticipo minimo: 4 horas.
    - Se puede reservar hasta 14 dias hacia adelante.
  - `demo-onia`: 45min, para DentalGest, GestiOS, Web ONIA y automatizaciones.
    - Anticipo minimo: 8 horas.
    - Se puede reservar hasta 21 dias hacia adelante.
  - `reunion-proyecto`: 60min, para clientes activos.
    - Anticipo minimo: 24 horas.
    - Se puede reservar hasta 30 dias hacia adelante.
  - `auditoria-pagada`: 60min, desactivada por ahora porque ONIA aun no cobrara
    asesorias pagadas en fase inicial.
- Cuando cliente agenda: Cal webhook -> Google Calendar -> Telegram -> ONIA Center.
- Toda reserva debe crear lead en ONIA Center como `reunion_agendada_pendiente`
  y Telegram debe permitir aceptar, cancelar o reasignar.
- Si Cal gratis no permite aprobacion manual en la UI, ONIA tratara el booking
  como solicitud hasta que Telegram lo acepte.
- El correo final de confirmacion se envia solo despues de aceptar por Telegram.

Nota ONIA 2026:
- `cal.onia.ai` queda como camino futuro self-host; para vender rapido se usa
  Cal.com gratis hasta validar flujo.
- La vendedora puede agendar para Sergio, Arthur o para ella, pero su
  disponibilidad propia se configura separada.
- Arthur no usa la misma cuenta de `oninteligenciaartificial@gmail.com`; se le
  asignan reservas por Telegram/ONIA Center.
- La vendedora puede usar correo personal internamente, pero publicamente debe
  verse como ONIA Comercial.
- La vendedora atiende por ahora webs, DentalGest, GestiOS, automatizaciones y
  asesorias que Sergio no pueda tomar.
- Sergio/Arthur toman reuniones tecnicas, cierres de propuesta, clientes activos
  y casos con riesgo de alcance.
- El webhook debe registrar booking en Google Calendar, Telegram y Supabase
  privado `onia_ops.*`.
- No abrir todo el calendario privado a prospectos: Cal muestra ventanas
  comerciales y Google Calendar bloquea horas no disponibles.
- Ventanas base ONIA:
  - Lunes a sabado 14:00-20:00.
  - Domingo cerrado.
  - Minimo 4 horas de anticipacion.
  - Buffer minimo 15 minutos.
- Horarios deben poder cambiarse rapido en Cal o bloqueando eventos en Google
  Calendar cuando Sergio, Arthur o la vendedora no puedan.
- Bloquear gym, vida personal, shutdown, dormir, almuerzo y trabajo profundo.

## Formulario Cal recomendado
Campos requeridos:
- Nombre completo.
- Empresa o negocio.
- WhatsApp.
- Correo.
- Ciudad.
- Servicio de interes.
- Problema principal.
- Presupuesto aproximado.
- Web, Instagram o Facebook actual.
- Quien debe tomar la reunion: Sergio, Arthur, vendedora o cualquiera disponible.
- Urgencia: esta semana, este mes o exploratorio.
- Eres dueno, socio, encargado o solo estas consultando.
- Como conociste a ONIA.
- Aceptas que ONIA te contacte por WhatsApp para seguimiento.

## Reglas
- Timezone siempre `America/La_Paz` UTC-4.
- Confirmacion requerida antes de cancelar eventos.
- No crear eventos en el pasado sin confirmacion explicita.
- Eventos de clientes via Cal.com pasan por Google Calendar, Telegram y ONIA
  Center.
- Buffer minimo entre reuniones: 15 minutos.
- No contar una reunion para comision o seguimiento si no queda lead registrado.

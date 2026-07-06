# Skill: agenda-calendario

## Cuando usar
Cuando Sergio pida ver, crear, cancelar o proteger tiempo en su agenda o la de
ONIA. Hermes interpreta la intencion desde Telegram y n8n ejecuta contra Google
Calendar API. Cal.com es la puerta de entrada de clientes.

## Principio rector
La agenda protege energia antes que productividad: gym, descanso, vida
personal, trabajo profundo y shutdown son bloques protegidos. Ninguna reunion
comercial los pisa sin decision explicita de Sergio.

## Comandos

### Plan Sergio hoy
Agenda estricta del dia: bloques protegidos, ventanas de reunion, prioridades y
recordatorio de que Higgsfield esta en modo manual.

### Puedo reunirme <dia> <hora>?
Validar contra ventanas permitidas. Responder si/no + alternativa mas cercana
si es no. Nunca aprobar una hora que rompa gym, descanso, vida personal,
trabajo profundo o shutdown.

### Modo enfoque / Modo gym / Modo novia / Estoy saturado / Cierre Sergio
Comandos personales para AlfredHQ. Respuesta corta, proteger energia, no
proponer mas trabajo. `Estoy saturado` implica: recortar, no agregar.

### /agenda hoy
Todos los eventos del dia actual desde Google Calendar.

### /agenda semana
Cronograma de los proximos 7 dias.

### agendar <datos>
Crea un evento. Datos minimos: titulo, fecha (`jueves`, `15/06`, `manana`),
hora inicio y fin. Descripcion opcional.
Ejemplo: `agendar Reunion Epic Motion | jueves 10am-11am | Ver propuesta web`

**Importante bot AlfredHQ:** enviar SIN `/` al inicio. El bot Hermes en el VPS
rechaza slash-commands desconocidos. `agendar ...` se enruta:
`hermes-command telegram` -> `_agendar` -> webhook n8n `agendar-create` ->
Google Calendar. El router acepta ambas formas solo por CLI directo.

### /cancelar <evento>
Cancela o elimina evento existente. SIEMPRE con confirmacion explicita previa.

### /recordatorio <evento> <tiempo>
Agrega recordatorio a evento existente.
Ejemplo: `/recordatorio Reunion Epic Motion 1 hora antes`

## Parsing de fechas (Bolivia, UTC-4, `America/La_Paz`)
- `hoy` -> fecha actual.
- `manana` -> fecha actual + 1.
- `lunes/martes/...` -> proximo dia de semana con ese nombre.
- `15 de junio` -> fecha literal.
- `en 2 horas` -> hora actual + 2.
- Fecha ambigua o en el pasado -> pedir confirmacion, no adivinar.

## Flujos n8n asociados
- `ONIA - Agenda: Briefing Diario`: cron 8am -> GCal -> Telegram.
- `ONIA - Agenda: Crear Evento`: Telegram trigger -> GCal create -> confirm.
- `ONIA - Agenda: Recordatorios`: cron 30min -> GCal check -> Telegram alert.
- `ONIA - Agenda: Cal.com Booking`: Cal.com webhook -> GCal create -> Telegram notify.

## Formatos de salida

### Evento creado
```text
Evento agendado:
[Titulo]
[Fecha] [Hora inicio] - [Hora fin]
[Descripcion]
Link GCal: [link]
```

### Briefing diario
```text
Agenda del [dia], [fecha]:

[HH:MM] [Titulo evento 1]
[HH:MM] [Titulo evento 2]

Sin eventos: "Dia libre"
```

## Cal.com — booking de clientes

### Identidad y cuentas
- Modo actual: Cal.com **self-hosted** en `https://cal.onia.com.bo`.
  URL base publica: `https://cal.onia.com.bo/onia`. NO usar `cal.onia.ai`.
- Cuenta/identidad publica: `business@onia.com.bo`, nombre `ONIA | Agenda Comercial`.
- Foto de perfil comercial:
  `https://center.onia.com.bo/assets/onia/onia-logo-avatar.png`.
- Configuracion operativa desde ONIA Center: vista `Agenda Sergio` muestra
  tipos, links publicos, reglas y accesos directos para editar reuniones,
  disponibilidad, calendarios y perfil.
- ONIA Center no debe fingir escritura directa hasta que exista adaptador con
  auditoria: por ahora abre Cal self-hosted para aplicar cambios reales.
- Calendario Google conectado: `oninteligenciaartificial@gmail.com`.
- Correo formal al cliente despues de aceptar: `business@onia.com.bo`.
- Arthur NO usa la cuenta `oninteligenciaartificial@gmail.com`; se le asignan
  reservas por Telegram/ONIA Center.

### Tipos de evento
- `consulta-inicial`: 20min, visible como `Consulta comercial - proyecto nuevo`.
  - Para prospectos nuevos que quieren cotizar o validar si ONIA puede ayudar.
  - Aplica a paginas web, ecommerce/landing, DentalGest, GestiOS,
    automatizaciones, chatbots de WhatsApp, IA para publicidad/contenido y
    sistemas internos.
  - No es soporte, capacitacion ni auditoria tecnica profunda.
  - Anticipo minimo 4h; hasta 14 dias adelante.
- `demo-onia`: 45min, visible como `Demo / diagnostico - solucion ONIA`.
  - Para leads ya calificados con un problema concreto.
  - Aplica a demos de DentalGest o GestiOS, revision de propuesta
    web/ecommerce, automatizaciones, chatbot WhatsApp, sistema interno,
    contenido con IA o publicidad con IA.
  - Define solucion, alcance y siguiente paso comercial.
  - Anticipo minimo 8h; hasta 21 dias adelante.
- `reunion-proyecto`: 60min, oculta en la pagina publica, usable con link
  directo como `Reunion de proyecto - cliente activo`.
  - Solo clientes activos, propuestas en curso o proyectos aceptados.
  - Aplica a alcance tecnico, entregables, implementacion, capacitacion,
    cambios, seguimiento, cierre tecnico/comercial o decisiones de proyecto.
  - Anticipo minimo 24h; hasta 30 dias adelante.
- `auditoria-pagada`: 60min, DESACTIVADA (ONIA no cobra asesorias en fase inicial).

### Flujo de una reserva
1. Cliente agenda -> Cal webhook -> Google Calendar -> Telegram -> ONIA Center.
2. Toda reserva crea lead en ONIA Center como `reunion_agendada_pendiente`.
3. Telegram permite aceptar, cancelar o reasignar.
4. Aunque Cal registre la reserva, ONIA la trata como SOLICITUD hasta que
   Sergio/equipo la acepte por Telegram o desde ONIA Center.
5. El correo final de confirmacion se envia SOLO despues de aceptar por Telegram.
6. El webhook registra el booking en Google Calendar, Telegram y Supabase
   privado `onia_ops.*`.

### Asignacion de reuniones
- La vendedora atiende: webs, DentalGest, GestiOS, automatizaciones y asesorias
  que Sergio no pueda tomar. Su disponibilidad se configura separada. Puede
  agendar para Sergio, Arthur o ella. Publicamente aparece como ONIA Comercial
  aunque use correo personal interno.
- Sergio/Arthur toman: reuniones tecnicas, cierres de propuesta, clientes
  activos y casos con riesgo de alcance.

### Ventanas y proteccion del calendario
- Base: lunes a sabado 14:00-20:00. Domingo cerrado.
- Anticipo minimo 4 horas. Buffer minimo 15 minutos entre reuniones.
- NO abrir el calendario privado a prospectos: Cal muestra solo ventanas
  comerciales; Google Calendar bloquea las horas no disponibles.
- Bloquear siempre: gym, vida personal, shutdown, dormir, almuerzo y trabajo
  profundo.
- Los horarios deben poder cambiarse rapido (en Cal o bloqueando eventos en
  GCal) cuando Sergio, Arthur o la vendedora no puedan.

### Formulario Cal (campos requeridos)
Nombre completo; empresa o negocio; WhatsApp; correo; ciudad; servicio de
interes; problema principal; presupuesto aproximado; web/Instagram/Facebook
actual; quien debe tomar la reunion (Sergio, Arthur, vendedora o cualquiera);
urgencia (esta semana, este mes, exploratorio); rol (dueno, socio, encargado,
solo consulta); como conocio a ONIA; acepta contacto por WhatsApp.

## Reglas duras
- Timezone siempre `America/La_Paz` (UTC-4).
- Confirmacion explicita antes de cancelar cualquier evento.
- No crear eventos en el pasado sin confirmacion explicita.
- Eventos de clientes via Cal.com pasan por GCal, Telegram y ONIA Center.
- Una reunion NO cuenta para comision ni seguimiento si no quedo lead
  registrado en ONIA Center.
- Notificaciones de reservas y cambios van a Arthur Y Sergio por Telegram.

## Errores comunes
- `agendar` con `/` al inicio desde AlfredHQ -> el bot lo rechaza; reenviar sin slash.
- Evento sin hora fin -> asumir 1h y decirlo en la confirmacion.
- Conflicto con bloque protegido -> ofrecer la siguiente ventana valida, nunca
  agendar encima.

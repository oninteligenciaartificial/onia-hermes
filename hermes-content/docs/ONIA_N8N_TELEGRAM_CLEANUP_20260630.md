# Onia n8n / Telegram Cleanup - 2026-06-30

## Objetivo

Reducir ruido, gasto de tokens y automatizaciones heredadas en Telegram/n8n sin
romper flujos utiles para Onia Center, calendario, ventas ni clientes.

Esta auditoria es de estado real observado en n8n el 2026-06-30. No se
desactivo nada automaticamente durante la revision.

## Decision Operativa Recomendada

Mantener un stack minimo:

1. Onia Center crea el plan diario y tareas por rol.
2. Cal.com crea reuniones y avisa por Telegram.
3. Google Calendar envia recordatorios proximos.
4. n8n monitoriza fallos.
5. Telegram queda como bandeja de aprobacion y comando manual, no como fuente
   diaria de ruido.

Pausar temporalmente:

1. Empujes diarios de Video Lab / Higgsfield.
2. Radar creativo diario con OpenAI web search.
3. Demos diarias de clima/tip si no se estan usando para ventas.
4. Briefings duplicados de agenda si Onia Center ya envia el plan del dia.
5. Flujos heredados de prueba o UDIA que no aportan a Onia actual.

## Mantener Activo

| Workflow | ID | Motivo | Condicion |
|---|---|---|---|
| ONIA Center - Briefing diario operativo | `ONIADailyBrief001` | Es el flujo principal: crea tareas por rol en Onia Center y notifica por Telegram. | Mantener. |
| ONIA - Agenda: Cal.com Booking | `X6gd3EBW7Y3z9xTg` | Convierte reservas Cal.com en eventos de Google Calendar y avisa a Sergio/Arthur. | Mantener, pero agregar validacion de webhook. |
| ONIA - Agenda: Recordatorios | `uwqJDGwkkWJaFtLU` | Recordatorios de eventos proximos cada 30 minutos. | Mantener si no molesta; reducir frecuencia si hay ruido. |
| ONIA - Monitor de Salud n8n | `drFWP7nttzvtZzso` | Avisa fallos reales de automatizaciones. | Mantener. |
| ONIA Intake Cliente a Telegram | `w3vgUCV1yMkv70TW` | Recibe formularios de cliente. | Mantener si el formulario sigue publico. |
| Cuestionario Cliente ONIA -> Correo | `SemAJNk7ZoZxA8D7` | Intake comercial por formulario. | Mantener si sigue conectado a una pagina activa. |
| Brief de Produccion ONIA -> Correo | `mboH09gPgu5kAoHm` | Intake de produccion. | Mantener si sigue conectado a una pagina activa. |

## Pausar Ahora

Estos flujos son candidatos a `unpublish` temporal porque generan ruido, costo o
errores y no son necesarios para operar Onia Center hoy.

| Workflow | ID | Motivo |
|---|---|---|
| ONIA - Scheduled Operations Pack | `VeCHKr6wkK5Wet25` | Activo, dispara varios recordatorios diarios y falla por credencial SSH. Tambien contiene comandos de Video Lab/Higgsfield que el sistema ya definio como quiet/manual. |
| Mara Daily Content - Trend Research | `zediOCdtlP1zpImK` | Activo, diario, usa SSH roto y empuja generacion/briefs de video que hoy no queremos automatizar. |
| Hermes Radar Diario Creativo y Clientes | `lryabRhGQW4WIuJG` | Activo, usa OpenAI con web search diario y envia a Telegram. Util, pero mejor semanal/manual por ahora para reducir costo y ruido. |
| ONIA - Demo Asistente Diario | `GnmIyrHWb1mO5eNy` | Demo diaria de clima/tip. No consume OpenAI, pero suma ruido si no se usa en ventas. |
| ONIA - Agenda: Briefing Diario | `qdAEP9seSxp5whXh` | Duplica el briefing diario de ONIA Center. |

## Revisar Antes de Pausar

| Workflow | Riesgo |
|---|---|
| Workflows DentalGest `WF-00` a `WF-13` | Varios envian emails, recordatorios, cobros o WhatsApp opcional. No pausar sin revisar si DentalGest/GestiOS los necesita en produccion. |
| GestiOS workflows activos | Algunos usan Supabase/API y pueden afectar tenants, pagos o onboarding. Revisar con el repo de GestiOS antes de apagar. |
| WF-02: QR Payment Alerts | Corre cada 5 minutos y tuvo un error DNS temporal (`EAI_AGAIN`), pero despues siguio exitoso. No apagar sin decidir si el monitoreo de pagos sigue vigente. |
| WF-SENTRY-01 - Sentry Codex Triage | Puede ser util para errores. Pausar solo si Sentry ya no se usa. |

## Archivar o Dejar Inactivo

Los workflows apagados de practica/UDIA pueden archivarse despues de exportar si
queremos limpiar la vista:

- `[UDIA] Mi primer workflow`
- `[UDIA] Primer flujo sencillo`
- `Action in app Udia`
- `Ejercicio flujo de datos`
- `formularios con mensajes finales`
- `Nodos Core y HTTP REQUEST`
- `practica flujo de datos`
- `prueba de datos`
- `udia`
- `UDIA Bot telegram errores`
- `Udia credenciales`
- `udia if y switch`
- `UDIA Workflow de Prueba`

## Problemas Detectados

### 1. SSH roto

La credencial `SSH Password account` falla con:

```text
All configured authentication methods failed
```

Afecta:

- `ONIA - Scheduled Operations Pack`
- `Mara Daily Content - Trend Research`
- `ONIA - Telegram Command Center` cuando entra por webhook Alfred y necesita
  ejecutar `hermes-command`.

Recomendacion: reemplazar password SSH por credencial SSH key o eliminar la
dependencia de SSH llamando endpoints internos de Onia Center cuando sea
posible.

### 2. Telegram Command Center no escucha Telegram directo

El node `Telegram Video Lab Command` esta deshabilitado. El camino activo es:

```text
Alfred Webhook -> Normalize -> SSH hermes-command -> Telegram reply
```

Mientras SSH falle, el command center no es confiable.

### 3. Flujos de IA diarios sin registro operativo

Radar creativo y prospeccion diaria generan reportes por Telegram, pero no
garantizan registro en Onia Center/CRM. Si no se registran y se llaman, se
vuelven ruido.

Regla recomendada: todo reporte de prospeccion debe crear lead/tarea en Onia
Center o no ejecutarse automaticamente.

### 4. Webhook Cal.com sin firma

El flujo `ONIA - Agenda: Cal.com Booking` recibe POST sin credenciales. Es
funcional, pero se debe validar firma/secret del webhook antes de tratarlo como
produccion estricta.

## Stack Recomendado Para Esta Semana

Activo:

- Onia Center briefing diario.
- Cal.com booking.
- Recordatorios de calendario.
- Monitor de salud n8n.
- Formularios/intakes activos.

Manual:

- Telegram Command Center.
- Higgsfield / Video Lab.
- Radar creativo.
- Prospeccion.
- Platform copy.

Pausado:

- Scheduled Operations Pack.
- Mara Daily Content.
- Demo Asistente Diario.
- Briefing Agenda duplicado.

## Siguiente Paso

Si Sergio confirma, ejecutar:

1. `unpublish_workflow` en:
   - `VeCHKr6wkK5Wet25`
   - `zediOCdtlP1zpImK`
   - `lryabRhGQW4WIuJG`
   - `GnmIyrHWb1mO5eNy`
   - `qdAEP9seSxp5whXh`
2. Probar que siguen activos:
   - Onia Center briefing.
   - Cal.com booking.
   - Recordatorios.
   - Monitor de salud.
3. Corregir SSH o reemplazarlo por endpoints internos.
4. Registrar en Onia Center cualquier lead/tarea generado por prospeccion.


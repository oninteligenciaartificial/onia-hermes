# Skill: agenda-calendario

## Cuando usar
Cuando Sergio pida ver, crear, cancelar o proteger tiempo en su agenda o la de ONIA.
Google Calendar es la fuente de compromisos; una ventana fija no acredita disponibilidad.

## Capacidad actual y limite (verificado 2026-09-28)
- El router `scripts/hermes_command_center.py` no tiene lector de Calendar.
  `Plan Sergio hoy` entrega prioridades sin horas y `Agenda no verificada`.
  `Puedo reunirme <dia> <hora>?` no confirma disponibilidad ni ofrece alternativas fijas.
- Ambas consultas preservan `action` y `telegram_reply`, con `calendar_verified=false`.
  `ok=true` significa consulta procesada, NO calendario verificado ni horario disponible;
  la CLI sale 0 para que el caller pueda mostrar la respuesta honesta.
- Hermes tiene la skill Google Workspace instalada, pero en el VPS faltan sus archivos
  OAuth. No confundir esto con ausencia total de Google en ONIA.
- n8n conserva `ONIA - Agenda: Recordatorios` activo: el nodo Google leyo correctamente
  el 28-sep. No se confirmo que su cuenta/calendario coincida con el `primary` de Sergio.
  `ONIA - Agenda Create API` esta activo, pero no acredita disponibilidad ni lectura.
- Los jobs de agenda/veredicto de `/root/.hermes/cron/jobs.json` no consultan Calendar.
  Este parche local no cambia esos jobs ni acredita automaticamente eventos modificados
  por Codex u otro operador. Deben volver a leerse antes de incorporarlos al plan.
- Cal propio es la opcion primaria elegida, pero esta apagado y su dominio redirige a
  `/empezar`. Cal hosted es fallback previsto; su funcionamiento actual no esta acreditado.
  Estado y requisitos: [runbook Cal](../docs/ONIA_CALCOM_SELF_HOST_RUNBOOK_2026.md).
- El bot ofrece `ONIA_BOT_SLOTS` calculados desde ventanas historicas. Son candidatos
  estimados pendientes de confirmar, no disponibilidad Google ni reservas acreditadas.
  El entorno del proceso puede diferir de `webhook.env`: comprobar lo servido.

## Regla antes de proponer horas
Necesitas una lectura actual con calendario/cuenta identificados, fecha consultada y
zona `America/La_Paz`. Si falta, es ambigua o falla, responder `Agenda no verificada`
y entregar prioridades sin horas. No afirmar SI/NO sobre disponibilidad basandose
solo en reglas horarias, en la presencia de credenciales o en un endpoint de creacion.

Una lectura fallida o ausente NO es agenda vacia. Una respuesta correcta sin eventos
solo significa `Sin eventos registrados en el periodo consultado`; no garantiza dia libre.
Conservar colegio, ejercicio, lectura, vida personal, descanso y compromisos existentes.
Ubicar tareas solo en bloques ONIA verificados; nunca mover compromisos para hacer lugar.

## Comandos del router
- `Plan Sergio hoy`, `Agenda Sergio`, `Calendario Sergio`: prioridades sin horarios
  hasta contar con lector verificado. No son un listado de eventos.
- `Puedo reunirme <dia> <hora>?`, `Disponibilidad Sergio`: respuesta no verificada;
  consultar el calendario y confirmar con Sergio antes de proponer o agendar.
- `Modo enfoque`, `Modo gym`, `Modo novia`, `Estoy saturado`, `Cierre Sergio`:
  proteger energia; `Estoy saturado` implica recortar, no agregar trabajo.
- `agendar <titulo> | <fecha> <hora inicio>-<hora fin> | <descripcion>`: ruta de
  CREACION via `_agendar` -> n8n `/webhook/agendar-create` -> Google Calendar.
  Crear requiere instruccion explicita y confirmar exito por la respuesta real.
  No comprueba conflictos. En AlfredHQ enviar sin `/`; la CLI directa acepta ambas formas.
- `/agenda hoy`, `/agenda semana`, `/cancelar` y `/recordatorio` no son capacidades
  de lectura/cancelacion implementadas en este router. No prometerlas como disponibles.

## Integracion pendiente, sin activar desde esta skill
Reutilizar primero el OAuth n8n existente: verificar cuenta/calendario y preparar
un puente limitado de lectura. No usar el webhook de creacion como prueba de disponibilidad.
Si se elige OAuth directo Hermes, la skill instalada `productivity/google-workspace`
documenta `setup.py --check`, cliente OAuth, `--auth-url --services calendar`,
`--auth-code` y `google_api.py calendar list`. Es una configuracion separada pendiente;
no copiar tokens a docs ni ejecutar setup/refresh como parte de una inspeccion.

El flujo objetivo Cal -> solicitud -> aceptacion -> Calendar -> notificacion requiere
adaptador y auditoria; no esta cerrado. Ver [n8n canonico](../docs/N8N_CANONICAL.md) y
[workflows de agenda](../docs/n8n-workflows/n8n-agenda-calendario.md), cuyas tablas historicas
no sustituyen una lectura viva de activacion y ejecuciones.

Las decisiones comerciales se conservan como **diseno objetivo historico** en el
[runbook Cal](../docs/ONIA_CALCOM_SELF_HOST_RUNBOOK_2026.md): tipos `consulta-inicial`
(20 min), `demo-onia` (45 min) y `reunion-proyecto` (60 min, oculto), anticipos,
buffers, formulario y solicitud -> aceptacion antes del correo final. No declararlas
implementadas por estar documentadas. Las ventanas historicas deben reconciliarse
con el calendario actual antes de habilitar reservas.

## Reglas duras
- Timezone `America/La_Paz` (UTC-4); fechas y horas explicitas, sin adivinar fechas ambiguas.
- No crear/cancelar eventos, mover compromisos ni enviar mensajes sin autorizacion aplicable.
- No afirmar que una reunion esta confirmada sin evidencia del calendario o confirmacion humana.
- Activar VPS, n8n, crons, OAuth o servicios necesita una accion especifica aprobada.
- No crear otro scheduler: conservar Hermes cron y conectar la fuente de lectura cuando se apruebe.

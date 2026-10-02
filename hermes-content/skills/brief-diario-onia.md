# Skill: Brief Diario ONIA

Usar esta skill cuando Sergio pida el resumen del dia, tareas de hoy,
recomendaciones o tendencias del dia, o diga `Brief Hoy`, `Brief diario`,
`Que hago hoy`, `Tareas de hoy` o `Recomiendame hoy`.

Objetivo: un solo mensaje que junta lo que hoy esta disperso en agenda, sistema
semanal, CRM y radar de tendencias. No publica, no contacta, no escribe
calendario automaticamente: agenda, avisa y propone; Sergio aprueba.

## Comando principal: `Brief Hoy`

Arma UN mensaje con estas 4 secciones en orden. Si una fuente falla, reportar el
bloqueo tecnico en esa seccion y seguir con las demas (nunca abortar todo).

### 1. Agenda del dia
Fuente requerida: lectura actual de Google Calendar, con calendario/cuenta, fecha y
zona `America/La_Paz` identificados. La skill [agenda-calendario](agenda-calendario.md)
distingue la capacidad actual del flujo pendiente: el router no tiene lector;
n8n conserva OAuth operativo pero no se confirmo la identidad del calendario.
- Sin lectura actual, o si falla: `Agenda no verificada`; prioridades sin horas.
  No interpretar ausencia de datos como agenda vacia ni prometer un dia libre.
- Con lectura correcta: listar eventos `[HH:MM] [Titulo]`; sin eventos, decir
  `Sin eventos registrados en el periodo consultado`, no disponibilidad garantizada.
- Conservar colegio, ejercicio, lectura, vida personal, descanso y compromisos existentes.
- No acreditar cambios de Codex u otro operador sin releerlos. El plan actual de Hermes
  no conoce automaticamente los objetivos que se escribieron en Google Calendar.
- Los `ONIA_BOT_SLOTS` son candidatos estimados pendientes de confirmar; no son
  disponibilidad leida ni reservas. No usarlos para asignar reuniones.

### 2. Tareas del dia (prioridades)
Fuente: `hermes-week-plan` / briefing de ONIA Center (`/api/onia-center/
briefings/daily`) + seguimientos de CRM y WorkItems pendientes.
- Maximo 5 tareas, ordenadas por prioridad. Asignar bloque solo con agenda verificada.
- Formato: `- Titulo (por que importa)`; agregar hora solo dentro de un bloque ONIA comprobado.
- Incluir seguimientos vencidos: prospecto sin respuesta, propuesta sin cierre,
  saldo pendiente. Regla: solo cuenta si queda registrado con evidencia.

### 3. Recomendaciones y tendencias
Fuente: skills `radar-creativo-onia`, `tendencias-ia-redes` (SearXNG local +
Tavily cuando este la key). Aplicar la regla de radar creativo: investigar
fuentes actuales primero, extraer principios, rankear utilidad.
- 3 tendencias accionables de hoy (IA, redes, formato viral o del rubro activo).
- Cada una con: que es, por que le sirve a ONIA/Sergio, accion concreta sugerida
  (skill, guion, prompt, carrusel o campana). No copiar identidad de creadores.
- Si depende de una key no configurada (Tavily), marcarlo y usar SearXNG.

### 4. Cierre accionable
```text
Prioridad 1 de hoy:
Decision que necesito de Sergio:
Siguiente comando exacto:
Aprobacion pendiente:
```

## Variantes

- `Tareas de hoy` -> solo seccion 2 + cierre.
- `Recomiendame hoy` / `Tendencias hoy` -> solo seccion 3.
- `Brief Hoy: <rubro>` -> sesga tendencias y prospeccion a ese rubro.

## Automatizacion prevista (n8n), no evidencia de activacion

- `ONIA Center - Briefing diario operativo` (`onia-center-daily-briefing.json`):
  cron 06:45 L-S -> tareas por rol -> Telegram. Cubre secciones 1-2.
- `ONIA - Recomendaciones de tendencia` (`onia-trend-recommendations.json`):
  cron diario -> SearXNG/tendencias -> anexa seccion 3 al brief. Compatible con
  plan VPS (sin `$env`, credenciales n8n).
- El briefing operativo figuraba apagado en la auditoria del 28-sep; estas definiciones
  no prueban que hoy se ejecuten ni que lean el calendario real de Sergio.
- El parche del router es LOCAL: no actualiza `/root/.hermes/cron/jobs.json` ni horarios.
- Conservar Hermes cron; no activar otro scheduler ni OAuth desde este brief.
- Para cambios de workflow usar skill `hermes-automation` / `n8n-automatizaciones-onia`
  y la autorizacion especifica de la accion.

## Reglas

- Timezone `America/La_Paz` UTC-4.
- No publicar, no contactar prospectos, no escribir Google Calendar sin
  aprobacion explicita. El brief propone; Sergio ejecuta con el comando sugerido.
- Respuesta corta y accionable. Nunca inventar tareas ni tendencias: si una
  fuente no responde, decirlo.
- Cierre obligatorio: cada seccion termina en una accion o un comando exacto.

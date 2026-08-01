# Onia — Orquestacion de Agentes en Paralelo (Fabrica Diaria) 2026

Fecha: 2026-07-03. Owner: Onia / Hermes.

Objetivo: que el sistema de Onia trabaje solo, todos los dias, en paralelo por
frentes, y que Sergio solo apruebe. "En paralelo, todo el tiempo" se implementa
como **cadencia diaria programada + agentes on-demand**, no como procesos
siempre encendidos (eso seria caro y fragil). Cada frente tiene un cron que lo
dispara, un agente que lo ejecuta, una salida y un gate de aprobacion.

## Regla de autonomia (Sergio)

Todo workflow debe ser **autonomo y no depender de nada local**: prohibido
depender de endpoints propios de Onia Center o de SearXNG en localhost. Los
workflows llaman APIs gestionadas externas (LLM tipo OpenAI/OpenRouter, etc.) via
credenciales n8n (plan VPS, sin `$env`) y llevan el prompt/logica inline. Si un
workflow todavia depende de infra local, esta pendiente de migrar.

## Como encaja (3 capas)

1. **n8n (scheduler)**: los crons disparan cada frente a su hora. Plan VPS: sin
   `$env`, credenciales n8n. Workflows en `hermes-content/deploy/n8n/workflows/`.
2. **Hermes gateway (razonador)**: recibe el disparo, ejecuta la skill del
   frente con su LLM y arma la salida accionable para Telegram.
3. **Agentes Claude (`.claude/agents/`)**: para trabajo profundo bajo demanda
   (build, migraciones, propuestas, review). Los despacha `onia-orchestrator`.

Telegram = bandeja de aprobacion y comando. Nada client-facing sale sin OK.

## Cadencia diaria (paralelo por horario)

| Hora (La Paz) | Frente | Agente / Skill | Workflow n8n | Salida | Gate |
|---|---|---|---|---|---|
| 06:45 | Agenda + tareas | brief-diario-onia | `onia-center-daily-briefing` | Plan del dia por rol a Telegram | informativo |
| 06:50 | Tendencias | onia-creative-radar / tendencias-ia-redes | `onia-trend-recommendations` | 3 tendencias accionables | informativo |
| 07:00 | Guiones de contenido | onia-creative-radar / guiones-diarios-onia | `onia-guiones-diarios` | 3 guiones listos para producir | aprueba para producir |
| 09:00 | Prospeccion | onia-crm-prospeccion | (pendiente) | Lista corta calificada + borrador | aprueba para contactar |
| 12:00 | Propuestas pendientes | onia-propuestas | (pendiente) | Estado de propuestas + siguiente accion | aprueba envio |
| cada 30m | Salud automatizaciones | hermes-automation | `ONIA - Monitor de Salud n8n` | Aviso solo si falla | automatico |

Fines de semana: sabado = marca personal Sergio; domingo = review (ver
`sistema-semanal-hermes`). Los crons de contenido/prospeccion se pausan o
reducen segun `plan-semanal-onia`.

## Regla de continuidad real

- "Trabajando todo el tiempo" = cada frente corre a diario sin que Sergio lo
  pida, y los agentes de fondo (build, migraciones, review) se despachan cuando
  hay trabajo. No hay daemons 24/7: el disparo es por cron + eventos.
- Todo output se registra (Onia Center / repo). Regla: "solo cuenta si queda
  registrado con evidencia". Un reporte que no se registra no se ejecuta.
- Ningun frente publica, contacta cliente, paga, ni entrega pieza sin aprobacion
  explicita de Sergio.

## Estado de implementacion

| Pieza | Estado |
|---|---|
| guiones-diarios-onia (skill) | listo |
| onia-guiones-diarios (n8n) | ACTIVO en n8n (`NDXLJiR00ciQx72V`), autonomo, testeado OK. Nodo OpenAI (cred `OpenAi account`) + Telegram (cred `Telegram account`). Cron 07:00 L-S |
| brief-diario-onia (skill) | listo |
| onia-center-daily-briefing (n8n) | usa Onia Center — PENDIENTE migrar a autonomo |
| onia-trend-recommendations (n8n) | usa SearXNG local — PENDIENTE migrar a autonomo |
| Cron prospeccion | pendiente (skill `prospeccion-onia` existe; falta workflow autonomo) |
| Cron propuestas | pendiente (skill `genera-propuesta` existe; falta workflow autonomo) |
| 9 agentes Onia (`.claude/agents/`) | listos |

## Activacion (una vez, en n8n)

1. Importar `onia-guiones-diarios.json` en n8n; setear credenciales
   `httpHeaderAuth` (LLM API, ej. OpenAI: `Authorization: Bearer <key>`) y
   `telegramApi`. Ajustar `url`/`model` del nodo LLM si se usa otro proveedor.
2. Activar el workflow. Verificar que el guion llega a Telegram 07:00.
3. Siguiente: crear los crons de prospeccion y propuestas con el mismo patron
   autonomo, y migrar briefing + trend-recommendations a autonomo.

## Comandos on-demand (Telegram)

- `Guiones Hoy` / `Guiones Hoy: <tema>` — guiones del dia.
- `Brief Hoy` — agenda + tareas + tendencias.
- `Genera Reel ONIA: <tema>` / `Flujo carrusel: <slug>` — producir una pieza.

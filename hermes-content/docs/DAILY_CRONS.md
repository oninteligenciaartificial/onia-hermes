# Los crons del VPS — qué corre solo, y cuándo

> **Doc vivo, sin fecha en el nombre: se EDITA, no se duplica.**
> Contado en vivo el **2026-08-31** con `crontab -l` en `187.77.16.63`.

> ⚠️ **Reescrito entero el 2026-08-31 porque lo anterior era falso.** La versión previa
> (última escritura: **6 de junio**, 85 días antes) declaraba tres crons
> `hermes-daily-operational-status`, `hermes-daily-content-video-plan` y
> `hermes-daily-video-lab-followup`, más una automatización de Codex y un borrador de n8n.
> **Ninguno existe**: `crontab -l | grep -c hermes-daily` devuelve **0**. Y hablaba de
> *"hora aproximada de Venezuela"* en un proyecto boliviano.
>
> El peligro de dejarlo: alguien que quiera saber qué corre solo lee esto, no encuentra los
> 18 trabajos que SÍ existen, y o duplica uno o da por perdido algo que anda.

---

## Cómo leer los horarios

**El host está en `Etc/UTC`** — verificado con `date -u; date`, dan lo mismo. La Paz es
**UTC−4**, así que a la hora UTC se le restan 4 para saber la hora local.

⚠️ Un doc del 1-ago advertía que copiar horarios de `vercel.json` al crontab los corre
4 horas. **Es falso** y ya está corregido en su archivo: los dos lados son UTC.

---

## Producto — Onia Platform

| UTC | La Paz | Qué |
|---|---|---|
| `0 11` | 07:00 | `run-onia-agents-cron.sh` — corrida diaria de agentes (recall + cobrador). 14 días seguidos de `http=200` |
| `0 13` | 09:00 | `run-onia-trial-drip.sh` — el drip del trial |
| `*/15` | — | `run-onia-appointment-reminders.sh` — recordatorios de cita |
| `0 6` | 02:00 | `run-onia-recurring-invoices.sh` — facturas recurrentes ⭐ |
| `0 10` | 06:00 | `run-onia-core-workitems.sh` — work items del core ⭐ |

⭐ **Los dos últimos se instalaron el 2026-08-31.** Antes vivían **sólo** en `vercel.json`, y
ese deploy apuntaba al Supabase de la nube: **nunca corrieron contra producción**. No fue una
migración, fue un encendido. Scripts y runbook en `hermes-content/infra/vps-ops/crons/`.

## Chatbot

| UTC | Qué |
|---|---|
| `*/2` | `webhook-watchdog.sh` — vigila que el webhook del bot conteste |
| `17 * * * *` | `followup-run.sh` — seguimientos del embudo |
| `32 * * * *` | `reminder-run.sh` — recordatorios |
| `47 * * * *` | `postdemo-run.sh` — post-demo |
| `0 12` | `usage-run.sh` — medidor de gasto |
| `*/30 12-23` | `insistencia-run.sh --emit` — la perilla de insistencia (v6.6) |
| `17 * * * *` | `chatwoot-brand-onia.sh` — repisa el branding de Chatwoot |

Ese último existe porque **Chatwoot es el motor y está hecho para no verse**: el widget dice
"Desarrollado por Onia", y el cron vuelve a pisar la marca cada hora porque el reconcile de
Chatwoot la revierte.

## Vigilancia e infraestructura

| UTC | Qué |
|---|---|
| `*/5` | `auth-canary.sh` — canario del login |
| `*/10` | `claude-guardia.sh` — autocura de contenedores + diagnóstico a Telegram |
| `*/15` | `onia-mirar-cliente.sh` |
| `0 8` | `security-watch.sh` |

## Respaldos

| UTC | Qué |
|---|---|
| `0 7` | `backup-onia-db.sh` — base de **producción** (self-hosted) |
| `30 7` | `backup-dentalgest-cloud.sh` — el Supabase de la **nube** |

⚠️ Ese segundo respalda una base que **no es producción**. Quedó de cuando la nube servía a
`dentalgest.app`, que desde el 2026-08-31 responde **404** y ya no tiene deploy detrás.
**Decisión pendiente de Sergio:** apagarlo, o dejarlo hasta borrar el proyecto de Vercel.

---

## Lo que NO son crons del host

- **Las tareas programadas de Claude Code** (`onia-cola`, `web-factory-dev-loop`,
  `web-factory-salud`, `cerrar-y-revisar-web-factory`) viven en
  `C:\Users\PC\.claude\scheduled-tasks\` **en la máquina de Sergio**, no en el VPS. Corren
  cuando la app está abierta y quieta. Ver `hermes-content/docs/cola/README.md`.
- **`vercel.json`** declara 3 crons, pero el auto-deploy está cortado y el proyecto sin
  dominios: **no gobiernan nada**.

## Cómo verificar sin creerle a este archivo

```bash
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 "crontab -l | grep -v '^#' | grep -v '^$'"
```

Si lo que sale no coincide con esta tabla, **gana el VPS** y este doc se corrige.

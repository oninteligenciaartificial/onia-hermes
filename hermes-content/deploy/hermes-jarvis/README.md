# hermes-jarvis — el acceso controlado de la sesión de Hermes al VPS

La sesión de control de Hermes (la que ordena el Telegram de Sergio Urcullo, su brief de la
mañana, su cierre del día y su calendario) corre en la nube y **no tiene llave del VPS**.
Sergio Urcullo aprobó el 2026-09-29 un acceso controlado, con respaldo. Es este:

| Pieza | Qué hace |
|---|---|
| `.github/workflows/hermes-jarvis.yml` | Workflow **manual**, en el runner propio del VPS. El input solo elige qué script correr. |
| `comun.sh` | Funciones comunes (`redactar`, `sec`). Va delante de cada acción. |
| `redactar.sed` | Tapa tokens, claves, correos, teléfonos y chat ids. Se aplica en el VPS **y** en el runner. |
| `diagnostico.sh` | **Solo lectura.** Crontab, trabajos de Hermes, n8n, log de avisos, tablero. |
| `aplicar.sh` / `revertir.sh` | Cambios versionados con respaldo y marcha atrás. Todavía no existen. |

## Cómo se corre

Desde GitHub → Actions → «Hermes Jarvis — acceso controlado al VPS» → Run workflow, o desde la
sesión con `actions_run_trigger` (`workflow_id: hermes-jarvis.yml`, `ref: main`). La salida
queda en el log del job, ya redactada.

## Reglas

- **Nada de comandos por input.** Un cambio nuevo es un commit nuevo en esta carpeta.
- **`aplicar` siempre respalda antes** (en `/root/backups/hermes-jarvis-<fecha>/`) y deja
  `rollback.sh`; `revertir` lo corre.
- Infra tiene UN dueño a la vez (CLAUDE.md §4): esta carpeta toca solo lo que llega a Sergio
  Urcullo (avisos, brief, cierre, calendario). El resto del VPS sigue siendo del carril de infra.

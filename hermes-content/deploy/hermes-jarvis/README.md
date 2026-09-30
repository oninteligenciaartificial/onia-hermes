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
| `aplicar.sh` | Enciende a Jarvis: crontab marcado, pausa 3 trabajos de Hermes, apaga 12 flujos de n8n de reportes, crea el lector y el flujo de cambios de su calendario (y los **prueba** con un evento que crea, mueve y cancela), instala en Hermes la skill `agenda-calendario` y la regla en su SOUL, prende la aduana y **muestra el resumen y el cierre antes de mandarlos**. Respaldo + `rollback.sh`. Idempotente. |
| `revertir.sh` | Corre el `rollback.sh` del último `aplicar` vigente: crontab por marcas, Hermes reanuda lo pausado, n8n reactiva lo apagado y apaga los dos flujos del calendario, la skill y el SOUL de Hermes vuelven a como estaban, aduana apagada. |

## Cómo se corre

Desde GitHub → Actions → «Hermes Jarvis — acceso controlado al VPS» → Run workflow, o desde la
sesión con `actions_run_trigger` (`workflow_id: hermes-jarvis.yml`, `ref: main`). La salida
queda en el log del job, ya redactada.

## Las marcas del crontab

`aplicar` nunca reescribe el crontab a mano: `#jarvis# <línea>` es una línea original que apagó, y
`<línea> #jarvis` una que agregó (el `sh` del cron toma `#jarvis` como comentario). `revertir` saca
exactamente eso y respeta lo que otro haya cambiado después. **No editar a mano una línea marcada.**

## Reglas

- **Nada de comandos por input.** Un cambio nuevo es un commit nuevo en esta carpeta.
- **`aplicar` siempre respalda antes** (en `/root/backups/hermes-jarvis-<fecha>/`) y deja
  `rollback.sh`; `revertir` lo corre.
- Infra tiene UN dueño a la vez (CLAUDE.md §4): esta carpeta toca solo lo que llega a Sergio
  Urcullo (avisos, brief, cierre, calendario). El resto del VPS sigue siendo del carril de infra.

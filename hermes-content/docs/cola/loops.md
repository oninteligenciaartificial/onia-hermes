# Los loops — qué debe estar registrado

**Fuente de verdad de QUÉ loops deben existir y DÓNDE corre cada uno.** Un loop es un prompt en
disco con un horario registrado en algún lado — y desde el 2026-09-01 ese "algún lado" son **dos**:

| dónde corre | el prompt vive en | el horario vive en |
|---|---|---|
| Windows | `C:\Users\PC\.claude\scheduled-tasks\<id>\SKILL.md` | la app de Claude Code (`list_scheduled_tasks`) |
| VPS | `/root/bin/loops/<id>.md` (fuente: [`scripts/loops/prompts/`](../../../scripts/loops/prompts/)) | `crontab -l` en `187.77.16.63` |

**El prompt sobrevive al cerrar la app; el registro del horario NO.** Ya pasó el 2026-08-31: los
archivos quedaron en disco, desregistrados, los loops dejaron de correr y **nada avisó** — se
descubrió por casualidad al listarlos.

Hasta ese día el conjunto **sólo existía dentro de la app**. Si se perdía, no había contra qué
comparar. Este archivo es ese "contra qué".

> **Por qué vive acá.** Es un doc de proceso y fuente de verdad, no código de herramienta: la
> tabla *"Dónde va cada cosa"* de `CLAUDE.md` manda eso a `hermes-content/docs/`, **sin fecha en
> el nombre** (una fecha lo convertiría en historia, y esto tiene que ser lo vigente). Dentro de
> `docs/`, va en `cola/` porque la doctrina de los loops ya vive en el [`README.md`](README.md)
> de esta carpeta — un tema, un lugar. El README explica el **porqué**; este archivo es la
> **lista** contra la que se compara.

**Cómo se lee.** `id` es el `taskId` exacto y `cron` es el `cronExpression` exacto, tal como los
devuelve `list_scheduled_tasks`. Cada loop activo compara esa salida contra estas dos tablas al
arrancar — ver la sección *"Chequeo de arranque"* dentro de cada `SKILL.md`.

**Verificado en vivo con `list_scheduled_tasks` el 2026-08-31.**

## Deben existir y estar activos

**Desde el 2026-09-01 el conjunto vive en DOS lugares**, y la columna *dónde corre* es la que
manda. Un loop se compara **sólo contra el registro de su propia máquina**:

- **`Windows`** → tarea programada de la app de Claude Code. Se lista con `list_scheduled_tasks`
  y se rearma con `create_scheduled_task` / `update_scheduled_task`.
- **`VPS`** → línea de `crontab` en `187.77.16.63`, apuntando a `/root/bin/onia-loop.sh <id>`.
  Se lista con `crontab -l`. Detalle de instalación y barandas:
  [`scripts/loops/README.md`](../../../scripts/loops/README.md).

| id | dónde corre | cron | para qué sirve |
|---|---|---|---|
| `chatbot-cola` | **VPS** | `3 * * * *` (UTC) | Carril chatbot: su cola hasta que un desconocido escriba y se vea en la bandeja |
| `canario-visual` | **VPS** | `41 4,10,16,22 * * *` (UTC) | Abre y MIRA las pantallas de cliente; cada diferencia se vuelve ítem de cola del carril dueño |
| `marca-personal` | **VPS** | `56 13,21 * * *` (UTC) | Carril marca personal: drop del día siguiente + 1 pieza de producción |
| `onia-cola` | Windows | `17 * * * *` | **El integrador**: mergea las ramas de carril a `main`; después su cola de plataforma |
| `contenido-cola` | Windows | `31 */3 * * *` | Carril contenido: publicar lo que YA existe hasta que el feed esté vivo |
| `web-factory-dev-loop` | Windows | `45 * * * *` | Construye la siguiente tarea de `web-factory/docs/LOOP_COLA.md` |

⚠️ **Corregido 2026-09-02.** `marca-personal` corría en `crontab -l` del VPS y no estaba en esta
tabla — verificado en vivo el mismo día. `scripts/loops/onia-loop.sh` en el repo tampoco tenía su
`case`: sólo existía en `/root/bin/onia-loop.sh` del VPS, hand-editado y nunca commiteado (junto
con los casos de `onia-cola` y `docs-auditoria`). Un loop que reinstale el script desde el repo
per `scripts/loops/README.md` habría borrado los tres sin avisar. Sincronizado el `.sh` al repo
en el mismo commit.

### `docs-auditoria` — construido y probado, TODAVÍA sin horario

Este carril (el que audita ESTE archivo) tiene worktree (`/root/loops/onia-hermes-docs`, rama
`claude/git-status-935f47`), prompt (`/root/bin/loops/docs-auditoria.md`) y `case` en
`onia-loop.sh` — corrió una vez a mano el 2026-09-02T02:21 UTC con `exit 0`. **No tiene línea en
`crontab -l`**: sin ella, esta vuelta no se repite sola. No entra todavía en la tabla de arriba
porque esa tabla es "deben existir y estar ACTIVOS", y activo no está. La cadencia (y el permiso
para prender el cron) queda anotada para Sergio en
`ONIA_RADAR_DECISIONES_PRODUCTO.md`.

Los horarios están **escalonados a propósito**: comparten CPU y disco, y dos loops sobre el mismo
árbol se pisan. No los juntes en el mismo minuto.

⚠️ **El cron del VPS corre en UTC; las tareas de Windows, en hora de La Paz (UTC−4).** Por eso
`canario-visual` figura como `41 4,10,16,22` y no `41 */6`: es el mismo horario de La Paz
(00:41 · 06:41 · 12:41 · 18:41) escrito en UTC. `chatbot-cola` es horario, así que el minuto no
cambia.

### 🔴 Un loop NO rearma a los de la otra máquina

Es la regla que hace que la mudanza no se deshaga sola. Un loop de Windows **no ve** los del VPS
en `list_scheduled_tasks`, y uno del VPS **no ve** los de Windows en `crontab -l`. Si cada uno
"rearma lo que falta" sin mirar esta columna, el resultado es **dos `chatbot-cola` sobre la misma
rama, en dos máquinas**, pisándose.

- Si corrés en **Windows**: las filas `VPS` **no son tuyas**. Que no aparezcan en
  `list_scheduled_tasks` es lo **esperado**, no una falla. No las crees, no las habilites.
- Si corrés en el **VPS**: las filas `Windows` **no son tuyas**. Que no aparezcan en
  `crontab -l` es lo **esperado**. No las toques.

## Por qué se mudaron dos loops al VPS

Las tareas programadas de la app **sólo disparan cuando la app está quieta**, y la sesión madre
encadena trabajo sin parar. Medido el 2026-09-01: `web-factory-dev-loop` tenía `nextRunAt` a las
18:48, **pasó sin correr** y se corrió recién a las 19:48; `onia-cola`, `chatbot-cola` y
`canario-visual` compartían el **mismo `lastRunAt` al milisegundo** (18:18:54) — la ráfaga de
recuperación al abrir la app. Desde entonces, ninguno había corrido. Y con la laptop apagada no
corren en absoluto.

Decisión de Sergio ese día: *"arranco con DOS loops y medimos antes de mudar el resto"*. Se
eligieron el **productor** (`canario-visual`, el único que mete combustible al sistema) y el
**mejor consumidor medido** (`chatbot-cola`). `onia-cola` se queda en Windows **a propósito**:
es el que integra a `main`, y dos publicadores sobre `main` es el conflicto que `CLAUDE.md`
prohíbe.

⚠️ **Ya no son dos — el 2026-09-01 se sumó `marca-personal`** (verificado en `crontab -l` el
2026-09-02): son TRES los que corren en el VPS. El título de esta sección quedó como historia del
día de la mudanza, no como conteo vigente — el conteo vigente vive en la tabla de arriba.

## Apagados a propósito el 2026-08-31 — NO rearmar

Sus `SKILL.md` **siguen en disco** por si Sergio los quiere de vuelta. Un loop que los encuentre
deshabilitados **los deja así**: están acá con su motivo medido, no son una falla.

| id | cron que tenía | por qué se apagó |
|---|---|---|
| `web-factory-salud` | `21 * * * *` | **7 de 8 corridas fueron no-ops y no dejó rastro en el repo en 48 h.** Sus 4 chequeos son los mismos que `web-factory-dev-loop` ya corre 3× más seguido, y los absorbió. |
| `cerrar-y-revisar-web-factory` | `17 7 * * *` | Corrió **una vez**, no tocó el repo, y competía por el mismo plato con un hermano 288× más rápido, en el mismo árbol y la misma rama. |

## La auto-cura, y lo que no alcanza

Cada loop activo, **antes de trabajar**, lista el registro **de su propia máquina**
(`list_scheduled_tasks` en Windows, `crontab -l` en el VPS), lo compara contra este archivo y
rearma la que falte **de su columna**. El bloque está pegado idéntico en todos: mientras quede
**UN** loop registrado por máquina, ese lado se recompone solo.

**Lo que esto NO puede curar** —y cómo se nota y se rearma a mano— está en el
[`README.md`](README.md), sección *"3. El registro del horario se pierde"*. En una línea: si se
pierden **todos** a la vez, o la máquina está apagada, no queda nadie adentro para notarlo.

Y ahora hay un agujero nuevo, por diseño: **ningún lado vigila al otro.** Si se cae el crontab del
VPS, los tres de Windows no se enteran; si se desregistran los de Windows, los dos del VPS
tampoco. Lo que sí avisa del lado del VPS es el propio corredor: todo fallo sale por Telegram
(`/root/bin/onia-tg.sh`), como mucho uno cada 6 h por loop.

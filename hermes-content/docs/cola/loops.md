# Los loops — qué debe estar registrado

**Fuente de verdad de QUÉ loops deben existir.** Un loop es un prompt en disco
(`C:\Users\PC\.claude\scheduled-tasks\<id>\SKILL.md`) con un horario registrado en la app de
Claude Code. **El `SKILL.md` sobrevive al cerrar la app; el registro del horario NO.** Ya pasó el
2026-08-31: los archivos quedaron en disco, desregistrados, los loops dejaron de correr y **nada
avisó** — se descubrió por casualidad al listarlos.

Hasta hoy el conjunto **sólo existía dentro de la app**. Si se perdía, no había contra qué
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

## Deben existir y estar `enabled: true`

| id | cron | para qué sirve |
|---|---|---|
| `chatbot-cola` | `3 * * * *` | Carril chatbot: su cola hasta que un desconocido escriba y se vea en la bandeja |
| `onia-cola` | `17 * * * *` | **El integrador**: mergea las ramas de carril a `main`; después su cola de plataforma |
| `contenido-cola` | `31 */3 * * *` | Carril contenido: publicar lo que YA existe hasta que el feed esté vivo |
| `canario-visual` | `41 */6 * * *` | Abre y MIRA las pantallas de cliente; cada diferencia se vuelve ítem de cola del carril dueño |
| `web-factory-dev-loop` | `45 * * * *` | Construye la siguiente tarea de `web-factory/docs/LOOP_COLA.md` |

Los horarios están **escalonados a propósito**: comparten CPU y disco, y dos loops sobre el mismo
árbol se pisan. No los juntes en el mismo minuto.

## Apagados a propósito el 2026-08-31 — NO rearmar

Sus `SKILL.md` **siguen en disco** por si Sergio los quiere de vuelta. Un loop que los encuentre
deshabilitados **los deja así**: están acá con su motivo medido, no son una falla.

| id | cron que tenía | por qué se apagó |
|---|---|---|
| `web-factory-salud` | `21 * * * *` | **7 de 8 corridas fueron no-ops y no dejó rastro en el repo en 48 h.** Sus 4 chequeos son los mismos que `web-factory-dev-loop` ya corre 3× más seguido, y los absorbió. |
| `cerrar-y-revisar-web-factory` | `17 7 * * *` | Corrió **una vez**, no tocó el repo, y competía por el mismo plato con un hermano 288× más rápido, en el mismo árbol y la misma rama. |

## La auto-cura, y lo que no alcanza

Cada uno de los cinco loops activos, **antes de trabajar**, lista las tareas programadas, las
compara contra este archivo y rearma la que falte. El bloque está pegado idéntico en los cinco:
mientras quede **UN** loop registrado, el conjunto se recompone solo.

**Lo que esto NO puede curar** —y cómo se nota y se rearma a mano— está en el
[`README.md`](README.md), sección *"3. El registro del horario se pierde"*. En una línea: si se
pierden **todos** a la vez, o la máquina está apagada, no queda nadie adentro para notarlo.

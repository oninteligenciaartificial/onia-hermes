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

**Cómo se lee.** `id` es el nombre exacto con el que se invoca el loop, y `cron` la expresión
exacta tal como está registrada **en su propia máquina**: `crontab -l` en el VPS,
`list_scheduled_tasks` en Windows. Cada loop activo compara esa salida contra estas tablas al
arrancar — ver la sección *"Chequeo de arranque"* dentro de su prompt.

**Verificado en vivo el 2026-09-02**: `crontab -l` en `187.77.16.63` para las cinco filas `VPS`.

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
| `docs-auditoria` | **VPS** | `18 1,5,9,13,17,21 * * *` (UTC) | Carril docs/infra (rama `claude/docs-auditoria`): que lo escrito sea cierto — docs falsos, trabajo pisado, ítems fantasma |
| `onia-cola` | **VPS** | `33 * * * *` (UTC) | **El integrador**: mergea las ramas de carril a `main`; después su cola de plataforma |
| `canario-visual` | **VPS** | `41 4,10,16,22 * * *` (UTC) | Abre y MIRA las pantallas de cliente; cada diferencia se vuelve ítem de cola del carril dueño |
| `web-venta` | **VPS** | `48 */2 * * *` (UTC) | **Dueño de `onia.com.bo/` y `/empezar`** (rama `claude/web-venta`, zona `web-factory/apps/onia-platform/`): la puerta de entrada del producto |
| `marca-personal` | **VPS** | `56 13,21 * * *` (UTC) | Carril marca personal de Sergio: el drop del día siguiente y una pieza de producción |
| `contenido-cola` | Windows | `31 */3 * * *` | Carril contenido: publicar lo que YA existe hasta que el feed esté vivo. **Lo maneja Sergio en su propia sesión — ningún loop lo toca** |

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

## Por qué se mudaron los loops al VPS

Las tareas programadas de la app **sólo disparan cuando la app está quieta**, y la sesión madre
encadena trabajo sin parar. Medido el 2026-09-01: `web-factory-dev-loop` tenía `nextRunAt` a las
18:48, **pasó sin correr** y se corrió recién a las 19:48; `onia-cola`, `chatbot-cola` y
`canario-visual` compartían el **mismo `lastRunAt` al milisegundo** (18:18:54) — la ráfaga de
recuperación al abrir la app. Desde entonces, ninguno había corrido. Y con la laptop apagada no
corren en absoluto.

Decisión de Sergio ese día: *"arranco con DOS loops y medimos antes de mudar el resto"*. Se
eligieron el **productor** (`canario-visual`, el único que mete combustible al sistema) y el
**mejor consumidor medido** (`chatbot-cola`).

### El 2026-09-02 se mudó el resto — y `onia-cola` era el que más dolía

⚠️ **Acá decía que `onia-cola` se quedaba en Windows "a propósito", porque "dos publicadores
sobre `main` es el conflicto que `CLAUDE.md` prohíbe". Era un razonamiento equivocado**, y caro:
lo que `CLAUDE.md` prohíbe es que haya **dos integradores**, no que el único integrador corra en
Linux. Sigue habiendo **uno solo** — sólo que ahora corre donde sí dispara.

El costo de esa frase, medido el 2026-09-02: `onia-cola` es el **único** loop que mergea a `main`,
y en Windows llevaba días sin correr. Resultado: `claude/chatbots-platform-review-0d1d09`
acumulaba **7 commits** sin llegar a `main`, y `main` es lo que alimenta el deploy del VPS y el de
Vercel. **Un integrador que no corre no es un integrador.**

Se mudó también `docs-auditoria` (carril docs/infra, nuevo) y `marca-personal` (que ya corría en
el VPS desde el 2026-09-01 pero **nunca se había escrito en esta tabla** — el archivo existía y la
lista contra la que se compara, no).

**Y `docs-auditoria` estrenó con una colisión de rama que no hay que repetir.** Se le dio la
misma rama que usa la sesión de control (`claude/git-status-935f47`), y en su primera vuelta las
dos escribieron este mismo archivo en paralelo: hubo que resolver el conflicto a mano y una de
las dos habría quedado con el push rechazado. Ya tiene rama propia (`claude/docs-auditoria`).
**Un carril, una rama** — la regla estaba escrita en `CLAUDE.md` y se rompió igual, porque crear
un worktree apuntando a una rama que ya tiene dueño **no avisa nada**.

**`contenido-cola` se queda en Windows a propósito**, y esto sí es una decisión, no una omisión:
Sergio, 2026-09-01 — *"no toques el de contenido, el de contenido lo maneja su sesión"*.

### 🔴 El sistema integraba y auditaba, y no construía nada

Lo cazó Sergio el mismo 2026-09-02, mirando la lista: *"pero y loops para tu desarrollo no tenés
entonces?"*. Tenía razón, y el agujero era estructural, no un olvido:

- `docs-auditoria` **audita**, no construye.
- `canario-visual` **produce ítems de cola**, no los cierra.
- `chatbot-cola` y `marca-personal` construyen, pero **sólo lo suyo**.
- `onia-cola` decía construir *"sólo si no había nada que integrar"* — y con cinco carriles
  pusheando **casi nunca** iba a llegar ahí. **La cola de plataforma no tenía a nadie.**

Dos cambios:

1. **`onia-cola` mergea UN carril por vuelta y después construye** si le queda más de la mitad
   del tope. Integrar es rápido; el resto de la hora es para cerrar ítems.
2. **Nace `web-venta`**, dueño de `onia.com.bo/` y `/empezar`. Esas dos pantallas vivían en
   `web-factory/apps/onia-platform/`, una carpeta que **ninguna cola nombraba** y que la zona del
   viejo loop de web-factory **prohibía explícitamente**. El canario encontraba defectos ahí y
   los dejaba anotados **sin nadie que los consumiera** — por eso seguían vivos la maqueta
   cortada en desktop y la falta de un gate que corra `tsc` sobre el sitio de venta. Son la
   primera pantalla que ve un lead: el defecto más caro del sistema estaba en la superficie sin
   dueño.

⚠️ **El conteo de esta sección es historia, no estado.** Empezó con dos, sumó `marca-personal` el
2026-09-01, y con `onia-cola` y `docs-auditoria` el 2026-09-02 son **cinco** en el VPS
(verificado en `crontab -l` ese día). **El conteo vigente vive sólo en la tabla de arriba** — si
esta sección y esa tabla no coinciden, gana la tabla.

## Apagados a propósito el 2026-08-31 — NO rearmar

Sus `SKILL.md` **siguen en disco** por si Sergio los quiere de vuelta. Un loop que los encuentre
deshabilitados **los deja así**: están acá con su motivo medido, no son una falla.

| id | cron que tenía | por qué se apagó |
|---|---|---|
| `web-factory-salud` | `21 * * * *` | **7 de 8 corridas fueron no-ops y no dejó rastro en el repo en 48 h.** Sus 4 chequeos son los mismos que `web-factory-dev-loop` ya corre 3× más seguido, y los absorbió. |
| `cerrar-y-revisar-web-factory` | `17 7 * * *` | Corrió **una vez**, no tocó el repo, y competía por el mismo plato con un hermano 288× más rápido, en el mismo árbol y la misma rama. |
| `web-factory-dev-loop` | `45 * * * *` (Windows) | **Se quedó sin combustible.** Medido el 2026-09-02 en `web-factory/docs/LOOP_COLA.md`: `CARRIL A` y `CARRIL B` con **cero** ítems sin marcar, 27 hechos, y los 2 que quedan sin marcar están en *"Bloqueadas (esperan a Sergio)"* — que **no es cola**. La primera regla de armar un loop es *"¿este carril tiene una cola con ítems reales?"*; sin eso, un loop no se planta: **inventa trabajo**. No se migró al VPS a propósito. **Para revivirlo hace falta rellenar `CARRIL A`, no rearmar el cron.** |

## La auto-cura, y lo que no alcanza

Cada loop activo, **antes de trabajar**, lista el registro **de su propia máquina**
(`list_scheduled_tasks` en Windows, `crontab -l` en el VPS), lo compara contra este archivo y
rearma la que falte **de su columna**. El bloque está pegado idéntico en todos: mientras quede
**UN** loop registrado por máquina, ese lado se recompone solo.

**Lo que esto NO puede curar** —y cómo se nota y se rearma a mano— está en el
[`README.md`](README.md), sección *"3. El registro del horario se pierde"*. En una línea: si se
pierden **todos** a la vez, o la máquina está apagada, no queda nadie adentro para notarlo.

Y hay un agujero por diseño: **ningún lado vigila al otro.** Si se cae el crontab del VPS,
`contenido-cola` no se entera; si se desregistra `contenido-cola`, los cinco del VPS tampoco. Lo
que sí avisa del lado del VPS es el propio corredor: todo fallo sale por Telegram
(`/root/bin/onia-tg.sh`), como mucho uno cada 6 h por loop.

⚠️ Desde el 2026-09-02 el desbalance es fuerte: **cinco loops en el VPS y uno solo en Windows.**
La auto-cura del lado de Windows cuelga de ese único loop — si `contenido-cola` se desregistra,
**no queda nadie de ese lado para rearmarlo**, y los del VPS no lo ven ni lo tocan a propósito.
Lo nota una persona: cero commits del carril de contenido en varios días.

## Cómo se agrega o se saca un loop del VPS

1. **Verificá que el carril tenga cola con ítems reales.** Si no la tiene, parás acá — ver
   `web-factory-dev-loop` en la tabla de apagados.
2. El prompt versionado va en [`scripts/loops/prompts/<id>.md`](../../../scripts/loops/prompts/)
   y se copia a `/root/bin/loops/<id>.md` en el VPS. **Los dos, o el que corre queda huérfano.**
3. El `case` va en [`scripts/loops/onia-loop.sh`](../../../scripts/loops/onia-loop.sh) (worktree,
   rama, tope, tools) y también se copia a `/root/bin/onia-loop.sh`.
4. El worktree: `git -C /root/loops/onia-hermes worktree add /root/loops/<carpeta> <rama>`.
5. **Corrélo a mano una vez y leé el log entero.** Un cron escrito no es un cron que anda.
6. Recién ahí la línea de cron, **en UTC** y escalonada contra el minuto efectivo.
7. Y agregalo a la tabla de arriba — si no está acá, la auto-cura no lo rearma nunca.

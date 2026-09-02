# Los loops — qué debe estar registrado

**Fuente de verdad de QUÉ loops deben existir y DÓNDE corre cada uno.** Un loop es un prompt en
disco con un horario registrado en algún lado — y desde el 2026-09-01 ese "algún lado" son **dos**:

| dónde corre | el prompt vive en | el horario vive en |
|---|---|---|
| Windows | `C:\Users\PC\.claude\scheduled-tasks\<id>\SKILL.md` | la app de Claude Code (`list_scheduled_tasks`) |
| VPS | `/root/bin/loops/<id>.md` (fuente: [`scripts/loops/prompts/`](../../../scripts/loops/prompts/)) | `crontab -l` en `187.77.16.63` |

🔄 **Desde el 2026-09-02 el VPS se despliega solo.** `/root/bin/onia-loops-sync.sh` corre cada
hora al minuto 44 —once minutos después del integrador— y copia el corredor y los prompts
**desde `main`** a `/root/bin`, de forma atómica. Lo que se mergea queda corriendo en la vuelta
siguiente, **sin que nadie toque la laptop**. Antes había que copiarlos a mano, y por eso el
canario pasó un día entero ejecutando la versión de cinco pantallas mientras `main` ya tenía la
de diez: **commitear una mejora no la enciende.**

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

**Verificado en vivo el 2026-09-02 09:18 UTC**: `crontab -l` en `187.77.16.63` para las siete
filas `VPS`.

⚠️ **Re-verificado el mismo día, vuelta siguiente: `marca-personal` ya no corría `56 13,21` sino
`56 9,13,17,21` (4×/día, no 2×/día).** La tabla decía 2×/día porque así se verificó horas antes;
el cron real ya había cambiado para cuando esta vuelta lo miró de nuevo (mtime de
`/var/spool/cron/crontabs/root`: 03:34 UTC, después de esa verificación). Corregido acá y en
`ONIA_RADAR_DECISIONES_PRODUCTO.md` ítem 17, que todavía citaba el patrón viejo. Una verificación
de hace horas también hay que re-contarla, no asumirla vigente.

⚠️ **Y a las 09:18 UTC faltaban DOS más: `web-venta` e `investigacion`.** Los dos corrían en
`crontab -l` y ninguno estaba en esta tabla — el mismo agujero que tuvo `marca-personal`, tres
veces en un día. **Comparar la tabla contra `crontab -l` no alcanza si sólo se mira en una
dirección**: el chequeo de arranque busca filas de la tabla que falten en el cron, y así nunca ve
una línea de cron que falte en la tabla. Es el sentido que deja al loop invisible: existe, corre,
gasta, y la auto-cura no lo rearma nunca porque no sabe que existe.

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
| `canario-visual` | **VPS** | `41 0,3,6,9,12,15,18,21 * * *` (UTC) | Abre y MIRA las pantallas de cliente; cada diferencia se vuelve ítem de cola del carril dueño |
| `investigacion` | **VPS** | `26 3,9,15,21 * * *` (UTC) | **Cotiza** las decisiones abiertas del radar para que Sergio decida en tanda, una vez, sobre un archivo (rama `claude/investigacion`) |
| `web-venta` | **VPS** | `48 * * * *` (UTC) | **Dueño de `onia.com.bo/` y `/empezar`** (rama `claude/web-venta`, zona `web-factory/apps/onia-platform/`): la puerta de entrada del producto |
| `lucia` | **VPS** | `37 0,3,6,9,12,15,18,21 * * *` (UTC) | Carril modelos/Higgsfield (rama `claude/lucia-vps`): guiones, briefs y prompts LISTOS. **No dispara nada pago** |
| `marca-personal` | **VPS** | `56 9,13,17,21 * * *` (UTC) | Carril marca personal de Sergio: el drop del día siguiente y una pieza de producción |
| `kpis-semanal` | **VPS** | `7 13 * * 1` (UTC) | Tablero KPIs del lunes del carril marca personal; pide a Sergio los numeros que solo el ve |
| `recorrido-cliente` | **VPS** | `9 1,4,7,10,13,16,19,22 * * *` (UTC) | Recorre el camino del cliente de punta a punta (rama `claude/recorrido-cliente`) y dice **en qué paso exacto se rompe**, con la captura como prueba |
| `web-factory-dev` | **VPS** | `21 2,8,14,20 * * *` (UTC) | Webs de cliente terminadas Y publicables con un comando (rama `claude/web-factory-dev`; cola en `web-factory/docs/LOOP_COLA.md`) |
| `tendencias` | **VPS** | `51 11,23 * * *` (UTC) | Convierte lo que funciona AHORA en el rubro en recetas accionables de contenido, cada una con su fuente pública (rama `claude/tendencias`) |
| `calidad-generado` | **VPS** | `5 3,9,15,21 * * *` (UTC) | Que Onia no publique una pieza mala y que Lucía sea SIEMPRE la misma cara (rama `claude/calidad-generado`) |
| `supervisor` | **VPS** | `29 */2 * * *` (UTC) | **Audita a los otros loops**: que ninguno cobre por trabajo que no sirve (rama `claude/supervisor`). No mergea a `main` — deja lo que encuentra en el tablero |
| `contenido-cola` | Windows | `31 */3 * * *` | Carril contenido: publicar lo que YA existe hasta que el feed esté vivo. **Lo maneja Sergio en su propia sesión — ningún loop lo toca** |

⚠️ **Corregido 2026-09-02 20:40 UTC — la tabla tenía 10 filas y el cron 14.** Faltaban
`recorrido-cliente`, `web-factory-dev`, `tendencias`, `calidad-generado` y `supervisor`: los cinco
con línea de cron, prompt en disco y `case` en el corredor, **corriendo y gastando desde hacía
horas**, invisibles para este archivo. Y tres de las filas que sí estaban mentían el horario:
`canario-visual` corría `41 0,3,6,9,12,15,18,21` (no `41 4,10,16,22`), `lucia`
`37 0,3,6,9,12,15,18,21` (no `37 5,11,17,23`) y `web-venta` `48 * * * *` (no `48 */2`). Es el
mismo agujero de sentido único que este archivo ya describe, a mayor escala.

⚠️ **Y la trampa que casi lo empeora: `crontab -l | head -50` corta la lista.** El integrador
arrancó esa vuelta con ese comando y concluyó que `lucia` y `kpis-semanal` **no tenían cron** —
los dos están en las líneas 60 y 62 de un crontab de 68. Estuvo a un paso de "rearmar" dos líneas
que ya existían, o sea de **duplicarlas**: dos corridas simultáneas del mismo loop sobre el mismo
worktree. **El chequeo de arranque se hace con `crontab -l | grep onia-loop.sh`, nunca con un
`head`**: la lista crece, y un truncado silencioso convierte la auto-cura en el daño.

⚠️ **Corregido 2026-09-02.** `marca-personal` corría en `crontab -l` del VPS y no estaba en esta
tabla — verificado en vivo el mismo día. `scripts/loops/onia-loop.sh` en el repo tampoco tenía su
`case`: sólo existía en `/root/bin/onia-loop.sh` del VPS, hand-editado y nunca commiteado (junto
con los casos de `onia-cola` y `docs-auditoria`). Un loop que reinstale el script desde el repo
per `scripts/loops/README.md` habría borrado los tres sin avisar. Sincronizado el `.sh` al repo
en el mismo commit.

⚠️ **Y volvió a divergir en menos de siete horas.** A las 09:18 UTC el `.sh` del repo era otra vez
el viejo: sin `web-venta`, sin `investigacion`, con la rama vieja de `docs-auditoria`, con
`claude-sonnet-5` donde el VPS ya corría `claude-opus-5 --effort max`, y sin la guarda de
`MERGE_HEAD`. **El peligro no era hipotético: reinstalar desde el repo habría bajado el modelo de
todos los loops y borrado dos carriles.** Sincronizar una vez no arregla nada si el que corre se
sigue editando a mano — lo que falta es que el propio corredor avise de la diferencia, como ya
hace con los prompts (`ddc3b9f1`). Anotado en el radar.

### 🔴 Un loop puede morir con su cron INTACTO — y en silencio

Acá decía que `docs-auditoria` estaba *"construido y probado, TODAVÍA sin horario"*, con rama
`claude/git-status-935f47`. **Las dos cosas eran falsas al 2026-09-02 09:18 UTC**: tiene su línea
(`18 1,5,9,13,17,21`), está en la tabla de arriba, y su rama es `claude/docs-auditoria` desde ese
mismo día. La sección se contradecía con la tabla del propio archivo.

Lo que ocupa su lugar es un modo de falla peor, encontrado en esa misma vuelta:

**`investigacion` tenía su línea de cron y aun así estaba muerto.** Corrió una sola vez
(03:00:20Z, `exit 0`, commit `a7a28f63` — cerró cuatro decisiones fantasma del radar). Después,
cuando se reescribió `/root/bin/onia-loop.sh` a las 05:44 para agregar `web-venta` y la guarda de
`MERGE_HEAD`, **su `case` desapareció del script y nadie lo notó**. Desde entonces cada corrida
del cron caía en el `*)`:

```
uso: /root/bin/onia-loop.sh <canario-visual|chatbot-cola|marca-personal|onia-cola|docs-auditoria|web-venta>
```

El `exit 64` ocurre **antes** de la función `avisar` — así que no salió por Telegram. Un loop
registrado, con prompt en disco y worktree vivo, que no corría y no lo decía. El `case` tampoco
estaba en ninguno de los tres backups del script: se perdió del todo.

**Por eso el chequeo de arranque de un loop no puede mirar sólo el cron.** Que la línea esté no
prueba que el loop corra. Lo que sí lo prueba es el log: si `/var/log/onia-loop-<id>.log` no tiene
un `ARRANCA` posterior a la última hora que le tocaba, ese loop está muerto aunque su cron esté
perfecto.

Restaurado el 2026-09-02 09:20 UTC con los tres valores que su propio log había registrado
(`rama claude/investigacion — tope 2400s`) y el worktree que figura en `git worktree list` — no de
memoria. En el mismo commit se versionaron `scripts/loops/onia-loop.sh` y los siete prompts, que
estaban atrás de lo que corría.

Nada de esto fue error de quien lo escribió: cada versión era cierta cuando la midió. Es el costo
normal de dos manos sobre el mismo archivo, y la razón de la regla **"el que MIRA agrega, el que
ARREGLA marca"** de [`EQUIPO.md`](EQUIPO.md).

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

## 🔴 Quién decide QUÉ hacen los loops — desde el 2026-09-02

Ocho loops, y hasta hoy **ninguno decidía qué importa más**: cada uno comía de su propia cola y
la prioridad la ponía Sergio a mano, todos los días. Pedido suyo ese día: *"quiero que ordenes y
que yo sólo dé el veredicto final"*.

El circuito, sin él en el medio:

```
Hermes ordenador   cada 2 h   mide el estado real → deja ≤3 tareas en el tablero `onia`
Los 8 loops        su horario  leen el TABLERO primero, reclaman con cerrojo, ejecutan
Hermes veredicto   1 vez/día   a Sergio SÓLO lo que decide él (máx. 5, con costo)
```

**El tablero le gana a la cola en markdown**, y no por gusto: probado el 2026-09-02, dos carriles
que cierran ítems **distintos** del mismo archivo —la línea 3 y la línea 4— **dan conflicto
igual**, porque git no separa líneas pegadas. En el tablero cada tarea es una **fila** y se
reclama con un cerrojo atómico. Reglas y cómo entra una sesión nueva:
[`TABLERO.md`](TABLERO.md).

⚠️ **Las colas en markdown NO están jubiladas.** Siguen siendo el trabajo interno de cada carril.
El tablero es donde entra la prioridad y donde se cruzan las sesiones. **Si algo está en los dos,
manda el tablero y se saca del markdown en la misma vuelta.**

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

⚠️ **El conteo de esta sección se quedó viejo tres veces en un día** — "dos", después "TRES", y a
las 09:18 UTC del 2026-09-02 eran **seis** en el VPS. **No lo actualices más acá:** los títulos y
párrafos de esta sección son historia del día de la mudanza, y un número suelto en prosa es
justamente lo que se pudre. El conteo vigente es la tabla de arriba, y se cuenta con `crontab -l`.

## Apagados a propósito el 2026-08-31 — NO rearmar

Sus `SKILL.md` **siguen en disco** por si Sergio los quiere de vuelta. Un loop que los encuentre
deshabilitados **los deja así**: están acá con su motivo medido, no son una falla.

| id | cron que tenía | por qué se apagó |
|---|---|---|
| `web-factory-salud` | `21 * * * *` | **7 de 8 corridas fueron no-ops y no dejó rastro en el repo en 48 h.** Sus 4 chequeos son los mismos que `web-factory-dev-loop` ya corre 3× más seguido, y los absorbió. |
| `cerrar-y-revisar-web-factory` | `17 7 * * *` | Corrió **una vez**, no tocó el repo, y competía por el mismo plato con un hermano 288× más rápido, en el mismo árbol y la misma rama. |
| `web-factory-dev-loop` | `45 * * * *` (Windows) | **Se quedó sin combustible.** Medido el 2026-09-02 en `web-factory/docs/LOOP_COLA.md`: `CARRIL A` y `CARRIL B` con **cero** ítems sin marcar, 27 hechos, y los 2 que quedan sin marcar están en *"Bloqueadas (esperan a Sergio)"* — que **no es cola**. La primera regla de armar un loop es *"¿este carril tiene una cola con ítems reales?"*; sin eso, un loop no se planta: **inventa trabajo**. No se migró al VPS a propósito. **Para revivirlo hace falta rellenar `CARRIL A`, no rearmar el cron.** ⚠️ **REVIVIÓ el 2026-09-02** como `web-factory-dev` en el VPS (`21 2,8,14,20`, commit `0c48cf72`): se cumplió la condición que esta misma fila exigía — `CARRIL A` volvió a tener 7 ítems reales. **Está en la tabla de activos de arriba; esta fila es historia, no una orden de apagarlo.** |

## La auto-cura, y lo que no alcanza

Cada loop activo, **antes de trabajar**, lista el registro **de su propia máquina**
(`list_scheduled_tasks` en Windows, `crontab -l` en el VPS), lo compara contra este archivo y
rearma la que falte **de su columna**. El bloque está pegado idéntico en todos: mientras quede
**UN** loop registrado por máquina, ese lado se recompone solo.

**Esa comparación es un comando, no una lectura** (desde el 2026-09-02, en el VPS):

```
npm run loops:registrados
```

Compara `crontab -l` contra la tabla de arriba **en las dos direcciones** —filas sin cron **y**
líneas de cron sin fila— y también los horarios. Sale `1` con la lista de diferencias y verde si
coinciden. Va dentro de `npm test`, así que el integrador no puede mergear con la tabla mintiendo.
Nace de que el chequeo pegado en los prompts sólo miraba en un sentido: buscaba filas que
faltaran en el cron, y por eso **nunca podía ver** los cinco loops que corrían sin figurar acá.
Un archivo que se compara a ojo divergió tres veces en un solo día.

⚠️ **No listes el cron con `head`.** Ese mismo día el integrador arrancó con
`crontab -l | head -50`, la lista tenía 68 líneas, y concluyó que `lucia` y `kpis-semanal` no
estaban registrados: estaban, en las líneas 60 y 62. "Rearmar" una línea que ya existe la
**duplica**, y dos corridas simultáneas del mismo loop comparten worktree y rama. Siempre
`crontab -l | grep onia-loop.sh`, o directamente el comando de arriba.

**Lo que esto NO puede curar** —y cómo se nota y se rearma a mano— está en el
[`README.md`](README.md), sección *"3. El registro del horario se pierde"*. En una línea: si se
pierden **todos** a la vez, o la máquina está apagada, no queda nadie adentro para notarlo.

Y hay un agujero por diseño: **ningún lado vigila al otro.** Si se cae el crontab del VPS,
`contenido-cola` no se entera; si se desregistra `contenido-cola`, los del VPS tampoco.

⚠️ **Acá decía que "todo fallo sale por Telegram" del lado del VPS. Es falso, y su excepción es
exactamente la que dejó muerto a `investigacion` seis horas.** El corredor define `avisar()` en la
línea 121; el `exit 64` del nombre no reconocido está en la 97. **Todo lo que falla antes de la
línea 121 falla mudo** — medido el 2026-09-02 corriendo
`/root/bin/onia-loop.sh nombre-que-no-existe`: imprime el uso, sale 64, no manda nada. Lo que sí
avisa es lo que falla *después* de esa línea, como mucho uno cada 6 h por loop.

⚠️ Desde el 2026-09-02 el desbalance es fuerte: **casi todos los loops en el VPS y uno solo en
Windows** (el conteo exacto, en la tabla de arriba).
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
8. **Al día siguiente, mirá su log una vez más.** `tail /var/log/onia-loop-<id>.log`: si no hay un
   `ARRANCA` posterior a la última hora que le tocaba, está muerto aunque el cron esté perfecto.
   Es el único paso que detecta lo que le pasó a `investigacion` — un `case` borrado por la
   siguiente edición del corredor, fallando mudo cada 6 h.

> ⚠️ **El paso 3 es el frágil, y ya falló dos veces en un día.** Editar sólo
> `/root/bin/onia-loop.sh` deja el `case` sin versionar: la próxima reescritura del script lo
> borra y no queda copia en ningún backup. **Editá el del repo, copiálo al VPS, y verificá con
> `diff` que quedaron idénticos** — no al revés.


## Scripts de aviso (sh, sin IA) — tambien en el crontab del VPS

Viven versionados en `scripts/loops/extras/` y desplegados a `/root/bin/`. No usan
Claude: cuestan cero y avisan por Telegram. El chequeo de arranque de los loops NO
los rearma (apuntan a otro binario); si faltan, reponerlos a mano de esta lista.

| script | cron (UTC) | que hace |
|---|---|---|
| `onia-drop-recordatorio.sh` | `45 22 * * *` | manda el drop del dia listo-para-pegar 15 min antes de las 19:00 La Paz |
| `onia-vigia-embudo.sh` | `19 */6 * * *` | chequea landing, cal y Postiz; avisa SOLO al caerse o volver |
| `onia-leads-vigia.sh` | `9 */2 * * *` | avisa solicitudes de acceso nuevas (access_requests) con datos de contacto |

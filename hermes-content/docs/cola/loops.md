# Los loops — qué debe estar registrado

> **HISTÓRICO desde el 17-oct-2026.** Reemplazado por `AGENTS.md` §1 (quién hace qué: la jefa reparte, la madre controla la PC, Codex solo revisa) y §4 (`main` solo por PR con CI verde y revisión de Codex; «Quién decide»). Donde diga que `onia-cola` o la madre mergean, que un loop se rearma contra esta lista o que lo visual se publica sin esperar, ya no rige. Las colas vigentes: `cola/loop/README.md`.
> **`onia-cola` está MUERTO desde el 27-sep:** no debe existir ni rearmarse, y nada de lo que sigue lo autoriza a mergear.

**Fuente de verdad de QUÉ loops deben existir y DÓNDE corre cada uno.** Un loop es un prompt en
disco con un horario registrado en algún lado — y desde el 2026-09-05 ese "algún lado" son **tres**:

| dónde corre | el prompt vive en | el horario vive en |
|---|---|---|
| `Windows` | `C:\Users\PC\.claude\scheduled-tasks\<id>\SKILL.md` | la app de Claude Code (`list_scheduled_tasks`) |
| `VPS` | `/root/bin/loops/<id>.md` (fuente: [`scripts/loops/prompts/`](../../../scripts/loops/prompts/)) | `crontab -l` en `187.77.16.63` |
| `casa` | `/root/bin/loops/<id>.md` dentro de WSL | `crontab -l` en **nodo-casa** (`DESKTOP-0GGGNMF`) |

🔴 **Los nombres de las máquinas, definidos el 2026-09-06 — y la ambigüedad ya costó.**
Acá y en `PLAN_HOMELAB.md` se decía **«la PC de casa»**, y en la casa de Sergio Urcullo hay
**dos** Windows detrás del mismo router (misma IP pública). Ese día corrió el instalador de
arranque de WSL en la equivocada y Windows contestó *«el argumento … no existe»*, que no dice
«máquina equivocada» en ningún lado. Un nombre ambiguo se paga en un error que no se explica
solo.

| nombre | máquina | qué es | cómo se reconoce |
|---|---|---|---|
| **laptop** | `DESKTOP-ENV6SDA` | HP Victus 16, 12 hilos, 23,6 GB, **con batería**, Win 11 Home. Donde Sergio Urcullo trabaja y habla con las sesiones. **No tiene nada del nodo** | su Ubuntu **no** tiene `/root/loops` ni `/root/.onia-nodo` |
| **nodo-casa** | `DESKTOP-0GGGNMF` | El tercer nodo: `/root/loops`, los worktrees, y los loops de entonces — `web-venta`, `chatbot-cola`, `recorrido-cliente` (y `onia-cola`, muerto desde el 27-sep) | existe `/root/.onia-nodo` |
| **VPS** | `srv1360183` · 187.77.16.63 | Producción: la app, Supabase, Chatwoot y los publicadores. **Ya no corre ningún loop** | existe `/usr/local/lib/hermes-agent/venv/bin/python` |

⚠️ **Esas dos celdas decían otra cosa hasta el 2026-09-07 — corregidas contra la medición.**
Decían que en casa *«`web-venta` [estaba] activa y las otras 4 comentadas»* y que el VPS corría
*«los 3 loops que no pueden mudarse»*. Contado en vivo a las 05:40 UTC: casa tiene **cuatro**
líneas activas y el VPS **cero** (`crontab -l | grep -c 'onia-loop\.sh'` da `0` allá). La tabla de
*«Deben existir y estar activos»* de más abajo sí estaba al día — la que envejeció es esta, que es
prosa y no la lee ningún gate. Se ve con: `crontab -l | grep onia-loop.sh` en cada máquina.

🔴 **La mudanza dejó al integrador sin poder mergear uno de sus dos repos, y en silencio.**
`onia-cola` *(MUERTO desde el 27-sep; esto es historia)* era el único loop autorizado a mergear, y le tocaban **dos** repos. En nodo-casa,
`/root/loops/onia-platform` tiene la url de push puesta a mano en
`DESHABILITADO-NODO-DE-DESARROLLO` (es un seguro, puesto a propósito), y la llave de deploy
`/root/.ssh/deploy_onia-platform` **sólo existe en el VPS**. Con el VPS ya sin loops, ninguna
máquina quedaba en condiciones de integrar ese repo.

**Hoy no muerde porque `onia-platform` no tiene ni una rama de carril sin mergear — y por eso es
peligroso: falla ABIERTO.** El día que un carril pushee allá, el `--no-merged` crece y nada se
pone rojo; la única señal sería que las vueltas del integrador digan *«no puedo»*, que en el log
se lee igual que *«no había nada que hacer»*.

**No se arregla re-habilitando el push** (revierte un seguro ajeno, y sin la llave tampoco
funcionaría). Se llega desde casa con el shim `/root/bin/onia-vps.sh`. La línea de abajo **la lee
un gate** (`scripts/integrador_puede_mergear.mjs`): si se borra, o si deja de nombrar un script
versionado, `npm test` se pone rojo y nombra el repo.

⚠️ **Acá había una receta escrita a mano — `cd /root/loops/onia-platform && git merge … && git
push origin master` — y estaba ROTA. Corregida el 2026-09-19 por `onia-cola` auditando los `[x]`.**
Decía que ese clon del VPS *«está en `master`, limpio»*: era cierto el 2026-09-07 y **hoy no**.
Medido en vivo ese día: `/root/loops/onia-platform` está en la rama
`claude/chatbots-platform-review-0d1d09` con **106 archivos sucios**, así que esa receta mergeaba
sobre el carril en vuelo de `chatbot-cola` —el único loop que escribe en ese repo— y su
`git push origin master` empujaba una rama local que no es donde se hizo el merge. Además corría
**3 de los 5 gates** del CI y no tenía reintento, así que rebotaba si `master` se movía (rebotó
dos veces el 18-sep). El camino bueno quedó versionado el 18-sep en
`scripts/integrar-onia-platform.sh` —worktree propio, los CINCO gates, reintento— y **nadie lo
nombraba**: un `grep -rl integrar-onia-platform` devolvía sólo `COLA.md` y el propio script, o sea
el integrador de la vuelta siguiente, que arranca sin memoria, leía la receta vencida.

VIA-INTEGRADOR onia-platform casa: /root/bin/onia-vps.sh bash -lc 'cd /root/loops/onia-hermes && git fetch origin --quiet && git merge --ff-only origin/main && bash /root/loops/onia-hermes/scripts/integrar-onia-platform.sh claude/<rama>'

El nombre `nodo-casa` no se inventó acá: es con el que **ese nodo ya firma** los hechos que
escribe en la memoria compartida. ⚠️ El valor de la columna *dónde corre* sigue siendo `casa`
a propósito — `loops_registrados.mjs` compara contra esa cadena exacta; cambiarla rompe el gate.

> **Y sirve saber esto:** el 2026-09-06 se midió que **nodo-casa está despierto y su cron
> dispara** (sube logs al VPS cada 10 min, baja memoria cada 15, sincroniza a los :44, sin
> cortes desde el 2026-08-30). O sea que el arranque automático de WSL **no es el bloqueante
> para encender un loop hoy**: es el seguro para que sobreviva un reinicio. Lo único que separa
> a ese nodo de correr un loop es **descomentar su línea**, coordinado con el VPS y esta tabla.

🔴 **La columna «dónde corre» no es informativa: la lee un gate.** Cada máquina se compara
**sólo contra sus propias filas**, y para eso tiene que saber cuál es. Se resuelve preguntando
por **artefactos, nunca por hostname ni IP** — *una IP se mueve, un hostname se renombra*:

| máquina | cómo se reconoce |
|---|---|
| `VPS` | existe `/usr/local/lib/hermes-agent/venv/bin/python` (el CLI de Hermes) |
| cualquier otra | el archivo `/root/.onia-nodo` con su nombre, que deja `instalar-homelab.sh` |
| ninguna de las dos | **no se mide** — un gate que miente es peor que uno ausente |

> **Por qué existe esta tercera fila, con fecha:** hasta el 2026-09-05 el gate comparaba el
> `crontab` de *cualquier* máquina contra las filas `VPS`. En el nodo de casa eso reportaba los
> siete loops del VPS como *"faltan en el cron"* y dejaba **`main` en rojo para los quince
> carriles** — el integrador corre la cadena entera antes de tocar `main`, así que ninguno podía
> mergear. Y peor: el *Chequeo de arranque* pegado en los quince prompts dice *"si una fila no
> tiene su línea en `crontab -l`, volvé a ponerla"*, así que el primer loop que corriera allá
> **habría instalado los diez crons del VPS** apuntando a worktrees que no existen. Lo diagnosticó
> el propio loop `web-venta` (tarea `t_812bd90a`) y no lo tocó porque no era su carril.
>
> ✅ **Cerrado el mismo 2026-09-05.** Los quince prompts llevan un **paso 0** en su *Chequeo de
> arranque* que pregunta por la máquina ANTES de comparar, y su paso 3 rearma sólo las filas de
> *su* máquina. Ya no hay impedimento técnico para que `casa` tenga filas.
>
> **Pero hoy tiene CERO, y es una decisión, no una falta.** El 2026-09-05 Sergio Urcullo redujo el
> objetivo a *terminar `onia-platform` y cerrar cinco clientes con la v1.0*, y todo lo que no sirva
> a eso queda **congelado hasta nueva decisión**. Mudar loops de máquina no acerca ese objetivo:
> mueve dónde corre el mismo trabajo. La infraestructura del nodo quedó **terminada y probada**
> (ver `PLAN_HOMELAB.md`) y está lista para el día que se retome.
>
> ⚠️ **El paso 3 sólo AGREGA, nunca borra.** Eso fija el orden al mudar un loop: **esta tabla
> tiene que llegar a `main` ANTES de sacar su línea del cron viejo.** Al revés, el primer loop
> que corra en la máquina vieja ve *"fila mía sin línea en cron"* y **la vuelve a instalar** —
> y quedan las dos máquinas corriendo el mismo loop sobre la misma rama. Y como nunca borra, la
> línea vieja **no se va sola**: hay que sacarla a mano.
>
> 🔴 **Corregido 2026-09-05: «la tabla primero» NO alcanza, y sola deja `main` en rojo.**
> Ese orden se escribió mirando sólo el *Chequeo de arranque*, que efectivamente rearma. Pero
> desde el mismo 2026-09-05 `scripts/loops_registrados.mjs` compara **en las dos direcciones**
> (su propia salida lo dice: *«coinciden en id y horario, en las dos direcciones»*). Entonces:
>
> | si hacés… | pasa esto |
> |---|---|
> | tabla a `main` primero, cron después | la máquina vieja tiene una línea de cron que ya no está en su tabla → **gate en rojo** → el integrador corre la cadena entera antes de tocar `main`, así que **los quince carriles dejan de mergear** |
> | cron primero, tabla después | el *Chequeo de arranque* ve «fila mía sin línea» y **la rearma** |
>
> **Las dos cosas van JUNTAS**, en la misma ventana: se saca la línea del cron viejo y se
> pushea la tabla movida casi en el mismo minuto, eligiendo un hueco entre corridas. Con las
> dos aplicadas la máquina vieja queda sin fila y sin línea — las dos direcciones de acuerdo,
> **verde**. Nadie lo había pisado porque **no se mudó ningún loop desde que el gate es
> bidireccional**: las dos reglas nacieron el mismo día y nunca se cruzaron.
>
> El gate **no falla** donde no puede medir: si no reconoce la máquina (`/root/.onia-nodo` o el
> CLI de Hermes) o no hay `crontab -l`, sale sin error a propósito. Así que este choque sólo
> aparece en el VPS y en el nodo, no en Windows.

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

⚠️ **Corregido 2026-09-03 (21:2x La Paz) — cinco horarios de la tabla habían quedado viejos.**
`canario-visual`, `marca-personal`, `docs-auditoria`, `investigacion` y `supervisor` corrían con
una cadencia MÁS BAJA que la escrita: la sesión de control la bajó ese mismo día (junto con
`kpis-semanal`) y la tabla no se enteró. Se alinean **al cron**, por la regla de más abajo: cuando
el cron y la tabla difieren, gana el cron.

No es cosmético — `test:loops-registrados` estaba **en rojo**, y ese gate está en la cadena de
`npm test`, o sea que **ningún carril podía mergear**: el integrador corre la cadena entera antes
de tocar `main`. Una desalineación de documentación bloqueó a los quince. Lo encontró
`chatbot-cola` al correr sus propios gates, no una auditoría.

## Deben existir y estar activos

**Desde el 2026-09-01 el conjunto vive en DOS lugares**, y la columna *dónde corre* es la que
manda. Un loop se compara **sólo contra el registro de su propia máquina**:

- **`Windows`** → tarea programada de la app de Claude Code. Se lista con `list_scheduled_tasks`
  y se rearma con `create_scheduled_task` / `update_scheduled_task`.
- **`VPS`** → línea de `crontab` en `187.77.16.63`, apuntando a `/root/bin/onia-loop.sh <id>`.
  Se lista con `crontab -l`. Detalle de instalación y barandas:
  [`scripts/loops/README.md`](../../../scripts/loops/README.md).
- **`casa`** → línea de `crontab` dentro de WSL en la PC de casa, misma forma que el VPS. **El
  horario se muda TAL CUAL**: mudar no es cambiar la cadencia. La lista por defecto de
  `instalar-homelab.sh` es anterior a las bajadas de cadencia del 3 y 4 de septiembre y corre
  `web-venta` cada hora y `lucia` 8 veces al día — usarla al mudar multiplicaría el gasto por 2
  y por 4. **Manda la columna `cron (UTC)` de esta tabla, no el instalador.**

| id | dónde corre | cron | para qué sirve |
|---|---|---|---|
| `chatbot-cola` | **casa** | `13,43 * * * *` (UTC) | **Carril `plataforma-v1` desde el 2026-09-05** (el id no se renombró: cambiarlo tocaría cron, worktrees, logs y gate sin ganar nada). Dos colas en orden: `cola/chatbot.md` mientras le queden 🔴, después `cola/plataforma-v1.md`. **Es el único loop que escribe en el repo `onia-platform`** |
| `onia-cola` | **casa** | `33 * * * *` (UTC) | **MUERTO desde el 27-sep: no se rearma.** Era el integrador (mergeaba las ramas de carril a `main`); hoy `main` solo por PR con CI verde y revisión de Codex (`AGENTS.md` §4) |
| `web-venta` | **casa** | `48 */2 * * *` (UTC) | **Dueño de `onia.com.bo/` y `/empezar`** (rama `claude/web-venta`, zona `web-factory/apps/onia-platform/`): la puerta de entrada del producto |
| `recorrido-cliente` | **casa** | `9 * * * *` (UTC) | Recorre el camino del cliente de punta a punta (rama `claude/recorrido-cliente`) y dice **en qué paso exacto se rompe**, con la captura como prueba |

⚡ **Cadencia subida a cada hora el 2026-09-05 para `chatbot-cola` y `onia-cola`** (eran
`*/2`), por pedido de Sergio Urcullo y con el margen medido antes de tocar:

- **Duración real**, últimas 12 vueltas: mediana ~650 s los dos, máximo 1109 s. Tope 3000 s.
  Con cadencia horaria (3600 s) sigue habiendo **más de 40 min de colchón** sobre el peor caso,
  y el `flock -n` cubre el resto: una vuelta que se estire deja la siguiente `SALTEADA`, no
  pisada. Ya pasó 3 veces sin daño.
- **Cuota**: los golpes de `session limit` están **todos** entre el 2026-09-03 22:09 y el
  2026-09-04 05:33 — la ventana en que corrían 15 loops en el VPS **más** el nodo de casa en
  paralelo. **Cero desde entonces.** Pasar de ~44 a ~68 vueltas/día queda muy por debajo.
- **Por qué solo estos dos y no los cuatro:** son el cuello de la v1.0. `onia-cola` es el
  único camino a `main` (y por lo tanto al cliente) y `chatbot-cola` el único que escribe en
  `onia-platform`. `web-venta` y `recorrido-cliente` no entregan más por correr más seguido.

🔴 **Y el orden de este cambio no es libre.** `loops_registrados.mjs` compara **id Y
horario**, y hace `process.exit(1)`: con el cron en horario y la tabla en `*/2` el gate queda
rojo, la cadena de `npm test` falla y **ningún carril mergea** — incluido el integrador, que
es el único que podría arreglar la tabla. Es un candado sobre sí mismo. Por eso **la tabla va
primero a `main`, y el `crontab` recién después**, en un hueco entre corridas. Al revés ya se
revirtió sola una baja de cadencia el 2026-09-04 (5 loops, 23 vueltas/día de más).

⚠️ **2026-09-08 — la advertencia de acá arriba se cumplió, con el cambio bien hecho.** Sergio
Urcullo pidió subir las cadencias (`chatbot-cola` a `13,43`, `recorrido-cliente` a `9 * * * *`),
la sesión los midió y escribió las dos filas… **en una rama**, y tocó el `crontab` un minuto
después. Es exactamente el orden que este archivo prohíbe: la tabla de `main` quedó con la
cadencia vieja, `loops_registrados` en rojo, y con él **ningún carril podía mergear** — incluido
el integrador, que era el único que podía destrabarlo. Duró ~30 min. **No alcanza con hacer el
cambio completo: la tabla tiene que estar EN `main` antes de que el `crontab` se mueva.**

**Y hay un tercer lugar que ninguna de las dos sesiones tocó:** la cadencia vive también en el
heredoc `CATALOGO` de `scripts/loops/instalar-homelab.sh`, que es la **plantilla de la que nace el
`crontab`**. Alinear tabla y cron y dejarlo atrás significa que la próxima corrida del instalador
**revierte el cron y el rojo vuelve**, ahora con la tabla del lado equivocado — "arreglar la
instancia y no la plantilla" aplicado al registro de horarios. **Los tres se tocan juntos.**
Desde hoy `loops_registrados.mjs` mira las tres: si el catálogo reinstalaría una cadencia
distinta de la vigente, o no declara un loop que corre, sale rojo nombrando la fila.

⚠️ **Corregido 2026-09-03 21:10 UTC — cinco cadencias BAJADAS a propósito, y la tabla seguía con
las viejas.** `canario-visual`, `marca-personal`, `docs-auditoria`, `investigacion` y `supervisor`
corren hoy menos veces por día que lo que decía esta tabla. **No es un cron a medio registrar: es
una decisión de la sesión de control del 2026-09-03**, tomada después de medir que de 749 commits
en 7 días sólo el 7% tocaba producto y que el 46% de las vueltas no commiteaba nada porque estaban
esperando decisiones. Auditar más seguido no producía más: producía más auditoría.

**Por eso, si el gate vuelve a marcar diferencia en estas cinco, el que está mal es el que las
SUBA de nuevo.** La tabla se alineó al `crontab`, no al revés. Y esa diferencia tenía a `main` en
rojo: el gate `loops_registrados` compara cron contra esta tabla, así que una tabla vieja rompe
`npm test` para todos los carriles, no sólo para el que cambió el horario.

⚠️ **Y volvió a pasar el 2026-09-04, más grande: la misma causa, trece filas.** La sesión de
control **pausó ocho loops y cambió cinco horarios** ese día (foco: vender, cuota escasa) y esta
tabla no se enteró, así que `npm test` quedó en rojo y **ningún carril podía mergear** — el
integrador corre la cadena entera antes de tocar `main`. Cuatro de las cinco de arriba
(`canario-visual`, `marca-personal`, `docs-auditoria`, `investigacion`) hoy no están bajadas sino
**pausadas**, y viven en su propia sección de *NO rearmar*; `supervisor` sigue activo con otro
horario (`29 6,18`). Corregido alineando al cron, otra vez.

**La lección que ya no es opinión, porque va tres veces:** cambiar la cadencia de un loop **no
termina en el `crontab`**. Mientras esta tabla no se actualice en el MISMO acto, la decisión deja
`main` en rojo para los quince carriles y —si el loop quedó comentado en vez de borrado— la
auto-cura lo revive y la revierte sola. El cron y esta tabla son **un solo cambio**, no dos.

⚠️ **Corregido 2026-09-03 03:33 UTC — `contenido-cola` decía `Windows` y hacía tres días que
corría en el VPS.** Es la última fila que quedaba desalineada, y su desalineación **rompía el
gate `npm test` de `main`** (`loops_registrados`: *"corre en cron y NO está en la tabla"*). Se
alinea al cron —`11 */3`, no `31 */3`— por la regla de más abajo: cuando el cron y la tabla
difieren, gana el cron.

Y no era sólo la fila. **El loop llevaba días muriendo en cada corrida**: tenía cron activo,
worktree y log, pero `/root/bin/onia-loop.sh` lo rechazaba con `uso: …` y `exit 64` porque su
`case` sólo existía hand-editado en el VPS y `onia-loops-sync.sh` lo pisó con la versión de
`main`, que no lo tenía. Es **el peligro que este mismo archivo documentaba, cumplido**: el `case`
vivía en la rama de la sesión de control (`c43b04a24`) sin llegar a `main`, y el sync copia desde
`main`. Destrabado al mergear esa rama el 2026-09-03.

⚠️ **Y esto NO es un caso del "falla mudo antes de `avisar()`"** que se describe más abajo —
conviene no confundirlos, porque la primera versión de esta misma nota lo dio por hecho copiando
la explicación de al lado **sin medirla**. Verificado en el corredor que corre hoy: `tg()` se
define en la **línea 31** y el caso por defecto grita en la **202**, así que el fallo **sí manda
Telegram** en cada corrida. Lo que no deja rastro es el **log**: `tg()` redirige su salida a
`/dev/null`, de modo que en `/var/log/onia-loop-contenido-cola.log` sólo se ve el `uso: …` pelado.
El agujero de la línea 97/121 era el corredor **viejo**; citarlo acá habría sido diagnosticar por
memoria contra un archivo que ya cambió.

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

⚠️ **Acá decía que `contenido-cola` "se queda en Windows a propósito", y desde el 2026-09-02 es
falso: corre en el VPS.** Lo que sigue vigente es la mitad que importa — Sergio, 2026-09-01:
*"no toques el de contenido, el de contenido lo maneja su sesión"*. Esa frase protege la **rama**
`claude/carril-contenido`, no la máquina: el loop del VPS trabaja sobre
`claude/ads-creatividades-publicos` justamente para no pisarla. **Se mudó porque quedarse en
Windows era el modo de falla más silencioso que tenía el sistema**: moría al apagar la laptop, y
el bloque de auto-cura del VPS tenía *prohibido* rearmarlo por estar marcado `Windows`.

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

## Pausados el 2026-09-04 (foco: vender; cuota escasa) — NO rearmar

⚠️ **Cuatro de estos ya NO están en el VPS: se mudaron a `nodo-casa` el 2026-09-06** — loop y
worktree — y su línea salió de este `crontab`. Ver la sección *Mudados a `nodo-casa`* más abajo.
Para los que quedan: su línea **sigue en `crontab -l`, comentada**, con el motivo escrito al principio
(`# PAUSADO 2026-09-04 (foco: vender; cuota escasa) — …`). Descomentarla es revivirlos: es una
decisión de la sesión de control, no un cron a medio registrar.

⚠️ **Por eso salieron de la tabla de activos, y no es cosmético.** El *"Chequeo de arranque"* que
llevan pegado los quince prompts dice: *"para cada loop de esa tabla que diga `VPS` y no tenga su
línea en `crontab -l` (o la tenga comentada con `#`), volvé a ponerla"*. Mientras estas ocho
figuraran como activas, **el primer loop que arrancara las rearmaba** y la pausa se revertía sola
—exactamente el modo de falla que ya se midió el 2026-09-04— sin que nadie lo decidiera. La
auto-cura es correcta; lo que no puede es curar hacia una tabla que miente.

| id | cron que tenía | por qué se pausó |
|---|---|---|
| `canario-visual` | `41 6,18 * * *` | Foco en vender. Mide y audita; no produce venta. |
| `marca-personal` | `56 13,21 * * *` | Ídem — su pieza del día no mueve la aguja mientras la cola de Sergio esté llena. |
| `docs-auditoria` | `18 5,17 * * *` | Ídem — auditar más seguido producía más auditoría, no más producto. |
| `investigacion` | `26 9 * * *` | Ídem — cotiza decisiones; la cola de decisiones ya está por encima de lo que Sergio contesta. |
| `tendencias` | `51 11,23 * * *` | Ídem — recetas de contenido con un canal que hoy no publica. |
| `web-factory-dev` | `21 2,8,14,20 * * *` | Webs de cliente: no hay cliente esperando una web hoy. |
| `calidad-generado` | `5 3,9,15,21 * * *` | Juzga piezas; sin publicación en curso no tiene qué juzgar. |
| `contenido-cola` | `11 */3 * * *` | La aguja no se movió en 3 vueltas: el cuello es el canal y la cola de Sergio, no la cantidad de piezas. |

Tras esa pausa quedaron corriendo siete. El 2026-09-05 se congelaron tres más (sección
siguiente) y **quedan cuatro**.

### 🔴 `canario-visual`: la pausa pasa a ser una DECISIÓN — 2026-09-06

Hasta hoy figuraba acá como *pausado por cuota*, que es una pausa que se revierte sola el día
que sobre cuota. Se cerró: **queda congelado, y no se muda a `nodo-casa`.** Las tres cosas que
lo deciden estaban medidas y ninguna es la cuota:

1. **A `nodo-casa` NO va** (`PLAN_HOMELAB.md` §1, fila `canario-visual`). **Es un instrumento
   calibrado**: mide peso y milisegundos de las pantallas contra umbrales tomados desde el
   enlace del VPS — para eso nació, la fuente de iconos pesaba 3,9 MB y tardaba 117 s. Desde
   una casa, cada umbral pasa a medir el WiFi de Sergio Urcullo. Mudarlo no lo revive: lo
   convierte en un generador de alarmas falsas.
2. **En el VPS tampoco se revive hoy**, y no por cuota: **produce ítems de cola, no los cierra**
   (sección *"El sistema integraba y auditaba, y no construía nada"*). La cola de Sergio Urcullo
   tiene **83 tareas esperándole**. Un productor de ítems con la cola llena resta, no suma.
3. **Y arrancaría mintiendo.** Su worktree estaba **268 commits atrás de `main`** el 2026-09-03
   —el segundo peor de los once medidos—, y este archivo ya lo dice con su nombre: *«MIRA
   pantallas y las compara contra archivos del repo; 268 commits atrás puede reportar un
   defecto ya arreglado»*.

⚠️ **Lo que se pierde, dicho de frente: hoy NADIE mira una pantalla de cliente por horario.**
Verificado el 2026-09-06, no recordado: la línea del VPS está comentada desde el 04-sep, y la
tarea de Windows quedó `enabled:false` el 01-sep (último `lastRunAt` 2026-09-01T18:26Z). **Es
el único canario visual que existe, y no corre en ninguna de las tres máquinas.**

**Lo que sí queda cubierto, y lo que no.** `recorrido-cliente` (`9 1,4,7,…,22`) recorre el camino
del cliente de punta a punta y dice en qué paso se rompe, **con la captura como prueba** — así
que un cliente que no puede registrarse, agendar o pagar **sigue teniendo quién lo encuentre**.
Lo que nadie mide mientras tanto es lo otro que el canario medía: **peso y milisegundos** de las
pantallas. Una regresión de rendimiento hoy entra sin que nada la vea.

**Se revive cuando** vuelva a haber un carril que cierre los ítems que produce —o sea, después
de la v1.0—, y **el día que se revive va en el VPS, no en casa**, y con su worktree puesto al día
antes de la primera vuelta.

## Congelados el 2026-09-05 (objetivo: terminar `onia-platform` y cerrar 5 clientes con la v1.0) — NO rearmar

> Sergio Urcullo, 2026-09-05: *"quiero que te enfoques en solo los loops que nos lleven a terminar
> de desarrollar la Onia Platform… quiero que todo quede congelado de los otros, no los elimines,
> que quede congelado hasta decisión nueva"*.

**Congelado ≠ apagado ≠ borrado.** El prompt, la rama y el worktree **quedan intactos**; sólo se
comenta su línea de `crontab`, con el motivo al principio
(`# CONGELADO 2026-09-05 (foco v1.0) — …`). Se revive descomentando, sin reinstalar nada.

⚠️ **Salen de la tabla de activos, y por la misma razón de siempre:** el *Chequeo de arranque* de
los quince prompts **sólo agrega**, así que mientras figuren como activas, el primer loop que
arranque las rearma y el congelamiento se revierte solo. Por eso el orden no es negociable:
**esta tabla llega a `main` ANTES de tocar el `crontab`.**

| id | cron que tenía | por qué se congeló |
|---|---|---|
| `lucia` | `37 9,21 * * *` | Guiones, briefs y prompts de modelos/Higgsfield. No toca `onia-platform` ni acerca un cierre. |
| `supervisor` | `29 6,18 * * *` | Audita a los otros loops. Con cuatro carriles vivos y un objetivo estrecho, audita más de lo que hay que auditar. |
| `kpis-semanal` | `7 13 * * 1` | Tablero de KPIs del carril marca personal, que ya estaba pausado desde el 2026-09-04. Medía un carril congelado. |

**Los cuatro que quedan, y por qué cada uno sobrevive al recorte:**

| id | por qué se queda |
|---|---|
| `onia-cola` | **Muerto desde el 27-sep.** Era el integrador; hoy a `main` se llega por PR con CI verde y revisión de Codex (`AGENTS.md` §4). No se rearma. |
| `chatbot-cola` | **El único loop que escribe en el repo `onia-platform`** — 28 commits en 7 días, medidos. Su carril hoy es el add-on chatbot; ver el hueco de abajo. |
| `recorrido-cliente` | Recorre el camino del cliente de punta a punta y dice **en qué paso exacto se rompe**, con la captura como prueba. Es el instrumento que encuentra lo que frena un cierre. |
| `web-venta` | Dueño de `onia.com.bo/` y `/empezar`: la puerta por donde entra el lead. El 2026-09-04 encontró que los dos CTA de `/contacto` agendaban contra un Cal.com muerto — un lead que no puede agendar no se convierte en cliente. |

✅ **El hueco que este recorte dejó a la vista, y cómo se cerró el mismo día.** Ningún loop tenía
como carril terminar `onia-platform`: el único que escribe en ese repo es `chatbot-cola`, y su
carril era el **chatbot**, que por `CLAUDE.md` es un **add-on, no la oferta**. Sergio Urcullo
eligió **ampliar ese carril** en vez de abrir un quinto loop — así no se suma cuota: son las
mismas 36 vueltas/48 h apuntando a lo que importa.

Lo que se hizo, y lo que a propósito NO:

- se abrió `cola/plataforma-v1.md` con los seis ítems de `ONIA_CATALOGO_DE_VENTA.md` §8, que ya
  estaban escritos y **sin operar**, cada uno con su evidencia (gate `verificar_cola.js` en verde);
- el prompt pasa a tener **dos platos en orden**: el chatbot mientras le queden 🔴 —hoy dos, y los
  dos matan cierres— y después la v1.0;
- **el id NO se renombró.** `chatbot-cola` aparece en el cron, en `/root/bin/loops/<id>.md`, en los
  logs, en los worktrees y en este gate: renombrarlo es superficie grande para una ganancia
  cosmética. **Queda como deuda anotada**, no como olvido: el nombre dice menos de lo que el
  carril hace.

## Mudados a `nodo-casa` el 2026-09-06 — el loop Y su worktree

> Sergio Urcullo, 2026-09-06: *"pero habíamos quedado que los loops iban a funcionar en la pc de
> casa para que no se ahogue el vps"*. Tenía razón, y la medición corrigió **qué** se estaba
> ahogando.

🔴 **El VPS no se ahogaba por CPU: se ahogaba por DISCO.** Medido ese día, no recordado:
`load 2.17` sobre 4 núcleos con **80,9% idle** y 10 GB de RAM libres — CPU y memoria sobraban.
El disco estaba al **89%**, con 22 GB libres, y `/root/loops` pesaba **56 GB** contra los 27 de
`/var/lib/docker`, que sí es producción. Con Docker en el mismo disco, llenarlo tumba
`onia.com.bo`, `app.onia.com.bo`, la base y n8n **juntos**.

🔴 **Y mudar un loop NO libera disco. Eso se midió con un caso, no se dedujo:** `web-venta` se
mudó a `nodo-casa` esa misma mañana y **sus 3,1 GB siguieron en el VPS**. Mudar mueve dónde
corre el trabajo; el árbol se queda donde estaba. **La mudanza no está hecha hasta que el
worktree también se va.**

| worktree sacado | rama | pesaba |
|---|---|---|
| `onia-hermes-lucia` | `claude/lucia-vps` | 5,7 GB |
| `onia-hermes-marca-personal` | `claude/marca-personal-loop` | 5,7 GB |
| `onia-hermes-webfactory` | `claude/web-factory-dev` | 3,1 GB |
| `onia-hermes-web-venta` | `claude/web-venta` | 3,1 GB |

Y `onia-hermes-canario` **no se sacó** —`canario-visual` se queda en el VPS por diseño, es un
instrumento calibrado— pero se **achicó** con `sparse-checkout`: 5.595 MB → 1.683 MB. El árbol
sigue ahí, sin los 3,9 GB de `hermes-content/references` que un carril congelado no lee.
⚠️ **Se rehidrata al revivirlo**, y hay que hacerlo o corre sin sus referencias y falla mudo:
`git -C /root/loops/onia-hermes-canario sparse-checkout disable`.

**Resultado, medido antes y después: 89% → 79% de uso, de 22 a 41 GB libres.** `/root/loops`
pasó de 56 GB a 36 GB.

🔴 **El chequeo que evitó el daño, y que no es opcional.** Antes de sacar nada se preguntó por
cada árbol: ¿está limpio, y tiene commits sin pushear? **`lucia-contenido` (10 GB) tenía DOS
commits sin pushear** — parecía peso muerto y tenía trabajo adentro. No se tocó, y siguen ahí
esperando a que alguien los suba. Los cuatro que sí se sacaron estaban limpios y con cero.

**Se rehacen con un comando**, y el registro con rama y sha quedó en el VPS
(`/root/worktrees-mudados-a-casa-2026-09-06.txt`):
`git -C /root/loops/onia-hermes worktree add <ruta> <rama>`.

**Sus líneas comentadas se sacaron del `crontab` del VPS**, reemplazadas por una nota. Su cron
vive en `nodo-casa`, comentado hasta que se los reviva.

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

✅ **Y cazó una divergencia a los tres minutos de existir.** Recién commiteado, la medición marcó
`supervisor: cron=[29 */2 * * *] doc=[29 2,8,14,20 * * *]`: el `mtime` del crontab era de **26
segundos antes** — el propio loop `supervisor`, corriendo en paralelo, se había subido la
frecuencia de 4 a 12 vueltas por día mientras esta vuelta escribía la tabla. A ojo eso se
descubría dentro de días, o nunca. **Cuando el cron y la tabla difieren, gana el cron**: es lo que
efectivamente corre y gasta; la tabla se alinea a él.

⚠️ **No listes el cron con `head`.** Ese mismo día el integrador arrancó con
`crontab -l | head -50`, la lista tenía 68 líneas, y concluyó que `lucia` y `kpis-semanal` no
estaban registrados: estaban, en las líneas 60 y 62. "Rearmar" una línea que ya existe la
**duplica**, y dos corridas simultáneas del mismo loop comparten worktree y rama. Siempre
`crontab -l | grep onia-loop.sh`, o directamente el comando de arriba.

**Lo que esto NO puede curar** —y cómo se nota y se rearma a mano— está en el
[`README.md`](README.md), sección *"3. El registro del horario se pierde"*. En una línea: si se
pierden **todos** a la vez, o la máquina está apagada, no queda nadie adentro para notarlo.

### 🔴 El cron está sano y el loop igual trabaja sobre un repo viejo

**El corredor nunca sincroniza el worktree del carril con `main`.** El `case` fija carpeta, rama
y tope, hace `checkout` de la rama y arranca — no hay `fetch` ni `merge` de `origin/main` en
ninguna parte (`grep -nE 'rebase|merge|pull|origin/main' /root/bin/onia-loop.sh`: ni una línea
que lo haga). El sync del minuto 44 **despliega los prompts y el corredor desde `main`, no los
worktrees**: actualiza lo que el loop ejecuta, nunca los archivos que el loop lee y edita.

Medido el 2026-09-03 05:30 UTC, `git rev-list --count HEAD..origin/main` en cada árbol:

| carril | atrás de `main` |
|---|---|
| `contenido-cola` | **788** |
| `canario-visual` | 268 |
| `web-venta` | 235 |
| `lucia` | 233 |
| `calidad-generado` · `tendencias` | 126 |
| `web-factory-dev` | 124 |
| `marca-personal` | 93 |
| `recorrido-cliente` | 92 |
| `chatbot-cola` | 78 |
| `supervisor` | 72 |
| `investigacion` | 49 |

**No es deuda cosmética: fabrica hallazgos falsos y puede revertir arreglos ajenos.** Esta misma
vuelta, `docs-auditoria` estaba 113 commits atrás y la tarea `t_77b6c270` del tablero le pedía
arreglar la fila de `contenido-cola` de este archivo. En su checkout la fila decía `Windows` y
`npm run loops:registrados` salía **rojo** — pero en `main` el integrador ya la había corregido a
las 03:33, y contra `origin/main` el gate estaba **verde**. Un paso más y habría reescrito la
línea 81 sobre una base de 113 commits: en el mejor caso conflicto, en el peor **el merge
devuelve la fila mentirosa** y deshace el arreglo del integrador.

El daño escala con el atraso y con lo que el carril toca: `canario-visual` MIRA pantallas y las
compara contra archivos del repo —268 commits atrás puede reportar un defecto ya arreglado—, y
`web-venta` es dueño de `onia.com.bo/` con 235 de atraso.

**Es el generador estructural de ítems fantasma**, y encaja con el 25–46 % de pendientes que las
colas declaraban y no existían: no todos eran items mal escritos, algunos ya estaban hechos en
`main` y el carril no podía verlo.

**Mientras el corredor no lo haga, cada loop se sincroniza solo al arrancar**, antes de medir
nada:

```
git -C <su-worktree> fetch origin --quiet && git -C <su-worktree> merge --ff-only origin/main
```

`--ff-only` es la parte importante: si el carril tiene trabajo propio sin mergear, **falla sin
tocar nada** en vez de inventar un merge. Ya está en el prompt de `docs-auditoria`; arreglarlo de
raíz en el corredor toca los 15 loops a la vez, así que está cotizado en el radar y espera a
Sergio.

⚠️ **Acá decía que hay "un agujero por diseño: ningún lado vigila al otro", con `contenido-cola`
como el vigía del lado Windows. Desde el 2026-09-02 ya no hay dos lados: se mudó al VPS y
Windows quedó en CERO loops.** El agujero de "ningún lado vigila al otro" desapareció con el
segundo lado; el que queda es el de siempre, y es peor porque ahora **todo** cuelga de él: si se
cae el crontab del VPS, no queda nadie afuera para notarlo.

⚠️ **Acá decía que "todo fallo sale por Telegram" del lado del VPS. Es falso, y su excepción es
exactamente la que dejó muerto a `investigacion` seis horas.** El corredor define `avisar()` en la
línea 121; el `exit 64` del nombre no reconocido está en la 97. **Todo lo que falla antes de la
línea 121 falla mudo** — medido el 2026-09-02 corriendo
`/root/bin/onia-loop.sh nombre-que-no-existe`: imprime el uso, sale 64, no manda nada. Lo que sí
avisa es lo que falla *después* de esa línea, como mucho uno cada 6 h por loop.

⚠️ **Desde el 2026-09-02 no hay desbalance: hay UN solo lado.** Los 15 loops corren en el VPS y
Windows quedó vacío. Eso **borra** el riesgo que decía acá (que la auto-cura de Windows colgara de
un único loop irreemplazable) y a cambio concentra todo en el crontab del VPS: la redundancia del
bloque de arranque —pegado idéntico en cada prompt— pasa a ser la **única** red que queda. Por eso
no se optimiza sacándolo de los demás.

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
| `onia-vigia-ci.sh` | `*/10 * * * *` | avisa cuando un workflow de GitHub Actions pasa a rojo en `master` de `onia-platform`, y cuando se recupera. **Uno por episodio, no uno por vuelta.** Fuente: [`vigia-ci.sh`](../../../scripts/loops/vigia-ci.sh), probado por [`vigia-ci.test.sh`](../../../scripts/loops/vigia-ci.test.sh) (13 casos) |

🔴 **El token del vigía de CI: dónde está y por qué es propio.** Vive en
`/root/.config/onia/github-token` (root, `600`, fuera del repo y fuera de git). Es un
**fine-grained PAT con `Actions: Read-only`** sobre `onia-platform`, que es privado.

- **El `GITHUB_TOKEN` que ya está en el contenedor de n8n NO sirve**, y se probó: lee el repo
  (200) pero devuelve **403 `Resource not accessible by personal access token`** en
  `actions/runs`, en `check-runs` y en `status` — las tres puertas.
- **Tampoco se copió el token de `gh` de la laptop.** `PLAN_HOMELAB.md` §5: una llave privada
  que viaja entre máquinas deja de ser de una máquina, y revocarla te deja afuera a vos también.
- ⚠️ **Trampa al instalarlo, pagada el 2026-09-06:** el comando usaba `read -s`, que **no muestra
  nada al pegar**. Pareció que no había funcionado y el token quedó pegado **tres veces seguidas**
  (279 bytes = 93 × 3), y la API contestó `Bad credentials`. Se detectó mirando la FORMA del
  archivo (largo, saltos de línea, clases de caracteres) sin imprimir el valor. Un pedido de
  credencial que no devuelve feedback se pega dos veces.
- Si se pierde el VPS, se pierde con él: **no está versionado en ningún lado**, igual que
  `loops-remotos.txt`.

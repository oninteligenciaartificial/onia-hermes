# Handoff — nodo de desarrollo (PC de casa de Sergio)

> Rama: `claude/onia-dev-node-setup-22a170` · Máquina: `DESKTOP-0GGGNMF`
> Sesión del 2026-09-04, tarde/noche (La Paz).

---

## Objetivo

Dejar la PC de casa de Sergio funcionando como **tercer nodo** del sistema: correr 5
loops de carril que hoy corren en el VPS, para liberar disco allá (estaba al 85 %, hoy
78,5 %) y aprovechar una máquina que es más grande que el servidor de producción
(12 hilos / 16 GB / 955 GB libres contra 4 núcleos / 15 GB / 54 GB).

**Definición de "hecho":** los 5 loops instalados, con `cron` propio, prueba de humo
verde, y **una vuelta verificada mirando el log** — no un `crontab` escrito.

**Estado: cumplido a medias.** El nodo está instalado, verde y corriendo. Le falta lo
que lo mantiene vivo sin nadie (ver *Qué quedó a medias*).

---

## Qué quedó EN PRODUCCIÓN

**En la PC de casa** (`DESKTOP-0GGGNMF`, WSL2 + Ubuntu 26.04 LTS, systemd encendido):

| Pieza | Estado verificado |
|---|---|
| WSL2 con `systemd` en el PID 1 | ✅ `ps -p 1 -o comm=` → `systemd` |
| RAM asignada a Linux | 10 GB (de 16; `.wslconfig` con `memory=11GB`) |
| Node 22.22.1 + Claude Code 2.1.261 | ✅ instalados y logueados para **root** y para el usuario |
| Llave SSH propia al VPS | ✅ `homelab-onia-vps`, autorizada en el VPS, probada |
| Llave SSH propia a GitHub | ✅ `homelab-onia-github`, `ssh -T` responde |
| Clon `onia-hermes` | `/root/loops/onia-hermes` en `main` (9,8 GB) |
| 5 worktrees | webfactory · web-venta · tendencias · lucia · marca-personal |
| Hook `pre-push` | ✅ `main` bloqueado mecánicamente en este nodo |
| 4 shims al VPS | tablero · aprender · consolidar-memoria · telegram |
| `MEMORY.md` + `USER.md` | ✅ bajados (100 KB), se refrescan cada 15 min |
| `crontab` de root | 5 loops + subida de logs (10 min) + memoria (15 min) + sync (44) |
| Prueba de humo | ✅ **12 de 12 en verde** |

**Verificado en vivo, no supuesto — dos vueltas COMPLETAS, no un arranque:**

```
22:52:01Z  web-venta ARRANCA (disparado SOLO por cron, su horario exacto 52 * * * *)
22:53:48Z  web-factory-dev ARRANCA (a mano)
23:05:26Z  TERMINA web-factory-dev — 698s — exit 0 — 1 commit — subido
23:08:36Z  TERMINA web-venta      — 995s — exit 0 — 39 commits — subido
```

Los dos inyectaron los 157 hechos de `MEMORY.md`, trabajaron, commitearon y
pushearon a su rama. `git rev-list origin/<rama>..HEAD` → **0 en ambos**: nada quedó
sin subir.

**Circuito de memoria verificado de punta a punta:** un hecho escrito desde este
nodo aterriza en la bandeja del VPS **firmado `nodo-casa`**, y la bandeja local
queda en 0. También llegan los que escriben los loops (`…-tendencias-…`).

### Y después: 3 horas de operación autónoma, con cron solo

```
23:52  web-venta        (cron)   ·  00:52  web-venta  ·  01:52  web-venta
00:24  web-factory-dev  (cron)   →  TERMINA 00:40:50 — 1009s — exit 0 — 2 commits
01:40  lucia            (cron)   →  TERMINA 01:44:44 —  283s — exit 0 — 1 commit
```

**Cuatro loops distintos han corrido solos.** Los logs suben al VPS cada 10 min
(verificado por marca de tiempo allá) y `sincronizar.sh` corre a los :44
conservando los shims.

**Producto clonado** en `/root/loops/onia-platform` (56 MB, rama `master`), con el
**push roto** y verificado fallando. Los tres comandos que los loops usan para leer
precios (`web-venta:16`, `chatbot-cola:17`, `marca-personal:178`) devuelven datos.

**Disco:** 45 GB usados de 1007 (5 %). `/root/loops` = 41 GB.

**En el repo:** siete commits en la rama del carril (ver *Archivos*). **Todavía no
mergeados a `main`.**

**En el VPS: NADA se cambió**, salvo agregar una línea a `/root/.ssh/authorized_keys`
(la llave nueva de esta PC), con respaldo previo en `authorized_keys.bak`.

---

## Qué quedó a medias, y dónde

### 🔴 1. WSL no arranca solo ni se mantiene despierto — **es el bloqueante**

`systemd` está encendido, pero **WSL sólo vive mientras la sesión de Windows está
abierta**, y se suspende sola por inactividad. Sin resolver esto:

> El `crontab` queda perfecto y los loops no corren nunca.
> Es literalmente *"un loop puede morir con su cron INTACTO"* (`scripts/loops/README.md`).

Faltan las dos piezas que el plan pide en `PLAN_HOMELAB.md:223`:
- una tarea del Programador de Windows que ejecute `wsl -d Ubuntu` al arrancar;
- desactivar la suspensión por inactividad.

**No se aplicaron a propósito:** son configuración persistente de la máquina de Sergio
y él pidió hacerlas viéndolas.

### ✅ 2. `onia-platform` — RESUELTO el mismo día

> Clonado en `/root/loops/onia-platform` (56 MB con `--filter=blob:none`, contra
> 1,6 GB del clon completo del VPS), rama **`master`** — no `main`. El **push está
> roto** (`remote set-url --push … DESHABILITADO-NODO-DE-DESARROLLO`) y verificado
> fallando: un prompt es una instrucción, una URL rota es un hecho.
>
> Y se agregó al instalador (`bb0854f4`) con dos controles de humo, para que una
> instalación futura no lo omita. **El nombre del repo se verificó**, no se asumió:
> `git@github.com:oninteligenciaartificial/onia-platform.git`, accesible con la llave
> del homelab. (El VPS lo alcanza por un alias `gh-platform` con una *deploy key*
> propia — acá no hace falta.)
>
> Lo que sigue abajo es la descripción del problema, que se conserva porque explica
> **por qué** hacía falta.

4 de los 5 loops asignados **leen precios** de
`/root/loops/onia-platform/lib/subscription-plans.ts` (`web-venta:16`,
`tendencias:379`, `web-factory-dev:290`, `marca-personal:178` usa su `layout.tsx`).
**El instalador no lo clona** (`grep -c onia-platform instalar-homelab.sh` → 0).

Riesgo real: un loop que no puede leer la fuente única **no se calla — escribe el precio
igual**, sacado de un doc viejo. Falla pareciendo que funcionó.

Pendiente porque falta confirmar el nombre del repo. Cuando se clone, dejarlo en **sólo
lectura**:

```bash
git clone --filter=blob:none git@github.com:oninteligenciaartificial/onia-platform.git /root/loops/onia-platform
git -C /root/loops/onia-platform remote set-url --push origin DESHABILITADO-NODO-DE-DESARROLLO
```

### 🟡 3. Los loops del VPS **siguen encendidos**

Paso 10 del plan, y va **después** de ver este nodo funcionando varias vueltas. Hasta
entonces los 5 carriles corren en las dos máquinas: trabajo duplicado y **cuota de
Claude compartida** (los horarios están desfasados a propósito, pero no dejan de sumar).
**Lo coordina la sesión de control**, no este carril.

### 🟢 4. Tailscale y BIOS

Pasos 3 y 4 del plan. No bloquean (el nodo sale por SSH a la IP pública). Tailscale es
lo que después permite cerrar el puerto 22 del VPS. La BIOS (*Restore on AC Power Loss →
Power On*) es lo que hace que la PC vuelva sola tras un corte de luz.

---

## Archivos y cambios

| Commit | Qué arregla |
|---|---|
| `8f401fda` | `sincronizar.sh` — `$RAMA` sin asignar mataba el camino de rescate; `git archive` metía 5,4 GB en `/tmp` cada vuelta |
| `f8a03858` | `instalar-homelab.sh` — inyección de comandos en los 4 shims; el nombre del worktree se inventaba en vez de leerse del corredor |
| `4524946d` | Este handoff, `homelab-wsl-arranque.ps1` y la serie de TikTok |
| `f95a1770` | **`sincronizar.sh` pisaba los shims cada hora** — el nodo aprendía hacia un pozo, y quedaba un segundo escritor de `MEMORY.md`; y el shim no reenviaba `ONIA_LOOP_ID`, así que todo hecho se firmaba `desconocido` |
| `bf71c58e` | Handoff con las dos vueltas completas |
| `bb0854f4` | El instalador **clona el producto** en sólo lectura (4 de 5 loops leen precios de ahí); y **`--prueba` ya puede salir verde** |
| `066d4b88` | `PLAN_HOMELAB.md` se contradecía a sí mismo sobre WSL y mandaba a formatear |
| `4f89b191` | 🔴 **Los horarios estaban corridos 4 horas** — ver abajo |

### 🔴 El sexto bug: cuatro horas de corrimiento, y nada lo avisaba

WSL heredó `America/Caracas` (−04) de Windows. El VPS corre en `Etc/UTC`. **`cron`
interpreta los horarios en hora local**, y el de Ubuntu **no soporta `CRON_TZ`**
(verificado: 0 apariciones de esa cadena en `/usr/sbin/cron`, con `crontab` como
control). Todas las líneas del catálogo con hora fija disparaban 4 horas tarde.

**Cómo se encontró, que es lo que vale.** `tendencias` simplemente **no apareció** a
su hora. Sin error, sin log, sin aviso: *un loop que no arranca no genera ninguna
señal*, así que la única pista fue notar la **ausencia de un archivo**.

El diagnóstico salió de usar un loop **horario como testigo**: `web-venta` corrió
22:52, 23:52, 00:52 y 01:52 **sin fallar una** — lo que descarta cron muerto y
máquina dormida de una sola pasada, y deja la zona como única explicación. Se
descartó también el `flock`: el candado es **por loop**
(`/run/onia-loop-$NOMBRE.lock`), así que dos carriles a 2 minutos no se bloquean.

**Rompía dos cosas de diseño a la vez:** el desfase deliberado contra el VPS para no
pisarse la cuota de Claude (que es por cuenta, no por máquina), y los colchones que
algunos carriles calculan a mano — `marca-personal` dice *"corre 21:00 UTC así el
drop de las 19:00 está listo con 2 h de colchón"*, y corrido 4 h **prepararía el
drop después de necesitarse**.

Arreglado en el nodo (`timedatectl set-timezone UTC` + reinicio de cron, VPS y PC
dan la misma hora al minuto) y blindado en el instalador, que ahora compara
`date +%z` de las dos máquinas y **muere con el comando exacto** si difieren.

### ⚠️ El quinto bug merece leerse: era el más silencioso de todos

El instalador dejaba los 4 shims en `/root/bin` (paso 4) y `sincronizar.sh` los
**pisaba** con los scripts reales (paso 5) — y no sólo al instalar: ese script corre
por cron **cada hora** (`44 * * * *`), así que reordenar los pasos no alcanzaba.

Se descubrió por accidente, al anotar los hechos aprendidos de esta sesión: decían
`anotado en la bandeja` y la bandeja del VPS estaba vacía. **Los 5 hechos, más 2 que
el loop `web-factory-dev` ya había dejado mientras corría, estaban en la bandeja
LOCAL** — y un consolidador local los había fundido en un `MEMORY.md` de la PC que
la bajada de memoria pisa cada 15 minutos. Aprender hacia un pozo, sin una sola
señal de error.

Peor: `onia-consolidar-memoria.sh` local convertía este nodo en un **segundo escritor
de `MEMORY.md`**, que el diseño prohíbe *por construcción* y no por disciplina.

`onia-tablero.sh` también se pisaba y **tapaba el problema**: el tablero real detecta
que no hay CLI de Hermes local y sale por SSH solo, así que pasaba la prueba de humo
como si todo estuviera bien.

Los 7 hechos huérfanos se rescataron a la bandeja del VPS **tal cual** (el archivo
trae quién y cuándo; reenviarlos por `aprender.sh` les habría puesto la fecha de hoy
y el autor equivocado). Quedan archivados en `/root/.hermes/memories/rescatados/`.

**Los dos archivos están parcheados a mano en el clon de la PC** (`/root/loops/onia-hermes`),
con los originales guardados en `/root/sincronizar.sh.origen-main` y
`/root/instalar-homelab.sh.origen-main`. **Eso se limpia solo en cuanto los commits
lleguen a `main`** y el `sincronizar.sh` de las :44 los traiga.

⚠️ **Hasta que se mergeen, el clon tiene dos archivos modificados**, y el
`merge --ff-only origin/main` de las :44 va a avisar que no puede avanzar. Es esperable
y no rompe nada.

---

## Intentos fallidos

**El campo que más vale. Todo esto ya se probó y NO funcionó.**

1. **`wsl --install` a secas → `Prohibido (403)`.** La Microsoft Store rechazaba la
   descarga. No se llegó a probar `--web-download`: WSL apareció instalado por otra vía
   antes de agotar esa rama.

2. **Diagnosticar desde Windows con `wsl.exe -u root -- bash -lc '...'` rompe todo
   `git`**, con el error `not a git repository: /mnt/c/.../C:/dev/...` — una ruta
   Linux pegada a una de Windows. **Se perdieron tres diagnósticos así**, y el
   diagnóstico *del diagnóstico* también estuvo mal un rato:

   ⚠️ **Primero lo atribuí a que WSL hereda `GIT_DIR` del worktree. Es sólo la mitad,
   y no la importante.** La causa real es el **directorio de trabajo**: el script
   arranca dentro del worktree de Windows montado en `/mnt/c/…`, que tiene un archivo
   `.git` con `gitdir: C:/…` — una ruta que Linux no resuelve. Por eso `git -C /ruta`
   funcionaba (lleva su propio directorio) y `git ls-remote` a secas no.

   **La receta que sí funciona, y hay que usarla siempre:** `cd /root` **y**
   `unset GIT_DIR GIT_WORK_TREE GIT_INDEX_FILE GIT_COMMON_DIR GIT_PREFIX` al inicio
   de cada script.

3. **Comandos en línea a través de cuatro shells (Bash → wsl → bash → ssh) se rompen.**
   El `$(...)` desaparece y las comillas se comen entre sí. Dio dos falsos negativos
   (`mktemp` "fallando" cuando funcionaba). **Único método fiable: escribir un archivo
   `.sh`, copiarlo, `sed -i 's/\r$//'` y ejecutarlo.**

4. **Primera hipótesis sobre `sincronizar.sh`: "`git archive` no anda en un clon sin
   blobs". FALSA.** `git archive` sale con `exit=0`. La causa real era `/tmp`: en WSL es
   un `tmpfs` **de 5,4 GB en RAM** y el árbol del repo pesa **exactamente 5,4 GB**.

5. **Arreglo descartado: archivar sólo `scripts/loops`.** Habría roto el deploy de la
   landing y de la plataforma, porque `sincronizar.sh` también copia de
   `$RAIZ/scripts/kanban`, `$RAIZ/scripts/postiz_schedule.mjs` y
   `$RAIZ/hermes-content/deploy`. Se pilló leyendo los `poner` antes de commitear.

6. **`Connection closed by 187.77.16.63` en el primer SSH desde la PC.** Era **Proton
   VPN** encendido: IP compartida (`146.70.202.83`). Apagada la VPN, entra siempre.

7. **Speaches (transcripción) está MUERTO en el VPS.** Puerto 3108 sin nadie
   escuchando, contenedor inexistente. Se transcribió con **Groq Whisper** usando la
   `GROQ_API_KEY` que ya vive en `/root/.hermes/.env`, ejecutando el `curl` **desde el
   VPS** para no mover la credencial.

8. **`--prueba` del instalador NUNCA podía salir verde.** Saltaba los pasos 4 y 5 y
   después verificaba los archivos que esos pasos crean: siempre reportaba 8 en rojo
   y el cartel *"NO dejar los loops corriendo asi"*. Asusta, es mentira en ese modo, y
   entrena a ignorar el único cartel rojo que importa. **Arreglado en `bb0854f4`.**

9. **Hipótesis descartadas sobre por qué `tendencias` no disparó** (antes de dar con
   la zona horaria). Sirven para no repetir el camino:
   - *"WSL se suspendió"* → **falso**: `uptime` daba 6 h sin cortes, y `web-venta`
     corrió las cuatro horas seguidas sin faltar una.
   - *"El `flock` lo bloqueó porque `web-venta` arrancó 2 minutos antes con tope de
     50 min"* → **falso**: el candado es **por loop**, `/run/onia-loop-$NOMBRE.lock`.
   - *"Falta el `case` en el corredor, o el prompt, o el worktree"* → **falso**: los
     tres estaban, y correrlo a mano arrancó perfecto con 175 hechos de memoria.

   Lo que lo resolvió fue **usar un loop horario como testigo**: si el que corre cada
   hora nunca falla y el que corre a hora fija nunca aparece, el problema no es cron
   ni la máquina — es cómo se interpreta la hora.

---

## Qué depende de Sergio

1. **Aplicar el arranque automático de WSL** (bloqueante, ver arriba). Se hace juntos.
   *Es lo único que separa este nodo de estar terminado.*
2. ~~Confirmar el nombre del repo del producto~~ → **hecho**: se verificó en vez de
   preguntarlo, y quedó clonado.
3. **Mergear los siete commits a `main`.** Tocan `sincronizar.sh`, que corre en el VPS
   para los 15 loops — conviene que lo revise la sesión de control. **El VPS gana ahí
   el arreglo de los 5,4 GB por hora en `/tmp`.**
4. **Decidir cuándo sacar los 5 loops del `crontab` del VPS** (paso 10, con el vigía
   confirmando que ve esta PC).
5. **Tailscale y BIOS**, cuando quiera.
6. Ruido: se le mandaron **~8 mensajes de prueba a Telegram** verificando el arreglo de
   citado de los shims.

---

## Hallazgos sobre el VPS — **no son de este carril, van a la sesión de control**

Vistos de paso; **no se tocó nada allá**.

| Hallazgo | Evidencia |
|---|---|
| **Speaches caído** | Puerto 3108 sin nadie escuchando, sin contenedor. La transcripción "gratis de uso diario" no existe hoy |
| **Túnel SSH huérfano** | `sshd[1147999]` reintenta `connect_to 127.0.0.1 port 3108` **cada 15 s**, indefinidamente. Ensucia `auth.log` y consume recursos |
| **721 procesos zombi** | Algo los genera en serie. 1100 procesos totales |
| **Swap al 72 %** | Servidor ahogado. Probable causa del SSH lento |
| **SSH ida y vuelta: 1,8 s** | El propio instalador avisa que **>1,5 s** hace lento cada tablero y cada `aprender` |
| **`sincronizar.sh` escribía 5,4 GB en `/tmp` cada hora** | En un disco al 78,5 %. Arreglado en `8f401fda` — **el VPS lo gana al mergear** |
| **`hermes worktree` existe y quizá nadie lo corrió** | Comando dedicado a *"auditar y reclamar worktrees acumulados"*. El plan calcula ~40 GB recuperables |
| **0 servidores MCP configurados** | `hermes mcp list` → ninguno |

**Errores de `PLAN_HOMELAB.md`, para corregir en el doc:**
- Dice que el clon sin blobs baja **~1 GB**. Real: **9,8 GB**.
- Dice **Ubuntu 24.04**; WSL instaló **26.04 LTS** (no molesta).
- Dice instalar **Node 20 desde NodeSource**; el instalador exige `>= 20` y Ubuntu trae
  **Node 22** firmado. Ganamos un repositorio externo menos.
- **Se contradice a sí mismo sobre WSL2**: la línea 28 lo propone como camino y la 205
  dice *"Linux nativo, no Windows, no WSL2"*. Las dos secciones están vivas en el mismo
  archivo.

---

## Próximos pasos, en orden

1. **Arranque automático de WSL + sin suspensión.**
   *Listo cuando:* se reinicia Windows, nadie abre Ubuntu, y `crontab` dispara igual.
2. ~~Mirar el log de la primera vuelta completa~~ → **hecho**: cuatro loops han corrido
   solos, todos `exit 0` con commits subidos.
3. ~~Clonar `onia-platform`~~ → **hecho**, con el push roto y verificado.
4. **Mergear los siete commits a `main`.**
   *Listo cuando:* el `sincronizar.sh` de las :44 corre limpio y el clon queda sin
   modificaciones locales (hoy tiene 2 archivos parcheados a mano, que se resuelven
   solos en cuanto `main` tenga los arreglos).
5. **Dejar correr 24 h y comparar** las vueltas de esta PC contra las del VPS.
   *Listo cuando:* el vigía de loops remotos ve los logs subidos cada 10 min.
6. **Recién ahí: sacar los 5 loops del `crontab` del VPS.** Lo coordina la sesión de
   control.
7. Tailscale · BIOS · corregir `PLAN_HOMELAB.md` · arreglar el `--prueba` que nunca
   puede salir verde.

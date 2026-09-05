# Handoff — carril `onia-dev-node-setup` (nodo de casa → foco v1.0)

**Última actualización:** 2026-09-05 ~18:50 UTC · rama `claude/onia-dev-node-setup-22a170`
· worktree `C:\dev\Proyectos\Hermes\.claude\worktrees\onia-dev-node-setup-22a170`

---

## 1. Objetivo

**Cambió a mitad de sesión, y eso explica todo lo demás.**

- **Arrancó como:** convertir la PC de casa (`DESKTOP-0GGGNMF`) en el tercer nodo de Onia y
  **mudar loops** del VPS a esa máquina.
- **Terminó como:** Sergio Urcullo, 2026-09-05: *"quiero que te enfoques en solo los loops que nos
  lleven a terminar de desarrollar la Onia Platform… congelado hasta decisión nueva… cerrar cinco
  clientes con la versión 1.0"*.

La mudanza se **frenó a propósito** cuando cambió el objetivo. Mudar loops de máquina no acerca un
cierre: mueve dónde corre el mismo trabajo.

---

## 2. Qué quedó EN PRODUCCIÓN (vivo ahora)

Medido el 2026-09-05 ~18:50 UTC, no de memoria:

| | estado real |
|---|---|
| Loops activos en el **VPS** | **4** — `onia-cola`, `chatbot-cola`, `web-venta`, `recorrido-cliente`. Los otros tres quedaron **congelados** (comentados, no borrados). ⚠️ `lucia` siguió medio viva hasta las 20:05 por un cron propio, `lucia-cierre.sh` — ver §3 |
| Loops activos en **casa** | **0** — los 5 instalados están comentados en su `crontab` |
| Mantenimiento activo en casa | **3** (rsync de logs, memoria, sincronización horaria) |
| Repo del nodo de casa | **al día con `origin/main`**, 0 commits detrás |
| Sincronización horaria de casa | **funciona** (última: 17:44:03 UTC, 1 archivo) |
| Prompts desplegados en el VPS | **al día, 18:39** — `paso0=1` en los cuatro, `plataforma-v1` vivo en `chatbot-cola` |
| `/root/bin/onia-loops-sync.sh` del VPS | **descongelado 18:41**, idéntico a `origin/main` |

**Cambios que SÍ están vivos en el VPS** (los hice yo, fuera del repo):

- El vigía de loops remotos ahora lee `/var/log/homelab` (`ONIA_LOG_DIR` agregado a su línea de
  cron). Respaldo: `/root/crontab.antes-vigia-logdir.txt`. 85 líneas antes y después.

**Cambios vivos en la PC de casa:**

- Su cron de sincronización invoca `/bin/bash <script>` (antes fallaba con `Permission denied` en
  cada vuelta). Respaldo: `/root/crontab.antes-de-descongelar-sync.txt`.
- Su repo se puso al día a mano (estaba 97 commits atrás). El diff de los parches en caliente que
  se descartaron está en `/root/respaldo-parches-en-caliente-20260905T162042Z.patch`.

---

## 3. ✅ CERRADO — la infra quedó operativa el mismo día

Todo lo que este handoff listaba como «a medias» a las 18:10 se ejecutó y se verificó entre las
18:40 y las 18:50 UTC. Queda escrito con su medición, no con su intención:

| paso | estado | evidencia |
|---|---|---|
| El integrador mergea la rama | ✅ **18:40**, `main = df5694ca` | `git rev-list --count origin/main..HEAD` → **0** |
| Congelar `lucia`, `supervisor`, `kpis-semanal` | ✅ | crontab del VPS **85 → 85 líneas**, cero activas con esos ids, **4 loops activos** |
| Romper el candado del sync del VPS | ✅ **18:41** | `/root/bin/onia-loops-sync.sh` **idéntico a `origin/main`**; el congelado quedó respaldado |
| Los prompts corren con el código de hoy | ✅ **18:39** | `paso0=1` en los cuatro; `plataforma-v1` con 5 menciones en `chatbot-cola.md` |

**Cómo se destrabó el merge, porque la lección sirve para la próxima:** el integrador había
corrido cuatro veces sin ver la rama — su propio prompt documenta esa trampa **seis veces**
(*"sólo lo encuentra el `--no-merged`"*). No se forzó un push a `main` (el hook `pre-push` lo
bloquea, y con razón): se le pidió por **su propio canal**, el tablero, que su prompt manda leer
antes que su cola — tarea `t_48c1f600`, con las dos verificaciones que él exige ya corridas y
verdes. Mergeó en la vuelta siguiente.

### Recontado a las 20:00 UTC por una sesión distinta — y apareció un agujero

El cierre de arriba se volvió a medir de cero a las 19:30-20:10 UTC, sin leer este handoff como
prueba. **Los cuatro renglones aguantan**, y esta vez mirando que los loops CORRAN, no que su
cron exista — que es la distinción que §5 de este mismo archivo dice que cuesta caro:

| qué | medido el 2026-09-05 |
|---|---|
| `main` trae el congelamiento | `grep -c 'Congelados el 2026-09-05'` → **1** |
| Prompts vivos en el VPS | `paso0=1` · `plataforma-v1=5` · **4** loops activos |
| Los 4 corren de verdad | últimas vueltas **todas `exit 0`**: `onia-cola` 18:42:56Z · `chatbot-cola` 18:13:28Z · `web-venta` 18:59:09Z · `recorrido-cliente` 19:12:08Z |
| El sync quedó suelto | 18:44 y 19:44 dicen solo `fuente:`, **sin** la línea `conservado (shim del nodo de casa)` |
| Los 3 congelados pararon | `lucia` última 09:47Z · `supervisor` 18:32Z (su turno de las 18:29, el crontab se editó 18:41) · `kpis-semanal` del 09-03 |

#### 🔴 Pero `lucia` NO estaba apagada, y la herramienta no podía verlo

`congelar-loops-vps.sh` sustituye sobre el patrón `^[^#].*onia-loop\.sh <id>`. **Un carril que
además tiene un cron propio con otro nombre de script queda vivo.** Era el caso:

```
# CONGELADO 2026-09-05 (foco v1.0) — 37 9,21 * * * onia-loop.sh lucia
10 11 * * * /root/bin/lucia-cierre.sh >/dev/null 2>&1      <- seguía disparando
```

`lucia-cierre.sh` corre `claude -p --max-turns 60` con tope de 20 min, **todos los días a las
11:10 UTC** — corrió el 02, 03, 04 y **el 05 a las 11:10, `rc=0`, 69 s**. Y su propia cabecera
dice **«Cero creditos»**, que es falso: gasta exactamente el recurso por el que se lo congela.
Esa línea es la que hace que nadie lo mire.

> **No fue un descuido de quien congeló.** La herramienta define qué significa «congelar lucia»,
> y su definición era «la línea `onia-loop.sh lucia`». Congeló lo que sabía ver, y se calló sobre
> el resto. Un guion que apaga la mitad de un carril **sin decirlo** es peor que uno que no apaga
> nada, porque deja a todos creyendo que el carril está quieto.

**Arreglado en las dos capas:**

1. La línea quedó comentada en el VPS con el método que §5 exige (archivo, verificar, recién
   instalar): respaldo en `/root/crontab.antes-de-congelar-lucia-cierre-2026-09-05.txt`,
   **85 líneas antes y después**, y los **4 loops siguen activos**. Se revierte descomentando.
2. `congelar-loops-vps.sh` ahora **avisa** de las líneas activas que nombran un carril y que él no
   puede comentar. Sale también en `--seco`, que es donde sirve: antes de aplicar, no después.

#### Anotado, no perseguido

- **`claude-guardia.sh` corre cada 10 min y SÍ llama a Claude.** No es cuota parada: solo dispara
  cuando Sentry trae un issue de código que no vio antes. Se deja como está; queda escrito para
  que la próxima medición de cuota no lo descubra de nuevo como sorpresa.
- El resto de los ~20 crons del VPS que no son loops (backups, recordatorios, watchdogs del bot,
  vigía de auth) **no llaman a Claude**. Se revisaron uno por uno el 2026-09-05.

### Lo que sigue abierto, y es lo único

**Los dos `ok` de Sergio Urcullo.** Ver §6. Ningún loop los destraba.

## 4. Archivos tocados

**En el repo** (rama `claude/onia-dev-node-setup-22a170`, 14 commits, **todos en `main` desde las 18:40**):

| archivo | qué |
|---|---|
| `hermes-content/docs/cola/loops.md` | tabla de activos 7→4; sección **Congelados 2026-09-05**; el orden obligatorio al mudar |
| `hermes-content/docs/cola/plataforma-v1.md` | **nuevo** — la cola del carril, 8 ítems, gate verde |
| `scripts/loops/prompts/chatbot-cola.md` | carril ampliado a `plataforma-v1`; dos platos en orden; cierre de vuelta |
| `scripts/loops/prompts/*.md` (15) | **paso 0** del Chequeo de arranque (en qué máquina estoy) |
| `scripts/loops/instalar-homelab.sh` | las 9 cadencias alineadas a `loops.md`; cron de sync con `/bin/bash` |
| `scripts/loops/sincronizar.sh` | guarda de shims acotada a `head -5`; **100644 → 100755** |
| `scripts/loops_registrados.mjs` | gate consciente de la máquina (self-check 21/21) |
| `hermes-content/docs/PLAN_HOMELAB.md` | el segundo punto ciego: un nodo que corre código viejo |
| `scripts/loops/extras/congelar-loops-vps.sh` | **nuevo** — congela loops con la **guarda de orden adentro**: se niega (`exit 1`) si `loops.md` de `main` todavía los lista como activos |
| `scripts/loops/extras/descongelar-sync-vps.sh` | **nuevo** — rompe una vez el candado circular del sync, con freno propio |

**Fuera del repo, en máquinas** — ver §2.

---

## 5. 🔴 Intentos fallidos e hipótesis FALSAS (lo que casi nadie escribe)

1. **«El deploy de `onia-platform` no existe».** **Falso, y fue mi error más caro de la sesión.**
   Existe: `scripts/kanban/publicar-aprobado.mjs` → `/root/bin/onia-publicar-aprobado.mjs`, lo
   construyó `onia-cola` el mismo día (`81e66ed18`). Busqué `--como` y archivos con «deploy» en el
   nombre dentro de `/root/bin` y `onia-platform`; el publicador no se llama así y no vive ahí.
   **Concluí una ausencia desde un `grep` vacío** — el error exacto que este sistema tiene medido
   al 46%. Alcancé a escribir un ítem de cola para «construirlo» y lo corregí en la misma sesión.
   Está anotado como ítem cerrado en `cola/plataforma-v1.md`, con la lección, a propósito.

2. **«El vigía mide la fecha del archivo, así que el rsync sin `-t` lo engaña».** Falso: lee el
   **contenido** (`grep "===== ARRANCA $ID"`) y parsea un ISO completo. La red de seguridad era
   real; la alarma la di yo.

3. **Mi propia guarda de shims se bloqueaba a sí misma.** Buscaba
   `'Generado por instalar-homelab.sh'` en el archivo entero, y ese literal está **en el código de
   la guarda**. `sincronizar.sh` se negaba a desplegarse a sí mismo: el sync del VPS quedó
   congelado desde las 00:43 y cada hora loggeó *"conservado (shim del nodo de casa)"* **en el
   VPS**, donde no hay nodo de casa. El mensaje absurdo estuvo 15 h en el log sin que nadie lo
   leyera. Arreglado (`head -5`) y **el candado ya se rompió a mano el 2026-09-05 18:41** — era
   circular: la copia vieja era la que decidía, así que el arreglo no podía aplicarse solo. El
   guion quedó en el repo: `scripts/loops/extras/descongelar-sync-vps.sh`, con freno si `main` aún
   no trae la guarda acotada.

4. **Tres bugs en mi propio guion de mudanza, atrapados antes de correrlo:** `#` como delimitador
   de `sed` con `#` en el patrón; `$@` que bash expandía dentro de comillas dobles; y un `$?` que
   medía a `tail` en vez de al gate. Por eso el guion se corre **en seco** primero.

5. **Casi mudo `web-venta` y `lucia` con la cadencia del instalador**, que es anterior a las bajas
   del 3 y 4 de septiembre: los habría corrido **2 y 4 veces más seguido**. Mudar no es cambiar la
   cadencia.

6. **Casi enciendo loops en casa con los prompts viejos.** Sin el paso 0, su paso 3 compara contra
   las filas `VPS` y **reinstala lo que falta**: habría instalado los diez crons del VPS dentro de
   la PC. Lo frenó descubrir que el nodo estaba congelado.

---

## 6. Qué depende de Sergio Urcullo

**🔴 Lo único urgente, y no es técnico: dos `ok` en el tablero.**

| tarea | comando | qué destraba |
|---|---|---|
| `t_e05a44d7` | `ok t_e05a44d7` | `onia.com.bo` — 22 arreglos. El más caro: la tarjeta que se ve al compartir el link por WhatsApp era una captura con «MUY PRONTO» impresa adentro |
| `t_8ac57b3f` | `ok t_8ac57b3f` | `app.onia.com.bo` — el dueño con el add-on del chatbot **ya pagado** no puede conectar su WhatsApp: 3 de 4 orgs ven un cartel de venta en vez del botón |

Están en `blocked` desde las **14:43 UTC**. El integrador cuenta **plataforma 5 · landing 32**
commits sin desplegar. **Ningún loop puede destrabar esto**: el `ok` es la decisión.

**Decisiones ya tomadas hoy** (no volver a preguntar):

- **v1.0 = los 5 rubros que ya se venden** (dental, estética, comercio, importadora acotada,
  servicios profesionales). Veterinaria y ganadería **afuera**.
- **Ampliar `chatbot-cola`** al carril del producto en vez de abrir un quinto loop.
- **`web-venta` queda vivo** aunque venda y no desarrolle: es la puerta del lead.
- **El loop despliega con gates** — ya resuelto por el circuito existente (§5.1).

**Pendiente de decisión, anotado y sin ejecutar:**

- **La cuota no bajó con el recorte.** `chatbot-cola` (36 vueltas/48 h) y `onia-cola` (34) son el
  **60%** del gasto y los dos se quedan. Bajarla es bajar **cadencia**, no cortar carriles.

---

## 7. Próximos pasos, en orden

Los cuatro pasos que este handoff listaba están **hechos** (§3). Lo que sigue:

1. **Los dos `ok`** (§6). Es lo único que separa 37 arreglos verdes del cliente.
2. **Confirmar que el candado del sync quedó roto de verdad**, en la vuelta horaria siguiente:
   ```
   ssh … 'tail -3 /var/log/onia-loops-sync.log'
   ```
   Si vuelve a decir *"conservado (shim del nodo de casa)"* sobre `onia-loops-sync.sh`, el
   candado se recerró y hay que mirar por qué. Si no lo dice, quedó resuelto.
3. **El carril `plataforma-v1` empieza a comer de su cola** en la vuelta de `chatbot-cola`. Su
   primer ítem real es un Gate 1 sobre `ONIA_CATALOGO_DE_VENTA.md` §8, que se contradice consigo
   mismo sobre si servicios profesionales ya está arreglado.
4. **Auditar Hermes**, que en esta sesión no se hizo (§8). `systemctl is-active hermes-agent` da
   `inactive` con 3 procesos `hermes_cli` vivos: corre por otra vía y nadie sabe cuál.
5. **La cuota**: `chatbot-cola` (36 vueltas/48 h) y `onia-cola` (34) son el 60% del gasto y los
   dos se quedan. Bajarla es bajar **cadencia**, no cortar carriles. Decisión de Sergio Urcullo.

## 8. Lo que este carril NO hizo, y hay que decirlo

- **No mudó ningún loop.** El VPS corre 7, casa corre 0.
- **No tocó `onia-platform`** ni desplegó nada. El reparto se respetó.
- **No verificó Hermes a fondo.** Lo medido: el proxy responde (401 sin credencial, o sea vivo),
  `default: gpt-5-mini` como pediste, `MEMORY.md` en `/root/.hermes/memories/` con **221 entradas**
  y escritura a las 16:56 — **aprende**. `systemctl is-active hermes-agent` da `inactive` pero hay
  **3 procesos `hermes_cli`** vivos: corre por otra vía, no por ese servicio. **Eso no se
  investigó** y no se puede llamar «Hermes está perfecto» sin hacerlo.

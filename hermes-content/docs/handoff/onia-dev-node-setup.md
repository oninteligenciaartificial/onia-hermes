# Handoff — carril `onia-dev-node-setup` (nodo de casa → foco v1.0)

**Última actualización:** 2026-09-05 ~18:10 UTC · rama `claude/onia-dev-node-setup-22a170`
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

Medido el 2026-09-05 ~18:00 UTC, no de memoria:

| | estado real |
|---|---|
| Loops activos en el **VPS** | **7** (`chatbot-cola`, `onia-cola`, `web-venta`, `lucia`, `kpis-semanal`, `recorrido-cliente`, `supervisor`) |
| Loops activos en **casa** | **0** — los 5 instalados están comentados en su `crontab` |
| Mantenimiento activo en casa | **3** (rsync de logs, memoria, sincronización horaria) |
| Repo del nodo de casa | **al día con `origin/main`**, 0 commits detrás |
| Sincronización horaria de casa | **funciona** (última: 17:44:03 UTC, 1 archivo) |

**Cambios que SÍ están vivos en el VPS** (los hice yo, fuera del repo):

- El vigía de loops remotos ahora lee `/var/log/homelab` (`ONIA_LOG_DIR` agregado a su línea de
  cron). Respaldo: `/root/crontab.antes-vigia-logdir.txt`. 85 líneas antes y después.

**Cambios vivos en la PC de casa:**

- Su cron de sincronización invoca `/bin/bash <script>` (antes fallaba con `Permission denied` en
  cada vuelta). Respaldo: `/root/crontab.antes-de-descongelar-sync.txt`.
- Su repo se puso al día a mano (estaba 97 commits atrás). El diff de los parches en caliente que
  se descartaron está en `/root/respaldo-parches-en-caliente-20260905T162042Z.patch`.

---

## 3. 🔴 Lo que quedó A MEDIAS, y dónde — leer esto primero

### 3.1 Los 10 commits de este carril NO están en `main`

**Es el bloqueante de todo lo demás.** `origin/claude/onia-dev-node-setup-22a170` está **10
commits por delante de `origin/main`, con CERO conflictos** (`git merge-tree` verificado), y el
integrador `onia-cola` corrió **cuatro veces hoy** (10:33, 12:33, 14:33, 16:33), todas `exit 0`,
**sin mencionar esta rama ni una vez**.

Su propia línea de objetivo dice *"ramas varadas 0 (la más vieja: 27 min)"* — o sea que **la ve y
decide que no está varada**. No encontré el umbral escrito en su prompt. **Hipótesis sin
confirmar:** tiene un mínimo de antigüedad y esta rama recibió pushes durante toda la tarde, así
que nunca "envejeció". **Hay que confirmarlo leyendo `/root/bin/loops/onia-cola.md`**, no asumirlo.

**Mientras no mergee, NADA de lo de hoy está vivo:**

| lo que espera en la rama | consecuencia de que no llegue |
|---|---|
| el **paso 0** de los 15 prompts | los prompts desplegados en el VPS son del **2026-09-03 21:19** y no lo tienen |
| el carril `plataforma-v1` | `chatbot-cola` sigue con un solo plato |
| la sección de **congelados** | `lucia`, `supervisor` y `kpis-semanal` **siguen corriendo** |
| la guarda de shims acotada | `/root/bin/onia-loops-sync.sh` del VPS **sigue congelado en las 00:43** |

### 3.2 El congelamiento está documentado pero NO ejecutado

`loops.md` (en la rama) ya saca a los tres de la tabla de activos. **Sus líneas de `crontab`
siguen activas en el VPS.** El orden es obligatorio y no se puede invertir: **la tabla llega a
`main` ANTES de tocar el cron**, porque el *Chequeo de arranque* de los prompts **sólo agrega** —
al revés, el primer loop que arranque los reinstala y el congelamiento se revierte solo.

Guion listo para cuando mergee, con respaldo y verificación de conteo de líneas:
`scratchpad/mudar.sh` (probado **en seco** contra los dos crontabs reales: VPS 85→85 líneas,
activos 7→5; casa 10→10).

### 3.3 La mudanza: frenada, no rota

`scratchpad/mudar.sh` y `scratchpad/armar-vigia.sh` quedan escritos y probados en seco. La
infraestructura del nodo está **terminada y verificada** (ver §5 de `PLAN_HOMELAB.md`). El día que
se retome, el orden está documentado en `loops.md`.

---

## 4. Archivos tocados

**En el repo** (rama `claude/onia-dev-node-setup-22a170`, 10 commits):

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
   leyera. Arreglado (`head -5`), **pero el arreglo está en la rama sin mergear**, y el candado es
   circular: la copia vieja es la que decide. **Hay que romperlo a mano una vez** —
   `scratchpad/descongelar-vps.sh`, ya escrito, con freno si `main` aún no trae el arreglo.

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

1. **Confirmar por qué `onia-cola` no mergea esta rama.** Leer `/root/bin/loops/onia-cola.md` y
   buscar su criterio de rama varada. **Sin esto, nada de lo de hoy se enciende.** Si el criterio
   es antigüedad, basta con dejar de pushear y esperar una vuelta.
2. Cuando `main` traiga `loops.md`: correr `scratchpad/mudar.sh` **paso 2 solamente** (comentar
   `lucia`, `supervisor`, `kpis-semanal` en el VPS). El guion está probado en seco.
3. Romper el candado del sync del VPS: `scratchpad/descongelar-vps.sh` (tiene freno propio).
4. Verificar que los prompts desplegados traigan el paso 0 y el carril:
   `grep -c "En qué máquina estás" /root/bin/loops/chatbot-cola.md` → tiene que dar **1**.
5. Recién ahí el carril `plataforma-v1` empieza a comer de su cola.

---

## 8. Lo que este carril NO hizo, y hay que decirlo

- **No mudó ningún loop.** El VPS corre 7, casa corre 0.
- **No tocó `onia-platform`** ni desplegó nada. El reparto se respetó.
- **No verificó Hermes a fondo.** Lo medido: el proxy responde (401 sin credencial, o sea vivo),
  `default: gpt-5-mini` como pediste, `MEMORY.md` en `/root/.hermes/memories/` con **221 entradas**
  y escritura a las 16:56 — **aprende**. `systemctl is-active hermes-agent` da `inactive` pero hay
  **3 procesos `hermes_cli`** vivos: corre por otra vía, no por ese servicio. **Eso no se
  investigó** y no se puede llamar «Hermes está perfecto» sin hacerlo.

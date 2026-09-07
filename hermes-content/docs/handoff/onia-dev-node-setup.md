# Handoff — carril `infra de loops` (rama `claude/onia-dev-node-setup-22a170`)

> Formato: [`README.md`](README.md) de esta carpeta. Se **sobrescribe**: es el estado ACTUAL.
> Última escritura: **2026-09-07 03:0x UTC**. Todo lo de acá está medido ese día, no recordado.

---

## 1. Objetivo

Arrancó como *"terminar la configuración de la infra"* y Sergio Urcullo lo amplió dos veces:
primero con los pedidos del doc de infra de la sesión de producto, y después con la decisión
que ordenó todo lo demás:

> *"los loops se mudan a la PC de la casa, el VPS solo queda para la app de Onia Platform"* ·
> *"congela todo lo que no sea onia platform"* · *"no puedo estar prompteando a cada rato"*.

**Cumplido.** El VPS quedó con la app; los cuatro loops corren en `nodo-casa`; y ese nodo ya se
administra solo, sin pedirle a Sergio Urcullo que pegue comandos.

---

## 2. Qué quedó EN PRODUCCIÓN

### El VPS — solo la app

| pieza | estado |
|---|---|
| Loops en su `crontab` | **0** (eran 4) |
| Gate | ✅ `VPS · loops en su cron: 0 · filas "VPS": 0` · *"coinciden en las dos direcciones"* |
| Disco | **82%**, 36 GB libres (empezó el día en **89%** con 22 GB) |
| Postiz + Temporal (6 contenedores) | ⏸ **congelados** — se llevaban **17,15% de CPU** y en 3 semanas no publicaron nada |
| n8n · Chatwoot · Supabase · LiteLLM | ✅ se quedan (decisión de Sergio Urcullo; n8n tiene workflows vivos, Chatwoot es el canal del chatbot) |
| `onia.com.bo` · `app.onia.com.bo` · `chat.onia.com.bo` | ✅ 200 |

### Hermes

| pieza | estado |
|---|---|
| Trabajos activos | **9** (eran 2) |
| `onia-veredicto-sergio` | ✅ pineado, corrió de verdad, `failure_streak=0` |
| Los 13 pausados | ✅ **config arreglada en los 13** (todos tenían `provider`/`model` en `None`) |
| Encendidos, por servir a la etapa | agenda diaria · estado operativo · kickoff lunes · **prospección martes** · sprint miércoles · finanzas viernes · cierre domingo |
| Congelados **a propósito** | los 5 de contenido/video/marca: config OK, pausados por decisión, **no rotos** |
| `hermes-daily-content-arthur` | 🗑 **borrado** — Arthur no colabora desde el 23-ago y entregaba a **otro Telegram** (`8887222181`). Respaldo: `/root/hermes-job-content-arthur.borrado-2026-09-07.json` |
| **Gateway** | ✅ **unidad systemd propia**, `active` + `enabled`, en `/system.slice/hermes-gateway.service`, una sola instancia |

### `nodo-casa` — la máquina de desarrollo

| pieza | estado |
|---|---|
| Loops | ✅ **4**: `onia-cola` `33 * * * *` · `chatbot-cola` `3 * * * *` · `web-venta` `48 */2` · `recorrido-cliente` `9 1,4,…,22` |
| Gate | ✅ `casa · loops en su cron: 4 · filas "casa": 4` · *"en las dos direcciones"* |
| Disco / carga | **7% de 1 TB** (897 GB libres) · load 0,38 sobre **12 hilos** |
| Shim de `docker` | ✅ ejecuta en el VPS; enlazado en `/usr/bin` para que **cron** lo encuentre |
| Túnel inverso | ✅ vivo, cron cada 5 min y `@reboot` |
| Vigía de disco | ✅ instalado, nombrando a `nodo-casa` y su consecuencia real |
| Circuito de memoria | ✅ **probado de punta a punta**: escribió desde el nodo y aterrizó en el VPS firmado con hora de La Paz |

**Cambios en el VPS fuera del repo**, todos con respaldo previo: `jobs.json` (×2) ·
`crontab` (×4) · `loops-remotos.txt` · los 4+1 worktrees sacados
(`/root/worktrees-mudados-a-casa-2026-09-06.txt`) · los contenedores congelados
(`/root/congelados-no-plataforma-2026-09-07.txt`).

---

## 3. Qué quedó a medias, y dónde

**Nada sin commitear en el repo.** Árbol limpio.

**🟡 `onia-hermes-recorrido` (2,3 GB) sigue en el VPS**, y a propósito: tiene **dos capturas
del recorrido del cliente sin commitear**, evidencia que su última vuelta dejó ahí. Borrarlo las
pierde. Ese loop ahora corre en `nodo-casa` y es su dueño quien debe resolverlas.

**🟡 `lucia-contenido` (10 GB) tampoco se tocó:** tiene **2 commits sin pushear**. Parecía peso
muerto y tiene trabajo adentro.

---

## 4. Archivos y cambios

| commit | qué |
|---|---|
| `bab90a9f` | `canario-visual`: de pausa por cuota a **decisión**, con la consecuencia escrita |
| `a3a911a7` | La receta del paso 10, **corregida**: el orden que había escrito era un candado |
| `c4169e26` · `e40cbfdd` | `vigia-ci.sh` + 13 casos de prueba, instalado y probado contra la API real |
| `03e3f110` | Regla en `CLAUDE.md`: *`main` se mueve debajo tuyo mientras medís* |
| `420b5ac6` | La mudanza no estaba hecha: **el worktree se quedaba** |
| `d9d525ad`→`5d36aefc` | El shim de `docker`, `preparar-nodo.sh` (túnel inverso) y 3 bugs del instalador |
| `5d36aefc` | El vigía de disco nombraba al VPS aunque corriera en otra máquina |
| `0c54d65` *(repo `onia-platform`)* | `.gitleaks.toml` — el escáner deja de gritar sin motivo |

---

## 5. 🔴 Intentos fallidos y errores propios

**Doce. Once los agarré verificando; el primero lo agarró Sergio Urcullo.**

**1. Arranqué sin `onia-router` ni `onia-infra`, que son obligatorias.** Lo cazó él: *"¿por qué
no usás los canarios?"*. Y no fue cosmético: **`onia-infra` contenía el arreglo del pedido #3**
del doc de producto — la trampa del `pgrep` que se matchea a sí mismo. La lección existía y
nadie la cargó. **La misma causa que el pedido que venía a arreglar.**

**2. Y caí en esa trampa TRES veces el mismo día**, después de escribir sobre ella dos veces.
La tercera fue la peor: usé el truco del corchete `[g]ateway run` y **igual se auto-matcheó**,
porque mi propio comando contenía el texto en otra parte. El corchete protege del patrón, no de
que el texto aparezca por otro motivo.

**3. La receta del paso 10 que yo mismo escribí era un candado**, y el candado mordió del lado
que no vi: el integrador **mergea y después corre el gate**, así que mi cambio de tabla no podía
entrar mientras el VPS tuviera las líneas. Se destrabó solo cuando el integrador se mudó — el
gate mide **la máquina donde corre**.

**4. Una prueba negativa mal armada me hizo afirmar en voz alta una conclusión falsa** sobre
gitleaks, y casi commitear una exención de archivo creyéndola de un literal.

**5. Un `sed` sin espacio hizo pasar una prueba que no probaba nada** (`"conclusion": "success"`
lleva espacio). Un verde que no medía.

**6. El comando del token usaba `read -s`, que no muestra nada al pegar** → el token quedó
**tres veces seguidas** (279 B = 93 × 3) y la API dijo `Bad credentials`. **Un pedido de
credencial que no devuelve feedback se pega dos veces.**

**7. Un script escribió literal `undefined` en `loops.md` y me devolvió "fila agregada".**

**8. Dejé un `grep -F -f -` en una regla de `CLAUDE.md`** que leía sus patrones de su propio
stdin.

**9. Un centinela colgado de mi sesión SSH murió sin medir nada.** Los que vigilan una ventana
corta van **desprendidos en la máquina que vigilan**.

**10. Peleé con el escapado anidado cuatro veces** —heredocs dentro de `ssh`, backticks dentro
de `node -e`— cuando `onia-infra` lo dice literal: *escribí el script, `scp`, y ejecutalo*.
Recién a la cuarta lo hice bien.

**11. El instalador ejecutaba las comillas invertidas de sus propios comentarios** (heredoc sin
comillas), en el comentario que advierte que eso pasa.

**12. Y escribí un chequeo que mentía:** comparaba `command -v docker` resuelto en el shell
equivocado contra una ruta cruda que era un enlace. **Rojo permanente con todo funcionando, al
lado de un verde que decía lo contrario.** Un chequeo que miente enseña a ignorar el rojo.

**El patrón que atraviesa a los doce:** casi ninguno era un bug de código. Eran **verificaciones
que no verificaban** y **lecciones escritas que nadie cargó**. Los dos pedidos del doc de
producto que cerré sin escribir una línea (#3 y #4) son el mismo caso.

---

## 6. Qué depende de Sergio Urcullo

**🔴 1. `ok t_30e607a8`** — publica `onia.com.bo`. Dijo *"v1.0 ok"* en el chat, pero **el
circuito espera ese `ok` por Telegram**, que es lo que dispara el deploy. La cola de la v1.0
tiene **2 ítems abiertos de 12**: éste y el pendiente fiscal, que va último a propósito.

**🔴 2. Que `nodo-casa` sobreviva un corte de luz.** Ahora es crítico: **los cuatro loops están
allá, incluido el único camino a `main`**. Falta BIOS en *Restore on AC Power Loss* y aplicar
`homelab-wsl-arranque.ps1`.

---

## 7. Próximos pasos, en orden

1. **`ok t_30e607a8`** por Telegram.
2. **El arranque de `nodo-casa`** (§6.2). Es el único punto único de falla que queda.
3. **Tailscale**, para cerrar el puerto 22 público del VPS — hoy abierto a todo internet. El
   túnel inverso resolvió el acceso, no la exposición.
4. **Versionar lo que vive solo en el VPS**: `loops-remotos.txt`, `loops-vps.txt` y el runbook
   del token del vigía de CI.
5. **Del doc de producto quedan #5, #6 y #7** (deploy parametrizado, cerrar pedidos contra el
   `BUILD_ID` vivo, entorno de tests). #6 toca el circuito de aprobaciones **que ya se silenció
   solo una vez**: sesión aparte.
6. **Los 3 rojos viejos del `doctor` de Hermes** se limpian solos en su próxima corrida —
   probado con uno.

---

## 8. Las tres máquinas

| nombre | máquina | se reconoce por |
|---|---|---|
| **laptop** | `DESKTOP-ENV6SDA` — donde Sergio Urcullo trabaja | **no** tiene `/root/loops` ni `/root/.onia-nodo` |
| **nodo-casa** | `DESKTOP-0GGGNMF` — i5-12400F, 12 hilos, 1 TB. **Los 4 loops** | existe `/root/.onia-nodo` con `casa` |
| **VPS** | `srv1360183` · 187.77.16.63 — **solo la app** | existe el CLI de Hermes |

Se reconocen por **archivo, nunca por hostname**. ⚠️ En `nodo-casa` ya estás **dentro** de WSL
si el prompt dice `compu_pc_casa_sergio@DESKTOP-0GGGNMF`: `wsl` es un comando de Windows y ahí
no existe. Y **se llega desde el VPS**, sin su teclado:
`ssh -i /root/.ssh/vps-a-nodo -p 2222 root@127.0.0.1`.

# Handoff — carril `infra de loops` (rama `claude/onia-dev-node-setup-22a170`)

> Formato: [`README.md`](README.md) de esta carpeta. Se **sobrescribe**: es el estado ACTUAL.
> Última escritura: **2026-09-06 21:34 UTC**. Todo lo de acá está medido ese día, no recordado.

---

## 1. Objetivo

**Dejar operativa la infra de loops de Onia.**

**Hecho** = los 4 loops decididos corriendo con el código de hoy · los 3 congelados apagados ·
el sync del VPS descongelado.

**✅ Cumplido**, y verificado mirando que los loops **CORRAN**, no que su cron exista — que es la
distinción que este proyecto ya pagó tres veces (*"un loop puede morir con su cron INTACTO"*).

Después Sergio Urcullo sumó cuatro pedidos que no eran el objetivo. Están abajo, cada uno cerrado
o con su bloqueante nombrado.

---

## 2. Qué quedó EN PRODUCCIÓN

Medido el 2026-09-06 21:34 UTC.

| pieza | estado |
|---|---|
| Gate `loops_registrados.mjs` en el VPS | ✅ *"coinciden en id y horario, en las dos direcciones"* |
| `onia-cola` | ✅ `33 * * * *` — **cada hora** · última vuelta 20:47Z |
| `chatbot-cola` | ✅ `3 * * * *` — **cada hora** · última vuelta 21:14Z |
| `web-venta` | ✅ `48 */2 * * *` · última vuelta 20:57Z |
| `recorrido-cliente` | ✅ `9 1,4,7,…,22 * * *` · última vuelta 19:14Z |
| Los 3 congelados | ✅ **0** líneas activas que nombren `lucia`, `supervisor` o `kpis-semanal` |
| Sync del VPS | ✅ descongelado — sin la línea `conservado (shim del nodo de casa)` |
| Gateway de Hermes | ✅ `active`, unidad systemd, `Restart=always`, arranca en el boot |
| SQLite de Hermes | ✅ **3.53.1** (era 3.50.4 con el bug de WAL) |
| `hermes-vigia.sh` | ✅ encendido, minuto 12 |
| Aviso de aprobaciones | ✅ bajado de `*/2` a `*/30` |
| **nodo-casa** | ⏸ despierto y sincronizando, **0 loops corriendo** |

**Cambios hechos en el VPS fuera del repo** (todos con respaldo previo, 85 líneas antes y después):

| qué | respaldo |
|---|---|
| `lucia-cierre.sh` congelado | `/root/crontab.antes-de-congelar-lucia-cierre-2026-09-05.txt` |
| cadencia horaria aplicada | `/root/crontab.antes-de-cadencia-horaria-2026-09-05.txt` |
| `hermes-vigia.sh` reencendido | `/root/crontab.antes-de-encender-vigia-2026-09-06.txt` |
| aprobaciones a `*/30` | `/root/crontab.antes-de-bajar-aprobaciones-2026-09-06.txt` |
| Hermes actualizado a `7166071fca` | commit anterior `ff7233b8` + bases en `/root/respaldo-hermes-antes-update-2026-09-06/consistente` (9/9, respaldo en caliente correcto) |

---

## 3. Qué quedó a medias, y dónde

**Nada sin commitear y nada sin pushear.** Los tres worktrees limpios; esta rama al día con `main`.

**🔴 La mudanza a nodo-casa: decidida, preparada, NO ejecutada.** Cero loops corren allá.
Bloqueante: **una línea de cron que hay que descomentar en `DESKTOP-0GGGNMF`**, y desde ninguna
otra máquina se llega a ese nodo.

**🔴 La landing sigue sin publicar.** `/opt/onia-landing/runtime-next` es del **2026-09-04 10:04**.
La plataforma sí se publicó (runtime del 06-sep 17:08). Ver §6.

**🟡 `onia-vigia-aprobaciones.sh` no está versionado.** Vive solo en el VPS y el sync no lo
despliega. Es el script que le escribe a Sergio Urcullo todos los días: si esa máquina se pierde,
se pierde con ella.

**🟡 Sigue mandando un mensaje POR TAREA**, solo que agrupadas cada 30 min. Agruparlas en uno solo
no se hizo a propósito: ese script ya silenció el resumen de 11 tareas por un escape mal puesto
(2026-09-03), y reescribir su envío sin necesidad es pedirle que vuelva a pasar.

---

## 4. Archivos y cambios

Todos en `claude/onia-dev-node-setup-22a170`, ya mergeados a `main` por el integrador.

| commit | qué arregla |
|---|---|
| `3c9a56d8` | **Congelar un carril apagaba solo la mitad y no lo decía.** `congelar-loops-vps.sh` sustituye sobre `onia-loop.sh <id>`; `lucia` tenía además `lucia-cierre.sh` con otro nombre, corriendo `claude -p` a diario con una cabecera que dice «Cero creditos» y es falso. El guion ahora **lista lo que no puede apagar**, y también en `--seco` |
| `6b82f2cc` | **«La tabla primero» al mudar un loop deja `main` en rojo para los quince.** El gate compara id **y horario** y hace `exit 1`; con la tabla movida y el cron viejo intacto se bloquea la cadena de `npm test` — incluido el integrador, único que podría arreglarla. Van **juntas** |
| `31b59b22` | Cadencia horaria de `onia-cola` y `chatbot-cola` en la tabla, con la medición al lado |
| `c8a0bbb3` | **El gateway de Hermes quedó supervisado** |
| `dd5b10e8` | **«La PC de casa» era ambiguo**: hay DOS Windows en su casa. Los nombres quedan definidos por artefacto |
| `f1516f7f` · `01439c80` · `a5ea0c52` | Notas y estado |

**Scripts dejados en el VPS** (no versionados, de un solo uso):
`/root/congelar-lucia-cierre.sh` · `/root/aplicar-cadencia-horaria.sh` · `/root/encender-vigia.sh` ·
`/root/bajar-aprobaciones.sh`. Todos con el mismo patrón: construir en archivo, **verificar**,
recién instalar — porque un `| crontab -` sin comprobar la salida ya borró 82 líneas.

---

## 5. 🔴 Intentos fallidos y errores propios — el campo que más vale

**Tres recomendaciones equivocadas, todas del mismo tramo en que dejé de cumplir el canario.**
Sergio Urcullo lo vio antes que yo.

1. **Recomendé mudar `canario-visual` y `recorrido-cliente` a nodo-casa.** `PLAN_HOMELAB.md` §1
   dice que esos dos **NO se mudan**: `canario-visual` mide contra umbrales calibrados desde el
   enlace del VPS (desde una casa mide el WiFi), y `recorrido-cliente` escribe en la base de
   producción por `docker exec`. **Recomendé los dos peores.** Causa: razoné por perfil de carga
   (CPU, navegador) en vez de leer el criterio escrito, que es **con qué tiene que hablar para
   trabajar**.
2. **Recomendé NO mudar**, contra una decisión ya tomada. Causa: tomé como autoridad el handoff
   —que reabrió la premisa por disco y cuota— en vez de `PLAN_HOMELAB.md` §0, que dice lo que
   Sergio Urcullo dijo: *«el producto de los clientes deja de competir contra quince agentes
   escribiendo código»*. Esa razón no depende del disco ni de la cuota.
3. **Le pregunté si el nodo era Linux nativo o WSL2.** El doc ya lo respondía con una corrección
   del 2026-09-04 encima.

> **Regla que queda:** cuando el plan y un handoff se contradigan, **manda el plan**. El handoff es
> lo que una sesión midió y opinó; el plan es lo que se acordó.

**Y dos más, de ejecución:**

4. **Creé la tarea `t_30133de2` (landing sin publicar) y era duplicada e invisible.** Otra sesión
   la archivó 11 min después, con razón: ya existía `t_30e607a8` con el mismo `DESPLEGAR: landing`,
   y la mía nació en `ready` — el vigía de aprobaciones **solo mira las `blocked`**, así que no le
   habría avisado a nadie. **Antes de escribir una tarea: buscar si ya está, y crearla `blocked`
   si necesita una decisión.**
5. **Conté mal los golpes de cuota** filtrando por fecha líneas que **no tienen fecha propia**
   (`session limit` sale dentro de la salida de Claude). Daba el total del archivo y parecía que
   la cadencia horaria había roto algo. El método que sí sirve: `awk` que recuerda el último
   `ARRANCA` y fecha el golpe por su vuelta.

**Lo que NO hay que volver a intentar para llegar a nodo-casa** (cinco caminos, todos agotados):
SSH directo (no recibe conexiones) · `ListAgents` encuentra la sesión `WSL install 403 error` pero
`SendMessage` **no existe en este build** · `list_sessions` devuelve solo las locales, sin
`sessionId` para la de Remote Control · `send_message` con la referencia corta → *"Session not
found"* · la LAN solo muestra el router. **Hasta que haya Tailscale, ese nodo se toca desde su
propio teclado.**

---

## 6. Qué depende de Sergio Urcullo

**🔴 1. `ok t_30e607a8`** — publica `onia.com.bo`. 24 arreglos que un lead no ve, esperando desde
el 2026-09-05 22:58. El más caro: la tarjeta que se ve al compartir el link por WhatsApp vendía el
chatbot en vez del sistema, y la de `/v1` tenía **«MUY PRONTO» impreso dentro de la imagen**.
⚠️ La tarea vieja `t_e05a44d7` figura `archived` **sin haberse desplegado**: archivar no es
desplegar.

**🔴 2. Un comando en nodo-casa (`DESKTOP-0GGGNMF`), NO en la laptop.** El 2026-09-06 lo corrió en
la laptop y Windows contestó *"el argumento … no existe"*, que no dice «máquina equivocada».
De solo lectura:

```
wsl -d Ubuntu -u root -e sh -c "hostname; cat /root/.onia-nodo; crontab -l | grep onia-loop"
```

**🟡 3. Decidir si el nodo sobrevive a un reinicio.** `homelab-wsl-arranque.ps1 -Aplicar` crea la
tarea que despierta WSL **al iniciar sesión**. Para que aguante un corte de luz sin que nadie
inicie sesión hace falta elegir: contraseña guardada en la tarea, o inicio de sesión automático.
**No es el bloqueante para encender un loop hoy** — el nodo ya está despierto.

**🟡 4. Si el aviso de aprobaciones sigue molestando**, agruparlo en un mensaje único. Hoy son 83
tareas esperándole y llegan de a una.

---

## 7. Próximos pasos, en orden

1. **`ok t_30e607a8`.** *Listo =* `stat -c %y /opt/onia-landing/runtime-next` da 06-sep o posterior.
2. **La salida del comando de §6.2.** *Listo =* se sabe qué líneas tiene el crontab de nodo-casa.
3. **Mudar `web-venta` a nodo-casa**, único activo de la primera tanda (los otros tres que corren
   se quedan por diseño). Cadencia **tal cual**: `48 */2 * * *`.
   ⚠️ **Las tres cosas en UNA ventana** — cron en el nodo, sacar la línea del VPS, mover la fila de
   la tabla. Separadas, una deja `main` en rojo para los quince y la otra hace que el Chequeo de
   arranque la rearme. *Listo =* gate verde en las **dos** máquinas y una vuelta con `exit 0` en el
   log del nodo.
4. **Los otros 4 de la primera tanda** (`web-factory-dev`, `tendencias`, `lucia`, `marca-personal`)
   se mudan cuando se los reviva: hoy están pausados y mudarlos es gratis.
5. **`onia-veredicto-sergio`** arrastra el mismo `drift_skip` que tenía `onia-ordenador-tablero`.
   Se arregla igual: `hermes cron edit <id> --provider openai-api --model gpt-5-mini`.
6. **Versionar `onia-vigia-aprobaciones.sh`** en el repo.
7. **Tailscale** (paso 3 de `PLAN_HOMELAB.md`). Sin él, nodo-casa se ve pero no se administra.

---

## 8. Los nombres, para que no se repita el error

| nombre | máquina | se reconoce por |
|---|---|---|
| **laptop** | `DESKTOP-ENV6SDA` — HP Victus 16, con batería. Donde Sergio Urcullo trabaja | **no** tiene `/root/loops` ni `/root/.onia-nodo` |
| **nodo-casa** | `DESKTOP-0GGGNMF` — el tercer nodo, con los 5 worktrees | existe `/root/.onia-nodo` |
| **VPS** | `srv1360183` · 187.77.16.63 — la app y los 4 loops | existe el CLI de Hermes |

Las dos primeras están **en la misma casa, con la misma IP pública**. Por eso «la PC de casa» era
ambiguo. Se reconocen por **archivo, nunca por hostname**: una IP se mueve, un hostname se renombra.

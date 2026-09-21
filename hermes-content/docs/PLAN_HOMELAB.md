# Mudar los loops de desarrollo a una PC de casa

**Objetivo:** que el VPS quede para lo que usan los clientes, y que el trabajo de desarrollo
—los loops de carril— corra en una PC vieja de Sergio.

Todo lo medido acá se midió **en vivo el 2026-09-04** contra `187.77.16.63`, no de memoria.
El script que ejecuta este plan es [`scripts/loops/instalar-homelab.sh`](../../scripts/loops/instalar-homelab.sh).

---


## La máquina real de Sergio (medida el 2026-09-04, no estimada)

| | Su PC | El VPS |
|---|---|---|
| Procesador | Intel i5-12400F, **6 núcleos / 12 hilos** | 4 núcleos |
| Memoria | **16 GB** | 15 GB |
| Disco libre | **~1,1 TB** (1,35 TB, 251 GB usados) | 54 GB |
| Sistema | Windows 11 Pro 25H2 | Ubuntu |
| Gráfica | GeForce GT 730 4 GB | — |

**No es una PC vieja: es más máquina que el servidor de producción.** Supera con holgura el mínimo
del plan (8 GB y 120 GB). Con eso caben los 5 loops mudados y sobra para más.

**La gráfica no sirve para modelos locales** y no cambia nada: una GT 730 es de 2014, sin núcleos
tensoriales; la conclusión de descartar modelos locales sigue igual, ahora por GPU además de CPU.

### Windows no se borra: Linux va adentro

El plan original pedía Ubuntu nativo porque los loops en Windows fallaron por el **Programador de
tareas**, no por Windows en sí. Corriendo Linux *dentro* de la máquina ese problema no existe, y
Sergio conserva su equipo tal como lo usa. Dos caminos, en orden de recomendación:

1. **Máquina virtual con Hyper-V** (ya viene en Windows 11 **Pro**): Ubuntu Server 24.04 con 8 GB y
   200 GB, arranque automático con Windows. Es lo más parecido al VPS: `cron` y `systemd` normales,
   aislada, y se apaga o se mueve sin tocar el resto. **Recomendada.**
2. **WSL2 con systemd** (`wsl --install -d Ubuntu`, luego `systemd=true` en `/etc/wsl.conf`): más
   rápido de montar y comparte disco con Windows, pero depende de que la sesión de Windows esté
   activa y su ciclo de vida es menos predecible para tareas de 24 h.

### 🔴 Las TRES cosas que `/etc/wsl.conf` tiene que decir (verificado el 2026-09-05)

Montado y probado con un reinicio real. **Con dos de las tres no alcanza:**

```ini
[boot]
systemd=true                    # sin esto no hay cron: systemd es quien lo levanta

[user]
default=<tu-usuario>            # si falta, WSL abre como root y todo queda con dueño root

[time]
useWindowsTimezone = false      # WSL PISA /etc/localtime desde Windows en CADA arranque
```

**La tercera es la que nadie ve venir.** El VPS corre en `Etc/UTC` y WSL hereda la zona de
Windows — acá, `America/Caracas` (−04). `cron` interpreta los horarios en hora **local**, y el
de Ubuntu **no soporta `CRON_TZ`** (verificado: 0 apariciones de esa cadena en `/usr/sbin/cron`,
con `crontab` como control). Resultado: **todos los horarios con hora fija disparan 4 h tarde.**

Y se revierte sola: `timedatectl set-timezone UTC` **no sobrevive al reinicio** sin esta línea.
Se midió dos veces — se arregló el 4-sep, y el reinicio del 5-sep lo devolvió a `−04`.

*La opción se confirmó en el binario, no se adivinó:* `grep -ao "useWindowsTimezone" /init`.

⚠️ **Y el `[user]` se pierde fácil:** el 4-sep un `tee` pisó el archivo entero y se llevó esa
sección. **A `/etc/wsl.conf` se le AGREGA con `>>`, nunca se lo reescribe con `>`.**

En cualquiera de los dos, el instalador `scripts/loops/instalar-homelab.sh` corre igual: replica las
rutas del VPS y no distingue si está en metal, en VM o en WSL.

## 0. Lo primero, porque cambia la decisión: qué arregla esto y qué NO

Medido hoy en el VPS:

| Recurso | Estado real | ¿Lo arregla mudar los loops? |
|---|---|---|
| **Disco** | 163 GB de 193 usados (**85 %**), y `/root/loops` solo son **72 GB** | **SÍ, y es el problema real.** Sacar 9 worktrees libera ~40 GB |
| **CPU** | `load average: 1.92` sobre 4 núcleos | **Poco.** Los loops esperan a la API, no queman CPU. Alivia los picos (`recorrido-cliente` 1.518 s con Playwright encima de `web-factory-dev` 1.262 s), no una saturación |
| **Cuota de Claude** | Vueltas muriendo con `You've hit your session limit` | 🔴 **NO. Nada.** |

🔴 **La cuota sigue igual y hay que decirlo antes de comprar nada.** Los loops corren con la
**suscripción de Sergio**, y una suscripción es de la cuenta, no de la máquina: quince loops en
el VPS y cinco en casa se pisan exactamente igual que veinte en el VPS. El propio corredor ya lo
tiene escrito (`onia-loop.sh`, bloque *"los loops corren con la MISMA suscripcion de Claude que
la sesion de control, asi que se pisan la cuota"*).

**Mudar la máquina compra disco y picos de CPU. Para comprar cuota hace falta una segunda cuenta
de Claude en la PC de casa — y eso es una decisión de plata y de licencia, no de infraestructura.**
Si el dolor que Sergio quiere sacarse es el `session limit`, este plan solo no lo saca.

Lo que **sí** compra, además del disco: cuando el VPS se estrangula (ya pasó — memoria
*"VPS estrangulado por Hostinger"*), el producto de los clientes deja de competir contra
quince agentes escribiendo código.

---

## 1. Qué se muda y qué NO

Son **15 loops** (verificado: `crontab -l | grep -c onia-loop.sh` → `15`). El criterio no es el
tema del carril: es **con qué tiene que hablar para hacer su trabajo**.

### Se quedan en el VPS — 6

| id | Qué lo ata al VPS | Dónde se ve |
|---|---|---|
| `onia-cola` | **Es el integrador.** Único que mergea a `main` y el único con permiso de push a `main` (`ONIA_LOOP_ID` + hook `pre-push`). Además `onia-loops-sync.sh` despliega desde **su** worktree, y decide si falta deploy leyendo `docker inspect onia-platform` y `stat /opt/onia-landing/runtime-next/.../BUILD_ID` | `prompts/onia-cola.md:14-15`, `sincronizar.sh` |
| `recorrido-cliente` | **Escribe en la base de producción.** Crea y borra filas `zz-qa-%` con `docker exec supabase-db psql`, y lee el flag de alta con `docker exec onia-platform env \| grep ALTA` | `prompts/recorrido-cliente.md:14,17,18,123` |
| `kpis-semanal` | Cuatro `docker exec ... psql` contra `supabase-db` y `onia-chatbot_chatwoot-db`. Esas bases **no escuchan fuera de la red de Docker** (memoria: *"Firewall bloquea el 3000 — corta contenedor↔contenedor"*) | `prompts/kpis-semanal.md:14-17` |
| `chatbot-cola` | Levanta el motor del bot con `docker exec -d` y lee la base de Chatwoot con `psql`. El motor vive en `/opt/onia/bot` | `prompts/chatbot-cola.md:114,124` |
| `canario-visual` | **Es un instrumento calibrado.** Mide **peso y milisegundos** de las pantallas contra umbrales medidos desde el enlace del VPS (para eso existe: la fuente de iconos pesaba 3,9 MB y tardaba 117 s). Desde una conexión de casa cada umbral pasa a medir el WiFi de Sergio | `scripts/canario_visual.mjs`, `prompts/canario-visual.md:14,326` |
| `docs-auditoria` | Su trabajo **es** medir el VPS contra lo escrito: `docker exec supabase-db psql`, `crontab -l`, contenedores. Mudarlo es mudar el termómetro lejos del paciente | `prompts/docs-auditoria.md:18` |

### Se pueden mudar ya — 5 (primera tanda)

Solo tocan **el repo, GitHub y HTTPS público**. Ni un `docker`, ni un `psql`, ni una ruta de
producción.

| id | Qué hace | Por qué sale limpio |
|---|---|---|
| `web-factory-dev` | Webs de cliente | Repo puro. Cero `docker`/`psql` en su prompt |
| `web-venta` | Dueño de `onia.com.bo/` y `/empezar` | Escribe en `web-factory/apps/onia-platform/` y verifica con `curl` sobre HTTPS público — anda desde cualquier lado |
| `tendencias` | Recetas de contenido | Chromium headless sobre páginas **públicas**, `curl`, `gh search`. Su prompt le **prohíbe** loguearse a cualquier red |
| `lucia` | Guiones y prompts de Higgsfield | Deja todo **listo**; tiene prohibido disparar nada pago, así que no necesita el CLI de Higgsfield autenticado del VPS |
| `marca-personal` | Drop del día + una pieza | Igual que `lucia`: prepara, no dispara |

### Se pueden mudar después — 4 (cada uno con su traba, nombrada)

| id | Traba concreta | Cómo se destraba |
|---|---|---|
| `investigacion` | Su lista de verificación en vivo incluye `docker exec` (`prompts/investigacion.md:20`) | Reemplazar esa línea por el shim SSH (paso 4 del instalador). Es una línea |
| `supervisor` | Audita a los otros leyendo `/var/log/onia-loop-$id.log`, que viven en el VPS (`prompts/supervisor.md:213`) | Lectura por SSH — pero ojo: desde casa **no vería** los logs de los loops de casa y los del VPS con el mismo comando. Hay que decidir si audita los 15 o solo los suyos |
| `calidad-generado` | Juzga piezas de Higgsfield; si las lee del caché del VPS, no las tiene | Mudable solo si las piezas están commiteadas en el repo. Verificar antes |
| `contenido-cola` | **Publica**, y las credenciales de publicación (Postiz, IG) están en el VPS | Partirlo: la **preparación** se muda, el **publicar** se queda. O dejarlo entero en el VPS |

**Recuento: 6 se quedan · 5 se mudan ya · 4 se mudan con una decisión previa cada uno.**

---

## 2. Cómo se conecta la PC de casa → **Tailscale**

### Primero, el dato incómodo: para el flujo básico no hace falta nada

La PC de casa solo hace conexiones **salientes**: a GitHub, a la API de Anthropic, y SSH al VPS.
Ninguna necesita que alguien entre a la PC. **SSH de casa al VPS ya funciona hoy** — se probó
desde Windows con `~/.ssh/onia_hermes_vps_ed25519` mientras se escribía este documento.

Entonces la pregunta correcta no es *"¿cómo me conecto?"* sino *"¿qué gano poniendo una red
privada?"*. Dos cosas, y las dos valen:

1. **Cerrarle la puerta al VPS.** Hoy `sshd` escucha en `0.0.0.0:22` con `ufw` dejando pasar a
   todo internet (verificado hoy). Con Tailscale, el SSH de los loops entra por la red privada y
   `ufw` puede **cerrar el 22 público**. Es la mejora de seguridad más grande de todo este plan.
2. **Llegar a la PC de casa desde afuera.** Para que Sergio (o el `supervisor`) pueda mirar si
   la PC está viva, leer un log o reiniciar un loop, sin tocarla físicamente.

### La comparación

| Opción | Veredicto |
|---|---|
| **(a) Tailscale** ✅ | WireGuard con descubrimiento automático. **Atraviesa CGNAT** — decisivo: el internet residencial en Bolivia casi siempre es CGNAT, y ahí la PC no tiene IP pública propia ni hay puerto que redirigir. Cero puertos abiertos en los dos lados. La IP del tailnet (`100.x`) **no cambia nunca**, aunque la de casa cambie todos los días. Gratis hasta 100 dispositivos |
| **(b) Túnel SSH inverso** | Funciona, pero hay que criar el demonio: `autossh` + `systemd` + `ServerAliveInterval`, y cuando se cae hay que darse cuenta. Da **un puerto**, no una red. Y **no cierra el 22 del VPS**: al revés, depende de que siga abierto |
| **(c) VPN clásica (WireGuard a mano / OpenVPN)** | Es Tailscale sin la parte que resuelve el problema. Con la PC detrás de CGNAT hay que poner el servidor **en el VPS** y perforar hacia afuera — o sea, se termina reimplementando Tailscale con claves a mano y sin recuperación automática |

**Se elige (a).** Motivo en una línea: **es la única que sobrevive a CGNAT sin un demonio que
haya que vigilar, y la única que permite cerrar el puerto 22 del VPS.**

### Pasos para Sergio

**En el VPS** (una sola vez):

```bash
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63
curl -fsSL https://tailscale.com/install.sh | sh
tailscale up --ssh --hostname=onia-vps
# imprime una URL: abrirla en el navegador y autenticar
tailscale ip -4        # anotá esta IP: es la que va en ONIA_VPS
```

**En la PC de casa** (una sola vez, ya con Linux instalado — ver §3):

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up --hostname=onia-homelab
sudo tailscale set --auto-update          # que no quede vieja sola
tailscale status                          # tiene que aparecer onia-vps
ping -c3 $(tailscale ip -4 onia-vps)      # verificación, no suposición
```

**Verificar que de verdad va por la red privada** (no por internet):

```bash
tailscale ping onia-vps          # dice "direct" o "via DERP"; las dos sirven
ssh -i /root/.ssh/onia_hermes_vps_ed25519 root@100.x.y.z 'hostname'
```

Recién cuando esa última línea contesta, y **no antes**, se cierra el 22 público en el VPS:

```bash
# EN EL VPS, con la sesión de Tailscale ya probada y una sesión SSH vieja ABIERTA de respaldo
ufw allow in on tailscale0 to any port 22
ufw delete allow 22/tcp        # el candado. Si te equivocás acá, te quedás afuera
```

> ⚠️ **Ese último paso se hace con Sergio mirando y con una sesión SSH abierta de respaldo.**
> Es irreversible desde afuera: si Tailscale no estaba realmente funcionando, la única entrada
> que queda es la consola web de Hostinger.

Después, en el instalador: `ONIA_VPS=root@100.x.y.z`.

### Qué pasa cuando se corta la luz o cambia la IP

| Evento | Qué pasa |
|---|---|
| **Cambia la IP de casa** | Nada. Tailscale renegocia solo; la `100.x` no se mueve |
| **Se corta la luz** | La PC se apaga. Al volver, `tailscaled` levanta con systemd y reconecta sin intervención — **siempre que el arranque automático esté habilitado en la BIOS** (*Restore on AC Power Loss: Power On*). En una PC vieja suele venir en "Last State": hay que ponerlo a mano |
| **Se cae internet en casa** | Los loops arrancan igual, fallan al no llegar al tablero, y **el aviso a Telegram tampoco sale** porque también va por el VPS. **Nadie se entera.** Ver §6 |
| **Se cae el VPS** | Los loops de casa siguen commiteando a GitHub, pero sin tablero ni memoria. Degradan, no mueren |

---

## 3. Qué necesita esa PC

### Mínimos, medidos contra lo que hace una vuelta real

| | Mínimo | Cómodo | De dónde sale el número |
|---|---|---|---|
| **CPU** | 2 núcleos | 4 | El VPS corre **15** loops en 4 núcleos con `load 1.92`. Los loops esperan a la API. Chromium en `tendencias` es el único pico |
| **RAM** | **8 GB** | 16 GB | `node` + `claude -p` + un Chromium headless. Con 4 GB, Chromium hace swap y una vuelta de 400 s pasa de los topes |
| **Disco** | **120 GB SSD** | 256 GB | `/root/loops` en el VPS son **72 GB medidos** para 15 loops; 5-9 worktrees ≈ 30-45 GB, + 2,1 GB de navegadores de Playwright + npm. **HDD no: `git status` sobre 13 GB de repo en disco mecánico se come la vuelta** |
| **Red** | Cualquier banda ancha | — | El tráfico es API + git. Lo que importa es que **esté**, no que sea rápida |

### Sistema operativo: **Linux nativo, no Windows, no WSL2**

> ⚠️ **ESTA SECCIÓN QUEDÓ DESACTUALIZADA — corregido 2026-09-04.** Contradice a la de
> arriba (*"Windows no se borra: Linux va adentro"*, §Máquina), que se escribió después y
> nunca reemplazó a esta. **Las dos estuvieron vivas en el mismo archivo**, que es justo
> lo que `CLAUDE.md §2` prohíbe: *"un tema = un archivo... si cambia, se EDITA"*. Con eso,
> cualquier sesión que leyera este doc elegía al azar entre formatear y no formatear.
>
> **Lo que se hizo de verdad el 2026-09-04: WSL2 con Ubuntu 26.04.** Está instalado,
> con `systemd`, y corrió dos vueltas completas de loop (`web-factory-dev` 698 s exit 0,
> `web-venta` 995 s exit 0, esta última disparada sola por `cron`). Estado y detalle en
> [`handoff/onia-dev-node-setup.md`](handoff/onia-dev-node-setup.md).
>
> **Lo que sigue siendo cierto de esta sección es el punto 3**, y hay que tomarlo en
> serio: WSL no arranca solo. La pieza que lo resuelve existe y está sin aplicar en
> [`scripts/loops/homelab-wsl-arranque.ps1`](../../scripts/loops/homelab-wsl-arranque.ps1).
> **Mientras eso no se aplique, este nodo tiene el `crontab` perfecto y no corre.**

Si la PC tiene Windows, la recomendación era **formatear e instalar Ubuntu Server 24.04 LTS**
(sin escritorio: ahorra ~1 GB de RAM y no hay nada que mirar en esa máquina).

Por qué, en orden de peso:

1. **Los loops ya se fueron de Windows una vez, por esto exactamente.** Las tareas programadas
   de la app de Claude Code **solo disparan cuando la app está quieta**: el 2026-09-01 tres loops
   tenían el mismo `lastRunAt` al milisegundo — la ráfaga de recuperación al abrir la app — y
   desde entonces ninguno había corrido (`scripts/loops/README.md`). Volver a Windows es volver
   a ese bug.
2. **El corredor es bash con `flock`, `timeout`, `crontab` y rutas `/root/...`.** En Linux corre
   **sin un solo cambio** (por eso el instalador replica las rutas del VPS).
3. **WSL2 sirve para probar, no para producción sin gente.** Su `cron` no arranca solo con
   Windows, se apaga con la sesión del usuario, y suspende la VM por inactividad. Se puede
   forzar todo eso — y ahí ya se está manteniendo Windows *más* Linux en vez de solo Linux.

**Si Sergio prefiere no formatear** (la PC tiene otra cosa que usa): WSL2 con Ubuntu, `systemd`
encendido en `/etc/wsl.conf`, la tarea de Windows que arranca `wsl -d Ubuntu` al iniciar sesión,
y desactivar la suspensión. Funciona; hay que aceptar que es más frágil.

### Qué instalar

```bash
sudo apt update && sudo apt install -y git openssh-client rsync cron util-linux curl ca-certificates
# ⚠️ Agregado 2026-09-04: **ffmpeg**. No es requisito duro, pero sin el los carriles que
# tocan video gastan una vuelta entera descubriendolo — le paso a `tendencias`: el unico
# ffmpeg de la maquina era el de Playwright, que solo graba WebM y no decodifica h264.
sudo apt install -y ffmpeg
# Utiles de trabajo, no requisitos: busqueda rapida, JSON, monitor, sesiones, compilador
# (varios paquetes de npm compilan codigo nativo al instalarse y sin esto fallan feo).
sudo apt install -y ripgrep jq htop tmux build-essential
# ⚠️ Corregido 2026-09-04: NO hace falta NodeSource. El instalador exige `-ge 20`
# (instalar-homelab.sh:86), no "= 20", y Ubuntu 26.04 trae **Node 22 firmado** en su
# propio catalogo. Un repositorio externo menos y una clave de firma menos que mantener.
#   sudo apt install -y nodejs npm
# La linea de abajo se conserva para una Ubuntu vieja cuyo `nodejs` sea < 20:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -   # solo si apt trae node < 20
sudo apt install -y nodejs
sudo npm i -g @anthropic-ai/claude-code
sudo claude          # /login con la suscripción de Sergio — NO con API key
```

Playwright **solo si se muda algún loop que abra pantallas**. De la primera tanda, ninguno lo
necesita (`web-venta` verifica con `curl`). Si después hace falta:

```bash
sudo npm i -g playwright && sudo npx playwright install --with-deps chromium   # ~2,1 GB
```

### Consumo eléctrico

Una PC de escritorio vieja prendida 24/7, sin monitor, con la carga de estos loops
(mayormente esperando a la red): **35-70 W**, según si tiene disco mecánico y placa de video
dedicada. Sacar la placa de video si no se usa baja 15-20 W.

A 24 h × 30 días: **~25-50 kWh/mes**. A tarifa residencial boliviana (≈ Bs 0,90/kWh en el tramo
en que caería este consumo) son **Bs 23-45 al mes**. Es menos de lo que costaría subir el plan
del VPS, y bastante menos que una hora de trabajo.

Un mini-PC o una laptop vieja consumen 10-25 W (Bs 7-16/mes) y son la mejor opción si hay
alguna a mano — una laptop además trae **UPS incorporada**: la batería aguanta un corte breve.

---

## 4. Memoria y tablero compartidos

Hoy los dos viven en el VPS:

- **Tablero**: SQLite con reclamo atómico, servido por el CLI de Hermes
  (`/usr/local/lib/hermes-agent/venv/bin/python`, verificado presente).
- **Memoria**: `/root/.hermes/memories/MEMORY.md` (90 KB hoy) + `USER.md`.

### La regla, en una línea

> **La PC de casa LEE copias y ESCRIBE por SSH. Nunca escribe esos archivos directamente.**

### Cómo funciona cada uno

**Tablero — ya está resuelto y no hay que hacer nada.** `scripts/kanban/tablero.sh` se escribió
justamente para usarse desde afuera ("*desde CUALQUIER lado — Windows con Git Bash, otra sesión,
o el VPS mismo — contra el MISMO tablero*"). Detecta si el CLI de Hermes está local; si no está,
sale por SSH. El cerrojo atómico se queda **en el VPS**, que es donde funciona. El instalador
deja un shim en `/root/bin/onia-tablero.sh` y los prompts no cambian ni una línea.

**Memoria, al leer.** El corredor pega `MEMORY.md` y `USER.md` arriba del prompt en cada vuelta.
La PC baja una **copia por rsync cada 15 minutos** (`onia-memoria-bajar.sh`). Si el VPS no
contesta, se conserva la copia anterior y la vuelta arranca igual: *un loop con memoria de hace
una hora trabaja; uno que no arranca, no.*

**Memoria, al escribir.** `onia-aprender.sh` se vuelve un shim SSH. El hecho aterriza en la
**bandeja del VPS** (`/root/.hermes/memories/inbox/`) y lo integra el consolidador de allá, que
es **uno solo y con `flock`**. La PC de casa nunca toca `MEMORY.md`.

### ¿Y si los dos escriben a la vez?

**No pueden.** El diseño lo hace imposible por construcción, no por disciplina: hay **un solo
escritor** de `MEMORY.md` en todo el sistema, y vive en el VPS. Quince loops locales y nueve
remotos son, para el consolidador, veinticuatro archivos en la misma bandeja.

🔴 **La alternativa tentadora es la que rompe: montar `/root/.hermes` por sshfs o NFS y dejar
que la PC escriba "como si fuera local".** No hacerlo. `flock` sobre un sistema de archivos de
red **no serializa de verdad** — falla en silencio o miente diciendo que consiguió el cerrojo. Y
este archivo ya sabe cómo se corrompe: el 2026-09-03, dos consolidadores que habían sacado la
foto de la bandeja *antes* del cerrojo metieron **una entrada vacía** en `MEMORY.md`
(`consolidar-memoria.sh`, línea del `PENDIENTES` re-tomado). Con el cerrojo funcionando bien.
Sobre red, ese modo de falla es el caso normal.

**El token de Telegram también se queda en el VPS**: `onia-tg.sh` es otro shim SSH. La PC de casa
no guarda ni un secreto.

---

## 5. Lo que ya está listo, sin la máquina

📄 **[`scripts/loops/instalar-homelab.sh`](../../scripts/loops/instalar-homelab.sh)** — se corre
en la PC de casa y deja todo andando. Verificado: sintaxis OK, guardas ejercitadas, parseo del
catálogo probado. **No se corrió en el VPS** (y se niega a correr ahí).

Hace, en orden, fallando fuerte en cada paso:

1. **Se niega a correr en el VPS** (detecta el CLI de Hermes), fuera de Linux, o sin root.
2. **Requisitos**: `git ssh rsync flock crontab node npm claude` + node ≥ 20 + la llave SSH. Si
   falta algo, dice **el comando exacto** para instalarlo.
3. **Conexión al VPS antes de clonar 13 GB**, y mide el ida y vuelta.
4. **Clon `--filter=blob:none`** (el completo son 13 GB medidos) + un worktree por loop, con la
   rama verificada — la misma comprobación que hace `onia-loop.sh` antes de gastar una sesión.
5. **Hook `pre-push`**: `main` bloqueado en este nodo. El integrador se queda en el VPS y **dos
   máquinas mergeando a `main` es la carrera que `CLAUDE.md` prohíbe.**
6. **Cuatro shims** (tablero, aprender, consolidar, telegram) + la bajada de memoria.
7. **Corredor y prompts desde `origin/main`**, reusando `sincronizar.sh` tal cual — con sus dos
   guardas anti-degradación ya probadas en producción. **Cero desplegadores nuevos.**
8. **Cron**, en un bloque con marca (idempotente, no toca otras líneas), con los horarios
   **desfasados** de los del VPS para no chocar en el mismo minuto.
9. **Humo**: SSH, tablero legible, GitHub, `claude` autenticado de verdad (le manda un prompt),
   memoria presente, corredor y prompts en disco, y aviso a Telegram. Si algo está en rojo,
   **sale con error** en vez de dejar loops corriendo a medias.

Se puede correr solo la verificación con `--prueba` (no instala nada).

**Por qué cron y no `systemd` timers:** un timer con `Persistent=true` "recupera" las corridas
perdidas mientras la PC estaba apagada — seis vueltas del mismo loop disparando juntas al
prender. **Es exactamente la ráfaga que hizo que estos loops se fueran de Windows.** Una vuelta
perdida se pierde; la siguiente llega a horario.

### Los pasos de Sergio, en orden

> **Estado al 2026-09-04.** Esto dejó de ser un plan y es una lista viva. Detalle,
> evidencia e intentos fallidos en [`handoff/onia-dev-node-setup.md`](handoff/onia-dev-node-setup.md).

| # | Qué | Dónde | Estado |
|---|---|---|---|
| 1 | Máquina: **8 GB RAM / 120 GB SSD** mínimo | físico | ✅ i5-12400F · 16 GB · 955 GB libres |
| 2 | ~~Instalar Ubuntu Server 24.04~~ → **WSL2 + Ubuntu 26.04 + `systemd`** | PC de casa | ✅ |
| 3 | BIOS: *Restore on AC Power Loss* → **Power On** | PC de casa | ⬜ pendiente |
| 3b | **Que WSL arranque solo y no se suspenda** ([`homelab-wsl-arranque.ps1`](../../scripts/loops/homelab-wsl-arranque.ps1)) | PC de casa | 🔴 **BLOQUEANTE** — script listo, sin aplicar |
| 4 | Tailscale en el VPS y en la PC, y `tailscale ping` en verde | los dos | ⬜ pendiente (no bloquea) |
| 5 | ~~Copiar `~/.ssh/onia_hermes_vps_ed25519`~~ → **generar una llave PROPIA** y autorizar su `.pub` | PC de casa | ✅ `homelab-onia-vps` |
| 6 | node ≥ 20 + `claude`, **`/login` con la suscripción** (no API key) — **también para `root`**, que es quien ejecuta | PC de casa | ✅ node 22 · claude 2.1.261 |
| 7 | Llave SSH de GitHub **de `root`** | PC de casa | ✅ `homelab-onia-github` |
| 8 | Instalador `--prueba`, y si está verde, sin `--prueba` | PC de casa | ✅ 14/14 verde |
| 9 | Una vuelta a mano y **mirar el log** | PC de casa | ✅ 2 vueltas completas, exit 0 |
| 10 | **Recién ahí**, sacar del `crontab` del VPS los loops mudados | VPS + `nodo-casa` | 🟡 **`web-venta` en curso el 06-sep**: nodo ✅ y tabla ✅ pusheada; falta que el integrador la lleve a `main` y caiga la línea del VPS. Los otros 4 están pausados y se mudan sin coreografía |
| 11 | Cerrar el puerto 22 público, con una sesión de respaldo abierta | VPS | ⬜ pendiente |

⚠️ **Dos correcciones al plan original, y las dos importan:**

- **Paso 5 — no se copia la llave, se genera una propia.** Una llave privada que viaja
  entre máquinas deja de ser de una máquina: si se filtra no sabés de cuál salió, y
  revocarla te deja afuera a vos también. Generando una por nodo, revocar es borrar una
  línea del `authorized_keys` y la laptop sigue entrando. Además el registro del VPS
  distingue quién se conectó — y este nodo se conecta **~144 veces por día** sólo para
  subir logs.
- **Paso 6 — `root` es el que ejecuta.** El instalador exige `id -u = 0` y escribe el
  `crontab` de root. `claude` instalado y logueado con el usuario normal **no lo ve**:
  otra casa, otro `PATH`, otras credenciales. Hay que instalarlo y loguearlo **dos veces**.

⚠️ **El paso 10 va después del 9, nunca antes.** Un loop apagado en el VPS y roto en casa es un
carril muerto que **no avisa** — el modo de falla que este sistema ya documentó tres veces.

### El paso 10 para `web-venta`, ejecutado — 2026-09-06

Es el primero de los cinco y el único de la primera tanda que **estaba corriendo**; los otros
cuatro están pausados, así que se mudan sin nada de esto.

🔴 **El orden correcto es NODO → TABLA → VPS, y no es el que parecía.** La primera versión de esta
receta decía *"VPS primero, nodo último"*, razonando sobre el minuto `:48` compartido. Ese orden
**se atasca solo**, y se descubrió al chocar con él.

**Los dos estados intermedios son ROJOS, y no son igual de graves.** El gate compara, para cada
máquina, sus filas de la tabla contra su `crontab`, en las dos direcciones:

| estado intermedio | qué ve el gate del VPS | consecuencia |
|---|---|---|
| **Se saca la línea del VPS primero** | 3 líneas de cron contra **4 filas `VPS`** en la tabla de `main` | 🔴 **Candado permanente.** Rojo ⇒ falla `npm test` ⇒ **el integrador deja de mergear** ⇒ la fila corregida no llega nunca a `main`. Sólo se destraba a mano |
| **La tabla llega a `main` primero** | 4 líneas de cron contra **3 filas `VPS`** | 🟡 Rojo también, **pero de segundos**: la línea sobrante se saca en cuanto la fila está en el checkout, y el integrador ya mergeó. La próxima corrida lo ve verde |

**La tabla sólo llega a `main` por el integrador, y el integrador necesita el gate del VPS en
verde.** De ahí sale todo: mientras la fila viaja, la línea del VPS **tiene que seguir puesta**.
Por eso el VPS es siempre lo ÚLTIMO, y por eso no hay ningún orden que evite el rojo: lo único
que se elige es cuál de los dos rojos, y cuánto dura.

**Paso 1 — el nodo** (`DESKTOP-0GGGNMF`, se reconoce por `/root/.onia-nodo`; la laptop
`DESKTOP-ENV6SDA` no lo tiene). Se teclea **en su propia terminal**, ya dentro de Ubuntu, con
`sudo`: el crontab de los loops es el de `root`. Idempotente y con guarda de máquina:

```
sudo sh -c '[ -f /root/.onia-nodo ] || { echo "ESTA NO ES nodo-casa"; exit 1; }; crontab -l > /root/crontab.antes-de-web-venta.txt 2>/dev/null; { crontab -l 2>/dev/null | grep -v "onia-loop\.sh web-venta"; echo "48 */2 * * * /root/bin/onia-loop.sh web-venta"; } | crontab -; cat /root/.onia-nodo; ls -l /root/bin/onia-loop.sh; git -C /root/loops/onia-hermes-web-venta branch --show-current; crontab -l | grep onia-loop'
```

**Sin redirección de log a propósito**: `onia-loop.sh` escribe él mismo en
`/var/log/onia-loop-<id>.log` (línea 255) y el rsync de los `*/10` lo sube a `/var/log/homelab/`
del VPS. Un `>>` agregado duplica la salida. Y las dos comprobaciones del final —corredor
ejecutable, worktree en su rama— no son adorno: sin ellas la línea queda puesta y el loop muere
a las `:48` con `exit 64`, en silencio.

**Paso 2 — la tabla**, sola: mover la fila de `web-venta` en [`cola/loops.md`](cola/loops.md) de
`**VPS**` a `**casa**`, **sin tocar el horario**, y pushear. Después hay que esperar al integrador
(`onia-cola`, `33 * * * *`, ~11 min de vuelta).

**Paso 3 — el VPS, disparado por la CONDICIÓN y no por un reloj.** Entre que el integrador mergea
y que se saca la línea, el VPS está en el rojo amarillo de la tabla de arriba: cuanto más corto,
mejor, y a mano se falla. Este centinela espera a que la fila esté en el checkout que el gate
lee, y recién ahí toca el `crontab`:

```bash
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 'bash -s' <<REMOTO
DOC=/root/loops/onia-hermes/hermes-content/docs/cola/loops.md
for i in $(seq 1 80); do
  if grep -q "web-venta. | \*\*casa\*\*" "$DOC" 2>/dev/null; then
    [ "$(crontab -l | grep -c "onia-loop\.sh web-venta")" = "1" ] || exit 3
    crontab -l > /root/crontab.antes-de-mudar-web-venta.txt
    crontab -l | grep -v "onia-loop\.sh web-venta" | crontab -
    sed -i "s|^# web-venta |web-venta |" /root/.config/onia/loops-remotos.txt
    cd /root/loops/onia-hermes && node scripts/loops_registrados.mjs; exit \$?
  fi
  sleep 30
done
echo "TIEMPO AGOTADO: no toque nada"; exit 1
REMOTO
```

El `sed` del final es la otra mitad que se olvida: **descomenta la línea de `web-venta` en
`/root/.config/onia/loops-remotos.txt`**, que es lo que hace que el vigía de loops remotos avise
si el nodo se muere. Sin eso, el loop se muda y **queda sin nadie mirándolo** — el modo de falla
más silencioso que tiene este sistema (§6).

*Listo =* gate verde en las **dos** máquinas, un `TERMINA` con `exit 0` en
`/var/log/onia-loop-web-venta.log` del nodo, y ese log llegando a `/var/log/homelab/` del VPS.

⚠️ **Lo que se acepta a cambio:** entre el paso 1 y el paso 3 las dos máquinas tienen la línea a
las `:48`. Si llegan a correr juntas, el segundo push a `claude/web-venta` se rechaza por
non-fast-forward: ruidoso y recuperable. Un gate rojo bloquea a los quince carriles y **no se
destraba solo**. Por eso se elige este riesgo y no el otro.

---

## 6. Riesgos y qué se pierde

### 🔴 El grande: si la PC se apaga, nadie se entera

El aviso de un loop caído sale por `onia-tg.sh`, que en la PC de casa es **un shim SSH al VPS**.
Si la PC está apagada, sin luz o sin internet, **el que tendría que avisar es justamente el que
no está**. Un loop que no corre no genera ninguna señal: es silencio, igual que un loop sano que
todavía no le tocó.

Es el mismo agujero que ya se pagó con `contenido-cola`: *"se apagaba con la laptop, nada lo
reponía y nada avisaba — el modo de falla más silencioso que tiene el sistema"*.

**Se tapa desde el VPS, no desde casa** — y ya está tapado.

✅ **Hecho el 2026-09-04: [`scripts/loops/vigia-loops-remotos.sh`](../../scripts/loops/vigia-loops-remotos.sh)**,
desplegado en el VPS como `/root/bin/onia-vigia-loops-remotos.sh` y en cron `4,34 * * * *`.
Mide el último `ARRANCA` de cada loop mudado y avisa si pasaron más de **dos cadencias**.

🔴 **La línea de cron LLEVA `ONIA_TG_DIRECTO=1`, y no es un detalle — sin eso el vigía es
decorativo.** Corregido en vivo el 2026-09-21 después de pagarlo: desde que `onia-tg.sh`
cambió (2026-09-08) su camino por defecto **no manda a Telegram, crea una tarea del
tablero**, y el tablero **lo leen los loops**. O sea que el aviso de *«los loops están
muertos»* se le entregaba a los loops muertos. El 19-sep a las 21:34 UTC el vigía detectó
bien la caída, dejó sus tres avisos… y nadie los vio durante 48 h. La línea correcta es:

```
4,34 * * * * ONIA_TG_DIRECTO=1 ONIA_LOG_DIR=/var/log/homelab /root/bin/onia-vigia-loops-remotos.sh >> /var/log/onia-vigia-loops-remotos.log 2>&1
17,47 * * * * ONIA_TG_DIRECTO=1 ONIA_LOOPS_REMOTOS=/root/.config/onia/loops-vps.txt ONIA_VIGIA_ESTADO=/var/lib/onia-vigia-vps ONIA_VIGIA_MAQUINA="el VPS" /root/bin/onia-vigia-loops-remotos.sh >> /var/log/onia-vigia-vps.log 2>&1
```

**La regla general, que aplica a cualquier vigía que se escriba después:** un aviso se
convierte en tarea del tablero **sólo si un loop puede arreglarlo**. «La máquina que corre
los loops está muerta» no lo puede arreglar ningún loop — eso va DIRECTO, siempre.

⚠️ Y el log de este script **está en 0 bytes cuando todo funciona**: no escribe a stdout en
el camino feliz. Un log vacío acá NO prueba que no corrió — para eso se miran sus marcas en
`/var/lib/onia-vigia-remotos/` y el registro `/var/log/onia-tg.log`.

- **La lista es explícita**, en `/root/.config/onia/loops-remotos.txt` (`<id> <cadencia-en-minutos>`).
  Sin archivo o con todo comentado —que es como quedó hoy— **no hace nada y sale 0**. Se
  descomenta la línea de cada loop el día que sale del crontab del VPS, en el paso 10.
- **La cadencia que se escribe ahí es el HUECO MÁS GRANDE entre dos corridas, no el promedio.**
  `marca-personal` corre 13:59 y 21:59: su hueco grande son 16 h, no 8. Poner el promedio hace
  que el vigía grite todas las noches, y una alarma que grita sin razón se apaga sola en la
  cabeza del que la lee.
- **Distingue el apagón del loop caído**, que es la mitad del valor: si están callados **todos
  a la vez** manda **un** mensaje ("la PC no da señales"); si es **uno solo** mientras los otros
  llegan, dice que ese loop está callado y que la PC está viva. Un aviso por episodio, y uno de
  recuperado cuando vuelve — el patrón de `vigia-disco.sh`.

### 🔴 Lo que este vigía NO puede ver, y por eso no lo dice

Los logs de un loop mudado llegan al VPS **por rsync desde la PC de casa** (línea de cron que
pone el instalador, cada 10 min). Si ese rsync se corta pero el loop sigue corriendo bien, desde
el VPS se ve **exactamente igual** que un loop muerto: silencio. **No se puede distinguir.**

Por eso los avisos dicen *"no llegan sus registros"* y nunca *"está caído"*: la única lectura
honesta de un silencio es que no hay noticias. El que lo reciba tiene que mirar la PC — el vigía
acota el problema a esa máquina, no lo diagnostica.

### 🔴 El segundo punto ciego, y este ya pasó: **un nodo que corre código viejo**

El vigía de arriba responde *"¿el loop está dando vueltas?"*. No responde *"¿está dando vueltas
con el código de hoy?"*. Son preguntas distintas y la segunda falla en silencio.

**Medido el 2026-09-05**, con el nodo instalado el día anterior:

| qué | estado real |
|---|---|
| el cron de sincronización | fallaba con `Permission denied` **en cada vuelta**, desde la instalación |
| el repo del nodo | **97 commits atrás** de `origin/main` |
| los prompts desplegados | congelados en los del 2026-09-04 22:45 |

Dos causas independientes, y ninguna hace ruido:

1. `sincronizar.sh` está como `100644` en git y la línea de cron lo invocaba **por ruta**, sin
   `bash`. La instalación no lo nota porque ahí sí se corre con `bash` y sale verde: **la prueba
   de humo pasa y lo único que falla es el trabajo repetido.**
2. El script que arregla eso es el mismo que está desactualizado. Un nodo atrasado no se puede
   poner al día solo.

**Y lo mismo le pasó al VPS, por otra vía:** la guarda que protege los shims del nodo buscaba su
marca en el archivo destino entero, y esa marca aparece en el código de la propia guarda — así
que `sincronizar.sh` se negaba a desplegarse a sí mismo. El sync del VPS quedó congelado desde
las 00:43 y cada vuelta horaria loggeó *"conservado (shim del nodo de casa)"* **en el VPS**,
donde no hay ningún nodo de casa. Quince horas de un mensaje absurdo que nadie leyó.

**La regla que sale de acá:** encender un loop en una máquina sin verificar antes qué versión del
prompt tiene desplegada es peligroso, no sólo desprolijo. Los prompts viejos no traen el **paso 0**
del *Chequeo de arranque*, así que comparan contra las filas `VPS` — y su paso 3 **reinstala lo
que falte**. Un loop con el prompt viejo corriendo en la PC de casa le habría instalado ahí los
diez crons del VPS. Antes de encender:

```bash
grep -c "En qué máquina estás" /root/bin/loops/<id>.md   # tiene que dar 1
```

### Los otros

| Riesgo | Tamaño real |
|---|---|
| **Latencia hacia el VPS** | Cada `tablero.sh list` y cada `aprender.sh` es un SSH nuevo. En Bolivia, contra un VPS de Hostinger, ~150-300 ms por viaje. Un prompt hace 3-6 llamadas: **1-2 s por vuelta** sobre vueltas de 400-1.500 s. Ruido. El instalador lo mide y lo reporta |
| **Internet de casa caído** | Los loops arrancan, fallan y no avisan (arriba). Commitean local; el trabajo no se pierde, se atrasa |
| **Cuota de Claude** | **Sigue igual.** Ver §0. Es lo primero que hay que decidir |
| **Dos nodos, dos verdades del corredor** | `sincronizar.sh` despliega desde `origin/main` en los dos: si `main` va atrás, las guardas frenan el sync **en cada nodo por separado**. Ahora hay dos lugares donde mirar cuando un prompt no se enciende |
| **Disco de casa** | 72 GB medidos para 15 loops. Un worktree por loop crece; `scripts/loops/aligerar-worktrees.sh` existe justamente por esto y hay que correrlo también acá |
| **Seguridad** | **Mejora**: se cierra el 22 público del VPS y ningún secreto baja a la PC. **Empeora**: hay una llave con acceso `root` al VPS en una máquina de casa. Mitigación: una llave **propia** del homelab (no la de Sergio), restringida por `from=` en `authorized_keys` a la IP del tailnet |

---

## Resumen

- **6 loops se quedan** en el VPS (base, deploy, contenedores, instrumento calibrado);
  **5 se mudan ya**; **4 más con una decisión previa cada uno**.
- **Tailscale**, porque es la única que atraviesa CGNAT sin un demonio que vigilar y la única
  que permite **cerrar el puerto 22** del VPS.
- **Ubuntu Server nativo, 8 GB RAM, 120 GB SSD, ~Bs 25-45/mes de luz.** Windows no: estos loops
  ya se fueron de ahí por un bug del planificador.
- **Un solo escritor de la memoria y un solo tablero**, los dos en el VPS; la PC lee copias y
  escribe por SSH.
- 🔴 **Esto arregla el disco (85 % usado, 72 GB de loops) y los picos de CPU. NO arregla la
  cuota de Claude** — esa es de la cuenta, no de la máquina.
- ✅ **El vigía que avisa si la PC de casa se calla ya existe** y corre en el VPS cada 30 min
  (§6). Está en silencio hasta que se le declare el primer loop mudado, así que el paso 10 ya
  no está bloqueado — pero se descomenta la línea del loop en la lista **en el mismo momento**
  en que se lo saca del `crontab` del VPS, no después.

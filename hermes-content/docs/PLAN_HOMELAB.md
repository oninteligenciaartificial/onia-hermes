# Mudar los loops de desarrollo a una PC de casa

**Objetivo:** que el VPS quede para lo que usan los clientes, y que el trabajo de desarrollo
—los loops de carril— corra en una PC vieja de Sergio.

Todo lo medido acá se midió **en vivo el 2026-09-04** contra `187.77.16.63`, no de memoria.
El script que ejecuta este plan es [`scripts/loops/instalar-homelab.sh`](../../scripts/loops/instalar-homelab.sh).

---

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

Si la PC tiene Windows, la recomendación es **formatear e instalar Ubuntu Server 24.04 LTS**
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
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -   # node 20, igual que el VPS (v20.20.2)
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

| # | Qué | Dónde |
|---|---|---|
| 1 | Decidir la máquina y verificar que llegue a **8 GB RAM / 120 GB SSD** | físico |
| 2 | Instalar **Ubuntu Server 24.04 LTS** | PC de casa |
| 3 | BIOS: *Restore on AC Power Loss* → **Power On** | PC de casa |
| 4 | Tailscale en el VPS y en la PC, y `tailscale ping` en verde | los dos |
| 5 | Copiar `~/.ssh/onia_hermes_vps_ed25519` a `/root/.ssh/` (`chmod 600`) | PC de casa |
| 6 | Instalar node 20 + `claude`, y hacer **`/login` con la suscripción** (no API key) | PC de casa |
| 7 | Clave SSH de GitHub con permiso de push a las ramas de carril | PC de casa |
| 8 | Correr el instalador con `--prueba`, y si está verde, sin `--prueba` | PC de casa |
| 9 | Una vuelta a mano (`/root/bin/onia-loop.sh web-factory-dev`) y **mirar el log** | PC de casa |
| 10 | **Recién ahí**, sacar del `crontab` del VPS los loops mudados | VPS |
| 11 | Cerrar el puerto 22 público, con una sesión de respaldo abierta | VPS |

⚠️ **El paso 10 va después del 9, nunca antes.** Un loop apagado en el VPS y roto en casa es un
carril muerto que **no avisa** — el modo de falla que este sistema ya documentó tres veces.

---

## 6. Riesgos y qué se pierde

### 🔴 El grande: si la PC se apaga, nadie se entera

El aviso de un loop caído sale por `onia-tg.sh`, que en la PC de casa es **un shim SSH al VPS**.
Si la PC está apagada, sin luz o sin internet, **el que tendría que avisar es justamente el que
no está**. Un loop que no corre no genera ninguna señal: es silencio, igual que un loop sano que
todavía no le tocó.

Es el mismo agujero que ya se pagó con `contenido-cola`: *"se apagaba con la laptop, nada lo
reponía y nada avisaba — el modo de falla más silencioso que tiene el sistema"*.

**Se tapa desde el VPS, no desde casa**, y es una sola cosa: un cron en el VPS que revise la
marca de tiempo del último `ARRANCA` de cada loop mudado y avise si pasó más de dos cadencias.
El VPS ya tiene el patrón hecho (`hermes-vigia.sh`, `vigia-disco.sh`).

> **Pendiente, no hecho.** No se construyó en esta sesión — el objetivo era el plan y el
> instalador. **No mudar el paso 10 (apagar los loops en el VPS) hasta que este vigía exista**,
> o se está cambiando un problema de CPU por un problema de silencio.

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
- 🔴 **Falta el vigía en el VPS que avise si la PC de casa se calla.** Sin eso, no apagar los
  loops mudados del `crontab` del VPS.

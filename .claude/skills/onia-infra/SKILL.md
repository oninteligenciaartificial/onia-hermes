---
name: onia-infra
description: Cargar ANTES de tocar el VPS, Docker, n8n o cualquier cosa por SSH. Diagnostico cuando docker no responde, las trampas de shell que ya nos mordieron, y como se lee de verdad la carga de la maquina.
---

# Infra de ONIA — el VPS, Docker y SSH

> Este carril es el del conocimiento mas caro y hasta el 2026-08-27 vivia solo en memorias
> sueltas. Cada regla lleva el caso real que la origino: una regla sin su historia se
> desobedece.
>
> **El deploy DEL PRODUCTO no vive aca**: eso es la skill `onia-deploy` en
> `onia-platform/.claude/skills/`. Aca esta la capa de abajo — la maquina.

## Donde estamos parados

- **VPS de Hostinger, 187.77.16.63.** Easypanel es solo el panel. 4 vCPU, ~15 GB RAM.
- Llave: `~/.ssh/onia_hermes_vps_ed25519`.
- Ahi corre **todo**: `onia-platform` (el producto), `onia-landing`, Supabase self-hosted
  (`supabase-db`, `supabase-auth2`, `supabase-meta`, `supabase-studio`), n8n, Chatwoot, Postiz.
- 🔴 **`onia.com.bo` y `app.onia.com.bo` los sirve el VPS, NO Vercel.** Pushear a `main` **no
  publica nada**. La zona DNS real esta en **Cloudflare** (la de Vercel es un fantasma).

### Desde una sesion en la NUBE, el puerto 22 no sale (no es el VPS)

> Medido 2026-09-30 desde el contenedor en la nube: `/dev/tcp/187.77.16.63/22` → timeout, y
> **tambien `github.com:22`**; en cambio `187.77.16.63:443` responde. El proxy del contenedor
> acepta el `CONNECT …:22` (200) pero **no devuelve el banner SSH**: solo deja pasar HTTPS.
> Una sesion anterior lo anoto como "puerto del VPS bloqueado" y mandaba a tocar el firewall
> del VPS, que no tiene nada que ver.

- **No se arregla abriendo nada en el VPS** (el 22 ya esta abierto: la laptop entra).
- Lo que **si pasa** el proxy: HTTPS y **WebSocket** (`101 Switching Protocols` medido). Por
  eso el camino es **SSH por WebSocket**: Cloudflare Tunnel (`cloudflared` en el VPS, hostname
  `ssh.onia.com.bo` → `ssh://localhost:22`) protegido con **Cloudflare Access + service token**;
  en la nube, `ssh -o ProxyCommand="cloudflared access ssh --hostname %h --service-token-id … --service-token-secret …"`.
  La llave SSH se sigue exigiendo; el token se revoca en Cloudflare.
- ✅ **Funciona desde el 2026-09-30.** Túnel `onia-ssh`: `cloudflared` corre como servicio en el VPS y `ssh.onia.com.bo` apunta a `ssh://localhost:22`. Desde la nube se entra así (la llave sale del secreto del entorno):
  ```bash
  curl -fsSL -o /usr/local/bin/cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 && chmod +x /usr/local/bin/cloudflared
  mkdir -p ~/.ssh && printf '%s' "$ONIA_VPS_SSH_KEY_B64" | base64 -d > ~/.ssh/onia_vps && chmod 600 ~/.ssh/onia_vps
  ssh -i ~/.ssh/onia_vps -o ProxyCommand="cloudflared access ssh --hostname %h" root@ssh.onia.com.bo
  ```
  Verificado: `hostname` = `srv1360183`. ⚠️ Todavía **sin Cloudflare Access** delante, así que la protección es solo la llave SSH (igual que el 22 abierto). Pendiente: Access + service token.
- ⚠️ **El hook SessionStart que arma `ssh onia-vps` solo corre si la sesión abre DENTRO de `onia-hermes`.** Una
  sesión con los dos repos (Plataforma) abre en `/home/user`, no carga `.claude/settings.json` de `onia-hermes` y
  `ssh onia-vps` da «Could not resolve hostname» aunque las tres variables estén cargadas (medido 1-oct). No falta
  ninguna variable: `cd /home/user/onia-hermes && node scripts/nube-ssh-vps.mjs` y listo.
- **Qué más NO sale desde la nube (medido 1-oct):** YouTube bloquea la IP del contenedor (`yt-dlp` pide «no eres
  un robot», Chromium cae en `/sorry`); los videos se ven desde la PC. Los centros de ayuda Zendesk privados dan 403.
  `SendMessage` a otra sesión falla («this cloud session cannot message other sessions yet»): se contesta en el
  transcript propio y la madre lo lee. La web pública de terceros, en cambio, abre bien con `curl` y Playwright.

- **Playwright/Chromium desde la nube da `ERR_CERT_AUTHORITY_INVALID`** (medido 1-oct): el proxy re-firma TLS y
  Chromium no toma su CA. No se apaga la verificación. Se le pasa a Chromium la huella de la CA del proxy:
  ```bash
  SPKI=$(openssl x509 -in /root/.ccr/agent-proxy-ca.crt -pubkey -noout | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | base64)
  # chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: [`--ignore-certificate-errors-spki-list=${SPKI}`] })
  ```
  Con eso se miran onia.com.bo y app.onia.com.bo renderizadas (consola y capturas). El módulo `playwright` está en
  `/home/user/onia-platform/node_modules`: el script se corre desde ese repo.

### Publicar desde la nube (los dos comandos, medidos 1-oct)

- **Plataforma:** `ssh onia-vps 'nohup bash /opt/onia-platform/_deploy/publicar.sh > /tmp/pub.log 2>&1 &'`. Arma la
  imagen de `origin/master`, hace canary, swap y verificación; termina con «PUBLICADO Y VERIFICADO» y deja un
  contenedor `onia-platform-prev-*` para el rollback. Tarda unos 5 min.
- **Web onia.com.bo:** `bash /opt/onia-landing/_deploy/publicar.sh` (`--dry-run` primero). El cron
  `onia-publicar-solo` la FRENA si cambia «un número en una fuente de precio», aunque no sea un precio (pasó con el
  tope de usuarios de Crece). Si el número que cambia está aprobado, se corre este comando a mano.
- Los dos corren largos: lanzarlos con `nohup … &` o en background. Un `ssh` en primer plano se corta
  («Broken pipe») y el log en el VPS sigue igual.
- Cambiar el acceso de red del entorno a "Total" **puede no alcanzar**: el proxy sigue en el
  medio. Probarlo es gratis, pero no es la solucion garantizada.

---

## 1. Las trampas de shell que YA nos mordieron

Estas cuatro cuestan horas y no dan error: dan una respuesta **falsa con cara de verdadera**.

### `pgrep -f "patron"` se matchea A SI MISMO

Tu propia linea de comando contiene el patron, asi que `pgrep` la encuentra.

> Paso DOS veces el 2026-08-27: dijo "hay un build vivo" cuando no habia ninguno (y freno un
> deploy), y antes `pkill -9 -f "elasticsearch"` **mato mi propia sesion SSH**.

```bash
pgrep -af "[n]ext build"
PAT="elastic""search"; pkill -f "$PAT"
```

### El exit code de `cmd | tail` es de `tail`, NO del comando

`tail` casi siempre devuelve 0. Un build que murio te reporta exito.

> Paso DOS veces con `next build` el mismo dia.

```bash
npm run build > build.log 2>&1; echo "EXIT=$?"
```

### Los `.sh` llegan al VPS en CRLF y mueren SIN LOG

El shebang se lleva un `\r` pegado, el kernel busca ese interprete y falla con
`cannot execute: required file not found`. Sin ruido, sin log, y el cron parece andar.

```bash
sed -i 's/\r$//' script.sh
file script.sh    # DEBE decir "ASCII text executable", NO "with CRLF line terminators"
```

### El escapado anidado por heredoc de SSH destroza `$(...)`

`$(date)` llego convertido en `\1`. **No pelees con el escapado**: escribi el script local,
`scp`, y ejecutalo. Es lo que funciona siempre.

---

## 2. Cuando `docker` NO RESPONDE

Paso el 2026-08-23: `docker ps` colgado en 4 intentos (60 s, 90 s, 240 s, 280 s), cero salida,
con los contenedores corriendo igual. **Sin `docker` no hay deploy ni swap.**

**La API por socket contesta en milisegundos aunque el CLI cuelgue:**

```bash
curl --unix-socket /var/run/docker.sock http://localhost/v1.44/containers/json
curl --unix-socket /var/run/docker.sock http://localhost/v1.44/containers/<id>/json
```

- **Version minima `v1.44`** (Engine 29.2.1). `v1.43` responde "client version too old".
- **Lo lento es ENUMERAR** (`/containers/json`). Inspeccionar UNO es instantaneo.
- Si no sabes el id y enumerar cuelga, sacalo del cgroup del proceso:

```bash
grep -oE "docker-[0-9a-f]{64}" /proc/<pid>/cgroup
```

### `unless-stopped` resucita lo que mates

Matar el proceso no alcanza: Docker lo revive. Para que se quede abajo hay que
`POST /containers/<id>/stop`, o `docker update --restart=no`.

### `docker restart` NO relee `--env-file`

Cambiar variables = **recrear** el contenedor. Respalda el env viejo con `docker inspect` antes.

### n8n es Swarm: NO uses `docker restart`

Deja un zombi. Se actualiza con `docker service update --force`.

---

## 3. Leer la carga sin equivocarse

### `steal` vs `guest`: el orden de los campos

`/proc/stat` va: `user nice system idle iowait irq softirq` **`steal`** `guest guest_nice`.
Las columnas de `vmstat` terminan en `... st gu` — **leer por posicion es fragil**.

> El 2026-08-22 el soporte de Hostinger leyo mal esas columnas y afirmo `st=0, gu=94`.
> Contra `/proc/stat`: **steal 92,2% y guest 0,0%**. Lo aceptaron. Trae el dato crudo.

### Que significa steal alto

**`st` alto = el hipervisor te esta quitando el CPU.** No es tu carga: es el proveedor.
Con steal 93-96% sobre 4 vCPU, el load llego a 171 y **todas** las webs daban 522.

🔴 **La penalidad de Hostinger NO se levanta sola.** Hay que pedirla a un humano
("Maximum CPU resets reached"; la excepcion manual es una cada 7 dias). Un agente la levanto
a mano el 2026-08-22 y recien ahi: steal 95%→9%, load 171→1,2, login 9,3 s→0,39 s.

### Antes de culpar al proveedor, mira lo propio

Ese dia habia **tres causas nuestras** comiendo CPU:

- **ollama** con `qwen2.5:3b` al 193% de CPU durante 7 h 39 min (y con licencia NO comercial).
- **`supabase-meta`** filtrando **2.492 zombies**.
- **`supabase-studio`** con healthcheck `interval 5s` menor que `timeout 10s`: se apilaban infinito.

---

## 4. Builds en el VPS — un solo dueno

> Trampa pagada el 2026-08-22: dos deploys murieron por cortes de red y dejaron sus
> `npm install` corriendo; el tercero se sumo encima. Load 18, npm de 40 minutos, y el VPS
> entero dejo de responder hasta que Sergio lo reinicio desde el panel.

1. **Antes de buildear**: `pgrep -af "[n]pm install|[n]ext build"`. Si hay algo vivo, **PARA**.
2. **`free -g`**: con menos de ~6 GB disponibles, reportar antes de seguir.
3. **Siempre con `nohup`**: `nohup ./build.sh > build.log 2>&1 < /dev/null &`. Un corte de TU
   conexion no deja un build huerfano — sigue solo y se retoma leyendo el log.
4. **Un solo dueno de infra a la vez.** Si estas desplegando, n8n y Supabase son de SOLO
   LECTURA para los demas carriles.
5. **El CI de GitHub corre en ESTE VPS y cuenta como build.** Trampa pagada el 10-oct, 15:50 UTC: el cron dio
   «plataforma: FALLO» sin carpeta nueva en `releases/`. El detalle no estaba en un `build.log` sino en
   `/tmp/pub-plataforma.log`: «FATAL: hay otro build corriendo (next build / npm ci / docker build): no encimo otro».
   Entre las 15:30 y las 15:45 se subieron 7 ramas de PR; el runner es uno, cada CI tarda 20-45 min y la cola ocupó el
   VPS más de 2 h. Antes de un cron de publicación (minuto 50 de 00, 03, 06, 09, 12, 15, 18 y 21 UTC): nada de push ni
   merge desde una hora antes si la cola no está vacía. Se mira con `actions_list` → `list_workflow_runs` con
   `status: queued` e `in_progress`. Ante un «FALLO», leer primero `/tmp/pub-plataforma.log`.

---

## 4.b Las rutas de Traefik SOBREVIVEN al contenedor

> El 2026-08-27 encontramos **DOS dominios publicos sirviendo 502 desde hacia dias**:
> `cal.onia.com.bo` y `forms.onia.com.bo`. En los dos casos el contenedor habia
> desaparecido y **la ruta seguia publicada**. Nadie se entero porque nadie los mira.

Un `docker rm` no borra la ruta. El dominio queda vivo, con certificado valido, y
devuelve 502 hasta que alguien lo abre. **Publicar un dominio crea una deuda de
monitoreo que no se paga sola.**

Al levantar o bajar cualquier cosa con dominio propio:

```bash
# que rutas hay, y a que servicio apuntan
grep -oE 'Host\(`[^`]+`\)' /etc/easypanel/traefik/config/onia-manual-routes.yaml | sort -u
# y despues: TODOS esos dominios, no solo el que tocaste
for d in onia.com.bo app.onia.com.bo cal.onia.com.bo forms.onia.com.bo \
         center.onia.com.bo chat.onia.com.bo postiz.onia.com.bo; do
  curl -s -o /dev/null -w "  $d -> %{http_code}\n" --max-time 20 "https://$d"
done
```

**Antes de editar ese archivo**: backup con el patron que ya existe
(`onia-manual-routes.yaml.bak-<motivo>-<fecha>`), y validar que parsea ANTES de
escribir — ese archivo enruta TODOS los dominios y romperlo los tumba a todos.
Un redirect que quizas haya que revertir va **302, nunca 301**: el permanente lo
cachea el navegador y despues no hay vuelta atras sin limpiar cache del usuario.

## 4.c Next standalone indexa `public/` al ARRANCAR

> El 2026-08-27: el PDF de un lead magnet daba 404. Se copio al bind mount, el contenedor
> lo veia (`ls` lo mostraba, `head -c 4` devolvia `%PDF`), permisos correctos... y Next
> seguia devolviendo 404 **incluso con cache-buster**.

Poner un archivo en `public/` de un Next standalone **no alcanza**: hay que **reiniciar el
contenedor** para que lo tome. Un `ls` desde adentro demostrando que el archivo esta ahi
NO prueba que se sirva.

```bash
docker restart onia-landing && sleep 12
curl -s -o /dev/null -w "%{http_code} %{content_type}
" "https://onia.com.bo/recursos/x.pdf?cb=$(date +%s)"
```

⚠️ Y el arreglo **no dura si solo se toca el runtime**: el deploy pisa `runtime-next`
entero. El archivo tiene que ir a la FUENTE que construye ese sitio. Para `onia-landing`
la fuente es **`web-factory/apps/onia-platform/public/`** del repo `onia-hermes` — nombre
confuso: `apps/onia-platform` dentro de web-factory es la LANDING, no el producto. El
producto es el repo `onia-platform`, y su `/recursos` esta detras de login (307).

## 4.d La API de n8n: cual es la key de verdad

En `/opt/onia-platform/app.env` hay **dos** variables que parecen la misma cosa:

| Variable | Que es | Sirve para la API? |
|---|---|---|
| `N8N_API_KEY` | 64 chars, NO es un JWT | ❌ devuelve **401** |
| **`N8N_MANAGEMENT_API_KEY`** | JWT de 267 chars | ✅ **esta es** |

Una API key de n8n **siempre es un JWT**: empieza con `eyJ` y tiene dos puntos. Si el
valor no tiene esa forma, no es una key de n8n por mas que se llame asi.

```bash
curl -s -H "X-N8N-API-KEY: $KEY"   https://n8n-sergio-n8n.hqdqgh.easypanel.host/api/v1/workflows?limit=1
```

Editar un workflow por API: `GET /api/v1/workflows/<id>`, modificar, y `PUT` mandando
**solo** `name`, `nodes`, `connections`, `settings` (los demas campos los rechaza).
Guardar el JSON original a un archivo ANTES: n8n tiene historial de versiones, pero un
archivo no depende de que la UI abra.

⚠️ El MCP de n8n **no** acepta un array de operaciones JSON para `update_workflow`:
espera **codigo del SDK** (un subconjunto restringido de TypeScript). Para un cambio
quirurgico sobre un workflow existente, la API REST es mas segura — reescribir 14 nodos
en SDK arriesga perder un nodo Code grande.

## 5. Verificar contra el sistema CORRECTO

Estos dieron diagnosticos falsos con evidencia que parecia buena:

- **`localhost:3000` en el host NO es `onia-platform`**: es el panel de Easypanel
  (docker-proxy). Un smoke ahi devuelve resultados de OTRO sistema. Verifica contra
  `https://app.onia.com.bo`.
- **El firewall corta contenedor↔contenedor en el 3000, pero el HOST si llega.** Un `curl`
  exitoso desde el host NO prueba que otro contenedor alcance el servicio.
- **Un chunk viejo puede dar 200 y estar bien**: `_next/static` va con `cache-control:
  immutable` detras de Cloudflare. Pedilo con cache-buster (`?cb=$(date +%s)`) y mira
  `cf-cache-status`: `HIT` explica el 200, `BYPASS` dice la verdad.
- **El login NO prueba la base**: entra por Supabase Auth via HTTPS, no por Prisma.
- La base de produccion es la **self-hosted del VPS** (`supabase-db`, schema `public`), no la nube.

---

## 6. n8n y secretos

- **NUNCA hardcodear un secreto en un nodo.** Orden: credencial de n8n > `$env` > nada.
  `$env.VARIABLE` **SI funciona** en `n8n-sergio_n8n` (verificado en vivo; hay otra instancia
  apagada — no las confundas).
- **Exportar workflows al repo trae los secretos en claro.** Redactar con un patron por CADA
  proveedor antes de commitear: asi se escapo una clave de Resend a GitHub. El respaldo crudo
  va FUERA del repo.
- **Jamas pegar un `service_role` en un nodo**: salta el RLS entero.
- **El nodo de Telegram fuerza Markdown**: un guion bajo suelto y el mensaje NO llega. Usar HTML.
- ⚠️ **`neverError` en un nodo convierte un rechazo de la API en una ejecucion "success".**
  Encontrado el 2026-08-27 en el circuito comentario→DM: cinco rechazos seguidos de Meta
  quedaron como exito y el aviso de Telegram salio igual, con el error adentro. **Una ejecucion
  verde no prueba que el efecto haya ocurrido** — hay que leer la respuesta del proveedor.
- **Contar, no citar.** Un dato heredado sobre n8n no se ejecuta sin recontarlo: ya paso que
  "quedan 2 workflows" eran **44 ACTIVOS**, y que un workflow "vivo" estaba apagado con otros
  tres homonimos al lado.

---

## Verificacion minima al terminar

Nada de "deberia andar". Antes de decir listo:

```bash
curl -s -o /dev/null -w "%{http_code} en %{time_total}s\n" https://app.onia.com.bo/login
docker logs --since 5m onia-platform 2>&1 | grep -icE "error|fatal"
uptime
```

Y si es una pantalla de cliente, **abrila y MIRALA renderizada** (Playwright headless; el pane
del navegador no compone frames en sesion no interactiva). Un 200 y un `grep` no son verificacion.

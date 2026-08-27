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

---

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

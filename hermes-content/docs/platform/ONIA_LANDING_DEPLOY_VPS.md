# Onia Landing — Deploy VPS (runbook)

Landing de venta de Onia Platform (`web-factory/apps/onia-platform`), autohospedada
en el VPS (`187.77.16.63`, Easypanel). Verificado en vivo 2026-08-01.

**No confundir con el producto.** El contenedor `onia-platform` que ya corre en el VPS
es el DASHBOARD del producto (DentaGest/Onia Platform app, host `app.onia.com.bo`).
Este runbook despliega la LANDING de venta (marketing, host `onia.com.bo`), un
contenedor y una carpeta totalmente distintos: `onia-landing` / `/opt/onia-landing`.
**Nunca tocar `onia-platform` desde este runbook.**

---

## Estado verificado (2026-08-01)

- Contenedor: `onia-landing`, imagen `node:20-alpine`, corre `node apps/onia-platform/server.js`.
- Puerto publicado: `8091:3000` (mientras no hay DNS, se prueba por IP+puerto).
- Ruta Traefik agregada (archivo, no labels): `onia.com.bo` y `www.onia.com.bo` →
  servicio `onia-landing-manual` → `http://onia-landing:3000/`.
- **DNS de `onia.com.bo` y `www.onia.com.bo` TODAVÍA apunta a Vercel** (`216.198.79.1`,
  `64.29.17.1` / `64.29.17.65`), no al VPS. Por eso Let's Encrypt no puede emitir el
  certificado todavía (se ve en `docker logs` del traefik: `403 ... /.well-known/acme-challenge/... 404`).
  Esto es esperado y no requiere acción: apenas Sergio mueva el DNS a `187.77.16.63`,
  Traefik reintenta solo y emite el certificado sin tocar nada más.

### URL que funciona HOY

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://187.77.16.63:8091/
# 200
```

### URL que va a funcionar cuando Sergio cambie el DNS (sin tocar nada más)

```
https://onia.com.bo/
https://www.onia.com.bo/
```

Verificable ya mismo con Host header (bypassea DNS, prueba que la ruta Traefik
está bien armada):

```bash
curl -sk -o /dev/null -w "%{http_code}\n" -H "Host: onia.com.bo" https://187.77.16.63/
# 200
```

---

## Por qué el build tiene que ser en el VPS (no en Windows)

`web-factory` es un monorepo pnpm. `apps/onia-platform/next.config.ts` ya tiene
`output: "standalone"` + `outputFileTracingRoot` apuntando a la raíz del monorepo.
El build standalone local en Windows falla con `EPERM` por symlinks — hay que
buildear en el VPS (Linux).

**Con Turbopack el bundle standalone rompe** (sufijo hash en cada módulo externo →
500 en todas las rutas). En Next 15.5.19, `next build` (sin flags) **ya usa webpack
por defecto** — el flag `--webpack` no existe en este CLI (`next build --help` no lo
lista). Lo que hay que evitar es pasar `--turbo`/`--turbopack`, que no está en el
script `build` de `apps/onia-platform/package.json`. No hace falta ningún flag extra.

---

## Redeploy — pasos exactos

### 0. Empaquetar y subir el fuente (si cambió desde el último deploy)

Desde Windows (git-bash), en la raíz del repo:

```bash
cd "C:\dev\proyectos\onia-hermes"
tar -czf /tmp/wf-src.tgz \
  --exclude='web-factory/**/node_modules' \
  --exclude='web-factory/**/.next' \
  --exclude='web-factory/**/.git' \
  web-factory
scp -i ~/.ssh/onia_hermes_vps_ed25519 /tmp/wf-src.tgz root@187.77.16.63:/tmp/wf-src.tgz
```

Si ya subiste el tarball antes y no cambiaste código de la landing, podés reusar el
que está en `/tmp/wf-src.tgz` en el VPS — pero verificá que sea reciente
(`ls -la /tmp/wf-src.tgz` en el VPS) antes de confiar en él.

### 1. Extraer e instalar dependencias (en el VPS)

```bash
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63

rm -rf /root/wf-build
mkdir -p /root/wf-build
tar -xzf /tmp/wf-src.tgz -C /root/wf-build

cd /root/wf-build/web-factory
pnpm install --filter onia-platform... --frozen-lockfile
```

`--filter onia-platform...` instala solo lo que necesita esta app (rápido, liviano
en RAM — el VPS tiene poca RAM libre y ya usa swap).

### 2. Build

```bash
cd /root/wf-build/web-factory/apps/onia-platform
NODE_OPTIONS=--max-old-space-size=2048 npx next build
```

Confirmá en el output que dice `Compiled successfully` y lista las rutas
(`/`, `/empezar`, `/patrones`, `/privacidad`, `/terminos`). Si compila con
Turbopack por error vas a ver rutas devolviendo 500 después — no debería pasar
porque el script no pasa `--turbopack`, pero si algo cambia revisar
`package.json` → `scripts.build`.

### 3. Armar el standalone (copiar `public/` y `.next/static/` a mano)

Next NO copia esto solo — hay que hacerlo manual siempre:

```bash
cd /root/wf-build/web-factory/apps/onia-platform
cp -r public .next/standalone/apps/onia-platform/public
mkdir -p .next/standalone/apps/onia-platform/.next/static
cp -r .next/static/* .next/standalone/apps/onia-platform/.next/static/
```

### 4. Copiar el árbol COMPLETO de `.next/standalone` (no solo la subcarpeta de la app)

**Trampa pagada en este deploy:** en un monorepo, `next` y otras deps quedan
hoisted en `node_modules/` de la RAÍZ de `.next/standalone` (vía symlinks
relativos `../../../node_modules/.pnpm/...` desde
`apps/onia-platform/node_modules/next`). Si copiás solo
`.next/standalone/apps/onia-platform/` y la montás como `/app`, el `require('next')`
rompe con `Cannot find module 'next'` porque el symlink relativo apunta afuera del
árbol copiado.

**Hay que copiar `.next/standalone` entero** (raíz + `apps/onia-platform/` adentro),
preservando la estructura:

```bash
rm -rf /opt/onia-landing/runtime-next.new
cp -r /root/wf-build/web-factory/apps/onia-platform/.next/standalone \
  /opt/onia-landing/runtime-next.new

# swap
docker rm -f onia-landing 2>/dev/null
rm -rf /opt/onia-landing/runtime-next
mv /opt/onia-landing/runtime-next.new /opt/onia-landing/runtime-next
```

### 5. Levantar el contenedor

```bash
docker run -d --name onia-landing \
  --restart unless-stopped \
  --network easypanel \
  -p 8091:3000 \
  --env-file /opt/onia-landing/app.env \
  -v /opt/onia-landing/runtime-next:/app \
  -w /app \
  node:20-alpine node apps/onia-platform/server.js
```

`--env-file /opt/onia-landing/app.env` (ya existe en el VPS) contiene:

```
PORT=3000
HOSTNAME=0.0.0.0
NODE_ENV=production
```

Sin secretos: la landing no usa Supabase ni ninguna API — solo
`NEXT_PUBLIC_WA_PHONE` (opcional, cae a un fallback hardcodeado en `src/lib/site.ts`)
y `NEXT_PUBLIC_CAL_BASE` (opcional, cae a `https://cal.onia.com.bo/onia`). Si alguna
vez hay que cambiar esos valores, **son `NEXT_PUBLIC_*` → se hornean en build time**,
hay que agregarlos a `app.env` ANTES de correr `npx next build` en el paso 2 (export
en el shell) y reconstruir, no alcanza con cambiar `app.env` y reiniciar el contenedor.

⚠️ `docker restart onia-landing` NO relee `app.env`. Si cambiás env vars, hay que
recrear el contenedor (`docker rm -f` + `docker run` de nuevo).

### 6. Verificar

```bash
docker ps --filter name=onia-landing
docker logs onia-landing --tail 20
# debe decir "✓ Ready in <n>ms", sin stack traces

curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8091/          # 200, en el VPS
curl -s -o /dev/null -w "%{http_code}\n" http://187.77.16.63:8091/       # 200, desde afuera
curl -sk -H "Host: onia.com.bo" -o /dev/null -w "%{http_code}\n" https://187.77.16.63/   # 200, prueba la ruta Traefik
```

Chequeo de contenido real (no la versión vieja de Vercel):

```bash
curl -s http://187.77.16.63:8091/ | grep -o '<title>[^<]*</title>'
# <title>Onia — El sistema con IA que maneja tu negocio completo</title>
```

### 7. Limpieza (opcional, libera RAM/disco)

```bash
rm -rf /root/wf-build
```

El runtime queda solo en `/opt/onia-landing/runtime-next` (~5 MB, standalone ya
trae únicamente lo que usa).

---

## Ruta Traefik — dónde vive y qué se agregó

Archivo (edición por archivo, **NO labels de Docker** — así enruta este VPS):
`/etc/easypanel/traefik/config/onia-manual-routes.yaml`

Entrypoints en este VPS: `http` y `https` (no `web`/`websecure` — verificar antes
de copiar ejemplos de otros VPS de Easypanel).

Se agregaron, sin tocar las rutas existentes (`cal.`, `center.`, `app.`, `/supabase`):

- Routers: `http-onia-com-bo-manual`, `https-onia-com-bo-manual`,
  `http-www-onia-com-bo-manual`, `https-www-onia-com-bo-manual`
- Service: `onia-landing-manual` → `http://onia-landing:3000/`

Antes de editar este archivo a mano: **hacer backup primero**
(`cp archivo archivo.bak-<motivo>-$(date +%Y%m%d%H%M%S)`) y editar con un script
que parsee el JSON (es JSON válido con extensión `.yaml`) en vez de tocar texto a
mano — un JSON roto tira abajo TODAS las rutas manuales del VPS, no solo la nueva.
Traefik vigila el archivo y aplica cambios solo (no hace falta reiniciar el
contenedor de Traefik); confirmar en
`docker logs $(docker ps --filter name=traefik -q) --tail 40` que aparece el router
nuevo (`...-manual@file`) y no hay error de parseo.

---

## Rollback

```bash
docker rm -f onia-landing
# si hay un backup previo:
rm -rf /opt/onia-landing/runtime-next
mv /opt/onia-landing/runtime-next.bak-<fecha> /opt/onia-landing/runtime-next
docker run -d --name onia-landing --restart unless-stopped --network easypanel \
  -p 8091:3000 --env-file /opt/onia-landing/app.env \
  -v /opt/onia-landing/runtime-next:/app -w /app \
  node:20-alpine node apps/onia-platform/server.js
```

Para la ruta Traefik: restaurar el `.bak-onia-landing-<fecha>` correspondiente en
`/etc/easypanel/traefik/config/`.

---

## Pendiente de Sergio

- **DNS**: apuntar `onia.com.bo` y `www.onia.com.bo` (A/AAAA o CNAME) a `187.77.16.63`.
  Hoy apuntan a Vercel. Apenas cambie, Traefik emite el certificado Let's Encrypt
  solo (reintenta automáticamente, ya está fallando con 403/404 esperado contra
  Vercel) y el sitio queda en `https://onia.com.bo` sin tocar nada más acá.
- Nada más pendiente de infraestructura para este objetivo puntual (landing con
  contenido real y HTTPS-ready). El puerto `8091` es temporal para prueba
  pre-DNS; se puede dejar o cerrar según se prefiera una vez el DNS esté migrado
  (no lo cierro yo por si sirve seguir probando por IP mientras se propaga el DNS).

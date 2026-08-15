# ONIA Deploy VPS Runbook — 2026-07-31

Pasos exactos para construir, subir y levantar DentalGest en el VPS (`187.77.16.63`).

**Entorno:** VPS Easypanel · Traefik ingress · Docker Compose · Supabase self-hosted (producción)  
**Build target:** `next build --webpack` (NOT Turbopack)  
**App path en VPS:** `/opt/onia-center-src` → `/opt/onia-center-app` (runtime)

---

## Pre-vuelo: verificar que el código está en main

```bash
git status
git log --oneline -5
```

Si hay cambios no comitados, commitear primero. **main debe estar limpia y compilar:**

```bash
cd web-factory/apps/site
tsc --noEmit
```

Si falla, no despliegas.

---

## 1. Build local (tu máquina)

```bash
# Desde la raíz de onia-platform (o web-factory/apps/site si aplica)
npm run build -- --webpack
```

⚠️ **OBLIGATORIO: `--webpack`.** Con Turbopack el standalone falla en VPS.

Si `tsc --noEmit` falla, `npm run build` también lo hará — **no seguir.**

Resultado: `.next/standalone/` listo.

---

## 2. Subir a VPS

```bash
# Desde la raíz donde está .next/
scp -r -i ~/.ssh/onia_hermes_vps_ed25519 .next/standalone/ root@187.77.16.63:/opt/onia-center-app.new/
scp -i ~/.ssh/onia_hermes_vps_ed25519 package.json package-lock.json root@187.77.16.63:/opt/onia-center-app.new/
```

En el VPS, verifica que llegó:

```bash
ssh root@187.77.16.63
ls -lah /opt/onia-center-app.new/
```

---

## 3. Verificar credenciales y variables antes de levantar

En el VPS, revisa el archivo `.env` del contenedor:

```bash
cat /opt/onia-center-app.env
```

**Debe incluir:**
- `SENTRY_DISABLED=1` (obligatorio — si falta, la app se cuelga en startup)
- `NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:55321` (staging) o el que corresponda
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
- `SUPABASE_SERVICE_ROLE_KEY=...`
- Todas las otras keys que usa la app

⚠️ **NO interpreta comillas:** si está `VAR="valor"`, la guarda con comillas adentro → error.  
**Corrección:** `VAR=valor` (sin comillas).

---

## 4. Levantar el contenedor (docker-compose)

En el VPS, en `/opt/`:

```bash
# Hacer backup de la versión anterior
cp -r /opt/onia-center-app /opt/onia-center-app.bak-$(date +%Y%m%d-%H%M%S)

# Reemplazar con la nueva
rm -rf /opt/onia-center-app
mv /opt/onia-center-app.new /opt/onia-center-app

# (opcional) Hacer backup también del .env anterior
cp /opt/onia-center-app.env /opt/onia-center-app.env.bak-$(date +%Y%m%d-%H%M%S)
```

Levantar:

```bash
cd /opt
docker-compose up -d onia-center
```

⚠️ **NO uses `docker restart onia-center`** — no relee variables.  
Si solo cambiaste env vars:
```bash
docker-compose down onia-center && docker-compose up -d onia-center
```

Si tocaste `NEXT_PUBLIC_*`:
```bash
# Necesitás reconstruir la imagen
docker-compose down onia-center
docker-compose build --no-cache onia-center
docker-compose up -d onia-center
```

---

## 5. Verificar que levantó bien

```bash
# Revisar logs
docker logs -f onia-center

# Conectar por túnel a Postgres para verificar que la app tiene acceso
ssh -N -L 55329:127.0.0.1:55329 root@187.77.16.63

# En otra terminal
# [FALTA: valor real de TENANT_ID — está en .env del VPS: SUPABASE_DB_POOLER_TENANT_ID]
psql -h localhost -p 55329 -U postgres.<TENANT_ID> -d postgres
```

Verifica que ve las tablas:

```sql
\dt onia_*
```

Debe mostrar las 13 migraciones aplicadas.

---

## 6. Verificar que las rutas responden

Desde tu máquina (con túnel SSH o acceso a internet del VPS):

```bash
# Verifica HTTPS con hostname correcto
curl -H "Host: app.onia.com.bo" https://187.77.16.63/

# O si tienes acceso directo
curl https://app.onia.com.bo/
```

Debe responder 200 (no redirect, no error 502).

Verifica que Supabase está expuesto:

```bash
curl -H "Host: app.onia.com.bo" https://187.77.16.63/supabase
# O directo si está mapeado
curl https://app.onia.com.bo/supabase
```

---

## 7. Rollback si algo falla

Si la app no levanta o responde 500:

### Opción A: Volver a la imagen anterior (reversible)

```bash
docker-compose down onia-center
rm -rf /opt/onia-center-app
mv /opt/onia-center-app.bak-YYYYMMDD-HHMMSS /opt/onia-center-app
docker-compose up -d onia-center
```

### Opción B: Copias de seguridad nombradas

En el VPS, existen copias de respaldo:
- `/opt/onia-center-app/runtime-next.prev` — binario anterior
- `/opt/onia-center-app.env.bak-cloud-20260730` — vars anteriores

Si la cagaste y no hay backup:

```bash
# Busca qué hay
ls -lah /opt/ | grep onia-center
ls -lah /opt/onia-center-app* | head -20
```

Restaura:

```bash
cp /opt/onia-center-app.env.bak-cloud-20260730 /opt/onia-center-app.env
docker-compose restart onia-center
```

---

## 8. Verificar logs después de levantar

```bash
# Seguir en vivo
docker logs -f onia-center

# Ver errores específicos
docker logs onia-center 2>&1 | grep -i error

# Si hay error SENTRY: agregar SENTRY_DISABLED=1 a .env
# Si hay error NEXT_PUBLIC_*: reconstruir con docker-compose build
# Si hay error de conexión a Postgres: verificar túnel SSH y credenciales
```

---

## Chequeo final: se considera "bien" cuando

1. ✅ `docker ps` muestra `onia-center` en estado `Up` (no `Restarting`)
2. ✅ `curl -H "Host: app.onia.com.bo" https://187.77.16.63/` responde 200 o 302 (no 500)
3. ✅ Supabase Studio responde en `/supabase`
4. ✅ Logs sin errores SENTRY, sin "Cannot find module", sin "Postgres connection refused"
5. ✅ Se puede abrir https://app.onia.com.bo en el navegador (o https://187.77.16.63 con Host header)

Si alguno de los 5 falla → **Rollback inmediato.**

---

## Trampas frecuentes

| Trampa | Síntoma | Solución |
|--------|---------|----------|
| `SENTRY_DISABLED` faltando | `Error: SENTRY client not initialized`, app se cuelga | Agregar a `.env`: `SENTRY_DISABLED=1` · Recrear contenedor |
| Comillas en `.env` | `VAR becomes "valor"` instead of `valor` | Editar `.env` sin comillas: `VAR=valor` |
| `docker restart` en vez de down/up | Variables no se recargan | Usar `docker-compose down && docker-compose up -d` |
| Turbopack en build | Routes 404 en VPS | Cambiar a `npm run build -- --webpack` · Reconstruir imagen |
| `NEXT_PUBLIC_*` sin reconstruir | Variables viejas en JS | Editar `.env` + `docker-compose build --no-cache` + `up -d` |
| Postgres unreachable | `Unable to connect to database` | Verificar túnel SSH · Verificar credenciales en `.env` |

---

## Rollback automático con cron (opcional)

Para que sea reversible si algo se cuelga:

```bash
# En el VPS, agregar a crontab -e
# Cada hora, si la app está caída, vuelve a la versión anterior
0 * * * * /opt/rollback-check.sh
```

Crear `/opt/rollback-check.sh`:

```bash
#!/bin/bash
if ! curl -f http://127.0.0.1:3012/ > /dev/null 2>&1; then
  # App caída, rollback
  cd /opt && docker-compose down onia-center
  if [ -d /opt/onia-center-app.bak-latest ]; then
    rm -rf /opt/onia-center-app
    mv /opt/onia-center-app.bak-latest /opt/onia-center-app
    docker-compose up -d onia-center
    echo "ROLLBACK EJECUTADO" | mail -s "ONIA Deploy Rollback" sergio@onia.com
  fi
fi
```

---

## Referencias

- VPS access: `vps-access-and-deploy.md`
- Dev setup: `DEV_LOCAL_SETUP.md`
- Credenciales: `BCP_PASARELA_CREDENCIALES_INTERNO.md`
- n8n workflows: `n8n-ops-pendientes.md`

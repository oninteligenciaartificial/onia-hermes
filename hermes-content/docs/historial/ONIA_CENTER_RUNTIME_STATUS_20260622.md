# ONIA Center Runtime Status - 2026-06-22

Estado: operativo interno con Supabase self-hosted y fallback local.

## Activo ahora

- VPS: Hostinger `187.77.16.63`.
- Supabase self-hosted: activo.
- Supabase REST: activo con schema `onia_center` expuesto.
- ONIA Center API local: `http://127.0.0.1:3022/api/onia-center/runtime`.
- ONIA Center UI local: `http://127.0.0.1:3022/onia-center`.
- n8n Sergio: activo `1/1`.
- Chatwoot: activo.
- EasyPanel/Traefik: activo.

## Base de datos ONIA Center

Schema: `onia_center`.

Tablas validadas: 35.

RLS: habilitado en las 35 tablas.

Grants REST: `service_role` tiene permisos sobre las 35 tablas del schema.

Servicio prioritario validado:

- `ONIA Motor Local Growth`
- Setup: Bs. 2.900
- Mensualidad: Bs. 1.900
- Fondo ONIA: 40%
- Estado: `sellable`

Backup antes de migraciones:

- `/root/backups/supabase/onia-center-pre-migration-20260622-205833.sql.gz`
- `/root/backups/supabase/onia-center-pre-migration-20260622-205833.sql.gz.sha256`

Config Supabase modificada:

- Archivo remoto: `/opt/onia-supabase/supabase/docker/.env`
- Cambio: `PGRST_DB_SCHEMAS=public,storage,graphql_public,onia_center`
- Backup de `.env`: `/root/backups/supabase/supabase-docker-env-before-onia-center-rest-.env`

## Variables locales requeridas

No guardar estas variables en el repo.

```powershell
$env:ONIA_CENTER_SUPABASE_URL="http://127.0.0.1:65421"
$env:ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
$env:ONIA_CENTER_SUPABASE_SCHEMA="onia_center"
```

El valor real de `ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY` vive en el `.env` remoto de Supabase. No imprimirlo en consola ni pegarlo en chats.

## Tunel local Supabase

```powershell
ssh -o ExitOnForwardFailure=yes -N `
  -L 65421:127.0.0.1:54321 `
  -L 65422:127.0.0.1:54322 `
  -i "$env:USERPROFILE\.ssh\onia_hermes_vps_ed25519" `
  root@187.77.16.63
```

Con el tunel abierto:

- REST/Kong local: `http://127.0.0.1:65421`
- HTTPS local: `https://127.0.0.1:65422`

## Comandos de validacion usados

```powershell
npm run validate:onia-center
```

Resultado esperado:

- `ok: true`
- `ONIA Motor Local Growth`
- `setup_price_bs: 2900`
- `monthly_price_bs: 1900`
- `fund_percent: 40`

```powershell
cd C:\dev\proyectos\onia-hermes\web-factory\apps\site
npm run build
```

Resultado esperado:

- Build Next.js exitoso.
- Ruta `/api/onia-center/runtime` incluida.
- Ruta `/onia-center` incluida.

## n8n

Estado actual: activo.

Servicio Docker Swarm:

- `n8n-sergio_n8n`
- Replicas: `1/1`
- Editor: `https://n8n-sergio-n8n.hqdqgh.easypanel.host`

Ajustes aplicados:

- `N8N_RUNNERS_ENABLED=true`
- `N8N_RUNNERS_MODE=internal`
- `N8N_RUNNERS_GRANT_TOKEN_TTL=120`
- `N8N_RUNNERS_MAX_CONCURRENCY=2`
- `N8N_RUNNERS_TASK_REQUEST_TIMEOUT=120`

Nota: los logs indican que el Python task runner no esta disponible en modo interno porque la imagen actual no trae Python 3. Para Python en n8n se necesita runner externo con `n8nio/runners`, no forzarlo dentro de esta imagen.

## No listo para exponer publicamente todavia

ONIA Center no debe conectarse a Supabase desde Vercel con `service_role` hasta implementar autenticacion real.

Pendiente obligatorio antes de uso multiusuario:

- Supabase Auth.
- Memberships reales por usuario.
- Politicas RLS por rol.
- Auditoria de acciones con actor real.
- Proteccion de `/api/onia-center/runtime`.
- Vistas separadas para Sergio, Arthur, vendedor y freelancer.

Regla temporal:

- Uso interno: local con tunel y service-role en memoria.
- Uso publico/Vercel: solo UI sin conectar secrets, o esperar Auth/RLS.

## Pendientes self-hosted

- Cal.com: pendiente de reactivacion estable.
- Dify: no levantar en este VPS hasta tener mas recursos o separar servidor.
- Open WebUI/Ollama: mantener apagado en este VPS; fue la carga pesada.
- LiteLLM app: mantener apagado salvo prueba controlada; base de datos esta activa.
- Supabase pooler: pendiente si se necesitan conexiones Postgres externas de alto volumen.
- Uptime Kuma: pendiente para monitoreo.

## Decision operativa

ONIA Center ya sirve como panel interno local para registrar tareas, revisiones, notas e ideas contra Supabase self-hosted.

No esta listo como portal publico para vendedores hasta cerrar autenticacion y permisos reales.

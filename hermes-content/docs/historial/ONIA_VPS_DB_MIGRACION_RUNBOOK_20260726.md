# RUNBOOK — Migración DentalGest: Supabase Cloud → VPS self-host

Fecha: 2026-07-26 · Estado: **LISTO PARA GO DE SERGIO — NADA EJECUTADO**
Integra: auditoría infra 2026-07-26 (solo lectura) + diseño de arquitectura 2026-07-26.
Continúa (no reemplaza): `DentaGest/dental-saas/docs/SUPABASE_SELFHOST_MIGRATION_PLAN.md` (2026-06-30)
y `DentaGest/dental-saas/docs/DATABASE_MIGRATION_BASELINE_2026.md` (runbooks quirúrgicos C1/C2).
Artefactos preparados (sin ejecutar): `hermes-content/infra/vps-db/` (compose, env.example, scripts).

---

## Resumen ejecutivo (leer esto primero)

| Qué | Valor |
|---|---|
| Origen | Supabase Cloud `kvepqgikokjlacxngkiw` (Postgres 17.6, us-west-2), 9 orgs piloto, RLS ON, DB de MBs |
| Destino | Stack Supabase dedicado que **YA CORRE** en el VPS: `/opt/dentalgest-staging-supabase` (Postgres 15.8, healthy 3 semanas, con staging restaurado) → se promueve a `/opt/dentalgest-supabase` |
| App | Se muda de Vercel al VPS (Next standalone en contenedor, detrás de Traefik). Vercel queda como plataforma de rollback |
| Costo RAM incremental | ~1–1.5 GiB contra 6.0 GiB available (el stack ya corre = 0 GiB nuevo) |
| Ventana de corte | 60–90 min reales; anunciar 2 h (domingo 21:00 La Paz recomendado) |
| Rollback | Cloud queda INTACTO y congelado 7–14 días; volver = revertir env vars en Vercel + redeploy (15 min) |
| **GO/NO-GO capacidad** | **GO CONDICIONAL**: cabe en el plan actual, PERO la higiene del Paso 0.3 es obligatoria antes del corte (swap 100% lleno = la caja ya tocó techo en picos) |

Orden de fases (cada una con gate propio; no avanzar sin cerrar la anterior):

```
0. Pre-requisitos + GO/NO-GO            [sin riesgo, decisiones]
1. Backups automáticos + R2             [PRIMERO — innegociable]
2. Promover stack staging → prod        [VPS, sin tocar cloud]
3. Migrar schema + datos + auth (ensayo)[VPS, cloud solo LECTURA]
4. Árbol completo de migraciones        [VPS, dormidas + C1 + C2]
5. Corte (env vars + DNS + ventana)     [ÚNICO paso con downtime]
6. Verificación post-migración          [checklist completo]
7. Rollback (si algo falla)             [cloud intacto N días]
8. Destino del proyecto cloud           [pausa, no borrar 30 días]
```

---

## FASE 0 — Pre-requisitos y GO/NO-GO de capacidad

### 0.1 GO/NO-GO de capacidad (datos de la auditoría 2026-07-26)

| Recurso | Hoy | Necesita la migración | Veredicto |
|---|---|---|---|
| RAM | 15.62 GiB total, **6.0 GiB available** | ~1–1.5 GiB (app 0.3–0.5 + crecimiento PG 0.5–1; stack ya corre = 0 nuevo) | ✅ CABE |
| Swap | 4 GiB **usado al 100%** | — | ⚠️ Señal de presión pasada → higiene 0.3 OBLIGATORIA |
| Disco | 86 GB libres (56% uso) | DB de MBs + backups (<2 GB/año) | ✅ SOBRA |
| CPU | 4 cores, load 2.15/1.27/1.08 | app Next + PG con 9 orgs = marginal | ✅ OK |

**Regla de decisión:**
- **GO** si tras la higiene 0.3: `free -h` muestra ≥ 4.5 GiB available y swap usado < 50%.
- **NO-GO (subir plan primero, 16→32 GB)** si tras higiene queda < 4 GiB available,
  o load promedio sostenido > 3.0, o Sergio planea sumar >3 clínicas activas en 60 días.
- Subir de plan NO es prerequisito hoy; es opción de confort futura.

### 0.2 Decisiones que necesita dar Sergio ANTES del GO

| # | Decisión | Recomendación |
|---|---|---|
| D1 | GO general de la migración | — |
| D2 | Los 6 profiles sin `auth.user` (cloud tenía 9 users auth, 15 profiles con userId) | Documentarlos como históricos y dejarlos; NO borrarlos (pueden ser staff dado de baja). Revisar lista antes del corte |
| D3 | Dominio API pública: `api.dentalgest.app` → VPS (el browser necesita Auth/Realtime/Storage por HTTPS) | Sí — es lo MÍNIMO público que la app permite |
| D4 | Cuenta Cloudflare R2 para backups off-site (bucket `onia-backups`) | Crear (free tier 10 GB, egress $0). Cierra pendiente histórico R2 |
| D5 | SMTP para GoTrue self-host (mails de reset/invite) | Reusar Resend vía SMTP (smtp.resend.com:587, misma API key) |
| D6 | Ventana de corte | Domingo 21:00–23:00 America/La_Paz |
| D7 | Mecanismo de freeze en Vercel durante la ventana | Ver §5.3 (opción A: env `MAINTENANCE` + middleware; opción B: swap de dominio a proyecto estático "mantenimiento") |

### 0.3 Higiene previa del VPS (30 min, bajo riesgo — PRIMERA acción tras el GO)

Nada de esto toca DentalGest ni datos; libera RAM/disco y el swap:

1. `docker rm` de los 26 contenedores parados (4.8 GB).
2. `docker image prune -a` con los stacks corriendo (de 67.6 GB de imágenes, se va lo no referenciado).
3. Matar duplicados del stack ONIA: `supabase-studio2` + `supabase-auth2` (verificar con
   `docker ps` que el studio/auth "1" siguen healthy antes de remover los "2").
4. Bajar límites de los golosos idle: `litellm` (1.82 GiB) → `--memory=1g`;
   evaluar parar `speakr` (0.9) y `stirling` (0.44) si no están en uso activo.
5. `swapoff -a && swapon -a` SOLO después de 1–4 y con available > 5 GiB (limpia el swap heredado).
6. Alinear sidekiq de Chatwoot (v4.9.1) a la versión de la app (v4.12.1) — o anotarlo para su propio carril.

Gate: `free -h` ≥ 4.5 GiB available, swap < 50%. Si no se cumple → NO-GO, subir plan.

### 0.4 Checklist de insumos (todo listo antes de la Fase 1)

- [ ] SSH OK: `ssh -i C:\Users\PC\.ssh\onia_hermes_vps_ed25519 root@187.77.16.63`
- [ ] Credenciales R2 creadas (D4) y `rclone` instalado en el VPS (`apt install rclone` o binario oficial)
- [ ] DNS: TTL de `dentalgest.app` bajado a 300 s (mínimo 48 h antes del corte)
- [ ] DNS: `api.dentalgest.app` A → 187.77.16.63 creado (puede apuntarse ya; Traefik responde 404 hasta configurar)
- [ ] Nombre real de la red de Traefik/Easypanel confirmado (solo lectura): `docker network ls` y
      `docker inspect <traefik> --format '{{json .NetworkSettings.Networks}}'` → va en los compose de `infra/vps-db/`
- [ ] SMTP de GoTrue decidido (D5) con credenciales a mano
- [ ] Copia de las env vars actuales de Vercel exportada a un lugar seguro (para la matriz §5.1 y para el rollback §7)
- [ ] Artefactos de junio verificados en el VPS: `ls /root/backups/dentalgest-staging/20260630_152019/`
      (`restore_dentalgest_full.sql`, `source_auth_users_identities.pg15.sql`, hashes `.sha256`) —
      son la RECETA PROBADA de transformación pg17→pg15 + `public`→`dentalgest`

---

## FASE 1 — Backups automáticos PRIMERO (innegociable)

> Un backup que no se restauró no existe. Esta fase se monta y se PRUEBA antes de tocar nada más.
> Artefactos: `infra/vps-db/scripts/backup-dentalgest.sh`, `verify-restore.sh`, `cron.example`, `rclone.conf.example`.

### 1.1 Instalar

1. Copiar `rclone.conf.example` → `/root/.config/rclone/rclone.conf` (chmod 600) con las credenciales R2 reales.
2. Copiar `scripts/backup-dentalgest.sh` y `scripts/verify-restore.sh` → `/root/bin/` (chmod 700).
3. Crear `/root/.config/onia/backup.env` (chmod 600) con `KUMA_PUSH_URL`, `TG_BOT_TOKEN`, `TG_CHAT_ID`
   (mismo patrón que docs-hygiene; parse_mode HTML).
4. Instalar cron según `cron.example`:
   - Diario 07:30 UTC (= 03:30 La Paz): `backup-dentalgest.sh`
   - Mensual día 1, 08:30 UTC: `verify-restore.sh`

### 1.2 Qué hace cada backup diario

1. `pg_dumpall --globals-only` (roles) desde el contenedor db.
2. `pg_dump -Fc` de la DB `postgres`, schemas `dentalgest` + `auth` + `storage`.
3. `tar.zst` del volumen de archivos de Storage (`volumes/storage`).
4. `sha256sum` de todo → `SHA256SUMS`.
5. `rclone copy` → `r2:onia-backups/dentalgest/AAAAMMDD_HHMMSS/`.
6. Poda local: solo 7 días en `/root/backups/dentalgest/`. Retención R2: 14 diarios + 8 semanales
   + 12 mensuales (lifecycle rules en R2, ver comentario del script).
7. Éxito → ping a Uptime Kuma. Fallo → alerta Telegram.

### 1.3 Prueba de restore (gate de la fase)

- El PRIMER restore de verdad es el ensayo de la Fase 3 (restaura el dump completo en el stack) — esa es la prueba inicial.
- Además `verify-restore.sh` (mensual y a demanda): restaura el último dump en un postgres 15 efímero
  y compara row-counts de 5 tablas testigo (`organizations`, `profiles`, `patients`, `appointments`, `invoices`)
  contra el stack vivo → reporte a Telegram.

Gate Fase 1: un backup diario corrió entero (R2 incluido) + un `verify-restore.sh` manual pasó verde.

> Nota: mientras el corte no ocurra, este backup protege el STAGING del VPS. El backup de cloud
> pre-corte es parte de la Fase 5 (dump congelado). Post-corte, este mismo cron protege PROD.
> Fase 2 del esquema (replicar a Supabase ONIA y Postgres de n8n/litellm) queda para después, fuera de este corte.

---

## FASE 2 — Promover el stack staging a producción (VPS; cloud no se toca)

> El stack YA EXISTE y está healthy (`/opt/dentalgest-staging-supabase`, 10 contenedores, Kong 127.0.0.1:55321).
> NO se instala nada nuevo: se promueve. Los secretos de staging se consideran QUEMADOS → se regeneran TODOS.
> Artefactos: `infra/vps-db/env.stack.example`, `docker-compose.kong-override.yml`, `docker-compose.app.yml`,
> `scripts/gen-secrets.sh`, `scripts/gen-jwt-keys.mjs`, `scripts/rotate-db-passwords.sql`.

### 2.1 Renombrar y regenerar secretos

```bash
# En el VPS (tras GO):
cd /opt
docker compose -f dentalgest-staging-supabase/supabase/docker/docker-compose.yml down   # stack staging abajo (datos persisten en volúmenes)
mv dentalgest-staging-supabase dentalgest-supabase
cd dentalgest-supabase/supabase/docker

# Generar secretos nuevos (NUNCA reusar los de staging):
bash /root/bin/gen-secrets.sh          # imprime POSTGRES_PASSWORD, JWT_SECRET, DASHBOARD_PASSWORD
node /root/bin/gen-jwt-keys.mjs "$JWT_SECRET"   # imprime ANON_KEY y SERVICE_ROLE_KEY firmados
```

Editar el `.env` del stack con los valores nuevos + el delta de prod de `env.stack.example`
(`API_EXTERNAL_URL=https://api.dentalgest.app`, `SITE_URL=https://dentalgest.app`, SMTP, `DISABLE_SIGNUP=true`, etc.).

**Rotación de passwords de roles internos** (el compose oficial solo setea passwords en el primer boot;
como los volúmenes ya existen, hay que rotarlos por SQL): levantar SOLO el servicio `db` y correr
`rotate-db-passwords.sql` (ALTER USER de `postgres`, `authenticator`, `pgbouncer`, `supabase_auth_admin`,
`supabase_functions_admin`, `supabase_storage_admin`, `supabase_admin`) con el password nuevo. Recién después `up` completo.

### 2.2 Levantar y verificar

```bash
docker compose up -d
docker compose ps          # 10 servicios healthy
curl -s -o /dev/null -w '%{http_code}' -H "apikey: $ANON_KEY" http://127.0.0.1:55321/rest/v1/   # 200
curl -s -o /dev/null -w '%{http_code}' -H "apikey: $SERVICE_ROLE_KEY" -H "Authorization: Bearer $SERVICE_ROLE_KEY" http://127.0.0.1:55321/auth/v1/admin/users   # 200
```

Puertos quedan como estaban (solo localhost): Kong 55321/55322, pooler 55329/55320. Postgres NUNCA se publica.

### 2.3 Exponer Kong vía Traefik (`api.dentalgest.app`)

Aplicar `docker-compose.kong-override.yml` (agrega labels Traefik + red de Easypanel al servicio kong,
sin editar el compose oficial). Verificar: `curl https://api.dentalgest.app/rest/v1/` con apikey → 200,
y que SIN apikey → 401 (Kong exige apikey como en cloud). Studio y Meta siguen SOLO por túnel SSH.

### 2.4 App DentalGest en el VPS (aún sin cortar)

1. Build local (no en el VPS — swap lleno + regla conocida): en la máquina dev,
   `npm run selfhost:docker` (usa el Dockerfile del repo, target `dentalgest:selfhost`).
2. Transferir imagen: `docker save dentalgest:selfhost | zstd | ssh root@VPS 'unzstd | docker load'`.
3. Copiar `docker-compose.app.yml` + `env.app.example` → `/opt/dentalgest-app/` y completar `.env.app`
   (matriz §5.1, columna VPS).
4. `docker compose up -d` → la app corre contra el stack self-host. `dentalgest.app` sigue apuntando
   a Vercel/cloud: los pilotos NO se enteran. Probarla por IP/host header o un dominio staging temporal.

Gate Fase 2: stack healthy con secretos nuevos + `api.dentalgest.app` sirviendo Auth/REST + app contenedor arriba contra el stack.

---

## FASE 3 — Migrar schema + datos + usuarios auth (ensayo completo; cloud SOLO lectura)

> Se repite la ruta PROBADA el 2026-06-30 (misma transformación), ahora con datos frescos.
> Esto es un ENSAYO end-to-end: el corte real (Fase 5) repite exactamente esto con escrituras congeladas.
> Artefactos: `scripts/cutover-dump-cloud.sh`, `scripts/cutover-restore-selfhost.sh`, `scripts/storage-migrate.mjs`, `scripts/rowcount-compare.sh`.

### 3.1 Dump desde cloud (pg17) — desde el VPS, cliente pg17 en contenedor

```bash
GO=SI bash cutover-dump-cloud.sh   # exige GO=SI; usa docker run postgres:17-alpine
```

Produce en `/root/backups/dentalgest-cutover/<ts>/`:
- `source_public_full.sql` — schema `public` completo (34 tablas hoy, incluye `onia_core_*`, `prospect_leads`, `_prisma_migrations`), `--no-owner --no-privileges`, formato plain.
- `source_auth_users_identities.sql` — SOLO `auth.users` + `auth.identities` (data-only). NO sesiones, NO refresh tokens, NO flow state, NO one-time tokens.
- `SHA256SUMS`.

La URL de conexión cloud se pasa por env efímera y NO se persiste (igual que junio: el archivo temporal con URLs se elimina tras el dump).

### 3.2 Transformar pg17 → pg15 + `public` → `dentalgest`

`cutover-restore-selfhost.sh` aplica la MISMA transformación que la receta de junio
(referencia viva: `/root/backups/dentalgest-staging/20260630_152019/restore_dentalgest_full.sql` y `*.pg15.sql`):
- rename de schema `public` → `dentalgest` (objetos, `search_path`, `ALTER ... SCHEMA`);
- strip de sintaxis pg17-only (p. ej. `SET transaction_timeout = 0;`);
- excluir extensiones/objetos administrados por el stack.

**Obligatorio:** `diff` del SQL transformado nuevo contra el de junio antes de aplicar — cualquier
patrón NUEVO que el sed no cubra (10 tablas se crearon desde junio) se revisa a mano.

### 3.3 Restore en el stack (destructivo SOLO en el VPS)

```bash
GO=SI bash cutover-restore-selfhost.sh   # exige GO=SI + backup Fase 1 verde del mismo día
```

1. Baja la app (si corre), `DROP SCHEMA dentalgest CASCADE` + recrear (el staging viejo se descarta; ya hay backup).
2. Aplica el SQL transformado (datos de negocio + `_prisma_migrations` viajan dentro).
3. `TRUNCATE auth.users, auth.identities CASCADE` + aplica el SQL de auth transformado (9+ users actuales).
4. Re-aplica grants base sobre `dentalgest` (bloque probado de junio, vive en `restore_dentalgest_full.sql`).
5. Realtime: verificar publicación y re-agregar si falta:
   `ALTER PUBLICATION supabase_realtime ADD TABLE dentalgest.appointments;` (+ toda tabla que la app
   suscriba: revisar `hooks/useAppointmentsRealtime.ts` y `NotificationBell.tsx`).
6. `ANALYZE`.

**PostgREST NO expone `dentalgest`** (la app usa Prisma para datos): se deja el schema FUERA de
`db-schemas` de PostgREST. Menos superficie. Realtime y Storage no dependen de eso.

### 3.4 Storage (buckets + archivos)

`node storage-migrate.mjs` (cloud → self-host vía API con service keys de ambos lados):
lista buckets cloud, los crea en self-host (mismos nombres/visibilidad), copia objetos.
La app usa Storage para comprobantes de pago (`api/subscription-payment`) y documentos onia-core (signed URLs).
Verificar después: `select count(*) from storage.objects` igual en ambos lados.

### 3.5 Validación del ensayo

- `rowcount-compare.sh` → conteo por tabla cloud `public` vs self-host `dentalgest`: TODAS iguales.
- `auth.users` / `auth.identities`: counts iguales cloud vs self-host; `profiles.userId` matching auth ≥ el nivel de cloud (los 6 huérfanos D2 son estado esperado de la fuente).
- Smoke con la app del VPS (§2.4): **login real** (cierra el pendiente de junio — con GO de Sergio,
  reset de password SOLO-self-host de un usuario de prueba; cloud no se toca), dashboard, paciente,
  cita (badge realtime), factura + `/print/invoice/[id]`, upload de comprobante.

Gate Fase 3: counts iguales + login real OK + smoke completo verde. Si algo falla, se itera aquí — cloud sigue intacto y sirviendo prod.

---

## FASE 4 — Aplicar el árbol COMPLETO de migraciones en el destino

> Ventaja estratégica: las dormidas + C1/C2 se estrenan en el self-host ANTES que en cualquier prod.
> Método: runbook quirúrgico de `DATABASE_MIGRATION_BASELINE_2026.md` — SQL byte a byte + `migrate resolve --applied`.
> PROHIBIDO: `prisma migrate deploy`, `prisma db push`, MCP `apply_migration` (sigue el congelamiento).

Orden (cada una: `psql` directo al db del stack con `search_path=dentalgest`, SQL IDÉNTICO al archivo de
`prisma/migrations/`, luego `docker exec dentalgest-app npx prisma migrate resolve --applied <nombre>`):

| # | Migración | Nota |
|---|---|---|
| 1 | `20260708120000_add_onia_commerce` | dormida |
| 2 | `20260708130000_add_onia_invoicing` | dormida; prerequisito de #6 |
| 3 | `20260708140000_add_onia_accounting` | dormida |
| 4 | `20260721000000_add_onia_dental_medical_alerts` | dormida |
| 5 | `20260726000000_add_platform_layer` | C1 — 5 columnas en organizations + organization_entitlements; verificar 9 filas con defaults, cero NULL |
| 6 | `20260727000000_add_invoicing_source_bridge` | C2 paso 1 — requiere #2 |
| 7 | `20260728000000_add_onia_agents` | C2 paso 2 — independiente; 3 tablas + 5 índices + 7 FKs |

Verificación final:
- `npx prisma migrate status` → **"Database schema is up to date!"** (cero pendientes — primera vez en la historia del producto).
- `migrate diff` → único drift esperado: `prospect_leads` (frontera conocida, NO tocar).
- Flags **OFF** (`PLATFORM_LAYER`/`SIAT_EMISSION`/`AGENTS_RUNTIME` vacíos): smoke idéntico al de Fase 3 —
  cero queries a tablas nuevas. Encenderlos es decisión separada POST-migración, cada uno con su plan.

Gate Fase 4: migrate status limpio + smoke con flags off idéntico.

---

## FASE 5 — Corte (única fase con downtime)

### 5.1 Matriz de env vars de la app

| Variable | HOY (Vercel → cloud) | DESPUÉS (VPS → self-host) |
|---|---|---|
| `DATABASE_URL` | pooler cloud (`...pooler.supabase.com...`) | `postgresql://postgres:<POSTGRES_PASSWORD>@db:5432/postgres?schema=dentalgest&connection_limit=15&pool_timeout=20` |
| `DIRECT_URL` | directa cloud 5432 | igual a `DATABASE_URL` (misma red docker; sin pooler) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://kvepqgikokjlacxngkiw.supabase.co` | `https://api.dentalgest.app` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key cloud | `ANON_KEY` nuevo (Fase 2.1) |
| `SUPABASE_SERVICE_ROLE_KEY` | service key cloud | `SERVICE_ROLE_KEY` nuevo (Fase 2.1) |
| `NEXT_PUBLIC_APP_URL` | `https://dentalgest.app` | igual (no cambia) |
| Resend/SMTP, WhatsApp, Chatwoot, n8n, CRON_SECRET, ENCRYPTION_KEY, Sentry, VAPID, Upstash, ONIA_INTAKE_SECRET | valores actuales de Vercel | **idénticos** (copiar 1:1) |
| `PLATFORM_LAYER` / `SIAT_EMISSION` / `AGENTS_RUNTIME` / `AGENT_RUNTIME_SECRET` / `SIAT_SERVICE_*` | vacíos | **vacíos** (OFF en el corte) |
| `PORT` / `HOSTNAME` | (Vercel los maneja) | `3000` / `0.0.0.0` (standalone) |

Plantilla completa: `infra/vps-db/env.app.example`.

### 5.2 Integraciones que cambian de URL (preparar ANTES de la ventana)

- **n8n → prospect_leads**: hoy los workflows de prospección escriben vía API cloud. Post-corte:
  cambiar esos nodos a **Postgres node interno** (n8n está en el MISMO VPS; conexión por red docker,
  cero exposición pública) — o exponer `dentalgest` por PostgREST (NO recomendado). Preparar la
  credencial n8n nueva antes de la ventana; switchearla durante el corte.
- **Webhooks entrantes** (WhatsApp/Meta, Chatwoot, n8n → app): apuntan a `https://dentalgest.app/...` —
  no cambian (el dominio migra con la app).
- **Crons de Vercel** (si `vercel.json` define alguno): recrearlos como cron del VPS o workflow n8n
  llamando `https://dentalgest.app/api/cron/...` con `CRON_SECRET`. Inventariar antes de la ventana.

### 5.3 Secuencia de corte (ventana anunciada: 2 h; trabajo real: 60–90 min)

| T | Acción | Min |
|---|---|---|
| T-48h | Bajar TTL DNS a 300 s; anunciar ventana a los pilotos | — |
| T-0 | Activar freeze en Vercel (D7: env `MAINTENANCE` + redeploy, o swap del dominio a página estática de mantenimiento). Verificar que NADIE escribe (logs) | 10 |
| T+10 | Dump final cloud (`cutover-dump-cloud.sh`, mismos comandos que el ensayo; DB de MBs → minutos) | 10 |
| T+20 | Transform + `diff` contra el SQL del ensayo (deben diferir solo en datos) + restore en self-host (`cutover-restore-selfhost.sh`) + delta de storage (`storage-migrate.mjs`, incremental) | 20 |
| T+40 | Re-aplicar Fase 4 si el restore pisó el schema (el script las re-corre; son idempotentes vía `migrate resolve`) + `rowcount-compare.sh` verde | 10 |
| T+50 | DNS: `dentalgest.app` A → 187.77.16.63 (sale de Vercel). App del VPS ya corre con `.env.app` final. Switch credencial n8n (§5.2) | 10 |
| T+60 | Smoke §6 (mínimo obligatorio) | 20 |
| T+80 | Anunciar fin de ventana. Cloud queda CONGELADO (nadie escribe; no se pausa aún) | — |

**Regla dura:** desde T-0 hasta el fin, CERO escrituras en cloud. Si el smoke falla y no se arregla
en 30 min → ROLLBACK (§7) — para eso el cloud quedó intacto.

---

## FASE 6 — Verificación post-migración (checklist)

Mínimo obligatorio dentro de la ventana (T+60):

- [ ] **Login funciona** con usuario real de una org piloto (GoTrue self-host + cookie + `getTenantProfile`)
- [ ] **RLS ON**: `select count(*) from pg_tables where schemaname='dentalgest' and rowsecurity;` ≥ 24 (paridad con cloud)
- [ ] **tenantWhere / aislamiento**: usuario de org A no ve pacientes de org B (probar con 2 orgs piloto en la app)
- [ ] **Counts por tabla iguales**: `rowcount-compare.sh` → cero diferencias contra el dump congelado
- [ ] **auth**: `auth.users` y `auth.identities` = counts del dump; login NO pide reset
- [ ] **Print/factura**: `/print/invoice/[id]` de una factura existente renderiza completo
- [ ] **/pending** (cola de aprobación onia-core) carga y lista lo esperado
- [ ] **Realtime**: badge de citas actualiza al crear cita demo (websocket contra `api.dentalgest.app`)
- [ ] **Storage**: subir comprobante demo + abrir un documento con signed URL
- [ ] **Email**: disparar un mail transaccional (recordatorio/reset) y verificar llegada

Primeras 48 h (fuera de ventana):

- [ ] Cron diario de backup (Fase 1) corrió contra el stack PROD y subió a R2
- [ ] `docker stats` del VPS: available ≥ 3.5 GiB, swap sin crecer, load < 3
- [ ] Sentry sin errores nuevos de conexión/DB; logs de la app limpios
- [ ] Webhooks reales entraron (WhatsApp/n8n) y escribieron en self-host
- [ ] Uptime Kuma monitoreando `https://dentalgest.app` + `https://api.dentalgest.app/auth/v1/health`

---

## FASE 7 — ROLLBACK exacto (cloud queda intacto como red de seguridad)

Ventana de rollback: **cloud congelado e intacto 7–14 días** post-corte. Nadie lo pausa ni borra en ese lapso.

**Disparadores:** smoke §6 falla y no se arregla en 30 min · corrupción de datos detectada ·
VPS caído sin recuperación rápida en las primeras 48 h.

**Procedimiento (15–30 min):**

1. **Congelar el self-host**: `docker stop dentalgest-app` (nadie más escribe en el stack).
2. **DNS**: `dentalgest.app` → de vuelta a Vercel (CNAME/A originales; TTL 300 ya vigente).
3. **Vercel**: las env vars cloud NUNCA se tocaron en Vercel → quitar el freeze (D7) y redeploy. La app vuelve a cloud tal cual estaba en T-0.
4. **Verificar**: login + dashboard + lectura de datos contra cloud.
5. **n8n**: revertir credencial de prospección a la API cloud.

**Si hubo escrituras en self-host entre el corte y el rollback** (el caso post-48h): NO hacer rollback ciego.
Exportar el delta primero — `pg_dump --data-only` de las tablas con `updatedAt/createdAt > <ts_corte>`
(+ `auth.users` nuevos) — y reconciliar a mano en cloud ANTES de reabrir tráfico. Con 9 orgs el delta
de horas es de decenas de filas: manejable, pero es la razón por la que el smoke §6 se hace DENTRO de la ventana.

---

## FASE 8 — Qué se hace con el proyecto cloud después

| Día | Acción |
|---|---|
| 0–7 | Cloud congelado, ACTIVO, cero escrituras. Es el rollback caliente |
| 7 | Checkpoint con Sergio: ¿48 h+ estables, backups verdes, cero incidentes? → extender a 14 si hay dudas |
| 7–14 | Export final de despedida: dump completo + `sha256` → R2 (`r2:onia-backups/dentalgest/cloud-final/`). Verificar el hash |
| 14 | **PAUSAR** el proyecto en Supabase (no borrar). En plan free se pausará solo por inactividad — dejar que pase o pausarlo explícito |
| 14–44 | Proyecto pausado se conserva **30 días mínimo**. NO borrar |
| 44+ | Solo con OK explícito de Sergio y el export final verificado en R2: borrar el proyecto (o dejarlo pausado indefinidamente — costo $0) |

Recordatorios de calendario: día 7 (checkpoint) y día 44 (decisión de borrado).

---

## Costo/beneficio honesto (para la decisión de Sergio)

### Qué gana

- **Siempre activo**: se acaba el riesgo de pausa por inactividad del plan free — la causa raíz de todo esto.
- **Costo marginal $0**: el stack ya corre en el VPS que ya se paga; R2 free tier. Sin sorpresas de facturación por proyecto.
- **Todo unido**: DB + app + n8n + Hermes + panel en una sola caja, una sola red privada. Postgres nunca sale a internet (hoy en cloud la DB tiene endpoint público).
- **Control total**: extensiones, tuning, dumps al instante, sin límites de plan. Las dormidas + C1/C2 se estrenan aquí antes que en cualquier otra prod.
- **Latencia**: app y DB en la misma red docker (hoy: Vercel us-east ↔ Supabase us-west en cada query Prisma).

### Qué asume (sin maquillaje)

- **Los backups son 100% responsabilidad nuestra.** En cloud había PITR/backups gestionados; ahora si el cron falla y nadie mira Telegram, no hay red. Por eso la Fase 1 va primero y con verificación mensual automática.
- **Punto único de falla**: VPS caído = DentalGest + n8n + Hermes + panel + Chatwoot caídos A LA VEZ. Hostinger no da SLA de nube grande. Mitigación: Uptime Kuma + backups off-site (RTO honesto: horas para re-levantar en otra caja, no minutos).
- **Mantenimiento nuestro**: upgrades de Postgres/GoTrue/Kong, parches de seguridad, renovación de certs, disco lleno, swap. Son horas de ops recurrentes que cloud incluía en el precio.
- **Sin PITR real**: la granularidad de recuperación es el backup diario (hasta 24 h de pérdida en el peor caso). Si un cliente exige menos, hay que montar WAL archiving (posible, más ops).
- **RAM finita compartida**: DentalGest compite con litellm/speaches/etc. La higiene 0.3 y el monitoreo son permanentes, no de una vez.

### Cuándo convendría VOLVER a managed

Reevaluar (con plata de clientes, no por nostalgia) cuando se cumpla cualquiera:
- **≥ 10–15 clínicas activas pagando** o cualquier cliente con SLA/contrato que exija PITR y alta disponibilidad reales;
- el VPS necesite más de ~1 upgrade de plan por semestre por esta carga (la economía se invierte);
- un incidente de datos donde el backup diario no alcanzó;
- entrada a compliance formal (datos clínicos + auditoría externa) donde un managed con certificaciones simplifique el papeleo.

Con ingresos recurrentes, un Supabase Pro (~$25/mes + uso) o Postgres gestionado se paga solo en horas de ops ahorradas. La arquitectura elegida (stack estándar Supabase + Prisma) hace que la vuelta sea la MISMA migración en reversa — nada de lo construido aquí se pierde.

---

## Apéndice — Mapa de artefactos preparados (`hermes-content/infra/vps-db/`)

| Archivo | Fase | Qué es |
|---|---|---|
| `README.md` | — | índice + regla "nada se ejecuta sin GO" |
| `env.stack.example` | 2 | delta de `.env` del stack Supabase para prod (placeholders) |
| `env.app.example` | 2/5 | env completo del contenedor de la app (placeholders) |
| `docker-compose.app.yml` | 2.4 | contenedor de la app + labels Traefik |
| `docker-compose.kong-override.yml` | 2.3 | expone Kong como `api.dentalgest.app` sin editar el compose oficial |
| `scripts/gen-secrets.sh` | 2.1 | genera POSTGRES_PASSWORD/JWT_SECRET/DASHBOARD_PASSWORD |
| `scripts/gen-jwt-keys.mjs` | 2.1 | firma ANON_KEY/SERVICE_ROLE_KEY desde JWT_SECRET (HS256, sin deps) |
| `scripts/rotate-db-passwords.sql` | 2.1 | ALTER USER de los roles internos del stack |
| `scripts/backup-dentalgest.sh` | 1 | backup diario: globals + pg_dump -Fc + storage + sha256 + R2 + poda + Kuma/Telegram |
| `scripts/verify-restore.sh` | 1 | restore de prueba en postgres efímero + comparación de counts + Telegram |
| `scripts/cutover-dump-cloud.sh` | 3/5 | dump final desde cloud (cliente pg17 en docker, guard GO=SI) |
| `scripts/cutover-restore-selfhost.sh` | 3/5 | transform pg17→pg15 + public→dentalgest + restore + grants + realtime (guard GO=SI) |
| `scripts/storage-migrate.mjs` | 3.4 | copia buckets/objetos Storage cloud → self-host vía API |
| `scripts/rowcount-compare.sh` | 3/5/6 | counts por tabla origen vs destino, diff |
| `cron.example` | 1 | líneas de crontab (backup diario + verify mensual) |
| `rclone.conf.example` | 1 | remote R2 (placeholders) |

**Regla transversal:** ningún artefacto se ejecuta sin el GO de Sergio; los scripts destructivos exigen `GO=SI` explícito; ningún archivo del repo contiene secretos reales.

# infra/vps-db — Artefactos de la migración DentalGest Cloud → VPS

Runbook maestro: `hermes-content/docs/ONIA_VPS_DB_MIGRACION_RUNBOOK_20260726.md`.

**REGLA: NADA de este directorio se ejecuta sin el GO explícito de Sergio.**
Los scripts destructivos exigen `GO=SI` en el entorno. Ningún archivo contiene
secretos reales — todo son placeholders `<ASI>`.

| Archivo | Fase del runbook |
|---|---|
| `env.stack.example` | 2 — delta `.env` del stack Supabase para prod |
| `env.app.example` | 2/5 — env del contenedor de la app |
| `docker-compose.app.yml` | 2.4 — app Next standalone + Traefik |
| `docker-compose.kong-override.yml` | 2.3 — `api.dentalgest.app` → Kong |
| `scripts/gen-secrets.sh` | 2.1 — secretos nuevos |
| `scripts/gen-jwt-keys.mjs` | 2.1 — ANON/SERVICE keys desde JWT_SECRET |
| `scripts/rotate-db-passwords.sql` | 2.1 — rotación de roles internos |
| `scripts/backup-dentalgest.sh` | 1 — backup diario + R2 |
| `scripts/verify-restore.sh` | 1 — prueba de restore mensual |
| `scripts/cutover-dump-cloud.sh` | 3/5 — dump final desde cloud |
| `scripts/cutover-restore-selfhost.sh` | 3/5 — transform + restore en el stack |
| `scripts/storage-migrate.mjs` | 3.4 — Storage cloud → self-host |
| `scripts/rowcount-compare.sh` | 3/5/6 — verificación de counts |
| `cron.example` | 1 — crontab |
| `rclone.conf.example` | 1 — remote R2 |

Instalación en el VPS (tras GO): scripts → `/root/bin/` (chmod 700),
rclone.conf → `/root/.config/rclone/` (chmod 600), env de alertas →
`/root/.config/onia/backup.env` (chmod 600). Todo root-only, nada en el repo.

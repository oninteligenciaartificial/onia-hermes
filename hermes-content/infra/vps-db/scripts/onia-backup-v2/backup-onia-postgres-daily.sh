#!/usr/bin/env bash
# Proposed replacement entrypoint for the existing PostgreSQL cron only.
# Install/execute/schedule require approval. No n8n, Storage or offsite claim.
set -euo pipefail
exec /usr/bin/python3 /root/bin/onia-backup-v2/backup-onia-postgres-job.py \
  --execute \
  --container-name supabase-db \
  --expected-image-id sha256:af083ef64d0408c8f098ee6f5c364a59b26f36fbc0f3a334a62c5c1d57362e9b \
  --database postgres --username postgres --port 54329 \
  --output-dir /root/backups/onia-postgres-v1 \
  --max-bytes 268435456 --storage-budget-bytes 2147483648 \
  --min-free-bytes 5368709120 --dump-timeout-seconds 300

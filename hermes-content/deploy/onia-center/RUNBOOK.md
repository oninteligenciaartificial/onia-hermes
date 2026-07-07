# Runbook — Deploy de ONIA Center (center.onia.com.bo)

Produccion = contenedor `onia-center` en el VPS (187.77.16.63), sirviendo un **Next
standalone** en `/opt/onia-center/runtime-next` (bind-mount → `/app`, `node server.js`,
PORT=3012, `--env-file /opt/onia-center/.env`). El deploy es por **tarball** (no git).

## Constraint (por qué NO se buildea en cualquier lado)
- **NO buildear en el VPS**: swap al 100% → un build de Next puede OOM y tumbar prod.
- **NO buildear en Windows**: `web-factory` usa `sharp` (binario nativo).
- **Buildear en Linux glibc**: CI **ubuntu-latest** (o un host/contenedor Linux).

## Automatico (el arreglo de fondo)
GitHub Action **`.github/workflows/deploy-onia-center.yml`**:
- **push a `main` que toca `web-factory/**`** → build en ubuntu + deploy con swap
  automatico. Asi prod no vuelve a quedar atras de main.
- **manual** (`workflow_dispatch`): input `swap` — `false` = solo build+stage (no toca
  prod), `true` = promueve. Avisa el resultado a Sergio por Telegram.

Correr manual:
```bash
gh workflow run deploy-onia-center.yml -f swap=false   # validar build+stage
gh workflow run deploy-onia-center.yml -f swap=true    # promover a prod
gh run watch                                           # seguir el run
```

## El script (idempotente, versionado)
**`scripts/deploy-onia-center.sh`** (lo corre el Action; tambien corre en cualquier host
Linux con el repo + la llave SSH):
1. build standalone (`ONIA_STANDALONE_BUILD=true pnpm --filter site build`).
2. ensambla + tarball (excluye `public/nuvia` ~240MB → se **reusa del runtime vivo**).
3. sube + extrae a `runtime-next.new-<ts>`; verifica BUILD_ID + que aparezca "Agente Vendedor".
4. si `DEPLOY_SWAP=true`: `swap-and-verify.sh` (backup `runtime-next.bak-deploy-<ts>` →
   swap → `docker restart` → health-check → **rollback automatico** si no levanta).
5. verifica `/onia-center` (307) y `/onia-center/login` (200).
6. maintenance dry-run (matched debe seguir en 0).

Gates: build verde antes de swap; backup antes de swap; verificacion HTTP + Agente
Vendedor visible despues.

## Secrets del repo (GitHub Actions)
- `ONIA_VPS_SSH_KEY` — llave privada SSH del VPS (root). *(Rotar a una deploy-key
  dedicada es un pendiente; hoy reusa `onia_hermes_vps_ed25519`.)*
- `TELEGRAM_BOT_TOKEN`, `TELEGRAM_SERGIO_CHAT_ID` — aviso del resultado.

## Rollback manual
```bash
ssh -i <key> root@187.77.16.63 \
  'cd /opt/onia-center && ls -dt runtime-next.bak-* | head -1'   # ultimo backup
# restaurar: mv runtime-next runtime-next.bad && mv <bak> runtime-next && docker restart onia-center
```

## Sync completo de public/nuvia (cuando cambian assets de Nuvia)
El deploy reusa `public/nuvia` del runtime vivo. Si se agregan/cambian imagenes de
productos Nuvia, subirlas aparte al `runtime-next` (o hacer un deploy full incluyendo
`public/nuvia` en el tarball) — no lo cubre el pipeline por defecto (para mantener
los deploys livianos).

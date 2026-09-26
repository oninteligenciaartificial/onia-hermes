# Runbook — Deploy de ONIA Center (center.onia.com.bo)

Produccion = contenedor `onia-center` en el VPS (187.77.16.63), sirviendo un **Next
standalone** en `/opt/onia-center/runtime-next` (bind-mount → `/app`, `node server.js`,
PORT=3012, `--env-file /opt/onia-center/.env`). El deploy es por **tarball** (no git).

## ⚠️ Esta superficie NO tiene ruta publica — medido el 2026-09-13

Antes de desplegar aca, saber que hoy **nadie de afuera puede ver lo que publiques**:

- `curl https://center.onia.com.bo/` → **404**.
- En la config ACTIVA de traefik (`/etc/easypanel/traefik/config/onia-manual-routes.yaml`)
  el **servicio** `onia-center-manual` existe, pero de los **19 routers** **ninguno** lo
  usa. Al lado quedo el respaldo `onia-manual-routes.yaml.bak-bajar-center-20260829165348`:
  Sergio Urcullo bajo la ruta el **29-ago** a proposito.
- El contenedor no tiene labels de traefik ni puerto publicado al host; adentro corre
  `next-server` como PID 1, pero a oscuras.

El contenedor **igual no se apaga**: el bot de Onia vive adentro (`/tmp/onia-bot/`, puerto
interno 3020) y el auditor diario lo usa como runtime de node. **Bajar el deploy y bajar el
servicio son cosas distintas.**

Y **el sha vivo de esta superficie no se podia leer del disco**: `/opt/onia-center/runtime-next`
no tenia `.commit` ni `BUILD_ID` (a diferencia de landing y plataforma, que si los tienen y
por eso su deploy se puede medir). Lo unico que fechaba el ultimo deploy era el nombre del
backup: `runtime-next.bak-deploy-20260901214144` → **1-sep-2026**. Era la tercera razon para
no cablearla al `ok`: un destino que no se puede medir no se puede verificar despues.

⚠️ **Esa tercera razon ya no esta en pie — arreglado el 2026-09-26 por `onia-cola`.**
`scripts/deploy-onia-center.sh` ahora estampa el sha en **`$STAGE/.commit`** antes de armar el
tarball, asi que viaja al VPS con el runtime y el `mv` del swap lo deja en
`/opt/onia-center/runtime-next/.commit`. Se lee con
`docker exec onia-center cat /app/.commit` o, desde el host,
`cat /opt/onia-center/runtime-next/.commit`.
Lo cuidan los diez casos de `scripts/onia-center-sha-vivo.test.mjs` (cableado a `npm test`):
que lo estampe, que lo estampe **antes** del tarball —lo unico que viaja—, que no estampe
`unknown` (un sha inventado haria fallar al instrumento *en verde*, que es peor que no medir),
que resuelva `DEPLOY_REF=main` a un commit, y que el swap siga moviendo el arbol entero.
**Hoy el archivo todavia no existe en produccion**, y no puede existir hasta la proxima
publicacion: el build vivo es del 1-sep, anterior al estampado. Hasta entonces
`deploy:sin-pedido` sigue diciendo —con razon— que no hay sha vivo que comparar.

**Por eso `onia-center` NO se cablea como destino del `ok`** (la lista blanca de
`scripts/kanban/desplegar-en-segundo-plano.sh` tiene cuatro: landing, plataforma, bot,
SIAT). Cablear un quinto destino publicaria una superficie que nadie puede pedir. Se queda
**manual**, con este runbook. Si algun dia vuelve a haber un router apuntando a
`onia-center-manual`, esta decision vence y hay que rehacerla.

### Como se PIDE un deploy de aca (y por que no es `DESPLEGAR: onia-center`)

`npm run deploy:sin-pedido` mide este destino igual que a los cuatro cableados, y para
absolverlo necesita que **alguien lo este pidiendo** en el tablero. Pero la linea
`DESPLEGAR: onia-center` **no sirve**: muere en el ejecutor con «destino desconocido» y el
`ok` de Sergio Urcullo devuelve tilde verde sin publicar nada. Un pedido de aca se declara
de una de estas dos formas, y con cualquiera alcanza:

- **citando la ruta de este runbook** (`hermes-content/deploy/onia-center/RUNBOOK.md`), que
  es lo que un pedido accionable tiene que traer igual, o
- con la linea **`PUBLICAR A MANO: onia-center`** en el **cuerpo** (no en un comentario: el
  barrido usa `list --json`, que **no trae los comentarios**, y `edit` del tablero **no puede
  cambiar el cuerpo** — o nace con la linea, o se rehace la tarea).

⚠️ **Nombrarlo NO alcanza, y el motivo es medido (2026-09-26).** El criterio era la simple
mencion, y el bot de Onia corre DENTRO de este contenedor: ese dia **tres** tareas vivas
nombraban `onia-center` y solo UNA lo pedia — las otras dos eran la renovacion del VPS y las
23 ramas viejas, que lo nombran en un `docker exec` de paso. Un destino absuelto por una
mencion ajena es el mismo silencio por el que esta superficie corrio 15 dias con un build
viejo. Si el gate dice DESCUBIERTO y ya habia una tarea pidiendolo, **no abras otra**:
agregale la linea de arriba (rehaciendo la tarea) y archiva la vieja en la misma vuelta.

⚠️ **Y no confundir esta app con el intake de leads de `onia.com.bo`.** El intake es
`/api/agenda-intake` y vive en la app de la **landing** (`web-factory/apps/onia-platform`),
viva en produccion (`GET https://onia.com.bo/api/agenda-intake` → **405**, o sea la ruta
existe y solo acepta POST). Esta otra app es `web-factory/apps/site`.

## Constraint (por qué NO se buildea en cualquier lado)
- **NO buildear en el VPS**: swap al 100% → un build de Next puede OOM y tumbar prod.
- **NO buildear en Windows**: `web-factory` usa `sharp` (binario nativo).
- **Buildear en Linux glibc**: CI **ubuntu-latest** (o un host/contenedor Linux).

## SOLO MANUAL (y por que)
GitHub Action **`.github/workflows/deploy-onia-center.yml`**, **`workflow_dispatch`
unicamente**: input `swap` — `false` = solo build+stage (no toca prod), `true` = promueve.
Avisa el resultado a Sergio Urcullo por Telegram.

⚠️ **Corregido el 2026-09-13.** Aca decia que un **push a `main` que tocara
`web-factory/**`** disparaba build + swap automatico, y que «asi prod no vuelve a quedar
atras de main». Eso es **falso desde el 2026-08-31**, cuando se saco ese disparador — y el
motivo esta escrito en la cabecera del propio workflow: el Action publicaba **dos cosas
seguidas**, center y despues `onia.com.bo`, asi que cuando el paso de center murio, el paso
del landing **nunca corrio** y el sitio que ve un cliente quedo sin publicar desde el
**22-ago, con 77 commits acumulados**, sin que nada de su app estuviera roto. La frase vieja
prometia justo la garantia que ese incidente rompio, y hacia creer que pushear publica.
**Pushear no publica nada**: `onia.com.bo` se publica por su propio publicador
(`/opt/onia-landing/_deploy/publicar.sh`), no por este Action.

Volver al deploy automatico exige decidir antes que hacer con el paso de center — sacarlo,
o arreglarlo — y ademas devolverle la ruta (ver el bloque de arriba).

⚠️ **Los 4 archivos de esta carpeta tambien viven en `/opt/onia-center/_deploy/` y NADIE los
sincroniza.** Medido el 2026-09-13: `build-and-stage.sh`, `swap-and-verify.sh`,
`briefing-dryrun.js` y `maintenance-cleanup.js` tienen el **mismo md5** en los dos lados —
pero coinciden **por diligencia, no por construccion**. `scripts/loops/sincronizar.sh` solo
mantiene los `publicar.sh` de los destinos cableados, y aca no hay ninguno. Antes de correr
algo de `/opt/onia-center/_deploy/`, comparar md5 contra esta carpeta.

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

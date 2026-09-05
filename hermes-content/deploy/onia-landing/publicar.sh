#!/usr/bin/env bash
# Publica onia.com.bo. UN comando, SIN argumentos, que no caduca nunca.
#
# POR QUÉ EXISTE. El runbook de la casa era `swap-and-verify.sh <ruta-staged>`, y
# esa ruta lleva timestamp (`runtime-next.new-20260904124003`). Quien pide el
# deploy la mide, la escribe en la tarea del tablero, y ahí se queda quieta —
# mientras el build siguiente BORRA esa carpeta. Cuando Sergio contesta «ok», el
# swap corta con `ERR: bad STAGE path` y no publica nada, ningún día.
#
# Medido el 2026-09-04 sobre la MISMA tarea (t_cb722b7e), que envejeció tres
# veces en un día: a las 12:40 el staged traía viva una etiqueta que el commit
# siguiente ya había sacado; a las 16:41 se corrigió; a las 20:55 la carpeta ya
# no existía. Y el 2026-09-05 00:33, con el pedido escrito y esperando, la ruta
# seguía muerta y trece arreglos llevaban un día sin llegar al cliente.
#
# El fallo se disfraza de decisión pendiente: la tarea se lee como «espera el OK
# de Sergio» cuando en realidad ya es inejecutable, así que nadie mira la ruta.
# Arreglar el pedido tampoco alcanzó — se rehizo tres veces y las tres venció.
# Lo que se arregla acá es la CLASE de fallo: el comando deja de nombrar una
# carpeta. La deriva al ejecutarse, y si lo derivado está viejo, rearma.
#
# Uso:
#   bash /opt/onia-landing/_deploy/publicar.sh              # mide, arma si hace falta, publica
#   bash /opt/onia-landing/_deploy/publicar.sh --dry-run    # dice qué haría, NO toca producción
#
# Salidas: 0 publicado (o ya estaba al día) · 1 no se pudo publicar · 2 no se pudo medir.
set -uo pipefail

REPO=${ONIA_LOOPS_REPO:-/root/loops/onia-hermes}
DEPLOY=${ONIA_LANDING_DEPLOY:-/opt/onia-landing/_deploy}
GATE=$REPO/web-factory/apps/onia-platform/scripts/deploy-vivo.mjs
DRY=""
[ "${1:-}" = "--dry-run" ] && DRY=1

[ -f "$GATE" ] || { echo "ERR: no encuentro el medidor ($GATE)"; exit 2; }
cd "$REPO" || { echo "ERR: no puedo entrar a $REPO"; exit 2; }

# ── medir ───────────────────────────────────────────────────────────────────
# La lógica NO se reescribe acá: se importa de deploy-vivo.mjs, que ya distingue
# «no hay nada varado» de «no pude medir», sabe qué archivos viajan al navegador
# y qué staged aceptaría el swap. Duplicarla es como las dos copias se
# desincronizan y una publica lo que la otra frena.
medir() {
  git fetch origin --quiet 2>/dev/null || echo "aviso: fetch falló, mido contra el origin/main que tengo" >&2
  node --input-type=module -e '
    const m = await import(process.env.GATE_URL);
    const vivo = m.fechaBuildVivo();
    if (typeof vivo !== "number") { console.log("NO_PUDE_MEDIR\tno leo el BUILD_ID vivo\t"); process.exit(0); }
    const d = m.diagnosticar({ buildIdMtimeMs: vivo, commits: m.commitsDesde(vivo), homeStatus: m.estadoHome() });
    if (d.codigo === m.NO_PUDE_MEDIR) { console.log(`NO_PUDE_MEDIR\t${d.motivo}\t`); process.exit(0); }
    if (d.codigo === m.AL_DIA)        { console.log(`AL_DIA\t${d.motivo}\t`); process.exit(0); }
    const staged = m.stagedDisponible();
    const s = m.evaluarStaged({ staged, varados: d.varados });
    console.log(`${s.estado}\t${d.varados.length} arreglo(s) que el cliente no ve\t${staged ? staged.ruta : ""}`);
  '
}

export GATE_URL="file://$GATE"
IFS=$'\t' read -r ESTADO MOTIVO RUTA <<<"$(medir)"

case "${ESTADO:-}" in
  AL_DIA)        echo "YA ESTA PUBLICADO — $MOTIVO"; exit 0 ;;
  NO_PUDE_MEDIR) echo "ERR: no se pudo medir — $MOTIVO. NO publico a ciegas."; exit 2 ;;
  CUBRE|VIEJO|NINGUNO) echo "== hay que publicar: $MOTIVO ==" ;;
  *)             echo "ERR: el medidor no contestó (¿node roto?). NO publico a ciegas."; exit 2 ;;
esac

# ── armar, sólo si lo que hay en disco no alcanza ────────────────────────────
if [ "$ESTADO" != "CUBRE" ]; then
  echo "== el build armado no sirve ($ESTADO): rearmo desde origin/main =="
  if [ -n "$DRY" ]; then echo "[dry-run] correría: bash $DEPLOY/build-and-stage.sh"; else
    # Dos builds a la vez se pisan el directorio y ninguno se entera (medido el
    # 2026-09-03 en onia-platform: un swap ajeno se llevó el artefacto de otro).
    if ps -eo args | grep -F 'build-and-stage.sh' | grep -qv grep; then
      echo "ERR: ya hay un build-and-stage.sh corriendo. Esperá a que termine."; exit 1
    fi
    bash "$DEPLOY/build-and-stage.sh" || { echo "ERR: el build falló, no publico"; exit 1; }
  fi
  IFS=$'\t' read -r ESTADO MOTIVO RUTA <<<"$(medir)"
  [ "$ESTADO" = "AL_DIA" ] && { echo "YA ESTA PUBLICADO — $MOTIVO"; exit 0; }
  if [ "$ESTADO" != "CUBRE" ] && [ -z "$DRY" ]; then
    echo "ERR: ni recién armado el staged cubre lo varado ($ESTADO). NO publico."; exit 1
  fi
fi

# ── publicar ────────────────────────────────────────────────────────────────
if [ -n "$DRY" ]; then
  echo "[dry-run] publicaría: bash $DEPLOY/swap-and-verify.sh ${RUTA:-<el staged recién armado>}"
  echo "[dry-run] producción NO se tocó."
  exit 0
fi

[ -n "${RUTA:-}" ] || { echo "ERR: no hay staged que publicar"; exit 1; }
echo "== swap -> $RUTA =="
bash "$DEPLOY/swap-and-verify.sh" "$RUTA"
SWAP=$?
[ $SWAP -ne 0 ] && { echo "ERR: el swap no salió bien (código $SWAP). Mirá arriba: si dice ROLLED_BACK, producción ya volvió sola."; exit 1; }

# ── verificar que el cliente lo ve ──────────────────────────────────────────
# Un DEPLOY_OK sólo dice que la home contesta. Que lo varado haya llegado se
# comprueba volviendo a medir: es el mismo instrumento, sin fe de por medio.
echo "== verifico contra el sitio vivo =="
sleep 3
IFS=$'\t' read -r ESTADO MOTIVO RUTA <<<"$(medir)"
if [ "$ESTADO" = "AL_DIA" ]; then
  echo "PUBLICADO Y VERIFICADO — onia.com.bo sirve todo lo que main tiene."
  exit 0
fi
echo "AVISO: el swap salió bien pero el medidor sigue diciendo '$ESTADO' ($MOTIVO)."
echo "Puede ser un commit que entró a main mientras se publicaba. Volvé a correr este comando."
exit 1

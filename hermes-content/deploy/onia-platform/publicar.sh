#!/usr/bin/env bash
# Publica app.onia.com.bo. UN comando, SIN argumentos, que no caduca nunca.
#
# POR QUÉ EXISTE. El runbook de la casa es `build-and-stage.sh <sha>` y después
# `swap-imagen.sh <sha>` (hasta el 2026-09-24, `deploy-gates-swap.sh <sha>`).
# Quien pide el deploy mide ese sha, lo escribe en la tarea del tablero, y ahí se queda quieto — mientras `master` avanza. Cuando
# Sergio Urcullo contesta «ok», el comando publica el código de ayer con cara de
# nuevo, y en el peor caso RETROCEDE producción: el 2026-09-04 la tarea
# t_18ea4aff pedía publicar `build-a4b1d97` cuando ya corría `build-b5e23d4`,
# que lo incluye — el swap habría apagado el fix de la CSP del add-on de
# WhatsApp. Obedecer el pedido era peor que ignorarlo.
#
# `onia.com.bo` ya pagó esta clase de fallo tres veces en un día (t_cb722b7e) y
# la cerró con su propio `publicar.sh`. Esto es su gemelo para la plataforma:
# el comando deja de nombrar un sha y una carpeta. Los DERIVA al ejecutarse, y
# si lo derivado está viejo, rearma.
#
# Uso:
#   bash /opt/onia-platform/_deploy/publicar.sh              # mide, arma si hace falta, publica
#   bash /opt/onia-platform/_deploy/publicar.sh --dry-run    # dice qué haría, NO toca producción
#
# Salidas: 0 publicado (o ya estaba al día) · 1 no se pudo publicar · 2 no se pudo medir.
set -uo pipefail

REPO=${ONIA_LOOPS_REPO:-/root/loops/onia-hermes}
BASE=${ONIA_PLATFORM_BASE:-/opt/onia-platform}
GATE=$REPO/hermes-content/deploy/onia-platform/deploy-vivo.mjs
DRY=""
[ "${1:-}" = "--dry-run" ] && DRY=1

[ -f "$GATE" ] || { echo "ERR: no encuentro el medidor ($GATE)"; exit 2; }

# ── medir ───────────────────────────────────────────────────────────────────
# La lógica NO se reescribe acá: se importa de deploy-vivo.mjs, que ya distingue
# «no hay nada varado» de «no pude medir», sabe qué archivos viajan al navegador
# y qué sha corre de verdad. Duplicarla es como las dos copias se desincronizan
# y una publica lo que la otra frena.
medir() {
  GATE_URL="file://$GATE" node --input-type=module -e '
    const m = await import(process.env.GATE_URL);
    const r = m.medir();
    const nombre = { [m.AL_DIA]: "AL_DIA", [m.ARREGLOS_VARADOS]: "VARADOS", [m.NO_PUDE_MEDIR]: "NO_PUDE_MEDIR", [m.RETROCEDE]: "RETROCEDE" }[r.codigo];
    console.log([nombre, r.motivo, r.headSha ?? "", r.staged.estado].join("\t"));
  ' 2>/dev/null
}

IFS=$'\t' read -r ESTADO MOTIVO HEAD STAGED <<<"$(medir)"

case "${ESTADO:-}" in
  AL_DIA)        echo "YA ESTA PUBLICADO — $MOTIVO"; exit 0 ;;
  NO_PUDE_MEDIR) echo "ERR: no se pudo medir — $MOTIVO. NO publico a ciegas."; exit 2 ;;
  # El único veredicto que existe para no dañar: publicar retrocedería producción.
  RETROCEDE)     echo "ERR: $MOTIVO. NO publico: esto APAGARÍA arreglos que ya están vivos."; exit 1 ;;
  VARADOS)       echo "== hay que publicar: $MOTIVO (HEAD $HEAD, staged $STAGED) ==" ;;
  *)             echo "ERR: el medidor no contestó (¿node roto?). NO publico a ciegas."; exit 2 ;;
esac

[ -n "${HEAD:-}" ] || { echo "ERR: el medidor no devolvió el sha a publicar"; exit 2; }

# ── armar, sólo si lo que hay en disco no alcanza ────────────────────────────
if [ "$STAGED" != "CUBRE" ]; then
  echo "== el build armado no sirve ($STAGED): rearmo $HEAD desde origin/master =="
  if [ -n "$DRY" ]; then echo "[dry-run] correría: bash $BASE/build-and-stage.sh $HEAD"; else
    # Dos builds a la vez se pisan el directorio y ninguno se entera: el
    # 2026-09-03 un build ajeno de 1f0b221 falló dejando 40M sin .next/static y
    # el swap del otro proceso se llevó el artefacto equivocado a producción.
    # Salió sano de casualidad.
    if ps -eo args | grep -F 'build-and-stage.sh' | grep -qv grep; then
      echo "ERR: ya hay un build-and-stage.sh corriendo. Esperá a que termine."; exit 1
    fi
    bash "$BASE/build-and-stage.sh" "$HEAD" || { echo "ERR: el build falló, no publico"; exit 1; }
  fi
  IFS=$'\t' read -r ESTADO MOTIVO HEAD2 STAGED <<<"$(medir)"
  [ "$ESTADO" = "AL_DIA" ] && { echo "YA ESTA PUBLICADO — $MOTIVO"; exit 0; }
  if [ "$STAGED" != "CUBRE" ] && [ -z "$DRY" ]; then
    echo "ERR: ni recién armado el staged cubre el HEAD ($STAGED). NO publico."; exit 1
  fi
fi

# ── publicar ────────────────────────────────────────────────────────────────
# Desde el 2026-09-24 producción es una IMAGEN (onia-platform:release-<sha8>).
# Los gates de la imagen (BUILD_ID, node 22, cero .env, URL pública y anon key
# horneadas, cero valores QA) los corrió build-and-stage.sh; swap-imagen.sh hace el
# canario, el swap con el viejo RENOMBRADO, la verificación contra lo vivo y el
# rollback automático. Acá no se repiten: se le pasa el sha DERIVADO, que es lo
# único que este script agrega.
if [ -n "$DRY" ]; then
  echo "[dry-run] publicaría: bash $BASE/swap-imagen.sh $HEAD"
  echo "[dry-run] producción NO se tocó."
  exit 0
fi

echo "== swap -> $HEAD =="
bash "$BASE/swap-imagen.sh" "$HEAD"
SWAP=$?
[ $SWAP -ne 0 ] && { echo "ERR: el swap no salió bien (código $SWAP). Mirá arriba: el canario corta ANTES de tocar producción y el swap revierte solo."; exit 1; }

# ── verificar que el cliente lo ve ──────────────────────────────────────────
# Un «SWAP OK» sólo dice que el contenedor nuevo sirve su build. Que lo varado haya llegado se
# comprueba volviendo a medir: es el mismo instrumento, sin fe de por medio.
echo "== verifico contra la plataforma viva =="
sleep 5
IFS=$'\t' read -r ESTADO MOTIVO HEAD3 STAGED <<<"$(medir)"
if [ "$ESTADO" = "AL_DIA" ]; then
  echo "PUBLICADO Y VERIFICADO — app.onia.com.bo sirve todo lo que master tiene."
  exit 0
fi
echo "AVISO: el swap salió bien pero el medidor sigue diciendo '$ESTADO' ($MOTIVO)."
echo "Puede ser un commit que entró a master mientras se publicaba. Volvé a correr este comando."
exit 1

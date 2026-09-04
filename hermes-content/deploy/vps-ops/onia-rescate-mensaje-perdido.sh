#!/usr/bin/env bash
# Rescate del mensaje perdido — reinyecta por el webhook lo que Chatwoot disparo contra un
# puerto muerto. El porque, medido, esta en la cabecera de `bot/rescate-run.mjs`.
# Cron: 4,14,24,34,44,54 * * * *   Log: /var/log/onia-rescate-mensaje-perdido.log
#
# EL AGUJERO QUE TAPA: el webhook cuelga de `docker exec -d` sobre `onia-center`; cuando el
# contenedor reinicia se va con el, y el watchdog tarda hasta 2 min en levantarlo. En esa
# ventana Chatwoot dispara su UNICO webhook contra un puerto muerto y **no reintenta**: el
# mensaje no se contesta nunca. Veinte reinicios entre el 28-ago y el 3-sep, ~3 por dia.
#
# POR QUE ESTO NO ES UN DEPLOY, QUE ES LO QUE LO TENIA FRENADO:
# la cola daba por hecho que el barrido tenia que viajar a `/opt/onia/bot` —rsync, con OK de
# Sergio— para poder correr. Es falso, y se probo ejecutandolo: el barrido no es parte del
# motor, es un CLIENTE suyo. Lee Chatwoot por `docker exec` y postea al webhook por HTTP a
# 127.0.0.1, leyendo el secreto de `/opt/onia/bot/webhook.env` (que ya esta ahi). Corrido desde
# el repo el 2026-09-03 contra produccion devolvio `{"ok":true,"duplicate":true,"sent":[]}` —
# el circuito entero anda sin copiar un solo archivo al bot.
#
# ⚠️ `/opt/onia/bot/rescate-run.mjs` NO esta en los candidatos A PROPOSITO. Hay una copia vieja
# ahi (3-sep 01:58) sin el arreglo del 401 ni `clasificarRespuesta`: apuntarle seria cablear la
# version rota. Los candidatos son git, que es lo que se puede verificar.
#
# POR QUE BUSCA EL SCRIPT EN DOS LADOS Y NO EN UNO: el clon de `main` es el que manda, pero se
# actualiza cuando el integrador mergea; hasta ese momento el archivo solo existe en el worktree
# del carril. Un cron que apunte a un solo path arranca roto y se queda roto en silencio.
#
# 🔴 Y POR QUE AHORA COMPARA LOS DOS, medido el 2026-09-03: esa premisa cubre el caso *archivo
# nuevo*. El caso real de ese dia fue *archivo que existe en los dos y el del carril es mas
# nuevo* — el testigo del rescate se arreglo a las 10:25 UTC y a las 11:04 el cron seguia
# corriendo la copia vieja de `main`: 39 minutos y cuatro barridos con el arreglo ya pusheado.
# **El arreglo NO es dar vuelta el orden**: preferir siempre el worktree pondria codigo de
# carril sin revisar corriendo en produccion, que es peor que el problema. Lo que faltaba es
# que se VEA. Sigue corriendo el de `main`; ahora, cuando difieren, lo dice en su linea de log,
# y si la diferencia sobrevive al integrador (por defecto 2 h = dos pasadas) avisa UNA vez.
# Casos: `scripts/rescate_envoltorio.test.mjs`.
set -uo pipefail

# Los defaults son produccion; el env existe para poder probar el artefacto de verdad.
CANDIDATOS_POR_DEFECTO=(
  /root/loops/onia-hermes/hermes-content/deploy/vps-ops/bot/rescate-run.mjs
  /root/loops/onia-hermes-chatbot/hermes-content/deploy/vps-ops/bot/rescate-run.mjs
)
if [ -n "${ONIA_RESCATE_CANDIDATOS:-}" ]; then
  IFS=':' read -r -a CANDIDATOS <<< "$ONIA_RESCATE_CANDIDATOS"
else
  CANDIDATOS=("${CANDIDATOS_POR_DEFECTO[@]}")
fi

TG_BIN=${ONIA_TG_BIN:-/root/bin/onia-tg.sh}
ESTADO=${ONIA_RESCATE_ESTADO:-/var/tmp/onia-rescate-divergencia.estado}
UMBRAL_S=${ONIA_RESCATE_UMBRAL_S:-7200}   # dos pasadas del integrador, que mergea cada hora

SCRIPT=""
for c in "${CANDIDATOS[@]}"; do
  [ -f "$c" ] && { SCRIPT="$c"; break; }
done

if [ -z "$SCRIPT" ]; then
  echo "$(date -u +%FT%TZ) FALLO: no encontre rescate-run.mjs en ninguno de los candidatos"
  "$TG_BIN" "🔴 <b>Rescate del mensaje perdido</b>: no encuentro su script — un mensaje que llegue con el webhook caido se pierde para siempre" >/dev/null 2>&1
  exit 1
fi

echo "$(date -u +%FT%TZ) usando $SCRIPT"

# ¿Algun otro candidato existe y NO es el mismo archivo? Elegir en silencio es lo que dejo un
# arreglo fuera de produccion 39 minutos sin que nada lo dijera.
DIFERENTES=()
VARADOS=()   # los que ademas son MAS NUEVOS: un arreglo esperando merge, que es el caso caro
for c in "${CANDIDATOS[@]}"; do
  [ "$c" = "$SCRIPT" ] && continue
  [ -f "$c" ] || continue
  if ! cmp -s "$c" "$SCRIPT"; then
    DIFERENTES+=("$c")
    [ "$c" -nt "$SCRIPT" ] && VARADOS+=("$c")
  fi
done

if [ ${#DIFERENTES[@]} -eq 0 ]; then
  rm -f "$ESTADO"
  node "$SCRIPT" --emit
  exit $?
fi

if [ ${#VARADOS[@]} -gt 0 ]; then
  echo "$(date -u +%FT%TZ) DIFERENTE y MAS NUEVO: ${VARADOS[*]} — corro el de main igual, pero ese arreglo NO esta en produccion hasta que el integrador lo mergee"
else
  echo "$(date -u +%FT%TZ) DIFERENTE (mas viejo, inofensivo): ${DIFERENTES[*]} — worktree atrasado, corro el de main"
  rm -f "$ESTADO"
  node "$SCRIPT" --emit
  exit $?
fi

# Un arreglo varado media hora es lo normal (el integrador mergea cada hora). Uno varado dos
# pasadas ya no lo es: ahi si vale despertar a alguien, y UNA sola vez — seis barridos por hora
# repitiendo la misma alarma es como se deja de creerle a los avisos.
AHORA=$(date -u +%s)
CLAVE=$(sha256sum "$SCRIPT" "${VARADOS[@]}" 2>/dev/null | awk '{print $1}' | sha256sum | cut -c1-16)
PRIMERA=$AHORA
AVISADO=0
if [ -f "$ESTADO" ]; then
  read -r CLAVE_VIEJA PRIMERA_VIEJA AVISADO_VIEJO < "$ESTADO" || true
  if [ "${CLAVE_VIEJA:-}" = "$CLAVE" ]; then
    PRIMERA=${PRIMERA_VIEJA:-$AHORA}
    AVISADO=${AVISADO_VIEJO:-0}
  fi
fi

if [ "$AVISADO" -eq 0 ] && [ $((AHORA - PRIMERA)) -ge "$UMBRAL_S" ]; then
  "$TG_BIN" "⚠️ <b>Rescate del mensaje perdido</b>: hace más de $((UMBRAL_S / 3600)) h que corro una versión vieja. El arreglo está en <code>${VARADOS[0]}</code> y el integrador no lo mergeó a main." >/dev/null 2>&1
  AVISADO=1
fi
echo "$CLAVE $PRIMERA $AVISADO" > "$ESTADO"

node "$SCRIPT" --emit

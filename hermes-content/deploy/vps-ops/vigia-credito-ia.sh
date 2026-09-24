#!/usr/bin/env bash
# ONIA — VIGIA DEL CREDITO DE IA.
#
# POR QUE EXISTE (2026-09-24, auditoria de IA). Del 9 al 17-sep OpenAI se quedo sin
# credito y nadie se entero: 194 llamadas fallidas, y el bot cayo en silencio a su texto
# fijo. Nadie ve un error: ve respuestas peores. Toda la IA real pasa por LiteLLM
# (contenedor onia_selfhosted-litellm-1, modelos openai/*), asi que sus logs son el unico
# lugar donde el fallo se ve.
#
# QUE MIRA (cron cada 15 min): los ultimos 20 min de `docker logs` de LiteLLM, buscando
# fallos del PROVEEDOR que no se arreglan solos:
#   - cuota:       sin credito o tope de facturacion (insufficient_quota, "exceeded your
#                  current quota", billing_hard_limit, "credit balance is too low").
#   - clave:       el proveedor rechaza la API key (Incorrect API key provided,
#                  invalid_api_key, account_deactivated, litellm.AuthenticationError).
#   - presupuesto: el tope PROPIO de LiteLLM (max_budget global 50 USD/30 d y 5-10 USD por
#                  key, medido 2026-09-24). Mismo efecto: el bot contesta con texto fijo.
# 🔴 NO cuenta los 401/403 del proxy ("No api key passed in", "key not allowed to access
# model"): son clientes sin key o con key de otro modelo, ~23 por semana medidos el 24-sep,
# y ninguna de sus frases esta en la lista (en el fuente de LiteLLM, proxy/auth solo produce
# las de presupuesto). Por eso la lista son frases del proveedor y no "401" ni "429".
#
# UN aviso DIRECTO por incidente (ONIA_TG_DIRECTO=1): cargar credito es plata de Sergio
# Urcullo, no trabajo de un loop. La firma (clases de error) queda en $ESTADO/abierto y se
# escribe SOLO si Telegram confirmo; si cambia la firma, aviso nuevo.
# RECUPERACION: 60 min sin fallos Y al menos una llamada que salio bien en esa hora. El
# trafico es bajo (~32 llamadas/dia, huecos de 2 h): "60 min sin fallos" solo avisaria
# "volvio" en medio del apagon, en cada hueco sin trafico.
#
# NUNCA IMPRIME CLAVES, por construccion: ni el aviso ni el log llevan texto crudo del log
# (OpenAI devuelve la key enmascarada en el error). Solo la frase de nuestra lista que
# coincidio y el nombre del proveedor ([A-Za-z]).
#
# Si no puede leer los logs (docker caido o colgado, contenedor renombrado, o 20 min sin
# una sola linea con un healthcheck cada 30 s = LiteLLM parado) lo dice UNA vez por el
# camino por defecto (tarea del tablero) y la cierra cuando vuelve.
#
# SOLO LECTURA: docker logs. No reinicia nada.
#
# Cron propuesto: 3,18,33,48 * * * * /root/bin/onia-vigia-credito-ia.sh >> /var/log/onia-vigia-credito-ia.log 2>&1
set -uo pipefail

TG="${ONIA_TG:-/root/bin/onia-tg.sh}"
TABLERO="${ONIA_TABLERO:-/root/bin/onia-tablero.sh}"
ESTADO="${ONIA_CREDITO_IA_ESTADO:-/var/lib/onia-vigia-credito-ia}"
C="${ONIA_LITELLM_CONTAINER:-onia_selfhosted-litellm-1}"
ABIERTO="$ESTADO/abierto"              # existe = incidente avisado; guarda la firma
SIN_LOGS="$ESTADO/sin-logs.avisado"    # incidente de lectura; guarda el id de su tarea

CUOTA='insufficient_quota|exceeded your current quota|billing_hard_limit|billing hard limit|credit balance is too low'
CLAVE_FRASE='Incorrect API key provided|invalid_api_key|account_deactivated'
CLAVE="$CLAVE_FRASE|litellm(\.exceptions)?\.AuthenticationError"
PRESUPUESTO='Budget has been exceeded|budget_exceeded|BudgetExceededError|ExceededTokenBudget'
EXITO='"POST /(v1/)?(chat/completions|completions|responses|embeddings|audio/[a-z]+)[^"]*" 200'

mkdir -p "$ESTADO" || { echo "$(date -u +%FT%TZ) FALLO: no puedo escribir $ESTADO"; exit 1; }
log() { printf '%s %s\n' "$(date -u +%FT%TZ)" "$*"; }
directo() { ONIA_TG_DIRECTO=1 "$TG" "$1" >/dev/null 2>&1; }
leer() { timeout 60 docker logs --since "$1" "$C" 2>&1; }
# Lineas de un log que son fallo del proveedor, con la clase delante.
fallos() {
  printf '%s\n' "$1" | grep -iE "$PRESUPUESTO" | sed 's/^/presupuesto /'
  printf '%s\n' "$1" | grep -iE "$CUOTA" | sed 's/^/cuota /'
  printf '%s\n' "$1" | grep -iE "$CLAVE" | grep -viE "$CUOTA" | sed 's/^/clave /'
}

LOGS=$(leer 20m)
RC=$?

# ── No se pueden leer los logs: un aviso por incidente, al tablero ──────────
if [ "$RC" -ne 0 ] || [ -z "$LOGS" ]; then
  if [ "$RC" -eq 124 ]; then POR="docker no contesta en 60 s"
  elif [ "$RC" -ne 0 ]; then POR="docker logs fallo (rc=$RC)"
  else POR="ni una linea en 20 min: LiteLLM parado?"; fi
  if [ ! -f "$SIN_LOGS" ]; then
    ID=$("$TG" "🔴 <b>Vigia de credito de IA: no puedo leer los logs de LiteLLM</b>
<code>$C</code>: $POR.
Mientras siga asi, si OpenAI se queda sin credito nadie se entera (paso del 9 al 17-sep)." 2>/dev/null | grep -oE 't_[0-9a-f]{8}' | head -1)
    printf '%s' "$ID" > "$SIN_LOGS"
  fi
  log "FALLO leyendo los logs de $C: $POR"
  exit 1
fi
if [ -f "$SIN_LOGS" ]; then
  TAREA=$(grep -oE 't_[0-9a-f]{8}' "$SIN_LOGS" | head -1)
  "$TG" "🟢 <b>Vigia de credito de IA</b> vuelve a leer los logs de LiteLLM." >/dev/null 2>&1 || true
  if [ -n "$TAREA" ] && [ -x "$TABLERO" ]; then
    "$TABLERO" comment "$TAREA" "Cerrada por el vigia de credito de IA: los logs de LiteLLM volvieron a leerse." >/dev/null 2>&1 || true
    "$TABLERO" complete "$TAREA" >/dev/null 2>&1 || true
  fi
  rm -f "$SIN_LOGS"
  log "los logs de $C vuelven a leerse"
fi

# ── Fallos del proveedor en la ventana ───────────────────────────────────────
F=$(fallos "$LOGS")
if [ -n "$F" ]; then
  FIRMA=$(printf '%s\n' "$F" | cut -d' ' -f1 | sort -u | tr '\n' ' ' | sed 's/ $//')
  N=$(printf '%s\n' "$F" | grep -c .)
  if [ -f "$ABIERTO" ] && [ "$(cat "$ABIERTO")" = "$FIRMA" ]; then
    log "sigue fallando, ya avisado: $FIRMA ($N lineas)"
    exit 0
  fi
  CLASE=$(printf '%s\n' "$F" | head -1 | cut -d' ' -f1)   # la mas grave: fallos() las ordena
  # La frase mas especifica que coincidio; "AuthenticationError" a secas solo si no hay otra.
  FRASE=$(printf '%s\n' "$F" | grep -oiE "$PRESUPUESTO|$CUOTA|$CLAVE_FRASE" | head -1)
  FRASE=${FRASE:-AuthenticationError}
  PROV=$(printf '%s\n' "$F" | grep -oE '[A-Za-z]{2,30}Exception - ' | head -1 | sed 's/Exception - //')
  case "$CLASE" in
    presupuesto) TITULO="LiteLLM corto por presupuesto"; ARREGLO="se renueve el ciclo de 30 d o se suba el tope (50 USD global, 5-10 USD por key): antes de subirlo, ver quien consumio" ;;
    cuota)       TITULO="${PROV:-El proveedor} se quedo sin credito"; ARREGLO="se cargue credito en ${PROV:-el proveedor} (despues LiteLLM puede seguir fallando unos minutos: probar directo contra la API antes de concluir que no entro)" ;;
    *)           TITULO="${PROV:-El proveedor} rechaza la API key"; ARREGLO="se arregle la key en /opt/onia-selfhosted (config de LiteLLM)" ;;
  esac
  if directo "🔴 <b>IA caida: $TITULO</b>
Error: <code>$FRASE</code> — $N linea(s) de error en LiteLLM en los ultimos 20 min.
El bot y los agentes estan contestando con TEXTO FIJO hasta que $ARREGLO."; then
    printf '%s' "$FIRMA" > "$ABIERTO"
    log "ALERTA enviada: $FIRMA ($N lineas)"
  else
    log "FALLO Telegram con la alerta (se reintenta en la proxima vuelta): $FIRMA"
  fi
  exit 0
fi

# ── Sin fallos: cerrar el incidente si ya paso la hora limpia ───────────────
[ -f "$ABIERTO" ] || exit 0
HORA=$(leer 60m) || { log "no pude leer la ultima hora: la recuperacion espera"; exit 0; }
if [ -n "$(fallos "$HORA")" ]; then log "incidente abierto: hubo fallos en la ultima hora"; exit 0; fi
if ! printf '%s\n' "$HORA" | grep -qE "$EXITO"; then log "incidente abierto: sin fallos pero sin ninguna llamada buena en 60 min"; exit 0; fi
if directo "🟢 <b>IA de vuelta</b>: 60 min sin errores de credito ni de clave en LiteLLM, y las llamadas salen bien. El bot vuelve a contestar con IA."; then
  rm -f "$ABIERTO"
  log "recuperado: se aviso"
else
  log "FALLO Telegram con la recuperacion (se reintenta en la proxima vuelta)"
fi
exit 0

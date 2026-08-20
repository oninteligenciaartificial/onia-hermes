#!/usr/bin/env bash
# Canario de FLUJO del guardian de Onia — hermano de claude-guardia.sh (lo llama el).
# Vive en /root/bin/claude-guardia-canario.sh del VPS; este archivo es el espejo.
#
# El guardian mira contenedores arriba; esto prueba flujos de punta a punta.
# Nace del 2026-08-17: el REGISTRO estuvo caido ~10 h (Kong 503 por alias de
# red perdido) con todos los contenedores "running" — el guardian no lo vio.
#
# Anti-spam: cada canario avisa UNA vez por caida (estado en /root/.guardia-estado)
# y avisa la recuperacion. Claves Telegram: /root/.hermes/.env, igual que el guardian.
set -uo pipefail
set -a; . /root/.hermes/.env 2>/dev/null; set +a
EST=/root/.guardia-estado; mkdir -p "$EST"
BASE=${CANARIO_BASE:-https://app.onia.com.bo}   # override solo para simular fallos en pruebas

tg() {
  curl -s -o /dev/null --max-time 20 "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
    -d chat_id="${TELEGRAM_HOME_CHANNEL}" -d parse_mode=HTML --data-urlencode text="$1"
}

# canario <nombre> <ok:1|0> <detalle si cae>
canario() {
  local f="$EST/$1.caido"
  if [ "$2" -eq 1 ]; then
    if [ -f "$f" ]; then
      local desde; desde=$(cat "$f" 2>/dev/null)
      rm -f "$f"
      tg "✅ <b>Canario Onia</b> — flujo <b>$1</b> recuperado (caido desde $desde)."
    fi
  elif [ ! -f "$f" ]; then
    date '+%F %T' > "$f"
    tg "🚨 <b>Canario Onia</b> — flujo <b>$1</b> CAIDO
$3
<i>Aviso unico; avisare la recuperacion.</i>"
  fi
}

# ── 1. pagina de login responde
C=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "$BASE/login") || C=000
[ "$C" = 200 ] && OK=1 || OK=0
canario login-page "$OK" "GET $BASE/login devolvio HTTP $C (esperaba 200 en &lt;10s)."

# ── 2. auth REAL: signup sin apikey debe dar 401 (Kong→GoTrue vivos).
# 503/timeout = la cadena Kong→auth rota (el bug del alias del 2026-08-17).
C=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 -X POST \
  -H 'Content-Type: application/json' -d '{}' "$BASE/supabase/auth/v1/signup") || C=000
[ "$C" = 401 ] && OK=1 || OK=0
canario auth-kong "$OK" "POST /supabase/auth/v1/signup sin apikey devolvio HTTP $C (esperaba 401 = Kong→GoTrue vivos). ¿Alias 'auth' perdido? Fix probable: <code>docker network connect --alias auth --alias supabase-auth2 supabase_default supabase-auth2</code>. Con esto se cayo el registro ~10 h."

# ── 3. motor del bot: /health de onia-center (sin curl en el contenedor; wget si hay)
B=$(docker exec onia-center wget -qO- -T 10 http://localhost:3020/health 2>/dev/null) || B=""
case "$B" in *'"ok":true'*) OK=1 ;; *) OK=0 ;; esac
canario bot-engine "$OK" "onia-center http://localhost:3020/health no devolvio ok:true. Respuesta: <code>$(echo "$B" | head -c 150)</code>"

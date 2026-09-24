#!/usr/bin/env bash
# Prueba de `vigia-credito-ia.sh`, con `docker` (o sea los logs de LiteLLM), `timeout` y
# Telegram sustituidos: sin red, sin VPS y sin mandarle nada a Sergio Urcullo.
#
# Lo que se prueba es cuando habla y cuando calla. Los casos que justifican el archivo:
#   - el ruido del proxy (401 "No api key passed in", ~23 por semana medidos el 24-sep)
#     NO es un apagon: si el vigia grita por eso, nadie lo lee el dia que importa.
#   - la recuperacion exige una llamada BUENA: con ~32 llamadas por dia, "60 min sin
#     errores" en medio del apagon es solo un hueco sin trafico.
#   - ninguna key (ni enmascarada) sale en el aviso ni en el log.
# Las lineas de los fixtures copian el formato real de LiteLLM (colores ANSI incluidos).
set -uo pipefail

DIR=$(cd "$(dirname "$0")" && pwd)
SUT="$DIR/vigia-credito-ia.sh"
TIMEOUT_REAL=$(command -v timeout)
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/bin" "$TMP/estado" "$TMP/logs"

FALLOS=0
ok()    { printf '  ok   - %s\n' "$1"; }
falla() { printf '  FALLA - %s\n     esperaba: %s\n     obtuvo:   %s\n' "$1" "$2" "$3"; FALLOS=$((FALLOS+1)); }

# docker falso: `docker logs --since <v> <contenedor>` devuelve $TMP/logs/<v>.txt.
# DOCKER_RC != 0 imita al daemon caido o al contenedor que no existe; DOCKER_CUELGA=1 al colgado.
cat > "$TMP/bin/docker" <<'FIN'
#!/usr/bin/env bash
printf '%s\n' "$*" >> "$TMP_DOCKER"
[ "${DOCKER_CUELGA:-0}" = "1" ] && exec sleep 30
[ "${DOCKER_RC:-0}" = "0" ] || { echo "Error response from daemon: No such container: $4" >&2; exit "$DOCKER_RC"; }
cat "$TMP_LOGS/$3.txt" 2>/dev/null
FIN
cat > "$TMP/bin/timeout" <<'FIN'
#!/usr/bin/env bash
printf '%s\n' "$*" >> "$TMP_TIMEOUT"
shift
exec "$TIMEOUT_REAL" "${TIMEOUT_PRUEBA:-20}" "$@"
FIN
# Telegram falso: anota si fue DIRECTO; imita al enrutador (🔴 por defecto -> TAREA <id>).
cat > "$TMP/tg.sh" <<'FIN'
#!/usr/bin/env bash
printf 'DIRECTO=%s\n%s\n---\n' "${ONIA_TG_DIRECTO:-0}" "$1" >> "$TMP_MENSAJES"
[ "${TG_FALLA:-0}" = "1" ] && exit 1
case "$1" in *🔴*) [ "${ONIA_TG_DIRECTO:-0}" = "1" ] || printf 'TAREA t_c0ffee01\n' ;; esac
exit 0
FIN
cat > "$TMP/tablero.sh" <<'FIN'
#!/usr/bin/env bash
printf '%s %s\n' "$1" "${2:-}" >> "$TMP_TABLERO"
FIN
chmod 755 "$TMP"/bin/* "$TMP/tg.sh" "$TMP/tablero.sh"

E=$'\033'
SANO="INFO:     127.0.0.1:50122 - \"GET /health/liveliness HTTP/1.1\" 200 OK"
BUENA="INFO:     172.21.0.1:44618 - \"POST /v1/chat/completions HTTP/1.1\" 200 OK"
CUOTA="${E}[92m21:04:24 - LiteLLM Proxy:ERROR${E}[0m: proxy_server.py:3965 - litellm.proxy.proxy_server._handle_llm_api_exception(): Exception occured - litellm.RateLimitError: RateLimitError: OpenAIException - You exceeded your current quota, please check your plan and billing details. Received Model Group=gpt-4.1-mini
litellm.exceptions.RateLimitError: litellm.RateLimitError: RateLimitError: OpenAIException - {\"error\":{\"message\":\"You exceeded your current quota\",\"type\":\"insufficient_quota\",\"code\":\"insufficient_quota\"}}
INFO:     172.21.0.1:44618 - \"POST /v1/chat/completions HTTP/1.1\" 429 Too Many Requests"
CLAVE="${E}[92m21:04:24 - LiteLLM Proxy:ERROR${E}[0m: proxy_server.py:3965 - litellm.proxy.proxy_server._handle_llm_api_exception(): Exception occured - litellm.AuthenticationError: AuthenticationError: OpenAIException - Incorrect API key provided: sk-proj-AbCd1234********************wxyz. You can find your API key at https://platform.openai.com/account/api-keys.
INFO:     172.21.0.1:44618 - \"POST /v1/chat/completions HTTP/1.1\" 401 Unauthorized"
PRESUP="${E}[92m21:04:24 - LiteLLM Proxy:ERROR${E}[0m: auth_exception_handler.py:78 - litellm.proxy.proxy_server.user_api_key_auth(): Exception occured - Budget has been exceeded! Key=88dc28d0f030c55ed4ab77ed8faf098196cb1c05df77 Current cost: 10.02, Max budget: 10.0"
# Ruido real del proxy, copiado del VPS el 2026-09-24: la key del CLIENTE, no del proveedor.
PROXY="${E}[92m20:11:02 - LiteLLM Proxy:ERROR${E}[0m: auth_exception_handler.py:78 - litellm.proxy.proxy_server.user_api_key_auth(): Exception occured - No api key passed in.
Exception: No api key passed in.
litellm.proxy._types.ProxyException: key not allowed to access model. This key can only access models=['gpt-4.1-mini']. Tried to access gpt-5.1
Exception: Malformed API Key passed in. Ensure Key has \`Bearer \` prefix.
INFO:     172.21.0.1:44618 - \"POST /v1/chat/completions HTTP/1.1\" 401 Unauthorized
INFO:     172.21.0.1:44618 - \"POST /v1/chat/completions HTTP/1.1\" 403 Forbidden"

logs() { printf '%s\n' "$2" > "$TMP/logs/$1.txt"; }   # <ventana> <contenido>
run() {
  : > "$TMP/mensajes.txt"; : > "$TMP/tablero.txt"; : > "$TMP/timeout.txt"; : > "$TMP/docker.txt"
  PATH="$TMP/bin:$PATH" TIMEOUT_REAL="$TIMEOUT_REAL" \
  TMP_LOGS="$TMP/logs" TMP_DOCKER="$TMP/docker.txt" TMP_TIMEOUT="$TMP/timeout.txt" \
  TMP_MENSAJES="$TMP/mensajes.txt" TMP_TABLERO="$TMP/tablero.txt" \
  ONIA_TG="$TMP/tg.sh" ONIA_TABLERO="$TMP/tablero.sh" ONIA_CREDITO_IA_ESTADO="$TMP/estado" \
  bash "$SUT" > "$TMP/salida.txt" 2>&1
  RC=$?
  MSGS=$(cat "$TMP/mensajes.txt")
}
cuantos() { grep -c '^---$' "$TMP/mensajes.txt"; }
sin_claves() {  # <que> : ni la key enmascarada ni su cola, en el aviso ni en el log
  if grep -qE 'sk-|wxyz|AbCd1234|88dc28d0' "$TMP/mensajes.txt" "$TMP/salida.txt"; then
    falla "$1: sin claves" "ni sk- ni la cola de la key" "$(grep -hE 'sk-|wxyz|AbCd1234|88dc28d0' "$TMP/mensajes.txt" "$TMP/salida.txt")"
  else ok "$1: ninguna key en el aviso ni en el log"; fi
}

echo "vigia-credito-ia - cuando habla y cuando calla"

# 1. Logs limpios: silencio.
logs 20m "$SANO
$BUENA"; run
[ -z "$MSGS" ] && [ "$RC" = 0 ] && ok "logs limpios: no manda nada" || falla "logs limpios" "(nada, rc 0)" "rc=$RC $MSGS"
grep -q '^60 docker logs --since 20m onia_selfhosted-litellm-1$' "$TMP/timeout.txt" \
  && ok "lee 20 min de onia_selfhosted-litellm-1 con timeout 60" || falla "lectura" "60 docker logs --since 20m onia_selfhosted-litellm-1" "$(cat "$TMP/timeout.txt")"

# 2. El ruido del proxy (401/403 de la key del cliente) NO es un apagon.
logs 20m "$SANO
$PROXY"; run
[ -z "$MSGS" ] && ok "401/403 del proxy (No api key, key not allowed): SILENCIO" || falla "ruido del proxy" "(nada)" "$MSGS"

# 3. Sin credito: UN aviso DIRECTO que dice que error y que el bot contesta con texto fijo.
logs 20m "$SANO
$CUOTA"; run
[ "$(cuantos)" = 1 ] && ok "sin credito: un aviso" || falla "sin credito" "1 aviso" "$MSGS"
case "$MSGS" in DIRECTO=1*) ok "va DIRECTO a Telegram, no al tablero" ;; *) falla "directo" "DIRECTO=1" "$MSGS" ;; esac
for dato in "OpenAI se quedo sin credito" "exceeded your current quota" "TEXTO FIJO" "se cargue credito en OpenAI"; do
  case "$MSGS" in *"$dato"*) ok "el aviso trae: $dato" ;; *) falla "dato del aviso" "$dato" "$MSGS" ;; esac
done
sin_claves "sin credito"

# 4. El mismo incidente en la vuelta siguiente: silencio.
run
[ -z "$MSGS" ] && ok "sigue sin credito: SILENCIO (un aviso por incidente)" || falla "repite" "(nada)" "$MSGS"

# 5. Recuperacion: 60 min limpios Y una llamada buena. Sin las dos, el incidente sigue.
logs 20m "$SANO"; logs 60m "$SANO
$CUOTA"; run
[ -z "$MSGS" ] && ok "20 min limpios pero fallo en la hora: no declara recuperado" || falla "recuperacion temprana" "(nada)" "$MSGS"
logs 60m "$SANO"; run
[ -z "$MSGS" ] && ok "hora limpia pero SIN trafico: no declara recuperado (hueco no es arreglo)" || falla "recuperacion sin trafico" "(nada)" "$MSGS"
[ -f "$TMP/estado/abierto" ] && ok "el incidente sigue abierto" || falla "incidente" "abierto" "cerrado"
logs 60m "$SANO
$BUENA"; run
case "$MSGS" in DIRECTO=1*"IA de vuelta"*) ok "hora limpia con una llamada buena: avisa que volvio, DIRECTO" ;; *) falla "recuperacion" "DIRECTO=1 ... IA de vuelta" "${MSGS:-(nada)}" ;; esac
[ -f "$TMP/estado/abierto" ] && falla "incidente" "cerrado" "sigue abierto" || ok "cierra el incidente"
run
[ -z "$MSGS" ] && ok "ya recuperado: silencio" || falla "post recuperacion" "(nada)" "$MSGS"

# 6. La key rechazada: otro aviso, sin la key (OpenAI la devuelve enmascarada en el error).
logs 20m "$CLAVE"; run
case "$MSGS" in DIRECTO=1*"OpenAI rechaza la API key"*"Incorrect API key provided"*"TEXTO FIJO"*) ok "key rechazada: aviso con el error del proveedor" ;; *) falla "key rechazada" "OpenAI rechaza la API key ... Incorrect API key provided" "$MSGS" ;; esac
sin_claves "key rechazada"

# 7. Cambia la clase dentro del incidente (key -> credito): aviso nuevo.
logs 20m "$CUOTA"; run
case "$MSGS" in *"sin credito"*) ok "cambia de key a credito: avisa de nuevo" ;; *) falla "firma nueva" "aviso de credito" "${MSGS:-(nada)}" ;; esac

# 8. Si Telegram falla, el incidente NO queda avisado y se reintenta.
rm -f "$TMP/estado/abierto"
TG_FALLA=1 run
[ -f "$TMP/estado/abierto" ] && falla "fallo de Telegram" "sin marcar" "quedo marcado" || ok "Telegram fallo: no lo da por avisado"
run
case "$MSGS" in *"sin credito"*) ok "la vuelta siguiente lo reintenta" ;; *) falla "reintento" "aviso de credito" "${MSGS:-(nada)}" ;; esac

# 9. El tope PROPIO de LiteLLM: mismo efecto, otro arreglo. Pasa por user_api_key_auth y
#    aun asi cuenta (el filtro del proxy es solo para las lineas de key).
rm -f "$TMP/estado/abierto"
logs 20m "$PRESUP"; run
case "$MSGS" in DIRECTO=1*"LiteLLM corto por presupuesto"*"Budget has been exceeded"*) ok "presupuesto de LiteLLM agotado: avisa" ;; *) falla "presupuesto" "LiteLLM corto por presupuesto" "${MSGS:-(nada)}" ;; esac
sin_claves "presupuesto"
rm -f "$TMP/estado/abierto"

# 10. docker no puede leer: UN aviso por el camino por defecto (tarea), y sale != 0.
DOCKER_RC=1 run
[ "$RC" != 0 ] && ok "docker caido: sale con error" || falla "rc docker caido" "!= 0" "$RC"
case "$MSGS" in DIRECTO=0*"no puedo leer los logs de LiteLLM"*"rc=1"*) ok "avisa por el camino por defecto (tarea del tablero)" ;; *) falla "aviso docker caido" "DIRECTO=0 ... no puedo leer los logs" "$MSGS" ;; esac
DOCKER_RC=1 run
[ -z "$MSGS" ] && ok "sigue caido: SILENCIO" || falla "docker caido repite" "(nada)" "$MSGS"
logs 20m "$SANO"; run
case "$MSGS" in *"vuelve a leer los logs"*) ok "vuelve: lo dice" ;; *) falla "vuelta" "vuelve a leer los logs" "${MSGS:-(nada)}" ;; esac
case "$(cat "$TMP/tablero.txt")" in *"complete t_c0ffee01"*) ok "cierra la tarea del incidente" ;; *) falla "cierre de tarea" "complete t_c0ffee01" "$(cat "$TMP/tablero.txt")" ;; esac

# 11. docker colgado: no espera para siempre, y lo dice.
INICIO=$SECONDS
DOCKER_CUELGA=1 TIMEOUT_PRUEBA=2 run
[ $((SECONDS - INICIO)) -lt 15 ] && ok "docker colgado: corta, no espera" || falla "docker colgado" "< 15 s" "$((SECONDS - INICIO)) s"
case "$MSGS" in *"docker no contesta"*) ok "docker colgado: avisa que no contesta" ;; *) falla "aviso colgado" "docker no contesta" "${MSGS:-(nada)}" ;; esac
logs 20m "$SANO"; run

# 12. 20 min sin una sola linea (con healthcheck cada 30 s) = LiteLLM parado: tampoco es "todo bien".
: > "$TMP/logs/20m.txt"; run
[ "$RC" != 0 ] && ok "logs vacios: sale con error" || falla "rc logs vacios" "!= 0" "$RC"
case "$MSGS" in DIRECTO=0*"ni una linea en 20 min"*) ok "logs vacios: avisa por el tablero que esta ciego" ;; *) falla "logs vacios" "ni una linea en 20 min" "${MSGS:-(nada)}" ;; esac

echo
if [ "$FALLOS" = "0" ]; then echo "vigia-credito-ia: TODO VERDE"; exit 0; fi
echo "vigia-credito-ia: $FALLOS fallo(s)"; exit 1

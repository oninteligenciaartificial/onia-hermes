#!/usr/bin/env bash
# Prueba de `vigia-ci.sh`. Lo unico que ese script tiene de dificil es CUANDO
# habla y cuando se calla, asi que eso es lo que se prueba — con Telegram y la
# API de GitHub sustituidos, sin red y sin token.
#
# El caso 3 (rojo -> rojo = silencio) es el que justifica el archivo: un vigia que
# repite el mismo aviso cada 10 minutos se apaga solo en la cabeza del que lo lee,
# y eso NO se nota mirando el codigo una vez.
set -uo pipefail

DIR=$(cd "$(dirname "$0")" && pwd)
SUT="$DIR/vigia-ci.sh"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

FALLOS=0
ok()    { printf '  ok   — %s\n' "$1"; }
falla() { printf '  FALLA — %s\n     esperaba: %s\n     obtuvo:   %s\n' "$1" "$2" "$3"; FALLOS=$((FALLOS+1)); }

# Telegram falso: escribe lo que le mandan, no manda nada.
cat > "$TMP/tg.sh" <<'FIN'
#!/usr/bin/env bash
printf '%s\n---\n' "$1" >> "$TMP_MENSAJES"
FIN
chmod 755 "$TMP/tg.sh"

fixture() { printf '%s' "$1" > "$TMP/fx.json"; }

run() {
  : > "$TMP/mensajes.txt"
  TMP_MENSAJES="$TMP/mensajes.txt" \
  ONIA_TG="$TMP/tg.sh" \
  ONIA_CI_MARCA_DIR="$TMP" \
  ONIA_CI_FIXTURE="$TMP/fx.json" \
  ONIA_CI_OBJETIVOS="oninteligenciaartificial/onia-platform:master" \
  bash "$SUT"
  RC=$?
  MSGS=$(cat "$TMP/mensajes.txt")
  return $RC
}

corridas() {  # corridas <conclusion> [status]
  printf '{"workflow_runs":[{"name":"CI","status":"%s","conclusion":%s,"head_sha":"0c54d65abc","html_url":"https://x/1"}]}' \
    "${2:-completed}" "$([ "$1" = "null" ] && echo null || printf '"%s"' "$1")"
}

echo "vigia-ci — maquina de estados"

# 1. Verde de entrada: no molesta a nadie.
fixture "$(corridas success)"; run
[ -z "$MSGS" ] && ok "verde sin historial: no manda nada" || falla "verde sin historial" "(nada)" "$MSGS"

# 2. Se pone rojo: avisa una vez y deja la marca.
fixture "$(corridas failure)"; run
case "$MSGS" in *"CI en ROJO"*) ok "verde -> rojo: avisa" ;; *) falla "verde -> rojo" "CI en ROJO" "$MSGS" ;; esac
ls "$TMP"/onia-ci-*.rojo >/dev/null 2>&1 && ok "deja la marca del episodio" || falla "marca" "un .rojo" "ninguno"

# 3. EL CASO QUE IMPORTA: sigue rojo, se calla.
fixture "$(corridas failure)"; run
[ -z "$MSGS" ] && ok "rojo -> rojo: SILENCIO (no repite cada vuelta)" || falla "rojo -> rojo" "(nada)" "$MSGS"

# 4. Vuelve a verde: avisa recuperado y limpia.
fixture "$(corridas success)"; run
case "$MSGS" in *"CI recuperado"*) ok "rojo -> verde: avisa recuperado" ;; *) falla "rojo -> verde" "CI recuperado" "$MSGS" ;; esac
ls "$TMP"/onia-ci-*.rojo >/dev/null 2>&1 && falla "limpieza de marca" "sin .rojo" "quedo la marca" || ok "borra la marca"

# 5. Una corrida EN CURSO no es un veredicto.
fixture "$(corridas null in_progress)"; run
[ -z "$MSGS" ] && ok "corrida en curso: no dice nada" || falla "en curso" "(nada)" "$MSGS"

# 6. cancelled tampoco es un veredicto sobre el codigo.
fixture "$(corridas cancelled)"; run
[ -z "$MSGS" ] && ok "cancelled: no dice nada" || falla "cancelled" "(nada)" "$MSGS"

# 7. La API contesta un error: avisa del VIGIA y NO declara verde.
fixture "$(corridas failure)"; run    # dejamos una marca roja puesta
fixture '{"message":"Bad credentials"}'; run
case "$MSGS" in *"la API de GitHub no contesta"*) ok "error de API: avisa del vigia" ;; *) falla "error de API" "aviso de API" "$MSGS" ;; esac
ls "$TMP"/onia-ci-*.rojo >/dev/null 2>&1 && ok "con la API caida NO borra la marca roja" || falla "marca tras error de API" "la marca sigue" "se borro"

# 8. Sin token y sin fixture: avisa UNA vez y sale 0.
rm -f "$TMP"/onia-ci-*.avisado
: > "$TMP/mensajes.txt"
TMP_MENSAJES="$TMP/mensajes.txt" ONIA_TG="$TMP/tg.sh" ONIA_CI_MARCA_DIR="$TMP" \
  ONIA_CI_TOKEN_FILE="$TMP/no-existe" bash "$SUT"; RC=$?
MSGS=$(cat "$TMP/mensajes.txt")
[ "$RC" = "0" ] && ok "sin token: sale 0 (no rompe la cadena)" || falla "sin token exit" "0" "$RC"
case "$MSGS" in *"Vigia de CI sin token"*) ok "sin token: avisa que le falta" ;; *) falla "sin token aviso" "Vigia de CI sin token" "$MSGS" ;; esac
: > "$TMP/mensajes.txt"
TMP_MENSAJES="$TMP/mensajes.txt" ONIA_TG="$TMP/tg.sh" ONIA_CI_MARCA_DIR="$TMP" \
  ONIA_CI_TOKEN_FILE="$TMP/no-existe" bash "$SUT"
[ -z "$(cat "$TMP/mensajes.txt")" ] && ok "sin token: no vuelve a insistir" || falla "sin token repite" "(nada)" "$(cat "$TMP/mensajes.txt")"

echo
if [ "$FALLOS" = "0" ]; then echo "vigia-ci: TODO VERDE"; exit 0; fi
echo "vigia-ci: $FALLOS fallo(s)"; exit 1

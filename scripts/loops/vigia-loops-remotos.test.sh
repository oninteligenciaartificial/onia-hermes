#!/usr/bin/env bash
# Prueba de `vigia-loops-remotos.sh`. Nace el 2026-09-06, cuando ese script dejo de
# vigilar solo los loops de la PC de casa y paso a vigilar TAMBIEN los del VPS —
# entre ellos `onia-cola`, que es el unico camino a `main` y por lo tanto al
# cliente. Desde que se congelo `supervisor` (2026-09-05) no habia NADA mirando si
# esos tres seguian vivos.
#
# Lo que se prueba es cuando habla, cuando se calla, y —el que motivo el archivo—
# que el aviso nombre la MAQUINA CORRECTA. El script traia "La PC de casa" escrito
# a mano en los cuatro mensajes: reusado tal cual para el VPS habria avisado "la PC
# de casa no da senales" con el integrador muerto. Un aviso que apunta a la maquina
# equivocada cuesta mas que no tenerlo.
set -uo pipefail

DIR=$(cd "$(dirname "$0")" && pwd)
SUT="$DIR/vigia-loops-remotos.sh"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/logs" "$TMP/estado"

FALLOS=0
ok()    { printf '  ok   — %s\n' "$1"; }
falla() { printf '  FALLA — %s\n     esperaba: %s\n     obtuvo:   %s\n' "$1" "$2" "$3"; FALLOS=$((FALLOS+1)); }

cat > "$TMP/tg.sh" <<'FIN'
#!/usr/bin/env bash
printf '%s\n---\n' "$1" >> "$TMP_MENSAJES"
FIN
chmod 755 "$TMP/tg.sh"

# Deja un ARRANCA de hace N minutos, con el formato exacto que escribe onia-loop.sh.
arranca_hace() {  # arranca_hace <id> <minutos>
  printf '%s ===== ARRANCA %s — rama x — HEAD abc1234 — tope 3000s =====\n' \
    "$(date -u -d "-$2 min" +%FT%TZ)" "$1" > "$TMP/logs/onia-loop-$1.log"
}

run() {  # run [MAQUINA]
  : > "$TMP/mensajes.txt"
  TMP_MENSAJES="$TMP/mensajes.txt" \
  ONIA_TG="$TMP/tg.sh" \
  ONIA_LOOPS_REMOTOS="$TMP/lista.txt" \
  ONIA_LOG_DIR="$TMP/logs" \
  ONIA_VIGIA_ESTADO="$TMP/estado" \
  ONIA_VIGIA_MAQUINA="${1:-la PC de casa}" \
  bash "$SUT"
  MSGS=$(cat "$TMP/mensajes.txt")
}

echo "vigia-loops-remotos — cuando habla, cuando calla, y a QUE maquina culpa"

printf 'onia-cola 60\nchatbot-cola 60\n' > "$TMP/lista.txt"

# 1. Los dos frescos: no molesta.
arranca_hace onia-cola 10; arranca_hace chatbot-cola 10; run
[ -z "$MSGS" ] && ok "todos frescos: no manda nada" || falla "frescos" "(nada)" "$MSGS"

# 2. Uno callado mas de 2 cadencias -> avisa por ese, y dice que la maquina vive.
arranca_hace onia-cola 200; run
case "$MSGS" in *"Loop callado"*onia-cola*) ok "uno callado: avisa por ese loop" ;; *) falla "uno callado" "Loop callado onia-cola" "$MSGS" ;; esac
case "$MSGS" in *"la maquina esta viva"*) ok "y aclara que la maquina esta viva" ;; *) falla "maquina viva" "la maquina esta viva" "$MSGS" ;; esac

# 3. Sigue callado -> silencio (un aviso por episodio).
run
[ -z "$MSGS" ] && ok "sigue callado: SILENCIO" || falla "repite" "(nada)" "$MSGS"

# 4. Vuelve -> recuperado.
arranca_hace onia-cola 1; run
case "$MSGS" in *"Loop recuperado"*) ok "vuelve: avisa recuperado" ;; *) falla "recuperado" "Loop recuperado" "$MSGS" ;; esac

# 5. TODOS callados -> un solo mensaje de apagon, no uno por loop.
rm -f "$TMP"/estado/*
arranca_hace onia-cola 200; arranca_hace chatbot-cola 200; run
case "$MSGS" in *"no da senales"*) ok "todos callados: avisa apagon" ;; *) falla "apagon" "no da senales" "$MSGS" ;; esac
N=$(grep -c -- "^---$" "$TMP/mensajes.txt")
[ "$N" = "1" ] && ok "apagon = UN mensaje, no uno por loop" || falla "apagon repetido" "1 mensaje" "$N"

# 6. EL QUE MOTIVO EL ARCHIVO: el aviso nombra la maquina que se le pasa.
rm -f "$TMP"/estado/*
run "el VPS"
case "$MSGS" in *"el VPS no da senales"*) ok "con MAQUINA='el VPS' culpa al VPS" ;; *) falla "maquina parametrizada" "el VPS no da senales" "$MSGS" ;; esac
case "$MSGS" in *"PC de casa"*) falla "fuga de la maquina vieja" "sin 'PC de casa'" "$MSGS" ;; *) ok "y NO nombra la PC de casa" ;; esac

# 7. Lista vacia o toda comentada: no hace nada y sale 0 (asi quedo antes del paso 10).
printf '# onia-cola 60\n' > "$TMP/lista.txt"; : > "$TMP/mensajes.txt"
TMP_MENSAJES="$TMP/mensajes.txt" ONIA_TG="$TMP/tg.sh" ONIA_LOOPS_REMOTOS="$TMP/lista.txt" \
  ONIA_LOG_DIR="$TMP/logs" ONIA_VIGIA_ESTADO="$TMP/estado" bash "$SUT"; RC=$?
[ "$RC" = "0" ] && [ -z "$(cat "$TMP/mensajes.txt")" ] && ok "lista comentada: sale 0 y calla" || falla "lista comentada" "exit 0 y nada" "rc=$RC msgs=$(cat "$TMP/mensajes.txt")"

# 8. Un id invalido no se interpola en el mensaje (lo que sale va a Telegram como HTML).
printf '<b>malo</b> 60\nonia-cola 60\n' > "$TMP/lista.txt"
rm -f "$TMP"/estado/*; arranca_hace onia-cola 200; run
case "$MSGS" in *"<b>malo</b>"*) falla "id invalido interpolado" "descartado" "$MSGS" ;; *) ok "id invalido: descartado, no llega a Telegram" ;; esac

echo
if [ "$FALLOS" = "0" ]; then echo "vigia-loops-remotos: TODO VERDE"; exit 0; fi
echo "vigia-loops-remotos: $FALLOS fallo(s)"; exit 1

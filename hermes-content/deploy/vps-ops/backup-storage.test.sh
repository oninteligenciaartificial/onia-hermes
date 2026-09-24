#!/usr/bin/env bash
# Tests de backup-storage.sh con directorios temporales y onia-tg.sh falso.
set -uo pipefail
AQUI=$(cd "$(dirname "$0")" && pwd)
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
FAIL=0; ok() { echo "ok - $1"; }; ko() { echo "NO - $1"; FAIL=1; }
printf '#!/usr/bin/env bash\necho "$1" >> %s/tg.log\n' "$T" > "$T/tg"; chmod +x "$T/tg"
run() { ONIA_STORAGE_SRC="$1" ONIA_STORAGE_OUT="$T/out" ONIA_STORAGE_KEEP="${2:-30}" ONIA_TG="$T/tg" bash "$AQUI/backup-storage.sh"; }

mkdir -p "$T/src/stub/payment-proofs"; echo a > "$T/src/stub/payment-proofs/1.jpg"; echo b > "$T/src/stub/payment-proofs/2.jpg"
out=$(run "$T/src"); code=$?
[ $code = 0 ] && [[ "$out" == *"archivos=2"* ]] && ok "copia los 2 comprobantes" || ko "copia: code=$code out=$out"
f=$(ls "$T/out"/storage-*.tar.gz | head -1)
[ "$(tar -tzf "$f" | grep -c '1.jpg\|2.jpg')" = 2 ] && ok "el tar contiene los archivos" || ko "contenido del tar"
[ "$(stat -c %a "$T/out")" = 700 ] && ok "directorio privado" || ko "permisos $(stat -c %a "$T/out")"
[ ! -e "$T/tg.log" ] && ok "exito no avisa" || ko "aviso en exito"
ls "$T/out"/*.partial >/dev/null 2>&1 && ko "quedo un .partial" || ok "sin .partial"

out=$(run "$T/no-existe"); code=$?
[ $code = 1 ] && grep -q "no existe" "$T/tg.log" 2>/dev/null && ok "origen faltante falla y avisa" || ko "origen faltante: code=$code"

rm -rf "$T/out" "$T/tg.log"
for i in 1 2 3 4; do run "$T/src" 2 >/dev/null; sleep 1; done
[ "$(ls "$T/out"/storage-*.tar.gz | wc -l)" = 2 ] && ok "retencion guarda solo las 2 mas nuevas" || ko "retencion: $(ls "$T/out" | wc -l)"
touch "$T/out/ajeno.tar.gz"; run "$T/src" 1 >/dev/null
[ -e "$T/out/ajeno.tar.gz" ] && ok "la retencion no toca archivos ajenos" || ko "borro un archivo ajeno"

[ $FAIL = 0 ] && echo "backup-storage: TODO VERDE" || { echo "backup-storage: HAY ROJO"; exit 1; }

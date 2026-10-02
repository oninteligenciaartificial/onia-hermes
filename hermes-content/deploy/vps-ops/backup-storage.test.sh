#!/usr/bin/env bash
# Tests de backup-storage.sh con directorios temporales y onia-tg.sh falso.
set -uo pipefail
AQUI=$(cd "$(dirname "$0")" && pwd)
TEMP_ROOT=$(cd "${TMPDIR:-/tmp}" && pwd -P)
T=$(mktemp -d "$TEMP_ROOT/onia-storage-test.XXXXXX")
T=$(cd "$T" && pwd -P)
cleanup() {
  case "$T" in
    "$TEMP_ROOT"/onia-storage-test.*) [ ! -L "$T" ] && rm -rf -- "$T" ;;
    *) echo "test temporal fuera del directorio esperado" >&2; exit 1 ;;
  esac
}
trap cleanup EXIT
FAIL=0; ok() { echo "ok - $1"; }; ko() { echo "NO - $1"; FAIL=1; }
printf '#!/usr/bin/env bash\necho "$1" >> %s/tg.log\n' "$T" > "$T/tg"; chmod +x "$T/tg"
run() { ONIA_STORAGE_SRC="$1" ONIA_STORAGE_OUT="$T/out" ONIA_STORAGE_KEEP="${2:-30}" ONIA_TG="$T/tg" bash "$AQUI/backup-storage.sh"; }

# Un tar real con un cambio de origen justo despues de crear el archivo. El
# wrapper no toca las operaciones de listado/comparacion del script auditado.
TAR_REAL=$(command -v tar)
mkdir -p "$T/bin"
cat > "$T/bin/tar" <<'EOF'
#!/usr/bin/env bash
# En el caso count aislamos el guard de cantidad: la comparacion de bytes se
# prueba por separado con el tar real en el caso bytes.
if [ "$ONIA_TEST_CHANGE" = count ] && [ "${1:-}" = "-C" ] && [ "${3:-}" = "-dzf" ]; then
  exit 0
fi
if [ "$ONIA_TEST_CHANGE" = bytes ] && [ "${1:-}" = "-C" ] && [ "${3:-}" = "-czf" ]; then
  original_mtime=$(stat -c %y "$ONIA_TEST_SRC/stub/payment-proofs/1.jpg")
fi
"$ONIA_TEST_TAR_REAL" "$@"
code=$?
if [ "$code" = 0 ] && [ "${1:-}" = "-C" ] && [ "${3:-}" = "-czf" ]; then
  case "$ONIA_TEST_CHANGE" in
    count) printf 'nuevo\n' > "$ONIA_TEST_SRC/stub/payment-proofs/3.jpg" ;;
    bytes)
      # Misma cantidad, tamano y mtime: solo la comparacion del contenido lo ve.
      printf 'cambiado\n' > "$ONIA_TEST_SRC/stub/payment-proofs/1.jpg"
      touch -d "$original_mtime" "$ONIA_TEST_SRC/stub/payment-proofs/1.jpg"
      ;;
    corrupt) printf 'no es gzip\n' > "$4" ;;
  esac
fi
exit "$code"
EOF
chmod +x "$T/bin/tar"
run_mutating() {
  ONIA_STORAGE_SRC="$1" ONIA_STORAGE_OUT="$2" ONIA_STORAGE_KEEP=30 ONIA_TG="$T/tg" \
    ONIA_TEST_TAR_REAL="$TAR_REAL" ONIA_TEST_CHANGE="$3" ONIA_TEST_SRC="$1" \
    PATH="$T/bin:$PATH" bash "$AQUI/backup-storage.sh"
}

mkdir -p "$T/src/stub/payment-proofs"; echo a > "$T/src/stub/payment-proofs/1.jpg"; echo b > "$T/src/stub/payment-proofs/2.jpg"
out=$(run "$T/src"); code=$?
[ $code = 0 ] && [[ "$out" == *"archivos=2"* ]] && ok "copia los 2 comprobantes" || ko "copia: code=$code out=$out"
f=$(ls "$T/out"/storage-*.tar.gz | head -1)
[ "$(tar -tzf "$f" | grep -c '1.jpg\|2.jpg')" = 2 ] && ok "el tar contiene los archivos" || ko "contenido del tar"
case "$(uname -s)" in
  MINGW*|MSYS*) echo "skip - permisos POSIX 0700 no representables en NTFS" ;;
  *) [ "$(stat -c %a "$T/out")" = 700 ] && ok "directorio privado" || ko "permisos $(stat -c %a "$T/out")" ;;
esac
[ ! -e "$T/tg.log" ] && ok "exito no avisa" || ko "aviso en exito"
ls "$T/out"/*.partial >/dev/null 2>&1 && ko "quedo un .partial" || ok "sin .partial"

out=$(run "$T/no-existe"); code=$?
[ $code = 1 ] && grep -q "no existe" "$T/tg.log" 2>/dev/null && ok "origen faltante falla y avisa" || ko "origen faltante: code=$code"

rm -rf "$T/out" "$T/tg.log"
for i in 1 2 3 4; do run "$T/src" 2 >/dev/null; sleep 1; done
[ "$(ls "$T/out"/storage-*.tar.gz | wc -l)" = 2 ] && ok "retencion guarda solo las 2 mas nuevas" || ko "retencion: $(ls "$T/out" | wc -l)"
touch "$T/out/ajeno.tar.gz"; run "$T/src" 1 >/dev/null
[ -e "$T/out/ajeno.tar.gz" ] && ok "la retencion no toca archivos ajenos" || ko "borro un archivo ajeno"

for change in count bytes corrupt; do
  src="$T/src-$change"; outdir="$T/out-$change"
  mkdir -p "$src/stub/payment-proofs"
  printf 'original\n' > "$src/stub/payment-proofs/1.jpg"
  printf 'segundo\n' > "$src/stub/payment-proofs/2.jpg"
  result=$(run_mutating "$src" "$outdir" "$change"); code=$?
  if [ "$code" = 1 ] && [[ "$result" == *"FALLO"* ]] \
    && ! compgen -G "$outdir/storage-*.tar.gz" >/dev/null \
    && ! compgen -G "$outdir/*.partial" >/dev/null; then
    ok "origen $change alterado: falla sin publicar ni dejar parcial"
  else
    ko "origen $change alterado: code=$code result=$result finales=$(find "$outdir" -maxdepth 1 -name 'storage-*.tar.gz' 2>/dev/null | wc -l)"
  fi
done

[ $FAIL = 0 ] && echo "backup-storage: TODO VERDE" || { echo "backup-storage: HAY ROJO"; exit 1; }

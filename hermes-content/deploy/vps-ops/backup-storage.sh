#!/usr/bin/env bash
# ONIA — respaldo diario de Supabase Storage (comprobantes de pago). Nace 2026-09-24.
#
# POR QUE EXISTE. El respaldo diario de Postgres guarda la FILA de un comprobante
# (monto, estado, ruta), no la IMAGEN: esa vive en el backend de archivos de
# supabase-storage. Restaurar la base sin esto deja pagos sin la prueba de pago.
# Medido el 2026-09-24: bucket payment-proofs, backend `file` en el volumen de abajo.
#
# Falla ruidoso: un fallo va por onia-tg.sh (tarea del tablero, la regla de avisos
# de Sergio Urcullo del 2026-09-08). Guarda las ultimas $KEEP copias PROPIAS.
set -uo pipefail
SRC=${ONIA_STORAGE_SRC:-/opt/onia-supabase/supabase/docker/volumes/storage}
OUT=${ONIA_STORAGE_OUT:-/root/backups/onia-storage-v1}
KEEP=${ONIA_STORAGE_KEEP:-30}
TG=${ONIA_TG:-/root/bin/onia-tg.sh}
TS=$(date -u +%Y%m%dT%H%M%SZ)

fallo() {
  "$TG" "Respaldo de comprobantes (Storage) FALLO: $1" >/dev/null 2>&1 || true
  echo "[$TS] FALLO: $1"
  exit 1
}

[ -d "$SRC" ] || fallo "no existe $SRC"
umask 077
mkdir -p "$OUT" || fallo "no puedo crear $OUT"
F="$OUT/storage-$TS.tar.gz"
TMP="$F.partial"
tar -C "$SRC" -czf "$TMP" . 2>/dev/null || { rm -f "$TMP"; fallo "tar fallo"; }
{ gzip -t "$TMP" && tar -tzf "$TMP" >/dev/null; } 2>/dev/null || { rm -f "$TMP"; fallo "copia corrupta"; }
mv "$TMP" "$F"
# ponytail: un comprobante subido durante el tar da un falso "no coincide"; se corrige solo al dia siguiente.
n_src=$(find "$SRC" -type f | wc -l)
n_tar=$(tar -tzf "$F" | grep -cv '/$')
[ "$n_src" = "$n_tar" ] || fallo "archivos: origen $n_src, copia $n_tar ($F)"
# Solo borra copias propias (storage-*.tar.gz de este directorio), las mas viejas.
ls -1t "$OUT"/storage-*.tar.gz 2>/dev/null | tail -n +$((KEEP + 1)) | xargs -r rm -f --
echo "[$TS] OK $F archivos=$n_tar bytes=$(stat -c %s "$F")"

#!/usr/bin/env bash
# Prueba de `vigia-comprobantes.sh`, con `docker` (o sea psql) y Telegram sustituidos:
# sin red, sin base y sin mandarle nada a Sergio Urcullo.
#
# Lo que se prueba es cuando habla y cuando calla. El caso que justifica el archivo es
# el 5: si Telegram falla, el pago NO se da por avisado — un cliente que pago y cuyo
# aviso se perdio es exactamente el agujero que el vigia vino a tapar.
#
# Opcional: ONIA_PLATFORM_SRC=<src de onia-platform> compara la regla de "quien no es
# cliente" contra lib/platform/cuentas-que-no-son-clientes.ts (el vigia la COPIA).
set -uo pipefail

DIR=$(cd "$(dirname "$0")" && pwd)
SUT="$DIR/vigia-comprobantes.sh"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/bin" "$TMP/estado"

FALLOS=0
ok()    { printf '  ok   - %s\n' "$1"; }
falla() { printf '  FALLA - %s\n     esperaba: %s\n     obtuvo:   %s\n' "$1" "$2" "$3"; FALLOS=$((FALLOS+1)); }

# docker falso: guarda la consulta y devuelve las filas del fixture (psql -At, tabs).
cat > "$TMP/bin/docker" <<'FIN'
#!/usr/bin/env bash
for a in "$@"; do ultimo="$a"; done
printf '%s' "$ultimo" > "$TMP_SQL"
[ "${PSQL_RC:-0}" = "0" ] || { echo "psql: error: connection refused" >&2; exit "$PSQL_RC"; }
cat "$TMP_FILAS"
FIN
# Telegram falso: anota si fue DIRECTO y el mensaje; imita al enrutador en que un
# problema (🔴) por el camino por defecto devuelve `TAREA <id>`.
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
chmod 755 "$TMP/bin/docker" "$TMP/tg.sh" "$TMP/tablero.sh"

filas() { printf '%s' "$1" > "$TMP/filas.txt"; }
fila() { printf '%s\t%s\t%s\t%s\t%s\t%s\n' "$@"; }   # id negocio plan ciclo monto minutos

run() {
  : > "$TMP/mensajes.txt"; : > "$TMP/tablero.txt"
  PATH="$TMP/bin:$PATH" \
  TMP_SQL="$TMP/sql.txt" TMP_FILAS="$TMP/filas.txt" \
  TMP_MENSAJES="$TMP/mensajes.txt" TMP_TABLERO="$TMP/tablero.txt" \
  ONIA_TG="$TMP/tg.sh" ONIA_TABLERO="$TMP/tablero.sh" \
  ONIA_COMPROBANTES_ESTADO="$TMP/estado" \
  ONIA_COMPROBANTES_HORA="${HORA:-0}" \
  bash "$SUT" >/dev/null
  RC=$?
  MSGS=$(cat "$TMP/mensajes.txt")
}
cuantos() { grep -c '^---$' "$TMP/mensajes.txt"; }

echo "vigia-comprobantes - cuando habla y cuando calla"

# 1. Nada pendiente: silencio.
filas ""; run
[ -z "$MSGS" ] && [ "$RC" = 0 ] && ok "sin pendientes: no manda nada" || falla "sin pendientes" "(nada, rc 0)" "rc=$RC $MSGS"

# 2. Un pago nuevo: UN aviso DIRECTO con lo que Sergio necesita para actuar.
filas "$(fila pay_1 'Clinica Sonrisa' professional mensual 450 12)"; run
[ "$(cuantos)" = 1 ] && ok "pago nuevo: un aviso" || falla "pago nuevo" "1 aviso" "$MSGS"
case "$MSGS" in DIRECTO=1*) ok "va DIRECTO a Telegram, no al tablero" ;; *) falla "directo" "DIRECTO=1" "$MSGS" ;; esac
for dato in "Clinica Sonrisa" "professional" "mensual" "Bs 450" "12 min" "https://app.onia.com.bo/admin/payments"; do
  case "$MSGS" in *"$dato"*) ok "el aviso trae: $dato" ;; *) falla "dato del aviso" "$dato" "$MSGS" ;; esac
done

# 3. EL MISMO pago en la vuelta siguiente: silencio (un aviso por pago, no cada 10 min).
run
[ -z "$MSGS" ] && ok "mismo pago otra vez: SILENCIO" || falla "repite" "(nada)" "$MSGS"

# 4. Entra otro: se avisa SOLO el nuevo.
filas "$(fila pay_1 'Clinica Sonrisa' professional mensual 450 22; fila pay_2 'Ferreteria Tornillo' 'Add-on Chatbot WhatsApp' anual 3900 3)"; run
[ "$(cuantos)" = 1 ] && ok "dos pendientes, uno nuevo: un solo aviso" || falla "solo el nuevo" "1 aviso" "$MSGS"
case "$MSGS" in *"Ferreteria Tornillo"*"Add-on Chatbot WhatsApp"*) ok "el aviso es del pago nuevo (add-on incluido)" ;; *) falla "cual avisa" "Ferreteria Tornillo" "$MSGS" ;; esac

# 5. EL QUE IMPORTA: si Telegram falla, el pago NO queda como avisado y se reintenta.
filas "$(fila pay_3 'Tienda Luz' basic mensual 290 1)"
TG_FALLA=1 run
grep -qxF pay_3 "$TMP/estado/avisados" && falla "fallo de Telegram" "pay_3 sin marcar" "quedo marcado" || ok "Telegram fallo: no lo marca como avisado"
run
case "$MSGS" in *"Tienda Luz"*) ok "la vuelta siguiente lo reintenta" ;; *) falla "reintento" "Tienda Luz" "$MSGS" ;; esac

# 6. El nombre del negocio lo escribe el cliente: se escapa para el HTML de Telegram.
filas "$(fila pay_4 'A & B <Dental>' basic mensual 290 1)"; run
case "$MSGS" in *"A &amp; B &lt;Dental&gt;"*) ok "escapa & < > del nombre" ;; *) falla "escape HTML" "A &amp; B &lt;Dental&gt;" "$MSGS" ;; esac

# 7. Formato de la espera.
filas "$(fila pay_5 'Espera Larga' basic mensual 290 125)"; run
case "$MSGS" in *"2 h 5 min"*) ok "125 min se lee 2 h 5 min" ;; *) falla "espera" "2 h 5 min" "$MSGS" ;; esac

# ── Recordatorio diario de los de mas de 24 h ───────────────────────────────
: > "$TMP/estado/avisados"; rm -f "$TMP/estado/recordatorio.dia"
printf 'pay_6\npay_7\n' > "$TMP/estado/avisados"    # los dos ya se avisaron como nuevos
filas "$(fila pay_6 'Clinica Olvidada' clinic anual 9000 3000; fila pay_7 'Reciente' basic mensual 290 30)"

# 8. Antes de la hora no molesta.
HORA=25 run
[ -z "$MSGS" ] && ok "antes de la hora: no hay recordatorio" || falla "hora" "(nada)" "$MSGS"

# 9. Pasada la hora: UN recordatorio, DIRECTO, con los viejos y sin los recientes.
run
[ "$(cuantos)" = 1 ] && ok "un solo recordatorio" || falla "recordatorio" "1 mensaje" "$MSGS"
case "$MSGS" in DIRECTO=1*"mas de 24 h"*"Clinica Olvidada"*"2 d 2 h"*) ok "recordatorio con el pendiente viejo" ;; *) falla "contenido recordatorio" "Clinica Olvidada, 2 d 2 h" "$MSGS" ;; esac
case "$MSGS" in *Reciente*) falla "recordatorio" "sin el de 30 min" "$MSGS" ;; *) ok "no incluye el de menos de 24 h" ;; esac

# 10. Mismo dia: no repite. Dia siguiente: vuelve.
run
[ -z "$MSGS" ] && ok "mismo dia: no repite el recordatorio" || falla "recordatorio repetido" "(nada)" "$MSGS"
echo 2000-01-01 > "$TMP/estado/recordatorio.dia"; run
case "$MSGS" in *"mas de 24 h"*) ok "dia nuevo: vuelve a recordar" ;; *) falla "dia nuevo" "recordatorio" "$MSGS" ;; esac

# 11. Solo pendientes recientes: no hay recordatorio.
rm -f "$TMP/estado/recordatorio.dia"
filas "$(fila pay_7 'Reciente' basic mensual 290 30)"; run
[ -z "$MSGS" ] && ok "sin pendientes de mas de 24 h: sin recordatorio" || falla "sin viejos" "(nada)" "$MSGS"

# ── La base no contesta ─────────────────────────────────────────────────────
# 12. Falla: avisa UNA vez, por el tablero (problema del sistema), y sale != 0.
PSQL_RC=2 run
[ "$RC" != 0 ] && ok "base caida: sale con error" || falla "rc base caida" "!= 0" "$RC"
case "$MSGS" in DIRECTO=0*"no puedo leer la base"*) ok "avisa por el camino por defecto (tarea)" ;; *) falla "aviso base caida" "DIRECTO=0 ... no puedo leer la base" "$MSGS" ;; esac
PSQL_RC=2 run
[ -z "$MSGS" ] && ok "sigue caida: SILENCIO" || falla "base caida repite" "(nada)" "$MSGS"

# 13. Vuelve: avisa y cierra la tarea que abrio el rojo.
filas ""; run
case "$MSGS" in *"vuelve a leer la base"*) ok "recuperada: lo dice" ;; *) falla "recuperacion" "vuelve a leer la base" "$MSGS" ;; esac
TAB=$(cat "$TMP/tablero.txt")
case "$TAB" in *"complete t_c0ffee01"*) ok "cierra la tarea del incidente" ;; *) falla "cierre de tarea" "complete t_c0ffee01" "${TAB:-(nada)}" ;; esac
[ -f "$TMP/estado/sin-base.avisado" ] && falla "marca" "borrada" "sigue" || ok "borra la marca del incidente"

# ── La consulta ─────────────────────────────────────────────────────────────
SQL=$(cat "$TMP/sql.txt")
# 14. Solo lectura y sin datos personales del pagador.
case "$SQL" in select*) ok "la consulta es un SELECT" ;; *) falla "select" "select ..." "$SQL" ;; esac
if printf '%s' "$SQL" | grep -qiE '\b(insert|update|delete|drop|alter|truncate)\b'; then falla "solo lectura" "sin escrituras" "$SQL"; else ok "no escribe nada"; fi
COLUMNAS=$(printf '%s' "$SQL" | sed -n '1,/^from /p')
if printf '%s' "$COLUMNAS" | grep -qiE 'payer|bank|transaction|receipt|email|phone|nit'; then falla "datos personales" "solo nombre del negocio" "$SQL"; else ok "no lee pagador, CI, telefono, banco ni comprobante"; fi
case "$SQL" in *"status = 'PENDING'"*) ok "filtra los PENDING" ;; *) falla "PENDING" "status = 'PENDING'" "$SQL" ;; esac

# 15. Excluye lo que no es cliente, con la misma regla del producto.
for regla in "'demo-'" "'zz-qa-'" "'onia-interna'" "@onia.com.bo" "'sergio.urcullo.m@gmail.com'" "'oninteligenciaartificial@gmail.com'" '\+[^@]*'; do
  case "$SQL" in *"$regla"*) ok "excluye: $regla" ;; *) falla "exclusion" "$regla" "(falta)" ;; esac
done

# 16. Paridad con el fuente del producto (si esta a mano).
FUENTE="${ONIA_PLATFORM_SRC:-}/lib/platform/cuentas-que-no-son-clientes.ts"
if [ -n "${ONIA_PLATFORM_SRC:-}" ] && [ -f "$FUENTE" ]; then
  LITERALES=$(grep -E '^export const (DEMO_SLUG_PREFIX|QA_SLUG_PREFIXES|DOMINIO_PROPIO) ' "$FUENTE" | grep -oE '"[^"]+"' | tr -d '"'
              sed -n '/^export const CORREOS_PROPIOS/,/\]/p' "$FUENTE" | grep -oE '"[^"]+"' | tr -d '"')
  [ "$(printf '%s\n' "$LITERALES" | grep -c .)" -ge 5 ] || falla "paridad" ">= 5 literales en el fuente" "$LITERALES"
  while read -r lit; do
    [ -n "$lit" ] || continue
    case "$SQL" in *"$lit"*) ok "paridad con el producto: $lit" ;; *) falla "paridad" "$lit (esta en $FUENTE)" "falta en el vigia" ;; esac
  done <<< "$LITERALES"
else
  echo "  --   paridad con cuentas-que-no-son-clientes.ts salteada (ONIA_PLATFORM_SRC sin definir)"
fi

echo
if [ "$FALLOS" = "0" ]; then echo "vigia-comprobantes: TODO VERDE"; exit 0; fi
echo "vigia-comprobantes: $FALLOS fallo(s)"; exit 1

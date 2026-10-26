#!/usr/bin/env bash
# Prueba de `vigia-comprobantes.sh`, con `docker` (o sea psql), `timeout`, `flock` y
# Telegram sustituidos: sin red, sin base y sin mandarle nada a Sergio Urcullo.
#
# Lo que se prueba es cuando habla y cuando calla. El caso que justifica el archivo es
# el 5: si Telegram falla, el pago NO se da por avisado — un cliente que pago y cuyo
# aviso se perdio es exactamente el agujero que el vigia vino a tapar.
#
# La consulta es la regla entera (que pago avisa y cual no) y aca no hay Postgres para
# correrla: por eso el 16 la fija TEXTUAL. Cambiarla es a proposito: se cambia aca Y se
# corre de verdad con el 18 (ONIA_PSQL), contra VALUES, antes de commitear.
#
# Paridad (19): compara la regla de "quien no es cliente" y las marcas del QR del BCP
# contra onia-platform. Lee ONIA_PLATFORM_SRC (un arbol) o, si no esta, el origin/master
# del repo hermano ../onia-platform. Sin ninguno de los dos, se saltea y lo dice.
set -uo pipefail

DIR=$(cd "$(dirname "$0")" && pwd)
SUT="$DIR/vigia-comprobantes.sh"
TIMEOUT_REAL=$(command -v timeout)
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/bin" "$TMP/estado"

FALLOS=0
ok()    { printf '  ok   - %s\n' "$1"; }
falla() { printf '  FALLA - %s\n     esperaba: %s\n     obtuvo:   %s\n' "$1" "$2" "$3"; FALLOS=$((FALLOS+1)); }

# docker falso: guarda la consulta y devuelve las filas del fixture (psql -At, tabs).
# DOCKER_CUELGA=1 imita al daemon colgado: no contesta nunca (hasta que lo maten).
cat > "$TMP/bin/docker" <<'FIN'
#!/usr/bin/env bash
for a in "$@"; do ultimo="$a"; done
printf '%s' "$ultimo" > "$TMP_SQL"
[ "${DOCKER_CUELGA:-0}" = "1" ] && exec sleep 30
[ "${PSQL_RC:-0}" = "0" ] || { echo "psql: error: connection refused" >&2; exit "$PSQL_RC"; }
cat "$TMP_FILAS"
FIN
# timeout falso: anota QUE envuelve y corre el de verdad con un plazo corto.
cat > "$TMP/bin/timeout" <<'FIN'
#!/usr/bin/env bash
printf '%s\n' "$*" >> "$TMP_TIMEOUT"
shift
exec "$TIMEOUT_REAL" "${TIMEOUT_PRUEBA:-20}" "$@"
FIN
# flock falso (Git Bash no lo trae): CANDADO_TOMADO=1 = otra vuelta sigue corriendo.
cat > "$TMP/bin/flock" <<'FIN'
#!/usr/bin/env bash
printf '%s\n' "$*" >> "$TMP_FLOCK"
[ "${CANDADO_TOMADO:-0}" = "1" ] && exit 1
exit 0
FIN
# Telegram falso: anota si fue DIRECTO y el mensaje; imita al enrutador en que un
# problema (🔴) por el camino por defecto devuelve `TAREA <id>`.
cat > "$TMP/tg.sh" <<'FIN'
#!/usr/bin/env bash
printf 'DIRECTO=%s\nDECISION=%s\n%s\n---\n' "${ONIA_TG_DIRECTO:-0}" "${ONIA_AVISO_DECISION:-0}" "$1" >> "$TMP_MENSAJES"
[ "${TG_FALLA:-0}" = "1" ] && exit 1
[ -n "${TG_RC:-}" ] && exit "$TG_RC"
case "$1" in *🔴*) [ "${ONIA_TG_DIRECTO:-0}" = "1" ] || printf 'TAREA t_c0ffee01\n' ;; esac
exit 0
FIN
cat > "$TMP/tablero.sh" <<'FIN'
#!/usr/bin/env bash
printf '%s %s\n' "$1" "${2:-}" >> "$TMP_TABLERO"
FIN
chmod 755 "$TMP"/bin/* "$TMP/tg.sh" "$TMP/tablero.sh"

filas() { printf '%s' "$1" > "$TMP/filas.txt"; }
fila() { printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' "$@"; }   # id tipo negocio plan ciclo monto minutos

run() {
  : > "$TMP/mensajes.txt"; : > "$TMP/tablero.txt"; : > "$TMP/timeout.txt"; : > "$TMP/flock.txt"
  PATH="$TMP/bin:$PATH" TIMEOUT_REAL="$TIMEOUT_REAL" \
  TMP_SQL="$TMP/sql.txt" TMP_FILAS="$TMP/filas.txt" TMP_TIMEOUT="$TMP/timeout.txt" TMP_FLOCK="$TMP/flock.txt" \
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

# 2. Un comprobante nuevo: UN aviso DIRECTO con lo que Sergio necesita para actuar.
filas "$(fila pay_1 comprobante 'Clinica Sonrisa' professional mensual 450 12)"; run
[ "$(cuantos)" = 1 ] && ok "pago nuevo: un aviso" || falla "pago nuevo" "1 aviso" "$MSGS"
case "$MSGS" in DIRECTO=1*) ok "va DIRECTO a Telegram, no al tablero" ;; *) falla "directo" "DIRECTO=1" "$MSGS" ;; esac
grep -qx 'DECISION=1' "$TMP/mensajes.txt" && ok "el pago lleva marcador explícito de decisión" || falla "marcador de decisión" "DECISION=1" "$MSGS"
for dato in "Comprobante nuevo" "Clinica Sonrisa" "professional" "mensual" "Bs 450" "12 min" "https://app.onia.com.bo/admin/payments"; do
  case "$MSGS" in *"$dato"*) ok "el aviso trae: $dato" ;; *) falla "dato del aviso" "$dato" "$MSGS" ;; esac
done

# 3. EL MISMO pago en la vuelta siguiente: silencio (un aviso por pago, no cada 10 min).
run
[ -z "$MSGS" ] && ok "mismo pago otra vez: SILENCIO" || falla "repite" "(nada)" "$MSGS"

# 4. Entra otro: se avisa SOLO el nuevo.
filas "$(fila pay_1 comprobante 'Clinica Sonrisa' professional mensual 450 22; fila pay_2 comprobante 'Ferreteria Tornillo' 'Add-on Chatbot WhatsApp' anual 3900 3)"; run
[ "$(cuantos)" = 1 ] && ok "dos pendientes, uno nuevo: un solo aviso" || falla "solo el nuevo" "1 aviso" "$MSGS"
case "$MSGS" in *"Ferreteria Tornillo"*"Add-on Chatbot WhatsApp"*) ok "el aviso es del pago nuevo (add-on incluido)" ;; *) falla "cual avisa" "Ferreteria Tornillo" "$MSGS" ;; esac

# 5. EL QUE IMPORTA: si Telegram falla, el pago NO queda como avisado y se reintenta.
filas "$(fila pay_3 comprobante 'Tienda Luz' basic mensual 290 1)"
TG_FALLA=1 run
grep -qxF pay_3 "$TMP/estado/avisados" && falla "fallo de Telegram" "pay_3 sin marcar" "quedo marcado" || ok "Telegram fallo: no lo marca como avisado"
run
case "$MSGS" in *"Tienda Luz"*) ok "la vuelta siguiente lo reintenta" ;; *) falla "reintento" "Tienda Luz" "$MSGS" ;; esac

# Una decisión diferida por horario no se considera entregada.
filas "$(fila pay_diferido comprobante 'Tienda Espera' basic mensual 290 1)"
TG_RC=75 run
grep -qxF pay_diferido "$TMP/estado/avisados" && falla "decisión diferida" "sin marcar" "quedó marcada" || ok "75 no marca el pago como avisado"
run
grep -qxF pay_diferido "$TMP/estado/avisados" && ok "el pago diferido se entrega en la vuelta posterior" || falla "reintento del pago diferido" "marcado tras éxito" "$MSGS"

# 6. El nombre del negocio lo escribe el cliente: se escapa para el HTML de Telegram.
filas "$(fila pay_4 comprobante 'A & B <Dental>' basic mensual 290 1)"; run
case "$MSGS" in *"A &amp; B &lt;Dental&gt;"*) ok "escapa & < > del nombre" ;; *) falla "escape HTML" "A &amp; B &lt;Dental&gt;" "$MSGS" ;; esac

# 7. Formato de la espera.
filas "$(fila pay_5 comprobante 'Espera Larga' basic mensual 290 125)"; run
case "$MSGS" in *"2 h 5 min"*) ok "125 min se lee 2 h 5 min" ;; *) falla "espera" "2 h 5 min" "$MSGS" ;; esac

# ── El QR del BCP: la plata entro pero el plan no se activo solo ────────────
# 7b. El webhook lo dejo PENDING para revision humana: se avisa, y NO como comprobante.
filas "$(fila pay_q1 qr 'Clinica QR' professional mensual 450 5)"; run
[ "$(cuantos)" = 1 ] && ok "QR a revisar: un aviso" || falla "QR a revisar" "1 aviso" "$MSGS"
case "$MSGS" in DIRECTO=1*"QR del BCP"*"NO se activo solo"*"Clinica QR"*) ok "QR a revisar: dice que la plata entro y el plan no se activo" ;; *) falla "texto QR" "QR del BCP ... NO se activo solo" "$MSGS" ;; esac
case "$MSGS" in *"Comprobante nuevo"*) falla "QR a revisar" "no se anuncia como comprobante" "$MSGS" ;; *) ok "QR a revisar: no se anuncia como comprobante" ;; esac
# 7c. Pagaron un QR que ya habiamos reemplazado (REJECTED): acreditar a mano.
filas "$(fila pay_q2 qr-viejo 'Clinica Vieja' basic mensual 290 40)"; run
case "$MSGS" in DIRECTO=1*"ya reemplazado"*"Clinica Vieja"*"Acreditar a mano"*) ok "QR reemplazado y pagado: pide acreditar a mano" ;; *) falla "texto QR viejo" "ya reemplazado ... Acreditar a mano" "$MSGS" ;; esac

# ── Recordatorio diario de los de mas de 24 h ───────────────────────────────
: > "$TMP/estado/avisados"; rm -f "$TMP/estado/recordatorio.dia"
printf 'pay_6\npay_7\npay_8\npay_9\n' > "$TMP/estado/avisados"    # todos ya se avisaron como nuevos
filas "$(fila pay_6 comprobante 'Clinica Olvidada' clinic anual 9000 3000; fila pay_7 comprobante 'Reciente' basic mensual 290 30
         fila pay_8 qr 'QR Olvidado' basic mensual 290 3000; fila pay_9 qr-viejo 'QR Acreditado' basic mensual 290 3000)"

# 8. Antes de la hora no molesta.
HORA=25 run
[ -z "$MSGS" ] && ok "antes de la hora: no hay recordatorio" || falla "hora" "(nada)" "$MSGS"

# 9. Pasada la hora: UN recordatorio, DIRECTO, con los viejos y sin los recientes.
run
[ "$(cuantos)" = 1 ] && ok "un solo recordatorio" || falla "recordatorio" "1 mensaje" "$MSGS"
case "$MSGS" in DIRECTO=1*"mas de 24 h"*"Clinica Olvidada"*"2 d 2 h"*) ok "recordatorio con el pendiente viejo" ;; *) falla "contenido recordatorio" "Clinica Olvidada, 2 d 2 h" "$MSGS" ;; esac
case "$MSGS" in *Reciente*) falla "recordatorio" "sin el de 30 min" "$MSGS" ;; *) ok "no incluye el de menos de 24 h" ;; esac
case "$MSGS" in *"QR Olvidado"*) ok "incluye el QR que sigue PENDING a revisar" ;; *) falla "recordatorio QR" "QR Olvidado" "$MSGS" ;; esac
# El REJECTED queda asi para siempre aunque se acredite: recordarlo seria para siempre.
case "$MSGS" in *"QR Acreditado"*) falla "recordatorio QR viejo" "sin el QR reemplazado" "$MSGS" ;; *) ok "no recuerda el QR reemplazado (un aviso y listo)" ;; esac

# 10. Mismo dia: no repite. Dia siguiente: vuelve.
run
[ -z "$MSGS" ] && ok "mismo dia: no repite el recordatorio" || falla "recordatorio repetido" "(nada)" "$MSGS"
echo 2000-01-01 > "$TMP/estado/recordatorio.dia"; run
case "$MSGS" in *"mas de 24 h"*) ok "dia nuevo: vuelve a recordar" ;; *) falla "dia nuevo" "recordatorio" "$MSGS" ;; esac

# 11. Solo pendientes recientes: no hay recordatorio.
rm -f "$TMP/estado/recordatorio.dia"
filas "$(fila pay_7 comprobante 'Reciente' basic mensual 290 30)"; run
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

# 14. Docker colgado: el vigia no se queda esperando para siempre — lo corta y lo dice.
INICIO=$SECONDS
DOCKER_CUELGA=1 TIMEOUT_PRUEBA=2 run
DURO=$((SECONDS - INICIO))
[ "$DURO" -lt 15 ] && ok "docker colgado: corta en ${DURO}s, no espera" || falla "docker colgado" "< 15 s" "${DURO}s"
grep -q '^60 docker exec supabase-db psql' "$TMP/timeout.txt" && ok "docker exec va con timeout 60" || falla "timeout" "60 docker exec supabase-db psql" "$(cat "$TMP/timeout.txt")"
[ "$RC" != 0 ] && ok "docker colgado: sale con error" || falla "rc colgado" "!= 0" "$RC"
case "$MSGS" in *"no puedo leer la base"*"rc=124"*) ok "docker colgado: avisa que no puede leer la base (rc=124)" ;; *) falla "aviso colgado" "no puedo leer la base ... rc=124" "${MSGS:-(nada)}" ;; esac
filas ""; run   # vuelve: cierra el incidente

# 15. Otra vuelta sigue corriendo: esta sale sin tocar nada (no se apilan, no duplica avisos).
filas "$(fila pay_10 comprobante 'Clinica Doble' basic mensual 290 1)"
rm -f "$TMP/sql.txt"
CANDADO_TOMADO=1 run
[ -z "$MSGS" ] && [ "$RC" = 0 ] && ok "candado tomado: sale en silencio, rc 0" || falla "candado" "(nada, rc 0)" "rc=$RC $MSGS"
[ -f "$TMP/sql.txt" ] && falla "candado" "no consulta la base" "consulto" || ok "candado tomado: ni consulta la base"
grep -q -- '-n' "$TMP/flock.txt" && ok "el candado no espera (flock -n)" || falla "flock" "flock -n" "$(cat "$TMP/flock.txt")"
run
case "$MSGS" in *"Clinica Doble"*) ok "candado libre: avisa normal" ;; *) falla "candado libre" "Clinica Doble" "$MSGS" ;; esac

# ── La consulta ─────────────────────────────────────────────────────────────
SQL=$(cat "$TMP/sql.txt")
norm() { tr -s '[:space:]' ' ' | sed 's/^ //; s/ $//'; }
# 16. Fijada TEXTUAL (ver cabecera). Que pago avisa y cual no ES esta consulta.
read -r -d '' ESPERADO <<'SQL'
select sp.id,
  case when sp."receiptPath" is not null then 'comprobante' when sp.status = 'PENDING' then 'qr' else 'qr-viejo' end,
  regexp_replace(o.name, '[[:cntrl:]]+', ' ', 'g'),
  case sp.plan when 'whatsapp_addon' then 'Add-on Chatbot WhatsApp' else sp.plan end,
  case sp.cycle when 'monthly' then 'mensual' when 'annual' then 'anual' else sp.cycle end,
  trim_scale(sp.amount),
  greatest(0, floor(extract(epoch from (now() at time zone 'utc') - sp."createdAt") / 60))::int
from subscription_payments sp
join organizations o on o.id = sp."organizationId"
where not (starts_with(o.slug, 'demo-') or starts_with(o.slug, 'zz-qa-') or starts_with(o.slug, 'onia-interna')
  or starts_with(coalesce(o.email, ''), 'demo-') or starts_with(coalesce(o.email, ''), 'zz-qa-')
  or lower(regexp_replace(coalesce(o.email, ''), '\+[^@]*(@[^@]*)$', '\1')) like '%@onia.com.bo'
  or lower(regexp_replace(coalesce(o.email, ''), '\+[^@]*(@[^@]*)$', '\1')) in ('sergio.urcullo.m@gmail.com', 'oninteligenciaartificial@gmail.com'))
  and ((sp.status = 'PENDING' and sp."receiptPath" is not null)
    or (sp."bankName" = 'BCP QR dinamico' and sp.status in ('PENDING', 'REJECTED')
      and (sp."adminNotes" like '%requiere revision humana%' or sp."adminNotes" like '%Revisar y acreditar a mano%')))
order by sp."createdAt"
SQL
[ "$(printf '%s' "$SQL" | norm)" = "$(printf '%s' "$ESPERADO" | norm)" ] && ok "la consulta es exactamente la fijada" \
  || falla "consulta" "$(printf '%s' "$ESPERADO" | norm)" "$(printf '%s' "$SQL" | norm)"

# 17. Sin datos personales del pagador (lo cubre el 16; esto dice POR QUE importa).
COLUMNAS=$(printf '%s' "$SQL" | sed -n '1,/^from /p')
if printf '%s' "$COLUMNAS" | grep -qiE 'payer|bank|transaction|receiptUrl|email|phone|nit'; then falla "datos personales" "solo nombre del negocio" "$SQL"; else ok "no lee pagador, CI, telefono, banco ni comprobante"; fi

# 18. Opcional: la consulta DE VERDAD en Postgres. ONIA_PSQL = comando que lee SQL por
#     stdin y contesta como `psql -AtqX -F <tab>`. Las tablas se tapan con CTE de VALUES
#     del mismo nombre: es un SELECT puro, no lee ni escribe ninguna tabla. En el VPS:
#     ONIA_PSQL="docker exec -i supabase-db psql -U postgres -d postgres -AtqX -F $(printf '\t')"
if [ -n "${ONIA_PSQL:-}" ]; then
  read -r -d '' FIXTURE <<'SQL'
with organizations (id, slug, name, email) as (values
  ('o_real',  'clinica-sol',    'Clinica Sol',   'dueno@gmail.com'),
  ('o_keep',  'qa-consultores', 'QA Consultores', 'x@onia.com.bo.mx'),
  ('o_zzqa',  'zz-qa-prueba',   'QA',            'a@gmail.com'),
  ('o_demo',  'clinica-demo',   'Demo',          'demo-7@gmail.com'),
  ('o_onia',  'casilla',        'Casilla',       'Casilla+x@ONIA.com.bo'),
  ('o_serg',  'mi-negocio',     'Sergio',        'sergio.urcullo.m+t@gmail.com'),
  ('o_int',   'onia-interna',   'Onia',          'hola@gmail.com')
), subscription_payments (id, "organizationId", plan, cycle, amount, status, "bankName", "receiptPath", "adminNotes", "createdAt") as (values
  ('p01_manual',     'o_real', 'basic', 'monthly', 290.00::numeric, 'PENDING',  'BNB'::text,      'o_real/1.jpg'::text, null::text, (now() at time zone 'utc') - interval '100 min'),
  ('p02_qr_sinpago', 'o_real', 'basic', 'monthly', 290.00, 'PENDING',  'BCP QR dinamico', null, null, (now() at time zone 'utc') - interval '95 min'),
  ('p03_qr_revisar', 'o_real', 'basic', 'monthly', 290.00, 'PENDING',  'BCP QR dinamico', null, '[Pago BCP confirmado pero requiere revision humana: monto (operacion 9)]', (now() at time zone 'utc') - interval '90 min'),
  ('p04_qr_reempl',  'o_real', 'basic', 'monthly', 290.00, 'REJECTED', 'BCP QR dinamico', null, '[Reemplazado por un QR nuevo sin haberse pagado]', (now() at time zone 'utc') - interval '85 min'),
  ('p05_qr_viejo',   'o_real', 'basic', 'monthly', 290.00, 'REJECTED', 'BCP QR dinamico', null, E'[Reemplazado por un QR nuevo sin haberse pagado]\n[Pago BCP recibido sobre un QR REJECTED — operacion 7. Revisar y acreditar a mano.]', (now() at time zone 'utc') - interval '80 min'),
  ('p06_aprobado',   'o_real', 'basic', 'monthly', 290.00, 'APPROVED', 'BNB', 'o_real/2.jpg', null, (now() at time zone 'utc') - interval '75 min'),
  ('p07_rechazado',  'o_real', 'basic', 'monthly', 290.00, 'REJECTED', 'BNB', 'o_real/3.jpg', null, (now() at time zone 'utc') - interval '70 min'),
  ('p08_keep',       'o_keep', 'whatsapp_addon', 'annual', 3900.50, 'PENDING', 'BNB', 'o_keep/1.jpg', null, (now() at time zone 'utc') - interval '65 min'),
  ('p09_zzqa',       'o_zzqa', 'basic', 'monthly', 290.00, 'PENDING',  'BNB', 'o_zzqa/1.jpg', null, (now() at time zone 'utc') - interval '60 min'),
  ('p10_demo',       'o_demo', 'basic', 'monthly', 290.00, 'PENDING',  'BNB', 'o_demo/1.jpg', null, (now() at time zone 'utc') - interval '55 min'),
  ('p11_onia',       'o_onia', 'basic', 'monthly', 290.00, 'PENDING',  'BNB', 'o_onia/1.jpg', null, (now() at time zone 'utc') - interval '50 min'),
  ('p12_sergio',     'o_serg', 'basic', 'monthly', 290.00, 'PENDING',  'BNB', 'o_serg/1.jpg', null, (now() at time zone 'utc') - interval '45 min'),
  ('p13_interna',    'o_int',  'basic', 'monthly', 290.00, 'PENDING',  'BNB', 'o_int/1.jpg',  null, (now() at time zone 'utc') - interval '40 min'),
  ('p14_qr_ajeno',   'o_zzqa', 'basic', 'monthly', 290.00, 'PENDING',  'BCP QR dinamico', null, '[Pago BCP confirmado pero requiere revision humana: x]', (now() at time zone 'utc') - interval '35 min')
)
SQL
  VIVO=$(printf '%s\n%s;\n' "$FIXTURE" "$SQL" | bash -c "$ONIA_PSQL" 2>&1)
  ESPERA=$(printf 'p01_manual\tcomprobante\tClinica Sol\tbasic\tmensual\t290\t100\np03_qr_revisar\tqr\np05_qr_viejo\tqr-viejo\np08_keep\tcomprobante\tQA Consultores\tAdd-on Chatbot WhatsApp\tanual\t3900.5\t65')
  OBTUVO=$(printf '%s\n' "$VIVO" | awk -F'\t' '$2=="comprobante"{print; next} {print $1"\t"$2}')
  [ "$OBTUVO" = "$ESPERA" ] && ok "en Postgres: avisa comprobante, QR a revisar y QR viejo pagado; calla QR sin pagar, QA, demo, Onia, Sergio, interna" \
    || falla "consulta en Postgres" "$ESPERA" "$VIVO"
else
  echo "  --   consulta en Postgres salteada (ONIA_PSQL sin definir)"
fi

# 19. Paridad con el fuente del producto (si esta a mano).
PLATAFORMA="${ONIA_PLATFORM_REPO:-$DIR/../../../../onia-platform}"
fuente() {   # <ruta dentro de onia-platform> -> contenido
  if [ -n "${ONIA_PLATFORM_SRC:-}" ]; then cat "$ONIA_PLATFORM_SRC/$1" 2>/dev/null
  else git -C "$PLATAFORMA" show "origin/master:$1" 2>/dev/null; fi
}
REGLA=$(fuente lib/platform/cuentas-que-no-son-clientes.ts)
if [ -n "$REGLA" ]; then
  LITERALES=$(printf '%s\n' "$REGLA" | grep -E '^export const (DEMO_SLUG_PREFIX|QA_SLUG_PREFIXES|DOMINIO_PROPIO) ' | grep -oE '"[^"]+"' | tr -d '"'
              printf '%s\n' "$REGLA" | sed -n '/^export const CORREOS_PROPIOS/,/\]/p' | grep -oE '"[^"]+"' | tr -d '"')
  [ "$(printf '%s\n' "$LITERALES" | grep -c .)" -ge 5 ] || falla "paridad" ">= 5 literales en el fuente" "$LITERALES"
  while read -r lit; do
    [ -n "$lit" ] || continue
    case "$SQL" in *"$lit"*) ok "paridad con el producto: $lit" ;; *) falla "paridad" "$lit (esta en cuentas-que-no-son-clientes.ts)" "falta en el vigia" ;; esac
  done <<< "$LITERALES"
else
  echo "  --   paridad con cuentas-que-no-son-clientes.ts salteada (sin ONIA_PLATFORM_SRC ni $PLATAFORMA)"
fi
BCP=$(fuente lib/gateway/bcp-qr.ts; fuente app/api/webhooks/bcp/route.ts)
if [ -n "$BCP" ]; then
  for marca in "BCP QR dinamico" "requiere revision humana" "Revisar y acreditar a mano"; do
    case "$BCP" in *"$marca"*) ok "paridad con el QR del BCP: $marca" ;; *) falla "paridad BCP" "$marca (en bcp-qr.ts / webhooks/bcp)" "ya no esta en el producto" ;; esac
  done
else
  echo "  --   paridad con el QR del BCP salteada (sin ONIA_PLATFORM_SRC ni $PLATAFORMA)"
fi

echo
if [ "$FALLOS" = "0" ]; then echo "vigia-comprobantes: TODO VERDE"; exit 0; fi
echo "vigia-comprobantes: $FALLOS fallo(s)"; exit 1

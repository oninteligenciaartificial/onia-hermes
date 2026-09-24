#!/usr/bin/env bash
# Prueba de `security-watch.sh` con docker/psql, ufw, iptables, systemctl, fail2ban,
# journalctl y Telegram sustituidos: sin red, sin base y sin mandarle nada a Sergio Urcullo.
#
# El caso que justifica el archivo es el 3: el contenedor de la base NO existe. El vigia
# viejo paso ~41 dias asi, "avisando" con el numero vacio. Aca tiene que ALERTAR, nunca pasar.
set -uo pipefail

DIR=$(cd "$(dirname "$0")" && pwd)
SUT="$DIR/security-watch.sh"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/bin" "$TMP/estado"

FALLOS=0
ok()    { printf '  ok   - %s\n' "$1"; }
falla() { printf '  FALLA - %s\n     esperaba: %s\n     obtuvo:   %s\n' "$1" "$2" "$3"; FALLOS=$((FALLOS+1)); }

# docker falso. `inspect` devuelve el env de supabase-rest; `exec` solo conoce a supabase-db
# (como produccion hoy) y devuelve las filas del fixture (psql -At, tabs).
cat > "$TMP/bin/docker" <<'FIN'
#!/usr/bin/env bash
if [ "$1" = inspect ]; then
  [ "${REST_FALLA:-0}" = 1 ] && { echo "Error: No such object: $2" >&2; exit 1; }
  printf 'PATH=/usr/bin\nPGRST_DB_SCHEMAS=%s\nPGRST_JWT_SECRET=no-se-lee\n' "${REST_ESQUEMAS-public,storage,graphql_public,onia_center}"
  exit 0
fi
printf '%s\n' "$*" > "$TMP_ARGS"
for a in "$@"; do ultimo="$a"; done
printf '%s' "$ultimo" > "$TMP_SQL"
if [ "$2" != supabase-db ] || [ "${SIN_CONTENEDOR:-0}" = 1 ]; then
  echo "Error response from daemon: No such container: $2 ${RUIDO:-}" >&2; exit 1
fi
cat "$TMP_FILAS"
FIN
cat > "$TMP/bin/ufw" <<'FIN'
#!/usr/bin/env bash
[ "${UFW_OFF:-0}" = 1 ] && echo "Status: inactive" || echo "Status: active"
FIN
cat > "$TMP/bin/iptables" <<'FIN'
#!/usr/bin/env bash
for i in 1 2 3 4; do echo "DROP tcp -- 0.0.0.0/0 0.0.0.0/0 /* ONIA-BLOCK $i */"; done
FIN
cat > "$TMP/bin/systemctl" <<'FIN'
#!/usr/bin/env bash
exit 0
FIN
cat > "$TMP/bin/fail2ban-client" <<'FIN'
#!/usr/bin/env bash
printf '   |- Currently banned:\t2\n   |- Total banned:\t7\n'
FIN
cat > "$TMP/bin/journalctl" <<'FIN'
#!/usr/bin/env bash
echo "sshd: Failed password for root"
FIN
# Telegram falso: anota si fue DIRECTO y el mensaje.
cat > "$TMP/tg.sh" <<'FIN'
#!/usr/bin/env bash
printf 'DIRECTO=%s\n%s\n---\n' "${ONIA_TG_DIRECTO:-0}" "$1" >> "$TMP_MENSAJES"
[ "${TG_FALLA:-0}" = 1 ] && exit 1
exit 0
FIN
chmod 755 "$TMP"/bin/* "$TMP/tg.sh"

filas() { printf '%s' "$1" > "$TMP/filas.txt"; }
fila() { printf '%s\t%s\t%s\n' "$@"; }   # tipo nombre roles
SANA="$(fila total 82 '')"

run() {
  : > "$TMP/mensajes.txt"
  PATH="$TMP/bin:$PATH" \
  TMP_SQL="$TMP/sql.txt" TMP_ARGS="$TMP/args.txt" TMP_FILAS="$TMP/filas.txt" TMP_MENSAJES="$TMP/mensajes.txt" \
  ONIA_TG="$TMP/tg.sh" ONIA_SECWATCH_ESTADO="$TMP/estado" \
  bash "$SUT" > "$TMP/log.txt" 2>&1
  RC=$?
  MSGS=$(cat "$TMP/mensajes.txt")
}
cuantos() { grep -c '^---$' "$TMP/mensajes.txt"; }

echo "security-watch - cuando alerta y cuando calla"

# 1. Todo bien: silencio, rc 0, y mira la base REAL.
filas "$SANA"; run
[ -z "$MSGS" ] && [ "$RC" = 0 ] && ok "todo en orden: no manda nada, rc 0" || falla "todo en orden" "(nada, rc 0)" "rc=$RC $MSGS"
case "$(cat "$TMP/args.txt")" in "exec supabase-db psql"*) ok "consulta el contenedor supabase-db" ;; *) falla "contenedor" "exec supabase-db psql" "$(cat "$TMP/args.txt")" ;; esac
grep -q 'SSH fallidos 24h: 1 | IPs bloqueadas ahora: 2 (total 7)' "$TMP/log.txt" && ok "el resumen de accesos queda en el log, sin '0 0'" || falla "resumen" "SSH fallidos 24h: 1 | IPs ... 2 (total 7)" "$(cat "$TMP/log.txt")"
grep -q 'no-se-lee' "$TMP/log.txt" && falla "secretos" "el env de supabase-rest no se imprime" "aparecio en el log" || ok "no imprime el resto del env de supabase-rest"

# La consulta: solo lectura y la clase entera.
SQL=$(cat "$TMP/sql.txt")
case "$SQL" in with*select*) ok "la consulta es un SELECT" ;; *) falla "select" "with ... select" "$SQL" ;; esac
if printf '%s' "$SQL" | grep -qiE '\b(insert into|update [a-z_]+ set|delete from|drop|alter|truncate [a-z]|grant|revoke|create)\b'; then falla "solo lectura" "sin escrituras" "$SQL"; else ok "no escribe nada"; fi
for pieza in "relrowsecurity" "has_table_privilege('anon'" "has_table_privilege('authenticated'" "has_any_column_privilege('anon'" \
             "has_schema_privilege('anon'" "'v', 'm'" "security_invoker" \
             "not rls and (anon or auth)" "not invoker and (anon or auth)" \
             "array['public','storage','graphql_public','onia_center']"; do
  case "$SQL" in *"$pieza"*) ok "la consulta cubre: $pieza" ;; *) falla "clase" "$pieza" "(falta)" ;; esac
done

# 2. Una tabla SIN RLS que anon puede tocar: UN aviso, DIRECTO, con el nombre.
filas "$SANA
$(fila tabla public.backup_orgs 'anon, authenticated')"; run
[ "$RC" != 0 ] && ok "tabla expuesta: sale con error" || falla "rc" "!= 0" "$RC"
[ "$(cuantos)" = 1 ] && ok "tabla expuesta: un aviso" || falla "un aviso" "1" "$MSGS"
case "$MSGS" in DIRECTO=1*"Seguridad del servidor"*"<code>public.backup_orgs</code> (anon, authenticated)"*) ok "DIRECTO y con la tabla y los roles" ;; *) falla "contenido" "DIRECTO=1 ... public.backup_orgs (anon, authenticated)" "$MSGS" ;; esac
case "$MSGS" in *"enable row level security"*) ok "dice como cerrarla" ;; *) falla "como cerrar" "enable row level security" "$MSGS" ;; esac

# 2b. Al dia siguiente, lo MISMO: silencio (un aviso por incidente), pero sigue en rojo.
run
[ -z "$MSGS" ] && [ "$RC" != 0 ] && ok "mismo incidente: SILENCIO, rc != 0" || falla "repite" "(nada, rc != 0)" "rc=$RC $MSGS"
grep -q 'sigue igual, ya avisado' "$TMP/log.txt" && ok "lo deja en el log" || falla "log" "sigue igual" "$(cat "$TMP/log.txt")"

# 2c. Aparece OTRA: aviso nuevo.
filas "$SANA
$(fila tabla public.backup_orgs 'anon, authenticated')
$(fila tabla onia_center.finance_entries authenticated)"; run
case "$MSGS" in *"onia_center.finance_entries"*) ok "incidente distinto: vuelve a avisar" ;; *) falla "nuevo" "onia_center.finance_entries" "$MSGS" ;; esac

# 2d. Se cierra: aviso de recuperacion y se borra la marca.
filas "$SANA"; run
case "$MSGS" in DIRECTO=1*"🟢"*"todo en orden"*) ok "recuperado: lo dice" ;; *) falla "recuperacion" "🟢 todo en orden" "$MSGS" ;; esac
[ "$RC" = 0 ] && [ ! -f "$TMP/estado/abierto" ] && ok "borra la marca, rc 0" || falla "marca" "borrada, rc 0" "rc=$RC"
run
[ -z "$MSGS" ] && ok "sano otra vez: silencio" || falla "sano" "(nada)" "$MSGS"

# 3. EL QUE IMPORTA: el contenedor de la base no existe. Alerta, NO pasa.
SIN_CONTENEDOR=1 run
[ "$RC" != 0 ] && ok "sin contenedor: sale con error" || falla "rc sin contenedor" "!= 0" "$RC"
case "$MSGS" in DIRECTO=1*"NO PUDE correr los chequeos de la base"*"No such container"*) ok "sin contenedor: ALERTA con el motivo" ;; *) falla "sin contenedor" "NO PUDE correr ... No such container" "${MSGS:-(nada)}" ;; esac
SIN_CONTENEDOR=1 RUIDO="req-9f3a" run
[ -z "$MSGS" ] && ok "sigue ciego (con otro texto de error): no repite" || falla "ciego repite" "(nada)" "$MSGS"
filas "$SANA"; run
case "$MSGS" in *"🟢"*) ok "la base vuelve: recuperacion" ;; *) falla "recupera ciego" "🟢" "$MSGS" ;; esac

# 4. `public` sin tablas = mira la base equivocada: tambien es ceguera.
filas "$(fila total 0 '')"; run
case "$MSGS" in *"NO PUDE correr los chequeos de la base"*"no tiene tablas"*) ok "public vacio: alerta de ceguera" ;; *) falla "public vacio" "no tiene tablas" "${MSGS:-(nada)}" ;; esac
filas ""; run   # psql rc 0 sin filas: mismo incidente (ya avisado), pero NO verde
[ "$RC" != 0 ] && grep -q 'no tiene tablas' "$TMP/log.txt" && ok "salida vacia de psql: sigue en rojo" || falla "salida vacia" "rc != 0 y en el log" "rc=$RC $(cat "$TMP/log.txt")"
filas "$SANA"; run

# 5. Una vista que anon puede leer.
filas "$SANA
$(fila vista public.v_pacientes anon)"; run
case "$MSGS" in *"Vista abierta por la API"*"public.v_pacientes"*) ok "vista con anon: alerta" ;; *) falla "vista" "Vista ... public.v_pacientes" "${MSGS:-(nada)}" ;; esac
filas "$SANA"; run

# 6. Si Telegram falla, el incidente NO queda como avisado: se reintenta.
filas "$SANA
$(fila tabla public.backup_x anon)"
TG_FALLA=1 run
[ -f "$TMP/estado/abierto" ] && falla "fallo de Telegram" "sin marca" "quedo marcado" || ok "Telegram fallo: no lo marca como avisado"
run
case "$MSGS" in *"public.backup_x"*) ok "la vuelta siguiente lo reintenta" ;; *) falla "reintento" "public.backup_x" "${MSGS:-(nada)}" ;; esac
filas "$SANA"; run

# 7. Los nombres vienen de la base: se escapan para el HTML de Telegram.
filas "$SANA
$(fila tabla 'public.a<b>&c' anon)"; run
case "$MSGS" in *"public.a&lt;b&gt;&amp;c"*) ok "escapa & < > del nombre" ;; *) falla "escape" "public.a&lt;b&gt;&amp;c" "$MSGS" ;; esac
filas "$SANA"; run

# 8. Las defensas del servidor siguen vigiladas.
UFW_OFF=1 run
case "$MSGS" in *"ufw) NO esta activo"*) ok "ufw apagado: alerta" ;; *) falla "ufw" "NO esta activo" "${MSGS:-(nada)}" ;; esac
run

# 9. Si no puede leer que esquemas sirve la API: lo dice y mira public igual.
REST_FALLA=1 run
case "$MSGS" in *"NO PUDE leer que esquemas sirve la API"*) ok "sin supabase-rest: alerta" ;; *) falla "rest" "NO PUDE leer que esquemas" "${MSGS:-(nada)}" ;; esac
case "$(cat "$TMP/sql.txt")" in *"array['public']"*) ok "y mira public de todos modos" ;; *) falla "fallback" "array['public']" "$(cat "$TMP/sql.txt")" ;; esac
run

# 10. Un nombre de esquema raro no entra al SQL.
REST_ESQUEMAS="public,x');drop table y;--" run
case "$(cat "$TMP/sql.txt")" in *drop*) falla "inyeccion" "el esquema raro fuera del SQL" "entro" ;; *) ok "esquema con nombre raro: fuera del SQL" ;; esac
case "$MSGS" in *"nombre inesperado"*) ok "y lo avisa" ;; *) falla "esquema raro" "nombre inesperado" "${MSGS:-(nada)}" ;; esac

echo
if [ "$FALLOS" = "0" ]; then echo "security-watch: TODO VERDE"; exit 0; fi
echo "security-watch: $FALLOS fallo(s)"; exit 1

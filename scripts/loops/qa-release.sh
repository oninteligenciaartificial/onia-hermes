#!/usr/bin/env bash
# ONIA — QA DESPUÉS DE CADA PUBLICACIÓN de app.onia.com.bo (HERMES_ROL_QA.md Q5, 10-oct).
#
# POR QUÉ EXISTE. El publicador de las :50 publica solo, 8 veces por día y 3 de noche, y entran
# 10 PRs con migraciones. Lo único que miraba la plataforma con sesión era la madre, a mano (A3).
# Y el publicador falló dos días seguidos a las 15:50 UTC sin que nadie se enterara (A3b).
#
# Qué hace, cada 15 min y sin LLM:
#   1. Lee el release que corre onia-platform (`onia-platform:release-<sha>`). Si cambió desde la
#      última vez, abre /dashboard y /checkout con onia-mirar.js y la cuenta de prueba de QA, y
#      mira: que termine en la pantalla pedida, que no muestre texto de error y cuánto tarda. Lo que
#      sale roto se vuelve a mirar una vez, un minuto después: recién swapeado, Next puede estar
#      arrancando.
#      - Roto: tarea para Plataforma al momento, y la interrupción 4 por la aduana si a los 30 min
#        sigue roto (cada corrida vuelve a mirar mientras siga roto; la espera la lleva onia-tg.sh).
#      - Vuelve a estar sano: cierra la tarea y avisa que volvió (si había avisado).
#   2. Una hora y diez después de cada ventana del publicador (hh:50, cada 3 h) lee su log. Si
#      había algo para publicar y no salió (FALLO, se rindió, el freno no pudo medir), anota la
#      ventana. Dos seguidas: tarea para Plataforma, que el resumen de las 06:30 nombra en su línea
#      de salud. «al dia» no es una ventana fallida (no había nada nuevo), y «NO publico solo» por
#      un monto tampoco: espera la firma de Sergio Urcullo y el publicador ya se lo avisa.
#
# ROTO es solo lo que dice algo de la PLATAFORMA: la pantalla, el servidor que no responde, el login
# que da 5xx. Lo que dice algo del INSTRUMENTO (sin Chromium, sin node, la cuenta de QA que no
# existe, onia-mirar.js que muere sin decir por qué) es NO MEDIDO: tarea para el carril y exit 2,
# nunca la interrupción 4. Un instrumento roto no despierta a Sergio Urcullo (revisión del 10-oct).
#
# 🔴 EL CORREO DE QA VA FIJO ACÁ, NUNCA POR ARGUMENTO NI POR ENTORNO. onia-mirar.js usa la clave
# service role y abre sesión con CUALQUIER correo que reciba, superadmin y clientes incluidos. Este
# script no acepta argumentos: así ningún disparador (cron, Telegram, una tarea) le cambia a quién
# mira. Las variables ONIA_* de abajo solo cambian rutas, para las pruebas, y las fija root. La cuenta
# es «ZZ QA Pago» (org de prueba, dental, ADMIN de su propia org, sin MFA). El magic link deja un token
# de un solo uso en `auth`: es la excepción que el rol permite (§3).
#
# Uso (cron):  */15 * * * * onia-latido.sh qa-release 900 '/root/bin/onia-qa-release.sh' >> /var/log/onia-qa-release.log 2>&1
# Salidas: 0 midió (aunque haya encontrado algo roto) · 2 no pudo medir · 75 la corrida anterior quedó
# trabada (nadie mira) · 64 uso. El latido anota el código: el resumen de las 06:30 nombra el que no es 0.
set -uo pipefail
export LC_ALL=C.UTF-8

readonly CORREO_QA='oninteligenciaartificial+qapago@gmail.com'
readonly PANTALLAS='/dashboard /checkout'
# Texto que solo aparece cuando la pantalla falló: las tarjetas de error y de «no encontrado» de la
# plataforma (app/error.tsx, app/(dashboard)/error.tsx, app/global-error.tsx, los not-found) y las
# de Next y del proxy. Medido contra onia-platform master el 10-oct.
readonly TEXTO_DE_ERROR='Algo salió mal|No pudimos mostrar esta página|Ha ocurrido un error inesperado|Error 404|Página no encontrada|No encontramos esto|Application error|Internal Server Error|Bad Gateway|This page could not be found'

ESTADO="${ONIA_QA_ESTADO:-/var/lib/onia-qa-release}"
MIRAR="${ONIA_QA_MIRAR:-/root/bin/onia-mirar.js}"
TG="${ONIA_TG:-/root/bin/onia-tg.sh}"
TABLERO="${ONIA_TABLERO:-/root/bin/onia-tablero.sh}"
LOG_PUBLICADOR="${ONIA_PUBLICAR_LOG:-/var/log/onia-publicar-solo.log}"
LOCK_PUBLICADOR="${ONIA_PUBLICAR_LOCK:-/var/lock/onia-publicar-solo.lock}"
LOG="${ONIA_QA_LOG:-/var/log/onia-qa-release.log}"
LENTO="${ONIA_QA_LENTO:-45}"          # segundos por pantalla (magic link + 2 cargas + 2,5 s de espera)
MIN_TEXTO="${ONIA_QA_MIN_TEXTO:-200}" # menos caracteres que esto es una pantalla vacía
REINTENTO="${ONIA_QA_REINTENTO:-60}"  # segundos antes de volver a mirar lo que salió roto
TRABADA="${ONIA_QA_TRABADA:-1200}"    # una corrida que sigue con el candado después de esto quedó trabada
NO_MEDIDO=0

if [ "$#" -gt 0 ]; then
  echo "uso: onia-qa-release.sh (sin argumentos: la cuenta de QA va fija en el script)" >&2
  exit 64
fi

ahora_s() { date -u -d "${ONIA_AHORA:-now}" +%s 2>/dev/null || date -u +%s; }
AHORA=$(ahora_s)
sello() { date -u -d "@$AHORA" +%FT%H:%MZ; }
linea() { printf '%s %s\n' "$(sello)" "$*"; }

# Nada que pueda llevar una sesión llega al log ni a un aviso: tokens en URL (también codificados), en
# JSON, ni un JWT suelto. Y nada de caracteres de control: el texto termina en tareas que leen los loops.
limpiar() {
  sed -E 's/(token[_a-z]*(=|%3D))[^&"[:space:]]+/\1…/Ig
          s/("(hashed_token|email_otp|action_link|access_token|refresh_token)"[[:space:]]*:[[:space:]]*")[^"]*/\1…/g
          s/eyJ[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*/<jwt>/g' | tr -d '\000-\010\013-\037\177' | sed -E 's/^(.{160}).*/\1/'
}
# Los avisos van a Telegram con parse_mode=HTML: un «<» suelto hace que lo rechace, y el aviso se pierde.
esc() { sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g'; }

# Todo lo que se llama desde acá va con tope de tiempo y SIN el descriptor del candado (8): un hijo que
# quedara vivo (un Chromium huérfano) se quedaría con el candado y el QA moriría callado.
aduana() { timeout -k 5 60 "$TG" "$@" 8>&- 2>/dev/null; }
tablero() { timeout -k 5 30 "$TABLERO" "$@" 8>&- 2>/dev/null; }

# Una tarea guardada sigue viva si el tablero la muestra sin el ✓. Si alguien la cerró a mano, se olvida
# su id y la próxima falla abre otra. Sin tablero no se sabe: se la da por viva (no se duplica).
tarea_viva() {  # tarea_viva <archivo-del-id>
  local id lista
  id=$(cat "$ESTADO/$1" 2>/dev/null) || return 1
  [[ "$id" =~ ^t_[0-9a-f]{8}$ ]] || { rm -f "$ESTADO/$1"; return 1; }
  lista=$(tablero list) || return 0
  if [ "$(printf '%s\n' "$lista" | grep -F "$id" | grep -cv '^✓')" -gt 0 ]; then return 0; fi
  rm -f "$ESTADO/$1"
  return 1
}
# Abre la tarea por la aduana (categoría sistema: el 🔴 la vuelve tarea del tablero) y guarda su id
# para cerrarla cuando se arregle. Una tarea roja que ya no es cierta manda a un carril a arreglar
# lo arreglado (vigia-ci.sh, 24-sep).
abrir_tarea() {  # abrir_tarea <archivo-del-id> <mensaje>
  local id
  tarea_viva "$1" && return 0
  id=$(ONIA_AVISO=sistema aduana "$2" | grep -oE 't_[0-9a-f]{8}' | awk 'NR == 1')
  [ -n "$id" ] && printf '%s\n' "$id" > "$ESTADO/$1"
  return 0
}
cerrar_tarea() {  # cerrar_tarea <archivo-del-id> <comentario>
  local id
  id=$(cat "$ESTADO/$1" 2>/dev/null) || return 0
  if [[ "$id" =~ ^t_[0-9a-f]{8}$ ]]; then
    tablero comment "$id" "$2" >/dev/null || true
    # Si el tablero no contestó, el id se guarda: se vuelve a intentar la próxima vez que esté sano. Olvidarlo
    # dejaba abierta para siempre una tarea roja que ya no es cierta (revisión del 10-oct).
    tablero complete "$id" >/dev/null || return 0
  fi
  rm -f "$ESTADO/$1"
}

# ── 1. El release que corre ──────────────────────────────────────────────────────
# Lo mismo que lee deploy-vivo.mjs y swap-imagen.sh: la etiqueta de la imagen del contenedor.
release_vivo() {
  local img
  img=$(timeout -k 5 30 docker inspect --format '{{.Config.Image}}' onia-platform 2>/dev/null 8>&-) || return 1
  [[ "$img" =~ ^onia-platform:release-([0-9a-f]{7,40})$ ]] || return 1
  printf '%s\n' "${BASH_REMATCH[1]}"
}

# Mira UNA pantalla. Escribe «OK <detalle>», «ROTO <motivo>» o «NOMEDIDO <motivo>».
mirar_pantalla() {  # mirar_pantalla <ruta>
  local ruta="$1" salida rc t0
  [ -r "$MIRAR" ] || { echo "NOMEDIDO no encuentro $MIRAR"; return; }
  t0=$(date +%s%3N)
  salida=$(timeout -k 10 150 node "$MIRAR" "$CORREO_QA" "$ruta" "$ESTADO/capturas/${ruta#/}.png" 2>&1 8>&-)
  rc=$?
  if [ "$rc" -ne 0 ]; then clasificar_fallo "$rc" "$salida"; return; fi
  # Sin sus marcas, la salida no dice nada de la pantalla (un onia-mirar.js truncado por la copia, vacío).
  if [[ $'\n'"$salida" != *$'\nURL_FINAL='* || $'\n'"$salida"$'\n' != *$'\n---TEXTO---\n'* ]]; then
    echo "NOMEDIDO onia-mirar.js no imprimió la pantalla"; return
  fi
  juzgar_pantalla "$ruta" "$(( $(date +%s%3N) - t0 ))" "$salida"
}

# onia-mirar.js salió con error. ROTO solo con evidencia de la plataforma; el resto es el instrumento.
clasificar_fallo() {  # clasificar_fallo <código> <salida>
  local fallo http
  case "$1" in
    124|137) echo "NOMEDIDO onia-mirar.js no terminó en 150 s"; return ;;
    127) echo "NOMEDIDO no encuentro node"; return ;;
  esac
  case "$2" in
    *"Cannot find module"*) echo "NOMEDIDO node no encuentra playwright"; return ;;
    # docker inspect da la etiqueta aunque el contenedor esté parado: el printenv de la clave es lo que falla.
    *"is not running"*|*"is restarting"*|*"No such container"*) echo "ROTO el contenedor onia-platform no está corriendo"; return ;;
  esac
  fallo=$(printf '%s\n' "$2" | grep -m1 '^FALLO: ' | limpiar)
  case "$fallo" in
    # El navegador o la red del VPS, no la página: Chromium que murió (memoria, con los builds de la landing y
    # el bot al lado) o un DNS caído en el VPS.
    *"Page crashed"*|*"has been closed"*|*"browser has disconnected"*|*ERR_NAME_NOT_RESOLVED*|*ERR_INTERNET_DISCONNECTED*|*ERR_NETWORK_CHANGED*)
      echo "NOMEDIDO ${fallo#FALLO: }" ;;
    "FALLO: page."*|"FALLO: fetch failed"*) echo "ROTO ${fallo#FALLO: }" ;;
    "FALLO: generate_link HTTP 5"*)
      http=$(printf '%s' "$fallo" | grep -oE 'HTTP [0-9]{3}' | awk 'NR == 1')
      echo "ROTO el login (Supabase) responde $http" ;;
    "FALLO: generate_link"*|"FALLO: sin hashed_token"*)
      # El cuerpo de la respuesta no se copia: puede traer el link con su token.
      http=$(printf '%s' "$fallo" | grep -oE 'HTTP [0-9]{3}' | awk 'NR == 1')
      echo "NOMEDIDO no pude abrir la sesión de QA (${http:-sin hashed_token})" ;;
    "") echo "NOMEDIDO onia-mirar.js terminó con código $1 sin decir por qué" ;;
    *) echo "NOMEDIDO ${fallo#FALLO: }" ;;
  esac
}

juzgar_pantalla() {  # juzgar_pantalla <ruta> <ms> <salida>
  local ruta="$1" ms="$2" url texto errores frase extra=""
  url=$(printf '%s\n' "$3" | sed -n 's/^URL_FINAL=//p' | awk 'NR == 1')
  url="${url#https://app.onia.com.bo}"; url="${url%%\?*}"; url="${url%%#*}"
  texto=$(printf '%s\n' "$3" | sed -n '/^---TEXTO---$/,/^---ERRORES CONSOLA---$/p' | sed '1d;/^---ERRORES CONSOLA---$/d')
  errores=$(printf '%s\n' "$3" | sed -n '/^---ERRORES CONSOLA---$/,$p' | sed '1d' | grep -c .)
  # El layout del panel manda a /onboarding a toda cuenta ADMIN cuya organización no terminó el alta
  # (onboardingCompletedAt vacío). Para la cuenta de QA eso es su estado, no un release roto: se dijo ROTO el
  # 16-oct (21:00Z, release a0488f04, que no toca ese layout) y se le habría gritado a Plataforma por un dato.
  if [ "$url" = "/onboarding" ] && [ "$ruta" != "/onboarding" ]; then
    echo "NOMEDIDO la cuenta de QA no terminó el alta: $ruta la manda a /onboarding"; return
  fi
  if [ "$url" != "$ruta" ]; then echo "ROTO terminó en $(printf '%s' "${url:-?}" | limpiar)"; return; fi
  frase=$(printf '%s\n' "$texto" | grep -oE "$TEXTO_DE_ERROR" | awk 'NR == 1')
  [ -n "$frase" ] && { echo "ROTO muestra «$frase»"; return; }
  [ "${#texto}" -lt "$MIN_TEXTO" ] && { echo "ROTO pantalla casi vacía (${#texto} caracteres)"; return; }
  [ "$ms" -gt $(( LENTO * 1000 )) ] && { echo "ROTO lenta: $(( ms / 1000 )) s (tope ${LENTO} s)"; return; }
  [ "${errores:-0}" -gt 0 ] && extra=", $errores error(es) de consola"
  echo "OK $(( (ms + 500) / 1000 )) s$extra"
}

# Mira todas las pantallas; lo que sale roto se vuelve a mirar una vez. Escribe «ruta<TAB>veredicto».
medir() {
  local p r
  for p in $PANTALLAS; do
    r=$(mirar_pantalla "$p")
    if [ "${r%% *}" = ROTO ]; then
      sleep "$REINTENTO"
      r=$(mirar_pantalla "$p")
    fi
    printf '%s\t%s\n' "$p" "$r"
  done
}

revisar_release() {  # revisar_release <sha> <sha-anterior|"">
  local sha="$1" antes="$2" res resumen rotos nomedidos que="release $1"
  res=$(medir)
  resumen=$(printf '%s\n' "$res" | awk -F'\t' '{ printf "%s%s %s", (NR > 1 ? " · " : ""), $1, $2 }')
  rotos=$(printf '%s\n' "$res" | awk -F'\t' '$2 ~ /^ROTO / { sub(/^ROTO /, "", $2); printf "%s%s %s", (n++ ? "; " : ""), $1, $2 }')
  nomedidos=$(printf '%s\n' "$res" | awk -F'\t' '$2 ~ /^NOMEDIDO / { sub(/^NOMEDIDO /, "", $2); printf "%s%s %s", (n++ ? "; " : ""), $1, $2 }')
  if [ -z "$antes" ]; then que+=" (primera vez que lo miro)"
  elif [ "$antes" != "$sha" ]; then que+=" nuevo (antes $antes)"
  else que+=" (vuelvo a mirar)"; fi
  # Lo roto gana: una pantalla rota es evidencia aunque la otra no se haya podido medir.
  if [ -z "$rotos" ] && [ -n "$nomedidos" ]; then
    linea "$que NO MEDIDO: $nomedidos"
    NO_MEDIDO=1
    touch "$ESTADO/sin-medir"
    abrir_tarea tarea-medir "🔴 QA de publicación: no pude medir app.onia.com.bo — $nomedidos
Lo mira el carril Hermes-Jarvis: es el instrumento (onia-mirar.js, Chromium o la cuenta de QA), no la plataforma."
    return
  fi
  if [ -z "$nomedidos" ]; then
    rm -f "$ESTADO/sin-medir"
    cerrar_tarea tarea-medir "El QA de publicación volvió a medir: $resumen"
  else
    que+=" (sin medir: $nomedidos)"
    NO_MEDIDO=1
  fi
  printf '%s\n' "$sha" > "$ESTADO/visto"
  if [ -n "$rotos" ]; then quedo_roto "$que" "$sha" "$rotos"; else quedo_sano "$que" "$sha" "$resumen"; fi
}

quedo_roto() {  # quedo_roto <que> <sha> <motivos>
  local desde
  desde=$(cut -d' ' -f2 "$ESTADO/roto" 2>/dev/null)
  [[ "$desde" =~ ^[0-9]+$ ]] || desde=$AHORA
  printf '%s %s %s\n' "$2" "$desde" "$3" > "$ESTADO/roto"
  linea "$1 ROTO: $3 (roto desde $(date -u -d "@$desde" +%H:%MZ))"
  abrir_tarea tarea-roto "🔴 Plataforma: el release publicado está roto — $3
Release $2 en app.onia.com.bo, medido con la cuenta de QA. Arreglarlo o volver al release anterior (swap-imagen.sh).
Captura: $ESTADO/capturas/"
  ONIA_AVISO=interrumpe ONIA_AVISO_CLAVE=qa-release ONIA_AVISO_ESPERA=30 ONIA_AVISO_EMISOR=qa-release \
    aduana "🚨 <b>Onia: la app publicada está rota</b>
Pasó: $(printf '%s' "$3" | esc) (release $2), desde las $(date -u -d "@$(( desde - 4 * 3600 ))" +%H:%M) de La Paz.
Necesito: nada; Plataforma lo arregla o vuelve al release anterior.
Sigue: lo miro cada 15 min y te aviso cuando vuelva." >/dev/null || true
}

quedo_sano() {  # quedo_sano <que> <sha> <resumen>
  linea "$1: $3"
  [ -f "$ESTADO/roto" ] || return 0
  rm -f "$ESTADO/roto"
  cerrar_tarea tarea-roto "Volvió: release $2 sano ($3)"
  ONIA_AVISO=interrumpe ONIA_AVISO_CLAVE=qa-release ONIA_AVISO_RECUPERADO=1 ONIA_AVISO_EMISOR=qa-release \
    aduana "✅ <b>Onia: la app volvió</b>
Pasó: release $2 sano ($(printf '%s' "$3" | esc))." >/dev/null || true
}

paso_release() {
  local sha antes
  if ! sha=$(release_vivo); then
    linea "release: no pude leerlo (docker inspect onia-platform)"
    NO_MEDIDO=1
    return
  fi
  antes=$(cat "$ESTADO/visto" 2>/dev/null)
  if [ "$sha" = "$antes" ] && [ ! -f "$ESTADO/roto" ] && [ ! -f "$ESTADO/sin-medir" ]; then
    linea "release $sha sin cambios"
    return
  fi
  revisar_release "$sha" "$antes"
}

# ── 2. Las ventanas del publicador de las :50 ───────────────────────────────────
# `50 */3 * * *`: 00:50, 03:50 … 21:50 UTC. Se lee una hora y diez después (el lock puede esperar
# 15 min y el build tarda), una sola vez por ventana.
ventana_a_leer() {
  local t=$(( AHORA - 70 * 60 - 50 * 60 ))
  echo $(( t - t % 10800 + 50 * 60 ))
}

# El bloque de UNA corrida del publicador: desde su encabezado «== AAAA-MM-DD HH:MM La Paz ==» (lo
# escribe al tomar el lock, o al rendirse) hasta el siguiente, en la hora que sigue a la ventana. Si hay
# más de uno gana el último, salvo los de un --dry-run a mano («publicaria»): esos no publican nada.
# La Paz es UTC-4 todo el año, sin horario de verano.
bloque_de() {  # bloque_de <epoch-ventana>
  local m encabezados=""
  for m in $(seq 0 59); do
    encabezados+="== $(date -u -d "@$(( $1 - 4 * 3600 + m * 60 ))" '+%F %H:%M') La Paz =="$'\n'
  done
  ENCABEZADOS="$encabezados" awk '
    BEGIN { n = split(ENVIRON["ENCABEZADOS"], e, "\n"); for (i = 1; i <= n; i++) if (e[i] != "") quiero[e[i]] = 1 }
    function cerrar() { if (dentro && bloque !~ /plataforma: publicaria/) ultimo = bloque }
    /^== .* La Paz ==$/ { cerrar(); dentro = ($0 in quiero); bloque = "" }
    dentro { bloque = bloque $0 "\n" }
    END { cerrar(); printf "%s", ultimo }
  ' "$LOG_PUBLICADOR"
}

# «OK <dice>», «FIRMA <dice>» (espera a Sergio Urcullo), «FALLIDA <motivo>» o «SIGUE» (sin veredicto todavía).
veredicto_ventana() {  # veredicto_ventana <bloque>
  local dice
  [ -n "$1" ] || { echo "SIGUE"; return; }
  dice=$(printf '%s\n' "$1" | sed -n -E 's/^[[:space:]]*plataforma:[[:space:]]*//p' | tail -1 | limpiar | cut -c1-120)
  case "$dice" in
    "al dia"*|PUBLICADO*) echo "OK $dice" ;;
    "NO publico solo"*)
      # Las dos causas del freno tienen el remedio opuesto (deploy_sin_pedido.mjs): un monto que cambió
      # espera la firma; un freno que no pudo medir es una falla del instrumento de Plataforma.
      case "${dice,,}" in *"no pude medir"*|*"no pude comprobar"*) echo "FALLIDA $dice" ;; *) echo "FIRMA $dice" ;; esac ;;
    "") case "$1" in *"me rendi"*) echo "FALLIDA se rindió: otra publicación tenía el lock" ;; *) echo "SIGUE" ;; esac ;;
    *) echo "FALLIDA $dice" ;;
  esac
}

publicador_corriendo() { [ -e "$LOCK_PUBLICADOR" ] && ! flock -n "$LOCK_PUBLICADOR" true 8>&-; }

paso_ventanas() {
  local w hora v seguidas
  w=$(ventana_a_leer)
  [ "$(cat "$ESTADO/ventana" 2>/dev/null)" = "$w" ] && return 0
  hora=$(date -u -d "@$w" +%H:%M)
  if [ ! -r "$LOG_PUBLICADOR" ]; then
    # La ventana NO se da por leída: cuando el log aparezca, se lee. Y no se calla: exit 2 y una tarea.
    linea "ventana $hora UTC: no puedo leer el log del publicador ($LOG_PUBLICADOR)"
    NO_MEDIDO=1
    abrir_tarea tarea-log "🔴 QA de publicación: no puedo leer el log del publicador ($LOG_PUBLICADOR)
Sin él no se ve si el publicador de las :50 publica. ¿Su línea del crontab tiene >> $LOG_PUBLICADOR 2>&1?"
    return 0
  fi
  cerrar_tarea tarea-log "El log del publicador ya se lee"
  v=$(veredicto_ventana "$(bloque_de "$w")")
  if [ "$v" = SIGUE ] && publicador_corriendo; then
    # Esperar, pero no para siempre: pasadas 2 h 30 de la :50 la ventana siguiente la taparía sin anotarla.
    if [ $(( AHORA - w )) -le $(( 150 * 60 )) ]; then
      linea "ventana $hora UTC: el publicador sigue corriendo, la leo en la próxima"; return 0
    fi
    v="FALLIDA el publicador lleva más de 2 h con el lock"
  elif [ "$v" = SIGUE ]; then
    # Pudo terminar entre la lectura y la consulta del lock: se lee una vez más antes de darla por fallida.
    v=$(veredicto_ventana "$(bloque_de "$w")")
    [ "$v" = SIGUE ] && v="FALLIDA el publicador no dejó veredicto de la plataforma en esa hora"
  fi
  printf '%s\n' "$w" > "$ESTADO/ventana"
  seguidas=$(cat "$ESTADO/ventanas-seguidas" 2>/dev/null)
  [[ "$seguidas" =~ ^[0-9]+$ ]] || seguidas=0
  case "${v%% *}" in
    OK)
      linea "ventana $hora UTC: plataforma ${v#OK }"
      printf '0\n' > "$ESTADO/ventanas-seguidas"
      cerrar_tarea tarea-ventanas "Volvió a publicar: ventana de las $hora UTC (${v#OK })" ;;
    FIRMA) linea "ventana $hora UTC: plataforma espera la firma de Sergio Urcullo (${v#FIRMA })" ;;
    *) ventana_fallida "$hora" "${v#FALLIDA }" "$(( seguidas + 1 ))" ;;
  esac
}

ventana_fallida() {  # ventana_fallida <hora> <motivo> <seguidas>
  printf '%s\n' "$3" > "$ESTADO/ventanas-seguidas"
  linea "ventana $1 UTC sin publicar: $2 (seguidas: $3)"
  [ "$3" -ge 2 ] || return 0
  abrir_tarea tarea-ventanas "🔴 Plataforma: $3 ventanas de publicación seguidas sin publicar
La última, $1 UTC: $2. Producción sigue con el release anterior.
Logs: $LOG_PUBLICADOR y /tmp/pub-plataforma.log en el VPS."
}

# Una tarea cuyo motivo ya pasó pero que el tablero no dejó cerrar (no contestó) se vuelve a cerrar en cada
# corrida, no recién en el próximo episodio.
reintentar_cierres() {
  [ -f "$ESTADO/tarea-roto" ] && [ ! -f "$ESTADO/roto" ] && cerrar_tarea tarea-roto "Volvió: el release ya no está roto"
  [ -f "$ESTADO/tarea-medir" ] && [ ! -f "$ESTADO/sin-medir" ] && cerrar_tarea tarea-medir "El QA de publicación volvió a medir"
  [ -f "$ESTADO/tarea-ventanas" ] && [ "$(cat "$ESTADO/ventanas-seguidas" 2>/dev/null)" = 0 ] \
    && cerrar_tarea tarea-ventanas "Volvió a publicar"
  return 0
}

# ── Corrida ──────────────────────────────────────────────────────────────────────
mkdir -p "$ESTADO/capturas" && chmod 700 "$ESTADO" || { linea "no pude crear $ESTADO"; exit 2; }
exec 8>"$ESTADO/.candado"
if ! flock -n 8; then
  # Una corrida dura minutos. Si la anterior sigue con el candado después de TRABADA, nadie está mirando:
  # se dice con un código que el latido anota, en vez de saltar callado para siempre.
  desde=$(cat "$ESTADO/corriendo-desde" 2>/dev/null)
  if ! [[ "$desde" =~ ^[0-9]+$ ]]; then
    # Sin sello legible se cuenta desde el primer salto: tampoco así se salta callado para siempre.
    desde=$(cat "$ESTADO/salto-desde" 2>/dev/null)
    [[ "$desde" =~ ^[0-9]+$ ]] || { desde=$AHORA; printf '%s\n' "$AHORA" > "$ESTADO/salto-desde"; }
  fi
  if [ $(( AHORA - desde )) -gt "$TRABADA" ]; then
    linea "la corrida de las $(date -u -d "@$desde" +%H:%MZ) sigue con el candado ($(( (AHORA - desde) / 60 )) min): nadie está mirando"
    exit 75
  fi
  linea "otra corrida sigue mirando: salto esta"
  exit 0
fi
printf '%s\n' "$AHORA" > "$ESTADO/corriendo-desde"
rm -f "$ESTADO/salto-desde"

paso_release
paso_ventanas
reintentar_cierres

# Una línea por corrida, 96 por día: se guardan las últimas ~2000 (como onia-mirar-cliente.sh). Va al
# final porque lo que se escriba después del recorte se perdería con el archivo viejo. El temporal lo
# crea mktemp (nombre nuevo, sin seguir un enlace que alguien haya dejado en /var/log).
if [ -f "$LOG" ] && [ "$(wc -l < "$LOG")" -gt 4000 ]; then
  tmp=$(mktemp "$LOG.XXXXXX") && tail -n 2000 "$LOG" > "$tmp" && mv -f "$tmp" "$LOG" || rm -f "${tmp:-}"
fi
[ "$NO_MEDIDO" -eq 0 ] || exit 2
exit 0

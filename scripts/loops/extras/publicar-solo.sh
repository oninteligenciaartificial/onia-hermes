#!/usr/bin/env bash
# Publica solo lo que pasa TODOS los gates. AVISA en vez de preguntar.
#
# POR QUE EXISTE. Medido el 2026-09-08: se publicaron 45 arreglos a las 17:31 y
# para las 22:30 —menos de cinco horas— ya habia ONCE nuevos esperando. Los loops
# producen ~2 arreglos por hora en la plataforma; la firma de Sergio Urcullo
# ocurre cada varios dias. Por eso el item "hay arreglos verdes esperando UN ok"
# de plataforma-v1.md NO PUEDE quedarse cerrado: se reabre solo cada pocas horas,
# para siempre. Se cerro a mano ese mismo dia y volvio a abrirse mientras se
# hablaba de el. Un cuello de botella que se mide en horas no se arregla pidiendo
# la firma mas seguido: se arregla sacandola del camino de lo que la maquina ya
# verifico.
#
# LO QUE SIGUE NECESITANDO SU FIRMA. Si un commit varado toca una fuente de
# PRECIO, este guion NO publica ese destino: avisa y sigue con los demas. Es la
# regla "una sola fuente de verdad por tema" de CLAUDE.md vuelta guarda
# ejecutable — el repo llego a tener CUATRO precios vivos del mismo chatbot, y
# eso empieza con un cambio que nadie miro.
#
# LOS GATES NO SON DE ESTE GUION, y es a proposito. Cada publicar.sh ya mide, se
# niega si hay otro build corriendo, corre sus gates (standalone integro,
# BUILD_ID nuevo contra el vivo LEIDO, cero 127.0.0.1 horneado), respalda y
# REVIERTE solo si el swap falla. Esto es el disparador y el aviso, no una
# segunda opinion que se desincronice de la primera el dia que una cambie.
#
#   bash onia-publicar-solo.sh --dry-run   # dice que haria, no toca nada
set -uo pipefail

TG=${ONIA_TG:-/root/bin/onia-tg.sh}
# El lock se puede apuntar a otro lado SOLO para poder probar la rama de
# "no consegui el lock" sin tocar el de produccion. El default es el de siempre.
LOCK=${ONIA_PUBLICAR_LOCK:-/var/lock/onia-publicar-solo.lock}
REPO_HERMES=${ONIA_LOOPS_REPO:-/root/loops/onia-hermes}
REPO_PLATFORM=${ONIA_PLATFORM_REPO:-/root/loops/onia-platform}
# El modo seco tambien se puede forzar por entorno, y no es un lujo: es lo que
# deja que un caso de prueba ejecute este guion sin que un flag mal escrito
# termine publicando los tres destinos de verdad.
SECO=${ONIA_PUBLICAR_SECO:-}
[ "${1:-}" = "--dry-run" ] && SECO=1

# Fuentes de precio. CLAUDE.md nombra DOS archivos y cada uno manda sobre lo
# suyo: subscription-plans.ts son los montos de los planes (es el que valida el
# pago), pricing.ts son los add-ons. El catalogo dice QUE se vende. El knowledge
# del bot lleva los precios que el bot dice en voz alta.
FIRMA_HUMANA='lib/pricing\.ts|lib/subscription-plans\.ts|ONIA_CATALOGO_DE_VENTA\.md|knowledge\.onia\.json'

# ---------------------------------------------------------------------------
# TOCAR UNA FUENTE DE PRECIO NO ES CAMBIAR UN PRECIO.
#
# Hasta el 2026-09-18 la guarda de arriba era todo el criterio: si un commit
# varado NOMBRABA uno de esos archivos, el destino no salia. Medido ese dia
# (tarea t_189a6037): los TRES destinos llevaban dias detenidos y el unico
# cambio en `lib/subscription-plans.ts` era `DEFAULT_PLAN_AMOUNTS[plan][cycle]`
# pasando a `[plan]?.[cycle]` mas comentarios — la tabla de montos, identica
# linea por linea. Un `?.` no cambia lo que se le cobra a nadie, pero le pedia
# la firma a Sergio Urcullo igual, y atras de ese freno esperaba el arreglo que
# dejaba afuera a todo cliente nuevo.
#
# La pregunta correcta no es QUE ARCHIVO se toco sino SI ALGUN NUMERO CAMBIO.
# Se contesta sobre el diff, con los comentarios afuera: un numero citado en un
# comentario que narra el bug viejo (y `lib/pricing.ts` tiene varios) no es un
# precio publicado. Si los numeros de los dos lados del diff son los MISMOS, no
# hay monto nuevo y el destino sale solo.
#
# 🔴 Y falla CERRADO a proposito: un numero que cambia detiene el destino SALVO
# que se pueda mostrar que no es plata. Nunca al reves. No hay lista de "claves
# de plata": esa se escribiria a mano y el dia que aparezca una nueva
# (`tarifaBase: 320`) el guion publicaria un precio sin firma, que es la
# direccion cara. Lo que si cambia es el AVISO: antes decia "toca una fuente de
# precio" y ahora dice QUE numero cambia, asi Sergio Urcullo decide de un
# vistazo en vez de tener que abrir el diff.
#
# EL CORTE NO ES LA FORMA DEL NUMERO NI SU VALOR: ES LA CLAVE QUE LO RECIBE.
# Medido el 2026-09-19 06:39 La Paz con `2b12f50ae` esperando en `origin/main`:
# el freno contestaba «landing: NO publico solo — cambia un numero en una fuente
# de precio: .../pricing.ts: 0 1» y NINGUN monto cambiaba (`Bs 70` salia intacto
# de `USUARIO_EXTRA_ADDON`). Lo que acusaba era `asientosExtra: 0` —cuantas
# PERSONAS extra vende un plan— y el `0`/`1` de `frase.charAt(0)`/`frase.slice(1)`,
# un helper que arma texto. La cura del 2026-09-18 (`d5619454`) habia sacado las
# COMPARACIONES (`> 0`) y dejado las ASIGNACIONES (`: 0`) deteniendo con su motivo
# escrito —«un add-on que pasa a gratis se escribe `: 0`»—, que sigue siendo
# cierto: lo que faltaba es mirar A QUE CAMPO se asigna. `: 0` en `mensualAddon`
# es plata; en `asientosExtra` es una cantidad de personas.
#
# Por que la excusa se ancla al vocabulario de CANTIDAD y no al de plata: la
# direccion del dano no es simetrica. Detener de mas cuesta una firma de Sergio
# Urcullo —y esa es la unica firma que importa: gastarla en falsos la vuelve
# automatica—; dejar pasar de menos publica un precio que nadie decidio. Por eso
# la clave tiene que decir CANTIDAD **y ademas** no nombrar plata: una clave que
# el guion no sabe nombrar sigue deteniendo, que es fallar cerrado. Lo ancla el
# caso «una clave que el guion NO sabe nombrar, asignada a 0, sigue deteniendo»
# de `scripts/publicador-freno-de-precio.test.mjs`.
# ---------------------------------------------------------------------------

# Los numeros que unos commits CAMBIAN en un archivo, con los comentarios afuera.
# Imprime una linea por numero, con el signo del lado del diff (`+320` / `-320`).
numeros_del_diff() {  # $1=repo-del-codigo  $2=archivo  $3..=shas
  local repo=$1 archivo=$2 sha
  shift 2
  for sha in "$@"; do
    # `-m --first-parent` o el MERGE sale VACIO y un precio entra en verde: `git
    # show` de un merge no imprime nada sin eso, y los medidores de varados
    # devuelven merges (el que trajo la rama a main es un commit varado mas).
    # Medido el 2026-09-18 con a6adee05 de onia-platform, que es justo el commit
    # que la tarea t_189a6037 tomo como caso.
    GIT_NO_LAZY_FETCH=1 git -C "$repo" show --format= --unified=0 -m --first-parent \
      "$sha" -- "$archivo" 2>/dev/null
  done | awk '
    /^(\+\+\+|---)/ { next }
    /^[+-]/ {
      signo = substr($0, 1, 1); linea = substr($0, 2)
      if (linea ~ /^[[:space:]]*(\/\/|\*|\/\*)/) next   # renglon de comentario
      sub(/\/\/.*$/, "", linea)                          # comentario al final
      # Un `0` o un `1` en POSICION de comparacion o de indice no es plata. El
      # corte no es el valor: es donde esta escrito. Un umbral de plata nunca se
      # escribe `> 0` ni `> 1` (`total > 1500` sobrevive: el `1` viene seguido de
      # otro digito), y un add-on que pasa a gratis se escribe `: 0`, que es una
      # ASIGNACION y sigue deteniendo. Los tres patrones son las tres formas en
      # que un helper cuenta cosas: comparar, indexar hacia atras, y `.at()`.
      gsub(/(>=|<=|===|!==|==|!=|>|<)[ \t]*-?[01]([^0-9.,]|$)/, " ", linea)
      gsub(/\[[^]]*[-+][ \t]*[01][ \t]*\]/, " ", linea)
      gsub(/\[[ \t]*-?[01][ \t]*\]/, " ", linea)
      # El argumento de un metodo de POSICION es un indice, no un monto: ninguno
      # de estos recibe plata. Se nombran de a uno en vez de aceptar cualquier
      # `.f(0)`, porque `precioDe(0)` si podria serlo.
      gsub(/\.(at|charAt|charCodeAt|codePointAt|slice|splice|substring|substr|indexOf|lastIndexOf|padStart|padEnd|repeat)\([ \t]*-?[01][ \t]*(,[ \t]*-?[01][ \t]*)?\)/, " ", linea)
      # Una asignacion `clave: 0|1` donde la CLAVE cuenta cosas. Se exigen las DOS
      # mitades: que nombre una cantidad Y que no nombre plata, para que
      # `precioPorUsuario: 0` —que las dos veces dice «usuario»— siga deteniendo.
      # `tolower` no cambia el largo, asi que RSTART/RLENGTH valen sobre el original.
      bajo = tolower(linea)
      # El terminador admite la coma que cierra la propiedad (`asientosExtra: 0,`)
      # pero NO la que separa decimales (`monto: 1,50`), que tiene que seguir
      # contando como numero entero.
      while (match(bajo, /[a-z0-9_$]*(asiento|usuario|persona|cupo|ficha|conversacion|sesion|length|index|indice)[a-z0-9_$]*[ \t]*:[ \t]*-?[01](,[^0-9]|,$|[^0-9.,]|$)/)) {
        clave = substr(bajo, RSTART, RLENGTH)
        if (clave ~ /precio|monto|tarifa|abono|costo|cost|price|amount|pago|mensual|anual|yearly|monthly|bs/) break
        linea = substr(linea, 1, RSTART - 1) " " substr(linea, RSTART + RLENGTH)
        bajo  = substr(bajo,  1, RSTART - 1) " " substr(bajo,  RSTART + RLENGTH)
      }
      while (match(linea, /[0-9][0-9.,]*/)) {
        n = substr(linea, RSTART, RLENGTH); gsub(/[.,]/, "", n)
        print signo n
        linea = substr(linea, RSTART + RLENGTH)
      }
    }'
}

# ¿Cambia algun numero? Imprime los que entran y los que salen.
#   0 = ninguno cambia (se puede publicar)   1 = cambia alguno (detener)
#   2 = NO MEDIDO: no pude leer el repo o un sha (detener igual, pero diciendolo)
montos_que_cambian() {  # $1=repo-del-codigo  $2=archivo  $3..=shas
  local repo=$1 archivo=$2 sha entran salen
  shift 2
  [ "$#" -eq 0 ] && return 2
  GIT_NO_LAZY_FETCH=1 git -C "$repo" rev-parse --git-dir >/dev/null 2>&1 || return 2
  for sha in "$@"; do
    GIT_NO_LAZY_FETCH=1 git -C "$repo" cat-file -e "${sha}^{commit}" 2>/dev/null || return 2
  done
  entran=$(numeros_del_diff "$repo" "$archivo" "$@" | grep '^+' | sed 's/^+//' | sort)
  salen=$(numeros_del_diff "$repo" "$archivo" "$@" | grep '^-' | sed 's/^-//' | sort)
  [ "$entran" = "$salen" ] && return 0
  printf '%s' "$(comm -3 <(printf '%s\n' "$salen") <(printf '%s\n' "$entran") \
    | tr -d '\t' | grep -v '^$' | sort -u | tr '\n' ' ')"
  return 1
}

# El RENGLON del log cuando el freno detiene un destino. Lleva SU CITA —que
# numero cambia, o que archivo no se pudo mirar—, no solo el motivo.
#
# Nace de la tarea t_c441fba9 (2026-09-18). El detalle se calculaba bien y salia
# UNICAMENTE por Telegram, que para este aviso no entrega: medido ese dia sobre
# /var/log/onia-tg.log hay 136 emisiones de "publicacion detenida a proposito" y
# CERO con `OK message_id=`, sobre 1.403 entregas reales — o sea el log si
# distingue, y este aviso no llego nunca. El unico canal que alguien lee es el
# log del publicador, y decia el motivo a secas.
#
# Por que eso no es cosmetico: un veredicto sin cita NO SE PUEDE REFUTAR. Con esa
# linea sola, otra sesion diagnostico que el freno contaba los numeros de los
# COMENTARIOS —que ya descarta desde d9f6a303— y propuso como cura algo que ya
# estaba escrito hacia horas; lo que de verdad cambiaba eran `0` y `1`, los
# indices de un helper nuevo de `pricing.ts`. Con la cita al lado, eso se ve de
# un vistazo y sin abrir el diff, que es justo lo que la cabecera promete.
#
# Se rinde en UN solo lugar a proposito: un destino que arme la frase por su
# cuenta vuelve a quedar sin cita el dia que lo agreguen.
renglon_detenido() {  # $1=nombre  $2=motivo  $3=detalle
  local detalle motivo=$2
  detalle=$(printf '%s' "$3" | tr '\n' ' ' | sed 's/[[:space:]]\{1,\}/ /g; s/^ //; s/ *$//')
  # Sin detalle no se cuelga un `:` vacio, que se lee como cita perdida.
  [ -n "$detalle" ] && motivo="$motivo: $detalle"
  printf '  %s: NO publico solo — %s\n' "$1" "$motivo"
}

# Se puede preguntar desde afuera, que es la unica forma de PROBAR la decision:
# adentro del guion entero hace falta /opt, y en la maquina donde corren los
# carriles /opt no existe. Va ANTES del lock: preguntar no publica nada.
if [ "${1:-}" = "--renglon" ]; then
  shift
  [ "$#" -ge 2 ] || { echo "uso: publicar-solo.sh --renglon <nombre> <motivo> [detalle]" >&2; exit 2; }
  renglon_detenido "$1" "$2" "${3:-}"
  exit 0
fi

if [ "${1:-}" = "--montos" ]; then
  shift
  [ "$#" -ge 2 ] || { echo "uso: publicar-solo.sh --montos <repo> <archivo> <sha>..." >&2; exit 2; }
  MONTOS_REPO=$1; MONTOS_ARCHIVO=$2; shift 2
  SALIDA_MONTOS=$(montos_que_cambian "$MONTOS_REPO" "$MONTOS_ARCHIVO" "$@")
  case $? in
    0) echo "ningun monto cambia"; exit 0 ;;
    1) echo "cambian: $SALIDA_MONTOS"; exit 1 ;;
    *) echo "NO MEDIDO: no pude leer el repo o alguno de los commits"; exit 2 ;;
  esac
fi

# Un argumento que no se reconoce NO puede caer en "publicar de verdad". Hasta
# hoy `--dry-run` era el unico que este guion miraba y cualquier otra cosa seguia
# de largo: un typo (`--dryrun`), o un modo de consulta que alguien agregue
# mañana y quede mal escrito en quien lo llama, publicaba los TRES destinos sin
# decir una palabra. Los modos de consulta ya salieron mas arriba.
case "${1:-}" in
  ""|--dry-run) ;;
  *)
    echo "uso: publicar-solo.sh [--dry-run]" >&2
    echo "     publicar-solo.sh --montos <repo> <archivo> <sha>..." >&2
    echo "     publicar-solo.sh --renglon <nombre> <motivo> [detalle]" >&2
    exit 2
    ;;
esac

avisar() {
  if [ -n "$SECO" ]; then echo "  [seco] avisaria: $1"; return; fi
  # HTML, nunca Markdown: un guion bajo suelto hace que el mensaje NO llegue.
  "$TG" "$1" >/dev/null 2>&1 || true
}

# Un solo publicador a la vez. La leccion de los builds encimados que tumbaron el
# VPS el 2026-08-22 (load 18, npm de 40 min) vale igual cuando el que encima los
# builds es un cron y no una persona.
#
# 🔴 ESPERA, no se rinde — y el cron corre cada 3 HORAS, esa es toda la razon.
# Hasta el 2026-09-18 aca decia `flock -n`, que se rinde en el acto: quien no
# consigue el lock pierde la ventana ENTERA y los tres destinos se quedan sin
# publicar 3 h mas. Medido ese dia: la corrida de las 06:50:01 UTC se salteo
# completa porque un `--dry-run` de DOS SEGUNDOS, disparado a mano 66 s antes
# para probar un pedido de deploy, todavia tenia tomado el lock por su deploy
# en segundo plano. Nadie se entero: salia `exit 0`, o sea el cron lo leia como
# exito, y la linea del log no llevaba FECHA, asi que en un log append-only no
# se podia atribuir a ninguna corrida (hubo que deducirla por el mtime).
# El que espera no encima nada: al entrar vuelve a MEDIR, y si el otro ya
# publico lo que habia, este dice "al dia" y no toca nada.
exec 9>"$LOCK"
if ! flock -w "${ONIA_PUBLICAR_ESPERA:-900}" 9; then
  # Aca ya no es una colision de segundos: algo lleva 15 min con el lock.
  # Eso SI es anormal y se avisa, con fecha, para poder atribuirlo despues.
  echo "== $(TZ=America/La_Paz date '+%F %H:%M') La Paz =="
  echo "  me rendi: otra publicacion lleva mas de ${ONIA_PUBLICAR_ESPERA:-900}s con el lock ($LOCK)"
  avisar "<b>Onia — publicacion salteada</b>
El publicador automatico no pudo arrancar: otra publicacion lleva mas de ${ONIA_PUBLICAR_ESPERA:-900}s con el lock.
Los tres destinos esperan hasta la proxima corrida (3 h)."
  exit 0
fi

# Los archivos que tocan los commits varados de un destino. Se le PREGUNTA al
# mismo medidor que usa el publicador: dos derivaciones distintas de "que falta"
# se contradicen el dia que una cambia.
shas_varados() {  # $1=cwd  $2=modulo
  (cd "$1" && node "$2" --json 2>/dev/null \
     | grep -oE '"sha": *"[0-9a-f]+"' | cut -d'"' -f4)
}

archivos_de() {  # $1=repo-del-codigo  $2..=shas
  local repo=$1 f
  shift
  for f in "$@"; do
    GIT_NO_LAZY_FETCH=1 git -C "$repo" show --name-only --format= "$f" 2>/dev/null
  done
}

publicar_destino() {  # $1=nombre $2=publicar.sh $3=archivos-tocados $4=repo-del-codigo $5=shas
  local nombre=$1 guion=$2 tocados=$3 repo=${4:-} shas=${5:-}
  local precio arch detalle cambian nomedido salida nota=""
  precio=$(printf '%s\n' "$tocados" | grep -aE "$FIRMA_HUMANA" | sort -u)
  if [ -n "$precio" ]; then
    cambian=""; nomedido=""
    for arch in $precio; do
      # shellcheck disable=SC2086   # los shas son hexadecimales: partirlos es lo que se quiere
      salida=$(montos_que_cambian "$repo" "$arch" $shas)
      case $? in
        1) cambian="$cambian$arch: $salida
" ;;
        2) nomedido="$nomedido$arch
" ;;
      esac
    done
    if [ -n "$cambian" ]; then
      detalle=$(printf '%s' "$cambian" | head -3)
      # "un NUMERO", no "un monto": el freno detiene ante cualquier numero que
      # cambie porque no adivina cual es plata (ver la cabecera). Decirle monto a
      # un `0` de indice le haria creer al que lee el log que cambio un precio.
      renglon_detenido "$nombre" "cambia un numero en una fuente de precio" "$detalle"
      avisar "<b>Onia — publicacion detenida a proposito</b>
<b>$nombre</b> tiene un arreglo que CAMBIA un numero en una fuente de PRECIO:
<code>$detalle</code>
Eso no sale sin tu firma. El resto se publico solo."
      return 0
    fi
    if [ -n "$nomedido" ]; then
      detalle=$(printf '%s' "$nomedido" | head -3)
      renglon_detenido "$nombre" "toca una fuente de precio y no pude medir si cambia" "$detalle"
      avisar "<b>Onia — publicacion detenida a proposito</b>
<b>$nombre</b> toca una fuente de PRECIO y <b>no pude comprobar</b> si algun monto cambia:
<code>$detalle</code>
Eso no sale sin tu firma. El resto se publico solo."
      return 0
    fi
    # Toco el archivo y NINGUN numero cambio: sale solo, pero se dice.
    nota="
Toco una fuente de precio y <b>ningun monto cambio</b> (por eso salio solo)."
  fi
  if [ -n "$SECO" ]; then
    if [ -n "$precio" ]; then
      echo "  $nombre: publicaria (toca una fuente de precio y ningun monto cambia)"
    else
      echo "  $nombre: publicaria (nada toca precio)"
    fi
    return 0
  fi
  if bash "$guion" >"/tmp/pub-$nombre.log" 2>&1; then
    echo "  $nombre: PUBLICADO"
    avisar "<b>Onia — publicado solo</b>
<b>$nombre</b> quedo al dia.
<code>$(tail -1 "/tmp/pub-$nombre.log" | head -c 160)</code>$nota"
  else
    echo "  $nombre: FALLO"
    avisar "<b>Onia — la publicacion de $nombre FALLO</b>
<code>$(tail -3 "/tmp/pub-$nombre.log" | head -c 300)</code>
Produccion no cambio, o volvio sola. Log: /tmp/pub-$nombre.log"
  fi
}

echo "== $(TZ=America/La_Paz date '+%F %H:%M') La Paz =="

# 🔴 La salida se CAPTURA entera y se compara con `case`, nunca `... | head -1 |
# grep -q`. Con `set -o pipefail`, `head` cierra el cano, el publicador muere con
# SIGPIPE (141) y ese 141 pasa a ser el estado de TODO el `if` aunque el grep
# haya encontrado el texto. Escrito asi la primera vez (2026-09-08), este guion
# dijo "al dia" con ONCE arreglos varados delante: no habria publicado nunca, y
# el aviso de exito habria sonado igual de tranquilo. Un falso negativo que se
# ve como salud es peor que una caida.
hay_varados() { case "$1" in *"hay que publicar"*) return 0 ;; *) return 1 ;; esac; }

# LA MISMA TRAMPA, ENTRANDO POR LA OTRA PUERTA. Arriba se cerro el caso "el grep
# no encontro el texto"; faltaba el caso "el publicador nunca llego a correr".
# `hay_varados` devuelve 1 con lo mismo cuando no hay nada varado y cuando nadie
# miro, y el `|| true` se come la unica senal. Medido el 2026-09-17 desde
# nodo-casa —donde /opt NO existe, y donde corren los carriles desde el
# 2026-09-07—: este guion contesto "plataforma: al dia" y "landing: al dia" con
# 28 arreglos varados delante, y "bot: publicaria" por la razon opuesta (salida
# vacia, que tampoco dice "nada que desplegar"). Es el instrumento con el que el
# integrador decide si ABRIR un pedido de deploy: falla abierto hacia el lado
# caro, el de no pedir el deploy que hacia falta.
# No se pudo preguntar NO es "me dijeron que no": va NO MEDIDO y exit 2.
NO_MEDIDO=0
puede_medir() {  # $1 = publicador, $2 = nombre del destino
  [ -r "$1" ] && return 0
  echo "  $2: NO MEDIDO — no puedo ejecutar $1 en esta maquina. No digo 'al dia': no mire."
  NO_MEDIDO=1
  return 1
}

if puede_medir /opt/onia-platform/_deploy/publicar.sh plataforma; then
  SALIDA_PLAT=$(bash /opt/onia-platform/_deploy/publicar.sh --dry-run 2>&1) || true
  if hay_varados "$SALIDA_PLAT"; then
    SHAS_PLAT=$(shas_varados "$REPO_HERMES" hermes-content/deploy/onia-platform/deploy-vivo.mjs)
    # shellcheck disable=SC2086
    publicar_destino plataforma /opt/onia-platform/_deploy/publicar.sh \
      "$(archivos_de "$REPO_PLATFORM" $SHAS_PLAT)" "$REPO_PLATFORM" "$SHAS_PLAT"
  else
    echo "  plataforma: al dia"
  fi
fi

if puede_medir /opt/onia-landing/_deploy/publicar.sh landing; then
  SALIDA_LAND=$(bash /opt/onia-landing/_deploy/publicar.sh --dry-run 2>&1) || true
  if hay_varados "$SALIDA_LAND"; then
    SHAS_LAND=$(shas_varados "$REPO_HERMES" web-factory/apps/onia-platform/scripts/deploy-vivo.mjs)
    # shellcheck disable=SC2086
    publicar_destino landing /opt/onia-landing/_deploy/publicar.sh \
      "$(archivos_de "$REPO_HERMES" $SHAS_LAND)" "$REPO_HERMES" "$SHAS_LAND"
  else
    echo "  landing: al dia"
  fi
fi

# El bot no tiene medidor por commits: su publicador lista los archivos que
# cambian, asi que la guarda se aplica sobre esa lista tal cual. Sin shas no se
# puede preguntar si cambio un numero, asi que cae en NO MEDIDO y el bot se
# sigue deteniendo igual que antes del 2026-09-18 — fallar cerrado es la unica
# direccion honesta cuando no se pudo mirar.
if puede_medir /opt/onia/bot/_deploy/publicar.sh bot; then
  SALIDA_BOT=$(bash /opt/onia/bot/_deploy/publicar.sh --dry-run 2>&1)
  if echo "$SALIDA_BOT" | grep -q "nada que desplegar"; then
    echo "  bot: al dia"
  else
    publicar_destino bot /opt/onia/bot/_deploy/publicar.sh "$SALIDA_BOT"
  fi
fi

# Un veredicto a medias no se entrega en verde: el que lo lee tiene que poder
# distinguir "no hay nada que publicar" de "no pude preguntarlo".
[ "$NO_MEDIDO" = 1 ] && exit 2
exit 0

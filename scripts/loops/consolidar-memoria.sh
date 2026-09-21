#!/usr/bin/env bash
# ONIA — mete en MEMORY.md lo que los loops dejaron en la bandeja, de a uno y
# con cerrojo.
#
# ES DETERMINISTA A PROPOSITO. Se probo el 2026-09-03 que pedirle a Hermes que
# guarde un hecho lo lleva a COMPACTAR el archivo entero (21 entradas -> 11) y
# en esa compresion tira reglas. Este script no resume ni reescribe: agrega lo
# nuevo al final, descarta lo que ya esta (por hash del texto normalizado), y no
# toca lo que habia. Desde el 21-sep, lo que excede el presupuesto va completo a
# archivo-aprendizajes/: queda consultable, pero no se inyecta en cada llamada.
# El limite se aplica ACA, en el escritor, no en aprender.sh (que solo encola).
set -euo pipefail
umask 077

MEM="${ONIA_MEMORIA:-/root/.hermes/memories/MEMORY.md}"
INBOX="${ONIA_MEMORIA_INBOX:-/root/.hermes/memories/inbox}"
HECHOS="$INBOX/procesados"
LOCK="${ONIA_MEMORIA_LOCK:-/var/lock/onia-memoria.lock}"
ARCHIVO="${ONIA_MEMORIA_ARCHIVO:-$(dirname "$MEM")/archivo-aprendizajes}"
MAX_BYTES="${ONIA_MEMORIA_MAX_BYTES:-65536}"
TOPE_ENTRADAS=120

if [[ ! "$MAX_BYTES" =~ ^[1-9][0-9]{0,8}$ ]]; then
  echo "ONIA_MEMORIA_MAX_BYTES debe ser un entero positivo (bytes)" >&2
  exit 2
fi

[ -d "$INBOX" ] || exit 0
mkdir -p "$HECHOS"
shopt -s nullglob
# Mirada barata ANTES del cerrojo: si no hay nada, no vale la pena pelear por el.
PENDIENTES=("$INBOX"/*.md)
[ ${#PENDIENTES[@]} -eq 0 ] && exit 0

# Minusculas, sin acentos, sin espacios dobles: dos frases iguales dan el mismo
# hash. Se CONSERVAN "." y ",": el verificador del 2026-09-03 mostro que sin
# ellos "1,5 creditos" y "15 creditos" eran EL MISMO hecho, y un loop que corrigiera
# solo la cifra perdia la correccion en silencio como "repetido".
normalizar() {
  tr '[:upper:]' '[:lower:]' | iconv -f utf-8 -t ascii//TRANSLIT 2>/dev/null | tr -cd 'a-z0-9., \n' | tr -s ' ' | sed 's/^ *//;s/ *$//'
}
firma() {
  local texto
  # sed no trata un bloque vacio como error: grep -v con set -e abortaba TODA
  # la bandeja ante una firma sin hecho o separadores consecutivos heredados.
  texto=$(sed '/^— aprendido por/d' | normalizar) || return 1
  [ -n "$texto" ] || return 0
  printf '%s' "$texto" | sha256sum | cut -d' ' -f1
}

exec 9>"$LOCK"
if ! flock -w 30 9; then echo "no consegui el cerrojo de la memoria en 30s"; exit 1; fi

# 🔴 La lista se toma DE NUEVO, ya con el cerrojo. Medido el 2026-09-03 con dos
# consolidadores a la vez: los dos tomaron la misma lista antes del cerrojo, el
# primero proceso y movio los archivos, y el segundo —con la lista vieja— hizo
# `cat` de archivos que ya no estaban, obtuvo vacio, y METIO UNA ENTRADA VACIA en
# MEMORY.md. El cerrojo serializaba bien; lo que no estaba protegido era la foto
# de la bandeja. Una entrada vacia en la memoria es peor que un archivo corrupto:
# no rompe nada y se queda para siempre.
PENDIENTES=("$INBOX"/*.md)
[ ${#PENDIENTES[@]} -eq 0 ] && { flock -u 9; exit 0; }

# No reemplazar MEMORY.md con una foto vieja: el memory tool de Hermes no toma
# nuestro flock. Solo agregamos; el limite cubre este escritor, no otros editores.
# Se cuenta tambien el newline que puede faltar y el separador UTF-8.
: >> "$MEM"
chmod 600 "$MEM"
cabe() {
  PREFIJO=""
  if [ -s "$MEM" ] && [ -n "$(tail -c1 "$MEM")" ]; then PREFIJO=$'\n'; fi
  local bytes nuevos
  bytes=$(wc -c < "$MEM") || exit 1
  nuevos=$(printf '%s§\n%s\n' "$PREFIJO" "$1" | wc -c) || exit 1
  [ $((bytes + nuevos)) -le "$MAX_BYTES" ]
}
agregar() {
  # Un fallo de disco NO reconoce la entrada como procesada; se conserva inbox.
  printf '%s§\n%s\n' "$PREFIJO" "$1" >> "$MEM" || exit 1
}

if [ "$(wc -c < "$MEM")" -gt "$MAX_BYTES" ]; then
  echo "AVISO: MEMORY.md ya supera $MAX_BYTES bytes; se conserva y lo nuevo se archiva" >&2
fi
PUNTERO="Aprendizajes fuera del contexto: $ARCHIVO/. Buscar con grep -R antes de repetir una investigación. Se conservan completos; las reglas vigentes siguen aquí."
if ! grep -Fq -- "$PUNTERO" "$MEM" && cabe "$PUNTERO"; then agregar "$PUNTERO"; fi

# Firmas de lo que YA esta, para no repetir. La firma del bloque es la del hecho
# sin su linea de "aprendido por": dos loops que aprendieron lo mismo en dias
# distintos cuentan como uno.
declare -A YA
if [ -s "$MEM" ]; then
  while IFS= read -r -d '' bloque; do
    h=$(printf '%s' "$bloque" | firma)
    [ -n "$h" ] || continue
    YA["$h"]=1
  done < <(awk 'BEGIN{RS="\n§\n"; ORS="\0"} {sub(/^§\n/, ""); print}' "$MEM")
fi

TEMP_ARCHIVO=""
trap '[ -z "$TEMP_ARCHIVO" ] || rm -f -- "$TEMP_ARCHIVO"' EXIT
AGREGADOS=0; REPETIDOS=0; ARCHIVADOS=0
for f in "${PENDIENTES[@]}"; do
  # Defensa en profundidad: aunque la lista ya es de adentro del cerrojo, un
  # archivo ausente o vacio NUNCA se convierte en entrada. Vacio = se descarta.
  [ -s "$f" ] || { rm -f "$f" 2>/dev/null; continue; }
  cuerpo=$(cat "$f")
  [ -n "$(printf '%s' "$cuerpo" | tr -d '[:space:]')" ] || { rm -f "$f"; continue; }
  h=$(printf '%s' "$cuerpo" | firma)
  if [ -z "$h" ]; then
    echo "Entrada sin hecho: se conserva en inbox para revision" >&2
    exit 2
  fi
  if [ -n "${YA[$h]:-}" ] || { [ -f "$ARCHIVO/$h.md" ] && [ -s "$ARCHIVO/$h.md" ]; }; then
    REPETIDOS=$((REPETIDOS + 1))
  elif cabe "$cuerpo"; then
    agregar "$cuerpo"
    YA["$h"]=1
    AGREGADOS=$((AGREGADOS + 1))
  else
    mkdir -p "$ARCHIVO"
    # Publicar el archivo completo antes de reconocer inbox. El nombre por hash
    # conserva el dedup incluso cuando procesados/ rota o el cron se interrumpe.
    TEMP_ARCHIVO=$(mktemp "$ARCHIVO/.pendiente.XXXXXX")
    printf '%s\n' "$cuerpo" > "$TEMP_ARCHIVO"
    chmod 600 "$TEMP_ARCHIVO"
    mv -T -- "$TEMP_ARCHIVO" "$ARCHIVO/$h.md"
    TEMP_ARCHIVO=""
    YA["$h"]=1
    ARCHIVADOS=$((ARCHIVADOS + 1))
  fi
  mv -f "$f" "$HECHOS/"
done
chmod 600 "$MEM"
flock -u 9

N=$(grep -c '^§$' "$MEM" || true)
echo "$AGREGADOS agregado(s), $REPETIDOS repetido(s), $ARCHIVADOS archivado(s) — MEMORY.md tiene $N entradas, $(wc -c < "$MEM")/$MAX_BYTES bytes; archivo: $ARCHIVO"

# Retencion de lo procesado: 200 archivos alcanzan para auditar un mes.
while IFS= read -r viejo; do rm -f -- "$viejo"; done < <(ls -1t "$HECHOS"/*.md 2>/dev/null | tail -n +201)

# 🔴 El aviso de tope SOLO se manda cuando EMPEORA, y nunca dos veces seguidas.
#
# Antes se disparaba en CADA vuelta del consolidador mientras N superara el tope.
# Como nadie compacta al instante, eso son varios Telegram por hora repitiendo lo
# mismo. Medido el 2026-09-05 en el telefono de Sergio: el mismo aviso a las 06:42,
# 08:12, 09:04... con MEMORY.md en 215 entradas sobre un tope de 120. Pedido suyo,
# textual: "ordena telegram, me llenan de mensajes innecesarios".
#
# El estandar ya estaba escrito en el README de esta carpeta —"como mucho 1 cada
# 6 h por loop (el ruido apaga la senal)"— y este aviso era el que no lo cumplia.
#
# Regla nueva, en dos condiciones que se piden JUNTAS:
#   · que hayan pasado al menos 6 h desde el ultimo aviso, y
#   · que la memoria haya crecido >= PASO entradas desde ese aviso.
# Un desborde estable se calla. Uno que crece, avisa — y cada vez mas arriba.
if [ "$N" -gt "$TOPE_ENTRADAS" ]; then
  SELLO="${ONIA_MEM_AVISO:-/var/lib/onia/memoria-aviso}"
  PASO="${ONIA_MEM_AVISO_PASO:-25}"
  ESPERA="${ONIA_MEM_AVISO_HORAS:-6}"
  mkdir -p "$(dirname "$SELLO")" 2>/dev/null || true

  ULT_N=0; ULT_T=0
  if [ -f "$SELLO" ]; then read -r ULT_N ULT_T < "$SELLO" 2>/dev/null || true; fi
  : "${ULT_N:=0}"; : "${ULT_T:=0}"
  AHORA=$(date +%s)

  if [ "$N" -ge $(( ULT_N + PASO )) ] && [ $(( AHORA - ULT_T )) -ge $(( ESPERA * 3600 )) ]; then
    "${ONIA_TG:-/root/bin/onia-tg.sh}" "🧠 <b>Memoria</b>: MEMORY.md llegó a ${N} entradas. Revisar qué aprendizajes merecen contexto activo; el excedente queda completo en archivo-aprendizajes. Las reglas no se resumen automáticamente." >/dev/null 2>&1 || true
    printf '%s %s\n' "$N" "$AHORA" > "$SELLO" 2>/dev/null || true
  fi
fi
exit 0

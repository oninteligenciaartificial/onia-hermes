#!/usr/bin/env bash
# ONIA — lee y cambia el calendario PERSONAL de Sergio Urcullo (sergio.urcullo.m@gmail.com).
#
# POR QUÉ EXISTE (2026-09-29). Sergio Urcullo: "acomodar mi calendario… no lo quiero hacer
# manualmente". Ese día compartió su calendario con la cuenta de ONIA y eligió que sus bloques
# (colegio, 🔒, 🎬, «sin celular») decidan cuándo se lo puede interrumpir. Sin este lector, el
# resumen de las 06:30 decía "todavía no leo tu calendario" y la aduana no conocía ningún bloque.
# El 30-sep, "terminemos de hacer hermes": que Hermes también lo CAMBIE desde Telegram —
# agendar, mover, cancelar, y reubicar lo que quedó pendiente del cierre— siempre con su sí.
#
# DE DÓNDE: dos webhooks de n8n con ruta secreta que usan la credencial de Google de la cuenta
# ONIA (la de los recordatorios): «ONIA - Agenda hoy (Jarvis)» lee, «ONIA - Agenda cambios
# (Jarvis)» escribe. Las URL viven en /root/.config/onia/agenda.env (600), nunca en el repo; las
# crea hermes-content/deploy/hermes-jarvis/aplicar.sh.
#
# Uso (fechas AAAA-MM-DD y horas HH:MM, siempre de La Paz):
#   onia-agenda.sh [fecha]              lo que importa del día («08:00–12:30 🎒 Colegio»)
#   onia-agenda.sh --bloques [fecha]    escribe $ONIA_AVISO_ESTADO/bloques-hoy.tsv para la aduana
#   onia-agenda.sh --ids [fecha]        el día ENTERO con ids: id<TAB>HH:MM<TAB>HH:MM<TAB>título
#   onia-agenda.sh huecos <fecha> <min> huecos libres de al menos <min> minutos, 07:30–21:30
#   onia-agenda.sh crear <fecha> <HH:MM> <HH:MM> <título…> [--si]
#   onia-agenda.sh mover <id> <fecha> <HH:MM> <HH:MM> [--si]
#   onia-agenda.sh cancelar <id> [--si]
#
# 🔴 SIN `--si` NO CAMBIA NADA: muestra lo que haría (y con qué choca) y sale 3. El `--si` va
# SOLO después de que Sergio Urcullo dijo que sí a ESE cambio exacto. Es la regla de la skill
# agenda-calendario puesta donde un modelo no se la puede saltar: el primer intento de cualquier
# cambio es siempre una vista previa.
#
# «LO QUE IMPORTA», medido sobre su calendario del 29-sep: 11 eventos por día y 8 son rutina
# que se repite igual todos los días (levantarse, almuerzo, lectura, ejercicio, dormir). Entran
# las reuniones y todo lo que NO se repite, más Colegio y los bloques 🔒/🎬/ONIA. La rutina no:
# la sabe de memoria, y en el resumen (que muestra 8 líneas) empujaba afuera a la reunión.
# Los BLOQUES, en cambio, se leen todos, repetidos o no: «Lectura — sin celular» también es
# un rato en el que no quiere que le suene nada.
set -uo pipefail

HOY=$(date -u -d '-4 hours' +%F)   # Bolivia: UTC-4 todo el año, sin horario de verano
CONF="${ONIA_AGENDA_CONF:-/root/.config/onia/agenda.env}"
# shellcheck disable=SC1090
[ -r "$CONF" ] && . "$CONF"
LEER_URL="${ONIA_AGENDA_URL:-}"
CAMBIOS_URL="${ONIA_AGENDA_CAMBIOS_URL:-}"
ESTADO="${ONIA_AVISO_ESTADO:-/var/lib/onia-aviso}"

uso() { sed -n '/^# Uso/,/^# 🔴/p' "$0" | sed '$d; s/^# \{0,1\}//' >&2; exit 64; }
es_fecha() { [[ "$1" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] && date -d "$1" +%F >/dev/null 2>&1; }
es_hora() { [[ "$1" =~ ^([01][0-9]|2[0-3]):[0-5][0-9]$ ]]; }
es_id() { [[ "$1" =~ ^[A-Za-z0-9_-]{5,1024}$ ]]; }

TMP=$(mktemp -d) || exit 1
trap 'rm -rf "$TMP"' EXIT

# Sin -S: un error de curl imprime la URL, y la URL ES la llave.
leer() {  # leer <desde> <hasta>  ->  $TMP/cal.json
  if [ -z "$LEER_URL" ]; then echo "agenda: falta ONIA_AGENDA_URL en $CONF" >&2; exit 2; fi
  curl -s -f --max-time 25 -G "$LEER_URL" \
       --data-urlencode "desde=${1}T00:00:00-04:00" \
       --data-urlencode "hasta=${2}T23:59:59-04:00" > "$TMP/cal.json" \
    || { echo "agenda: el calendario no respondió" >&2; exit 1; }
}

procesar() {  # procesar <modo> [args…]  (lee $TMP/cal.json)
  python3 - "$TMP/cal.json" "$@" <<'PY'
import json, re, sys
from datetime import datetime, timedelta, timezone

origen, modo, args = sys.argv[1], sys.argv[2], sys.argv[3:]
LA_PAZ = timezone(timedelta(hours=-4))
BLOQUE = re.compile(r"colegio|🔒|🎬|sin celular|📵", re.I)
IMPORTA = re.compile(r"colegio|🔒|🎬|\bONIA\b", re.I)
DIAS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"]
MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

try:
    datos = json.loads(open(origen, encoding="utf-8").read() or "[]")
except ValueError:
    sys.exit(3)
if isinstance(datos, dict):              # un solo evento, o un envoltorio {"data": [...]}
    datos = datos.get("data") if isinstance(datos.get("data"), list) else [datos]

def hora(d):
    s = (d or {}).get("dateTime")
    if not s:
        return None
    return datetime.fromisoformat(s.replace("Z", "+00:00")).astimezone(LA_PAZ)

def dia_largo(f):
    d = datetime.strptime(f, "%Y-%m-%d")
    return "%s %02d-%s" % (DIAS[d.weekday()], d.day, MESES[d.month - 1])

eventos = []
for e in datos:
    if not isinstance(e, dict) or "start" not in e or e.get("status") == "cancelled":
        continue
    # Lo que él rechazó no es parte de su día.
    if any(a.get("self") and a.get("responseStatus") == "declined" for a in e.get("attendees") or []):
        continue
    titulo = " ".join((e.get("summary") or "(sin título)").split())
    # Las reservas de cal.com se titulan «X between <él> and <otro>»: basta con quién.
    titulo = re.sub(r"\s+between .+? and (.+)$", r" con \1", titulo)
    ini, fin = hora(e["start"]), hora(e.get("end"))
    ev = {"id": e.get("id", ""), "titulo": titulo, "recurrente": bool(e.get("recurringEventId"))}
    if ini is None:                      # todo el día
        ev.update(dia=(e["start"].get("date") or "")[:10],
                  hasta=((e.get("end") or {}).get("date") or "")[:10], ini=None, fin=None)
    else:
        fin = fin or ini
        ev.update(dia=ini.strftime("%Y-%m-%d"), ini=ini.strftime("%H:%M"),
                  fin=fin.strftime("%H:%M") if fin.strftime("%Y-%m-%d") == ini.strftime("%Y-%m-%d") else "23:59")
    eventos.append(ev)

def del_dia(f):
    out = []
    for ev in eventos:
        if ev["ini"] is None:
            if ev["dia"] == f or (ev["dia"] <= f < (ev["hasta"] or ev["dia"])):
                out.append(ev)
        elif ev["dia"] == f:             # empezó otro día: no es de este
            out.append(ev)
    return sorted(out, key=lambda ev: ev["ini"] or "00:00")

def minutos(hm):
    return int(hm[:2]) * 60 + int(hm[3:5])

def hm(m):
    return "%02d:%02d" % (m // 60, m % 60)

def linea(ev):
    return ("Todo el día · " if ev["ini"] is None else "%s–%s " % (ev["ini"], ev["fin"])) + ev["titulo"]

if modo == "dia":
    for ev in del_dia(args[0]):
        if not ev["recurrente"] or IMPORTA.search(ev["titulo"]):
            print(linea(ev))
elif modo == "bloques":
    for ev in del_dia(args[0]):
        if ev["ini"] is not None and BLOQUE.search(ev["titulo"]):
            print("%s\t%s\t%s\t%s" % (args[0], ev["ini"].replace(":", ""), ev["fin"].replace(":", ""),
                                      ev["titulo"].replace("\t", " ")))
elif modo == "ids":
    for ev in del_dia(args[0]):
        print("%s\t%s\t%s\t%s" % (ev["id"], ev["ini"] or "--", ev["fin"] or "--", ev["titulo"].replace("\t", " ")))
elif modo == "huecos":
    # Ocupa TODO evento con hora —la rutina también: nadie quiere una reunión en el almuerzo—.
    # La ventana es la de un día despierto y con el cierre de las 21:30 afuera.
    f, largo, desde = args[0], int(args[1]), minutos(args[2]) if len(args) > 2 and args[2] else 0
    abre, cierra = max(minutos("07:30"), desde), minutos("21:30")
    ocupado = sorted((minutos(ev["ini"]), minutos(ev["fin"])) for ev in del_dia(f) if ev["ini"] is not None)
    cursor = abre
    for a, b in ocupado + [(cierra, cierra)]:
        # Las dos puntas se recortan a la ventana: un evento de las 22:30 no estira el hueco
        # de la noche más allá del cierre.
        a, b = min(max(a, abre), cierra), min(max(b, abre), cierra)
        if a - cursor >= largo:
            print("%s–%s (%d min libres)" % (hm(cursor), hm(a), a - cursor))
        cursor = max(cursor, b)
elif modo == "buscar":
    for ev in eventos:
        if ev["id"] == args[0]:
            print("%s\t%s\t%s\t%s\t%s" % (ev["dia"], ev["ini"] or "--", ev["fin"] or "--", ev["titulo"], dia_largo(ev["dia"])))
            sys.exit(0)
    sys.exit(4)
elif modo == "choques":
    f, a, b = args[0], minutos(args[1]), minutos(args[2])
    for ev in del_dia(f):
        if ev["ini"] is not None and args[3:4] != [ev["id"]] and minutos(ev["ini"]) < b and a < minutos(ev["fin"]):
            print(linea(ev))
elif modo == "largo":
    print(dia_largo(args[0]))
PY
}

escribir() {  # escribir <op> [clave=valor…]  ->  $TMP/resp.json
  if [ -z "$CAMBIOS_URL" ]; then echo "agenda: falta ONIA_AGENDA_CAMBIOS_URL en $CONF" >&2; exit 2; fi
  python3 -c 'import json, sys
print(json.dumps(dict([("op", sys.argv[1])] + [a.split("=", 1) for a in sys.argv[2:]]), ensure_ascii=False))' \
    "$@" > "$TMP/pedido.json"
  curl -s -f --max-time 30 -X POST -H 'Content-Type: application/json' \
       --data-binary @"$TMP/pedido.json" "$CAMBIOS_URL" > "$TMP/resp.json" \
    || { echo "agenda: el calendario no aceptó el cambio" >&2; exit 1; }
}
respuesta_id() { python3 -c 'import json, sys
d = json.load(open(sys.argv[1]))
d = d[0] if isinstance(d, list) and d else d
print((d or {}).get("id", "") if isinstance(d, dict) else "")' "$TMP/resp.json" 2>/dev/null; }

# Si el cambio cae HOY, la aduana tiene que saberlo ya, no en la próxima media hora.
refrescar_bloques() { [ "$1" = "$HOY" ] && bash "$0" --bloques "$HOY" >/dev/null 2>&1; return 0; }

ARGS=(); SI=0
for a in "$@"; do if [ "$a" = "--si" ]; then SI=1; else ARGS+=("$a"); fi; done
set -- "${ARGS[@]+"${ARGS[@]}"}"

case "${1:-}" in
  --bloques)
    FECHA="${2:-$HOY}"; es_fecha "$FECHA" || uso
    leer "$FECHA" "$FECHA"
    SALIDA=$(procesar bloques "$FECHA") || { echo "agenda: respuesta ilegible del calendario" >&2; exit 1; }
    # Se reemplaza entero y de una (mv), nunca a medias. Si la lectura falló, `leer` ya salió
    # con 1 y el archivo anterior queda: un bloque de AYER no retiene nada hoy (la aduana
    # compara la fecha), así que fallar deja pasar los avisos en vez de callarlos.
    mkdir -p "$ESTADO" || exit 1
    { [ -n "$SALIDA" ] && printf '%s\n' "$SALIDA"; } > "$ESTADO/.bloques-hoy.$$"
    mv -f "$ESTADO/.bloques-hoy.$$" "$ESTADO/bloques-hoy.tsv"
    echo "$(date -u +%FT%TZ) bloques $FECHA: $(grep -c . "$ESTADO/bloques-hoy.tsv")"
    ;;

  --ids)
    FECHA="${2:-$HOY}"; es_fecha "$FECHA" || uso
    leer "$FECHA" "$FECHA"; procesar ids "$FECHA" || { echo "agenda: respuesta ilegible del calendario" >&2; exit 1; }
    ;;

  huecos)
    FECHA="${2:-}"; MIN="${3:-}"
    es_fecha "$FECHA" && [[ "$MIN" =~ ^[0-9]{1,3}$ ]] || uso
    DESDE=""; [ "$FECHA" = "$HOY" ] && DESDE=$(date -u -d '-4 hours' +%H:%M)
    leer "$FECHA" "$FECHA"; procesar huecos "$FECHA" "$MIN" "$DESDE" || { echo "agenda: respuesta ilegible del calendario" >&2; exit 1; }
    ;;

  crear)
    FECHA="${2:-}"; INI="${3:-}"; FIN="${4:-}"; shift 4 2>/dev/null || uso
    # El recorte va en caracteres, no en bytes: `cut -c` partía un emoji a la mitad.
    TITULO=$(python3 -c 'import sys; print(" ".join(" ".join(sys.argv[1:]).split())[:120])' "$@")
    es_fecha "$FECHA" && es_hora "$INI" && es_hora "$FIN" && [ -n "$TITULO" ] || uso
    [[ "$INI" < "$FIN" ]] || { echo "agenda: la hora de fin tiene que ser después de la de inicio" >&2; exit 64; }
    [[ "$FECHA $INI" > "$(date -u -d '-4 hours' '+%F %H:%M')" ]] || { echo "agenda: esa hora ya pasó" >&2; exit 64; }
    leer "$FECHA" "$FECHA"
    DIA=$(procesar largo "$FECHA"); CHOCA=$(procesar choques "$FECHA" "$INI" "$FIN")
    if [ "$SI" != 1 ]; then
      echo "SIN CAMBIOS — falta el sí de Sergio Urcullo. Esto haría:"
      echo "  crear «$TITULO» el $DIA $INI–$FIN"
      [ -n "$CHOCA" ] && printf '  ⚠️ choca con: %s\n' "$CHOCA"
      exit 3
    fi
    escribir crear "titulo=$TITULO" "inicio=${FECHA}T${INI}:00-04:00" "fin=${FECHA}T${FIN}:00-04:00"
    ID=$(respuesta_id); [ -n "$ID" ] || { echo "agenda: el calendario respondió sin crear el evento" >&2; exit 1; }
    echo "✅ creado: $DIA $INI–$FIN $TITULO (id $ID)"
    refrescar_bloques "$FECHA"
    ;;

  mover)
    ID="${2:-}"; FECHA="${3:-}"; INI="${4:-}"; FIN="${5:-}"
    es_id "$ID" && es_fecha "$FECHA" && es_hora "$INI" && es_hora "$FIN" || uso
    [[ "$INI" < "$FIN" ]] || { echo "agenda: la hora de fin tiene que ser después de la de inicio" >&2; exit 64; }
    [[ "$FECHA $INI" > "$(date -u -d '-4 hours' '+%F %H:%M')" ]] || { echo "agenda: esa hora ya pasó" >&2; exit 64; }
    # Se busca desde ayer hasta dentro de dos semanas: es donde vive lo que se reacomoda.
    leer "$(date -u -d '-28 hours' +%F)" "$(date -u -d '+14 days -4 hours' +%F)"
    ANTES=$(procesar buscar "$ID") || { echo "agenda: no encontré ese evento entre ayer y dentro de dos semanas" >&2; exit 4; }
    IFS=$'\t' read -r A_FECHA A_INI A_FIN A_TIT A_LARGO <<< "$ANTES"
    [ "$A_INI" != "--" ] || { echo "agenda: es un evento de todo el día; eso se cambia a mano" >&2; exit 64; }
    leer "$FECHA" "$FECHA"
    DIA=$(procesar largo "$FECHA"); CHOCA=$(procesar choques "$FECHA" "$INI" "$FIN" "$ID")
    if [ "$SI" != 1 ]; then
      echo "SIN CAMBIOS — falta el sí de Sergio Urcullo. Esto haría:"
      echo "  mover «$A_TIT» del $A_LARGO $A_INI–$A_FIN al $DIA $INI–$FIN"
      [ -n "$CHOCA" ] && printf '  ⚠️ choca con: %s\n' "$CHOCA"
      exit 3
    fi
    escribir mover "id=$ID" "inicio=${FECHA}T${INI}:00-04:00" "fin=${FECHA}T${FIN}:00-04:00"
    [ -n "$(respuesta_id)" ] || { echo "agenda: el calendario respondió sin mover el evento" >&2; exit 1; }
    echo "✅ movido: «$A_TIT» ahora el $DIA $INI–$FIN"
    refrescar_bloques "$A_FECHA"; refrescar_bloques "$FECHA"
    ;;

  cancelar)
    ID="${2:-}"; es_id "$ID" || uso
    leer "$(date -u -d '-28 hours' +%F)" "$(date -u -d '+14 days -4 hours' +%F)"
    ANTES=$(procesar buscar "$ID") || { echo "agenda: no encontré ese evento entre ayer y dentro de dos semanas" >&2; exit 4; }
    IFS=$'\t' read -r A_FECHA A_INI A_FIN A_TIT A_LARGO <<< "$ANTES"
    if [ "$SI" != 1 ]; then
      echo "SIN CAMBIOS — falta el sí de Sergio Urcullo. Esto haría:"
      echo "  cancelar «$A_TIT» del $A_LARGO $A_INI–$A_FIN"
      exit 3
    fi
    escribir cancelar "id=$ID"
    echo "✅ cancelado: «$A_TIT» del $A_LARGO $A_INI–$A_FIN"
    refrescar_bloques "$A_FECHA"
    ;;

  -*|*[!0-9-]*) uso ;;

  *)
    FECHA="${1:-$HOY}"; es_fecha "$FECHA" || uso
    leer "$FECHA" "$FECHA"
    procesar dia "$FECHA" || { echo "agenda: respuesta ilegible del calendario" >&2; exit 1; }
    ;;
esac

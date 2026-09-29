#!/usr/bin/env bash
# ONIA — lee el calendario PERSONAL de Sergio Urcullo (sergio.urcullo.m@gmail.com).
#
# POR QUÉ EXISTE (2026-09-29). Sergio Urcullo: "acomodar mi calendario… no lo quiero hacer
# manualmente". Ese día compartió su calendario con la cuenta de ONIA y eligió que sus bloques
# (colegio, 🔒, 🎬, «sin celular») decidan cuándo se lo puede interrumpir. Sin este lector, el
# resumen de las 06:30 decía "todavía no leo tu calendario" y la aduana no conocía ningún bloque.
#
# DE DÓNDE LEE: un webhook de n8n con ruta secreta («ONIA - Agenda hoy (Jarvis)») que usa la
# credencial de Google de la cuenta ONIA, la misma que ya usan los recordatorios. La URL vive en
# /root/.config/onia/agenda.env (600), nunca en el repo; la crea hermes-jarvis/aplicar.sh.
#
# Uso:
#   onia-agenda.sh [fecha]            lo que importa del día, un evento por línea
#                                     («08:00–12:30 🎒 Colegio»). Sale 1 si no pudo leer.
#   onia-agenda.sh --bloques [fecha]  escribe $ONIA_AVISO_ESTADO/bloques-hoy.tsv para la aduana
#                                     (onia-tg.sh): fecha<TAB>HHMM<TAB>HHMM<TAB>título.
#
# «LO QUE IMPORTA», medido sobre su calendario del 29-sep: 11 eventos por día y 8 son rutina
# que se repite igual todos los días (levantarse, almuerzo, lectura, ejercicio, dormir). Entran
# las reuniones y todo lo que NO se repite, más Colegio y los bloques 🔒/🎬/ONIA. La rutina no:
# la sabe de memoria, y en el resumen (que muestra 8 líneas) empujaba afuera a la reunión.
# Los BLOQUES, en cambio, se leen todos, repetidos o no: «Lectura — sin celular» también es
# un rato en el que no quiere que le suene nada.
set -uo pipefail

MODO=dia
if [ "${1:-}" = "--bloques" ]; then MODO=bloques; shift; fi
FECHA="${1:-$(date -u -d '-4 hours' +%F)}"   # Bolivia: UTC-4 todo el año, sin horario de verano
case "$FECHA" in
  [0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]) ;;
  *) echo "uso: $0 [--bloques] [AAAA-MM-DD]" >&2; exit 64 ;;
esac

CONF="${ONIA_AGENDA_CONF:-/root/.config/onia/agenda.env}"
# shellcheck disable=SC1090
[ -r "$CONF" ] && . "$CONF"
URL="${ONIA_AGENDA_URL:-}"
if [ -z "$URL" ]; then echo "agenda: falta ONIA_AGENDA_URL en $CONF" >&2; exit 2; fi

# Sin -S: un error de curl imprime la URL, y la URL ES la llave.
JSON=$(curl -s -f --max-time 25 -G "$URL" \
         --data-urlencode "desde=${FECHA}T00:00:00-04:00" \
         --data-urlencode "hasta=${FECHA}T23:59:59-04:00") \
  || { echo "agenda: el calendario no respondió" >&2; exit 1; }

SALIDA=$(printf '%s' "$JSON" | python3 -c '
import json, re, sys
from datetime import datetime, timedelta, timezone

modo, fecha = sys.argv[1], sys.argv[2]
LA_PAZ = timezone(timedelta(hours=-4))
BLOQUE = re.compile(r"colegio|🔒|🎬|sin celular|📵", re.I)
IMPORTA = re.compile(r"colegio|🔒|🎬|\bONIA\b", re.I)

try:
    datos = json.loads(sys.stdin.read() or "[]")
except ValueError:
    sys.exit(3)
if isinstance(datos, dict):              # un solo evento, o un envoltorio {"data": [...]}
    datos = datos.get("data") if isinstance(datos.get("data"), list) else [datos]

def hora(d):
    s = (d or {}).get("dateTime")
    if not s:
        return None
    return datetime.fromisoformat(s.replace("Z", "+00:00")).astimezone(LA_PAZ)

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
    if ini is None:                      # todo el día
        dia = (e["start"].get("date") or "")[:10]
        hasta = ((e.get("end") or {}).get("date") or dia)[:10]
        if not (dia <= fecha < hasta or dia == fecha):
            continue
        eventos.append((0, "Todo el día · " + titulo, None, None, titulo, bool(e.get("recurringEventId"))))
        continue
    if ini.strftime("%Y-%m-%d") != fecha:    # empezó otro día: no es de hoy
        continue
    fin = fin or ini
    hhmm_fin = fin.strftime("%H%M") if fin.strftime("%Y-%m-%d") == fecha else "2359"
    linea = "%s–%s %s" % (ini.strftime("%H:%M"), fin.strftime("%H:%M"), titulo)
    eventos.append((int(ini.strftime("%H%M")) + 1, linea, ini.strftime("%H%M"), hhmm_fin, titulo, bool(e.get("recurringEventId"))))

eventos.sort(key=lambda x: x[0])
for orden, linea, desde, hasta, titulo, recurrente in eventos:
    if modo == "bloques":
        if desde is not None and BLOQUE.search(titulo):
            print("%s\t%s\t%s\t%s" % (fecha, desde, hasta, titulo.replace("\t", " ")))
    elif not recurrente or IMPORTA.search(titulo):
        print(linea)
' "$MODO" "$FECHA") || { echo "agenda: respuesta ilegible del calendario" >&2; exit 1; }

if [ "$MODO" = dia ]; then
  [ -n "$SALIDA" ] && printf '%s\n' "$SALIDA"
  exit 0
fi

# --bloques: se reemplaza entero y de una (mv), nunca a medias. Si la lectura falló, arriba ya
# salió con 1 y el archivo anterior queda: un bloque de AYER no retiene nada hoy (la aduana
# compara la fecha), así que fallar deja pasar los avisos en vez de callarlos.
ESTADO="${ONIA_AVISO_ESTADO:-/var/lib/onia-aviso}"
mkdir -p "$ESTADO" || exit 1
TMP="$ESTADO/.bloques-hoy.$$"
{ [ -n "$SALIDA" ] && printf '%s\n' "$SALIDA"; } > "$TMP"
mv -f "$TMP" "$ESTADO/bloques-hoy.tsv"
echo "$(date -u +%FT%TZ) bloques $FECHA: $(grep -c . "$ESTADO/bloques-hoy.tsv")"

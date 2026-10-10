#!/usr/bin/env bash
# ONIA — Jarvis: el RESUMEN de la mañana (06:30) y el CIERRE del día (21:30).
#
# POR QUÉ EXISTE (2026-09-29). Sergio Urcullo: "necesitamos un cerebro que me diga
# absolutamente lo de todos los días… que me diga cómo estuvo mi día. Literalmente como un
# Jarvis". Ese día eligió los dos horarios y las cuatro interrupciones
# (hermes-content/docs/ONIA_CEREBRO.md, «La regla de entrega»).
#
# Reemplaza a CUATRO mensajes sueltos de la mañana —parte diario 05:00, agenda de Hermes
# 08:00, plan de video 08:10, voz 08:25— y le suma el cierre, que no existía.
#
# 🔴 TODO lo que dice sale de una fuente medida, nunca de un modelo:
#   prospectos esperando  -> tarea [leads-esperando] del tablero (vigia_sin_respuesta.mjs)
#   decisiones            -> onia-parte-diario.sh (su rotación y su filtro needs_input)
#   agenda                -> onia-agenda.sh, si existe; si no, lo dice
#   qué sale              -> hermes-content/docs/cola/plan-3-semanas/CALENDARIO-PUBLICACION-*.md
#   guiones               -> hermes-content/docs/cola/plan-3-semanas/S*-GUIONES.md (si el calendario no cubre el día)
#   lo que pasó de noche  -> la cola de la aduana (onia-tg.sh, $ESTADO/resumen.log)
#   lo que se hizo hoy    -> git log de origin/main
#   lo que salió hoy      -> /root/publicar/publicado.jsonl (los publicadores de vps-ops/publicar)
#   relojes que vencen    -> hermes-content/docs/cola/loop/madre.md §G (la tabla de la madre)
#   colas paradas         -> git log de hermes-content/docs/cola/loop/*.md en origin/main
# El único paso con IA es traducir los commits del día a castellano llano, con la orden de
# no agregar nada; si la IA no responde, se dice cuántos cambios hubo y listo. Nace de un
# error pagado: `gpt-5-nano` inventó una agenda entera (handoff/infra-cerebro-loops.md §5).
#
# Uso: jarvis-resumen.sh manana | noche
set -uo pipefail

MODO="${1:-manana}"
case "$MODO" in manana|noche) ;; *) echo "uso: $0 manana|noche" >&2; exit 64 ;; esac

# 🔴 UTF-8 explícito. El cron corre sin LANG (POSIX), y medido el 2026-09-29: con POSIX el
# parte diario falla 5 de sus propias pruebas —su orden «🔴 primero» se rompe— y en UTF-8
# pasa todas. Como este script lo llama, fija el idioma para los dos.
export LC_ALL=C.UTF-8

TG="${ONIA_TG:-/root/bin/onia-tg.sh}"
TABLERO="${ONIA_TABLERO:-/root/bin/onia-tablero.sh}"
PARTE="${ONIA_PARTE:-/root/bin/onia-parte-diario.sh}"
REPO="${ONIA_REPO:-/root/loops/onia-hermes}"
ESTADO="${ONIA_AVISO_ESTADO:-/var/lib/onia-aviso}"
AGENDA="${ONIA_AGENDA:-/root/bin/onia-agenda.sh}"
PEDIDOS="${ONIA_PEDIDOS:-/root/bin/onia-pedido-claude.sh}"
PUBLICADO="${ONIA_PUBLICADO:-/root/publicar/publicado.jsonl}"  # lo escriben ig-reel, ig-carrusel, yt-video…
OUT="${ONIA_JARVIS_OUT:-/root/.hermes/out}"
LLM="${ONIA_JARVIS_LLM:-}"          # comando que traduce commits (stdin -> viñetas); vacío = LiteLLM
MAX=5
TMP=$(mktemp -d /tmp/onia-jarvis-XXXXXX) || exit 1
trap 'rm -rf "$TMP"' EXIT

# ── Fechas en La Paz (UTC-4 todo el año, sin tzdata) ─────────────────────────
HOY="${ONIA_HOY:-$(date -u -d '-4 hours' +%F)}"
MANANA=$(date -u -d "$HOY +1 day" +%F)
DIAS=(lunes martes miércoles jueves viernes sábado domingo)
MESES=(enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre)
MES3=(ene feb mar abr may jun jul ago sep oct nov dic)
dia_largo() { printf '%s %s de %s' "${DIAS[$(( $(date -u -d "$1" +%u) - 1 ))]}" "$(date -u -d "$1" +%-d)" "${MESES[$(( $(date -u -d "$1" +%-m) - 1 ))]}"; }
esc() { sed 's/&/\&amp;/g; s/</\&lt;/g; s/>/\&gt;/g'; }

# ── Tablero: una sola lectura para todo ──────────────────────────────────────
TABLERO_OK=1
LISTA=$("$TABLERO" list 2>/dev/null </dev/null) || TABLERO_OK=0

# ── Prospectos esperando (la interrupción número uno de la etapa vigente) ────
seccion_prospectos() {
  [ "$TABLERO_OK" = 1 ] || { printf '🧲 <b>No pude leer el tablero</b>: no sé si hay prospectos esperando.\n'; return; }
  local fila id titulo n
  fila=$(printf '%s\n' "$LISTA" | grep -F '[leads-esperando]' | grep -vE '^✓' | head -1)
  [ -n "$fila" ] || return 0
  id=$(printf '%s' "$fila" | grep -oE 't_[0-9a-f]{8}' | head -1)
  n=$(printf '%s' "$fila" | grep -oE '\] [0-9]+ ' | grep -oE '[0-9]+' | head -1)
  titulo="${n:-Hay} persona(s) esperan que les contestes"
  printf '🧲 <b>%s</b>\n' "$titulo"
  if [ -n "$id" ]; then
    "$TABLERO" show "$id" 2>/dev/null </dev/null | LC_ALL=C.UTF-8 grep -aE '^[[:space:]]*conv [0-9]+' \
      | sed 's/^[[:space:]]*//' | head -3 | cut -c1-140 | sed 's/^/• /'
  fi
  printf '→ contestales desde Chatwoot; el bot no les vuelve a escribir.\n'
}

# ── Decisiones y salud: se le pide al parte diario, que ya sabe rotar y filtrar ──
PARTE_MSG=""
# Una VISTA PREVIA no puede gastar turnos: el parte rota las decisiones con un estado en disco
# (ONIA_PARTE_RONDA), y previsualizar el resumen le haría saltear una decisión al de verdad.
if [ "${ONIA_JARVIS_SOLO_IMPRIMIR:-0}" = 1 ]; then
  RONDA_REAL="${ONIA_PARTE_RONDA:-/var/lib/onia-parte-diario/ronda}"
  mkdir -p "$TMP/ronda"; [ -d "$RONDA_REAL" ] && cp -a "$RONDA_REAL/." "$TMP/ronda/" 2>/dev/null
  export ONIA_PARTE_RONDA="$TMP/ronda"
fi
if [ -x "$PARTE" ] || [ -f "$PARTE" ]; then
  printf '#!/usr/bin/env bash\nprintf "%%s" "$1"\n' > "$TMP/captura.sh"; chmod +x "$TMP/captura.sh"
  PARTE_MSG=$(ONIA_TG="$TMP/captura.sh" ONIA_TABLERO="$TABLERO" bash "$PARTE" 2>/dev/null </dev/null) || true
fi
# El bloque 🙋 del parte, SIN la tarea de prospectos (ya va arriba, con nombre y espera).
# Se calcula UNA vez, afuera de las secciones: el cierre usa la misma cuenta.
printf '%s\n' "$PARTE_MSG" | awk '
    /^🙋/ {on=1}
    on && (/^⚠️/ || /^<i>Parte diario/ || /^✅/) {exit}
    on {print}' \
  | awk '/leads-esperando|desconocido\(s\) esperando/ {skip=1; next} skip && /→ <code>ok/ {skip=0; next} {skip=0; print}' \
  > "$TMP/hoja"
# El titular del parte cuenta TAMBIEN la tarea de prospectos: se recuenta sobre lo que quedo,
# o el numero de arriba no coincide con la lista de abajo.
N_DECISIONES=$(grep -c '→ <code>ok' "$TMP/hoja" || true)
seccion_decisiones() {
  [ "${N_DECISIONES:-0}" -gt 0 ] || return 0
  local tit="$N_DECISIONES esperan tu ok"
  [ "$N_DECISIONES" = 1 ] && tit="1 espera tu ok"
  sed -E "s/^🙋 <b>[0-9]+ esperan tu ok<\/b>/🙋 <b>$tit<\/b>/" "$TMP/hoja" | sed -e :a -e '/^\n*$/{$d;N;ba' -e '}'
}
linea_salud() {
  local rotas
  if [ -z "$PARTE_MSG" ]; then
    printf '🩺 Sistema: no pude verificarlo (el parte diario no respondió).\n'; return
  fi
  if printf '%s' "$PARTE_MSG" | grep -q 'No pude verificar'; then
    printf '🩺 Sistema: no pude verificarlo (el tablero no respondió).\n'; return
  fi
  rotas=$(printf '%s' "$PARTE_MSG" | grep -oE '⚠️ <b>[0-9]+ cosa' | grep -oE '[0-9]+' | head -1)
  if [ -n "$rotas" ] && [ "$rotas" -gt 0 ]; then
    # UNA línea, y dentro de ella lo más grave (el parte ya ordena 🔴 primero y lo más
    # nuevo arriba). Nace del 21-sep: la caída de la PC de casa fue la tarea #16 de 16 y el
    # parte la resumió como «… y 11 más». Una cuenta sin el peor caso esconde lo que importa.
    local peor
    peor=$(printf '%s\n' "$PARTE_MSG" | awk '/^⚠️ <b>[0-9]+ cosa/ {on=1; next} on && /^• / {print; exit}' | sed 's/^• //' | cut -c1-90)
    printf '🩺 Sistema: %s arreglo(s) pendientes que el sistema no resolvió solo%s. No te toca a vos: van al tablero.\n' \
      "$rotas" "${peor:+ (el más grave: $peor)}"
  else
    printf '🩺 Sistema: ✅ sano.\n'
  fi
}

# ── Agenda (si el lector de calendario existe) ───────────────────────────────
seccion_agenda() {  # seccion_agenda <fecha> <titulo>
  local ev
  if [ -x "$AGENDA" ]; then
    if ev=$("$AGENDA" "$1" 2>/dev/null </dev/null); then
      if [ -n "$ev" ]; then
        printf '📅 <b>%s</b>\n' "$2"; printf '%s\n' "$ev" | head -8 | esc | sed 's/^/• /'
      else
        printf '📅 %s: nada en el calendario.\n' "$2"
      fi
      return
    fi
    printf '📅 No pude leer tu calendario ahora.\n'; return
  fi
  printf '📅 Todavía no leo tu calendario personal: falta compartirlo con la cuenta de ONIA.\n'
}

# ── Guiones del plan de 3 semanas ────────────────────────────────────────────
guiones_del() {  # guiones_del <fecha>  -> "A · título (formato)" por línea
  # Acepta los DOS formatos de fecha que conviven en el plan (medido el 29-sep):
  #   S1 y S3:  «## Mié 30-sep» / «## Miércoles 14-oct»   ->  <d>-<mes3>
  #   S2:       «## Miércoles 7 de octubre»               ->  <d> de <mes>
  # El resumen con un solo formato devolvía la semana 2 entera vacía, sin avisar.
  local d m3 ml
  d=$(date -u -d "$1" +%-d); m3=${MES3[$(( $(date -u -d "$1" +%-m) - 1 ))]}; ml=${MESES[$(( $(date -u -d "$1" +%-m) - 1 ))]}
  for f in "$REPO"/hermes-content/docs/cola/plan-3-semanas/S*-GUIONES.md; do
    [ -f "$f" ] || continue
    awk -v corta="${d}-${m3}" -v larga="${d} de ${ml}" '
      function es_la_fecha(t,   i) {
        i = index(t, corta);  if (i && (i == 1 || substr(t, i - 1, 1) !~ /[0-9]/) && substr(t, i + length(corta), 1) !~ /[a-z]/) return 1
        i = index(t, larga);  if (i && (i == 1 || substr(t, i - 1, 1) !~ /[0-9]/)) return 1
        return 0
      }
      /^## / { on = es_la_fecha(tolower($0)); next }
      on && /^### / {
        sub(/^### /, "")
        n = split($0, p, / · /)
        slot = p[1]; sub(/^D[0-9]+-/, "", slot)
        titulo = p[3]; sub(/ *✅ *$/, "", titulo)
        if (n >= 3) printf "%s · %s (%s)\n", slot, titulo, p[2]; else print
      }' "$f"
  done
}
seccion_guiones() {  # seccion_guiones <fecha> <titulo>
  local g
  g=$(guiones_del "$1")
  [ -n "$g" ] || return 0
  printf '🎬 <b>%s</b>\n' "$2"
  printf '%s\n' "$g" | esc | sed 's/^/• /'
}

# ── Qué sale: el calendario de publicación (9-oct) ───────────────────────────
# GOAL del 8-oct: sale contenido todos los días. Desde el 8-oct lo que se publica cada día está en
# CALENDARIO-PUBLICACION-<d1>-<d2>-<MES>.md (pedido de Sergio Urcullo), y se graba todo junto
# (GRABAR-*.md): el «para grabar hoy» de los S*-GUIONES (plan del 29-sep) ya no es lo de ese día.
# Medido el 9-oct: la mañana del 10 iba a nombrar tres guiones viejos, y ese día salen otros.
# Desde que existe un calendario, los S*-GUIONES ya no vuelven: son de un plan que no corre, y sin año
# volverían a casar el año que viene (revisiones del 9-oct).
# Salida: «HH:MM<TAB>qué<TAB>pieza» por línea, en orden de hora, y sale 0. Si no:
#   2 no hay ningún calendario (vale el plan viejo) · 3 ninguno cubre el día · 4 la fila del día no
#   tiene nada («—») · 5 lo cubre pero no tiene la fila · otro: no se pudo leer.
calendario_del() {  # calendario_del <fecha>
  local fs=("$REPO"/hermes-content/docs/cola/plan-3-semanas/CALENDARIO-PUBLICACION-*.md)
  [ -f "${fs[0]}" ] || return 2
  python3 - "$1" "${fs[@]}" <<'PY'
import datetime, os, re, sys, unicodedata
fecha = datetime.date.fromisoformat(sys.argv[1])
MESES = "ENE FEB MAR ABR MAY JUN JUL AGO SEP OCT NOV DIC".split()
def rango(d1, d2, mes):
    # El año no está en el nombre: el que hace que el rango cubra la fecha (un rango dura días, así
    # que a lo sumo uno). 28-3-ENE el 30 de diciembre es del 28-dic al 3-ene.
    for y in (fecha.year - 1, fecha.year, fecha.year + 1):
        try:
            fin = datetime.date(y, mes, d2)
            ini = datetime.date(y, mes, d1) if d1 <= d2 else (fin.replace(day=1) - datetime.timedelta(days=1)).replace(day=d1)
        except ValueError:
            continue
        if ini <= fecha <= fin:
            return ini
    return None
cubren = []
for f in sys.argv[2:]:
    m = re.search(r"CALENDARIO-PUBLICACION-(\d{1,2})-(\d{1,2})-([A-Z]{3})\.md$", os.path.basename(f))
    if m and m.group(3) in MESES:
        ini = rango(int(m.group(1)), int(m.group(2)), MESES.index(m.group(3)) + 1)
        if ini:
            cubren.append((ini, f))
if not cubren:
    sys.exit(3)
f = max(cubren)[1]  # dos que se solapan: el que empieza después, el más nuevo
cabeza = None
for linea in open(f, encoding="utf-8", errors="replace"):
    linea = unicodedata.normalize("NFC", linea)
    if not linea.lstrip().startswith("|"):
        cabeza = None
        continue
    c = [x.strip() for x in linea.strip().strip("|").split("|")]
    if c[0].lower() in ("día", "dia"):
        cabeza = c
        continue
    if not cabeza or len(c) != len(cabeza):
        continue
    # Por el número de día: dentro del rango es único («Sab 10», «Sáb 10», «Sáb 10-oct»).
    n = re.search(r"\d{1,2}", c[0])
    if not n or int(n.group(0)) != fecha.day:
        continue
    filas = []
    for h, v in zip(cabeza[1:], c[1:]):
        v = v.replace("*", "").strip()
        if v in ("", "—", "-"):
            continue
        t = re.search(r"\d{1,2}:\d{2}", h)
        que = h[: t.start()].strip(" ·") if t else h
        filas.append((t.group(0).zfill(5) if t else "", que, v))
    for hora, que, v in sorted(filas):
        print("%s\t%s\t%s" % (hora, que, v))
    sys.exit(0 if filas else 4)
sys.exit(5)
PY
}
seccion_sale() {  # seccion_sale <fecha> <titulo>  (sale 2 si no hay calendarios: vale el plan viejo)
  local c rc cuando
  c=$(calendario_del "$1" 2>/dev/null); rc=$?
  cuando=$([ "$1" = "$HOY" ] && echo hoy || echo mañana)
  case "$rc" in
    0) printf '📣 <b>%s</b>\n' "$2"
       printf '%s\n' "$c" | awk -F'\t' '{ printf "• %s%s · %s\n", ($1 == "" ? "" : $1 " "), $2, $3 }' | esc ;;
    2) return 2 ;;
    3) printf '📣 Todavía no hay calendario de publicación para %s.\n' "$cuando" ;;
    4) printf '📣 %s no sale nada según el calendario.\n' "$([ "$cuando" = hoy ] && echo Hoy || echo Mañana)" ;;
    5) printf '📣 El calendario de publicación no tiene la fila de %s.\n' "$cuando" ;;
    *) printf '📣 No pude leer el calendario de publicación.\n' ;;
  esac
  return 0
}
# Lo que salió DE VERDAD hoy (9-oct; GOAL del 8-oct: al menos una pieza por día). Cada publicador del
# VPS anota en publicado.jsonl: Instagram (ig-reel, ig-carrusel con link; ig-historia sin link) y YouTube
# (yt-video, con link; si es privado es un ensayo y no cuenta); Buffer (buffer-post) solo que lo mandó,
# para la hora que lleva. No ve lo que Sergio Urcullo sube a mano: por eso dice «en el registro».
seccion_salio() {
  local s n
  [ -r "$PUBLICADO" ] || { printf '📣 No pude leer el registro de publicaciones: no sé qué salió hoy.\n'; return 0; }
  s=$(python3 - "$HOY" "$PUBLICADO" "${ONIA_AHORA:-$(date -u +%FT%TZ)}" <<'PY'
import datetime, json, sys
hoy = datetime.date.fromisoformat(sys.argv[1])
LA_PAZ = datetime.timezone(datetime.timedelta(hours=-4))
def hora(t):
    try:
        d = datetime.datetime.fromisoformat(str(t).replace("Z", "+00:00").replace("+0000", "+00:00"))
    except ValueError:
        return None
    return d.astimezone(LA_PAZ) if d.tzinfo else None
ahora = hora(sys.argv[3])
filas, buffer = [], 0
for linea in open(sys.argv[2], encoding="utf-8", errors="replace"):
    try:
        r = json.loads(linea)
        if not isinstance(r, dict):
            continue
        if r.get("red") == "buffer":
            d = hora(r.get("fecha") if r.get("cuando") in (None, "ya") else r.get("cuando"))
            if d and d.date() == hoy and (ahora is None or d <= ahora) and r.get("estado") != "borrador":
                buffer += 1
            continue
        if r.get("red") == "youtube":
            if r.get("privacidad") != "public":
                continue
            d, que, link = hora(r.get("fecha")), "YouTube", r.get("url")
        else:
            d, link = hora(r.get("timestamp")), r.get("permalink")
            tipo = r.get("tipo")
            que = "Carrusel" if tipo == "carrusel" else "Historia" if tipo == "historia" else "Trial" if r.get("trial") else "Reel"
        if not d or d.date() != hoy:
            continue
        cuenta = r.get("cuenta")
        filas.append((d.strftime("%H:%M"), que + ("" if cuenta in (None, "sergio") else " (%s)" % cuenta), link))
    except Exception:
        continue  # una línea rara no tapa las demás
for h, que, link in sorted(filas, key=lambda f: f[:2]):
    print("• %s %s%s" % (h, que, " — %s" % link if link else ""))
if buffer:
    print("• %d envío%s a Buffer para hoy (sin link: no confirma que %s)." % (buffer, "" if buffer == 1 else "s", "salió" if buffer == 1 else "salieron"))
print("FIN %d" % len(filas))
PY
) || { printf '📣 No pude leer el registro de publicaciones: no sé qué salió hoy.\n'; return 0; }
  case "$s" in *"FIN "*) ;; *) printf '📣 No pude leer el registro de publicaciones: no sé qué salió hoy.\n'; return 0 ;; esac
  n=${s##*FIN }; s=$(printf '%s\n' "$s" | grep -v '^FIN ')
  if [ "$n" -gt 0 ]; then
    printf '📣 <b>Hoy salió</b>\n'
  else
    n=$(calendario_del "$HOY" 2>/dev/null | grep -c . || true)
    printf '📣 <b>En el registro no hay nada publicado hoy</b> en Instagram ni YouTube%s.\n' "$([ "${n:-0}" -gt 0 ] && printf ' (el calendario tenía %s pieza(s))' "$n")"
  fi
  [ -z "$s" ] || printf '%s\n' "$s" | esc
  return 0
}
# Los guiones del plan viejo, solo si no existe ningún calendario.
seccion_plan() {  # seccion_plan <fecha> <titulo de lo que sale> <titulo de los guiones>
  seccion_sale "$1" "$2" || seccion_guiones "$1" "$3"
  return 0
}

# ── Lo que nadie empuja: relojes y colas paradas (10-oct, HERMES_ROL_QA.md Q4) ────
# Había cinco fechas en 25 días (el SIN el 13, el token de Lucía, la pauta del 16, la 1.0 el 30, el
# SIAT el 4-nov) y ninguna alarma saltaba. La madre las lleva en la tabla §G de su cola; acá se leen
# del origin/main del clon, que el sincronizador trae cada hora (si no hay origin/main, del árbol).
# Las de Sergio Urcullo van en NECESITO; las de otros dueños, junto a la línea de salud.
MADRE_MD=hermes-content/docs/cola/loop/madre.md
leer_main() {  # leer_main <ruta en el repo>
  git -C "$REPO" show "origin/main:$1" 2>/dev/null || cat "$REPO/$1" 2>/dev/null
}
# Salida: «su|otro<TAB>días<TAB>fecha<TAB>qué<TAB>dueño», de lo vencido a lo que vence en 3 días.
# Sale 2 si no hay tabla que leer y 3 si el archivo no tiene la §G con Fecha, Qué y Dueño.
relojes_de() {  # relojes_de <hoy>  (stdin: madre.md)
  python3 -c '
import datetime, re, sys, unicodedata
hoy = datetime.date.fromisoformat(sys.argv[1])
texto = unicodedata.normalize("NFC", sys.stdin.read())
if not texto.strip():
    sys.exit(2)
MES = "ene feb mar abr may jun jul ago sep oct nov dic".split()
en_g = vista = False
cabeza, filas = None, []
for l in texto.splitlines():
    if l.startswith("## "):
        en_g = bool(re.match(r"##\s+G\b", l))
        vista = vista or en_g
        continue
    if not en_g or not l.lstrip().startswith("|"):
        continue
    c = [x.strip() for x in l.strip().strip("|").split("|")]
    if cabeza is None:
        cabeza = [x.lower() for x in c]
    elif not all(re.fullmatch(r":?-+:?", x) for x in c if x):
        filas.append(c)
def col(prefijo):
    return next((i for i, h in enumerate(cabeza or []) if h.startswith(prefijo)), None)
iF, iQ, iD = col("fecha"), col("qu"), col("due")
if not vista or None in (iF, iQ, iD):
    sys.exit(3)
def limpio(s):
    s = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", s)
    return re.sub(r"\s+", " ", s.replace("*", "").replace("`", "")).strip()
def fecha_de(t):
    # La fecha sin año: la más cercana a hoy. Un rango («13 al 18-oct») cuenta desde el primer día.
    m = re.search(r"(?<!\d)(\d{1,2})(?:\s+al\s+\d{1,2})?-(%s)[a-z]*\b" % "|".join(MES), t.lower())
    if not m:
        return None
    mejor = None
    for y in (hoy.year - 1, hoy.year, hoy.year + 1):
        try:
            f = datetime.date(y, MES.index(m.group(2)) + 1, int(m.group(1)))
        except ValueError:
            continue
        if mejor is None or abs((f - hoy).days) < abs((mejor - hoy).days):
            mejor = f
    return mejor
salida = []
for c in filas:
    if len(c) <= max(iF, iQ, iD):
        continue
    f = fecha_de(c[iF])
    if f is None or (f - hoy).days > 3:
        continue
    que, dueno = limpio(c[iQ]), limpio(c[iD])
    if len(que) > 110:
        que = que[:109].rstrip() + "…"
    su = bool(re.search(r"\bSU\b|Sergio", dueno))
    salida.append(((f - hoy).days, "su" if su else "otro", limpio(c[iF]), que, "" if su else dueno))
for dias, grupo, fecha, que, dueno in sorted(salida):
    print("\t".join((grupo, str(dias), fecha, que, dueno)))
' "$1"
}
RELOJES_RC=0
RELOJES=$(leer_main "$MADRE_MD" | relojes_de "$HOY" 2>/dev/null) || RELOJES_RC=$?
lista_relojes() {  # stdin: filas de relojes_de -> viñetas (6 como mucho)
  awk -F'\t' -v max=6 '
    NR <= max {
      d = $2 + 0
      if (d < 0) c = sprintf("🔴 %s, vencido hace %d día%s", $3, -d, (d == -1 ? "" : "s"))
      else if (d == 0) c = $3 ", hoy"
      else if (d == 1) c = $3 ", mañana"
      else c = sprintf("%s, en %d días", $3, d)
      printf "• %s: %s%s\n", c, $4, ($5 == "" ? "" : " — " $5)
    }
    END { if (NR > max) printf "• … y %d más (cola/loop/madre.md §G)\n", NR - max }' | esc
}
seccion_relojes() {  # los de Sergio Urcullo: le piden algo, van en NECESITO
  local l
  if [ "$RELOJES_RC" != 0 ]; then
    printf '⏰ No pude leer los relojes de la madre (cola/loop/madre.md §G): no sé qué vence.\n'; return 0
  fi
  l=$(printf '%s\n' "$RELOJES" | awk -F'\t' '$1 == "su"')
  [ -n "$l" ] || return 0
  printf '⏰ <b>Vence pronto</b>\n'
  printf '%s\n' "$l" | lista_relojes
}
linea_relojes_otros() {  # los de otros dueños: él los ve, no le piden nada
  local l
  [ "$RELOJES_RC" = 0 ] || return 0
  l=$(printf '%s\n' "$RELOJES" | awk -F'\t' '$1 == "otro"')
  [ -n "$l" ] || return 0
  printf '⏰ <b>Vence en 72 h (otros dueños)</b>\n'
  printf '%s\n' "$l" | lista_relojes
}
# Una cola sin commit en más de 24 h es una sesión parada o sin trabajo: con esto la madre de las
# 07:53 sabe a quién redespachar. «sin tareas» = no le queda ninguna «- [ ]» en main.
linea_colas() {
  local ahora f t h edad lista=""
  if ! git -C "$REPO" rev-parse -q --verify origin/main >/dev/null 2>&1; then
    printf '🧊 No pude ver qué colas se pararon (el clon no tiene origin/main).\n'; return 0
  fi
  ahora=$(date -u -d "${ONIA_AHORA:-now}" +%s 2>/dev/null) || ahora=$(date -u +%s)
  while IFS= read -r f; do
    case "${f##*/}" in README.md) continue ;; *.md) ;; *) continue ;; esac
    t=$(git -C "$REPO" log -1 --format=%ct origin/main -- "$f" 2>/dev/null)
    [ -n "$t" ] && [ $(( ahora - t )) -gt 86400 ] || continue
    h=$(( (ahora - t) / 3600 ))
    if [ "$h" -lt 48 ]; then edad="$h h"; else edad="$(( h / 24 )) d"; fi
    git -C "$REPO" show "origin/main:$f" 2>/dev/null | grep -q '^[[:space:]]*- \[ \]' || edad+=", sin tareas"
    lista+="${lista:+, }$(basename "$f" .md) ($edad)"
  done < <(git -C "$REPO" ls-tree --name-only origin/main hermes-content/docs/cola/loop/ 2>/dev/null)
  [ -n "$lista" ] || return 0
  printf '🧊 Colas sin movimiento hace más de 24 h: %s.\n' "$lista"
}

# ── La cola de la aduana: lo que no interrumpió ──────────────────────────────
DESDE_COLA=$(cat "$ESTADO/leido-hasta" 2>/dev/null || echo "1970-01-01T00:00:00Z")
cola_nueva() {  # cola_nueva <tipo>  (noche | resumen)
  [ -f "$ESTADO/resumen.log" ] || return 0
  awk -F'\t' -v desde="$DESDE_COLA" -v tipo="$1" '$1 > desde && $3 == tipo' "$ESTADO/resumen.log"
}
seccion_cola() {  # seccion_cola <tipo> <titulo>
  local filas n
  filas=$(cola_nueva "$1")
  [ -n "$filas" ] || return 0
  n=$(printf '%s\n' "$filas" | grep -c .)
  printf '%s <b>%s</b>\n' "$([ "$1" = noche ] && echo 🌙 || echo 📬)" "$2"
  printf '%s\n' "$filas" | awk -F'\t' '{ printf "%s|%s\n", $1, $5 }' \
    | while IFS='|' read -r iso t; do
        e=$(date -u -d "$iso" +%s 2>/dev/null) && hl=$(date -u -d "@$((e - 14400))" +%H:%M) || hl="?"
        printf '• %s (%s)\n' "$(printf '%s' "$t" | esc)" "$hl"
      done | head -"$MAX"
  [ "$n" -gt "$MAX" ] && printf '… y %s más.\n' $((n - MAX))
  return 0
}

# ── Lo que se hizo hoy, en castellano llano ──────────────────────────────────
traducir() {  # stdin: asuntos de commits -> viñetas
  if [ -n "$LLM" ]; then bash -c "$LLM"; return; fi
  local mk
  mk=$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY 2>/dev/null) || return 1
  [ -n "$mk" ] || return 1
  LITELLM_KEY="$mk" MODELO="${ONIA_JARVIS_MODELO:-gpt-5-mini}" python3 -c '
import sys, os, json, urllib.request
asuntos = sys.stdin.read().strip()
pedido = {
  "model": os.environ["MODELO"],
  "messages": [
    {"role": "system", "content": "Sos el jefe de gabinete de Sergio Urcullo, fundador de ONIA (Bolivia). Te paso los asuntos de los commits de HOY en el repo (en inglés, técnicos). Escribí como máximo 3 viñetas en castellano rioplatense, llano, sin siglas, sin nombres de archivo ni de ramas, diciendo QUÉ cambió para él o para sus clientes. Solo lo que esté en la lista: no agregues nada, no inventes cifras. Si todo es interno, decilo en una sola viñeta. Cada viñeta empieza con \"• \"."},
    {"role": "user", "content": asuntos[:6000]},
  ],
  "max_completion_tokens": 400,
}
req = urllib.request.Request("http://127.0.0.1:4000/v1/chat/completions", data=json.dumps(pedido).encode(),
      headers={"Authorization": "Bearer " + os.environ["LITELLM_KEY"], "Content-Type": "application/json"})
r = json.load(urllib.request.urlopen(req, timeout=90))
print(r["choices"][0]["message"]["content"].strip())
'
}
seccion_hoy() {
  local asuntos n vinetas
  asuntos=$(git -C "$REPO" log origin/main --no-merges --since="$HOY 00:00:00 -0400" --until="$HOY 23:59:59 -0400" \
    --format=%s 2>/dev/null | grep -vE '^chore: auto-sync' || true)
  n=$(printf '%s' "$asuntos" | grep -c . || true)
  printf '✅ <b>Hoy</b>\n'
  if [ "${n:-0}" -eq 0 ]; then
    printf '• Ningún cambio nuevo en el sistema hoy.\n'
  elif vinetas=$(printf '%s\n' "$asuntos" | traducir 2>/dev/null) && [ -n "$vinetas" ]; then
    printf '%s\n' "$vinetas" | head -4 | esc
    printf '<i>(%s cambio(s) integrados)</i>\n' "$n"
  else
    printf '• %s cambio(s) integrados al sistema (no pude resumirlos: la IA no respondió).\n' "$n"
  fi
}
# Los bloques de ONIA de hoy, numerados, para que él diga cuáles quedaron pendientes.
# Sergio Urcullo, 2026-09-29: "quiero cumplir todo eso, pero hay días que si no trabajo nada
# en ONIA o queda algún pendiente se le encuentra un espacio en la agenda".
# El número que él contesta («2 no») tiene que llevar a UN evento: número → id queda en
# cierre-bloques.tsv (fecha, n, id, inicio, fin, título), que lee la skill agenda-calendario de
# Hermes para proponerle otro hueco. Se escribe solo si el cierre se entregó: un número que él
# nunca vio no puede mover nada.
seccion_bloques_hoy() {
  local ev
  [ -x "$AGENDA" ] || return 0
  # Sin leerlos no se calla: NECESITO diría «Nada.» con bloques sin confirmar (revisión del 9-oct).
  ev=$("$AGENDA" --ids "$HOY" 2>/dev/null </dev/null) \
    || { printf '📋 No pude leer tus bloques de hoy en el calendario: no sé si quedó alguno pendiente.\n'; return 0; }
  ev=$(printf '%s\n' "$ev" | awk -F'\t' '$2 != "--" && $4 ~ /ONIA|🔒|🎬/' | head -6)
  [ -n "$ev" ] || return 0
  printf '%s\n' "$ev" | awk -F'\t' -v f="$HOY" 'BEGIN { OFS = "\t" } { print f, NR, $1, $2, $3, $4 }' > "$TMP/cierre-bloques.tsv"
  printf '📋 <b>Tus bloques de hoy</b> — ¿se hicieron?\n'
  printf '%s\n' "$ev" | awk -F'\t' '{ printf "%d. %s–%s %s\n", NR, $2, $3, $4 }' | esc
  printf '→ Contestame qué quedó pendiente (por ejemplo «2 no») y le busco otro hueco.\n'
}
# Lo que él le pidió a Claude desde Telegram (pedido-claude.sh), con su estado. La respuesta de cada
# uno ya le llegó por la aduana; acá queda el circuito cerrado aunque alguna se haya perdido: un
# pedido «sin respuesta» a las 21:30 es algo que no tiene que creer terminado.
# Los que esperan su ok van aparte, en NECESITO (revisión del 9-oct: en PASÓ, el cierre decía «Nada.»
# con un pedido esperándolo). Se leen una vez, afuera de las secciones.
PEDIDOS_HOY=""
[ -x "$PEDIDOS" ] && PEDIDOS_HOY=$("$PEDIDOS" --lista "$HOY" 2>/dev/null </dev/null)
seccion_pedidos_ok() {
  local filas
  filas=$(printf '%s\n' "$PEDIDOS_HOY" | awk -F'\t' '$4 == "necesita-ok"')
  [ -n "$filas" ] || return 0
  printf '🙋 <b>Pedidos a Claude que esperan tu ok</b>\n'
  printf '%s\n' "$filas" | awk -F'\t' '{ printf "• %s %s — %s\n", $1, $3, $5 }' | head -"$MAX" | esc
  return 0
}
seccion_pedidos() {
  local filas n
  filas=$(printf '%s\n' "$PEDIDOS_HOY" | awk -F'\t' 'NF && $4 != "necesita-ok"')
  [ -n "$filas" ] || return 0
  n=$(printf '%s\n' "$filas" | grep -c .)
  printf '🤖 <b>Tus pedidos a Claude hoy</b>\n'
  printf '%s\n' "$filas" | awk -F'\t' '{
      e = $4
      if (e == "listo") m = "✅ listo"
      else if (e == "no-se-pudo") m = "⚠️ no se pudo"; else m = "⏳ sin respuesta todavía"
      printf "• %s %s — %s\n", $1, $3, m }' | head -"$MAX" | esc
  [ "$n" -gt "$MAX" ] && printf '… y %s más.\n' $((n - MAX))
  return 0
}
seccion_sigue() {
  local p d
  [ "$TABLERO_OK" = 1 ] || { printf '⏳ <b>No pude leer el tablero</b>: no sé quién te espera.\n'; return; }
  p=$(printf '%s\n' "$LISTA" | grep -F '[leads-esperando]' | grep -vE '^✓' | grep -oE '\] [0-9]+ ' | grep -oE '[0-9]+' | head -1)
  d=""; [ "${N_DECISIONES:-0}" -gt 0 ] && d=$N_DECISIONES
  [ -n "$p$d" ] || return 0
  printf '⏳ <b>Te esperan</b>\n'
  [ -n "$p" ] && printf '• %s persona(s) sin respuesta.\n' "$p"
  [ -n "$d" ] && printf '• %s decisión(es) tuya(s).\n' "$d"
  return 0
}

# ── Armado: tres bloques fijos, PASÓ · NECESITO · SIGUE ─────────────────────────
# Sergio Urcullo, 2026-10-08: «me entregás demasiado texto y me pierdo». Lo que le pide algo va
# junto, en NECESITO, y no repartido entre la agenda y los guiones. Las secciones no cambian: se
# agrupan. Un bloque vacío no se muestra, salvo NECESITO, que dice «Nada.» (él tiene que saber
# que no le falta nada)… y solo si se pudo medir: con el tablero caído, «Nada.» sería mentira.
# `$(...)` se come los saltos del final: por eso cada sección se AGREGA con su separador,
# en vez de concatenar sustituciones (que pegaban una sección al final de la otra).
CUERPO="" GRUPO=""
parte() { local b; b=$("$@"); [ -n "$b" ] && GRUPO+="$b"$'\n\n'; return 0; }
grupo() {  # grupo <TÍTULO> [<texto si quedó vacío>]: cierra lo juntado con parte()
  local g=${GRUPO%$'\n\n'}
  [ -n "$g" ] || g=${2:-}
  [ -n "$g" ] && CUERPO+="<b>$1</b>"$'\n'"$g"$'\n\n'
  GRUPO=""; return 0
}
# Lo que no se pudo medir se dice SIEMPRE, haya o no otras cosas en NECESITO (revisión del 9-oct: solo
# salía con NECESITO vacío). Con el tablero caído ya lo dicen los prospectos y «Te esperan»; acá va el
# caso del parte, que es de donde salen las decisiones.
falta_medir() {
  [ "$TABLERO_OK" = 1 ] || return 0
  if [ -z "$PARTE_MSG" ] || printf '%s' "$PARTE_MSG" | grep -q 'No pude verificar'; then
    printf '🙋 No pude ver las decisiones que esperan tu ok (el parte diario no respondió).\n'
  fi
  return 0
}
if [ "$MODO" = manana ]; then
  CABEZA="☀️ <b>Buen día, Sergio Urcullo</b> — $(dia_largo "$HOY")"
  parte seccion_cola noche 'Mientras dormías'; parte linea_salud; parte linea_relojes_otros; parte linea_colas; grupo PASÓ
  parte seccion_prospectos; parte seccion_relojes; parte seccion_decisiones; parte falta_medir; grupo NECESITO 'Nada.'
  parte seccion_agenda "$HOY" 'Tu día'; parte seccion_plan "$HOY" 'Hoy sale' 'Para grabar hoy'; grupo SIGUE
else
  CABEZA="🌙 <b>Cierre del $(dia_largo "$HOY")</b>"
  parte seccion_hoy; parte seccion_salio; parte seccion_pedidos; parte seccion_cola resumen 'Avisos del día'; parte linea_salud; grupo PASÓ
  parte seccion_bloques_hoy; parte seccion_pedidos_ok; parte seccion_sigue; parte falta_medir; grupo NECESITO 'Nada.'
  parte seccion_agenda "$MANANA" 'Mañana'; parte seccion_plan "$MANANA" 'Mañana sale' 'Mañana grabás'; grupo SIGUE
fi
MSG="$CABEZA

${CUERPO%$'\n\n'}"
# Telegram corta en 4.096 caracteres; se deja margen y se avisa del corte. Se corta en el último salto
# de línea: cada etiqueta abre y cierra en su línea, y una partida hace que Telegram rechace el
# mensaje entero (revisión del 9-oct). Lo que se pierde primero es lo último: SIGUE.
if [ "${#MSG}" -gt 3900 ]; then MSG="${MSG:0:3850}"; MSG="${MSG%$'\n'*}
… (recortado)"; fi

if [ "${ONIA_JARVIS_SOLO_IMPRIMIR:-0}" = 1 ]; then printf '%s\n' "$MSG"; exit 0; fi

# Versión de texto para la voz de la mañana (onia-jarvis-voz.sh la narra si es de hoy).
# Para el oído: sin HTML, sin emojis, sin los "→ ok t_…" ni teléfonos, que leídos en voz
# alta son ruido.
if [ "$MODO" = manana ]; then
  mkdir -p "$OUT" 2>/dev/null && printf '%s\n' "$MSG" | python3 -c '
import sys, re, html
t = html.unescape(re.sub(r"<[^>]+>", "", sys.stdin.read()))
t = "\n".join(l for l in t.splitlines() if "→" not in l)
t = re.sub(r"(?m)^(PASÓ|NECESITO|SIGUE)$", lambda m: m.group(1).capitalize() + ".", t)
t = re.sub(r"\(\+?\d[\d …-]*\)", "", t)
t = re.sub("[\U0001F300-\U0001FAFF\u2600-\u27BF\uFE0F•]", "", t)
t = re.sub(r"[ \t]+", " ", t)
print(re.sub(r"(?m)^ +", "", t).strip())' > "$OUT/brief-hoy.txt"
fi

if ONIA_AVISO=interrumpe ONIA_AVISO_AHORA=1 ONIA_AVISO_CLAVE="jarvis-$MODO-$HOY" ONIA_AVISO_EMISOR=jarvis \
     "$TG" "$MSG" >/dev/null; then
  # Recién entregado se da la cola por leída; si Telegram falló, mañana se vuelve a ver.
  mkdir -p "$ESTADO" 2>/dev/null && date -u +%FT%TZ > "$ESTADO/leido-hasta"
  [ "$MODO" = manana ] && rm -f "$ESTADO"/nocturnos/* 2>/dev/null
  [ "$MODO" = noche ] && [ -f "$TMP/cierre-bloques.tsv" ] && mv -f "$TMP/cierre-bloques.tsv" "$ESTADO/cierre-bloques.tsv"
  exit 0
fi
echo "jarvis-resumen: no se pudo entregar el $MODO" >&2
exit 1

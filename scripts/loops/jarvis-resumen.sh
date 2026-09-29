#!/usr/bin/env bash
# ONIA — Jarvis: el RESUMEN de la mañana (06:30) y el CIERRE del día (22:00).
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
#   guiones               -> hermes-content/docs/cola/plan-3-semanas/S*-GUIONES.md
#   lo que pasó de noche  -> la cola de la aduana (onia-tg.sh, $ESTADO/resumen.log)
#   lo que se hizo hoy    -> git log de origin/main
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
  if [ -z "$PARTE_MSG" ] || printf '%s' "$PARTE_MSG" | grep -q 'No pude verificar'; then
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
seccion_sigue() {
  local p d
  p=$(printf '%s\n' "$LISTA" | grep -F '[leads-esperando]' | grep -vE '^✓' | grep -oE '\] [0-9]+ ' | grep -oE '[0-9]+' | head -1)
  d=""; [ "${N_DECISIONES:-0}" -gt 0 ] && d=$N_DECISIONES
  [ -n "$p$d" ] || return 0
  printf '⏳ <b>Sigue esperando</b>\n'
  [ -n "$p" ] && printf '• %s persona(s) sin respuesta.\n' "$p"
  [ -n "$d" ] && printf '• %s decisión(es) tuya(s).\n' "$d"
  return 0
}

# ── Armado ───────────────────────────────────────────────────────────────────
# `$(...)` se come los saltos del final: por eso cada bloque se AGREGA con su separador,
# en vez de concatenar sustituciones (que pegaban una seccion al final de la otra).
CUERPO=""
bloque() { local b; b=$("$@"); [ -n "$b" ] && CUERPO+="$b"$'\n\n'; return 0; }
if [ "$MODO" = manana ]; then
  CABEZA="☀️ <b>Buen día, Sergio Urcullo</b> — $(dia_largo "$HOY")"
  bloque seccion_prospectos; bloque seccion_agenda "$HOY" 'Tu día'; bloque seccion_guiones "$HOY" 'Para grabar hoy'
  bloque seccion_decisiones; bloque seccion_cola noche 'Mientras dormías'
else
  CABEZA="🌙 <b>Cierre del $(dia_largo "$HOY")</b>"
  bloque seccion_hoy; bloque seccion_cola resumen 'Avisos del día'; bloque seccion_sigue
  bloque seccion_agenda "$MANANA" 'Mañana'; bloque seccion_guiones "$MANANA" 'Mañana grabás'
fi
CUERPO+="$(linea_salud)"
MSG="$CABEZA

$CUERPO"
# Telegram corta en 4.096 caracteres; se deja margen y se avisa del corte.
if [ "${#MSG}" -gt 3900 ]; then MSG="${MSG:0:3850}
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
  exit 0
fi
echo "jarvis-resumen: no se pudo entregar el $MODO" >&2
exit 1

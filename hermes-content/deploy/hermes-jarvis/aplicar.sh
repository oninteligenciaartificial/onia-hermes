# hermes-jarvis / aplicar — enciende a Jarvis en el VPS, con respaldo y marcha atrás.
# (comun.sh va delante: set +e, HOME, HPY, redactar, sec. REDACTAR_SED y COMMIT llegan del
# workflow. Todo se lee por `ssh … bash -s`: por eso cada comando que podría leer la entrada
# estándar va con </dev/null — si no, se comería el resto de este mismo script.)
#
# POR QUÉ (2026-09-29). Sergio Urcullo: «que me envíe poquitas cosas… me manda puros
# errores». El diagnóstico de ese día (run 36632797507) midió de dónde sale cada mensaje y él
# eligió qué le llega (hermes-content/docs/ONIA_CEREBRO.md, «La regla de entrega»):
#
#   ENTRA   06:30 resumen · 21:30 cierre · voz 06:35 (narra el resumen) · sus bloques del
#           calendario cada 30 min · la aduana suelta lo retenido al terminar un bloque ·
#           (30-sep) Hermes agenda, mueve y cancela en SU calendario, siempre con su sí
#   SALE    parte diario 05:00 (va DENTRO del resumen) · agenda de Hermes 08:00 · plan de video
#           08:10 · veredicto 16:00 · 12 flujos de n8n que sólo le mandaban reportes
#   CAMBIA  el vigía de loops deja de escribirle: un loop caído es tarea del tablero
#
# Respaldo en /root/backups/hermes-jarvis-<fecha>/, con rollback.sh; `revertir` lo corre.
# Idempotente: correrlo dos veces deja lo mismo que correrlo una.

BIN=/root/bin
ESTADO=/var/lib/onia-aviso
BK=/root/backups/hermes-jarvis-$(date -u +%Y%m%dT%H%M%SZ)
N8N_HOST=https://n8n-sergio-n8n.hqdqgh.easypanel.host
CAL_PERSONAL=sergio.urcullo.m@gmail.com
CRED_GCAL=a3FResZHqQ32ptyt           # «Google Calendar account» de la cuenta ONIA: la de los recordatorios

# Los tres trabajos de Hermes que le escribían por su cuenta (medidos el 29-sep).
HERMES_PAUSAR="9089322cc256 4ac955b47726 94f352c07554"   # agenda 08:00 · plan de video 08:10 · veredicto 16:00
# Flujos de n8n cuyo ÚNICO producto era un mensaje a su Telegram: radares, «agentes» que le
# mandan borradores, chequeos de salud que ya cubren los vigías del VPS. Quedan prendidos los
# que hacen trabajo real (respaldo, seguimiento del bot, leads, webhooks, recordatorios).
N8N_APAGAR="QGXVyRSgrArxfolj OovRU4r0o7pvglJP GFeCZKr1zQT6CVN8 aHFLqEtzqvq6SE3e C96NmbalLhaTEf0G nZkaXaZVKzgtwUqU oKSTNdvS58ixBgnl nkPMoUYQ9DMIL9gM TBECCNhi334cOLTG Su4vVZCB9rtJ3gAy GjNeraAVnY7HduCG VaX3lx0zibnNbg57"

FALLAS=0
falla() { FALLAS=$((FALLAS + 1)); echo "  ❌ $*"; }

sec "hermes-jarvis · aplicar · commit ${COMMIT:0:9} · $(date -u +%FT%TZ)"

# ── 0. El código tiene que estar en /root/bin ANTES de tocar nada ────────────────
sec "0. ¿Llegó el código de main a /root/bin?"
al_dia() {
  [ -x "$BIN/onia-jarvis-resumen.sh" ] && [ -x "$BIN/onia-agenda.sh" ] \
    && grep -q ONIA_AVISO_PUEDO "$BIN/onia-tg.sh" 2>/dev/null \
    && grep -q ONIA_AVISO_PUEDO "$BIN/onia-vigia-aprobaciones.sh" 2>/dev/null \
    && grep -q '^avisar()' "$BIN/claude-guardia.sh" 2>/dev/null \
    && grep -q ONIA_AGENDA_CAMBIOS_URL "$BIN/onia-agenda.sh" 2>/dev/null \
    && grep -q cierre-bloques "$BIN/onia-jarvis-resumen.sh" 2>/dev/null
}
if ! al_dia; then
  echo "todavía no: corro una vez el sincronizador de cada hora"
  timeout 600 "$BIN/onia-loops-sync.sh" </dev/null 2>&1 | tail -4 | redactar
fi
if ! al_dia; then
  echo "❌ El código de main todavía no está en /root/bin. No toqué nada."
  ls -la "$BIN/onia-jarvis-resumen.sh" "$BIN/onia-agenda.sh" "$BIN/onia-tg.sh" 2>&1 | redactar
  exit 1
fi
echo "✅ resumen, lector de calendario, aduana, vigía de aprobaciones y guardia: al día"

# ── 1. Respaldo ─────────────────────────────────────────────────────────────────
sec "1. Respaldo"
mkdir -p "$BK" && chmod 700 "$BK" || { echo "❌ no pude crear $BK. No toqué nada."; exit 1; }
crontab -l > "$BK/crontab.antes" 2>/dev/null || : > "$BK/crontab.antes"
cp -a /root/.hermes/cron/jobs.json "$BK/jobs.json.antes" 2>/dev/null
# Un aplicar anterior sin revertir: lo que ESE pausó también se devuelve al revertir.
PREVIO=""
for d in $(ls -dt /root/backups/hermes-jarvis-*/ 2>/dev/null); do
  d=${d%/}; [ "$d" = "$BK" ] && continue
  if [ -f "$d/aplicado" ] && [ ! -f "$d/revertido" ] && [ ! -f "$d/reemplazado" ]; then PREVIO=$d; break; fi
done
if [ -n "$PREVIO" ]; then
  echo "hay un aplicar anterior sin revertir ($PREVIO): heredo sus listas"
  for f in interruptor.antes hermes-pausados.txt n8n-apagados.txt n8n-agenda-id n8n-cambios-id \
           skill-destino skill-antes.md skill-no-existia SOUL.md.antes; do
    [ -f "$PREVIO/$f" ] && cp "$PREVIO/$f" "$BK/$f"
  done
fi
[ -f "$BK/interruptor.antes" ] || { [ -f "$ESTADO/activo" ] && echo si || echo no; } > "$BK/interruptor.antes"
touch "$BK/hermes-pausados.txt" "$BK/n8n-apagados.txt"
printf '%s\n' "${COMMIT:-?}" > "$BK/commit"
echo "✅ $BK (crontab, trabajos de Hermes)"

# Las marcas del crontab, en un solo lugar para aplicar y para deshacer:
#   '#jarvis# <línea>'  línea original apagada (deshacer le saca el prefijo)
#   '<línea> #jarvis'   línea agregada (deshacer la borra; sh toma « #…» como comentario)
cat > "$BK/marcas.py" <<'PY'
import re, sys
MARCA, PREF = " #jarvis", "#jarvis# "
modo, origen = sys.argv[1], sys.argv[2]
lineas = open(origen, encoding="utf-8").read().split("\n")
if lineas and lineas[-1] == "":
    lineas.pop()
base = []
for l in lineas:                      # primero se deshace lo anterior: re-aplicar converge
    if l.endswith(MARCA):
        continue
    if l.startswith(PREF):
        l = l[len(PREF):]
    base.append(l)
if modo == "deshacer":
    print("\n".join(base))
    raise SystemExit
def activa(l):
    s = l.strip()
    return bool(s) and not s.startswith("#")
out = []
for l in base:
    if activa(l) and "/root/bin/onia-parte-diario.sh" in l:
        out.append(PREF + l)          # su contenido va dentro del resumen de las 06:30
    elif activa(l) and "/root/bin/onia-jarvis-voz.sh" in l:
        out.append(PREF + l)          # la voz narra el resumen: justo después (06:35)
        out.append(re.sub(r"^\s*(\S+\s+){5}", "35 10 * * * ", l, count=1) + MARCA)
    elif activa(l) and "/root/bin/onia-vigia-loops-remotos.sh" in l and "ONIA_AVISO=" not in l:
        out.append(PREF + l)          # un loop caído es tarea del tablero, no un Telegram
        c = l.split(None, 5)
        out.append(" ".join(c[:5]) + " ONIA_AVISO=sistema " + c[5] + MARCA)
    else:
        out.append(l)
for l in (
    "# hermes-jarvis: resumen 06:30, cierre 21:30, bloques de su calendario, aduana (hermes-content/deploy/hermes-jarvis)",
    "30 10 * * * /root/bin/onia-jarvis-resumen.sh manana >> /var/log/onia-jarvis-resumen.log 2>&1",
    "30 1 * * * /root/bin/onia-jarvis-resumen.sh noche >> /var/log/onia-jarvis-resumen.log 2>&1",
    "*/5 * * * * ONIA_AVISO_SOLTAR=1 /root/bin/onia-tg.sh >> /var/log/onia-tg-soltar.log 2>&1",
    "25,55 0-1,10-23 * * * /root/bin/onia-agenda.sh --bloques >> /var/log/onia-agenda.log 2>&1",
):
    out.append(l + MARCA)
print("\n".join(out))
PY

# ── 2. Crontab ──────────────────────────────────────────────────────────────────
sec "2. Crontab (hora del VPS = UTC; La Paz = UTC-4)"
if python3 "$BK/marcas.py" aplicar "$BK/crontab.antes" > "$BK/crontab.nuevo" </dev/null; then
  A=$(grep -cvE '^[[:space:]]*(#|$)' "$BK/crontab.antes"); B=$(grep -cvE '^[[:space:]]*(#|$)' "$BK/crontab.nuevo")
  # Nunca un crontab más flaco que el de antes: esto agrega cuatro y apaga uno.
  if [ -s "$BK/crontab.nuevo" ] && [ "$B" -ge "$A" ] && crontab "$BK/crontab.nuevo" </dev/null; then
    echo "✅ instalado: $A → $B líneas activas"
    diff "$BK/crontab.antes" "$BK/crontab.nuevo" | grep -E '^[<>]' | redactar
  else
    falla "crontab NO instalado (antes $A, calculado $B): quedó el de antes"
  fi
else
  falla "no pude calcular el crontab nuevo: quedó el de antes"
fi

# ── 3. Hermes ───────────────────────────────────────────────────────────────────
sec "3. Trabajos de Hermes que le escribían por su cuenta"
estado_job() {  # imprime «activo» o «pausado» (o «?» si no está)
  python3 - "$1" <<'PY'
import json, sys
try:
    d = json.load(open("/root/.hermes/cron/jobs.json"))
except Exception:
    print("?"); raise SystemExit
jobs = d.get("jobs", d) if isinstance(d, dict) else d
if isinstance(jobs, dict):
    jobs = [dict(v, id=v.get("id", k)) for k, v in jobs.items() if isinstance(v, dict)]
for j in jobs:
    if isinstance(j, dict) and j.get("id") == sys.argv[1]:
        print("activo" if j.get("enabled") and j.get("state") != "paused" else "pausado")
        raise SystemExit
print("?")
PY
}
for id in $HERMES_PAUSAR; do
  antes=$(estado_job "$id")
  if [ "$antes" = activo ]; then
    timeout 60 "$HPY" -m hermes_cli.main cron pause "$id" </dev/null >/dev/null 2>&1
    despues=$(estado_job "$id")
    if [ "$despues" = pausado ]; then
      grep -qx "$id" "$BK/hermes-pausados.txt" || echo "$id" >> "$BK/hermes-pausados.txt"
      echo "  ⏸ pausado $id"
    else
      falla "no pude pausar $id (quedó: $despues)"
    fi
  else
    echo "  · $id ya estaba: $antes"
  fi
done

# ── 4. n8n ──────────────────────────────────────────────────────────────────────
sec "4. n8n: flujos que sólo le mandaban reportes"
KEY=$(grep -oP '(?<=^N8N_MANAGEMENT_API_KEY=).*' /opt/onia-platform/app.env 2>/dev/null | tr -d "\"'" | head -1)
api() { curl -s --max-time 30 -H "X-N8N-API-KEY: $KEY" -H 'Accept: application/json' "$@" </dev/null; }
campo() { python3 -c 'import json,sys
try: d = json.load(sys.stdin)
except Exception: d = {}
print(d.get(sys.argv[1], "") if isinstance(d, dict) else "")' "$1"; }
N8N_OK=0
if [ -n "$KEY" ] && [ "$(api -o /dev/null -w '%{http_code}' "$N8N_HOST/api/v1/workflows?limit=1")" = 200 ]; then
  N8N_OK=1
else
  falla "la API de n8n no responde con la llave de gestión: no toqué n8n"
fi
if [ "$N8N_OK" = 1 ]; then
  mkdir -p "$BK/n8n"
  for id in $N8N_APAGAR; do
    api "$N8N_HOST/api/v1/workflows/$id" > "$BK/n8n/$id.json"
    nombre=$(campo name < "$BK/n8n/$id.json"); activo=$(campo active < "$BK/n8n/$id.json")
    if [ "$activo" = True ]; then
      if [ "$(api -X POST "$N8N_HOST/api/v1/workflows/$id/deactivate" | campo active)" = False ]; then
        grep -qx "$id" "$BK/n8n-apagados.txt" || echo "$id" >> "$BK/n8n-apagados.txt"
        echo "  ⏹ apagado  $nombre"
      else
        falla "no pude apagar $id ($nombre)"
      fi
    elif [ "$activo" = False ]; then
      echo "  · ya estaba apagado: $nombre"
    else
      falla "no encontré el flujo $id"
    fi
  done
fi

# ── 5. Su calendario ────────────────────────────────────────────────────────────
sec "5. Lector de su calendario personal"
CONF=/root/.config/onia/agenda.env
HOY=$(date -u -d '-4 hours' +%F)
conf_poner() {  # conf_poner CLAVE valor — reemplaza o agrega UNA línea de $CONF (600), sin tocar las otras
  mkdir -p "$(dirname "$CONF")"
  ( umask 077; touch "$CONF"; { grep -v "^$1=" "$CONF"; printf '%s=%s\n' "$1" "$2"; } > "$CONF.$$" && mv -f "$CONF.$$" "$CONF" )
}
AGENDA_OK=0
if [ -f "$CONF" ] && "$BIN/onia-agenda.sh" "$HOY" </dev/null >/dev/null 2>&1; then
  AGENDA_OK=1; echo "✅ ya estaba conectado"
elif [ "$N8N_OK" = 1 ]; then
  WF=$(grep -oP '(?<=^ONIA_AGENDA_WF=).*' "$CONF" 2>/dev/null)
  [ -z "$WF" ] && [ -f "$BK/n8n-agenda-id" ] && WF=$(cat "$BK/n8n-agenda-id")
  if [ -n "$WF" ] && [ "$(api -X POST "$N8N_HOST/api/v1/workflows/$WF/activate" | campo active)" = True ]; then
    echo "reactivé el lector que ya existía"
  else
    # La ruta del webhook ES la llave: nace acá, vive en $CONF (600) y nunca se imprime.
    SECRETO=$(python3 -c 'import secrets; print(secrets.token_hex(20))')
    python3 - "$SECRETO" "$CAL_PERSONAL" "$CRED_GCAL" > "$BK/n8n-agenda-nuevo.json" <<'PY'
import json, sys, uuid
secreto, calendario, cred = sys.argv[1:4]
w, g, r = "Pedido del resumen", "Eventos del día", "Responder"
print(json.dumps({
    "name": "ONIA - Agenda hoy (Jarvis)",
    "nodes": [
        {"id": str(uuid.uuid4()), "name": w, "type": "n8n-nodes-base.webhook", "typeVersion": 2,
         "position": [0, 0], "webhookId": str(uuid.uuid4()),
         "parameters": {"httpMethod": "GET", "path": secreto, "responseMode": "responseNode", "options": {}}},
        # Copia del nodo que ya anda en «ONIA - Agenda: Recordatorios», con SU calendario.
        {"id": str(uuid.uuid4()), "name": g, "type": "n8n-nodes-base.googleCalendar", "typeVersion": 1.3,
         "position": [240, 0], "alwaysOutputData": True,
         "parameters": {"resource": "event", "operation": "getAll",
                        "calendar": {"__rl": True, "mode": "id", "value": calendario},
                        "returnAll": True,
                        "timeMin": "={{ $json.query.desde }}", "timeMax": "={{ $json.query.hasta }}",
                        "options": {"singleEvents": True, "orderBy": "startTime"}},
         "credentials": {"googleCalendarOAuth2Api": {"id": cred, "name": "Google Calendar account"}}},
        {"id": str(uuid.uuid4()), "name": r, "type": "n8n-nodes-base.respondToWebhook", "typeVersion": 1.1,
         "position": [480, 0], "parameters": {"respondWith": "allIncomingItems", "options": {}}},
    ],
    "connections": {w: {"main": [[{"node": g, "type": "main", "index": 0}]]},
                    g: {"main": [[{"node": r, "type": "main", "index": 0}]]}},
    # Cada lectura trae su calendario entero: no se guarda en el historial de n8n.
    "settings": {"executionOrder": "v1", "saveDataSuccessExecution": "none"},
}))
PY
    RESP=$(api -X POST -H 'Content-Type: application/json' --data-binary @"$BK/n8n-agenda-nuevo.json" "$N8N_HOST/api/v1/workflows")
    rm -f "$BK/n8n-agenda-nuevo.json"   # lleva la ruta secreta
    WF=$(printf '%s' "$RESP" | campo id)
    if [ -n "$WF" ]; then
      # La ruta se guarda APENAS existe el flujo: si la activación falla, la próxima corrida
      # lo reactiva en vez de crear otro sin saber su llave.
      conf_poner ONIA_AGENDA_URL "$N8N_HOST/webhook/$SECRETO"; conf_poner ONIA_AGENDA_WF "$WF"
      if [ "$(api -X POST "$N8N_HOST/api/v1/workflows/$WF/activate" | campo active)" = True ]; then
        echo "creé el flujo «ONIA - Agenda hoy (Jarvis)» ($WF); la ruta quedó en $CONF"
      else
        falla "creé el flujo del lector ($WF) pero n8n no lo activó"
      fi
    else
      # Sólo el campo «message»: la respuesta entera traería la ruta secreta.
      falla "n8n no aceptó el flujo del lector: $(printf '%s' "$RESP" | campo message | head -c 300)"
    fi
  fi
  [ -n "$WF" ] && echo "$WF" > "$BK/n8n-agenda-id"
  sleep 2
  if "$BIN/onia-agenda.sh" "$HOY" </dev/null >/dev/null 2>&1; then AGENDA_OK=1; else falla "el lector no pudo leer su calendario"; fi
fi
if [ "$AGENDA_OK" = 1 ]; then
  echo "--- su día de hoy, como lo va a ver el resumen:"
  "$BIN/onia-agenda.sh" "$HOY" </dev/null 2>&1 | redactar
  "$BIN/onia-agenda.sh" --bloques "$HOY" </dev/null 2>&1 | redactar
  echo "--- bloques en los que no le va a sonar nada:"
  cut -f2- "$ESTADO/bloques-hoy.tsv" 2>/dev/null | redactar
fi

# ── 5b. Cambiar su calendario ───────────────────────────────────────────────────
sec "5b. Cambios en su calendario (agendar, mover, cancelar)"
CAMBIOS_OK=0
if [ "$AGENDA_OK" != 1 ] || [ "$N8N_OK" != 1 ]; then
  echo "· no lo armo: sin lector de calendario o sin la API de n8n no hay cómo verificarlo"
else
  WFC=$(grep -oP '(?<=^ONIA_AGENDA_CAMBIOS_WF=).*' "$CONF" 2>/dev/null)
  [ -z "$WFC" ] && [ -f "$BK/n8n-cambios-id" ] && WFC=$(cat "$BK/n8n-cambios-id")
  if [ -n "$WFC" ] && grep -q '^ONIA_AGENDA_CAMBIOS_URL=' "$CONF" \
     && [ "$(api -X POST "$N8N_HOST/api/v1/workflows/$WFC/activate" | campo active)" = True ]; then
    echo "el flujo de cambios ya existía: activo"
  else
    SECRETO=$(python3 -c 'import secrets; print(secrets.token_hex(20))')
    python3 - "$SECRETO" "$CAL_PERSONAL" "$CRED_GCAL" > "$BK/n8n-cambios-nuevo.json" <<'PY'
import json, sys, uuid
secreto, calendario, cred = sys.argv[1:4]
w, h, r = "Pedido de cambio", "Cambiar en su calendario", "Responder"
eventos = "https://www.googleapis.com/calendar/v3/calendars/" + calendario.replace("@", "%40") + "/events"
cuerpo = ("={{ JSON.stringify($json.body.op === 'crear'"
          " ? { summary: $json.body.titulo,"
          "     start: { dateTime: $json.body.inicio, timeZone: 'America/La_Paz' },"
          "     end: { dateTime: $json.body.fin, timeZone: 'America/La_Paz' } }"
          " : $json.body.op === 'mover'"
          " ? { start: { dateTime: $json.body.inicio, timeZone: 'America/La_Paz' },"
          "     end: { dateTime: $json.body.fin, timeZone: 'America/La_Paz' } }"
          " : { status: 'cancelled' }) }}")
print(json.dumps({
    "name": "ONIA - Agenda cambios (Jarvis)",
    "nodes": [
        {"id": str(uuid.uuid4()), "name": w, "type": "n8n-nodes-base.webhook", "typeVersion": 2,
         "position": [0, 0], "webhookId": str(uuid.uuid4()),
         "parameters": {"httpMethod": "POST", "path": secreto, "responseMode": "responseNode", "options": {}}},
        # La API de Google directo, con la MISMA credencial que el lector. Crear = POST; mover y
        # cancelar = PATCH (cancelar es status «cancelled», que en un evento que se repite
        # cancela solo ESA repetición y deja la serie).
        {"id": str(uuid.uuid4()), "name": h, "type": "n8n-nodes-base.httpRequest", "typeVersion": 4.2,
         "position": [240, 0],
         "parameters": {
             "method": "={{ $json.body.op === 'crear' ? 'POST' : 'PATCH' }}",
             "url": "=" + eventos + "{{ $json.body.op === 'crear' ? '' : '/' + encodeURIComponent($json.body.id) }}",
             "authentication": "predefinedCredentialType",
             "nodeCredentialType": "googleCalendarOAuth2Api",
             "sendQuery": True,
             "queryParameters": {"parameters": [{"name": "sendUpdates", "value": "none"}]},
             "sendBody": True, "specifyBody": "json", "jsonBody": cuerpo, "options": {}},
         "credentials": {"googleCalendarOAuth2Api": {"id": cred, "name": "Google Calendar account"}}},
        {"id": str(uuid.uuid4()), "name": r, "type": "n8n-nodes-base.respondToWebhook", "typeVersion": 1.1,
         "position": [480, 0], "parameters": {"respondWith": "allIncomingItems", "options": {}}},
    ],
    "connections": {w: {"main": [[{"node": h, "type": "main", "index": 0}]]},
                    h: {"main": [[{"node": r, "type": "main", "index": 0}]]}},
    "settings": {"executionOrder": "v1", "saveDataSuccessExecution": "none"},
}))
PY
    RESP=$(api -X POST -H 'Content-Type: application/json' --data-binary @"$BK/n8n-cambios-nuevo.json" "$N8N_HOST/api/v1/workflows")
    rm -f "$BK/n8n-cambios-nuevo.json"   # lleva la ruta secreta
    WFC=$(printf '%s' "$RESP" | campo id)
    if [ -n "$WFC" ]; then
      conf_poner ONIA_AGENDA_CAMBIOS_URL "$N8N_HOST/webhook/$SECRETO"; conf_poner ONIA_AGENDA_CAMBIOS_WF "$WFC"
      if [ "$(api -X POST "$N8N_HOST/api/v1/workflows/$WFC/activate" | campo active)" = True ]; then
        echo "creé el flujo «ONIA - Agenda cambios (Jarvis)» ($WFC)"
      else
        falla "creé el flujo de cambios ($WFC) pero n8n no lo activó"
      fi
    else
      falla "n8n no aceptó el flujo de cambios: $(printf '%s' "$RESP" | campo message | head -c 300)"
    fi
  fi
  [ -n "$WFC" ] && echo "$WFC" > "$BK/n8n-cambios-id"
  # Verificar es MIRAR: un evento de prueba en su calendario —pasado mañana a las 03:00, dormido,
  # sin invitados, nadie recibe nada— se crea, se mueve y se cancela, y cada paso se lee de vuelta.
  sleep 2
  F=$(date -u -d '+2 days -4 hours' +%F)
  PRUEBA="🧪 Prueba de Jarvis — se borra sola"
  if SAL=$("$BIN/onia-agenda.sh" crear "$F" 03:00 03:15 "$PRUEBA" --si </dev/null 2>&1); then
    PID=$(printf '%s' "$SAL" | grep -oP '(?<=\(id )[^)]+')
    if [ -n "$PID" ] && "$BIN/onia-agenda.sh" mover "$PID" "$F" 03:15 03:30 --si </dev/null >/dev/null 2>&1 \
       && "$BIN/onia-agenda.sh" --ids "$F" </dev/null 2>/dev/null | grep -qP "^${PID}\t03:15\t03:30\t" \
       && "$BIN/onia-agenda.sh" cancelar "$PID" --si </dev/null >/dev/null 2>&1 \
       && ! "$BIN/onia-agenda.sh" --ids "$F" </dev/null 2>/dev/null | grep -qP "^${PID}\t"; then
      CAMBIOS_OK=1; echo "✅ probado en su calendario: crear → mover → cancelar (la prueba ya no está)"
    else
      falla "la prueba de cambios quedó a medias: revisar «$PRUEBA» del $F en su calendario"
    fi
  else
    falla "no pude crear el evento de prueba: $(printf '%s' "$SAL" | head -c 200)"
  fi
fi

# ── 5c. Que Hermes lo sepa usar ────────────────────────────────────────────────
sec "5c. Hermes: la skill de su calendario y la regla en su SOUL"
REPO_VPS=/root/loops/onia-hermes
NUEVA=$(git -C "$REPO_VPS" show origin/main:hermes-content/skills/agenda-calendario.md 2>/dev/null)
if ! printf '%s' "$NUEVA" | grep -q 'onia-agenda.sh crear'; then
  falla "no encontré la skill nueva en origin/main del VPS"
else
  echo "--- skills de Hermes (la forma de la carpeta):"
  ls /root/.hermes/skills 2>/dev/null | head -40 | tr '\n' ' '; echo
  DEST=$(find /root/.hermes/skills -maxdepth 4 \( -path '*/agenda-calendario/SKILL.md' -o -name 'agenda-calendario.md' \) 2>/dev/null | head -1)
  [ -n "$DEST" ] || DEST=/root/.hermes/skills/agenda-calendario/SKILL.md
  [ -f "$BK/skill-destino" ] || echo "$DEST" > "$BK/skill-destino"
  if [ ! -f "$BK/skill-antes.md" ] && [ ! -f "$BK/skill-no-existia" ]; then
    if [ -f "$DEST" ]; then cp -a "$DEST" "$BK/skill-antes.md"; else touch "$BK/skill-no-existia"; fi
  fi
  mkdir -p "$(dirname "$DEST")" && printf '%s\n' "$NUEVA" > "$DEST" \
    && echo "✅ skill instalada: $DEST" || falla "no pude escribir la skill en $DEST"
fi
SOUL=/root/.hermes/SOUL.md
if grep -q '^## Su calendario y el cierre del día' "$SOUL" 2>/dev/null; then
  echo "· su SOUL ya tenía la regla del calendario"
else
  SECCION=$(git -C "$REPO_VPS" show origin/main:hermes-content/deploy/hermes-agent/SOUL.md 2>/dev/null \
            | sed -n '/^## Su calendario y el cierre del día/,$p')
  if [ -n "$SECCION" ] && [ -f "$SOUL" ]; then
    [ -f "$BK/SOUL.md.antes" ] || cp -a "$SOUL" "$BK/SOUL.md.antes"
    printf '\n---\n\n%s\n' "$SECCION" >> "$SOUL" && echo "✅ regla del calendario agregada al SOUL de Hermes"
  else
    falla "no pude agregar la regla al SOUL (falta la sección en main o el archivo en el VPS)"
  fi
fi

# ── 6. El interruptor ───────────────────────────────────────────────────────────
sec "6. Interruptor de la aduana"
mkdir -p "$ESTADO" && touch "$ESTADO/activo" && echo "✅ $ESTADO/activo" || falla "no pude crear $ESTADO/activo"

# ── 7. Mirar antes de mandar ────────────────────────────────────────────────────
sec "7. Vista previa del CIERRE de hoy (21:30), tal cual le va a llegar"
ONIA_JARVIS_SOLO_IMPRIMIR=1 timeout 240 "$BIN/onia-jarvis-resumen.sh" noche </dev/null 2>&1 | redactar
sec "7b. Vista previa del RESUMEN (06:30), con los datos de ahora"
ONIA_JARVIS_SOLO_IMPRIMIR=1 timeout 240 "$BIN/onia-jarvis-resumen.sh" manana </dev/null 2>&1 | redactar

# ── 8. rollback.sh y aviso ──────────────────────────────────────────────────────
sec "8. Marcha atrás y aviso"
cat > "$BK/rollback.sh" <<RB
#!/usr/bin/env bash
# Deshace el aplicar de hermes-jarvis guardado en esta carpeta. Lo corre «revertir».
export HOME=/root
BK=$BK
N8N_HOST=$N8N_HOST
HPY=$HPY
RB
cat >> "$BK/rollback.sh" <<'RB'
crontab -l > "$BK/crontab.revertido-desde" 2>/dev/null
if python3 "$BK/marcas.py" deshacer "$BK/crontab.revertido-desde" > "$BK/crontab.revertido" </dev/null \
   && [ -s "$BK/crontab.revertido" ] && crontab "$BK/crontab.revertido" </dev/null; then
  echo "crontab: marcas de jarvis deshechas"
else
  echo "❌ crontab: no pude deshacer las marcas (el de antes está en $BK/crontab.antes)"
fi
for id in $(cat "$BK/hermes-pausados.txt" 2>/dev/null); do
  timeout 60 $HPY -m hermes_cli.main cron resume "$id" </dev/null >/dev/null 2>&1 && echo "hermes: reanudado $id" || echo "❌ hermes: no pude reanudar $id"
done
KEY=$(grep -oP '(?<=^N8N_MANAGEMENT_API_KEY=).*' /opt/onia-platform/app.env 2>/dev/null | tr -d "\"'" | head -1)
for id in $(cat "$BK/n8n-apagados.txt" 2>/dev/null); do
  curl -s --max-time 30 -X POST -H "X-N8N-API-KEY: $KEY" "$N8N_HOST/api/v1/workflows/$id/activate" </dev/null | grep -qE '"active": ?true' \
    && echo "n8n: reactivado $id" || echo "❌ n8n: no pude reactivar $id"
done
if [ -f "$BK/n8n-agenda-id" ]; then
  curl -s --max-time 30 -X POST -H "X-N8N-API-KEY: $KEY" "$N8N_HOST/api/v1/workflows/$(cat "$BK/n8n-agenda-id")/deactivate" </dev/null >/dev/null \
    && echo "n8n: lector de calendario apagado (queda guardado)"
fi
if [ -f "$BK/n8n-cambios-id" ]; then
  curl -s --max-time 30 -X POST -H "X-N8N-API-KEY: $KEY" "$N8N_HOST/api/v1/workflows/$(cat "$BK/n8n-cambios-id")/deactivate" </dev/null >/dev/null \
    && echo "n8n: cambios de calendario apagados (queda guardado)"
fi
if [ -f "$BK/skill-destino" ]; then
  D=$(cat "$BK/skill-destino")
  if [ -f "$BK/skill-antes.md" ]; then cp -a "$BK/skill-antes.md" "$D" && echo "hermes: skill del calendario restaurada"
  elif [ -f "$BK/skill-no-existia" ]; then rm -f "$D" && echo "hermes: skill del calendario quitada"; fi
fi
[ -f "$BK/SOUL.md.antes" ] && cp -a "$BK/SOUL.md.antes" /root/.hermes/SOUL.md && echo "hermes: SOUL restaurado"
[ "$(cat "$BK/interruptor.antes" 2>/dev/null)" = si ] || { rm -f /var/lib/onia-aviso/activo && echo "aduana: interruptor apagado"; }
touch "$BK/revertido"
RB
chmod 700 "$BK/rollback.sh"
[ -n "$PREVIO" ] && touch "$PREVIO/reemplazado"
touch "$BK/aplicado"
echo "✅ $BK/rollback.sh"

if [ "$FALLAS" -eq 0 ]; then
  AVISO="✅ <b>Jarvis encendido</b>

Te escribo a las <b>06:30</b> (tu día, lo que espera tu ok, prospectos y guiones) y a las <b>21:30</b> (el cierre). En el medio, sólo lo urgente — nunca de 22:00 a 06:30 ni en tus bloques del calendario: eso te lo junto para cuando salís.

Apagué los reportes automáticos que te llegaban. Todo se puede deshacer."
  [ "$CAMBIOS_OK" = 1 ] && AVISO="$AVISO

📅 Y ya podés pedirme que agende, mueva o cancele algo de tu calendario: siempre te muestro el cambio y lo hago solo con tu sí."
  if ONIA_AVISO=interrumpe ONIA_AVISO_AHORA=1 ONIA_AVISO_CLAVE="jarvis-encendido-$HOY" ONIA_AVISO_EMISOR=jarvis \
       "$BIN/onia-tg.sh" "$AVISO" </dev/null >/dev/null 2>&1; then
    echo "✅ le avisé por Telegram"
  else
    falla "no pude avisarle por Telegram"
  fi
fi

sec "fin"
echo "aplicado $(date -u +%FT%TZ) — fallas: $FALLAS — respaldo: $BK"
[ "$FALLAS" -eq 0 ]

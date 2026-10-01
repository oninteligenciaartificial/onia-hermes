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
HERMES_CAMBIO=0   # 1 = Hermes tiene skill o SOUL nuevos: hay que reiniciar su gateway (6b)
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
           skill-destino skill-antes.md skill-no-existia SOUL.md.antes \
           skill-pedidos-destino skill-pedidos-antes.md skill-pedidos-no-existia pedidos-env-creado; do
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

# ── 1b. FASE A: requisitos. Nada de lo que ve Sergio Urcullo cambia hasta pasarlos todos ──
# Sesión madre, 1-oct: «aplicar no se detiene ante fallas: si falla el calendario igual aplica
# crontab, pausas, apaga los 12 flujos y crea el interruptor». Ahora es TODO O NADA: primero se
# prueba lo que hace falta (la API de n8n, leer y cambiar su calendario, las skills en main) y
# recién con todo verde se toca el crontab. Si algo falla acá, abortar() apaga lo que ESTA corrida
# prendió y sale sin tocar crontab, Hermes, los 12 flujos, su SOUL ni el interruptor.
sec "1b. Requisitos: la API de n8n"
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
  falla "la API de n8n no responde con la llave de gestión"
fi
abortar() {  # abortar <motivo> — SOLO antes de tocar el crontab: deja todo como estaba
  echo
  echo "❌ NO APLIQUÉ NADA: $*"
  # Lo que ESTA corrida prendió para su calendario se apaga (el flujo queda guardado en n8n, y la
  # próxima corrida lo reusa). Lo que ya estaba prendido de un aplicar anterior, se deja.
  for f in agenda cambios; do
    if [ -f "$BK/prendido-$f" ] && [ -f "$BK/n8n-$f-id" ]; then
      api -X POST "$N8N_HOST/api/v1/workflows/$(cat "$BK/n8n-$f-id")/deactivate" >/dev/null \
        && echo "  n8n: apagué el flujo de $f que había prendido esta corrida"
    fi
  done
  echo "Crontab, Hermes, los 12 flujos de n8n, su SOUL y el interruptor quedaron como estaban."
  echo "Respaldo de esta corrida (sin aplicar): $BK"
  exit 1
}

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
  if [ -n "$WF" ] && [ "$(api "$N8N_HOST/api/v1/workflows/$WF" | campo active)" = True ]; then
    echo "el lector ya existía y estaba activo"
  elif [ -n "$WF" ] && [ "$(api -X POST "$N8N_HOST/api/v1/workflows/$WF/activate" | campo active)" = True ]; then
    touch "$BK/prendido-agenda"; echo "reactivé el lector que ya existía"
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
        touch "$BK/prendido-agenda"; echo "creé el flujo «ONIA - Agenda hoy (Jarvis)» ($WF); la ruta quedó en $CONF"
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
     && [ "$(api "$N8N_HOST/api/v1/workflows/$WFC" | campo active)" = True ]; then
    echo "el flujo de cambios ya existía y estaba activo"
  elif [ -n "$WFC" ] && grep -q '^ONIA_AGENDA_CAMBIOS_URL=' "$CONF" \
     && [ "$(api -X POST "$N8N_HOST/api/v1/workflows/$WFC/activate" | campo active)" = True ]; then
    touch "$BK/prendido-cambios"; echo "reactivé el flujo de cambios que ya existía"
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
        touch "$BK/prendido-cambios"; echo "creé el flujo «ONIA - Agenda cambios (Jarvis)» ($WFC)"
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
      falla "la prueba de cambios quedó a medias: puede haber quedado «$PRUEBA» del $F (id ${PID:-?}) en su calendario; borrarlo con el conector de Google Calendar"
    fi
  else
    falla "no pude crear el evento de prueba: $(printf '%s' "$SAL" | head -c 200)"
  fi
fi

# ── Fin de la FASE A: con algo en rojo, no se toca nada de lo que le llega ──────
sec "Fase A: ¿todo listo para aplicar?"
REPO_VPS=/root/loops/onia-hermes
git -C "$REPO_VPS" show origin/main:hermes-content/skills/agenda-calendario.md 2>/dev/null | grep -q 'onia-agenda.sh crear' \
  || falla "no encontré la skill del calendario en origin/main del VPS"
git -C "$REPO_VPS" show origin/main:hermes-content/deploy/hermes-agent/SOUL.md 2>/dev/null | grep -q '^## Su calendario y el cierre del día' \
  || falla "no encontré la regla del calendario en el SOUL de origin/main del VPS"
[ "$N8N_OK" = 1 ]     || abortar "la API de n8n no responde con la llave de gestión"
[ "$AGENDA_OK" = 1 ]  || abortar "no puedo LEER su calendario"
[ "$CAMBIOS_OK" = 1 ] || abortar "agendar, mover y cancelar en su calendario no pasó la prueba"
[ "$FALLAS" -eq 0 ]   || abortar "$FALLAS falla(s) en los requisitos (arriba, con ❌)"
echo "✅ requisitos en verde: recién ahora se toca lo que le llega"

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
[ "$FALLAS" -eq 0 ] || abortar "el crontab no se pudo instalar"

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
  if [ "$(cat "$DEST" 2>/dev/null)" = "$NUEVA" ]; then
    echo "· la skill del calendario ya estaba al día: $DEST"
  else
    mkdir -p "$(dirname "$DEST")" && printf '%s\n' "$NUEVA" > "$DEST" \
      && { HERMES_CAMBIO=1; echo "✅ skill instalada: $DEST"; } || falla "no pude escribir la skill en $DEST"
  fi
fi
SOUL=/root/.hermes/SOUL.md
if grep -q '^## Su calendario y el cierre del día' "$SOUL" 2>/dev/null; then
  echo "· su SOUL ya tenía la regla del calendario"
else
  # Hasta el próximo «---»: desde el 1-oct le sigue la sección de pedidos, que va aparte.
  SECCION=$(git -C "$REPO_VPS" show origin/main:hermes-content/deploy/hermes-agent/SOUL.md 2>/dev/null \
            | awk '/^## Su calendario y el cierre del día/ {on = 1} on && /^---$/ {exit} on {print}')
  if [ -n "$SECCION" ] && [ -f "$SOUL" ]; then
    [ -f "$BK/SOUL.md.antes" ] || cp -a "$SOUL" "$BK/SOUL.md.antes"
    printf '\n---\n\n%s\n' "$SECCION" >> "$SOUL" && { HERMES_CAMBIO=1; echo "✅ regla del calendario agregada al SOUL de Hermes"; }
  else
    falla "no pude agregar la regla al SOUL (falta la sección en main o el archivo en el VPS)"
  fi
fi

# ── 5d. Pedidos a Claude: manejar todo desde Telegram (2026-10-01) ───────────────
# Sergio Urcullo: «que ya podamos manejar todo desde ahí». Hermes le pasa a una rutina de Claude
# Code en la nube lo que necesita trabajo real, siempre con su sí al texto exacto
# (hermes-content/docs/TELEGRAM_COMMAND_CENTER.md). Acá: la skill, la regla en su SOUL y la llave
# de la rutina. Sin llave NO es una falla: Jarvis queda encendido y los pedidos, apagados.
sec "5d. Hermes: pedidos a Claude en la nube"
PEDIDOS_OK=0
PEDIDOS_ENV=/root/.config/onia/pedidos.env
# 🔴 INERTE SIN LLAVE. Hasta que exista la llave de la rutina no se le enseña nada a Hermes: una
# skill que nombra un comando sin configurar lo haría prometerle a Sergio Urcullo algo que no anda.
# Así, un aplicar sin llave deja el VPS exactamente como sin esta sección.
# La llave la trae el workflow desde GitHub (variable ONIA_RUTINA_PEDIDOS_URL y secreto
# ONIA_RUTINA_PEDIDOS_TOKEN -> RUTINA_URL / RUTINA_TOKEN), o ya está en el VPS. Nunca se imprime.
if [[ "${RUTINA_URL:-}" =~ ^https://api\.anthropic\.com/v1/claude_code/routines/trig_[A-Za-z0-9]+/fire$ ]] \
   && [ -n "${RUTINA_TOKEN:-}" ]; then
  [ -f "$PEDIDOS_ENV" ] || touch "$BK/pedidos-env-creado"
  (umask 077; mkdir -p /root/.config/onia \
    && printf 'ONIA_RUTINA_URL=%s\nONIA_RUTINA_TOKEN=%s\n' "$RUTINA_URL" "$RUTINA_TOKEN" > "$PEDIDOS_ENV") \
    && echo "✅ llave de la rutina guardada en $PEDIDOS_ENV (600)" || falla "no pude guardar $PEDIDOS_ENV"
elif [ -n "${RUTINA_URL:-}${RUTINA_TOKEN:-}" ]; then
  falla "la URL o el token de la rutina no tienen la forma esperada: no los guardé"
fi
if [ ! -s "$PEDIDOS_ENV" ]; then
  echo "· pedidos a Claude APAGADOS: falta la llave de la rutina (README, «Pedidos a Claude»). No toqué nada."
elif [ ! -x "$BIN/onia-pedido-claude.sh" ]; then
  echo "· el sincronizador todavía no copió onia-pedido-claude.sh a $BIN: pedidos a Claude apagados por ahora"
else
  EST=$("$BIN/onia-pedido-claude.sh" --estado </dev/null 2>&1); RC=$?
  printf '%s\n' "$EST" | redactar
  [ "$RC" = 0 ] || falla "la llave de la rutina está, pero el comando no la acepta"
fi
if [ -s "$PEDIDOS_ENV" ] && [ -x "$BIN/onia-pedido-claude.sh" ] && [ "${RC:-1}" = 0 ]; then
  NUEVA=$(git -C "$REPO_VPS" show origin/main:hermes-content/skills/pedir-a-claude.md 2>/dev/null)
  if ! printf '%s' "$NUEVA" | grep -q 'onia-pedido-claude.sh'; then
    falla "no encontré la skill pedir-a-claude en origin/main del VPS"
  else
    # Junto a la del calendario: Hermes agrupa sus skills por carpeta y ahí ya sabe buscar.
    D_AGENDA=$(cat "$BK/skill-destino" 2>/dev/null || echo /root/.hermes/skills/agenda-calendario/SKILL.md)
    DEST=$(find /root/.hermes/skills -maxdepth 4 \( -path '*/pedir-a-claude/SKILL.md' -o -name 'pedir-a-claude.md' \) 2>/dev/null | head -1)
    [ -n "$DEST" ] || DEST="$(dirname "$(dirname "$D_AGENDA")")/pedir-a-claude/SKILL.md"
    [ -f "$BK/skill-pedidos-destino" ] || echo "$DEST" > "$BK/skill-pedidos-destino"
    if [ ! -f "$BK/skill-pedidos-antes.md" ] && [ ! -f "$BK/skill-pedidos-no-existia" ]; then
      if [ -f "$DEST" ]; then cp -a "$DEST" "$BK/skill-pedidos-antes.md"; else touch "$BK/skill-pedidos-no-existia"; fi
    fi
    if [ "$(cat "$DEST" 2>/dev/null)" = "$NUEVA" ]; then
      echo "· la skill de pedidos ya estaba al día: $DEST"
    else
      mkdir -p "$(dirname "$DEST")" && printf '%s\n' "$NUEVA" > "$DEST" \
        && { HERMES_CAMBIO=1; echo "✅ skill instalada: $DEST"; } || falla "no pude escribir la skill en $DEST"
    fi
  fi
  if grep -q '^## Pedidos a Claude' "$SOUL" 2>/dev/null; then
    echo "· su SOUL ya tenía la regla de los pedidos"
  else
    SECCION=$(git -C "$REPO_VPS" show origin/main:hermes-content/deploy/hermes-agent/SOUL.md 2>/dev/null \
              | awk '/^## Pedidos a Claude/ {on = 1} on && /^---$/ {exit} on {print}')
    if [ -n "$SECCION" ] && [ -f "$SOUL" ]; then
      [ -f "$BK/SOUL.md.antes" ] || cp -a "$SOUL" "$BK/SOUL.md.antes"
      printf '\n---\n\n%s\n' "$SECCION" >> "$SOUL" && { HERMES_CAMBIO=1; echo "✅ regla de los pedidos agregada al SOUL de Hermes"; }
    else
      falla "no pude agregar la regla de los pedidos al SOUL"
    fi
  fi
  PEDIDOS_OK=1
fi

# ── 6. El interruptor ───────────────────────────────────────────────────────────
sec "6. Interruptor de la aduana"
mkdir -p "$ESTADO" && touch "$ESTADO/activo" && echo "✅ $ESTADO/activo" || falla "no pude crear $ESTADO/activo"

# ── 6b. Que Hermes lea lo nuevo ─────────────────────────────────────────────────
# Sesión madre, 1-oct: el gateway corre desde el 18-sep sin reiniciarse, y su
# .skills_prompt_snapshot.json es del 08-sep: NO nombra agenda-calendario. Hermes arma la lista de
# skills al arrancar, así que una skill copiada en caliente existe en disco y él no la conoce. Se
# reinicia de forma controlada (systemd si lo maneja; si no, su propio comando, nunca pkill:
# hermes-gateway-restart.sh cuenta por qué) y se verifica que volvió.
sec "6b. Hermes: reinicio controlado del gateway para que lea la skill y el SOUL nuevos"
SNAP=$(find /root/.hermes -maxdepth 3 -name '.skills_prompt_snapshot.json' 2>/dev/null | head -1)
snapshot_nombra() { [ -n "$SNAP" ] && grep -q "$1" "$SNAP" 2>/dev/null; }
gateway_vivo() {
  if systemctl cat hermes-gateway.service >/dev/null 2>&1; then systemctl is-active --quiet hermes-gateway.service
  else pgrep -f "hermes_cli.main gateway run" >/dev/null; fi
}
reiniciar_gateway() {
  if systemctl cat hermes-gateway.service >/dev/null 2>&1; then
    timeout 90 systemctl restart hermes-gateway.service </dev/null 2>&1 | redactar
  else
    timeout 120 "$BIN/hermes-gateway-restart.sh" </dev/null 2>&1 | redactar
  fi
}
FALTA_EN_SNAP=0
snapshot_nombra agenda-calendario || FALTA_EN_SNAP=1
[ "$PEDIDOS_OK" = 1 ] && ! snapshot_nombra pedir-a-claude && FALTA_EN_SNAP=1
if [ "$HERMES_CAMBIO" != 1 ] && [ "$FALTA_EN_SNAP" != 1 ]; then
  echo "· su skill, su SOUL y su lista de skills ya estaban al día: no hace falta reiniciar"
else
  ANTES_GW=$(date +%s)
  reiniciar_gateway
  sleep 10
  if gateway_vivo; then
    echo "✅ gateway de Hermes reiniciado y vivo"
  else
    systemctl start hermes-gateway.service </dev/null >/dev/null 2>&1; sleep 10
    if gateway_vivo; then echo "✅ gateway vivo (al segundo intento)"
    else falla "❗ el gateway de Hermes NO volvió después del reinicio: Sergio Urcullo se queda sin Hermes. «revertir» restaura su SOUL y sus skills y lo reinicia"; fi
  fi
  # La lista de skills puede rearmarse recién con el primer mensaje: si no la nombra, se avisa,
  # no se falla. Se confirma con el primer pedido de calendario.
  for i in 1 2 3 4 5 6; do
    SNAP=$(find /root/.hermes -maxdepth 3 -name '.skills_prompt_snapshot.json' 2>/dev/null | head -1)
    [ -n "$SNAP" ] && [ "$(stat -c %Y "$SNAP" 2>/dev/null || echo 0)" -ge "$ANTES_GW" ] && break; sleep 5
  done
  if snapshot_nombra agenda-calendario; then echo "✅ su lista de skills ya nombra agenda-calendario"
  else echo "⚠️ su lista de skills todavía no nombra agenda-calendario (puede rearmarse con el primer mensaje): probarlo con «¿qué tengo mañana?»"; fi
  if [ "$PEDIDOS_OK" = 1 ]; then
    snapshot_nombra pedir-a-claude && echo "✅ y nombra pedir-a-claude" || echo "⚠️ todavía no nombra pedir-a-claude"
  fi
fi

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
if [ -f "$BK/skill-pedidos-destino" ]; then
  D=$(cat "$BK/skill-pedidos-destino")
  if [ -f "$BK/skill-pedidos-antes.md" ]; then cp -a "$BK/skill-pedidos-antes.md" "$D" && echo "hermes: skill de pedidos restaurada"
  elif [ -f "$BK/skill-pedidos-no-existia" ]; then rm -f "$D" && echo "hermes: skill de pedidos quitada"; fi
fi
[ -f "$BK/pedidos-env-creado" ] && [ -f /root/.config/onia/pedidos.env ] \
  && mv -f /root/.config/onia/pedidos.env "$BK/pedidos.env.retirado" && echo "pedidos a Claude: llave retirada (queda en el respaldo)"
[ -f "$BK/SOUL.md.antes" ] && cp -a "$BK/SOUL.md.antes" /root/.hermes/SOUL.md && echo "hermes: SOUL restaurado"
# Que el gateway lea el SOUL y las skills de antes (mismo reinicio controlado que aplicar 6b).
if systemctl cat hermes-gateway.service >/dev/null 2>&1; then
  timeout 90 systemctl restart hermes-gateway.service </dev/null >/dev/null 2>&1; sleep 10
  systemctl is-active --quiet hermes-gateway.service && echo "hermes: gateway reiniciado" || echo "❌ hermes: el gateway no volvió (systemctl start hermes-gateway)"
elif [ -x /root/bin/hermes-gateway-restart.sh ]; then
  timeout 120 /root/bin/hermes-gateway-restart.sh </dev/null >/dev/null 2>&1 && echo "hermes: gateway reiniciado" || echo "❌ hermes: el gateway no volvió"
fi
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
  [ "$PEDIDOS_OK" = 1 ] && AVISO="$AVISO

🤖 Y lo que necesite trabajo de verdad (un arreglo, un documento, revisar cómo está algo) pedímelo: te muestro el pedido y, con tu sí, se lo paso a Claude. Te aviso cuando termine."
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

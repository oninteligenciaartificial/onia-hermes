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
#           calendario cada 30 min · la aduana suelta lo retenido al terminar un bloque
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
    && grep -q '^avisar()' "$BIN/claude-guardia.sh" 2>/dev/null
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
  for f in interruptor.antes hermes-pausados.txt n8n-apagados.txt n8n-agenda-id; do
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
      mkdir -p "$(dirname "$CONF")"
      ( umask 077; printf 'ONIA_AGENDA_URL=%s/webhook/%s\nONIA_AGENDA_WF=%s\n' "$N8N_HOST" "$SECRETO" "$WF" > "$CONF" )
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

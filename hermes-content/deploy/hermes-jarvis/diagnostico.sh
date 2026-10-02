# Diagnóstico SOLO LECTURA: qué le llega a Sergio Urcullo por Telegram, de dónde y
# cuántas veces. Corre en el VPS por .github/workflows/hermes-jarvis.yml
# (accion=diagnostico), detrás de comun.sh.
#
# No escribe archivos, no reinicia servicios, no manda mensajes, no toca crontab.
# Lo único que sale a la red es `getMe` de Telegram (nombre del bot, de solo lectura).
# Toda salida pasa por `redactar`.
#
# Por qué existe: el inventario del repo (29-sep) encontró ~30 emisores y la mayoría
# esquiva el enrutador onia-tg.sh. El crontab vivo, los trabajos de Hermes y n8n NO
# están en el repo: antes de cambiar nada se mide la máquina, no los docs.

HORAS=${HORAS:-72}
DESDE=$(date -u -d "-${HORAS} hours" +%FT%TZ)

sec "0. Máquina"
date -u
echo "ventana: desde $DESDE ($HORAS h)"
uptime
df -h / | tail -1

sec "1. Crontab de root — líneas ACTIVAS"
crontab -l 2>/dev/null | grep -vE '^[[:space:]]*(#|$)' | redactar
echo "--- líneas comentadas que parecen trabajos (pausados):"
crontab -l 2>/dev/null | grep -E '^[[:space:]]*#[[:space:]]*([0-9*@]|[A-Z_]+=)' | head -60 | redactar
echo "--- /etc/cron.d:"
for f in /etc/cron.d/*; do
  [ -f "$f" ] || continue
  echo "# $f"
  grep -vE '^[[:space:]]*(#|$)' "$f"
done 2>/dev/null | redactar

sec "2. Hermes — gateway y trabajos programados"
systemctl is-active hermes-gateway.service
systemctl show hermes-gateway.service -p ActiveEnterTimestamp -p NRestarts
# Sin `hermes cron list`: el CLI escribe en /root/.hermes/logs al arrancar (lo midió la sesión
# madre el 1-oct). jobs.json dice lo mismo y se lee sin tocar nada.
echo "--- detalle de /root/.hermes/cron/jobs.json:"
python3 - <<'PY' | redactar
import json
p = '/root/.hermes/cron/jobs.json'
try:
    d = json.load(open(p))
except Exception as e:
    print('no pude leer', p, e)
    raise SystemExit
jobs = d.get('jobs', d) if isinstance(d, dict) else d
if isinstance(jobs, dict):
    jobs = [dict(v, _clave=k) if isinstance(v, dict) else v for k, v in jobs.items()]
jobs = [j for j in jobs if isinstance(j, dict)]
print('total trabajos:', len(jobs))
claves = sorted({k for j in jobs for k in j})
print('claves:', claves)
def g(j, *ks):
    for k in ks:
        v = j.get(k)
        if v not in (None, '', [], {}):
            return v
    return ''
for j in jobs:
    print('---')
    print('id:', g(j, 'id', '_clave'), '| nombre:', g(j, 'name', 'title'))
    print('horario:', g(j, 'schedule_display', 'schedule', 'cron', 'expr'),
          '| habilitado:', g(j, 'enabled'), '| estado:', g(j, 'state', 'status', 'paused'))
    print('entrega:', g(j, 'deliver', 'delivery', 'deliver_to', 'target', 'origin'),
          '| modelo:', g(j, 'model'), '| skills:', g(j, 'skills', 'skill'))
    print('ultima:', g(j, 'last_run_at', 'last_run'), g(j, 'last_status', 'last_result'),
          '| error:', str(g(j, 'last_error'))[:160], '| proxima:', g(j, 'next_run_at', 'next_run'))
    pr = str(g(j, 'prompt', 'message', 'task', 'instructions'))
    print('prompt (%d car.):' % len(pr), pr[:420].replace('\n', ' '))
PY

sec "3. Lo que Hermes dejó hoy para la voz de la mañana"
for f in /root/.hermes/out/agenda-hoy.txt /root/.hermes/out/video-hoy.txt; do
  echo "# $f"
  stat -c '%y  %s bytes' "$f" 2>/dev/null || { echo "(no existe)"; continue; }
  head -45 "$f" | redactar
done
echo "--- salidas recientes de trabajos:"
ls -lt /root/.hermes/cron/output 2>/dev/null | head -15
ls -lt /root/.hermes/cron/output/* 2>/dev/null | head -25

sec "4. Enrutador onia-tg.sh — últimas $HORAS h"
L=/var/log/onia-tg.log
if [ -f "$L" ]; then
  echo "--- resultado por tipo:"
  awk -v d="$DESDE" '$1>=d {print $2}' "$L" | sort | uniq -c | sort -rn
  echo "--- envíos DIRECTOS a Telegram por día (OK message_id):"
  awk -v d="$DESDE" '$1>=d && $2=="OK" {print substr($1,1,10)}' "$L" | sort | uniq -c
  echo "--- message_id del chat de Hermes (sube con CADA mensaje del chat, de cualquier emisor que use ese bot y ese chat):"
  awk -v d="$DESDE" '$1>=d && $2=="OK" {print $1, $3}' "$L" | awk 'NR==1; {u=$0} END{print u}'
  grep -aE ' OK message_id=' "$L" | tail -8 | awk '{print $1, $3}'
  echo "--- tareas creadas (títulos normalizados):"
  awk -v d="$DESDE" '$1>=d && ($2=="TAREA" || $2=="TAREA-YA-EXISTE")' "$L" \
    | sed -E 's/.*titulo=//; s/[0-9]+/N/g' | sort | uniq -c | sort -rn | head -25 | redactar
  echo "--- informativos (no llegan a nadie), top:"
  awk -v d="$DESDE" '$1>=d && $2=="INFORMATIVO"' "$L" \
    | sed -E 's/^[^ ]+ INFORMATIVO \(sin tarea\) //; s/[0-9]+/N/g' | sort | uniq -c | sort -rn | head -15 | redactar
else
  echo "(no existe $L)"
fi

sec "5. Emisores directos — sus logs y marcas (tocados en la ventana)"
find /var/log /opt/onia /var/lib -maxdepth 3 -type f \
  \( -name 'onia*' -o -name '*vigia*' -o -name '*watchdog*' -o -name '*canary*' -o -name '*guardia*' \
     -o -name '*jarvis*' -o -name '*aprobaciones*' -o -name '*mirar*' -o -name '*backup*' -o -name 'avisadas*' \) \
  -newermt "$DESDE" 2>/dev/null | grep -v '\.gz$' | sort | while read -r f; do
    printf '# %s  (%s bytes, %s)\n' "$f" "$(stat -c %s "$f")" "$(stat -c %y "$f" | cut -c1-19)"
    tail -3 "$f" 2>/dev/null | cut -c1-220 | redactar
  done
echo "--- watchdog del bot: avisos en la ventana:"
grep -a -cE 'Telegram|avis' /var/log/onia-bot-watchdog.log 2>/dev/null
echo "--- vigia-aprobaciones: tareas ya avisadas (total):"
wc -l /var/lib/onia-aprobaciones/avisadas 2>/dev/null

sec "6. Bots y chats de Telegram (¿cuántos bots le escriben?)"
for envf in /root/.hermes/.env /root/.config/onia/backup.env /opt/onia/bot/webhook.env; do
  [ -f "$envf" ] || continue
  echo "# $envf"
  python3 - "$envf" <<'PY'
import sys, re, json, urllib.request
vals = {}
for line in open(sys.argv[1], errors='ignore'):
    m = re.match(r'\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?', line)
    if m:
        vals[m.group(1)] = m.group(2).strip()
tok = next((vals[k] for k in ('TELEGRAM_BOT_TOKEN', 'TG_BOT_TOKEN', 'ONIA_BOT_TG_TOKEN') if vals.get(k)), '')
chats = {k: v for k, v in vals.items() if ('CHAT' in k or 'CHANNEL' in k) and v}
for k, v in chats.items():
    print('  %s = …%s' % (k, v[-4:]))
if tok:
    try:
        r = json.load(urllib.request.urlopen('https://api.telegram.org/bot%s/getMe' % tok, timeout=15))
        print('  bot: @%s' % r.get('result', {}).get('username'))
    except Exception as e:
        print('  getMe falló:', type(e).__name__)
else:
    print('  (sin token en este archivo)')
PY
done

sec "7. n8n — workflows ACTIVOS que escriben a Telegram, y cuántas veces corrieron"
N8N=$(docker ps --format '{{.Names}}' | grep -E '^n8n-sergio_n8n' | head -1)
[ -n "$N8N" ] || N8N=$(docker ps --format '{{.Names}}' | grep -iE 'n8n' | grep -viE 'postgres|redis|worker' | head -1)
echo "contenedor: ${N8N:-no encontrado}"
if [ -n "$N8N" ]; then
  echo "DB_TYPE: $(docker exec "$N8N" printenv DB_TYPE 2>/dev/null || echo sqlite-por-defecto)"
  MOUNT=$(docker inspect -f '{{range .Mounts}}{{if eq .Destination "/home/node/.n8n"}}{{.Source}}{{end}}{{end}}' "$N8N" 2>/dev/null)
  echo "datos: ${MOUNT:-?}"
  # Por la API de gestión, solo GET. Antes era `n8n export:workflow --all`, que NO es de solo
  # lectura: inicializa la base y corre migraciones (medido por la sesión madre, 1-oct).
  N8N_HOST=https://n8n-sergio-n8n.hqdqgh.easypanel.host
  KEY=$(grep -oP '(?<=^N8N_MANAGEMENT_API_KEY=).*' /opt/onia-platform/app.env 2>/dev/null | tr -d "\"'" | head -1)
  N8N_HOST="$N8N_HOST" N8N_KEY="$KEY" python3 -c '
import json, os, urllib.request
wfs, cursor = [], ""
try:
    for _ in range(20):
        url = os.environ["N8N_HOST"] + "/api/v1/workflows?limit=250" + ("&cursor=" + cursor if cursor else "")
        req = urllib.request.Request(url, headers={"X-N8N-API-KEY": os.environ["N8N_KEY"], "Accept": "application/json"})
        d = json.load(urllib.request.urlopen(req, timeout=30))
        wfs += d.get("data", [])
        cursor = d.get("nextCursor") or ""
        if not cursor:
            break
except Exception as e:
    print("no pude leer los flujos por la API:", type(e).__name__)
print(json.dumps(wfs))' 2>/dev/null | N8N_DB="${MOUNT:+$MOUNT/database.sqlite}" DESDE="$DESDE" python3 -c '
import sys, json, os, sqlite3
raw = sys.stdin.read()
i = raw.find("[")
try:
    wfs = json.loads(raw[i:]) if i >= 0 else []
except Exception as e:
    print("no pude leer los flujos:", e); wfs = []
if raw[:i].strip():
    print(raw[:i].strip())
activos = [w for w in wfs if w.get("active")]
print("workflows: %d en total, %d activos" % (len(wfs), len(activos)))
def trig(w):
    out = []
    for n in w.get("nodes", []):
        t = n.get("type", ""); p = n.get("parameters", {})
        if "scheduleTrigger" in t or t.endswith(".cron"):
            out.append("horario:" + json.dumps(p.get("rule", p), ensure_ascii=False)[:120])
        elif t.endswith(".webhook"):
            out.append("webhook:/" + str(p.get("path", "?")))
        elif "telegramTrigger" in t:
            out.append("mensaje-telegram")
        elif "Trigger" in t:
            out.append(t.split(".")[-1])
    return out
def tg(w):
    n_tg = 0
    for n in w.get("nodes", []):
        t = n.get("type", ""); s = json.dumps(n.get("parameters", {}))
        if (t.endswith(".telegram") and not n.get("disabled")) or "api.telegram.org" in s:
            n_tg += 1
    return n_tg
runs = {}
db = os.environ.get("N8N_DB")
if db and os.path.exists(db):
    try:
        c = sqlite3.connect("file:%s?mode=ro" % db, uri=True)
        for wid, st, n in c.execute("select workflowId, status, count(*) from execution_entity where startedAt >= ? group by 1,2", (os.environ["DESDE"].replace("T", " ").replace("Z", ""),)):
            runs.setdefault(wid, {})[st] = n
    except Exception as e:
        print("no pude leer ejecuciones:", e)
else:
    print("(sin base sqlite accesible: no cuento ejecuciones)")
print("--- ACTIVOS con nodo Telegram (ejecuciones en la ventana por estado):")
for w in sorted(activos, key=lambda w: -sum(runs.get(w.get("id"), {}).values())):
    if tg(w):
        print("%-18s %-55s tg=%d  %s  %s" % (w.get("id"), w.get("name", "")[:55], tg(w), runs.get(w.get("id"), {}), " ".join(trig(w))[:140]))
print("--- ACTIVOS sin Telegram:")
for w in activos:
    if not tg(w):
        print("%-18s %-55s %s  %s" % (w.get("id"), w.get("name", "")[:55], runs.get(w.get("id"), {}), " ".join(trig(w))[:100]))
' | redactar
fi

sec "8. Tablero de Hermes — lo que 'espera a Sergio Urcullo'"
# En SQLite de SOLO LECTURA: `onia-tablero.sh list` pasa por el CLI de Hermes, que escribe en sus
# logs al arrancar (medido por la sesión madre, 1-oct).
DBS=$(find /root/.hermes -maxdepth 5 -type f \( -name '*.db' -o -name '*.sqlite' \) -path '*kanban*' 2>/dev/null | head -5)
if [ -z "$DBS" ]; then
  echo "(no encontré la base del tablero bajo /root/.hermes: no la leo)"
else
  for db in $DBS; do
    echo "# $db"
    python3 - "$db" <<'PY' | redactar
import sys, sqlite3
c = sqlite3.connect('file:%s?mode=ro' % sys.argv[1], uri=True)
for (t,) in c.execute("select name from sqlite_master where type='table'"):
    cols = [r[1] for r in c.execute('pragma table_info("%s")' % t)]
    if 'status' not in cols or 'title' not in cols:
        continue
    print('tabla', t)
    for st, n in c.execute('select status, count(*) from "%s" group by 1 order by 2 desc' % t):
        print('  %-12s %s' % (st, n))
    print('--- bloqueadas (títulos):')
    for (ti,) in c.execute('select title from "%s" where status = \'blocked\' limit 40' % t):
        print('  ⊘', str(ti)[:150])
    print('--- abiertas [auto:] (títulos):')
    for (ti,) in c.execute('select title from "%s" where status not in (\'done\', \'blocked\', \'archived\') and title like \'%%[auto:%%\' limit 25' % t):
        print('  ·', str(ti)[:150])
PY
  done
fi

sec "9. Hermes — estructura de su carpeta (para saber dónde guarda conversaciones)"
ls -la /root/.hermes 2>/dev/null | awk '{print $5, $6, $7, $8, $9}'
for db in /root/.hermes/state.db /root/.hermes/sessions.db; do
  [ -f "$db" ] || continue
  echo "# $db"
  python3 - "$db" <<'PY'
import sys, sqlite3
c = sqlite3.connect('file:%s?mode=ro' % sys.argv[1], uri=True)
for (t,) in c.execute("select name from sqlite_master where type='table'"):
    try:
        n = c.execute('select count(*) from "%s"' % t).fetchone()[0]
    except Exception:
        n = '?'
    cols = [r[1] for r in c.execute('pragma table_info("%s")' % t)]
    print('  %-28s %8s filas  %s' % (t, n, ','.join(cols)[:120]))
PY
done
ls -lt /root/.hermes/logs 2>/dev/null | head -8

sec "10. Llaves disponibles — SOLO nombres de variables, nunca valores"
for envf in /root/.hermes/.env /root/.config/onia/*.env /opt/onia/*.env /opt/onia/bot/*.env /opt/onia-selfhosted/.env; do
  [ -f "$envf" ] || continue
  printf '# %s: ' "$envf"
  grep -oE '^[[:space:]]*(export[[:space:]]+)?[A-Z0-9_]+=' "$envf" 2>/dev/null \
    | sed -E 's/^[[:space:]]*(export[[:space:]]+)?//; s/=$//' \
    | grep -E 'N8N|GOOGLE|GCAL|CAL_|CALCOM|TELEGRAM|TG_|LITELLM|OPENAI|ELEVEN|CHATWOOT|HERMES' | sort -u | tr '\n' ' '
  echo
done

sec "11. Contenedores (nombre y estado)"
docker ps --format '{{.Names}}\t{{.Status}}' 2>/dev/null | sort | head -60

sec "12. Pedidos a Claude desde Hermes (2026-10-01) — estado, sin la llave"
if [ -x /root/bin/onia-pedido-claude.sh ]; then
  /root/bin/onia-pedido-claude.sh --estado </dev/null 2>&1 | redactar
  echo "--- pedidos de hoy (hora La Paz · id · carril · estado):"
  /root/bin/onia-pedido-claude.sh --lista </dev/null 2>/dev/null | cut -f1-4 | head -20
  stat -c '%a %n' /root/.config/onia/pedidos.env 2>/dev/null || echo "(sin /root/.config/onia/pedidos.env)"
else
  echo "(el comando todavía no está en /root/bin)"
fi

sec "fin"
echo "diagnóstico terminado $(date -u +%FT%TZ) — no se modificó nada"

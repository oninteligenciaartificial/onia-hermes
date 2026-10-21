# Diagnóstico SOLO LECTURA: qué le llega a Sergio Urcullo por Telegram, de dónde y
# cuántas veces. Corre en el VPS por .github/workflows/hermes-jarvis.yml
# (accion=diagnostico), detrás de comun.sh.
#
# No escribe archivos, no reinicia servicios, no manda mensajes, no toca crontab.
# Lo que sale a la red es de solo lectura: `getMe` de Telegram (nombre del bot) y, desde el 20-oct (sección 18),
# GET a la API de GitHub con el token de Issues (el repo y sus labels, por `onia-orquesta-hermes.sh --estado`).
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
# La que atiende es la unidad de USUARIO; la de sistema quedó deshabilitada el 19-oct (8.092 reinicios):
# si vuelve a decir «active», volvió el bucle.
echo "--- unidad de usuario (la que atiende):"
XDG_RUNTIME_DIR=/run/user/0 systemctl --user is-active hermes-gateway.service
XDG_RUNTIME_DIR=/run/user/0 systemctl --user show hermes-gateway.service -p ActiveEnterTimestamp -p NRestarts
echo "--- unidad de sistema (tiene que estar inactive y disabled):"
systemctl is-active hermes-gateway.service
systemctl is-enabled hermes-gateway.service 2>&1
systemctl show hermes-gateway.service -p NRestarts
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

sec "12. Pedidos a Claude desde Hermes (2026-10-01) — estado, sin la llave, y el recolector de respuestas"
if [ -x /root/bin/onia-pedido-claude.sh ]; then
  /root/bin/onia-pedido-claude.sh --estado </dev/null 2>&1 | redactar
  echo "--- pedidos de hoy (hora La Paz · id · carril · estado):"
  /root/bin/onia-pedido-claude.sh --lista </dev/null 2>/dev/null | cut -f1-4 | head -20
  stat -c '%a %n' /root/.config/onia/pedidos.env 2>/dev/null || echo "(sin /root/.config/onia/pedidos.env)"
else
  echo "(el comando todavía no está en /root/bin)"
fi
# El recolector de respuestas (pendiente 6 del handoff, 9-oct): sin esto, una respuesta que no le
# llegaba solo se veía entrando al VPS. Escribe una línea solo cuando pasa algo. Los sellos se
# cuentan, nunca se leen.
LR=/var/log/onia-respuestas-pedidos.log
EP=/var/lib/onia-pedidos
echo "--- recolector de respuestas (cron cada 2 min):"
if crontab -l 2>/dev/null | grep -v '^[[:space:]]*#' | grep -qF 'onia-respuestas-pedidos.sh'; then
  echo "en el crontab: sí"
else
  echo "en el crontab: NO"
fi
if [ -f "$LR" ]; then
  stat -c 'log: %y  %s bytes' "$LR"
  en_ventana() { awk -v d="$DESDE" '$1 ~ /^[0-9][0-9][0-9][0-9]-/ && $1 >= d' "$LR"; }
  echo "en la ventana: $(en_ventana | grep -c 'entregada a la aduana') entregada(s) · $(en_ventana | grep -c '❌') con falla"
  echo "últimas líneas:"
  tail -n 12 "$LR" | cut -c1-220 | redactar
else
  echo "(no existe $LR: el recolector nunca escribió nada)"
fi
for f in respuestas.tsv rechazos-avisados.tsv; do
  [ -f "$EP/$f" ] && printf '%s: %s fila(s)\n' "$f" "$(grep -c . "$EP/$f")"
done
echo "sellos de pedidos abiertos: $(find "$EP/sellos" -maxdepth 1 -type f 2>/dev/null | wc -l) (no se leen)"

sec "13. Publicaciones — qué salió en la ventana y qué está agendado (9-oct)"
# GOAL del 8-oct: una pieza publicada por día. Los publicadores del VPS anotan cada publicación en
# publicado.jsonl (Instagram y YouTube con link; Buffer, el envío). Se lee y se lista: solo lectura.
PUB=/root/publicar/publicado.jsonl
if [ -r "$PUB" ]; then
  stat -c 'registro: %y  %s bytes' "$PUB"
  DESDE="$DESDE" python3 - "$PUB" <<'PY' | redactar
import datetime, json, os, sys
LP = datetime.timezone(datetime.timedelta(hours=-4))
def hora(t):
    try:
        d = datetime.datetime.fromisoformat(str(t).replace("Z", "+00:00").replace("+0000", "+00:00"))
    except ValueError:
        return None
    return d if d.tzinfo else None
desde = hora(os.environ["DESDE"])
filas, por_dia = [], {}
for linea in open(sys.argv[1], encoding="utf-8", errors="replace"):
    try:
        r = json.loads(linea)
        if not isinstance(r, dict):
            continue
        red = r.get("red")
        if red == "buffer":
            d = hora(r.get("fecha") if r.get("cuando") in (None, "ya") else r.get("cuando"))
            que, link, cuenta = "Buffer %s" % r.get("estado", "?"), str(r.get("post", "")), False
        elif red == "youtube":
            d = hora(r.get("fecha"))
            pub = r.get("privacidad") == "public"
            que, link, cuenta = "YouTube" + ("" if pub else " (%s)" % r.get("privacidad")), str(r.get("url", "")), pub
        else:
            d = hora(r.get("timestamp"))
            tipo = r.get("tipo")
            que = "Carrusel" if tipo == "carrusel" else "Historia" if tipo == "historia" else "Trial" if r.get("trial") else "Reel"
            link, cuenta = str(r.get("permalink") or "(sin link)"), True
        if not d or (desde and d < desde):
            continue
        d = d.astimezone(LP)
        filas.append((d, que, link))
        if cuenta:
            por_dia[d.strftime("%m-%d")] = por_dia.get(d.strftime("%m-%d"), 0) + 1
    except Exception:
        continue
for d, que, link in sorted(filas, key=lambda f: f[0]):
    print("%s %s · %s" % (d.strftime("%m-%d %H:%M"), que, link))
print("publicadas por día (La Paz, Instagram y YouTube público): %s" % (" · ".join("%s: %d" % kv for kv in sorted(por_dia.items())) or "ninguna"))
PY
else
  echo "(no existe $PUB)"
fi
echo "--- agendado en Instagram (timers pub-*):"
systemctl list-timers 'pub-*' --all --no-pager 2>/dev/null | head -30

sec "14. El SOUL de Hermes — qué secciones de main le faltan (9-oct)"
# aplicar copia del SOUL de main solo las secciones que nombra (5c y 5d). Para decidir qué más copiar,
# se compara por títulos `##`, sin la fecha del final («… (2026-09-30)»): aplicar busca el título por
# su comienzo. Solo lectura: no se imprime el texto, solo los títulos.
SOUL_VPS=/root/.hermes/SOUL.md
titulos() { grep '^## ' | sed -E 's/[[:space:]]*\([0-9]{4}-[0-9]{2}-[0-9]{2}\)[[:space:]]*$//'; }
if [ -r "$SOUL_VPS" ]; then
  echo "el SOUL del VPS tiene $(grep -c '^## ' "$SOUL_VPS") sección(es); modificado $(stat -c '%y' "$SOUL_VPS" | cut -c1-19)"
  T_MAIN=$(git -C /root/loops/onia-hermes show origin/main:hermes-content/deploy/hermes-agent/SOUL.md 2>/dev/null | titulos)
  T_VPS=$(titulos < "$SOUL_VPS")
  [ -n "$T_MAIN" ] || echo "(no pude leer el SOUL de origin/main en /root/loops/onia-hermes)"
  echo "--- de main, le faltan:"
  printf '%s\n' "$T_MAIN" | grep -vxF -f <(printf '%s\n' "$T_VPS") | grep . || echo "(ninguna)"
  echo "--- tiene y main no:"
  printf '%s\n' "$T_VPS" | grep -vxF -f <(printf '%s\n' "$T_MAIN") | grep . || echo "(ninguna)"
else
  echo "(no existe $SOUL_VPS)"
fi

sec "15. Latidos del cron — cada línea, su log y cuándo escribió (10-oct, HERMES_ROL_QA.md Q2)"
# Hoy un vigía mudo y uno sano se ven igual: los dos no dicen nada. Para cada línea activa del crontab
# de root: la cadencia REAL (el hueco más largo entre dos corridas en una semana, sacado del horario),
# el log al que escribe (>>) y cuándo lo tocó por última vez. MUDO = su log es más viejo que la penúltima
# corrida programada (faltó a dos seguidas). «sin log» = la línea no escribe a un archivo: no se puede medir así (va con latido o se
# mide por otro lado). Solo lee: crontab -l y la fecha de los archivos.
crontab -l 2>/dev/null | python3 -c '
import datetime, os, re, sys
ahora = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None, second=0, microsecond=0)
NOMBRES = {"jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6, "jul": 7, "aug": 8, "sep": 9, "oct": 10,
           "nov": 11, "dec": 12, "sun": 0, "mon": 1, "tue": 2, "wed": 3, "thu": 4, "fri": 5, "sat": 6}
def campo(txt, lo, hi):
    txt = re.sub(r"[a-z]{3}", lambda m: str(NOMBRES[m.group(0)]), txt.lower().replace("?", "*"))
    vals = set()
    for parte in txt.split(","):
        paso = 1
        if "/" in parte:
            parte, p = parte.split("/", 1)
            paso = int(p)
        if parte == "*":
            a, b = lo, hi
        elif "-" in parte:
            a, b = (int(x) for x in parte.split("-", 1))
        else:
            a = b = int(parte)
        vals.update(range(a, b + 1, paso))
    return vals
ALIAS = {"@hourly": "0 * * * *", "@daily": "0 0 * * *", "@midnight": "0 0 * * *", "@weekly": "0 0 * * 0", "@monthly": "0 0 1 * *"}
def corridas(horario, dias=70):
    # Las corridas programadas de los últimos <dias>, de la más vieja a la más nueva. Se recorre por
    # día y después por hora y minuto: 70 días cubren dos corridas de un trabajo mensual.
    m, h, dom, mes, dow = horario.split()
    M, H, DOM, MES = sorted(campo(m, 0, 59)), sorted(campo(h, 0, 23)), campo(dom, 1, 31), campo(mes, 1, 12)
    DOW = {d % 7 for d in campo(dow, 0, 7)}
    libre = dom.startswith("*") or dow.startswith("*")
    out, d = [], (ahora - datetime.timedelta(days=dias)).date()
    while d <= ahora.date():
        d_ok, w_ok = d.day in DOM, ((d.weekday() + 1) % 7) in DOW
        # Como cron: si el día del mes y el de la semana están restringidos, basta uno.
        if d.month in MES and ((d_ok and w_ok) if libre else (d_ok or w_ok)):
            for hh in H:
                for mm in M:
                    t = datetime.datetime(d.year, d.month, d.day, hh, mm)
                    if t <= ahora:
                        out.append(t)
        d += datetime.timedelta(days=1)
    return out
def hace(s):
    return "%d min" % (s // 60) if s < 5400 else "%d h" % (s // 3600) if s < 172800 else "%d d" % (s // 86400)
filas = []
for l in sys.stdin:
    l = l.strip()
    if not l or l.startswith("#") or re.match(r"^[A-Za-z_][A-Za-z0-9_]*=", l):
        continue
    if l.startswith("@"):
        alias, _, cmd = l.partition(" ")
        if alias not in ALIAS:
            filas.append((3, "no medible", "—", "—", alias + " " + cmd))
            continue
        horario = ALIAS[alias]
    else:
        partes = l.split(None, 5)
        if len(partes) < 6:
            continue
        horario, cmd = " ".join(partes[:5]), partes[5]
    scripts = re.findall(r"/([A-Za-z0-9._-]+\.(?:sh|mjs|js|py))\b", cmd)
    nombre = scripts[-1] if scripts else cmd[:40]
    m = re.search(r"onia-latido\.sh (\S+)", cmd)
    if m:
        nombre = "latido:" + m.group(1)
    try:
        cs = corridas(horario)
    except (ValueError, KeyError):
        filas.append((3, "horario raro", "—", "—", nombre))
        continue
    huecos = [int((b - a).total_seconds()) for a, b in zip(cs, cs[1:])]
    cada = hace(max(huecos)) if huecos else "—"
    # El log: lo que sigue a >> o >. Una ruta armada al correr ($(date), $VAR, entre comillas) no se
    # puede mirar desde acá: va como «sin log», nunca como MUDO (revisión del 10-oct).
    destinos = [x for x in re.findall(r">>?\s*(\S+)", cmd) if x != "/dev/null" and not x.startswith("&")]
    log = destinos[0] if destinos else None
    if not log or re.search(r"[$`\"\x27(]", log) or not log.startswith("/"):
        filas.append((2, "sin log", cada, "—", nombre))
        continue
    if len(cs) < 2:
        filas.append((3, "no medible", cada, "—", "%s → %s (menos de dos corridas en 70 días)" % (nombre, log)))
        continue
    # Con latido se mide el latido, no el log (20-oct): el resumen, el cierre, la aduana y el recolector solo
    # escriben su log cuando pasa algo, así que su log quedaba viejo y salían MUDOS estando sanos.
    mtime, por = None, ""
    if m:
        try:
            mtime, por = int(open("/var/lib/onia-latido/" + m.group(1)).read().split()[0]), " (por su latido)"
        except (OSError, ValueError, IndexError):
            mtime = None
    try:
        if mtime is None:
            mtime = os.path.getmtime(log)
    except OSError:
        filas.append((1, "MUDO (no hay log)", cada, "—", "%s → %s" % (nombre, log)))
        continue
    edad = int(datetime.datetime.now(datetime.timezone.utc).timestamp() - mtime)
    # MUDO = el log es más viejo que la PENÚLTIMA corrida programada: faltó a dos seguidas. Sirve
    # igual para cada 2 min, para un horario de día y para uno semanal o mensual.
    penultima = cs[-2].replace(tzinfo=datetime.timezone.utc).timestamp()
    estado = "MUDO" if mtime < penultima - 60 else "ok"
    filas.append((0 if estado == "MUDO" else 4, estado, cada, "hace " + hace(edad), "%s → %s%s" % (nombre, log, por)))
for _, estado, cada, ultimo, que in sorted(filas, key=lambda f: f[0]):
    print("%-18s cada %-7s %-12s %s" % (estado, cada, ultimo, que))
print("--- %d línea(s): %d MUDA(S), %d sin log, %d no medibles" % (len(filas), sum(f[1].startswith("MUDO") for f in filas),
      sum(f[1] == "sin log" for f in filas), sum(f[1] in ("no medible", "horario raro") for f in filas)))
' | redactar
echo "--- latidos (/var/lib/onia-latido, los escribe onia-latido.sh):"
if [ -d /var/lib/onia-latido ]; then
  for f in /var/lib/onia-latido/*; do
    [ -f "$f" ] || continue
    printf '%s: %s (%s)\n' "${f##*/}" "$(cat "$f" 2>/dev/null)" "$(date -u -d "@$(cut -d' ' -f1 "$f" 2>/dev/null)" +%FT%TZ 2>/dev/null)"
  done | redactar
else
  echo "(no existe: aplicar todavía no corrió)"
fi

sec "16. Modelo y cadencia por trabajo — lo que está escrito, sin llamar a ningún modelo (11-oct)"
# Se leen declaraciones, nunca se ejecutan los scripts ni se resuelven variables del entorno.
# Un modelo ausente no prueba que el trabajo no use uno; el gateway puede elegirlo por defecto.
{
echo "--- A. Trabajos del gateway de Hermes"
# «(el del gateway)» = model.default y model.provider de config.yaml (21-oct: Sergio Urcullo pasa todo Hermes a
# gpt-6.1-sol con `/model … --global`). Solo esas dos claves: el resto del archivo trae llaves.
GW_MODELO=$(awk '/^model:[[:space:]]*[^[:space:]#]/ {print; exit} /^model:/ {on = 1; next}
  on && /^[^[:space:]#]/ {exit} on && /^[[:space:]]+(default|provider):/ {sub(/^[[:space:]]+/, ""); print}' \
  /root/.hermes/config.yaml 2>/dev/null | tr '\n' ' ')
echo "el del gateway: ${GW_MODELO:-(no encontré model.default en config.yaml)}"
python3 - <<'PY'
import json
p = '/root/.hermes/cron/jobs.json'
try:
    with open(p, encoding='utf-8') as f:
        d = json.load(f)
    jobs = d.get('jobs', d) if isinstance(d, dict) else d
    if isinstance(jobs, dict):
        jobs = [dict(v, _clave=k) for k, v in jobs.items() if isinstance(v, dict)]
    if not isinstance(jobs, list):
        raise ValueError('formato de trabajos')
except (OSError, ValueError) as e:
    # La clase del error alcanza; el mensaje de un parser podría contener datos del archivo.
    print('no pude leer %s: %s' % (p, type(e).__name__))
    raise SystemExit(0)

def primero(j, *claves):
    return next((j[k] for k in claves if j.get(k) not in (None, '', [], {})), '')

def visible(valor):
    return valor[:80] if isinstance(valor, str) else '(estructura)'

total = 0
for j in jobs:
    if not isinstance(j, dict):
        continue
    nombre = primero(j, 'name', 'title', 'id', '_clave')
    if nombre == '':
        nombre = '(sin nombre)'
    horario = primero(j, 'schedule_display', 'schedule', 'cron', 'expr')
    modelo = j.get('model')
    if modelo in (None, ''):
        modelo = '(el del gateway)'
    habilitado = 'sí' if j.get('enabled') is True else 'no' if j.get('enabled') is False else '?'
    print('%s | cada %s | modelo %s | habilitado: %s' % (visible(nombre), visible(horario), visible(modelo), habilitado))
    total += 1
if not total:
    print('(el archivo no trae trabajos)')
PY
echo "--- B. Trabajos del crontab con script instalado"
python3 - <<'PY'
import re, shlex, subprocess
try:
    resultado = subprocess.run(['crontab', '-l'], capture_output=True, text=True, check=False)
    cron = resultado.stdout if resultado.returncode == 0 else ''
except OSError:
    cron = ''
if not cron.strip():
    print('(crontab ilegible o vacío)')
base = '/root/bin/'

def indice_script(palabras):
    return next((i for i, s in enumerate(palabras) if re.fullmatch(re.escape(base) + r'[A-Za-z0-9._-]+', s)), None)

def asignaciones(palabras):
    valores = {}
    for palabra in palabras:
        m = re.fullmatch(r'([A-Za-z_][A-Za-z0-9_]*)=(.*)', palabra)
        if m:
            valores[m.group(1)] = m.group(2)
    return valores

total = 0
for linea in cron.splitlines():
    linea = linea.strip()
    if not linea or linea.startswith('#') or re.match(r'^[A-Za-z_][A-Za-z0-9_]*=', linea):
        continue
    partes = linea.split(None, 1 if linea.startswith('@') else 5)
    if len(partes) != (2 if linea.startswith('@') else 6):
        continue
    horario, comando = ' '.join(partes[:-1]), partes[-1]
    try:
        palabras = shlex.split(comando)
    except ValueError:
        continue
    indice = indice_script(palabras)
    if indice is None:
        continue
    overrides = asignaciones(palabras[:indice])
    etiqueta = ''
    # aplicar envuelve el comando entero en una palabra: leer el script del latido ocultaría su modelo.
    if palabras[indice] == base + 'onia-latido.sh':
        nombre = palabras[indice + 1] if len(palabras) > indice + 1 else ''
        etiqueta = (nombre if re.fullmatch(r'[A-Za-z0-9._-]+', nombre) else '(sin nombre)') + ' → '
        try:
            palabras = shlex.split(palabras[indice + 3])
        except (IndexError, ValueError):
            palabras = []
        indice = indice_script(palabras)
        if indice is None:
            print('%s(no pude leer el comando) | cada %s' % (etiqueta, horario))
            total += 1
            continue
        # El override del comando interior tiene prioridad sobre el que precede al latido.
        overrides.update(asignaciones(palabras[:indice]))
    script = palabras[indice]
    modelo = 'sin modelo declarado'
    try:
        with open(script, encoding='utf-8', errors='replace') as f:
            texto = f.read()
    except OSError:
        modelo = 'no instalado'
    else:
        declaracion = next((m for m in re.finditer(r'\$\{([A-Za-z_][A-Za-z0-9_]*):-([^}\n]+)\}', texto)
                            if 'MODEL' in m.group(1)), None)
        # Solo asignaciones anteriores al script: un argumento posterior no es un override de cron.
        if declaracion:
            modelo = overrides.get(declaracion.group(1), declaracion.group(2)) or 'sin modelo declarado'
        else:
            modelo = next((v for k, v in overrides.items() if 'MODEL' in k and v), modelo)
        # No expandir referencias o sustituciones que podrían traer secretos: solo nombres literales.
        if not re.fullmatch(r'[A-Za-z0-9][A-Za-z0-9._:/+-]*', modelo):
            modelo = 'sin modelo declarado'
    print('%s%s | cada %s | modelo %s' % (etiqueta, script, horario, modelo))
    total += 1
if not total:
    print('(el crontab no trae trabajos con un script de /root/bin)')
PY
echo "--- C. Lo que NO se puede medir desde acá"
echo "sesión de la nube de Hermes-Jarvis: modelo no medible desde el VPS (lo lee la madre en la consola de la sesión)"
} | redactar

sec "17. QA después de cada publicación — lo que dejó onia-qa-release (11-oct, Q5)"
ESTADO_QA="/var/lib/onia-qa-release"
LOG_QA="/var/log/onia-qa-release.log"
# El diagnóstico diario informa lo que dejó el instrumento, sin alterar su estado.
qa_redactar() { printf '%s\n' "$1" | redactar; }
qa_emitir() { qa_redactar "$1"; }
qa_edad() { local modificado ahora; modificado=$(stat -c %Y "$1" 2>/dev/null) || { printf '?'; return; }; ahora=$(date +%s); [[ "$modificado" =~ ^[0-9]+$ ]] || { printf '?'; return; }; printf '%s' "$(( (ahora - modificado) / 60 ))"; }
qa_hora() { date -u -d "@$1" +%H:%MZ 2>/dev/null || printf '?'; }
qa_emitir "--- estado: $ESTADO_QA"
if [ ! -d "$ESTADO_QA" ]; then
  qa_emitir "no existe $ESTADO_QA: qa-release todavía no corrió (¿falta aplicar?)"
else
  if [ -f "$ESTADO_QA/visto" ]; then
    visto=$(head -n 1 "$ESTADO_QA/visto" 2>/dev/null)
    if [[ "$visto" =~ ^[0-9a-f]{7,40}$ ]]; then qa_emitir "release visto: $visto (hace $(qa_edad "$ESTADO_QA/visto") min)"; else qa_emitir "release visto: (formato inesperado)"; fi
  else qa_emitir "release visto: nunca"; fi
  if [ -f "$ESTADO_QA/roto" ]; then
    IFS=' ' read -r roto_sha roto_epoch roto_motivos < "$ESTADO_QA/roto"
    if [[ "$roto_epoch" =~ ^[0-9]+$ ]]; then roto_desde=$(qa_hora "$roto_epoch"); qa_emitir "veredicto: ROTO desde $roto_desde — $(printf '%s' "$roto_motivos" | redactar | cut -c 1-160)"; else qa_emitir "veredicto: ROTO desde ? — $(printf '%s' "$roto_motivos" | redactar | cut -c 1-160)"; fi
  fi
  if [ -f "$ESTADO_QA/sin-medir" ]; then qa_emitir "veredicto: SIN MEDIR (el instrumento no pudo medir)"; elif [ ! -f "$ESTADO_QA/roto" ]; then qa_emitir "veredicto: sano"; fi
  ventana="?"; if [ -f "$ESTADO_QA/ventana" ]; then w=$(head -n 1 "$ESTADO_QA/ventana" 2>/dev/null); [[ "$w" =~ ^[0-9]+$ ]] && ventana=$(qa_hora "$w"); fi
  seguidas="?"; if [ -f "$ESTADO_QA/ventanas-seguidas" ]; then s=$(head -n 1 "$ESTADO_QA/ventanas-seguidas" 2>/dev/null); [[ "$s" =~ ^[0-9]+$ ]] && seguidas="$s"; fi
  qa_emitir "ventanas del publicador: última leída $ventana; seguidas sin publicar: $seguidas"
  tarea_roto="—"; tarea_medir="—"; tarea_log="—"; tarea_ventanas="—"
  for tarea in roto medir log ventanas; do
    archivo="$ESTADO_QA/tarea-$tarea"
    if [ -f "$archivo" ]; then id=$(head -n 1 "$archivo" 2>/dev/null); if [[ "$id" =~ ^t_[0-9a-f]{8}$ ]]; then printf -v "tarea_$tarea" '%s' "$id"; else printf -v "tarea_$tarea" '%s' '(id inválido)'; fi; fi
  done
  qa_emitir "tareas abiertas: roto $tarea_roto · medir $tarea_medir · log $tarea_log · ventanas $tarea_ventanas"
  capturas="$ESTADO_QA/capturas"; cantidad=0; edad_captura="?"
  if [ -d "$capturas" ]; then cantidad=$(ls -1 "$capturas"/*.png 2>/dev/null | wc -l); cantidad=$((cantidad + 0)); nueva=$(ls -t "$capturas"/*.png 2>/dev/null | head -n 1); [ -n "$nueva" ] && edad_captura=$(qa_edad "$nueva"); fi
  qa_emitir "capturas: $cantidad archivo(s) .png; la más nueva hace $edad_captura min"
  qa_emitir "--- últimas 15 líneas de $LOG_QA"
  if [ -f "$LOG_QA" ]; then tail -n 15 "$LOG_QA" | redactar | cut -c 1-200; else qa_emitir "(no existe: qa-release todavía no escribió)"; fi
fi
sec "18. Orquesta: Hermes planifica (20-oct) — token, labels y su revisión de cada 3 h, sin cambiar nada"
# --estado solo lee (GET al repo y a los labels) y nunca imprime el token; jobs.json se lee con python.
if [ -x /root/bin/onia-orquesta-hermes.sh ]; then
  /root/bin/onia-orquesta-hermes.sh --estado </dev/null 2>&1 | redactar
else
  echo "(el comando todavía no está en /root/bin)"
fi
stat -c '%a %n' /root/.config/onia/gh-issues-token 2>/dev/null || echo "(sin token de Issues en /root/.config/onia/gh-issues-token)"
python3 - <<'PY'
import json
try:
    d = json.load(open("/root/.hermes/cron/jobs.json"))
except Exception:
    print("(no pude leer jobs.json)"); raise SystemExit
jobs = d.get("jobs", d) if isinstance(d, dict) else d
if isinstance(jobs, dict):
    jobs = [dict(v, id=v.get("id", k)) for k, v in jobs.items() if isinstance(v, dict)]
j = next((j for j in jobs if isinstance(j, dict) and j.get("name") == "onia-planificar-orquesta"), None)
print("revisión de cada 3 h: " + ("no está programada" if not j else
      f"{j.get('id')} · enabled={j.get('enabled')} · state={j.get('state')} · última={j.get('last_run_at') or j.get('last_run') or '?'}"))
PY
# Lo que contestó en su última revisión ([SILENT] o lo que hizo), como lo guarda el cron de Hermes en
# ~/.hermes/cron/output/<id>/ (su documentación, features/cron.md). 21-oct: «ok» en jobs.json no decía si
# leyó la cola ni si cargó la skill.
ORQ_JID=$(python3 - 2>/dev/null <<'PY'
import json
d = json.load(open("/root/.hermes/cron/jobs.json"))
jobs = d.get("jobs", d) if isinstance(d, dict) else d
if isinstance(jobs, dict):
    jobs = [dict(v, id=v.get("id", k)) for k, v in jobs.items() if isinstance(v, dict)]
print(next((j.get("id", "") for j in jobs if isinstance(j, dict) and j.get("name") == "onia-planificar-orquesta"), ""))
PY
)
case "$ORQ_JID" in ''|*[!0-9a-f]*) ORQ_JID="" ;; esac
ORQ_SAL=""
[ -z "$ORQ_JID" ] || ORQ_SAL=$(ls -t /root/.hermes/cron/output/"$ORQ_JID"/* 2>/dev/null | head -1)
if [ -n "$ORQ_SAL" ] && [ -f "$ORQ_SAL" ]; then
  echo "--- su última salida: $(basename "$ORQ_SAL") ($(stat -c %s "$ORQ_SAL") bytes, $(stat -c %y "$ORQ_SAL" | cut -c1-19) UTC)"
  # El archivo trae el prompt entero (con la skill) y la respuesta al final: se muestra si cargó la skill y
  # desde «## Response» (medido el 21-oct: 8.205 bytes, y las 40 primeras líneas eran solo la skill).
  grep -q 'invoked the "planificar-orquesta" skill' "$ORQ_SAL" && echo "skill planificar-orquesta: cargada" \
    || echo "skill planificar-orquesta: NO figura en el prompt"
  if grep -q '^## Response' "$ORQ_SAL"; then
    sed -n '/^## Response/,$p' "$ORQ_SAL" | head -n 40 | redactar | cut -c 1-200
  else
    tail -n 20 "$ORQ_SAL" | redactar | cut -c 1-200
  fi
else
  echo "--- su última salida: (no hay en /root/.hermes/cron/output/${ORQ_JID:-?}/)"
fi

sec "fin"
echo "diagnóstico terminado $(date -u +%FT%TZ) — no se modificó nada"

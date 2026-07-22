#!/usr/bin/env bash
# ONIA — corre el Agente Radar YT. yt-dlp busca tendencias en YouTube DESDE EL HOST (el host tiene
# python3; el contenedor onia-center no), arma el harvest y lo pasa por base64 (RADAR_B64) al agente
# que corre DENTRO de onia-center (que tiene las credenciales de Supabase onia_center + la red de
# LiteLLM). El agente destila 3-6 IDEAS de contenido con LiteLLM (barato) y las deja como borradores
# en onia_center.idea_inbox. Imprime el resumen JSON en stdout. Llamado por n8n vía SSH o a mano.
#
# Cero costo: solo yt-dlp (gratis, sin API key de pago) + LiteLLM self-hosted. NO genera video/imágenes.
#
# Vars (env): RADAR_QUERIES  (queries separadas por '|'; default = pilares ONIA),
#             RADAR_SEARCH_N (resultados de YouTube por query; def 10),
#             RADAR_LIMIT    (máx ideas a escribir; def 6),
#             RADAR_POOL     (máx videos que ve el LLM; def 24),
#             RADAR_DRY_RUN  ('true'|'false'; def false),
#             RADAR_MODEL    (def gpt-4o-mini),
#             YTDLP_BIN      (ruta al binario yt-dlp; def /opt/onia/yt-dlp).
set -uo pipefail

YTDLP_BIN="${YTDLP_BIN:-/opt/onia/yt-dlp}"
SEARCH_N="${RADAR_SEARCH_N:-10}"
DRY="${RADAR_DRY_RUN:-false}"
MODEL="${RADAR_MODEL:-gpt-4o-mini}"
LIMIT="${RADAR_LIMIT:-6}"
POOL="${RADAR_POOL:-24}"

# Nichos por defecto = pilares de captación de ONIA (automatización/IA práctica para pyme LATAM).
DEFAULT_QUERIES='automatizacion con IA para pequenos negocios|chatbot de whatsapp para negocios|casos de uso de inteligencia artificial en pymes|IA practica para emprendedores latam|como automatizar tu negocio con inteligencia artificial'
QUERIES="${RADAR_QUERIES:-$DEFAULT_QUERIES}"

# yt-dlp disponible?
if [ ! -x "$YTDLP_BIN" ] && ! command -v "$YTDLP_BIN" >/dev/null 2>&1; then
  echo "{\"ok\":false,\"notify\":true,\"fatal\":\"yt-dlp no encontrado ($YTDLP_BIN). Instalar binario portable: curl -sL -o /opt/onia/yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp && chmod +x /opt/onia/yt-dlp\"}"
  exit 0
fi

# Harvest en el HOST con python3 (maneja subprocess + JSON + escaping de forma segura). Emite el
# JSON del harvest en base64 (queries que trajeron algo + videos con su query de origen).
RADAR_B64=$(YTDLP_BIN="$YTDLP_BIN" SEARCH_N="$SEARCH_N" QUERIES="$QUERIES" python3 - <<'PY'
import os, json, subprocess, base64, sys, datetime
ytdlp = os.environ["YTDLP_BIN"]
try:
    n = max(1, min(25, int(os.environ.get("SEARCH_N", "10") or "10")))
except Exception:
    n = 10
queries = [q.strip() for q in os.environ.get("QUERIES", "").split("|") if q.strip()]
videos, ok_queries = [], []
for q in queries:
    try:
        p = subprocess.run(
            [ytdlp, "--dump-json", "--flat-playlist", "--no-warnings",
             "--socket-timeout", "20", "ytsearch%d:%s" % (n, q)],
            capture_output=True, text=True, timeout=90)
    except Exception:
        continue
    got = 0
    for line in p.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            d = json.loads(line)
        except Exception:
            continue
        vid = d.get("id") or d.get("url")
        title = d.get("title")
        if not vid or not title:
            continue
        videos.append({
            "id": vid,
            "title": title,
            "channel": d.get("channel") or d.get("uploader"),
            "view_count": d.get("view_count"),
            "duration": d.get("duration"),
            "url": d.get("url") or d.get("webpage_url") or ("https://www.youtube.com/watch?v=" + str(vid)),
            "live_status": d.get("live_status"),
            "query": q,
        })
        got += 1
    if got:
        ok_queries.append(q)
payload = {
    "harvested_at": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "queries": ok_queries,
    "videos": videos,
}
sys.stdout.write(base64.b64encode(json.dumps(payload, ensure_ascii=False).encode("utf-8")).decode("ascii"))
PY
)

if [ -z "${RADAR_B64:-}" ]; then
  echo "{\"ok\":false,\"notify\":true,\"fatal\":\"harvest yt-dlp vacío (sin red a YouTube o yt-dlp falló)\"}"
  exit 0
fi

# LiteLLM master key (necesaria para destilar ideas; si falta, el agente lo reporta).
MK=$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY 2>/dev/null || true)

docker exec \
  -e LITELLM_BASE="http://onia_selfhosted-litellm-1:4000/v1" \
  -e LITELLM_KEY="$MK" \
  -e RADAR_MODEL="$MODEL" \
  -e RADAR_B64="$RADAR_B64" \
  -e RADAR_DRY_RUN="$DRY" \
  -e RADAR_LIMIT="$LIMIT" \
  -e RADAR_POOL="$POOL" \
  -i onia-center node - < /opt/onia/radar-yt-agent.mjs

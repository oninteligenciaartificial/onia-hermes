#!/usr/bin/env python3
"""ONIA - Cerebro: agregador de datos del panel.

Junta en UN data.json lo que el sistema YA produce. No genera nada nuevo: si una
fuente falta o esta vieja, lo dice (stale/error) en vez de inventar. Corre por cron
en el VPS y escribe /opt/onia-cerebro/www/data.json que la pagina index.html lee.

Deploy: /root/bin/onia-cerebro-datos.py. Fuente: scripts/cerebro/ del repo onia-hermes.
"""
import json
import os
import re
import subprocess
import time
from datetime import datetime, timezone

WWW = "/opt/onia-cerebro/www"
OUT = os.path.join(WWW, "data.json")
HOY = datetime.now().strftime("%Y-%m-%d")


def run(cmd, timeout=25):
    try:
        r = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=timeout)
        return r.returncode, r.stdout.strip()
    except Exception as e:  # timeout incluido: el panel nunca cuelga por una fuente
        return -1, str(e)[:200]


def leer_txt(path, max_chars=6000):
    try:
        st = os.stat(path)
        with open(path, encoding="utf-8", errors="replace") as f:
            txt = f.read(max_chars)
        return {"texto": txt, "mtime": int(st.st_mtime),
                "de_hoy": time.strftime("%Y-%m-%d", time.localtime(st.st_mtime)) == HOY}
    except FileNotFoundError:
        return {"texto": None, "mtime": None, "de_hoy": False}


def hermes_jobs():
    try:
        d = json.load(open("/root/.hermes/cron/jobs.json"))
        jobs = []
        for j in d.get("jobs", []):
            if j.get("state") == "active" or j.get("enabled"):
                jobs.append({
                    "name": j.get("name"), "state": j.get("state"),
                    "model": j.get("model"), "last_status": j.get("last_status"),
                    "last_run_at": j.get("last_run_at"), "next_run_at": j.get("next_run_at"),
                    "last_error": (j.get("last_error") or "")[:180],
                })
        return {"jobs": jobs}
    except Exception as e:
        return {"error": str(e)[:200]}


def tablero():
    code, out = run("/root/bin/onia-tablero.sh list 2>/dev/null | head -120")
    if code != 0 and not out:
        return {"error": "onia-tablero.sh no respondio"}
    lineas = [l for l in out.splitlines() if l.strip()]
    # Decisiones = lo que espera a Sergio: bloqueadas o needs_input, nunca las ya cerradas.
    decisiones = [l for l in lineas
                  if ("blocked" in l or "needs_input" in l)
                  and not l.lstrip().startswith("✓") and " done " not in l]
    abiertas = [l for l in lineas
                if not l.lstrip().startswith("✓") and " done " not in l]
    return {"lineas": abiertas[:25], "decisiones": decisiones[:15]}


def loops_casa():
    res = []
    for f in sorted(os.listdir("/var/log/homelab")):
        if not f.startswith("onia-loop-"):
            continue
        path = os.path.join("/var/log/homelab", f)
        code, out = run(
            "grep -E '===== (ARRANCA|TERMINA)' %s | tail -1" % path, timeout=10)
        m = re.match(r"(\S+) ===== (ARRANCA|TERMINA) (\S+)( .* exit (\d+))?", out or "")
        res.append({
            "loop": f.replace("onia-loop-", "").replace(".log", ""),
            "ultimo": out[:150] if out else None,
            "rsync_mtime": int(os.stat(path).st_mtime),
        })
    return {"loops": res}


def publicador():
    code, out = run("tail -8 /var/log/onia-publicar-solo.log", timeout=10)
    return {"ultimo_bloque": out.splitlines()[-8:] if out else []}


def dominios():
    res = []
    for d in ("onia.com.bo", "app.onia.com.bo"):
        code, out = run(
            "curl -s -o /dev/null -w '%%{http_code} %%{time_total}' --max-time 15 https://%s" % d)
        res.append({"dominio": d, "resultado": out})
    return {"checks": res}


def contenedores():
    res = []
    for c in ("onia-platform", "onia-landing", "supabase-db", "onia_selfhosted-litellm-1"):
        code, out = run(
            "curl -s --unix-socket /var/run/docker.sock "
            "http://localhost/v1.44/containers/%s/json | python3 -c \""
            "import sys,json;d=json.load(sys.stdin);print(d['State']['Status'])\" 2>/dev/null" % c,
            timeout=15)
        res.append({"contenedor": c, "estado": out or "sin respuesta"})
    return {"contenedores": res}


def main():
    os.makedirs(WWW, exist_ok=True)
    data = {
        "generado": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "generado_epoch": int(time.time()),
        "agenda": leer_txt("/root/.hermes/out/agenda-hoy.txt"),
        "video": leer_txt("/root/.hermes/out/video-hoy.txt", max_chars=9000),
        "audio_hoy": os.path.exists(os.path.join(WWW, "resumen-hoy.mp3"))
        and time.strftime("%Y-%m-%d", time.localtime(
            os.stat(os.path.join(WWW, "resumen-hoy.mp3")).st_mtime)) == HOY,
        "hermes": hermes_jobs(),
        "tablero": tablero(),
        "loops_casa": loops_casa(),
        "publicador": publicador(),
        "dominios": dominios(),
        "docker": contenedores(),
    }
    tmp = OUT + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    os.replace(tmp, OUT)
    print("%s data.json escrito (%d bytes)" % (data["generado"], os.path.getsize(OUT)))


if __name__ == "__main__":
    main()

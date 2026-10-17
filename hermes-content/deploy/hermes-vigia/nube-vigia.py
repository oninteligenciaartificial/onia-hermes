#!/usr/bin/env python3
"""Vigia de la nube de ONIA para Hermes, en modo cron SIN agente (cero LLM):
la salida estandar es el mensaje de Telegram; salida vacia = silencio.

  nube-vigia.py resumen   resumen de 24 h en GitHub (06:30 La Paz)
  nube-vigia.py vigia     avisa solo si la nube lleva mas de QUIET_H horas sin actividad
  nube-vigia.py selftest  comprobacion sin red

SOLO LEE. API: el token que ya usa onia-vigia-ci.sh (Actions: read, nada mas).
Git: las llaves deploy ya instaladas, en un repo bare propio (no toca /root/loops).
Actividad de la nube = commit o corrida cuyo mensaje trae el trailer Claude-Session
(la madre local no lo lleva). Comentarios de PR: sin permiso, no se miran.
Destino: /root/.hermes/scripts/nube-vigia.py (Hermes solo corre scripts de esa carpeta)."""
import json
import os
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

OWNER = "oninteligenciaartificial"
REPOS = ("onia-hermes", "onia-platform")
TOKEN_FILE = os.environ.get("ONIA_CI_TOKEN_FILE", "/root/.config/onia/github-token")
CACHE = os.environ.get("VIGIA_CACHE", "/root/.hermes/vigia-nube")
QUIET_H, REPEAT_H, STUCK_H = 3, 4, 2  # aviso a las 3 h; repetido cada 4 h; "en cola" desde las 2 h
MARK = "claude.ai/code/session_"
LP = timezone(timedelta(hours=-4))
BAD = ("failure", "timed_out", "startup_failure")
NOW = time.time()


def sh(args, env=None):
    r = subprocess.run(args, capture_output=True, encoding="utf-8", errors="replace", env=env, timeout=240)
    if r.returncode:
        raise RuntimeError(f"{' '.join(args[:5])}: {r.stderr.strip()[:300]}")
    return r.stdout


def api(path, token):
    req = urllib.request.Request(
        "https://api.github.com/" + path,
        headers={"Authorization": "Bearer " + token, "Accept": "application/vnd.github+json",
                 "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "onia-hermes-vigia"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r)


def epoch(iso):
    return datetime.strptime(iso, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc).timestamp()


def hora(ts, now=None):
    now = NOW if now is None else now
    t, hoy = datetime.fromtimestamp(ts, LP), datetime.fromtimestamp(now, LP)
    d = (hoy.date() - t.date()).days
    pre = "" if d == 0 else "ayer " if d == 1 else t.strftime("%d/%m ")
    return pre + t.strftime("%H:%M")


def pr_of(subject):
    m = re.search(r"\(#(\d+)\)\s*$|^Merge pull request #(\d+)", subject)
    return int(m.group(1) or m.group(2)) if m else None


def limpio(s):  # Telegram: sin caracteres de Markdown
    return re.sub(r"[_*`\[\]]", "-", s)


def reds(rs):
    """Ultima corrida de cada (workflow, rama); las que terminaron mal."""
    last = {}
    for r in sorted(rs, key=lambda r: r["created_at"]):
        last[(r["name"], r["head_branch"])] = r
    out = []
    for (name, branch), r in last.items():
        if r["conclusion"] in BAD:
            pr = (r.get("pull_requests") or [{}])[0].get("number")
            out.append(limpio(f"{name} {'#' + str(pr) if pr else branch}"))
    return out


def parse(out):
    res = []
    for e in out.split("\x1e"):
        if "\x1f" in e:
            ts, body = e.strip("\n").split("\x1f", 1)
            res.append((int(ts), body))
    return res


def git_data(repo):
    d = f"{CACHE}/{repo}.git"
    env = dict(os.environ, GIT_TERMINAL_PROMPT="0",
               GIT_SSH_COMMAND=f"ssh -i /root/.ssh/deploy_{repo} -o IdentitiesOnly=yes -o BatchMode=yes -o ConnectTimeout=20 -o UserKnownHostsFile=/root/.ssh/known_hosts")
    if not os.path.isdir(d):
        os.makedirs(CACHE, exist_ok=True)
        sh(["git", "init", "--bare", "-q", d])
        for k, v in (("remote.origin.url", f"git@github.com:{OWNER}/{repo}.git"),
                     ("remote.origin.promisor", "true"), ("remote.origin.partialclonefilter", "tree:0")):
            sh(["git", "-C", d, "config", k, v])
    f = ["git", "-C", d, "fetch", "-q", "--no-tags", "--filter=tree:0"]
    # A repo can have no claude/* branch (all merged and deleted): that refspec then fails, so check first.
    if sh(["git", "-C", d, "ls-remote", "--heads", "origin", "refs/heads/claude/*"], env).strip():
        sh(f + ["--prune", "--depth=1", "origin", "+refs/heads/claude/*:refs/remotes/origin/claude/*"], env)
    else:
        for ref in sh(["git", "-C", d, "for-each-ref", "--format=%(refname)", "refs/remotes/origin/claude/"]).split():
            sh(["git", "-C", d, "update-ref", "-d", ref])
    sh(f + ["--depth=300", "origin", "+HEAD:refs/vigia/default"], env)
    has_tips = sh(["git", "-C", d, "for-each-ref", "--count=1", "refs/remotes/origin/claude/"]).strip()
    tips = parse(sh(["git", "-C", d, "log", "--no-walk", "--glob=refs/remotes/origin/claude/*", "--format=%ct%x1f%B%x1e"])) if has_tips else []
    main = parse(sh(["git", "-C", d, "log", "refs/vigia/default", f"--max-age={int(NOW - 86400)}", "--format=%ct%x1f%B%x1e"]))
    return tips, main


def runs(repo, token):
    q = urllib.parse.quote(">=" + datetime.fromtimestamp(NOW - 86400, timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"))
    out = []
    for p in (1, 2, 3):
        page = api(f"repos/{OWNER}/{repo}/actions/runs?per_page=100&page={p}&created={q}", token)["workflow_runs"]
        out += page
        if len(page) < 100:
            break
    return out


def analyse(repo, token):
    tips, main = git_data(repo)
    rs = runs(repo, token)
    cloud = [t for t, b in tips + main if MARK in b]
    cloud += [epoch(r["created_at"]) for r in rs
              if r["head_branch"].startswith("claude/") and MARK in ((r.get("head_commit") or {}).get("message") or "")]
    prs = sorted({pr_of(b.split("\n", 1)[0]) for _, b in main} - {None}, reverse=True)
    return {"repo": repo.replace("onia-", ""), "main": len(main), "prs": prs,
            "ramas": sum(1 for t, _ in tips if t >= NOW - 86400),
            "prs_ci": len({(r["pull_requests"] or [{}])[0].get("number") for r in rs if r.get("pull_requests")}),
            "cloud": cloud, "red": reds(rs),
            "stuck": sum(1 for r in rs if r["status"] in ("queued", "waiting", "pending")
                         and NOW - epoch(r["created_at"]) > STUCK_H * 3600)}


def resumen(data, cloud):
    pas = []
    for d in data:
        n = "nada nuevo en main" if not d["main"] else f"{d['main']} commits en main"
        if d["prs"]:
            n += " (PR " + " ".join("#" + str(p) for p in d["prs"][:4]) + (f" +{len(d['prs']) - 4}" if len(d["prs"]) > 4 else "") + ")"
        pas.append(f"{d['repo']}: {n}")
    ramas, pci = sum(d["ramas"] for d in data), sum(d["prs_ci"] for d in data)
    h = (NOW - cloud) / 3600
    quieta = " La nube esta QUIETA." if h > QUIET_H else ""
    red = [f"{d['repo']} {x}" for d in data for x in d["red"]]
    stuck = sum(d["stuck"] for d in data)
    trab = [f"CI en rojo en {len(red)} ({'; '.join(red[:3])}{' ...' if len(red) > 3 else ''})"] if red else []
    if stuck:
        trab.append(f"{stuck} corridas en cola hace mas de {STUCK_H} h")
    return (f"Pasó (24 h): {'; '.join(pas)}.\n"
            f"Movió: {ramas} ramas con commits y {pci} PRs con CI. Ultima actividad de la nube: {hora(cloud)} (hace {h:.0f} h).{quieta}\n"
            f"Trabado: {'; '.join(trab) if trab else 'nada.'}")


def vigia(cloud, state):
    """Devuelve (mensaje o None, estado nuevo)."""
    if NOW - cloud <= QUIET_H * 3600:
        return None, {}
    if state.get("since") == cloud and NOW - state.get("sent", 0) < REPEAT_H * 3600:
        return None, state
    return f"⚠️ La nube está quieta desde {hora(cloud)}. Mirá el proyecto ONIA · Hermes", {"since": cloud, "sent": NOW}


def selftest():
    now = 1760700000.0  # fecha fija
    assert hora(now - 3600, now).count(":") == 1 and hora(now - 3 * 86400, now).count("/") == 1
    assert hora(now - 86400, now).startswith("ayer ")
    assert pr_of("Merge pull request #212 from x/y") == 212 and pr_of("fix: algo (#7)") == 7 and pr_of("docs: algo") is None
    r = lambda n, b, c, t, pr=None: {"name": n, "head_branch": b, "conclusion": c, "created_at": t, "pull_requests": [{"number": pr}] if pr else []}
    assert reds([r("CI", "a", "failure", "2026-10-17T01:00:00Z", 5), r("CI", "a", "success", "2026-10-17T02:00:00Z", 5)]) == []
    assert reds([r("CI", "a", "success", "2026-10-17T01:00:00Z"), r("CI", "a", "failure", "2026-10-17T02:00:00Z", 5)]) == ["CI #5"]
    global NOW
    NOW = now
    assert vigia(now - 3600, {})[0] is None
    msg, st = vigia(now - 5 * 3600, {})
    assert msg and "quieta desde" in msg and st["since"] == now - 5 * 3600
    assert vigia(now - 5 * 3600, st)[0] is None  # no repite antes de REPEAT_H
    NOW = now + REPEAT_H * 3600 + 1
    assert vigia(now - 5 * 3600, st)[0]
    print("selftest ok")


def main(modo):
    sys.stdout.reconfigure(encoding="utf-8")
    token = open(TOKEN_FILE).read().strip()
    data = [analyse(r, token) for r in REPOS]
    cloud = max((t for d in data for t in d["cloud"]), default=None)
    if cloud is None:
        sys.exit("vigia roto: ninguna actividad de la nube en GitHub (filtro Claude-Session o acceso)")
    if modo == "resumen":
        print(resumen(data, cloud))
        return
    estado = f"{CACHE}/estado.json"
    try:
        state = json.load(open(estado))
    except (OSError, ValueError):
        state = {}
    msg, state = vigia(cloud, state)
    with open(estado, "w") as f:
        json.dump(state, f)
    if msg:
        print(msg)


if __name__ == "__main__":
    modo = sys.argv[1] if len(sys.argv) > 1 else ""
    if modo == "selftest":
        selftest()
    elif modo in ("resumen", "vigia"):
        main(modo)
    else:
        sys.exit(__doc__)

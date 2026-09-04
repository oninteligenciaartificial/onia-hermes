#!/usr/bin/env bash
# Extractor de PATRONES DE FALLO de los loops. Sin modelo, sin red, sin plata.
#
# Lee los logs de los 15 loops y el tablero, y emite por stdout UN JSON con lo
# que se REPITE. No juzga ni escribe: sólo cuenta. Quien decide es el loop
# `supervisor`, que lo corre al arrancar su vuelta.
#
# Nace del 2026-09-04: el supervisor REPORTABA qué loop no avanza, pero nadie
# comparaba una vuelta con la anterior, así que el mismo fallo se pagaba todos
# los días y nunca se convertía en lección. Un fallo que no se cuenta no se
# aprende. El umbral es 2: una vez es mala suerte, dos veces es un patrón.
#
# Uso:
#   onia-extraer-fallos.sh              # ventana de 24 h, JSON a stdout
#   ONIA_VENTANA_HORAS=48 ...           # otra ventana
#   onia-extraer-fallos.sh --autotest   # se prueba a sí mismo y sale 0/1
set -euo pipefail

exec python3 - "$@" <<'PY'
import glob, json, os, re, sqlite3, sys
from datetime import datetime, timedelta, timezone

VENTANA = int(os.environ.get("ONIA_VENTANA_HORAS", "24"))
UMBRAL  = int(os.environ.get("ONIA_UMBRAL", "2"))
LOGS    = os.environ.get("ONIA_LOGS_GLOB", "/var/log/onia-loop-*.log")
TABLERO = os.environ.get("ONIA_TABLERO_DB",
                         os.path.expanduser("~/.hermes/kanban/boards/onia/kanban.db"))

TS   = re.compile(r"^(\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ)\s*")
ARR  = re.compile(r"=====\s*ARRANCA\s+(\S+)")
TERM = re.compile(r"=====\s*TERMINA\s+(\S+).*?—\s*(?:(\d+)\s*commit\(s\)|sin commit)")
CUPO = re.compile(r"vuelta PERDIDA por limite|hit your session limit", re.I)

# Sólo salida de MAQUINA, anclada al principio de línea. Los loops escriben
# prosa que dice "error" a cada rato; sin el ancla, el 90 % de los "patrones"
# serían frases de un informe.
ERR_INICIO = re.compile(
    r"^(API Error|Error:|error:|fatal:|Traceback \(|npm ERR!|You've hit|"
    r"RAZON: vuelta PERDIDA|RAZÓN: vuelta PERDIDA|bash:|sh:|✗|✘|FALLO|RECHAZADO)")
ERR_DENTRO = re.compile(
    r"Permission denied|command not found|unrecognized arguments|"
    r"No such file or directory|MERGE_HEAD|CONFLICT \(")
# Prosa de informe: viñetas, títulos, tablas, citas.
PROSA = re.compile(r"^[-*#>|]|^\d+\.\s|\*\*")


def firma(linea):
    """Normaliza una línea de error para que dos ocurrencias del MISMO fallo
    caigan en la misma firma: fuera rutas, SHAs, relojes y números."""
    s = TS.sub("", linea).strip()
    s = re.sub(r"\d{4}-\d\d-\d\dT[\d:]+Z?", "<ts>", s)
    s = re.sub(r"\b\d\d:\d\d(:\d\d)?\b", "<ts>", s)
    s = re.sub(r"\b[0-9a-f]{7,40}\b", "<sha>", s)
    s = re.sub(r"(?<![\w<])/[\w./-]+", "<ruta>", s)
    s = re.sub(r"\b\d+\b", "<n>", s)
    s = re.sub(r"\s+", " ", s).strip().lower()
    return s[:160]


def es_error(linea):
    s = TS.sub("", linea).strip()
    if not s or len(s) > 300 or PROSA.search(s):
        return False
    return bool(ERR_INICIO.match(s) or ERR_DENTRO.search(s))


def leer_logs(desde):
    """→ (loops, patrones). Recorre cada log una vez, de arriba a abajo."""
    loops, patrones = {}, {}
    for ruta in sorted(glob.glob(LOGS)):
        lid = re.sub(r"^onia-loop-|\.log$", "", os.path.basename(ruta))
        est = loops.setdefault(lid, {"id": lid, "vueltas": 0, "sin_commit": 0,
                                     "perdidas_por_limite": 0})
        dentro = False   # ¿la vuelta que estoy leyendo cae en la ventana?
        perdida = False
        with open(ruta, errors="replace") as fh:
            for linea in fh:
                m = TS.match(linea)
                if m and ARR.search(linea):
                    dentro = datetime.strptime(
                        m.group(1), "%Y-%m-%dT%H:%M:%SZ").replace(
                        tzinfo=timezone.utc) >= desde
                    perdida = False
                    if dentro:
                        est["vueltas"] += 1
                    continue
                if not dentro:
                    continue
                if TERM.search(linea):
                    if "sin commit" in linea:
                        est["sin_commit"] += 1
                    if perdida:
                        est["perdidas_por_limite"] += 1
                    dentro = False
                    continue
                if CUPO.search(linea):
                    perdida = True
                if es_error(linea):
                    p = patrones.setdefault(firma(linea),
                                            {"veces": 0, "loops": set(),
                                             "ejemplo": TS.sub("", linea).strip()[:200]})
                    p["veces"] += 1
                    p["loops"].add(lid)
    return loops, patrones


def leer_tablero():
    """Tareas que volvieron a `blocked` más de una vez: el tablero ya las cuenta
    en `block_recurrences`, no hace falta reconstruirlo desde los eventos."""
    if not os.path.exists(TABLERO):
        return []
    con = sqlite3.connect(f"file:{TABLERO}?mode=ro", uri=True)
    filas = con.execute(
        "select id, title, status, block_kind, block_recurrences from tasks "
        "where block_recurrences >= ? and status != 'archived' "
        "order by block_recurrences desc", (UMBRAL,)).fetchall()
    con.close()
    return [{"id": i, "titulo": t, "estado": s, "kind": k, "veces": n}
            for i, t, s, k, n in filas]


def informe():
    ahora = datetime.now(timezone.utc)
    loops, patrones = leer_logs(ahora - timedelta(hours=VENTANA))
    reps = sorted(
        ({"firma": f, "veces": p["veces"], "loops": sorted(p["loops"]),
          "ejemplo": p["ejemplo"]}
         for f, p in patrones.items() if p["veces"] >= UMBRAL),
        key=lambda x: -x["veces"])
    tab = leer_tablero()
    ls = sorted(loops.values(), key=lambda x: x["id"])
    return {
        "generado": ahora.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "ventana_horas": VENTANA,
        "umbral": UMBRAL,
        "loops": ls,
        "patrones_error": reps,
        "tablero_rebloqueadas": tab,
        "resumen": {
            "vueltas": sum(l["vueltas"] for l in ls),
            "sin_commit": sum(l["sin_commit"] for l in ls),
            "perdidas_por_limite": sum(l["perdidas_por_limite"] for l in ls),
            "patrones_error": len(reps),
            "tablero_rebloqueadas": len(tab),
        },
    }


def autotest():
    # La firma tiene que fundir dos ocurrencias del mismo fallo con distinto
    # sha/ruta/número, y NO fundir dos fallos distintos.
    a = firma("2026-09-04T05:03:03Z error: failed to push some refs to '/root/a.git' at 3f2a1bc")
    b = firma("2026-09-03T22:11:00Z error: failed to push some refs to '/root/otro.git' at 99ffee1")
    assert a == b, (a, b)
    assert firma("Error: Reached max turns (120)") != a
    # El ancla: prosa que menciona "error" no es un error.
    assert es_error("error: failed to push some refs")
    assert es_error("API Error: 529 Overloaded.")
    assert not es_error("- La sonda que escribí tenía dos defectos que empujaban al mismo error:")
    assert not es_error("**Error** de medición en el informe")
    # Una vuelta completa dentro de la ventana se cuenta una sola vez, y una
    # vuelta muerta por cupo cuenta como perdida.
    import tempfile
    hoy = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    d = tempfile.mkdtemp()
    with open(os.path.join(d, "onia-loop-prueba.log"), "w") as fh:
        fh.write(f"{hoy} ===== ARRANCA prueba — rama x — tope 60s =====\n"
                 f"{hoy} RAZON: vuelta PERDIDA por limite de uso de Claude\n"
                 f"{hoy} ===== TERMINA prueba — 3s — exit 1 — sin commit — sin pushear: 0 =====\n"
                 "2020-01-01T00:00:00Z ===== ARRANCA prueba — vieja =====\n"
                 "2020-01-01T00:01:00Z ===== TERMINA prueba — sin commit =====\n")
    globals()["LOGS"] = os.path.join(d, "onia-loop-*.log")
    loops, _ = leer_logs(datetime.now(timezone.utc) - timedelta(hours=24))
    assert loops["prueba"] == {"id": "prueba", "vueltas": 1, "sin_commit": 1,
                               "perdidas_por_limite": 1}, loops
    print("autotest OK")


if "--autotest" in sys.argv:
    autotest()
else:
    json.dump(informe(), sys.stdout, ensure_ascii=False, indent=2)
    print()
PY

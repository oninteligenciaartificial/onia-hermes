#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Telegram -> tablero. La via que faltaba.

POR QUE EXISTE: hasta el 2026-09-02 Telegram era de UNA sola direccion. Los 14
loops le hablaban a Sergio (`onia-tg.sh`) y el no tenia como contestar: para dar
un visto bueno o encargar algo tenia que abrir la laptop, entrar a una sesion de
Claude Code y escribir ahi. O sea que el sistema entero se declaraba "autonomo en
el VPS" pero el UNICO acto que no podia esperar --el veredicto de Sergio-- seguia
atado a la maquina que se supone que puede apagar.

Medido ese dia: `crontab -l | grep -icE "getUpdates|telegram-in"` daba 1, y ese 1
era el watchdog del bot de WhatsApp. Cero listeners de Telegram. Un tablero con
tareas bloqueadas esperando aprobacion, y ningun camino para aprobarlas desde el
telefono.

QUE HACE: lee los mensajes nuevos del chat de Sergio y los convierte en actos
sobre el MISMO tablero que usan los loops. No inventa una segunda cola: escribe
donde los loops ya leen.

  ok <id> [nota]   -> desbloquea la tarea (el visto bueno)
  no <id> <razon>  -> la deja bloqueada y le pega la razon al cuerpo
  /tablero         -> devuelve el estado
  cualquier texto  -> tarea nueva, prioridad 1

Corre por cron cada 2 minutos. `getUpdates` con offset: Telegram entrega cada
mensaje UNA vez y recien lo descarta cuando pedimos el siguiente offset, asi que
un fallo a mitad de camino reintenta en la vuelta siguiente en vez de perder el
mensaje.
"""
import json
import os
import subprocess
import urllib.parse
import urllib.request

ENV = "/root/.hermes/.env"
OFFSET_F = "/root/.hermes/tg-offset"
PY_HERMES = "/usr/local/lib/hermes-agent/venv/bin/python"
TABLERO = "onia"


def cargar_env():
    if not os.path.exists(ENV):
        return
    with open(ENV, encoding="utf-8", errors="replace") as fh:
        for linea in fh:
            linea = linea.strip()
            if not linea or linea.startswith("#") or "=" not in linea:
                continue
            k, v = linea.split("=", 1)
            os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))


cargar_env()
TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "")
CHAT = str(os.environ.get("TELEGRAM_HOME_CHANNEL", ""))
if not TOKEN or not CHAT:
    raise SystemExit("falta TELEGRAM_BOT_TOKEN o TELEGRAM_HOME_CHANNEL en " + ENV)
API = "https://api.telegram.org/bot" + TOKEN


def api(metodo, **datos):
    cuerpo = urllib.parse.urlencode(datos).encode("utf-8")
    with urllib.request.urlopen(API + "/" + metodo, cuerpo, timeout=25) as r:
        return json.load(r)


def responder(texto):
    try:
        api("sendMessage", chat_id=CHAT, parse_mode="HTML", text=texto[:4000])
    except Exception as e:  # noqa: BLE001 - avisar no puede tumbar el proceso
        print("aviso: no pude responder:", e)


def kanban(*args):
    """Corre el CLI del tablero. HOME=/root a proposito: el CLI resuelve por HOME
    donde vive el SQLite, y otro HOME leeria OTRO tablero -- la segunda fuente de
    verdad que CLAUDE.md prohibe."""
    entorno = dict(os.environ, HOME="/root", HERMES_PROFILE="telegram-sergio")
    p = subprocess.run(
        [PY_HERMES, "-m", "hermes_cli.main", "kanban", "--board", TABLERO] + list(args),
        capture_output=True, text=True, env=entorno, timeout=120,
    )
    return (p.stdout or "") + (p.stderr or "")


def escapar(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def id_tarea(txt):
    """El id puede venir como t_ab12cd34 o pegado a otra cosa. Se toma el primer
    token que empiece con t_ y no se asume que sea la segunda palabra."""
    for t in txt.replace("\n", " ").split():
        limpio = t.strip(".,;:()[]")
        if limpio.startswith("t_") and len(limpio) > 2:
            return limpio
    return None


def manejar(texto):
    bajo = texto.strip().lower()

    if bajo in ("/tablero", "tablero", "/start", "/estado", "estado"):
        salida = kanban("list")
        return "<b>Tablero</b>\n<pre>" + escapar(salida.strip()[:3500]) + "</pre>"

    if bajo.startswith("ok"):
        tid = id_tarea(texto)
        if not tid:
            return "Falta el id. Se usa: <code>ok t_ab12cd34</code>"
        salida = kanban("unblock", tid)
        # El CLI contesta "cannot unblock ... (not blocked/scheduled?)" con codigo
        # 0. Reportar "✅ desbloqueada" sobre eso seria avisarle a Sergio que su
        # veredicto entro cuando no entro -- el error mas caro de todos, porque
        # nadie lo va a volver a mirar.
        if "cannot" in salida.lower():
            return "⚠️ <b>" + escapar(tid) + "</b> NO se desbloqueo\n<pre>" + escapar(salida.strip()[:800]) + "</pre>"
        return "✅ <b>" + escapar(tid) + "</b> desbloqueada\n<pre>" + escapar(salida.strip()[:1200]) + "</pre>"

    if bajo.startswith("no "):
        tid = id_tarea(texto)
        if not tid:
            return "Falta el id. Se usa: <code>no t_ab12cd34 la razon</code>"
        razon = texto.split(tid, 1)[-1].strip() or "(sin razon)"
        # Queda BLOQUEADA a proposito: un rechazo sin razon escrita se olvida, y
        # la razon tiene que vivir en la tarea, no solo en el chat.
        # `comment` toma el texto POSICIONAL, no --body (verificado contra
        # `kanban comment --help` en vivo antes de escribir esto).
        kanban("comment", tid, "Sergio rechazo por Telegram: " + razon)
        # Se dice lo que este comando HIZO, no el estado en que quedo la tarea:
        # afirmar "sigue bloqueada" sin leerla es suponer. Lo cierto y suficiente
        # es que la razon quedo escrita y que no se desbloqueo nada.
        return ("🚫 <b>" + escapar(tid) + "</b> — razon anotada, no la desbloquee.\n"
                + escapar(razon[:300]))

    # Todo lo demas es un encargo.
    titulo = texto.strip().split("\n")[0][:120]
    salida = kanban("create", titulo, "--body", "Pedido de Sergio por Telegram:\n\n" + texto.strip(),
                    "--priority", "1", "--json")
    # El --json viene indentado en varias lineas: la ULTIMA linea es "}", no el
    # objeto. Tomar splitlines()[-1] devolvia "(sin id)" con la tarea ya creada
    # -- el peor resultado posible, porque Sergio no se quedaba sin tarea sino
    # sin la forma de aprobarla despues. Se decodifica desde el primer "{".
    nuevo = ""
    try:
        i = salida.index("{")
        nuevo = (json.JSONDecoder().raw_decode(salida[i:])[0] or {}).get("id", "")
    except Exception:  # noqa: BLE001 - si cambia el formato, cae al buscador de t_
        pass
    nuevo = nuevo or id_tarea(salida) or "(sin id)"
    return "📝 Anotado como <b>" + escapar(nuevo) + "</b>\n" + escapar(titulo)


def main():
    offset = 0
    if os.path.exists(OFFSET_F):
        try:
            offset = int(open(OFFSET_F).read().strip() or 0)
        except ValueError:
            offset = 0

    res = api("getUpdates", offset=offset, timeout=0, allowed_updates='["message"]')
    if not res.get("ok"):
        raise SystemExit("getUpdates fallo: " + json.dumps(res)[:300])

    ultimo = offset
    for upd in res.get("result", []):
        ultimo = max(ultimo, upd.get("update_id", 0) + 1)
        msg = upd.get("message") or {}
        if str((msg.get("chat") or {}).get("id", "")) != CHAT:
            continue  # solo el chat de Sergio manda
        texto = (msg.get("text") or "").strip()
        if not texto:
            continue
        print("mensaje:", texto[:120])
        try:
            responder(manejar(texto))
        except Exception as e:  # noqa: BLE001
            responder("⚠️ No pude procesarlo: " + escapar(str(e)[:300]))

    if ultimo != offset:
        with open(OFFSET_F, "w") as fh:
            fh.write(str(ultimo))


if __name__ == "__main__":
    main()

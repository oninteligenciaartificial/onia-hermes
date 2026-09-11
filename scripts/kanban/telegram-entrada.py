#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Telegram -> tablero. DE RESPALDO: hoy el que lee es el gateway de Hermes.

⚠️ NO LO PROGRAMES. Si lo dejas corriendo periodicamente, le robas a Sergio sus
respuestas. Lee el proximo parrafo antes de tocar el crontab.

QUIEN LEE HOY: el gateway (`hermes_cli.main gateway run`) es el consumidor del
token y anda. Telegram entrega cada update UNA sola vez, al que lo pida primero,
y le contesta `409 Conflict` al segundo que llame getUpdates sobre el mismo
token: no hay reparto ni cola, es una carrera. Con dos lectores vivos, un
"ok t_ab12cd34" cae en uno o en el otro segun quien llegue antes -- las
decisiones de Sergio se pierden A VECES, que es peor que perderse siempre,
porque asi el circuito parece andar.

POR QUE ESTE ARCHIVO DECIA LO CONTRARIO, y es la parte que importa: se escribio
el 2026-09-02 sobre esta medicion, que estaba mal hecha --

    crontab -l | grep -icE "getUpdates|telegram-in"   ->  1 (el watchdog de WhatsApp)

y de ahi concluyo "cero listeners de Telegram". El grep era correcto y la
conclusion falsa: el gateway NO es una linea de cron, es un proceso vivo, asi
que ningun grep del crontab lo puede ver. Se pregunto por el calendario cuando
habia que preguntar por el socket.

    ss -tnp | grep 149.154    ->  ESTAB ... users:(("hermes",pid=4063867))

Verificado el 2026-09-03 19:36 UTC: ese socket estaba abierto, la sesion
`agent:main:telegram:dm:6830070978` habia intercambiado mensajes hasta las
18:56, la tarea t_13eaa0ae nacio de un mensaje de Sergio y t_04baed70 se
desbloqueo a las 18:42:55 con su veredicto. El circuito de entrada nunca estuvo
muerto: estaba medido con el instrumento equivocado.

PARA QUE SIRVE ENTONCES: para el dia que el gateway no este. Se corre A MANO y
de a una vez, con el gateway detenido, y hace lo mismo sobre el MISMO tablero
que leen los loops (no inventa una segunda cola):

  ok <id> [nota]   -> desbloquea la tarea (el visto bueno)
  no <id> <razon>  -> la deja bloqueada y le pega la razon al cuerpo
  /tablero         -> devuelve el estado
  cualquier texto  -> tarea nueva, prioridad 1

`getUpdates` va con offset: Telegram entrega cada mensaje una vez y recien lo
descarta cuando pedimos el siguiente offset, asi que un fallo a mitad de camino
reintenta en la corrida siguiente en vez de perder el mensaje.
"""
import json
import os
import shutil
import subprocess
import urllib.error  # explicito: lo arrastra urllib.request, pero el 409 se atrapa por nombre
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


def publicar(tid):
    """Publica la pieza de la tarea, si la tarea trae una.

    POR QUE. Hasta el 2026-09-04 `ok <id>` corria `kanban unblock` y NADA mas: la
    tarea quedaba desbloqueada y la pieza se quedaba en el disco. Los loops
    incluso habian aprendido a pedirle a Sergio que publicara a mano desde el
    telefono. Resultado medido: 1.196 imagenes en 3 dias, 0 publicadas.

    Devuelve (estado, detalle) con estado en publicado | no-publicable | vencido
    | fallo. 'vencido' = la tarea esta archivada o cerrada y el publicador no
    ejecuto nada: es correcto, no un fallo.
    'no-publicable' es lo NORMAL: la mayoria de las tareas del tablero no son
    piezas, y para esas el mensaje de siempre esta bien.
    """
    ruta = os.environ.get("ONIA_PUBLICADOR", "/root/bin/onia-publicar-aprobado.mjs")
    if not os.path.exists(ruta):
        return ("fallo", "no existe el publicador " + ruta + " (lo despliega onia-loops-sync.sh)")
    node = shutil.which("node") or "/usr/bin/node"
    try:
        p = subprocess.run(
            [node, ruta, tid], capture_output=True, text=True, timeout=360,
            env=dict(os.environ, HOME="/root"),
        )
    except Exception as e:  # noqa: BLE001 - un fallo al publicar se CUENTA, no se traga
        return ("fallo", "no pude correr el publicador: " + str(e))
    if p.returncode == 2:
        return ("no-publicable", "")
    # 3 = la tarea esta cerrada/archivada, asi que el publicador NO ejecuto nada.
    # No es un fallo: es la respuesta correcta, y decirle "NO se publico" a secas
    # se lee como sistema roto. Se traduce a una linea que dice que apretar.
    if p.returncode == 3:
        detalle = (p.stdout or "").strip()
        try:
            d = json.loads(detalle)
            msg = d.get("motivo", "la tarea ya no esta viva")
            vivo = d.get("pedidoVivo")
            return ("vencido", msg + ((". El pedido vivo es " + str(vivo)) if vivo else ""))
        except Exception:  # noqa: BLE001 - si cambia el formato, se muestra crudo
            return ("vencido", detalle[:400] or "la tarea ya no esta viva")
    if p.returncode != 0:
        return ("fallo", (p.stderr or p.stdout or "sin detalle").strip())
    return ("publicado", (p.stdout or "").strip())


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

        # Desbloquear no es publicar. Si la tarea trae una pieza, sale AHORA.
        estado, detalle = publicar(tid)
        base = "✅ <b>" + escapar(tid) + "</b> desbloqueada"
        if estado == "publicado":
            return base + " y <b>PUBLICADA</b>\n<pre>" + escapar(detalle[:800]) + "</pre>"
        if estado == "vencido":
            return "⌛ <b>" + escapar(tid) + "</b> — no ejecute nada: " + escapar(detalle[:400])
        if estado == "fallo":
            # Un fallo al publicar NO se calla: sin esto Sergio ve el tilde verde
            # y da por publicada una pieza que nunca salio -- peor que no avisar.
            return (base + ", pero <b>NO se publico</b>\n<pre>" + escapar(detalle[:900]) + "</pre>")
        return base + "\n<pre>" + escapar(salida.strip()[:1200]) + "</pre>"

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


def gateway_vivo():
    """El PID del gateway de Hermes si esta corriendo, o None.

    `pgrep -f gateway` NO sirve: se encuentra a si mismo, porque el shell que
    corre el chequeo lleva ese texto en su propia linea de comando y contesta
    "si" cuando no hay nada. Se lista y se descarta el PID propio."""
    propio = {str(os.getpid()), str(os.getppid())}
    try:
        salida = subprocess.run(
            ["ps", "-eo", "pid=,args="], capture_output=True, text=True, timeout=20
        ).stdout
    except Exception:  # noqa: BLE001 - si no se puede mirar, no se bloquea el respaldo
        return None
    for linea in salida.splitlines():
        pid, _, args = linea.strip().partition(" ")
        if pid in propio or "grep" in args:
            continue
        if "hermes_cli.main" in args and "gateway" in args and "run" in args.split():
            return pid
    return None


def main():
    # La guarda va ANTES de pollear, y no alcanza con atrapar el 409.
    #
    # Medido el 2026-09-03 19:40 UTC, y es peor de lo que parecia: con el gateway
    # vivo y polleando, esta misma corrida NO dio 409 -- dio exit 0 y cero
    # mensajes. El gateway usa long-polling, asi que entre una vuelta y la
    # siguiente queda una ventana en la que el segundo lector ENTRA. O sea que la
    # carrera no se pierde siempre de forma ruidosa: a veces se gana, y ganarla
    # significa quedarse con un mensaje de Sergio y contestarlo con este parser de
    # `ok`/`no` en vez del agente completo del gateway.
    #
    # Un fallo intermitente que a veces "funciona" es el que nadie diagnostica.
    # Por eso se pregunta por el DUENO, no por el resultado de la llamada.
    duenio = gateway_vivo()
    if duenio and os.environ.get("ONIA_TG_ENTRADA_FORZAR") != "1":
        raise SystemExit(
            "El gateway de Hermes (PID " + duenio + ") ya esta leyendo este bot.\n"
            "No corro: dos lectores del mismo token se roban los mensajes entre si,\n"
            "y se los roban A VECES, que es como se pierde un 'ok t_...' sin que\n"
            "nada quede en rojo.\n"
            "Si el gateway esta caido y querés usar este respaldo a mano:\n"
            "    ONIA_TG_ENTRADA_FORZAR=1 " + os.path.basename(__file__)
        )

    offset = 0
    if os.path.exists(OFFSET_F):
        try:
            offset = int(open(OFFSET_F).read().strip() or 0)
        except ValueError:
            offset = 0

    try:
        res = api("getUpdates", offset=offset, timeout=0, allowed_updates='["message"]')
    except urllib.error.HTTPError as e:
        # 409 = otro proceso ya es dueno del token. Sin este brazo el script
        # muere con un traceback crudo de urllib, y si ademas alguien lo dejo
        # programado, muere asi en un log que nadie abre: el fallo mudo que ya
        # tuvo al loop `investigacion` muerto varios dias sin que nada avisara.
        if e.code != 409:
            raise
        raise SystemExit(
            "409 Conflict: el token de Telegram YA tiene dueno y no se comparte.\n"
            "Casi seguro es el gateway de Hermes, que es quien debe leer:\n"
            "    ss -tnp | grep 149.154\n"
            "    ps -eo pid,args | grep -F 'gateway run'\n"
            "Este script es de RESPALDO: se corre a mano y con el gateway detenido.\n"
            "Programarlo no suma un camino, parte el que ya existe."
        )
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

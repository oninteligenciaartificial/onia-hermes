#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Renueva los DOS horarios de demo que el bot le ofrece a un prospecto.

POR QUE EXISTE: el motor acepta `ONIA_BOT_SLOTS` con dos horarios FIJOS y fecha
absoluta ("viernes 14:00@2026-09-04T18:00:00Z"). Sirve para hoy y se pudre solo:
el lunes esos dos horarios ya pasaron y el bot le ofrece a un prospecto una fecha
del pasado — peor que no ofrecer nada, porque parece que funciona.

Sergio no dio dos horarios: dio VENTANAS semanales (2026-09-02):

    lunes a viernes  14:00-17:00 y 20:00-22:00
    sabado            09:00-15:00
    "que las reuniones se agenden un dia antes para tener el espacio y
     tiempo para cancelar"

Este script traduce esas ventanas a los dos proximos horarios concretos que las
cumplen, respetando las 24 h de anticipacion, y los escribe en webhook.env. Corre
por cron todos los dias: los horarios nunca quedan en el pasado y Sergio no tiene
que acordarse de nada.

Es la solucion sin Cal.com. Cuando Cal.com este cargado con estas mismas ventanas,
`resolveConfig()` lo prefiere solo (consulta Cal.com cuando NO hay ONIA_BOT_SLOTS),
y este script se apaga borrando su linea de cron.

Todo se calcula en hora de La Paz (UTC-4) y se escribe en UTC, que es lo que el
motor espera.
"""
import datetime as dt
import os
import re
import subprocess
import sys

ENV_FILE = os.environ.get("ONIA_WEBHOOK_ENV_FILE", "/opt/onia/bot/webhook.env")
TZ_LAPAZ = dt.timezone(dt.timedelta(hours=-4))
ANTICIPACION_H = 24          # "que se agenden un dia antes"
CUANTOS = 2                  # el guion ofrece exactamente A y B

# dia de la semana (lunes=0 ... domingo=6) -> lista de (hora_inicio, hora_fin)
VENTANAS = {
    0: [(14, 17), (20, 22)],
    1: [(14, 17), (20, 22)],
    2: [(14, 17), (20, 22)],
    3: [(14, 17), (20, 22)],
    4: [(14, 17), (20, 22)],
    5: [(9, 15)],
    # domingo (6) no trabaja: ausente a proposito, no es un olvido.
}

DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
         "agosto", "septiembre", "octubre", "noviembre", "diciembre"]


def proximos_slots(ahora_lapaz, cuantos=CUANTOS):
    """Los `cuantos` proximos inicios validos, en dias DISTINTOS.

    Dias distintos a proposito: ofrecerle a alguien "hoy 14:00 o hoy 14:30" no es
    darle una opcion, es darle la misma. Dos dias separados es una eleccion real.
    """
    desde = ahora_lapaz + dt.timedelta(hours=ANTICIPACION_H)
    slots, dias_usados = [], set()
    dia = desde.date()
    for _ in range(21):  # tres semanas de margen: suficiente para cualquier feriado
        if len(slots) >= cuantos:
            break
        for h_ini, h_fin in VENTANAS.get(dia.weekday(), []):
            if len(slots) >= cuantos or dia in dias_usados:
                break
            # Se ofrece el comienzo de la ventana; si ya pasó, la hora en punto siguiente
            # que todavía entre con la demo completa adentro.
            for hora in range(h_ini, h_fin):
                cand = dt.datetime(dia.year, dia.month, dia.day, hora, 0, tzinfo=TZ_LAPAZ)
                if cand >= desde:
                    slots.append(cand)
                    dias_usados.add(dia)
                    break
        dia += dt.timedelta(days=1)
    return slots


def etiqueta(d):
    return f"{DIAS[d.weekday()]} {d.day} de {MESES[d.month - 1]}, {d.hour:02d}:{d.minute:02d}"


def a_env(slots):
    partes = []
    for d in slots:
        utc = d.astimezone(dt.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        partes.append(f"{etiqueta(d)}@{utc}")
    return "|".join(partes)


def escribir_env(valor):
    """Reemplaza (o agrega) ONIA_BOT_SLOTS sin tocar el resto del archivo."""
    linea = f'ONIA_BOT_SLOTS="{valor}"'
    try:
        with open(ENV_FILE, encoding="utf-8") as fh:
            cuerpo = fh.read()
    except FileNotFoundError:
        print(f"FALLO: no existe {ENV_FILE}", file=sys.stderr)
        return False

    if re.search(r"(?m)^\s*ONIA_BOT_SLOTS=.*$", cuerpo):
        nuevo = re.sub(r"(?m)^\s*ONIA_BOT_SLOTS=.*$", linea, cuerpo)
    else:
        nuevo = cuerpo.rstrip("\n") + "\n\n# Renovado por onia-renovar-slots.py — NO editar a mano.\n" + linea + "\n"

    if nuevo == cuerpo:
        return False  # ya estaba igual: no se reinicia el bot al pedo
    tmp = ENV_FILE + ".nuevo"
    with open(tmp, "w", encoding="utf-8") as fh:
        fh.write(nuevo)
    os.chmod(tmp, 0o600)          # trae secretos: mismos permisos que el original
    os.replace(tmp, ENV_FILE)     # atomico
    return True


def main():
    ahora = dt.datetime.now(TZ_LAPAZ)
    slots = proximos_slots(ahora)
    if len(slots) < CUANTOS:
        print("FALLO: no encontre dos horarios validos en tres semanas", file=sys.stderr)
        return 2

    valor = a_env(slots)
    print(f"ahora (La Paz): {ahora:%Y-%m-%d %H:%M} ({DIAS[ahora.weekday()]})")
    for d in slots:
        print(f"  -> {etiqueta(d)}  =  {d.astimezone(dt.timezone.utc):%Y-%m-%dT%H:%M:%SZ}")

    if not escribir_env(valor):
        print("sin cambios (los horarios ya eran estos)")
        return 0

    print("webhook.env actualizado; reinicio el bot para que lo tome")
    r = subprocess.run(["/opt/onia/bot/webhook-server.sh", "restart"],
                       capture_output=True, text=True, timeout=180)
    salida = (r.stdout or "") + (r.stderr or "")
    print(salida[-600:])
    # El aviso sale SOLO cuando los horarios cambiaron de verdad: un mensaje diario
    # que siempre dice lo mismo deja de leerse a la semana.
    if '"ok":true' in salida:
        texto = "🗓 <b>Horarios de demo renovados</b>\n" + "\n".join("• " + etiqueta(d) for d in slots)
        subprocess.run(["/root/bin/onia-tg.sh", texto], capture_output=True, timeout=30)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

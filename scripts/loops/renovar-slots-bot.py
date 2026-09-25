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

⚠️ La anticipacion se mide cuando el prospecto LEE el horario, no cuando se
calcula. El valor se escribe una vez al dia y se sirve las 24 h siguientes, asi
que el margen se gasta solo mientras esta publicado: con `ahora + 24 h` el
primero del dia recibia 24 h de aviso y el ultimo, CERO. Medido el 2026-09-05 a
las 04:03 — el bot vivo ofrecia "sábado 5 de septiembre, 09:00", a 4 h 57 min.
Lo que se garantiza es el PEOR momento de la ventana, no el mejor.

Eso se resolvia sumandole al piso la vigencia entera (48 h), y el costo lo pagaba
la venta: el 2026-09-17 09:15 La Paz el bot ofrecia "sábado 19" teniendo libre el
viernes 18 a las 14:00, con 28 h de aviso. Desde entonces la garantia se sostiene
por el otro lado — se generan CUANTOS candidatos y el motor elige los 2 que siguen
en pie —, asi que el peor momento queda igual de cubierto sin alejarle el turno a
nadie. El piso volvio a ser ANTICIPACION_H a secas.

Lo que si depende de la vigencia es QUE HORA del dia se elige, y no es lo mismo: el
piso decide desde cuando, la vigencia decide cual de las horas que pasan el piso
sobrevive hasta el final de lo publicado. Como va UN candidato por dia, elegir la mas
temprana —que es la primera en caerse— hace que al caer se pierda el DIA ENTERO. Ver
`_hora_del_dia`, con el caso de produccion del 2026-09-18 que lo midio.

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
VIGENCIA_H = 24              # cuanto se SIRVE lo que se escribe: el periodo del cron
# El guion ofrece exactamente A y B, pero se ESCRIBEN de mas: `parseSlotsSpec` (config.mjs)
# elige los 2 que todavia se sostienen, asi que los de adelante se caen solos y siempre
# quedan dos enteros — ahora el bot aguanta que este cron no corra en varios dias, que antes
# lo dejaba mudo. Es seguro con el motor VIEJO tambien: ese corta los 2 primeros, que son
# los mismos de siempre. El piso es lo unico que espera al deploy del motor (ver `desde`).
CUANTOS = 5

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
    # El piso SUMA la vigencia: lo que se escribe se sirve `VIGENCIA_H` sin volver a
    # calcularse, asi que garantizar `ANTICIPACION_H` en el peor momento —el instante
    # justo antes de la renovacion siguiente— cuesta reservar ese margen aca.
    #
    # ⚠️ El 2026-09-18 esto se bajo a `ANTICIPACION_H` a secas, porque el 17-sep el
    # motor paso a elegir los 2 que SE SOSTIENEN (`parseSlotsSpec`) y el margen
    # parecia cobrarse sin comprar nada. La premisa se dio por verificada asi:
    #
    #     docker exec onia-center grep -c "SE SOSTIENEN" /tmp/onia-bot/config.mjs  -> 1
    #
    # que es un `grep` usado para CONFIRMAR, y confirmo el archivo equivocado. El
    # camino caliente es `/tmp/onia-bot/run-turn.mjs`: arma `overrides.slots` con un
    # `parseEnvSlots()` propio —`slice(0, 2)` y `pending: false` fijo— y NUNCA llama a
    # `parseSlotsSpec`. El filtro existia en un modulo que ese camino no toca, asi que
    # el consumidor vivo siguio tomando los dos primeros CRUDOS.
    #
    # Lo que costo, medido el 2026-09-25 05:55 La Paz sobre el proceso vivo
    # (`anticipacion-viva.mjs`, que EJECUTA buildConfig dentro del contenedor):
    #
    #     lo que OFRECE el contenedor: viernes 25 de septiembre, 21:00 — 15.3 h · ...
    #     VEREDICTO: roto — 1 horario(s) a menos de 24 h; un prospecto no llega a cancelar
    #
    # o sea la opcion A que leia un desconocido era un turno a 15 h vista, justo lo que
    # la regla de Sergio Urcullo («que se agenden un dia antes para tener espacio y
    # tiempo para cancelar») existe para impedir.
    #
    # LO QUE CUESTA EL MARGEN, dicho de frente: el dia mas cercano se cae de la lista.
    # Un viernes 06:23 el par pasa de "sábado 26 · lunes 28" a "lunes 28 · martes 29",
    # y la coletilla del propio mensaje sigue prometiendo "sáb 9:00-15:00". Es caro y
    # se paga igual: ofrecer un horario que el prospecto no llega a cancelar es peor
    # que ofrecerle el dia siguiente.
    #
    # VENCE —y se vuelve a `ANTICIPACION_H` a secas— cuando el consumidor vivo filtre
    # de verdad. La condicion NO es un grep: es que
    #
    #     node hermes-content/deploy/vps-ops/bot/anticipacion-viva.mjs
    #
    # salga VEREDICTO ok y SIN `divergencia` (ese instrumento ejecuta el armador del
    # contenedor y compara su par contra el de la rama). Hoy sale rojo y dice
    # "FALTA DESPLEGAR el bot": el deploy espera el `ok` de Sergio Urcullo.
    desde = ahora_lapaz + dt.timedelta(hours=ANTICIPACION_H + VIGENCIA_H)
    hasta_el_final = desde + dt.timedelta(hours=VIGENCIA_H)
    slots = []
    dia = desde.date()
    for _ in range(21):  # tres semanas de margen: suficiente para cualquier feriado
        if len(slots) >= cuantos:
            break
        cand = _hora_del_dia(dia, desde, hasta_el_final)
        if cand is not None:
            slots.append(cand)
        dia += dt.timedelta(days=1)
    return slots


def _hora_del_dia(dia, desde, hasta_el_final):
    """El horario de ese dia que el motor va a poder ofrecer durante MAS tiempo.

    Como se manda UN candidato por dia, la hora elegida decide cuanto vive el DIA en
    la oferta, y la mas temprana es tambien la primera en caerse: cuando se cae no se
    pierde un horario, se pierde el dia entero y el prospecto salta al dia habil
    siguiente. Medido en produccion el 2026-09-18 11:13 La Paz — este cron, a las
    06:23, habia escrito "sábado 19, 11:00" (28,6 h de aviso, correcto al generarse);
    cinco horas despues ya no llegaba a 24 h, el motor lo descartaba y el bot le
    ofrecia LUNES 21 a quien escribia ese viernes, con el sabado 19 a las 12:00, 13:00
    y 14:00 libres y con "sáb 9:00-15:00" prometido en la coletilla del MISMO mensaje.

    Asi que se elige por VIDA UTIL, en dos pasos:
      1. la hora mas TEMPRANA que aguanta toda la vigencia. Para los dias lejanos eso
         es el comienzo de la ventana: no les cambia nada.
      2. si ninguna aguanta —solo le pasa al dia mas cercano, el que cruza el borde de
         la anticipacion—, la mas TARDIA que todavia entra, que es la que mantiene el
         dia ofrecible mas horas.
    El paso 2 mueve el horario dentro del dia (el sabado pasa de 11:00 a 14:00) y eso
    es barato; perder el dia cuesta el salto al siguiente, que ese viernes eran DOS.
    """
    tardio = None
    for h_ini, h_fin in VENTANAS.get(dia.weekday(), []):
        # `h_fin` queda afuera a proposito: la hora en punto elegida tiene que entrar
        # con la demo completa adentro de la ventana.
        for hora in range(h_ini, h_fin):
            cand = dt.datetime(dia.year, dia.month, dia.day, hora, 0, tzinfo=TZ_LAPAZ)
            if cand < desde:
                continue  # el motor no lo ofreceria
            if cand >= hasta_el_final:
                return cand  # aguanta toda la vigencia
            tardio = cand  # todavia no: me quedo con el ultimo que entre
    return tardio


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

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Gate de los horarios de demo que el bot le OFRECE a un prospecto.

POR QUE EXISTE, y por que el gate mira el peor momento y no el mejor:

El 2026-09-05 a las 04:03 (La Paz) el bot vivo ofrecia "sábado 5 de septiembre,
09:00" — ese mismo dia, dentro de 4 h 57 min. La regla de Sergio (2026-09-02) es
"que las reuniones se agenden un dia antes para tener el espacio y tiempo para
cancelar", y el script decia cumplirla: `desde = ahora + ANTICIPACION_H`.

Lo cumplia AL GENERAR y dejaba de cumplirlo al servir. El valor se escribe una vez
por dia (cron 10:23 UTC) y se sirve las 24 h siguientes, asi que la anticipacion
REAL no es la del momento del calculo: es esa menos lo que el valor lleva
publicado. Con 24 h de calculo y 24 h de vigencia, el ultimo prospecto del dia
recibia una anticipacion de CERO.

Por eso el gate no evalua `proximos_slots(ahora)` en el instante en que corre —
ahi todo defecto de esta familia da verde. Evalua el horario contra el FINAL de su
ventana de vigencia, que es el unico momento en que el sistema puede mentir.
"""
import datetime as dt
import importlib.util
import pathlib
import sys
import unittest

_RUTA = pathlib.Path(__file__).with_name("renovar-slots-bot.py")
_spec = importlib.util.spec_from_file_location("renovar_slots_bot", _RUTA)
renovar = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(renovar)


class AnticipacionRealTest(unittest.TestCase):
    """La anticipacion se mide cuando el prospecto LEE el horario, no cuando se calcula."""

    # QUE OFRECE EL BOT, que NO es lo que este script genera. El motor recorta
    # DESPUES de juzgar: `parseSlotsSpec` (config.mjs) marca `pending` a todo
    # candidato que no llegue a `ANTICIPACION_MINIMA_MS` y recien ahi toma 2
    # (`candidatos.filter((slot) => !slot.pending).slice(0, 2)`). Verificado vivo el
    # 2026-09-18 en /tmp/onia-bot/config.mjs:79, que es la condicion de vencimiento
    # que el generador dejo escrita.
    #
    # Por eso la propiedad que le importa al prospecto no es "ningun candidato baja
    # de 24 h" —esa era la del motor VIEJO, que cortaba los 2 primeros a ciegas— sino
    # "en el peor momento todavia QUEDAN DOS por encima de las 24 h". Los de adelante
    # se caen solos y el guion sigue teniendo su A y su B enteros.
    #
    # La diferencia no es academica: sostener la garantia con margen del generador le
    # costaba a la venta un dia entero. Medido el 2026-09-18 (viernes) en el proceso
    # vivo, `ONIA_BOT_SLOTS` arrancaba en "lunes 21" con el sabado 19 libre — tres
    # dias de espera para quien escribia ese viernes, y encima el mismo mensaje
    # promete "sáb 9:00-15:00" en su coletilla de fuera de horario.
    def _cuantos_se_sostienen(self, ahora):
        """Los horarios que el motor todavia ofreceria en el PEOR momento.

        El peor caso es el instante justo antes de la proxima renovacion: el valor
        lleva `VIGENCIA_H` publicado y no se movio.
        """
        slots = renovar.proximos_slots(ahora)
        self.assertEqual(len(slots), renovar.CUANTOS, f"faltaron horarios para {ahora}")
        fin_de_vigencia = ahora + dt.timedelta(hours=renovar.VIGENCIA_H)
        return [
            s
            for s in slots
            if (s - fin_de_vigencia).total_seconds() / 3600 >= renovar.ANTICIPACION_H
        ]

    def test_el_guion_sigue_teniendo_sus_dos_horarios_con_24h_de_aviso(self):
        # Una semana entera, hora por hora: cubre el sabado (ventana 09-15), el
        # domingo (sin ventanas) y el salto de fin de semana, que es donde el
        # calendario se deforma y un off-by-one se esconde.
        arranque = dt.datetime(2026, 9, 1, 0, 0, tzinfo=renovar.TZ_LAPAZ)
        for h in range(7 * 24):
            ahora = arranque + dt.timedelta(hours=h)
            with self.subTest(ahora=ahora.isoformat()):
                self.assertGreaterEqual(
                    len(self._cuantos_se_sostienen(ahora)),
                    2,
                    "el guion ofrece A y B: al ultimo prospecto del dia le queda menos "
                    "de un par por encima del aviso que pidio Sergio Urcullo",
                )

    def test_el_generador_solo_tampoco_escribe_un_horario_a_minutos_vista(self):
        """La garantia no puede quedar SOLO del lado del motor.

        Al pasar la propiedad de arriba a "quedan dos sostenibles", el piso del
        generador se volvio invisible para el gate: mutando `desde` a `ahora + 0`
        los cuatro casos seguian VERDE, porque el motor descarta los caducados y
        siempre quedaban dos mas adelante. Visible-correcto, y sin embargo el
        productor habria vuelto a escribir "hoy 14:00" a minutos vista.

        Importa porque los dos lados viajan al VPS por caminos DISTINTOS: a este
        script lo copia scripts/loops/sincronizar.sh (cron 44, desde origin/main) y
        al motor hay que desplegarlo aparte. El dia que /tmp/onia-bot/config.mjs
        vuelva a una version sin el filtro —un deploy revertido, un rsync viejo— el
        unico que queda protegiendo al prospecto es este piso.
        """
        arranque = dt.datetime(2026, 9, 1, 0, 0, tzinfo=renovar.TZ_LAPAZ)
        for h in range(7 * 24):
            ahora = arranque + dt.timedelta(hours=h)
            with self.subTest(ahora=ahora.isoformat()):
                for s in renovar.proximos_slots(ahora):
                    aviso_h = (s - ahora).total_seconds() / 3600
                    self.assertGreaterEqual(
                        aviso_h, renovar.ANTICIPACION_H,
                        f"escribio un horario a {aviso_h:.1f} h de su propio calculo",
                    )

    def test_ningun_horario_publicado_baja_de_24h_en_todo_su_vigencia(self):
        """El par lo elige un consumidor que NO filtra: toma los dos primeros crudos.

        Medido el 2026-09-25 05:55 La Paz contra el proceso vivo (`/proc/30/environ`
        en el contenedor `onia-center`), con el armador que de verdad corre:

            ONIA_BOT_SLOTS=viernes 25 de septiembre, 21:00@... | sábado 26 ... | ...
            lo que OFRECE el contenedor: viernes 25 de septiembre, 21:00 (15.3 h) · ...
            lo que elegiria la rama:     sábado 26 de septiembre, 09:00 · lunes 28 ...

        O sea: la opcion **A** que un desconocido lee es un turno a 15 h vista, el que
        la regla de Sergio Urcullo («que se agenden un dia antes para tener espacio y
        tiempo para cancelar») existe para impedir.

        Por que el gate no lo veia. Las dos propiedades de arriba se apoyan en que el
        motor descarta los caducados ANTES de recortar (`parseSlotsSpec`), y esa
        premisa se dio por verificada el 2026-09-18 con

            docker exec onia-center grep -c "SE SOSTIENEN" /tmp/onia-bot/config.mjs -> 1

        que es un `grep` usado para CONFIRMAR. Confirmo el archivo equivocado: el
        camino caliente es `/tmp/onia-bot/run-turn.mjs`, que arma `overrides.slots`
        con un `parseEnvSlots()` propio —`slice(0, 2)` y `pending: false` fijo— y
        **nunca llama a `parseSlotsSpec`**. El filtro estaba desplegado en un modulo
        que ese camino no toca.

        Asi que mientras el consumidor vivo no filtre, la unica propiedad que protege
        al prospecto es la fuerte: **todos** los horarios publicados aguantan las 24 h
        durante toda su vigencia, no solo los dos que sobrevivan. Vence el dia que
        `anticipacion-viva.mjs` salga verde y sin `divergencia` —ese instrumento
        EJECUTA `buildConfig` dentro del contenedor, no lo greppea— y no antes.
        """
        arranque = dt.datetime(2026, 9, 1, 0, 0, tzinfo=renovar.TZ_LAPAZ)
        for h in range(7 * 24):
            ahora = arranque + dt.timedelta(hours=h)
            # El peor momento: el valor lleva toda su vigencia publicado y no se movio.
            lee = ahora + dt.timedelta(hours=renovar.VIGENCIA_H)
            with self.subTest(ahora=ahora.isoformat()):
                for s in renovar.proximos_slots(ahora):
                    aviso_h = (s - lee).total_seconds() / 3600
                    self.assertGreaterEqual(
                        aviso_h, renovar.ANTICIPACION_H,
                        f"publico {renovar.etiqueta(s)}, que al final de su vigencia "
                        f"le llega al prospecto con {aviso_h:.1f} h de aviso",
                    )

    def test_el_caso_medido_en_produccion(self):
        # Reproduce el defecto exacto: el cron del 4-sep 06:23 publico "sábado 5,
        # 09:00" y a las 04:03 del 5-sep seguia ofreciendolo, a 4 h 57 min vista.
        #
        # Se mide sobre el PRIMERO QUE SE SOSTIENE, no sobre `slots[0]`: ese indice
        # era el primero que el prospecto veia con el motor viejo, y hoy es el que el
        # motor descarta. Pedirle 24 h a un candidato que ya nadie ve deja el gate
        # afirmando el margen del generador en vez de la promesa del bot.
        genera = dt.datetime(2026, 9, 4, 6, 23, tzinfo=renovar.TZ_LAPAZ)
        lee = dt.datetime(2026, 9, 5, 4, 3, tzinfo=renovar.TZ_LAPAZ)
        ofrecidos = [
            s
            for s in renovar.proximos_slots(genera)
            if (s - lee).total_seconds() / 3600 >= renovar.ANTICIPACION_H
        ]
        self.assertGreaterEqual(
            len(ofrecidos), 2,
            "el prospecto de las 04:03 se quedaria sin un par de horarios con aviso",
        )
        aviso_h = (ofrecidos[0] - lee).total_seconds() / 3600
        self.assertGreaterEqual(
            aviso_h, renovar.ANTICIPACION_H,
            f"el prospecto de las 04:03 recibiria {aviso_h:.1f} h de aviso",
        )

    def test_el_dia_mas_cercano_no_se_pierde_a_mitad_de_la_vigencia(self):
        """Se manda UN candidato por dia: la hora elegida decide cuanto vive el DIA.

        La mas temprana del dia es tambien la primera en caerse, y cuando se cae no se
        pierde un horario: se pierde el dia entero y el prospecto salta al dia habil
        siguiente. Medido en produccion el 2026-09-18 11:13 La Paz — el cron de las
        06:23 habia escrito "sábado 19, 11:00" (28,6 h de aviso, correcto al generarse)
        y cinco horas despues ya no llegaba a 24 h: el bot le ofrecia LUNES 21 a quien
        escribia ese viernes, con el sabado 19 a las 12:00, 13:00 y 14:00 libres, y
        prometiendole "sáb 9:00-15:00" en la coletilla del MISMO mensaje.

        La propiedad se afirma contra las VENTANAS de Sergio Urcullo, no contra lo que
        el generador devuelve: si hay un dia ofrecible mas temprano que el primero que
        se ofrece, es un dia regalado.

        ⚠️ **Corregido el 2026-09-25: el dia de referencia se deriva del momento de
        GENERAR, no del de leer.** Hasta hoy se derivaba de `lee` con el piso de 24 h,
        y eso exigia ofrecer el dia mas cercano aunque cayera por debajo de las 24 h a
        mitad de la vigencia — una exigencia que solo es sana si el consumidor vivo
        descarta los caducados antes de recortar. No los descarta: `run-turn.mjs` de
        `/tmp/onia-bot` toma los dos primeros CRUDOS (ver el test hermano
        `test_ningun_horario_publicado_baja_de_24h_en_todo_su_vigencia`), asi que ese
        dia "no regalado" llegaba al prospecto con 15 h de aviso. Lo que se sigue
        exigiendo es que no se regale un dia que SI se podia sostener entero.
        """
        arranque = dt.datetime(2026, 9, 1, 6, 23, tzinfo=renovar.TZ_LAPAZ)
        for dia in range(7):
            genera = arranque + dt.timedelta(days=dia)
            slots = renovar.proximos_slots(genera)
            sostenible = self._primer_dia_sostenible(genera)
            # A lo largo de la VIGENCIA: lo escrito se sirve hasta la corrida siguiente.
            for h in range(0, renovar.VIGENCIA_H):
                lee = genera + dt.timedelta(hours=h)
                with self.subTest(genera=genera.isoformat(), lee=lee.isoformat()):
                    ofrecidos = [
                        s for s in slots
                        if (s - lee).total_seconds() / 3600 >= renovar.ANTICIPACION_H
                    ]
                    self.assertTrue(ofrecidos, "no le ofrece ningun horario")
                    self.assertEqual(
                        ofrecidos[0].date(), sostenible,
                        f"ofrece {renovar.etiqueta(ofrecidos[0])} teniendo libre "
                        f"—y sostenible toda la vigencia— el {sostenible}",
                    )

    def _primer_dia_sostenible(self, genera):
        """El primer dia con ALGUNA hora que aguante toda la vigencia, de las VENTANAS."""
        desde = genera + dt.timedelta(hours=renovar.ANTICIPACION_H + renovar.VIGENCIA_H)
        dia = desde.date()
        for _ in range(21):
            for h_ini, h_fin in renovar.VENTANAS.get(dia.weekday(), []):
                for hora in range(h_ini, h_fin):
                    cand = dt.datetime(dia.year, dia.month, dia.day, hora, 0,
                                       tzinfo=renovar.TZ_LAPAZ)
                    if cand >= desde:
                        return dia
            dia += dt.timedelta(days=1)
        raise AssertionError("no hay ningun dia ofrecible en tres semanas")

    def test_nunca_ofrece_domingo_ni_fuera_de_ventana(self):
        """La correccion no puede ganar anticipacion saliendose de las ventanas."""
        arranque = dt.datetime(2026, 9, 1, 0, 0, tzinfo=renovar.TZ_LAPAZ)
        for h in range(7 * 24):
            ahora = arranque + dt.timedelta(hours=h)
            for s in renovar.proximos_slots(ahora):
                ventanas = renovar.VENTANAS.get(s.weekday())
                self.assertIsNotNone(ventanas, f"{renovar.etiqueta(s)} cae en dia sin ventana")
                self.assertTrue(
                    any(ini <= s.hour < fin for ini, fin in ventanas),
                    f"{renovar.etiqueta(s)} cae fuera de las ventanas de Sergio",
                )

    def test_los_dos_horarios_son_de_dias_distintos(self):
        """Dos opciones el mismo dia no son una eleccion (lo dice proximos_slots)."""
        arranque = dt.datetime(2026, 9, 1, 0, 0, tzinfo=renovar.TZ_LAPAZ)
        for h in range(7 * 24):
            slots = renovar.proximos_slots(arranque + dt.timedelta(hours=h))
            self.assertEqual(len({s.date() for s in slots}), len(slots))


if __name__ == "__main__":
    unittest.main(verbosity=2 if "-v" in sys.argv else 1)

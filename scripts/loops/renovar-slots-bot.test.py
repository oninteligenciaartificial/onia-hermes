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

    def _peor_anticipacion(self, ahora):
        """Horas de aviso que recibe el ULTIMO prospecto que ve estos horarios.

        El peor caso es el instante justo antes de la proxima renovacion: el
        horario lleva `VIGENCIA_H` publicado y no se movio.
        """
        slots = renovar.proximos_slots(ahora)
        self.assertEqual(len(slots), renovar.CUANTOS, f"faltaron horarios para {ahora}")
        fin_de_vigencia = ahora + dt.timedelta(hours=renovar.VIGENCIA_H)
        return min((s - fin_de_vigencia).total_seconds() / 3600 for s in slots)

    def test_ningun_horario_baja_de_24h_de_aviso_mientras_esta_publicado(self):
        # Una semana entera, hora por hora: cubre el sabado (ventana 09-15), el
        # domingo (sin ventanas) y el salto de fin de semana, que es donde el
        # calendario se deforma y un off-by-one se esconde.
        arranque = dt.datetime(2026, 9, 1, 0, 0, tzinfo=renovar.TZ_LAPAZ)
        for h in range(7 * 24):
            ahora = arranque + dt.timedelta(hours=h)
            with self.subTest(ahora=ahora.isoformat()):
                self.assertGreaterEqual(
                    self._peor_anticipacion(ahora),
                    renovar.ANTICIPACION_H,
                    "un prospecto recibiria menos aviso del que Sergio pidio",
                )

    def test_el_caso_medido_en_produccion(self):
        # Reproduce el defecto exacto: el cron del 4-sep 06:23 publico "sábado 5,
        # 09:00" y a las 04:03 del 5-sep seguia ofreciendolo, a 4 h 57 min vista.
        genera = dt.datetime(2026, 9, 4, 6, 23, tzinfo=renovar.TZ_LAPAZ)
        lee = dt.datetime(2026, 9, 5, 4, 3, tzinfo=renovar.TZ_LAPAZ)
        primero = renovar.proximos_slots(genera)[0]
        aviso_h = (primero - lee).total_seconds() / 3600
        self.assertGreaterEqual(
            aviso_h, renovar.ANTICIPACION_H,
            f"el prospecto de las 04:03 recibiria {aviso_h:.1f} h de aviso",
        )

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

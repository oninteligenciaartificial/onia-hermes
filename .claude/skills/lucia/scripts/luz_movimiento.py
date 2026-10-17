#!/usr/bin/env python3
"""Mide luz y movimiento de uno o más clips con ffmpeg (signalstats). 0 créditos, cómputo local.

Uso: python3 luz_movimiento.py clip1.mp4 [clip2.mp4 ...]

Por clip imprime: tamaño, cuadros, luma (YAVG) del primer y último cuadro y su diferencia, crominancia
U/V del primero y el último, y el movimiento medio (YDIF, diferencia de luma entre cuadros consecutivos).

LÍMITE (11-oct-2026): son promedios del cuadro entero. Mezclan la luz con lo que entra o sale del plano
cuando la cámara se mueve o el motor reencuadra. Miden «cuánto cambia la imagen», no la luz aislada.
"""
import json
import re
import subprocess
import sys


def medir(ruta):
    sonda = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
         "-of", "json", ruta], capture_output=True, text=True, check=True).stdout
    v = json.loads(sonda)["streams"][0]
    r = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", ruta, "-vf", "signalstats,metadata=print:file=-", "-an", "-f", "null", "-"],
        capture_output=True, text=True, check=True).stdout

    def serie(clave):
        return [float(x) for x in re.findall(rf"lavfi\.signalstats\.{clave}=([\d.]+)", r)]

    y, u, vv, d = serie("YAVG"), serie("UAVG"), serie("VAVG"), serie("YDIF")
    if not y or not d:
        raise SystemExit(f"{ruta}: ffmpeg no devolvió estadísticas")
    return (f"{ruta}: {v['width']}x{v['height']} {len(y)} cuadros | luma ini {y[0]:.1f} fin {y[-1]:.1f} "
            f"(Δ{y[-1]-y[0]:+.1f}) | U ini {u[0]:.1f} fin {u[-1]:.1f} | V ini {vv[0]:.1f} fin {vv[-1]:.1f} | "
            f"mov medio {sum(d)/len(d):.2f} máx {max(d):.2f}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    for ruta in sys.argv[1:]:
        print(medir(ruta))

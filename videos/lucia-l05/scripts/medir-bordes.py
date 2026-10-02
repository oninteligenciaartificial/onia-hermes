#!/usr/bin/env python3
"""Salto de luminancia de 1 px en los bordes de la sombra (viejos y nuevos), final nuevo vs final viejo.
Oscurecimiento D = Y(crudo escalado) − Y(final); un borde duro es un salto grande de D entre dos filas.
Uso (desde P): python3 scripts/medir-bordes.py <final.mp4> [<final_viejo.mp4>]"""
import json, subprocess, sys
import numpy as np
RAW = "raw/l05-coworking-kling-07b938b2.mp4"

def y_frame(path, n):
    vf = f"select=eq(n\\,{n}),scale=1080:1920:flags=lanczos:in_color_matrix=bt709:in_range=tv:out_range=pc,format=gray"
    b = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-vf", vf, "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True).stdout
    return np.frombuffer(b, np.uint8).reshape(1920, 1080).astype(float)

CASOS = [(24, "tarjeta 1", [1133, 1223]), (72, "tarjeta 2", [1028, 1118]), (120, "tarjeta 3", [1028, 1118]), (24, "rótulo IA", [816, 840])]
# ventana del peor salto: ±12 filas, salvo el borde nuevo del rótulo (840), que a 10 px tiene el borde de la tarjeta 1 (850)
VENT = {840: (800, 846)}
res = {}
for path in sys.argv[1:]:
    out = []
    for f, que, ys in CASOS:
        fin, base = y_frame(path, f), y_frame(RAW, f)
        for y in ys:
            row = {"cuadro": f, "que": que, "y": y}
            for x in (300, 600, 850):
                d = base[:, x - 3:x + 4].mean(1) - fin[:, x - 3:x + 4].mean(1)  # oscurecimiento (7 columnas)
                row[f"x{x}"] = round(float(d[y - 1] - d[y]), 1)  # salto de oscurecimiento al cruzar la fila y
            # el peor salto en la ventana alrededor (por si el borde cae 1 px corrido)
            a, b = VENT.get(y, (y - 12, y + 13))
            dd = (base - fin)[a:b, 250:900].mean(1)
            row["peor_salto_ventana"] = round(float(np.abs(np.diff(dd)).max()), 1)
            out.append(row)
    res[path] = out
print(json.dumps(res, ensure_ascii=False, indent=1))

# ---- bordes VERTICALES (lados del PNG viejo): salto horizontal de D al cruzar la columna x, filas al costado del cuerpo
LADOS = [(24, "tarjeta 1", [90, 990], (900, 1090)), (72, "tarjeta 2", [160, 921], (870, 985)), (120, "tarjeta 3", [128, 952], (870, 985))]
lat = {}
for path in sys.argv[1:]:
    out = []
    for f, que, xs, (y0, y1) in LADOS:
        fin, base = y_frame(path, f), y_frame(RAW, f)
        d = (base - fin)[y0:y1].mean(0)
        for x in xs:
            out.append({"cuadro": f, "que": que, "x": x, "salto": round(float(d[x - 1] - d[x]), 1),
                        "peor_salto_±8": round(float(np.abs(np.diff(d[x - 8:x + 9])).max()), 1)})
    lat[path] = out
print(json.dumps(lat, ensure_ascii=False, indent=1), file=sys.stderr)

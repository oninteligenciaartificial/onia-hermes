# Cuenta palabras y segundos estimados (3,2 palabras/segundo + pausas) de cada guion. Ejecutar: python contar_palabras.py
import re, sys
sys.path.insert(0, '.')
from textos_guiones import BASE
def n(t): return len(re.findall(r"[\wáéíóúñüÁÉÍÓÚÑÜ]+(?:[.,]\d+)?", t))
for k, base in [("S1","S1"),("S2","S2"),("S3","S3"),("S4","S4"),("S5","S5"),("S6","S6"),("S7","S7")]:
    outs = [(base, n(BASE[base]))]
    for suf in ("A","B"):
        key = base + suf
        if key in BASE: outs.append((key, n(BASE[base] + " " + BASE[key])))
    for key, w in outs:
        print(f"{key}: {w} palabras -> voz {w/3.2:.0f} s; con pausas {w/3.2+2:.0f}-{w/3.2+4:.0f} s")

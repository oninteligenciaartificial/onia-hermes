"""Verifica afirmaciones del paquete tras la correccion H1-H7. Ejecutar: python verificar_material.py
No es un ensayo con personas ni una ejecucion de un LLM externo: son comprobaciones de texto y de numeros."""
import re
import sys

sys.path.insert(0, '.')
from textos_guiones import BASE

W = open('../WORKSHOP-MATERIAL.md', encoding='utf-8').read()
G = open('../GUIONES-SEMANA.md', encoding='utf-8').read()
M = open('../META-ADS-ESTUDIO-APLICADO.md', encoding='utf-8').read()
E = open('../ENTREGA.md', encoding='utf-8').read()


def n(t):
    return len(re.findall(r"[\wáéíóúñüÁÉÍÓÚÑÜ]+(?:[.,]\d+)?", t))


fallos = []


def check(cond, msg):
    if not cond:
        fallos.append(msg)


# 1. Apertura (palabras)
ap = W.split('## 3. Apertura')[1].split('## 4.')[0]
txt = " ".join(l[1:].strip() for l in ap.splitlines() if l.startswith('>'))
print("Apertura:", n(txt), "palabras ->", round(n(txt) / 3.2), "s de voz estimados")

# 2. Los 13 textos hablados estan literalmente en GUIONES-SEMANA.md
ausentes = [k for k, t in BASE.items() if t not in G]
check(not ausentes, f"textos ausentes en GUIONES-SEMANA.md: {ausentes}")

# 3. H6: palabras de los cierres y duracion estimada (3,2 palabras/s) declaradas en el documento
cierres = {"S1A": (29, 9), "S1B": (14, 4), "S3A": (16, 5), "S3B": (10, 3), "S5A": (17, 5), "S5B": (10, 3)}
for k, (pal, seg) in cierres.items():
    check(n(BASE[k]) == pal, f"{k}: {n(BASE[k])} palabras, se declaraban {pal}")
    check(abs(n(BASE[k]) / 3.2 - seg) < 1, f"{k}: {n(BASE[k]) / 3.2:.1f} s, se declaraban ~{seg}")
check("29 palabras, unos 9 s" in G and "16 palabras, unos 5 s" in G and "17 palabras, unos 5 s" in G, "tablas de cierre sin la duracion corregida")
check("Cierre ~4 s" not in G and "cierre de unos 4 s" not in G, "queda un cierre de 4 s fijo")
# H6: un solo CTA el domingo (el texto termina en su unica accion y no hay opcion de cierre comercial)
check("se puede agregar la frase de cierre A" not in G, "el domingo aun permite un segundo cierre")
check(BASE["S2"].rstrip().endswith("Anotá una hoy."), "S2 no termina en su unica accion")
check("segundos **estimados**" in G or "segundos estimados" in G, "falta decir que los segundos son estimados")

# 4. Frases retiradas (H1, H2, H3, H4)
retiradas = {
    "GUIONES-SEMANA.md": (G, ["sin arriesgar a nadie", "Así probás sin", "hasta que el cliente se queja", "Nadie, hasta que"]),
    "WORKSHOP-MATERIAL.md": (W, ["sin arriesgar a nadie", "funciona en cualquier asistente", "**vale la tuya**", "anonimizados", "Prompt seguro (opcional)"]),
    "META-ADS-ESTUDIO-APLICADO.md": (M, ["5 o más pagos", "Menos de 5 pagos", "**Menos de 5 pagos**", "cada cambio reinicia", "+20 %** (regla", "algo del destino está roto",
                                         "para llegar a 5 pagos", "se escribió al número desde un teléfono de prueba y alguien respondió"]),
}
for arch, (txt_, frases) in retiradas.items():
    for f in frases:
        check(f not in txt_, f"{arch} aun contiene: {f!r}")
# Fraseo que no debe aparecer como certeza (se permite solo dentro de una negacion o cita de lo retirado)
check("no hay margen de «+20 %»" in M, "Meta: falta la negacion del +20 %")
check("**El techo de Bs 300 NO se sube**" in M, "Meta: falta que el techo no se sube")
check("No es un umbral estadístico" in M.replace("**No es un umbral estadístico**", "No es un umbral estadístico"), "Meta: falta que 50 eventos no es umbral estadistico")
check("NO_VERIFICADO" in M and "Camino del canon" in M and "no es canon" in M, "Meta: falta estado de fuentes o destino A/B")
check("anuncio desconocido" in M, "Meta: falta atribucion desconocida")

# 5. H1: la comparacion es suma acreditada vs gasto real (casos probados en meta_cuentas.py)
check("suma acreditada atribuible" in M and "gasto real" in M, "Meta: falta la comparacion suma vs gasto")

# 6. H7: comunicado primario de Goldman citado y alcance
check("goldmansachs.com/pressroom/press-releases/2026/goldman-sachs-commits-500-million-to-launch-small-business-ai-institute" in G, "falta el comunicado primario")
check("programa general" in G and "Estados Unidos" in BASE["S2"], "falta programa general / orientacion a EE. UU.")
check("históricos fechados el 8-oct" in G, "falta fechar los referentes")

# 7. Agenda y rubrica (la logica esta en cuentas_workshop.py)
b1 = [4, 5, 10, 18, 6, 2]
b2 = [5, 10, 12, 12, 6]
check(sum(b1) == 45 and sum(b2) == 45 and sum(b1) + 5 + sum(b2) == 95, "agenda")

# 8. Un solo guion por dia y ninguna nota interna en el hablado
for k, t in BASE.items():
    for prohibida in ("venta ya está habilitada", "link de la bio está correcto", "si la venta", "Chau.", "compuerta"):
        check(prohibida not in t, f"{k} contiene una nota interna: {prohibida!r}")

# 9. Estilo
for nombre, txt_ in (("WORKSHOP", W), ("GUIONES", G), ("META", M), ("ENTREGA", E)):
    print(nombre, "contiene em dash:", txt_.count("—"))

print("FALLOS:" if fallos else "OK")
for f in fallos:
    print(" -", f)
sys.exit(1 if fallos else 0)

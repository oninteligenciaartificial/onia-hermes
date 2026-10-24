# Cuentas del experimento de Meta Ads. SOLO aritmetica con numeros del canon; sin benchmarks ni predicciones.
# Referencia: Bs 300 de pauta (TALLER_31_OCT.md, decision del 19-oct; NO es autorizacion de gasto nueva).
# Escalera del canon: 15 x Bs 50, 20 x Bs 60, 15 x Bs 70 = Bs 3.000.
# CORRECCION H1: la comparacion correcta es SUMA ACREDITADA ATRIBUIBLE vs GASTO REAL, con los montos
# efectivamente cobrados (cada pago vale 50, 60 o 70 segun el escalon). No existe un numero universal de pagos.
TOPE = 300
ESC = [(15, 50), (20, 60), (15, 70)]
assert sum(c * p for c, p in ESC) == 3000 and sum(c for c, p in ESC) == 50


def cobertura_bruta(pagos, gasto_real):
    """Suma acreditada atribuible menos gasto real. Es cobertura BRUTA: no es beneficio (faltan IVA/IT, otros costos)
    ni prueba de causa (los pagos podrian haberse dado sin el anuncio)."""
    assert all(p in (50, 60, 70) for p in pagos), "montos solo del canon"
    suma = sum(pagos)
    return suma, suma - gasto_real, suma >= gasto_real


def lectura(pagos, gasto):
    suma, dif, cubre = cobertura_bruta(pagos, gasto)
    return f"{len(pagos)} pagos {pagos} = Bs {suma} vs gasto real Bs {gasto} -> diferencia bruta Bs {dif:+d} -> {'cubre el gasto (bruto)' if cubre else 'NO cubre el gasto'}"


print("== Casos H1 (regresion) ==")
CASOS = [
    ([50] * 5, 300, False),            # 5 pagos NO cubren Bs 300 si todos son de Bs 50 (250 < 300)
    ([50] * 4, 180, True),             # 4 pagos de Bs 50 SI cubren un gasto real de Bs 180 (200 >= 180)
    ([50, 50, 60, 60, 70], 300, False),  # mezcla de escalones: 290 < 300
    ([50, 60, 60, 70, 70], 300, True),   # mezcla de escalones: 310 >= 300
    ([70] * 5, 300, True),             # 5 pagos de Bs 70 = 350 >= 300
    ([], 300, False),                  # sin pagos
    ([60] * 5, 300, True),             # caso limite exacto: 300 >= 300
]
for pagos, gasto, esperado in CASOS:
    print(lectura(pagos, gasto))
    assert cobertura_bruta(pagos, gasto)[2] is esperado, (pagos, gasto)
# Lo que ya NO se afirma: que "5 pagos" cubran Bs 300 (falso con 5 x Bs 50) ni que "4 pagos" no cubran un gasto menor.
assert cobertura_bruta([50] * 5, 300)[2] is False and cobertura_bruta([50] * 4, 180)[2] is True

print("\n== Gasto por dia con Bs 300 (aritmetica) ==")
print("7 dias =", round(TOPE / 7, 2), "| 8 dias (plan del canon) =", round(TOPE / 8, 2), "| 5 dias =", TOPE / 5)
for d in (3, 5, 7):
    print(f"Gastado al dia {d} con ritmo parejo de 7 dias: Bs {TOPE / 7 * d:.0f}")

print("\n== Costo por conversacion (SUPUESTO ilustrativo) vs conversaciones con el tope ==")
for c in (4, 6, 8, 15, 30):
    print(f"Bs {c:>2}/conversacion -> {TOPE / c:5.1f} conversaciones con Bs {TOPE}")
# Aritmetica (NO umbral estadistico): para llegar a 50 conversaciones con Bs 300 cada una deberia costar <= Bs 6.
assert TOPE / 50 == 6.0
# Ingreso atribuido por conversacion vs costo por conversacion (misma unidad: Bs por conversacion)
n1, gasto, pagos = 40, 280, [50, 60, 60]
print(f"\nEjemplo de lectura: gasto {gasto} / N1 {n1} = Bs {gasto / n1:.2f} por conversacion; cobrado atribuible {sum(pagos)} / N1 = Bs {sum(pagos) / n1:.2f} por conversacion")
assert gasto / n1 == 7.0 and sum(pagos) / n1 == 4.25
# El tope NO se sube: ningun gasto planificado supera Bs 300 sin nuevo OK escrito (regla, no calculo)
assert TOPE == 300
print("OK")

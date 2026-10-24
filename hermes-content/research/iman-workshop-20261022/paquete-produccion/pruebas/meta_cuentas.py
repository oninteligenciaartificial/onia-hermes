# Cuentas del experimento de Meta Ads (SOLO aritmetica con numeros del canon; sin benchmarks ni predicciones).
# Referencia: Bs 300 de pauta (TALLER_31_OCT.md, decision del 19-oct; NO es autorizacion de gasto nueva).
# Escalera del canon: 15 x Bs 50, 20 x Bs 60, 15 x Bs 70 = Bs 3.000.
TOPE = 300
ESC = [(15, 50), (20, 60), (15, 70)]
assert sum(c * p for c, p in ESC) == 3000 and sum(c for c, p in ESC) == 50
print("Gasto por dia: 7 dias =", round(TOPE / 7, 2), "| 8 dias (canon) =", round(TOPE / 8, 2), "| 5 dias =", TOPE / 5)
for precio in (50, 60, 70):
    print(f"Pagos para cubrir el gasto a Bs {precio}: {TOPE / precio:.2f} -> {-(-TOPE // precio)} pagos")
# Con pagos en el primer escalon (Bs 50) hace falta 6; en el segundo (Bs 60), 5; en el tercero (Bs 70), 5.
assert -(-TOPE // 50) == 6 and -(-TOPE // 60) == 5 and -(-TOPE // 70) == 5
print("\nCosto por conversacion (SUPUESTO ilustrativo) -> conversaciones con Bs 300 -> tasa conversacion->pago necesaria para 5 pagos")
for c in (4, 6, 8, 15, 30):
    conv = TOPE / c
    tasa = 5 / conv
    print(f"Bs {c:>2}/conversacion -> {conv:5.1f} conversaciones -> {tasa*100:5.1f}% deben terminar en pago")
# Aprendizaje: Meta recomienda esperar ~50 eventos de optimizacion desde la ultima edicion significativa.
# Para llegar a 50 conversaciones con Bs 300 el costo por conversacion maximo es:
print("\nCosto maximo por conversacion para llegar a 50 conversaciones con Bs 300: Bs", TOPE / 50)
assert TOPE / 50 == 6.0
# Meta de Bs 3.000: la pauta de Bs 300 es el 10 % de esa meta; pagos de la pauta necesarios para ella: 5 de 50.
assert TOPE / 3000 == 0.1
# Puntos de control (a 7 dias, tope total): dia 3 y dia 5
for d in (3, 5, 7):
    print(f"Gastado al dia {d} con ritmo parejo de 7 dias: Bs {TOPE/7*d:.0f}")
print("OK")

# Cuentas del ejercicio ficticio del workshop. Ejecutar: python cuentas_workshop.py
# Supuesto declarado: 4 semanas por mes. Es tiempo, no dinero ni ahorro.
TAREAS = [  # (n, tarea, veces/semana, minutos/vez, riesgo, revisable por una persona)
    (1, "Contestar «¿cuánto cuesta?» por WhatsApp", 10, 5, "medio", True),
    (2, "Pasar los pedidos del cuaderno a la planilla", 5, 15, "medio", True),
    (3, "Recordar saldos pendientes a clientes", 2, 20, "alto", True),
    (4, "Armar el resumen de ventas del viernes", 1, 45, "bajo", True),
    (5, "Responder reclamos por entregas", 4, 25, "alto", True),
    (6, "Actualizar precios en las publicaciones", 1, 30, "medio", True),
    (7, "Coordinar horarios de entrega", 6, 4, "medio", True),
    (8, "Pedir fotos y datos a proveedores", 3, 8, "bajo", True),
]
SEMANAS = 4
def hm(m):
    h, mm = divmod(m, 60)
    return " ".join(p for p in (f"{h} h" if h else "", f"{mm} min" if mm or not h else "") if p)
tot = 0
print("n | tarea | veces x min | min/semana | min/mes | h min/mes | riesgo")
filas = []
for n, t, v, m, r, rev in TAREAS:
    sem = v * m; mes = sem * SEMANAS; tot += sem
    filas.append((n, t, v, m, sem, mes, r))
    print(f"{n} | {t} | {v} x {m} | {sem} | {mes} | {hm(mes)} | {r}")
print("TOTAL min/semana:", tot, "| min/mes:", tot * SEMANAS, "|", hm(tot * SEMANAS))
# Regla de prioridad del ejemplo: entre tareas con riesgo distinto de «alto» y revisables por una persona, la de más minutos por semana.
cand = [f for f in filas if f[6] != "alto"]
elegida = max(cand, key=lambda f: f[4])
print("PRIORIDAD (regla: mayor tiempo semanal entre las de riesgo no alto):", elegida[0], elegida[1], elegida[4], "min/semana")
# Sin la regla de riesgo, la de más tiempo seria:
print("Mayor tiempo sin mirar riesgo:", max(filas, key=lambda f: f[4])[:2])
# Ejemplo canon (10 x 5, 4 semanas) y ejemplo del reel (7 x 12 NO se usa en guiones)
assert 10 * 5 == 50 and 10 * 5 * 4 == 200 and hm(200) == "3 h 20 min"
assert tot == 388 and tot * 4 == 1552 and hm(1552) == "25 h 52 min"
assert max(filas, key=lambda f: f[4])[0] == 5  # la mas larga es la 5 (riesgo alto): la regla de riesgo SI cambia la eleccion
assert elegida[0] == 2 and elegida[4] == 75
# Verificaciones de la rubrica: puntaje maximo
CRIT = ["lista", "costo en tiempo", "prioridad", "primer paso"]
assert len(CRIT) * 2 == 8
# Escalera del canon: 15 x 50 + 20 x 60 + 15 x 70 = 3000; 49 cupos = 2930
assert 15 * 50 + 20 * 60 + 15 * 70 == 3000 and 3000 - 70 == 2930
print("OK: todas las aserciones pasan")

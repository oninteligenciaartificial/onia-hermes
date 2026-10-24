"""Cuentas, regla de prioridad y rubrica del workshop. Ejecutar: python cuentas_workshop.py
Todo es ficticio y mide TIEMPO (no dinero ni ahorro). Supuesto declarado: 4 semanas por mes.
Correccion H4/H5: la regla de prioridad y la rubrica son funciones con casos de borde, no sumas triviales.
No es un ensayo con personas ni una ejecucion de un LLM externo."""
SEMANAS = 4

# (n, tarea, veces/semana, minutos/vez, riesgo, revisable por una persona)
TAREAS = [
    (1, "Contestar «¿cuánto cuesta?» por WhatsApp", 10, 5, "medio", True),
    (2, "Pasar los pedidos del cuaderno a la planilla", 5, 15, "medio", True),
    (3, "Recordar saldos pendientes a clientes", 2, 20, "alto", True),
    (4, "Armar el resumen de ventas del viernes", 1, 45, "bajo", True),
    (5, "Responder reclamos por entregas", 4, 25, "alto", True),
    (6, "Actualizar precios en las publicaciones", 1, 30, "medio", True),
    (7, "Coordinar horarios de entrega", 6, 4, "medio", True),
    (8, "Pedir fotos y datos a proveedores", 3, 8, "bajo", True),
]


def hm(m):
    h, mm = divmod(m, 60)
    return " ".join(p for p in (f"{h} h" if h else "", f"{mm} min" if mm or not h else "") if p)


def minutos_semana(veces, minutos):
    return veces * minutos


def prioridad(tareas):
    """tareas: lista de (n, tarea, veces, minutos, riesgo, revisable). riesgo en {'bajo','medio','alto',None};
    revisable en {True, False, None}. Devuelve (resultado, detalle). NUNCA inventa una prioridad:
    - 'faltan_datos' si la lista esta vacia o a alguna tarea le falta veces, minutos, riesgo o revisable;
    - 'sin_candidata' si ninguna es elegible (riesgo no alto Y revisable por una persona);
    - 'empate' si hay mas de una con el maximo de minutos por semana (decide la persona);
    - 'prioridad' con el numero de la tarea elegida."""
    if not tareas:
        return "faltan_datos", ["lista vacia"]
    faltan = [t[0] for t in tareas if None in (t[2], t[3], t[4], t[5])]
    if faltan:
        return "faltan_datos", faltan
    elegibles = [t for t in tareas if t[4] != "alto" and t[5] is True]
    if not elegibles:
        return "sin_candidata", [t[0] for t in tareas]
    mejor = max(t[2] * t[3] for t in elegibles)
    ganadoras = [t[0] for t in elegibles if t[2] * t[3] == mejor]
    return ("prioridad", ganadoras[0]) if len(ganadoras) == 1 else ("empate", ganadoras)


def reconciliar(veces, minutos, manual, ia):
    """Cuando la cuenta de la persona y la de la IA difieren, se RECALCULAN ambas; no se impone ninguna."""
    real = veces * minutos
    if manual == ia:
        return "coinciden" if manual == real else "coinciden_pero_ambas_mal"
    if manual == real:
        return "manual_correcta"
    if ia == real:
        return "ia_correcta"
    return "ninguna_coincide"


def rubrica_lista(n_tareas, n_concretas):
    """Regla de prioridad EXPLICITA y en este orden (vagas = n_tareas - n_concretas):
    1) lista = 0 si hay hasta 2 concretas O las vagas superan a las concretas (vagas > concretas);
    2) si no, lista = 2 si hay de 5 a 8 tareas y TODAS son concretas;
    3) si no, lista = 1 (3-4 concretas sin mayoria vaga; 9 o mas sin mayoria vaga; 5-8 con alguna vaga sin que predominen)."""
    assert 0 <= n_concretas <= n_tareas
    vagas = n_tareas - n_concretas
    if n_concretas <= 2 or vagas > n_concretas:
        return 0
    if 5 <= n_tareas <= 8 and n_concretas == n_tareas:
        return 2
    return 1


# Tres predicados DISJUNTOS, escritos aparte de la funcion, para comprobar la tabla (no solo que el resultado sea 0, 1 o 2).
def pred_lista_0(n, c):
    return c <= 2 or (n - c) > c


def pred_lista_2(n, c):
    return not pred_lista_0(n, c) and 5 <= n <= 8 and c == n


def pred_lista_1(n, c):
    return not pred_lista_0(n, c) and not pred_lista_2(n, c)


def rubrica_costo(n_tareas, n_con_cuenta_completa, n_con_algun_numero, supuesto_dicho, verificado):
    """0: sin numeros. 2: TODAS con veces x minutos = min/semana y min/mes, supuesto dicho y verificado a mano. 1: el resto."""
    if n_con_algun_numero == 0:
        return 0
    if n_tareas > 0 and n_con_cuenta_completa == n_tareas and supuesto_dicho and verificado:
        return 2
    return 1


def rubrica_prioridad(modo, con_motivo=False, menciona_descarte=True):
    """modo: 'ninguna', 'todas', 'varias', 'una', 'sin_candidata_declarada', 'forzada_sin_candidata'.
    una: 2 si con motivo (tiempo + riesgo + revision) y explica el descarte de la mas larga si es de riesgo alto; 1 si no.
    sin_candidata_declarada: 2 si dice que falta o que cambiaria; 1 si solo lo declara; forzada_sin_candidata: 0."""
    if modo in ("ninguna", "todas", "varias", "forzada_sin_candidata"):
        return 0
    if modo == "una":
        return 2 if (con_motivo and menciona_descarte) else 1
    if modo == "sin_candidata_declarada":
        return 2 if con_motivo else 1
    raise ValueError(modo)


def rubrica_primer_paso(concreto, cuando, datos_inventados, medida, quien_revisa):
    """0: generico (no concreto). 2: concreto Y cuando Y datos totalmente inventados Y medida Y quien revisa. 1: concreto pero incompleto."""
    if not concreto:
        return 0
    return 2 if all((cuando, datos_inventados, medida, quien_revisa)) else 1


if __name__ == "__main__":
    # --- Cuentas del caso ---
    print("n | tarea | veces x min | min/semana | min/mes | h min/mes | riesgo")
    filas, tot = [], 0
    for n, t, v, m, r, rev in TAREAS:
        sem = minutos_semana(v, m)
        tot += sem
        filas.append((n, t, v, m, sem, sem * SEMANAS, r))
        print(f"{n} | {t} | {v} x {m} | {sem} | {sem * SEMANAS} | {hm(sem * SEMANAS)} | {r}")
    print("TOTAL min/semana:", tot, "| min/mes:", tot * SEMANAS, "|", hm(tot * SEMANAS))
    assert 10 * 5 == 50 and 10 * 5 * 4 == 200 and hm(200) == "3 h 20 min"
    assert tot == 388 and tot * 4 == 1552 and hm(1552) == "25 h 52 min"
    assert max(filas, key=lambda f: f[4])[0] == 5  # la mas larga es la 5 (riesgo alto)

    # --- Prioridad: casos (H4) ---
    assert prioridad(TAREAS) == ("prioridad", 2)  # caso El Perchero
    assert prioridad([]) == ("faltan_datos", ["lista vacia"])
    assert prioridad([(1, "a", 5, 10, "alto", True), (2, "b", 3, 20, "alto", True)])[0] == "sin_candidata"  # todas de riesgo alto
    assert prioridad([(1, "a", 5, 10, "bajo", False), (2, "b", 3, 20, "medio", False)])[0] == "sin_candidata"  # ninguna revisable
    assert prioridad([(1, "a", 5, 10, None, True), (2, "b", 3, 20, "bajo", True)]) == ("faltan_datos", [1])  # falta el riesgo: no se supone
    assert prioridad([(1, "a", 5, 10, "bajo", None)]) == ("faltan_datos", [1])  # falta si es revisable
    assert prioridad([(1, "a", None, 10, "bajo", True)]) == ("faltan_datos", [1])  # falta un numero
    assert prioridad([(1, "a", 5, 10, "bajo", True), (2, "b", 10, 5, "medio", True)]) == ("empate", [1, 2])  # 50 = 50: decide la persona
    assert prioridad([(1, "a", 1, 5, "bajo", True)]) == ("prioridad", 1)  # una sola tarea elegible
    assert prioridad([(1, "a", 9, 9, "alto", True), (2, "b", 1, 5, "bajo", True)]) == ("prioridad", 2)  # la mas larga es de riesgo alto

    # --- Discrepancia de cuentas (H4): se recalcula, no se impone la cuenta humana ---
    assert reconciliar(5, 15, 75, 75) == "coinciden"
    assert reconciliar(5, 15, 75, 70) == "manual_correcta"
    assert reconciliar(5, 15, 70, 75) == "ia_correcta"   # la cuenta humana estaba MAL y la IA bien
    assert reconciliar(5, 15, 70, 80) == "ninguna_coincide"
    assert reconciliar(5, 15, 70, 70) == "coinciden_pero_ambas_mal"

    # --- Rubrica: lista para 0, 2, 3, 4, 5, 8 y 9 tareas (H5) ---
    for n, esperado in {0: 0, 2: 0, 3: 1, 4: 1, 5: 2, 8: 2, 9: 1}.items():
        assert rubrica_lista(n, n) == esperado, (n, esperado)
    assert rubrica_lista(6, 5) == 1   # 6 tareas, una vaga
    assert rubrica_lista(5, 2) == 0   # la mayoria vaga
    assert rubrica_lista(12, 12) == 1  # mas de ocho: hay que seleccionar
    # exhaustiva y excluyente: todas las combinaciones dan exactamente 0, 1 o 2
    assert {rubrica_lista(n, c) for n in range(0, 15) for c in range(0, n + 1)} == {0, 1, 2}
    # --- Cierre del residual H5: contraejemplos del dictamen y concordancia tabla/funcion ---
    assert rubrica_lista(8, 3) == 0   # 3 concretas, 5 vagas: mayoria vaga -> 0 (antes devolvia 1)
    assert rubrica_lista(9, 3) == 0   # 3 concretas, 6 vagas: mayoria vaga -> 0 (antes devolvia 1)
    assert rubrica_lista(6, 3) == 1   # 3 concretas, 3 vagas: las vagas NO superan -> 1
    assert rubrica_lista(7, 3) == 0   # 3 concretas, 4 vagas -> 0
    assert rubrica_lista(14, 7) == 1 and rubrica_lista(14, 6) == 0  # 9 o mas: limite de la mayoria vaga
    n_pares = 0
    for n in range(0, 15):
        for c in range(0, n + 1):
            p0, p1, p2 = pred_lista_0(n, c), pred_lista_1(n, c), pred_lista_2(n, c)
            assert (p0 + p1 + p2) == 1, ("solape o hueco", n, c, p0, p1, p2)  # exactamente UNO es verdadero
            esperado = 0 if p0 else (1 if p1 else 2)
            assert rubrica_lista(n, c) == esperado, ("la funcion no concuerda con la tabla", n, c)
            n_pares += 1
    assert n_pares == 120  # sum(n + 1 for n in 0..14) = 120 pares (concretas <= total <= 14)
    print("Rubrica lista: 120 pares (0 <= concretas <= total <= 14), cada uno en exactamente 1 de 3 predicados y la funcion concuerda")

    # --- Rubrica: costo, prioridad, primer paso ---
    assert rubrica_costo(5, 0, 0, False, False) == 0
    assert rubrica_costo(5, 5, 5, True, True) == 2
    assert rubrica_costo(5, 5, 5, True, False) == 1   # sin verificar a mano
    assert rubrica_costo(5, 3, 5, True, True) == 1    # falta la cuenta completa en 2 tareas
    assert rubrica_prioridad("todas") == 0 and rubrica_prioridad("una", True, True) == 2 and rubrica_prioridad("una", False, False) == 1
    assert rubrica_prioridad("sin_candidata_declarada", True) == 2 and rubrica_prioridad("sin_candidata_declarada", False) == 1
    assert rubrica_prioridad("forzada_sin_candidata") == 0  # inventar una prioridad sin candidata puntua 0
    assert rubrica_primer_paso(False, True, True, True, True) == 0
    assert rubrica_primer_paso(True, True, True, True, True) == 2
    assert rubrica_primer_paso(True, True, False, True, True) == 1  # datos no totalmente inventados

    # --- Las tres respuestas escritas del material (§7) y el caso sin candidata ---
    A = (rubrica_lista(8, 8), rubrica_costo(8, 8, 8, True, True), rubrica_prioridad("una", True, True), rubrica_primer_paso(True, True, True, True, True))
    B = (rubrica_lista(2, 2), rubrica_costo(2, 2, 2, False, False), rubrica_prioridad("una", False, False), rubrica_primer_paso(True, False, False, False, False))
    C = (rubrica_lista(4, 0), rubrica_costo(4, 0, 0, False, False), rubrica_prioridad("todas"), rubrica_primer_paso(False, False, False, False, False))
    D = (rubrica_lista(3, 3), rubrica_costo(3, 3, 3, True, True), rubrica_prioridad("sin_candidata_declarada", True), rubrica_primer_paso(True, True, True, True, True))
    E = (rubrica_lista(4, 4), rubrica_costo(4, 4, 4, True, True), rubrica_prioridad("una", True, True), rubrica_primer_paso(True, True, True, True, True))
    print("Puntajes: A", A, sum(A), "| B", B, sum(B), "| C", C, sum(C), "| D (sin candidata)", D, sum(D), "| E (4 tareas)", E, sum(E))
    assert (sum(A), sum(B), sum(C), sum(D), sum(E)) == (8, 3, 0, 7, 7)

    # --- Escalera del canon ---
    assert 15 * 50 + 20 * 60 + 15 * 70 == 3000 and 3000 - 70 == 2930
    print("OK: todas las aserciones pasan")

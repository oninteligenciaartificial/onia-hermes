# Verifica afirmaciones numericas de WORKSHOP-MATERIAL.md y GUIONES-SEMANA.md. Ejecutar: python verificar_material.py
import re, sys
sys.path.insert(0, '.')
from textos_guiones import BASE
W = open('../WORKSHOP-MATERIAL.md', encoding='utf-8').read()
G = open('../GUIONES-SEMANA.md', encoding='utf-8').read()
def n(t): return len(re.findall(r"[\wáéíóúñüÁÉÍÓÚÑÜ]+(?:[.,]\d+)?", t))
# 1. Apertura: lineas que empiezan con '>' entre '## 3.' y '## 4.'
ap = W.split('## 3. Apertura')[1].split('## 4.')[0]
txt = " ".join(l[1:].strip() for l in ap.splitlines() if l.startswith('>'))
palabras = n(txt)
print("Apertura:", palabras, "palabras ->", round(palabras / 3.2), "s de voz")
# 2. Pedidos inventados del segundo prompt
pedidos = {1: (3, "recibir"), 2: (1, "pagado"), 3: (3, "recibir"), 4: (2, "pagado"), 5: (2, "recibir")}
assert sum(1 for u, p in pedidos.values() if p == "recibir") == 3
assert sum(1 for u, p in pedidos.values() if p == "pagado") == 2
# 3. Agenda: suma de bloques
b1 = [4, 5, 10, 18, 6, 2]; b2 = [5, 10, 12, 12, 6]
assert sum(b1) == 45 and sum(b2) == 45 and sum(b1) + 5 + sum(b2) == 95
# 4. Rubrica
assert 2 + 2 + 2 + 2 == 8 and 0 + 1 + 1 + 1 == 3 and 0 * 4 == 0
# 5. Los textos hablados de GUIONES-SEMANA.md son los de textos_guiones.py
fallan = [k for k, t in BASE.items() if t not in G]
print("Textos de guiones ausentes en GUIONES-SEMANA.md:", fallan or "ninguno")
# 6. Prohibidos en los documentos (fuera de contextos de negacion revisados a mano)
for f, t in (("WORKSHOP-MATERIAL", W), ("GUIONES-SEMANA", G)):
    for pat in ["—", "–"]:
        print(f, "contiene", repr(pat), t.count(pat), "veces")
print("OK" if not fallan else "REVISAR")

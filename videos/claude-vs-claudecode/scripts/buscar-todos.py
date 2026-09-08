"""Corre buscar-cara sobre TODO el material a camara y junta el ranking."""
import glob, json, os, subprocess, sys

CARPETA = "E:/ONIA-YouTube/grabaciones"
FIJOS = [("E:/ONIA-YouTube/grabaciones/clip 2 video 1.mp4", 481.9, 511.4),
         ("E:/ONIA-YouTube/grabaciones/clip 1 video 2.mp4", 0.5, 33.5)]
todos = []
tareas = list(FIJOS) + [(f.replace("\\", "/"), 0.3, 1e9) for f in glob.glob(os.path.join(CARPETA, "ONIA-YT-*.mp4"))]
for v, a, b in tareas:
    tmp = "renders/_c.json"
    r = subprocess.run([sys.executable, "scripts/buscar-cara.py", v, str(a), str(b), "3", tmp],
                       capture_output=True, text=True)
    if not os.path.exists(tmp):
        print(f"  (sin caras) {os.path.basename(v)}"); continue
    filas = json.load(open(tmp))
    for f in filas:
        f["video"] = v
    todos += filas
    print(f"  {os.path.basename(v):42s} {len(filas):4d} caras, mejor {filas[0]['score'] if filas else 0:.3f}")
todos.sort(key=lambda f: -f["score"])
json.dump(todos, open("renders/candidatos.json", "w"), indent=1)
print(f"\nTOTAL {len(todos)} frames. Top 16 de todo el material:")
for f in todos[:16]:
    print(f"  {os.path.basename(f['video'])[:34]:34s} t={f['t']:7.2f} score {f['score']:.3f} apert {f["apertura"]:.3f} cara {f['w']}px")

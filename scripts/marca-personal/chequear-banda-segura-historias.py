#!/usr/bin/env python3
"""GATE del formato historia 9:16 — ¿qué le tapa la interfaz de Instagram?

Una historia se ve impecable como PNG suelto y aun así perder texto en el teléfono:
la UI de IG come 230px arriba y 422px abajo. Este chequeo pega esa interfaz simulada
sobre cada PNG ya renderizado y arma una hoja para MIRARLA. Un peso >50KB no prueba
nada de esto (loop marca-personal, 02-sep).

Banda segura y su fuente: ver `generar-historia-quiz.py`.
Veredicto que la fijó: `experimento-safearea-historia.py` (variante C).

Uso:  python3 chequear-banda-segura-historias.py [carpeta]
      (por defecto hermes-content/carousels/out/historias-quiz)
Salida: <carpeta>/CHEQUEO-banda-segura.png
"""
import subprocess, sys, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
SAFE_TOP = round(1920 * 0.12)      # 230
SAFE_BOT = round(1920 * 0.22)      # 422
ANCHO_MINI = 300                    # 1080 -> 300 px por columna en la hoja


def _chrome_bin():
    import os, glob
    if os.environ.get("CHROME_BIN"):
        return os.environ["CHROME_BIN"]
    candidatos = [r"C:\Program Files\Google\Chrome\Application\chrome.exe"]
    candidatos += sorted(glob.glob("/root/.cache/ms-playwright/chromium-*/chrome-linux64/chrome"), reverse=True)
    for c in candidatos:
        if Path(c).exists():
            return c
    raise SystemExit("No encontre Chrome/Chromium (seteá CHROME_BIN)")


def main():
    carpeta = Path(sys.argv[1]) if len(sys.argv) > 1 else REPO / "hermes-content/carousels/out/historias-quiz"
    pngs = sorted(p for p in carpeta.glob("*.png") if not p.name.startswith("CHEQUEO"))
    if not pngs:
        raise SystemExit(f"No hay PNGs en {carpeta}")

    k = ANCHO_MINI / 1080          # escala de la hoja
    alto = round(1920 * k)
    top, bot = round(SAFE_TOP * k), round(SAFE_BOT * k)

    cols = "".join(
        f"<div class='col'><p class='rot'>{p.stem}</p><div class='mini'>"
        f"<img src='{p.as_uri()}'>"
        f"<div class='ui arriba'></div><div class='ui abajo'></div>"
        f"<div class='barras'><i></i><i></i><i></i></div>"
        f"<div class='perfil'><div class='av'></div><b>sergiourcullo</b></div>"
        f"<div class='responder'>Enviar mensaje</div></div></div>"
        for p in pngs)

    html = f"""<!doctype html><html><head><meta charset='utf-8'><style>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@400;500&display=swap');
*{{margin:0;padding:0;box-sizing:border-box}}
body{{background:#F4F4F2;font-family:'Archivo',sans-serif}}
.hoja{{display:flex;flex-wrap:wrap;gap:22px;padding:24px}}
.col{{width:{ANCHO_MINI}px}}
.rot{{font-family:'Geist Mono',monospace;font-size:17px;letter-spacing:.07em;text-transform:uppercase;margin:0 0 9px 2px}}
.mini{{position:relative;width:{ANCHO_MINI}px;height:{alto}px;border-radius:11px;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,.18)}}
.mini img{{width:100%;height:100%;display:block}}
.ui{{position:absolute;left:0;right:0;background:rgba(214,28,42,.34);border-color:rgba(214,28,42,.95);border-style:solid;border-width:0}}
.arriba{{top:0;height:{top}px;border-bottom-width:3px}}
.abajo{{bottom:0;height:{bot}px;border-top-width:3px}}
.barras{{position:absolute;top:7px;left:7px;right:7px;display:flex;gap:3px}}
.barras i{{flex:1;height:3px;border-radius:2px;background:rgba(255,255,255,.55)}}
.barras i:first-child{{background:#fff}}
.perfil{{position:absolute;top:18px;left:8px;display:flex;align-items:center;gap:6px;color:#fff;font-size:11px;font-weight:600}}
.perfil .av{{width:19px;height:19px;border-radius:50%;background:#dcdcdc;border:2px solid #fff}}
.responder{{position:absolute;bottom:22px;left:10px;right:10px;height:28px;border:2px solid rgba(255,255,255,.9);border-radius:14px;display:flex;align-items:center;padding-left:13px;color:rgba(255,255,255,.92);font-size:11px}}
</style></head><body><div class='hoja'>{cols}</div></body></html>"""

    tmp = Path(tempfile.mkdtemp(prefix="chequeo-"))
    f = tmp / "hoja.html"
    f.write_text(html, encoding="utf-8")
    filas = (len(pngs) + 2) // 3
    ancho = min(len(pngs), 3) * (ANCHO_MINI + 22) + 26
    png = carpeta / "CHEQUEO-banda-segura.png"
    subprocess.run([_chrome_bin(), "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
                    f"--window-size={ancho},{filas * (alto + 55) + 24}", "--force-device-scale-factor=1",
                    "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
                   check=True, capture_output=True, timeout=120)
    shutil.rmtree(tmp, ignore_errors=True)
    print(f"OK {png} {png.stat().st_size} bytes  ({len(pngs)} historias)")
    print("MIRALA: nada del diseño debe caer dentro de las bandas rojas.")


if __name__ == "__main__":
    main()

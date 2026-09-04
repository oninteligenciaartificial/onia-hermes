#!/usr/bin/env python3
"""EXPERIMENTO (03-sep) — la receta ganadora sobre una lamina GRID 2x3.

QUE PREGUNTA RESPONDE
---------------------
El pendiente abierto de BASE_CONTENIDO §6 dice: "Los otros 11 generadores a la
tipografia de marca — una por vuelta alcanza; NO es buscar-y-reemplazar". Le toca a
`generar-lamina-grid-ia.py`.

Pero la receta ganadora (contexto gris chico + remate gigante + collage) se midio sobre
una PORTADA: un icono grande y nada mas compitiendo. **Una lamina grid es otra cosa** —
el encabezado comparte el lienzo con 6 celdas que ya tienen su propio icono y su propio
resaltado verde. La pregunta abierta es si el remate gigante sigue ganando cuando abajo
hay seis focos de atencion, o si se come el espacio que las celdas necesitan para
ensenar. Eso es lo que esta corrida mide, no la migracion mecanica.

VARIANTES (misma lamina real: "Lo que la IA ya hace por tu negocio", mismas 6 celdas)
  A  lo que hay HOY       t2 900/wdth62 · sin collage · encabezado de 2 lineas parejas
  B  tipografia de marca  mismo layout, 650/wdth96 (el buscar-y-reemplazar que §6
                          ya declaro RETROCESO en portada — aca se comprueba en grid)
  C  marca + jerarquia    contexto gris chico + remate gigante 2 lineas + capas collage

Se juzga en `CHEQUEO-grid-tipografia.png` a 33% (feed) y 13% (grilla de perfil), las dos
escalas del experimento de miniatura del 02-sep. El 100% se mira en los PNG sueltos.

TRAMPAS QUE ESTE SCRIPT YA TIENE EN CUENTA (todas de §6, medidas antes)
  · `wdth 96` es MAS ANCHO que el condensed 62 → el remate va en 2 lineas de <=7
    caracteres; el tope medido es 138px para 9 caracteres en 880px utiles.
  · el collage NUNCA cruza el texto → cinta/sticker/icono viven en la banda superior.
  · el resaltado verde se parte entre lineas → `box-decoration-break:clone`.

Salida: hermes-content/carousels/out/experimento-grid-tipografia/
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = (REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos").as_uri()
OUT = REPO / "hermes-content/carousels/out/experimento-grid-tipografia"


def _chrome():
    import os, glob
    if os.environ.get("CHROME_BIN"):
        return os.environ["CHROME_BIN"]
    candidatos = [r"C:\Program Files\Google\Chrome\Application\chrome.exe"]
    candidatos += sorted(glob.glob("/root/.cache/ms-playwright/chromium-*/chrome-linux64/chrome"), reverse=True)
    for c in candidatos:
        if Path(c).exists():
            return c
    raise SystemExit("No encontre Chrome/Chromium (setea CHROME_BIN)")


CHROME = _chrome()

CELDAS = [
    ("speech_balloon", "Responde", "clientes 24/7"),
    ("money_bag", "Cotiza", "en 1 minuto"),
    ("spiral_calendar", "Agenda", "tus citas"),
    ("memo", "Escribe", "lo que vende"),
    ("chart_increasing", "Ordena", "tus números"),
    ("robot", "Atiende", "sin que estés"),
]


def grid_html(tam_icono=210, tam_lbl=37):
    celdas = "".join(
        f"""<div class="celda"><img src="{ICONOS}/{ic}.png" style="width:{tam_icono}px;height:{tam_icono}px">
        <div class="lbl" style="font-size:{tam_lbl}px">{a}<br><span class="hl">{b}</span></div></div>"""
        for ic, a, b in CELDAS)
    return f'<div class="grid">{celdas}</div>'


COMUN = """
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#F7F7F7;--ink:#0A0A0A;--muted:#8E8E8E;--verde:#00C661}
html,body{width:1080px;height:1350px}
body{background:var(--bg);font-family:'Archivo',sans-serif;font-weight:450;overflow:hidden}
.lienzo{width:1080px;height:1350px;display:flex;flex-direction:column;align-items:center;
  padding:110px 90px 90px;position:relative}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:64px 40px;width:100%}
.celda{display:flex;flex-direction:column;align-items:center;gap:22px}
.celda img{object-fit:contain;filter:grayscale(1) contrast(1.05)}
.lbl{font-weight:600;color:var(--ink);text-align:center;line-height:1.45}
.lbl .hl{background:var(--verde);padding:1px 12px 4px;border-radius:8px;font-weight:800;
  white-space:nowrap;-webkit-box-decoration-break:clone;box-decoration-break:clone}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;
  font-size:27px;font-weight:500;letter-spacing:.08em;color:var(--muted)}
.icono-flot{position:absolute;object-fit:contain;filter:drop-shadow(0 14px 22px rgba(0,0,0,.18))}
.cinta{position:absolute;width:190px;height:52px;background:rgba(0,0,0,.055);
  border:1px solid rgba(0,0,0,.05);box-shadow:0 3px 8px rgba(0,0,0,.05)}
.sticker{position:absolute;background:#0A0A0A;color:var(--verde);border-radius:50%;width:166px;height:166px;
  display:flex;align-items:center;justify-content:center;transform:rotate(12deg);font-weight:650;
  font-size:29px;line-height:1.1;text-align:center;box-shadow:0 14px 30px rgba(0,0,0,.25)}
"""

# --- A: lo que hay hoy (black 900 + condensed 62) ----------------------------
CSS_A = COMUN + """
.t1{font-size:64px;font-weight:500;font-variation-settings:'wdth' 96;color:var(--ink);letter-spacing:-0.01em}
.t2{font-size:118px;font-weight:900;font-variation-settings:'wdth' 62;word-spacing:.09em;color:var(--ink);line-height:1;margin-top:6px}
.t2 .hl{background:var(--verde);padding:2px 20px 8px;border-radius:10px}
.grid{margin-top:96px}
"""

# --- B: el buscar-y-reemplazar (mismo layout, pesos de marca) ----------------
CSS_B = COMUN + """
.t1{font-size:64px;font-weight:450;font-variation-settings:'wdth' 96;color:var(--ink);letter-spacing:-0.01em}
.t2{font-size:118px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);line-height:1;margin-top:6px;letter-spacing:-0.03em}
.t2 .hl{background:var(--verde);padding:2px 20px 8px;border-radius:10px;white-space:nowrap;
  -webkit-box-decoration-break:clone;box-decoration-break:clone}
.grid{margin-top:96px}
"""

CUERPO_AB = f"""<div class="lienzo">
  <div class="t1">Lo que la IA ya hace</div>
  <div class="t2"><span class="hl">por tu negocio</span></div>
  {grid_html()}
  <div class="handle">@sergiourcullo</div>
</div>"""

# --- C: marca + jerarquia de portada + collage -------------------------------
# El remate va en 2 lineas de <=7 caracteres: "wdth 96" es mas ancho que el condensed
# y "POR TU NEGOCIO" en una linea desbordaria los 900px utiles (tope medido: 138px
# para 9 caracteres en 880px).
CSS_C = COMUN + """
.contexto{font-size:50px;font-weight:450;color:var(--muted);text-align:center;line-height:1.2}
.remate{font-size:130px;font-weight:650;font-variation-settings:'wdth' 96;color:var(--ink);
  text-align:center;line-height:.98;letter-spacing:-0.035em;margin-top:10px}
.remate .hl{background:var(--verde);border-radius:12px;padding:2px 22px 10px;white-space:nowrap;
  -webkit-box-decoration-break:clone;box-decoration-break:clone}
.grid{margin-top:74px}
"""

CUERPO_C = f"""<div class="lienzo">
  <div class="cinta" style="top:250px;left:40px;transform:rotate(-8deg)"></div>
  <img class="icono-flot" src="{ICONOS}/sparkles.png" style="width:118px;top:96px;left:34px;transform:rotate(-12deg)">
  <div class="sticker" style="top:118px;right:36px">las 6<br>DE HOY</div>
  <div class="contexto">Lo que la IA ya hace</div>
  <div class="remate">POR TU<br><span class="hl">NEGOCIO</span></div>
  {grid_html(tam_icono=190, tam_lbl=35)}
  <div class="handle">@sergiourcullo</div>
</div>"""

# --- C2: C con el collage CORREGIDO -----------------------------------------
# Mirando C al 100% aparecio un defecto que ninguna miniatura muestra: la cinta
# flotaba en vacio arriba a la izquierda, pegada a NADA. Una cinta adhesiva solo
# lee como collage si sujeta algo; sola sobre fondo plano es un rectangulo gris
# perdido. C2 la apoya sobre la esquina del bloque verde del remate (le da algo que
# sujetar) y cambia el texto del sticker por uno que dice algo — "las 6 DE HOY" era
# metadata decorativa, justo lo que Sergio pidio sacar.
CUERPO_C2 = f"""<div class="lienzo">
  <img class="icono-flot" src="{ICONOS}/sparkles.png" style="width:118px;top:96px;left:34px;transform:rotate(-12deg)">
  <div class="sticker" style="top:118px;right:36px">sin<br>SUELDO</div>
  <div class="contexto">Lo que la IA ya hace</div>
  <div class="remate">POR TU<br><span class="hl">NEGOCIO</span></div>
  <div class="cinta" style="top:392px;left:150px;transform:rotate(-8deg)"></div>
  {grid_html(tam_icono=190, tam_lbl=35)}
  <div class="handle">@sergiourcullo</div>
</div>"""

PIEZAS = [
    ("grid-A-hoy-900-62", CSS_A, CUERPO_AB),
    ("grid-B-marca-650-96", CSS_B, CUERPO_AB),
    ("grid-C-marca-remate-collage", CSS_C, CUERPO_C),
    ("grid-C2-cinta-que-sujeta", CSS_C, CUERPO_C2),
]

ETIQUETAS = ["A · hoy (900 / wdth 62)", "B · marca a secas (650 / 96)",
             "C · marca + remate + collage", "C2 · cinta que SUJETA + sticker con sentido"]


def render(nombre, css, cuerpo, tmp):
    html = f"<!doctype html><html><head><meta charset='utf-8'><style>{css}</style></head><body>{cuerpo}</body></html>"
    f = tmp / f"{nombre}.html"
    f.write_text(html, encoding="utf-8")
    png = OUT / f"{nombre}.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1080,1350", "--force-device-scale-factor=1", "--virtual-time-budget=9000",
        f"--screenshot={png}", f.as_uri()], check=True, capture_output=True, timeout=90)
    print(f"OK {nombre}.png {png.stat().st_size} bytes")


def hoja(tmp):
    """Hoja de juicio: las 3 laminas a 33% (feed) y a 13% (grilla de perfil).

    Sin fila al 100%: tres laminas de 1080px no entran en una hoja mirable (lo aprendio
    el experimento de miniatura del 02-sep, que se atrapo a si mismo saliendo cortado).
    """
    def fila(escala, titulo):
        celdas = "".join(
            f'<div class="celda"><img src="{(OUT / (n + ".png")).as_uri()}" style="width:{int(1080*escala)}px">'
            f'<div class="pie">{e}</div></div>'
            for (n, _, _), e in zip(PIEZAS, ETIQUETAS))
        return f'<div class="bloque"><div class="rot">{titulo}</div><div class="row">{celdas}</div></div>'

    html = f"""<!doctype html><html><head><meta charset='utf-8'><style>
    @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@500&display=swap');
    *{{margin:0;padding:0;box-sizing:border-box}}
    body{{background:#FFF;font-family:'Geist Mono',monospace;padding:46px 40px;width:1300px}}
    h1{{font-size:23px;letter-spacing:.06em;margin-bottom:8px}}
    .nota{{font-size:15px;color:#666;line-height:1.5;margin-bottom:30px}}
    .bloque{{margin-bottom:38px}}
    .rot{{font-size:17px;letter-spacing:.1em;color:#111;background:#00C661;display:inline-block;padding:5px 14px;margin-bottom:14px}}
    .row{{display:flex;gap:34px;align-items:flex-start}}
    .celda img{{display:block;border:1px solid #DDD}}
    .pie{{font-size:13px;color:#555;margin-top:8px;letter-spacing:.04em}}
    </style></head><body>
    <h1>LA RECETA GANADORA SOBRE UNA LAMINA GRID 2x3 — "lo que la IA ya hace"</h1>
    <div class="nota">La receta se midio en una PORTADA (un icono, nada mas compitiendo).
    Aca el encabezado comparte lienzo con 6 celdas que ya tienen icono y resaltado propio.<br>
    A = lo que hay hoy (black 900 + condensed 62, los dos rechazados por Sergio).<br>
    B = el buscar-y-reemplazar: mismo layout, pesos de marca.<br>
    C = marca + jerarquia de portada (contexto gris + remate gigante) + capas collage.<br>
    Se juzga a 33% (feed) y a 13% (grilla de perfil). El 100%: los PNG sueltos.</div>
    {fila(0.33, "33% — FEED")}
    {fila(0.13, "13% — GRILLA DE PERFIL")}
    </body></html>"""
    f = tmp / "hoja.html"
    f.write_text(html, encoding="utf-8")
    png = OUT / "CHEQUEO-grid-tipografia.png"
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
        "--window-size=1300,1150", "--force-device-scale-factor=1", "--virtual-time-budget=9000",
        f"--screenshot={png}", f.as_uri()], check=True, capture_output=True, timeout=90)
    print(f"OK CHEQUEO-grid-tipografia.png {png.stat().st_size} bytes")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="gridtipo-"))
    for nombre, css, cuerpo in PIEZAS:
        render(nombre, css, cuerpo, tmp)
    hoja(tmp)
    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()

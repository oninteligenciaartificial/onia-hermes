#!/usr/bin/env python3
"""Genera el carrusel "5 prompts" (7 laminas 1080x1350) con el patron
statement-3d-minimal y las renderiza a PNG con Chrome headless.

Uso:  python scripts/marca-personal/generar-carrusel-prompts.py
Salida: hermes-content/carousels/out/carrusel-5-prompts/lamina-0N.png
"""
import os, subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
ICONOS = REPO / "hermes-content/references/ui-patterns/statement-3d-minimal/iconos"
OUT = REPO / "hermes-content/carousels/out/carrusel-5-prompts"

def _chrome():
    import os, glob
    if os.environ.get("CHROME_BIN"):
        return os.environ["CHROME_BIN"]
    candidatos = [r"C:\Program Files\Google\Chrome\Application\chrome.exe"]
    candidatos += sorted(glob.glob("/root/.cache/ms-playwright/chromium-*/chrome-linux64/chrome"), reverse=True)
    for c in candidatos:
        if Path(c).exists():
            return c
    raise SystemExit("No encontre Chrome/Chromium (seteá CHROME_BIN)")

CHROME = _chrome()

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#F7F7F7;--ink:#0A0A0A;--muted:#8E8E8E;--card:#FFFFFF}
html,body{width:1080px;height:1350px}
body{background:var(--bg);font-family:'Inter',sans-serif;overflow:hidden}
.lienzo{width:1080px;height:1350px;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:90px 100px;position:relative}
.handle{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-size:30px;font-weight:600;color:var(--muted)}
.num{font-size:210px;font-weight:900;color:var(--ink);letter-spacing:-0.05em;line-height:.9}
.icono{width:300px;height:300px;object-fit:contain}
.icono-sm{width:210px;height:210px;object-fit:contain}
.titulo{font-size:78px;font-weight:900;color:var(--ink);letter-spacing:-0.03em;text-align:center;line-height:1.05}
.sub{font-size:44px;font-weight:600;color:var(--muted);text-align:center;letter-spacing:-0.01em}
.caja{background:var(--card);border-radius:36px;padding:56px 60px;font-size:40px;line-height:1.42;color:var(--ink);box-shadow:0 18px 50px rgba(0,0,0,.07);width:100%}
.caja b{font-weight:600;background:#EFEDEA;border-radius:8px;padding:0 8px}
.fila{display:flex;gap:110px;justify-content:center;align-items:flex-end}
.item{display:flex;flex-direction:column;align-items:center;gap:14px}
.item .lbl{font-size:30px;font-weight:400;color:var(--ink)}
.gap-xl{gap:64px}
"""

def portada():
    return f"""
<div class="lienzo" style="gap:64px">
  <div class="fila">
    <div class="item"><img class="icono-sm" src="{ICONOS.as_uri()}/robot.png"><div class="lbl">IA</div></div>
    <div class="item"><img class="icono-sm" src="{ICONOS.as_uri()}/light_bulb.png"><div class="lbl">Ideas</div></div>
  </div>
  <div style="text-align:center">
    <div class="num" style="font-size:150px">5 prompts</div>
    <div class="sub" style="margin-top:14px">que uso todos los días en mi negocio</div>
  </div>
  <div class="fila">
    <div class="item"><img class="icono-sm" src="{ICONOS.as_uri()}/memo.png"><div class="lbl">Copiá</div></div>
    <div class="item"><img class="icono-sm" src="{ICONOS.as_uri()}/rocket.png"><div class="lbl">Pegá</div></div>
  </div>
  <div class="handle">@sergiourcullo</div>
</div>"""

def prompt_slide(n, icono, titulo, cuerpo):
    return f"""
<div class="lienzo gap-xl">
  <div style="display:flex;align-items:center;gap:70px">
    <div class="num">0{n}</div>
    <img class="icono" src="{ICONOS.as_uri()}/{icono}.png">
  </div>
  <div class="titulo">{titulo}</div>
  <div class="caja">{cuerpo}</div>
  <div class="handle">@sergiourcullo</div>
</div>"""

def cta():
    return f"""
<div class="lienzo" style="gap:56px">
  <img class="icono" src="{ICONOS.as_uri()}/rocket.png">
  <div class="titulo">El paso a paso completo<br>está en mi comunidad</div>
  <div class="sub">Comentá <b style="color:var(--ink)">COMUNIDAD</b> y te mando el acceso · gratis</div>
  <div class="handle">@sergiourcullo</div>
</div>"""

SLIDES = [
    portada(),
    prompt_slide(1, "speech_balloon", "Responder clientes",
        "“Sos el encargado de atención de <b>[mi negocio]</b>. Respondé este mensaje de un cliente de forma cálida y concreta, máximo 4 líneas: <b>[mensaje]</b>”"),
    prompt_slide(2, "money_bag", "Cotizar en 1 minuto",
        "“Armame una cotización profesional para <b>[servicio]</b>, precio <b>[X]</b>, con qué incluye, qué no incluye, y validez de 7 días.”"),
    prompt_slide(3, "memo", "Descripciones que venden",
        "“Escribí 3 descripciones cortas para vender <b>[producto]</b> a <b>[tipo de cliente]</b>, cada una con un ángulo distinto.”"),
    prompt_slide(4, "spiral_calendar", "Resumen de reunión",
        "“Resumí estos apuntes en: decisiones, tareas con responsable y pendientes: <b>[apuntes]</b>”"),
    prompt_slide(5, "chart_increasing", "Plan semanal",
        "“Soy dueño de <b>[negocio]</b>. Mis 3 prioridades son <b>[X]</b>. Armame el plan de la semana en bloques de 2 horas.”"),
    cta(),
]

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="carrusel-"))
    for i, cuerpo in enumerate(SLIDES, 1):
        html = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{cuerpo}</body></html>"
        f = tmp / f"lamina-{i:02d}.html"
        f.write_text(html, encoding="utf-8")
        png = OUT / f"lamina-{i:02d}.png"
        subprocess.run([
            CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
            "--window-size=1080,1350", "--force-device-scale-factor=1",
            "--virtual-time-budget=8000",
            f"--screenshot={png}", f.as_uri(),
        ], check=True, capture_output=True, timeout=90)
        print(f"OK lamina-{i:02d}.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()

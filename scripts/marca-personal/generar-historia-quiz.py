#!/usr/bin/env python3
"""Historias-quiz 1080x1920 para IG (formato referencia ingenierobinario adaptado
a marca Onia: verde #00C661, Archivo variable, Geist Mono). La ENCUESTA la pega
Sergio en IG con el sticker nativo sobre la zona punteada.
Salida: hermes-content/carousels/out/historias-quiz/historia-0N.png
Respuestas correctas y opciones del poll: docs/ONIA_MARCA_PERSONAL_SEMANA1.md.

BANDA SEGURA (02-sep, experimento `experimento-safearea-historia.py`, ganó C):
todo el contenido vive dentro de y ∈ [230px, 1498px]. Fuera de ahí lo tapa la
interfaz de Instagram — con el layout viejo el handle quedaba TACHADO por la barra
"Enviar mensaje" y ~40% de la zona de encuesta caía debajo de la UI.
Fuente de la banda: `.agents/skills/embedded-captions/references/aesthetic-principles.md`
§17 — "9:16 TikTok/IG/Shorts: caption zone y ∈ [12%, 78%] (bottom 22% is UI)".
La escala tipográfica al 88% (--s) es lo que paga el alto que come la banda sin
apretar la zona del sticker."""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "hermes-content/carousels/out/historias-quiz"

SAFE_TOP = round(1920 * 0.12)      # 230 — UI de arriba (perfil + barras de progreso)
SAFE_BOT = round(1920 * 0.22)      # 422 — UI de abajo (barra "Enviar mensaje")

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

CSS = f"""
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@400;500&display=swap');
*{{margin:0;padding:0;box-sizing:border-box}}
:root{{--verde:#00C661;--ink:#0A0A0A;--blanco:#FFFFFF;--s:.88}}
html,body{{width:1080px;height:1920px}}
body{{background:var(--verde);font-family:'Archivo',sans-serif;overflow:hidden}}
.lienzo{{width:1080px;height:1920px;display:flex;flex-direction:column;align-items:center;padding:{SAFE_TOP + 40}px 90px {SAFE_BOT + 74}px;position:relative;gap:44px}}
.tag{{font-family:'Geist Mono',monospace;font-size:calc(32px*var(--s));font-weight:500;letter-spacing:.14em;color:rgba(0,0,0,.6)}}
.card{{background:#111312;border-radius:40px;padding:calc(70px*var(--s)) calc(64px*var(--s));width:100%;box-shadow:0 24px 60px rgba(0,0,0,.22);color:#EDEDED}}
.card .mono{{font-family:'Geist Mono',monospace;font-size:calc(36px*var(--s));line-height:1.6}}
.card .mono .v{{color:var(--verde)}}
.card .mono .c{{color:#8E8E8E}}
.card .grande{{font-size:calc(58px*var(--s));font-weight:700;line-height:1.18;letter-spacing:-0.01em}}
.banda{{background:var(--ink);color:var(--verde);width:100%;border-radius:28px;padding:calc(44px*var(--s)) 40px;text-align:center;font-size:calc(66px*var(--s));font-weight:900;font-variation-settings:'wdth' 62;word-spacing:.09em;line-height:1.05}}
.zona{{border:5px dashed rgba(0,0,0,.35);border-radius:36px;width:86%;flex:1;min-height:0;display:flex;align-items:center;justify-content:center}}
.zona span{{font-family:'Geist Mono',monospace;font-size:30px;letter-spacing:.12em;color:rgba(0,0,0,.45)}}
.handle{{position:absolute;bottom:{SAFE_BOT + 12}px;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:28px;font-weight:500;letter-spacing:.08em;color:rgba(0,0,0,.55)}}
.fila-icono{{display:flex;align-items:center;gap:28px;font-size:calc(44px*var(--s));font-weight:600;color:#EDEDED;padding:calc(16px*var(--s)) 0}}
"""

HISTORIAS = [
    # 1 — cuánto tarda un asistente
    """<div class="lienzo">
  <div class="tag">QUIZ · IA PARA TU NEGOCIO</div>
  <div class="card"><div class="grande">Un asistente que responde a <span style="color:#00C661">tus clientes</span> las preguntas de siempre — precio, stock, horarios — sin que estés vos.</div></div>
  <div class="banda">¿Cuánto tarda armarlo?</div>
  <div class="zona"><span>ENCUESTA ACÁ ↓</span></div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 2 — cuál NO puede
    """<div class="lienzo">
  <div class="tag">QUIZ · IA PARA TU NEGOCIO</div>
  <div class="card">
    <div class="fila-icono">📸&ensp;Fotos de producto de catálogo</div>
    <div class="fila-icono">💬&ensp;Responder WhatsApp de clientes</div>
    <div class="fila-icono">🧾&ensp;Cotizar sola en 1 minuto</div>
    <div class="fila-icono">📅&ensp;Agendar citas y recordarlas</div>
  </div>
  <div class="banda">¿Cuál NO puede<br>hacer la IA hoy?</div>
  <div class="zona"><span>ENCUESTA ACÁ ↓</span></div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 3 — cuánto costó el arte (terminal real)
    """<div class="lienzo">
  <div class="tag">QUIZ · ASÍ TRABAJO</div>
  <div class="card"><div class="mono"><span class="c">$</span> higgsfield generate cost<br><br>modelo: <span class="v">soul_v2</span><br>tamaño: <span class="v">2048px</span><br>costo: <span class="v">0,12 créditos</span><br><br><span class="c"># un arte para mi marca,</span><br><span class="c"># generado desde la terminal</span></div></div>
  <div class="banda">¿Cuánto costó<br>en bolivianos?</div>
  <div class="zona"><span>ENCUESTA ACÁ ↓</span></div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 4 — el guardián del VPS (cron real, verificado en vivo: */10 * * * * claude-guardia.sh)
    """<div class="lienzo">
  <div class="tag">QUIZ · ASÍ TRABAJO</div>
  <div class="card"><div class="mono"><span class="c">$</span> crontab -l<br><br><span class="v">*/10 * * * *</span> claude-guardia.sh<br><br><span class="c"># revisa el servidor solo,</span><br><span class="c"># levanta lo que se cayó</span><br><span class="c"># y me avisa por Telegram</span></div></div>
  <div class="banda">¿Cada cuánto<br>se revisa solo?</div>
  <div class="zona"><span>ENCUESTA ACÁ ↓</span></div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 5 — los loops de contenido (meta-contenido: esta historia la escribió el servidor)
    """<div class="lienzo">
  <div class="tag">QUIZ · ASÍ TRABAJO</div>
  <div class="card"><div class="grande">Esta historia no la escribí yo a las 3 de la mañana. La escribió <span style="color:#00C661">mi servidor</span>, solo. Yo apreté publicar.</div></div>
  <div class="banda">¿Cuántas veces al día<br>trabaja sin mí?</div>
  <div class="zona"><span>ENCUESTA ACÁ ↓</span></div>
  <div class="handle">@sergiourcullo</div>
</div>""",
    # 6 — el empleado que no duerme (claim "Bs 0 en sueldos" del banco de la FICHA)
    """<div class="lienzo">
  <div class="tag">QUIZ · ASÍ TRABAJO</div>
  <div class="card">
    <div class="fila-icono">🌙&ensp;No duerme</div>
    <div class="fila-icono">📅&ensp;No falta los lunes</div>
    <div class="fila-icono">🚪&ensp;No renuncia</div>
    <div class="fila-icono">⚡&ensp;Trabaja los feriados</div>
  </div>
  <div class="banda">¿Cuánto le pago<br>de sueldo?</div>
  <div class="zona"><span>ENCUESTA ACÁ ↓</span></div>
  <div class="handle">@sergiourcullo</div>
</div>""",
]

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="historia-"))
    for i, cuerpo in enumerate(HISTORIAS, 1):
        html = f"<!doctype html><html><head><meta charset='utf-8'><style>{CSS}</style></head><body>{cuerpo}</body></html>"
        f = tmp / f"historia-{i:02d}.html"
        f.write_text(html, encoding="utf-8")
        png = OUT / f"historia-{i:02d}.png"
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
            "--window-size=1080,1920", "--force-device-scale-factor=1",
            "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
            check=True, capture_output=True, timeout=90)
        print(f"OK historia-{i:02d}.png {png.stat().st_size} bytes")
    shutil.rmtree(tmp, ignore_errors=True)

if __name__ == "__main__":
    main()

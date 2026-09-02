#!/usr/bin/env python3
"""EXPERIMENTO — banda segura de historias 9:16 (loop marca-personal, 02-sep).

Pregunta: la historia-quiz se ve impecable como PNG suelto, pero ¿qué le tapa la
interfaz de Instagram una vez publicada? La etiqueta superior vive a 150px del
borde y el handle a 56px del inferior.

Fuente de la banda segura (interna, versionada — no inventada):
`.agents/skills/embedded-captions/references/aesthetic-principles.md` §17
"9:16 TikTok/IG/Shorts: caption zone y ∈ [12%, 78%] (bottom 22% is UI)".
A 1920px: seguro = y ∈ [230px, 1498px] → 230px de UI arriba, 422px abajo.

Variantes, mismo contenido (historia-01) para que el A/B sea limpio:
  A — layout actual (control)
  B — todo dentro de la banda segura, misma escala tipográfica
  C — banda segura + escala tipográfica al 88% (recupera alto para la encuesta)

Salida: hermes-content/carousels/out/experimento-safearea-historia/
  {A,B,C}-*.png            las tres limpias, tamaño real (lo que se publica)
  {A,B,C}-*-chrome.png     las tres con la interfaz de IG simulada encima
  COMPARACION-chrome.png   las tres lado a lado (bandas rojas = lo que NO se ve)
"""
import subprocess, tempfile, shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
OUT = REPO / "hermes-content/carousels/out/experimento-safearea-historia"

# Banda segura 9:16 — aesthetic-principles.md §17
SAFE_TOP = round(1920 * 0.12)      # 230
SAFE_BOT = round(1920 * 0.22)      # 422


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


CHROME = _chrome_bin()

BASE_CSS = """
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@400;500&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--verde:#00C661;--ink:#0A0A0A;--s:1}
html,body{width:1080px;height:1920px}
body{background:var(--verde);font-family:'Archivo',sans-serif;overflow:hidden}
.lienzo{width:1080px;height:1920px;display:flex;flex-direction:column;align-items:center;position:relative}
.tag{font-family:'Geist Mono',monospace;font-size:calc(32px*var(--s));font-weight:500;letter-spacing:.14em;color:rgba(0,0,0,.6)}
.card{background:#111312;border-radius:40px;padding:calc(70px*var(--s)) calc(64px*var(--s));width:100%;box-shadow:0 24px 60px rgba(0,0,0,.22);color:#EDEDED}
.card .grande{font-size:calc(58px*var(--s));font-weight:700;line-height:1.18;letter-spacing:-0.01em}
.banda{background:var(--ink);color:var(--verde);width:100%;border-radius:28px;padding:calc(44px*var(--s)) 40px;text-align:center;font-size:calc(66px*var(--s));font-weight:900;font-variation-settings:'wdth' 62;word-spacing:.09em;line-height:1.05}
.zona{border:5px dashed rgba(0,0,0,.35);border-radius:36px;width:86%;flex:1;min-height:0;display:flex;align-items:center;justify-content:center}
.zona span{font-family:'Geist Mono',monospace;font-size:30px;letter-spacing:.12em;color:rgba(0,0,0,.45);text-align:center}
.handle{position:absolute;left:0;right:0;text-align:center;font-family:'Geist Mono',monospace;font-size:28px;font-weight:500;letter-spacing:.08em;color:rgba(0,0,0,.55)}
"""

VARIANTES = [
    ("A-actual", "layout actual (control)",
     ".lienzo{padding:150px 90px 120px;gap:54px}\n.handle{bottom:56px}"),
    ("B-banda-segura", "banda segura, misma tipografia",
     f".lienzo{{padding:{SAFE_TOP + 40}px 90px {SAFE_BOT + 74}px;gap:44px}}\n"
     f".handle{{bottom:{SAFE_BOT + 12}px}}"),
    ("C-banda-segura-escala88", "banda segura + tipografia 88%",
     f":root{{--s:.88}}\n.lienzo{{padding:{SAFE_TOP + 40}px 90px {SAFE_BOT + 74}px;gap:44px}}\n"
     f".handle{{bottom:{SAFE_BOT + 12}px}}"),
]

CUERPO = """<div class="lienzo">
  <div class="tag">QUIZ &middot; IA PARA TU NEGOCIO</div>
  <div class="card"><div class="grande">Un asistente que responde a <span style="color:#00C661">tus clientes</span> las preguntas de siempre &mdash; precio, stock, horarios &mdash; sin que est&eacute;s vos.</div></div>
  <div class="banda">&iquest;Cu&aacute;nto tarda armarlo?</div>
  <div class="zona"><span>ENCUESTA AC&Aacute; &darr;</span></div>
  <div class="handle">@sergiourcullo</div>
</div>"""

# Interfaz de IG simulada — las bandas rojas son lo que el usuario NO ve
CHROME_CSS = f"""
.ig{{position:absolute;inset:0;pointer-events:none;z-index:9}}
.ig .ui{{position:absolute;left:0;right:0;background:rgba(214,28,42,.32);border-style:solid;border-color:rgba(214,28,42,.9);border-width:0}}
.ig .arriba{{top:0;height:{SAFE_TOP}px;border-bottom-width:5px}}
.ig .abajo{{bottom:0;height:{SAFE_BOT}px;border-top-width:5px}}
.ig .rotulo{{position:absolute;right:20px;font-family:'Geist Mono',monospace;font-size:27px;letter-spacing:.1em;color:#fff;background:rgba(168,16,28,.95);padding:9px 17px;border-radius:9px;white-space:nowrap}}
.ig .barras{{position:absolute;top:26px;left:24px;right:24px;display:flex;gap:7px}}
.ig .barras i{{flex:1;height:7px;border-radius:4px;background:rgba(255,255,255,.5)}}
.ig .barras i:first-child{{background:#fff}}
.ig .perfil{{position:absolute;top:64px;left:28px;display:flex;align-items:center;gap:18px;color:#fff;font-family:'Archivo',sans-serif}}
.ig .perfil .av{{width:66px;height:66px;border-radius:50%;background:#dcdcdc;border:3px solid #fff}}
.ig .perfil b{{font-size:33px;font-weight:600}}
.ig .perfil em{{font-size:29px;opacity:.8;font-style:normal;margin-left:12px}}
.ig .responder{{position:absolute;bottom:78px;left:36px;right:36px;height:98px;border:3px solid rgba(255,255,255,.9);border-radius:49px;display:flex;align-items:center;padding-left:46px;color:rgba(255,255,255,.92);font-family:'Archivo',sans-serif;font-size:35px}}
.ig .casa{{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);width:340px;height:9px;border-radius:5px;background:rgba(255,255,255,.85)}}
"""

CHROME_HTML = f"""<div class="ig">
  <div class="ui arriba"><div class="rotulo" style="top:16px">INTERFAZ IG &mdash; {SAFE_TOP}px TAPADOS</div></div>
  <div class="barras"><i></i><i></i><i></i></div>
  <div class="perfil"><div class="av"></div><div><b>sergiourcullo</b><em>2 h</em></div></div>
  <div class="ui abajo"><div class="rotulo" style="bottom:16px">INTERFAZ IG &mdash; {SAFE_BOT}px TAPADOS</div></div>
  <div class="responder">Enviar mensaje</div>
  <div class="casa"></div>
</div>"""


def render(html: str, png: Path, w: int, h: int, tmp: Path, nombre: str):
    f = tmp / f"{nombre}.html"
    f.write_text(html, encoding="utf-8")
    subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-sandbox",
                    f"--window-size={w},{h}", "--force-device-scale-factor=1",
                    "--virtual-time-budget=8000", f"--screenshot={png}", f.as_uri()],
                   check=True, capture_output=True, timeout=90)
    print(f"OK {png.name} {png.stat().st_size} bytes")


def pagina(extra: str, con_chrome: bool) -> str:
    """CUERPO termina en el `</div>` que cierra .lienzo: la interfaz entra justo antes."""
    assert CUERPO.endswith("</div>")
    css = BASE_CSS + extra + (CHROME_CSS if con_chrome else "")
    cuerpo = (CUERPO[:-len("</div>")] + CHROME_HTML + "</div>") if con_chrome else CUERPO
    return f"<!doctype html><html><head><meta charset='utf-8'><style>{css}</style></head><body>{cuerpo}</body></html>"


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    tmp = Path(tempfile.mkdtemp(prefix="safearea-"))

    for slug, _desc, extra in VARIANTES:
        render(pagina(extra, False), OUT / f"{slug}.png", 1080, 1920, tmp, slug)
        render(pagina(extra, True), OUT / f"{slug}-chrome.png", 1080, 1920, tmp, f"{slug}-chrome")

    # hoja de comparación: las tres con interfaz, lado a lado
    cols = "".join(
        f"<div class='col'><p class='rot'>{slug.split('-')[0]} &mdash; {desc}</p>"
        f"<img src='{(OUT / (slug + '-chrome.png')).as_uri()}'></div>"
        for slug, desc, _e in VARIANTES)
    hoja = f"""<!doctype html><html><head><meta charset='utf-8'><style>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Geist+Mono:wght@400;500&display=swap');
*{{margin:0;padding:0;box-sizing:border-box}}
body{{background:#F4F4F2;font-family:'Archivo',sans-serif;width:1260px}}
.hoja{{display:flex;gap:30px;padding:30px}}
.col{{width:380px}}
.col img{{width:380px;height:676px;border-radius:14px;box-shadow:0 10px 26px rgba(0,0,0,.2);display:block}}
.rot{{font-family:'Geist Mono',monospace;font-size:20px;letter-spacing:.08em;text-transform:uppercase;color:#111;margin:0 0 12px 2px}}
</style></head><body><div class='hoja'>{cols}</div></body></html>"""
    render(hoja, OUT / "COMPARACION-chrome.png", 1260, 780, tmp, "COMPARACION")

    shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()

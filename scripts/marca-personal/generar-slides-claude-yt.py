#!/usr/bin/env python3
"""DECK YouTube "Que es Claude y Claude Code" — patron apple-editorial, 1920x1080.

Existe porque Sergio Urcullo graba este video ACAPELA: no lee un guion, improvisa
mirando las laminas. Entonces las laminas no son decoracion, son el teleprompter —
cada una es UN tramo del guion, y las cifras duras van escritas en pantalla para que
no dependan de su memoria (un numero mal dicho en YouTube se lo cobran en comentarios).

Patron y trampas: hermes-content/references/ui-patterns/apple-editorial/{FICHA.md,tokens.css}
Sin collage, sin sticker, sin grano. Verde de Onia: NO se usa aca — la pieza no nombra
a Onia, y la FICHA lo reserva para CTA y para donde la marca aparece.

Uso:
  python scripts/marca-personal/generar-slides-claude-yt.py
  python scripts/marca-personal/generar-slides-claude-yt.py --check   # sin rendir
"""
import argparse
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
PATRON = REPO / "hermes-content/references/ui-patterns/apple-editorial"
OUT = REPO / "hermes-content/carousels/out/yt-claude-vs-claude-code"

NAVEGADORES = [
    Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe"),
    Path(r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"),
    Path(r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"),
    Path("/usr/bin/google-chrome"),
    Path("/usr/bin/chromium"),
]

# Cada lamina = un tramo del guion. `nota` no se rinde: es la chuleta del tramo.
LAMINAS = [
    dict(id="01-portada", layout="portada", eyebrow="Claude &middot; Claude Code",
         titulo="&iquest;Es Claude,<br>pero para programadores?",
         remate="No. Y la diferencia es m&aacute;s simple de lo que parece.",
         nota="Hook. Arrancar sin intro, sin musica, a camara."),

    dict(id="02-claude", layout="portada", eyebrow="01 &middot; Qu&eacute; es Claude",
         titulo="Te responde.",
         cuerpo="Le escrib&iacute;s, te contesta. Explica, redacta, corrige, arma un plan.",
         remate="Pero est&aacute; del otro lado del vidrio: el que hace el trabajo sos vos.",
         nota="Comparar con ChatGPT para ubicar rapido. La hace Anthropic."),

    dict(id="03-problema", layout="lista", eyebrow="02 &middot; El problema",
         titulo="Vos sos el mensajero",
         items=[("Copi&aacute;s el error.", "Lo peg&aacute;s en el chat."),
                ("Te contesta.", "Copi&aacute;s la respuesta y la peg&aacute;s en tu programa."),
                ("No funciona.", "Copi&aacute;s el error nuevo y volv&eacute;s a empezar.")],
         remate="Nunca vio tu proyecto. No prob&oacute; nada.",
         nota="Aca se siente el dolor. No apurar este tramo."),

    dict(id="04-duelo", layout="duelo", eyebrow="El mismo cerebro &middot; Dos formas de usarlo",
         izq=("Claude", "Te responde.",
              "Le pregunt&aacute;s, te contesta. El trabajo lo segu&iacute;s haciendo vos."),
         der=("Claude&nbsp;Code", "Lo hace.",
              "Abre tus archivos, los cambia, los prueba, y te muestra qu&eacute; toc&oacute;."),
         remate="La diferencia no es <em>cu&aacute;nto sabe</em>.<br>Es si tiene <em>manos</em>.",
         nota="EL GIRO. Dejarla en pantalla completa unos segundos en silencio."),

    dict(id="05-como-se-usa", layout="lista", eyebrow="03 &middot; C&oacute;mo se usa",
         titulo="Igual que un chat",
         items=[("Le escrib&iacute;s en espa&ntilde;ol.", "Como le escribir&iacute;as a una persona."),
                ("Vive en tu computadora.", "Terminal, aplicaci&oacute;n de escritorio, o dentro del editor."),
                ("Te pregunta antes de tocar algo.", "Vos aprob&aacute;s o rechaz&aacute;s. Nada a tus espaldas.")],
         nota="Si el video va corto, este tramo se estira; si va largo, se corta."),

    dict(id="06-mi-caso", layout="lista", eyebrow="04 &middot; Mi caso",
         titulo="Cuatro que trabajan de noche",
         items=[("La cola del sistema", "cada hora"),
                ("El chatbot que atiende clientes", "cada hora"),
                ("La p&aacute;gina de ventas", "cada dos horas"),
                ("El recorrido completo de un cliente", "y me avisa si algo se rompi&oacute;")],
         remate="Ninguno me pregunta nada. Yo duermo, ellos trabajan.",
         nota="Si se puede, mostrar la terminal en vivo. Es el tramo que da prueba."),

    dict(id="07-honesto", layout="lista", eyebrow="05 &middot; La parte honesta",
         titulo="Lo que nadie te cuenta",
         items=[("Se equivoca.",
                 "En una sesi&oacute;n anot&oacute; 12 errores propios. 11 los encontr&oacute; &eacute;l revisando. 1 lo encontr&eacute; yo."),
                ("No es gratis.",
                 "El plan que uso son 200 d&oacute;lares al mes. Hay m&aacute;s baratos para empezar."),
                ("No te vuelve programador.",
                 "Te saca lo repetitivo. Las decisiones siguen siendo tuyas.")],
         remate="Un resultado que dice &laquo;listo&raquo; no prueba que est&eacute; bien.",
         nota="Este tramo da credibilidad. No saltearlo aunque el video vaya largo."),

    dict(id="08-cierre", layout="portada", eyebrow="En una l&iacute;nea",
         titulo="Claude te dice c&oacute;mo.<br>Claude Code lo hace.",
         remate="&iquest;Quer&eacute;s respuestas? Claude. &iquest;Quer&eacute;s que el trabajo se haga solo? Claude Code.",
         nota="CTA: suscribirse + proximo video (como se instala y las 3 primeras cosas que le pediria)."),
]

CSS = """
@font-face{font-family:'Inter';src:url('__P__/fonts/Inter-var-latin.woff2') format('woff2');font-weight:100 900;font-display:block}
@font-face{font-family:'Instrument Serif';src:url('__P__/fonts/InstrumentSerif-latin.woff2') format('woff2');font-weight:400;font-display:block}
@font-face{font-family:'Spline Sans Mono';src:url('__B__/SplineSansMono-var-latin.woff2') format('woff2');font-weight:100 700;font-display:block}
:root{--bg:#F5F1E8;--ink:#1D1D1F;--muted:#6E6E73;--hair:#D2D2D7;
      --tr-display:-0.032em;--tr-label:-0.020em;--lh-display:0.98;--lh-body:1.42}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1920px;height:1080px}
body{background:var(--bg);font-family:'Inter',system-ui,sans-serif;color:var(--ink);
     display:flex;flex-direction:column;padding:96px 112px 88px}
.eyebrow{font-family:'Spline Sans Mono',monospace;font-size:22px;font-weight:500;
         letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
h1{font-size:112px;font-weight:700;letter-spacing:var(--tr-display);line-height:var(--lh-display);
   margin-top:72px;max-width:24ch}
.cuerpo{font-size:36px;line-height:var(--lh-body);letter-spacing:var(--tr-label);
        color:var(--muted);margin-top:38px;max-width:34ch}
.remate{margin-top:auto;padding-top:52px;border-top:1px solid var(--hair);
        font-family:'Instrument Serif',Georgia,serif;font-size:56px;line-height:1.14;
        letter-spacing:-.012em;padding-right:46%}
/* padding, no max-width: el ancho del TEXTO se achica pero la hairline sigue cruzando
   el lienzo entero, igual que las de la lista. Con max-width la linea se cortaba a
   mitad de camino y quedaba como un renglon suelto. */
.remate em{font-style:italic}
.handle{padding-top:36px;font-family:'Spline Sans Mono',monospace;font-size:22px;
        font-weight:500;letter-spacing:.1em;color:var(--muted)}
.duelo{flex:1;display:grid;grid-template-columns:1fr 1px 1fr;margin-top:84px;align-items:start}
.col{padding:0 72px}
.col:first-child{padding-left:0}
.col:last-child{padding-right:0}
.rule{background:var(--hair);align-self:stretch}
.num{font-family:'Spline Sans Mono',monospace;font-size:20px;font-weight:500;letter-spacing:.14em;
     color:var(--muted);display:block;margin-bottom:34px}
.col h2{font-size:104px;font-weight:700;letter-spacing:var(--tr-display);line-height:var(--lh-display)}
.verb{font-size:64px;font-weight:600;letter-spacing:var(--tr-display);line-height:1.04;margin-top:34px}
.col p{font-size:33px;line-height:var(--lh-body);letter-spacing:var(--tr-label);
       color:var(--muted);margin-top:30px;max-width:23ch}
.items{flex:1;margin-top:56px;display:flex;flex-direction:column;justify-content:center}
.item{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:baseline;
      padding:34px 0;border-top:1px solid var(--hair)}
.item:last-child{border-bottom:1px solid var(--hair)}
/* Con remate, el borde de arriba del remate YA cierra la lista: dos hairlines a 1px
   se leen como una linea gruesa mal dibujada. */
.items.con-remate .item:last-child{border-bottom:none}
.item .k{font-size:50px;font-weight:600;letter-spacing:var(--tr-display);line-height:1.08}
.item .v{font-size:30px;line-height:var(--lh-body);letter-spacing:var(--tr-label);color:var(--muted)}
.lista h1{font-size:84px;margin-top:52px}
.lista .remate{font-size:48px}
"""


def shell(cuerpo, clase=""):
    css = CSS.replace("__P__", PATRON.as_uri()).replace("__B__", (REPO / "hermes-content/brand/fonts").as_uri())
    return "<!doctype html><meta charset='utf-8'><style>" + css + "</style><body class='" + clase + "'>" + cuerpo


def render_portada(d):
    cuerpo = "<div class='cuerpo'>" + d["cuerpo"] + "</div>" if d.get("cuerpo") else ""
    remate = "<div class='remate'>" + d["remate"] + "</div>" if d.get("remate") else ""
    return shell("<div class='eyebrow'>" + d["eyebrow"] + "</div><h1>" + d["titulo"] + "</h1>"
                 + cuerpo + remate + "<div class='handle'>@sergiourcullo</div>")


def render_duelo(d):
    def col(n, t):
        return ("<div class='col'><span class='num'>" + n + "</span><h2>" + t[0] + "</h2>"
                "<div class='verb'>" + t[1] + "</div><p>" + t[2] + "</p></div>")
    return shell("<div class='eyebrow'>" + d["eyebrow"] + "</div><div class='duelo'>"
                 + col("01", d["izq"]) + "<div class='rule'></div>" + col("02", d["der"])
                 + "</div><div class='remate'>" + d["remate"] + "</div>"
                 "<div class='handle'>@sergiourcullo</div>")


def render_lista(d):
    items = "".join("<div class='item'><div class='k'>" + k + "</div><div class='v'>" + v + "</div></div>"
                    for k, v in d["items"])
    remate = "<div class='remate'>" + d["remate"] + "</div>" if d.get("remate") else ""
    caja = "items con-remate" if d.get("remate") else "items"
    return shell("<div class='eyebrow'>" + d["eyebrow"] + "</div><h1>" + d["titulo"] + "</h1>"
                 "<div class='" + caja + "'>" + items + "</div>" + remate
                 + "<div class='handle'>@sergiourcullo</div>", clase="lista")


LAYOUTS = {"portada": render_portada, "duelo": render_duelo, "lista": render_lista}


def navegador():
    for b in NAVEGADORES:
        if b.exists():
            return b
    sys.exit("No se encontro Chrome ni Edge. Agregar la ruta a NAVEGADORES.")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true", help="valida datos y layouts, no rinde")
    args = ap.parse_args()

    ids = [l["id"] for l in LAMINAS]
    assert len(ids) == len(set(ids)), "ids repetidos: %s" % ids
    for l in LAMINAS:
        assert l["layout"] in LAYOUTS, "%s: layout desconocido %s" % (l["id"], l["layout"])
        assert l.get("nota"), "%s: sin nota — la nota ES la chuleta del tramo" % l["id"]
        LAYOUTS[l["layout"]](l)  # explota aca si a la lamina le falta un campo
    print("check ok · %d laminas · layouts %s" % (len(LAMINAS), sorted(LAYOUTS)))
    if args.check:
        return

    chrome = navegador()
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for l in LAMINAS:
            src = Path(tmp) / (l["id"] + ".html")
            src.write_text(LAYOUTS[l["layout"]](l), encoding="utf-8")
            png = OUT / (l["id"] + ".png")
            subprocess.run([str(chrome), "--headless", "--disable-gpu", "--hide-scrollbars",
                            "--force-device-scale-factor=1", "--window-size=1920,1080",
                            "--screenshot=" + str(png), src.as_uri()],
                           check=True, capture_output=True)
            # Un PNG diminuto = fuente que no cargo o layout vacio. Un verde que no mide, no sirve.
            assert png.exists() and png.stat().st_size > 20_000, "%s salio vacio o roto" % png.name
            print("  %s  %d KB" % (png.name, png.stat().st_size // 1024))

    notas = OUT / "NOTAS-POR-LAMINA.md"
    notas.write_text(
        "# Chuleta por lamina — video acapela\n\n"
        "Sergio Urcullo improvisa mirando la lamina. Esto es lo que cubre cada tramo.\n"
        "Las cifras duras estan EN la lamina a proposito: no dependen de la memoria.\n\n"
        + "\n".join("**%s** — %s\n" % (l["id"], l["nota"]) for l in LAMINAS),
        encoding="utf-8")
    print("\n%d laminas en %s" % (len(LAMINAS), OUT.relative_to(REPO)))


if __name__ == "__main__":
    main()

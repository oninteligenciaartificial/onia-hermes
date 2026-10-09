"""Genera la página teleprompter de los guiones v3 a partir del JSON extraído.
Uso: python -X utf8 gen_tp.py <piezas.json> <salida.html>"""
import html, json, re, sys

ORDEN = [
    ("Vie 9 · antes de las 18:00", "Set Santiago: de la cintura para arriba, aire sobre la cabeza", ["N07", "DD-A", "N02"]),
    ("Vie 9 · a continuación", "Set Rocha: plano medio corto, una toma continua", ["D03-A", "D04-C"]),
    ("Sáb 10 · 14:00 a 15:30", "Set Santiago", ["N06"]),
    ("Dom 11 · antes de las 18:00", "Set Erik: sentado, fondo oscuro con contraluz, cara corrida a la derecha", ["S2-D08-A", "N04", "S2-D07-A", "D01-A", "D05-A"]),
    ("Lun 12 · antes de las 18:00", "YouTube horizontal, celular de costado; después set Santiago", ["D01-C", "D02-A"]),
]
COMO = [
    "Teléfono en trípode, a la altura de los ojos. Micrófono de solapa.",
    "Vos grabás solo la cámara: capturas y tarjetas las pone la edición.",
    "Una idea por toma. Si te trabás, dos segundos de pausa y repetís la frase entera.",
    "Al final de cada pieza, una toma aparte de 4 segundos con el remate y «chau» (salvo que la pieza diga otra cosa).",
    "El bruto va a Drive, carpeta «Videos Onia Octubre», con el código en el nombre: N07-haiku.mp4.",
]

e = lambda s: html.escape(s or "")
slug = lambda pid: re.sub(r"[^a-z0-9]+", "-", pid.lower()).strip("-")


def pieza(p):
    meta = []
    for k, v in (("Sale", p["sale"]), ("Set", p["set"]), ("Dura", p["duracion"])):
        if v:
            meta.append(f'<div class="kv"><dt>{k}</dt><dd>{e(v)}</dd></div>')
    antes = "".join(f"<li>{e(a)}</li>" for a in p["antes"] if a)
    bloques = []
    for b in p["bloques"]:
        if not (b["dice"] or b["accion"]):
            continue
        acc = f'<p class="accion">{e(b["accion"])}</p>' if b["accion"] else ""
        dice = f'<p class="dice">{e(b["dice"])}</p>' if b["dice"] else ""
        bloques.append(f'<div class="bloque"><span class="t">{e(b["tiempo"])}</span><div class="txt">{acc}{dice}</div></div>')
    cta = ""
    if p["cta_dicho"] or p["cta_tecleado"]:
        cta = '<div class="cta">'
        if p["cta_dicho"]:
            cta += f'<p class="dice">{e(p["cta_dicho"])}</p>'
        if p["cta_tecleado"]:
            cta += f'<p class="tecleado">En pantalla: {e(p["cta_tecleado"])}</p>'
        cta += "</div>"
    yap = ""
    if p["yap"]["tiene"]:
        yap = f'<details class="extra"><summary>Yap (segundo corte)</summary><p><b>Gancho:</b> {e(p["yap"]["gancho"])}</p>'
        if p["yap"]["texto"]:
            yap += f'<p class="dice small">{e(p["yap"]["texto"])}</p>'
        yap += "</details>"
    tomas = "".join(f"<li>{e(t)}</li>" for t in p["tomas"] if t)
    return f'''<article class="pieza" id="{slug(p["id"])}">
  <header><span class="code">{e(p["id"])}</span><h2>{e(p["titulo"])}</h2></header>
  <p class="rotulo">Rótulo: {e(p["rotulo"])}</p>
  <dl class="meta">{"".join(meta)}</dl>
  {f'<div class="antes"><h3>Antes de grabar</h3><ul>{antes}</ul></div>' if antes else ""}
  <div class="guion">{"".join(bloques)}</div>
  {cta}
  {f'<details class="extra"><summary>Tomas extra</summary><ul>{tomas}</ul></details>' if tomas else ""}
  {yap}
  <a class="arriba" href="#orden">Volver al orden</a>
</article>'''


def main(src, out):
    piezas = {p["id"]: p for p in json.load(open(src, encoding="utf-8"))}
    orden_html, cuerpo = [], []
    for dia, set_, ids in ORDEN:
        items = "".join(
            f'<li><a href="#{slug(i)}"><span class="code">{e(i)}</span> {e(piezas[i]["titulo"]) if i in piezas else ""}</a></li>' for i in ids)
        orden_html.append(f'<section class="tanda"><h3>{e(dia)}</h3><p class="set">{e(set_)}</p><ol>{items}</ol></section>')
        cuerpo += [pieza(piezas[i]) for i in ids if i in piezas]
    sin = [p for k, p in piezas.items() if not p["graba"]]
    sin_html = "".join(f'<li><span class="code">{e(p["id"])}</span> {e(p["titulo"])}</li>' for p in sin)
    page = open(sys.argv[3] if len(sys.argv) > 3 else __file__.replace("gen_tp.py", "plantilla.html"), encoding="utf-8").read()
    page = page.replace("{{ORDEN}}", "".join(orden_html)).replace("{{COMO}}", "".join(f"<li>{e(c)}</li>" for c in COMO))
    page = page.replace("{{PIEZAS}}", "\n".join(cuerpo)).replace("{{SIN}}", sin_html)
    open(out, "w", encoding="utf-8", newline="\n").write(page)
    print("ok", len(cuerpo), "piezas a grabar,", len(sin), "sin grabar")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])

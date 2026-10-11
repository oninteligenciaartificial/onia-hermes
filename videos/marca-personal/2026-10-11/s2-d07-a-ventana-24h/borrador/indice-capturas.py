#!/usr/bin/env python3
"""indice-capturas.py — arma capturas/indice.md (URL, fecha, hora UTC, HTTP y qué cita cada captura) desde los capturas.json."""
import json
import sys
from pathlib import Path

base = Path(sys.argv[1])
filas = ["# Capturas oficiales (documentación de WhatsApp Business Platform, Meta)", "",
         "Sacadas con `capturar-meta.mjs` (copia adaptada de `erik/capturar.mjs`) por el proxy de la sesión, TLS intacto, Chromium headless.", "",
         "| Captura | URL (final) | Fecha · hora UTC | HTTP | Texto de la página que se marca |", "|---|---|---|---|---|"]
for d in sorted(p for p in base.iterdir() if (p / "capturas.json").exists()):
    j = json.loads((d / "capturas.json").read_text())
    for nombre, c in j["capturas"].items():
        filas.append(f"| `{d.name}/{c['archivo']}` | {j.get('url_final', j['url'])} | {j['fecha']} · {j['hora_utc']} | {j['http']} | «{c.get('marca_texto')}» |")
filas += ["", "La URL vieja `developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages` redirige (200) a la de arriba; las dos páginas dicen «Updated: May 21, 2026».",
          "Lo que NO se capturó ni va en pantalla: lo de las variables (ver README, «ALERTA»)."]
(base / "indice.md").write_text("\n".join(filas) + "\n")
print("->", base / "indice.md")

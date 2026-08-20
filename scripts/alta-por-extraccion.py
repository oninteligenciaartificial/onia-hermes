#!/usr/bin/env python3
"""
Alta por extraccion — precarga la cuenta de un cliente desde su web publica.

Decision y evidencia: hermes-content/docs/platform/ONIA_EXTRACCION_WEB_DECISION.md

Dos pasos, a proposito:
  1. Crawl4AI /md  -> browser real + limpieza. GRATIS, sin LLM.
  2. LiteLLM       -> UNA llamada con json_schema strict. Gasto medido y bajo el tope.

No se pide LLMExtractionStrategy dentro de /crawl: Crawl4AI 0.9.0 la rechaza desde
una request no confiable (HTTP 400). El camino de dos pasos ademas nos deja el prompt,
el schema y el costo bajo control.

Corre EN EL VPS (187.77.16.63): los dos servicios escuchan en loopback.

    export C4AI_TOK=$(docker exec onia_selfhosted-crawl4ai-1 printenv CRAWL4AI_API_TOKEN)
    export LL_KEY=$(docker exec onia_selfhosted-litellm-1 printenv LITELLM_MASTER_KEY)
    python3 alta-por-extraccion.py https://clinicadentalsanpedro.com.bo/

Limites conocidos (ver seccion 5 del doc): Facebook devuelve muro de login; los precios
casi nunca estan publicados; un dominio vencido igual responde 200 (por eso el gate).
"""

import json
import os
import sys
import time
import urllib.request

C4AI = os.environ.get("C4AI_URL", "http://127.0.0.1:11235")
LITELLM = os.environ.get("LITELLM_URL", "http://127.0.0.1:4000")
MODEL = os.environ.get("EXTRACT_MODEL", "gpt-4o-mini")

# Precio gpt-4o-mini USD por 1M tokens. Actualizar si cambia el modelo.
PRICE_IN, PRICE_OUT = 0.15, 0.60

SYSTEM = (
    "Extraes datos de negocios desde el texto de su web para precargar su cuenta. "
    "Regla dura: SOLO datos que aparezcan literalmente en el texto. Si un dato no "
    "aparece, deja null o lista vacia. NUNCA inventes precios, telefonos ni nombres."
)

SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "nombre": {"type": ["string", "null"]},
        "descripcion": {"type": ["string", "null"]},
        "servicios": {"type": "array", "items": {"type": "string"}},
        "telefonos": {"type": "array", "items": {"type": "string"}},
        "direcciones": {"type": "array", "items": {"type": "string"}},
        "horarios": {"type": ["string", "null"]},
        "email": {"type": ["string", "null"]},
        "equipo": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "nombre": {"type": ["string", "null"]},
                    "especialidad": {"type": ["string", "null"]},
                },
                "required": ["nombre", "especialidad"],
            },
        },
        "precios": {
            "type": "array",
            "items": {
                "type": "object",
                "additionalProperties": False,
                "properties": {
                    "servicio": {"type": ["string", "null"]},
                    "precio": {"type": ["string", "null"]},
                },
                "required": ["servicio", "precio"],
            },
        },
    },
    "required": [
        "nombre", "descripcion", "servicios", "telefonos",
        "direcciones", "horarios", "email", "equipo", "precios",
    ],
}


def _post(url, payload, headers, timeout=180):
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode(), headers=headers, method="POST"
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)


def fetch_markdown(url, token):
    """Paso 1: Crawl4AI. Gratis, sin LLM."""
    res = _post(
        f"{C4AI}/md",
        {"url": url, "f": "fit"},
        {"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    md = res.get("markdown")
    if isinstance(md, dict):
        md = md.get("fit_markdown") or ""
    return md or ""


def extract(url, md, key):
    """Paso 2: LiteLLM, una llamada con schema strict."""
    out = _post(
        f"{LITELLM}/v1/chat/completions",
        {
            "model": MODEL,
            "messages": [
                {"role": "system", "content": SYSTEM},
                {"role": "user", "content": f"Texto de la web ({url}):\n\n{md}"},
            ],
            "response_format": {
                "type": "json_schema",
                "json_schema": {"name": "negocio", "strict": True, "schema": SCHEMA},
            },
            "temperature": 0,
        },
        {"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
    )
    usage = out["usage"]
    cost = (
        usage["prompt_tokens"] / 1e6 * PRICE_IN
        + usage["completion_tokens"] / 1e6 * PRICE_OUT
    )
    return json.loads(out["choices"][0]["message"]["content"]), usage, cost


def sanity_gate(data, md):
    """
    Un dominio vencido o una pagina parking responden 200 y traen texto.
    Sin este gate se precarga basura en la cuenta del cliente.
    Devuelve lista de motivos; vacia = el alta sirve.
    """
    problemas = []
    if len(md) < 300:
        problemas.append(f"pagina casi vacia ({len(md)} chars) — posible muro de login")
    if not data.get("servicios") and not data.get("telefonos"):
        problemas.append("sin servicios ni telefonos — no parece la web del negocio")
    if not data.get("nombre"):
        problemas.append("sin nombre de negocio")
    marcadores = ("domain is expired", "renew the domain", "log in to facebook",
                  "this domain is for sale", "buy this domain")
    bajo = md.lower()
    for m in marcadores:
        if m in bajo:
            problemas.append(f"pagina parking/login detectada: '{m}'")
            break
    return problemas


def run(url, token, key):
    t0 = time.time()
    md = fetch_markdown(url, token)
    t_fetch = time.time() - t0

    t1 = time.time()
    data, usage, cost = extract(url, md, key)
    t_llm = time.time() - t1

    problemas = sanity_gate(data, md)
    return {
        "url": url,
        "ok": not problemas,
        "problemas": problemas,
        "md_chars": len(md),
        "fetch_s": round(t_fetch, 2),
        "llm_s": round(t_llm, 2),
        "usage": {k: usage[k] for k in ("prompt_tokens", "completion_tokens", "total_tokens")},
        "cost_usd": round(cost, 6),
        "data": data,
    }


def main(argv):
    if not argv:
        print(__doc__)
        return 2
    try:
        token, key = os.environ["C4AI_TOK"], os.environ["LL_KEY"]
    except KeyError as e:
        print(f"Falta la variable de entorno {e}. Ver el docstring.", file=sys.stderr)
        return 2

    total = 0.0
    for url in argv:
        try:
            r = run(url, token, key)
            total += r["cost_usd"]
        except Exception as e:  # noqa: BLE001 — una URL mala no corta el lote
            r = {"url": url, "ok": False, "problemas": [f"ERROR: {type(e).__name__}: {e}"]}
        print(json.dumps(r, ensure_ascii=False, indent=2))
        print("-" * 70)
    print(f"TOTAL_COST_USD={total:.6f}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))

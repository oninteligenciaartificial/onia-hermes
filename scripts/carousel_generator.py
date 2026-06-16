#!/usr/bin/env python3
"""
Generate ONIA carousel briefs with OpenAI.

Required env:
  OPENAI_API_KEY

Usage:
  carousel-generator --topic "IA para clinicas" --objective "leads" --audience "clinicas dentales" --slides 6
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request


def _env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"Missing env var {name}")
    return value


def _request_openai(payload: dict) -> dict:
    req = urllib.request.Request(
        "https://api.openai.com/v1/responses",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {_env('OPENAI_API_KEY')}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"OpenAI HTTP {exc.code}: {body}") from exc


def _extract_text(response: dict) -> str:
    chunks = []
    for item in response.get("output", []):
        for content in item.get("content", []):
            if content.get("type") == "output_text":
                chunks.append(content.get("text", ""))
    text = "\n".join(chunks).strip()
    if not text:
        raise RuntimeError(f"OpenAI response had no output_text: {response}")
    return text


def _schema() -> dict:
    return {
        "type": "object",
        "additionalProperties": False,
        "properties": {
            "title": {"type": "string"},
            "caption": {"type": "string"},
            "hashtags": {"type": "array", "items": {"type": "string"}},
            "slides": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": False,
                    "properties": {
                        "number": {"type": "integer"},
                        "role": {
                            "type": "string",
                            "enum": ["cover", "stakes", "point", "save", "cta"],
                        },
                        "pill": {"type": "string"},
                        "headline": {"type": "string"},
                        "body": {"type": "string"},
                        "callout": {"type": "string"},
                        "save_worthy": {"type": "boolean"},
                        "visual_prompt": {"type": "string"},
                        "alt_text": {"type": "string"},
                    },
                    "required": [
                        "number",
                        "role",
                        "pill",
                        "headline",
                        "body",
                        "callout",
                        "save_worthy",
                        "visual_prompt",
                        "alt_text",
                    ],
                },
            },
            "cta": {"type": "string"},
            "comment_trigger": {"type": "string"},
        },
        "required": ["title", "caption", "hashtags", "slides", "cta", "comment_trigger"],
    }


# Per-account persona. ONIA = marca empresa; arthur/sergio = cuentas
# personales de los fundadores (mismo motor, voz personal, foto propia de fondo).
ACCOUNTS: dict[str, dict] = {
    "onia": {
        "voice": "voz de marca ONIA: consultiva, directa, util, sin hype",
        "pov": "ONIA, agencia boliviana de diseno web + automatizacion con IA",
        "angle": "resultado de negocio: captar, convertir, automatizar",
    },
    "arthur": {
        "voice": "voz personal de Arthur, fundador. Build-in-public, primera persona",
        "pov": "Arthur, socio de ONIA, contando lo que aprende construyendo el negocio",
        "angle": "lecciones reales, detras de escena, opinion personal sobre IA y ventas",
    },
    "sergio": {
        "voice": "voz personal de Sergio Urcullo, fundador. Primera persona, cercana",
        "pov": "Sergio, fundador de ONIA, emprendedor en Bolivia",
        "angle": "vision, lecciones de emprender con IA, autoridad personal",
    },
}

# Las 5 reglas del carrusel ONIA (instrucciones del cliente, no negociables).
CAROUSEL_RULES = (
    "REGLAS DEL CARRUSEL (obligatorias):\n"
    "1. PORTADA (role=cover): unico objetivo = frenar el scroll. NO explica el tema, "
    "NO te representa, rompe el patron visual. Headline 5-9 palabras, promesa clara o "
    "un numero. Sin contexto previo. body = una linea muy corta de refuerzo o vacia.\n"
    "2. SLIDE 2 (role=stakes): confirma el hook o se van. Planteas el problema y subes "
    "lo que esta en juego. Si al leerla no piensan 'esto me interesa', se fueron.\n"
    "3. CADA SLIDE (role=point) funciona como screenshot suelto: pega aun sin contexto. "
    "Una sola idea por slide. Nada de relleno.\n"
    "4. SLIDE GUARDABLE (exactamente una con role=save y save_worthy=true): un framework, "
    "un prompt, un fill-in-the-blank o una frase citable. Convierte alcance en saves. "
    "Si ninguna slide merece guardarse, el carrusel entero no sirve.\n"
    "5. CIERRE (ultima slide, role=cta): el CTA es el motor. NO uses 'sigueme para mas'. "
    "Repite la idea, suma contexto y mete un comment_trigger (una palabra a comentar) que "
    "arranque DMs y reparta un recurso. body de la slide cta debe incluir esa instruccion.\n"
    "Estructura: slide 1=cover, slide 2=stakes, una slide=save, ultima=cta, resto=point. "
    "Maximo 2 ideas visuales, alto contraste, una idea por slide. caption = segundo post: "
    "repite la idea, suma contexto, termina con el comment_trigger.\n\n"
    "FORMATO DE CAMPOS:\n"
    "- headline: resalta EXACTAMENTE una palabra o cifra clave entre asteriscos, ej "
    "'Invertí en *captar* con IA'. Sin asteriscos en el resto.\n"
    "- pill: etiqueta corta de categoria (1-2 palabras), ej 'Automatizacion', 'El problema', "
    "'Framework', 'Empeza hoy'.\n"
    "- callout: frase corta opcional tipo nota flotante (puede ser cadena vacia ''). "
    "Usala para subir tension o dar un dato, ej 'Tu competencia ya lo automatizo'.\n"
    "- body: 1-2 frases, puede llevar una palabra entre asteriscos."
)


def generate(
    topic: str,
    objective: str,
    audience: str,
    slides: int,
    references: str,
    account: str = "onia",
) -> dict:
    persona = ACCOUNTS.get(account, ACCOUNTS["onia"])
    system = (
        "Eres Hermes, generador de carruseles de ONIA, agencia boliviana de diseno web "
        "e IA. Responde solo JSON. Usa Pinterest solo como referencia estructural si se "
        "entregan URLs: no copies textos, layouts exactos, imagenes, marcas ni claims de "
        "terceros. Extrae solo patrones de hook, narrativa, ritmo, jerarquia y CTA. "
        f"Voz de esta cuenta: {persona['voice']}. Punto de vista: {persona['pov']}. "
        f"Angulo: {persona['angle']}. "
        "Adapta a negocios bolivianos, pymes, clinicas dentales, ventas, automatizacion, "
        "WhatsApp, Chatwoot, n8n y procesos con IA.\n\n" + CAROUSEL_RULES
    )
    user = {
        "topic": topic,
        "objective": objective,
        "audience": audience,
        "slides": slides,
        "account": account,
        "pinterest_references": references,
        "brand": {
            "name": "ONIA",
            "location": "Santa Cruz, Bolivia",
            "offers": [
                "diseno y desarrollo web",
                "automatizaciones con IA",
                "n8n y Chatwoot",
                "DentalGest para clinicas dentales",
            ],
            "tone": "claro, consultivo, directo, util para negocios bolivianos",
        },
        "style_rules": {
            "voice": "espanol claro, practico, sin hype",
            "visual_direction": "profesional B2B, ONIA green as accent, one idea per slide",
            "reference_policy": "use references as style direction only; never copy third-party assets",
            "preferred_angles": [
                "errores que hacen perder leads",
                "procesos que ya no deberian hacerse a mano",
                "antes y despues de automatizar",
                "checklist para saber si un negocio esta listo para IA",
                "flujo Instagram/WhatsApp -> Chatwoot -> n8n -> seguimiento",
            ],
        },
    }
    payload = {
        "model": os.environ.get("OPENAI_TEXT_MODEL", "gpt-4.1-mini"),
        "input": [
            {"role": "system", "content": system},
            {"role": "user", "content": json.dumps(user, ensure_ascii=False)},
        ],
        "text": {
            "format": {
                "type": "json_schema",
                "name": "onia_carousel_brief",
                "schema": _schema(),
                "strict": True,
            }
        },
    }
    response = _request_openai(payload)
    return json.loads(_extract_text(response))


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--topic", required=True)
    parser.add_argument("--objective", default="generar leads")
    parser.add_argument("--audience", default="empresas y emprendedores de Bolivia")
    parser.add_argument("--slides", type=int, default=6)
    parser.add_argument("--references", default="")
    parser.add_argument("--account", default="onia", choices=list(ACCOUNTS.keys()))
    args = parser.parse_args(argv)
    if args.slides < 3 or args.slides > 10:
        raise RuntimeError("slides must be between 3 and 10")
    result = generate(
        args.topic, args.objective, args.audience, args.slides, args.references, args.account
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        raise SystemExit(2)

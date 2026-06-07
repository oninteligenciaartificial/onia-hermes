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
                        "headline": {"type": "string"},
                        "body": {"type": "string"},
                        "visual_prompt": {"type": "string"},
                        "alt_text": {"type": "string"},
                    },
                    "required": [
                        "number",
                        "headline",
                        "body",
                        "visual_prompt",
                        "alt_text",
                    ],
                },
            },
            "cta": {"type": "string"},
        },
        "required": ["title", "caption", "hashtags", "slides", "cta"],
    }


def generate(topic: str, objective: str, audience: str, slides: int, references: str) -> dict:
    system = (
        "Eres Hermes, asistente de ONIA, una agencia boliviana de diseno web e IA. "
        "Crea carruseles originales para Instagram y LinkedIn. Responde solo JSON. "
        "Usa Pinterest solo como referencia estructural si se entregan URLs: no copies "
        "textos, layouts exactos, imagenes, marcas ni claims de terceros. Extrae solo "
        "patrones de hook, narrativa, ritmo, jerarquia visual, confianza y CTA. "
        "Adapta todo a ONIA: negocios bolivianos, pymes, clinicas dentales, ventas, "
        "automatizacion, WhatsApp, Chatwoot, n8n y procesos con IA."
    )
    user = {
        "topic": topic,
        "objective": objective,
        "audience": audience,
        "slides": slides,
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
    args = parser.parse_args(argv)
    if args.slides < 3 or args.slides > 10:
        raise RuntimeError("slides must be between 3 and 10")
    result = generate(args.topic, args.objective, args.audience, args.slides, args.references)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        raise SystemExit(2)

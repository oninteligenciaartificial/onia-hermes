#!/usr/bin/env python3
"""ONIA daily Video Lab brief — deterministic cron script (no_agent mode).

Runs once per day for the ONIA account only:

1. Asks an LLM (Groq, high TPM) for ONE ONIA reel idea as strict JSON.
2. Registers it as a real Video Lab job via ``video-lab create_brief`` so it
   enters the approval state machine with a genuine ``job_id``.
3. Prints a Telegram-ready message (guion + real job_id + next step).

Why a script instead of an agent prompt: weak/cheap models invent fake job ids
and skip tool calls. This path is deterministic — the job is always created and
the id in the message is always real.
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import urllib.request
import urllib.error

GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.environ.get("ONIA_VL_MODEL", "llama-3.3-70b-versatile")
VIDEO_LAB = os.environ.get("ONIA_VIDEO_LAB_BIN", "video-lab")

SYSTEM = (
    "Eres estratega de contenido de ONIA, agencia de automatizacion e IA para "
    "negocios (DentalGest, Gesti-OS, CRM, chatbots, seguimiento de leads). "
    "Generas guiones de Reel verticales 9:16 de alta retencion. Respondes SOLO "
    "con JSON valido, sin texto extra."
)

USER = (
    "Crea UN guion de Reel para la cuenta de ONIA para hoy. Tema de alto valor "
    "(automatizacion, DentalGest, Gesti-OS, CRM, chatbots, seguimiento de leads "
    "o demo de sistema). No inventes datos, resultados ni testimonios.\n\n"
    "Devuelve SOLO este JSON:\n"
    "{\n"
    '  "topic": "tema corto",\n'
    '  "objective": "objetivo comercial",\n'
    '  "hook": "hook fuerte para los primeros 2 segundos",\n'
    '  "script": ["linea1","linea2","linea3","linea4","linea5"],\n'
    '  "shot_list": ["toma1","toma2","toma3","toma4","toma5"],\n'
    '  "higgsfield_prompt": "prompt para video vertical 9:16 estilo demo/dashboard/antes-despues, premium, retencion alta, subtitulos limpios, sin logos de terceros, visuales originales",\n'
    '  "caption": "caption con CTA"\n'
    "}"
)


def _fail(msg: str) -> None:
    print(f"No pude generar el guion ONIA de hoy: {msg}")
    sys.exit(0)  # exit 0 so the cron delivers the message instead of erroring


def _ask_llm() -> dict:
    key = os.environ.get("GROQ_API_KEY", "").strip()
    if not key:
        _fail("GROQ_API_KEY no configurada")
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": USER},
        ],
        "response_format": {"type": "json_object"},
        "temperature": 0.8,
    }
    req = urllib.request.Request(
        GROQ_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "User-Agent": "onia-videolab/1.0",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        _fail(f"LLM HTTP {exc.code}: {exc.read().decode('utf-8', 'replace')[:200]}")
    except Exception as exc:  # noqa: BLE001
        _fail(f"LLM error: {exc}")
    try:
        content = body["choices"][0]["message"]["content"]
        return json.loads(content)
    except Exception as exc:  # noqa: BLE001
        _fail(f"respuesta LLM no es JSON valido: {exc}")


def _create_job(idea: dict) -> dict:
    def _clean(value: str) -> str:
        return str(value or "").replace("\n", " ").strip()

    script = idea.get("script") or []
    shots = idea.get("shot_list") or []
    args = [
        VIDEO_LAB, "create_brief",
        "--lane", "onia",
        "--topic", _clean(idea.get("topic")) or "ONIA contenido",
        "--objective", _clean(idea.get("objective")) or "generar demanda y demos",
        "--hook", _clean(idea.get("hook")),
        "--script", "|".join(_clean(s) for s in script if _clean(s)),
        "--shot-list", "|".join(_clean(s) for s in shots if _clean(s)),
        "--higgsfield-prompt", _clean(idea.get("higgsfield_prompt")),
        "--caption", _clean(idea.get("caption")),
    ]
    try:
        proc = subprocess.run(args, capture_output=True, text=True, timeout=60, check=False)
        return json.loads(proc.stdout)
    except Exception as exc:  # noqa: BLE001
        _fail(f"no pude registrar el job en Video Lab: {exc}")


def _format(job: dict) -> str:
    lines = [
        "Guion ONIA del dia (Video Lab)",
        "",
        f"Tema: {job.get('topic', '')}",
        f"Hook: {job.get('hook', '')}",
        "",
        "Guion:",
    ]
    for i, s in enumerate(job.get("script", []), 1):
        lines.append(f"{i}. {s}")
    if job.get("shot_list"):
        lines.append("")
        lines.append("Tomas:")
        for s in job.get("shot_list", []):
            lines.append(f"- {s}")
    lines.append("")
    lines.append(f"Caption: {job.get('caption', '')}")
    lines.append("")
    lines.append(f"job_id: {job.get('job_id', '')}")
    lines.append(f"Para generar el video: responde  Aprobar video {job.get('job_id', '')}")
    return "\n".join(lines)


def main() -> int:
    idea = _ask_llm()
    job = _create_job(idea)
    print(_format(job))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

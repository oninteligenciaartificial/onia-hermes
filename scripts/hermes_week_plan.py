#!/usr/bin/env python3
"""
Hermes weekly operating plan.

Read-only planner that turns the active Hermes cadence into a short weekly
agenda with exact next commands. It does not publish, contact prospects or
modify production state.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import subprocess
import sys
from datetime import datetime, timedelta, timezone


SCRIPTS_DIR = Path(__file__).resolve().parent
PYTHON = sys.executable or "python"

DAY_NAMES = [
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
    "domingo",
]


WEEK_TEMPLATE = [
    {
        "day": "lunes",
        "theme": "Kickoff semanal y foco",
        "technical": "Revisar salud de Hermes, Video Lab, asset server e Instagram.",
        "content": "Elegir el tema principal de ONIA y el video informal de Sergio.",
        "operations": "Confirmar bloqueos, credenciales pendientes y tablero de semana.",
        "command": "Estado Semana",
    },
    {
        "day": "martes",
        "theme": "Prospeccion ONIA",
        "technical": "Preparar lista corta de nichos y criterios de scoring.",
        "content": "Convertir dolores de prospectos en 3 hooks de contenido.",
        "operations": "Actualizar CRM/Notion solo con datos confirmados.",
        "command": "Planifica prospeccion ONIA",
    },
    {
        "day": "miercoles",
        "theme": "Sprint tecnico/producto",
        "technical": "Avanzar integraciones Hermes: Video Lab, dashboard, n8n o asset pipeline.",
        "content": "Grabar o preparar demo corta de lo construido.",
        "operations": "Registrar decisiones tecnicas y riesgos.",
        "command": "Genera video Sergio: que estoy construyendo esta semana en ONIA",
    },
    {
        "day": "jueves",
        "theme": "Produccion de contenido",
        "technical": "Validar URLs publicas de assets antes de publicar.",
        "content": "Crear 1 carrusel ONIA y 1 Reel/brief ONIA.",
        "operations": "Pedir aprobacion explicita de caption y assets.",
        "command": "Genera carrusel ONIA: automatizar seguimiento de leads | generar leads | pymes",
    },
    {
        "day": "viernes",
        "theme": "Finanzas y operaciones",
        "technical": "Revisar logs, backups y tokens que vencen.",
        "content": "Reciclar aprendizajes de la semana en una historia o post corto.",
        "operations": "Revisar ingresos/gastos, impuestos y pendientes administrativos.",
        "command": "Estado Semana",
    },
    {
        "day": "sabado",
        "theme": "Marca personal Sergio",
        "technical": "Preparar capturas o b-roll del workspace/dashboard.",
        "content": "Crear historia o video informal building in public.",
        "operations": "Separar contenido personal de ONIA.",
        "command": "Genera historia Sergio: detras de camaras construyendo ONIA",
    },
    {
        "day": "domingo",
        "theme": "Revision semanal",
        "technical": "Listar que quedo funcionando y que se rompe.",
        "content": "Elegir aprendizajes para la semana siguiente.",
        "operations": "Cerrar bloqueos y definir top 3 prioridades.",
        "command": "Estado Semana",
    },
]


def _run(cmd: list[str], timeout: int = 30) -> dict:
    real_cmd = _local_command(cmd)
    try:
        proc = subprocess.run(real_cmd, text=True, capture_output=True, timeout=timeout, check=False)
    except FileNotFoundError as exc:
        return {"code": 127, "stdout": "", "stderr": str(exc), "cmd": cmd, "resolved_cmd": real_cmd}
    return {
        "code": proc.returncode,
        "stdout": proc.stdout.strip(),
        "stderr": proc.stderr.strip(),
        "cmd": cmd,
        "resolved_cmd": real_cmd,
    }


def _local_command(cmd: list[str]) -> list[str]:
    if not cmd:
        return cmd
    replacements = {
        "hermes-week-status": [PYTHON, str(SCRIPTS_DIR / "hermes_week_status.py")],
        "video-lab": [PYTHON, str(SCRIPTS_DIR / "video_lab.py")],
    }
    if cmd[0] in replacements:
        return replacements[cmd[0]] + cmd[1:]
    return cmd


def _safe_json(result: dict) -> dict:
    try:
        return json.loads(result["stdout"])
    except Exception:
        return {"ok": False, "raw": result.get("stdout", ""), "stderr": result.get("stderr", "")}


def _monday(today: datetime) -> datetime:
    return today - timedelta(days=today.weekday())


def _status() -> dict:
    return {
        "week_status": _safe_json(_run(["hermes-week-status"])),
        "video_next": _safe_json(_run(["video-lab", "next", "--limit", "5"])),
    }


def build_plan(args: argparse.Namespace) -> dict:
    today = datetime.now(timezone.utc)
    monday = _monday(today)
    status = _status()
    video_jobs = status["video_next"].get("jobs", [])
    ig_ok = bool(status["week_status"].get("instagram", {}).get("ok"))

    days = []
    for offset, item in enumerate(WEEK_TEMPLATE):
        date = monday + timedelta(days=offset)
        days.append(
            {
                "date": date.date().isoformat(),
                "day": item["day"],
                "theme": item["theme"],
                "priority_1": item["technical"],
                "priority_2": item["content"],
                "priority_3": item["operations"],
                "recommended_block": _block_for(item["day"]),
                "suggested_command": item["command"],
            }
        )

    blockers = []
    if not ig_ok:
        blockers.append("Meta token vencido o invalido: no publicar en Instagram hasta rotarlo.")
    if not status["week_status"].get("n8n_services") and not status["week_status"].get("n8n_http", {}).get("ok"):
        blockers.append("n8n no detectado: mantener Hermes cron como scheduler.")
    if not video_jobs:
        blockers.append("Video Lab sin jobs accionables: crear briefs seguros para arrancar.")

    plan = {
        "ok": True,
        "week_start": monday.date().isoformat(),
        "week_end": (monday + timedelta(days=6)).date().isoformat(),
        "mode": "approval_first",
        "rules": [
            "Los crons proponen, resumen y organizan.",
            "No publicar ni contactar prospectos sin aprobacion explicita.",
            "No usar videos con cara IA sin revision manual.",
            "n8n queda como fase 2; Hermes cron sigue activo.",
        ],
        "days": days,
        "blockers": blockers,
        "next_commands": [
            "Estado Semana",
            "Siguiente Video Lab",
            "Genera video Sergio: que estoy construyendo esta semana en ONIA",
            "Genera Reel ONIA: automatizar seguimiento de leads | generar leads",
        ],
        "telegram_reply": _format_telegram(days, blockers, video_jobs),
        "status": status,
    }
    if args.day:
        wanted = args.day.lower()
        plan["days"] = [day for day in days if day["day"] == wanted or day["date"] == wanted]
        plan["telegram_reply"] = _format_telegram(plan["days"], blockers, video_jobs)
    return plan


def _block_for(day: str) -> str:
    if day in {"lunes", "miercoles"}:
        return "08:30-10:30 tecnico/producto; 12:00 contenido; 18:00 revision Video Lab"
    if day == "martes":
        return "09:30 prospeccion; 11:00 CRM; 16:00 follow-up contenido"
    if day == "jueves":
        return "10:00 produccion contenido; 14:00 assets; 18:00 aprobaciones"
    if day == "viernes":
        return "10:00 cierre tecnico; 15:00 finanzas/ops; 18:00 resumen"
    if day == "sabado":
        return "10:00 marca personal; 12:00 historias; 16:00 descanso/ideas"
    return "17:00 revision semanal; 18:00 plan preliminar"


def _format_telegram(days: list[dict], blockers: list[str], video_jobs: list[dict]) -> str:
    focus = days[0] if days else WEEK_TEMPLATE[0]
    lines = [
        "Plan Semana Hermes",
        f"Hoy/foco: {focus.get('day')} - {focus.get('theme')}",
        f"Prioridad 1: {focus.get('priority_1')}",
        f"Prioridad 2: {focus.get('priority_2')}",
        f"Prioridad 3: {focus.get('priority_3')}",
        f"Bloque recomendado: {focus.get('recommended_block')}",
        f"Comando sugerido: {focus.get('suggested_command')}",
    ]
    if video_jobs:
        lines.append(f"Video Lab: {len(video_jobs)} job(s) accionables. Usa: Siguiente Video Lab")
    else:
        lines.append("Video Lab: sin jobs accionables. Crear briefs seguros esta semana.")
    if blockers:
        lines.append("Riesgos/bloqueos:")
        lines.extend(f"- {item}" for item in blockers[:3])
    lines.append("Decision que necesito de Sergio: aprobar el primer brief antes de generar/publicar.")
    return "\n".join(lines)


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(prog="hermes-week-plan")
    parser.add_argument("--day", default="", help="day name or YYYY-MM-DD")
    args = parser.parse_args(argv)
    print(json.dumps(build_plan(args), ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        raise SystemExit(2)

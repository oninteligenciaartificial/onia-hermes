#!/usr/bin/env python3
"""
Hermes Telegram command center.

This router is intentionally deterministic. It gives Telegram one safe entry
point for ONIA operations and delegates specialized work to existing scripts.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path


SCRIPTS_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPTS_DIR.parent
PYTHON = sys.executable or "python3"

VIDEO_PREFIXES = (
    "crea avatar sergio:",
    "avatar sergio:",
    "genera video sergio:",
    "genera reel onia:",
    "crea video cliente:",
    "estado video lab",
    "siguiente video lab",
    "aprobar video ",
    "rehacer video ",
    "video generado ",
    "publicar video ",
    "archivar video ",
)

PROJECT_COMMANDS = {
    "prepara venta dentalgest:": "dentalgest",
    "prepara venta gestios:": "gestios",
    "prepara venta gesti-os:": "gestios",
    "prepara venta web onia:": "websites",
    "prepara marketing higgsfield:": "higgsfield-marketing",
    "prepara consultoria onia:": "onia-consulting",
}

ACTIONABLE_VIDEO_STATES = {
    "waiting_approval",
    "approved_for_generation",
    "generating",
    "avatar_review_pending",
    "generated",
    "needs_revision",
    "approved_for_publish",
    "failed",
}


def _normalize(message: str) -> str:
    return re.sub(r"\s+", " ", message.strip())


def _run_script(script_name: str, args: list[str], timeout: int = 60) -> dict:
    script = SCRIPTS_DIR / script_name
    cmd = [PYTHON, str(script), *args]
    try:
        proc = subprocess.run(cmd, text=True, capture_output=True, timeout=timeout, check=False)
    except FileNotFoundError as exc:
        return {
            "ok": False,
            "cmd": cmd,
            "code": 127,
            "stdout": "",
            "stderr": str(exc),
        }
    result = {
        "ok": proc.returncode == 0,
        "cmd": cmd,
        "code": proc.returncode,
        "stdout": proc.stdout.strip(),
        "stderr": proc.stderr.strip(),
    }
    try:
        parsed = json.loads(proc.stdout)
    except Exception:
        parsed = {}
    if parsed:
        result["json"] = parsed
    return result


def _load_reference(name: str) -> dict:
    candidates = [
        REPO_ROOT / "hermes-content" / "references" / name,
        Path("/root/.hermes/references") / name,
        SCRIPTS_DIR.parent / "references" / name,
    ]
    for path in candidates:
        if path.exists():
            return json.loads(path.read_text("utf-8"))
    return {}


def _hermes_home() -> Path:
    configured = os.environ.get("HERMES_HOME")
    if configured:
        return Path(configured)
    if os.name == "nt":
        return REPO_ROOT / ".hermes"
    return Path("/root/.hermes")


def _append_event(action: str, ok: bool, reply: str, payload: dict = None) -> None:
    home = _hermes_home()
    event = {
        "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "source": "hermes-command-center",
        "action": action,
        "ok": ok,
        "summary": (reply or "")[:1400],
    }
    if payload:
        event["payload"] = payload
    for relative in (
        Path("logs") / "command-center-events.jsonl",
        Path("notion-outbox") / "command-center-events.jsonl",
    ):
        path = home / relative
        try:
            path.parent.mkdir(parents=True, exist_ok=True)
            with path.open("a", encoding="utf-8") as fh:
                fh.write(json.dumps(event, ensure_ascii=False) + "\n")
        except OSError:
            continue


def _dispatch(action: dict, payload: dict = None) -> dict:
    _append_event(
        str(action.get("action", "unknown")),
        bool(action.get("ok")),
        str(action.get("telegram_reply", "")),
        payload,
    )
    return action


def _project_by_id(project_id: str) -> dict:
    registry = _load_reference("onia-projects-registry.json")
    for project in registry.get("projects", []):
        if project.get("id") == project_id:
            return project
    return {}


def _all_projects() -> list[dict]:
    registry = _load_reference("onia-projects-registry.json")
    return registry.get("projects", [])


def _project_summary(project: dict) -> dict:
    return {
        "id": project.get("id"),
        "name": project.get("name"),
        "type": project.get("type"),
        "primary_audience": project.get("primary_audience"),
        "primary_offer": project.get("primary_offer"),
        "secondary_offers": project.get("secondary_offers", [])[:3],
        "recommended_channels": project.get("recommended_channels", [])[:4],
        "default_cta": project.get("default_cta"),
        "crm_tags": project.get("crm_tags", []),
    }


def _video_router(message: str) -> dict:
    result = _run_script("video_lab.py", ["telegram", "--message", message], timeout=120)
    if result.get("json"):
        return result["json"]
    return {
        "ok": False,
        "action": "delegate_video_lab",
        "telegram_reply": "Video Lab no devolvio JSON valido. Revisa logs del VPS antes de continuar.",
        "delegate": result,
    }


def _weekly_status() -> dict:
    result = _run_script("hermes_week_status.py", [], timeout=60)
    data = result.get("json") or result
    reply = data.get("telegram_reply") or "No pude leer Estado Semana. Revisa Hermes en VPS."
    return {"ok": bool(data.get("ok")), "action": "weekly_status", "telegram_reply": reply, "result": data}


def _weekly_plan(message: str) -> dict:
    lower = message.lower()
    args: list[str] = []
    match = re.search(r"plan\s+(lunes|martes|miercoles|jueves|viernes|sabado|domingo)", lower)
    if match:
        args = ["--day", match.group(1)]
    result = _run_script("hermes_week_plan.py", args, timeout=60)
    data = result.get("json") or result
    reply = data.get("telegram_reply") or "No pude generar Plan Semana. Revisa Hermes en VPS."
    return {"ok": bool(data.get("ok")), "action": "weekly_plan", "telegram_reply": reply, "result": data}


def _project_map() -> dict:
    projects = _all_projects()
    if not projects:
        return {
            "ok": False,
            "action": "project_map",
            "telegram_reply": "No encontre onia-projects-registry.json. Pendiente revisar referencias Hermes.",
        }
    lines = ["Mapa proyectos ONIA:"]
    for project in projects:
        lines.append(f"- {project.get('name')}: {project.get('primary_offer')}")
    lines.extend(
        [
            "",
            "Comandos utiles:",
            "Prepara venta DentalGest: <clinica>",
            "Prepara venta Gestios: <empresa>",
            "Prepara marketing Higgsfield: <negocio> | <oferta>",
            "Orquesta ONIA: <empresa o rubro> | <objetivo>",
        ]
    )
    return {
        "ok": True,
        "action": "project_map",
        "telegram_reply": "\n".join(lines),
        "projects": [_project_summary(project) for project in projects],
    }


def _prepare_project(project_id: str, payload: str) -> dict:
    project = _project_by_id(project_id)
    if not project:
        return {
            "ok": False,
            "action": "prepare_project",
            "telegram_reply": f"No encontre proyecto {project_id} en el registro ONIA.",
        }
    signals = project.get("pain_signals", [])[:3]
    channels = project.get("recommended_channels", [])[:3]
    secondary = project.get("secondary_offers", [])[:2]
    lines = [
        f"Proyecto: {project.get('name')}",
        f"Prospecto/rubro: {payload or 'pendiente'}",
        f"Oferta primaria: {project.get('primary_offer')}",
        f"Oferta secundaria: {', '.join(secondary) if secondary else 'segun diagnostico'}",
        f"Dolor probable: {signals[0] if signals else 'pendiente de investigar'}",
        f"Canal recomendado: {', '.join(channels) if channels else 'pendiente'}",
        f"CTA: {project.get('default_cta')}",
        "Aprobacion necesaria: contactar/publicar requiere aprobacion explicita.",
        "Siguiente accion: preparar mensaje y registrar en CRM, sin enviar todavia.",
    ]
    return {
        "ok": True,
        "action": "prepare_project",
        "project_id": project_id,
        "telegram_reply": "\n".join(lines),
        "project": _project_summary(project),
    }


def _video_status(limit: int = 12) -> dict:
    result = _run_script("video_lab.py", ["status", "--limit", str(limit)], timeout=60)
    return result.get("json") or {"ok": False, "jobs": [], "delegate": result}


def _video_next(limit: int = 12) -> dict:
    result = _run_script("video_lab.py", ["next", "--limit", str(limit)], timeout=60)
    return result.get("json") or {"ok": False, "jobs": [], "telegram_reply": "", "delegate": result}


def _command_for_video_job(job: dict) -> str:
    job_id = job.get("job_id", "")
    state = job.get("state")
    if state == "waiting_approval":
        return f"Aprobar video {job_id}"
    if state == "approved_for_generation":
        return f"Renderizar en Higgsfield y luego: Video generado {job_id}: <url_video>"
    if state == "generating":
        return f"Revisar Higgsfield. Si termino: Video generado {job_id}: <url_video>"
    if state == "avatar_review_pending":
        return f"Validar identidad de Sergio antes de publicar: Estado Video Lab {job_id}"
    if state == "generated":
        return f"Revisar MP4. Si esta listo: Publicar video {job_id}"
    if state == "needs_revision":
        return f"Rehacer video {job_id}: <cambio>"
    if state == "approved_for_publish":
        return f"Publicar video {job_id}"
    if state == "failed":
        return f"Rehacer video {job_id}: corregir error"
    return ""


def _video_jobs_by_state(states: set[str], limit: int = 12) -> list[dict]:
    data = _video_status(limit=limit)
    jobs = data.get("jobs", [])
    return [job for job in jobs if job.get("state") in states]


def _format_video_jobs(title: str, jobs: list[dict], empty: str) -> str:
    if not jobs:
        return empty
    lines = [title]
    for job in jobs[:8]:
        command = job.get("command") or _command_for_video_job(job)
        lines.append(f"- {job.get('job_id')} | {job.get('lane')} | {job.get('state')}")
        lines.append(f"  Tema: {job.get('topic')}")
        if job.get("hook"):
            lines.append(f"  Hook: {job.get('hook')}")
        if command:
            lines.append(f"  Comando: {command}")
    return "\n".join(lines)


def _daily_content_queue() -> dict:
    next_data = _video_next(limit=6)
    next_jobs = next_data.get("jobs", [])
    lines = [
        "Cola diaria de contenido ONIA:",
        "1. Sergio: pieza fundador/proceso. Prioridad: confianza y construccion real.",
        "   Comando: Genera video Sergio: <idea concreta del dia>",
        "2. ONIA: pieza demo/sistema. Prioridad: vender DentalGest, Gesti-OS o automatizacion.",
        "   Comando: Genera Reel ONIA: <tema> | <objetivo comercial>",
        "3. Cliente/servicio: si hay prospecto caliente, preparar UGC seguro.",
        "   Comando: Crea video cliente: <negocio> | <oferta> | <estilo>",
        "4. Reutilizacion: convertir una pieza aprobada en caption IG, TikTok, Shorts y LinkedIn.",
        "",
        "Regla: esto propone y ordena. No genera, no publica y no contacta sin aprobacion.",
    ]
    if next_jobs:
        lines.append("")
        lines.append("Acciones Video Lab pendientes:")
        for job in next_jobs[:5]:
            lines.append(f"- {job.get('job_id')} | {job.get('state')} | {job.get('topic')}")
            lines.append(f"  Comando: {job.get('command') or _command_for_video_job(job)}")
    else:
        lines.append("")
        lines.append("Video Lab no tiene pendientes accionables ahora.")
    return {
        "ok": True,
        "action": "daily_content_queue",
        "telegram_reply": "\n".join(lines),
        "video_lab": next_data,
    }


def _creative_radar() -> dict:
    lines = [
        "Radar creativo ONIA:",
        "- Buscar hoy: IA aplicada a negocios, Reels/Shorts de demos, UGC B2B, automatizacion y casos reales.",
        "- Producir primero: 1 pieza Sergio mostrando proceso real y 1 pieza ONIA mostrando sistema.",
        "- Angulos utiles: dolor visible, antes/despues operativo, pantalla limpia, costo de seguir en Excel/WhatsApp.",
        "- No copiar creadores: extraer hook, ritmo, escenas, retencion y CTA.",
        "",
        "Ideas listas para pedir por Telegram:",
        "1. Genera video Sergio: por que un sistema simple vende mas que responder a mano",
        "2. Genera Reel ONIA: DentalGest agenda y seguimiento | pedir demo corta",
        "3. Genera Reel ONIA: Gesti-OS convierte Excel en tablero operativo | ver tablero simple",
        "4. Prepara marketing Higgsfield: clinica dental | demo de agenda sin datos privados",
        "",
        "Nota: este radar es seguro/local. Para tendencias virales exactas, investigar fuentes actuales antes de usar claims.",
    ]
    return {"ok": True, "action": "creative_radar", "telegram_reply": "\n".join(lines)}


def _approval_reminders() -> dict:
    jobs = _video_jobs_by_state({"waiting_approval", "generated", "needs_revision", "approved_for_publish", "avatar_review_pending"})
    reply = _format_video_jobs(
        "Recordatorios Video Lab:",
        jobs,
        "Recordatorios Video Lab: no hay aprobaciones, revisiones o publicaciones pendientes.",
    )
    if jobs:
        reply += "\n\nAprobacion valida: comando exacto con job_id. No usar 'ok' o 'dale'."
    return {"ok": True, "action": "video_approval_reminders", "telegram_reply": reply, "jobs": jobs}


def _higgsfield_watcher() -> dict:
    jobs = _video_jobs_by_state({"approved_for_generation", "generating", "avatar_review_pending", "generated", "failed"})
    reply = _format_video_jobs(
        "Watcher Higgsfield:",
        jobs,
        "Watcher Higgsfield: no hay videos aprobados para generar ni renders pendientes en Video Lab.",
    )
    reply += "\n\nRegla: Higgsfield se usa solo despues de aprobacion del brief; publicar requiere `Publicar video <job_id>`."
    return {"ok": True, "action": "higgsfield_watcher", "telegram_reply": reply, "jobs": jobs}


def _platform_copy_queue() -> dict:
    jobs = _video_jobs_by_state({"waiting_approval", "approved_for_generation", "generated", "approved_for_publish"})
    lines = [
        "Platform Copy Queue:",
        "- Instagram: caption con hook, valor, CTA y 3-8 hashtags utiles.",
        "- TikTok: descripcion corta, lenguaje directo, CTA simple.",
        "- YouTube Shorts: titulo claro + descripcion con contexto y tags.",
        "- LinkedIn: aprendizaje/negocio, no solo promo.",
        "- WhatsApp automatico sigue bloqueado hasta verificacion Meta.",
    ]
    if jobs:
        lines.append("")
        lines.append("Piezas para adaptar:")
        for job in jobs[:6]:
            lines.append(f"- {job.get('job_id')} | {job.get('state')} | {job.get('topic')}")
            lines.append(f"  CTA: {job.get('cta') or 'usar CTA del brief'}")
    else:
        lines.append("")
        lines.append("No encontre piezas listas para adaptar ahora.")
    return {"ok": True, "action": "platform_copy_queue", "telegram_reply": "\n".join(lines), "jobs": jobs}


def _crm_followups_today() -> dict:
    lines = [
        "Seguimientos ONIA hoy:",
        "- Revisar CRM/Notion: prospectos con siguiente contacto vencido o caliente.",
        "- Preparar mensaje humano por canal; no enviar automatico.",
        "- Registrar vendedor_origen, responsable_actual, estado, proximo paso y fecha.",
        "- Prioridad: DentalGest clinicas, Gesti-OS pymes con Excel, webs sin captacion, videos Higgsfield.",
        "",
        "Comandos utiles:",
        "Prepara venta DentalGest: <clinica>",
        "Prepara venta Gestios: <empresa>",
        "Prepara marketing Higgsfield: <negocio> | <oferta>",
        "",
        "Pendiente tecnico: n8n no tiene credencial Notion conectada. Hermes deja outbox local para sincronizar cuando exista.",
    ]
    return {"ok": True, "action": "crm_followups_today", "telegram_reply": "\n".join(lines)}


def _notion_outbox_status() -> dict:
    home = _hermes_home()
    outbox = home / "notion-outbox" / "command-center-events.jsonl"
    count = 0
    if outbox.exists():
        try:
            count = len(outbox.read_text("utf-8").splitlines())
        except OSError:
            count = 0
    lines = [
        "Registro Hermes:",
        f"- Outbox local: {outbox}",
        f"- Eventos pendientes/apilados: {count}",
        "- n8n todavia no tiene credencial Notion; por eso no sincronizo directo.",
        "- Cuando exista credencial Notion en n8n, crear workflow: outbox -> Notion CRM/Tareas/Reportes.",
    ]
    return {"ok": True, "action": "notion_outbox_status", "telegram_reply": "\n".join(lines)}


def _orchestrate_onia(payload: str) -> dict:
    parts = [part.strip() for part in payload.split("|") if part.strip()]
    subject = parts[0] if parts else payload.strip()
    objective = parts[1] if len(parts) > 1 else "vender sin accion client-facing automatica"
    text = f"{subject} {objective}".lower()
    if any(token in text for token in ("dental", "odont", "clinica")):
        project_id = "dentalgest"
    elif any(token in text for token in ("excel", "operacion", "tarea", "inventario", "report")):
        project_id = "gestios"
    elif any(token in text for token in ("video", "contenido", "reel", "ugc", "higgsfield")):
        project_id = "higgsfield-marketing"
    elif any(token in text for token in ("web", "landing", "pagina")):
        project_id = "websites"
    elif any(token in text for token in ("consultoria", "auditoria", "roadmap", "proceso")):
        project_id = "onia-consulting"
    else:
        project_id = "onia-consulting"
    result = _prepare_project(project_id, subject)
    result["action"] = "orchestrate_onia"
    result["objective"] = objective
    result["telegram_reply"] += f"\nObjetivo: {objective}\nRuta elegida: {project_id}"
    return result


def _automation_status() -> dict:
    reference = _load_reference("telegram-command-center.json")
    active = reference.get("active_workflows", [])
    planned = reference.get("planned_workflows", [])
    lines = [
        "Automatizaciones ONIA:",
        "- Activo: ONIA - Telegram Command Center en n8n.",
        "- Activo: Video Lab queda enrutable dentro de hermes-command.",
        "- Activo: Captura de chat ID Telegram.",
        "- Activo: ONIA - Scheduled Operations Pack para radar, cola diaria, CRM, recordatorios, watcher Higgsfield, copy y registro.",
        "- Regla: n8n agenda y registra; Hermes decide; Sergio aprueba.",
        "- Pendiente tecnico: sincronizacion Notion desde n8n hasta tener credencial Notion.",
    ]
    if active:
        lines.append("")
        lines.append("Workflows activos conocidos:")
        lines.extend(f"- {item.get('name')}: {item.get('status')}" for item in active)
    if planned:
        covered = [item for item in planned if item.get("implemented_by")]
        pending = [item for item in planned if not item.get("implemented_by")]
        if covered:
            lines.append("")
            lines.append("Flujos cubiertos por el Scheduled Pack:")
            lines.extend(f"- {item.get('name')}" for item in covered[:5])
        if pending:
            lines.append("")
            lines.append("Siguientes workflows pendientes:")
            lines.extend(f"- {item.get('name')}" for item in pending[:5])
    else:
        pending = []
    if not pending:
        lines.append("")
        lines.append("Siguiente pendiente real: crear credencial Notion en n8n y luego sincronizar outbox.")
    return {
        "ok": True,
        "action": "automation_status",
        "telegram_reply": "\n".join(lines),
        "reference": reference,
    }


def _content_factory_status() -> dict:
    lines = [
        "Fabrica de contenido ONIA/Higgsfield:",
        "1. Ideas: radar creativo + solicitudes por Telegram.",
        "2. Brief: Video Lab crea hook, guion, escenas, caption y prompt Higgsfield.",
        "3. Aprobacion: Sergio aprueba el brief antes de generar.",
        "4. Generacion: Higgsfield renderiza; se guarda URL publica.",
        "5. Revision: Sergio revisa MP4.",
        "6. Publicacion: solo con Publicar video <job_id>.",
        "",
        "Comandos:",
        "Genera video Sergio: <idea>",
        "Genera Reel ONIA: <tema> | <objetivo>",
        "Crea video cliente: <negocio> | <oferta> | <estilo>",
        "Siguiente Video Lab",
    ]
    return {"ok": True, "action": "content_factory_status", "telegram_reply": "\n".join(lines)}


def _help() -> dict:
    lines = [
        "Hermes Command Center - comandos:",
        "Estado Semana",
        "Plan Semana",
        "Plan Hoy",
        "Mapa proyectos ONIA",
        "Automatizaciones ONIA",
        "Fabrica contenido ONIA",
        "Radar creativo ONIA",
        "Cola contenido diaria",
        "Recordatorios Video Lab",
        "Watcher Higgsfield",
        "Platform Copy Queue",
        "Seguimientos ONIA hoy",
        "Registro Hermes",
        "Orquesta ONIA: <empresa o rubro> | <objetivo>",
        "Prepara venta DentalGest: <clinica>",
        "Prepara venta Gestios: <empresa>",
        "Prepara marketing Higgsfield: <negocio> | <oferta>",
        "Genera video Sergio: <idea>",
        "Genera Reel ONIA: <tema> | <objetivo>",
        "Crea video cliente: <negocio> | <oferta> | <estilo>",
        "Siguiente Video Lab",
    ]
    return {"ok": True, "action": "help", "telegram_reply": "\n".join(lines)}


def handle_telegram(message: str) -> dict:
    normalized = _normalize(message)
    lower = normalized.lower()
    if not normalized:
        return _dispatch(_help())

    if lower.startswith(VIDEO_PREFIXES):
        return _dispatch(_video_router(normalized), {"message": normalized[:500]})

    if lower in {"ayuda hermes", "help", "/help", "/start"}:
        return _dispatch(_help())
    if lower.startswith("estado semana") or lower.startswith("estado hermes"):
        return _dispatch(_weekly_status())
    if lower.startswith("plan semana") or lower.startswith("plan hoy") or lower.startswith("plan "):
        return _dispatch(_weekly_plan(normalized), {"message": normalized[:500]})
    if lower.startswith("mapa proyectos onia"):
        return _dispatch(_project_map())
    if lower.startswith("automatizaciones onia") or lower.startswith("estado n8n"):
        return _dispatch(_automation_status())
    if lower.startswith("fabrica contenido onia") or lower.startswith("fabrica higgsfield"):
        return _dispatch(_content_factory_status())
    if lower.startswith("radar creativo onia") or lower.startswith("radar diario onia"):
        return _dispatch(_creative_radar())
    if lower.startswith("cola contenido diaria") or lower.startswith("cola diaria contenido") or lower.startswith("contenido diario onia"):
        return _dispatch(_daily_content_queue())
    if lower.startswith("recordatorios video lab") or lower.startswith("aprobaciones video lab"):
        return _dispatch(_approval_reminders())
    if lower.startswith("watcher higgsfield") or lower.startswith("estado higgsfield"):
        return _dispatch(_higgsfield_watcher())
    if lower.startswith("platform copy queue") or lower.startswith("copy plataformas") or lower.startswith("descripciones plataformas"):
        return _dispatch(_platform_copy_queue())
    if lower.startswith("seguimientos onia hoy") or lower.startswith("crm follow-up") or lower.startswith("seguimiento crm"):
        return _dispatch(_crm_followups_today())
    if lower.startswith("registro hermes") or lower.startswith("notion outbox"):
        return _dispatch(_notion_outbox_status())
    if lower.startswith("orquesta onia:"):
        return _dispatch(_orchestrate_onia(normalized.split(":", 1)[1].strip()), {"message": normalized[:500]})

    for prefix, project_id in PROJECT_COMMANDS.items():
        if lower.startswith(prefix):
            payload = normalized.split(":", 1)[1].strip()
            return _dispatch(_prepare_project(project_id, payload), {"message": normalized[:500]})

    result = _help()
    result["ok"] = False
    result["error"] = "unsupported_command"
    result["telegram_reply"] = "No reconozco ese comando todavia.\n\n" + result["telegram_reply"]
    return _dispatch(result, {"message": normalized[:500]})


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="hermes-command")
    sub = parser.add_subparsers(dest="cmd", required=True)

    tg = sub.add_parser("telegram")
    tg.add_argument("--message", required=True)
    tg.set_defaults(func=lambda args: handle_telegram(args.message))

    sub.add_parser("commands").set_defaults(func=lambda args: _dispatch(_help()))
    sub.add_parser("projects").set_defaults(func=lambda args: _dispatch(_project_map()))
    return parser


def main(argv: list[str]) -> int:
    args = build_parser().parse_args(argv)
    result = args.func(args)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result.get("ok") else 2


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))

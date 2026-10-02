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
import urllib.request
import urllib.error
import urllib.parse
from datetime import datetime, timedelta, timezone
from pathlib import Path

try:
    from zoneinfo import ZoneInfo
    LAPAZ_TZ = ZoneInfo("America/La_Paz")
except Exception:  # pragma: no cover - fallback if tzdata missing
    LAPAZ_TZ = None


SCRIPTS_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPTS_DIR.parent
PYTHON = sys.executable or "python3"

AGENDAR_CREATE_URL = os.environ.get(
    "AGENDAR_CREATE_URL",
    "https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/agendar-create",
)

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

VIDEO_REMINDERS_MODE = os.environ.get("HERMES_VIDEO_REMINDERS_MODE", "quiet").strip().lower()
HIGGSFIELD_WATCHER_MODE = os.environ.get("HERMES_HIGGSFIELD_WATCHER_MODE", "quiet").strip().lower()

# ---------------------------------------------------------------------------
# Bridge DentalGest (ONIA Core). El gateway habla con el producto por HTTP:
# lectura via GET /api/onia-core/bridge/pending y alta de pendientes via
# POST /api/onia-core/intake. Claves en /root/.hermes/.env del VPS
# (runbook: hermes-content/docs/HERMES_PRODUCT_BRIDGE_2026.md):
#   DENTALGEST_BRIDGE_URL    base del producto (default https://dentalgest.app)
#   DENTALGEST_BRIDGE_SECRET mismo valor que ONIA_INTAKE_SECRET del producto
#   DENTALGEST_ORG_ID        organizationId de la clinica que opera este bot
# ---------------------------------------------------------------------------
DENTALGEST_BRIDGE_URL = os.environ.get("DENTALGEST_BRIDGE_URL", "https://dentalgest.app").strip().rstrip("/")
DENTALGEST_BRIDGE_SECRET = os.environ.get("DENTALGEST_BRIDGE_SECRET", "").strip()
DENTALGEST_ORG_ID = os.environ.get("DENTALGEST_ORG_ID", "").strip()

TELEGRAM_REPLY_MAX = 3500

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
            "Prepara venta Web ONIA: <negocio>",
            "Prepara consultoria ONIA: <negocio> | <dolor o proceso>",
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


def _sergio_plan() -> dict:
    now = _now_lapaz()
    lines = [
        f"Prioridades Sergio hoy ({now.strftime('%d/%m')}):",
        "Agenda no verificada: este router no tiene una lectura actual de Google Calendar.",
        "No puedo confirmar eventos, horas libres ni cambios recientes del calendario.",
        "Regla: repartir el trabajo entre Platform, clientes y marca personal.",
        "Conserva colegio, ejercicio, lectura, vida personal y descanso; usa solo bloques ONIA verificados.",
        "",
        "Prioridades sugeridas, sin asignar horarios:",
        "1. Platform: una accion para cerrar la 1.0.",
        "2. Clientes: una accion de entrega, ventas o seguimiento.",
        "3. Marca personal: una accion de contenido con evidencia real.",
        "",
        "Siguiente: verifica el calendario actual antes de ubicar tareas o proponer una reunion.",
        "Higgsfield: quiet/manual. Usa `Siguiente Video Lab` solo si quieres trabajar videos.",
    ]
    return {
        "ok": True,
        "action": "sergio_plan",
        "calendar_verified": False,
        "telegram_reply": "\n".join(lines),
    }


def _sergio_availability(message: str) -> dict:
    # Fixed windows and the creation webhook cannot establish current availability.
    # Keep this closed until a reader verifies the calendar identity, date and timezone.
    return {
        "ok": True,
        "action": "sergio_availability",
        "calendar_verified": False,
        "warning": "calendar_unverified",
        "telegram_reply": (
            "Agenda no verificada: no puedo confirmar disponibilidad para esa fecha y hora.\n"
            "Este router no tiene una lectura actual de Google Calendar; falta verificar calendario, fecha y zona horaria.\n"
            "Conserva colegio, ejercicio, lectura, vida personal y descanso.\n"
            "Siguiente: consulta el calendario actual y confirma con Sergio antes de proponer o agendar una reunion."
        ),
    }


def _sergio_mode(mode: str) -> dict:
    messages = {
        "enfoque": [
            "Modo enfoque activo:",
            "- 45-90 min en una sola tarea.",
            "- No videos, no Higgsfield, no investigacion amplia.",
            "- Siguiente accion: escribe la tarea exacta o usa `Plan Sergio hoy`.",
        ],
        "gym": [
            "Modo gym activo:",
            "- Bloque protegido 17:30-19:00.",
            "- No reuniones ni mensajes largos.",
            "- Pendientes se guardan para despues del bloque.",
        ],
        "novia": [
            "Modo novia activo:",
            "- Bloque personal protegido.",
            "- No trabajo, no backlog, no Higgsfield.",
            "- Si algo es urgente, debe decir `emergencia real` y el motivo.",
        ],
        "saturado": [
            "Modo carga baja:",
            "- Pausa 15 min o cierre del bloque actual.",
            "- Haz solo la proxima accion minima.",
            "- Mover para manana: contenido, investigacion amplia y Video Lab.",
            "- Prioridad: salud, venta urgente o cliente pago.",
        ],
        "cierre": [
            "Cierre Sergio:",
            "- Registrar pagos, leads, tareas y bloqueos.",
            "- Elegir 3 prioridades de manana.",
            "- Apagar trabajo. No abrir Higgsfield ni nueva investigacion.",
        ],
    }
    lines = messages.get(mode, messages["enfoque"])
    return {"ok": True, "action": f"sergio_mode_{mode}", "telegram_reply": "\n".join(lines)}


def _quiet_video_reply(kind: str) -> dict:
    lines = [
        f"{kind}: modo quiet activo.",
        "No voy a empujar Higgsfield ni Video Lab por horario.",
        "Esto evita quemar tokens/atencion sin decision activa de producir.",
        "",
        "Comandos manuales permitidos:",
        "- Siguiente Video Lab",
        "- Recordatorios Video Lab detalle",
        "- Watcher Higgsfield detalle",
        "- Genera video Sergio: <idea>",
    ]
    return {"ok": True, "action": f"{kind.lower().replace(' ', '_')}_quiet", "telegram_reply": "\n".join(lines)}


def _daily_content_queue() -> dict:
    next_data = _video_next(limit=6)
    next_jobs = next_data.get("jobs", [])
    lines = [
        "Cola diaria de contenido ONIA:",
        "1. Sergio: pieza fundador/proceso. Prioridad: confianza y construccion real.",
        "   Accion segura: guardar idea en ONIA Center o escribir hook corto.",
        "2. ONIA: pieza demo/sistema. Prioridad: vender DentalGest, Gesti-OS o automatizacion.",
        "   Accion segura: preparar guion o carrusel, no generar video automaticamente.",
        "3. Cliente/servicio: si hay prospecto caliente, preparar UGC seguro.",
        "   Accion segura: brief interno con aprobacion antes de Video Lab.",
        "4. Reutilizacion: convertir una pieza aprobada en caption IG, TikTok, Shorts y LinkedIn.",
        "",
        "Regla: Higgsfield queda manual/quiet. No genera, no publica y no contacta sin aprobacion.",
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
        "Ideas seguras para guardar, no producir automatico:",
        "1. Sergio: por que un sistema simple vende mas que responder a mano",
        "2. ONIA: DentalGest agenda y seguimiento | pedir demo corta",
        "3. ONIA: Gesti-OS convierte Excel en tablero operativo | ver tablero simple",
        "4. Prepara consultoria ONIA: clinica dental | agenda, seguimiento y captacion",
        "",
        "Si quieres producir video, pide manualmente: Siguiente Video Lab o Genera video Sergio: <idea>.",
        "",
        "Nota: este radar es seguro/local. Para tendencias virales exactas, investigar fuentes actuales antes de usar claims.",
    ]
    return {"ok": True, "action": "creative_radar", "telegram_reply": "\n".join(lines)}


def _approval_reminders(detail: bool = False) -> dict:
    if VIDEO_REMINDERS_MODE != "active" and not detail:
        return _quiet_video_reply("Recordatorios Video Lab")

    jobs = _video_jobs_by_state({"waiting_approval", "generated", "needs_revision", "approved_for_publish", "avatar_review_pending"})
    reply = _format_video_jobs(
        "Recordatorios Video Lab:",
        jobs,
        "Recordatorios Video Lab: no hay aprobaciones, revisiones o publicaciones pendientes.",
    )
    if jobs:
        reply += "\n\nAprobacion valida: comando exacto con job_id. No usar 'ok' o 'dale'."
    return {"ok": True, "action": "video_approval_reminders", "telegram_reply": reply, "jobs": jobs}


def _higgsfield_watcher(detail: bool = False) -> dict:
    if HIGGSFIELD_WATCHER_MODE != "active" and not detail:
        return _quiet_video_reply("Watcher Higgsfield")

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
        "- Prioridad: DentalGest clinicas, Gesti-OS pymes con Excel, webs sin captacion, auditorias y n8n simple.",
        "",
        "Comandos utiles:",
        "Prepara venta DentalGest: <clinica>",
        "Prepara venta Gestios: <empresa>",
        "Prepara venta Web ONIA: <negocio>",
        "Prepara consultoria ONIA: <negocio> | <dolor o proceso>",
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


def _hermesa_status() -> dict:
    home = _hermes_home()
    outbox = home / "notion-outbox" / "command-center-events.jsonl"
    event_log = home / "logs" / "command-center-events.jsonl"
    outbox_count = 0
    event_count = 0
    for path, key in ((outbox, "outbox"), (event_log, "events")):
        try:
            count = len(path.read_text("utf-8").splitlines()) if path.exists() else 0
        except OSError:
            count = 0
        if key == "outbox":
            outbox_count = count
        else:
            event_count = count

    next_data = _video_next(limit=5)
    next_jobs = next_data.get("jobs", []) if isinstance(next_data, dict) else []
    reference = _load_reference("telegram-command-center.json")
    active_workflows = reference.get("active_workflows", [])
    projects = _all_projects()

    lines = [
        "Estado Hermesa:",
        f"- Memoria local: {event_count} eventos; outbox Notion: {outbox_count} pendientes/apilados.",
        f"- Proyectos ONIA conocidos: {len(projects)}.",
        f"- Workflows n8n activos conocidos: {len(active_workflows)}.",
        f"- Video Lab accionable: {len(next_jobs)} pendiente(s).",
        "",
        "Prioridad ahora:",
    ]

    if outbox_count:
        lines.append("1. Sincronizar outbox local con Notion para que Hermesa tenga memoria consultable.")
    else:
        lines.append("1. Mantener el loop diario: radar, cola, CRM, Video Lab y registro.")

    if next_jobs:
        job = next_jobs[0]
        command = job.get("command") or _command_for_video_job(job)
        lines.append(f"2. Resolver Video Lab: {job.get('job_id')} | {job.get('state')} | {job.get('topic')}")
        if command:
            lines.append(f"   Siguiente comando: {command}")
    else:
        lines.append("2. Crear una pieza nueva o revisar CRM; no hay Video Lab urgente.")

    lines.extend(
        [
            "3. Mejorar el router para aceptar lenguaje natural y devolver comandos exactos.",
            "",
            "Comandos utiles:",
            "Registro Hermes",
            "Siguiente Video Lab",
            "Automatizaciones ONIA",
            "Cola contenido diaria",
        ]
    )

    return {
        "ok": True,
        "action": "hermesa_status",
        "telegram_reply": "\n".join(lines),
        "metrics": {
            "events": event_count,
            "notion_outbox": outbox_count,
            "known_projects": len(projects),
            "known_active_workflows": len(active_workflows),
            "actionable_video_jobs": len(next_jobs),
        },
    }


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
        "- Activo: ONIA - Scheduled Operations Pack para agenda Sergio, radar, CRM, copy y registro.",
        "- Quiet: recordatorios Video Lab y watcher Higgsfield no deben empujar produccion por horario.",
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
        "Fabrica de contenido ONIA:",
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
        "",
        "Modo actual: Higgsfield manual/quiet. Usa Video Lab solo cuando quieras producir.",
    ]
    return {"ok": True, "action": "content_factory_status", "telegram_reply": "\n".join(lines)}


def _help() -> dict:
    lines = [
        "Hermes Command Center - comandos:",
        "Plan Sergio hoy",
        "Puedo reunirme <dia> <hora>?",
        "Modo enfoque",
        "Estoy saturado",
        "Modo gym",
        "Modo novia",
        "Cierre Sergio",
        "/agendar Título | fecha hora-inicio-hora-fin | descripción",
        "/dentalgest (pendientes de la clinica)",
        "/tarea <texto> (crear pendiente en DentalGest)",
        "Estado Semana",
        "Plan Semana",
        "Plan Hoy",
        "Mapa proyectos ONIA",
        "Automatizaciones ONIA",
        "Fabrica contenido ONIA",
        "Radar creativo ONIA",
        "Cola contenido diaria",
        "Recordatorios Video Lab detalle",
        "Watcher Higgsfield detalle",
        "Platform Copy Queue",
        "Seguimientos ONIA hoy",
        "Registro Hermes",
        "Estado Hermesa",
        "Orquesta ONIA: <empresa o rubro> | <objetivo>",
        "Prepara venta DentalGest: <clinica>",
        "Prepara venta Gestios: <empresa>",
        "Prepara venta Web ONIA: <negocio>",
        "Prepara consultoria ONIA: <negocio> | <dolor o proceso>",
        "Genera video Sergio: <idea>",
        "Genera Reel ONIA: <tema> | <objetivo>",
        "Crea video cliente: <negocio> | <oferta> | <estilo>",
        "Siguiente Video Lab",
    ]
    return {"ok": True, "action": "help", "telegram_reply": "\n".join(lines)}


_WEEKDAYS = {
    "lunes": 0,
    "martes": 1,
    "miercoles": 2,
    "miércoles": 2,
    "jueves": 3,
    "viernes": 4,
    "sabado": 5,
    "sábado": 5,
    "domingo": 6,
}


def _now_lapaz() -> datetime:
    if LAPAZ_TZ is not None:
        return datetime.now(LAPAZ_TZ)
    # Fallback: assume UTC-4 manually.
    return (datetime.now(timezone.utc) - timedelta(hours=4)).replace(tzinfo=None)


def _parse_fecha(texto: str) -> datetime:
    lower = texto.lower()
    fecha = _now_lapaz()
    if "mañana" in lower or "manana" in lower:
        return fecha + timedelta(days=1)
    for nombre, num in _WEEKDAYS.items():
        if nombre in lower:
            diff = num - fecha.weekday()
            if diff <= 0:
                diff += 7
            return fecha + timedelta(days=diff)
    match = re.search(r"(\d{1,2})/(\d{1,2})", texto)
    if match:
        day, month = int(match.group(1)), int(match.group(2))
        try:
            return fecha.replace(month=month, day=day)
        except ValueError:
            return fecha
    return fecha


def _parse_hora(texto: str) -> tuple[int, int]:
    match = re.search(r"(\d{1,2})(?::(\d{2}))?\s*(am|pm)?", texto, re.IGNORECASE)
    if not match:
        return 9, 0
    hour = int(match.group(1))
    minute = int(match.group(2) or 0)
    ampm = (match.group(3) or "").lower()
    if ampm == "pm" and hour < 12:
        hour += 12
    if ampm == "am" and hour == 12:
        hour = 0
    return hour, minute


def _post_agendar_create(payload: dict, timeout: int = 30) -> dict:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        AGENDAR_CREATE_URL,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8")
        return json.loads(body) if body else {"ok": False}
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", "replace")[:400] if exc.fp else str(exc)
        return {"ok": False, "error": f"HTTP {exc.code}: {detail}"}
    except Exception as exc:  # noqa: BLE001 - report any transport failure to Telegram
        return {"ok": False, "error": str(exc)}


def _agendar(payload: str) -> dict:
    partes = [part.strip() for part in payload.split("|")]
    titulo = partes[0] if partes and partes[0] else "Sin título"
    fecha_hora = partes[1] if len(partes) > 1 else ""
    descripcion = partes[2] if len(partes) > 2 else ""

    if not fecha_hora:
        return {
            "ok": False,
            "action": "agendar",
            "telegram_reply": (
                "Formato: /agendar Título | fecha hora-inicio-hora-fin | descripción\n"
                "Ejemplo: /agendar Reunión Epic | jueves 10am-11am | ver propuesta"
            ),
        }

    fecha = _parse_fecha(fecha_hora)
    rango = re.search(r"([\d:apm]+)\s*-\s*([\d:apm]+)", fecha_hora, re.IGNORECASE)
    if rango:
        start_h, start_m = _parse_hora(rango.group(1))
        end_h, end_m = _parse_hora(rango.group(2))
    else:
        start_h, start_m = _parse_hora(fecha_hora)
        end_h, end_m = (start_h + 1) % 24, start_m

    start_dt = fecha.replace(hour=start_h, minute=start_m, second=0, microsecond=0)
    end_dt = fecha.replace(hour=end_h, minute=end_m, second=0, microsecond=0)
    if end_dt <= start_dt:
        end_dt = start_dt + timedelta(hours=1)

    resumen = f"{titulo} — {start_dt.strftime('%a %d %b %H:%M')}"
    result = _post_agendar_create(
        {
            "titulo": titulo,
            "descripcion": descripcion,
            "startISO": start_dt.isoformat(),
            "endISO": end_dt.isoformat(),
        }
    )

    if result.get("ok"):
        link = result.get("htmlLink", "")
        reply = f"✅ Evento agendado:\n📅 {titulo}\n⏰ {resumen}"
        if descripcion:
            reply += f"\n📝 {descripcion}"
        if link:
            reply += f"\n🔗 {link}"
        return {"ok": True, "action": "agendar", "telegram_reply": reply, "event": result}

    return {
        "ok": False,
        "action": "agendar",
        "telegram_reply": "No pude crear el evento en Google Calendar: "
        + str(result.get("error", "error desconocido")),
        "result": result,
    }


# ---------------------------------------------------------------------------
# DentalGest bridge: /dentalgest (pendientes) y /tarea (crear pendiente).
# ---------------------------------------------------------------------------


def _clip_reply(reply: str) -> str:
    if len(reply) <= TELEGRAM_REPLY_MAX:
        return reply
    return reply[: TELEGRAM_REPLY_MAX - 25].rstrip() + "\n[respuesta recortada]"


def _dentalgest_missing_config() -> list[str]:
    missing = []
    if not DENTALGEST_BRIDGE_SECRET:
        missing.append("DENTALGEST_BRIDGE_SECRET")
    if not DENTALGEST_ORG_ID:
        missing.append("DENTALGEST_ORG_ID")
    return missing


def _dentalgest_config_error(action: str, missing: list[str]) -> dict:
    return {
        "ok": False,
        "action": action,
        "telegram_reply": (
            "DentalGest no esta conectado todavia.\n"
            f"Faltan claves en /root/.hermes/.env del VPS: {', '.join(missing)}.\n"
            "Runbook: hermes-content/docs/HERMES_PRODUCT_BRIDGE_2026.md"
        ),
    }


def _dentalgest_request(path: str, method: str = "GET", payload: dict = None, timeout: int = 25) -> dict:
    url = f"{DENTALGEST_BRIDGE_URL}{path}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Content-Type": "application/json",
            "x-intake-secret": DENTALGEST_BRIDGE_SECRET,
        },
        method=method,
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8")
        parsed = json.loads(body) if body else {}
        if isinstance(parsed, dict):
            return parsed
        return {"ok": False, "error": "La respuesta del bridge no era un objeto JSON"}
    except urllib.error.HTTPError as exc:
        detail = ""
        try:
            raw = exc.read().decode("utf-8", "replace") if exc.fp else ""
            parsed = json.loads(raw) if raw else {}
            detail = str(parsed.get("error") or raw[:200] or exc)
        except Exception:  # noqa: BLE001 - el detalle es best-effort
            detail = str(exc)
        return {"ok": False, "http_status": exc.code, "error": f"HTTP {exc.code}: {detail}"}
    except Exception as exc:  # noqa: BLE001 - transporte caido debe llegar amable a Telegram
        return {"ok": False, "error": str(exc)}


def _format_bridge_due(iso: str) -> str:
    if not iso:
        return "sin fecha"
    try:
        due = datetime.fromisoformat(str(iso).replace("Z", "+00:00"))
    except ValueError:
        return str(iso)[:16]
    if LAPAZ_TZ is not None and due.tzinfo is not None:
        due = due.astimezone(LAPAZ_TZ)
    return due.strftime("%d/%m %H:%M")


def _format_dentalgest_pending(data: dict) -> str:
    counts = data.get("counts") or {}
    items = data.get("items") or []
    lines = [
        "DentalGest - pendientes:",
        (
            f"Abiertos: {counts.get('open', 0)} | "
            f"Vencidos: {counts.get('overdue', 0)} | "
            f"Aprobaciones pendientes: {counts.get('pendingApprovals', 0)}"
        ),
        "",
    ]
    if not items:
        lines.append("No hay pendientes abiertos. Todo al dia.")
    else:
        for idx, item in enumerate(items[:10], start=1):
            flag = " [VENCIDO]" if item.get("overdue") else ""
            owner = item.get("owner") or "sin asignar"
            lines.append(f"{idx}. {item.get('title') or '(sin titulo)'}{flag}")
            lines.append(
                f"   Resp: {owner} | Prioridad: {item.get('priority') or 'normal'} | "
                f"Vence: {_format_bridge_due(item.get('dueAt'))}"
            )
    lines.extend(["", "Crear pendiente: /tarea <texto>"])
    return _clip_reply("\n".join(lines))


def _dentalgest_pending(subcommand: str = "") -> dict:
    subcommand = (subcommand or "").strip().lower()
    if subcommand not in ("", "pendientes"):
        return {
            "ok": False,
            "action": "dentalgest_pending",
            "telegram_reply": (
                f"No reconozco '/dentalgest {subcommand}'.\n"
                "Comandos DentalGest:\n"
                "/dentalgest - pendientes de la clinica (alias: /dentalgest pendientes)\n"
                "/tarea <texto> - crear un pendiente"
            ),
        }
    missing = _dentalgest_missing_config()
    if missing:
        return _dentalgest_config_error("dentalgest_pending", missing)
    query = urllib.parse.urlencode({"organizationId": DENTALGEST_ORG_ID})
    data = _dentalgest_request(f"/api/onia-core/bridge/pending?{query}")
    if not data.get("ok"):
        return {
            "ok": False,
            "action": "dentalgest_pending",
            "telegram_reply": (
                "No pude leer los pendientes de DentalGest.\n"
                f"Detalle: {data.get('error', 'sin detalle')}\n"
                "Revisa que el producto este arriba y que DENTALGEST_BRIDGE_SECRET "
                "coincida con ONIA_INTAKE_SECRET del producto."
            ),
            "result": data,
        }
    return {
        "ok": True,
        "action": "dentalgest_pending",
        "telegram_reply": _format_dentalgest_pending(data),
        "counts": data.get("counts"),
    }


def _dentalgest_create_task(text: str) -> dict:
    text = (text or "").strip()
    if not text:
        return {
            "ok": False,
            "action": "dentalgest_create_task",
            "telegram_reply": (
                "Formato: /tarea <texto del pendiente>\n"
                "Ejemplo: /tarea Llamar al laboratorio por la protesis de Maria"
            ),
        }
    missing = _dentalgest_missing_config()
    if missing:
        return _dentalgest_config_error("dentalgest_create_task", missing)
    payload = {
        "organizationId": DENTALGEST_ORG_ID,
        "channel": "phone_walkin",
        "message": text,
        "contact": {"name": "Sergio via Telegram"},
    }
    data = _dentalgest_request("/api/onia-core/intake", method="POST", payload=payload, timeout=30)
    if not data.get("ok"):
        return {
            "ok": False,
            "action": "dentalgest_create_task",
            "telegram_reply": (
                "No pude crear el pendiente en DentalGest.\n"
                f"Detalle: {data.get('error', 'sin detalle')}\n"
                "El texto no se perdio: reintenta con /tarea o carga el pendiente en el panel."
            ),
            "result": data,
        }
    title = data.get("title") or f"solicitud_manual: {text[:80]}"
    owner = data.get("ownerName") or "sin asignar"
    reply = f"Pendiente creado: {title} → {owner}"
    if data.get("deduped"):
        reply = (
            "Ya habia un pendiente abierto de este contacto; sume el mensaje ahi.\n" + reply
        )
    return {
        "ok": True,
        "action": "dentalgest_create_task",
        "telegram_reply": _clip_reply(reply),
        "result": data,
    }


def handle_telegram(message: str) -> dict:
    normalized = _normalize(message)
    lower = normalized.lower()
    if not normalized:
        return _dispatch(_help())

    if lower.startswith("/agendar") or lower.startswith("agendar "):
        payload = re.sub(r"^/?agendar\s*", "", normalized, flags=re.IGNORECASE)
        return _dispatch(_agendar(payload), {"message": normalized[:500]})

    # Bridge DentalGest: /tarea crea pendiente, /dentalgest lista pendientes.
    # Acepta el sufijo @bot que Telegram agrega en grupos.
    bridge_match = re.match(r"^/(tarea|dentalgest)(?:@\S+)?\s*(.*)$", normalized, flags=re.IGNORECASE)
    if bridge_match:
        bridge_cmd = bridge_match.group(1).lower()
        bridge_payload = bridge_match.group(2).strip()
        if bridge_cmd == "tarea":
            return _dispatch(_dentalgest_create_task(bridge_payload), {"message": normalized[:500]})
        return _dispatch(_dentalgest_pending(bridge_payload), {"message": normalized[:500]})

    if lower.startswith("plan sergio") or lower.startswith("agenda sergio") or lower.startswith("calendario sergio"):
        return _dispatch(_sergio_plan(), {"message": normalized[:500]})
    if lower.startswith("puedo reunirme") or lower.startswith("disponibilidad sergio"):
        return _dispatch(_sergio_availability(normalized), {"message": normalized[:500]})
    if lower.startswith("modo enfoque"):
        return _dispatch(_sergio_mode("enfoque"), {"message": normalized[:500]})
    if lower.startswith("modo gym"):
        return _dispatch(_sergio_mode("gym"), {"message": normalized[:500]})
    if lower.startswith("modo novia"):
        return _dispatch(_sergio_mode("novia"), {"message": normalized[:500]})
    if lower.startswith("estoy saturado") or lower.startswith("modo saturado"):
        return _dispatch(_sergio_mode("saturado"), {"message": normalized[:500]})
    if lower.startswith("cierre sergio"):
        return _dispatch(_sergio_mode("cierre"), {"message": normalized[:500]})

    if lower.startswith(VIDEO_PREFIXES):
        return _dispatch(_video_router(normalized), {"message": normalized[:500]})

    if lower in {"ayuda hermes", "help", "/help", "/start"}:
        return _dispatch(_help())
    if lower.startswith("estado hermesa") or lower.startswith("prioridades hermesa") or lower.startswith("mejora hermesa"):
        return _dispatch(_hermesa_status())
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
        return _dispatch(_approval_reminders(detail="detalle" in lower), {"message": normalized[:500]})
    if lower.startswith("watcher higgsfield") or lower.startswith("estado higgsfield"):
        return _dispatch(_higgsfield_watcher(detail="detalle" in lower), {"message": normalized[:500]})
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

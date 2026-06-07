#!/usr/bin/env python3
"""
Weekly operating status for Hermes.

Read-only summary for crons, Video Lab, gateway, Instagram and n8n.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
import subprocess
import sys
from urllib.request import Request, urlopen


SCRIPTS_DIR = Path(__file__).resolve().parent
PYTHON = sys.executable or "python"


def _local_command(cmd: list[str]) -> list[str]:
    if not cmd:
        return cmd
    replacements = {
        "video-lab": [PYTHON, str(SCRIPTS_DIR / "video_lab.py")],
        "ig-publish": [PYTHON, str(SCRIPTS_DIR / "ig_publisher.py")],
    }
    if cmd[0] in replacements:
        return replacements[cmd[0]] + cmd[1:]
    return cmd


def _run(cmd: list[str], timeout: int = 30) -> dict:
    real_cmd = _local_command(cmd)
    try:
        proc = subprocess.run(real_cmd, text=True, capture_output=True, timeout=timeout, check=False)
    except FileNotFoundError as exc:
        return {"cmd": cmd, "resolved_cmd": real_cmd, "code": 127, "stdout": "", "stderr": str(exc)}
    return {
        "cmd": cmd,
        "resolved_cmd": real_cmd,
        "code": proc.returncode,
        "stdout": proc.stdout.strip(),
        "stderr": proc.stderr.strip(),
    }


def _safe_json(result: dict) -> dict:
    try:
        return json.loads(result["stdout"])
    except Exception:
        return {"ok": False, "raw": result["stdout"], "stderr": result["stderr"]}


def _http_head(url: str, timeout: int = 10) -> dict:
    try:
        request = Request(url, method="HEAD")
        with urlopen(request, timeout=timeout) as response:
            return {"ok": 200 <= response.status < 400, "status": response.status, "url": url, "error": ""}
    except Exception as exc:
        return {"ok": False, "status": None, "url": url, "error": str(exc)}


def collect() -> dict:
    cron_status = _run(["hermes", "cron", "status"])
    cron_list = _run(["hermes", "cron", "list"])
    gateway = _run(["hermes", "gateway", "status"])
    video_next = _run(["video-lab", "next", "--limit", "10"])
    ig_health = _run(["ig-publish", "healthcheck"])
    n8n_services = _run(["bash", "-lc", "docker service ls 2>/dev/null | grep -i n8n || true"])
    ports = _run(["bash", "-lc", "ss -ltnp | grep -E ':(5678|8099|9119)\\b' || true"])
    asset_http = _http_head(os.environ.get("HERMES_ASSET_SERVER_URL", "http://187.77.16.63:8099/"))
    n8n_http = _http_head(os.environ.get("HERMES_N8N_URL", "https://n8n-sergio-n8n.hqdqgh.easypanel.host/"))

    return {
        "ok": True,
        "cron_status": cron_status,
        "cron_list": cron_list,
        "gateway": gateway,
        "video_next": _safe_json(video_next),
        "instagram": _safe_json(ig_health),
        "n8n_services": n8n_services["stdout"],
        "ports": ports["stdout"],
        "asset_http": asset_http,
        "n8n_http": n8n_http,
        "telegram_reply": _format_reply(cron_status, video_next, ig_health, n8n_services, ports, asset_http, n8n_http),
    }


def _format_reply(
    cron_status: dict,
    video_next: dict,
    ig_health: dict,
    n8n_services: dict,
    ports: dict,
    asset_http: dict,
    n8n_http: dict,
) -> str:
    video = _safe_json(video_next)
    ig = _safe_json(ig_health)
    jobs = video.get("jobs", [])
    cron_text = f"{cron_status.get('stdout', '')}\n{cron_status.get('stderr', '')}".lower()
    cron_ok = cron_status["code"] == 0 and "not fire" not in cron_text and "not running" not in cron_text
    lines = [
        "Estado Semana Hermes",
        f"- Cron/Gateway: {'OK' if cron_ok else 'REVISAR'}",
        f"- Video Lab: {len(jobs)} job(s) accionables",
        f"- Instagram: {'OK' if ig.get('ok') else 'REVISAR TOKEN/PERMISOS'}",
        f"- n8n: {'OK' if n8n_services['stdout'] or n8n_http.get('ok') else 'no detectado'}",
        f"- Asset server :8099: {'OK' if ':8099' in ports['stdout'] or asset_http.get('ok') else 'REVISAR'}",
    ]
    if jobs:
        lines.append("Siguiente Video Lab:")
        for job in jobs[:3]:
            lines.append(f"- {job.get('job_id')} -> {job.get('command')}")
    lines.append("Comando util: video-lab next")
    return "\n".join(lines)


def main() -> int:
    print(json.dumps(collect(), ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}, ensure_ascii=False), file=sys.stderr)
        raise SystemExit(2)

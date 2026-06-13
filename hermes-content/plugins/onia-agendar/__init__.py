"""onia-agendar plugin — deterministic Telegram "agendar" -> Google Calendar.

Hermes' Alfredhq gateway is an LLM agent: free-text like "agendar reunion
manana" gets interpreted conversationally and may create a reminder instead of
a real calendar event. This plugin intercepts any message starting with
``agendar`` (or ``/agendar``) in the ``pre_gateway_dispatch`` hook, runs the
deterministic ``hermes-command telegram --message`` router (which parses the
date/time and creates the event via the n8n ``agendar-create`` webhook), sends
the confirmation back through the same platform adapter, and short-circuits the
LLM dispatch entirely.

Restricted to the owner chat id to avoid unauthorized calendar writes (the hook
fires before auth).
"""

from __future__ import annotations

import asyncio
import json
import logging
import os
import subprocess

logger = logging.getLogger(__name__)

# Only this chat may create events through the deterministic shortcut.
# Overridable via env for flexibility; defaults to Sergio's personal chat.
# Comma-separated allow-list of chat ids that may use the deterministic
# "agendar" shortcut (the hook fires before auth, so we gate explicitly).
# Defaults to Sergio + his partner. Override via env ONIA_AGENDAR_CHAT_ID.
_ALLOWED_CHAT_IDS = {
    cid.strip()
    for cid in os.environ.get("ONIA_AGENDAR_CHAT_ID", "6830070978").split(",")
    if cid.strip()
}

_HERMES_COMMAND = os.environ.get("ONIA_HERMES_COMMAND", "hermes-command")


def _looks_like_agendar(text: str) -> bool:
    t = (text or "").strip().lower()
    return t.startswith("agendar") or t.startswith("/agendar")


def _run_agendar(text: str) -> str:
    """Run the deterministic router and return its telegram_reply."""
    proc = subprocess.run(
        [_HERMES_COMMAND, "telegram", "--message", text],
        capture_output=True,
        text=True,
        timeout=60,
        check=False,
    )
    try:
        data = json.loads(proc.stdout)
    except Exception:
        data = {}
    reply = data.get("telegram_reply") if isinstance(data, dict) else None
    if reply:
        return reply
    err = (proc.stderr or "").strip()
    return "No pude crear el evento en Google Calendar." + (f"\n{err[-400:]}" if err else "")


async def _handle(event, gateway) -> None:
    source = event.source
    try:
        reply = await asyncio.to_thread(_run_agendar, event.text or "")
    except Exception as exc:  # noqa: BLE001 - always surface a reply to the user
        logger.warning("onia-agendar: router failed: %s", exc)
        reply = f"Error al agendar: {exc}"
    try:
        adapter = gateway.adapters.get(source.platform)
        if adapter is not None:
            await adapter.send(source.chat_id, reply)
        else:
            logger.warning("onia-agendar: no adapter for platform %s", source.platform)
    except Exception as exc:  # noqa: BLE001
        logger.warning("onia-agendar: reply send failed: %s", exc)


def _pre_gateway_dispatch(event=None, gateway=None, session_store=None, **_):
    if event is None or gateway is None:
        return None
    if not _looks_like_agendar(getattr(event, "text", "")):
        return None
    source = getattr(event, "source", None)
    if source is None:
        return None
    if _ALLOWED_CHAT_IDS and str(getattr(source, "chat_id", "")) not in _ALLOWED_CHAT_IDS:
        # Not an allowed chat — let normal dispatch/auth handle it.
        return None
    try:
        loop = asyncio.get_running_loop()
        loop.create_task(_handle(event, gateway))
    except Exception as exc:  # noqa: BLE001 - if we can't schedule, fall back to LLM
        logger.warning("onia-agendar: could not schedule handler: %s", exc)
        return None
    return {"action": "skip", "reason": "onia-agendar handled agendar command"}


def register(ctx) -> None:
    ctx.register_hook("pre_gateway_dispatch", _pre_gateway_dispatch)
    logger.info("onia-agendar plugin registered (pre_gateway_dispatch)")

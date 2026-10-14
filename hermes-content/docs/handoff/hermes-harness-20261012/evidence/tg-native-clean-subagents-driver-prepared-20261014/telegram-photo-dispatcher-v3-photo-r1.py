#!/usr/bin/env python3
"""One-shot, fail-closed Telegram dispatcher for the approved pilot summary.

Default execution is local-only `--self-test`. `--preflight` performs metadata
GETs only. `--send-once` is a separate, explicit one-shot path with durable
local and VPS ledgers; a timeout or malformed receipt is never retried.
"""
from __future__ import annotations

import argparse
import base64
import hashlib
import http.client
import json
import os
import re
import secrets
import sqlite3
import subprocess
import sys
import tempfile
import mimetypes
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Callable
from urllib.parse import urlencode

APPROVAL_REF = "sergio:20261014-hermes-telegram-pilot-one-text-r3"
OWNER_ALIAS = "Sergio Urcullo"
BOT_ALIAS = "aalfredhq_bot"
MESSAGE = "Piloto ONIA: 3 sesiones y 6 subagentes completaron QA. Sesión nueva Codex Cloud creada; continuidad bloqueada por proxy. Claude suspendido por cuota. Telegram: prueba de entrega; autonomía y rotación automática aún pendientes."
SSH_KEY = r"C:\Users\PC\.ssh\onia_hermes_vps_ed25519"
KNOWN_HOSTS = r"C:\Users\PC\.ssh\known_hosts"
SSH_DEST = "root@187.77.16.63"
REMOTE_PYTHON = "/usr/local/lib/hermes-agent/venv/bin/python"
REMOTE_LEDGER_DIR = "/tmp/onia-hermes-sergio-pilot-telegram-send-20261014-r3"
PHOTO_APPROVAL_REF = "sergio:20261014-native-clean-subagents-photo-r1"
PHOTO_CAPTION = "Codex Cloud: sesión nueva y 2 subagentes reales completaron la prueba. Detector de compactación validado. Falta conectar Hermes, relevo automático y navegador remoto. Claude sigue suspendido."
PHOTO_PATH = Path("E:/onia-wt/tg-native-clean-subagents-photo-v4-prepared-20261014/media/codex-cloud-clean-subagents-20261014.jpg")
PHOTO_SHA256 = "4BB3CE34713805802F1C84380658E0862402662CF154498ACA17952EAEA7C033"
PHOTO_DATA_B64 = None  # In-memory SSH-only payload for the photo operation.
PHOTO_REMOTE_LEDGER_DIR = "/tmp/onia-hermes-sergio-native-clean-subagents-photo-20261014-r1/dispatch-ledger"
LOCAL_LEDGER = Path(__file__).resolve().parent / "dispatch-ledger.sqlite3"
MAX_HTTP_BODY = 128 * 1024
MEDIA_ROOT = Path("E:/onia-wt").resolve()
MAX_MEDIA_BYTES = 20 * 1024 * 1024
ALLOWED_MEDIA_TYPES = {"text/html", "image/png", "image/jpeg", "image/webp", "video/mp4", "application/pdf"}


def sha256_text(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _chat_id_string(value: Any) -> str | None:
    if isinstance(value, bool):
        return None
    candidate = str(value)
    return candidate if re.fullmatch(r"-?\d+", candidate) else None


def resolve_owner_chat(directory_payload: Any) -> str:
    """Return the one exact private-owner target; caller must not log this value."""
    if not isinstance(directory_payload, dict):
        raise ValueError("directory shape")
    platforms = directory_payload.get("platforms")
    rows = platforms.get("telegram") if isinstance(platforms, dict) else None
    if not isinstance(rows, list):
        raise ValueError("telegram targets missing")
    matches = [row for row in rows if isinstance(row, dict) and row.get("name") == OWNER_ALIAS]
    if len(matches) != 1:
        raise ValueError("owner target is not unique")
    chat_id = _chat_id_string(matches[0].get("id") or matches[0].get("chat_id"))
    if chat_id is None:
        raise ValueError("owner target id invalid")
    return chat_id


def validate_identity(bot_payload: Any, chat_payload: Any, expected_chat_id: str) -> None:
    if not isinstance(bot_payload, dict) or bot_payload.get("ok") is not True:
        raise ValueError("bot metadata invalid")
    bot = bot_payload.get("result")
    if not isinstance(bot, dict) or bot.get("is_bot") is not True or bot.get("username") != BOT_ALIAS:
        raise ValueError("bot identity mismatch")
    if not isinstance(chat_payload, dict) or chat_payload.get("ok") is not True:
        raise ValueError("chat metadata invalid")
    chat = chat_payload.get("result")
    if not isinstance(chat, dict) or chat.get("type") != "private":
        raise ValueError("chat is not private")
    first = str(chat.get("first_name") or "").strip()
    last = str(chat.get("last_name") or "").strip()
    if " ".join((first + " " + last).split()).casefold() != OWNER_ALIAS.casefold():
        raise ValueError("chat identity mismatch")
    if _chat_id_string(chat.get("id")) != expected_chat_id:
        raise ValueError("chat id mismatch")


def build_payload(chat_id: str) -> dict[str, Any]:
    if _chat_id_string(chat_id) is None:
        raise ValueError("chat id invalid")
    return {"chat_id": int(chat_id), "text": MESSAGE}


def validate_media_path(raw_path: str, base: Path = MEDIA_ROOT) -> tuple[Path, str, int]:
    """Validate a future local attachment; this helper does not upload or send it."""
    if not isinstance(raw_path, str) or raw_path.startswith(("http://", "https://")):
        raise ValueError("media must be a local path")
    base = base.resolve(strict=True)
    candidate = Path(raw_path)
    if not candidate.is_absolute():
        raise ValueError("media path must be absolute")
    lexical = candidate.absolute()
    try:
        relative = lexical.relative_to(base)
    except ValueError as exc:
        raise ValueError("media path outside approved root") from exc
    current = base
    if _is_linklike(current):
        raise ValueError("media root is a symlink")
    for part in relative.parts:
        current = current / part
        if _is_linklike(current):
            raise ValueError("symlink media path")
    try:
        resolved = lexical.resolve(strict=True)
    except OSError as exc:
        raise ValueError("media file unavailable") from exc
    try:
        resolved.relative_to(base)
    except ValueError as exc:
        raise ValueError("resolved media path outside approved root") from exc
    if not resolved.is_file():
        raise ValueError("media path is not a file")
    size = resolved.stat().st_size
    if size <= 0 or size > MAX_MEDIA_BYTES:
        raise ValueError("media size outside limit")
    mime, _ = mimetypes.guess_type(resolved.name)
    if mime not in ALLOWED_MEDIA_TYPES:
        raise ValueError("media type is not allowed")
    return resolved, mime, size


def photo_operation_hash(photo_sha256: str) -> str:
    if not re.fullmatch(r"[0-9a-f]{64}", photo_sha256):
        raise ValueError("photo hash invalid")
    return hashlib.sha256((PHOTO_CAPTION + "\0" + photo_sha256).encode("utf-8")).hexdigest()


def read_approved_photo(path: Path = PHOTO_PATH) -> bytes:
    resolved, mime, size = validate_media_path(str(path), MEDIA_ROOT)
    if mime != "image/jpeg":
        raise ValueError("photo must be JPEG")
    data = resolved.read_bytes()
    if len(data) != size or not data.startswith(b"\xff\xd8\xff"):
        raise ValueError("photo content is not a valid JPEG")
    if hashlib.sha256(data).hexdigest().upper() != PHOTO_SHA256:
        raise ValueError("photo hash mismatch")
    return data


def parse_photo_receipt(status: int, payload: Any, expected_chat_id: str, photo_sha256: str) -> dict[str, str]:
    if status != 200 or not isinstance(payload, dict) or payload.get("ok") is not True:
        raise ValueError("photo delivery not confirmed")
    result = payload.get("result")
    if not isinstance(result, dict) or result.get("caption") != PHOTO_CAPTION:
        raise ValueError("photo caption mismatch")
    chat = result.get("chat")
    if not isinstance(chat, dict) or _chat_id_string(chat.get("id")) != expected_chat_id:
        raise ValueError("photo chat mismatch")
    sizes = result.get("photo")
    if not isinstance(sizes, list) or not sizes:
        raise ValueError("photo receipt missing")
    usable_size = any(
        isinstance(row, dict)
        and isinstance(row.get("file_id"), str)
        and bool(row["file_id"].strip())
        and isinstance(row.get("width"), int)
        and not isinstance(row.get("width"), bool)
        and row["width"] > 0
        and isinstance(row.get("height"), int)
        and not isinstance(row.get("height"), bool)
        and row["height"] > 0
        for row in sizes
    )
    if not usable_size:
        raise ValueError("photo receipt missing")
    message_id = _chat_id_string(result.get("message_id"))
    sent_at = result.get("date")
    if message_id is None or isinstance(sent_at, bool) or not isinstance(sent_at, int):
        raise ValueError("photo receipt fields missing")
    return {
        "recipient": OWNER_ALIAS,
        "message_id_sha256": hashlib.sha256(message_id.encode("ascii")).hexdigest(),
        "sent_at_utc": datetime.fromtimestamp(sent_at, tz=timezone.utc).isoformat(),
        "caption_sha256": sha256_text(PHOTO_CAPTION),
        "photo_sha256": photo_sha256,
    }


def build_photo_multipart(boundary: str, chat_id: str, photo: bytes) -> bytes:
    if not re.fullmatch(r"[0-9a-f]{32}", boundary) or _chat_id_string(chat_id) is None:
        raise ValueError("multipart parameters invalid")
    if not photo or len(photo) > MAX_MEDIA_BYTES or not photo.startswith(b"\xff\xd8\xff"):
        raise ValueError("photo bytes invalid")
    marker = boundary.encode("ascii")
    chunks = [
        b"--" + marker + b"\r\nContent-Disposition: form-data; name=\"chat_id\"\r\n\r\n" + chat_id.encode("ascii") + b"\r\n",
        b"--" + marker + b"\r\nContent-Disposition: form-data; name=\"caption\"\r\n\r\n" + PHOTO_CAPTION.encode("utf-8") + b"\r\n",
        b"--" + marker + b"\r\nContent-Disposition: form-data; name=\"photo\"; filename=\"codex-cloud-piloto-real.jpg\"\r\nContent-Type: image/jpeg\r\n\r\n" + photo + b"\r\n",
        b"--" + marker + b"--\r\n",
    ]
    body = b"".join(chunks)
    if len(body) > MAX_MEDIA_BYTES + 64 * 1024:
        raise ValueError("multipart body too large")
    return body


def _is_linklike(path: Path) -> bool:
    if path.is_symlink():
        return True
    junction_check = getattr(path, "is_junction", None)
    return bool(junction_check()) if callable(junction_check) else False


def parse_send_receipt(status: int, payload: Any, expected_chat_id: str) -> dict[str, str]:
    """Only a full, matching Telegram success receipt counts as accepted."""
    if status != 200 or not isinstance(payload, dict) or payload.get("ok") is not True:
        raise ValueError("delivery not confirmed")
    result = payload.get("result")
    if not isinstance(result, dict) or result.get("text") != MESSAGE:
        raise ValueError("sent text mismatch")
    chat = result.get("chat")
    if not isinstance(chat, dict) or _chat_id_string(chat.get("id")) != expected_chat_id:
        raise ValueError("sent chat mismatch")
    message_id = _chat_id_string(result.get("message_id"))
    sent_at = result.get("date")
    if message_id is None or isinstance(sent_at, bool) or not isinstance(sent_at, int):
        raise ValueError("receipt fields missing")
    iso_date = datetime.fromtimestamp(sent_at, tz=timezone.utc).isoformat()
    return {
        "recipient": OWNER_ALIAS,
        "message_id_sha256": hashlib.sha256(message_id.encode("ascii")).hexdigest(),
        "sent_at_utc": iso_date,
        "text_sha256": sha256_text(MESSAGE),
    }


def ledger_reserve(db_path: Path, nonce: str = APPROVAL_REF, body_hash: str | None = None) -> bool:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(db_path, timeout=5)
    try:
        con.execute("CREATE TABLE IF NOT EXISTS dispatch (nonce TEXT PRIMARY KEY, state TEXT NOT NULL, body_sha256 TEXT NOT NULL, receipt_sha256 TEXT, sent_at_utc TEXT)")
        con.execute("BEGIN IMMEDIATE")
        try:
            con.execute("INSERT INTO dispatch(nonce,state,body_sha256) VALUES(?,?,?)", (nonce, "in_flight", body_hash or sha256_text(MESSAGE)))
        except sqlite3.IntegrityError:
            con.rollback()
            return False
        con.commit()
    finally:
        con.close()
    return True


def ledger_update(db_path: Path, state: str, receipt_sha256: str | None = None, sent_at_utc: str | None = None, nonce: str = APPROVAL_REF) -> None:
    if state not in {"accepted", "needs_reconcile", "blocked_before_post"}:
        raise ValueError("invalid state")
    con = sqlite3.connect(db_path, timeout=5)
    try:
        con.execute("UPDATE dispatch SET state=?, receipt_sha256=?, sent_at_utc=? WHERE nonce=?", (state, receipt_sha256, sent_at_utc, nonce))
        con.commit()
    finally:
        con.close()


def single_attempt(post: Callable[[dict[str, Any]], tuple[int, Any]], payload: dict[str, Any], expected_chat_id: str) -> tuple[str, dict[str, str] | None]:
    """Make exactly one injected POST attempt; exceptions remain ambiguous."""
    try:
        status, body = post(payload)
        return "accepted", parse_send_receipt(status, body, expected_chat_id)
    except Exception:
        return "needs_reconcile", None


def _remote_read_token() -> str:
    from dotenv.parser import parse_stream
    env_path = Path("/root/.hermes/.env")
    with env_path.open("r", encoding="utf-8-sig") as stream:
        for item in parse_stream(stream):
            if item.key == "TELEGRAM_BOT_TOKEN" and item.value:
                return item.value
    raise RuntimeError("credential unavailable")


def _remote_api(token: str, method: str, params: dict[str, Any] | None = None, body: dict[str, Any] | None = None) -> tuple[int, Any]:
    path = f"/bot{token}/{method}"
    if params:
        path += "?" + urlencode(params)
    encoded = json.dumps(body, ensure_ascii=False, separators=(",", ":")).encode("utf-8") if body is not None else None
    headers = {"Accept": "application/json", "Connection": "close"}
    if encoded is not None:
        headers["Content-Type"] = "application/json; charset=utf-8"
    connection = http.client.HTTPSConnection("api.telegram.org", timeout=12)
    try:
        connection.request("POST" if body is not None else "GET", path, body=encoded, headers=headers)
        response = connection.getresponse()
        raw = response.read(MAX_HTTP_BODY + 1)
        if len(raw) > MAX_HTTP_BODY:
            raise ValueError("response too large")
        return response.status, json.loads(raw.decode("utf-8"))
    finally:
        connection.close()


def _remote_api_photo(token: str, chat_id: str, photo: bytes) -> tuple[int, Any]:
    boundary = secrets.token_hex(16)
    encoded = build_photo_multipart(boundary, chat_id, photo)
    path = f"/bot{token}/sendPhoto"
    headers = {
        "Accept": "application/json",
        "Connection": "close",
        "Content-Type": f"multipart/form-data; boundary={boundary}",
        "Content-Length": str(len(encoded)),
    }
    connection = http.client.HTTPSConnection("api.telegram.org", timeout=15)
    try:
        connection.request("POST", path, body=encoded, headers=headers)
        response = connection.getresponse()
        raw = response.read(MAX_HTTP_BODY + 1)
        if len(raw) > MAX_HTTP_BODY:
            raise ValueError("response too large")
        return response.status, json.loads(raw.decode("utf-8"))
    finally:
        connection.close()


def _remote_targets() -> dict[str, Any]:
    completed = subprocess.run(
        ["/usr/local/bin/hermes", "send", "--list", "telegram", "--json"],
        stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL,
        timeout=10, check=False, text=True, encoding="utf-8",
    )
    if completed.returncode != 0:
        raise RuntimeError("target directory unavailable")
    value = json.loads(completed.stdout)
    if not isinstance(value, dict) or not isinstance(value.get("platforms"), dict):
        raise ValueError("target directory shape")
    return value


def _remote_preflight() -> tuple[str, str]:
    token = _remote_read_token()
    chat_id = resolve_owner_chat(_remote_targets())
    me_status, me = _remote_api(token, "getMe")
    chat_status, chat = _remote_api(token, "getChat", {"chat_id": chat_id})
    if me_status != 200 or chat_status != 200:
        raise ValueError("metadata status")
    validate_identity(me, chat, chat_id)
    return token, chat_id


def _remote_ledger_reserve(nonce: str = APPROVAL_REF, body_hash: str | None = None, ledger_dir: str | None = None) -> Path:
    os.umask(0o077)
    root = Path(REMOTE_LEDGER_DIR if ledger_dir is None else ledger_dir)
    root.mkdir(mode=0o700, parents=False, exist_ok=False)
    db = root / "send.sqlite3"
    con = sqlite3.connect(db, timeout=5)
    try:
        con.execute("CREATE TABLE dispatch (nonce TEXT PRIMARY KEY, state TEXT NOT NULL, body_sha256 TEXT NOT NULL, recipient TEXT NOT NULL, created_utc TEXT NOT NULL, receipt_sha256 TEXT, sent_at_utc TEXT)")
        con.execute("BEGIN IMMEDIATE")
        con.execute("INSERT INTO dispatch (nonce,state,body_sha256,recipient,created_utc) VALUES(?,?,?,?,?)", (nonce, "in_flight", body_hash or sha256_text(MESSAGE), OWNER_ALIAS, datetime.now(timezone.utc).isoformat()))
        con.commit()
    finally:
        con.close()
    os.chmod(db, 0o600)
    return db


def _remote_set_state(db: Path, state: str, receipt_hash: str | None = None, sent_at_utc: str | None = None, nonce: str = APPROVAL_REF) -> None:
    con = sqlite3.connect(db, timeout=5)
    try:
        con.execute("UPDATE dispatch SET state=?, receipt_sha256=?, sent_at_utc=? WHERE nonce=?", (state, receipt_hash, sent_at_utc, nonce))
        con.commit()
    finally:
        con.close()
    os.chmod(db, 0o600)


def remote_photo_main() -> int:
    try:
        token, chat_id = _remote_preflight()
    except Exception:
        print(json.dumps({"status": "blocked", "stage": "metadata_preflight"}, separators=(",", ":")))
        return 3
    try:
        if not isinstance(PHOTO_DATA_B64, str):
            raise ValueError("photo payload missing")
        photo = base64.b64decode(PHOTO_DATA_B64, validate=True)
        if not photo or len(photo) > MAX_MEDIA_BYTES or not photo.startswith(b"\xff\xd8\xff"):
            raise ValueError("photo payload invalid")
        photo_sha = hashlib.sha256(photo).hexdigest().upper()
        if photo_sha != PHOTO_SHA256:
            raise ValueError("photo hash mismatch")
        body_hash = photo_operation_hash(photo_sha.lower())
    except Exception:
        print(json.dumps({"status": "blocked", "stage": "media_validation"}, separators=(",", ":")))
        return 3
    try:
        db = _remote_ledger_reserve(PHOTO_APPROVAL_REF, body_hash, PHOTO_REMOTE_LEDGER_DIR)
    except Exception:
        print(json.dumps({"status": "blocked", "stage": "ledger_reservation"}, separators=(",", ":")))
        return 4
    try:
        status, response = _remote_api_photo(token, chat_id, photo)
        receipt = parse_photo_receipt(status, response, chat_id, photo_sha.lower())
        receipt_digest = hashlib.sha256(json.dumps(receipt, sort_keys=True).encode("utf-8")).hexdigest()
        _remote_set_state(db, "accepted", receipt_digest, receipt["sent_at_utc"], PHOTO_APPROVAL_REF)
        print(json.dumps({"status": "accepted", **receipt}, ensure_ascii=False, separators=(",", ":")))
        return 0
    except Exception:
        try:
            _remote_set_state(db, "needs_reconcile", nonce=PHOTO_APPROVAL_REF)
        except Exception:
            pass
        print(json.dumps({"status": "needs_reconcile", "recipient": OWNER_ALIAS, "caption_sha256": sha256_text(PHOTO_CAPTION), "photo_sha256": PHOTO_SHA256.lower()}, separators=(",", ":")))
        return 5


def remote_main(mode: str) -> int:
    if mode == "--remote-photo-send":
        return remote_photo_main()
    if mode == "--remote-preflight":
        try:
            _remote_preflight()
            print(json.dumps({"status": "ready", "recipient": OWNER_ALIAS, "bot": "@" + BOT_ALIAS}, separators=(",", ":")))
            return 0
        except Exception:
            print(json.dumps({"status": "blocked", "stage": "metadata_preflight"}, separators=(",", ":")))
            return 3
    if mode != "--remote-send":
        print(json.dumps({"status": "blocked", "stage": "invalid_mode"}, separators=(",", ":")))
        return 2
    try:
        token, chat_id = _remote_preflight()
    except Exception:
        print(json.dumps({"status": "blocked", "stage": "metadata_preflight"}, separators=(",", ":")))
        return 3
    try:
        db = _remote_ledger_reserve()
    except Exception:
        print(json.dumps({"status": "blocked", "stage": "ledger_reservation"}, separators=(",", ":")))
        return 4
    try:
        status, response = _remote_api(token, "sendMessage", body=build_payload(chat_id))
        receipt = parse_send_receipt(status, response, chat_id)
        receipt_digest = hashlib.sha256(json.dumps(receipt, sort_keys=True).encode("utf-8")).hexdigest()
        _remote_set_state(db, "accepted", receipt_digest, receipt["sent_at_utc"])
        print(json.dumps({"status": "accepted", **receipt}, ensure_ascii=False, separators=(",", ":")))
        return 0
    except Exception:
        try:
            _remote_set_state(db, "needs_reconcile")
        except Exception:
            pass
        print(json.dumps({"status": "needs_reconcile", "recipient": OWNER_ALIAS, "text_sha256": sha256_text(MESSAGE)}, separators=(",", ":")))
        return 5


def run_remote(mode: str, timeout: int = 35, photo_bytes: bytes | None = None) -> tuple[int | None, str, str]:
    command = [
        "ssh", "-i", SSH_KEY, "-o", "BatchMode=yes", "-o", "StrictHostKeyChecking=yes",
        "-o", f"UserKnownHostsFile={KNOWN_HOSTS}", SSH_DEST,
        REMOTE_PYTHON, "-", mode,
    ]
    source = Path(__file__).read_bytes()
    if photo_bytes is not None:
        if len(photo_bytes) > MAX_MEDIA_BYTES:
            raise ValueError("photo exceeds configured byte limit")
        marker = b"PHOTO_DATA_B64 = " + b"None"
        if source.count(marker) != 1:
            raise ValueError("photo source marker is not unique")
        encoded = base64.b64encode(photo_bytes)
        source = source.replace(marker, b"PHOTO_DATA_B64 = " + repr(encoded.decode("ascii")).encode("ascii"), 1)
    try:
        proc = subprocess.run(command, input=source, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout, check=False)
        out = proc.stdout.decode("utf-8", errors="replace")
        err = proc.stderr.decode("utf-8", errors="replace")
        return proc.returncode, out, err
    except subprocess.TimeoutExpired as exc:
        return None, (exc.stdout or b"").decode("utf-8", errors="replace"), "timeout"


def local_photo_main() -> int:
    try:
        photo = read_approved_photo()
    except Exception:
        print("photo=blocked_before_post; stage=media_validation; no_retry")
        return 3
    photo_sha = hashlib.sha256(photo).hexdigest().lower()
    body_hash = photo_operation_hash(photo_sha)
    if not ledger_reserve(LOCAL_LEDGER, PHOTO_APPROVAL_REF, body_hash):
        print("photo=refused; approval_nonce_already_reserved")
        return 4
    try:
        rc, out, _ = run_remote("--remote-photo-send", photo_bytes=photo)
    except Exception:
        ledger_update(LOCAL_LEDGER, "needs_reconcile", nonce=PHOTO_APPROVAL_REF)
        print("photo=needs_reconcile; remote_receipt_unavailable; no_retry")
        return 5
    try:
        response = json.loads(out.strip())
    except Exception:
        ledger_update(LOCAL_LEDGER, "needs_reconcile", nonce=PHOTO_APPROVAL_REF)
        print("photo=needs_reconcile; remote_receipt_unavailable; no_retry")
        return 5
    status = response.get("status") if isinstance(response, dict) else None
    if rc == 0 and status == "accepted":
        try:
            expected = {
                "recipient": OWNER_ALIAS,
                "caption_sha256": sha256_text(PHOTO_CAPTION),
                "photo_sha256": photo_sha,
            }
            for key, value in expected.items():
                if response.get(key) != value:
                    raise ValueError("receipt identity mismatch")
            message_hash = response.get("message_id_sha256")
            sent_at = response.get("sent_at_utc")
            if not isinstance(message_hash, str) or not re.fullmatch(r"[0-9a-f]{64}", message_hash):
                raise ValueError("receipt message hash invalid")
            if not isinstance(sent_at, str):
                raise ValueError("receipt date missing")
            parsed_date = datetime.fromisoformat(sent_at)
            if parsed_date.tzinfo is None or parsed_date.utcoffset() is None:
                raise ValueError("receipt date not UTC-aware")
        except Exception:
            ledger_update(LOCAL_LEDGER, "needs_reconcile", nonce=PHOTO_APPROVAL_REF)
            print("photo=needs_reconcile; receipt_incomplete; no_retry")
            return 5
        receipt_fields = {key: response[key] for key in ("status", "recipient", "message_id_sha256", "sent_at_utc", "caption_sha256", "photo_sha256")}
        receipt_hash = sha256_text(json.dumps(receipt_fields, sort_keys=True))
        ledger_update(LOCAL_LEDGER, "accepted", receipt_hash, sent_at, PHOTO_APPROVAL_REF)
        print(json.dumps(receipt_fields, ensure_ascii=False, separators=(",", ":")))
        return 0
    if status == "blocked":
        ledger_update(LOCAL_LEDGER, "blocked_before_post", nonce=PHOTO_APPROVAL_REF)
        stage = response.get("stage") if isinstance(response, dict) else None
        safe_stage = stage if stage in {"metadata_preflight", "ledger_reservation", "media_validation", "invalid_mode"} else "unknown"
        print(f"photo=blocked_before_post; stage={safe_stage}; no_retry")
        return 3
    ledger_update(LOCAL_LEDGER, "needs_reconcile", nonce=PHOTO_APPROVAL_REF)
    print("photo=needs_reconcile; no_retry")
    return 5


def local_main(mode: str) -> int:
    if mode == "--self-test":
        import unittest
        from test_dispatcher import DispatcherTests
        suite = unittest.defaultTestLoader.loadTestsFromTestCase(DispatcherTests)
        result = unittest.TextTestRunner(verbosity=2).run(suite)
        return 0 if result.wasSuccessful() else 1
    if mode == "--send-photo-once":
        return local_photo_main()
    if mode == "--preflight":
        rc, out, _ = run_remote("--remote-preflight")
        try:
            response = json.loads(out.strip())
        except Exception:
            print("preflight=blocked (no raw remote output shown)")
            return 3
        if rc == 0 and response == {"status": "ready", "recipient": OWNER_ALIAS, "bot": "@" + BOT_ALIAS}:
            print("preflight=ready; recipient=owner-private-alias; bot=verified")
            return 0
        print("preflight=blocked")
        return 3
    if mode != "--send-once":
        print("usage: dispatcher.py --self-test | --preflight | --send-once | --send-photo-once")
        return 2
    if not ledger_reserve(LOCAL_LEDGER):
        print("send=refused; approval_nonce_already_reserved")
        return 4
    rc, out, _ = run_remote("--remote-send")
    try:
        response = json.loads(out.strip())
    except Exception:
        ledger_update(LOCAL_LEDGER, "needs_reconcile")
        print("send=needs_reconcile; remote_receipt_unavailable; no_retry")
        return 5
    status = response.get("status") if isinstance(response, dict) else None
    if rc == 0 and status == "accepted":
        try:
            message_hash = response.get("message_id_sha256")
            sent_at = response.get("sent_at_utc")
            if response.get("recipient") != OWNER_ALIAS or response.get("text_sha256") != sha256_text(MESSAGE):
                raise ValueError("receipt identity mismatch")
            if not isinstance(message_hash, str) or not re.fullmatch(r"[0-9a-f]{64}", message_hash):
                raise ValueError("receipt message hash invalid")
            if not isinstance(sent_at, str):
                raise ValueError("receipt date missing")
            parsed_date = datetime.fromisoformat(sent_at)
            if parsed_date.tzinfo is None or parsed_date.utcoffset() is None:
                raise ValueError("receipt date not UTC-aware")
        except Exception:
            ledger_update(LOCAL_LEDGER, "needs_reconcile")
            print("send=needs_reconcile; receipt_incomplete; no_retry")
            return 5
        receipt_hash = sha256_text(json.dumps({k: response[k] for k in ("status", "recipient", "message_id_sha256", "sent_at_utc", "text_sha256")}, sort_keys=True))
        ledger_update(LOCAL_LEDGER, "accepted", receipt_hash, sent_at)
        print(json.dumps({k: response[k] for k in ("status", "recipient", "message_id_sha256", "sent_at_utc", "text_sha256")}, ensure_ascii=False, separators=(",", ":")))
        return 0
    if status == "blocked":
        ledger_update(LOCAL_LEDGER, "blocked_before_post")
        stage = response.get("stage") if isinstance(response, dict) else None
        safe_stage = stage if stage in {"metadata_preflight", "ledger_reservation", "invalid_mode"} else "unknown"
        print(f"send=blocked_before_post; stage={safe_stage}; no_retry")
        return 3
    ledger_update(LOCAL_LEDGER, "needs_reconcile")
    print("send=needs_reconcile; no_retry")
    return 5


if __name__ == "__main__":
    arguments = sys.argv[1:]
    if not arguments:
        print("usage: dispatcher.py --self-test | --preflight | --send-once | --send-photo-once")
        sys.exit(2)
    if arguments[0].startswith("--remote-"):
        sys.exit(remote_main(arguments[0]))
    sys.exit(local_main(arguments[0]))



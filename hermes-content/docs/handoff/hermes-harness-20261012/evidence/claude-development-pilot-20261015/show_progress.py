#!/usr/bin/env python3
"""Passive Warp/terminal viewer; only reads sanitized local/exported JSON.

No transport, provider, dispatch, authentication or live subscription is created.
Default: one read (--once). --watch opts into 30s active / 120s idle refresh.
Cloud schema 1: source, timestamp (aware ISO8601), goal, task, owner, provider,
model_configured, model_observed, phase, tests {pass,fail,skip}, links, blocker,
next_action. Missing metadata is UNKNOWN; a recent snapshot is never live proof.
Exporters must remove secrets before writing. Validation rejects common secret
patterns and control characters, but cannot identify every arbitrary secret.
"""
import argparse
import json
import os
from pathlib import Path
import re
import stat
import sys
import time
import unicodedata
from datetime import datetime, timedelta, timezone
from urllib.parse import urlsplit


MAX_BYTES = 64 * 1024
UTC_MINUS_4 = timezone(timedelta(hours=-4))
UNKNOWN = "UNKNOWN"
FIELDS = frozenset(("schema", "source", "timestamp", "goal", "task", "owner",
                    "provider", "model_configured", "model_observed", "phase",
                    "tests", "links", "blocker", "next_action"))
TEXT_FIELDS = ("source", "goal", "task", "owner", "provider", "model_configured",
               "model_observed", "blocker", "next_action")
PHASES = frozenset(("idle", "pending", "submitted", "running", "execution", "review",
                    "qa", "completed", "failed", "cancelled", "hold", "blocked",
                    "needs_reconcile", UNKNOWN))
ACTIVE = frozenset(("pending", "submitted", "running", "execution", "review", "qa"))
SECRET = re.compile(r"(?i)(?:\b(?:bearer|authorization|password|api[_-]?key|access[_-]?token|refresh[_-]?token)\b"
                    r"|\bsk-[A-Za-z0-9_-]{8,}|\bgh[pousr]_[A-Za-z0-9_]{8,}"
                    r"|\bgithub_pat_[A-Za-z0-9_]+|\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+)")
LINK_HOSTS = frozenset(("github.com", "chatgpt.com", "claude.ai"))


class InvalidSnapshot(ValueError):
    """Messages are fixed codes; never include user data or filesystem errors."""


def _pairs(pairs):
    out = {}
    for key, value in pairs:
        if key in out:
            raise InvalidSnapshot("duplicate_key")
        out[key] = value
    return out


def _constant(_value):
    raise InvalidSnapshot("nonfinite_number")


def _text(value, ceiling=256):
    if value is None or value == "":
        return UNKNOWN
    if (type(value) is not str or len(value) > ceiling or not value.isprintable()
            or any(unicodedata.category(c).startswith("C") for c in value)
            or SECRET.search(value)):
        raise InvalidSnapshot("unsafe_text")
    return value.strip() or UNKNOWN


def _timestamp(value):
    if value in (None, "", UNKNOWN):
        return None
    value = _text(value, 64)
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        if parsed.tzinfo is None or parsed.utcoffset() is None:
            raise ValueError()
        parsed.astimezone(UTC_MINUS_4)  # reject offset conversion overflow at input
        return parsed
    except (ValueError, OverflowError):
        raise InvalidSnapshot("invalid_timestamp") from None


def _tests(value):
    if value is None:
        return {k: UNKNOWN for k in ("pass", "fail", "skip")}
    if type(value) is not dict or set(value) - {"pass", "fail", "skip"}:
        raise InvalidSnapshot("invalid_tests")
    out = {}
    for key in ("pass", "fail", "skip"):
        n = value.get(key, UNKNOWN)
        if n != UNKNOWN and (type(n) is not int or not 0 <= n <= 10_000_000):
            raise InvalidSnapshot("invalid_tests")
        out[key] = n
    return out


def _links(value):
    if value is None:
        return ()
    if type(value) is not list or len(value) > 8:
        raise InvalidSnapshot("invalid_links")
    out = []
    for raw in value:
        raw = _text(raw, 512)
        try:
            url = urlsplit(raw)
            if (url.scheme != "https" or url.netloc not in LINK_HOSTS
                    or url.username or url.password or url.port or url.query
                    or not re.fullmatch(r"/[A-Za-z0-9._~/-]*", url.path or "/")
                    or (url.fragment and not re.fullmatch(r"L[0-9]+", url.fragment))):
                raise ValueError()
        except ValueError:
            raise InvalidSnapshot("invalid_links") from None
        out.append(raw)
    return tuple(out)


def normalize(value):
    if type(value) is not dict or set(value) - FIELDS or type(value.get("schema")) is not int or value["schema"] != 1:
        raise InvalidSnapshot("invalid_schema")
    result = {k: _text(value.get(k), 512 if k in ("blocker", "next_action") else 256)
              for k in TEXT_FIELDS}
    phase = _text(value.get("phase"))
    if phase not in PHASES:
        raise InvalidSnapshot("invalid_phase")
    result.update(phase=phase, timestamp=_timestamp(value.get("timestamp")),
                  tests=_tests(value.get("tests")), links=_links(value.get("links")))
    return result


def load_snapshot(path, *, legacy=False):
    """Bounded regular-file read only; no discovery, symlinks, writes or network."""
    path = Path(path)
    if path.suffix.lower() != ".json" or path.name.lower() in ("auth.json", "credentials.json", "config.json"):
        raise InvalidSnapshot("invalid_source")
    try:
        if not stat.S_ISREG(path.lstat().st_mode):
            raise InvalidSnapshot("invalid_source")
        fd = os.open(path, os.O_RDONLY | getattr(os, "O_NOFOLLOW", 0) | getattr(os, "O_NONBLOCK", 0))
        with os.fdopen(fd, "rb") as handle:
            if not stat.S_ISREG(os.fstat(handle.fileno()).st_mode):
                raise InvalidSnapshot("invalid_source")
            raw = handle.read(MAX_BYTES + 1)
        if len(raw) > MAX_BYTES:
            raise InvalidSnapshot("oversize")
        value = json.loads(raw.decode("utf-8", errors="strict"), object_pairs_hook=_pairs,
                           parse_constant=_constant)
    except InvalidSnapshot:
        raise
    except (OSError, UnicodeError, ValueError, RecursionError):
        raise InvalidSnapshot("unreadable_or_invalid_json") from None
    return normalize(_legacy_projection(value, path.name) if legacy else value)


def _legacy_projection(value, name):
    """Keep default receipt names readable; never render raw tests/tool streams."""
    if type(value) is not dict:
        raise InvalidSnapshot("invalid_schema")
    result = {"schema": 1, "source": "legacy receipt: " + name,
              "phase": value.get("state", value.get("status", UNKNOWN)),
              "model_observed": value.get("observed_init_model", value.get("observed_model", UNKNOWN))}
    # Unknown historical phase labels do not become current execution claims.
    result["phase"] = _text(result["phase"])
    if result["phase"] not in PHASES:
        result["phase"] = UNKNOWN
    for key in ("goal", "task", "owner", "provider", "model_configured", "timestamp", "blocker", "next_action"):
        if key in value:
            result[key] = value[key]
    tests = value.get("tests")
    if type(tests) is dict and not set(tests) - {"pass", "fail", "skip"}:
        result["tests"] = tests
    return result


def render(snapshot, *, now=None, stale_after=300):
    now = now or datetime.now(timezone.utc)
    if now.tzinfo is None:
        raise InvalidSnapshot("invalid_clock")
    stamp = snapshot["timestamp"]
    age = (now - stamp).total_seconds() if stamp is not None else None
    freshness = ("UNKNOWN" if age is None else "CLOCK_SKEW" if age < 0
                 else "STALE" if age > stale_after else "RECENT_SNAPSHOT")
    date = stamp.astimezone(UTC_MINUS_4).isoformat(timespec="seconds") if stamp else UNKNOWN
    lines = ["ONIA | SNAPSHOT PASIVO | NO LIVE | sin control de proveedores",
             "Fuente: " + snapshot["source"],
             "Fecha fuente UTC-4: " + date + " | stale: " + freshness,
             "Goal: " + snapshot["goal"] + " | Task: " + snapshot["task"],
             "Owner: " + snapshot["owner"] + " | Provider: " + snapshot["provider"],
             "Modelo configured: " + snapshot["model_configured"] + " | observed: " + snapshot["model_observed"],
             "Phase (de fuente): " + snapshot["phase"],
             "Tests pass/fail/skip: " + "/".join(str(snapshot["tests"][k]) for k in ("pass", "fail", "skip")),
             "Blocker: " + snapshot["blocker"], "Next action (informativa): " + snapshot["next_action"],
             "Links: " + (" | ".join(snapshot["links"]) if snapshot["links"] else UNKNOWN)]
    return "\n".join(lines)


def refresh_seconds(snapshots):
    return 30 if any(x["phase"] in ACTIVE for x in snapshots) else 120


class SafeParser(argparse.ArgumentParser):
    def error(self, _message):
        self.print_usage(sys.stderr)
        self.exit(2, "argumentos invalidos; use --help\n")


def main(argv=None):
    parser = SafeParser(prog="show_progress.py", description=__doc__)
    parser.add_argument("--snapshot", help="JSON exportado y saneado, schema 1; nunca auth/config")
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--once", dest="watch", action="store_false", help="una lectura (predeterminado)")
    mode.add_argument("--watch", action="store_true", help="opt-in: refresco 30s activo / 120s idle")
    parser.set_defaults(watch=False)
    args = parser.parse_args(argv)
    folder = Path(__file__).resolve().parent
    paths = [Path(args.snapshot)] if args.snapshot else [folder / n for n in
             ("implementation-receipt.json", "fallback-receipt.json")]
    try:
        while True:
            snapshots, failed = [], False
            for path in paths:
                try:
                    snapshots.append(load_snapshot(path, legacy=not bool(args.snapshot)))
                except InvalidSnapshot as error:
                    # Fixed validation code only, never raw input, filename or error.
                    print("ONIA | snapshot no disponible: " + str(error), flush=True)
                    failed = True
            for snapshot in snapshots:
                print(render(snapshot), flush=True)
            if not args.watch:
                return 2 if failed else 0
            time.sleep(refresh_seconds(snapshots))
    except KeyboardInterrupt:
        print("Visor cerrado. Ningun proveedor fue iniciado/detenido.")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())

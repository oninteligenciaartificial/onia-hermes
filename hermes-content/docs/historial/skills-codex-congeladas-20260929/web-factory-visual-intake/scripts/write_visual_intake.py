#!/usr/bin/env python3
"""Store a visual reference extraction in ONIA Web Factory.

This script expects a JSON file that follows references/intake-contract.md.
It writes a machine-readable artifact and appends a short note to the
client context markdown file.
"""

from __future__ import annotations

import argparse
import json
import re
from datetime import date
from pathlib import Path
from typing import Any


REQUIRED_FIELDS = [
    "clientSlug",
    "referenceName",
    "sourcePath",
    "summary",
    "visualSystem",
    "webFactoryDirectives",
]


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", value.strip().lower()).strip("-")
    return slug or "reference"


def load_payload(path: Path) -> dict[str, Any]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    missing = [field for field in REQUIRED_FIELDS if not payload.get(field)]
    if missing:
        raise SystemExit(f"Missing required fields: {', '.join(missing)}")
    return payload


def write_artifact(repo: Path, payload: dict[str, Any]) -> Path:
    client_slug = slugify(str(payload["clientSlug"]))
    reference_slug = slugify(str(payload["referenceName"]))
    captured = str(payload.get("dateCaptured") or date.today().isoformat())
    captured_slug = slugify(captured)

    out_dir = repo / "web-factory" / "data" / "references" / "visual" / client_slug
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / f"{captured_slug}-{reference_slug}.json"
    out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return out_path


def append_context(repo: Path, payload: dict[str, Any], artifact_path: Path) -> Path:
    client_slug = slugify(str(payload["clientSlug"]))
    context_path = repo / "web-factory" / "data" / "clients" / f"{client_slug}.context.md"
    source_path = str(payload["sourcePath"])

    if context_path.exists():
        existing = context_path.read_text(encoding="utf-8")
    else:
        existing = f"# {client_slug.title()} Web Context\n\n"

    if source_path in existing:
        return context_path

    rel_artifact = artifact_path.relative_to(repo).as_posix()
    visual = payload.get("visualSystem") or {}
    directives = payload.get("webFactoryDirectives") or {}
    palette = ", ".join(visual.get("palette") or [])
    template_impact = directives.get("templateImpact") or []

    block = [
        "",
        "## Visual Reference Intake",
        "",
        f"- Reference: `{payload['referenceName']}`",
        f"- Source: `{source_path}`",
        f"- Captured: `{payload.get('dateCaptured') or date.today().isoformat()}`",
        f"- Artifact: `{rel_artifact}`",
        f"- Summary: {payload['summary']}",
    ]

    if palette:
        block.append(f"- Palette notes: {palette}")

    if template_impact:
        block.append("- Template impact:")
        block.extend([f"  - {item}" for item in template_impact])

    block.append("")
    context_path.write_text(existing.rstrip() + "\n" + "\n".join(block), encoding="utf-8")
    return context_path


def main() -> None:
    parser = argparse.ArgumentParser(description="Store a Web Factory visual reference extraction.")
    parser.add_argument("--repo", required=True, help="Path to onia-hermes repository root.")
    parser.add_argument("--input", required=True, help="Path to JSON extraction file.")
    args = parser.parse_args()

    repo = Path(args.repo).resolve()
    payload = load_payload(Path(args.input).resolve())
    artifact_path = write_artifact(repo, payload)
    context_path = append_context(repo, payload, artifact_path)

    print(f"artifact={artifact_path}")
    print(f"context={context_path}")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Hermes cross-platform social publisher.

Safe by default: publishing commands dry-run unless --execute is passed.
Secrets are never printed in full.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request


def _env(name: str, default: str = "") -> str:
    return os.environ.get(name, default).strip()


def _redact(value: str) -> str:
    if not value:
        return ""
    if len(value) <= 10:
        return "***"
    return f"{value[:4]}...{value[-4:]}"


def _env_group(names: list[str]) -> dict:
    return {
        name: {
            "set": bool(_env(name)),
            "length": len(_env(name)),
            "preview": _redact(_env(name)),
        }
        for name in names
    }


def _json(data: dict) -> None:
    print(json.dumps(data, ensure_ascii=False, indent=2))


def _request_json(
    method: str,
    url: str,
    *,
    token: str,
    body: dict | None = None,
    headers: dict | None = None,
) -> dict:
    raw = json.dumps(body or {}).encode("utf-8") if body is not None else None
    req_headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json; charset=UTF-8",
    }
    if headers:
        req_headers.update(headers)
    req = urllib.request.Request(url, data=raw, method=method, headers=req_headers)
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            text = resp.read().decode("utf-8")
            parsed = json.loads(text) if text else {}
            return {
                "ok": 200 <= resp.status < 300,
                "status": resp.status,
                "headers": {k.lower(): v for k, v in resp.headers.items()},
                "data": parsed,
            }
    except urllib.error.HTTPError as exc:
        text = exc.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(text)
        except json.JSONDecodeError:
            parsed = {"raw": text}
        return {"ok": False, "status": exc.code, "data": parsed}


def healthcheck(_args: argparse.Namespace) -> None:
    platforms = {
        "instagram": _env_group(["META_LONG_LIVED_TOKEN", "IG_BUSINESS_ACCOUNT_ID"]),
        "tiktok": _env_group(
            [
                "TIKTOK_CLIENT_KEY",
                "TIKTOK_CLIENT_SECRET",
                "TIKTOK_ACCESS_TOKEN",
                "TIKTOK_REFRESH_TOKEN",
                "TIKTOK_OPEN_ID",
            ]
        ),
        "youtube": _env_group(
            [
                "YOUTUBE_CLIENT_ID",
                "YOUTUBE_CLIENT_SECRET",
                "YOUTUBE_REFRESH_TOKEN",
                "YOUTUBE_CHANNEL_ID",
            ]
        ),
        "linkedin": _env_group(
            [
                "LINKEDIN_ACCESS_TOKEN",
                "LINKEDIN_AUTHOR_URN",
                "LINKEDIN_VERSION",
            ]
        ),
    }
    ready = {
        "instagram": platforms["instagram"]["META_LONG_LIVED_TOKEN"]["set"]
        and platforms["instagram"]["IG_BUSINESS_ACCOUNT_ID"]["set"],
        "tiktok": platforms["tiktok"]["TIKTOK_ACCESS_TOKEN"]["set"],
        "youtube": platforms["youtube"]["YOUTUBE_REFRESH_TOKEN"]["set"],
        "linkedin": platforms["linkedin"]["LINKEDIN_ACCESS_TOKEN"]["set"]
        and platforms["linkedin"]["LINKEDIN_AUTHOR_URN"]["set"],
    }
    _json({"ok": True, "ready": ready, "platforms": platforms})


def tiktok_creator_info(_args: argparse.Namespace) -> None:
    token = _env("TIKTOK_ACCESS_TOKEN")
    if not token:
        raise RuntimeError("Missing TIKTOK_ACCESS_TOKEN")
    result = _request_json(
        "POST",
        "https://open.tiktokapis.com/v2/post/publish/creator_info/query/",
        token=token,
        body={},
    )
    _json(result)


def tiktok_video_init(args: argparse.Namespace) -> None:
    if not args.video_url.startswith("https://"):
        raise RuntimeError("TikTok PULL_FROM_URL requires an https video URL")
    payload = {
        "post_info": {
            "title": args.description,
            "privacy_level": args.privacy,
            "disable_duet": args.disable_duet,
            "disable_comment": args.disable_comment,
            "disable_stitch": args.disable_stitch,
            "video_cover_timestamp_ms": args.cover_ms,
        },
        "source_info": {
            "source": "PULL_FROM_URL",
            "video_url": args.video_url,
        },
    }
    if not args.execute:
        _json({"ok": True, "dry_run": True, "platform": "tiktok", "payload": payload})
        return
    token = _env("TIKTOK_ACCESS_TOKEN")
    if not token:
        raise RuntimeError("Missing TIKTOK_ACCESS_TOKEN")
    result = _request_json(
        "POST",
        "https://open.tiktokapis.com/v2/post/publish/video/init/",
        token=token,
        body=payload,
    )
    _json(result)


def tiktok_status(args: argparse.Namespace) -> None:
    token = _env("TIKTOK_ACCESS_TOKEN")
    if not token:
        raise RuntimeError("Missing TIKTOK_ACCESS_TOKEN")
    result = _request_json(
        "POST",
        "https://open.tiktokapis.com/v2/post/publish/status/fetch/",
        token=token,
        body={"publish_id": args.publish_id},
    )
    _json(result)


def linkedin_text_post(args: argparse.Namespace) -> None:
    author = _env("LINKEDIN_AUTHOR_URN")
    version = _env("LINKEDIN_VERSION", "202605")
    payload = {
        "author": author or "urn:li:person:<person_id_or_organization_urn>",
        "commentary": args.commentary,
        "visibility": "PUBLIC",
        "distribution": {
            "feedDistribution": "MAIN_FEED",
            "targetEntities": [],
            "thirdPartyDistributionChannels": [],
        },
        "lifecycleState": "PUBLISHED",
        "isReshareDisabledByAuthor": False,
    }
    if not args.execute:
        _json({"ok": True, "dry_run": True, "platform": "linkedin", "payload": payload})
        return
    token = _env("LINKEDIN_ACCESS_TOKEN")
    if not token:
        raise RuntimeError("Missing LINKEDIN_ACCESS_TOKEN")
    if not author:
        raise RuntimeError("Missing LINKEDIN_AUTHOR_URN")
    result = _request_json(
        "POST",
        "https://api.linkedin.com/rest/posts",
        token=token,
        body=payload,
        headers={
            "X-Restli-Protocol-Version": "2.0.0",
            "Linkedin-Version": version,
            "Content-Type": "application/json",
        },
    )
    post_id = result.get("headers", {}).get("x-restli-id")
    if post_id:
        result["post_id"] = post_id
    _json(result)


def youtube_package(args: argparse.Namespace) -> None:
    package = {
        "platform": "youtube",
        "status": "package_only",
        "upload_endpoint": "https://www.googleapis.com/upload/youtube/v3/videos",
        "required_scope": "https://www.googleapis.com/auth/youtube.upload",
        "metadata": {
            "snippet": {
                "title": args.title,
                "description": args.description,
                "tags": [tag.strip() for tag in args.tags.split(",") if tag.strip()],
                "categoryId": args.category,
            },
            "status": {
                "privacyStatus": args.privacy,
                "selfDeclaredMadeForKids": False,
            },
        },
        "file": args.file or "<mp4_file>",
        "note": "YouTube upload needs OAuth refresh token and upload implementation before execute mode.",
    }
    _json({"ok": True, "dry_run": True, "package": package})


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Hermes cross-platform social publisher")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("healthcheck")
    p.set_defaults(func=healthcheck)

    p = sub.add_parser("tiktok_creator_info")
    p.set_defaults(func=tiktok_creator_info)

    p = sub.add_parser("tiktok_video_init")
    p.add_argument("--video-url", required=True)
    p.add_argument("--description", required=True)
    p.add_argument("--privacy", default="SELF_ONLY")
    p.add_argument("--cover-ms", type=int, default=1000)
    p.add_argument("--disable-duet", action="store_true")
    p.add_argument("--disable-comment", action="store_true")
    p.add_argument("--disable-stitch", action="store_true")
    p.add_argument("--execute", action="store_true")
    p.set_defaults(func=tiktok_video_init)

    p = sub.add_parser("tiktok_status")
    p.add_argument("--publish-id", required=True)
    p.set_defaults(func=tiktok_status)

    p = sub.add_parser("linkedin_text_post")
    p.add_argument("--commentary", required=True)
    p.add_argument("--execute", action="store_true")
    p.set_defaults(func=linkedin_text_post)

    p = sub.add_parser("youtube_package")
    p.add_argument("--file", default="")
    p.add_argument("--title", required=True)
    p.add_argument("--description", required=True)
    p.add_argument("--tags", default="")
    p.add_argument("--category", default="22")
    p.add_argument("--privacy", default="unlisted")
    p.set_defaults(func=youtube_package)

    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        args.func(args)
        return 0
    except Exception as exc:
        _json({"ok": False, "error": str(exc)})
        return 1


if __name__ == "__main__":
    sys.exit(main())

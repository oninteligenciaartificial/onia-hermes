#!/usr/bin/env python3
"""
Instagram Graph API publisher (stdlib-only).

Required env:
  META_LONG_LIVED_TOKEN
  IG_BUSINESS_ACCOUNT_ID

Optional env:
  GRAPH_API_VERSION (default: v21.0)

Commands:
  healthcheck
  post_test --image-url <url> --caption <text>
  reel_publish --video-url <url> --caption <text>
  carousel_publish --image-urls <url1,url2,...> --caption <text>
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.parse
import urllib.request


def _env(name: str) -> str:
    v = os.environ.get(name)
    if not v:
        raise RuntimeError(f"Missing env var {name}")
    return v


def _api_base() -> str:
    version = os.environ.get("GRAPH_API_VERSION", "v21.0")
    return f"https://graph.facebook.com/{version}"


def _request_json(url: str, data: dict | None = None, method: str | None = None) -> dict:
    headers = {"Accept": "application/json"}
    if data is None:
        req = urllib.request.Request(url, headers=headers, method=method or "GET")
    else:
        body = urllib.parse.urlencode(data).encode("utf-8")
        headers["Content-Type"] = "application/x-www-form-urlencoded"
        req = urllib.request.Request(url, data=body, headers=headers, method=method or "POST")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        try:
            payload = json.loads(raw)
        except Exception:
            payload = {"error": {"message": raw}}
        raise RuntimeError(f"Graph API HTTP {e.code}: {json.dumps(payload, ensure_ascii=False)}")


def debug_token(token: str) -> dict:
    base = _api_base()
    # `input_token` can be validated with `access_token` itself. App token is better,
    # but we keep this stdlib-only and avoid forcing APP_ID/SECRET.
    query = urllib.parse.urlencode({"input_token": token, "access_token": token})
    url = f"{base}/debug_token?{query}"
    return _request_json(url)


def ig_create_media(ig_user_id: str, token: str, *, image_url: str | None, video_url: str | None, caption: str, media_type: str | None) -> str:
    base = _api_base()
    url = f"{base}/{ig_user_id}/media"
    data = {"access_token": token, "caption": caption}
    if image_url:
        data["image_url"] = image_url
    if video_url:
        data["video_url"] = video_url
    if media_type:
        data["media_type"] = media_type
    resp = _request_json(url, data=data, method="POST")
    creation_id = resp.get("id")
    if not creation_id:
        raise RuntimeError(f"Missing creation id: {resp}")
    return creation_id


def ig_create_carousel_item(ig_user_id: str, token: str, image_url: str) -> str:
    base = _api_base()
    url = f"{base}/{ig_user_id}/media"
    resp = _request_json(
        url,
        data={"image_url": image_url, "is_carousel_item": "true", "access_token": token},
        method="POST",
    )
    creation_id = resp.get("id")
    if not creation_id:
        raise RuntimeError(f"Missing carousel item id: {resp}")
    return creation_id


def ig_create_carousel_container(ig_user_id: str, token: str, children: list[str], caption: str) -> str:
    base = _api_base()
    url = f"{base}/{ig_user_id}/media"
    resp = _request_json(
        url,
        data={
            "media_type": "CAROUSEL",
            "children": ",".join(children),
            "caption": caption,
            "access_token": token,
        },
        method="POST",
    )
    creation_id = resp.get("id")
    if not creation_id:
        raise RuntimeError(f"Missing carousel container id: {resp}")
    return creation_id


def ig_publish_media(ig_user_id: str, token: str, creation_id: str) -> str:
    base = _api_base()
    url = f"{base}/{ig_user_id}/media_publish"
    resp = _request_json(url, data={"creation_id": creation_id, "access_token": token}, method="POST")
    post_id = resp.get("id")
    if not post_id:
        raise RuntimeError(f"Missing published id: {resp}")
    return post_id


def ig_container_status(container_id: str, token: str) -> dict:
    base = _api_base()
    fields = "status_code,status"
    url = f"{base}/{container_id}?{urllib.parse.urlencode({'fields': fields, 'access_token': token})}"
    return _request_json(url)


def wait_container(container_id: str, token: str, timeout_s: int = 600) -> dict:
    start = time.time()
    last = None
    while True:
        last = ig_container_status(container_id, token)
        status_code = last.get("status_code")
        if status_code in ("FINISHED", "ERROR"):
            return last
        if time.time() - start > timeout_s:
            raise RuntimeError(f"Timeout waiting container {container_id}: {last}")
        time.sleep(5)


def cmd_healthcheck() -> None:
    token = _env("META_LONG_LIVED_TOKEN")
    ig_user_id = _env("IG_BUSINESS_ACCOUNT_ID")
    dbg = debug_token(token)
    out = {
        "ok": True,
        "ig_business_account_id": ig_user_id,
        "debug_token": dbg,
    }
    print(json.dumps(out, ensure_ascii=False))


def cmd_post_test(image_url: str, caption: str) -> None:
    token = _env("META_LONG_LIVED_TOKEN")
    ig_user_id = _env("IG_BUSINESS_ACCOUNT_ID")
    creation_id = ig_create_media(ig_user_id, token, image_url=image_url, video_url=None, caption=caption, media_type=None)
    # Image containers usually do not need polling, but it is safe to check quickly.
    status = wait_container(creation_id, token, timeout_s=180)
    if status.get("status_code") == "ERROR":
        raise RuntimeError(f"Container error: {status}")
    post_id = ig_publish_media(ig_user_id, token, creation_id)
    print(json.dumps({"ok": True, "creation_id": creation_id, "published_id": post_id, "status": status}, ensure_ascii=False))


def cmd_reel_publish(video_url: str, caption: str) -> None:
    token = _env("META_LONG_LIVED_TOKEN")
    ig_user_id = _env("IG_BUSINESS_ACCOUNT_ID")
    creation_id = ig_create_media(
        ig_user_id,
        token,
        image_url=None,
        video_url=video_url,
        caption=caption,
        media_type="REELS",
    )
    status = wait_container(creation_id, token, timeout_s=900)
    if status.get("status_code") == "ERROR":
        raise RuntimeError(f"Container error: {status}")
    post_id = ig_publish_media(ig_user_id, token, creation_id)
    print(json.dumps({"ok": True, "creation_id": creation_id, "published_id": post_id, "status": status}, ensure_ascii=False))


def cmd_carousel_publish(image_urls: str, caption: str) -> None:
    token = _env("META_LONG_LIVED_TOKEN")
    ig_user_id = _env("IG_BUSINESS_ACCOUNT_ID")
    urls = [u.strip() for u in image_urls.split(",") if u.strip()]
    if len(urls) < 2:
        raise RuntimeError("Carousel requires at least 2 image URLs")
    if len(urls) > 10:
        raise RuntimeError("Instagram carousel supports up to 10 image URLs")

    children = []
    child_statuses = []
    for image_url in urls:
        child_id = ig_create_carousel_item(ig_user_id, token, image_url)
        status = wait_container(child_id, token, timeout_s=300)
        if status.get("status_code") == "ERROR":
            raise RuntimeError(f"Carousel item error: {status}")
        children.append(child_id)
        child_statuses.append({"id": child_id, "status": status})

    creation_id = ig_create_carousel_container(ig_user_id, token, children, caption)
    status = wait_container(creation_id, token, timeout_s=300)
    if status.get("status_code") == "ERROR":
        raise RuntimeError(f"Carousel container error: {status}")
    post_id = ig_publish_media(ig_user_id, token, creation_id)
    print(
        json.dumps(
            {
                "ok": True,
                "creation_id": creation_id,
                "published_id": post_id,
                "children": children,
                "child_statuses": child_statuses,
                "status": status,
            },
            ensure_ascii=False,
        )
    )


def main(argv: list[str]) -> int:
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("healthcheck")

    p_post = sub.add_parser("post_test")
    p_post.add_argument("--image-url", required=True)
    p_post.add_argument("--caption", required=True)

    p_reel = sub.add_parser("reel_publish")
    p_reel.add_argument("--video-url", required=True)
    p_reel.add_argument("--caption", required=True)

    p_carousel = sub.add_parser("carousel_publish")
    p_carousel.add_argument("--image-urls", required=True)
    p_carousel.add_argument("--caption", required=True)

    args = p.parse_args(argv)
    if args.cmd == "healthcheck":
        cmd_healthcheck()
        return 0
    if args.cmd == "post_test":
        cmd_post_test(args.image_url, args.caption)
        return 0
    if args.cmd == "reel_publish":
        cmd_reel_publish(args.video_url, args.caption)
        return 0
    if args.cmd == "carousel_publish":
        cmd_carousel_publish(args.image_urls, args.caption)
        return 0
    raise RuntimeError("unreachable")


if __name__ == "__main__":
    try:
        raise SystemExit(main(sys.argv[1:]))
    except Exception as e:
        print(json.dumps({"ok": False, "error": str(e)}, ensure_ascii=False), file=sys.stderr)
        raise SystemExit(2)

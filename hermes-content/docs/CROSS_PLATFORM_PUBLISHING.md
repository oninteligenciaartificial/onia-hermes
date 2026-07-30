# Cross-Platform Publishing - Onia / Hermes

## Purpose

Define what Hermes can publish today, what it can prepare, and what needs new
API credentials before publication.

## Current State

### Instagram

Status: connected and validated.

Production path:

```text
Video Lab job -> approved MP4 URL -> ig-publish reel_publish -> Instagram
```

Command:

```bash
ig-publish reel_publish --video-url "<public_mp4_url>" --caption "<instagram_caption>"
```

Important naming:

- Sergio says "descripcion".
- Instagram Graph API and `ig-publish` call it `caption`.
- Hermes must store it as `instagram_caption` in the planning package and pass
  it to `--caption` when publishing.

### TikTok

Status: connector installed, credentials pending.

TikTok can be added through the official Content Posting API, but it needs:

- TikTok developer app.
- Login Kit / OAuth user authorization.
- Content Posting API access and required scopes.
- App review for production use.
- Public video URL or upload flow depending on the selected method.
- Human approval before direct post.

Hermes can prepare now:

- `tiktok_description`
- on-screen hook
- retention notes
- safety notes
- post time

Hermes cannot publish TikTok yet until OAuth credentials exist and the app is
approved for the right posting scope.

Dry-run command:

```bash
social-publish tiktok_video_init --video-url "<public_mp4_url>" --description "<tiktok_description>"
```

Execute command after explicit approval and OAuth:

```bash
social-publish tiktok_video_init --video-url "<public_mp4_url>" --description "<tiktok_description>" --execute
social-publish tiktok_status --publish-id "<publish_id>"
```

### YouTube Shorts

Status: metadata package installed, upload credentials pending.

YouTube can be added through YouTube Data API `videos.insert`, but it needs:

- Google Cloud project.
- YouTube Data API enabled.
- OAuth user consent for the channel.
- Upload scope, preferably `https://www.googleapis.com/auth/youtube.upload`.
- Refresh token stored only in `/root/.hermes/.env`.
- Awareness that unverified API projects may upload videos as private until
  Google audit requirements are satisfied.

Hermes can prepare now:

- `youtube_title`
- `youtube_description`
- `youtube_tags`
- `privacy_status` recommendation: `private`, `unlisted` or `public`.

Planned command shape:

```bash
social-publish youtube_package --file "<local_mp4>" --title "<title>" --description "<description>" --tags "onia,saas" --privacy "unlisted"
```

Upload execution remains pending until Google OAuth refresh token and upload
implementation are approved.

### LinkedIn

Status: connector installed, credentials pending.

LinkedIn can be added through the official Posts API / Share on LinkedIn. It
needs:

- LinkedIn developer app.
- OAuth access token with `w_member_social` for member posts, or
  `w_organization_social` for organization posts.
- `LINKEDIN_AUTHOR_URN`, for example `urn:li:person:<id>` or
  `urn:li:organization:<id>`.
- LinkedIn API version header.
- Human approval before posting.

Dry-run command:

```bash
social-publish linkedin_text_post --commentary "<linkedin_copy>"
```

Execute command after explicit approval and OAuth:

```bash
social-publish linkedin_text_post --commentary "<linkedin_copy>" --execute
```

## Approval Rule

Publishing to any platform is client-facing.

Hermes may draft, package, score, schedule and remind automatically. It must not
publish to Instagram, TikTok, YouTube or LinkedIn unless Sergio approves the
exact job and platform.

Valid approval examples:

```text
Publicar video <job_id> en Instagram
Publicar video <job_id> en TikTok
Publicar video <job_id> en YouTube
```

For now, `Publicar video <job_id>` maps to Instagram only.

## Healthcheck

```bash
social-publish healthcheck
```

Expected current state:

- Instagram: ready when `META_LONG_LIVED_TOKEN` and `IG_BUSINESS_ACCOUNT_ID`
  are present.
- TikTok: pending until `TIKTOK_ACCESS_TOKEN` exists.
- YouTube: pending until `YOUTUBE_REFRESH_TOKEN` exists.
- LinkedIn: pending until `LINKEDIN_ACCESS_TOKEN` and `LINKEDIN_AUTHOR_URN`
  exist.

## Environment Variables

Store only in `/root/.hermes/.env`.

```text
TIKTOK_CLIENT_KEY=
TIKTOK_CLIENT_SECRET=
TIKTOK_ACCESS_TOKEN=
TIKTOK_REFRESH_TOKEN=
TIKTOK_OPEN_ID=

YOUTUBE_CLIENT_ID=
YOUTUBE_CLIENT_SECRET=
YOUTUBE_REFRESH_TOKEN=
YOUTUBE_CHANNEL_ID=

LINKEDIN_ACCESS_TOKEN=
LINKEDIN_AUTHOR_URN=
LINKEDIN_VERSION=202605
```

## Platform Copy Package

Each Video Lab job should carry:

```json
{
  "platform_copy": {
    "instagram_caption": "",
    "tiktok_description": "",
    "youtube_title": "",
    "youtube_description": "",
    "youtube_tags": [],
    "linkedin_copy": ""
  }
}
```

## Instagram Caption Formula

```text
[hook or belief shift]

[problem/context in 1-2 lines]

[mechanism/offer]

[single CTA]

[3-8 relevant hashtags]
```

## Account Voice

Sergio:

- first person;
- building in public;
- honest and practical;
- no guru tone;
- CTA: "escribeme tu rubro", "demo", "te muestro el sistema".

Onia:

- educational;
- systems and conversion language;
- CTA: audit, demo, diagnosis or content idea.

Client:

- simple;
- approved claims only;
- approved offer only;
- no fake urgency.

## Sources

- Instagram Platform content publishing:
  `https://developers.facebook.com/docs/instagram-platform/content-publishing/`
- TikTok Content Posting API:
  `https://developers.tiktok.com/doc/content-posting-api-get-started`
- YouTube Data API `videos.insert`:
  `https://developers.google.com/youtube/v3/docs/videos/insert`
- LinkedIn Posts API:
  `https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api`

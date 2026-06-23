# Nuvia Local Preview Runbook

## Purpose

Keep the local Nuvia Next.js preview stable at:

```powershell
http://127.0.0.1:4174/nuvia
```

Use this runbook whenever the browser shows unstyled HTML, broken CSS, missing product imagery, or red/black fallback rendering.

## Root Cause From 2026-06-22

The broken design was not a normal CSS bug. The local `next start` server on port `4174` was reading from `apps/site/.next` while another `next build` or older preview process was mutating the same `.next` directory.

Observed failure pattern:

- Browser showed raw/default HTML styling.
- `site-4174.log` included missing SSR chunk errors from `.next/server/chunks/ssr/`.
- Multiple `next dev`, `next start`, `postcss.js`, and `next build` processes were active against the same `web-factory/apps/site` workspace.

`next start` assumes `.next` is stable. Do not rebuild the same app directory while a production preview is running from that directory.

## Correct Command

From `C:\dev\proyectos\onia-hermes\web-factory`:

```powershell
pnpm preview:nuvia
```

This command:

1. Stops only Web Factory/Nuvia preview processes on port `4174`.
2. Stops sibling `next dev`, `next start`, `next build` and `.next/postcss.js` processes that use the same `web-factory/apps/site` build directory.
3. Refuses to kill unrelated non-Web-Factory processes on that port.
4. Deletes only `web-factory/apps/site/.next`, after verifying the path is inside `apps/site`.
5. Runs `pnpm --filter site build`.
6. Starts `pnpm --filter site start -- --hostname 127.0.0.1 --port 4174`.
7. Verifies that `/nuvia` returns HTTP 200 and that a CSS chunk contains `.nuvia-next-page` rules.

## Rules To Prevent Recurrence

- Do not run `pnpm --filter site build` manually while `localhost:4174` is serving through `next start`.
- Do not keep multiple production previews for `apps/site` using the same `.next` directory.
- Do not keep `next dev` and `next start` for `apps/site` alive while using the production preview. They share the same `.next` build directory on this machine.
- Use `pnpm preview:nuvia` after any substantial UI, asset, CSS, route, or data change.
- If another session needs to build Web Factory, stop the preview first or use a separate worktree.
- Keep Nuvia route validation focused on `/nuvia`, `/nuvia/catalogo`, `/nuvia/productos/<slug>` and the cart drawer.

## Fast Diagnosis

```powershell
Invoke-WebRequest http://127.0.0.1:4174/nuvia -UseBasicParsing
Get-Content .\site-4174.log -Tail 80
Get-NetTCPConnection -LocalPort 4174 -State Listen
Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -match '4174|web-factory\\apps\\site' } | Select-Object ProcessId,ParentProcessId,Name,CommandLine
```

If the log mentions missing `.next/server/chunks/ssr/*.js`, run:

```powershell
pnpm preview:nuvia
```

## Visual QA Checklist

- Header stays styled and fixed.
- Logo is visible and slogan stays readable.
- Nav labels are uppercase and stable.
- Hero video/image background loads behind the overlay.
- Product featured panel shows styled cards, not raw links.
- Cart button opens the drawer.
- `/nuvia/catalogo` keeps the catalog grid styled.
- Product detail pages keep the sticky buy area below the header.

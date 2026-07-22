#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Resolve an ffmpeg binary WITHOUT requiring a system install.
 * Order:
 *   1. FFMPEG_PATH env var (explicit override).
 *   2. bundled `ffmpeg-static` module, if it happens to be installed.
 *   3. `ffmpeg` on PATH.
 *   4. common Windows install locations (winget / choco / scoop).
 * Returns the binary path, or null if none works.
 */
export async function resolveFfmpeg() {
  const candidates = [];

  if (process.env.FFMPEG_PATH) candidates.push(process.env.FFMPEG_PATH);

  try {
    const mod = await import("ffmpeg-static");
    const p = mod.default || mod;
    if (typeof p === "string") candidates.push(p);
  } catch {
    // ffmpeg-static not installed — fine, keep looking.
  }

  candidates.push("ffmpeg");

  const home = process.env.USERPROFILE || process.env.HOME || "";
  if (home) {
    candidates.push(
      path.join(home, "scoop", "shims", "ffmpeg.exe"),
      path.join(
        home,
        "AppData",
        "Local",
        "Microsoft",
        "WinGet",
        "Links",
        "ffmpeg.exe",
      ),
    );
  }
  candidates.push("C:/ProgramData/chocolatey/bin/ffmpeg.exe");

  for (const candidate of candidates) {
    if (!candidate) continue;
    // Absolute paths must exist on disk; bare "ffmpeg" is probed via -version.
    if (path.isAbsolute(candidate) && !existsSync(candidate)) continue;
    const probe = spawnSync(candidate, ["-version"], { stdio: "ignore" });
    if (!probe.error && probe.status === 0) return candidate;
  }

  return null;
}

export const FFMPEG_INSTALL_HINT = [
  "ffmpeg not found. The reels pipeline still runs if you drop frames/screenshots",
  "manually, but to auto-extract keyframes install one of:",
  "  winget install Gyan.FFmpeg        (Windows)",
  "  choco install ffmpeg              (Windows + Chocolatey)",
  "  scoop install ffmpeg             (Windows + Scoop)",
  "or, self-contained inside the repo:  pnpm add -D ffmpeg-static",
  "or set FFMPEG_PATH=C:/path/to/ffmpeg.exe",
].join("\n");

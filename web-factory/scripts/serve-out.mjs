#!/usr/bin/env node
// Minimal static server for Web Factory previews (out/). Used by Playwright E2E.
// Not for production: no caching, no range requests, single directory root.
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const outDir = path.join(rootDir, "out");
const port = Number(process.env.PORT ?? process.argv[2] ?? 4319);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".mp4": "video/mp4",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

function resolveSafe(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const resolved = path.join(outDir, decoded);
  // Prevent path traversal outside outDir.
  if (resolved !== outDir && !resolved.startsWith(outDir + path.sep)) {
    return null;
  }
  return resolved;
}

async function resolveFile(target) {
  try {
    const info = await stat(target);
    if (info.isDirectory()) {
      return resolveFile(path.join(target, "index.html"));
    }
    return info.isFile() ? target : null;
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  const safe = resolveSafe(req.url ?? "/");
  if (!safe) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  const file = await resolveFile(safe);
  if (!file) {
    res.writeHead(404).end("Not found");
    return;
  }

  res.writeHead(200, { "Content-Type": MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream" });
  createReadStream(file).pipe(res);
});

server.listen(port, () => {
  console.log(`[serve-out] serving ${outDir} at http://localhost:${port}`);
});

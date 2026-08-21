import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";

const ROOT = "hermes-content/references/ui-patterns";
const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp",
};

createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  // quita segmentos de escape ".." sin usar regex con backslash
  const safe = p.split("/").filter((s) => s && s !== "..").join("/");
  const fp = join(ROOT, safe);
  try {
    const buf = await readFile(fp);
    res.writeHead(200, { "Content-Type": MIME[extname(fp)] || "application/octet-stream" });
    res.end(buf);
  } catch {
    res.writeHead(404);
    res.end("404");
  }
}).listen(4321, () => console.log("serving on 4321"));

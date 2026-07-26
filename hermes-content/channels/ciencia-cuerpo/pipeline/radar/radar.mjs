#!/usr/bin/env node
// Radar Maquina Humana - Fase 1 (local, CERO gasto).
// Lee RSS de ciencia + snapshot Higgsfield -> shortlist puntuado -> incoming/.
// NUNCA escribe topics-backlog.json (gate humano). NUNCA llama a generacion paga.
// El loop autonomo semanal NO vive aca: cuando la salida convence, se hace
// handoff a n8n/infra como cron (regla "nada local"). Ver README.md.
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scoreItem, qualifies, mapToChannel } from "./score.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = { mode: "fixture", limit: 10 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--live") args.mode = "live";
    else if (a === "--fixture") args.mode = "fixture";
    else if (a === "--limit") args.limit = Number(argv[++i]);
    else if (a === "--fixture-file") args.fixtureFile = argv[++i];
  }
  return args;
}

async function readJson(p) {
  return JSON.parse(await readFile(p, "utf8"));
}

async function loadFixtureItems(file) {
  const f = file || path.join(HERE, "test", "sample-items.json");
  const data = await readJson(f);
  return data.items;
}

async function loadLiveItems(sources) {
  // rss-parser es dependencia opcional: solo se necesita en modo --live.
  const { default: Parser } = await import("rss-parser");
  const parser = new Parser({ timeout: 15000 });
  const items = [];
  for (const feed of sources.feeds) {
    try {
      const parsed = await parser.parseURL(feed.url);
      for (const it of parsed.items ?? []) {
        items.push({
          title: it.title,
          summary: it.contentSnippet || it.content || "",
          link: it.link,
          pubDate: it.isoDate || it.pubDate,
          publisher: feed.name,
          feedName: feed.name,
        });
      }
    } catch (err) {
      console.error(`[warn] no pude leer ${feed.id} (${feed.url}): ${err.message}`);
    }
  }
  return items;
}

function digest(shortlist, meta) {
  const lines = [];
  lines.push(`Radar Maquina Humana - ${meta.date} (modo ${meta.mode})`);
  lines.push(`Leidos ${meta.total} items | califican ${meta.qualified} | top ${shortlist.length}`);
  lines.push("");
  shortlist.forEach((s, i) => {
    const flags = [];
    if (s.ymyl_sensitive) flags.push("YMYL!");
    flags.push("fuente:por-verificar");
    lines.push(
      `${i + 1}. [${s.score}] (${s.matched_theme_label}) ${s.raw_headline}`,
    );
    lines.push(
      `   hook: "${s.title_hook_suggestion}" | estilo: ${s.suggested_style_title} | ${flags.join(" ")}`,
    );
    lines.push(`   lead: ${s.source_lead.publisher} - ${s.source_lead.link}`);
  });
  lines.push("");
  lines.push("Gate humano: revisar, elegir, y recien ahi pasar a topics-backlog.");
  lines.push("Ninguno se produce sin fuente peer-reviewed/NIH/OMS en su research-brief.");
  return lines.join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sources = await readJson(path.join(HERE, "sources.json"));
  const snapshot = await readJson(path.join(HERE, "higgsfield-snapshot.json"));

  const rawItems =
    args.mode === "live"
      ? await loadLiveItems(sources)
      : await loadFixtureItems(args.fixtureFile);

  // Dedupe por link (mismo articulo puede venir de dos feeds), fallback a titulo.
  const seen = new Set();
  const items = rawItems.filter((it) => {
    const key = (it.link || it.title || "").trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const now = Date.now();
  const scored = items
    .map((item) => ({ item, s: scoreItem(item, now) }))
    .filter(({ s }) => qualifies(s))
    .sort((a, b) => b.s.score - a.s.score);

  const shortlist = scored
    .slice(0, args.limit)
    .map(({ item, s }) => mapToChannel(item, s, snapshot));

  const date = new Date(now).toISOString().slice(0, 10);
  const outDir = path.join(HERE, "incoming");
  await mkdir(outDir, { recursive: true });
  const outFile = path.join(outDir, `shortlist-${date}.json`);
  await writeFile(
    outFile,
    JSON.stringify(
      {
        generated_at: new Date(now).toISOString(),
        mode: args.mode,
        brand: "Maquina Humana",
        note: "Propuestas del radar. Gate humano antes de topics-backlog. Cada item necesita fuente real en su research-brief antes de producir.",
        total_read: items.length,
        qualified: scored.length,
        shortlist,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(
    digest(shortlist, { date, mode: args.mode, total: items.length, qualified: scored.length }),
  );
  console.log(`\nEscrito: ${path.relative(process.cwd(), outFile)}`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});

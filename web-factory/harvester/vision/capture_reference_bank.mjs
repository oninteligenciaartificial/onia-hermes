#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_CONFIG = "web-factory/data/references/design-sources/user-reference-urls.json";
const DEFAULT_CACHE_ROOT = "C:/Users/PC/.codex/design-stack/screenshots";

function slugify(value) {
  return (
    value
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "reference"
  );
}

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

async function loadPlaywright() {
  try {
    return await import("playwright");
  } catch (error) {
    throw new Error(
      "Playwright is not available in this Node environment. Use the Codex node_repl runtime or install Playwright before running this standalone script.",
    );
  }
}

async function extractPage(page) {
  return page.evaluate(() => {
    const clean = (value) => (value || "").replace(/\s+/g, " ").trim();
    const headings = [...document.querySelectorAll("h1,h2,h3")]
      .map((node) => ({
        level: node.tagName.toLowerCase(),
        text: clean(node.textContent).slice(0, 180),
      }))
      .filter((item) => item.text)
      .slice(0, 50);

    const ctas = [...document.querySelectorAll("a,button")]
      .map((node) => clean(node.textContent))
      .filter((text) => text && /start|try|buy|shop|download|pricing|docs|explore|get|view|learn|sign|login|component|block|copy/i.test(text))
      .slice(0, 40);

    const sections = [...document.querySelectorAll("main section, section, article")]
      .slice(0, 20)
      .map((node, index) => ({
        index,
        heading: clean(node.querySelector("h1,h2,h3")?.textContent || ""),
        textSample: clean(node.textContent).slice(0, 260),
      }))
      .filter((section) => section.heading || section.textSample);

    const palette = [...document.querySelectorAll("body, header, main, section, a, button, h1")]
      .slice(0, 40)
      .flatMap((node) => {
        const style = getComputedStyle(node);
        return [style.color, style.backgroundColor, style.borderColor];
      })
      .filter((value, index, list) => value && value !== "rgba(0, 0, 0, 0)" && list.indexOf(value) === index)
      .slice(0, 20);

    return {
      title: document.title,
      description:
        document.querySelector('meta[name="description"], meta[property="og:description"]')?.getAttribute("content") || "",
      headings,
      ctas,
      sections,
      palette,
    };
  });
}

async function main() {
  const configPath = argValue("--config", DEFAULT_CONFIG);
  const cacheRoot = argValue("--cache-root", DEFAULT_CACHE_ROOT);
  const outPath = argValue("--out", "web-factory/data/references/design-sources/latest-reference-bank.json");
  const chromePath = argValue("--chrome", "C:/Program Files/Google/Chrome/Application/chrome.exe");
  const config = JSON.parse(await readFile(configPath, "utf8"));
  const { chromium } = await loadPlaywright();
  const browser = await chromium.launch({ headless: true, executablePath: chromePath });
  const capturedAt = new Date().toISOString();
  const results = [];

  await mkdir(cacheRoot, { recursive: true });

  for (const item of config.urls) {
    const url = typeof item === "string" ? item : item.url;
    const mode = typeof item === "string" ? "reference" : item.mode;
    const slug = slugify(url);
    const dir = path.join(cacheRoot, slug);
    await mkdir(dir, { recursive: true });

    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const failedRequests = [];
    page.on("requestfailed", (request) => failedRequests.push(request.url()));

    try {
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 35000 });
      await page.waitForTimeout(1600);
      const desktopPath = path.join(dir, "desktop.png");
      await page.screenshot({ path: desktopPath, fullPage: true });

      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(400);
      const mobilePath = path.join(dir, "mobile.png");
      await page.screenshot({ path: mobilePath, fullPage: true });

      results.push({
        url,
        mode,
        status: response?.status() ?? null,
        screenshotDir: dir.replaceAll("\\", "/"),
        screenshots: {
          desktop: desktopPath.replaceAll("\\", "/"),
          mobile: mobilePath.replaceAll("\\", "/"),
        },
        failedRequestCount: failedRequests.length,
        ...(await extractPage(page)),
      });
    } catch (error) {
      results.push({
        url,
        mode,
        error: error instanceof Error ? error.message : String(error),
        failedRequestCount: failedRequests.length,
      });
    } finally {
      await page.close();
    }
  }

  await browser.close();
  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify({ capturedAt, cacheRoot, results }, null, 2) + "\n", "utf8");
  console.log(`wrote ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

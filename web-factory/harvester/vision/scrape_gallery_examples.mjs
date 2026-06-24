#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_CONFIG = "web-factory/data/references/design-sources/gallery-reference-sources.json";
const DEFAULT_OUT = "web-factory/data/references/design-sources/gallery-examples/latest-gallery-examples.json";
const DEFAULT_CACHE_ROOT = "C:/Users/PC/.codex/design-stack/gallery-examples-full";
const DEFAULT_CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

function argValue(name, fallback) {
  if (typeof process === "undefined") return fallback;
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

function argNumber(name, fallback) {
  const value = Number(argValue(name, ""));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function argList(name, fallback = []) {
  const value = argValue(name, "");
  return value ? value.split(",").map((item) => item.trim()).filter(Boolean) : fallback;
}

function slugify(value) {
  return (
    String(value || "")
      .toLowerCase()
      .replace(/^https?:\/\//, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 120) || "item"
  );
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function toPublicPath(value) {
  return value.replaceAll("\\", "/");
}

function sha256(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

function shortHash(value) {
  return createHash("sha256").update(String(value || "")).digest("hex").slice(0, 8);
}

function matchesAny(value, patterns) {
  if (!patterns?.length) return true;
  const lower = value.toLowerCase();
  return patterns.some((pattern) => lower.includes(String(pattern).toLowerCase()));
}

function matchesNone(value, patterns) {
  if (!patterns?.length) return true;
  const lower = value.toLowerCase();
  return !patterns.some((pattern) => lower.includes(String(pattern).toLowerCase()));
}

async function loadPlaywright(playwrightModule) {
  if (playwrightModule?.chromium) return playwrightModule;
  try {
    return await import("playwright");
  } catch {
    throw new Error(
      "Playwright is not available in this Node environment. Run from Codex node_repl or install Playwright in web-factory.",
    );
  }
}

async function autoScroll(page, passes) {
  for (let index = 0; index < passes; index += 1) {
    await page.evaluate(() => window.scrollBy(0, Math.max(window.innerHeight * 0.85, 600)));
    await page.waitForTimeout(550);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
}

async function waitForUsefulPage(page) {
  await page.waitForLoadState("domcontentloaded", { timeout: 35000 }).catch(() => {});
  await page.waitForLoadState("networkidle", { timeout: 6000 }).catch(() => {});
  await page.waitForFunction(
    () => {
      const bodyText = (document.body?.innerText || "").replace(/\s+/g, " ").trim();
      const mediaCount = document.querySelectorAll("img, picture, video, canvas, svg, pre, code").length;
      const cardCount = document.querySelectorAll("article, [class*='card'], [data-slot='card'], section").length;
      return bodyText.length > 120 || mediaCount > 2 || cardCount > 3;
    },
    { timeout: 8000 },
  ).catch(() => {});
}

async function getVisualQuality(page) {
  return page.evaluate(() => {
    const clean = (value) => (value || "").replace(/\s+/g, " ").trim();
    const viewportArea = window.innerWidth * window.innerHeight;
    const visibleElements = [...document.querySelectorAll("main, section, article, img, picture, video, canvas, svg, pre, code, h1, h2, h3, a, button")]
      .map((node) => {
        const rect = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        const area = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0)) *
          Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        return {
          tag: node.tagName.toLowerCase(),
          area,
          text: clean(node.textContent).slice(0, 120),
          visible:
            area > 48 &&
            style.visibility !== "hidden" &&
            style.display !== "none" &&
            Number(style.opacity || 1) > 0.05,
        };
      })
      .filter((item) => item.visible);

    const visibleArea = visibleElements.reduce((sum, item) => sum + Math.min(item.area, viewportArea), 0);
    const textLength = clean(document.body?.innerText || "").length;
    const mediaCount = document.querySelectorAll("img, picture, video, canvas, svg").length;
    const codeCount = document.querySelectorAll("pre, code").length;
    const headingCount = document.querySelectorAll("h1,h2,h3").length;
    const usefulElementCount = visibleElements.length;
    const isLikelySparse =
      textLength < 120 &&
      mediaCount < 1 &&
      codeCount < 1 &&
      headingCount < 1 &&
      visibleArea / Math.max(viewportArea, 1) < 0.08;

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      textLength,
      mediaCount,
      codeCount,
      headingCount,
      usefulElementCount,
      visibleAreaRatio: Number((visibleArea / Math.max(viewportArea, 1)).toFixed(3)),
      isLikelySparse,
      visibleSamples: visibleElements
        .filter((item) => item.text)
        .map((item) => item.text)
        .slice(0, 8),
    };
  });
}

async function extractGalleryCandidates(page, source) {
  return page.evaluate((sourceConfig) => {
    const clean = (value) => (value || "").replace(/\s+/g, " ").trim();
    const origin = new URL(location.href).origin;
    const navWords = /^(home|pricing|docs|blog|about|support|login|sign in|sign up|contact|github|twitter|x|discord)$/i;

    const closestCard = (node) =>
      node.closest("article, li, [class*='card'], [class*='item'], [class*='grid'], [data-slot='card']") || node;

    const anchors = [...document.querySelectorAll("a[href]")];
    const items = anchors
      .map((anchor, index) => {
        const href = anchor.getAttribute("href") || "";
        let url = "";
        try {
          url = new URL(href, origin).href.split("#")[0];
        } catch {
          return null;
        }

        if (!url.startsWith("http")) return null;
        const rect = anchor.getBoundingClientRect();
        const card = closestCard(anchor);
        const cardRect = card.getBoundingClientRect();
        const text = clean(anchor.innerText || anchor.getAttribute("aria-label") || anchor.getAttribute("title"));
        const heading = clean(card.querySelector("h1,h2,h3,h4,[class*='title']")?.textContent || "");
        const description = clean(card.textContent || "").slice(0, 360);
        const image = card.querySelector("img");
        const imageSrc = image ? new URL(image.getAttribute("src") || image.currentSrc || "", origin).href : "";
        const imageAlt = clean(image?.getAttribute("alt") || "");
        const buttonText = [...card.querySelectorAll("button,a")]
          .map((node) => clean(node.textContent))
          .filter(Boolean)
          .slice(0, 8);
        const tags = [...card.querySelectorAll("[class*='tag'], [class*='badge'], [data-slot='badge']")]
          .map((node) => clean(node.textContent))
          .filter(Boolean)
          .slice(0, 12);

        const cardArea = Math.round(Math.max(cardRect.width * cardRect.height, rect.width * rect.height));
        const hasUsefulText = Boolean(text || heading || imageAlt);
        const hasUsefulImage = Boolean(imageSrc);
        let score = 0;
        if (cardArea > 8000) score += 2;
        if (hasUsefulImage) score += 2;
        if (heading) score += 2;
        if (description.length > 40) score += 1;
        if (!navWords.test(text)) score += 1;
        if (url !== location.href.split("#")[0]) score += 2;
        if (url.includes("/components") || url.includes("/blocks") || url.includes("/shots") || url.includes("/site/")) {
          score += 2;
        }

        return {
          index,
          url,
          text: text.slice(0, 140),
          heading: heading.slice(0, 140),
          description,
          imageSrc,
          imageAlt,
          buttonText,
          tags,
          cardArea,
          score,
          sourceMode: sourceConfig.mode,
        };
      })
      .filter(Boolean)
      .filter((item) => item.score >= 4)
      .sort((a, b) => b.score - a.score || b.cardArea - a.cardArea);

    const seen = new Set();
    return items.filter((item) => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
  }, source);
}

async function extractExampleDetail(page, source) {
  return page.evaluate((sourceConfig) => {
    const clean = (value) => (value || "").replace(/\s+/g, " ").trim();
    const unique = (values, limit = 40) => [...new Set(values.filter(Boolean))].slice(0, limit);
    const absoluteUrl = (value) => {
      if (!value) return "";
      try {
        return new URL(value, location.href).href;
      } catch {
        return "";
      }
    };
    const classTokens = (node) =>
      unique(
        String(node.getAttribute("class") || "")
          .split(/\s+/)
          .map((item) => item.trim())
          .filter(Boolean),
        12,
      );
    const nearestSectionHeading = (node) =>
      clean(node.closest("section,article,main,header,footer")?.querySelector("h1,h2,h3,h4")?.textContent || "");
    const meta = (selector) => document.querySelector(selector)?.getAttribute("content") || "";
    const headings = [...document.querySelectorAll("h1,h2,h3")]
      .map((node) => ({
        level: node.tagName.toLowerCase(),
        text: clean(node.textContent).slice(0, 180),
      }))
      .filter((item) => item.text)
      .slice(0, 40);

    const sections = [...document.querySelectorAll("main section, section, article, [class*='section']")]
      .slice(0, 18)
      .map((node, index) => ({
        index,
        heading: clean(node.querySelector("h1,h2,h3,h4")?.textContent || ""),
        textSample: clean(node.textContent).slice(0, 320),
        imageCount: node.querySelectorAll("img,picture,video,canvas,svg").length,
        buttonCount: node.querySelectorAll("button,a").length,
      }))
      .filter((section) => section.heading || section.textSample);

    const ctas = [...document.querySelectorAll("a,button")]
      .map((node) => clean(node.textContent || node.getAttribute("aria-label") || ""))
      .filter((text) => text && text.length < 80)
      .slice(0, 50);

    const codeBlocks = sourceConfig.captureCode
      ? [...document.querySelectorAll("pre code, pre, code")]
          .map((node) => clean(node.textContent))
          .filter((text) => text.length > 40 && /import |export |function |className=|<[/A-Za-z]/.test(text))
          .slice(0, 8)
          .map((text) => ({
            language: nodeLanguage(text),
            chars: text.length,
            sample: text.slice(0, 2200),
          }))
      : [];

    function nodeLanguage(text) {
      if (/className=|<[A-Z][A-Za-z]/.test(text)) return "tsx";
      if (/import |export |const |function /.test(text)) return "ts";
      if (/\.[a-z0-9_-]+\s*\{/.test(text)) return "css";
      return "unknown";
    }

    const links = [...document.querySelectorAll("a[href]")]
      .map((anchor) => {
        try {
          return {
            url: new URL(anchor.getAttribute("href"), location.href).href,
            text: clean(anchor.textContent).slice(0, 120),
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const codeLinks = links
      .filter((link) => /github\.com|npmjs\.com|stackblitz|codesandbox|vercel\.app|copy/i.test(`${link.url} ${link.text}`))
      .slice(0, 20);

    const palette = [...document.querySelectorAll("body, header, main, section, article, a, button, h1, h2")]
      .slice(0, 80)
      .flatMap((node) => {
        const style = getComputedStyle(node);
        return [style.color, style.backgroundColor, style.borderColor];
      })
      .filter((value, index, list) => value && value !== "rgba(0, 0, 0, 0)" && list.indexOf(value) === index)
      .slice(0, 28);

    const layoutSignals = {
      hasNav: Boolean(document.querySelector("nav, header")),
      hasHero: Boolean(document.querySelector("h1")),
      hasPricing: /pricing|price|plan|monthly|yearly/i.test(document.body.innerText),
      hasTestimonials: /testimonial|customer|review|trusted|clients/i.test(document.body.innerText),
      hasFAQ: /faq|frequently asked|questions/i.test(document.body.innerText),
      hasVideo: Boolean(document.querySelector("video")),
      cardLikeCount: document.querySelectorAll("article, [class*='card'], [data-slot='card']").length,
      imageCount: document.querySelectorAll("img,picture,video,canvas").length,
      buttonCount: document.querySelectorAll("button,a").length,
      formCount: document.querySelectorAll("form,input,textarea,select").length,
    };

    const resources = {
      images: [...document.querySelectorAll("img")]
        .map((node) => ({
          src: absoluteUrl(node.getAttribute("src") || node.currentSrc || ""),
          currentSrc: absoluteUrl(node.currentSrc || ""),
          srcset: clean(node.getAttribute("srcset") || "").slice(0, 500),
          alt: clean(node.getAttribute("alt") || "").slice(0, 180),
          width: Number(node.getAttribute("width") || node.naturalWidth || 0),
          height: Number(node.getAttribute("height") || node.naturalHeight || 0),
          loading: node.getAttribute("loading") || "",
          sectionHeading: nearestSectionHeading(node).slice(0, 120),
        }))
        .filter((item) => item.src || item.currentSrc || item.srcset)
        .slice(0, 60),
      videos: [...document.querySelectorAll("video")]
        .map((node) => ({
          src: absoluteUrl(node.getAttribute("src") || node.currentSrc || ""),
          poster: absoluteUrl(node.getAttribute("poster") || ""),
          sources: [...node.querySelectorAll("source")]
            .map((sourceNode) => ({
              src: absoluteUrl(sourceNode.getAttribute("src") || ""),
              type: sourceNode.getAttribute("type") || "",
            }))
            .filter((item) => item.src)
            .slice(0, 8),
          autoplay: node.autoplay,
          muted: node.muted,
          loop: node.loop,
          playsInline: node.playsInline,
          width: Number(node.getAttribute("width") || node.videoWidth || 0),
          height: Number(node.getAttribute("height") || node.videoHeight || 0),
          sectionHeading: nearestSectionHeading(node).slice(0, 120),
        }))
        .filter((item) => item.src || item.poster || item.sources.length)
        .slice(0, 20),
      canvasCount: document.querySelectorAll("canvas").length,
      svgCount: document.querySelectorAll("svg").length,
      stylesheets: [...document.querySelectorAll("link[rel='stylesheet'][href]")]
        .map((node) => absoluteUrl(node.getAttribute("href") || ""))
        .filter(Boolean)
        .slice(0, 40),
      fontLinks: [...document.querySelectorAll("link[href], style")]
        .map((node) => node.getAttribute?.("href") || node.textContent || "")
        .filter((value) => /font|fonts|typekit|use\.typekit|woff|woff2|ttf|otf/i.test(value))
        .map((value) => (value.startsWith("http") || value.startsWith("/") ? absoluteUrl(value) : clean(value).slice(0, 300)))
        .slice(0, 40),
      ogImages: unique(
        [
          meta('meta[property="og:image"]'),
          meta('meta[name="twitter:image"]'),
          meta('meta[property="twitter:image"]'),
        ].map(absoluteUrl),
        8,
      ),
      downloadableAssets: [...document.querySelectorAll("a[href]")]
        .map((node) => absoluteUrl(node.getAttribute("href") || ""))
        .filter((url) => /\.(png|jpe?g|webp|gif|svg|mp4|webm|mov|pdf)(\?|$)/i.test(url))
        .slice(0, 40),
    };

    const fontSignals = {
      computedFamilies: unique(
        [...document.querySelectorAll("body, h1, h2, h3, p, a, button, input, textarea, [class*='font']")]
          .slice(0, 140)
          .map((node) => getComputedStyle(node).fontFamily),
        24,
      ),
      computedWeights: unique(
        [...document.querySelectorAll("h1,h2,h3,p,a,button")]
          .slice(0, 80)
          .map((node) => getComputedStyle(node).fontWeight),
        20,
      ),
    };

    const htmlOutline = {
      language: document.documentElement.getAttribute("lang") || "",
      bodyClasses: classTokens(document.body),
      semanticLandmarks: [...document.querySelectorAll("header, nav, main, section, article, aside, footer")]
        .slice(0, 40)
        .map((node, index) => ({
          index,
          tag: node.tagName.toLowerCase(),
          id: node.id || "",
          classes: classTokens(node),
          heading: clean(node.querySelector("h1,h2,h3,h4")?.textContent || "").slice(0, 160),
          textSample: clean(node.textContent || "").slice(0, 220),
          linkCount: node.querySelectorAll("a[href]").length,
          buttonCount: node.querySelectorAll("button").length,
          formControlCount: node.querySelectorAll("input,textarea,select").length,
          mediaCount: node.querySelectorAll("img,picture,video,canvas,svg").length,
        })),
      navLinks: [...document.querySelectorAll("nav a[href], header a[href]")]
        .map((node) => ({
          text: clean(node.textContent || node.getAttribute("aria-label") || "").slice(0, 80),
          href: absoluteUrl(node.getAttribute("href") || ""),
        }))
        .filter((item) => item.href)
        .slice(0, 40),
      forms: [...document.querySelectorAll("form")]
        .map((node, index) => ({
          index,
          action: absoluteUrl(node.getAttribute("action") || ""),
          method: (node.getAttribute("method") || "get").toLowerCase(),
          controls: [...node.querySelectorAll("input,textarea,select,button")]
            .map((control) => {
              const controlId = control.getAttribute("id") || "";
              const labelNode =
                controlId && globalThis.CSS?.escape
                  ? document.querySelector(`label[for="${globalThis.CSS.escape(controlId)}"]`)
                  : null;

              return {
                tag: control.tagName.toLowerCase(),
                type: control.getAttribute("type") || "",
                name: control.getAttribute("name") || "",
                label: clean(
                  labelNode?.textContent ||
                    control.getAttribute("aria-label") ||
                    control.getAttribute("placeholder") ||
                    "",
                ).slice(0, 100),
              };
            })
            .slice(0, 24),
        }))
        .slice(0, 12),
    };

    const resourceUrls = [
      ...[...document.querySelectorAll("script[src]")].map((node) => node.getAttribute("src") || ""),
      ...[...document.querySelectorAll("link[href]")].map((node) => node.getAttribute("href") || ""),
      ...resources.images.map((item) => item.src || item.currentSrc),
      ...resources.videos.flatMap((item) => [item.src, item.poster, ...item.sources.map((sourceItem) => sourceItem.src)]),
    ]
      .map(absoluteUrl)
      .filter(Boolean)
      .join("\n");

    const technologySignals = {
      hasNextData: Boolean(document.querySelector("script#__NEXT_DATA__")),
      hasNextAssets: /\/_next\//i.test(resourceUrls),
      hasNuxtAssets: /\/_nuxt\//i.test(resourceUrls),
      hasViteAssets: /\/assets\/.*\.(js|css)/i.test(resourceUrls),
      hasWebflow: /webflow\.(?:js|css)|uploads-ssl\.webflow|data-wf-page|data-wf-site/i.test(
        resourceUrls + document.documentElement.outerHTML.slice(0, 2000),
      ),
      hasFramer: /framerusercontent|framer\.site|data-framer/i.test(
        resourceUrls + document.documentElement.outerHTML.slice(0, 2000),
      ),
      hasShopify: /cdn\.shopify|myshopify|shopify-section|Shopify\.theme/i.test(
        resourceUrls + document.documentElement.outerHTML.slice(0, 2000),
      ),
      hasWordPress: /wp-content|wp-includes/i.test(resourceUrls),
      scriptSrcs: [...document.querySelectorAll("script[src]")]
        .map((node) => absoluteUrl(node.getAttribute("src") || ""))
        .filter(Boolean)
        .slice(0, 40),
    };

    return {
      title: document.title,
      description: meta('meta[name="description"]') || meta('meta[property="og:description"]'),
      headings,
      sections,
      ctas,
      palette,
      layoutSignals,
      htmlOutline,
      resources,
      fontSignals,
      technologySignals,
      codeBlocks,
      codeLinks,
    };
  }, source);
}

async function screenshot(page, filePath, options = {}) {
  await mkdir(path.dirname(filePath), { recursive: true });
  const buffer = await page.screenshot({ path: filePath, ...options });
  return {
    path: toPublicPath(filePath),
    sha256: sha256(buffer),
    mode: options.fullPage ? "full-page" : "viewport",
  };
}

function filterCandidates(candidates, source, limit) {
  const sourceUrl = source.url.split("#")[0].replace(/\/$/, "");
  const seenVisualKeys = new Set();
  const filtered = [];

  for (const candidate of candidates) {
    const target = candidate.url.replace(/\/$/, "");
    if (target === sourceUrl && !source.mode?.startsWith("single-")) continue;
    if (!matchesAny(candidate.url, asArray(source.include))) continue;
    if (!matchesNone(candidate.url, asArray(source.exclude))) continue;

    const visualKey = slugify(candidate.heading || candidate.text || candidate.imageAlt || candidate.url);
    const urlWithoutQuery = target.split("?")[0];
    const key = `${urlWithoutQuery}|${visualKey}`;
    if (seenVisualKeys.has(key)) continue;
    seenVisualKeys.add(key);
    filtered.push(candidate);
    if (filtered.length >= limit) break;
  }

  return filtered;
}

function _oldFilterCandidates(candidates, source, limit) {
  const sourceUrl = source.url.split("#")[0].replace(/\/$/, "");
  return candidates
    .filter((candidate) => {
      const target = candidate.url.replace(/\/$/, "");
      if (target === sourceUrl) return source.mode?.startsWith("single-");
      if (!matchesAny(candidate.url, asArray(source.include))) return false;
      if (!matchesNone(candidate.url, asArray(source.exclude))) return false;
      return true;
    })
    .slice(0, limit);
}

export async function scrapeGalleryExamples(options = {}) {
  const configPath = options.configPath || DEFAULT_CONFIG;
  const outPath = options.outPath || DEFAULT_OUT;
  const chromePath = options.chromePath || DEFAULT_CHROME;
  const maxSources = options.maxSources || Infinity;
  const maxItemsOverride = options.maxItemsPerSource || 0;
  const maxDetailItemsOverride = options.maxDetailItemsPerSource;
  const selectedSourceIds = new Set(options.sourceIds || []);
  const playwright = await loadPlaywright(options.playwrightModule);
  const config = JSON.parse(await readFile(configPath, "utf8"));
  const cacheRoot = options.cacheRoot || config.screenshotCacheRoot || DEFAULT_CACHE_ROOT;
  const defaults = config.defaults || {};
  const capturedAt = new Date().toISOString();
  const browser = await playwright.chromium.launch({
    headless: true,
    executablePath: chromePath,
  });
  const results = [];
  const errors = [];

  await mkdir(cacheRoot, { recursive: true });

  const sources = config.sources
    .filter((source) => !selectedSourceIds.size || selectedSourceIds.has(source.id))
    .slice(0, maxSources);

  const buildPayload = () => ({
    capturedAt,
    cacheRoot: toPublicPath(cacheRoot),
    policy:
      "Gallery screenshots and structure are reference artifacts. Copy/adapt code only when licenseStatus is compatible and the linked/local repo license has been reviewed.",
    configPath: toPublicPath(configPath),
    results,
    errors,
  });

  const writeCheckpoint = async () => {
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, JSON.stringify(buildPayload(), null, 2) + "\n", "utf8");
  };

  for (const source of sources) {
    const sourceCacheDir = path.join(cacheRoot, slugify(source.id || source.url));
    const galleryPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const failedRequests = [];
    galleryPage.on("requestfailed", (request) => failedRequests.push(request.url()));

    try {
      const response = await galleryPage.goto(source.url, { waitUntil: "domcontentloaded", timeout: 35000 });
      await waitForUsefulPage(galleryPage);
      await galleryPage.waitForTimeout(900);
      await autoScroll(galleryPage, source.scrollPasses ?? defaults.scrollPasses ?? 4);
      const rawCandidates =
        source.mode?.startsWith("single-")
          ? [
              {
                url: source.url,
                text: source.name,
                heading: source.name,
                description: source.usage,
                score: 10,
                cardArea: 0,
              },
            ]
          : await extractGalleryCandidates(galleryPage, source);
      const maxItems = maxItemsOverride || source.maxItems || defaults.maxItems || 8;
      const candidates = filterCandidates(rawCandidates, source, maxItems);
      const maxDetailItems =
        Number.isFinite(maxDetailItemsOverride) && maxDetailItemsOverride >= 0
          ? maxDetailItemsOverride
          : source.maxDetailItems ?? defaults.maxDetailItems ?? Math.min(candidates.length, 3);
      const detailCandidates = candidates.slice(0, maxDetailItems);

      const galleryScreenshotPath = path.join(sourceCacheDir, "gallery.png");
      const galleryScreenshot = await screenshot(galleryPage, galleryScreenshotPath, { fullPage: true });
      const galleryQuality = await getVisualQuality(galleryPage);

      const sourceResult = {
        id: source.id,
        name: source.name,
        url: source.url,
        mode: source.mode,
        usage: source.usage,
        licenseStatus: source.licenseStatus,
        status: response?.status() ?? null,
        failedRequestCount: failedRequests.length,
        rawCandidateCount: rawCandidates.length,
        selectedCandidateCount: candidates.length,
        detailedExampleCount: detailCandidates.length,
        candidates,
        screenshot: galleryScreenshot,
        screenshotQuality: galleryQuality,
        examples: [],
      };

      for (const candidate of detailCandidates) {
        const itemPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
        const itemFailedRequests = [];
        itemPage.on("requestfailed", (request) => itemFailedRequests.push(request.url()));
        const itemSlug = `${String(candidate.index ?? sourceResult.examples.length).padStart(3, "0")}-${slugify(
          candidate.heading || candidate.text || candidate.url,
        )}-${shortHash(candidate.url)}`;
        const itemDir = path.join(sourceCacheDir, itemSlug);

        try {
          const itemResponse = await itemPage.goto(candidate.url, { waitUntil: "domcontentloaded", timeout: 35000 });
          await waitForUsefulPage(itemPage);
          await itemPage.waitForTimeout(900);
          await autoScroll(itemPage, 2);
          await itemPage.evaluate(() => window.scrollTo(0, 0));
          await itemPage.waitForTimeout(250);
          const desktopQualityBefore = await getVisualQuality(itemPage);
          const desktop = (source.captureDesktop ?? defaults.captureDesktop) !== false
            ? await screenshot(itemPage, path.join(itemDir, "desktop.png"), { fullPage: false })
            : null;
          let mobile = null;
          let mobileQuality = null;
          if ((source.captureMobile ?? defaults.captureMobile) !== false) {
            await itemPage.setViewportSize({ width: 390, height: 844 });
            await itemPage.waitForTimeout(700);
            mobileQuality = await getVisualQuality(itemPage);
            mobile = await screenshot(itemPage, path.join(itemDir, "mobile.png"), { fullPage: false });
          }
          await itemPage.setViewportSize({ width: 1440, height: 1000 });

          sourceResult.examples.push({
            sourceId: source.id,
            url: candidate.url,
            status: itemResponse?.status() ?? null,
            licenseStatus: source.licenseStatus,
            reuseGuidance: source.usage,
            candidate,
            screenshots: {
              desktop,
              mobile,
            },
            screenshotQuality: {
              desktop: desktopQualityBefore,
              mobile: mobileQuality,
            },
            qualityWarnings: [
              desktopQualityBefore?.isLikelySparse ? "desktop-sparse" : "",
              mobileQuality?.isLikelySparse ? "mobile-sparse" : "",
            ].filter(Boolean),
            failedRequestCount: itemFailedRequests.length,
            ...(await extractExampleDetail(itemPage, source)),
          });
        } catch (error) {
          sourceResult.examples.push({
            sourceId: source.id,
            url: candidate.url,
            licenseStatus: source.licenseStatus,
            candidate,
            error: error instanceof Error ? error.message : String(error),
            failedRequestCount: itemFailedRequests.length,
          });
        } finally {
          await itemPage.close();
        }
      }

      results.push(sourceResult);
      await writeCheckpoint();
    } catch (error) {
      errors.push({
        sourceId: source.id,
        url: source.url,
        error: error instanceof Error ? error.message : String(error),
        failedRequestCount: failedRequests.length,
      });
      await writeCheckpoint();
    } finally {
      await galleryPage.close();
    }
  }

  await browser.close();
  const payload = buildPayload();
  await writeCheckpoint();
  return payload;
}

async function main() {
  const outPath = argValue("--out", DEFAULT_OUT);
  const payload = await scrapeGalleryExamples({
    configPath: argValue("--config", DEFAULT_CONFIG),
    outPath,
    cacheRoot: argValue("--cache-root", DEFAULT_CACHE_ROOT),
    chromePath: argValue("--chrome", DEFAULT_CHROME),
    maxSources: argNumber("--max-sources", Infinity),
    maxItemsPerSource: argNumber("--max-items", 0),
    maxDetailItemsPerSource: argNumber("--detail-items", NaN),
    sourceIds: argList("--source-ids"),
  });
  console.log(
    `wrote ${payload.results.reduce((sum, source) => sum + source.examples.length, 0)} examples to ${outPath}`,
  );
}

if (typeof process !== "undefined" && process.argv?.[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

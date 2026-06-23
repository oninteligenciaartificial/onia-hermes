import * as cheerio from "cheerio";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const NUVIA_JSON = path.resolve("data/clients/nuvia.json");
const OUT_DIR = path.resolve("data/references/product-sources");
const LATEST_OUT = path.join(OUT_DIR, "nuvia-product-media-enrichment-latest.json");
const USER_AGENT = "ONIA-WebFactory/1.0 product media research (contact: Sergio via ONIA)";
const RIGHTS_NOTE =
  "Reference media only. Confirm supplier/brand permission or replace with owned Nuvia media before launch.";

const OFFICIAL_SOURCE_HINTS = [
  {
    match: /isdin\s+fusion\s+water\s+magic\s+spf\s*50/i,
    url: "https://www.isdin.com/es/p/fusion-water-magic-spf-50/1349",
    source: "isdin.com",
    role: "brand_official",
  },
  {
    match: /svr\s+sebiaclear\s+gel\s+moussant/i,
    url: "https://fr.svr.com/products/sebiaclear-gel-moussant-23",
    source: "fr.svr.com",
    role: "brand_official",
  },
];

const IMAGE_EXTENSIONS = /\.(?:avif|gif|jpe?g|png|webp)(?:[?#].*)?$/i;
const VIDEO_EXTENSIONS = /\.(?:m3u8|mov|mp4|webm)(?:[?#].*)?$/i;
const BLOCKED_ASSET_HINTS = [
  "avatar",
  "cart",
  "cropped-logo",
  "favicon",
  "icon",
  "logo",
  "payment",
  "placeholder",
  "powered_by",
  "sprite",
  "whatsapp",
];

function argValue(name, fallback = "") {
  const arg = process.argv.find((item) => item.startsWith(`${name}=`));
  return arg ? arg.split("=").slice(1).join("=") : fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10).replace(/-/g, "");
}

function text(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function stripAccents(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function slugify(value) {
  return (
    stripAccents(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

function isHttpUrl(value) {
  return /^https?:\/\//i.test(String(value || ""));
}

function absoluteUrl(value, baseUrl) {
  if (!value) {
    return "";
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return "";
  }
}

function stableUrl(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    return url.toString();
  } catch {
    return String(value || "");
  }
}

function parseSrcset(value) {
  const candidates = String(value || "")
    .split(",")
    .map((part) => {
      const [src, descriptor] = part.trim().split(/\s+/, 2);
      const width = Number.parseInt(descriptor?.replace(/[^\d]/g, "") || "0", 10) || 0;
      return { src, width };
    })
    .filter((item) => item.src);

  candidates.sort((a, b) => b.width - a.width);
  return candidates[0]?.src || "";
}

function isLikelyProductAsset(url) {
  const lower = String(url || "").toLowerCase();

  if (!isHttpUrl(lower)) {
    return false;
  }

  if (![IMAGE_EXTENSIONS, VIDEO_EXTENSIONS].some((pattern) => pattern.test(lower))) {
    return lower.includes("youtube.com") || lower.includes("youtu.be") || lower.includes("vimeo.com");
  }

  return !BLOCKED_ASSET_HINTS.some((hint) => lower.includes(hint));
}

function mediaType(url, hintedType = "") {
  const lower = String(url || "").toLowerCase();

  if (hintedType === "video" || VIDEO_EXTENSIONS.test(lower)) {
    return "video";
  }

  if (lower.includes("youtube.com") || lower.includes("youtu.be") || lower.includes("vimeo.com")) {
    return "embed";
  }

  return "image";
}

function scoreAsset(asset) {
  const roleScore = {
    product_primary: 100,
    product_gallery: 90,
    jsonld_product: 86,
    og_image: 82,
    video_embed: 78,
    page_image: 52,
  }[asset.role] ?? 40;
  const sourceScore = asset.sourceRole === "brand_official" ? 12 : asset.sourceRole === "supplier" ? 8 : 0;
  const typeScore = asset.type === "image" ? 5 : 3;

  return roleScore + sourceScore + typeScore;
}

function addAsset(assets, input) {
  const url = stableUrl(input.url);

  if (!isLikelyProductAsset(url)) {
    return;
  }

  const type = mediaType(url, input.type);
  assets.push({
    type,
    url,
    sourceUrl: input.sourceUrl,
    sourceName: input.sourceName,
    sourceRole: input.sourceRole,
    role: input.role,
    alt: text(input.alt),
    licenseStatus: "needs_rights_confirmation",
    usageRecommendation:
      type === "image"
        ? input.sourceRole === "supplier"
          ? "catalog_or_pdp_candidate"
          : "reference_only_until_permission"
        : "video_reference_only_until_permission",
    rightsNote: RIGHTS_NOTE,
    confidence: 0,
  });
}

function dedupeAndRankAssets(assets) {
  const seen = new Map();

  for (const asset of assets) {
    const current = seen.get(asset.url);
    const scored = { ...asset, confidence: scoreAsset(asset) };
    if (!current || scored.confidence > current.confidence) {
      seen.set(asset.url, scored);
    }
  }

  return [...seen.values()].sort((a, b) => b.confidence - a.confidence);
}

function collectJsonLdMedia($, baseUrl, source) {
  const assets = [];

  function walk(node) {
    if (!node || typeof node !== "object") {
      return;
    }

    const nodeType = Array.isArray(node["@type"]) ? node["@type"].join(" ") : String(node["@type"] || "");
    const isProductish = /product|videoobject/i.test(nodeType);
    const images = [node.image, node.thumbnailUrl].flat().filter(Boolean);
    const videos = [node.contentUrl, node.embedUrl].flat().filter(Boolean);

    if (isProductish) {
      for (const image of images) {
        addAsset(assets, {
          url: absoluteUrl(typeof image === "string" ? image : image?.url, baseUrl),
          sourceUrl: baseUrl,
          sourceName: source.source,
          sourceRole: source.role,
          role: "jsonld_product",
          alt: node.name,
        });
      }

      for (const video of videos) {
        addAsset(assets, {
          url: absoluteUrl(video, baseUrl),
          sourceUrl: baseUrl,
          sourceName: source.source,
          sourceRole: source.role,
          role: "video_embed",
          type: "video",
          alt: node.name,
        });
      }
    }

    for (const value of Object.values(node)) {
      if (Array.isArray(value)) {
        value.forEach(walk);
      } else if (value && typeof value === "object") {
        walk(value);
      }
    }
  }

  $("script[type='application/ld+json']").each((_, element) => {
    const raw = $(element).contents().text();
    if (!raw.trim()) {
      return;
    }

    try {
      walk(JSON.parse(raw));
    } catch {
      // Some stores inject invalid JSON-LD. Ignore and continue with DOM extraction.
    }
  });

  return assets;
}

function collectDomMedia(html, source) {
  const $ = cheerio.load(html);
  const baseUrl = source.url;
  const assets = [];

  const metaSelectors = [
    ['meta[property="og:image"]', "content", "og_image"],
    ['meta[property="og:image:secure_url"]', "content", "og_image"],
    ['meta[name="twitter:image"]', "content", "og_image"],
    ['link[rel="image_src"]', "href", "og_image"],
  ];

  for (const [selector, attr, role] of metaSelectors) {
    $(selector).each((_, element) => {
      addAsset(assets, {
        url: absoluteUrl($(element).attr(attr), baseUrl),
        sourceUrl: baseUrl,
        sourceName: source.source,
        sourceRole: source.role,
        role,
        alt: $("title").first().text(),
      });
    });
  }

  const gallerySelectors = [
    ".woocommerce-product-gallery img",
    ".woocommerce-product-gallery a",
    ".product .images img",
    ".product .images a",
    ".product-gallery img",
    ".product-gallery a",
  ];

  for (const selector of gallerySelectors) {
    $(selector).each((_, element) => {
      const target =
        $(element).attr("href") ||
        $(element).attr("data-large_image") ||
        $(element).attr("data-src") ||
        parseSrcset($(element).attr("srcset")) ||
        $(element).attr("src");
      addAsset(assets, {
        url: absoluteUrl(target, baseUrl),
        sourceUrl: baseUrl,
        sourceName: source.source,
        sourceRole: source.role,
        role: selector.includes("gallery") || selector.includes("images") ? "product_gallery" : "page_image",
        alt: $(element).attr("alt") || $("h1").first().text() || $("title").first().text(),
      });
    });
  }

  $('meta[property^="og:video"], meta[name="twitter:player"]').each((_, element) => {
    addAsset(assets, {
      url: absoluteUrl($(element).attr("content"), baseUrl),
      sourceUrl: baseUrl,
      sourceName: source.source,
      sourceRole: source.role,
      role: "video_embed",
      type: "video",
      alt: $("title").first().text(),
    });
  });

  $("video, video source, iframe").each((_, element) => {
    const candidate = $(element).attr("src");
    const absolute = absoluteUrl(candidate, baseUrl);

    if (!VIDEO_EXTENSIONS.test(absolute) && !/(youtube\.com\/embed|player\.vimeo\.com)/i.test(absolute)) {
      return;
    }

    addAsset(assets, {
      url: absolute,
      sourceUrl: baseUrl,
      sourceName: source.source,
      sourceRole: source.role,
      role: "video_embed",
      type: "video",
      alt: $(element).attr("title") || $("h1").first().text() || $("title").first().text(),
    });
  });

  return dedupeAndRankAssets([...collectJsonLdMedia($, baseUrl, source), ...assets]);
}

async function fetchHtml(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "user-agent": USER_AGENT,
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function productSources(product) {
  const sources = [];
  const title = product.titulo || "";

  for (const hint of OFFICIAL_SOURCE_HINTS) {
    if (hint.match.test(title)) {
      sources.push(hint);
    }
  }

  if (product.sourceUrl) {
    sources.push({
      url: product.sourceUrl,
      source: product.proveedor === "HBDERM" ? "hbderm.com" : new URL(product.sourceUrl).hostname,
      role: "supplier",
    });
  }

  return sources.filter((source, index, list) => list.findIndex((item) => item.url === source.url) === index);
}

function currentImageAsset(product) {
  if (!product.imagen) {
    return null;
  }

  return {
    type: "image",
    url: product.imagen,
    sourceUrl: product.sourceUrl || "",
    sourceName: product.proveedor || "nuvia",
    sourceRole: product.imagen.startsWith("assets/") ? "nuvia_curated" : "supplier",
    role: "current_storefront",
    alt: product.imagenAlt || product.titulo,
    licenseStatus: product.imagen.startsWith("assets/")
      ? "owned_or_curated_local_asset"
      : "needs_rights_confirmation",
    usageRecommendation: "current_storefront_primary",
    rightsNote: product.imagen.startsWith("assets/") ? "Local curated asset in Nuvia asset folder." : RIGHTS_NOTE,
    confidence: 120,
  };
}

function buildDetailImages(product, assets) {
  const detail = [];
  const primary = currentImageAsset(product);

  if (primary) {
    detail.push({
      src: primary.url,
      alt: primary.alt,
      label: "Imagen principal",
    });
  }

  for (const asset of assets) {
    if (detail.length >= 3) {
      break;
    }

    if (asset.type !== "image" || asset.url === product.imagen) {
      continue;
    }

    const isUiSafe = asset.url.startsWith("assets/") || /^https:\/\/hbderm\.com\/wp-content\/uploads\//i.test(asset.url);
    if (!isUiSafe) {
      continue;
    }

    detail.push({
      src: asset.url,
      alt: asset.alt || `${product.titulo} imagen de referencia`,
      label: asset.sourceRole === "supplier" ? "Imagen proveedor" : "Imagen referencia",
    });
  }

  while (detail.length < 2) {
    detail.push({
      src: "assets/hbderm-image-slot.svg",
      alt: "Espacio para foto propia Nuvia",
      label: "Foto propia pendiente",
    });
  }

  if (detail.length < 3) {
    detail.push({
      src: "assets/hbderm-video-slot.svg",
      alt: "Espacio para video de uso Nuvia",
      label: "Video pendiente",
    });
  }

  return detail.slice(0, 3);
}

function mediaSummary(product, result) {
  const images = result.assets.filter((asset) => asset.type === "image");
  const videos = result.assets.filter((asset) => asset.type === "video" || asset.type === "embed");

  return {
    status: result.errors.length && !result.assets.length ? "blocked" : "researched",
    researchedAt: result.researchedAt,
    sourceCount: result.sources.length,
    imageCount: images.length,
    videoCount: videos.length,
    manifest: "data/references/product-sources/nuvia-product-media-enrichment-latest.json",
    needsOwnedMedia: !product.imagen.startsWith("assets/") || images.length < 2 || videos.length === 0,
    licenseNote: RIGHTS_NOTE,
    primaryImage: product.imagen,
    candidateImages: images.slice(0, 5).map((asset) => ({
      url: asset.url,
      source: asset.sourceName,
      sourceRole: asset.sourceRole,
      role: asset.role,
      usageRecommendation: asset.usageRecommendation,
    })),
    candidateVideos: videos.slice(0, 3).map((asset) => ({
      url: asset.url,
      source: asset.sourceName,
      sourceRole: asset.sourceRole,
      role: asset.role,
      usageRecommendation: asset.usageRecommendation,
    })),
  };
}

async function main() {
  const max = Number(argValue("--max", "0")) || Infinity;
  const concurrency = Math.max(1, Math.min(Number(argValue("--concurrency", "4")) || 4, 8));
  const writeClient = hasFlag("--write-client");
  const dateOut = path.join(OUT_DIR, `nuvia-product-media-enrichment-${todayStamp()}.json`);
  const client = JSON.parse(await readFile(NUVIA_JSON, "utf8"));
  const products = client.productos.slice(0, max);
  const records = [];
  let cursor = 0;

  async function worker() {
    while (cursor < products.length) {
      const index = cursor;
      cursor += 1;
      const product = products[index];
      const sources = productSources(product);
      const sourceResults = [];
      const assets = [];
      const errors = [];

      for (const source of sources) {
        try {
          const html = await fetchHtml(source.url);
          const sourceAssets = collectDomMedia(html, source);
          sourceResults.push({
            url: source.url,
            source: source.source,
            role: source.role,
            status: "ok",
            imageCount: sourceAssets.filter((asset) => asset.type === "image").length,
            videoCount: sourceAssets.filter((asset) => asset.type === "video" || asset.type === "embed").length,
          });
          assets.push(...sourceAssets);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          errors.push({ url: source.url, reason: message });
          sourceResults.push({
            url: source.url,
            source: source.source,
            role: source.role,
            status: "error",
            reason: message,
          });
        }
      }

      const current = currentImageAsset(product);
      const rankedAssets = dedupeAndRankAssets(current ? [current, ...assets] : assets);

      records.push({
        slug: slugify(product.titulo),
        title: product.titulo,
        brand: product.marca,
        category: product.categoria,
        sourceUrl: product.sourceUrl || "",
        researchedAt: new Date().toISOString(),
        sources: sourceResults,
        assets: rankedAssets,
        errors,
      });
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  records.sort((a, b) => a.slug.localeCompare(b.slug));

  const manifest = {
    source: "nuvia product media enrichment",
    fetchedAt: new Date().toISOString(),
    productCount: products.length,
    sourcePolicy: RIGHTS_NOTE,
    records,
    totals: {
      productsWithImages: records.filter((record) => record.assets.some((asset) => asset.type === "image")).length,
      productsWithVideos: records.filter((record) =>
        record.assets.some((asset) => asset.type === "video" || asset.type === "embed"),
      ).length,
      totalImageCandidates: records.reduce(
        (sum, record) => sum + record.assets.filter((asset) => asset.type === "image").length,
        0,
      ),
      totalVideoCandidates: records.reduce(
        (sum, record) => sum + record.assets.filter((asset) => asset.type === "video" || asset.type === "embed").length,
        0,
      ),
      blockedProducts: records.filter((record) => record.errors.length && !record.assets.length).length,
    },
  };

  await mkdir(OUT_DIR, { recursive: true });
  await writeFile(dateOut, `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(LATEST_OUT, `${JSON.stringify(manifest, null, 2)}\n`);

  if (writeClient) {
    const bySlug = new Map(records.map((record) => [record.slug, record]));
    client.productos = client.productos.map((product) => {
      const record = bySlug.get(slugify(product.titulo));
      if (!record) {
        return product;
      }

      return {
        ...product,
        detalleImagenes: buildDetailImages(product, record.assets),
        mediaEnrichment: mediaSummary(product, record),
      };
    });

    await writeFile(NUVIA_JSON, `${JSON.stringify(client, null, 2)}\n`);
  }

  console.log(
    JSON.stringify(
      {
        latestOut: LATEST_OUT,
        datedOut: dateOut,
        writeClient,
        ...manifest.totals,
        productCount: manifest.productCount,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

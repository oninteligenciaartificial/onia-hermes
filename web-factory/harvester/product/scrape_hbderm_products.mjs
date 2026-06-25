import * as cheerio from "cheerio";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE = "https://hbderm.com";
const SITEMAPS = [
  `${SOURCE}/product-sitemap1.xml`,
  `${SOURCE}/product-sitemap2.xml`,
];
const EXTRA_PRODUCT_URLS = [
  `${SOURCE}/hbderm-catalogo/pieles-con-grasas-o-con-acne/sebiaclear-gel-moussant-200ml/`,
];
const outArg = process.argv.find((arg) => arg.startsWith("--out="));
const OUT = path.resolve(outArg ? outArg.split("=").slice(1).join("=") : "data/references/product-sources/hbderm-products-20260619.json");
const USER_AGENT = "ONIA-WebFactory/1.0 product research (contact: Sergio via ONIA)";

function text(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeUrlPart(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function titleCaseSlug(value) {
  return decodeUrlPart(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function stripHtml(value) {
  return text(value.replace(/<[^>]*>/g, " "));
}

function parsePrice(value) {
  if (!value) {
    return null;
  }

  const normalized = String(value)
    .replace(/[^\d,.-]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "user-agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }

  return response.text();
}

function productUrlsFromSitemap(xml) {
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => text(match[1]))
    .filter((url) => url.includes("/hbderm-catalogo/"))
    .filter((url) => !url.endsWith("/hbderm-catalogo/"));
}

function imagesFromSitemap(xml) {
  const imageMap = new Map();
  const blocks = xml.split(/<url>/g).slice(1);

  for (const block of blocks) {
    const url = text(block.match(/<loc>(.*?)<\/loc>/)?.[1]);
    if (!url || !url.includes("/hbderm-catalogo/") || url.endsWith("/hbderm-catalogo/")) {
      continue;
    }

    imageMap.set(
      url,
      [...block.matchAll(/<image:loc>(.*?)<\/image:loc>/g)].map((match) => text(match[1])),
    );
  }

  return imageMap;
}

function urlCategories(url) {
  const pathname = new URL(url).pathname.replace(/^\/|\/$/g, "");
  const parts = pathname.split("/");
  const catalogIndex = parts.indexOf("hbderm-catalogo");

  if (catalogIndex === -1) {
    return [];
  }

  return parts.slice(catalogIndex + 1, -1).map(titleCaseSlug);
}

function cleanProductTitle(value) {
  return text(value)
    .replace(/\s*\|\s*HBDERM\s*$/i, "")
    .replace(/\s*-\s*HBDERM\s*$/i, "");
}

function meta($, selector, attr = "content") {
  return text($(selector).attr(attr));
}

function scrapeProduct(html, url, sitemapImages) {
  const $ = cheerio.load(html);
  const canonical = meta($, 'link[rel="canonical"]', "href") || url;
  const title =
    cleanProductTitle(meta($, 'meta[property="og:title"]')) ||
    cleanProductTitle($("h1.product_title").first().text()) ||
    cleanProductTitle($("title").first().text());
  const brand = meta($, 'meta[property="product:brand"]') || text($(".pwb-single-product-brands a").first().text());
  const price =
    parsePrice(meta($, 'meta[property="product:price:amount"]')) ||
    parsePrice($(".summary .woocommerce-Price-amount").first().text()) ||
    parsePrice($(".price .woocommerce-Price-amount").first().text());
  const regularPrice =
    parsePrice($(".summary .price del .woocommerce-Price-amount").first().text()) ||
    parsePrice($(".price del .woocommerce-Price-amount").first().text()) ||
    price;
  const salePrice =
    parsePrice($(".summary .price ins .woocommerce-Price-amount").first().text()) ||
    parsePrice($(".price ins .woocommerce-Price-amount").first().text()) ||
    price;
  const image = meta($, 'meta[property="og:image"]') || sitemapImages[0] || "";
  const description = stripHtml(meta($, 'meta[name="description"]') || $(".woocommerce-product-details__short-description").first().html() || "");
  const availability = meta($, 'meta[property="product:availability"]') || text($(".stock").first().text());
  const categories = urlCategories(canonical || url);

  return {
    source: "hbderm.com",
    source_url: canonical || url,
    title,
    brand: brand || inferBrand(title),
    categories,
    slug: new URL(canonical || url).pathname.replace(/^\/|\/$/g, "").split("/").pop(),
    description,
    image_url: image,
    sitemap_image_urls: sitemapImages,
    price: salePrice,
    regular_price: regularPrice,
    currency: meta($, 'meta[property="product:price:currency"]') || "BOB",
    availability,
    scraped_at: new Date().toISOString(),
  };
}

function inferBrand(title) {
  const known = [
    "ISDIN",
    "URIAGE",
    "SVR",
    "BIODERMA",
    "EUCERIN",
    "LA ROCHE",
    "AVENE",
    "CERAVE",
    "GILSDIN",
    "HELIOCARE",
    "FILORGA",
  ];
  const upper = String(title || "").toUpperCase();
  return known.find((brand) => upper.includes(brand)) || "HBDERM";
}

async function main() {
  const maxArg = process.argv.find((arg) => arg.startsWith("--max="));
  const concurrencyArg = process.argv.find((arg) => arg.startsWith("--concurrency="));
  const max = maxArg ? Number(maxArg.split("=")[1]) : Infinity;
  const concurrency = Math.max(1, Math.min(Number(concurrencyArg?.split("=")[1]) || 5, 8));
  const sitemapXml = [];
  const imageMap = new Map();

  for (const sitemap of SITEMAPS) {
    const xml = await fetchText(sitemap);
    sitemapXml.push(xml);
    for (const [url, images] of imagesFromSitemap(xml)) {
      imageMap.set(url, images);
    }
  }

  const urls = [...new Set([...sitemapXml.flatMap(productUrlsFromSitemap), ...EXTRA_PRODUCT_URLS])].slice(0, max);
  const products = [];
  const errors = [];
  let cursor = 0;

  async function worker() {
    while (cursor < urls.length) {
      const url = urls[cursor];
      cursor += 1;

      try {
        const html = await fetchText(url);
        const product = scrapeProduct(html, url, imageMap.get(url) || []);

        if (product.title && product.price !== null) {
          products.push(product);
        } else {
          errors.push({ url, reason: "missing title or price", title: product.title, price: product.price });
        }
      } catch (error) {
        errors.push({ url, reason: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(
    OUT,
    `${JSON.stringify(
      {
        source: SOURCE,
        fetched_at: new Date().toISOString(),
        sitemaps: SITEMAPS,
        url_count: urls.length,
        product_count: products.length,
        error_count: errors.length,
        products,
        errors,
      },
      null,
      2,
    )}\n`,
  );

  console.log(JSON.stringify({ out: OUT, url_count: urls.length, product_count: products.length, error_count: errors.length }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

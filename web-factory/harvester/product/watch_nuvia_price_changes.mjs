import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const CANONICAL_SOURCE = path.resolve("data/references/product-sources/hbderm-products-20260619.json");
const LATEST_CHECK = path.resolve("data/references/product-sources/hbderm-products-latest-check.json");
const REPORT_DIR = path.resolve("data/references/product-sources/price-watch");
const LATEST_REPORT = path.resolve("data/references/product-sources/nuvia-price-watch-latest.json");

const DEFAULT_MIN_CHANGE = 0.01;
const DEFAULT_MAX_ERRORS = 25;
const DEFAULT_MIN_PRODUCT_RATIO = 0.9;

function argValue(name, fallback = "") {
  const prefix = `${name}=`;
  const arg = process.argv.find((item) => item.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function round2(value) {
  return Math.round(Number(value) * 100) / 100;
}

function isoStamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function readJson(filePath, fallback = null) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: process.cwd(),
      shell: process.platform === "win32" && command === "pnpm",
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(" ")} exited with ${code}`));
    });
  });
}

function productKey(product) {
  return product.source_url || product.slug || product.title;
}

function productSnapshot(product) {
  return {
    title: product.title,
    brand: product.brand,
    source_url: product.source_url,
    slug: product.slug,
    price: typeof product.price === "number" ? round2(product.price) : null,
    regular_price: typeof product.regular_price === "number" ? round2(product.regular_price) : null,
    currency: product.currency || "BOB",
    availability: product.availability || "",
  };
}

function compareProducts(previousProducts, currentProducts, minChange) {
  const previousByKey = new Map(previousProducts.map((product) => [productKey(product), productSnapshot(product)]));
  const currentByKey = new Map(currentProducts.map((product) => [productKey(product), productSnapshot(product)]));
  const changed = [];
  const added = [];
  const removed = [];

  for (const [key, current] of currentByKey) {
    const previous = previousByKey.get(key);

    if (!previous) {
      added.push(current);
      continue;
    }

    if (previous.price === null || current.price === null) {
      continue;
    }

    const delta = round2(current.price - previous.price);
    if (Math.abs(delta) >= minChange) {
      changed.push({
        title: current.title,
        brand: current.brand,
        source_url: current.source_url,
        currency: current.currency,
        previous_price: previous.price,
        current_price: current.price,
        delta,
        delta_percent: previous.price ? round2((delta / previous.price) * 100) : null,
      });
    }
  }

  for (const [key, previous] of previousByKey) {
    if (!currentByKey.has(key)) {
      removed.push(previous);
    }
  }

  return { changed, added, removed };
}

async function writeReport(report) {
  await mkdir(REPORT_DIR, { recursive: true });
  const datedReport = path.join(REPORT_DIR, `nuvia-price-watch-${isoStamp()}.json`);
  const payload = `${JSON.stringify(report, null, 2)}\n`;
  await writeFile(datedReport, payload);
  await writeFile(LATEST_REPORT, payload);
  return datedReport;
}

async function applyCatalogRefresh() {
  const backupPath = `${CANONICAL_SOURCE}.backup-${isoStamp()}`;
  await copyFile(CANONICAL_SOURCE, backupPath);

  try {
    await copyFile(LATEST_CHECK, CANONICAL_SOURCE);
    await run("node", ["harvester/product/build_nuvia_hbderm_catalog.mjs"]);
    await run("node", ["harvester/product/sanitize_nuvia_public_catalog.mjs"]);
    await run("node", ["harvester/product/apply_existing_nuvia_cutouts.mjs"]);
    await run("node", ["harvester/product/build_nuvia_merchandising.mjs"]);
    return { backup_path: backupPath, rolled_back: false };
  } catch (error) {
    await copyFile(backupPath, CANONICAL_SOURCE);
    error.message = `${error.message} (canonical supplier source restored from ${backupPath})`;
    throw error;
  }
}

async function main() {
  const minChange = Number(argValue("--min-change", DEFAULT_MIN_CHANGE));
  const maxErrors = Number(argValue("--max-errors", DEFAULT_MAX_ERRORS));
  const minProductRatio = Number(argValue("--min-product-ratio", DEFAULT_MIN_PRODUCT_RATIO));
  const concurrency = argValue("--concurrency", "1");
  const checkOnly = hasFlag("--check-only");
  const force = hasFlag("--force");
  const buildSite = hasFlag("--build-site");

  const previous = await readJson(CANONICAL_SOURCE, { products: [], product_count: 0, error_count: 0 });

  await run("node", [
    "harvester/product/scrape_hbderm_products.mjs",
    `--concurrency=${concurrency}`,
    `--out=${LATEST_CHECK}`,
  ]);

  const current = await readJson(LATEST_CHECK, { products: [], product_count: 0, error_count: 9999 });
  const comparison = compareProducts(previous.products || [], current.products || [], minChange);
  const changedCount = comparison.changed.length;
  const addedCount = comparison.added.length;
  const removedCount = comparison.removed.length;
  const productRatio = previous.product_count ? current.product_count / previous.product_count : 1;
  const hasUnsafeScrape =
    current.error_count > maxErrors ||
    current.product_count < 1 ||
    (previous.product_count > 0 && productRatio < minProductRatio);
  const hasCatalogChanges = changedCount > 0 || addedCount > 0 || removedCount > 0;
  const hasStructuralCatalogChanges = addedCount > 0 || removedCount > 0;
  const shouldApply = force || (!checkOnly && !hasUnsafeScrape && changedCount > 0 && !hasStructuralCatalogChanges);

  const report = {
    generated_at: new Date().toISOString(),
    source: current.source || previous.source || "https://hbderm.com",
    mode: checkOnly ? "check_only" : "watch_apply_if_needed",
    thresholds: {
      min_change: minChange,
      max_errors: maxErrors,
      min_product_ratio: minProductRatio,
    },
    previous: {
      fetched_at: previous.fetched_at || null,
      product_count: previous.product_count || 0,
      error_count: previous.error_count || 0,
    },
    current: {
      fetched_at: current.fetched_at || null,
      product_count: current.product_count || 0,
      error_count: current.error_count || 0,
      product_ratio: round2(productRatio),
    },
    summary: {
      changed: changedCount,
      added: addedCount,
      removed: removedCount,
      unsafe_scrape: hasUnsafeScrape,
      structural_catalog_changes: hasStructuralCatalogChanges,
      applied: shouldApply,
      reason: hasUnsafeScrape
        ? "Scrape guard blocked apply; review errors before updating public prices."
        : !force && hasStructuralCatalogChanges
          ? "Detected added/removed supplier products; manual review required before updating public catalog."
        : shouldApply
          ? "Detected price/catalog changes and refreshed Nuvia catalog artifacts."
          : checkOnly && hasCatalogChanges
            ? "Detected price/catalog changes in check-only mode; review before applying."
            : "No price/catalog changes above threshold.",
    },
    changes: comparison.changed,
    added: comparison.added,
    removed: comparison.removed,
    scrape_errors: (current.errors || []).slice(0, 50),
  };

  if (shouldApply) {
    const applyResult = await applyCatalogRefresh();
    report.summary.apply_backup = applyResult.backup_path;
    report.summary.rolled_back = applyResult.rolled_back;
    if (buildSite) {
      await run("pnpm", ["build"]);
    }
  }

  const reportPath = await writeReport(report);
  console.log(
    JSON.stringify(
      {
        report: reportPath,
        latestReport: LATEST_REPORT,
        changed: changedCount,
        added: addedCount,
        removed: removedCount,
        unsafeScrape: hasUnsafeScrape,
        applied: shouldApply,
      },
      null,
      2,
    ),
  );

  if (hasUnsafeScrape && !checkOnly && !force) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

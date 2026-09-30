const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

function resolvePlaywrightCore() {
  if (process.env.PLAYWRIGHT_CORE_PATH) {
    return require(process.env.PLAYWRIGHT_CORE_PATH);
  }

  const cacheRoot = path.join(
    process.env.LOCALAPPDATA || "",
    "npm-cache",
    "_npx",
  );

  if (fs.existsSync(cacheRoot)) {
    const candidates = fs
      .readdirSync(cacheRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => {
        const packagePath = path.join(
          cacheRoot,
          entry.name,
          "node_modules",
          "playwright-core",
        );
        return {
          packagePath,
          modified: fs.existsSync(packagePath)
            ? fs.statSync(packagePath).mtimeMs
            : 0,
        };
      })
      .filter((entry) => entry.modified > 0)
      .sort((a, b) => b.modified - a.modified);

    if (candidates[0]) {
      return require(candidates[0].packagePath);
    }
  }

  throw new Error(
    "No se encontró playwright-core. Ejecutá primero: npx playwright --version",
  );
}

const { chromium } = resolvePlaywrightCore();

const projectRoot = path.resolve(__dirname, "..");
const outputDir = path.join(
  projectRoot,
  "hermes-content",
  "captures",
  "opus-5-5",
);
const videoDir = path.join(outputDir, ".video-tmp");
const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  path.join(
    process.env.LOCALAPPDATA || "",
    "Google",
    "Chrome",
    "Application",
    "chrome.exe",
  ),
];
const chromePath = chromeCandidates.find((candidate) => fs.existsSync(candidate));

if (!chromePath) {
  throw new Error("No se encontró Google Chrome instalado.");
}

fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(videoDir, { recursive: true });

const cleanCaptureCss = `
  html { scroll-behavior: auto !important; }
  button[class*="ConsentContainer"],
  #onetrust-banner-sdk,
  #onetrust-consent-sdk,
  .ot-sdk-container { visibility: hidden !important; }
  * { caret-color: transparent !important; }
`;

function verifyPng(filePath, expectedWidth = 1920, expectedHeight = 1080) {
  const buffer = fs.readFileSync(filePath);
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);
  if (width !== expectedWidth || height !== expectedHeight) {
    throw new Error(
      `${path.basename(filePath)} mide ${width}x${height}; se esperaba ${expectedWidth}x${expectedHeight}`,
    );
  }
}

function redactUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    for (const key of url.searchParams.keys()) {
      if (/(api[-_]?key|token|secret|password|authorization)/i.test(key)) {
        url.searchParams.set(key, "[redacted]");
      }
    }
    return url.toString();
  } catch {
    return "[invalid-url-redacted]";
  }
}

async function waitForAnyText(page, patterns) {
  for (const pattern of patterns) {
    const locator = page.getByText(pattern).first();
    if (await locator.isVisible().catch(() => false)) {
      return locator;
    }
  }
  throw new Error(`No apareció ninguno de estos textos: ${patterns.join(", ")}`);
}

async function captureSection(page, fileName, patterns) {
  const locator = await waitForAnyText(page, patterns);
  await locator.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const filePath = path.join(outputDir, fileName);
  await page.screenshot({
    path: filePath,
    fullPage: false,
    animations: "disabled",
    caret: "hide",
    style: cleanCaptureCss,
  });
  verifyPng(filePath);
  return {
    file: fileName,
    matchedText: (await locator.innerText()).trim().slice(0, 240),
  };
}

async function main() {
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ["--disable-features=Translate", "--force-color-profile=srgb"],
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    locale: "en-US",
    colorScheme: "light",
    recordVideo: {
      dir: videoDir,
      size: { width: 1920, height: 1080 },
    },
  });
  const blockedRequests = [];
  await context.route("**/*", async (route) => {
    const method = route.request().method().toUpperCase();
    if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
      blockedRequests.push({ method, url: redactUrl(route.request().url()) });
      await route.abort();
      return;
    }
    await route.continue();
  });
  const page = await context.newPage();
  const video = page.video();
  const manifest = {
    capturedAt: new Date().toISOString(),
    viewport: "1920x1080",
    browser: chromePath,
    sources: [],
    captures: [],
  };

  const announcementUrl = "https://www.anthropic.com/claude-opus-5-5";
  await page.goto(announcementUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.addStyleTag({ content: cleanCaptureCss });
  await waitForAnyText(page, [/Claude Opus 5\.5/i]);
  const releaseDate = page
    .getByText("September 22, 2026", { exact: true })
    .first();
  await releaseDate.waitFor({ state: "visible", timeout: 20000 });
  await releaseDate.evaluate((element) =>
    element.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await page.waitForTimeout(500);
  const heroPath = path.join(outputDir, "01-hero-launch.png");
  await page.screenshot({
    path: heroPath,
    fullPage: false,
    animations: "disabled",
    caret: "hide",
    style: cleanCaptureCss,
  });
  verifyPng(heroPath);
  manifest.sources.push(announcementUrl);
  manifest.captures.push({
    file: "01-hero-launch.png",
    expected: ["Claude Opus 5.5", "September 22, 2026"],
  });

  const costParagraph = page
    .locator("p")
    .filter({ hasText: "Cost and speed." })
    .filter({ hasText: "$4 and $20 per million" })
    .filter({ hasText: "$0.20 per million" })
    .first();
  await costParagraph.scrollIntoViewIfNeeded();
  const costText = (await costParagraph.innerText()).replace(/\s+/g, " ").trim();
  for (const expected of [
    "$4 and $20 per million",
    "$0.20 per million",
    "more than 30% faster",
  ]) {
    if (!costText.includes(expected)) {
      throw new Error(`El bloque de costo no contiene: ${expected}`);
    }
  }
  manifest.captures.push(
    await captureSection(page, "02-cost-and-speed.png", [/Cost and speed/i]),
  );
  manifest.captures.push(
    await captureSection(page, "03-availability-model-id.png", [
      /claude-opus-5-5/i,
      /Availability/i,
    ]),
  );

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(700);
  const scrollStops = [0.18, 0.42, 0.66, 0.9];
  for (const fraction of scrollStops) {
    await page.evaluate((position) => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo({ top: max * position, behavior: "smooth" });
    }, fraction);
    await page.waitForTimeout(1500);
  }

  const migrationUrl =
    "https://platform.claude.com/docs/en/models/opus-5-5/migration-guide";
  await page.goto(migrationUrl, {
    waitUntil: "domcontentloaded",
    timeout: 60000,
  });
  await page.addStyleTag({ content: cleanCaptureCss });
  await waitForAnyText(page, [/Opus 5\.5/i, /migration/i]);
  manifest.sources.push(migrationUrl);
  manifest.captures.push(
    await captureSection(page, "04-migration-thinking.png", [
      /thinking cannot be disabled/i,
      /adaptive thinking/i,
      /thinking/i,
    ]),
  );
  manifest.captures.push(
    await captureSection(page, "05-migration-tool-choice.png", [
      /tool choice/i,
      /tool_choice/i,
      /strict tools/i,
    ]),
  );

  const finalText = await page.locator("body").innerText();
  manifest.validation = {
    migrationPageContainsOpus55: /Opus 5\.5/i.test(finalText),
    noAuthenticationUsed: true,
    noFormSubmitted: true,
    blockedNonReadRequests: blockedRequests,
  };

  const rawVideoPath = await video.path();
  await context.close();
  await browser.close();

  const finalVideoPath = path.join(outputDir, "06-official-pages-scroll.webm");
  fs.copyFileSync(rawVideoPath, finalVideoPath);
  fs.rmSync(videoDir, { recursive: true, force: true });
  const cleanVideoPath = path.join(
    outputDir,
    "07-official-pages-scroll-clean.webm",
  );
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-ss",
      "4",
      "-i",
      finalVideoPath,
      "-an",
      "-c:v",
      "libvpx",
      "-crf",
      "18",
      "-b:v",
      "0",
      cleanVideoPath,
    ],
    { stdio: "ignore" },
  );
  manifest.video = {
    raw: path.basename(finalVideoPath),
    clean: path.basename(cleanVideoPath),
    trimStartSeconds: 4,
  };

  fs.writeFileSync(
    path.join(outputDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8",
  );

  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message}\n`);
  process.exitCode = 1;
});

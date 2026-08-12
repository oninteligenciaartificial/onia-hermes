import { chromium } from "playwright";
import { pathToFileURL } from "node:url";

const [file, outPrefix, ...widths] = process.argv.slice(2);
const url = file.startsWith("http") ? file : pathToFileURL(file).href;
const browser = await chromium.launch();

for (const w of widths.length ? widths : ["1440"]) {
  const page = await browser.newPage({ viewport: { width: Number(w), height: 1000 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url, { waitUntil: "load" });
  // let the IntersectionObserver runtime fire + transitions settle
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  const stats = await page.evaluate(() => ({
    revealTargets: document.querySelectorAll(".wf-reveal,.wf-stagger,.wf-clip-reveal,.wf-type-slam").length,
    revealed: document.querySelectorAll(".wf-in").length,
    invisible: [...document.querySelectorAll("section,footer,main > *")].filter((el) => {
      const s = getComputedStyle(el);
      return s.opacity === "0" || s.visibility === "hidden";
    }).length,
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    h: document.body.scrollHeight,
  }));
  console.log(JSON.stringify({ width: w, ...stats, errors }));
  await page.screenshot({ path: `${outPrefix}-${w}.png`, fullPage: true });
  await page.close();
}

await browser.close();

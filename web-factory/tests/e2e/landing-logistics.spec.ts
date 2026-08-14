import { expect, test } from "@playwright/test";

const URL = "/logistics-demo/";

/**
 * The static preview built from the learned model `unitedcarriers-logistics`.
 * These specs guard the three things the model actually promises: the process is
 * VISIBLE (and legible when nothing moves), a number is never invented, and the
 * page ends in a quote the visitor can send.
 */
test.describe("landing-logistics preview (logistics-demo)", () => {
  test("opens on the scene with the offer and one clear next step", async ({ page }) => {
    await page.goto(URL);
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();

    const cta = page.locator(".wf-ssh-cta");
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "#cotizacion");

    // The stages are text, not just images: this is what a screen reader reads.
    await expect(page.locator(".wf-ssh-step")).toHaveCount(3);
    await expect(page.locator(".wf-ssh-step").first()).toContainText("Deposito");
  });

  test("the scroll advances the scene, one stage at a time", async ({ page }) => {
    await page.goto(URL);
    const track = page.locator("[data-wf-scrub]");
    await expect(track).toHaveAttribute("data-wf-step", "0");
    await expect(page.locator(".wf-ssh-step").first()).toHaveAttribute("aria-current", "step");

    // Scroll by the track's own runway, not by viewport guesses: the runway is
    // svh-based and differs between desktop and a mobile viewport.
    const runway = (fraction: number) =>
      page.evaluate((f) => {
        const el = document.querySelector<HTMLElement>("[data-wf-scrub]");
        const run = (el?.offsetHeight ?? 0) - window.innerHeight;
        window.scrollTo(0, run * f);
      }, fraction);

    await runway(0.5);
    await expect(track).toHaveAttribute("data-wf-step", "1");

    await runway(0.95);
    await expect(track).toHaveAttribute("data-wf-step", "2");
    await expect(page.locator(".wf-ssh-step").last()).toHaveAttribute("aria-current", "step");
    // The last stage image is the one on screen, not a leftover from stage 1.
    await expect(page.locator(".wf-frame").last()).toHaveClass(/wf-on/);
  });

  test("never invents a number: unconfirmed stats ship tagged", async ({ page }) => {
    await page.goto(URL);
    const stats = page.locator(".wf-stat");
    await expect(stats).toHaveCount(4);
    // Every sample stat says so on screen, and no count-up is wired to a value
    // the client has not confirmed.
    await expect(page.locator(".wf-stat-sample")).toHaveCount(4);
    await expect(page.locator("[data-wf-count]")).toHaveCount(0);
    await expect(page.locator(".wf-stat-note")).toContainText("4 de 4");
  });

  test("closes on a quote form with labelled fields and attribution", async ({ page }) => {
    await page.goto(URL);
    const form = page.locator(".wf-qf-form");
    await expect(form).toBeVisible();

    // Every control is reachable by its visible label.
    await form.getByLabel(/Origen/).fill("Santa Cruz");
    await form.getByLabel(/Destino/).fill("La Paz");
    await form.getByLabel(/Tipo de carga/).selectOption("Paletizada");
    await expect(form.getByLabel(/Origen/)).toHaveValue("Santa Cruz");

    await expect(form.locator('input[name="src"]')).toHaveAttribute("value", "logistics-demo");
    await expect(page.locator(".wf-qf-submit")).toBeVisible();
  });

  test("no horizontal overflow at 390 / 768 / 1440", async ({ page }) => {
    await page.goto(URL);
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(120);
      const overflow = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        win: window.innerWidth,
      }));
      expect(overflow.doc, `overflow at ${width}px`).toBeLessThanOrEqual(overflow.win);
    }
  });

  test("no broken same-origin assets", async ({ page }) => {
    const failed: string[] = [];
    page.on("requestfailed", (request) => {
      const kind = request.resourceType();
      if (kind === "image" || kind === "stylesheet") failed.push(`${kind} ${request.url()}`);
    });
    const response = await page.goto(URL);
    expect(response?.ok()).toBeTruthy();
    await page.waitForLoadState("networkidle");
    expect(failed, `broken assets: ${failed.join(", ")}`).toEqual([]);
  });
});

test.describe("landing-logistics with reduced motion", () => {
  // emulateMedia, not test.use({ reducedMotion }): under this config the
  // describe-level fixture option does not reach the context (probed: matchMedia
  // still reported no-preference), and a silently-unemulated test would assert
  // the default page and pass for the wrong reason.
  test("renders the final state: nothing pinned, nothing hidden", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(URL);
    expect(
      await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches),
      "reduced motion is actually emulated",
    ).toBe(true);

    // The runtime never engages, so the hero does not pin and no frame is swapped.
    await expect(page.locator("[data-wf-scrub]")).not.toHaveAttribute("data-wf-step", /\d/);
    const scenePosition = await page
      .locator(".wf-ssh-scene")
      .evaluate((el) => getComputedStyle(el).position);
    expect(scenePosition).toBe("static");

    // Everything that would have animated in is visible and readable.
    const hidden = await page.evaluate(
      () =>
        [...document.querySelectorAll(".wf-reveal, .wf-stagger, .wf-frame:first-child")].filter(
          (el) => Number(getComputedStyle(el).opacity) < 1,
        ).length,
    );
    expect(hidden, "elements still hidden under reduced motion").toBe(0);

    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".wf-ssh-cta")).toBeVisible();
    await expect(page.locator(".wf-ssh-step")).toHaveCount(3);
  });
});

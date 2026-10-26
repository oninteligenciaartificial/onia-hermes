# Landing Dental Vertical — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the demo dental-clinic vertical landing (patient acquisition, WhatsApp booking) in ONIA Web Factory, meeting the Pattern Bank Clinic/Health quality bar and green e2e gates.

**Architecture:** Extend the tokenized block system with 4 new HTML-only blocks (trust, process, faq, sticky-cta), enrich the hero trust panel to read real data, and compose them in a new `landing-clinic` template. Blocks emit `wf-*` HTML; all CSS lives centralized in the template (same pattern as `landing.ts`). Register the template in the generator and e2e harness. Demo data ships as a client JSON marked demo.

**Tech Stack:** TypeScript, Next.js 15 (render engine only), zod (data validation), vitest (unit), Playwright + axe-core (e2e a11y/visual/perf), pnpm workspaces.

**Scope note:** Demo works by writing the client JSON directly (like `clinic-demo.json`). Mapping the new fields through the official intake flow (`intake-schema.ts` + `create-client.ts`) is a follow-up, not required for the demo or for cloning by copying the JSON.

**Boundary rule:** Only `web-factory/**`. Task 12 touches `web-factory/package.json` (a factory root file) — flagged, user already advised.

---

### Task 1: Extend client schema + SiteClient type with clinic fields

**Files:**
- Modify: `web-factory/packages/blocks/src/types.ts`
- Modify: `web-factory/data/schema.ts:201-221` (after `servicios`/`beneficios`)
- Test: `web-factory/data/schema.test.ts` (create)

- [ ] **Step 1: Write the failing test**

Create `web-factory/data/schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { clientSchema } from "./schema";

describe("clientSchema clinic fields", () => {
  it("parses credenciales, proceso and faq when present", () => {
    const parsed = clientSchema.parse({
      nombre: "Aura",
      slug: "aura",
      tagline: "Sonrisas sanas",
      descripcion: "Clinica dental.",
      credenciales: ["Matricula profesional"],
      proceso: [{ titulo: "Agenda", desc: "Escribinos por WhatsApp." }],
      faq: [{ pregunta: "Duele?", respuesta: "Trabajamos con anestesia." }],
    });
    expect(parsed.credenciales).toEqual(["Matricula profesional"]);
    expect(parsed.proceso[0].titulo).toBe("Agenda");
    expect(parsed.faq[0].pregunta).toBe("Duele?");
  });

  it("defaults the clinic fields to empty arrays when absent", () => {
    const parsed = clientSchema.parse({
      nombre: "Aura",
      slug: "aura",
      tagline: "Sonrisas sanas",
      descripcion: "Clinica dental.",
    });
    expect(parsed.credenciales).toEqual([]);
    expect(parsed.proceso).toEqual([]);
    expect(parsed.faq).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run data/schema.test.ts`
Expected: FAIL (`credenciales` is `undefined`, not `[]`).

- [ ] **Step 3: Add the fields to the zod schema**

In `web-factory/data/schema.ts`, add these schemas before `clientSchema` (near `serviceSchema`, line ~28):

```ts
const procesoPasoSchema = z.object({
  titulo: z.string().min(1),
  desc: z.string().min(1),
});

const faqItemSchema = z.object({
  pregunta: z.string().min(1),
  respuesta: z.string().min(1),
});
```

Then inside `clientSchema` object, right after the `beneficios` field (line ~221):

```ts
  credenciales: z.array(z.string().min(1)).default([]),
  proceso: z.array(procesoPasoSchema).default([]),
  faq: z.array(faqItemSchema).default([]),
```

- [ ] **Step 4: Mirror the fields on the SiteClient type**

In `web-factory/packages/blocks/src/types.ts`, add to the `SiteClient` type (after `servicios`):

```ts
  beneficios?: string[];
  credenciales?: string[];
  proceso?: Array<{ titulo: string; desc: string }>;
  faq?: Array<{ pregunta: string; respuesta: string }>;
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run data/schema.test.ts`
Expected: PASS (both tests).

- [ ] **Step 6: Commit**

```bash
git add web-factory/data/schema.ts web-factory/data/schema.test.ts web-factory/packages/blocks/src/types.ts
git commit -m "feat(web-factory): add credenciales/proceso/faq to client schema"
```

---

### Task 2: Trust strip block

**Files:**
- Create: `web-factory/packages/blocks/src/trust.ts`
- Test: `web-factory/packages/blocks/src/trust.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { renderTrust } from "./trust";

const base = {
  nombre: "Aura", tagline: "t", descripcion: "d", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "c", url: "#" },
} as const;

describe("renderTrust", () => {
  it("renders credenciales as a trust strip", () => {
    const html = renderTrust({ ...base, credenciales: ["Matricula profesional", "Esterilizacion certificada"] });
    expect(html).toContain("wf-trust");
    expect(html).toContain("Matricula profesional");
    expect(html).toContain("Esterilizacion certificada");
  });

  it("falls back to beneficios when credenciales is empty", () => {
    const html = renderTrust({ ...base, beneficios: ["Urgencias el mismo dia"] });
    expect(html).toContain("Urgencias el mismo dia");
  });

  it("returns empty string when there is nothing to show", () => {
    expect(renderTrust(base)).toBe("");
  });

  it("escapes HTML in items", () => {
    const html = renderTrust({ ...base, credenciales: ["<script>x</script>"] });
    expect(html).not.toContain("<script>x</script>");
    expect(html).toContain("&lt;script&gt;");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/trust.test.ts`
Expected: FAIL (Cannot find module `./trust`).

- [ ] **Step 3: Implement the block**

Create `web-factory/packages/blocks/src/trust.ts`:

```ts
import { escapeHtml } from "./escape";
import type { SiteClient } from "./types";

// Trust strip: proves the clinic is real (credentials, guarantees). Reads real
// data only; renders nothing when there is no proof to show (no fake claims).
export function renderTrust(client: SiteClient): string {
  const items = (client.credenciales?.length ? client.credenciales : client.beneficios ?? [])
    .filter((item) => item.trim().length > 0);
  if (items.length === 0) return "";

  const cells = items
    .map((item) => `<li class="wf-trust-item">${escapeHtml(item)}</li>`)
    .join("");

  return `
    <section class="wf-trust" aria-label="Confianza y credenciales">
      <ul class="wf-trust-list">
        ${cells}
      </ul>
    </section>
  `;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/trust.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add web-factory/packages/blocks/src/trust.ts web-factory/packages/blocks/src/trust.test.ts
git commit -m "feat(web-factory): add trust strip block"
```

---

### Task 3: Process block

**Files:**
- Create: `web-factory/packages/blocks/src/process.ts`
- Test: `web-factory/packages/blocks/src/process.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { renderProcess } from "./process";

const base = {
  nombre: "Aura", tagline: "t", descripcion: "d", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "c", url: "#" },
} as const;

describe("renderProcess", () => {
  it("renders numbered steps", () => {
    const html = renderProcess({
      ...base,
      proceso: [
        { titulo: "Agenda", desc: "Escribinos por WhatsApp." },
        { titulo: "Evaluacion", desc: "Revisamos tu caso." },
      ],
    });
    expect(html).toContain("wf-process");
    expect(html).toContain("Agenda");
    expect(html).toContain("Evaluacion");
    expect(html).toContain("01");
    expect(html).toContain("02");
  });

  it("returns empty string when proceso is empty", () => {
    expect(renderProcess(base)).toBe("");
  });

  it("escapes HTML", () => {
    const html = renderProcess({ ...base, proceso: [{ titulo: "<b>x</b>", desc: "d" }] });
    expect(html).not.toContain("<b>x</b>");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/process.test.ts`
Expected: FAIL (Cannot find module `./process`).

- [ ] **Step 3: Implement the block**

Create `web-factory/packages/blocks/src/process.ts`:

```ts
import { escapeHtml } from "./escape";
import type { SiteClient } from "./types";

// Process: what happens after contact. Verb-led steps reduce booking anxiety.
export function renderProcess(client: SiteClient): string {
  const steps = client.proceso ?? [];
  if (steps.length === 0) return "";

  const items = steps
    .map(
      (step, index) => `
        <li class="wf-process-step">
          <span class="wf-process-number">${String(index + 1).padStart(2, "0")}</span>
          <h3 class="wf-process-title">${escapeHtml(step.titulo)}</h3>
          <p>${escapeHtml(step.desc)}</p>
        </li>
      `,
    )
    .join("");

  return `
    <section class="wf-section wf-process" id="proceso" aria-labelledby="wf-process-heading">
      <div class="wf-section-heading">
        <p class="wf-kicker">Como funciona</p>
        <h2 id="wf-process-heading">De tu mensaje a tu cita, sin vueltas</h2>
      </div>
      <ol class="wf-process-list">
        ${items}
      </ol>
    </section>
  `;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/process.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add web-factory/packages/blocks/src/process.ts web-factory/packages/blocks/src/process.test.ts
git commit -m "feat(web-factory): add process steps block"
```

---

### Task 4: FAQ block

**Files:**
- Create: `web-factory/packages/blocks/src/faq.ts`
- Test: `web-factory/packages/blocks/src/faq.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { renderFaq } from "./faq";

const base = {
  nombre: "Aura", tagline: "t", descripcion: "d", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "c", url: "#" },
} as const;

describe("renderFaq", () => {
  it("renders accessible details/summary items", () => {
    const html = renderFaq({
      ...base,
      faq: [{ pregunta: "Duele?", respuesta: "Usamos anestesia local." }],
    });
    expect(html).toContain("wf-faq");
    expect(html).toContain("<details");
    expect(html).toContain("<summary");
    expect(html).toContain("Duele?");
    expect(html).toContain("Usamos anestesia local.");
  });

  it("returns empty string when faq is empty", () => {
    expect(renderFaq(base)).toBe("");
  });

  it("escapes HTML", () => {
    const html = renderFaq({ ...base, faq: [{ pregunta: "<i>x</i>", respuesta: "r" }] });
    expect(html).not.toContain("<i>x</i>");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/faq.test.ts`
Expected: FAIL (Cannot find module `./faq`).

- [ ] **Step 3: Implement the block**

Create `web-factory/packages/blocks/src/faq.ts`:

```ts
import { escapeHtml } from "./escape";
import type { SiteClient } from "./types";

// Objection handling: native <details> is keyboard-accessible with zero JS,
// which keeps the static output light and passes a11y out of the box.
export function renderFaq(client: SiteClient): string {
  const items = client.faq ?? [];
  if (items.length === 0) return "";

  const rows = items
    .map(
      (item) => `
        <details class="wf-faq-item">
          <summary class="wf-faq-question">${escapeHtml(item.pregunta)}</summary>
          <p class="wf-faq-answer">${escapeHtml(item.respuesta)}</p>
        </details>
      `,
    )
    .join("");

  return `
    <section class="wf-section wf-faq" id="preguntas" aria-labelledby="wf-faq-heading">
      <div class="wf-section-heading">
        <p class="wf-kicker">Preguntas frecuentes</p>
        <h2 id="wf-faq-heading">Lo que la gente pregunta antes de venir</h2>
      </div>
      <div class="wf-faq-list">
        ${rows}
      </div>
    </section>
  `;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/faq.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add web-factory/packages/blocks/src/faq.ts web-factory/packages/blocks/src/faq.test.ts
git commit -m "feat(web-factory): add faq block"
```

---

### Task 5: Sticky WhatsApp CTA block

**Files:**
- Create: `web-factory/packages/blocks/src/sticky-cta.ts`
- Test: `web-factory/packages/blocks/src/sticky-cta.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { renderStickyCta } from "./sticky-cta";

const base = {
  nombre: "Aura", tagline: "t", descripcion: "d", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "Agendar cita", url: "https://wa.me/59170000000" },
} as const;

describe("renderStickyCta", () => {
  it("renders a fixed CTA pointing at the real channel", () => {
    const html = renderStickyCta(base);
    expect(html).toContain("wf-sticky-cta");
    expect(html).toContain("https://wa.me/59170000000");
    expect(html).toContain("Agendar cita");
    expect(html).toContain("aria-label");
  });

  it("returns empty string when the CTA url is missing", () => {
    expect(renderStickyCta({ ...base, cta: { texto: "x", url: "" } })).toBe("");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/sticky-cta.test.ts`
Expected: FAIL (Cannot find module `./sticky-cta`).

- [ ] **Step 3: Implement the block**

Create `web-factory/packages/blocks/src/sticky-cta.ts`:

```ts
import { escapeAttribute, escapeHtml } from "./escape";
import type { SiteClient } from "./types";

// Persistent conversion anchor for WhatsApp/social traffic. CSS-only (position
// fixed); on mobile it stays reachable while scrolling long content.
export function renderStickyCta(client: SiteClient): string {
  if (!client.cta.url.trim()) return "";
  return `
    <a class="wf-sticky-cta" href="${escapeAttribute(client.cta.url)}"
       aria-label="${escapeAttribute(client.cta.texto)}">
      <span>${escapeHtml(client.cta.texto)}</span>
    </a>
  `;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/sticky-cta.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add web-factory/packages/blocks/src/sticky-cta.ts web-factory/packages/blocks/src/sticky-cta.test.ts
git commit -m "feat(web-factory): add sticky whatsapp cta block"
```

---

### Task 6: Enrich hero trust panel with real data

**Files:**
- Modify: `web-factory/packages/blocks/src/hero.ts:46-53`
- Test: `web-factory/packages/blocks/src/hero.test.ts` (create)

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { renderHero } from "./hero";

const base = {
  nombre: "Aura", tagline: "Sonrisas sanas", descripcion: "Clinica dental.", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "La Paz" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "Agendar cita", url: "https://wa.me/1" },
} as const;

describe("renderHero trust panel", () => {
  it("uses credenciales in the proof panel when present", () => {
    const html = renderHero({ ...base, credenciales: ["Matricula profesional"] }, { focus: true });
    expect(html).toContain("Matricula profesional");
  });

  it("still renders when there is no credential data (backward compatible)", () => {
    const html = renderHero(base, { focus: true });
    expect(html).toContain("wf-proof-panel");
    expect(html).toContain("Agendar cita");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/hero.test.ts`
Expected: FAIL (credential text not in output).

- [ ] **Step 3: Replace the hardcoded proof copy with data-driven content**

In `web-factory/packages/blocks/src/hero.ts`, replace the `.wf-proof-copy` block (lines ~48-52) with:

```ts
          <div class="wf-proof-copy">
            <span class="wf-proof-label">Por que elegirnos</span>
            ${renderProofPoints(client)}
          </div>
```

Then add this helper at the bottom of the file (before/after `renderHeroPoster`):

```ts
function renderProofPoints(client: SiteClient): string {
  const points = (client.credenciales?.length ? client.credenciales : client.beneficios ?? [])
    .filter((point) => point.trim().length > 0)
    .slice(0, 4);

  if (points.length === 0) {
    return `<strong>Atencion clara y contacto directo.</strong>
      <p>Una primera impresion ordenada para que cada visita se vuelva conversacion.</p>`;
  }

  const list = points.map((point) => `<li>${escapeHtml(point)}</li>`).join("");
  return `<ul class="wf-proof-points">${list}</ul>`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/hero.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 5: Run the full unit suite to confirm no regression**

Run: `cd web-factory && pnpm test`
Expected: PASS (existing generate/store/dashboard tests still green; the hero copy change does not break them since they assert on other strings).

- [ ] **Step 6: Commit**

```bash
git add web-factory/packages/blocks/src/hero.ts web-factory/packages/blocks/src/hero.test.ts
git commit -m "feat(web-factory): drive hero proof panel from client data"
```

---

### Task 7: Export new blocks

**Files:**
- Modify: `web-factory/packages/blocks/src/index.ts`

- [ ] **Step 1: Add exports**

Replace `web-factory/packages/blocks/src/index.ts` contents with:

```ts
export { escapeAttribute, escapeHtml } from "./escape";
export { renderFeatures } from "./features";
export { renderFooter, type FooterOptions } from "./footer";
export { renderHero, type HeroOptions } from "./hero";
export { renderTrust } from "./trust";
export { renderProcess } from "./process";
export { renderFaq } from "./faq";
export { renderStickyCta } from "./sticky-cta";
export type { SiteClient } from "./types";
```

- [ ] **Step 2: Typecheck the package build path via the unit suite**

Run: `cd web-factory && pnpm test`
Expected: PASS (imports resolve).

- [ ] **Step 3: Commit**

```bash
git add web-factory/packages/blocks/src/index.ts
git commit -m "chore(web-factory): export clinic blocks"
```

---

### Task 8: `landing-clinic` template (compose + CSS)

**Files:**
- Create: `web-factory/packages/templates/src/landing-clinic.ts`
- Modify: `web-factory/packages/templates/src/index.ts`
- Test: covered by Task 9's generator test (renders via `generateSite`).

- [ ] **Step 1: Implement the template**

Create `web-factory/packages/templates/src/landing-clinic.ts`:

```ts
import {
  escapeAttribute,
  escapeHtml,
  renderFaq,
  renderFeatures,
  renderFooter,
  renderHero,
  renderProcess,
  renderStickyCta,
  renderTrust,
} from "@onia/blocks";
import { renderLandingCss, type LandingClient } from "./landing";

// Clinic/Health vertical (Pattern Bank "Fast Landing"): hero -> trust -> offer
// -> process -> faq -> final CTA, plus a persistent WhatsApp CTA. Focus hero
// (no nav) keeps a single conversion intent. Reuses landing CSS + clinic CSS.
function renderFinalCta(client: LandingClient): string {
  return `
    <section class="wf-final-cta" aria-labelledby="wf-final-cta-heading">
      <h2 id="wf-final-cta-heading">${escapeHtml(client.tagline)}</h2>
      <a class="wf-button-primary" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>
    </section>
  `;
}

export function renderLandingClinicBody(client: LandingClient): string {
  return `
    <main class="wf-page wf-page--focus wf-page--clinic" id="top">
      ${renderHero(client, { focus: true })}
      ${renderTrust(client)}
      ${renderFeatures(client)}
      ${renderProcess(client)}
      ${renderFaq(client)}
      ${renderFinalCta(client)}
      ${renderFooter(client, { minimal: true })}
    </main>
    ${renderStickyCta(client)}
  `;
}

export function renderLandingClinicCss(client: LandingClient): string {
  return `${renderLandingCss(client)}

${clinicExtraCss}`;
}

export function renderLandingClinicDocument(client: LandingClient): string {
  const ogImage = client.seo.ogImage
    ? `<meta property="og:image" content="${escapeHtml(client.seo.ogImage)}">`
    : "";

  return `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(client.seo.title)}</title>
    <meta name="description" content="${escapeHtml(client.seo.description)}">
    <meta property="og:title" content="${escapeHtml(client.seo.title)}">
    <meta property="og:description" content="${escapeHtml(client.seo.description)}">
    ${ogImage}
    <link rel="stylesheet" href="./site.css">
  </head>
  <body>
    ${renderLandingClinicBody(client)}
  </body>
</html>
`;
}

// Clinic-specific styles. Tokens only, no hardcoded client colors. Motion is
// minimal (Pattern Bank motion=2) and respects prefers-reduced-motion.
const clinicExtraCss = `
.wf-proof-points {
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}

.wf-proof-points li {
  position: relative;
  padding-left: 26px;
  color: color-mix(in srgb, var(--color-fg) 82%, var(--color-bg));
  line-height: 1.5;
}

.wf-proof-points li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 7px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--color-primary);
}

.wf-trust {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: 20px 0 4px;
}

.wf-trust-list {
  margin: 0;
  padding: 18px 22px;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px 24px;
  border: 1px solid color-mix(in srgb, var(--color-fg) 12%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-bg) 88%, transparent);
}

.wf-trust-item {
  position: relative;
  padding-left: 24px;
  font-weight: 650;
  color: var(--color-secondary);
}

.wf-trust-item::before {
  content: "";
  position: absolute;
  left: 0;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--color-accent) 70%, var(--color-primary));
}

.wf-process-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  counter-reset: none;
}

.wf-process-step {
  padding: 22px;
  border: 1px solid color-mix(in srgb, var(--color-fg) 12%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-bg) 92%, transparent);
}

.wf-process-number {
  color: var(--color-primary);
  font-weight: 850;
  font-size: 0.9rem;
  letter-spacing: 0;
}

.wf-process-title {
  margin: 8px 0 6px;
  color: var(--color-secondary);
  font-size: 1.2rem;
}

.wf-faq-list {
  display: grid;
  gap: 10px;
  max-width: 820px;
}

.wf-faq-item {
  border: 1px solid color-mix(in srgb, var(--color-fg) 12%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--color-bg) 92%, transparent);
  overflow: hidden;
}

.wf-faq-question {
  padding: 16px 20px;
  cursor: pointer;
  font-weight: 700;
  color: var(--color-secondary);
  list-style: none;
}

.wf-faq-question::-webkit-details-marker { display: none; }

.wf-faq-question::after {
  content: "+";
  float: right;
  color: var(--color-primary);
  font-weight: 850;
}

.wf-faq-item[open] .wf-faq-question::after { content: "\\2212"; }

.wf-faq-answer {
  margin: 0;
  padding: 0 20px 18px;
  color: color-mix(in srgb, var(--color-fg) 72%, var(--color-bg));
  line-height: 1.6;
}

.wf-sticky-cta {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 50;
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 20px;
  border-radius: 999px;
  font-weight: 800;
  color: var(--color-on-primary);
  background: var(--color-primary);
  box-shadow: 0 14px 34px color-mix(in srgb, var(--color-primary) 34%, transparent);
}

@media (min-width: 841px) {
  .wf-sticky-cta { right: 24px; bottom: 24px; }
}

@media (prefers-reduced-motion: no-preference) {
  .wf-sticky-cta { transition: transform var(--duration-fast, 150ms) ease; }
  .wf-sticky-cta:hover { transform: translateY(-2px); }
}
`;
```

- [ ] **Step 2: Export from the templates barrel**

In `web-factory/packages/templates/src/index.ts`, append:

```ts
export {
  renderLandingClinicBody,
  renderLandingClinicCss,
  renderLandingClinicDocument,
} from "./landing-clinic";
```

- [ ] **Step 3: Commit**

```bash
git add web-factory/packages/templates/src/landing-clinic.ts web-factory/packages/templates/src/index.ts
git commit -m "feat(web-factory): add landing-clinic template"
```

---

### Task 9: Register `landing-clinic` in the generator

**Files:**
- Modify: `web-factory/generate/generate.ts:8-64`
- Test: `web-factory/generate/generate.test.ts` (add a case)

- [ ] **Step 1: Write the failing test**

Add to `web-factory/generate/generate.test.ts` inside the `describe("generateSite")` block:

```ts
  it("creates a clinic landing with trust, process, faq and sticky cta", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "clinic.json"),
      JSON.stringify({
        nombre: "Clinica Dental Aura",
        slug: "clinic",
        tagline: "Sonrisas sanas, sin miedo al dentista",
        descripcion: "Clinica dental con atencion clara y reserva directa.",
        cta: { texto: "Agendar cita", url: "https://wa.me/59170000000" },
        credenciales: ["Matricula profesional", "Esterilizacion certificada"],
        proceso: [
          { titulo: "Agenda", desc: "Escribinos por WhatsApp." },
          { titulo: "Evaluacion", desc: "Revisamos tu caso." },
        ],
        faq: [{ pregunta: "Duele?", respuesta: "Trabajamos con anestesia local." }],
      }),
      "utf8",
    );

    const result = await generateSite("clinic", { rootDir, template: "landing-clinic" });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");

    expect(html).toContain("wf-trust");
    expect(html).toContain("Matricula profesional");
    expect(html).toContain("wf-process");
    expect(html).toContain("wf-faq");
    expect(html).toContain("<details");
    expect(html).toContain("wf-sticky-cta");
    expect(html).toContain("wf-final-cta");
    expect(html).not.toContain("wf-nav"); // focus hero, no nav
    expect(css).toContain(".wf-sticky-cta");
    expect(css).toContain(".wf-faq-item");
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run generate/generate.test.ts`
Expected: FAIL (`Unsupported template "landing-clinic"`).

- [ ] **Step 3: Wire the template into the generator**

In `web-factory/generate/generate.ts`:

Add the import (top, with the other template imports):

```ts
  renderLandingClinicCss,
  renderLandingClinicDocument,
```

Extend the `template` union (line ~19):

```ts
  template?: "landing" | "store" | "dashboard" | "landing-focus" | "landing-clinic";
```

Extend the validation list (line ~41):

```ts
  if (!["landing", "store", "dashboard", "landing-focus", "landing-clinic"].includes(template)) {
    throw new Error(`Unsupported template "${template}". Available: landing, store, dashboard, landing-focus, landing-clinic.`);
  }
```

Extend the html selection (line ~51):

```ts
  const html =
    template === "store"
      ? renderStoreDocument(client)
      : template === "dashboard"
        ? renderDashboardDocument(client)
        : template === "landing-focus"
          ? renderLandingFocusDocument(client)
          : template === "landing-clinic"
            ? renderLandingClinicDocument(client)
            : renderLandingDocument(client);
```

Extend the css selection (line ~59):

```ts
  const css =
    template === "store"
      ? renderStoreCss(client)
      : template === "dashboard"
        ? renderDashboardCss(client)
        : template === "landing-clinic"
          ? renderLandingClinicCss(client)
          : renderLandingCss(client);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run generate/generate.test.ts`
Expected: PASS (new case + all existing cases).

- [ ] **Step 5: Commit**

```bash
git add web-factory/generate/generate.ts web-factory/generate/generate.test.ts
git commit -m "feat(web-factory): register landing-clinic template in generator"
```

---

### Task 10: Dental demo data + hero asset

**Files:**
- Create: `web-factory/data/clients/dental-demo.json`
- Create: `web-factory/data/clients/dental-demo.context.md`
- Create: `web-factory/data/clients/dental-demo.assets/dental-hero.svg`
- Create: `web-factory/data/intakes/dental-demo.json` (source-of-truth brief; not required by generate)

- [ ] **Step 1: Create the hero asset**

Create `web-factory/data/clients/dental-demo.assets/dental-hero.svg` — a light synthetic clinic-room scene (<15kb, no faces). Minimal example (replace with a richer scene during build, keep <15kb):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="Ambiente de consultorio dental (demo)">
  <rect width="800" height="600" fill="#eef4fb"/>
  <rect x="60" y="380" width="680" height="180" rx="16" fill="#dbe9f7"/>
  <circle cx="400" cy="230" r="120" fill="#bfe3e0"/>
  <rect x="330" y="120" width="140" height="60" rx="12" fill="#ffffff"/>
  <text x="400" y="560" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#4a5568">demo</text>
</svg>
```

- [ ] **Step 2: Create the client profile**

Create `web-factory/data/clients/dental-demo.json`:

```json
{
  "nombre": "Clinica Dental Aura",
  "slug": "dental-demo",
  "tagline": "Sonrisas sanas, sin miedo al dentista",
  "descripcion": "Clinica dental con atencion clara, trato humano y reserva directa por WhatsApp.",
  "logo": "AU",
  "heroPoster": "assets/dental-hero.svg",
  "colores": {
    "primary": "#0369a1",
    "secondary": "#0f172a",
    "accent": "#14b8a6",
    "bg": "#f6fafd",
    "fg": "#0f172a"
  },
  "tipografia": { "heading": "Onest", "body": "Onest" },
  "contacto": { "email": "", "tel": "", "whatsapp": "+59170000000", "direccion": "La Paz, Bolivia" },
  "redes": { "ig": "", "fb": "", "linkedin": "", "x": "" },
  "servicios": [
    { "titulo": "Limpieza y prevencion", "desc": "Control, profilaxis y guia de higiene para mantener tu boca sana.", "icono": "sparkles" },
    { "titulo": "Ortodoncia", "desc": "Brackets y alineadores con plan claro y seguimiento.", "icono": "smile" },
    { "titulo": "Implantes", "desc": "Reemplazo de piezas con evaluacion y opciones de pago.", "icono": "tooth" },
    { "titulo": "Blanqueamiento", "desc": "Aclarado seguro supervisado por profesional.", "icono": "star" },
    { "titulo": "Endodoncia", "desc": "Tratamiento de conducto para calmar el dolor y salvar la pieza.", "icono": "shield" },
    { "titulo": "Urgencias", "desc": "Atencion el mismo dia para dolor o golpes.", "icono": "alert" }
  ],
  "beneficios": ["Trato humano", "Reserva directa", "Planes de pago"],
  "credenciales": ["Matricula profesional", "Esterilizacion por ciclo certificada", "Atencion de urgencias el mismo dia"],
  "proceso": [
    { "titulo": "Agenda", "desc": "Escribinos por WhatsApp y elegimos horario." },
    { "titulo": "Evaluacion", "desc": "Revisamos tu caso y explicamos opciones sin letra chica." },
    { "titulo": "Plan y presupuesto", "desc": "Te damos un plan claro con costos y tiempos." },
    { "titulo": "Tratamiento y control", "desc": "Hacemos el trabajo y agendamos el seguimiento." }
  ],
  "faq": [
    { "pregunta": "Duele el tratamiento?", "respuesta": "Trabajamos con anestesia local y tecnicas de manejo del dolor para que estes comodo." },
    { "pregunta": "Cuanto cuesta la primera consulta?", "respuesta": "La evaluacion inicial es corta y te damos el presupuesto antes de empezar cualquier tratamiento." },
    { "pregunta": "Atienden urgencias?", "respuesta": "Si, reservamos espacio para urgencias el mismo dia cuando hay dolor o un golpe." },
    { "pregunta": "Que formas de pago aceptan?", "respuesta": "Coordinamos opciones y planes de pago segun el tratamiento." }
  ],
  "cta": { "texto": "Agendar cita", "url": "https://wa.me/59170000000?text=Hola%2C%20quiero%20agendar%20una%20cita." },
  "seo": {
    "title": "Clinica Dental Aura | agenda tu cita sin miedo al dentista",
    "description": "Clinica dental con atencion clara, trato humano y reserva directa por WhatsApp. Limpieza, ortodoncia, implantes y urgencias.",
    "ogImage": ""
  }
}
```

- [ ] **Step 3: Create the context file (demo markers + real-client TODOs)**

Create `web-factory/data/clients/dental-demo.context.md`:

```markdown
# Clinica Dental Aura (demo) - Web Factory Context

## Brief
- Slug: `dental-demo`
- Template: `landing-clinic`
- Rubro: clinica dental (captacion de pacientes)
- Objetivo: agendar cita por WhatsApp
- Responsable: ONIA
- Paquete: web

## Media
- Permiso de assets: generate-ai
- Hero: assets/dental-hero.svg (SVG sintetico demo, sin caras)
- Notas: DEMO INTERNA. Para cliente real, reemplazar por foto de consultorio/equipo
  y no usar retratos de doctor generados como si fueran reales.

## Datos demo (reemplazar en cliente real)
- WhatsApp +59170000000 es placeholder.
- Credenciales y numeros son de ejemplo; usar los reales y verificables.

## Pendientes antes de entrega (cliente real)
- Foto real de consultorio/equipo y matricula visible.
- Politica de datos personales / disclaimers de salud.
- Dominio + hosting a nombre del cliente.
- Reseñas reales aprobadas (activar bloque reviews).
```

- [ ] **Step 4: Create the intake (brief source of truth)**

Create `web-factory/data/intakes/dental-demo.json` mirroring the `clinic-demo.json` intake shape, with `project.template = "landing-clinic"`, the business/brand/content above, and `operations.missing` listing the real-client TODOs. (Not consumed by `generate`; documents the brief. Copy the structure from `web-factory/data/intakes/clinic-demo.json` and fill dental values.)

- [ ] **Step 5: Generate and eyeball the output**

Run: `cd web-factory && pnpm generate dental-demo --template landing-clinic`
Expected: writes `out/dental-demo/index.html` + `site.css` + copies `assets/dental-hero.svg`. Open and confirm all sections render.

- [ ] **Step 6: Commit**

```bash
git add web-factory/data/clients/dental-demo.json web-factory/data/clients/dental-demo.context.md web-factory/data/clients/dental-demo.assets web-factory/data/intakes/dental-demo.json
git commit -m "feat(web-factory): add dental-demo clinic vertical data"
```

---

### Task 11: Wire dental-demo into the e2e suite

**Files:**
- Modify: `web-factory/tests/e2e/global-setup.ts:12-17`
- Modify: `web-factory/tests/e2e/a11y.spec.ts:19-24`
- Modify: `web-factory/tests/e2e/perf.spec.ts:15-20`
- Create: `web-factory/tests/e2e/landing-clinic.spec.ts`

- [ ] **Step 1: Generate dental-demo in global setup**

In `web-factory/tests/e2e/global-setup.ts`, add inside `globalSetup`:

```ts
  await generateSite("dental-demo", { rootDir, template: "landing-clinic" });
```

- [ ] **Step 2: Add the page to the a11y matrix**

In `web-factory/tests/e2e/a11y.spec.ts`, add to the `PAGES` array:

```ts
  { name: "landing-clinic (dental-demo)", url: "/dental-demo/", schemes: ["light", "dark"] as const },
```

- [ ] **Step 3: Add the page to the perf matrix**

In `web-factory/tests/e2e/perf.spec.ts`, add to the `PAGES` array:

```ts
  { name: "landing-clinic (dental-demo)", url: "/dental-demo/", maxBytesKb: 60 },
```

- [ ] **Step 4: Write the functional structure spec**

Create `web-factory/tests/e2e/landing-clinic.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.describe("landing-clinic preview (dental-demo)", () => {
  test("shows business, offer and a real booking CTA in the hero", async ({ page }) => {
    await page.goto("/dental-demo/");
    await expect(page.locator(".wf-hero")).toBeVisible();
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
    await expect(heading).not.toBeEmpty();

    const cta = page.locator(".wf-hero a[href]").first();
    const href = await cta.getAttribute("href");
    expect(href).toContain("wa.me");
  });

  test("renders trust, services, process and faq sections", async ({ page }) => {
    await page.goto("/dental-demo/");
    await expect(page.locator(".wf-trust")).toBeVisible();
    await expect(page.locator("#servicios")).toBeVisible();
    await expect(page.locator("#proceso")).toBeVisible();
    await expect(page.locator(".wf-faq details").first()).toBeVisible();
  });

  test("keeps a persistent whatsapp cta", async ({ page }) => {
    await page.goto("/dental-demo/");
    const sticky = page.locator(".wf-sticky-cta");
    await expect(sticky).toBeVisible();
    const href = await sticky.getAttribute("href");
    expect(href).toContain("wa.me");
  });

  test("no broken same-origin assets", async ({ page }) => {
    const failed: string[] = [];
    page.on("requestfailed", (request) => {
      const kind = request.resourceType();
      if (kind === "image" || kind === "stylesheet") failed.push(`${kind} ${request.url()}`);
    });
    const response = await page.goto("/dental-demo/");
    expect(response?.ok()).toBeTruthy();
    await page.waitForLoadState("networkidle");
    expect(failed, `broken assets: ${failed.join(", ")}`).toEqual([]);
  });
});
```

- [ ] **Step 5: Run the e2e suite**

Run: `cd web-factory && pnpm e2e`
Expected: PASS. If a11y flags serious/critical (likely contrast), adjust demo `colores` in `dental-demo.json` until light+dark pass. If perf > 60kb, shrink `dental-hero.svg` / trim CSS.

- [ ] **Step 6: Commit**

```bash
git add web-factory/tests/e2e/global-setup.ts web-factory/tests/e2e/a11y.spec.ts web-factory/tests/e2e/perf.spec.ts web-factory/tests/e2e/landing-clinic.spec.ts
git commit -m "test(web-factory): cover dental-demo landing-clinic in e2e"
```

---

### Task 12: Add dental-demo to `factory:smoke` (ROOT FILE — advised)

**Files:**
- Modify: `web-factory/package.json:15` (the `factory:smoke` script)

- [ ] **Step 1: Append the clinic generation to the smoke script**

In `web-factory/package.json`, at the end of the `factory:smoke` value, append:

```
 && pnpm generate dental-demo --template landing-clinic
```

Full line becomes (`... && pnpm generate dashboard-demo --template dashboard && pnpm generate dental-demo --template landing-clinic`).

- [ ] **Step 2: Run the smoke**

Run: `cd web-factory && pnpm factory:smoke`
Expected: unit tests pass and every demo (including dental-demo) generates without error.

- [ ] **Step 3: Commit**

```bash
git add web-factory/package.json
git commit -m "chore(web-factory): add dental-demo to factory smoke"
```

---

### Task 13: Final gate + visual proof

- [ ] **Step 1: Full unit suite**

Run: `cd web-factory && pnpm test`
Expected: all green.

- [ ] **Step 2: Full e2e (a11y + visual + performance)**

Run: `cd web-factory && pnpm e2e`
Expected: all green across chromium, mobile, chromium-measure, mobile-measure.

- [ ] **Step 3: Visual proof via preview tools**

Serve `out/` and screenshot `/dental-demo/` at mobile (375) and desktop (1280); confirm hero, trust, services, process, faq, final CTA and sticky CTA render, light and dark. Share the screenshot with the user.

- [ ] **Step 4: Final commit if anything was tuned**

```bash
git add -A web-factory
git commit -m "chore(web-factory): finalize dental-demo vertical landing"
```

---

## Self-Review

**Spec coverage:** hero (T6/T8), trust (T2), services (existing features, T8), process (T3), faq (T4), final CTA + sticky (T5/T8), schema fields (T1), template (T8), generator (T9), demo data + asset (T10), gates a11y/visual/perf (T11), smoke (T12), no-fake-data guardrails (T10 context). All spec sections map to tasks.

**Placeholder scan:** every code step ships real code; test steps have full assertions; commands are exact. The only intentionally-summarized item is the intake JSON (T10 S4) — its shape is defined by copying an existing file (`clinic-demo.json` intake) and is not consumed by `generate`, so it carries no execution risk.

**Type consistency:** `SiteClient` optional fields (`credenciales`, `proceso[{titulo,desc}]`, `faq[{pregunta,respuesta}]`, `beneficios`) are used identically in T2–T6, the zod schema (T1) matches them, and `renderLandingClinic{Body,Css,Document}` names are consistent across T8/T9. Block render fn names (`renderTrust/renderProcess/renderFaq/renderStickyCta`) match their exports (T7) and imports (T8).

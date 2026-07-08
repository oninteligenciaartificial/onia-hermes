# Landing Realty Vertical Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a second Web Factory landing vertical (real-estate multi-listing agency) with a genuinely different UI from landing-clinic — cinematic photo hero with a floating search panel, a cropped-wordmark editorial break, and photo-first property cards — while reusing the generic, already-proven blocks (process timeline, marquee, footer, sticky CTA).

**Architecture:** New `realty-*` blocks in `packages/blocks/src/`, a new `landing-realty` template in `packages/templates/src/`, new optional `SiteClient`/Zod fields (`listings`, `zonas`, `wordmarkBreak`). Two small generalization fixes to existing blocks (`renderProcess`'s hardcoded copy, `renderMarquee`'s `wf-clinic-*` class names) since this plan is the first real proof that those blocks need to be vertical-agnostic.

**Tech Stack:** TypeScript, Zod, vitest, Playwright + axe-core, pure CSS (tokens-only), pnpm workspaces.

**Spec:** `docs/superpowers/specs/2026-07-08-landing-realty-vertical-design.md`

**Boundary rule:** Only `web-factory/**`, never `store.ts` or `src/app/onia-center/**`. Task 15 touches `web-factory/package.json` (a factory root file) — already advised this session.

---

### Task 1: Generalize `renderProcess`'s hardcoded copy

**Files:**
- Modify: `web-factory/packages/blocks/src/process.ts`
- Modify: `web-factory/packages/blocks/src/types.ts`
- Test: `web-factory/packages/blocks/src/process.test.ts`

`renderProcess` currently hardcodes "Como funciona" / "De tu mensaje a tu cita, sin vueltas" (dental-specific: "cita" = appointment). Reusing it for real estate would leak clinic copy into an agency page — the same bug class already fixed once for the hero variants this session.

- [ ] **Step 1: Write the failing test**

Read the current file first (`web-factory/packages/blocks/src/process.test.ts`) to see the existing fixture shape, then add this case to its `describe` block:

```ts
  it("uses process copy overrides when provided (generalization)", () => {
    const html = renderProcess({
      ...base,
      proceso: [{ titulo: "Contacto", desc: "Nos escribis por WhatsApp." }],
      procesoKicker: "Como comprar",
      procesoTitulo: "De tu consulta a la firma, sin vueltas",
    });
    expect(html).toContain("Como comprar");
    expect(html).toContain("De tu consulta a la firma, sin vueltas");
    expect(html).not.toContain("Como funciona");
    expect(html).not.toContain("De tu mensaje a tu cita");
  });

  it("still defaults to the clinic copy when no override is given (backward compatible)", () => {
    const html = renderProcess({ ...base, proceso: [{ titulo: "Agenda", desc: "d" }] });
    expect(html).toContain("Como funciona");
    expect(html).toContain("De tu mensaje a tu cita, sin vueltas");
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/process.test.ts`
Expected: FAIL (`procesoKicker`/`procesoTitulo` not recognized, default-copy test may pass but the override test fails since the fields don't exist yet on the type / aren't read).

- [ ] **Step 3: Add the fields to `SiteClient`**

In `web-factory/packages/blocks/src/types.ts`, add next to `proceso`:

```ts
  proceso?: Array<{ titulo: string; desc: string }>;
  procesoKicker?: string;
  procesoTitulo?: string;
```

- [ ] **Step 4: Read the overrides in `renderProcess`**

In `web-factory/packages/blocks/src/process.ts`, change the JSX-like template:

```ts
export function renderProcess(client: SiteClient): string {
  const steps = client.proceso ?? [];
  if (steps.length === 0) return "";

  const kicker = client.procesoKicker ?? "Como funciona";
  const titulo = client.procesoTitulo ?? "De tu mensaje a tu cita, sin vueltas";

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
        <p class="wf-kicker">${escapeHtml(kicker)}</p>
        <h2 id="wf-process-heading">${escapeHtml(titulo)}</h2>
      </div>
      <ol class="wf-process-list">
        ${items}
      </ol>
    </section>
  `;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/process.test.ts`
Expected: PASS (all cases, including pre-existing ones — unaffected since defaults match old hardcoded text).

- [ ] **Step 6: Run the full unit suite to confirm no regressions**

Run: `cd web-factory && pnpm test`
Expected: PASS (landing-clinic's existing usage of `renderProcess` doesn't pass `procesoKicker`/`procesoTitulo`, so it keeps the dental default text unchanged).

- [ ] **Step 7: Commit**

```bash
git add web-factory/packages/blocks/src/process.ts web-factory/packages/blocks/src/process.test.ts web-factory/packages/blocks/src/types.ts
git commit -m "feat(web-factory): parametrize renderProcess copy (generalize for reuse outside dental)"
```

---

### Task 2: Rename marquee CSS classes from `wf-clinic-marquee*` to `wf-marquee*`

**Files:**
- Modify: `web-factory/packages/blocks/src/marquee.ts`
- Modify: `web-factory/packages/blocks/src/marquee.test.ts`
- Modify: `web-factory/packages/templates/src/clinic-css.ts`

`renderMarquee`'s copy is already generic, but its CSS classes are prefixed `wf-clinic-marquee*`, which is misleading now that this session is reusing it in a non-clinic vertical. Mechanical rename, single component, low risk.

- [ ] **Step 1: Update the failing assertions**

Read `web-factory/packages/blocks/src/marquee.test.ts` first, then replace every `wf-clinic-marquee` string in its assertions with `wf-marquee`:

```ts
import { describe, expect, it } from "vitest";
import { renderMarquee } from "./marquee";

describe("renderMarquee", () => {
  it("renders items and a duplicated aria-hidden set for a seamless loop", () => {
    const html = renderMarquee(["Matricula profesional", "Urgencias"], { label: "Sellos" });
    expect(html).toContain("wf-marquee");
    expect(html).toContain("wf-marquee-track");
    expect(html).toContain('aria-label="Sellos"');
    expect((html.match(/wf-marquee-item/g) ?? []).length).toBe(4);
    expect((html.match(/aria-hidden="true"/g) ?? []).length).toBe(2);
  });

  it("returns empty string when there are no items", () => {
    expect(renderMarquee([])).toBe("");
    expect(renderMarquee(["", "   "])).toBe("");
  });

  it("escapes HTML in items", () => {
    const html = renderMarquee(["<script>x</script>"]);
    expect(html).not.toContain("<script>x</script>");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/marquee.test.ts`
Expected: FAIL (`wf-marquee` not found, current output still says `wf-clinic-marquee`).

- [ ] **Step 3: Rename the classes in the implementation**

In `web-factory/packages/blocks/src/marquee.ts`, replace all 3 occurrences of `wf-clinic-marquee` with `wf-marquee`:

```ts
import { escapeAttribute, escapeHtml } from "./escape";
import { renderIcon } from "./icons";

// Reusable marquee: a continuous horizontal ticker (seals, logos, reviews). The
// item set is duplicated for a seamless loop; the second copy is aria-hidden so
// screen readers read it once. Pauses on hover; reduced-motion falls back to a
// static wrapped row (no infinite motion).
export function renderMarquee(
  items: string[],
  opts: { icon?: string; label?: string } = {},
): string {
  const clean = items.map((item) => item.trim()).filter(Boolean);
  if (clean.length === 0) return "";

  const icon = opts.icon ?? "check";
  const renderSet = (hidden: boolean): string =>
    clean
      .map(
        (item) =>
          `<span class="wf-marquee-item"${hidden ? ' aria-hidden="true"' : ""}>${renderIcon(icon, "wf-icon")}<span>${escapeHtml(item)}</span></span>`,
      )
      .join("");

  const label = opts.label ? ` aria-label="${escapeAttribute(opts.label)}"` : "";
  return `
    <div class="wf-marquee"${label}>
      <div class="wf-marquee-track">${renderSet(false)}${renderSet(true)}</div>
    </div>
  `;
}
```

- [ ] **Step 4: Update the CSS selectors that style it**

In `web-factory/packages/templates/src/clinic-css.ts`, find the marquee CSS block (selectors `.wf-clinic-marquee`, `.wf-clinic-marquee-track`, `.wf-clinic-marquee-item`) and rename all 3 selectors to `.wf-marquee`, `.wf-marquee-track`, `.wf-marquee-item` (keep the declarations/rules unchanged, only the selector names change).

- [ ] **Step 5: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/marquee.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Run the full unit suite + regenerate dental-demo to confirm the CSS rename didn't break the existing marquee visually**

Run: `cd web-factory && pnpm test && pnpm generate dental-demo --template landing-clinic`
Expected: unit suite PASS; generate succeeds. Then check the marquee still renders with styling:

Run: `grep -c "wf-marquee" web-factory/out/dental-demo/index.html web-factory/out/dental-demo/site.css`
Expected: non-zero counts in both files (class present in HTML and styled in CSS).

- [ ] **Step 7: Commit**

```bash
git add web-factory/packages/blocks/src/marquee.ts web-factory/packages/blocks/src/marquee.test.ts web-factory/packages/templates/src/clinic-css.ts
git commit -m "refactor(web-factory): rename wf-clinic-marquee* to wf-marquee* (generic, reused outside dental)"
```

---

### Task 3: Schema + types for listings/zonas/wordmarkBreak

**Files:**
- Modify: `web-factory/data/schema.ts`
- Modify: `web-factory/packages/blocks/src/types.ts`
- Test: `web-factory/data/schema.test.ts`

- [ ] **Step 1: Write the failing test**

Read `web-factory/data/schema.test.ts` first, then append this `describe` block at the end of the file:

```ts
describe("clientSchema realty fields", () => {
  it("parses listings, zonas and wordmarkBreak when present", () => {
    const parsed = clientSchema.parse({
      nombre: "Terra Propiedades",
      slug: "terra",
      tagline: "Encontra tu proximo lugar",
      descripcion: "Agencia inmobiliaria.",
      wordmarkBreak: "TERRA",
      zonas: ["Zona Sur", "Centro"],
      listings: [
        {
          titulo: "Casa 3 dormitorios en Zona Sur",
          precio: "USD 145.000",
          zona: "Zona Sur",
          tipo: "Casa",
          operacion: "venta",
          dormitorios: 3,
          banos: 2,
          imagen: "assets/listing-1.webp",
          imagenAlt: "Fachada de casa en Zona Sur",
          destacado: true,
        },
      ],
    });
    expect(parsed.wordmarkBreak).toBe("TERRA");
    expect(parsed.zonas).toEqual(["Zona Sur", "Centro"]);
    expect(parsed.listings[0].operacion).toBe("venta");
    expect(parsed.listings[0].destacado).toBe(true);
  });

  it("defaults realty fields to empty when absent", () => {
    const parsed = clientSchema.parse({
      nombre: "Terra Propiedades",
      slug: "terra",
      tagline: "t",
      descripcion: "d",
    });
    expect(parsed.wordmarkBreak).toBe("");
    expect(parsed.zonas).toEqual([]);
    expect(parsed.listings).toEqual([]);
  });

  it("defaults listing operacion to venta and destacado to false", () => {
    const parsed = clientSchema.parse({
      nombre: "Terra Propiedades",
      slug: "terra",
      tagline: "t",
      descripcion: "d",
      listings: [
        { titulo: "Depto", precio: "USD 80.000", zona: "Centro", tipo: "Departamento" },
      ],
    });
    expect(parsed.listings[0].operacion).toBe("venta");
    expect(parsed.listings[0].destacado).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run data/schema.test.ts -t "realty fields"`
Expected: FAIL (fields stripped silently by Zod, `parsed.listings` undefined).

- [ ] **Step 3: Add the Zod schema**

In `web-factory/data/schema.ts`, add this near `procesoPasoSchema`/`faqItemSchema` (same section as the other clinic-era additions):

```ts
const listingSchema = z.object({
  titulo: z.string().min(1),
  precio: z.string().min(1),
  zona: z.string().min(1),
  tipo: z.string().min(1),
  operacion: z.enum(["venta", "alquiler"]).default("venta"),
  dormitorios: z.number().int().min(0).optional(),
  banos: z.number().int().min(0).optional(),
  imagen: optionalAssetSchema,
  imagenAlt: z.string().default(""),
  destacado: z.boolean().default(false),
});
```

Then add these 3 fields inside `clientSchema`'s object, next to `faq`:

```ts
  faq: z.array(faqItemSchema).default([]),
  disponibilidad: z.string().optional(),
  ctaSecundariaTexto: z.string().optional(),
  procesoKicker: z.string().optional(),
  procesoTitulo: z.string().optional(),
  listings: z.array(listingSchema).default([]),
  zonas: z.array(z.string().min(1)).default([]),
  wordmarkBreak: z.string().default(""),
```

(Note: `disponibilidad`/`ctaSecundariaTexto` and `procesoKicker`/`procesoTitulo` may already exist from earlier work in this session — if so, only add the 3 new `listings`/`zonas`/`wordmarkBreak` lines; check the file first with Read before editing to avoid duplicate keys, same lesson learned earlier this session with `heroVariant`.)

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run data/schema.test.ts -t "realty fields"`
Expected: PASS (3 tests).

- [ ] **Step 5: Add the types to `SiteClient`**

In `web-factory/packages/blocks/src/types.ts`, add:

```ts
export type Listing = {
  titulo: string;
  precio: string;
  zona: string;
  tipo: string;
  operacion: "venta" | "alquiler";
  dormitorios?: number;
  banos?: number;
  imagen?: string;
  imagenAlt?: string;
  destacado?: boolean;
};
```

And inside `SiteClient`, next to `faq`:

```ts
  faq?: Array<{ pregunta: string; respuesta: string }>;
  listings?: Listing[];
  zonas?: string[];
  wordmarkBreak?: string;
```

- [ ] **Step 6: Run the full unit suite**

Run: `cd web-factory && pnpm test`
Expected: PASS (all suites; new fields are optional/defaulted, nothing existing breaks).

- [ ] **Step 7: Commit**

```bash
git add web-factory/data/schema.ts web-factory/data/schema.test.ts web-factory/packages/blocks/src/types.ts
git commit -m "feat(web-factory): add listings/zonas/wordmarkBreak schema + types for realty vertical"
```

---

### Task 4: `realty-hero.ts` (full-bleed photo + floating search panel)

**Files:**
- Create: `web-factory/packages/blocks/src/realty-hero.ts`
- Test: `web-factory/packages/blocks/src/realty-hero.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { renderRealtyHero } from "./realty-hero";

const base = {
  nombre: "Terra Propiedades", tagline: "Encontra tu proximo lugar", descripcion: "Agencia inmobiliaria.", logo: "TP",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "Consultar por WhatsApp", url: "https://wa.me/1" },
} as const;

describe("renderRealtyHero", () => {
  it("renders a full-bleed hero with a floating search panel", () => {
    const html = renderRealtyHero({ ...base, heroPoster: "assets/hero.webp", zonas: ["Zona Sur", "Centro"] });
    expect(html).toContain("wf-realty-hero");
    expect(html).toContain("wf-realty-search");
    expect(html).toContain("Zona Sur");
    expect(html).toContain("Encontra tu proximo lugar");
    expect(html).toContain("Consultar por WhatsApp");
  });

  it("degrades gracefully without a hero photo", () => {
    const html = renderRealtyHero(base);
    expect(html).toContain("wf-realty-hero");
    expect(html).not.toContain("<img");
  });

  it("escapes HTML in zone options", () => {
    const html = renderRealtyHero({ ...base, zonas: ["<script>x</script>"] });
    expect(html).not.toContain("<script>x</script>");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/realty-hero.test.ts`
Expected: FAIL (`Cannot find module './realty-hero'`).

- [ ] **Step 3: Implement the block**

Create `web-factory/packages/blocks/src/realty-hero.ts`:

```ts
import { escapeAttribute, escapeHtml } from "./escape";
import { renderIcon } from "./icons";
import type { SiteClient } from "./types";

// Full-bleed cinematic photo hero + a floating search panel (zone/type/operation),
// not a booking card. Reuses the full-bleed + scrim technique from the clinic
// vertical (same accessibility/perf properties) with different content and intent.
export function renderRealtyHero(client: SiteClient): string {
  const media = client.heroPoster?.trim();
  const zonas = (client.zonas ?? []).filter((z) => z.trim().length > 0);

  const mediaLayer = media
    ? `<div class="wf-realty-hero-media" data-parallax>
        <img src="${escapeAttribute(media)}" alt="${escapeAttribute(`Propiedades de ${client.nombre}`)}" fetchpriority="high" decoding="async">
      </div>`
    : `<div class="wf-realty-hero-media wf-realty-hero-media--empty" aria-hidden="true"></div>`;

  const zoneOptions = zonas.length
    ? zonas.map((zona) => `<option value="${escapeAttribute(zona)}">${escapeHtml(zona)}</option>`).join("")
    : `<option value="">Todas las zonas</option>`;

  return `
    <header class="wf-realty-hero" id="top">
      ${mediaLayer}
      <div class="wf-realty-hero-scrim" aria-hidden="true"></div>
      <nav class="wf-realty-nav" aria-label="Principal">
        <span class="wf-realty-brand">${escapeHtml(client.nombre)}</span>
        <a class="wf-realty-nav-cta" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>
      </nav>
      <div class="wf-realty-hero-content">
        <h1 class="wf-realty-hero-title">${escapeHtml(client.tagline)}</h1>
        <p class="wf-realty-hero-lede">${escapeHtml(client.descripcion)}</p>
      </div>
      <form class="wf-realty-search" aria-label="Buscar propiedades">
        <label class="wf-realty-search-field">
          <span>Zona</span>
          <select name="zona">${zoneOptions}</select>
        </label>
        <label class="wf-realty-search-field">
          <span>Tipo</span>
          <select name="tipo">
            <option value="">Cualquiera</option>
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            <option value="terreno">Terreno</option>
          </select>
        </label>
        <label class="wf-realty-search-field">
          <span>Operacion</span>
          <select name="operacion">
            <option value="venta">Venta</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </label>
        <button type="submit" class="wf-realty-search-submit">${renderIcon("search", "wf-icon")}<span>Buscar</span></button>
      </form>
    </header>
  `;
}
```

- [ ] **Step 4: Confirm the `search` icon exists (or add it) in the shared icon set**

Read `web-factory/packages/blocks/src/icons.ts` first. If a `"search"` entry does not already exist in the icon map, add one (magnifying glass, matches the existing lucide-derived path style already used for `"map-pin"`/`"star"`/etc):

```ts
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/realty-hero.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add web-factory/packages/blocks/src/realty-hero.ts web-factory/packages/blocks/src/realty-hero.test.ts web-factory/packages/blocks/src/icons.ts
git commit -m "feat(web-factory): realty hero block (full-bleed photo + floating search panel)"
```

---

### Task 5: `realty-wordmark-break.ts` (cropped giant wordmark + stats)

**Files:**
- Create: `web-factory/packages/blocks/src/realty-wordmark-break.ts`
- Test: `web-factory/packages/blocks/src/realty-wordmark-break.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { renderWordmarkBreak } from "./realty-wordmark-break";

const base = {
  nombre: "Terra Propiedades", tagline: "t", descripcion: "d", logo: "TP",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "c", url: "#" },
} as const;

describe("renderWordmarkBreak", () => {
  it("uses wordmarkBreak text when provided", () => {
    const html = renderWordmarkBreak({ ...base, wordmarkBreak: "TERRA", credenciales: ["12 anos en el mercado"] });
    expect(html).toContain("wf-realty-wordmark");
    expect(html).toContain("TERRA");
    expect(html).toContain("12 anos en el mercado");
  });

  it("falls back to the client name when wordmarkBreak is empty", () => {
    const html = renderWordmarkBreak(base);
    expect(html).toContain("Terra Propiedades");
  });

  it("escapes HTML", () => {
    const html = renderWordmarkBreak({ ...base, wordmarkBreak: "<b>x</b>" });
    expect(html).not.toContain("<b>x</b>");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/realty-wordmark-break.test.ts`
Expected: FAIL (`Cannot find module`).

- [ ] **Step 3: Implement the block**

Create `web-factory/packages/blocks/src/realty-wordmark-break.ts`:

```ts
import { escapeHtml } from "./escape";
import type { SiteClient } from "./types";

// Editorial rhythm-break: an oversized, cropped wordmark (Eleos/Arete-inspired -
// the agency name at a scale where it becomes texture, not a logo), with 2-3
// real stats overlaid. Breaks the page rhythm between the hero and the listing
// grid; has no equivalent in the clinic vertical.
export function renderWordmarkBreak(client: SiteClient): string {
  const word = (client.wordmarkBreak?.trim() || client.nombre).toUpperCase();
  const stats = (client.credenciales?.length ? client.credenciales : client.beneficios ?? [])
    .filter((item) => item.trim().length > 0)
    .slice(0, 3);

  const statList = stats.length
    ? `<ul class="wf-realty-wordmark-stats">${stats.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";

  return `
    <section class="wf-realty-wordmark" data-reveal aria-hidden="false">
      <span class="wf-realty-wordmark-text" aria-hidden="true">${escapeHtml(word)}</span>
      ${statList}
    </section>
  `;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/realty-wordmark-break.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add web-factory/packages/blocks/src/realty-wordmark-break.ts web-factory/packages/blocks/src/realty-wordmark-break.test.ts
git commit -m "feat(web-factory): realty wordmark-break block (editorial rhythm break, cropped giant type)"
```

---

### Task 6: `realty-listings.ts` (featured card + photo-first grid)

**Files:**
- Create: `web-factory/packages/blocks/src/realty-listings.ts`
- Test: `web-factory/packages/blocks/src/realty-listings.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { renderListings } from "./realty-listings";

const base = {
  nombre: "Terra Propiedades", tagline: "t", descripcion: "d", logo: "TP",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "c", url: "#" },
} as const;

describe("renderListings", () => {
  it("renders a featured card and a grid of regular cards", () => {
    const html = renderListings({
      ...base,
      listings: [
        { titulo: "Casa Zona Sur", precio: "USD 145.000", zona: "Zona Sur", tipo: "Casa", operacion: "venta", dormitorios: 3, banos: 2, imagen: "assets/a.webp", imagenAlt: "a", destacado: true },
        { titulo: "Depto Centro", precio: "USD 80.000", zona: "Centro", tipo: "Departamento", operacion: "venta", dormitorios: 2, banos: 1, imagen: "assets/b.webp", imagenAlt: "b" },
        { titulo: "Terreno Norte", precio: "USD 40.000", zona: "Norte", tipo: "Terreno", operacion: "venta" },
      ],
    });
    expect(html).toContain("wf-realty-listing--featured");
    expect(html).toContain("Casa Zona Sur");
    expect(html).toContain("USD 145.000");
    expect(html).toContain("3 dorm");
    expect(html).toContain("Depto Centro");
    expect(html).toContain("Terreno Norte");
  });

  it("renders an honest empty state with no fabricated listings", () => {
    const html = renderListings(base);
    expect(html).toContain("wf-realty-empty");
    expect(html).not.toContain("wf-realty-listing-card");
  });

  it("escapes HTML in listing fields", () => {
    const html = renderListings({
      ...base,
      listings: [{ titulo: "<script>x</script>", precio: "p", zona: "z", tipo: "t", operacion: "venta" }],
    });
    expect(html).not.toContain("<script>x</script>");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/realty-listings.test.ts`
Expected: FAIL (`Cannot find module`).

- [ ] **Step 3: Implement the block**

Create `web-factory/packages/blocks/src/realty-listings.ts`:

```ts
import { escapeAttribute, escapeHtml } from "./escape";
import type { Listing, SiteClient } from "./types";

function renderMeta(listing: Listing): string {
  const parts: string[] = [];
  if (typeof listing.dormitorios === "number") parts.push(`${listing.dormitorios} dorm`);
  if (typeof listing.banos === "number") parts.push(`${listing.banos} bano${listing.banos === 1 ? "" : "s"}`);
  return parts.join(" · ");
}

function renderCard(listing: Listing, featured: boolean): string {
  const meta = renderMeta(listing);
  const image = listing.imagen?.trim()
    ? `<img src="${escapeAttribute(listing.imagen)}" alt="${escapeAttribute(listing.imagenAlt || listing.titulo)}" loading="lazy" decoding="async">`
    : `<div class="wf-realty-listing-media--empty" aria-hidden="true"></div>`;

  return `
    <article class="wf-realty-listing-card${featured ? " wf-realty-listing--featured" : ""}" data-reveal>
      <figure class="wf-realty-listing-media">
        ${image}
        <span class="wf-realty-listing-price">${escapeHtml(listing.precio)}</span>
        <span class="wf-realty-listing-op">${listing.operacion === "alquiler" ? "Alquiler" : "Venta"}</span>
      </figure>
      <div class="wf-realty-listing-body">
        <h3>${escapeHtml(listing.titulo)}</h3>
        <p class="wf-realty-listing-zone">${escapeHtml(listing.zona)} · ${escapeHtml(listing.tipo)}</p>
        ${meta ? `<p class="wf-realty-listing-meta">${escapeHtml(meta)}</p>` : ""}
      </div>
    </article>
  `;
}

// Photo-first listing grid: never icon+text cards. One optional featured
// listing gets a larger card (real hierarchy, not a uniform grid). Honest
// empty state instead of fabricated placeholder listings.
export function renderListings(client: SiteClient): string {
  const listings = client.listings ?? [];
  if (listings.length === 0) {
    return `
      <section class="wf-realty-section" id="propiedades" aria-labelledby="wf-realty-listings-heading">
        <div class="wf-realty-section-head">
          <p class="wf-realty-kicker">Propiedades</p>
          <h2 id="wf-realty-listings-heading">Propiedades disponibles</h2>
        </div>
        <div class="wf-realty-empty" role="status">Todavia no hay propiedades cargadas.</div>
      </section>
    `;
  }

  const featured = listings.find((listing) => listing.destacado);
  const rest = listings.filter((listing) => listing !== featured);

  const cards = [
    featured ? renderCard(featured, true) : "",
    ...rest.map((listing) => renderCard(listing, false)),
  ].join("");

  return `
    <section class="wf-realty-section" id="propiedades" aria-labelledby="wf-realty-listings-heading">
      <div class="wf-realty-section-head">
        <p class="wf-realty-kicker">Propiedades</p>
        <h2 id="wf-realty-listings-heading">Propiedades disponibles</h2>
      </div>
      <div class="wf-realty-listing-grid">
        ${cards}
      </div>
    </section>
  `;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/realty-listings.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add web-factory/packages/blocks/src/realty-listings.ts web-factory/packages/blocks/src/realty-listings.test.ts
git commit -m "feat(web-factory): realty listings block (photo-first grid + featured card)"
```

---

### Task 7: `realty-zones.ts` (coverage chips)

**Files:**
- Create: `web-factory/packages/blocks/src/realty-zones.ts`
- Test: `web-factory/packages/blocks/src/realty-zones.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { renderZones } from "./realty-zones";

const base = {
  nombre: "Terra Propiedades", tagline: "t", descripcion: "d", logo: "TP",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "c", url: "#" },
} as const;

describe("renderZones", () => {
  it("renders zone chips without a fake interactive map", () => {
    const html = renderZones({ ...base, zonas: ["Zona Sur", "Centro", "Norte"] });
    expect(html).toContain("wf-realty-zones");
    expect(html).toContain("Zona Sur");
    expect(html).toContain("Centro");
    expect(html).not.toContain("<iframe");
    expect(html).not.toContain("maps.google");
  });

  it("returns empty string when there are no zones", () => {
    expect(renderZones(base)).toBe("");
  });

  it("escapes HTML", () => {
    const html = renderZones({ ...base, zonas: ["<script>x</script>"] });
    expect(html).not.toContain("<script>x</script>");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/realty-zones.test.ts`
Expected: FAIL (`Cannot find module`).

- [ ] **Step 3: Implement the block**

Create `web-factory/packages/blocks/src/realty-zones.ts`:

```ts
import { escapeHtml } from "./escape";
import { renderIcon } from "./icons";
import type { SiteClient } from "./types";

// Coverage zones as honest text chips - no fabricated interactive map (Pattern
// Bank rule: don't fake availability/proof). A real map is a client asset to
// add later, not something to simulate here.
export function renderZones(client: SiteClient): string {
  const zonas = (client.zonas ?? []).filter((zona) => zona.trim().length > 0);
  if (zonas.length === 0) return "";

  const chips = zonas
    .map((zona) => `<li class="wf-realty-zone-chip">${renderIcon("map-pin", "wf-icon")}<span>${escapeHtml(zona)}</span></li>`)
    .join("");

  return `
    <section class="wf-realty-section wf-realty-zones" aria-labelledby="wf-realty-zones-heading">
      <div class="wf-realty-section-head">
        <p class="wf-realty-kicker">Cobertura</p>
        <h2 id="wf-realty-zones-heading">Zonas donde operamos</h2>
      </div>
      <ul class="wf-realty-zone-list">${chips}</ul>
    </section>
  `;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run packages/blocks/src/realty-zones.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add web-factory/packages/blocks/src/realty-zones.ts web-factory/packages/blocks/src/realty-zones.test.ts
git commit -m "feat(web-factory): realty zones block (honest coverage chips, no fake map)"
```

---

### Task 8: Export new blocks from the barrel

**Files:**
- Modify: `web-factory/packages/blocks/src/index.ts`

- [ ] **Step 1: Read the current barrel and add exports**

Read `web-factory/packages/blocks/src/index.ts` first, then add these lines (keep everything already there):

```ts
export { renderRealtyHero } from "./realty-hero";
export { renderWordmarkBreak } from "./realty-wordmark-break";
export { renderListings } from "./realty-listings";
export { renderZones } from "./realty-zones";
export type { Listing } from "./types";
```

- [ ] **Step 2: Run the full unit suite to confirm imports resolve**

Run: `cd web-factory && pnpm test`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add web-factory/packages/blocks/src/index.ts
git commit -m "chore(web-factory): export realty blocks"
```

---

### Task 9: Realty CSS (terracotta/sand/charcoal palette)

**Files:**
- Create: `web-factory/packages/templates/src/realty-css.ts`

This is the single largest visual-identity file — every rule here must differ in feel from `clinic-css.ts` (no blue/teal, no glass-card hero, no bento).

- [ ] **Step 1: Create the CSS module**

Create `web-factory/packages/templates/src/realty-css.ts`:

```ts
// Editorial real-estate styles. Warm terracotta/sand/charcoal palette (never
// the clinic's blue/teal), oversized display type, and a cropped-wordmark
// rhythm break with no equivalent in the clinic vertical. Tokens only.
export const realtyCss = `
.wf-realty-page {
  --realty-ink-accent: color-mix(in srgb, var(--color-primary) 65%, var(--color-fg));
  --wrap: min(1180px, calc(100% - 40px));
  overflow-x: hidden;
}

.wf-icon { width: 1.2em; height: 1.2em; flex: 0 0 auto; }

/* ---------- Hero ---------- */
.wf-realty-hero {
  position: relative;
  min-height: 94svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  overflow: hidden;
  isolation: isolate;
  color: #fff;
  padding-bottom: clamp(96px, 14vw, 160px);
}

.wf-realty-hero-media {
  position: absolute;
  inset: -6% 0;
  height: 112%;
  z-index: 0;
  background: color-mix(in srgb, var(--color-primary) 30%, #1a120b);
}

.wf-realty-hero-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.wf-realty-hero-scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(180deg, rgba(20, 12, 6, 0.55) 0%, rgba(20, 12, 6, 0.1) 32%, rgba(20, 12, 6, 0.3) 58%, rgba(20, 12, 6, 0.88) 100%);
}

.wf-realty-nav {
  position: relative;
  z-index: 2;
  width: var(--wrap);
  margin: 0 auto;
  padding-top: 26px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.wf-realty-brand {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: #fff;
}

.wf-realty-nav-cta {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding: 0 20px;
  border-radius: 4px;
  font-weight: 700;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.wf-realty-hero-content {
  position: relative;
  z-index: 2;
  width: var(--wrap);
  margin: 0 auto;
  max-width: 880px;
  padding-top: 40px;
}

.wf-realty-hero-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(3rem, 7.5vw, 6.5rem);
  line-height: 0.94;
  letter-spacing: -0.02em;
  font-weight: 700;
  color: #fff;
  text-wrap: balance;
  text-shadow: 0 2px 30px rgba(20, 12, 6, 0.4);
}

.wf-realty-hero-lede {
  margin: 22px 0 0;
  max-width: 46ch;
  font-size: clamp(1.05rem, 1.4vw, 1.25rem);
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.88);
}

/* ---------- Floating search panel ---------- */
.wf-realty-search {
  position: relative;
  z-index: 2;
  width: var(--wrap);
  margin: clamp(28px, 4vw, 44px) auto 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr) auto;
  gap: 1px;
  border-radius: 6px;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-fg) 12%, transparent);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
}

.wf-realty-search-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 18px;
  background: var(--color-bg);
}

.wf-realty-search-field span {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted-foreground);
}

.wf-realty-search-field select {
  border: 0;
  background: transparent;
  font: inherit;
  font-weight: 600;
  color: var(--color-fg);
  padding: 0;
}

.wf-realty-search-submit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  padding: 0 28px;
  border: 0;
  font-weight: 750;
  color: var(--color-on-primary);
  background: var(--color-primary);
  cursor: pointer;
}

/* ---------- Section shell ---------- */
.wf-realty-section {
  width: var(--wrap);
  margin: 0 auto;
  padding-block: clamp(56px, 8vw, 100px);
}

.wf-realty-section-head {
  max-width: 720px;
  margin-bottom: clamp(28px, 3.5vw, 48px);
}

.wf-realty-kicker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 14px;
  font-weight: 800;
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--realty-ink-accent);
}

.wf-realty-kicker::before { content: ""; width: 26px; height: 2px; background: var(--color-primary); }

.wf-realty-section-head h2 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 3.8vw, 3.2rem);
  line-height: 1.02;
  letter-spacing: -0.02em;
  color: var(--color-fg);
}

/* ---------- Wordmark break ---------- */
.wf-realty-wordmark {
  width: 100%;
  padding-block: clamp(30px, 6vw, 70px);
  display: grid;
  place-items: center;
  overflow: hidden;
  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-bg));
}

.wf-realty-wordmark-text {
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: clamp(4.5rem, 18vw, 13rem);
  line-height: 0.85;
  letter-spacing: -0.03em;
  color: var(--color-primary);
  white-space: nowrap;
  user-select: none;
}

.wf-realty-wordmark-stats {
  list-style: none;
  margin: 20px 0 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 28px;
  font-weight: 700;
  color: var(--color-fg);
}

/* ---------- Listings ---------- */
.wf-realty-listing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.wf-realty-listing-card {
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--border);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.wf-realty-listing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 22px 44px color-mix(in srgb, var(--color-fg) 14%, transparent);
}

.wf-realty-listing--featured {
  grid-column: span 2;
  grid-row: span 2;
}

.wf-realty-listing-media {
  position: relative;
  margin: 0;
  aspect-ratio: 4 / 3;
  background: color-mix(in srgb, var(--color-primary) 14%, var(--color-bg));
}

.wf-realty-listing--featured .wf-realty-listing-media { aspect-ratio: 16 / 11; }

.wf-realty-listing-media img { width: 100%; height: 100%; object-fit: cover; display: block; }

.wf-realty-listing-media--empty { width: 100%; height: 100%; }

.wf-realty-listing-price {
  position: absolute;
  left: 14px;
  bottom: 14px;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 800;
  background: color-mix(in srgb, var(--color-bg) 92%, transparent);
  color: var(--color-fg);
}

.wf-realty-listing-op {
  position: absolute;
  right: 14px;
  top: 14px;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-on-primary);
  background: var(--color-primary);
}

.wf-realty-listing-body { padding: 16px 18px 20px; }

.wf-realty-listing-body h3 {
  margin: 0;
  font-family: var(--font-heading);
  font-size: 1.15rem;
  color: var(--color-fg);
}

.wf-realty-listing--featured .wf-realty-listing-body h3 { font-size: clamp(1.4rem, 2vw, 1.9rem); }

.wf-realty-listing-zone {
  margin: 6px 0 0;
  color: var(--muted-foreground);
  font-size: 0.9rem;
}

.wf-realty-listing-meta {
  margin: 4px 0 0;
  color: var(--muted-foreground);
  font-size: 0.85rem;
}

.wf-realty-empty {
  padding: 40px;
  text-align: center;
  border: 1px dashed var(--border);
  border-radius: 6px;
  color: var(--muted-foreground);
}

/* ---------- Zones ---------- */
.wf-realty-zone-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.wf-realty-zone-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  border: 1px solid var(--border);
  font-weight: 650;
  color: var(--color-fg);
}

.wf-realty-zone-chip .wf-icon { color: var(--realty-ink-accent); }

/* ---------- Final CTA ---------- */
.wf-realty-final-cta {
  margin-block: clamp(50px, 7vw, 90px);
  padding: clamp(44px, 6vw, 80px);
  border-radius: 6px;
  background: linear-gradient(150deg, var(--color-primary), color-mix(in srgb, var(--color-secondary) 65%, var(--color-primary)));
  color: var(--color-on-primary);
  text-align: center;
}

.wf-realty-final-cta h2 {
  margin: 0 0 24px;
  max-width: 20ch;
  margin-inline: auto;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.03;
  color: var(--color-on-primary);
}

.wf-realty-final-cta .wf-realty-final-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 52px;
  padding: 0 26px;
  border-radius: 4px;
  font-weight: 750;
  color: var(--color-primary);
  background: var(--color-on-primary);
}

/* ---------- Sticky WhatsApp (shared class already styled elsewhere; keep selector local override minimal) ---------- */

/* ---------- Motion ---------- */
.wf-realty-motion [data-reveal] { opacity: 0; transform: translateY(20px); }
.wf-realty-motion [data-reveal].is-revealed {
  opacity: 1;
  transform: none;
  transition: opacity 0.6s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .wf-realty-hero-media {
      animation: wfRealtyParallax linear both;
      animation-timeline: scroll(root);
      animation-range: 0 90vh;
    }
  }
}

@keyframes wfRealtyParallax { from { transform: translateY(0); } to { transform: translateY(7%); } }

@media (prefers-reduced-motion: reduce) {
  .wf-realty-motion [data-reveal] { opacity: 1 !important; transform: none !important; transition: none !important; }
}

/* ---------- Responsive ---------- */
@media (max-width: 1080px) {
  .wf-realty-listing-grid { grid-template-columns: repeat(2, 1fr); }
  .wf-realty-listing--featured { grid-column: 1 / -1; grid-row: auto; }
  .wf-realty-search { grid-template-columns: 1fr 1fr; }
  .wf-realty-search-submit { grid-column: 1 / -1; }
}

@media (max-width: 640px) {
  .wf-realty-listing-grid { grid-template-columns: 1fr; }
  .wf-realty-search { grid-template-columns: 1fr; }
  .wf-realty-nav-cta { display: none; }
}
`;
```

- [ ] **Step 2: Commit**

```bash
git add web-factory/packages/templates/src/realty-css.ts
git commit -m "feat(web-factory): realty CSS (terracotta/sand palette, no clinic reuse)"
```

---

### Task 10: `landing-realty.ts` template

**Files:**
- Create: `web-factory/packages/templates/src/landing-realty.ts`
- Modify: `web-factory/packages/templates/src/index.ts`

- [ ] **Step 1: Implement the template**

Create `web-factory/packages/templates/src/landing-realty.ts`:

```ts
import {
  escapeAttribute,
  escapeHtml,
  renderFooter,
  renderListings,
  renderMarquee,
  renderProcess,
  renderRealtyHero,
  renderStickyCta,
  renderWordmarkBreak,
  renderZones,
} from "@onia/blocks";
import { realtyCss } from "./realty-css";
import type { LandingClient } from "./landing";

// Real-estate multi-listing agency vertical. Deliberately different UI from
// landing-clinic: cinematic hero + floating search (not a booking glass card),
// an editorial cropped-wordmark rhythm break (no clinic equivalent), and
// photo-first listing cards (never icon+text). Reuses only the generic,
// already-proven blocks: process timeline, marquee, footer, sticky CTA.

function renderRealtyFinalCta(client: LandingClient): string {
  return `
    <section class="wf-realty-final-cta" aria-labelledby="wf-realty-final-h">
      <h2 id="wf-realty-final-h">${escapeHtml(client.tagline)}</h2>
      <a class="wf-realty-final-btn" href="${escapeAttribute(client.cta.url)}">${escapeHtml(client.cta.texto)}</a>
    </section>
  `;
}

function renderRealtyTrust(client: LandingClient): string {
  const items = (client.beneficios ?? []).filter((item) => item.trim().length > 0);
  if (items.length === 0) return "";
  return `<div class="wf-realty-section" style="padding-block: 20px 0;">${renderMarquee(items, { icon: "check", label: "Por que elegirnos" })}</div>`;
}

export function renderLandingRealtyBody(client: LandingClient): string {
  return `
    <main class="wf-realty-page wf-realty-motion">
      ${renderRealtyHero(client)}
      ${renderRealtyTrust(client)}
      ${renderWordmarkBreak(client)}
      ${renderListings(client)}
      ${renderProcess({
        ...client,
        procesoKicker: client.procesoKicker ?? "Como funciona",
        procesoTitulo: client.procesoTitulo ?? "De tu consulta a la firma, sin vueltas",
      })}
      ${renderZones(client)}
      ${renderRealtyFinalCta(client)}
      ${renderFooter(client, { minimal: true })}
    </main>
    ${renderStickyCta(client)}
    ${renderRealtyRevealScript()}
  `;
}

export function renderLandingRealtyCss(client: LandingClient): string {
  return realtyCss;
}

export function renderLandingRealtyDocument(client: LandingClient): string {
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
    ${renderLandingRealtyBody(client)}
  </body>
</html>
`;
}

// Same progressive-enhancement reveal-on-scroll pattern as landing-clinic:
// content is visible by default; JS only adds motion, with a timeout fallback.
function renderRealtyRevealScript(): string {
  return `<script>(function(){var r=document.querySelector('.wf-realty-page');if(!r)return;var i=r.querySelectorAll('[data-reveal]');var m=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(m||!('IntersectionObserver' in window)){i.forEach(function(e){e.classList.add('is-revealed')});return;}var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-revealed');o.unobserve(e.target);}})},{rootMargin:'0px 0px -8% 0px',threshold:0.08});i.forEach(function(e){o.observe(e)});setTimeout(function(){i.forEach(function(e){e.classList.add('is-revealed')})},1400);})();</script>`;
}
```

Note: `renderLandingRealtyCss` intentionally ignores `client` for now (the palette lives entirely in `realtyCss`'s hardcoded terracotta tokens layered on top of the client's own CSS custom properties from `clientTokenCss`, which the generator calls separately — verify this against `landing-clinic.ts`'s exact pattern when writing Task 11's generator wiring; if `landing-clinic.ts` concatenates `clientTokenCss(client)` itself rather than relying on the caller, mirror that exactly instead of leaving `client` unused).

- [ ] **Step 2: Check the exact CSS-assembly convention used by `landing-clinic.ts` and correct Task 10 if needed**

Read `web-factory/packages/templates/src/landing-clinic.ts`'s `renderLandingClinicCss` function. If it composes `renderLandingCss(client)` (which itself calls `clientTokenCss`) plus the vertical-specific CSS constant, update `renderLandingRealtyCss` in `landing-realty.ts` to follow the identical pattern:

```ts
import { renderLandingCss } from "./landing";
// ...
export function renderLandingRealtyCss(client: LandingClient): string {
  return `${renderLandingCss(client)}

${realtyCss}`;
}
```

This reuses the base landing CSS (resets, typography defaults, token emission) exactly like landing-clinic does, layering `realtyCss` on top for the vertical-specific rules.

- [ ] **Step 3: Export from the templates barrel**

Read `web-factory/packages/templates/src/index.ts` first, then append:

```ts
export {
  renderLandingRealtyBody,
  renderLandingRealtyCss,
  renderLandingRealtyDocument,
} from "./landing-realty";
```

- [ ] **Step 4: Commit**

```bash
git add web-factory/packages/templates/src/landing-realty.ts web-factory/packages/templates/src/index.ts
git commit -m "feat(web-factory): add landing-realty template"
```

---

### Task 11: Register `landing-realty` in the generator

**Files:**
- Modify: `web-factory/generate/generate.ts`
- Test: `web-factory/generate/generate.test.ts`

- [ ] **Step 1: Write the failing test**

Read `web-factory/generate/generate.test.ts` first (to match existing fixture conventions exactly), then add this case inside the `describe("generateSite")` block:

```ts
  it("creates a realty landing with hero search, wordmark break, listings and zones", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "terra.json"),
      JSON.stringify({
        nombre: "Terra Propiedades",
        slug: "terra",
        tagline: "Encontra tu proximo lugar",
        descripcion: "Agencia inmobiliaria con presencia en toda la ciudad.",
        cta: { texto: "Consultar por WhatsApp", url: "https://wa.me/59170000000" },
        wordmarkBreak: "TERRA",
        zonas: ["Zona Sur", "Centro", "Norte"],
        listings: [
          { titulo: "Casa Zona Sur", precio: "USD 145.000", zona: "Zona Sur", tipo: "Casa", operacion: "venta", dormitorios: 3, banos: 2, destacado: true },
          { titulo: "Depto Centro", precio: "USD 80.000", zona: "Centro", tipo: "Departamento", operacion: "venta", dormitorios: 2, banos: 1 },
        ],
      }),
      "utf8",
    );

    const result = await generateSite("terra", { rootDir, template: "landing-realty" });
    const html = await readFile(path.join(result.outputDir, "index.html"), "utf8");
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");

    expect(html).toContain("wf-realty-hero");
    expect(html).toContain("wf-realty-search");
    expect(html).toContain("wf-realty-wordmark");
    expect(html).toContain("TERRA");
    expect(html).toContain("wf-realty-listing--featured");
    expect(html).toContain("Casa Zona Sur");
    expect(html).toContain("Zona Sur");
    expect(html).toContain("wf-realty-zone-chip");
    expect(css).toContain(".wf-realty-hero");
    expect(css).toContain(".wf-realty-listing-card");
  });
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd web-factory && pnpm exec vitest run generate/generate.test.ts -t "realty landing"`
Expected: FAIL (`Unsupported template "landing-realty"`).

- [ ] **Step 3: Wire the template into the generator**

Read `web-factory/generate/generate.ts` first. Add the import next to the other template imports:

```ts
  renderLandingRealtyCss,
  renderLandingRealtyDocument,
```

Extend the `template` union:

```ts
  template?: "landing" | "store" | "dashboard" | "landing-focus" | "landing-clinic" | "landing-realty";
```

Extend the validation list:

```ts
  if (!["landing", "store", "dashboard", "landing-focus", "landing-clinic", "landing-realty"].includes(template)) {
    throw new Error(`Unsupported template "${template}". Available: landing, store, dashboard, landing-focus, landing-clinic, landing-realty.`);
  }
```

Extend the html selection:

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
            : template === "landing-realty"
              ? renderLandingRealtyDocument(client)
              : renderLandingDocument(client);
```

Extend the css selection:

```ts
  const css =
    template === "store"
      ? renderStoreCss(client)
      : template === "dashboard"
        ? renderDashboardCss(client)
        : template === "landing-clinic"
          ? renderLandingClinicCss(client)
          : template === "landing-realty"
            ? renderLandingRealtyCss(client)
            : renderLandingCss(client);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd web-factory && pnpm exec vitest run generate/generate.test.ts -t "realty landing"`
Expected: PASS.

- [ ] **Step 5: Run the full unit suite**

Run: `cd web-factory && pnpm test`
Expected: PASS (all suites).

- [ ] **Step 6: Commit**

```bash
git add web-factory/generate/generate.ts web-factory/generate/generate.test.ts
git commit -m "feat(web-factory): register landing-realty template in generator"
```

---

### Task 12: Demo data + property photos

**Files:**
- Create: `web-factory/data/clients/realty-demo.json`
- Create: `web-factory/data/clients/realty-demo.context.md`
- Create: `web-factory/data/clients/realty-demo.assets/` (property + hero photos)
- Create: `web-factory/data/intakes/realty-demo.json`

- [ ] **Step 1: Source property photos**

Download 4 free-license (Unsplash) property/architecture photos as WebP, optimized, into `web-factory/data/clients/realty-demo.assets/`: one wide hero shot (house/building exterior, ~1920px), three listing photos (~1000px). Use the same fetch-and-write approach already used for `dental-demo.assets/` earlier this session (`https://images.unsplash.com/photo-<id>?w=<width>&q=<quality>&fm=webp&fit=crop`), sourcing real estate/architecture exterior photo IDs found via Unsplash search for "modern house exterior" / "apartment building facade" at the time of implementation. Name them `hero-exterior.webp`, `listing-casa.webp`, `listing-depto.webp`, `listing-terreno.webp`.

Verify each file is under 200kb (check with a directory listing) before proceeding — if larger, re-fetch with a lower `q` value.

- [ ] **Step 2: Create the client profile**

Create `web-factory/data/clients/realty-demo.json`:

```json
{
  "nombre": "Terra Propiedades",
  "slug": "realty-demo",
  "tagline": "Encontra tu proximo lugar",
  "descripcion": "Agencia inmobiliaria con presencia en toda la ciudad. Casas, departamentos y terrenos en venta y alquiler.",
  "logo": "TP",
  "heroPoster": "assets/hero-exterior.webp",
  "colores": {
    "primary": "#b5502e",
    "secondary": "#2a2118",
    "accent": "#c9a24b",
    "bg": "#faf6ef",
    "fg": "#2a2118"
  },
  "tipografia": { "heading": "Onest", "body": "Onest" },
  "contacto": { "email": "", "tel": "", "whatsapp": "+59170000001", "direccion": "La Paz, Bolivia" },
  "redes": { "ig": "", "fb": "", "linkedin": "", "x": "" },
  "servicios": [
    { "titulo": "Venta", "desc": "Casas, departamentos y terrenos.", "icono": "search" },
    { "titulo": "Alquiler", "desc": "Opciones amuebladas y sin amueblar.", "icono": "check" },
    { "titulo": "Asesoria", "desc": "Acompanamiento en toda la operacion.", "icono": "shield" }
  ],
  "beneficios": ["12 anos en el mercado", "Mas de 300 operaciones cerradas", "Asesoria sin costo"],
  "credenciales": ["12 anos en el mercado", "Mas de 300 operaciones cerradas", "Agentes matriculados"],
  "wordmarkBreak": "TERRA",
  "zonas": ["Zona Sur", "Centro", "Zona Norte", "Achumani", "Calacoto"],
  "listings": [
    {
      "titulo": "Casa 3 dormitorios en Zona Sur",
      "precio": "USD 185.000",
      "zona": "Zona Sur",
      "tipo": "Casa",
      "operacion": "venta",
      "dormitorios": 3,
      "banos": 2,
      "imagen": "assets/listing-casa.webp",
      "imagenAlt": "Fachada de casa en Zona Sur",
      "destacado": true
    },
    {
      "titulo": "Departamento 2 dormitorios en Centro",
      "precio": "USD 92.000",
      "zona": "Centro",
      "tipo": "Departamento",
      "operacion": "venta",
      "dormitorios": 2,
      "banos": 1,
      "imagen": "assets/listing-depto.webp",
      "imagenAlt": "Living de departamento en Centro"
    },
    {
      "titulo": "Terreno 500m2 en Achumani",
      "precio": "USD 65.000",
      "zona": "Achumani",
      "tipo": "Terreno",
      "operacion": "venta",
      "imagen": "assets/listing-terreno.webp",
      "imagenAlt": "Terreno en Achumani"
    },
    {
      "titulo": "Departamento amueblado en alquiler, Calacoto",
      "precio": "Bs. 3.800 / mes",
      "zona": "Calacoto",
      "tipo": "Departamento",
      "operacion": "alquiler",
      "dormitorios": 1,
      "banos": 1
    }
  ],
  "proceso": [
    { "titulo": "Contacto", "desc": "Nos contas que estas buscando y tu presupuesto." },
    { "titulo": "Visitas", "desc": "Coordinamos visitas a las propiedades que encajan." },
    { "titulo": "Oferta", "desc": "Te acompanamos a armar y negociar la oferta." },
    { "titulo": "Cierre", "desc": "Gestionamos la documentacion hasta la firma." }
  ],
  "procesoKicker": "Como funciona",
  "procesoTitulo": "De tu consulta a la firma, sin vueltas",
  "cta": { "texto": "Consultar por WhatsApp", "url": "https://wa.me/59170000001?text=Hola%2C%20quiero%20consultar%20por%20una%20propiedad." },
  "seo": {
    "title": "Terra Propiedades | casas, departamentos y terrenos",
    "description": "Agencia inmobiliaria con presencia en toda la ciudad. Casas, departamentos y terrenos en venta y alquiler.",
    "ogImage": ""
  }
}
```

- [ ] **Step 2: Create the context file**

Create `web-factory/data/clients/realty-demo.context.md`:

```markdown
# Terra Propiedades (demo) - Web Factory Context

## Brief
- Slug: `realty-demo`
- Template: `landing-realty`
- Rubro: inmobiliaria (agencia multi-propiedad)
- Objetivo: consultas por WhatsApp
- Responsable: ONIA
- Paquete: web

## Media
- Permiso de assets: stock libre (Unsplash License, uso comercial) como PLACEHOLDER.
- Hero + 3 fotos de listings: stock de arquitectura/exteriores (no fingen ser
  propiedades reales de una agencia real).
- Notas: DEMO INTERNA. Para cliente real, reemplazar por fotos reales de las
  propiedades en cartera y no presentar stock como si fueran propiedades reales.

## Datos demo (reemplazar en cliente real)
- WhatsApp +59170000001 es placeholder.
- Listings, precios y zonas son de ejemplo; usar datos reales y verificados.
- Credenciales ("12 anos en el mercado", "300 operaciones") son de ejemplo.

## Pendientes antes de entrega (cliente real)
- Listings reales con disponibilidad verificada.
- Fotos reales de las propiedades.
- Zonas de cobertura reales.
- Dominio + hosting a nombre del cliente.
```

- [ ] **Step 3: Create the intake (brief source of truth)**

Create `web-factory/data/intakes/realty-demo.json` mirroring the shape of `web-factory/data/intakes/dental-demo.json` (`project.template = "landing-realty"`, business/brand/content fields matching the client JSON above, `operations.missing` listing the real-client TODOs from the context file). Not consumed by `generate`; documents the brief.

- [ ] **Step 4: Generate and eyeball the output**

Run: `cd web-factory && pnpm generate realty-demo --template landing-realty`
Expected: writes `out/realty-demo/index.html` + `site.css` + copies the 4 asset files. Open and confirm all sections render (hero+search, wordmark break, featured+grid listings, process, zones, final CTA, sticky).

- [ ] **Step 5: Commit**

```bash
git add web-factory/data/clients/realty-demo.json web-factory/data/clients/realty-demo.context.md web-factory/data/clients/realty-demo.assets web-factory/data/intakes/realty-demo.json
git commit -m "feat(web-factory): add realty-demo data (Terra Propiedades, multi-listing agency)"
```

---

### Task 13: e2e coverage (structure, a11y, perf)

**Files:**
- Modify: `web-factory/tests/e2e/global-setup.ts`
- Modify: `web-factory/tests/e2e/a11y.spec.ts`
- Modify: `web-factory/tests/e2e/perf.spec.ts`
- Create: `web-factory/tests/e2e/landing-realty.spec.ts`

- [ ] **Step 1: Generate realty-demo in global setup**

Read `web-factory/tests/e2e/global-setup.ts` first, then add:

```ts
  await generateSite("realty-demo", { rootDir, template: "landing-realty" });
```

- [ ] **Step 2: Add to the a11y matrix**

Read `web-factory/tests/e2e/a11y.spec.ts` first, then add to `PAGES`:

```ts
  { name: "landing-realty (realty-demo)", url: "/realty-demo/", schemes: ["light", "dark"] as const },
```

- [ ] **Step 3: Add to the perf matrix**

Read `web-factory/tests/e2e/perf.spec.ts` first, then add to `PAGES`. Start with the same budget used for `dental-demo` (photos push weight above the 60kb text-only budget):

```ts
  { name: "landing-realty (realty-demo)", url: "/realty-demo/", maxBytesKb: 320 },
```

(Measure actual weight in Task 15's gate run and tighten this number to the real value rounded up to the nearest 10kb if it comes in lower — don't leave it loose without checking.)

- [ ] **Step 4: Write the functional structure spec**

Create `web-factory/tests/e2e/landing-realty.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.describe("landing-realty preview (realty-demo)", () => {
  test("shows the hero with a search panel and a real WhatsApp CTA", async ({ page }) => {
    await page.goto("/realty-demo/");
    await expect(page.locator(".wf-realty-hero")).toBeVisible();
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator(".wf-realty-search")).toBeVisible();
    await expect(page.locator(".wf-realty-search select[name='zona']")).toBeVisible();

    const cta = page.locator(".wf-realty-hero a[href]").first();
    const href = await cta.getAttribute("href");
    expect(href).toContain("wa.me");
  });

  test("renders the wordmark break, listings with a featured card, process and zones", async ({ page }) => {
    await page.goto("/realty-demo/");
    await expect(page.locator(".wf-realty-wordmark")).toBeVisible();
    await expect(page.locator(".wf-realty-listing--featured")).toBeVisible();
    expect(await page.locator(".wf-realty-listing-card").count()).toBeGreaterThan(1);
    await expect(page.locator("#proceso")).toBeVisible();
    await expect(page.locator(".wf-realty-zone-chip").first()).toBeVisible();
  });

  test("keeps a persistent whatsapp cta", async ({ page }) => {
    await page.goto("/realty-demo/");
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
    const response = await page.goto("/realty-demo/");
    expect(response?.ok()).toBeTruthy();
    await page.waitForLoadState("networkidle");
    expect(failed, `broken assets: ${failed.join(", ")}`).toEqual([]);
  });
});
```

- [ ] **Step 5: Run the e2e suite for this vertical**

Run: `cd web-factory && pnpm exec playwright test --grep "realty-demo"`
Expected: PASS. If a11y flags a contrast issue, check the offending selector's computed color against the terracotta tokens in both light and dark and adjust `realty-demo.json`'s `colores` (same approach used for landing-clinic). If perf exceeds budget, measure actual `site.css` + `index.html` + assets size and set `maxBytesKb` to the measured value rounded up, same as Task 13 Step 3 already anticipates.

- [ ] **Step 6: Commit**

```bash
git add web-factory/tests/e2e/global-setup.ts web-factory/tests/e2e/a11y.spec.ts web-factory/tests/e2e/perf.spec.ts web-factory/tests/e2e/landing-realty.spec.ts
git commit -m "test(web-factory): cover realty-demo landing (hero search, wordmark, listings, zones)"
```

---

### Task 14: Add to `factory:smoke` (ROOT FILE — advised)

**Files:**
- Modify: `web-factory/package.json`

- [ ] **Step 1: Append the realty generation to the smoke script**

Read `web-factory/package.json` first, then append ` && pnpm generate realty-demo --template landing-realty` to the end of the `factory:smoke` script value.

- [ ] **Step 2: Run the smoke**

Run: `cd web-factory && pnpm factory:smoke`
Expected: unit tests pass and every demo (including `realty-demo`) generates without error.

- [ ] **Step 3: Commit**

```bash
git add web-factory/package.json
git commit -m "chore(web-factory): add realty-demo to factory smoke"
```

---

### Task 15: Final gate, visual verification, fix issues we already know about, push

- [ ] **Step 1: Full unit suite**

Run: `cd web-factory && pnpm test`
Expected: all green.

- [ ] **Step 2: Full e2e**

Run: `cd web-factory && pnpm exec playwright test --grep "realty-demo|dental-demo|dashboard-demo|dentalgest-demo"`
Expected: all green except the already-diagnosed, already-flagged `store (skincare-demo)` flaky a11y test (unrelated, tracked separately as `task_94fbd1fa`'s sibling contrast issue) — do not attempt to fix that one here, it's out of scope for this plan.

- [ ] **Step 3: Visual verification (light/dark/mobile, with real scroll before full-page screenshots)**

Serve `web-factory/out/` and capture `/realty-demo/` at 1280x900 (light+dark) and 390x844 (mobile) with Playwright, scrolling incrementally through the page first (`window.scrollTo` in steps with short waits) before the final full-page screenshot — this session already hit a false-negative earlier where `data-reveal` sections appeared blank in a screenshot that skipped the scroll pass. Confirm:
- Hero photo + search panel legible over the scrim in both themes.
- Wordmark break text doesn't overflow at 390px (check `document.documentElement.scrollWidth === clientWidth`).
- Featured listing card reads clearly larger than regular cards.
- Zone chips wrap cleanly on mobile.
- No horizontal overflow anywhere at 390px.

- [ ] **Step 4: Fix any regressions found in Step 3**

If an issue is found that's caused by this plan's own code (not a pre-existing, already-flagged issue), fix it directly and re-verify. If an issue is found that's clearly pre-existing and unrelated (e.g., another instance of the already-flagged topbar/store bugs), do not fix it here — it's already tracked.

- [ ] **Step 5: Push**

```bash
git push
```

---

### Task 16: Fix already-flagged issue — store contrast bug

**Files:**
- Modify: `web-factory/packages/templates/src/store.ts`

This is the Nuvia store template's white-on-coral button contrast bug, diagnosed earlier this session (root cause confirmed: `#fffdfa` text on `--nuvia-coral: #FF6B6B` background computes to ~2.73:1 contrast, needs 4.5:1). Full diagnosis with exact line numbers and a suggested fix already exists as background task `task_b45daba7` — however, per this project's `CLAUDE.md`, the Nuvia store is normally **out of this carril's boundary** ("NO toques... la tienda Nuvia"). **Do not execute this task without explicit confirmation from Sergio that touching `store.ts` is authorized for this session** — surface the diagnosis and ask before editing. If authorized:

- [ ] **Step 1: Read the current state of the two affected rules**

Read `web-factory/packages/templates/src/store.ts` around the `.store-header-cta, .store-button-primary, .store-product-footer a, .store-subscribe-form button, .store-final a` shared rule and the `.store-product-actions button` rule (search for `--nuvia-coral` and `#fffdfa` to locate exact current line numbers, since the file may have changed since the original diagnosis).

- [ ] **Step 2: Change the text color**

In the shared button rule block, change `color: #fffdfa;` to `color: var(--store-ink);` (matches the existing precedent at `.store-product-actions a` which already uses `--store-ink` on the same coral-adjacent surface family). In the `.store-product-actions button` rule, add `color: var(--store-ink);` as an explicit override (it currently inherits the shared block's color).

- [ ] **Step 3: Verify the fix**

Run: `cd web-factory && pnpm generate skincare-demo --template store && pnpm exec playwright test --grep "skincare-demo"`
Expected: a11y test passes deterministically (run it 2-3 times in a row to confirm it's no longer flaky, not just passing once).

- [ ] **Step 4: Visual check**

Screenshot `/skincare-demo/` catalog and a product detail page (header CTA, quick-add button, PDP buy button) to confirm the color change reads correctly (dark text on coral, not a broken/invisible button).

- [ ] **Step 5: Commit**

```bash
git add web-factory/packages/templates/src/store.ts
git commit -m "fix(web-factory): store button contrast (white-on-coral was 2.73:1, needs 4.5:1)"
```

---

### Task 17: Fix already-flagged issue — dashboard topbar mobile overflow

**Files:**
- Modify: `web-factory/packages/templates/src/dashboard.ts`

Diagnosed earlier this session as background task `task_cf9eff89`: `.wf-dash-topbar-actions` (theme toggle + `.wf-dash-filters` time-range pills + `.wf-dash-cta`) doesn't wrap tightly enough at ~390px, causing the whole document to overflow horizontally by ~120-180px. Confirmed pre-existing (unrelated to the dashboard design-system work), reproduced independently on both `dashboard-demo` and `dentalgest-demo`.

- [ ] **Step 1: Write the failing test**

Read `web-factory/generate/generate.test.ts` first, then add this case:

```ts
  it("keeps the dashboard topbar within a 390px viewport (no horizontal overflow)", async () => {
    const rootDir = await mkdtemp(path.join(os.tmpdir(), "onia-web-factory-"));
    await mkdir(path.join(rootDir, "data", "clients"), { recursive: true });

    await writeFile(
      path.join(rootDir, "data", "clients", "panel.json"),
      JSON.stringify({
        nombre: "Panel Demo",
        slug: "panel",
        tagline: "Panel de control demo",
        descripcion: "Dashboard de ejemplo.",
        cta: { texto: "Exportar reporte", url: "#top" },
        dashboard: {
          title: "Panel operativo",
          filters: ["7 dias", "30 dias", "90 dias"],
        },
      }),
      "utf8",
    );

    const result = await generateSite("panel", { rootDir, template: "dashboard" });
    const css = await readFile(path.join(result.outputDir, "site.css"), "utf8");

    // The fix must add a horizontal-scroll containment rule scoped to the
    // topbar actions row at narrow widths (min-width:0 + overflow-x:auto),
    // mirroring the pattern already used for .wf-dash-nav.
    expect(css).toContain(".wf-dash-topbar-actions");
  });
```

This test only checks the CSS carries the fix marker; the real verification is the Playwright viewport check in Step 4 below (jsdom/vitest can't measure real layout overflow).

- [ ] **Step 2: Run test to verify current state**

Run: `cd web-factory && pnpm exec vitest run generate/generate.test.ts -t "390px"`
Expected: PASS trivially right now (the selector already exists) — this test is a placeholder marker, not the real gate. The REAL verification is Step 4's Playwright check. Proceed to the fix regardless.

- [ ] **Step 3: Apply the fix**

Read `web-factory/packages/templates/src/dashboard.ts` first and find the `@media (max-width: 520px)` block (near `.wf-dash-topbar { align-items: flex-start; }`). Extend it:

```css
@media (max-width: 520px) {
  .wf-dash-topbar {
    align-items: flex-start;
  }

  .wf-dash-topbar-actions {
    width: 100%;
    min-width: 0;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 4px;
  }

  .wf-dash-filters {
    flex: 0 0 auto;
  }

  .wf-dash-cta {
    flex: 0 0 auto;
    white-space: nowrap;
  }
}
```

- [ ] **Step 4: Verify with a real viewport check**

Run: `cd web-factory && pnpm generate dashboard-demo --template dashboard`

Then, using a short Playwright script (same pattern used earlier this session in `tmp/check-overflow.mjs`), serve `out/` and check at 390x844:

```js
import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto("http://localhost:4331/dashboard-demo/", { waitUntil: "networkidle" });
const overflow = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  clientWidth: document.documentElement.clientWidth,
}));
console.log(JSON.stringify(overflow));
await browser.close();
```

Expected: `scrollWidth === clientWidth` (both 390). If still overflowing, inspect which element still exceeds 390px (same `find-overflow.mjs` technique from earlier this session — query all `body *`, filter by `getBoundingClientRect().right > 391`) and extend the fix to that element.

- [ ] **Step 5: Run the full e2e suite for both dashboard clients**

Run: `cd web-factory && pnpm exec playwright test --grep "dashboard-demo|dentalgest-demo"`
Expected: PASS, no regressions.

- [ ] **Step 6: Commit**

```bash
git add web-factory/packages/templates/src/dashboard.ts web-factory/generate/generate.test.ts
git commit -m "fix(web-factory): contain dashboard topbar-actions overflow at 390px (pre-existing, unrelated to design system work)"
```

---

### Task 18: Fix already-flagged issue — test fixture type mismatch

**Files:**
- Modify: `web-factory/generate/check-images.ts`
- Modify: `web-factory/packages/blocks/src/clinic-hero.test.ts`, `faq.test.ts`, `hero.test.ts`, `process.test.ts`

Diagnosed earlier this session as background task `task_94fbd1fa`: `as const` fixtures in 4 test files make `servicios` a readonly tuple, which fails `tsc --noEmit` against the mutable `SiteClient.servicios: Array<...>` type (does not fail `pnpm test` today since vitest/esbuild strips types without checking — this is latent debt, not a currently-broken build). Also a separate `Dirent<Buffer>` vs `Dirent<string>` mismatch in `check-images.ts`.

- [ ] **Step 1: Establish the baseline**

Run: `cd web-factory && pnpm --filter site exec tsc --noEmit --project ../../tsconfig.json 2>&1 | grep -c "error TS"`
Expected: 28 (matches the count found earlier this session — confirms nothing new broke since the design-system work, and this task's fix target is unchanged).

- [ ] **Step 2: Fix `check-images.ts`**

Read `web-factory/generate/check-images.ts` first, locate the `readdirSync(..., { withFileTypes: true })` call around line 14. Add an explicit `encoding: "utf8"` option so `Dirent.name` is typed as `string`:

```ts
const entries = readdirSync(dir, { withFileTypes: true, encoding: "utf8" });
```

- [ ] **Step 3: Fix the 4 test fixture files**

For each of `web-factory/packages/blocks/src/clinic-hero.test.ts`, `faq.test.ts`, `hero.test.ts`, `process.test.ts`: read the file first, find the shared `base` fixture declared with `as const`, and change only the `servicios` field so it is not part of the `as const` freeze — the simplest fix is to keep `as const` on the rest of the object but spread `servicios` back into a mutable array literal at each call site, OR (simpler, uniform fix) drop `as const` entirely from the fixture and instead type it explicitly:

```ts
import type { SiteClient } from "./types";

const base: SiteClient = {
  nombre: "Aura", tagline: "t", descripcion: "d", logo: "A",
  contacto: { email: "", tel: "", whatsapp: "", direccion: "" },
  redes: { ig: "", fb: "", linkedin: "", x: "" },
  servicios: [{ titulo: "s", desc: "d", icono: "x" }],
  cta: { texto: "c", url: "#" },
};
```

(Exact field values differ per file — keep each file's existing field values unchanged, only remove `as const` and add the `: SiteClient` annotation with an `import type { SiteClient } from "./types";` at the top if not already imported.)

- [ ] **Step 4: Verify the type-check is clean**

Run: `cd web-factory && pnpm --filter site exec tsc --noEmit --project ../../tsconfig.json 2>&1 | grep -c "error TS"`
Expected: 0.

- [ ] **Step 5: Run the full unit suite to confirm no runtime regressions**

Run: `cd web-factory && pnpm test`
Expected: PASS (all suites — this was a type-only fix, runtime behavior of the fixtures is unchanged).

- [ ] **Step 6: Commit**

```bash
git add web-factory/generate/check-images.ts web-factory/packages/blocks/src/clinic-hero.test.ts web-factory/packages/blocks/src/faq.test.ts web-factory/packages/blocks/src/hero.test.ts web-factory/packages/blocks/src/process.test.ts
git commit -m "fix(web-factory): resolve latent tsc errors (as-const test fixtures, Dirent typing)"
```

---

### Task 19: Final combined gate + push

- [ ] **Step 1: Full unit suite**

Run: `cd web-factory && pnpm test`
Expected: all green.

- [ ] **Step 2: Full e2e suite (everything)**

Run: `cd web-factory && pnpm e2e`
Expected: all green, including the store a11y test now passing deterministically (Task 16) if that task was authorized and executed; if Task 16 was skipped (not authorized), the store flaky remains a known, separately-tracked issue and should not block this push.

- [ ] **Step 3: factory:smoke**

Run: `cd web-factory && pnpm factory:smoke`
Expected: clean, all demos generate.

- [ ] **Step 4: Push**

```bash
git push
```

---

## Self-Review

**Spec coverage:** Investigation section — captured in this plan's task rationale (Tasks 4-10 reference the 3 concrete references by name). Decisions section — multi-listing scenario (Task 12), no Nuvia reuse (verified, never touches `store.ts` except the explicitly-gated Task 16), generic-block reuse (Tasks 1-2 generalize `renderProcess`/`renderMarquee` before Task 10 reuses them), new-not-reskin blocks (Tasks 4-7). Page structure — all 8 sections from the spec map to Task 10's composition. Schema — Task 3. Generator — Task 11. Demo data — Task 12. Gates — Task 13-15. Guardrails — no fake map (Task 7's test explicitly asserts no `<iframe>`/`maps.google`), no fabricated availability (empty-state test in Task 6), stock photos marked demo (Task 12's context.md). "Fix the issues we have" — Tasks 16-18, with Task 16 explicitly gated on authorization since it touches the Nuvia boundary.

**Placeholder scan:** every step ships complete code, exact commands, and expected output. The one explicit exception (Task 12 Step 1's Unsplash photo IDs "found at the time of implementation") is intentional and matches exactly how the equivalent step was written for `dental-demo` earlier this session (photo IDs can't be hardcoded in advance without browsing at execution time) — not a placeholder, a documented external-lookup step.

**Type consistency:** `Listing` type (Task 3) used identically in `realty-listings.ts` (Task 6) and the Zod schema. `procesoKicker`/`procesoTitulo` (Task 1) used consistently in `landing-realty.ts` (Task 10) and the Zod schema (Task 3). Block export names (`renderRealtyHero`, `renderWordmarkBreak`, `renderListings`, `renderZones`) match between their definition files (Tasks 4-7), the barrel (Task 8), and their consumption in `landing-realty.ts` (Task 10). `wf-marquee*` (Task 2's rename) is referenced consistently in the new `renderRealtyTrust` helper (Task 10) — no leftover `wf-clinic-marquee` reference anywhere in new code.

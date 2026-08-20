import { escapeAttribute, escapeHtml } from "./escape";

/**
 * stat-strip — the proof band: the client's real numbers, big.
 *
 * From unitedcarriers-logistics (section 3, job proof, layout grid,
 * content [number, label]).
 *
 * Motion (verbatim from the model):
 *   entrance "count-up al entrar en viewport" · trigger in-view
 *   easing [0.22, 1, 0.36, 1] · duration 1.2s · stagger 0.1s
 *   reducedMotion "el numero final directo, sin conteo"
 * Mapped to `wf-stagger` + the shared `wf-count` primitive (motion.ts): the final
 * number is always in the HTML, so no-JS, SEO and reduced motion read the real
 * value and the runtime only animates toward it.
 *
 * The model's own rule, enforced here in code, not in a comment:
 *   "SOLO con numeros reales del cliente. Sin datos verificables, esta seccion se
 *   elimina, no se inventa."
 * -> no items, no section. And an item the client has not confirmed is rendered
 * with `placeholder: true`, which prints a visible "dato de muestra" tag, so a
 * page built before the data arrives can never be mistaken for a claim.
 *
 * Pattern bank rule 7 ("los numeros fiscales no bailan") is why the count-up is
 * opt-out by shape: an amount carrying a currency marker, a decimal, or a
 * placeholder never animates.
 */

export type StatItem = {
  /** As it must read on screen, formatted: "4.200", "9 departamentos", "24 h". */
  value: string;
  label: string;
  /** Where the number comes from. Printed under the stat: proof needs an origin. */
  source?: string;
  /** Unconfirmed sample, tagged on screen. */
  placeholder?: boolean;
};

export type StatStripProps = {
  items: ReadonlyArray<StatItem>;
  label?: string;
  heading?: string;
  /** Small print for the whole band (e.g. what is still pending from the client). */
  note?: string;
  id?: string;
};

/** Integer, optionally dot-grouped ("4.200"), and nothing else: what may animate. */
const COUNTABLE = /^(\d{1,3}(?:\.\d{3})+|\d+)$/;
const CURRENCY = /(bs\b|usd|\$|€|£)/i;

export function renderStatStrip({
  items,
  label,
  heading,
  note,
  id = "cifras",
}: StatStripProps): string {
  const clean = items.filter((item) => item.value.trim() && item.label.trim());
  if (clean.length === 0) return "";

  const headingId = `${id}-heading`;
  const cells = clean
    .map((item) => {
      const value = item.value.trim();
      const [, lead = "", rest = ""] = /^([\d.,]*)(.*)$/.exec(value) ?? [];
      const countable =
        !item.placeholder && COUNTABLE.test(lead) && !CURRENCY.test(value);
      const number = countable
        ? `<span class="wf-count" data-wf-count="${escapeAttribute(lead.replace(/\./g, ""))}">${escapeHtml(lead)}</span>${escapeHtml(rest)}`
        : escapeHtml(value);

      return `<li class="wf-stat${item.placeholder ? " wf-stat-pending" : ""}">
          <p class="wf-stat-value">${number}</p>
          <p class="wf-stat-label">${escapeHtml(item.label.trim())}</p>
          ${item.source?.trim() ? `<p class="wf-stat-source">${escapeHtml(item.source.trim())}</p>` : ""}
          ${item.placeholder ? `<p class="wf-stat-sample">dato de muestra</p>` : ""}
        </li>`;
    })
    .join("");

  return `
    <section class="wf-stat-strip" id="${escapeAttribute(id)}" aria-labelledby="${headingId}">
      <div class="wf-stat-head">
        ${label?.trim() ? `<p class="wf-stat-kicker">${escapeHtml(label.trim())}</p>` : ""}
        <h2 class="wf-stat-heading" id="${headingId}">${escapeHtml(heading?.trim() || "En numeros")}</h2>
      </div>
      <ol class="wf-stat-list wf-stagger">${cells}</ol>
      ${note?.trim() ? `<p class="wf-stat-note">${escapeHtml(note.trim())}</p>` : ""}
    </section>
  `;
}

/**
 * Token-only styles. Numbers are the design here: oversized, tabular, on a hairline
 * grid instead of four identical cards.
 * Note: no backticks in this file's CSS comments -- it lives inside a template
 * literal and a stray backtick ends the string mid-stylesheet.
 */
export const STAT_STRIP_CSS = `
.wf-stat-strip {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(48px, 7vw, 88px) 0;
  --wf-dur: .6s;
  --wf-stag: .1s;
}

.wf-stat-kicker {
  color: color-mix(in srgb, var(--color-fg) 66%, var(--color-bg));
  font-size: 0.8rem;
  letter-spacing: 0.06em;
}

.wf-stat-heading {
  margin-top: 8px;
  max-width: 20ch;
  font-family: var(--font-heading);
  font-size: clamp(1.7rem, 3.6vw, 2.8rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-weight: 500;
}

.wf-stat-list {
  margin: clamp(24px, 3vw, 40px) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0;
}

.wf-stat {
  padding: clamp(18px, 2.2vw, 26px) clamp(16px, 2.2vw, 26px);
  border-left: 1px solid color-mix(in srgb, var(--color-fg) 14%, transparent);
}

.wf-stat:first-child {
  padding-left: 0;
  border-left: 0;
}

.wf-stat-value {
  font-family: var(--font-heading);
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  line-height: 1;
  letter-spacing: -0.03em;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--color-fg);
}

/* A number the client has not confirmed does not get to be the headline of the
   band: it steps back so the label reads first and the placeholder cannot be
   mistaken for a claim at a glance. */
.wf-stat-pending .wf-stat-value {
  font-size: clamp(1.4rem, 2.4vw, 1.9rem);
  color: color-mix(in srgb, var(--color-fg) 58%, var(--color-bg));
}

.wf-stat-label {
  margin-top: 10px;
  max-width: 22ch;
  color: color-mix(in srgb, var(--color-fg) 78%, var(--color-bg));
  font-size: 0.98rem;
  line-height: 1.5;
}

.wf-stat-source {
  margin-top: 6px;
  color: color-mix(in srgb, var(--color-fg) 62%, var(--color-bg));
  font-size: 0.8rem;
  line-height: 1.45;
}

/* Sample tag: same honesty device as the catalog placeholder rows. */
.wf-stat-sample {
  display: inline-block;
  margin-top: 10px;
  padding: 4px 10px;
  border: 1px solid color-mix(in srgb, var(--color-fg) 30%, transparent);
  border-radius: 999px;
  color: color-mix(in srgb, var(--color-fg) 78%, var(--color-bg));
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.wf-stat-note {
  margin-top: clamp(18px, 2.4vw, 28px);
  max-width: 70ch;
  color: color-mix(in srgb, var(--color-fg) 66%, var(--color-bg));
  font-size: 0.86rem;
  line-height: 1.55;
}

@media (max-width: 760px) {
  .wf-stat-list {
    grid-template-columns: 1fr;
  }

  .wf-stat {
    padding: 18px 0;
    border-left: 0;
    border-top: 1px solid color-mix(in srgb, var(--color-fg) 14%, transparent);
  }

  .wf-stat:first-child {
    border-top: 0;
  }
}
`.trim();

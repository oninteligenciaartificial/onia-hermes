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
          `<span class="wf-clinic-marquee-item"${hidden ? ' aria-hidden="true"' : ""}>${renderIcon(icon, "wf-icon")}<span>${escapeHtml(item)}</span></span>`,
      )
      .join("");

  const label = opts.label ? ` aria-label="${escapeAttribute(opts.label)}"` : "";
  return `
    <div class="wf-clinic-marquee"${label}>
      <div class="wf-clinic-marquee-track">${renderSet(false)}${renderSet(true)}</div>
    </div>
  `;
}

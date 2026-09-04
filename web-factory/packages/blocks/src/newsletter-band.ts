import { escapeAttribute, escapeHtml } from "./escape";

/**
 * newsletter-band — the closing capture for the visitor who is not ready today.
 *
 * From find-realestate-editorial (section 5, job conversion, layout centered,
 * content [heading, form]). Model note: "En ONIA este campo alimenta el pipeline
 * con atribucion ?src=", so `source` is appended as a hidden field rather than
 * being left to the caller to remember.
 *
 * Motion (verbatim from the model):
 *   entrance "fade + rise" · trigger in-view · easing [0.22, 1, 0.36, 1]
 *   duration 0.6s · stagger 0 · no hover · reducedMotion "estatico"
 */

export type NewsletterBandProps = {
  heading: string;
  copy?: string;
  /** Form endpoint. Empty renders no form — a fake input is worse than none. */
  action: string;
  buttonLabel?: string;
  fieldLabel?: string;
  /** Attribution value posted as `src`, matching the lead pipeline in production. */
  source?: string;
  /** Small print under the form (what the visitor is signing up for). */
  note?: string;
  id?: string;
};

export function renderNewsletterBand({
  heading,
  copy,
  action,
  buttonLabel = "Suscribirme",
  fieldLabel = "Tu correo",
  source,
  note,
  id = "novedades",
}: NewsletterBandProps): string {
  const title = heading.trim();
  if (!title) return "";

  const headingId = `${id}-heading`;
  const fieldId = `${id}-email`;
  const form = action.trim()
    ? `<form class="wf-news-form" action="${escapeAttribute(action.trim())}" method="post">
        <label class="wf-news-field">
          <span class="wf-news-label" id="${fieldId}-label">${escapeHtml(fieldLabel)}</span>
          <input class="wf-news-input" id="${fieldId}" type="email" name="email"
                 autocomplete="email" required placeholder="nombre@correo.com"
                 aria-labelledby="${fieldId}-label">
        </label>
        ${source?.trim() ? `<input type="hidden" name="src" value="${escapeAttribute(source.trim())}">` : ""}
        <button class="wf-news-button" type="submit">${escapeHtml(buttonLabel)}</button>
      </form>`
    : "";

  return `
    <section class="wf-news" id="${escapeAttribute(id)}" aria-labelledby="${headingId}">
      <div class="wf-news-inner wf-reveal">
        <h2 class="wf-news-heading" id="${headingId}">${escapeHtml(title)}</h2>
        ${copy?.trim() ? `<p class="wf-news-copy">${escapeHtml(copy.trim())}</p>` : ""}
        ${form}
        ${note?.trim() ? `<p class="wf-news-note">${escapeHtml(note.trim())}</p>` : ""}
      </div>
    </section>
  `;
}

/**
 * Token-only styles. The band inverts to the client's ink so the last screen
 * before the footer changes weight instead of being one more cream section.
 * Note: no backticks in this file's CSS comments -- it lives inside a template
 * literal and a stray backtick ends the string mid-stylesheet.
 */
export const NEWSLETTER_BAND_CSS = `
.wf-news {
  margin-top: clamp(40px, 6vw, 80px);
  padding: clamp(56px, 9vw, 112px) 20px;
  background: var(--color-fg);
  color: var(--color-bg);
}

.wf-news-inner {
  width: min(680px, 100%);
  margin: 0 auto;
  text-align: center;
}

.wf-news-heading {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.8rem, 4.2vw, 3rem);
  line-height: 1.06;
  letter-spacing: -0.02em;
  font-weight: 500;
}

.wf-news-copy {
  margin: 16px auto 0;
  max-width: 46ch;
  color: color-mix(in srgb, var(--color-bg) 78%, transparent);
  line-height: 1.6;
}

.wf-news-form {
  display: flex;
  gap: 10px;
  margin-top: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

.wf-news-field {
  flex: 1 1 260px;
  min-width: 0;
  text-align: left;
}

/* Visible label, not a placeholder pretending to be one. */
.wf-news-label {
  display: block;
  margin-bottom: 6px;
  color: color-mix(in srgb, var(--color-bg) 70%, transparent);
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.wf-news-input {
  width: 100%;
  min-height: 52px;
  padding: 0 18px;
  border: 1px solid color-mix(in srgb, var(--color-bg) 34%, transparent);
  border-radius: 999px;
  background: transparent;
  color: var(--color-bg);
  font: inherit;
}

.wf-news-input::placeholder {
  color: color-mix(in srgb, var(--color-bg) 45%, transparent);
}

.wf-news-input:focus-visible,
.wf-news-button:focus-visible {
  outline: 2px solid var(--color-bg);
  outline-offset: 3px;
}

.wf-news-button {
  align-self: flex-end;
  min-height: 52px;
  padding: 0 28px;
  border: 0;
  border-radius: 999px;
  background: var(--color-bg);
  color: var(--color-fg);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: background-color .3s var(--wf-ease, ease);
}

.wf-news-button:hover {
  background: color-mix(in srgb, var(--color-bg) 86%, var(--color-primary));
}

.wf-news-note {
  margin-top: 16px;
  color: color-mix(in srgb, var(--color-bg) 60%, transparent);
  font-size: 0.84rem;
}

@media (max-width: 560px) {
  .wf-news-field,
  .wf-news-button {
    flex: 1 1 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wf-news-button {
    transition: none;
  }
}
`.trim();

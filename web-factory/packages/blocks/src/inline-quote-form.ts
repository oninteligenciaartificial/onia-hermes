import { escapeAttribute, escapeHtml } from "./escape";

/**
 * inline-quote-form — the conversion section for a rubro where the lead is a
 * QUOTE, not a newsletter: the visitor states what they need and gets priced.
 *
 * From unitedcarriers-logistics (section 4, job conversion, layout split,
 * content [heading, form, contacto-directo]). Model note: "Cotizacion inline: en
 * logistica el lead pide origen, destino, tipo de carga y volumen." The fields
 * are therefore a prop, not hardcoded: the same block serves importacion,
 * distribucion or instalacion, which is exactly what the model claims it is for.
 *
 * Motion (verbatim from the model):
 *   entrance "fade + rise del formulario" · trigger in-view
 *   easing [0.22, 1, 0.36, 1] · duration 0.6s · stagger 0 · reducedMotion "estatico"
 * Mapped to `wf-reveal`; motion.ts renders it final under reduced motion.
 *
 * Two honesty rules borrowed from newsletter-band and kept here:
 *   · no action, no form (a dead input is worse than none) — but the direct
 *     contacts still render, because that IS the conversion path meanwhile.
 *   · `source` travels as a hidden `src` field, so the lead lands in the pipeline
 *     already attributed.
 */

export type QuoteFieldType = "text" | "email" | "tel" | "number" | "date" | "textarea" | "select";

export type QuoteField = {
  /** Form field name, as the endpoint expects it. */
  name: string;
  label: string;
  type?: QuoteFieldType;
  required?: boolean;
  /** Options for type "select". Ignored otherwise. */
  options?: ReadonlyArray<string>;
  placeholder?: string;
  autocomplete?: string;
  /** Full-width row instead of half (textarea defaults to full). */
  wide?: boolean;
};

export type QuoteContact = {
  label: string;
  value: string;
  /** tel:, mailto: or a WhatsApp link. Without it the value renders as text. */
  url?: string;
};

export type InlineQuoteFormProps = {
  heading: string;
  /** Form endpoint. Empty renders the section without a form. */
  action: string;
  fields: ReadonlyArray<QuoteField>;
  copy?: string;
  submitLabel?: string;
  /** Attribution value posted as `src`, matching the lead pipeline in production. */
  source?: string;
  /** Small print under the form (response time, what happens next). */
  note?: string;
  /** Direct channels for the visitor who will not fill a form. */
  direct?: ReadonlyArray<QuoteContact>;
  directLabel?: string;
  id?: string;
};

export function renderInlineQuoteForm({
  heading,
  action,
  fields,
  copy,
  submitLabel = "Pedir cotizacion",
  source,
  note,
  direct = [],
  directLabel = "O escribinos directo",
  id = "cotizacion",
}: InlineQuoteFormProps): string {
  const title = heading.trim();
  if (!title) return "";

  const headingId = `${id}-heading`;
  const usable = fields.filter((field) => field.name.trim() && field.label.trim());
  const rows = usable.map((field) => renderField(id, field)).join("");

  const form =
    action.trim() && rows
      ? `<form class="wf-qf-form" action="${escapeAttribute(action.trim())}" method="post">
          <div class="wf-qf-grid">${rows}</div>
          ${source?.trim() ? `<input type="hidden" name="src" value="${escapeAttribute(source.trim())}">` : ""}
          <button class="wf-qf-submit" type="submit">${escapeHtml(submitLabel)}</button>
          ${note?.trim() ? `<p class="wf-qf-note">${escapeHtml(note.trim())}</p>` : ""}
        </form>`
      : "";

  const channels = direct.filter((item) => item.value.trim().length > 0);
  const directList = channels.length
    ? `<div class="wf-qf-direct">
        <p class="wf-qf-direct-label">${escapeHtml(directLabel)}</p>
        <ul class="wf-qf-direct-list">
          ${channels
            .map((item) => {
              const value = escapeHtml(item.value.trim());
              const body = item.url?.trim()
                ? `<a class="wf-qf-direct-link" href="${escapeAttribute(item.url.trim())}">${value}</a>`
                : `<span class="wf-qf-direct-text">${value}</span>`;
              return `<li class="wf-qf-direct-item">
                  <span class="wf-qf-direct-key">${escapeHtml(item.label)}</span>
                  ${body}
                </li>`;
            })
            .join("")}
        </ul>
      </div>`
    : "";

  return `
    <section class="wf-qf" id="${escapeAttribute(id)}" aria-labelledby="${headingId}">
      <div class="wf-qf-inner wf-reveal">
        <div class="wf-qf-copy">
          <h2 class="wf-qf-heading" id="${headingId}">${escapeHtml(title)}</h2>
          ${copy?.trim() ? `<p class="wf-qf-lede">${escapeHtml(copy.trim())}</p>` : ""}
          ${directList}
        </div>
        ${form}
      </div>
    </section>
  `;
}

function renderField(formId: string, field: QuoteField): string {
  const type = field.type ?? "text";
  const fieldId = `${formId}-${field.name.trim()}`;
  const name = escapeAttribute(field.name.trim());
  const required = field.required ? " required" : "";
  const placeholder = field.placeholder?.trim()
    ? ` placeholder="${escapeAttribute(field.placeholder.trim())}"`
    : "";
  const autocomplete = field.autocomplete?.trim()
    ? ` autocomplete="${escapeAttribute(field.autocomplete.trim())}"`
    : "";
  const wide = field.wide || type === "textarea" || type === "select" ? " wf-qf-row-wide" : "";

  let control: string;
  if (type === "textarea") {
    control = `<textarea class="wf-qf-input wf-qf-area" id="${escapeAttribute(fieldId)}" name="${name}" rows="3"${required}${placeholder}></textarea>`;
  } else if (type === "select") {
    // Empty first option so the browser's required check catches an untouched
    // select instead of silently submitting the first item.
    const options = (field.options ?? [])
      .filter((option) => option.trim().length > 0)
      .map((option) => `<option value="${escapeAttribute(option.trim())}">${escapeHtml(option.trim())}</option>`)
      .join("");
    control = `<select class="wf-qf-input wf-qf-select" id="${escapeAttribute(fieldId)}" name="${name}"${required}>
        <option value="">Elegir…</option>
        ${options}
      </select>`;
  } else {
    control = `<input class="wf-qf-input" id="${escapeAttribute(fieldId)}" name="${name}" type="${escapeAttribute(type)}"${required}${placeholder}${autocomplete}>`;
  }

  // The required hint is a word, not an asterisk and not a color.
  return `<div class="wf-qf-row${wide}">
      <label class="wf-qf-label" for="${escapeAttribute(fieldId)}">
        ${escapeHtml(field.label.trim())}${field.required ? ` <span class="wf-qf-req">(obligatorio)</span>` : ""}
      </label>
      ${control}
    </div>`;
}

/**
 * Token-only styles. The form sits on a surface panel so the closing section
 * changes weight without inverting the whole page; --color-surface is honored
 * when the template defines the role and falls back to a token mix otherwise.
 * Note: no backticks in this file's CSS comments -- it lives inside a template
 * literal and a stray backtick ends the string mid-stylesheet.
 */
export const INLINE_QUOTE_FORM_CSS = `
.wf-qf {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
  padding: clamp(48px, 7vw, 96px) 0;
}

.wf-qf-inner {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 56px);
  align-items: start;
  --wf-dur: .6s;
}

.wf-qf-heading {
  max-width: 16ch;
  font-family: var(--font-heading);
  font-size: clamp(1.9rem, 4vw, 3rem);
  line-height: 1.04;
  letter-spacing: -0.02em;
  font-weight: 500;
}

.wf-qf-lede {
  margin-top: 16px;
  max-width: 44ch;
  color: color-mix(in srgb, var(--color-fg) 78%, var(--color-bg));
  line-height: 1.6;
}

.wf-qf-direct {
  margin-top: clamp(24px, 3vw, 36px);
}

.wf-qf-direct-label {
  color: color-mix(in srgb, var(--color-fg) 66%, var(--color-bg));
  font-size: 0.78rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.wf-qf-direct-list {
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 2px;
}

.wf-qf-direct-item {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 14px;
  padding: 8px 0;
  border-top: 1px solid color-mix(in srgb, var(--color-fg) 12%, transparent);
}

.wf-qf-direct-key {
  min-width: 8ch;
  color: color-mix(in srgb, var(--color-fg) 66%, var(--color-bg));
  font-size: 0.86rem;
}

.wf-qf-direct-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1px;
  text-decoration-color: color-mix(in srgb, var(--color-primary) 70%, transparent);
}

.wf-qf-direct-link:hover {
  text-decoration-color: currentColor;
}

.wf-qf-form {
  padding: clamp(20px, 3vw, 34px);
  border: 1px solid color-mix(in srgb, var(--color-fg) 14%, transparent);
  border-radius: 16px;
  background: var(--color-surface, color-mix(in srgb, var(--color-fg) 5%, var(--color-bg)));
}

.wf-qf-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.wf-qf-row-wide {
  grid-column: 1 / -1;
}

.wf-qf-label {
  display: block;
  margin-bottom: 6px;
  font-size: 0.82rem;
  letter-spacing: 0.04em;
}

.wf-qf-req {
  color: color-mix(in srgb, var(--color-fg) 66%, var(--color-bg));
  font-size: 0.76rem;
  letter-spacing: 0;
}

.wf-qf-input {
  width: 100%;
  min-height: 48px;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, var(--color-fg) 28%, transparent);
  border-radius: 10px;
  background: var(--color-bg);
  color: var(--color-fg);
  font: inherit;
  transition: border-color .2s var(--wf-ease, ease);
}

.wf-qf-area {
  min-height: 96px;
  resize: vertical;
}

.wf-qf-input::placeholder {
  color: color-mix(in srgb, var(--color-fg) 52%, var(--color-bg));
}

.wf-qf-input:hover {
  border-color: color-mix(in srgb, var(--color-fg) 44%, transparent);
}

.wf-qf-input:focus-visible,
.wf-qf-submit:focus-visible,
.wf-qf-direct-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.wf-qf-submit {
  width: 100%;
  min-height: 52px;
  margin-top: 20px;
  padding: 0 26px;
  border: 0;
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--color-on-primary);
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: background-color .3s var(--wf-ease, ease);
}

.wf-qf-submit:hover {
  background: color-mix(in srgb, var(--color-primary) 86%, var(--color-fg));
}

.wf-qf-note {
  margin-top: 14px;
  color: color-mix(in srgb, var(--color-fg) 66%, var(--color-bg));
  font-size: 0.82rem;
  line-height: 1.5;
}

@media (max-width: 860px) {
  .wf-qf-inner {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 520px) {
  .wf-qf-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wf-qf-input,
  .wf-qf-submit {
    transition: none;
  }
}
`.trim();

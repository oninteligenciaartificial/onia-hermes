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

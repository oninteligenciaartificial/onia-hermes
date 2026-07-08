import { escapeHtml } from "./escape";
import type { SiteClient } from "./types";

// Process: what happens after contact. Verb-led steps reduce booking anxiety.
export function renderProcess(client: SiteClient): string {
  const steps = client.proceso ?? [];
  if (steps.length === 0) return "";

  const kicker = escapeHtml(client.procesoKicker ?? "Como funciona");
  const titulo = escapeHtml(client.procesoTitulo ?? "De tu mensaje a tu cita, sin vueltas");

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
        <p class="wf-kicker">${kicker}</p>
        <h2 id="wf-process-heading">${titulo}</h2>
      </div>
      <ol class="wf-process-list">
        ${items}
      </ol>
    </section>
  `;
}

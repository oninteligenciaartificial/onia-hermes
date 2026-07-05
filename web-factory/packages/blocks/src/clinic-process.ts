import { escapeHtml } from "./escape";
import type { SiteClient } from "./types";

// Process as a connected timeline (not four identical cards): numbered nodes
// joined by a line, horizontal on desktop and vertical on mobile.
export function renderClinicProcess(client: SiteClient): string {
  const steps = client.proceso ?? [];
  if (steps.length === 0) return "";

  const items = steps
    .map(
      (step, index) => `
        <li class="wf-clinic-step">
          <span class="wf-clinic-step-num">${String(index + 1).padStart(2, "0")}</span>
          <div class="wf-clinic-step-body">
            <h3>${escapeHtml(step.titulo)}</h3>
            <p>${escapeHtml(step.desc)}</p>
          </div>
        </li>
      `,
    )
    .join("");

  return `
    <section class="wf-clinic-section wf-clinic-process" id="proceso" data-reveal aria-labelledby="wf-clinic-process-h">
      <div class="wf-clinic-section-head">
        <p class="wf-clinic-kicker">Cómo funciona</p>
        <h2 id="wf-clinic-process-h">De tu mensaje a tu cita, sin vueltas</h2>
      </div>
      <ol class="wf-clinic-timeline">
        ${items}
      </ol>
    </section>
  `;
}

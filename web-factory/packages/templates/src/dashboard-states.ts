// Always-visible reference for the 3 interface states (loading/empty/error).
// Real products wire .wf-dash-card--loading / .wf-dash-error to their own
// async state; this section exists so the pattern is inspectable without
// needing to trigger a hidden interaction first.
export function renderStatesShowcase(enabled: boolean): string {
  if (!enabled) {
    return "";
  }

  return `
        <section class="wf-dash-states" id="estados" aria-label="Estados de la interfaz">
          <h2 class="wf-dash-table-head-title">Estados de la interfaz</h2>
          <div class="wf-dash-states-grid">
            <div class="wf-dash-card wf-dash-card--compact wf-dash-card--loading" aria-hidden="true">
              <span class="wf-dash-shimmer wf-dash-shimmer--label"></span>
              <span class="wf-dash-shimmer wf-dash-shimmer--value"></span>
              <span class="wf-dash-shimmer wf-dash-shimmer--foot"></span>
            </div>
            <div class="wf-dash-card wf-dash-empty" role="status">
              <strong>Sin datos</strong>
              <span>Esta seccion se completa cuando llegan los datos.</span>
            </div>
            <div class="wf-dash-card wf-dash-error" role="alert">
              <span class="wf-dash-error-icon" aria-hidden="true">&#9888;</span>
              <strong>No se pudo cargar</strong>
              <span>Revisa tu conexion o intenta de nuevo.</span>
              <button type="button" class="wf-dash-chip" data-dash-retry>Reintentar</button>
            </div>
          </div>
        </section>`;
}

export const dashboardStatesCss = `
.wf-dash-states-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.wf-dash-card--loading {
  gap: 10px;
}

.wf-dash-shimmer {
  display: block;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--color-fg) 8%, transparent) 25%,
    color-mix(in srgb, var(--color-fg) 14%, transparent) 37%,
    color-mix(in srgb, var(--color-fg) 8%, transparent) 63%
  );
  background-size: 200% 100%;
}

.wf-dash-shimmer--label {
  width: 40%;
  height: 12px;
}

.wf-dash-shimmer--value {
  width: 65%;
  height: 26px;
}

.wf-dash-shimmer--foot {
  width: 50%;
  height: 12px;
}

@media (prefers-reduced-motion: no-preference) {
  .wf-dash-shimmer {
    animation: wfDashShimmer 1.4s ease-in-out infinite;
  }
}

@keyframes wfDashShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.wf-dash-error {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  border-color: color-mix(in srgb, var(--wf-neg) 40%, var(--border));
}

.wf-dash-error-icon {
  font-size: 1.3rem;
  color: var(--wf-neg);
}
`;

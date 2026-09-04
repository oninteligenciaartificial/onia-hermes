import { ClipboardCheck, Layers3 } from "lucide-react";
import type { ServiceScope, WebDiagnostic } from "../types";
import { DetailList, SectionPanel } from "./ui";

export function WebDiagnosticsSection({
  diagnostics,
  scopes,
}: {
  diagnostics: WebDiagnostic[];
  scopes: ServiceScope[];
}) {
  return (
    <SectionPanel
      id="webs"
      label="Venta de webs"
      title="Diagnostico antes de cotizar"
      description="Esta seccion evita vender una web cuando el cliente realmente necesita CRM, automatizacion o discovery de sistema."
      icon={ClipboardCheck}
      action={<span className="seller-section-count">{diagnostics.length} checks</span>}
    >
      <div className="seller-diagnostics-layout">
        <div className="seller-diagnostics-list">
          {diagnostics.map((item) => (
            <article key={item.id}>
              <div>
                <strong>{item.label}</strong>
                <p>{item.whyItMatters}</p>
              </div>
              <dl>
                <div>
                  <dt>Senal de problema</dt>
                  <dd>{item.missingSignal}</dd>
                </div>
                <div>
                  <dt>Oferta sugerida</dt>
                  <dd>{item.offer}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>

        <aside className="seller-scope-panel">
          <div className="seller-scope-panel__heading">
            <Layers3 size={16} />
            <strong>Alcance por servicio</strong>
          </div>
          {scopes.map((scope) => (
            <article className="seller-scope-card" key={scope.id}>
              <strong>{scope.service}</strong>
              <DetailList title="Incluye" items={scope.includes} />
              <DetailList title="Necesita" items={scope.needs} />
              <p>{scope.notIncluded}</p>
            </article>
          ))}
        </aside>
      </div>
    </SectionPanel>
  );
}

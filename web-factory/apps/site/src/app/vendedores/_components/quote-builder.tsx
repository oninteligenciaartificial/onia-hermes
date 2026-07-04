"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Calculator, Check, FileDown, Gift, Minus, Plus, RotateCcw } from "lucide-react";
import { freeHooks, quoteGroups, quoteRules, type QuoteComponent } from "../cotizador-data";

type Selection = Record<string, number>;

interface QuoteLine {
  label: string;
  price: number;
  qty: number;
  kind: "oneoff" | "monthly";
}

const componentIndex: Record<string, QuoteComponent> = Object.fromEntries(
  quoteGroups.flatMap((group) => group.components.map((component) => [component.id, component])),
);

function formatBs(value: number): string {
  return `Bs ${value.toLocaleString("es-BO", { maximumFractionDigits: 2 })}`;
}

// Cotizacion client-facing con el diseño del generador ONIA. Sin comision ni datos internos.
function buildClientQuoteHtml(lines: QuoteLine[], oneoff: number, monthly: number): string {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const fecha = new Date().toLocaleDateString("es-BO", { year: "numeric", month: "long", day: "numeric" });
  const row = (line: QuoteLine, suffix: string) =>
    `<tr><td>${line.qty > 1 ? `${line.qty} x ` : ""}${esc(line.label)}</td><td class="num">${formatBs(line.price * line.qty)}${suffix}</td></tr>`;
  const oneoffRows = lines.filter((l) => l.kind === "oneoff").map((l) => row(l, "")).join("");
  const monthlyRows = lines.filter((l) => l.kind === "monthly").map((l) => row(l, "/mes")).join("");

  const oneoffTable = oneoffRows
    ? `<h2>Pago único</h2><table><thead><tr><th>Concepto</th><th class="num">Precio</th></tr></thead><tbody>${oneoffRows}<tr class="total"><td>Total único</td><td class="num">${formatBs(oneoff)}</td></tr></tbody></table>`
    : "";
  const monthlyTable = monthlyRows
    ? `<h2>Mensual</h2><table><thead><tr><th>Concepto</th><th class="num">Precio</th></tr></thead><tbody>${monthlyRows}<tr class="total"><td>Total mensual</td><td class="num">${formatBs(monthly)}/mes</td></tr></tbody></table>`
    : "";

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cotización ONIA</title><style>
  :root{--ink:#101827;--muted:#526172;--line:#d8e0ea;--blue:#1e5bff;--green:#0f8b62;--bg:#f6f8fb;--white:#fff;}
  *{box-sizing:border-box;}
  body{margin:0;font-family:Arial,Helvetica,sans-serif;color:var(--ink);background:var(--bg);}
  .wrap{max-width:820px;margin:0 auto;padding:40px 32px;}
  .brand{font-size:13px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--blue);}
  h1{font-size:30px;margin:6px 0 2px;}
  .meta{color:var(--muted);font-size:14px;margin-bottom:8px;}
  h2{font-size:20px;margin:26px 0 12px;border-bottom:3px solid var(--blue);padding-bottom:6px;}
  p{font-size:15px;line-height:1.55;color:var(--muted);}
  table{width:100%;border-collapse:collapse;background:var(--white);border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-bottom:10px;}
  th,td{padding:11px 14px;text-align:left;font-size:15px;border-bottom:1px solid var(--line);}
  th{background:#eef3fb;font-weight:800;}
  td.num,th.num{text-align:right;white-space:nowrap;}
  tr.total td{font-weight:800;color:var(--ink);background:#f3f7ff;border-top:2px solid var(--line);}
  .note{background:var(--white);border:1px solid var(--line);border-radius:10px;padding:14px 16px;margin-top:16px;font-size:13px;color:var(--muted);}
  .foot{margin-top:22px;border-top:1px solid var(--line);padding-top:14px;font-size:12px;color:var(--muted);}
  .actions{margin-bottom:18px;}
  button{background:var(--blue);color:#fff;border:0;border-radius:8px;padding:9px 16px;font-weight:800;font-size:14px;cursor:pointer;}
  @media print{.actions{display:none;}body{background:#fff;}}
  </style></head><body><div class="wrap">
  <div class="actions"><button onclick="window.print()">Imprimir / Guardar PDF</button></div>
  <div class="brand">ONIA</div>
  <h1>Cotización</h1>
  <div class="meta">Fecha: ${fecha}</div>
  <p>Propuesta de servicios ONIA. Precios de arranque, válidos 30 días. El anticipo reserva el precio y la fecha de inicio.</p>
  ${oneoffTable}
  ${monthlyTable}
  <div class="note"><strong>No incluido (lo paga el cliente):</strong> dominio, hosting, correo, comisión de pasarela, QR/banco, mensajería y plantillas de Meta/WhatsApp, créditos de IA, pauta publicitaria, migración masiva y fotos profesionales. Dominio y hosting van a nombre del cliente.</div>
  <div class="foot">Cotización referencial sujeta a alcance confirmado. WhatsApp automático requiere validación de Meta. ONIA — Inteligencia Artificial aplicada a tu negocio.</div>
  </div></body></html>`;
}

interface Totals {
  clientOneoff: number;
  clientMonthly: number;
  commission: number;
  oniaFirst: number; // primer cobro que queda a ONIA (unico + primer mes - comision)
  oniaMonthly: number; // recurrente completo desde el mes 2
}

function computeTotals(selection: Selection): Totals {
  let clientOneoff = 0;
  let clientMonthly = 0;
  let commission = 0;

  for (const [id, qty] of Object.entries(selection)) {
    if (!qty) continue;
    const component = componentIndex[id];
    if (!component) continue;

    const lineTotal = component.price * qty;
    if (component.kind === "oneoff") {
      clientOneoff += lineTotal;
    } else {
      clientMonthly += lineTotal;
    }
    // Comision = % del primer pago (una sola vez), tanto en unico como en primer mes.
    commission += lineTotal * component.commissionRate;
  }

  return {
    clientOneoff,
    clientMonthly,
    commission,
    oniaFirst: clientOneoff + clientMonthly - commission,
    oniaMonthly: clientMonthly,
  };
}

export function QuoteBuilder() {
  const [selection, setSelection] = useState<Selection>({});

  const totals = useMemo(() => computeTotals(selection), [selection]);
  const selectedIds = Object.keys(selection).filter((id) => selection[id] > 0);

  function toggle(id: string) {
    setSelection((current) => {
      const next = { ...current };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = 1;
      }
      return next;
    });
  }

  function setQty(id: string, qty: number) {
    setSelection((current) => {
      const next = { ...current };
      if (qty <= 0) {
        delete next[id];
      } else {
        next[id] = qty;
      }
      return next;
    });
  }

  function exportQuote() {
    const lines: QuoteLine[] = selectedIds.map((id) => {
      const component = componentIndex[id];
      return { label: component.label, price: component.price, qty: selection[id], kind: component.kind };
    });
    const html = buildClientQuoteHtml(lines, totals.clientOneoff, totals.clientMonthly);
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
    }
  }

  return (
    <div className="seller-quote">
      <div className="seller-quote__catalog">
        {quoteGroups.map((group) => (
          <section className="seller-quote-group" key={group.id}>
            <header>
              <strong>{group.title}</strong>
              <small>{group.hint}</small>
            </header>
            <div className="seller-quote-rows">
              {group.components.map((component) => {
                const qty = selection[component.id] ?? 0;
                const active = qty > 0;
                return (
                  <div className={`seller-quote-row${active ? " is-active" : ""}`} key={component.id}>
                    <button type="button" className="seller-quote-check" onClick={() => toggle(component.id)} aria-pressed={active}>
                      {active ? <Check size={14} /> : <Plus size={14} />}
                    </button>
                    <div className="seller-quote-row__body">
                      <span className="seller-quote-row__label">
                        {component.label}
                        {component.needsApproval ? (
                          <span className="seller-quote-approval" title="Requiere aprobacion / validacion Meta">
                            <AlertTriangle size={11} /> aprobar
                          </span>
                        ) : null}
                      </span>
                      <span className="seller-quote-row__price">
                        {formatBs(component.price)}
                        {component.kind === "monthly" ? "/mes" : ""}
                        {" · comision "}
                        {Math.round(component.commissionRate * 100)}%
                      </span>
                      {component.note ? <span className="seller-quote-row__note">{component.note}</span> : null}
                    </div>
                    {active ? (
                      <div className="seller-quote-qty">
                        <button type="button" onClick={() => setQty(component.id, qty - 1)} aria-label="Quitar uno">
                          <Minus size={13} />
                        </button>
                        <input
                          type="number"
                          min={1}
                          value={qty}
                          onChange={(event) => setQty(component.id, Number.parseInt(event.target.value, 10) || 0)}
                        />
                        <button type="button" onClick={() => setQty(component.id, qty + 1)} aria-label="Agregar uno">
                          <Plus size={13} />
                        </button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        <section className="seller-quote-group is-hooks">
          <header>
            <strong>
              <Gift size={14} /> Gancho gratis
            </strong>
            <small>No se cobran por ahora. Sirven para abrir la venta.</small>
          </header>
          <ul className="seller-quote-hooks">
            {freeHooks.map((hook) => (
              <li key={hook}>{hook}</li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="seller-quote__summary">
        <div className="seller-quote-cards">
          <article className="seller-quote-card is-client">
            <span>Cliente paga</span>
            <strong>{formatBs(totals.clientOneoff)}</strong>
            <small>unico</small>
            {totals.clientMonthly > 0 ? <p>+ {formatBs(totals.clientMonthly)}/mes recurrente</p> : null}
          </article>
          <article className="seller-quote-card is-arthur">
            <span>Comision vendedora</span>
            <strong>{formatBs(totals.commission)}</strong>
            <small>una vez, sobre el primer pago</small>
          </article>
          <article className="seller-quote-card is-onia">
            <span>Queda en ONIA</span>
            <strong>{formatBs(totals.oniaFirst)}</strong>
            <small>primer cobro (unico + 1er mes - comision)</small>
            {totals.oniaMonthly > 0 ? <p>luego {formatBs(totals.oniaMonthly)}/mes completo</p> : null}
          </article>
        </div>

        <button type="button" className="seller-quote-export" onClick={exportQuote} disabled={selectedIds.length === 0}>
          <FileDown size={15} /> Exportar cotización (cliente)
        </button>

        <div className="seller-quote-breakdown">
          <div>
            <span>Primer pago total del cliente</span>
            <strong>{formatBs(totals.clientOneoff + totals.clientMonthly)}</strong>
          </div>
          <div>
            <span>Recurrente ONIA (desde mes 2)</span>
            <strong>{formatBs(totals.oniaMonthly)}/mes</strong>
          </div>
        </div>

        {selectedIds.length > 0 ? (
          <div className="seller-quote-selected">
            <div className="seller-quote-selected__head">
              <strong>Detalle ({selectedIds.length})</strong>
              <button type="button" onClick={() => setSelection({})}>
                <RotateCcw size={12} /> Limpiar
              </button>
            </div>
            <ul>
              {selectedIds.map((id) => {
                const component = componentIndex[id];
                const qty = selection[id];
                return (
                  <li key={id}>
                    <span>
                      {qty > 1 ? `${qty} x ` : ""}
                      {component.label}
                    </span>
                    <span>
                      {formatBs(component.price * qty)}
                      {component.kind === "monthly" ? "/mes" : ""}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <p className="seller-quote-empty">
            <Calculator size={15} /> Elegi componentes del catalogo para armar la cotizacion.
          </p>
        )}

        <div className="seller-quote-rules">
          {quoteRules.map((rule) => (
            <p key={rule}>{rule}</p>
          ))}
        </div>
      </aside>
    </div>
  );
}

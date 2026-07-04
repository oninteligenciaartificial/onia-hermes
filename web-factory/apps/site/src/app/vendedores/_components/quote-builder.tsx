"use client";

import { useMemo, useState } from "react";
import { Calculator, Check, Minus, Plus, RotateCcw } from "lucide-react";
import {
  FONDO_RATE,
  SKIM_RATE,
  quoteGroups,
  quoteRules,
  type QuoteComponent,
} from "../cotizador-data";

type Selection = Record<string, number>;
type WebScenario = "close" | "full";

const componentIndex: Record<string, QuoteComponent> = Object.fromEntries(
  quoteGroups.flatMap((group) => group.components.map((component) => [component.id, component])),
);

function formatBs(value: number): string {
  return `Bs ${value.toLocaleString("es-BO", { maximumFractionDigits: 2 })}`;
}

interface Totals {
  clientOneoff: number;
  clientMonthly: number;
  arthurOnce: number;
  arthurMonthly: number;
  skim: number;
  fondo: number;
  oniaOneoff: number;
  oniaMonthly: number;
}

function computeTotals(selection: Selection, scenario: WebScenario, onboarded: boolean): Totals {
  let clientOneoff = 0;
  let clientMonthly = 0;
  let arthurOnce = 0;
  let arthurMonthly = 0;

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

    const commission = component.commission;
    switch (commission.type) {
      case "web":
        arthurOnce += lineTotal * (scenario === "full" ? commission.full : commission.close);
        break;
      case "saasMonthly":
        arthurOnce += lineTotal * commission.firstMonth; // % del primer mes, una vez
        break;
      case "setup":
        arthurOnce += lineTotal * (onboarded ? commission.onboarded : commission.sold);
        break;
      case "oneoffShare":
        arthurOnce += lineTotal * commission.rate;
        break;
      case "monthlyShare":
        arthurMonthly += lineTotal * commission.rate;
        break;
      default:
        break;
    }
  }

  const skim = clientOneoff * SKIM_RATE;
  const base = clientOneoff - skim;
  const fondo = base * FONDO_RATE;

  return {
    clientOneoff,
    clientMonthly,
    arthurOnce,
    arthurMonthly,
    skim,
    fondo,
    oniaOneoff: clientOneoff - arthurOnce,
    oniaMonthly: clientMonthly - arthurMonthly,
  };
}

export function QuoteBuilder() {
  const [selection, setSelection] = useState<Selection>({});
  const [scenario, setScenario] = useState<WebScenario>("close");
  const [onboarded, setOnboarded] = useState(true);

  const totals = useMemo(() => computeTotals(selection, scenario, onboarded), [selection, scenario, onboarded]);
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
                      <span className="seller-quote-row__label">{component.label}</span>
                      <span className="seller-quote-row__price">
                        {formatBs(component.price)}
                        {component.kind === "monthly" ? "/mes" : ""}
                        {component.perSeat ? " x asiento" : ""}
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
      </div>

      <aside className="seller-quote__summary">
        <div className="seller-quote-controls">
          <div className="seller-quote-toggle">
            <span>Rol de Arthur en webs</span>
            <div>
              <button type="button" className={scenario === "close" ? "is-on" : ""} onClick={() => setScenario("close")}>
                Cierra (15%)
              </button>
              <button type="button" className={scenario === "full" ? "is-on" : ""} onClick={() => setScenario("full")}>
                Hace todo (50%)
              </button>
            </div>
          </div>
          <label className="seller-quote-switch">
            <input type="checkbox" checked={onboarded} onChange={(event) => setOnboarded(event.target.checked)} />
            <span>Arthur ejecuta el onboarding / setup (40%)</span>
          </label>
        </div>

        <div className="seller-quote-cards">
          <article className="seller-quote-card is-client">
            <span>Cliente paga</span>
            <strong>{formatBs(totals.clientOneoff)}</strong>
            <small>unico</small>
            {totals.clientMonthly > 0 ? <p>+ {formatBs(totals.clientMonthly)}/mes recurrente</p> : null}
          </article>
          <article className="seller-quote-card is-arthur">
            <span>Arthur cobra</span>
            <strong>{formatBs(totals.arthurOnce)}</strong>
            <small>al cerrar</small>
            {totals.arthurMonthly > 0 ? <p>+ {formatBs(totals.arthurMonthly)}/mes mientras produce</p> : null}
          </article>
          <article className="seller-quote-card is-onia">
            <span>Queda en ONIA</span>
            <strong>{formatBs(totals.oniaOneoff)}</strong>
            <small>unico</small>
            {totals.oniaMonthly > 0 ? <p>+ {formatBs(totals.oniaMonthly)}/mes recurrente</p> : null}
          </article>
        </div>

        <div className="seller-quote-breakdown">
          <div>
            <span>Skim recuperacion (10% del unico)</span>
            <strong>{formatBs(totals.skim)}</strong>
          </div>
          <div>
            <span>Fondo ONIA (40% de la base)</span>
            <strong>{formatBs(totals.fondo)}</strong>
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

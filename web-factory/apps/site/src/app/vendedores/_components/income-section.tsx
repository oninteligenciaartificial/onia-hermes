import { Banknote, ReceiptText } from "lucide-react";
import type { Income, Tone } from "../types";
import { SectionPanel, StatusPill } from "./ui";

const incomeTone: Record<Income["status"], Tone> = {
  pendiente: "warning",
  aprobada: "info",
  pagada: "success",
  retenida: "danger",
};

export function IncomeSection({ incomes }: { incomes: Income[] }) {
  return (
    <SectionPanel
      id="ingresos"
      label="Cobros"
      title="Ingresos y comisiones"
      description="La comision estimada no es pago aprobado. ONIA valida cobro real, datos completos y margen antes de pagar."
      icon={Banknote}
      density="compact"
    >
      <div className="seller-income-table">
        <div className="seller-income-head">
          <span>Cliente</span>
          <span>Cobrado</span>
          <span>Neto</span>
          <span>Comision</span>
          <span>Estado</span>
        </div>
        {incomes.map((income) => (
          <article key={income.id}>
            <div className="seller-income-client">
              <strong>{income.client}</strong>
              <span>{income.service}</span>
              <small>
                <ReceiptText size={13} />
                {income.paymentDate}
              </small>
            </div>
            <div className="seller-income-field">
              <small>Cobrado</small>
              <strong>{income.charged}</strong>
            </div>
            <div className="seller-income-field">
              <small>Neto</small>
              <span>{income.netAmount}</span>
            </div>
            <div className="seller-income-field">
              <small>Comision</small>
              <span>{income.commission}</span>
            </div>
            <div className="seller-income-field">
              <small>Estado</small>
              <StatusPill tone={incomeTone[income.status]}>{income.status}</StatusPill>
            </div>
          </article>
        ))}
      </div>
    </SectionPanel>
  );
}

import {
  Banknote,
  CalendarRange,
  ClipboardCheck,
  Gauge,
  Landmark,
  ListChecks,
  ReceiptText,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import type {
  EvidenceGate,
  NuviaClosureRule,
  OperatingCenter,
  OperationSnapshot,
  PaymentCadence,
  PayoutRule,
  Tone,
  WeeklyTarget,
} from "../types";
import { SectionPanel, StatusPill } from "./ui";

const centerTone: Record<OperatingCenter["status"], Tone> = {
  activo: "success",
  vigilado: "warning",
  bloqueado: "danger",
};

const weeklyTone: Record<WeeklyTarget["status"], Tone> = {
  obligatorio: "danger",
  operativo: "info",
};

export function OperationSection({
  snapshot,
  centers,
  payoutRules,
  evidenceGates,
  weeklyTargets,
  nuviaRules,
  paymentCadence,
}: {
  snapshot: OperationSnapshot;
  centers: OperatingCenter[];
  payoutRules: PayoutRule[];
  evidenceGates: EvidenceGate[];
  weeklyTargets: WeeklyTarget[];
  nuviaRules: NuviaClosureRule[];
  paymentCadence: PaymentCadence[];
}) {
  const snapshotItems = [
    { label: "Duracion", value: snapshot.trial, detail: "Desde firma/aceptacion; revision formal al dia 60" },
    { label: "Deuda previa", value: snapshot.debt, detail: "A cargo de Sergio/Onia; Arthur no paga" },
    { label: "Capital interno", value: snapshot.operatingCashAfterDebt, detail: snapshot.runway },
    { label: "Meta operativa", value: snapshot.monthlyNetTarget, detail: "Ventas reales, evidencia y Fondo Onia" },
  ];

  return (
    <div className="seller-operation-stack">
      <SectionPanel
        id="operacion-resumen"
        label="Caja y supervivencia"
        title="Tablero base de 60 dias"
        description="Onia no puede repartir como si todo fuera utilidad. Primero se protege caja, deuda, herramientas y continuidad."
        icon={Gauge}
        density="compact"
      >
        <div className="seller-operation-kpis">
          {snapshotItems.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.detail}</small>
            </article>
          ))}
        </div>

        <div className="seller-operation-ledger">
          <div>
            <span>Inversion Sergio/Onia</span>
            <strong>{snapshot.initialInvestment}</strong>
          </div>
          <div>
            <span>Gasto base mensual</span>
            <strong>{snapshot.monthlyBaseExpense}</strong>
          </div>
          <div>
            <span>Caja chica</span>
            <strong>{snapshot.pettyCash}</strong>
          </div>
          <div>
            <span>Necesidad operativa</span>
            <strong>{snapshot.conservativeMonthlyNeed}</strong>
          </div>
          <div>
            <span>Meta sana 60 dias</span>
            <strong>{snapshot.healthySixtyDayTarget}</strong>
          </div>
        </div>
      </SectionPanel>

      <SectionPanel
        id="centros-operativos"
        label="Centros separados"
        title="Donde vive cada peso"
        description="Cada ingreso o gasto debe caer en un centro. Si se mezcla Onia, Nuvia y media, las comisiones se vuelven imposibles de defender."
        icon={Landmark}
        density="compact"
      >
        <div className="seller-center-list">
          {centers.map((center) => (
            <article className="seller-center-row" key={center.id}>
              <div>
                <span>{center.owner}</span>
                <strong>{center.title}</strong>
                <p>{center.purpose}</p>
              </div>
              <StatusPill tone={centerTone[center.status]}>{center.status}</StatusPill>
              <ul>
                {center.rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel
        id="reglas-pago"
        label="Porcentajes"
        title="Reparto segun participacion real"
        description="La regla central es evidencia + cobro + entrega aprobada. El porcentaje cambia si Arthur solo trae contacto, vende, entrega o si Sergio debe rescatar."
        icon={UsersRound}
        density="compact"
      >
        <div className="seller-policy-table">
          <div className="seller-policy-head">
            <span>Caso</span>
            <span>Fondo</span>
            <span>Arthur</span>
            <span>Sergio</span>
            <span>Condicion</span>
          </div>
          {payoutRules.map((rule) => (
            <article key={rule.id}>
              <strong>{rule.case}</strong>
              <span>{rule.fund}</span>
              <span>{rule.arthur}</span>
              <span>{rule.sergio}</span>
              <p>{rule.condition}</p>
            </article>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel
        id="evidencia"
        label="Bloqueos"
        title="Que debe existir para que cuente"
        description="Esta es la defensa contra peleas: el sistema no pregunta quien hizo mas, revisa pruebas y estados."
        icon={ShieldCheck}
        density="compact"
      >
        <div className="seller-evidence-grid">
          {evidenceGates.map((gate) => (
            <article key={gate.id}>
              <div>
                <ClipboardCheck size={16} />
                <strong>{gate.title}</strong>
              </div>
              <p>{gate.requiredProof}</p>
              <small>{gate.blocks}</small>
              <span>{gate.owner}</span>
            </article>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel
        id="semana"
        label="Obligaciones"
        title="Requisitos semanales por rol"
        description="Arthur puede subir porcentaje si aprende y cumple. Sergio tambien debe revisar, decidir, aprobar y mantener vivo el sistema."
        icon={ListChecks}
        density="compact"
      >
        <div className="seller-weekly-table">
          <div className="seller-weekly-head">
            <span>Area</span>
            <span>Arthur</span>
            <span>Sergio</span>
            <span>Estado</span>
          </div>
          {weeklyTargets.map((target) => (
            <article key={target.id}>
              <strong>{target.area}</strong>
              <p>{target.arthur}</p>
              <p>{target.sergio}</p>
              <StatusPill tone={weeklyTone[target.status]}>{target.status}</StatusPill>
            </article>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel
        id="nuvia"
        label="Nuvia"
        title="Rentabilidad y cierre quincenal"
        description="Nuvia no debe repartir si esta en negativo. Primero se mira margen operativo, herramientas caras, reserva y caja chica."
        icon={ReceiptText}
        density="compact"
      >
        <div className="seller-rule-matrix">
          {nuviaRules.map((rule) => (
            <article key={rule.id}>
              <span>{rule.item}</span>
              <strong>{rule.value}</strong>
              <p>{rule.rule}</p>
            </article>
          ))}
        </div>
      </SectionPanel>

      <SectionPanel
        id="pagos"
        label="Cierres"
        title="Calendario de calculo y pago"
        description="Los pagos deben salir por cierre aprobado, no por conversacion. El sistema debe mostrar estimado, pendiente, aprobado, pagado, retenido o descontado."
        icon={CalendarRange}
        density="compact"
      >
        <div className="seller-payment-timeline">
          {paymentCadence.map((item) => (
            <article key={item.id}>
              <span>
                <Banknote size={15} />
                {item.incomeType}
              </span>
              <p>{item.calculation}</p>
              <strong>{item.payment}</strong>
            </article>
          ))}
        </div>
      </SectionPanel>
    </div>
  );
}

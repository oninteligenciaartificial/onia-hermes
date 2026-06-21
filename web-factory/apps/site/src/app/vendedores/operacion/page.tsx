import {
  evidenceGates,
  nuviaClosureRules,
  operatingCenters,
  operationSnapshot,
  paymentCadence,
  payoutRules,
  sellerScreens,
  weeklyTargets,
} from "../data";
import { OperationSection } from "../_components/operation-section";
import { OperatingBlock, SellerScreenGrid, SellerScreenHeader } from "../_components/screen-chrome";

export default function OperacionPage() {
  return (
    <>
      <SellerScreenHeader screen={sellerScreens.operacion} />
      <SellerScreenGrid
        aside={
          <>
            <OperatingBlock
              title="Regla madre"
              description="Lo que no esta registrado no se considera hecho."
              items={[
                "ONIA Center o Notion es la fuente oficial.",
                "Todo ingreso debe tener centro: ONIA, Nuvia, Media o Caja/Fondo.",
                "Todo gasto debe tener responsable, comprobante y motivo.",
                "Toda comision requiere cobro real, evidencia y aprobacion.",
              ]}
            />
            <OperatingBlock
              title="Caja roja"
              description="Cuando Sergio/ONIA activa caja roja, se deja de experimentar."
              items={[
                "Congelar herramientas nuevas y compras no criticas.",
                "Priorizar ventas cobrables, entregas pendientes y seguimiento.",
                "No repartir si Fondo ONIA no cubre herramientas criticas.",
                "Nuvia no usa Higgsfield/pauta si rompe margen minimo.",
              ]}
            />
            <OperatingBlock
              title="Dia 60"
              description="La revision no debe ser emocional; debe salir del sistema."
              items={[
                "Ventas netas generadas y pipeline real.",
                "Semanas aprobadas y tareas cumplidas.",
                "Calidad de entregas sin rescate de Sergio.",
                "Caja, deuda, Nuvia y herramientas bajo control.",
              ]}
            />
          </>
        }
      >
        <OperationSection
          snapshot={operationSnapshot}
          centers={operatingCenters}
          payoutRules={payoutRules}
          evidenceGates={evidenceGates}
          weeklyTargets={weeklyTargets}
          nuviaRules={nuviaClosureRules}
          paymentCadence={paymentCadence}
        />
      </SellerScreenGrid>
    </>
  );
}

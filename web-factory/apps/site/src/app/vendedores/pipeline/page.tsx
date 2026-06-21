"use client";

import { sellerScreens } from "../data";
import { PipelineSection } from "../_components/pipeline-section";
import { OperatingBlock, SellerScreenGrid, SellerScreenHeader } from "../_components/screen-chrome";
import { useSellerWorkspace } from "../_components/seller-workspace";

export default function PipelinePage() {
  const { leads } = useSellerWorkspace();

  return (
    <>
      <SellerScreenHeader screen={sellerScreens.leads} />
      <SellerScreenGrid
        aside={
          <>
            <OperatingBlock
              title="Orden de trabajo"
              description="Cada lead debe avanzar por decision, no por entusiasmo."
              items={[
                "Nuevo: falta investigacion basica.",
                "Investigado: ya se entiende problema y presencia digital.",
                "Contactado/respondio: existe conversacion real.",
                "Demo/propuesta: hay necesidad validada y oferta concreta.",
              ]}
            />
            <OperatingBlock
              title="No cotizar todavia si falta"
              description="Cotizar sin datos baja margen y crea promesas imposibles."
              items={[
                "No sabemos quien decide.",
                "No sabemos si necesita web, CRM, bot o sistema.",
                "No sabemos presupuesto o urgencia.",
                "No hay siguiente paso con fecha.",
              ]}
            />
          </>
        }
      >
        <PipelineSection leads={leads} />
      </SellerScreenGrid>
    </>
  );
}

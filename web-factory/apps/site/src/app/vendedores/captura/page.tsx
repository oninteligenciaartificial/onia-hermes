"use client";

import { sellerScreens } from "../data";
import { CaptureSection } from "../_components/capture-section";
import { OperatingBlock, SellerScreenGrid, SellerScreenHeader } from "../_components/screen-chrome";
import { useSellerWorkspace } from "../_components/seller-workspace";

export default function CapturaPage() {
  const { leadForm, setLeadForm, addLead } = useSellerWorkspace();

  return (
    <>
      <SellerScreenHeader screen={sellerScreens.captura} />
      <SellerScreenGrid
        aside={
          <>
            <OperatingBlock
              title="Datos obligatorios antes de contactar"
              description="No hace falta llenar un CRM enorme. Hace falta guardar lo que cambia la venta."
              items={[
                "Empresa y rubro para entender contexto.",
                "Canal de origen para medir que fuente trae oportunidades.",
                "Dolor probable para abrir la llamada con criterio.",
                "Ciudad y contacto responsable cuando exista.",
              ]}
            />
            <OperatingBlock
              title="Despues de guardar"
              description="Un lead nuevo no debe quedarse como nombre suelto."
              items={[
                "Investigar presencia digital antes de llamar.",
                "Asignar producto sugerido: auditoria, web, CRM, bot o sistema.",
                "Mover a Pipeline solo si tiene siguiente accion clara.",
              ]}
            />
          </>
        }
      >
        <CaptureSection leadForm={leadForm} onChange={setLeadForm} onSubmit={addLead} />
      </SellerScreenGrid>
    </>
  );
}

import { openingMessages, playbook, salesDecisionGuide, sellerDataChecklist, sellerScreens } from "../data";
import { PlaybookSection } from "../_components/playbook-section";
import { SalesKitSection } from "../_components/sales-kit-section";
import { OperatingBlock, SellerScreenGrid, SellerScreenHeader } from "../_components/screen-chrome";

export default function ReglasPage() {
  return (
    <>
      <SellerScreenHeader screen={sellerScreens.biblioteca} />
      <SellerScreenGrid
        aside={
          <>
            <OperatingBlock
              title="Principio comercial"
              description="Onia no debe sonar desesperada ni prometer de mas para cerrar."
              items={[
                "Vender valor, no horas.",
                "Limitar alcance antes de aceptar precio bajo.",
                "Cobrar discovery cuando el cliente pide sistema.",
                "Escalar llamadas complejas, no todas.",
              ]}
            />
            <OperatingBlock
              title="Riesgos a bloquear"
              description="Si aparece uno de estos puntos, la venta necesita validacion."
              items={[
                "Garantia de ventas o posicionamiento.",
                "Integracion WhatsApp sin proveedor definido.",
                "Automatizacion de proceso que aun no existe manualmente.",
                "Cliente pide mucho por poco y soporte indefinido.",
              ]}
            />
          </>
        }
      >
        <PlaybookSection playbook={playbook} />
        <SalesKitSection decisions={salesDecisionGuide} messages={openingMessages} checklist={sellerDataChecklist} />
      </SellerScreenGrid>
    </>
  );
}

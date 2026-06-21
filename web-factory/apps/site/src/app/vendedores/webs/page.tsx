import { sellerScreens, serviceScopes, webDiagnostics } from "../data";
import { OperatingBlock, SellerScreenGrid, SellerScreenHeader } from "../_components/screen-chrome";
import { WebDiagnosticsSection } from "../_components/web-diagnostics-section";

export default function WebsPage() {
  return (
    <>
      <SellerScreenHeader screen={sellerScreens.webs} />
      <SellerScreenGrid
        aside={
          <>
            <OperatingBlock
              title="Cuando es landing o web"
              description="Se vende como web cuando el problema principal es presencia, confianza y captura simple."
              items={[
                "Necesita explicar servicios y enviar a WhatsApp/formulario.",
                "No requiere login, roles, dashboard ni procesos internos.",
                "El cliente puede entregar logo, fotos o referencias.",
              ]}
            />
            <OperatingBlock
              title="Cuando ya no es web simple"
              description="Si el cliente pide operacion interna, cambia el alcance."
              items={[
                "Base de datos con clientes, pedidos, citas o inventario.",
                "Usuarios con permisos diferentes.",
                "Automatizaciones criticas o integraciones con WhatsApp/API.",
                "Reportes, pagos, facturacion o portal privado.",
              ]}
            />
          </>
        }
      >
        <WebDiagnosticsSection diagnostics={webDiagnostics} scopes={serviceScopes} />
      </SellerScreenGrid>
    </>
  );
}

import { sellerScreens, startupRequirements } from "../data";
import { OperatingBlock, RequirementCards, SellerScreenGrid, SellerScreenHeader } from "../_components/screen-chrome";

export default function RequerimientosPage() {
  return (
    <>
      <SellerScreenHeader screen={sellerScreens.requerimientos} />
      <SellerScreenGrid
        aside={
          <>
            <OperatingBlock
              title="Decision recomendada"
              description="Para empezar rapido sin sobreingenieria."
              items={[
                "Usar Notion como fuente oficial inicial.",
                "Mantener este panel como interfaz de trabajo y prototipo operativo.",
                "Pasar a Supabase cuando ya sepamos campos definitivos y roles.",
              ]}
            />
            <OperatingBlock
              title="Primer dia de uso"
              description="No esperes a que el sistema este perfecto."
              items={[
                "Cargar 10 leads reales o semi-reales.",
                "Registrar 3 llamadas con notas y objeciones.",
                "Registrar cualquier cobro solo si existe comprobante.",
                "Revisar al cierre que campos faltaron.",
              ]}
            />
          </>
        }
      >
        <RequirementCards requirements={startupRequirements} />
      </SellerScreenGrid>
    </>
  );
}

"use client";

import { sellerScreens } from "../data";
import { IdeasSection } from "../_components/ideas-section";
import { OperatingBlock, SellerScreenGrid, SellerScreenHeader } from "../_components/screen-chrome";
import { useSellerWorkspace } from "../_components/seller-workspace";

export default function IdeasPage() {
  const { ideas, ideaForm, setIdeaForm, addIdea } = useSellerWorkspace();

  return (
    <>
      <SellerScreenHeader screen={sellerScreens.ideas} />
      <SellerScreenGrid
        aside={
          <>
            <OperatingBlock
              title="Que ideas si sirven"
              description="No todo pensamiento comercial debe convertirse en producto."
              items={[
                "Aparece en varias llamadas o rubros parecidos.",
                "Puede cobrarse rapido con poco soporte.",
                "Tiene alcance repetible y margen claro.",
                "Ayuda a vender webs, sistemas o automatizaciones existentes.",
              ]}
            />
            <OperatingBlock
              title="Revision semanal"
              description="Las ideas aprobadas pasan a paquete o add-on vendible."
              items={[
                "Agrupar por rubro: clinicas, tiendas, servicios, restaurantes.",
                "Definir precio beta, alcance y no incluido.",
                "Crear argumento de venta y ejemplo visual.",
              ]}
            />
          </>
        }
      >
        <IdeasSection ideas={ideas} ideaForm={ideaForm} onChange={setIdeaForm} onSubmit={addIdea} />
      </SellerScreenGrid>
    </>
  );
}

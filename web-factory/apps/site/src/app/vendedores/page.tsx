"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dailyActions, sellerNavigation, sellerScreens, startupRequirements } from "./data";
import { OperatingBlock, RequirementCards, SellerScreenHeader } from "./_components/screen-chrome";
import { useSellerWorkspace } from "./_components/seller-workspace";
import { buildMetrics, OverviewSection } from "./_components/overview-section";

const legacyHashRoutes: Record<string, string> = {
  operacion: "/vendedores/operacion",
  captura: "/vendedores/captura",
  leads: "/vendedores/pipeline",
  webs: "/vendedores/webs",
  notas: "/vendedores/notas",
  ideas: "/vendedores/ideas",
  ingresos: "/vendedores/ingresos",
  biblioteca: "/vendedores/reglas",
};

export default function VendedoresHomePage() {
  const router = useRouter();
  const { leads } = useSellerWorkspace();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const target = legacyHashRoutes[hash];

    if (target) {
      router.replace(target);
    }
  }, [router]);

  return (
    <>
      <SellerScreenHeader screen={sellerScreens.inicio} />
      <OverviewSection actions={dailyActions} metrics={buildMetrics(leads)} />

      <section className="seller-route-cards" aria-label="Pantallas del panel">
        {sellerNavigation
          .filter((item) => item.href !== "/vendedores")
          .map((item) => (
            <Link href={item.href} key={item.id}>
              <span>{item.detail}</span>
              <strong>{item.label}</strong>
              <small>Abrir pantalla propia</small>
            </Link>
          ))}
      </section>

      <div className="seller-screen-grid">
        <section className="seller-screen-flow">
          <OperatingBlock
            title="Como se usa cada dia"
            description="La vendedora no debe abrir todo el panel a la vez. El flujo recomendado es secuencial y cada pantalla cumple una funcion."
            items={[
              "Inicio: revisar tareas criticas, ventas calientes y caja pendiente.",
              "Operacion: validar reglas de 60 dias, deuda, Nuvia, evidencias y pagos.",
              "Captura: registrar solo leads con informacion suficiente para investigar.",
              "Pipeline: decidir a quien llamar, que falta y que siguiente paso toca.",
              "Ingresos: revisar si hay cobro real antes de aprobar comision.",
            ]}
          />
        </section>
        <aside className="seller-screen-aside">
          <RequirementCards requirements={startupRequirements.slice(0, 3)} />
        </aside>
      </div>
    </>
  );
}

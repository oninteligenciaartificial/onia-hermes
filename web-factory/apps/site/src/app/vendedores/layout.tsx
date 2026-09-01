import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./vendedores.css";
import { SellerSidebar } from "./_components/seller-shell";
import { SellerWorkspaceProvider } from "./_components/seller-workspace";

// Defensa en profundidad: si el portero del middleware fallara o se sacara, estas
// paginas NO pueden terminar en Google. Publican precios muertos (Bs 1.500 + 1.490
// contra los Bs 390 reales) para un puesto de vendedor que no existe.
export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function VendedoresLayout({ children }: { children: ReactNode }) {
  return (
    <SellerWorkspaceProvider>
      <main className="seller-page">
        <SellerSidebar />
        <section className="seller-main">{children}</section>
      </main>
    </SellerWorkspaceProvider>
  );
}

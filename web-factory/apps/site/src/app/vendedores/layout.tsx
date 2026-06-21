import type { ReactNode } from "react";
import "./vendedores.css";
import { SellerSidebar } from "./_components/seller-shell";
import { SellerWorkspaceProvider } from "./_components/seller-workspace";

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

import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { loadLegalDoc } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Términos y Condiciones — Onia",
  description:
    "Términos y Condiciones de uso de la plataforma Onia (borrador, pendiente de revisión por abogado): servicio, planes y pagos en Bs, datos del cliente, agentes IA con aprobación humana y jurisdicción en Bolivia.",
  alternates: { canonical: "/terminos" },
  robots: { index: false },
};

export default function TerminosPage() {
  return <LegalPage doc={loadLegalDoc("terminos")} />;
}

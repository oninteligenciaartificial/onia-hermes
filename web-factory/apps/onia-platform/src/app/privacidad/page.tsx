import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { loadLegalDoc } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de Privacidad — Onia",
  description:
    "Política de Privacidad de la plataforma Onia (borrador, pendiente de revisión por abogado): qué datos se recogen, dónde viven, quién accede, no venta de datos y derechos del titular.",
  robots: { index: false },
};

export default function PrivacidadPage() {
  return <LegalPage doc={loadLegalDoc("privacidad")} />;
}

import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { loadLegalDoc } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de Privacidad — Onia",
  description:
    "Política de Privacidad de la plataforma Onia y su chatbot de WhatsApp (borrador, pendiente de revisión por abogado): qué datos se recogen, dónde viven, quién accede, no venta de datos y derechos del titular.",
  alternates: { canonical: "/privacidad" },
  // Indexable a propósito: Meta valida esta URL con su rastreador al publicar
  // la app del chatbot, y una política de privacidad pública/buscable es la
  // norma. El noindex no aportaba nada acá.
};

export default function PrivacidadPage() {
  return <LegalPage doc={loadLegalDoc("privacidad")} />;
}

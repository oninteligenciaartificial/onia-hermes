import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { loadLegalDoc } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de Privacidad — Onia",
  description:
    "Política de Privacidad de la plataforma Onia y su chatbot de WhatsApp: qué datos se recogen, dónde viven, quién accede, no venta de datos y derechos del titular.",
  alternates: { canonical: "/privacidad" },
  // Indexable a propósito: Meta valida esta URL con su rastreador al publicar
  // la app del chatbot, y una política de privacidad pública/buscable es la
  // norma. El noindex no aportaba nada acá.
  /**
   * Y con `url` propia por el mismo motivo por el que es indexable: el
   * rastreador de Meta llega acá desde el panel de la app, y la única etiqueta
   * OG que el layout raíz no puede heredarle a una página es su dirección.
   */
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Política de Privacidad — Onia",
    description:
      "Qué datos recoge Onia, dónde viven, quién accede y los derechos del titular. No vendemos datos.",
    url: "/privacidad",
  },
};

export default function PrivacidadPage() {
  return <LegalPage doc={loadLegalDoc("privacidad")} />;
}

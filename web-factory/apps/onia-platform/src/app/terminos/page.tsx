import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { loadLegalDoc } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Términos y Condiciones — Onia",
  description:
    "Términos y Condiciones de uso de la plataforma Onia (borrador, pendiente de revisión por abogado): servicio, planes y pagos en Bs, datos del cliente, agentes IA con aprobación humana y jurisdicción en Bolivia.",
  alternates: { canonical: "/terminos" },
  robots: { index: false },
  /**
   * Las otras nueve etiquetas OG se heredan del layout raíz; `url` es la única
   * que no puede heredarse, porque cambia en cada página. Sin ella la tarjeta
   * queda sin dirección propia al compartirse — y `noindex` no exime: esta
   * página no la querés en Google, pero sí se manda por WhatsApp.
   *
   * La descripción es la de la tarjeta, no la de la página: dice qué es y
   * dónde aplica, sin repetir la letra chica que el documento ya trae entero.
   */
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Términos y Condiciones — Onia",
    description:
      "Las condiciones de uso de Onia: servicio, planes y pagos en bolivianos, datos del cliente y jurisdicción en Bolivia.",
    url: "/terminos",
  },
};

export default function TerminosPage() {
  return <LegalPage doc={loadLegalDoc("terminos")} />;
}

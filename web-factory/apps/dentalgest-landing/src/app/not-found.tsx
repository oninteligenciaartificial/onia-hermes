import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WHATSAPP_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Página no encontrada — DentalGest",
  robots: { index: false, follow: true },
};

/**
 * 404 propio. Sin esto la ruta rota cae en la pantalla por defecto de Next
 * ("This page could not be found"), en ingles y sin salida: el warm lead que
 * llega con la URL mal escrita se va.
 *
 * Reusa el cromo de la landing y las clases globales; el unico CSS nuevo es
 * `.error-page` (padding de seccion) en `globals.css`.
 */
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="error-page">
        <div className="container">
          <p className="chip mono">Error 404</p>
          <h1>Esta página no existe</h1>
          <p className="section-intro">
            El enlace está roto o la página se movió. Volvé al inicio o
            escribinos y te mostramos DentalGest funcionando.
          </p>
          <div className="cta-row">
            <a href="/" className="btn btn-primary">
              Volver al inicio
              <span className="btn-arrow" aria-hidden="true">
                →
              </span>
            </a>
            <a href={WHATSAPP_URL} className="btn btn-ghost">
              Pedir una demo por WhatsApp
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Página no encontrada — Onia",
  robots: { index: false, follow: true },
};

/**
 * 404 propio. Antes esta ruta caia en la pantalla por defecto de Next ("This
 * page could not be found") — en ingles, sin marca y sin salida: quien llega
 * desde un enlace viejo o un anuncio con la URL mal se va del sitio.
 *
 * Sin CSS propio a proposito: usa el cromo del sitio y las clases globales
 * (`.section`, `.kicker`, `.h2`, `.lead`, `.actions`, `.btn`), asi no se abre
 * un tercer sistema visual para una pagina de error.
 */
export default function NotFound() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido" className="section">
        <div className="container">
          <p className="kicker">Error 404</p>
          <h1 className="h2">Esta página no existe</h1>
          <p className="lead">
            El enlace está roto o la página se movió. Lo que buscabas
            probablemente esté acá abajo.
          </p>
          <div className="actions">
            <a href="/" className="btn">
              Volver al inicio
            </a>
            <a href="/precios" className="btn btn-ghost">
              Ver precios
            </a>
            <a href="/empezar" className="btn btn-ghost">
              Probar gratis
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

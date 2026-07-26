import { APP_URL, WHATSAPP_URL } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="footer-wordmark">
              DentalGest<span className="wm-dot">.</span>
            </p>
            <p>Gestión de clínicas dentales, hecho en Bolivia.</p>
          </div>
          <div className="footer-col">
            <h3>Contacto</h3>
            <ul>
              <li>
                <a href={WHATSAPP_URL} className="link-grow">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={APP_URL} className="link-grow">
                  Entrar a la app
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3>Legal</h3>
            <p>Un producto de ONIA · Santa Cruz de la Sierra, Bolivia</p>
            <p className="legal-soft">© 2026 ONIA</p>
          </div>
        </div>
        <p className="footer-bottom">
          Los datos de inasistencia citados son de estudios de Colombia y
          Chile; en Bolivia no existe aún un estudio publicado. Precios de
          lanzamiento sujetos a ajuste con preaviso.
        </p>
      </div>
    </footer>
  );
}

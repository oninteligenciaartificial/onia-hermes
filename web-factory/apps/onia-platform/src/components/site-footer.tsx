import { BrandLogo } from "@/components/brand-logo";
import styles from "./site-footer.module.css";

/**
 * Pie — porte del mockup aprobado: una fila, cuatro destinos y la firma.
 * Lo que antes era un pie de cuatro columnas ahora vive en las secciones o
 * en /comparativa; repetirlo abajo era decir dos veces lo mismo.
 *
 * La segunda linea (identidad legal) NO sale del mockup y se conserva a
 * proposito: la verificacion de negocio de Meta cruza el sitio contra el
 * documento del SEPREC, y el numero es el mismo que figura en el portfolio.
 * Si se borra, se cae esa verificacion.
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <a href="/" className={styles.brand} aria-label="Onia Platform — inicio">
          <BrandLogo height={22} />
        </a>
        {/* El pie es el sitemap interno (patrón Holded/Bind, research
            2026-08-06): toda página pública del sitio tiene su destino acá. */}
        <a href="/precios">Precios</a>
        <a href="/prueba-gratis">Prueba gratis</a>
        <a href="/modulos/dental">Dental</a>
        <a href="/funciones/facturacion-electronica-siat">Facturación SIAT</a>
        <a href="/comparativa">Comparación</a>
        <a href="/nosotros">Nosotros</a>
        <a href="/terminos">Términos</a>
        <a href="/privacidad">Privacidad</a>
        <span className={styles.firma}>Onia Platform · Santa Cruz, Bolivia</span>
      </div>

      <div className="container">
        <address className={styles.legalId}>
          OniaAgency
          <span aria-hidden> · </span>NIT 5371375010
          <span aria-hidden> · </span>Santa Cruz de la Sierra, Bolivia
          <span aria-hidden> · </span>
          <a href="tel:+59178491375">+591 78491375</a>
          <span aria-hidden> · </span>
          <a href="mailto:business@onia.com.bo">business@onia.com.bo</a>
        </address>
      </div>
    </footer>
  );
}

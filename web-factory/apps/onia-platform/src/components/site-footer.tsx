import { BrandLogo } from "@/components/brand-logo";
import { CORREO_CONTACTO } from "@/lib/site";
import styles from "./site-footer.module.css";

/**
 * Pie — sitemap interno agrupado por sustantivos (patron Stripe/Efferd:
 * grupos con etiqueta, no una fila plana de 13 links que quebraba raro).
 * Toda pagina publica del sitio conserva su destino aca.
 *
 * Cromo LEGADO (ver site-header.tsx): lo usan los legales (/privacidad,
 * /terminos), /servicios/consultoria y /servicios/marketing-ia, el 404,
 * error.tsx/global-error.tsx y las ocho paginas de /v1 — /nosotros ya se mudo
 * a (sitio) y usa el cromo nuevo (la lista vieja de este comentario mentia:
 * auditoria 2026-09-11, A7). Sus destinos se actualizaron a las rutas de la
 * v3 el 2026-08-21.
 *
 * ⚠️ 2026-09-11 (R2 de la auditoria): las entradas /servicios/marketing-ia y
 * /servicios/consultoria las saco Sergio del nav el 2026-09-08 ("los leads
 * confunden la web con una agencia") pero SOLO se quitaron de (sitio)/nav.ts —
 * este pie las siguio publicando en /privacidad (indexable y en el sitemap) y
 * en el 404. Fuera de aca tambien.
 *
 * La identidad legal NO se toca: la verificacion de negocio de Meta cruza el
 * sitio contra el documento del SEPREC, y el numero es el mismo que figura
 * en el portfolio. Si se borra, se cae esa verificacion.
 */
const GRUPOS: readonly {
  titulo: string;
  links: readonly { href: string; label: string }[];
}[] = [
  {
    titulo: "Producto",
    links: [
      { href: "/precios", label: "Precios" },
      { href: "/empezar", label: "Prueba gratis" },
      { href: "/rubros", label: "Rubros" },
      { href: "/agentes", label: "Agentes" },
      { href: "/comparativa", label: "Comparación" },
    ],
  },
  {
    titulo: "Servicios",
    links: [
      { href: "/chatbot", label: "Chatbot de WhatsApp" },
      { href: "/servicios/webs", label: "Webs" },
    ],
  },
  {
    titulo: "Empresa",
    links: [
      { href: "/contacto", label: "Contacto" },
      { href: "/nosotros", label: "Nosotros" },
      // La norma del 1 de octubre de 2026 es una GUÍA, no una función que
      // vendamos: el emisor fiscal está en trámite ante el SIN. Vivió en
      // "Producto" hasta el 2026-09-04, donde se leía como capacidad incluida.
      { href: "/facturacion", label: "Guía: facturar en línea" },
      { href: "/terminos", label: "Términos" },
      { href: "/privacidad", label: "Privacidad" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <a href="/" className={styles.brand} aria-label="Onia Platform — inicio">
            <BrandLogo height={22} />
          </a>
          <p className={styles.firma}>
            El sistema de gestión con IA hecho en Bolivia.
          </p>
          <address className={styles.legalId}>
            OniaAgency
            <span aria-hidden> · </span>NIT 5371375010
            <span aria-hidden> · </span>EMITE FACTURA
            <span aria-hidden> · </span>Santa Cruz de la Sierra, Bolivia
            <span aria-hidden> · </span>
            <a href={`mailto:${CORREO_CONTACTO}`}>{CORREO_CONTACTO}</a>
          </address>
        </div>

        {GRUPOS.map((grupo) => (
          <nav key={grupo.titulo} aria-label={grupo.titulo} className={styles.col}>
            <p className={styles.colTitulo}>{grupo.titulo}</p>
            <ul>
              {grupo.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
    </footer>
  );
}

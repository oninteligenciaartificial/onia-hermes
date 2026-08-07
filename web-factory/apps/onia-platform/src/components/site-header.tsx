import { BrandLogo } from "@/components/brand-logo";
import { APP_URL } from "@/lib/site";
import styles from "./site-header.module.css";

/* hrefs absolutos ("/#...") para que la nav tambien funcione desde
   /comparativa y las paginas legales. */
const NAV = [
  { href: "/#como", label: "Cómo funciona" },
  { href: "/#modulos", label: "Módulos" },
  { href: "/precios", label: "Precios" },
  { href: "/nosotros", label: "Nosotros" },
] as const;

/**
 * Header — porte del mockup aprobado: marca, tres destinos y las dos acciones
 * (entrar / probar). En movil quedan solo la marca y el CTA.
 *
 * Sin toggle de tema: la superficie publica es clara y el ritmo de tonalidades
 * por seccion ES el diseno; dos temas lo romperian.
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="/" className={styles.brand} aria-label="Onia Platform — inicio">
          <BrandLogo height={24} />
          <span className={styles.sub}>
            Onia
            <br />
            Platform
          </span>
        </a>

        <nav aria-label="Principal" className={styles.nav}>
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href={APP_URL} className={`${styles.btn} ${styles.ghost}`}>
          Entrar
        </a>
        <a
          href={`${APP_URL}/register`}
          className={`${styles.btn} ${styles.primary}`}
        >
          Probar gratis
        </a>
      </div>
    </header>
  );
}

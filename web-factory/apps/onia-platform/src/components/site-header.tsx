import { BrandLogo } from "@/components/brand-logo";
import { APP_URL } from "@/lib/site";
import { CTA_ALTA } from "@/app/(sitio)/alta";
import styles from "./site-header.module.css";

/*
 * Cromo LEGADO. Desde el 2026-08-21 la venta corre bajo el layout de
 * src/app/(sitio); este header sobrevive en los legales, /servicios/
 * consultoria y marketing-ia, el 404, error.tsx y las paginas de /v1
 * (/nosotros ya usa el cromo nuevo — el comentario viejo mentia, A7).
 *
 * 2026-09-11 (R2): publicaba un MAPA DISTINTO del sitio (Rubros · Agentes ·
 * Chatbot · Precios · Nosotros) contra el nav real de (sitio)/nav.ts (Rubros ·
 * Precios · Facturacion · Contacto). Dos navs en el mismo dominio confunden;
 * este queda calcado del real.
 */
const NAV = [
  { href: "/rubros", label: "Rubros" },
  { href: "/precios", label: "Precios" },
  { href: "/facturacion", label: "Facturación" },
  { href: "/contacto", label: "Contacto" },
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
          {CTA_ALTA}
        </a>
      </div>
    </header>
  );
}

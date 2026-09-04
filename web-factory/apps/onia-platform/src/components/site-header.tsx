import { BrandLogo } from "@/components/brand-logo";
import { APP_URL } from "@/lib/site";
import { CTA_ALTA } from "@/app/(sitio)/alta";
import styles from "./site-header.module.css";

/*
 * Cromo LEGADO. Desde el 2026-08-21 la venta corre bajo el layout de
 * src/app/(sitio); este header sobrevive solo en las paginas que no se
 * rediseñaron: /nosotros, /servicios/*, los legales y el 404.
 *
 * Sus destinos SI se actualizaron a las rutas de la v3. Antes apuntaba a
 * "/#como" y "/#modulos" — dos anclas de la portada vieja que en la nueva no
 * existen: el visitante hacia clic y caia arriba de todo sin entender por que.
 */
const NAV = [
  { href: "/rubros", label: "Rubros" },
  { href: "/agentes", label: "Agentes" },
  { href: "/chatbot", label: "Chatbot" },
  { href: "/precios", label: "Precios" },
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

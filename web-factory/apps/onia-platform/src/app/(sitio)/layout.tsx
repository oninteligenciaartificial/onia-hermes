import type { ReactNode } from "react";
import { Header, Footer } from "./ui";
import s from "./sitio.module.css";

/**
 * Cromo del SITIO PÚBLICO (v3, publicada 2026-08-21).
 *
 * Es un GRUPO DE RUTAS `(sitio)`: los paréntesis no salen en la URL, así que
 * este layout envuelve exactamente las nueve páginas de la venta — `/`,
 * `/rubros`, `/agentes`, `/chatbot`, `/precios`, `/comparativa`,
 * `/facturacion`, `/contacto`, `/empezar` — y NO toca a `/privacidad`,
 * `/terminos`, `/nosotros`, `/servicios/*` ni al archivo `/v1`, que siguen con
 * su propio cromo. Si esto viviera en el layout raíz, el header nuevo se
 * colaría en todas esas páginas.
 *
 * SIN metadata acá a propósito. Un `alternates.canonical` en un layout lo
 * heredan todas sus rutas apuntando al mismo sitio, y eso desindexa el árbol
 * entero: el canonical se declara PÁGINA POR PÁGINA. El title y la description
 * también, porque cada una vende otra cosa.
 */
export default function SitioLayout({ children }: { children: ReactNode }) {
  return (
    <div className={s.page}>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
    </div>
  );
}

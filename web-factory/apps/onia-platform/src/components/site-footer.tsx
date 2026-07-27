"use client";

import { BrandLogo } from "@/components/brand-logo";
import { DisplayToggle } from "@/components/ui/display-toggle";
import { APP_URL, DENTALGEST_URL, WA_URL } from "@/lib/site";
import styles from "./site-footer.module.css";

const FOOTER_MODULES = [
  { label: "Gestión", on: true },
  { label: "Agentes IA", on: true },
  { label: "Chatbot", on: true },
  { label: "Web", on: false },
  { label: "Automatizaciones", on: false },
  { label: "Local", on: false },
] as const;

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* motivo de cierre: la fila de interruptores, la idea de la casa */}
        <div className={styles.toggleRow} aria-hidden>
          {FOOTER_MODULES.map((mod) => (
            <span key={mod.label} className={styles.toggleItem}>
              <DisplayToggle on={mod.on} small />
              <span>{mod.label}</span>
            </span>
          ))}
        </div>

        <div className={styles.grid}>
          <div>
            <div className={styles.brand}>
              <BrandLogo height={22} />
            </div>
            <p className={styles.blurb}>
              El sistema con IA que maneja tu negocio completo. Elegís tu
              rubro, tu cuenta queda lista, y encendés módulos cuando los
              necesités.
            </p>
          </div>

          <nav aria-label="Mapa del sitio" className={styles.col}>
            <p className={styles.colTitle}>Sitio</p>
            <a href="/#como-funciona">Cómo funciona</a>
            <a href="/#rubros">Rubros</a>
            <a href="/#modulos">Módulos</a>
            <a href="/#bolivia">Hecho para Bolivia</a>
            <a href="/#preguntas">Preguntas</a>
          </nav>

          <nav aria-label="Productos" className={styles.col}>
            <p className={styles.colTitle}>Productos</p>
            <a href={DENTALGEST_URL}>DentalGest — clínicas dentales</a>
            <span className={styles.soon}>Comercio — próximamente</span>
            <span className={styles.soon}>Servicios — próximamente</span>
            <span className={styles.soon}>Proveedores — próximamente</span>
          </nav>

          <div className={styles.col}>
            <p className={styles.colTitle}>Hablemos</p>
            <a href={WA_URL} className="btn btn-wa btn-sm">
              <span className="btn-dot" aria-hidden />
              Hablanos por WhatsApp
            </a>
            <a href={APP_URL} className="btn btn-ghost btn-sm">
              Entrar a la app
            </a>
          </div>
        </div>

        <div className={styles.legal}>
          <p>
            Hecho en Bolivia. Precios de lanzamiento vigentes; los módulos se
            cotizan según cada caso.
          </p>
          <p>
            El portal del SIN es gratuito y siempre podés facturar ahí — Onia
            te ahorra el tipeo, no te vende una obligación.
          </p>
          <nav aria-label="Legal" className={styles.legalNav}>
            <a href="/terminos">Términos y Condiciones</a>
            <a href="/privacidad">Política de Privacidad</a>
          </nav>
          <p className="mono">© 2026 Onia</p>
          {/* Identidad legal. La usa la verificación de negocio de Meta, que cruza
              el sitio contra el documento (SEPREC). El domicilio fiscal es
              particular: NO se publica — va solo en el formulario privado. */}
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
      </div>
    </footer>
  );
}

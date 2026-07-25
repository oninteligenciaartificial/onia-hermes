"use client";

import { BrandWordmark } from "@/components/brand-wordmark";
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
              <BrandWordmark height={22} />
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
        </div>
      </div>
    </footer>
  );
}

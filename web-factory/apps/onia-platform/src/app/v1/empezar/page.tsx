import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Wizard } from "./wizard";
import styles from "./wizard.module.css";

/**
 * /empezar — modo foco (spec ONIA_WIZARD_EMPEZAR_SPEC_2026.md §0):
 * header mínimo con el wordmark de marca v2 (mismo componente que el header
 * del sitio), sin nav ni footer.
 */

export const metadata: Metadata = {
  title: "Empezá — Onia",
  description:
    "Respondé 3 preguntas y te decimos qué encenderíamos para tu negocio. Sin registro: no te pedimos nombre, correo ni teléfono.",
  alternates: { canonical: "/empezar" },
  /**
   * Mismo hueco que su hermana `/v1/comparativa`, y medido el mismo día: sin
   * este bloque heredaba las etiquetas Open Graph del layout raíz, así que el
   * enlace reenviado mostraba la tarjeta de la PORTADA y ninguna `og:url`
   * propia (`curl -A "WhatsApp/2.23.20.0" …/v1/empezar` → HTTP 200, og:title
   * "Onia — El sistema con IA…"). `url` apunta a `/empezar`, como el
   * `canonical`: esto es el archivo, la página viva es la otra.
   */
  openGraph: {
    type: "website",
    locale: "es_BO",
    title: "Empezá — Onia",
    description:
      "Respondé 3 preguntas y te decimos qué encenderíamos para tu negocio. Sin registro: no te pedimos nombre, correo ni teléfono.",
    url: "/empezar",
  },
};

export default function EmpezarPage() {
  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <Link href="/" className={styles.brand} aria-label="Onia — inicio">
          <BrandLogo height={24} />
        </Link>
        <Link href="/" className={styles.volver}>
          ← volver al sitio
        </Link>
      </header>

      <main className={styles.main}>
        <Wizard />
      </main>

      <p className={styles.footMicro}>
        Sin registro. No te pedimos nombre, correo ni teléfono — hablás recién
        cuando vos quieras.
      </p>
    </div>
  );
}

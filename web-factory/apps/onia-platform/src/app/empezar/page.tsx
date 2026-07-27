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

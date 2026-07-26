import type { Metadata } from "next";
import Link from "next/link";
import { BrandWordmark } from "@/components/brand-wordmark";
import { Wizard } from "./wizard";
import styles from "./wizard.module.css";

/**
 * /empezar — modo foco (spec ONIA_WIZARD_EMPEZAR_SPEC_2026.md §0):
 * header mínimo con el wordmark placeholder (swap de logo = swap de asset,
 * contrato de ONIA_BRAND_IDENTITY_2026.md §4.1), sin nav ni footer del sitio.
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
          <BrandWordmark height={24} />
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

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PreviewHeader, PreviewFooter } from "./ui";
import s from "./preview.module.css";

/**
 * Ruta de PREVIEW del rediseño (v3). NO es producción: `/` sigue siendo la v1.
 * noindex + nofollow en todo el árbol para que nunca compita con el sitio real.
 */
export const metadata: Metadata = {
  title: "Onia — preview del rediseño",
  robots: { index: false, follow: false },
};

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return (
    <div className={s.page}>
      <p className={s.previewFlag}>Preview interno del rediseño · no es la web publicada</p>
      <PreviewHeader />
      <main>{children}</main>
      <PreviewFooter />
    </div>
  );
}

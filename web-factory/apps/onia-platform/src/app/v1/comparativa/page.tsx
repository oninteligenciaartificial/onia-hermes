import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Proof } from "@/components/sections/proof";
import { Reveal } from "@/motion";
import { HUECO } from "@/lib/proof";

export const metadata: Metadata = {
  metadataBase: new URL("https://onia.com.bo/"),
  title: "Onia comparada con los sistemas que se venden en Bolivia",
  description:
    "Precios y capacidades publicados por el Portal del SIN, los facturadores bolivianos y el software dental de la región, con fecha de consulta. Y lo que Onia todavía no hace.",
  alternates: { canonical: "/comparativa" },
};

/**
 * Subpagina de comparacion.
 *
 * Era la seccion mas densa del home y solo la lee quien ya esta comparando:
 * por eso salio del embudo y quedo acá, enlazada desde precios y desde la
 * card de honestidad. El contenido es el mismo <Proof> de siempre — la tabla
 * con nombres, precios publicos y fuente, mas el ledger de lo que no hacemos.
 */
export default function ComparativaPage() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <section className="section" style={{ paddingBottom: 0 }}>
          <div className="container">
            <Reveal>
              <p className="kicker">Comparación</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="h2">
                Onia comparada con lo que hoy se vende en Bolivia.
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="lead">
                {HUECO} Todos los precios de abajo son públicos: abrí cualquiera
                de esas webs y comprobalo vos mismo.
              </p>
            </Reveal>
          </div>
        </section>
        <Proof />
      </main>
      <SiteFooter />
    </>
  );
}

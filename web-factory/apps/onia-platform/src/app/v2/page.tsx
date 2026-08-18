import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { HeroV2 } from "@/components/landing-v2/hero";
import { BandaV2 } from "@/components/landing-v2/banda";
import { RubrosV2 } from "@/components/landing-v2/rubros";
import { AgentesV2 } from "@/components/landing-v2/agentes";
import { ChatbotV2 } from "@/components/landing-v2/chatbot";
import { PreciosV2 } from "@/components/landing-v2/precios";
import { HonestidadV2 } from "@/components/landing-v2/honestidad";
import { CierreV2 } from "@/components/landing-v2/cierre";
import styles from "@/components/landing-v2/v2.module.css";

/**
 * /v2 — OPCIÓN 2 de la landing, para comparar contra `/` en el MISMO build.
 *
 * Qué la separa de la v1:
 *  1. La mecánica de Fanvue medida con F12 aplicada al pie sobre Archivo
 *     (leyes 1-7 detalladas en components/landing-v2/v2.module.css).
 *  2. Densidad de MEDIA REAL en vez de maquetas dibujadas en HTML: siete
 *     capturas de producción, seis fotos de marca y una marquesina de 35 s.
 *  3. Secciones de UN mensaje cada una, con mucho más aire entre ellas.
 *  4. El negro como ANCLA (agentes, honestidad), nunca como base.
 *
 * La v1 sigue intacta en `/` y en src/components/landing/*. Esta ruta es un
 * BORRADOR de comparación: va con `noindex` para que no compita en Google con
 * el home mientras las dos convivan.
 *
 * Notas al pie con la ley aplicada por sección: el JSDoc de cada componente
 * de components/landing-v2/.
 */
export const metadata: Metadata = {
  title: "Onia · v2 (borrador de comparación)",
  description:
    "Segunda dirección de la landing de Onia: la mecánica tipográfica medida de Fanvue aplicada sobre Archivo, con densidad de media real.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function LandingV2() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      {/*
        Sin JS ninguna sección puede quedar en blanco. Los <Reveal> salen del
        servidor con `opacity:0` en línea, así que el único que les gana es un
        !important. Mismo recurso que la v1 (y que el MotionProvider), acotado
        a esta página.
      */}
      <noscript>
        <style>{`.${styles.page} [style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <SiteHeader />
      <main id="contenido" className={styles.page}>
        <HeroV2 />
        <BandaV2 />
        <RubrosV2 />
        <AgentesV2 />
        <ChatbotV2 />
        <PreciosV2 />
        <HonestidadV2 />
        <CierreV2 />
      </main>
      <SiteFooter />
    </>
  );
}

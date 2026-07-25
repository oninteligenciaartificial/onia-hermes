import { Aritmetica } from "@/components/aritmetica";
import { CtaFinal } from "@/components/cta-final";
import { Faq } from "@/components/faq";
import { Features } from "@/components/features";
import { Hero } from "@/components/hero";
import { Planes } from "@/components/planes";
import { Problema } from "@/components/problema";
import { RevealObserver } from "@/components/reveal-observer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Siat } from "@/components/siat";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Problema />
        <Features />
        {/* Par comprimido: un solo momento de plata y plazo (fondo tinta) */}
        <div className="tinta-par">
          <Aritmetica />
          <Siat />
        </div>
        <Planes />
        <Faq />
        <CtaFinal />
      </main>
      <SiteFooter />
      <RevealObserver />
    </>
  );
}

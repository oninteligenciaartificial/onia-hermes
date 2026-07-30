import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RubroProvider } from "@/components/rubro-context";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Rubros } from "@/components/sections/rubros";
import { Modules } from "@/components/sections/modules";
import { Bolivia } from "@/components/sections/bolivia";
import { AgentStory } from "@/components/sections/agent-story";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { Doors } from "@/components/sections/doors";

/**
 * Orden del embudo: promesa -> como funciona -> tu rubro -> que enciende ->
 * por que Bolivia -> prueba (el agente trabajando) -> PRECIO -> objeciones ->
 * las dos puertas de compra. El precio va antes de las objeciones a proposito:
 * primero el numero, despues las razones para decir que si.
 *
 * RubroProvider envuelve las secciones que comparten el rubro elegido: se
 * elige una vez en /#rubros y manda en precios, objeciones y puertas.
 */
export default function Home() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <RubroProvider>
          <Hero />
          <HowItWorks />
          <Rubros />
          <Modules />
          <Bolivia />
          <AgentStory />
          <Pricing />
          <Faq />
          <Doors />
        </RubroProvider>
      </main>
      <SiteFooter />
    </>
  );
}

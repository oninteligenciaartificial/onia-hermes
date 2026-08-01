import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RubroProvider } from "@/components/rubro-context";
import { Hero } from "@/components/sections/hero";
import { Proof } from "@/components/sections/proof";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Rubros } from "@/components/sections/rubros";
import { Modules } from "@/components/sections/modules";
import { Bolivia } from "@/components/sections/bolivia";
import { AgentStory } from "@/components/sections/agent-story";
import { Pricing } from "@/components/sections/pricing";
import { Faq } from "@/components/sections/faq";
import { Doors } from "@/components/sections/doors";
import {
  RailDemo,
  RailFiscal,
  RailPrecio,
} from "@/components/sections/cta-rails";
import { MobileCtaBar } from "@/components/ui/mobile-cta-bar";

/**
 * Orden del embudo, pensado para CERRAR y no solo para explicar:
 *
 *   promesa (que gana el dueño)
 *   -> PRUEBA (el mapa de la categoria + lo que todavia no hace)  ← temprano
 *   -> salida: ver el precio
 *   -> como funciona -> tu rubro -> que enciende
 *   -> por que Bolivia -> salida: la duda del NIT
 *   -> el agente trabajando -> SALIDA FUERTE: agendar la demo
 *   -> PRECIO + garantias (el riesgo pegado al numero)
 *   -> objeciones -> las dos puertas de compra.
 *
 * Dos decisiones que valen la pena escribir:
 *  - La prueba va SEGUNDA. Con cero clientes, lo primero que hay que resolver
 *    no es "que hace" sino "por que te creo". Si eso no se resuelve arriba,
 *    todo lo de abajo se lee como folleto.
 *  - Despues de cada bloque de valor hay una salida a la accion, no una sola
 *    al final. Alternan tono (quiet/loud) para no leerse como spam.
 *
 * RubroProvider envuelve todo lo que comparte el rubro elegido: se elige una
 * vez y manda en precios, objeciones, puertas y en cada mensaje de WhatsApp.
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
          <Proof />
          <RailPrecio />
          <HowItWorks />
          <Rubros />
          <Modules />
          <Bolivia />
          <RailFiscal />
          <AgentStory />
          <RailDemo />
          <Pricing />
          <Faq />
          <Doors />
          <MobileCtaBar />
        </RubroProvider>
      </main>
      <SiteFooter />
    </>
  );
}

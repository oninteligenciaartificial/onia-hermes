import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Rubros } from "@/components/sections/rubros";
import { Modules } from "@/components/sections/modules";
import { Bolivia } from "@/components/sections/bolivia";
import { AgentStory } from "@/components/sections/agent-story";
import { Doors } from "@/components/sections/doors";
import { Faq } from "@/components/sections/faq";

export default function Home() {
  return (
    <>
      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>
      <SiteHeader />
      <main id="contenido">
        <Hero />
        <HowItWorks />
        <Rubros />
        <Modules />
        <Bolivia />
        <AgentStory />
        <Doors />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}

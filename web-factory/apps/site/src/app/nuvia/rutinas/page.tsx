import type { Metadata } from "next";
import { NuviaRoutinesPage } from "@/components/nuvia/nuvia-store";
import {
  nuvia,
  nuviaCartProducts,
  nuviaContenido,
  nuviaMerchandising,
  nuviaProducts,
  publicAsset,
} from "@/lib/nuvia-data";

export const metadata: Metadata = {
  title: `Rutinas y consejos | ${nuvia.nombre}`,
  description:
    "Rutinas de skincare por necesidad y consejos Nuvia, armadas con productos reales del catalogo.",
};

export default function RutinasPage() {
  return (
    <NuviaRoutinesPage
      name={nuvia.nombre}
      tagline={nuvia.tagline}
      description={nuvia.descripcion}
      logoIcon={publicAsset(nuvia.logoIcon)}
      logoWide={publicAsset(nuvia.logoWide)}
      heroVideo={publicAsset(nuvia.heroVideo)}
      heroPoster={publicAsset(nuvia.heroPoster)}
      products={nuviaProducts}
      cartProducts={nuviaCartProducts}
      merchandising={nuviaMerchandising}
      contenido={nuviaContenido}
    />
  );
}

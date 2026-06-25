import type { Metadata } from "next";
import { NuviaStorefront } from "@/components/nuvia/nuvia-store";
import { nuvia, nuviaCartProducts, nuviaProducts, publicAsset } from "@/lib/nuvia-data";

export const metadata: Metadata = {
  title: nuvia.seo.title,
  description: nuvia.seo.description,
};

export default function NuviaPage() {
  return (
    <NuviaStorefront
      name={nuvia.nombre}
      tagline={nuvia.tagline}
      description={nuvia.descripcion}
      logoIcon={publicAsset(nuvia.logoIcon)}
      logoWide={publicAsset(nuvia.logoWide)}
      heroVideo={publicAsset(nuvia.heroVideo)}
      heroPoster={publicAsset(nuvia.heroPoster)}
      products={nuviaProducts}
      cartProducts={nuviaCartProducts}
    />
  );
}

import type { Metadata } from "next";
import { NuviaCatalogPage } from "@/components/nuvia/nuvia-store";
import { nuvia, nuviaCartProducts, nuviaProducts, publicAsset } from "@/lib/nuvia-data";

export const metadata: Metadata = {
  title: `Catalogo | ${nuvia.nombre}`,
  description: "Catalogo Nuvia con skincare, cremas, carrito y compra asistida.",
};

export default function CatalogoPage() {
  return (
    <NuviaCatalogPage
      name={nuvia.nombre}
      tagline={nuvia.tagline}
      description={nuvia.descripcion}
      logoIcon={publicAsset(nuvia.logoIcon)}
      logoWide={publicAsset(nuvia.logoWide)}
      heroVideo={publicAsset(nuvia.heroVideo)}
      products={nuviaProducts}
      cartProducts={nuviaCartProducts}
    />
  );
}

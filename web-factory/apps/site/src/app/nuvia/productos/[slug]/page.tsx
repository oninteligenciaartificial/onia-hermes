import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NuviaProductPage } from "@/components/nuvia/nuvia-store";
import {
  findNuviaProduct,
  nuvia,
  nuviaCartProducts,
  nuviaProducts,
  productSlug,
  publicAsset,
} from "@/lib/nuvia-data";

type ProductRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return nuviaProducts.map((product) => ({
    slug: productSlug(product),
  }));
}

export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const product = findNuviaProduct(slug);

  if (!product) {
    return {
      title: nuvia.seo.title,
      description: nuvia.seo.description,
    };
  }

  return {
    title: `${product.titulo} | ${nuvia.nombre}`,
    description: product.desc,
  };
}

export default async function ProductPage({ params }: ProductRouteProps) {
  const { slug } = await params;
  const product = findNuviaProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <NuviaProductPage
      name={nuvia.nombre}
      tagline={nuvia.tagline}
      description={nuvia.descripcion}
      logoIcon={publicAsset(nuvia.logoIcon)}
      logoWide={publicAsset(nuvia.logoWide)}
      heroVideo={publicAsset(nuvia.heroVideo)}
      heroPoster={publicAsset(nuvia.heroPoster)}
      products={nuviaProducts}
      cartProducts={nuviaCartProducts}
      product={product}
    />
  );
}

import nuviaJson from "../../../../data/clients/nuvia.json";

export type NuviaProductSpec = {
  label: string;
  value: string;
};

export type NuviaProductDetailImage = {
  src: string;
  alt: string;
  label: string;
};

export type NuviaMerchandisingProduct = {
  slug: string;
  titulo: string;
  marca: string;
  categoria: string;
  imagen: string;
  precio: string;
  precioValor?: number | null;
  descuentoPorcentaje?: number;
};

export type NuviaUseCase = {
  id: string;
  titulo: string;
  problema: string;
  recomendacion: string;
  packId: string;
  productSlugs: string[];
};

export type NuviaPromotion = {
  id: string;
  titulo: string;
  badge: string;
  descripcion: string;
  productSlugs: string[];
  discountPercent: number;
  tipo: string;
};

export type NuviaPack = {
  id: string;
  tipo: string;
  etiqueta: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  productSlugs: string[];
  productos: NuviaMerchandisingProduct[];
  precioRegular: number;
  precioPromocional: number;
  ahorroVisible: number;
  cta: string;
};

export type NuviaCombo = {
  id: string;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  productSlugs: string[];
  pasos: Array<{
    numero: string;
    slug: string;
  }>;
  precioRegular: number;
  precioPromocional: number;
  ahorroVisible: number;
};

export type NuviaQuickSection = {
  id: string;
  titulo: string;
  productSlugs: string[];
  productos: NuviaMerchandisingProduct[];
};

export type NuviaMerchandising = {
  version: string;
  generatedAt: string;
  sourcePrinciples: string[];
  casosUso: NuviaUseCase[];
  promociones: NuviaPromotion[];
  packs: NuviaPack[];
  combos: NuviaCombo[];
  seccionesRapidas: NuviaQuickSection[];
};

export type NuviaRoutineStep = {
  orden: number;
  accion: string;
  titulo: string;
  nota: string;
  productSlugs: string[];
};

export type NuviaRoutine = {
  id: string;
  necesidad: string;
  titulo: string;
  resumen: string;
  momento: string;
  pasos: NuviaRoutineStep[];
  advertencia?: string;
  borrador?: boolean;
};

export type NuviaAdvice = {
  id: string;
  tipo: string;
  titulo: string;
  cuerpo: string;
  productSlugs?: string[];
  disclaimer?: string;
};

export type NuviaContenido = {
  version: string;
  generatedAt: string;
  rutinas: NuviaRoutine[];
  consejos: NuviaAdvice[];
};

export type NuviaProduct = {
  titulo: string;
  categoria: string;
  precio: string;
  precioValor?: number | null;
  moneda?: string;
  desc: string;
  etiqueta: string;
  imagen: string;
  imagenAlt: string;
  marca: string;
  tamano: string;
  uso: string;
  beneficios: string[];
  idealPara: string[];
  ingredientesClave: string[];
  modoUso: string;
  incluye: string[];
  especificaciones: NuviaProductSpec[];
  detalleImagenes: NuviaProductDetailImage[];
  detalleNota: string;
  ordenRutina?: number;
  tipoVenta?: string;
  destacadoMes?: boolean;
  descuentoPorcentaje?: number;
  precioPromocional?: number | null;
};

export type NuviaClient = {
  nombre: string;
  slug: string;
  tagline: string;
  descripcion: string;
  logoIcon: string;
  logoWide: string;
  heroVideo: string;
  heroPoster: string;
  contacto: {
    email: string;
    tel: string;
    whatsapp: string;
    direccion: string;
  };
  productos: NuviaProduct[];
  merchandising?: NuviaMerchandising;
  contenido?: NuviaContenido;
  seo: {
    title: string;
    description: string;
    ogImage: string;
  };
};

export type CartProduct = {
  id: string;
  title: string;
  brand: string;
  size: string;
  category: string;
  use: string;
  priceLabel: string;
  priceValue: number | null;
  currency: string;
  discountPercent: number;
  image: string;
  imageAlt: string;
  href: string;
};

export const nuvia = nuviaJson as NuviaClient;

export function productSlug(product: Pick<NuviaProduct, "titulo">): string {
  return slugify(product.titulo);
}

export function slugify(value: string): string {
  return (
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

export function publicAsset(src: string): string {
  if (!src) {
    return "";
  }

  if (/^(?:[a-z]+:)?\/\//i.test(src) || src.startsWith("/")) {
    return src;
  }

  return `/nuvia/${src}`;
}

export function productHref(product: NuviaProduct): string {
  return `/nuvia/productos/${productSlug(product)}`;
}

export const nuviaProducts = nuvia.productos.map((product) => ({
  ...product,
  imagen: publicAsset(product.imagen),
  detalleImagenes: product.detalleImagenes.map((image) => ({
    ...image,
    src: publicAsset(image.src),
  })),
}));

export const nuviaMerchandising: NuviaMerchandising = {
  version: nuvia.merchandising?.version || "",
  generatedAt: nuvia.merchandising?.generatedAt || "",
  sourcePrinciples: nuvia.merchandising?.sourcePrinciples || [],
  casosUso: nuvia.merchandising?.casosUso || [],
  promociones: nuvia.merchandising?.promociones || [],
  packs: (nuvia.merchandising?.packs || []).map((pack) => ({
    ...pack,
    productos: pack.productos.map((product) => ({
      ...product,
      imagen: publicAsset(product.imagen),
    })),
  })),
  combos: nuvia.merchandising?.combos || [],
  seccionesRapidas: (nuvia.merchandising?.seccionesRapidas || []).map((section) => ({
    ...section,
    productos: section.productos.map((product) => ({
      ...product,
      imagen: publicAsset(product.imagen),
    })),
  })),
};

export const nuviaContenido: NuviaContenido = {
  version: nuvia.contenido?.version || "",
  generatedAt: nuvia.contenido?.generatedAt || "",
  rutinas: nuvia.contenido?.rutinas || [],
  consejos: nuvia.contenido?.consejos || [],
};

export const nuviaCartProducts: CartProduct[] = nuviaProducts.map((product) => ({
  id: productSlug(product),
  title: product.titulo,
  brand: product.marca || product.categoria,
  size: product.tamano || "",
  category: product.categoria,
  use: product.uso || "",
  priceLabel: product.precio || "Consultar precio",
  priceValue: typeof product.precioValor === "number" ? product.precioValor : null,
  currency: product.moneda || "BOB",
  discountPercent: typeof product.descuentoPorcentaje === "number" ? product.descuentoPorcentaje : 0,
  image: product.imagen,
  imageAlt: product.imagenAlt || product.titulo,
  href: productHref(product),
}));

export function findNuviaProduct(slug: string): NuviaProduct | undefined {
  return nuviaProducts.find((product) => productSlug(product) === slug);
}

export function buildNuviaCheckoutHref(items: Array<{ id: string; qty: number }>): string {
  if (!items.length) {
    return "/nuvia/catalogo";
  }

  const lines = items
    .map((item) => {
      const product = nuviaCartProducts.find((entry) => entry.id === item.id);
      if (!product) {
        return "";
      }

      const meta = [product.brand, product.size].filter(Boolean).join(", ");
      return `- ${item.qty} x ${product.title}${meta ? ` (${meta})` : ""} - ${product.priceLabel}`;
    })
    .filter(Boolean)
    .join("\n");

  const message = `Hola Nuvia, quiero cotizar este pedido:\n${lines}\n\nPor favor confirmame disponibilidad, precio final y forma de entrega.`;

  if (nuvia.contacto.whatsapp) {
    const whatsapp = nuvia.contacto.whatsapp.trim();
    const target = /^\+?\d[\d\s().-]+$/.test(whatsapp)
      ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
      : whatsapp;
    const separator = target.includes("?") ? "&" : "?";
    return `${target}${separator}text=${encodeURIComponent(message)}`;
  }

  if (nuvia.contacto.email) {
    return `mailto:${nuvia.contacto.email}?subject=${encodeURIComponent("Pedido Nuvia")}&body=${encodeURIComponent(message)}`;
  }

  return "/nuvia/catalogo#checkout-pendiente";
}

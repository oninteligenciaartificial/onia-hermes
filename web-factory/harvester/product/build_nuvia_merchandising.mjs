import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const NUVIA_JSON = path.resolve("data/clients/nuvia.json");
const REFERENCE_JSON = path.resolve("data/references/design-sources/ecommerce-shopify-patterns-20260625.json");

function stripAccents(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function slugify(value) {
  return (
    stripAccents(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item"
  );
}

function round2(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function productText(product) {
  return stripAccents(
    [
      product.titulo,
      product.marca,
      product.categoria,
      product.uso,
      product.desc,
      ...(product.beneficios || []),
      ...(product.idealPara || []),
      ...(product.ingredientesClave || []),
    ].join(" "),
  ).toLowerCase();
}

function productPrice(product) {
  if (typeof product.precioPromocional === "number") {
    return product.precioPromocional;
  }
  return typeof product.precioValor === "number" ? product.precioValor : 0;
}

function productBasePrice(product) {
  return typeof product.precioValor === "number" ? product.precioValor : productPrice(product);
}

function uniqueProducts(products) {
  const seen = new Set();
  return products.filter((product) => {
    if (!product) {
      return false;
    }
    const slug = slugify(product.titulo);
    if (seen.has(slug)) {
      return false;
    }
    seen.add(slug);
    return true;
  });
}

function findProduct(products, { category = "", includes = [], excludes = [] }) {
  const normalizedCategory = stripAccents(category).toLowerCase();
  return products.find((product) => {
    const text = productText(product);
    const categoryMatch = normalizedCategory ? stripAccents(product.categoria).toLowerCase() === normalizedCategory : true;
    const includeMatch = includes.length ? includes.some((keyword) => text.includes(stripAccents(keyword).toLowerCase())) : true;
    const excludeMatch = excludes.some((keyword) => text.includes(stripAccents(keyword).toLowerCase()));
    return categoryMatch && includeMatch && !excludeMatch;
  });
}

function topFromCategory(products, category, count, used = new Set()) {
  const normalizedCategory = stripAccents(category).toLowerCase();
  return products
    .filter((product) => stripAccents(product.categoria).toLowerCase() === normalizedCategory)
    .filter((product) => !used.has(slugify(product.titulo)))
    .sort((a, b) => {
      const featuredDelta = Number(Boolean(b.destacadoMes)) - Number(Boolean(a.destacadoMes));
      if (featuredDelta) {
        return featuredDelta;
      }
      return productPrice(a) - productPrice(b);
    })
    .slice(0, count);
}

function packTotals(products) {
  const regular = round2(products.reduce((sum, product) => sum + productBasePrice(product), 0));
  const promo = round2(products.reduce((sum, product) => sum + productPrice(product), 0));
  return {
    precioRegular: regular,
    precioPromocional: promo,
    ahorroVisible: round2(Math.max(0, regular - promo)),
  };
}

function slugs(products) {
  return products.map((product) => slugify(product.titulo));
}

function compactProducts(products) {
  return products.map((product) => ({
    slug: slugify(product.titulo),
    titulo: product.titulo,
    marca: product.marca,
    categoria: product.categoria,
    imagen: product.imagen,
    precio: product.precio,
    precioValor: typeof product.precioValor === "number" ? product.precioValor : null,
    descuentoPorcentaje: product.descuentoPorcentaje || 0,
  }));
}

function buildPack({ id, titulo, subtitulo, descripcion, products, tipo = "pack", etiqueta = "pack recomendado" }) {
  const cleanProducts = uniqueProducts(products).slice(0, 4);
  const totals = packTotals(cleanProducts);
  return {
    id,
    tipo,
    etiqueta,
    titulo,
    subtitulo,
    descripcion,
    productSlugs: slugs(cleanProducts),
    productos: compactProducts(cleanProducts),
    precioRegular: totals.precioRegular,
    precioPromocional: totals.precioPromocional,
    ahorroVisible: totals.ahorroVisible,
    cta: "agregar pack",
  };
}

function buildMerchandising(products) {
  const limpiador = findProduct(products, { category: "Limpieza facial", includes: ["sebiaclear", "gel"] }) ||
    findProduct(products, { category: "Limpieza facial" });
  const spf = findProduct(products, { category: "Proteccion solar", includes: ["fusion water"] }) ||
    findProduct(products, { category: "Proteccion solar" });
  const tratamientoGrasa = findProduct(products, { category: "Piel grasa y acne", includes: ["serum", "sebiaclear"] }) ||
    findProduct(products, { category: "Piel grasa y acne" });
  const hidratante = findProduct(products, { category: "Hidratacion" });
  const manchas = findProduct(products, { category: "Manchas" }) || findProduct(products, { category: "Antiedad", includes: ["pigment", "tono"] });
  const antiedad = findProduct(products, { category: "Antiedad", includes: ["upgrade", "age", "serum"] }) ||
    findProduct(products, { category: "Antiedad" });
  const cabello = findProduct(products, { category: "Cabello y unas" });
  const bebe = findProduct(products, { category: "Bebe y ninos" });

  const morningPack = buildPack({
    id: "rutina-manana-esencial",
    titulo: "rutina manana esencial",
    subtitulo: "limpiar, hidratar y proteger",
    descripcion: "Para compradores que quieren una rutina diaria clara sin elegir producto por producto.",
    products: [limpiador, hidratante, spf],
  });
  const oilyPack = buildPack({
    id: "control-piel-grasa",
    titulo: "control piel grasa",
    subtitulo: "limpieza, tratamiento y SPF",
    descripcion: "Para piel grasa o con tendencia acneica. Ordena la compra por necesidad, no por marca.",
    products: [limpiador, tratamientoGrasa, spf],
    etiqueta: "combo piel grasa",
  });
  const tonePack = buildPack({
    id: "tono-y-manchas",
    titulo: "tono y manchas",
    subtitulo: "tratar, sellar y proteger",
    descripcion: "Para rutinas enfocadas en manchas: el protector solar evita perder el avance del tratamiento.",
    products: [manchas, hidratante, spf],
    etiqueta: "combo tono",
  });
  const antiAgePack = buildPack({
    id: "antiedad-diario",
    titulo: "antiedad diario",
    subtitulo: "tratamiento con rutina completa",
    descripcion: "Para clientes que buscan textura, cuidado diario y compra guiada sin llenar el carrito al azar.",
    products: [limpiador, antiedad, spf],
    etiqueta: "combo antiedad",
  });
  const familyPack = buildPack({
    id: "cuidado-familiar",
    titulo: "cuidado familiar",
    subtitulo: "productos simples para casa",
    descripcion: "Para compras de reposicion familiar con productos de uso recurrente.",
    products: [bebe, spf, limpiador],
    etiqueta: "pack familiar",
  });

  const packs = [morningPack, oilyPack, tonePack, antiAgePack, familyPack].filter((pack) => pack.productSlugs.length >= 2);

  const casosUso = [
    {
      id: "primera-rutina",
      titulo: "quiero empezar una rutina",
      problema: "No se por donde empezar y no quiero comprar de mas.",
      recomendacion: "Empieza con limpieza, hidratacion y proteccion solar.",
      packId: morningPack.id,
      productSlugs: morningPack.productSlugs,
    },
    {
      id: "piel-grasa",
      titulo: "piel grasa o brotes",
      problema: "Necesito controlar brillo, grasa o imperfecciones sin resecar.",
      recomendacion: "Prioriza limpiador, tratamiento puntual y SPF ligero.",
      packId: oilyPack.id,
      productSlugs: oilyPack.productSlugs,
    },
    {
      id: "manchas-tono",
      titulo: "manchas o tono irregular",
      problema: "Quiero tratar manchas y cuidar el resultado todos los dias.",
      recomendacion: "Une tratamiento de tono con hidratacion y protector solar.",
      packId: tonePack.id,
      productSlugs: tonePack.productSlugs,
    },
    {
      id: "antiedad",
      titulo: "rutina antiedad simple",
      problema: "Quiero tratamiento diario sin armar una rutina complicada.",
      recomendacion: "Compra por sistema: limpiar, tratar y proteger.",
      packId: antiAgePack.id,
      productSlugs: antiAgePack.productSlugs,
    },
  ].filter((item) => item.productSlugs.length >= 2);

  const promos = [
    {
      id: "destacados-del-mes",
      titulo: "destacados del mes",
      badge: "10% de descuento",
      descripcion: "Productos seleccionados con descuento visible y calculado en carrito.",
      productSlugs: slugs(products.filter((product) => product.destacadoMes).slice(0, 12)),
      discountPercent: 10,
      tipo: "automatico por producto",
    },
    {
      id: "rutina-completa",
      titulo: "compra rutina completa",
      badge: "pack guiado",
      descripcion: "Agrega un pack completo en un clic. Descuento adicional se activa solo cuando checkout backend lo soporte.",
      productSlugs: morningPack.productSlugs,
      discountPercent: 0,
      tipo: "agregador funcional",
    },
  ];

  const combos = packs.map((pack) => ({
    id: pack.id,
    titulo: pack.titulo,
    subtitulo: pack.subtitulo,
    descripcion: pack.descripcion,
    productSlugs: pack.productSlugs,
    pasos: pack.productSlugs.map((slug, index) => ({
      numero: `${index + 1}`.padStart(2, "0"),
      slug,
    })),
    precioRegular: pack.precioRegular,
    precioPromocional: pack.precioPromocional,
    ahorroVisible: pack.ahorroVisible,
  }));

  const usedSlugs = new Set(packs.flatMap((pack) => pack.productSlugs));
  const quickSections = [
    { id: "proteccion-solar", titulo: "protectores solares", productos: topFromCategory(products, "Proteccion solar", 6, usedSlugs) },
    { id: "limpieza-facial", titulo: "limpieza facial", productos: topFromCategory(products, "Limpieza facial", 6, usedSlugs) },
    { id: "antiedad", titulo: "antiedad", productos: topFromCategory(products, "Antiedad", 6, usedSlugs) },
  ].map((section) => ({ ...section, productSlugs: slugs(section.productos), productos: compactProducts(section.productos) }));

  return {
    version: "2026-06-25",
    generatedAt: new Date().toISOString(),
    sourcePrinciples: [
      "bundles must simplify a decision, not hide random inventory",
      "discounts shown in UI must match cart/checkout calculation",
      "recommendations should be complementary and close to purchase actions",
      "standalone product purchase remains available even when packs exist",
    ],
    casosUso,
    promociones: promos,
    packs,
    combos,
    seccionesRapidas: quickSections,
  };
}

async function writeReferenceFile() {
  const reference = {
    generatedAt: new Date().toISOString(),
    purpose: "Reusable ecommerce purchase patterns for Web Factory stores. Do not copy brand identity or exact page layouts.",
    sources: [
      {
        name: "Shopify Help - Product bundles",
        url: "https://help.shopify.com/en/manual/products/bundles",
        extractedPrinciples: [
          "A bundle is two or more related products, commonly sold with a discount.",
          "Bundles can increase average order value, curate products for customers and improve product visibility.",
          "A real bundle system needs an app or backend support when discounting is automatic.",
        ],
      },
      {
        name: "Shopify Help - Automatic discounts",
        url: "https://help.shopify.com/en/manual/discounts/discount-methods/automatic-discounts",
        extractedPrinciples: [
          "Automatic discounts apply in cart and checkout when eligibility conditions are met.",
          "Common uses: site-wide sales, collection promos and bulk purchases.",
          "Customers must add eligible items to cart for discount eligibility.",
        ],
      },
      {
        name: "Shopify Ajax Product Recommendations API",
        url: "https://shopify.dev/docs/api/ajax/reference/product-recommendations",
        extractedPrinciples: [
          "Recommendations can be related or complementary.",
          "Keep recommendations close to product pages and buying actions.",
          "Limit recommendation lists to small useful groups instead of generic grids.",
        ],
      },
      {
        name: "Shopify Blog - Price bundling",
        url: "https://www.shopify.com/blog/price-bundling",
        extractedPrinciples: [
          "Bundles can reduce decision fatigue and increase average order value.",
          "Use complementary products, same-category packs or value packs.",
          "Discounted bundles reduce margin, so price them with finance checks.",
          "Keep standalone purchase available when possible.",
        ],
      },
    ],
    webFactoryRules: [
      "Generate use cases, packs and combos from product metadata, not hand-written repeated sections.",
      "Never display supplier names in public copy.",
      "Do not show a discount unless cart/checkout can calculate it or the copy clearly says it is pending.",
      "For skincare, route use cases through routine logic: limpiar, tratar, hidratar, proteger.",
      "Keep packs as conversion helpers above catalog and product recommendations near PDP actions.",
    ],
  };

  await mkdir(path.dirname(REFERENCE_JSON), { recursive: true });
  await writeFile(REFERENCE_JSON, `${JSON.stringify(reference, null, 2)}\n`);
}

async function main() {
  const client = await readJson(NUVIA_JSON);
  const products = Array.isArray(client.productos) ? client.productos : [];
  const publicProducts = products.filter((product) => product.tipoVenta !== "profesional_consulta");
  client.merchandising = buildMerchandising(publicProducts);

  await writeFile(NUVIA_JSON, `${JSON.stringify(client, null, 2)}\n`);
  await writeReferenceFile();

  console.log(
    JSON.stringify(
      {
        updated: NUVIA_JSON,
        reference: REFERENCE_JSON,
        useCases: client.merchandising.casosUso.length,
        promos: client.merchandising.promociones.length,
        packs: client.merchandising.packs.length,
        combos: client.merchandising.combos.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

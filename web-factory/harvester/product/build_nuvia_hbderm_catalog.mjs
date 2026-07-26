import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const NUVIA_JSON = path.resolve("data/clients/nuvia.json");
const SCRAPE_JSON = path.resolve("data/references/product-sources/hbderm-products-20260619.json");
const NORMALIZED_JSON = path.resolve("data/references/product-sources/nuvia-hbderm-normalized-20260619.json");
const FINANCE_JSON = path.resolve("data/clients/nuvia.finance.json");
const FINANCE_CSV = path.resolve("data/clients/nuvia.finance.csv");
const MIGRATION = path.resolve("../supabase/migrations/20260619_web_factory_nuvia_hbderm_products.sql");

const MARGIN_RATE = 0.45;
const SELLER_COMMISSION_RATE = 0.1;
const DISCOUNT_PERCENT = 10;

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
  return Math.round(value * 100) / 100;
}

function moneyLabel(value) {
  return `Bs. ${Math.round(value)}`;
}

function csvCell(value) {
  const raw = String(value ?? "");
  return /[",\n;]/.test(raw) ? `"${raw.replace(/"/g, '""')}"` : raw;
}

function csvRow(values) {
  return values.map(csvCell).join(",");
}

function titleWord(word) {
  const keepUpper = new Set([
    "SPF",
    "UVA",
    "UVB",
    "UV",
    "CC",
    "IR-A",
    "DNA",
    "C8+",
    "3REGUL+",
    "3-REGUL",
    "HXR",
    "GR",
    "ACM",
    "SVR",
    "ISDIN",
    "URIAGE",
    "FILORGA",
    "FILLMED",
  ]);
  // Algunos productos del proveedor traen el codigo de variante entre corchetes
  // literales (ej. "[C20] BIOTIC", "[CERA] BIOTIC"). Se desenvuelve el corchete
  // y se aplica el mismo casing al contenido, en vez de dejarlo tal cual.
  const bracketMatch = word.match(/^\[(.+)\]$/);
  const cleaned = (bracketMatch ? bracketMatch[1] : word).replace(/[“”]/g, '"');
  const upper = cleaned.toUpperCase();

  if (keepUpper.has(upper) || /\d/.test(cleaned)) {
    return upper;
  }

  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
}

function prettyTitle(title) {
  return String(title || "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map(titleWord)
    .join(" ")
    .replace(/\bSpf\b/g, "SPF")
    .replace(/\bMl\b/g, "ml")
    .replace(/\bGr\b/g, "gr")
    .replace(/\bX\s+(\d+)/g, "x $1");
}

function extractSize(title) {
  const match = String(title || "").match(/\b(\d+(?:[,.]\d+)?)\s*(ml|g|gr|capsulas|caps|ampollas|unidades|uni)\b/i);
  if (!match) {
    return "";
  }
  const unit = match[2].toLowerCase().replace("capsulas", "capsulas");
  return `${match[1].replace(",", ".")} ${unit}`;
}

function compactDescription(product, category) {
  const brand = product.brand && product.brand !== "HBDERM" ? product.brand : "Nuvia";

  if (category === "Proteccion solar") {
    return `${brand} para proteccion solar diaria. Confirma disponibilidad antes de finalizar la compra.`;
  }
  if (category === "Limpieza facial") {
    return `${brand} para limpieza de rostro y rutina diaria. Confirma disponibilidad antes de finalizar la compra.`;
  }
  if (category === "Piel grasa y acne") {
    return `${brand} para rutinas de piel grasa o con tendencia acneica. No reemplaza una consulta dermatologica.`;
  }
  if (category === "Hidratacion") {
    return `${brand} para hidratacion y soporte de barrera cutanea en rutina diaria.`;
  }
  if (category === "Manchas") {
    return `${brand} para rutinas orientadas a tono y manchas. Usar segun indicacion del producto.`;
  }
  if (category === "Cabello y unas") {
    return `${brand} para cuidado de cabello o unas. Confirma modo de uso y disponibilidad.`;
  }
  if (category === "Bebe y ninos") {
    return `${brand} para cuidado familiar. Confirmar edad recomendada antes de usar.`;
  }
  if (category === "Profesional consulta") {
    return `${brand} de uso profesional o bajo consulta. No se publica como compra directa.`;
  }

  return `${brand} seleccionado para compra asistida Nuvia. Confirma disponibilidad antes de comprar.`;
}

function normalizeCategory(product) {
  const haystack = stripAccents([...product.categories, product.title].join(" ")).toLowerCase();

  if (/(rellenos dermales|mesoterapia|canulas|art filler|fillmed|softfil|nanosoft)/.test(haystack)) {
    return "Profesional consulta";
  }
  if (/(fotoproteccion|proteccion solar|spf|solar)/.test(haystack)) {
    return "Proteccion solar";
  }
  if (/(limpieza|limpiador|limpiadores|moussant|nettoyant|cleanser|lavante|agua micelar|desmaquill)/.test(haystack)) {
    return "Limpieza facial";
  }
  if (/(acne|grasas|sebiaclear|hyseac|anti imperfecciones|piel grasa)/.test(haystack)) {
    return "Piel grasa y acne";
  }
  if (/(manchas|despigment|hiperpigment|pigment|tono)/.test(haystack)) {
    return "Manchas";
  }
  if (/(hidrat|nutrit|xemose|atopicas|barrera|relipidizante)/.test(haystack)) {
    return "Hidratacion";
  }
  if (/(cabello|unas|anticaida|novophane|pestanas)/.test(haystack)) {
    return "Cabello y unas";
  }
  if (/(bebe|ninos|pediatr|pediatric|higiene del bebe)/.test(haystack)) {
    return "Bebe y ninos";
  }
  if (/(antiedad|anti edad|arrugas|serum|serums|contorno|isdinceutics|photoaging)/.test(haystack)) {
    return "Antiedad";
  }

  return "Dermocosmetica";
}

function categoryBenefits(category) {
  const byCategory = {
    "Proteccion solar": ["Proteccion diaria", "Uso urbano", "Confirmar tipo de piel"],
    "Limpieza facial": ["Rutina diaria", "Limpieza de rostro", "Confirmar tipo de piel"],
    "Piel grasa y acne": ["Piel grasa", "Tendencia acneica", "Rutina de control"],
    Hidratacion: ["Hidratacion", "Barrera cutanea", "Uso diario"],
    Manchas: ["Tono de piel", "Rutina antimanchas", "Uso constante"],
    "Cabello y unas": ["Cabello y unas", "Rutina de soporte", "Uso indicado"],
    "Bebe y ninos": ["Cuidado familiar", "Uso delicado", "Confirmar edad"],
    Antiedad: ["Rutina antiedad", "Cuidado diario", "Uso indicado"],
    "Profesional consulta": ["Uso profesional", "Compra bajo consulta", "No autoadministrar"],
  };

  return byCategory[category] || ["Seleccion Nuvia", "Compra asistida", "Disponibilidad a confirmar"];
}

function categoryIdealFor(category) {
  const byCategory = {
    "Proteccion solar": ["Uso diario", "Rutina de manana", "Proteccion urbana"],
    "Limpieza facial": ["Primer paso", "Rutina manana/noche", "Preparar la piel"],
    "Piel grasa y acne": ["Piel grasa", "Piel con imperfecciones", "Rutina facial"],
    Hidratacion: ["Piel seca", "Barrera cutanea", "Rutina diaria"],
    Manchas: ["Piel con manchas", "Rutina de tono", "Uso constante"],
    "Cabello y unas": ["Cabello", "Unas", "Apoyo cosmetico"],
    "Bebe y ninos": ["Familia", "Ninos", "Cuidado delicado"],
    Antiedad: ["Rutina antiedad", "Textura y tono", "Cuidado facial"],
    "Profesional consulta": ["Uso profesional", "Consulta previa", "Compra asistida"],
  };

  return byCategory[category] || ["Compra asistida", "Catalogo Nuvia", "Disponibilidad a confirmar"];
}

function routineForCategory(category) {
  if (category === "Limpieza facial") {
    return { order: 1, label: "Paso 1: limpiar" };
  }
  if (category === "Proteccion solar") {
    return { order: 4, label: "Paso 4: proteger" };
  }
  if (category === "Hidratacion") {
    return { order: 3, label: "Paso 3: hidratar" };
  }
  if (category === "Antiedad" || category === "Manchas" || category === "Piel grasa y acne") {
    return { order: 2, label: "Paso 2: tratar" };
  }

  return { order: undefined, label: "Compra asistida" };
}

function productFormula(sourcePrice) {
  const marginAmount = round2(sourcePrice * MARGIN_RATE);
  const salePrice = round2(sourcePrice - marginAmount);
  const sellerCommission = round2(marginAmount * SELLER_COMMISSION_RATE);
  return {
    source_price: sourcePrice,
    margin_rate: MARGIN_RATE,
    margin_amount: marginAmount,
    sale_price: salePrice,
    seller_commission_rate: SELLER_COMMISSION_RATE,
    seller_commission_amount: sellerCommission,
    net_margin_after_seller: round2(marginAmount - sellerCommission),
  };
}

function enrichCommercialFields(product, position) {
  const featured = product.tipoVenta !== "profesional_consulta" && position < 12;
  const discountPercent = featured ? DISCOUNT_PERCENT : 0;
  const basePrice = typeof product.precioValor === "number" ? product.precioValor : null;
  const customerDiscount = basePrice === null ? 0 : round2(basePrice * (discountPercent / 100));
  const promoPrice = basePrice === null ? null : round2(basePrice - customerDiscount);
  const netGainBeforeDiscount = typeof product.gananciaNeta === "number" ? product.gananciaNeta : 0;

  return {
    ...product,
    destacadoMes: featured,
    descuentoPorcentaje: discountPercent,
    precioPromocional: featured && promoPrice !== null ? promoPrice : null,
    gananciaNetaConDescuento:
      featured && promoPrice !== null ? round2(netGainBeforeDiscount - customerDiscount) : netGainBeforeDiscount,
  };
}

function buildFinanceSheet(products, meta) {
  const rows = products.map((product, index) => {
    const sourcePrice = Number(product.precioProveedor ?? product.raw?.pricing_formula?.source_price ?? 0);
    const margin = Number(product.raw?.pricing_formula?.margin_amount ?? product.margenCalculado ?? sourcePrice * MARGIN_RATE);
    const salePrice = Number(product.precioValor ?? product.raw?.pricing_formula?.sale_price ?? 0);
    const sellerCommission = Number(product.comisionVendedor ?? product.raw?.pricing_formula?.seller_commission_amount ?? margin * SELLER_COMMISSION_RATE);
    const netGain = Number(product.gananciaNeta ?? product.raw?.pricing_formula?.net_margin_after_seller ?? margin - sellerCommission);
    const discountPercent = Number(product.descuentoPorcentaje || 0);
    const customerDiscount = salePrice ? round2(salePrice * (discountPercent / 100)) : 0;
    const promoPrice = salePrice ? round2(salePrice - customerDiscount) : 0;
    const netGainAfterDiscount = round2(netGain - customerDiscount);

    return {
      index: index + 1,
      slug: productSlug(product),
      titulo: product.titulo,
      marca: product.marca,
      categoria: product.categoria,
      tamano: product.tamano || "",
      tipo_venta: product.tipoVenta || "publico",
      precio_referencia_hbderm: round2(sourcePrice),
      ganancia_objetivo_45: round2(margin),
      precio_venta_nuvia: round2(salePrice),
      descuento_destacado_pct: discountPercent,
      descuento_cliente: customerDiscount,
      precio_promocional: promoPrice,
      comision_vendedor_10_ganancia: round2(sellerCommission),
      ganancia_neta: round2(netGain),
      ganancia_neta_con_descuento: netGainAfterDiscount,
      source_url: product.sourceUrl || product.raw?.source_url || "",
    };
  });

  const totals = rows.reduce(
    (acc, row) => ({
      productos: acc.productos + 1,
      precio_referencia_hbderm: round2(acc.precio_referencia_hbderm + row.precio_referencia_hbderm),
      ganancia_objetivo_45: round2(acc.ganancia_objetivo_45 + row.ganancia_objetivo_45),
      precio_venta_nuvia: round2(acc.precio_venta_nuvia + row.precio_venta_nuvia),
      descuento_cliente: round2(acc.descuento_cliente + row.descuento_cliente),
      precio_promocional: round2(acc.precio_promocional + row.precio_promocional),
      comision_vendedor_10_ganancia: round2(
        acc.comision_vendedor_10_ganancia + row.comision_vendedor_10_ganancia,
      ),
      ganancia_neta: round2(acc.ganancia_neta + row.ganancia_neta),
      ganancia_neta_con_descuento: round2(acc.ganancia_neta_con_descuento + row.ganancia_neta_con_descuento),
    }),
    {
      productos: 0,
      precio_referencia_hbderm: 0,
      ganancia_objetivo_45: 0,
      precio_venta_nuvia: 0,
      descuento_cliente: 0,
      precio_promocional: 0,
      comision_vendedor_10_ganancia: 0,
      ganancia_neta: 0,
      ganancia_neta_con_descuento: 0,
    },
  );

  const fields = [
    "index",
    "slug",
    "titulo",
    "marca",
    "categoria",
    "tamano",
    "tipo_venta",
    "precio_referencia_hbderm",
    "ganancia_objetivo_45",
    "precio_venta_nuvia",
    "descuento_destacado_pct",
    "descuento_cliente",
    "precio_promocional",
    "comision_vendedor_10_ganancia",
    "ganancia_neta",
    "ganancia_neta_con_descuento",
    "source_url",
  ];

  return {
    json: {
      generated_at: new Date().toISOString(),
      source: meta.source,
      source_products: meta.sourceProductCount,
      public_products: meta.publicProductCount,
      internal_professional_products: meta.internalProfessionalCount,
      assumptions: {
        precio_referencia_hbderm: "Precio publico de referencia del proveedor.",
        precio_venta_nuvia: "precio_referencia_hbderm - 45% segun regla comercial indicada por Sergio.",
        ganancia_objetivo_45: "45% del precio de referencia.",
        comision_vendedor: "10% de la ganancia objetivo.",
        descuento_destacado: "10% aplicado solo a destacados del mes; reduce margen neto.",
      },
      totals,
      rows,
    },
    csv: [csvRow(fields), ...rows.map((row) => csvRow(fields.map((field) => row[field])))].join("\n") + "\n",
  };
}

function normalizeProduct(product, index) {
  const category = normalizeCategory(product);
  const formula = productFormula(product.price);
  const title = prettyTitle(product.title);
  const size = extractSize(title);
  const routine = routineForCategory(category);
  const active = category !== "Profesional consulta";
  const etiqueta = active ? (category === "Proteccion solar" ? "SPF" : "Nuvia") : "consulta";

  return {
    titulo: title,
    categoria: category,
    precio: active ? moneyLabel(formula.sale_price) : "Bajo consulta",
    precioValor: active ? formula.sale_price : null,
    moneda: product.currency || "BOB",
    desc: compactDescription(product, category),
    etiqueta,
    imagen: product.image_url || "assets/hbderm-image-slot.svg",
    imagenAlt: `${title} de ${product.brand || "Nuvia"}`,
    marca: product.brand || "Nuvia",
    tamano: size,
    uso: routine.label,
    beneficios: categoryBenefits(category),
    idealPara: categoryIdealFor(category),
    ingredientesClave: ["Ver envase", "Confirmar composicion"],
    modoUso:
      category === "Profesional consulta"
        ? "Producto de uso profesional o bajo consulta. No se debe comprar ni usar sin indicacion adecuada."
        : "Usar segun la indicacion del envase o recomendacion profesional. Suspender si existe irritacion persistente.",
    incluye: [
      `1 producto ${title}`,
      size ? `Presentacion ${size}` : "Presentacion segun disponibilidad",
      "Confirmacion de disponibilidad antes de entregar",
      "Cotizacion/checkout preparado en Nuvia",
    ],
    especificaciones: [
      { label: "Marca", value: product.brand || "Nuvia" },
      { label: "Proveedor", value: "HBDERM" },
      { label: "Categoria", value: category },
      { label: "Tamano", value: size || "Consultar" },
      { label: "Precio Nuvia", value: active ? moneyLabel(formula.sale_price) : "Bajo consulta" },
    ],
    detalleImagenes: [
      {
        src: product.image_url || "assets/hbderm-image-slot.svg",
        alt: `${title} imagen de referencia`,
        label: "Imagen referencia",
      },
      {
        src: "assets/hbderm-image-slot.svg",
        alt: "Espacio para foto propia Nuvia",
        label: "Foto propia pendiente",
      },
      {
        src: "assets/hbderm-video-slot.svg",
        alt: "Espacio para video de uso Nuvia",
        label: "Video pendiente",
      },
    ],
    detalleNota:
      category === "Profesional consulta"
        ? "Producto cargado en base interna para revision comercial. No publicarlo como compra directa sin validar regulacion, stock y uso profesional."
        : "Producto cargado con precio calculado para Nuvia. La disponibilidad final se confirma antes del cobro.",
    ordenRutina: routine.order,
    proveedor: "HBDERM",
    sourceUrl: product.source_url,
    sourceImageUrl: product.image_url,
    precioProveedor: product.price,
    margenObjetivo: MARGIN_RATE,
    comisionVendedorRate: SELLER_COMMISSION_RATE,
    comisionVendedor: formula.seller_commission_amount,
    gananciaNeta: formula.net_margin_after_seller,
    tipoVenta: active ? "publico" : "profesional_consulta",
    raw: {
      source: "hbderm.com",
      source_url: product.source_url,
      source_categories: product.categories,
      source_availability: product.availability,
      pricing_formula: formula,
      source_index: index,
    },
  };
}

function productSlug(product) {
  return slugify(product.titulo);
}

function applyFeaturedSource(enriched, product, source, index) {
  const formula = productFormula(source.price);
  enriched.precio = moneyLabel(formula.sale_price);
  enriched.precioValor = formula.sale_price;
  enriched.proveedor = "HBDERM";
  enriched.sourceUrl = source.source_url;
  enriched.sourceImageUrl = source.image_url;
  enriched.precioProveedor = source.price;
  enriched.margenObjetivo = MARGIN_RATE;
  enriched.comisionVendedorRate = SELLER_COMMISSION_RATE;
  enriched.comisionVendedor = formula.seller_commission_amount;
  enriched.gananciaNeta = formula.net_margin_after_seller;
  enriched.tipoVenta = "publico";
  enriched.raw = {
    source: "hbderm.com",
    source_url: source.source_url,
    source_categories: source.categories,
    pricing_formula: formula,
    source_index: `featured-${index}`,
  };
  enriched.especificaciones = (product.especificaciones || []).map((spec) =>
    spec.label === "Precio" ? { ...spec, value: moneyLabel(formula.sale_price) } : spec,
  );
  return enriched;
}

function dedupeProducts(products) {
  const seen = new Map();

  return products.filter((product) => {
    const slug = productSlug(product);
    if (seen.has(slug)) {
      return false;
    }
    seen.set(slug, product);
    return true;
  });
}

function sqlString(value) {
  return String(value ?? "").replace(/'/g, "''");
}

function sqlJson(value) {
  return sqlString(JSON.stringify(value ?? {}));
}

function sqlArray(values) {
  return `array[${values.map((value) => `'${sqlString(value)}'`).join(",")}]::text[]`;
}

function generateMigration(products, meta) {
  const rows = products.map((product, index) => {
    const slug = productSlug(product);
    const active = product.tipoVenta !== "profesional_consulta";
    return {
      slug,
      title: product.titulo,
      short_title: product.titulo,
      brand: product.marca,
      category: product.categoria,
      size: product.tamano,
      routine_step: product.ordenRutina ?? null,
      routine_label: product.uso,
      price_label: product.precio,
      price_value: product.precioValor,
      currency: product.moneda || "BOB",
      stock_status: active ? "in_stock" : "quote_only",
      active,
      featured: index < 12 && active,
      discount_percent: active ? DISCOUNT_PERCENT : null,
      description: product.desc,
      usage_notes: product.modoUso,
      benefits: product.beneficios,
      ideal_for: product.idealPara,
      ingredients: product.ingredientesClave,
      image_path: product.imagen,
      image_alt: product.imagenAlt,
      sort_order: 1000 + index,
      raw: product.raw,
    };
  });

  const sections = [
    ["destacados-del-mes", "Destacados", "Productos destacados del mes", "Productos con precio Nuvia calculado y 10% promocional visible.", 10],
    ["proteccion-solar", "Categoria", "Proteccion solar", "Fotoprotectores y productos con SPF.", 20],
    ["limpieza-facial", "Categoria", "Limpieza facial", "Limpiadores y geles para rutina facial.", 30],
    ["piel-grasa-y-acne", "Categoria", "Piel grasa y acne", "Productos para piel grasa o con tendencia acneica.", 40],
    ["hidratacion", "Categoria", "Hidratacion", "Cremas y productos de soporte de barrera.", 50],
    ["antiedad", "Categoria", "Antiedad", "Serums y rutinas de tratamiento.", 60],
    ["manchas", "Categoria", "Manchas", "Rutinas orientadas a tono y manchas.", 70],
    ["cabello-y-unas", "Categoria", "Cabello y unas", "Productos para cabello, unas y soporte cosmetico.", 80],
    ["bebe-y-ninos", "Categoria", "Bebe y ninos", "Cuidado familiar y pediatrico.", 90],
    ["dermocosmetica", "Categoria", "Dermocosmetica", "Otros productos dermocosmeticos.", 100],
    ["profesional-consulta", "Interno", "Profesional bajo consulta", "Productos de uso profesional no publicados como compra directa.", 900],
  ];

  return `-- HBDERM product import for Nuvia.
-- Source scrape: web-factory/data/references/product-sources/hbderm-products-20260619.json
-- Pricing formula: sale_price = source_price - (source_price * 0.45).
-- Seller commission: 10% of calculated margin.
-- Generated by web-factory/harvester/product/build_nuvia_hbderm_catalog.mjs.

with store_ref as (
  select id from web_factory.stores where slug = 'nuvia'
),
store_update as (
  update web_factory.stores
  set raw = raw || '${sqlJson({
    hbderm_source: "https://hbderm.com/",
    hbderm_products_scraped: meta.source_product_count,
    hbderm_products_imported: meta.imported_product_count,
    hbderm_public_products: meta.public_product_count,
    hbderm_professional_internal_products: meta.professional_internal_count,
    pricing_formula: {
      sale_price: "source_price - (source_price * 0.45)",
      seller_commission: "(source_price * 0.45) * 0.10",
    },
    media_rule: "Remote HBDERM images are reference assets; replace with owned Nuvia media before launch when needed.",
  })}'::jsonb,
  updated_at = now()
  where slug = 'nuvia'
)
insert into web_factory.products (
  store_id, slug, title, short_title, brand, category, size, routine_step,
  routine_label, price_label, price_value, currency, stock_status, active,
  featured, discount_percent, description, usage_notes, benefits, ideal_for,
  ingredients, image_path, image_alt, sort_order, raw
)
select
  store_ref.id,
  product.slug,
  product.title,
  product.short_title,
  product.brand,
  product.category,
  product.size,
  product.routine_step,
  product.routine_label,
  product.price_label,
  product.price_value,
  product.currency,
  product.stock_status,
  product.active,
  product.featured,
  product.discount_percent,
  product.description,
  product.usage_notes,
  product.benefits,
  product.ideal_for,
  product.ingredients,
  product.image_path,
  product.image_alt,
  product.sort_order,
  product.raw
from store_ref
cross join (
  values
${rows
  .map(
    (product) => `    (
      '${sqlString(product.slug)}',
      '${sqlString(product.title)}',
      '${sqlString(product.short_title)}',
      '${sqlString(product.brand)}',
      '${sqlString(product.category)}',
      '${sqlString(product.size)}',
      ${product.routine_step === null ? "null" : product.routine_step},
      '${sqlString(product.routine_label)}',
      '${sqlString(product.price_label)}',
      ${product.price_value === null ? "null" : product.price_value},
      '${sqlString(product.currency)}',
      '${sqlString(product.stock_status)}',
      ${product.active ? "true" : "false"},
      ${product.featured ? "true" : "false"},
      ${product.discount_percent === null ? "null" : product.discount_percent},
      '${sqlString(product.description)}',
      '${sqlString(product.usage_notes)}',
      ${sqlArray(product.benefits)},
      ${sqlArray(product.ideal_for)},
      ${sqlArray(product.ingredients)},
      '${sqlString(product.image_path)}',
      '${sqlString(product.image_alt)}',
      ${product.sort_order},
      '${sqlJson(product.raw)}'::jsonb
    )`,
  )
  .join(",\n")}
) as product(
  slug, title, short_title, brand, category, size, routine_step, routine_label,
  price_label, price_value, currency, stock_status, active, featured,
  discount_percent, description, usage_notes, benefits, ideal_for,
  ingredients, image_path, image_alt, sort_order, raw
)
on conflict (store_id, slug) do update set
  title = excluded.title,
  short_title = excluded.short_title,
  brand = excluded.brand,
  category = excluded.category,
  size = excluded.size,
  routine_step = excluded.routine_step,
  routine_label = excluded.routine_label,
  price_label = excluded.price_label,
  price_value = excluded.price_value,
  currency = excluded.currency,
  stock_status = excluded.stock_status,
  active = excluded.active,
  featured = excluded.featured,
  discount_percent = excluded.discount_percent,
  description = excluded.description,
  usage_notes = excluded.usage_notes,
  benefits = excluded.benefits,
  ideal_for = excluded.ideal_for,
  ingredients = excluded.ingredients,
  image_path = excluded.image_path,
  image_alt = excluded.image_alt,
  sort_order = excluded.sort_order,
  raw = web_factory.products.raw || excluded.raw,
  updated_at = now();

with store_ref as (
  select id from web_factory.stores where slug = 'nuvia'
),
section_seed as (
  select *
  from (
    values
${sections
  .map(
    ([slug, label, title, description, sortOrder]) =>
      `      ('${sqlString(slug)}', '${sqlString(label)}', '${sqlString(title)}', '${sqlString(description)}', ${sortOrder})`,
  )
  .join(",\n")}
  ) as section(slug, label, title, description, sort_order)
)
insert into web_factory.product_sections (store_id, slug, label, title, description, sort_order)
select store_ref.id, section_seed.slug, section_seed.label, section_seed.title, section_seed.description, section_seed.sort_order
from store_ref, section_seed
on conflict (store_id, slug) do update set
  label = excluded.label,
  title = excluded.title,
  description = excluded.description,
  sort_order = excluded.sort_order,
  active = true,
  updated_at = now();

with target as (
  select
    section.id as section_id,
    product.id as product_id,
    product.sort_order
  from web_factory.stores store
  join web_factory.product_sections section on section.store_id = store.id
  join web_factory.products product on product.store_id = store.id
  where store.slug = 'nuvia'
    and (
      (section.slug = 'destacados-del-mes' and product.featured)
      or section.slug = replace(lower(product.category), ' ', '-')
    )
)
insert into web_factory.product_section_items (section_id, product_id, sort_order)
select section_id, product_id, sort_order from target
on conflict (section_id, product_id) do update set
  sort_order = excluded.sort_order;

insert into web_factory.product_media (product_id, src, alt, label, media_type, sort_order)
select product.id, product.image_path, product.image_alt, 'Imagen referencia HBDERM', 'image', 10
from web_factory.stores store
join web_factory.products product on product.store_id = store.id
where store.slug = 'nuvia'
  and product.raw->>'source' = 'hbderm.com'
on conflict (product_id, src) do update set
  alt = excluded.alt,
  label = excluded.label,
  media_type = excluded.media_type,
  sort_order = excluded.sort_order;

insert into web_factory.product_media (product_id, src, alt, label, media_type, sort_order)
select product.id, 'assets/hbderm-video-slot.svg', product.title || ' video pendiente', 'Video pendiente', 'video', 20
from web_factory.stores store
join web_factory.products product on product.store_id = store.id
where store.slug = 'nuvia'
  and product.raw->>'source' = 'hbderm.com'
on conflict (product_id, src) do update set
  alt = excluded.alt,
  label = excluded.label,
  media_type = excluded.media_type,
  sort_order = excluded.sort_order;
`;
}

async function main() {
  const [nuviaRaw, scrapeRaw] = await Promise.all([
    readFile(NUVIA_JSON, "utf8"),
    readFile(SCRAPE_JSON, "utf8"),
  ]);
  const nuvia = JSON.parse(nuviaRaw);
  const scrape = JSON.parse(scrapeRaw);
  const baseProductTitles = new Set(["ISDIN Fusion Water Magic SPF 50", "SVR Sebiaclear Gel Moussant"]);
  const baseProducts = nuvia.productos.filter((product) => baseProductTitles.has(product.titulo));
  const currentProducts = baseProducts.map((product, index) => {
    const enriched = { ...product };

    if (product.titulo === "ISDIN Fusion Water Magic SPF 50") {
      const source = scrape.products.find((entry) => entry.title === "FUSION WATER MAGIC SPF50+");
      if (source) {
        applyFeaturedSource(enriched, product, source, index);
      }
    }

    if (product.titulo === "SVR Sebiaclear Gel Moussant") {
      const source = scrape.products.find((entry) =>
        entry.source_url?.includes("/sebiaclear-gel-moussant-200ml/"),
      );
      if (source) {
        applyFeaturedSource(enriched, product, source, index);
      }
    }

    return enriched;
  });

  const currentSlugs = new Set(currentProducts.map(productSlug));
  const currentSourceUrls = new Set(currentProducts.map((product) => product.sourceUrl).filter(Boolean));
  const importedProducts = dedupeProducts(scrape.products.map(normalizeProduct))
    .filter((product) => !currentSlugs.has(productSlug(product)))
    .filter((product) => !currentSourceUrls.has(product.sourceUrl))
    .sort((a, b) => {
      const categoryOrder = [
        "Proteccion solar",
        "Limpieza facial",
        "Piel grasa y acne",
        "Hidratacion",
        "Antiedad",
        "Manchas",
        "Cabello y unas",
        "Bebe y ninos",
        "Dermocosmetica",
        "Profesional consulta",
      ];
      return categoryOrder.indexOf(a.categoria) - categoryOrder.indexOf(b.categoria) || a.titulo.localeCompare(b.titulo);
    });

  const publicImportedProducts = importedProducts.filter((product) => product.tipoVenta !== "profesional_consulta");
  const productsForJson = [...currentProducts, ...publicImportedProducts].map(enrichCommercialFields);
  const allProductsForFinance = [...currentProducts, ...importedProducts].map(enrichCommercialFields);
  const allCategories = [...new Set(productsForJson.map((product) => product.categoria).filter(Boolean))];

  nuvia.descripcion =
    "Nuvia reune skincare y dermocosmetica para todos los dias: elige productos por rutina, agrega al carrito y confirma tu compra asistida sin vueltas.";
  nuvia.categorias = allCategories;
  nuvia.productos = productsForJson;
  nuvia.seo = {
    ...nuvia.seo,
    title: "Nuvia | Catalogo skincare y dermocosmetica",
    description: "Catalogo Nuvia con skincare, dermocosmetica, precios calculados, carrito y compra asistida.",
  };

  const normalized = {
    source: scrape.source,
    fetched_at: scrape.fetched_at,
    generated_at: new Date().toISOString(),
    source_product_count: scrape.product_count,
    public_product_count: productsForJson.length,
    imported_public_count: publicImportedProducts.length,
    professional_internal_count: importedProducts.length - publicImportedProducts.length,
    pricing_formula: {
      sale_price: "source_price - (source_price * 0.45)",
      seller_commission: "(source_price * 0.45) * 0.10",
      margin_rate: MARGIN_RATE,
      seller_commission_rate: SELLER_COMMISSION_RATE,
    },
    products: productsForJson,
    internal_professional_products: allProductsForFinance.filter((product) => product.tipoVenta === "profesional_consulta"),
  };
  const finance = buildFinanceSheet(allProductsForFinance, {
    source: scrape.source,
    sourceProductCount: scrape.product_count,
    publicProductCount: productsForJson.length,
    internalProfessionalCount: allProductsForFinance.filter((product) => product.tipoVenta === "profesional_consulta").length,
  });

  await mkdir(path.dirname(NORMALIZED_JSON), { recursive: true });
  await mkdir(path.dirname(FINANCE_JSON), { recursive: true });
  await writeFile(NUVIA_JSON, `${JSON.stringify(nuvia, null, 2)}\n`);
  await writeFile(NORMALIZED_JSON, `${JSON.stringify(normalized, null, 2)}\n`);
  await writeFile(FINANCE_JSON, `${JSON.stringify(finance.json, null, 2)}\n`);
  await writeFile(FINANCE_CSV, finance.csv);
  await writeFile(
    MIGRATION,
    generateMigration(allProductsForFinance, {
      source_product_count: scrape.product_count,
      imported_product_count: importedProducts.length,
      public_product_count: productsForJson.length,
      professional_internal_count: importedProducts.length - publicImportedProducts.length,
    }),
  );

  console.log(
    JSON.stringify(
      {
        updated: NUVIA_JSON,
        normalized: NORMALIZED_JSON,
        finance_json: FINANCE_JSON,
        finance_csv: FINANCE_CSV,
        migration: MIGRATION,
        public_products: productsForJson.length,
        public_imported: publicImportedProducts.length,
        internal_professional: importedProducts.length - publicImportedProducts.length,
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

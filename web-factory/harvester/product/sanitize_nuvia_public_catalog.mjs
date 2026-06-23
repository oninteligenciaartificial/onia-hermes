import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const NUVIA_JSON = path.resolve("data/clients/nuvia.json");
const PUBLIC_MEDIA_DIR = path.resolve("apps/site/public/nuvia/assets/product-media");
const CANONICAL_MEDIA_DIR = path.resolve("data/clients/nuvia.assets/product-media");
const IMAGE_SLOT = "assets/product-image-pending.svg";
const VIDEO_SLOT = "assets/product-video-pending.svg";
const PUBLIC_DESCRIPTION =
  "Nuvia reune skincare y dermocosmetica para todos los dias: elige productos por rutina, agrega al carrito y confirma tu compra asistida sin vueltas.";

const SENSITIVE_KEYS = [
  "proveedor",
  "sourceUrl",
  "sourceImageUrl",
  "precioProveedor",
  "margenObjetivo",
  "comisionVendedorRate",
  "comisionVendedor",
  "gananciaNeta",
  "gananciaNetaConDescuento",
  "raw",
  "mediaEnrichment",
];

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

function isRemote(value) {
  return /^https?:\/\//i.test(String(value || ""));
}

function extensionFrom(url, contentType = "") {
  const byType = {
    "image/avif": ".avif",
    "image/gif": ".gif",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };

  if (byType[contentType.toLowerCase()]) {
    return byType[contentType.toLowerCase()];
  }

  try {
    const pathname = new URL(url).pathname.toLowerCase();
    const ext = path.extname(pathname);
    if ([".avif", ".gif", ".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      return ext === ".jpeg" ? ".jpg" : ext;
    }
  } catch {
    // Fall through to default.
  }

  return ".jpg";
}

function publicLabelForCategory(category, fallback = "Nuvia") {
  const labels = {
    Antiedad: "tratamiento",
    "Bebe y ninos": "familia",
    "Cabello y unas": "cuidado",
    Dermocosmetica: "seleccion",
    Hidratacion: "hidratar",
    "Limpieza facial": "limpiar",
    Manchas: "tono",
    "Piel grasa y acne": "control",
    "Proteccion solar": "SPF",
  };

  return labels[category] || fallback;
}

function publicDescription(product) {
  const brand = product.marca && product.marca !== "HBDERM" ? product.marca : "Nuvia";
  const category = product.categoria || "dermocosmetica";

  if (category === "Proteccion solar") {
    return `${brand} para proteccion solar diaria. Confirma disponibilidad y recomendacion de uso antes de finalizar la compra.`;
  }
  if (category === "Limpieza facial") {
    return `${brand} para limpiar la piel y preparar la rutina diaria sin agregar pasos innecesarios.`;
  }
  if (category === "Piel grasa y acne") {
    return `${brand} para rutinas de piel grasa o con tendencia acneica. No reemplaza una consulta dermatologica.`;
  }
  if (category === "Hidratacion") {
    return `${brand} para hidratacion diaria y soporte de barrera cutanea.`;
  }
  if (category === "Manchas") {
    return `${brand} para rutinas orientadas a tono y manchas. Usar con constancia y proteccion solar.`;
  }
  if (category === "Antiedad") {
    return `${brand} para rutina de tratamiento, textura y cuidado diario de la piel.`;
  }

  return `${brand} seleccionado por Nuvia para compra asistida. Confirma disponibilidad antes de comprar.`;
}

function sanitizeString(value) {
  return String(value || "")
    .replace(/hbderm\.com/gi, "nuvia")
    .replace(/HBDERM/gi, "Nuvia")
    .replace(/desde Nuvia/gi, "por Nuvia")
    .replace(/Seleccion Nuvia/gi, "Seleccion Nuvia")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeAlt(value, product) {
  const fallbackBrand = product.marca && product.marca !== "HBDERM" ? product.marca : "Nuvia";
  return sanitizeString(value || `${product.titulo} disponible en ${fallbackBrand}`);
}

function collectImageCandidates(product) {
  const candidates = [product.imagen];

  for (const image of product.detalleImagenes || []) {
    candidates.push(image.src);
  }

  for (const image of product.mediaEnrichment?.candidateImages || []) {
    candidates.push(image.url);
  }

  return [...new Set(candidates.filter(Boolean))].slice(0, 4);
}

async function fetchImage(url) {
  const response = await fetch(url, {
    headers: {
      accept: "image/avif,image/webp,image/png,image/jpeg,image/*;q=0.8,*/*;q=0.5",
      "user-agent": "ONIA-WebFactory/1.0 public media cache",
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get("content-type")?.split(";")[0] || "";
  if (!contentType.startsWith("image/")) {
    throw new Error(`Unexpected content type ${contentType || "unknown"}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return { buffer, ext: extensionFrom(url, contentType) };
}

async function writeBoth(relativePath, buffer) {
  const publicPath = path.join("apps/site/public/nuvia", relativePath);
  const canonicalPath = path.join("data/clients/nuvia.assets", relativePath.replace(/^assets\//, ""));

  await mkdir(path.dirname(publicPath), { recursive: true });
  await mkdir(path.dirname(canonicalPath), { recursive: true });
  await writeFile(publicPath, buffer);
  await writeFile(canonicalPath, buffer);
}

async function cacheCandidate(url, slug, index) {
  if (!isRemote(url)) {
    return url;
  }

  try {
    const { buffer, ext } = await fetchImage(url);
    const relative = `assets/product-media/${slug}${index ? `-${index + 1}` : ""}${ext}`;
    await writeBoth(relative, buffer);
    return relative;
  } catch {
    return "";
  }
}

async function cacheProductMedia(product) {
  const slug = slugify(product.titulo);
  const cached = [];
  const candidates = collectImageCandidates(product);

  for (const candidate of candidates) {
    if (cached.length >= 2) {
      break;
    }

    const local = await cacheCandidate(candidate, slug, cached.length);
    if (local && !cached.includes(local) && !/hbderm/i.test(local)) {
      cached.push(local);
    }
  }

  if (!cached.length && product.imagen && !isRemote(product.imagen) && !/hbderm/i.test(product.imagen)) {
    cached.push(product.imagen);
  }

  return cached;
}

function publicProduct(product, cachedImages) {
  const clean = { ...product };
  const brand = clean.marca === "HBDERM" ? "Nuvia" : sanitizeString(clean.marca || "Nuvia");
  const primary = cachedImages[0] || IMAGE_SLOT;
  const secondary = cachedImages[1] || IMAGE_SLOT;

  for (const key of SENSITIVE_KEYS) {
    delete clean[key];
  }

  clean.marca = brand;
  clean.desc = sanitizeString(publicDescription({ ...clean, marca: brand }));
  clean.etiqueta = clean.etiqueta && clean.etiqueta !== "HBDERM" ? sanitizeString(clean.etiqueta) : publicLabelForCategory(clean.categoria);
  clean.imagen = primary;
  clean.imagenAlt = sanitizeAlt(clean.imagenAlt, { ...clean, marca: brand });
  clean.beneficios = (clean.beneficios || []).map(sanitizeString).map((item) => item || "Seleccion Nuvia");
  clean.idealPara = (clean.idealPara || []).map(sanitizeString);
  clean.ingredientesClave = (clean.ingredientesClave || []).map(sanitizeString);
  clean.modoUso = sanitizeString(clean.modoUso);
  clean.incluye = (clean.incluye || []).map(sanitizeString);
  clean.especificaciones = (clean.especificaciones || [])
    .filter((item) => !/proveedor|costo|margen|comision/i.test(item.label || ""))
    .map((item) => ({
      label: sanitizeString(item.label),
      value: sanitizeString(item.value),
    }));
  clean.detalleImagenes = [
    {
      src: primary,
      alt: sanitizeAlt(clean.imagenAlt, clean),
      label: "Imagen producto",
    },
    {
      src: secondary,
      alt: secondary === IMAGE_SLOT ? "Espacio para foto propia Nuvia" : sanitizeAlt(clean.imagenAlt, clean),
      label: secondary === IMAGE_SLOT ? "Foto propia pendiente" : "Imagen secundaria",
    },
    {
      src: VIDEO_SLOT,
      alt: "Espacio para video de producto Nuvia",
      label: "Video pendiente",
    },
  ];
  clean.detalleNota =
    "Compra asistida por Nuvia. Confirmamos disponibilidad, precio final y forma de entrega antes del cobro.";

  return clean;
}

async function main() {
  const client = JSON.parse(await readFile(NUVIA_JSON, "utf8"));
  const products = [];
  let remoteImagesCached = 0;
  let placeholderProducts = 0;

  for (const product of client.productos || []) {
    const cachedImages = await cacheProductMedia(product);
    remoteImagesCached += cachedImages.filter((src) => src.startsWith("assets/product-media/")).length;
    if (!cachedImages.length) {
      placeholderProducts += 1;
    }
    products.push(publicProduct(product, cachedImages));
  }

  client.descripcion = PUBLIC_DESCRIPTION;
  client.productos = products;
  client.seo = {
    ...client.seo,
    title: "Nuvia | Catalogo skincare y dermocosmetica",
    description: "Catalogo Nuvia con skincare, dermocosmetica, carrito y compra asistida.",
  };

  await writeFile(NUVIA_JSON, `${JSON.stringify(client, null, 2)}\n`);

  console.log(
    JSON.stringify(
      {
        products: products.length,
        remoteImagesCached,
        placeholderProducts,
        publicDescription: client.descripcion,
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

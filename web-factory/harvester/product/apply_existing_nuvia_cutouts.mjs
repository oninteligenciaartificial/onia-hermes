import { readFile, writeFile } from "node:fs/promises";
import { readdirSync } from "node:fs";
import path from "node:path";

const NUVIA_JSON = path.resolve("data/clients/nuvia.json");
const PUBLIC_CUTOUT_DIR = path.resolve("apps/site/public/nuvia/assets/product-media-cutout");
const DATA_CUTOUT_DIR = path.resolve("data/clients/nuvia.assets/product-media-cutout");
const ERROR_LOG = path.resolve("data/references/product-sources/nuvia-cutout-map-errors.json");

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
  ).slice(0, 90);
}

function cutoutIndex() {
  const files = new Map();
  const dirs = [PUBLIC_CUTOUT_DIR, DATA_CUTOUT_DIR];

  for (const dir of dirs) {
    try {
      for (const file of readdirSync(dir)) {
        if (!file.endsWith(".png")) {
          continue;
        }
        files.set(file, `assets/product-media-cutout/${file}`);
      }
    } catch {
      // Directory can be absent on a fresh checkout before media generation.
    }
  }

  return files;
}

function findCutout(files, index, title) {
  const slug = slugify(title);
  const exact = `${String(index).padStart(3, "0")}-${slug}.png`;

  if (files.has(exact)) {
    return files.get(exact);
  }

  for (const [file, relative] of files) {
    if (file.endsWith(`-${slug}.png`) || file.includes(slug)) {
      return relative;
    }
  }

  return "";
}

const data = JSON.parse(await readFile(NUVIA_JSON, "utf8"));
const files = cutoutIndex();
const errors = [];
let applied = 0;

data.productos = (data.productos || []).map((product, index) => {
  const cutout = findCutout(files, index + 1, product.titulo);

  if (!cutout) {
    errors.push({ index: index + 1, title: product.titulo });
    return product;
  }

  applied += 1;
  const detalleImagenes = Array.isArray(product.detalleImagenes) ? [...product.detalleImagenes] : [];
  detalleImagenes[0] = {
    ...(detalleImagenes[0] || {}),
    src: cutout,
    alt: product.imagenAlt || `${product.titulo} en Nuvia`,
    label: "Imagen producto",
  };

  return {
    ...product,
    imagen: cutout,
    detalleImagenes,
  };
});

await writeFile(NUVIA_JSON, `${JSON.stringify(data, null, 2)}\n`);
await writeFile(ERROR_LOG, `${JSON.stringify(errors, null, 2)}\n`);

console.log(JSON.stringify({ products: data.productos.length, applied, missingCutouts: errors.length, errorLog: ERROR_LOG }, null, 2));

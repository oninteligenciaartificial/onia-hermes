#!/usr/bin/env node
/**
 * Puente configurador → Web Factory.
 *
 * El configurador de onia.com.bo/servicios/webs manda por WhatsApp un mensaje
 * con formato FIJO (lo genera `WebConfigurator.tsx`, no el cliente). Ese
 * mensaje ya trae todo lo que el motor necesita para armar el sitio: negocio,
 * rubro, oferta, servicios, alcance, paleta, tipografía y objetivo. Este script
 * lo convierte en `data/intakes/<slug>.intake.json` y, con `--build`, corre el
 * mismo `factory:build` que usa cualquier cliente → `out/<slug>/`.
 *
 * Sergio Urcullo, 2026-09-17: «¿y vos cómo desarrollarías una?». Así: el
 * pedido pegado en un archivo, un comando, y el primer render en minutos. Lo
 * que el mensaje no trae (fotos, logo, dominio) sale como «pending inputs»,
 * que es el checklist que se le pide al cliente — no se inventa.
 *
 * Uso:
 *   pnpm tsx generate/from-configurador.ts <mensaje.txt> [--build] [--force] [--slug x]
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Command } from "commander";
import { WEB_PALETTES } from "../apps/onia-platform/src/content/web-configurator";
import type { WebFactoryTemplate } from "../data/schema";
import { sanitizeCliArgv } from "./argv";
import { runFactoryBuild } from "./factory-build";

export interface ConfiguradorPedido {
  readonly contacto: string;
  readonly negocio: string;
  readonly rubro: string;
  readonly ciudad: string;
  readonly whatsapp: string;
  readonly email: string;
  readonly oferta: string;
  readonly descripcion: string;
  readonly servicios: readonly string[];
  readonly fotografias: string;
  readonly referencia: string;
  /** «¿Ya tenés web? Pegá el link»: la web que el cliente tiene hoy. */
  readonly webActual: string;
  readonly notas: string;
  readonly nivel: string;
  readonly precioBase: string;
  readonly direccion: string;
  readonly estructura: string;
  readonly paleta: string;
  readonly color: string;
  readonly tipografia: string;
  readonly objetivo: string;
  readonly origenSergio: boolean;
}

const LABELS: Record<string, keyof ConfiguradorPedido> = {
  "Contacto": "contacto",
  "Negocio": "negocio",
  "WhatsApp": "whatsapp",
  "Email": "email",
  "Oferta principal": "oferta",
  "Descripción": "descripcion",
  "Fotografías": "fotografias",
  "Web actual": "webActual",
  "Referencia": "referencia",
  "Necesidades adicionales": "notas",
  "Nivel": "nivel",
  "Precio base": "precioBase",
  "Dirección visual": "direccion",
  "Estructura": "estructura",
  "Tipografía": "tipografia",
  "Objetivo principal": "objetivo",
};

function sinPuntoFinal(value: string): string {
  return value.trim().replace(/\.\s*$/, "");
}

/** Lee el mensaje que arma el configurador. Es NUESTRO formato: etiqueta, dos puntos, valor. */
export function parseConfiguradorMessage(text: string): ConfiguradorPedido {
  const fields: Record<string, string> = {};
  let servicios: string[] = [];
  let rubro = "";
  let ciudad = "";
  let paleta = "";
  let color = "";

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    const label = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();

    if (label === "Rubro y ciudad") {
      const [r, ...rest] = sinPuntoFinal(value).split(",");
      rubro = r.trim();
      ciudad = rest.join(",").trim();
    } else if (label === "Servicios o productos") {
      servicios = sinPuntoFinal(value).split(";").map((s) => s.trim()).filter(Boolean);
    } else if (label === "Paleta") {
      // "Azul + blanco. Color principal elegido: #1769AA."
      const m = /^(.*?)\.\s*Color principal elegido:\s*(#[0-9a-fA-F]{3,6})/.exec(value);
      paleta = m ? m[1].trim() : sinPuntoFinal(value);
      color = m ? m[2].toUpperCase() : "";
    } else if (label in LABELS) {
      fields[LABELS[label]] = sinPuntoFinal(value);
    }
  }

  return {
    contacto: fields.contacto ?? "",
    negocio: fields.negocio ?? "",
    rubro,
    ciudad,
    whatsapp: fields.whatsapp ?? "",
    email: fields.email ?? "",
    oferta: fields.oferta ?? "",
    descripcion: fields.descripcion ?? "",
    servicios,
    fotografias: fields.fotografias ?? "",
    referencia: fields.referencia ?? "",
    webActual: fields.webActual ?? "",
    notas: fields.notas ?? "",
    nivel: fields.nivel ?? "",
    precioBase: fields.precioBase ?? "",
    direccion: fields.direccion ?? "",
    estructura: fields.estructura ?? "",
    paleta,
    color,
    tipografia: fields.tipografia ?? "",
    objetivo: fields.objetivo ?? "",
    origenSergio: /Llegué desde la página de Sergio/.test(text),
  };
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

/** Alcance del configurador → template del motor. Clínica/estética/consultorio → clinic; catálogo → store. */
export function templateFor(nivel: string, rubro: string): WebFactoryTemplate {
  const n = nivel.toLowerCase();
  const r = rubro.toLowerCase();
  if (/tienda|catálogo|catalogo|ecommerce/.test(n)) return "store";
  if (/landing/.test(n)) return "landing";
  if (/cl[ií]nica|dental|est[eé]tica|consultorio|salud/.test(r)) return "landing-clinic";
  return "landing";
}

const FONTS: Record<string, { heading: string; body: string }> = {
  "Grotesca limpia": { heading: "Archivo", body: "Inter" },
  "Serif editorial": { heading: "Fraunces", body: "DM Sans" },
  "Humana": { heading: "Nunito", body: "Nunito" },
  "Técnica": { heading: "Space Grotesk", body: "Inter" },
};

const CTA_POR_OBJETIVO: Record<string, string> = {
  "Recibir contactos": "Escribinos por WhatsApp",
  "Conseguir reservas": "Reservar un turno",
  "Mostrar mi oferta": "Ver el catálogo",
  "Pedir cotizaciones": "Pedir cotización",
};

const PERMISO_FOTOS: Record<string, "client-owned" | "generate-ai" | "stock-licensed" | "pending"> = {
  "Tengo fotos propias y permiso para usarlas": "client-owned",
  "Quiero que ONIA proponga imágenes con IA": "generate-ai",
  "Prefiero fotografías de stock con licencia": "stock-licensed",
};

/** Arma el intake del motor. Lo que el pedido no trae queda vacío: el motor lo lista como pendiente. */
export function intakeFromPedido(pedido: ConfiguradorPedido, slugOverride?: string) {
  const slug = slugOverride ?? slugify(pedido.negocio || "cliente");
  const palette = WEB_PALETTES.find((p) => p.nombre === pedido.paleta) ?? WEB_PALETTES[0];
  const primary = pedido.color || palette.accent;
  const fonts = FONTS[pedido.tipografia] ?? FONTS["Grotesca limpia"];
  const template = templateFor(pedido.nivel, pedido.rubro);
  const waDigits = pedido.whatsapp.replace(/\D/g, "");

  return {
    project: { slug, template, package: "web", owner: "ONIA" },
    business: {
      name: pedido.negocio,
      industry: pedido.rubro.toLowerCase(),
      offer: pedido.oferta,
      tagline: "",
      // Sin descripción del cliente, el motor inventa «X ayuda a clientes de Y con Z».
      // Mejor un hecho: la oferta y el rubro en su ciudad.
      description: pedido.descripcion || [pedido.oferta ? `${pedido.oferta}.` : "", pedido.rubro ? `${pedido.rubro}${pedido.ciudad ? ` en ${pedido.ciudad}` : ""}.` : ""].filter(Boolean).join(" "),
      location: pedido.ciudad ? `${pedido.ciudad}, Bolivia` : "",
      hours: "",
      trustProofs: [],
    },
    brand: {
      logoText: pedido.negocio.split(/\s+/).map((w) => w[0]?.toUpperCase() ?? "").join("").slice(0, 3),
      colors: {
        primary,
        secondary: palette.ink,
        accent: palette.accent,
        bg: palette.background,
        fg: palette.ink,
      },
      typography: fonts,
      styleKeywords: [pedido.direccion.toLowerCase(), pedido.estructura.split(" (")[0].toLowerCase(), "conversion"].filter(Boolean),
      references: [
        // La web que ya tiene: de ahí salen textos, fotos y estructura antes de
        // pedirle nada (scripts/alta-por-extraccion.py). 10Web arranca desde una URL.
        ...(pedido.webActual
          ? [{ title: "Web actual del cliente", url: pedido.webActual, type: "copy", use: "textos, fotos y estructura que ya tiene publicados; extraer con scripts/alta-por-extraccion.py antes de pedirle contenido", avoid: "copiar su diseño actual" }]
          : []),
        ...(pedido.referencia
          ? [{ title: "Referencia del cliente", url: pedido.referencia, type: "visual", use: "lo que le gusta al cliente", avoid: "" }]
          : []),
      ],
      antiReferences: [],
    },
    media: {
      heroVideo: "",
      heroPoster: "",
      heroImage: "",
      assetPermission: PERMISO_FOTOS[pedido.fotografias] ?? "pending",
      notes: `Del configurador (${pedido.nivel || "sin nivel"}). Fotografías: ${pedido.fotografias || "sin decidir"}.`,
    },
    content: {
      // El mensaje trae sólo el NOMBRE de cada servicio. La descripción no se
      // inventa: va un hecho neutro y queda listada como pendiente del cliente.
      services: pedido.servicios.map((title) => ({ title, description: `${title} en ${pedido.negocio}.`, icon: "sparkles" })),
      benefits: [],
      categories: [],
      products: [],
    },
    conversion: {
      primaryCtaText: CTA_POR_OBJETIVO[pedido.objetivo] ?? "Escribinos por WhatsApp",
      primaryCtaUrl: waDigits ? `https://wa.me/${waDigits}` : "",
      whatsappMessage: `Hola, vengo de la web de ${pedido.negocio}.`,
    },
    contact: { email: pedido.email, phone: pedido.whatsapp, whatsapp: pedido.whatsapp, address: "" },
    social: { instagram: "", facebook: "", linkedin: "", x: "", tiktok: "" },
    seo: {
      title: `${pedido.negocio} — ${pedido.rubro}`,
      description: pedido.oferta,
      keywords: [pedido.rubro.toLowerCase(), pedido.ciudad.toLowerCase()].filter(Boolean),
      ogImage: "",
    },
    operations: {
      domain: "",
      hosting: "",
      paymentMethods: [],
      legalName: "",
      taxId: "",
      missing: [
        ...(pedido.servicios.length ? ["Una frase por servicio: qué incluye y qué resuelve (hoy sólo el nombre)"] : []),
        ...(pedido.notas ? [`Pedido adicional del cliente: ${pedido.notas}`] : []),
      ],
    },
  };
}

async function main(argv: string[]) {
  const program = new Command();
  program
    .name("from-configurador")
    .description("Mensaje del configurador de webs → data/intakes/<slug>.intake.json (y --build → out/<slug>).")
    .argument("<mensaje>", "archivo .txt con el mensaje tal como llega por WhatsApp")
    .option("--slug <slug>", "slug del cliente (default: del nombre del negocio)")
    .option("--build", "correr factory:build después de escribir el intake", false)
    .option("--force", "sobrescribir perfil/receta existentes", false)
    .parse(sanitizeCliArgv(argv));

  const [mensajePath] = program.args;
  const opts = program.opts<{ slug?: string; build: boolean; force: boolean }>();
  const rootDir = process.cwd();

  const text = await readFile(path.resolve(rootDir, mensajePath), "utf8");
  const pedido = parseConfiguradorMessage(text);
  if (!pedido.negocio) throw new Error("El mensaje no trae «Negocio:». ¿Es un mensaje del configurador?");

  const intake = intakeFromPedido(pedido, opts.slug);
  const outDir = path.join(rootDir, "data", "intakes");
  await mkdir(outDir, { recursive: true });
  const intakePath = path.join(outDir, `${intake.project.slug}.intake.json`);
  await writeFile(intakePath, `${JSON.stringify(intake, null, 2)}\n`, "utf8");
  process.stdout.write(`intake → ${path.relative(rootDir, intakePath)} (template ${intake.project.template}, ${pedido.servicios.length} servicios${pedido.origenSergio ? ", origen Sergio" : ""})\n`);

  if (!opts.build) return;
  const result = await runFactoryBuild({ rootDir, input: path.relative(rootDir, intakePath), force: opts.force });
  process.stdout.write(`out → ${result.outputDir ?? "(sin salida)"}\n`);
  if (result.missingInputs.length) {
    process.stdout.write(`pendientes que se le piden al cliente:\n${result.missingInputs.map((m) => `  - ${m}`).join("\n")}\n`);
  }
  for (const w of result.warnings) process.stdout.write(`aviso: ${w}\n`);
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (isCli) {
  main(process.argv).catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
  });
}

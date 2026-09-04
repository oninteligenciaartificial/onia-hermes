/**
 * Datos y copy del wizard /empezar.
 * Fuente de verdad del copy: web-factory/docs/ONIA_WIZARD_EMPEZAR_SPEC_2026.md §2
 * (los textos van EXACTOS — no parafrasear).
 */

import { waLink } from "@/lib/site";
import type { Equipo, Precio, Rubro, Tiene } from "./recommend";
import { precioStack } from "@/content/chatbot-precios";
import { precioWebDesde } from "@/content/webs";

export interface RubroOption {
  id: Rubro;
  nombre: string;
  desc: string;
  disponible: boolean;
}

export const RUBRO_OPTIONS: readonly RubroOption[] = [
  {
    id: "dental",
    nombre: "Dental",
    desc: "Clínicas y consultorios dentales",
    disponible: true,
  },
  {
    id: "comercio",
    nombre: "Comercio",
    desc: "Tiendas y comercios",
    disponible: true,
  },
  {
    // Autorizado 2026-08-15 tras QA del embudo completo en produccion: registro,
    // onboarding con vocabulario propio, panel, /agenda y /comercio/caja
    // operativos, cero errores HTTP. El registro del producto lo vende.
    id: "servicios",
    nombre: "Servicios",
    desc: "Estudios y profesionales que agendan y cobran",
    disponible: true,
  },
  {
    id: "proveedores",
    nombre: "Importadora",
    desc: "Importadoras y distribuidoras",
    disponible: true,
  },
  {
    // Tambien contratable (QA 2026-08-15). El wizard no la listaba.
    id: "estetica",
    nombre: "Estética y spa",
    desc: "Centros de estética, spas y peluquerías",
    disponible: true,
  },
] as const;

/**
 * Unica fuente de verdad de "que rubro se puede contratar hoy". La usan el
 * selector del wizard y `recomendar()`; antes `recommend.ts` lo tenia
 * hardcodeado en "dental" y los dos datos se contradecian.
 */
export function esRubroDisponible(rubro: Rubro): boolean {
  return RUBRO_OPTIONS.some((o) => o.id === rubro && o.disponible);
}

export const NOTA_PROXIMAMENTE =
  "Este rubro lo armamos con vos, sobre el motor que ya corre. Seguí: registramos tu caso y te contactamos con la propuesta armada.";

export const ESCAPE_WA_URL = waLink(
  "Hola, mi rubro no está en la lista de Onia. Mi negocio es: ",
);

export const EQUIPO_OPTIONS: readonly { id: Equipo; label: string }[] = [
  { id: "solo", label: "Solo yo" },
  { id: "2-5", label: "2 a 5" },
  { id: "6-15", label: "6 a 15" },
  { id: "15+", label: "Más de 15" },
] as const;

export const TIENE_OPTIONS: readonly {
  id: Tiene;
  label: string;
  exclusiva?: boolean;
}[] = [
  { id: "cuaderno", label: "Agenda en cuaderno o Excel" },
  { id: "web", label: "Página web" },
  { id: "chatbot", label: "Chatbot que responde solo" },
  { id: "sistema", label: "Sistema de gestión (algún software)" },
  { id: "facturacion", label: "Facturación electrónica" },
  { id: "nada", label: "Nada de esto todavía", exclusiva: true },
] as const;

/**
 * Línea de precio por plan. Los precios van VISIBLES (decisión 2026-07-30):
 * son los mismos publicados en /#precios y salen de lib/pricing.ts.
 */
export const PRECIO_COPY: Record<Precio, string> = {
  pro: "Bs 750/mes — 5 usuarios y hasta 1.500 fichas. Semanal Bs 199 o anual Bs 7.500 (pagás 10 meses).",
  full: "Bs 1.500/mes — usuarios y fichas sin límite. Anual Bs 15.000 (pagás 10 meses); este plan no se cobra semanal.",
  "a-medida":
    "Grupo / Empresarial: Bs 2.900/mes (anual Bs 29.000) más implementación desde Bs 3.500. No se compra en línea — se cotiza con tu caso.",
};

export const PLAN_INCLUYE: readonly string[] = [
  "Agenda",
  "Historia clínica con odontograma",
  "Cobros y caja",
  "Agente IA que reprograma — con tu aprobación",
] as const;

export const NOTA_DOWNSELL =
  "Si te queda grande, hay un plan de entrada de Bs 320/mes (2 usuarios, hasta 300 fichas) que ordena la agenda y las fichas — los agentes de IA no vienen ahí.";

export const NOTA_CUADERNO =
  "El cuaderno se jubila: agenda digital con recordatorios, sin pasar nada en limpio.";

export const NOTA_FACTURACION =
  "Facturación, de frente: el portal del SIN es gratis y cumple, y hoy la factura fiscal se emite ahí — nuestro emisor está en trámite de homologación. Lo que Onia hace mientras tanto es dejar la venta cerrada para que no tipees lo mismo dos veces.";

export const FALTA_COPY: Record<"web" | "chatbot", { nombre: string; copy: string }> = {
  web: {
    nombre: "Página web",
    // El precio NO se escribe acá: sale de content/webs.ts, la fuente. Este
    // texto anunció "desde Bs 790" durante doce días después de que Sergio
    // ratificara la línea 2.000/4.500/7.500 (2026-08-23) — menos de la mitad,
    // y en la pantalla que ve el que todavía no tiene web. Guarda:
    // precio-web.test.ts.
    copy: `Tu presencia online conectada al sistema: lo que publicás y lo que agendás viven en el mismo lugar. Desde Bs ${precioWebDesde().toLocaleString("es-BO")}, pago único.`,
  },
  chatbot: {
    nombre: "Chatbot de WhatsApp",
    // El precio NO se escribe acá: sale de content/chatbot-precios.ts, la
    // fuente única. Este texto llegó a ser el CUARTO precio vivo del mismo
    // add-on (2026-08-21).
    copy: `El botón de WhatsApp va gratis con la web. Esto es otra cosa: contesta al instante a cualquier hora con la información real que vos publicaste, y lo que no sabe te lo pasa con la conversación entera. ${precioStack()}. Lo que no entre en el estándar se define con vos y se cotiza a medida.`,
  },
};

export const FALTA_TAG = "servicio aparte, con su propio precio";

/**
 * Ensamblaje a medio armar de la variante B — mismos labels que
 * RUBROS[].blocks de components/sections/rubros.tsx (spec §2.5).
 * Si cambian allá, cambiar acá.
 */
export const PROXIMO_ASSEMBLY: Record<
  Exclude<Rubro, "dental">,
  { nombre: string; blocks: readonly string[]; built: number }
> = {
  comercio: {
    nombre: "Comercio",
    blocks: [
      "Cuenta y usuarios (base común)",
      "Inventario",
      "Ventas y cobro QR",
      "Facturación",
    ],
    built: 1,
  },
  servicios: {
    nombre: "Servicios",
    blocks: [
      "Cuenta y usuarios (base común)",
      "Agenda de trabajos",
      "Presupuestos",
      "Cobros",
    ],
    built: 1,
  },
  proveedores: {
    nombre: "Importadora",
    blocks: [
      "Cuenta y usuarios (base común)",
      "Pedidos y entregas",
      "Stock y cuentas por cobrar",
      "Costeo de importación",
    ],
    built: 1,
  },
  estetica: {
    nombre: "Estética y spa",
    blocks: [
      "Cuenta y usuarios (base común)",
      "Agenda y clientas",
      "Tratamientos",
      "Caja y cobros",
    ],
    built: 1,
  },
};

/** Lo que SÍ existe hoy para rubros en construcción (se cotiza, sin cifras). */
export const HOY_EXISTE: readonly string[] = [
  "Página web",
  "Chatbot de WhatsApp",
  "Automatizaciones",
] as const;

/* ---- labels para el mensaje de WhatsApp (spec §4) ---- */

export const RUBRO_MSG: Record<Rubro, string> = {
  dental: "clínica dental",
  comercio: "comercio",
  servicios: "servicios",
  proveedores: "importadora / material eléctrico",
  estetica: "estética y spa",
};

export const EQUIPO_MSG: Record<Equipo, string> = {
  solo: "solo yo",
  "2-5": "2 a 5",
  "6-15": "6 a 15",
  "15+": "más de 15",
};

export const TIENE_MSG: Record<Exclude<Tiene, "web" | "nada">, string> = {
  cuaderno: "cuaderno/Excel",
  chatbot: "chatbot",
  sistema: "sistema de gestión",
  facturacion: "facturación electrónica",
};

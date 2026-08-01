/**
 * Datos y copy del wizard /empezar.
 * Fuente de verdad del copy: web-factory/docs/ONIA_WIZARD_EMPEZAR_SPEC_2026.md §2
 * (los textos van EXACTOS — no parafrasear).
 */

import { waLink } from "@/lib/site";
import type { Equipo, Precio, Rubro, Tiene } from "./recommend";

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
    disponible: false,
  },
  {
    id: "servicios",
    nombre: "Servicios",
    desc: "Negocios de servicios",
    disponible: false,
  },
  {
    id: "proveedores",
    nombre: "Importadora",
    desc: "Importadoras y distribuidoras",
    disponible: false,
  },
] as const;

export const NOTA_PROXIMAMENTE =
  "Este rubro está en construcción — sin humo. Igual seguí: te avisamos apenas esté, con tu caso ya anotado.";

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
  pro: "Bs 750/mes — precio de lanzamiento (la lista es Bs 890). Anual: pagás 10 meses.",
  full: "Bs 1.500/mes — precio de lanzamiento (la lista es Bs 1.990). Anual: pagás 10 meses.",
  // [FALTA PRECIO] — el plan de grupo clinico no tiene tarifa publicada.
  "a-medida":
    "Grupo clínico: con ese tamaño el precio se arma con vos. Todavía no publicamos tarifa de grupo — no inventamos una.",
};

export const PLAN_INCLUYE: readonly string[] = [
  "Agenda",
  "Historia clínica con odontograma",
  "Cobros y caja",
  "Agente IA que reprograma — con tu aprobación",
] as const;

export const NOTA_DOWNSELL =
  "Si te queda grande, hay un plan de entrada de Bs 320/mes que ordena la agenda y las fichas — el agente que reprograma no viene ahí.";

export const NOTA_CUADERNO =
  "El cuaderno se jubila: agenda digital con recordatorios, sin pasar nada en limpio.";

export const NOTA_FACTURACION =
  "Facturación, de frente: el portal del SIN es gratis y cumple, y hoy la factura fiscal se emite ahí — nuestro emisor está en trámite de homologación. Lo que Onia hace mientras tanto es dejar la venta cerrada para que no tipees lo mismo dos veces.";

export const FALTA_COPY: Record<"web" | "chatbot", { nombre: string; copy: string }> = {
  web: {
    nombre: "Página web",
    copy: "Tu presencia online conectada al sistema: lo que publicás y lo que agendás viven en el mismo lugar.",
  },
  chatbot: {
    nombre: "Chatbot de WhatsApp",
    copy: "El botón de WhatsApp va gratis con la web. Esto es otra cosa: un bot que conversa por vos, responde consultas y te deriva los que valen la pena.",
  },
};

export const FALTA_TAG = "módulo aparte, a cotizar";

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

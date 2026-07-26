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
    nombre: "Proveedores",
    desc: "Distribuidores y proveedores",
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

/** Línea de precio por plan (spec §2.4 — única cifra permitida: Bs 320). */
export const PRECIO_COPY: Record<Precio, string> = {
  "desde-320": "Desde Bs 320/mes — precios de lanzamiento.",
  cotizar:
    "Los planes arrancan desde Bs 320/mes (lanzamiento); el tuyo se cotiza según sillones y equipo.",
  "a-medida": "Precio a medida — lo armamos con vos.",
};

export const PLAN_INCLUYE: readonly string[] = [
  "Agenda",
  "Historias clínicas",
  "Facturación",
  "Agente IA que reprograma — con tu aprobación",
] as const;

export const NOTA_CUADERNO =
  "El cuaderno se jubila: agenda digital con recordatorios, sin pasar nada en limpio.";

export const NOTA_FACTURACION =
  "La facturación va incluida. Y sí: el portal del SIN es gratis y cumple igual — la diferencia es que acá la factura sale sola del cobro, sin tipeo.";

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
    blocks: ["Inventario", "Ventas", "Cobro QR", "Facturación"],
    built: 2,
  },
  servicios: {
    nombre: "Servicios",
    blocks: ["Agenda de trabajos", "Presupuestos", "Seguimiento", "Cobros"],
    built: 2,
  },
  proveedores: {
    nombre: "Proveedores",
    blocks: ["Pedidos", "Entregas", "Cuentas por cobrar", "Facturación"],
    built: 2,
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
  proveedores: "proveedores",
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

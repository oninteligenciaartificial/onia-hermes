/**
 * La prueba — sin testimonios, con datos que el visitante puede abrir y ver.
 *
 * DOS reglas duras, y la segunda se olvida seguido:
 *  a) no se inventan clientes, logos, casos ni metricas;
 *  b) tampoco se PROCLAMA la debilidad. Que no haya testimonios se resuelve
 *     mostrando otra prueba, no anunciando en la portada que no hay clientes
 *     (2026-08-15, pedido de Sergio). Lo que sigue diciendose de frente es el
 *     estado del PRODUCTO — la factura fiscal en tramite y el ledger de abajo.
 *
 * La prueba se construye con las dos unicas cosas verificables por el
 * visitante:
 *
 *  1. DATO DE TERCEROS — precios y capacidades publicados por la competencia,
 *     con nombre propio, cifra y fecha de consulta. El visitante puede abrir
 *     cada web y comprobarlo.
 *  2. LO QUE TODAVIA NO HACEMOS — dicho por nosotros, primero, antes de que lo
 *     descubra. La honestidad es la prueba: si te digo lo que no anda, podes
 *     creerme lo que digo que si.
 *
 * Fuentes (todo verificado el 2026-07-30):
 *  - hermes-content/docs/ONIA_PRECIOS_COMPETENCIA_20260730.md — 32 precios con
 *    URL y fecha; conversion a Bs 11,89 = USD 1 (TCO BCB al 29-jul-2026).
 *  - hermes-content/docs/ONIA_PLATFORM_ESTRUCTURA_20260730.md §3 — que existe
 *    de verdad en el codigo y que no.
 *  - hermes-content/sales-kit/04-OBJECIONES.md — cero clientes inventados.
 *
 * Regla al editar: si un dato no tiene fuente publica, NO entra. Si un dato
 * cambia en el doc fuente, se cambia aca y no al reves.
 */

/** Fecha en que se consultaron todos los precios de la comparacion. */
export const FECHA_CONSULTA = "30 de julio de 2026";

/** Tipo de cambio usado para pasar los precios en USD a Bs. */
export const TC_NOTA = "Bs 11,89 = USD 1 (tipo de cambio oficial del BCB al 29-jul-2026)";

/**
 * Estado de una capacidad en un producto.
 * - "si"      lo tiene y funciona
 * - "no"      no lo tiene
 * - "tramite" existe pero todavia no sirve — solo lo usamos con NOSOTROS
 */
export type Estado = "si" | "no" | "tramite";

/** Las tres capacidades que definen la categoria. Ni una mas: es un eje, no una tabla de features. */
export const EJES = [
  { id: "gestion", label: "Agenda y ficha del cliente" },
  { id: "siat", label: "Factura SIAT boliviana" },
  { id: "agentes", label: "Agentes que trabajan solos" },
] as const;

export type EjeId = (typeof EJES)[number]["id"];

export interface Contendiente {
  id: string;
  /** Como se llama la categoria de competidor, no un nombre de fantasia. */
  quien: string;
  /** Los productos reales que la representan — con nombre, para que se pueda comprobar. */
  ejemplos: string;
  /** Precio publicado, tal como lo publica cada proveedor. */
  precio: string;
  precioNota?: string;
  estados: Record<EjeId, Estado>;
  /** La frase que resume por que no alcanza. */
  veredicto: string;
  /** Marca la fila de Onia: se destaca y lleva su propio tratamiento. */
  esOnia?: boolean;
}

export const CONTENDIENTES: readonly Contendiente[] = [
  {
    id: "sin",
    quien: "El Portal Web del SIN",
    ejemplos: "impuestos.gob.bo — la modalidad oficial del Estado",
    precio: "Bs 0",
    precioNota: "gratis, y cumple la ley",
    estados: { gestion: "no", siat: "si", agentes: "no" },
    veredicto:
      "Es un emisor de facturas, no un sistema. Su página oficial no menciona agenda, ficha, recordatorios, caja ni permisos. Cada factura se tipea a mano, una por una.",
  },
  {
    id: "facturadores",
    quien: "Los facturadores bolivianos",
    ejemplos: "Sintic · administraTe · Emizor",
    precio: "Bs 85 – 1.000 / mes",
    precioNota: "Sintic desde 85 · administraTe hasta 1.000 por sucursal",
    estados: { gestion: "no", siat: "si", agentes: "no" },
    veredicto:
      "Facturan y llevan inventario. Ninguno tiene agenda ni ficha del paciente: si tu negocio se organiza por citas, esto no lo resuelve.",
  },
  {
    id: "dental-region",
    quien: "El software dental de la región",
    ejemplos: "Dentiqa · Doctocliq · Clinera.io",
    precio: "Bs 1.058 – 5.695 / mes",
    precioNota: "USD 89 – 479, convertidos · Clinera suma USD 450 de instalación",
    estados: { gestion: "si", siat: "no", agentes: "si" },
    veredicto:
      "Agenda, odontograma e incluso agentes con IA. Pero no facturan en Bolivia: Doctocliq lo dice en su propia web — factura en Ecuador, Perú, México, Colombia y República Dominicana; Bolivia no está en la lista.",
  },
  {
    id: "onia",
    quien: "Onia",
    ejemplos: "una plataforma, el rubro dental andando hoy",
    precio: "Bs 320 – 1.500 / mes",
    precioNota: "precio de lanzamiento, publicado más abajo",
    estados: { gestion: "si", siat: "tramite", agentes: "si" },
    veredicto:
      "Cruza los dos lados — y la factura fiscal todavía no: nuestro emisor está en trámite de homologación ante el SIN. Preferimos que lo leas acá antes de que lo descubras vos.",
    esOnia: true,
  },
] as const;

/**
 * El hallazgo. No es una ventaja de features: es una categoria que nadie ocupa.
 * Sale de ONIA_PRECIOS_COMPETENCIA_20260730.md §Lectura punto 4.
 */
export const HUECO =
  "No existe un solo software vendido en Bolivia que cruce agenda + ficha del cliente + factura SIAT.";

/**
 * El ledger de honestidad. Cada linea es una cosa DEL PRODUCTO que HOY no
 * funciona, dicha por nosotros primero. Verificado contra
 * ONIA_PLATFORM_ESTRUCTURA_20260730 §3.
 *
 * Es un ledger de producto, no de la empresa: acá van funciones que faltan, no
 * "somos nuevos" ni "no tenemos clientes".
 */
export interface Pendiente {
  que: string;
  detalle: string;
}

export const TODAVIA_NO: readonly Pendiente[] = [
  {
    que: "La factura fiscal todavía no sale de Onia.",
    detalle:
      "El emisor está en trámite de homologación ante el SIN. Mientras tanto Onia te deja la venta cerrada con paciente, monto y detalle, y la factura la emitís en el Portal Web del SIN — gratis y legal.",
  },
  {
    que: "No hay modo offline.",
    detalle:
      "Onia vive en la nube. Si te quedás sin ninguna conexión, en ese rato no trabajás — igual que con el Portal del SIN. Lo que sí: seguís desde el celular con datos y no perdés nada.",
  },
  {
    que: "Comercio y servicios no tienen pantallas propias.",
    detalle:
      "La base común da de alta la cuenta, pero el pack del rubro se está construyendo. Por eso no tienen precio publicado: no le ponemos tarifa a lo que no podemos entregar.",
  },
] as const;

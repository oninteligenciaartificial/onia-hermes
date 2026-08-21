/**
 * Precios de Onia — fuente UNICA de la landing.
 *
 * REGLA DURA (2026-08-08): cada numero de este archivo sale del CODIGO QUE
 * COBRA, no de un doc ni de una propuesta. Si el codigo no lo enforcea, no se
 * publica. Verificado contra `C:\dev\proyectos\onia-platform`, rama `master`,
 * tip `6b8f152` (solo lectura):
 *
 *  - montos y ciclos ......... lib/subscription-plans.ts → DEFAULT_PLAN_AMOUNTS
 *    (basic 320/89/3.200 · professional 750/199/7.500 · clinic 1.500/-/15.000 ·
 *    enterprise 2.900/-/29.000; Full y Grupo NO tienen semanal)
 *  - limites y features ...... lib/plan-limits.ts → PLAN_LIMITS
 *    (usuarios 2/5/ilimitado · clientes 300/1.500/ilimitado · emails 200/800/
 *    ilimitado · agentsIncluded desde professional · publicBookingIncluded
 *    desde professional · csvExportEnabled desde basic · reportsEnabled y
 *    recurringInvoicesEnabled desde professional · inventoryIncluded en todos)
 *  - contabilidad y RRHH ..... lib/plan-limits.ts:416-435 (basico desde Basico,
 *    completa desde Profesional — montan sobre los mismos umbrales de reportes)
 *  - add-ons ................. lib/pricing.ts (agenda publica 150 · usuario
 *    extra 70 (max 3 en Basico) · inventario avanzado 180 · instancia privada
 *    desde 4.500+900 · Grupo implementacion desde 3.500). El CHATBOT no vive
 *    aca: su precio sale de content/chatbot-precios.ts, que es su fuente unica
 *    (2026-08-21: Bs 390/mes sin instalacion; antes este archivo publicaba
 *    "desde 300+200" y chatbot-precios.ts "1.500+1.490" — dos precios vivos
 *    del mismo add-on).
 *  - prueba gratis ........... lib/subscription/plan-state.ts (14 dias sin
 *    tarjeta, corriendo con plan `professional`; al vencer queda en solo
 *    lectura, no se borra nada)
 *  - CHECKOUT_PLANS .......... lib/subscription/plan-display.ts:34 — Grupo
 *    queda FUERA del checkout: se cotiza.
 *
 * Lo que se saco a proposito porque el codigo no lo tiene (auditoria
 * hermes-content/docs/platform/ONIA_PRICING_SEGUNDA_REVISION_20260808.md):
 * sucursales y multi-sillon (cero `branchId` en el schema), bolsa/creditos de
 * IA (cero ledger, no se puede facturar consumo), "8 y 20 usuarios", cobro
 * trimestral (los ciclos son semanal/mensual/anual), precio de lista
 * 390/890/1.990 (no existe columna de precio por organizacion: el validador
 * exige el monto del catalogo con tolerancia Bs 0,01), roles y documentos
 * digitales como salto de plan (no estan gateados por plan), y la pasarela de
 * cobro (`gatewayEnabled: false` en los cinco planes).
 */

import { precioAddonChatbot } from "@/content/chatbot-precios";

export type PlanId = "basico" | "pro" | "full";

export interface Plan {
  id: PlanId;
  /** 01 / 02 / 03 — el orden es la escalera. */
  paso: string;
  nombre: string;
  /** El salto de valor en una palabra. Ordenar → recuperar → automatizar. */
  salto: string;
  /** Resultado concreto, no lista de features. */
  resultado: string;
  /** Bs por mes. */
  mensual: number;
  /** Bs por semana. null = el plan no se fracciona (Full no tiene semanal). */
  semanal: number | null;
  /** Bs, total del año adelantado (= 10 meses). */
  anual: number;
  /** Lo que este nivel enciende, con los numeros que el sistema aplica. */
  incluye: readonly string[];
  /** Lo que este nivel NO trae. Se dice acá, no en la letra chica. */
  sinEsto: readonly string[];
  destacado?: boolean;
  cuando: string;
}

export const PLANES: readonly Plan[] = [
  {
    id: "basico",
    paso: "01",
    nombre: "Básico",
    salto: "Ordenar",
    resultado: "Tu negocio deja de vivir en el cuaderno y en la memoria de la recepcionista.",
    mensual: 320,
    semanal: 89,
    anual: 3200,
    incluye: [
      "2 usuarios (podés sumar hasta 3 más a Bs 70/mes cada uno)",
      "Hasta 300 fichas de clientes o pacientes cargadas",
      "200 recordatorios por email al mes",
      "Agenda, fichas, caja y cobros en un solo lugar",
      "Inventario simple con aviso de stock mínimo",
      "Reporte básico y contabilidad básica de compras y ventas",
      "Lista de empleados",
      "Exportás tus datos en CSV cuando quieras",
    ],
    sinEsto: [
      "Agentes de IA (vienen desde Pro)",
      "Reservas online — se agrega como add-on a Bs 150/mes",
      "Reportes completos y facturas recurrentes",
    ],
    cuando: "Negocio de 1 o 2 personas que hoy trabaja con cuaderno o Excel.",
  },
  {
    id: "pro",
    paso: "02",
    nombre: "Pro",
    salto: "Recuperar",
    resultado:
      "No se te escapa un cliente: los agentes te proponen a quién contactar y vos aprobás con un toque.",
    mensual: 750,
    semanal: 199,
    anual: 7500,
    incluye: [
      "Todo lo del Básico",
      "5 usuarios",
      "Hasta 1.500 fichas de clientes o pacientes",
      "800 recordatorios por email al mes",
      "Agente Recall: te propone a quién hace rato que no ves",
      "Agente Cobrador: te propone a quién reclamarle la deuda vencida",
      "Reservas online incluidas (link público para que te pidan cita)",
      "Reportes completos y facturas recurrentes",
      "Contabilidad completa (RCV, balance y export) y planilla del mes",
    ],
    sinEsto: ["Nada del Básico se queda afuera: Pro es Básico más lo de arriba"],
    destacado: true,
    cuando: "Ya tenés movimiento y se te escapan clientes por falta de seguimiento.",
  },
  {
    id: "full",
    paso: "03",
    nombre: "Full",
    salto: "Sin techo",
    resultado: "Los mismos agentes del Pro, pero sin ningún límite para crecer.",
    mensual: 1500,
    semanal: null,
    anual: 15000,
    incluye: [
      "Todo lo del Pro, sin límites",
      "Usuarios ilimitados",
      "Fichas de clientes o pacientes ilimitadas",
      "Recordatorios por email sin tope mensual",
    ],
    sinEsto: [
      "No enciende funciones nuevas sobre el Pro: lo que saca es el techo",
    ],
    cuando: "Equipo grande o base de clientes que ya no entra en 1.500 fichas.",
  },
] as const;

/**
 * Grupo / Empresarial (`enterprise` en el codigo). Existe y tiene precio, pero
 * queda FUERA del checkout (CHECKOUT_PLANS = basic, professional, clinic): se
 * cotiza. No se publica como cuarta tarjeta comprable.
 */
export const GRUPO = {
  nombre: "Grupo / Empresarial",
  mensual: 2900,
  anual: 29000,
  implementacionDesde: 3500,
  copy:
    "Para varias razones sociales o un grupo de negocios: mismos límites del Full más una implementación acompañada. No se compra en línea — se cotiza con tu caso.",
} as const;

/** Prueba gratis: lib/subscription/plan-state.ts (TRIAL_DAYS / TRIAL_PLAN). */
export const PRUEBA = {
  dias: 14,
  planQueCorre: "Pro",
  copy:
    "14 días de prueba sin poner tarjeta, corriendo con el plan Pro completo. Al terminar, la cuenta queda en solo lectura: no se borra nada y podés exportar tus datos.",
} as const;

export function bs(n: number): string {
  return n.toLocaleString("es-BO");
}

/* ---------- add-ons con precio en el codigo ----------
 *
 * SOLO software que se enciende sobre la suscripcion, con precio recurrente
 * que el sistema cobra. "Web del negocio" se retiro el 2026-08-21 (decision de
 * Sergio): es pago unico y ademas es trabajo de agencia, no software — puesta
 * al lado de "usuario adicional" hacia leer el servicio como una casilla de
 * autoservicio y ensuciaba la tabla. Se sigue vendiendo, pero en su propia
 * pagina (/servicios/webs) y cotizada.
 *
 * Grupo / Empresarial con su implementacion NO es un add-on y por eso no esta
 * en esta lista: vive arriba, en GRUPO, y es un proyecto cotizado.
 */

export interface AddOn {
  nombre: string;
  copy: string;
  precio: string;
}

export const ADDONS: readonly AddOn[] = [
  {
    nombre: "Chatbot de WhatsApp",
    copy: "Contesta al instante a cualquier hora con la información real de tu negocio, y pasa a una persona lo que necesite decisión. Se suma a cualquier plan.",
    precio: precioAddonChatbot(),
  },
  {
    nombre: "Reservas online",
    copy: "Link público para que te pidan cita sin llamadas ni mensajes. Ya viene incluida en Pro y en Full.",
    precio: "Bs 150/mes en Básico",
  },
  {
    nombre: "Usuario adicional",
    copy: "Una persona más en el sistema. En Básico se pueden sumar hasta 3.",
    precio: "Bs 70/mes por usuario",
  },
  {
    nombre: "Inventario avanzado",
    copy: "Compras, proveedores, vencimientos y alertas avanzadas, por encima del inventario simple que ya viene incluido.",
    precio: "Desde Bs 180/mes",
  },
] as const;

/* ---------- lo que NO esta en el precio ---------- */

export interface Excluido {
  que: string;
  detalle: string;
}

/**
 * Costos de terceros, explicitos. Regla de la casa (CLAUDE.md, propuestas):
 * dominio y hosting van a nombre del cliente y nunca dentro de nuestro precio.
 */
export const NO_INCLUYE: readonly Excluido[] = [
  {
    que: "Dominio y hosting de tu web",
    detalle: "Van a tu nombre, contratados por vos. Nunca dentro de nuestra tarifa.",
  },
  {
    que: "Los mensajes que WhatsApp te cobra",
    detalle:
      "Si contratás el chatbot, Meta cobra por cada mensaje que TU negocio le manda primero al cliente. Eso lo pagás directo a Meta, en tu propia cuenta: no lo facturamos nosotros ni le sumamos nada encima.",
  },
  {
    que: "Pauta publicitaria",
    detalle: "Si hacés campañas, el presupuesto de anuncios es tuyo y va directo a la plataforma.",
  },
] as const;

/* ---------- condiciones ---------- */

export const CONDICIONES: readonly string[] = [
  "Pagás semanal, mensual o anual. El anual cobra 10 meses: dos van de regalo.",
  "El semanal existe en Básico (Bs 89) y en Pro (Bs 199). Full se cobra mensual o anual.",
  "14 días de prueba sin tarjeta, con el Pro completo. Al vencer, la cuenta queda en solo lectura — nada se borra.",
  "En los tres planes de arriba no cobramos implementación ni migración: el checkout cobra solo el plan. Grupo / Empresarial sí lleva implementación acompañada y se cotiza aparte.",
  "Tus datos son tuyos: los exportás en CSV desde el plan más chico.",
] as const;

/**
 * Nota fiscal — se dice ANTES de que la pregunten. La emision fiscal NO es una
 * feature de plan: depende de un flag global y del tramite de homologacion ante
 * el SIN. Con el emisor en mock, no se vende como si funcionara.
 */
export const NOTA_FISCAL =
  "Facturación fiscal, de frente: nuestro emisor está en trámite de homologación ante el SIN y todavía no emite factura con valor fiscal. No es algo que se destrabe pagando un plan más caro — no depende del plan. Mientras tanto, Onia te deja la venta cerrada y facturás en el Portal Web del SIN, que es gratuito y cumple la ley. No te cobramos por algo que todavía no anda.";

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
 *    extra 70 (max 3 en Basico) · instancia privada desde 4.500+900 · Grupo
 *    implementacion desde 3.500). El CHATBOT no vive aca: su precio sale de
 *    content/chatbot-precios.ts, que es su fuente unica
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
import { WEB_STACKS } from "@/content/webs";

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
      "Inventario con existencias, costo, proveedor y aviso de stock mínimo",
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

/* ---------- lo que se suma sobre la suscripcion ----------
 *
 * ⚠️ VUELVE "Web del negocio" (2026-08-22). El 2026-08-21 la habia sacado de
 * esta lista por ser pago unico y trabajo de agencia, no software recurrente.
 * Sergio lo revirtio mirando la portada: "solo veo 3 precios, hay que mostrar
 * todo lo que ofrecemos". Una tabla prolija que esconde lo que si vendemos
 * cuesta mas que una tabla mezclada. Entra con el precio de content/webs.ts
 * (el stack mas barato) y diciendo en la misma celda que es pago unico, no
 * suscripcion — que era la objecion real, y se resuelve con la etiqueta.
 *
 * `href` existe para que la pantalla no adivine a que fila le toca link:
 * /precios preguntaba `addon.nombre.includes("Chatbot")`, y ese sniff se
 * rompia con renombrar la fila.
 *
 * Grupo / Empresarial con su implementacion NO es un add-on y por eso no esta
 * en esta lista: vive arriba, en GRUPO, y es un proyecto cotizado.
 */

/**
 * El "desde" de la web sale de la fuente (content/webs.ts), no a mano: hoy es
 * la Landing de Captacion. Si manana el catalogo cambia, esta celda cambia
 * sola en lugar de quedar mintiendo.
 *
 * 🔴 OJO, PRECIO EN DISPUTA — NO se resuelve desde esta pantalla. El mismo
 * 2026-08-22, hermes-content/docs/ONIA_WEB_COMO_SE_VENDE.md §8 dejo asentado
 * que la linea 790/1.500/2.900 era una oferta de ARRANQUE "valida hasta
 * 2026-07-31", que vencio sin sucesor, y que TODAS las propuestas reales del
 * repo cotizan la linea premium (2.000/4.500). Son dos precios vivos del mismo
 * servicio: exactamente lo que la regla de fuente unica existe para evitar.
 *
 * Se publica 790 y no otro numero por UNA razon: es el que /servicios/webs ya
 * muestra en produccion hoy. Que la portada diga lo mismo mantiene el sitio
 * coherente consigo mismo; elegir 2.000 desde aca seria tomar la decision de
 * precio que ese doc §8.4 reserva EXPLICITAMENTE para Sergio. Cuando Sergio
 * ratifique una sola linea, se corrige en content/webs.ts y las dos pantallas
 * se mueven juntas — no se toca este archivo.
 */
const WEB_DESDE = Math.min(
  ...WEB_STACKS.map((w) => w.precio).filter((p): p is number => p !== null),
);

export interface AddOn {
  nombre: string;
  copy: string;
  precio: string;
  /** Apartado que cuenta el add-on entero. Sin href, la fila no linkea. */
  href?: string;
}

/**
 * ⛔ NO VOLVER A PONER "Inventario avanzado" ACA (Sergio, 2026-08-27: "no se
 * cobra"). Compras, proveedores, vencimientos por lote y aviso de stock bajo NO
 * estan gateados por ningun archivo del producto — `addon.inventory_advanced` se
 * calcula en entitlements.ts y no lo lee nadie. Cobrarlo era ponerle precio a lo
 * que el cliente ya tiene encendido: se cae en la primera pregunta del que ya lo
 * usa. El inventario ahora se cuenta donde corresponde, en el `incluye` del
 * Basico (y por herencia en Pro y Full). Guarda:
 * scripts/venta-honestidad.test.mjs. Detalle: ONIA_CATALOGO_DE_VENTA.md §5.
 */
export const ADDONS: readonly AddOn[] = [
  {
    nombre: "Chatbot de WhatsApp",
    copy: "Contesta al instante a cualquier hora con la información real de tu negocio, y pasa a una persona lo que necesite decisión. Se suma a cualquier plan.",
    precio: precioAddonChatbot(),
    href: "/chatbot",
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
    nombre: "Web del negocio",
    copy: "Tu sitio hecho por nosotros y publicado en tu dominio, con el botón de WhatsApp ya cableado. Es un proyecto que se cotiza y se paga una vez, no una suscripción más.",
    precio: `Desde Bs ${bs(WEB_DESDE)} · pago único`,
    href: "/servicios/webs",
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
  // Armado de PLANES: esta frase nombraba los dos semanales a mano, al lado de
  // la tabla que los define. Dos copias del mismo número en el mismo archivo.
  `El semanal existe en ${PLANES.filter((p) => p.semanal !== null)
    .map((p) => `${p.nombre} (Bs ${bs(p.semanal as number)})`)
    .join(" y en ")}. ${PLANES.filter((p) => p.semanal === null)
    .map((p) => p.nombre)
    .join(" y ")} se cobra mensual o anual.`,
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

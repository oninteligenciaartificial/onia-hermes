/**
 * Precios de Onia — fuente UNICA de la landing.
 *
 * Regla dura: aca no se inventa una sola cifra. Todo numero de este archivo
 * sale de una fuente escrita; si un rubro no tiene precio decidido, va
 * `planes: null` y la UI lo dice de frente ([FALTA PRECIO]) en vez de inventarlo.
 *
 * Fuentes:
 *  - hermes-content/sales-kit/01-ONE-PAGER-OFERTA.md — planes dental (precio de
 *    lanzamiento), tabla de lo que incluye cada nivel, add-ons, condiciones,
 *    implementacion regalada.
 *  - Pricing dental ratificado: lista 390 / 890 / 1.990 Bs por mes;
 *    lanzamiento 320 / 750 / 1.500; anual = 10 meses (2 de regalo).
 *  - hermes-content/docs/ONIA_PLATFORM_ESTRUCTURA_20260730.md — que existe de
 *    verdad hoy: el emisor fiscal es mock (tramite SIAT pendiente) y el pack de
 *    importadora esta declarado pero sin pantallas propias.
 *  - hermes-content/sales-kit/04-OBJECIONES.md — el Pro se cotiza primero, el
 *    Basico es downsell, cero clientes/testimonios inventados.
 */

export type Ciclo = "mensual" | "anual";

/** Anual = se pagan 10 meses. Los otros 2 son el descuento. */
export const MESES_ANUAL = 10;

export type PlanId = "basico" | "pro" | "full";

export interface Plan {
  id: PlanId;
  /** 01 / 02 / 03 — el orden es la escalera. */
  paso: string;
  nombre: string;
  /** El salto de valor en una palabra. Ordenar -> recuperar -> automatizar. */
  salto: string;
  /** Resultado concreto, no lista de features. */
  resultado: string;
  /** Bs por mes, precio de lanzamiento. */
  lanzamiento: number;
  /** Bs por mes, precio de lista (el que queda cuando termina el lanzamiento). */
  lista: number;
  /** Lo que enciende ESTE nivel por encima del anterior. */
  enciende: readonly string[];
  usuarios: string;
  soporte: string;
  destacado?: boolean;
  /** Cuando conviene, en una linea (04-OBJECIONES §4). */
  cuando: string;
}

/**
 * Planes del pack dental. Copy alineado a 01-ONE-PAGER-OFERTA.md:
 * "Basico ordena -> Pro cobra y no pierde pacientes -> Full opera sola".
 */
const PLANES_DENTAL: readonly Plan[] = [
  {
    id: "basico",
    paso: "01",
    nombre: "Básico",
    salto: "Ordenar",
    resultado: "Tu clínica deja de vivir en el cuaderno y en la memoria de la recepcionista.",
    lanzamiento: 320,
    lista: 390,
    enciende: [
      "Agenda y ficha del paciente con odontograma e historial",
      "Panel del dueño con los pendientes del día",
      "La venta queda lista para facturar (leé la nota fiscal)",
    ],
    usuarios: "3 usuarios",
    soporte: "Soporte por correo",
    cuando: "Consultorio de 1 profesional que hoy usa cuaderno o Excel.",
  },
  {
    id: "pro",
    paso: "02",
    nombre: "Pro",
    salto: "Recuperar",
    resultado: "No se te escapa un paciente: cuando alguien falta, el agente te propone la reprogramación y vos aprobás con un toque.",
    lanzamiento: 750,
    lista: 890,
    enciende: [
      "Agente que reprograma por WhatsApp — propone, vos aprobás",
      "Documentos y consentimientos digitales",
      "Roles: recepción no ve la historia clínica",
      "Inventario básico de insumos con aviso de stock mínimo",
    ],
    usuarios: "8 usuarios",
    soporte: "Soporte por WhatsApp",
    destacado: true,
    cuando: "Clínica con agenda llena y huecos que nadie sale a llenar.",
  },
  {
    id: "full",
    paso: "03",
    nombre: "Full",
    salto: "Automatizar",
    resultado: "La clínica opera sola: reactiva pacientes dormidos, ordena las aprobaciones y te deja decidir en vez de perseguir.",
    lanzamiento: 1500,
    lista: 1990,
    enciende: [
      "Reactivación de pacientes inactivos",
      "Aprobaciones de descuentos y anulaciones",
      "Multi-sillón y hasta 3 sucursales",
    ],
    usuarios: "20 usuarios",
    soporte: "WhatsApp directo",
    cuando: "2 o más profesionales, o más de un consultorio.",
  },
] as const;

export type RubroId = "dental" | "comercio" | "servicios" | "proveedores";

export interface RubroPlanes {
  id: RubroId;
  label: string;
  /** Como se nombra el rubro dentro del mensaje de WhatsApp. */
  mensaje: string;
  estado: "disponible" | "construccion";
  /** null = todavía no hay precio publicado para este rubro. */
  planes: readonly Plan[] | null;
  /** Que decimos cuando no hay precio. Honestidad, no humo. */
  nota: string;
}

export const RUBROS_PLANES: readonly RubroPlanes[] = [
  {
    id: "dental",
    label: "Dental",
    mensaje: "clínica dental",
    estado: "disponible",
    planes: PLANES_DENTAL,
    nota: "El pack dental es el que está andando hoy: agenda, ficha con odontograma, cobros y el agente que reprograma.",
  },
  {
    id: "proveedores",
    label: "Importadora",
    mensaje: "importadora / material eléctrico",
    estado: "construccion",
    // [FALTA PRECIO] — el pack de importadora esta declarado en la capa de
    // plataforma pero sin pantallas propias (ONIA_PLATFORM_ESTRUCTURA_20260730
    // §3). No hay tarifa decidida: no se publica ninguna.
    planes: null,
    nota: "Es el segundo pack: importadoras y distribuidoras, arrancando por material eléctrico. La base ya corre; las pantallas del rubro se están construyendo. Todavía no hay precio publicado — se arma con tu caso.",
  },
  {
    id: "comercio",
    label: "Comercio",
    mensaje: "comercio",
    estado: "construccion",
    // [FALTA PRECIO] — sin pack en la app ni tarifa decidida.
    planes: null,
    nota: "Tiendas y comercios: inventario, ventas y cobro con QR sobre el mismo motor. Está en construcción y todavía no tiene precio publicado.",
  },
  {
    id: "servicios",
    label: "Servicios",
    mensaje: "servicios",
    estado: "construccion",
    // [FALTA PRECIO] — sin pack en la app ni tarifa decidida.
    planes: null,
    nota: "Negocios de servicios: agenda de trabajos, presupuestos y cobros. Está en construcción y todavía no tiene precio publicado.",
  },
] as const;

export function rubroPlanes(id: RubroId): RubroPlanes {
  return RUBROS_PLANES.find((r) => r.id === id) ?? RUBROS_PLANES[0];
}

/** Bs por mes segun el ciclo elegido (el anual cobra 10 meses por 12). */
export function precioMes(plan: Plan, ciclo: Ciclo): number {
  return ciclo === "anual"
    ? Math.round((plan.lanzamiento * MESES_ANUAL) / 12)
    : plan.lanzamiento;
}

/** Total del pago anual adelantado. */
export function precioAnual(plan: Plan): number {
  return plan.lanzamiento * MESES_ANUAL;
}

export function bs(n: number): string {
  return n.toLocaleString("es-BO");
}

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
    que: "Comisión de la pasarela de pago",
    detalle: "La cobra el banco o el proveedor sobre cada cobro que recibís, no nosotros.",
  },
  {
    que: "Créditos de IA por encima del uso incluido",
    detalle: "Si tu operación consume más de lo previsto, se factura el consumo real, a costo.",
  },
  {
    que: "Conversaciones de WhatsApp API sobre el cupo",
    detalle: "Las tarifa Meta por conversación. El botón de WhatsApp simple no cuesta nada.",
  },
  {
    que: "Pauta publicitaria",
    detalle: "Si hacés campañas, el presupuesto de anuncios es tuyo y va directo a la plataforma.",
  },
] as const;

/* ---------- add-ons ---------- */

export interface AddOn {
  nombre: string;
  copy: string;
  precio: string;
}

export const ADDONS: readonly AddOn[] = [
  {
    nombre: "Chatbot de WhatsApp",
    copy: "Un bot que conversa por vos: responde, califica y te deriva los que valen la pena. El botón de WhatsApp en tu web ya va gratis — esto es otra cosa.",
    precio: "Setup Bs 900–1.200 + Bs 450–600/mes",
  },
  {
    nombre: "Web del negocio",
    copy: "Tu presencia online conectada al sistema: lo que agendás y lo que publicás viven en el mismo lugar.",
    // Cuidado Web mensual: [FALTA PRECIO] — la fuente (one-pager) no lo fija.
    precio: "Landing Bs 790 · web completa Bs 1.500 (+ cuidado mensual, a cotizar)",
  },
  {
    nombre: "Automatizaciones a medida",
    copy: "Circuitos propios de tu negocio: avisos de cobro, seguimientos, reportes que se arman solos.",
    precio: "A cotizar según el circuito",
  },
] as const;

/* ---------- las garantias: bajar el riesgo, no el precio ---------- */

export interface Garantia {
  /** Version de una linea, para el hero. */
  corto: string;
  titulo: string;
  detalle: string;
}

/**
 * Con CERO clientes, lo que frena la compra no es la plata: es que nadie
 * quiere ser el primero. Descontar no arregla eso; garantizar si.
 * Fuente: hermes-content/docs/ONIA_PRICING_MODELO_20260730.md §6.
 *
 * Van arriba de todo (hero) y otra vez pegadas al precio, porque es el punto
 * exacto donde aparece el miedo.
 */
export const GARANTIAS: readonly Garantia[] = [
  {
    corto: "14 días de prueba, sin tarjeta",
    titulo: "Probalo 14 días sin poner una tarjeta",
    detalle:
      "No pedimos datos de tarjeta para arrancar la prueba. Si al día 14 no seguís, no pasó nada y no hay nada que cancelar.",
  },
  {
    corto: "Si al primer mes no sirve, se devuelve",
    titulo: "El primer mes va con devolución",
    detalle:
      "Si pagaste el primer mes y el sistema no te sirvió, te devolvemos lo pagado. No es un descuento disfrazado: es que el riesgo lo ponemos nosotros y no vos.",
  },
  {
    corto: "Migramos tus datos nosotros",
    titulo: "La migración y la puesta en marcha las hacemos nosotros",
    detalle:
      "Cargamos tus pacientes, configuramos la cuenta y capacitamos a tu equipo. La competencia cobra la implementación entre Bs 2.274 y 9.096; en esta fase de lanzamiento va en cero.",
  },
  {
    corto: "Tus datos son tuyos y te los llevás",
    titulo: "Si te querés ir, te vas con todo",
    detalle:
      "Exportás tu información cuando quieras. Nadie queda rehén de un sistema por tener los datos adentro.",
  },
] as const;

/**
 * Cohorte fundador — el unico "apuro" que decimos, y es real: se cierra por
 * cantidad, no por una fecha inventada. Fuente: ONIA_PRICING_MODELO §6
 * ("nunca de por vida": con la devaluacion de 2026, prometer precio congelado
 * para siempre seria mentir).
 */
export const COHORTE =
  "Las primeras 5 clínicas que cierren en esta fase mantienen el precio de lanzamiento 12 meses. No decimos «precio congelado de por vida»: en un país donde el dólar se movió 63% en un mes, eso no lo puede prometer nadie en serio.";

/* ---------- condiciones ---------- */

export const CONDICIONES: readonly string[] = [
  "Cobro trimestral adelantado por QR, o anual con 2 meses de regalo.",
  "El precio de lanzamiento se respeta 12 meses a quien cierra en esta fase. Después, ajuste semestral indexado al tipo de cambio del BCB o al IPC del INE — el mayor. En un país donde el dólar se movió 63% en un mes, nadie serio promete precio congelado de por vida.",
  "Implementación y migración de tus datos regalada en esta fase: carga de pacientes, configuración y capacitación del equipo.",
  "Tus datos son tuyos: los exportás cuando quieras y si te vas, te los llevás.",
] as const;

/**
 * Nota fiscal — se dice ANTES de que la pregunten. El emisor todavia no esta
 * homologado ante el SIN (ONIA_PLATFORM_ESTRUCTURA_20260730 §3: hoy imprime
 * "SIMULACION - SIN VALOR FISCAL"), asi que no se vende como si funcionara.
 */
export const NOTA_FISCAL =
  "Facturación fiscal, de frente: nuestro emisor está en trámite de homologación ante el SIN y todavía no emite factura con valor fiscal. Mientras tanto, Onia te deja la venta cerrada y facturás en el Portal Web del SIN, que es gratuito y cumple la ley. Cuando la homologación salga, la factura sale del mismo sistema sin tipear nada dos veces. No te cobramos por algo que todavía no anda.";

/* ---------- mensajes de WhatsApp con contexto ---------- */

/**
 * El mensaje lleva el contexto (rubro + plan + ciclo) para que del otro lado
 * —hoy una persona, manana el chatbot— sepa de que viene hablando el visitante
 * sin volver a preguntar.
 */
export function textoPlan(
  rubro: RubroPlanes,
  plan: Plan,
  ciclo: Ciclo,
): string {
  const precio =
    ciclo === "anual"
      ? `Bs ${bs(precioAnual(plan))} al año (${bs(precioMes(plan, "anual"))}/mes)`
      : `Bs ${bs(plan.lanzamiento)}/mes`;
  return (
    `Hola, vengo de la web de Onia. Rubro: ${rubro.mensaje}. ` +
    `Miré el plan ${plan.nombre} (${precio}, precio de lanzamiento). ` +
    "Quiero saber cómo arranco."
  );
}

export function textoRubroEnConstruccion(rubro: RubroPlanes): string {
  return (
    `Hola, vengo de la web de Onia. Mi rubro es ${rubro.mensaje} y vi que el pack ` +
    "todavía está en construcción. Quiero saber qué se puede hacer hoy con mi caso."
  );
}

export function textoDudaPrecio(rubro: RubroPlanes): string {
  return (
    `Hola, vengo de los precios de Onia. Rubro: ${rubro.mensaje}. ` +
    "Tengo una duda antes de decidir el plan."
  );
}

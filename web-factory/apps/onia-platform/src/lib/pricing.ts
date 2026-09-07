/**
 * Precios de Onia — fuente UNICA de la landing.
 *
 * REGLA DURA (2026-08-08): cada numero de este archivo sale del CODIGO QUE
 * COBRA, no de un doc ni de una propuesta. Si el codigo no lo enforcea, no se
 * publica.
 *
 * COMO SE VERIFICA HOY — con un comando, no a mano:
 *
 *     node scripts/precios-fuente.mjs      # 31 cifras, montos + topes + tiers
 *
 * Aca decia "Verificado contra `C:\dev\proyectos\onia-platform`, rama `master`,
 * tip `6b8f152` (solo lectura)". Las dos mitades de esa frase caducaron y ni
 * una avisaba: la ruta es de una laptop Windows —los loops corren en Linux, el
 * producto esta en `/root/loops/onia-platform`— y el tip esta congelado, asi
 * que la verificacion que este archivo declaraba NO se puede re-correr en
 * ninguna maquina de hoy. Una procedencia que no se puede repetir se lee igual
 * que una verificada, que es el modo en que un comentario "manda al reves":
 * el 2026-09-06 mande media vuelta a cruzar estos topes A MANO contra el otro
 * repo —leyendo `PLAN_LIMITS` linea por linea— antes de descubrir que
 * `scripts/precios-fuente.mjs` ya lo hacia entero, cada vuelta, y salia VERDE.
 *
 * El mapa de abajo sigue vigente y es lo unico que hay que mantener a mano:
 * dice QUE archivo del producto manda sobre CADA cosa. El cruce de los VALORES
 * lo hace el script, y si una fuente no se puede leer sale con codigo 2
 * (ROJO DE INSTRUMENTO), nunca en verde.
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
import { precioWebDesde } from "@/content/webs";

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

/**
 * Los dos add-ons recurrentes que se cobran acá, cada uno con su monto UNA sola
 * vez. El chatbot no está en esta lista porque tiene su propia fuente
 * (`content/chatbot-precios.ts`), y de ahí sale la forma: el número vive como
 * número y las pantallas lo interpolan.
 *
 * Nacen de un defecto medido el 2026-09-04, servido con 200 en producción: los
 * dos montos estaban escritos **dos veces cada uno** y sin ninguna constante
 * detrás —`Bs 70` en el `incluye` del Básico y en su fila de `ADDONS`, `Bs 150`
 * en el `sinEsto` del Básico y en la suya—, y las dos copias de cada uno se
 * renderizan en la MISMA página (`/` y `/precios`). El día que Sergio mueva el
 * precio, quien edite la fila que se llama `precio` —la obvia— deja la otra
 * anunciando el número viejo tres tarjetas más arriba, que es exactamente cómo
 * llegó a haber cuatro precios vivos del mismo chatbot. Lo vigila
 * `app/(sitio)/precios-addons.test.ts`.
 */
export const AGENDA_ADDON = {
  nombre: "Reservas online",
  mensualAddon: 150,
} as const;

export const USUARIO_EXTRA_ADDON = {
  nombre: "Usuario adicional",
  mensualAddon: 70,
  /** Cuántos se pueden sumar en Básico antes de que convenga subir a Pro. */
  maxEnBasico: 3,
} as const;

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
      `2 usuarios (podés sumar hasta ${USUARIO_EXTRA_ADDON.maxEnBasico} más a Bs ${bs(USUARIO_EXTRA_ADDON.mensualAddon)}/mes cada uno)`,
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
      `Reservas online — se agrega como add-on a Bs ${bs(AGENDA_ADDON.mensualAddon)}/mes`,
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
const PRUEBA_DIAS = 14;

/**
 * Con qué plan corre la prueba. NO es el plan que el lead eligió: el producto
 * da de alta toda cuenta con `TRIAL_PLAN = "professional"`
 * (`onia-platform/app/api/auth/register/route.ts:272`), apriete la tarjeta que
 * apriete. Si esto cambia allá, cambia acá — y `prueba-vs-plan.test.ts` obliga
 * a que las tres tarjetas se enteren.
 */
const PRUEBA_PLAN = "Pro";

/**
 * La nota de prueba de CADA tarjeta, porque el botón de las tres arranca la
 * misma prueba y sólo en una de ellas es «este mismo plan».
 *
 * Vivía tipeada a mano en `landing-v1/pricing.tsx` y sólo se pintaba en la
 * tarjeta destacada; como la destacada es justo el Pro, el texto era cierto
 * donde se veía y las otras dos callaban. Quien elegía el Básico probaba 14
 * días de Pro y recién al pagar Bs 320 se le apagaban los agentes, las reservas
 * online y los reportes completos, con los topes cayendo de 1.500 a 300 fichas
 * y de 5 a 2 usuarios. Decirlo no ahuyenta: para el Básico es el mejor
 * argumento de la tarjeta —probás el nivel de arriba— y para el Full avisa que
 * lo que se prueba tiene techo.
 */
const NOTA_PRUEBA_POR_PLAN: Record<string, string> = {
  basico: `${PRUEBA_DIAS} días de prueba sin tarjeta, con el plan ${PRUEBA_PLAN} completo. Al pasar a Básico quedás con lo de esta tarjeta.`,
  pro: `${PRUEBA_DIAS} días de prueba sin tarjeta, corriendo con este mismo plan.`,
  full: `${PRUEBA_DIAS} días de prueba sin tarjeta, con el plan ${PRUEBA_PLAN}. Al pasar a Full se van los topes.`,
};

export const PRUEBA = {
  dias: PRUEBA_DIAS,
  planQueCorre: PRUEBA_PLAN,
  copy: `${PRUEBA_DIAS} días de prueba sin poner tarjeta, corriendo con el plan ${PRUEBA_PLAN} completo. Al terminar, la cuenta queda en solo lectura: no se borra nada y podés exportar tus datos.`,
  notaPorPlan: NOTA_PRUEBA_POR_PLAN,
} as const;

export function bs(n: number): string {
  return n.toLocaleString("es-BO");
}

/**
 * El semanal más barato que existe HOY, para el copy que dice "semanal desde".
 *
 * No todos los planes tienen semanal (`Full` no se cobra así), y el día que
 * cambie cuál lo tiene, un número escrito a mano queda anunciando un ciclo que
 * ya no se vende. Devuelve `null` si ningún plan tiene semanal: el copy que lo
 * use debe omitir la frase, nunca decir "Bs 0".
 */
export function semanalDesde(): number | null {
  const vivos = PLANES.map((p) => p.semanal).filter((n): n is number => n !== null);
  return vivos.length === 0 ? null : Math.min(...vivos);
}

/**
 * Un plan por su id, para que el copy interpole en vez de tipear la cifra.
 *
 * Existe desde el 2026-09-04, cuando se encontraron 17 montos de plan escritos
 * a mano en `app/v1/**` — cuatro rutas vivas que el gate de precios no miraba.
 * Sin un acceso cómodo, cada página resolvía el `find` por su cuenta o, más
 * probable, escribía el número: el camino fácil tiene que ser el correcto.
 */
export function plan(id: PlanId): Plan {
  const encontrado = PLANES.find((p) => p.id === id);
  // Fail-closed: un copy que cae de pie acá anunciaría un precio inventado.
  // Mejor que el build caiga nombrando el id que no está en la tabla.
  if (!encontrado) {
    throw new Error(`No existe el plan "${id}" en PLANES (lib/pricing.ts).`);
  }
  return encontrado;
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
 * ✅ LA DISPUTA SE CERRO — corregido 2026-09-04. Hasta hoy este comentario
 * decia "🔴 PRECIO EN DISPUTA" y que "se publica 790", y las dos cosas eran
 * falsas desde el 2026-08-23: ese dia Sergio ratifico la linea
 * 2.000/4.500/desde 7.500, content/webs.ts se movio con el, y produccion
 * publica 2.000 (medido en /servicios/webs y en la portada). La linea
 * 790/1.500/2.900 era una oferta de ARRANQUE vencida el 31-jul-2026.
 *
 * Se corrige porque un cartel rojo vencido no es ruido: este es el archivo que
 * toda sesion abre para tocar precios, y decia que el numero vivo estaba en
 * disputa y que la pantalla mostraba la mitad de lo que muestra. La proxima
 * sesion que lo leyera como presente tenia todo para "arreglar" el 2.000 de
 * vuelta a 790 — revertir un precio ratificado, a menos de la mitad.
 *
 * La regla de arriba no cambia: el numero no se elige desde este archivo. Si
 * la linea vuelve a moverse se edita content/webs.ts y las pantallas siguen.
 */
const WEB_DESDE = precioWebDesde();

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
    nombre: AGENDA_ADDON.nombre,
    copy: "Link público para que te pidan cita sin llamadas ni mensajes. Ya viene incluida en Pro y en Full.",
    precio: `Bs ${bs(AGENDA_ADDON.mensualAddon)}/mes en Básico`,
  },
  {
    nombre: USUARIO_EXTRA_ADDON.nombre,
    copy: `Una persona más en el sistema. En Básico se pueden sumar hasta ${USUARIO_EXTRA_ADDON.maxEnBasico}.`,
    precio: `Bs ${bs(USUARIO_EXTRA_ADDON.mensualAddon)}/mes por usuario`,
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

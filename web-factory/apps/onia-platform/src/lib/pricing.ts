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

/**
 * Capacidades que el plan enciende para TODOS y que el producto entrega solo a
 * ALGUNOS RUBROS. La salvedad no es opcional: es la diferencia entre cobrar y
 * cobrar de más.
 *
 * Medido el 2026-09-08 contra `origin/master` de `onia-platform`. `/reports` y
 * `/billing/recurring` están encendidas por PLAN desde Pro para todo el mundo
 * (`plan-catalogo.ts`: `reportsEnabled` / `recurringInvoicesEnabled`) y además
 * por RUBRO: solo las declaran en su nav los packs clínicos, así que
 * `allowedSegmentsForPack` no le da el segmento a comercio, importadora ni
 * servicios profesionales —3 de los 5 rubros que el alta ofrece—. Con
 * `PLATFORM_LAYER=1` (leído del contenedor vivo) el layout los devuelve a
 * `/dashboard`, mudo: sin error, sin cartel, sin nada.
 *
 * Y esa línea es justo el gancho del salto de Bs 320 a Bs 750: estaba en el
 * `incluye` del Pro y —de nuevo— en el `sinEsto` del Básico, así que a un
 * comercio le cobraba el plan de arriba por dos pantallas a las que su rubro no
 * llega, y de paso le decía que le faltaba algo que nunca iba a tener.
 *
 * POR QUÉ NINGÚN GATE LO VEÍA, que es lo que hace nueva a esta clase: no sobra
 * ninguna palabra (invisible a `obra.test.ts` y `hueco-declarado.test.ts`), no
 * promete gente nuestra (`promesa-humana.test.ts`), los montos salen de la
 * fuente (`precios.test.ts`, `precios-fuente.mjs` en verde), la capacidad EXISTE
 * de verdad en el producto y tiene su salvedad de PLAN, que es lo único que
 * `capacidad-vs-precio.test.ts` mira. El eje que faltaba es (capacidad, RUBRO).
 *
 * El arreglo gemelo del PRODUCTO —`/settings/plan`, que listaba lo mismo plano—
 * es `9c7031a` en `onia-platform`. Ahí se puede filtrar porque la pantalla sabe
 * el rubro; acá la página es genérica, así que la salvedad se DICE. El alcance
 * se lee de esta constante y nunca se tipea en el copy: dos copias del mismo
 * hecho es como llegó a haber cuatro precios vivos del mismo chatbot.
 *
 * Lo vigila `app/(sitio)/capacidad-por-rubro.test.ts`, y el cruce contra el pack
 * real del producto lo hace `scripts/capacidad-por-rubro.mjs` (alias
 * `npm run capacidad:por-rubro`), que sale 2 = NO MEDIDO si no alcanza el repo
 * hermano — un rubro nuevo que no llegue a estas pantallas lo caza ese script,
 * no este dato.
 */
export const ALCANCE_POR_RUBRO = [
  {
    /** Cómo la nombra el copy de los planes. */
    capacidad: "Reportes completos",
    pantalla: "/reports",
    rubros: ["Clínica dental", "Estética y spa"],
  },
  {
    capacidad: "facturas recurrentes",
    pantalla: "/billing/recurring",
    rubros: ["Clínica dental", "Estética y spa"],
  },
] as const;

/** Cómo se dice ese alcance en una línea de venta, derivado del dato de arriba. */
export const ALCANCE_CLINICO = "solo en clínicas dentales y estética";

/** «a, b y c» — para que la frase del copy salga del dato y no al lado del dato. */
const listar = (xs: readonly string[]) =>
  xs.length < 2 ? (xs[0] ?? "") : `${xs.slice(0, -1).join(", ")} y ${xs[xs.length - 1]}`;

/**
 * El MISMO eje (capacidad, RUBRO), con el corte en otro lado: acá el rubro SÍ
 * llega a la pantalla, y lo que le falta son los DATOS que la capacidad lee.
 *
 * Medido el 2026-09-10 contra `origin/master` de `onia-platform`. El agente
 * Recall lee `patient` + `appointment`, así que desde `64279ff`
 * (`lib/onia-core/modules/agents-por-rubro.ts`) el runtime lo acota con
 * `rolCorreEnTrack('recall', track) = guardaClientesEnPatients(track)`, que es
 * `pack.nav` con `/patients`: **falso para comercio (`gestios-general`) e
 * importadora (`proveegest-electrico`)**, 2 de los 5 rubros que el alta ofrece.
 * Antes de ese arreglo corría igual y fallaba MUDO —`[]` no lanza—: 34 corridas
 * reales en tres orgs de esos rubros, todas con 0 acciones producidas. El
 * Cobrador no se acota: ramifica por rubro y cobra fiados de mostrador.
 *
 * POR QUÉ NINGÚN GATE LO VEÍA, y por qué es una clase nueva y no otra instancia
 * de la de arriba: los dos instrumentos de esta familia preguntan por la
 * PANTALLA. `app/(sitio)/capacidad-por-rubro.test.ts` saca sus sujetos de las
 * líneas de `PLANES` y sólo exige la salvedad a las que nombran una capacidad de
 * `ALCANCE_POR_RUBRO`; `scripts/capacidad-por-rubro.mjs` cruza «¿el pack declara
 * esta pantalla en su nav?» — y `/agents` está en el nav de los SIETE packs. Con
 * el corte adentro de una pantalla que todos alcanzan, ninguno de los dos puede
 * siquiera expresar la pregunta, y los dos daban verde.
 *
 * El arreglo gemelo del PRODUCTO ya existe (`lib/subscription/plan-display.ts`
 * filtra el Recall por rubro en la pantalla donde el cliente paga); el de la
 * VENTA es éste, cuatro días después. Lo vigila `app/capacidad-acotada.test.ts`,
 * cuyos sujetos son las MENCIONES en todo `src/`, no las líneas de los planes:
 * la página que vende la capacidad la describe rol por rol, fuera de `PLANES`.
 */
export const ALCANCE_POR_DATOS = [
  {
    /** Cómo la nombra el copy. */
    capacidad: "Recall",
    /** El predicado real del producto, en castellano. */
    porque: "lee la ficha del cliente y la agenda",
    /** Rubros del alta que sí tienen esos datos, como los nombra el copy. */
    rubros: ["dentales", "estética", "servicios profesionales"],
  },
] as const;

/** Cómo se dice ese alcance en una línea de venta, derivado del dato de arriba. */
export const ALCANCE_CON_FICHA = `solo en ${listar(ALCANCE_POR_DATOS[0].rubros)}`;

/**
 * El MISMO eje (capacidad, RUBRO), con el corte en la capacidad más BÁSICA que
 * tiene el producto: la agenda.
 *
 * 🔴 **Por qué las dos listas de arriba no podían verlo.** `ALCANCE_POR_RUBRO` y
 * `ALCANCE_POR_DATOS` las escribió alguien que ya sospechaba de esa capacidad —
 * el Recall, los reportes, las facturas recurrentes: lo caro, lo de los planes
 * altos, lo que suena a clínica. **La agenda no la sospechó nadie**, porque es
 * lo primero que uno da por hecho que trae un sistema de gestión. Y es justo la
 * que la venta repite en CADA superficie: la descripción de la home, su tarjeta
 * de OpenGraph, el `incluye` del plan más barato, los tres pasos de «cómo
 * funciona», la página de la prueba gratis y su gemela de `/v1`.
 *
 * Medido el 2026-09-11 contra `origin/master` de `onia-platform` recorriendo
 * `VERTICAL_PACKS` de los 5 rubros que el alta entrega: `gestios-general`
 * (comercio) y `proveegest-electrico` (importadora) **no tienen una sola ruta de
 * citas en su nav**. No es que la llamen distinto —como «Cobros» y «Caja», que
 * sí son la misma función con dos nombres—: no existe. El producto ya lo dice de
 * sí mismo con `tieneAgenda(track) = entregaLaPantalla(track, "/appointments")`,
 * y un `false` ahí significa las dos cosas a la vez: no hay enlace Y el layout
 * devuelve a `/dashboard`.
 *
 * La reserva online cuelga de la misma condición: `lib/agenda/reserva-publica.ts`
 * declara `MotivoSinReservaPublica = "plan" | "rubro" | "vencida"`, y el motivo
 * `rubro` es ese mismo `tieneAgenda`. Por eso las dos van juntas acá.
 */
export const ALCANCE_POR_AGENDA = [
  {
    /** Cómo la nombra el copy. */
    capacidad: "agenda",
    /** El predicado real del producto. */
    porque: "el pack del rubro entrega la pantalla de citas (`tieneAgenda`)",
  },
  {
    capacidad: "reservas online",
    porque: "la reserva pública corta por `rubro` con el mismo `tieneAgenda`",
  },
] as const;

/** Los rubros del alta que trabajan con citas, como los nombra el copy. */
export const RUBROS_CON_AGENDA = ["dental", "estética", "servicios profesionales"] as const;

/**
 * Cómo se dice ese alcance en una línea de venta, derivado del dato de arriba.
 *
 * Se dice por lo que el rubro HACE («si trabajás con citas») y no por la lista
 * de rubros, porque la enumeración es la forma que ya se pudrió una vez: el
 * 2026-09-11 la portada enumeraba cuatro rubros y el alta entregaba cinco. La
 * lista queda igual en `RUBROS_CON_AGENDA` para el que necesite nombrarlos.
 */
export const ALCANCE_CON_AGENDA = "si trabajás con citas";

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
      `Fichas, caja y cobros en un solo lugar, y agenda ${ALCANCE_CON_AGENDA}`,
      "Inventario con existencias, costo, proveedor y aviso de stock mínimo",
      "Reporte básico y contabilidad básica de compras y ventas",
      "Lista de empleados",
      "Exportás tus datos en CSV cuando quieras",
    ],
    sinEsto: [
      "Agentes de IA (vienen desde Pro)",
      `Reservas online — se agrega como add-on a Bs ${bs(AGENDA_ADDON.mensualAddon)}/mes`,
      `Reportes completos y facturas recurrentes (${ALCANCE_CLINICO})`,
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
      `Agente Recall: te propone a quién hace rato que no ves (${ALCANCE_CON_FICHA})`,
      "Agente Cobrador: te propone a quién reclamarle la deuda vencida",
      `Reservas online incluidas, ${ALCANCE_CON_AGENDA}: link público para que te pidan cita`,
      `Reportes completos y facturas recurrentes (${ALCANCE_CLINICO})`,
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

/**
 * La VENTANA que el contrato le pone a «tus datos son tuyos».
 *
 * No es un detalle legal: es el plazo que la venta tiene que decir en voz alta
 * cuando habla de irse. `content/legal/privacidad.md` §8 (status vigente, la
 * misma política que el lead acepta al crear la cuenta) fija los dos números, y
 * `salida-con-fecha.test.ts` los cruza contra ese archivo — si el contrato
 * cambia, el gate se pone rojo en vez de dejar el copy diciendo el viejo.
 *
 * `diasParaExportar` es el que le impone una ACCIÓN al cliente, así que es el
 * que va en el copy; `diasHastaEliminar` es cuándo desaparecen. Decir 90 sería
 * prometer de más: a los 31 los datos todavía existen pero el derecho a pedirlos
 * ya venció.
 */
export const RETENCION = {
  /** Días posteriores a la terminación para pedir la exportación (§8). */
  diasParaExportar: 30,
  /** Días tras los que Onia elimina los datos de sus sistemas activos (§8). */
  diasHastaEliminar: 90,
} as const;

export const PRUEBA = {
  dias: PRUEBA_DIAS,
  planQueCorre: PRUEBA_PLAN,
  copy: `${PRUEBA_DIAS} días de prueba sin poner tarjeta, corriendo con el plan ${PRUEBA_PLAN} completo. Al terminar, la cuenta queda en solo lectura: nada se borra de inmediato y tenés ${RETENCION.diasParaExportar} días para exportar tus datos.`,
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
 * onia-hermes/scripts/venta-honestidad.test.mjs (repo RAIZ, en su cadena
 * `npm test` como `test:venta-honestidad` — esta app no tiene ese archivo, y
 * escrito sin la raiz se lee como que lo vigila un gate de acá que no existe).
 * Detalle: ONIA_CATALOGO_DE_VENTA.md §5.
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
    copy: `Link público para que te pidan cita sin llamadas ni mensajes, ${ALCANCE_CON_AGENDA}. Ya viene incluida en Pro y en Full.`,
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
  // Mismo caso que la línea de arriba: tipeaba "14 días" y "Pro" a mano
  // teniendo PRUEBA_DIAS y PRUEBA_PLAN dos pantallas más arriba, en este mismo
  // archivo. El cruce contra el producto (scripts/precios-fuente.mjs) valida
  // las CONSTANTES, no las copias, así que el día que el trial cambie esta
  // frase sigue en verde diciendo el número viejo.
  `${PRUEBA_DIAS} días de prueba sin tarjeta, con el ${PRUEBA_PLAN} completo. Al vencer, la cuenta queda en solo lectura: nada se borra de inmediato y tenés ${RETENCION.diasParaExportar} días para exportar tus datos.`,
  "En los tres planes de arriba no cobramos implementación ni migración: el checkout cobra solo el plan. Grupo / Empresarial sí lleva implementación acompañada y se cotiza aparte.",
  // Decía "desde el plan más chico", que ponía a la salida detrás de un pago:
  // el export integral NO se gatea por plan (el producto lo llama "derecho del
  // titular", `app/api/settings/export/route.ts:14`) y la prueba corre con Pro.
  // La condición era de la venta, no del producto — ver `datos-que-se-llevan.test.ts`.
  "Tus datos son tuyos: los exportás en CSV cuando quieras, sin importar el plan y también durante la prueba.",
] as const;

/**
 * Nota fiscal — se dice ANTES de que la pregunten. La emision fiscal NO es una
 * feature de plan: depende de un flag global y del tramite de homologacion ante
 * el SIN. Con el emisor en mock, no se vende como si funcionara.
 */
export const NOTA_FISCAL =
  "Facturación fiscal, de frente: nuestro emisor está en trámite de homologación ante el SIN y todavía no emite factura con valor fiscal. No es algo que se destrabe pagando un plan más caro — no depende del plan. Mientras tanto, Onia te deja la venta cerrada y facturás en el Portal Web del SIN, que es gratuito y cumple la ley. No te cobramos por algo que todavía no anda.";

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
 *    Escalera C (ratificada por Sergio Urcullo 2026-09-12): basic 320/89/3.200 ·
 *    crece 550/145/5.500 · professional 890/229/8.900 · clinic 1.290/-/12.900 ·
 *    enterprise 2.900/-/29.000; Full y Grupo NO tienen semanal.
 *  - limites y features ...... lib/plan-catalogo.ts → PLAN_LIMITS
 *    (usuarios 2/3/5/ilimitado · clientes 300/800/1.500/ilimitado · emails
 *    200/400/800/ilimitado · agentsIncluded y publicBookingIncluded desde
 *    crece · csvExportEnabled desde basic · reportsEnabled y
 *    recurringInvoicesEnabled desde professional · inventoryIncluded en todos ·
 *    whatsappIncluded SOLO clinic/enterprise — el chatbot va con Full)
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

import {
  CHATBOT_PLAN,
  CONVERSACIONES_INCLUIDAS,
  META_COBRA_RESPUESTAS_DESDE,
  precioAddonChatbot,
} from "@/content/chatbot-precios";

/**
 * El mensual del chatbot para las tarjetas de plan (la cuenta "Pro + add-on
 * vs Full"). Sale de SU fuente única — nunca tipeado acá.
 */
const CHATBOT_MENSUAL = CHATBOT_PLAN.mensual;
import { precioWebDesde } from "@/content/webs";

// "crece" entra el 2026-09-12: escalera C ratificada por Sergio Urcullo
// (320/550/890/1.290, chatbot incluido en Full). Espejo de
// onia-platform/lib/subscription-plans.ts — el producto es la fuente.
export type PlanId = "basico" | "crece" | "pro" | "full";

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
  /**
   * ¿El chatbot de WhatsApp viene pagado ADENTRO de este plan?
   *
   * Espejo de `whatsappIncluded` (`onia-platform/lib/plan-catalogo.ts`), que es la fuente. Hasta el
   * 2026-09-13 este dato vivía sólo en PROSA y en un comentario, y por eso nadie lo cruzaba: los
   * gates de plata atan CIFRAS, y Bs 390 sigue siendo un monto legítimo mientras el texto miente.
   * Con la FAQ diciendo "No: es un servicio aparte" a secas, el cliente de Full leía que tenía que
   * pagar Bs 390/mes por algo que su plan ya le daba.
   *
   * Obligatorio en el tipo a propósito: un plan nuevo no puede nacer sin contestarlo. Lo cruza
   * `scripts/inclusion-chatbot.mjs` contra el ref publicado del producto.
   */
  chatbotIncluido: boolean;
  /**
   * ¿Los agentes de IA (Recall y Cobrador) vienen adentro de este plan?
   *
   * Espejo de `agentsIncluded` (`onia-platform/lib/plan-catalogo.ts`), que es la fuente.
   */
  agentesIncluidos: boolean;
  /**
   * ¿Las reservas online (el link público de citas) vienen adentro de este plan?
   *
   * Espejo de `publicBookingIncluded` (`onia-platform/lib/plan-catalogo.ts`), que es la fuente.
   */
  reservasIncluidas: boolean;
  /**
   * ¿Este plan deja tener MÁS DE UN administrador?
   *
   * Espejo de `multiAdminIncluded` (`onia-platform/lib/plan-catalogo.ts`), que es la fuente.
   *
   * Nace el 2026-09-18 y es el cuarto hermano por la MISMA razón que los tres de arriba, con una
   * diferencia que lo hace peor: los otros entraron al sitio el día que el producto los movió, y
   * éste entró al PRODUCTO el 17-sep (DG-043, decisión de Sergio Urcullo: "más de dos
   * administradores, pero en los paquetes caros") y al sitio nunca. Medido ese día contra
   * producción —`build-597dd97`, el árbol del `BUILD_ID` vivo de `app.onia.com.bo`, con
   * `multiAdminIncluded` ya adentro— el corte estaba APLICÁNDOSE y en todo `src/` no había una
   * sola aparición de la palabra "administrador".
   *
   * O sea: la tarjeta del Profesional decía "Topes: 1.500 fichas · 5 usuarios", el lead con un
   * equipo de 5 pagaba Bs 890 esperando cinco personas con acceso, invitaba a su socio como
   * administrador y el producto le contestaba "Tu plan incluye un solo administrador". La
   * sorpresa llegaba DESPUÉS de pagar, y costaba Bs 400/mes de diferencia. En la dirección
   * contraria el precio es el mismo: Completo y Grupo SÍ lo traen, y eso —el motivo de subir
   * para un "equipo grande", que es textualmente a quien apunta ese plan— no se vendía.
   */
  coadministradores: boolean;
  /**
   * Cuántos usuarios EXTRA vende este plan a `USUARIO_EXTRA_ADDON.mensualAddon`.
   * `null` = los que hagan falta, sin tope · `0` = no vende (no hace falta: sus usuarios
   * no tienen tope).
   *
   * Espejo de `topeDe` / `maxAsientosExtra` (`onia-platform/lib/asientos.ts`), que es la fuente y
   * lo que `checkUserLimit` APLICA: `effectiveLimit = PLAN_LIMITS[plan].users + extraUserSeats`,
   * sin mirar el plan salvo para el tope del Básico.
   *
   * 🔴 POR QUE EXISTE. Medido el 2026-09-19 sobre `onia.com.bo/precios` SERVIDA. La carta de
   * add-ons decía «Una persona más en el sistema. En Básico se pueden sumar hasta 3» — la ÚNICA
   * frase de alcance del add-on, y nombraba un solo plan. El producto los vende en Crece y en
   * Profesional también, y ahí SIN TOPE: la tabla que el dueño ve en `/settings` lo dice con
   * todas las letras, «Bs 70/mes por persona, sin tope».
   *
   * O sea que el lead de Profesional (5 usuarios, Bs 890) que necesitaba una persona más leía que
   * el add-on era cosa del Básico y concluía lo único que quedaba: subir al Completo, Bs 1.290.
   * La verdad era Bs 890 + 70 = **Bs 960**, así que le costaba **Bs 330/mes de más** (Bs 3.960 al
   * año); en Crece, Bs 270/mes. Y se desmentía sola tres renglones más arriba, en la misma
   * pantalla: «Ninguno te obliga a saltar de plan para desbloquear una sola cosa».
   *
   * POR QUE NINGUN GATE LO VEIA, que es lo que hace nueva a esta clase: no es una cifra mal
   * —Bs 70 sale de la fuente y `precios:fuente` firma verde con sus 43 cifras—, no es una
   * afirmación de INCLUSION («viene desde X», que persigue `capacidad-incluida.test.ts`) sino de
   * RESTRICCION, y no es un universal («todos», «cualquier plan») sino un PARTICULAR. Los gates
   * de la casa persiguen prometer de MAS; esto ofrece de MENOS, y eso no lo mira ninguno.
   *
   * Los otros dos add-ons de la carta ya derivan su alcance del catálogo (el chatbot el 18-sep,
   * las reservas el 13-sep). Éste era el tercer hermano, al que la cura no viajó.
   *
   * Obligatorio en el tipo a propósito: un plan nuevo no puede nacer sin contestarlo.
   */
  asientosExtra: number | null;
  destacado?: boolean;
  cuando: string;
}

/**
 * Los dos booleanos de arriba son hermanos de `chatbotIncluido` y nacen el 2026-09-13 por el
 * MISMO defecto, encontrado tres superficies más allá.
 *
 * QUE PASO. La escalera C (2026-09-12) metió el plan Crece entre Básico y Pro, y el catálogo del
 * producto le dio `agentsIncluded: true` y `publicBookingIncluded: true` — las dos capacidades
 * bajaron un escalón, de Bs 890 a Bs 550. Las tarjetas de plan siguieron (dicen "desde Crece"),
 * pero las superficies que afirmaban lo MISMO con el nombre del plan TIPEADO a mano no se
 * enteraron, y quedaron mintiendo al revés — cobrando de más:
 *
 *   - el `copy` del add-on Reservas online (acá abajo): "Incluida en Pro y Full"
 *   - `/agentes`, la página entera: "Los agentes vienen incluidos desde el plan Pro", en el H2,
 *     en el párrafo, en la `description` que viaja a Google y a WhatsApp, y en un comentario del
 *     archivo que lo daba por verificado
 *
 * O sea: al que evaluaba el Crece se le decía que pagara Bs 340/mes de más por lo que ese plan ya
 * trae, y `/precios` se contradecía a sí misma en la misma pantalla (la tarjeta del Crece decía
 * "Reservas online incluidas" y la sección de add-ons de más abajo, "Incluida en Pro y Full").
 *
 * POR QUE NINGUN GATE LO VIO, que es la parte que importa. `scripts/precios-fuente.mjs` SI cruza
 * estos dos booleanos contra el producto y salía VERDE: su detector del lado del sitio lee el
 * campo `incluye` de las tarjetas de plan, y ahí el dato estaba bien. Un gate que le pregunta a
 * UNA representación firma por todas las demás — el `copy` de un add-on y una página propia
 * afirman lo mismo y no eran sujeto de nadie.
 *
 * Por eso el arreglo no es escribir "Crece" en los tres lugares: eso reintroduce la clase el día
 * que el booleano vuelva a moverse. Se DERIVA con `primerPlanCon`, y lo vigilan DOS gates, uno
 * por cada mitad del problema:
 *
 *   - `src/lib/capacidad-incluida.test.ts` — que ningún texto del sitio tipee el plan a mano.
 *     Camina `src/` entero, así que una pantalla nueva nace cubierta.
 *   - `scripts/precios-fuente.mjs` — que estos booleanos digan lo MISMO que el catálogo del
 *     producto (`primer plan con agentes de IA · por campo`, y su hermano de reservas). Sin esa
 *     correa el error se muda del texto al booleano, que es adonde ahora apunta todo el copy.
 */

/** Las capacidades que un plan puede traer adentro, y el campo que lo contesta. */
export const CAPACIDADES_INCLUIDAS = {
  agentes: "agentesIncluidos",
  reservas: "reservasIncluidas",
  chatbot: "chatbotIncluido",
  coadministradores: "coadministradores",
} as const satisfies Record<string, keyof Plan>;

export type CapacidadIncluida = keyof typeof CAPACIDADES_INCLUIDAS;

/**
 * El nombre del plan MAS BARATO que trae esa capacidad adentro — el "desde X" que lee el cliente.
 *
 * El orden sale del PRECIO, no del orden del array ni del campo `paso`: un plan nuevo insertado en
 * el lugar equivocado tiene que dar la respuesta correcta igual. Devuelve `null` cuando ningún plan
 * la trae, para que el llamador diga lo suyo en vez de comerse un "undefined" en pantalla.
 */
export function primerPlanCon(
  capacidad: CapacidadIncluida,
  planes: readonly Plan[] = PLANES,
): string | null {
  const campo = CAPACIDADES_INCLUIDAS[capacidad];
  const conLaCapacidad = planes.filter((p) => p[campo] === true);
  if (conLaCapacidad.length === 0) return null;
  return conLaCapacidad.reduce((masBarato, p) =>
    p.mensual < masBarato.mensual ? p : masBarato,
  ).nombre;
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

/**
 * El inventario es la misma clase que la agenda: acotado por RUBRO, no por plan.
 * Medido 2026-09-24 contra `origin/master` de `onia-platform`
 * (`lib/platform/vertical-pack.ts`): dental y estética navegan a `/inventory`,
 * comercio e importadora a `/comercio/inventario`, y `SERVICIOS_NAV_ITEMS` no
 * tiene ninguna de las dos — `llevaInventario()` da false y la lista blanca de
 * rutas se deriva del nav. La venta lo enumeraba plano para los cinco rubros.
 */
export const ALCANCE_POR_INVENTARIO = {
  capacidad: "inventario",
  porque: "servicios profesionales no tiene pantalla de inventario en su pack (`llevaInventario`)",
} as const;

/** Cómo se dice ese alcance en una línea de venta: por lo que el rubro HACE. */
export const ALCANCE_CON_INVENTARIO = "si manejás stock";

export const USUARIO_EXTRA_ADDON = {
  nombre: "Usuario adicional",
  mensualAddon: 70,
  /** Cuántos se pueden sumar en Básico antes de que convenga subir a Pro. */
  maxEnBasico: 3,
} as const;

/**
 * Cómo se LLAMA cada plan para el cliente — el mismo nombre que le va a leer en el checkout.
 *
 * Nace de un desacuerdo vivo medido el 2026-09-17 contra las dos pantallas de la MISMA compra:
 * `onia.com.bo` decía «Pro» y «Full» (62 veces entre la home y `/precios`) mientras
 * `app.onia.com.bo` —donde se paga— los llama «Profesional» y «Completo»
 * (`PLAN_LABELS` de `onia-platform/lib/pricing.ts`, lo que pinta el checkout, la tab «Mi plan»,
 * los correos y los recibos). El lead elegía un plan con un nombre y pagaba otro; el que
 * escribía por WhatsApp pedía «el Full», que en el producto no existe. Ningún gate lo veía: los
 * cruces de plata comparan CIFRAS, y un nombre no es una cifra.
 *
 * Los `id` NO cambian: son internos de este archivo y no viajan a ninguna URL. Lo que el cliente
 * lee sale de acá, y `scripts/precios-fuente.mjs` lo cruza contra `PLAN_LABELS` del ref publicado
 * del producto, igual que los montos. Escribir el nombre en la prosa —«vienen en Pro»— es como
 * volvió la última vez: se interpola, no se tipea.
 */
const NOMBRE_DE_PLAN = {
  basico: "Básico",
  crece: "Crece",
  pro: "Profesional",
  full: "Completo",
} as const;

/**
 * Escalera C — ratificada por Sergio Urcullo el 2026-09-12 ("la C pero que
 * tenga restricciones y que tengan que estar pagando si quieren mejorar su
 * plan... que se noten las limitaciones para que quieran subir"). Cuatro
 * escalones con saltos chicos (+230/+340/+400), cada tarjeta con sus TOPES a
 * la vista y las funciones ordenadas por plan; el chatbot va INCLUIDO solo en
 * Full — Pro + chatbot por separado cuesta más que Full, y esa cuenta se
 * muestra. Los topes mensuales (recordatorios) se renuevan cada mes y no se
 * acumulan. Espejo de onia-platform/lib/subscription-plans.ts.
 */
const ESCALERA: readonly Plan[] = [
  {
    id: "basico",
    paso: "01",
    nombre: NOMBRE_DE_PLAN.basico,
    salto: "Ordenar",
    resultado: "Tu negocio deja de vivir en el cuaderno y en la memoria de la recepcionista.",
    mensual: 320,
    semanal: 89,
    anual: 3200,
    incluye: [
      `Fichas, caja y cobros en un solo lugar, y agenda ${ALCANCE_CON_AGENDA}`,
      "Inventario con existencias, costo, proveedor y aviso de stock mínimo en dental, estética, comercio e importadora",
      "Reporte básico y contabilidad básica de compras y ventas",
      "Exportás tus datos en CSV cuando quieras",
      `Topes: 300 fichas · 2 usuarios (hasta ${USUARIO_EXTRA_ADDON.maxEnBasico} más a Bs ${bs(USUARIO_EXTRA_ADDON.mensualAddon)}/mes) · 200 recordatorios por email/mes`,
    ],
    chatbotIncluido: false,
    agentesIncluidos: false,
    reservasIncluidas: false,
    coadministradores: false,
    // El `sinEsto` del Básico se DERIVA más abajo: nombra los planes donde esas dos capacidades
    // sí están, y ese nombre no se tipea (ver `PLANES`).
    sinEsto: [],
    // Va DESPUES de `sinEsto` a propósito: `numerosPublicados` (scripts/precios-fuente.mjs)
    // cuenta como cifra publicada todo número entre `incluye:` y `sinEsto:`, y este es dato
    // estructural, no una línea que el cliente lee. El único con tope: arriba de eso la respuesta
    // es subir de plan, no seguir sumando cargos sueltos (`topeDe` de `onia-platform/lib/asientos.ts`).
    asientosExtra: USUARIO_EXTRA_ADDON.maxEnBasico,
    cuando: "Negocio de 1 o 2 personas que hoy trabaja con cuaderno o Excel.",
  },
  {
    id: "crece",
    paso: "02",
    nombre: NOMBRE_DE_PLAN.crece,
    salto: "Recuperar",
    resultado:
      "Los agentes te devuelven clientes que se estaban yendo: proponen a quién contactar y vos aprobás.",
    mensual: 550,
    semanal: 145,
    anual: 5500,
    incluye: [
      `Todo lo del ${NOMBRE_DE_PLAN.basico}`,
      `Agente Recall: te propone a quién hace rato que no ves (${ALCANCE_CON_FICHA})`,
      "Agente Cobrador: te propone a quién reclamarle la deuda vencida",
      `Reservas online incluidas, ${ALCANCE_CON_AGENDA}: link público para que te pidan cita`,
      "Topes: 800 fichas · 3 usuarios · 400 recordatorios por email/mes",
    ],
    chatbotIncluido: false,
    agentesIncluidos: true,
    reservasIncluidas: true,
    coadministradores: false,
    sinEsto: [
      /**
       * El paréntesis cierra ANTES de la contabilidad, y ése es todo el arreglo.
       *
       * Hasta el 2026-09-19 la línea era «Reportes completos, facturas recurrentes y
       * contabilidad completa (solo en clínicas dentales y estética)»: la salvedad de las
       * dos primeras se derramaba sobre la tercera. Y la contabilidad NO está acotada por
       * rubro — `/contabilidad` es segmento COMÚN del producto (medido contra
       * `origin/master`: `lib/platform/contabilidad-transversal.test.ts` hace entrar a un
       * tenant dental y a uno de comercio; el corte es por PLAN). Así que a comercio,
       * importadora y servicios profesionales —3 de los 5 rubros del alta— se les decía
       * que la contabilidad completa no les llega ni subiendo, borrándoles el motivo más
       * caro del salto de Bs 550 a Bs 890; y el `incluye` del Pro, veinte líneas más
       * abajo, ya la listaba sin alcance: la misma pantalla se desmentía sola.
       * Lo vigila el caso «una salvedad de rubro no se derrama sobre la capacidad de al
       * lado» de `app/(sitio)/capacidad-por-rubro.test.ts`.
       */
      `Reportes completos y facturas recurrentes (${ALCANCE_CLINICO}), y contabilidad completa — vienen en ${NOMBRE_DE_PLAN.pro}`,
    ],
    asientosExtra: null,
    cuando: "Ya tenés movimiento y se te escapan clientes por falta de seguimiento.",
  },
  {
    id: "pro",
    paso: "03",
    nombre: NOMBRE_DE_PLAN.pro,
    salto: "Operar completo",
    resultado:
      "El negocio entero en el sistema: reportes, contabilidad completa y planilla, sin planillas aparte.",
    mensual: 890,
    semanal: 229,
    anual: 8900,
    incluye: [
      `Todo lo del ${NOMBRE_DE_PLAN.crece}`,
      `Reportes completos y facturas recurrentes (${ALCANCE_CLINICO})`,
      "Contabilidad completa (RCV, balance y export) y planilla del mes",
      "Topes: 1.500 fichas · 5 usuarios · 800 recordatorios por email/mes",
    ],
    chatbotIncluido: false,
    agentesIncluidos: true,
    reservasIncluidas: true,
    coadministradores: false,
    sinEsto: [],
    asientosExtra: null,
    destacado: true,
    cuando: "El negocio ya factura todos los días y querés los números al día.",
  },
  {
    id: "full",
    paso: "04",
    nombre: NOMBRE_DE_PLAN.full,
    salto: "Todo incluido",
    /**
     * Sin comparación de precio: comparar contra «el escalón de abajo + el add-on» es una CUENTA
     * sobre el catálogo, y se deriva en `PLANES` (`cuentaVsAddon`). Acá queda sólo lo que es
     * cierto sin hacer ninguna cuenta, para que el peor caso —que la derivación no encuentre
     * sujeto— sea copy honesto en vez de una cifra tipeada que envejece sola.
     */
    resultado: "Fichas y usuarios sin tope, con el agente conversacional de WhatsApp incluido.",
    mensual: 1290,
    semanal: null,
    anual: 12900,
    incluye: [
      `Agente conversacional de WhatsApp incluido: ${CONVERSACIONES_INCLUIDAS} conversaciones/mes (aparte vale Bs ${bs(CHATBOT_MENSUAL)}/mes)`,
      `Todo lo del ${NOMBRE_DE_PLAN.pro}`,
      /**
       * "Más de un administrador" va ACÁ, pegado a los usuarios sin tope, y no como quinta línea:
       * la home renderiza `incluye.slice(0, 4)` (`precios-toggle.tsx`), así que una línea nueva al
       * final nacería invisible en la pantalla donde el lead compara. Y es el renglón correcto por
       * contenido: el tope de usuarios y quién puede administrar son la misma pregunta para el que
       * arma un equipo.
       */
      "Fichas y usuarios sin tope, y más de un administrador; recordatorios por email sin tope mensual",
      "Te lo entregamos configurado para tu rubro",
    ],
    chatbotIncluido: true,
    agentesIncluidos: true,
    reservasIncluidas: true,
    coadministradores: true,
    sinEsto: [],
    // No vende asientos porque no hace falta: sus usuarios no tienen tope (`ilimitado` en
    // `cobroPorUsuarios`, que devuelve «Sin cargo: no hay tope de personas»).
    asientosExtra: 0,
    cuando: "Equipo grande, base de clientes que no entra en 1.500 fichas, o WhatsApp con movimiento.",
  },
] as const;


/**
 * Lo que este plan NO trae en administradores, o nada si lo trae (o si no lo trae ninguno).
 *
 * ⚠️ La línea NO nombra el plan desde el que sí viene, y no es por prudencia: el `sinEsto` de un
 * plan lo reusa el DOWNSELL de `/v1/empezar` ("si te queda grande, el escalón de abajo es…"), y
 * ahí nombrar un tercer plan es ofrecerlo. La primera versión decía "más de uno viene desde
 * Completo" y puso rojo a `escalon-que-no-se-tipea.test.ts` en el caso Crece→Básico: al que
 * bajaba al plan de Bs 320 se le nombraba el de Bs 1.290. El tier igual queda dicho, y en la
 * forma más derivada que hay: la tarjeta que lo trae lo dice en su `incluye`, las que no, acá.
 */
/**
 * Lo que este plan NO trae en chatbot de WhatsApp, y quién sí lo trae.
 *
 * Se escribe UNA vez, en el escalón más caro que no lo trae: es el que se compara contra el que
 * sí (Profesional + add-on cuesta más que Completo, y esa cuenta es la que decide la compra).
 * Repetirla en cada tarjeta subiría el add-on al mismo rango que el sistema, que es justo lo que
 * no vendemos.
 *
 * 🔴 Los nombres se DERIVAN, y el universo incluye a `GRUPO`. Estaba escrito dentro del literal
 * de la tarjeta como «${NOMBRE_DE_PLAN.full} ya lo trae incluido; acá va aparte», y esa cláusula
 * —medida el 2026-09-19— le niega el chatbot a Grupo / Empresarial, que lo trae pagado adentro
 * (`whatsappIncluded: true` en el catálogo publicado). Vive acá y no adentro del literal por la
 * misma razón que la línea de administradores: preguntarle a la escalera mientras la escalera se
 * construye es un ciclo, así que se le pasa `ESCALERA`, que en este punto ya está inicializada.
 */
function lineaDelChatbot(plan: Plan): string[] {
  if (plan.chatbotIncluido) return [];
  const universo = [...ESCALERA, GRUPO];
  const ultimoSinChatbot = ESCALERA.filter((p) => !p.chatbotIncluido).at(-1);
  if (plan.id !== ultimoSinChatbot?.id) return [];
  // Si NINGUN plan lo trajera adentro, esto no sería un escalón sino cómo se vende el add-on, y
  // anunciarlo como carencia sería mentir. La condición se lee del catálogo, no de una fecha.
  if (!universo.some((p) => p.chatbotIncluido)) return [];
  // Una sola plantilla, aunque sea larga: partirla en dos literales parte la ORACION, y el gate
  // que la vigila lee literal por literal — con el corte puesto, «acá va aparte» quedaba en un
  // pedazo sin sujeto y se acusaba solo (medido: DESALINEADO con el texto correcto).
  // prettier-ignore
  return [`El agente conversacional de WhatsApp — ${nombresConChatbot(universo)} ya lo ${traeOTraen(universo)} incluido; acá va aparte, Bs ${bs(CHATBOT_MENSUAL)}/mes`];
}

function lineaDeCoadministradores(plan: Plan): string[] {
  if (plan.coadministradores) return [];
  // Si ningún plan lo trajera, esto no sería un escalón sino cómo funciona el producto, y
  // anunciarlo como carencia sería mentir. La condición se lee del catálogo, no de una fecha.
  if (!primerPlanCon("coadministradores", ESCALERA)) return [];
  return ["Un solo administrador: el resto del equipo entra con acceso limitado"];
}

/**
 * La CUENTA del plan que trae el chatbot adentro contra el escalón de abajo comprándolo aparte.
 *
 * 🔴 **EL DEFECTO, medido el 2026-09-19 sobre `onia.com.bo/precios` SERVIDA** (texto renderizado
 * y leído, no un `grep`). La tarjeta del Completo decía *«la cuenta gana comparada con
 * Profesional más el add-on»* — y la cuenta **pierde**: Profesional Bs 890 + chatbot Bs 390 son
 * **Bs 1.280**, y el Completo sale **Bs 1.290**. Diez bolivianos MÁS por mes, cien más por año
 * (8.900 + 3.900 = 12.800 contra 12.900). Lo afirmaba la página cuyo título es «PRECIOS CLAROS».
 *
 * 🔴 **POR QUE NINGUN GATE PODIA VERLO.** Es una familia nueva: la afirmación no es un monto, ni
 * un nombre de plan, ni una capacidad — es el **RESULTADO DE UNA CUENTA** entre montos legítimos.
 *
 *   - los cruces de precio (`scripts/precios-fuente.mjs`, `npm run precios:vivos`) validan que
 *     cada cifra salga de la fuente: 890, 390 y 1.290 salen de la fuente, las tres. Verde;
 *   - `lib/capacidad-incluida.test.ts` prohíbe tipear un nombre de plan junto a una capacidad, y
 *     acá el nombre ya venía interpolado de `NOMBRE_DE_PLAN.pro`. Verde;
 *   - `(sitio)/desbloqueo-que-no-se-tipea.test.ts` y `prueba-vs-plan.test.ts` cierran el
 *     universal y el alcance total. Esta oración no afirma ninguno de los dos. Verde.
 *
 * O sea: los tres sumandos eran correctos y la suma estaba mal, y ningún instrumento suma.
 *
 * DOS DECISIONES QUE LO HACEN CLASE Y NO INSTANCIA:
 *
 *  1. **No se prohíbe el literal viejo.** «No digas *la cuenta gana*» se apagaría solo el día que
 *     la cuenta efectivamente gane (y puede ganar: basta que el Completo baje o que el add-on
 *     suba). Lo que se prohíbe es TIPEAR el resultado: sale de acá, y las tres direcciones
 *     —más caro, igual, más barato— las dice la aritmética.
 *  2. **El sujeto se DERIVA del catálogo**, no es «el Completo»: es todo plan que traiga el
 *     chatbot adentro teniendo debajo uno que no. El escalón que se agregue mañana nace con la
 *     cuenta bien hecha, y si el de abajo también lo trae, la comparación desaparece sola.
 */
/**
 * 🔴 **Y la cuenta se hace en el ciclo QUE LA TARJETA MUESTRA — agregado el 2026-09-27.**
 *
 * Hasta hoy esto sólo sabía sumar el MENSUAL, y la portada tiene un interruptor Mensual/Anual.
 * Mirado renderizado (Chromium, clic en «Anual», texto leído): la tarjeta del Completo decía
 * `12.900 Bs / año` · `Equivale a Bs 1.075 por mes` · `Bs 10 más al mes que Profesional`. En
 * anual la cuenta es otra —8.900 + 3.900 = 12.800 contra 12.900, o sea **Bs 100 más al año**, Bs
 * 8 por mes— así que el lead que restaba con los números que la propia tarjeta le daba (1.075
 * contra 742 + 325) obtenía 8 y leía 10. Las dos mitades de una misma tarjeta salían de ciclos
 * distintos.
 *
 * Es la MISMA falla que el bloque de arriba documenta, un escalón más adentro: la cura del
 * 2026-09-19 arregló la aritmética y **se quedó en un solo ciclo**. Por eso el ciclo entra al
 * tipo (`CuentaVsAddon.ciclo`) y la unidad de la frase se deriva de él: el semanal, que ya existe
 * en `Plan.semanal`, nace obligado a contestar qué dice en vez de heredar el mensual en silencio.
 */
export type CicloDeCuenta = "mensual" | "anual";

/** Los dos montos del add-on, para poder sumar en cualquiera de los dos ciclos. */
export interface AddonDeLaCuenta {
  readonly mensual: number;
  readonly anual: number;
}

export interface OpcionesDeLaCuenta {
  /** En qué ciclo se está mostrando el precio. Por defecto el mensual, que es el de catálogo. */
  readonly ciclo?: CicloDeCuenta;
  readonly addon?: AddonDeLaCuenta;
}

export interface CuentaVsAddon {
  /** El ciclo en el que está hecha: manda sobre la unidad de la frase. */
  readonly ciclo: CicloDeCuenta;
  /** El escalón de abajo: el que tiene que comprar el add-on aparte. */
  readonly contra: Plan;
  /** Lo que sale armarlo abajo, en el ciclo de la cuenta: el de abajo + el add-on. */
  readonly armado: number;
  /** Lo que cuesta de MÁS el plan que lo trae adentro. Negativo = sale más barato. */
  readonly deMas: number;
}

/** Cuánto cobra un plan en un ciclo. Un solo lugar elige la columna, así no se cruzan. */
function montoEnElCiclo(plan: Plan, ciclo: CicloDeCuenta): number {
  return ciclo === "anual" ? plan.anual : plan.mensual;
}

/**
 * El monto del add-on en el ciclo de la cuenta.
 *
 * Un número suelto es el MENSUAL y nada más: **no se le deriva un anual** con la regla de los 10
 * meses aunque el catálogo entero la cumpla. Sería una suposición en el camino de la plata, y el
 * ciclo de un número suelto es siempre el mensual, así que nunca hace falta.
 */
function addonEnElCiclo(opciones: number | OpcionesDeLaCuenta, ciclo: CicloDeCuenta): number {
  if (typeof opciones === "number") return opciones;
  const addon = opciones.addon ?? CHATBOT_PLAN;
  return ciclo === "anual" ? addon.anual : addon.mensual;
}

export function cuentaVsAddon(
  plan: Plan,
  planes: readonly Plan[] = ESCALERA,
  // `number` se sigue aceptando y se lee como el mensual del add-on: es lo que hacen los
  // llamadores que existían antes del ciclo, y cambiarlos no habría probado nada.
  opciones: number | OpcionesDeLaCuenta = {},
): CuentaVsAddon | null {
  const ciclo = typeof opciones === "number" ? "mensual" : (opciones.ciclo ?? "mensual");

  if (!plan.chatbotIncluido) return null;
  const i = planes.findIndex((p) => p.id === plan.id);
  // Sin escalón debajo, o con uno que también lo trae adentro, no hay contra qué comparar: la
  // oración no se escribe, en vez de compararse contra sí misma.
  const contra = i > 0 ? planes[i - 1] : null;
  if (!contra || contra.chatbotIncluido) return null;
  const armado = montoEnElCiclo(contra, ciclo) + addonEnElCiclo(opciones, ciclo);
  return { ciclo, contra, armado, deMas: montoEnElCiclo(plan, ciclo) - armado };
}

/** Cómo se nombra cada ciclo dentro de la frase. El día que entre el semanal, entra acá. */
const UNIDAD_DEL_CICLO: Record<CicloDeCuenta, string> = {
  mensual: "al mes",
  anual: "al año",
};

/** La cuenta, dicha. Las tres direcciones salen del signo, nunca de un literal elegido a mano. */
export function cuentaEnPalabras(cuenta: CuentaVsAddon): string {
  const unidad = UNIDAD_DEL_CICLO[cuenta.ciclo];
  const cola =
    cuenta.deMas > 0
      ? `Bs ${bs(cuenta.deMas)} más ${unidad} que ${cuenta.contra.nombre} con el add-on aparte`
      : cuenta.deMas === 0
        ? `lo mismo que ${cuenta.contra.nombre} con el add-on aparte`
        : `Bs ${bs(-cuenta.deMas)} menos ${unidad} que ${cuenta.contra.nombre} con el add-on aparte`;
  return `Agente conversacional de WhatsApp incluido (${CONVERSACIONES_INCLUIDAS} conversaciones/mes): ${cola}.`;
}

/**
 * El `resultado` de la tarjeta en el ciclo que se está mostrando.
 *
 * Lo llama la tarjeta CON interruptor (`(sitio)/precios-toggle.tsx`). Las pantallas que muestran
 * el mensual grande —`(sitio)/precios`, `landing-v1`— siguen leyendo `plan.resultado`, que es
 * exactamente esta función en «mensual»: ahí la cuenta mensual es la correcta.
 */
export function resultadoSegunCiclo(plan: Plan, ciclo: CicloDeCuenta): string {
  const cuenta = cuentaVsAddon(plan, ESCALERA, { ciclo });
  return cuenta ? cuentaEnPalabras(cuenta) : plan.resultado;
}

/** El `resultado` de catálogo: el del ciclo mensual, que es el que publica `PLANES`. */
function resultadoDelPlan(plan: Plan): string {
  return resultadoSegunCiclo(plan, "mensual");
}

/** Lo mínimo que hace falta para contestar «¿este plan trae el chatbot adentro?». */
type PlanConChatbot = { readonly nombre: string; readonly chatbotIncluido: boolean };

/**
 * Los planes que traen el chatbot pagado adentro, nombrados como los lee el cliente.
 *
 * Existe para que ninguna pantalla tipee "Full" a mano al contestar si el chatbot está incluido:
 * ése es el dato que se mueve (`whatsappIncluded` en el producto) y el que, tipeado, deja la
 * respuesta vieja cobrándole el add-on a quien ya lo tiene. Devuelve la frase armada porque el día
 * que sean dos planes hay que decir "Full y Grupo", no "Full".
 *
 * 🔴 El universo es `planesPublicados()` —la escalera MAS Grupo / Empresarial— y no `PLANES`.
 * Medido el 2026-09-19 contra onia.com.bo: `enterprise` trae `whatsappIncluded: true` en el
 * catálogo publicado igual que `clinic`, y el sitio lo publica CON SU PRECIO (Bs 2.900/mes, una
 * sección entera en `/precios`, una línea en la home, y el recomendador de `/v1/empezar` se lo
 * propone a todo equipo de 15+). Con el universo puesto en `PLANES` esta función contestaba
 * "Completo" a secas, así que las cuatro superficies que la interpolan remataban con «en los
 * demás planes va aparte, Bs 390/mes» — y Grupo es uno de "los demás". Al que le vendemos el
 * plan más caro le cobrábamos otra vez lo que ya paga adentro, también en el JSON-LD de la home.
 * El dato existía desde antes (`GRUPO.chatbotIncluido`): lo que faltaba era que esta función lo
 * leyera.
 */
/** «A», «A y B», «A, B y C» — el formato con el que se enumera una lista de planes en prosa. */
export function unirConY(nombres: readonly string[]): string {
  if (nombres.length === 0) return "";
  if (nombres.length === 1) return nombres[0];
  return `${nombres.slice(0, -1).join(", ")} y ${nombres[nombres.length - 1]}`;
}

export function nombresConChatbot(planes: readonly PlanConChatbot[] = planesPublicados()): string {
  const nombres = planes.filter((p) => p.chatbotIncluido).map((p) => p.nombre);
  if (nombres.length === 0) return "Ningún plan";
  return unirConY(nombres);
}

/**
 * «trae» o «traen», según cuántos planes nombre `nombresConChatbot()`.
 *
 * Va aparte y no adentro de la frase porque cada superficie la redacta distinto ("X ya trae el
 * chatbot", "Viene incluido en X"), pero las dos leen LA MISMA lista: un sujeto plural con el
 * verbo en singular no es sólo mala gramática — deja ambiguo si el segundo plan también lo trae,
 * que es justo el dato que se está contestando.
 */
export function traeOTraen(planes: readonly PlanConChatbot[] = planesPublicados()): string {
  return planes.filter((p) => p.chatbotIncluido).length > 1 ? "traen" : "trae";
}

/**
 * Todo plan que este sitio PUBLICA con su precio: la escalera comprable y Grupo / Empresarial.
 *
 * `PLANES` es "lo que se compra en línea", que es más chico: Grupo se cotiza por WhatsApp, pero se
 * publica con monto y es tan plan como los otros para cualquier pregunta sobre qué trae adentro.
 * Toda respuesta del tipo "en los demás planes…" tiene que mirar ESTE universo, o le habla a un
 * plan que vendemos como si no existiera.
 *
 * Es una función y no una constante porque `GRUPO` se declara más abajo: así el orden de
 * inicialización del módulo no decide el resultado.
 */
export function planesPublicados(): readonly PlanConChatbot[] {
  return [...PLANES, GRUPO];
}

/** Numerales en palabras, para escribir la cantidad sin tipear el dígito. */
const NUMERAL = ["cero", "un", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho"] as const;

/**
 * Cuántos planes se compran en línea, en palabras: "los ${cuantosPlanes()} planes".
 *
 * Existe porque el sitio afirmaba "en los TRES planes no cobramos implementación" en cuatro
 * lugares —la FAQ de la home, la letra chica de `/precios` y dos pantallas de `/v1`— mientras la
 * escalera C (2026-09-12) sumaba el plan Crece y dejaba CUATRO tarjetas comprables a la vista.
 * La promesa es de plata y la contaba mal: el lead parado en el Crece de Bs 550 leía una
 * enumeración que no lo incluía, justo debajo de las cuatro tarjetas.
 *
 * La cantidad de planes es un dato DERIVADO del catálogo, igual que los montos: ninguna frase la
 * tipea, la lee. Y se devuelve en palabras porque es lo que la prosa necesita — con el dígito
 * suelto el gate que lo vigila no podría distinguir la cura de la recaída.
 */
export function cuantosPlanes(planes: readonly Plan[] = PLANES): string {
  return NUMERAL[planes.length] ?? String(planes.length);
}


/**
 * Grupo / Empresarial (`enterprise` en el codigo). Existe y tiene precio, pero
 * queda FUERA del checkout (CHECKOUT_PLANS = basic, professional, clinic, crece): se
 * cotiza. No se publica como una tarjeta comprable más.
 */
export const GRUPO = {
  nombre: "Grupo / Empresarial",
  // `enterprise` también trae el chatbot pagado adentro (`whatsappIncluded` en el catálogo del
  // producto). Se declara acá porque el recomendador puede proponer Grupo, y sin el dato la
  // pantalla le vendía el add-on aparte a quien ya lo tiene.
  chatbotIncluido: true,
  mensual: 2900,
  anual: 29000,
  implementacionDesde: 3500,
  copy:
    `Para varias razones sociales o un grupo de negocios: mismos límites del ${NOMBRE_DE_PLAN.full} más una implementación acompañada. No se compra en línea — se cotiza con tu caso.`,
} as const;

/**
 * La escalera publicada. El `sinEsto` del Básico se arma ACA y no adentro del literal por una
 * razón concreta: nombra el plan desde el que esas capacidades sí vienen, y ese nombre se deriva
 * de la propia escalera — pedírselo a `PLANES` mientras `PLANES` se construye es un ciclo (lo
 * cazó el gate nuevo con un `Cannot access 'PLANES' before initialization`, no una revisión a
 * ojo). Se le pasa `ESCALERA`, que en este punto ya está inicializada.
 */
export const PLANES: readonly Plan[] = ESCALERA.map((plan) => ({
  ...plan,
  resultado: resultadoDelPlan(plan),
  sinEsto: [
    ...plan.sinEsto,
    ...(plan.id === "basico"
      ? [
          `Agentes de IA (vienen desde ${primerPlanCon("agentes", ESCALERA)})`,
          `Reservas online — como add-on a Bs ${bs(AGENDA_ADDON.mensualAddon)}/mes, o incluidas desde ${primerPlanCon("reservas", ESCALERA)}`,
        ]
      : []),
    /**
     * La restricción de administradores se escribe para TODO plan que no la traiga, derivada del
     * propio campo — no plan por plan. Esa es la diferencia entre cerrar la instancia y cerrar la
     * clase: el escalón que se agregue mañana nace diciéndolo, y el día que el producto le dé
     * `multiAdminIncluded` a un plan más barato, esta línea desaparece sola de los que ya lo
     * tengan y el "desde X" se mueve solo. Si ningún plan lo trajera, no hay nada que decir y la
     * línea no se escribe (en vez de prometer "desde null").
     */
    ...lineaDelChatbot(plan),
    ...lineaDeCoadministradores(plan),
  ],
}));

/** Prueba gratis: lib/subscription/plan-state.ts (TRIAL_DAYS / TRIAL_PLAN). */
const PRUEBA_DIAS = 14;
// Espejo de GRACE_PERIOD_DAYS en el producto: sólo se aplica al trial.
const PRUEBA_GRACIA_DIAS = 1;

/**
 * Con qué plan corre la prueba. NO es el plan que el lead eligió: el producto
 * da de alta toda cuenta con `TRIAL_PLAN = "professional"`
 * (`onia-platform/app/api/auth/register/route.ts:272`), apriete la tarjeta que
 * apriete. Si esto cambia allá, cambia acá — y `prueba-vs-plan.test.ts` obliga
 * a que las tres tarjetas se enteren.
 */
const PRUEBA_PLAN_ID: PlanId = "pro";
const PRUEBA_PLAN = NOMBRE_DE_PLAN[PRUEBA_PLAN_ID];

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
  crece: `${PRUEBA_DIAS} días de prueba sin tarjeta, con el plan ${PRUEBA_PLAN} completo. Al pasar a Crece quedás con lo de esta tarjeta.`,
  pro: `${PRUEBA_DIAS} días de prueba sin tarjeta, corriendo con este mismo plan.`,
  full: `${PRUEBA_DIAS} días de prueba sin tarjeta, con el plan ${PRUEBA_PLAN}. Al pasar a ${NOMBRE_DE_PLAN.full}, fichas y usuarios sin tope.`,
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
  diasDeGracia: PRUEBA_GRACIA_DIAS,
  planQueCorre: PRUEBA_PLAN,
  /**
   * El mismo plan, por su id. Lo necesita toda pantalla que además de NOMBRARLO
   * tenga que preguntarle al catálogo qué enciende — hoy el panel dibujado de
   * /empezar, que muestra la cuenta de la prueba y por eso puede dibujar lo que
   * el Pro trae y el plan de entrada no.
   */
  planQueCorreId: PRUEBA_PLAN_ID,
  copy: `${PRUEBA_DIAS} días de prueba sin poner tarjeta, corriendo con el plan ${PRUEBA_PLAN} completo. Tras ${PRUEBA_GRACIA_DIAS} día adicional de gracia, la cuenta queda en solo lectura: nada se borra de inmediato y tenés ${RETENCION.diasParaExportar} días para exportar tus datos.`,
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

/**
 * El escalón inmediatamente ANTERIOR a un plan. `null` si es el primero.
 *
 * La jerarquía se deriva del PRECIO, no del orden del array ni del campo `paso`: un plan
 * nuevo entra por lo que cuesta, y un array reordenado no puede cambiar quién está abajo
 * de quién. Es la misma cura que `onia-platform/lib/subscription/escalon-de-plan.ts`.
 *
 * Existe desde el 2026-09-17: el downsell del wizard `/empezar` tenía el escalón de abajo
 * TIPEADO en `basico` desde que había tres planes, y la escalera C (2026-09-12) metió el
 * Crece en el medio. El lead al que le quedaba grande el Profesional (Bs 890) leía «hay un
 * plan de entrada de Bs 320 … los agentes de IA no vienen ahí» y nunca se enteraba del
 * escalón de Bs 550 que SÍ los trae. Ningún cruce de precios lo vio nunca: los dos montos
 * salen de esta misma tabla, así que son legítimos — lo tipeado era el sujeto.
 */
export function escalonAnterior(id: PlanId): Plan | null {
  const porPrecio = [...PLANES].sort((a, b) => a.mensual - b.mensual);
  const i = porPrecio.findIndex((p) => p.id === id);
  if (i === -1) {
    throw new Error(`No existe el plan "${id}" en PLANES (lib/pricing.ts).`);
  }
  return i === 0 ? null : porPrecio[i - 1];
}

/**
 * El plan de ENTRADA: el más barato que se vende. Es el «desde Bs N al mes» del
 * hero y, por lo tanto, el piso de lo que la portada puede prometer.
 *
 * Se deriva del PRECIO por el mismo motivo que `escalonAnterior`: el día que
 * entre un escalón más abajo —la escalera C metió el Crece en el medio el
 * 2026-09-12— un `"basico"` tipeado sigue compilando y queda anunciando el plan
 * equivocado.
 *
 * Lo usa el hero para DOS cosas que tienen que hablar del mismo plan: el precio
 * que cita y los módulos que dibuja al lado. Que discreparan es el defecto del
 * 2026-09-19 (ver `(sitio)/modulos-de-la-cuenta.ts`): la línea decía Bs 320 y
 * el panel de abajo dibujaba los agentes, que en ese plan están apagados.
 */
export function planDeEntrada(planes: readonly Plan[] = PLANES): Plan {
  const masBarato = planes.reduce<Plan | null>(
    (menor, p) => (menor === null || p.mensual < menor.mensual ? p : menor),
    null,
  );
  if (!masBarato) {
    throw new Error("No hay ningún plan en PLANES (lib/pricing.ts).");
  }
  return masBarato;
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
/** Cómo se llama el chatbot EN LA CARTA de add-ons (el nombre de producto, no el
 *  resultado que titula su tarjeta). Vive en una constante porque además es el
 *  puente con `ADDON_DE_LA_CAPACIDAD`, más abajo: dos copias del mismo nombre y
 *  el cruce se rompe en silencio el día que alguien renombre una sola.
 *
 *  «Agente conversacional de WhatsApp» desde el 2026-09-28 (decisión de Sergio
 *  Urcullo): se llamaba «Chatbot de WhatsApp con IA», y las respuestas salen de lo
 *  que el negocio cargó, no de un modelo. La IA real se dice concreta donde es
 *  real («entiende las fotos»). Lo vigila `src/app/(sitio)/nombre-del-addon.test.ts`. */
export const CHATBOT_EN_LA_CARTA = "Agente conversacional de WhatsApp";

/**
 * En qué planes se puede sumar gente pagando, y hasta cuántos — DERIVADO de `asientosExtra`.
 *
 * Nombrar un solo plan es como nació el defecto (ver `asientosExtra`): la frase era «En Básico se
 * pueden sumar hasta 3» y mandaba al de Profesional a pagar Bs 1.290 por algo que le costaba
 * Bs 960. Acá los planes NO se tipean: si mañana el producto le pone tope al Crece o le saca el
 * suyo al Básico, esta frase cambia sola.
 *
 * Los planes que no venden asientos (`0`) no se nombran: no es una carencia, es que sus usuarios
 * no tienen tope, y eso ya lo dice su propia tarjeta.
 */
export function alcanceDelUsuarioExtra(planes: readonly Plan[] = PLANES): string {
  const conTope = planes.filter((p) => typeof p.asientosExtra === "number" && p.asientosExtra > 0);
  const sinTope = planes.filter((p) => p.asientosExtra === null);

  const tramos = [
    ...conTope.map((p) => `en ${p.nombre} se pueden sumar hasta ${p.asientosExtra}`),
    sinTope.length > 0
      ? `en ${unirConY(sinTope.map((p) => p.nombre))}, las que necesites`
      : null,
  ].filter((t): t is string => t !== null);

  // Sin ningún plan que los venda, la frase honesta es que no se venden — nunca una lista vacía
  // que se lea como "en , las que necesites".
  if (tramos.length === 0) return "Se suma cuando el plan lo permite.";
  const frase = tramos.join("; ");
  return `${frase.charAt(0).toUpperCase()}${frase.slice(1)}.`;
}

export const ADDONS: readonly AddOn[] = [
  {
    nombre: CHATBOT_EN_LA_CARTA,
    // "Se suma a cualquier plan" hasta el 2026-09-18: un universal que la escalera C volvió falso
    // el 12-sep, cuando `whatsappIncluded` le dio el chatbot ADENTRO a Full y Grupo. Al dueño de un
    // Completo (Bs 1.290) le cobraba Bs 390 por lo que ya paga, y al que evaluaba subir le escondía
    // el mejor argumento: subiendo Bs 400 deja de pagar 390. El plan NO se tipea —sale del catálogo.
    copy: `Contesta al instante a cualquier hora con la información real de tu negocio, entiende las fotos que te mandan y pasa a una persona lo que necesite decisión. Viene incluido en ${nombresConChatbot()}; sobre los demás planes se suma aparte.`,
    precio: precioAddonChatbot(),
    href: "/chatbot",
  },
  {
    nombre: AGENDA_ADDON.nombre,
    // "Incluida en Pro y Full" hasta el 2026-09-13: quedó mintiendo cuando la escalera C le dio
    // `publicBookingIncluded` al Crece. El plan NO se tipea — sale de `primerPlanCon`.
    copy: `Te piden cita solos por tu link público, ${ALCANCE_CON_AGENDA}. Incluida desde ${primerPlanCon("reservas")}.`,
    precio: `Bs ${bs(AGENDA_ADDON.mensualAddon)}/mes en Básico`,
  },
  {
    nombre: USUARIO_EXTRA_ADDON.nombre,
    // "En Básico se pueden sumar hasta 3" hasta el 2026-09-19: la única frase de alcance del
    // add-on nombraba UN plan, y el producto lo vende también en Crece y en Profesional, ahí sin
    // tope. Los planes NO se tipean — salen de `asientosExtra` (ver su cabecera en `Plan`).
    copy: `Una persona más en el sistema. ${alcanceDelUsuarioExtra()}`,
    precio: `Bs ${bs(USUARIO_EXTRA_ADDON.mensualAddon)}/mes por usuario`,
  },
  {
    nombre: "Web del negocio",
    copy: "Tu sitio hecho y publicado por nosotros, con el botón de WhatsApp cableado. Se cotiza y se paga una vez.",
    precio: `Desde Bs ${bs(WEB_DESDE)} · pago único`,
    href: "/servicios/webs",
  },
] as const;

/* ---------- qué se prende aparte y qué exige subir de plan ---------- */

/**
 * Con qué add-on de la carta se compra SUELTA cada capacidad incluida-por-plan, o
 * `null` cuando esa capacidad **sólo** se consigue subiendo de plan.
 *
 * 🔴 **POR QUE EXISTE.** Medido el 2026-09-18 sobre `onia.com.bo` SERVIDA: la sección de
 * add-ons de la portada rotulaba *«Sobre el plan encendés lo que te falta»* y debajo
 * afirmaba **«No hay que saltar de plan para desbloquear una sola»** — un universal sobre
 * el MECANISMO, y falso: de las cuatro capacidades de `CAPACIDADES_INCLUIDAS` sólo DOS se
 * compran sueltas (chatbot y reservas). Los agentes exigen saltar al Crece (Bs 550) y el
 * segundo administrador, al Completo (Bs 1.290) — no hay add-on de ninguno de los dos, y la
 * escalera de la MISMA pantalla, tres secciones más arriba, lo dice con todas las letras
 * («Todo lo del Básico + Agente Recall…», «más de un administrador»). O sea que la pantalla
 * se contradecía sola y el lead que necesitaba una de esas dos elegía el plan equivocado.
 *
 * **Por qué ningún gate podía verlo.** Los cruces de precio validan MONTOS y acá no hay
 * ninguno; `capacidad-incluida.test.ts` prohíbe TIPEAR un nombre de plan junto a la
 * capacidad y esta frase no nombra ni un plan ni una capacidad: habla del mecanismo, en
 * abstracto. Es la misma familia que «el sistema completo» y «todos los módulos», dicha una
 * vez más de costado.
 *
 * **Se declara como Record completo a propósito:** una capacidad nueva en
 * `CAPACIDADES_INCLUIDAS` no compila hasta que alguien conteste de qué lado está. Y el
 * valor no se cree solo: `desbloqueo-que-no-se-tipea.test.ts` exige que todo nombre que se
 * declare acá exista de verdad en `ADDONS`, así que marcar una capacidad como «se compra
 * suelta» sin add-on publicado es rojo, no una absolución escrita a mano.
 */
export const ADDON_DE_LA_CAPACIDAD: Record<CapacidadIncluida, string | null> = {
  agentes: null,
  reservas: AGENDA_ADDON.nombre,
  chatbot: CHATBOT_EN_LA_CARTA,
  coadministradores: null,
};

/**
 * Las capacidades que HOY sólo se consiguen cambiando de plan: no tienen add-on, y hay al
 * menos un plan que no las trae. Si la lista queda vacía —porque todo se compra suelto, o
 * porque todos los planes ya la traen— el universal vuelve a ser cierto y `sinSubirDePlan()`
 * lo dice solo.
 */
export function capacidadesQueExigenSubirDePlan(
  planes: readonly Plan[] = PLANES,
  addonDe: Record<CapacidadIncluida, string | null> = ADDON_DE_LA_CAPACIDAD,
): readonly CapacidadIncluida[] {
  const capacidades = Object.keys(CAPACIDADES_INCLUIDAS) as CapacidadIncluida[];
  return capacidades.filter((capacidad) => {
    if (addonDe[capacidad] !== null) return false;
    const campo = CAPACIDADES_INCLUIDAS[capacidad];
    const laTraen = planes.filter((plan) => plan[campo] === true).length;
    return laTraen > 0 && laTraen < planes.length;
  });
}

/**
 * La cláusula que la sección de add-ons dice sobre el mecanismo, DERIVADA del catálogo.
 *
 * Prohibir el literal viejo no habría servido: se apaga solo el día que la respuesta correcta
 * vuelva a ser ese literal. Lo que se prohíbe es tipear la afirmación —la vigila
 * `app/(sitio)/desbloqueo-que-no-se-tipea.test.ts`, caminando `src/` del disco—, y el texto
 * sale de acá.
 */
export function sinSubirDePlan(
  planes: readonly Plan[] = PLANES,
  addonDe: Record<CapacidadIncluida, string | null> = ADDON_DE_LA_CAPACIDAD,
): string {
  return capacidadesQueExigenSubirDePlan(planes, addonDe).length === 0
    ? "No hay que saltar de plan para desbloquear una sola."
    : "Lo de acá abajo se suma sobre el plan que ya tenés.";
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
    que: "Los mensajes que WhatsApp te cobra",
    // Decía que Meta cobra solo lo que el negocio manda PRIMERO. Desde el 1-oct
    // Meta cobra también las respuestas (Meta, "Upcoming pricing updates").
    detalle: `Si contratás el agente conversacional, los mensajes de WhatsApp te los cobra Meta directo en tu cuenta —desde el ${META_COBRA_RESPUESTAS_DESDE} también las respuestas—: no los facturamos nosotros ni les sumamos nada encima.`,
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
  `${PRUEBA_DIAS} días de prueba sin tarjeta, con el ${PRUEBA_PLAN} completo. Tras ${PRUEBA_GRACIA_DIAS} día adicional de gracia, la cuenta queda en solo lectura: nada se borra de inmediato y tenés ${RETENCION.diasParaExportar} días para exportar tus datos.`,
  // Mismo caso que las dos líneas de arriba, y no viajó: la cantidad de planes también estaba
  // tipeada ("los tres planes") teniendo el catálogo dos pantallas más arriba. La escalera C
  // sumó el Crece y esta frase siguió enumerando tres.
  `En los ${cuantosPlanes()} planes de arriba no cobramos implementación ni migración: el checkout cobra solo el plan. Grupo / Empresarial sí lleva implementación acompañada y se cotiza aparte.`,
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

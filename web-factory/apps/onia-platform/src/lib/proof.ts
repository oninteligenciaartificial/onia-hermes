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

import {
  ALCANCE_CON_AGENDA,
  ALCANCE_CON_FICHA,
  PLANES,
  bs,
} from "@/lib/pricing";
import { CUANTOS_RUBROS } from "@/content/rubros";

/**
 * TIEMPO HASTA OPERAR y TIEMPO HASTA EL PRIMER VALOR — medidos, no estimados.
 *
 * Nota de Sergio Urcullo (plan de cierre 1.0, F3.2): «tiempo 1: hasta
 * producción; tiempo 2: hasta el primer valor — mostrar cuánto tarda».
 *
 * MÉTODO (medido el 2026-09-12, 20:15–20:22 hora La Paz, contra PRODUCCIÓN
 * app.onia.com.bo):
 *  - Org QA real «ZZ QA Bandeja 1.0» (slug zz-qa-bandeja-10, rubro dental,
 *    id cmtyzhm15000201rwvurbplhg), creada ese mismo día con el alta E2E real.
 *  - Playwright Chromium 1440×1000 conduciendo la UI verdadera con la sesión
 *    del dueño. Tipeo a 60 ms/caracter y pausas fijas de 0,5 s por campo: es el
 *    PISO de interacción efectiva — NO incluye tiempo de lectura ni de decisión
 *    humana, así que un dueño real tarda más. Por eso el copy vendible redondea
 *    con margen (25 s medidos → «menos de 5 minutos»: un humano 10× más lento
 *    que la máquina sigue adentro de la promesa).
 *  - TIEMPO 1 = 24,2 s. Desde aterrizar en /onboarding (donde cae el dueño
 *    tras el alta) hasta el panel renderizado. Pasos cronometrados: confirmar
 *    nombre (0,7 s) → datos del negocio, 3 campos (5,3 s) → horarios lun–vie
 *    (3,2 s) → 3 servicios con precio (9,8 s — el paso más caro) → primera
 *    persona del equipo + aplicar (3,0 s) → pantalla «ya está en Onia» → panel
 *    (1,6 s).
 *  - TIEMPO 2 = 21,4 s. Desde el panel (guía de inicio incluida, 3,0 s en
 *    cerrarla) hasta la primera cita creada: pantalla de citas (1,9 s) → modal
 *    (1,4 s) → paciente nuevo inline (7,1 s) → profesional + fecha +
 *    disponibilidad (2,9 s) → horario + motivo + confirmar (5,1 s). El
 *    recordatorio queda programado EN ese mismo instante: columnas
 *    reminder24hSentAt/reminder2hSentAt en NULL y el cron del VPS (cada 15 min)
 *    lo envía solo — verificado en la base y en el crontab.
 *  - Evidencia: capturas de los 16 hitos + timestamps en
 *    /root/capturas-tiempo-valor/ del VPS (tiempos.json).
 *
 * Regla del archivo aplicada: el dato tiene fuente (la medición, con capturas
 * re-ejecutables), y lo que NO se midió no se afirma — el alta previa
 * (registro de la cuenta) no está incluida en TIEMPO 1.
 */
export const TIEMPO_HASTA_OPERAR = {
  /** Piso medido de interacción efectiva, en segundos (24,2 redondeado ↑). */
  medidoSegundos: 25,
  /** PROPUESTA de redondeo vendible — la elige Sergio Urcullo al ver esto. */
  vendible: "menos de 5 minutos",
} as const;

export const TIEMPO_HASTA_PRIMER_VALOR = {
  /** Piso medido, en segundos, ADICIONAL al tiempo 1 (21,4 redondeado ↑). */
  medidoSegundos: 22,
  vendible: "2 minutos más",
} as const;

/**
 * COPY SUGERIDO — SIN CABLEAR a ninguna página: qué número publicar y dónde lo
 * decide Sergio Urcullo viendo la medición. Dos variantes porque la cita es una
 * capacidad que no llega a todos los rubros (`tieneAgenda`): en una página que
 * YA es de un rubro con citas va la directa; en una superficie genérica la
 * salvedad se interpola de `ALCANCE_CON_AGENDA` (pricing.ts), nunca tipeada.
 */
export const COPY_TIEMPO_VALOR = {
  rubroConCitas: `Operando en ${TIEMPO_HASTA_OPERAR.vendible}. Tu primera cita, con su recordatorio programado, en ${TIEMPO_HASTA_PRIMER_VALOR.vendible}.`,
  generica: `Operando en ${TIEMPO_HASTA_OPERAR.vendible}. Y ${ALCANCE_CON_AGENDA}, tu primera cita queda con recordatorio programado en ${TIEMPO_HASTA_PRIMER_VALOR.vendible}.`,
} as const;

/** Fecha en que se consultaron todos los precios de la comparacion. */
export const FECHA_CONSULTA = "30 de julio de 2026";

/** Tipo de cambio usado para pasar los precios en USD a Bs. */
export const TC_NOTA = "Bs 11,89 = USD 1 (tipo de cambio oficial del BCB al 29-jul-2026)";

/** Va al lado de CADA precio de un tercero: un precio ajeno sin fecha no se puede comprobar. */
const CONSULTADO = `consultado el ${FECHA_CONSULTA}`;

/**
 * Estado de una capacidad en un producto.
 * - "si"      lo tiene y funciona
 * - "no"      no lo tiene
 * - "tramite" existe pero todavia no sirve — solo lo usamos con NOSOTROS
 */
export type Estado = "si" | "no" | "tramite";

/**
 * Las tres capacidades que definen la categoria. Ni una mas: es un eje, no una
 * tabla de features.
 *
 * `alcanceOnia` — hasta donde llega ESA capacidad **en Onia**, o `null` si llega
 * a los cinco rubros que el alta entrega. Solo se pinta en nuestra fila: de la
 * competencia publicamos lo que ellos publican, y sus cortes internos no los
 * conocemos.
 *
 * 🔴 **Por que ningun gate podia ver que faltaba.** Los tres instrumentos del
 * eje (capacidad, RUBRO) persiguen la MENCION de la capacidad como TEXTO:
 * `app/capacidad-acotada.test.ts` la busca por su nombre en todo `src/`,
 * `app/capacidad-en-la-enumeracion.test.ts` la busca dentro de una enumeracion y
 * `(sitio)/capacidad-por-rubro.test.ts` sale de las lineas de `PLANES`. Aca la
 * afirmacion **no es texto**: es el dato `estados: { gestion: "si" }`, y el
 * nombre de la capacidad vive en OTRO objeto —este— unido por una clave. La
 * palabra «agenda» no aparece ni una vez al lado del «si», asi que ningun patron
 * de texto puede juntar las dos mitades, por bien escrito que este.
 *
 * Medido el 2026-09-11 contra `origin/master` de `onia-platform`, recorriendo
 * `VERTICAL_PACKS` de los 5 rubros de `RUBROS_ACTIVOS`: `tieneAgenda` y
 * `guardaClientesEnPatients` —el corte del Recall desde `64279ff`— son los dos
 * **false** para `gestios-general` (comercio) y `proveegest-electrico`
 * (importadora). O sea que la tabla les decia «Si» a las dos capacidades a 2 de
 * los 5 rubros donde ninguna existe, en las TRES superficies vivas que la
 * renderizan (`/comparativa`, `/v1/comparativa` y la portada de `/v1`) — y
 * justamente en la pantalla que existe para que nos crean.
 *
 * El alcance se LEE de `lib/pricing.ts`: dos copias de la misma salvedad es como
 * llegaron a convivir cuatro precios del mismo chatbot.
 */
export const EJES = [
  {
    id: "gestion",
    label: "Agenda y ficha del cliente",
    alcanceOnia: ALCANCE_CON_AGENDA,
  },
  { id: "siat", label: "Factura SIAT boliviana", alcanceOnia: null },
  {
    id: "agentes",
    label: "Agentes que trabajan solos",
    alcanceOnia: ALCANCE_CON_FICHA,
  },
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
    precioNota: `gratis, y cumple la ley · ${CONSULTADO}`,
    estados: { gestion: "no", siat: "si", agentes: "no" },
    veredicto:
      "Es un emisor de facturas, no un sistema. Su página oficial no menciona agenda, ficha, recordatorios, caja ni permisos. Cada factura se tipea a mano, una por una.",
  },
  {
    id: "facturadores",
    quien: "Los facturadores bolivianos",
    ejemplos: "Sintic · administraTe · Emizor",
    precio: "Bs 85 – 1.000 / mes",
    precioNota: `Sintic desde 85 · administraTe hasta 1.000 por sucursal · ${CONSULTADO}`,
    estados: { gestion: "no", siat: "si", agentes: "no" },
    veredicto:
      `Facturan y llevan inventario. En sus webs, al ${FECHA_CONSULTA}, no figura agenda ni ficha del paciente: si tu negocio se organiza por citas, esto no lo resuelve.`,
  },
  {
    id: "dental-region",
    quien: "El software dental de la región",
    ejemplos: "Dentiqa · Doctocliq · Clinera.io",
    precio: "Bs 1.058 – 5.695 / mes",
    precioNota: `USD 89 – 479, convertidos · Clinera suma USD 450 de instalación · ${CONSULTADO}`,
    estados: { gestion: "si", siat: "no", agentes: "si" },
    veredicto:
      `Agenda, odontograma e incluso agentes con IA. Pero en sus webs, al ${FECHA_CONSULTA}, no figura factura boliviana: Doctocliq dice que factura en Ecuador, Perú, México, Colombia y República Dominicana; Bolivia no está en la lista.`,
  },
  {
    id: "onia",
    quien: "Onia",
    // «cinco rubros» y no «el rubro dental»: /rubros y /nosotros publican
    // cinco vivos; tres páginas indexables no pueden contestar distinto a la
    // pregunta que decide la compra (auditoría 2026-09-11, R3).
    ejemplos: `una plataforma, ${CUANTOS_RUBROS} rubros andando hoy`,
    // Nuestra propia fila de la comparativa: el rango sale de PLANES. Escrito a
    // mano quedaba viejo el día que cambia un plan, justo en la tabla que un
    // lead usa para compararnos con la competencia.
    precio: `Bs ${bs(Math.min(...PLANES.map((p) => p.mensual)))} – ${bs(
      Math.max(...PLANES.map((p) => p.mensual)),
    )} / mes`,
    // «en /precios» y no «más abajo»: la nota viene del landing viejo donde la
    // tabla de precios seguía a la comparación; en /comparativa no hay nada
    // más abajo (auditoría 2026-09-11, A1).
    precioNota: "precio de lanzamiento, publicado en /precios",
    estados: { gestion: "si", siat: "tramite", agentes: "si" },
    veredicto:
      "Cruza los dos lados — y la factura fiscal todavía no: nuestro emisor está en trámite de homologación ante el SIN. Preferimos que lo leas acá antes de que lo descubras vos.",
    esOnia: true,
  },
] as const;

/**
 * El hallazgo. No es una ventaja de features: es una categoria que nadie ocupa.
 * Sale de ONIA_PRECIOS_COMPETENCIA_20260730.md §Lectura punto 4.
 *
 * 🔴 **Nombra los TRES ejes, y uno de ellos —la factura— nosotros no lo
 * cumplimos todavia** (`siat: "tramite"` en la fila de Onia de aca arriba). Por
 * eso solo se publica JUNTO a `CONTENDIENTES`: con la tabla al lado es el hueco
 * del mercado, con su fuente y con nuestro tramite a la vista; sin la tabla se
 * lee como que Onia lo ocupa entero, que es una promesa falsa. Lo sostiene
 * `app/(sitio)/promesa-en-el-cuerpo.test.ts`, que mide el grafo de imports.
 *
 * Para una superficie donde la tabla no entra —la portada— va `HUECO_PARTIDO`.
 */
export const HUECO = `En los sitios de los proveedores de esta comparación, al ${FECHA_CONSULTA}, no figura un software vendido en Bolivia que cruce agenda + ficha del cliente + factura SIAT.`;

/**
 * El MISMO hallazgo, dicho sin prometer la pata que todavia no tenemos.
 *
 * La portada no puede traer la tabla entera, y sin ella `HUECO` deja de ser un
 * dato para volverse una insinuacion: si "nadie cruza agenda + ficha + factura
 * SIAT" y el parrafo siguiente dice "Onia unifica...", el lead entiende que
 * facturamos. No facturamos: el emisor esta en tramite ante el SIN.
 *
 * Esta forma dice el hueco por sus dos mitades, que es como se ve en los datos,
 * y describe a los OTROS en vez de prometer por nosotros. Es verificable contra
 * `CONTENDIENTES` y su test lo comprueba fila por fila, asi que el dia que
 * alguien del mercado cruce las dos patas la frase se pone en ROJO en vez de
 * quedar mintiendo en la primera pantalla que ve un lead.
 */
export const HUECO_PARTIDO =
  "El que te factura en Bolivia no te agenda. El que te agenda no factura en Bolivia.";

/**
 * El titular del cuadro, DERIVADO de la tabla que va justo debajo.
 *
 * 🔴 **El defecto que lo trajo**, medido el 2026-09-18 sobre `onia.com.bo`
 * servido (build 2026-09-18 02:41 UTC): `/comparativa` abría el cuadro con un
 * `<h2>` tipeado a mano —
 *
 *   «Tres ejes. El que los cruza es uno solo.»
 *
 * — diez líneas arriba de la tabla que lo refuta. Ninguna fila de
 * `CONTENDIENTES` tiene los tres ejes en `"si"`: la nuestra dice
 * `siat: "tramite"`. O sea que la pantalla que existe **para que nos crean**
 * afirmaba un cruce que ella misma desmentía en la fila de al lado, y el lead
 * que leía el titular entendía que el único era Onia.
 *
 * ⚠️ **Por qué ningún gate podía verlo.** `promesa-en-el-cuerpo.test.ts` exime
 * a `/comparativa` a propósito, y su motivo es CIERTO: ahí el lector ve el
 * estado real. Pero esa exención vale para la TABLA —y para `HUECO`, que habla
 * del mercado y se comprueba mirándola—, no para una afirmación de unicidad
 * tipeada al lado, que la tabla no puede corregir. Una exención cuyo motivo es
 * cierto tapa el agujero igual.
 *
 * ⚠️ **La forma que envejece es el CONTEO**, no el texto: «uno solo» no es un
 * precio, ni un nombre de plan, ni la mención de una capacidad, así que es
 * invisible para las tres familias de gates del sitio. Por eso el número sale
 * de acá y no se tipea en ninguna página.
 *
 * Se apaga solo: el día que el emisor se homologue y `siat` pase a `"si"` en
 * nuestra fila, el conteo da 1 y el titular vuelve a ser el de antes sin que
 * nadie toque este archivo. Si mañana alguien del mercado cruza los tres,
 * también.
 */
export function cuantosCruzanTodosLosEjes(
  contendientes: readonly Contendiente[] = CONTENDIENTES,
  ejes: readonly { id: EjeId }[] = EJES,
): number {
  return contendientes.filter((c) => ejes.every((e) => c.estados[e.id] === "si"))
    .length;
}

export function tituloDelCuadro(
  contendientes: readonly Contendiente[] = CONTENDIENTES,
  ejes: readonly { id: EjeId }[] = EJES,
): string {
  const cuantos = cuantosCruzanTodosLosEjes(contendientes, ejes);
  const cantidad = ejes.length === 3 ? "Tres ejes." : `${ejes.length} ejes.`;
  if (cuantos === 0) return `${cantidad} Hoy no los cruza ninguno.`;
  if (cuantos === 1) return `${cantidad} El que los cruza es uno solo.`;
  return `${cantidad} Los cruzan ${cuantos}.`;
}

/**
 * El ledger de honestidad, INTERNO: cada linea es una cosa DEL PRODUCTO que
 * HOY no funciona. Verificado contra ONIA_PLATFORM_ESTRUCTURA_20260730 §3.
 *
 * Es un ledger de producto, no de la empresa: acá van funciones que faltan, no
 * "somos nuevos" ni "no tenemos clientes".
 *
 * 🔴 **NO SE RENDERIZA EN NINGUNA PANTALLA.** Es una lista de lo que falta, y
 * eso está prohibido en toda superficie que el sitio sirva (Sergio,
 * 2026-08-20). Vivió en la comparativa hasta el 2026-09-04 y sobrevivió cinco
 * días en la copia de `/v1`, que responde 200: ahí anunciaba que "el pack del
 * rubro se está construyendo". Queda acá porque el dato es cierto y lo usan los
 * docs internos, no porque se pueda publicar.
 *
 * Lo que SÍ se le dice al que compra vive donde le sirve: la factura fiscal en
 * `/facturacion`, en el bloque fiscal de `/precios` y en el `veredicto` de la
 * fila de Onia de acá arriba. Eso no es enumerar huecos: es la advertencia que
 * evita que alguien compre creyendo que factura.
 *
 * Lo sostiene `app/obra-en-el-cuerpo.test.ts`, que mide el grafo de imports —
 * así que importarlo desde una página pone el gate en ROJO nombrando la cadena.
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
  // La tercera línea («comercio y servicios no tienen pantallas propias… se
  // está construyendo») se retiró el 2026-09-11: quedó FALSA — /rubros publica
  // cinco rubros vivos y vendibles con precio. Era además la mina exacta que
  // este ledger advierte: el día que alguien la cableara, metía «en
  // construcción» a la venta contradiciendo a /rubros.
] as const;

/**
 * Contenido normativo de facturación en línea (SIAT) — fuente ÚNICA.
 *
 * Estaba escrito una sola vez, adentro de
 * app/v1/funciones/facturacion-electronica-siat/page.tsx. Al necesitarlo también
 * el preview (v3) la opción era copiarlo, y copiar un texto FISCAL es
 * exactamente cómo nacieron los cuatro precios vivos del chatbot: dos páginas
 * dicen cosas distintas sobre la misma ley y ninguna se entera. Vive acá; las
 * dos páginas lo LEEN.
 *
 * REGLA DE LA CASA respetada a rajatabla: el SIN ofrece un Portal Web
 * GRATUITO y se dice primero y de frente — el pitch es "no tengas que tipear",
 * jamás "estás obligado a comprarme".
 *
 * Fechas y RND verificadas contra fuentes oficiales el 2026-08-06 (PDF de la
 * RND 102500000036 + nota de prensa del SIN por la RND 102600000007).
 * Si una cifra o una fecha cambia, se cambia ACÁ y no en las páginas.
 */

/**
 * Titular de la página normativa.
 *
 * En PRESENTE a propósito, y no es preferencia de estilo: el sitio se sirve
 * estático y el HTML se queda quieto hasta el próximo deploy, que es manual.
 * Decía *«solo podrán facturar en línea»* —futuro— así que el 1 de octubre se
 * convertía solo en una promesa vencida, publicada tal cual, en la página que
 * existe para captar justo esa búsqueda. Enunciada como norma («desde tal
 * fecha, facturan así») es verdadera antes y después.
 * Vigilado por `(sitio)/plazo-que-vence.test.ts`.
 */
export const SIAT_TITULAR =
  "Desde el 1 de octubre de 2026, miles de negocios en Bolivia facturan únicamente en línea.";

/** La bajada: qué dice la norma, con su número de RND. */
export const SIAT_BAJADA =
  "La RND 102600000007 del SIN fijó el 30 de septiembre de 2026 como último día de transición para los grupos 9° al 12° de contribuyentes — el universo de micro y pequeñas empresas. Desde el 1 de octubre, esos negocios emiten únicamente por su modalidad de facturación en línea asignada.";

export interface SiatBloque {
  titulo: string;
  texto: string;
}

/**
 * El argumento, en tres pasos y en ESTE orden: primero la opción gratuita
 * (honestidad legal tributaria), después qué resuelve un sistema, y recién
 * al final dónde está Onia.
 */
export const SIAT_BLOQUES: readonly SiatBloque[] = [
  {
    titulo: "Lo primero que tenés que saber: podés cumplir GRATIS.",
    texto:
      "El SIN ofrece el Portal Web en Línea, gratuito, donde cualquier contribuyente emite sus facturas tipeándolas una por una en la página de Impuestos. Si tu negocio emite pocas facturas, esa opción cumple la norma y no cuesta nada. Cualquiera que te diga \"estás obligado por ley a comprar un sistema\" te está mintiendo — y con nosotros esa frase no existe.",
  },
  {
    titulo: "Lo que un sistema resuelve no es la obligación: es el re-tipeo.",
    texto:
      "El costo real del portal gratuito es tu tiempo: cada venta se tipea dos veces — una en tu cuaderno o caja, otra en el portal. Con un sistema de gestión conectado, la factura sale de la MISMA venta que ya registraste al cobrar, y tu registro de compras y ventas (RCV), el IVA y el calendario de vencimientos se arman solos. Ese es el trabajo que Onia hace — el cumplimiento ya era tuyo gratis.",
  },
  {
    titulo: "Dónde está Onia en este camino (dicho de frente)",
    texto:
      "Nuestro sistema está registrado ante el SIN como proveedor de facturación y ya corre contra el ambiente de pruebas oficial: emisión individual y masiva, anulaciones, reversiones y operación sin internet. Falta que el SIN autorice el sistema. Mientras la homologación concluye, Onia registra y ordena cada venta, arma tu contabilidad, y emitís por el portal gratuito — sin re-tipear tus números, porque el sistema te los da listos.",
  },
] as const;

/**
 * Dónde está Onia con el SIN, en UNA frase, para las páginas que lo mencionan
 * al pasar y no pueden traer el bloque entero de arriba.
 *
 * Existe porque `/nosotros` lo re-escribía a mano y se comía la mitad: decía
 * *"registrado ante el SIN con las pruebas técnicas de la Fase 1 completadas"*
 * y ahí cortaba, sin el "quedan las etapas formales" que sí está en
 * `SIAT_BLOQUES`. Bajo su h2 —"El sistema corre en producción"— eso se lee como
 * que Onia ya factura, y no factura (`lib/proof.ts`: `siat: "tramite"`).
 *
 * ⚠️ Las dos mitades van JUNTAS o no va ninguna. El logro sin la salvedad es
 * una promesa falsa; la salvedad sin el logro regala el único avance
 * verificable que tenemos. Vigilado por `(sitio)/promesa-fiscal.test.ts`, que
 * exige las dos en este texto y en toda página que afirme el registro.
 *
 * ⚠️ **El logro se escribe como una ACTIVIDAD que corre, nunca como una etapa
 * COMPLETA** (2026-09-19). Hasta hoy los tres textos decían *"ya completó las
 * pruebas técnicas de la Fase 1"* y *"quedan las etapas formales"*, y las dos
 * mitades afirmaban más de lo que nadie midió: **quien cuenta la Fase 1 es el
 * SIN**, y la última lectura de su Listado de Etapas —2026-08-27, en
 * `hermes-content/docs/ONIA_SIAT_ESTADO_HOMOLOGACION.md` §4— dio **0 % general,
 * ninguna etapa cerrada al 100 %** (1.424 de 5.732). Ese mismo doc registra que
 * creer "Fase 1 completa" leyendo nuestro `fase1-state.json` local **ya fue un
 * error una vez**, y que después del 13-sep el marcador del portal sigue sin
 * cotejarse. Y lo que falta no es formal: §9 lo encabeza con *«Autorización del
 * sistema (INICIADO → AUTORIZADO)»*, que es la decisión entera, no un sello.
 *
 * Lo que sí está medido —y es lo que ahora dice el texto— es que el emisor
 * **emite, anula y revierte contra el ambiente de pruebas oficial**. Es la
 * misma disciplina que el resto del sitio: se afirma lo que corre, no lo que
 * un tercero todavía no declaró.
 *
 * Se escribe en minúscula y sin punto final a propósito: entra como cláusula
 * dentro de una oración más larga, no como párrafo suelto.
 */
export const SIAT_ESTADO_ONIA =
  "nuestro emisor de facturación está registrado ante el SIN y ya corre contra el ambiente de pruebas oficial; falta que el SIN autorice el sistema, así que hasta que la homologación concluya emitís por el portal gratuito del SIN, con tus ventas ya cargadas y sin re-tipear";

export interface SiatFaq {
  q: string;
  a: string;
}

export const SIAT_FAQ: readonly SiatFaq[] = [
  {
    q: "¿Cómo sé si mi negocio está en los grupos 9° al 12°?",
    a: "El SIN asignó los grupos por NIT en resoluciones de 2024 (RND 102400000004, 05, 12 y 25). Entrá a tu Oficina Virtual (siat.impuestos.gob.bo) con tu NIT o preguntale a tu contador: ahí figura tu modalidad asignada. No adivines por el rubro — depende del NIT.",
  },
  {
    q: "¿Puedo cumplir gratis?",
    a: "Sí. El SIN ofrece el Portal Web en Línea gratuito, donde emitís factura por factura tipeando los datos a mano. Cumple la norma al 100%. Lo que un sistema como Onia agrega no es el cumplimiento: es no re-tipear — la factura sale sola de tu venta, con tu caja y tu contabilidad conectadas.",
  },
  {
    q: "¿Qué pasa con mi facturación desde el 1 de octubre de 2026?",
    a: "Desde esa fecha los grupos alcanzados solo pueden emitir por su modalidad de facturación en línea asignada (RND 102600000007). Emitir por medios anteriores deja de ser válido para esos contribuyentes.",
  },
  {
    q: "¿Ya hubo prórrogas? ¿Puede haber otra?",
    a: "Hubo dos: la RND 102500000036 movió el plazo a marzo de 2026, y la RND 102600000007 lo movió al 30 de septiembre de 2026. Puede haber otra — nadie lo sabe. Nuestro consejo honesto: no apuestes tu facturación a que la haya.",
  },
  {
    q: "¿Y Onia ya puede emitir facturas en línea?",
    a: "Estamos en trámite: nuestro sistema está registrado ante el SIN como proveedor y ya emite, anula y revierte contra el ambiente de pruebas del SIN, incluida la operación sin internet. Falta que el SIN autorice el sistema. Mientras tanto, con Onia tu venta queda registrada y lista, y emitís por el portal gratuito del SIN — te avisamos apenas la homologación concluya.",
  },
] as const;

/** Las fuentes y el descargo. Nunca se publica el contenido sin esto. */
export const SIAT_FUENTES =
  "Fuentes: RND 102100000011 (Sistema de Facturación), RND 102500000036 y nota de prensa oficial del SIN sobre la RND 102600000007. Verificado el 6 de agosto de 2026. Esto es información general, no asesoría tributaria — tu caso concreto confirmalo con tu contador o en tu Oficina Virtual.";

/* ---------------------------------------------------------------------- */
/* LA GUÍA de una página — "cómo me habilito"                              */
/* ---------------------------------------------------------------------- */

/**
 * El lead magnet (`/guia-facturacion`).
 *
 * Vive ACÁ y no en la página por la misma razón que todo lo de arriba: es
 * texto FISCAL. Si el SIN mueve la fecha por tercera vez (ya van dos: RND
 * 102500000036 y 102600000007), se corrige este archivo y las DOS páginas se
 * enteran solas. Un segundo lugar con los mismos pasos es cómo nacen dos
 * versiones de la misma ley.
 *
 * División de intenciones, deliberada y vigilada:
 *   /facturacion      → QUÉ EXIGE la norma (y ya está publicada y gratis).
 *   /guia-facturacion → CÓMO ME HABILITO, paso por paso. Es la pregunta que
 *                       aparece DESPUÉS de leer la otra.
 *
 * Los 6 pasos son el recorte de cliente del checklist interno
 * `hermes-content/docs/ONIA_SIAT_HABILITAR_FACTURACION_CHECKLIST_2026.md`
 * (camino A, Portal Web en Línea) — el mismo que hicimos con nuestro propio
 * NIT. No se fabricó ninguno.
 *
 * Reglas que le dan la forma y NO se negocian:
 *  · La opción GRATIS va primero, siempre. El pitch nunca es "estás obligado
 *    a comprarme": el SIN tiene portal gratuito y cumple al 100%.
 *  · Cero precios (viven en lib/subscription-plans.ts y lib/pricing.ts).
 *  · Cero testimonios, logos o porcentajes de resultado — hay cero clientes
 *    pagando y no se inventa uno.
 *  · UNA sola línea comercial, al final, después de haber sido útil.
 */

/**
 * El plazo en formato corto, para rótulos donde no entra la oración entera.
 *
 * Es el 1 de octubre, no el 30 de septiembre. Los DOS son ciertos —la RND
 * 102600000007 fija el 30-09 como último día de transición y el 01-10 como
 * primer día de obligación— pero sueltos significan cosas opuestas: un rótulo
 * de una línea se lee como LA fecha límite, y todo el resto del sitio (y
 * `CLAUDE.md`, que lo prohíbe por nombre) titula el 1 de octubre. El matiz
 * completo tiene su lugar y es `SIAT_BAJADA`, que lo explica entero.
 *
 * Existe porque `/guia-facturacion` tipeaba «Plazo · 30-09-2026» en su Kicker
 * mientras su propia bajada, dos líneas abajo, decía «el 1 de octubre»: la
 * pantalla se contradecía a la vista del lead. Era el único texto de plazo de
 * las dos páginas que no salía de este archivo, justo el que encabeza la
 * pantalla, y sobrevivió al gate de tiempo verbal porque no tiene verbo.
 * Vigilado por `(sitio)/plazo-no-se-tipea.test.ts`.
 */
export const SIAT_PLAZO_CORTO = "01-10-2026";

/** Rótulo del plazo. La fecha sale de arriba: acá no se tipea ninguna. */
export const SIAT_GUIA_KICKER = `Plazo · ${SIAT_PLAZO_CORTO}`;

/** Titular de la guía. La promesa entera cabe acá. */
export const SIAT_GUIA_TITULAR =
  "Habilitate para facturar en línea, gratis, en 6 pasos.";

/** La bajada: qué te llevás y qué NO te vamos a vender para dártelo. */
export const SIAT_GUIA_BAJADA =
  "Una hoja: cómo saber si te toca el 1 de octubre y qué hacer, paso por paso, en la Oficina Virtual del SIN. El trámite es gratuito y no necesitás comprar ningún sistema para cumplir.";

/**
 * Paso 0 — el que casi nadie hace y ordena todo lo demás.
 * El grupo lo fija el NIT, no el rubro: es el error más caro de la guía.
 */
export const SIAT_GUIA_PASO_0: SiatBloque = {
  titulo: "Paso 0 — averiguá si te toca a vos.",
  texto:
    "El grupo lo fija tu NIT, no tu rubro. El SIN los asignó por resolución en 2024 (RND 102400000004, 05, 12 y 25). Entrá a siat.impuestos.gob.bo con tu NIT, o preguntale a tu contador: ahí figura la modalidad que te asignaron. No lo deduzcas de lo que hace el negocio de al lado — dos comercios de la misma calle pueden estar en grupos distintos, y el que se equivoca se entera tarde.",
};

export interface SiatPaso {
  titulo: string;
  detalle: string;
}

/**
 * Los 6 pasos de la Oficina Virtual, modalidad Portal Web en Línea.
 *
 * Cada `detalle` dice por qué el paso importa o qué lo traba, no solo qué
 * botón tocar: el valor de la hoja es el orden y las trampas, porque los
 * nombres de las opciones del portal pueden cambiar y el orden no.
 */
export const SIAT_GUIA_PASOS: readonly SiatPaso[] = [
  {
    titulo: "Entrá a la Oficina Virtual",
    detalle:
      "impuestos.gob.bo → «SIAT en Línea», con las credenciales del NIT. Si no las tenés a mano, conseguilas primero: sin eso ninguno de los pasos siguientes existe.",
  },
  {
    titulo: "Revisá que no tengas marcas de riesgo tributario",
    detalle:
      "Es un requisito formal (Art. 19.d). Si hay una observación activa se resuelve primero, y mientras esté ahí el trámite no avanza. Mirarlo hoy y no en la última semana es la diferencia entre resolverlo tranquilo y no llegar.",
  },
  {
    titulo: "Solicitá la autorización de la modalidad",
    detalle:
      "Para emitir a mano desde ya, la modalidad es Portal Web en Línea: no pide sistema propio ni certificado digital, y no cuesta nada. El SIN valida y autoriza. Confirmá en pantalla cuál te habilita, porque la que figure asignada en tu padrón puede ser otra.",
  },
  {
    titulo: "Configurá casa matriz y punto de venta",
    detalle:
      "Casa matriz o sucursal (0), y al menos un punto de venta. Sin un punto de venta configurado no se puede emitir ni la factura de prueba del paso 6.",
  },
  {
    titulo: "Cargá productos, servicios y clientes, y sincronizá catálogos",
    detalle:
      "Actividades, leyendas y unidades de medida salen de las tablas del SIN: hay que sincronizarlas y después homologar cómo se llama lo que vos vendés con el código que el SIN espera. Es el paso más aburrido y el que deja más errores para el final.",
  },
  {
    titulo: "Emití una factura de prueba y verificá tres cosas",
    detalle:
      "Que valide, que llegue el PDF y que el XML quede registrado en el SIN. Las tres. Una emisión que «no dio error» pero no aparece registrada no te sirve el 1 de octubre.",
  },
] as const;

/** Lo que conviene tener sobre la mesa ANTES de empezar. Cinco cosas, ni una más. */
export const SIAT_GUIA_A_MANO: readonly string[] = [
  "Tu NIT y las credenciales de la Oficina Virtual.",
  "La razón social exacta, tal cual figura en el padrón. Sin abreviar.",
  "Tus códigos de actividad económica, los que ya tenés asignados.",
  "El correo del negocio — el que revisás de verdad, no uno viejo.",
  "NIT o CI y razón social de un cliente, para la factura de prueba.",
] as const;

/**
 * Lo que frena. Se deriva de los pasos de arriba, no de estadísticas: no
 * tenemos una muestra de negocios habilitados y no se inventa una.
 */
export const SIAT_GUIA_FRENA: readonly string[] = [
  "Dejarlo para la última semana antes de tu plazo. No es un formulario: son seis pasos y cada uno depende del anterior.",
  "Descubrir una marca de riesgo recién en el paso 3. Se resuelve, pero no en una tarde, y hasta que no se resuelva el trámite queda parado.",
  "Llegar al paso 6 sin los catálogos sincronizados. La prueba no valida, volvés al paso 5 y ya con la fecha encima.",
];

/**
 * La ÚNICA línea comercial de la guía, y va al final, después de haber sido
 * útil. Vende el re-tipeo, jamás el cumplimiento — el cumplimiento ya lo tenía
 * gratis quien está leyendo.
 */
export const SIAT_GUIA_CIERRE =
  "El portal del SIN es gratis y cumple. Lo que cuesta es tipear cada venta dos veces: una al cobrar y otra en el portal. Si querés que la factura salga de la venta que ya registraste, eso es exactamente lo que hacemos.";

export interface SiatEnlace {
  label: string;
  href: string;
}

/** Fuentes oficiales, para que cualquiera verifique sin creernos. */
export const SIAT_GUIA_ENLACES: readonly SiatEnlace[] = [
  {
    label: "SIAT — Portal Web en Línea (modalidad del paso 3)",
    href: "https://siatinfo.impuestos.gob.bo/index.php/informacion/modalidades-facturacion/facturacion-portal-web",
  },
  {
    label: "SIN — SIAT en Línea (por acá se entra)",
    href: "https://www.impuestos.gob.bo/index.php/siat-en-linea/",
  },
] as const;

/**
 * ¿A quién le dice el bot que el chatbot "ya viene adentro", y a quién le cobra los Bs 390?
 *
 * POR QUE EXISTE, medido el 2026-09-12 en este repo. La escalera C le dio al catálogo de
 * onia-platform un booleano nuevo por plan —`whatsappIncluded` (`lib/plan-catalogo.ts`)— y hoy
 * son DOS los planes que traen el chatbot pagado adentro: `clinic` y `enterprise`. El bot afirma
 * eso mismo en su knowledge, palabra por palabra:
 *
 *     "...Bs 1.290 el Completo, que ya trae el chatbot de WhatsApp adentro.
 *      En los otros planes el chatbot va aparte, Bs 390 al mes."
 *
 * Esa ultima frase era la mentira: un universal sobre el COMPLEMENTO abarca al Empresa
 * (Bs 2.900), que trae el chatbot adentro igual que el Completo. Corregida el 2026-09-19 —
 * ahora el texto ENUMERA a quienes se les cobra, que falla del lado seguro.
 *
 * y esa frase no está atada a NADA. `precios-publicos.test.mjs` ata las CIFRAS (cada monto se
 * relee de `pricing.ts` / `subscription-plans.ts` y salta si cambió), pero la inclusión no es una
 * cifra: es un booleano. El día que ese booleano se mueva —agregarle el chatbot al Profesional es
 * exactamente el movimiento que la escalera C invita— el bot va a seguir diciendo "en los otros
 * planes va aparte, Bs 390" y le va a COBRAR el add-on a un cliente que ya lo tiene incluido,
 * con los gates de precio en verde, porque 390 sigue siendo un monto legítimo de `pricing.ts`.
 *
 * Es la misma familia que ya mordió dos veces este mes (el bot cotizando Bs 750/1.500 mientras la
 * fuente decía 890/1.290): lo que el bot afirma vive en un artefacto que se publica a mano, y lo
 * que el producto hace vive en otro repo. Lo que cambia acá es la FORMA del dato — una afirmación
 * estructurada como booleano es invisible a todo gate que busque patrones de texto o montos.
 *
 * ESTE MODULO ES PURO a propósito: recibe el catálogo ya leído y el texto ya resuelto, y no toca
 * red, disco ni `process`. Quien lo llama con las fuentes REALES —el catálogo desde el ref
 * publicado de onia-platform, el knowledge desde el JSON— es `promesa-inclusion.test.mjs`.
 *
 * 🔴 TIENE UN ESPEJO, y editar acá sin copiarlo pone la cadena en rojo a propósito.
 * `web-factory/apps/onia-platform/scripts/promesa-inclusion.mjs` es una copia BYTE A BYTE de este
 * archivo. No es desprolijidad: el sitio lo necesita en su `prebuild`, y el publicador de la
 * landing empaqueta con `git archive` SOLO el subárbol `web-factory/` — así que un `import` que
 * salga de ahí resuelve en el repo y NO resuelve en el stage. Medido el 2026-09-17: el sitio
 * importaba este archivo con `../../../../hermes-content/...`, la cadena y el CI pasaban verdes
 * (acá el hermano existe) y la publicación de onia.com.bo murió dos corridas seguidas con
 * `ERR_MODULE_NOT_FOUND` — trabajo verde de todos los carriles sin llegar al cliente.
 * Los cruza `promesa-inclusion-espejo.test.ts`, que vive del lado del espejo porque es el único
 * lado que viaja al stage.
 */

/**
 * Marcas de que una frase está afirmando que el chatbot viene incluido en el plan.
 *
 * La lista es de INCLUSION, o sea que una redacción nueva que no esté acá no se reconoce. Eso
 * normalmente sería el defecto clásico (fallar abierto ante el sujeto nuevo), pero acá el error
 * cae del lado seguro por construcción: un plan con `whatsappIncluded: true` cuya inclusión no se
 * reconozca queda ACUSADO por `faltaDecirloEnElTexto` —no absuelto—, porque el veredicto se arma
 * exigiendo la marca, no buscando su ausencia. Redacción nueva ⇒ rojo ⇒ alguien la lee.
 */
const MARCAS_DE_INCLUSION = [
  { marca: "ya traen", plural: true },
  { marca: "traen el chatbot", plural: true },
  { marca: "vienen con", plural: true },
  { marca: "incluyen", plural: true },
  { marca: "incluidos", plural: true },
  { marca: "ya trae", plural: false },
  { marca: "trae el chatbot", plural: false },
  { marca: "viene con", plural: false },
  { marca: "viene adentro", plural: false },
  { marca: "adentro", plural: false },
  { marca: "incluido", plural: false },
  { marca: "incluida", plural: false },
  { marca: "incluye", plural: false },
  { marca: "sin costo", plural: false },
  { marca: "sin cargo", plural: false },
  { marca: "de regalo", plural: false },
  { marca: "bonificad", plural: false },
];

/**
 * Cuantificadores que hablan del COMPLEMENTO: los planes que el texto no nombró.
 *
 * No alcanza con reconocerlos: un complemento sólo miente si además AFIRMA que la capacidad se
 * cobra aparte. "En los otros planes, consultanos" no le promete de más a nadie.
 */
const COMPLEMENTO = /(?:en|para|con)\s+(?:los\s+|el\s+)?(?:otros?|demas|resto)(?:\s+de\s+(?:los\s+)?planes)?(?:\s+planes)?/;
// Ojo con la raíz: "incluido" NO empieza con "includ" —es inclu-i-do—, y escribirla así dejó el
// detector mudo ante "no viene incluido" con los tres casos hermanos en verde. La raíz es `inclu`.
const SE_COBRA_APARTE =
  /\b(?:va|van|se\s+suma|se\s+suman|se\s+agrega|se\s+cobra|se\s+cobran|se\s+paga|se\s+pagan|cuesta|cuestan)\b[^.;\n]*\b(?:aparte|adicional|por\s+bs|bs\.?\s*\d)|\baparte\b|\bno\s+(?:vienen?|estan?)\s+inclu(?:id|y)/;

/**
 * ¿El texto afirma que en los planes que NO nombró la capacidad se paga aparte?
 *
 * Es la diferencia entre CALLAR y ABARCAR, y no es sutil: un plan del que el bot no habla no es
 * una mentira, pero uno al que la frase de cierre alcanza por exclusión sí lo es. Medido en
 * producción el 2026-09-19: el bot enumeraba cuatro planes y remataba "En los otros planes el
 * chatbot va aparte, Bs 390 al mes" con el Empresa (Bs 2.900) trayéndolo adentro — Bs 390/mes
 * cobrados de más al lead más grande, con el gate en verde porque sólo miraba los NOMBRADOS.
 *
 * La ventana es la cláusula del cuantificador (corta en la puntuación fuerte) por el mismo
 * motivo que en `planesDadosPorIncluidos`: una ventana más ancha deja que la marca de otra
 * oración absuelva o acuse a quien no corresponde.
 *
 * @param {string} texto
 * @returns {boolean}
 */
export function excluyeAlResto(texto) {
  const plano = normalizar(texto);
  for (const oracion of plano.split(/[.;\n]/)) {
    const m = COMPLEMENTO.exec(oracion);
    if (m && SE_COBRA_APARTE.test(oracion.slice(m.index))) return true;
  }
  return false;
}

/** Sin tildes y en minúsculas: el knowledge se edita a mano y "Básico"/"basico" conviven. */
export function normalizar(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/**
 * Dónde termina cada mención de cada plan, en el texto ya normalizado.
 *
 * Devuelve `[{ plan, desde, hasta }]` ordenado por posición. El label se busca con límites de
 * palabra para que "Crece" no matchee dentro de "crecer" ni "Básico" dentro de otra palabra —
 * el mismo cuidado que en los montos, donde 790 matcheaba dentro de 7900.
 */
/**
 * Un posesivo delante degrada al label a palabra corriente. Nace de un label que además es una
 * palabra del castellano: "Empresa" (enterprise). Medido el 2026-09-24, la frase que la web manda
 * por wa.me —"Quiero consultoría/capacitación en IA para mi empresa"— se leía como una mención
 * del plan y el gate acusaba que le cobramos el add-on a un cliente que ya lo tiene incluido,
 * sobre un texto que no habla de planes.
 *
 * Arreglarlo por el lado del texto era imposible: esa frase es la COPIA EXACTA de la que precarga
 * el link y `campanaExacta` compara el mensaje entero — cambiarle una palabra rompe el match.
 *
 * La exclusión es ESTRECHA a propósito: sólo el posesivo, que en castellano no puede introducir
 * el nombre de un plan. "el Empresa", "plan Empresa" y "Empresa" suelto siguen contando, y hay
 * test que lo exige — si no, esto apagaría el gate en vez de afinarlo.
 */
const POSESIVO = String.raw`\b(?:tu|tus|mi|mis|su|sus|nuestra|nuestras|vuestra|vuestras)\s`;

export function mencionesDePlanes(texto, labels) {
  const plano = normalizar(texto);
  const menciones = [];
  for (const [plan, label] of Object.entries(labels)) {
    const aguja = normalizar(label);
    if (!aguja) continue;
    const re = new RegExp(
      String.raw`(?<!${POSESIVO})(?<![\p{L}\p{N}])${escapar(aguja)}(?![\p{L}\p{N}])`,
      "gu",
    );
    for (const m of plano.matchAll(re)) {
      menciones.push({ plan, desde: m.index, hasta: m.index + aguja.length });
    }
  }
  return menciones.sort((a, b) => a.desde - b.desde);
}

function escapar(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Qué planes da el TEXTO por incluidos.
 *
 * La ventana es la CLAUSULA, no la oración, y eso no es un detalle: el texto real del bot nombra
 * los CUATRO planes en una sola oración —"...Bs 320 el Básico, Bs 550 el Crece, Bs 890 el
 * Profesional y Bs 1.290 el Completo, que ya trae el chatbot adentro"— así que juzgar por oración
 * marcaría los cuatro como incluidos y acusaría a tres planes sanos. En castellano la marca
 * aplica al plan nombrado más cerca hacia atrás; si ese plan viene coordinado con otro ("el
 * Profesional y el Completo ya traen..."), los dos son sujeto.
 */
export function planesDadosPorIncluidos(texto, labels) {
  const plano = normalizar(texto);
  const menciones = mencionesDePlanes(texto, labels);
  const incluidos = new Set();

  for (const { marca, plural } of MARCAS_DE_INCLUSION) {
    let desde = 0;
    for (;;) {
      const pos = plano.indexOf(marca, desde);
      if (pos === -1) break;
      desde = pos + marca.length;

      const previas = menciones.filter((m) => m.hasta <= pos);
      const ultima = previas[previas.length - 1];
      if (!ultima) continue;
      incluidos.add(ultima.plan);

      // Coordinación: "el Profesional y el Completo ya traen...", los dos son sujeto.
      //
      // Lo que decide NO es la puntuación: es el NUMERO DEL VERBO, y esa distinción no es un
      // refinamiento sino la única que funciona. El texto del bot enumera precios —"...Bs 890 el
      // Profesional y Bs 1.290 el Completo, que ya trae el chatbot adentro"— y esa "y" es
      // sintácticamente idéntica a la de una coordinación de sujetos. Mirando la forma se marcaba
      // al Profesional como incluido (medido: rompió 6 de 9 casos). Mirando el verbo, "trae"
      // habla de uno y "traen" de dos.
      //
      // Las marcas sin número propio ("adentro", "sin costo") cuentan como singular a propósito:
      // ante la duda no se arrastra al vecino, y si ese vecino sí traía el chatbot queda acusado
      // por no estar dicho. Del lado seguro.
      const anterior = plural ? previas[previas.length - 2] : null;
      if (anterior) {
        const entre = plano.slice(anterior.hasta, ultima.desde);
        if (/^[\s,]*(y|o|e)\s*(bs\.?\s*[\d.,]+\s*)?(el|la|los|las|plan(es)?)?\s*$/.test(entre)) {
          incluidos.add(anterior.plan);
        }
      }
    }
  }
  return incluidos;
}

/**
 * Cruza la CAPACIDAD (el catálogo del producto) contra la PROMESA (el texto que el bot manda).
 *
 * Son dos fuentes distintas y de repos distintos a propósito: un gate que derivara las dos de un
 * mismo archivo estaría comparando algo consigo mismo y pasaría verde para siempre.
 *
 * @param {object} args
 * @param {Record<string, boolean>} args.incluidoPorPlan  planId → `whatsappIncluded` del catálogo.
 * @param {Record<string, string>}  args.labels           planId → nombre que lee el cliente.
 * @param {string}                  args.texto            lo que el bot dice, ya resuelto.
 * @returns {{problemas: string[], avisos: string[], nombrados: string[]}}
 */
export function revisarPromesaDeInclusion({ incluidoPorPlan, labels, texto }) {
  const problemas = [];
  const avisos = [];

  const nombrados = [...new Set(mencionesDePlanes(texto, labels).map((m) => m.plan))];
  const segunElTexto = planesDadosPorIncluidos(texto, labels);

  for (const plan of nombrados) {
    const loTrae = incluidoPorPlan[plan] === true;
    const elTextoLoDice = segunElTexto.has(plan);

    if (loTrae && !elTextoLoDice) {
      problemas.push(
        `el catálogo dice que "${labels[plan]}" (${plan}) YA TRAE el chatbot incluido, y el texto ` +
          `lo nombra sin decirlo: a ese cliente le estamos cobrando el add-on aparte por algo que ` +
          `su plan ya le da.`,
      );
    }
    if (!loTrae && elTextoLoDice) {
      problemas.push(
        `el texto da por incluido el chatbot en "${labels[plan]}" (${plan}), y el catálogo dice ` +
          `que NO lo trae: es una promesa que el producto no cumple y se descubre cobrando.`,
      );
    }
  }

  // Un plan que trae el chatbot y del que el bot CALLA no es una mentira —no lo cotiza—, pero sí
  // es venta que se deja sobre la mesa, así que se dice sin pintar rojo.
  //
  // Salvo que el texto no calle: si remata con un universal sobre el complemento ("en los otros
  // planes va aparte"), ese plan no nombrado queda ABARCADO por una afirmación falsa, y eso se
  // descubre cobrando. Callar y abarcar se veían igual desde acá, y por eso el aviso decía "no
  // miente" sobre una mentira viva.
  // Y sólo se puede acusar si el texto ANCLA por literal a quién SÍ lo trae: sin ancla no se
  // sabe quiénes son "los demás". El sitio deriva esos nombres de un helper
  // (`nombresConChatbot()`), así que ahí no hay literal que matchear y `segunElTexto` sale
  // vacío — acusar igual convertía en rojo a la forma DERIVADA, que es justo la que el gate
  // hermano del sitio EXIGE. Un detector que empuja al arreglo contrario es peor que no tenerlo.
  const abarcaAlResto = segunElTexto.size > 0 && excluyeAlResto(texto);
  for (const [plan, loTrae] of Object.entries(incluidoPorPlan)) {
    if (!loTrae || nombrados.includes(plan)) continue;

    if (abarcaAlResto) {
      problemas.push(
        `el catálogo dice que "${labels[plan] ?? plan}" (${plan}) YA TRAE el chatbot incluido: ` +
          `el texto no lo nombra y la frase de cierre lo abarca por exclusión, así que le está ` +
          `cobrando el add-on aparte a un cliente que ya lo tiene en su plan.`,
      );
    } else {
      avisos.push(
        `"${labels[plan] ?? plan}" (${plan}) trae el chatbot incluido y el bot no lo nombra: ` +
          `no miente, pero no lo está vendiendo.`,
      );
    }
  }

  return { problemas, avisos, nombrados };
}

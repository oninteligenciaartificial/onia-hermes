#!/usr/bin/env node
// Mide los precios que dice el bot QUE ESTA CORRIENDO, no los del repo. Correr:
//   node hermes-content/deploy/vps-ops/bot/precios-vivos.mjs     (npm run bot:precios-vivos)
//   node hermes-content/deploy/vps-ops/bot/precios-vivos.mjs --self-check
//
// ORIGEN (medido el 2026-09-12, carril chatbot-cola). El carril tiene como objetivo que "el bot
// contesta el precio correcto", y su instrumento de arranque es `simulate.mjs`. Ese dia el
// simulador contesto 3/3 —320 / 550 / 890 / 1.290, la escalera C— y el gate `test:precios-bot`
// estaba verde. Los dos leen el REPO. El bot vivo, medido dentro del contenedor, contestaba:
//
//   $ docker exec onia-center grep 'Te los paso derecho' /tmp/onia-bot/knowledge.json
//   "... arranca en Bs 320 al mes con el plan Basico, Bs 750 el Profesional y Bs 1.500 el
//    Completo. El chatbot de WhatsApp va aparte, Bs 390 al mes."
//
// O sea: a un lead real que preguntaba el precio por WhatsApp, el bot le cotizaba DOS montos que
// ya no existen, se saltaba el plan Crece entero, y le cobraba aparte un chatbot que el plan
// Completo ahora incluye. Con los dos instrumentos del carril en verde.
//
// La causa no es un bug del motor: `knowledge.json` esta en `.gitignore` A PROPOSITO —el bot se
// publica a mano— asi que arreglar el repo NO toca producción, y NINGUN gate miraba la copia
// viva. La escalera C barrio la landing y la plataforma (los dos con pedido de deploy) y dejo al
// bot afuera, callado, porque el bot no tenia quien lo mirara.
//
// Por eso este archivo mide la copia que el PROCESO lee —`/tmp/onia-bot/knowledge.json` dentro
// de `onia-center`, que es de donde corre el bot (rsync desde `/opt/onia/bot`)— y no el repo.
// Un repo verde con produccion vieja es exactamente el falso verde que costo esta vuelta.
//
// ⚠️ CUAL DE LAS DOS CAPAS DE CONOCIMIENTO SE MIDE, porque confundirlas manda a arreglar el
// archivo equivocado (casi pasa el 2026-09-12). El bot tiene DOS fuentes y NO compiten:
//   - `ONIA_BOT_KNOWLEDGE_URL` → `/api/chatbot-knowledge/published?<org>`: el conocimiento POR
//     ORGANIZACION, o sea el bot que un CLIENTE le compro como add-on. Sale de la base.
//   - `/tmp/onia-bot/knowledge.json`: el conocimiento del bot DE VENTA de Onia — el que atiende
//     los inboxes 4 y 5, por donde entra todo desconocido. Es un archivo, y es el sujeto de aca.
// Que la capa correcta es el archivo se verifico MIRANDO lo que el bot mando de verdad, no
// razonandolo: `select content from messages where content like '%Te los paso derecho%'` en la
// base de Chatwoot devolvia el texto con Bs 750 y Bs 1.500, palabra por palabra.
//
// Y el archivo vivo NO viaja con `DESPLEGAR: bot`: `publicar.sh` lo preserva a proposito
// ("nunca borra knowledge.json"). Instalarlo es un segundo comando, a mano:
//   ONIA_BOT_KNOWLEDGE_FILE=/opt/onia/bot/knowledge.onia.json /opt/onia/bot/webhook-server.sh knowledge
// (valida adentro del contenedor antes de aplicar; el bot lo toma en <= 5 min por TTL).
//
// CODIGOS DE SALIDA
//   0  todo monto que el bot vivo dice esta en la fuente unica  → el lead escucha el precio real
//   1  el bot vivo cotiza un monto que ya no existe             → es plata, y la ve el cliente
//   2  no se pudo medir                                         → no medir NO es estar bien
import { spawnSync } from "node:child_process";

import { normalize } from "./guardrails.mjs";
import { MONTOS_PERMITIDOS, PRECIOS_PUBLICOS, montosEnTexto } from "./precios-publicos.mjs";

/** El contenedor donde corre el bot, y la ruta que su proceso lee de verdad. */
export const CONTENEDOR = process.env.ONIA_BOT_CONTENEDOR ?? "onia-center";
/** La copia que el proceso LEE. `/opt/onia/bot` es de donde se copia, no de donde se lee. */
export const RUTA_VIVA = process.env.ONIA_BOT_KNOWLEDGE_VIVO ?? "/tmp/onia-bot/knowledge.json";

/**
 * Todo string del artefacto, a cualquier profundidad. El universo se deriva del ARCHIVO y no de
 * una lista de campos escrita a mano: una FAQ nueva, un titulo o un texto que alguien agregue
 * manana entra solo. Una lista de inclusion falla abierto justo en el sujeto que nadie previo —
 * y este gate nace de un sujeto que nadie estaba mirando.
 */
export function textosDe(valor, salida = []) {
  if (typeof valor === "string") salida.push(valor);
  else if (Array.isArray(valor)) for (const item of valor) textosDe(item, salida);
  else if (valor && typeof valor === "object") for (const item of Object.values(valor)) textosDe(item, salida);
  return salida;
}

/**
 * Los montos con moneda que el artefacto dice y NO estan en la fuente unica. Reusa el mismo
 * `montosEnTexto` y el mismo `normalize` que el guardrail del producto: si esto tuviera su propia
 * copia del lector, podria dar verde con el producto roto y nunca tocarian el mismo codigo.
 */
export function montosVencidos(knowledge) {
  const vencidos = new Map();
  for (const texto of textosDe(knowledge)) {
    for (const monto of montosEnTexto(normalize(texto))) {
      if (MONTOS_PERMITIDOS.has(monto)) continue;
      if (!vencidos.has(monto)) vencidos.set(monto, texto.trim().slice(0, 120));
    }
  }
  return [...vencidos].map(([monto, ejemplo]) => ({ monto, ejemplo }));
}

/** Le pregunta al contenedor. `null` = no pude preguntar; NUNCA se puede leer como "esta bien". */
export function leerKnowledgeVivo({ contenedor = CONTENEDOR, ruta = RUTA_VIVA, correr = spawnSync } = {}) {
  const r = correr("docker", ["exec", contenedor, "cat", "--", ruta], {
    encoding: "utf8",
    timeout: 60_000,
  });
  if (!r || r.error || r.status !== 0) return null;
  return typeof r.stdout === "string" && r.stdout.trim() !== "" ? r.stdout : null;
}

/**
 * El veredicto. Separa los tres estados a proposito: "no pude leer el artefacto" y "el artefacto
 * no cotiza nada raro" se ven igual desde afuera si uno los aplana a un booleano, y esa confusion
 * es como un gate vivo se apaga en silencio cuando cambia de maquina.
 */
export function juzgar(crudo) {
  if (crudo === null) {
    return { codigo: 2, texto: `NO SE PUDO MEDIR — no pude leer ${RUTA_VIVA} en ${CONTENEDOR}` };
  }
  let knowledge;
  try {
    knowledge = JSON.parse(crudo);
  } catch (e) {
    return { codigo: 2, texto: `NO SE PUDO MEDIR — ${RUTA_VIVA} no es JSON valido: ${e.message}` };
  }
  const vencidos = montosVencidos(knowledge);
  if (vencidos.length > 0) {
    const detalle = vencidos.map((v) => `Bs ${v.monto} ("${v.ejemplo}…")`).join(" · ");
    return {
      codigo: 1,
      texto:
        `EL BOT VIVO COTIZA ${vencidos.length} MONTO(S) QUE YA NO EXISTEN: ${detalle}. ` +
        `La fuente unica dice ${[...MONTOS_PERMITIDOS].join(", ")}. ` +
        `Arreglar el repo NO alcanza: ${RUTA_VIVA} se publica a mano (DESPLEGAR: bot).`,
      vencidos,
    };
  }
  return {
    codigo: 0,
    texto: `EL BOT VIVO COTIZA SOLO PRECIOS DE LA FUENTE UNICA — ${PRECIOS_PUBLICOS.length} montos vigentes.`,
    vencidos,
  };
}

// ---------------------------------------------------------------------------
// Self-check: puro, sin red ni docker, para que pueda vivir en la cadena.
// ---------------------------------------------------------------------------

function selfCheck() {
  const casos = [];
  const ok = (cond, nombre) => casos.push({ nombre, ok: Boolean(cond) });

  // El caso REAL que este gate nacio para ver, textual del contenedor el 2026-09-12.
  const vivoViejo = {
    faq: [
      {
        id: "precios",
        body:
          "Te los paso derecho, son públicos: el sistema arranca en Bs 320 al mes con el plan " +
          "Básico, Bs 750 el Profesional y Bs 1.500 el Completo. El chatbot de WhatsApp va " +
          "aparte, Bs 390 al mes.",
      },
    ],
  };
  const viejo = juzgar(JSON.stringify(vivoViejo));
  ok(viejo.codigo === 1, "el artefacto viejo de produccion tiene que dar ROJO");
  ok(
    viejo.vencidos.some((v) => v.monto === 750) && viejo.vencidos.some((v) => v.monto === 1500),
    "tiene que nombrar los DOS montos muertos (750 y 1.500), no solo el primero",
  );

  // La direccion simetrica: el artefacto corregido tiene que dar VERDE, o el gate queda rojo para
  // siempre y lo apagan. Se mide con la escalera C real, no con un fixture inventado.
  const vivoNuevo = {
    faq: [
      {
        id: "precios",
        body:
          "Te los paso derecho, son públicos: el sistema arranca en Bs 320 al mes con el plan " +
          "Básico, Bs 550 el Crece, Bs 890 el Profesional y Bs 1.290 el Completo, que ya trae " +
          "el chatbot de WhatsApp adentro. En los otros planes el chatbot va aparte, Bs 390 al mes.",
      },
    ],
  };
  ok(juzgar(JSON.stringify(vivoNuevo)).codigo === 0, "el artefacto de la escalera C tiene que dar VERDE");

  // El sujeto se deriva del archivo: un monto muerto en un campo que nadie previo tambien cae.
  const campoNuevo = { secciones: { promos: [{ titulo: "Bs 999 por mes" }] } };
  ok(juzgar(JSON.stringify(campoNuevo)).codigo === 1, "un monto muerto en un campo nuevo tiene que caer");

  // Tri-estado: no poder preguntar no es estar bien, y no es lo mismo que estar mal.
  ok(juzgar(null).codigo === 2, "no poder leer el artefacto es 2, nunca 0");
  ok(juzgar("{ esto no es json").codigo === 2, "un artefacto ilegible es 2, nunca 0");

  // `leerKnowledgeVivo` devuelve null —no cadena vacia, no excepcion— cuando docker no contesta.
  ok(leerKnowledgeVivo({ correr: () => ({ status: 1, stdout: "" }) }) === null, "docker que falla es null");
  ok(leerKnowledgeVivo({ correr: () => ({ status: 0, stdout: "   " }) }) === null, "salida vacia es null");
  ok(
    leerKnowledgeVivo({ correr: () => ({ status: 0, stdout: '{"a":1}' }) }) === '{"a":1}',
    "docker que contesta tiene que devolver el crudo",
  );

  // Un texto sin cifras no puede inventar un rojo.
  ok(juzgar(JSON.stringify({ faq: [{ body: "el precio depende de tu volumen" }] })).codigo === 0,
    "un texto sin montos no es un rojo");

  const fallaron = casos.filter((c) => !c.ok);
  for (const c of fallaron) console.error(`  FAIL  ${c.nombre}`);
  console.log(`self-check precios-vivos: ${casos.length - fallaron.length}/${casos.length}`);
  return fallaron.length === 0 ? 0 : 1;
}

// La guarda evita que importar el modulo (el self-check, otro gate) dispare la medicion viva.
if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.includes("--self-check")) {
    process.exit(selfCheck());
  }
  const veredicto = juzgar(leerKnowledgeVivo());
  console.log(veredicto.texto);
  process.exit(veredicto.codigo);
}

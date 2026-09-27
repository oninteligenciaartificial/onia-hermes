#!/usr/bin/env node
// Mide los precios que dice el bot QUE ESTA CORRIENDO, no los del repo. Correr:
//   node hermes-content/deploy/vps-ops/bot/precios-vivos.mjs     (npm run precios:vivos)
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
// ⚠️ SON DOS CAPAS Y SI COMPITEN — corregido el 2026-09-12, midiendo. Aca decia que la fila por
// organizacion era "el bot que un CLIENTE le compro como add-on" y que el archivo era "el que
// atiende los inboxes 4 y 5", o sea que no se pisaban. Es FALSO, y esa frase apagaba la unica
// pregunta que importa: `run-turn.mjs:147` hace `ensureKnowledge({ inboxId })` en TODA
// conversacion y `getKnowledge` devuelve la copia `db` de esa clave apenas exista — `cacheKeyOf`
// keyea `inbox:<id>`, no hay rama "solo add-on". La fila del inbox 4 le gana al archivo para el
// lead de venta.
//   - `ONIA_BOT_KNOWLEDGE_URL` → `/api/chatbot-knowledge/published?inboxId=<n>`: gana si existe.
//     ENCENDIDA en produccion (el proceso vivo declara URL y secreto). Hoy da 404 en 4 y 5, y
//     por eso el lead cae al archivo — el agujero esta a UNA fila publicada de distancia.
//   - `/tmp/onia-bot/knowledge.json`: el archivo, que es lo que se sirve cuando no hay fila.
// Este gate mide LAS DOS. Medir solo el archivo es lo que dejaba la otra firmada en verde sin
// mirarla; y un comentario que AFIRMA que algo no hace falta mirarse es una hipotesis con fecha.
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
import { pathToFileURL } from "node:url";

import { leerCatalogoDeInclusion } from "./catalogo-inclusion.mjs";
import { DEFAULT_CONFIG } from "./config.mjs";
import { fuenteDePlataforma, repoPlataforma } from "./fuente-plataforma.mjs";
import { normalize } from "./guardrails.mjs";
import { applyKnowledge, mergePanelKnowledge } from "./knowledge.mjs";
import { revisarPromesaDeInclusion } from "./promesa-inclusion.mjs";
import { MONTOS_PERMITIDOS, PRECIOS_PUBLICOS, montosEnTexto, soloPreciosPublicos } from "./precios-publicos.mjs";

/** El contenedor donde corre el bot, y la ruta que su proceso lee de verdad. */
export const CONTENEDOR = process.env.ONIA_BOT_CONTENEDOR ?? "onia-center";
/** La copia que el proceso LEE. `/opt/onia/bot` es de donde se copia, no de donde se lee. */
export const RUTA_VIVA = process.env.ONIA_BOT_KNOWLEDGE_VIVO ?? "/tmp/onia-bot/knowledge.json";
/** El puerto donde el webhook contesta `/health` dentro del contenedor (webhook-server.sh). */
export const PUERTO = process.env.ONIA_BOT_PUERTO ?? "3020";

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
 * QUE CONOCIMIENTO TIENE CARGADO el proceso vivo, preguntado a su propio `/health`.
 *
 * ORIGEN (2026-09-12, carril chatbot-cola). Este gate media `/tmp/onia-bot/knowledge.json` y lo
 * firmaba SANO — "17 montos vigentes" — mientras el bot, preguntado por el precio en el widget
 * real, contestaba *"el número exacto te lo pasa Sergio en la demo… no te quiero tirar una cifra"*
 * (conv 49, msg 1088, 2026-09-12 22:48 UTC). O sea: CERO precios al lead, con el gate en verde.
 *
 * ⚠️ La primera version de esta funcion preguntaba por `ONIA_BOT_KNOWLEDGE_FILE` en
 * `/proc/<pid>/environ` y concluia que, al no estar declarada, el bot no abria el archivo. **Eso
 * es falso y se midio el 2026-09-12 23:15 UTC**: `knowledge.mjs` resuelve `DEFAULT_KNOWLEDGE_FILE`
 * contra `import.meta.url` y el bot corre DESDE `/tmp/onia-bot/`, asi que el default YA es la ruta
 * viva. El proceso la lee sin declarar nada — `/health` contestaba `source:"file"`,
 * `path:"/tmp/onia-bot/knowledge.json"`, `lastError:null`, y el `M4_BODY` cargado con los modulos
 * vivos cotizaba la escalera C entera. Preguntar por la variable daba ROJO sobre un bot sano y
 * mandaba a "pasarle la variable al proceso": un arreglo que no arregla nada y que TAPA la causa.
 *
 * La pregunta que si distingue es **que archivo cargo**, y el bot ya la publica: un proceso que no
 * pudo leer el artefacto contesta `source:"code"` — que es exactamente el estado en el que el
 * motor sirve el `M4_BODY` de `config.mjs`, el que no cotiza.
 *
 * Tri-estado, porque los tres casos mandan a lugares distintos:
 *   `null`    no pude preguntar        → no medir NO es estar bien
 *   `source`  distinto de `"file"`     → el proceso no tiene artefacto: medir el archivo es inutil
 *   objeto    lo que cargo             → se compara con lo que este gate mide
 */
export function conocimientoDelProceso({ contenedor = CONTENEDOR, puerto = PUERTO, correr = spawnSync } = {}) {
  const r = correr(
    "docker",
    ["exec", contenedor, "sh", "-c", `wget -q -O - http://127.0.0.1:${puerto}/health`],
    { encoding: "utf8", timeout: 60_000 },
  );
  if (!r || r.error || r.status !== 0 || typeof r.stdout !== "string") return null;
  let salud;
  try {
    salud = JSON.parse(r.stdout);
  } catch {
    return null;
  }
  // Sin el bloque `knowledge` no se midio nada: un /health de otra version NO prueba que el bot
  // este sirviendo el codigo. Aplanarlo a "code" inventaria un rojo.
  const k = salud?.knowledge;
  if (!k || typeof k !== "object") return null;
  return {
    source: typeof k.source === "string" ? k.source : "",
    path: typeof k.path === "string" ? k.path : "",
    lastError: k.lastError ?? null,
    version: typeof k.version === "string" ? k.version : null,
  };
}

/**
 * El veredicto. Separa los tres estados a proposito: "no pude leer el artefacto" y "el artefacto
 * no cotiza nada raro" se ven igual desde afuera si uno los aplana a un booleano, y esa confusion
 * es como un gate vivo se apaga en silencio cuando cambia de maquina.
 *
 * `cargado` es OBLIGATORIO —el resultado de `conocimientoDelProceso()`— y no tiene default a
 * proposito: un parametro opcional habria dejado que el proximo llamador se olvidara de preguntar
 * que sirve el proceso, que es el agujero por el que este gate firmo verde un bot mudo de precios.
 */
export function juzgar(crudo, cargado, panel) {
  if (cargado === undefined || panel === undefined) {
    throw new TypeError("juzgar(crudo, cargado, panel): faltan conocimientoDelProceso() y/o filaPanel()");
  }
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
  // LA FILA DEL PANEL (org interna, F2.1) es PARTE de lo que el lead recibe: el motor la sirve
  // MERGEADA por campo sobre el archivo (knowledge.mjs, mergePanelKnowledge). Se mide con el
  // MISMO lector que el archivo — dos lectores distintos para el mismo hecho es como uno de los
  // dos queda verde solo. `apagada` y `ausente` no son un error: son el estado sin fila.
  let panelDoc = null;
  if (panel.estado === null) {
    return {
      codigo: 2,
      texto:
        `NO SE PUDO MEDIR — no pude preguntar si la org interna tiene fila publicada ` +
        `(ONIA_KNOWLEDGE_URL). Esa fila, si existe, es parte de lo que el lead recibe.`,
      vencidos,
    };
  }
  if (panel.estado === "doc") {
    try {
      panelDoc = JSON.parse(panel.crudo);
    } catch {
      return { codigo: 2, texto: "NO SE PUDO MEDIR — la fila publicada del panel no es JSON valido.", vencidos };
    }
    const vencidosPanel = montosVencidos(panelDoc);
    if (vencidosPanel.length > 0) {
      const detalle = vencidosPanel.map((v) => `Bs ${v.monto} ("${v.ejemplo}…")`).join(" · ");
      return {
        codigo: 1,
        texto:
          `LA FILA PUBLICADA DEL PANEL COTIZA ${vencidosPanel.length} MONTO(S) QUE YA NO EXISTEN: ${detalle}. ` +
          `El motor la sirve mergeada sobre ${RUTA_VIVA}: arreglar el archivo no la toca — se corrige en el editor.`,
        vencidos: vencidosPanel,
      };
    }
  }
  // Un artefacto sano que el proceso no abre no le da el precio a NADIE. Se pregunta DESPUES del
  // contenido a proposito: un monto muerto es rojo aunque nadie lo lea, pero "sano" solo vale si
  // alguien lo lee. Este es el orden que hace que el gate no pueda firmar verde sin lector.
  if (cargado === null) {
    return {
      codigo: 2,
      texto:
        `NO SE PUDO MEDIR — el artefacto no cotiza montos vencidos, pero no pude preguntarle a ` +
        `${CONTENEDOR} que conocimiento tiene cargado su proceso. Un archivo sano que nadie sirve ` +
        `no le da el precio a ningun lead.`,
      vencidos,
    };
  }
  // LO QUE IMPORTA NO ES LA FUENTE (corregido 2026-09-13): exigir source:"file" convertia
  // cualquier publicacion del panel en rojo falso — y el rollback de la v1 nacio de eso. Las
  // fuentes que sirven conocimiento real son "file" (el artefacto) y "panel" (la fila del editor
  // mergeada sobre el artefacto). Lo que sigue siendo rojo es "code": ahi el motor sirve el
  // M4_BODY por defecto de config.mjs, que manda al lead a la demo en vez de darle el precio.
  if (cargado.source !== "file" && cargado.source !== "panel") {
    return {
      codigo: 1,
      texto:
        `EL BOT NO ESTA SIRVIENDO NINGUN CONOCIMIENTO: su /health dice source="${cargado.source}". ` +
        `Con eso el motor sirve el M4_BODY por defecto de config.mjs, que manda al lead a la demo ` +
        `en vez de darle el precio. Publicar ${RUTA_VIVA} no alcanza si el proceso no lo carga: ` +
        `mirar lastError en /health y reiniciar el webhook.`,
      vencidos,
      noLoLee: true,
    };
  }
  if (cargado.source === "file" && cargado.path !== RUTA_VIVA) {
    return {
      codigo: 1,
      texto:
        `EL BOT NO LEE EL ARCHIVO QUE ESTE GATE MIDE: mido ${RUTA_VIVA} y el proceso vivo cargo ` +
        `${cargado.path}. Medir este archivo no dice nada de lo que el lead recibe.`,
      vencidos,
      noLoLee: true,
    };
  }
  if (cargado.lastError) {
    return {
      codigo: 1,
      texto:
        `EL BOT CARGO SU CONOCIMIENTO CON ERROR: ${String(cargado.lastError).slice(0, 300)}. ` +
        `Sirve lo ultimo bueno que tuviera, o el texto de config.mjs, que no cotiza.`,
      vencidos,
      noLoLee: true,
    };
  }
  // Y EL FONDO DEL ASUNTO: ¿la respuesta de precios que este conocimiento produce COTIZA, y solo
  // con cifras de la fuente unica? Se reconstruye el documento EFECTIVO igual que el motor
  // (merge archivo+panel si la fuente es panel) y se le pregunta al MISMO applyKnowledge por el
  // M4_BODY. Un M4 sin cifras es exactamente la conv 49: "no te quiero tirar una cifra" al lead.
  const efectivo = cargado.source === "panel" ? mergePanelKnowledge(knowledge, panelDoc) : knowledge;
  const m4 = String(applyKnowledge(DEFAULT_CONFIG, efectivo)?.script?.M4_BODY ?? "");
  if (!soloPreciosPublicos(normalize(m4)).ok) {
    return {
      codigo: 1,
      texto:
        `EL BOT CONTESTA EL PRECIO SIN CIFRAS: el M4_BODY efectivo (fuente "${cargado.source}") no ` +
        `trae ni un monto de la fuente unica. El lead pregunta "¿cuanto cuesta?" y se va sin precio ` +
        `(conv 49). Falta (o vencio) la FAQ "precios" con la escalera vigente.`,
      vencidos,
      sinCifras: true,
      m4,
    };
  }
  return {
    codigo: 0,
    texto:
      `EL BOT VIVO COTIZA SOLO PRECIOS DE LA FUENTE UNICA — ${PRECIOS_PUBLICOS.length} montos ` +
      `vigentes, y su proceso SIRVE la fuente "${cargado.source}"` +
      `${cargado.version ? ` (version ${cargado.version})` : ""}.`,
    vencidos,
    // El M4_BODY EFECTIVO viaja afuera a proposito: es el unico lugar del repo donde existe el
    // texto de precios que el lead recibe de verdad (archivo + fila del panel, resuelto por el
    // MISMO applyKnowledge del motor). `juzgarInclusion` lo cruza contra el catalogo publicado
    // en vez de volver a derivarlo: dos derivaciones del mismo hecho coinciden solas.
    m4,
  };
}

/**
 * ¿Lo que el bot VIVO dice de "el chatbot ya viene adentro" coincide con el catalogo publicado?
 *
 * POR QUE VIVE ACA Y NO EN `promesa-inclusion.test.mjs`. Ese test ata la misma promesa, pero
 * contra `knowledge.onia.json`, EL ARCHIVO DEL REPO — y el archivo no es lo que el lead recibe:
 * el motor sirve el documento EFECTIVO, con la fila del panel mergeada encima. Medido el
 * 2026-09-18: `/health` del webhook declara `source:"panel"`, o sea que la promesa que llega al
 * lead pasa por una fila de base que ningun gate de repo puede ver. Hoy esa fila trae una sola
 * FAQ (`negocio`) que no habla de planes, asi que las dos fuentes coinciden; el dia que alguien
 * escriba precios desde el panel —que es para lo que el panel existe— la frase del panel GANA,
 * se sirve a los cuatro inboxes, y el test del repo sigue verde.
 *
 * Y la inclusion es justo la promesa que NO se puede atar con cifras: es un booleano
 * (`whatsappIncluded`). Bs 390 sigue siendo un monto legitimo de `pricing.ts` el dia que el
 * Profesional pase a traer el chatbot adentro — el gate de montos no se entera y le cobramos el
 * add-on a quien ya lo paga en su plan.
 *
 * `catalogo` es OBLIGATORIO y `null` NO es verde: un catalogo que no se pudo leer no absuelve a
 * nadie. El llamador que quiera callarlo tiene que pasar `null`, y eso sale NO MEDIDO (2).
 *
 * @param {string|null|undefined} m4 el `m4` que devolvio `juzgar` (el texto vivo, ya resuelto)
 * @param {{incluidoPorPlan:Record<string,boolean>|null, labels:Record<string,string>|null, motivo:string|null}} catalogo
 */
export function juzgarInclusion(m4, catalogo) {
  if (catalogo === undefined) {
    throw new TypeError("juzgarInclusion(m4, catalogo): falta leerCatalogoDeInclusion()");
  }
  // Sin `m4` no hay sujeto — y eso SOLO pasa cuando `juzgar` ya corto por otra causa, que ya
  // grita con su propio codigo. Un caso del self-check ata ese invariante para que esto no se
  // pueda apagar en silencio el dia que alguien agregue una salida temprana con `codigo: 0`.
  if (!m4) return { codigo: 0, texto: null, sinSujeto: true };

  if (!catalogo || catalogo.incluidoPorPlan === null || catalogo.labels === null) {
    return {
      codigo: 2,
      texto:
        `NO SE PUDO MEDIR LA INCLUSION — no pude leer el catalogo publicado de onia-platform: ` +
        `${catalogo?.motivo ?? "sin motivo"}. Sin el, "el Completo ya lo trae adentro" no se ` +
        `puede cruzar contra nada.`,
    };
  }

  const { problemas, avisos, nombrados } = revisarPromesaDeInclusion({
    incluidoPorPlan: catalogo.incluidoPorPlan,
    labels: catalogo.labels,
    texto: m4,
  });

  if (problemas.length > 0) {
    return {
      codigo: 1,
      texto:
        `EL BOT VIVO PROMETE UNA INCLUSION QUE EL CATALOGO NO HACE:\n  - ${problemas.join("\n  - ")}\n` +
        `Se arregla en el texto que el bot SIRVE, que puede ser la fila del panel y no ` +
        `knowledge.onia.json (mirar la fuente que declara /health).`,
    };
  }
  // Cero menciones es cero valor: el cruce se quedo sin sujeto y hay que decirlo, no firmarlo.
  if (nombrados.length === 0) {
    return {
      codigo: 1,
      texto:
        `EL M4 VIVO NO NOMBRA UN SOLO PLAN DEL CATALOGO: el cruce de inclusion se quedo sin ` +
        `sujeto, asi que no esta midiendo lo que cree medir (¿renombraron los planes?).`,
    };
  }
  return {
    codigo: 0,
    texto:
      `inclusion del chatbot: coincide con el catalogo publicado (${nombrados.length} plan(es) ` +
      `nombrado(s))` + (avisos.length > 0 ? `\n  aviso: ${avisos.join("\n  aviso: ")}` : "") + ".",
  };
}

// ---------------------------------------------------------------------------
// La OTRA fuente: la fila publicada POR INBOX, que es la que el lead resuelve primero
// ---------------------------------------------------------------------------
// Medido el 2026-09-12 (carril chatbot-cola). Toda conversacion pasa por
// `run-turn.mjs:147` → `ensureKnowledge({ inboxId })`, y `getKnowledge` devuelve la copia `db`
// de esa clave apenas exista (`cacheKeyOf` keyea `inbox:<id>`). No hay rama "solo para el bot
// que compro un cliente": el inbox ES la clave. Y la fuente esta ENCENDIDA en produccion —
// el proceso vivo declara `ONIA_BOT_KNOWLEDGE_URL` y `BOT_KNOWLEDGE_SECRET`.
//
// `/health` llamaba `knowledgeHealth()` SIN inbox, o sea reportaba el ARCHIVO: el dia que
// alguien publicara la fila del inbox 4, el lead cotizaria de esa fila y este gate seguiria
// firmando "EL BOT VIVO COTIZA SOLO PRECIOS DE LA FUENTE UNICA" sin haberla mirado nunca — falla
// EN VERDE, que es el peor modo. Desde el 2026-09-12 `/health` acepta `?inboxId=N` y resuelve con
// `ensureKnowledgeHealth`, la MISMA funcion que el camino de respuesta, y declara en `alcance`
// que documento midio (`inbox:4` vs `proceso`). ⚠️ Commiteado, NO DESPLEGADO: el bot vivo todavia
// corre el build sin eso, asi que lo de abajo sigue siendo necesario.
//
// Y aunque se despliegue, este gate sigue preguntandole al PRODUCTO directo en vez de creerle a
// /health: son dos fuentes distintas, y un gate que le pregunta al mismo proceso que audita se
// queda sin forma de detectar que ese proceso se equivoca.

/** El contenedor de la base de Chatwoot: Swarm le pega un sufijo, asi que no se puede nombrar. */
export function contenedorChatwootDb({ correr = spawnSync } = {}) {
  const r = correr("docker", ["ps", "--format", "{{.Names}}"], { encoding: "utf8", timeout: 60_000 });
  if (!r || r.error || r.status !== 0 || typeof r.stdout !== "string") return null;
  return r.stdout.split("\n").map((l) => l.trim()).find((l) => l.includes("chatwoot-db")) || null;
}

/**
 * Los inboxes que EXISTEN, derivados de Chatwoot. El universo no puede ser una lista a mano
 * ("4 y 5"): el inbox que alguien cree manana es justo el que nadie iria a mirar. `null` = no
 * pude derivarlo, que no es lo mismo que "no hay ninguno".
 */
export function inboxesVivos({ correr = spawnSync, contenedor } = {}) {
  const db = contenedor ?? contenedorChatwootDb({ correr });
  if (!db) return null;
  const r = correr(
    "docker",
    ["exec", db, "psql", "-U", "postgres", "-d", "onia-chatbot", "-A", "-t", "-c", "select id from inboxes order by id"],
    { encoding: "utf8", timeout: 60_000 },
  );
  if (!r || r.error || r.status !== 0 || typeof r.stdout !== "string") return null;
  const ids = r.stdout.split("\n").map((l) => l.trim()).filter((l) => /^[0-9]+$/.test(l)).map(Number);
  return ids.length > 0 ? ids : null;
}

/**
 * Lo que el producto le contesta al bot para ESE inbox, preguntado con la URL y el secreto del
 * PROCESO VIVO — no con los del repo: si el gate trajera su propia credencial podria medir un
 * destino que el bot no consulta.
 *
 * Tri-estado, porque los tres van a lugares distintos:
 *   `apagada`  el proceso no declara URL/secreto → la fuente no existe, y eso NO es un error
 *   `ausente`  404: no hay fila para ese inbox   → el lead cae al archivo, que ya se mide
 *   `doc`      hay fila                          → ES lo que el lead recibe: hay que medirla
 *   `null`     cualquier otra cosa               → no pude preguntar, y eso nunca es verde
 */
function filaDelProducto({ envUrl, sufijo = "", contenedor = CONTENEDOR, correr = spawnSync }) {
  // El wget NO puede mezclar stderr con el body (era `wget -O - ... 2>&1`): con una fila REAL,
  // el "Connecting to..." de busybox quedaba pegado al JSON y el gate la declaraba ILEGIBLE —
  // latente mientras todo daba 404, mordio el 2026-09-13 con la primera fila publicada. El body
  // va a un archivo; el stderr solo se muestra cuando wget FALLA (ahi vive el "404 Not Found"
  // que distingue 'ausente' de 'no medido').
  const guion =
    'P=$(pgrep -f webhook-server | head -1); [ -n "$P" ] || exit 9; ' +
    "E=$(tr '\\0' '\\n' < /proc/$P/environ); " +
    `U=$(printf %s "$E" | sed -n "s/^${envUrl}=//p" | head -1); ` +
    'S=$(printf %s "$E" | sed -n "s/^BOT_KNOWLEDGE_SECRET=//p" | head -1); ' +
    '[ -n "$U" ] && [ -n "$S" ] || exit 8; ' +
    'T="/tmp/.fila-gate.$$"; ' +
    `ERR=$(wget -O "$T" --header="authorization: Bearer $S" "$U${sufijo}" 2>&1); RC=$?; ` +
    'if [ "$RC" = 0 ]; then cat "$T"; rm -f "$T"; exit 0; fi; ' +
    'rm -f "$T"; printf %s "$ERR"; exit "$RC"';
  const r = correr("docker", ["exec", contenedor, "sh", "-c", guion], { encoding: "utf8", timeout: 60_000 });
  if (!r || r.error) return { estado: null };
  const salida = typeof r.stdout === "string" ? r.stdout : "";
  if (r.status === 8) return { estado: "apagada" };
  if (r.status === 0 && salida.trim() !== "") return { estado: "doc", crudo: salida };
  // wget devuelve != 0 tanto por 404 como por un 500 o un timeout. Aplanarlos a "no hay fila"
  // convertiria una medicion fallida en un verde, que es la familia de bug que este gate persigue.
  if (/server returned error.*\b404\b/i.test(salida)) return { estado: "ausente" };
  return { estado: null };
}

export function filaPublicada({ inbox, contenedor = CONTENEDOR, correr = spawnSync } = {}) {
  return {
    inbox,
    ...filaDelProducto({
      envUrl: "ONIA_BOT_KNOWLEDGE_URL",
      sufijo: `?inboxId=${encodeURIComponent(String(inbox))}`,
      contenedor,
      correr,
    }),
  };
}

/**
 * La fila publicada de la ORG INTERNA (fuente "panel", F2.1), pedida con la URL COMPLETA que el
 * proceso vivo declara en `ONIA_KNOWLEDGE_URL` — query incluida, sin agregar nada. Mismo
 * tri-estado que `filaPublicada`: `apagada` (sin variable) y `ausente` (404) no son errores.
 */
export function filaPanel({ contenedor = CONTENEDOR, correr = spawnSync } = {}) {
  return filaDelProducto({ envUrl: "ONIA_KNOWLEDGE_URL", contenedor, correr });
}

/**
 * El veredicto de las filas publicadas. Mide cada una con el MISMO `montosVencidos` que el
 * archivo: dos lectores distintos para el mismo hecho es como uno de los dos queda verde solo.
 * El peor estado manda — un inbox sano no absuelve al de al lado.
 */
export function juzgarInboxes(filas) {
  if (!Array.isArray(filas) || filas.length === 0) {
    return {
      codigo: 2,
      texto:
        "NO SE PUDO MEDIR — no pude derivar que inboxes existen en Chatwoot, asi que no se que " +
        "fila publicada recibiria un lead. Una lista vacia no es 'ninguna fila'.",
      porInbox: [],
    };
  }
  const porInbox = [];
  for (const fila of filas) {
    if (!fila || fila.estado === null || fila.estado === undefined) {
      porInbox.push({ inbox: fila?.inbox, estado: "no-medido" });
      continue;
    }
    if (fila.estado === "apagada" || fila.estado === "ausente") {
      porInbox.push({ inbox: fila.inbox, estado: fila.estado });
      continue;
    }
    let doc;
    try {
      doc = JSON.parse(fila.crudo);
    } catch {
      porInbox.push({ inbox: fila.inbox, estado: "ilegible" });
      continue;
    }
    porInbox.push({ inbox: fila.inbox, estado: "doc", vencidos: montosVencidos(doc) });
  }
  const conMontosMuertos = porInbox.filter((p) => p.estado === "doc" && p.vencidos.length > 0);
  if (conMontosMuertos.length > 0) {
    const detalle = conMontosMuertos
      .map((p) => `inbox ${p.inbox}: ${p.vencidos.map((v) => `Bs ${v.monto} ("${v.ejemplo}…")`).join(" · ")}`)
      .join(" | ");
    return {
      codigo: 1,
      texto:
        `LA FILA PUBLICADA QUE RECIBE EL LEAD COTIZA MONTOS QUE YA NO EXISTEN — ${detalle}. ` +
        `Esta fila GANA sobre ${RUTA_VIVA}: el motor resuelve por inbox antes que por archivo ` +
        `(run-turn.mjs → ensureKnowledge({inboxId})). Arreglar el archivo no la toca.`,
      porInbox,
    };
  }
  const sinMedir = porInbox.filter((p) => p.estado === "no-medido" || p.estado === "ilegible");
  if (sinMedir.length > 0) {
    return {
      codigo: 2,
      texto:
        `NO SE PUDO MEDIR — ${sinMedir.length} inbox(es) sin veredicto ` +
        `(${sinMedir.map((p) => `${p.inbox}:${p.estado}`).join(", ")}). Una fila que no pude leer ` +
        `puede ser la que le esta cotizando al lead.`,
      porInbox,
    };
  }
  return { codigo: 0, texto: "", porInbox };
}

// ---------------------------------------------------------------------------
// Self-check: puro, sin red ni docker, para que pueda vivir en la cadena.
// ---------------------------------------------------------------------------

function selfCheck() {
  const casos = [];
  const ok = (cond, nombre) => casos.push({ nombre, ok: Boolean(cond) });
  /** El estado que `/health` reporta cuando el proceso SI esta sirviendo el archivo medido. */
  const cargado = (extra = {}) => ({ source: "file", path: RUTA_VIVA, lastError: null, ...extra });
  /** El estado de la fila del panel cuando la fuente no esta encendida (el default historico). */
  const sinPanel = { estado: "apagada" };

  // El caso REAL que este gate nacio para ver, textual del contenedor el 2026-09-12.
  // `status` va porque el motor solo sirve FAQ publicadas: el fixture imita el artefacto real.
  const vivoViejo = {
    faq: [
      {
        id: "precios",
        status: "publicado",
        body:
          "Te los paso derecho, son públicos: el sistema arranca en Bs 320 al mes con el plan " +
          "Básico, Bs 750 el Profesional y Bs 1.500 el Completo. El chatbot de WhatsApp va " +
          "aparte, Bs 390 al mes.",
      },
    ],
  };
  const viejo = juzgar(JSON.stringify(vivoViejo), cargado(), sinPanel);
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
        status: "publicado",
        body:
          "Te los paso derecho, son públicos: el sistema arranca en Bs 320 al mes con el plan " +
          "Básico, Bs 550 el Crece, Bs 890 el Profesional y Bs 1.290 el Completo, que ya trae " +
          "el chatbot de WhatsApp adentro. En el Básico, el Crece y el Profesional el chatbot " +
          "va aparte, Bs 390 al mes.",
      },
    ],
  };
  ok(juzgar(JSON.stringify(vivoNuevo), cargado(), sinPanel).codigo === 0, "el artefacto de la escalera C tiene que dar VERDE");

  // El sujeto se deriva del archivo: un monto muerto en un campo que nadie previo tambien cae.
  const campoNuevo = { secciones: { promos: [{ titulo: "Bs 999 por mes" }] } };
  ok(juzgar(JSON.stringify(campoNuevo), cargado(), sinPanel).codigo === 1, "un monto muerto en un campo nuevo tiene que caer");

  // Tri-estado: no poder preguntar no es estar bien, y no es lo mismo que estar mal.
  ok(juzgar(null, cargado(), sinPanel).codigo === 2, "no poder leer el artefacto es 2, nunca 0");
  ok(juzgar("{ esto no es json", cargado(), sinPanel).codigo === 2, "un artefacto ilegible es 2, nunca 0");

  // `leerKnowledgeVivo` devuelve null —no cadena vacia, no excepcion— cuando docker no contesta.
  ok(leerKnowledgeVivo({ correr: () => ({ status: 1, stdout: "" }) }) === null, "docker que falla es null");
  ok(leerKnowledgeVivo({ correr: () => ({ status: 0, stdout: "   " }) }) === null, "salida vacia es null");
  ok(
    leerKnowledgeVivo({ correr: () => ({ status: 0, stdout: '{"a":1}' }) }) === '{"a":1}',
    "docker que contesta tiene que devolver el crudo",
  );

  // LO QUE IMPORTA (2026-09-13): un artefacto que deja el M4 SIN CIFRAS es la conv 49 — el lead
  // pregunta el precio y se va sin precio. Antes este caso firmaba VERDE ("un texto sin montos no
  // es un rojo"); el rojo por montos muertos sigue siendo de `montosVencidos`, que no lo inventa.
  const mudo = juzgar(JSON.stringify({ faq: [{ id: "precios", status: "publicado", body: "el precio depende de tu volumen" }] }), cargado(), sinPanel);
  ok(mudo.codigo === 1 && mudo.sinCifras === true, "un M4 efectivo sin cifras es ROJO (la conv 49), no verde");
  ok(montosVencidos({ faq: [{ body: "el precio depende de tu volumen" }] }).length === 0,
    "montosVencidos no inventa montos donde no los hay");

  // EL CASO REAL DEL 2026-09-12: artefacto impecable, y el bot sin leerlo. Antes de este bloque
  // salia 0 y firmaba "17 montos vigentes" mientras el lead se iba sin precio.
  const sano = JSON.stringify(vivoNuevo);
  ok(juzgar(sano, cargado({ source: "code" }), sinPanel).codigo === 1, "artefacto sano que el proceso NO cargo tiene que dar ROJO");
  ok(juzgar(sano, cargado({ path: "/otro/knowledge.json" }), sinPanel).codigo === 1, "si el proceso cargo OTRA ruta, medir esta no sirve");
  ok(juzgar(sano, null, sinPanel).codigo === 2, "no poder preguntar que cargo es 2, nunca 0");
  ok(juzgar(sano, cargado(), sinPanel).codigo === 0, "con el proceso sirviendo el archivo medido, verde");
  // El contenido manda sobre el lector: un monto muerto es rojo aunque nadie abra el archivo.
  ok(juzgar(JSON.stringify(vivoViejo), cargado({ source: "code" }), sinPanel).codigo === 1, "monto muerto sigue siendo rojo sin lector");
  // Nadie puede saltearse la pregunta: sin el estado cargado (o sin la fila del panel) el gate
  // TIRA en vez de pasar verde.
  let tiro = false;
  try { juzgar(sano); } catch { tiro = true; }
  ok(tiro, "juzgar sin el estado cargado TIRA — un llamador no puede olvidarse de preguntar");
  tiro = false;
  try { juzgar(sano, cargado()); } catch { tiro = true; }
  ok(tiro, "juzgar sin la fila del panel TIRA — la fuente panel no se puede dejar de mirar");

  // EL FALSO ROJO DEL 2026-09-12, que es por lo que este bloque dejo de preguntar por la variable
  // de entorno. `knowledge.mjs` resuelve `DEFAULT_KNOWLEDGE_FILE` contra `import.meta.url`, y el
  // bot corre DESDE `/tmp/onia-bot/`, asi que el default YA es la ruta viva: el proceso la lee sin
  // declarar `ONIA_BOT_KNOWLEDGE_FILE` en ningun lado. Preguntando por la variable, este gate daba
  // ROJO sobre un bot sano y mandaba a "pasarle la variable al proceso" — un arreglo que no arregla
  // nada y que TAPA la causa real. Medido: /health del daemon decia source:"file" y el M4_BODY
  // vivo cotizaba la escalera C. La pregunta que si distingue es QUE ARCHIVO CARGO.
  ok(
    juzgar(sano, cargado(), sinPanel).codigo === 0,
    "proceso que cargo el archivo SIN declarar la variable es VERDE (el falso rojo del 12-sep)",
  );
  // Y el simetrico que no se puede perder: leerlo y RECHAZARLO no es tenerlo.
  ok(
    juzgar(sano, cargado({ lastError: "RECHAZADO (1): faq[0].body vacio" }), sinPanel).codigo === 1,
    "archivo cargado con lastError es ROJO: el proceso no lo esta sirviendo",
  );

  // -------------------------------------------------------------------------
  // LA FUENTE "PANEL" (2026-09-13): publicar del editor NO puede ser un rojo falso.
  // -------------------------------------------------------------------------
  // El gate exigia source:"file", asi que la PRIMERA fila publicada del panel lo puso rojo con el
  // bot sano — y el rollback de la v1 nacio de ese rojo. Lo que importa no es la fuente: es que el
  // conocimiento EFECTIVO (merge archivo+panel, el mismo del motor) cotice con la fuente unica.
  const filaNegocio = {
    estado: "doc",
    crudo: JSON.stringify({
      schema: "onia.bot.knowledge/1",
      faq: [{ id: "negocio", body: "Tenes 14 dias de prueba", status: "publicado", tags: ["prueba"] }],
    }),
  };
  const sirvePanel = cargado({ source: "panel", path: "panel:http://producto/published" });
  ok(juzgar(sano, sirvePanel, filaNegocio).codigo === 0,
    "fuente panel + fila sana = VERDE: los precios los pone el archivo via merge (el rojo falso del 13-sep)");
  ok(juzgar(sano, sirvePanel, { estado: "ausente" }).codigo === 0,
    "panel sirviendo su ultima copia buena con la fila ya despublicada sigue verde: el merge cae al archivo");
  const filaConMuertos = {
    estado: "doc",
    crudo: JSON.stringify({ faq: [{ id: "negocio", body: "el plan cuesta Bs 750", status: "publicado", tags: ["plan"] }] }),
  };
  ok(juzgar(sano, sirvePanel, filaConMuertos).codigo === 1,
    "una fila del panel con montos muertos es ROJO: el motor la sirve mergeada, arreglar el archivo no la toca");
  ok(juzgar(sano, sirvePanel, { estado: null }).codigo === 2,
    "no poder preguntar por la fila del panel es 2, nunca 0");
  ok(juzgar(sano, sirvePanel, { estado: "doc", crudo: "{ roto" }).codigo === 2,
    "una fila del panel ilegible es 2: no se midio, no se inventa verde");
  ok(juzgar(sano, cargado({ source: "panel", lastError: "RECHAZADO (1): x" }), filaNegocio).codigo === 1,
    "fuente panel con lastError es ROJO igual que el archivo");
  // Y el M4 efectivo se mide MERGEADO: si el archivo pierde la FAQ de precios, ni una fila sana
  // del panel lo salva — el lead se queda sin precio y eso es rojo.
  ok(juzgar(JSON.stringify({ faq: [] }), sirvePanel, filaNegocio).codigo === 1,
    "archivo sin FAQ de precios + panel sin precios = M4 sin cifras = ROJO");

  // `filaPanel` tri-estado, sin red: mismos veredictos que su hermana por inbox.
  const wgetPanel = (status, stdout) => ({ status, stdout });
  ok(filaPanel({ correr: () => wgetPanel(8, "") }).estado === "apagada", "sin ONIA_KNOWLEDGE_URL la fuente esta apagada");
  ok(
    filaPanel({ correr: () => wgetPanel(1, "wget: server returned error: HTTP/1.1 404 Not Found") }).estado === "ausente",
    "un 404 es 'la org interna no publico nada', no un fallo",
  );
  ok(
    filaPanel({ correr: () => wgetPanel(1, "wget: server returned error: HTTP/1.1 500 Internal") }).estado === null,
    "un 500 del panel es NO MEDIDO, nunca ausencia",
  );
  ok(filaPanel({ correr: () => wgetPanel(0, '{"faq":[]}') }).crudo === '{"faq":[]}', "la fila del panel vuelve cruda");

  // `conocimientoDelProceso` tri-estado, sin red: los caminos van a veredictos distintos.
  const salud = (knowledge) => ({ status: 0, stdout: JSON.stringify({ ok: true, knowledge }) });
  ok(conocimientoDelProceso({ correr: () => ({ status: 1, stdout: "" }) }) === null, "docker que falla es null");
  ok(conocimientoDelProceso({ correr: () => ({ status: 0, stdout: "" }) }) === null, "salida vacia es null");
  ok(
    conocimientoDelProceso({ correr: () => ({ status: 0, stdout: "<html>502</html>" }) }) === null,
    "una respuesta que no es JSON es null, nunca un veredicto",
  );
  ok(
    conocimientoDelProceso({ correr: () => ({ status: 0, stdout: '{"ok":true}' }) }) === null,
    "un /health SIN bloque knowledge es null: no se midio, no es 'sirve codigo'",
  );
  // El caso REAL de produccion del 2026-09-12 23:15 UTC, textual.
  const vivo = conocimientoDelProceso({
    correr: () => salud({ source: "file", version: "2026-09-02.2", path: RUTA_VIVA, lastError: null }),
  });
  ok(vivo?.source === "file" && vivo?.path === RUTA_VIVA, "el /health real de produccion se lee tal cual");
  ok(juzgar(sano, vivo, sinPanel).codigo === 0, "y con ese /health el veredicto es VERDE");
  ok(
    conocimientoDelProceso({ correr: () => salud({ source: "code", path: RUTA_VIVA, lastError: null }) })?.source === "code",
    "un proceso que sirve el codigo se reporta como tal",
  );

  // -------------------------------------------------------------------------
  // LA OTRA FUENTE, la que el lead resuelve PRIMERO (agregado 2026-09-12).
  // -------------------------------------------------------------------------
  // El bloque ⚠️ de la cabecera afirmaba que las dos capas "NO compiten" y que la fila por
  // organizacion es "el bot que un CLIENTE le compro". El codigo lo desmiente: `run-turn.mjs:147`
  // hace `ensureKnowledge({ inboxId })` en TODA conversacion, y `getKnowledge` devuelve la copia
  // `db` de esa clave apenas exista — el inbox ES la clave, no hay rama "solo para add-on". O sea
  // que una fila publicada para el inbox 4 le cambia el precio al lead de venta, y este gate,
  // por su propio diseño declarado, no la miraba nunca.
  const conFila = (crudo) => [{ inbox: 4, estado: "doc", crudo }];
  ok(
    juzgarInboxes(conFila(JSON.stringify(vivoViejo))).codigo === 1,
    "una fila publicada con montos muertos es ROJO: es la que el lead recibe",
  );
  ok(
    juzgarInboxes(conFila(JSON.stringify(vivoNuevo))).codigo === 0,
    "la fila publicada con la escalera C es VERDE (la direccion simetrica)",
  );
  ok(
    juzgarInboxes([{ inbox: 4, estado: "ausente" }]).codigo === 0,
    "sin fila publicada el lead cae al archivo, que ya se mide aparte: no es rojo",
  );
  ok(
    juzgarInboxes([{ inbox: 4, estado: "apagada" }]).codigo === 0,
    "la fuente db apagada no es un error: es el estado de hoy",
  );
  ok(juzgarInboxes([{ inbox: 4, estado: null }]).codigo === 2, "no poder preguntar por un inbox es 2, nunca 0");
  ok(juzgarInboxes(null).codigo === 2, "no poder derivar el universo de inboxes es 2, nunca 0");
  ok(juzgarInboxes([]).codigo === 2, "un universo VACIO no es 'todo bien': es no haber medido");
  // El peor de todos manda: un inbox sano no puede absolver al de al lado.
  ok(
    juzgarInboxes([{ inbox: 4, estado: "doc", crudo: JSON.stringify(vivoNuevo) }, { inbox: 5, estado: "doc", crudo: JSON.stringify(vivoViejo) }]).codigo === 1,
    "un inbox sano NO absuelve al hermano con montos muertos",
  );
  ok(
    juzgarInboxes(conFila("{ esto no es json")).codigo === 2,
    "una fila ilegible es 2: no se midio, y no se puede inventar verde",
  );

  // El universo sale de Chatwoot, no de una lista a mano: un inbox nuevo entra solo.
  const psql = (stdout) => ({ status: 0, stdout });
  ok(inboxesVivos({ correr: () => ({ status: 1, stdout: "" }) }) === null, "docker que falla es null, no lista vacia");
  ok(
    JSON.stringify(inboxesVivos({ contenedor: "db", correr: () => psql("4\n5\n7\n") })) === "[4,5,7]",
    "los inboxes se derivan de la tabla, incluido el que nadie previo",
  );
  ok(inboxesVivos({ contenedor: "db", correr: () => psql("   \n") }) === null, "salida sin ids es null, nunca []");

  // `filaPublicada` tri-estado: 404 (no hay fila) y "no pude preguntar" NO son lo mismo.
  const wget = (status, stdout) => ({ status, stdout });
  ok(
    filaPublicada({ inbox: 4, correr: () => wget(1, "wget: server returned error: HTTP/1.1 404 Not Found") }).estado === "ausente",
    "un 404 es 'no hay fila publicada', no un fallo de medicion",
  );
  ok(
    filaPublicada({ inbox: 4, correr: () => wget(1, "wget: server returned error: HTTP/1.1 500 Internal") }).estado === null,
    "un 500 es NO MEDIDO: no se puede leer como ausencia de fila",
  );
  ok(filaPublicada({ inbox: 4, correr: () => wget(8, "") }).estado === "apagada", "sin URL ni secreto la fuente esta apagada");
  ok(
    filaPublicada({ inbox: 4, correr: () => wget(0, '{"faq":[]}') }).crudo === '{"faq":[]}',
    "una fila publicada vuelve cruda, para medirla con el MISMO lector que el archivo",
  );

  // -------------------------------------------------------------------------
  // La INCLUSION del chatbot sobre el texto VIVO. Puro: el catalogo se inyecta.
  // -------------------------------------------------------------------------
  // Ojo: `enterprise` va en los DOS. Este fixture lo omitia, y omitir un plan del catalogo no
  // deja al caso incompleto: lo deja RATIFICANDO el defecto. El Empresa (Bs 2.900) trae el
  // chatbot adentro desde la escalera C, y sin el en la tabla el cierre universal del texto
  // viejo ("En los otros planes...") no tenia a quien mentirle y el self-check firmaba verde
  // sobre la frase que en produccion le cobraba Bs 390/mes de mas al lead mas grande.
  const LABELS = { basic: "Básico", crece: "Crece", professional: "Profesional", clinic: "Completo", enterprise: "Empresa" };
  const cat = (incluidoPorPlan) => ({ incluidoPorPlan, labels: LABELS, motivo: null });
  // Textual del bot vivo desde el 2026-09-19: enumera a quienes se les cobra, en vez de hablar
  // del complemento. El de antes queda abajo como caso ancla del defecto.
  const M4_VIVO =
    "el sistema arranca en Bs 320 al mes con el plan Básico, Bs 550 el Crece, Bs 890 el " +
    "Profesional y Bs 1.290 el Completo, que ya trae el chatbot de WhatsApp adentro. " +
    "En el Básico, el Crece y el Profesional el chatbot va aparte, Bs 390 al mes.";
  const M4_CON_COMPLEMENTO =
    "el sistema arranca en Bs 320 al mes con el plan Básico, Bs 550 el Crece, Bs 890 el " +
    "Profesional y Bs 1.290 el Completo, que ya trae el chatbot de WhatsApp adentro. " +
    "En los otros planes el chatbot va aparte, Bs 390 al mes.";
  const catHoy = cat({ basic: false, crece: false, professional: false, clinic: true, enterprise: true });

  ok(juzgarInclusion(M4_VIVO, catHoy).codigo === 0, "el texto vivo contra el catalogo de hoy: verde");
  ok(
    juzgarInclusion(M4_CON_COMPLEMENTO, catHoy).codigo === 1,
    "el cierre universal abarca al Empresa, que ya lo trae adentro: ROJO",
  );
  ok(
    juzgarInclusion(M4_VIVO, cat({ basic: false, crece: false, professional: true, clinic: true, enterprise: true })).codigo === 1,
    "si el Profesional pasa a traerlo adentro, el texto vivo le sigue cobrando Bs 390: ROJO",
  );
  ok(
    juzgarInclusion(M4_VIVO, cat({ basic: false, crece: false, professional: false, clinic: false, enterprise: false })).codigo === 1,
    "si el Completo deja de traerlo, el texto vivo promete algo que el producto no da: ROJO",
  );
  ok(
    juzgarInclusion(M4_VIVO, { incluidoPorPlan: null, labels: null, motivo: "no encontre el repo" }).codigo === 2,
    "un catalogo ilegible es 2, NUNCA 0: no puede absolver a nadie",
  );
  ok(juzgarInclusion(M4_VIVO, null).codigo === 2, "pasarle null para callarlo tambien es 2, nunca 0");
  ok(
    juzgarInclusion("el precio te lo pasa Sergio en la demo", catHoy).codigo === 1,
    "un M4 que no nombra un solo plan deja el cruce sin sujeto: rojo, no verde",
  );
  let tiroInclusion = false;
  try { juzgarInclusion(M4_VIVO); } catch { tiroInclusion = true; }
  ok(tiroInclusion, "llamarla sin catalogo TIRA: el llamador olvidadizo no puede pasar de largo");

  // EL INVARIANTE que impide que esto se apague en silencio: `juzgarInclusion` se abstiene cuando
  // no hay `m4`, y eso solo es aceptable mientras TODA salida de `juzgar` sin `m4` ya sea != 0.
  // El dia que alguien agregue una salida temprana verde sin `m4`, la inclusion dejaria de
  // medirse sin que nada se ponga rojo — y este caso cae.
  const salidasDeJuzgar = [
    juzgar(JSON.stringify(vivoViejo), cargado(), sinPanel),
    juzgar(JSON.stringify(vivoNuevo), cargado(), sinPanel),
    juzgar(null, cargado(), sinPanel),
    juzgar("{ esto no es json", cargado(), sinPanel),
    juzgar(sano, cargado({ source: "code" }), sinPanel),
    juzgar(sano, cargado({ path: "/otro/knowledge.json" }), sinPanel),
    juzgar(sano, null, sinPanel),
    juzgar(sano, cargado(), sinPanel),
    juzgar(sano, cargado({ lastError: "RECHAZADO (1): faq[0].body vacio" }), sinPanel),
    juzgar(sano, sirvePanel, { estado: null }),
    juzgar(sano, sirvePanel, { estado: "doc", crudo: "{ roto" }),
    juzgar(JSON.stringify({ faq: [] }), sirvePanel, filaNegocio),
  ];
  ok(
    salidasDeJuzgar.every((r) => r.m4 || r.codigo !== 0),
    "ninguna salida VERDE de juzgar puede venir sin m4: ahi la inclusion se apagaria muda",
  );
  ok(
    juzgarInclusion(salidasDeJuzgar.find((r) => !r.m4)?.m4, catHoy).sinSujeto === true,
    "sin m4 la inclusion se abstiene (y el otro veredicto ya grita)",
  );

  const fallaron = casos.filter((c) => !c.ok);
  for (const c of fallaron) console.error(`  FAIL  ${c.nombre}`);
  console.log(`self-check precios-vivos: ${casos.length - fallaron.length}/${casos.length}`);
  return fallaron.length === 0 ? 0 : 1;
}

// La guarda evita que importar el modulo (el self-check, otro gate) dispare la medicion viva.
// `pathToFileURL` y no `file://${argv[1]}` (mismo motivo que espejo-check.mjs): en Windows argv[1]
// viene con `C:\` y la concatenacion no matchea NUNCA — el self-check salia 0 sin correr un caso.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes("--self-check")) {
    process.exit(selfCheck());
  }
  const veredicto = juzgar(leerKnowledgeVivo(), conocimientoDelProceso(), filaPanel());
  // La promesa de INCLUSION del mismo texto vivo. Va acá y no en la cadena `npm test` porque
  // necesita producción (docker + la fila del panel): un gate que exige el entorno pone rojo el
  // merge de todos los carriles por ambiente. Acá ya estamos hablando con producción.
  const inclusion = juzgarInclusion(veredicto.m4, leerCatalogoDeInclusion({ repoPlataforma, fuenteDePlataforma }));
  // Las DOS fuentes, porque el lead resuelve la fila por inbox ANTES que el archivo. Medir una
  // sola deja la otra firmada en verde sin haberla mirado.
  const inboxes = inboxesVivos();
  const porInbox = juzgarInboxes(inboxes === null ? null : inboxes.map((inbox) => filaPublicada({ inbox })));
  console.log(veredicto.texto);
  if (inclusion.texto) console.log(inclusion.texto);
  if (porInbox.texto) console.log(porInbox.texto);
  if (porInbox.codigo === 0) {
    const ausentes = porInbox.porInbox.filter((p) => p.estado === "ausente").map((p) => p.inbox);
    const conDoc = porInbox.porInbox.filter((p) => p.estado === "doc").map((p) => p.inbox);
    console.log(
      `filas publicadas por inbox: ${conDoc.length} con fila (${conDoc.join(", ") || "-"}) · ` +
        `${ausentes.length} sin fila (${ausentes.join(", ") || "-"}) → esos caen al archivo.`,
    );
  }
  process.exit(Math.max(veredicto.codigo, inclusion.codigo, porInbox.codigo));
}

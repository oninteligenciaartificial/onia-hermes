#!/usr/bin/env node
// Mide si el horario que el bot VIVO promete es el de Sergio Urcullo. Correr:
//   node hermes-content/deploy/vps-ops/bot/horario-vivo.mjs     (npm run horario:vivo)
//   node hermes-content/deploy/vps-ops/bot/horario-vivo.mjs --self-check
//
// ORIGEN (medido el 2026-09-17, carril chatbot-cola). El 13-sep se unifico la disponibilidad de
// Sergio Urcullo en `ventanas-de-atencion.mjs`: hasta ese dia el bot OFRECIA los horarios de demo
// del `.py` (lun-vie 14-17 y 20-22, sab 9-15) y PROMETIA un `businessHours` tipeado a mano que
// decia "lun-vie, 9:00-18:00", asi que un mismo mensaje ofrecia un sabado y prometia que solo se
// atiende de lunes a viernes. Ese arreglo quedo cruzado por un gate contra el `.py` — pero los dos
// lados de ese cruce viven en el REPO.
//
// Cuatro dias despues, el bot de produccion le mandaba a la conversacion 49 del inbox 4:
//
//   "¿Cuál te va mejor? A) viernes 18 de septiembre, 14:00 · B) sábado 19 de septiembre, 09:00
//    (Estoy respondiendo automático fuera de horario de oficina. Sergio te confirma en la mañana.)"
//
// Ofrece un sabado a las 09:00 y en el mismo renglon promete "en la mañana", de lunes a viernes.
// Y el archivo que produccion SIRVE seguia trayendo el horario viejo entero:
//
//   docker exec onia-center cat /tmp/onia-bot/knowledge.json
//   -> empresa.horario = {"dias":[1,2,3,4,5],"desde":9,"hasta":18,"frase":"lun-vie, 9:00-18:00"}
//
// POR QUE NO LO VEIA NINGUN GATE. Ese documento no esta en el repo: `knowledge.json` esta
// gitignoreado a proposito (lo instala `deploy-bot.sh` desde `knowledge.onia.json`) y la fila del
// panel vive en la base. Los dos PISAN al codigo por el camino de `knowledge.mjs`, que copia
// `empresa.horario` sobre `businessHours` —dias, desde, hasta y la FRASE— antes de que el motor
// hable. Misma familia que dejo al bot cotizando Bs 750/1.500 una semana con `test:precios-bot`
// en 12/12: un artefacto que produccion sirve y el repo no ve.
//
// La mitad del CODIGO la cierra el deploy; esta mitad no. Un deploy que solo publica los `.mjs`
// deja el archivo viejo vivo, y el archivo GANA — asi que el deploy diria verde con la promesa
// falsa intacta. Por eso el sujeto de este gate son los DOCUMENTOS SERVIDOS, no las fuentes.
//
// QUE ES SUJETO Y QUE NO. Solo los documentos que hablan EN NOMBRE DE ONIA, y los dos se derivan,
// no se nombran: el archivo vivo (que `deploy-bot.sh` instala desde `knowledge.onia.json`) y la
// fila que el proceso pide con su propia `ONIA_KNOWLEDGE_URL` —la de la org interna, que es la que
// reciben los inboxes de venta—. La fila de un CLIENTE no es sujeto: su negocio declara su propio
// horario y contradecir el de Sergio Urcullo ahi es lo correcto, no un defecto.
//
// CODIGOS DE SALIDA
//   0  ningun documento servido contradice la disponibilidad de la fuente unica
//   1  un documento servido promete un horario que no es el de Sergio Urcullo
//   2  no se pudo medir  → no medir NO es estar bien
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { filaPanel, leerKnowledgeVivo } from "./precios-vivos.mjs";
import {
  VENTANAS_ATENCION,
  diasDeAtencion,
  envolventeDeAtencion,
  fraseDeAtencion,
} from "./ventanas-de-atencion.mjs";

/**
 * Lo que la fuente unica dice, en la MISMA forma en la que un documento puede pisarlo.
 * Se deriva de `ventanas-de-atencion.mjs` —el lado con respaldo, ya cruzado contra el `.py`—
 * para que mover una ventana mueva la expectativa sola.
 */
export function horarioDeLaFuente(ventanas = VENTANAS_ATENCION) {
  const { startHour, endHour } = envolventeDeAtencion(ventanas);
  return {
    dias: diasDeAtencion(ventanas),
    desde: startHour,
    hasta: endHour,
    frase: fraseDeAtencion(ventanas),
  };
}

/**
 * El bloque que `knowledge.mjs` copia sobre `businessHours` (ahi: `empresa.horario`). Se lee por
 * esa ruta EXACTA y no por un barrido de texto: lo que decide la promesa es este campo, y un
 * "9:00-18:00" suelto en cualquier otra parte del documento no la cambia.
 */
export function horarioDelDocumento(doc) {
  const horario = doc?.empresa?.horario;
  return horario && typeof horario === "object" && !Array.isArray(horario) ? horario : null;
}

/** Iguales como listas de numeros, sin que el orden del que escribio el documento decida. */
function mismosDias(a, b) {
  if (!Array.isArray(a)) return false;
  const uno = [...a].map(Number).sort((x, y) => x - y);
  const otro = [...b].sort((x, y) => x - y);
  return uno.length === otro.length && uno.every((v, i) => v === otro[i]);
}

/**
 * En que DIFIERE un documento de la fuente. Solo se juzgan los campos que el documento declara:
 * un documento que no dice nada hereda, y heredar es exactamente lo que queremos.
 */
export function diferenciasDeHorario(horario, fuente) {
  const partes = [];
  if (horario.dias !== undefined && !mismosDias(horario.dias, fuente.dias)) {
    partes.push(`dias ${JSON.stringify(horario.dias)} (la fuente: ${JSON.stringify(fuente.dias)})`);
  }
  if (horario.desde !== undefined && Number(horario.desde) !== fuente.desde) {
    partes.push(`abre ${horario.desde} (la fuente: ${fuente.desde})`);
  }
  if (horario.hasta !== undefined && Number(horario.hasta) !== fuente.hasta) {
    partes.push(`cierra ${horario.hasta} (la fuente: ${fuente.hasta})`);
  }
  if (horario.frase !== undefined && String(horario.frase).trim() !== fuente.frase) {
    partes.push(`frase ${JSON.stringify(String(horario.frase))} (la fuente: ${JSON.stringify(fuente.frase)})`);
  }
  return partes;
}

/**
 * El veredicto. `documentos` es `[{de, doc}]` con el documento YA parseado; `doc: null` es
 * ilegible y vale 2, nunca 0 — un documento que no se pudo leer es el que mas podria estar
 * mintiendo. El peor estado manda: un documento sano no absuelve al de al lado.
 */
export function juzgarHorario(documentos, ventanas = VENTANAS_ATENCION) {
  if (!Array.isArray(documentos) || documentos.length === 0) {
    return {
      codigo: 2,
      texto:
        "NO SE PUDO MEDIR — no pude leer ningun documento de los que el bot SIRVE, asi que no se " +
        "que horario le promete a un lead. Cero documentos no es 'ninguno contradice'.",
      hallazgos: [],
    };
  }
  const fuente = horarioDeLaFuente(ventanas);
  const ilegibles = documentos.filter((d) => d?.doc === null || d?.doc === undefined);
  if (ilegibles.length > 0) {
    return {
      codigo: 2,
      texto:
        `NO SE PUDO MEDIR — ${ilegibles.length} documento(s) servido(s) no se pudieron leer: ` +
        `${ilegibles.map((d) => d?.de ?? "?").join(", ")}. Un documento ilegible no es un documento sano.`,
      hallazgos: [],
    };
  }
  const hallazgos = [];
  const inertes = [];
  for (const { de, doc, gobiernaElHorario } of documentos) {
    const horario = horarioDelDocumento(doc);
    if (!horario) continue; // no declara nada: hereda la fuente, que es lo correcto
    const partes = diferenciasDeHorario(horario, fuente);
    if (partes.length === 0) continue;
    // Un documento cuyo `empresa.horario` NO llega al lead no es una promesa rota: desde el
    // 2026-09-18 `mergePanelKnowledge` lo descarta. Se SIGUE NOMBRANDO igual —una excusa muda es
    // como estas clases se reabren— pero como aviso, no como rojo: ponerlo rojo mandaria a
    // editar un dato de produccion que ya no cambia una palabra de lo que el bot dice.
    // El default es JUZGAR (`gobiernaElHorario !== false`): un documento sin marcar es sujeto.
    if (gobiernaElHorario === false) inertes.push({ de, partes });
    else hallazgos.push({ de, partes });
  }
  const avisoInertes =
    inertes.length === 0
      ? ""
      : "\nIgnorado (no llega al lead, `mergePanelKnowledge` lo descarta):\n" +
        inertes.map(({ de, partes }) => `  ${de}: ${partes.join(" · ")}`).join("\n") +
        "\nLa disponibilidad de Onia se cambia en `ventanas-de-atencion.mjs`, no en esa fila.";
  if (hallazgos.length === 0) {
    return {
      codigo: 0,
      texto:
        `EL BOT VIVO PROMETE EL HORARIO DE LA FUENTE — ${documentos.length} documento(s) servido(s), ` +
        `ninguno lo contradice ("${fuente.frase}").${avisoInertes}`,
      hallazgos: [],
      inertes,
    };
  }
  const detalle = hallazgos
    .map(({ de, partes }) => `  ${de}: ${partes.join(" · ")}`)
    .join("\n");
  return {
    codigo: 1,
    texto:
      `EL BOT VIVO PROMETE UN HORARIO QUE NO ES EL DE SERGIO URCULLO — de ${documentos.length} ` +
      `documento(s) servido(s), ${hallazgos.length} pisa(n) \`businessHours\`:\n${detalle}\n` +
      "Eso es lo que lee un lead: `empresa.horario` gana sobre el codigo, asi que publicar solo " +
      "los .mjs deja la promesa vieja viva. El texto se instala con el paso 7 de `deploy-bot.sh` " +
      `(\`webhook-server.sh knowledge\` desde \`knowledge.onia.json\`).${avisoInertes}`,
    hallazgos,
    inertes,
  };
}

/** Parsea sin tirar: un documento roto es `null` (ilegible), que el veredicto trata como 2. */
function parsear(crudo) {
  if (typeof crudo !== "string" || crudo.trim() === "") return null;
  try {
    return JSON.parse(crudo);
  } catch {
    return null;
  }
}

/**
 * Los documentos que el bot SIRVE hoy, por la misma via del camino de respuesta. `apagada` y
 * `ausente` no son errores: son el estado de una fuente que todavia no se uso, y en los dos casos
 * el documento simplemente no existe como sujeto.
 */
/**
 * ¿El bot VIVO ya descarta el `empresa.horario` de la fila del panel? Se le pregunta al codigo
 * que CORRE (`/tmp/onia-bot/knowledge.mjs`), no al del repo: hasta que el deploy llegue, esa fila
 * sigue pisando la promesa y el lead sigue leyendo el horario equivocado. Eximirla antes seria un
 * verde falso — el modo de falla exacto que este gate existe para cerrar.
 *
 * `null` = no se pudo preguntar. El llamador lo trata como "todavia gobierna" (fail-closed): no
 * poder medir nunca puede ABRIR una exencion.
 */
export function guardaDesplegada({ contenedor = "onia-center", correr = spawnSync } = {}) {
  const r = correr(
    "docker",
    ["exec", contenedor, "grep", "-c", "ignoro `empresa.horario` de la fila del panel", "/tmp/onia-bot/knowledge.mjs"],
    { encoding: "utf8", timeout: 60_000 },
  );
  if (!r || r.error) return null;
  // grep -c sale 1 SIN error cuando no hay coincidencias: eso es un "no", no un "no pude".
  if (r.status !== 0 && r.status !== 1) return null;
  return Number(String(r.stdout ?? "").trim()) > 0;
}

export function documentosServidos({
  correr = spawnSync,
  leerArchivo = leerKnowledgeVivo,
  fila = filaPanel,
  guarda = guardaDesplegada,
} = {}) {
  const documentos = [];
  const crudo = leerArchivo({ correr });
  if (crudo !== null) {
    // El archivo es la BASE del merge: su `empresa.horario` sobrevive y llega al lead. Sujeto.
    documentos.push({
      de: "archivo vivo (/tmp/onia-bot/knowledge.json)",
      doc: parsear(crudo),
      gobiernaElHorario: true,
    });
  }

  const panel = fila({ correr });
  if (panel?.estado === "doc") {
    const row = parsear(panel.crudo);
    // La fila envuelve al documento en `data`; si el envoltorio cambia, el documento es el crudo.
    // Su `empresa.horario` deja de gobernar cuando el bot VIVO trae la guarda de
    // `mergePanelKnowledge` (2026-09-18). Mientras el deploy no llegue, sigue siendo sujeto y
    // sigue siendo rojo: es lo que el lead lee HOY. Y si no se pudo preguntar, tambien — no
    // poder medir no abre una exencion.
    documentos.push({
      de: "fila del panel (org interna)",
      doc: row === null ? null : (row.data ?? row),
      gobiernaElHorario: guarda({ correr }) !== true,
    });
  }
  return documentos;
}

async function medirVivo() {
  const documentos = documentosServidos();
  const veredicto = juzgarHorario(documentos);
  console.log(veredicto.texto);
  return veredicto.codigo;
}

function selfCheck() {
  const casos = [];
  const ok = (cond, nombre) => casos.push({ ok: !!cond, nombre });
  const fuente = horarioDeLaFuente();
  const doc = (horario) => [{ de: "fixture", doc: { empresa: { horario } } }];

  // El caso ancla: el documento REAL que produccion servia el 2026-09-17, tal cual.
  const elQueMordio = { dias: [1, 2, 3, 4, 5], desde: 9, hasta: 18, frase: "lun-vie, 9:00-18:00" };
  ok(juzgarHorario(doc(elQueMordio)).codigo === 1, "el horario que produccion servia el 17-sep es ROJO");
  // Se nombran TRES de los cuatro campos, y el que falta importa: `desde: 9` COINCIDE con la
  // fuente, porque la envolvente abre a las 9 (la que abre es el sabado). O sea que el documento
  // que mordio tenia un campo correcto — un gate que cortara en la primera diferencia, o que
  // exigiera que difieran todos, no lo habria contado igual.
  ok(
    juzgarHorario(doc(elQueMordio)).hallazgos[0].partes.length === 3,
    "de ese documento se nombran las tres diferencias, no la primera",
  );
  ok(
    !juzgarHorario(doc(elQueMordio)).hallazgos[0].partes.some((p) => p.startsWith("abre")),
    "y NO se acusa a `desde`, que coincide: el sabado abre a las 9",
  );

  // Un documento que no declara horario HEREDA — y heredar es lo correcto, no un hallazgo.
  ok(juzgarHorario([{ de: "fixture", doc: { empresa: {} } }]).codigo === 0, "empresa sin horario es VERDE");
  ok(juzgarHorario([{ de: "fixture", doc: {} }]).codigo === 0, "documento sin empresa es VERDE");
  ok(juzgarHorario(doc(null)).codigo === 0, "horario null es VERDE (no declara nada)");

  // El documento que repite la fuente es verde: el gate no prohibe declararlo, prohibe MENTIRLO.
  ok(juzgarHorario(doc({ ...fuente })).codigo === 0, "declarar exactamente la fuente es VERDE");
  ok(
    juzgarHorario(doc({ dias: [6, 5, 4, 3, 2, 1], desde: 9, hasta: 22, frase: fuente.frase })).codigo === 0,
    "los dias desordenados son los mismos dias",
  );

  // Cada campo solo: un gate que solo mira la frase deja pasar la mitad que decide.
  ok(juzgarHorario(doc({ dias: [1, 2, 3, 4, 5] })).codigo === 1, "sacar el sabado, solo en dias, es ROJO");
  ok(juzgarHorario(doc({ hasta: 18 })).codigo === 1, "cerrar antes, solo en hasta, es ROJO");
  ok(juzgarHorario(doc({ desde: 14 })).codigo === 1, "abrir despues, solo en desde, es ROJO");
  ok(juzgarHorario(doc({ frase: "lun-vie, 9:00-18:00" })).codigo === 1, "solo la frase vieja es ROJO");

  // La frase se compara sin los espacios de los costados, pero NO se normaliza el contenido:
  // "lun-vie 14:00-17:00" (sin el segundo tramo) es una promesa distinta y tiene que caer.
  ok(juzgarHorario(doc({ frase: ` ${fuente.frase} ` })).codigo === 0, "la frase con espacios al borde es la misma");
  ok(juzgarHorario(doc({ frase: "lun-vie 14:00-17:00" })).codigo === 1, "una frase recortada es ROJO");

  // Un documento sano NO absuelve al de al lado.
  const mezcla = [
    { de: "sano", doc: { empresa: {} } },
    { de: "miente", doc: { empresa: { horario: elQueMordio } } },
  ];
  ok(juzgarHorario(mezcla).codigo === 1, "un documento sano no absuelve al que miente");
  ok(juzgarHorario(mezcla).hallazgos.length === 1 && juzgarHorario(mezcla).hallazgos[0].de === "miente", "nombra al culpable");

  // Tri-estado en las dos puntas: no medir nunca es 0.
  ok(juzgarHorario([]).codigo === 2, "cero documentos es 2, nunca 0");
  ok(juzgarHorario([{ de: "x", doc: null }]).codigo === 2, "un documento ilegible es 2, nunca 0");
  ok(juzgarHorario(null).codigo === 2, "una lista que no se pudo armar es 2, nunca 0");
  ok(
    juzgarHorario([{ de: "x", doc: null }, { de: "y", doc: { empresa: { horario: elQueMordio } } }]).codigo === 2,
    "ilegible manda sobre rojo: no se puede concluir con un documento sin leer",
  );

  // `empresa.horario` es la ruta que lee el producto: un texto suelto en otro campo no decide.
  const sueltoEnOtroCampo = [{ de: "fixture", doc: { faq: [{ body: "Atendemos lun-vie, 9:00-18:00" }] } }];
  ok(juzgarHorario(sueltoEnOtroCampo).codigo === 0, "un horario en prosa no pisa businessHours");
  ok(horarioDelDocumento({ empresa: { horario: "lun-vie" } }) === null, "un horario que no es objeto no se juzga");

  // La expectativa se DERIVA: mover una ventana mueve el veredicto sin tocar este archivo.
  const otras = { 1: [[8, 12]] };
  ok(juzgarHorario(doc(horarioDeLaFuente(otras)), otras).codigo === 0, "la fuente de OTRAS ventanas es verde con ellas");
  ok(juzgarHorario(doc(horarioDeLaFuente(otras))).codigo === 1, "y es ROJA contra las ventanas de verdad");

  // El lector: apagada/ausente no son documentos, y un archivo ilegible SI es un sujeto (vale 2).
  const sinNada = documentosServidos({ leerArchivo: () => null, fila: () => ({ estado: "ausente" }) });
  ok(sinNada.length === 0, "sin archivo y sin fila no hay sujetos");
  ok(juzgarHorario(sinNada).codigo === 2, "y eso es NO MEDIDO, nunca verde");
  const rotoElArchivo = documentosServidos({ leerArchivo: () => "{no es json", fila: () => ({ estado: "apagada" }) });
  ok(rotoElArchivo.length === 1 && rotoElArchivo[0].doc === null, "un archivo ilegible entra como sujeto ilegible");
  const filaQueMiente = () => ({
    estado: "doc",
    crudo: JSON.stringify({ orgSlug: "onia-interna", data: { empresa: { horario: elQueMordio } } }),
  });
  const conFila = documentosServidos({
    leerArchivo: () => JSON.stringify({ empresa: {} }),
    fila: filaQueMiente,
    guarda: () => true,
  });
  ok(conFila.length === 2, "archivo y fila son dos sujetos");
  // ⚠️ Cambio del 2026-09-18: el horario de la fila del panel dejo de llegar al lead
  // (`mergePanelKnowledge` lo descarta), asi que ya no es rojo — pero TIENE que seguir a la vista.
  ok(juzgarHorario(conFila).codigo === 0, "el horario de la fila del panel ya no llega al lead: no es rojo");
  ok(juzgarHorario(conFila).inertes.length === 1, "pero se sigue contando como ignorado");
  ok(
    juzgarHorario(conFila).texto.includes("Ignorado"),
    "y se IMPRIME: una excusa que no se ve es irrefutable",
  );
  ok(
    juzgarHorario(conFila).texto.includes("ventanas-de-atencion.mjs"),
    "el aviso dice donde SI se cambia la disponibilidad",
  );
  // El default es juzgar: un documento sin la marca sigue siendo sujeto (fail-closed).
  ok(
    juzgarHorario([{ de: "sin marca", doc: { empresa: { horario: elQueMordio } } }]).codigo === 1,
    "un documento sin `gobiernaElHorario` se juzga igual: el default es ser sujeto",
  );
  // Y el archivo vivo NO se volvio inerte de paso: es la base del merge y sigue mordiendo.
  ok(
    documentosServidos({
      leerArchivo: () => JSON.stringify({ empresa: { horario: elQueMordio } }),
      fila: () => ({ estado: "ausente" }),
    })[0].gobiernaElHorario === true,
    "el archivo vivo sigue gobernando el horario: es la base del merge",
  );
  ok(
    juzgarHorario(
      documentosServidos({
        leerArchivo: () => JSON.stringify({ empresa: { horario: elQueMordio } }),
        fila: () => ({ estado: "ausente" }),
      }),
    ).codigo === 1,
    "un horario viejo en el archivo vivo sigue siendo ROJO",
  );
  // Ilegible manda aunque el documento sea el inerte: no se puede concluir sin leerlo.
  ok(
    juzgarHorario([{ de: "fila", doc: null, gobiernaElHorario: false }]).codigo === 2,
    "una fila ilegible sigue valiendo 2 aunque su horario no gobierne",
  );

  // LA EXENCION CUELGA DEL DEPLOY, NO DEL REPO. Mientras el bot VIVO no traiga la guarda, la fila
  // sigue pisando la promesa y el lead sigue leyendo mal: eximirla ahi es un verde falso.
  const conFilaSinDesplegar = documentosServidos({
    leerArchivo: () => JSON.stringify({ empresa: {} }),
    fila: filaQueMiente,
    guarda: () => false,
  });
  ok(
    juzgarHorario(conFilaSinDesplegar).codigo === 1,
    "sin la guarda desplegada, la fila del panel SIGUE siendo roja",
  );
  ok(
    juzgarHorario(conFilaSinDesplegar).inertes.length === 0,
    "y no se cuenta como ignorada: todavia gobierna",
  );
  // No poder preguntar no abre una exencion (fail-closed).
  ok(
    juzgarHorario(
      documentosServidos({ leerArchivo: () => JSON.stringify({ empresa: {} }), fila: filaQueMiente, guarda: () => null }),
    ).codigo === 1,
    "si no se pudo preguntar por la guarda, la fila se juzga igual",
  );

  // El lector de la guarda: `grep -c` sale 1 SIN error cuando no hay coincidencias, y eso es un
  // "no", no un "no pude". Confundirlos es lo que convierte un no-medido en una exencion.
  ok(guardaDesplegada({ correr: () => ({ status: 0, stdout: "1\n" }) }) === true, "grep con 1 coincidencia: desplegada");
  ok(guardaDesplegada({ correr: () => ({ status: 1, stdout: "0\n" }) }) === false, "grep sin coincidencias: NO desplegada");
  ok(guardaDesplegada({ correr: () => ({ error: new Error("no docker") }) }) === null, "sin docker: no se pudo preguntar");
  ok(guardaDesplegada({ correr: () => ({ status: 127, stdout: "" }) }) === null, "un status raro es no-medido, no un `no`");

  const fallan = casos.filter((c) => !c.ok);
  for (const c of casos) console.log(`${c.ok ? "ok  " : "FAIL"} ${c.nombre}`);
  console.log(`${casos.length - fallan.length}/${casos.length}`);
  return fallan.length === 0 ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const codigo = process.argv.includes("--self-check") ? selfCheck() : await medirVivo();
  process.exit(codigo);
}

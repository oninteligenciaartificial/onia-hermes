#!/usr/bin/env node
// Mide si el bot VIVO le promete al lead una puerta que el producto NO abre. Correr:
//   node hermes-content/deploy/vps-ops/bot/puerta-del-alta.mjs     (npm run puerta:alta)
//   node hermes-content/deploy/vps-ops/bot/puerta-del-alta.mjs --self-check
//
// ORIGEN (medido el 2026-09-13, carril chatbot-cola). El objetivo del carril tiene dos mitades:
// "el bot contesta el precio correcto" Y "no promete lo que el producto no hace". La primera
// tiene instrumento vivo desde el 12-sep (`precios-vivos.mjs`). La segunda no tenia ninguno, y
// ese dia el bot le estaba diciendo a los leads de los inboxes 4 y 5, textual:
//
//   "Si — podes probar el sistema 14 dias gratis: creas tu cuenta en app.onia.com.bo/register
//    y entras al toque. Si te sirve, despues elegis el plan desde el propio panel."
//
// Medido en produccion el mismo dia, esa ultima frase es FALSA:
//   docker exec onia-platform env | grep ONIA_REGISTRO_CONFIRMA_CORREO  -> si
//   docker exec supabase-auth2   env | grep GOTRUE_MAILER_AUTOCONFIRM   -> false
// Con esa conjuncion, `app/api/auth/login/route.ts` contesta 403 `email_not_confirmed` hasta que
// la persona haga clic en el correo — y la pantalla del producto lo dice bien ("Tu cuenta ya fue
// creada. Revisa tu correo ... y confirma tu cuenta antes de iniciar sesion"). O sea que el
// PRODUCTO era honesto y el BOT no: el lead crea la cuenta creyendo que entra, intenta entrar, no
// puede, y el correo de confirmacion ni siquiera tiene probada su entrega (tarea t_040684cb).
// Es la friccion mas cara que existe: en el ultimo clic, despues de convencerlo.
//
// POR QUE NO LO VEIA NINGUN GATE. Esa frase no esta en el repo: vive en una fila publicada desde
// el panel (`chatbot_knowledge` de la org interna) que el motor sirve por encima del archivo. Un
// artefacto que se publica a mano es invisible para todo gate de repo — la misma familia que dejo
// al bot cotizando Bs 750/1.500 una semana. Por eso este archivo mide LO QUE EL BOT SIRVE, por la
// MISMA via del camino de respuesta (fila por inbox + archivo vivo), y no lo que dice el repo.
//
// LAS DOS FUENTES SON INDEPENDIENTES A PROPOSITO. Lo que el producto HACE se deriva de los dos
// interruptores vivos; lo que el bot DICE, de los documentos que sirve. Si las dos salieran del
// mismo lado, el gate se comprobaria contra si mismo y daria verde con el lead afuera.
//
// CODIGOS DE SALIDA
//   0  ningun texto servido promete entrar sin el paso que el producto exige
//   1  el bot promete entrada inmediata y el producto exige confirmar el correo
//   2  no se pudo medir  → no medir NO es estar bien
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { normalize } from "./guardrails.mjs";
import {
  CONTENEDOR,
  RUTA_VIVA,
  filaPanel,
  filaPublicada,
  inboxesVivos,
  leerKnowledgeVivo,
  textosDe,
} from "./precios-vivos.mjs";

/** El contenedor del producto, que es quien decide si el alta exige confirmar el correo. */
export const CONTENEDOR_APP = process.env.ONIA_APP_CONTENEDOR ?? "onia-platform";

/**
 * Los DOS interruptores vivos, leidos de los contenedores que los ejecutan. La conjuncion la
 * documenta el propio producto (`lib/registration.ts`): el flip de la app no alcanza solo,
 * porque GoTrue autoconfirma cualquier signUp si `GOTRUE_MAILER_AUTOCONFIRM` sigue en `true`.
 *
 * Tri-estado, y el `null` importa: preguntar mal y no poder preguntar se ven igual desde afuera,
 * y aplanar eso a `false` absolveria al bot justo cuando el gate esta ciego.
 */
export function confirmacionExigida({ correr = spawnSync } = {}) {
  const app = variableDeContenedor({ contenedor: CONTENEDOR_APP, nombre: "ONIA_REGISTRO_CONFIRMA_CORREO", correr });
  if (app === null) return { estado: null, motivo: `no pude leer el env de ${CONTENEDOR_APP}` };

  const auth = contenedorAuth({ correr });
  if (!auth) return { estado: null, motivo: "no pude encontrar el contenedor de GoTrue (auth)" };
  const autoconfirm = variableDeContenedor({ contenedor: auth, nombre: "GOTRUE_MAILER_AUTOCONFIRM", correr });
  if (autoconfirm === null) return { estado: null, motivo: `no pude leer el env de ${auth}` };

  // La ausencia de la variable en un contenedor que SI pude leer es un dato, no un hueco: el
  // default de GoTrue es no autoconfirmar. Se nombra igual, porque una creencia que no se
  // escribe es la que despues nadie puede refutar.
  const autoconfirma = autoconfirm === "true";
  const exige = app === "si" && !autoconfirma;
  return {
    estado: exige,
    motivo:
      `${CONTENEDOR_APP}:ONIA_REGISTRO_CONFIRMA_CORREO=${app || "(ausente)"} · ` +
      `${auth}:GOTRUE_MAILER_AUTOCONFIRM=${autoconfirm || "(ausente)"}`,
  };
}

/** El valor de una variable del entorno de un contenedor. `null` = no pude preguntar. */
export function variableDeContenedor({ contenedor, nombre, correr = spawnSync }) {
  const r = correr("docker", ["exec", contenedor, "env"], { encoding: "utf8", timeout: 60_000 });
  if (!r || r.error || r.status !== 0 || typeof r.stdout !== "string") return null;
  const linea = r.stdout.split("\n").find((l) => l.startsWith(`${nombre}=`));
  return linea === undefined ? "" : linea.slice(nombre.length + 1).trim();
}

/** El contenedor de GoTrue, derivado de `docker ps` y no de una constante que envejece sola. */
export function contenedorAuth({ correr = spawnSync } = {}) {
  const r = correr("docker", ["ps", "--format", "{{.Names}}"], { encoding: "utf8", timeout: 60_000 });
  if (!r || r.error || r.status !== 0 || typeof r.stdout !== "string") return null;
  return r.stdout.split("\n").map((l) => l.trim()).find((l) => /auth/i.test(l)) || null;
}

// ---------------------------------------------------------------------------
// La deteccion. La ventana es la ORACION, no el documento: una salvedad suelta
// en otro parrafo absolveria a la frase que el lead lee sola.
// ---------------------------------------------------------------------------

/** Habla del alta: crear la cuenta, registrarse, la ruta del alta. */
const HABLA_DEL_ALTA =
  /(registr(a|o|arte|arse|as|ate)|crea(r|s|te|ndo)?\s+(tu\s+|una\s+|la\s+)?cuenta|\/register|darte de alta|das de alta)/;

/**
 * Promete que despues de eso se entra, y que se entra YA. Dos piezas: entrar y la inmediatez.
 * "entras al toque", "y ya estas adentro", "empezas a usarlo al instante".
 */
const ENTRA = /(entr(a|as|ar|amos)|adentro|empez(a|as|ar)\s+a\s+usar|us(a|as|arlo|arla)|acced(e|es|er)|list(o|a)\s*$|y list(o|a)\b)/;
const INMEDIATO =
  /(al toque|al instante|al momento|en el acto|enseguida|inmediatamente|de una\b|sin esperar|sin mas trami|ya mismo|automaticamente|en (un|1) minuto|en (dos|2) minutos)/;

/**
 * La salvedad que hace verdadera a la frase: nombrar el paso del correo. Se busca en la MISMA
 * oracion o en la SIGUIENTE — que es hasta donde llega un lector antes de hacer clic.
 */
const SALVEDAD = /(confirm|verific|valida(r|s|ndo)? (tu|el) (correo|mail|email)|revisa(s|r)? (tu )?(correo|bandeja|mail|email)|link que te llega)/;

/** Corta en oraciones sin partir `app.onia.com.bo/register` (los puntos de un dominio no llevan espacio). */
export function oraciones(texto) {
  return String(texto)
    .split(/(?<=[.!?…])[\s\n]+/)
    .map((o) => o.trim())
    .filter((o) => o !== "");
}

/**
 * Las frases servidas que prometen entrar YA despues de crear la cuenta, sin nombrar el paso que
 * el producto exige. Devuelve la oracion textual: un veredicto que no puede citar la frase manda
 * a buscarla a mano, y esta vive en una fila de base que nadie sabe abrir.
 */
export function promesasDeEntradaInmediata(knowledge) {
  const encontradas = [];
  for (const texto of textosDe(knowledge)) {
    const partes = oraciones(texto);
    for (let i = 0; i < partes.length; i += 1) {
      const oracion = normalize(partes[i]);
      if (!HABLA_DEL_ALTA.test(oracion)) continue;
      if (!ENTRA.test(oracion) || !INMEDIATO.test(oracion)) continue;
      const vecina = i + 1 < partes.length ? normalize(partes[i + 1]) : "";
      if (SALVEDAD.test(oracion) || SALVEDAD.test(vecina)) continue;
      encontradas.push(partes[i].trim());
    }
  }
  return encontradas;
}

// ---------------------------------------------------------------------------
// El veredicto
// ---------------------------------------------------------------------------

/**
 * `documentos` = [{ de, doc }] — cada documento que el bot SIRVE, con de donde salio.
 * `exige` = el tri-estado de `confirmacionExigida()`.
 *
 * `exige` es OBLIGATORIO y sin default a proposito: el llamador que se olvide de medir el
 * producto tiene que romper, no heredar un "no exige nada" que absuelve a cualquier texto.
 */
export function juzgarPuerta(documentos, exige) {
  if (!exige || exige.estado === null || exige.estado === undefined) {
    return {
      codigo: 2,
      texto: `NO SE PUDO MEDIR — ${exige?.motivo ?? "no se midio si el alta exige confirmar el correo"}. Sin ese lado no hay cruce.`,
    };
  }
  if (!Array.isArray(documentos) || documentos.length === 0) {
    return {
      codigo: 2,
      texto: "NO SE PUDO MEDIR — no pude leer ningun documento de los que sirve el bot. Cero documentos no es 'ningun texto malo'.",
    };
  }
  const sinMedir = documentos.filter((d) => d.doc === null || d.doc === undefined);
  if (sinMedir.length > 0) {
    return {
      codigo: 2,
      texto:
        `NO SE PUDO MEDIR — ${sinMedir.length} documento(s) ilegibles (${sinMedir.map((d) => d.de).join(", ")}). ` +
        "El que no pude leer puede ser justo el que le habla al lead.",
    };
  }
  if (exige.estado === false) {
    return {
      codigo: 0,
      texto:
        "EL ALTA NO EXIGE CONFIRMAR EL CORREO — prometer entrada inmediata es cierto hoy. " +
        `(${exige.motivo}) · ${documentos.length} documento(s) mirados.`,
    };
  }
  const rotos = [];
  for (const { de, doc } of documentos) {
    for (const frase of promesasDeEntradaInmediata(doc)) rotos.push({ de, frase });
  }
  if (rotos.length > 0) {
    return {
      codigo: 1,
      texto:
        "EL BOT PROMETE UNA PUERTA QUE EL PRODUCTO NO ABRE — " +
        rotos.map((r) => `${r.de}: "${r.frase}"`).join(" | ") +
        `. El alta exige confirmar el correo (${exige.motivo}) y el login contesta 403 ` +
        "email_not_confirmed hasta que la persona haga clic. Decirlo entero no saca la promesa: " +
        "la completa.",
      rotos,
    };
  }
  return {
    codigo: 0,
    texto:
      `NINGUN TEXTO SERVIDO PROMETE ENTRAR SIN CONFIRMAR — ${documentos.length} documento(s) mirados ` +
      `(${documentos.map((d) => d.de).join(", ")}), con el alta exigiendo el correo (${exige.motivo}).`,
  };
}

// ---------------------------------------------------------------------------
// Lo vivo
// ---------------------------------------------------------------------------

function parsear(crudo) {
  if (crudo === null || crudo === undefined) return null;
  try {
    return JSON.parse(crudo);
  } catch {
    return null;
  }
}

/**
 * Todo lo que el bot puede servirle a alguien hoy: el archivo vivo, la fila del panel (F2.1) y la
 * fila publicada de CADA inbox que existe. Los inboxes se derivan de Chatwoot — una lista a mano
 * ("4 y 5") deja afuera justo al que alguien cree manana.
 */
export function documentosServidos({ correr = spawnSync } = {}) {
  const documentos = [];

  const archivo = leerKnowledgeVivo({ correr });
  documentos.push({ de: `archivo ${RUTA_VIVA}`, doc: parsear(archivo) });

  const panel = filaPanel({ correr });
  if (panel.estado === "doc") documentos.push({ de: "fila panel (ONIA_KNOWLEDGE_URL)", doc: parsear(panel.crudo) });
  else if (panel.estado === null) documentos.push({ de: "fila panel (ONIA_KNOWLEDGE_URL)", doc: null });

  const inboxes = inboxesVivos({ correr });
  if (inboxes === null) return { documentos, inboxes: null };
  for (const inbox of inboxes) {
    const fila = filaPublicada({ inbox, correr });
    if (fila.estado === "doc") documentos.push({ de: `fila inbox ${inbox}`, doc: parsear(fila.crudo) });
    else if (fila.estado === null) documentos.push({ de: `fila inbox ${inbox}`, doc: null });
  }
  return { documentos, inboxes };
}

async function medirVivo() {
  const exige = confirmacionExigida();
  const { documentos, inboxes } = documentosServidos();
  if (inboxes === null) {
    console.log(
      "NO SE PUDO MEDIR — no pude derivar que inboxes existen en Chatwoot. Una lista vacia de " +
        "inboxes no es 'ningun inbox'.",
    );
    return 2;
  }
  const v = juzgarPuerta(documentos, exige);
  console.log(v.texto);
  console.log(`inboxes vivos: ${inboxes.join(", ")} · documentos mirados: ${documentos.length}`);
  if (v.codigo === 1) {
    console.log(
      "\nCOMO SE ARREGLA: el texto honesto es el de la propia pantalla del producto " +
        '("Tu cuenta ya fue creada. Revisa tu correo y confirma tu cuenta antes de iniciar sesion"). ' +
        "Si la frase vive en una fila publicada, se corrige en la fila — arreglar el repo no la toca.",
    );
  }
  return v.codigo;
}

// ---------------------------------------------------------------------------
// Self-check: puro, sin docker ni red, para que pueda vivir en la cadena.
// ---------------------------------------------------------------------------

function selfCheck() {
  const casos = [];
  const ok = (cond, nombre) => casos.push({ nombre, ok: Boolean(cond) });
  const exigiendo = { estado: true, motivo: "fixture" };
  const sinExigir = { estado: false, motivo: "fixture" };
  const doc = (body) => [{ de: "fixture", doc: { faq: [{ id: "negocio", status: "publicado", body }] } }];

  // El caso REAL, textual de la fila publicada que el bot servia el 2026-09-13.
  const vivo =
    "Sí — podés probar el sistema 14 días gratis: creás tu cuenta en app.onia.com.bo/register y " +
    "entrás al toque. Si te sirve, después elegís el plan desde el propio panel.";
  const rojo = juzgarPuerta(doc(vivo), exigiendo);
  ok(rojo.codigo === 1, "la frase que el bot servia de verdad tiene que dar ROJO");
  ok(rojo.rotos?.[0]?.frase.includes("al toque"), "tiene que CITAR la frase, no solo decir que hay una");

  // La direccion simetrica: el texto corregido da VERDE, o el gate queda rojo para siempre y lo
  // apagan. Es el mismo paso que la pantalla del producto ya nombra.
  const corregido =
    "Sí — podés probar el sistema 14 días gratis: creás tu cuenta en app.onia.com.bo/register, " +
    "confirmás el correo que te llega y entrás. Si te sirve, después elegís el plan desde el panel.";
  ok(juzgarPuerta(doc(corregido), exigiendo).codigo === 0, "el texto con el paso del correo tiene que dar VERDE");

  // La salvedad vale tambien en la oracion de al lado: es hasta donde llega un lector.
  const vecina = "Creás tu cuenta en app.onia.com.bo/register y entrás al toque. Antes confirmás el correo que te mandamos.";
  ok(juzgarPuerta(doc(vecina), exigiendo).codigo === 0, "la salvedad en la oracion siguiente absuelve");

  // ...pero NO tres oraciones mas abajo: una salvedad lejos de su afirmacion no la alcanza.
  const lejos =
    "Creás tu cuenta en app.onia.com.bo/register y entrás al toque. Tenemos módulos por rubro. " +
    "El plan lo elegís después. Ah, y confirmás el correo.";
  ok(juzgarPuerta(doc(lejos), exigiendo).codigo === 1, "una salvedad tres oraciones abajo NO absuelve");

  // El punto de un dominio no corta la oracion: si cortara, la frase real se partiria en dos y
  // ninguna mitad tendria alta + inmediatez a la vez — el gate daria verde sobre el caso que nacio para ver.
  ok(
    oraciones("creas tu cuenta en app.onia.com.bo/register y entras al toque. otra cosa").length === 2,
    "app.onia.com.bo no puede partir la oracion",
  );

  // El cruce es con el PRODUCTO: si el alta no exigiera confirmar, la misma frase seria cierta.
  ok(juzgarPuerta(doc(vivo), sinExigir).codigo === 0, "sin confirmacion exigida la misma frase es VERDE");

  // Tri-estado en las dos puntas: no medir nunca es 0.
  ok(juzgarPuerta(doc(vivo), { estado: null, motivo: "x" }).codigo === 2, "sin medir el producto es 2, nunca 0");
  ok(juzgarPuerta([], exigiendo).codigo === 2, "cero documentos es 2, nunca 0");
  ok(juzgarPuerta([{ de: "x", doc: null }], exigiendo).codigo === 2, "un documento ilegible es 2, nunca 0");

  // El universo sale del documento entero: la frase puede estar en un campo que nadie previo.
  const campoNuevo = [{ de: "fixture", doc: { secciones: { promo: [{ titulo: vivo }] } } }];
  ok(juzgarPuerta(campoNuevo, exigiendo).codigo === 1, "la frase en un campo nuevo tambien cae");

  // Un texto de alta SIN inmediatez no es sujeto: el gate no puede prohibir hablar del alta.
  const neutro = [{ de: "fixture", doc: { faq: [{ body: "Creás tu cuenta en app.onia.com.bo/register cuando quieras." }] } }];
  ok(juzgarPuerta(neutro, exigiendo).codigo === 0, "hablar del alta sin prometer inmediatez es VERDE");

  // La conjuncion de los dos interruptores, que es lo que el producto documenta: uno solo no basta.
  const envs = (app, auto) => ({
    exec: (_c, args) => {
      const nombre = args[1];
      if (args[2] === "env") {
        if (nombre === CONTENEDOR_APP) return { status: 0, stdout: `ONIA_REGISTRO_CONFIRMA_CORREO=${app}\n` };
        return { status: 0, stdout: `GOTRUE_MAILER_AUTOCONFIRM=${auto}\n` };
      }
      return { status: 1, stdout: "" };
    },
  });
  const correrCon = (app, auto) => (cmd, args) =>
    args[0] === "ps" ? { status: 0, stdout: "supabase-auth2\nonia-platform\n" } : envs(app, auto).exec(cmd, args);
  ok(confirmacionExigida({ correr: correrCon("si", "false") }).estado === true, "si + autoconfirm apagado => exige");
  ok(confirmacionExigida({ correr: correrCon("si", "true") }).estado === false, "si + autoconfirm ENCENDIDO => no exige");
  ok(confirmacionExigida({ correr: correrCon("no", "false") }).estado === false, "app apagada => no exige");
  ok(
    confirmacionExigida({ correr: () => ({ status: 1, stdout: "" }) }).estado === null,
    "no poder leer el env es null, nunca false",
  );

  const fallan = casos.filter((c) => !c.ok);
  for (const c of casos) console.log(`${c.ok ? "ok  " : "FAIL"} ${c.nombre}`);
  console.log(`${casos.length - fallan.length}/${casos.length}`);
  return fallan.length === 0 ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const codigo = process.argv.includes("--self-check") ? selfCheck() : await medirVivo();
  process.exit(codigo);
}

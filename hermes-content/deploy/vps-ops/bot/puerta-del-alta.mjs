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
// LA LISTA DE PUERTAS NO PUEDE SER UNA SOLA (ampliado el 2026-09-17, mismo carril). Este archivo
// nacio con UNA causa —confirmar el correo— escrita a mano, y esa forma ya tiene su leccion: un
// gate que fija su invariante sobre una lista de causas escrita el dia que se escribio cierra la
// instancia y despues DEFIENDE el hueco, porque la causa N+1 entra y el gate sigue verde.
//
// La causa N+1 llego cuatro dias despues y es peor que la primera. `lib/mfa/policy.ts` del build
// que produccion SIRVE hoy dice:
//
//   export const MFA_ENFORCE_FROM = "2026-09-17T04:00:00.000Z";
//   export function requiresMfaNow(role, hasVerifiedFactor, now = new Date()) { ... }
//
// —una fecha absoluta, sin nada que cuelgue del alta de cada cuenta—, `MFA_REQUIRED_ROLES` trae
// `ADMIN`, y `app/api/auth/register/route.ts` le da `role: "ADMIN"` a todo el que se registra. O
// sea que desde las 00:00 del 17-sep (La Paz) el que crea su cuenta confirma el correo, termina el
// onboarding y el layout del panel lo manda a `/profile` en TODA ruta hasta que instale una app
// externa de codigos. Reproducido en produccion por `recorrido-cliente` (tarea `t_82251f19`).
//
// El arreglo del producto ya esta en `master` (`b1247fb`: la gracia cuelga del alta de cada
// cuenta), pero produccion corre un build del 13-sep: el arreglo mergeado no es el arreglo vivo.
// Por eso esta puerta se mide contra el ARBOL DE FUENTES DEL BUILD QUE CORRE, casado por
// `BUILD_ID` — no contra el repo, que aca diria que no hay ninguna puerta.
//
// CODIGOS DE SALIDA
//   0  ningun texto servido promete entrar sin los pasos que el producto exige
//   1  el bot promete entrada inmediata y el producto exige al menos un paso mas
//   2  no se pudo medir  → no medir NO es estar bien
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

import { leerDeProduccion, listarDeProduccion } from "../../../../scripts/lib/vps-o-local.mjs";
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
// La segunda puerta: la verificacion en dos pasos. Se mide sobre el ARBOL DE
// FUENTES DEL BUILD QUE CORRE, no sobre el repo — hoy difieren en cuatro dias y
// justo en este archivo, que es exactamente cuando el repo miente en verde.
// ---------------------------------------------------------------------------

/** El `BUILD_ID` que sirve el contenedor. `null` = no pude preguntar. */
export function buildIdVivo({ correr = spawnSync } = {}) {
  const r = correr("docker", ["exec", CONTENEDOR_APP, "cat", "/app/.next/BUILD_ID"], {
    encoding: "utf8",
    timeout: 60_000,
  });
  if (!r || r.error || r.status !== 0 || typeof r.stdout !== "string") return null;
  return r.stdout.trim() || null;
}

/**
 * El directorio de fuentes que produjo el build vivo, casado por `BUILD_ID`.
 *
 * Se DERIVA, nunca se nombra un sha: produccion swapea sola tras los merges y un sha escrito a
 * mano envejece en horas. `null` = no pude preguntar o ningun staged casa (las dos son «no medi»,
 * y ninguna es «no hay puerta»).
 */
export function arbolDelBuildVivo({ correr = spawnSync, leer = leerDeProduccion, listar = listarDeProduccion } = {}) {
  const id = buildIdVivo({ correr });
  if (!id) return null;
  const candidatos = listar("/opt/onia-platform/build-*");
  if (!candidatos || !Array.isArray(candidatos.dirs)) return null;
  for (const dir of candidatos.dirs) {
    const suyo = leer(`${dir}/.next/standalone/.next/BUILD_ID`);
    if (suyo && String(suyo.contenido).trim() === id) return dir;
  }
  return null;
}

/** El rol con el que nace una cuenta nueva, leido del alta que produccion EJECUTA. */
export function rolDelAlta(fuenteRegister) {
  if (typeof fuenteRegister !== "string") return null;
  const m = fuenteRegister.match(/\brole:\s*["']([A-Z_]+)["']/);
  return m ? m[1] : null;
}

/** Los roles a los que la politica viva les exige el segundo factor. */
export function rolesQueExigenMfa(fuentePolicy) {
  if (typeof fuentePolicy !== "string") return null;
  const m = fuentePolicy.match(/MFA_REQUIRED_ROLES\s*=\s*\[([^\]]*)\]/);
  if (!m) return null;
  return m[1].split(",").map((x) => x.replace(/["'\s]/g, "")).filter(Boolean);
}

/**
 * Tri-estado: ¿la politica VIVA le exige el segundo factor a una cuenta que nace HOY?
 *
 * Dos formas posibles, y la diferencia entre ellas es el bug entero:
 *  - la gracia cuelga del ALTA de cada cuenta (`cuentaCreadaEl`) → el recien llegado tiene sus
 *    dias, la puerta esta cerrada para el;
 *  - la gracia es una fecha ABSOLUTA y sola (`MFA_ENFORCE_FROM`) → el dia que vence deja de haber
 *    gracia para NADIE, y todo el que llega despues choca contra el muro sin un dia de aviso.
 *
 * Cualquier otra forma es `null` a proposito: una politica que no se reconoce no se absuelve.
 */
export function politicaExigeAlRecienLlegado({ policy, register, now = new Date() }) {
  if (typeof policy !== "string" || policy === "") {
    return { estado: null, motivo: "no pude leer lib/mfa/policy.ts del build vivo" };
  }
  const rol = rolDelAlta(register);
  const exigidos = rolesQueExigenMfa(policy);
  if (rol === null) return { estado: null, motivo: "no pude leer con que rol nace una cuenta en el build vivo" };
  if (exigidos === null) return { estado: null, motivo: "no pude leer MFA_REQUIRED_ROLES del build vivo" };
  if (!exigidos.includes(rol)) {
    return { estado: false, motivo: `el alta crea ${rol} y la 2FA solo se le exige a ${exigidos.join("/")}` };
  }

  if (/cuentaCreadaEl/.test(policy)) {
    return { estado: false, motivo: `la gracia de 2FA cuelga del alta de cada cuenta (rol del alta: ${rol})` };
  }
  const m = policy.match(/MFA_ENFORCE_FROM\s*=\s*["']([^"']+)["']/);
  const corte = m ? Date.parse(m[1]) : NaN;
  if (!Number.isFinite(corte)) {
    return { estado: null, motivo: "la politica viva no tiene ni gracia por cuenta ni fecha de corte legible" };
  }
  const vencio = now.getTime() >= corte;
  return {
    estado: vencio,
    motivo:
      `MFA_ENFORCE_FROM=${m[1]} es una fecha absoluta y sola, y ${vencio ? "ya vencio" : "todavia no vence"}` +
      ` — el alta crea ${rol}, que esta en MFA_REQUIRED_ROLES`,
  };
}

/** Lo mismo, contra produccion. */
export function dosPasosExigido({ correr = spawnSync, leer = leerDeProduccion, listar = listarDeProduccion, now = new Date() } = {}) {
  const arbol = arbolDelBuildVivo({ correr, leer, listar });
  if (!arbol) {
    return { estado: null, motivo: "no pude casar el BUILD_ID vivo con ningun arbol de fuentes en /opt/onia-platform" };
  }
  const policy = leer(`${arbol}/lib/mfa/policy.ts`);
  const register = leer(`${arbol}/app/api/auth/register/route.ts`);
  return politicaExigeAlRecienLlegado({
    policy: policy?.contenido ?? null,
    register: register?.contenido ?? null,
    now,
  });
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

/**
 * La salvedad de la OTRA puerta. Es distinta a proposito: nombrar el correo no vuelve verdadera
 * una frase que ademas esconde el muro de la 2FA. Una salvedad por puerta, o la primera absuelve
 * a todas y el gate vuelve a tener una sola causa con cara de tener varias.
 */
const SALVEDAD_DOS_PASOS =
  /(dos pasos|doble factor|segundo factor|2fa|verificacion en dos|autenticad|authenticator|codigo de (la|una|tu) app)/;

/**
 * Las puertas posibles entre "crea tu cuenta" y "usa el sistema". Cada una trae su propia
 * salvedad porque cada una es un paso distinto para la persona que esta del otro lado.
 */
export const PUERTAS = [
  {
    id: "correo",
    nombre: "confirmar el correo",
    salvedad: SALVEDAD,
    consecuencia: "el login contesta 403 email_not_confirmed hasta que la persona haga clic",
  },
  {
    id: "dos-pasos",
    nombre: "activar la verificacion en dos pasos",
    salvedad: SALVEDAD_DOS_PASOS,
    consecuencia:
      "el panel lo manda a /profile en TODA ruta hasta que instale una app externa de codigos",
  },
];

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
export function promesasDeEntradaInmediata(knowledge, puertas = [PUERTAS[0]]) {
  const encontradas = [];
  const exigidas = puertas.filter((p) => p.estado === true || p.estado === undefined);
  for (const texto of textosDe(knowledge)) {
    const partes = oraciones(texto);
    for (let i = 0; i < partes.length; i += 1) {
      const oracion = normalize(partes[i]);
      if (!HABLA_DEL_ALTA.test(oracion)) continue;
      if (!ENTRA.test(oracion) || !INMEDIATO.test(oracion)) continue;
      const vecina = i + 1 < partes.length ? normalize(partes[i + 1]) : "";
      for (const puerta of exigidas) {
        if (puerta.salvedad.test(oracion) || puerta.salvedad.test(vecina)) continue;
        encontradas.push({ frase: partes[i].trim(), puerta });
      }
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
export function juzgarPuerta(documentos, puertas) {
  if (!Array.isArray(puertas) || puertas.length === 0) {
    return {
      codigo: 2,
      texto:
        "NO SE PUDO MEDIR — no se midio ninguna puerta del alta. Cero puertas medidas no es " +
        "'el alta no pone ninguna': sin ese lado no hay cruce.",
    };
  }
  const ciegas = puertas.filter((p) => p.estado === null || p.estado === undefined);
  if (ciegas.length > 0) {
    return {
      codigo: 2,
      texto:
        `NO SE PUDO MEDIR — ${ciegas.length} puerta(s) sin medir: ` +
        ciegas.map((p) => `${p.nombre} (${p.motivo ?? "sin motivo"})`).join(" · ") +
        ". La que no pude medir puede ser justo la que frena al lead.",
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
  const exigidas = puertas.filter((p) => p.estado === true);
  if (exigidas.length === 0) {
    return {
      codigo: 0,
      texto:
        "EL ALTA NO PONE NINGUNA PUERTA — prometer entrada inmediata es cierto hoy. " +
        `(${puertas.map((p) => `${p.nombre}: no`).join(" · ")}) · ${documentos.length} documento(s) mirados.`,
    };
  }
  const rotos = [];
  for (const { de, doc } of documentos) {
    for (const { frase, puerta } of promesasDeEntradaInmediata(doc, exigidas)) rotos.push({ de, frase, puerta });
  }
  if (rotos.length > 0) {
    return {
      codigo: 1,
      texto:
        "EL BOT PROMETE UNA PUERTA QUE EL PRODUCTO NO ABRE — " +
        rotos.map((r) => `${r.de} [${r.puerta.nombre}]: "${r.frase}"`).join(" | ") +
        ". El alta exige " +
        exigidas.map((p) => `${p.nombre} (${p.motivo}), y entonces ${p.consecuencia}`).join("; ademas ") +
        ". Decirlo entero no saca la promesa: la completa.",
      rotos,
    };
  }
  return {
    codigo: 0,
    texto:
      `NINGUN TEXTO SERVIDO PROMETE ENTRAR SIN LOS PASOS QUE EL PRODUCTO EXIGE — ${documentos.length} ` +
      `documento(s) mirados (${documentos.map((d) => d.de).join(", ")}), con ${exigidas.length} puerta(s) ` +
      `viva(s): ${exigidas.map((p) => `${p.nombre} (${p.motivo})`).join(" · ")}.`,
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

/**
 * Cada puerta de `PUERTAS`, medida contra produccion.
 *
 * El universo sale de `PUERTAS`, no de esta funcion: una puerta declarada sin medidor sale
 * `null` (no medida) y el gate se niega a concluir. Al reves —derivar la lista de los medidores
 * que hay— la puerta nueva entraria absuelta, que es como esta familia falla en verde.
 */
export function puertasDelAlta({
  correr = spawnSync,
  leer = leerDeProduccion,
  listar = listarDeProduccion,
  now = new Date(),
} = {}) {
  const medidores = {
    correo: () => confirmacionExigida({ correr }),
    "dos-pasos": () => dosPasosExigido({ correr, leer, listar, now }),
  };
  return PUERTAS.map((puerta) => {
    const medir = medidores[puerta.id];
    if (!medir) {
      return { ...puerta, estado: null, motivo: `la puerta "${puerta.id}" esta declarada y no tiene medidor` };
    }
    return { ...puerta, ...medir() };
  });
}

async function medirVivo() {
  const exige = puertasDelAlta();
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
        "Si la frase vive en una fila publicada, se corrige en la fila — arreglar el repo no la toca.\n" +
        "Y si la puerta que salta es la de dos pasos: el arreglo del PRODUCTO ya esta en master " +
        "(la gracia cuelga del alta de cada cuenta); lo que falta es publicarlo, no reescribir el bot.",
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
  // Las puertas del fixture se DERIVAN de `PUERTAS`, no se escriben: si manana entra una tercera,
  // estos casos la incluyen solos en vez de seguir midiendo un mundo de dos.
  const conEstados = (estados) => PUERTAS.map((p) => ({ ...p, estado: estados[p.id] ?? false, motivo: "fixture" }));
  const soloCorreo = conEstados({ correo: true });
  const exigiendo = soloCorreo;
  const sinExigir = conEstados({});
  const lasDos = PUERTAS.map((p) => ({ ...p, estado: true, motivo: "fixture" }));
  const doc = (body) => [{ de: "fixture", doc: { faq: [{ id: "negocio", status: "publicado", body }] } }];

  // El caso REAL, textual de la fila publicada que el bot servia el 2026-09-13.
  const vivo =
    "Sí — podés probar el sistema 14 días gratis: creás tu cuenta en app.onia.com.bo/register y " +
    "entrás al toque. Si te sirve, después elegís el plan desde el propio panel.";
  const rojo = juzgarPuerta(doc(vivo), exigiendo);
  ok(rojo.codigo === 1, "la frase que el bot servia de verdad tiene que dar ROJO");
  ok(rojo.rotos?.[0]?.frase.includes("al toque"), "tiene que CITAR la frase, no solo decir que hay una");
  ok(rojo.rotos?.[0]?.puerta?.id === "correo", "tiene que decir CUAL puerta, o no se sabe que paso nombrar");

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

  // ---------------------------------------------------------------------
  // La SEGUNDA puerta (2026-09-17). Una salvedad no absuelve a la otra: el
  // texto que nombra el correo sigue escondiendo el muro de la 2FA.
  // ---------------------------------------------------------------------
  // El texto que hoy pasaria: promete inmediatez y nombra SOLO el correo.
  const soloElCorreoDicho =
    "Creás tu cuenta en app.onia.com.bo/register y entrás al toque. Confirmás el correo que te llega y listo.";
  ok(juzgarPuerta(doc(soloElCorreoDicho), soloCorreo).codigo === 0, "con una sola puerta viva, nombrarla alcanza");
  const rojo2fa = juzgarPuerta(doc(soloElCorreoDicho), lasDos);
  ok(rojo2fa.codigo === 1, "nombrar el correo NO absuelve la puerta de dos pasos");
  ok(rojo2fa.rotos?.every((r) => r.puerta.id === "dos-pasos"), "y la que acusa tiene que ser la de dos pasos, no la del correo");
  const conLasDos =
    "Creás tu cuenta en app.onia.com.bo/register y entrás al toque. Confirmás el correo y activás la verificación en dos pasos.";
  ok(juzgarPuerta(doc(conLasDos), lasDos).codigo === 0, "nombrar las DOS puertas es VERDE");
  ok(juzgarPuerta(doc(corregido), lasDos).codigo === 0, "un texto sin promesa de inmediatez no es sujeto de ninguna puerta");

  // El universo son `PUERTAS`: una puerta declarada sin medidor no se absuelve sola.
  const inventada = puertasDelAlta({ correr: () => ({ status: 1, stdout: "" }) });
  ok(inventada.length === PUERTAS.length, "se mide UNA puerta por cada una declarada");
  ok(
    inventada.every((p) => p.estado === null || p.estado === true || p.estado === false),
    "toda puerta declarada sale medida o explicitamente sin medir",
  );

  // La politica VIVA, en sus dos formas. El fixture es textual de los dos builds reales.
  const vieja = [
    'export const MFA_REQUIRED_ROLES = ["SUPERADMIN", "ADMIN"] as const;',
    'export const MFA_ENFORCE_FROM = "2026-09-17T04:00:00.000Z";',
    "export function requiresMfaNow(role: string, hasVerifiedFactor: boolean, now: Date = new Date()): boolean {",
  ].join("\n");
  const nueva = vieja.replace(
    "requiresMfaNow(role: string, hasVerifiedFactor: boolean",
    "requiresMfaNow({ role, tieneFactor, cuentaCreadaEl, now }: { cuentaCreadaEl: Date",
  );
  const alta = 'const profile = await prisma.profile.create({ data: { role: "ADMIN" } });';
  const ANTES = new Date("2026-09-16T00:00:00.000Z");
  const DESPUES = new Date("2026-09-17T12:00:00.000Z");
  ok(
    politicaExigeAlRecienLlegado({ policy: vieja, register: alta, now: DESPUES }).estado === true,
    "fecha absoluta ya vencida => el recien llegado choca contra el muro",
  );
  ok(
    politicaExigeAlRecienLlegado({ policy: vieja, register: alta, now: ANTES }).estado === false,
    "la misma politica antes del corte todavia no exige",
  );
  ok(
    politicaExigeAlRecienLlegado({ policy: nueva, register: alta, now: DESPUES }).estado === false,
    "con la gracia colgada del alta, el recien llegado tiene sus dias",
  );
  ok(
    politicaExigeAlRecienLlegado({ policy: vieja, register: 'role: "STAFF"', now: DESPUES }).estado === false,
    "si el alta no crea un rol exigido, no hay puerta",
  );
  ok(
    politicaExigeAlRecienLlegado({ policy: null, register: alta, now: DESPUES }).estado === null,
    "no poder leer la politica viva es null, nunca false",
  );
  ok(
    politicaExigeAlRecienLlegado({ policy: vieja, register: null, now: DESPUES }).estado === null,
    "no poder leer con que rol nace una cuenta es null, nunca false",
  );
  ok(
    politicaExigeAlRecienLlegado({ policy: 'const X = 1;\nMFA_REQUIRED_ROLES = ["ADMIN"]', register: alta, now: DESPUES })
      .estado === null,
    "una politica de forma desconocida es null: no se absuelve lo que no se entiende",
  );
  ok(rolDelAlta(alta) === "ADMIN", "el rol del alta se lee del alta que produccion ejecuta");
  ok(
    JSON.stringify(rolesQueExigenMfa(vieja)) === JSON.stringify(["SUPERADMIN", "ADMIN"]),
    "los roles exigidos se leen de la politica viva",
  );

  // El arbol del build vivo se CASA por BUILD_ID: nunca se nombra un sha.
  const correrBuild = (id) => (cmd, args) =>
    args?.[0] === "exec" && args?.[2] === "cat" ? { status: 0, stdout: `${id}\n` } : { status: 1, stdout: "" };
  const listarFake = () => ({ dirs: ["/opt/onia-platform/build-aaa", "/opt/onia-platform/build-bbb"], origen: "remoto" });
  const leerFake = (ruta) => {
    if (ruta.endsWith("build-bbb/.next/standalone/.next/BUILD_ID")) return { contenido: "ID-VIVO\n", origen: "remoto" };
    if (ruta.endsWith("build-aaa/.next/standalone/.next/BUILD_ID")) return { contenido: "ID-VIEJO\n", origen: "remoto" };
    return null;
  };
  ok(
    arbolDelBuildVivo({ correr: correrBuild("ID-VIVO"), leer: leerFake, listar: listarFake }) ===
      "/opt/onia-platform/build-bbb",
    "el arbol vivo se casa por BUILD_ID, no por el ultimo staged",
  );
  ok(
    arbolDelBuildVivo({ correr: correrBuild("ID-QUE-NO-ESTA"), leer: leerFake, listar: listarFake }) === null,
    "un BUILD_ID sin par en disco es null, nunca el primero que haya",
  );
  ok(
    dosPasosExigido({ correr: correrBuild("ID-QUE-NO-ESTA"), leer: leerFake, listar: listarFake }).estado === null,
    "sin arbol vivo la puerta sale sin medir, nunca cerrada",
  );

  // Tri-estado en las dos puntas: no medir nunca es 0.
  ok(juzgarPuerta(doc(vivo), [{ ...PUERTAS[0], estado: null, motivo: "x" }]).codigo === 2, "sin medir el producto es 2, nunca 0");
  ok(juzgarPuerta(doc(vivo), []).codigo === 2, "cero puertas medidas es 2, nunca 0");
  ok(
    juzgarPuerta(doc(vivo), [soloCorreo[0], { ...PUERTAS[1], estado: null, motivo: "x" }]).codigo === 2,
    "una sola puerta ciega ya impide concluir, aunque la otra este medida",
  );
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

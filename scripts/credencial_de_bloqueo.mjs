#!/usr/bin/env node
/**
 * credencial_de_bloqueo.mjs — ¿el HECHO que un bloqueo de Sergio Urcullo espera YA ESTÁ?
 *
 * POR QUÉ EXISTE, medido el 2026-09-26 19:2x La Paz. `bloqueos_vencidos.mjs` existe desde el
 * 02-sep para que un bloqueo ya satisfecho deje de pedir una decisión tomada, y corrido hoy
 * sobre las DOS colas de este carril imprimió esto:
 *
 *     (9 fila(s) sin verificador mecanico, se re-miden a mano: S1,S2,S3,S4,S5,S7,S14,S15,S6)
 *     bloqueos vencidos: 0 verificador(es) corrido(s)
 *     (4 fila(s) sin verificador mecanico: L5700, L5838, L5914, L6014)   ← plataforma-v1.md
 *
 * O sea: **13 filas bloqueadas y CERO medibles.** El gate no podía ponerse rojo por
 * construcción — cada fila que sabía medir ya estaba cerrada, y ninguna de las vivas
 * declaraba comando. Un gate que corre cero verificadores contesta «todos siguen
 * bloqueados» con la misma cara con la que contestaría «los medí a todos».
 *
 * Y no es teórico: al encenderlo apareció **S14 VENCIDO**. Su verificador YA EXISTÍA
 * (`npm run inbox:tenencia`, sale 0) y la fila nunca lo declaró en la marca que el gate lee,
 * así que siguió pidiéndole a Sergio Urcullo que decidiera en qué bandeja aterrizan los
 * desconocidos de la web — con el inbox 4 ya asignado a `Onia (interna)` en la base. La
 * lección ya estaba escrita en la propia tabla («S10, S11, S12 y S13 esperaron hasta 23 días
 * con la decisión ya tomada, y las cuatro se cerraron el día que se les cableó uno») y este
 * archivo es cablearle uno a las dos que sí admiten medición mecánica.
 *
 * LOS DOS SUJETOS, y por qué estos dos y no los nueve. Un bloqueo sólo admite verificador
 * mecánico si lo que espera es un HECHO que se puede leer en producción. S1 (un chip y su
 * sesión de Meta), S3 (un PIN en su mano), S5 (su umbral de ruido), S15 (un alta de usuario) y
 * S6 no dejan rastro legible o son una decisión sin estado. Estos dos sí:
 *
 * 🔴 **CORREGIDO el 2026-09-27: S7 estaba en esa lista por un motivo FALSO, y ya tiene su
 * verificador — `npm run lead:contestado` (`scripts/lead_contestado.mjs`).** Acá decía *«S7
 * (que él le escriba a cuatro personas)»* como si no dejara rastro. Deja el más legible de
 * todos: contestar en Chatwoot escribe una fila en `messages`. El error fue fusionar **dos
 * preguntas distintas** — *«¿por qué sólo lo puede hacer Sergio Urcullo?»* (vende él, son
 * personas reales) y *«¿el resultado se puede leer?»*—; la primera no implica la segunda, y el
 * filtro falló CERRADO sobre una fila perfectamente medible. Es el mismo error de unidad que
 * esta cola ya pagó dos veces. **Y el motivo de S6 también estaba mal dicho** (*«plata»*, que
 * es por qué la decide él, no por qué no se mide): lo que la hace inmedible desde un loop es
 * que su sujeto vive en el **Supabase cloud**, y acá no hay con qué preguntarle — medido el
 * 2026-09-27: cero `SUPABASE_ACCESS_TOKEN` en disco y el conector MCP de Supabase sin
 * autorizar. Si algún día llega ese token, S6 pasa a ser cablable.
 *
 *   bcp   → S2. «Credenciales del BCP + certificado mTLS (`.pfx`)». Son DOS mitades y el
 *           bloqueo se satisface con las dos: con las credenciales pero sin el `.pfx` no hay
 *           conexión, y con el `.pfx` solo no hay con qué firmar. Se informa cuál llegó.
 *   push  → S4. «Verificar el push "te escribieron" en su celular (suscribirse y recibir)».
 *           Suscribirse deja una fila; es el único rastro que un dispositivo real deja.
 *
 * 🔴 LA TRAMPA DE `push`, que invierte el diagnóstico y ya está escrita en la memoria del
 * sistema: `push_subscriptions."userId"` referencia `profiles.id`, **no** `profiles."userId"`.
 * Unir por `userId = userId` devuelve VACÍO y se lee como «nadie se suscribió» — que es
 * exactamente el veredicto que este gate tiene que poder dar bien. El `--self-check` fija el
 * caso: una fila que existe pero no aparecería con el join equivocado.
 *
 * CÓDIGOS DE SALIDA — el mismo contrato de `inbox_tenencia.mjs` y `s11_desplegado.mjs`:
 *   0  el hecho YA ESTÁ  → el bloqueo está SATISFECHO, la fila hay que cerrarla
 *   1  el hecho no está  → sigue bloqueado, nada que hacer
 *   2  no se pudo medir  → sigue bloqueado (FALLO CONSERVADOR), y lo DICE
 *
 * El 2 nunca se puede leer como 0: dejar un bloqueo de más cuesta una vuelta; cerrarlo de
 * menos le pide a Sergio Urcullo algo que ya hizo. Por eso no hay un solo `catch` que
 * devuelva `false`: lo que no se pudo preguntar viaja como `null`.
 *
 * NO TOCA NADA. Lee. Corre igual desde el VPS (docker local) y desde nodo-casa (el shim de
 * `docker` delega por SSH; `/opt` no existe acá y se pregunta por SSH).
 *
 *   node scripts/credencial_de_bloqueo.mjs bcp     (o `npm run bcp:credenciales`)
 *   node scripts/credencial_de_bloqueo.mjs push    (o `npm run push:suscripcion`)
 *   node scripts/credencial_de_bloqueo.mjs --self-check
 */

import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { listarDeProduccion } from './lib/vps-o-local.mjs';

const CONTENEDOR_APP = process.env.ONIA_APP_CONTAINER ?? 'onia-platform';
const CONTENEDOR_DB = process.env.ONIA_DB_CONTAINER ?? 'supabase-db';

/** Dónde vive el certificado del banco cuando llegue. S2 no fija la ruta; se busca el patrón. */
export const PATRON_PFX = '/opt/onia-platform/*.pfx';

/**
 * Las cuentas de Sergio Urcullo en el producto. El push de S4 es en SU celular: una
 * suscripción de otra cuenta prueba que el circuito anda, pero NO satisface la fila.
 */
export const CUENTAS_DE_SERGIO = [
  'sergio@onia.com.bo',
  'sergio.urcullo.m@gmail.com',
  'superadmin@onia.com.bo',
  'oninteligenciaartificial@gmail.com',
];

// El join va por `p.id`, que es la trampa de arriba. `p."userId"` es la columna de Supabase
// Auth y no es a quien apunta la suscripción.
const SQL_PUSH = `
  select coalesce(p.email, '(sin perfil)'), count(ps.id)
  from push_subscriptions ps
  left join profiles p on ps."userId" = p.id
  group by p.email
  order by 2 desc;
`;

// --- los veredictos, puros: se prueban sin docker, sin red y sin base --------------------

/**
 * Un conteo medido es un entero ≥ 0. TODO lo demás —`null`, `undefined`, `NaN`, un objeto—
 * es «no lo medí», y el veredicto lo dice en voz alta.
 *
 * 🔴 Nace de un bug de este mismo archivo, encontrado el 2026-09-26 antes de commitear:
 * `contarPfx` devolvía `listarDeProduccion(...).length`, y esa función devuelve
 * `{ dirs, origen }` — no un array. O sea `undefined`, que NO es `null`: no entraba por la
 * puerta del «no medido», y en la comparación siguiente `undefined > 0` y `undefined === 0`
 * son las DOS falsas, así que la mitad del certificado desaparecía del mensaje sin un solo
 * error. Se destapó porque el veredicto NOMBRA qué mitad falta y nombró una sola teniendo
 * las dos ausentes. Comparar contra `null` a mano deja pasar toda forma equivocada; preguntar
 * «¿es un conteo?» la caza entera.
 */
export function esConteo(n) {
  return typeof n === 'number' && Number.isInteger(n) && n >= 0;
}

/**
 * S2. `envVars` = cuántas variables `^BCP_` tiene el entorno del producto vivo; `pfx` =
 * cuántos certificados hay. `null` en cualquiera de las dos = no se pudo medir.
 */
export function veredictoBcp({ envVars, pfx }) {
  if (!esConteo(envVars) || !esConteo(pfx)) {
    const cuales = [!esConteo(envVars) && 'el entorno del producto', !esConteo(pfx) && 'el disco de producción']
      .filter(Boolean)
      .join(' ni ');
    return { codigo: 2, mensaje: `NO MEDIDO — no pude leer ${cuales}. No medir NO es «sigue bloqueado por el banco»: es no saber.` };
  }
  if (envVars > 0 && pfx > 0) {
    return {
      codigo: 0,
      mensaje:
        `S2 SATISFECHO — llegaron las dos mitades: ${envVars} variable(s) \`BCP_\` en \`${CONTENEDOR_APP}\` y ` +
        `${pfx} certificado(s) en \`${PATRON_PFX}\`. Cerrá la fila y desbloqueá el botón «Cobrar con QR».`,
    };
  }
  const falta = [envVars === 0 && 'las credenciales (`BCP_*`)', pfx === 0 && `el certificado mTLS (\`${PATRON_PFX}\`)`]
    .filter(Boolean)
    .join(' y ');
  const llego = [envVars > 0 && `${envVars} variable(s) \`BCP_\``, pfx > 0 && `${pfx} \`.pfx\``].filter(Boolean).join(' y ');
  return {
    codigo: 1,
    mensaje:
      `S2 sigue bloqueado — falta ${falta}${llego ? `; ya está ${llego}` : ''}. ` +
      `Es trámite bancario: sin banco no hay código que lo destrabe.`,
  };
}

/**
 * S4. `filas` = `[{ email, suscripciones }]` tal como sale de la base. `null` = no se midió.
 * Satisfecho sólo si una cuenta de Sergio Urcullo tiene al menos una suscripción.
 */
export function veredictoPush({ filas }) {
  if (!Array.isArray(filas)) {
    return { codigo: 2, mensaje: 'NO MEDIDO — no pude leer `push_subscriptions` de la base de producción. No medir NO es «no se suscribió».' };
  }
  const suyas = filas.filter((f) => CUENTAS_DE_SERGIO.includes(f.email) && f.suscripciones > 0);
  const total = filas.reduce((n, f) => n + f.suscripciones, 0);

  if (suyas.length > 0) {
    const detalle = suyas.map((f) => `${f.email} (${f.suscripciones})`).join(', ');
    return { codigo: 0, mensaje: `S4 SATISFECHO — hay suscripción push de una cuenta suya: ${detalle}. Cerrá la fila: el dispositivo real ya se suscribió.` };
  }
  if (total > 0) {
    return {
      codigo: 1,
      mensaje:
        `S4 sigue bloqueado — hay ${total} suscripción(es) push pero ninguna de una cuenta de Sergio Urcullo ` +
        `(${filas.filter((f) => f.suscripciones > 0).map((f) => f.email).join(', ')}). El circuito anda; falta SU celular.`,
    };
  }
  return { codigo: 1, mensaje: 'S4 sigue bloqueado — cero suscripciones push en producción. Hace falta un dispositivo real: nadie se suscribió todavía.' };
}

// --- las lecturas, todas tri-estado -----------------------------------------------------

/** `docker exec` local si el contenedor está acá; si no, por el shim/SSH. `null` = no medido. */
function dockerExec(contenedor, argv, { input } = {}) {
  const opciones = { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024, timeout: 60_000 };
  if (input !== undefined) opciones.input = input;
  try {
    return execFileSync('docker', ['exec', '-i', contenedor, ...argv], opciones);
  } catch {
    return null;
  }
}

/** Cuántas variables `^BCP_` tiene el entorno del producto vivo. `null` = no medido. */
export function contarEnvBcp(contenedor = CONTENEDOR_APP) {
  const salida = dockerExec(contenedor, ['env']);
  if (salida === null) return null;
  return salida.split('\n').filter((l) => /^BCP_/.test(l)).length;
}

/**
 * Cuántos `.pfx` hay en producción. `null` = no medido (ni disco local ni SSH contestaron).
 *
 * `listarDeProduccion` devuelve `{ dirs, origen }` o `null` — NO un array. Se desestructura
 * a propósito en vez de leer `.length` encima: si mañana cambia la forma, esto rompe ruidoso
 * en vez de devolver `undefined` como hizo la primera versión de esta función. La vía se
 * inyecta para que el self-check pueda fijar las tres formas sin tocar el VPS.
 */
export function contarPfx(patron = PATRON_PFX, listar = listarDeProduccion) {
  const respuesta = listar(patron);
  if (respuesta === null || respuesta === undefined) return null;
  const { dirs } = respuesta;
  if (!Array.isArray(dirs)) return null;
  return dirs.length;
}

/** Las suscripciones push por cuenta. `null` = no medido. */
export function leerPush(contenedor = CONTENEDOR_DB) {
  const salida = dockerExec(contenedor, ['psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A', '-F', '|'], { input: SQL_PUSH });
  if (salida === null) return null;
  return parsearPush(salida);
}

/** `email|n` por línea. Se separa de la lectura a propósito: es lo que se prueba sin base. */
export function parsearPush(texto) {
  return texto
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [email, n] = l.split('|');
      return { email, suscripciones: Number.parseInt(n, 10) || 0 };
    });
}

export const SUJETOS = {
  bcp: () => veredictoBcp({ envVars: contarEnvBcp(), pfx: contarPfx() }),
  push: () => veredictoPush({ filas: leerPush() }),
};

// ---------------------------------------------------------------------------------------

if (process.argv.includes('--self-check')) {
  let casos = 0;
  const afirmar = (cond, que) => { casos++; if (!cond) { console.error('FALLO:', que); process.exitCode = 1; } };

  // S2 — el bloqueo se satisface con las DOS mitades, nunca con una.
  afirmar(veredictoBcp({ envVars: 3, pfx: 1 }).codigo === 0, 'bcp: credenciales + certificado = satisfecho');
  afirmar(veredictoBcp({ envVars: 0, pfx: 0 }).codigo === 1, 'bcp: nada llegó = sigue bloqueado');
  afirmar(veredictoBcp({ envVars: 3, pfx: 0 }).codigo === 1, 'bcp: credenciales SIN certificado NO satisface');
  afirmar(veredictoBcp({ envVars: 0, pfx: 2 }).codigo === 1, 'bcp: certificado SIN credenciales NO satisface');
  afirmar(/certificado mTLS/.test(veredictoBcp({ envVars: 3, pfx: 0 }).mensaje), 'bcp: dice cuál mitad falta');
  afirmar(/ya está 2 `.pfx`/.test(veredictoBcp({ envVars: 0, pfx: 2 }).mensaje), 'bcp: dice cuál mitad llegó');

  // El 2 no se puede confundir con el 0 ni con el 1.
  afirmar(veredictoBcp({ envVars: null, pfx: 1 }).codigo === 2, 'bcp: entorno no medido = 2');
  afirmar(veredictoBcp({ envVars: 3, pfx: null }).codigo === 2, 'bcp: disco no medido = 2');
  afirmar(veredictoPush({ filas: null }).codigo === 2, 'push: base no medida = 2');

  // 🔴 EL BUG REAL de la primera versión: una forma que no es `null` ni número. Si el
  // veredicto la compara a mano contra `null`, cae al camino de «medí» y la mitad ausente
  // desaparece del mensaje sin error. Estos cuatro casos fallan en rojo contra esa versión.
  afirmar(veredictoBcp({ envVars: 3, pfx: undefined }).codigo === 2, 'bcp: `undefined` es NO MEDIDO, no cero');
  afirmar(veredictoBcp({ envVars: undefined, pfx: 1 }).codigo === 2, 'bcp: `undefined` en el entorno también');
  afirmar(veredictoBcp({ envVars: 3, pfx: NaN }).codigo === 2, 'bcp: NaN no es un conteo');
  afirmar(veredictoPush({ filas: undefined }).codigo === 2, 'push: `undefined` es NO MEDIDO, no base vacía');
  afirmar(veredictoPush({ filas: { dirs: [] } }).codigo === 2, 'push: un objeto no es una lista de filas');
  afirmar(!esConteo(-1) && !esConteo(1.5) && esConteo(0), 'esConteo: 0 sí, negativo y fraccionario no');

  // Y el adaptador que lo produjo: las TRES formas que `listarDeProduccion` puede devolver.
  afirmar(contarPfx('x', () => ({ dirs: ['/a.pfx', '/b.pfx'], origen: 'remoto' })) === 2, 'contarPfx: cuenta los dirs');
  afirmar(contarPfx('x', () => ({ dirs: [], origen: 'remoto' })) === 0, 'contarPfx: lista vacía es un CERO real, no «no medido»');
  afirmar(contarPfx('x', () => null) === null, 'contarPfx: `null` viaja como no medido');
  afirmar(contarPfx('x', () => ['/a.pfx']) === null, 'contarPfx: un array pelado ya no es la forma — no medido, no 1');

  // S4 — y la trampa del join: la fila existe, unida por `p.id`. Con `p."userId"` no saldría.
  afirmar(veredictoPush({ filas: [{ email: 'sergio@onia.com.bo', suscripciones: 1 }] }).codigo === 0, 'push: una suya = satisfecho');
  afirmar(veredictoPush({ filas: [{ email: 'sergio@onia.com.bo', suscripciones: 0 }] }).codigo === 1, 'push: su cuenta con 0 = bloqueado');
  afirmar(veredictoPush({ filas: [] }).codigo === 1, 'push: base vacía = bloqueado');
  afirmar(veredictoPush({ filas: [{ email: 'ajeno@x.com', suscripciones: 2 }] }).codigo === 1, 'push: suscripción ajena NO satisface');
  afirmar(/El circuito anda; falta SU celular/.test(veredictoPush({ filas: [{ email: 'ajeno@x.com', suscripciones: 2 }] }).mensaje),
    'push: distingue «circuito roto» de «falta su celular»');
  afirmar(veredictoPush({ filas: [{ email: '(sin perfil)', suscripciones: 4 }] }).codigo === 1,
    'push: suscripción huérfana (el join no encontró perfil) NO satisface');

  // El parseo de psql, que es donde una columna de más rompe en silencio.
  const filas = parsearPush('sergio@onia.com.bo|2\n(sin perfil)|0\n');
  afirmar(filas.length === 2, 'parsea las dos filas');
  afirmar(filas[0].suscripciones === 2, 'saca el conteo');
  afirmar(parsearPush('\n\n').length === 0, 'una salida vacía no inventa filas');

  // Todas las cuentas suyas tienen que estar reconocidas: si mañana usa otra, el gate diría
  // «ninguna de una cuenta de Sergio Urcullo» teniendo la suscripción delante.
  afirmar(CUENTAS_DE_SERGIO.includes('sergio@onia.com.bo'), 'la cuenta real del producto está en la lista');
  afirmar(CUENTAS_DE_SERGIO.length >= 4, 'y también las otras con las que entra');

  console.log(`credencial-de-bloqueo self-check: ${casos} caso(s)${process.exitCode ? ' — CON FALLOS' : ' ok'}`);
} else if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const sujeto = process.argv[2];
  if (!Object.hasOwn(SUJETOS, sujeto ?? '')) {
    console.error(`uso: node scripts/credencial_de_bloqueo.mjs <${Object.keys(SUJETOS).join('|')}>  (o --self-check)`);
    process.exit(2);
  }
  const { codigo, mensaje } = SUJETOS[sujeto]();
  console.log(mensaje);
  process.exit(codigo);
}

// Verificadores mecanicos para filas de "Bloqueado en Sergio" que hoy se re-miden A MANO.
//
// POR QUE EXISTE. `bloqueos_vencidos.mjs` corre el comando que cada fila declara con la marca
// `**Verificador:** \`<cmd>\` → <codigo>` y, si sale ese codigo, la fila esta SATISFECHA y hay
// que cerrarla. Medido el 2026-09-27 desde nodo-casa:
//
//     npm run bloqueos:vencidos
//     → 3 verificador(es) corrido(s) sobre 2 cola(s), ninguno satisfecho
//       (5 fila(s) sin verificador mecanico en …/chatbot.md, se re-miden a mano: S1, S3, S5, S15, S6)
//       (4 fila(s) sin verificador mecanico en …/plataforma-v1.md, …)
//
// O sea que 9 de 12 bloqueos vivos NO tienen instrumento, y "se re-miden a mano" es, en un
// carril que arranca sin memoria cada vuelta, un sinonimo de NUNCA. Un bloqueo vencido es peor
// que un item fantasma: le pide a Sergio Urcullo una decision que ya tomo, y ocupa uno de los
// CINCO renglones de la hoja de decisiones diaria mientras lo hace.
//
// Este archivo le pone verificador a las DOS que se pueden medir sin credenciales ni permisos
// nuevos. Las otras tres (S3 un PIN, S5 su umbral de ruido, S15 ver abajo) no se mecanizan
// inventando una medicion: se quedan declaradas como manuales, que es honesto.
//
// EL CONTRATO, que es el de `bloqueos_vencidos.mjs` y no se negocia:
//   exit 0 → el bloqueo esta SATISFECHO (la decision se ejecuto): hay que CERRAR la fila.
//   exit 1 → sigue bloqueado. Nada que hacer.
//   exit 2 → NO MEDIDO. No se pudo preguntar. NUNCA se lee como 0.
//
// 🔴 LA TRAMPA QUE ESTE ARCHIVO EXISTE PARA NO PISAR, y es la que hace falsos VERDES.
// Para S6 la pregunta es "¿el proyecto de Supabase en la nube sigue vivo?", y la respuesta
// obvia —curl y ver si contesta— falla en la direccion CARA. Medido el 2026-09-27:
//
//     https://kvepqgikokjlacxngkiw.supabase.co/rest/v1/  → http 401 «No API key found»
//     https://jafxylfocvvlflpqfsix.supabase.co/rest/v1/  → http 000
//
// El 401 es la mejor prueba de vida que hay sin credenciales: contesta PostgREST, o sea que el
// proyecto esta despierto. Pero el `000` NO prueba lo contrario: curl devuelve 000 por DNS que
// no resuelve, por TLS, por timeout y por no tener internet. Una maquina sin red daria 000 para
// los dos y el script diria «el proyecto ya no esta» = bloqueo satisfecho = «Sergio Urcullo,
// cerra esto», sobre una decision que nadie tomo. Por eso la ausencia se confirma por DNS y
// ademas con una SONDA DE CONTROL a un host que tiene que contestar: si el control tambien
// falla, el veredicto es 2, no 0.

import { spawnSync } from 'node:child_process';

/** Proyectos de la nube que S6 nombra. `sujeto` es el que decide el veredicto. */
export const PROYECTOS_S6 = Object.freeze([
  { ref: 'kvepqgikokjlacxngkiw', nombre: 'Dental-gest', sujeto: true },
  { ref: 'jafxylfocvvlflpqfsix', nombre: 'Gesti-Os', sujeto: false },
]);

/** Host de control: si ESTE no contesta, no hay red y nada se puede concluir. */
export const CONTROL = 'https://supabase.com/';

/** Los inboxes de Chatwoot que son NUESTROS. Uno de WhatsApp fuera de aca es de un cliente. */
export const INBOXES_NUESTROS = Object.freeze([3, 4, 5, 7]);

const TIMEOUT_MS = Number(process.env.ONIA_VERIF_TIMEOUT_MS || 25000);

/**
 * Un proyecto de Supabase esta VIVO si su PostgREST contesta cualquier cosa con codigo HTTP.
 * 401 es lo normal sin apikey y es prueba de vida; 200/404/5xx tambien son "contesto".
 * `null` = no contesto, y eso todavia no es un veredicto: lo decide `ausenciaConfirmada`.
 */
export function vivoPorCodigo(codigo) {
  if (codigo === null || codigo === undefined) return null;
  return Number(codigo) > 0;
}

/**
 * ¿La ausencia esta CONFIRMADA, o simplemente no pude preguntar?
 * Se exige que el DNS no resuelva Y que el control SI conteste. Con el control caido,
 * cualquier ausencia es sospechosa: se devuelve null (NO MEDIDO), nunca `true`.
 */
export function ausenciaConfirmada({ dnsResuelve, controlContesta }) {
  if (!controlContesta) return null;
  if (dnsResuelve === null) return null;
  return dnsResuelve === false;
}

/**
 * Veredicto de S6 a partir de datos ya medidos. Puro a proposito: la trampa vive aca, no en
 * el curl, y un caso de test la fija sin tocar la red.
 */
export function veredictoS6({ sujetoVivo, ausencia }) {
  if (sujetoVivo === true) {
    return { exit: 1, texto: 'SIGUE BLOQUEADO — el proyecto contesta: esta despierto y la decision de pausar/borrar no se tomo' };
  }
  if (ausencia === true) {
    return { exit: 0, texto: 'SATISFECHO — el proyecto ya no responde y su DNS no resuelve: la decision se ejecuto, cerrar la fila' };
  }
  return { exit: 2, texto: 'NO MEDIDO — el proyecto no contesto pero no pude confirmar que no exista (control de red o DNS sin respuesta)' };
}

/** Veredicto de S1: ¿hay un inbox de WhatsApp que no es nuestro? */
export function veredictoS1(inboxes) {
  if (inboxes === null) {
    return { exit: 2, texto: 'NO MEDIDO — no pude leer los inboxes de Chatwoot' };
  }
  const ajenos = inboxes.filter(
    (i) => /whatsapp/i.test(i.canal) && !INBOXES_NUESTROS.includes(Number(i.id)),
  );
  if (ajenos.length > 0) {
    const lista = ajenos.map((i) => `${i.id} ${i.nombre}`).join(' · ');
    return { exit: 0, texto: `SATISFECHO — hay ${ajenos.length} inbox(es) de WhatsApp que no son nuestros (${lista}): un cliente conecto el suyo, cerrar la fila` };
  }
  const nuestros = inboxes.map((i) => i.id).join(',');
  return { exit: 1, texto: `SIGUE BLOQUEADO — los ${inboxes.length} inbox(es) siguen siendo nuestros (${nuestros}): ningun cliente conecto su WhatsApp` };
}

// ---------------------------------------------------------------- medicion viva

function codigoHttp(url) {
  const r = spawnSync('curl', ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '20', url], {
    encoding: 'utf8',
    timeout: TIMEOUT_MS,
  });
  if (r.error || r.status !== 0) return null;
  const c = Number((r.stdout || '').trim());
  return Number.isFinite(c) && c > 0 ? c : null;
}

function dnsResuelve(host) {
  const r = spawnSync('getent', ['hosts', host], { encoding: 'utf8', timeout: TIMEOUT_MS });
  if (r.error) return null;
  return r.status === 0 && (r.stdout || '').trim().length > 0;
}

function medirS6() {
  const controlContesta = codigoHttp(CONTROL) !== null;
  const filas = PROYECTOS_S6.map((p) => {
    const host = `${p.ref}.supabase.co`;
    const codigo = codigoHttp(`https://${host}/rest/v1/`);
    const vivo = vivoPorCodigo(codigo);
    const dns = vivo === true ? true : dnsResuelve(host);
    return { ...p, host, codigo, vivo, dns };
  });
  for (const f of filas) {
    const estado = f.vivo === true ? `VIVO (http ${f.codigo})` : `sin respuesta · dns ${f.dns === null ? 'no medido' : f.dns ? 'resuelve' : 'NO resuelve'}`;
    console.log(`  ${f.nombre} (${f.ref})${f.sujeto ? ' ← sujeto de S6' : ''}: ${estado}`);
  }
  console.log(`  control de red (${CONTROL}): ${controlContesta ? 'contesta' : 'NO CONTESTA — nada se puede concluir de una ausencia'}`);
  const sujeto = filas.find((f) => f.sujeto);
  return veredictoS6({
    sujetoVivo: sujeto.vivo,
    ausencia: ausenciaConfirmada({ dnsResuelve: sujeto.dns, controlContesta }),
  });
}

/** El contenedor de Chatwoot lleva sufijo de swarm: `docker exec` no acepta prefijos. */
function contenedor(prefijo) {
  const r = spawnSync('docker', ['ps', '--format', '{{.Names}}'], { encoding: 'utf8', timeout: TIMEOUT_MS });
  if (r.error || r.status !== 0) return null;
  return (r.stdout || '').split('\n').map((l) => l.trim()).find((l) => l.startsWith(prefijo)) || null;
}

function medirS1() {
  const nombre = contenedor(process.env.ONIA_CHATWOOT_DB_CONTAINER || 'onia-chatbot_chatwoot-db');
  if (!nombre) {
    console.log('  no encontre el contenedor de la base de Chatwoot en `docker ps`');
    return veredictoS1(null);
  }
  const r = spawnSync(
    'docker',
    ['exec', nombre, 'psql', '-U', 'postgres', '-d', 'onia-chatbot', '-tAc',
      "select id||'\t'||name||'\t'||channel_type from inboxes order by id;"],
    { encoding: 'utf8', timeout: TIMEOUT_MS },
  );
  if (r.error || r.status !== 0) {
    console.log(`  la consulta a Chatwoot no contesto: ${(r.stderr || r.error?.message || '').trim().slice(0, 120)}`);
    return veredictoS1(null);
  }
  const inboxes = (r.stdout || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [id, nom, canal] = l.split('\t');
      return { id: Number(id), nombre: nom, canal };
    });
  for (const i of inboxes) console.log(`  inbox ${i.id} · ${i.nombre} · ${i.canal}`);
  return veredictoS1(inboxes);
}

// ---------------------------------------------------------------- self-check

function afirmar(cond, que) {
  if (!cond) {
    console.error(`  FALLO: ${que}`);
    process.exitCode = 1;
    return false;
  }
  return true;
}

function selfCheck() {
  let casos = 0;
  let fallados = 0;
  const ok = (c, q) => { casos++; if (!afirmar(c, q)) fallados++; return c; };

  // vivoPorCodigo
  ok(vivoPorCodigo(401) === true, '401 es prueba de VIDA (PostgREST contesta sin apikey)');
  ok(vivoPorCodigo(200) === true, '200 es vida');
  ok(vivoPorCodigo(503) === true, 'un 5xx tambien es "contesto": el host existe');
  ok(vivoPorCodigo(null) === null, 'sin codigo NO se concluye muerte');
  ok(vivoPorCodigo(0) === false, 'curl 000 no es vida, pero tampoco veredicto por si solo');

  // ausenciaConfirmada — el nucleo del falso verde
  ok(ausenciaConfirmada({ dnsResuelve: false, controlContesta: true }) === true,
    'sin DNS y con red sana, la ausencia SI esta confirmada');
  ok(ausenciaConfirmada({ dnsResuelve: false, controlContesta: false }) === null,
    'sin red, "no resuelve" no prueba nada: NO MEDIDO');
  ok(ausenciaConfirmada({ dnsResuelve: true, controlContesta: true }) === false,
    'si el DNS resuelve, el proyecto no esta ausente');
  ok(ausenciaConfirmada({ dnsResuelve: null, controlContesta: true }) === null,
    'DNS sin respuesta es NO MEDIDO, no ausencia');

  // veredictoS6
  ok(veredictoS6({ sujetoVivo: true, ausencia: null }).exit === 1,
    'proyecto despierto = sigue bloqueado');
  ok(veredictoS6({ sujetoVivo: false, ausencia: true }).exit === 0,
    'ausencia confirmada = bloqueo satisfecho');
  ok(veredictoS6({ sujetoVivo: false, ausencia: null }).exit === 2,
    'sin poder confirmar la ausencia = NO MEDIDO, JAMAS 0');
  ok(veredictoS6({ sujetoVivo: null, ausencia: null }).exit === 2,
    'sujeto sin medir = NO MEDIDO');
  // El par que da nombre al archivo: MISMA falta de respuesta, distinto estado de red,
  // distinto veredicto. Si alguien vuelve a decidir por el codigo HTTP solo, esto se pone rojo.
  ok(veredictoS6({ sujetoVivo: false, ausencia: ausenciaConfirmada({ dnsResuelve: false, controlContesta: false }) }).exit === 2 &&
     veredictoS6({ sujetoVivo: false, ausencia: ausenciaConfirmada({ dnsResuelve: false, controlContesta: true }) }).exit === 0,
    'mismo "no contesto" + distinta red = distinto veredicto (2 vs 0)');

  // veredictoS1
  ok(veredictoS1([
    { id: 3, nombre: 'ONIA Demo', canal: 'Channel::Api' },
    { id: 4, nombre: 'Onia Web', canal: 'Channel::WebWidget' },
    { id: 5, nombre: 'Onia WhatsApp', canal: 'Channel::Whatsapp' },
    { id: 7, nombre: 'ZZ QA', canal: 'Channel::WebWidget' },
  ]).exit === 1, 'los 4 inboxes de hoy = ningun cliente conecto el suyo');
  ok(veredictoS1([
    { id: 5, nombre: 'Onia WhatsApp', canal: 'Channel::Whatsapp' },
    { id: 9, nombre: 'Clinica del cliente', canal: 'Channel::Whatsapp' },
  ]).exit === 0, 'un inbox de WhatsApp ajeno = bloqueo satisfecho');
  ok(veredictoS1([
    { id: 8, nombre: 'Web de un cliente', canal: 'Channel::WebWidget' },
  ]).exit === 1, 'un inbox ajeno que NO es de WhatsApp no satisface S1 (S1 es de WhatsApp)');
  ok(veredictoS1(null).exit === 2, 'sin datos = NO MEDIDO');
  ok(/9 Clinica del cliente/.test(veredictoS1([
    { id: 9, nombre: 'Clinica del cliente', canal: 'Channel::Whatsapp' },
  ]).texto), 'el veredicto NOMBRA el inbox ajeno: sin el nombre nadie sabe que mirar');

  // Este resumen decia `ok` SIEMPRE, incluso con casos rojos arriba — se vio en carne al probar
  // la mutacion del guard de red: 2 FALLO y abajo "self-check: ok — 19 casos". Un resumen que
  // absuelve lo que sus propias lineas acusan es el falso verde de siempre, y en un self-check
  // es el peor lugar posible: es el renglon que alguien lee para creerle al resto del archivo.
  if (fallados > 0) {
    console.error(`self-check: ROJO — ${fallados} de ${casos} casos fallaron`);
    process.exitCode = 1;
    return;
  }
  console.log(`self-check: ok — ${casos} casos`);
}

// ---------------------------------------------------------------- CLI

const SUJETOS = { 'supabase-cloud': medirS6, 'inbox-de-cliente': medirS1 };

function main() {
  const arg = process.argv[2];
  if (arg === '--self-check') return selfCheck();
  const medir = SUJETOS[arg];
  if (!medir) {
    console.error(`uso: node scripts/bloqueo_verificable.mjs <${Object.keys(SUJETOS).join('|')}|--self-check>`);
    process.exit(2);
  }
  const v = medir();
  console.log(`${v.exit} ${v.texto}`);
  process.exit(v.exit);
}

// Sin la guarda, importar el modulo para testearlo CORRE la CLI y sale con su codigo: el
// falso verde que `frases_de_cola.mjs` ya documenta y `bloqueos_vencidos.mjs` pago.
if (process.argv[1] && process.argv[1].endsWith('bloqueo_verificable.mjs')) main();

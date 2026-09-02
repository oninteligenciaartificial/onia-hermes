#!/usr/bin/env node
/**
 * inbox_tenencia.mjs — ¿la bandeja del objetivo sigue siendo de quien tiene que ser?
 *
 * Nace del 2026-09-02, auditando los `[x]` de `hermes-content/docs/cola/chatbot.md`. El item
 * "El objetivo del carril se REVIRTIO en silencio" seguia siendo CIERTO hoy (medido: `Onia
 * (interna)` → inbox 5, `updatedAt` 05:09:11, el UPDATE de la restauracion) pero se cerro
 * dejando escrito su propio agujero:
 *
 *   "Ningun gate de este carril mide hoy la tenencia del inbox 5 (...). Se deja escrito el
 *    comando de verificacion para el proximo Gate 1 que toque /inbox o S7/S8."
 *
 * Un comando de verificacion parado en un documento es exactamente el molde con el que **S16
 * vencio en silencio** y con el que **S11 se comprobaba a mano**: lo declarado no lo corre
 * nadie. Este script es ese comando, ejecutable.
 *
 *   node scripts/inbox_tenencia.mjs      (o `npm run inbox:tenencia`)
 *   node scripts/inbox_tenencia.mjs --self-check
 *
 * POR QUE IMPORTA MAS QUE LOS OTROS GATES. Los tres que ya existen —`espejo-check`,
 * `campanas-vivas`, `marca-chatwoot`— miden codigo y HTML publico. Este mide una COLUMNA de
 * produccion, y es la unica que decide si el objetivo del carril se ve: `/inbox` muestra las
 * conversaciones del inbox que dice `clinic_settings.chatwootInboxId` de la org, y solo esa
 * (`lib/chatbot/bandeja-auth.ts:22`). Con el 5, la bandeja trae a mariohassen y a F —los dos
 * leads de WhatsApp que **S7** da por visibles—; con el 4 quedan invisibles otra vez y S7 se
 * rompe sin que nada avise. Ya paso: la fila se BORRO y se re-creo por fuera de la app a las
 * 02:02 del 1-sep, y el mecanismo sigue sin identificarse.
 *
 * QUE MIDE, y son DOS invariantes, no una:
 *
 *   1. `Onia (interna)` tiene el inbox 5 — la tenencia que S8 dejo cerrada.
 *
 *   2. Ningun inbox pertenece a DOS orgs. No es hipotetico: medido hoy contra
 *      `prisma/schema.prisma:1002`, `chatwootInboxId` es `Int?` **sin `@unique`**, y
 *      `ClinicSettings` no tiene `@@unique` sobre esa columna. El 409 que impide la colision
 *      vive solo en `app/api/admin/organizations/[id]/whatsapp/route.ts`, o sea en la APP —
 *      y la escritura que rompio esto la primera vez no paso por la app. Una escritura directa
 *      puede dejar dos orgs mirandose las conversaciones entre si, y la base no lo impide.
 *      (La cola decia que la columna era "un `Int?` unico"; lo unico cierto de esa frase es que
 *      una org tiene UN inbox, porque es una columna escalar. Al reves no lo garantiza nadie.)
 *
 * CODIGOS DE SALIDA
 *   0  la tenencia esta como tiene que estar  → el objetivo sigue visible
 *   1  la tenencia se movio, o hay colision   → `/inbox` esta mostrando otra cosa
 *   2  no se pudo medir (docker/ssh caido)    → no medir NO es estar bien
 *
 * FALLO CONSERVADOR, igual que `bloqueos_vencidos.mjs` y `s11_desplegado.mjs`.
 *
 * NO TOCA NADA. Lee. Si `docker` esta en esta maquina (el loop corre DENTRO del VPS desde el
 * 2026-09-01) se ejecuta directo; si no, se cae al SSH. Env opcionales: ONIA_VPS_HOST,
 * ONIA_VPS_KEY, ONIA_DB_CONTAINER.
 */

import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

/** La org cuya bandeja ES el objetivo del carril. */
export const ORG = 'Onia (interna)';

/** El inbox de WhatsApp del +591 75414930, el que S8 dejo cerrado. */
export const INBOX = 5;

/**
 * La consulta. Va por STDIN y no por `-c` a proposito: `"chatwootInboxId"` necesita comillas
 * dobles (Postgres pliega a minusculas los identificadores sin comillar), y meterla dentro de
 * un `-c "..."` que a su vez viaja dentro de un `ssh '...'` es tres niveles de escapado que se
 * rompen solos. `ssh` reenvia stdin al comando remoto, asi que el SQL nunca toca un shell.
 */
export const SQL =
  'select o.name, cs."chatwootInboxId", cs.id ' +
  'from public.organizations o ' +
  'left join public.clinic_settings cs on cs."organizationId" = o.id ' +
  'order by o.id;';

/**
 * Parsea la salida de `psql -t -A -F |`. Una fila por org: `nombre|inbox|idDeLaFila`, con el
 * inbox vacio cuando es NULL y las tres partes vacias cuando la org no tiene `clinic_settings`.
 *
 * El nombre de la org puede traer parentesis y espacios (`Onia (interna)`) pero nunca un `|`,
 * asi que partir por `|` es seguro. Se parte con limite: si algun dia un nombre trajera el
 * separador, el corte extra caeria en `id` y no correria el inbox de lugar.
 */
export function parsearFilas(texto) {
  return String(texto)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((linea) => {
      const partes = linea.split('|');
      const nombre = partes[0];
      const inbox = partes[1] === undefined || partes[1] === '' ? null : Number(partes[1]);
      return { nombre, inbox: Number.isFinite(inbox) ? inbox : null, id: partes[2] || '' };
    });
}

/**
 * De donde salio la fila, leido de la FORMA de su id. Es la pista forense que la cola manda
 * mirar: "mirar `id`/`createdAt` de la fila antes de asumir que fue un click".
 *
 * `ClinicSettings.id` es `@default(cuid())` (`prisma/schema.prisma:989`) en los cuatro lugares
 * de la app que crean la fila, y un cuid no lleva guiones. Un UUID con guiones significa que la
 * fila se escribio POR FUERA de la app.
 *
 * ⚠️ Es INFORMACION en el mensaje, nunca el veredicto — y la distincion no es un matiz. Hoy la
 * fila buena de `Onia (interna)` TIENE un id UUID (`ab6e629f-…`): la restauracion fue un UPDATE
 * sobre la fila que el mecanismo desconocido dejo, no una fila nueva. Si el gate se pusiera rojo
 * por el formato del id, estaria rojo para siempre con la tenencia correcta — el mismo modo de
 * falla que `s11_desplegado.mjs` documenta: un verificador que no puede ponerse verde es peor
 * que ninguno.
 */
export function escritaPorFuera(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id));
}

/** Los inboxes reclamados por mas de una org. La base no lo impide: no hay `@unique`. */
export function colisiones(filas) {
  const porInbox = new Map();
  for (const f of filas) {
    if (f.inbox === null) continue;
    porInbox.set(f.inbox, [...(porInbox.get(f.inbox) || []), f.nombre]);
  }
  return [...porInbox.entries()]
    .filter(([, orgs]) => orgs.length > 1)
    .map(([inbox, orgs]) => ({ inbox, orgs: orgs.sort() }))
    .sort((a, b) => a.inbox - b.inbox);
}

/** El veredicto, separado de la lectura a proposito: es lo que se prueba sin docker ni red. */
export function juzgar(filas) {
  if (!filas.length) {
    return {
      codigo: 2,
      mensaje:
        'NO MEDIDO — la consulta no devolvio ninguna org. No medir NO es estar bien: puede que ' +
        'la base sea la equivocada. La de produccion es el contenedor `supabase-db`, schema `public`.',
    };
  }

  const choques = colisiones(filas);
  if (choques.length) {
    const detalle = choques.map((c) => `inbox ${c.inbox} → ${c.orgs.join(' + ')}`).join('; ');
    return {
      codigo: 1,
      mensaje:
        `COLISION — un inbox pertenece a mas de una org: ${detalle}. Esas orgs se ven las ` +
        'conversaciones entre si (`/inbox` filtra solo por esa columna). La base no lo impide: ' +
        '`chatwootInboxId` no tiene `@unique`, y el 409 vive solo en el PATCH de superadmin.',
    };
  }

  const fila = filas.find((f) => f.nombre === ORG);
  if (!fila) {
    return {
      codigo: 1,
      mensaje:
        `TENENCIA PERDIDA — la org \`${ORG}\` no aparece entre las ${filas.length} de la base ` +
        `(${filas.map((f) => f.nombre).join(', ')}). Sin ella no hay quien sea dueño del inbox ` +
        `${INBOX}, asi que \`/inbox\` no puede mostrar los leads de WhatsApp (S7).`,
    };
  }

  if (fila.inbox !== INBOX) {
    const tiene = fila.inbox === null ? 'ninguno' : `el ${fila.inbox}`;
    const pista = escritaPorFuera(fila.id)
      ? ` La fila tiene id \`${fila.id}\` — formato UUID, no el \`cuid()\` que genera la app: ` +
        'se escribio POR FUERA. Es la misma huella del 1-sep 02:02, no un click en la UI.'
      : ` La fila tiene id \`${fila.id}\` — formato \`cuid()\`, o sea que la escribio la app: ` +
        'esta vez si mirar quien toco el PATCH de superadmin.';
    return {
      codigo: 1,
      mensaje:
        `TENENCIA MOVIDA — \`${ORG}\` deberia tener el inbox ${INBOX} y tiene ${tiene}. ` +
        `\`/inbox\` dejo de mostrar los leads de WhatsApp que S7 da por visibles.${pista}`,
    };
  }

  const otras = filas
    .filter((f) => f.nombre !== ORG && f.inbox !== null)
    .map((f) => `${f.nombre} → ${f.inbox}`);
  return {
    codigo: 0,
    mensaje:
      `TENENCIA OK — \`${ORG}\` tiene el inbox ${INBOX}, sin colisiones` +
      `${otras.length ? ` (y ${otras.join(', ')})` : ''}. El objetivo del carril sigue visible en \`/inbox\`.`,
  };
}

/**
 * La salida de psql contra la base de PRODUCCION, elegida segun DONDE corre este script — mismo
 * criterio que `ladoVps` de `espejo-check.mjs` y que `leerBuild` de `s11_desplegado.mjs`.
 */
export function leerBase({ contenedor, host, key }) {
  const psql = ['psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A', '-F', '|'];
  const opciones = { input: SQL, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 };

  const local = () => execFileSync('docker', ['exec', '-i', contenedor, ...psql], opciones);

  const remoto = () => {
    const args = ['-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=20'];
    if (key) args.push('-i', key);
    // Una sola cadena para el shell remoto. No lleva comillas simples ni el SQL, que viaja por
    // stdin: `ssh` lo reenvia al comando remoto tal cual.
    args.push(host, `docker exec -i ${contenedor} psql -U postgres -d postgres -t -A -F "|"`);
    return execFileSync('ssh', args, opciones);
  };

  try {
    execFileSync('docker', ['inspect', '--format', '{{.State.Running}}', contenedor], { stdio: 'ignore' });
    return local();
  } catch {
    return remoto();
  }
}

// ---------------------------------------------------------------------------

if (process.argv.includes('--self-check')) {
  // Contados por el script y no escritos a mano: un conteo hardcodeado deja de coincidir en
  // cuanto se agrega un caso, y un gate que miente en su propio numero ya no es un gate.
  let casos = 0;
  const afirmar = (cond, que) => { casos++; if (!cond) { console.error('FALLO:', que); process.exitCode = 1; } };

  // Bytes REALES de `docker exec supabase-db psql …` el 2026-09-02, con la tenencia restaurada.
  const hoy =
    'Onia (interna)|5|ab6e629f-f798-4a7f-87df-12ec1c7fac0b\n' +
    'ZZ QA Clinica Chatbot|7|cmsvyguwn000401riyckoiyhs\n' +
    'ZZ QA Ferreteria Tornillo||cmsw0e759000401rim5gwx0rx\n' +
    'Bolivian electricidad||cmthllqlp000801kh5d4cqmxy\n';

  afirmar(parsearFilas(hoy).length === 4, 'lee las cuatro orgs de la base de hoy');
  afirmar(parsearFilas(hoy)[0].inbox === 5, 'saca el inbox de `Onia (interna)`');
  afirmar(parsearFilas(hoy)[2].inbox === null, 'un inbox NULL se lee como null, no como 0');
  afirmar(parsearFilas(hoy)[0].nombre === ORG, 'el nombre con parentesis y espacio sobrevive al split');
  afirmar(juzgar(parsearFilas(hoy)).codigo === 0, 'con la tenencia de hoy sale 0');

  // EL CASO QUE JUSTIFICA EL SCRIPT: el estado real del 1-sep, cuando la fila se re-creo por
  // fuera de la app apuntando al inbox 4 y `/inbox` dejo de mostrar a mariohassen y a F.
  const revertido = hoy.replace('Onia (interna)|5|', 'Onia (interna)|4|');
  afirmar(juzgar(parsearFilas(revertido)).codigo === 1, 'el reverte del 1-sep sale 1');
  afirmar(juzgar(parsearFilas(revertido)).mensaje.includes('tiene el 4'), 'y dice que inbox tiene de verdad');
  afirmar(juzgar(parsearFilas(revertido)).mensaje.includes('POR FUERA'), 'y da la pista forense del id UUID');

  // La distincion que evita el gate-siempre-rojo: hoy la fila BUENA tambien tiene id UUID.
  afirmar(escritaPorFuera('ab6e629f-f798-4a7f-87df-12ec1c7fac0b'), 'reconoce el UUID de la fila real');
  afirmar(!escritaPorFuera('cmsvyguwn000401riyckoiyhs'), 'y no confunde un cuid() con un UUID');
  afirmar(juzgar(parsearFilas(hoy)).codigo === 0, 'el id UUID con la tenencia correcta NO pone el gate en rojo');

  // Una fila escrita por la app se lee distinto: la pista cambia, el veredicto no.
  const porLaApp = hoy.replace('|5|ab6e629f-f798-4a7f-87df-12ec1c7fac0b', '|4|cmsvyguwn000401riyckoiyhx');
  afirmar(juzgar(parsearFilas(porLaApp)).mensaje.includes('la escribio la app'), 'un cuid apunta al PATCH de superadmin');

  // Segundo invariante: la base NO tiene `@unique`, asi que la colision es escribible.
  const choque = hoy.replace('ZZ QA Clinica Chatbot|7|', 'ZZ QA Clinica Chatbot|5|');
  afirmar(colisiones(parsearFilas(choque)).length === 1, 'detecta dos orgs sobre el mismo inbox');
  afirmar(juzgar(parsearFilas(choque)).codigo === 1, 'una colision sale 1');
  afirmar(juzgar(parsearFilas(choque)).mensaje.includes('inbox 5'), 'y nombra el inbox en disputa');
  afirmar(colisiones(parsearFilas(hoy)).length === 0, 'sin colisiones no inventa ninguna');
  // Los NULL no colisionan entre si: dos orgs sin inbox es el estado normal.
  afirmar(colisiones(parsearFilas(hoy)).length === 0, 'dos orgs con inbox NULL no cuentan como colision');

  // La org desaparecida es un hallazgo, no un "no medido": la consulta si respondio.
  const sinOrg = parsearFilas(hoy).filter((f) => f.nombre !== ORG);
  afirmar(juzgar(sinOrg).codigo === 1, 'si la org no esta, sale 1');
  afirmar(juzgar(sinOrg).mensaje.includes('S7'), 'y explica que se rompe');

  // Fallo conservador: no medir no es estar bien.
  afirmar(juzgar([]).codigo === 2, 'una consulta vacia se lee como NO MEDIDO');
  afirmar(juzgar([]).mensaje.includes('supabase-db'), 'y recuerda cual es la base de produccion');

  // Una org sin fila de `clinic_settings` no rompe el parseo.
  afirmar(parsearFilas('Org Nueva||\n')[0].inbox === null, 'una org sin clinic_settings se lee sin inbox');

  if (!process.exitCode) console.log(`self-check: ok — ${casos} casos`);
  process.exit(process.exitCode || 0);
}

function main() {
  const contenedor = process.env.ONIA_DB_CONTAINER || 'supabase-db';
  const host = process.env.ONIA_VPS_HOST || 'root@187.77.16.63';
  const key = process.env.ONIA_VPS_KEY || '';

  let texto;
  try {
    texto = leerBase({ contenedor, host, key });
  } catch (e) {
    console.error(
      `NO MEDIDO — no se pudo leer la base de \`${contenedor}\`: ${e.message.split('\n')[0]}. ` +
        'No medir NO es estar bien.',
    );
    return 2;
  }

  const veredicto = juzgar(parsearFilas(texto));
  console[veredicto.codigo === 0 ? 'log' : 'error'](veredicto.mensaje);
  return veredicto.codigo;
}

// Solo corre la medicion VIVA si se lo invoca como programa. Sin esta guarda, un `import` de las
// funciones puras dispara un `docker exec` contra produccion como efecto de cargar el modulo.
// `pathToFileURL` y no `new URL("file://" + argv[1])`: con `node -e "import(...)" <arg>` el
// `argv[1]` es el ARGUMENTO y no una ruta, y concatenarlo tira `ERR_INVALID_URL`.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main());
}

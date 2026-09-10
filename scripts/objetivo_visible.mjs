#!/usr/bin/env node
/**
 * objetivo_visible.mjs — ¿el objetivo del carril sigue cumpliendose HOY?
 *
 * El objetivo es uno solo: **que un desconocido escriba y esa conversacion se vea en la
 * bandeja**. Se cumplio el 2026-08-31 y se MIRO en produccion. Desde entonces, la unica cosa
 * que lo sostenia era un parrafo en `hermes-content/docs/cola/chatbot.md` que dice que se
 * miro — y la receta para volver a mirarlo vivia SOLO en la prosa de ese item cerrado
 * (`generate_link` → `verify` → cookies con `@supabase/ssr`). Un comando de verificacion
 * parado en un documento es el molde exacto con el que **S16 vencio en silencio** y con el
 * que **S11 se comprobaba a mano**. Este script es esa receta, ejecutable.
 *
 *   node scripts/objetivo_visible.mjs      (o `npm run objetivo:visible`)
 *   node scripts/objetivo_visible.mjs --self-check
 *
 * POR QUE NO ALCANZA CON `inbox:tenencia`, que es la pregunta obvia.
 * `inbox:tenencia` mide UNA COLUMNA de la base (`clinic_settings.chatwootInboxId`). Es el
 * primer eslabon y el unico que ya se vigilaba. Pero entre esa columna y el ojo del dueño hay
 * cuatro capas mas, y **todas fallan devolviendo HTTP 200 con la lista vacia** — que es
 * indistinguible del exito:
 *
 *   1. la sesion del dueño no resuelve a un profile con org  → 403 (esta es RUIDOSA)
 *   2. la org no tiene inbox                                 → 200 `{sinCanal:true,  conversaciones:[]}`  MUDA
 *   3. el token de Chatwoot del contenedor no es miembro
 *      del inbox                                             → 200 `{sinCanal:false, conversaciones:[]}`  MUDA
 *   4. `esDeInbox` filtra todo (tenencia revalidada fila
 *      por fila en `lib/chatbot/bandeja.ts`)                  → 200 `{sinCanal:false, conversaciones:[]}`  MUDA
 *
 * La capa 3 no es hipotetica: la propia cola la nombra como "exactamente el fantasma que este
 * carril mide" — *"en Chatwoot un token de agente que no es miembro del inbox habria devuelto
 * la lista vacia con 200"*. Se comprobo a mano UNA vez, el 31-ago, y nunca mas.
 * Por eso este gate mide el camino ENTERO por HTTP, contra el host publico, con una sesion de
 * verdad: es la unica forma de que las tres fallas mudas dejen de ser mudas.
 *
 * QUE HACE, en orden (todo de solo lectura):
 *   a. Le pregunta a la base de produccion QUIEN es el dueño del inbox del objetivo — no lo
 *      hardcodea. Si mañana la bandeja cambia de org, el gate sigue midiendo al dueño real.
 *   b. Genera una sesion de ese perfil con la admin API de GoTrue (`generate_link` NO manda
 *      correo) y arma las cookies con el propio `@supabase/ssr`, que es quien decide el nombre
 *      y el chunking. Adivinar el formato de la cookie es como se pierde una tarde.
 *   c. `GET /api/bandeja` contra el host publico, y juzga la respuesta.
 *
 * CODIGOS DE SALIDA
 *   0  hay al menos una conversacion de alguien que no somos nosotros → el objetivo se ve
 *   1  la bandeja no muestra a ningun desconocido                     → el objetivo se rompio
 *   2  no se pudo medir                                               → no medir NO es estar bien
 *
 * FALLO CONSERVADOR, igual que `inbox_tenencia.mjs`, `bloqueos_vencidos.mjs` y
 * `s11_desplegado.mjs`.
 *
 * ⚠️ NO TOCA NADA, y hay dos cuidados que NO son adorno:
 *   · Solo `GET` de la LISTA. Nunca abre una conversacion: abrirla la marca como leida en el
 *     Chatwoot de gente real, y el globo de no-leidos es de Sergio, no del gate.
 *   · **Nunca hace `signOut`.** El perfil del dueño es el mismo que usa Sergio; un signOut de
 *     alcance global lo sacaria de su propia sesion. Las sesiones que este gate crea expiran
 *     solas, que es mas barato que el riesgo de cerrarle la de el.
 *
 * Los secretos se leen del contenedor `onia-platform` que CORRE — la misma fuente que usa
 * produccion. No hay ninguno en el repo y no se imprime ninguno.
 * Env opcionales: ONIA_PLATFORM_CONTAINER, ONIA_DB_CONTAINER, ONIA_APP_URL, ONIA_SSR_DIR.
 */

import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/**
 * Los inboxes por donde entra un desconocido: el widget web de `onia.com.bo` (4) y WhatsApp (5).
 * Son DOS y no uno porque los cinco desconocidos reales que motivaron este gate escribieron por
 * el **4**, no por el 5 (ver la cabecera de `lib/chatbot/inboxes-de-la-org.ts` en `onia-platform`).
 */
export const INBOXES_DEL_OBJETIVO = [4, 5];

/**
 * A quien preguntarle por la bandeja: el dueño de CUALQUIER inbox del objetivo, mirando LAS DOS
 * columnas de canal.
 *
 * ⚠️ Nace del 2026-09-05, y es la tercera vez que este archivo se queda ciego por una suposicion
 * hardcodeada sobre DONDE vive un dato (las dos anteriores: la ruta de `@supabase/ssr`, dos veces).
 * La consulta preguntaba `chatwootInboxId = 5`, o sea el inbox de WhatsApp en la columna del canal
 * WEB. Eso era cierto hasta que se arreglo el bug que este gate existe para cazar: `clinic_settings`
 * paso a tener UNA columna por canal y la migracion movio el 5 a `chatwootWhatsappInboxId`, dejando
 * el 4 en la vieja. Desde entonces la consulta devolvia VACIO y el gate salia `NO MEDIDO`.
 *
 * O sea: **el arreglo que hizo bien el producto dejo ciego al instrumento que lo medía.** No fallo
 * en verde —el exit es 2— pero el efecto medido es el mismo, porque el objetivo del carril se mide
 * aparte con otras tres cifras y esas seguian dando en meta.
 *
 * Se pregunta por las dos columnas, igual que `inboxesDeLaOrg()` arma su lista `todos`: asi el
 * gate sobrevive a que el dato se mueva de columna otra vez, en cualquiera de las dos direcciones.
 */
export function sqlDueño(inboxes = INBOXES_DEL_OBJETIVO) {
  const lista = inboxes.join(', ');
  return (
    'select u.email from public.clinic_settings cs ' +
    'join public.profiles p on p."organizationId" = cs."organizationId" ' +
    'join auth.users u on u.id::text = p."userId" ' +
    `where cs."chatwootInboxId" in (${lista}) or cs."chatwootWhatsappInboxId" in (${lista}) ` +
    'order by u.email limit 1;'
  );
}

/**
 * Donde puede vivir `@supabase/ssr`: en un checkout de `onia-platform`, que es quien lo usa de
 * verdad. Son DOS candidatos y no uno por lo mismo que el vigia y el rescate del carril tienen
 * dos: **una ruta sola arranca rota el dia que ese arbol no esta, y se queda rota en silencio.**
 *
 * ⚠️ Medido el 2026-09-03: la ruta era una sola —el worktree del carril— y ese worktree **nunca
 * tuvo `npm ci`**. El gate salio `NO MEDIDO — Cannot find module …/@supabase/ssr/…`, o sea que
 * la mitad "y esa conversacion se ve en la bandeja" del objetivo del carril llevaba sin medirse
 * desde que se escribio. El clon de `main` (`/root/loops/onia-platform`) SI lo tiene instalado.
 *
 * El orden es worktree primero: si el carril algun dia cambia la version de la libreria, se
 * prueba contra la suya. El clon de `main` es el respaldo que hace que igual haya medicion.
 */
export const SSR_CANDIDATOS = ['/root/loops/onia-platform-chatbot', '/root/loops/onia-platform'];

/** El archivo concreto que se importa; que exista es la unica prueba de que el modulo sirve. */
export const SSR_SUBRUTA = 'node_modules/@supabase/ssr/dist/main/index.js';

/**
 * El primer candidato que TIENE el modulo. `existe` se inyecta para poder probar la eleccion
 * sin disco. Si ninguno lo tiene explota nombrandolos a todos: un `Cannot find module` con una
 * ruta sola manda a instalar justo donde no hace falta.
 */
/**
 * De los candidatos, los que son un checkout INSTALADO — o sea, con `node_modules/`.
 *
 * ⚠️ Nace del 2026-09-07, y es un rojo FALSO que trabo la cadena entera. El guardia de mas
 * abajo custodiaba "el directorio existe", y desde que el integrador corre en nodo-casa ahi
 * existe `/root/loops/onia-platform` como clon PELADO, sin `npm ci`: el guardia exigia el
 * modulo en un arbol que nunca lo tuvo, `npm test` salia 1 y con la cadena roja no se mergea
 * NINGUN carril. Un clon sin `node_modules` no es un arbol al que se le perdio la dependencia:
 * es un arbol que no se instalo, y no hay nada que custodiar ahi. El caso que el guardia SI
 * tiene que seguir cazando —un arbol instalado del que `@supabase/ssr` desaparecio— queda
 * intacto, porque ese si tiene `node_modules/`.
 */
export function arbolesCustodiables(candidatos = SSR_CANDIDATOS, existe = existsSync) {
  return (candidatos ?? [])
    .filter(Boolean)
    .map((d) => String(d).replace(/\/+$/, ''))
    .filter((d) => existe(`${d}/node_modules`));
}

export function elegirSsrDir(candidatos = SSR_CANDIDATOS, existe = existsSync) {
  const probados = (candidatos ?? []).filter(Boolean).map((d) => String(d).replace(/\/+$/, ''));
  const elegido = probados.find((d) => existe(`${d}/${SSR_SUBRUTA}`));
  if (elegido) return elegido;
  throw new Error(
    `\`@supabase/ssr\` no esta en ninguno de: ${probados.join(', ') || '(ningun candidato)'} ` +
      `(se busco \`${SSR_SUBRUTA}\` en cada uno). Corre \`npm ci\` en un checkout de ` +
      '`onia-platform`, o apunta `ONIA_SSR_DIR` a uno que ya lo tenga.',
  );
}

/**
 * Los telefonos que somos NOSOTROS. El objetivo dice, con todas las letras, "una persona que no
 * somos nosotros — ni una org QA, ni el probador, ni Sergio desde su celular", asi que una
 * bandeja que solo trae estos numeros NO cumple el objetivo aunque tenga conversaciones.
 *
 * Medido, no supuesto: la conversacion 11 del inbox 5 es `Sergio` / `+59171654992`, "Hola" del
 * 17-ago, y la propia cola la marca en su tabla con *"este si somos nosotros"*.
 */
export const NUESTROS_TELEFONOS = ['+59171654992'];

/**
 * Los contactos de prueba se reconocen por el nombre. La data QA de este proyecto viene
 * prefijada a proposito (`Cliente Prueba Bandeja`, `Cliente Insistencia Tres`,
 * `Cliente Comprobante`, `Visitante Prueba Web`, las orgs `ZZ QA …`).
 *
 * ⚠️ El sesgo esta elegido: si un desconocido de verdad se llamara "Prueba", el gate lo contaria
 * como nuestro y se pondria ROJO de mas. Es la direccion correcta para un gate — un falso rojo
 * se investiga, un falso verde dice que el objetivo se cumple cuando no.
 */
export const NOMBRE_DE_PRUEBA = /\b(prueba|qa|test)\b/i;

/** Un telefono comparable: `+591 730-21804` y `+59173021804` son el mismo numero. */
export function normalizarTelefono(t) {
  return String(t ?? '').replace(/\D/g, '');
}

/** ¿Esta conversacion somos nosotros? */
export function esNuestra(conversacion) {
  const tel = normalizarTelefono(conversacion?.telefono);
  if (tel && NUESTROS_TELEFONOS.some((n) => normalizarTelefono(n) === tel)) return true;
  return NOMBRE_DE_PRUEBA.test(String(conversacion?.contacto ?? ''));
}

/**
 * El veredicto, separado de la red a proposito: es lo que se prueba sin docker, sin sesion y
 * sin produccion. `respuesta` es `{ status, cuerpo }` tal como sale de `/api/bandeja`.
 */
export function juzgar(respuesta) {
  const { status, cuerpo } = respuesta ?? {};

  if (status === 403) {
    return {
      codigo: 1,
      mensaje:
        'NO AUTORIZADO (403) — la sesion del dueño no resuelve a un perfil con org. `/inbox` le ' +
        'muestra el mismo 403 a el. Mirar `lib/chatbot/bandeja-auth.ts`: `profile.organization` vino nulo.',
    };
  }

  if (status !== 200) {
    return {
      codigo: 2,
      mensaje:
        `NO MEDIDO — \`/api/bandeja\` respondio ${status ?? '(nada)'}. No medir NO es estar bien: ` +
        'un 502 es Chatwoot caido y un 500 es el producto roto, pero los dos dejan al objetivo sin comprobar.',
    };
  }

  if (cuerpo?.sinCanal === true) {
    return {
      codigo: 1,
      mensaje:
        'BANDEJA SIN CANAL — la respuesta es 200 pero `sinCanal:true`, o sea que la org del dueño ' +
        'NO tiene `chatwootInboxId`. El objetivo NO se ve, y del lado del cliente esto se ve como ' +
        'una bandeja vacia normal. Correr `npm run inbox:tenencia` para el detalle de la columna.',
    };
  }

  const conversaciones = Array.isArray(cuerpo?.conversaciones) ? cuerpo.conversaciones : null;
  if (conversaciones === null) {
    return {
      codigo: 2,
      mensaje:
        'NO MEDIDO — 200 sin un array `conversaciones`. El contrato de `app/api/bandeja/route.ts` ' +
        'cambio, o lo que respondio no es el producto.',
    };
  }

  if (conversaciones.length === 0) {
    return {
      codigo: 1,
      mensaje:
        'BANDEJA VACIA — 200, `sinCanal:false`, y CERO conversaciones. Es la falla muda que este ' +
        'gate existe para cazar: la columna puede estar perfecta y aun asi no llegar nada. Las dos ' +
        'causas conocidas son el token de Chatwoot del contenedor `onia-platform` sin membresia en ' +
        `los inboxes ${INBOXES_DEL_OBJETIVO.join('/')}, y \`esDeInbox\` filtrando todas las filas ` +
        '(`lib/chatbot/bandeja.ts`).',
    };
  }

  const desconocidas = conversaciones.filter((c) => !esNuestra(c));
  if (desconocidas.length === 0) {
    const nuestras = conversaciones.map((c) => c.contacto || c.telefono || `#${c.id}`).join(', ');
    return {
      codigo: 1,
      mensaje:
        `SOLO NOSOTROS — la bandeja trae ${conversaciones.length} conversacion(es) y todas somos ` +
        `nosotros (${nuestras}). El objetivo pide "una persona que no somos nosotros — ni una org ` +
        'QA, ni el probador, ni Sergio desde su celular".',
    };
  }

  const detalle = desconocidas
    .map((c) => `#${c.id} ${c.contacto || '(sin nombre)'}${c.telefono ? ` ${c.telefono}` : ''}`)
    .join(' · ');
  return {
    codigo: 0,
    mensaje:
      `OBJETIVO VISIBLE — la bandeja del dueño trae ${desconocidas.length} conversacion(es) de ` +
      `gente que no somos nosotros: ${detalle}. Camino completo comprobado por HTTP ` +
      '(sesion → /api/bandeja → Chatwoot → lista), no solo la columna de la base.',
  };
}

/** Corre un comando sin shell y devuelve stdout. */
function correr(cmd, args, opciones = {}) {
  return execFileSync(cmd, args, { encoding: 'utf8', timeout: 60_000, ...opciones });
}

/**
 * Quien es el dueño del inbox del objetivo, preguntado a la base y no hardcodeado.
 *
 * `u.id::text = p."userId"` y no al reves: `profiles.userId` es texto y tiene filas
 * `pendiente-<uuid>` (invitaciones sin aceptar). Castear el lado `userId` a uuid revienta la
 * consulta entera con `invalid input syntax for type uuid`; castear el lado `auth.users` las
 * ignora, que es lo que se quiere.
 */
export const SQL_DUEÑO = sqlDueño();

function leerDueño(contenedor) {
  const salida = correr('docker', ['exec', '-i', contenedor, 'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A'], {
    input: SQL_DUEÑO,
  });
  return salida.trim().split('\n')[0]?.trim() || '';
}

/** Una variable de entorno del contenedor que CORRE. Nunca se imprime. */
function leerEnv(contenedor, nombre) {
  return correr('docker', ['exec', contenedor, 'printenv', nombre]).trim();
}

async function medir({ plataforma, base, appUrl, ssrDir }) {
  const dueño = leerDueño(base);
  if (!dueño) {
    throw new Error(
      `ninguna org tiene los inboxes ${INBOXES_DEL_OBJETIVO.join(' ni ')} en \`chatwootInboxId\` ni en ` +
        '`chatwootWhatsappInboxId`: no hay dueño a quien preguntarle. Se ve con `npm run inbox:tenencia`',
    );
  }

  const supabaseUrl = leerEnv(plataforma, 'NEXT_PUBLIC_SUPABASE_URL');
  const anon = leerEnv(plataforma, 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
  const service = leerEnv(plataforma, 'SUPABASE_SERVICE_ROLE_KEY');

  const cabecerasAdmin = {
    apikey: service,
    Authorization: `Bearer ${service}`,
    'Content-Type': 'application/json',
  };
  const enlace = await fetch(`${supabaseUrl}/auth/v1/admin/generate_link`, {
    method: 'POST',
    headers: cabecerasAdmin,
    body: JSON.stringify({ type: 'magiclink', email: dueño }),
  });
  const enlaceJson = await enlace.json();
  if (!enlaceJson?.hashed_token) throw new Error(`generate_link respondio ${enlace.status} sin hashed_token`);

  const verificado = await fetch(`${supabaseUrl}/auth/v1/verify`, {
    method: 'POST',
    headers: { apikey: service, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'magiclink', token_hash: enlaceJson.hashed_token }),
  });
  const sesion = await verificado.json();
  if (!sesion?.access_token) throw new Error(`verify respondio ${verificado.status} sin access_token`);

  // Las cookies las arma la libreria, no este script: el nombre sale de la URL de Supabase y el
  // chunking lo decide `@supabase/ssr`. Adivinarlo es como se pierde una tarde.
  const { createServerClient } = await import(`${ssrDir}/node_modules/@supabase/ssr/dist/main/index.js`);
  let tarro = [];
  const cliente = createServerClient(supabaseUrl, anon, {
    cookies: {
      getAll: () => tarro,
      setAll: (nuevas) => {
        for (const c of nuevas) tarro = tarro.filter((t) => t.name !== c.name).concat({ name: c.name, value: c.value });
      },
    },
  });
  await cliente.auth.setSession({ access_token: sesion.access_token, refresh_token: sesion.refresh_token });
  if (!tarro.length) throw new Error('`@supabase/ssr` no escribio ninguna cookie de sesion');

  // Solo la LISTA. Abrir una conversacion la marcaria como leida en el Chatwoot de gente real.
  const r = await fetch(`${appUrl}/api/bandeja`, {
    headers: { cookie: tarro.map((c) => `${c.name}=${c.value}`).join('; ') },
  });
  let cuerpo = null;
  try {
    cuerpo = JSON.parse(await r.text());
  } catch {
    cuerpo = null;
  }
  return { status: r.status, cuerpo, dueño };
}

function afirmarFactory() {
  let casos = 0;
  return [
    (condicion, nombre) => {
      casos += 1;
      if (!condicion) {
        console.error(`  FALLA: ${nombre}`);
        process.exitCode = 1;
      }
    },
    () => casos,
  ];
}

function selfCheck() {
  const [afirmar, total] = afirmarFactory();

  // La respuesta REAL de produccion del 2026-09-02, copiada de la medicion en vivo. Si este
  // caso pasara en rojo, el gate no serviria; si pasara en verde con la bandeja rota, tampoco.
  const hoy = {
    status: 200,
    cuerpo: {
      ok: true,
      sinCanal: false,
      conversaciones: [
        { id: 37, contacto: 'mariohassen', telefono: '+59173021804', ultimoMensaje: 'Hola, vengo de la web de Onia.' },
        { id: 35, contacto: 'F', telefono: '+59173232758', ultimoMensaje: 'Hola, estoy evaluando un sistema…' },
        { id: 11, contacto: 'Sergio', telefono: '+59171654992', ultimoMensaje: 'Hola' },
      ],
    },
  };
  afirmar(juzgar(hoy).codigo === 0, 'con la bandeja de hoy sale 0');
  afirmar(juzgar(hoy).mensaje.includes('mariohassen'), 'y nombra a los desconocidos que ve');
  afirmar(!juzgar(hoy).mensaje.includes('#11'), 'y NO cuenta a Sergio como desconocido');
  afirmar(juzgar(hoy).mensaje.includes('2 conversacion'), 'cuenta dos, no tres');

  // LAS TRES FALLAS MUDAS — las que devuelven 200 y hoy no las mira nadie.
  // ⚠️ Las dos de abajo NO pueden conformarse con `codigo === 1`: sin canal y con la lista vacia
  // el flujo cae igual en "SOLO NOSOTROS", que tambien es 1. Probado apagando cada rama: el
  // codigo seguia en 1 y solo el mensaje delataba la diferencia. Un rojo por el motivo
  // equivocado manda a mirar el archivo equivocado, asi que se afirma el DIAGNOSTICO.
  const sinCanal = { status: 200, cuerpo: { ok: true, sinCanal: true, conversaciones: [] } };
  afirmar(juzgar(sinCanal).codigo === 1, 'un 200 con `sinCanal:true` es ROJO, no verde');
  afirmar(juzgar(sinCanal).mensaje.startsWith('BANDEJA SIN CANAL'), 'y lo diagnostica como falta de canal');
  afirmar(juzgar(sinCanal).mensaje.includes('inbox:tenencia'), 'y manda al gate que mide la columna');

  const vacia = { status: 200, cuerpo: { ok: true, sinCanal: false, conversaciones: [] } };
  afirmar(juzgar(vacia).codigo === 1, 'un 200 con la lista vacia es ROJO: es la falla muda del token');
  afirmar(juzgar(vacia).mensaje.startsWith('BANDEJA VACIA'), 'y lo diagnostica como lista vacia, no como "solo nosotros"');
  afirmar(juzgar(vacia).mensaje.includes('token de Chatwoot'), 'y nombra la causa conocida');

  const soloNuestras = { status: 200, cuerpo: { ok: true, sinCanal: false, conversaciones: [hoy.cuerpo.conversaciones[2]] } };
  afirmar(juzgar(soloNuestras).codigo === 1, 'una bandeja con solo Sergio NO cumple el objetivo');
  afirmar(juzgar(soloNuestras).mensaje.includes('Sergio'), 'y dice a quien esta viendo');

  // La data QA no cuenta como desconocido: es la trampa de dar el objetivo por cumplido solo.
  const qa = {
    status: 200,
    cuerpo: {
      ok: true,
      sinCanal: false,
      conversaciones: [
        { id: 43, contacto: 'Cliente Prueba Bandeja', telefono: '+59100000001' },
        { id: 10, contacto: 'Visitante Prueba Web', telefono: '' },
      ],
    },
  };
  afirmar(juzgar(qa).codigo === 1, 'la data QA sola no cumple el objetivo');
  afirmar(esNuestra({ contacto: 'Cliente Prueba Bandeja' }), 'reconoce un contacto de prueba por el nombre');
  afirmar(esNuestra({ contacto: 'ZZ QA Ferreteria' }), 'reconoce la marca QA');
  // El `\b` del regex se prueba con un apellido REAL que CONTIENE "test": `Testa`. El caso obvio
  // ("Prudencia" por "prueba") no prueba nada — "prueba" ni siquiera es subcadena de "Prudencia",
  // asi que pasaba igual con el regex aflojado. Un caso que no puede fallar no es un caso.
  afirmar(!esNuestra({ contacto: 'Ernesto Testa' }), 'un apellido con "test" adentro NO es data de prueba');
  afirmar(!esNuestra({ contacto: 'Joaquina Prueban' }), 'ni uno que empieza como "prueba"');
  afirmar(esNuestra({ contacto: 'Cliente prueba' }), 'pero "prueba" como palabra entera si');
  afirmar(!esNuestra({ contacto: 'mariohassen', telefono: '+59173021804' }), 'un desconocido real no es nuestro');

  // El telefono manda aunque el nombre cambie: si Sergio se renombra, sigue siendo Sergio.
  afirmar(esNuestra({ contacto: 'Otro Nombre', telefono: '+591 71654992' }), 'normaliza el telefono con espacios');
  afirmar(esNuestra({ contacto: 'Otro Nombre', telefono: '59171654992' }), 'y sin el +');
  afirmar(normalizarTelefono('+591 730-21804') === '59173021804', 'normalizarTelefono saca todo lo que no es digito');

  // El 403 es la falla RUIDOSA: se distingue de las mudas y no se confunde con "no medido".
  afirmar(juzgar({ status: 403, cuerpo: { error: 'No autorizado' } }).codigo === 1, 'un 403 es ROJO');
  afirmar(juzgar({ status: 403, cuerpo: {} }).mensaje.includes('bandeja-auth'), 'y apunta al archivo del gate de sesion');

  // Fallo conservador: lo que no se pudo medir no se declara bien.
  // ⚠️ Igual que arriba, `codigo === 2` solo no alcanza: sin la rama del status, un 502 cae en
  // "200 sin un array" y devuelve 2 tambien. Se afirma que el mensaje DICE el status, porque un
  // 502 (Chatwoot caido) y un contrato cambiado se arreglan en lugares distintos.
  afirmar(juzgar({ status: 502, cuerpo: {} }).codigo === 2, 'un 502 es NO MEDIDO, no "roto"');
  afirmar(juzgar({ status: 502, cuerpo: {} }).mensaje.includes('502'), 'y el mensaje trae el status real');
  afirmar(juzgar({ status: 500, cuerpo: {} }).mensaje.includes('500'), 'un 500 tambien se nombra');
  afirmar(juzgar({ status: 200, cuerpo: { ok: true, sinCanal: false } }).codigo === 2, 'un 200 sin array es NO MEDIDO');
  afirmar(juzgar(undefined).codigo === 2, 'sin respuesta, NO MEDIDO');

  // El gate NO puede depender de que una persona puntual siga ahi: si mariohassen se borra y
  // queda otro desconocido, tiene que seguir verde. Un gate que exige un nombre se muere solo.
  const otro = {
    status: 200,
    cuerpo: { ok: true, sinCanal: false, conversaciones: [{ id: 99, contacto: 'Alguien Nuevo', telefono: '+59160000000' }] },
  };
  afirmar(juzgar(otro).codigo === 0, 'con OTRO desconocido distinto sigue verde');

  // DONDE VIVE `@supabase/ssr`. El 2026-09-03 el gate salio `NO MEDIDO — Cannot find module
  // '/root/loops/onia-platform-chatbot/node_modules/@supabase/ssr/…'`: ese worktree nunca tuvo
  // `npm ci`. La ruta era UNA sola y hardcodeada, asi que la mitad "se ve en la bandeja" del
  // objetivo del carril quedo sin medir. Se prueba con un `existe` inyectado: la eleccion es
  // pura y no necesita disco.
  const hay = (...rutas) => (r) => rutas.some((x) => r.startsWith(x));
  afirmar(
    elegirSsrDir(['/no/esta', '/si/esta'], hay('/si/esta')) === '/si/esta',
    'si el primer candidato no tiene el modulo, usa el segundo',
  );
  afirmar(
    elegirSsrDir(['/si/esta', '/otro'], hay('/si/esta', '/otro')) === '/si/esta',
    'con los dos disponibles gana el primero',
  );
  let exploto = null;
  try {
    elegirSsrDir(['/no/esta', '/tampoco'], () => false);
  } catch (e) {
    exploto = e.message;
  }
  afirmar(exploto !== null, 'sin ningun candidato con el modulo, explota en vez de seguir');
  afirmar(
    exploto?.includes('/no/esta') && exploto?.includes('/tampoco'),
    'y el error nombra TODOS los candidatos que probo, no solo el ultimo',
  );
  afirmar(/npm ci/.test(exploto ?? ''), 'y dice como arreglarlo (npm ci), no solo que fallo');

  // A QUE ARBOL SE LE EXIGE LA DEPENDENCIA. La linea de abajo decia `existe el directorio`, y
  // desde que el integrador corre en nodo-casa eso da un rojo falso: alla el clon de
  // `onia-platform` esta pelado. Se prueba sin disco, en las DOS direcciones — sin el segundo
  // caso, "no custodiar nada nunca" tambien pasaria.
  const conNodeModules = (...rutas) => (r) => rutas.some((x) => r === `${x}/node_modules`);
  afirmar(
    arbolesCustodiables(['/clon/pelado'], conNodeModules()).length === 0,
    'un candidato que existe pero SIN node_modules no se custodia (el clon pelado de nodo-casa)',
  );
  afirmar(
    arbolesCustodiables(['/clon/pelado', '/arbol/instalado'], conNodeModules('/arbol/instalado'))
      .join() === '/arbol/instalado',
    'y un arbol instalado SI se custodia: al que perdio la dependencia hay que seguir cazandolo',
  );

  // ⚠️ El guardia contra disco REAL. Sin este caso, los cuatro de arriba pasan verdes con el
  // modulo ausente de la maquina y el gate vuelve a morir recien en produccion — que es
  // exactamente como se perdio esta medicion. Solo corre donde hay un arbol INSTALADO:
  // sobre un clon pelado no hay nada que custodiar y un rojo ahi seria falso.
  const candidatosEnDisco = arbolesCustodiables();
  if (candidatosEnDisco.length) {
    let vivo = true;
    try {
      elegirSsrDir(candidatosEnDisco);
    } catch {
      vivo = false;
    }
    afirmar(vivo, `\`@supabase/ssr\` sigue instalado en alguno de: ${candidatosEnDisco.join(', ')}`);
  } else {
    console.log(
      '  (salteado: ningun checkout de `onia-platform` INSTALADO en disco — nada que custodiar aca)',
    );
  }

  // A QUIEN LE PREGUNTA POR LA BANDEJA. Sin estos casos, `SQL_DUEÑO` no tenia NI UNO: los 30 de
  // arriba prueban `juzgar()`, que es la parte que nunca se rompio. Lo que se rompio fue la
  // suposicion de en que columna vive el inbox, y no la custodiaba nadie.
  afirmar(/chatwootWhatsappInboxId/.test(sqlDueño()), 'el dueño se busca TAMBIEN por la columna de WhatsApp');
  afirmar(/chatwootInboxId/.test(sqlDueño()), 'y por la de la web: un desconocido entra por cualquiera de las dos');
  afirmar(sqlDueño([4, 5]).includes('in (4, 5)'), 'pregunta por todos los inboxes del objetivo, no por uno');
  afirmar(!/=\s*5\b/.test(sqlDueño()), 'y NO ata el inbox 5 a una sola columna, que es como quedo ciego');
  afirmar(INBOXES_DEL_OBJETIVO.includes(4), 'el inbox 4 (widget web) cuenta: por ahi entraron los 5 desconocidos reales');

  // ⚠️ EL GUARDIA CONTRA LA BASE REAL, hermano del de `@supabase/ssr` contra disco. Los cinco
  // casos de arriba pasan verdes aunque la consulta no encuentre a NADIE en produccion — que es
  // exactamente como se perdio esta medicion. Solo corre donde hay base: fuera del VPS no hay
  // nada que custodiar y un rojo ahi seria falso.
  const contenedorBase = process.env.ONIA_DB_CONTAINER || 'supabase-db';
  let hayBase = false;
  try {
    correr('docker', ['inspect', '--format', '{{.State.Running}}', contenedorBase], { stdio: 'pipe' });
    hayBase = true;
  } catch {
    hayBase = false;
  }
  if (hayBase) {
    let dueñoReal = '';
    try {
      dueñoReal = leerDueño(contenedorBase);
    } catch (e) {
      dueñoReal = `(la consulta exploto: ${e.message.split('\n')[0]})`;
    }
    afirmar(
      /@/.test(dueñoReal),
      `\`SQL_DUEÑO\` encuentra un dueño en la base de HOY (devolvio "${dueñoReal}"). Si esto esta ` +
        'en rojo, el gate no puede medir el objetivo del carril: mira en que columna quedo el inbox ' +
        'con `npm run inbox:tenencia`.',
    );
  } else {
    console.log(`  (salteado: no hay contenedor \`${contenedorBase}\` — no es el VPS)`);
  }

  if (!process.exitCode) console.log(`self-check: ok — ${total()} casos`);
  process.exit(process.exitCode || 0);
}

async function main() {
  const plataforma = process.env.ONIA_PLATFORM_CONTAINER || 'onia-platform';
  const base = process.env.ONIA_DB_CONTAINER || 'supabase-db';
  const appUrl = (process.env.ONIA_APP_URL || 'https://app.onia.com.bo').replace(/\/$/, '');
  const candidatos = process.env.ONIA_SSR_DIR ? [process.env.ONIA_SSR_DIR] : SSR_CANDIDATOS;

  let respuesta;
  try {
    // Dentro del `try` a proposito: si no hay ningun checkout con el modulo, eso es NO MEDIDO
    // —con su motivo y su arreglo— y no un stack de `Cannot find module` sin diagnostico.
    respuesta = await medir({ plataforma, base, appUrl, ssrDir: elegirSsrDir(candidatos) });
  } catch (e) {
    console.error(
      `NO MEDIDO — ${e.message.split('\n')[0]}. No medir NO es estar bien: el objetivo del carril ` +
        'queda sin comprobar, que no es lo mismo que estar cumplido.',
    );
    return 2;
  }

  const veredicto = juzgar(respuesta);
  console[veredicto.codigo === 0 ? 'log' : 'error'](`[dueño: ${respuesta.dueño}] ${veredicto.mensaje}`);
  return veredicto.codigo;
}

// Solo mide en VIVO si se lo invoca como programa. Sin esta guarda, un `import` de las funciones
// puras dispara un `docker exec` y una sesion real contra produccion como efecto de cargar el
// modulo. `pathToFileURL` y no `new URL("file://" + argv[1])`: con `node -e "import(...)" <arg>`
// el `argv[1]` es el ARGUMENTO y no una ruta, y concatenarlo tira `ERR_INVALID_URL`.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--self-check')) selfCheck();
  else process.exit(await main());
}

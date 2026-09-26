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
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
// La sesion del dueño la acuña el modulo compartido, que es el unico que sabe elevar el segundo
// factor. Este archivo tuvo su propia copia y por eso quedo ciego — ver el comentario de `medir()`.
import { acunarSesion } from './lib/sesion_dueno.mjs';

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
 * Las banderas que este programa sabe leer de verdad.
 *
 * POR QUE EXISTE, con fecha (2026-09-18). El mensaje de la rama «puerta» cerraba recomendando
 * «tambien se puede medir con una cuenta que ya lo cumpla (`--email`)» y esa bandera **no
 * existia**: el unico `process.argv` del archivo era el de `--self-check`. O sea que el gate
 * imprimia un remedio INEJECUTABLE — el lector que lo obedecia veia el mismo veredicto, sin
 * forma de refutarlo, y el objetivo del carril quedaba NO MEDIDO vuelta tras vuelta.
 *
 * El caso ancla del self-check no mira ESTA bandera: deriva de la ventana de `juzgar()` todas
 * las que sus mensajes recomiendan y exige que el parser las conozca. Prohibir el literal viejo
 * cerraria la instancia; lo que cierra la clase es que **todo remedio que se imprime se pueda
 * tipear**.
 */
export const BANDERAS = ['--email', '--self-check'];

/**
 * El correo que el llamador pide medir, o `null` para derivarlo de la base como siempre.
 *
 * Acepta las dos formas (`--email x` y `--email=x`) porque las dos se tipean, y la segunda es la
 * que sale de copiar el remedio de un renglon.
 */
export function dueñoPedido(argv = []) {
  for (let i = 0; i < argv.length; i += 1) {
    const arg = String(argv[i] ?? '');
    if (arg === '--email') {
      const valor = String(argv[i + 1] ?? '').trim();
      return valor && !valor.startsWith('--') ? valor : null;
    }
    if (arg.startsWith('--email=')) {
      const valor = arg.slice('--email='.length).trim();
      return valor || null;
    }
  }
  return null;
}

/**
 * Las banderas que los mensajes de `juzgar()` RECOMIENDAN, derivadas de la fuente.
 *
 * Se acota a la ventana de esa funcion —y no al archivo entero— porque ahi viven los remedios
 * que se imprimen; los comentarios de arriba hablan del bug y citan la bandera vieja a
 * proposito. Una bandera nueva en una rama nueva entra sola: el universo es el disco, no una
 * lista escrita a mano.
 */
export function banderasQueRecomienda(fuente) {
  // ⚠️ La DEFINICION, anclada a inicio de linea — no la primera MENCION del nombre. Medido el
  // 2026-09-18 escribiendo esto: `indexOf('export function juzgar(')` encontraba el literal que
  // vive DENTRO de esta misma funcion (esta dos lineas mas abajo), asi que la ventana era el
  // cuerpo de este gate y el universo salia de su propio regex. Quedaba verde y se auto-medía:
  // la mutacion que ponia una bandera inexistente en el mensaje de `juzgar()` pasaba limpia.
  const def = /^export function juzgar\(/m.exec(fuente);
  if (!def) return null;
  const desde = def.index;
  const hasta = fuente.indexOf('\n/**', desde);
  const ventana = fuente.slice(desde, hasta < 0 ? fuente.length : hasta);
  // El placeholder del valor entra en el mismo par de backticks (`--email <correo>`), asi que la
  // bandera se lee hasta el espacio o el `=` — pedirla pegada al backtick de cierre dejaba fuera
  // justo a la forma que se escribe para que el lector la pueda copiar.
  const marcas = ventana.match(/`(--[a-z][a-z-]*)(?:[ =][^`]*)?`/g) ?? [];
  return [...new Set(marcas.map((m) => m.slice(1, -1).split(/[ =]/)[0]))];
}

/**
 * La fuente SIN la prosa: bloques `/* … *\/` y lineas que son solo comentario.
 *
 * ⚠️ Nace del 2026-09-26. Un gate que busca un literal de CODIGO en su propio archivo tiene que
 * sacar los comentarios primero, porque acá la prosa CITA a proposito los literales viejos para
 * explicar cada bug: buscarlos sobre el archivo entero encuentra la cita y sale verde con el
 * codigo roto. La misma trampa se midio el mismo dia en `web-factory` partiendo un fuente por
 * `'<dialog'` y cortando en el comentario que lo explicaba.
 *
 * Se quitan lineas COMPLETAS de comentario y no todo lo que siga a un `//`, para no destrozar los
 * `https://` de los literales: lo que se busca acá son llamadas e imports, que viven en su linea.
 */
export function soloCodigo(fuente) {
  return String(fuente ?? '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .filter((linea) => !/^\s*\/\//.test(linea))
    .join('\n');
}

/**
 * ¿El corte lo hizo la PUERTA de la app, antes de que el pedido llegara a la bandeja?
 *
 * POR QUE EXISTE, con fecha (2026-09-18). `/api/bandeja` contestaba 403 y este gate lo
 * diagnosticaba como «la sesion no esta llegando al producto: `getUser()` sin usuario», porque
 * conocia DOS causas del 403 y las dos viven en `bandeja-auth.ts`. Medido en vivo ese dia con el
 * MISMO tarro de cookies: `/api/bandeja` → 403 `MFA_ENROLLMENT_REQUIRED` y `/api/me` → **200**
 * con el perfil entero (role SUPERADMIN, organizationId cargado). O sea que la sesion SI llegaba,
 * el perfil SI tenia organizacion, y el mensaje mandaba a revisar cookies y BUILD_ID —  una caza
 * inutil— acusando a un archivo sano.
 *
 * La causa era una TERCERA que el gate no conocia: `proxy.ts` corta las APIs del panel cuando la
 * cuenta debe activar la 2FA. Y no hay que adivinarla: **el producto la publica**. El proxy
 * contesta `{error, code, next}`; el handler de `/api/bandeja` contesta `{error:"No autorizado"}`
 * SIN `code`. Esa diferencia es lo unico que separa «me corto la puerta» de «me corto la
 * bandeja», y es la que decide a quien se acusa. Leerla cuesta dos lineas; adivinarla costo un
 * diagnostico entero.
 */
export function corteDeLaPuerta(cuerpo) {
  const code = typeof cuerpo?.code === 'string' ? cuerpo.code.trim() : '';
  const next = typeof cuerpo?.next === 'string' ? cuerpo.next.trim() : '';
  if (!code || !next) return null;
  return { code, next, error: typeof cuerpo?.error === 'string' ? cuerpo.error.trim() : '' };
}

/**
 * El veredicto, separado de la red a proposito: es lo que se prueba sin docker, sin sesion y
 * sin produccion. `respuesta` es `{ status, cuerpo }` tal como sale de `/api/bandeja`.
 */
/**
 * ¿La sesion con la que se midio llego a `aal2`?
 *
 * El dato viaja como la LINEA que devuelve `elevarSegundoFactor()` —la misma que va al log— y no
 * como un booleano, para que el veredicto pueda citarla. La interpretacion vive acá, en un solo
 * lugar: repartir un `test(/aal2/)` por cada rama es como dos copias del mismo juicio divergen.
 */
export function seElevoElSegundoFactor(linea) {
  return /aal2/i.test(String(linea ?? ''));
}

/** El `code` del proxy que significa "hay factor verificado y falta el codigo" — el que el gate resuelve solo. */
export const CODE_FALTA_EL_CODIGO = 'MFA_REQUIRED';

export function juzgar(
  respuesta,
  {
    colgados,
    dueñoTieneOrg = null,
    rolDelDueño = null,
    otrosPerfilesDelDueño = null,
    segundoFactor = null,
  } = {},
) {
  const { status, cuerpo } = respuesta ?? {};

  // La puerta se pregunta ANTES que cualquier diagnostico de la bandeja, y para todo status que
  // no sea 200: el mismo `proxy.ts` contesta 401 (sin sesion), 403 (2FA, correo sin confirmar,
  // perfil ausente) y 503 (no pudo leer el estado). Todos cortan igual de lejos de la bandeja.
  const puerta = status !== 200 ? corteDeLaPuerta(cuerpo) : null;
  if (puerta) {
    const comun =
      `NO MEDIDO — la PUERTA de la app corto el pedido ANTES de la bandeja: ${status} ` +
      `\`${puerta.code}\`${puerta.error ? ` ("${puerta.error}")` : ''}, y manda a \`${puerta.next}\`. ` +
      'Ese cuerpo con `code` lo escribe `proxy.ts`, no `/api/bandeja` (que contesta 403 SIN ' +
      '`code`): la sesion llego y `bandeja-auth.ts` no es sospechoso de nada. El objetivo ' +
      'TAMPOCO se ve mientras la puerta corte, pero lo que se destraba es lo que pide ese ' +
      `\`code\`, no la bandeja. A quien se le corto: el dueño DERIVADO de los inboxes ` +
      `${INBOXES_DEL_OBJETIVO.join('/')}${rolDelDueño ? `, rol \`${rolDelDueño}\`` : ' (rol no medido)'}. ` +
      'A QUIEN alcanza esa exigencia lo decide `MFA_REQUIRED_ROLES` de `lib/mfa/policy.ts` en ' +
      '`onia-platform`, asi que este corte NO dice nada sobre las demas cuentas del panel: ';

    // ── El corte que este gate YA resuelve solo ────────────────────────────────────────────
    // Si la sesion se elevo a `aal2` y la puerta corta igual pidiendo el codigo, el sospechoso
    // no es la cuenta ni la 2FA: es que el JWT elevado no llego al proxy. Mandar a probar otra
    // cuenta ahi es la caza inutil que este archivo ya pago una vez.
    if (seElevoElSegundoFactor(segundoFactor)) {
      return {
        codigo: 2,
        sospechoso: 'puerta',
        mensaje:
          comun +
          `y el segundo factor de ESTA medicion ya se paso (${segundoFactor}), asi que la 2FA no ` +
          'es lo que falta. Lo que queda es que el JWT `aal2` no llegue al proxy: mirar que ' +
          'cookie viajo en el pedido (las que valen son las de DESPUES de `mfa.verify`) y que ' +
          'build corre produccion (`docker exec onia-platform cat /app/.next/BUILD_ID`).',
      };
    }

    // ── El corte que necesita una persona ─────────────────────────────────────────────────
    // Sin factor verificado no hay codigo que calcular: `totp.mjs` lee un secreto que todavia no
    // existe. Inscribirlo es un acto de una persona en su perfil, y eso hay que decirlo asi.
    if (puerta.code !== CODE_FALTA_EL_CODIGO) {
      return {
        codigo: 2,
        sospechoso: 'puerta',
        mensaje:
          comun +
          'y lo que falta NO es tipear un codigo sino INSCRIBIR el segundo factor: sin un factor ' +
          '`verified` en `auth.mfa_factors` no hay secreto que leer, asi que ningun TOTP lo puede ' +
          'inventar. Eso lo hace una persona desde su perfil (Sergio Urcullo), y hasta entonces ' +
          'el objetivo del carril queda sin comprobar por esta cuenta.',
      };
    }

    return {
      codigo: 2,
      sospechoso: 'puerta',
      mensaje:
        comun +
        // El remedio se ofrece SOLO si existe una cuenta que pueda tipearse ahi. La org dueña de
        // los inboxes 4/5 (`onia-interna`) tiene UN solo perfil, medido el 2026-09-19, asi que
        // recomendarlo a ciegas manda a buscar una cuenta que no existe.
        (otrosPerfilesDelDueño === null
          ? 'no se pudo contar cuantas OTRAS cuentas tiene esa organizacion, asi que no se sabe si ' +
            'hay alguna que probar con `--email <correo>`.'
          : otrosPerfilesDelDueño > 0
            ? `esa organizacion tiene ${otrosPerfilesDelDueño} cuenta(s) mas: ` +
              'medir otra con `--email <correo>` antes de concluir que ninguna entra.'
            : 'y esa organizacion NO tiene ninguna otra cuenta. La salida NO es que una persona ' +
              'tipee la 2FA: la sesion de esta medicion tenia que elevarse sola y no lo hizo, asi ' +
              'que mirar por que fallo `elevarSegundoFactor()` de `scripts/lib/sesion_dueno.mjs`, ' +
              'que calcula el TOTP leyendo `auth.mfa_factors` (su salida va al log de esta corrida).'),
    };
  }

  if (status === 403) {
    const comun =
      'NO AUTORIZADO (403) — `/inbox` le muestra el mismo 403 al dueño, asi que el objetivo NO se ve. ';
    // `bandejaProfile()` devuelve el MISMO `null` por dos causas: `getUser()` sin usuario (la
    // sesion no llego al producto) y `!profile?.organization` (el dato). El status no las separa
    // — las separa el perfil del dueño, que la base ya sabe.
    if (dueñoTieneOrg === true) {
      return {
        codigo: 1,
        sospechoso: 'sesion',
        mensaje:
          comun +
          'La sesion no esta llegando al producto: el perfil del dueño SI tiene organizacion en la ' +
          'base, o sea `!profile?.organization` es IMPOSIBLE y `bandeja-auth.ts` no es el sospechoso. ' +
          'Queda la otra rama del mismo `null`: `getUser()` sin usuario. Mirar que cookie viaja y ' +
          'que build corre produccion (`docker exec onia-platform cat /app/.next/BUILD_ID`).',
      };
    }
    if (dueñoTieneOrg === false) {
      return {
        codigo: 1,
        sospechoso: 'bandeja-auth',
        mensaje:
          comun +
          'El perfil del dueño NO tiene organizacion en la base, asi que la sesion resuelve a un ' +
          'perfil suelto. Mirar `lib/chatbot/bandeja-auth.ts`: `profile.organization` vino nulo.',
      };
    }
    return {
      codigo: 1,
      sospechoso: null,
      mensaje:
        comun +
        'NO se pudo distinguir cual de las dos causas es: `bandeja-auth.ts` devuelve el mismo `null` ' +
        'si la sesion no llego (`getUser()` sin usuario) y si el perfil no tiene organizacion. ' +
        'Correr `npm run inbox:tenencia`, o preguntarle a la base por el perfil del dueño, antes de ' +
        'tocar codigo: acusar a uno de los dos sin este dato manda a arreglar un archivo sano.',
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

  // Lo que este gate mide —que la conversacion de un desconocido SE VEA en la bandeja— puede
  // estar cumplido mientras esa misma persona lleva tres semanas sin que nadie le conteste. Paso:
  // el 2026-09-13 los dos desconocidos del fixture de aca (`mariohassen`, `F`) llevaban 16 y 19
  // dias colgados y este gate firmaba verde nombrandolos como prueba del objetivo cumplido.
  //
  // El codigo de salida NO cambia a proposito: contestarles no esta en manos de ningun loop, y un
  // rojo aca quedaria rojo para siempre, que es como se apaga un gate. Lo que cambia es el
  // silencio — un verde que nombra su propia herida sigue siendo util, uno que la esconde miente.
  // Sin el dato no se afirma nada: callar por no saber no es lo mismo que callar por estar bien.
  const vistas = new Set(desconocidas.map((c) => String(c.id)));
  const colgadas = (colgados || []).filter((c) => vistas.has(String(c.conversationId)));
  let herida = '';
  if (colgadas.length) {
    const peor = Math.max(...colgadas.map((c) => Number(c.esperaMin) || 0));
    const dias = Math.round(peor / (60 * 24));
    const quienes = colgadas.map((c) => `#${c.conversationId}`).join(', ');
    herida =
      ` ⚠️ Pero ${colgadas.length} de ellas sigue(n) SIN respuesta (${quienes}; la mas vieja hace ` +
      `${dias} d): se ven, y nadie les contesto.`;
  }

  return {
    codigo: 0,
    mensaje:
      `OBJETIVO VISIBLE — la bandeja del dueño trae ${desconocidas.length} conversacion(es) de ` +
      `gente que no somos nosotros: ${detalle}. Camino completo comprobado por HTTP ` +
      '(sesion → /api/bandeja → Chatwoot → lista), no solo la columna de la base.' + herida,
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

/**
 * El ESPEJO de lo que pregunta `bandejaProfile()`: del `auth.users` que la sesion resuelve al
 * `profiles.userId`, y de ahi a `organizationId`.
 *
 * ⚠️ A proposito NO se deriva de `SQL_DUEÑO`. Ese entra por `clinic_settings` y hace JOIN con
 * `profiles` POR `organizationId`, asi que todo perfil que salga de ahi tiene organizacion **por
 * construccion**: preguntarle a el si el dueño tiene org es una tautologia que contesta `true`
 * siempre, incluso el dia que el producto este roto. El camino que puede romperse es el del
 * producto —`userId` → perfil→ org— y es el unico que sirve para absolver o acusar a
 * `bandeja-auth.ts`.
 */
export function sqlPerfilDelDueño(email) {
  return (
    'select (p."organizationId" is not null) from public.profiles p ' +
    'join auth.users u on u.id::text = p."userId" ' +
    `where u.email = '${String(email).replace(/'/g, "''")}' limit 1;`
  );
}

/** Tri-estado: `true`/`false` medido, `null` = no se pudo preguntar. Nunca se inventa. */
function leerDueñoTieneOrg(contenedor, email) {
  if (!email) return null;
  try {
    const salida = correr('docker', ['exec', '-i', contenedor, 'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A'], {
      input: sqlPerfilDelDueño(email),
    });
    const fila = salida.trim().split('\n')[0]?.trim();
    if (fila === 't') return true;
    if (fila === 'f') return false;
    // Sin fila, el `userId` de la sesion no tiene perfil: `getUser()` resuelve y el perfil no
    // existe, que del lado de `bandejaProfile()` es el mismo `null` por el lado del DATO.
    return fila === '' ? false : null;
  } catch {
    return null;
  }
}

/**
 * El rol del dueño, para que el veredicto de la puerta NOMBRE a quien se le corto en vez de
 * generalizar. Tri-estado: `null` = no se pudo preguntar, y entonces el mensaje lo dice.
 *
 * Es una consulta aparte de `leerDueñoTieneOrg` a proposito: esa decide un veredicto ROJO y su
 * forma esta anclada por el self-check; esta solo agrega contexto y no puede tumbar nada.
 */
export function sqlRolDelDueño(email) {
  return (
    'select p.role from public.profiles p ' +
    'join auth.users u on u.id::text = p."userId" ' +
    `where u.email = '${String(email).replace(/'/g, "''")}' limit 1;`
  );
}

function leerRolDelDueño(contenedor, email) {
  if (!email) return null;
  try {
    const salida = correr('docker', ['exec', '-i', contenedor, 'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A'], {
      input: sqlRolDelDueño(email),
    });
    const fila = salida.trim().split('\n')[0]?.trim();
    return fila || null;
  } catch {
    return null;
  }
}

/**
 * Cuantas OTRAS cuentas tiene la organizacion del dueño — las que el remedio `--email` podria
 * probar. Se deriva de la base porque la rama «puerta» la recomienda a ciegas: medido el
 * 2026-09-19, `onia-interna` (la org que tiene los inboxes 4/5) tiene UN solo perfil, el
 * `SUPERADMIN` al que la puerta le exige 2FA, asi que «medir otra con `--email <correo>`» no
 * nombra ninguna cuenta que exista y la vuelta siguiente la gasta buscandola.
 */
export function sqlOtrosPerfilesDelDueño(email) {
  const correo = String(email).replace(/'/g, "''");
  return (
    'select count(*) from public.profiles otros ' +
    'where otros."organizationId" = (' +
    '  select p."organizationId" from public.profiles p ' +
    '  join auth.users u on u.id::text = p."userId" ' +
    `  where u.email = '${correo}' limit 1` +
    ') and otros."userId" <> (' +
    `  select u2.id::text from auth.users u2 where u2.email = '${correo}' limit 1` +
    ');'
  );
}

/** `number` (cuantas otras hay) o `null` si NO se pudo preguntar — nunca `0` inventado. */
function leerOtrosPerfilesDelDueño(contenedor, email) {
  if (!email) return null;
  try {
    const salida = correr('docker', ['exec', '-i', contenedor, 'psql', '-U', 'postgres', '-d', 'postgres', '-t', '-A'], {
      input: sqlOtrosPerfilesDelDueño(email),
    });
    const fila = salida.trim().split('\n')[0]?.trim();
    if (!/^\d+$/.test(fila ?? '')) return null;
    return Number(fila);
  } catch {
    return null;
  }
}

async function medir({ plataforma, base, appUrl, ssrDir, email = null }) {
  // `--email` pisa la derivacion, que es lo que hace ejecutable el remedio que imprime la rama
  // «puerta». Y se le exige el perfil ANTES de emitir nada: `generate_link` CREA la cuenta si el
  // correo no existe y devuelve 200 igual, asi que un dedazo aca daria de alta un usuario en
  // produccion y encima mediria una bandeja que no es la de nadie.
  const pedido = email ?? dueñoPedido(process.argv.slice(2));
  if (pedido && leerDueñoTieneOrg(base, pedido) === null) {
    throw new Error(
      `\`--email ${pedido}\` no tiene perfil en la base de produccion, o no se pudo preguntar. NO se ` +
        'emite la sesion: `generate_link` CREARIA esa cuenta y devolveria 200 igual',
    );
  }
  const dueño = pedido ?? leerDueño(base);
  if (!dueño) {
    throw new Error(
      `ninguna org tiene los inboxes ${INBOXES_DEL_OBJETIVO.join(' ni ')} en \`chatwootInboxId\` ni en ` +
        '`chatwootWhatsappInboxId`: no hay dueño a quien preguntarle. Se ve con `npm run inbox:tenencia`',
    );
  }

  // ⚠️ LA SESION NO SE ACUÑA ACA. Hasta el 2026-09-26 este bloque tenia su propia copia de la
  // receta (`generate_link` → `verify` → `setSession` → cookies) y esa copia quedaba en `aal1`:
  // toda cuenta con 2FA verificada rebotaba, el gate salia `NO MEDIDO — MFA_REQUIRED` y encima
  // cerraba diciendo que pasar el segundo factor era algo *"que un loop no puede hacer"* —
  // mientras `elevarSegundoFactor()` del modulo compartido lo hacia desde dos dias antes.
  // Esa es la divergencia que la cabecera de `sesion_dueno.mjs` anuncia palabra por palabra:
  // *"la que quede vieja no falla: entra igual y mide otra cosa"*. Midio otra cosa: nada.
  const { cookies, segundoFactor } = await acunarSesion(dueño, {
    raices: [`${ssrDir}/node_modules`],
    plataforma,
  });
  if (!cookies?.length) throw new Error('`@supabase/ssr` no escribio ninguna cookie de sesion');

  // Solo la LISTA. Abrir una conversacion la marcaria como leida en el Chatwoot de gente real.
  const r = await fetch(`${appUrl}/api/bandeja`, {
    headers: { cookie: cookies.map((c) => `${c.name}=${c.value}`).join('; ') },
  });
  let cuerpo = null;
  try {
    cuerpo = JSON.parse(await r.text());
  } catch {
    cuerpo = null;
  }
  // El perfil se pregunta SIEMPRE, no solo ante un 403: preguntarlo recien cuando ya hay rojo
  // ata el dato a la rama que lo necesita y lo deja sin medir el dia que la rama cambie.
  return {
    status: r.status,
    cuerpo,
    dueño,
    segundoFactor,
    dueñoTieneOrg: leerDueñoTieneOrg(base, dueño),
    rolDelDueño: leerRolDelDueño(base, dueño),
    otrosPerfilesDelDueño: leerOtrosPerfilesDelDueño(base, dueño),
  };
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

  // ── El verde que tapaba a cinco personas ──────────────────────────────────────────────
  //
  // Los dos desconocidos de ese fixture "real" son `mariohassen` y `F`: los MISMOS que el
  // 2026-09-13 llevaban 16 y 19 dias sin recibir una sola respuesta. O sea que este gate
  // celebraba como objetivo cumplido exactamente a las personas que el sistema abandono.
  //
  // El veredicto no cambia —que la conversacion SE VEA en la bandeja es lo que este gate mide, y
  // contestarles no esta en manos de ningun loop; un rojo aca quedaria rojo para siempre—, pero
  // un verde mudo sobre eso es el falso verde que dejo pasar 20 dias. Un verde que nombra su
  // propia herida sigue siendo util; uno que la esconde miente.
  afirmar(
    juzgar(hoy, { colgados: [] }).codigo === 0,
    'sin colgados el verde sigue siendo verde',
  );
  const conColgados = juzgar(hoy, {
    colgados: [
      { conversationId: 37, esperaMin: 16 * 24 * 60 },
      { conversationId: 35, esperaMin: 19 * 24 * 60 },
    ],
  });
  afirmar(conColgados.codigo === 0, 'el veredicto NO cambia: lo que este gate mide sigue cumplido');
  afirmar(conColgados.mensaje.toLowerCase().includes('sin respuesta'), 'pero el verde deja de ser mudo');
  afirmar(conColgados.mensaje.includes('19 d'), 'y dice hace cuanto espera el mas viejo');
  afirmar(conColgados.mensaje.includes('2'), 'y cuantos son');
  // Un colgado que NO esta en la bandeja mirada no se cuenta: el veredicto habla de lo que vio.
  const ajeno = juzgar(hoy, { colgados: [{ conversationId: 999, esperaMin: 5 * 24 * 60 }] });
  afirmar(!ajeno.mensaje.toLowerCase().includes('sin respuesta'), 'un colgado ajeno a esta bandeja no se cuenta');
  // Y sin el dato no se inventa nada: callar por no saber es distinto de callar por estar bien.
  afirmar(!juzgar(hoy).mensaje.toLowerCase().includes('sin respuesta'), 'sin el dato no afirma nada');
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

  // ⚠️ El 403 tiene DOS causas y `bandejaProfile()` las aplana en el mismo `null`:
  // `getUser()` sin usuario (la sesion no llego) y `!profile?.organization` (el dato). Afirmar
  // una sin poder distinguirlas manda a "arreglar" un archivo sano — medido el 2026-09-18, ver
  // el comentario de `juzgar`. El dato que las separa es del DUEÑO, y se pregunta a la base.
  const perfilConOrg = { status: 403, cuerpo: {} };
  // El veredicto se afirma sobre `sospechoso`, que es un DATO: un assert sobre la prosa se
  // apaga solo el dia que alguien reescriba el mensaje, y este gate existe justamente para que
  // el mensaje no vuelva a acusar de mas.
  const sinOrg = juzgar(perfilConOrg, { dueñoTieneOrg: false });
  afirmar(sinOrg.codigo === 1, 'un 403 con el dueño SIN org es ROJO');
  afirmar(sinOrg.sospechoso === 'bandeja-auth', 'y ahi si apunta al archivo del gate de sesion');
  afirmar(sinOrg.mensaje.includes('bandeja-auth'), 'y lo nombra, para poder abrirlo');

  const conOrg = juzgar(perfilConOrg, { dueñoTieneOrg: true });
  afirmar(conOrg.codigo === 1, 'un 403 con el dueño CON org sigue siendo ROJO');
  afirmar(
    conOrg.sospechoso === 'sesion',
    'pero NO acusa a `bandeja-auth.ts`: con el perfil ya resuelto esa causa es IMPOSIBLE',
  );
  afirmar(
    !/organization.{0,3} vino nulo/.test(conOrg.mensaje),
    'y no afirma el diagnostico que la base refuta',
  );
  afirmar(
    !/mirar\s+`?lib\/chatbot\/bandeja-auth/i.test(conOrg.mensaje),
    'y no manda a abrir el archivo sano (nombrarlo para ABSOLVERLO si vale)',
  );

  const sinSaber = juzgar(perfilConOrg);
  afirmar(sinSaber.codigo === 1, 'sin el dato del dueño el 403 sigue siendo ROJO');
  afirmar(sinSaber.sospechoso === null, 'y no elige sospechoso: no se pudo distinguir');
  afirmar(
    sinSaber.mensaje.includes('bandeja-auth') && sinSaber.mensaje.toLowerCase().includes('sesion'),
    'y nombra LAS DOS causas en vez de elegir una',
  );

  // ── LA TERCERA CAUSA: el corte de la PUERTA ──────────────────────────────────────────────
  //
  // Las dos ramas de arriba se escribieron creyendo que el 403 SOLO puede venir de
  // `bandeja-auth.ts`. La respuesta de abajo es la REAL de produccion del 2026-09-18, copiada
  // del cuerpo que devolvio `/api/bandeja` con la sesion del dueño; en la misma corrida
  // `/api/me` contesto 200 con el perfil entero, o sea que las dos ramas de arriba eran
  // imposibles y el gate elegia igual una de ellas.
  const puerta = {
    status: 403,
    cuerpo: {
      error: 'Activá la verificación en dos pasos desde tu perfil para continuar.',
      code: 'MFA_ENROLLMENT_REQUIRED',
      next: '/profile?mfa=obligatorio',
    },
  };
  // `dueñoTieneOrg: true` es el dato que hacia caer este caso en la rama "la sesion no llego".
  const cortado = juzgar(puerta, { dueñoTieneOrg: true });
  afirmar(cortado.codigo === 2, 'un corte de la puerta es NO MEDIDO, no un rojo del producto');
  afirmar(cortado.sospechoso === 'puerta', 'y el sospechoso es la puerta, no la bandeja');
  afirmar(cortado.mensaje.includes('MFA_ENROLLMENT_REQUIRED'), 'y nombra el `code` que el producto ya publica');
  afirmar(cortado.mensaje.includes('/profile?mfa=obligatorio'), 'y el `next`, que es el camino de cura');
  afirmar(
    !/`?getUser\(\)`? sin usuario/.test(cortado.mensaje),
    'y NO repite el diagnostico que `/api/me` refuta con la misma cookie',
  );
  afirmar(
    !cortado.mensaje.toLowerCase().includes('no medir no es estar bien'),
    'no cae en el "no medido" generico: ese no nombra la causa ni el camino',
  );
  // La puerta contesta con el MISMO cuerpo en 401 y 503, y los tres cortan igual de lejos.
  afirmar(
    juzgar({ status: 401, cuerpo: { error: 'Iniciá sesión', code: 'AUTH_REQUIRED', next: '/login' } }).sospechoso ===
      'puerta',
    'un 401 de la puerta tambien se reconoce',
  );
  afirmar(
    juzgar({ status: 503, cuerpo: { error: 'x', code: 'MFA_STATE_UNAVAILABLE', next: '/profile' } }).sospechoso ===
      'puerta',
    'y un 503 de la puerta tambien',
  );
  // Y la mitad simetrica, que es la que evita que la cura tape el bug original: el 403 del
  // HANDLER no trae `code`, asi que las dos ramas de `bandeja-auth` tienen que seguir vivas.
  afirmar(
    juzgar({ status: 403, cuerpo: { error: 'No autorizado' } }, { dueñoTieneOrg: false }).sospechoso === 'bandeja-auth',
    'el 403 del handler (sin `code`) sigue acusando a `bandeja-auth.ts`',
  );
  afirmar(corteDeLaPuerta({ error: 'No autorizado' }) === null, 'un cuerpo sin `code` no es corte de la puerta');
  afirmar(corteDeLaPuerta({ code: 'X' }) === null, 'ni uno con `code` pero sin `next`');
  afirmar(corteDeLaPuerta(null) === null, 'ni un cuerpo que no se pudo leer');

  // ─── El segundo factor: lo que el gate declaraba IMPOSIBLE y el repo ya sabia hacer ────────
  //
  // ⚠️ EL CASO DE CLASE, medido el 2026-09-26. Este gate salio `NO MEDIDO — MFA_REQUIRED` y
  // cerro el veredicto diciendo *"la unica salida es que ese dueño pase la 2FA (TOTP), que un
  // loop no puede hacer"*. Eso era FALSO cuando se imprimio: `scripts/lib/totp.mjs` (RFC 6238)
  // y `elevarSegundoFactor()` de `scripts/lib/sesion_dueno.mjs` existen desde el 2026-09-24 y
  // hacen exactamente eso — `mirar_bandeja_dueno.mjs` ya mira `/inbox` de esa misma cuenta.
  //
  // Es el MISMO molde que el bug del `--email` de mas abajo, y peor de un modo nuevo: ese
  // imprimia un remedio inejecutable; este declaraba imposible una capacidad PROPIA, o sea que
  // apagaba la unica medicion del objetivo del carril y encima explicaba por que no valia la
  // pena intentarlo. Un `NO MEDIDO` permanente se lee como "el ambiental de siempre".
  //
  // Los dos codes se separan porque se arreglan en lugares OPUESTOS: `MFA_REQUIRED` es "hay
  // factor verificado y falta el codigo" —el gate lo resuelve solo— y `MFA_ENROLLMENT_REQUIRED`
  // es "no hay factor", que ningun TOTP puede inventar: ahi si hace falta una persona.
  const puertaCodigo = { status: 403, cuerpo: { error: 'Confirmá tu código.', code: 'MFA_REQUIRED', next: '/login/2fa' } };
  // `otrosPerfilesDelDueño: 0` no es decorado: es la rama que imprimia el literal falso (la org
  // dueña de los inboxes tiene UNA sola cuenta). Sin ese dato el mensaje cae en "no se pudo
  // contar" y el caso pasaria verde sin tocar nunca la frase que este bloque existe para matar.
  const conSegundo = juzgar(puertaCodigo, {
    dueñoTieneOrg: true,
    segundoFactor: 'sesión aal2',
    otrosPerfilesDelDueño: 0,
  });
  afirmar(conSegundo.codigo === 2, 'un corte de la puerta sigue siendo NO MEDIDO');
  afirmar(
    !/un loop no puede/i.test(conSegundo.mensaje),
    'y NO declara imposible lo que `elevarSegundoFactor()` de este repo ya hace',
  );
  afirmar(
    /aal2|segundo factor/i.test(conSegundo.mensaje),
    'sino que DICE que la sesion ya se elevo, que es el dato que mueve al sospechoso',
  );
  afirmar(
    !/`--email/.test(conSegundo.mensaje),
    'y no manda a buscar otra cuenta: con el factor ya pasado, el sospechoso no es la cuenta',
  );
  // La mitad simetrica: sin factor verificado el TOTP no sirve, y eso hay que seguir diciendolo.
  const sinFactor = juzgar(
    { status: 403, cuerpo: { error: 'Activá la 2FA.', code: 'MFA_ENROLLMENT_REQUIRED', next: '/profile?mfa=obligatorio' } },
    { dueñoTieneOrg: true, segundoFactor: null, otrosPerfilesDelDueño: 0 },
  );
  afirmar(sinFactor.codigo === 2, 'un corte por falta de INSCRIPCION tambien es NO MEDIDO');
  afirmar(
    /inscri|no tiene (segundo )?factor/i.test(sinFactor.mensaje),
    'y dice que lo que falta es INSCRIBIR el factor, no tipear un codigo',
  );
  afirmar(
    /persona|Sergio/i.test(sinFactor.mensaje),
    'y que eso si necesita una persona: ningun TOTP inventa un factor que no existe',
  );

  // Un 200 nunca es corte: el cuerpo de la bandeja podria traer un campo `code` algun dia.
  afirmar(
    juzgar({ status: 200, cuerpo: { ok: true, sinCanal: true, conversaciones: [], code: 'X', next: '/y' } }).codigo === 1,
    'un 200 se juzga como bandeja aunque el cuerpo traiga `code`',
  );

  // El dato que separa las causas NO puede salir del SQL que elige al dueño: ese entra por
  // `clinic_settings` y hace JOIN por `organizationId`, asi que contestaria `true` siempre.
  afirmar(/auth\.users/.test(sqlPerfilDelDueño('x@y.z')), 'el perfil del dueño se busca por el camino del producto');
  afirmar(
    /u\.email\s*=/.test(sqlPerfilDelDueño('x@y.z')) && !/clinic_settings/.test(sqlPerfilDelDueño('x@y.z')),
    'y NO por `clinic_settings`, que lo volveria tautologico',
  );
  afirmar(
    sqlPerfilDelDueño("o'brien@y.z").includes("o''brien@y.z"),
    'y una comilla en el correo no parte la consulta',
  );

  // ⚠️ CABLEADO. Todo lo de arriba es puro, y por eso NO ve el esquive que importa: si el
  // llamador de produccion deja de pasarle `dueñoTieneOrg` a `juzgar`, los 60 casos siguen
  // verdes y el instrumento vuelve a no poder distinguir las dos causas — en silencio, que es
  // como nacio este bug. Medido el 2026-09-18: esa mutacion pasaba con exit 0.
  // Las cadenas van PARTIDAS porque el gate lee su propio archivo y si no se acusa solo.
  const fuente = readFileSync(fileURLToPath(import.meta.url), 'utf8');
  const llamadaViva = fuente.match(/const veredicto = juzgar\([^;]*\);/);
  afirmar(Boolean(llamadaViva), 'la llamada de produccion a juzgar() sigue existiendo');
  afirmar(
    llamadaViva ? llamadaViva[0].includes('due' + 'ñoTieneOrg') : false,
    'y le pasa el dato que separa las dos causas del 403',
  );
  // El sujeto es que el valor se DERIVE, no que la clave exista: `dueñoTieneOrg: null` deja la
  // clave en su lugar y el dato sin medir para siempre. Medido: esa mutacion pasaba verde.
  // El `\s*` y no un espacio: el return crecio a varias lineas al sumarle el rol, y un ancla que
  // se rompe con el formato deja de medir el cableado sin que nada lo diga.
  const returnDeMedir = fuente.match(/return \{\s*status: r\.status,[^;]*\};/);
  afirmar(Boolean(returnDeMedir), '`medir()` sigue devolviendo la respuesta');
  afirmar(
    returnDeMedir ? /leerDue[^(]*\(base, dueño\)/.test(returnDeMedir[0]) : false,
    'y DERIVA el dato del dueño ahi mismo, en vez de dejar la clave puesta en null',
  );

  // ⚠️ CABLEADO del segundo factor, hermano del de `dueñoTieneOrg`. Sin esto, los seis casos de
  // la seccion «segundo factor» quedan verdes con `medir()` acuñando su sesion `aal1` por su
  // cuenta — que es EXACTAMENTE como nacio ese bug: este archivo tenia su propia copia de la
  // receta (`generate_link` → `verify` → cookies) y esa copia se quedo sin el paso del segundo
  // factor. La cabecera de `sesion_dueno.mjs` ya lo habia escrito: *"Dos copias de esto
  // divergen, y la que quede vieja no falla: entra igual y mide otra cosa"*. Midio otra cosa.
  //
  // Los comentarios se quitan ANTES de buscar: este archivo CITA el literal viejo a proposito,
  // y un gate que parte su fuente sin sacar la prosa mide el pedazo equivocado en verde.
  const codigoVivo = soloCodigo(fuente);
  // El nombre va PARTIDO y el sujeto es la LLAMADA (con su parentesis): escrito entero, el
  // mensaje de este mismo `afirmar` es codigo y el gate se acusa —o se absuelve— solo. Pasó al
  // escribirlo: el caso salio verde sin que `medir()` llamara a nada.
  const elevar = 'elevarSegundo' + 'Factor';
  afirmar(
    codigoVivo.includes(`${elevar}(`),
    `\`medir()\` LLAMA a \`${elevar}\` del modulo compartido, en vez de una receta propia`,
  );
  afirmar(
    /from '\.\/lib\/sesion_dueno\.mjs'/.test(codigoVivo),
    'y lo importa de `scripts/lib/sesion_dueno.mjs`, que es el unico dueño de esa receta',
  );
  afirmar(
    returnDeMedir ? /segundoFactor/.test(returnDeMedir[0]) : false,
    'y `medir()` DEVUELVE si se elevo, en vez de dejar el dato sin salir de la funcion',
  );
  afirmar(
    llamadaViva ? llamadaViva[0].includes('segundoFactor') : false,
    'y la llamada viva a juzgar() se lo pasa: sin eso el veredicto no puede mover al sospechoso',
  );
  // Y el guardia contra la copia que quede: si el literal de `generate_link` vuelve al CODIGO de
  // este archivo, alguien reimplemento la receta al lado de la compartida.
  afirmar(
    !codigoVivo.includes('admin/' + 'generate_link'),
    'y NO vuelve a tener su propia receta de magiclink al lado de la del modulo compartido',
  );

  // ─── Un remedio que se imprime tiene que poder tipearse ────────────────────────────────────
  //
  // ⚠️ EL CASO DE CLASE, y el que dio origen a todo esto (2026-09-18). La rama «puerta» cerraba
  // con «tambien se puede medir con una cuenta que ya lo cumpla (`--email`)» y esa bandera NO
  // existia: el unico `process.argv` era el de `--self-check`. El lector que obedecia el remedio
  // veia el MISMO veredicto y no tenia con que refutarlo, asi que el objetivo del carril quedo
  // NO MEDIDO vuelta tras vuelta — y de ese texto salio una tarea que le pedia a Sergio Urcullo
  // BAJARLE la 2FA a una cuenta que no tenia el problema.
  //
  // El universo se DERIVA de la ventana de `juzgar()`, no de una lista escrita a mano: una rama
  // nueva que recomiende una bandera nueva entra sola. Prohibir el literal viejo habria cerrado
  // la instancia; esto cierra la clase.
  const recomendadas = banderasQueRecomienda(fuente);
  afirmar(Array.isArray(recomendadas), 'se puede acotar la ventana de juzgar() para leer sus remedios');
  afirmar(
    (recomendadas ?? []).includes('--' + 'email'),
    'el sujeto conocido sigue en el universo (si no, el gate se apago solo)',
  );
  // ⚠️ Y que el universo salga de `juzgar()` y NO de este gate. Medido al escribirlo: la ventana
  // arrancaba en la MENCION del nombre que vive dentro de `banderasQueRecomienda`, asi que el
  // `--email` que encontraba era el de su propio regex. Todos los casos en verde, midiendose a
  // si mismo, y la mutacion que reintroduce el bug pasando limpia. El nombre va PARTIDO: el gate
  // lee su propio archivo y si no se acusa solo.
  const marcaDeJuzgar = 'la PUERTA de la app corto el pedido';
  afirmar(
    fuente.slice(fuente.search(/^export function juzgar\(/m)).includes(marcaDeJuzgar),
    'la ventana arranca en la DEFINICION de juzgar(), no en una mencion de su nombre',
  );
  // La prueba directa de que no se auto-mide: si se le borra al MENSAJE su bandera, el universo
  // se queda vacio. Mientras la ventana fue este mismo gate, seguia devolviendo `--email`.
  // ⚠️ La mutacion tiene que borrar TODAS las apariciones, no la primera: el 2026-09-19 la rama
  // «puerta» paso a nombrar `--email` en dos de sus tres ramas y este caso se puso rojo con el
  // gate sano — un `replace` de una sola ocurrencia deja viva la otra y ya no prueba nada.
  // Se muta el TOKEN de la bandera, no una frase: la rama «puerta» la nombra en tres lugares y
  // con tres redacciones distintas, asi que atar la mutacion a una de ellas deja vivas las otras.
  const sinLaBandera = fuente.replaceAll('--' + 'email', 'nada');
  afirmar(
    !sinLaBandera.includes('--' + 'email'),
    'la mutacion entro (si el literal cambia de forma, este caso deja de mutar y se apaga solo)',
  );
  afirmar(
    banderasQueRecomienda(sinLaBandera)?.length === 0,
    'el universo sale del MENSAJE de juzgar(), no del regex de este gate',
  );
  for (const bandera of recomendadas ?? []) {
    afirmar(
      BANDERAS.includes(bandera),
      `el remedio \`${bandera}\` que imprime juzgar() es una bandera que el programa sabe leer`,
    );
  }

  // Y que este en la lista no alcanza: el parser tiene que devolver el valor.
  afirmar(dueñoPedido(['--email', 'a@b.co']) === 'a@b.co', '`--email x` se lee');
  afirmar(dueñoPedido(['--email=a@b.co']) === 'a@b.co', 'y `--email=x` tambien, que es la que sale de copiar');
  afirmar(dueñoPedido([]) === null, 'sin bandera se deriva el dueño de la base, como siempre');
  afirmar(dueñoPedido(['--email']) === null, 'una bandera sin valor NO es un correo vacio');
  afirmar(dueñoPedido(['--email', '--self-check']) === null, 'ni se come la bandera siguiente');

  // ─── El veredicto de la puerta NOMBRA a quien se le corto ──────────────────────────────────
  //
  // Decia «el dueño rebota igual al abrir `/inbox`» sin saber el rol, y eso se leyo —con razon—
  // como «ninguna cuenta entra». Medido ese dia: `sergio@onia.com.bo` (ADMIN) abria `/inbox` con
  // HTTP 200 mientras el dueño DERIVADO de los inboxes 4/5 (SUPERADMIN) rebotaba. Las dos cosas
  // eran ciertas a la vez; el mensaje solo conocia una.
  const corte = { status: 403, cuerpo: { error: 'x', code: 'MFA_REQUIRED', next: '/login/2fa' } };
  const conRol = juzgar(corte, { dueñoTieneOrg: true, rolDelDueño: 'SUPERADMIN' });
  afirmar(conRol.codigo === 2 && conRol.sospechoso === 'puerta', 'el corte de la puerta sigue siendo NO MEDIDO');
  afirmar(conRol.mensaje.includes('SUPERADMIN'), 'y NOMBRA el rol del dueño cuando la base lo contesto');
  afirmar(
    juzgar(corte, { dueñoTieneOrg: true }).mensaje.includes('rol no medido'),
    'y dice que NO lo midio cuando no lo pudo preguntar, en vez de callarlo',
  );
  // La afirmacion que sobraba: el corte de ESTE dueño no es un veredicto sobre las demas cuentas.
  afirmar(
    !/rebota igual/.test(conRol.mensaje),
    'y ya no generaliza el rebote a toda cuenta del panel (era falso para los ADMIN)',
  );
  afirmar(
    /MFA_REQUIRED_ROLES/.test(conRol.mensaje),
    'manda a la fuente que decide a quien alcanza, en vez de tipear la politica (se desincroniza)',
  );

  // ─── El remedio `--email` solo se ofrece si hay una cuenta que nombrar ─────────────────────
  //
  // ⚠️ Medido el 2026-09-19 contra produccion: la rama «puerta» recomendaba `--email <correo>`
  // SIEMPRE, y la org dueña de los inboxes 4/5 (`onia-interna`) tiene UN solo perfil — el
  // `SUPERADMIN` al que la puerta le corta. O sea que el remedio era tipeable pero no podia
  // nombrar a nadie, y la vuelta siguiente la gasta buscando la cuenta que no existe. Es la
  // hermana del caso de clase de arriba: alla el remedio no se podia tipear, aca no se puede
  // CUMPLIR. Las tres ramas hacen falta, y el `null` NO es `0`: no haber podido contar y haber
  // contado cero mandan a lugares opuestos.
  const sinOtras = juzgar(corte, { dueñoTieneOrg: true, rolDelDueño: 'SUPERADMIN', otrosPerfilesDelDueño: 0 });
  afirmar(
    !/medir otra con/.test(sinOtras.mensaje),
    'con CERO cuentas mas, NO recomienda probar otra (no hay ninguna que nombrar)',
  );
  afirmar(
    /2FA|TOTP/.test(sinOtras.mensaje),
    'y nombra la unica salida real, en vez de dejar al lector sin nada que hacer',
  );
  const conOtras = juzgar(corte, { dueñoTieneOrg: true, rolDelDueño: 'SUPERADMIN', otrosPerfilesDelDueño: 2 });
  afirmar(
    /medir otra con/.test(conOtras.mensaje) && /2 cuenta/.test(conOtras.mensaje),
    'con otras cuentas SI lo recomienda, y dice cuantas hay',
  );
  afirmar(
    /no se pudo contar/.test(conRol.mensaje),
    'y sin el dato lo dice (tri-estado): no haber contado no es haber contado cero',
  );
  // ⚠️ CABLEADO: las tres puras de arriba pasan aunque `medir()` nunca derive el dato y la
  // llamada viva lo deje en `null` para siempre — que es exactamente como nace esta familia.
  afirmar(
    returnDeMedir ? /otrosPerfilesDelDue[^:]*: leerOtrosPerfiles[^(]*\(base, dueño\)/.test(returnDeMedir[0]) : false,
    '`medir()` DERIVA cuantas otras cuentas hay y lo devuelve',
  );
  afirmar(
    llamadaViva ? llamadaViva[0].includes('otrosPerfilesDelDue' + 'ño') : false,
    'y la llamada de produccion se lo pasa a juzgar()',
  );

  // ⚠️ CABLEADO de las dos mitades nuevas. Puras, las de arriba pasan aunque `medir()` no derive
  // el rol ni respete la bandera — que es justo como nacio el bug que este bloque cierra.
  afirmar(
    returnDeMedir ? /rolDelDue[^:]*: leerRol[^(]*\(base, dueño\)/.test(returnDeMedir[0]) : false,
    '`medir()` DERIVA el rol del dueño y lo devuelve',
  );
  afirmar(
    llamadaViva ? llamadaViva[0].includes('rolDelDue' + 'ño') : false,
    'y la llamada de produccion se lo pasa a juzgar()',
  );
  const cuerpoDeMedir = fuente.slice(
    fuente.indexOf('async function medir('),
    returnDeMedir ? fuente.indexOf(returnDeMedir[0]) : fuente.length,
  );
  afirmar(
    /due[^=]*= pedido \?\? leerDue[^(]*\(base\)/.test(cuerpoDeMedir),
    'la bandera PISA al dueño derivado (si no, se lee el argumento y se mide igual la otra cuenta)',
  );
  // La trampa que ya costo caro en `mirar_bandeja_dueno.mjs`: `generate_link` CREA la cuenta si
  // el correo no existe y devuelve 200 igual. Un dedazo en la bandera daria de alta un usuario
  // en produccion, asi que el perfil se exige ANTES de emitir.
  // Se ancla a la RUTA de la admin API y no al nombre pelado: el comentario que explica la
  // trampa nombra `generate_link` unas lineas ANTES de la guarda, asi que cortar por el nombre
  // deja fuera justo lo que se quiere medir. Los comentarios acusan y absuelven.
  const antesDeEmitir = cuerpoDeMedir.slice(0, cuerpoDeMedir.indexOf('/auth/v1/admin/'));
  afirmar(
    /if \(pedido && leerDue[^(]*\(base, pedido\) === null\)/.test(antesDeEmitir),
    'y se le exige perfil en la base ANTES de emitir la sesion',
  );

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

  // Quien de los que SE VEN sigue sin respuesta. Se le pregunta al vigia, que es el modulo que ya
  // sabe decidirlo, en vez de reimplementar el criterio aca (dos copias del mismo juicio divergen).
  //
  // Best-effort a proposito: si esto no se puede derivar, el veredicto sale como salia siempre. Un
  // gate que mide "la bandeja se ve" no se puede tumbar porque una consulta ACCESORIA fallo — pero
  // tampoco puede inventar tranquilidad, y por eso el mensaje solo nombra la herida cuando el dato
  // existe de verdad.
  let colgados;
  try {
    const vigia = await import('./vigia_sin_respuesta.mjs');
    const filas = await vigia.leerFilasDeChatwoot();
    colgados = vigia.seleccionarColgados(filas, { ahoraMs: Date.now() });
  } catch {
    colgados = undefined;
  }

  const veredicto = juzgar(respuesta, {
    colgados,
    dueñoTieneOrg: respuesta?.dueñoTieneOrg ?? null,
    rolDelDueño: respuesta?.rolDelDueño ?? null,
    otrosPerfilesDelDueño: respuesta?.otrosPerfilesDelDueño ?? null,
    segundoFactor: respuesta?.segundoFactor ?? null,
  });
  console[veredicto.codigo === 0 ? 'log' : 'error'](`[dueño: ${respuesta.dueño}] ${veredicto.mensaje}`);
  return veredicto.codigo;
}

// Solo mide en VIVO si se lo invoca como programa. Sin esta guarda, un `import` de las funciones
// puras dispara un `docker exec` y una sesion real contra produccion como efecto de cargar el
// modulo. `pathToFileURL` y no `new URL("file://" + argv[1])`: con `node -e "import(...)" <arg>`
// el `argv[1]` es el ARGUMENTO y no una ruta, y concatenarlo tira `ERR_INVALID_URL`.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (process.argv.includes('--self-check')) selfCheck();
  // `main().then(...)` y NO `await main()`, que es lo que decia hasta el 2026-09-13. Con el await
  // de nivel superior, el modulo se queda EVALUANDOSE mientras corre la medicion — y el vigia, que
  // importa `esNuestra` de aca, forma un ciclo: su `import()` esperaba a que este modulo terminara
  // de evaluarse, y este modulo esperaba al `import()`. Deadlock, con una pinta muy enganosa: el
  // proceso muere solo con `exit 13` y "Detected unsettled top-level await", sin tocar ninguna de
  // las trazas de error del gate. Corriendo asi, la evaluacion termina antes de que main() pida
  // nada y el ciclo se resuelve al instante.
  else main().then(
    (codigo) => process.exit(codigo),
    (e) => {
      console.error(`NO MEDIDO — ${String(e?.message || e).split('\n')[0]}`);
      process.exit(2);
    },
  );
}

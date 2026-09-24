import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  AL_DIA,
  ARREGLOS_VARADOS,
  NO_PUDE_MEDIR,
  RETROCEDE,
  CUBRE,
  VIEJO,
  NINGUNO,
  shaQueCorre,
  shaDeEtiqueta,
  shaVivoConciliado,
  llegaAlCliente,
  diagnosticar,
  evaluarStaged,
  varadosDesde,
  parsearBuildsSsh,
  buildsDeProduccion,
  REPO,
  RAMA_DEPLOY,
} from './deploy-vivo.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));

// ── qué sha corre ───────────────────────────────────────────────────────────
// El BUILD_ID vivo se casa contra los build-<sha> del disco. Es la ÚNICA forma
// de saber qué código corre: `docker inspect --format {{.Created}}` no sirve
// porque el swap reinicia y no recrea, así que Created queda anclado al día que
// se levantó el contenedor (medido el 2026-09-04: decía "17 commits sin
// desplegar" sobre un deploy que estaba al día).

test('casa el BUILD_ID vivo contra los build-<sha> del disco', () => {
  const builds = [
    { sha: '443e3e7', buildId: '-en0j_tAYbfor2oQ0DnbB' },
    { sha: 'b5e23d4', buildId: 'otroBuildIdCualquiera' },
  ];
  assert.equal(shaQueCorre({ buildIdVivo: '-en0j_tAYbfor2oQ0DnbB', builds }), '443e3e7');
});

test('BUILD_ID que no casa con ningún build en disco devuelve null, NO un sha inventado', () => {
  const builds = [{ sha: '443e3e7', buildId: 'unBuildId' }];
  assert.equal(shaQueCorre({ buildIdVivo: 'idDesconocido', builds }), null);
});

test('sin BUILD_ID vivo devuelve null (no se sabe), nunca un sha', () => {
  assert.equal(shaQueCorre({ buildIdVivo: null, builds: [{ sha: 'a', buildId: 'x' }] }), null);
  assert.equal(shaQueCorre({ buildIdVivo: '', builds: [{ sha: 'a', buildId: 'x' }] }), null);
});

// ── qué viaja al cliente ────────────────────────────────────────────────────
// Un commit que sólo toca gates o scripts NO cambia lo que el navegador recibe.
// Contarlo como varado se autobloquea: cada vuelta del carril invalida el build
// ya armado y el pedido de deploy no se estabiliza nunca (medido el 2026-09-04
// en web-venta, donde "8 arreglos varados" eran 5 reales y 2 scripts propios).
// Por defecto un archivo SÍ viaja: el error posible es pedir un deploy de más,
// nunca declarar al día algo que no lo está.

test('un commit que sólo toca tests o scripts no llega al cliente', () => {
  assert.equal(llegaAlCliente(['src/app/page.test.ts']), false);
  assert.equal(llegaAlCliente(['scripts/deploy-vivo.mjs', 'vitest.config.ts']), false);
  assert.equal(llegaAlCliente(['__tests__/algo.ts']), false);
});

test('un archivo de la app sí llega al cliente, y basta uno para que el commit cuente', () => {
  assert.equal(llegaAlCliente(['src/app/page.tsx']), true);
  assert.equal(llegaAlCliente(['src/app/page.test.ts', 'src/lib/plan-limits.ts']), true);
});

test('un commit sin archivos legibles cuenta como que viaja (no se descarta a ciegas)', () => {
  assert.equal(llegaAlCliente([]), true);
  assert.equal(llegaAlCliente(null), true);
});

// ── el diagnóstico ──────────────────────────────────────────────────────────

test('AL_DIA cuando el sha que corre es el HEAD de la rama de deploy', () => {
  const d = diagnosticar({ shaVivo: '443e3e7', headSha: '443e3e7', varados: [], desciende: true });
  assert.equal(d.codigo, AL_DIA);
});

test('ARREGLOS_VARADOS cuando hay commits posteriores que el cliente no ve', () => {
  const varados = [
    { sha: '8a67c0c', asunto: 'la misma pantalla decia "3 de 500" y "Contratar"' },
    { sha: '7599b5d', asunto: 'el dueño con el add-on no podia conectar su WhatsApp' },
  ];
  const d = diagnosticar({ shaVivo: '443e3e7', headSha: '0db6549', varados, desciende: true });
  assert.equal(d.codigo, ARREGLOS_VARADOS);
  assert.equal(d.varados.length, 2);
});

test('AL_DIA también cuando lo posterior existe pero nada de eso viaja al cliente', () => {
  const d = diagnosticar({ shaVivo: '443e3e7', headSha: '0db6549', varados: [], desciende: true });
  assert.equal(d.codigo, AL_DIA);
});

// ── cómo NO falla en verde ──────────────────────────────────────────────────
// Un `git log` vacío tiene dos causas opuestas —no hay nada varado, o el
// comando falló— y confundirlas es como esta familia de gates se rinde en
// verde. Por eso `[]` es un dato y `null` es la ausencia de dato.

test('sin saber qué sha corre sale NO_PUDE_MEDIR, jamás AL_DIA', () => {
  const d = diagnosticar({ shaVivo: null, headSha: '0db6549', varados: [], desciende: true });
  assert.equal(d.codigo, NO_PUDE_MEDIR);
});

test('varados null (git no contestó) es NO_PUDE_MEDIR, distinto de [] que es "no hay nada"', () => {
  const roto = diagnosticar({ shaVivo: '443e3e7', headSha: '0db6549', varados: null, desciende: true });
  assert.equal(roto.codigo, NO_PUDE_MEDIR);
  const sano = diagnosticar({ shaVivo: '443e3e7', headSha: '0db6549', varados: [], desciende: true });
  assert.equal(sano.codigo, AL_DIA);
});

test('sin HEAD de la rama de deploy sale NO_PUDE_MEDIR', () => {
  const d = diagnosticar({ shaVivo: '443e3e7', headSha: null, varados: [], desciende: true });
  assert.equal(d.codigo, NO_PUDE_MEDIR);
});

// ── la guarda que evita el daño ─────────────────────────────────────────────
// Un pedido de deploy heredado puede pedir publicar un build ANTERIOR al que ya
// corre, y obedecerlo RETROCEDE producción. Medido el 2026-09-04 en t_18ea4aff:
// pedía publicar build-a4b1d97 cuando ya corría build-b5e23d4, que lo incluye —
// el swap habría apagado el fix de la CSP del add-on de WhatsApp.

test('si lo que se publicaría no desciende de lo que ya corre, RETROCEDE y no se publica', () => {
  const varados = [{ sha: 'viejo01', asunto: 'algo' }];
  const d = diagnosticar({ shaVivo: 'b5e23d4', headSha: 'a4b1d97', varados, desciende: false });
  assert.equal(d.codigo, RETROCEDE);
  assert.notEqual(d.codigo, ARREGLOS_VARADOS);
});

test('desciende null (no se pudo preguntar) NO se asume verdadero', () => {
  const varados = [{ sha: 'x', asunto: 'algo' }];
  const d = diagnosticar({ shaVivo: 'b5e23d4', headSha: 'a4b1d97', varados, desciende: null });
  assert.equal(d.codigo, NO_PUDE_MEDIR);
});

// ── el staged ───────────────────────────────────────────────────────────────

test('CUBRE sólo si el staged es del HEAD y está íntegro', () => {
  const staged = { sha: '0db6549', integro: true };
  assert.equal(evaluarStaged({ staged, headSha: '0db6549' }).estado, CUBRE);
});

test('un staged de otro sha es VIEJO — publicarlo dejaría arreglos afuera', () => {
  const staged = { sha: '443e3e7', integro: true };
  assert.equal(evaluarStaged({ staged, headSha: '0db6549' }).estado, VIEJO);
});

test('un staged del HEAD pero incompleto NO cubre: el swap dejaría producción sin server.js', () => {
  const staged = { sha: '0db6549', integro: false };
  assert.notEqual(evaluarStaged({ staged, headSha: '0db6549' }).estado, CUBRE);
});

test('sin staged es NINGUNO, y hay que armar antes de publicar', () => {
  assert.equal(evaluarStaged({ staged: null, headSha: '0db6549' }).estado, NINGUNO);
});

// ── los builds, vengan del disco de acá o del VPS ───────────────────────────
// Este gate mide PRODUCCIÓN, y producción vive en `/opt/onia-platform` del VPS.
// Cuando el loop se mudó a nodo-casa esa ruta dejó de existir en el disco local
// y el gate quedó CIEGO: salía `NO PUDE MEDIR` (exit 2, que es honesto) y nadie
// lo notaba, porque el pedido de deploy que le llega a Sergio Urcullo se sostiene
// con OTRAS cifras que seguían en meta. Lo tramposo es que la mitad barata sí
// contestaba —`docker exec` es un shim que delega en el VPS—, y un gate que
// contesta a medias se lee como un gate que anda.

test('parsea los builds que contestó el VPS a la misma forma que los del disco', () => {
  const builds = parsearBuildsSsh('b54a148|sNMW9rcT8D15GNP2qKYlm|si\n3d1dabb|J4LFta9YhYnlO3QAbJJZ8|si\n', '/opt/onia-platform');
  assert.equal(builds.length, 2);
  assert.deepEqual(builds[0], {
    sha: 'b54a148',
    buildId: 'sNMW9rcT8D15GNP2qKYlm',
    ruta: '/opt/onia-platform/build-b54a148',
    integro: true,
  });
  // Y sirve para lo único que importa: saber qué sha corre.
  assert.equal(shaQueCorre({ buildIdVivo: 'sNMW9rcT8D15GNP2qKYlm', builds }), 'b54a148');
});

// El caso caro, y el único que ningún otro guardia puede ver: si el parseo
// leyera «tiene BUILD_ID» como «está íntegro», `evaluarStaged` diría CUBRE sobre
// un build a medio armar y el swap dejaría producción sin `server.js`.
test('un build remoto a medio armar llega íntegro=false aunque tenga BUILD_ID', () => {
  const [build] = parsearBuildsSsh('5a49a68|VI4689QnCLCVqolkhDrY|no\n', '/opt/onia-platform');
  assert.equal(build.integro, false);
  assert.notEqual(evaluarStaged({ staged: build, headSha: '5a49a68' }).estado, CUBRE);
});

test('una línea sin BUILD_ID no inventa uno: queda null y nunca casa con el vivo', () => {
  const [build] = parsearBuildsSsh('5a49a68||no\n', '/opt/onia-platform');
  assert.equal(build.buildId, null);
  assert.equal(shaQueCorre({ buildIdVivo: 'sNMW9rcT8D15GNP2qKYlm', builds: [build] }), null);
});

test('el disco local contesta: no se le pregunta al VPS', () => {
  let preguntas = 0;
  const r = buildsDeProduccion('/opt/onia-platform', {
    local: () => [{ sha: 'b54a148', buildId: 'X', ruta: '/opt/onia-platform/build-b54a148', integro: true }],
    remoto: () => {
      preguntas += 1;
      return [];
    },
  });
  assert.equal(preguntas, 0);
  assert.equal(r.origen, 'local');
});

test('el disco local no está (null): cae al VPS y lo dice', () => {
  const r = buildsDeProduccion('/opt/onia-platform', {
    local: () => null,
    remoto: () => [{ sha: 'b54a148', buildId: 'X', ruta: '/opt/onia-platform/build-b54a148', integro: true }],
  });
  assert.equal(r.origen, 'remoto');
  assert.equal(r.builds[0].sha, 'b54a148');
});

// La distinción que cuesta cara, y va en las dos direcciones: una lista VACÍA es
// una respuesta REAL («no hay ningún build armado») y `null` es «no pude
// preguntar». Meterlas en la misma bolsa es exactamente cómo un gate declara
// «al día» sobre algo que no midió.
test('el VPS contesta que no hay builds: eso es [] (respuesta), no null', () => {
  const r = buildsDeProduccion('/opt/onia-platform', { local: () => null, remoto: () => [] });
  assert.notEqual(r, null);
  assert.deepEqual(r.builds, []);
});

test('ninguna de las dos vías contestó: devuelve null, JAMÁS []', () => {
  const r = buildsDeProduccion('/opt/onia-platform', { local: () => null, remoto: () => null });
  assert.equal(r, null);
});

// La dirección que importa de verdad: con las dos vías mudas el gate no puede
// decir «al día». Sin este caso, un arreglo que rompa la vía remota deja el gate
// callado y el trabajo varado sin que nada se ponga rojo.
test('con las dos vías mudas el veredicto es NO_PUDE_MEDIR, nunca AL_DIA', () => {
  const r = buildsDeProduccion('/opt/onia-platform', { local: () => null, remoto: () => null });
  const sha = shaQueCorre({ buildIdVivo: 'sNMW9rcT8D15GNP2qKYlm', builds: r?.builds });
  const veredicto = diagnosticar({ shaVivo: sha, headSha: '5a49a68', varados: [], desciende: true });
  assert.equal(veredicto.codigo, NO_PUDE_MEDIR);
  assert.notEqual(veredicto.codigo, AL_DIA);
});

// ── un merge no es un arreglo ───────────────────────────────────────────────
// El número que sale de acá es el que se cita en el pedido de deploy, o sea lo
// ÚNICO que Sergio Urcullo lee antes de contestar «ok». Contando los merges se
// infla: el 2026-09-06 el publicador dijo «4 arreglos» sobre 2 reales (la
// pantalla de gastos y la de créditos), porque los dos merges que los trajeron
// contaban de nuevo el mismo trabajo.
//
// La causa es que `git log --name-only` NO lista los archivos de un merge (no
// muestra su diff salvo con `-m`/`-c`), así que todo merge llega con
// `archivos: []` — y `llegaAlCliente([])` responde `true` A PROPÓSITO, porque
// «no sé qué tocó» tiene que pedir un deploy de más y nunca declarar al día lo
// que no lo está. Ese sesgo hay que CONSERVARLO: el arreglo va en la consulta,
// sacando los merges antes de clasificar, y no tocando `llegaAlCliente`.
//
// Es el mismo defecto que su gemelo de landing ya tenía arreglado esta mañana
// (`web-factory/apps/onia-platform/scripts/deploy-vivo.mjs`, 16 % inflado). El
// arreglo no viajó al hermano: por eso el caso vive acá y no sólo allá.

/** Los merges de la misma ventana, preguntados aparte del instrumento. */
function shasDeMerges(desde) {
  try {
    return execFileSync('git', ['-C', REPO, 'log', '--merges', '--format=%h', `${desde}..${RAMA_DEPLOY}`], {
      encoding: 'utf8',
      timeout: 30000,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .trim()
      .split('\n')
      .filter(Boolean);
  } catch {
    return null;
  }
}

/**
 * Ventana ancha del repo real. Se salta si el clon no está: este archivo corre
 * en la cadena `npm test` de la raíz, y un rojo por AMBIENTE traba el merge de
 * los quince carriles.
 */
function ventana() {
  try {
    return execFileSync('git', ['-C', REPO, 'rev-parse', '--short', `${RAMA_DEPLOY}~40`], {
      encoding: 'utf8',
      timeout: 30000,
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

// Sin este caso, el de abajo pasaría en verde el día que la ventana no tuviera
// merges — y entonces `--no-merges` se podría borrar del script sin que nada se
// pusiera rojo. Es la dirección que nadie audita.
test('la ventana elegida CONTIENE merges (si no, el caso siguiente no prueba nada)', (t) => {
  const desde = ventana();
  if (!desde) return t.skip('sin el clon de onia-platform: ambiental, no es un defecto');
  const merges = shasDeMerges(desde);
  assert.notEqual(merges, null, 'git no contestó: el caso siguiente no puede concluir');
  assert.ok(merges.length > 0, 'la ventana no tiene merges: elegí una más ancha');
});

test('no devuelve ni un merge, así que el pedido no cuenta dos veces el mismo arreglo', (t) => {
  const desde = ventana();
  if (!desde) return t.skip('sin el clon de onia-platform: ambiental, no es un defecto');
  const merges = shasDeMerges(desde);
  if (merges === null || merges.length === 0) return t.skip('sin merges en la ventana: ver el caso de arriba');

  const varados = varadosDesde(desde);
  assert.notEqual(varados, null, 'git no contestó');
  const colados = varados.filter((c) => merges.includes(c.sha));
  assert.deepEqual(
    colados.map((c) => `${c.sha} ${c.asunto}`),
    [],
    'un merge se coló en el recuento: el pedido le muestra a Sergio Urcullo más arreglos de los que hay',
  );
});

// ── el instrumento no se dispara solo ───────────────────────────────────────
// Un gate .mjs que corre su medición en el top-level la dispara al ser
// IMPORTADO: medido el 2026-09-03 en demo_agendada_real.mjs, un import lanzó
// dos docker exec contra producción y un process.exit() que mató al proceso
// importador. El test corre en un proceso HIJO a propósito: en el propio
// proceso el módulo ya está cacheado y el caso pasa en falso.

test('importar el módulo NO mide contra producción ni sale del proceso', () => {
  const salida = execFileSync(
    process.execPath,
    ['--input-type=module', '-e', `await import(${JSON.stringify(join(AQUI, 'deploy-vivo.mjs'))}); console.log('VIVO');`],
    { encoding: 'utf8', timeout: 20000 },
  );
  assert.match(salida, /VIVO/);
});

// ── el deploy cambió de forma: ahora el sha viaja en la ETIQUETA de la imagen ─
// Medido el 2026-09-24 13:45 La Paz. El contenedor corría
// `onia-platform:release-7bcd0a83` —el HEAD exacto de origin/master, o sea AL
// DIA— y este módulo decía NO PUDE MEDIR: su BUILD_ID (FU8j_OHPyRH1XCCr6-0uY)
// no casaba contra NINGUN /opt/onia-platform/build-*/ porque el deploy dejó de
// swapear runtime-next y pasó a construir una imagen `release-<sha>`. Los
// build-<sha> de staging además se BORRAN a propósito (limpiar-builds-staging.sh
// se llevó 92 para liberar disco), así que la vía vieja no es que falle hoy:
// se apaga sola cada vez que alguien limpia.
//
// Un NO PUDE MEDIR permanente es el peor de los rojos: se lee como "el
// ambiental de siempre" y se saltea, y con él se saltea la única pregunta que
// este gate existe para contestar.

test('saca el sha del commit de la etiqueta release-<sha> de la imagen', () => {
  assert.equal(shaDeEtiqueta('onia-platform:release-7bcd0a83'), '7bcd0a83');
  assert.equal(shaDeEtiqueta('onia-platform:release-3606c46'), '3606c46');
});

test('una etiqueta que no nombra un commit no inventa uno', () => {
  for (const imagen of ['onia-platform:latest', 'onia-platform', 'onia-platform:release-', 'onia-platform:release-zzzz', null, undefined, 42]) {
    assert.equal(shaDeEtiqueta(imagen), null, `${imagen} no nombra ningún commit y salió un sha igual`);
  }
});

// La etiqueta manda porque es lo que el deploy ESCRIBE hoy; el BUILD_ID queda
// de respaldo para los swaps viejos que todavía puedan quedar en disco.
test('con la etiqueta viva, ya no hace falta que sobreviva el build en disco', () => {
  const r = shaVivoConciliado({ shaEtiqueta: '7bcd0a83', shaBuildId: null });
  assert.equal(r.sha, '7bcd0a83');
  assert.equal(r.motivo, null);
});

test('sin etiqueta, sigue valiendo el BUILD_ID casado contra el disco', () => {
  assert.equal(shaVivoConciliado({ shaEtiqueta: null, shaBuildId: '443e3e7' }).sha, '443e3e7');
});

// Los dos largos conviven: la etiqueta trae 8 caracteres y los build-<sha> de
// disco 7. Compararlos crudos haría discrepar a dos nombres del MISMO commit.
test('la etiqueta y el BUILD_ID del mismo commit no se pelean por el largo', () => {
  assert.equal(shaVivoConciliado({ shaEtiqueta: '7bcd0a83', shaBuildId: '7bcd0a8' }).sha, '7bcd0a83');
});

// Si las dos vías contestan cosas distintas, NO se elige la que nos gusta: no
// saber es un dato, y un veredicto inventado acá publica o retiene producción.
test('si la etiqueta y el BUILD_ID discrepan, no se elige ninguna', () => {
  const r = shaVivoConciliado({ shaEtiqueta: '7bcd0a83', shaBuildId: 'b5e23d4' });
  assert.equal(r.sha, null);
  assert.match(r.motivo, /7bcd0a83/);
  assert.match(r.motivo, /b5e23d4/);
});

test('sin ninguna de las dos vías, el motivo lo dice y no hay sha', () => {
  const r = shaVivoConciliado({ shaEtiqueta: null, shaBuildId: null });
  assert.equal(r.sha, null);
  assert.match(r.motivo, /etiqueta|BUILD_ID/);
});

// El motivo del NO PUDE MEDIR tiene que nombrar la causa REAL. El que había
// decía siempre "BUILD_ID vivo sin par en disco", que hoy es falso y manda a
// buscar el problema donde no está.
test('diagnosticar cuenta POR QUÉ no sabe qué corre, sin suponer la causa', () => {
  const d = diagnosticar({
    shaVivo: null,
    headSha: '7bcd0a83',
    varados: [],
    desciende: true,
    motivoSinSha: 'la imagen dice 7bcd0a83 y el BUILD_ID casa con b5e23d4: no elijo',
  });
  assert.equal(d.codigo, NO_PUDE_MEDIR);
  assert.match(d.motivo, /no elijo/);
});

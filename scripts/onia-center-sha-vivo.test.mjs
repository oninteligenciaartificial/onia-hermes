/**
 * onia-center tiene que poder decir QUE COMMIT sirve.
 *
 * NACE DEL 2026-09-26. `onia-center` recibe TODO lead de `onia.com.bo` por la red
 * Docker y ademas aloja el bot, y es el UNICO destino vivo cuyo sha no se puede
 * leer: corre `node:20-alpine` (imagen sin etiqueta de commit) y su
 * `/opt/onia-center/runtime-next` no tiene `.commit` ni `BUILD_ID` en la raiz.
 * Medido en vivo ese dia: `npm run deploy:sin-pedido` contesta «no puedo decir si
 * le falta publicar: no hay sha vivo que comparar», y por eso un build del 1-sep
 * atendio leads QUINCE dias marcandolos «demo pedida» sin que nadie lo viera. La
 * tarea t_34f5c0eb nombra esta traba con esas palabras: «onia-center no escribe
 * .commit ni BUILD_ID, asi que antes hay que darle con que verificarse».
 *
 * Darle con que verificarse cuesta una linea, pero tiene CUATRO formas de salir
 * mal en silencio, y cada caso de aca es una:
 *
 *  1. Que no lo estampe. Sin `.commit` el destino sigue siendo inmedible.
 *  2. Que lo estampe DESPUES de armar el tarball. El tarball es lo unico que
 *     viaja al VPS: un `.commit` escrito despues queda en el host que buildea y
 *     produccion nunca lo ve. Un archivo en el lugar correcto en el momento
 *     equivocado se lee igual que ningun archivo.
 *  3. Que estampe `unknown`. `REF` ya cae a `unknown` cuando no hay repo, y un
 *     `.commit` con basura adentro es PEOR que su ausencia: el instrumento pasa
 *     de «no pude medir» —honesto— a comparar contra un sha que no existe, o sea
 *     a fallar EN VERDE. El estampado va condicionado; si no hay sha, no hay
 *     archivo y el veredicto sigue siendo NO MEDIDO.
 *  4. Que estampe un NOMBRE DE RAMA. `DEPLOY_REF` lo escribe una persona o un
 *     Action, asi que puede llegar `main`; un `.commit` que dice `main` no se
 *     puede comparar con nada porque `main` se mueve.
 *
 * Y el ultimo caso mira al OTRO script: el estampado sirve mientras el swap
 * mueva el stage ENTERO a produccion. Hoy `swap-and-verify.sh` hace `mv`, asi
 * que el `.commit` viaja solo; el dia que alguien lo cambie por una copia
 * selectiva de subarboles, este gate avisa antes de que el sha se pierda otra vez.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { DESTINOS_SIN_CIRCUITO } from './deploy_sin_pedido.mjs';

const PRODUCTOR = 'scripts/deploy-onia-center.sh';
const SWAP = 'hermes-content/deploy/onia-center/swap-and-verify.sh';

/**
 * PURA: como estampa el sha un guion de despliegue, leido de su texto.
 *
 * Se contesta sobre el TEXTO y no ejecutando el guion a proposito: correrlo pide
 * el VPS, la llave SSH y un `pnpm build` de varios minutos, asi que un gate que
 * lo ejecutara no entraria en ninguna cadena y no lo correria nadie.
 */
export function estampaElSha(texto) {
  const lineas = texto.split('\n');
  const escribe = lineas.findIndex((l) => /^\s*[^#]*\.commit/.test(l) && />|tee/.test(l));
  const armaTarball = lineas.findIndex((l) => /^\s*[^#]*tar\s/.test(l) && /-c/.test(l) && /TARBALL|\.tgz/.test(l));
  if (escribe === -1) return { estampa: false, antesDelTarball: null, condicionado: null, resuelveASha: null };

  const linea = lineas[escribe];
  // El destino tiene que estar DENTRO del arbol que viaja ($STAGE), no al lado.
  const dentroDelStage = /\$\{?STAGE\}?\/\.commit/.test(linea);
  // Condicionado = la escritura no ocurre cuando el sha no se pudo resolver.
  const guarda = lineas.slice(Math.max(0, escribe - 3), escribe + 1).join('\n');
  const condicionado = /unknown|-n\s+"?\$/.test(guarda);
  // Resuelve a sha = la VARIABLE que se estampa se deriva de `rev-parse`.
  //
  // Se pregunta por la derivacion y no por un `rev-parse` cerca, que es como
  // estaba escrito primero: la asignacion vive ~20 lineas arriba (donde se leen
  // los parametros), asi que la ventana de proximidad daba rojo con el arreglo ya
  // puesto. Y agrandar la ventana lo habria vuelto laxo en la direccion contraria
  // —cualquier `rev-parse` del guion habria absuelto cualquier estampado—, que es
  // justo el falso verde que este gate existe para impedir.
  const nombradas = [...linea.split('>')[0].matchAll(/\$\{?([A-Za-z_][A-Za-z0-9_]*)\}?/g)].map((m) => m[1]);
  const resuelveASha = nombradas.some((v) => new RegExp(`^\\s*${v}=.*rev-parse`, 'm').test(texto));

  return {
    estampa: dentroDelStage,
    antesDelTarball: armaTarball === -1 ? null : escribe < armaTarball,
    condicionado,
    resuelveASha,
  };
}

/** PURA: `true` si el swap promueve el arbol ENTERO (y con el, el `.commit`). */
export function swapMueveTodo(texto) {
  return /mv\s+"?\$STAGE"?\s+"?\$ROOT\/runtime-next"?/.test(texto);
}

test('el productor estampa el sha DENTRO del arbol que viaja', () => {
  const r = estampaElSha(readFileSync(PRODUCTOR, 'utf8'));
  assert.equal(r.estampa, true, `${PRODUCTOR} no escribe $STAGE/.commit: onia-center queda sin sha vivo que comparar`);
});

test('lo estampa ANTES de armar el tarball, que es lo unico que viaja al VPS', () => {
  const r = estampaElSha(readFileSync(PRODUCTOR, 'utf8'));
  assert.equal(r.antesDelTarball, true, 'el .commit se escribe despues del tar: queda en el host que buildea, no en produccion');
});

test('no estampa un sha que no se pudo resolver (unknown seria peor que nada)', () => {
  const r = estampaElSha(readFileSync(PRODUCTOR, 'utf8'));
  assert.equal(r.condicionado, true, 'la escritura no esta condicionada: un .commit con "unknown" hace fallar al instrumento EN VERDE');
});

test('estampa un sha, no un nombre de rama (DEPLOY_REF puede llegar "main")', () => {
  const r = estampaElSha(readFileSync(PRODUCTOR, 'utf8'));
  assert.equal(r.resuelveASha, true, 'el ref no pasa por rev-parse: un .commit que dice "main" no se puede comparar con nada');
});

test('el swap promueve el arbol entero, asi que el .commit llega a produccion', () => {
  assert.equal(swapMueveTodo(readFileSync(SWAP, 'utf8')), true,
    `${SWAP} ya no mueve el stage completo: el .commit se perderia en el camino`);
});

// --- los reciprocos: cada uno es la forma de salir mal que el caso de arriba cuida ---

test('un guion que NO estampa sale en rojo', () => {
  assert.equal(estampaElSha('cp -a "$SA/." "$STAGE/"\ntar -C "$WORK" -czf "$TARBALL" runtime-next\n').estampa, false);
});

test('estampar AL LADO del stage no cuenta como estampar', () => {
  const r = estampaElSha('echo "$REF" > "$WORK/.commit"\ntar -C "$WORK" -czf "$TARBALL" runtime-next\n');
  assert.equal(r.estampa, false, 'un .commit fuera de $STAGE no entra al arbol que se promueve');
});

test('estampar DESPUES del tarball se detecta', () => {
  const r = estampaElSha('tar -C "$WORK" -czf "$TARBALL" runtime-next\necho "$REF" > "$STAGE/.commit"\n');
  assert.equal(r.estampa, true, 'el archivo esta en el lugar correcto...');
  assert.equal(r.antesDelTarball, false, '...pero en el momento equivocado, y eso es indistinguible de no estamparlo');
});

test('estampar sin guarda ni rev-parse se detecta', () => {
  const r = estampaElSha('echo "$REF" > "$STAGE/.commit"\ntar -C "$WORK" -czf "$TARBALL" runtime-next\n');
  assert.equal(r.condicionado, false, 'sin guarda, un REF=unknown se publica como si fuera un sha');
  assert.equal(r.resuelveASha, false, 'sin rev-parse, un DEPLOY_REF=main se estampa como si fuera un sha');
});

test('un swap que copia subarboles en vez de mover el stage sale en rojo', () => {
  assert.equal(swapMueveTodo('rsync -a "$STAGE/apps/" "$ROOT/runtime-next/apps/"\n'), false);
});

// --- y el remedio tiene que mandar por el camino que SI estampa -----------------------
//
// NACE DE UNA HORA DESPUES, el 2026-09-26. Los casos de arriba dejaron a `PRODUCTOR`
// estampando el sha y verde, y el estampado seguia sin poder llegar nunca a produccion:
// `onia-center` tiene DOS caminos de publicacion hermanos —`scripts/deploy-onia-center.sh`,
// que es el que corre el Action y el que estampa, y los dos guiones del VPS
// (`build-and-stage.sh` + `swap-and-verify.sh`), que no estampan— y el remedio que imprime
// `npm run deploy:sin-pedido` nombraba el SEGUNDO. O sea que el que obedeciera el remedio
// —o el `ok` de la tarea viva, que lo copia— publicaba por el camino inmedible, `.commit`
// no aparecia, y el instrumento volvia a contestar «no hay sha vivo que comparar». El
// arreglo se quedaba esperando a un camino que nadie iba a tomar.
//
// Es la trampa de siempre con una vuelta mas: no alcanza con arreglar el productor, hay que
// mirar CUAL de los hermanos ejecuta el que lee el remedio. Y el sujeto se deriva del
// registro y del disco, no se escribe aca: el dia que `build-and-stage.sh` tambien estampe,
// este gate se pone verde solo, sin que nadie lo edite.

/** PURA: los guiones (`*.sh`) que nombra una glosa de remedio, en orden de aparicion. */
export function guionesNombrados(glosa) {
  return [...String(glosa ?? '').matchAll(/[\w./-]+\.sh\b/g)].map((m) => m[0]);
}

/**
 * PURA: si la glosa de un remedio manda por algun guion que estampa el sha.
 *
 * `leer(nombre)` devuelve el texto del guion nombrado, o `null`/`undefined` si no lo
 * encuentra. Ese caso es NO MEDIDO (`veredicto: null`) y no «no estampa»: un remedio que
 * nombra un guion inexistente esta roto de otra manera, y aplanarlo a `false` mandaria a
 * reescribir la glosa cuando lo que falta es el archivo.
 */
export function remedioEstampa(glosa, leer) {
  const guiones = guionesNombrados(glosa);
  if (guiones.length === 0) return { guiones, estampan: [], veredicto: false };
  const estampan = [];
  for (const g of guiones) {
    const texto = leer(g);
    if (texto === null || texto === undefined) return { guiones, estampan: null, veredicto: null };
    if (estampaElSha(texto).estampa) estampan.push(g);
  }
  return { guiones, estampan, veredicto: estampan.length > 0 };
}

/** Donde vive un guion que el remedio cita por su nombre pelado. */
function leerGuion(nombre) {
  const candidatas = nombre.includes('/')
    ? [nombre]
    : [`scripts/${nombre}`, `hermes-content/deploy/onia-center/${nombre}`];
  const ruta = candidatas.find((p) => existsSync(p));
  return ruta ? readFileSync(ruta, 'utf8') : null;
}

test('el remedio de onia-center manda por un camino que estampa el sha', () => {
  const glosa = DESTINOS_SIN_CIRCUITO['onia-center'].runbook;
  const r = remedioEstampa(glosa, leerGuion);
  assert.notEqual(r.veredicto, null,
    `el remedio nombra un guion que no esta en el repo (${r.guiones.join(', ')}): NO MEDIDO`);
  assert.equal(r.veredicto, true,
    `el remedio de onia-center nombra ${r.guiones.join(' + ')}, y NINGUNO estampa el .commit: ` +
    `quien lo obedezca deja produccion inmedible otra vez y el estampado de ${PRODUCTOR} no llega nunca`);
});

test('un remedio que solo nombra los guiones del VPS sale en rojo', () => {
  const leer = (n) => ({ 'build-and-stage.sh': 'cp -a "$SA/." "$STAGE/"\n', 'swap-and-verify.sh': 'mv "$STAGE" "$ROOT/runtime-next"\n' })[n] ?? null;
  const r = remedioEstampa('RUNBOOK.md (build-and-stage.sh + swap-and-verify.sh)', leer);
  assert.equal(r.veredicto, false);
  assert.deepEqual(r.estampan, [], 'ninguno de los dos escribe .commit dentro del stage');
});

test('un remedio que nombra el productor sale en verde', () => {
  const leer = (n) => (n === 'scripts/deploy-onia-center.sh'
    ? 'SHA="$(git rev-parse --short "$REF")"\nif [ "$SHA" != unknown ]; then printf %s "$SHA" > "$STAGE/.commit"; fi\ntar -czf "$TARBALL" runtime-next\n'
    : 'mv "$STAGE" "$ROOT/runtime-next"\n');
  assert.equal(remedioEstampa('RUNBOOK.md (scripts/deploy-onia-center.sh + swap-and-verify.sh)', leer).veredicto, true);
});

test('un guion nombrado que no existe es NO MEDIDO, nunca "no estampa"', () => {
  const r = remedioEstampa('RUNBOOK.md (fantasma.sh)', () => null);
  assert.equal(r.veredicto, null, 'sin el texto no se puede afirmar que no estampa');
  assert.equal(r.estampan, null, 'y la lista arrastra el mismo tri-estado');
});

test('una glosa que no nombra ningun guion sale en rojo, no NO MEDIDO', () => {
  const r = remedioEstampa('hermes-content/deploy/onia-center/RUNBOOK.md', () => null);
  assert.equal(r.veredicto, false, 'un remedio sin guion no manda a ninguna parte: eso se sabe sin leer nada');
  assert.deepEqual(r.guiones, []);
});

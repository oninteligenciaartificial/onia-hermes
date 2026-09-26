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
import { readFileSync } from 'node:fs';

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

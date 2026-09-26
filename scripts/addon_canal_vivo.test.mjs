// Gate del add-on: el cliente que YA tiene el chatbot otorgado no puede ver
// "Contratar el chatbot".
//
// Por que existe: el 2026-09-05 la captura de /settings/chatbot con la cuenta QA
// mostraba, en la MISMA pantalla, "Conversaciones del mes 3 de 500" arriba (eso se
// pinta con la capacidad) y "Contratar el chatbot" DOS VECES abajo (eso se pintaba
// con la columna cruda organizations."whatsappAddon"). O sea: el dueño que paga el
// add-on de Bs 390 no encontraba el boton para conectar su WhatsApp.
//
// El arreglo del codigo ya existia (isWhatsAppAddonActive mira las dos fuentes) y
// aun asi produccion servia el defecto, porque el build vivo era ANTERIOR al fix.
// Esa es justo la confusion que este gate tiene que evitar: un defecto en produccion
// tiene DOS causas que se arreglan en lugares opuestos —el codigo esta mal, o
// produccion corre un build viejo— y sin distinguirlas la vuelta siguiente vuelve a
// "arreglar" un archivo que ya estaba bien.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { veredicto, sinCanal, medirShaVivo } from './addon_canal_vivo.mjs';

// ─── Quien queda sin canal ─────────────────────────────────────────────────
//
// Esta es la mitad que el 2026-09-05 daba ROJO FALSO durante horas, con el
// texto de un defecto real y sosteniendo DOS pedidos de deploy ya vencidos.
//
// El gate definia "afectada" como "tiene la capacidad activa y la columna vieja
// en false" — que era el sintoma correcto MIENTRAS el codigo leia la columna
// cruda. Desplegado el fix, esa consulta describe el estado SANO: son justo las
// orgs que el arreglo arreglo. Por construccion no podia volver a verde nunca,
// porque para eso el booleano viejo tendria que estar en `true`, que es la
// columna que el fix dejo de usar.
//
// La pregunta correcta es la que hace el producto (lib/plan-limits.ts):
//   isWhatsAppAddonActive = whatsappAddon || (entitlement active y no vencido)
// Una org queda sin canal cuando le OTORGARON el add-on y esa expresion da
// false. Medido mirando la pantalla de zz-qa-clinica-chatbot-9k651, una de las
// tres que el gate declaraba rotas: decia "Conectar mi WhatsApp".

const FUTURO = new Date('2030-01-01T00:00:00Z');
const AHORA = new Date('2026-09-05T18:00:00Z');

test('SANA: capacidad activa sin vencimiento y la columna vieja en false', () => {
  // El caso de las 3 orgs reales del 2026-09-05. El gate viejo las contaba a las
  // tres como rotas; el producto les da el canal.
  const filas = [
    { slug: 'onia-interna', whatsappAddon: false, status: 'active', validUntil: null },
    { slug: 'zz-qa-clinica-chatbot-9k651', whatsappAddon: false, status: 'active', validUntil: FUTURO },
    { slug: 'zz-qa-ferreteria-tornillo-ommbt', whatsappAddon: false, status: 'active', validUntil: null },
  ];
  assert.deepEqual(sinCanal(filas, AHORA), []);
});

test('SANA: la columna vieja en true alcanza sola, aunque no haya capacidad', () => {
  const filas = [{ slug: 'clinica-sergio', whatsappAddon: true, status: null, validUntil: null }];
  assert.deepEqual(sinCanal(filas, AHORA), []);
});

test('ROTA: se lo otorgaron y la capacidad VENCIO — el producto le niega el canal', () => {
  const filas = [{ slug: 'vencida', whatsappAddon: false, status: 'active', validUntil: new Date('2026-08-30T00:00:00Z') }];
  assert.deepEqual(sinCanal(filas, AHORA).map((o) => o.slug), ['vencida']);
});

test('ROTA: se lo otorgaron y la fila quedo en un status que no es active', () => {
  const filas = [{ slug: 'revocada', whatsappAddon: false, status: 'revoked', validUntil: null }];
  assert.deepEqual(sinCanal(filas, AHORA).map((o) => o.slug), ['revocada']);
});

test('BUILD VIEJO: las MISMAS orgs sanas vuelven a estar rotas si el build ignora la capacidad', () => {
  // La causa 'falta_desplegar' tiene que sobrevivir al arreglo. Si este caso
  // diera [], el gate habria perdido la mitad que motivo su existencia: el dia
  // que produccion vuelva a correr un build que lee la columna cruda, tres
  // clientes con el add-on pagado ven "Contratar el chatbot" y nadie se entera.
  const filas = [
    { slug: 'onia-interna', whatsappAddon: false, status: 'active', validUntil: null },
    { slug: 'zz-qa-clinica-chatbot-9k651', whatsappAddon: false, status: 'active', validUntil: FUTURO },
  ];
  assert.deepEqual(sinCanal(filas, AHORA, false).map((o) => o.slug), ['onia-interna', 'zz-qa-clinica-chatbot-9k651']);
  // ...y el que tiene la columna vieja en true sigue sano tambien en ese mundo.
  assert.deepEqual(sinCanal([{ slug: 'ok', whatsappAddon: true, status: null, validUntil: null }], AHORA, false), []);
});

test('FUERA DE ALCANCE: a quien nunca se lo otorgaron no le falta nada', () => {
  // Sin fila de entitlement y sin la columna: no compro el add-on. Contarla como
  // afectada seria el error simetrico — inventar 3 clientes rotos por vuelta.
  const filas = [{ slug: 'no-compro', whatsappAddon: false, status: null, validUntil: null }];
  assert.deepEqual(sinCanal(filas, AHORA), []);
});

test('ROJO: el build vivo lee la columna cruda y hay clientes con la capacidad otorgada', () => {
  const v = veredicto({
    afectadas: [{ slug: 'zz-qa-clinica-chatbot-9k651' }, { slug: 'onia-interna' }],
    buildLeeCapacidad: false,
    shaVivo: '443e3e7',
    shaQueArregla: '7599b5d',
  });
  assert.equal(v.exit, 1);
  assert.equal(v.causa, 'falta_desplegar');
  // El mensaje tiene que nombrar a cuantos afecta y QUE hay que desplegar:
  // sin eso el que lo lee vuelve a tocar el codigo, que ya esta bien.
  assert.match(v.mensaje, /2 /);
  assert.match(v.mensaje, /7599b5d/);
});

test('ROJO DISTINTO: el build vivo YA lee la capacidad y aun asi quedan afectadas = el codigo no alcanza', () => {
  const v = veredicto({
    afectadas: [{ slug: 'onia-interna' }],
    buildLeeCapacidad: true,
    shaVivo: 'abc1234',
    shaQueArregla: null,
  });
  assert.equal(v.exit, 1);
  assert.equal(v.causa, 'codigo');
  // Es la direccion que nadie mira: si dijera "falta desplegar" mandaria a
  // desplegar un build que YA tiene el arreglo, y el bug seguiria vivo.
  assert.doesNotMatch(v.mensaje, /desplegar/i);
});

test('VERDE: el build vivo lee la capacidad y nadie queda afuera', () => {
  const v = veredicto({
    afectadas: [],
    buildLeeCapacidad: true,
    shaVivo: 'abc1234',
    shaQueArregla: null,
  });
  assert.equal(v.exit, 0);
});

test('VERDE: el build lee la columna cruda pero ninguna org diverge (nadie lo sufre hoy)', () => {
  const v = veredicto({
    afectadas: [],
    buildLeeCapacidad: false,
    shaVivo: '443e3e7',
    shaQueArregla: '7599b5d',
  });
  assert.equal(v.exit, 0);
  // Verde con aviso, no verde mudo: el proximo cliente al que le otorguen la
  // capacidad lo sufre sin que nada se ponga rojo.
  assert.equal(v.aviso, true);
});

test('NO MEDIDO nunca es verde', () => {
  // Un gate que lee rutas del VPS deja de medir cuando el carril se muda al nodo
  // de casa. Si no pudo medir tiene que salir 2, jamas 0: un "al dia" falso es
  // exactamente como este defecto sobrevivio cuatro horas.
  for (const entrada of [
    { afectadas: null, buildLeeCapacidad: true },
    { afectadas: [], buildLeeCapacidad: null },
  ]) {
    const v = veredicto({ ...entrada, shaVivo: null, shaQueArregla: null });
    assert.equal(v.exit, 2);
    assert.equal(v.causa, 'no_medido');
  }
});

test('importar el modulo NO dispara la medicion contra produccion', async () => {
  // Un gate .mjs que corre su medicion en el top-level la dispara al ser
  // IMPORTADO: ya paso en demo_agendada_real.mjs, donde un import lanzo dos
  // docker exec contra produccion y un process.exit() que mato al importador.
  // Este test pasa por el solo hecho de que el import de arriba no haya matado
  // al proceso; lo que se afirma aca es que el modulo exporta la funcion pura.
  assert.equal(typeof veredicto, 'function');
});

// ─── De donde sale el build vivo ───────────────────────────────────────────
//
// Medido el 2026-09-26: este gate salia `exit 2` («no pude leer las orgs de la
// base o el codigo del build vivo») con la base contestando perfecto. La mitad
// muda era el sha: casaba el BUILD_ID solo contra `/opt/onia-platform/build-*`,
// que es STAGING, y desde que produccion se publica por imagen el arbol vivo
// queda bajo `releases/<sha>-<fecha>/` con el BUILD_ID en la RAIZ. Vivo ese dia:
// BUILD_ID 4FWMcecd4jRBGUVwStDQb, imagen onia-platform:release-492e7155, y el par
// en /opt/onia-platform/releases/492e7155-20260925/BUILD_ID.
//
// Este test mira el CABLEADO, no la tabla de layouts (esa tiene su propio
// self-check en scripts/lib/arbol-del-build-vivo.mjs): que el sha que usa ESTE
// gate salga del resolutor que conoce los dos layouts. Un gate que valida el
// modulo compartido no prueba que su consumidor lo cargue.

test('el sha vivo se casa tambien cuando el build esta publicado como release', async () => {
  const REL = '/opt/onia-platform/releases/492e7155-20260925';
  const correr = (_cmd, args) =>
    args?.[0] === 'exec' && args?.[2] === 'cat' ? { status: 0, stdout: '4FWMcecd4jRBGUVwStDQb\n' } : { status: 1, stdout: '' };
  const listar = (patron) =>
    String(patron).includes('/releases/') ? { dirs: [`${REL}/`], origen: 'remoto' } : { dirs: [], origen: 'remoto' };
  const leer = (ruta) => {
    if (ruta === `${REL}/BUILD_ID`) return { contenido: '4FWMcecd4jRBGUVwStDQb\n', origen: 'remoto' };
    if (ruta === `${REL}/SHA`) return { contenido: '492e715598236efdb3af0ad86c2a5077eb0ee285\n', origen: 'remoto' };
    return null;
  };
  assert.equal(await medirShaVivo({ correr, leer, listar }), '492e715598236efdb3af0ad86c2a5077eb0ee285');
});

test('sin par en disco el sha vivo es null, nunca uno adivinado', async () => {
  // El tri-estado es el punto: con un sha inventado este gate juzgaria el codigo
  // de un build que nadie corre, y su verde absolveria al que si corre.
  const correr = (_cmd, args) =>
    args?.[0] === 'exec' && args?.[2] === 'cat' ? { status: 0, stdout: 'ID-QUE-NO-ESTA\n' } : { status: 1, stdout: '' };
  const listar = () => ({ dirs: ['/opt/onia-platform/releases/aaaaaaa-20260924'], origen: 'remoto' });
  const leer = () => null;
  assert.equal(await medirShaVivo({ correr, leer, listar }), null);
});

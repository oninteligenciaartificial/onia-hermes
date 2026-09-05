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
import { veredicto } from './addon_canal_vivo.mjs';

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

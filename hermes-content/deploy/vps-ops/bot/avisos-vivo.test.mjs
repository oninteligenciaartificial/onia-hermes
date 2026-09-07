// Gate del AVISO a Sergio. Nace del 2026-09-05, midiendo el objetivo del carril:
//
//   `avisos demo/handoff 0` llevaba turnos en 0 y NADIE podia decir si eso significaba
//   "el circuito esta roto" o "no hubo ni un handoff real". Es un numero que no puede
//   ponerse rojo: decoracion. Medido ese dia, el circuito estaba ENTERO —flag `true` en
//   el proceso vivo, token y chat validos contra `getMe`/`getChat`, el motor emitiendo
//   `notify_sergio` y `construirAviso` devolviendo un texto accionable— y el 0 era, todo
//   ese tiempo, "no hubo eventos".
//
// La invariante que se prueba aca es esa distincion, no el conteo: un 0 con el circuito
// sano y un 0 con el circuito roto tienen que dar VEREDICTOS DISTINTOS. Si dan el mismo,
// el gate volvio a ser decoracion.
//
// La otra mitad del gate —que no se puede medir sin el VPS— es que NO mienta cuando no
// puede medir: sin `/opt/onia/bot` el veredicto es `no_medido`, nunca `ok`. Esa direccion
// es la cara: un gate que dice "al dia" desde una maquina que no ve produccion apaga al
// unico instrumento que miraba el problema.

import test from "node:test";
import assert from "node:assert/strict";
import { rmSync } from "node:fs";

import { diagnosticar, contarEventos, resolverBotDesplegado, BOT_DIR } from "./avisos-vivo.mjs";

const CIRCUITO_SANO = {
  flagEncendido: true,
  credencialesOk: true,
  motorEmiteNotify: true,
  textoAccionable: true,
};

test("cero avisos con el circuito SANO no es lo mismo que cero con el circuito ROTO", () => {
  const sinEventos = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos([]) });
  const roto = diagnosticar({
    circuito: { ...CIRCUITO_SANO, flagEncendido: false },
    eventos: contarEventos([]),
  });

  // Los dos cuentan 0 avisos. Ese era exactamente el problema.
  assert.equal(sinEventos.eventos.enviados, 0);
  assert.equal(roto.eventos.enviados, 0);

  // Y aun asi el veredicto tiene que separarlos.
  assert.notEqual(sinEventos.veredicto, roto.veredicto);
  assert.equal(sinEventos.veredicto, "ok");
  assert.equal(roto.veredicto, "roto");
});

test("el circuito se rompe por CUALQUIERA de sus eslabones, no solo por el flag", () => {
  for (const eslabon of ["flagEncendido", "credencialesOk", "motorEmiteNotify", "textoAccionable"]) {
    const d = diagnosticar({
      circuito: { ...CIRCUITO_SANO, [eslabon]: false },
      eventos: contarEventos([]),
    });
    assert.equal(d.veredicto, "roto", `${eslabon} en false tiene que dar rojo`);
    assert.ok(d.motivos.some((m) => m.includes(eslabon)), `el motivo tiene que nombrar ${eslabon}`);
  }
});

test("un aviso que sale FALLIDO es rojo aunque el circuito parezca sano", () => {
  // El modo de falla mas caro: el circuito responde bien a las preguntas de configuracion
  // y aun asi el envio real muere. Una persona esperando que Sergio le escriba, y nadie
  // se entera. Un `failed` en el log manda sobre cualquier chequeo de configuracion.
  const lineas = ["[aviso] failed conv=57 (handoff): fetch timeout"];
  const d = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos(lineas) });
  assert.equal(d.eventos.fallidos, 1);
  assert.equal(d.veredicto, "roto");
});

test("un aviso SALTEADO tambien es rojo: es una persona esperando que nadie atendio", () => {
  // Medido en produccion el 2026-09-04: `[aviso] skipped (cuota_agotada)` sobre handoffs
  // reales. El circuito estaba "bien configurado" y el aviso no salia igual.
  const lineas = ["[aviso] skipped conv=53 (handoff): aviso por Telegram apagado (ONIA_BOT_TG_AVISO)"];
  const d = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos(lineas) });
  assert.equal(d.eventos.salteados, 1);
  assert.equal(d.veredicto, "roto");
});

test("avisos enviados con el circuito sano es verde, y cuenta los eventos", () => {
  const lineas = [
    "[aviso] sent conv=57 (handoff): ok",
    "[aviso] sent conv=58 (demo_agendada): ok",
  ];
  const d = diagnosticar({ circuito: CIRCUITO_SANO, eventos: contarEventos(lineas) });
  assert.equal(d.eventos.enviados, 2);
  assert.equal(d.veredicto, "ok");
});

test("contarEventos ignora las lineas que no son del aviso", () => {
  // El log del webhook mezcla `[n8n]`, `[aviso]` y las lineas por mensaje. Contar de mas
  // aca inventa avisos que nunca existieron.
  const lineas = [
    "[onia-webhook] conv=49 msg=497 estado=200 rama=respondio",
    "[n8n] no se pudo disparar el evento",
    "[aviso] sent conv=57 (handoff): ok",
  ];
  assert.equal(contarEventos(lineas).enviados, 1);
  assert.equal(contarEventos(lineas).total, 1);
});

test("sin poder medir, el veredicto es no_medido — NUNCA ok", () => {
  // La direccion cara. Ya paso en este carril el 2026-09-05: un gate que leia una ruta
  // absoluta del VPS dejo de medir al mudarse el loop, y el objetivo siguio firmando
  // "meta cumplida" con el problema vivo.
  const d = diagnosticar({ circuito: null, eventos: contarEventos([]) });
  assert.equal(d.veredicto, "no_medido");
  assert.notEqual(d.veredicto, "ok");
});

// ---------------------------------------------------------------------------
// De donde sale el codigo que se mide — el escalon que faltaba
// ---------------------------------------------------------------------------
//
// Este gate importa el bot DESPLEGADO (no el del repo) a proposito: su unico valor es
// probar que las piezas que CORREN encajan entre si. Eso lo ataba a `/opt/onia/bot`, una
// ruta que existe en el VPS y NO en nodo-casa, adonde se mudo este carril el 2026-09-06.
// Desde entonces el tercer numero del objetivo salia `no_medido` en cada vuelta.
//
// Es la MISMA clase que el falso verde del simulador arreglado el 2026-09-07, un escalon
// mas arriba: alla faltaba UNA variable y alcanzaba con `ssh cat`; aca hay que traerse el
// artefacto entero. Apuntar al repo en vez de traerlo seria mas facil y ROMPERIA lo que el
// gate existe para probar.

const MOTOR = "bot-engine.mjs";

/**
 * Un `spawnSync` de mentira que ANOTA lo que le pidieron en vez de salir a la red.
 *
 * El estado se da POR COMANDO a proposito: uno solo para todos hace que el `tar` tape al
 * `ssh` y el caso pase por el motivo equivocado — asi quedo hueco el chequeo del `ssh` en
 * el primer intento de este escalon (visto por mutacion, no leyendo).
 */
function espia({ status = 0, stdout = "", porComando = {} } = {}) {
  const llamadas = [];
  const fn = (cmd, args) => {
    llamadas.push({ cmd, args: args || [] });
    return { status: cmd in porComando ? porComando[cmd] : status, stdout, stderr: "" };
  };
  return { fn, llamadas };
}

test("sin el bot en el disco local, se lo trae del VPS y SI se puede medir", () => {
  // La brecha que este escalon cierra. Antes de esto el resolvedor no existia y el gate
  // salia `no_medido` en nodo-casa con produccion sana del otro lado.
  const { fn, llamadas } = espia();
  const r = resolverBotDesplegado({
    existsSync: (p) => p !== BOT_DIR && String(p).endsWith(MOTOR),
    spawnSync: fn,
  });

  assert.ok(r, "con el VPS respondiendo, el resolvedor tiene que devolver un directorio");
  assert.equal(r.origen, "remoto");
  assert.notEqual(r.dir, BOT_DIR, "el remoto se copia a un temporal, no se finge la ruta del VPS");
  assert.ok(
    llamadas.some((l) => l.cmd === "ssh"),
    "tiene que haberle preguntado al VPS",
  );

  // El caso feliz devuelve un temporal REAL y el que limpia es quien lo pidio (`medir`), asi
  // que aca lo limpia el test: en WSL `/tmp` es un tmpfs que vive en RAM, y un directorio por
  // corrida se acumula para siempre. Los caminos que fallan ya se limpian solos.
  rmSync(r.dir, { recursive: true, force: true });
});

test("ni el disco ni el VPS: el resolvedor devuelve null y el veredicto sigue siendo no_medido", () => {
  // La direccion cara, y la que NO se puede perder al agregar el escalon remoto: un gate
  // que firma "al dia" sin ver produccion apaga al unico instrumento que miraba el problema.
  const { fn } = espia({ status: 255 });
  const r = resolverBotDesplegado({ existsSync: () => false, spawnSync: fn });

  assert.equal(r, null);
  assert.equal(diagnosticar({ circuito: null, eventos: contarEventos([]) }).veredicto, "no_medido");
});

test("un ssh CORTADO A LA MITAD no se acepta aunque el motor haya alcanzado a llegar", () => {
  // Este caso es el que sostiene el chequeo de estado del `ssh`, y sin el ese guardia era
  // HUECO: con el ssh caido el destino queda vacio, asi que la verificacion del artefacto ya
  // lo tapaba y quitar el chequeo no ponia nada en rojo (medido por mutacion el 2026-09-07).
  //
  // El caso real que solo ve el estado: la transferencia se corta en el medio. `tar` extrae
  // lo que alcanzo a bajar —puede incluir `bot-engine.mjs` y faltarle `config.mjs`— y el
  // gate importaria un arbol truncado, que falla como si el bot estuviera roto.
  // El `tar` sale 0 —extrajo lo que llego— y el motor esta en el destino: los dos guardias
  // hermanos dan por bueno el arbol, y el ESTADO DEL SSH es lo unico que queda para verlo.
  const { fn } = espia({ porComando: { ssh: 255, tar: 0 } });
  const r = resolverBotDesplegado({
    existsSync: (p) => p !== BOT_DIR && String(p).endsWith(MOTOR),
    spawnSync: fn,
  });

  assert.equal(r, null, "si el ssh no salio 0, lo que haya quedado en el destino no es confiable");
});

test("el ssh puede salir 0 y no traer nada: sin el motor en el destino, NO se da por traido", () => {
  // `ssh ... | tar -x` en una tuberia devuelve el estado del ULTIMO comando, asi que un ssh
  // caido puede terminar en exit 0 con el destino VACIO. Se verifica el ARTEFACTO, no el
  // codigo de salida: sin `bot-engine.mjs` no hay nada que medir.
  const { fn } = espia({ status: 0, stdout: "" });
  assert.equal(resolverBotDesplegado({ existsSync: () => false, spawnSync: fn }), null);
});

test("cuando el bot esta en el disco local, NO se sale a la red", () => {
  // Hermeticidad. El testigo se ANOTA y se afirma DESPUES: afirmar TIRANDO adentro del
  // doble no sirve, porque el resolvedor envuelve la llamada en try/catch para sobrevivir
  // a un `ssh` ausente y se comeria el assert — el caso pasaria en verde con el gate roto.
  // Es la misma trampa que se cazo por mutacion en `simulate.test.mjs` el 2026-09-07.
  const { fn, llamadas } = espia();
  const r = resolverBotDesplegado({ existsSync: () => true, spawnSync: fn });

  assert.equal(r.dir, BOT_DIR);
  assert.equal(r.origen, "local");
  assert.deepEqual(llamadas, [], "con el artefacto en el disco no hay por que preguntarle al VPS");
});

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

import { diagnosticar, contarEventos } from "./avisos-vivo.mjs";

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

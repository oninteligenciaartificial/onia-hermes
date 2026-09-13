// El bot le PROMETE al lead cuando lo atiende un humano, y OFRECE los horarios de demo.
// Los dos datos son la misma cosa —cuando Sergio Urcullo esta disponible— y hasta el
// 2026-09-13 salian de dos lugares distintos que se contradecian:
//
//   - los horarios OFRECIDOS: `scripts/loops/renovar-slots-bot.py`, dict `VENTANAS`, escrito
//     con la cita textual de Sergio Urcullo del 2026-09-02 (lun-vie 14-17 y 20-22, sab 9-15).
//   - el horario PROMETIDO: `config.mjs`, `businessHours`, tipeado a mano: "lun-vie, 9:00-18:00".
//
// El mismo mensaje del bot podia llevar los dos: ofrecia "martes 15, 14:00" (derivado, cierto)
// y prometia respuesta "lun-vie, 9:00-18:00" (tipeado, falso). Miente en las DOS direcciones:
// de mas a las 9:30 de un lunes (nadie va a contestar hasta las 14), y de menos el sabado a las
// 10 y el martes a las 20:30, que son horas de trabajo y el bot manda al lead a esperar al lunes.
//
// Por eso la fuente es UNA (`ventanas-de-atencion.mjs`) y el gate la cruza contra el .py, que es
// el lado con respaldo. Cruzarla contra `config.mjs` seria leer el mismo espejo dos veces.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { VENTANAS_ATENCION, diasDeAtencion, franjasDeAtencion, fraseDeAtencion, fueraDeAtencion } from "./ventanas-de-atencion.mjs";
import { DEFAULT_CONFIG, isOutsideBusinessHours } from "./config.mjs";
import { applyKnowledge } from "./knowledge.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const PY = resolve(AQUI, "../../../../scripts/loops/renovar-slots-bot.py");

/** Las ventanas que el .py usa para CALCULAR los horarios que el bot ofrece. */
function ventanasDelPy() {
  const fuente = readFileSync(PY, "utf8");
  const bloque = fuente.match(/^VENTANAS\s*=\s*\{([\s\S]*?)^\}/m);
  assert.ok(bloque, `no se pudo leer el dict VENTANAS de ${PY} — si se renombro, este gate mide un fosil`);
  const porDia = {};
  for (const linea of bloque[1].split("\n")) {
    const m = linea.match(/^\s*(\d+)\s*:\s*\[(.+?)\]\s*,/);
    if (!m) continue;
    const franjas = [...m[2].matchAll(/\((\d+)\s*,\s*(\d+)\)/g)].map((f) => [Number(f[1]), Number(f[2])]);
    // El .py numera lunes=0 (datetime.weekday); el motor usa domingo=0 (getUTCDay).
    porDia[(Number(m[1]) + 1) % 7] = franjas;
  }
  return porDia;
}

test("las ventanas del bot son las MISMAS que producen los horarios que ofrece", () => {
  const py = ventanasDelPy();
  assert.deepEqual(
    franjasDeAtencion(),
    py,
    "config.mjs y renovar-slots-bot.py declaran disponibilidades distintas: el bot ofreceria un horario y prometeria otro",
  );
});

test("el sabado es dia de atencion: el bot no manda a esperar al lunes a quien escribe un sabado", () => {
  assert.ok(diasDeAtencion().includes(6), "sabado 09:00-15:00 lo dio Sergio Urcullo el 2026-09-02");
  // Sabado 12-sep-2026 11:00 La Paz == 15:00Z.
  assert.equal(fueraDeAtencion("2026-09-12T15:00:00Z", DEFAULT_CONFIG), false);
  assert.equal(isOutsideBusinessHours("2026-09-12T15:00:00Z"), false, "el motor tiene que coincidir con la fuente");
});

test("la franja de la noche cuenta, y la manana temprano NO", () => {
  // Martes 15-sep 20:30 La Paz == 00:30Z del 16. Sergio Urcullo trabaja 20:00-22:00.
  assert.equal(isOutsideBusinessHours("2026-09-16T00:30:00Z"), false, "20:30 de un martes es horario de trabajo");
  // Lunes 14-sep 09:30 La Paz == 13:30Z. No empieza hasta las 14:00.
  assert.equal(isOutsideBusinessHours("2026-09-14T13:30:00Z"), true, "9:30 de un lunes NO es horario de trabajo");
  // Y el hueco del mediodia entre franjas: 18:00 La Paz del lunes == 22:00Z.
  assert.equal(isOutsideBusinessHours("2026-09-14T22:00:00Z"), true, "18:00 cae entre las dos franjas");
});

test("la frase que lee el lead se DERIVA de las ventanas, no se tipea", () => {
  const frase = fraseDeAtencion();
  assert.equal(DEFAULT_CONFIG.businessHours.frase, frase, "el guion tiene que decir lo que el motor hace");
  assert.ok(/s[áa]b/i.test(frase), `la frase calla el sabado: ${frase}`);
  assert.ok(!/9:00-18:00/.test(frase), `la frase vieja seguia viva: ${frase}`);
  for (const [dia, franjas] of Object.entries(franjasDeAtencion())) {
    for (const [desde] of franjas) {
      assert.ok(frase.includes(`${desde}:00`), `la frase no nombra la franja que abre a las ${desde} (dia ${dia})`);
    }
  }
});

test("un CLIENTE con horario corrido no hereda las franjas de Onia", () => {
  // knowledge.mjs deja que cada negocio declare su horario. Si el override solo trae el rango,
  // las franjas de Sergio Urcullo no pueden quedar decidiendo por el: un comercio que atiende
  // 8-20 de lunes a sabado no cierra a las 17 ni abre a las 20.
  const cfg = applyKnowledge(DEFAULT_CONFIG, {
    empresa: { horario: { dias: [1, 2, 3, 4, 5, 6], desde: 8, hasta: 20, frase: "lun-sab, 8:00-20:00" } },
  });
  assert.equal(cfg.businessHours.frase, "lun-sab, 8:00-20:00");
  // Sabado 11:00 La Paz: abierto para el cliente.
  assert.equal(isOutsideBusinessHours("2026-09-12T15:00:00Z", cfg), false);
  // Lunes 09:30 La Paz: abierto para el cliente (8-20), aunque Onia no atienda.
  assert.equal(isOutsideBusinessHours("2026-09-14T13:30:00Z", cfg), false, "las franjas de Onia no pueden cerrarle el negocio al cliente");
  // Lunes 20:30 La Paz: CERRADO para el cliente (cierra 20), aunque Onia si atienda.
  assert.equal(isOutsideBusinessHours("2026-09-16T00:30:00Z", cfg), true, "ni abrirselo");
});

test("VENTANAS_ATENCION no tiene domingo, y eso es a proposito", () => {
  assert.equal(Object.prototype.hasOwnProperty.call(VENTANAS_ATENCION, 0), false);
  assert.equal(diasDeAtencion().includes(0), false);
});

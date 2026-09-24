/**
 * Un lead que el bot ATENDIO y que ademas RECIBIO su follow-up, y aun asi se enfrio, es el lead
 * MAS perdido que hay — y es exactamente el unico que el conteo no puede ver.
 *
 * LA CAUSA, medida el 2026-09-24 contra produccion (`supabase-db`, `onia_center.bot_conversations`):
 * `sweepFollowUpVencidas` deriva `FILTROS_FOLLOWUP`, y ahi adentro viaja `followup_step=eq.0`.
 * Esa condicion contesta "¿a quien le PUEDO escribir?" (regla N7: UN follow-up por conversacion y
 * despues silencio). Reusada para contar, contesta otra pregunta — "¿a quien PERDI?" — y la
 * contesta al reves: en cuanto el M3 sale, `followup_step` pasa a 1 y la fila desaparece del
 * conteo. O sea que el barrido se olvida del lead JUSTO DESPUES de haberlo trabajado.
 *
 * La prueba en produccion, corriendo los dos filtros lado a lado sobre la misma tabla:
 *
 *   filtro actual (con followup_step=eq.0) ..... 9 filas, `chatwoot:990777` NO esta
 *   sin esa condicion .......................... 10 filas, `chatwoot:990777` SI esta
 *
 * `chatwoot:990777` (`esperando_horario`, `followup_step=1`, callada desde el 2026-08-18) es hoy
 * invisible para el unico instrumento que cuenta leads perdidos. Y `chatwoot:58` —el lead real de
 * WhatsApp que entro desde la web el 17-sep, al que el bot contesto bien y el barrido insistio— va
 * camino al mismo agujero: tiene `followup_step=1` y cruza el piso de 7 dias hoy mismo.
 *
 * POR QUE ESTE TEST CONTRADICE A OTRO QUE YA EXISTIA, y cual gana.
 * `followup-cuenta-los-colgados.test.mjs` exige que las DOS consultas deriven el predicado
 * COMPLETO. Su motivo es correcto y no se toca: una condicion agregada de un solo lado deja filas
 * invisibles para el envio Y para el conteo. Su conclusion era demasiado ancha: metia en el
 * predicado compartido una condicion que legitimamente NO se comparte. El reparto correcto es
 * BASE (lo que hace que la conversacion siga siendo del bot) + la condicion de elegibilidad, que
 * es solo del envio. El motivo del test viejo queda protegido por BASE.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { FILTROS_COLGADAS, FILTROS_FOLLOWUP, FILTROS_FOLLOWUP_BASE } from "./persistence.mjs";

const fuente = await readFile(new URL("./persistence.mjs", import.meta.url), "utf8");

/** El cuerpo de una funcion del store, para mirar QUE predicado arma. */
function cuerpo(nombre) {
  const desde = fuente.indexOf(`async function ${nombre}(`);
  assert.notEqual(desde, -1, `no encontre ${nombre} — ¿la renombraron?`);
  return fuente.slice(desde, fuente.indexOf("\n  }", desde));
}

test("contar los perdidos NO puede filtrar por followup_step: el M3 ya salido no rescata a nadie", () => {
  // El corazon del bug. `followup_step` mide cuantas veces le escribimos, no cuanto lo perdimos.
  for (const condicion of FILTROS_COLGADAS) {
    assert.ok(
      !String(condicion).includes("followup_step"),
      `FILTROS_COLGADAS no puede condicionar followup_step, y trae "${condicion}": ` +
        "una conversacion que YA recibio su follow-up y aun asi se enfrio es MAS perdida, no menos",
    );
  }
  assert.ok(
    !cuerpo("sweepFollowUpVencidas").includes("FILTROS_FOLLOWUP,"),
    "sweepFollowUpVencidas deriva el filtro del ENVIO: hereda followup_step=eq.0 y se olvida del " +
      "lead justo despues de trabajarlo (medido: chatwoot:990777 invisible en produccion)",
  );
});

test("la elegibilidad para ESCRIBIR sigue intacta: el envio no puede perder followup_step=eq.0", () => {
  // La otra mitad, y la cara cara: si al separar los predicados el envio pierde esta condicion,
  // el barrido le vuelve a escribir a gente que ya recibio su M3. La regla N7 se rompe hacia el
  // spam, que es peor que el silencio — y ningun test de arriba lo notaria.
  assert.ok(
    FILTROS_FOLLOWUP.includes("followup_step=eq.0"),
    "el filtro del ENVIO tiene que seguir exigiendo followup_step=eq.0 (regla N7: UN follow-up)",
  );
  assert.ok(
    !FILTROS_FOLLOWUP_BASE.some((c) => String(c).includes("followup_step")),
    "followup_step es elegibilidad de ENVIO: no puede vivir en la BASE compartida",
  );
});

test("las dos consultas siguen partiendo la misma poblacion: la BASE no se tipea dos veces", () => {
  // El motivo del test viejo, preservado sobre el reparto nuevo. Lo que se comparte se DERIVA;
  // lo unico que puede diferir es la elegibilidad para escribir y la ventana de tiempo.
  for (const nombre of ["sweepFollowUpCandidates", "sweepFollowUpVencidas"]) {
    const src = cuerpo(nombre);
    assert.match(src, /FILTROS_(FOLLOWUP|COLGADAS)\b/, `${nombre} tiene que DERIVAR un predicado compartido`);
    assert.match(src, /pisoFollowUp\(/, `${nombre} tiene que derivar el piso, no recalcularlo`);
    for (const tipeado of FILTROS_FOLLOWUP_BASE) {
      assert.ok(
        !src.includes(`"${tipeado}"`),
        `${nombre} tipea "${tipeado}" a mano en vez de tomarlo de la BASE compartida`,
      );
    }
  }
});

test("las dos listas se derivan de la BASE, no se re-escriben", () => {
  // Sin esto, BASE puede quedar como decoracion: dos listas literales que casualmente coinciden
  // hoy y divergen en el primer cambio — que es el bug que este archivo existe para cerrar.
  for (const condicion of FILTROS_FOLLOWUP_BASE) {
    assert.ok(FILTROS_FOLLOWUP.includes(condicion), `el filtro de ENVIO perdio la condicion base "${condicion}"`);
    assert.ok(FILTROS_COLGADAS.includes(condicion), `el filtro de CONTEO perdio la condicion base "${condicion}"`);
  }
  assert.deepEqual(
    FILTROS_COLGADAS.filter((c) => !FILTROS_FOLLOWUP_BASE.includes(c)),
    [],
    "el conteo es la BASE y nada mas: toda condicion extra ahi vuelve a esconder leads perdidos",
  );
});

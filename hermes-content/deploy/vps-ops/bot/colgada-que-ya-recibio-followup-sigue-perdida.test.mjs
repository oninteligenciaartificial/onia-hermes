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
  // OJO: aca decia `deepEqual(extras, [])` — "el conteo es la BASE y nada mas". Su MOTIVO es
  // correcto y sigue vivo (una condicion propia del conteo vuelve a esconder leads perdidos); su
  // conclusion era ancha de mas, y el 2026-09-24 prohibia el arreglo que destapa `handoff_humano`.
  // Lo que hace dano no es que el conteo tenga condiciones propias: es que las suyas ANGOSTEN la
  // poblacion. Ensanchar etapas es justamente como se cuenta a un lead que hoy no ve nadie.
  // El motivo queda protegido, con su medicion, en "el conteo nunca es mas ANGOSTO que el envio".
  assert.deepEqual(
    FILTROS_COLGADAS.filter((c) => !FILTROS_FOLLOWUP_BASE.includes(c) && !String(c).startsWith("bot_stage=in.")),
    [],
    "el conteo agrego una condicion que no es ni la BASE ni un ensanche de etapas: eso esconde leads",
  );
});

/**
 * LA MISMA CLASE, UN NIVEL MAS ARRIBA — medido el 2026-09-24 en produccion, despues de arreglar
 * `followup_step`. El reparto de arriba dejo intacta OTRA condicion de envio viviendo en la BASE:
 *
 *   bot_stage=in.(esperando_calificacion,esperando_horario)
 *
 * Esa lista contesta "¿a que etapas les puedo MANDAR un M3?" — y es correcta para eso: a alguien
 * derivado a un humano no se le escribe, porque el bot se convierte en un loro que tapa a Sergio
 * Urcullo cuando entre. Reusada para CONTAR, contesta otra vez la pregunta equivocada y esconde
 * la pila mas grande de leads abandonados que hay.
 *
 * La medicion, sobre `onia_center.bot_conversations` (supabase-db):
 *
 *   bot_stage=handoff_humano, human_took_over=false ..... 12 filas, de 14 a 37 dias calladas
 *   de esas, vistas por algun barrido ................... 0
 *
 * `handoff_humano` no lo barre NADIE (`followup` mira las dos etapas de arriba, `insistencia`
 * mira `nuevo`, `postdemo` mira `demo_agendada`), y el aviso `handoff_sin_humano` que se agrego
 * el mismo dia solo dispara cuando la persona VUELVE a escribir. Estas doce dejaron de escribir
 * hace semanas: son justo las que nunca van a disparar nada. El aviso de "se enfrio" nace ciego
 * precisamente donde mas leads hay.
 *
 * QUE SE COMPARTE Y QUE NO, despues de este arreglo. La BASE queda con la PERTENENCIA pura (no lo
 * tomo un humano, no pidio que lo dejen en paz); la etapa pasa a ser de cada lado, porque "a quien
 * le escribo" y "a quien perdi" no son la misma poblacion. Y el conteo no puede ser mas ANGOSTO
 * que el envio: eso volveria a dejar filas invisibles para los dos, que es el motivo original.
 */

/** Las etapas que declara un predicado, sacadas de su condicion `bot_stage=in.(...)`. */
function etapasDe(filtros, comoSeLlama) {
  const condicion = filtros.find((c) => String(c).startsWith("bot_stage=in."));
  assert.ok(condicion, `${comoSeLlama} no declara etapas con bot_stage=in.(...)`);
  return String(condicion)
    .replace(/^bot_stage=in\.\(/, "")
    .replace(/\)$/, "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

test("contar los perdidos NO puede heredar las etapas a las que se le PUEDE escribir", () => {
  // El corazon del bug: 12 conversaciones en handoff_humano que nadie tomo y ningun barrido ve.
  assert.ok(
    etapasDe(FILTROS_COLGADAS, "FILTROS_COLGADAS").includes("handoff_humano"),
    "el conteo de perdidos ignora handoff_humano: medido en produccion, 12 conversaciones que " +
      "nadie tomo, de 14 a 37 dias calladas, invisibles para el unico instrumento que cuenta leads perdidos",
  );
  // La otra mitad, y la cara: si el ENVIO gana esa etapa, el bot le escribe a alguien que pidio
  // una persona. Eso es el loro que tapa a Sergio Urcullo cuando entra, peor que el silencio.
  assert.ok(
    !etapasDe(FILTROS_FOLLOWUP, "FILTROS_FOLLOWUP").includes("handoff_humano"),
    "el filtro del ENVIO no puede incluir handoff_humano: a quien pidio una persona no se le " +
      "manda un follow-up automatico",
  );
  // La etapa es de cada lado, asi que no puede seguir tipeada en la BASE compartida.
  assert.ok(
    !FILTROS_FOLLOWUP_BASE.some((c) => String(c).startsWith("bot_stage=in.")),
    "la etapa es elegibilidad de cada pregunta: no puede vivir en la BASE compartida",
  );
});

test("el conteo nunca es mas ANGOSTO que el envio: ahi es donde se pierden las filas", () => {
  // El motivo del `deepEqual` viejo, preservado sobre el reparto nuevo. Lo que hacia dano no era
  // que el conteo tuviera condiciones propias: era que las suyas ESCONDIERAN gente. Ensanchar es
  // legitimo; angostar es el bug que este archivo existe para cerrar.
  const envio = etapasDe(FILTROS_FOLLOWUP, "FILTROS_FOLLOWUP");
  const conteo = etapasDe(FILTROS_COLGADAS, "FILTROS_COLGADAS");
  for (const etapa of envio) {
    assert.ok(conteo.includes(etapa), `el conteo perdio la etapa "${etapa}" que el envio si trabaja`);
  }
  for (const condicion of FILTROS_COLGADAS) {
    if (String(condicion).startsWith("bot_stage=in.")) continue;
    assert.ok(
      FILTROS_FOLLOWUP_BASE.includes(condicion),
      `el conteo agrego "${condicion}" fuera de la BASE: toda condicion que no ensanche etapas ` +
        "vuelve a esconder leads perdidos",
    );
  }
});

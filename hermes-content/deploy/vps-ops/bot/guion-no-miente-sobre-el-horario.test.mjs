// ONIA — un guion del simulador no puede MENTIR sobre si corre dentro o fuera de atencion.
//
// POR QUE EXISTE ESTE ARCHIVO. Medido el 2026-09-17: los ONCE guiones de `simulate.mjs`
// arrancaban en `2026-07-27T14:05:00Z` con el comentario "lunes 10:05 en La Paz: dentro de
// horario". Era cierto el dia que se escribio, cuando `config.mjs` tipeaba `businessHours` como
// "lun-vie, 9:00-18:00". El 2026-09-13 esa promesa se unifico con los horarios REALES de demo de
// Sergio Urcullo (lun-vie 14:00-17:00 y 20:00-22:00, sab 9:00-15:00, `ventanas-de-atencion.mjs`)
// y las 10:05 quedaron afuera — asi que los once guiones se pasaron a la rama de FUERA a la vez,
// sin que nada se pusiera rojo:
//
//   - la rama de DENTRO se quedo sin un solo guion que la recorriera, y es la que ve un lead que
//     escribe mientras Sergio Urcullo esta sentado (que es cuando se cierra una demo);
//   - el guion `3-siat` existe para probar la coletilla de fuera de horario y quedo igual a sus
//     diez hermanos, o sea dejo de probar nada;
//   - y el carril perdio la capacidad de distinguir el artefacto de su instrumento del BUG de
//     verdad (que el bot avise "fuera de horario" estando dentro). Una vuelta entera se gasto
//     anotando el sintoma sin poder atribuirlo.
//
// La cura es que el instante se DERIVE del lado declarado (`instanteDeAtencion`) en vez de
// tipearse. Este gate ata las dos mitades que esa cura no alcanza sola: que las dos ramas sigan
// teniendo guion, y que nadie vuelva a clavar un ISO — la FORMA que envejece, no el valor viejo.

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { SCRIPTS } from "./simulate.mjs";
import { VENTANAS_ATENCION, fueraDeAtencion, instanteDeAtencion } from "./ventanas-de-atencion.mjs";

const FUENTE_SIMULADOR = fileURLToPath(new URL("./simulate.mjs", import.meta.url));

test("el instante derivado cae del lado que declara — cruzado contra el predicado del motor", () => {
  assert.equal(fueraDeAtencion(instanteDeAtencion("dentro")), false);
  assert.equal(fueraDeAtencion(instanteDeAtencion("fuera")), true);
});

test("mover las ventanas mueve el instante: es derivado, no una fecha con suerte", () => {
  // Las mismas franjas corridas a la madrugada. Si el instante estuviera tipeado, "dentro"
  // seguiria cayendo a las 15:30 y este caso se pondria rojo.
  const madrugada = { 1: [[2, 5]], 2: [[2, 5]] };
  const dentro = instanteDeAtencion("dentro", { ventanas: madrugada });
  assert.equal(fueraDeAtencion(dentro, { businessHours: { franjas: madrugada, tzOffsetMinutes: -240 } }), false);
  assert.notEqual(dentro, instanteDeAtencion("dentro"), "con otras ventanas tiene que dar otro instante");
});

test("un lado que no existe TIRA, en vez de devolver un instante cualquiera", () => {
  assert.throws(() => instanteDeAtencion(undefined), /dentro.*fuera/s);
  assert.throws(() => instanteDeAtencion("mediodia"), /dentro.*fuera/s);
});

test("las DOS ramas tienen guion: la de dentro y la de fuera de atencion", () => {
  const lados = Object.entries(SCRIPTS).map(([nombre, guion]) => [nombre, guion.horario]);
  const sinDeclarar = lados.filter(([, horario]) => horario !== "dentro" && horario !== "fuera");
  assert.deepEqual(sinDeclarar, [], "todo guion declara en que lado corre");

  for (const lado of ["dentro", "fuera"]) {
    const conEseLado = lados.filter(([, horario]) => horario === lado).map(([nombre]) => nombre);
    assert.ok(
      conEseLado.length > 0,
      `ningun guion corre ${lado} de atencion: esa rama del bot no la mira nadie (lados: ${JSON.stringify(lados)})`,
    );
  }
});

test("el instante de cada guion es el que corresponde a su lado declarado", () => {
  for (const [nombre, guion] of Object.entries(SCRIPTS)) {
    const iso = instanteDeAtencion(guion.horario);
    assert.equal(
      fueraDeAtencion(iso),
      guion.horario === "fuera",
      `el guion ${nombre} dice correr ${guion.horario} y su instante ${iso} cae del otro lado`,
    );
  }
});

test("ningun guion vuelve a CLAVAR un reloj: los ISO tipeados son la forma que envejece", () => {
  // Se mide sobre el codigo con los comentarios en blanco: un ISO citado al explicar POR QUE no
  // se tipean relojes no es un reloj tipeado, y borrar el registro es como esta familia falla.
  const fuente = readFileSync(FUENTE_SIMULADOR, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, (bloque) => bloque.replace(/[^\n]/g, " "))
    .replace(/(^|[^:])\/\/[^\n]*/g, (linea, antes) => antes + " ".repeat(linea.length - antes.length));

  const clavados = fuente
    .split("\n")
    .map((linea, i) => [i + 1, linea])
    .filter(([, linea]) => /\b20\d{2}-\d{2}-\d{2}T\d{2}:\d{2}/.test(linea));

  assert.deepEqual(
    clavados,
    [],
    `hay un instante tipeado en simulate.mjs: se deriva con instanteDeAtencion("dentro"|"fuera").\n` +
      clavados.map(([n, l]) => `  ${FUENTE_SIMULADOR}:${n}: ${l.trim()}`).join("\n"),
  );
});

test("las ventanas que usa el gate son las del motor, no una copia", () => {
  // Caso ancla anti-tautologia: si alguien copiara las franjas dentro del test, este gate dejaria
  // de ver un cambio en la fuente. Se afirma contra el literal que Sergio Urcullo dijo.
  assert.deepEqual(VENTANAS_ATENCION[1].map((f) => [...f]), [[14, 17], [20, 22]], "lun-vie 14-17 y 20-22");
  assert.deepEqual(VENTANAS_ATENCION[6].map((f) => [...f]), [[9, 15]], "sabado 9-15");
  assert.equal(VENTANAS_ATENCION[0], undefined, "domingo no trabaja, y es lo que hace util al lado 'fuera'");
});

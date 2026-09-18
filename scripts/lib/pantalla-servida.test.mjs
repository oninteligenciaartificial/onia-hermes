import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { veredictoDePantalla } from "./pantalla-servida.mjs";

const INSTRUMENTO = fileURLToPath(new URL("../mirar_bandeja_dueno.mjs", import.meta.url));

test("CASO ANCLA — el 404 real que el instrumento firmó como sano el 2026-09-17", () => {
  // Medido pidiendo /dev/shell con sesión real: la captura era "ERROR 404 · Página
  // no encontrada" de cuerpo entero y el instrumento imprimió "respuestas >=400:
  // ninguna". Si este caso pasa a verde, el instrumento volvió a estar ciego.
  const v = veredictoDePantalla({
    status: 404,
    textoVisible: "onia\nERROR 404\nPágina no encontrada\nLa dirección que abriste no existe o fue movida.",
  });
  assert.equal(v.sirve, false);
  assert.match(v.motivo, /404/);
});

test("un error SIN texto reconocible se caza igual, por el status", () => {
  // Este caso existe porque la mutación lo pidió: con el caso ancla solo, apagar la
  // rama del status dejaba los 9 tests en VERDE — lo cazaba la rama del TEXTO. Un
  // 500 de Next, un 403 del middleware o una 404 de proxy no dicen "página no
  // encontrada" en ningún idioma, y son justo los que el status existe para ver.
  for (const status of [403, 404, 500, 502]) {
    const v = veredictoDePantalla({ status, textoVisible: "" });
    assert.equal(v.sirve, false, `HTTP ${status} no es una pantalla servida`);
    assert.match(v.motivo, new RegExp(String(status)));
  }
  // Y con cuerpo de apariencia normal: el status manda igual.
  assert.equal(
    veredictoDePantalla({ status: 500, textoVisible: "Bandeja\nConversaciones" }).sirve,
    false
  );
});

test("soft 404: el status salió 200 y la pantalla igual es una página de error", () => {
  // notFound() después de que empezó el stream: el status ya viajó como 200.
  // Preguntar sólo por el status deja pasar justo este caso.
  const v = veredictoDePantalla({
    status: 200,
    textoVisible: "onia\nERROR 404\nPágina no encontrada",
  });
  assert.equal(v.sirve, false, "un 200 con cara de 404 no es una pantalla servida");
  assert.match(v.motivo, /página de error/i);
});

test("la 404 por defecto de Next, en inglés, también cuenta", () => {
  const v = veredictoDePantalla({
    status: 200,
    textoVisible: "404: This page could not be found.",
  });
  assert.equal(v.sirve, false);
});

test("una pantalla sana pasa", () => {
  const v = veredictoDePantalla({
    status: 200,
    textoVisible: "Bandeja\nConversaciones\nmariohassen\nHola, quiero información",
  });
  assert.equal(v.sirve, true);
  assert.equal(v.motivo, "HTTP 200");
});

test("un 3xx ya seguido no es un error", () => {
  assert.equal(veredictoDePantalla({ status: 200, textoVisible: "Panel" }).sirve, true);
  assert.equal(veredictoDePantalla({ status: 304, textoVisible: "Panel" }).sirve, true);
});

test("status ausente es NO MEDIDO, nunca 200", () => {
  // Playwright devuelve null en navegaciones same-document. Aplanarlo a 200 es la
  // falla que este módulo existe para impedir: el llamador saldría 0 sin haber medido.
  for (const status of [null, undefined]) {
    const v = veredictoDePantalla({ status });
    assert.equal(v.sirve, null, `status ${status} tiene que salir NO MEDIDO`);
    assert.match(v.motivo, /no se pudo leer/i);
  }
  assert.equal(veredictoDePantalla({}).sirve, null);
  assert.equal(veredictoDePantalla().sirve, null);
});

test("un status ilegible no se adivina", () => {
  assert.equal(veredictoDePantalla({ status: "200" }).sirve, null);
  assert.equal(veredictoDePantalla({ status: NaN }).sirve, null);
});

test("la palabra suelta 'error' en una pantalla sana no la condena", () => {
  // La marca se busca como FRASE: un panel que lista "Errores de sincronización: 0"
  // es una pantalla servida, no una página de error.
  const v = veredictoDePantalla({
    status: 200,
    textoVisible: "Panel de estado\nErrores de sincronización: 0\n404 pacientes atendidos",
  });
  assert.equal(v.sirve, true);
});

test("el instrumento canónico CONSULTA el veredicto y corta antes de la captura", () => {
  // Sin esto el módulo queda escrito y nadie lo llama: el defecto vuelve entero.
  const fuente = readFileSync(INSTRUMENTO, "utf8");
  assert.ok(
    /import \{ veredictoDePantalla \}/.test(fuente),
    "mirar_bandeja_dueno.mjs tiene que importar el veredicto"
  );
  const usa = fuente.indexOf("veredictoDePantalla({");
  assert.ok(usa > 0, "tiene que LLAMARLO, no sólo importarlo");

  // La guarda va ANTES de guardar la captura, o se saca igual y se lee como prueba.
  const corta = fuente.indexOf("veredicto.sirve !== true");
  const captura = fuente.indexOf("screenshot(");
  assert.ok(corta > usa, "tiene que cortar por el resultado, no sólo imprimirlo");
  assert.ok(captura > corta, "la guarda tiene que estar ANTES de la captura");
});

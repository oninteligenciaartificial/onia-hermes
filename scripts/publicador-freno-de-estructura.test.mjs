#!/usr/bin/env node
// El freno del publicador sobre la SUPERFICIE DE VENTA.
//
// POR QUE EXISTE. Medido el 2026-09-25 (tarea t_8b40a8d4): el commit `a847d9aa`
// (11-sep) reordeno la PORTADA de onia.com.bo —descarto el hero, retiro la
// seccion de hechos y subio el chatbot a la primera posicion— y salio solo por
// el cron de `publicar-solo.sh`, 14 dias vivo, sin que Sergio Urcullo la viera.
// La cola lo tenia escrito como "FALTA su OK mirandola". CLAUDE.md lo dice desde
// el 2026-08-20, cuando la landing v2 se publico igual y la rechazo entera al
// verla: «Una superficie viva no se reemplaza sin que Sergio VEA la pieza
// terminada… construir y publicar son dos permisos distintos».
//
// La unica guarda del publicador eran las fuentes de PRECIO, y una portada
// rediseñada no toca ninguna.
//
// QUE PREGUNTA EL FRENO, Y POR QUE ESA. El guion ya eligio una vez la forma de
// esta pregunta: para los precios no pregunta QUE ARCHIVO se toco sino SI ALGUN
// NUMERO CAMBIO, porque detener de mas gasta la unica firma que importa y una
// firma que se gasta en falsos se vuelve automatica. El analogo aca no es "se
// toco el sitio" —eso frenaria hasta un typo— sino: **¿cambio la ESTRUCTURA de
// la pagina?** Que secciones hay y en que orden. Eso es lo que la regla llama
// "rediseño": es ciego a un typo, a una clase CSS y a un refactor interno, y ve
// exactamente lo que paso el 11-sep.
//
// La estructura se lee de las anclas que nombran cada seccion (`labelledBy=` de
// los `<Block>` e `id=` de los encabezados), en su orden de aparicion.
//
// Falla CERRADO como el resto del guion: si la secuencia no se puede leer, el
// destino se detiene.

import { execFileSync } from "node:child_process";
import { strict as assert } from "node:assert";

const REPO = process.env.ONIA_LOOPS_REPO || "/root/loops/onia-hermes";
const GUION = `${REPO}/scripts/loops/extras/publicar-solo.sh`;
const PORTADA = "web-factory/apps/onia-platform/src/app/(sitio)/page.tsx";

// El caso medido: el commit que reordeno la portada sin firma.
const REDISENO = "a847d9aa";

function bash(script) {
  return execFileSync("/bin/bash", ["-c", script], {
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
  });
}

// Llama a una funcion del guion sin ejecutar su cuerpo principal: lo carga con
// ONIA_PUBLICAR_SOLO_SOURCE=1, que corta antes de medir destinos.
function llamar(fn, args) {
  const q = args.map((a) => `'${String(a).replace(/'/g, "'\\''")}'`).join(" ");
  try {
    return {
      salida: bash(
        `ONIA_PUBLICAR_SOLO_SOURCE=1 source ${JSON.stringify(GUION)} >/dev/null 2>&1; ${fn} ${q}`,
      ),
      code: 0,
    };
  } catch (e) {
    return { salida: e.stdout || "", code: e.status };
  }
}

const casos = [];
const caso = (nombre, fn) => casos.push([nombre, fn]);

caso("el rediseño de la portada del 11-sep DETIENE el destino", () => {
  const r = llamar("estructura_que_cambia", [REPO, PORTADA, REDISENO]);
  assert.equal(
    r.code,
    1,
    "a847d9aa retiro una seccion y subio el chatbot a la primera posicion: " +
      "tiene que detener la landing, es el caso que este freno existe para ver",
  );
  assert.match(
    r.salida,
    /v4-hace|chatbot/,
    "el aviso tiene que NOMBRAR que seccion se movio, para que Sergio Urcullo " +
      `decida de un vistazo sin abrir el diff. Salida: ${JSON.stringify(r.salida)}`,
  );
});

caso("un commit que no toca la portada NO detiene", () => {
  // El padre del rediseño, mirado sobre la portada: no la cambio el.
  const previo = bash(
    `git -C ${JSON.stringify(REPO)} rev-parse ${REDISENO}^^ 2>/dev/null || true`,
  ).trim();
  if (!previo) return; // historia recortada: no inventamos un sujeto
  const r = llamar("estructura_que_cambia", [REPO, PORTADA, previo]);
  assert.equal(
    r.code,
    0,
    "un commit que no altera la secuencia de secciones sale solo: detener de " +
      "mas gasta la firma de Sergio Urcullo, que es la unica que importa",
  );
});

caso("un cambio de COPY sin tocar la estructura NO detiene", () => {
  // Se construye el caso: misma secuencia de anclas, texto distinto.
  const r = bash(`
    set -e
    T=$(mktemp -d); cd "$T"; git init -q .; git config user.email t@t; git config user.name t
    mkdir -p 'web-factory/apps/onia-platform/src/app/(sitio)'
    F='${PORTADA}'
    printf '%s\\n' '<Block labelledBy="uno"><h2 id="uno">Hola</h2></Block>' > "$F"
    git add -A >/dev/null; git commit -qm base
    printf '%s\\n' '<Block labelledBy="uno"><h2 id="uno">Holaa</h2></Block>' > "$F"
    git add -A >/dev/null; git commit -qm typo
    echo "$T $(git rev-parse HEAD)"
  `).trim();
  const [dir, sha] = r.split(" ");
  const out = llamar("estructura_que_cambia", [dir, PORTADA, sha]);
  assert.equal(
    out.code,
    0,
    "corregir un typo no es un rediseño: la secuencia de secciones es la misma",
  );
});

caso("una seccion NUEVA detiene", () => {
  const r = bash(`
    set -e
    T=$(mktemp -d); cd "$T"; git init -q .; git config user.email t@t; git config user.name t
    mkdir -p 'web-factory/apps/onia-platform/src/app/(sitio)'
    F='${PORTADA}'
    printf '%s\\n' '<Block labelledBy="uno"></Block>' > "$F"
    git add -A >/dev/null; git commit -qm base
    printf '%s\\n' '<Block labelledBy="uno"></Block><Block labelledBy="dos"></Block>' > "$F"
    git add -A >/dev/null; git commit -qm nueva
    echo "$T $(git rev-parse HEAD)"
  `).trim();
  const [dir, sha] = r.split(" ");
  const out = llamar("estructura_que_cambia", [dir, PORTADA, sha]);
  assert.equal(out.code, 1, "una seccion nueva en la portada es un rediseño");
});

caso("si no se puede leer la secuencia, falla CERRADO", () => {
  const r = llamar("estructura_que_cambia", [REPO, PORTADA, "0000000000000000000000000000000000000000"]);
  assert.notEqual(
    r.code,
    0,
    "un sha que no existe no se puede medir: el destino se detiene, nunca sale solo",
  );
});

let malos = 0;
for (const [nombre, fn] of casos) {
  try {
    fn();
    console.log(`  ok  ${nombre}`);
  } catch (e) {
    malos++;
    console.log(`  FALLA  ${nombre}\n        ${e.message.split("\n")[0]}`);
  }
}
console.log(
  `freno de estructura de la superficie de venta: ${casos.length - malos}/${casos.length}`,
);
process.exit(malos ? 1 : 0);

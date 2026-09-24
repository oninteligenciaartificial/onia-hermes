// ONIA — el sync del bot al contenedor NO puede volver a anidar la carpeta.
//
// LO QUE PASO, medido: el motor del chatbot estuvo MUERTO desde el 19-sep ~19:00 UTC hasta el
// 21-sep 19:34 — dos dias sin contestar WhatsApp. Causa: los archivos quedaron un nivel de mas
// adentro del contenedor, /tmp/onia-bot/bot/webhook-server.mjs en vez de
// /tmp/onia-bot/webhook-server.mjs, y el arranque moria con MODULE_NOT_FOUND.
//
// POR QUE PASO, que es lo que este test cuida: `docker cp ORIGEN DESTINO` se comporta distinto
// segun exista o no el destino. Si NO existe, crea el destino con el contenido de ORIGEN. Si YA
// existe, mete ORIGEN *adentro* -> DESTINO/bot/. El bloque de sync vivia DUPLICADO en 8 scripts,
// todos con `rm -rf $DEST` seguido de `docker cp "$BOT_DIR" "$CONTAINER:$DEST"`, y varios corren
// por cron a la misma hora (followup :17, reminder :32, postdemo :47, insistencia cada 30 min) y
// el watchdog hace `restart` cada 2 minutos cuando algo falla. Dos syncs solapados: A borra y
// copia (bien), B borra —no-op— y copia sobre un destino que A acaba de crear (anida).
//
// Y EL DANO ERA PERMANENTE porque los dos escriben el `.stamp` correcto: el siguiente sync
// compara el hash, lo ve igual, y no vuelve a copiar. El watchdog reintento el mismo arranque
// roto 1.440 veces contra un archivo que no estaba.
//
// EL ARREGLO que este test congela: `mkdir -p $DEST` + `docker cp "$BOT_DIR/." "$CONTAINER:$DEST"`.
// Copiar `ORIGEN/.` mete el CONTENIDO dentro de un destino que ya existe — es idempotente y no
// puede anidar, corra como corra la carrera.
//
// El test es un grep porque el bug ES textual: la diferencia entre bot mudo dos dias y bot sano
// son tres caracteres (`/.`). No hace falta levantar docker para defenderla.
//
// Correr:  node --test "hermes-content/deploy/vps-ops/bot/sync-no-anida.test.mjs"

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const AQUI = path.dirname(fileURLToPath(import.meta.url));

/** Los 8 scripts que comparten el bloque de sync al contenedor. */
const SCRIPTS = [
  "webhook-server.sh",
  "chatwoot-adapter.sh",
  "run-turn.sh",
  "reminder-run.sh",
  "usage-run.sh",
  "followup-run.sh",
  "insistencia-run.sh",
  "postdemo-run.sh",
];

const leer = (f) => readFileSync(path.join(AQUI, f), "utf8");

// Hay DOS destinos legitimos y el test tiene que aceptar los dos, porque cuidan cosas distintas:
//
//   - los 7 wrappers copian directo sobre "$DEST" (el arbol vivo), que es lo mas simple;
//   - webhook-server.sh arma la copia al lado, en "$DEST.new", y la publica con un `mv`. Eso
//     existe porque ese script sincroniza CON EL PROCESO VIVO (corre en `start`) y borrar o
//     reescribir el destino dejaba al bot sin knowledge.json a mitad de la copia — medido el
//     2026-09-12, conv 49. Exigirle "$DEST" pelado lo obligaria a revertir ese arreglo.
//
// Lo que NO cambia entre los dos, y es el invariante que este archivo congela: sea cual sea el
// destino, se copia el CONTENIDO ("$BOT_DIR/.") dentro de un destino que ya se creo con
// `mkdir -p`. Nunca la carpeta. `$DEST.new` tampoco se salva sola de la carrera: dos corridas
// solapadas del mismo script hacen que la segunda encuentre el `.new` de la primera.
const DESTINO = String.raw`\$DEST(?:\.new)?`;

test("ningun script copia la carpeta del bot sin la barra-punto (eso anida)", () => {
  for (const f of SCRIPTS) {
    const src = leer(f);
    // El patron prohibido: copiar $BOT_DIR (la carpeta) a un destino que puede existir.
    const anidador = new RegExp(String.raw`docker cp\s+"\$BOT_DIR"\s+"\$CONTAINER:${DESTINO}"`);
    assert.equal(
      anidador.test(src),
      false,
      `${f} copia "$BOT_DIR" (la carpeta) al contenedor. Si el destino ya existe, docker cp la ` +
        `mete ADENTRO y el bot muere con MODULE_NOT_FOUND. Usa "$BOT_DIR/." con un mkdir -p antes.`
    );
  }
});

test("todos los que sincronizan usan mkdir -p + cp con barra-punto", () => {
  for (const f of SCRIPTS) {
    const src = leer(f);
    const copia = new RegExp(String.raw`docker cp\s+"\$BOT_DIR/\."\s+"\$CONTAINER:(${DESTINO})"`);
    const m = src.match(copia);
    assert.ok(m, `${f} deberia copiar "$BOT_DIR/." (el contenido), no la carpeta.`);

    // El mkdir tiene que crear EL MISMO destino al que despues copia. Aceptar cualquier mkdir
    // dejaria pasar un script que crea "$DEST" y copia a "$DEST.new" — verde, y anidando igual.
    const destino = m[1].replace("$", String.raw`\$`).replace(".", String.raw`\.`);
    assert.match(
      src,
      new RegExp(String.raw`docker exec\s+"\$CONTAINER"\s+mkdir -p\s+"${destino}"`),
      `${f} necesita 'mkdir -p ${m[1]}' antes del cp: copiar ORIGEN/. exige que el destino exista.`
    );
  }
});

test("ninguno borra $DEST antes de copiar (esa es la ventana de la carrera)", () => {
  for (const f of SCRIPTS) {
    const src = leer(f);
    const borrado = /docker exec\s+"\$CONTAINER"\s+rm -rf\s+"\$DEST"/;
    assert.equal(
      borrado.test(src),
      false,
      `${f} borra $DEST antes de copiar. Entre el borrado y la copia entra otro sync y anida. ` +
        `La limpieza completa la hace deploy-bot.sh --aplicar, que no compite con los crons.`
    );
  }
});

test("el bloque de sync sigue estando en los 8 (si alguien lo saca, este test tiene que enterarse)", () => {
  // Guarda contra el falso verde: si un script deja de sincronizar, los asserts de arriba
  // pasarian por vacio. Este exige que el bloque exista para poder juzgarlo.
  for (const f of SCRIPTS) {
    const src = leer(f);
    assert.match(src, /\$CONTAINER:\$DEST/, `${f} ya no sincroniza al contenedor: revisar a proposito o bug.`);
    assert.match(src, /\.stamp/, `${f} perdio el control por .stamp del sync.`);
  }
});

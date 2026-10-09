// jarvis-resumen.test.mjs — el resumen de las 06:30 y el cierre de las 22:00.
//
// POR QUÉ EXISTE. Sergio Urcullo, 2026-09-29: "que me diga absolutamente lo de todos los
// días… cómo estuvo mi día". El resumen reemplaza cuatro mensajes sueltos de la mañana y
// el cierre no existía. Estos casos fijan lo que le promete ONIA_CEREBRO.md («La regla de
// entrega»): que cada dato sale de una fuente medida, que lo más importante de la etapa
// (el prospecto esperando) va primero, que nada se cuenta dos veces, y que si Telegram no
// lo recibió, lo de la noche NO se da por leído.
//
// Se corre con: node --test scripts/loops/jarvis-resumen.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, chmodSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(AQUI, "jarvis-resumen.sh");
const REPO_REAL = resolve(AQUI, "..", "..");

const LISTA = `⊘ t_1a2b3c4d blocked (unassigned) [leads-esperando] 3 desconocido(s) esperando una respuesta tuya
⊘ t_5e6f7a8b blocked (unassigned) Publicar el bot con la tarjeta de WhatsApp
▶ t_9c0d1e2f ready (unassigned) [auto:abc123] 🔴 CI en ROJO en main`;
const SHOW = `status: blocked
conv 812 (WhatsApp) — 23 d y sigue esperando — Dra. Rocha: estamos evaluando un sistema para la clínica
conv 845 (web) — 2 d esperando — Carla: cuánto cuesta el plan para 3 sillones?`;
const PARTE = `🙋 <b>2 esperan tu ok</b>

• [leads-esperando] 3 desconocido(s) esperando una respuesta tuya
   → <code>ok t_1a2b3c4d</code>
• Publicar el bot con la tarjeta de WhatsApp
   → <code>ok t_5e6f7a8b</code>

⚠️ <b>1 cosa(s) que no pude arreglar solo</b>

• 🔴 CI en ROJO en main

<i>Parte diario · 30/09 06:30</i>`;

function banco({ tableroVivo = true, tgFalla = false, show = SHOW, repo = REPO_REAL, lista = LISTA, parte: textoParte = PARTE } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "jarvis-"));
  const estado = join(dir, "estado");
  const out = join(dir, "out");
  mkdirSync(join(estado, "nocturnos"), { recursive: true });
  const escribir = (nombre, contenido) => {
    const f = join(dir, nombre);
    writeFileSync(f, contenido);
    chmodSync(f, 0o755);
    return f;
  };
  writeFileSync(join(dir, "lista.txt"), lista + "\n");
  writeFileSync(join(dir, "show.txt"), show + "\n");
  const tablero = escribir(
    "tablero.sh",
    tableroVivo
      ? `#!/usr/bin/env bash\n[ "$1" = list ] && { cat ${dir}/lista.txt; exit 0; }\n[ "$1" = show ] && { cat ${dir}/show.txt; exit 0; }\nexit 9\n`
      : `#!/usr/bin/env bash\nexit 1\n`,
  );
  writeFileSync(join(dir, "parte.txt"), textoParte);
  const parte = escribir("parte.sh", `#!/usr/bin/env bash\n"$ONIA_TG" "$(cat ${dir}/parte.txt)"\n`);
  const tg = escribir(
    "tg.sh",
    `#!/usr/bin/env bash
printf '%s|%s|%s|%s\\n' "$ONIA_AVISO" "$ONIA_AVISO_AHORA" "$ONIA_AVISO_CLAVE" "$ONIA_AVISO_EMISOR" > ${dir}/tg-env.txt
printf '%s' "$1" > ${dir}/tg-msg.txt
${tgFalla ? "exit 1" : "exit 0"}
`,
  );
  const correr = (modo, env = {}) =>
    spawnSync("bash", [SCRIPT, modo], {
      env: {
        ...process.env,
        ONIA_TG: tg,
        ONIA_TABLERO: tablero,
        ONIA_PARTE: parte,
        ONIA_REPO: repo,
        ONIA_AVISO_ESTADO: estado,
        ONIA_AGENDA: join(dir, "no-existe"),
        ONIA_PEDIDOS: join(dir, "no-existe-pedidos"),
        ONIA_JARVIS_OUT: out,
        ONIA_HOY: "2026-09-30",
        ...env,
      },
      encoding: "utf8",
    });
  const imprimir = (modo, env = {}) => correr(modo, { ONIA_JARVIS_SOLO_IMPRIMIR: "1", ...env }).stdout;
  const cola = (lineas) => writeFileSync(join(estado, "resumen.log"), lineas.join("\n") + "\n");
  const leer = (f) => (existsSync(join(dir, f)) ? readFileSync(join(dir, f), "utf8") : "");
  return { dir, estado, out, correr, imprimir, cola, leer, escribir };
}

// ── El resumen de la mañana ─────────────────────────────────────────────────────

test("lo primero que le pide son los prospectos esperando, con quién y hace cuánto", () => {
  const b = banco();
  const msg = b.imprimir("manana");
  const iProspectos = msg.indexOf("🧲");
  assert.ok(iProspectos > 0, "falta la sección de prospectos");
  assert.ok(iProspectos < msg.indexOf("🎬") && iProspectos < msg.indexOf("🙋"), "los prospectos van antes que todo lo demás");
  assert.match(msg, /3 persona\(s\) esperan que les contestes/);
  assert.match(msg, /conv 812 \(WhatsApp\) — 23 d/);
});

test("la tarea de prospectos no se cuenta dos veces entre las decisiones", () => {
  const b = banco();
  const msg = b.imprimir("manana");
  assert.match(msg, /🙋 <b>1 espera tu ok<\/b>/);
  assert.doesNotMatch(msg.slice(msg.indexOf("🙋")), /leads-esperando/);
  assert.match(msg, /ok t_5e6f7a8b/);
});

test("los guiones del día salen del plan de 3 semanas, con su franja", () => {
  const b = banco();
  const msg = b.imprimir("manana");
  assert.match(msg, /🎬 <b>Para grabar hoy<\/b>/);
  assert.match(msg, /• A · Tu primera skill de Claude Code en un minuto \(Vertical\)/);
  assert.match(msg, /• C · .*\(YouTube\)/);
});

test("un día sin guiones en el plan no inventa la sección", () => {
  const b = banco();
  assert.doesNotMatch(b.imprimir("manana", { ONIA_HOY: "2027-01-15" }), /🎬/);
});

test("lo que pasó de noche aparece con la hora de La Paz, y lo ya leído no se repite", () => {
  const b = banco();
  mkdirSync(b.estado, { recursive: true });
  writeFileSync(join(b.estado, "leido-hasta"), "2026-09-29T12:00:00Z");
  b.cola([
    "2026-09-29T11:00:00Z\twatchdog\tnoche\tbot\t🔴 Viejo, ya leído\tx",
    "2026-09-30T02:10:00Z\twatchdog\tnoche\tbot\t🔴 El bot no contesta\tx",
  ]);
  const msg = b.imprimir("manana");
  assert.match(msg, /🌙 <b>Mientras dormías<\/b>\n• 🔴 El bot no contesta \(22:10\)/);
  assert.doesNotMatch(msg, /Viejo, ya leído/);
});

test("la salud del sistema es UNA línea, y nombra lo más grave", () => {
  const b = banco();
  const msg = b.imprimir("manana");
  assert.match(msg, /🩺 Sistema: 1 arreglo\(s\) pendientes .*el más grave: 🔴 CI en ROJO en main/);
  assert.equal((msg.match(/CI en ROJO/g) || []).length, 1, "el error no se lista aparte");
});

test("sin tablero lo dice, no finge que no hay nada", () => {
  const b = banco({ tableroVivo: false });
  const msg = b.imprimir("manana");
  assert.match(msg, /No pude leer el tablero/);
});

test("el resumen sale por la aduana: interrumpe, sin silencio, con clave del día", () => {
  const b = banco();
  const r = b.correr("manana");
  assert.equal(r.status, 0, r.stderr);
  assert.equal(b.leer("tg-env.txt").trim(), "interrumpe|1|jarvis-manana-2026-09-30|jarvis");
});

test("entregado: la noche se da por leída y la voz queda lista, limpia para el oído", () => {
  const b = banco();
  writeFileSync(join(b.estado, "nocturnos", "bot"), "1");
  b.correr("manana");
  assert.ok(existsSync(join(b.estado, "leido-hasta")));
  assert.deepEqual(readdirSync(join(b.estado, "nocturnos")), []);
  const voz = readFileSync(join(b.out, "brief-hoy.txt"), "utf8");
  assert.match(voz, /^Buen día, Sergio Urcullo/);
  assert.match(voz, /^Pasó\.$/m, "el título del bloque se lee como palabra, no deletreado en mayúsculas");
  assert.doesNotMatch(voz, /→|<b>|🧲|ok t_/);
});

test("si Telegram no lo recibió, lo de la noche NO se da por leído", () => {
  const b = banco({ tgFalla: true });
  writeFileSync(join(b.estado, "nocturnos", "bot"), "1");
  const r = b.correr("manana");
  assert.equal(r.status, 1);
  assert.equal(existsSync(join(b.estado, "leido-hasta")), false);
  assert.deepEqual(readdirSync(join(b.estado, "nocturnos")), ["bot"]);
});

test("nunca pasa el límite de Telegram, aunque el tablero traiga una novela", () => {
  const largo = "status: blocked\n" + Array.from({ length: 400 }, (_, i) => `conv ${i} (web) — ${"x".repeat(200)}`).join("\n");
  const b = banco({ show: largo });
  const msg = b.imprimir("manana");
  assert.ok(msg.length <= 3900, `midió ${msg.length}`);
});

// ── El cierre de la noche ───────────────────────────────────────────────────────

function repoConCommits(asuntos, fecha = "2026-09-29T15:00:00-04:00") {
  const dir = mkdtempSync(join(tmpdir(), "jarvis-repo-"));
  const git = (...a) =>
    execFileSync("git", a, {
      cwd: dir,
      env: { ...process.env, GIT_AUTHOR_DATE: fecha, GIT_COMMITTER_DATE: fecha },
      encoding: "utf8",
    });
  git("init", "-q");
  git("config", "user.email", "t@t");
  git("config", "user.name", "t");
  for (const a of asuntos) git("commit", "-q", "--allow-empty", "-m", a);
  if (asuntos.length) git("update-ref", "refs/remotes/origin/main", "HEAD");
  return dir;
}

test("cierre sin cambios: lo dice en una línea", () => {
  const b = banco({ repo: repoConCommits([]) });
  const msg = b.imprimir("noche", { ONIA_HOY: "2026-09-29" });
  assert.match(msg, /^🌙 <b>Cierre del martes 29 de septiembre<\/b>/);
  assert.match(msg, /Ningún cambio nuevo en el sistema hoy/);
});

test("cierre con cambios: la traducción a castellano llano, sin los auto-sync", () => {
  const repo = repoConCommits(["chore: auto-sync 2026-09-29 12:00", "fix(bot): no longer makes prospects wait 5 s"]);
  const b = banco({ repo });
  const fake = b.escribir("llm.sh", `#!/usr/bin/env bash\ncat > ${b.dir}/llm-in.txt\necho "• El bot ya no hace esperar al prospecto."\n`);
  const msg = b.imprimir("noche", { ONIA_HOY: "2026-09-29", ONIA_JARVIS_LLM: fake });
  assert.match(msg, /• El bot ya no hace esperar al prospecto\.\n<i>\(1 cambio\(s\) integrados\)<\/i>/);
  assert.doesNotMatch(b.leer("llm-in.txt"), /auto-sync/);
});

test("cierre con la IA caída: la cuenta, sin inventar", () => {
  const repo = repoConCommits(["feat: one", "fix: two"]);
  const b = banco({ repo });
  const msg = b.imprimir("noche", { ONIA_HOY: "2026-09-29", ONIA_JARVIS_LLM: "exit 1" });
  assert.match(msg, /• 2 cambio\(s\) integrados al sistema \(no pude resumirlos: la IA no respondió\)/);
});

test("cierre: lo que sigue esperando, con la cuenta ya corregida", () => {
  const b = banco({ repo: repoConCommits([]) });
  const msg = b.imprimir("noche", { ONIA_HOY: "2026-09-29" });
  assert.match(msg, /⏳ <b>Te esperan<\/b>\n• 3 persona\(s\) sin respuesta\.\n• 1 decisión\(es\) tuya\(s\)\./);
});

test("la vista previa no gasta turnos del parte (su ronda real queda intacta)", () => {
  const b = banco();
  const ronda = join(b.dir, "ronda");
  mkdirSync(ronda);
  writeFileSync(join(ronda, "t_existente"), "1");
  // Un parte de mentira que, como el real, anota un turno en su ronda cada vez que corre.
  const parte = b.escribir("parte-rota.sh", `#!/usr/bin/env bash\ntouch "$ONIA_PARTE_RONDA/t_nuevo"\n"$ONIA_TG" "$(cat ${b.dir}/parte.txt)"\n`);
  b.imprimir("manana", { ONIA_PARTE: parte, ONIA_PARTE_RONDA: ronda });
  assert.deepEqual(readdirSync(ronda), ["t_existente"]);
});

test("la semana 2 del plan (fecha «7 de octubre») también aparece, sin la marca ✅", () => {
  const b = banco();
  const msg = b.imprimir("manana", { ONIA_HOY: "2026-10-07" });
  assert.match(msg, /• A · La regla de 24 horas que rompe tu bot de WhatsApp \(Vertical\)/);
  assert.doesNotMatch(msg, /✅ \(/);
  assert.match(msg, /• C · .*\(YouTube horizontal\)/);
});

test("«7 de octubre» no se confunde con el 17 ni «4-oct» con el 14-oct", () => {
  const b = banco();
  const d7 = b.imprimir("manana", { ONIA_HOY: "2026-10-07" });
  assert.doesNotMatch(d7, /Cortá los silencios|Subtítulos karaoke/);
  const d4 = b.imprimir("manana", { ONIA_HOY: "2026-10-04" });
  assert.doesNotMatch(d4, /Cortá los silencios/);
  assert.match(d4, /Dos sesiones de Claude Code en el mismo proyecto/);
});

const AGENDA_CON_IDS = `#!/usr/bin/env bash
if [ "$1" = --ids ]; then
  printf 'evtA\\t08:00\\t12:30\\t🎒 Colegio\\nevtB\\t13:00\\t14:30\\t🎬 ONIA · Marca personal — grabar\\nevtC\\t15:00\\t16:30\\t🔒 ONIA · Clientes — demos\\nevtD\\t--\\t--\\tONIA feriado\\n'
else
  printf '08:00–12:30 🎒 Colegio\\n13:00–14:30 🎬 ONIA · Marca personal — grabar\\n15:00–16:30 🔒 ONIA · Clientes — demos\\n'
fi
`;

test("el cierre lista los bloques de ONIA del día, numerados, y pregunta cuáles se hicieron", () => {
  const b = banco({ repo: repoConCommits([]) });
  const agenda = b.escribir("agenda.sh", AGENDA_CON_IDS);
  const msg = b.imprimir("noche", { ONIA_HOY: "2026-09-29", ONIA_AGENDA: agenda });
  assert.match(msg, /📋 <b>Tus bloques de hoy<\/b> — ¿se hicieron\?\n1\. 13:00–14:30 🎬 ONIA · Marca personal — grabar\n2\. 15:00–16:30 🔒 ONIA · Clientes — demos\n→ Contestame/);
  assert.doesNotMatch(msg.slice(msg.indexOf("📋"), msg.indexOf("→ Contestame")), /Colegio/);
});

test("el «2 no» lleva a un evento: el cierre entregado deja número → id para Hermes", () => {
  const b = banco({ repo: repoConCommits([]) });
  const agenda = b.escribir("agenda.sh", AGENDA_CON_IDS);
  const r = b.correr("noche", { ONIA_HOY: "2026-09-29", ONIA_AGENDA: agenda });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(
    readFileSync(join(b.estado, "cierre-bloques.tsv"), "utf8"),
    "2026-09-29\t1\tevtB\t13:00\t14:30\t🎬 ONIA · Marca personal — grabar\n" +
      "2026-09-29\t2\tevtC\t15:00\t16:30\t🔒 ONIA · Clientes — demos\n",
  );
});

test("gemelo: una vista previa no deja números que él nunca vio", () => {
  const b = banco({ repo: repoConCommits([]) });
  const agenda = b.escribir("agenda.sh", AGENDA_CON_IDS);
  b.imprimir("noche", { ONIA_HOY: "2026-09-29", ONIA_AGENDA: agenda });
  assert.equal(existsSync(join(b.estado, "cierre-bloques.tsv")), false);
});

test("sin lector de calendario, el cierre no inventa bloques", () => {
  const b = banco({ repo: repoConCommits([]) });
  assert.doesNotMatch(b.imprimir("noche", { ONIA_HOY: "2026-09-29" }), /📋/);
});

// ── Los pedidos a Claude (2026-10-01) ──────────────────────────────────────────

test("el cierre lista los pedidos del día a Claude, con su estado en castellano", () => {
  const b = banco();
  const pedidos = b.escribir(
    "pedidos.sh",
    `#!/usr/bin/env bash
[ "$1" = --lista ] && [ "$2" = 2026-09-30 ] || exit 9
printf '10:05\\tp_1a2b3c4d\\tplataforma\\tlisto\\thttps://claude.ai/code/session_1\\n'
printf '15:40\\tp_5e6f7a8b\\tventas\\tsin respuesta\\thttps://claude.ai/code/session_2\\n'
`,
  );
  const msg = b.imprimir("noche", { ONIA_PEDIDOS: pedidos });
  assert.match(msg, /🤖 <b>Tus pedidos a Claude hoy<\/b>\n• 10:05 plataforma — ✅ listo\n• 15:40 ventas — ⏳ sin respuesta todavía/);
  assert.doesNotMatch(b.imprimir("manana", { ONIA_PEDIDOS: pedidos }), /🤖/, "el resumen de la mañana no los repite");
});

test("un día sin pedidos, o sin el comando, el cierre no inventa la sección", () => {
  const b = banco();
  const vacio = b.escribir("pedidos-vacio.sh", "#!/usr/bin/env bash\nexit 0\n");
  assert.doesNotMatch(b.imprimir("noche", { ONIA_PEDIDOS: vacio }), /🤖/);
  assert.doesNotMatch(b.imprimir("noche"), /🤖/);
});

// ── El formato fijo: Pasó · Necesito · Sigue (Sergio Urcullo, 2026-10-08) ───────
// «me entregás demasiado texto y me pierdo». Máximo tres bloques, en ese orden; lo que le pide
// algo va en NECESITO, y si no hay nada se dice «Nada.» — salvo que no se haya podido medir.

// Devuelve { PASÓ, NECESITO, SIGUE } con el texto de cada bloque, o falla si faltan o se desordenan.
function bloques(msg) {
  const titulos = [...msg.matchAll(/^<b>(PASÓ|NECESITO|SIGUE)<\/b>$/gm)];
  assert.deepEqual(titulos.map((m) => m[1]), ["PASÓ", "NECESITO", "SIGUE"], msg);
  const b = {};
  titulos.forEach((m, i) => {
    b[m[1]] = msg.slice(m.index + m[0].length, i + 1 < titulos.length ? titulos[i + 1].index : undefined);
  });
  return b;
}

test("la mañana viene en tres bloques: lo de la noche, lo que le pide, su día", () => {
  const b = banco();
  b.cola(["2026-09-30T02:10:00Z\twatchdog\tnoche\tbot\t🔴 El bot no contesta\tx"]);
  const { PASÓ, NECESITO, SIGUE } = bloques(b.imprimir("manana"));
  assert.match(PASÓ, /🌙 <b>Mientras dormías<\/b>/);
  assert.match(PASÓ, /🩺 Sistema:/);
  assert.match(NECESITO, /🧲 <b>3 persona\(s\) esperan/);
  assert.match(NECESITO, /🙋 <b>1 espera tu ok<\/b>/);
  assert.ok(NECESITO.indexOf("🧲") < NECESITO.indexOf("🙋"), "los prospectos, antes que las decisiones");
  assert.match(SIGUE, /📅 /);
  assert.match(SIGUE, /🎬 <b>Para grabar hoy<\/b>/);
});

test("el cierre viene en tres bloques: lo que se hizo, lo que le pide, mañana", () => {
  const b = banco({ repo: repoConCommits([]) });
  const agenda = b.escribir("agenda.sh", AGENDA_CON_IDS);
  const { PASÓ, NECESITO, SIGUE } = bloques(b.imprimir("noche", { ONIA_HOY: "2026-09-29", ONIA_AGENDA: agenda }));
  assert.match(PASÓ, /✅ <b>Hoy<\/b>/);
  assert.match(PASÓ, /🩺 Sistema:/);
  assert.match(NECESITO, /📋 <b>Tus bloques de hoy<\/b> — ¿se hicieron\?/);
  assert.match(NECESITO, /⏳ <b>Te esperan<\/b>/);
  assert.match(SIGUE, /📅 <b>Mañana<\/b>/);
});

test("sin nada que pedirle, NECESITO dice «Nada.» en vez de desaparecer", () => {
  const lista = "▶ t_9c0d1e2f ready (unassigned) [auto:abc123] 🔴 CI en ROJO en main";
  const parte = "⚠️ <b>1 cosa(s) que no pude arreglar solo</b>\n\n• 🔴 CI en ROJO en main\n\n<i>Parte diario · 30/09 06:30</i>";
  const b = banco({ lista, parte, repo: repoConCommits([]) });
  assert.equal(bloques(b.imprimir("manana")).NECESITO.trim(), "Nada.");
  assert.equal(bloques(b.imprimir("noche", { ONIA_HOY: "2026-09-29" })).NECESITO.trim(), "Nada.");
});

test("con el tablero caído, NECESITO nunca dice «Nada.»: dice que no lo pudo ver", () => {
  const b = banco({ tableroVivo: false, parte: "⚠️ No pude verificar el tablero.", repo: repoConCommits([]) });
  for (const [modo, env] of [["manana", {}], ["noche", { ONIA_HOY: "2026-09-29" }]]) {
    const { NECESITO } = bloques(b.imprimir(modo, env));
    assert.doesNotMatch(NECESITO, /^\s*Nada\./, modo);
    assert.match(NECESITO, /No pude leer el tablero|el tablero no respondió/, modo);
  }
});

test("con el parte caído (el tablero vivo y sin prospectos), NECESITO tampoco dice «Nada.»", () => {
  const lista = "▶ t_9c0d1e2f ready (unassigned) [auto:abc123] 🔴 CI en ROJO en main";
  const b = banco({ lista, parte: "", repo: repoConCommits([]) });
  for (const [modo, env] of [["manana", {}], ["noche", { ONIA_HOY: "2026-09-29" }]]) {
    const msg = b.imprimir(modo, env);
    const { NECESITO } = bloques(msg);
    assert.doesNotMatch(NECESITO, /^\s*Nada\./, modo);
    assert.match(NECESITO, /el parte diario no respondió/, modo);
    assert.doesNotMatch(msg, /el tablero no respondió/, `${modo}: el tablero sí respondió; el que falló fue el parte`);
  }
});

test("con el parte caído y prospectos esperando, NECESITO igual avisa que faltan las decisiones", () => {
  // Revisión del 9-oct: el aviso solo salía con NECESITO vacío. Con prospectos, callaba que no
  // pudo ver las decisiones.
  const b = banco({ parte: "", repo: repoConCommits([]) });
  for (const [modo, env] of [["manana", {}], ["noche", { ONIA_HOY: "2026-09-29" }]]) {
    const { NECESITO } = bloques(b.imprimir(modo, env));
    assert.match(NECESITO, /3 persona\(s\)/, modo);
    assert.match(NECESITO, /No pude ver las decisiones que esperan tu ok \(el parte diario no respondió\)/, modo);
  }
});

test("un pedido a Claude que espera su ok va en NECESITO, no en PASÓ, y NECESITO no dice «Nada.»", () => {
  // Revisión del 9-oct: con un pedido «necesita-ok» y sin decisiones, el cierre decía «Nada.».
  const lista = "▶ t_9c0d1e2f ready (unassigned) [auto:abc123] 🔴 CI en ROJO en main";
  const parte = "⚠️ <b>1 cosa(s) que no pude arreglar solo</b>\n\n• 🔴 CI en ROJO en main\n\n<i>Parte diario · 30/09 06:30</i>";
  const b = banco({ lista, parte });
  const pedidos = b.escribir(
    "pedidos.sh",
    `#!/usr/bin/env bash
printf '10:05\\tp_1a2b3c4d\\tplataforma\\tlisto\\thttps://claude.ai/code/session_1\\n'
printf '15:40\\tp_5e6f7a8b\\tventas\\tnecesita-ok\\thttps://claude.ai/code/session_2\\n'
`,
  );
  const { PASÓ, NECESITO } = bloques(b.imprimir("noche", { ONIA_PEDIDOS: pedidos }));
  assert.match(PASÓ, /• 10:05 plataforma — ✅ listo/);
  assert.doesNotMatch(PASÓ, /ventas/);
  assert.match(NECESITO, /🙋 <b>Pedidos a Claude que esperan tu ok<\/b>\n• 15:40 ventas — https:\/\/claude\.ai\/code\/session_2/);
  assert.doesNotMatch(NECESITO, /^\s*Nada\./);
});

test("si no puede leer los bloques de hoy, el cierre lo dice en NECESITO en vez de «Nada.»", () => {
  const lista = "▶ t_9c0d1e2f ready (unassigned) [auto:abc123] 🔴 CI en ROJO en main";
  const parte = "⚠️ <b>1 cosa(s) que no pude arreglar solo</b>\n\n• 🔴 CI en ROJO en main\n\n<i>Parte diario · 30/09 06:30</i>";
  const b = banco({ lista, parte, repo: repoConCommits([]) });
  const agenda = b.escribir("agenda-rota.sh", "#!/usr/bin/env bash\n[ \"$1\" = --ids ] && exit 1\necho '08:00–12:30 🎒 Colegio'\n");
  const { NECESITO } = bloques(b.imprimir("noche", { ONIA_HOY: "2026-09-29", ONIA_AGENDA: agenda }));
  assert.match(NECESITO, /No pude leer tus bloques de hoy/);
  assert.doesNotMatch(NECESITO, /^\s*Nada\./);
});

test("el recorte de Telegram corta entre líneas: nunca deja una etiqueta abierta", () => {
  // Revisión del 9-oct: `${MSG:0:3850}` podía partir un <b>…</b> o un <code>…</code>, y Telegram
  // rechaza el HTML roto: ese día no se entregaba nada. Con decisiones de largo variable, el corte
  // cae en todas las posiciones posibles de una línea.
  for (let relleno = 0; relleno < 14; relleno++) {
    const decisiones = Array.from({ length: 80 }, (_, k) => `• <b>Tarea ${k}</b> ${"x".repeat(relleno)}\n   → <code>ok t_${String(k).padStart(8, "0")}</code>`);
    const b = banco({ parte: "🙋 <b>80 esperan tu ok</b>\n\n" + decisiones.join("\n") + "\n\n<i>Parte diario</i>" });
    const msg = b.imprimir("manana");
    assert.ok(msg.length <= 3900, `midió ${msg.length}`);
    assert.match(msg, /… \(recortado\)\n?$/);
    for (const t of ["b", "i", "code"]) {
      assert.equal((msg.match(new RegExp(`<${t}>`, "g")) || []).length, (msg.match(new RegExp(`</${t}>`, "g")) || []).length, `<${t}> desparejo con relleno ${relleno}`);
    }
  }
});

// ── Qué sale hoy: el calendario de publicación vigente (9-oct) ──────────────────
// El GOAL del 8-oct: sale contenido todos los días. Desde el 8-oct lo que se publica cada día está en
// CALENDARIO-PUBLICACION-<d1>-<d2>-<MES>.md, y se graba todo junto (GRABAR-*.md). Medido el 9-oct: la
// mañana del 10 decía «Para grabar hoy» con tres guiones del plan del 29-sep, y ese día salen otros.
const CALENDARIO = `# Calendario de publicación · viernes 9 → viernes 16 de octubre

| Hora | Qué sale | Dónde | Cómo |
|---|---|---|---|
| **12:30** | **Video A** | Instagram | \`ig-reel.mjs\` |

## Calendario

| Día | Carrusel 16:00 | Video A · 12:30 (yap 13:30) | Video B · 18:30 (yap 19:30) |
|---|---|---|---|
| **Vie 9** | COMUNIDAD (N03) | — | **N03 modo auto** (v2, agendado) |
| **Sáb 10** | HOOK (K11) | **N07** Haiku 5.5 | **D03-A** hook que commitea |
| **Dom 11** | ANTIGRAVITY (N06) | **N06** Antigravity | **DD-A** caché de <OpenAI> |
`;
const GUIONES_VIEJOS = `## Sábado 10 de octubre

### D11-A · Vertical · Un guion del plan viejo
`;
function repoConCalendario() {
  const dir = mkdtempSync(join(tmpdir(), "jarvis-plan-"));
  const plan = join(dir, "hermes-content", "docs", "cola", "plan-3-semanas");
  mkdirSync(plan, { recursive: true });
  writeFileSync(join(plan, "CALENDARIO-PUBLICACION-9-16-OCT.md"), CALENDARIO);
  writeFileSync(join(plan, "S2-GUIONES.md"), GUIONES_VIEJOS);
  return dir;
}

test("la mañana dice qué sale hoy, por hora, del calendario de publicación", () => {
  const b = banco({ repo: repoConCalendario() });
  const msg = b.imprimir("manana", { ONIA_HOY: "2026-10-10" });
  assert.match(msg, /📣 <b>Hoy sale<\/b>\n• 12:30 Video A · N07 Haiku 5\.5\n• 16:00 Carrusel · HOOK \(K11\)\n• 18:30 Video B · D03-A hook que commitea/);
  assert.ok(bloques(msg).SIGUE.includes("📣 <b>Hoy sale</b>"), "va en SIGUE");
});

test("con calendario para el día, no repite los guiones del plan viejo como «para grabar hoy»", () => {
  const b = banco({ repo: repoConCalendario() });
  const msg = b.imprimir("manana", { ONIA_HOY: "2026-10-10" });
  assert.doesNotMatch(msg, /Un guion del plan viejo|Para grabar hoy/);
});

test("un día sin pieza en una columna («—») no inventa esa línea, y el texto va escapado", () => {
  const b = banco({ repo: repoConCalendario() });
  const vie = b.imprimir("manana", { ONIA_HOY: "2026-10-09" });
  assert.match(vie, /• 16:00 Carrusel · COMUNIDAD \(N03\)\n• 18:30 Video B · N03 modo auto \(v2, agendado\)/);
  assert.doesNotMatch(vie, /Video A ·/);
  const dom = b.imprimir("noche", { ONIA_HOY: "2026-10-10" });
  assert.match(dom, /📣 <b>Mañana sale<\/b>[\s\S]*DD-A caché de &lt;OpenAI&gt;/);
});

test("fuera del rango del calendario (o el mismo número de otro mes) vuelve a los guiones del plan", () => {
  const b = banco({ repo: repoConCalendario() });
  assert.doesNotMatch(b.imprimir("manana", { ONIA_HOY: "2027-04-10" }), /📣/, "el sábado 10 de abril no es el sábado 10 de octubre");
  const real = banco();
  assert.match(real.imprimir("manana", { ONIA_HOY: "2026-10-07" }), /🎬 <b>Para grabar hoy<\/b>/, "el 7-oct no lo cubre el calendario 9-16");
});

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
import { mkdtempSync, writeFileSync, readFileSync, chmodSync, existsSync, mkdirSync, readdirSync, utimesSync } from "node:fs";
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

// El plan del 29-sep (S*-GUIONES) SIN los calendarios: desde que existe uno, el resumen ya no vuelve a
// los guiones viejos, y el repo real tiene calendarios desde el 8-oct.
function repoPlanViejo() {
  const dir = mkdtempSync(join(tmpdir(), "jarvis-viejo-"));
  const plan = join(dir, "hermes-content", "docs", "cola", "plan-3-semanas");
  const real = join(REPO_REAL, "hermes-content", "docs", "cola", "plan-3-semanas");
  mkdirSync(plan, { recursive: true });
  for (const f of readdirSync(real).filter((f) => /^S\d-GUIONES\.md$/.test(f))) writeFileSync(join(plan, f), readFileSync(join(real, f)));
  conMadre(dir, MADRE_LEJOS);
  return dir;
}

// La tabla de relojes de la madre (cola/loop/madre.md §G). Por defecto, una que no vence nada cerca
// del 30-sep: si no, cada mañana de prueba tendría «⏰» en NECESITO y nunca diría «Nada.».
const MADRE_LEJOS = "# Cola · MADRE\n\n## G. Relojes\n| Fecha | Qué | Dueño | Fuente |\n|---|---|---|---|\n| 15-dic | Lejos | SU | x |\n";
function conMadre(dir, texto) {
  const loop = join(dir, "hermes-content", "docs", "cola", "loop");
  mkdirSync(loop, { recursive: true });
  writeFileSync(join(loop, "madre.md"), texto);
  return dir;
}
const PLAN_VIEJO = repoPlanViejo();

function banco({ tableroVivo = true, tgFalla = false, show = SHOW, repo = PLAN_VIEJO, lista = LISTA, parte: textoParte = PARTE } = {}) {
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
        ONIA_ORQUESTA: join(dir, "no-existe-orquesta"),
        ONIA_PUBLICADO: join(dir, "no-existe-publicado.jsonl"),
        ONIA_JARVIS_OUT: out,
        ONIA_HOY: "2026-09-30",
        ONIA_LATIDO_DIR: join(dir, "no-existe-latidos"),
        ...env,
      },
      encoding: "utf8",
    });
  const imprimir = (modo, env = {}) => correr(modo, { ONIA_JARVIS_SOLO_IMPRIMIR: "1", ONIA_JARVIS_GRUPOS: "1", ...env }).stdout;
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

// ── Los tres bloques: lo que pasó, lo que le toca, lo que viene (Sergio Urcullo, 8 y 20-oct) ───
// «me entregás demasiado texto y me pierdo». Máximo tres bloques, en ese orden; lo que le pide
// algo va en NECESITO, y si no hay nada se dice «De tu lado, nada pendiente.» — salvo que no se haya
// podido medir. Desde el 20-oct los rótulos no se le muestran («que hablen normal pero resumido y al
// grano»): `imprimir` los pide con ONIA_JARVIS_GRUPOS=1 para poder partir el mensaje acá.

test("a Sergio Urcullo le llega sin los rótulos Pasó · Necesito · Sigue", () => {
  const b = banco();
  for (const [modo, env] of [["manana", {}], ["noche", { ONIA_HOY: "2026-09-29" }]]) {
    const msg = b.imprimir(modo, { ...env, ONIA_JARVIS_GRUPOS: "0" });
    assert.doesNotMatch(msg, /PASÓ|NECESITO|SIGUE|Pasó|Necesito|Sigue/, modo);
    assert.match(msg, /🩺 Sistema:/, modo);
  }
});

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

test("sin nada que pedirle, NECESITO dice «De tu lado, nada pendiente.» en vez de desaparecer", () => {
  const lista = "▶ t_9c0d1e2f ready (unassigned) [auto:abc123] 🔴 CI en ROJO en main";
  const parte = "⚠️ <b>1 cosa(s) que no pude arreglar solo</b>\n\n• 🔴 CI en ROJO en main\n\n<i>Parte diario · 30/09 06:30</i>";
  const b = banco({ lista, parte, repo: conMadre(repoConCommits([]), MADRE_LEJOS) });
  assert.equal(bloques(b.imprimir("manana")).NECESITO.trim(), "De tu lado, nada pendiente.");
  assert.equal(bloques(b.imprimir("noche", { ONIA_HOY: "2026-09-29" })).NECESITO.trim(), "De tu lado, nada pendiente.");
});

test("con el tablero caído, NECESITO nunca dice «De tu lado, nada pendiente.»: dice que no lo pudo ver", () => {
  const b = banco({ tableroVivo: false, parte: "⚠️ No pude verificar el tablero.", repo: repoConCommits([]) });
  for (const [modo, env] of [["manana", {}], ["noche", { ONIA_HOY: "2026-09-29" }]]) {
    const { NECESITO } = bloques(b.imprimir(modo, env));
    assert.doesNotMatch(NECESITO, /nada pendiente/, modo);
    assert.match(NECESITO, /No pude leer el tablero|el tablero no respondió/, modo);
  }
});

test("con el parte caído (el tablero vivo y sin prospectos), NECESITO tampoco dice «De tu lado, nada pendiente.»", () => {
  const lista = "▶ t_9c0d1e2f ready (unassigned) [auto:abc123] 🔴 CI en ROJO en main";
  const b = banco({ lista, parte: "", repo: repoConCommits([]) });
  for (const [modo, env] of [["manana", {}], ["noche", { ONIA_HOY: "2026-09-29" }]]) {
    const msg = b.imprimir(modo, env);
    const { NECESITO } = bloques(msg);
    assert.doesNotMatch(NECESITO, /nada pendiente/, modo);
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

test("un pedido a Claude que espera su ok va en NECESITO, no en PASÓ, y NECESITO no dice «De tu lado, nada pendiente.»", () => {
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
  assert.doesNotMatch(NECESITO, /nada pendiente/);
});

test("si no puede leer los bloques de hoy, el cierre lo dice en NECESITO en vez de «nada pendiente»", () => {
  const lista = "▶ t_9c0d1e2f ready (unassigned) [auto:abc123] 🔴 CI en ROJO en main";
  const parte = "⚠️ <b>1 cosa(s) que no pude arreglar solo</b>\n\n• 🔴 CI en ROJO en main\n\n<i>Parte diario · 30/09 06:30</i>";
  const b = banco({ lista, parte, repo: repoConCommits([]) });
  const agenda = b.escribir("agenda-rota.sh", "#!/usr/bin/env bash\n[ \"$1\" = --ids ] && exit 1\necho '08:00–12:30 🎒 Colegio'\n");
  const { NECESITO } = bloques(b.imprimir("noche", { ONIA_HOY: "2026-09-29", ONIA_AGENDA: agenda }));
  assert.match(NECESITO, /No pude leer tus bloques de hoy/);
  assert.doesNotMatch(NECESITO, /nada pendiente/);
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

## Sábado 17 de octubre

### D18-A · Vertical · Otro guion del plan viejo
`;
function repoConCalendario(extra = {}) {
  const dir = mkdtempSync(join(tmpdir(), "jarvis-plan-"));
  const plan = join(dir, "hermes-content", "docs", "cola", "plan-3-semanas");
  mkdirSync(plan, { recursive: true });
  writeFileSync(join(plan, "CALENDARIO-PUBLICACION-9-16-OCT.md"), CALENDARIO);
  for (const [nombre, texto] of Object.entries(extra)) writeFileSync(join(plan, nombre), texto);
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

test("fuera del rango del calendario (o el mismo número de otro mes) no nombra piezas ni vuelve al plan viejo", () => {
  const b = banco({ repo: repoConCalendario() });
  const abr = b.imprimir("manana", { ONIA_HOY: "2027-04-10" });
  assert.doesNotMatch(abr, /Hoy sale|HOOK/, "el sábado 10 de abril no es el sábado 10 de octubre");
  assert.match(abr, /📣 Todavía no hay calendario de publicación para hoy\./);
  const antes = b.imprimir("manana", { ONIA_HOY: "2026-10-07" });
  assert.doesNotMatch(antes, /Para grabar hoy/, "con calendarios, los S*-GUIONES no vuelven");
});

// ── Qué salió de verdad hoy (9-oct) ──────────────────────────────────────────────
// GOAL del 8-oct: al menos una pieza publicada por día. Los publicadores del VPS (ig-reel, ig-carrusel,
// ig-historia, yt-video, buffer-post) anotan cada publicación en /root/publicar/publicado.jsonl; los de
// Instagram y YouTube, con su link. El cierre lo dice, con la hora de La Paz.
const REGISTRO = [
  { cuenta: "sergio", media: "1", trial: null, video: "/x/a.mp4", permalink: "https://www.instagram.com/reel/AAA/", media_product_type: "REELS", timestamp: "2026-09-29T16:31:05+0000" },
  { cuenta: "sergio", media: "2", trial: "auto", video: "/x/y.mp4", permalink: "https://www.instagram.com/reel/YAP/", media_product_type: "REELS", timestamp: "2026-09-29T17:30:40+0000" },
  { cuenta: "sergio", media: "3", tipo: "carrusel", dir: "/x/k", permalink: "https://www.instagram.com/p/CAR/", media_product_type: "FEED", timestamp: "2026-09-29T20:00:09+0000" },
  { red: "youtube", cuenta: "sergio", id: "v1", url: "https://youtu.be/v1?a=1&b=<2>", privacidad: "public", video: "/x/l.mp4", fecha: "2026-09-30T01:15:00.000Z" },
  { red: "buffer", canal: "c1", post: "p1", estado: "publica ya", cuando: "ya", video: "/x/a.mp4", fecha: "2026-09-29T16:35:00.000Z" },
  { red: "buffer", canal: "c2", post: "p2", estado: "borrador", cuando: "ya", video: "/x/a.mp4", fecha: "2026-09-29T16:36:00.000Z" },
  { cuenta: "sergio", media: "0", trial: null, video: "/x/viejo.mp4", permalink: "https://www.instagram.com/reel/AYER/", media_product_type: "REELS", timestamp: "2026-09-29T02:00:00+0000" },
];

test("el cierre dice qué salió hoy, con la hora de La Paz y el link, del registro de publicaciones", () => {
  const b = banco({ repo: repoConCommits([]) });
  const reg = join(b.dir, "publicado.jsonl");
  writeFileSync(reg, REGISTRO.map((r) => JSON.stringify(r)).join("\n") + "\n{roto\n");
  const msg = b.imprimir("noche", { ONIA_HOY: "2026-09-29", ONIA_PUBLICADO: reg });
  const { PASÓ } = bloques(msg);
  assert.match(
    PASÓ,
    /📣 <b>Hoy salió<\/b>\n• 12:31 Reel — https:\/\/www\.instagram\.com\/reel\/AAA\/\n• 13:30 Trial — https:\/\/www\.instagram\.com\/reel\/YAP\/\n• 16:00 Carrusel — https:\/\/www\.instagram\.com\/p\/CAR\/\n• 21:15 YouTube — https:\/\/youtu\.be\/v1\?a=1&amp;b=&lt;2&gt;\n• 1 envío a Buffer para hoy \(sin link: no confirma que salió\)\./,
  );
  assert.doesNotMatch(msg, /AYER/, "lo de las 22:00 del día anterior en La Paz no es de hoy");
});

test("un día sin nada publicado lo dice, con lo que tenía el calendario", () => {
  const b = banco({ repo: repoConCalendario() });
  const reg = join(b.dir, "publicado.jsonl");
  writeFileSync(reg, JSON.stringify(REGISTRO[0]) + "\n");
  const { PASÓ } = bloques(b.imprimir("noche", { ONIA_HOY: "2026-10-10", ONIA_PUBLICADO: reg }));
  assert.match(PASÓ, /📣 <b>En el registro no hay nada publicado hoy<\/b> en Instagram ni YouTube \(el calendario tenía 3 pieza\(s\)\)\./);
});

test("sin el registro de publicaciones, el cierre dice que no lo pudo leer; la mañana no lo nombra", () => {
  const b = banco({ repo: repoConCommits([]) });
  const env = { ONIA_HOY: "2026-09-29", ONIA_PUBLICADO: join(b.dir, "no-existe.jsonl") };
  assert.match(bloques(b.imprimir("noche", env)).PASÓ, /📣 No pude leer el registro de publicaciones: no sé qué salió hoy\./);
  assert.doesNotMatch(b.imprimir("manana", env), /📣 <b>Hoy salió|registro de publicaciones/);
});

test("pasado el último calendario, no vuelve a los guiones viejos: dice que no hay calendario", () => {
  // El 17-oct ya no lo cubre el calendario 9-16, y los S*-GUIONES del 29-sep tienen guiones para ese
  // día. Volver a ellos le nombraba piezas de un plan que ya no corre.
  const b = banco({ repo: repoConCalendario() });
  const man = b.imprimir("manana", { ONIA_HOY: "2026-10-17" });
  assert.doesNotMatch(man, /Otro guion del plan viejo|Para grabar hoy/);
  assert.match(bloques(man).SIGUE, /📣 Todavía no hay calendario de publicación para hoy\./);
  const noche = b.imprimir("noche", { ONIA_HOY: "2026-10-16" });
  assert.match(bloques(noche).SIGUE, /📣 Todavía no hay calendario de publicación para mañana\./);
  assert.doesNotMatch(noche, /Mañana grabás/);
});

// ── Segunda revisión (9-oct): lo que el cierre callaba o decía de más ────────────
const linea = (o) => JSON.stringify(o) + "\n";

test("un video de YouTube privado (el ensayo de yt-video) no cuenta como publicado", () => {
  const b = banco({ repo: repoConCommits([]) });
  const reg = join(b.dir, "publicado.jsonl");
  writeFileSync(reg, linea({ red: "youtube", id: "e", url: "https://youtu.be/ENSAYO", privacidad: "private", fecha: "2026-09-29T15:00:00.000Z" }) +
    linea({ red: "youtube", id: "p", url: "https://youtu.be/PUBLICO", privacidad: "public", fecha: "2026-09-29T16:00:00.000Z" }));
  const { PASÓ } = bloques(b.imprimir("noche", { ONIA_HOY: "2026-09-29", ONIA_PUBLICADO: reg }));
  assert.match(PASÓ, /• 12:00 YouTube — https:\/\/youtu\.be\/PUBLICO/);
  assert.doesNotMatch(PASÓ, /ENSAYO/);
});

test("una historia (ig-historia no guarda link) aparece, con su hora", () => {
  const b = banco({ repo: repoConCommits([]) });
  const reg = join(b.dir, "publicado.jsonl");
  writeFileSync(reg, linea({ cuenta: "sergio", media: "9", tipo: "historia", imagen: "/x.png", media_product_type: "STORY", timestamp: "2026-09-29T20:05:00+0000" }));
  const { PASÓ } = bloques(b.imprimir("noche", { ONIA_HOY: "2026-09-29", ONIA_PUBLICADO: reg }));
  assert.match(PASÓ, /📣 <b>Hoy salió<\/b>\n• 16:05 Historia\n/);
});

test("un día solo con envíos a Buffer no dice «Hoy salió»; cuenta por la hora de salida y solo lo que ya pasó", () => {
  const b = banco({ repo: repoConCommits([]) });
  const reg = join(b.dir, "publicado.jsonl");
  writeFileSync(reg,
    linea({ red: "buffer", post: "a", estado: "agendado", cuando: "2026-09-29T16:35:00.000Z", fecha: "2026-09-28T12:00:00.000Z" }) + // sale hoy, agendado ayer
    linea({ red: "buffer", post: "b", estado: "agendado", cuando: "2026-09-30T16:35:00.000Z", fecha: "2026-09-29T12:00:00.000Z" }) + // agendado hoy, sale mañana
    linea({ red: "buffer", post: "c", estado: "agendado", cuando: "2026-09-30T00:30:00.000Z", fecha: "2026-09-29T12:00:00.000Z" }), // 20:30 de hoy, después del cierre
  );
  const { PASÓ } = bloques(b.imprimir("noche", { ONIA_HOY: "2026-09-29", ONIA_PUBLICADO: reg, ONIA_AHORA: "2026-09-29T23:30:00Z" }));
  assert.doesNotMatch(PASÓ, /Hoy salió/);
  assert.match(PASÓ, /📣 <b>En el registro no hay nada publicado hoy<\/b> en Instagram ni YouTube\.\n• 1 envío a Buffer para hoy \(sin link: no confirma que salió\)\./);
});

test("una línea rara del registro no tapa lo que sí salió", () => {
  const b = banco({ repo: repoConCommits([]) });
  const reg = join(b.dir, "publicado.jsonl");
  writeFileSync(reg, linea({ tipo: ["raro"], timestamp: "2026-09-29T16:00:00+0000", permalink: "x" }) + linea(REGISTRO[0]));
  assert.match(bloques(b.imprimir("noche", { ONIA_HOY: "2026-09-29", ONIA_PUBLICADO: reg })).PASÓ, /• 12:31 Reel — https:\/\/www\.instagram\.com\/reel\/AAA\//);
});

test("con python roto, lo dice: ni «Hoy no salió nada» ni los guiones del plan viejo", () => {
  const b = banco({ repo: repoConCalendario() });
  const dobles = join(b.dir, "dobles");
  mkdirSync(dobles);
  b.escribir("dobles/python3", "#!/usr/bin/env bash\nexit 1\n");
  const reg = join(b.dir, "publicado.jsonl");
  writeFileSync(reg, linea(REGISTRO[0]));
  const env = { ONIA_HOY: "2026-10-10", ONIA_PUBLICADO: reg, PATH: `${dobles}:${process.env.PATH}` };
  const man = b.imprimir("manana", env);
  assert.match(bloques(man).SIGUE, /📣 No pude leer el calendario de publicación\./);
  assert.doesNotMatch(man, /Para grabar hoy|plan viejo/);
  const { PASÓ } = bloques(b.imprimir("noche", env));
  assert.match(PASÓ, /📣 No pude leer el registro de publicaciones: no sé qué salió hoy\./);
  assert.doesNotMatch(PASÓ, /no hay nada publicado/);
});

test("un día de descanso en el calendario lo dice, y no vuelve a los guiones viejos", () => {
  const b = banco({ repo: repoConCalendario({ "CALENDARIO-PUBLICACION-12-18-OCT.md": "| Día | Carrusel 16:00 | Video A · 12:30 |\n|---|---|---|\n| **Mié 14** | — | — |\n" }) });
  const man = b.imprimir("manana", { ONIA_HOY: "2026-10-14" });
  assert.match(bloques(man).SIGUE, /📣 Hoy no sale nada según el calendario\./);
  assert.doesNotMatch(man, /Para grabar hoy/);
  assert.match(b.imprimir("noche", { ONIA_HOY: "2026-10-13" }), /📣 Mañana no sale nada según el calendario\./);
});

test("el calendario casa la fila por el número de día: sin tilde, en NFD o con la fecha pegada", () => {
  const nfd = "| Día | Carrusel 16:00 |\n|---|---|\n| **Sab 24** | SIN-TILDE |\n| **Dom 25-oct** | PEGADA |\n".normalize("NFD");
  const b = banco({ repo: repoConCalendario({ "CALENDARIO-PUBLICACION-23-29-OCT.md": nfd }) });
  assert.match(b.imprimir("manana", { ONIA_HOY: "2026-10-24" }), /• 16:00 Carrusel · SIN-TILDE/);
  assert.match(b.imprimir("manana", { ONIA_HOY: "2026-10-25" }), /• 16:00 Carrusel · PEGADA/);
  assert.match(b.imprimir("manana", { ONIA_HOY: "2026-10-26" }), /📣 El calendario de publicación no tiene la fila de hoy\./);
});

test("un calendario que cruza de mes y de año (28-3-ENE) cubre el 30 de diciembre", () => {
  const b = banco({ repo: repoConCalendario({ "CALENDARIO-PUBLICACION-28-3-ENE.md": "| Día | Carrusel 16:00 |\n|---|---|\n| **Mié 30** | FIN-DE-AÑO |\n| **Sáb 2** | ENERO |\n" }) });
  assert.match(b.imprimir("manana", { ONIA_HOY: "2026-12-30" }), /• 16:00 Carrusel · FIN-DE-AÑO/);
  assert.match(b.imprimir("manana", { ONIA_HOY: "2027-01-02" }), /• 16:00 Carrusel · ENERO/);
});

test("dos calendarios que cubren el mismo día: gana el que empieza después (el más nuevo)", () => {
  // 5-14-OCT ordena antes que 9-16-OCT: con «el primero que cubre», ganaba el viejo.
  const b = banco({ repo: repoConCalendario({ "CALENDARIO-PUBLICACION-5-14-OCT.md": "| Día | Carrusel 16:00 |\n|---|---|\n| **Sáb 10** | VIEJO |\n" }) });
  const msg = b.imprimir("manana", { ONIA_HOY: "2026-10-10" });
  assert.match(msg, /• 16:00 Carrusel · HOOK \(K11\)/);
  assert.doesNotMatch(msg, /VIEJO/);
});

// ── Lo que nadie empuja: relojes y colas paradas (10-oct, HERMES_ROL_QA.md Q4) ──────────
// Había cinco fechas en 25 días (el SIN el 13-oct, el token de Lucía, la pauta del 16, el SIAT el
// 4-nov) y ninguna alarma saltaba. El resumen las lee de la tabla §G de la madre.

const MADRE = `# Cola · MADRE

## A. En curso
| Fecha | Qué | Dueño | Fuente |
|---|---|---|---|
| 1-oct | Una tabla de otra sección no es un reloj | SU | x |

## G. Relojes (fechas que nadie empujaba)
| Fecha | Qué | Dueño | Fuente |
|---|---|---|---|
| jue 1-oct | Declaraciones del **SIN** (\`F-200\`) | SU / Leslie Mercado Moreno | memoria |
| 10-oct | Algo que vence en 10 días | SU | x |
| 26 al 28-sep | Un rango que terminó hace 2 días | Plat | x |
| 30-sep 23:57 La Paz | Vence hoy & a la noche | Ventas | x |
| sin fecha | Trámite del BCP | SU | x |

## H. Frentes
| Fecha | Qué | Dueño | Fuente |
|---|---|---|---|
| 30-sep | Fuera de la G | SU | x |
`;

test("relojes: el de mañana sale, uno a 10 días no, uno vencido sale en rojo; los de él en NECESITO", () => {
  const b = banco({ repo: conMadre(repoPlanViejo(), MADRE) });
  const msg = b.imprimir("manana");
  const { PASÓ, NECESITO } = bloques(msg);
  // El día de la semana de la tabla no se repite: el 1-oct de 2026 es jueves, pero podría estar mal.
  assert.match(NECESITO, /⏰ <b>Vence pronto<\/b>\n• 1-oct, mañana: Declaraciones del SIN \(F-200\)\n/);
  assert.match(PASÓ, /⏰ <b>Vence pronto \(otros dueños\)<\/b>\n• 30-sep 23:57 La Paz, hoy: Vence hoy &amp; a la noche — Ventas\n• 🔴 26 al 28-sep, vencido hace 2 días: Un rango que terminó hace 2 días — Plat/);
  assert.doesNotMatch(NECESITO, /Plat|Ventas/, "los de otros dueños no le piden nada");
  assert.doesNotMatch(msg, /10 días|BCP|otra sección|Fuera de la G/, "ni lo lejano, ni lo sin fecha, ni lo de otra sección");
  assert.doesNotMatch(b.imprimir("noche", { ONIA_HOY: "2026-09-29" }), /⏰|🧊/, "es de la mañana, no del cierre");
});

test("relojes: rangos, otros formatos, lo hecho, lo lejano y lo que no entiende (revisión del 10-oct)", () => {
  const madre = `## G. Relojes
| Fecha | Qué | Dueño |
|---|---|---|
| 28 al 2-nov | RANGO-QUE-CRUZA | SU |
| 26-oct al 30-oct | EN-CURSO | SU |
| 28/10 | CON-BARRA | SU |
| 2026-10-29 | ISO | SU |
| 13 a 18-oct | OTRO-CONECTOR-VENCIDO | SU |
| 15-abr | LEJANO-DEL-AÑO-QUE-VIENE | SU |
| ~~27-oct~~ | TACHADO | SU |
| 27-oct | HECHO ✅ | SU |
| pronto | ILEGIBLE | Plat |
| — | GUION | SU |
`;
  const msg = banco({ repo: conMadre(repoPlanViejo(), madre) }).imprimir("manana", { ONIA_HOY: "2026-10-27" });
  const { PASÓ, NECESITO } = bloques(msg);
  assert.match(NECESITO, /• 26-oct al 30-oct, en curso \(termina en 3 días\): EN-CURSO\n/);
  assert.match(NECESITO, /• 28 al 2-nov, mañana: RANGO-QUE-CRUZA/, "el 28 de un «28 al 2-nov» es de octubre");
  assert.match(NECESITO, /• 28\/10, mañana: CON-BARRA/);
  assert.match(NECESITO, /• 2026-10-29, en 2 días: ISO/);
  assert.match(NECESITO, /• 🔴 13 a 18-oct, vencido hace 9 días: OTRO-CONECTOR-VENCIDO/, "un rango vence al terminar");
  assert.ok(NECESITO.indexOf("EN-CURSO") < NECESITO.indexOf("CON-BARRA") && NECESITO.indexOf("ISO") < NECESITO.indexOf("VENCIDO"),
    "primero lo que vence antes, después lo vencido");
  assert.match(PASÓ, /• ❓ pronto, no entiendo la fecha: ILEGIBLE — Plat/, "una fecha que no entiende no se calla");
  assert.doesNotMatch(msg, /LEJANO|TACHADO|HECHO|GUION/);
});

test("relojes: 5 por grupo como mucho, y lo que vence antes no queda tapado por lo vencido", () => {
  const filas = Array.from({ length: 7 }, (_, i) => `| ${i + 1}-oct | VIEJO-${i + 1} | SU |`).join("\n");
  const madre = `## G. Relojes\n| Fecha | Qué | Dueño |\n|---|---|---|\n${filas}\n| 21-oct | MAÑANA | SU |\n`;
  const necesito = bloques(banco({ repo: conMadre(repoPlanViejo(), madre) }).imprimir("manana", { ONIA_HOY: "2026-10-20" })).NECESITO;
  assert.match(necesito, /⏰ <b>Vence pronto<\/b>\n• 21-oct, mañana: MAÑANA\n• 🔴 7-oct, vencido hace 13 días: VIEJO-7\n/);
  const reloj = necesito.slice(necesito.indexOf("⏰")).split("\n\n")[0];
  assert.equal((reloj.match(/^• /gm) || []).length, 6, reloj);
  assert.match(necesito, /• … y 3 más \(cola\/loop\/madre\.md §G\)/);
});

test("relojes: una fecha sin año es la próxima (2-ene el 30-dic) salvo que haya pasado hace poco", () => {
  const madre = "## G. Relojes\n| Fecha | Qué | Dueño |\n|---|---|---|\n| 2-ene | Año nuevo | SU |\n| 20-dic | Ya pasó hace rato | Plat |\n";
  const msg = banco({ repo: conMadre(repoPlanViejo(), madre) }).imprimir("manana", { ONIA_HOY: "2026-12-30" });
  assert.match(bloques(msg).NECESITO, /• 2-ene, en 3 días: Año nuevo/);
  assert.match(bloques(msg).PASÓ, /• 🔴 20-dic, vencido hace 10 días: Ya pasó hace rato — Plat/);
});

test("sin la tabla de la madre, NECESITO no dice «De tu lado, nada pendiente.»: dice que no pudo leer los relojes", () => {
  const sinMadre = repoPlanViejo();
  writeFileSync(join(sinMadre, "hermes-content", "docs", "cola", "loop", "madre.md"), "# Cola · MADRE\n\n## A. Otra cosa\n");
  const b = banco({ repo: sinMadre, lista: "", show: "", parte: "✅ Todo en orden." });
  const necesito = bloques(b.imprimir("manana")).NECESITO;
  assert.match(necesito, /⏰ No pude leer los relojes de la madre \(cola\/loop\/madre\.md §G\): no sé qué vence\./);
  assert.doesNotMatch(necesito, /nada pendiente/);
});

// Un clon con colas commiteadas en fechas dadas. origin/main apunta al último commit.
function repoConColas(colas, ahora) {
  const dir = mkdtempSync(join(tmpdir(), "jarvis-colas-"));
  const git = (fecha, ...a) =>
    execFileSync("git", a, { cwd: dir, env: { ...process.env, GIT_AUTHOR_DATE: fecha, GIT_COMMITTER_DATE: fecha }, encoding: "utf8" });
  git(ahora, "init", "-q");
  git(ahora, "config", "user.email", "t@t");
  git(ahora, "config", "user.name", "t");
  for (const [nombre, texto, fecha] of colas) {
    conMadre(dir, `${MADRE_LEJOS}<!-- ${fecha} -->\n`);  // la madre se mueve en cada commit: queda fresca
    writeFileSync(join(dir, "hermes-content", "docs", "cola", "loop", nombre), texto);
    git(fecha, "add", "-A");
    git(fecha, "commit", "-q", "-m", nombre);
  }
  git(ahora, "update-ref", "refs/remotes/origin/main", "HEAD");
  return dir;
}

test("colas paradas: nombra las que no tienen commit hace más de 24 h, y si se quedaron sin tareas", () => {
  const ahora = "2026-09-30T10:30:00Z";
  const dir = repoConColas([
    ["README.md", "protocolo\n", "2026-09-25T10:00:00Z"],
    ["a&b.md", "- [ ] x\n", "2026-09-28T10:00:00Z"],
    // Más de 64 KB con la tarea arriba: con «grep -q» y pipefail, git recibía SIGPIPE y salía «sin tareas».
    ["grande.md", "- [ ] tarea viva\n" + "relleno\n".repeat(40000), "2026-09-29T04:30:00Z"],
    ["hermes-jarvis.md", "- [x] hecha\n", "2026-09-28T08:00:00Z"],
    ["lucia.md", "- [x] hecha\n  - [ ] G2 pendiente\n", "2026-09-29T04:30:00Z"],
    ["plataforma.md", "- [ ] B1\n", "2026-09-30T09:30:00Z"],
  ], ahora);
  const { PASÓ } = bloques(banco({ repo: dir }).imprimir("manana", { ONIA_AHORA: ahora }));
  assert.match(PASÓ, /🧊 Colas sin movimiento en main hace más de 24 h: a&amp;b \(2 d\), grande \(30 h\), hermes-jarvis \(2 d, sin tareas\), lucia \(30 h\)\./);
  assert.doesNotMatch(PASÓ, /README|plataforma|madre \(|no trae main/);
});

test("si el clon dejó de traer main, lo dice antes de nombrar colas paradas", () => {
  const ahora = "2026-09-30T10:30:00Z";
  const dir = repoConColas([["lucia.md", "- [ ] x\n", "2026-09-30T09:00:00Z"]], ahora);
  const fh = join(dir, ".git", "FETCH_HEAD");
  writeFileSync(fh, "");
  const t = new Date("2026-09-30T01:30:00Z");
  utimesSync(fh, t, t);
  const { PASÓ } = bloques(banco({ repo: dir }).imprimir("manana", { ONIA_AHORA: ahora }));
  assert.match(PASÓ, /🧊 El clon del VPS no trae main hace 9 h \(el sincronizador no anda\): las colas pueden verse paradas sin estarlo\./);
});

test("los relojes salen de origin/main del clon, no de lo que quedó en el árbol", () => {
  const ahora = "2026-09-30T10:30:00Z";
  const dir = repoConColas([["lucia.md", "- [ ] x\n", "2026-09-30T09:00:00Z"]], ahora);
  const loop = join(dir, "hermes-content", "docs", "cola", "loop");
  writeFileSync(join(loop, "madre.md"), "## G. Relojes\n| Fecha | Qué | Dueño |\n|---|---|---|\n| 1-oct | DESDE-MAIN | SU |\n");
  execFileSync("git", ["commit", "-qam", "madre"], { cwd: dir, env: { ...process.env, GIT_AUTHOR_DATE: ahora, GIT_COMMITTER_DATE: ahora } });
  execFileSync("git", ["update-ref", "refs/remotes/origin/main", "HEAD"], { cwd: dir });
  writeFileSync(join(loop, "madre.md"), "## G. Relojes\n| Fecha | Qué | Dueño |\n|---|---|---|\n| 1-oct | DESDE-EL-ARBOL | SU |\n");
  const msg = banco({ repo: dir }).imprimir("manana", { ONIA_AHORA: ahora });
  assert.match(bloques(msg).NECESITO, /• 1-oct, mañana: DESDE-MAIN/);
  assert.doesNotMatch(msg, /DESDE-EL-ARBOL/);
});

test("sin historial de git en el clon, dice que no pudo ver las colas en vez de callarse", () => {
  assert.match(bloques(banco().imprimir("manana")).PASÓ, /🧊 No pude ver qué colas se pararon \(el clon no tiene origin\/main\)\./);
});

test("la voz de la mañana no lee los ⏰ ni los 🧊", () => {
  const b = banco({ repo: conMadre(repoPlanViejo(), MADRE) });
  b.correr("manana");
  const voz = readFileSync(join(b.out, "brief-hoy.txt"), "utf8");
  assert.match(voz, /Vence pronto/);
  assert.doesNotMatch(voz, /[⏰🧊]/u);
});

const AHORA_LAT = Date.parse("2026-09-30T10:30:00Z") / 1000;
function latidos(b, archivos) {
  const lat = mkdtempSync(join(b.dir, "latidos-"));
  for (const [n, t] of Object.entries(archivos)) writeFileSync(join(lat, n), t);
  return b.imprimir("manana", { ONIA_LATIDO_DIR: lat, ONIA_AHORA: "2026-09-30T10:30:00Z" });
}
const SANOS = {
  "aduana-soltar": `${AHORA_LAT - 120} 0 300\n`,
  "agenda-bloques": `${AHORA_LAT - 300} 0 1800\n`,
  "respuestas-pedidos": `${AHORA_LAT - 60} 0 120\n`,
  "resumen-noche": `${AHORA_LAT - 9 * 3600} 0 86400\n`,
  "qa-release": `${AHORA_LAT - 600} 0 900\n`,
};

test("trabajos mudos o con error: el mudo, el que falló, el ilegible y el de hora futura", () => {
  const msg = latidos(banco(), {
    ...SANOS,
    "aduana-soltar": `${AHORA_LAT - 4 * 3600} 0 300\n`,        // cada 5 min, hace 4 h: mudo
    "agenda-bloques": `${AHORA_LAT - 300} 2 1800\n`,           // al día, pero falló
    "respuestas-pedidos": `0${AHORA_LAT - 60} 0 120\n`,        // con un cero adelante: bash lo leía en octal
    "resumen-manana": `${AHORA_LAT + 3600} 0 86400\n`,         // el reloj del VPS se atrasó
    ".aduana-soltar.123.tmp": "1 0 1\n",                       // a medio escribir: no se lee
  });
  assert.match(bloques(msg).PASÓ, /🫀 Trabajos mudos o con error: resumen-manana \(latido con hora del futuro: revisar el reloj del VPS\), aduana-soltar \(mudo: corrió hace 4 h, corre cada 5 min\), agenda-bloques \(falló: código 2\), respuestas-pedidos \(latido ilegible\)\./);
  assert.doesNotMatch(msg, /resumen-noche|\.tmp/);
});

test("un trabajo frecuente que nunca dejó latido sale; uno que ya no existe, no", () => {
  const { "respuestas-pedidos": _, ...sinPedidos } = SANOS;
  const msg = latidos(banco(), { ...sinPedidos, "trabajo-de-antes": `${AHORA_LAT - 9e5} 0 60\n` });
  assert.match(bloques(msg).PASÓ, /🫀 Trabajos mudos o con error: respuestas-pedidos \(sin latido: nunca corrió\)\./);
  assert.doesNotMatch(msg, /trabajo-de-antes/, "un archivo viejo de un trabajo renombrado no queda mudo para siempre");
});

test("sin latidos (antes de aplicar) o con todos sanos, no dice nada", () => {
  const b = banco();
  assert.doesNotMatch(b.imprimir("manana"), /🫀/, "sin la carpeta");
  assert.doesNotMatch(latidos(b, SANOS), /🫀/, "sanos, y sin el de la mañana, que es el que está corriendo");
});

// ── Las tareas que Hermes carga en la orquesta (20-oct, PR #252) ───────────────────────────
// Las que esperan su ok (para empezar o de la entrega) y las bloqueadas van en NECESITO, mañana y noche.
// En PASÓ (el aviso que deja la aduana) «Nada.» mentía: lo encontró la revisión del PR.

// Solo el bloque NECESITO (sin exigir que PASÓ y SIGUE tengan algo, como bloques()).
const necesitoDe = (msg) => {
  const m = msg.match(/<b>NECESITO<\/b>\n([\s\S]*?)(?=\n<b>SIGUE<\/b>|$)/);
  assert.ok(m, msg);
  return m[1];
};

test("las tareas de la orquesta que lo esperan van en NECESITO; las demás no se nombran", () => {
  const b = banco();
  const orq = b.escribir(
    "orquesta.sh",
    `#!/usr/bin/env bash
[ "$1" = --lista ] || exit 9
printf '#260\tespera su ok para empezar\tmarca\tPublicar el carrusel de la semana\thttps://github.com/oninteligenciaartificial/onia-hermes/issues/260\n'
printf '#259\tbloqueada\tinvestigacion\tPrecios de la competencia\thttps://github.com/oninteligenciaartificial/onia-hermes/issues/259\n'
printf '#258\ten curso\tplataforma\tArreglar el alta\thttps://github.com/oninteligenciaartificial/onia-hermes/issues/258\n'
printf '#257\thecha\tinvestigacion\tOtra\thttps://github.com/oninteligenciaartificial/onia-hermes/issues/257\n'
`,
  );
  for (const modo of ["manana", "noche"]) {
    const msg = b.imprimir(modo, { ONIA_ORQUESTA: orq });
    const NECESITO = necesitoDe(msg);
    assert.match(NECESITO, /📋 <b>La orquesta te espera<\/b>\n• #260 Publicar el carrusel de la semana — espera su ok para empezar · https:\/\/github\.com\/\S+\/issues\/260\n• #259 Precios de la competencia — bloqueada · /, modo);
    assert.doesNotMatch(msg, /#258|#257/, `${modo}: en curso y hecha no le piden nada`);
    assert.doesNotMatch(NECESITO, /nada pendiente/, modo);
  }
});

test("orquesta: sin token (69) no se nombra; si no se pudo leer, se dice", () => {
  const b = banco();
  const apagada = b.escribir("orq-69.sh", "#!/usr/bin/env bash\nexit 69\n");
  assert.doesNotMatch(b.imprimir("noche", { ONIA_ORQUESTA: apagada }), /orquesta/i);
  const caida = b.escribir("orq-1.sh", "#!/usr/bin/env bash\nexit 1\n");
  const NECESITO = necesitoDe(b.imprimir("manana", { ONIA_ORQUESTA: caida }));
  assert.match(NECESITO, /No pude leer la cola de la orquesta/);
});

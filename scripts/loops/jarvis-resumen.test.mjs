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

function banco({ tableroVivo = true, tgFalla = false, show = SHOW, repo = REPO_REAL } = {}) {
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
  writeFileSync(join(dir, "lista.txt"), LISTA + "\n");
  writeFileSync(join(dir, "show.txt"), show + "\n");
  const tablero = escribir(
    "tablero.sh",
    tableroVivo
      ? `#!/usr/bin/env bash\n[ "$1" = list ] && { cat ${dir}/lista.txt; exit 0; }\n[ "$1" = show ] && { cat ${dir}/show.txt; exit 0; }\nexit 9\n`
      : `#!/usr/bin/env bash\nexit 1\n`,
  );
  writeFileSync(join(dir, "parte.txt"), PARTE);
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

test("lo primero que ve son los prospectos esperando, con quién y hace cuánto", () => {
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
  assert.match(msg, /⏳ <b>Sigue esperando<\/b>\n• 3 persona\(s\) sin respuesta\.\n• 1 decisión\(es\) tuya\(s\)\./);
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

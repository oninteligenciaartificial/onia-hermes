// hermes-jarvis-aplicar.test.mjs — `aplicar` es TODO O NADA, y Hermes lee lo nuevo.
//
// POR QUÉ EXISTE (2026-10-01). La sesión madre leyó el VPS antes de encender a Jarvis y encontró
// que aplicar «no se detiene ante fallas después del paso 0: si falla el calendario igual aplica
// crontab, pausas, apaga los 12 flujos y crea el interruptor; «Agenda hoy (Jarvis)» quedaría activo
// con el lector roto». Y que el gateway de Hermes no se reinicia, así que una skill nueva existe en
// disco y él no la conoce (su lista de skills era del 08-sep). Estos casos corren el aplicar.sh REAL
// contra un VPS simulado: las rutas de /root, /var/lib y /opt van a una carpeta temporal, y crontab,
// curl (la API de n8n), systemctl, el CLI de Hermes y el lector de calendario son dobles que anotan
// lo que se les pide.
//
// Se corre con: node --test scripts/loops/hermes-jarvis-aplicar.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync, execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, chmodSync, existsSync, readdirSync, copyFileSync, unlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, "..", "..");
const DIR = join(RAIZ, "hermes-content", "deploy", "hermes-jarvis");
const IDS_HERMES = ["9089322cc256", "4ac955b47726", "94f352c07554"];

function ejecutable(f, contenido) {
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, contenido);
  chmodSync(f, 0o755);
}

function vps({ leeCalendario = true, escribeCalendario = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "jarvis-vps-"));
  const F = join(dir, "fs");
  const R = join(F, "root");
  const bin = join(R, "bin");
  const dobles = join(dir, "dobles");
  const log = join(dir, "log");
  mkdirSync(log, { recursive: true });
  mkdirSync(join(R, ".hermes", "cron"), { recursive: true });
  mkdirSync(join(R, ".hermes", "skills", "productividad"), { recursive: true });
  mkdirSync(join(F, "opt"), { recursive: true });
  writeFileSync(join(F, "opt", "app.env"), "N8N_MANAGEMENT_API_KEY=llave-n8n\n");
  writeFileSync(join(R, ".hermes", "SOUL.md"), "# SOUL de Hermes\n");
  writeFileSync(
    join(R, ".hermes", "cron", "jobs.json"),
    JSON.stringify({ jobs: IDS_HERMES.map((id) => ({ id, enabled: true, state: "scheduled" })) }),
  );
  const crontabInicial = [
    `0 9 * * * ${bin}/onia-parte-diario.sh >> /var/log/x.log 2>&1`,
    `25 12 * * * ${bin}/onia-jarvis-voz.sh`,
    `*/10 * * * * ${bin}/onia-vigia-loops-remotos.sh`,
    `44 * * * * /bin/bash /x/sincronizar.sh`,
    "",
  ].join("\n");
  writeFileSync(join(dir, "crontab"), crontabInicial);

  // El repo del VPS: origin/main con las skills y el SOUL de este commit.
  const repo = join(R, "loops", "onia-hermes");
  for (const f of ["hermes-content/skills/agenda-calendario.md", "hermes-content/skills/pedir-a-claude.md", "hermes-content/deploy/hermes-agent/SOUL.md"]) {
    mkdirSync(dirname(join(repo, f)), { recursive: true });
    copyFileSync(join(RAIZ, f), join(repo, f));
  }
  const git = (...a) => execFileSync("git", ["-C", repo, ...a], { stdio: "pipe" });
  git("init", "-q");
  git("add", "-A");
  git("-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qm", "main");
  git("update-ref", "refs/remotes/origin/main", "HEAD");

  // El código de main ya copiado a /root/bin (lo que mira el paso 0).
  ejecutable(join(bin, "onia-jarvis-resumen.sh"), "#!/usr/bin/env bash\n# cierre-bloques · grupo NECESITO\necho 'vista previa del resumen'\n");
  ejecutable(join(bin, "onia-tg.sh"), `#!/usr/bin/env bash\n# ONIA_AVISO_PUEDO\nprintf '%s\\n---\\n' "$1" >> ${log}/telegram\n`);
  ejecutable(join(bin, "onia-vigia-aprobaciones.sh"), "#!/usr/bin/env bash\n# ONIA_AVISO_PUEDO\n");
  // El recolector de respuestas de los pedidos: --probar dice si el VPS llega a GitHub.
  ejecutable(join(bin, "onia-respuestas-pedidos.sh"), `#!/usr/bin/env bash\nbajar() { :; }\n[ "$1" = --probar ] || exit 0\necho "$ONIA_PEDIDOS_ESTADO" >> ${log}/respuestas-probar\n[ -z "\${RESPUESTAS_SIN_GITHUB:-}" ] || exit 1\necho "✅ llego a GitHub"\n`);
  ejecutable(join(bin, "claude-guardia.sh"), "#!/usr/bin/env bash\navisar() { :; }\n");
  ejecutable(
    join(bin, "onia-agenda.sh"),
    `#!/usr/bin/env bash
# ONIA_AGENDA_CAMBIOS_URL (lo busca el paso 0)
echo "$*" >> ${log}/agenda
case "$1" in
  --bloques) exit 0 ;;
  --ids)
    [ -f ${log}/movido ] && [ ! -f ${log}/cancelado ] && printf 'ev123\\t03:15\\t03:30\\t🧪 Prueba\\n'
    exit 0 ;;
  crear) rm -f ${log}/movido ${log}/cancelado
         [ "\${AGENDA_FALLA_ESCRITURA:-}" = 1 ] && { echo "403 forbidden"; exit 1; }
         ${escribeCalendario ? 'echo "✅ creado (id ev123)"; exit 0' : 'echo "403 forbidden"; exit 1'} ;;
  mover) touch ${log}/movido; exit 0 ;;
  cancelar) touch ${log}/cancelado; exit 0 ;;
  *) ${leeCalendario ? "echo '08:00–12:30 🎒 Colegio'; exit 0" : "exit 1"} ;;
esac
`,
  );

  // El comando de pedidos a Claude, con las rutas del VPS simulado (se agrega más abajo).
  const pedidoReal = join(RAIZ, "scripts", "loops", "pedido-claude.sh");

  // Dobles: crontab, curl (API de n8n), systemctl, sleep, y el python de Hermes.
  ejecutable(
    join(dobles, "crontab"),
    `#!/usr/bin/env bash\nif [ "$1" = -l ]; then cat ${dir}/crontab; else cp "$1" ${dir}/crontab; echo instalado >> ${log}/crontab-escrito; fi\n`,
  );
  ejecutable(join(dobles, "sleep"), "#!/usr/bin/env bash\nexit 0\n");
  ejecutable(
    join(dobles, "systemctl"),
    `#!/usr/bin/env bash
echo "$*" >> ${log}/systemctl
case "$1" in
  restart|start)
    ls ${R}/.hermes/skills/*/ ${R}/.hermes/skills 2>/dev/null > ${R}/.hermes/.skills_prompt_snapshot.json ;;
esac
exit 0
`,
  );
  ejecutable(
    join(dobles, "curl"),
    `#!/usr/bin/env bash
metodo=GET; url=""; w=""; o=""; prev=""
for a in "$@"; do
  [ "$prev" = -X ] && metodo="$a"
  [ "$prev" = -w ] && w="$a"
  [ "$prev" = -o ] && o="$a"
  case "$a" in http*) url="$a" ;; esac
  prev="$a"
done
echo "$metodo $url" >> ${log}/n8n
id=$(printf '%s' "$url" | sed -E 's#.*/workflows/([^/?]+).*#\\1#')
# Sin red para ESE flujo: curl no escribe nada, imprime 000 y sale 7.
if [ "$metodo" = POST ] && [ -n "\${N8N_SIN_RED_ID:-}" ] && [ "$id" = "\${N8N_SIN_RED_ID}" ]; then
  [ -n "$w" ] && printf 000; exit 7
fi
code=200; cuerpo=""
case "$metodo $url" in
  "POST "*/activate)
    if [ "$id" = "\${N8N_FLUJO_FALTA:-}" ]; then code=404; cuerpo='{"message":"Not Found"}'
    elif [ "\${N8N_ACTIVAR_FALLA:-}" = 1 ]; then code=500; cuerpo='{"message":"n8n no responde"}'
    else cuerpo='{"active": true}'; fi ;;
  "POST "*/deactivate) cuerpo='{"active": false}' ;;
  "POST "*/workflows) n=$(ls ${log}/creado-* 2>/dev/null | wc -l); touch ${log}/creado-$n; cuerpo="{\\"id\\": \\"wfnuevo$n\\"}" ;;
  "GET "*"?limit=1") cuerpo='{"data": []}' ;;
  "GET "*) if [ "$id" = "\${N8N_FLUJO_FALTA:-}" ]; then code=404; cuerpo='{"message":"Not Found"}'
          else cuerpo="{\\"id\\": \\"$id\\", \\"name\\": \\"Flujo $id\\", \\"active\\": true}"; fi ;;
esac
if [ -n "$o" ]; then printf '%s' "$cuerpo" > "$o"; else printf '%s\\n' "$cuerpo"; fi
[ -n "$w" ] && printf '%s' "$code"
exit 0
`,
  );
  const hpy = join(dobles, "hermes-python");
  ejecutable(
    hpy,
    `#!/usr/bin/env bash
# hermes_cli.main cron pause|resume <id>
[ "$3" = cron ] || exit 0
[ "$4" = resume ] && [ "\${HERMES_RESUME_FALLA:-}" = 1 ] && exit 1
python3 - "$4" "$5" <<'PY'
import json, os, sys
p = "${R}/.hermes/cron/jobs.json"
d = json.load(open(p))
for j in d["jobs"]:
    if j["id"] == sys.argv[2]:
        if sys.argv[1] == "pause":
            j["enabled"] = False; j["state"] = "paused"
        elif sys.argv[1] == "resume":
            # Un CLI «estricto»: reanudar algo que no está en pausa es un error (no está medido
            # qué hace el de verdad; el rollback no puede depender de eso).
            if os.environ.get("HERMES_RESUME_ESTRICTO") == "1" and j.get("state") != "paused":
                raise SystemExit(1)
            if os.environ.get("HERMES_RESUME_NO_HACE") == "1":
                break                       # dice que sí y no hace nada
            j["enabled"] = True; j["state"] = "scheduled"
        break
else:
    if sys.argv[1] == "resume" and os.environ.get("HERMES_RESUME_ESTRICTO") == "1":
        raise SystemExit(1)                 # estricto: reanudar algo que no existe también es error
json.dump(d, open(p, "w"))
PY
`,
  );

  const deVps = (t) =>
    t
      .replaceAll("/usr/local/lib/hermes-agent/venv/bin/python", hpy)
      .replaceAll("/opt/onia-platform/app.env", join(F, "opt", "app.env"))
      .replaceAll("/var/lib/onia-aviso", join(F, "var", "lib", "onia-aviso"))
      .replaceAll("/root/", R + "/")
      .replace(/HOME=\/root\b/g, `HOME=${R}`);
  ejecutable(join(bin, "onia-pedido-claude.sh"), deVps(readFileSync(pedidoReal, "utf8")).replaceAll("/var/lib/onia-pedidos", join(F, "var", "lib", "onia-pedidos")));
  const guion = (accion = "aplicar", cortarAntesDe = null) => {
    let a = deVps(readFileSync(join(DIR, `${accion}.sh`), "utf8"));
    if (cortarAntesDe) a = a.replace(cortarAntesDe, "exit 9 # la conexión se cortó acá\n" + cortarAntesDe);
    return `REDACTAR_SED='s/a^//'\nCOMMIT=abc1234\nHORAS=72\n` + deVps(readFileSync(join(DIR, "comun.sh"), "utf8")) + "\n" + a;
  };
  const correrAccion = (accion, env = {}, cortarAntesDe = null) =>
    spawnSync("bash", ["-s"], {
      input: guion(accion, cortarAntesDe),
      env: { ...process.env, PATH: `${dobles}:${process.env.PATH}`, ...env },
      encoding: "utf8",
      timeout: 60000,
    });
  const aplicar = (env = {}, cortarAntesDe = null) => correrAccion("aplicar", env, cortarAntesDe);
  const revertir = (env = {}) => correrAccion("revertir", env);
  const leer = (f) => (existsSync(join(log, f)) ? readFileSync(join(log, f), "utf8") : "");
  const crontab = () => readFileSync(join(dir, "crontab"), "utf8");
  const jobs = () => JSON.parse(readFileSync(join(R, ".hermes", "cron", "jobs.json"), "utf8")).jobs;
  const respaldos = () => readdirSync(join(R, "backups")).filter((d) => d.startsWith("hermes-jarvis-")).sort();
  const interruptor = () => existsSync(join(F, "var", "lib", "onia-aviso", "activo"));
  return { dir, R, F, log, dobles, aplicar, revertir, leer, crontab, jobs, respaldos, interruptor, crontabInicial };
}

const apagados = (n8n) => n8n.split("\n").filter((l) => l.startsWith("POST") && l.endsWith("/deactivate"));

test("si no puede LEER su calendario, no aplica nada y apaga el lector que acaba de crear", () => {
  const v = vps({ leeCalendario: false });
  const r = v.aplicar();
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /❌ NO APLIQUÉ NADA: no puedo LEER su calendario/);
  assert.equal(v.crontab(), v.crontabInicial, "el crontab no se toca");
  assert.equal(v.leer("crontab-escrito"), "");
  assert.ok(v.jobs().every((j) => j.enabled), "ningún trabajo de Hermes se pausa");
  assert.equal(v.interruptor(), false, "el interruptor no se prende");
  const off = apagados(v.leer("n8n"));
  assert.deepEqual(off.map((l) => l.split("/workflows/")[1]), ["wfnuevo0/deactivate"], "solo se apaga el lector que prendió esta corrida; los 12 no se tocan");
  assert.equal(v.leer("telegram"), "", "no le avisa nada");
  assert.equal(existsSync(join(v.R, ".hermes", "skills", "productividad", "agenda-calendario")), false);
});

test("si no puede CAMBIAR su calendario, tampoco aplica nada y apaga los dos flujos nuevos", () => {
  const v = vps({ escribeCalendario: false });
  const r = v.aplicar();
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /❌ NO APLIQUÉ NADA: agendar, mover y cancelar en su calendario no pasó la prueba/);
  assert.equal(v.crontab(), v.crontabInicial);
  assert.equal(v.interruptor(), false);
  const off = apagados(v.leer("n8n")).map((l) => l.split("/workflows/")[1]);
  assert.deepEqual(off.sort(), ["wfnuevo0/deactivate", "wfnuevo1/deactivate"]);
  assert.match(readFileSync(join(v.R, ".hermes", "SOUL.md"), "utf8"), /^# SOUL de Hermes\n$/, "su SOUL no cambia");
});

test("con todo en verde: aplica, reinicia el gateway, verifica que volvió y le avisa", () => {
  const v = vps();
  const r = v.aplicar();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /✅ requisitos en verde/);
  assert.match(v.crontab(), /onia-jarvis-resumen\.sh manana .* #jarvis/);
  assert.match(v.crontab(), /^#jarvis# .*onia-parte-diario\.sh/m);
  assert.ok(v.jobs().every((j) => !j.enabled && j.state === "paused"));
  assert.equal(apagados(v.leer("n8n")).length, 12, "los 12 flujos de reportes se apagan");
  assert.equal(v.interruptor(), true);
  assert.match(v.leer("systemctl"), /^restart hermes-gateway\.service$/m, "reinicio controlado por systemd");
  assert.match(r.stdout, /✅ gateway de Hermes reiniciado y vivo/);
  assert.match(r.stdout, /✅ su lista de skills ya nombra agenda-calendario/);
  assert.match(v.leer("telegram"), /Jarvis encendido/);
  assert.match(r.stdout, /pedidos a Claude APAGADOS: falta la llave/, "sin llave, los pedidos no se tocan");
  assert.equal(existsSync(join(v.R, ".hermes", "skills", "productividad", "pedir-a-claude")), false);
});

test("una segunda corrida sin cambios no reinicia a Hermes de gusto", () => {
  const v = vps();
  assert.equal(v.aplicar().status, 0);
  spawnSync("/bin/sleep", ["1.1"]); // el respaldo se nombra por segundo
  writeFileSync(join(v.log, "systemctl"), "");
  const r = v.aplicar();
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /no hace falta reiniciar/);
  assert.doesNotMatch(v.leer("systemctl"), /restart/);
});

test("revertir deshace por marcas, reanuda lo pausado y reinicia el gateway para que lea el SOUL de antes", () => {
  const v = vps();
  assert.equal(v.aplicar().status, 0);
  const bk = join(v.R, "backups", v.respaldos().at(-1));
  writeFileSync(join(v.log, "systemctl"), "");
  const r = spawnSync("bash", [join(bk, "rollback.sh")], {
    env: { ...process.env, PATH: `${join(v.dir, "dobles")}:${process.env.PATH}` },
    encoding: "utf8",
  });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(v.crontab().trim(), v.crontabInicial.trim());
  assert.match(r.stdout, /hermes: SOUL restaurado/);
  assert.match(v.leer("systemctl"), /^restart hermes-gateway\.service$/m);
  assert.equal(v.interruptor(), false);
});

test("una segunda corrida que falla en el calendario NO apaga lo que ya andaba", () => {
  const v = vps();
  assert.equal(v.aplicar().status, 0);
  spawnSync("/bin/sleep", ["1.1"]);
  writeFileSync(join(v.log, "n8n"), "");
  const r = v.aplicar({ AGENDA_FALLA_ESCRITURA: "1" });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /NO APLIQUÉ NADA/);
  assert.deepEqual(apagados(v.leer("n8n")), [], "los flujos de calendario que ya estaban activos siguen activos");
  assert.equal(v.interruptor(), true, "Jarvis sigue encendido como estaba");
  assert.match(v.crontab(), /#jarvis/);
});

test("con la llave de la rutina: instala la skill de pedidos, su regla y la llave (600), y reinicia a Hermes", () => {
  const v = vps();
  const r = v.aplicar({
    RUTINA_URL: "https://api.anthropic.com/v1/claude_code/routines/trig_01ABCdef/fire",
    RUTINA_TOKEN: "sk-ant-oat01-NO-SE-IMPRIME",
  });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.doesNotMatch(r.stdout + r.stderr, /NO-SE-IMPRIME/);
  const env = join(v.R, ".config", "onia", "pedidos.env");
  assert.equal((spawnSync("stat", ["-c", "%a", env], { encoding: "utf8" }).stdout || "").trim(), "600");
  assert.match(r.stdout, /✅ pedidos a Claude: configurado/);
  const skill = join(v.R, ".hermes", "skills", "pedir-a-claude", "SKILL.md");
  assert.ok(existsSync(skill), "la skill va junto a la del calendario");
  const soul = readFileSync(join(v.R, ".hermes", "SOUL.md"), "utf8");
  assert.equal((soul.match(/^## Pedidos a Claude/gm) || []).length, 1);
  assert.equal((soul.match(/^## Su calendario y el cierre del día/gm) || []).length, 1);
  assert.match(r.stdout, /✅ y nombra pedir-a-claude/);
  assert.match(v.leer("telegram"), /pedímelo: te llega el pedido con un código/);
});

test("si aplicar se corta a mitad (después de apagar los flujos), revertir lo encuentra y deja todo como estaba", () => {
  const v = vps();
  const r = v.aplicar({}, "# ── 5c. Que Hermes lo sepa usar");
  assert.equal(r.status, 9, r.stdout);
  assert.ok(v.jobs().every((j) => !j.enabled), "llegó a pausar");
  writeFileSync(join(v.log, "n8n"), "");
  const rev = v.revertir();
  assert.equal(rev.status, 0, rev.stdout + rev.stderr);
  assert.match(rev.stdout, /✅ revertido/);
  assert.equal(v.crontab().trim(), v.crontabInicial.trim());
  assert.ok(v.jobs().every((j) => j.enabled), "los trabajos de Hermes vuelven");
  const reactivados = v.leer("n8n").split("\n").filter((l) => l.endsWith("/activate") && !/wfnuevo/.test(l));
  assert.equal(reactivados.length, 12, "los 12 flujos vuelven");
  assert.equal(v.interruptor(), false);
});

test("si el rollback no puede deshacer algo, NO lo marca revertido y se puede reintentar", () => {
  const v = vps();
  assert.equal(v.aplicar().status, 0);
  const mal = v.revertir({ HERMES_RESUME_FALLA: "1" });
  assert.equal(mal.status, 1, mal.stdout);
  assert.match(mal.stdout, /NO lo marco como revertido/);
  const bien = v.revertir();
  assert.equal(bien.status, 0, bien.stdout);
  assert.ok(v.jobs().every((j) => j.enabled));
});

test("llave de pedidos con URL válida y token vacío: sale 1 sin tocar nada", () => {
  const v = vps();
  const r = v.aplicar({ RUTINA_URL: "https://api.anthropic.com/v1/claude_code/routines/trig_01ABCdef/fire", RUTINA_TOKEN: "" });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /NO APLIQUÉ NADA/);
  assert.equal(v.crontab(), v.crontabInicial);
  assert.equal(v.interruptor(), false);
  assert.ok(v.jobs().every((j) => j.enabled));
});

test("si falta uno de los 12 flujos o el SOUL de Hermes, no aplica nada", () => {
  const sinSoul = vps();
  spawnSync("rm", ["-f", join(sinSoul.R, ".hermes", "SOUL.md")]);
  assert.equal(sinSoul.aplicar().status, 1);
  assert.equal(sinSoul.crontab(), sinSoul.crontabInicial);
  const sinFlujo = vps();
  const r = sinFlujo.aplicar({ N8N_FLUJO_FALTA: "QGXVyRSgrArxfolj" });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /no encontré en n8n el flujo QGXVyRSgrArxfolj/);
  assert.equal(sinFlujo.crontab(), sinFlujo.crontabInicial);
});


test("si falta uno de los 3 trabajos de Hermes en jobs.json, no aplica nada (antes salía «ya estaba: ?» y seguía)", () => {
  const v = vps();
  writeFileSync(
    join(v.R, ".hermes", "cron", "jobs.json"),
    JSON.stringify({ jobs: IDS_HERMES.slice(1).map((id) => ({ id, enabled: true, state: "scheduled" })) }),
  );
  const r = v.aplicar();
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /no encontré en \S*jobs\.json el trabajo 9089322cc256/);
  assert.match(r.stdout, /NO APLIQUÉ NADA/);
  assert.equal(v.crontab(), v.crontabInicial, "el crontab no se toca");
  assert.equal(v.interruptor(), false, "el interruptor no se prende");
  assert.ok(v.jobs().every((j) => j.enabled), "ningún trabajo de Hermes se pausa");
});

test("revertir reintentado no tropieza con lo que ya volvió (un CLI que falla al reanudar algo activo)", () => {
  const v = vps();
  assert.equal(v.aplicar().status, 0);
  // Primera vuelta: Hermes vuelve, pero n8n no reactiva los 12 flujos -> no se marca revertido.
  const mal = v.revertir({ N8N_ACTIVAR_FALLA: "1" });
  assert.equal(mal.status, 1, mal.stdout);
  assert.ok(v.jobs().every((j) => j.enabled), "Hermes ya volvió en la primera vuelta");
  // Segunda vuelta con un CLI estricto: reanudar lo que ya está activo daría error.
  const bien = v.revertir({ HERMES_RESUME_ESTRICTO: "1" });
  assert.equal(bien.status, 0, bien.stdout);
  assert.match(bien.stdout, /ya estaba activo/);
  assert.match(bien.stdout, /✅ revertido/);
  assert.equal(v.crontab().trim(), v.crontabInicial.trim());
  assert.equal(v.interruptor(), false);
});

test("revertir no se traba con un trabajo de Hermes que ya no existe (nada que reanudar no es un error)", () => {
  const v = vps();
  assert.equal(v.aplicar().status, 0);
  const sinUno = v.jobs().filter((j) => j.id !== "9089322cc256");
  writeFileSync(join(v.R, ".hermes", "cron", "jobs.json"), JSON.stringify({ jobs: sinUno }));
  const r = v.revertir({ HERMES_RESUME_ESTRICTO: "1" });
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /9089322cc256 ya no está en jobs\.json/);
  assert.match(r.stdout, /✅ revertido/);
  assert.ok(v.jobs().every((j) => j.enabled), "los que siguen, vuelven");
});

test("token de la rutina con espacios (solo espacios o uno adentro): no aplica nada y no crea nada", () => {
  for (const token of ["   ", "sk-ant-oat01 mal pegado"]) {
    const v = vps();
    const r = v.aplicar({ RUTINA_URL: "https://api.anthropic.com/v1/claude_code/routines/trig_01ABCdef/fire", RUTINA_TOKEN: token });
    assert.equal(r.status, 1, r.stdout);
    assert.match(r.stdout, /NO APLIQUÉ NADA: .*antes de crear nada/);
    assert.equal(v.crontab(), v.crontabInicial, "el crontab no se toca");
    assert.equal(v.interruptor(), false);
    assert.ok(v.jobs().every((j) => j.enabled), "ningún trabajo de Hermes se pausa");
    assert.doesNotMatch(v.leer("n8n"), /^POST \S*\/workflows$/m, "no crea flujos en n8n");
    assert.doesNotMatch(v.leer("agenda"), /^crear /m, "no hay evento de prueba en su calendario");
  }
});

test("la llave se guarda citada: el archivo devuelve exactamente la URL y el token al leerlo", () => {
  const v = vps();
  const url = "https://api.anthropic.com/v1/claude_code/routines/trig_01ABCdef/fire";
  const token = "sk-ant-oat01-abc_DEF.123";
  assert.equal(v.aplicar({ RUTINA_URL: url, RUTINA_TOKEN: token }).status, 0);
  const env = join(v.R, ".config", "onia", "pedidos.env");
  const leido = spawnSync("bash", ["-c", `. '${env}'; printf '%s|%s' "$ONIA_RUTINA_URL" "$ONIA_RUTINA_TOKEN"`], { encoding: "utf8" }).stdout;
  assert.equal(leido, `${url}|${token}`);
});

test("revertir mira de vuelta: si Hermes dice que reanudó pero el trabajo sigue en pausa, no lo da por revertido", () => {
  const v = vps();
  assert.equal(v.aplicar().status, 0);
  const r = v.revertir({ HERMES_RESUME_NO_HACE: "1" });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /sigue en pausa después de reanudarlo/);
  const otra = v.revertir();
  assert.equal(otra.status, 0, otra.stdout);
  assert.ok(v.jobs().every((j) => j.enabled));
});

test("revertir: un flujo de n8n que ya no existe (404) no tiene nada que deshacer", () => {
  const v = vps();
  assert.equal(v.aplicar().status, 0);
  const r = v.revertir({ N8N_FLUJO_FALTA: "QGXVyRSgrArxfolj" });
  assert.equal(r.status, 0, r.stdout);
  assert.match(r.stdout, /QGXVyRSgrArxfolj ya no existe: nada que reactivar/);
  assert.match(r.stdout, /✅ revertido/);
});

test("si aplicar se corta justo después de pausar un trabajo de Hermes, revertir lo reanuda (se anota antes)", () => {
  const v = vps();
  const r = v.aplicar({}, '    despues=$(estado_job "$id")');
  assert.equal(r.status, 9, r.stdout);
  assert.ok(v.jobs().some((j) => !j.enabled), "quedó uno pausado");
  const rev = v.revertir();
  assert.equal(rev.status, 0, rev.stdout);
  assert.ok(v.jobs().every((j) => j.enabled), "volvió");
  assert.equal(v.crontab().trim(), v.crontabInicial.trim());
});

test("si una segunda corrida se corta entre «aplicado» y «reemplazado», revertir igual deja todo como estaba", () => {
  const v = vps();
  assert.equal(v.aplicar().status, 0);
  const r = v.aplicar({}, '[ -n "$PREVIO" ] && touch "$PREVIO/reemplazado"');
  assert.equal(r.status, 9, r.stdout);
  const rev = v.revertir();
  assert.equal(rev.status, 0, rev.stdout);
  assert.equal(v.crontab().trim(), v.crontabInicial.trim());
  assert.ok(v.jobs().every((j) => j.enabled));
  assert.equal(v.interruptor(), false);
});

// ── Revisión de la madre, 2-oct (antes de cargar la llave) ──────────────────────
const LLAVE = { RUTINA_URL: "https://api.anthropic.com/v1/claude_code/routines/trig_01ABCdef/fire", RUTINA_TOKEN: "sk-ant-oat01-abc" };
function cambiarMain(v, cambio) {
  const repo = join(v.R, "loops", "onia-hermes");
  const g = (...a) => execFileSync("git", ["-C", repo, ...a], { stdio: "pipe" });
  cambio(repo, g);
  g("-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qam", "cambio");
  g("update-ref", "refs/remotes/origin/main", "HEAD");
}
const nadaCreado = (v) => {
  assert.equal(v.crontab(), v.crontabInicial, "el crontab no se toca");
  assert.equal(v.interruptor(), false);
  assert.ok(v.jobs().every((j) => j.enabled), "ningún trabajo de Hermes se pausa");
  assert.doesNotMatch(v.leer("n8n"), /^POST \S*\/workflows$/m, "no crea flujos en n8n");
  assert.doesNotMatch(v.leer("agenda"), /^crear /m, "no hay evento de prueba en su calendario");
};

test("con llave, si a main le falta la skill de pedidos o su regla en el SOUL, no aplica nada (antes fallaba en 5d)", () => {
  const sinSkill = vps();
  cambiarMain(sinSkill, (repo, g) => g("rm", "-q", "hermes-content/skills/pedir-a-claude.md"));
  const r = sinSkill.aplicar(LLAVE);
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /no encontré la skill pedir-a-claude en origin\/main/);
  assert.match(r.stdout, /NO APLIQUÉ NADA: .*antes de crear nada/);
  nadaCreado(sinSkill);

  const sinRegla = vps();
  cambiarMain(sinRegla, (repo) => {
    const f = join(repo, "hermes-content/deploy/hermes-agent/SOUL.md");
    writeFileSync(f, readFileSync(f, "utf8").replace(/^## Pedidos a Claude/m, "## Otra cosa"));
  });
  const r2 = sinRegla.aplicar(LLAVE);
  assert.equal(r2.status, 1, r2.stdout);
  assert.match(r2.stdout, /no encontré la regla de los pedidos/);
  nadaCreado(sinRegla);
});

test("el formato fijo (Pasó · Necesito · Sigue) entra a su SOUL una sola vez, sin arrastrar lo que le sigue", () => {
  // Sergio Urcullo, 8-oct: «me entregás demasiado texto y me pierdo». aplicar copia del SOUL de main
  // solo las secciones que nombra: una regla escrita en otra sección nunca llegaba al VPS.
  const v = vps();
  const r = v.aplicar();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /✅ regla del formato agregada al SOUL de Hermes/);
  spawnSync("/bin/sleep", ["1.1"]); // el respaldo se nombra por segundo
  assert.equal(v.aplicar().status, 0);
  const soul = readFileSync(join(v.R, ".hermes", "SOUL.md"), "utf8");
  assert.equal((soul.match(/^## Formato fijo de cada mensaje/gm) || []).length, 1);
  assert.match(soul, /\*\*Pasó\*\*[\s\S]*\*\*Necesito\*\*[\s\S]*\*\*Sigue\*\*/);
  assert.doesNotMatch(soul, /^## Qué ES Onia hoy/m, "solo esa sección, hasta su «---»");
});

test("sección 0: con el resumen de antes del formato fijo en /root/bin, no aplica nada", () => {
  // Revisión del 9-oct: el SOUL le dice a Hermes que el resumen ya llega en tres bloques; con el
  // resumen viejo corriendo, eso sería falso.
  const v = vps();
  writeFileSync(join(v.R, "bin", "onia-jarvis-resumen.sh"), "#!/usr/bin/env bash\n# cierre-bloques\n");
  const r = v.aplicar();
  assert.equal(r.status, 1, r.stdout);
  nadaCreado(v);
});

test("con la regla del calendario ya en su SOUL, el paso del formato toma su propio respaldo y revertir lo deja exacto", () => {
  // Revisión del 9-oct: en las otras pruebas el respaldo lo toma siempre el paso del calendario.
  // En el VPS de verdad el SOUL ya puede tener esa regla: el respaldo es del paso del formato.
  const v = vps();
  const soulPath = join(v.R, ".hermes", "SOUL.md");
  const main = readFileSync(join(RAIZ, "hermes-content/deploy/hermes-agent/SOUL.md"), "utf8");
  const cal = main.slice(main.indexOf("## Su calendario y el cierre del día"));
  const inicial = "# SOUL de Hermes\n\n---\n\n" + cal.split(/^---$/m)[0];
  writeFileSync(soulPath, inicial);
  const r = v.aplicar();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /su SOUL ya tenía la regla del calendario/);
  assert.match(r.stdout, /✅ regla del formato agregada al SOUL de Hermes/);
  const bk = join(v.R, "backups", v.respaldos().at(-1), "SOUL.md.antes");
  assert.equal(readFileSync(bk, "utf8"), inicial, "el respaldo es el SOUL de antes del formato");
  const rev = v.revertir();
  assert.equal(rev.status, 0, rev.stdout + rev.stderr);
  assert.equal(readFileSync(soulPath, "utf8"), inicial);
});

test("si a main le falta la regla del formato en el SOUL, no aplica nada", () => {
  const v = vps();
  cambiarMain(v, (repo) => {
    const f = join(repo, "hermes-content/deploy/hermes-agent/SOUL.md");
    writeFileSync(f, readFileSync(f, "utf8").replace(/^## Formato fijo de cada mensaje/m, "## Otra cosa"));
  });
  const r = v.aplicar();
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /no encontré la regla del formato en el SOUL de origin\/main/);
  nadaCreado(v);
});

test("con llave, si el comando de pedidos no la acepta (--estado), no aplica nada", () => {
  const v = vps();
  writeFileSync(join(v.R, "bin", "onia-pedido-claude.sh"), "#!/usr/bin/env bash\ncandado() { :; }\nSELLOS=x\n[ \"$1\" = --estado ] && exit 69\nexit 0\n");
  const r = v.aplicar(LLAVE);
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /no acepta la llave de la rutina \(--estado\)/);
  nadaCreado(v);
  assert.equal(existsSync(join(v.R, ".config", "onia", "pedidos.env")), false, "la llave no quedó guardada");
});

test("sección 0: sin el recolector, o con el comando de pedidos sin su candado, no aplica nada", () => {
  // Madre, 2-oct: con la llave cargada y el comando viejo (o sin copiar), aplicar salía 0 con los
  // pedidos apagados. Ahora la sección 0 lo exige, como al resto de las herramientas.
  const sinRecolector = vps();
  unlinkSync(join(sinRecolector.R, "bin", "onia-respuestas-pedidos.sh"));
  const r = sinRecolector.aplicar(LLAVE);
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /El código de main todavía no está en \S*\/root\/bin/);
  nadaCreado(sinRecolector);
  assert.equal(existsSync(join(sinRecolector.R, "backups")), false, "ni siquiera el respaldo");

  const viejo = vps();
  writeFileSync(join(viejo.R, "bin", "onia-pedido-claude.sh"), "#!/usr/bin/env bash\n# sin candado\nexit 0\n");
  const r2 = viejo.aplicar();
  assert.equal(r2.status, 1, r2.stdout);
  assert.match(r2.stdout, /El código de main todavía no está en \S*\/root\/bin/);
  nadaCreado(viejo);

  // 5-oct, los MEDIUM de la madre v2: el comando sin sello o el recolector sin tope tampoco sirven.
  const sinSello = vps();
  writeFileSync(join(sinSello.R, "bin", "onia-pedido-claude.sh"), "#!/usr/bin/env bash\ncandado() { :; }\nexit 0\n");
  const r3 = sinSello.aplicar(LLAVE);
  assert.equal(r3.status, 1, r3.stdout);
  assert.match(r3.stdout, /El código de main todavía no está en \S*\/root\/bin/);
  nadaCreado(sinSello);
  const sinTope = vps();
  writeFileSync(join(sinTope.R, "bin", "onia-respuestas-pedidos.sh"), "#!/usr/bin/env bash\n# --probar, sin tope\nexit 0\n");
  const r4 = sinTope.aplicar(LLAVE);
  assert.equal(r4.status, 1, r4.stdout);
  assert.match(r4.stdout, /El código de main todavía no está en \S*\/root\/bin/);
  nadaCreado(sinTope);
});

test("con llave, si el VPS no llega a GitHub para recoger las respuestas, no aplica nada", () => {
  const sinGithub = vps();
  const r2 = sinGithub.aplicar({ ...LLAVE, RESPUESTAS_SIN_GITHUB: "1" });
  assert.equal(r2.status, 1, r2.stdout);
  assert.match(r2.stdout, /no llega a GitHub para recoger las respuestas/);
  nadaCreado(sinGithub);
  assert.match(sinGithub.leer("respuestas-probar"), /\/backups\/hermes-jarvis-[^/]+\/respuestas-prueba\n/, "la prueba no toca el estado real");
});

test("con llave: el cron del recolector entra con la marca, y revertir lo saca", () => {
  const v = vps();
  const r = v.aplicar(LLAVE);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(v.crontab(), /^\*\/2 \* \* \* \* \[ -x \S+\/bin\/onia-respuestas-pedidos\.sh \] && \S+\/bin\/onia-respuestas-pedidos\.sh >> \/var\/log\/onia-respuestas-pedidos\.log 2>&1 #jarvis$/m);
  assert.match(r.stdout, /la respuesta vuelve sola: onia-respuestas-pedidos\.sh/);
  assert.equal(v.revertir().status, 0);
  assert.doesNotMatch(v.crontab(), /onia-respuestas-pedidos/);
});

test("el token nunca queda escrito en un pedidos.env con otros permisos, ni un instante", () => {
  // Madre, 2-oct: con un pedidos.env previo en 644, el token se escribía ANTES del chmod.
  const v = vps();
  const env = join(v.R, ".config", "onia", "pedidos.env");
  mkdirSync(dirname(env), { recursive: true });
  writeFileSync(env, "viejo\n");
  chmodSync(env, 0o644);
  const chmodReal = execFileSync("bash", ["-c", "command -v chmod"], { encoding: "utf8" }).trim();
  ejecutable(
    join(v.dobles, "chmod"),
    `#!/usr/bin/env bash
for a in "$@"; do
  case "$a" in
    */pedidos.env) grep -q '${LLAVE.RUTINA_TOKEN}' "$a" 2>/dev/null && echo "token en $a con $(stat -c %a "$a")" >> ${v.log}/chmod-tarde ;;
  esac
done
exec ${chmodReal} "$@"
`,
  );
  assert.equal(v.aplicar(LLAVE).status, 0);
  assert.equal(v.leer("chmod-tarde"), "", "el token se escribió antes de cerrar el archivo");
  assert.equal((spawnSync("stat", ["-c", "%a", env], { encoding: "utf8" }).stdout || "").trim(), "600");
  assert.match(readFileSync(env, "utf8"), /ONIA_RUTINA_TOKEN=sk-ant-oat01-abc/);
});

test("un pedidos.env que ya estaba se cierra en 600 aunque no venga una llave nueva", () => {
  const v = vps();
  const env = join(v.R, ".config", "onia", "pedidos.env");
  mkdirSync(dirname(env), { recursive: true });
  writeFileSync(env, `ONIA_RUTINA_URL=${LLAVE.RUTINA_URL}\nONIA_RUTINA_TOKEN=${LLAVE.RUTINA_TOKEN}\n`);
  chmodSync(env, 0o644);
  const r = v.aplicar();
  assert.equal(r.status, 0, r.stdout);
  assert.equal((spawnSync("stat", ["-c", "%a", env], { encoding: "utf8" }).stdout || "").trim(), "600");
});

test("la llave queda en 600 aunque pedidos.env ya existiera con otros permisos", () => {
  const v = vps();
  const env = join(v.R, ".config", "onia", "pedidos.env");
  mkdirSync(dirname(env), { recursive: true });
  writeFileSync(env, "viejo\n");
  chmodSync(env, 0o644);
  assert.equal(v.aplicar(LLAVE).status, 0);
  assert.equal((spawnSync("stat", ["-c", "%a", env], { encoding: "utf8" }).stdout || "").trim(), "600");
});

test("revertir: si n8n no contesta (000) para un flujo, no lee la respuesta del anterior como «reactivado»", () => {
  const v = vps();
  assert.equal(v.aplicar().status, 0);
  const segundo = "OovRU4r0o7pvglJP"; // el anterior (QGXV…) sí se reactiva y deja su respuesta
  const r = v.revertir({ N8N_SIN_RED_ID: segundo });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, new RegExp(`no pude reactivar ${segundo} \\(HTTP 000\\)`));
  assert.doesNotMatch(r.stdout, new RegExp(`reactivado ${segundo}`));
});

test("el CI no deja la credencial de GitHub en el checkout", () => {
  const wf = readFileSync(join(RAIZ, ".github", "workflows", "hermes-jarvis-pruebas.yml"), "utf8");
  const i = wf.indexOf("uses: actions/checkout@");
  assert.ok(i >= 0, "hay un checkout");
  const resto = wf.slice(i);
  const paso = resto.slice(0, (resto.indexOf("\n      - ", 1) + 1 || resto.length + 1) - 1);
  assert.match(paso, /^\s+persist-credentials: false$/m);
  assert.doesNotMatch(wf, /runs-on:.*self-hosted/, "nunca en el runner del VPS");
});

// ── diagnostico: el recolector de respuestas de los pedidos (pendiente 6 del handoff, 9-oct) ──────
// Sin esto, una respuesta que no llegaba solo se veía entrando al VPS. Se corre la sección 12 del
// diagnostico.sh REAL con /var/log, /var/lib y /root llevados a una carpeta temporal.
function diagnosticoPedidos({ conCron = true, conLog = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "jarvis-diag-"));
  const F = join(dir, "fs");
  const EP = join(F, "var", "lib", "onia-pedidos");
  const LOG = join(F, "var", "log");
  mkdirSync(join(EP, "sellos"), { recursive: true });
  mkdirSync(LOG, { recursive: true });
  writeFileSync(join(EP, "sellos", "p_1a2b3c4d"), "0123456789abcdef0123456789abcdef\n");
  writeFileSync(join(EP, "respuestas.tsv"), "1759999999\tp_1a2b3c4d\tlisto\n");
  writeFileSync(join(EP, "rechazos-avisados.tsv"), "1759999999\tp_5e6f7a8b\n");
  const iso = (horas) => new Date(Date.now() - horas * 3600e3).toISOString().replace(/\.\d+Z$/, "Z");
  if (conLog) {
    writeFileSync(
      join(LOG, "onia-respuestas-pedidos.log"),
      [
        `${iso(100)} ✅ p_00000000: respuesta «listo» entregada a la aduana`, // fuera de la ventana de 72 h
        `${iso(5)} ✅ p_1a2b3c4d: respuesta «listo» entregada a la aduana`,
        `${iso(1)} ❌ no pude consultar GitHub`,
        "",
      ].join("\n"),
    );
  }
  const dobles = join(dir, "dobles");
  const linea = "*/2 * * * * [ -x /root/bin/onia-respuestas-pedidos.sh ] && /root/bin/onia-respuestas-pedidos.sh >> /var/log/onia-respuestas-pedidos.log 2>&1";
  ejecutable(join(dobles, "crontab"), `#!/usr/bin/env bash\n${conCron ? `echo '${linea}'` : "echo '#*/2 * * * * /root/bin/onia-respuestas-pedidos.sh'"}\n`);
  const diag = readFileSync(join(DIR, "diagnostico.sh"), "utf8");
  const s12 = diag.slice(diag.indexOf('sec "12.'), diag.indexOf('sec "fin"'));
  assert.ok(s12.length > 0, "no encontré la sección 12 del diagnóstico");
  const guion =
    `REDACTAR_SED='s/a^//'\n` +
    readFileSync(join(DIR, "comun.sh"), "utf8") +
    `\nDESDE=${iso(72)}\n` +
    s12.replaceAll("/var/log/", LOG + "/").replaceAll("/var/lib/onia-pedidos", EP).replaceAll("/root/", join(F, "root") + "/");
  return spawnSync("bash", ["-s"], { input: guion, env: { ...process.env, PATH: `${dobles}:${process.env.PATH}` }, encoding: "utf8" });
}

test("diagnóstico: muestra el recolector de respuestas (cron, la ventana y el final del log) sin leer un sello", () => {
  const r = diagnosticoPedidos();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /en el crontab: sí/);
  assert.match(r.stdout, /en la ventana: 1 entregada\(s\) · 1 con falla/);
  assert.match(r.stdout, /❌ no pude consultar GitHub/);
  assert.match(r.stdout, /respuestas\.tsv: 1 fila\(s\)/);
  assert.match(r.stdout, /rechazos-avisados\.tsv: 1 fila\(s\)/);
  assert.match(r.stdout, /sellos de pedidos abiertos: 1 \(no se leen\)/);
  assert.doesNotMatch(r.stdout + r.stderr, /0123456789abcdef/, "un sello nunca sale en el diagnóstico");
});

test("diagnóstico: sin la línea del cron (o comentada) y sin log, lo dice", () => {
  const r = diagnosticoPedidos({ conCron: false, conLog: false });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /en el crontab: NO/);
  assert.match(r.stdout, /no existe .*onia-respuestas-pedidos\.log/);
});

// ── diagnostico: lo publicado y lo agendado (9-oct; GOAL del 8-oct: una pieza por día) ──────────────
// Corre la sección 13 del diagnostico.sh REAL con /root llevado a una carpeta temporal y un systemctl
// de mentira. Solo lectura: lista, no toca nada.
function diagnosticoPublicaciones({ conRegistro = true } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "jarvis-diag-pub-"));
  const F = join(dir, "fs");
  const pub = join(F, "root", "publicar");
  mkdirSync(pub, { recursive: true });
  // Fechas fijas: la sección mira desde DESDE, no desde «ahora», y así el conteo por día no depende
  // de la hora en que corre la prueba.
  if (conRegistro) {
    writeFileSync(
      join(pub, "publicado.jsonl"),
      [
        { cuenta: "sergio", media: "1", trial: null, permalink: "https://www.instagram.com/reel/VIEJO/", timestamp: "2026-10-05T16:00:00+0000" },
        { cuenta: "sergio", media: "2", trial: null, permalink: "https://www.instagram.com/reel/NUEVO/", timestamp: "2026-10-09T16:31:00+0000" },
        { cuenta: "sergio", media: "3", tipo: "carrusel", permalink: "https://www.instagram.com/p/CAR/", timestamp: "2026-10-09T20:00:00+0000" },
        { red: "youtube", id: "e", url: "https://youtu.be/ENSAYO", privacidad: "private", fecha: "2026-10-09T21:00:00.000Z" },
        { red: "buffer", canal: "c1", post: "p9", estado: "agendado", cuando: "2026-10-10T16:35:00.000Z", fecha: "2026-10-09T21:05:00.000Z" },
      ].map((r) => JSON.stringify(r)).join("\n") + "\n{roto\n",
    );
  }
  const dobles = join(dir, "dobles");
  ejecutable(join(dobles, "systemctl"), `#!/usr/bin/env bash\necho "$*" >> ${dir}/systemctl.log\necho 'Sat 2026-10-10 16:30:00 UTC 1h left - - pub-n07.timer pub-n07.service'\n`);
  const diag = readFileSync(join(DIR, "diagnostico.sh"), "utf8");
  const s13 = diag.slice(diag.indexOf('sec "13.'), diag.indexOf('sec "fin"'));
  assert.ok(s13.length > 0, "no encontré la sección 13 del diagnóstico");
  const guion =
    `REDACTAR_SED='s/a^//'\n` + readFileSync(join(DIR, "comun.sh"), "utf8") + `\nDESDE=2026-10-06T12:00:00Z\n` + s13.replaceAll("/root/", join(F, "root") + "/");
  const r = spawnSync("bash", ["-s"], { input: guion, env: { ...process.env, PATH: `${dobles}:${process.env.PATH}` }, encoding: "utf8" });
  return { r, systemctl: existsSync(join(dir, "systemctl.log")) ? readFileSync(join(dir, "systemctl.log"), "utf8") : "" };
}

test("diagnóstico: lo publicado en la ventana, con link y por día, y lo agendado, sin tocar nada", () => {
  const { r, systemctl } = diagnosticoPublicaciones();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /10-09 12:31 Reel · https:\/\/www\.instagram\.com\/reel\/NUEVO\//);
  assert.match(r.stdout, /Carrusel · https:\/\/www\.instagram\.com\/p\/CAR\//);
  assert.match(r.stdout, /YouTube \(private\) · https:\/\/youtu\.be\/ENSAYO/, "el ensayo privado se ve como tal");
  assert.match(r.stdout, /Buffer agendado · p9/);
  assert.doesNotMatch(r.stdout, /VIEJO/, "lo de antes de la ventana no sale");
  assert.match(r.stdout, /publicadas por día \(La Paz, Instagram y YouTube público\): 10-09: 2$/m);
  assert.match(r.stdout, /pub-n07\.timer/);
  assert.match(systemctl, /^list-timers pub-\* --all --no-pager$/m);
  assert.doesNotMatch(systemctl, /^(start|stop|restart|enable|disable)/m, "solo lectura");
});

test("diagnóstico: sin registro de publicaciones, lo dice", () => {
  const { r } = diagnosticoPublicaciones({ conRegistro: false });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /no existe .*publicado\.jsonl/);
});

// ── diagnostico: qué secciones del SOUL le faltan a Hermes (9-oct) ─────────────────────────────────
// `aplicar` copia del SOUL del repo solo las secciones que nombra. Para decidir qué más copiar hay que
// ver qué tiene el SOUL del VPS. Sección 14, solo lectura: títulos `##` del VPS contra origin/main.
test("diagnóstico: lista las secciones del SOUL de main que le faltan al SOUL del VPS", () => {
  const v = vps();
  writeFileSync(join(v.R, ".hermes", "SOUL.md"), "# SOUL viejo\n\n## Quién sos y cuál es tu oficio\n\ntexto\n\n## Su calendario y el cierre del día\n\nmás\n");
  const diag = readFileSync(join(DIR, "diagnostico.sh"), "utf8");
  const s14 = diag.slice(diag.indexOf('sec "14.'), diag.indexOf('sec "fin"'));
  assert.ok(s14.length > 0, "no encontré la sección 14 del diagnóstico");
  const guion = `REDACTAR_SED='s/a^//'\n` + readFileSync(join(DIR, "comun.sh"), "utf8") + "\n" + s14.replaceAll("/root/", v.R + "/");
  const antes = readFileSync(join(v.R, ".hermes", "SOUL.md"), "utf8");
  const r = spawnSync("bash", ["-s"], { input: guion, encoding: "utf8" });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const faltan = r.stdout.slice(r.stdout.indexOf("--- de main, le faltan:"), r.stdout.indexOf("--- tiene y main no:"));
  assert.match(faltan, /## Formato fijo de cada mensaje/);
  assert.match(faltan, /## Pedidos a Claude/);
  assert.doesNotMatch(faltan, /## Su calendario y el cierre del día/, "la que ya tiene no falta");
  assert.match(r.stdout, /el SOUL del VPS tiene 2 sección\(es\)/);
  assert.match(r.stdout, /--- tiene y main no:\n\(ninguna\)/, "«Su calendario…» sin la fecha es la misma sección");
  assert.equal(readFileSync(join(v.R, ".hermes", "SOUL.md"), "utf8"), antes, "solo lectura");
});

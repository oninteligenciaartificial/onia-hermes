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
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, chmodSync, existsSync, readdirSync, copyFileSync, unlinkSync, rmSync, utimesSync } from "node:fs";
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

function vps({ leeCalendario = true, escribeCalendario = true, conLatido = true, conQa = true, tokenIssues = null } = {}) {
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
  for (const f of ["hermes-content/skills/agenda-calendario.md", "hermes-content/skills/pedir-a-claude.md",
                   "hermes-content/skills/planificar-orquesta.md", "hermes-content/deploy/hermes-agent/SOUL.md"]) {
    mkdirSync(dirname(join(repo, f)), { recursive: true });
    copyFileSync(join(RAIZ, f), join(repo, f));
  }
  const git = (...a) => execFileSync("git", ["-C", repo, ...a], { stdio: "pipe" });
  git("init", "-q");
  git("add", "-A");
  git("-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qm", "main");
  git("update-ref", "refs/remotes/origin/main", "HEAD");

  // El código de main ya copiado a /root/bin (lo que mira el paso 0).
  ejecutable(join(bin, "onia-jarvis-resumen.sh"), "#!/usr/bin/env bash\n# cierre-bloques · grupo NECESITO · nada pendiente\necho 'vista previa del resumen'\n");
  ejecutable(join(bin, "onia-tg.sh"), `#!/usr/bin/env bash\n# ONIA_AVISO_PUEDO\nprintf '%s\\n---\\n' "$1" >> ${log}/telegram\n`);
  ejecutable(join(bin, "onia-vigia-aprobaciones.sh"), "#!/usr/bin/env bash\n# ONIA_AVISO_PUEDO\n");
  // El recolector de respuestas de los pedidos: --probar dice si el VPS llega a GitHub.
  ejecutable(join(bin, "onia-respuestas-pedidos.sh"), `#!/usr/bin/env bash\nbajar() { :; }\n[ "$1" = --probar ] || exit 0\necho "$ONIA_PEDIDOS_ESTADO" >> ${log}/respuestas-probar\n[ -z "\${RESPUESTAS_SIN_GITHUB:-}" ] || exit 1\necho "✅ llego a GitHub"\n`);
  ejecutable(join(bin, "claude-guardia.sh"), "#!/usr/bin/env bash\navisar() { :; }\n");
  // El envoltorio del latido (10-oct, Q4c): el de verdad, porque las líneas del crontab lo llaman.
  if (conLatido) ejecutable(join(bin, "onia-latido.sh"), readFileSync(join(AQUI, "latido.sh"), "utf8"));
  // El QA después de cada publicación (10-oct, Q5) y el onia-mirar.js que abre las pantallas.
  if (conQa) {
    ejecutable(join(bin, "onia-qa-release.sh"), "#!/usr/bin/env bash\nexit 0\n");
    writeFileSync(join(bin, "onia-mirar.js"), "// onia-mirar.js\n");
  }
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
# La unidad de usuario necesita el bus de root: sin XDG_RUNTIME_DIR, «systemctl --user» no llega (19-oct).
[ "$1" = --user ] && echo "\${XDG_RUNTIME_DIR:-}" >> ${log}/systemctl-xdg
a="$1"; [ "$a" = --user ] && a="$2"
case "$a" in
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
# hermes_cli.main cron pause|resume <id> · cron create <horario> <prompt> --skill S --name N --deliver D
[ "$3" = cron ] || exit 0
if [ "$4" = create ]; then
  if [ "$5" = --help ]; then
    [ -n "\${HERMES_SIN_CREATE:-}" ] && { echo "invalid choice: 'create'"; exit 2; }
    echo "usage: hermes cron create SCHEDULE PROMPT [--skill SKILL] [--name NAME] [--deliver TARGET]"; exit 0
  fi
  printf '%s\\n' "$*" >> ${log}/hermes-create
  python3 - "$@" <<'PY'
import json, sys
a = sys.argv[1:]
p = "${R}/.hermes/cron/jobs.json"
d = json.load(open(p))
d["jobs"].append({"id": "orq%03d" % len(d["jobs"]), "name": a[a.index("--name") + 1], "enabled": True,
                  "state": "scheduled", "schedule": a[4], "deliver": a[a.index("--deliver") + 1]})
json.dump(d, open(p, "w"))
PY
  exit 0
fi
[ "$4" = resume ] && [ "\${HERMES_RESUME_FALLA:-}" = 1 ] && exit 1
[ "$4" = pause ] && [ -n "\${HERMES_PAUSE_NO_HACE:-}" ] && [ "$5" = "\${HERMES_PAUSE_NO_HACE}" ] && exit 0   # dice que sí y no pausa
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
  // La orquesta (5e): el comando real, y el token de Issues solo si la prueba lo pide (lo deja Sergio Urcullo).
  ejecutable(join(bin, "onia-orquesta-hermes.sh"),
    deVps(readFileSync(join(AQUI, "orquesta-hermes.sh"), "utf8")).replaceAll("/var/lib/onia-orquesta-hermes", join(F, "var", "lib", "onia-orquesta-hermes")));
  if (tokenIssues !== null) {
    mkdirSync(join(R, ".config", "onia"), { recursive: true });
    writeFileSync(join(R, ".config", "onia", "gh-issues-token"), "github_pat_11ABCDEFG0NoSeImprimeNunca_" + "x".repeat(55) + "\n");
    chmodSync(join(R, ".config", "onia", "gh-issues-token"), tokenIssues);
  }
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
  assert.match(v.crontab(), /onia-jarvis-resumen\.sh manana' .* #jarvis/);
  assert.match(v.crontab(), /^#jarvis# .*onia-parte-diario\.sh/m);
  assert.ok(v.jobs().every((j) => !j.enabled && j.state === "paused"));
  assert.equal(apagados(v.leer("n8n")).length, 12, "los 12 flujos de reportes se apagan");
  assert.equal(v.interruptor(), true);
  assert.match(v.leer("systemctl"), /^--user restart hermes-gateway\.service$/m, "reinicio controlado de la unidad de USUARIO");
  assert.doesNotMatch(v.leer("systemctl"), /^(restart|start) hermes-gateway/m, "nunca la de sistema: arrancarla vuelve el bucle de 8.092 reinicios");
  assert.match(v.leer("systemctl-xdg"), /^\/run\/user\/0$/m);
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
  assert.match(v.leer("systemctl"), /^--user restart hermes-gateway\.service$/m);
  assert.doesNotMatch(v.leer("systemctl"), /^(restart|start) hermes-gateway/m, "revertir tampoco toca la de sistema");
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

test("el formato de cada mensaje entra a su SOUL una sola vez, sin arrastrar lo que le sigue", () => {
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
  assert.match(soul, /prosa normal y corta/);
  assert.doesNotMatch(soul, /^## Qué ES Onia hoy/m, "solo esa sección, hasta su «---»");
});

test("el formato del 8-oct (Pasó · Necesito · Sigue) se REEMPLAZA por el de main, sin tocar el resto del SOUL", () => {
  // Sergio Urcullo, 20-oct: «que hablen normal pero resumido y al grano». Con «agregar si falta», el
  // SOUL del VPS se quedaba con los tres bloques para siempre.
  const v = vps();
  const soulPath = join(v.R, ".hermes", "SOUL.md");
  const viejo = "## Formato fijo de cada mensaje (2026-10-08)\n\nCada mensaje tiene tres bloques:\n\n" +
    "- **Pasó**: qué pasó.\n- **Necesito**: lo que le pedís.\n- **Sigue**: qué viene.\n";
  const inicial = "# SOUL de Hermes\n\nAntes.\n\n---\n\n" + viejo + "\n---\n\n## Otra regla\n\nDespués.\n";
  writeFileSync(soulPath, inicial);
  const r = v.aplicar();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /✅ regla del formato actualizada en el SOUL de Hermes/);
  const soul = readFileSync(soulPath, "utf8");
  assert.equal((soul.match(/^## Formato fijo de cada mensaje/gm) || []).length, 1);
  assert.match(soul, /prosa normal y corta/);
  assert.doesNotMatch(soul, /\*\*Pasó\*\*|\*\*Necesito\*\*|\*\*Sigue\*\*/);
  assert.ok(soul.startsWith("# SOUL de Hermes\n\nAntes.\n\n---\n\n## Formato fijo de cada mensaje (2026-10-20)"), soul);
  assert.match(soul, /\n\n---\n\n## Otra regla\n\nDespués\.\n/, "lo que le sigue queda igual, con su «---»");
  spawnSync("/bin/sleep", ["1.1"]); // el respaldo se nombra por segundo
  const r2 = v.aplicar();
  assert.equal(r2.status, 0, r2.stdout + r2.stderr);
  assert.match(r2.stdout, /su SOUL ya tenía la regla del formato/);
  assert.equal(readFileSync(soulPath, "utf8"), soul, "la segunda vez no cambia nada");
  const bk = join(v.R, "backups", v.respaldos().at(-2), "SOUL.md.antes");
  assert.equal(readFileSync(bk, "utf8"), inicial, "el respaldo es el SOUL con el formato viejo");
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

test("sección 0: sin el comando de la orquesta, corre el sincronizador hasta dos veces y sigue", () => {
  // Medido el 20-oct: el sincronizador copia lo que bajó la vuelta ANTERIOR. La de las 20:44 UTC se
  // actualizó a sí misma y el comando de la orquesta no llegó. Acá la vuelta 1 trae el comando (lo
  // que ya estaba bajado) y la 2 el resumen sin rótulos (lo que bajó la 1).
  const v = vps({ tokenIssues: 0o600 });
  const bin = join(v.R, "bin");
  const guardado = join(v.log, "orquesta-bajada.sh");
  copyFileSync(join(bin, "onia-orquesta-hermes.sh"), guardado);
  rmSync(join(bin, "onia-orquesta-hermes.sh"));
  writeFileSync(join(bin, "onia-jarvis-resumen.sh"), "#!/usr/bin/env bash\n# cierre-bloques · grupo NECESITO\n");
  writeFileSync(join(bin, "onia-loops-sync.sh"), `#!/usr/bin/env bash
n=$(( $(cat ${v.log}/sync-vueltas 2>/dev/null || echo 0) + 1 )); echo "$n" > ${v.log}/sync-vueltas
cp -p ${guardado} ${bin}/onia-orquesta-hermes.sh
[ "$n" -lt 2 ] || printf '#!/usr/bin/env bash\\n# cierre-bloques · grupo NECESITO · nada pendiente\\necho vista\\n' > ${bin}/onia-jarvis-resumen.sh
echo "sincronizados"
`);
  chmodSync(join(bin, "onia-loops-sync.sh"), 0o755);
  const r = v.aplicar();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /vuelta 1 de 2[\s\S]*vuelta 2 de 2/);
  assert.equal(v.leer("sync-vueltas").trim(), "2");
  assert.match(r.stdout, /✅ .*QA de publicación y orquesta: al día/);
  assert.match(r.stdout, /✅ regla de la orquesta agregada al SOUL de Hermes/);
});

test("sección 0: si dos vueltas del sincronizador no traen el comando de la orquesta, no aplica nada", () => {
  const v = vps({ tokenIssues: 0o600 });
  rmSync(join(v.R, "bin", "onia-orquesta-hermes.sh"));
  const r = v.aplicar();
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, /❌ El código de main todavía no está en /);
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
  assert.match(v.crontab(), /^\*\/2 \* \* \* \* \S+\/bin\/onia-latido\.sh respuestas-pedidos 120 '\[ ! -x \S+\/bin\/onia-respuestas-pedidos\.sh \] \|\| \S+\/bin\/onia-respuestas-pedidos\.sh' >> \/var\/log\/onia-respuestas-pedidos\.log 2>&1 #jarvis$/m);
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
  const inicio12 = diag.indexOf('sec "12.');
  const s12 = diag.slice(inicio12, diag.indexOf('\nsec "', inicio12 + 1));
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
  const inicio13 = diag.indexOf('sec "13.');
  const s13 = diag.slice(inicio13, diag.indexOf('\nsec "', inicio13 + 1));
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
  const inicio14 = diag.indexOf('sec "14.');
  const s14 = diag.slice(inicio14, diag.indexOf('\nsec "', inicio14 + 1));
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

// ── El latido de cada trabajo que agrega aplicar (10-oct, HERMES_ROL_QA.md Q4c) ────────────
// Antes, un trabajo mudo y uno sano se veían igual: los dos no decían nada.

const LATIDO = join(AQUI, "latido.sh");
function correrLatido(args, env = {}) {
  const dir = mkdtempSync(join(tmpdir(), "latido-"));
  const r = spawnSync("bash", [LATIDO, ...args], { env: { ...process.env, ONIA_LATIDO_DIR: join(dir, "lat"), ...env }, encoding: "utf8" });
  const leer = (n) => (existsSync(join(dir, "lat", n)) ? readFileSync(join(dir, "lat", n), "utf8") : null);
  return { ...r, dir, leer };
}

test("latido: corre el comando, sale con SU código y anota «epoch código cadencia»", () => {
  const ok = correrLatido(["aduana-soltar", "300", "ONIA_X=hola sh -c 'echo $ONIA_X'"]);
  assert.equal(ok.status, 0);
  assert.equal(ok.stdout, "hola\n", "el comando corre entero, con su variable");
  assert.match(ok.leer("aduana-soltar"), /^\d{10} 0 300\n$/);
  const mal = correrLatido(["agenda-bloques", "1800", "exit 3"]);
  assert.equal(mal.status, 3, "el código del trabajo no se pierde");
  assert.match(mal.leer("agenda-bloques"), /^\d{10} 3 1800\n$/);
});

test("latido: nunca rompe el trabajo, ni con un nombre inválido ni sin dónde escribir", () => {
  const raro = correrLatido(["../etc/x", "300", "echo corrió; exit 4"]);
  assert.equal(raro.status, 4);
  assert.equal(raro.stdout, "corrió\n");
  assert.match(raro.stderr, /inválidos: corrió sin latido/);
  assert.equal(existsSync(join(raro.dir, "lat")), false, "un nombre inválido no escribe nada");
  const sinLugar = correrLatido(["respuestas-pedidos", "120", "echo corrió"], { ONIA_LATIDO_DIR: "/proc/no-se-puede/lat" });
  assert.equal(sinLugar.status, 0);
  assert.equal(sinLugar.stdout, "corrió\n");
  assert.match(sinLugar.stderr, /no pude anotar el latido/);
  assert.equal(correrLatido(["x", "300"]).status, 2, "sin comando no corre nada");
});

test("aplicar no toca el crontab si el QA de publicación todavía no llegó a /root/bin", () => {
  const v = vps({ conQa: false });
  const r = v.aplicar();
  assert.notEqual(r.status, 0, r.stdout);
  assert.match(r.stdout, /onia-qa-release\.sh/);
  assert.equal(v.crontab(), v.crontabInicial, "su línea correría un archivo que nadie copió");
});

test("aplicar no toca el crontab si el latido todavía no llegó a /root/bin", () => {
  const v = vps({ conLatido: false });
  const r = v.aplicar();
  assert.notEqual(r.status, 0, r.stdout);
  assert.equal(v.crontab(), v.crontabInicial, "sin el envoltorio, cada línea nueva fallaría");
});

test("cada línea que agrega aplicar corre dentro del latido, y corre ENTERA: su comando, con sus argumentos", () => {
  const v = vps();
  assert.equal(v.aplicar().status, 0);
  const nuevas = v.crontab().split("\n").filter((l) => l.endsWith(" #jarvis") && !l.startsWith("#"));
  const conLatido = nuevas.filter((l) => l.includes("/root/bin/onia-latido.sh "));
  const nombres = conLatido.map((l) => l.match(/onia-latido\.sh (\S+) (\d+) /).slice(1).join(" "));
  assert.deepEqual(nombres, ["resumen-manana 86400", "resumen-noche 86400", "aduana-soltar 300", "agenda-bloques 1800", "respuestas-pedidos 120", "qa-release 900"]);
  // El resumen lee exactamente esos nombres: si uno cambia acá y no allá, su latido no se mira nunca.
  const esperados = readFileSync(join(AQUI, "jarvis-resumen.sh"), "utf8").match(/^LATIDOS_ESPERADOS="([^"]+)"/m)[1];
  assert.deepEqual(esperados.split(" "), nombres.map((n) => n.split(" ")[0]));
  // Las mismas líneas, sin el horario, contra un /root/bin que anota con qué la llamaron. Revisión del
  // 10-oct: sin las comillas, la línea de la aduana corría «sh -c 'ONIA_AVISO_SOLTAR=1'», salía 0, y el
  // latido decía «sano» de un trabajo que nunca corrió. Esto lo agarra.
  const tmp = mkdtempSync(join(tmpdir(), "linea-"));
  const grabador = join(tmp, "bin");
  for (const s of ["onia-jarvis-resumen.sh", "onia-tg.sh", "onia-agenda.sh", "onia-respuestas-pedidos.sh", "onia-qa-release.sh"]) {
    ejecutable(join(grabador, s), `#!/usr/bin/env bash\necho "$(basename "$0") $* soltar=\${ONIA_AVISO_SOLTAR:-}" >> ${tmp}/llamadas\n`);
  }
  for (const l of conLatido) {
    const cmd = l.replace(/ #jarvis$/, "").split(" ").slice(5).join(" ")
      .replace(/\S*\/onia-latido\.sh/, LATIDO).replaceAll("/var/log/", `${tmp}/`).replace(/[^\s']*\/root\/bin\//g, `${grabador}/`);
    spawnSync("sh", ["-c", cmd], { env: { ...process.env, ONIA_LATIDO_DIR: join(tmp, "lat") } });
  }
  assert.deepEqual(readFileSync(join(tmp, "llamadas"), "utf8").trim().split("\n"), [
    "onia-jarvis-resumen.sh manana soltar=",
    "onia-jarvis-resumen.sh noche soltar=",
    "onia-tg.sh  soltar=1",
    "onia-agenda.sh --bloques soltar=",
    "onia-respuestas-pedidos.sh  soltar=",
    "onia-qa-release.sh  soltar=",
  ]);
  for (const n of ["resumen-manana", "resumen-noche", "aduana-soltar", "agenda-bloques", "respuestas-pedidos", "qa-release"]) {
    assert.match(readFileSync(join(tmp, "lat", n), "utf8"), /^\d{10} 0 \d+\n$/, n);
  }
  // Sin el recolector copiado, «! -x ||» sale 0: no es una falla.
  rmSync(join(grabador, "onia-respuestas-pedidos.sh"));
  const pedidos = conLatido.find((l) => l.includes(" respuestas-pedidos ")).replace(/ #jarvis$/, "").split(" ").slice(5).join(" ")
    .replace(/\S*\/onia-latido\.sh/, LATIDO).replaceAll("/var/log/", `${tmp}/`).replace(/[^\s']*\/root\/bin\//g, `${grabador}/`);
  assert.equal(spawnSync("sh", ["-c", pedidos], { env: { ...process.env, ONIA_LATIDO_DIR: join(tmp, "lat") } }).status, 0);
  assert.match(readFileSync(join(tmp, "lat", "respuestas-pedidos"), "utf8"), /^\d{10} 0 120\n$/);
});

test("latido: corridas que se pisan no se roban el archivo temporal", () => {
  const dir = mkdtempSync(join(tmpdir(), "latido-carrera-"));
  const r = spawnSync("bash", ["-c", `for i in $(seq 40); do bash ${LATIDO} respuestas-pedidos 120 true & done; wait`],
    { env: { ...process.env, ONIA_LATIDO_DIR: join(dir, "lat") }, encoding: "utf8" });
  assert.equal(r.stderr, "", "ninguna dice «no pude anotar»");
  assert.deepEqual(readdirSync(join(dir, "lat")), ["respuestas-pedidos"], "y no quedan temporales");
});

// ── diagnostico: los latidos del cron (10-oct, HERMES_ROL_QA.md Q2) ────────────────────────────────
// Hoy un vigía mudo y uno sano se ven igual. Se corre la sección 15 del diagnostico.sh REAL con un
// crontab doble y logs con fechas puestas a mano.
function diagnosticoLatidos({ lineasExtra = null, logsExtra = {}, latidos = {} } = {}) {
  const dir = mkdtempSync(join(tmpdir(), "jarvis-diag-lat-"));
  const LOG = join(dir, "log");
  const LAT = join(dir, "lat");
  mkdirSync(LOG, { recursive: true });
  mkdirSync(LAT, { recursive: true });
  const hace = (seg) => new Date(Date.now() - seg * 1000);
  const log = (n, seg) => { writeFileSync(join(LOG, n), "x\n"); utimesSync(join(LOG, n), hace(seg), hace(seg)); };
  log("aduana.log", 3600);       // corre cada 5 min y no escribe hace 1 h: MUDO
  log("diario.log", 2 * 3600);   // corre una vez por día y escribió hace 2 h: ok
  for (const [n, seg] of Object.entries(logsExtra)) log(n, seg);
  writeFileSync(join(LAT, "aduana-soltar"), "1760000000 0 300\n");
  for (const [n, seg] of Object.entries(latidos)) writeFileSync(join(LAT, n), `${Math.floor(Date.now() / 1000) - seg} 0 86400\n`);
  const lineas = lineasExtra || [
    "SHELL=/bin/bash",
    // El sano va primero en el crontab: la salida igual tiene que poner lo mudo arriba.
    "0 10 * * * /root/bin/onia-diario.sh >> /var/log/diario.log 2>&1",
    "*/5 * * * * ONIA_AVISO_SOLTAR=1 /root/bin/onia-tg.sh >> /var/log/aduana.log 2>&1",
    "*/10 * * * * /root/bin/onia-vigia-sin-log.sh",
    "25,55 0-1,10-23 * * * /root/bin/onia-latido.sh agenda-bloques 1800 '/root/bin/onia-agenda.sh --bloques' >> /var/log/agenda.log 2>&1",
    "@reboot /root/bin/onia-al-arrancar.sh",
    "# 0 * * * * /root/bin/pausado.sh >> /var/log/pausado.log",
  ];
  const dobles = join(dir, "dobles");
  ejecutable(join(dobles, "crontab"), `#!/usr/bin/env bash\ncat <<'CRON'\n${lineas.join("\n")}\nCRON\n`);
  const diag = readFileSync(join(DIR, "diagnostico.sh"), "utf8");
  const inicio15 = diag.indexOf('sec "15.');
  const s15 = diag.slice(inicio15, diag.indexOf('\nsec "', inicio15 + 1));
  assert.ok(s15.length > 0, "no encontré la sección 15 del diagnóstico");
  const guion = `REDACTAR_SED='s/a^//'\n` + readFileSync(join(DIR, "comun.sh"), "utf8") + "\n" +
    s15.replaceAll("/var/log/", LOG + "/").replaceAll("/var/lib/onia-latido", LAT);
  // Las líneas del crontab doble también apuntan a /var/log: el python lee esas rutas.
  writeFileSync(join(dobles, "crontab"), `#!/usr/bin/env bash\ncat <<'CRON'\n${lineas.join("\n").replaceAll("/var/log/", LOG + "/")}\nCRON\n`);
  chmodSync(join(dobles, "crontab"), 0o755);
  return spawnSync("bash", ["-s"], { input: guion, env: { ...process.env, PATH: `${dobles}:${process.env.PATH}` }, encoding: "utf8" });
}

test("diagnóstico: cada línea del cron con su cadencia real, su log y si está muda", () => {
  const r = diagnosticoLatidos();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const filas = r.stdout.split("\n");
  const fila = (que) => filas.find((l) => l.includes(que)) || "";
  assert.match(fila("aduana.log"), /^MUDO\s+cada 5 min\s+hace 60 min\s+onia-tg\.sh → /);
  assert.match(fila("diario.log"), /^ok\s+cada 24 h\s+hace 2 h\s+onia-diario\.sh → /);
  assert.match(fila("onia-vigia-sin-log.sh"), /^sin log\s+cada 10 min/);
  // De 01:55 a 10:25 UTC no corre: su cadencia real es el hueco más largo, 8 h 30.
  assert.match(fila("latido:agenda-bloques"), /^MUDO \(no hay log\)\s+cada 8 h/);
  assert.match(fila("@reboot"), /—/);
  assert.doesNotMatch(r.stdout, /pausado|SHELL/, "ni lo comentado ni las variables");
  assert.ok(filas.findIndex((l) => l.startsWith("MUDO")) < filas.findIndex((l) => l.startsWith("ok")), "lo mudo va primero");
  assert.match(r.stdout, /--- 5 línea\(s\): 2 MUDA\(S\), 1 sin log/);
  assert.match(r.stdout, /aduana-soltar: 1760000000 0 300 \(2025-10-09T08:53:20Z\)/);
});

test("diagnóstico: una línea con latido se mide por su latido, no por su log (20-oct: 4 falsos MUDOS)", () => {
  // El resumen solo escribe su log si algo falla: con el log de hace 3 días y el latido de hace 2 h está sano.
  const r = diagnosticoLatidos({
    lineasExtra: [
      "30 10 * * * /root/bin/onia-latido.sh resumen-manana 86400 '/root/bin/onia-jarvis-resumen.sh manana' >> /var/log/onia-jarvis-resumen.log 2>&1",
      "*/5 * * * * /root/bin/onia-latido.sh aduana-soltar 300 'ONIA_AVISO_SOLTAR=1 /root/bin/onia-tg.sh' >> /var/log/onia-tg-soltar.log 2>&1",
    ],
    logsExtra: { "onia-jarvis-resumen.log": 3 * 86400, "onia-tg-soltar.log": 60 },
    latidos: { "resumen-manana": 2 * 3600 },
  });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const fila = (que) => r.stdout.split("\n").find((l) => l.includes(que)) || "";
  assert.match(fila("latido:resumen-manana"), /^ok\s+cada 24 h\s+hace 2 h\s+latido:resumen-manana → .*onia-jarvis-resumen\.log \(por su latido\)$/);
  // Y al revés: el log fresco no tapa un latido viejo (el de aduana-soltar es de 2025).
  assert.match(fila("latido:aduana-soltar"), /^MUDO\s+cada 5 min\s+.*\(por su latido\)$/);
});

test("el QA diario corre SOLO el diagnóstico, por horario o a mano desde main, sin inputs y sin cancelar un aplicar", () => {
  const wf = readFileSync(join(RAIZ, ".github", "workflows", "hermes-qa-diario.yml"), "utf8");
  assert.match(wf, /^\s+- cron: "0 10 \* \* \*"/m, "una vez por día, antes del resumen de las 06:30");
  const on = wf.slice(wf.indexOf("\non:"), wf.indexOf("\npermissions:"));
  assert.deepEqual([...on.matchAll(/^  ([a-z_]+):/gm)].map((m) => m[1]), ["schedule", "workflow_dispatch"], "ni push ni pull_request");
  // Su propio grupo: compartir el de hermes-jarvis le dejaba cancelar un revertir pendiente.
  assert.match(wf, /^concurrency:\n\s+group: hermes-qa-diario\n\s+cancel-in-progress: false$/m);
  assert.match(wf, /\[ "\$GITHUB_REF" = refs\/heads\/main \] \|\| \{/, "a mano, solo desde main");
  assert.match(wf, /umask 077\n\s+printf '%s\\n' "\$KEY"/, "la llave nace sin permisos para otros");
  assert.doesNotMatch(wf, /^\s+inputs:|\$\{\{\s*(github\.event\.)?inputs/m, "nada de afuera elige qué corre");
  assert.doesNotMatch(wf, /aplicar\.sh|revertir\.sh|ACTIVOS_B64|RUTINA_/, "ni aplicar, ni revertir, ni la llave de la rutina");
  assert.match(wf, /cat "\$DIR\/diagnostico\.sh"/);
  assert.match(wf, /\| sed -E -f "\$DIR\/redactar\.sed"/, "la salida se redacta también acá");
  assert.match(wf, /^\s+persist-credentials: false$/m);
});

test("diagnóstico: semanal y mensual muertos salen MUDO; rutas armadas al correr, nombres y alias (revisión del 10-oct)", () => {
  const D = 86400;
  const r = diagnosticoLatidos({
    lineasExtra: [
      "0 3 * * 0 /root/bin/semanal-muerto.sh >> /var/log/semanal-muerto.log 2>&1",
      "0 3 * * 0 /root/bin/semanal-vivo.sh >> /var/log/semanal-vivo.log 2>&1",
      "0 4 1 * * /root/bin/mensual-muerto.sh >> /var/log/mensual-muerto.log 2>&1",
      "0 5 1 1 * /root/bin/anual.sh >> /var/log/anual.log 2>&1",
      "0 * * * mon-fri /root/bin/nombres.sh >> /var/log/nombres.log 2>&1",
      "@hourly /root/bin/cada-hora.sh >> /var/log/cada-hora.log 2>&1",
      "0 2 * * * /root/bin/pct.sh >> /var/log/pct-$(date +\\%F).log 2>&1",
      '0 2 * * * /root/bin/comillas.sh >> "/var/log/con espacio.log" 2>&1',
    ],
    logsExtra: {
      "semanal-muerto.log": 120 * D,
      "semanal-vivo.log": 60,          // recién escrito: está al día haga lo que haga el calendario
      "mensual-muerto.log": 120 * D,
      "anual.log": 60,
      "nombres.log": 30 * D,
      "cada-hora.log": 60,
    },
  });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const fila = (que) => r.stdout.split("\n").find((l) => l.includes(que)) || "";
  assert.match(fila("semanal-muerto.log"), /^MUDO\s+cada 7 d\s+hace 120 d/, "antes salía «ok» con cadencia vacía");
  assert.match(fila("semanal-vivo.log"), /^ok\s+cada 7 d/);
  assert.match(fila("mensual-muerto.log"), /^MUDO\s+cada 3\d d/);
  assert.match(fila("anual.log"), /^no medible .*menos de dos corridas/, "un anual no se mide, ni ok ni MUDO");
  assert.match(fila("nombres.log"), /^MUDO\s+cada 2 d/, "«mon-fri» se lee (su hueco más largo es el fin de semana): un muerto de lunes a viernes se ve");
  assert.match(fila("cada-hora.log"), /^ok\s+cada 60 min/);
  assert.match(fila("pct.sh"), /^sin log/, "una ruta con $(date) no se puede mirar: nunca MUDO");
  assert.match(fila("comillas.sh"), /^sin log/);
});

// ── 5e. La orquesta: solo lo que Sergio Urcullo le dicta (2026-10-26) ─────────────────────────
// Desde el 26-oct planifica el Hermes de la PC (AGENTS.md §1). El aplicar del 20-oct le creaba al del VPS una
// revisión de cada 3 h y una regla «Planificar la orquesta»; ahora la revisión se PAUSA por su nombre (nunca
// se borra) y la regla se REEMPLAZA. La skill y la regla siguen inertes sin el token de Issues.

const SKILL_ORQ = (v) => join(v.R, ".hermes", "skills", "planificar-orquesta", "SKILL.md");
const jobOrq = (v) => v.jobs().find((j) => j.name === "onia-planificar-orquesta");
const ID_ORQ = "26deb0b4121c"; // la del VPS, medida el 21-oct (handoff/hermes-jarvis.md)
const conRevision = (v) => {
  const f = join(v.R, ".hermes", "cron", "jobs.json");
  const d = JSON.parse(readFileSync(f, "utf8"));
  d.jobs.push({ id: ID_ORQ, name: "onia-planificar-orquesta", enabled: true, state: "scheduled", schedule: "every 3h" });
  writeFileSync(f, JSON.stringify(d));
};
const REGLA_20_OCT = "## Planificar la orquesta (2026-10-20)\n\nSos el que **planifica** la orquesta: cargás tareas en su cola (issues de GitHub) y cada 3 horas\nrevisás cómo van.\n";

test("sin el token de Issues, a Hermes no se le enseña nada y no se programa nada", () => {
  const v = vps();
  const r = v.aplicar();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /cargar tareas en la orquesta APAGADO: falta el token de Issues/);
  assert.match(r.stdout, /no hay revisión de la orquesta cada 3 h en jobs\.json: nada que pausar/);
  assert.equal(existsSync(SKILL_ORQ(v)), false);
  assert.doesNotMatch(readFileSync(join(v.R, ".hermes", "SOUL.md"), "utf8"), /^## (Planificar|Cargar tareas en) la orquesta/m);
  assert.equal(v.leer("hermes-create"), "", "no programa nada");
  assert.doesNotMatch(v.leer("n8n"), /api\.github\.com/, "ni siquiera mira GitHub");
  assert.doesNotMatch(v.leer("telegram"), /orquesta/);
});

test("con el token: skill, la regla nueva (una vez, hasta su ---), ningún trabajo nuevo, y reinicio", () => {
  const v = vps({ tokenIssues: 0o600 });
  const r = v.aplicar();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.doesNotMatch(r.stdout + r.stderr, /NoSeImprimeNunca/);
  assert.equal(readFileSync(SKILL_ORQ(v), "utf8"), readFileSync(join(RAIZ, "hermes-content", "skills", "planificar-orquesta.md"), "utf8"));
  const soul = readFileSync(join(v.R, ".hermes", "SOUL.md"), "utf8");
  assert.equal((soul.match(/^## Cargar tareas en la orquesta/gm) || []).length, 1);
  assert.match(soul, /solo cuando él te la dicta/);
  assert.doesNotMatch(soul, /^## Planificar la orquesta/m);
  assert.doesNotMatch(soul, /^## Pedidos a Claude/m, "solo su sección: la de pedidos que le sigue no entra sin llave");
  assert.equal(v.leer("hermes-create"), "", "ya no crea la revisión de cada 3 h");
  assert.equal(jobOrq(v), undefined);
  assert.match(v.leer("n8n"), /^GET https:\/\/api\.github\.com\/repos\/oninteligenciaartificial\/onia-hermes\/labels\/necesita-ok$/m, "la Fase A miró los labels");
  assert.match(v.leer("systemctl"), /^--user restart hermes-gateway\.service$/m);
  assert.match(r.stdout, /✅ y nombra planificar-orquesta/);
  const aviso = v.leer("telegram");
  assert.match(aviso, /📋 Si me dictás una tarea para la orquesta, la cargo/);
  assert.doesNotMatch(aviso, /las reviso cada 3 horas/);

  spawnSync("/bin/sleep", ["1.1"]); // el respaldo se nombra por segundo
  writeFileSync(join(v.log, "systemctl"), "");
  const r2 = v.aplicar();
  assert.equal(r2.status, 0, r2.stdout);
  assert.match(r2.stdout, /su SOUL ya tenía la regla de la orquesta/);
  assert.equal(readFileSync(join(v.R, ".hermes", "SOUL.md"), "utf8"), soul, "la segunda corrida deja el SOUL igual");
  assert.doesNotMatch(v.leer("systemctl"), /restart/, "sin cambios no reinicia");
});

test("el VPS del 20-oct: pausa la revisión de cada 3 h por su nombre, reemplaza la regla vieja, y revertir lo deja exacto", () => {
  const v = vps({ tokenIssues: 0o600 });
  conRevision(v);
  const soulAntes = `# SOUL de Hermes\n\n---\n\n${REGLA_20_OCT}\n---\n\n## Otra regla\n\nque queda igual\n`;
  writeFileSync(join(v.R, ".hermes", "SOUL.md"), soulAntes);
  mkdirSync(dirname(SKILL_ORQ(v)), { recursive: true });
  writeFileSync(SKILL_ORQ(v), "la skill del 20-oct: vos planificás\n");
  // El aplicar del 20-oct, sin revertir: creó la revisión, y el nuevo hereda su lista.
  const previo = join(v.R, "backups", "hermes-jarvis-20261020T210014Z");
  mkdirSync(previo, { recursive: true });
  writeFileSync(join(previo, "aplicado"), "");
  writeFileSync(join(previo, "hermes-creados.txt"), ID_ORQ + "\n");
  spawnSync("/bin/sleep", ["1.1"]);

  const r = v.aplicar();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, new RegExp(`⏸ pausada la revisión de la orquesta cada 3 h: ${ID_ORQ}`));
  assert.equal(jobOrq(v).state, "paused", "pausada");
  assert.equal(jobOrq(v).enabled, false);
  assert.equal(v.jobs().length, 4, "nunca se borra ni se crea otra");
  assert.equal(v.leer("hermes-create"), "");
  assert.match(r.stdout, /✅ regla de la orquesta reemplazada en el SOUL de Hermes/);
  const soul = readFileSync(join(v.R, ".hermes", "SOUL.md"), "utf8");
  assert.doesNotMatch(soul, /Planificar la orquesta|cada 3 horas/, "la regla vieja sale entera");
  assert.equal((soul.match(/^## Cargar tareas en la orquesta/gm) || []).length, 1);
  assert.ok(soul.startsWith("# SOUL de Hermes\n\n---\n\n## Cargar tareas en la orquesta"), soul);
  assert.ok(soul.includes("\n\n---\n\n## Otra regla\n\nque queda igual\n"), "lo que sigue al --- queda igual");
  assert.equal(readFileSync(SKILL_ORQ(v), "utf8"), readFileSync(join(RAIZ, "hermes-content", "skills", "planificar-orquesta.md"), "utf8"));

  spawnSync("/bin/sleep", ["1.1"]);
  const r2 = v.aplicar();
  assert.equal(r2.status, 0, r2.stdout);
  assert.match(r2.stdout, new RegExp(`la revisión de la orquesta cada 3 h ya estaba en pausa: ${ID_ORQ}`));

  const rev = v.revertir({ HERMES_RESUME_ESTRICTO: "1" });
  assert.equal(rev.status, 0, rev.stdout + rev.stderr);
  assert.equal(readFileSync(join(v.R, ".hermes", "SOUL.md"), "utf8"), soulAntes, "el SOUL de antes, byte a byte");
  assert.equal(readFileSync(SKILL_ORQ(v), "utf8"), "la skill del 20-oct: vos planificás\n");
  assert.equal(jobOrq(v).state, "paused", "la creó el aplicar del 20-oct, que también se revierte: queda en pausa");
  assert.ok(v.jobs().filter((j) => j.id !== ID_ORQ).every((j) => j.enabled), "los 3 de antes vuelven");
});

test("sin token igual pausa la revisión de cada 3 h; si la pausó esta corrida, revertir la reanuda", () => {
  const v = vps();
  conRevision(v);
  const r = v.aplicar();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, new RegExp(`⏸ pausada la revisión de la orquesta cada 3 h: ${ID_ORQ}`));
  assert.equal(jobOrq(v).state, "paused");
  assert.equal(existsSync(SKILL_ORQ(v)), false, "sin token no se le enseña nada");
  const rev = v.revertir({ HERMES_RESUME_ESTRICTO: "1" });
  assert.equal(rev.status, 0, rev.stdout + rev.stderr);
  assert.equal(jobOrq(v).enabled, true, "volvió como estaba antes de este aplicar");
});

test("si aplicar se corta justo después de pausar la revisión, revertir la reanuda (se anota antes)", () => {
  const v = vps();
  conRevision(v);
  const r = v.aplicar({}, '  JEST=""; read -r _ JEST');
  assert.equal(r.status, 9, r.stdout);
  assert.equal(jobOrq(v).state, "paused");
  const rev = v.revertir();
  assert.equal(rev.status, 0, rev.stdout);
  assert.equal(jobOrq(v).enabled, true);
});

test("si Hermes dice que pausó la revisión y sigue activa, aplicar lo cuenta como falla", () => {
  const v = vps();
  conRevision(v);
  const r = v.aplicar({ HERMES_PAUSE_NO_HACE: ID_ORQ });
  assert.equal(r.status, 1, r.stdout);
  assert.match(r.stdout, new RegExp(`no pude pausar la revisión de la orquesta cada 3 h \\(${ID_ORQ} quedó: activo\\)`));
  assert.doesNotMatch(v.leer("telegram"), /Jarvis encendido/, "con una falla no le promete nada");
});

test("con la skill del calendario suelta en skills/ (como en el VPS), la de la orquesta va a skills/planificar-orquesta/SKILL.md", () => {
  // Medido el 20-oct: «junto a la del calendario» la dejó en /root/.hermes/planificar-orquesta/SKILL.md, y Hermes
  // solo carga ~/.hermes/skills/<…>/<nombre>/SKILL.md.
  const v = vps({ tokenIssues: 0o600 });
  writeFileSync(join(v.R, ".hermes", "skills", "agenda-calendario.md"), "la del calendario, suelta\n");
  const r = v.aplicar();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.ok(existsSync(SKILL_ORQ(v)), r.stdout);
  assert.equal(existsSync(join(v.R, ".hermes", "planificar-orquesta")), false, "nada fuera de skills/");
});

test("la copia que un aplicar anterior dejó fuera de skills/ se borra, y revertir quita la del lugar nuevo", () => {
  const v = vps({ tokenIssues: 0o600 });
  const fuera = join(v.R, ".hermes", "planificar-orquesta", "SKILL.md");
  mkdirSync(dirname(fuera), { recursive: true });
  writeFileSync(fuera, "la de afuera\n");
  // El respaldo del aplicar del 20-oct, sin revertir: el nuevo hereda sus listas.
  const previo = join(v.R, "backups", "hermes-jarvis-20261020-210014");
  mkdirSync(previo, { recursive: true });
  writeFileSync(join(previo, "aplicado"), "");
  writeFileSync(join(previo, "skill-orquesta-destino"), fuera + "\n");
  writeFileSync(join(previo, "skill-orquesta-no-existia"), "");
  spawnSync("/bin/sleep", ["1.1"]); // el respaldo nuevo, más nuevo que el previo
  const r = v.aplicar();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /saqué la copia que había quedado fuera de la carpeta de skills/);
  assert.equal(existsSync(join(v.R, ".hermes", "planificar-orquesta")), false);
  assert.ok(existsSync(SKILL_ORQ(v)));
  const rev = v.revertir();
  assert.equal(rev.status, 0, rev.stdout + rev.stderr);
  assert.equal(existsSync(SKILL_ORQ(v)), false, "revertir quita la del lugar nuevo");
});

test("con el token, si falta la skill o la regla nueva en main, o el token no sirve: no aplica nada", () => {
  const sinSkill = vps({ tokenIssues: 0o600 });
  cambiarMain(sinSkill, (repo, g) => g("rm", "-q", "hermes-content/skills/planificar-orquesta.md"));
  const a = sinSkill.aplicar();
  assert.equal(a.status, 1, a.stdout);
  assert.match(a.stdout, /no encontré la skill planificar-orquesta en origin\/main/);
  nadaCreado(sinSkill);

  // Un main con la regla del 20-oct no sirve: con ella, el VPS seguiría planificando.
  const reglaVieja = vps({ tokenIssues: 0o600 });
  conRevision(reglaVieja);
  cambiarMain(reglaVieja, (repo) => {
    const f = join(repo, "hermes-content/deploy/hermes-agent/SOUL.md");
    writeFileSync(f, readFileSync(f, "utf8").replace(/^## Cargar tareas en la orquesta.*$/m, "## Planificar la orquesta (2026-10-20)"));
  });
  writeFileSync(join(reglaVieja.R, ".hermes", "SOUL.md"), "# SOUL de Hermes\n\n---\n\n## Cargar tareas en la orquesta (2026-10-26)\n\nla del VPS\n");
  const b = reglaVieja.aplicar();
  assert.equal(b.status, 1, b.stdout);
  assert.match(b.stdout, /no encontré la regla de la orquesta en el SOUL de origin\/main/);
  nadaCreado(reglaVieja);

  const abierto = vps({ tokenIssues: 0o644 });
  const c = abierto.aplicar();
  assert.equal(c.status, 1, c.stdout);
  assert.match(c.stdout, /la cola de la orquesta no está lista: El token de Issues tiene permisos 644/);
  nadaCreado(abierto);
});

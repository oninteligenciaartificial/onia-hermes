// El pipeline de la plataforma por IMAGEN (build-and-stage.sh, swap-imagen.sh,
// recreate-container.sh), EJECUTADO con `docker`, `curl`, `ps`, `df` y `flock` de
// mentira en el PATH. Sin red, sin VPS y sin Docker de verdad.
//
// POR QUE ASI y no leyendo el texto: un test que grepea el .sh se pone verde con
// cualquier reescritura que conserve la palabra. Aca se corre el guion real y se mira
// QUE LE PIDIO A DOCKER: el seco no puede pedir ni un stop, y el swap que falla
// despues de tocar produccion tiene que dejar escrito su rollback.
//
// Nace del 2026-09-24: produccion paso a `onia-platform:release-7bcd0a83` y los guiones
// versionados seguian en la receta vieja (build en el host + rsync a runtime-next +
// node:20). recreate-container.sh, corrido ese dia, habria devuelto produccion al
// build del 19-sep sin que nada se pusiera rojo.
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, delimiter } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, '..', '..', '..');
const BUILD = join(AQUI, 'build-and-stage.sh');
const SWAP = join(AQUI, 'swap-imagen.sh');
const RECREAR = join(AQUI, 'recreate-container.sh');
const PUBLICAR = join(AQUI, 'publicar.sh');
const PUBLICAR_SOLO = join(RAIZ, 'scripts', 'loops', 'extras', 'publicar-solo.sh');

const ANON = 'anon-SECRETO-de-prueba';
const SRK = 'srk-NO-SE-MUESTRA';
const VIVO = 'FU8j_OHPyRH1XCCr6-0uY';
const NUEVO = 'NuevoBuildIdDeLaImagen';

const barra = (p) => p.replaceAll('\\', '/');

const STUB_DOCKER = `#!/usr/bin/env bash
S="$STUB_ESTADO"
echo "$*" >> "$S/docker.log"
ultimo=\${@: -1}
CONF_OK='nextjs|/app|["node","server.js"]'
case "$1" in
  inspect)
    case "$*" in
      *"{{.Config.Image}}"*) echo "$STUB_IMAGEN_VIVA" ;;
      *"{{.Image}}"*) echo "sha256:vivo" ;;
      *"{{range .Mounts}}"*) echo "\${STUB_MONTAJES:-}" ;;
    esac ;;
  image)
    case "$2" in
      inspect) [ -n "\${STUB_SIN_IMAGEN:-}" ] && exit 1
               # Si en este mundo se armó algo, sólo existen las etiquetas que se armaron.
               [ -f "$S/imagenes" ] && ! grep -qxF -- "$ultimo" "$S/imagenes" && exit 1
               case "$*" in
                 *"{{.Id}}"*) echo "sha256:vivo" ;;
                 *"{{.Config.User}}"*) echo "\${STUB_CONF:-$CONF_OK}" ;;
               esac ;;
      rm) [ -f "$S/imagenes" ] && { grep -vxF -- "$ultimo" "$S/imagenes" > "$S/imagenes.t"; mv "$S/imagenes.t" "$S/imagenes"; } ;;
    esac ;;
  build) [ "\${STUB_BUILD_FALLA:-0}" = 0 ] || exit "$STUB_BUILD_FALLA"
         p=""; for a in "$@"; do [ "$p" = --tag ] && echo "$a" >> "$S/imagenes"; p=$a; done ;;
  tag) echo "$3" >> "$S/imagenes" ;;
  exec)
    shift 2
    case "$*" in
      "cat /app/.next/BUILD_ID") if [ -f "$S/nuevo" ]; then echo "$STUB_BUILD_NUEVO"; else echo "$STUB_BUILD_VIVO"; fi ;;
      "nc -z "*) [ "$3" = "\${STUB_FALLA:-}" ] && exit 1 ;;
      "sh -c "*) [ "\${STUB_FALLA:-}" = canario ] && exit 1 ;;
    esac ;;
  run)
    case "$*" in
      *"--entrypoint sh"*) printf '%s\\n' "build=$STUB_BUILD_NUEVO" "node=\${STUB_NODE:-v22.11.0}" server=ok node_modules=ok static=40 \\
        "envfiles=\${STUB_ENVFILES:-0}" "publica=\${STUB_PUBLICA:-3}" "anon=\${STUB_ANON:-3}" "qa=\${STUB_QA:-0}" ;;
      *--rm*) echo "$STUB_BUILD_NUEVO" ;;
      *) touch "$S/nuevo" ;;
    esac ;;
  network) [ "$2" = connect ] && [ "$3" = "\${STUB_RED_FALLA:-}" ] && [ "$4" = onia-platform ] && exit 1 ;;
  create) p=""; for a in "$@"; do [ "$p" = --name ] && echo "$a" >> "$S/creados"; p=$a; done ;;
  rm) [ "$ultimo" = onia-platform ] && rm -f "$S/nuevo"
      [ -f "$S/creados" ] && { grep -vx -- "$ultimo" "$S/creados" > "$S/creados.t"; mv "$S/creados.t" "$S/creados"; } ;;
  ps) printf '%s\\n' \${STUB_CONTENEDORES:-}; cat "$S/creados" 2>/dev/null ;;
  images) printf '%s\\n' \${STUB_IMAGENES:-} ;;
esac
exit 0
`;

const STUB_CURL = `#!/usr/bin/env bash
S="$STUB_ESTADO"
out=""; w=""; url=""
while [ $# -gt 0 ]; do
  case "$1" in -o) out=$2; shift ;; -w) w=$2; shift ;; --max-time) shift ;; -*) ;; *) url=$1 ;; esac
  shift
done
echo "curl $url" >> "$S/docker.log"
case "$url" in
  *127.0.0.1:3101*) b=$STUB_BUILD_NUEVO; c=200; [ "\${STUB_FALLA:-}" = canario_login ] && c=500
                    [ "\${STUB_FALLA:-}" = canario_build ] && b=$STUB_BUILD_VIVO ;;
  *) b=$STUB_BUILD_VIVO; [ -f "$S/nuevo" ] && b=$STUB_BUILD_NUEVO; c=200
     [ "\${STUB_FALLA:-}" = publico ] && b=$STUB_BUILD_VIVO ;;
esac
cuerpo="<form><h1>Iniciar sesión</h1></form><script>self.__next_f.push([1,\\"b\\":\\"$b\\"])</script>"
if [ -n "$out" ]; then printf '%s' "$cuerpo" > "$out"; else printf '%s' "$cuerpo"; fi
[ -n "$w" ] && printf '%s' "$c"
exit 0
`;

/** Un VPS de mentira: repo con un commit, /opt de mentira y los binarios falsos. */
function mundo(extra = {}) {
  const t = barra(mkdtempSync(join(tmpdir(), 'onia-imagen-')));
  const bin = `${t}/bin`;
  const base = `${t}/base`;
  const estado = `${t}/estado`;
  const repo = `${t}/repo`;
  for (const d of [bin, base, estado, repo]) mkdirSync(d, { recursive: true });
  const stub = (nombre, cuerpo) => writeFileSync(`${bin}/${nombre}`, cuerpo, { mode: 0o755 });
  stub('docker', STUB_DOCKER);
  stub('curl', STUB_CURL);
  stub('ps', '#!/usr/bin/env bash\nprintf "%s\\n" "${STUB_PS:-bash}"\n');
  stub('df', '#!/usr/bin/env bash\necho "Filesystem 1024-blocks Used Available Capacity Mounted on"\necho "/dev/sda1 999999999 1 $(( ${STUB_DISCO_GB:-100} * 1048576 )) 1% /"\n');
  stub('flock', '#!/usr/bin/env bash\nexit 0\n');
  writeFileSync(`${t}/meminfo`, `MemTotal: 33554432 kB\nMemAvailable: ${(extra.ramGb ?? 16) * 1048576} kB\n`);
  writeFileSync(
    `${base}/app.env`,
    [
      `NEXT_PUBLIC_APP_URL=${extra.appUrl ?? 'https://app.onia.com.bo'}`,
      'NEXT_PUBLIC_SUPABASE_URL=https://app.onia.com.bo/supabase',
      `NEXT_PUBLIC_SUPABASE_ANON_KEY=${ANON}`,
      `SUPABASE_SERVICE_ROLE_KEY=${SRK}`,
      '',
    ].join('\n'),
  );
  const git = (...a) => execFileSync('git', ['-C', repo, '-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { encoding: 'utf8' });
  git('init', '-q');
  writeFileSync(`${repo}/Dockerfile`, 'FROM scratch\n');
  for (const d of ['.claude', 'n8n-mcp-server/node_modules', 'lib']) mkdirSync(`${repo}/${d}`, { recursive: true });
  writeFileSync(`${repo}/.claude/settings.json`, '{}');
  writeFileSync(`${repo}/n8n-mcp-server/node_modules/pesado.js`, '');
  writeFileSync(`${repo}/lib/pricing.ts`, 'export const X = 1;\n');
  git('add', '.');
  git('commit', '-qm', 'x');
  const sha = git('rev-parse', 'HEAD').trim();
  return { t, base, estado, repo, sha, sha8: sha.slice(0, 8), bin };
}

function correr(m, guion, args, stubs = {}) {
  const env = {
    ...process.env,
    PATH: `${m.bin}${delimiter}${process.env.PATH}`,
    ONIA_PLATFORM_REPO: m.repo,
    ONIA_PLATFORM_BASE: m.base,
    ONIA_MEMINFO: `${m.t}/meminfo`,
    ONIA_DOCKER_ROOT: `${m.t}/no-existe`,
    ONIA_SWAP_PAUSA: '0',
    STUB_ESTADO: m.estado,
    STUB_BUILD_VIVO: VIVO,
    STUB_BUILD_NUEVO: NUEVO,
    STUB_IMAGEN_VIVA: 'onia-platform:release-7bcd0a83',
    ...stubs,
  };
  const r = spawnSync('bash', [guion, ...args], { encoding: 'utf8', env, timeout: 60_000 });
  const log = existsSync(`${m.estado}/docker.log`) ? readFileSync(`${m.estado}/docker.log`, 'utf8') : '';
  return { codigo: r.status, salida: `${r.stdout}${r.stderr}`, log, llamadas: log.split('\n').filter(Boolean) };
}

/** Lo que cambia algo en Docker. `run --rm` sólo LEE la imagen (su BUILD_ID). */
const muta = (l) =>
  /^(stop|rename|rm|create|start|network|build|tag|kill|restart) /.test(l) ||
  (/^run /.test(l) && !/--rm/.test(l)) ||
  /^image (rm|prune|tag)/.test(l);

const limpiar = (m) => rmSync(m.t, { recursive: true, force: true });

// ── build-and-stage.sh ──────────────────────────────────────────────────────

test('build en seco: dice qué armaría, no le pide nada que mute a Docker ni crea el release', () => {
  const m = mundo();
  try {
    const r = correr(m, BUILD, [m.sha, '--dry-run']);
    assert.equal(r.codigo, 0, r.salida);
    assert.match(r.salida, new RegExp(`armaria onia-platform:release-${m.sha8}`));
    assert.deepEqual(r.llamadas.filter(muta), []);
    assert.equal(existsSync(`${m.base}/releases`), false);
  } finally {
    limpiar(m);
  }
});

test('build: los valores de app.env no aparecen en la salida (ni la anon key ni el service role)', () => {
  const m = mundo();
  try {
    const r = correr(m, BUILD, [m.sha, '--dry-run']);
    assert.ok(!r.salida.includes(ANON), 'mostró la anon key');
    assert.ok(!r.salida.includes(SRK), 'mostró el service role');
  } finally {
    limpiar(m);
  }
});

test('build: con menos de 6 GB de RAM libre se niega', () => {
  const m = mundo({ ramGb: 4 });
  try {
    const r = correr(m, BUILD, [m.sha, '--dry-run']);
    assert.equal(r.codigo, 1);
    assert.match(r.salida, /RAM disponible 4GB/);
  } finally {
    limpiar(m);
  }
});

test('build: con menos de 20 GB de disco libre se niega', () => {
  const m = mundo();
  try {
    const r = correr(m, BUILD, [m.sha, '--dry-run'], { STUB_DISCO_GB: '10' });
    assert.equal(r.codigo, 1);
    assert.match(r.salida, /disco libre .* 10GB/);
  } finally {
    limpiar(m);
  }
});

test('build: si ya corre otro build (next build / docker build) no encima otro', () => {
  const m = mundo();
  try {
    const r = correr(m, BUILD, [m.sha, '--dry-run'], { STUB_PS: 'docker build --tag onia-platform:release-otro' });
    assert.equal(r.codigo, 1);
    assert.match(r.salida, /otro build corriendo/);
  } finally {
    limpiar(m);
  }
});

test('build: no re-etiqueta la imagen que corre producción', () => {
  const m = mundo();
  try {
    const r = correr(m, BUILD, [m.sha, '--dry-run'], { STUB_IMAGEN_VIVA: `onia-platform:release-${m.sha8}` });
    assert.equal(r.codigo, 1);
    assert.match(r.salida, /ya corre/);
  } finally {
    limpiar(m);
  }
});

test('build: un app.env con la URL pública equivocada no se hornea, y no se muestra', () => {
  const m = mundo({ appUrl: 'http://127.0.0.1:3000' });
  try {
    const r = correr(m, BUILD, [m.sha, '--dry-run']);
    assert.equal(r.codigo, 1);
    assert.ok(!r.salida.includes('127.0.0.1:3000'));
  } finally {
    limpiar(m);
  }
});

// La corrida REAL (sin --dry-run) contra el docker de mentira: lo que tiene que quedar
// en el release y en qué orden. El BUILD_ID va último porque es lo que deploy-vivo.mjs
// lee para dar el release por publicable.
const hoy = () => {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
};

test('build real: release con SHA, código sin lo excluido, docker build sin valores en argv y BUILD_ID al final', () => {
  const m = mundo();
  try {
    const r = correr(m, BUILD, [m.sha]);
    assert.equal(r.codigo, 0, r.salida);
    const R = `${m.base}/releases/${m.sha8}-${hoy()}`;
    assert.equal(readFileSync(`${R}/SHA`, 'utf8').trim(), m.sha);
    assert.equal(readFileSync(`${R}/BUILD_ID`, 'utf8').trim(), NUEVO);
    assert.ok(existsSync(`${R}/source.tar.gz`));
    assert.ok(existsSync(`${R}/src/lib/pricing.ts`));
    assert.ok(!existsSync(`${R}/src/.claude`), '.claude viajó al build');
    assert.ok(!existsSync(`${R}/src/n8n-mcp-server/node_modules`), 'n8n-mcp-server/node_modules viajó al build');
    assert.match(readFileSync(`${R}/build.exit`, 'utf8'), /^0 /);
    const build = r.llamadas.find((l) => l.startsWith('build '));
    assert.match(
      build,
      new RegExp(`--tag onia-platform:candidato-${m.sha8} --build-arg NEXT_PUBLIC_SUPABASE_URL --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY --build-arg NEXT_PUBLIC_APP_URL`),
    );
    // La etiqueta release-<sha8> es la que publica el swap: nace DESPUÉS de los gates.
    const i = (re) => r.llamadas.findIndex((l) => re.test(l));
    const etiqueta = i(new RegExp(`^tag onia-platform:candidato-${m.sha8} onia-platform:release-${m.sha8}$`));
    assert.ok(etiqueta > i(/--entrypoint sh/), 'etiquetó release antes de correr los gates');
    assert.ok(i(new RegExp(`^image rm onia-platform:candidato-${m.sha8}$`)) > etiqueta, 'dejó el candidato colgado');
    assert.ok(!r.log.includes(ANON) && !r.log.includes(SRK), 'un valor de app.env viajó en la línea de comando');
    assert.ok(!r.salida.includes(ANON) && !r.salida.includes(SRK));
    assert.match(r.salida, /STAGED_OK/);
  } finally {
    limpiar(m);
  }
});

// Cada gate, roto de a uno. Un gate que se borra tiene que poner algo rojo acá.
const GATES_ROTOS = [
  [{ STUB_QA: '2' }, /valores-QA=2/],
  [{ STUB_NODE: 'v20.18.0' }, /node=v20\.18\.0/],
  [{ STUB_ENVFILES: '1' }, /envfiles=1/],
  [{ STUB_ANON: '0' }, /anon-key-no-horneada/],
  [{ STUB_PUBLICA: '0' }, /url-publica-no-horneada/],
  [{ STUB_CONF: 'root|/|["npm","start"]' }, /config de la imagen inesperada/],
];

for (const [stubs, motivo] of GATES_ROTOS) {
  test(`build real: con ${Object.entries(stubs)[0].join('=')} NO queda staged ni etiquetada release`, () => {
    const m = mundo();
    try {
      const r = correr(m, BUILD, [m.sha], stubs);
      assert.equal(r.codigo, 1, r.salida);
      assert.match(r.salida, motivo);
      assert.ok(!r.salida.includes('STAGED_OK'));
      assert.equal(existsSync(`${m.base}/releases/${m.sha8}-${hoy()}/BUILD_ID`), false);
      assert.ok(!r.llamadas.some((l) => /^tag .*:release-/.test(l)), 'etiquetó release una imagen rechazada');
      assert.ok(r.llamadas.includes(`image rm onia-platform:candidato-${m.sha8}`), 'dejó el candidato rechazado');
    } finally {
      limpiar(m);
    }
  });
}

// El atajo del runbook: build-and-stage dice «siguiente paso: swap-imagen.sh <sha8>».
// Si el build fue rechazado, ese swap no puede encontrar nada que publicar.
test('una imagen que no pasó los gates no se puede publicar con swap-imagen.sh', () => {
  const m = mundo();
  try {
    assert.equal(correr(m, BUILD, [m.sha], { STUB_QA: '2' }).codigo, 1);
    const r = correr(m, SWAP, [m.sha]);
    assert.equal(r.codigo, 1, r.salida);
    assert.match(r.salida, /no existe la imagen onia-platform:release-/);
    assert.ok(!r.llamadas.some((l) => l === 'stop onia-platform'), 'paró producción por una imagen rechazada');
  } finally {
    limpiar(m);
  }
});

test('una imagen que pasó los gates sí la encuentra el swap', () => {
  const m = mundo();
  try {
    assert.equal(correr(m, BUILD, [m.sha]).codigo, 0);
    const r = correr(m, SWAP, [m.sha]);
    assert.equal(r.codigo, 0, r.salida);
    assert.match(r.salida, /SWAP OK/);
  } finally {
    limpiar(m);
  }
});

test('build real: si docker build falla, sale 1 y no corre gates ni escribe BUILD_ID', () => {
  const m = mundo();
  try {
    const r = correr(m, BUILD, [m.sha], { STUB_BUILD_FALLA: '1' });
    assert.equal(r.codigo, 1);
    assert.match(r.salida, /docker build fallo/);
    assert.ok(!r.llamadas.some((l) => /--entrypoint sh/.test(l)), 'corrió gates sobre una imagen que no se armó');
    assert.equal(existsSync(`${m.base}/releases/${m.sha8}-${hoy()}/BUILD_ID`), false);
  } finally {
    limpiar(m);
  }
});

// ── swap-imagen.sh ──────────────────────────────────────────────────────────

test('swap en seco: plan completo (canario, rename a prev, run, redes) y producción intacta', () => {
  const m = mundo();
  try {
    const r = correr(m, SWAP, [m.sha, '--dry-run']);
    assert.equal(r.codigo, 0, r.salida);
    assert.match(r.salida, new RegExp(`docker rename onia-platform onia-platform-prev-${VIVO.slice(0, 8)}-\\d{8}-\\d{6}`));
    assert.match(r.salida, /-p 127\.0\.0\.1:3101:3000/);
    assert.match(r.salida, /network connect easypanel dentalgest-staging-supabase_default onia_selfhosted_onia_internal/);
    assert.deepEqual(r.llamadas.filter(muta), []);
  } finally {
    limpiar(m);
  }
});

test('swap: sin la imagen armada sale 1 sin tocar producción', () => {
  const m = mundo();
  try {
    const r = correr(m, SWAP, [m.sha], { STUB_SIN_IMAGEN: '1' });
    assert.equal(r.codigo, 1);
    assert.match(r.salida, /no existe la imagen/);
    assert.deepEqual(r.llamadas.filter(muta), []);
  } finally {
    limpiar(m);
  }
});

test('swap: si la imagen ya es la que corre, no hace nada', () => {
  const m = mundo();
  try {
    const r = correr(m, SWAP, [m.sha], { STUB_BUILD_NUEVO: VIVO });
    assert.equal(r.codigo, 0);
    assert.match(r.salida, /YA CORRE/);
    assert.deepEqual(r.llamadas.filter(muta), []);
  } finally {
    limpiar(m);
  }
});

test('swap: el canario que no llega a auth/db/kong corta ANTES de parar producción', () => {
  const m = mundo();
  try {
    const r = correr(m, SWAP, [m.sha], { STUB_FALLA: 'canario' });
    assert.equal(r.codigo, 1);
    assert.ok(!r.llamadas.some((l) => l === 'stop onia-platform'), 'paró producción con un canario roto');
    assert.ok(r.llamadas.some((l) => /^rm -f onia-platform-canary-/.test(l)), 'dejó el canario vivo');
  } finally {
    limpiar(m);
  }
});

test('swap: el canario sin login 200 corta ANTES de parar producción', () => {
  const m = mundo();
  try {
    const r = correr(m, SWAP, [m.sha], { STUB_FALLA: 'canario_login' });
    assert.equal(r.codigo, 1);
    assert.ok(!r.llamadas.some((l) => l === 'stop onia-platform'));
  } finally {
    limpiar(m);
  }
});

test('swap: el canario que sirve OTRO build (no el de la imagen) corta ANTES de parar producción', () => {
  const m = mundo();
  try {
    const r = correr(m, SWAP, [m.sha], { STUB_FALLA: 'canario_build' });
    assert.equal(r.codigo, 1);
    assert.match(r.salida, /canario: \/login no sirve el build/);
    assert.ok(!r.llamadas.some((l) => l === 'stop onia-platform'));
  } finally {
    limpiar(m);
  }
});

// Crear con --network pone UNA red: sin easypanel no hay Traefik. Así se tumbó prod 3 veces.
test('swap: si no puede conectar easypanel al contenedor nuevo, ROLLBACK', () => {
  const m = mundo();
  try {
    const r = correr(m, SWAP, [m.sha], { STUB_RED_FALLA: 'easypanel' });
    assert.equal(r.codigo, 1);
    assert.match(r.salida, /ROLLBACK: no pude conectar la red easypanel/);
    assert.ok(r.llamadas.some((l) => /^rename onia-platform-prev-\S+ onia-platform$/.test(l)));
    assert.ok(r.llamadas.includes('start onia-platform'));
  } finally {
    limpiar(m);
  }
});

test('swap feliz: canario, rename a prev, imagen nueva con las 4 redes, verifica lo público y poda a 2 prev', () => {
  const m = mundo();
  try {
    const r = correr(m, SWAP, [m.sha], {
      STUB_CONTENEDORES: 'onia-platform onia-platform-prev-aaaa onia-platform-prev-bbbb onia-platform-prev-cccc onia-platform-canary-viejo',
      STUB_IMAGENES: `onia-platform:release-${m.sha8} onia-platform:release-7bcd0a83 onia-platform:release-11111111 onia-platform:release-22222222`,
    });
    assert.equal(r.codigo, 0, r.salida);
    const L = r.llamadas;
    const i = (re) => L.findIndex((l) => re.test(l));
    const tag = `onia-platform:release-${m.sha8}`;
    assert.ok(i(/^create --name onia-platform-canary-/) >= 0, 'sin canario');
    assert.ok(L.some((l) => /^create .*-p 127\.0\.0\.1:3101:3000/.test(l) && !/easypanel/.test(l)));
    assert.ok(!L.some((l) => /^network connect easypanel onia-platform-canary/.test(l)), 'el canario no va por Traefik');
    assert.ok(L.some((l) => /^network connect onia_selfhosted_onia_internal onia-platform-canary-/.test(l)), 'el canario no ve LiteLLM');
    assert.ok(i(/^stop onia-platform$/) > i(/^exec onia-platform-canary-.* sh -c/), 'paró producción antes de probar el canario');
    assert.ok(i(/^rename onia-platform onia-platform-prev-/) > i(/^stop onia-platform$/));
    const run = L.find((l) => /^run -d --name onia-platform /.test(l));
    assert.ok(run, 'no creó el contenedor nuevo');
    assert.match(run, /--env-file .*app\.env/);
    assert.match(run, /--network supabase_default/);
    assert.match(run, /--restart unless-stopped/);
    assert.ok(run.endsWith(tag), run);
    assert.ok(!/-v |runtime-next|node:20/.test(run), 'volvió a la receta vieja');
    assert.ok(L.includes('network connect easypanel onia-platform'));
    assert.ok(L.includes('network connect dentalgest-staging-supabase_default onia-platform'));
    assert.ok(L.includes('network connect onia_selfhosted_onia_internal onia-platform'), 'sin la red de LiteLLM los agentes caen mudos');
    assert.ok(L.includes('exec onia-platform nc -z kong 8000'));
    assert.ok(L.some((l) => /^curl https:\/\/app\.onia\.com\.bo\/login\?cb=/.test(l)), 'no verificó contra lo público');
    assert.ok(L.includes('rm onia-platform-prev-cccc'), 'no podó el prev viejo');
    assert.ok(!L.includes('rm onia-platform-prev-aaaa') && !L.includes('rm onia-platform-prev-bbbb'));
    assert.ok(L.includes('image rm onia-platform:release-22222222'));
    assert.ok(!L.some((l) => /^image rm .*release-(7bcd0a83|11111111)/.test(l) || l === `image rm ${tag}`));
    assert.ok(L.some((l) => l === 'rm -f onia-platform-canary-viejo'), 'no barrió el canario viejo');
    assert.ok(!L.some((l) => /^image rm -f|^rm -f onia-platform-prev/.test(l)), 'forzó un borrado que un rollback necesita');
  } finally {
    limpiar(m);
  }
});

// La red de LiteLLM es igual de obligatoria: sin ella `onia_selfhosted-litellm-1` no resuelve y
// el agente no falla fuerte, contesta sin IA. Mejor el rollback que un deploy "sano" a medias.
test('swap: si no puede conectar la red de LiteLLM al contenedor nuevo, ROLLBACK', () => {
  const m = mundo();
  try {
    const r = correr(m, SWAP, [m.sha], { STUB_RED_FALLA: 'onia_selfhosted_onia_internal' });
    assert.equal(r.codigo, 1);
    assert.match(r.salida, /ROLLBACK: no pude conectar la red onia_selfhosted_onia_internal/);
    assert.ok(r.llamadas.some((l) => /^rename onia-platform-prev-\S+ onia-platform$/.test(l)));
  } finally {
    limpiar(m);
  }
});

test('swap: si después del swap no llega a kong, ROLLBACK automático al prev', () => {
  const m = mundo();
  try {
    const r = correr(m, SWAP, [m.sha], { STUB_FALLA: 'kong' });
    assert.equal(r.codigo, 1);
    assert.match(r.salida, /ROLLBACK: no llega a kong:8000/);
    const L = r.llamadas;
    const desde = L.findIndex((l) => /^run -d --name onia-platform /.test(l));
    const despues = L.slice(desde);
    const rm = despues.indexOf('rm -f onia-platform');
    const vuelta = despues.findIndex((l) => /^rename onia-platform-prev-\S+ onia-platform$/.test(l));
    const arranca = despues.indexOf('start onia-platform');
    assert.ok(rm > 0 && vuelta > rm && arranca > vuelta, `rollback incompleto: ${despues.join(' | ')}`);
    assert.ok(!L.some((l) => /^rm (-f )?onia-platform-prev-/.test(l)), 'borró el prev: el rollback se quedó sin piso');
  } finally {
    limpiar(m);
  }
});

// Adentro todo sano y afuera Traefik sirve otra cosa: el cliente no ve el deploy. Eso
// también es un fallo, y es el que un 200 esconde.
test('swap: si lo público no sirve el build nuevo, ROLLBACK', () => {
  const m = mundo();
  try {
    const r = correr(m, SWAP, [m.sha], { STUB_FALLA: 'publico' });
    assert.equal(r.codigo, 1);
    assert.match(r.salida, /ROLLBACK: https:\/\/app\.onia\.com\.bo\/login no sirve el build/);
    assert.ok(r.llamadas.some((l) => /^rename onia-platform-prev-\S+ onia-platform$/.test(l)));
  } finally {
    limpiar(m);
  }
});

// ── recreate-container.sh ───────────────────────────────────────────────────

test('recreate sin --si-estoy-seguro no toca nada', () => {
  const m = mundo();
  try {
    const r = correr(m, RECREAR, []);
    assert.equal(r.codigo, 2);
    assert.deepEqual(r.llamadas, []);
  } finally {
    limpiar(m);
  }
});

test('recreate usa la MISMA imagen que corre (por docker inspect), nunca node:20 + runtime-next', () => {
  const m = mundo();
  try {
    const r = correr(m, RECREAR, ['--si-estoy-seguro', '--dry-run'], { STUB_BUILD_NUEVO: VIVO });
    assert.equal(r.codigo, 0, r.salida);
    assert.match(r.salida, /imagen: onia-platform:release-7bcd0a83 \(build FU8j_OHPyRH1XCCr6-0uY\)/);
    assert.ok(!/node:20|runtime-next/.test(r.salida));
    assert.deepEqual(r.llamadas.filter(muta), []);
    assert.ok(!readFileSync(RECREAR, 'utf8').split('\n').some((l) => !l.startsWith('#') && /node:20|runtime-next/.test(l)));
  } finally {
    limpiar(m);
  }
});

test('recreate se niega si el vivo todavía monta /app (receta vieja): lo dejaría vacío', () => {
  const m = mundo();
  try {
    const r = correr(m, RECREAR, ['--si-estoy-seguro'], { STUB_MONTAJES: '/app', STUB_BUILD_NUEVO: VIVO });
    assert.equal(r.codigo, 1);
    assert.match(r.salida, /monta \/app/);
    assert.deepEqual(r.llamadas.filter(muta), []);
  } finally {
    limpiar(m);
  }
});

test('recreate se niega si el vivo sirve otro build que la imagen que dice correr', () => {
  const m = mundo();
  try {
    const r = correr(m, RECREAR, ['--si-estoy-seguro']);
    assert.equal(r.codigo, 1);
    assert.match(r.salida, /no es la misma/);
    assert.deepEqual(r.llamadas.filter(muta), []);
  } finally {
    limpiar(m);
  }
});

test('recreate feliz: stop, rename a prev, run con la misma imagen y las 4 redes', () => {
  const m = mundo();
  try {
    const r = correr(m, RECREAR, ['--si-estoy-seguro'], { STUB_BUILD_NUEVO: VIVO });
    assert.equal(r.codigo, 0, r.salida);
    const run = r.llamadas.find((l) => /^run -d --name onia-platform /.test(l));
    assert.ok(run?.endsWith('onia-platform:release-7bcd0a83'), run);
    for (const red of ['easypanel', 'dentalgest-staging-supabase_default', 'onia_selfhosted_onia_internal']) {
      assert.ok(r.llamadas.includes(`network connect ${red} onia-platform`), `recrear perdió la red ${red}`);
    }
  } finally {
    limpiar(m);
  }
});

// ── lo que no se toca ───────────────────────────────────────────────────────

// El freno de precio de publicar-solo.sh lee el `git archive` del armador para saber qué
// viaja. La plataforma archiva el repo ENTERO, así que TODO viaja y el freno mira cada
// fuente de precio. Si el armador nuevo se leyera como "archiva unos subárboles", el freno
// dejaría pasar un precio sin firma: la dirección cara.
test('el freno de precio sigue viendo que en la plataforma TODO viaja', () => {
  for (const archivo of ['lib/pricing.ts', 'lib/subscription-plans.ts']) {
    const r = spawnSync('bash', [PUBLICAR_SOLO, '--viaja', BUILD, archivo], { encoding: 'utf8' });
    assert.equal(r.stdout.trim(), 'viaja', `${archivo}: ${r.stdout}${r.stderr}`);
  }
});

test('publicar.sh llama al swap por imagen, no al deploy-gates-swap de runtime-next', () => {
  const codigo = readFileSync(PUBLICAR, 'utf8').split('\n').filter((l) => !l.trimStart().startsWith('#')).join('\n');
  assert.match(codigo, /bash "\$BASE\/swap-imagen\.sh" "\$HEAD"/);
  assert.ok(!codigo.includes('deploy-gates-swap.sh'));
});

test('todos los guiones del pipeline pasan bash -n', () => {
  for (const g of [BUILD, SWAP, RECREAR, PUBLICAR]) {
    const r = spawnSync('bash', ['-n', g], { encoding: 'utf8' });
    assert.equal(r.status, 0, `${g}: ${r.stderr}`);
  }
});

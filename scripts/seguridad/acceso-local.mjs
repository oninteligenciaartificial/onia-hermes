import { readFile, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const registryPath = fileURLToPath(new URL('../../hermes-content/config/accesos-personales.json', import.meta.url));
const help = `Uso: node scripts/seguridad/acceso-local.mjs [--app <id>] [--json]
     node scripts/seguridad/acceso-local.mjs --help

Preflight local de sólo lectura: registro no secreto y metadatos de dos rutas
de bóveda bajo el directorio personal. No abre .kdbx, lee cookies, prueba sesiones,
conecta API/CLI, hace red ni automatiza apps. --app filtra un id del registro.
Los estados de apps son evidencias puntuales, no acceso runtime confirmado.`;

export function parseArgs(args) {
  const options = { json: false, app: undefined, help: false };
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--json' && !options.json) options.json = true;
    else if (args[i] === '--help' && !options.help) options.help = true;
    else if (args[i] === '--app' && options.app === undefined && /^[a-z][a-z0-9-]{0,63}$/.test(args[i + 1] ?? '')) options.app = args[++i];
    else throw new Error('Argumentos inválidos. Consulte --help.');
  }
  return options;
}

export async function loadRegistry() {
  // Única lectura de contenido: este JSON versionado y no secreto. Nunca .kdbx.
  try {
    const registry = JSON.parse(await readFile(registryPath, 'utf8'));
    if (registry.schemaVersion !== 1 || !Array.isArray(registry.apps)) throw new Error();
    return registry;
  } catch {
    throw new Error('No se pudo cargar el registro no secreto canónico.');
  }
}

async function metadata(filePath, inspect) {
  try {
    const result = await inspect(filePath);
    return { path: filePath, exists: true, isFile: result.isFile(), sizeBytes: result.isFile() ? result.size : null, status: result.isFile() ? 'file_present' : 'not_a_file' };
  } catch (error) {
    return { path: filePath, exists: error.code === 'ENOENT' || error.code === 'ENOTDIR' ? false : null, isFile: false,
      status: error.code === 'ENOENT' || error.code === 'ENOTDIR' ? 'absent' : 'metadata_unavailable' };
  }
}

export async function preflight({ registry, app, homeDir = homedir(), inspect = stat } = {}) {
  const source = registry ?? await loadRegistry();
  const apps = app === undefined ? source.apps : source.apps.filter((item) => item.id === app);
  if (app !== undefined && apps.length === 0) throw new Error('App desconocida. Consulte los ids del registro sin --app.');
  const expected = await metadata(path.join(homeDir, 'BovedaPrivada', 'Agentes.kdbx'), inspect);
  const fallback = await metadata(path.join(homeDir, 'OneDrive', 'Escritorio', 'Contraseñas.kdbx'), inspect);
  const status = expected.isFile ? 'expected_present' : fallback.isFile ? 'outside_expected_path' :
    [expected, fallback].some((item) => item.status === 'metadata_unavailable') ? 'metadata_unavailable' : 'not_found_at_known_paths';
  return {
    mode: 'readonly_metadata_and_nonsecret_registry',
    checkedAt: new Date().toISOString(),
    runtimeAccess: 'not_tested',
    runtimeCheckRequired: true,
    evidenceDate: source.evidenceDate,
    evidenceReport: { date: source.evidenceDate, type: 'historical_record_not_runtime_verification' },
    evidenceScope: 'Histórico puntual del registro; requiere comprobar sesión, cuenta y permisos en la tarea actual.',
    purpose: source.purpose,
    policy: source.policy,
    vault: {
      status, expected, fallback,
      nextAction: status === 'expected_present' ? 'Comprobar el mecanismo autorizado y la sesión de la app; presencia no prueba desbloqueo ni acceso API/CLI.' :
        status === 'outside_expected_path' ? 'Sergio debe confirmar la base activa y usar Guardar como en KeePassXC para la ubicación local prevista. No mover ni copiar automáticamente; esta ubicación no impide reutilizar una sesión web autorizada vigente.' :
        status === 'metadata_unavailable' ? 'Revisar permisos de metadatos con intervención humana; no intentar leer la bóveda.' :
        'Confirmar con Sergio la ubicación de la base activa; no se buscaron otras rutas ni se creó una bóveda. Su ausencia aquí no impide reutilizar una sesión web autorizada vigente.',
    },
    recordedMechanisms: source.mechanisms,
    apps,
    pendingChecks: ['Rellenado/login con KeePassXC-Browser no comprobado.', 'Acceso a una app desde Claude aún no probado.', 'API/CLI directa a KeePass no configurada.', 'Sesiones vigentes y disponibilidad de conectores deben comprobarse al usar una app.'],
  };
}

export function formatReport(report) {
  return [
    'Preflight de acceso local (sólo lectura)',
    `Acceso runtime: ${report.runtimeAccess}. Evidencias del registro: ${report.evidenceDate} (puntuales).`,
    report.purpose,
    `Bóveda: ${report.vault.status}`,
    `Ruta prevista: ${report.vault.expected.path} — ${report.vault.expected.status}`,
    `Ruta alternativa: ${report.vault.fallback.path} — ${report.vault.fallback.status}`,
    `Siguiente acción: ${report.vault.nextAction}`,
    ...Object.entries(report.recordedMechanisms).map(([name, value]) => `${name}: ${typeof value === 'string' ? value : `${value.status}. ${value.evidence}`}`),
    ...report.apps.map((app) => `${app.id} (${app.name}): ${app.status}; método: ${app.method}\n  Evidencia: ${app.evidence}\n  Siguiente acción: ${app.nextAction}`),
    `Alcance: ${report.policy.scope}`,
    `Acciones sensibles: ${report.policy.sensitiveActions.join(', ')}.`,
    `Pendiente: ${report.pendingChecks.join(' ')}`,
  ].join('\n');
}

export async function runCli(args, { stdout = process.stdout, stderr = process.stderr } = {}) {
  let options;
  try {
    options = parseArgs(args);
    if (options.help) { stdout.write(`${help}\n`); return 0; }
    const result = await preflight({ app: options.app });
    stdout.write(`${options.json ? JSON.stringify(result, null, 2) : formatReport(result)}\n`);
    return 0;
  } catch (error) {
    // Sólo mensajes internos controlados, sin eco de argumentos, stack ni valores del FS.
    const allowed = ['Argumentos inválidos. Consulte --help.', 'App desconocida. Consulte los ids del registro sin --app.', 'No se pudo cargar el registro no secreto canónico.'];
    const message = allowed.includes(error.message) ? error.message : 'No se pudo completar el preflight local.';
    if (options?.json || args.includes('--json')) stderr.write(`${JSON.stringify({ error: message }, null, 2)}\n`);
    else stderr.write(`${message}\n`);
    return 1;
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  process.exitCode = await runCli(process.argv.slice(2));
}

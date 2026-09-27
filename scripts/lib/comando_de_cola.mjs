/**
 * comando_de_cola.mjs — la guarda que decide si un comando SACADO DE UN DOCUMENTO se puede correr,
 * y como spawnearlo sin shell.
 *
 * VIVE ACA, Y NO EN QUIEN LO USA, desde el 2026-09-26: lo necesitan `bloqueos_vencidos.mjs` (corre
 * el `**Verificador:**` de las filas de «Bloqueado en Sergio») y `evidencia_citada_viva.mjs` (corre
 * el gate que una linea cita como evidencia). El primero ya lo exportaba, pero **importarlo es
 * imposible**: su CLI corre a nivel de modulo y sin guarda de `argv[1]`, asi que el `import`
 * imprime el uso y mata al proceso que lo pide (medido: el callback del importador nunca corre).
 * Es el mismo patron que ya se pago en `demo_agendada_real.mjs`.
 *
 * Copiar la guarda en el segundo consumidor era la otra salida, y es peor: es la parte que decide
 * QUE SE EJECUTA, y dos copias de eso divergen — una se endurece y la otra no. Se comparte, como ya
 * se hizo con `frases_de_cola.mjs` por la misma razon y el mismo dia.
 *
 * ⚠️ POR QUE EXISTE LA GUARDA. Un gate que ejecuta texto arbitrario sacado de un documento es peor
 * que el problema que tapa: cualquiera que edite una cola estaria escribiendo comandos que el cron
 * corre como root. Solo se aceptan DOS formas, las dos validadas ANTES de ejecutar, y siempre con
 * `execFileSync` y argumentos como array — nunca con shell, asi que el texto del documento jamas se
 * interpreta como comando.
 */

import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve, relative, isAbsolute } from 'node:path';

/** La raiz del repo: este archivo vive en `scripts/lib/`, o sea dos niveles adentro. */
export const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * La guarda, separada de la ejecucion a proposito: es la parte que decide si algo se corre, y esa
 * parte se prueba sin correr nada.
 */
export function validarComando(comando, scripts, existe = (p) => existsSync(join(RAIZ, p))) {
  const npm = /^npm run ([\w:.-]+)$/.exec(comando);
  if (npm) {
    if (!(npm[1] in scripts)) return { error: `\`npm run ${npm[1]}\` no existe en package.json` };
    return { bin: 'npm', args: ['run', '--silent', npm[1]] };
  }

  const nodo = /^node ([\w./-]+)$/.exec(comando);
  if (nodo) {
    const ruta = nodo[1];
    if (isAbsolute(ruta) || ruta.split('/').includes('..')) return { error: `la ruta \`${ruta}\` se sale del repo` };
    const abs = resolve(RAIZ, ruta);
    const dentro = relative(RAIZ, abs);
    if (dentro.startsWith('..')) return { error: `la ruta \`${ruta}\` se sale del repo` };
    if (!/\.(mjs|js)$/.test(ruta)) return { error: `\`${ruta}\` no es un script de node` };
    if (!existe(ruta)) return { error: `\`${ruta}\` no existe en el repo` };
    return { bin: 'node', args: [abs] };
  }

  return { error: 'solo se aceptan `npm run <script>` y `node <ruta del repo>`' };
}

/**
 * Traduce el plan validado a algo que ESTA plataforma pueda spawnear sin shell.
 *
 * En Windows `npm` es `npm.cmd`, y Node se niega a spawnear `.cmd`/`.bat` sin shell
 * (CVE-2024-27980). Con `bin: 'npm'` pelado, en win32 TODOS los verificadores npm morian en el
 * spawn → `status` null → `no-medido`, y un bloqueo ya satisfecho (S17, 2026-09-12) quedaba
 * invisible — el molde exacto por el que S16 vencio en silencio. Se corre el JS de npm con
 * este MISMO node: sin shell, sin cmd.exe, la guarda de `validarComando` intacta.
 */
export function resolverBin(plan, plataforma = process.platform, existe = existsSync) {
  if (plan.error || plan.bin !== 'npm' || plataforma !== 'win32') return plan;
  const cli = join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
  if (!existe(cli)) return plan; // sin npm-cli.js a la vista, el intento directo al menos avisa
  return { bin: process.execPath, args: [cli, ...plan.args] };
}

// Carpeta de la sesion de IG de la PC (perfil de Playwright + cookies.txt), fuera de Git.
// ONIA_IG_SESSION manda. Si no, la del checkout PRINCIPAL: un worktree no tiene .hermes/
// (medido el 19-oct-2026: fetch-video buscaba <worktree>/.hermes/ig-session, que no existe).
import { execFileSync } from 'node:child_process';
import path from 'node:path';

function mainCheckout() {
  try {
    const common = execFileSync('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], {
      cwd: import.meta.dirname,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return path.dirname(common); // <checkout principal>/.git -> <checkout principal>
  } catch {
    return path.resolve(import.meta.dirname, '../../../..'); // sin git (zip de la nube)
  }
}

export const IG_SESSION =
  process.env.ONIA_IG_SESSION || path.join(mainCheckout(), '.hermes', 'ig-session');

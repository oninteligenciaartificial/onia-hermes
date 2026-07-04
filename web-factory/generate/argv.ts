/**
 * Sanitize argv before handing it to commander.
 *
 * The Web Factory runbook documents commands as `pnpm <script> -- <args>`
 * (e.g. `pnpm factory:build -- --input data/intakes/<slug>.json`). pnpm 10.x
 * forwards the bare `--` separator into the script's argv, and commander then
 * treats it as an excess positional argument, failing with "too many arguments"
 * or "required option not specified". None of these CLIs need `--` passthrough,
 * so dropping bare `--` tokens makes the documented commands parse correctly
 * regardless of how the package manager forwards them.
 */
export function sanitizeCliArgv(argv: readonly string[]): string[] {
  return argv.filter((arg) => arg !== "--");
}

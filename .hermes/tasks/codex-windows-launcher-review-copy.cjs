'use strict';
// Local compatibility adapter: Codex's Windows command boundary can re-escape
// embedded quotes. Keep the configured command quote-free; use argument arrays
// below. Never log event contents, prompts, tool responses, or child output.
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const action = process.argv[2];
const actions = new Set(['version-check', 'start', 'context', 'session-init', 'file-context', 'observation', 'summarize', 'impeccable']);
let input = Buffer.alloc(0);
let result;
let event = null;
let displayFlagAdapted = false;
try {
  if (process.argv.length !== 3 || !actions.has(action)) throw new Error('Unsupported hook action');
  input = fs.readFileSync(0);
  try {
    const name = JSON.parse(input.toString('utf8')).hook_event_name;
    if (['SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PostToolUse', 'Stop', 'fixture'].includes(name)) event = name;
  } catch {}
  let args;
  const env = { ...process.env };
  if (action === 'impeccable') {
    const root = cp.execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8', windowsHide: true }).trim();
    args = [path.join(root, '.agents', 'skills', 'impeccable', 'scripts', 'hook.mjs')];
  } else {
    const root = env.CLAUDE_PLUGIN_ROOT || env.PLUGIN_ROOT;
    if (!root || !path.isAbsolute(root)) throw Object.assign(new Error('Missing absolute plugin root'), { code: 'MISSING_PLUGIN_ROOT' });
    if (action === 'version-check') {
      env.CLAUDE_MEM_CODEX_HOOK = '1';
      args = [path.join(root, 'scripts', 'version-check.js')];
    } else {
      args = [path.join(root, 'scripts', 'bun-runner.js'), path.join(root, 'scripts', 'worker-service.cjs')];
      args.push(...(action === 'start' ? ['start'] : ['hook', 'codex', action]));
    }
  }
  if (!fs.existsSync(args[0])) throw Object.assign(new Error('Hook entry point is missing'), { code: 'MISSING_ENTRY_POINT' });
  result = cp.spawnSync(process.execPath, args, { input, env, shell: false, windowsHide: true, maxBuffer: 16 * 1024 * 1024 });
  let forwarded = result.stdout;
  // Codex 0.163 rejects this Claude-compatible DISPLAY flag in Pre/PostToolUse.
  // Keep continue:false, stopReason, permissionDecision, and every other field.
  // Failed commands and malformed JSON are passed through, never made green.
  if (result.status === 0 && ['file-context', 'observation'].includes(action) && forwarded?.length) {
    try {
      const value = JSON.parse(forwarded.toString('utf8'));
      if (value && !Array.isArray(value) && typeof value === 'object' && value.suppressOutput === true) {
        delete value.suppressOutput;
        forwarded = Buffer.from(JSON.stringify(value) + '\n');
        displayFlagAdapted = true;
      }
    } catch { /* Let Codex report malformed output. */ }
  }
  if (forwarded) process.stdout.write(forwarded);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.error) throw result.error;
} catch (err) {
  // Do not echo potentially sensitive exception messages or payloads.
  process.stderr.write('[onia-hook-launcher] Launch failed (' + (err.code || err.name || 'Error') + ')\n');
  result = { status: 1, error: err };
}
const exitCode = Number.isInteger(result.status) ? result.status : 1;
try {
  fs.appendFileSync(path.join(__dirname, 'execution.jsonl'), JSON.stringify({
    timestamp: new Date().toISOString(), action, event, nodeVersion: process.version,
    pluginRootPresent: Boolean(process.env.CLAUDE_PLUGIN_ROOT || process.env.PLUGIN_ROOT), displayFlagAdapted,
    inputBytes: input.length, stdoutBytes: result.stdout?.length || 0,
    stderrBytes: result.stderr?.length || 0, exitCode,
    errorCode: result.error?.code || null, signal: result.signal || null
  }) + '\n');
} catch {
  process.stderr.write('[onia-hook-launcher] Execution trace could not be written\n');
  process.exit(1);
}
process.exit(exitCode);

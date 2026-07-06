'use strict';
// Runs every *.test.js in this folder, each in its own process (isolated
// counters, async-safe). Zero network, zero spend. Run: node test/all.test.js
const { readdirSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const dir = __dirname;
const files = readdirSync(dir)
  .filter((f) => f.endsWith('.test.js') && f !== 'all.test.js')
  .sort();

let failed = 0;
for (const f of files) {
  const r = spawnSync(process.execPath, [path.join(dir, f)], { stdio: 'inherit' });
  if (r.status !== 0) failed++;
}
console.log(failed ? `SUITE FAIL: ${failed}/${files.length} file(s) failed` : `SUITE OK: ${files.length} files passed`);
process.exit(failed ? 1 : 0);

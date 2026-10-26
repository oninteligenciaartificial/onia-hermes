import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const manifest = JSON.parse(readFileSync(new URL('../jobs/harness-readiness-20261025/REPO-OUTPUT-MOVE-RECEIPT.json', import.meta.url), 'utf8'));
for (const item of manifest.movimientos) { const p=join(process.cwd(), item.destino); assert.ok(existsSync(p), p); assert.equal(createHash('sha256').update(readFileSync(p)).digest('hex'), item.sha256, p); assert.ok(!existsSync(join(process.cwd(), item.origen)), item.origen); }
assert.equal(manifest.movimientos.length, 18);
console.log('PASS: 18 archivos presentes en destino, origen ausente y SHA-256 íntegro');

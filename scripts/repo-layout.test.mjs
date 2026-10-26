import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const moved = path.join(root, 'scripts/mara-voice-merge.js');
const old = path.join(root, 'hermes-scripts/mara-voice-merge.js');
const consumer = path.join(root, 'scripts/vps-deploy-v3-final.js');

test('moved script exists and old path is absent', () => {
  assert.ok(fs.statSync(moved).isFile());
  assert.equal(fs.existsSync(old), false);
});

test('consumer resolves local script and keeps VPS destination', () => {
  const source = fs.readFileSync(consumer, 'utf8');
  assert.match(source, /path\.resolve\(__dirname, '\.\/mara-voice-merge\.js'\)/);
  assert.equal(path.resolve(path.dirname(consumer), './mara-voice-merge.js'), moved);
  assert.match(source, /open\('\/root\/\.hermes\/scripts\/mara-voice-merge\.js'/);
});

test('moved script and consumer pass node --check', () => {
  for (const file of [moved, consumer]) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr || result.stdout);
  }
});

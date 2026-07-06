// Minimal test harness (mirrors scripts/carousel_render.test.js style).
// Dependency-free. Shared counters so test/all.test.js can print a grand total.
'use strict';

let passed = 0;
let failed = 0;

/**
 * Runs sync tests immediately. If fn returns a promise (async test), returns
 * that promise so async callers can await before calling summary().
 * @param {string} name
 * @param {() => void | Promise<void>} fn
 */
function test(name, fn) {
  const ok = () => {
    passed++;
    console.log(`  ok - ${name}`);
  };
  const bad = (e) => {
    failed++;
    console.log(`  FAIL - ${name}: ${e && e.message}`);
  };
  try {
    const r = fn();
    if (r && typeof r.then === 'function') {
      return r.then(ok, bad);
    }
    ok();
  } catch (e) {
    bad(e);
  }
  return undefined;
}

/**
 * @param {string} label
 */
function summary(label) {
  console.log(`[${label}] ${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exitCode = 1;
  return { passed, failed };
}

module.exports = { test, summary };

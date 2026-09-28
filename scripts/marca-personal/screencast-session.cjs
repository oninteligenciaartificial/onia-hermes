'use strict';

/**
 * Playwright screencasts for Samuel. Does not navigate, inspect credentials,
 * publish workflows or generate paid media. Reuses the explicitly named profile.
 *
 * const capture = require('./screencast-session.cjs');
 * capture.configure({ chromium: require('playwright').chromium }); // optional
 * const s = await capture.launch('n8n', { record: true });
 * await s.run(() => s.page.goto(knownUrl)); // wrap direct Playwright actions
 * await s.moveClick(s.page.getByRole('button', { name: 'Example', exact: true }));
 * await s.finish('n8n-demo', { trimStart: 2, trimEnd: 1 });
 *
 * Durations: pause/movement/type delays are milliseconds. finish trims SECONDS
 * from the beginning/end. Failed helpers/run calls prevent successful promotion.
 * Raw videos remain in _crudo. Existing final files are never overwritten.
 */
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { execFile } = require('node:child_process');
const { promisify } = require('node:util');
const execFileAsync = promisify(execFile);

const PROFILES = 'E:/ONIA-YouTube/grabaciones/_perfiles';
const DEFAULT_OUTPUT = 'E:/ONIA-YouTube/grabaciones/samuel';
const DEFAULT_VIEWPORT = { width: 1440, height: 900 };
const configured = {
  chromium: null,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  ffmpegPath: 'ffmpeg',
  ffprobePath: 'ffprobe',
};

function configure(options = {}) {
  for (const key of Object.keys(options)) {
    if (!Object.hasOwn(configured, key)) throw new Error(`Unknown configure option: ${key}`);
  }
  Object.assign(configured, options);
}

function getChromium() {
  if (configured.chromium) return configured.chromium;
  for (const moduleName of ['playwright', 'playwright-core']) {
    try { return require(moduleName).chromium; }
    catch (error) { if (error.code !== 'MODULE_NOT_FOUND') throw error; }
  }
  throw new Error('Playwright unavailable. Call configure({ chromium }) with your loaded Playwright module.');
}

// Runs in the browser. DOMContentLoaded handles addInitScript's early execution.
function installCursor() {
  if (window !== window.top || window.__samuelCursorInstalled) return;
  window.__samuelCursorInstalled = true;
  let cursor;
  let last = { x: innerWidth / 2, y: innerHeight / 2 };
  const mount = () => {
    if (!document.body) return;
    if (!cursor) {
      cursor = document.createElement('div');
      cursor.id = '__samuel-screencast-cursor';
      cursor.setAttribute('aria-hidden', 'true');
      cursor.style.cssText = 'position:fixed;width:24px;height:24px;z-index:2147483647;pointer-events:none;border-radius:50%;background:rgba(15,23,42,.9);border:3px solid white;box-shadow:0 2px 12px #0008;transform:translate(-50%,-50%);transition:width .12s,height .12s;box-sizing:border-box';
    }
    if (!cursor.isConnected) document.body.appendChild(cursor);
    cursor.style.left = `${last.x}px`;
    cursor.style.top = `${last.y}px`;
  };
  document.addEventListener('mousemove', (event) => {
    last = { x: event.clientX, y: event.clientY };
    mount();
  }, true);
  document.addEventListener('mousedown', () => {
    mount();
    if (cursor) cursor.style.width = cursor.style.height = '18px';
  }, true);
  document.addEventListener('mouseup', () => {
    if (cursor) cursor.style.width = cursor.style.height = '24px';
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
}

function validateViewport(viewport) {
  for (const key of ['width', 'height']) {
    if (!Number.isInteger(viewport[key]) || viewport[key] < 2 || viewport[key] % 2 !== 0) {
      throw new Error(`viewport.${key} must be a positive even integer (H.264 yuv420p).`);
    }
  }
}

function nonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new Error(`${name} must be nonnegative and finite.`);
  return value;
}

async function probe(file, executable) {
  const { stdout } = await execFileAsync(executable, [
    '-v', 'error', '-show_entries', 'format=duration,size:stream=codec_type,codec_name,width,height,avg_frame_rate',
    '-of', 'json', file,
  ], { windowsHide: true, timeout: 60000, maxBuffer: 1024 * 1024 });
  const data = JSON.parse(stdout);
  const stream = data.streams?.find((item) => item.codec_type === 'video');
  if (!stream) throw new Error('ffprobe found no video stream.');
  const duration = Number(data.format?.duration);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('ffprobe found no positive video duration.');
  const [numerator, denominator] = String(stream.avg_frame_rate).split('/').map(Number);
  return {
    duration,
    bytes: Number(data.format.size),
    width: stream.width,
    height: stream.height,
    codec: stream.codec_name,
    fps: numerator / denominator,
  };
}

async function launch(site, { record = false, outputDir = DEFAULT_OUTPUT, viewport = DEFAULT_VIEWPORT } = {}) {
  if (!['n8n', 'higgsfield', 'github'].includes(site)) throw new Error('Unknown site; expected n8n, higgsfield or github.');
  validateViewport(viewport);
  if (!path.isAbsolute(configured.executablePath)) throw new Error('Chrome executablePath must be absolute.');
  const chromium = getChromium();
  const executables = { ...configured };
  const output = path.resolve(outputDir);
  const rawDir = path.join(output, '_crudo', `${site}-${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`);
  if (record) await fsp.mkdir(rawDir, { recursive: true });
  const context = await chromium.launchPersistentContext(path.join(PROFILES, site), {
    executablePath: executables.executablePath,
    headless: true,
    viewport: { ...viewport },
    ...(record ? { recordVideo: { dir: rawDir, size: { ...viewport } } } : {}),
  });
  const page = context.pages()[0] || await context.newPage();
  const video = record ? page.video() : null;
  let failed = null;
  let closing = false;
  let closed = false;
  let finalized = false;
  let closePromise = null;
  let position = { x: viewport.width / 2, y: viewport.height / 2 };
  const rememberFailure = (error) => { failed ||= error instanceof Error ? error : new Error(String(error)); };
  page.on('crash', () => rememberFailure(new Error('The recording page crashed.')));
  page.on('close', () => { if (!closing) rememberFailure(new Error('The recording page closed before finish.')); });
  context.on('close', () => { if (!closing) rememberFailure(new Error('The recording context closed before finish.')); });

  async function close() {
    if (!closePromise) {
      closing = true;
      closePromise = context.close().then(() => { closed = true; });
    }
    return closePromise;
  }

  async function run(action) {
    if (closed || closing || finalized) throw new Error('Session is already closing or closed.');
    if (failed) throw new Error('Session previously failed; abort and record a new take.', { cause: failed });
    try { return await action(); }
    catch (error) { rememberFailure(error); throw error; }
  }

  async function pause(ms = 1000) {
    return run(() => page.waitForTimeout(nonNegative(ms, 'pause milliseconds')));
  }

  async function move(x, y, { duration = 500, steps = 25 } = {}) {
    return run(async () => {
      if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || y < 0 || x > viewport.width || y > viewport.height) {
        throw new Error('Cursor destination must be within the viewport.');
      }
      nonNegative(duration, 'movement duration');
      if (!Number.isInteger(steps) || steps < 1) throw new Error('Movement steps must be a positive integer.');
      const start = { ...position };
      for (let step = 1; step <= steps; step++) {
        const t = step / steps;
        const eased = t * t * (3 - 2 * t);
        await page.mouse.move(start.x + (x - start.x) * eased, start.y + (y - start.y) * eased);
        if (duration) await page.waitForTimeout(duration / steps);
      }
      position = { x, y };
    });
  }

  async function moveClick(locator, { settle = 900, duration = 500, timeout = 15000 } = {}) {
    return run(async () => {
      nonNegative(settle, 'settle');
      await locator.waitFor({ state: 'visible', timeout });
      await locator.scrollIntoViewIfNeeded({ timeout });
      const box = await locator.boundingBox();
      if (!box) throw new Error('Click target has no visible bounding box.');
      await move(box.x + box.width / 2, box.y + box.height / 2, { duration });
      await page.waitForTimeout(200);
      await locator.click({ timeout });
      if (settle) await page.waitForTimeout(settle);
    });
  }

  async function type(locator, text, { delay = 35, settle = 600, clear = true, timeout = 15000 } = {}) {
    return run(async () => {
      nonNegative(delay, 'typing delay');
      nonNegative(settle, 'settle');
      if (typeof text !== 'string') throw new Error('Typing text must be a string.');
      await moveClick(locator, { settle: 150, timeout });
      if (clear) await locator.fill('', { timeout });
      await locator.pressSequentially(text, { delay, timeout: Math.max(timeout, text.length * delay + 5000) });
      if (settle) await page.waitForTimeout(settle);
    });
  }

  async function abort(reason = 'Take aborted') {
    rememberFailure(reason);
    await close();
    return { complete: false, recorded: record, rawDir: record ? rawDir : null, reason: failed.message };
  }

  async function finish(name, { trimStart = 0, trimEnd = 0 } = {}) {
    if (finalized) throw new Error('This take has already been finalized.');
    finalized = true;
    try {
      if (failed) throw new Error('Failed take cannot be promoted. Use a new session.', { cause: failed });
      nonNegative(trimStart, 'trimStart seconds');
      nonNegative(trimEnd, 'trimEnd seconds');
      if (record && (typeof name !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\.|$)/i.test(name))) {
        throw new Error('Recording name must be a safe filename without directories.');
      }
      await close();
      if (!record) return { complete: true, recorded: false };
      if (!video) throw new Error('Playwright did not create a recording.');
      const rawPath = await video.path();
      const raw = await probe(rawPath, executables.ffprobePath);
      const duration = raw.duration - trimStart - trimEnd;
      if (duration < 0.5) throw new Error('Trimming must leave at least half a second of video.');
      const finalPath = path.join(output, name.toLowerCase().endsWith('.mp4') ? name : `${name}.mp4`);
      if (fs.existsSync(finalPath)) throw new Error(`Recording already exists: ${finalPath}`);
      const encodedPath = path.join(rawDir, 'validated-take.mp4');
      await execFileAsync(executables.ffmpegPath, [
        '-hide_banner', '-loglevel', 'error', '-n', '-i', rawPath,
        '-ss', String(trimStart), '-t', String(duration), '-map', '0:v:0', '-an',
        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium',
        '-pix_fmt', 'yuv420p', '-r', '30', '-movflags', '+faststart', encodedPath,
      ], { windowsHide: true, timeout: 600000, maxBuffer: 1024 * 1024 });
      const media = await probe(encodedPath, executables.ffprobePath);
      if (media.width !== viewport.width || media.height !== viewport.height || media.codec !== 'h264' || Math.abs(media.fps - 30) > 0.01 || media.bytes < 1000 || Math.abs(media.duration - duration) > 0.2) {
        throw new Error('Encoded video failed dimensions, codec, frame rate, size or duration validation.');
      }
      // Raw and final directories share a volume. An exclusive hard link promotes
      // the complete validated file atomically; a failed copy cannot leave a final.
      // EEXIST protects a filename created while encoding was in progress.
      await fsp.link(encodedPath, finalPath);
      return { complete: true, recorded: true, path: finalPath, rawPath, ...media, trimStart, trimEnd };
    } catch (error) {
      rememberFailure(error);
      try { await close(); } catch { /* Preserve the original recording error. */ }
      throw error;
    }
  }

  try {
    await context.addInitScript(installCursor);
    await page.evaluate(installCursor);
    page.setDefaultTimeout(15000);
    page.setDefaultNavigationTimeout(60000);
  } catch (error) {
    rememberFailure(error);
    await close();
    throw error;
  }
  return { page, context, site, record, viewport: { ...viewport }, rawDir: record ? rawDir : null, run, move, moveClick, type, pause, finish, abort };
}

module.exports = { launch, configure };

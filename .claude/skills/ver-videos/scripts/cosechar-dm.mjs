// ver-videos — cosecha TODOS los posts compartidos en una conversación de Instagram.
//
// Resuelve el problema de "se me complica mandarte los links de a uno": Sergio se loguea UNA
// vez y después esto trae el hilo entero, con autor, caption y tipo, sin que él toque nada.
//
// Uso:
//   node cosechar-dm.mjs --login                 # una sola vez: abre Chrome para loguear IG
//   node cosechar-dm.mjs --hilos                 # lista las conversaciones y su id
//   node cosechar-dm.mjs <threadId> [--scrolls N] [--out DIR]
//
// CÓMO FUNCIONA, y por qué así:
// No le pedimos nada a la API de Instagram — eso devuelve 500 y además el navegador lo bloquea.
// Lo que hacemos es ESCUCHAR lo que la propia página ya pide mientras uno scrollea. Es leer,
// no llamar. Los posts compartidos NO exponen su URL en el DOM (por eso el clic no sirve),
// pero SÍ vienen completos en esas respuestas.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..', '..', '..');
// Perfil PROPIO y aparte del que usa fetch-video.mjs: ese está logueado con otra cuenta y
// pisarlo dejaría el intake de videos sin sesión.
const PROFILE_DIR = path.join(REPO, '.hermes', 'ig-session', 'profile-dm');

const args = process.argv.slice(2);
const wantLogin = args.includes('--login');
const wantHilos = args.includes('--hilos');
const outIdx = args.indexOf('--out');
const OUT = outIdx !== -1 ? args[outIdx + 1] : '.';
const scrIdx = args.indexOf('--scrolls');
const SCROLLS = scrIdx !== -1 ? Number(args[scrIdx + 1]) : 40;
const threadId = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--out' && args[i - 1] !== '--scrolls');

async function abrir(headless) {
  mkdirSync(PROFILE_DIR, { recursive: true });
  const opts = { headless, viewport: { width: 1280, height: 900 }, args: ['--disable-blink-features=AutomationControlled'] };
  return chromium
    .launchPersistentContext(PROFILE_DIR, { ...opts, channel: 'chrome' })
    .catch(() => chromium.launchPersistentContext(PROFILE_DIR, opts));
}

// De la respuesta de un hilo salen items; cada item puede traer un post compartido en varias
// formas distintas según sea reel, post o historia. Se prueban todas.
function extraerDeItem(it) {
  const m = it?.media_share || it?.clip?.clip || it?.clip || it?.story_share?.media
         || it?.felix_share?.video || it?.direct_media_share?.media || null;
  if (!m?.code) return null;
  return {
    code: m.code,
    url: `https://www.instagram.com/p/${m.code}/`,
    autor: m.user?.username || m.owner?.username || null,
    tipo: m.media_type === 2 ? 'video' : (m.carousel_media ? 'carrusel' : 'imagen'),
    laminas: m.carousel_media?.length || null,
    caption: (m.caption?.text || '').replace(/\s+/g, ' ').slice(0, 240) || null,
    ts: it.timestamp ? new Date(Math.floor(it.timestamp / 1000)).toISOString() : null,
  };
}

function recorrer(obj, encontrados) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { obj.forEach((o) => recorrer(o, encontrados)); return; }
  if (obj.item_type || obj.item_id) {
    const e = extraerDeItem(obj);
    if (e && !encontrados.has(e.code)) encontrados.set(e.code, e);
  }
  Object.values(obj).forEach((v) => recorrer(v, encontrados));
}

(async () => {
  if (wantLogin) {
    const ctx = await abrir(false);
    const page = await ctx.newPage();
    await page.goto('https://www.instagram.com/accounts/login/');
    console.error('\n  Logueate con la cuenta que tiene la conversación (sergio_urcullo).');
    console.error('  Cuando veas tu feed, CERRÁ la ventana. La sesión queda guardada.\n');
    await page.waitForEvent('close', { timeout: 0 }).catch(() => {});
    await ctx.close();
    console.error('sesión guardada en ' + PROFILE_DIR);
    return;
  }

  const ctx = await abrir(true);
  const page = await ctx.newPage();
  const encontrados = new Map();
  const hilos = new Map();

  page.on('response', async (res) => {
    const u = res.url();
    if (!/direct_v2|graphql/.test(u)) return;
    let j; try { j = await res.json(); } catch { return; }
    recorrer(j, encontrados);
    // para --hilos: quedarse con id + nombre de cada conversación
    const inbox = j?.inbox?.threads || j?.viewer?.threads || null;
    if (Array.isArray(inbox)) {
      inbox.forEach((t) => {
        const quien = (t.users || []).map((x) => x.username).join(', ') || t.thread_title;
        if (t.thread_id) hilos.set(t.thread_id, quien);
      });
    }
  });

  const destino = wantHilos
    ? 'https://www.instagram.com/direct/inbox/'
    : `https://www.instagram.com/direct/t/${threadId}/`;
  await page.goto(destino, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);

  if (await page.locator('input[name="username"]').count()) {
    console.error('NO hay sesión. Corré una vez:  node cosechar-dm.mjs --login');
    await ctx.close(); process.exit(1);
  }

  if (wantHilos) {
    await page.mouse.wheel(0, 4000).catch(() => {});
    await page.waitForTimeout(2500);
    console.log(JSON.stringify([...hilos.entries()].map(([id, quien]) => ({ id, quien })), null, 1));
    await ctx.close(); return;
  }

  // Scrollear el panel del hilo hacia ARRIBA para que la página pida el historial.
  // La rueda sobre el centro del panel es lo único que mueve la lista virtualizada.
  let previos = -1, quietas = 0;
  for (let i = 0; i < SCROLLS; i++) {
    await page.mouse.move(900, 450);
    await page.mouse.wheel(0, -1200);
    await page.waitForTimeout(900);
    if (encontrados.size === previos) { if (++quietas >= 6) break; } else quietas = 0;
    previos = encontrados.size;
    if (i % 5 === 0) console.error(`  scroll ${i}/${SCROLLS} · ${encontrados.size} compartidos`);
  }

  const lista = [...encontrados.values()].sort((a, b) => (b.ts || '').localeCompare(a.ts || ''));
  mkdirSync(OUT, { recursive: true });
  writeFileSync(path.join(OUT, 'dm-compartidos.json'), JSON.stringify(lista, null, 1));
  writeFileSync(path.join(OUT, 'dm-compartidos.txt'), lista.map((x) => x.url).join('\n') + '\n');

  console.error(`\n${lista.length} posts compartidos → ${OUT}/dm-compartidos.json`);
  console.error('  y las URLs sueltas en dm-compartidos.txt, listas para fetch-video.mjs\n');
  const porAutor = {};
  lista.forEach((x) => { porAutor[x.autor || '?'] = (porAutor[x.autor || '?'] || 0) + 1; });
  console.error('por cuenta: ' + Object.entries(porAutor).sort((a, b) => b[1] - a[1])
    .map(([a, n]) => `${a} (${n})`).join(' · '));
  await ctx.close();
})();

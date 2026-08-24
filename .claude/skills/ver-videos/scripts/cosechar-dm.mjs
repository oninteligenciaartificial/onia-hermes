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
import { mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
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

// Los hilos NO vienen en `inbox.threads` (esa forma murió). Hoy llegan por GraphQL, anidados en
// rutas que cambian solas — vistas el 2026-08-23:
//   data.fetch__SlideMailbox.threads_by_system_folder_and_ig_inbox_folder.edges[].node.as_ig_direct_thread
//   data.get_slide_mailbox_for_iris_subscription.threads_by_folder.edges[].node.as_ig_direct_thread
//   data.get_slide_thread_nullable.as_ig_direct_thread
// Por eso NO se hardcodea la ruta: se recorre todo y se junta lo que TENGA FORMA de hilo.
function recorrerHilos(obj, hilos) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { obj.forEach((o) => recorrerHilos(o, hilos)); return; }
  if (obj.thread_id || obj.thread_key) {
    const quien = obj.thread_title
      || (obj.users || []).map((u) => u.username).filter(Boolean).join(', ')
      || null;
    // el id que sirve en /direct/t/<id> es el corto (thread_key / id), no el largo de 39 digitos
    const nav = obj.thread_key || obj.id || obj.thread_fbid || obj.thread_id;
    if (nav && quien) {
      hilos.set(String(nav), {
        quien,
        ts: obj.last_activity_timestamp_ms ? Number(obj.last_activity_timestamp_ms) : 0,
        grupo: !!obj.is_group,
        ids: [obj.thread_key, obj.id, obj.thread_fbid, obj.thread_id].filter(Boolean).map(String),
      });
    }
  }
  Object.values(obj).forEach((v) => recorrerHilos(v, hilos));
}

// FORMA NUEVA (verificada el 2026-08-23). Un post compartido en un DM ya NO llega como
// `media_share`/`clip`: llega como **XMA** (SlideMessagePortraitXMA), y el unico lugar donde
// esta el shortcode es `target_url`:
//   target_url        https://www.instagram.com/reel/Db9jbZtumB7/?id=3962479061820399739_652...
//   target_id         3962479061820399739          <- id interno, NO el shortcode
//   header_title_text stj.taneja                   <- el autor
// El caption NO viene: hay que traerlo despues con ig-carousel.mjs o fetch-video.mjs.
function extraerDeXma(x) {
  const u = String(x?.target_url || '');
  const m = u.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]{5,20})/);
  if (!m) return null;
  return {
    code: m[1],
    url: `https://www.instagram.com/p/${m[1]}/`,
    autor: x.header_title_text || null,
    tipo: /\/reel\//.test(u) ? 'video' : null,
    laminas: null,
    caption: x.header_subtitle_text || null,
    ts: null,
  };
}

function recorrer(obj, encontrados) {
  if (!obj || typeof obj !== 'object') return;
  if (Array.isArray(obj)) { obj.forEach((o) => recorrer(o, encontrados)); return; }
  if (obj.item_type || obj.item_id) {
    const e = extraerDeItem(obj);
    if (e && !encontrados.has(e.code)) encontrados.set(e.code, e);
  }
  if (obj.xma) {
    for (const x of (Array.isArray(obj.xma) ? obj.xma : [obj.xma])) {
      const e = extraerDeXma(x);
      if (e && !encontrados.has(e.code)) encontrados.set(e.code, e);
    }
  }
  Object.values(obj).forEach((v) => recorrer(v, encontrados));
}

(async () => {
  if (wantLogin) {
    // NO se espera a que el humano cierre la ventana. Esa version costo una sesion entera el
    // 2026-08-23: las cookies se vuelcan al disco SOLO cuando el contexto se cierra limpio, asi
    // que si el proceso muere (o la ventana queda abierta), el perfil queda con CERO cookies
    // aunque el login se haya hecho. Ahora se sondea `sessionid` y se cierra solo.
    for (const f of ['lockfile', 'SingletonLock', 'SingletonCookie', 'SingletonSocket']) {
      const p = path.join(PROFILE_DIR, f);
      if (existsSync(p)) { try { rmSync(p, { force: true, recursive: true }); } catch {} }
    }
    const ctx = await abrir(false);
    const page = ctx.pages()[0] || (await ctx.newPage());
    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'domcontentloaded' });
    console.error('\n  Entrá con la cuenta que tiene la conversación (sergio_urcullo).');
    console.error('  NO cierres nada: apenas detecte la sesión, se cierra solo.\n');
    const t0 = Date.now(), MAX = 450000;
    let ok = false;
    while (Date.now() - t0 < MAX) {
      const ck = await ctx.cookies('https://www.instagram.com').catch(() => []);
      if (ck.find((c) => c.name === 'sessionid' && c.value) && ck.find((c) => c.name === 'ds_user_id' && c.value)) { ok = true; break; }
      if (page.isClosed()) break;
      await page.waitForTimeout(2000);
    }
    if (ok) await page.waitForTimeout(3000);
    await ctx.close(); // esto es lo que escribe las cookies al disco
    console.error(ok ? 'sesión guardada en ' + PROFILE_DIR : 'NO se detectó sesión — volvé a intentar');
    process.exit(ok ? 0 : 1);
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
    recorrerHilos(j, hilos);
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
    // scrollear la lista de conversaciones para que pida más allá de las primeras
    for (let i = 0; i < 6; i++) {
      await page.mouse.move(300, 500);
      await page.mouse.wheel(0, 2500).catch(() => {});
      await page.waitForTimeout(1500);
    }
    const lista = [...hilos.entries()]
      .map(([id, v]) => ({ id, quien: v.quien, grupo: v.grupo, ultima: v.ts ? new Date(v.ts).toISOString() : null, ids: v.ids }))
      .sort((a, b) => (b.ultima || '').localeCompare(a.ultima || ''));
    console.log(JSON.stringify(lista, null, 1));
    console.error(`\n${lista.length} conversaciones. Para cosechar una:\n  node cosechar-dm.mjs <id> --out DIR\n`);
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

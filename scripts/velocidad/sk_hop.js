const pub = 'https://app.onia.com.bo/supabase/auth/v1/health';
const int = 'http://kong:8000/auth/v1/health';
const wait = ms => new Promise(r => setTimeout(r, ms));
async function t(u) { const s = performance.now(); const r = await fetch(u); await r.text(); return [r.status, Math.round(performance.now() - s)]; }
(async () => {
  for (const [name, u] of [['pub', pub], ['int', int]]) {
    const warm = []; for (let i = 0; i < 6; i++) warm.push((await t(u))[1]);
    const cold = []; for (let i = 0; i < 3; i++) { await wait(6000); cold.push((await t(u))[1]); }
    const st = (await t(u))[0];
    console.log(name, 'status', st, 'warm ms', warm.join(','), 'cold(6s idle) ms', cold.join(','));
  }
})();

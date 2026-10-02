const k = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const targets = [
  ['public_auth_health', process.env.NEXT_PUBLIC_SUPABASE_URL + '/auth/v1/health', { apikey: k }],
  ['internal_kong_auth_health', process.env.SUPABASE_INTERNAL_URL + '/auth/v1/health', { apikey: k }],
  ['upstash_ping', process.env.UPSTASH_REDIS_REST_URL + '/ping', { Authorization: 'Bearer ' + process.env.UPSTASH_REDIS_REST_TOKEN }],
];
(async () => {
  for (const [name, url, headers] of targets) {
    const t = []; let st = '';
    for (let i = 0; i < 10; i++) {
      const s = performance.now();
      try { const r = await fetch(url, { headers }); await r.text(); st = r.status; } catch (e) { st = 'ERR ' + e.cause?.code; }
      t.push(Math.round(performance.now() - s));
    }
    const so = [...t].sort((a, b) => a - b);
    console.log(name, 'status=' + st, 'ms=' + t.join(','), 'median=' + so[5], 'min=' + so[0]);
  }
})();

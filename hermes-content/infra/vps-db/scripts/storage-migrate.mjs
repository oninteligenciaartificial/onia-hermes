#!/usr/bin/env node
// storage-migrate.mjs — copia Storage (buckets + objetos) de Supabase CLOUD al self-host
// via API (Fase 3.4 del runbook). Idempotente: re-corre para el delta en la ventana de corte.
// SOLO LECTURA sobre cloud. Guard: GO=SI.
//
// Uso:
//   GO=SI \
//   SRC_URL=https://kvepqgikokjlacxngkiw.supabase.co SRC_KEY=<SERVICE_ROLE_CLOUD> \
//   DST_URL=http://127.0.0.1:55321                   DST_KEY=<SERVICE_ROLE_SELFHOST> \
//   node storage-migrate.mjs
//
// node >= 18 (fetch nativo). Volumen actual: decenas de objetos (comprobantes + docs onia-core).
import process from 'node:process';

const { GO, SRC_URL, SRC_KEY, DST_URL, DST_KEY } = process.env;
if (GO !== 'SI') { console.error('ABORTADO: falta GO=SI'); process.exit(1); }
for (const [k, v] of Object.entries({ SRC_URL, SRC_KEY, DST_URL, DST_KEY })) {
  if (!v) { console.error(`falta ${k}`); process.exit(1); }
}

const hdr = (key) => ({ apikey: key, Authorization: `Bearer ${key}` });
const api = async (base, key, path, opts = {}) => {
  const res = await fetch(`${base}/storage/v1${path}`, { ...opts, headers: { ...hdr(key), ...(opts.headers || {}) } });
  if (!res.ok && res.status !== 409) throw new Error(`${path} → ${res.status} ${await res.text()}`);
  return res;
};

const listObjects = async (bucket, prefix = '') => {
  const out = [];
  let offset = 0;
  for (;;) {
    const res = await api(SRC_URL, SRC_KEY, `/object/list/${bucket}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix, limit: 100, offset, sortBy: { column: 'name', order: 'asc' } }),
    });
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) break;
    for (const it of items) {
      const full = prefix ? `${prefix}/${it.name}` : it.name;
      if (it.id === null) out.push(...(await listObjects(bucket, full))); // carpeta → recursion
      else out.push(full);
    }
    if (items.length < 100) break;
    offset += 100;
  }
  return out;
};

const main = async () => {
  const bucketsRes = await api(SRC_URL, SRC_KEY, '/bucket');
  const buckets = await bucketsRes.json();
  console.log(`buckets en cloud: ${buckets.map((b) => b.name).join(', ') || '(ninguno)'}`);

  let copied = 0, skipped = 0, failed = 0;
  for (const b of buckets) {
    // crear bucket en destino (409 = ya existe, OK)
    await api(DST_URL, DST_KEY, '/bucket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: b.id, name: b.name, public: b.public }),
    });

    const objects = await listObjects(b.name);
    console.log(`bucket ${b.name}: ${objects.length} objetos`);
    for (const key of objects) {
      try {
        const dl = await api(SRC_URL, SRC_KEY, `/object/${b.name}/${key}`);
        const buf = Buffer.from(await dl.arrayBuffer());
        const ct = dl.headers.get('content-type') || 'application/octet-stream';
        // upsert: idempotente para la corrida delta del corte
        await api(DST_URL, DST_KEY, `/object/${b.name}/${key}`, {
          method: 'POST',
          headers: { 'Content-Type': ct, 'x-upsert': 'true' },
          body: buf,
        });
        copied += 1;
      } catch (err) {
        failed += 1;
        console.error(`  FALLO ${b.name}/${key}: ${err.message}`);
      }
    }
  }
  console.log(`fin: copiados=${copied} saltados=${skipped} fallidos=${failed}`);
  if (failed > 0) process.exit(1);
  console.log('VERIFICAR: select count(*) from storage.objects — igual en ambos lados (runbook 3.4)');
};

main().catch((e) => { console.error(e); process.exit(1); });

// Prueba del healthcheck de Postiz. Ver el porqué en healthcheck.js.
//
// El caso que manda es «backend muerto»: con `/` en 307 y `/api/` en 502, el healthcheck
// VIEJO salía 0 (verde) y el NUEVO tiene que salir 1. Los dos se corren acá sobre el mismo
// servidor de mentira, así que la mejora no es una afirmación: es la diferencia medida.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import http from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const AQUI = dirname(fileURLToPath(import.meta.url));

// El cuerpo es la única línea de código del archivo: todo lo demás son comentarios.
const CUERPO = readFileSync(join(AQUI, 'healthcheck.js'), 'utf8')
  .split('\n')
  .filter((l) => l.trim() && !l.trim().startsWith('//'))
  .join('\n')
  .trim();

// El que venía de fábrica, tal cual estaba en el contenedor el 2026-09-05.
const VIEJO =
  "const r=require('http').get(process.env.HC_BASE||'http://localhost:5000',res=>process.exit(res.statusCode<500?0:1));r.on('error',()=>process.exit(1));r.setTimeout(4000,()=>{r.destroy();process.exit(1)})";

/** Levanta un servidor que contesta el código pedido según la ruta. */
function servidor(rutas) {
  return new Promise((resolve) => {
    const s = http.createServer((req, res) => {
      const v = rutas[req.url];
      if (v === 'colgar') return; // no contesta nunca: prueba el timeout
      res.writeHead(v ?? 404);
      res.end('x');
    });
    s.listen(0, '127.0.0.1', () => resolve({ s, base: `http://127.0.0.1:${s.address().port}` }));
  });
}

/** Corre un cuerpo de healthcheck con `node -e` y devuelve su código de salida. */
function correr(cuerpo, base) {
  return new Promise((resolve) => {
    const p = spawn(process.execPath, ['-e', cuerpo], {
      env: { ...process.env, HC_BASE: base },
      stdio: 'ignore',
    });
    p.on('exit', (code) => resolve(code));
  });
}

async function con(rutas, fn) {
  const { s, base } = await servidor(rutas);
  try {
    return await fn(base);
  } finally {
    s.close();
  }
}

test('backend VIVO (la forma sana de hoy: / en 307, /api/ en 200) → verde', async () => {
  const code = await con({ '/': 307, '/api/': 200 }, (b) => correr(CUERPO, b));
  assert.equal(code, 0);
});

test('EL BUG — backend muerto (/api/ en 502) → el nuevo se pone ROJO', async () => {
  const code = await con({ '/': 307, '/api/': 502 }, (b) => correr(CUERPO, b));
  assert.equal(code, 1, 'con el backend caído el contenedor tiene que figurar unhealthy');
});

test('EL BUG — el healthcheck VIEJO aprobaba ese mismo backend muerto', async () => {
  const code = await con({ '/': 307, '/api/': 502 }, (b) => correr(VIEJO, b));
  assert.equal(code, 0, 'si esto da 1, el viejo no era el problema y esta prueba miente');
});

test('frontend caído (/ en 500) → rojo', async () => {
  const code = await con({ '/': 500, '/api/': 200 }, (b) => correr(CUERPO, b));
  assert.equal(code, 1);
});

test('nada escuchando → rojo (no se asume vivo lo que no contesta)', async () => {
  const { s, base } = await servidor({});
  await new Promise((r) => s.close(r));
  assert.equal(await correr(CUERPO, base), 1);
});

test('backend colgado (no contesta nunca) → rojo por timeout, no verde por silencio', async () => {
  const code = await con({ '/': 307, '/api/': 'colgar' }, (b) => correr(CUERPO, b));
  assert.equal(code, 1);
});

test('el cuerpo no lleva comillas dobles: rompería el YAML del docker-compose', () => {
  assert.ok(!CUERPO.includes('"'), 'una comilla doble acá rompe el override del VPS');
});

// ── Que lo DESPLEGADO no se despegue de este archivo ───────────────────────────────────────
// Se mide contra /opt del VPS. Fuera del VPS (nodo de casa) no se puede: en ese caso dice
// NO MEDIDO en voz alta, nunca verde — un gate que no puede medir no aprueba.
const OVERRIDE = '/opt/postiz/postiz-docker-compose/docker-compose.override.yaml';

test('lo desplegado en el VPS es exactamente este cuerpo', (t) => {
  if (!existsSync(OVERRIDE)) {
    t.skip(`NO MEDIDO: no existe ${OVERRIDE} (no estoy en el VPS). El sondeo NO quedó verificado.`);
    return;
  }
  const yaml = readFileSync(OVERRIDE, 'utf8');
  assert.ok(
    yaml.includes(CUERPO),
    'el healthcheck del VPS se despegó de healthcheck.js — volvé a aplicarlo al override',
  );
});

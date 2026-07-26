#!/usr/bin/env node
// gen-jwt-keys.mjs — firma ANON_KEY y SERVICE_ROLE_KEY (HS256) desde JWT_SECRET.
// Sin dependencias (node >= 16). Fase 2.1 del runbook.
// Uso: node gen-jwt-keys.mjs <JWT_SECRET>
import crypto from 'node:crypto';

const secret = process.argv[2] || process.env.JWT_SECRET;
if (!secret || secret.length < 40) {
  console.error('uso: node gen-jwt-keys.mjs <JWT_SECRET>  (min 40 chars)');
  process.exit(1);
}

const b64u = (s) => Buffer.from(s).toString('base64url');
const sign = (payload) => {
  const header = b64u(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64u(JSON.stringify(payload));
  const sig = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${sig}`;
};

const iat = Math.floor(Date.now() / 1000);
const exp = iat + 60 * 60 * 24 * 365 * 10; // 10 anios, igual que las keys del compose oficial

console.log('ANON_KEY=' + sign({ role: 'anon', iss: 'supabase', iat, exp }));
console.log('SERVICE_ROLE_KEY=' + sign({ role: 'service_role', iss: 'supabase', iat, exp }));

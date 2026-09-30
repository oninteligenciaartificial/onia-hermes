#!/usr/bin/env node
// Autorización de YouTube, UNA vez, en la PC de Sergio (necesita su navegador para «Permitir»).
//   node yt-auth.mjs --client <client_secret_*.json> --cuenta sergio
// Imprime la URL de consentimiento; al volver el código a 127.0.0.1, pide el refresh token, lo
// copia al VPS (/root/.config/onia-publicar/yt-<cuenta>.env, 600) y lo borra de la PC. Nunca lo
// imprime. Cliente OAuth tipo «App de escritorio» (loopback + PKCE, como pide Google).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { parseArgs } from 'node:util';

const VPS = 'root@187.77.16.63';
const KEY = path.join(os.homedir(), '.ssh', 'onia_hermes_vps_ed25519');
const SCOPES = 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly';

const { values: a } = parseArgs({ options: { client: { type: 'string' }, cuenta: { type: 'string' } } });
if (!/^[a-z0-9-]+$/.test(a.cuenta || '')) throw new Error('--cuenta inválida');
const c = JSON.parse(fs.readFileSync(a.client, 'utf8')).installed;
if (!c) throw new Error('el JSON no es de un cliente «App de escritorio» (falta "installed")');
const verifier = crypto.randomBytes(48).toString('base64url');
const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
const state = crypto.randomBytes(16).toString('hex');

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, 'http://127.0.0.1');
  if (!u.searchParams.get('code')) { res.end('Esperando la autorización…'); return; }
  if (u.searchParams.get('state') !== state) { res.end('state inválido'); return; }
  try {
    const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', body: new URLSearchParams({
      code: u.searchParams.get('code'), client_id: c.client_id, client_secret: c.client_secret,
      redirect_uri: redirect, grant_type: 'authorization_code', code_verifier: verifier }) });
    const j = await r.json();
    if (!j.refresh_token) throw new Error(`sin refresh_token: ${j.error || r.status} ${j.error_description || ''}`);
    const tmp = path.join(os.tmpdir(), `yt-${crypto.randomBytes(6).toString('hex')}.env`);
    fs.writeFileSync(tmp, `YT_CLIENT_ID=${c.client_id}\nYT_CLIENT_SECRET=${c.client_secret}\nYT_REFRESH_TOKEN=${j.refresh_token}\n`, { mode: 0o600 });
    try {
      execFileSync('scp', ['-q', '-i', KEY, tmp, `${VPS}:/root/.config/onia-publicar/yt-${a.cuenta}.env`]);
      execFileSync('ssh', ['-i', KEY, VPS, `chmod 600 /root/.config/onia-publicar/yt-${a.cuenta}.env`]);
    } finally { fs.rmSync(tmp, { force: true }); }
    const ch = await (await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      { headers: { Authorization: `Bearer ${j.access_token}` } })).json();
    const nombre = ch.items?.[0]?.snippet?.title || '(sin canal)';
    res.end(`Listo: YouTube autorizado para el canal «${nombre}». Podés cerrar esta pestaña.`);
    console.log(`OK canal «${nombre}» (id ${ch.items?.[0]?.id || '?'}) — credenciales en el VPS, borradas de la PC`);
  } catch (e) { res.end(`Error: ${e.message}`); console.error('ERROR', e.message); }
  server.close();
});
let redirect;
server.listen(0, '127.0.0.1', () => {
  redirect = `http://127.0.0.1:${server.address().port}`;
  const url = `${c.auth_uri}?${new URLSearchParams({ client_id: c.client_id, redirect_uri: redirect, response_type: 'code',
    scope: SCOPES, access_type: 'offline', prompt: 'consent', state, code_challenge: challenge, code_challenge_method: 'S256' })}`;
  console.log(`Abrí esta URL en el navegador y apretá «Permitir» con la cuenta dueña del canal:\n${url}`);
});

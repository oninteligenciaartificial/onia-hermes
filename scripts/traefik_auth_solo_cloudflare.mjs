#!/usr/bin/env node
// Cierra la evasión del rate limit de auth: los routers de /supabase/auth/v1/* eligen su balde
// por el header CF-Connecting-IP, que el cliente escribe. Medido el 2026-09-26 desde nodo-casa
// contra app.onia.com.bo pegándole DIRECTO a 187.77.16.63 con --resolve:
//   header FIJO    -> 401 x10 y 429 del 11 en adelante (el límite funciona)
//   header ROTANDO -> 401 x14, CERO 429 (el límite no existe: un balde nuevo por pedido)
// O sea el criterio del balde lo controla el atacante. El remedio de la tarea t_9d970ada era
// cerrar 80/443 con ufw, pero `npm run ufw:se-puede-cerrar` mide que eso apaga 7 de 11 hostnames
// vivos (4 son de un dominio ajeno y ufw no filtra por hostname). Esto cierra el MISMO agujero
// sólo en los paths de auth: un ipAllowList de los rangos de Cloudflare como PRIMER middleware.
// Quien pega directo a la IP recibe 403 ahí y no puede ni spoofear ni tocar el balde de nadie;
// el resto de la superficie del VPS queda intacta y no hace falta ventana de mantenimiento.
//
// NO reemplaza al ufw para el resto del tráfico directo a la IP: es el subconjunto que esta
// tarea necesita. El brazo (a) sigue abierto para todo lo que no sea /supabase/auth/v1/*.
//
// Uso:
//   node scripts/traefik_auth_solo_cloudflare.mjs --self-check   # lógica pura, va en npm test
//   node scripts/traefik_auth_solo_cloudflare.mjs --dry-run      # qué cambiaría, sin escribir
//   node scripts/traefik_auth_solo_cloudflare.mjs --aplicar      # escribe (sólo EN EL VPS)
// Exits: 0 ok/al día · 1 no aplicado por una guarda · 2 NO MEDIDO (sin archivo o sin rangos).

import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'

const CONFIG = '/etc/easypanel/traefik/config/onia-manual-routes.yaml' // es JSON pese al nombre
const MW = 'solo-cloudflare'
// Un router es "de auth" si su regla toca /supabase/auth/v1/. Se DERIVA de la config viva, no se
// nombra a mano: si mañana alguien agrega un tercer router de auth, entra solo.
const PATH_AUTH = '/supabase/auth/v1/'

/** Un middleware cuenta como límite de tasa si Traefik lo aplicaría como tal. */
export function esRateLimit (mw) {
  return !!(mw && typeof mw === 'object' && mw.rateLimit)
}

/** Routers cuya regla toca los paths de auth. */
export function routersDeAuth (http) {
  const out = []
  for (const [nombre, r] of Object.entries(http?.routers ?? {})) {
    if (typeof r?.rule === 'string' && r.rule.includes(PATH_AUTH)) out.push(nombre)
  }
  return out.sort()
}

/**
 * Decide el cambio. Devuelve {ok, motivo, http, tocados} — NUNCA muta la entrada.
 * Falla CERRADO: cualquier duda deja la config como está (el agujero abierto es peor que el
 * login roto, pero el login roto es MUCHO peor que el agujero).
 */
export function planear (httpOriginal, rangos) {
  const http = JSON.parse(JSON.stringify(httpOriginal ?? {}))

  if (!Array.isArray(rangos) || rangos.length === 0) {
    return { ok: false, codigo: 2, motivo: 'sin rangos de Cloudflare: no puedo escribir la lista (vacía daría 403 a TODOS)' }
  }
  // Un allowlist sin IPv6 corta a los visitantes que llegan por v6: Cloudflare usa las dos.
  const tieneV4 = rangos.some(r => r.includes('.'))
  const tieneV6 = rangos.some(r => r.includes(':'))
  if (!tieneV4 || !tieneV6) {
    return { ok: false, codigo: 2, motivo: `los rangos no cubren las dos familias (v4:${tieneV4} v6:${tieneV6}): cortaría una mitad` }
  }
  if (rangos.length < 10) {
    return { ok: false, codigo: 2, motivo: `sólo ${rangos.length} rangos: Cloudflare publica bastantes más, la lista llegó truncada` }
  }

  const auth = routersDeAuth(http)
  if (auth.length === 0) {
    return { ok: false, codigo: 1, motivo: `ningún router toca ${PATH_AUTH}: la config no es la que este script conoce` }
  }

  // Guarda: si un router de auth perdió su límite de tasa, alguien lo cambió y no piso nada.
  const mws = http.middlewares ?? {}
  for (const n of auth) {
    const lista = http.routers[n].middlewares
    if (!Array.isArray(lista)) {
      return { ok: false, codigo: 1, motivo: `el router ${n} no tiene lista de middlewares` }
    }
    if (!lista.some(m => esRateLimit(mws[m]))) {
      return { ok: false, codigo: 1, motivo: `el router ${n} perdió su middleware de límite de tasa: no toco nada` }
    }
  }

  http.middlewares = mws
  mws[MW] = { ipAllowList: { sourceRange: [...rangos] } } // sin ipStrategy: compara el RemoteAddr
  // real de la conexión TCP. Con depth/excludedIPs leería X-Forwarded-For, que es spoofeable —
  // o sea reabriría exactamente el agujero que esto cierra.

  const tocados = []
  for (const n of auth) {
    const lista = http.routers[n].middlewares
    if (lista[0] === MW) continue // ya está y primero: idempotente
    http.routers[n].middlewares = [MW, ...lista.filter(m => m !== MW)]
    tocados.push(n)
  }
  return { ok: true, codigo: 0, http, tocados, auth }
}

async function rangosDeCloudflare () {
  const urls = ['https://www.cloudflare.com/ips-v4', 'https://www.cloudflare.com/ips-v6']
  const out = []
  for (const u of urls) {
    const r = await fetch(u, { signal: AbortSignal.timeout(15000) })
    if (!r.ok) throw new Error(`${u} devolvió ${r.status}`)
    out.push(...(await r.text()).split('\n').map(s => s.trim()).filter(Boolean))
  }
  return out
}

function selfCheck () {
  let ok = 0, mal = 0
  const t = (nombre, cond) => { if (cond) ok++; else { mal++; console.log(`  FALLA: ${nombre}`) } }
  const RANGOS = ['1.1.1.0/24', '2.2.2.0/24', '3.3.3.0/24', '4.4.0.0/16', '5.5.0.0/16',
    '6.6.0.0/16', '7.7.0.0/16', '8.8.0.0/16', '9.9.0.0/16', '10.10.0.0/16', '2400:cb00::/32']
  const base = () => ({
    routers: {
      'https-app-auth-token-rl': { rule: 'Host(`a`) && Path(`/supabase/auth/v1/token`)', middlewares: ['strip-supabase', 'rl-auth-token', 'comprimir'] },
      'https-app-auth-alta-rl': { rule: 'Host(`a`) && (Path(`/supabase/auth/v1/recover`) || Path(`/supabase/auth/v1/signup`))', middlewares: ['strip-supabase', 'rl-auth-alta'] },
      'https-otra-cosa': { rule: 'Host(`postiz.onia.com.bo`)', middlewares: ['comprimir'] }
    },
    middlewares: {
      'strip-supabase': { stripPrefix: { prefixes: ['/supabase'] } },
      comprimir: { compress: {} },
      'rl-auth-token': { rateLimit: { average: 10, period: '1m', burst: 20 } },
      'rl-auth-alta': { rateLimit: { average: 5, period: '1m', burst: 10 } }
    }
  })

  t('deriva los 2 routers de auth y NO toca los demás',
    JSON.stringify(routersDeAuth(base())) === JSON.stringify(['https-app-auth-alta-rl', 'https-app-auth-token-rl']))

  const p1 = planear(base(), RANGOS)
  t('aplica y devuelve ok', p1.ok && p1.codigo === 0)
  t('el allowlist va PRIMERO en los dos', p1.ok &&
    p1.http.routers['https-app-auth-token-rl'].middlewares[0] === MW &&
    p1.http.routers['https-app-auth-alta-rl'].middlewares[0] === MW)
  t('conserva los middlewares que ya estaban', p1.ok &&
    p1.http.routers['https-app-auth-token-rl'].middlewares.join() === `${MW},strip-supabase,rl-auth-token,comprimir`)
  t('no toca routers ajenos', p1.ok &&
    p1.http.routers['https-otra-cosa'].middlewares.join() === 'comprimir')
  t('sin ipStrategy (leerla haría spoofeable el criterio)', p1.ok &&
    p1.http.middlewares[MW].ipAllowList.ipStrategy === undefined)
  t('no muta la entrada', base().routers['https-app-auth-token-rl'].middlewares[0] === 'strip-supabase')

  const p2 = planear(p1.http, RANGOS)
  t('idempotente: segunda corrida no toca nada', p2.ok && p2.tocados.length === 0)

  t('sin rangos NO escribe (exit 2)', planear(base(), []).codigo === 2)
  t('sin IPv6 NO escribe: cortaría a los que llegan por v6',
    planear(base(), RANGOS.filter(r => !r.includes(':'))).codigo === 2)
  t('sin IPv4 NO escribe', planear(base(), ['2400:cb00::/32']).codigo === 2)
  t('lista truncada NO escribe', planear(base(), ['1.1.1.0/24', '2400:cb00::/32']).codigo === 2)

  const sinRl = base(); delete sinRl.middlewares['rl-auth-alta']
  t('router de auth sin límite de tasa: aborta y no pisa',
    planear(sinRl, RANGOS).codigo === 1)
  const sinLista = base(); sinLista.routers['https-app-auth-token-rl'].middlewares = 'rl-auth-token'
  t('middlewares que no es lista: aborta', planear(sinLista, RANGOS).codigo === 1)
  t('config sin routers de auth: aborta', planear({ routers: {}, middlewares: {} }, RANGOS).codigo === 1)

  // Un router de auth NUEVO que aparezca mañana tiene que entrar solo.
  const tercero = base()
  tercero.routers['https-app-auth-verify-rl'] = { rule: 'Path(`/supabase/auth/v1/verify`)', middlewares: ['rl-auth-alta'] }
  const p3 = planear(tercero, RANGOS)
  t('un router de auth nuevo entra solo', p3.ok && p3.tocados.includes('https-app-auth-verify-rl'))

  console.log(`self-check traefik-auth-solo-cloudflare: ${ok}/${ok + mal}`)
  return mal === 0 ? 0 : 1
}

async function main () {
  const args = process.argv.slice(2)
  if (args.includes('--self-check')) process.exit(selfCheck())

  const aplicar = args.includes('--aplicar')
  if (!existsSync(CONFIG)) {
    console.log(`NO MEDIDO — ${CONFIG} no existe acá: este script corre EN EL VPS (el archivo no está versionado en ningún repo)`)
    process.exit(2)
  }

  let rangos
  try {
    rangos = await rangosDeCloudflare()
  } catch (e) {
    console.log(`NO MEDIDO — no pude bajar los rangos de Cloudflare (${e.message}): no escribo nada`)
    process.exit(2)
  }

  const crudo = readFileSync(CONFIG, 'utf8')
  let doc
  try {
    doc = JSON.parse(crudo)
  } catch (e) {
    console.log(`NO APLICADO — ${CONFIG} no es JSON parseable (${e.message})`)
    process.exit(1)
  }

  const plan = planear(doc.http, rangos)
  if (!plan.ok) {
    console.log(`NO APLICADO — ${plan.motivo}`)
    process.exit(plan.codigo)
  }

  console.log(`routers de auth: ${plan.auth.join(', ')}`)
  console.log(`rangos de Cloudflare: ${rangos.length} (v4+v6)`)
  if (plan.tocados.length === 0) {
    console.log(`AL DIA — ${MW} ya es el primer middleware de los ${plan.auth.length} routers de auth`)
    process.exit(0)
  }
  if (!aplicar) {
    console.log(`DRY-RUN — agregaría ${MW} como primer middleware de: ${plan.tocados.join(', ')}`)
    console.log('  (corré con --aplicar para escribir)')
    process.exit(0)
  }

  const bak = `/root/onia-manual-routes.bak-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}.json`
  copyFileSync(CONFIG, bak)

  // Releer y re-planear con el contenido de AHORA: entre la lectura de arriba y esta escritura
  // pudo entrar otro cambio, y escribir el árbol viejo lo borraría en silencio.
  const doc2 = JSON.parse(readFileSync(CONFIG, 'utf8'))
  const plan2 = planear(doc2.http, rangos)
  if (!plan2.ok) {
    console.log(`NO APLICADO — al releer: ${plan2.motivo} (backup en ${bak})`)
    process.exit(plan2.codigo)
  }
  doc2.http = plan2.http
  writeFileSync(CONFIG, JSON.stringify(doc2, null, 2))
  console.log(`APLICADO — ${MW} primero en: ${plan2.tocados.join(', ')} · backup ${bak}`)
  console.log('  Traefik recarga solo el provider de archivo. Verificá: directo a la IP -> 403, vía Cloudflare -> login 200.')
  process.exit(0)
}

if (import.meta.url === `file://${process.argv[1]}`) await main()

#!/usr/bin/env node
/**
 * Cada enlace que SALE del sitio de venta, seguido contra produccion.
 *
 * POR QUE EXISTE. `enlaces.test.ts` mira el codigo y verifica que todo host enlazado
 * este DECLARADO. Lo dice el mismo: *"que el host declarado siga en pie se mide contra
 * produccion, no aca"*. Esa mitad no la medía nadie: se hacia a mano, sobre `/` y
 * `/empezar` —2 de las 25 rutas— asi que 23 rutas publicaban enlaces que nadie seguia.
 *
 * QUE ATRAPA: un destino que dejo de estar vivo. Una ruta que se borro, un 404/500 que
 * aparecio, un sitio de tercero que se cayo. Corre contra produccion, con red.
 *
 * QUE **NO** ATRAPA, y hay que decirlo o el verde miente: el host EQUIVOCADO PERO VIVO.
 * `cal.onia.com.bo` (2026-09-03) estaba muerto como servicio pero resolvia a nuestra IP
 * y devolvia 302 a /empezar —200 al final del redirect—, asi que por liveness pasa. Ese
 * caso lo agarra `enlaces.test.ts` por HOST, offline, y por eso los dos gates son
 * complementarios y ninguno reemplaza al otro. Si algun dia se fusionan, el que se
 * pierde es este parrafo y vuelve el agujero.
 *
 * Aun asi NO se siguen los redirects a ciegas: se mira el codigo y el destino por
 * separado, para que un 3xx que cae en un 404 salga rojo en vez de disfrazarse de 200.
 *
 * Y las rutas se derivan del DISCO (`src/app/**./page.tsx`), no del sitemap: una lista de
 * inclusion falla ABIERTA. El 2026-09-03 `compartir.test.ts` sacaba sus rutas de
 * `sitemap.ts`, y al salir `/terminos` del sitemap la pagina quedo publicada y sin gate.
 * Derivando del disco, una pagina nueva nace cubierta y hay que excluirla a mano.
 *
 * NO se cablea en `prebuild`, por la misma razon que `mirar-venta.mjs`: esto necesita RED
 * y produccion en pie. Colgarlo del build ata el deploy a que un sitio de tercero conteste
 * — un dia que el SIN se cae, no se puede publicar onia.com.bo. Se corre cada vuelta del
 * loop, a mano.
 *
 * Uso:
 *   node scripts/enlaces-vivos.mjs                       # produccion (lo que ve un lead)
 *   node scripts/enlaces-vivos.mjs --base=http://127.0.0.1:3987
 *   node scripts/enlaces-vivos.mjs --json=/tmp/enlaces.json
 *
 * Sale 0 si no hay ningun enlace roto, 1 si hay al menos uno.
 */
import { readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const AQUI = dirname(fileURLToPath(import.meta.url));
const APP = dirname(AQUI);
const SRC = join(APP, 'src');

const arg = (n, d) => {
  const m = process.argv.find((a) => a.startsWith(`--${n}=`));
  return m ? m.slice(n.length + 3) : d;
};
const BASE = arg('base', 'https://onia.com.bo').replace(/\/$/, '');

/**
 * Rutas servidas, derivadas del disco. `(sitio)` y demas grupos de Next no son
 * segmentos de URL: se borran. `page.tsx` -> la carpeta que lo contiene.
 */
function rutasDelDisco(dir = join(SRC, 'app'), prefijo = '') {
  const salida = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory()) {
      if (/^page\.tsx?$/.test(e.name)) salida.push(prefijo || '/');
      continue;
    }
    // Rutas dinamicas ([slug]) no se pueden visitar sin un valor: se saltan.
    if (e.name.startsWith('[') || e.name.startsWith('_') || e.name === 'api') continue;
    const grupo = e.name.startsWith('(') && e.name.endsWith(')');
    salida.push(...rutasDelDisco(join(dir, e.name), grupo ? prefijo : `${prefijo}/${e.name}`));
  }
  return [...new Set(salida)];
}

/**
 * `/v1/**` y `/patrones` estan fuera a proposito, y NO por comodidad: llevan
 * `noindex, nofollow`, estan en `Disallow` de robots.txt y no aparecen en el sitemap
 * (verificado el 2026-09-04). Son superficie congelada, no superficie de venta. Si
 * alguna vez se despublican, esta lista es el unico lugar que hay que tocar.
 */
const FUERA_DE_VENTA = (r) => r === '/patrones' || r === '/v1' || r.startsWith('/v1/');

const pedir = (url, seguir = false) => {
  // `curl` y no `fetch`: hace falta el codigo y el destino del redirect SIN seguirlo,
  // y distinguir un fallo de TLS de un host caido. `fetch` colapsa todo eso en un throw.
  const fmt = '%{http_code}\t%{redirect_url}';
  try {
    const out = execFileSync(
      'curl',
      ['-s', '-o', '/dev/null', '-w', fmt, '--max-time', '25', ...(seguir ? ['-L'] : []), url],
      { encoding: 'utf8', timeout: 30000 },
    );
    const [code, redir] = out.split('\t');
    return { code, redir: (redir || '').trim() };
  } catch {
    return { code: '000', redir: '' };
  }
};

/**
 * Un `000` casi nunca es "el enlace esta muerto". El 2026-09-04, el portal del SIAT
 * (`siatinfo.impuestos.gob.bo`, citado en /guia-facturacion) daba 000: el server manda
 * SOLO la hoja, sin el intermedio de RapidSSL, asi que curl no puede armar la cadena.
 * Los navegadores lo resuelven solos bajando el intermedio por AIA, y el lead ve la
 * pagina perfecta. Bajando ese intermedio a mano, la MISMA url da 200.
 *
 * Cantar "enlace roto" ahi es cry-wolf sobre una cita valida al portal oficial. Se
 * reintenta sin verificar la cadena: si el server contesta, esta VIVO y es aviso, no rojo.
 */
function esCadenaTlsIncompleta(url) {
  try {
    const out = execFileSync(
      'curl',
      ['-s', '-o', '/dev/null', '-w', '%{http_code}', '--max-time', '25', '-k', url],
      { encoding: 'utf8', timeout: 30000 },
    );
    return /^[23]/.test(out.trim()) ? out.trim() : null;
  } catch {
    return null;
  }
}

const html = (url) => {
  try {
    return execFileSync('curl', ['-sL', '--max-time', '25', url], {
      encoding: 'utf8',
      timeout: 30000,
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch {
    return '';
  }
};

const rutas = rutasDelDisco().filter((r) => !FUERA_DE_VENTA(r)).sort();
if (rutas.length < 10) {
  console.error(`RESCATE: solo ${rutas.length} rutas descubiertas. El descubrimiento se rompio;`);
  console.error('un gate que mira 0 sujetos pasa en verde sobre nada. Reviso rutasDelDisco().');
  process.exit(2);
}

/** enlace -> rutas donde aparece. Se junta todo antes de pedir: cada url se mide UNA vez. */
const enlaces = new Map();
const sinPagina = [];
for (const ruta of rutas) {
  const cuerpo = html(`${BASE}${ruta}`);
  if (!cuerpo) {
    sinPagina.push(ruta);
    continue;
  }
  for (const [, href] of cuerpo.matchAll(/href="((?:https?:\/\/|\/)[^"]*)"/g)) {
    const limpio = href.replace(/#.*$/, '');
    if (!limpio || limpio.startsWith('/_next/') || limpio.startsWith('/cdn-cgi/')) continue;
    if (/\.(css|js|woff2?|png|jpe?g|svg|ico|webp|xml|txt)(\?|$)/i.test(limpio)) continue;
    if (!enlaces.has(limpio)) enlaces.set(limpio, new Set());
    enlaces.get(limpio).add(ruta);
  }
}

const absoluta = (u) => (u.startsWith('/') ? `${BASE}${u}` : u);
const interna = (u) => absoluta(u).startsWith(BASE) || /^https?:\/\/onia\.com\.bo/.test(u);

const rojos = [];
const avisos = [];
const informe = [];

for (const [enlace, donde] of [...enlaces].sort()) {
  const url = absoluta(enlace);
  let { code, redir } = pedir(url);
  let nota = '';

  if (code === '000') {
    const vivo = esCadenaTlsIncompleta(url);
    if (vivo) {
      code = vivo;
      nota = 'cadena TLS incompleta del server (el navegador la resuelve por AIA)';
      avisos.push({ enlace, donde: [...donde], nota });
    }
  }

  const fila = { enlace, code, redir, donde: [...donde], nota };
  informe.push(fila);

  if (/^2/.test(code)) continue;

  if (/^3/.test(code)) {
    // Un 3xx no es sano por ser 3xx: hay que saber DONDE cae. Interno -> tiene que
    // aterrizar en una ruta que servimos (redirect de URL vieja, legitimo). Externo ->
    // el destino tiene que contestar.
    const destino = redir ? pedir(redir, true) : { code: '000' };
    if (/^2/.test(destino.code)) {
      fila.nota = `${nota ? nota + '; ' : ''}redirige a ${redir}`.trim();
      continue;
    }
    rojos.push({ ...fila, motivo: `redirige a ${redir || '(nada)'} y ahi da ${destino.code}` });
    continue;
  }

  if (code === '000' && !nota) {
    rojos.push({ ...fila, motivo: 'no contesta (DNS, TLS o timeout) ni siquiera sin verificar' });
    continue;
  }
  rojos.push({ ...fila, motivo: `responde ${code}` });
}

console.log(`Base: ${BASE}`);
console.log(`Rutas medidas: ${rutas.length}  ·  enlaces unicos: ${enlaces.size}`);
if (sinPagina.length) console.log(`⚠️  rutas que no cargaron: ${sinPagina.join(', ')}`);
for (const a of avisos) console.log(`AVISO  ${a.enlace}\n       ${a.nota}\n       en ${a.donde.join(', ')}`);

if (rojos.length) {
  console.log('');
  for (const r of rojos) {
    console.log(`ROTO   ${r.enlace}`);
    console.log(`       ${r.motivo}`);
    console.log(`       enlazado desde: ${r.donde.join(', ')}`);
  }
}

const json = arg('json', '');
if (json) writeFileSync(json, JSON.stringify({ base: BASE, rutas, informe, rojos, avisos }, null, 2));

if (rojos.length) {
  console.log(`\n${rojos.length} enlace(s) roto(s). Un lead que haga clic ahi se pierde.`);
  process.exit(1);
}
console.log(`\nSin enlaces rotos en ${rutas.length} rutas.`);

#!/usr/bin/env node
// ¿Puede el integrador MERGEAR en los dos repos que le tocan?
//
//   node scripts/integrador_puede_mergear.mjs   -> mide los repos reales de esta maquina
//
// El caso puro (fixtures, sin red ni SSH) vive en integrador_puede_mergear.test.mjs y es
// el que entra a la cadena `npm test`. Esta medicion viva sale con 2 = NO MEDIDO cuando
// no encuentra un repo, porque un gate que miente es peor que uno ausente.
//
// POR QUE EXISTE, medido el 2026-09-07 05:40 UTC:
// `onia-cola` es el UNICO loop autorizado a mergear, y le tocan DOS repos: `onia-hermes`
// (base `main`) y `onia-platform` (base `master`). Ese dia el VPS quedo con cero loops
// —`crontab -l | grep onia-loop.sh` vacio— y los cuatro se mudaron a nodo-casa, donde
// `/root/loops/onia-platform` tiene la url de push puesta a mano en
// `DESHABILITADO-NODO-DE-DESARROLLO`. O sea: el integrador corre donde ese `git push` no
// existe.
//
// Lo que hace peligroso al caso es que hoy NO muerde: `onia-platform` no tiene ni una
// rama de carril sin mergear, asi que todo se ve bien. Es un gate que falla ABIERTO — el
// dia que un carril pushee alla, el `--no-merged` crece y nada se pone rojo; la unica
// senal seria que las vueltas del integrador digan "no puedo", que en el log se lee
// igual que "no habia nada que hacer". Por eso el rojo NO espera a que haya trabajo
// varado: avisar recien entonces es avisar tarde.
//
// Y no se arregla re-habilitando el push: la url la deshabilito alguien a proposito y la
// llave de deploy (`/root/.ssh/deploy_onia-platform`) solo existe en el VPS. La via que
// SI funciona ya estaba ahi y nadie la habia medido: el clon del VPS esta en `master`,
// limpio, y su `git push --dry-run` contesta "Everything up-to-date"; se lo alcanza con
// el shim `/root/bin/onia-vps.sh`. Este gate exige que esa via este ESCRITA en
// hermes-content/docs/cola/loops.md, que es el doc donde ya vive el mapa maquina->loop.

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const DOC_VIAS = 'hermes-content/docs/cola/loops.md';
const CLI_HERMES = '/usr/local/lib/hermes-agent/venv/bin/python'; // solo existe en el VPS
const MARCA_NODO = '/root/.onia-nodo';                            // lo escribe instalar-homelab.sh

// Los dos repos del integrador y su base. `onia-platform` NO usa `main`.
export const REPOS = [
  { nombre: 'onia-hermes', ruta: '/root/loops/onia-hermes', base: 'origin/main' },
  { nombre: 'onia-platform', ruta: '/root/loops/onia-platform', base: 'origin/master' },
];

// Un push deshabilitado a mano no es una url: es un cartel. Se reconoce por la palabra,
// no por la cadena entera, para que sirva cualquier variante ("DESHABILITADO-...").
const CARTEL_APAGADO = /DESHABILITADO/i;

/** Qué máquina es. Se pregunta por ARTEFACTOS: una IP se mueve, un hostname se renombra. */
export function maquinaActual({ existe = existsSync, leer = readFileSync } = {}) {
  if (existe(MARCA_NODO)) {
    const v = String(leer(MARCA_NODO, 'utf8')).trim();
    if (v) return v;
  }
  if (existe(CLI_HERMES)) return 'VPS';
  return null; // no se sabe: NO se mide
}

/** La url de push de `origin` en la salida de `git remote -v`. null si no hay. */
export function urlDePush(salidaRemoteV) {
  for (const linea of String(salidaRemoteV || '').split('\n')) {
    const m = linea.match(/^origin\s+(\S+)\s+\(push\)/);
    if (m) return m[1];
  }
  return null;
}

// La vía alternativa se declara con una marca de una línea, greppable, en un doc que ya
// existe. Formato:  VIA-INTEGRADOR <repo> <maquina>: <comando>
// Se indexa por repo Y máquina: una vía escrita para el VPS no salva al nodo de casa.
const MARCA_VIA = /VIA-INTEGRADOR\s+(\S+)\s+(\S+):\s*(\S.*?)\s*$/gm;

/** Las vías declaradas en un doc, indexadas por `<repo>|<maquina>`. */
export function viasDeclaradas(markdown) {
  const vias = new Map();
  for (const m of String(markdown || '').matchAll(MARCA_VIA)) {
    const [, repo, maquina, comando] = m;
    if (!comando) continue;
    vias.set(`${repo}|${maquina}`, { repo, maquina, comando });
  }
  return vias;
}

/**
 * El veredicto. `repos` son `{nombre, varadas, push}`.
 * 0 = ok (con avisos), 1 = rojo, 2 = no medido.
 */
export function veredicto(repos, { maquina, vias }) {
  if (!maquina) {
    return { codigo: 2, rojos: [], avisos: [], nota: 'no se sabe que maquina es: NO se mide' };
  }
  const rojos = [];
  const avisos = [];
  const lineas = [];

  for (const r of repos) {
    if (!r.push) {
      return {
        codigo: 2,
        rojos: [],
        avisos: [],
        nota: `no pude leer la url de push de ${r.nombre}: NO se mide`,
      };
    }
    const apagado = CARTEL_APAGADO.test(r.push);
    if (!apagado) {
      lineas.push(`${r.nombre}: push propio · ${r.varadas} rama(s) varada(s) — puede mergear`);
      continue;
    }
    const via = vias.get(`${r.nombre}|${maquina}`);
    if (via) {
      avisos.push(
        `${r.nombre}: este nodo (${maquina}) NO puede pushear (${r.push}); se mergea por la via declarada: ${via.comando}`,
      );
      lineas.push(`${r.nombre}: push apagado · ${r.varadas} rama(s) varada(s) — via declarada OK`);
    } else {
      rojos.push(
        `${r.nombre}: este nodo (${maquina}) NO puede pushear (${r.push}) y NO hay via declarada en ${DOC_VIAS}. ` +
          `Hay ${r.varadas} rama(s) de carril sin mergear; el dia que crezcan, nada se pone rojo.`,
      );
    }
  }
  return { codigo: rojos.length ? 1 : 0, rojos, avisos, lineas };
}

// --- medicion viva -----------------------------------------------------------

function git(ruta, args) {
  return execFileSync('git', ['-C', ruta, ...args], { encoding: 'utf8' });
}

function medirVivo() {
  const maquina = maquinaActual();
  const vias = existsSync(DOC_VIAS) ? viasDeclaradas(readFileSync(DOC_VIAS, 'utf8')) : new Map();
  const repos = [];

  for (const r of REPOS) {
    if (!existsSync(r.ruta)) {
      console.log(`NO MEDIDO: falta el arbol ${r.ruta} (${r.nombre})`);
      return 2;
    }
    let varadas = 0;
    try {
      // Cuenta ramas de carril sin mergear. No fetchea: medir no debe cambiar el arbol.
      varadas = git(r.ruta, ['branch', '-r', '--list', 'origin/claude/*', '--no-merged', r.base])
        .split('\n')
        .filter((l) => l.trim()).length;
    } catch {
      console.log(`NO MEDIDO: no pude contar ramas en ${r.nombre}`);
      return 2;
    }
    repos.push({ nombre: r.nombre, varadas, push: urlDePush(git(r.ruta, ['remote', '-v'])) });
  }

  const v = veredicto(repos, { maquina, vias });
  for (const l of v.lineas || []) console.log(`  ${l}`);
  for (const a of v.avisos) console.log(`AVISO: ${a}`);
  for (const x of v.rojos) console.log(`ROJO: ${x}`);
  if (v.nota) console.log(`NO MEDIDO: ${v.nota}`);
  if (v.codigo === 0) console.log(`OK: el integrador alcanza los ${repos.length} repos desde ${maquina}.`);
  return v.codigo;
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  process.exit(medirVivo());
}

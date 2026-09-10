#!/usr/bin/env node
// ¿Hay una rama de CARRIL ACTIVO con trabajo sin mergear hace más de 24 h?
//
// Por qué existe: el comando que el integrador tenía mandado correr enumera TODAS las ramas
// `origin/claude/*` sin mergear y les resta a mano tres nombres con un `grep -vE`. Con eso,
// el 2026-09-10 la lista devolvía 28 ramas: 5 de carriles vivos (minutos de antigüedad) y 23
// huérfanas de sesiones viejas que divergen entre 2.561 y 3.420 commits. Las dos clases salen
// mezcladas y con la misma cara, así que el integrador sólo tiene dos salidas y las dos son
// falsas: descartar a mano —y ahí reportó «ramas varadas 0» TRES vueltas seguidas mientras
// había 131 commits sin integrar— o reportar 28 y esconder las 5 que sí importan entre 23 que
// no se pueden mergear. Un instrumento que no puede distinguir sus clases no mide: enmascara.
// Ya costó seis carriles invisibles (t_0e929acc, 14 commits varados).
//
// Qué NO hace: no decide sobre las huérfanas. Divergen miles de commits, así que mergearlas es
// decisión de Sergio Urcullo. Las CUENTA y las NOMBRA en su propia sección para que no
// desaparezcan del informe — que es lo único que el `grep -vE` no podía hacer.
//
// Se corre con: node scripts/ramas_varadas.mjs [--self-check]
//   exit 0 = ninguna rama de carril activo varada · 1 = hay varadas · 2 = NO MEDIDO

import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export const HORAS_VARADA = 24
// Una rama sin `RAMA=` en el corredor sigue siendo de carril si commiteó hace poco: los
// carriles de Windows y los del nodo de casa no tienen `case` en el corredor del VPS, y ése
// es justo el agujero por el que se colaron `onia-web-architecture` y `onia-dev-node-setup`.
export const HORAS_ACTIVA = 72

// Exclusiones NOMBRADAS con su motivo. Se re-miden cada corrida: si una deja de existir en el
// remoto, el gate lo dice — una excusa que sobra es una lista blanca que empieza a mentir.
export const NO_SON_MIAS = {
  'claude/carril-contenido': 'carril de contenido: lo cierra Sergio Urcullo en su propia sesión',
  'claude/ads-creatividades-publicos': 'ídem contenido (CLAUDE.md: "no toques el de contenido")',
  'claude/onia-core-adoption-sprint5': 'diverge 382 commits con 1 propio: decisión de Sergio (radar §26)',
}

/** Clasifica ramas ya medidas. Función pura: el self-check la ejercita sin tocar git. */
export function clasificar(ramas, declaradasPorElCorredor, ahoraMs) {
  const declaradas = new Set(declaradasPorElCorredor)
  const varadas = []
  const huerfanas = []
  const alDia = []
  const ajenas = []
  for (const r of ramas) {
    if (NO_SON_MIAS[r.nombre]) {
      ajenas.push({ ...r, motivo: NO_SON_MIAS[r.nombre] })
      continue
    }
    if (!(r.propios > 0)) continue
    const horas = (ahoraMs - r.ultimoMs) / 3_600_000
    const activa = declaradas.has(r.nombre) || horas < HORAS_ACTIVA
    if (!activa) huerfanas.push({ ...r, horas })
    else if (horas > HORAS_VARADA) varadas.push({ ...r, horas })
    else alDia.push({ ...r, horas })
  }
  const orden = (a, b) => b.horas - a.horas
  return {
    varadas: varadas.sort(orden),
    huerfanas: huerfanas.sort(orden),
    alDia: alDia.sort(orden),
    ajenas,
    // una exclusión cuyo sujeto ya no existe en el remoto es una excusa que sobra
    excusasQueSobran: Object.keys(NO_SON_MIAS).filter(n => !ramas.some(r => r.nombre === n)),
  }
}

/** Lee del corredor los `RAMA=` declarados. Es la fuente: un loop nace ahí, no en una lista. */
export function ramasDelCorredor(raiz, leer = readFileSync, hay = existsSync) {
  const ruta = `${raiz}/scripts/loops/onia-loop.sh`
  if (!hay(ruta)) return null
  const txt = String(leer(ruta, 'utf8'))
  const out = new Set()
  for (const m of txt.matchAll(/^\s*RAMA=(\S+)/gm)) if (m[1] !== 'main' && m[1] !== 'master') out.add(m[1])
  return out
}

function git(raiz, args) {
  return execFileSync('git', ['-C', raiz, ...args], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })
}

/** Mide un repo contra su base. Devuelve null si no pudo preguntar (NO MEDIDO, nunca []). */
export function medirRepo(raiz, base, correr = git) {
  let salida
  try {
    correr(raiz, ['fetch', '--quiet', '--prune'])
    // %09 = TAB: un asunto con espacios no puede partir el campo.
    salida = correr(raiz, [
      'for-each-ref', '--format=%(refname:short)%09%(committerdate:unix)', 'refs/remotes/origin/claude/',
    ])
  } catch {
    return null
  }
  const ramas = []
  for (const linea of salida.split('\n')) {
    if (!linea.trim()) continue
    const [ref, unix] = linea.split('\t')
    const nombre = ref.replace(/^origin\//, '')
    let propios
    try {
      propios = Number(correr(raiz, ['rev-list', '--count', `${base}..${ref}`]).trim())
    } catch {
      return null
    }
    ramas.push({ nombre, propios, ultimoMs: Number(unix) * 1000 })
  }
  return ramas
}

function informe(nombreRepo, res) {
  const l = []
  l.push(`== ${nombreRepo}`)
  if (res.varadas.length === 0) l.push(`   OK: ninguna rama de carril activo varada +${HORAS_VARADA} h`)
  for (const v of res.varadas) l.push(`   VARADA ${v.nombre}: ${v.propios} commits, ${Math.round(v.horas)} h`)
  for (const a of res.alDia) l.push(`   al día ${a.nombre}: ${a.propios} commits, ${Math.round(a.horas)} h`)
  if (res.huerfanas.length) {
    const c = res.huerfanas.reduce((s, h) => s + h.propios, 0)
    l.push(`   huérfanas (NO son varadas, decide Sergio Urcullo): ${res.huerfanas.length} ramas, ${c} commits`)
    l.push(`     ${res.huerfanas.map(h => h.nombre.replace('claude/', '')).join(' ')}`)
  }
  return l.join('\n')
}

const CASOS = () => {
  const H = 3_600_000
  const ahora = 1_757_500_000_000
  const ramas = [
    { nombre: 'claude/web-venta', propios: 1, ultimoMs: ahora - 1 * H },
    { nombre: 'claude/docs-auditoria', propios: 3, ultimoMs: ahora - 200 * H },
    { nombre: 'claude/onia-dev-node-setup-22a170', propios: 5, ultimoMs: ahora - 2 * H },
    { nombre: 'claude/cool-lovelace-ad8d0e', propios: 5, ultimoMs: ahora - 1700 * H },
    { nombre: 'claude/ads-creatividades-publicos', propios: 160, ultimoMs: ahora - 5 * H },
    { nombre: 'claude/ya-mergeada', propios: 0, ultimoMs: ahora - 1 * H },
  ]
  const decl = ['claude/web-venta', 'claude/docs-auditoria', 'claude/ads-creatividades-publicos']
  const r = clasificar(ramas, decl, ahora)
  const n = s => s.map(x => x.nombre)
  return [
    ['un carril declarado con commits de hace 200 h está VARADO', n(r.varadas).includes('claude/docs-auditoria')],
    ['un carril declarado que commiteó recién NO está varado', n(r.alDia).includes('claude/web-venta')],
    // el agujero histórico: carril sin `case` en el corredor (Windows / nodo de casa)
    ['una rama sin RAMA= pero con commits de hace 2 h cuenta como carril activo', n(r.alDia).includes('claude/onia-dev-node-setup-22a170')],
    ['una rama vieja sin RAMA= es HUÉRFANA, no varada', n(r.huerfanas).includes('claude/cool-lovelace-ad8d0e') && !n(r.varadas).includes('claude/cool-lovelace-ad8d0e')],
    // el caso que YA cumple: sin él, un detector que devuelva siempre [] pasa igual
    ['las huérfanas se NOMBRAN, no se descartan en silencio', r.huerfanas.length === 1],
    ['una rama de Sergio no es varada ni huérfana', n(r.ajenas).includes('claude/ads-creatividades-publicos') && !n(r.varadas).concat(n(r.huerfanas)).includes('claude/ads-creatividades-publicos')],
    ['una rama sin commits propios no se cuenta', ![...n(r.varadas), ...n(r.huerfanas), ...n(r.alDia)].includes('claude/ya-mergeada')],
    ['clasificar sigue sabiendo qué exclusión no tiene sujeto', clasificar([], [], ahora).excusasQueSobran.length === Object.keys(NO_SON_MIAS).length],
    ['una exclusión con sujeto en el remoto NO se denuncia', !clasificar([{ nombre: 'claude/carril-contenido', propios: 9, ultimoMs: ahora }], [], ahora).excusasQueSobran.includes('claude/carril-contenido')],
    // el fixture no puede estar absuelto por la lista blanca que el mismo archivo declara
    ['los fixtures de carril no colisionan con NO_SON_MIAS', !NO_SON_MIAS['claude/docs-auditoria'] && !NO_SON_MIAS['claude/cool-lovelace-ad8d0e']],
    ['el corredor es la fuente de las declaradas', (ramasDelCorredor('/x', () => 'case a)\n  RAMA=claude/uno\n  RAMA=main\n', () => true) ?? new Set()).has('claude/uno')],
  ]
}

function selfCheck() {
  let malos = 0
  for (const [titulo, ok] of CASOS()) {
    console.log(`${ok ? 'ok  ' : 'FAIL'}  ${titulo}`)
    if (!ok) malos++
  }
  console.log(malos === 0 ? 'self-check OK' : `self-check ROJO: ${malos}`)
  return malos === 0 ? 0 : 1
}

function main() {
  if (process.argv.includes('--self-check')) return selfCheck()
  const repos = [
    ['onia-hermes', '/root/loops/onia-hermes', 'origin/main'],
    ['onia-platform', '/root/loops/onia-platform', 'origin/master'],
  ]
  let varadas = 0
  let medidos = 0
  const vistas = new Set()
  const partes = []
  for (const [nombre, raiz, base] of repos) {
    const ramas = medirRepo(raiz, base)
    if (ramas === null) {
      partes.push(`== ${nombre}\n   NO MEDIDO: no pude preguntarle a git en ${raiz}`)
      continue
    }
    medidos++
    for (const r of ramas) vistas.add(r.nombre)
    const res = clasificar(ramas, ramasDelCorredor(raiz) ?? [], Date.now())
    varadas += res.varadas.length
    partes.push(informe(nombre, res))
  }
  // Contra la UNIÓN: una exclusión de onia-platform no sobra porque onia-hermes no la tenga.
  if (medidos === repos.length) {
    for (const e of Object.keys(NO_SON_MIAS)) {
      if (!vistas.has(e)) partes.push(`⚠ la exclusión "${e}" ya no existe en ningún remoto: sobra`)
    }
  }
  console.log(partes.join('\n'))
  if (medidos === 0) {
    console.log('\nNO MEDIDO: ningún repo contestó')
    return 2
  }
  console.log(`\nramas de carril activo varadas +${HORAS_VARADA} h: ${varadas}`)
  return varadas === 0 ? 0 : 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main())
}

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
// Cuántos commits de atraso hacen que la rama deje de ser mergeable POR EL INTEGRADOR. No es un
// gusto: es la regla que su prompt ya tenía escrita ("una rama que diverge hace semanas, >100
// commits atrás de main, no se mergea sola: decide Sergio Urcullo"). Hasta el 2026-09-25 este
// archivo medía `propios` y NUNCA el atraso, así que podía declarar «varada» —o sea, deuda del
// integrador— una rama que su propia regla le prohíbe tocar. Un rojo sin ninguna jugada legal no
// se arregla: se aprende a ignorar, y con él se ignoran los rojos que sí se podían cerrar.
export const COMMITS_DIVERGE = 100

// Exclusiones NOMBRADAS con su motivo. Se re-miden cada corrida: si una deja de existir en el
// remoto, el gate lo dice — una excusa que sobra es una lista blanca que empieza a mentir.
export const NO_SON_MIAS = {
  'claude/carril-contenido': 'carril de contenido: lo cierra Sergio Urcullo en su propia sesión',
  'claude/ads-creatividades-publicos': 'ídem contenido (CLAUDE.md: "no toques el de contenido")',
  'claude/onia-core-adoption-sprint5': 'diverge 382 commits con 1 propio: decisión de Sergio (radar §26)',
  // 2026-09-18: la rama del CARRIL marca-personal es `claude/marca-personal-loop` — la que declara
  // el corredor (`RAMA=`, dos veces). Ésta lleva sufijo de sesión y ningún loop la mueve: el loop
  // marca-personal no tiene línea activa ni en casa ni en el VPS. Es la sesión de Sergio Urcullo
  // escribiendo sus carruseles, o sea MARCA, que él decide (CLAUDE.md: "no toques el de contenido").
  'claude/marca-personal-carruseles-dist-deadab': 'marca personal: la mueve la sesión de Sergio Urcullo, no un loop',
}

/** Clasifica ramas ya medidas. Función pura: el self-check la ejercita sin tocar git. */
export function clasificar(ramas, declaradasPorElCorredor, ahoraMs) {
  const declaradas = new Set(declaradasPorElCorredor)
  const varadas = []
  const huerfanas = []
  const alDia = []
  const ajenas = []
  const aDecidir = []
  for (const r of ramas) {
    if (NO_SON_MIAS[r.nombre]) {
      ajenas.push({ ...r, motivo: NO_SON_MIAS[r.nombre] })
      continue
    }
    if (!(r.propios > 0)) continue
    const horas = (ahoraMs - r.ultimoMs) / 3_600_000
    const declarada = declaradas.has(r.nombre)
    const activa = declarada || horas < HORAS_ACTIVA
    if (!activa) huerfanas.push({ ...r, horas })
    // Un carril DECLARADO por el corredor sigue siendo trabajo del integrador por mucho que
    // divergió: ahí el atraso es el problema a resolver, no una excusa para no contarlo.
    else if (!declarada && r.atras > COMMITS_DIVERGE) aDecidir.push({ ...r, horas })
    else if (horas > HORAS_VARADA) varadas.push({ ...r, horas })
    else alDia.push({ ...r, horas })
  }
  const orden = (a, b) => b.horas - a.horas
  return {
    varadas: varadas.sort(orden),
    huerfanas: huerfanas.sort(orden),
    alDia: alDia.sort(orden),
    ajenas,
    aDecidir: aDecidir.sort((a, b) => b.atras - a.atras),
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
    let atras
    try {
      propios = Number(correr(raiz, ['rev-list', '--count', `${base}..${ref}`]).trim())
      // El atraso decide si el integrador PUEDE mergearla; sin él, `propios` solo no distingue una
      // rama de carril al día de una sesión que diverge 400 commits.
      atras = Number(correr(raiz, ['rev-list', '--count', `${ref}..${base}`]).trim())
    } catch {
      return null
    }
    ramas.push({ nombre, propios, atras, ultimoMs: Number(unix) * 1000 })
  }
  return ramas
}

function informe(nombreRepo, res) {
  const l = []
  l.push(`== ${nombreRepo}`)
  if (res.varadas.length === 0) l.push(`   OK: ninguna rama de carril activo varada +${HORAS_VARADA} h`)
  for (const v of res.varadas) l.push(`   VARADA ${v.nombre}: ${v.propios} commits, ${Math.round(v.horas)} h`)
  for (const a of res.alDia) l.push(`   al día ${a.nombre}: ${a.propios} commits, ${Math.round(a.horas)} h`)
  // Una exclusión que además ESCONDE a su sujeto no se puede refutar: el que lee no se entera de
  // que hay commits sin mergear ahí, ni con qué motivo se decidió no tocarlos. Se nombran.
  for (const a of res.ajenas) l.push(`   ajena ${a.nombre}: ${a.propios} commits — ${a.motivo}`)
  // Ni varada ni huérfana: commiteó recién, así que alguien la está moviendo, pero diverge tanto
  // que la regla del integrador le prohíbe mergearla sola. Se NOMBRA con su atraso para que la
  // decisión de Sergio Urcullo sea refutable, no para esconder los commits.
  for (const d of res.aDecidir) {
    l.push(`   a decidir ${d.nombre}: ${d.propios} commits propios, ${d.atras} commits atrás — diverge +${COMMITS_DIVERGE}: no la mergea el integrador (decide Sergio Urcullo)`)
  }
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
    { nombre: 'claude/web-venta', propios: 1, atras: 0, ultimoMs: ahora - 1 * H },
    { nombre: 'claude/docs-auditoria', propios: 3, atras: 400, ultimoMs: ahora - 200 * H },
    { nombre: 'claude/onia-dev-node-setup-22a170', propios: 5, atras: 3, ultimoMs: ahora - 2 * H },
    { nombre: 'claude/cool-lovelace-ad8d0e', propios: 5, atras: 3000, ultimoMs: ahora - 1700 * H },
    { nombre: 'claude/ads-creatividades-publicos', propios: 160, atras: 0, ultimoMs: ahora - 5 * H },
    { nombre: 'claude/ya-mergeada', propios: 0, atras: 0, ultimoMs: ahora - 1 * H },
    // la sesión de control de Sergio Urcullo: commiteó recién, pero diverge tanto que la regla del
    // integrador le prohíbe mergearla sola. Si cuenta como varada, el objetivo se pone rojo y su
    // dueño no tiene ninguna jugada legal.
    { nombre: 'claude/meta-ads-onia-prospecting-8b5122', propios: 1, atras: 410, ultimoMs: ahora - 30 * H },
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
    // una exclusión que no se IMPRIME esconde commits sin mergear: el que lee no puede refutarla
    ['el informe NOMBRA a la ajena con su motivo', informe('x', r).includes('ajena claude/ads-creatividades-publicos') && informe('x', r).includes('ídem contenido')],
    ['una rama sin commits propios no se cuenta', ![...n(r.varadas), ...n(r.huerfanas), ...n(r.alDia)].includes('claude/ya-mergeada')],
    ['clasificar sigue sabiendo qué exclusión no tiene sujeto', clasificar([], [], ahora).excusasQueSobran.length === Object.keys(NO_SON_MIAS).length],
    ['una exclusión con sujeto en el remoto NO se denuncia', !clasificar([{ nombre: 'claude/carril-contenido', propios: 9, ultimoMs: ahora }], [], ahora).excusasQueSobran.includes('claude/carril-contenido')],
    // el fixture no puede estar absuelto por la lista blanca que el mismo archivo declara
    ['los fixtures de carril no colisionan con NO_SON_MIAS', !NO_SON_MIAS['claude/docs-auditoria'] && !NO_SON_MIAS['claude/cool-lovelace-ad8d0e']],
    ['el corredor es la fuente de las declaradas', (ramasDelCorredor('/x', () => 'case a)\n  RAMA=claude/uno\n  RAMA=main\n', () => true) ?? new Set()).has('claude/uno')],
    // Una rama que el integrador NO puede mergear por regla ("diverge >100 commits: decide Sergio
    // Urcullo") no puede contar contra SU objetivo: un rojo sin jugada legal enseña a ignorar el rojo.
    // Pasó con claude/marca-personal-carruseles-dist-deadab, que hubo que agregar a NO_SON_MIAS a mano
    // — y una lista a mano se atrasa, que es el agujero que este archivo existe para cerrar.
    ['una rama reciente pero 410 commits atrás NO es varada del integrador', n(r.aDecidir).includes('claude/meta-ads-onia-prospecting-8b5122') && !n(r.varadas).includes('claude/meta-ads-onia-prospecting-8b5122')],
    // el caso que evita que el arreglo abra un agujero nuevo: un carril REAL que se atrasó sigue
    // siendo trabajo del integrador, por mucho que divergió.
    ['un carril DECLARADO por el corredor sigue varado aunque diverja 400', n(r.varadas).includes('claude/docs-auditoria') && !n(r.aDecidir).includes('claude/docs-auditoria')],
    ['el informe NOMBRA la clase a-decidir con su atraso', informe('x', r).includes('claude/meta-ads-onia-prospecting-8b5122') && informe('x', r).includes('410 commits atrás')],
    ['medirRepo trae el atraso, no sólo lo propio', (() => {
      const fake = (_r, a) => a[0] === 'for-each-ref' ? 'origin/claude/x\t1757500000\n' : (a[2] === 'origin/main..origin/claude/x' ? '2\n' : '77\n')
      const m = medirRepo('/x', 'origin/main', fake)
      return m?.[0]?.propios === 2 && m?.[0]?.atras === 77
    })()],
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

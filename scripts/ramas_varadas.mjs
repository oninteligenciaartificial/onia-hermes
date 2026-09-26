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
import { readFileSync, existsSync, readdirSync } from 'node:fs'
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
  // 2026-09-25: CUARTO nombre distinto del mismo carril de contenido. Medido antes de excluirla:
  // 73 archivos, +7.635 líneas, de las cuales 32 caen en `hermes-content/{carousels,captures,
  // PARA-PUBLICAR}` — láminas para publicar, o sea MARCA —, su punta es `docs(handoff): carril
  // contenido` y ningún loop la mueve (no tiene `RAMA=` en el corredor). CLAUDE.md: "no toques
  // el de contenido, el de contenido lo maneja su sesión".
  'claude/onia-content-scripts-cvat9r': 'carril de contenido con nombre nuevo: láminas y carruseles, los cierra Sergio Urcullo',
}

// POR QUÉ ESTO SIGUE SIENDO UNA LISTA A MANO, aunque el comentario de abajo diga que se atrasa.
// El 2026-09-25 se midieron las dos señales que la volverían derivable, y las DOS esconden
// trabajo real, que es el error más caro que cometió este repo (seis carriles invisibles):
//   · Por autor del commit: los carriles de loop firman `root@<máquina>` y las sesiones firman
//     `oninteligenciaartificial@gmail.com` o `noreply@anthropic.com`. Separa limpio HOY — pero
//     `onia-web-architecture-b37eca` y `onia-dev-node-setup-22a170` eran carriles de verdad
//     corriendo en la app de Windows, o sea que firmaban como sesión. La regla los habría
//     excluido, y ésos el integrador SÍ los tiene que mergear.
//   · Por rutas tocadas: el contenido se concentra en `carousels/captures/PARA-PUBLICAR`, pero
//     un carril cualquiera puede dejar una referencia ahí y quedar excluido sin que nadie mire.
// O sea: el costo de atrasarse es un rojo molesto que se arregla en una vuelta; el de derivar
// mal es trabajo que desaparece del informe y nadie lo busca. Se elige el rojo. Si algún día
// hay una marca EXPLÍCITA de dueño (un `RAMA=` de contenido, un trailer en el commit), esa sí
// se deriva y esta lista se borra.

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

// ── Commits que no salieron de la MÁQUINA ────────────────────────────────────────────────
// `medirRepo` pregunta por `refs/remotes/origin/`: mide lo que ya está publicado. Es ciego por
// construcción a un commit que vive sólo en el disco de este nodo, y ése es el modo de falla MÁS
// probable de esta topología, no el menos: los dos clones de `onia-platform` tienen el push
// puesto en `DESHABILITADO-NODO-DE-DESARROLLO` a propósito, así que ahí un commit NO puede salir
// solo nunca — hay que entregarlo a mano (`format-patch` + ssh al VPS). Medido el 2026-09-26: el
// carril chatbot encontró `71cd8fa9` en `/root/loops/onia-platform-chatbot` sin estar en ningún
// remoto, y el objetivo del integrador decía 0 varadas ese mismo rato. Peor que varado: invisible.
export function clasificarArboles(arboles, ahoraMs) {
  const varados = []
  const enVuelo = []
  for (const a of arboles) {
    if (!a.localesSinRemoto) continue
    const horas = (ahoraMs - a.ultimoMs) / 3_600_000
    // Un árbol que NO puede pushear no se absuelve por ser reciente: la espera no lo va a
    // publicar. Es el único caso donde la antigüedad no dice nada y el rojo es inmediato.
    if (!a.puedePushear) varados.push({ ...a, horas, motivo: 'el push está deshabilitado: no sale solo nunca, se entrega a mano' })
    else if (horas > HORAS_VARADA) varados.push({ ...a, horas, motivo: `puede pushear y no lo hizo en ${Math.round(horas)} h` })
    // Un commit local de hace minutos en un árbol que SÍ puede pushear es trabajo EN VUELO de un
    // carril corriendo ahora, no trabajo perdido. Contarlo como varado enseña a ignorar el rojo:
    // el 2026-09-26 `onia-hermes-web-venta` tenía el merge de `origin/main` de hacía 22 min, con
    // su loop a mitad de vuelta (cron `48 */2`). Se NOMBRA aparte, no se cuenta.
    else enVuelo.push({ ...a, horas })
  }
  return { varados, enVuelo }
}

/** Mide un árbol de trabajo. Devuelve null si no pudo preguntar (NO MEDIDO, nunca 0). */
export function medirArbol(ruta, correr = git) {
  try {
    // `--not --remotes=origin` y no `@{u}..HEAD`: lo segundo infla con lo ya publicado en otra
    // rama y ya llevó a planear un reset destructivo.
    // `%x09`, NO `%09`: son DOS lenguajes de formato distintos. `for-each-ref` expande `%09` a
    // TAB; `git log` lo deja LITERAL, así que `split('\t')[1]` sale undefined y la fecha queda
    // NaN. Y `NaN > HORAS_VARADA` es `false`: el árbol varado se habría clasificado «en vuelo» y
    // absuelto. Medido el 2026-09-26 con `cat -A`: `%091790441283` contra `^I1790441283`.
    const sueltos = correr(ruta, ['log', 'HEAD', '--not', '--remotes=origin', '--format=%H%x09%ct'])
      .split('\n').filter(l => l.trim())
    let push = ''
    try {
      push = correr(ruta, ['remote', 'get-url', '--push', 'origin']).trim()
    } catch {
      push = ''
    }
    const rama = correr(ruta, ['branch', '--show-current']).trim()
    // El más NUEVO de los sueltos: si el carril sigue commiteando, sigue en vuelo.
    const ultimoMs = sueltos.length
      ? Math.max(...sueltos.map(l => Number(l.split('\t')[1]) * 1000))
      : 0
    // Hay commits pero no pude fecharlos: NO MEDIDO, nunca «absuelto». Una fecha que no es un
    // número se propaga como NaN y toda comparación con ella sale `false`, o sea que el árbol
    // pasaría por sano. Es la misma regla que el resto del archivo: tri-estado, no catch→ok.
    if (sueltos.length && !Number.isFinite(ultimoMs)) return null
    return {
      ruta,
      rama: rama || 'DESPEGADO',
      localesSinRemoto: sueltos.length,
      // Un remoto de push que no es una URL (el centinela DESHABILITADO-…) no puede publicar.
      puedePushear: /:|\/\//.test(push),
      ultimoMs,
    }
  } catch {
    return null
  }
}

function informeArboles(res, noMedidos) {
  const l = ['== árboles de trabajo (commits que no salieron de esta máquina)']
  if (!res.varados.length) l.push('   OK: ningún árbol con commits que no puedan salir de acá')
  for (const v of res.varados) {
    l.push(`   VARADO EN DISCO ${v.ruta.split('/').pop()} (${v.rama}): ${v.localesSinRemoto} commit(s) — ${v.motivo}`)
  }
  // En vuelo se NOMBRA igual: un número sin su lista no se puede refutar, y el que lee tiene que
  // poder ver que ahí hay commits sin publicar aunque hoy no cuenten.
  for (const e of res.enVuelo) {
    l.push(`   en vuelo ${e.ruta.split('/').pop()} (${e.rama}): ${e.localesSinRemoto} commit(s), ${Math.round(e.horas)} h — su loop está corriendo`)
  }
  for (const n of noMedidos) l.push(`   NO MEDIDO ${n}: no pude preguntarle a git`)
  return l.join('\n')
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
    // contenido con nombre nuevo y AL DÍA con main: la salida `aDecidir` no la alcanza (sólo
    // cubre +100 de atraso), así que sin exclusión nombrada cae en `varadas` a las 24 h.
    { nombre: 'claude/onia-content-scripts-cvat9r', propios: 12, atras: 15, ultimoMs: ahora - 30 * H },
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
    // El agujero que dejó abierto el arreglo anterior: `aDecidir` rescata a la rama de Sergio
    // Urcullo que DIVERGE, pero una rama suya al día con main no diverge nada. La de contenido
    // del 2026-09-25 tenía 12 propios y 15 de atraso: a las 24 h habría puesto el objetivo del
    // integrador en rojo por una rama que CLAUDE.md le prohíbe tocar.
    ['una rama de contenido al día con main tampoco es varada del integrador', n(r.ajenas).includes('claude/onia-content-scripts-cvat9r') && !n(r.varadas).includes('claude/onia-content-scripts-cvat9r')],
    // ── commits que no salieron de la máquina: `medirRepo` es ciego a esto por construcción ──
    ...(() => {
      const arb = [
        { ruta: '/root/loops/onia-platform-chatbot', rama: 'claude/x', localesSinRemoto: 1, puedePushear: false, ultimoMs: ahora - 0.1 * H },
        { ruta: '/root/loops/onia-hermes-web-venta', rama: 'claude/web-venta', localesSinRemoto: 1, puedePushear: true, ultimoMs: ahora - 0.4 * H },
        { ruta: '/root/loops/onia-hermes-lucia', rama: 'claude/lucia-vps', localesSinRemoto: 2, puedePushear: true, ultimoMs: ahora - 30 * H },
        { ruta: '/root/loops/onia-hermes-limpio', rama: 'main', localesSinRemoto: 0, puedePushear: true, ultimoMs: 0 },
      ]
      const a = clasificarArboles(arb, ahora)
      const nom = s => s.map(x => x.ruta)
      return [
        // El caso que este bloque existe para cerrar: sin push no hay hora que lo salve.
        ['un árbol con el push DESHABILITADO y 1 commit local es varado, aunque sea de hace minutos',
          nom(a.varados).includes('/root/loops/onia-platform-chatbot')],
        // Y el error simétrico, que es el que enseña a ignorar el rojo: el carril está corriendo.
        ['un árbol que SÍ puede pushear con un commit de hace 24 min está EN VUELO, no varado',
          nom(a.enVuelo).includes('/root/loops/onia-hermes-web-venta') && !nom(a.varados).includes('/root/loops/onia-hermes-web-venta')],
        ['un árbol que puede pushear y no lo hizo en 30 h SÍ es varado',
          nom(a.varados).includes('/root/loops/onia-hermes-lucia')],
        ['un árbol sin commits locales no se cuenta ni se nombra',
          ![...nom(a.varados), ...nom(a.enVuelo)].includes('/root/loops/onia-hermes-limpio')],
        // Un número sin su lista no se puede refutar.
        ['el informe NOMBRA el árbol varado con su rama y su motivo',
          informeArboles(a, []).includes('onia-platform-chatbot (claude/x)') && informeArboles(a, []).includes('no sale solo nunca')],
        ['el informe NOMBRA lo que está en vuelo, no lo esconde',
          informeArboles(a, []).includes('en vuelo onia-hermes-web-venta')],
        ['un árbol NO MEDIDO se nombra y no se absuelve en silencio',
          informeArboles({ varados: [], enVuelo: [] }, ['/root/loops/roto']).includes('NO MEDIDO /root/loops/roto')],
        // Tri-estado: "no pude preguntar" nunca se aplana a "no hay nada".
        ['medirArbol devuelve null si git no contesta, nunca 0 commits',
          medirArbol('/x', () => { throw new Error('no git') }) === null],
        ['medirArbol lee el centinela DESHABILITADO como "no puede pushear"', (() => {
          const fake = (_r, a2) => a2[0] === 'log' ? 'abc\t1757500000\n' : a2[0] === 'remote' ? 'DESHABILITADO-NODO-DE-DESARROLLO\n' : 'claude/x\n'
          const m = medirArbol('/x', fake)
          return m?.puedePushear === false && m?.localesSinRemoto === 1
        })()],
        // El bug que este archivo tuvo vivo un rato: `git log` no expande `%09`, así que la fecha
        // salía NaN y el árbol caía en «en vuelo» — absuelto. Se ancla el formato que git ENTIENDE.
        ['medirArbol pide el TAB como %x09, que es el que git log expande', (() => {
          let pedido = ''
          const fake = (_r, a2) => {
            if (a2[0] === 'log') { pedido = a2.find(x => x.startsWith('--format=')) || ''; return 'abc\t1757500000\n' }
            return a2[0] === 'remote' ? 'git@github.com:o/r.git\n' : 'main\n'
          }
          medirArbol('/x', fake)
          return pedido.includes('%x09') && !/%09/.test(pedido.replace('%x09', ''))
        })()],
        ['una fecha ilegible es NO MEDIDO, no un árbol sano', (() => {
          // Exactamente lo que devolvía git con el formato equivocado: sha + "%09" + epoch, sin TAB.
          const fake = (_r, a2) => a2[0] === 'log' ? 'abc%091757500000\n' : a2[0] === 'remote' ? 'git@github.com:o/r.git\n' : 'main\n'
          return medirArbol('/x', fake) === null
        })()],
        ['medirArbol reconoce una URL de push real', (() => {
          const fake = (_r, a2) => a2[0] === 'log' ? '' : a2[0] === 'remote' ? 'git@github.com:o/r.git\n' : 'main\n'
          return medirArbol('/x', fake)?.puedePushear === true
        })()],
      ]
    })(),
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
  // Los sujetos se DERIVAN del disco, no de una lista: un worktree nuevo de un carril nuevo
  // aparece solo. Una lista a mano acá repetiría el agujero que este archivo existe para cerrar.
  const arboles = []
  const noMedidos = []
  let raices = []
  try {
    raices = readdirSync('/root/loops', { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => `/root/loops/${d.name}`)
      .filter(p => existsSync(`${p}/.git`))
      .sort()
  } catch {
    noMedidos.push('/root/loops (no pude listar el directorio)')
  }
  for (const p of raices) {
    const m = medirArbol(p)
    if (m === null) noMedidos.push(p)
    else arboles.push(m)
  }
  const resArb = clasificarArboles(arboles, Date.now())
  partes.push(informeArboles(resArb, noMedidos))

  console.log(partes.join('\n'))
  if (medidos === 0) {
    console.log('\nNO MEDIDO: ningún repo contestó')
    return 2
  }
  console.log(`\nramas de carril activo varadas +${HORAS_VARADA} h: ${varadas}`)
  // Línea APARTE: son dos preguntas distintas ("no se mergeó" vs "no salió de la máquina") y
  // sumarlas en un número haría que el veredicto no diga cuál de las dos está rota.
  console.log(`árboles con commits que no salieron de esta máquina: ${resArb.varados.length}`)
  return varadas === 0 && resArb.varados.length === 0 ? 0 : 1
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exit(main())
}

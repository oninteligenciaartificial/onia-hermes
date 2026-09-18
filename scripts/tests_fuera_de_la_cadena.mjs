// ¿Que pruebas existen en el DISCO y la cadena `npm test` no corre?
//
// Nace del 2026-09-17: la cadena `test` de este repo es una lista de ~70 nombres
// TIPEADOS A MANO, y por eso dejaba 951 pruebas verdes sin ejecutar (521 de
// `onia-core/`, 430 del emisor SIAT). Se cablearon en 817d6c21 — pero el
// instrumento que las encontro quedo como alias suelto que **no corria nadie**,
// asi que la clase seguia abierta: el dia siguiente aparecieron 15 mas
// (`video-factory/`, `ciencia-cuerpo`), invisibles por el mismo motivo.
//
// La guarda de `guards-cableados.test.mjs` que deriva del disco mira **solo
// `scripts/`**. Este modulo es su version para TODO el repo, y ese test lo
// IMPORTA en vez de copiarlo: un gate con su propia copia de la expresion del
// producto puede tener la copia bien y el producto mal, y coincidir para siempre.

import { readFileSync, readdirSync, statSync, existsSync, globSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ_POR_DEFECTO = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

/** Carpetas que no son codigo del repo. */
const NO_ES_CODIGO = new Set(['node_modules', '.git', '.next', 'out', 'dist', 'coverage'])

/**
 * Subarboles con corredor propio, fuera de esta cadena, CON su motivo.
 * Una entrada aca es una decision a la vista, no un atajo: el gate exige que la
 * carpeta exista, asi que una exclusion vencida sale en rojo en vez de pudrirse.
 */
export const SUBARBOLES_CON_CORREDOR_PROPIO = new Map([
  ['web-factory', 'vitest propio; la app que se publica entra por `test:sitio-venta`'],
  ['.claude', 'skills instaladas: las corre su propio paquete, no este repo'],
  ['.agents', 'idem `.claude` — skills instaladas de terceros'],
])

const ES_TEST = /\.test\.(mjs|js|ts|mts)$/

/** Camina el DISCO. No `git ls-files`: el archivo nuevo sin commitear ES el sujeto. */
function caminar(dir, raiz, acc = []) {
  let entradas
  try {
    entradas = readdirSync(dir, { withFileTypes: true })
  } catch {
    return acc
  }
  for (const e of entradas) {
    if (NO_ES_CODIGO.has(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) caminar(p, raiz, acc)
    else if (ES_TEST.test(e.name)) acc.push(path.relative(raiz, p).split(path.sep).join('/'))
  }
  return acc
}

function excluidoPorSubarbol(rutaRelativa) {
  for (const carpeta of SUBARBOLES_CON_CORREDOR_PROPIO.keys()) {
    if (rutaRelativa === carpeta || rutaRelativa.startsWith(carpeta + '/')) return carpeta
  }
  // Las skills viven anidadas en varios lugares y traen sus propios tests.
  if (rutaRelativa.includes('/skills/')) return 'skills anidadas'
  return null
}

/**
 * Cruza el universo del disco contra lo que la cadena `test` EJECUTA de verdad,
 * resolviendo los `npm run` en cascada y expandiendo los globs (un glob
 * entrecomillado no existe como ruta: preguntarle `existsSync` lo lee como
 * ausente y reporta como huerfano un cableado que si esta).
 */
export function testsFueraDeLaCadena({ raiz = RAIZ_POR_DEFECTO } = {}) {
  const universo = caminar(raiz, raiz).filter((p) => !excluidoPorSubarbol(p)).sort()

  const ejecutados = new Set()
  const noEntendidos = []
  const vistos = new Set()
  // Cada pendiente viaja con SU directorio: un paso de la cadena puede vivir en
  // otro package.json (`cd <dir> && npm run <x>`), que es como entra el gate del
  // publicador del sitio. Resolver ese nombre contra la raiz lo reporta
  // inexistente —un nombre fantasma que se lee como "este paso esta roto"— y deja
  // invisible todo lo que ese paso corre.
  const pendientes = [{ nombre: 'test', dir: '' }]

  const paquetes = new Map()
  const scriptsDe = (dir) => {
    if (!paquetes.has(dir)) {
      let leidos = null
      try {
        leidos = JSON.parse(readFileSync(path.join(raiz, dir, 'package.json'), 'utf8')).scripts ?? {}
      } catch {
        leidos = null // no hay package.json ahi: no es lo mismo que no tener scripts
      }
      paquetes.set(dir, leidos)
    }
    return paquetes.get(dir)
  }
  const etiqueta = (dir, nombre) => (dir ? `${dir}: ${nombre}` : nombre)

  while (pendientes.length > 0) {
    const { nombre, dir } = pendientes.pop()
    const clave = `${dir}#${nombre}`
    if (vistos.has(clave)) continue
    vistos.add(clave)

    const scripts = scriptsDe(dir)
    if (scripts === null) {
      noEntendidos.push(`${etiqueta(dir, nombre)} (no hay package.json en ${dir || '.'})`)
      continue
    }

    const cmd = scripts[nombre]
    if (typeof cmd !== 'string') {
      if (nombre !== 'test' || dir !== '') noEntendidos.push(`${etiqueta(dir, nombre)} (script inexistente)`)
      continue
    }

    // El `cd` de adelante manda sobre TODO lo que sigue: el `npm run` y las rutas.
    const cd = cmd.match(/^\s*cd\s+([\w./-]+)\s*&&\s*/)
    const dirCmd = cd ? path.posix.join(dir, cd[1]) : dir
    const resto = cd ? cmd.slice(cd[0].length) : cmd
    const desdeLaRaiz = (rel) => (dirCmd ? path.posix.join(dirCmd, rel) : rel)

    for (const m of resto.matchAll(/npm run ([\w:-]+)/g)) pendientes.push({ nombre: m[1], dir: dirCmd })

    let vio = /npm run [\w:-]+/.test(resto)
    for (const token of resto.split(/\s+/)) {
      if (token.startsWith('-') || !/[/.]/.test(token)) continue
      const limpio = token.replace(/^["']|["']$/g, '')

      if (limpio.includes('*')) {
        for (const f of globSync(limpio, { cwd: path.join(raiz, dirCmd) })) {
          const rel = desdeLaRaiz(f.split(path.sep).join('/'))
          if (ES_TEST.test(rel)) ejecutados.add(rel)
        }
        vio = true
        continue
      }

      const absoluto = path.join(raiz, dirCmd, limpio)
      if (!existsSync(absoluto)) continue
      if (statSync(absoluto).isDirectory()) {
        for (const f of caminar(absoluto, raiz)) ejecutados.add(f)
      } else if (ES_TEST.test(limpio)) {
        ejecutados.add(desdeLaRaiz(limpio.split(path.sep).join('/')))
      }
      vio = true
    }

    // `cd <dir> && node --test` corre la carpeta entera sin nombrar una ruta de test.
    if (cd && /^node\s+--test(\s|$)/.test(resto.trim()) && existsSync(path.join(raiz, dirCmd))) {
      for (const f of caminar(path.join(raiz, dirCmd), raiz)) ejecutados.add(f)
      vio = true
    }

    if (!vio) noEntendidos.push(etiqueta(dir, nombre))
  }

  return {
    universo,
    ejecutados: [...ejecutados].sort(),
    fuera: universo.filter((f) => !ejecutados.has(f)),
    noEntendidos,
  }
}

function medirEImprimir() {
  const { universo, ejecutados, fuera, noEntendidos } = testsFueraDeLaCadena()
  console.log('universo (disco):', universo.length)
  console.log('ejecutados por la cadena:', ejecutados.length)
  console.log('FUERA de la cadena:', fuera.length)
  if (noEntendidos.length > 0) {
    console.log('--- scripts cuyo comando no nombra una ruta de test ---')
    console.log(noEntendidos.join('\n'))
  }
  // Sin tope mudo: si hay muchos, la cuenta de arriba ya lo dijo y aca van todos.
  if (fuera.length > 0) console.log('--- fuera ---\n' + fuera.join('\n'))
  process.exitCode = fuera.length > 0 ? 1 : 0
}

// Guarda: importar este modulo desde un test no puede disparar la medicion.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  medirEImprimir()
}

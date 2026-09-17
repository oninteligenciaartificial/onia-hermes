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
  const pkg = JSON.parse(readFileSync(path.join(raiz, 'package.json'), 'utf8'))
  const scripts = pkg.scripts ?? {}

  const universo = caminar(raiz, raiz).filter((p) => !excluidoPorSubarbol(p)).sort()

  const ejecutados = new Set()
  const noEntendidos = []
  const vistos = new Set()
  const pendientes = ['test']

  while (pendientes.length > 0) {
    const nombre = pendientes.pop()
    if (vistos.has(nombre)) continue
    vistos.add(nombre)

    const cmd = scripts[nombre]
    if (typeof cmd !== 'string') {
      if (nombre !== 'test') noEntendidos.push(`${nombre} (script inexistente)`)
      continue
    }

    for (const m of cmd.matchAll(/npm run ([\w:-]+)/g)) pendientes.push(m[1])

    let vio = /npm run [\w:-]+/.test(cmd)
    for (const token of cmd.split(/\s+/)) {
      if (token.startsWith('-') || !/[/.]/.test(token)) continue
      const limpio = token.replace(/^["']|["']$/g, '')

      if (limpio.includes('*')) {
        for (const f of globSync(limpio, { cwd: raiz })) {
          const rel = f.split(path.sep).join('/')
          if (ES_TEST.test(rel)) ejecutados.add(rel)
        }
        vio = true
        continue
      }

      const absoluto = path.join(raiz, limpio)
      if (!existsSync(absoluto)) continue
      if (statSync(absoluto).isDirectory()) {
        for (const f of caminar(absoluto, raiz)) ejecutados.add(f)
      } else if (ES_TEST.test(limpio)) {
        ejecutados.add(limpio.split(path.sep).join('/'))
      }
      vio = true
    }
    if (!vio) noEntendidos.push(nombre)
  }

  // `cd <dir> && node --test` corre la carpeta entera sin nombrar una ruta de test.
  for (const nombre of vistos) {
    const cmd = scripts[nombre]
    if (typeof cmd !== 'string') continue
    const m = cmd.match(/cd\s+([\w./-]+)\s*&&\s*node\s+--test/)
    if (m && existsSync(path.join(raiz, m[1]))) {
      for (const f of caminar(path.join(raiz, m[1]), raiz)) ejecutados.add(f)
    }
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

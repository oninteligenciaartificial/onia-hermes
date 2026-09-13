// Corre los tests de web-factory/apps/site (el contenedor onia-center, que atiende
// el intake de leads de onia.com.bo) y DERIVA sus sujetos del disco.
//
// POR QUE EXISTE, medido el 2026-09-13 por onia-cola sobre la tarea t_fa27d261.
// apps/site tenia CINCO archivos de test que no corria absolutamente nadie:
//
//   - la cadena `npm test` de la raiz nombra UN solo archivo suyo, a mano:
//       test:intencion-lead => node --test web-factory/apps/site/src/lib/intencion-del-lead.test.mjs
//   - web-factory declara `test: vitest run` con include **/*.test.ts, pero ningun
//     paso de la cadena ni ningun workflow de .github lo invoca (grep -rln apps/site
//     sobre .github/workflows da vacio);
//   - apps/site ni siquiera tiene script `test` propio.
//
// O sea: una lista de inclusion escrita a mano, que es como falla abierto toda esta
// familia — el sujeto NUEVO nace sin corredor y nada se pone rojo. El cuerpo de la
// tarea decia "dos .test.ts huerfanos"; recontados el 2026-09-13 eran cinco.
//
// DOS FAMILIAS, RUTEADAS POR LO QUE CADA ARCHIVO IMPORTA. En apps/site conviven
// cinco tests de vitest y uno de node:test (intencion-del-lead.test.mjs), y la
// extension no los distingue: hay .test.mjs de node:test y podria haberlo de vitest
// manana. Meterlos a todos en el mismo corredor rompe al otro, asi que la familia
// se deriva del import — no de la carpeta, no del sufijo, no de una lista.
// Efecto util: los de node:test no necesitan dependencias, o sea que se miden de
// verdad hasta en una maquina sin pnpm install.
//
// TRI-ESTADO A PROPOSITO. web-factory se instala con pnpm y en el nodo de casa no
// tiene node_modules, asi que este paso NO puede exigirlas: un rojo por ambiente en
// la cadena raiz traba el merge de TODOS los carriles, que es peor que el hueco que
// cierra. Sin dependencias dice NO MEDIDO y nombra la cura, fuerte y con los
// archivos de vitest que se quedaron sin mirar; nunca finge verde callado.
//
// El hermano estructural es scripts/onia-center-tests.test.mjs, que SI va siempre a
// rojo: exige que cada archivo de test de apps/site caiga bajo este corredor. Esa
// es la mitad que cierra la clase donde esto no se puede ejecutar.
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
export const APP = 'web-factory/apps/site'

/** Un archivo es de test por su extension, no por la carpeta donde lo pusieron. */
export function esArchivoDeTest (ruta) {
  return /\.test\.(ts|tsx|mts|mjs|cts|cjs|js|jsx)$/.test(ruta)
}

/**
 * Los tests de apps/site, derivados del DISCO.
 *
 * Se camina la carpeta y se filtra por extension. Dos trampas, las dos medidas el
 * 2026-09-13 escribiendo esto:
 *
 *  · el pathspec 'dir/**\/*.test.ts' exige al menos un directorio en el medio, asi
 *    que deja fuera los archivos del primer nivel (src/middleware.test.ts) y el
 *    universo sale corto EN VERDE;
 *  · `git ls-files` solo ve lo TRACKEADO. La mutacion que sembro un test nuevo sin
 *    commitear paso verde: el corredor ni lo miro. Un test recien escrito es
 *    exactamente el sujeto que este corredor existe para no perder, asi que el
 *    universo se camina, no se le pregunta a git.
 */
export function testsDeLaApp (listar = caminarElDisco) {
  return listar(APP).filter(esArchivoDeTest).sort()
}

const NO_SE_CAMINA = new Set(['node_modules', '.next', 'out', 'dist', '.turbo'])

function caminarElDisco (dir, raiz = RAIZ) {
  const absoluto = path.join(raiz, dir)
  if (!existsSync(absoluto)) return []
  const encontrados = []
  for (const entrada of readdirSync(absoluto, { withFileTypes: true })) {
    if (entrada.isDirectory()) {
      if (NO_SE_CAMINA.has(entrada.name)) continue
      encontrados.push(...caminarElDisco(path.join(dir, entrada.name), raiz))
    } else {
      encontrados.push(path.join(dir, entrada.name))
    }
  }
  return encontrados
}

/** Donde vive el vitest que sabe resolver los imports de apps/site. */
export function rutaDeVitest (raiz = RAIZ) {
  return path.join(raiz, 'web-factory', 'node_modules', '.bin', 'vitest')
}

export function hayDependencias (raiz = RAIZ) {
  return existsSync(rutaDeVitest(raiz))
}

/**
 * Que corredor sabe ejecutar este archivo, leido de lo que IMPORTA.
 *
 * Devuelve 'vitest', 'node' o null. El null es a proposito y no es un default
 * silencioso: un test que no declara ninguno de los dos no se puede correr a
 * ciegas, y el gate hermano lo va a nombrar en vez de tragarselo.
 */
export function familiaDe (texto) {
  if (/from\s*['"]vitest['"]/.test(texto)) return 'vitest'
  if (/from\s*['"]node:test['"]/.test(texto)) return 'node'
  return null
}

export function agruparPorFamilia (archivos, leer = (a) => readFileSync(path.join(RAIZ, a), 'utf8')) {
  const grupos = { vitest: [], node: [], desconocidos: [] }
  for (const a of archivos) {
    const familia = familiaDe(leer(a))
    if (familia === 'vitest') grupos.vitest.push(a)
    else if (familia === 'node') grupos.node.push(a)
    else grupos.desconocidos.push(a)
  }
  return grupos
}

function medir () {
  const archivos = testsDeLaApp()
  if (archivos.length === 0) {
    console.log(`OK ${APP}: no tiene archivos de test — nada que correr.`)
    return 0
  }

  const { vitest, node, desconocidos } = agruparPorFamilia(archivos)
  let codigo = 0

  if (desconocidos.length > 0) {
    console.log(`ROJO ${APP}: estos tests no declaran su corredor (ni vitest ni node:test):`)
    for (const a of desconocidos) console.log(`  ${a}`)
    codigo = 1
  }

  // Los de node:test no necesitan dependencias: se miden siempre.
  if (node.length > 0) {
    const r = spawnSync(process.execPath, ['--test', ...node], { cwd: RAIZ, stdio: 'inherit' })
    if (r.status !== 0) codigo = r.status === null ? 1 : r.status
  }

  if (vitest.length > 0) {
    if (!hayDependencias()) {
      console.log(`NO MEDIDO ${APP}: faltan las dependencias de web-factory, estos tests no se miraron:`)
      for (const a of vitest) console.log(`  sin mirar: ${a}`)
      console.log('  cura: cd web-factory && pnpm install   (despues: npm run test:onia-center)')
    } else {
      // Las rutas van relativas a web-factory, que es donde vive el vitest.config.ts
      // con el tope de maxWorkers; correrlo desde la raiz del repo lo ignora.
      const relativas = vitest.map((a) => path.relative('web-factory', a))
      const r = spawnSync(rutaDeVitest(), ['run', ...relativas], {
        cwd: path.join(RAIZ, 'web-factory'),
        stdio: 'inherit',
      })
      if (r.status !== 0) codigo = r.status === null ? 1 : r.status
    }
  }

  return codigo
}

if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(medir())
}

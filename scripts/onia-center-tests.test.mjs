// Ningun archivo de test de web-factory/apps/site (el contenedor onia-center) puede
// quedarse sin corredor en la cadena `npm test` de la raiz.
//
// POR QUE EXISTE, medido el 2026-09-13 por onia-cola sobre la tarea t_fa27d261.
// apps/site tenia CINCO archivos de test que no corria nadie, y lo que los mantuvo
// invisibles fue la forma del cableado: la cadena nombraba UN archivo suyo a mano
// (`test:intencion-lead => node --test .../intencion-del-lead.test.mjs`), asi que
// todo test escrito despues de esa linea nacia huerfano y nada se ponia rojo.
// Es la falla de siempre de esta familia: una lista de inclusion falla abierto en el
// sujeto NUEVO. Por eso aca no se lista nada — el universo se CAMINA del disco (ni
// siquiera `git ls-files`, que no ve el test recien escrito: eso costo una mutacion
// que paso verde) y la cobertura se exige contra un corredor que deriva igual.
//
// El hermano es scripts/onia-center-tests.mjs, que hace la medicion viva. Ese es
// tri-estado (sin las dependencias de pnpm dice NO MEDIDO y sale 0, para no trabar
// el merge de todos los carriles por ambiente); este es el que si va a rojo, y por
// eso es el que cierra la clase donde el otro no se puede ejecutar.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { APP, esArchivoDeTest, testsDeLaApp } from './onia-center-tests.mjs'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CORREDOR = 'scripts/onia-center-tests.mjs'

/** Los pasos de la cadena `npm test` de la raiz, como comandos sueltos. */
export function pasosDeLaCadena (pkg) {
  const cadena = pkg.scripts?.test ?? ''
  return cadena
    .split('&&')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((paso) => {
      const m = paso.match(/^npm run (\S+)$/)
      return m ? (pkg.scripts?.[m[1]] ?? paso) : paso
    })
}

/**
 * Los archivos de test que la cadena NO alcanza.
 *
 * Un archivo esta cubierto si algun paso invoca al corredor que deriva del disco
 * —y entonces los cubre a todos, incluido el que se escriba manana— o si algun
 * paso lo nombra por su ruta exacta.
 */
export function sinCorredor (archivos, pasos) {
  const derivado = pasos.some((p) => p.includes(CORREDOR))
  if (derivado) return []
  return archivos.filter((a) => !pasos.some((p) => p.includes(a)))
}

test('el universo sale del disco y contiene los tests que estaban huerfanos', () => {
  const archivos = testsDeLaApp()
  // Caso ancla: estos dos existian el 2026-09-13 y ninguno los corria. Si el
  // universo deja de nombrarlos, lo que se rompio es la DERIVACION —el pathspec
  // con ** deja fuera el primer nivel— y el gate estaria fallando en verde.
  assert.ok(
    archivos.includes(`${APP}/src/lib/onia-center-perfil.test.ts`),
    `el universo no trajo el test de perfil; salieron: ${archivos.join(', ')}`,
  )
  assert.ok(
    archivos.includes(`${APP}/src/middleware.test.ts`),
    'el universo no trajo el test del middleware, que vive en el PRIMER nivel de src',
  )
})

test('hoy ningun test de onia-center se queda sin corredor', () => {
  const pkg = JSON.parse(readFileSync(path.join(RAIZ, 'package.json'), 'utf8'))
  const huerfanos = sinCorredor(testsDeLaApp(), pasosDeLaCadena(pkg))
  assert.deepEqual(
    huerfanos,
    [],
    `estos tests de ${APP} no los corre ningun paso de la cadena:\n  ${huerfanos.join('\n  ')}\n` +
      `cura: que un paso de la cadena invoque ${CORREDOR}, que deriva sus sujetos del disco.`,
  )
})

test('el universo ve un test RECIEN escrito, todavia sin commitear', () => {
  // Medido el 2026-09-13: con el universo derivado de `git ls-files`, esta misma
  // mutacion pasaba VERDE — git solo ve lo trackeado, asi que el corredor ni miraba
  // el archivo nuevo. Y un test recien escrito es justo el sujeto que existe para no
  // perder. Siembra su propio sujeto, sellado, y lo borra en el finally.
  const sembrado = `${APP}/src/lib/zz-gate-onia-cola-${process.pid}.test.mjs`
  writeFileSync(path.join(RAIZ, sembrado), "import test from 'node:test'\ntest('sembrado', () => {})\n")
  try {
    assert.ok(
      testsDeLaApp().includes(sembrado),
      'el universo no vio un test sin commitear: se esta derivando de git y no del disco',
    )
  } finally {
    rmSync(path.join(RAIZ, sembrado), { force: true })
  }
})

test('una lista escrita a mano deja huerfano al archivo que no nombra', () => {
  const archivos = ['a/uno.test.ts', 'a/dos.test.ts']
  const aMano = ['node --test a/uno.test.ts']
  assert.deepEqual(sinCorredor(archivos, aMano), ['a/dos.test.ts'])
})

test('el corredor derivado cubre tambien al archivo que todavia no existe', () => {
  const pasos = [`node ${CORREDOR}`]
  assert.deepEqual(sinCorredor(['a/uno.test.ts', 'b/recien-nacido.test.ts'], pasos), [])
})

test('la cadena se lee expandiendo los `npm run`, no como texto suelto', () => {
  const pkg = { scripts: { test: 'npm run test:x && npm run test:y', 'test:x': `node ${CORREDOR}`, 'test:y': 'node otro.mjs' } }
  const pasos = pasosDeLaCadena(pkg)
  assert.deepEqual(sinCorredor(['a/uno.test.ts'], pasos), [])
})

test('un archivo que no es de test no es sujeto de nadie', () => {
  assert.equal(esArchivoDeTest('src/lib/onia-center-perfil.ts'), false)
  assert.equal(esArchivoDeTest('src/lib/onia-center-perfil.test.ts'), true)
  assert.equal(esArchivoDeTest('src/lib/intencion-del-lead.test.mjs'), true)
})

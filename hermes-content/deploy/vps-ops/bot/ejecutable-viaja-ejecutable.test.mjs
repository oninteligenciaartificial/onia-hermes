// Un script que el cron invoca POR RUTA muere mudo si viaja sin el bit de ejecucion.
//
// Medido el 2026-09-18: a las 03:47:37 UTC un deploy repiso /opt/onia/bot y dejo en 644 a
// reminder-run.sh (:32), postdemo-run.sh (:47) y webhook-watchdog.sh (*/2 min). Los tres
// empezaron a contestar "/bin/sh: 1: ...: Permission denied" en su log y nadie se entero:
// el recordatorio de demo 4 h antes, el cierre post-demo y —lo peor— el WATCHDOG del bot,
// que es la red que avisa cuando el bot deja de llegar a Chatwoot. followup-run.sh sobrevivio
// por ser el unico 100755 en git, e insistencia-run.sh por accidente: su linea de cron lo
// invoca con "bash <ruta>", que no necesita el bit.
//
// POR QUE EL SUJETO ES EL MODO EN GIT y no el del disco: las dos vias de publicacion del bot
// copian el modo del ORIGEN — publicar.sh usa `git archive origin/main | tar -x` y
// deploy-bot.sh usa `cp -p`. O sea que el bit que viaja al VPS es el que esta commiteado.
// Un chmod +x en el worktree no arregla nada; se arregla con `git update-index --chmod=+x`.
//
// El universo se camina del DISCO (readdirSync), no de `git ls-files`: el sujeto que mas
// importa es el script NUEVO, que todavia no esta trackeado y es justo el que git no ve.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const CARPETA = dirname(fileURLToPath(import.meta.url))

// Un directorio sellado por una siembra de otro gate no es superficie que se publique:
// desaparece mientras lo leas y pondria rojo a este por un producto sano.
const ES_SIEMBRA = /^__.+__$/

function guionesDelDisco (carpeta = CARPETA) {
  return readdirSync(carpeta, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.sh') && !ES_SIEMBRA.test(e.name))
    .map((e) => e.name)
    .sort()
}

function tieneShebang (ruta) {
  let cabeza
  try {
    cabeza = readFileSync(ruta, 'utf8').slice(0, 200)
  } catch {
    return false
  }
  return cabeza.startsWith('#!')
}

// null = git no lo conoce todavia (archivo nuevo sin commitear).
function modoEnGit (nombre) {
  let salida
  try {
    salida = execFileSync('git', ['ls-files', '-s', '--', nombre], {
      cwd: CARPETA,
      encoding: 'utf8'
    })
  } catch {
    return null
  }
  const linea = salida.split('\n').find((l) => l.trim())
  if (!linea) return null
  return linea.split(/\s+/)[0]
}

function ejecutableEnDisco (ruta) {
  return (statSync(ruta).mode & 0o111) !== 0
}

/**
 * Nucleo puro: recibe lo ya medido y decide. Se prueba sin tocar el disco, en las DOS
 * direcciones, para que un rojo de este gate no se pueda confundir con un rojo del producto.
 */
export function losQueNoViajanEjecutables (guiones) {
  return guiones
    .filter((g) => g.shebang)
    .filter((g) => (g.modoGit === null ? !g.ejecutableEnDisco : g.modoGit !== '100755'))
    .map((g) => ({
      nombre: g.nombre,
      motivo:
        g.modoGit === null
          ? 'todavia no esta en git y en disco no es ejecutable: agregalo con `git add --chmod=+x`'
          : `esta commiteado como ${g.modoGit}: corre \`git update-index --chmod=+x ${g.nombre}\``
    }))
}

function medirGuiones () {
  return guionesDelDisco().map((nombre) => {
    const ruta = join(CARPETA, nombre)
    return {
      nombre,
      shebang: tieneShebang(ruta),
      modoGit: modoEnGit(nombre),
      ejecutableEnDisco: ejecutableEnDisco(ruta)
    }
  })
}

test('el universo sale del disco y contiene los guiones que ya murieron por esto', () => {
  const nombres = guionesDelDisco()
  // Caso ancla: si un filtro roto vacia el universo, el gate se apaga en silencio. Estos tres
  // son los que el 2026-09-18 quedaron mudos en produccion; tienen que ser sujetos siempre.
  for (const conocido of ['reminder-run.sh', 'postdemo-run.sh', 'webhook-watchdog.sh']) {
    assert.ok(
      nombres.includes(conocido),
      `${conocido} tiene que estar en el universo del gate, y no esta (filtro roto)`
    )
  }
  assert.ok(nombres.length >= 10, `se esperaban >=10 guiones en la carpeta, hay ${nombres.length}`)
})

test('el detector distingue las dos direcciones', () => {
  const sano = [
    { nombre: 'a.sh', shebang: true, modoGit: '100755', ejecutableEnDisco: true },
    // Sin shebang no es un ejecutable: es un fragmento que alguien sourcea. No es sujeto.
    { nombre: 'lib.sh', shebang: false, modoGit: '100644', ejecutableEnDisco: false },
    // Nuevo sin commitear pero ya con el bit puesto: al agregarlo viaja bien.
    { nombre: 'nuevo-ok.sh', shebang: true, modoGit: null, ejecutableEnDisco: true }
  ]
  assert.deepEqual(losQueNoViajanEjecutables(sano), [])

  const roto = losQueNoViajanEjecutables([
    { nombre: 'muerto.sh', shebang: true, modoGit: '100644', ejecutableEnDisco: true },
    { nombre: 'nuevo-roto.sh', shebang: true, modoGit: null, ejecutableEnDisco: false }
  ])
  assert.equal(roto.length, 2, 'tiene que ver el commiteado en 644 Y el nuevo sin bit')
  assert.match(roto[0].motivo, /update-index --chmod=\+x muerto\.sh/)
  assert.match(roto[1].motivo, /add --chmod=\+x/)
})

test('todo guion con shebang de esta carpeta viaja al VPS ejecutable', () => {
  const malos = losQueNoViajanEjecutables(medirGuiones())
  assert.deepEqual(
    malos,
    [],
    'estos guiones llegan a /opt/onia/bot sin el bit de ejecucion y el cron los mata mudos ' +
      `("Permission denied" en su log):\n${malos.map((m) => `  - ${m.nombre}: ${m.motivo}`).join('\n')}`
  )
})

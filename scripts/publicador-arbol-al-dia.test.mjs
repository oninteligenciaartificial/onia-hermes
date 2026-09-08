// Un publicador que compara el WORKING TREE contra origin/main tiene que ponerse
// al día solo. Si no, el pedido de deploy queda INEJECUTABLE sin que nada avise.
//
// POR QUÉ EXISTE. Medido el 2026-09-08 02:5x La Paz: `bash
// /opt/onia/bot/_deploy/publicar.sh --dry-run` cortaba con
//
//   ERR: el árbol de /root/loops/onia-hermes NO coincide con origin/main en
//        hermes-content/deploy/vps-ops/bot.
//
// sobre un pedido de deploy VIVO (t_340bd6e2) que llevaba tres días esperando el
// ok de Sergio Urcullo. La causa no era el pedido ni el bot: el clon
// /root/loops/onia-hermes del VPS estaba 6 commits atrás de origin/main, porque
// el integrador se mudó al nodo de casa y pushea desde allá — nadie vuelve a
// tocar ese clon. O sea que si él contestaba `ok t_340bd6e2`, el publicador salía
// con código 2, el tilde se ponía verde y producción NO se tocaba.
//
// Es una clase, no una instancia: el publicador de SIAT tiene el MISMO bloque de
// comparación y ese día daba verde sólo porque su subárbol no había cambiado en
// los 6 commits que faltaban. El defecto estaba igual de vivo, esperando el
// primer arreglo de SIAT que se mergeara.
//
// Es también el escalón que faltaba de una familia ya conocida. El arreglo del
// 2026-09-04 hizo que los pedidos DERIVEN su artefacto al ejecutarse, para que no
// caducaran cuando el build siguiente borraba la carpeta con timestamp. Eso cerró
// la caducidad por ARTEFACTO y dejó viva la caducidad por ÁRBOL.
//
// QUÉ SE EXIGE. Que el publicador intente un fast-forward a origin/main antes de
// comparar, y que la protección sobreviva: si el árbol tiene trabajo propio, el
// fast-forward no puede y el publicador sigue cortando. Nunca se publica algo que
// no está en main; lo que cambia es que "estar atrasado" deje de ser un motivo.
//
// Los sujetos se DERIVAN del disco: cualquier publicar.sh que compare el working
// tree contra origin/main queda cubierto el día que se escribe, sin tocar esta
// lista.

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, readFileSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const DEPLOY = join(RAIZ, 'hermes-content', 'deploy')

// ── sujetos: los publicadores que comparan el working tree ──────────────────
// La firma es el bloque que este test cuida: `git diff --name-only origin/main
// -- "$SUB"`. Un publicador que buildea desde origin/main (landing, plataforma)
// no la tiene y no es sujeto: no puede sufrir este defecto.
function publicadoresQueComparanElArbol () {
  const encontrados = []
  const recorrer = (dir) => {
    for (const entrada of readdirSync(dir, { withFileTypes: true })) {
      const ruta = join(dir, entrada.name)
      if (entrada.isDirectory()) recorrer(ruta)
      else if (entrada.name === 'publicar.sh') {
        const texto = readFileSync(ruta, 'utf8')
        if (/git diff --name-only origin\/main -- "\$SUB"/.test(texto)) {
          encontrados.push({
            ruta,
            texto,
            sub: (texto.match(/^SUB=(.+)$/m) || [])[1],
            varDest: (texto.match(/^DEST=\$\{([A-Z_]+):-/m) || [])[1],
          })
        }
      }
    }
  }
  recorrer(DEPLOY)
  return encontrados
}

const SUJETOS = publicadoresQueComparanElArbol()

const git = (cwd, ...args) =>
  execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()

// Arma origin + un clon ATRASADO, con el subárbol que el publicador espera.
// `divergir` deja además un commit propio en el clon, para probar que la guarda
// sigue en pie.
function repoDeJuguete (sujeto, { divergir = false } = {}) {
  const base = mkdtempSync(join(tmpdir(), 'publicador-arbol-'))
  const origen = join(base, 'origin.git')
  const clon = join(base, 'clon')
  const dest = join(base, 'dest')
  mkdirSync(dest, { recursive: true })

  execFileSync('git', ['init', '--bare', '-b', 'main', origen], { stdio: 'ignore' })
  execFileSync('git', ['clone', '-q', origen, clon], { stdio: 'ignore' })
  git(clon, 'config', 'user.email', 'test@onia')
  git(clon, 'config', 'user.name', 'test')

  // El subárbol tiene que traer lo que el publicador exige después de comparar,
  // o cortaría por otro motivo y el caso pasaría sin medir nada.
  const sembrar = (raiz, marca) => {
    const sub = join(raiz, sujeto.sub)
    mkdirSync(join(sub, 'src'), { recursive: true })
    writeFileSync(join(sub, 'src', 'motor.mjs'), `export const marca = '${marca}'\n`)
    writeFileSync(join(sub, 'README.md'), `# ${marca}\n`)
    writeFileSync(join(sub, 'package.json'), '{"name":"juguete"}\n')
    // El publicador del bot delega en deploy-bot.sh; un stub que sale 0 deja que
    // el caso mida la comparación y no el deploy.
    writeFileSync(join(sub, 'deploy-bot.sh'), '#!/usr/bin/env bash\necho "stub"\nexit 0\n')
  }

  sembrar(clon, 'commit-A')
  git(clon, 'add', '-A')
  git(clon, 'commit', '-qm', 'A')
  git(clon, 'push', '-q', 'origin', 'main')
  const shaA = git(clon, 'rev-parse', 'HEAD')

  // Otro clon empuja el commit B: así el primero queda legítimamente atrasado,
  // igual que el clon del VPS cuando el integrador mergea desde casa.
  const otro = join(base, 'otro')
  execFileSync('git', ['clone', '-q', origen, otro], { stdio: 'ignore' })
  git(otro, 'config', 'user.email', 'test@onia')
  git(otro, 'config', 'user.name', 'test')
  writeFileSync(join(otro, sujeto.sub, 'src', 'motor.mjs'), "export const marca = 'commit-B'\n")
  git(otro, 'add', '-A')
  git(otro, 'commit', '-qm', 'B')
  git(otro, 'push', '-q', 'origin', 'main')
  const shaB = git(otro, 'rev-parse', 'HEAD')

  git(clon, 'fetch', '-q', 'origin')

  if (divergir) {
    writeFileSync(join(clon, sujeto.sub, 'src', 'motor.mjs'), "export const marca = 'trabajo-propio'\n")
    git(clon, 'add', '-A')
    git(clon, 'commit', '-qm', 'trabajo propio sin pushear')
  }

  return { base, clon, dest, shaA, shaB }
}

function correr (sujeto, { clon, dest }) {
  const env = { ...process.env, ONIA_LOOPS_REPO: clon }
  if (sujeto.varDest) env[sujeto.varDest] = dest
  const r = spawnSync('bash', [sujeto.ruta, '--dry-run'], { env, encoding: 'utf8' })
  return { code: r.status, out: `${r.stdout || ''}${r.stderr || ''}` }
}

const DESINCRONIZADO = /NO coincide con origin\/main/

test('hay al menos un publicador que compara el working tree (si no, este gate no mide nada)', () => {
  assert.ok(
    SUJETOS.length >= 1,
    `no encontré ningún publicar.sh con la comparación contra el working tree bajo ${DEPLOY}`,
  )
  for (const s of SUJETOS) {
    assert.ok(s.sub, `${s.ruta}: no pude leer su SUB=`)
    assert.ok(s.varDest, `${s.ruta}: no pude leer la variable de su DEST=`)
  }
})

for (const sujeto of SUJETOS) {
  const nombre = sujeto.ruta.slice(RAIZ.length + 1)

  test(`${nombre}: con el clon ATRASADO se pone al día y publica, no corta`, () => {
    const j = repoDeJuguete(sujeto)
    try {
      assert.equal(
        git(j.clon, 'rev-parse', 'HEAD'),
        j.shaA,
        'el juguete tiene que arrancar atrasado, o el caso no mide nada',
      )

      const { out } = correr(sujeto, j)

      assert.ok(
        !DESINCRONIZADO.test(out),
        `cortó por desincronización sobre un clon que sólo estaba atrasado.\n${out}`,
      )
      assert.equal(
        git(j.clon, 'rev-parse', 'HEAD'),
        j.shaB,
        'el publicador tenía que dejar el árbol en origin/main',
      )
      assert.equal(
        readFileSync(join(j.clon, sujeto.sub, 'src', 'motor.mjs'), 'utf8').trim(),
        "export const marca = 'commit-B'",
        'publicaría contenido viejo: el árbol no quedó en el de main',
      )
    } finally {
      rmSync(j.base, { recursive: true, force: true })
    }
  })

  test(`${nombre}: con trabajo PROPIO sin pushear sigue cortando (la guarda no se afloja)`, () => {
    const j = repoDeJuguete(sujeto, { divergir: true })
    try {
      const { code, out } = correr(sujeto, j)

      assert.ok(
        DESINCRONIZADO.test(out),
        `publicó un árbol que NO es main: eso es justo lo que la guarda existe para impedir.\n${out}`,
      )
      assert.equal(code, 2, 'un árbol que no es main tiene que salir con 2 (no se pudo medir)')
    } finally {
      rmSync(j.base, { recursive: true, force: true })
    }
  })
}

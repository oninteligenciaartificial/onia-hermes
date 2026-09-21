// Self-check PURO de `herramientas-del-cron.mjs`. No toca el VPS a propósito: entra a la
// cadena `npm test`, que corre antes de CADA merge de CADA carril, y un gate que necesita
// SSH para validarse pone roja esa cadena el día que el VPS no contesta — y la cura sería
// saltearse el gate. La medición viva es `npm run herramientas:vivas`.
//
// El caso que sostiene todo es el ANCLA: exige que el universo contenga las herramientas que
// el gate viejo no puede ver por construcción (las once que no empiezan con `onia-`). Sin
// él, estrechar el barrido a `/root/bin/onia-*` volvería a pasar en verde, que es
// exactamente cómo `chatwoot-brand-onia.sh` corrió 19 días desde una copia a mano.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import {
  RAIZ,
  ROJOS,
  cableadasEnElSincronizador,
  clasificar,
  clasificarHerramienta,
  esperaAlSincronizador,
  herramientasQueElCronEjecuta,
  shaQueElSincronizadorEjecuto,
} from './herramientas-del-cron.mjs'

// Recorte textual del crontab real del VPS, medido el 2026-09-19.
const CRONTAB = `
# --- onia ---
0 5 * * * /root/bin/backup-onia-db.sh >> /var/log/backup.log 2>&1
7 * * * * /root/bin/run-onia-trial-drip.sh
13 3 * * * /root/bin/chatwoot-brand-onia.sh
*/5 * * * * /root/bin/claude-guardia.sh
21 * * * * /root/bin/hermes-vigia.sh
44 * * * * /bin/bash /root/loops/onia-hermes/scripts/loops/sincronizar.sh
33 * * * * /root/bin/onia-loop.sh onia-cola
# 9 * * * * /root/bin/onia-vigia-congelado.sh   <- CONGELADO 2026-09-05
50 */3 * * * /root/bin/onia-publicar-solo.sh
`

// Los once nombres del crontab real que NO empiezan con `onia-`: el punto ciego del gate
// hermano. Si el universo deja de contenerlos, este archivo se pone rojo.
const SIN_EL_PREFIJO = [
  'backup-onia-db.sh',
  'run-onia-trial-drip.sh',
  'chatwoot-brand-onia.sh',
  'claude-guardia.sh',
  'hermes-vigia.sh',
]

test('ANCLA: el universo incluye las herramientas que NO empiezan con onia-', () => {
  const vivas = herramientasQueElCronEjecuta(CRONTAB).map((r) => r.split('/').pop())
  for (const nombre of SIN_EL_PREFIJO) {
    assert.ok(
      vivas.includes(nombre),
      `${nombre} tiene que ser sujeto: el cron la ejecuta y no empieza con onia-`
    )
  }
})

test('una línea comentada no ejecuta nada, así que no es sujeto', () => {
  const vivas = herramientasQueElCronEjecuta(CRONTAB).map((r) => r.split('/').pop())
  assert.ok(!vivas.includes('onia-vigia-congelado.sh'), 'un loop congelado no exige fuente')
})

test('sólo se miran las rutas de /root/bin, no cualquier script que el cron invoque', () => {
  const vivas = herramientasQueElCronEjecuta(CRONTAB)
  assert.ok(vivas.every((r) => r.startsWith('/root/bin/')))
  assert.ok(!vivas.some((r) => r.includes('sincronizar.sh')))
})

test('el mapa de cables usa el nombre de DESTINO, porque el sincronizador renombra', () => {
  const mapa = cableadasEnElSincronizador(`
poner "$FUENTE/sincronizar.sh" "$DESTINO_BIN/onia-loops-sync.sh"
poner "$RAIZ/scripts/kanban/tablero.sh" "$DESTINO_BIN/onia-tablero.sh"
poner "$RAIZ/hermes-content/deploy/onia-landing/publicar.sh" /opt/onia-landing/_deploy/publicar.sh
`)
  assert.equal(mapa.get('onia-loops-sync.sh'), 'scripts/loops/sincronizar.sh')
  assert.equal(mapa.get('onia-tablero.sh'), 'scripts/kanban/tablero.sh')
  // Lo que va a /opt lo vigila `publicadores-desplegados.test.mjs`: no es sujeto de acá.
  assert.ok(!mapa.has('publicar.sh'))
})

test('el sincronizador REAL sigue declarando cables hacia /root/bin', () => {
  // Si el parser deja de entender la forma del archivo devuelve un mapa vacío, y entonces
  // TODA herramienta cableada se reportaría como huérfana: un rojo masivo y falso.
  const mapa = cableadasEnElSincronizador(
    readFileSync(path.join(RAIZ, 'scripts/loops/sincronizar.sh'), 'utf8')
  )
  assert.ok(mapa.size >= 10, `esperaba ≥10 cables a /root/bin, hay ${mapa.size}`)
  assert.equal(mapa.get('onia-loops-sync.sh'), 'scripts/loops/sincronizar.sh')
})

test('no haber podido leer la copia viva NO es "no tiene fuente"', () => {
  const v = clasificarHerramienta({ nombre: 'x.sh', md5: null })
  assert.equal(v.veredicto, 'NO_MEDIDO')
})

test('cableada y con el mismo contenido: al día', () => {
  const v = clasificarHerramienta({
    nombre: 'onia-vigia-ci.sh',
    md5: 'aaa',
    fuenteCableada: 'scripts/loops/vigia-ci.sh',
    md5Fuente: 'aaa',
  })
  assert.equal(v.veredicto, 'CABLEADA')
})

test('cableada pero producción corre otra cosa: deriva', () => {
  const v = clasificarHerramienta({
    nombre: 'onia-vigia-ci.sh',
    md5: 'aaa',
    fuenteCableada: 'scripts/loops/vigia-ci.sh',
    md5Fuente: 'bbb',
  })
  assert.equal(v.veredicto, 'CABLEADA_EN_DERIVA')
  assert.ok(ROJOS.has(v.veredicto))
})

test('un cable que apunta a un archivo inexistente es rojo, no verde', () => {
  const v = clasificarHerramienta({
    nombre: 'onia-x.sh',
    md5: 'aaa',
    fuenteCableada: 'scripts/loops/borrado.sh',
    md5Fuente: null,
  })
  assert.equal(v.veredicto, 'CABLEADA_SIN_FUENTE')
  assert.ok(ROJOS.has(v.veredicto))
})

test('sin cable pero contenido idéntico: copia a mano, y es AVISO (hoy corre lo correcto)', () => {
  const v = clasificarHerramienta({
    nombre: 'claude-guardia.sh',
    md5: 'aaa',
    fuenteCableada: null,
    gemeloPorContenido: 'hermes-content/deploy/vps-ops/claude-guardia.sh',
  })
  assert.equal(v.veredicto, 'COPIA_A_MANO')
  assert.ok(!ROJOS.has(v.veredicto), 'una copia a mano al día no puede trabar la cadena')
})

test('sin cable y el homónimo del repo difiere: nadie sabe cuál es la buena', () => {
  const v = clasificarHerramienta({
    nombre: 'chatwoot-brand-onia.sh',
    md5: 'aaa',
    fuenteCableada: null,
    gemeloPorContenido: null,
    homonimo: 'hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh',
  })
  assert.equal(v.veredicto, 'EN_DERIVA_SIN_CABLE')
  assert.ok(ROJOS.has(v.veredicto))
})

test('sin cable y sin ninguna copia: un borrado se la lleva sin rastro', () => {
  const v = clasificarHerramienta({
    nombre: 'backup-onia-db.sh',
    md5: 'aaa',
    fuenteCableada: null,
    gemeloPorContenido: null,
    homonimo: null,
  })
  assert.equal(v.veredicto, 'SIN_FUENTE')
  assert.ok(ROJOS.has(v.veredicto))
})

test('el gemelo por CONTENIDO gana sobre el homónimo: el despliegue renombra', () => {
  // `sincronizar.sh` se despliega como `onia-loops-sync.sh`. Buscar por nombre no lo
  // encuentra nunca; buscar por contenido sí, y por eso no se inventa una huérfana.
  const v = clasificarHerramienta({
    nombre: 'onia-loops-sync.sh',
    md5: 'aaa',
    fuenteCableada: null,
    gemeloPorContenido: 'scripts/loops/sincronizar.sh',
    homonimo: null,
  })
  assert.equal(v.veredicto, 'COPIA_A_MANO')
})

test('una fuente que cambió DESPUÉS del último sync está esperando, no en deriva', () => {
  // El caso medido el 2026-09-19: el commit entró a main a las :47 y el sync había leído
  // main a las :44. Gritar «deriva» cada hora por la ventana normal apaga el gate.
  const espera = esperaAlSincronizador({
    commitDeLaFuente: 'nuevo',
    shaDelUltimoSync: 'viejo',
    esAncestro: (a, b) => (a === 'nuevo' && b === 'viejo' ? false : true),
  })
  assert.equal(espera, true)
})

test('si el sync YA vio el commit, la diferencia es deriva de verdad', () => {
  const espera = esperaAlSincronizador({
    commitDeLaFuente: 'viejo',
    shaDelUltimoSync: 'nuevo',
    esAncestro: () => true,
  })
  assert.equal(espera, false, 'el sync lo copió y aun así difiere: eso hay que mirarlo')
})

test('no haber podido preguntarle al grafo NO absuelve', () => {
  assert.equal(
    esperaAlSincronizador({ commitDeLaFuente: 'a', shaDelUltimoSync: 'b', esAncestro: () => null }),
    false
  )
  assert.equal(
    esperaAlSincronizador({ commitDeLaFuente: null, shaDelUltimoSync: 'b', esAncestro: () => false }),
    false,
    'sin saber qué commit tocó la fuente no se puede declarar pendiente'
  )
  assert.equal(
    esperaAlSincronizador({ commitDeLaFuente: 'a', shaDelUltimoSync: null, esAncestro: () => false }),
    false,
    'sin saber qué vio el sync tampoco'
  )
})

test('el sincronizador se despliega A SÍ MISMO, así que su cambio tarda una corrida más', () => {
  // Medido el 2026-09-19: la corrida del :44 leyó el main que ya traía la línea `poner`
  // nueva y en esa vuelta sólo se actualizó a sí misma — el `poner` corre recién a la
  // siguiente. Preguntar por el sha de la última corrida da «deriva» y manda a copiar a
  // mano algo que se cura solo en una hora.
  assert.equal(
    shaQueElSincronizadorEjecuto({ shas: ['a', 'b', 'c'], elCambioTocaAlSincronizador: true }),
    'b'
  )
})

test('si el cambio NO toca al sincronizador, manda la última corrida', () => {
  assert.equal(
    shaQueElSincronizadorEjecuto({ shas: ['a', 'b', 'c'], elCambioTocaAlSincronizador: false }),
    'c'
  )
})

test('sin corrida anterior en el log no se inventa una', () => {
  assert.equal(
    shaQueElSincronizadorEjecuto({ shas: ['c'], elCambioTocaAlSincronizador: true }),
    'c',
    'preferimos un rojo temprano a citar una corrida que no existió'
  )
  assert.equal(shaQueElSincronizadorEjecuto({ shas: [], elCambioTocaAlSincronizador: true }), null)
  assert.equal(shaQueElSincronizadorEjecuto({ elCambioTocaAlSincronizador: false }), null)
})

test('clasificar devuelve un veredicto por sujeto, sin perder ninguno', () => {
  const vs = clasificar([
    { nombre: 'a.sh', md5: null },
    { nombre: 'b.sh', md5: 'x', fuenteCableada: 'f', md5Fuente: 'x' },
    { nombre: 'c.sh', md5: 'y' },
  ])
  assert.deepEqual(
    vs.map((v) => v.veredicto),
    ['NO_MEDIDO', 'CABLEADA', 'SIN_FUENTE']
  )
})

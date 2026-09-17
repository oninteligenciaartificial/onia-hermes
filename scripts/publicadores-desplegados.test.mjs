// El `ok <id>` de Sergio Urcullo ejecuta /opt/<algo>/_deploy/publicar.sh. Esos
// archivos son COPIAS de hermes-content/deploy/**/publicar.sh, y este gate exige
// que alguien las mantenga.
//
// POR QUE EXISTE, medido el 2026-09-06 por onia-cola. Los tres publicadores
// coincidian con el repo — pero por diligencia, no por construccion:
// scripts/loops/sincronizar.sh (cron :44, despliega desde origin/main) copiaba
// SOLO el del bot. La linea del bot la agrego el arreglo del 2026-09-05, cuando
// el bot no estaba en la lista blanca del ejecutor; el arreglo se aplico a la
// instancia que lo motivo y no viajo a sus dos hermanas.
//
// El costo es MUDO en las dos direcciones, que es lo que lo hace caro:
//   · un carril arregla el publicador de landing en el repo, los gates dan
//     verde, el commit entra a main — y el `ok` de Sergio sigue corriendo la
//     copia vieja de /opt. El aviso dice "desplegado" igual.
//   · alguien arregla la copia de /opt a mano y ese arreglo no esta en git:
//     el dia que se sincronice se revierte solo.
// Es la misma familia que sincronizar.sh copiandose a si mismo con otro nombre:
// un circuito que se autodespliega no puede repararse a si mismo si la copia
// que ejecuta no es la que se versiona.
//
// Los SUJETOS salen de la lista blanca del ejecutor —lo que el `ok` corre de
// verdad— y del DISCO, nunca de una lista escrita a mano aca: un publicador
// nuevo nace cubierto y hay que excluirlo a la vista, con su motivo.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { leerDeProduccion, VPS, SSH_ARGS, citarParaShell } from './lib/vps-o-local.mjs'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const EJECUTOR = path.join(RAIZ, 'scripts/kanban/desplegar-en-segundo-plano.sh')
const SINCRONIZADOR = path.join(RAIZ, 'scripts/loops/sincronizar.sh')

// Vacio a proposito. Una entrada aca es "este publicador NO se sincroniza", y
// abajo hay un caso que se pone rojo si apunta a algo que ya no existe: una
// exencion vencida no puede tapar al publicador siguiente.
const EXCLUIDOS = []

// ⚠️ Este gate se quedo MUDO al mudarse el carril de maquina, y por eso ahora
// pregunta por SSH. El caso que compara produccion contra el repo —el UNICO que
// mira /opt, o sea el unico que puede ver un desvio— se salteaba con "no es el
// VPS", y desde el 2026-09-07 el integrador (que es quien corre esta cadena
// antes de CADA merge) vive en nodo-casa: diez dias saltandose en cada merge,
// con los otros cinco casos en verde cruzando textos del repo contra el repo.
// Un gate vivo que cambia de maquina no falla: deja de medir, y el tri-estado
// honesto se lee igual que "no hay desvio". `leerDeProduccion` pregunta al disco
// local y, si no esta, al VPS por SSH — y devuelve `null` cuando NINGUNA de las
// dos contesto, que es lo unico que distingue "no pude preguntar" de "no hay
// desvio".

/** Las rutas de produccion que el `ok <id>` de Sergio puede ejecutar. */
export function destinosDeLaListaBlanca (textoEjecutor) {
  const rutas = new Set()
  for (const m of textoEjecutor.matchAll(/\/opt\/[A-Za-z0-9._/-]*_deploy\/publicar\.sh/g)) rutas.add(m[0])
  return [...rutas].sort()
}

/** Los pares origen -> destino que el sincronizador mantiene. */
export function copiasDelSincronizador (textoSync) {
  const pares = []
  for (const m of textoSync.matchAll(/^\s*poner\s+"([^"]+)"\s+"?([^"\s]+)"?\s*$/gm)) {
    pares.push({ origen: m[1], destino: m[2] })
  }
  return pares
}

/** Todo publicador versionado, derivado del disco. */
export function publicadoresDelRepo (raiz = RAIZ) {
  const base = path.join(raiz, 'hermes-content/deploy')
  const hallados = []
  const recorrer = (dir) => {
    for (const entrada of readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entrada.name)
      if (entrada.isDirectory()) recorrer(p)
      else if (entrada.name === 'publicar.sh') hallados.push(path.relative(raiz, p))
    }
  }
  if (existsSync(base)) recorrer(base)
  return hallados.sort()
}

/**
 * ¿El archivo de produccion tiene el bit de ejecucion? TRI-ESTADO: `null` es "no
 * pude preguntar", nunca `false`. Un `cp` sobre un archivo que ya existia NO pone
 * el bit, asi que un publicador puede tener el contenido correcto y no poder
 * ejecutarse — el `ok <id>` de Sergio Urcullo falla y el aviso dice "desplegado".
 */
export function esEjecutableEnProduccion (ruta, { local = statSync, remoto = preguntarPorSsh } = {}) {
  if (existsSync(ruta)) {
    try { return Boolean(local(ruta).mode & 0o111) } catch { return null }
  }
  return remoto(ruta)
}

function preguntarPorSsh (ruta) {
  const r = spawnSync(
    'ssh',
    [...SSH_ARGS, VPS, `test -x ${citarParaShell(ruta)} && echo si || echo no`],
    { encoding: 'utf8', timeout: 60_000 }
  )
  if (r.error || r.status !== 0) return null
  const dijo = r.stdout.trim()
  if (dijo === 'si') return true
  if (dijo === 'no') return false
  return null
}

const textoEjecutor = readFileSync(EJECUTOR, 'utf8')
const textoSync = readFileSync(SINCRONIZADOR, 'utf8')
const destinos = destinosDeLaListaBlanca(textoEjecutor)
const copias = copiasDelSincronizador(textoSync)

test('la lista blanca del ejecutor nombra al menos un publicador', () => {
  // Si esto falla, el patron dejo de reconocer la lista blanca y los dos casos
  // de abajo estarian pasando sobre CERO sujetos: verde sin haber medido nada.
  assert.ok(destinos.length >= 1, `no encontre destinos en ${EJECUTOR}`)
})

test('todo destino que el `ok` de Sergio ejecuta lo mantiene el sincronizador', () => {
  const huerfanos = destinos.filter((d) => !copias.some((c) => c.destino === d))
  assert.deepEqual(
    huerfanos, [],
    `estos publicadores los corre el \`ok <id>\` y NADIE los actualiza desde main:\n  ${huerfanos.join('\n  ')}\n` +
    'Agregales un `poner "$RAIZ/<origen>" <destino>` en scripts/loops/sincronizar.sh.'
  )
})

test('todo publicador del repo esta cableado a la lista blanca del ejecutor', () => {
  const sinCablear = publicadoresDelRepo()
    .filter((p) => !EXCLUIDOS.includes(p))
    .filter((p) => !copias.some((c) => c.origen.endsWith('/' + p) && destinos.includes(c.destino)))
  assert.deepEqual(
    sinCablear, [],
    `estos publicadores existen en el repo y el \`ok <id>\` no los puede ejecutar:\n  ${sinCablear.join('\n  ')}`
  )
})

test('una exencion vencida no puede tapar al publicador siguiente', () => {
  const vencidas = EXCLUIDOS.filter((p) => !existsSync(path.join(RAIZ, p)))
  assert.deepEqual(vencidas, [], `EXCLUIDOS nombra archivos que ya no existen: ${vencidas.join(', ')}`)
})

test('el caso que YA cumple: el publicador del bot esta cubierto', () => {
  // Ancla el patron. Sin este caso, un regex que no matchea nada dejaria los
  // dos tests de arriba en verde con la lista de huerfanos vacia por accidente.
  const bot = copias.find((c) => c.destino === '/opt/onia/bot/_deploy/publicar.sh')
  assert.ok(bot, 'el sincronizador dejo de mantener el publicador del bot')
  assert.match(bot.origen, /vps-ops\/bot\/publicar\.sh$/)
})

test('lo que corre produccion es lo que dice el repo', (t) => {
  const desviados = []
  const noMedidos = []
  for (const destino of destinos) {
    const copia = copias.find((c) => c.destino === destino)
    if (!copia) continue // ya lo reporta el test de huerfanos; no dupliquemos el rojo
    const origen = copia.origen.replace(/^\$RAIZ\//, '').replace(/^\$FUENTE\//, 'scripts/loops/')
    const enRepo = path.join(RAIZ, origen)
    if (!existsSync(enRepo)) { desviados.push(`${destino}: el origen ${origen} no existe en el repo`); continue }

    const vivo = leerDeProduccion(destino)
    if (vivo === null) {
      // NI disco local NI SSH. No es "no hay desvio": es que no llegue a mirar.
      noMedidos.push(`${destino}: no pude leerlo ni en disco local ni por SSH al VPS`)
      continue
    }
    if (vivo.contenido !== readFileSync(enRepo, 'utf8')) {
      desviados.push(`${destino}: difiere del repo (${origen}) [leido ${vivo.origen}]`)
      continue
    }
    const ejecutable = esEjecutableEnProduccion(destino)
    if (ejecutable === false) desviados.push(`${destino}: no es ejecutable`)
    else if (ejecutable === null) noMedidos.push(`${destino}: no pude ver si es ejecutable`)
  }

  // El rojo va PRIMERO: un desvio medido no se puede tapar con lo que no se midio.
  assert.deepEqual(desviados, [], `produccion no corre lo que dice main:\n  ${desviados.join('\n  ')}`)

  // Y lo que no se pudo medir se DICE. Sin esto, una maquina sin SSH al VPS deja
  // este caso en verde sin haber mirado produccion, que es como quedo mudo diez dias.
  if (noMedidos.length > 0) {
    t.skip(`NO MEDIDO (no es un verde):\n  ${noMedidos.join('\n  ')}`)
  }
})

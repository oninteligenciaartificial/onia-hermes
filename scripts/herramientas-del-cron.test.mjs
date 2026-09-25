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
import { createHash } from 'node:crypto'
import path from 'node:path'
import {
  RAIZ,
  ROJOS,
  cableadasEnElSincronizador,
  clasificar,
  clasificarEnEstaMaquina,
  clasificarHerramienta,
  esperaAlSincronizador,
  herramientasQueElCronEjecuta,
  herramientasQueEscribeElInstalador,
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
0 7 * * * /root/bin/onia-backup-v2/backup-onia-postgres-daily.sh >> /var/log/onia-db-backup.log 2>&1
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

// Medido en el VPS el 2026-09-24: el cron ejecuta
// `/root/bin/onia-backup-v2/backup-onia-postgres-daily.sh` —el respaldo diario de la base de
// producción, creado el 23-sep— y el extractor devolvía `/root/bin/onia-backup-v2`, que es el
// DIRECTORIO. `md5sum` contestaba «Is a directory», la herramienta caía en NO MEDIDO y los tres
// ejecutables de adentro quedaban fuera del universo: nadie veía que no están versionados en
// ningún repo. Un sujeto mal recortado no sale rojo, sale INVISIBLE — y de paso deja el gate en
// exit 2 permanente, que es como un instrumento se vuelve decorativo.
test('una herramienta dentro de un subdirectorio de /root/bin es sujeto, no su carpeta', () => {
  const vivas = herramientasQueElCronEjecuta(CRONTAB)
  assert.ok(
    vivas.includes('/root/bin/onia-backup-v2/backup-onia-postgres-daily.sh'),
    'el sujeto es el EJECUTABLE que el cron corre, con su subdirectorio'
  )
  assert.ok(
    !vivas.includes('/root/bin/onia-backup-v2'),
    'el directorio contenedor no se ejecuta: medirlo da «Is a directory» y tapa al ejecutable'
  )
})

// Recíproco: el recorte no puede tragarse el resto de la línea. Si se lo tragara, el `md5sum`
// remoto recibiría basura y toda la medición saldría AUSENTE en vez de medir.
test('el recorte termina en el ejecutable y no arrastra la redirección del log', () => {
  const vivas = herramientasQueElCronEjecuta(CRONTAB)
  assert.ok(
    vivas.every((r) => !r.includes('>') && !r.includes('var/log') && !r.endsWith('/')),
    `alguna ruta arrastró el resto de la línea: ${vivas.join(' · ')}`
  )
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

// ── El segundo crontab: la máquina donde de verdad corren los loops ────────────────────
//
// Medido el 2026-09-25 por `onia-cola`: el universo de este instrumento sale de
// `ssh crontab -l` contra el VPS, y los cuatro loops vivos los lanza el crontab de
// nodo-casa. Estos casos anclan el cable de las herramientas de esa máquina, que no es
// `poner` del sincronizador sino un heredoc dentro de un instalador versionado.
test('ANCLA: preparar-nodo.sh sigue escribiendo el túnel, y su cuerpo es comparable', () => {
  const m = herramientasQueEscribeElInstalador(
    readFileSync(path.join(RAIZ, 'scripts/loops/preparar-nodo.sh'), 'utf8'),
    'scripts/loops/preparar-nodo.sh'
  )
  const tunel = m.get('onia-tunel-inverso.sh')
  assert.ok(tunel, 'preparar-nodo.sh dejó de escribir /root/bin/onia-tunel-inverso.sh')
  assert.equal(tunel.literal, true, 'el heredoc del túnel está entre comillas: su cuerpo se mide')
  assert.match(tunel.cuerpo, /ssh/, 'el cuerpo capturado no es el del túnel')
})

test('ANCLA: instalar-homelab.sh escribe la bajada de memoria, pero INTERPOLA', () => {
  const m = herramientasQueEscribeElInstalador(
    readFileSync(path.join(RAIZ, 'scripts/loops/instalar-homelab.sh'), 'utf8'),
    'scripts/loops/instalar-homelab.sh'
  )
  const bajar = m.get('onia-memoria-bajar.sh')
  assert.ok(bajar, 'instalar-homelab.sh dejó de escribir /root/bin/onia-memoria-bajar.sh')
  // El `.nuevo` del escribí-y-mové no es otro archivo: si se colara, el nombre no casaría
  // con el del crontab y la herramienta quedaría fuera del universo, que es invisible y no rojo.
  assert.equal(m.has('onia-memoria-bajar.sh.nuevo'), false)
  // Sin comillas el shell expande al instalar: afirmar que el cuerpo del repo es el de disco
  // sería inventar una medición.
  assert.equal(bajar.literal, false)
  assert.equal(bajar.cuerpo, null)
})

test('un heredoc sin cierre es un instalador roto: no se le cree el cuerpo a medias', () => {
  const m = herramientasQueEscribeElInstalador(
    'cat > /root/bin/onia-trunco.sh <<' + "'FIN'\n" + 'echo hola\n',
    'x.sh'
  )
  assert.equal(m.has('onia-trunco.sh'), false)
})

test('sólo /root/bin: un heredoc hacia otra carpeta no es sujeto de este instrumento', () => {
  const m = herramientasQueEscribeElInstalador(
    "cat > /etc/otra/onia-ajeno.sh <<'FIN'\nhola\nFIN\n",
    'x.sh'
  )
  assert.equal(m.size, 0)
})

test('con delimitador entre comillas el cuerpo es byte a byte el del archivo instalado', () => {
  const m = herramientasQueEscribeElInstalador(
    "cat > \"$BIN/onia-x.sh\" <<'FIN'\n#!/bin/sh\necho $NO_SE_EXPANDE\nFIN\n",
    'x.sh'
  )
  assert.equal(m.get('onia-x.sh').cuerpo, '#!/bin/sh\necho $NO_SE_EXPANDE\n')
})

test('ANCLA: el shim hacia el VPS también es cable, y su cuerpo NO es comparable', () => {
  const m = herramientasQueEscribeElInstalador(
    readFileSync(path.join(RAIZ, 'scripts/loops/instalar-homelab.sh'), 'utf8'),
    'scripts/loops/instalar-homelab.sh'
  )
  const tg = m.get('onia-tg.sh')
  assert.ok(tg, 'instalar-homelab.sh dejó de declarar el shim de onia-tg.sh')
  // En nodo-casa lo CORRECTO es que difiera de scripts/loops/onia-tg.sh: allá es el script
  // real del VPS, acá es el shim que delega por SSH. Sin este caso vuelve el rojo falso.
  assert.equal(tg.literal, false)
  assert.equal(tg.cuerpo, null)
})

test('la definición de la función shim no es una herramienta, ni su comentario', () => {
  const m = herramientasQueEscribeElInstalador(
    'shim() { # shim <nombre> <comando remoto>\n# El shim de docker.sh lo explica\n',
    'x.sh'
  )
  assert.equal(m.size, 0)
})

// ───────────────── el bloque de ESTA máquina (nodo-casa) ─────────────────
//
// Nace de un hueco que la vuelta del 2026-09-25 dejó ESCRITO en `COLA.md`: la decisión del
// bloque de casa vivía dentro del `.map` que lee el disco, así que sus dos caminos rojos
// —`INSTALADOR_EN_DERIVA` y `COPIA_A_MANO`— no los podía provocar ningún caso. El verde era
// cierto y nadie sabía si el rojo aparecería, que es la definición de un verde futuro.
// Los cables acá son TRES (sincronizador, heredoc literal, shim interpolado), uno más que en
// el VPS: por eso la función es hermana y no la misma, y por eso necesita sus propios casos.

const CUERPO = '#!/bin/bash\necho hola\n'
const H = (s) => createHash('md5').update(Buffer.from(s)).digest('hex')

test('casa: el cron la ejecuta y no está en disco — cada corrida falla', () => {
  const v = clasificarEnEstaMaquina({
    nombre: 'onia-loop.sh',
    ruta: '/root/bin/onia-loop.sh',
    maquina: 'casa',
    md5Vivo: null,
    gemeloPorContenido: null,
    instalador: null,
    fuenteCableada: 'scripts/loops/onia-loop.sh',
    homonimo: 'scripts/loops/onia-loop.sh',
  })
  // Rojo aunque HAYA cable: el cable no sirve de nada si el archivo no está.
  assert.equal(v.veredicto, 'SIN_FUENTE')
  assert.ok(ROJOS.has(v.veredicto))
})

test('casa: idéntica byte a byte a un archivo del repo — al día', () => {
  const v = clasificarEnEstaMaquina({
    nombre: 'onia-tablero.sh',
    ruta: '/root/bin/onia-tablero.sh',
    maquina: 'casa',
    md5Vivo: H(CUERPO),
    gemeloPorContenido: 'scripts/kanban/onia-tablero.sh',
    instalador: null,
    fuenteCableada: null,
    homonimo: null,
  })
  assert.equal(v.veredicto, 'CABLEADA')
  assert.match(v.detalle, /scripts\/kanban\/onia-tablero\.sh/)
})

test('casa: el instalador la escribe INTERPOLANDO, así que su cuerpo no se puede comparar', () => {
  const v = clasificarEnEstaMaquina({
    nombre: 'onia-tg.sh',
    ruta: '/root/bin/onia-tg.sh',
    maquina: 'casa',
    md5Vivo: H('cualquier otra cosa'),
    gemeloPorContenido: null,
    instalador: { instalador: 'scripts/loops/instalar-homelab.sh', literal: false, cuerpo: null },
    // El shim de casa DIFIERE del script real del VPS a propósito: allá ejecuta, acá delega
    // por SSH. Sin este camino volvía el rojo falso que ya se cazó una vez.
    fuenteCableada: 'scripts/loops/onia-tg.sh',
    homonimo: 'scripts/loops/onia-tg.sh',
  })
  assert.equal(v.veredicto, 'CABLEADA_POR_INSTALADOR')
  assert.ok(!ROJOS.has(v.veredicto), 'un cuerpo incomparable no es una deriva')
})

test('casa: heredoc literal y el archivo vivo coincide byte a byte — al día', () => {
  const v = clasificarEnEstaMaquina({
    nombre: 'onia-tunel-inverso.sh',
    ruta: '/root/bin/onia-tunel-inverso.sh',
    maquina: 'casa',
    md5Vivo: H(CUERPO),
    gemeloPorContenido: null,
    instalador: { instalador: 'scripts/loops/preparar-nodo.sh', literal: true, cuerpo: CUERPO },
    fuenteCableada: null,
    homonimo: null,
  })
  assert.equal(v.veredicto, 'CABLEADA')
  assert.match(v.detalle, /byte a byte/)
})

test('ROJO: el instalador escribe OTRA cosa que la que corre — deriva', () => {
  const v = clasificarEnEstaMaquina({
    nombre: 'onia-tunel-inverso.sh',
    ruta: '/root/bin/onia-tunel-inverso.sh',
    maquina: 'casa',
    md5Vivo: H(CUERPO + 'una línea que alguien agregó a mano\n'),
    gemeloPorContenido: null,
    instalador: { instalador: 'scripts/loops/preparar-nodo.sh', literal: true, cuerpo: CUERPO },
    fuenteCableada: null,
    homonimo: null,
  })
  assert.equal(v.veredicto, 'INSTALADOR_EN_DERIVA')
  assert.ok(ROJOS.has(v.veredicto), 'correr otra cosa que la versionada tiene que ser rojo')
  assert.match(v.detalle, /preparar-nodo\.sh/)
})

test('ROJO: cableada por el sincronizador pero corre otra cosa — deriva', () => {
  const v = clasificarEnEstaMaquina({
    nombre: 'onia-memoria-bajar.sh',
    ruta: '/root/bin/onia-memoria-bajar.sh',
    maquina: 'casa',
    md5Vivo: H('el fósil'),
    gemeloPorContenido: null,
    instalador: null,
    fuenteCableada: 'scripts/loops/onia-memoria-bajar.sh',
    homonimo: 'scripts/loops/onia-memoria-bajar.sh',
  })
  assert.equal(v.veredicto, 'CABLEADA_EN_DERIVA')
  assert.ok(ROJOS.has(v.veredicto))
})

test('ROJO: sin cable y el homónimo del repo difiere — nadie sabe cuál es la buena', () => {
  const v = clasificarEnEstaMaquina({
    nombre: 'onia-vigia-disco.sh',
    ruta: '/root/bin/onia-vigia-disco.sh',
    maquina: 'casa',
    md5Vivo: H('el de casa'),
    gemeloPorContenido: null,
    instalador: null,
    fuenteCableada: null,
    homonimo: 'scripts/loops/vigia-disco.sh',
  })
  assert.equal(v.veredicto, 'EN_DERIVA_SIN_CABLE')
  assert.ok(ROJOS.has(v.veredicto))
})

test('AVISO: sin cable y sin ninguna copia — un borrado se la lleva sin rastro', () => {
  const v = clasificarEnEstaMaquina({
    nombre: 'onia-algo-local.sh',
    ruta: '/root/bin/onia-algo-local.sh',
    maquina: 'casa',
    md5Vivo: H('sólo vive acá'),
    gemeloPorContenido: null,
    instalador: null,
    fuenteCableada: null,
    homonimo: null,
  })
  assert.equal(v.veredicto, 'COPIA_A_MANO')
  // Aviso, no rojo: hoy corre lo correcto. Lo que falta es que algo la copie.
  assert.ok(!ROJOS.has(v.veredicto))
  assert.match(v.detalle, /sólo existe en casa/)
})

test('el gemelo por CONTENIDO gana sobre el instalador y sobre el cable', () => {
  // Orden deliberado: si el archivo vivo ES un archivo del repo, da igual quién lo puso.
  // Invertirlo haría que un heredoc en deriva tapara una herramienta que está al día.
  const v = clasificarEnEstaMaquina({
    nombre: 'onia-loop.sh',
    ruta: '/root/bin/onia-loop.sh',
    maquina: 'casa',
    md5Vivo: H(CUERPO),
    gemeloPorContenido: 'scripts/loops/onia-loop.sh',
    instalador: { instalador: 'scripts/loops/instalar-homelab.sh', literal: true, cuerpo: 'otra cosa\n' },
    fuenteCableada: 'scripts/loops/otro-nombre.sh',
    homonimo: 'scripts/loops/onia-loop.sh',
  })
  assert.equal(v.veredicto, 'CABLEADA')
  assert.match(v.detalle, /idéntica a scripts\/loops\/onia-loop\.sh/)
})

test('ANCLA: los dos caminos rojos del bloque de casa están en ROJOS', () => {
  // Sin esto, sacarlos del conjunto dejaría el instrumento informando la deriva en verde
  // —que es exactamente cómo un instrumento deja de avisar sin dejar de contestar.
  for (const r of ['INSTALADOR_EN_DERIVA', 'COPIA_A_MANO']) {
    assert.equal(ROJOS.has(r), r === 'INSTALADOR_EN_DERIVA', `${r} cambió de lado`)
  }
})

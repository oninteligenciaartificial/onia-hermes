// Las herramientas que los loops invocan como /root/bin/onia-*.sh son COPIAS de
// archivos versionados de este repo, y este gate exige que las despliegue
// scripts/loops/sincronizar.sh — o sea que la copia que EJECUTA sea la que se
// versiona, por construccion y no por diligencia.
//
// POR QUE EXISTE, medido el 2026-09-10 por onia-cola. El 2026-09-08 chatbot-cola
// arreglo la dedup de avisos de onia-tg.sh: la clave pasa a calcularse sobre el
// titulo NORMALIZADO (`sed 's/[0-9][0-9]*/N/g'`), porque con la clave cruda dos
// avisos que solo difieren en la duracion —"chatbot-cola · 433s" y "· 7s"— hashean
// distinto y el tablero se llena del MISMO aviso. El arreglo entro a main con su
// gate propio (test:tg-dedup, verde) y NO llego nunca a la maquina que lo corre:
//
//   repo scripts/loops/onia-tg.sh   ->  CLAVE=$(... | sed 's/[0-9][0-9]*/N/g' | md5sum ...)
//   VPS  /root/bin/onia-tg.sh:65    ->  CLAVE=$(printf '%s' "$TITULO" | md5sum ...)
//
// Dos dias despues habia 22 tareas [auto:] vivas que eran el MISMO aviso repetido,
// sobre el tablero del que los cuatro carriles sacan trabajo. Y lo que lo mantuvo
// invisible fue un COMENTARIO: sincronizar.sh:221 decia que el tablero va a
// /root/bin "junto a onia-tg.sh, que es exactamente el mismo caso y por eso nunca
// fallo" — una hipotesis con fecha escrita como hecho, al lado de las 20 lineas
// `poner` donde onia-tg.sh justamente no estaba.
//
// Es la misma familia que publicadores-desplegados.test.mjs, un escalon mas afuera:
// alla los sujetos son los publicadores de /opt, aca las herramientas de /root/bin.
// Y es el HERMANO que le faltaba a test:tg-dedup — ese mide que la LOGICA de la
// fuente sea correcta, y una fuente correcta no dice nada de la copia que corre.
//
// EL UNIVERSO SE DERIVA, no se escribe: es la interseccion de "algo del repo la
// nombra como /root/bin/onia-X" y "X tiene fuente versionada aca". Por eso no hay
// lista de exclusiones que se pueda pudrir — un shim del nodo de casa
// (onia-vps.sh, onia-tunel-inverso.sh) no tiene fuente versionada y cae solo, y
// una herramienta nueva con fuente en el repo nace CUBIERTA y hay que declararla.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SINCRONIZADOR = 'scripts/loops/sincronizar.sh'

// Este archivo se excluye del barrido a proposito: nombra /root/bin/onia-tg.sh en
// su bitacora y en sus fixtures, asi que si se mirara a si mismo se volveria su
// propio sujeto. Un gate que se absuelve —o se acusa— con su propia bitacora no
// mide nada; hay un caso abajo que exige que esta exclusion siga siendo UNA sola.
const ME_EXCLUYO = ['scripts/herramientas-desplegadas.test.mjs']

/** Las rutas /root/bin/onia-* que el repo nombra, con los archivos que las nombran. */
export function herramientasNombradas (textosPorArchivo) {
  const encontradas = new Map()
  for (const [archivo, texto] of Object.entries(textosPorArchivo)) {
    for (const m of texto.matchAll(/\/root\/bin\/(onia-[a-zA-Z0-9._-]*[a-zA-Z0-9])/g)) {
      const nombre = m[1]
      if (!encontradas.has(nombre)) encontradas.set(nombre, new Set())
      encontradas.get(nombre).add(archivo)
    }
  }
  return encontradas
}

/** Los destinos que sincronizar.sh declara con `poner ... "$DESTINO_BIN/x"`. */
export function destinosDeclarados (fuenteDelSincronizador) {
  const sinComentarios = fuenteDelSincronizador
    .split('\n')
    .filter((l) => !l.trimStart().startsWith('#'))
    .join('\n')
  return new Set(
    [...sinComentarios.matchAll(/\$DESTINO_BIN\/([a-zA-Z0-9._-]+)/g)].map((m) => m[1])
  )
}

// Lo que sincronizar.sh POSEE. Medido el 2026-09-10: sus 20 lineas `poner` copian
// todas desde scripts/ (15 de scripts/loops, 4 de scripts/kanban, 1 suelto), y hay
// un caso abajo que se pone rojo si eso deja de ser cierto.
//
// El recorte importa en la direccion cara. Sin el, el gate exigia que sincronizar.sh
// desplegara tambien onia-mirar-cliente.sh y sus dos hermanos, cuya fuente vive en
// hermes-content/deploy/vps-ops/ y tiene OTRO dueno de deploy: tres rojos que
// mandaban a "arreglar" un circuito sano, y encima aparecian porque esos scripts se
// nombran a SI MISMOS en su propio encabezado de uso.
//
// 2026-09-19 — deja de ser UN prefijo y pasa a ser una LISTA, porque sincronizar.sh
// empezo a copiar fuera de scripts/ y el caso de abajo lo cazo, que es para lo que
// estaba. La entrada nueva es un ARCHIVO y no la carpeta: nombrar
// `hermes-content/deploy/vps-ops/` entero volveria agujeros a sus otros habitantes
// (onia-mirar-cliente.sh y los dos hermanos del comentario de arriba), que es el rojo
// falso que el recorte vino a evitar. Un archivo cableado se declara de a uno.
const DUENO_DEL_DESPLIEGUE = [
  'scripts/',
  'hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh'
]
const loDespliegaEsteCircuito = (fuente) => DUENO_DEL_DESPLIEGUE.some((z) => fuente.startsWith(z))

/**
 * Un sujeto es un AGUJERO si el repo lo nombra, su fuente versionada esta en la zona
 * que sincronizar.sh despliega, y no tiene linea `poner`. `fuenteDe` devuelve la ruta
 * versionada o null.
 */
export function agujeros (nombradas, declarados, fuenteDe) {
  const fuera = []
  for (const [nombre, archivos] of [...nombradas].sort()) {
    if (declarados.has(nombre)) continue
    const fuente = fuenteDe(nombre)
    if (!fuente) continue // sin fuente versionada no hay nada que desplegar (shims del nodo)
    if (!loDespliegaEsteCircuito(fuente)) continue // lo despliega otro circuito
    fuera.push({ nombre, fuente, nombradaEn: [...archivos].sort() })
  }
  return fuera
}

// ── Lectura del repo ────────────────────────────────────────────────────────────
function versionados () {
  return execFileSync('git', ['ls-files'], { cwd: RAIZ, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
    .split('\n')
    .filter(Boolean)
}

function fuenteDeEnElRepo (todos) {
  return (nombre) => {
    const base = nombre.replace(/^onia-/, '')
    // El despliegue RENOMBRA (tablero.sh -> onia-tablero.sh), asi que se acepta la
    // fuente con o sin el prefijo. Solo importa para los NO declarados.
    const re = new RegExp(`(^|/)(onia-)?${base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`)
    return todos.find((f) => re.test(f)) ?? null
  }
}

function textosDeLaMaquinaria (todos) {
  const candidatos = todos.filter(
    (f) =>
      (f.startsWith('scripts/') || f.startsWith('hermes-content/deploy/')) &&
      /\.(sh|mjs|js|py|md)$/.test(f) &&
      !ME_EXCLUYO.includes(f)
  )
  const textos = {}
  for (const f of candidatos) {
    const abs = path.join(RAIZ, f)
    if (!existsSync(abs)) continue // worktree al que le falta un archivo versionado
    try {
      textos[f] = readFileSync(abs, 'utf8')
    } catch {
      /* binario o ilegible: no aporta sujetos */
    }
  }
  return textos
}

// ── Los casos ───────────────────────────────────────────────────────────────────
const TODOS = versionados()
const SINC = readFileSync(path.join(RAIZ, SINCRONIZADOR), 'utf8')
const NOMBRADAS = herramientasNombradas(textosDeLaMaquinaria(TODOS))
const DECLARADOS = destinosDeclarados(SINC)
const AGUJEROS = agujeros(NOMBRADAS, DECLARADOS, fuenteDeEnElRepo(TODOS))

test('toda herramienta de /root/bin con fuente versionada la despliega sincronizar.sh', () => {
  assert.deepEqual(
    AGUJEROS.map((a) => `${a.nombre} (fuente: ${a.fuente}, nombrada en ${a.nombradaEn[0]})`),
    [],
    'Estas herramientas las invocan los loops y tienen fuente en el repo, pero ' +
      'sincronizar.sh no las copia: la que EJECUTA es una copia a mano que se ' +
      'atrasa sin avisar. Agregar su linea `poner` en ' + SINCRONIZADOR + '.'
  )
})

test('el barrido encontro sujetos (si da cero, el instrumento esta roto, no el repo)', () => {
  assert.ok(
    NOMBRADAS.size >= 5,
    `solo ${NOMBRADAS.size} herramientas /root/bin/onia-* nombradas: el barrido no esta mirando la maquinaria`
  )
  assert.ok(
    DECLARADOS.size >= 10,
    `solo ${DECLARADOS.size} destinos leidos de ${SINCRONIZADOR}: el patron de \`poner\` no matchea`
  )
})

test('onia-tg.sh —el aviso a Sergio Urcullo— se despliega, no se copia a mano', () => {
  // El sujeto que motivo el gate, anclado por nombre: es el unico camino por el
  // que un carril le habla a Sergio Urcullo y por el que nacen las tareas [auto:].
  assert.ok(
    DECLARADOS.has('onia-tg.sh'),
    'sincronizar.sh dejo de desplegar onia-tg.sh: su dedup vuelve a poder atrasarse ' +
      'en la maquina que la corre, y el sintoma es el tablero lleno del mismo aviso'
  )
})

test('un sujeto NUEVO con fuente versionada sale NOMBRADO (no se cuela en silencio)', () => {
  // La mutacion que importa: no "rompi el arreglo" sino "agregue una herramienta".
  const nombradas = herramientasNombradas({
    'scripts/loops/inventado.sh': 'exec /root/bin/onia-flamante.sh "$@"'
  })
  const fuera = agujeros(nombradas, new Set(['onia-tg.sh']), (n) =>
    n === 'onia-flamante.sh' ? 'scripts/loops/onia-flamante.sh' : null
  )
  assert.deepEqual(fuera.map((f) => f.nombre), ['onia-flamante.sh'])
  assert.deepEqual(fuera[0].nombradaEn, ['scripts/loops/inventado.sh'])
})

test('un shim sin fuente versionada NO es agujero (asi no hace falta lista de exenciones)', () => {
  // onia-vps.sh y onia-tunel-inverso.sh los crea instalar-homelab.sh en el nodo de
  // casa y no existen en git: exigirles un `poner` seria un rojo falso permanente.
  const nombradas = herramientasNombradas({
    'scripts/loops/x.sh': '/root/bin/onia-vps.sh bash -lc "true"'
  })
  assert.deepEqual(agujeros(nombradas, new Set(), () => null), [])
})

test('un destino que solo aparece en un COMENTARIO no cuenta como declarado', () => {
  // Es exactamente como sobrevivio el bug: sincronizar.sh:221 nombraba a onia-tg.sh
  // en prosa, al lado de las lineas `poner` donde no estaba.
  const declarados = destinosDeclarados(
    '# va a /root/bin junto a $DESTINO_BIN/onia-tg.sh, mismo caso\n' +
      'poner "$FUENTE/otra.sh" "$DESTINO_BIN/onia-otra.sh"\n'
  )
  assert.equal(declarados.has('onia-tg.sh'), false, 'una mencion en prosa absolvio al sujeto')
  assert.equal(declarados.has('onia-otra.sh'), true)
})

test('la exclusion de este archivo es UNA sola y sigue apuntando a algo que existe', () => {
  // Una exclusion que se pudre tapa al sujeto siguiente. Se pregunta al DISCO y no a
  // `git ls-files`: recien creado el archivo todavia no esta versionado, y ahi este
  // caso daba rojo sobre una exclusion perfectamente vigente.
  assert.equal(ME_EXCLUYO.length, 1)
  assert.ok(
    existsSync(path.join(RAIZ, ME_EXCLUYO[0])),
    `${ME_EXCLUYO[0]} ya no existe: la exclusion quedo vencida`
  )
})

test('sincronizar.sh sigue desplegando SOLO desde scripts/ (si no, este gate quedo corto)', () => {
  // El recorte de DUENO_DEL_DESPLIEGUE es una premisa medida, no una ley. El dia que
  // sincronizar.sh empiece a copiar de otra zona, el universo de este gate se queda
  // corto en silencio — que es como nacio el bug que vino a cerrar.
  const origenes = [...SINC.matchAll(/^poner\s+"\$(FUENTE|RAIZ)\/([^"]+)"/gm)].map((m) =>
    m[1] === 'FUENTE' ? `scripts/loops/${m[2]}` : m[2]
  )
  assert.ok(origenes.length >= 15, `solo ${origenes.length} lineas \`poner\` leidas: el patron no matchea`)
  assert.deepEqual(
    origenes.filter((o) => !loDespliegaEsteCircuito(o)),
    [],
    'sincronizar.sh despliega desde una zona que DUENO_DEL_DESPLIEGUE no declara, ' +
      'porque el barrido ya no cubre todo lo que este script publica'
  )
})

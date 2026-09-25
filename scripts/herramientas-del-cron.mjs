// ¿La herramienta que el cron del VPS EJECUTA es la que este repo versiona?
//
// POR QUÉ EXISTE, medido el 2026-09-19 por `onia-cola` cruzando el crontab del VPS contra
// `/root/bin` y contra el repo. El gate hermano —`scripts/herramientas-desplegadas.test.mjs`—
// deriva su universo de quién NOMBRA una ruta `/root/bin/onia-*` desde el repo, y eso falla
// abierto por DOS lados a la vez:
//
//   1. Agrupa por la FORMA del nombre. De las 29 herramientas que el cron invoca, ONCE no
//      empiezan con `onia-` (`backup-onia-db.sh`, `claude-guardia.sh`, `hermes-vigia.sh`,
//      los cinco `run-onia-*.sh`, …). Una lista de inclusión disfrazada de derivación:
//      el hermano irregular queda invisible por construcción.
//   2. Pregunta quién la NOMBRA, no quién la EJECUTA. Una herramienta que nadie cita desde
//      el repo no es sujeto de nadie, aunque el cron la corra cada hora.
//
// El costo ya se pagó: `chatwoot-brand-onia.sh` corrió 19 días desde una copia a mano
// mientras el arreglo esperaba en `main`, y durante esos 19 días la pantalla de login de
// `chat.onia.com.bo` le mostró al cliente los términos y la privacidad de CHATWOOT.
//
// EL UNIVERSO SALE DEL CRONTAB DEL VPS —quien EJECUTA—, nunca de una lista escrita acá ni
// de un prefijo. Y el veredicto es TRI-ESTADO: desde nodo-casa sin SSH sale `NO MEDIDO`
// (exit 2) y jamás verde, porque «no pude preguntar» y «me contestaron que está bien»
// mandan a lugares opuestos y el segundo calla un arreglo que no llegó.
//
// FORMA (la que pide `hermes-content/docs/COLA.md`): el self-check PURO entra a la cadena
// `npm test` —así el instrumento se valida en cada merge sin depender del SSH—, y la
// medición VIVA es el alias `npm run herramientas:vivas`, que corre en el arranque del
// carril. Meter la medición viva en la cadena pondría roja la de TODOS los carriles el día
// que el VPS no conteste, y la cura sería saltearse el gate.
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { VPS, SSH_ARGS } from './lib/vps-o-local.mjs'

export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

/**
 * Las rutas `/root/bin/...` que el crontab EJECUTA.
 *
 * Se saltean las líneas comentadas: un loop congelado con `#` adelante no ejecuta nada, y
 * contarlo haría exigir fuente versionada para herramientas que ya nadie corre.
 */
export function herramientasQueElCronEjecuta (textoCrontab) {
  const encontradas = new Set()
  for (const linea of String(textoCrontab ?? '').split('\n')) {
    if (/^\s*#/.test(linea)) continue
    // Los segmentos extra son obligatorios: el cron ejecuta ejecutables ANIDADOS
    // (`/root/bin/onia-backup-v2/backup-onia-postgres-daily.sh`, el respaldo diario de la base).
    // Sin ellos el recorte devolvía la CARPETA, `md5sum` contestaba «Is a directory» y el
    // ejecutable real quedaba fuera del universo — invisible, no rojo. El `*` final no se vuelve
    // codicioso de más porque la clase no incluye espacios ni `>`.
    for (const m of linea.matchAll(/\/root\/bin\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*/g)) {
      encontradas.add(m[0])
    }
  }
  return [...encontradas].sort()
}

/**
 * El mapa destino -> fuente que declara `sincronizar.sh`, o sea qué herramientas tienen
 * cable de despliegue. La clave es el NOMBRE con el que la herramienta vive en `/root/bin`,
 * que es el que aparece en el crontab: el sincronizador RENOMBRA al desplegar
 * (`sincronizar.sh` -> `onia-loops-sync.sh`, `vigia-ci.sh` -> `onia-vigia-ci.sh`, …), así
 * que cruzar por nombre de archivo del repo inventa huérfanas que no existen.
 */
export function cableadasEnElSincronizador (textoSincronizador) {
  const mapa = new Map()
  const re = /^\s*poner\s+"([^"]+)"\s+"?([^"\s]+)"?/gm
  for (const m of String(textoSincronizador ?? '').matchAll(re)) {
    const [, fuente, destino] = m
    if (!/(\$\{?DESTINO_BIN\}?|\/root\/bin)\//.test(destino)) continue
    const nombre = destino.split('/').pop()
    const rel = fuente
      .replace(/^\$\{?FUENTE\}?\//, 'scripts/loops/')
      .replace(/^\$\{?RAIZ\}?\//, '')
    mapa.set(nombre, rel)
  }
  return mapa
}

/**
 * Las herramientas de `/root/bin` que un INSTALADOR versionado escribe con un heredoc.
 *
 * POR QUÉ, medido el 2026-09-25 por `onia-cola` desde nodo-casa: el universo de este
 * instrumento sale del crontab del VPS, y desde el 07-sep los CUATRO loops vivos —incluido
 * `onia-cola`, el único camino a `main`— los lanza el crontab de nodo-casa. Esa máquina
 * corre seis herramientas y no las mide nadie. Cruzadas a mano ese día: `onia-loop.sh` y
 * `onia-vigia-disco.sh` son idénticas a su fuente del repo, pero `onia-memoria-bajar.sh`,
 * `onia-tunel-inverso.sh` y `onia-tg.sh` no tienen gemelo por contenido — y NO son copias a
 * mano: dos las ESCRIBE un instalador versionado (`instalar-homelab.sh`,
 * `preparar-nodo.sh`) y la tercera es el shim que delega al VPS por SSH. Clasificarlas con
 * el mapa de `poner` del sincronizador las pintaría amarillas todas las vueltas, y un gate
 * que grita en falso se termina salteando — que es el motivo escrito de las otras
 * carve-outs de este archivo.
 *
 * `literal` es la diferencia que decide cuánto se puede afirmar: con el delimitador entre
 * comillas (`<<'TUN'`) el cuerpo es byte a byte lo que queda en disco, así que la deriva se
 * MIDE; sin comillas (`<<BAJAR`) el shell interpola variables al instalar y el cuerpo del
 * repo no es comparable — ahí sólo se puede afirmar que el cable existe y está versionado.
 * Decir más sería inventar una medición.
 */
export function herramientasQueEscribeElInstalador (textoInstalador, instalador) {
  const mapa = new Map()
  const lineas = String(textoInstalador ?? '').split('\n')
  // `cat > "$BIN/onia-x.sh.nuevo" <<BAJAR` y `cat > /root/bin/onia-x.sh <<'TUN'`. El destino
  // se acepta por `/root/bin` o por la variable que el instalador usa para esa carpeta; el
  // sufijo `.nuevo`/`.tmp` es el escritorio-y-mové de `instalar-homelab.sh`, no otro archivo.
  // El delimitador va en DOS alternativas explícitas en vez de una retro-referencia: con
  // `(')?…\1?` la numeración de grupos la manda el NOMBRE, que va antes, así que `\1` apuntaba
  // al nombre y el caso entre comillas —el único cuyo cuerpo se puede medir— no casaba nunca.
  // Lo cazaron las dos anclas contra los instaladores reales.
  const re = /^\s*cat\s*>\s*"?(?:\/root\/bin|\$\{?BIN\}?|\$\{?DESTINO_BIN\}?)\/([A-Za-z0-9_.-]+?)(?:\.nuevo|\.tmp)?"?\s*<<\s*(?:'([A-Za-z_][A-Za-z0-9_]*)'|([A-Za-z_][A-Za-z0-9_]*))\s*$/
  // El TERCER cable, y el que delató que dos no alcanzaban: `instalar-homelab.sh` declara
  // los shims hacia el VPS con `shim <nombre> <comando remoto>`, una función suya cuyo
  // heredoc escribe a `"$BIN/$n"` —un nombre VARIABLE, invisible para el barrido de arriba—.
  // Sin esto, `onia-tg.sh` salía 🔴 CABLEADA_EN_DERIVA contra `scripts/loops/onia-tg.sh`, que
  // es el script REAL del VPS: en nodo-casa lo correcto es justamente que difiera, porque
  // ahí es un shim que delega por SSH. Un rojo por el motivo equivocado se termina salteando.
  const reShim = /^\s*shim\s+([A-Za-z0-9_.-]+\.(?:sh|mjs|py))\s+\S/
  for (const linea of lineas) {
    if (/^\s*#/.test(linea)) continue
    const s = linea.match(reShim)
    // Interpolado a propósito: el cuerpo lo arma la función con la llave y el host del nodo,
    // así que existe cable versionado pero no hay cuerpo comparable byte a byte.
    if (s && !mapa.has(s[1])) mapa.set(s[1], { instalador, literal: false, cuerpo: null })
  }
  for (let i = 0; i < lineas.length; i++) {
    const m = lineas[i].match(re)
    if (!m) continue
    const [, nombre, delimLiteral, delimInterpolado] = m
    const comilla = delimLiteral != null
    const delim = delimLiteral ?? delimInterpolado
    const cuerpo = []
    let cerrado = false
    for (let j = i + 1; j < lineas.length; j++) {
      if (lineas[j].trim() === delim) { cerrado = true; break }
      cuerpo.push(lineas[j])
    }
    // Un heredoc sin cierre es un instalador roto: no se le cree el cuerpo a medias.
    if (!cerrado) continue
    const literal = comilla
    mapa.set(nombre, {
      instalador,
      literal,
      cuerpo: literal ? cuerpo.join('\n') + '\n' : null,
    })
  }
  return mapa
}

/**
 * El veredicto de UNA herramienta, a partir de la evidencia ya recogida.
 *
 * `md5 === null` es «no pude leer la copia viva», que NO es lo mismo que «no existe»: por
 * eso corta antes que todo lo demás y sale NO MEDIDO en vez de acusar al repo.
 */
export function clasificarHerramienta (ev) {
  const { nombre, md5, fuenteCableada, md5Fuente, gemeloPorContenido, homonimo } = ev
  if (md5 == null) {
    return { nombre, veredicto: 'NO_MEDIDO', detalle: 'no pude leer la copia viva' }
  }
  if (fuenteCableada) {
    if (md5Fuente == null) {
      return {
        nombre,
        veredicto: 'CABLEADA_SIN_FUENTE',
        detalle: `sincronizar.sh la despliega desde ${fuenteCableada}, que no existe en el repo`,
      }
    }
    return md5 === md5Fuente
      ? { nombre, veredicto: 'CABLEADA', detalle: fuenteCableada }
      : {
          nombre,
          veredicto: 'CABLEADA_EN_DERIVA',
          detalle: `cableada a ${fuenteCableada}, pero producción corre otra cosa`,
        }
  }
  if (gemeloPorContenido) {
    return {
      nombre,
      veredicto: 'COPIA_A_MANO',
      detalle: `idéntica a ${gemeloPorContenido}, pero nada la copia: el día que alguien arregle la fuente, producción sigue con el fósil`,
    }
  }
  // Onia son DOS repos, y los crons que llaman a la app viven en el de la app. Preguntarle
  // sólo a este repo declara «sin fuente» a algo que sí está versionado, que es el veredicto
  // opuesto: manda a respaldar una copia que ya tiene dueño, y crea la segunda fuente de
  // verdad que `CLAUDE.md` prohíbe. Medido el 2026-09-19 con los dos `run-onia-*-reminders.sh`.
  if (ev.gemeloEnElHermano) {
    return {
      nombre,
      veredicto: 'VERSIONADA_EN_EL_HERMANO',
      detalle: `vive en onia-platform:${ev.gemeloEnElHermano} — no se pierde, pero nada la copia al VPS`,
    }
  }
  if (ev.hermanoNoMedido) {
    return {
      nombre,
      veredicto: 'NO_MEDIDO',
      detalle: `no está en este repo y no pude preguntarle a onia-platform: ${ev.hermanoNoMedido}`,
    }
  }
  if (homonimo) {
    return {
      nombre,
      veredicto: 'EN_DERIVA_SIN_CABLE',
      detalle: `${homonimo} existe en el repo y NO es lo que corre; nadie sabe cuál de las dos es la buena`,
    }
  }
  return {
    nombre,
    veredicto: 'SIN_FUENTE',
    detalle: 'no existe ninguna copia en el repo: un borrado se la lleva sin rastro',
  }
}

/**
 * Contra QUÉ sha hay que preguntar, que no siempre es el de la última corrida.
 *
 * `sincronizar.sh` se despliega A SÍ MISMO: la corrida del `:44` copia la versión nueva y
 * recién la SIGUIENTE la ejecuta. Así que cuando lo que vuelve desplegable a una herramienta
 * es un cambio en el propio sincronizador —una línea `poner` nueva—, la corrida más reciente
 * todavía corría el binario viejo y no pudo aplicarlo: el sha que de verdad se ejecutó es el
 * ANTERIOR. Medido el 2026-09-19: el sync de las 18:44 leyó `c4005cb2a` —que ya traía la
 * línea `poner` de `chatwoot-brand-onia.sh`— y en esa corrida sólo se actualizó a sí mismo.
 *
 * Sin esta distinción el gate grita «deriva» durante la hora que tarda en aplicarse, y manda
 * a copiar a producción a mano algo que se cura solo. Si el log no alcanza para saber cuál
 * fue la corrida anterior se usa la última: preferimos un rojo temprano a inventar una
 * corrida que no existió.
 */
export function shaQueElSincronizadorEjecuto ({ shas, elCambioTocaAlSincronizador }) {
  const l = (shas ?? []).filter(Boolean)
  if (l.length === 0) return null
  if (!elCambioTocaAlSincronizador) return l[l.length - 1]
  return l.length >= 2 ? l[l.length - 2] : l[l.length - 1]
}

/**
 * Una herramienta cableada puede diferir de su fuente por DOS motivos opuestos, y confundirlos
 * arruina el instrumento en las dos direcciones: o grita por algo que se cura solo, o calla una
 * deriva de verdad. `sincronizar.sh` copia desde `origin/main` una vez por hora (cron `:44`),
 * así que un arreglo que entra a `main` a las `:47` corre con el código viejo una hora entera
 * —medido el 2026-09-19: mi propio commit de `chatwoot-brand-onia.sh` se pushó tres minutos
 * tarde—. Eso no es deriva: es la ventana normal, y un gate que la reporta en rojo cada hora se
 * termina ignorando.
 *
 * Lo que separa una de la otra es si el sincronizador YA VIO el commit que cambió la fuente.
 * `esAncestro(commitDeLaFuente, shaDelUltimoSync)` lo contesta desde el grafo de git; `null`
 * es «no pude preguntar» y entonces NO se absuelve, que es el lado barato de equivocarse.
 */
export function esperaAlSincronizador ({ commitDeLaFuente, shaDelUltimoSync, esAncestro }) {
  if (!commitDeLaFuente || !shaDelUltimoSync) return false
  const visto = esAncestro(commitDeLaFuente, shaDelUltimoSync)
  if (visto == null) return false
  return visto === false
}

/** Los veredictos que hay que arreglar. `COPIA_A_MANO` es aviso: hoy corre lo correcto. */
export const ROJOS = new Set([
  'CABLEADA_EN_DERIVA',
  'CABLEADA_SIN_FUENTE',
  'EN_DERIVA_SIN_CABLE',
  'INSTALADOR_EN_DERIVA',
  'SIN_FUENTE',
])

export function clasificar (evidencias) {
  return evidencias.map(clasificarHerramienta)
}

// ─────────────────────────── medición viva ───────────────────────────

function ssh (comando) {
  try {
    return execFileSync('ssh', [...SSH_ARGS, VPS, comando], {
      encoding: 'utf8',
      timeout: 120_000,
      maxBuffer: 16 * 1024 * 1024,
    })
  } catch (e) {
    // La causa se conserva: un tri-estado que pierde el porqué vuelve irreproducible el
    // fallo, y NO_MEDIDO es justo el veredicto que se usa para NO molestar a nadie.
    const motivo = String(e?.stderr || e?.message || '').split('\n').filter(Boolean).pop()
    return { error: motivo || 'ssh sin explicación' }
  }
}

function md5 (buf) {
  return createHash('md5').update(buf).digest('hex')
}

/**
 * El veredicto de UNA herramienta de ESTA máquina, a partir de la evidencia ya recogida.
 *
 * Vive aparte de `clasificarHerramienta` porque los cables no son los mismos —acá una
 * herramienta puede nacer de un heredoc dentro de un instalador versionado, allá no— pero
 * es PURA por el mismo motivo que su hermana: mientras la decisión vivía metida dentro del
 * `.map` que lee el disco, sus dos caminos rojos (`INSTALADOR_EN_DERIVA` y `COPIA_A_MANO`)
 * no los podía provocar ningún caso, así que el self-check sólo probaba que el verde era
 * cierto —nunca que el rojo aparecería—. Un gate cuyo rojo nadie vio es un verde futuro.
 *
 * `md5Vivo == null` es «el cron la ejecuta y no está en disco», que acá SÍ es rojo del
 * bueno: cada corrida falla, y la que falta puede ser la que lanza los loops.
 */
export function clasificarEnEstaMaquina (ev) {
  const { nombre, ruta, maquina, md5Vivo, gemeloPorContenido, instalador, fuenteCableada, homonimo } = ev

  if (md5Vivo == null) {
    return { nombre, veredicto: 'SIN_FUENTE', detalle: `el cron la ejecuta y no existe en ${ruta}` }
  }

  if (gemeloPorContenido) {
    return { nombre, veredicto: 'CABLEADA', detalle: `idéntica a ${gemeloPorContenido}` }
  }

  if (instalador) {
    // Interpolado: existe cable versionado, pero el cuerpo lo arma la función con la llave y
    // el host del nodo, así que no hay nada que comparar byte a byte. Decir más sería
    // inventar una medición; decir menos lo volvería rojo por el motivo equivocado.
    if (!instalador.literal) {
      return {
        nombre,
        veredicto: 'CABLEADA_POR_INSTALADOR',
        detalle: `la escribe ${instalador.instalador} interpolando: versionada, pero su cuerpo no se puede comparar`,
      }
    }
    if (md5(Buffer.from(instalador.cuerpo)) === md5Vivo) {
      return { nombre, veredicto: 'CABLEADA', detalle: `byte a byte lo que escribe ${instalador.instalador}` }
    }
    return {
      nombre,
      veredicto: 'INSTALADOR_EN_DERIVA',
      detalle: `${instalador.instalador} escribe otra cosa que la que corre en ${ruta}`,
    }
  }

  if (fuenteCableada) {
    return { nombre, veredicto: 'CABLEADA_EN_DERIVA', detalle: `${fuenteCableada} no es lo que corre en ${ruta}` }
  }

  return {
    nombre,
    veredicto: homonimo ? 'EN_DERIVA_SIN_CABLE' : 'COPIA_A_MANO',
    detalle: homonimo
      ? `${homonimo} se llama igual y difiere: nadie sabe cuál es la buena`
      : `sólo existe en ${maquina}: un borrado se la lleva sin rastro`,
  }
}

/**
 * La SEGUNDA máquina: el nodo donde de verdad corren los loops.
 *
 * Devuelve `null` cuando esta máquina es el VPS —ahí el bloque de arriba ya la midió y
 * medirla dos veces contaría doble—. El universo sale del crontab LOCAL, por el mismo
 * motivo que el de arriba sale del crontab del VPS: manda quien EJECUTA.
 *
 * Los cables son DOS, no uno, y por eso no alcanzaba con reusar el bloque del VPS: acá la
 * herramienta puede venir del sincronizador (`poner`) o de un heredoc dentro de un
 * instalador versionado. Los instaladores se derivan del DISCO (`scripts/loops/*.sh`), no
 * de una lista escrita acá, que es como se cuelan los hermanos irregulares.
 */
function medirEstaMaquina ({ porMd5, porNombre, cableadas }) {
  let maquina
  try {
    maquina = readFileSync('/root/.onia-nodo', 'utf8').trim()
  } catch {
    return null
  }

  let crontab
  try {
    crontab = execFileSync('crontab', ['-l'], { encoding: 'utf8', timeout: 30_000 })
  } catch (e) {
    const motivo = String(e?.stderr || e?.message || '').split('\n').filter(Boolean).pop()
    return { maquina, medido: false, motivo: motivo || 'no pude leer el crontab local' }
  }

  const instaladores = new Map()
  for (const f of readdirSync(path.join(RAIZ, 'scripts/loops'))) {
    if (!f.endsWith('.sh')) continue
    const rel = `scripts/loops/${f}`
    let texto
    try {
      texto = readFileSync(path.join(RAIZ, rel), 'utf8')
    } catch {
      continue
    }
    for (const [nombre, dato] of herramientasQueEscribeElInstalador(texto, rel)) {
      if (!instaladores.has(nombre)) instaladores.set(nombre, dato)
    }
  }

  // Este `.map` sólo RECOGE del disco; quién gana lo decide `clasificarEnEstaMaquina`, que
  // es pura y por eso tiene un caso por camino —incluidos los dos rojos.
  const veredictos = herramientasQueElCronEjecuta(crontab).map((ruta) => {
    const nombre = ruta.split('/').pop()
    let vivo = null
    try {
      vivo = readFileSync(ruta)
    } catch {
      // Ausente en disco: la evidencia viaja como `md5Vivo: null`, no como veredicto.
    }
    const h = vivo == null ? null : md5(vivo)
    return clasificarEnEstaMaquina({
      nombre,
      ruta,
      maquina,
      md5Vivo: h,
      gemeloPorContenido: h == null ? null : porMd5.get(h) ?? null,
      instalador: instaladores.get(nombre) ?? null,
      fuenteCableada: cableadas.get(nombre) ?? null,
      homonimo: porNombre.get(nombre) ?? null,
    })
  })

  return { maquina, medido: true, veredictos }
}

/** Los shas de `main` que leyeron las corridas de `sincronizar.sh`, en orden. */
function shasSincronizados () {
  const log = ssh('tail -n 200 /var/log/onia-loops-sync.log 2>/dev/null')
  if (log?.error) return []
  return [...String(log).matchAll(/fuente:\s*origin\/main\s*\(([0-9a-f]{7,40})\)/g)].map((m) => m[1])
}

/**
 * El último commit que tocó CUALQUIERA de esas rutas. `null` si no se pudo preguntar.
 *
 * Son varias y no una porque una herramienta se vuelve «desplegable» por DOS caminos: que
 * cambie su fuente, o que cambie el CABLE que la copia. Medido el 2026-09-19 con
 * `chatwoot-brand-onia.sh`: su fuente estaba arreglada hacía 19 días —o sea el sync ya la
 * había visto mil veces— y lo que entró ayer fue la línea `poner` de `sincronizar.sh`.
 * Preguntando sólo por la fuente, ese caso sale «deriva» cuando en realidad está esperando
 * la corrida del `:44`, que es el veredicto opuesto y manda a tocar producción a mano.
 */
function ultimoCommitDe (...rutas) {
  const rs = rutas.filter(Boolean)
  if (rs.length === 0) return null
  try {
    const s = execFileSync('git', ['log', '-1', '--format=%H', '--', ...rs], {
      cwd: RAIZ,
      encoding: 'utf8',
    }).trim()
    return s || null
  } catch {
    return null
  }
}

/** Tri-estado: `null` es «no pude preguntarle al grafo», nunca «no es ancestro». */
function esAncestro (a, b) {
  try {
    execFileSync('git', ['merge-base', '--is-ancestor', a, b], {
      cwd: RAIZ,
      stdio: 'ignore',
      // Un clon parcial sale a buscar el objeto al remoto y la respuesta pasa a depender
      // de la red: con el remoto lento un sha legítimo se reporta como ausente.
      env: { ...process.env, GIT_NO_LAZY_FETCH: '1' },
    })
    return true
  } catch (e) {
    return e?.status === 1 ? false : null
  }
}

/** Índice del repo por CONTENIDO: encuentra el gemelo aunque se haya desplegado renombrado. */
function indiceDelRepo () {
  const archivos = execFileSync('git', ['ls-files', '-z'], { cwd: RAIZ, encoding: 'buffer' })
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
  const porMd5 = new Map()
  const porNombre = new Map()
  for (const rel of archivos) {
    let buf
    try {
      buf = readFileSync(path.join(RAIZ, rel))
    } catch {
      continue // worktree con sparse-checkout: el archivo está en git y no en disco
    }
    const h = md5(buf)
    if (!porMd5.has(h)) porMd5.set(h, rel)
    const base = rel.split('/').pop()
    if (!porNombre.has(base)) porNombre.set(base, rel)
  }
  return { porMd5, porNombre }
}

export const HERMANO = process.env.ONIA_PLATFORM_REPO ?? '/root/loops/onia-platform'

/**
 * El índice del repo HERMANO por contenido, leído de su ref PUBLICADA y fresca.
 *
 * `origin/master` es una ref de DISCO: vale lo que valía el último fetch, así que sin
 * fetchear se compara contra un fósil. Si no se puede refrescar NO se lee — devolver un
 * índice viejo haría declarar «sin fuente» a algo que el hermano versionó ayer.
 *
 * Se indexa por el sha1 de BLOB de git (no por md5) porque `ls-tree` ya lo trae: un solo
 * comando da el universo entero, sin leer un archivo por archivo.
 */
function indiceDelHermano () {
  try {
    execFileSync('git', ['fetch', '--quiet', 'origin'], {
      cwd: HERMANO,
      stdio: 'ignore',
      timeout: 120_000,
    })
  } catch (e) {
    return { medido: false, motivo: `no pude refrescar ${HERMANO}: ${String(e?.message ?? e).split('\n')[0]}` }
  }
  try {
    const salida = execFileSync('git', ['ls-tree', '-r', 'origin/master'], {
      cwd: HERMANO,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    })
    const porBlob = new Map()
    for (const linea of salida.split('\n')) {
      const m = linea.match(/^\d+ blob ([0-9a-f]{40})\t(.+)$/)
      if (m && !porBlob.has(m[1])) porBlob.set(m[1], m[2])
    }
    return { medido: true, porBlob }
  } catch (e) {
    return { medido: false, motivo: `no pude leer origin/master de ${HERMANO}: ${String(e?.message ?? e).split('\n')[0]}` }
  }
}

/** El sha1 con el que git identifica ESTE contenido, para cruzarlo contra `ls-tree`. */
export function shaDeBlob (contenido) {
  const buf = Buffer.from(contenido)
  return createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex')
}

function medir () {
  const crontab = ssh('crontab -l')
  if (crontab?.error) return { medido: false, motivo: `no pude leer el crontab del VPS: ${crontab.error}` }

  const vivas = herramientasQueElCronEjecuta(crontab)
  if (vivas.length === 0) return { medido: false, motivo: 'el crontab del VPS no nombra ninguna /root/bin/*' }

  const md5Vivos = ssh(
    'for f in ' + vivas.join(' ') + '; do if [ -e "$f" ]; then echo "$(md5sum "$f" | cut -c1-32) $f"; else echo "AUSENTE $f"; fi; done'
  )
  if (md5Vivos?.error) return { medido: false, motivo: `no pude leer las copias vivas: ${md5Vivos.error}` }

  const vivoPorRuta = new Map()
  for (const linea of md5Vivos.split('\n')) {
    const m = linea.trim().match(/^(\S+)\s+(\/root\/bin\/\S+)$/)
    if (m) vivoPorRuta.set(m[2], m[1] === 'AUSENTE' ? null : m[1])
  }

  const cableadas = cableadasEnElSincronizador(
    readFileSync(path.join(RAIZ, 'scripts/loops/sincronizar.sh'), 'utf8')
  )
  const { porMd5, porNombre } = indiceDelRepo()
  const shasDelSync = shasSincronizados()

  const evidencias = vivas.map((ruta) => {
    const nombre = ruta.split('/').pop()
    const h = vivoPorRuta.has(ruta) ? vivoPorRuta.get(ruta) : null
    const fuenteCableada = cableadas.get(nombre) ?? null
    let md5Fuente = null
    if (fuenteCableada) {
      try {
        md5Fuente = md5(readFileSync(path.join(RAIZ, fuenteCableada)))
      } catch {
        md5Fuente = null
      }
    }
    const gemelo = h ? porMd5.get(h) ?? null : null
    return {
      nombre,
      // La RUTA viaja aparte del nombre: con ejecutables anidados las dos dejaron de ser lo
      // mismo, y `/root/bin/<nombre>` ya no resuelve. Reconstruirla es lo que falla.
      ruta,
      md5: h,
      fuenteCableada,
      md5Fuente,
      gemeloPorContenido: gemelo,
      homonimo: gemelo ? null : porNombre.get(nombre) ?? null,
    }
  })

  // Segundo tiro, sólo para las que este repo no explica: se le pregunta al hermano. Se
  // baja el contenido de esas pocas —no de las 29— y se cruza por sha1 de blob.
  const huerfanas = evidencias.filter(
    (e) => e.md5 && !e.fuenteCableada && !e.gemeloPorContenido && !e.homonimo
  )
  if (huerfanas.length > 0) {
    const hermano = indiceDelHermano()
    for (const e of huerfanas) {
      if (!hermano.medido) {
        e.hermanoNoMedido = hermano.motivo
        continue
      }
      const contenido = ssh(`cat -- ${e.ruta}`)
      if (contenido?.error) {
        e.hermanoNoMedido = `no pude bajar la copia viva: ${contenido.error}`
        continue
      }
      e.gemeloEnElHermano = hermano.porBlob.get(shaDeBlob(contenido)) ?? null
    }
  }

  const veredictos = clasificar(evidencias).map((v) => {
    if (v.veredicto !== 'CABLEADA_EN_DERIVA') return v
    const fuente = cableadas.get(v.nombre)
    const SINC = 'scripts/loops/sincronizar.sh'
    const decisivo = ultimoCommitDe(fuente, SINC)
    const shaDelUltimoSync = shaQueElSincronizadorEjecuto({
      shas: shasDelSync,
      elCambioTocaAlSincronizador: decisivo != null && decisivo === ultimoCommitDe(SINC),
    })
    const pendiente = esperaAlSincronizador({ commitDeLaFuente: decisivo, shaDelUltimoSync, esAncestro })
    return pendiente
      ? {
          nombre: v.nombre,
          veredicto: 'ESPERANDO_SYNC',
          detalle: `${fuente} cambió después del último sync (${shaDelUltimoSync}); entra en la corrida del :44`,
        }
      : v
  })
  return {
    medido: true,
    veredictos,
    estaMaquina: medirEstaMaquina({ porMd5, porNombre, cableadas }),
  }
}

function informar () {
  const r = medir()
  if (!r.medido) {
    console.log(`NO MEDIDO: ${r.motivo}`)
    return 2
  }
  const porVeredicto = new Map()
  for (const v of r.veredictos) {
    if (!porVeredicto.has(v.veredicto)) porVeredicto.set(v.veredicto, [])
    porVeredicto.get(v.veredicto).push(v)
  }
  const noMedidos = porVeredicto.get('NO_MEDIDO') ?? []
  const rojos = r.veredictos.filter((v) => ROJOS.has(v.veredicto))
  const amarillos = [
    ...(porVeredicto.get('COPIA_A_MANO') ?? []),
    ...(porVeredicto.get('ESPERANDO_SYNC') ?? []),
    ...(porVeredicto.get('VERSIONADA_EN_EL_HERMANO') ?? []),
  ]
  const verdes = porVeredicto.get('CABLEADA') ?? []

  console.log(
    `herramientas que el cron del VPS ejecuta: ${r.veredictos.length} — ` +
      `cableadas y al día ${verdes.length} · copia a mano ${amarillos.length} · ` +
      `a arreglar ${rojos.length} · no medidas ${noMedidos.length}`
  )
  for (const v of [...rojos].sort((a, b) => a.nombre.localeCompare(b.nombre))) {
    console.log(`  🔴 ${v.veredicto.padEnd(20)} ${v.nombre} — ${v.detalle}`)
  }
  for (const v of amarillos.sort((a, b) => a.nombre.localeCompare(b.nombre))) {
    console.log(`  🟡 ${v.veredicto.padEnd(20)} ${v.nombre} — ${v.detalle}`)
  }
  for (const v of noMedidos) console.log(`  ·  NO MEDIDO ${v.nombre} — ${v.detalle}`)

  // La segunda máquina se informa en su PROPIA línea, nunca sumada a la de arriba: un solo
  // total que mezcla dos crontabs no deja ver cuál de los dos se quedó sin medir, y el que
  // se quedaba sin medir era justo el que lanza los cuatro loops.
  const rojosLocales = []
  const m = r.estaMaquina
  if (m && !m.medido) {
    console.log(`herramientas que el cron de ${m.maquina} ejecuta: NO MEDIDO — ${m.motivo}`)
  } else if (m) {
    const verdesL = m.veredictos.filter((v) => v.veredicto === 'CABLEADA')
    const instaladas = m.veredictos.filter((v) => v.veredicto === 'CABLEADA_POR_INSTALADOR')
    rojosLocales.push(...m.veredictos.filter((v) => ROJOS.has(v.veredicto)))
    const amarillosL = m.veredictos.filter(
      (v) => !ROJOS.has(v.veredicto) && v.veredicto !== 'CABLEADA' && v.veredicto !== 'CABLEADA_POR_INSTALADOR'
    )
    console.log(
      `herramientas que el cron de ${m.maquina} ejecuta: ${m.veredictos.length} — ` +
        `cableadas y al día ${verdesL.length} · las escribe un instalador ${instaladas.length} · ` +
        `copia a mano ${amarillosL.length} · a arreglar ${rojosLocales.length}`
    )
    for (const v of [...rojosLocales].sort((a, b) => a.nombre.localeCompare(b.nombre))) {
      console.log(`  🔴 ${v.veredicto.padEnd(24)} ${v.nombre} — ${v.detalle}`)
    }
    for (const v of amarillosL.sort((a, b) => a.nombre.localeCompare(b.nombre))) {
      console.log(`  🟡 ${v.veredicto.padEnd(24)} ${v.nombre} — ${v.detalle}`)
    }
    for (const v of instaladas.sort((a, b) => a.nombre.localeCompare(b.nombre))) {
      console.log(`  ·  ${v.veredicto.padEnd(24)} ${v.nombre} — ${v.detalle}`)
    }
  }

  if (noMedidos.length > 0) return 2
  return rojos.length + rojosLocales.length > 0 ? 1 : 0
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  process.exit(informar())
}

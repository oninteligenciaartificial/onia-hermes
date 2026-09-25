#!/usr/bin/env node
/**
 * frontera_sin_veredicto_congelado.mjs — el bloque que existe para DESMENTIR los «NO
 * desplegado» no puede AFIRMAR él mismo un estado de deploy.
 *
 *   node scripts/frontera_sin_veredicto_congelado.mjs              # mide las colas del disco
 *   node scripts/frontera_sin_veredicto_congelado.mjs --self-check # casos puros, sin leer colas
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * POR QUÉ EXISTE — el mismo error, tres veces, en las DOS direcciones
 *
 * `hermes-content/docs/cola/chatbot.md` tiene una sección llamada «ANTES DE CREERLE A UN
 * "NO desplegado" DE ESTE ARCHIVO». Es el bloque que cada vuelta lee ANTES de decidir si un
 * `- [x] … (commiteado, NO desplegado)` sigue siendo cierto. Su trabajo es mandar a derivar
 * el estado con un comando. Y tres veces se escribió a sí mismo un veredicto congelado:
 *
 *   1. 2026-09-24 — decía que el motor «sigue esperando la firma de un `DESPLEGAR: bot`».
 *      Sergio Urcullo firmó ese mismo día. Los ocho `- [x] … NO desplegado` de abajo se
 *      leyeron como presentes, y **el bloque que existe para desmentirlos los confirmaba**:
 *      mandaba a pedirle una firma QUE YA HABÍA DADO.
 *   2. 2026-09-25 — se corrigió poniendo `✅ **DESPLEGADO el 2026-09-25**`, con su medición
 *      al lado (`espejo-check.mjs` → exit 0). Correcto ese día.
 *   3. 2026-09-25, 5 h más tarde — dos commits nuevos del bot y el pedido `t_a464b8c0`
 *      esperando firma. Medido en vivo: `espejo-check.mjs` sale **1** (`followup-run.mjs` y
 *      `marcas-en-disco.mjs` distintos, dos tests sin viajar) y
 *      `bot_vivo_tiene_el_codigo.mjs` sale **1** (3 archivos viejos corriendo). El bloque
 *      seguía diciendo «DESPLEGADO entero» — ahora al REVÉS: hace dar por vivo un arreglo
 *      que no corre. Y los archivos desfasados son justo los del aviso de los leads
 *      colgados, o sea la parte del objetivo del carril que dice «cada handoff le llega a
 *      Sergio Urcullo».
 *
 * La viñeta del panel tenía el mismo defecto en la misma pasada: «**desplegado entero**,
 * producción corre `3986b807`». Medido hoy: producción corre `492e7155`.
 *
 * El propio bloque ya escribió la lección y no se la aplicó: *«Un encabezado congelado
 * envejece; un comando que se corre, no.»* Este gate es esa frase, ejecutable.
 *
 * ────────────────────────────────────────────────────────────────────────────────────────
 * QUÉ MIDE, y por qué el vocabulario es CERRADO
 *
 * Sujetos derivados del disco, nunca de una lista escrita a mano: de cada `.md` de
 * `hermes-content/docs/cola/`, la sección cuyo título contiene `ANTES DE CREERLE`, y dentro
 * de ella las viñetas de frontera de primer nivel (`- **Panel …**`, `- **Motor …**`).
 *
 * Sobre cada viñeta, dos preguntas:
 *   1. ¿AFIRMA un estado de deploy? → ROJO. Los cuatro patrones prohibidos no se
 *      adivinaron: los cuatro estaban presentes el 2026-09-25 y los cuatro eran falsos o
 *      caducaban solos. Un vocabulario abierto («cualquier negrita») pegaría también a la
 *      historia medida —«20 se referían al panel y las 20 estaban caducadas»— que es cierta
 *      y se conserva: *la historia del ítem es cierta, lo que caduca es su estado*.
 *   2. ¿nombra al menos un comando derivador? → si no, ROJO también. Prohibir el veredicto
 *      sin exigir la derivación deja una viñeta que no afirma nada y tampoco sirve.
 *
 * LO QUE NO ES VEREDICTO, y por eso se recorta ANTES de buscar:
 *   - el código entre backticks: ahí vive la LEYENDA del comando (`# 0 = corre lo del repo`),
 *     que es la derivación, no una afirmación sobre hoy;
 *   - lo citado entre «» o *«»*: es lo que el bloque decía ANTES, y se conserva a propósito
 *     («se corrigen CON su medición al lado, no se borran»). Sin este recorte el gate
 *     castigaría justo la corrección bien hecha, y se aprendería a saltearlo.
 *
 * FALLO CONSERVADOR. Una cola sin esa sección no es un hallazgo: se cuenta y se calla. Cero
 * viñetas encontradas en TODAS las colas sale 2 (NO MEDIDO), nunca 0: «ninguna miente» y «no
 * pude juzgar a ninguna» no pueden leerse igual — así sobrevivieron las 20 líneas caducadas
 * que su gate hermano (`deploy_ya_ocurrio.mjs`) existe para cazar.
 *
 * PURO A PROPÓSITO. No abre SSH ni docker: entra en la cadena `npm test`. La medición VIVA
 * del mismo hecho ya existe y es otra —`espejo-check.mjs` y `bot_vivo_tiene_el_codigo.mjs`—;
 * un gate de cadena que necesite el VPS da rojo por ambiente y se archiva como «el ambiental
 * de siempre».
 *
 * CÓDIGOS DE SALIDA
 *   0  ninguna viñeta de frontera afirma estado, y todas derivan  (dice sobre cuántas)
 *   1  al menos una afirma un veredicto congelado o no deriva     (las lista archivo:línea)
 *   2  no había ninguna viñeta que juzgar                         (NO MEDIDO)
 */

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const CARPETA = join(RAIZ, 'hermes-content', 'docs', 'cola');

/** Los cuatro veredictos medidos el 2026-09-25, cada uno con el caso que lo puso acá. */
export const VEREDICTOS = [
  { patron: /✅\s*\*\*\s*DESPLEGADO/iu, culpa: 'afirma "DESPLEGADO" con fecha (motor, 25-sep)' },
  { patron: /\*\*\s*desplegad[oa]s?\s+enter[oa]s?\s*\*\*/iu, culpa: 'afirma "desplegado entero" (panel, 24-sep)' },
  { patron: /→\s*\*\*\s*exit\s*\d/iu, culpa: 'afirma el exit de su propio derivador' },
  { patron: /producci[oó]n\s+corre\s+[0-9a-f]{7,}/iu, culpa: 'clava el sha que corre producción' },
];

/** Un comando derivador: `algo.mjs`, `npm run …` o `/root/bin/…`. */
const DERIVADOR = /(\.mjs\b|\bnpm run\b|\/root\/bin\/)/u;

/**
 * Lo que NO se juzga: la leyenda dentro de backticks y lo citado como pasado. Se reemplaza
 * por espacios y no se borra, para que los offsets —y con ellos el número de línea— no se
 * corran.
 */
export function textoJuzgable(vineta) {
  return String(vineta || '')
    .replace(/```[\s\S]*?```/gu, (m) => ' '.repeat(m.length))
    .replace(/`[^`]*`/gu, (m) => ' '.repeat(m.length))
    .replace(/\*«[\s\S]*?»\*/gu, (m) => ' '.repeat(m.length))
    .replace(/«[\s\S]*?»/gu, (m) => ' '.repeat(m.length));
}

/** El juicio de UNA viñeta. Función pura: es lo que prueba el --self-check. */
export function juzgarVineta(vineta) {
  const juzgable = textoJuzgable(vineta);
  const culpas = VEREDICTOS.filter(({ patron }) => patron.test(juzgable)).map(({ culpa }) => culpa);
  if (!DERIVADOR.test(vineta)) culpas.push('no nombra ningún comando para derivar el estado');
  return { ok: culpas.length === 0, culpas };
}

/** Las viñetas de frontera de un documento, con su línea. Derivación por FORMA. */
export function vinetasDeFrontera(texto) {
  const lineas = String(texto || '').split('\n');
  const vinetas = [];
  let dentro = false;

  for (let i = 0; i < lineas.length; i += 1) {
    const linea = lineas[i];
    const encabezado = /^#{1,6}\s+(.*)$/u.exec(linea);
    if (encabezado) {
      // Un encabezado de cualquier nivel cierra la sección: la de al lado no es frontera.
      dentro = /ANTES DE CREERLE/iu.test(encabezado[1]);
      continue;
    }
    if (!dentro) continue;

    const abre = /^-\s+\*\*(.+?)\*\*/u.exec(linea);
    if (!abre) continue;

    // El cuerpo de la viñeta son sus líneas indentadas, hasta la próxima viñeta o el fin.
    const cuerpo = [linea];
    for (let j = i + 1; j < lineas.length; j += 1) {
      if (/^\S/u.test(lineas[j]) && lineas[j].trim() !== '') break;
      if (/^-\s+\S/u.test(lineas[j])) break;
      cuerpo.push(lineas[j]);
    }
    vinetas.push({ frontera: abre[1].replace(/`/gu, '').trim(), linea: i + 1, texto: cuerpo.join('\n') });
  }
  return vinetas;
}

function colasDelDisco() {
  return readdirSync(CARPETA)
    .filter((n) => n.endsWith('.md'))
    .map((n) => join(CARPETA, n));
}

function medir() {
  const hallazgos = [];
  let juzgadas = 0;

  for (const ruta of colasDelDisco()) {
    const rel = ruta.slice(RAIZ.length + 1);
    for (const vineta of vinetasDeFrontera(readFileSync(ruta, 'utf8'))) {
      juzgadas += 1;
      const { ok, culpas } = juzgarVineta(vineta.texto);
      if (!ok) hallazgos.push({ rel, ...vineta, culpas });
    }
  }

  if (juzgadas === 0) {
    console.log('NO MEDIDO — ninguna cola tiene viñetas de frontera en un bloque "ANTES DE CREERLE".');
    console.log('  No es un verde: es que no había nada que juzgar. Si la sección existe, cambió de forma.');
    return 2;
  }

  if (hallazgos.length === 0) {
    console.log(`OK — ${juzgadas} viñeta(s) de frontera: ninguna afirma un estado de deploy, todas lo derivan.`);
    return 0;
  }

  console.log(`ROJO — ${hallazgos.length} de ${juzgadas} viñeta(s) de frontera afirman un estado que caduca solo:`);
  for (const h of hallazgos) {
    console.log(`  ${h.rel}:${h.linea}  [${h.frontera}]`);
    for (const culpa of h.culpas) console.log(`      · ${culpa}`);
  }
  console.log('');
  console.log('El estado de un deploy se DERIVA con su comando, no se escribe. La historia medida se');
  console.log('conserva citada («…»); el veredicto de hoy se saca. Ver la cabecera de este archivo.');
  return 1;
}

// --- self-check ---------------------------------------------------------------------------

function selfCheck() {
  const casos = [];
  const caso = (nombre, fn) => casos.push({ nombre, fn });
  const iguales = (a, b, msg) => {
    if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error(`${msg}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`);
  };

  // Los CUATRO veredictos reales del 2026-09-25, textuales.
  caso('motor: "✅ **DESPLEGADO el 2026-09-25**" es rojo', () => {
    const v = juzgarVineta('- **Motor (el bot)** — ✅ **DESPLEGADO el 2026-09-25**. Derivar: `espejo-check.mjs`.');
    if (v.ok) throw new Error('lo aprobó');
  });
  caso('panel: "**desplegado entero**" es rojo', () => {
    const v = juzgarVineta('- **Panel** — medido: **desplegado entero**. Derivar con `npm run deploy:ya-ocurrio`.');
    if (v.ok) throw new Error('lo aprobó');
  });
  caso('"→ **exit 0**" es rojo', () => {
    const v = juzgarVineta('- **Motor** — `espejo-check.mjs` → **exit 0**, o sea al día.');
    if (v.ok) throw new Error('lo aprobó');
  });
  caso('"producción corre 3986b807" es rojo', () => {
    const v = juzgarVineta('- **Panel** — producción corre 3986b807 hoy. Ver `npm run deploy:ya-ocurrio`.');
    if (v.ok) throw new Error('lo aprobó');
  });

  // Lo que NO puede dar rojo, o el gate castiga la corrección bien hecha.
  caso('la historia citada entre «» se conserva sin ser hallazgo', () => {
    const v = juzgarVineta('- **Motor** — acá decía *«✅ **DESPLEGADO el 2026-09-25**»* y caducó. Derivar: `espejo-check.mjs`.');
    iguales(v.culpas, [], 'la cita del pasado se juzgó como veredicto presente');
  });
  // La forma REAL en la que el documento escribe la leyenda es un bloque cercado; ahí el
  // `→ **exit 0**` describe el comando, no afirma el estado de hoy.
  caso('la leyenda dentro del bloque cercado no es veredicto', () => {
    const v = juzgarVineta(
      ['- **Motor** — el estado se deriva:', '', '      ```bash', '      espejo-check.mjs   # → **exit 0** = corre lo del repo', '      ```'].join('\n'),
    );
    iguales(v.culpas, [], 'la leyenda del comando se juzgó como afirmación');
  });
  // Y la misma frase SUELTA en prosa sí es un veredicto: es como se escribió el del 25-sep.
  caso('la misma leyenda suelta en prosa sí es rojo', () => {
    const v = juzgarVineta('- **Motor** — `espejo-check.mjs` → **exit 0** = corre lo del repo.');
    if (v.ok) throw new Error('lo aprobó');
  });
  caso('una viñeta que sólo deriva es verde', () => {
    const v = juzgarVineta('- **Motor (el bot)** — el estado se deriva, nunca se copia: `node scripts/bot_vivo_tiene_el_codigo.mjs`.');
    if (!v.ok) throw new Error(`la rechazó: ${v.culpas.join(' · ')}`);
  });

  // La segunda pregunta: prohibir el veredicto sin exigir derivación deja una viñeta inútil.
  caso('sin comando derivador es rojo aunque no afirme nada', () => {
    const v = juzgarVineta('- **Motor (el bot)** — son dos publicadores y dos firmas distintas.');
    iguales(v.culpas, ['no nombra ningún comando para derivar el estado'], 'motivo equivocado');
  });

  // Derivación de sujetos: la sección se abre y se CIERRA, y las viñetas de al lado no cuentan.
  caso('sólo se juzgan las viñetas de la sección ANTES DE CREERLE', () => {
    const doc = [
      '## 🔴 ANTES DE CREERLE A UN «NO desplegado»',
      '',
      '- **Motor (el bot)** — derivar con `espejo-check.mjs`.',
      '      sigue el cuerpo indentado de la misma viñeta.',
      '',
      '## Ahora',
      '',
      '- **Otra cosa** — esta viñeta no es de frontera y no se mide.',
    ].join('\n');
    const v = vinetasDeFrontera(doc);
    iguales(v.map((x) => x.frontera), ['Motor (el bot)'], 'el recorte de sección falló');
    iguales(v[0].linea, 3, 'la línea reportada no es la de la viñeta');
    if (!/cuerpo indentado/u.test(v[0].texto)) throw new Error('el cuerpo indentado quedó afuera de la viñeta');
  });
  caso('sin sección no hay sujetos (y eso es NO MEDIDO, no verde)', () => {
    iguales(vinetasDeFrontera('## Ahora\n\n- **Algo** — texto.').length, 0, 'inventó sujetos');
  });

  let fallaron = 0;
  for (const { nombre, fn } of casos) {
    try {
      fn();
      console.log(`  ✓ ${nombre}`);
    } catch (error) {
      fallaron += 1;
      console.log(`  ✗ ${nombre} — ${error.message}`);
    }
  }
  console.log(fallaron === 0 ? `SELF-CHECK OK — ${casos.length} casos.` : `SELF-CHECK ROJO — ${fallaron} de ${casos.length}.`);
  return fallaron === 0 ? 0 : 1;
}

process.exit(process.argv.includes('--self-check') ? selfCheck() : medir());

import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const PISO = 0.70;

const numero = (valor) => Number.isFinite(valor) ? valor.toFixed(3) : '—';
// Píxeles enteros hacia abajo: lo que se ve es <200 si y solo si el valor real es <200 (199,9 no se muestra como 200).
const pixeles = (valor) => Number.isFinite(valor) ? String(Math.floor(valor)) : '—';
const celda = (valor) => String(valor).replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');
const objeto = (valor) => valor !== null && typeof valor === 'object' && !Array.isArray(valor);

export function armarTabla(json) {
  for (const clave of ['images', 'scores']) {
    if (!objeto(json) || !Object.hasOwn(json, clave)) {
      throw new Error(`Falta la clave ${clave}`);
    }
    if (!objeto(json[clave])) throw new Error(`La clave ${clave} debe ser un objeto`);
  }

  const tests = [];
  const refs = [];
  const negativas = [];
  let bajos = 0;
  let sinCara = 0;

  for (const [nombre, imagen] of Object.entries(json.images)) {
    if (!objeto(imagen) || !['tests', 'refs', 'negatives'].includes(imagen.group)) {
      throw new Error(`La clave images.${nombre}.group debe ser tests, refs o negatives`);
    }
    const sinPuntaje = Object.hasOwn(imagen, 'error') || !Object.hasOwn(json.scores, nombre);
    const centroid = sinPuntaje ? undefined : json.scores[nombre]?.centroid;
    if (!sinPuntaje && !Number.isFinite(centroid)) {
      throw new Error(`La clave scores.${nombre}.centroid debe ser un número finito`);
    }
    const nota = Number.isFinite(imagen.face_px) && imagen.face_px < 200
      ? ' · cara < 200 px: poco confiable' : '';
    let veredicto = sinPuntaje ? 'SIN CARA' : centroid >= PISO ? 'OK' : 'BAJO';
    if (imagen.group === 'tests') {
      if (veredicto === 'BAJO') bajos++;
      if (veredicto === 'SIN CARA') sinCara++;
    } else if (imagen.group === 'negatives') {
      veredicto = sinPuntaje ? 'SIN CARA' : 'negativa (calibra el piso)';
    } else if (!sinPuntaje && centroid < PISO) {
      veredicto = 'ref bajo el piso';
    }
    const fila = `| ${celda(nombre)} | ${numero(centroid)} | ${pixeles(imagen.face_px)} | ${veredicto}${nota} |`;
    (imagen.group === 'tests' ? tests : imagen.group === 'negatives' ? negativas : refs).push(fila);
  }

  const encabezado = '| Imagen | Parecido (centroid) | Cara (px) | Veredicto |';
  const separador = '| --- | --- | --- | --- |';
  const markdown = [
    'Piso: 0,70 (FLUJO.md:28)',
    `refs_internal.leave_one_out_min: ${numero(json.refs_internal?.leave_one_out_min)}`,
    `negatives_max: ${json.negatives_max === null ? 'sin negativas' : numero(json.negatives_max)}`,
    '',
    '### Tests',
    '',
    encabezado, separador, ...tests,
    '',
    '### Referencias (informativas; centroid leave-one-out)',
    '',
    encabezado, separador, ...refs,
    '',
    ...(negativas.length ? ['### Negativas (caras de otras personas que calibran el piso; informativas)', '', encabezado, separador, ...negativas, ''] : []),
    `${tests.length} tests · ${bajos} bajo el piso · ${sinCara} sin cara`,
    '',
  ].join('\n');
  return { markdown, codigo: bajos || sinCara ? 1 : 0 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const archivo = process.argv[2];
    const entrada = readFileSync(!archivo || archivo === '-' ? 0 : archivo, 'utf8');
    let json;
    try {
      json = JSON.parse(entrada);
    } catch {
      throw new Error('JSON inválido');
    }
    const { markdown, codigo } = armarTabla(json);
    process.stdout.write(markdown);
    process.exitCode = codigo;
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 2;
  }
}

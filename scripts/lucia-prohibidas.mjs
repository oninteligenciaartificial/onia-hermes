export const PROHIBIDAS = [
  { frase: 'soy odontóloga', fuente: 'LUCIA.md §0; LUCIA_COMO_SE_USA §6' },
  { frase: 'hoy soy odontóloga', fuente: 'LUCIA.md §0; LUCIA_COMO_SE_USA §6' },
  { frase: 'como odontóloga', fuente: 'LUCIA.md §0; LUCIA_COMO_SE_USA §6' },
  { frase: 'soy doctora', fuente: 'LUCIA.md §0' },
  { frase: 'mis pacientes', variantes: ['mi paciente'], fuente: 'LUCIA.md §0; LUCIA_COMO_SE_USA §6' },
  { frase: 'mi consultorio', variantes: ['mis consultorios'], fuente: 'LUCIA.md §0; LUCIA_COMO_SE_USA §6' },
  { frase: 'mi estudio', variantes: ['mis estudios'], fuente: 'LUCIA.md §0' },
  { frase: 'testimonio', fuente: 'LUCIA.md §0; LUCIA_COMO_SE_USA §6' },
  { frase: 'agenda llena', variantes: ['agendas llenas'], fuente: 'LUCIA.md §0' },
  { frase: 'muy pronto', fuente: 'CLAUDE.md, La venta nunca exhibe obra' },
  { frase: 'en construcción', variantes: ['en construcciones'], fuente: 'CLAUDE.md, La venta nunca exhibe obra' },
  { frase: 'beta', fuente: 'CLAUDE.md, La venta nunca exhibe obra' },
  { frase: 'próximamente', fuente: 'CLAUDE.md, La venta nunca exhibe obra' },
];

import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const normalizar = texto => texto.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const escapar = texto => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const patrones = PROHIBIDAS.map(regla => {
  const formas = [regla.frase, ...(regla.variantes ?? [])].map(forma => {
    const palabras = normalizar(forma).split(' ').map(escapar);
    // Plurales regulares de las palabras finales, sin ampliar adverbios.
    if (/^(odontologa|doctora|testimonio|beta)$/.test(palabras.at(-1))) palabras[palabras.length - 1] += 's?';
    return palabras.join('[ \\t]+');
  });
  return { ...regla, patron: new RegExp(`(?<![\\p{L}\\p{N}_])(?:${formas.join('|')})(?![\\p{L}\\p{N}_])`, 'gu') };
});

export function escanear(texto, nombre) {
  const coincidencias = [];
  texto.split(/\r\n|\n|\r/).forEach((contenido, indice) => {
    const candidatos = [];
    const linea = normalizar(contenido);
    for (const { frase, fuente, patron } of patrones) {
      for (const match of linea.matchAll(patron)) candidatos.push({ inicio: match.index, fin: match.index + match[0].length, frase, fuente });
    }
    candidatos.sort((a, b) => a.inicio - b.inicio || b.fin - a.fin);
    let finAnterior = -1;
    for (const candidato of candidatos) {
      if (candidato.inicio < finAnterior) continue;
      finAnterior = candidato.fin;
      coincidencias.push({ archivo: nombre, linea: indice + 1, frase: candidato.frase, fuente: candidato.fuente, texto: contenido.trim().slice(0, 160) });
    }
  });
  return coincidencias;
}

export async function ejecutar(argumentos, { cwd = process.cwd(), imprimir = console.log } = {}) {
  const explicito = argumentos.length > 0;
  const raices = explicito ? argumentos : ['hermes-content/docs/cola/lucia-diario'];
  const coincidencias = [], omitidos = [], errores = [], visitados = new Set();
  async function recorrer(nombre) {
    if (['.git', 'node_modules'].includes(path.basename(nombre))) return;
    const absoluto = path.resolve(cwd, nombre);
    if (visitados.has(absoluto)) return;
    visitados.add(absoluto);
    try {
      const info = await stat(absoluto);
      if (info.isDirectory()) {
        const entradas = await readdir(absoluto, { withFileTypes: true });
        entradas.sort((a, b) => a.name.localeCompare(b.name));
        for (const entrada of entradas) {
          const hijo = path.join(nombre, entrada.name);
          if (entrada.isSymbolicLink()) omitidos.push(`${hijo}: enlace simbólico`);
          else await recorrer(hijo);
        }
        return;
      }
      if (!info.isFile() || !/\.(md|txt)$/i.test(nombre)) { omitidos.push(`${nombre}: extensión o tipo no admitido`); return; }
      if (info.size > 2 * 1024 * 1024) { omitidos.push(`${nombre}: supera 2 MB`); return; }
      const bytes = await readFile(absoluto);
      let contenido;
      try {
        contenido = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        if (contenido.includes('\0')) throw new Error('contenido binario');
      } catch { omitidos.push(`${nombre}: no es texto UTF-8`); return; }
      coincidencias.push(...escanear(contenido, nombre));
    } catch (error) {
      const detalle = `${nombre}: ${error.code ?? error.message}`;
      omitidos.push(detalle);
      if (explicito) errores.push(detalle);
    }
  }
  for (const raiz of raices) await recorrer(raiz);
  for (const c of coincidencias) imprimir(`${c.archivo}:${c.linea}: «${c.frase}» → ${c.texto}`);
  const porFrase = new Map(), porArchivo = new Map();
  for (const c of coincidencias) {
    porFrase.set(c.frase, (porFrase.get(c.frase) ?? 0) + 1);
    porArchivo.set(c.archivo, (porArchivo.get(c.archivo) ?? 0) + 1);
  }
  imprimir(`Resumen: ${coincidencias.length} coincidencias en ${porArchivo.size} archivos.`);
  imprimir('Por frase:');
  for (const [frase, cantidad] of porFrase) imprimir(`  «${frase}»: ${cantidad}`);
  imprimir('Por archivo:');
  for (const [archivo, cantidad] of porArchivo) imprimir(`  ${archivo}: ${cantidad}`);
  imprimir(`Omitidos: ${omitidos.length}`);
  for (const omitido of omitidos) imprimir(`  ${omitido}`);
  return errores.length ? 2 : explicito && coincidencias.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = await ejecutar(process.argv.slice(2));
}

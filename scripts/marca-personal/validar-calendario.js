#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const RAIZ = path.resolve(__dirname, '../..');
const CARPETA = 'hermes-content/docs/cola/plan-3-semanas';
const CALENDARIO = `${CARPETA}/ORDEN-DE-POSTEO-11-17-OCT.md`;
const COLUMNAS = ['Día', 'Hora', 'Pieza', 'Palabra', 'Estado', 'Falta para publicar'];
const limpio = texto => texto.replace(/\*/g, '').trim();
const celdas = linea => linea.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(limpio);

// null significa no verificable; false significa que el commit no existe.
function comprobarCommit(sha, raiz) {
  if (process.env.MARCA_CALENDARIO_SIN_GIT === '1') return null;
  try {
    execFileSync('git', ['cat-file', '-e', `${sha}^{commit}`], {
      cwd: raiz, stdio: 'pipe', windowsHide: true,
    });
    return true;
  } catch (error) {
    if (error.code || error.status !== 128) return null;
    // Un worktree inaccesible tampoco prueba que un SHA sea inexistente.
    if (!String(error.stderr).includes('Not a valid object name')) return null;
    return false;
  }
}

function leerAvisos(raiz) {
  const carpeta = path.resolve(raiz, CARPETA);
  return fs.readdirSync(carpeta).filter(nombre => /^AVISOS-COMUNIDAD-.*\.md$/.test(nombre))
    .sort().map(nombre => fs.readFileSync(path.join(carpeta, nombre), 'utf8')).join('\n');
}

function bloquesAvisos(texto) {
  const bloques = new Map();
  const encabezados = [...texto.matchAll(/^##[ \t]+([^\r\n]+)\r?$/gm)];
  encabezados.forEach((encabezado, i) => {
    const titulo = limpio(encabezado[1]);
    const palabra = titulo.split('·')[0].trim().toUpperCase();
    // Sin punto medio sólo vale un encabezado compuesto por la palabra.
    if (!titulo.includes('·') && /\s/.test(palabra)) return;
    const bloque = texto.slice(encabezado.index, encabezados[i + 1]?.index ?? texto.length);
    bloques.set(palabra, (bloques.get(palabra) || []).concat(bloque));
  });
  return bloques;
}

/** Devuelve { errores: string[], avisos: string[], codigo: 0|1, filas: number }. */
function validar(texto, opciones = {}) {
  const raiz = opciones.raiz ?? RAIZ;
  const existeCommit = opciones.existeCommit ?? (sha => comprobarCommit(sha, raiz));
  const existeArchivo = opciones.existeArchivo ?? (ruta => fs.existsSync(path.resolve(raiz, ruta)));
  const errores = [];
  const avisos = [];
  const resultado = filas => ({ errores, avisos, codigo: errores.length ? 1 : 0, filas });
  const lineas = texto.split(/\r?\n/);
  const seccion = lineas.findIndex(linea => /^##\s+Calendario\s*$/.test(limpio(linea)));
  if (seccion < 0) {
    errores.push('formato: renglón 1 · falta sección Calendario');
    return resultado(0);
  }
  let cabecera = seccion + 1;
  while (cabecera < lineas.length && !lineas[cabecera].trim()) cabecera++;
  const columnas = celdas(lineas[cabecera] ?? '');
  for (const columna of COLUMNAS) {
    if (!columnas.includes(columna)) errores.push(`formato: renglón ${cabecera + 1} · falta columna ${columna}`);
  }
  if (columnas.length !== COLUMNAS.length && !errores.length) {
    errores.push(`formato: renglón ${cabecera + 1} · se esperan 6 columnas`);
  }
  if (errores.length) return resultado(0);
  const filas = [];
  for (let i = cabecera + 1; i < lineas.length; i++) {
    const linea = lineas[i].trim();
    if (!linea) continue;
    if (!linea.startsWith('|')) break;
    const valores = celdas(linea);
    if (valores.every(valor => /^:?-{3,}:?$/.test(valor))) continue;
    if (valores.length !== columnas.length) {
      errores.push(`formato: renglón ${i + 1} · se esperan 6 columnas, hay ${valores.length}`);
      continue;
    }
    const fila = Object.fromEntries(columnas.map((columna, j) => [columna, valores[j]]));
    const dia = /^(Dom|Lun|Mar|Mié|Jue|Vie|Sáb) (\d{1,2})$/.exec(fila.Día);
    if (!dia || Number(dia[2]) < 1 || Number(dia[2]) > 31) {
      errores.push(`formato: renglón ${i + 1} · Día inválido: ${fila.Día}`);
      continue;
    }
    fila.fecha = Number(dia[2]);
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(fila.Hora)) {
      errores.push(`formato: renglón ${i + 1} · Hora debe ser HH:MM: ${fila.Hora}`);
      continue;
    }
    fila.carrusel = /^Carrusel/i.test(fila.Pieza);
    const horas = fila.carrusel ? ['16:00'] : ['12:30', '18:30'];
    if (!horas.includes(fila.Hora)) {
      errores.push(`hora fuera de los huecos fijos: ${fila.Pieza} (${fila.Día} ${fila.Hora}, renglón ${i + 1})`);
      continue;
    }
    const [hora, minuto] = fila.Hora.split(':').map(Number);
    const hhmm = extra => `${String(hora).padStart(2, '0')}:${String(minuto + extra).padStart(2, '0')}`;
    fila.redes = fila.carrusel
      ? [['Instagram', hhmm(0)], ['LinkedIn', hhmm(1)], ['TikTok', hhmm(2)]]
      : [['Instagram', hhmm(0)], ['TikTok', hhmm(5)], ['YouTube Shorts', hhmm(5)], ['LinkedIn', hhmm(5)]];
    filas.push(fila);
  }
  // La CLI puede distinguir errores de formato y detenerse antes de leer avisos.
  if (errores.some(error => error.startsWith('formato:'))) return resultado(filas.length);
  let bloques;
  try {
    bloques = bloquesAvisos(opciones.avisosTexto ?? leerAvisos(raiz));
  } catch (error) {
    errores.push(`lectura de avisos: ${error.message}`);
    return resultado(filas.length);
  }
  const ocupados = new Map();
  const cupos = new Map([['TikTok', 0], ['YouTube Shorts', 0], ['LinkedIn', 0]]);
  for (const fila of filas) {
    const estado = fila.Estado.toLowerCase();
    for (const [red, hora] of fila.redes) {
      const clave = `${red}/${fila.fecha}/${hora}`;
      for (const anterior of ocupados.get(clave) || []) {
        errores.push(`choque: ${red} ${fila.Día} ${hora} · ${anterior} y ${fila.Pieza}`);
      }
      ocupados.set(clave, (ocupados.get(clave) || []).concat(fila.Pieza));
      if (/^(agendada|master listo)/.test(estado) && cupos.has(red)) cupos.set(red, cupos.get(red) + 1);
    }
    if (/^(corte listo|borrador listo|master listo)/.test(estado) || estado === 'lista') {
      const citas = [...COLUMNAS.map(columna => fila[columna]).join(' ').matchAll(/`([^`]+)`/g)]
        .map(coincidencia => coincidencia[1]);
      const shas = citas.filter(cita => /^[a-f\d]{7,40}$/i.test(cita));
      const rutas = citas.filter(cita => cita.includes('/'));
      if (!shas.length) errores.push(`lista sin sha: ${fila.Pieza}`);
      if (!rutas.length) errores.push(`lista sin archivo: ${fila.Pieza}`);
      for (const sha of shas) {
        const existe = existeCommit(sha);
        if (existe === false) errores.push(`sha inexistente: ${sha}`);
        else if (existe !== true) avisos.push(`sha no verificable: ${sha}`);
      }
      for (const ruta of rutas) if (!existeArchivo(ruta)) errores.push(`archivo inexistente: ${ruta}`);
    }
    if (fila.Palabra !== '—') {
      const palabra = fila.Palabra.toUpperCase();
      const bloquesPalabra = bloques.get(palabra);
      if (!bloquesPalabra) {
        const destino = /^(agendada|corte listo|borrador listo|master listo)/.test(estado) || estado === 'lista' ? errores : avisos;
        destino.push(`palabra sin aviso: ${palabra} (${fila.Pieza})`);
      // El documento real usa también [CONFIRMAR el sáb 10: ...].
      } else if (bloquesPalabra.some(bloque => /\[CONFIRMAR(?:\]|\s)/.test(bloque))) {
        avisos.push(`aviso en borrador: ${palabra}`);
      }
    }
  }
  for (const [red, cantidad] of cupos) {
    const cupo = opciones.cupo ?? 10;
    if (cantidad > cupo) errores.push(`cupo: ${red} tiene ${cantidad} agendados (máx. ${cupo})`);
  }
  return resultado(filas.length);
}

if (require.main === module) {
  try {
    const ruta = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(RAIZ, CALENDARIO);
    const resultado = validar(fs.readFileSync(ruta, 'utf8'));
    for (const error of resultado.errores) console.log(`ERROR ${error}`);
    for (const aviso of resultado.avisos) console.log(`AVISO ${aviso}`);
    console.log(`${resultado.codigo ? 'ROJO' : 'VERDE'} · ${resultado.errores.length} errores · ${resultado.avisos.length} avisos · ${resultado.filas} filas`);
    process.exitCode = resultado.codigo;
  } catch (error) {
    console.log(`ERROR lectura de calendario: ${error.message}`);
    console.log('ROJO · 1 error');
    process.exitCode = 1;
  }
}

module.exports = { validar };

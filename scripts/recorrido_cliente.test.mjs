/**
 * Gates del instrumento del recorrido de cliente.
 *
 * POR QUÉ EXISTE: este carril no arregla el producto, sólo lo mide — así que cuando el
 * instrumento miente, el carril entero deja de servir sin ponerse rojo. Los dos casos de acá
 * son los dos falsos verdes que ya se pagaron:
 *
 *   1. La ruta de la evidencia apuntaba SIEMPRE a la carpeta de dental. Con otro rubro, el
 *      informe mandaba a un PNG que existe y es de otra pantalla (17 de 17 el 2026-09-04).
 *   2. Importar el archivo lanzaba el recorrido contra PRODUCCIÓN.
 *
 * Se corre con:  node --test scripts/recorrido_cliente.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';

import { rutaRelativa, pantallaDelDato } from './recorrido_cliente.mjs';

/** El menú REAL que el producto le muestra a "Servicios profesionales" (medido 2026-09-04). */
const MENU_SERVICIOS = [
  { texto: 'forum Conversaciones', ruta: '/inbox' },
  { texto: 'calendar_today Agenda de hoy', ruta: '/agenda' },
  { texto: 'event Citas', ruta: '/appointments' },
  { texto: 'work Servicios', ruta: '/comercio' },
  { texto: 'point_of_sale Caja', ruta: '/comercio/caja' },
  { texto: 'credit_score Por cobrar', ruta: '/comercio/fiados' },
  { texto: 'account_balance Contabilidad', ruta: '/contabilidad' },
];

const RAIZ = '/repo';
const BASE = join(RAIZ, 'hermes-content', 'docs', 'recorrido', 'capturas');

test('la evidencia de un rubro se reporta en LA CARPETA DE ESE RUBRO, no en la de dental', () => {
  // Es el caso que rompía: RECORRIDO_OUT apunta a la subcarpeta del rubro.
  const comercio = rutaRelativa(join(BASE, 'comercio'), 'paso-06-cargar-dato.png', RAIZ);

  assert.equal(
    comercio,
    'hermes-content/docs/recorrido/capturas/comercio/paso-06-cargar-dato.png',
    'la ruta reportada tiene que incluir la carpeta del rubro'
  );
  // El corazón del defecto: no basta con que la ruta exista, tiene que ser la del rubro medido.
  assert.ok(
    !/capturas\/paso-/.test(comercio),
    'la ruta NO puede caer en la carpeta de dental: ahí hay un PNG con el mismo nombre y la ' +
      'evidencia abre, se ve sana, y es de otra pantalla'
  );
});

test('el rubro por defecto (dental) sigue reportando su ruta de siempre', () => {
  assert.equal(
    rutaRelativa(BASE, 'paso-01-home.png', RAIZ),
    'hermes-content/docs/recorrido/capturas/paso-01-home.png'
  );
});

test('dos rubros distintos NUNCA reportan la misma ruta para el mismo paso', () => {
  const a = rutaRelativa(join(BASE, 'comercio'), 'paso-07-cita.png', RAIZ);
  const b = rutaRelativa(join(BASE, 'estetica'), 'paso-07-cita.png', RAIZ);
  assert.notEqual(a, b, 'si coinciden, un rubro está pisando la evidencia del otro en el informe');
});

test('en "Servicios profesionales" el dato se carga en Servicios, no se declara al producto roto', () => {
  const destino = pantallaDelDato(MENU_SERVICIOS, 'Servicios profesionales');

  // Antes daba null → paso 6 ROJO: "el menú no ofrece ninguna pantalla donde cargar un dato".
  // El producto estaba sano: su catálogo se llama "Servicios" y su FAB ofrece "Nuevo servicio".
  assert.ok(destino, 'sin destino el paso 6 acusa al producto de un hueco que no tiene');
  assert.equal(destino.ruta, '/comercio');
});

test('si el rubro SÍ tiene pantalla de clientes, esa gana sobre el catálogo', () => {
  // El día que el producto agregue Clientes a este pack, el recorrido tiene que ir ahí:
  // el patrón de servicios es la caída, no la preferencia.
  const conClientes = [{ texto: 'group Clientes', ruta: '/clients' }, ...MENU_SERVICIOS];
  assert.equal(pantallaDelDato(conClientes, 'Servicios profesionales').ruta, '/clients');
});

test('importar el instrumento NO dispara el recorrido contra producción', () => {
  // 🔴 En proceso propio el módulo ya está cacheado por el import de arriba, así que este caso
  // pasaría en falso. Tiene que correr en un proceso HIJO, con el import como única línea.
  const salida = execFileSync(
    process.execPath,
    ['--input-type=module', '-e', `await import('${new URL('./recorrido_cliente.mjs', import.meta.url).href}'); console.log('IMPORTADO_SIN_CORRER');`],
    { encoding: 'utf8', timeout: 60_000, stdio: ['ignore', 'pipe', 'pipe'] }
  );

  assert.match(salida, /IMPORTADO_SIN_CORRER/, 'el import tiene que devolver el control');
  assert.doesNotMatch(
    salida,
    /paso 01|Entrar a onia\.com\.bo/,
    'importar arrancó el recorrido: eso escribe en la base de PRODUCCIÓN'
  );
});
